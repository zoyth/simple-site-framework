# AI Agent Guide

This file helps AI assistants (Claude, ChatGPT, Copilot) use the framework effectively when building projects.

## Installation

```bash
npm install @zoyth/simple-site-framework
```

**Do NOT use `npm link`** — it fails with Turbopack (Next.js 16 default). See TROUBLESHOOTING.md.

## Available Features Checklist

When building a project with this framework, consider using:

### Content Loading
- `loadBlogPost(slug, locale)` — Load and compile MDX blog posts with frontmatter
- `getBlogPostSlugs()` / `getAllBlogPosts(locale)` — Discover and list blog posts
- `loadPolicy(slug, locale)` — Load legal/policy MDX pages
- `loadContent(slug, locale)` — Load generic MDX content pages
- `generateBlogRssFeed(posts, options)` — RSS feed generation

### i18n Routing
- `createI18nProxy(config)` — Next.js 16 proxy for locale detection, redirects, cookie persistence
- `createI18nMiddleware(config)` — Same function, for Next.js 14/15
- `localePath(path, locale)` — Build locale-prefixed internal links
- `translateSlug(path, from, to)` — Translate URL slugs between locales
- `generateI18nRewrites(config)` / `generateI18nRedirects(config)` — Next.js routing config

### SEO
- `generateMetadata(options)` — Next.js metadata with OG, hreflang, robots
- `generateOgImage(theme, options)` — Branded Open Graph images
- `createArticle(data)` / `createBreadcrumbList(items)` — JSON-LD structured data
- `generateSitemap(config)` — Multi-language XML sitemap
- `createContentSitemapEntries(baseUrl, items)` — Sitemap entries from content metadata with dates
- `generateLlmsTxt(config)` / `generateLlmsFullTxt(config)` — LLMs.txt for AI readers

### Theme System (v2)
- `generateThemeCSS(theme)` — CSS custom properties from ThemeConfigV2
- `generateDarkModeCSS(theme)` — Class-based + prefers-color-scheme dark mode
- `getTailwindColors(theme)` — Tailwind v3 color mapping with opacity modifier support
- `getTailwindContentConfig()` — Content transform to fix Turbopack CSS parser issues
- `resolveTokens(config)` — Resolve v2 config into concrete hex values
- `migrateThemeV1toV2(v1)` — Automated v1 → v2 migration

### Security
- `generateSecurityHeaders(options)` — CSP and security headers with presets for Google Analytics, Maps, Fonts

### Formatting
- `formatDate(date, locale)` — Locale-aware date formatting
- `formatNumber(value, locale)` — Locale-aware number formatting
- `formatCurrency(amount, locale, currency)` — Locale-aware currency
- `getLocalizedString(obj, locale)` — Resolve `{ en: '...', fr: '...' }` objects

### Components
- **Server-safe** (import from `@zoyth/simple-site-framework`): CTASection, FeaturesGrid, FeatureSection, LogosSection, TestimonialSection, AboutSection, CaseStudySection
- **Client** (import from `@zoyth/simple-site-framework/components`): HeroSection, Header, Footer, BlogLayout, BlogIndex, ContactSection, Button, and 40+ more
- **Client-only** (import from `@zoyth/simple-site-framework/client`): useExperiment, AnalyticsTracker, event tracking

### A/B Testing
- `useExperiment(config)` — PostHog feature flag integration with localStorage fallback
- `<Experiment>` — Render-prop component for declarative variant rendering

## Entry Points

| Path | Context | Has `'use client'` |
|------|---------|-------------------|
| `@zoyth/simple-site-framework` | Server-safe utilities + server components | No |
| `@zoyth/simple-site-framework/components` | All UI components | Yes |
| `@zoyth/simple-site-framework/client` | Browser-only hooks and tracking | Yes |
| `@zoyth/simple-site-framework/config` | TypeScript type schemas | No |

## Bundler Notes

- **Turbopack** (Next.js 16 default): Use `npm install`, not `npm link`. Use `getTailwindContentConfig()` in Tailwind config.
- **webpack**: Everything works, including `npm link`.
- See TROUBLESHOOTING.md for details.
