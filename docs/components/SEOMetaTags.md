# SEOMetaTags

SEO meta tags component for page metadata.

## Import

```typescript
import { SEOMetaTags } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<SEOMetaTags
  title="Page Title"
  description="Page description for search engines"
  canonical="https://example.com/page"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Page title |
| `description` | `string` | Yes | Meta description |
| `canonical` | `string` | No | Canonical URL |
| `ogImage` | `string` | No | Open Graph image |
| `ogType` | `string` | No | Open Graph type |
| `noindex` | `boolean` | No | Prevent indexing |

## Examples

```typescript
// Blog post
<SEOMetaTags
  title="How to Build Fast Websites"
  description="Learn the best practices for building fast, performant websites"
  canonical="https://example.com/blog/fast-websites"
  ogImage="https://example.com/images/blog-og.jpg"
  ogType="article"
/>

// No index
<SEOMetaTags
  title="Admin Dashboard"
  description="Internal dashboard"
  noindex
/>
```

## See Also

- [I18nMetaTags](./I18nMetaTags.md)
- [StructuredData](./StructuredData.md)
- [SEO Guide](../guides/seo-optimization.md)
