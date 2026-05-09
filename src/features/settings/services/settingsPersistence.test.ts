import { describe, expect, it, vi } from 'vitest';

import type { AppSettings, ProviderConfig } from '@/types';

import {
  EMPTY_INITIAL_SETTINGS,
  SETTINGS_STORAGE_KEY_V2,
  SETTINGS_STORAGE_KEY_V3,
  SETTINGS_STORAGE_KEY_V4,
  SETTINGS_STORAGE_KEY_V5,
  SETTINGS_STORAGE_KEY_V6,
  loadPersistedSettings,
  normalizeActiveModelKey,
  persistSettings,
} from './settingsPersistence';

const provider: ProviderConfig = {
  id: 'openai',
  providerType: 'openai',
  displayName: 'OpenAI',
  models: [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 mini', enabled: false },
  ],
};

describe('settingsPersistence', () => {
  it('loads valid v6 settings and migrates legacy single-model language bindings', async () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY_V6,
      JSON.stringify({
        activeModelKey: 'openai:gpt-4o',
        providers: [provider],
        languageModels: {
          French: 'openai:gpt-4o',
          German: ['openai:gpt-4o'],
        },
      }),
    );

    await expect(loadPersistedSettings()).resolves.toEqual({
      activeModelKey: 'openai:gpt-4o',
      providers: [provider],
      languageModels: {
        French: ['openai:gpt-4o'],
        German: ['openai:gpt-4o'],
      },
    });
  });

  it('drops invalid v6 settings and returns the empty initial settings', async () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY_V6,
      JSON.stringify({
        activeModelKey: 'broken:model',
        providers: [{ id: 'broken-provider' }],
        languageModels: {},
      }),
    );

    await expect(loadPersistedSettings()).resolves.toEqual(EMPTY_INITIAL_SETTINGS);
    expect(localStorage.getItem(SETTINGS_STORAGE_KEY_V6)).toBeNull();
  });

  it('removes older storage versions during load', async () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY_V5, 'legacy-v5');
    localStorage.setItem(SETTINGS_STORAGE_KEY_V4, 'legacy-v4');
    localStorage.setItem(SETTINGS_STORAGE_KEY_V3, 'legacy-v3');
    localStorage.setItem(SETTINGS_STORAGE_KEY_V2, 'legacy-v2');

    await expect(loadPersistedSettings()).resolves.toEqual(EMPTY_INITIAL_SETTINGS);

    expect(localStorage.getItem(SETTINGS_STORAGE_KEY_V5)).toBeNull();
    expect(localStorage.getItem(SETTINGS_STORAGE_KEY_V4)).toBeNull();
    expect(localStorage.getItem(SETTINGS_STORAGE_KEY_V3)).toBeNull();
    expect(localStorage.getItem(SETTINGS_STORAGE_KEY_V2)).toBeNull();
  });

  it('persists settings to the current storage key', async () => {
    const settings: AppSettings = {
      activeModelKey: 'openai:gpt-4o',
      providers: [provider],
      languageModels: {
        French: ['openai:gpt-4o'],
      },
    };

    await persistSettings(settings);

    expect(JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY_V6) ?? 'null')).toEqual(settings);
  });

  it('normalizes the active model key to the first enabled model when needed', () => {
    expect(
      normalizeActiveModelKey({
        activeModelKey: 'missing:model',
        providers: [provider],
        languageModels: {},
      }),
    ).toEqual({
      activeModelKey: 'openai:gpt-4o',
      providers: [provider],
      languageModels: {},
    });
  });

  it('returns empty settings and logs when stored settings cannot be parsed', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(SETTINGS_STORAGE_KEY_V6, '{not-json');

    await expect(loadPersistedSettings()).resolves.toEqual(EMPTY_INITIAL_SETTINGS);
    expect(errorSpy).toHaveBeenCalledOnce();
  });
});
