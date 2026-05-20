import {
  ProviderConfig,
  SingleTranslationRequestPayload,
  TranslationExecutionMode,
  TranslationResult,
  TranslationTaskView,
} from '@/types';
import { resolveProviderExecutionMode } from '@/services/executionMode';
import { translateText } from '@/services/llmService';
import {
  buildInitialTaskViews,
  buildMissingModelTaskView,
  buildTaskOrder,
  resolveResolvedTranslationTaskSet,
  sortTaskViewsByOrder,
  sortTranslationResults,
  type EnabledModelMeta,
  type ResolvedTranslationTask,
} from '@/features/translation/services/translationOrchestrator';

const MAX_CONCURRENT_TRANSLATIONS = 3;
const MAX_RETRY_ATTEMPTS = 2;

function classifyBrowserDirectError(
  error: unknown,
): 'browser_direct_not_supported' | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const normalizedMessage = error.message.trim().toLowerCase();
  const isBrowserTransportFailure =
    error.name === 'TypeError' ||
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('networkerror') ||
    normalizedMessage.includes('load failed');

  return isBrowserTransportFailure ? 'browser_direct_not_supported' : null;
}

interface SharedExecutionParams {
  inputText: string;
  targetLanguages: string[];
  languageModels: Record<string, string[]>;
  activeModelKey: string;
  providers: ProviderConfig[];
  enabledModels: EnabledModelMeta[];
  executionMode: TranslationExecutionMode;
  tasksTargetLanguages: string[];
  existingTaskViews?: TranslationTaskView[];
  existingResults?: TranslationResult[];
  onProgress?: (taskViews: TranslationTaskView[], results: TranslationResult[]) => void;
}

export interface ExecuteFullTranslationFlowParams {
  inputText: string;
  targetLanguages: string[];
  languageModels: Record<string, string[]>;
  activeModelKey: string;
  providers: ProviderConfig[];
  enabledModels: EnabledModelMeta[];
  executionMode: TranslationExecutionMode;
  onProgress?: (taskViews: TranslationTaskView[], results: TranslationResult[]) => void;
}

export interface ExecuteIncrementalTranslationFlowParams
  extends Omit<SharedExecutionParams, 'tasksTargetLanguages'> {
  addedLanguages: string[];
}

function sortTaskViews(
  taskViews: TranslationTaskView[],
  taskOrder: string[],
  targetLanguages: string[],
): TranslationTaskView[] {
  return sortTaskViewsByOrder(taskViews, taskOrder, targetLanguages);
}

function resolveTaskExecutionMode(
  task: ResolvedTranslationTask,
  globalExecutionMode: TranslationExecutionMode,
) {
  return resolveProviderExecutionMode(task.provider, globalExecutionMode);
}

async function runBrowserDirectTask(task: ResolvedTranslationTask, inputText: string) {
  const results = await translateText({
    text: inputText,
    targetLanguages: [task.lang],
    provider: task.provider,
    modelId: task.modelId,
  });

  const result = results[0];
  if (!result) {
    throw new Error('Translation returned no result.');
  }

  return {
    ...result,
    taskKey: task.taskKey,
    modelName: task.modelName,
    providerName: task.providerName,
  } satisfies TranslationResult;
}

async function runServerProxyTask(task: ResolvedTranslationTask, inputText: string) {
  const payload: SingleTranslationRequestPayload = {
    text: inputText,
    targetLanguage: task.lang,
    provider: task.provider,
    modelId: task.modelId,
    modelName: task.modelName,
    providerName: task.providerName,
  };

  const response = await fetch('/api/translate/task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || 'Translation failed.');
  }

  return (await response.json()) as TranslationResult;
}

async function executeTask(
  task: ResolvedTranslationTask,
  inputText: string,
  executionMode: TranslationExecutionMode,
) {
  if (executionMode === 'server-proxy') {
    return runServerProxyTask(task, inputText);
  }

  return runBrowserDirectTask(task, inputText);
}

function mergeTaskViews(existingTaskViews: TranslationTaskView[], additions: TranslationTaskView[]) {
  const merged = new Map<string, TranslationTaskView>();

  existingTaskViews.forEach((taskView) => {
    merged.set(taskView.taskKey, taskView);
  });

  additions.forEach((taskView) => {
    merged.set(taskView.taskKey, taskView);
  });

  return Array.from(merged.values());
}

function mergeResults(existingResults: TranslationResult[], additions: TranslationResult[]) {
  const merged = new Map<string, TranslationResult>();

  existingResults.forEach((result) => {
    const key = result.taskKey ?? `${result.language}:${result.modelName ?? ''}:${result.providerName ?? ''}`;
    merged.set(key, result);
  });

  additions.forEach((result) => {
    const key = result.taskKey ?? `${result.language}:${result.modelName ?? ''}:${result.providerName ?? ''}`;
    merged.set(key, result);
  });

  return Array.from(merged.values());
}

