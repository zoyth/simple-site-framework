# WCAG 2.1 AA Compliance Checklist

Use this checklist when building sites with the Simple Site Framework to ensure WCAG 2.1 Level AA compliance.

## Perceivable

### Text Alternatives (1.1)
- [ ] All images have alt text
- [ ] Decorative images use empty alt (`alt=""`)
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated labels

### Time-based Media (1.2)
- [ ] Videos have captions
- [ ] Audio content has transcripts
- [ ] Video-only content has audio description or transcript

### Adaptable (1.3)
- [ ] Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, etc.)
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Lists use `<ul>`, `<ol>`, `<li>` elements
- [ ] Tables have proper headers (`<th>`)
- [ ] Form labels are programmatically associated

### Distinguishable (1.4)
- [ ] Color is not the only means of conveying information
- [ ] Text contrast is at least 4.5:1 (3:1 for large text)
- [ ] UI component contrast is at least 3:1
- [ ] Text can be resized to 200% without loss of functionality
- [ ] No background audio that can't be paused
- [ ] Line height is at least 1.5x font size
- [ ] Paragraph spacing is at least 2x font size

## Operable

### Keyboard Accessible (2.1)
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Keyboard shortcuts don't conflict with assistive tech
- [ ] Tab order is logical
- [ ] Focus is visible on all interactive elements

### Enough Time (2.2)
- [ ] Time limits can be extended or disabled
- [ ] Auto-updating content can be paused
- [ ] Session timeouts are announced in advance

### Seizures and Physical Reactions (2.3)
- [ ] No content flashes more than 3 times per second
- [ ] Parallax and motion can be disabled via `prefers-reduced-motion`

### Navigable (2.4)
- [ ] Skip link to main content
- [ ] Page titles are descriptive
- [ ] Focus order is meaningful
- [ ] Link text describes destination
- [ ] Multiple ways to find pages (menu, search, sitemap)
- [ ] Headings and labels are descriptive
- [ ] Focus is visible

### Input Modalities (2.5)
- [ ] Touch targets are at least 44x44px
- [ ] Gestures have keyboard alternatives
- [ ] Click events don't fire on touch down
- [ ] Labels match accessible names

## Understandable

### Readable (3.1)
- [ ] Page language is declared (`lang="en"`)
- [ ] Language changes are marked (`lang="fr"`)

### Predictable (3.2)
- [ ] Focus doesn't trigger unexpected context changes
- [ ] Input doesn't cause unexpected context changes
- [ ] Navigation is consistent across pages
- [ ] Components with same functionality have consistent labels

### Input Assistance (3.3)
- [ ] Form errors are clearly identified
- [ ] Labels or instructions provided for input
- [ ] Error messages suggest corrections
- [ ] Errors can be corrected before final submission
- [ ] Confirmation for legal/financial transactions

## Robust

### Compatible (4.1)
- [ ] Valid HTML (no duplicate IDs)
- [ ] Start and end tags are properly nested
- [ ] ARIA attributes are valid
- [ ] Status messages use `role="status"` or `aria-live`

## Framework-Specific Checks

### Components
- [ ] Use framework components instead of custom elements
- [ ] Pass `aria-label` to icon-only buttons
- [ ] Enable `prefers-reduced-motion` support in animations
- [ ] Use `Toast` for announcements, not console.log
- [ ] Use `Modal` component's built-in focus trap

### Theme
- [ ] Color palette meets contrast requirements
- [ ] Focus ring is visible and high-contrast
- [ ] Error/success states use more than just color

### Forms
- [ ] Use `FormField` component for consistent labels
- [ ] Use `error` prop to display validation messages
- [ ] Mark required fields with `required` prop
- [ ] Group related inputs with `fieldset` and `legend`

## Testing Process

1. **Automated Testing**
   - Use Lighthouse audit
   - Run axe DevTools browser extension
   - Integrate axe-core in test suite

2. **Manual Testing**
   - Navigate entire site with keyboard only
   - Test with screen reader (NVDA, VoiceOver, JAWS)
   - Zoom to 200% and verify layout
   - Test with high contrast mode
   - Verify with `prefers-reduced-motion` enabled

3. **User Testing**
   - Test with users who use assistive technology
   - Get feedback from people with disabilities

## Common Issues to Avoid

❌ **Don't**
- Use `div` or `span` as buttons
- Rely on color alone for status
- Hide focus indicators
- Use low-contrast colors
- Autoplay videos with sound
- Create keyboard traps
- Use tiny touch targets
- Skip heading levels

✅ **Do**
- Use semantic HTML
- Provide text alternatives
- Make interactive elements keyboard accessible
- Ensure sufficient color contrast
- Support prefers-reduced-motion
- Test with assistive technology
- Follow ARIA best practices
- Keep it simple

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Framework Component Guides](./components/)
- [Keyboard Navigation Guide](./keyboard-navigation.md)
- [Screen Reader Testing](./screen-readers.md)
