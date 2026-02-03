# AnimatedCounter

Animated number counter component.

## Import

```typescript
import { AnimatedCounter } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<AnimatedCounter
  value={10000}
  duration={2000}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `number` | Yes | Target value |
| `duration` | `number` | No | Animation duration (ms) |
| `suffix` | `string` | No | Suffix (e.g., '+', '%') |
| `prefix` | `string` | No | Prefix (e.g., '$') |
| `decimals` | `number` | No | Decimal places |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// With suffix
<AnimatedCounter value={10000} suffix="+" />

// Currency
<AnimatedCounter value={9999} prefix="$" decimals={2} />

// Percentage
<AnimatedCounter value={99.9} suffix="%" decimals={1} />
```

## See Also

- [StatsSection](./StatsSection.md)
