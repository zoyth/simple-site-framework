# StickyBar

Sticky banner/bar component (top or bottom).

## Import

```typescript
import { StickyBar } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<StickyBar
  position="top"
  message="🎉 New feature released!"
  cta={{
    text: 'Learn More',
    href: '/features/new'
  }}
  onDismiss={() => setShowBar(false)}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string \| LocalizedString` | Yes | Bar message |
| `position` | `'top' \| 'bottom'` | No | Position (default: 'top') |
| `cta` | `CTAConfig` | No | Call-to-action |
| `dismissible` | `boolean` | No | Show close button |
| `onDismiss` | `function` | No | Dismiss handler |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## Examples

```typescript
// Announcement bar
<StickyBar
  position="top"
  message="Limited time offer - 50% off all plans!"
  cta={{ text: 'Get Started', href: '/pricing' }}
  dismissible
/>

// Cookie notice
<StickyBar
  position="bottom"
  message="We use cookies to improve your experience."
  cta={{ text: 'Learn More', href: '/privacy' }}
  onDismiss={() => setCookieConsent(true)}
/>
```

## See Also

- [MobileCTA](./conversion/MobileCTA.md)
- [Toast](./Toast.md)
