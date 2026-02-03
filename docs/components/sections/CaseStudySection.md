# CaseStudySection

Case study display section.

## Import

```typescript
import { CaseStudySection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<CaseStudySection
  title="How Acme Corp Increased Revenue by 300%"
  client="Acme Corporation"
  industry="Technology"
  challenge="Low conversion rates"
  solution="Implemented new marketing strategy"
  results={[
    '300% revenue increase',
    '50% more leads',
    '10x ROI',
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string \| LocalizedString` | Yes | Case study title |
| `client` | `string` | Yes | Client name |
| `industry` | `string` | No | Industry |
| `challenge` | `string \| LocalizedString` | No | Challenge description |
| `solution` | `string \| LocalizedString` | No | Solution description |
| `results` | `string[]` | No | Results/outcomes |
| `testimonial` | `Testimonial` | No | Client testimonial |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## See Also

- [TestimonialSection](./TestimonialSection.md)
- [AboutSection](./AboutSection.md)
