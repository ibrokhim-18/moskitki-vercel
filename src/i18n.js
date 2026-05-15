import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ruTranslation from './locales/ru.json';
import uzTranslation from './locales/uz.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ruTranslation },
      uz: { translation: uzTranslation }
    },
    fallbackLng: 'ru',
    interpolation: { escapeValue: false }
  });

export default i18n;
