import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppStatus,
  type ProviderConfig,
  type TranslationExecutionMode,
  type TranslationResult,
  type TranslationTaskView,
} from '@/types';
import type { EnabledModelMeta } from '@/features/translation/services/translationOrchestrator';
import {
  executeFullTranslationFlow,
  executeIncrementalTranslationFlow,
} from '@/features/translation/services/translationExecutionService';
import { resolveTargetLanguageChangeDecision } from '@/features/translation/services/translationRunnerDecision';

interface UseTranslationRunnerParams {
  targetLanguages: string[];
  languageModels: Record<string, string[]>;
  activeModelKey: string;
  providers: ProviderConfig[];
  enabledModels: EnabledModelMeta[];
  executionMode: TranslationExecutionMode;
  hasActiveModel: boolean;
  onMissingModel: () => void;
  onError: (message: string) => void;
}

export function useTranslationRunner({
  targetLanguages,
  languageModels,
  activeModelKey,
  providers,
  enabledModels,
  executionMode,
  hasActiveModel,
  onMissingModel,
  onError,
}: UseTranslationRunnerParams) {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState<TranslationResult[]>([]);
  const [taskViews, setTaskViews] = useState<TranslationTaskView[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [lastSubmittedInputText, setLastSubmittedInputText] = useState('');

  const translate = async (inputText: string) => {
    if (!inputText.trim()) {
      return;
    }

    if (!hasActiveModel) {
      onMissingModel();
      return;
    }

    setStatus(AppStatus.LOADING);
    setTranslations([]);
    setTaskViews([]);

    try {
      setLastSubmittedInputText(inputText);

      const result = await executeFullTranslationFlow({
        inputText,
        targetLanguages,
        languageModels,
        activeModelKey,
        providers,
        enabledModels,
        executionMode,
        onProgress: (nextTaskViews, nextResults) => {
          setTaskViews(nextTaskViews);
          setTranslations(nextResults);
        },
      });

      const hasErrors = result.taskViews.some((task) => task.status === 'error');
      setTaskViews(result.taskViews);
      setTranslations(result.results);
      setStatus(hasErrors ? AppStatus.ERROR : AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      onError(
        t('errors.translationFailed', {
          error: error instanceof Error ? error.message : t('errors.unknown'),
        }),
      );
    }
  };

  const handleTargetLanguagesChange = async (
    previousLanguages: string[],
    nextLanguages: string[],
    inputText: string,
  ) => {
    const decision = resolveTargetLanguageChangeDecision({
      previousLanguages,
      nextLanguages,
      inputText,
      lastSubmittedInputText,
      status,
      taskViews,
    });
    const nextTaskViews = taskViews.filter(
      (taskView) => !decision.removedLanguages.includes(taskView.language),
    );
    const nextTranslations = translations.filter(
      (translation) => !decision.removedLanguages.includes(translation.language),
    );

    if (decision.removedLanguages.length > 0) {
      setTaskViews(nextTaskViews);
      setTranslations(nextTranslations);
    }

    if (!decision.shouldIncrementalTranslate) {
      if (nextTaskViews.length === 0 && nextTranslations.length === 0) {
        setStatus(AppStatus.IDLE);
      }

      return;
    }

    setStatus(AppStatus.LOADING);

    try {
      setLastSubmittedInputText(inputText);

      const result = await executeIncrementalTranslationFlow({
        inputText,
        targetLanguages: nextLanguages,
        addedLanguages: decision.addedLanguages,
        languageModels,
        activeModelKey,
        providers,
        enabledModels,
        executionMode,
        existingTaskViews: nextTaskViews,
        existingResults: nextTranslations,
        onProgress: (nextTaskViews, nextResults) => {
          setTaskViews(nextTaskViews);
          setTranslations(nextResults);
        },
      });

      const hasErrors = result.taskViews.some((task) => task.status === 'error');
      setTaskViews(result.taskViews);
      setTranslations(result.results);
      setStatus(hasErrors ? AppStatus.ERROR : AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      onError(
        t('errors.translationFailed', {
          error: error instanceof Error ? error.message : t('errors.unknown'),
        }),
      );
    }
  };

  return {
    status,
    taskViews,
    translations,
    translate,
    handleTargetLanguagesChange,
  };
}
