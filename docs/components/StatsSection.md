# StatsSection

Statistics display section with animated counters.

## Import

```typescript
import { StatsSection } from '@zoyth/simple-site-framework';
```

**Type:** Client Component

## Basic Usage

```typescript
<StatsSection
  heading="Our Impact"
  stats={[
    { value: '10,000+', label: 'Customers' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `string \| LocalizedString` | No | Section heading |
| `stats` | `Stat[]` | Yes | Statistics items |
| `variant` | `'default' \| 'cards'` | No | Display variant |
| `animated` | `boolean` | No | Animate counters |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

### Stat

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string \| number` | Yes | Stat value |
| `label` | `string \| LocalizedString` | Yes | Stat label |
| `suffix` | `string` | No | Value suffix |

## See Also

- [AboutSection](./sections/AboutSection.md)
- [AnimatedCounter](./AnimatedCounter.md)
