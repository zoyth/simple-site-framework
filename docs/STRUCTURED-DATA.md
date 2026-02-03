# Structured Data (JSON-LD) Guide

Complete guide to implementing schema.org structured data with JSON-LD for rich search results.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Schema Types](#schema-types)
- [Helper Functions](#helper-functions)
- [StructuredData Component](#structureddata-component)
- [Common Patterns](#common-patterns)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Overview

Structured data helps search engines understand your content better, enabling:

- **Rich snippets**: Enhanced search results with ratings, prices, images
- **Knowledge panels**: Dedicated information boxes in search results
- **Voice search**: Better answers for voice assistants
- **Click-through rates**: More attractive search results = more clicks

The framework provides:
- Type-safe schema.org interfaces
- Helper functions for creating structured data
- `<StructuredData>` component for rendering JSON-LD

## Quick Start

### 1. Organization Schema (Recommended for All Sites)

Add this to your root layout to tell search engines about your business:

```tsx
import { StructuredData } from 'simple-site-framework/components';
import { createOrganization } from 'simple-site-framework/lib/seo/structured-data';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organization = createOrganization({
    name: 'Acme Inc',
    url: 'https://acme.com',
    logo: 'https://acme.com/logo.png',
    description: 'Leading email marketing platform',
    email: 'hello@acme.com',
    telephone: '+1-555-1234',
    sameAs: [
      'https://twitter.com/acme',
      'https://facebook.com/acme',
      'https://linkedin.com/company/acme'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main St',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94102',
      addressCountry: 'US'
    }
  });

  return (
    <html>
      <head>
        <StructuredData data={organization} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. WebSite Schema with Search

Enable Google's sitelinks search box:

```tsx
import { createWebSite } from 'simple-site-framework/lib/seo/structured-data';

const website = createWebSite({
  name: 'Acme',
  url: 'https://acme.com',
  description: 'Email marketing platform',
  searchUrlTemplate: 'https://acme.com/search?q={search_term_string}'
});

<StructuredData data={website} />
```

### 3. Multiple Schemas on One Page

Combine multiple structured data objects:

```tsx
import { StructuredData } from 'simple-site-framework/components';
import {
  createOrganization,
  createWebSite,
  createBreadcrumbList
} from 'simple-site-framework/lib/seo/structured-data';

export default function Page() {
  const data = [
    createOrganization({ name: 'Acme', url: 'https://acme.com' }),
    createWebSite({ name: 'Acme', url: 'https://acme.com' }),
    createBreadcrumbList([
      { name: 'Home', url: 'https://acme.com' },
      { name: 'Products', url: 'https://acme.com/products' }
    ])
  ];

  return (
    <>
      <StructuredData data={data} />
      <main>...</main>
    </>
  );
}
```

## Schema Types

### Organization

Describe your company/organization:

```tsx
import { createOrganization } from 'simple-site-framework/lib/seo/structured-data';

const org = createOrganization({
  name: 'Acme Inc',
  url: 'https://acme.com',
  logo: 'https://acme.com/logo.png',
  description: 'Email marketing platform',
  email: 'hello@acme.com',
  telephone: '+1-555-1234',

  // Address
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Main St',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94102',
    addressCountry: 'US'
  },

  // Social media profiles
  sameAs: [
    'https://twitter.com/acme',
    'https://facebook.com/acme',
    'https://linkedin.com/company/acme',
    'https://github.com/acme'
  ],

  // Contact points
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+1-555-SALES',
      email: 'sales@acme.com',
      contactType: 'sales',
      availableLanguage: ['English', 'French'],
      areaServed: ['US', 'CA']
    },
    {
      '@type': 'ContactPoint',
      telephone: '+1-555-SUPPORT',
      email: 'support@acme.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Spanish']
    }
  ],

  // Founders
  founders: [
    {
      '@type': 'Person',
      name: 'Jane Doe',
      jobTitle: 'CEO',
      image: 'https://acme.com/team/jane.jpg'
    }
  ],

  foundingDate: '2020-01-15'
});
```

### WebSite

Define your website with optional search functionality:

```tsx
import { createWebSite } from 'simple-site-framework/lib/seo/structured-data';

const website = createWebSite({
  name: 'Acme',
  url: 'https://acme.com',
  description: 'The best email marketing platform',

  // Enable Google's sitelinks search box
  searchUrlTemplate: 'https://acme.com/search?q={search_term_string}',

  publisher: createOrganization({
    name: 'Acme Inc',
    url: 'https://acme.com'
  })
});
```

### Product

Product pages for e-commerce or SaaS plans:

```tsx
import { createProduct } from 'simple-site-framework/lib/seo/structured-data';

