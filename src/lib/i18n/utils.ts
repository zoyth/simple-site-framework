// ABOUTME: i18n utility functions for locale management and text direction
// ABOUTME: RTL support, validation, and enhanced localized string handling

import { getI18nConfig, getRtlLocales, isSupportedLocale as isSupported } from './config';

/**
 * Check if a locale uses right-to-left text direction
 *
 * @param locale - Locale code to check
 * @returns true if locale is RTL, false otherwise
 *
 * @example
 * ```typescript
 * isRtlLocale('ar') // true (Arabic)
 * isRtlLocale('he') // true (Hebrew)
 * isRtlLocale('en') // false (English)
 * isRtlLocale('fr') // false (French)
 * ```
 */
export function isRtlLocale(locale: string): boolean {
  const rtlLocales = getRtlLocales();
  return rtlLocales.includes(locale);
}

/**
 * Get text direction for a locale
 *
 * @param locale - Locale code
 * @returns 'rtl' for right-to-left locales, 'ltr' for left-to-right
 *
 * @example
 * ```tsx
 * // In layout
 * <html lang={locale} dir={getTextDirection(locale)}>
 *
 * // Results:
 * getTextDirection('ar') // 'rtl'
 * getTextDirection('en') // 'ltr'
 * ```
 */
export function getTextDirection(locale: string): 'ltr' | 'rtl' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}

// Note: getLocalizedString is exported from lib/content/utils
// Use that version for accessing localized content strings

/**
 * Validate if a locale is supported
 *
 * @param locale - Locale code to validate
 * @returns true if locale is supported, false otherwise
 *
 * @example
 * ```typescript
 * // With config: locales: ['en', 'fr', 'es']
 * validateLocale('en') // true
 * validateLocale('fr') // true
 * validateLocale('de') // false
 * validateLocale('invalid') // false
 * ```
 */
export function validateLocale(locale: string): boolean {
  return isSupported(locale);
}

/**
 * Get all supported locales except the current one
 *
 * @param currentLocale - Current locale to exclude
 * @returns Array of alternate locales
 *
 * @example
 * ```typescript
 * // With config: locales: ['en', 'fr', 'es', 'de']
 * getAlternateLocales('en') // ['fr', 'es', 'de']
 * getAlternateLocales('fr') // ['en', 'es', 'de']
 * ```
 */
export function getAlternateLocales(currentLocale: string): string[] {
  const config = getI18nConfig();
  return config.locales.filter((l) => l !== currentLocale);
}

/**
 * Normalize locale code to lowercase
 * Handles variants like 'en-US' -> 'en', 'zh-CN' -> 'zh'
 *
 * @param locale - Locale code (can include region)
 * @returns Normalized locale code
 *
 * @example
 * ```typescript
 * normalizeLocale('en-US') // 'en'
 * normalizeLocale('zh-CN') // 'zh'
 * normalizeLocale('FR')    // 'fr'
 * normalizeLocale('es')    // 'es'
 * ```
 */
export function normalizeLocale(locale: string): string {
  return locale.toLowerCase().split('-')[0];
}

/**
 * Check if a locale code matches a supported locale
 * Handles locale variants (e.g., 'en-US' matches 'en')
 *
 * @param locale - Locale code to check (can include region)
 * @returns Matching supported locale or null
 *
 * @example
 * ```typescript
 * // With config: locales: ['en', 'fr', 'es']
 * matchLocale('en-US') // 'en'
 * matchLocale('fr-CA') // 'fr'
 * matchLocale('de-DE') // null
 * ```
 */
export function matchLocale(locale: string): string | null {
  const config = getI18nConfig();
  const normalized = normalizeLocale(locale);

  // Exact match first
  if (config.locales.includes(locale)) {
    return locale;
  }

  // Match normalized (e.g., 'en-US' -> 'en')
  if (config.locales.includes(normalized)) {
    return normalized;
  }

  // Check if any supported locale starts with this language code
  const match = config.locales.find((l) => l.startsWith(normalized));
  if (match) {
    return match;
  }

  return null;
}

/**
 * Get locale display name in its own language (autonym)
 *
 * @param locale - Locale code
 * @returns Display name or locale code if not found
 *
 * @example
 * ```typescript
 * getLocaleAutonym('en') // 'English'
 * getLocaleAutonym('fr') // 'Français'
 * getLocaleAutonym('es') // 'Español'
 * ```
 */
export function getLocaleAutonym(locale: string): string {
  // Common language autonyms
  const autonyms: Record<string, string> = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    ru: 'Русский',
    ja: '日本語',
    ko: '한국어',
    zh: '中文',
    ar: 'العربية',
    he: 'עברית',
    hi: 'हिन्दी',
    tr: 'Türkçe',
    pl: 'Polski',
    nl: 'Nederlands',
    sv: 'Svenska',
    da: 'Dansk',
    no: 'Norsk',
    fi: 'Suomi',
    cs: 'Čeština',
    el: 'Ελληνικά',
    th: 'ไทย',
    vi: 'Tiếng Việt',
    id: 'Bahasa Indonesia',
    ms: 'Bahasa Melayu',
    uk: 'Українська',
  };

  // Try to get from config first
  try {
    const { getLocaleNames } = require('./config');
    const names = getLocaleNames();
    if (names[locale]) {
      return names[locale];
    }
  } catch {
    // Config not available
  }

  // Fall back to autonym map
  return autonyms[locale] || locale.toUpperCase();
}

/**
 * Format locale for display (e.g., for language selector)
 *
 * @param locale - Locale code
 * @param format - Display format
 * @returns Formatted locale string
 *
 * @example
 * ```typescript
 * formatLocaleDisplay('en', 'name')  // 'English'
 * formatLocaleDisplay('fr', 'label') // 'FR'
 * formatLocaleDisplay('es', 'code')  // 'es'
 * ```
 */
export function formatLocaleDisplay(
  locale: string,
  format: 'name' | 'label' | 'code' = 'name'
): string {
  if (format === 'code') {
    return locale;
  }

  if (format === 'label') {
    try {
      const { getLocaleLabel } = require('./config');
      return getLocaleLabel(locale);
    } catch {
      return locale.toUpperCase();
    }
  }

  // format === 'name'
  return getLocaleAutonym(locale);
}
