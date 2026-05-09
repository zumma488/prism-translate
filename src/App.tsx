import React, { useState } from 'react';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import TranslationInput from './components/TranslationInput';
import { useAppSettings } from './features/settings/hooks/useAppSettings';
import { TranslationOutputPanel } from './features/translation/components/TranslationOutputPanel';
import { usePersistedTargetLanguages } from './features/translation/hooks/usePersistedTargetLanguages';
import { useTranslationRunner } from './features/translation/hooks/useTranslationRunner';
import {
  getActiveModelMeta,
  getEnabledModels,
} from './features/translation/services/translationOrchestrator';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [targetLanguages, setTargetLanguages, hasLoadedPersistedLanguages] =
    usePersistedTargetLanguages();
  const {
    closeSettings,
    isSettingsOpen,
    openSettings,
    saveSettings,
    selectActiveModel,
    settings,
    settingsLoaded,
    updateLanguageModels,
  } = useAppSettings();

  const languageModels = settings.languageModels || {};
  const enabledModels = getEnabledModels(settings.providers);
  const currentModel = getActiveModelMeta(
    enabledModels,
    settings.activeModelKey,
  );
  const isReady = settingsLoaded && hasLoadedPersistedLanguages;
  const { status, translations, translate } = useTranslationRunner({
    targetLanguages: isReady ? targetLanguages : [],
    languageModels,
    activeModelKey: settings.activeModelKey,
    enabledModels,
    providers: settings.providers,
    hasActiveModel: Boolean(currentModel),
    onMissingModel: openSettings,
    onError: (message) => alert(message),
  });

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden md:overflow-hidden">
      <Header
        enabledModels={enabledModels}
        currentModel={isReady ? currentModel : undefined}
        activeModelKey={isReady ? settings.activeModelKey : ''}
        onModelSelect={selectActiveModel}
        onOpenSettings={openSettings}
      />

      <main className="flex-1 overflow-hidden md:overflow-hidden overflow-y-auto relative w-full max-w-[1800px] mx-auto">
        {!isReady ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
        <div className="flex flex-col md:flex-row h-auto md:h-full">
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
            onLanguageModelChange={updateLanguageModels}
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
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        currentSettings={settings}
        onSave={saveSettings}
      />
    </div>
  );
};

export default App;
