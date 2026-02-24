import { ja, TranslationKeys } from './translations/ja';
import { en } from './translations/en';
import { es } from './translations/es';
import type { Language } from '@/types';

const translations: Record<Language, TranslationKeys> = {
  ja,
  en,
  es,
};

export const getTranslations = (language: Language): TranslationKeys => {
  return translations[language] || translations.ja;
};

export const getNestedValue = (obj: unknown, path: string): string => {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof result === 'string' ? result : path;
};

export type { TranslationKeys };
export { ja, en, es };
