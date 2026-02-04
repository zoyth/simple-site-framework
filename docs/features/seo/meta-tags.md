# Meta Tags

Configure page titles, descriptions, and meta tags for search engines.

## SEOMetaTags Component

```typescript
import { SEOMetaTags } from '@zoyth/simple-site-framework/components';

<SEOMetaTags
  title="About Us | My Company"
  description="Learn about our team and mission"
  canonical="https://example.com/about"
  keywords={['company', 'about', 'team']}
  robots="index, follow"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Page title (displayed in browser tab and search results) |
| `description` | `string` | Yes | Meta description (displayed in search result snippets) |
| `canonical` | `string` | No | Canonical URL for the page |
| `keywords` | `string[]` | No | Meta keywords (low SEO value but still used) |
| `robots` | `string` | No | Robots directive (default: 'index, follow') |
| `openGraph` | `OpenGraphProps` | No | Open Graph metadata |
| `twitter` | `TwitterProps` | No | Twitter Card metadata |

## Page Titles

### Format

Follow consistent title patterns:

```typescript
// Page title | Site name
<SEOMetaTags title="About Us | My Company" />

// For homepage
<SEOMetaTags title="My Company - Professional Services" />
```

### Guidelines

- 50-60 characters maximum
- Include primary keyword
- Place important words first
- Include brand name

## Meta Descriptions

### Guidelines

- 150-160 characters maximum
- Include target keywords naturally
- Write compelling copy that encourages clicks
- Unique per page

```typescript
<SEOMetaTags
  description="Get professional accounting services tailored to small businesses. Free consultation available."
/>
```

## Robots Directives

Control search engine behavior:

```typescript
// Default - index and follow links
<SEOMetaTags robots="index, follow" />

// Don't index but follow links
<SEOMetaTags robots="noindex, follow" />

// Don't index or follow
<SEOMetaTags robots="noindex, nofollow" />

// No archive/cache
<SEOMetaTags robots="index, follow, noarchive" />
```

## Localized Meta Tags

Use with i18n:

```typescript
const title = {
  en: 'About Us | My Company',
  fr: 'À propos | Mon Entreprise',
};

const description = {
  en: 'Learn about our team',
  fr: 'Découvrez notre équipe',
};

<SEOMetaTags
  title={getLocalizedString(title, locale)}
  description={getLocalizedString(description, locale)}
/>
```

## Next.js Metadata API

The framework is compatible with Next.js Metadata:

```typescript
// app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | My Company',
  description: 'Learn about our team',
};
```

Use whichever approach fits your project. SEOMetaTags provides more dynamic control; Next.js Metadata is static and simpler.

## See Also

- [Open Graph](./open-graph.md)
- [Canonical URLs](./canonical-urls.md)
- [SEOMetaTags Component](../../components/SEOMetaTags.md)
