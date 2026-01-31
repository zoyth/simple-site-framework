# Keyboard Navigation Guide

All Simple Site Framework components support full keyboard navigation. This guide covers keyboard patterns and testing.

## Standard Keyboard Controls

### Tab Navigation
- **Tab**: Move focus forward through interactive elements
- **Shift + Tab**: Move focus backward
- **Enter/Space**: Activate buttons, links, and controls
- **Escape**: Close modals, menus, and dropdowns

### Component-Specific
- **Arrow Keys**: Navigate within lists, menus, tabs, and carousels
- **Home/End**: Jump to first/last item in lists
- **Page Up/Down**: Scroll or navigate in long lists

## Component Keyboard Patterns

### Button
```tsx
<Button onClick={handleClick}>
  Submit
</Button>
```
- **Tab**: Focus the button
- **Enter/Space**: Activate the button

### Modal
```tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  {/* Modal content */}
</Modal>
```
- **Tab**: Cycle through focusable elements inside modal
- **Shift + Tab**: Cycle backward
- **Escape**: Close modal
- Focus is **trapped** inside modal while open
- Focus **returns** to trigger when closed

### Tabs
```tsx
<Tabs tabs={tabs} value={activeTab} onValueChange={setActiveTab} />
```
- **Tab**: Focus the tab list
- **Arrow Left/Right**: Navigate between tabs
- **Home**: Jump to first tab
- **End**: Jump to last tab
- **Enter/Space**: Activate selected tab

### Select/Dropdown
```tsx
<Select options={options} value={value} onChange={setValue} />
```
- **Tab**: Focus the select
- **Enter/Space/Arrow Down**: Open dropdown
- **Arrow Up/Down**: Navigate options
- **Home/End**: Jump to first/last option
- **Enter/Space**: Select option
- **Escape**: Close without selecting
- **Type ahead**: Jump to option starting with typed character

### Accordion
```tsx
<FAQAccordion items={faqItems} />
```
- **Tab**: Focus accordion header
- **Enter/Space**: Toggle section
- **Arrow Down**: Move to next header
- **Arrow Up**: Move to previous header
- **Home**: Jump to first header
- **End**: Jump to last header

### Carousel/Slider
```tsx
<TestimonialCarousel testimonials={items} />
```
- **Tab**: Focus carousel controls
- **Arrow Left/Right**: Navigate slides
- **Space/Enter**: Pause/play autoplay

### Multi-Step Form
```tsx
<MultiStepForm>
  {/* Form steps */}
</MultiStepForm>
```
- **Tab**: Navigate through form fields
- **Enter**: Submit step or form
- **Arrow Keys**: Navigate between radio buttons/checkboxes in groups

## Focus Management

### Skip Links
Allow keyboard users to skip repetitive navigation:

```tsx
import { SkipLink } from '@zoyth/simple-site-framework'

<SkipLink href="#main">
  Skip to main content
</SkipLink>
<SkipLink href="#nav">
  Skip to navigation
</SkipLink>
```

### Focus Trap (Modals/Dialogs)
Keep focus inside modal until closed:

```tsx
import { useFocusTrap } from '@zoyth/simple-site-framework'

function Modal({ isOpen, children }) {
  const trapRef = useFocusTrap(isOpen)

  return (
    <div ref={trapRef} role="dialog">
      {children}
    </div>
  )
}
```

### Focus Return
Return focus to trigger element after modal closes:

```tsx
import { useFocusReturn } from '@zoyth/simple-site-framework'

function Modal() {
  const returnRef = useFocusReturn()

  return <div ref={returnRef}>{/* content */}</div>
}
```

## Testing Keyboard Navigation

### Manual Testing Checklist
1. **Unplug your mouse** (or don't touch it)
2. **Tab through entire page**
   - Can you reach all interactive elements?
   - Is tab order logical?
   - Is focus visible on all elements?
3. **Open and close all modals/menus**
   - Does Escape close them?
   - Does focus stay trapped inside?
   - Does focus return when closed?
4. **Submit all forms**
   - Can you fill out and submit with only keyboard?
   - Are errors announced?
5. **Navigate all components**
   - Do tabs work with arrows?
   - Do dropdowns work as expected?
   - Do carousels respond to arrows?

### Automated Testing
```tsx
import { testKeyboardNav } from '@zoyth/simple-site-framework/testing'

describe('Button', () => {
  it('should activate on Enter and Space', () => {
    const onClick = jest.fn()
    const { getByRole } = render(<Button onClick={onClick}>Click</Button>)

    testKeyboardNav(getByRole('button'), {
      enter: onClick,
      space: onClick
    })
  })
})
```

## Common Keyboard Traps (and How to Avoid)

### ❌ Keyboard Trap
```tsx
// BAD: Focus gets stuck in modal
<div onClick={() => setOpen(false)}>
  <input /> {/* Focus can't reach close button */}
</div>
```

### ✅ Proper Modal
```tsx
// GOOD: Use framework Modal with focus trap
<Modal isOpen={isOpen} onClose={() => setOpen(false)}>
  <input />
  <Button onClick={() => setOpen(false)}>Close</Button>
</Modal>
```

### ❌ Missing Tab Index
```tsx
// BAD: Custom div button not keyboard accessible
<div onClick={handleClick}>Click me</div>
```

### ✅ Semantic Button
```tsx
// GOOD: Use semantic button or framework Button
<Button onClick={handleClick}>Click me</Button>
```

### ❌ No Escape to Close
```tsx
// BAD: No way to close with keyboard
<div className="modal">
  <button onClick={handleClose}>×</button>
</div>
```

### ✅ Escape Handler
```tsx
// GOOD: Escape key closes modal
<Modal onClose={handleClose} isOpen={isOpen}>
  {/* content */}
</Modal>
```

## Focus Indicator Best Practices

### Visible Focus
All framework components have visible focus indicators:
```css
/* Default focus ring */
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Custom Focus Styles
Override in your theme:
```tsx
const theme = {
  colors: {
    focusRing: '#FF7800',
  },
  // ...
}
```

### Never Remove Focus
```css
/* ❌ NEVER DO THIS */
*:focus {
  outline: none;
}

/* ✅ Style it, but keep it visible */
*:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

## Resources

- [WebAIM Keyboard Testing](https://webaim.org/articles/keyboard/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Framework Component Guides](./components/)
