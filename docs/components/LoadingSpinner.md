# LoadingSpinner

Loading spinner component.

## Import

```typescript
import { LoadingSpinner } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<LoadingSpinner />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | No | Spinner size |
| `color` | `string` | No | Spinner color |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Large spinner
<LoadingSpinner size="lg" />

// Custom color
<LoadingSpinner color="primary" />

// In button
<Button disabled>
  <LoadingSpinner size="sm" className="mr-2" />
  Loading...
</Button>
```

## See Also

- [Skeleton](./Skeleton.md)
- [Button](./ui/Button.md)
