/**
 * Config Import/Export Service
 *
 * Handles exporting settings as encrypted .prism files
 * and importing from both encrypted (.prism) and plain JSON files.
 */

import { AppSettings, ProviderConfig } from '../types';
import { encrypt, decrypt, isEncrypted } from './crypto';

const FILE_EXTENSION = '.prism';

/**
 * Export settings as an encrypted .prism file download
 */
export async function exportConfig(settings: AppSettings): Promise<void> {
  const json = JSON.stringify(settings, null, 2);
  const encrypted = await encrypt(json);

  const date = new Date().toISOString().slice(0, 10);
  const filename = `prism-config-${date}${FILE_EXTENSION}`;

  const blob = new Blob([encrypted], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Result of importing a config file
 */
export interface ImportResult {
  settings: AppSettings;
  wasEncrypted: boolean;
}

/**
 * Import settings from a file (.prism or .json)
 * @throws Error with user-friendly message on failure
 */
export async function importConfig(file: File): Promise<ImportResult> {
  const text = await file.text();

  let jsonString: string;
  let wasEncrypted = false;

  if (isEncrypted(text)) {
    try {
      jsonString = await decrypt(text);
      wasEncrypted = true;
    } catch {
      throw new Error('Failed to decrypt the configuration file. It may be from a different application version.');
    }
  } else {
    jsonString = text;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid configuration format: the file does not contain valid JSON.');
  }

  // Validate structure
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid configuration format: expected an object.');
  }

  const obj = parsed as Record<string, unknown>;
  if (!Array.isArray(obj.providers)) {
    throw new Error('Invalid configuration format: missing "providers" array.');
  }

  return {
    settings: parsed as AppSettings,
    wasEncrypted,
  };
}

/**
 * Detect conflicting providers between existing and imported settings
 * Conflict is based on provider name (not ID, since IDs are UUIDs per device)
 */
export function detectConflicts(
  existing: AppSettings,
  imported: AppSettings
): { conflicts: ProviderConfig[]; newProviders: ProviderConfig[] } {
  const existingNames = new Set(existing.providers.map(p => p.name.toLowerCase()));

  const conflicts: ProviderConfig[] = [];
  const newProviders: ProviderConfig[] = [];

  for (const provider of imported.providers) {
    if (existingNames.has(provider.name.toLowerCase())) {
      conflicts.push(provider);
    } else {
      newProviders.push(provider);
    }
  }

  return { conflicts, newProviders };
}

/**
 * Merge imported settings into existing settings (keep existing, add new)
 */
export function mergeSettings(existing: AppSettings, imported: AppSettings): AppSettings {
  const { newProviders } = detectConflicts(existing, imported);
  return {
    ...existing,
    providers: [...existing.providers, ...newProviders],
  };
}

/**
 * Replace existing settings with imported settings entirely
 */
export function overrideSettings(_existing: AppSettings, imported: AppSettings): AppSettings {
  return { ...imported };
}
