import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import TranslationGroup from './components/TranslationGroup';
import TranslationInput from './components/TranslationInput';
import { translateText } from './services/llmService';
import { LANGUAGE_CONFIGS, DEFAULT_LANGUAGES } from './constants';
import { AppSettings, TranslationResult, AppStatus } from './types';
import {
  buildTranslationTasks,
  getActiveModelMeta,
  getEnabledModels,
  getExpectedCountForLanguage,
  getExpectedTranslationCount,
  groupTranslationsByLanguage,
  sortTranslationResults,
} from './features/translation/services/translationOrchestrator';
import {
  EMPTY_INITIAL_SETTINGS,
  loadPersistedSettings,
  normalizeActiveModelKey,
  persistSettings,
} from './features/settings/services/settingsPersistence';

const App: React.FC = () => {
  const { t } = useTranslation();

  // Application State
  const [inputText, setInputText] = useState('');
  const [translations, setTranslations] = useState<TranslationResult[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const settingsInitialized = useRef(false);

  // Target Languages State (Persisted)
  const [targetLanguages, setTargetLanguages] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai-translator-target-languages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse target languages", e);
      }
    }
    return DEFAULT_LANGUAGES;
  });

  // Settings State (async encrypted persistence)
  const [settings, setSettings] = useState<AppSettings>(EMPTY_INITIAL_SETTINGS);

  // Async load encrypted settings on mount (with v2 → v3 migration)
  useEffect(() => {
    async function loadSettings() {
      try {
        const loadedSettings = await loadPersistedSettings();
        setSettings(loadedSettings);
      } finally {
        setSettingsLoaded(true);
      }
    }

    loadSettings();
  }, []);

  // Persist settings (encrypted) whenever they change
  useEffect(() => {
    // Skip the initial render and wait for settings to be loaded
    if (!settingsLoaded) return;
    if (!settingsInitialized.current) {
      settingsInitialized.current = true;
      return;
    }

    async function saveSettings() {
      try {
        await persistSettings(settings);
      } catch (e) {
        console.error('Failed to encrypt and save settings', e);
      }
    }
    saveSettings();
  }, [settings, settingsLoaded]);

  // Persist target languages
  useEffect(() => {
    localStorage.setItem('ai-translator-target-languages', JSON.stringify(targetLanguages));
  }, [targetLanguages]);

  const languageModels = settings.languageModels || {};

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    if (!activeModelMeta()) {
      setIsSettingsOpen(true);
      return;
    }

    setStatus(AppStatus.LOADING);
    setTranslations([]); // Clear previous

    try {
      const allModels = getEnabledModels(settings.providers);
      const tasks = buildTranslationTasks(targetLanguages, languageModels, settings.activeModelKey);

      // Create independent translation tasks
      const translationTasks = tasks.map(async ({ lang, modelKey }) => {
        const meta = allModels.find(m => m.uniqueId === modelKey);

        if (!meta) {
          console.warn(`Model not found for key: ${modelKey}, skipping language: ${lang}`);
          return null;
        }

        try {
          const results = await translateText({
            text: inputText,
            targetLanguages: [lang],
            provider: meta.provider,
            modelId: meta.modelId
          });

          const result = results[0];
          if (result) {
            const enrichedResult = {
              ...result,
              modelName: meta.modelName,
              providerName: meta.providerName || meta.provider.name
            };

            // Progressive update - append result immediately
            setTranslations((prev) => sortTranslationResults([...prev, enrichedResult], targetLanguages, tasks, allModels));

            return enrichedResult;
          }
        } catch (err) {
          console.error(`Translation failed for ${lang} with model ${modelKey}:`, err);
          const errorResult: TranslationResult = {
            language: lang,
            code: '',
            text: '',
            tone: '',
            confidence: 0,
            modelName: meta.modelName,
            providerName: meta.providerName || meta.provider.name,
            error: err instanceof Error ? err.message : String(err),
          };
          setTranslations((prev) => sortTranslationResults([...prev, errorResult], targetLanguages, tasks, allModels));
        }

        return null;
      });

      // Wait for all translations to settle
      await Promise.all(translationTasks);
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      alert(t('errors.translationFailed', { error: error instanceof Error ? error.message : t('errors.unknown') }));
    }
  };

  const getLanguageConfig = (langName: string, langCode: string) => {
    if (LANGUAGE_CONFIGS[langName]) return LANGUAGE_CONFIGS[langName];
    const found = Object.values(LANGUAGE_CONFIGS).find(c => c.code === langCode);
    if (found) return found;
    return {
      name: langName,
      code: langCode,
      color: '#64748b',
      bgColor: '#f1f5f9',
      borderColor: '#e2e8f0',
    };
  };

  const handleSettingsSave = (newSettings: AppSettings) => {
    setSettings(normalizeActiveModelKey(newSettings));
  };

  const handleModelSelect = (uniqueId: string) => {
    setSettings(prev => ({ ...prev, activeModelKey: uniqueId }));
  };

  const handleLanguageModelChange = (lang: string, modelIds: string[]) => {
    setSettings(prev => {
      const newLanguageModels = { ...(prev.languageModels || {}) };
      if (modelIds.length > 0) {
        newLanguageModels[lang] = modelIds;
      } else {
        delete newLanguageModels[lang];
      }
      return { ...prev, languageModels: newLanguageModels };
    });
  };

  const enabledModels = getEnabledModels(settings.providers);
  const currentModel = getActiveModelMeta(enabledModels, settings.activeModelKey);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden md:overflow-hidden">
      <Header
        enabledModels={enabledModels}
        currentModel={currentModel}
        activeModelKey={settings.activeModelKey}
        onModelSelect={handleModelSelect}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden md:overflow-hidden overflow-y-auto relative w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row h-auto md:h-full">

          {/* LEFT: Input Area */}
          <TranslationInput
            inputText={inputText}
            onInputChange={setInputText}
            targetLanguages={targetLanguages}
            onLanguagesChange={setTargetLanguages}
            onTranslate={handleTranslate}
            status={status}
            availableModels={enabledModels}
            languageModels={languageModels}
            onLanguageModelChange={handleLanguageModelChange}
            defaultModelId={settings.activeModelKey}
          />

          {/* RIGHT: Output Area */}
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

              {/* Group translations by language and render TranslationGroup */}
              {(() => {
                const grouped = groupTranslationsByLanguage(translations);

                return grouped.map((group) => (
                  <TranslationGroup
                    key={group.language}
                    results={group.results}
                    config={getLanguageConfig(group.language, group.results[0]?.code || '')}
                    totalLanguages={grouped.length}
                    expectedCount={getExpectedCountForLanguage(group.language, languageModels, enabledModels)}
                  />
                ));
              })()}

              {/* Placeholder skeletons for remaining translations */}
              {status === AppStatus.LOADING && (() => {
                const expectedCount = getExpectedTranslationCount(targetLanguages, languageModels, enabledModels);
                const remaining = expectedCount - translations.length;
                if (remaining <= 0) return null;
                return Array.from({ length: remaining }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="bg-card rounded-xl p-3 sm:p-5 border border-border animate-pulse">
                    <div className="h-4 w-20 bg-muted rounded mb-3"></div>
                    <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-5 w-1/2 bg-muted rounded"></div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={settings}
        onSave={handleSettingsSave}
      />
    </div>
  );
};

export default App;