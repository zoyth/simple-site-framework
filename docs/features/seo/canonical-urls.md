# Canonical URLs

Prevent duplicate content issues with canonical URL management.

## Overview

Canonical URLs tell search engines which version of a page is the "official" one, preventing duplicate content penalties when the same content is accessible at multiple URLs.

## Setting Canonical URLs

### Via SEOMetaTags

```typescript
import { SEOMetaTags } from '@zoyth/simple-site-framework/components';

<SEOMetaTags
  title="About Us"
  description="Learn about our company"
  canonical="https://example.com/about"
/>
```

### Via Next.js Metadata

```typescript
// app/about/page.tsx
export const metadata = {
  alternates: {
    canonical: 'https://example.com/about',
  },
};
```

## When Canonicals Matter

### Trailing Slashes

```
https://example.com/about
https://example.com/about/
```

Set canonical to one version consistently.

### Query Parameters

```
https://example.com/products
https://example.com/products?sort=price
https://example.com/products?page=2
```

Canonical should point to the base URL (without parameters) unless the parameter creates unique content.

### HTTP vs HTTPS

```
http://example.com/about
https://example.com/about
```

Always canonicalize to HTTPS.

### WWW vs Non-WWW

```
https://www.example.com/about
https://example.com/about
```

Pick one and canonicalize consistently.

## Multi-Language Canonicals

Each locale should have its own canonical:

```typescript
// English page
<SEOMetaTags
  canonical="https://example.com/about"
/>

// French page
<SEOMetaTags
  canonical="https://example.com/fr/about"
/>
```

Combined with hreflang tags:

```typescript
import { I18nMetaTags } from '@zoyth/simple-site-framework/components';

<I18nMetaTags
  currentLocale={locale}
  pathname="/about"
  baseUrl="https://example.com"
/>
```

This generates:
```html
<link rel="alternate" hreflang="en" href="https://example.com/about" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/about" />
<link rel="alternate" hreflang="x-default" href="https://example.com/about" />
```

## Dynamic Canonical URLs

Generate canonicals from route parameters:

```typescript
// app/[locale]/services/[slug]/page.tsx
export default function ServicePage({ params }) {
  const { locale, slug } = params;
  const baseUrl = 'https://example.com';
  const canonical = locale === 'en'
    ? `${baseUrl}/services/${slug}`
    : `${baseUrl}/${locale}/services/${slug}`;

  return (
    <SEOMetaTags
      title={service.title}
      description={service.description}
      canonical={canonical}
    />
  );
}
```

## Common Mistakes

### Self-Referencing Canonicals

Every page should have a canonical pointing to itself (this is correct, not a mistake):

```typescript
// ✅ Good - self-referencing canonical
<SEOMetaTags canonical="https://example.com/about" />
// on the page https://example.com/about
```

### Missing Canonicals

Pages without canonicals may confuse search engines:

```typescript
// ❌ Bad - no canonical
<SEOMetaTags title="About" description="..." />

// ✅ Good - always include canonical
<SEOMetaTags
  title="About"
  description="..."
  canonical="https://example.com/about"
/>
```

### Relative URLs

Always use absolute URLs:

```typescript
// ❌ Bad
<SEOMetaTags canonical="/about" />

// ✅ Good
<SEOMetaTags canonical="https://example.com/about" />
```

## Verification

Check canonical tags in:
1. Page source (View Source)
2. Google Search Console > URL Inspection
3. Browser DevTools > Elements > `<head>`

## See Also

- [Meta Tags](./meta-tags.md)
- [Sitemaps](./sitemaps.md)
- [I18nMetaTags Component](../../components/I18nMetaTags.md)
