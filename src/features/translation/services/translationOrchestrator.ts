import {
  ProviderConfig,
  TranslationResult,
  TranslationTaskView,
} from '../../../types';
import { getModelSelectionKey, normalizeProviders } from '@/services/modelIdentity';

export interface EnabledModelMeta {
  provider: ProviderConfig;
  modelId: string;
  modelName: string;
  uniqueId: string;
  providerName: string;
}

export interface TranslationTask {
  lang: string;
  modelKey: string;
}

export interface ResolvedTranslationTask extends TranslationTask {
  taskKey: string;
  modelId: string;
  modelName: string;
  provider: ProviderConfig;
  providerName: string;
}

export interface TranslationTaskResolution {
  tasks: TranslationTask[];
  missingLanguages: string[];
}

export interface ResolvedTranslationTaskSet {
  tasks: ResolvedTranslationTask[];
  missingLanguages: string[];
}

export function getEnabledModels(providers: ProviderConfig[]): EnabledModelMeta[] {
  const allModels: EnabledModelMeta[] = [];

  normalizeProviders(providers).forEach((provider) => {
    provider.models.forEach((model) => {
      if (model.enabled !== false) {
        allModels.push({
          provider,
          modelId: model.id,
          modelName: model.name,
          uniqueId: getModelSelectionKey(provider.id, model),
          providerName: provider.displayName,
        });
      }
    });
  });

  return allModels;
}

export function getActiveModelMeta(enabledModels: EnabledModelMeta[], activeModelKey: string) {
  return enabledModels.find((model) => model.uniqueId === activeModelKey) || enabledModels[0];
}

export function buildTranslationTasks(
  targetLanguages: string[],
  languageModels: Record<string, string[]>,
  activeModelKey: string,
  enabledModels: EnabledModelMeta[],
): TranslationTask[] {
  return resolveTranslationTaskSet(
    targetLanguages,
    languageModels,
    activeModelKey,
    enabledModels,
  ).tasks;
}

export function resolveTranslationTaskSet(
  targetLanguages: string[],
  languageModels: Record<string, string[]>,
  activeModelKey: string,
  enabledModels: EnabledModelMeta[],
): TranslationTaskResolution {
  const tasks: TranslationTask[] = [];
  const missingLanguages: string[] = [];
  const enabledModelKeys = new Set(enabledModels.map((model) => model.uniqueId));
  const fallbackModelKey = enabledModelKeys.has(activeModelKey)
    ? activeModelKey
    : enabledModels[0]?.uniqueId;

  targetLanguages.forEach((lang) => {
    const configuredModelKeys = languageModels[lang] || [];
    const langModelKeys = configuredModelKeys.filter((modelKey) =>
      enabledModelKeys.has(modelKey),
    );

    if (langModelKeys.length > 0) {
      langModelKeys.forEach((modelKey) => tasks.push({ lang, modelKey }));
      return;
    }

    if (configuredModelKeys.length > 0) {
      missingLanguages.push(lang);
      return;
    }

    if (fallbackModelKey) {
      tasks.push({ lang, modelKey: fallbackModelKey });
      return;
    }

    missingLanguages.push(lang);
  });

  return {
    tasks,
    missingLanguages,
  };
}

export function resolveTranslationTasks(
  targetLanguages: string[],
  languageModels: Record<string, string[]>,
  activeModelKey: string,
  enabledModels: EnabledModelMeta[],
): ResolvedTranslationTask[] {
  return resolveResolvedTranslationTaskSet(
    targetLanguages,
    languageModels,
    activeModelKey,
    enabledModels,
  ).tasks;
}

export function resolveResolvedTranslationTaskSet(
  targetLanguages: string[],
  languageModels: Record<string, string[]>,
  activeModelKey: string,
  enabledModels: EnabledModelMeta[],
): ResolvedTranslationTaskSet {
  const taskSet = resolveTranslationTaskSet(
    targetLanguages,
    languageModels,
    activeModelKey,
    enabledModels,
  );

  return {
    tasks: taskSet.tasks.flatMap((task) => {
    const meta = enabledModels.find((model) => model.uniqueId === task.modelKey);
    if (!meta) {
      return [];
    }

    return [
      {
        ...task,
        taskKey: `${task.lang}:${task.modelKey}`,
        modelId: meta.modelId,
        modelName: meta.modelName,
        provider: meta.provider,
        providerName: meta.providerName,
      },
    ];
    }),
    missingLanguages: taskSet.missingLanguages,
  };
}

export function getExpectedTranslationCount(
  targetLanguages: string[],
  languageModels: Record<string, string[]>,
  enabledModels: EnabledModelMeta[],
) {
  return targetLanguages.reduce((total, lang) => {
    const langModels = languageModels[lang];

    if (langModels && langModels.length > 0) {
      const validCount = langModels.filter((key) => enabledModels.some((model) => model.uniqueId === key)).length;
      return total + (validCount || 1);
    }

    return total + 1;
  }, 0);
}

