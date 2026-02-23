// ABOUTME: React Context provider for i18n configuration
// ABOUTME: Replaces module-level globals so components share config across bundle boundaries

'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { I18nConfig, LocalePrefix, SlugTranslations } from '../lib/i18n/types';
import { translateSlug as translateSlugFn } from '../lib/i18n/slug-translations';

interface I18nContextValue {
  config: I18nConfig;
  locales: readonly string[];
  defaultLocale: string;
  localePrefix: LocalePrefix;
  localeNames: Record<string, string>;
  localeLabels: Record<string, string>;
  translateSlug: (
    path: string,
    fromLocale: string,
    toLocale: string,
    customTranslations?: SlugTranslations
  ) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export interface I18nProviderProps {
  config: I18nConfig;
  children: ReactNode;
}

export function I18nProvider({ config, children }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(() => {
    const localePrefix = config.localePrefix || 'as-needed';
    const localeNames = config.localeNames || {};
    const localeLabels = config.localeLabels || {};
    const configTranslations = config.slugTranslations || {};

    return {
      config,
      locales: config.locales,
      defaultLocale: config.defaultLocale,
      localePrefix,
      localeNames,
      localeLabels,
      translateSlug: (
        path: string,
        fromLocale: string,
        toLocale: string,
        customTranslations?: SlugTranslations
      ) => {
        // Merge config translations with custom overrides, custom takes precedence
        const merged: SlugTranslations = { ...configTranslations };
        if (customTranslations) {
          for (const [locale, slugs] of Object.entries(customTranslations)) {
            merged[locale] = { ...merged[locale], ...slugs };
          }
        }
        return translateSlugFn(path, fromLocale, toLocale, merged);
      },
    };
  }, [config]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
