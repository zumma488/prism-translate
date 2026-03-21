import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import TranslationGroup from './components/TranslationGroup';
import TranslationInput from './components/TranslationInput';
import { translateText } from './services/llmService';
import { LANGUAGE_CONFIGS, DEFAULT_LANGUAGES } from './constants';
import { AppSettings, TranslationResult, AppStatus, ProviderConfig } from './types';
import { encrypt, decrypt, isEncrypted } from './services/crypto';

const STORAGE_KEY_V3 = 'ai-translator-settings-v3';
const STORAGE_KEY_V2 = 'ai-translator-settings-v2';

const EMPTY_INITIAL_SETTINGS: AppSettings = {
  activeModelKey: '',
  providers: [],
  languageModels: {}
};

// Migrate old languageModels format (Record<string, string>) to new (Record<string, string[]>)
function migrateLanguageModels(parsed: Record<string, unknown>) {
  if (parsed.languageModels && typeof parsed.languageModels === 'object') {
    const lm = parsed.languageModels as Record<string, unknown>;
    for (const [lang, val] of Object.entries(lm)) {
      if (typeof val === 'string') {
        lm[lang] = [val];
      }
    }
  }
}

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
        // Try v3 (encrypted) first
        const v3Data = localStorage.getItem(STORAGE_KEY_V3);
        if (v3Data) {
          if (isEncrypted(v3Data)) {
            try {
              const decrypted = await decrypt(v3Data);
              const parsed = JSON.parse(decrypted);
              migrateLanguageModels(parsed);
              setSettings(parsed);
            } catch (err) {
              console.error('Decryption failed, resetting settings:', err);
              // Corrupted data or key mismatch - clear it so we don't crash next time
              localStorage.removeItem(STORAGE_KEY_V3);
              setSettings(EMPTY_INITIAL_SETTINGS);
            }
          } else {
            // Fallback: v3 key exists but not encrypted (shouldn't happen)
            try {
              setSettings(JSON.parse(v3Data));
            } catch (e) {
              console.error('Failed to parse plaintext v3 settings', e);
              localStorage.removeItem(STORAGE_KEY_V3);
            }
          }
          setSettingsLoaded(true);
          return;
        }

        // Migrate from v2 (plaintext) to v3 (encrypted)
        const v2Data = localStorage.getItem(STORAGE_KEY_V2);
        if (v2Data) {
          try {
            const parsed = JSON.parse(v2Data);
            migrateLanguageModels(parsed);
            setSettings(parsed);
            // Encrypt and save to v3
            const encrypted = await encrypt(JSON.stringify(parsed));
            localStorage.setItem(STORAGE_KEY_V3, encrypted);
            // Remove old v2 key
            localStorage.removeItem(STORAGE_KEY_V2);
          } catch (e) {
            console.error('Failed to migrate v2 settings', e);
          }
        }
      } catch (e) {
        console.error('Failed to load encrypted settings', e);
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
        const encrypted = await encrypt(JSON.stringify(settings));
        localStorage.setItem(STORAGE_KEY_V3, encrypted);
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

  // Use a derived list of enabled models for the dropdown
  const getEnabledModels = () => {
    const allModels: { provider: ProviderConfig, modelId: string, modelName: string, uniqueId: string, providerName: string }[] = [];
    settings.providers.forEach(p => {
      p.models.forEach(m => {
        if (m.enabled !== false) {
          allModels.push({
            provider: p,
            modelId: m.id,
            modelName: m.name,
            uniqueId: `${p.id}:${m.id}`,
            providerName: p.name
          });
        }
      });
    });
    return allModels;
  };

  const activeModelMeta = () => {
    const all = getEnabledModels();
    return all.find(m => m.uniqueId === settings.activeModelKey) || all[0];
  };

  // Calculate the total expected translation count for skeleton display
  const getExpectedTranslationCount = () => {
    const allModels = getEnabledModels();
    return targetLanguages.reduce((total, lang) => {
      const langModels = settings.languageModels?.[lang];
      if (langModels && langModels.length > 0) {
        // Count only models that actually exist
        const validCount = langModels.filter(key => allModels.some(m => m.uniqueId === key)).length;
        return total + (validCount || 1); // Fallback to 1 if none valid
      }
      return total + 1; // Default model
    }, 0);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    if (!activeModelMeta()) {
      setIsSettingsOpen(true);
      return;
    }

    setStatus(AppStatus.LOADING);
    setTranslations([]); // Clear previous

    try {
      const allModels = getEnabledModels();

      // Build a flat list of (language, model) pairs
      const tasks: { lang: string; modelKey: string }[] = [];
      targetLanguages.forEach(lang => {
        const langModelKeys = settings.languageModels?.[lang];
        if (langModelKeys && langModelKeys.length > 0) {
          // Multi-model: one task per model
          langModelKeys.forEach(key => tasks.push({ lang, modelKey: key }));
        } else {
          // Single default model
          tasks.push({ lang, modelKey: settings.activeModelKey });
        }
      });

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
            setTranslations(prev => {
              const newResults = [...prev, enrichedResult];
              // Sort by language order, then by model order within same language
              return newResults.sort((a, b) => {
                const langDiff = targetLanguages.indexOf(a.language) - targetLanguages.indexOf(b.language);
                if (langDiff !== 0) return langDiff;
                // Within same language, sort by model key order in tasks
                const aIdx = tasks.findIndex(t => t.lang === a.language && allModels.find(m => m.uniqueId === t.modelKey)?.modelName === a.modelName);
                const bIdx = tasks.findIndex(t => t.lang === b.language && allModels.find(m => m.uniqueId === t.modelKey)?.modelName === b.modelName);
                return aIdx - bIdx;
              });
            });

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
          setTranslations(prev => {
            const newResults = [...prev, errorResult];
            return newResults.sort((a, b) =>
              targetLanguages.indexOf(a.language) - targetLanguages.indexOf(b.language)
            );
          });
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
    setSettings(newSettings);
    // Don't close setup immediately if no models? No, assume user knows.
    // Ensure active model is valid
    const all = [];
    newSettings.providers.forEach(p => p.models.forEach(m => {
      if (m.enabled !== false) all.push(`${p.id}:${m.id}`);
    }));

    if (!all.includes(newSettings.activeModelKey) && all.length > 0) {
      setSettings(s => ({ ...s, activeModelKey: all[0] }));
    }
  };

  const handleModelSelect = (uniqueId: string) => {
    setSettings(prev => ({ ...prev, activeModelKey: uniqueId }));
  };

  const handleLanguageModelChange = (lang: string, modelIds: string[]) => {
    setSettings(prev => {
      const newLanguageModels = { ...prev.languageModels };
      if (modelIds.length > 0) {
        newLanguageModels[lang] = modelIds;
      } else {
        delete newLanguageModels[lang];
      }
      return { ...prev, languageModels: newLanguageModels };
    });
  };

  const enabledModels = getEnabledModels();
  const currentModel = activeModelMeta();

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
            languageModels={settings.languageModels || {}}
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
                // Group translations by language, maintaining order
                const grouped: { language: string; results: typeof translations }[] = [];
                const seen = new Set<string>();
                translations.forEach(result => {
                  if (!seen.has(result.language)) {
                    seen.add(result.language);
                    grouped.push({
                      language: result.language,
                      results: translations.filter(r => r.language === result.language),
                    });
                  }
                });

                return grouped.map((group) => {
                  // Calculate expected count for this specific language
                  const langModels = settings.languageModels?.[group.language];
                  let expectedCount = 1; // Default

                  if (langModels && langModels.length > 0) {
                    // Count only models that actually exist
                    const validCount = langModels.filter(key =>
                      enabledModels.some(m => m.uniqueId === key)
                    ).length;
                    expectedCount = validCount || 1;
                  }

                  return (
                    <TranslationGroup
                      key={group.language}
                      results={group.results}
                      config={getLanguageConfig(group.language, group.results[0]?.code || '')}
                      totalLanguages={grouped.length}
                      expectedCount={expectedCount}
                    />
                  );
                });
              })()}

              {/* Placeholder skeletons for remaining translations */}
              {status === AppStatus.LOADING && (() => {
                const expectedCount = getExpectedTranslationCount();
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