// ABOUTME: Sitemap generation utilities for SEO
// ABOUTME: Creates XML sitemaps with multi-language support and hreflang

import { translateSlug } from '../i18n/slug-translations';
import type { SlugTranslations } from '../i18n/types';

/**
 * Change frequency for sitemap entries
 * @see https://www.sitemaps.org/protocol.html
 */
export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

/**
 * A single URL entry in the sitemap
 */
export interface SitemapEntry {
  /** Absolute URL of the page */
  url: string;
  /** Last modification date (ISO 8601 format) */
  lastModified?: string | Date;
  /** How frequently the page is likely to change */
  changeFrequency?: ChangeFrequency;
  /** Priority of this URL relative to other URLs (0.0 to 1.0) */
  priority?: number;
  /** Alternate language versions of this URL */
  alternates?: Array<{
    /** Language/locale code (e.g., 'en', 'fr', 'en-US') */
    hreflang: string;
    /** Absolute URL for this language version */
    href: string;
  }>;
}

/**
 * Configuration for sitemap generation
 */
export interface SitemapConfig {
  /** Base URL of the website (e.g., 'https://example.com') */
  baseUrl: string;
  /** Array of sitemap entries */
  entries: SitemapEntry[];
  /** Pretty print the XML output (default: false) */
  prettyPrint?: boolean;
}

/**
 * Generate XML sitemap from entries
 *
 * Creates a valid sitemap.xml following the sitemaps.org protocol with
 * support for multi-language pages using hreflang annotations.
 *
 * @param config - Sitemap configuration
 * @returns XML string for sitemap.xml
 *
 * @example Basic sitemap
 * ```tsx
 * const sitemap = generateSitemap({
 *   baseUrl: 'https://example.com',
 *   entries: [
 *     { url: 'https://example.com', priority: 1.0, changeFrequency: 'weekly' },
 *     { url: 'https://example.com/about', priority: 0.8 },
 *     { url: 'https://example.com/products', priority: 0.9, changeFrequency: 'daily' }
 *   ]
 * });
 * ```
 *
 * @example Multi-language sitemap
 * ```tsx
 * const sitemap = generateSitemap({
 *   baseUrl: 'https://example.com',
 *   entries: [
 *     {
 *       url: 'https://example.com/en/about',
 *       alternates: [
 *         { hreflang: 'en', href: 'https://example.com/en/about' },
 *         { hreflang: 'fr', href: 'https://example.com/fr/about' },
 *         { hreflang: 'x-default', href: 'https://example.com/en/about' }
 *       ]
 *     }
 *   ]
 * });
 * ```
 */
export function generateSitemap(config: SitemapConfig): string {
  const { entries, prettyPrint = false } = config;
  const indent = prettyPrint ? '  ' : '';
  const newline = prettyPrint ? '\n' : '';

  const urlEntries = entries
    .map((entry) => {
      const parts: string[] = [];

      parts.push(`${indent}<url>${newline}`);
      parts.push(`${indent}${indent}<loc>${escapeXml(entry.url)}</loc>${newline}`);

      if (entry.lastModified) {
        const date =
          entry.lastModified instanceof Date
            ? entry.lastModified.toISOString()
            : entry.lastModified;
        parts.push(`${indent}${indent}<lastmod>${date}</lastmod>${newline}`);
      }

      if (entry.changeFrequency) {
        parts.push(`${indent}${indent}<changefreq>${entry.changeFrequency}</changefreq>${newline}`);
      }

      if (entry.priority !== undefined) {
        const priority = Math.max(0, Math.min(1, entry.priority)).toFixed(1);
        parts.push(`${indent}${indent}<priority>${priority}</priority>${newline}`);
      }

      // Add hreflang alternates
      if (entry.alternates && entry.alternates.length > 0) {
        entry.alternates.forEach((alternate) => {
          parts.push(
            `${indent}${indent}<xhtml:link rel="alternate" hreflang="${escapeXml(
              alternate.hreflang
            )}" href="${escapeXml(alternate.href)}" />${newline}`
          );
        });
      }

      parts.push(`${indent}</url>${newline}`);

      return parts.join('');
    })
    .join('');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    newline,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    newline,
    urlEntries,
    '</urlset>',
  ].join('');

  return xml;
}

