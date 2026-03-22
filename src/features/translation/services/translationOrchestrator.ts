import { ProviderConfig, TranslationResult } from '../../../types';

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

export function getEnabledModels(providers: ProviderConfig[]): EnabledModelMeta[] {
  const allModels: EnabledModelMeta[] = [];

  providers.forEach((provider) => {
    provider.models.forEach((model) => {
      if (model.enabled !== false) {
        allModels.push({
          provider,
          modelId: model.id,
          modelName: model.name,
          uniqueId: `${provider.id}:${model.id}`,
          providerName: provider.name,
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
): TranslationTask[] {
  const tasks: TranslationTask[] = [];

  targetLanguages.forEach((lang) => {
    const langModelKeys = languageModels[lang];

    if (langModelKeys && langModelKeys.length > 0) {
      langModelKeys.forEach((modelKey) => tasks.push({ lang, modelKey }));
      return;
    }

    tasks.push({ lang, modelKey: activeModelKey });
  });

  return tasks;
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

    const aIdx = tasks.findIndex(
      (task) => task.lang === a.language && enabledModels.find((model) => model.uniqueId === task.modelKey)?.modelName === a.modelName,
    );
    const bIdx = tasks.findIndex(
      (task) => task.lang === b.language && enabledModels.find((model) => model.uniqueId === task.modelKey)?.modelName === b.modelName,
    );

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
