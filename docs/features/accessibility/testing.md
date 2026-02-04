# Accessibility Testing

Test your site for accessibility compliance.

## Automated Testing

### axe-core

Run automated accessibility audits:

```bash
npm install -D @axe-core/react
```

```typescript
// Enable in development
if (process.env.NODE_ENV === 'development') {
  const axe = require('@axe-core/react');
  const React = require('react');
  const ReactDOM = require('react-dom');
  axe(React, ReactDOM, 1000);
}
```

### eslint-plugin-jsx-a11y

Catch accessibility issues at lint time:

```bash
npm install -D eslint-plugin-jsx-a11y
```

```json
// .eslintrc.json
{
  "extends": ["plugin:jsx-a11y/recommended"]
}
```

Catches issues like:
- Missing alt text on images
- Missing labels on form inputs
- Invalid ARIA attributes
- Incorrect role usage

### Lighthouse

Built into Chrome DevTools:

1. Open DevTools > Lighthouse
2. Check "Accessibility"
3. Run audit
4. Review results and recommendations

## Manual Testing

Automated tools catch ~30% of accessibility issues. Manual testing is essential.

### Keyboard Testing

Test every page with keyboard only:

1. Unplug your mouse
2. Navigate using Tab, Shift+Tab, Enter, Space, Escape, Arrow keys
3. Verify:
   - [ ] Can reach all interactive elements
   - [ ] Focus indicator is visible
   - [ ] Tab order is logical
   - [ ] Modals trap focus
   - [ ] Focus returns after closing overlays
   - [ ] No keyboard traps

### Screen Reader Testing

Test with actual screen readers:

| Platform | Screen Reader | Browser |
|----------|--------------|---------|
| macOS | VoiceOver | Safari |
| Windows | NVDA (free) | Firefox |
| Windows | JAWS | Chrome/Edge |
| iOS | VoiceOver | Safari |
| Android | TalkBack | Chrome |

#### VoiceOver Quick Start (macOS)

1. Press `Cmd + F5` to enable VoiceOver
2. Use `VO + Right Arrow` to move forward (`VO` = Ctrl + Option)
3. Use `VO + Left Arrow` to move backward
4. Press `VO + Space` to activate
5. Press `Cmd + F5` again to disable

#### What to Check

- [ ] Page title is announced on load
- [ ] Headings create a logical outline
- [ ] Images have descriptive alt text
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Navigation landmarks are present

### Zoom Testing

1. Zoom to 200% (Cmd/Ctrl + =)
2. Verify no content is cut off
3. Verify no horizontal scrolling on main content
4. Zoom to 400% for WCAG AAA

### Color Testing

Test for color blindness:

- Chrome DevTools > Rendering > Emulate vision deficiencies
- Select each deficiency type and verify usability
- Ensure information isn't conveyed by color alone

## Testing Checklist

### Per Component

- [ ] Keyboard accessible
- [ ] Screen reader announces correctly
- [ ] ARIA attributes present and valid
- [ ] Focus management works
- [ ] Color contrast passes 4.5:1

### Per Page

- [ ] Single `<h1>` element
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Language attribute set on `<html>`
- [ ] Landmark regions present (banner, nav, main, contentinfo)
- [ ] Skip link works
- [ ] Page title is descriptive

### Per Site

- [ ] Consistent navigation across pages
- [ ] Error pages are accessible
- [ ] 404 page is accessible
- [ ] All PDF/document downloads are accessible
- [ ] Video content has captions
- [ ] Audio content has transcripts

## CI/CD Integration

### axe in Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<HeroSection heading="Test" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Pa11y in CI

```bash
npm install -D pa11y

# Test a URL
npx pa11y http://localhost:3000
```

Add to CI pipeline:

```yaml
# .github/workflows/a11y.yml
- name: Accessibility test
  run: npx pa11y http://localhost:3000 --threshold 0
```

## Reporting Issues

When you find an accessibility issue:

1. **What**: Describe the specific failure
2. **Where**: Page URL and element location
3. **WCAG Criterion**: Which guideline is violated
4. **Impact**: Who is affected and how
5. **Fix**: Suggested remediation

## See Also

- [WCAG Compliance](../../accessibility/wcag-compliance.md)
- [Keyboard Navigation](../../accessibility/keyboard-navigation.md)
- [Screen Readers](../../accessibility/screen-readers.md)
- [ARIA Support](./aria-support.md)
