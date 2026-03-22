import React from 'react';
import { useTranslation } from 'react-i18next';
import TranslationGroup from './TranslationGroup';
import { LANGUAGE_CONFIGS } from '../../../constants';
import { AppStatus, LanguageConfig, TranslationResult } from '../../../types';
import {
  EnabledModelMeta,
  getExpectedCountForLanguage,
  getExpectedTranslationCount,
  groupTranslationsByLanguage,
} from '../services/translationOrchestrator';

interface TranslationOutputPanelProps {
  status: AppStatus;
  translations: TranslationResult[];
  targetLanguages: string[];
  languageModels: Record<string, string[]>;
  enabledModels: EnabledModelMeta[];
}

export const TranslationOutputPanel: React.FC<TranslationOutputPanelProps> = ({
  status,
  translations,
  targetLanguages,
  languageModels,
  enabledModels,
}) => {
  const { t } = useTranslation();
  const groupedTranslations = groupTranslationsByLanguage(translations);
  const remainingSkeletonCount = Math.max(
    getExpectedTranslationCount(targetLanguages, languageModels, enabledModels) - translations.length,
    0,
  );

  return (
    <div className="flex flex-col w-full md:w-1/2 md:h-full bg-background p-3 sm:p-6 md:pl-4 md:overflow-y-auto">
      <div className="flex flex-col gap-3 sm:gap-4 pb-6 md:pb-20">
        {status === AppStatus.IDLE && translations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 sm:h-64 text-muted-foreground">
            <div className="size-12 sm:size-16 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">translate</span>
            </div>
            <p className="text-sm font-medium">{t('translation.output.emptyTitle')}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{t('translation.output.emptySubtitle')}</p>
          </div>
        )}

        {groupedTranslations.map((group) => (
          <TranslationGroup
            key={group.language}
            results={group.results}
            config={resolveLanguageConfig(group.language, group.results[0]?.code || '')}
            totalLanguages={groupedTranslations.length}
            expectedCount={getExpectedCountForLanguage(group.language, languageModels, enabledModels)}
          />
        ))}

        {status === AppStatus.LOADING && remainingSkeletonCount > 0 && (
          <>
            {Array.from({ length: remainingSkeletonCount }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-card rounded-xl p-3 sm:p-5 border border-border animate-pulse"
              >
                <div className="h-4 w-20 bg-muted rounded mb-3"></div>
                <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
                <div className="h-5 w-1/2 bg-muted rounded"></div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

function resolveLanguageConfig(languageName: string, languageCode: string): LanguageConfig {
  if (LANGUAGE_CONFIGS[languageName]) {
    return LANGUAGE_CONFIGS[languageName];
  }

  const fallbackConfig = Object.values(LANGUAGE_CONFIGS).find((config) => config.code === languageCode);

  if (fallbackConfig) {
    return fallbackConfig;
  }

  return {
    name: languageName,
    code: languageCode,
    color: '#64748b',
    bgColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  };
}
