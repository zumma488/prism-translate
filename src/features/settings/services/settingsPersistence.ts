import { AppSettings } from '../../../types';
import { decrypt, encrypt, isEncrypted } from '../../../services/crypto';

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

export async function loadPersistedSettings(): Promise<AppSettings> {
  try {
    const v3Data = localStorage.getItem(SETTINGS_STORAGE_KEY_V3);
    if (v3Data) {
      if (isEncrypted(v3Data)) {
        try {
          const decrypted = await decrypt(v3Data);
          const parsed = JSON.parse(decrypted);
          migrateLanguageModels(parsed);
          return parsed as AppSettings;
        } catch (error) {
          console.error('Decryption failed, resetting settings:', error);
          localStorage.removeItem(SETTINGS_STORAGE_KEY_V3);
          return EMPTY_INITIAL_SETTINGS;
        }
      }

      try {
        return JSON.parse(v3Data) as AppSettings;
      } catch (error) {
        console.error('Failed to parse plaintext v3 settings', error);
        localStorage.removeItem(SETTINGS_STORAGE_KEY_V3);
        return EMPTY_INITIAL_SETTINGS;
      }
    }

    const v2Data = localStorage.getItem(SETTINGS_STORAGE_KEY_V2);
    if (v2Data) {
      try {
        const parsed = JSON.parse(v2Data);
        migrateLanguageModels(parsed);
        const settings = parsed as AppSettings;
        await persistSettings(settings);
        localStorage.removeItem(SETTINGS_STORAGE_KEY_V2);
        return settings;
      } catch (error) {
        console.error('Failed to migrate v2 settings', error);
      }
    }
  } catch (error) {
    console.error('Failed to load encrypted settings', error);
  }

  return EMPTY_INITIAL_SETTINGS;
}

export async function persistSettings(settings: AppSettings) {
  const encrypted = await encrypt(JSON.stringify(settings));
  localStorage.setItem(SETTINGS_STORAGE_KEY_V3, encrypted);
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
