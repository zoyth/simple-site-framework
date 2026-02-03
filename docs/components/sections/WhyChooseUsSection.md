# WhyChooseUsSection

"Why Choose Us" benefits section.

## Import

```typescript
import { WhyChooseUsSection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<WhyChooseUsSection
  heading="Why Choose Us"
  reasons={[
    {
      title: 'Expert Team',
      description: '15+ years of combined experience',
      icon: 'users',
    },
    {
      title: 'Proven Results',
      description: 'Over 200 successful projects',
      icon: 'chart',
    },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `string \| LocalizedString` | Yes | Section heading |
| `description` | `string \| LocalizedString` | No | Section description |
| `reasons` | `Reason[]` | Yes | Reason items |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

### Reason

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string \| LocalizedString` | Yes | Reason title |
| `description` | `string \| LocalizedString` | Yes | Reason description |
| `icon` | `string` | No | Icon name |

## See Also

- [FeaturesGrid](../FeaturesGrid.md)
- [AboutSection](./AboutSection.md)