const product = createProduct({
  name: 'Premium Email Plan',
  description: 'Unlimited emails, advanced automation, priority support',
  image: [
    'https://acme.com/images/premium-1.jpg',
    'https://acme.com/images/premium-2.jpg'
  ],

  brand: createOrganization({
    name: 'Acme',
    url: 'https://acme.com'
  }),

  offers: {
    '@type': 'Offer',
    price: '99.00',
    priceCurrency: 'USD',
    priceValidUntil: '2024-12-31',
    availability: 'InStock',
    url: 'https://acme.com/pricing/premium',
    seller: createOrganization({
      name: 'Acme Inc',
      url: 'https://acme.com'
    })
  },

  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    reviewCount: 127,
    bestRating: 5,
    worstRating: 1
  },

  review: [
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'John Smith'
      },
      datePublished: '2024-01-15',
      reviewBody: 'Excellent email platform! Easy to use and great support.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5
      }
    }
  ]
});
```

### FAQ Page

FAQ pages with questions and answers:

```tsx
import { createFAQPage } from 'simple-site-framework/lib/seo/structured-data';

const faq = createFAQPage([
  {
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day money-back guarantee on all plans. No questions asked.'
  },
  {
    question: 'Do you offer customer support?',
    answer: 'Yes! We provide 24/7 email and chat support to all customers, plus phone support for Premium plans.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. Cancel your subscription anytime from your account dashboard. No cancellation fees.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use bank-level encryption (AES-256) and are SOC 2 Type II certified.'
  }
]);

<StructuredData data={faq} />
```

### Article / Blog Post

Blog posts and articles:

```tsx
import { createArticle } from 'simple-site-framework/lib/seo/structured-data';

const article = createArticle({
  type: 'BlogPosting', // or 'Article' or 'NewsArticle'
  headline: '10 Email Marketing Tips to Triple Your ROI',
  description: 'Learn proven strategies to boost your email marketing performance',
  image: [
    'https://acme.com/blog/email-tips-hero.jpg',
    'https://acme.com/blog/email-tips-square.jpg'
  ],

  author: {
    '@type': 'Person',
    name: 'Jane Doe',
    url: 'https://acme.com/authors/jane-doe',
    image: 'https://acme.com/authors/jane.jpg',
    jobTitle: 'Head of Marketing'
  },

  publisher: createOrganization({
    name: 'Acme Blog',
    url: 'https://acme.com/blog',
    logo: 'https://acme.com/logo.png'
  }),

  datePublished: '2024-01-15T10:00:00Z',
  dateModified: '2024-01-20T14:30:00Z',
  mainEntityOfPage: 'https://acme.com/blog/email-marketing-tips'
});
```

### Breadcrumbs

Navigation breadcrumbs for better site structure:

```tsx
import { createBreadcrumbList } from 'simple-site-framework/lib/seo/structured-data';

const breadcrumbs = createBreadcrumbList([
  { name: 'Home', url: 'https://acme.com' },
  { name: 'Blog', url: 'https://acme.com/blog' },
  { name: 'Email Marketing', url: 'https://acme.com/blog/category/email-marketing' },
  { name: '10 Email Tips' } // Current page (no URL)
]);

<StructuredData data={breadcrumbs} />
```

## Helper Functions

### createOrganization()

```tsx
function createOrganization(data: Omit<Organization, '@type'>): Organization
```

### createWebSite()

```tsx
function createWebSite(data: {
  name: string;
  url: string;
  description?: string;
  publisher?: Organization;
  searchUrlTemplate?: string;
}): WebSite
```

### createProduct()

```tsx
function createProduct(data: Omit<Product, '@type'>): Product
```

### createFAQPage()

```tsx
function createFAQPage(
  faqs: Array<{ question: string; answer: string }>
): FAQPage
```

### createArticle()

```tsx
function createArticle(data: {
  headline: string;
  description?: string;
  image?: string | string[];
  author: Person | string;
  publisher: Organization;
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage?: string;
  type?: 'Article' | 'BlogPosting' | 'NewsArticle';
}): Article
```

### createBreadcrumbList()

```tsx
function createBreadcrumbList(
  items: Array<{ name: string; url?: string }>
): BreadcrumbList
```

### serializeStructuredData()

Manually serialize structured data to JSON-LD string:

```tsx
function serializeStructuredData(data: Thing | Thing[]): string
```

## StructuredData Component

```tsx
import { StructuredData } from 'simple-site-framework/components';

interface StructuredDataProps {
  /** Structured data object or array of objects */
  data: Thing | Thing[];
}
```

The component renders a `<script type="application/ld+json">` tag with your structured data.

## Common Patterns

### Homepage

```tsx
import { StructuredData } from 'simple-site-framework/components';
import { createOrganization, createWebSite } from 'simple-site-framework/lib/seo/structured-data';

