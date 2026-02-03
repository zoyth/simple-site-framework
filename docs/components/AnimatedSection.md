# AnimatedSection

Section with scroll-triggered animations.

## Import

```typescript
import { AnimatedSection } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<AnimatedSection animation="fade-up">
  <div>Content that animates on scroll</div>
</AnimatedSection>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Content to animate |
| `animation` | `AnimationType` | Yes | Animation type |
| `delay` | `number` | No | Animation delay (ms) |
| `duration` | `number` | No | Animation duration (ms) |
| `className` | `string` | No | Custom classes |

## Animation Types

- `fade-up` - Fade in from bottom
- `fade-down` - Fade in from top
- `fade-left` - Fade in from left
- `fade-right` - Fade in from right
- `zoom-in` - Scale up
- `zoom-out` - Scale down

## Examples

```typescript
// Fade up with delay
<AnimatedSection animation="fade-up" delay={200}>
  <HeroSection {...props} />
</AnimatedSection>

// Zoom in
<AnimatedSection animation="zoom-in">
  <Card>...</Card>
</AnimatedSection>
```

## See Also

- [LazySection](./LazySection.md)
