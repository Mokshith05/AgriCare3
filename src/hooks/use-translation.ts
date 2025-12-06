'use client';

import { useLanguage } from '@/contexts/language-context';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';
import { get } from 'lodash';

const translations: { [key: string]: any } = { en, hi, ta, te };

export function useTranslation() {
  const { language } = useLanguage();
  const texts = translations[language] || en;

  const t = (key: string): string => {
    return get(texts, key, key);
  };

  return { t, language };
}
