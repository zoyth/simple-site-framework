# ServicesSection

Service offerings grid section.

## Import

```typescript
import { ServicesSection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<ServicesSection
  heading="Our Services"
  services={[
    {
      title: 'Web Development',
      description: 'Custom websites built for your business',
      icon: 'code',
      href: '/services/web',
    },
    {
      title: 'Mobile Apps',
      description: 'Native and cross-platform applications',
      icon: 'mobile',
      href: '/services/mobile',
    },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `string \| LocalizedString` | Yes | Section heading |
| `description` | `string \| LocalizedString` | No | Section description |
| `services` | `Service[]` | Yes | Service items |
| `columns` | `number` | No | Grid columns (default: 3) |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## See Also

- [FeaturesGrid](../FeaturesGrid.md)
- [ServicePageLayout](./ServicePageLayout.md)
