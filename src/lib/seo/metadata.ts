// ABOUTME: Next.js metadata generation utilities for SEO optimization
// ABOUTME: Type-safe helpers for creating Open Graph, Twitter Card, and other meta tags

import type { Metadata } from 'next'
import { translateSlug } from '../i18n/slug-translations'
import type { SlugTranslations } from '../i18n/types'

/** String or per-locale string map */
type LocalizedText = string | Record<string, string>

export interface MetadataOptions {
  /** Page title (string or per-locale map) */
  title: LocalizedText
  /** Page description (string or per-locale map) */
  description: LocalizedText
  /** Canonical URL (legacy — prefer path + baseUrl) */
  url?: string
  /** Open Graph image */
  image?: string
  /** Image alt text */
  imageAlt?: string
  /** Page type @default 'website' */
  type?: 'website' | 'article'
  /** Article specific metadata */
  article?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    tags?: string[]
  }
  /** Twitter card type @default 'summary_large_image' */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  /** Twitter handle (without @) */
  twitterSite?: string
  /** Twitter creator handle (without @) */
  twitterCreator?: string
  /** Locale @default 'en' */
  locale?: string
  /** Alternate locales (legacy — prefer locales + path + baseUrl) */
  alternateLocales?: string[]
  /** Site name */
  siteName?: string
  /** Robots directives */
  robots?: {
    index?: boolean
    follow?: boolean
    googleBot?: {
      index?: boolean
      follow?: boolean
    }
  }
  /** Keywords */
  keywords?: string[]
  /** Author */
  author?: string
  /** Additional metadata */
  other?: Record<string, string>

  /** Page path in the current locale (e.g., '/a-propos') — used with baseUrl for auto alternates */
  path?: string
  /** Base URL (e.g., 'https://example.com') — used with path for auto alternates */
  baseUrl?: string
  /** All supported locales — used with path + baseUrl for auto alternates */
  locales?: readonly string[]
  /** Default locale for x-default — used with path + baseUrl for auto alternates */
  defaultLocale?: string
  /** Slug translations for per-locale paths — used with path + baseUrl */
  slugTranslations?: SlugTranslations
  /** Explicit per-locale alternate URLs (overrides auto-generation) */
  alternates?: Record<string, string>
}

/**
 * Resolve a LocalizedText value to a plain string for the given locale
 */
function resolveText(text: LocalizedText, locale: string): string {
  if (typeof text === 'string') return text
  if (text[locale]) return text[locale]
  // Fall back to first available value
  const values = Object.values(text)
  return values[0] || ''
}

/**
 * Generate Next.js metadata object for SEO
 *
 * Creates a complete Metadata object with Open Graph, Twitter Card,
 * and other SEO metadata. Compatible with Next.js 13+ App Router.
 *
 * @example
 * // In app/page.tsx
 * export const metadata = generateMetadata({
 *   title: 'Home - My Company',
 *   description: 'Leading provider of professional services',
 *   url: 'https://example.com',
 *   image: 'https://example.com/og-image.jpg',
 *   siteName: 'My Company',
 *   twitterSite: 'mycompany'
 * })
 *
 * @example
 * // Bilingual with auto slug-translated alternates
 * export const metadata = generateMetadata({
 *   title: { fr: '\u00c0 propos', en: 'About' },
 *   description: { fr: 'Desc FR', en: 'Desc EN' },
 *   locale: 'fr',
 *   path: '/a-propos',
 *   baseUrl: 'https://example.com',
 *   locales: ['fr', 'en'],
 *   defaultLocale: 'fr',
 *   slugTranslations: {
 *     fr: { '/a-propos': '/about' },
 *     en: { '/about': '/a-propos' },
 *   },
 * })
 */
