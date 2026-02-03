# Analytics Setup

Complete guide to setting up analytics tracking with Simple Site Framework.

## Overview

The framework provides built-in analytics utilities for:

- **Page view tracking** - Automatic on route changes
- **Scroll depth tracking** - Engagement milestones (25%, 50%, 75%, 100%)
- **CTA click tracking** - Button and link conversions
- **A/B test events** - Test variant tracking
- **Custom events** - Flexible event tracking

All analytics push to `window.dataLayer` for Google Tag Manager compatibility.

## Quick Start

### 1. Add Analytics Tracker

```typescript
// src/app/layout.tsx
import { AnalyticsTracker } from '@zoyth/simple-site-framework/client';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
```

This automatically tracks:
- Page views on route changes
- Scroll depth at 25%, 50%, 75%, 100%

### 2. Add Google Tag Manager

```typescript
// src/app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXX');
          `}
        </Script>
      </head>
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
```

Replace `GTM-XXXXXX` with your GTM container ID.

## Page View Tracking

### Automatic Tracking

`AnalyticsTracker` automatically tracks page views on route changes:

```typescript
// Pushed to dataLayer:
{
  event: 'page_view',
  page_path: '/about',
  page_title: 'About Us - Your Company'
}
```

### Manual Page View

```typescript
import { trackPageView } from '@zoyth/simple-site-framework/lib/analytics';

trackPageView('/custom-page', 'Custom Page Title');
```

### With Metadata

```typescript
trackPageView('/product/123', 'Product Details', {
  product_id: '123',
  category: 'electronics',
  price: 99.99
});
```

## Scroll Depth Tracking

### Automatic Tracking

`AnalyticsTracker` tracks scroll milestones:

```typescript
// Pushed to dataLayer at each milestone:
{
  event: 'scroll_depth',
  event_category: 'engagement',
  event_label: '25%',
  scroll_percentage: 25,
  page_path: '/about'
}
```

Milestones: 25%, 50%, 75%, 100%

### Manual Scroll Tracking

```typescript
import { trackScrollDepth } from '@zoyth/simple-site-framework/lib/analytics';

trackScrollDepth(50, '/about');  // Track 50% scroll
```

### Custom Milestones

Create your own scroll tracker:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@zoyth/simple-site-framework/lib/analytics';

export function CustomScrollTracker({ milestones = [10, 30, 60, 90] }) {
  const tracked = useRef(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !tracked.current.has(milestone)) {
          tracked.current.add(milestone);
          trackScrollDepth(milestone, window.location.pathname);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [milestones]);

  return null;
}
```

## CTA Click Tracking

### Opt-in Click Tracking

Components support optional `onClick` for tracking:

```typescript
<HeroSection
  heading="Welcome"
  cta={{
    text: 'Get Started',
    href: '/signup',
    onClick: () => {
      // Your tracking logic
      trackCTAClick('hero_cta', { location: 'homepage' });
    }
  }}
/>
```

### Track Link Clicks

Use `TrackedLink` for automatic link tracking:

```typescript
import { TrackedLink } from '@zoyth/simple-site-framework';

<TrackedLink
  href="/pricing"
  eventName="pricing_link_click"
  eventData={{ location: 'footer' }}
>
  View Pricing
</TrackedLink>
```

Pushed to dataLayer:
```typescript
{
  event: 'link_click',
  event_category: 'navigation',
  event_label: 'pricing_link_click',
  link_url: '/pricing',
  ...eventData
}
```

### Track Button Clicks

```typescript
import { trackEvent } from '@zoyth/simple-site-framework/lib/analytics';

<Button
  onClick={() => {
    trackEvent('button_click', {
      button_text: 'Download',
      button_location: 'hero',
      file_type: 'pdf'
    });
  }}
>
  Download PDF
</Button>
```

## A/B Test Tracking

### Track A/B Test Events

