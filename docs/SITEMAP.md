# Sitemap Generation Guide

Complete guide to generating XML sitemaps for better SEO and search engine crawling.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Single-Language Sitemaps](#single-language-sitemaps)
- [Multi-Language Sitemaps](#multi-language-sitemaps)
- [Configuration Options](#configuration-options)
- [Next.js Integration](#nextjs-integration)
- [Dynamic Routes](#dynamic-routes)
- [Best Practices](#best-practices)
- [Testing](#testing)

## Overview

A sitemap is an XML file that lists all important pages on your website, helping search engines:

- **Discover** all your pages efficiently
- **Understand** your site structure
- **Crawl** pages in the right order
- **Index** content faster
- **Recognize** multi-language pages with hreflang

The framework provides utilities to:
- Generate valid XML sitemaps
- Support multi-language sites with hreflang
- Configure priority and change frequency
- Validate sitemap entries

## Quick Start

### Basic Sitemap

Create a simple sitemap for a single-language site:

```tsx
// app/sitemap.xml/route.ts
import { generateSitemap, createSitemapEntry } from 'simple-site-framework/lib/seo/sitemap';

export async function GET() {
  const sitemap = generateSitemap({
    baseUrl: 'https://acme.com',
    entries: [
      createSitemapEntry('https://acme.com', '/', {
        priority: 1.0,
        changeFrequency: 'weekly'
      }),
      createSitemapEntry('https://acme.com', '/about', {
        priority: 0.8,
        changeFrequency: 'monthly'
      }),
      createSitemapEntry('https://acme.com', '/products', {
        priority: 0.9,
        changeFrequency: 'daily'
      }),
      createSitemapEntry('https://acme.com', '/pricing', {
        priority: 0.9,
        changeFrequency: 'weekly'
      }),
      createSitemapEntry('https://acme.com', '/blog', {
        priority: 0.7,
        changeFrequency: 'daily'
      })
    ]
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate'
    }
  });
}
```

This creates: `https://acme.com/sitemap.xml`

## Single-Language Sitemaps

### Manual Entry Creation

```tsx
import { createSitemapEntry } from 'simple-site-framework/lib/seo/sitemap';

const entries = [
  // Homepage - highest priority
  createSitemapEntry('https://acme.com', '/', {
    priority: 1.0,
    changeFrequency: 'weekly',
    lastModified: new Date('2024-01-15')
  }),

  // Key product pages
  createSitemapEntry('https://acme.com', '/pricing', {
    priority: 0.9,
    changeFrequency: 'weekly'
  }),
  createSitemapEntry('https://acme.com', '/features', {
    priority: 0.9,
    changeFrequency: 'monthly'
  }),

  // About/contact
  createSitemapEntry('https://acme.com', '/about', {
    priority: 0.7,
    changeFrequency: 'monthly'
  }),
  createSitemapEntry('https://acme.com', '/contact', {
    priority: 0.6,
    changeFrequency: 'yearly'
  }),

  // Blog - frequently updated
  createSitemapEntry('https://acme.com', '/blog', {
    priority: 0.7,
    changeFrequency: 'daily'
  })
];
```

### With Last Modified Dates

```tsx
const entries = [
  createSitemapEntry('https://acme.com', '/', {
    priority: 1.0,
    lastModified: new Date(), // Current date
    changeFrequency: 'weekly'
  }),
  createSitemapEntry('https://acme.com', '/blog/post-1', {
    priority: 0.6,
    lastModified: '2024-01-15T10:00:00Z', // ISO 8601 string
    changeFrequency: 'never'
  })
];
```

## Multi-Language Sitemaps

### Using createMultiLanguageEntries()

Generate entries for pages that exist in multiple languages:

```tsx
import {
  generateSitemap,
  createMultiLanguageEntries
} from 'simple-site-framework/lib/seo/sitemap';

const locales = ['en', 'fr', 'es'];
const baseUrl = 'https://acme.com';

const entries = [
  // Homepage in all languages
  ...createMultiLanguageEntries(
    baseUrl,
    '/',
    locales,
    'en', // Default locale for x-default
    { priority: 1.0, changeFrequency: 'weekly' }
  ),

  // About page in all languages
  ...createMultiLanguageEntries(
    baseUrl,
    '/about',
    locales,
    'en',
    { priority: 0.8, changeFrequency: 'monthly' }
  ),

  // Pricing page in all languages
  ...createMultiLanguageEntries(
    baseUrl,
    '/pricing',
    locales,
    'en',
    { priority: 0.9, changeFrequency: 'weekly' }
  )
];

const sitemap = generateSitemap({ baseUrl, entries });
```

This creates entries like:
```xml
<url>
  <loc>https://acme.com/en/about</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://acme.com/en/about" />
  <xhtml:link rel="alternate" hreflang="fr" href="https://acme.com/fr/about" />
  <xhtml:link rel="alternate" hreflang="es" href="https://acme.com/es/about" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://acme.com/en/about" />
  <priority>0.8</priority>
  <changefreq>monthly</changefreq>
</url>
```

### Manual Multi-Language Entries

For more control, create entries manually:

```tsx
const entries = [
  {
    url: 'https://acme.com/en/about',
    priority: 0.8,
    alternates: [
      { hreflang: 'en', href: 'https://acme.com/en/about' },
      { hreflang: 'fr', href: 'https://acme.com/fr/about' },
      { hreflang: 'es', href: 'https://acme.com/es/about' },
      { hreflang: 'x-default', href: 'https://acme.com/en/about' }
    ]
  },
  {
    url: 'https://acme.com/fr/about',
    priority: 0.8,
    alternates: [
      { hreflang: 'en', href: 'https://acme.com/en/about' },
      { hreflang: 'fr', href: 'https://acme.com/fr/about' },
      { hreflang: 'es', href: 'https://acme.com/es/about' },
      { hreflang: 'x-default', href: 'https://acme.com/en/about' }
    ]
  }
];
```

## Configuration Options

### Priority (0.0 - 1.0)

Indicates the importance of a page relative to other pages on your site:

```tsx
createSitemapEntry(baseUrl, '/', { priority: 1.0 })           // Homepage - highest
createSitemapEntry(baseUrl, '/pricing', { priority: 0.9 })    // Key pages
createSitemapEntry(baseUrl, '/about', { priority: 0.7 })      // Secondary pages
createSitemapEntry(baseUrl, '/terms', { priority: 0.3 })      // Legal pages
```

**Recommended priorities:**
- 1.0: Homepage
- 0.9: Key product/service pages
- 0.7-0.8: Important content pages
- 0.5-0.6: Blog posts, articles
- 0.3-0.4: Legal pages, archives

### Change Frequency

How often the page is likely to change:

```tsx
changeFrequency: 'always'  // Changes every time it's accessed (rare)
changeFrequency: 'hourly'  // Real-time data, live scores
changeFrequency: 'daily'   // News, blog homepage, active content
changeFrequency: 'weekly'  // Homepage, pricing, features
changeFrequency: 'monthly' // About, team, documentation
changeFrequency: 'yearly'  // Terms, privacy, legal pages
changeFrequency: 'never'   // Archived content
```

**Note:** This is a *hint* to search engines, not a directive.

### Last Modified

When the page was last changed:

```tsx
// Using Date object
lastModified: new Date()
lastModified: new Date('2024-01-15')

// Using ISO 8601 string
lastModified: '2024-01-15T10:00:00Z'
lastModified: '2024-01-15'
```

### Pretty Print

Format XML for human readability:

```tsx
const sitemap = generateSitemap({
  baseUrl: 'https://acme.com',
  entries: [...],
  prettyPrint: true // Adds indentation and line breaks
});
```

**Use pretty print for:**
- Development/debugging
- Manual inspection

**Don't use pretty print for:**
- Production (larger file size)
- When file size matters

## Next.js Integration

### App Router (Next.js 13+)

Create a Route Handler for the sitemap:

```tsx
// app/sitemap.xml/route.ts
import { generateSitemap, createSitemapEntry } from 'simple-site-framework/lib/seo/sitemap';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  const staticEntries = [
    createSitemapEntry(baseUrl, '/', { priority: 1.0, changeFrequency: 'weekly' }),
    createSitemapEntry(baseUrl, '/about', { priority: 0.8 }),
    createSitemapEntry(baseUrl, '/pricing', { priority: 0.9 })
  ];

  const sitemap = generateSitemap({
    baseUrl,
    entries: staticEntries
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate'
    }
  });
}
```

### Multi-Language App Router

```tsx
// app/sitemap.xml/route.ts
import { generateSitemap, createMultiLanguageEntries } from 'simple-site-framework/lib/seo/sitemap';
import { getI18nConfig } from '@/config/i18n';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const { locales, defaultLocale } = getI18nConfig();

  // Static pages
  const staticPages = ['/', '/about', '/pricing', '/features'];

  const entries = staticPages.flatMap(page =>
    createMultiLanguageEntries(
      baseUrl,
      page,
      locales,
      defaultLocale,
      {
        priority: page === '/' ? 1.0 : 0.8,
        changeFrequency: 'weekly'
      }
    )
  );

  const sitemap = generateSitemap({ baseUrl, entries });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate'
    }
  });
}
```

## Dynamic Routes

### Blog Posts

Include dynamically generated content:

```tsx
// app/sitemap.xml/route.ts
import { generateSitemap, createSitemapEntry } from 'simple-site-framework/lib/seo/sitemap';

export async function GET() {
  const baseUrl = 'https://acme.com';

  // Static pages
  const staticEntries = [
    createSitemapEntry(baseUrl, '/', { priority: 1.0 }),
    createSitemapEntry(baseUrl, '/blog', { priority: 0.7, changeFrequency: 'daily' })
  ];

  // Fetch blog posts from database/CMS
  const posts = await fetchBlogPosts();

  const blogEntries = posts.map(post =>
    createSitemapEntry(baseUrl, `/blog/${post.slug}`, {
      priority: 0.6,
      changeFrequency: 'never',
      lastModified: post.updatedAt
    })
  );

  const sitemap = generateSitemap({
    baseUrl,
    entries: [...staticEntries, ...blogEntries]
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600'
    }
  });
}

async function fetchBlogPosts() {
  // Fetch from your CMS, database, etc.
  return [
    { slug: 'email-tips', updatedAt: '2024-01-15T10:00:00Z' },
    { slug: 'marketing-guide', updatedAt: '2024-01-20T14:30:00Z' }
  ];
}
```

### Multi-Language Dynamic Routes

```tsx
const posts = await fetchBlogPosts();

const blogEntries = posts.flatMap(post =>
  createMultiLanguageEntries(
    baseUrl,
    `/blog/${post.slug}`,
    locales,
    defaultLocale,
    {
      priority: 0.6,
      changeFrequency: 'never',
      lastModified: post.updatedAt
    }
  )
);
```

## Best Practices

### 1. Use Absolute URLs

Always use absolute URLs (https://...) never relative (/path):

```tsx
// ✅ Good
createSitemapEntry('https://acme.com', '/about')

// ❌ Bad
createSitemapEntry('acme.com', '/about')
createSitemapEntry('', '/about')
```

### 2. Include Important Pages Only

Don't include:
- Login/logout pages
- Admin pages
- Thank you pages
- Confirmation pages
- Pages with `noindex`

```tsx
// ✅ Good - Public pages only
const entries = [
  createSitemapEntry(baseUrl, '/'),
  createSitemapEntry(baseUrl, '/products'),
  createSitemapEntry(baseUrl, '/pricing')
];

// ❌ Bad - Includes private/irrelevant pages
const entries = [
  createSitemapEntry(baseUrl, '/admin'),
  createSitemapEntry(baseUrl, '/thank-you'),
  createSitemapEntry(baseUrl, '/cart')
];
```

### 3. Set Realistic Priorities

Don't set everything to 1.0:

```tsx
// ✅ Good - Varied priorities
createSitemapEntry(baseUrl, '/', { priority: 1.0 })
createSitemapEntry(baseUrl, '/pricing', { priority: 0.9 })
createSitemapEntry(baseUrl, '/blog/post', { priority: 0.6 })

// ❌ Bad - Everything is highest priority
createSitemapEntry(baseUrl, '/', { priority: 1.0 })
createSitemapEntry(baseUrl, '/terms', { priority: 1.0 })
createSitemapEntry(baseUrl, '/404', { priority: 1.0 })
```

### 4. Use Accurate Change Frequencies

Base it on actual update patterns:

```tsx
// ✅ Good
createSitemapEntry(baseUrl, '/', { changeFrequency: 'weekly' }) // Homepage updated weekly
createSitemapEntry(baseUrl, '/blog', { changeFrequency: 'daily' }) // New posts daily
createSitemapEntry(baseUrl, '/terms', { changeFrequency: 'yearly' }) // Rarely changes

// ❌ Bad
createSitemapEntry(baseUrl, '/terms', { changeFrequency: 'hourly' }) // Unrealistic
```

### 5. Keep Sitemap Under 50MB / 50,000 URLs

If you have more:
1. Create multiple sitemaps
2. Use a sitemap index file

```tsx
// sitemap-index.xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://acme.com/sitemap-main.xml</loc>
    <lastmod>2024-01-15T10:00:00Z</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://acme.com/sitemap-blog.xml</loc>
    <lastmod>2024-01-20T14:30:00Z</lastmod>
  </sitemap>
</sitemapindex>
```

### 6. Cache Appropriately

```tsx
return new Response(sitemap, {
  headers: {
    'Content-Type': 'application/xml',
    // Cache for 1 hour, revalidate in background
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate'
  }
});
```

### 7. Submit to Search Engines

After deploying your sitemap:

1. **Google Search Console**: Add sitemap URL
2. **Bing Webmaster Tools**: Submit sitemap
3. **robots.txt**: Reference sitemap

```
# robots.txt
User-agent: *
Allow: /

Sitemap: https://acme.com/sitemap.xml
```

### 8. Monitor for Errors

Check Search Console regularly for:
- Sitemap parsing errors
- URL errors
- Coverage issues

## Testing

### Validate XML

```tsx
import { validateSitemap } from 'simple-site-framework/lib/seo/sitemap';

const config = {
  baseUrl: 'https://acme.com',
  entries: [...]
};

const result = validateSitemap(config);

if (!result.isValid) {
  console.error('Sitemap validation errors:', result.errors);
}
```

### Manual Testing

1. Visit `https://yoursite.com/sitemap.xml`
2. View source to inspect XML
3. Verify all URLs are absolute
4. Check hreflang alternates are correct

### Google Search Console

1. Go to: Sitemaps section
2. Submit sitemap URL
3. Check for errors after processing

### XML Validators

- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- https://xmlvalidation.com/

## Example: Complete Implementation

```tsx
// app/sitemap.xml/route.ts
import {
  generateSitemap,
  createSitemapEntry,
  createMultiLanguageEntries,
  validateSitemap
} from 'simple-site-framework/lib/seo/sitemap';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const locales = ['en', 'fr', 'es'];
  const defaultLocale = 'en';

  // Static pages
  const staticPages = [
    { path: '/', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/pricing', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/features', priority: 0.9, changeFreq: 'monthly' as const }
  ];

  const staticEntries = staticPages.flatMap(page =>
    createMultiLanguageEntries(
      baseUrl,
      page.path,
      locales,
      defaultLocale,
      {
        priority: page.priority,
        changeFrequency: page.changeFreq
      }
    )
  );

  // Dynamic blog posts
  const posts = await fetchBlogPosts();
  const blogEntries = posts.flatMap(post =>
    createMultiLanguageEntries(
      baseUrl,
      `/blog/${post.slug}`,
      locales,
      defaultLocale,
      {
        priority: 0.6,
        changeFrequency: 'never',
        lastModified: post.updatedAt
      }
    )
  );

  const config = {
    baseUrl,
    entries: [...staticEntries, ...blogEntries]
  };

  // Validate before generating
  const validation = validateSitemap(config);
  if (!validation.isValid) {
    console.error('Sitemap validation errors:', validation.errors);
  }

  const sitemap = generateSitemap(config);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate'
    }
  });
}

async function fetchBlogPosts() {
  // Fetch from database/CMS
  return [];
}
```

## Checklist

- [ ] Sitemap accessible at /sitemap.xml
- [ ] All URLs are absolute (https://)
- [ ] No duplicate URLs
- [ ] All URLs return 200 status
- [ ] Priority values between 0.0 and 1.0
- [ ] Change frequencies are realistic
- [ ] Multi-language pages have hreflang alternates
- [ ] x-default points to default language
- [ ] Submitted to Google Search Console
- [ ] Submitted to Bing Webmaster Tools
- [ ] Referenced in robots.txt
- [ ] Under 50MB and 50,000 URLs
- [ ] Appropriate caching headers
- [ ] No errors in Search Console

## Resources

- [Sitemaps.org Protocol](https://www.sitemaps.org/protocol.html)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Google hreflang Guidelines](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
