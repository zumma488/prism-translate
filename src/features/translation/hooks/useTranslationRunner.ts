import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppStatus, TranslationResult } from '../../../types';
import { EnabledModelMeta } from '../services/translationOrchestrator';
import { executeTranslationFlow } from '../services/translationExecutionService';

interface UseTranslationRunnerParams {
  targetLanguages: string[];
  languageModels: Record<string, string[]>;
  activeModelKey: string;
  enabledModels: EnabledModelMeta[];
  hasActiveModel: boolean;
  onMissingModel: () => void;
  onError: (message: string) => void;
}

export function useTranslationRunner({
  targetLanguages,
  languageModels,
  activeModelKey,
  enabledModels,
  hasActiveModel,
  onMissingModel,
  onError,
}: UseTranslationRunnerParams) {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState<TranslationResult[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);

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

    try {
      await executeTranslationFlow({
        inputText,
        targetLanguages,
        languageModels,
        activeModelKey,
        enabledModels,
        onResult: setTranslations,
      });

      setStatus(AppStatus.SUCCESS);
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
    translations,
    translate,
  };
}
