# Button Component

Enhanced button component with loading states, success feedback, icons, ripple effects, and comprehensive variants.

## Import

```typescript
import { Button } from '@zoyth/simple-site-framework'
import type { ButtonProps } from '@zoyth/simple-site-framework'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'outlined' \| 'filled' \| 'text' \| 'ghost' \| 'link' \| 'destructive'` | `'outlined'` | Visual style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Shows loading spinner, disables button |
| `loadingText` | `string` | - | Optional text to show while loading |
| `success` | `boolean` | `false` | Shows success checkmark |
| `successText` | `string` | - | Optional text to show on success |
| `successDuration` | `number` | `2000` | How long to show success state (ms) |
| `icon` | `ReactNode` | - | Icon to display with button text |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of icon relative to text |
| `iconOnly` | `boolean` | `false` | Display only icon, no text |
| `disabledTooltip` | `string` | - | Tooltip shown when button is disabled |
| `ripple` | `boolean` | `true` | Enable ripple effect on click |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Button content |

All standard HTML button props are also supported (onClick, disabled, type, etc.).

## Variants

### outlined (default)
Border with transparent background, fills on hover.

```tsx
<Button variant="outlined">Click me</Button>
```

### filled
Solid background color.

```tsx
<Button variant="filled">Submit</Button>
```

### text
No border or background, text only.

```tsx
<Button variant="text">Cancel</Button>
```

### ghost
Subtle hover state, minimal styling.

```tsx
<Button variant="ghost">Options</Button>
```

### link
Styled like a hyperlink.

```tsx
<Button variant="link">Learn more</Button>
```

### destructive
Red color scheme for dangerous actions.

```tsx
<Button variant="destructive">Delete</Button>
```

## Sizes

```tsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

## Loading State

```tsx
const [isLoading, setIsLoading] = useState(false)

<Button
  loading={isLoading}
  loadingText="Submitting..."
  onClick={async () => {
    setIsLoading(true)
    await submitForm()
    setIsLoading(false)
  }}
>
  Submit
</Button>
```

## Success State

```tsx
const [isSuccess, setIsSuccess] = useState(false)

<Button
  success={isSuccess}
  successText="Saved!"
  successDuration={3000}
  onClick={async () => {
    await saveData()
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 3000)
  }}
>
  Save
</Button>
```

## With Icons

```tsx
import { Icons } from '@zoyth/simple-site-framework'

// Icon on left (default)
<Button icon={<Icons.Mail />}>
  Send Email
</Button>

// Icon on right
<Button icon={<Icons.ArrowRight />} iconPosition="right">
  Continue
</Button>

// Icon only
<Button
  icon={<Icons.Search />}
  iconOnly
  aria-label="Search"
/>
```

## Disabled with Tooltip

```tsx
<Button
  disabled
  disabledTooltip="Complete the form first"
>
  Submit
</Button>
```

## Ripple Effect

```tsx
// Ripple enabled (default)
<Button ripple>Click for ripple</Button>

// Ripple disabled
<Button ripple={false}>No ripple</Button>
```

## Complete Example

```tsx
import { useState } from 'react'
import { Button, Icons } from '@zoyth/simple-site-framework'

function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      await submitToAPI()
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="filled"
      size="lg"
      loading={isLoading}
      loadingText="Sending..."
      success={isSuccess}
      successText="Sent!"
      icon={<Icons.Send />}
      onClick={handleSubmit}
      ripple
    >
      Send Message
    </Button>
  )
}
```

## Accessibility

- Automatically disabled during loading/success states
- `aria-label` required for `iconOnly` buttons
- Disabled state tooltip helps explain why button is disabled
- Keyboard accessible (Enter/Space to activate)
- Focus visible with outline

## Best Practices

1. **Use appropriate variants**
   - `filled` for primary actions
   - `outlined` for secondary actions
   - `destructive` for delete/remove actions
   - `text` or `ghost` for tertiary actions

2. **Loading states**
   - Always show loading state for async operations
   - Provide meaningful `loadingText` for clarity

3. **Success feedback**
   - Use success state for positive confirmation
   - Keep `successDuration` brief (2-3 seconds)

4. **Icon usage**
   - Use icons to reinforce button meaning
   - Always provide `aria-label` for icon-only buttons
   - Keep icons consistent with action (e.g., Mail for email, Trash for delete)

5. **Size selection**
   - Use `lg` or `xl` for hero CTAs
   - Use `md` for most form buttons
   - Use `sm` or `xs` for compact UIs or inline actions
