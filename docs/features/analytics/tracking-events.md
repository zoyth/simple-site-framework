# Tracking Events

Track user interactions and custom events.

## Event Tracking Functions

### trackEvent

Track generic custom events:

```typescript
'use client';
import { trackEvent } from '@zoyth/simple-site-framework/client';

function handleAction() {
  trackEvent('button_click', {
    category: 'engagement',
    label: 'hero_cta',
    value: 1,
  });
}
```

### trackPageView

Track page views (automatically tracked by AnalyticsTracker):

```typescript
import { trackPageView } from '@zoyth/simple-site-framework/client';

trackPageView('/about');
```

### trackCTAClick

Track call-to-action clicks:

```typescript
import { trackCTAClick } from '@zoyth/simple-site-framework/client';

<button onClick={() => trackCTAClick('signup', 'hero')}>
  Sign Up
</button>
```

## Common Events

### Form Submissions

```typescript
function handleSubmit(e) {
  e.preventDefault();

  trackEvent('form_submit', {
    form_name: 'contact',
    form_location: 'contact_page',
  });

  // Handle form...
}
```

### Link Clicks

Use TrackedLink component:

```typescript
import { TrackedLink } from '@zoyth/simple-site-framework/components';

<TrackedLink
  href="/pricing"
  eventName="pricing_link_click"
  eventData={{ location: 'nav' }}
>
  View Pricing
</TrackedLink>
```

### Video Interactions

```typescript
function handleVideoPlay() {
  trackEvent('video_play', {
    video_title: 'Product Demo',
    video_duration: 120,
  });
}

function handleVideoComplete() {
  trackEvent('video_complete', {
    video_title: 'Product Demo',
  });
}
```

### Scroll Depth

```typescript
'use client';
import { useEffect } from 'react';
import { trackEvent } from '@zoyth/simple-site-framework/client';

export function ScrollTracker() {
  useEffect(() => {
    const depths = [25, 50, 75, 100];
    let tracked = new Set();

    function handleScroll() {
      const scrollPercent =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

      depths.forEach(depth => {
        if (scrollPercent >= depth && !tracked.has(depth)) {
          trackEvent('scroll_depth', { depth });
          tracked.add(depth);
        }
      });
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}
```

## Event Data Structure

Standard event properties:

```typescript
trackEvent('event_name', {
  category: 'string',    // Event category
  label: 'string',       // Event label
  value: number,         // Numeric value
  // Custom properties...
});
```

## Enhanced E-commerce

### Product Clicks

```typescript
trackEvent('select_item', {
  item_list_name: 'Featured Products',
  items: [{
    item_id: 'SKU123',
    item_name: 'Product Name',
    price: 29.99,
  }],
});
```

### Add to Cart

```typescript
trackEvent('add_to_cart', {
  currency: 'USD',
  value: 29.99,
  items: [{
    item_id: 'SKU123',
    item_name: 'Product Name',
    price: 29.99,
    quantity: 1,
  }],
});
```

### Purchase

```typescript
trackEvent('purchase', {
  transaction_id: 'T12345',
  value: 59.98,
  currency: 'USD',
  items: [{
    item_id: 'SKU123',
    item_name: 'Product Name',
    price: 29.99,
    quantity: 2,
  }],
});
```

## User Timing

Track performance metrics:

```typescript
trackEvent('timing_complete', {
  name: 'api_request',
  value: 324, // milliseconds
  category: 'performance',
});
```

## Error Tracking

```typescript
try {
  // Code that might fail
} catch (error) {
  trackEvent('exception', {
    description: error.message,
    fatal: false,
  });
}
```

## Best Practices

- Use consistent event naming (snake_case recommended)
- Include context in event properties
- Don't track PII (personally identifiable information)
- Test events in GTM Preview mode
- Document your event taxonomy

## See Also

- [Custom Events](./custom-events.md)
- [Conversion Tracking](./conversion-tracking.md)
- [TrackedLink Component](../../components/TrackedLink.md)
