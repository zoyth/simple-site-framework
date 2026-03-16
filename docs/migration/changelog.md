# Changelog

All notable changes to the Simple Site Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-16

### 🔥 Breaking Changes
- `ThemeConfig` is now a union of `ThemeConfigV1 | ThemeConfigV2` — code that accesses `theme.brand.colors` or `theme.colors.slate` directly must use `ThemeConfigV1` or narrow with `isV1Theme()`
- Components migrated from hardcoded `text-charcoal`/`bg-warm-gray` classes to semantic token classes (`text-text`, `bg-surface`, etc.) — consumers must define these colors in Tailwind config or use `getTailwindColors()`

### Added
- ✨ 3-layer design token system: brand palette → semantic tokens → CSS custom properties (#109)
- ✨ `ThemeConfigV2` interface with `brand.palette`, `shadeBase`/`shadeLight`, optional `semantic` overrides, and `darkMode` support
- ✨ `resolveTokens(config)` — computes 30-step shade ramp, derives semantic defaults, merges overrides
- ✨ `generateDarkModeCSS(theme)` — class-based (`.dark`) + `prefers-color-scheme` dark mode
- ✨ `getTailwindColors(config)` — CSS var mapping for Tailwind v3 `tailwind.config.ts`
- ✨ `migrateThemeV1toV2(v1)` — automated migration from v1 flat config to v2 token structure
- ✨ Color math utilities: `hexToRgb`, `rgbToHex`, `rgbToOklch`, `oklchToRgb`, `generateShadeRamp`, `darken`, `lighten`
- ✨ `isV1Theme()` / `isV2Theme()` type guards for runtime version detection
- ✨ `generateOgImage()` now accepts both `ThemeConfigV1` and `ThemeConfigV2`

### Changed
- `ThemeConfig` renamed to `ThemeConfigV1`; `ThemeConfig` is now the union type
- `generateThemeCSS()` dispatches on version — v1 output unchanged, v2 emits 3-layer CSS with backward-compat slate aliases
- `generateDesignTokens()` accepts the union type
- Components use semantic token classes: `text-text`, `text-text-muted`, `text-text-subtle`, `bg-surface`, `border-border`

## [1.5.2] - 2026-03-16

### Added
- ✨ `useExperiment()` hook for PostHog feature flag integration with localStorage fallback (#108)
- ✨ `<Experiment>` render-prop component for declarative A/B test variant rendering (#108)
- Exported from `/client` (hook) and `/components` (component)

## [1.5.1] - 2026-03-02

### Added
- ✨ `generateOgImage(theme, options)` for branded Open Graph image generation from ThemeConfig (#107)
- ✨ `ogImageSize` constant (1200x630) for Next.js opengraph-image route exports (#107)
- Lazy font loaders (`() => Buffer`) to avoid Vercel serverless crashes (#107)

## [1.5.0] - 2026-03-02

### Added
- ✨ `generateProseCSS(theme)` with editorial/docs/minimal presets for themed long-form typography (#106)
- ✨ `PROSE_CLASSES` shared constant replacing duplicated Tailwind prose utilities (#106)
- ✨ `loadContent(slug, locale, options)` generic content page loader for MDX files (#104)
- ✨ `getContentSlugs(locale, contentDir)` for content discovery (#104)
- ✨ `ExternalLink` MDX component — opens external URLs in new windows (#103)
- ✨ `defaultMdxComponents` — sensible component map for MDX content (#104)
- ✨ `prose` field added to `ThemeConfig.design` (#106)
- Added `remark-gfm` and `rehype-slug` as dependencies for MDX processing (#104)

### Changed
- BlogLayout and PolicyLayout now use shared `PROSE_CLASSES` instead of duplicated Tailwind strings (#106)

### Fixed
- 🐛 Dropdown nav button layout shift — added transparent border to closed state (#102)
- 🐛 Components barrel export missing `'use client'` directive, breaking RSC imports (#105)

### Security
- 🔒 Updated `next-mdx-remote` peer dependency to `^5.0.0 || ^6.0.0` for CVE-2026-0969 (#89)

## [1.4.2] - 2026-02-23

### Fixed
- 🐛 CSP default `script-src` missing `'unsafe-inline'`, blocking Next.js hydration scripts (#101)

## [1.4.1] - 2026-02-23

### Fixed
- 🐛 Removed `I18nProvider` from main entry point — `createContext` at module scope broke RSC imports (#100)

## [1.4.0] - 2026-02-22

### Added
- ✨ `generateSecurityHeaders(options)` with CSP presets for Google Analytics, Maps, and Fonts (#98)
- ✨ `localePath(path, locale)` convenience function for locale-prefixed links (#97)
- ✨ `generateI18nRewrites(config)` / `generateI18nRedirects(config)` for Next.js routing from slug translations (#96)
- ✨ `ServicePageLayout` auto-injects BreadcrumbList JSON-LD from breadcrumb items (#99)
- ✨ `LeadForm` component with validation and honeypot spam protection (#95)
- ✨ `CookieConsent` component for Loi 25 / GDPR compliance (#94)
- ✨ `generateMetadata()` with bilingual title/description and slug-translated alternates (#93)

## [1.3.0] - 2026-02-15

### Added
- ✨ `I18nProvider` React Context for client components (#92)
- ✨ `useI18n()` hook for accessing i18n config in client components (#92)

### Changed
- Replaced module-level i18n config with React Context in components (#92)

## [1.2.1] - 2026-02-10

### Added
- ✨ Blog system: `BlogLayout`, `BlogIndex`, `loadBlogPost`, `getBlogPostSlugs`, RSS feed generation
- ✨ Policy system: `PolicyLayout`, `loadPolicy`, `getPolicySlugs`
- ✨ SEO: `SEOMetaTags`, `I18nMetaTags`, `StructuredData` components
- ✨ Sitemap generation utility
- ✨ `LiveProof` social proof notification component
- ✨ `NewsletterSignup` component
- ✨ `MobileCTA` component
- ✨ `CaseStudySection` component
- ✨ ARIA form enhancements
- ✨ Mobile link helpers (PhoneLink, EmailLink, AddressLink)

## [0.1.0] - 2024-01-31

Initial release of the Simple Site Framework.

### Added

#### Core Foundation
- ✨ Hero section with multiple variants (dark, light, split)
- ✨ Header with logo, navigation, and mobile menu
- ✨ Footer with links and social media
- ✨ Button component with multiple variants
- ✨ Toast notification system
- ✨ AnimatedSection with intersection observer

#### Content & Features
- ✨ FAQ accordion with search and categories
- ✨ Animated counter for statistics
- ✨ StatsSection, TrustBadges, PricingTable, TestimonialCarousel

#### Forms & Engagement
- ✨ Select, Checkbox, Radio components
- ✨ File upload with drag & drop
- ✨ Multi-step form with progress tracking
- ✨ Countdown timer, Exit-intent modal

#### Content & SEO
- ✨ Tabs, Timeline, ComparisonTable, BlogCard components

#### Developer Experience
- ✨ LazySection for code-splitting
- ✨ CLI tools for project scaffolding
- ✨ StyleGuide, CodeBlock, ComponentDemo
- ✨ Icon library integration with Lucide React

### Dependencies
- React 18/19
- Next.js 14/15/16
- Tailwind CSS 3/4
- Framer Motion 11+
- Radix UI primitives

---

## Version Legend

- ✨ **New Feature** - New functionality added
- 🐛 **Bug Fix** - Fixed incorrect behavior
- 🔒 **Security** - Security vulnerability fixed
- ⚡ **Performance** - Improved performance
- 🔥 **Breaking Change** - Requires code changes

## Support Timeline

| Version | Release Date | Status |
|---------|--------------|--------|
| 2.0.x   | 2026-03-16   | Active |
| 1.5.x   | 2026-03-02   | Maintenance |
| 1.4.x   | 2026-02-22   | Maintenance |
| 1.3.x   | 2026-02-15   | Legacy |
| 0.1.x   | 2024-01-31   | Legacy |

## Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/zoyth/simple-site-framework/issues) on GitHub.
