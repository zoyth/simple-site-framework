// ABOUTME: Next.js metadata generation utilities for SEO optimization
// ABOUTME: Type-safe helpers for creating Open Graph, Twitter Card, and other meta tags

import type { Metadata } from 'next'

export interface MetadataOptions {
  /** Page title */
  title: string
  /** Page description */
  description: string
  /** Canonical URL */
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
  /** Alternate locales */
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
 * // Article page
 * export const metadata = generateMetadata({
 *   title: 'Blog Post Title',
 *   description: 'Article description...',
 *   type: 'article',
 *   article: {
 *     publishedTime: '2024-01-15T00:00:00Z',
 *     author: 'Jane Doe',
 *     tags: ['JavaScript', 'React']
 *   },
 *   image: '/blog/post-image.jpg'
 * })
 *
 * @example
 * // With alternates for i18n
 * export const metadata = generateMetadata({
 *   title: 'Welcome',
 *   description: 'Description',
 *   locale: 'en',
 *   alternateLocales: ['fr', 'es'],
 *   url: 'https://example.com'
 * })
 */
export function generateMetadata({
  title,
  description,
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
  other
}: MetadataOptions): Metadata {
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

    // Alternates for i18n
    ...(url &&
      alternateLocales && {
        alternates: {
          canonical: url,
          languages: Object.fromEntries(
            alternateLocales.map((loc) => [
              loc,
              url.replace(`/${locale}`, `/${loc}`)
            ])
          )
        }
      }),

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
