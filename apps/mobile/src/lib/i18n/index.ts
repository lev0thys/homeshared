import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './fr.json';
import en from './en.json';

const STORAGE_KEY = 'homeshared.language';

/**
 * i18n homeshared.
 *
 * Stratégie : FR par défaut (langue principale, toujours complète). EN en beta
 * (peut avoir des clés manquantes → fallback FR auto).
 */
void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export { i18n, STORAGE_KEY };
