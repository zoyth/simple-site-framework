// ABOUTME: i18n configuration export
// ABOUTME: Export i18n types and configuration

// Core types
export type {
  I18nConfig,
  LocalePrefix,
  LocaleCookieConfig,
  LanguagePreference,
  ValidLocale,
  SlugTranslations,
} from './types';

// Legacy exports (to be removed after config refactor)
export { locales, defaultLocale } from './config';
export type { Locale } from './config';

// Cookie management
export { getLocaleFromCookie, setLocaleCookie, LOCALE_COOKIE_NAME } from './locale-cookie';

// Slug translations
export { translateSlug, defaultSlugTranslations } from './slug-translations';
