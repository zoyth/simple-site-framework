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

// Configuration management
export {
  setI18nConfig,
  getI18nConfig,
  isI18nConfigInitialized,
  getLocales,
  getDefaultLocale,
  getLocalePrefix,
  getLocaleNames,
  getLocaleLabels,
  getRtlLocales,
  isLocaleDetectionEnabled,
  getLocaleCookieConfig,
  isSupportedLocale,
  getLocaleName,
  getLocaleLabel,
} from './config';

// Legacy exports (deprecated, will be removed in v1.0.0)
export { locales, defaultLocale } from './config';
export type { Locale } from './config';

// Cookie management
export { getLocaleFromCookie, setLocaleCookie, LOCALE_COOKIE_NAME } from './locale-cookie';

// Slug translations
export { translateSlug, defaultSlugTranslations } from './slug-translations';

// Locale path builder
export { localePath } from './locale-path';

// Next.js routing helpers
export { generateI18nRewrites, generateI18nRedirects } from './routing';

// Locale-aware formatters
export {
  formatDate,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
  formatDateRange,
  formatList,
  formatFileSize,
  getRelativeTime,
} from './formatters';

// Middleware / proxy for routing
export { createI18nMiddleware, createI18nProxy } from './middleware';

// Utilities
export {
  isRtlLocale,
  getTextDirection,
  validateLocale,
  getAlternateLocales,
  normalizeLocale,
  matchLocale,
  getLocaleAutonym,
  formatLocaleDisplay,
} from './utils';
