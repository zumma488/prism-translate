import type { AppSettings } from '@/types';
import { validateProviders } from '@/services/providerConfigValidation';

export const SETTINGS_STORAGE_KEY_V5 = 'ai-translator-settings-v5';
export const SETTINGS_STORAGE_KEY_V6 = 'ai-translator-settings-v6';
export const SETTINGS_STORAGE_KEY_V4 = 'ai-translator-settings-v4';
export const SETTINGS_STORAGE_KEY_V3 = 'ai-translator-settings-v3';
export const SETTINGS_STORAGE_KEY_V2 = 'ai-translator-settings-v2';

export const EMPTY_INITIAL_SETTINGS: AppSettings = {
  activeModelKey: '',
  providers: [],
  languageModels: {},
};

export function migrateLanguageModels(parsed: Record<string, unknown>) {
  if (parsed.languageModels && typeof parsed.languageModels === 'object') {
    const languageModels = parsed.languageModels as Record<string, unknown>;

    for (const [lang, value] of Object.entries(languageModels)) {
      if (typeof value === 'string') {
        languageModels[lang] = [value];
      }
    }
  }
}

function parseStoredSettings(raw: string): AppSettings | null {
  const parsed = JSON.parse(raw) as AppSettings;
  migrateLanguageModels(parsed as unknown as Record<string, unknown>);

  if (!validateProviders(parsed.providers)) {
    return null;
  }

  return parsed;
}

export async function loadPersistedSettings(): Promise<AppSettings> {
  try {
    const v6Data = localStorage.getItem(SETTINGS_STORAGE_KEY_V6);
    if (v6Data) {
      const parsed = parseStoredSettings(v6Data);
      if (parsed) {
        return parsed;
      }
      localStorage.removeItem(SETTINGS_STORAGE_KEY_V6);
    }

    const v5Data = localStorage.getItem(SETTINGS_STORAGE_KEY_V5);
    if (v5Data) {
      localStorage.removeItem(SETTINGS_STORAGE_KEY_V5);
    }

    const v4Data = localStorage.getItem(SETTINGS_STORAGE_KEY_V4);
    if (v4Data) {
      localStorage.removeItem(SETTINGS_STORAGE_KEY_V4);
    }

    const v3Data = localStorage.getItem(SETTINGS_STORAGE_KEY_V3);
    if (v3Data) {
      localStorage.removeItem(SETTINGS_STORAGE_KEY_V3);
    }

    const v2Data = localStorage.getItem(SETTINGS_STORAGE_KEY_V2);
    if (v2Data) {
      localStorage.removeItem(SETTINGS_STORAGE_KEY_V2);
    }
  } catch (error) {
    console.error('Failed to load settings', error);
  }

  return EMPTY_INITIAL_SETTINGS;
}

export async function persistSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY_V6, JSON.stringify(settings));
}

export function normalizeActiveModelKey(settings: AppSettings): AppSettings {
  const enabledModelKeys: string[] = [];

  settings.providers.forEach((provider) => {
    provider.models.forEach((model) => {
      if (model.enabled !== false) {
        enabledModelKeys.push(`${provider.id}:${model.id}`);
      }
    });
  });

  if (enabledModelKeys.length === 0) {
    return settings;
  }

  if (enabledModelKeys.includes(settings.activeModelKey)) {
    return settings;
  }

  return {
    ...settings,
    activeModelKey: enabledModelKeys[0],
  };
}
