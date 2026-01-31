# Screen Reader Testing Guide

Testing with screen readers is essential to ensure your site is accessible to users with visual impairments.

## Screen Reader Software

### Windows
**NVDA (Free, Open Source)**
- Download: https://www.nvaccess.org/
- Most popular free option
- Good compatibility with modern web standards

**JAWS (Commercial)**
- Most widely used by professionals
- Expensive ($1000+)
- Very thorough testing tool

### macOS
**VoiceOver (Built-in)**
- Cmd + F5 to toggle on/off
- Free and pre-installed
- Good for basic testing

### Mobile
**iOS VoiceOver**
- Settings → Accessibility → VoiceOver
- Triple-click home button shortcut

**Android TalkBack**
- Settings → Accessibility → TalkBack
- Volume keys shortcut

## Quick Start with NVDA (Windows)

### Basic Controls
- **NVDA + Space**: Toggle browse/focus mode
- **↓**: Read next item
- **↑**: Read previous item
- **Tab**: Navigate to next focusable element
- **NVDA + T**: Read window title
- **NVDA + B**: Read entire page
- **Insert**: NVDA modifier key

### Testing Workflow
1. Start NVDA
2. Open your site
3. Press **NVDA + B** to read entire page
4. Use **↓** to navigate item by item
5. Use **Tab** to jump between interactive elements
6. Listen for:
   - Clear labels and descriptions
   - Proper heading hierarchy
   - Form field labels
   - Button text
   - Image alt text
   - Error messages

## Quick Start with VoiceOver (macOS)

### Basic Controls
- **Cmd + F5**: Toggle VoiceOver on/off
- **VO + →**: Next item (VO = Ctrl + Option)
- **VO + ←**: Previous item
- **VO + Cmd + H**: Next heading
- **VO + Cmd + Shift + H**: Previous heading
- **VO + U**: Open rotor (navigation menu)
- **Tab**: Next focusable element

### Testing Workflow
1. Press **Cmd + F5** to start
2. Open your site
3. Press **VO + A** to read entire page
4. Use **VO + →** to navigate
5. Press **VO + U** for rotor navigation
6. Test interactions with **VO + Space**

## What to Listen For

### ✅ Good Screen Reader Experience
- **Descriptive labels**: "Submit contact form" not just "Submit"
- **Clear headings**: "Contact Us - heading level 2"
- **Form labels**: "Email address, edit text, required"
- **Error messages**: "Email address, invalid format, edit text"
- **State changes**: "Loading complete" announcements
- **Alt text**: "Company logo" not "image-logo-final-v2.png"

### ❌ Poor Screen Reader Experience
- "Button" with no label
- "Image" with no alt text
- "Required" not announced
- "Edit text" with no label
- No headings or all h1s
- Silent state changes
- "Click here" links

## Component Testing Examples

### Button
```tsx
<Button onClick={handleSubmit}>Submit Form</Button>
```
**Reads**: "Submit Form, button"

### Icon Button
```tsx
<Button icon={<Icons.Search />} iconOnly aria-label="Search">
```
**Reads**: "Search, button"

### Form Field
```tsx
<FormField
  name="email"
  label="Email Address"
  required
  error={errors.email}
>
  <input type="email" {...register('email')} />
</FormField>
```
**Reads**: "Email Address, edit text, required"
**If error**: "Email Address, invalid format, edit text, required"

### Modal
```tsx
<Modal isOpen={true} title="Confirm Action">
  <p>Are you sure?</p>
</Modal>
```
**Reads**: "Confirm Action, dialog"
**Announces**: When modal opens, focus moves and title is read

### Live Region (Toast)
```tsx
toast.success('Form submitted successfully')
```
**Announces**: "Form submitted successfully" (polite)

### Loading State
```tsx
<Button loading={true}>Submit</Button>
```
**Reads**: "Submit, button, busy"

## ARIA Attributes and What They Do

### aria-label
Provides accessible name when visible text isn't enough:
```tsx
<Button icon={<Icons.Close />} aria-label="Close dialog" />
```
**Reads**: "Close dialog, button"

### aria-labelledby
References another element for label:
```tsx
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Delete</h2>
</div>
```
**Reads**: "Confirm Delete, dialog"

### aria-describedby
Provides additional description:
```tsx
<input
  id="password"
  type="password"
  aria-describedby="password-hint"
/>
<p id="password-hint">
  Must be at least 8 characters
</p>
```
**Reads**: "Password, edit text. Must be at least 8 characters"

### aria-live
Announces dynamic content changes:
```tsx
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```
**Announces**: When statusMessage changes

### aria-hidden
Hides decorative content:
```tsx
<span aria-hidden="true">★</span>
<span className="sr-only">5 out of 5 stars</span>
```
**Reads**: "5 out of 5 stars" (star icon ignored)

## Common Screen Reader Issues

### Issue: Button Reads as "Button" Only
**Problem**: No accessible text
```tsx
<button onClick={handleClick}>
  <Icon name="trash" />
</button>
```
**Fix**: Add aria-label
```tsx
<Button
  icon={<Icons.Trash />}
  iconOnly
  aria-label="Delete item"
/>
```

### Issue: Form Field Not Associated with Label
**Problem**: Label not programmatically connected
```tsx
<label>Email</label>
<input type="email" />
```
**Fix**: Use for/id or nest input
```tsx
<FormField name="email" label="Email">
  <input type="email" />
</FormField>
```

### Issue: State Changes Not Announced
**Problem**: Loading/success state is visual only
```tsx
<button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```
**Fix**: Use aria-busy or toast announcement
```tsx
<Button loading={isLoading}>Submit</Button>
```

### Issue: Modal Focus Not Managed
**Problem**: Focus doesn't move to modal
```tsx
<div className={isOpen ? 'modal' : 'modal hidden'}>
  {/* content */}
</div>
```
**Fix**: Use framework Modal
```tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  {/* content */}
</Modal>
```

## Testing Checklist

- [ ] All buttons and links have accessible text
- [ ] All form fields have associated labels
- [ ] Required fields are announced as required
- [ ] Form errors are announced clearly
- [ ] Headings create logical document outline
- [ ] Images have descriptive alt text (or alt="" if decorative)
- [ ] Modals announce when opened
- [ ] Focus moves logically through page
- [ ] State changes (loading, success, error) are announced
- [ ] Skip links work
- [ ] Data tables have proper headers
- [ ] Live regions announce dynamic content

## Framework Utilities for Screen Readers

### useA11y Hook
```tsx
import { useA11y } from '@zoyth/simple-site-framework'

const { announce } = useA11y()

const handleSubmit = async () => {
  await submitForm()
  announce('Form submitted successfully', 'polite')
}
```

### A11yAnnouncer Component
```tsx
import { A11yAnnouncer } from '@zoyth/simple-site-framework'

<A11yAnnouncer
  message={statusMessage}
  politeness="polite" // or "assertive"
/>
```

### Screen Reader Only Text
```tsx
// Visible to screen readers, hidden visually
<span className="sr-only">Required field</span>
```

## Resources

- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [VoiceOver Guide](https://www.apple.com/voiceover/info/guide/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Pro Tips

1. **Test early and often** - Don't wait until the end
2. **Listen to the full page** - Navigate start to finish
3. **Test forms completely** - Fill out, submit, handle errors
4. **Test all interactive elements** - Buttons, links, modals, etc.
5. **Test with real users** - Nothing beats actual screen reader users
6. **Keep it simple** - Don't over-use ARIA, semantic HTML is often enough
7. **Test on mobile** - VoiceOver/TalkBack usage is common