export default function HomePage() {
  const data = [
    createOrganization({
      name: 'Acme Inc',
      url: 'https://acme.com',
      logo: 'https://acme.com/logo.png',
      sameAs: ['https://twitter.com/acme']
    }),
    createWebSite({
      name: 'Acme',
      url: 'https://acme.com',
      searchUrlTemplate: 'https://acme.com/search?q={search_term_string}'
    })
  ];

  return (
    <>
      <StructuredData data={data} />
      <main>...</main>
    </>
  );
}
```

### Product/Pricing Page

```tsx
const product = createProduct({
  name: 'Premium Plan',
  description: 'Full-featured email marketing',
  offers: {
    '@type': 'Offer',
    price: '99.00',
    priceCurrency: 'USD',
    availability: 'InStock'
  }
});

const breadcrumbs = createBreadcrumbList([
  { name: 'Home', url: 'https://acme.com' },
  { name: 'Pricing', url: 'https://acme.com/pricing' },
  { name: 'Premium Plan' }
]);

<StructuredData data={[product, breadcrumbs]} />
```

### Blog Post

```tsx
const article = createArticle({
  headline: 'Blog Post Title',
  author: { '@type': 'Person', name: 'Jane Doe' },
  publisher: createOrganization({ name: 'Acme Blog' }),
  datePublished: '2024-01-15T10:00:00Z',
  image: 'https://acme.com/blog/image.jpg'
});

const breadcrumbs = createBreadcrumbList([
  { name: 'Home', url: 'https://acme.com' },
  { name: 'Blog', url: 'https://acme.com/blog' },
  { name: 'Post Title' }
]);

<StructuredData data={[article, breadcrumbs]} />
```

### FAQ Page

```tsx
const faq = createFAQPage([
  { question: 'Q1?', answer: 'A1' },
  { question: 'Q2?', answer: 'A2' }
]);

<StructuredData data={faq} />
```

## Testing

### Google's Rich Results Test

1. Go to: https://search.google.com/test/rich-results
2. Enter your URL or paste HTML
3. Check for errors and warnings
4. Preview how it appears in search

### Schema.org Validator

1. Go to: https://validator.schema.org/
2. Paste your JSON-LD
3. Verify structure matches schema.org spec

### Manual Inspection

```tsx
// View rendered JSON-LD in browser DevTools
document.querySelector('script[type="application/ld+json"]').textContent
```

## Best Practices

### 1. Use Absolute URLs

Always use absolute URLs (https://...) never relative (/page):

```tsx
// ✅ Good
image: 'https://acme.com/image.jpg'
url: 'https://acme.com/page'

// ❌ Bad
image: '/image.jpg'
url: '/page'
```

### 2. Match Visible Content

Structured data should match what users see on the page:

```tsx
// ✅ Good - Matches H1 on page
headline: '10 Email Marketing Tips'

// ❌ Bad - Different from H1
headline: 'Amazing Email Tips You Won\'t Believe!'
```

### 3. Use ISO 8601 Dates

```tsx
// ✅ Good
datePublished: '2024-01-15T10:00:00Z'
datePublished: '2024-01-15'

// ❌ Bad
datePublished: 'January 15, 2024'
datePublished: '01/15/2024'
```

### 4. Multiple Images

Provide multiple image sizes for better rich results:

```tsx
image: [
  'https://acme.com/image-1200x630.jpg', // OG image (1.91:1)
  'https://acme.com/image-800x800.jpg',  // Square (1:1)
  'https://acme.com/image-1600x900.jpg'  // 16:9
]
```

### 5. Complete Publisher Info

Articles require complete publisher with logo:

```tsx
publisher: {
  '@type': 'Organization',
  name: 'Acme Blog',
  logo: 'https://acme.com/logo.png' // Required
}
```

### 6. Rating Values

Use numeric values with proper ranges:

```tsx
// ✅ Good
aggregateRating: {
  '@type': 'AggregateRating',
  ratingValue: 4.8,
  bestRating: 5,
  worstRating: 1,
  reviewCount: 127
}

// ❌ Bad - Missing context
aggregateRating: {
  '@type': 'AggregateRating',
  ratingValue: 4.8
}
```

### 7. Avoid Spam

Don't add structured data for content not on the page:

```tsx
// ❌ Bad - Review not visible on page
review: [{
  author: 'Fake Reviewer',
  reviewBody: 'Amazing product!',
  reviewRating: { ratingValue: 5 }
}]
```

### 8. Test Before Deploy

Always test with Google's Rich Results Test before deploying.

### 9. Monitor Search Console

Check Google Search Console → Enhancements for errors and warnings.

### 10. Keep It Updated

Update `dateModified` when content changes significantly.

## Checklist

- [ ] Organization schema on all pages
- [ ] WebSite schema with search action (homepage)
- [ ] Product schema on product/pricing pages
- [ ] Article schema on blog posts
- [ ] FAQ schema on FAQ pages
- [ ] Breadcrumbs on deep pages
- [ ] All URLs are absolute (https://)
- [ ] Dates in ISO 8601 format
- [ ] Images are high quality (min 1200px wide)
- [ ] Tested with Google Rich Results Test
- [ ] No errors in Search Console

## Resources

- [Schema.org Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [JSON-LD Playground](https://json-ld.org/playground/)
