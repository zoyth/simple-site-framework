# Analytics

Integrated analytics and tracking for conversion optimization.

## Overview

Simple Site Framework provides built-in analytics integration for tracking user behavior, conversions, and running A/B tests:

- Google Analytics 4 (GA4) integration
- Google Tag Manager (GTM) support
- Event tracking utilities
- A/B testing framework
- Conversion tracking
- Privacy-compliant tracking

## Quick Start

```typescript
import { AnalyticsTracker } from '@zoyth/simple-site-framework/components';

// Add to root layout
<AnalyticsTracker gtmId="GTM-XXXXXXX" />
```

Track events:

```typescript
'use client';
import { trackEvent, trackCTAClick } from '@zoyth/simple-site-framework/client';

// Track custom event
trackEvent('button_click', { location: 'hero' });

// Track CTA click
trackCTAClick('signup', 'hero');
```

## Topics

- [Setup](./setup.md) - Initial analytics configuration
- [Tracking Events](./tracking-events.md) - Event tracking patterns
- [A/B Testing](./ab-testing.md) - Running A/B tests
- [Conversion Tracking](./conversion-tracking.md) - Track goals and conversions
- [Custom Events](./custom-events.md) - Define custom events
- [Privacy](./privacy.md) - GDPR and privacy compliance

## See Also

- [Analytics Setup Guide](../../guides/analytics-setup.md)
- [AnalyticsTracker Component](../../components/AnalyticsTracker.md)
- [TrackedLink Component](../../components/TrackedLink.md)
