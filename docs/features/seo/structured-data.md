# Structured Data

Add Schema.org JSON-LD markup for rich search results.

## StructuredData Component

```typescript
import { StructuredData } from '@zoyth/simple-site-framework/components';

<StructuredData
  data={{
    '@type': 'Organization',
    name: 'My Company',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
  }}
/>
```

## Common Schema Types

### Organization

```typescript
<StructuredData
  data={{
    '@type': 'Organization',
    name: 'My Company',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
    },
    sameAs: [
      'https://facebook.com/mycompany',
      'https://twitter.com/mycompany',
      'https://linkedin.com/company/mycompany',
    ],
  }}
/>
```

### LocalBusiness

```typescript
<StructuredData
  data={{
    '@type': 'LocalBusiness',
    name: 'My Dental Practice',
    image: 'https://example.com/photo.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main St',
      addressLocality: 'Montreal',
      addressRegion: 'QC',
      postalCode: 'H1A 1A1',
      addressCountry: 'CA',
    },
    telephone: '+1-555-123-4567',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
  }}
/>
```

### Service

```typescript
<StructuredData
  data={{
    '@type': 'Service',
    name: 'Tax Preparation',
    description: 'Professional tax preparation for individuals and businesses',
    provider: {
      '@type': 'Organization',
      name: 'My Accounting Firm',
    },
    areaServed: {
      '@type': 'City',
      name: 'Montreal',
    },
  }}
/>
```

### FAQ

```typescript
<StructuredData
  data={{
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer accounting, tax, and advisory services.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where are you located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We are located in downtown Montreal.',
        },
      },
    ],
  }}
/>
```

### BreadcrumbList

```typescript
<StructuredData
  data={{
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://example.com/services' },
      { '@type': 'ListItem', position: 3, name: 'Tax', item: 'https://example.com/services/tax' },
    ],
  }}
/>
```

## Testing

### Google Rich Results Test

Test your structured data:
1. Go to [Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your page URL
3. Verify no errors or warnings

### Schema Markup Validator

Validate Schema.org compliance:
1. Go to [Schema Markup Validator](https://validator.schema.org/)
2. Enter URL or paste JSON-LD
3. Check for errors

## Best Practices

- Add Organization schema to homepage
- Add LocalBusiness for local service businesses
- Add FAQ schema to FAQ pages
- Add BreadcrumbList for navigation
- Keep data accurate and up-to-date
- Don't add schema for content not visible on the page

## See Also

- [Existing Structured Data Documentation](../../STRUCTURED-DATA.md)
- [StructuredData Component](../../components/StructuredData.md)
- [Meta Tags](./meta-tags.md)
