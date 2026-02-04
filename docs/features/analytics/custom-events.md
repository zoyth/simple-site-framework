# Custom Events

Define and track application-specific events.

## Overview

Beyond built-in tracking helpers, you can define custom events tailored to your application's needs.

## Creating Custom Events

### Basic Custom Event

```typescript
'use client';
import { trackEvent } from '@zoyth/simple-site-framework/client';

trackEvent('feature_used', {
  feature_name: 'dark_mode',
  action: 'toggle_on',
});
```

### Typed Custom Events

Define types for consistency:

```typescript
type AppEvent =
  | { name: 'feature_used'; data: { feature_name: string; action: string } }
  | { name: 'content_viewed'; data: { content_id: string; content_type: string } }
  | { name: 'search_performed'; data: { query: string; results_count: number } };

function trackAppEvent(event: AppEvent) {
  trackEvent(event.name, event.data);
}

// Usage
trackAppEvent({
  name: 'search_performed',
  data: { query: 'pricing', results_count: 5 },
});
```

## Event Naming Conventions

### Recommended Format

Use `object_action` pattern in snake_case:

```typescript
// ✅ Good
'button_click'
'form_submit'
'video_play'
'page_scroll'
'menu_open'
'search_complete'

// ❌ Bad
'clickButton'       // camelCase
'FORM_SUBMIT'       // UPPER_CASE
'user clicked btn'  // spaces
'click'             // too vague
```

### Category Prefixes

Group related events:

```typescript
// Navigation
'nav_menu_open'
'nav_link_click'
'nav_search_used'

// Content
'content_viewed'
'content_shared'
'content_bookmarked'

// Commerce
'product_viewed'
'cart_updated'
'checkout_started'
```

## Event Properties

### Standard Properties

Include consistent context:

```typescript
trackEvent('button_click', {
  // What
  element_id: 'hero-cta',
  element_text: 'Get Started',

  // Where
  page_path: '/pricing',
  page_section: 'hero',

  // Context
  locale: 'en',
  viewport: 'desktop',
});
```

### Dynamic Properties

Capture runtime context:

```typescript
function trackInteraction(elementId: string, action: string) {
  trackEvent(`${elementId}_${action}`, {
    timestamp: Date.now(),
    page_path: window.location.pathname,
    referrer: document.referrer,
    screen_width: window.innerWidth,
  });
}
```

## Custom Event Patterns

### Feature Usage Tracking

```typescript
function trackFeatureUsage(feature: string) {
  trackEvent('feature_used', {
    feature,
    session_id: getSessionId(),
    usage_count: incrementUsageCount(feature),
  });
}
```

### Error Tracking

```typescript
function trackError(error: Error, context: string) {
  trackEvent('app_error', {
    error_message: error.message,
    error_type: error.name,
    context,
    page_path: window.location.pathname,
  });
}
```

### User Engagement

```typescript
function trackEngagement(type: string, duration?: number) {
  trackEvent('user_engagement', {
    engagement_type: type,
    engagement_duration: duration,
    page_path: window.location.pathname,
  });
}

// Track time on page
trackEngagement('time_on_page', 45);

// Track interaction
trackEngagement('comment_posted');
```

### Search Tracking

```typescript
function trackSearch(query: string, results: number) {
  trackEvent('search', {
    search_term: query,
    results_count: results,
    search_type: 'site_search',
  });
}

function trackSearchClick(query: string, position: number) {
  trackEvent('search_result_click', {
    search_term: query,
    click_position: position,
  });
}
```

## GTM Integration

Custom events push to GTM dataLayer:

```typescript
// Framework automatically pushes to dataLayer
trackEvent('custom_event', { key: 'value' });

// Equivalent to:
window.dataLayer.push({
  event: 'custom_event',
  key: 'value',
});
```

In GTM, create triggers based on custom event names to fire tags.

## Best Practices

- Document your event taxonomy
- Use consistent naming conventions across the team
- Include enough context to make events actionable
- Avoid tracking PII (emails, names, phone numbers)
- Don't over-track - focus on events that inform decisions
- Test events in GTM Preview mode before deploying
- Review and prune unused events periodically

## See Also

- [Tracking Events](./tracking-events.md)
- [Conversion Tracking](./conversion-tracking.md)
- [Privacy](./privacy.md)
