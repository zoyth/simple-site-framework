# Accessibility

Build inclusive, accessible websites that work for everyone.

## Overview

Simple Site Framework is built with accessibility as a core concern:

- Semantic HTML throughout
- ARIA attributes on interactive components
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

## Topics

- [ARIA Support](./aria-support.md) - ARIA attributes and roles
- [Keyboard Navigation](../../accessibility/keyboard-navigation.md) - Keyboard interaction patterns
- [Screen Readers](../../accessibility/screen-readers.md) - Screen reader compatibility
- [Color Contrast](./color-contrast.md) - Color contrast guidelines
- [Focus Management](./focus-management.md) - Focus handling patterns
- [Testing](./testing.md) - Accessibility testing
- [WCAG Compliance](../../accessibility/wcag-compliance.md) - WCAG 2.1 conformance

## Additional Resources

- [Common Accessibility Patterns](../../accessibility/common-patterns.md) - Frequently used patterns
- [Accessibility Overview](../../accessibility/overview.md) - Architecture overview

## Quick Reference

### Semantic HTML

Framework components output semantic HTML:

```html
<!-- HeroSection renders as -->
<section aria-labelledby="hero-heading">
  <h1 id="hero-heading">Welcome</h1>
  <p>Description text</p>
  <a href="/start" role="button">Get Started</a>
</section>
```

### ARIA in Components

```typescript
// Button with accessible label
<Button aria-label="Close menu">
  <Icon name="x" />
</Button>

// Form with accessible errors
<FormField
  label="Email"
  error="Please enter a valid email"
  required
/>
```

### Keyboard Support

All interactive components support:
- `Tab` / `Shift+Tab` - Navigate between elements
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close modals and dropdowns
- Arrow keys - Navigate within component groups

## See Also

- [Accessibility Components](../../components/overview.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
