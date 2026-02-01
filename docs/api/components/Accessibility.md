# Accessibility Components & Hooks

Comprehensive accessibility utilities for building WCAG 2.1 AA compliant applications.

## Components

### SkipLink

Allows keyboard users to skip repetitive navigation and jump directly to main content.

#### Import

```typescript
import { SkipLink } from '@zoyth/simple-site-framework'
import type { SkipLinkProps } from '@zoyth/simple-site-framework'
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `href` | `string` | ✅ | Target element ID (e.g., "#main-content") |
| `children` | `ReactNode` | ✅ | Link text |
| `className` | `string` | - | Additional CSS classes |

#### Usage

```tsx
// In your layout, before header
<SkipLink href="#main-content">
  Skip to main content
</SkipLink>

// In your main content area
<main id="main-content" tabIndex={-1}>
  {/* Your content */}
</main>
```

The link is hidden by default and appears only when focused with Tab key.

---

### A11yAnnouncer

Screen reader announcement component for dynamic content changes.

#### Import

```typescript
import { A11yAnnouncer, GlobalA11yAnnouncer } from '@zoyth/simple-site-framework'
import type { A11yAnnouncerProps, AnnouncementPriority } from '@zoyth/simple-site-framework'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | - | Message to announce |
| `priority` | `'polite' \| 'assertive'` | `'polite'` | Announcement priority |
| `clearAfter` | `number` | `3000` | Clear message after ms |

#### Priority Levels

- **polite**: Waits for user to pause before announcing (default)
- **assertive**: Interrupts screen reader immediately (use sparingly)

#### Local Announcer

```tsx
const [message, setMessage] = useState('')

// Trigger announcement
<button onClick={() => setMessage('Item added to cart')}>
  Add to Cart
</button>

// Announcer component
<A11yAnnouncer message={message} priority="polite" />
```

#### Global Announcer

Place once in your root layout for app-wide announcements:

```tsx
// app/layout.tsx
import { GlobalA11yAnnouncer } from '@zoyth/simple-site-framework'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlobalA11yAnnouncer />
        {children}
      </body>
    </html>
  )
}
```

Then announce from anywhere:

```typescript
import { announce } from '@zoyth/simple-site-framework'

// Polite announcement
announce('Form submitted successfully', 'polite')

// Assertive announcement (errors, urgent)
announce('Error: Please fix the form errors', 'assertive')
```

## Hooks

### useA11y

Convenience hook for accessibility utilities.

#### Import

```typescript
import { useA11y } from '@zoyth/simple-site-framework'
```

#### Usage

```tsx
function MyComponent() {
  const { announce } = useA11y()

  const handleSubmit = async () => {
    await submitForm()
    announce('Form submitted successfully!', 'polite')
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

Requires `<GlobalA11yAnnouncer />` in your layout.

---

### useFocusTrap

Trap keyboard focus within a container (for modals, dialogs).

#### Import

```typescript
import { useFocusTrap } from '@zoyth/simple-site-framework'
import type { UseFocusTrapOptions } from '@zoyth/simple-site-framework'
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether focus trap is active |
| `initialFocus` | `HTMLElement \| null` | - | Element to focus on activation |
| `allowTabEscape` | `boolean` | `false` | Allow Tab to escape the trap |

#### Usage

```tsx
function Modal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useFocusTrap(modalRef, { enabled: isOpen })

  if (!isOpen) return null

  return (
    <div ref={modalRef} role="dialog">
      <h2>Modal Title</h2>
      <button onClick={onClose}>Close</button>
      <input type="text" />
    </div>
  )
}
```

Focus automatically moves to first focusable element and cycles within the modal.

---

### useFocusReturn

Return focus to previous element when component unmounts.

#### Import

```typescript
import { useFocusReturn } from '@zoyth/simple-site-framework'
import type { UseFocusReturnOptions } from '@zoyth/simple-site-framework'
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether to return focus |
| `returnTo` | `HTMLElement \| null` | - | Custom element to focus |

#### Usage

```tsx
function Modal({ isOpen, onClose }) {
  useFocusReturn({ enabled: isOpen })

  if (!isOpen) return null

  return (
    <div role="dialog">
      <h2>Modal Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
  )
}
```

Focus returns to the element that triggered the modal when it closes.

---

### useModalFocus

Combined hook for complete modal focus management (trap + return).

#### Import

```typescript
import { useModalFocus } from '@zoyth/simple-site-framework'
```

#### Usage

```tsx
function Modal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useModalFocus(modalRef, { enabled: isOpen })

  if (!isOpen) return null

  return (
    <div ref={modalRef} role="dialog">
      <h2>Modal Title</h2>
      <button onClick={onClose}>Close</button>
      <input type="text" />
    </div>
  )
}
```

Handles both focus trapping and focus return automatically.

## Complete Modal Example

```tsx
import { useRef } from 'react'
import { useModalFocus, useA11y } from '@zoyth/simple-site-framework'

function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { announce } = useA11y()

  useModalFocus(modalRef, { enabled: isOpen })

  const handleConfirm = () => {
    onConfirm()
    announce('Item deleted', 'polite')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          Confirm Delete
        </h2>
        <p className="mb-6">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Best Practices

### SkipLink
- Place before all other content (first element in body)
- Use clear, concise text ("Skip to main content")
- Target main content area with `id` attribute
- Make target focusable with `tabIndex={-1}`

### Announcements
- Use `'polite'` for most announcements
- Use `'assertive'` only for errors or urgent information
- Keep messages concise and clear
- Don't announce every tiny change
- Clear messages after a few seconds

### Focus Management
- Always trap focus in modals/dialogs
- Return focus when closing modals
- Focus first interactive element by default
- Provide visual focus indicators
- Test with keyboard only

### Testing
- Test with keyboard navigation (Tab, Shift+Tab)
- Test with screen readers (NVDA, VoiceOver, JAWS)
- Verify announcements are read correctly
- Ensure focus trap doesn't break navigation
- Check focus return works as expected

## Accessibility Checklist

When using these components:

- [ ] SkipLink is first element in document
- [ ] Main content has unique `id` attribute
- [ ] GlobalA11yAnnouncer in root layout
- [ ] Modals use focus trap
- [ ] Modals return focus on close
- [ ] Announcements use appropriate priority
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Tested with keyboard only
- [ ] Tested with screen reader
