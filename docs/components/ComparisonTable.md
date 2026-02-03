# ComparisonTable

Feature comparison table component.

## Import

```typescript
import { ComparisonTable } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<ComparisonTable
  columns={[
    { name: 'Feature', key: 'feature' },
    { name: 'Basic', key: 'basic' },
    { name: 'Pro', key: 'pro' },
  ]}
  rows={[
    { feature: 'Users', basic: '10', pro: 'Unlimited' },
    { feature: 'Storage', basic: '10GB', pro: '1TB' },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `Column[]` | Yes | Table columns |
| `rows` | `object[]` | Yes | Table rows |
| `highlightColumn` | `number` | No | Highlighted column index |
| `className` | `string` | No | Custom classes |

## See Also

- [PricingTable](./PricingTable.md)
