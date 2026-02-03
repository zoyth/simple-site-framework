# FeaturesGrid

Grid of features with icons and descriptions.

## Import

```typescript
import { FeaturesGrid } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<FeaturesGrid
  heading="Why Choose Us"
  features={[
    {
      title: 'Fast Performance',
      description: 'Lightning-fast load times',
      icon: 'zap',
    },
    {
      title: 'Secure',
      description: 'Enterprise-grade security',
      icon: 'shield',
    },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `string \| LocalizedString` | Yes | Section heading |
| `description` | `string \| LocalizedString` | No | Section description |
| `features` | `Feature[]` | Yes | Feature items |
| `columns` | `number` | No | Grid columns (default: 3) |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

### Feature

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string \| LocalizedString` | Yes | Feature title |
| `description` | `string \| LocalizedString` | Yes | Feature description |
| `icon` | `string` | No | Icon name |

## See Also

- [Icon](./Icon.md)
- [Card](./ui/Card.md)
