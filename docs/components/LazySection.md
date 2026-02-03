# LazySection

Lazy-load sections below the fold for better performance.

## Import

```typescript
import { LazySection } from '@zoyth/simple-site-framework';
```

**Type:** Client Component

## Basic Usage

```typescript
<LazySection>
  <TestimonialSection {...props} />
</LazySection>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Content to lazy-load |
| `threshold` | `number` | No | Intersection threshold (default: 0.1) |
| `rootMargin` | `string` | No | Root margin (default: '50px') |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Lazy-load testimonials
<LazySection>
  <TestimonialSection testimonials={testimonials} />
</LazySection>

// Custom threshold
<LazySection threshold={0.5}>
  <HeavyComponent />
</LazySection>
```

## See Also

- [Performance Guide](../guides/performance.md)
