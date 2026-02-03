# StructuredData

JSON-LD structured data component for rich snippets.

## Import

```typescript
import { StructuredData } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<StructuredData
  type="Organization"
  data={{
    name: "Acme Corp",
    url: "https://acme.com",
    logo: "https://acme.com/logo.png",
  }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `string` | Yes | Schema.org type |
| `data` | `object` | Yes | Structured data object |

## Supported Types

- `Organization`
- `WebSite`
- `Article`
- `BreadcrumbList`
- `FAQPage`
- `Product`
- `Review`

## Examples

```typescript
// Organization
<StructuredData
  type="Organization"
  data={{
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Acme Corporation",
    url: "https://acme.com",
    logo: "https://acme.com/logo.png",
    sameAs: [
      "https://twitter.com/acmecorp",
      "https://linkedin.com/company/acmecorp"
    ]
  }}
/>

// Article
<StructuredData
  type="Article"
  data={{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Build Fast Websites",
    author: {
      "@type": "Person",
      name: "John Doe"
    },
    datePublished: "2024-01-15"
  }}
/>

// FAQ
<StructuredData
  type="FAQPage"
  data={{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }}
/>
```

## See Also

- [SEOMetaTags](./SEOMetaTags.md)
- [FAQAccordion](./FAQAccordion.md)
- [SEO Guide](../guides/seo-optimization.md)
