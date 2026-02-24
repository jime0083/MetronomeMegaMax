import { useCallback, useMemo } from 'react';
import { getTranslations, getNestedValue, TranslationKeys } from '@/i18n';
import type { Language } from '@/types';

// For now, we'll use a simple hook. Later, this will be connected to context/state management
const DEFAULT_LANGUAGE: Language = 'ja';

export const useTranslation = (language: Language = DEFAULT_LANGUAGE) => {
  const translations = useMemo(() => getTranslations(language), [language]);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations, key);
    },
    [translations]
  );

  return {
    t,
    translations,
    language,
  };
};

export type UseTranslationReturn = ReturnType<typeof useTranslation>;
