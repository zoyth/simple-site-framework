# ARIA Support

ARIA (Accessible Rich Internet Applications) implementation across framework components.

## Built-in ARIA Attributes

Framework components include appropriate ARIA attributes by default.

### Sections

```html
<!-- HeroSection -->
<section aria-labelledby="hero-heading">
  <h1 id="hero-heading">...</h1>
</section>

<!-- FAQAccordion -->
<div role="region" aria-labelledby="faq-heading">
  <button aria-expanded="true" aria-controls="faq-1-content">
    Question text
  </button>
  <div id="faq-1-content" role="region" aria-labelledby="faq-1-heading">
    Answer text
  </div>
</div>
```

### Navigation

```html
<!-- Header -->
<header role="banner">
  <nav aria-label="Main navigation">
    <ul role="menubar">...</ul>
  </nav>
</header>

<!-- Footer -->
<footer role="contentinfo">
  <nav aria-label="Footer navigation">...</nav>
</footer>

<!-- Breadcrumb -->
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li aria-current="page">About</li>
  </ol>
</nav>
```

### Forms

```html
<!-- FormField -->
<div>
  <label for="email">Email <span aria-hidden="true">*</span></label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid="true"
    aria-describedby="email-error email-help"
  />
  <span id="email-error" role="alert">Please enter a valid email</span>
  <span id="email-help">We'll never share your email</span>
</div>
```

### Modals

```html
<!-- Modal -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal content</p>
  <button aria-label="Close dialog">×</button>
</div>
```

## Common ARIA Patterns

### Live Regions

For dynamic content updates:

```typescript
// Toast notifications
<div role="status" aria-live="polite">
  Message sent successfully
</div>

// Error alerts
<div role="alert" aria-live="assertive">
  Form submission failed
</div>
```

### Loading States

```typescript
<div aria-busy="true" aria-live="polite">
  <LoadingSpinner aria-label="Loading content" />
</div>
```

### Tabs

```html
<div role="tablist" aria-label="Service categories">
  <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">Tab 2</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  Panel content
</div>
```

## Custom ARIA Props

Pass additional ARIA attributes to components:

```typescript
<Button
  aria-label="Submit contact form"
  aria-describedby="form-instructions"
>
  Submit
</Button>

<Card aria-labelledby="card-title">
  <h3 id="card-title">Card Title</h3>
</Card>
```

## ARIA Roles Reference

### Landmark Roles

| Role | Usage | Framework Component |
|------|-------|-------------------|
| `banner` | Site header | Header |
| `navigation` | Nav sections | Header, Footer |
| `main` | Main content | Layout wrapper |
| `contentinfo` | Site footer | Footer |
| `complementary` | Sidebar | - |
| `search` | Search form | - |

### Widget Roles

| Role | Usage | Framework Component |
|------|-------|-------------------|
| `button` | Clickable action | Button |
| `dialog` | Modal/popup | Modal, ExitIntentModal |
| `tablist` / `tab` / `tabpanel` | Tab interface | Tabs |
| `alert` | Important message | Toast |
| `status` | Status update | Toast, LiveProof |

## Best Practices

- Don't add ARIA roles that duplicate native HTML semantics
- Use `aria-label` for icon-only buttons
- Use `aria-describedby` for additional context
- Use `aria-live` for dynamic content changes
- Test with actual screen readers, not just automated tools

## See Also

- [Screen Readers](../../accessibility/screen-readers.md)
- [Common Patterns](../../accessibility/common-patterns.md)
- [WCAG Compliance](../../accessibility/wcag-compliance.md)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
