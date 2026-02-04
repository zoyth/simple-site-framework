# Code Splitting

Split JavaScript bundles for faster initial page loads.

## Automatic Code Splitting

Next.js automatically splits code by route. Each page only loads the JavaScript it needs.

```
/              → homepage bundle
/about         → about bundle
/services      → services bundle
```

Users visiting `/about` don't download JavaScript for `/services`.

## Server vs Client Components

The most impactful code splitting is the Server/Client component split:

```typescript
// Server Component (default) - ZERO client JS
import { HeroSection } from '@zoyth/simple-site-framework/components';

// Client Component - adds to client bundle
'use client';
import { AnalyticsTracker } from '@zoyth/simple-site-framework/client';
```

Most framework components are Server Components, keeping the client bundle small.

## Dynamic Imports

Load heavy components on demand:

```typescript
import dynamic from 'next/dynamic';

// Only loaded when rendered
const HeavyChart = dynamic(() => import('../components/HeavyChart'), {
  loading: () => <Skeleton height={300} />,
});

// Only loaded on client (no SSR)
const InteractiveMap = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <Skeleton height={400} />,
});
```

## When to Use Dynamic Imports

**Good candidates:**
- Charts and data visualizations
- Rich text editors
- Maps
- Video players
- Code editors
- Large forms not immediately visible

**Don't dynamically import:**
- Above-the-fold content
- Navigation components
- Small, frequently-used components

## Lazy Loading Routes

For rarely-visited routes, use dynamic routes:

```typescript
// app/admin/page.tsx - only loaded when visiting /admin
export default function AdminPage() {
  // Admin-specific code stays in this bundle
}
```

## Analyzing Bundle Size

See what's in your bundles:

```bash
# Build with bundle analyzer
ANALYZE=true npm run build
```

Configure in next.config.js:

```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js config...
});
```

## Framework Import Patterns

### Specific Imports (Recommended)

```typescript
// ✅ Only imports what you use
import { HeroSection } from '@zoyth/simple-site-framework/components';
import { trackEvent } from '@zoyth/simple-site-framework/client';
```

### Barrel Imports

```typescript
// ⚠️ May include unused code if tree-shaking isn't perfect
import { HeroSection, FeaturesGrid, ContactSection } from '@zoyth/simple-site-framework/components';
```

The framework supports tree-shaking, but specific imports are safer.

## See Also

- [Bundle Size](./bundle-size.md)
- [Lazy Loading](./lazy-loading.md)
- [LazySection Component](../../components/LazySection.md)
