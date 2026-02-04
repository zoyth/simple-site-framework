# Performance

Performance optimization features for fast page loads and great Core Web Vitals.

## Overview

The framework provides several built-in performance features:

- Server Components by default (zero client JS)
- Lazy loading for below-the-fold content
- Code splitting with dynamic imports
- Image optimization via Next.js Image
- Minimal bundle size

## Key Concepts

Most framework components are Server Components, meaning they ship zero JavaScript to the browser. Only interactive components (marked as Client Components) add to the JS bundle.

## Topics

- [Lazy Loading](./lazy-loading.md) - Defer loading of non-critical content
- [Image Optimization](./image-optimization.md) - Optimize images for web
- [Code Splitting](./code-splitting.md) - Split bundles for faster loads
- [Caching](./caching.md) - Caching strategies
- [Bundle Size](./bundle-size.md) - Minimize JavaScript bundle
- [Monitoring](./monitoring.md) - Measure and track performance

## Quick Wins

### Use LazySection

Wrap below-the-fold sections:

```typescript
import { LazySection } from '@zoyth/simple-site-framework/components';

<HeroSection {...heroProps} />         {/* Above fold - load immediately */}

<LazySection>                           {/* Below fold - lazy loaded */}
  <FeaturesGrid features={features} />
</LazySection>

<LazySection>
  <TestimonialSection testimonials={testimonials} />
</LazySection>
```

### Prefer Server Components

```typescript
// ✅ Server Component (default) - no client JS
import { HeroSection } from '@zoyth/simple-site-framework/components';

// ⚠️ Client Component - adds to JS bundle
'use client';
import { AnalyticsTracker } from '@zoyth/simple-site-framework/client';
```

### Optimize Images

```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority          // Above-fold images
/>
```

## See Also

- [Existing Performance Documentation](../../PERFORMANCE.md)
- [LazySection Component](../../components/LazySection.md)
- [AnimatedSection Component](../../components/AnimatedSection.md)
