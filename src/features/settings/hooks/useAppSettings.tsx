import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppSettings } from '../../../types';
import {
  EMPTY_INITIAL_SETTINGS,
  loadPersistedSettings,
  normalizeActiveModelKey,
  persistSettings,
} from '../services/settingsPersistence';

interface AppSettingsContextValue {
  settings: AppSettings;
  settingsLoaded: boolean;
  saveSettings: (nextSettings: AppSettings) => void;
  selectActiveModel: (activeModelKey: string) => void;
  updateLanguageModels: (language: string, modelIds: string[]) => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
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
        console.error('Failed to save settings', error);
      }
    }

    void savePersistedSettings();
  }, [settings, settingsLoaded]);

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

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        settingsLoaded,
        saveSettings,
        selectActiveModel,
        updateLanguageModels,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }

  return context;
}
