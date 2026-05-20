import type { AppSettings, ProviderConfig } from '@/types';
import { isExecutionMode, validateProviders } from '@/services/providerConfigValidation';
import { normalizeProviders, normalizeSettingsProviders } from '@/services/modelIdentity';

const FILE_EXTENSION = '.prism';

export async function exportConfig(settings: AppSettings): Promise<void> {
  const json = JSON.stringify(normalizeSettingsProviders(settings), null, 2);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `prism-config-${date}${FILE_EXTENSION}`;

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  settings: AppSettings;
  wasEncrypted: boolean;
}

function parseImportedSettings(text: string): ImportResult {
  if (text.startsWith('PRISM_ENC_V1:')) {
    throw new Error(
      'Legacy encrypted .prism files are no longer supported. Please reconfigure providers and export a new file.',
    );
  }

  const parsed = JSON.parse(text) as AppSettings;
  if (!parsed || typeof parsed !== 'object' || !validateProviders(parsed.providers)) {
    throw new Error('Invalid configuration format.');
  }

  const providers = normalizeProviders(parsed.providers);

  return {
    wasEncrypted: false,
    settings: {
      activeModelKey: typeof parsed.activeModelKey === 'string' ? parsed.activeModelKey : '',
      languageModels: parsed.languageModels || {},
      providers,
      executionMode: isExecutionMode(parsed.executionMode)
        ? parsed.executionMode
        : 'browser-direct',
    },
  };
}

export async function importConfig(file: File): Promise<ImportResult> {
  const text = await file.text();

  try {
    return parseImportedSettings(text);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Invalid configuration format: failed to read the selected file.',
    );
  }
}

export function detectConflicts(
  existing: AppSettings,
  imported: AppSettings,
): { conflicts: ProviderConfig[]; newProviders: ProviderConfig[] } {
  const existingKeys = new Set(
    existing.providers.map(
      (provider) => `${provider.providerType}::${provider.displayName.toLowerCase()}`,
    ),
  );

  const conflicts: ProviderConfig[] = [];
  const newProviders: ProviderConfig[] = [];

  for (const provider of imported.providers) {
    const key = `${provider.providerType}::${provider.displayName.toLowerCase()}`;
    if (existingKeys.has(key)) {
      conflicts.push(provider);
    } else {
      newProviders.push(provider);
    }
  }

  return { conflicts, newProviders };
}

export function mergeSettings(existing: AppSettings, imported: AppSettings): AppSettings {
  const normalizedExisting = normalizeSettingsProviders(existing);
  const normalizedImported = normalizeSettingsProviders(imported);
  const { newProviders, conflicts } = detectConflicts(normalizedExisting, normalizedImported);

  const mergedProviders = normalizedExisting.providers.map((existingProvider) => {
    const matches = conflicts.filter(
      (provider) =>
        provider.providerType === existingProvider.providerType &&
        provider.displayName.toLowerCase() === existingProvider.displayName.toLowerCase(),
    );

    if (matches.length === 0) {
      return existingProvider;
    }

    const existingModelUids = new Set(existingProvider.models.map((model) => model.uid || model.id));
    const mergedModels = matches
      .flatMap((provider) => provider.models)
      .filter((model) => !existingModelUids.has(model.uid || model.id));

    if (mergedModels.length === 0) {
      return existingProvider;
    }

    return {
      ...existingProvider,
      models: [...existingProvider.models, ...mergedModels],
    };
  });

  return {
    ...normalizedExisting,
    providers: [...mergedProviders, ...newProviders],
  };
}

export function overrideSettings(_existing: AppSettings, imported: AppSettings): AppSettings {
  return normalizeSettingsProviders({ ...imported });
}