/**
 * Create sitemap entries for multi-language pages
 *
 * Helper to generate sitemap entries with proper hreflang annotations
 * for pages that exist in multiple languages.
 *
 * @param baseUrl - Base URL of the website
 * @param path - Page path without locale prefix, in the default locale's language (e.g., '/about')
 * @param locales - Array of locale codes (e.g., ['en', 'fr', 'es'])
 * @param defaultLocale - Default locale for x-default and slug translation source (optional)
 * @param options - Additional sitemap entry options
 * @param slugTranslations - Slug translations for per-locale paths (optional)
 * @returns Array of sitemap entries, one per locale
 *
 * @example
 * ```tsx
 * const entries = createMultiLanguageEntries(
 *   'https://example.com',
 *   '/about',
 *   ['en', 'fr', 'es'],
 *   'en',
 *   { priority: 0.8, changeFrequency: 'monthly' }
 * );
 * // Creates entries for:
 * // - /en/about (with alternates to fr, es, x-default)
 * // - /fr/about (with alternates to en, es, x-default)
 * // - /es/about (with alternates to en, fr, x-default)
 *
 * // With slug translations:
 * const translated = createMultiLanguageEntries(
 *   'https://example.com',
 *   '/a-propos',
 *   ['fr', 'en'],
 *   'fr',
 *   {},
 *   { fr: { '/a-propos': '/about' }, en: { '/about': '/a-propos' } }
 * );
 * // - /fr/a-propos (with alternate en → /en/about)
 * // - /en/about (with alternate fr → /fr/a-propos)
 * ```
 */
export function createMultiLanguageEntries(
  baseUrl: string,
  path: string,
  locales: string[],
  defaultLocale?: string,
  options?: Partial<Omit<SitemapEntry, 'url' | 'alternates'>>,
  slugTranslations?: SlugTranslations
): SitemapEntry[] {
  // Clean up path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Pre-compute the translated path for each locale
  const pathForLocale = (locale: string): string => {
    if (!slugTranslations || !defaultLocale) return cleanPath;
    if (locale === defaultLocale) return cleanPath;
    return translateSlug(cleanPath, defaultLocale, locale, slugTranslations);
  };

  return locales.map((locale) => {
    // Build all alternates with per-locale translated paths
    const alternates = locales.map((altLocale) => ({
      hreflang: altLocale,
      href: `${baseUrl}/${altLocale}${pathForLocale(altLocale)}`,
    }));

    // Add x-default if specified
    if (defaultLocale) {
      alternates.push({
        hreflang: 'x-default',
        href: `${baseUrl}/${defaultLocale}${pathForLocale(defaultLocale)}`,
      });
    }

    return {
      url: `${baseUrl}/${locale}${pathForLocale(locale)}`,
      alternates,
      ...options,
    };
  });
}

/**
 * Create a single-language sitemap entry
 *
 * @param baseUrl - Base URL of the website
 * @param path - Page path (e.g., '/about')
 * @param options - Sitemap entry options
 * @returns Sitemap entry
 *
 * @example
 * ```tsx
 * const entry = createSitemapEntry(
 *   'https://example.com',
 *   '/about',
 *   { priority: 0.8, changeFrequency: 'monthly' }
 * );
 * ```
 */
export function createSitemapEntry(
  baseUrl: string,
  path: string,
  options?: Partial<Omit<SitemapEntry, 'url'>>
): SitemapEntry {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = path === '/' ? baseUrl : `${baseUrl}${cleanPath}`;

  return {
    url,
    ...options,
  };
}