```typescript
import { getABTestVariant, trackABTestEvent } from '@zoyth/simple-site-framework/client';

// Get variant
const variant = getABTestVariant({
  testId: 'hero_cta_test',
  variants: { A: { weight: 50 }, B: { weight: 50 } }
});

// Show variant
const ctaText = variant === 'A' ? 'Get Started' : 'Start Free Trial';

// Track conversion
<Button
  onClick={() => {
    trackABTestEvent('hero_cta_test', variant, 'conversion', {
      revenue: 99.99
    });
  }}
>
  {ctaText}
</Button>
```

Pushed to dataLayer:
```typescript
{
  event: 'ab_test_event',
  event_category: 'ab_test',
  event_label: 'hero_cta_test_A_conversion',
  test_id: 'hero_cta_test',
  variant: 'A',
  test_event: 'conversion',
  revenue: 99.99
}
```

## Custom Events

### Basic Custom Event

```typescript
import { trackEvent } from '@zoyth/simple-site-framework/lib/analytics';

trackEvent('video_play', {
  video_title: 'Product Demo',
  video_duration: 120,
  video_percent: 0
});
```

### E-commerce Events

```typescript
// Add to cart
trackEvent('add_to_cart', {
  item_id: 'SKU123',
  item_name: 'Premium Plan',
  price: 99.99,
  currency: 'USD',
  quantity: 1
});

// Begin checkout
trackEvent('begin_checkout', {
  value: 99.99,
  currency: 'USD',
  items: [{
    item_id: 'SKU123',
    item_name: 'Premium Plan',
    price: 99.99
  }]
});

// Purchase
trackEvent('purchase', {
  transaction_id: 'T12345',
  value: 99.99,
  currency: 'USD',
  items: [...]
});
```

### Form Events

```typescript
// Form start
trackEvent('form_start', {
  form_id: 'contact_form',
  form_name: 'Contact Us'
});

// Form submit
trackEvent('form_submit', {
  form_id: 'contact_form',
  form_name: 'Contact Us',
  submission_time: Date.now()
});

// Form error
trackEvent('form_error', {
  form_id: 'contact_form',
  error_field: 'email',
  error_message: 'Invalid email format'
});
```

## Google Tag Manager Setup

### 1. Create GTM Container

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Create a new container for your website
3. Copy the GTM container ID (GTM-XXXXXX)

### 2. Add GTM Script

```typescript
// src/app/layout.tsx
<Script id="gtm" strategy="afterInteractive">
  {`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
  `}
</Script>

<!-- GTM noscript (in <body>) -->
<noscript>
  <iframe
    src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
    height="0"
    width="0"
    style={{ display: 'none', visibility: 'hidden' }}
  />
</noscript>
```

### 3. Configure Tags in GTM

**Page View Tag:**
1. New Tag → Google Analytics: GA4 Event
2. Event Name: `page_view`
3. Trigger: Custom Event → `page_view`
4. Add Event Parameters from dataLayer variables

**Scroll Depth Tag:**
1. New Tag → Google Analytics: GA4 Event
2. Event Name: `scroll`
3. Trigger: Custom Event → `scroll_depth`
4. Add parameters: scroll_percentage, page_path

**Custom Event Tag:**
1. New Tag → Google Analytics: GA4 Event
2. Event Name: `{{Event}}` (use Event variable)
3. Trigger: All Custom Events
4. Pass all dataLayer variables as parameters

## Environment-Specific Tracking

### Development vs Production

```typescript
// src/lib/analytics/config.ts
export const analyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  debug: process.env.NODE_ENV === 'development',
};

// Conditional tracking
import { analyticsConfig } from '@/lib/analytics/config';

function trackEvent(eventName, data) {
  if (!analyticsConfig.enabled) {
    if (analyticsConfig.debug) {
      console.log('[Analytics Debug]', eventName, data);
    }
    return;
  }

  // Real tracking
  pushToDataLayer({ event: eventName, ...data });
}
```

### Multiple Environments

