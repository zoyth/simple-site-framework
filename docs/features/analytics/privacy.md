# Analytics Privacy

GDPR compliance and privacy-respecting analytics.

## Overview

The framework supports privacy-compliant analytics through:

- Consent-based tracking
- Cookie management
- Data minimization
- GTM consent mode

## Consent Management

### Consent Banner

Implement a consent banner before loading analytics:

```typescript
'use client';
import { useState, useEffect } from 'react';
import { AnalyticsTracker } from '@zoyth/simple-site-framework/components';

function Layout({ children }) {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('analytics_consent');
    if (stored !== null) setConsent(stored === 'true');
  }, []);

  return (
    <>
      {consent && <AnalyticsTracker gtmId="GTM-XXXXXXX" />}
      {consent === null && (
        <CookieBanner
          onAccept={() => {
            localStorage.setItem('analytics_consent', 'true');
            setConsent(true);
          }}
          onDecline={() => {
            localStorage.setItem('analytics_consent', 'false');
            setConsent(false);
          }}
        />
      )}
      {children}
    </>
  );
}
```

### GTM Consent Mode

Use Google's consent mode for nuanced control:

```typescript
// Initialize with denied consent
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'consent': 'default',
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
});

// Update when user consents
function grantConsent() {
  window.dataLayer.push({
    'consent': 'update',
    'analytics_storage': 'granted',
    'ad_storage': 'granted',
  });
}
```

## GDPR Compliance

### Data Minimization

Only track necessary data:

```typescript
// ✅ Good - Minimal data
trackEvent('cta_click', {
  cta_id: 'hero-signup',
  page: '/pricing',
});

// ❌ Bad - Excessive data
trackEvent('cta_click', {
  cta_id: 'hero-signup',
  user_email: user.email,        // PII
  user_name: user.name,          // PII
  ip_address: user.ip,           // PII
  browser_fingerprint: hash,     // Identifying
});
```

### Never Track PII

Do not include in events:
- Email addresses
- Names
- Phone numbers
- IP addresses (handled by GA4 settings)
- Precise location data
- User IDs that map to real identities

### Right to Erasure

Support data deletion requests:

1. Use GA4 User Deletion API
2. Delete user data from GTM server-side
3. Clear local cookies and storage

### Data Retention

Configure retention in GA4:
1. GA4 Admin > Data Settings > Data Retention
2. Set to shortest period needed (2 or 14 months)

## Cookie Management

### Analytics Cookies

Common analytics cookies:

| Cookie | Purpose | Duration |
|--------|---------|----------|
| `_ga` | GA4 user identification | 2 years |
| `_ga_*` | GA4 session | 2 years |
| `_gid` | GA4 session | 24 hours |
| `_gat` | GA4 throttle | 1 minute |

### Cookie-Free Tracking

For stricter privacy requirements:

```typescript
// Use sessionStorage instead of cookies
<AnalyticsTracker
  gtmId="GTM-XXXXXXX"
  cookieless={true}
/>
```

## Privacy Regulations

### GDPR (EU)

Requirements:
- Obtain consent before tracking
- Provide clear privacy policy
- Support data access requests
- Support data deletion requests
- Minimize data collection

### CCPA (California)

Requirements:
- Disclose data collection practices
- Provide opt-out mechanism
- Do not sell personal information
- Respond to consumer requests

### PIPEDA (Canada)

Requirements:
- Obtain meaningful consent
- Limit collection to necessary data
- Provide access to personal information
- Protect personal information

## Privacy Policy

Include in your privacy policy:
- What data is collected
- How it's used
- Third-party services (Google Analytics, GTM)
- Cookie information
- User rights and how to exercise them
- Contact information

## Testing Privacy Compliance

1. Visit site without consenting - verify no tracking fires
2. Consent to tracking - verify analytics loads
3. Decline tracking - verify no analytics cookies set
4. Clear consent - verify banner reappears
5. Check no PII in tracked events

## See Also

- [Analytics Setup](./setup.md)
- [Tracking Events](./tracking-events.md)
- [ScriptInjector Component](../../components/ScriptInjector.md)
