# Sitemaps

XML sitemap generation for search engine discovery.

## Overview

Sitemaps help search engines discover and index all pages on your site. The framework supports sitemap generation for multi-language sites.

## Next.js Sitemap

Use the Next.js App Router sitemap convention:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://example.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
```

## Multi-Language Sitemaps

Include locale alternates:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://example.com';
  const locales = ['en', 'fr', 'es'];
  const pages = ['', '/about', '/services', '/contact'];

  return pages.flatMap(page =>
    locales.map(locale => ({
      url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}${page}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [
            l,
            `${baseUrl}${l === 'en' ? '' : `/${l}`}${page}`,
          ])
        ),
      },
    }))
  );
}
```

## Dynamic Sitemaps

Generate from data sources:

```typescript
// app/sitemap.ts
export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://example.com';

  // Fetch dynamic pages
  const posts = await getBlogPosts();
  const services = await getServices();

  const staticPages = [
    { url: baseUrl, priority: 1 },
    { url: `${baseUrl}/about`, priority: 0.8 },
  ];

  const blogPages = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    priority: 0.6,
  }));

  const servicePages = services.map(service => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updatedAt,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...servicePages];
}
```

## Sitemap Index

For large sites, split into multiple sitemaps:

```typescript
// app/sitemap.ts
export async function generateSitemaps() {
  const totalPages = await getPageCount();
  const sitemapsNeeded = Math.ceil(totalPages / 50000);

  return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }) {
  const start = id * 50000;
  const pages = await getPages(start, 50000);

  return pages.map(page => ({
    url: `https://example.com${page.path}`,
    lastModified: page.updatedAt,
  }));
}
```

## Verification

### Google Search Console

1. Submit sitemap URL in Search Console
2. Monitor indexing status
3. Check for errors

### Test Locally

Visit `http://localhost:3000/sitemap.xml` to verify output.

## Best Practices

- Include all important pages
- Set accurate `lastModified` dates
- Use appropriate `priority` values (0.0 to 1.0)
- Keep sitemaps under 50,000 URLs
- Update sitemap when content changes
- Submit sitemap to Google Search Console

## See Also

- [Existing Sitemap Documentation](../../SITEMAP.md)
- [Robots.txt](./robots-txt.md)
- [Canonical URLs](./canonical-urls.md)
