import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import TranslationInput from './components/TranslationInput';
import { AppSettings } from './types';
import {
  getActiveModelMeta,
  getEnabledModels,
} from './features/translation/services/translationOrchestrator';
import { TranslationOutputPanel } from './features/translation/components/TranslationOutputPanel';
import { usePersistedTargetLanguages } from './features/translation/hooks/usePersistedTargetLanguages';
import { useTranslationRunner } from './features/translation/hooks/useTranslationRunner';
import {
  EMPTY_INITIAL_SETTINGS,
  loadPersistedSettings,
  normalizeActiveModelKey,
  persistSettings,
} from './features/settings/services/settingsPersistence';

const App: React.FC = () => {
  // Application State
  const [inputText, setInputText] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const settingsInitialized = useRef(false);
  const [targetLanguages, setTargetLanguages] = usePersistedTargetLanguages();

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

  const languageModels = settings.languageModels || {};
  const enabledModels = getEnabledModels(settings.providers);
  const currentModel = getActiveModelMeta(enabledModels, settings.activeModelKey);
  const { status, translations, translate } = useTranslationRunner({
    targetLanguages,
    languageModels,
    activeModelKey: settings.activeModelKey,
    enabledModels,
    hasActiveModel: Boolean(currentModel),
    onMissingModel: () => setIsSettingsOpen(true),
    onError: (message) => alert(message),
  });

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
            onTranslate={() => {
              void translate(inputText);
            }}
            status={status}
            availableModels={enabledModels}
            languageModels={languageModels}
            onLanguageModelChange={handleLanguageModelChange}
            defaultModelId={settings.activeModelKey}
          />

          <TranslationOutputPanel
            status={status}
            translations={translations}
            targetLanguages={targetLanguages}
            languageModels={languageModels}
            enabledModels={enabledModels}
          />
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
