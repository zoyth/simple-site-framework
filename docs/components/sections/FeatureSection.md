# FeatureSection

Individual feature highlight section.

## Import

```typescript
import { FeatureSection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<FeatureSection
  heading="Fast Performance"
  description="Lightning-fast load times for better user experience"
  image="/features/performance.png"
  features={[
    'Optimized assets',
    'CDN delivery',
    'Lazy loading',
  ]}
  reverse
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `string \| LocalizedString` | Yes | Feature heading |
| `description` | `string \| LocalizedString` | Yes | Feature description |
| `image` | `string` | No | Feature image |
| `features` | `string[]` | No | Feature list |
| `reverse` | `boolean` | No | Reverse layout |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## See Also

- [FeaturesGrid](../FeaturesGrid.md)
- [HeroSection](./HeroSection.md)
