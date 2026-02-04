# Robots.txt

Control search engine crawling behavior.

## Overview

The `robots.txt` file tells search engine crawlers which pages to crawl and which to skip.

## Next.js Configuration

Use the Next.js App Router convention:

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

## Common Configurations

### Allow All (Default)

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

### Block Specific Paths

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/draft/',
        '/thank-you',   // Post-conversion pages
      ],
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

### Different Rules Per Bot

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

### Staging Environment

Block all crawling on staging:

```typescript
export default function robots(): MetadataRoute.Robots {
  if (process.env.NODE_ENV !== 'production') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

## Crawl Delay

Add crawl delay for polite crawling:

```typescript
rules: {
  userAgent: '*',
  allow: '/',
  crawlDelay: 10, // seconds between requests
}
```

## Verification

Visit `http://localhost:3000/robots.txt` to check output.

## Best Practices

- Always include sitemap reference
- Block API routes and admin pages
- Block staging/preview environments entirely
- Don't block CSS/JS files (search engines need them for rendering)
- Use noindex meta tag for pages that should appear in sitemap but not search
- Test with Google Search Console

## See Also

- [Sitemaps](./sitemaps.md)
- [Meta Tags](./meta-tags.md)
