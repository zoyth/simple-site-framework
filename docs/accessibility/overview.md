# Accessibility Overview

The Simple Site Framework is built with accessibility as a core principle, ensuring that all components meet WCAG 2.1 Level AA standards by default.

## Our Commitment

- **Semantic HTML**: All components use proper HTML5 semantic elements
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: ARIA attributes and announcements where needed
- **Color Contrast**: AA-compliant color ratios (4.5:1 for text, 3:1 for UI)
- **Focus Management**: Clear focus indicators and logical focus order
- **Responsive**: Touch targets meet minimum 44x44px on mobile

## WCAG 2.1 AA Compliance

All framework components are designed to meet:
- **Perceivable**: Content visible to all users
- **Operable**: Interface usable via keyboard and other input methods
- **Understandable**: Clear labels, instructions, and error messages
- **Robust**: Compatible with assistive technologies

## Quick Start

### 1. Use Semantic Components
```tsx
// Good - semantic and accessible
<Button onClick={handleClick}>Submit</Button>

// Avoid - div buttons need extra work
<div onClick={handleClick}>Submit</div>
```

### 2. Add ARIA Labels
```tsx
<Button
  icon={<Icons.Search />}
  iconOnly
  aria-label="Search"
/>
```

### 3. Test with Keyboard
All interactive elements should work with:
- `Tab` - Navigate forward
- `Shift + Tab` - Navigate backward
- `Enter/Space` - Activate buttons
- `Escape` - Close modals/menus
- `Arrow keys` - Navigate within components

### 4. Check Color Contrast
Use our built-in utilities or browser DevTools to verify:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

## Testing Tools

### Development
> **Note**: The `A11yChecker` component is planned for v0.2.0 and not yet available.

For now, use these external tools for accessibility testing:

### Automated Testing
- **axe DevTools**: Browser extension for automated accessibility testing
- **WAVE**: Browser extension for manual testing
- **Lighthouse**: Chrome DevTools accessibility audit
- **axe-core**: Can be integrated into your test suite

### Screen Reader Testing
- **Windows**: NVDA (free) or JAWS
- **macOS**: VoiceOver (built-in)
- **Mobile**: TalkBack (Android), VoiceOver (iOS)

## Common Patterns

### Skip Links
```tsx
import { SkipLink } from '@zoyth/simple-site-framework'

<SkipLink href="#main">Skip to main content</SkipLink>
```

### Screen Reader Announcements
```tsx
import { useA11y } from '@zoyth/simple-site-framework'

const { announce } = useA11y()

const handleSubmit = async () => {
  await submitForm()
  announce('Form submitted successfully')
}
```

### Focus Management
```tsx
import { useFocusTrap } from '@zoyth/simple-site-framework'

function Modal({ isOpen }) {
  const trapRef = useFocusTrap(isOpen)

  return (
    <div ref={trapRef} role="dialog" aria-modal="true">
      {/* Modal content */}
    </div>
  )
}
```

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM Resources](https://webaim.org/resources/)
- [Component A11y Guides](./components/)

## Need Help?

- Review component-specific guides in [./components/](./components/)
- Check the [accessibility checklist](./wcag-compliance.md)
- Test with [keyboard navigation guide](./keyboard-navigation.md)
- Verify with [screen reader testing guide](./screen-readers.md)
