# Icon

Icon component with built-in icons.

## Import

```typescript
import { Icon } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<Icon name="check" size="md" />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `IconName` | Yes | Icon name |
| `size` | `'sm' \| 'md' \| 'lg'` | No | Icon size |
| `className` | `string` | No | Custom classes |

## Available Icons

Common icons include: `check`, `x`, `arrow-right`, `arrow-left`, `menu`, `close`, `search`, `user`, `mail`, `phone`, `star`, `heart`, `zap`, `shield`, `code`, `mobile`, `chart`, `clock`, `users`, and more.

## Examples

```typescript
// Basic icon
<Icon name="check" />

// Large icon
<Icon name="star" size="lg" />

// Custom color
<Icon name="heart" className="text-red-500" />

// In button
<Button>
  <Icon name="arrow-right" size="sm" className="mr-2" />
  Continue
</Button>
```

## See Also

- [FeaturesGrid](./FeaturesGrid.md)
- [Button](./ui/Button.md)