async function executeTranslationFlow({
  inputText,
  targetLanguages,
  languageModels,
  activeModelKey,
  providers: _providers,
  enabledModels,
  executionMode,
  tasksTargetLanguages,
  existingTaskViews = [],
  existingResults = [],
  onProgress,
}: SharedExecutionParams): Promise<{
  results: TranslationResult[];
  taskViews: TranslationTaskView[];
}> {
  void _providers;
  const resolvedTaskSet = resolveResolvedTranslationTaskSet(
    tasksTargetLanguages,
    languageModels,
    activeModelKey,
    enabledModels,
  );
  const executionTasks = resolvedTaskSet.tasks;
  const taskOrder = buildTaskOrder(
    targetLanguages,
    languageModels,
    activeModelKey,
    enabledModels,
  );
  const pendingTaskViews = buildInitialTaskViews(executionTasks);
  const missingTaskViews = resolvedTaskSet.missingLanguages.map((language) =>
    buildMissingModelTaskView(language),
  );
  const taskViews = mergeTaskViews(existingTaskViews, [
    ...pendingTaskViews,
    ...missingTaskViews,
  ]);
  const collectedResults = [...existingResults];

  const sortResults = (results: TranslationResult[]) =>
    sortTranslationResults(
      results,
      targetLanguages,
      resolveResolvedTranslationTaskSet(
        targetLanguages,
        languageModels,
        activeModelKey,
        enabledModels,
      ).tasks,
      enabledModels,
    );

  const emitProgress = () => {
    onProgress?.(
      sortTaskViews(taskViews, taskOrder, targetLanguages),
      sortResults(collectedResults),
    );
  };

  const updateTaskView = (
    taskKey: string,
    updater: (taskView: TranslationTaskView) => TranslationTaskView,
  ) => {
    const index = taskViews.findIndex((taskView) => taskView.taskKey === taskKey);
    if (index === -1) {
      return;
    }

    taskViews[index] = updater(taskViews[index]);
    emitProgress();
  };

  let cursor = 0;

  const worker = async () => {
    while (cursor < executionTasks.length) {
      const task = executionTasks[cursor];
      cursor += 1;
      const taskExecutionMode = resolveTaskExecutionMode(task, executionMode);

      for (let attempt = 0; attempt <= MAX_RETRY_ATTEMPTS; attempt += 1) {
        const isRetry = attempt > 0;

        updateTaskView(task.taskKey, (current) => ({
          ...current,
          status: isRetry ? 'retrying' : 'running',
          retryCount: attempt,
          error: undefined,
          errorCode: undefined,
        }));

        try {
          const rawResult = await executeTask(task, inputText, taskExecutionMode);
          const result: TranslationResult = {
            ...rawResult,
            taskKey: task.taskKey,
            modelName: task.modelName,
            providerName: task.providerName,
          };

          const mergedResults = mergeResults(collectedResults, [result]);
          collectedResults.splice(0, collectedResults.length, ...mergedResults);
          updateTaskView(task.taskKey, (current) => ({
            ...current,
            status: 'success',
            result,
            error: undefined,
            retryCount: attempt,
          }));
          break;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const errorCode =
            taskExecutionMode === 'browser-direct'
              ? classifyBrowserDirectError(error)
              : null;

          if (errorCode) {
            updateTaskView(task.taskKey, (current) => ({
              ...current,
              status: 'error',
              errorCode,
              error: message,
              retryCount: attempt,
            }));
            break;
          }

          const isLastAttempt = attempt >= MAX_RETRY_ATTEMPTS;

          updateTaskView(task.taskKey, (current) => ({
            ...current,
            status: isLastAttempt ? 'error' : 'retrying',
            errorCode: undefined,
            error: message,
            retryCount: attempt + (isLastAttempt ? 0 : 1),
          }));

          if (isLastAttempt) {
            break;
          }
        }
      }
    }
  };

  emitProgress();

  const workerCount = Math.min(MAX_CONCURRENT_TRANSLATIONS, Math.max(executionTasks.length, 1));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return {
    results: sortResults(collectedResults),
    taskViews: sortTaskViews(taskViews, taskOrder, targetLanguages),
  };
}

export async function executeFullTranslationFlow(
  params: ExecuteFullTranslationFlowParams,
): Promise<{
  results: TranslationResult[];
  taskViews: TranslationTaskView[];
}> {
  return executeTranslationFlow({
    ...params,
    tasksTargetLanguages: params.targetLanguages,
  });
}

export async function executeIncrementalTranslationFlow(
  params: ExecuteIncrementalTranslationFlowParams,
): Promise<{
  results: TranslationResult[];
  taskViews: TranslationTaskView[];
}> {
  return executeTranslationFlow({
    ...params,
    tasksTargetLanguages: params.addedLanguages,
  });
}
