// ABOUTME: JSON-LD structured data utilities for schema.org markup
// ABOUTME: Generates type-safe structured data for rich search results

/**
 * Base schema.org Thing type
 * @see https://schema.org/Thing
 */
export interface Thing {
  '@type': string;
  '@id'?: string;
  name?: string;
  description?: string;
  image?: string | string[];
  url?: string;
  [key: string]: unknown;
}

/**
 * Organization schema
 * @see https://schema.org/Organization
 */
export interface Organization extends Thing {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
  sameAs?: string[]; // Social media profiles
  contactPoint?: ContactPoint[];
  foundingDate?: string;
  founders?: Person[];
}

/**
 * Postal address schema
 * @see https://schema.org/PostalAddress
 */
export interface PostalAddress extends Thing {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string; // City
  addressRegion?: string; // State/Province
  postalCode?: string;
  addressCountry?: string;
}

/**
 * Contact point schema
 * @see https://schema.org/ContactPoint
 */
export interface ContactPoint extends Thing {
  '@type': 'ContactPoint';
  telephone?: string;
  email?: string;
  contactType?: string; // e.g., 'customer service', 'sales'
  availableLanguage?: string[];
  areaServed?: string[]; // Countries/regions served
}

/**
 * Person schema
 * @see https://schema.org/Person
 */
export interface Person extends Thing {
  '@type': 'Person';
  name: string;
  email?: string;
  jobTitle?: string;
  image?: string;
  sameAs?: string[]; // Social profiles
  url?: string;
}

/**
 * WebSite schema with search action
 * @see https://schema.org/WebSite
 */
export interface WebSite extends Thing {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: Organization;
  potentialAction?: SearchAction;
}

/**
 * Search action for site search
 * @see https://schema.org/SearchAction
 */
export interface SearchAction {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string; // e.g., "https://example.com/search?q={search_term_string}"
  };
  'query-input': string; // e.g., "required name=search_term_string"
}

/**
 * Product schema
 * @see https://schema.org/Product
 */
export interface Product extends Thing {
  '@type': 'Product' | 'SoftwareApplication';
  name: string;
  description?: string;
  image?: string | string[];
  brand?: Organization | string;
  offers?: Offer | Offer[];
  aggregateRating?: AggregateRating;
  review?: Review[];
}

/**
 * Offer schema for products/services
 * @see https://schema.org/Offer
 */
export interface Offer extends Thing {
  '@type': 'Offer';
  price: string | number;
  priceCurrency: string; // ISO 4217 (e.g., 'USD', 'EUR')
  priceValidUntil?: string; // ISO 8601 date
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  url?: string;
  seller?: Organization;
}

/**
 * Aggregate rating schema
 * @see https://schema.org/AggregateRating
 */
export interface AggregateRating extends Thing {
  '@type': 'AggregateRating';
  ratingValue: number | string;
  reviewCount?: number;
  bestRating?: number | string;
  worstRating?: number | string;
}

/**
 * Review schema
 * @see https://schema.org/Review
 */
export interface Review extends Thing {
  '@type': 'Review';
  author: Person | Organization | string;
  datePublished?: string;
  reviewBody?: string;
  reviewRating?: Rating;
}

/**
 * Rating schema
 * @see https://schema.org/Rating
 */
export interface Rating extends Thing {
  '@type': 'Rating';
  ratingValue: number | string;
  bestRating?: number | string;
  worstRating?: number | string;
}

/**
 * FAQ Page schema
 * @see https://schema.org/FAQPage
 */
export interface FAQPage extends Thing {
  '@type': 'FAQPage';
  mainEntity: Question[];
}

/**
 * Question schema for FAQ
 * @see https://schema.org/Question
 */
export interface Question extends Thing {
  '@type': 'Question';
  name: string; // Question text
  acceptedAnswer: Answer;
}

/**
 * Answer schema for FAQ
 * @see https://schema.org/Answer
 */
export interface Answer extends Thing {
  '@type': 'Answer';
  text: string; // Answer text
}

/**
 * Article schema
 * @see https://schema.org/Article
 */
export interface Article extends Thing {
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  description?: string;
  image?: string | string[];
  author: Person | Organization | string;
  publisher: Organization;
  datePublished: string; // ISO 8601
  dateModified?: string; // ISO 8601
  mainEntityOfPage?: string; // Canonical URL
}

