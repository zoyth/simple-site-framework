# Analytics Setup

Configure analytics tracking for your site.

## Google Tag Manager (GTM)

### 1. Create GTM Account

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create new account and container
3. Copy your GTM ID (format: `GTM-XXXXXXX`)

### 2. Add AnalyticsTracker

Add to your root layout:

```typescript
// app/layout.tsx
import { AnalyticsTracker } from '@zoyth/simple-site-framework/components';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsTracker gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        {children}
      </body>
    </html>
  );
}
```

### 3. Environment Variables

Add GTM ID to environment variables:

```bash
# .env.local
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Google Analytics 4 (GA4)

### Via GTM (Recommended)

1. In GTM, create new GA4 Configuration tag
2. Add your GA4 Measurement ID
3. Set trigger to "All Pages"
4. Publish container

### Direct Integration

```typescript
<AnalyticsTracker
  gtmId={process.env.NEXT_PUBLIC_GTM_ID}
  gaId={process.env.NEXT_PUBLIC_GA_ID}
/>
```

## Verification

### Check Installation

1. Visit your site
2. Open browser DevTools > Network tab
3. Look for requests to `gtm.js` or `analytics.js`
4. Check GTM Preview mode
5. Verify events in GA4 Realtime view

### Debug Mode

Enable debug mode in development:

```typescript
<AnalyticsTracker
  gtmId={process.env.NEXT_PUBLIC_GTM_ID}
  debug={process.env.NODE_ENV === 'development'}
/>
```

## Configuration Options

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `gtmId` | `string` | Yes* | Google Tag Manager ID |
| `gaId` | `string` | No | Google Analytics 4 ID |
| `debug` | `boolean` | No | Enable debug mode |
| `dataLayer` | `string` | No | Custom dataLayer name (default: 'dataLayer') |

*Either gtmId or gaId required

## Development vs Production

Use different GTM containers:

```typescript
const gtmId = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_GTM_ID_PROD
  : process.env.NEXT_PUBLIC_GTM_ID_DEV;

<AnalyticsTracker gtmId={gtmId} />
```

## Next Steps

- [Track custom events](./tracking-events.md)
- [Set up A/B tests](./ab-testing.md)
- [Configure conversion tracking](./conversion-tracking.md)

## See Also

- [Analytics Setup Guide](../../guides/analytics-setup.md)
- [AnalyticsTracker Component](../../components/AnalyticsTracker.md)
- [Privacy Configuration](./privacy.md)