```env
# .env.local
NEXT_PUBLIC_GTM_ID=GTM-DEV123

# .env.production
NEXT_PUBLIC_GTM_ID=GTM-PROD456
```

## Privacy & GDPR Compliance

### Cookie Consent Integration

```typescript
'use client';

import { AnalyticsTracker } from '@zoyth/simple-site-framework/client';
import { useEffect, useState } from 'react';

export function ConditionalAnalytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    // Check cookie consent
    const hasConsent = getCookieConsent();
    setConsent(hasConsent);
  }, []);

  if (!consent) return null;

  return <AnalyticsTracker />;
}

function getCookieConsent() {
  // Check your consent management platform
  return localStorage.getItem('cookie_consent') === 'granted';
}
```

### Anonymize IP Addresses

Configure in GTM:
1. Open your GA4 Configuration Tag
2. Add Field: `anonymize_ip` → `true`

### Disable Tracking

```typescript
// Respect Do Not Track
const dnt = navigator.doNotTrack || window.doNotTrack;
if (dnt === '1' || dnt === 'yes') {
  // Don't load AnalyticsTracker
}
```

## Testing & Debugging

### Enable Debug Mode

```typescript
// Development console logs
if (process.env.NODE_ENV === 'development') {
  console.log('[Analytics]', {
    event: 'page_view',
    page_path: '/about'
  });
}
```

### GTM Preview Mode

1. Open GTM
2. Click "Preview"
3. Enter your site URL
4. See all events in real-time

### Chrome DevTools

```javascript
// View dataLayer in console
window.dataLayer
// See all pushed events

// Watch for new events
window.dataLayer.push = new Proxy(window.dataLayer.push, {
  apply(target, thisArg, args) {
    console.log('[DataLayer Push]', args[0]);
    return target.apply(thisArg, args);
  }
});
```

### GA4 DebugView

1. Open GA4 property
2. Go to DebugView (in Reports)
3. See real-time events from preview/debug mode

## Best Practices

### ✅ Do

- Track meaningful conversions (signups, purchases, form submits)
- Use consistent event naming (snake_case recommended)
- Include relevant context in event data
- Test tracking before deploying
- Document your tracking plan
- Respect user privacy and consent
- Use server-side tracking for sensitive data

### ❌ Don't

- Track personally identifiable information (PII)
- Send excessive events (rate limits)
- Track every click/interaction
- Use inconsistent event naming
- Forget to test in GTM preview
- Ignore GDPR/privacy regulations
- Track user input values directly

## Common Patterns

### Track Form Conversions

```typescript
<ContactForm
  fields={[...]}
  onSubmit={async (data) => {
    // Track form start
    trackEvent('form_start', { form_id: 'contact' });

    try {
      await submitForm(data);

      // Track successful submission
      trackEvent('form_submit', {
        form_id: 'contact',
        form_name: 'Contact Form'
      });

      // Track as conversion
      trackEvent('generate_lead', {
        lead_source: 'contact_form'
      });
    } catch (error) {
      // Track error
      trackEvent('form_error', {
        form_id: 'contact',
        error: error.message
      });
    }
  }}
/>
```

### Track Video Engagement

```typescript
<video
  onPlay={() => trackEvent('video_play', { video_title: 'Demo' })}
  onPause={() => trackEvent('video_pause', { video_title: 'Demo' })}
  onEnded={() => trackEvent('video_complete', { video_title: 'Demo' })}
/>
```

### Track Search

```typescript
function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    trackEvent('search', {
      search_term: query,
      search_location: 'header'
    });
  };

  return <input onChange={e => setQuery(e.target.value)} onSubmit={handleSearch} />;
}
```

## Related Documentation

- **[AnalyticsTracker](../components/utilities/AnalyticsTracker.md)** - Component API
- **[TrackedLink](../components/utilities/TrackedLink.md)** - Link tracking
- **[A/B Testing](./ab-testing.md)** - Experimentation setup

## API Reference

Full analytics utilities: **[API Reference](../api/utilities.md#analytics)**
