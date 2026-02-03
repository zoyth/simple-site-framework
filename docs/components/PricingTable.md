# PricingTable

Pricing comparison table component.

## Import

```typescript
import { PricingTable } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<PricingTable
  plans={[
    {
      name: 'Basic',
      price: '$9',
      period: '/month',
      features: ['Feature 1', 'Feature 2'],
      cta: { text: 'Get Started', href: '/signup?plan=basic' },
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: ['All Basic features', 'Feature 3', 'Feature 4'],
      cta: { text: 'Get Started', href: '/signup?plan=pro' },
      highlighted: true,
    },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `plans` | `PricingPlan[]` | Yes | Pricing plans |
| `billingPeriod` | `'monthly' \| 'annual'` | No | Default billing period |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## See Also

- [CTASection](./sections/CTASection.md)
- [Card](./ui/Card.md)
