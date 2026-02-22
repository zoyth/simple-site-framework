# SkipLink

Accessible skip navigation link for keyboard users. Hidden by default, it appears when focused via Tab and allows users to bypass repetitive navigation elements and jump directly to the main content area.

## Import

```typescript
import { SkipLink } from '@zoyth/simple-site-framework';
```

**Type:** Client Component (`'use client'`)

**Source:** `src/components/a11y/SkipLink.tsx`

## Basic Usage

```typescript
// In your root layout, before the header
<SkipLink href="#main-content">Skip to main content</SkipLink>
<Header />
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `href` | `string` | CSS selector for the target element to skip to (e.g., `"#main-content"`) |
| `children` | `ReactNode` | Link text displayed when the component is focused |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes merged with the default styles |

## How It Works

1. The link is positioned absolutely at the top-left of the page and translated off-screen (`-translate-y-full`).
2. When a keyboard user presses Tab, the link receives focus and transitions into view (`focus:translate-y-0`).
3. On click, the component prevents the default anchor behavior and instead:
   - Finds the target element using `document.querySelector(href)`
   - Calls `.focus()` on the target element
   - Scrolls the target into view with `{ behavior: 'smooth', block: 'start' }`

This approach works even when the target element is not natively focusable, as long as it has `tabIndex={-1}`.

## Examples

### Standard Layout Integration

```typescript
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

### French Label

```typescript
<SkipLink href="#contenu-principal">
  Aller au contenu principal
</SkipLink>
```

### Multiple Skip Links

For pages with complex navigation, you can provide multiple skip links:

```typescript
<div>
  <SkipLink href="#main-content">Skip to main content</SkipLink>
  <SkipLink href="#sidebar">Skip to sidebar</SkipLink>
</div>

{/* Later in the page */}
<main id="main-content" tabIndex={-1}>...</main>
<aside id="sidebar" tabIndex={-1}>...</aside>
```

### Custom Styling

```typescript
<SkipLink
  href="#main-content"
  className="text-lg rounded-br-lg"
>
  Skip to main content
</SkipLink>
```

## Default Styles

The component applies these styles by default:

| State | Styles |
|-------|--------|
| Hidden (default) | `absolute left-0 top-0 z-50 -translate-y-full` |
| Visible (focused) | `focus:translate-y-0` with `transition-transform` |
| Visual | `bg-primary text-white px-4 py-2 font-medium` |
| Focus ring | `focus:ring-2 focus:ring-offset-2 focus:ring-primary` with `focus:outline-none` |

Custom classes passed via `className` are merged using the `cn()` utility, so they can override any default.

## Target Element Setup

The target element must:

1. Have an `id` that matches the `href` value (without the `#`)
2. Have `tabIndex={-1}` so it can receive programmatic focus

```typescript
{/* Correct */}
<main id="main-content" tabIndex={-1}>

{/* The href must include the # */}
<SkipLink href="#main-content">Skip to main content</SkipLink>
```

## Accessibility

- Meets WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
- Only visible to keyboard users (hidden from mouse/touch users)
- Uses semantic `<a>` element
- Focus ring provides clear visual indication
- Smooth scroll provides orientation context after the skip

## See Also

- **[Header](./layout/Header.md)** - Site header that the skip link typically bypasses
- **[PageLayout](./layout/PageLayout.md)** - Standard page wrapper where skip links are commonly placed
