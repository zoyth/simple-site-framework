// ABOUTME: Convenience function for building locale-prefixed internal links
// ABOUTME: Translates canonical paths and prepends the correct locale prefix

import type { LocalePrefix, SlugTranslations } from './types';
import { getI18nConfig, getLocalePrefix, getDefaultLocale } from './config';
import { translateSlug } from './slug-translations';

/**
 * Prepend the locale prefix to a path according to the prefix mode
 *
 * @param path - Internal path (e.g. '/photos')
 * @param locale - Target locale
 * @param prefixMode - Configured locale prefix mode
 * @param defaultLocale - The site's default locale
 * @returns Path with the locale prefix applied when the mode requires it
 */
export function applyLocalePrefix(
  path: string,
  locale: string,
  prefixMode: LocalePrefix,
  defaultLocale: string
): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const skipPrefix =
    prefixMode === 'never' ||
    (prefixMode === 'as-needed' && locale === defaultLocale);
  if (skipPrefix) {
    return normalizedPath;
  }

  // Handle root path
  if (normalizedPath === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath}`;
}

/**
 * Build a locale-prefixed internal link from a canonical (default-locale) path
 *
 * Takes a path in the default locale, translates it for the target locale
 * if slug translations are configured, and prepends the locale prefix.
 *
 * @param path - Path in the default locale (e.g. '/bilan')
 * @param locale - Target locale
 * @param customTranslations - Optional slug translations to override config
 * @returns Locale-prefixed translated path (e.g. '/en/health-check')
 *
 * @example
 * ```ts
 * localePath('/bilan', 'fr');  // → '/fr/bilan'
 * localePath('/bilan', 'en');  // → '/en/health-check'
 * localePath('/', 'en');       // → '/en'
 * ```
 */
export function localePath(
  path: string,
  locale: string,
  customTranslations?: SlugTranslations
): string {
  const defaultLocale = getDefaultLocale();
  const prefixMode = getLocalePrefix();

  // Normalize: ensure leading slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Translate from default locale to target locale
  let translated = normalizedPath;
  if (locale !== defaultLocale) {
    translated = translateSlug(normalizedPath, defaultLocale, locale, customTranslations);
  }

  // Apply locale prefix
  return applyLocalePrefix(translated, locale, prefixMode, defaultLocale);
}
