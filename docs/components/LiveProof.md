# LiveProof

Social proof notification system showing recent activity.

## Import

```typescript
import { LiveProof } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<LiveProof
  notifications={[
    {
      message: 'John from New York just signed up',
      timestamp: Date.now() - 60000,
    },
    {
      message: 'Sarah purchased Pro Plan',
      timestamp: Date.now() - 120000,
    },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `notifications` | `Notification[]` | Yes | Notification items |
| `interval` | `number` | No | Display interval (ms) |
| `position` | `'bottom-left' \| 'bottom-right'` | No | Screen position |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Custom position
<LiveProof
  notifications={notifications}
  position="bottom-left"
  interval={5000}
/>
```

## See Also

- [TestimonialSection](./sections/TestimonialSection.md)
- [MobileCTA](./conversion/MobileCTA.md)
