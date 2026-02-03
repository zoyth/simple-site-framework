# MobileCTA

A sticky mobile-only CTA button that appears after scroll threshold. Battle-tested on courrielleur.com to improve mobile conversion rates.

## Import

```typescript
import { MobileCTA } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component (`/client` export)
**Why Client:** Uses `window`, `scrollY`, and React hooks

## Basic Usage

```typescript
<MobileCTA
  text="Start Free Trial"
  href="/signup"
  locale="en"
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string \| LocalizedString` | CTA button text |
| `href` | `string` | Destination URL |
| `locale` | `string` | Current locale (for LocalizedString) |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `threshold` | `number` | `300` | Scroll distance (px) before showing |
| `hideAbove` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'lg'` | Breakpoint to hide on larger screens |
| `onClick` | `() => void` | - | Click handler (for analytics) |
| `className` | `string` | - | Custom CSS classes |
| `zIndex` | `number` | `50` | Z-index value |

## Examples

### Simple Mobile CTA

```typescript
<MobileCTA
  text="Get Started"
  href="/signup"
  locale="en"
/>
```

### Multi-Language

```typescript
<MobileCTA
  text={{
    en: 'Start Free Trial - No Card Required',
    fr: 'Essai gratuit - Aucune carte requise'
  }}
  href="/signup"
  locale={locale}
/>
```

### Custom Scroll Threshold

```typescript
<MobileCTA
  text="Contact Us"
  href="/contact"
  threshold={500}  // Show after 500px scroll
  locale="en"
/>
```

### With Analytics Tracking

```typescript
<MobileCTA
  text="Start Free Trial"
  href="/signup"
  locale="en"
  onClick={() => {
    trackEvent('mobile_cta_click', {
      location: 'homepage',
      scrollDepth: window.scrollY
    });
  }}
/>
```

### Hide on Tablet and Up

```typescript
<MobileCTA
  text="Get Started"
  href="/signup"
  hideAbove="md"  // Hide on md breakpoint and above
  locale="en"
/>
```

### Custom Z-Index

```typescript
<MobileCTA
  text="Sign Up"
  href="/signup"
  zIndex={100}  // Ensure it's above modals/overlays
  locale="en"
/>
```

## Behavior

### Scroll Triggering

- **Hidden by default** - Doesn't appear immediately on page load
- **Appears on scroll** - Shows after scrolling past threshold (default 300px)
- **Smooth animation** - Slides up from bottom with transition
- **Stays visible** - Remains visible while scrolling further

### Responsive Display

- **Mobile only** - Hidden on desktop/tablet by default
- **Configurable breakpoint** - Use `hideAbove` to control when it hides
- **No layout shift** - Position fixed, doesn't affect page flow

### Accessibility

- **Semantic link** - Uses `<a>` tag, not button
- **Keyboard accessible** - Can be focused and activated with Enter
- **Screen reader friendly** - Announces as navigation link
- **44px min tap target** - Meets touch target size guidelines

## Performance

- **Passive scroll listener** - Doesn't block scrolling performance
- **No throttle/debounce needed** - Browser optimizes passive listeners
- **Minimal JavaScript** - ~1KB gzipped
- **CSS transitions** - Hardware-accelerated animations

## Styling

### Custom Colors

```typescript
<MobileCTA
  text="Get Started"
  href="/signup"
  className="bg-purple-600 hover:bg-purple-700"
  locale="en"
/>
```

### Custom Size

```typescript
<MobileCTA
  text="Sign Up"
  href="/signup"
  className="text-lg px-12 py-6"
  locale="en"
/>
```

### Custom Shadow

```typescript
<MobileCTA
  text="Try Now"
  href="/trial"
  className="shadow-2xl"
  locale="en"
/>
```

## Common Patterns

### Site-Wide Mobile CTA

Add to root layout for consistent mobile conversion:

```typescript
// src/app/layout.tsx
import { MobileCTA } from '@zoyth/simple-site-framework/client';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <MobileCTA
          text={{ en: 'Start Free Trial', fr: 'Essai gratuit' }}
          href="/signup"
          locale="en"
        />
      </body>
    </html>
  );
}
```

### Page-Specific CTA

Different CTA per page:

```typescript
// src/app/pricing/page.tsx
<>
  <PricingSection {...props} />
  <MobileCTA
    text="Start 14-Day Trial"
    href="/signup?plan=pro"
    locale="en"
  />
</>
```

### With Campaign Tracking

```typescript
<MobileCTA
  text="Special Offer"
  href="/signup?ref=mobile_cta&campaign=summer2024"
  onClick={() => {
    trackCampaign('summer2024', 'mobile_cta_click');
  }}
  locale="en"
/>
```

## Analytics Integration

### Track Visibility

```typescript
'use client';

import { MobileCTA } from '@zoyth/simple-site-framework/client';
import { useEffect, useState } from 'react';

export default function PageWithCTA() {
  const [ctaShown, setCtaShown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !ctaShown) {
        setCtaShown(true);
        trackEvent('mobile_cta_shown');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ctaShown]);

  return <MobileCTA text="Sign Up" href="/signup" locale="en" />;
}
```

### Track Clicks

```typescript
<MobileCTA
  text="Get Started"
  href="/signup"
  onClick={() => {
    trackEvent('mobile_cta_click', {
      page: window.location.pathname,
      scrollDepth: window.scrollY,
      timestamp: Date.now()
    });
  }}
  locale="en"
/>
```

## Best Practices

### ✅ Do

- Use action-oriented text ("Start Free Trial", "Get Quote")
- Keep text short (under 30 characters)
- Use consistent CTA across site
- Track clicks to measure effectiveness
- Test different scroll thresholds

### ❌ Don't

- Use vague text ("Click Here", "Learn More")
- Make text too long (wraps awkwardly)
- Show on desktop (defeats purpose)
- Set threshold too low (annoying)
- Forget to add analytics

## Troubleshooting

### CTA not appearing on mobile

**Check:**
1. Scrolled past threshold (`threshold` prop)
2. Screen width is below `hideAbove` breakpoint
3. CSS not overriding `position: fixed`
4. Z-index conflicts

### CTA showing on desktop

**Check:**
1. `hideAbove` prop is set correctly (default is `'lg'`)
2. Custom CSS not overriding responsive classes
3. Viewport width is actually above breakpoint

### Scroll performance issues

**Check:**
1. Not adding additional scroll listeners
2. Not using heavy onClick handlers
3. Browser supports passive event listeners

### Wrong language displaying

**Check:**
1. `locale` prop matches current route locale
2. LocalizedString has entry for current locale
3. Fallback locale exists in LocalizedString

## Production Evidence

### Courrielleur.com Results

- **Implementation:** Site-wide in root layout
- **Performance:** No measurable scroll performance impact
- **Conversions:** Positive improvement in mobile funnel
- **User Feedback:** No complaints about annoyance

### Recommended Settings

Based on production usage:

```typescript
<MobileCTA
  text="Start Free Trial"
  href="/signup"
  threshold={300}      // Sweet spot for engagement
  hideAbove="lg"       // Standard desktop breakpoint
  locale={locale}
/>
```

## Related Components

- **[CTASection](../sections/CTASection.md)** - Desktop-optimized CTA section
- **[Button](../ui/Button.md)** - Base button component
- **[AnalyticsTracker](../utilities/AnalyticsTracker.md)** - Full analytics setup

## API Reference

Full TypeScript definitions: **[API Reference](../../api/components.md#mobilecta)**
