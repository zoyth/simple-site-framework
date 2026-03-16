# Export Structure

The framework provides separate entry points for different contexts to ensure edge-runtime safety and tree-shaking.

## Entry Points

### Main Index (`@zoyth/simple-site-framework`)
Server-safe exports - can be imported in any context including middleware.

```typescript
import {
  // Configuration types
  ThemeConfig, SiteContent, NavigationConfig,

  // Content utilities
  getLocalizedString,
  loadContent, getContentSlugs,
  loadBlogPost, getBlogPostSlugs, getAllBlogPosts,
  loadPolicy, getPolicySlugs,
  generateBlogRssFeed,

  // i18n utilities
  translateSlug, localePath,
  generateI18nRewrites, generateI18nRedirects,
  formatDate, formatNumber, formatCurrency,

  // SEO utilities
  generateMetadata,
  generateOgImage, ogImageSize,
  createBreadcrumbList, createFAQPage, serializeStructuredData,
  generateSitemap,

  // Theme utilities
  generateThemeCSS, generateDesignTokens,
  generateProseCSS, PROSE_CLASSES,
  cn,

  // Security utilities
  generateSecurityHeaders,

  // Server-safe components
  TrackedLink,
  FeaturesGrid,
} from '@zoyth/simple-site-framework';
```

### Components (`@zoyth/simple-site-framework/components`)
All UI components with 'use client' directive.

```typescript
import {
  // Layout
  Header, Footer, LanguageSelector,

  // Sections
  HeroSection, AboutSection, ServicesSection,
  ContactSection, CTASection, FeaturesGrid,
  TestimonialsSection, PricingSection, StatsSection,
  LiveProof, NewsletterSignup,

  // Content layouts
  BlogLayout, BlogIndex, PolicyLayout,
  ServicePageLayout,

  // UI
  Button, Card, Icon,
  Input, Textarea, Select, Checkbox, Radio,
  FormField, LeadForm,
  Breadcrumb, Tabs, Toast,
  CookieConsent,

  // MDX
  ExternalLink, defaultMdxComponents,

  // SEO
  SEOMetaTags, I18nMetaTags, StructuredData,

  // Experimentation
  Experiment,

  // Development
  StyleGuide, CodeBlock, ComponentDemo,
} from '@zoyth/simple-site-framework/components';
```

### i18n Library (`@zoyth/simple-site-framework/lib/i18n`)
**Middleware-safe** - No client code, can be used in edge runtime.

```typescript
import {
  createI18nMiddleware,
  setI18nConfig,
  getTextDirection,
  formatDate, formatNumber, formatCurrency, formatRelativeTime,
  translateSlug, localePath,
  generateI18nRewrites, generateI18nRedirects,
} from '@zoyth/simple-site-framework/lib/i18n';
```

### Client-Only (`@zoyth/simple-site-framework/client`)
**Browser-only** - Uses React hooks and browser APIs (localStorage, window).

```typescript
import {
  // Analytics
  AnalyticsTracker,
  trackEvent, trackCTAClick, trackConversion,

  // Experiments (PostHog integration)
  useExperiment,
  type ExperimentConfig, type ExperimentResult,

  // Legacy A/B testing
  getABTestVariant,
  type ABTestVariant, type ABTestConfig,
} from '@zoyth/simple-site-framework/client';
```

## Usage Examples

### Middleware
```typescript
// src/middleware.ts
import { createI18nMiddleware } from '@zoyth/simple-site-framework/lib/i18n';
import { i18nConfig } from './config/i18n';

export default createI18nMiddleware(i18nConfig);
```

### Next.js Config (Rewrites/Redirects)
```typescript
// next.config.ts
import { generateI18nRewrites, generateI18nRedirects } from '@zoyth/simple-site-framework';
import { i18nConfig } from './src/config/i18n';

export default {
  async rewrites() { return generateI18nRewrites(i18nConfig); },
  async redirects() { return generateI18nRedirects(i18nConfig); },
};
```

### OG Image Route
```typescript
// src/app/[locale]/[slug]/opengraph-image.tsx
import { generateOgImage, ogImageSize } from '@zoyth/simple-site-framework';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = ogImageSize;
export const contentType = 'image/png';

export default function Image({ params }) {
  return generateOgImage(theme, {
    title: 'Page Title',
    subtitle: 'Site Name',
    fonts: {
      heading: () => readFileSync(join(process.cwd(), 'public/fonts/heading.ttf')),
      body: () => readFileSync(join(process.cwd(), 'public/fonts/body.otf')),
    },
  });
}
```

### Security Headers
```typescript
// next.config.ts
import { generateSecurityHeaders } from '@zoyth/simple-site-framework';

const headers = generateSecurityHeaders({
  presets: ['google-analytics', 'google-fonts'],
  csp: { 'connect-src': ['https://api.example.com'] },
});

export default {
  async headers() {
    return [{ source: '/(.*)', headers }];
  },
};
```

### PostHog Experiments
```typescript
// In a client component
import { useExperiment } from '@zoyth/simple-site-framework/client';
import { Experiment } from '@zoyth/simple-site-framework/components';

// Hook usage
const { variant, isReady } = useExperiment({
  flagKey: 'hero-headline',
  variants: ['control', 'option-b'],
});

// Or declarative component usage
<Experiment config={{ flagKey: 'hero-headline', variants: ['control', 'option-b'] }}>
  {(variant) => variant === 'option-b' ? <AlternateHero /> : <DefaultHero />}
</Experiment>
```

### Content Pages
```typescript
// src/app/[locale]/[slug]/page.tsx
import { loadContent, getContentSlugs } from '@zoyth/simple-site-framework';

export async function generateStaticParams() {
  return getContentSlugs('en').map(slug => ({ slug }));
}

export default async function ContentPage({ params }) {
  const { content } = await loadContent(params.slug, params.locale);
  return <article className="prose">{content}</article>;
}
```

## Bundle Sizes

- **Main index**: ~68 KB (server-safe)
- **Components**: ~1.4 MB (includes all UI components)
- **lib/i18n**: ~21 KB (middleware-safe)
- **client**: ~4 KB (browser-only)