export function generateMetadata({
  title: rawTitle,
  description: rawDescription,
  url,
  image,
  imageAlt,
  type = 'website',
  article,
  twitterCard = 'summary_large_image',
  twitterSite,
  twitterCreator,
  locale = 'en',
  alternateLocales,
  siteName,
  robots,
  keywords,
  author,
  other,
  path,
  baseUrl,
  locales,
  defaultLocale,
  slugTranslations,
  alternates: explicitAlternates,
}: MetadataOptions): Metadata {
  // Resolve localized text for the current locale
  const title = resolveText(rawTitle, locale)
  const description = resolveText(rawDescription, locale)

  // Build alternates
  let alternatesBlock: Metadata['alternates'] = undefined

  if (explicitAlternates) {
    // Explicit alternates override
    const canonical = explicitAlternates[locale]
    alternatesBlock = {
      ...(canonical && { canonical }),
      languages: explicitAlternates,
    }
  } else if (path !== undefined && baseUrl && locales) {
    // Auto-generate alternates from path + baseUrl + locales
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    const sourceLocale = defaultLocale || locale

    const pathForLocale = (loc: string): string => {
      if (!slugTranslations || loc === sourceLocale) return cleanPath
      return translateSlug(cleanPath, sourceLocale, loc, slugTranslations)
    }

    const languages: Record<string, string> = {}
    for (const loc of locales) {
      languages[loc] = `${cleanBase}/${loc}${pathForLocale(loc)}`
    }
    if (defaultLocale) {
      languages['x-default'] = `${cleanBase}/${defaultLocale}${pathForLocale(defaultLocale)}`
    }

    alternatesBlock = {
      canonical: `${cleanBase}/${locale}${pathForLocale(locale)}`,
      languages,
    }
  } else if (url && alternateLocales) {
    // Legacy: alternateLocales with URL string replacement
    alternatesBlock = {
      canonical: url,
      languages: Object.fromEntries(
        alternateLocales.map((loc) => [
          loc,
          url.replace(`/${locale}`, `/${loc}`)
        ])
      )
    }
  }

  const metadata: Metadata = {
    title,
    description,
    ...(keywords && { keywords: keywords.join(', ') }),
    ...(author && { authors: [{ name: author }] }),

    // Open Graph
    openGraph: {
      title,
      description,
      type,
      ...(url && { url }),
      ...(siteName && { siteName }),
      ...(locale && { locale }),
      ...(image && {
        images: [
          {
            url: image,
            ...(imageAlt && { alt: imageAlt })
          }
        ]
      }),
      ...(type === 'article' &&
        article && {
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: article.author ? [article.author] : undefined,
          tags: article.tags
        })
    },

    // Twitter Card
    twitter: {
      card: twitterCard,
      title,
      description,
      ...(twitterSite && { site: `@${twitterSite}` }),
      ...(twitterCreator && { creator: `@${twitterCreator}` }),
      ...(image && {
        images: [image]
      })
    },

    // Robots
    ...(robots && { robots }),

    // Alternates
    ...(alternatesBlock && { alternates: alternatesBlock }),

    // Additional metadata
    ...(other && { other })
  }

  return metadata
}

/**
 * Generate metadata for a blog post or article
 *
 * Specialized helper for article pages with publication metadata.
 *
 * @example
 * export const metadata = generateArticleMetadata({
 *   title: 'My Blog Post',
 *   description: 'Post description',
 *   image: '/blog/post.jpg',
 *   publishedTime: '2024-01-15T00:00:00Z',
 *   author: 'Jane Doe',
 *   tags: ['JavaScript', 'Web Development']
 * })
 */
export function generateArticleMetadata({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  author,
  tags,
  url,
  siteName,
  twitterSite
}: {
  title: string
  description: string
  image?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  url?: string
  siteName?: string
  twitterSite?: string
}): Metadata {
  return generateMetadata({
    title,
    description,
    image,
    url,
    siteName,
    twitterSite,
    type: 'article',
    article: {
      publishedTime,
      modifiedTime,
      author,
      tags
    }
  })
}