/**
 * Breadcrumb list schema
 * @see https://schema.org/BreadcrumbList
 */
export interface BreadcrumbList extends Thing {
  '@type': 'BreadcrumbList';
  itemListElement: ListItem[];
}

/**
 * List item for breadcrumbs
 * @see https://schema.org/ListItem
 */
export interface ListItem extends Thing {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string; // URL
}

/**
 * Create Organization structured data
 *
 * @example
 * ```tsx
 * const org = createOrganization({
 *   name: 'Acme Inc',
 *   url: 'https://acme.com',
 *   logo: 'https://acme.com/logo.png',
 *   sameAs: [
 *     'https://twitter.com/acme',
 *     'https://linkedin.com/company/acme'
 *   ]
 * });
 * ```
 */
export function createOrganization(data: Omit<Organization, '@type'>): Organization {
  return {
    '@type': 'Organization',
    ...data,
  } as Organization;
}

/**
 * Create WebSite structured data with search action
 *
 * @example
 * ```tsx
 * const website = createWebSite({
 *   name: 'Acme',
 *   url: 'https://acme.com',
 *   searchUrlTemplate: 'https://acme.com/search?q={search_term_string}'
 * });
 * ```
 */
export function createWebSite(data: {
  name: string;
  url: string;
  description?: string;
  publisher?: Organization;
  searchUrlTemplate?: string;
}): WebSite {
  const website: WebSite = {
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
    publisher: data.publisher,
  };

  if (data.searchUrlTemplate) {
    website.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: data.searchUrlTemplate,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return website;
}

/**
 * Create Product structured data
 *
 * @example
 * ```tsx
 * const product = createProduct({
 *   name: 'Premium Email Plan',
 *   description: 'Unlimited emails, advanced features',
 *   image: 'https://acme.com/premium.jpg',
 *   offers: {
 *     price: '99.00',
 *     priceCurrency: 'USD',
 *     availability: 'InStock'
 *   }
 * });
 * ```
 */
export function createProduct(data: Omit<Product, '@type'>): Product {
  return {
    '@type': 'Product',
    ...data,
  } as Product;
}

/**
 * Create FAQ Page structured data
 *
 * @example
 * ```tsx
 * const faq = createFAQPage([
 *   {
 *     question: 'What is your refund policy?',
 *     answer: 'We offer a 30-day money-back guarantee.'
 *   },
 *   {
 *     question: 'Do you offer support?',
 *     answer: 'Yes, 24/7 email and chat support is included.'
 *   }
 * ]);
 * ```
 */
export function createFAQPage(
  faqs: Array<{ question: string; answer: string }>
): FAQPage {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

/**
 * Create Article structured data
 *
 * @example
 * ```tsx
 * const article = createArticle({
 *   headline: '10 Email Marketing Tips',
 *   description: 'Learn how to improve your email campaigns',
 *   author: { name: 'Jane Doe' },
 *   publisher: {
 *     name: 'Acme',
 *     logo: 'https://acme.com/logo.png'
 *   },
 *   datePublished: '2024-01-15T10:00:00Z',
 *   image: 'https://acme.com/blog/tips.jpg'
 * });
 * ```
 */
export function createArticle(data: {
  headline: string;
  description?: string;
  image?: string | string[];
  author: Person | string;
  publisher: Organization;
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage?: string;
  type?: 'Article' | 'BlogPosting' | 'NewsArticle';
}): Article {
  return {
    '@type': data.type || 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    author: typeof data.author === 'string' ? data.author : data.author,
    publisher: data.publisher,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    mainEntityOfPage: data.mainEntityOfPage,
  };
}

/**
 * Create Breadcrumb List structured data
 *
 * @example
 * ```tsx
 * const breadcrumbs = createBreadcrumbList([
 *   { name: 'Home', url: 'https://acme.com' },
 *   { name: 'Blog', url: 'https://acme.com/blog' },
 *   { name: 'Email Tips', url: 'https://acme.com/blog/email-tips' }
 * ]);
 * ```
 */
export function createBreadcrumbList(
  items: Array<{ name: string; url?: string }>
): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Serialize structured data to JSON-LD string
 * Safe for use in script tags
 */
export function serializeStructuredData(data: Thing | Thing[]): string {
  const jsonLd = Array.isArray(data)
    ? { '@context': 'https://schema.org', '@graph': data }
    : { '@context': 'https://schema.org', ...data };

  return JSON.stringify(jsonLd);
}
