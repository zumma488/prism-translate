import { useEffect, useRef, useState } from 'react';
import { AppSettings } from '../../../types';
import {
  EMPTY_INITIAL_SETTINGS,
  loadPersistedSettings,
  normalizeActiveModelKey,
  persistSettings,
} from '../services/settingsPersistence';

export function useAppSettings() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const settingsInitialized = useRef(false);
  const [settings, setSettings] = useState<AppSettings>(EMPTY_INITIAL_SETTINGS);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const loadedSettings = await loadPersistedSettings();
        if (!cancelled) {
          setSettings(loadedSettings);
        }
      } finally {
        if (!cancelled) {
          setSettingsLoaded(true);
        }
      }
    }

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    if (!settingsInitialized.current) {
      settingsInitialized.current = true;
      return;
    }

    async function savePersistedSettings() {
      try {
        await persistSettings(settings);
      } catch (error) {
        console.error('Failed to encrypt and save settings', error);
      }
    }

    void savePersistedSettings();
  }, [settings, settingsLoaded]);

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const saveSettings = (nextSettings: AppSettings) => {
    setSettings(normalizeActiveModelKey(nextSettings));
  };

  const selectActiveModel = (activeModelKey: string) => {
    setSettings((prev) => ({ ...prev, activeModelKey }));
  };

  const updateLanguageModels = (language: string, modelIds: string[]) => {
    setSettings((prev) => {
      const nextLanguageModels = { ...(prev.languageModels || {}) };

      if (modelIds.length > 0) {
        nextLanguageModels[language] = modelIds;
      } else {
        delete nextLanguageModels[language];
      }

      return {
        ...prev,
        languageModels: nextLanguageModels,
      };
    });
  };

  return {
    closeSettings,
    isSettingsOpen,
    settingsLoaded,
    openSettings,
    saveSettings,
    selectActiveModel,
    settings,
    updateLanguageModels,
  };
}
