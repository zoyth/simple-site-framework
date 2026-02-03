# ExitIntentModal

Modal that appears when user intends to leave.

## Import

```typescript
import { ExitIntentModal } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<ExitIntentModal
  title="Wait! Don't Go Yet"
  message="Get 20% off your first purchase"
  cta={{
    text: 'Claim Discount',
    href: '/signup?discount=exit20'
  }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string \| LocalizedString` | Yes | Modal title |
| `message` | `string \| LocalizedString` | Yes | Modal message |
| `cta` | `CTAConfig` | Yes | Call-to-action |
| `delay` | `number` | No | Delay before showing (ms) |
| `cooldown` | `number` | No | Cooldown period (ms) |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## Examples

```typescript
// Newsletter signup
<ExitIntentModal
  title="Stay Updated"
  message="Subscribe to our newsletter for tips and updates"
  cta={{
    text: 'Subscribe',
    href: '/newsletter'
  }}
  delay={3000}
/>
```

## See Also

- [Modal](./ui/Modal.md)
- [MobileCTA](./conversion/MobileCTA.md)
