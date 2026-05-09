export const SUPPORTED_LANGUAGES = [
  'ar',
  'en',
  'es',
  'ja',
  'ko',
  'my',
  'pt',
  'ru',
  'tr',
  'vi',
  'zh',
  'zh-TW',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_COOKIE_NAME = 'prism-lang';

export function normalizeLanguage(language?: string | null): SupportedLanguage {
  if (!language) {
    return 'en';
  }

  const lower = language.toLowerCase();
  if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk') || lower.startsWith('zh-mo')) {
    return 'zh-TW';
  }

  if (lower.startsWith('zh')) {
    return 'zh';
  }

  const exactMatch = SUPPORTED_LANGUAGES.find((item) => item === language);
  if (exactMatch) {
    return exactMatch;
  }

  const base = lower.split('-')[0];
  return (SUPPORTED_LANGUAGES.find((item) => item === base) || 'en') as SupportedLanguage;
}
