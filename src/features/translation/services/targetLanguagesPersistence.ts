import { DEFAULT_LANGUAGES, LANGUAGE_CONFIGS } from '../../../constants';

export const TARGET_LANGUAGES_STORAGE_KEY = 'ai-translator-target-languages';

function isKnownLanguage(language: unknown): language is string {
  return typeof language === 'string' && language in LANGUAGE_CONFIGS;
}

export function loadPersistedTargetLanguages(): string[] {
  try {
    const saved = localStorage.getItem(TARGET_LANGUAGES_STORAGE_KEY);

    if (!saved) {
      return DEFAULT_LANGUAGES;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return DEFAULT_LANGUAGES;
    }

    const validLanguages = parsed.filter(isKnownLanguage);

    if (validLanguages.length === 0) {
      return DEFAULT_LANGUAGES;
    }

    return [...new Set(validLanguages)];
  } catch (error) {
    console.error('Failed to load target languages', error);
    return DEFAULT_LANGUAGES;
  }
}

export function persistTargetLanguages(targetLanguages: string[]) {
  localStorage.setItem(TARGET_LANGUAGES_STORAGE_KEY, JSON.stringify(targetLanguages));
}
