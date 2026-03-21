import { LanguageConfig } from './types';

export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  // Top 5 Priority Languages
  English: {
    name: 'English',
    nativeName: 'English',
    code: 'en',
    color: '#3b82f6', // blue-500
    bgColor: '#dbeafe',
    borderColor: '#bfdbfe',
  },
  Chinese: {
    name: 'Chinese',
    nativeName: '中文',
    code: 'zh',
    color: '#ef4444', // red-500
    bgColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  Spanish: {
    name: 'Spanish',
    nativeName: 'Español',
    code: 'es',
    color: '#f97316', // orange-500
    bgColor: '#ffedd5',
    borderColor: '#fed7aa',
  },
  French: {
    name: 'French',
    nativeName: 'Français',
    code: 'fr',
    color: '#0ea5e9', // sky-500
    bgColor: '#e0f2fe',
    borderColor: '#bae6fd',
  },
  Arabic: {
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar',
    color: '#10b981', // emerald-500
    bgColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  // Other Common Languages
  Japanese: {
    name: 'Japanese',
    nativeName: '日本語',
    code: 'ja',
    color: '#ec4899', // pink-500
    bgColor: '#fce7f3',
    borderColor: '#fbcfe8',
  },
  German: {
    name: 'German',
    nativeName: 'Deutsch',
    code: 'de',
    color: '#eab308', // yellow-500
    bgColor: '#fef9c3',
    borderColor: '#fde047',
  },
  Korean: {
    name: 'Korean',
    nativeName: '한국어',
    code: 'ko',
    color: '#8b5cf6', // violet-500
    bgColor: '#ede9fe',
    borderColor: '#ddd6fe',
  },
  Russian: {
    name: 'Russian',
    nativeName: 'Русский',
    code: 'ru',
    color: '#06b6d4', // cyan-500
    bgColor: '#cffafe',
    borderColor: '#a5f3fc',
  },
  Portuguese: {
    name: 'Portuguese',
    nativeName: 'Português',
    code: 'pt',
    color: '#22c55e', // green-500
    bgColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },
  Italian: {
    name: 'Italian',
    nativeName: 'Italiano',
    code: 'it',
    color: '#14b8a6', // teal-500
    bgColor: '#ccfbf1',
    borderColor: '#99f6e4',
  },
  Dutch: {
    name: 'Dutch',
    nativeName: 'Nederlands',
    code: 'nl',
    color: '#f59e0b', // amber-500
    bgColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  Thai: {
    name: 'Thai',
    nativeName: 'ไทย',
    code: 'th',
    color: '#a855f7', // purple-500
    bgColor: '#f3e8ff',
    borderColor: '#e9d5ff',
  },
  Vietnamese: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    code: 'vi',
    color: '#d946ef', // fuchsia-500
    bgColor: '#fae8ff',
    borderColor: '#f5d0fe',
  },
  Hindi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    code: 'hi',
    color: '#f43f5e', // rose-500
    bgColor: '#ffe4e6',
    borderColor: '#fecdd3',
  },
  Indonesian: {
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    code: 'id',
    color: '#64748b', // slate-500
    bgColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
};

export const DEFAULT_LANGUAGES = ['English', 'Chinese', 'Japanese'];

// Use process.env if available, otherwise allow user to input
export const DEFAULT_API_KEY = process.env.API_KEY || '';

export const DEFAULT_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro' },
  { id: 'gemini-2.5-flash-latest', name: 'Gemini 2.5 Flash' },
];