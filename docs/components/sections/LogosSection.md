# LogosSection

Client/partner logo showcase section.

## Import

```typescript
import { LogosSection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<LogosSection
  heading="Trusted by Leading Companies"
  logos={[
    { name: 'Acme Corp', src: '/logos/acme.png' },
    { name: 'Tech Inc', src: '/logos/tech.png' },
    { name: 'Global Ltd', src: '/logos/global.png' },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `string \| LocalizedString` | No | Section heading |
| `logos` | `Logo[]` | Yes | Logo items |
| `grayscale` | `boolean` | No | Show logos in grayscale |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

### Logo

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Company name (for alt text) |
| `src` | `string` | Yes | Logo image URL |
| `href` | `string` | No | Link URL |

## See Also

- [TrustBadges](../TrustBadges.md)
- [TestimonialSection](./TestimonialSection.md)