/** Metadata for a content page used to generate sitemap entries */
export interface ContentSitemapItem {
  /** Page path without locale prefix (e.g., '/blog/hello-world') */
  path: string;
  /** Publication date (ISO 8601, e.g., '2026-01-15') */
  date?: string;
  /** Last modified date — takes precedence over date when present */
  dateModified?: string;
}

/** Options for multi-language content sitemap entries */
export interface ContentSitemapI18n {
  locales: string[];
  defaultLocale: string;
  slugTranslations?: SlugTranslations;
}

/**
 * Create sitemap entries from content metadata with dates as lastModified
 *
 * Simplifies sitemap generation for blog posts and content pages by
 * extracting lastModified from content metadata (dateModified or date).
 *
 * @param baseUrl - Base URL of the website
 * @param items - Content metadata items with path and optional dates
 * @param options - Default sitemap entry options (changeFrequency, priority)
 * @param i18n - Multi-language options (locales, defaultLocale, slugTranslations)
 * @returns Array of sitemap entries
 *
 * @example
 * ```tsx
 * const posts = await getAllBlogPosts('en');
 * const entries = createContentSitemapEntries(
 *   'https://example.com',
 *   posts.map(p => ({ path: `/blog/${p.slug}`, date: p.metadata.date })),
 *   { changeFrequency: 'monthly', priority: 0.7 },
 *   { locales: ['en', 'fr'], defaultLocale: 'en' }
 * );
 * ```
 */
export function createContentSitemapEntries(
  baseUrl: string,
  items: ContentSitemapItem[],
  options?: Partial<Omit<SitemapEntry, 'url' | 'alternates' | 'lastModified'>>,
  i18n?: ContentSitemapI18n
): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  for (const item of items) {
    const lastModified = item.dateModified ?? item.date;
    const entryOptions = {
      ...options,
      ...(lastModified && { lastModified }),
    };

    if (i18n) {
      const multiEntries = createMultiLanguageEntries(
        baseUrl,
        item.path,
        i18n.locales,
        i18n.defaultLocale,
        entryOptions,
        i18n.slugTranslations
      );
      entries.push(...multiEntries);
    } else {
      entries.push(createSitemapEntry(baseUrl, item.path, entryOptions));
    }
  }

  return entries;
}

/**
 * Escape special XML characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validate sitemap entry
 *
 * Checks for common issues in sitemap entries.
 *
 * @param entry - Sitemap entry to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateSitemapEntry(entry: SitemapEntry): string[] {
  const errors: string[] = [];

  // Check URL is absolute
  if (!entry.url.startsWith('http://') && !entry.url.startsWith('https://')) {
    errors.push(`URL must be absolute: ${entry.url}`);
  }

  // Check priority range
  if (entry.priority !== undefined && (entry.priority < 0 || entry.priority > 1)) {
    errors.push(`Priority must be between 0 and 1: ${entry.priority}`);
  }

  // Check alternates are absolute
  if (entry.alternates) {
    entry.alternates.forEach((alt, index) => {
      if (!alt.href.startsWith('http://') && !alt.href.startsWith('https://')) {
        errors.push(`Alternate ${index} href must be absolute: ${alt.href}`);
      }
    });
  }

  return errors;
}

/**
 * Validate entire sitemap configuration
 *
 * @param config - Sitemap configuration to validate
 * @returns Object with isValid flag and array of errors
 */
export function validateSitemap(config: SitemapConfig): {
  isValid: boolean;
  errors: Array<{ entry?: SitemapEntry; messages: string[] }>;
} {
  const errors: Array<{ entry?: SitemapEntry; messages: string[] }> = [];

  // Check base URL
  if (!config.baseUrl.startsWith('http://') && !config.baseUrl.startsWith('https://')) {
    errors.push({ messages: ['Base URL must be absolute'] });
  }

  // Check each entry
  config.entries.forEach((entry) => {
    const entryErrors = validateSitemapEntry(entry);
    if (entryErrors.length > 0) {
      errors.push({ entry, messages: entryErrors });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
