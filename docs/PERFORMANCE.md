# Performance Optimization Guide

This guide helps you build fast, high-converting websites using the simple-site-framework with optimal Next.js rendering strategies and performance best practices.

## Table of Contents

1. [Rendering Strategies](#rendering-strategies)
2. [Image Optimization](#image-optimization)
3. [Bundle Size Optimization](#bundle-size-optimization)
4. [Core Web Vitals](#core-web-vitals)
5. [Framework-Specific Tips](#framework-specific-tips)
6. [Performance Monitoring](#performance-monitoring)
7. [Common Pitfalls](#common-pitfalls)

---

## Rendering Strategies

Choose the right rendering strategy for each page to optimize both performance and SEO.

### When to use SSG (Static Site Generation) ✅ RECOMMENDED

**Best for:** Marketing pages, landing pages, blog posts, documentation

**Why:** Fastest possible load times, best SEO, lowest server costs

**Use cases:**
- Homepage (`/`)
- Features page (`/features`)
- Pricing page (`/pricing`)
- About page (`/about`)
- Blog posts (`/blog/[slug]`)
- Documentation (`/docs/[slug]`)
- Landing pages (`/lp/[campaign]`)

**Example:**
```typescript
// app/features/page.tsx
import { FeaturesSection } from 'simple-site-framework';

// This is a server component - rendered at build time
export default async function FeaturesPage() {
  return (
    <main>
      <FeaturesSection
        locale="en"
        content={featuresContent}
      />
    </main>
  );
}

// Force static generation
export const dynamic = 'force-static';
```

**Benefits:**
- ⚡ Instant page loads (served from CDN)
- 🔍 Perfect for SEO (HTML is pre-rendered)
- 💰 Lower hosting costs (no server compute per request)
- 📈 Better Core Web Vitals scores

---

### When to use SSR (Server-Side Rendering)

**Best for:** Personalized content, frequently changing data, user-specific pages

**Use cases:**
- Dashboard pages (after authentication)
- User profile pages
- Dynamic pricing based on location/currency
- Real-time data displays
- A/B tested pages with server-side logic

**Example:**
```typescript
// app/dashboard/page.tsx
import { cookies } from 'next/headers';

// This runs on every request
export default async function DashboardPage() {
  const userCookie = cookies().get('user');
  const userData = await fetchUserData(userCookie);

  return (
    <main>
      <h1>Welcome back, {userData.name}!</h1>
      {/* Personalized content */}
    </main>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
```

**When to avoid SSR:**
- ⚠️ Static marketing pages (use SSG instead)
- ⚠️ High-traffic pages without personalization
- ⚠️ Pages that can be cached (use ISR instead)

---

### When to use ISR (Incremental Static Regeneration)

**Best for:** Content that updates periodically but doesn't need to be real-time

**Use cases:**
- Blog index with new posts every few hours
- Product catalog that updates daily
- Pricing that changes occasionally
- Testimonials that are added monthly

**Example:**
```typescript
// app/blog/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  return (
    <main>
      {posts.map(post => <BlogCard key={post.id} {...post} />)}
    </main>
  );
}
```

**Benefits:**
- ⚡ Fast like SSG
- 🔄 Keeps content fresh
- 💰 Lower costs than SSR

---

### When to use Client-Side Rendering (CSR)

**Best for:** Highly interactive features, real-time updates, authenticated areas

**Use cases:**
- Interactive calculators
- Real-time dashboards
- Chat interfaces
- Complex forms with multi-step logic
- After user actions (not for SEO-critical content)

**Example:**
```typescript
// components/PricingCalculator.tsx
'use client';

import { useState } from 'react';

export function PricingCalculator() {
  const [users, setUsers] = useState(10);
  const price = calculatePrice(users);

  return (
    <div>
      <input
        type="range"
        value={users}
        onChange={(e) => setUsers(Number(e.target.value))}
      />
      <p>Price: ${price}/month</p>
    </div>
  );
}
```

**When to avoid CSR:**
- ❌ For SEO-critical content (won't be indexed)
- ❌ For above-the-fold content (bad LCP)
- ❌ For first-page impression content

---

## Image Optimization

Images are often the heaviest assets. Optimize them properly for fast loading.

### Always Use Next.js `<Image>`

**Why:** Automatic optimization, responsive sizing, lazy loading, format conversion (WebP/AVIF)

```typescript
import Image from 'next/image';

// ✅ GOOD - Optimized automatically
<Image
  src="/hero-image.jpg"
  alt="Email marketing dashboard"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>

// ❌ BAD - No optimization
<img src="/hero-image.jpg" alt="..." />
```

### Provide Width and Height

**Why:** Prevents Cumulative Layout Shift (CLS)

```typescript
// ✅ GOOD - Prevents layout shift
<Image
  src="/feature.jpg"
  alt="Feature screenshot"
  width={800}
  height={600}
/>

// ⚠️ ACCEPTABLE - For dynamic aspect ratios
<div className="relative w-full aspect-video">
  <Image
    src="/feature.jpg"
    alt="Feature screenshot"
    fill
    className="object-cover"
  />
</div>

// ❌ BAD - Will cause layout shift
<Image src="/feature.jpg" alt="..." />
```

### Use `priority` for Above-the-Fold Images

**Why:** Loads critical images immediately, improves LCP

```typescript
// Hero image (visible on page load)
<Image
  src="/hero.jpg"
  alt="..."
  width={1200}
  height={600}
  priority // ✅ Loads immediately
/>

// Below-the-fold image (not initially visible)
<Image
  src="/feature-3.jpg"
  alt="..."
  width={800}
  height={600}
  // No priority - lazy loads when scrolled into view
/>
```

### Optimize Image Sizes

```typescript
// Responsive images with sizes prop
<Image
  src="/hero.jpg"
  alt="..."
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Framework Component Image Usage

```typescript
// HeroSection - Mark background images as priority
<HeroSection
  locale={locale}
  content={{
    ...heroContent,
    backgroundImage: '/hero-bg.jpg' // Will be optimized
  }}
  // No need to manually set priority - HeroSection does this
/>

// FeaturesSection - Icons lazy load automatically
<FeaturesSection
  locale={locale}
  content={featuresContent}
  // Feature images automatically lazy-load
/>
```

---

## Bundle Size Optimization

Smaller bundles = faster downloads = better performance.

### Use Dynamic Imports for Heavy Components

```typescript
import dynamic from 'next/dynamic';

// ✅ GOOD - Loads only when needed
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <LoadingSpinner />,
  ssr: false // Don't render on server if not needed
});

// Use it conditionally
{showChart && <HeavyChart data={data} />}
```

### Tree-Shake Framework Components

```typescript
// ✅ GOOD - Import only what you need
import { HeroSection, FeaturesSection } from 'simple-site-framework';

// ❌ BAD - Imports entire framework
import * as Framework from 'simple-site-framework';
```

### Analyze Bundle Size

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your Next.js config
});

# Analyze
ANALYZE=true npm run build
```

**What to look for:**
- Large third-party libraries (>100KB)
- Duplicate dependencies
- Unused code
- Framework components you're not using

### Avoid Importing Entire Libraries

```typescript
// ❌ BAD - Imports all of lodash
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ GOOD - Imports only debounce
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// ✅ BETTER - Use native or smaller alternatives
// lodash-es is tree-shakeable
import { debounce } from 'lodash-es';
```

---

## Core Web Vitals

Google uses Core Web Vitals as ranking factors. Target these metrics:

### LCP (Largest Contentful Paint) - Target: < 2.5s

**What it measures:** How long until the main content is visible

**How to optimize:**
```typescript
// 1. Use priority for hero images
<Image src="/hero.jpg" priority width={1200} height={600} />

// 2. Avoid render-blocking scripts
<Script src="/analytics.js" strategy="afterInteractive" />

// 3. Use SSG for marketing pages
export const dynamic = 'force-static';

// 4. Optimize server response time
// - Use CDN for static assets
// - Enable HTTP/2
// - Compress responses (gzip/brotli)
```

**Framework tips:**
- HeroSection automatically optimizes hero images
- Use `backgroundEffect="none"` for fastest LCP if animations cause delays
- Avoid heavy animations in above-the-fold content

---

### FID (First Input Delay) - Target: < 100ms

**What it measures:** How quickly page responds to first user interaction

**How to optimize:**
```typescript
// 1. Minimize JavaScript execution
// Use dynamic imports for non-critical code
const Modal = dynamic(() => import('./Modal'));

// 2. Defer non-critical scripts
<Script src="/analytics.js" strategy="lazyOnload" />

// 3. Use code splitting
// Next.js does this automatically per route

// 4. Avoid long tasks
// Break up heavy computations
const result = useMemo(() => heavyCalculation(data), [data]);
```

---

### CLS (Cumulative Layout Shift) - Target: < 0.1

**What it measures:** How much content shifts during load

**How to optimize:**
```typescript
// 1. ALWAYS set image dimensions
<Image src="/logo.png" width={200} height={50} alt="Logo" />

// 2. Reserve space for ads/embeds
<div className="h-[250px] w-full">
  <AdComponent />
</div>

// 3. Avoid injecting content above existing content
// Load ads/embeds at page load, not after

// 4. Use font-display: optional
// next/font does this automatically
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

**Framework tips:**
- All framework images require width/height
- Modal/Dropdown animations don't cause CLS (position: fixed/absolute)
- ScrollIndicator renders after mount to avoid hydration CLS

---

## Framework-Specific Tips

### HeroSection Performance

```typescript
// ✅ Fastest configuration
<HeroSection
  locale={locale}
  content={heroContent}
  animations={{ headline: 'fadeIn', cta: 'fadeIn' }} // Simple animations
  backgroundEffect="none" // No heavy effects
  stickyCtaAfterScroll={false} // Avoid scroll listener if not needed
/>

// ⚠️ Slower but more engaging
<HeroSection
  locale={locale}
  content={heroContent}
  animations={{ headline: 'fadeInUp', cta: 'fadeInUp', scrollIndicator: true }}
  backgroundEffect="gradient-shift" // Animated background
  stickyCtaAfterScroll={true} // Scroll listener
/>
```

**Trade-offs:**
- Animations improve engagement but slightly delay FID
- Video backgrounds are heavy (use poster image for mobile)
- Sticky CTAs require scroll listeners (minimal perf impact)

### FeaturesSection Performance

```typescript
// Features automatically lazy-load as you scroll
// No special optimization needed

// For very long feature lists:
<LazySection threshold={0.1}>
  <FeaturesSection locale={locale} content={features} />
</LazySection>
```

### TestimonialsSection Performance

```typescript
// Carousel images lazy-load by default
// Limit to 6-8 testimonials for best performance

<TestimonialsSection
  locale={locale}
  content={testimonials.slice(0, 6)} // Limit for performance
/>
```

### Analytics Performance

```typescript
// ✅ Load after critical content
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive" // After page is interactive
/>

// AnalyticsTracker is lightweight and runs client-side only
<AnalyticsTracker />
```

---

## Performance Monitoring

Track performance over time to catch regressions.

### Lighthouse CI

```bash
# Install
npm install --save-dev @lhci/cli

# Configure .lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:3000", "http://localhost:3000/features"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}

# Run in CI
npm run build && npm start
lhci autorun
```

### Next.js Analytics

If deploying to Vercel, enable built-in analytics:

```typescript
// next.config.js
module.exports = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP', 'FID'],
  },
};
```

View real user metrics in Vercel dashboard.

### Chrome DevTools Performance Tab

1. Open DevTools → Performance
2. Click Record
3. Interact with page
4. Stop recording
5. Analyze timeline for:
   - Long tasks (>50ms)
   - Layout shifts
   - Render-blocking resources

### WebPageTest

Test from real locations: https://www.webpagetest.org/

**What to check:**
- Time to First Byte (TTFB) < 600ms
- Start Render < 2s
- Fully Loaded < 5s
- Film strip for visual progress

---

## Common Pitfalls

### ❌ Loading Too Many Fonts

```typescript
// ❌ BAD - Multiple fonts and weights
import { Inter, Roboto, Poppins } from 'next/font/google';
const inter = Inter({ weight: ['300', '400', '500', '600', '700'] });
const roboto = Roboto({ weight: ['400', '700'] });
const poppins = Poppins({ weight: ['400', '600'] });

// ✅ GOOD - One font, essential weights
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'], // Regular and semibold only
  display: 'swap',
});
```

**Impact:** Each font weight adds ~20-30KB. Limit to 2-3 weights max.

---

### ❌ Not Optimizing Images

```typescript
// ❌ BAD
<img src="/huge-image.png" alt="..." /> // 3MB PNG

// ✅ GOOD
<Image
  src="/optimized-image.jpg" // Converted to WebP automatically
  alt="..."
  width={800}
  height={600}
  quality={85} // Good balance of quality/size
/>
```

**Impact:** Large images can delay LCP by seconds.

---

### ❌ Large Client-Side Bundles

```typescript
// ❌ BAD - Entire chart library loaded upfront
import { LineChart } from 'recharts';

export default function Page() {
  return <LineChart data={data} />;
}

// ✅ GOOD - Loaded only when needed
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), {
  ssr: false
});

