# Breadcrumb

Navigation breadcrumb trail showing page hierarchy.

## Import

```typescript
import { Breadcrumb } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Widget' }
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `BreadcrumbItem[]` | Yes | Breadcrumb items |
| `separator` | `string` | No | Custom separator (default: '/') |
| `className` | `string` | No | Custom classes |

### BreadcrumbItem

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string \| LocalizedString` | Yes | Item label |
| `href` | `string` | No | Link URL (omit for current page) |

## Examples

```typescript
// Simple breadcrumb
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Article Title' }
  ]}
/>

// Custom separator
<Breadcrumb
  items={items}
  separator="›"
/>

// Multi-language
<Breadcrumb
  items={[
    { label: { en: 'Home', fr: 'Accueil' }, href: '/' },
    { label: { en: 'About', fr: 'À propos' } }
  ]}
  locale={locale}
/>
```

## See Also

- [Header](../layout/Header.md)
