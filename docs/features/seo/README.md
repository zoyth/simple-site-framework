# SEO

Search engine optimization tools and components.

## Overview

Simple Site Framework provides built-in SEO support:

- Meta tag management
- Structured data (Schema.org)
- XML sitemap generation
- Open Graph / social media previews
- Canonical URL management
- Multi-language SEO (hreflang)

## Quick Start

```typescript
import { SEOMetaTags, StructuredData } from '@zoyth/simple-site-framework/components';

<SEOMetaTags
  title="My Page"
  description="Page description for search results"
  canonical="https://example.com/page"
/>

<StructuredData
  data={{
    '@type': 'Organization',
    name: 'My Company',
    url: 'https://example.com',
  }}
/>
```

## Topics

- [Meta Tags](./meta-tags.md) - Title, description, and meta tags
- [Structured Data](./structured-data.md) - Schema.org JSON-LD markup
- [Sitemaps](./sitemaps.md) - XML sitemap generation
- [Open Graph](./open-graph.md) - Social media preview cards
- [Robots.txt](./robots-txt.md) - Search engine crawl rules
- [Canonical URLs](./canonical-urls.md) - Canonical URL management
- [Best Practices](./best-practices.md) - SEO optimization tips

## See Also

- [SEO Optimization Guide](../../guides/seo-optimization.md)
- [SEOMetaTags Component](../../components/SEOMetaTags.md)
- [StructuredData Component](../../components/StructuredData.md)
- [Existing SEO Documentation](../../SEO.md)
