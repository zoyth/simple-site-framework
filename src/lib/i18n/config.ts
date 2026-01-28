// ABOUTME: i18n configuration for bilingual routing (French/English)
// ABOUTME: Defines supported locales, default locale, and locale detection settings

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

export const localeLabels: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
};
