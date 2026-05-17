import { createContext, useContext, useMemo, useCallback } from 'react';
import { usePersistedState } from '../utils/storage.js';
import es from './es.js';
import en from './en.js';

const DICTS = { es, en };
export const LOCALES = [
  { code: 'es', label: 'Español', flag: '🇪🇨' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

const I18nContext = createContext(null);

function pick(dict, path) {
  return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), dict);
}

function interpolate(template, vars) {
  if (typeof template !== 'string' || !vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`));
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = usePersistedState('locale', detectInitialLocale());

  const t = useCallback((key, vars) => {
    const value = pick(DICTS[locale] || DICTS.es, key) ?? pick(DICTS.es, key) ?? key;
    return interpolate(value, vars);
  }, [locale]);

  const ctx = useMemo(() => ({ locale, setLocale, t, available: LOCALES }), [locale, t]);
  return <I18nContext.Provider value={ctx}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n debe usarse dentro de <I18nProvider>');
  return ctx;
}

function detectInitialLocale() {
  try {
    const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
    return DICTS[nav] ? nav : 'es';
  } catch {
    return 'es';
  }
}
