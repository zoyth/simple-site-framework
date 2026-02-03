# Skeleton

Loading skeleton placeholder component.

## Import

```typescript
import { Skeleton } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<Skeleton width="200px" height="20px" />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `width` | `string \| number` | No | Skeleton width |
| `height` | `string \| number` | No | Skeleton height |
| `variant` | `'text' \| 'circular' \| 'rectangular'` | No | Shape variant |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Text line
<Skeleton variant="text" width="100%" />

// Avatar
<Skeleton variant="circular" width={40} height={40} />

// Card placeholder
<div>
  <Skeleton width="100%" height="200px" />
  <Skeleton variant="text" width="80%" className="mt-2" />
  <Skeleton variant="text" width="60%" className="mt-2" />
</div>
```

## See Also

- [LoadingSpinner](./LoadingSpinner.md)
