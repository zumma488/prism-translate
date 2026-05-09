import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from './locales/ar.json';
import en from './locales/en.json';
import es from './locales/es.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import my from './locales/my.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';
import vi from './locales/vi.json';
import zh from './locales/zh.json';
import zhTW from './locales/zh-TW.json';

import {
  LANGUAGE_COOKIE_NAME,
  SUPPORTED_LANGUAGES,
  normalizeLanguage,
} from './shared';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  es: { translation: es },
  ja: { translation: ja },
  ko: { translation: ko },
  my: { translation: my },
  pt: { translation: pt },
  ru: { translation: ru },
  tr: { translation: tr },
  vi: { translation: vi },
  zh: { translation: zh },
  'zh-TW': { translation: zhTW },
};

export function initI18n(initialLanguage = 'en') {
  if (!i18n.isInitialized) {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'en',
        lng: normalizeLanguage(initialLanguage),
        detection: {
          order: ['cookie', 'localStorage', 'navigator'],
          caches: ['cookie', 'localStorage'],
          lookupCookie: LANGUAGE_COOKIE_NAME,
        },
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
    return i18n;
  }

  const nextLanguage = normalizeLanguage(initialLanguage);
  if (i18n.language !== nextLanguage) {
    void i18n.changeLanguage(nextLanguage);
  }

  return i18n;
}

initI18n();

export default i18n;
