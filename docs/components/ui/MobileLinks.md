# MobileLinks

Mobile-optimized link group component.

## Import

```typescript
import { MobileLinks } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<MobileLinks
  links={[
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'About', href: '/about', icon: 'info' },
    { label: 'Contact', href: '/contact', icon: 'mail' },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `links` | `MobileLink[]` | Yes | Link items |
| `className` | `string` | No | Custom classes |

### MobileLink

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string \| LocalizedString` | Yes | Link label |
| `href` | `string` | Yes | Link URL |
| `icon` | `string` | No | Icon name |

## See Also

- [Header](../layout/Header.md)
- Mobile navigation helper component
