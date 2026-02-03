# I18nMetaTags

Internationalization meta tags (hreflang, alternates).

## Import

```typescript
import { I18nMetaTags } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<I18nMetaTags
  currentLocale="en"
  pathname="/about"
  baseUrl="https://example.com"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentLocale` | `string` | Yes | Current locale |
| `pathname` | `string` | Yes | Current pathname |
| `baseUrl` | `string` | Yes | Site base URL |

## Generated Tags

Automatically generates:
- Canonical URL
- hreflang alternate links for all locales
- x-default alternate link
- og:locale meta tag
- og:locale:alternate meta tags

## Examples

```typescript
// Basic usage
<I18nMetaTags
  currentLocale={locale}
  pathname="/pricing"
  baseUrl="https://mysite.com"
/>
```

## See Also

- [SEOMetaTags](./SEOMetaTags.md)
- [LanguageSelector](./layout/LanguageSelector.md)
- [Internationalization Guide](../features/internationalization.md)
