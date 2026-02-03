# Introduction to Simple Site Framework

Simple Site Framework is a configuration-driven React framework built on Next.js, designed specifically for professional service websites, SaaS landing pages, and marketing sites that need to convert visitors into customers.

## What is Simple Site Framework?

Unlike traditional component libraries that give you isolated pieces, Simple Site Framework provides:

- **Complete page sections** ready to use (Hero, Services, Testimonials, Contact, etc.)
- **Configuration-first approach** - define your content and theme in simple config files
- **Built-in internationalization** - support any number of languages with minimal setup
- **Production-ready components** - battle-tested on real commercial websites
- **Type-safe everything** - full TypeScript support with comprehensive type definitions
- **Accessibility by default** - WCAG 2.1 AA compliant out of the box
- **Performance optimized** - lazy loading, code splitting, and efficient animations

## Who Is This For?

This framework is ideal for:

- **Agencies** building multiple professional service websites
- **SaaS companies** creating high-converting landing pages
- **Solo developers** who want to ship faster without sacrificing quality
- **Teams** needing consistent, maintainable site architecture
- **Projects** requiring multi-language support from day one

## Philosophy

### Configuration Over Code

Instead of writing component markup repeatedly, you define your site in configuration files:

```typescript
// src/config/site.ts
export const siteConfig = {
  name: 'Acme Corp',
  description: 'Professional consulting services',
  theme: {
    primaryColor: '#F16531',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
  }
};
```

The framework handles rendering, responsive design, accessibility, and performance automatically.

### Progressive Enhancement

Start simple, add complexity only when needed:

1. **Level 1:** Use pre-built sections with default styling
2. **Level 2:** Customize with your own content and theme
3. **Level 3:** Override individual component props for specific needs
4. **Level 4:** Create custom variants while keeping the framework's benefits

### Type Safety First

Every configuration option, prop, and utility function is fully typed:

```typescript
import type { SiteConfig, ThemeConfig, LocalizedString } from '@zoyth/simple-site-framework';

const content: LocalizedString = {
  en: 'Get Started',
  fr: 'Commencer'
};
```

TypeScript catches configuration errors at build time, not at runtime.

## Core Features

### 35+ Production-Ready Components

- **Layout:** Header, Footer, LanguageSelector
- **Sections:** Hero, About, Services, Testimonials, Contact, CTA
- **UI:** Button, Card, Input, Modal, Tabs, Breadcrumb
- **Forms:** ContactForm, FormField, validation with React Hook Form + Zod
- **Conversion:** MobileCTA, CTASection, LiveProof
- **Accessibility:** SkipLink, A11yAnnouncer, ARIA-enhanced form components

### Flexible Internationalization

Support 1, 2, or 20+ languages with the same code:

```typescript
// Single language - no routing overhead
{ locales: ['en'], defaultLocale: 'en' }

// Bilingual with simple toggle
{ locales: ['en', 'fr'], defaultLocale: 'en' }

// Multi-language with dropdown selector
{ locales: ['en', 'fr', 'es', 'de', 'ja'], defaultLocale: 'en' }
```

The framework automatically handles:
- URL routing based on locale
- Language detection from browser preferences
- Cookie persistence of user's choice
- SEO meta tags (hreflang, canonical, etc.)

### Theme System

Define your brand once, apply it everywhere:

```typescript
export const themeConfig: ThemeConfig = {
  colors: {
    primary: '#F16531',
    secondary: '#2D3748',
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Inter',
  },
  animations: {
    hero: 'fade-up',
    sections: 'slide-in',
  }
};
```

All components automatically use your theme tokens, ensuring consistency.

### Built for Next.js 14+

The framework is specifically optimized for Next.js App Router:

- **Server Components** by default for better performance
- **Client Components** where needed (forms, animations, analytics)
- **Proper exports** - server-safe code in main export, client-only in `/client`
- **Streaming-friendly** - no blocking JavaScript requirements
- **SEO optimized** - server-rendered content with proper meta tags

## What Sets This Apart?

### Not Just Components

Most frameworks give you `<Button>` and `<Card>` and leave you to figure out layout, content structure, and responsive design. Simple Site Framework gives you complete, production-ready sections:

```typescript
<HeroSection
  heading={{ en: 'Transform Your Business', fr: 'Transformez votre entreprise' }}
  description={{ en: 'Professional consulting...', fr: 'Services de conseil...' }}
  cta={{
    text: { en: 'Get Started', fr: 'Commencer' },
    href: '/contact'
  }}
  backgroundImage="/hero-bg.jpg"
  variant="centered"
  locale={locale}
/>
```

### Battle-Tested in Production

Every component and pattern in this framework has been used in real commercial websites:

- **MobileCTA** - Improved mobile conversions on courrielleur.com
- **CTASection** - Used across 5+ pages with proven conversion patterns
- **LiveProof** - Social proof notifications that build trust
- **ContactForm** - Handles thousands of leads with validation and accessibility

### Configuration-Driven Consistency

When you have multiple pages or multiple projects, consistency matters. With configuration files, you can't accidentally use the wrong font or color:

```typescript
// All buttons automatically use your theme
<Button variant="filled" /> // Uses theme.colors.primary

// All headings use your font
<h1 className="font-heading"> // Uses theme.fonts.heading
```

## Next Steps

Ready to get started? Choose your path:

- **[Installation →](./installation.md)** - Add to an existing Next.js project
- **[Quick Start →](./quick-start.md)** - Create a new project in 5 minutes
- **[First Project →](./first-project.md)** - Step-by-step tutorial
- **[Core Concepts →](../core-concepts/overview.md)** - Understand the architecture

## Community and Support

- **GitHub Issues:** Bug reports and feature requests
- **Documentation:** Comprehensive guides and API reference
- **Examples:** Real-world usage patterns and templates

---

**Note:** This framework is actively developed and used in production. While the API is stable, we're continuously adding features and improvements based on real-world usage.
