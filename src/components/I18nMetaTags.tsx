// ABOUTME: SEO meta tags component for multi-language sites
// ABOUTME: Generates hreflang, canonical URLs, and OpenGraph locale tags

'use client';

import { getI18nConfig, isI18nConfigInitialized, getLocalePrefix } from '../lib/i18n/config';

export interface I18nMetaTagsProps {
  /** Current locale */
  currentLocale: string;
  /** Current pathname (without locale prefix) */
  pathname: string;
  /** Base URL of the site (e.g., 'https://example.com') */
  baseUrl: string;
}

/**
 * I18nMetaTags - Generate SEO-critical meta tags for multi-language sites
 *
 * Generates:
 * - hreflang tags for all supported locales
 * - x-default tag for language selection
 * - Canonical URL for current page
 * - OpenGraph locale and alternate tags
 *
 * @example
 * ```tsx
 * // In layout.tsx or page.tsx
 * import { I18nMetaTags } from 'simple-site-framework';
 *
 * export default function Layout({ children, params }) {
 *   return (
 *     <html>
 *       <head>
 *         <I18nMetaTags
 *           currentLocale={params.locale}
 *           pathname="/about"
 *           baseUrl="https://example.com"
 *         />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions
 * @see https://ogp.me/#optional
 */
export function I18nMetaTags({ currentLocale, pathname, baseUrl }: I18nMetaTagsProps) {
  // Check if i18n config is initialized
  if (!isI18nConfigInitialized()) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'I18nMetaTags: i18n configuration not initialized. ' +
        'Call setI18nConfig() before rendering this component. ' +
        'No SEO meta tags will be generated until config is initialized. ' +
        'See docs/i18n/MIGRATION.md for setup instructions.'
      );
    }
    // Return null - page can still render without SEO tags
    return null;
  }

  const config = getI18nConfig();
  const prefixMode = getLocalePrefix();

  // Build canonical URL for current page
  const canonicalUrl = buildUrl(baseUrl, pathname, currentLocale, prefixMode, config.defaultLocale);

  // Build alternate URLs for all locales
  const alternateUrls = config.locales.map((locale) => ({
    locale,
    url: buildUrl(baseUrl, pathname, locale, prefixMode, config.defaultLocale),
  }));

  // x-default points to default locale
  const defaultUrl = buildUrl(baseUrl, pathname, config.defaultLocale, prefixMode, config.defaultLocale);

  // OpenGraph alternate locales (excluding current)
  const ogAlternates = config.locales.filter((l) => l !== currentLocale);

  return (
    <>
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang tags for all locales */}
      {alternateUrls.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hrefLang={locale} href={url} />
      ))}

      {/* x-default for language selection */}
      <link rel="alternate" hrefLang="x-default" href={defaultUrl} />

      {/* OpenGraph locale tags */}
      <meta property="og:locale" content={currentLocale} />
      {ogAlternates.map((locale) => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}
    </>
  );
}

/**
 * Build full URL for a locale
 * Respects localePrefix mode when constructing URLs
 */
function buildUrl(
  baseUrl: string,
  pathname: string,
  locale: string,
  prefixMode: string,
  defaultLocale: string
): string {
  // Ensure pathname starts with /
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // Remove trailing slash from baseUrl
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  // Build URL based on prefix mode
  if (prefixMode === 'never') {
    // No locale in URL
    return `${cleanBase}${cleanPath}`;
  } else if (prefixMode === 'as-needed' && locale === defaultLocale) {
    // Default locale without prefix
    return `${cleanBase}${cleanPath}`;
  } else {
    // Add locale prefix
    return `${cleanBase}/${locale}${cleanPath}`;
  }
}
