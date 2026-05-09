import type { ProviderConfig, TranslationRequestPayload, TranslationResult } from '@/types';
import {
  buildTranslationTasks,
  sortTranslationResults,
  type EnabledModelMeta,
} from '@/features/translation/services/translationOrchestrator';
import { consumeTranslationStream } from '@/features/translation/services/translationStreamClient';

export interface ExecuteTranslationFlowParams {
  inputText: string;
  targetLanguages: string[];
  languageModels: Record<string, string[]>;
  activeModelKey: string;
  enabledModels: EnabledModelMeta[];
  providers: ProviderConfig[];
  onResult?: (results: TranslationResult[]) => void;
}

export async function executeTranslationFlow({
  inputText,
  targetLanguages,
  languageModels,
  activeModelKey,
  enabledModels,
  providers,
  onResult,
}: ExecuteTranslationFlowParams): Promise<TranslationResult[]> {
  const tasks = buildTranslationTasks(
    targetLanguages,
    languageModels,
    activeModelKey,
    enabledModels,
  );
  const collectedResults: TranslationResult[] = [];

  const emitProgress = (nextResult: TranslationResult) => {
    collectedResults.push(nextResult);
    const sortedResults = sortTranslationResults(
      collectedResults,
      targetLanguages,
      tasks,
      enabledModels,
    );
    onResult?.(sortedResults);
  };

  const payload: TranslationRequestPayload = {
    text: inputText,
    targetLanguages,
    languageModels,
    activeModelKey,
    providers,
  };

  await consumeTranslationStream({
    payload,
    onResult: emitProgress,
  });

  return sortTranslationResults(collectedResults, targetLanguages, tasks, enabledModels);
}
