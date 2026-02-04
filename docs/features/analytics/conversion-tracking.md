# Conversion Tracking

Track goals and measure conversion rates.

## Overview

Conversion tracking measures when users complete desired actions:

- Form submissions
- CTA clicks
- Sign-ups
- Purchases
- Downloads
- Phone calls

## Tracking Conversions

### trackConversion

```typescript
'use client';
import { trackConversion } from '@zoyth/simple-site-framework/client';

function handleSignup() {
  trackConversion('signup_complete', {
    method: 'email',
    source: 'hero_cta',
  });
}
```

### trackCTAClick

Shorthand for CTA conversion tracking:

```typescript
import { trackCTAClick } from '@zoyth/simple-site-framework/client';

<button onClick={() => trackCTAClick('get-started', 'pricing-page')}>
  Get Started
</button>
```

## Common Conversion Types

### Form Submission

```typescript
function handleFormSubmit(formData) {
  trackConversion('form_submit', {
    form_name: 'contact',
    form_location: 'contact_page',
  });
}
```

### Lead Generation

```typescript
trackConversion('lead_generated', {
  lead_type: 'demo_request',
  source: 'landing_page',
});
```

### Purchase

```typescript
trackConversion('purchase', {
  transaction_id: 'T12345',
  value: 99.99,
  currency: 'USD',
  items: ['pro_plan'],
});
```

### Download

```typescript
trackConversion('file_download', {
  file_name: 'whitepaper.pdf',
  file_type: 'pdf',
});
```

### Phone Call

```typescript
<TrackedLink
  href="tel:+15551234567"
  eventName="phone_call"
  eventData={{ location: 'header' }}
>
  Call Us
</TrackedLink>
```

## Conversion Funnels

Track multi-step conversion paths:

```typescript
// Step 1: View pricing
trackEvent('funnel_step', {
  funnel: 'signup',
  step: 1,
  step_name: 'view_pricing',
});

// Step 2: Select plan
trackEvent('funnel_step', {
  funnel: 'signup',
  step: 2,
  step_name: 'select_plan',
  plan: 'pro',
});

// Step 3: Complete signup
trackConversion('signup_complete', {
  funnel: 'signup',
  step: 3,
  plan: 'pro',
});
```

## GTM Conversion Setup

### Google Ads Conversions

1. In GTM, create Conversion Linker tag
2. Create Google Ads Conversion Tracking tag
3. Set trigger to fire on your conversion event
4. Add conversion ID and label from Google Ads

### GA4 Conversions

1. In GA4, go to Configure > Events
2. Find your conversion event
3. Toggle "Mark as conversion"

## Conversion Attribution

### First Click

Attribute to first touchpoint:

```typescript
trackConversion('signup', {
  first_touch_source: sessionStorage.getItem('first_source'),
  first_touch_medium: sessionStorage.getItem('first_medium'),
});
```

### Last Click

Attribute to most recent touchpoint:

```typescript
trackConversion('signup', {
  utm_source: searchParams.get('utm_source'),
  utm_medium: searchParams.get('utm_medium'),
  utm_campaign: searchParams.get('utm_campaign'),
});
```

## Conversion Components

### MobileCTA

Sticky mobile CTA with built-in conversion tracking:

```typescript
import { MobileCTA } from '@zoyth/simple-site-framework/components';

<MobileCTA
  text="Get Started"
  href="/signup"
  trackingId="mobile-cta-signup"
/>
```

### ExitIntentModal

Track exit-intent conversions:

```typescript
import { ExitIntentModal } from '@zoyth/simple-site-framework/components';

<ExitIntentModal
  onConversion={() => trackConversion('exit_intent_signup')}
/>
```

## Best Practices

- Define conversions before building pages
- Track micro-conversions (newsletter signup) and macro-conversions (purchase)
- Include attribution data with conversions
- Test conversion tracking in staging before production
- Monitor conversion rates over time for regressions

## See Also

- [Tracking Events](./tracking-events.md)
- [A/B Testing](./ab-testing.md)
- [MobileCTA Component](../../components/conversion/MobileCTA.md)
- [ExitIntentModal Component](../../components/ExitIntentModal.md)
