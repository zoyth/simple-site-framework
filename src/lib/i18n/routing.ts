// ABOUTME: Next.js rewrite and redirect generators from i18n slug translations
// ABOUTME: Eliminates manual rewrite/redirect boilerplate in next.config.js

import type { I18nConfig } from './types';

interface Rewrite {
  source: string;
  destination: string;
}

interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

/**
 * Generate Next.js rewrites from slug translations config
 *
 * For each non-default locale and each slug translation, generates a rewrite
 * from the translated slug to the filesystem (default-locale) slug.
 *
 * @example
 * ```js
 * // next.config.js
 * const { generateI18nRewrites } = require('@zoyth/simple-site-framework');
 *
 * module.exports = {
 *   async rewrites() {
 *     return generateI18nRewrites(i18nConfig);
 *   },
 * };
 * ```
 */
export function generateI18nRewrites(config: I18nConfig): Rewrite[] {
  const { slugTranslations, defaultLocale, locales } = config;
  if (!slugTranslations) return [];

  const rewrites: Rewrite[] = [];

  for (const locale of locales) {
    if (locale === defaultLocale) continue;

    // The locale's map: { translatedSlug: defaultSlug }
    const localeMap = slugTranslations[locale];
    if (!localeMap) continue;

    for (const [translatedSlug, defaultSlug] of Object.entries(localeMap)) {
      // Rewrite: translated slug → filesystem (default) slug
      rewrites.push({
        source: `/${locale}${translatedSlug}`,
        destination: `/${locale}${defaultSlug}`,
      });
    }
  }

  return rewrites;
}

/**
 * Generate Next.js redirects from slug translations config
 *
 * For each non-default locale and each slug translation, generates a permanent
 * redirect from the default-locale slug (wrong in that locale context) to the
 * correctly translated slug.
 *
 * @example
 * ```js
 * // next.config.js
 * const { generateI18nRedirects } = require('@zoyth/simple-site-framework');
 *
 * module.exports = {
 *   async redirects() {
 *     return generateI18nRedirects(i18nConfig);
 *   },
 * };
 * ```
 */
export function generateI18nRedirects(config: I18nConfig): Redirect[] {
  const { slugTranslations, defaultLocale, locales } = config;
  if (!slugTranslations) return [];

  const redirects: Redirect[] = [];

  for (const locale of locales) {
    if (locale === defaultLocale) continue;

    // The locale's map: { translatedSlug: defaultSlug }
    const localeMap = slugTranslations[locale];
    if (!localeMap) continue;

    for (const [translatedSlug, defaultSlug] of Object.entries(localeMap)) {
      // Redirect: default slug in wrong locale → translated slug
      redirects.push({
        source: `/${locale}${defaultSlug}`,
        destination: `/${locale}${translatedSlug}`,
        permanent: true,
      });
    }
  }

  return redirects;
}
