# CountdownTimer

Countdown timer component for time-limited offers.

## Import

```typescript
import { CountdownTimer } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<CountdownTimer
  targetDate="2024-12-31T23:59:59"
  onComplete={() => console.log('Timer ended')}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `targetDate` | `string \| Date` | Yes | Target date/time |
| `onComplete` | `function` | No | Completion handler |
| `format` | `'dhms' \| 'hms'` | No | Display format |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Days, hours, minutes, seconds
<CountdownTimer
  targetDate="2024-06-01T00:00:00"
  format="dhms"
/>

// Hours, minutes, seconds only
<CountdownTimer
  targetDate={saleEndDate}
  format="hms"
  onComplete={() => setSaleEnded(true)}
/>
```

## See Also

- [CTASection](./sections/CTASection.md)
- [AnimatedCounter](./AnimatedCounter.md)