export default function Page() {
  return showChart ? <LineChart data={data} /> : <SkeletonChart />;
}
```

**Impact:** Heavy libraries (>100KB) can delay FID.

---

### ❌ Blocking Third-Party Scripts

```typescript
// ❌ BAD - Blocks page rendering
<script src="https://example.com/widget.js"></script>

// ✅ GOOD - Loads asynchronously
<Script
  src="https://example.com/widget.js"
  strategy="afterInteractive"
/>

// ✅ BETTER - Loads after everything else
<Script
  src="https://example.com/widget.js"
  strategy="lazyOnload"
/>
```

**Impact:** Can delay FCP and LCP by 1-2 seconds.

---

### ❌ Not Using Memoization

```typescript
// ❌ BAD - Recalculates on every render
function ExpensiveComponent({ items }) {
  const processed = items.map(heavyProcessing); // Runs every render
  return <List items={processed} />;
}

// ✅ GOOD - Memoizes expensive calculations
function ExpensiveComponent({ items }) {
  const processed = useMemo(
    () => items.map(heavyProcessing),
    [items]
  );
  return <List items={processed} />;
}
```

**Impact:** Can cause jank and poor FID.

---

## Performance Checklist

Use this checklist before deploying:

- [ ] All marketing pages use SSG
- [ ] Hero images have `priority` prop
- [ ] All images have width/height
- [ ] No images >200KB uncompressed
- [ ] Using next/font for web fonts
- [ ] Limited to 1-2 font families
- [ ] Scripts use `strategy="afterInteractive"` or `"lazyOnload"`
- [ ] Heavy components use dynamic imports
- [ ] Bundle analyzed (no massive chunks)
- [ ] Lighthouse score >90 for Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] No console errors or warnings

---

## Quick Reference

| Page Type | Rendering | Why |
|-----------|-----------|-----|
| Homepage | SSG | Fast, SEO-critical |
| Features | SSG | Static content, SEO-critical |
| Pricing | SSG or ISR | Mostly static, occasional updates |
| Blog Post | SSG or ISR | Static content, may add new posts |
| Blog Index | ISR | Updates with new posts |
| Dashboard | SSR | Personalized, authenticated |
| Calculator | CSR | Highly interactive |
| Documentation | SSG | Static, SEO-critical |

| Asset | Optimization |
|-------|--------------|
| Hero Image | `priority`, Next.js Image |
| Feature Icons | Lazy load, optimize SVG |
| Blog Images | Next.js Image, quality: 85 |
| Background Video | Poster image for mobile, lazy load |
| Fonts | next/font, 2 weights max |
| Scripts | `afterInteractive` or `lazyOnload` |

---

## Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance Guides](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [WebPageTest](https://www.webpagetest.org/)

---

**Remember:** Performance is a feature. Fast sites convert better, rank higher, and provide better user experience. Monitor, measure, and optimize continuously.
