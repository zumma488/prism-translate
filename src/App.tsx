import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
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
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [targetLanguages, setTargetLanguages, hasLoadedPersistedLanguages] =
    usePersistedTargetLanguages();
  const {
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
  const {
    status,
    taskViews,
    translations,
    translate,
    handleTargetLanguagesChange,
  } = useTranslationRunner({
    targetLanguages: isReady ? targetLanguages : [],
    languageModels,
    activeModelKey: settings.activeModelKey,
    providers: settings.providers,
    enabledModels,
    executionMode: settings.executionMode,
    hasActiveModel: Boolean(currentModel),
    onMissingModel: () => router.push('/settings/providers/models'),
    onError: (message) => alert(message),
  });

  const handleLanguagesChange = (nextLanguages: string[]) => {
    const previousLanguages = targetLanguages;
    setTargetLanguages(nextLanguages);
    void handleTargetLanguagesChange(previousLanguages, nextLanguages, inputText);
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground md:overflow-hidden">
      <Header
        enabledModels={enabledModels}
        currentModel={isReady ? currentModel : undefined}
        activeModelKey={isReady ? settings.activeModelKey : ''}
        onModelSelect={selectActiveModel}
      />

      <main className="relative mx-auto w-full max-w-[1800px] flex-1 overflow-y-auto overflow-hidden md:overflow-hidden">
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
            onLanguagesChange={handleLanguagesChange}
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
            taskViews={taskViews}
            translations={translations}
            targetLanguages={targetLanguages}
            languageModels={languageModels}
            enabledModels={enabledModels}
          />
        </div>
        )}
      </main>
    </div>
  );
};

export default App;
