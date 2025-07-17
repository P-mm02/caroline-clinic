import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Load translations
import en from '../public/locales/en/translation.json';
import th from '../public/locales/th/translation.json';
import ja from '../public/locales/ja/translation.json';
import zh from '../public/locales/zh/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'th',
    supportedLngs: ['en', 'th', 'ja', 'zh'],
    nonExplicitSupportedLngs: true,    
    debug: process.env.NODE_ENV === 'development',
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: en },
      th: { translation: th },
      ja: { translation: ja },
      zh: { translation: zh }
    },
    detection: {
      order: ['localStorage', 'cookie', 'querystring', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;
