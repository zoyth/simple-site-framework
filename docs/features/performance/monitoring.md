# Performance Monitoring

Measure, track, and improve site performance.

## Core Web Vitals

The three metrics Google uses for page experience ranking:

### LCP (Largest Contentful Paint)

Time until the largest visible content element renders.

| Rating | Threshold |
|--------|-----------|
| Good | < 2.5s |
| Needs Improvement | 2.5s - 4.0s |
| Poor | > 4.0s |

**Improve LCP:**
- Use `priority` on hero images
- Preload critical fonts
- Minimize render-blocking resources

### FID / INP (First Input Delay / Interaction to Next Paint)

Time from user interaction to browser response.

| Rating | Threshold |
|--------|-----------|
| Good | < 100ms (FID) / < 200ms (INP) |
| Needs Improvement | 100-300ms / 200-500ms |
| Poor | > 300ms / > 500ms |

**Improve FID/INP:**
- Minimize client-side JavaScript
- Use Server Components
- Break up long tasks

### CLS (Cumulative Layout Shift)

Visual stability - how much content shifts during load.

| Rating | Threshold |
|--------|-----------|
| Good | < 0.1 |
| Needs Improvement | 0.1 - 0.25 |
| Poor | > 0.25 |

**Improve CLS:**
- Set explicit width/height on images
- Reserve space for dynamic content
- Avoid inserting content above existing content

## Measurement Tools

### Google PageSpeed Insights

Test any URL:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- Provides both lab and field data
- Actionable recommendations

### Chrome DevTools Lighthouse

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance"
4. Run audit

### Google Search Console

Monitor real-user data:
1. Search Console > Core Web Vitals
2. See URL-level performance
3. Track improvements over time

### Chrome DevTools Performance Tab

Detailed analysis:
1. Open DevTools > Performance
2. Click Record
3. Interact with page
4. Stop recording
5. Analyze flame chart

## Web Vitals in Code

Track Core Web Vitals programmatically:

```typescript
// app/layout.tsx
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Send to analytics
    trackEvent('web_vital', {
      name: metric.name,       // CLS, FID, LCP, etc.
      value: metric.value,
      rating: metric.rating,   // good, needs-improvement, poor
    });
  });

  return null;
}
```

## Performance Budgets

Set budgets and alert when exceeded:

```typescript
// next.config.js
module.exports = {
  experimental: {
    // Warn when page JS exceeds budget
    largePageDataBytes: 128 * 1000, // 128KB
  },
};
```

## Monitoring Checklist

### Weekly

- [ ] Check Core Web Vitals in Search Console
- [ ] Review PageSpeed Insights for key pages
- [ ] Check build output for bundle size changes

### Per Release

- [ ] Run Lighthouse on key pages
- [ ] Compare bundle sizes with previous build
- [ ] Test on slow network (Chrome DevTools > Network > Slow 3G)
- [ ] Test on low-end device simulation

### Monthly

- [ ] Review real-user performance data
- [ ] Identify pages with poor metrics
- [ ] Plan performance improvements
- [ ] Update performance budgets if needed

## See Also

- [Bundle Size](./bundle-size.md)
- [Lazy Loading](./lazy-loading.md)
- [Existing Performance Documentation](../../PERFORMANCE.md)