export function getExpectedCountForLanguage(
  language: string,
  languageModels: Record<string, string[]>,
  enabledModels: EnabledModelMeta[],
) {
  const langModels = languageModels[language];

  if (langModels && langModels.length > 0) {
    const validCount = langModels.filter((key) => enabledModels.some((model) => model.uniqueId === key)).length;
    return validCount || 1;
  }

  return 1;
}

export function sortTranslationResults(
  results: TranslationResult[],
  targetLanguages: string[],
  tasks: TranslationTask[],
  enabledModels: EnabledModelMeta[],
) {
  return [...results].sort((a, b) => {
    const langDiff = targetLanguages.indexOf(a.language) - targetLanguages.indexOf(b.language);
    if (langDiff !== 0) return langDiff;

    if (a.taskKey && b.taskKey) {
      const aTaskIndex = tasks.findIndex((task) => `${task.lang}:${task.modelKey}` === a.taskKey);
      const bTaskIndex = tasks.findIndex((task) => `${task.lang}:${task.modelKey}` === b.taskKey);

      if (aTaskIndex !== bTaskIndex) {
        if (aTaskIndex === -1) return 1;
        if (bTaskIndex === -1) return -1;
        return aTaskIndex - bTaskIndex;
      }
    }

    const aIdx = tasks.findIndex(
      (task) => task.lang === a.language && enabledModels.find((model) => model.uniqueId === task.modelKey)?.modelName === a.modelName,
    );
    const bIdx = tasks.findIndex(
      (task) => task.lang === b.language && enabledModels.find((model) => model.uniqueId === task.modelKey)?.modelName === b.modelName,
    );

    if (aIdx === -1 && bIdx === -1) {
      return 0;
    }

    if (aIdx === -1) {
      return 1;
    }

    if (bIdx === -1) {
      return -1;
    }

    return aIdx - bIdx;
  });
}

export function groupTranslationsByLanguage(translations: TranslationResult[]) {
  const grouped: { language: string; results: TranslationResult[] }[] = [];
  const seen = new Set<string>();

  translations.forEach((result) => {
    if (!seen.has(result.language)) {
      seen.add(result.language);
      grouped.push({
        language: result.language,
        results: translations.filter((item) => item.language === result.language),
      });
    }
  });

  return grouped;
}

export function buildInitialTaskViews(
  tasks: ResolvedTranslationTask[],
): TranslationTaskView[] {
  return tasks.map((task) => ({
    taskKey: task.taskKey,
    language: task.lang,
    modelKey: task.modelKey,
    modelName: task.modelName,
    providerName: task.providerName,
    status: 'pending',
    retryCount: 0,
  }));
}

export function buildMissingModelTaskView(language: string): TranslationTaskView {
  return {
    taskKey: `${language}:missing-model`,
    language,
    modelKey: '__missing_model__',
    modelName: '',
    providerName: '',
    status: 'error',
    retryCount: 0,
    errorCode: 'missing_model',
  };
}

export function buildTaskOrder(
  targetLanguages: string[],
  languageModels: Record<string, string[]>,
  activeModelKey: string,
  enabledModels: EnabledModelMeta[],
) {
  const resolvedTaskSet = resolveResolvedTranslationTaskSet(
    targetLanguages,
    languageModels,
    activeModelKey,
    enabledModels,
  );
  const tasksByLanguage = new Map<string, string[]>();

  resolvedTaskSet.tasks.forEach((task) => {
    const entries = tasksByLanguage.get(task.lang) || [];
    entries.push(task.taskKey);
    tasksByLanguage.set(task.lang, entries);
  });

  const missingLanguages = new Set(resolvedTaskSet.missingLanguages);

  return targetLanguages.flatMap((language) => {
    const taskKeys = tasksByLanguage.get(language) || [];

    if (missingLanguages.has(language)) {
      return [...taskKeys, `${language}:missing-model`];
    }

    return taskKeys;
  });
}

export function sortTaskViewsByOrder(
  taskViews: TranslationTaskView[],
  taskOrder: string[],
  targetLanguages: string[],
) {
  return [...taskViews].sort((a, b) => {
    const languageDiff = targetLanguages.indexOf(a.language) - targetLanguages.indexOf(b.language);

    if (languageDiff !== 0) {
      return languageDiff;
    }

    const aIndex = taskOrder.indexOf(a.taskKey);
    const bIndex = taskOrder.indexOf(b.taskKey);

    if (aIndex === -1 && bIndex === -1) {
      return a.taskKey.localeCompare(b.taskKey);
    }

    if (aIndex === -1) {
      return 1;
    }

    if (bIndex === -1) {
      return -1;
    }

    return aIndex - bIndex;
  });
}
