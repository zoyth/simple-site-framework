# TrustBadges

Trust and security badges component.

## Import

```typescript
import { TrustBadges } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<TrustBadges
  badges={[
    { name: 'SSL Secure', icon: 'shield' },
    { name: 'Money Back Guarantee', icon: 'check' },
    { name: '24/7 Support', icon: 'clock' },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `badges` | `Badge[]` | Yes | Trust badges |
| `variant` | `'icons' \| 'logos'` | No | Display variant |
| `className` | `string` | No | Custom classes |

### Badge

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string \| LocalizedString` | Yes | Badge name |
| `icon` | `string` | No | Icon name |
| `logo` | `string` | No | Logo image URL |

## See Also

- [Footer](./layout/Footer.md)
- [TestimonialSection](./sections/TestimonialSection.md)
