# Toast

Toast notification component.

## Import

```typescript
import { Toast } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<Toast
  message="Successfully saved!"
  type="success"
  onClose={() => setShowToast(false)}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string \| LocalizedString` | Yes | Notification message |
| `type` | `'success' \| 'error' \| 'info' \| 'warning'` | Yes | Toast type |
| `duration` | `number` | No | Auto-close duration (ms) |
| `onClose` | `function` | No | Close handler |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Success toast
<Toast
  message="Settings saved successfully"
  type="success"
  duration={3000}
/>

// Error toast
<Toast
  message="Failed to save. Please try again."
  type="error"
/>

// Info toast (no auto-close)
<Toast
  message="New features available"
  type="info"
  onClose={() => setShow(false)}
/>
```

## See Also

- [Modal](./ui/Modal.md)
