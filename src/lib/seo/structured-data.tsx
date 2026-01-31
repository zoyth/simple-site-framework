// ABOUTME: Schema.org structured data component for JSON-LD
// ABOUTME: Renders JSON-LD scripts for rich search results

import { ReactElement } from 'react'

export interface OrganizationData {
  type: 'Organization'
  name: string
  url: string
  logo?: string
  description?: string
  contactPoint?: {
    telephone?: string
    contactType?: string
    email?: string
  }
  sameAs?: string[] // Social media profiles
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
}

export interface ArticleData {
  type: 'Article' | 'BlogPosting' | 'NewsArticle'
  headline: string
  description?: string
  image?: string | string[]
  datePublished?: string
  dateModified?: string
  author?: {
    name: string
    url?: string
  }
  publisher?: {
    name: string
    logo?: string
  }
}

export interface ProductData {
  type: 'Product'
  name: string
  description?: string
  image?: string | string[]
  brand?: string
  offers?: {
    price: number
    priceCurrency: string
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
    url?: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

export interface FAQData {
  type: 'FAQPage'
  questions: Array<{
    question: string
    answer: string
  }>
}

export interface BreadcrumbData {
  type: 'BreadcrumbList'
  items: Array<{
    name: string
    url?: string
  }>
}

export interface LocalBusinessData {
  type: 'LocalBusiness'
  name: string
  description?: string
  image?: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  telephone?: string
  priceRange?: string
  openingHours?: string[]
}

export type StructuredDataType =
  | OrganizationData
  | ArticleData
  | ProductData
  | FAQData
  | BreadcrumbData
  | LocalBusinessData

/**
 * StructuredData - Inject schema.org JSON-LD for SEO
 *
 * Renders structured data as JSON-LD script tags for rich search results.
 * Supports Organization, Article, Product, FAQ, Breadcrumb, and LocalBusiness schemas.
 *
 * @example
 * // Organization schema
 * <StructuredData
 *   data={{
 *     type: 'Organization',
 *     name: 'My Company',
 *     url: 'https://example.com',
 *     logo: 'https://example.com/logo.png',
 *     contactPoint: {
 *       telephone: '+1-555-1234',
 *       contactType: 'customer service',
 *       email: 'support@example.com'
 *     },
 *     sameAs: [
 *       'https://twitter.com/mycompany',
 *       'https://linkedin.com/company/mycompany'
 *     ]
 *   }}
 * />
 *
 * @example
 * // Article schema
 * <StructuredData
 *   data={{
 *     type: 'BlogPosting',
 *     headline: 'Blog Post Title',
 *     description: 'Post description',
 *     image: 'https://example.com/post-image.jpg',
 *     datePublished: '2024-01-15T00:00:00Z',
 *     author: {
 *       name: 'Jane Doe',
 *       url: 'https://example.com/authors/jane'
 *     },
 *     publisher: {
 *       name: 'My Blog',
 *       logo: 'https://example.com/logo.png'
 *     }
 *   }}
 * />
 *
 * @example
 * // FAQ schema
 * <StructuredData
 *   data={{
 *     type: 'FAQPage',
 *     questions: [
 *       {
 *         question: 'What is your return policy?',
 *         answer: 'We offer 30-day returns...'
 *       },
 *       {
 *         question: 'How long is shipping?',
 *         answer: '3-5 business days...'
 *       }
 *     ]
 *   }}
 * />
 */
export function StructuredData({ data }: { data: StructuredDataType }): ReactElement {
  const jsonLd = buildJsonLd(data)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

function buildJsonLd(data: StructuredDataType): any {
  const baseSchema = {
    '@context': 'https://schema.org'
  }

  switch (data.type) {
    case 'Organization':
      return {
        ...baseSchema,
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        ...(data.logo && { logo: data.logo }),
        ...(data.description && { description: data.description }),
        ...(data.contactPoint && {
          contactPoint: {
            '@type': 'ContactPoint',
            ...data.contactPoint
          }
        }),
        ...(data.sameAs && { sameAs: data.sameAs }),
        ...(data.address && {
          address: {
            '@type': 'PostalAddress',
            ...data.address
          }
        })
      }

    case 'Article':
    case 'BlogPosting':
    case 'NewsArticle':
      return {
        ...baseSchema,
        '@type': data.type,
        headline: data.headline,
        ...(data.description && { description: data.description }),
        ...(data.image && { image: data.image }),
        ...(data.datePublished && { datePublished: data.datePublished }),
        ...(data.dateModified && { dateModified: data.dateModified }),
        ...(data.author && {
          author: {
            '@type': 'Person',
            ...data.author
          }
        }),
        ...(data.publisher && {
          publisher: {
            '@type': 'Organization',
            name: data.publisher.name,
            ...(data.publisher.logo && {
              logo: {
                '@type': 'ImageObject',
                url: data.publisher.logo
              }
            })
          }
        })
      }

    case 'Product':
      return {
        ...baseSchema,
        '@type': 'Product',
        name: data.name,
        ...(data.description && { description: data.description }),
        ...(data.image && { image: data.image }),
        ...(data.brand && { brand: data.brand }),
        ...(data.offers && {
          offers: {
            '@type': 'Offer',
            ...data.offers
          }
        }),
        ...(data.aggregateRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ...data.aggregateRating
          }
        })
      }

    case 'FAQPage':
      return {
        ...baseSchema,
        '@type': 'FAQPage',
        mainEntity: data.questions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer
          }
        }))
      }

    case 'BreadcrumbList':
      return {
        ...baseSchema,
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          ...(item.url && { item: item.url })
        }))
      }

    case 'LocalBusiness':
      return {
        ...baseSchema,
        '@type': 'LocalBusiness',
        name: data.name,
        ...(data.description && { description: data.description }),
        ...(data.image && { image: data.image }),
        address: {
          '@type': 'PostalAddress',
          ...data.address
        },
        ...(data.geo && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.geo.latitude,
            longitude: data.geo.longitude
          }
        }),
        ...(data.telephone && { telephone: data.telephone }),
        ...(data.priceRange && { priceRange: data.priceRange }),
        ...(data.openingHours && { openingHoursSpecification: data.openingHours })
      }

    default:
      return baseSchema
  }
}
