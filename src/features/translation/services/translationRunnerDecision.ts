import { AppStatus, type TranslationTaskView } from '@/types';

export interface TargetLanguageChangeDecision {
  addedLanguages: string[];
  removedLanguages: string[];
  shouldIncrementalTranslate: boolean;
}

interface ResolveTargetLanguageChangeDecisionParams {
  nextLanguages: string[];
  previousLanguages: string[];
  inputText: string;
  lastSubmittedInputText: string;
  status: AppStatus;
  taskViews: TranslationTaskView[];
}

export function resolveTargetLanguageChangeDecision({
  nextLanguages,
  previousLanguages,
  inputText,
  lastSubmittedInputText,
  status,
  taskViews,
}: ResolveTargetLanguageChangeDecisionParams): TargetLanguageChangeDecision {
  const previousLanguageSet = new Set(previousLanguages);
  const nextLanguageSet = new Set(nextLanguages);
  const existingTaskLanguages = new Set(taskViews.map((taskView) => taskView.language));

  const addedLanguages = nextLanguages.filter((language) => !previousLanguageSet.has(language));
  const removedLanguages = previousLanguages.filter((language) => !nextLanguageSet.has(language));
  const hasExistingResults = taskViews.length > 0;
  const hasNewTaskLanguages = addedLanguages.some((language) => !existingTaskLanguages.has(language));
  const shouldIncrementalTranslate =
    addedLanguages.length > 0 &&
    hasNewTaskLanguages &&
    hasExistingResults &&
    status !== AppStatus.LOADING &&
    inputText.trim().length > 0 &&
    inputText === lastSubmittedInputText;

  return {
    addedLanguages,
    removedLanguages,
    shouldIncrementalTranslate,
  };
}
