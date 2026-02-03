# ServicePageLayout

Complete layout for individual service pages.

## Import

```typescript
import { ServicePageLayout } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<ServicePageLayout
  title="Web Development Services"
  description="Custom websites built for your business"
  features={[
    'Responsive design',
    'SEO optimized',
    'Fast performance'
  ]}
  benefits={[
    'Increase conversions',
    'Improve brand image',
    'Reach more customers'
  ]}
  cta={{
    text: 'Request Quote',
    href: '/quote'
  }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string \| LocalizedString` | Yes | Service title |
| `description` | `string \| LocalizedString` | Yes | Service description |
| `features` | `string[]` | No | Service features |
| `benefits` | `string[]` | No | Service benefits |
| `cta` | `CTAConfig` | No | Call-to-action |
| `image` | `string` | No | Header image |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## See Also

- [ServicesSection](./ServicesSection.md)
- [HeroSection](./HeroSection.md)
