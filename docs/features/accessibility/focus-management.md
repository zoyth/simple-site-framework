# Focus Management

Handle keyboard focus for accessible navigation.

## Focus Indicators

All interactive elements must have visible focus indicators:

```css
/* Framework default */
:focus-visible {
  outline: 2px solid #0066CC;
  outline-offset: 2px;
}

/* Never remove outlines without replacement */
/* ❌ Bad */
:focus { outline: none; }

/* ✅ Good - custom focus style */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.5);
}
```

## Focus Trapping

### Modal Focus Trap

The Modal component automatically traps focus:

```typescript
import { Modal } from '@zoyth/simple-site-framework/components';

<Modal isOpen={isOpen} onClose={handleClose}>
  {/* Focus is trapped within the modal */}
  <h2>Modal Title</h2>
  <p>Content</p>
  <Button onClick={handleClose}>Close</Button>
</Modal>
```

When a modal opens:
1. Focus moves to first focusable element inside
2. Tab cycles through modal elements only
3. Shift+Tab cycles backward
4. Escape closes the modal
5. Focus returns to the element that opened it

### ExitIntentModal

Same focus trapping behavior:

```typescript
<ExitIntentModal isOpen={showModal} onClose={() => setShowModal(false)}>
  <h2>Wait! Before you go...</h2>
  <Button>Get 10% Off</Button>
</ExitIntentModal>
```

## Focus Restoration

After closing a modal or dropdown, focus should return to the trigger:

```typescript
function MenuButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    setIsOpen(false);
    // Return focus to trigger
    buttonRef.current?.focus();
  }

  return (
    <>
      <button ref={buttonRef} onClick={() => setIsOpen(true)}>
        Open Menu
      </button>
      {isOpen && <Menu onClose={handleClose} />}
    </>
  );
}
```

## Skip Links

Allow keyboard users to skip past navigation:

```typescript
// Framework includes skip link functionality
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

<nav>...</nav>

<main id="main-content">
  {/* Page content */}
</main>
```

## Focus Order

Ensure logical tab order matches visual order:

```typescript
// ✅ Good - natural DOM order matches visual layout
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</header>
<main>...</main>
<footer>...</footer>

// ❌ Bad - tabIndex overrides break natural order
<div tabIndex={3}>Third visually, first by tab</div>
<div tabIndex={1}>First visually, third by tab</div>
```

### tabIndex Guidelines

| Value | Behavior |
|-------|----------|
| `0` | Element is focusable in natural DOM order |
| `-1` | Focusable programmatically, not by Tab key |
| `> 0` | Avoid - breaks natural order |

## Managing Focus on Route Changes

In single-page applications, manage focus when content changes:

```typescript
'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function FocusManager() {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Move focus to main content on route change
    mainRef.current?.focus();
  }, [pathname]);

  return <main ref={mainRef} tabIndex={-1}>{/* content */}</main>;
}
```

## Roving tabIndex

For component groups (tabs, toolbars), use roving tabIndex:

```typescript
// Only one item in the group is tabbable at a time
// Arrow keys move focus within the group

<div role="tablist">
  <button role="tab" tabIndex={activeTab === 0 ? 0 : -1}>Tab 1</button>
  <button role="tab" tabIndex={activeTab === 1 ? 0 : -1}>Tab 2</button>
  <button role="tab" tabIndex={activeTab === 2 ? 0 : -1}>Tab 3</button>
</div>
```

The Tabs component implements this pattern automatically.

## Best Practices

- Never remove focus indicators without providing a visible alternative
- Use `:focus-visible` instead of `:focus` to avoid showing outlines on mouse clicks
- Always return focus to the trigger when closing overlays
- Keep tab order logical and predictable
- Use `tabIndex={-1}` for programmatic focus targets
- Avoid positive `tabIndex` values
- Test entire pages with keyboard-only navigation

## See Also

- [Keyboard Navigation](../../accessibility/keyboard-navigation.md)
- [ARIA Support](./aria-support.md)
- [Modal Component](../../components/ui/Modal.md)
