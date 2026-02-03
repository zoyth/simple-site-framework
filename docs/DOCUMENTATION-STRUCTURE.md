# Simple Site Framework - Documentation Structure

> Comprehensive documentation outline for the framework

---

## 📚 Documentation Organization

```
docs/
├── README.md                          # Documentation index
├── getting-started/
│   ├── introduction.md
│   ├── installation.md
│   ├── quick-start.md
│   ├── first-project.md
│   └── migration-guide.md
├── core-concepts/
│   ├── overview.md
│   ├── configuration-driven.md
│   ├── internationalization.md
│   ├── server-client-split.md
│   └── theme-system.md
├── components/
│   ├── README.md
│   ├── layout/
│   ├── sections/
│   ├── ui/
│   ├── forms/
│   ├── conversion/
│   └── accessibility/
├── features/
│   ├── i18n/
│   ├── analytics/
│   ├── seo/
│   ├── performance/
│   └── accessibility/
├── guides/
│   ├── building-landing-page.md
│   ├── multi-language-site.md
│   ├── ab-testing.md
│   ├── analytics-setup.md
│   ├── seo-optimization.md
│   ├── deployment.md
│   └── troubleshooting.md
├── api-reference/
│   ├── components.md
│   ├── utilities.md
│   ├── hooks.md
│   └── types.md
├── examples/
│   ├── landing-pages/
│   ├── service-sites/
│   ├── multi-language/
│   └── e-commerce/
└── contributing/
    ├── development.md
    ├── testing.md
    ├── pull-requests.md
    └── code-style.md
```

---

## 1. Getting Started

### 1.1 Introduction (`introduction.md`)

**Purpose:** Orient new users to the framework

**Content:**
- What is Simple Site Framework?
- Who is it for?
- Key features and benefits
- When to use (and when not to use)
- Framework philosophy
- Comparison with other solutions
- Browser and Next.js version compatibility

**Examples:**
```markdown
## What is Simple Site Framework?

A configuration-driven Next.js framework for building professional
service websites with minimal code...

## Key Features

- 🌍 Built-in internationalization (i18n)
- 📊 Integrated analytics and A/B testing
- 🎨 Themeable components
- ♿ Accessibility-first design
- 🚀 Optimized for performance
```

---

### 1.2 Installation (`installation.md`)

**Purpose:** Get the framework installed

**Content:**
- System requirements (Node.js version, etc.)
- Installation via npm/yarn/pnpm
- Installing peer dependencies
- Setting up a new Next.js project
- Adding to existing project
- Verifying installation
- Common installation issues

**Examples:**
```bash
# Create new Next.js project
npx create-next-app@latest my-site

# Install framework
npm install @zoyth/simple-site-framework

# Install peer dependencies
npm install framer-motion lucide-react @radix-ui/react-accordion
```

---

### 1.3 Quick Start (`quick-start.md`)

**Purpose:** Get something running in 5 minutes

**Content:**
- Minimal working example
- Basic configuration
- Your first page
- Running the dev server
- What you just built
- Next steps

**Examples:**
```tsx
// app/page.tsx
import { HeroSection } from '@zoyth/simple-site-framework/components';

export default function Home() {
  return (
    <HeroSection
      heading="Welcome to My Site"
      description="Built with Simple Site Framework"
      primaryCTA={{ text: "Get Started", href: "/start" }}
    />
  );
}
```

---

### 1.4 First Project (`first-project.md`)

**Purpose:** Build a complete landing page

**Content:**
- Project structure overview
- Creating configuration file
- Building the homepage
- Adding sections (Hero, Features, Testimonials, CTA)
- Setting up navigation
- Adding a second page
- Styling and theming
- Building for production

**Examples:**
- Complete landing page walkthrough
- Code snippets for each section
- Screenshots of the result
- Common pitfalls and solutions

---

### 1.5 Migration Guide (`migration-guide.md`)

**Purpose:** Help users migrate from other solutions

**Content:**
- Migrating from plain Next.js
- Migrating from create-react-app
- Migrating from other frameworks
- Breaking changes between versions
- Upgrade guides
- Deprecation notices

---

## 2. Core Concepts

### 2.1 Overview (`overview.md`)

**Purpose:** Understand framework architecture

**Content:**
- Framework architecture diagram
- Component hierarchy
- Configuration system
- Build and bundle structure
- Server vs Client components
- File organization patterns
- Mental model

---

### 2.2 Configuration-Driven (`configuration-driven.md`)

**Purpose:** Master the configuration approach

**Content:**
- Why configuration over code
- Configuration file structure
- Content schema
- Type safety with Zod
- Environment-specific config
- Overriding defaults
- Best practices

**Examples:**
```typescript
// config/site.ts
export const siteConfig = {
  name: "My Company",
  description: "Professional services",
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  theme: {
    primary: '#0066CC',
    secondary: '#FF6600'
  }
};
```

---

### 2.3 Internationalization (`internationalization.md`)

**Purpose:** Understand i18n system

**Content:**
- i18n architecture
- LocalizedString type
- Locale detection and routing
- Translation workflow
- RTL support
- Date/number formatting
- Best practices

**Examples:**
```typescript
// Using LocalizedString
const heading: LocalizedString = {
  en: "Welcome",
  fr: "Bienvenue"
};

// In components
<HeroSection heading={heading} locale={locale} />
```

---

### 2.4 Server-Client Split (`server-client-split.md`)

**Purpose:** Understand packaging and imports

**Content:**
- What's in main export
- What's in /client export
- What's in /components export
- When to use which export
- 'use client' directive
- Server Component benefits
- Common pitfalls

**Examples:**
```tsx
// Server component (default)
import { HeroSection } from '@zoyth/simple-site-framework/components';

// Client component (when needed)
'use client';
import { AnalyticsTracker, getABTestVariant } from '@zoyth/simple-site-framework/client';
```

---

### 2.5 Theme System (`theme-system.md`)

**Purpose:** Understand theming capabilities

**Content:**
- Theme configuration
- CSS variables
- Tailwind integration
- Color palette
- Typography scale
- Spacing system
- Dark mode support
- Custom themes

---

## 3. Components

### 3.1 Component Documentation Template

**Each component doc should include:**

```markdown
# ComponentName

> Brief one-line description

## Overview

Detailed description of what the component does and when to use it.

## Installation

If component has specific dependencies.

## Basic Usage

Simplest possible example.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |

## Examples

### Example 1: Basic
### Example 2: Advanced
### Example 3: Real-world

## Variants

Different visual/behavioral variants.

## Accessibility

ARIA attributes, keyboard navigation, screen reader support.

## Styling

How to customize appearance.

## Related Components

Links to similar/related components.

## API Reference

Detailed API documentation.
```

---

### 3.2 Layout Components (`components/layout/`)

**Files:**
- `header.md` - Navigation header
- `footer.md` - Site footer
- `language-switcher.md` - Language selector
- `language-selector.md` - New multi-language selector
- `breadcrumb.md` - Breadcrumb navigation
- `skip-link.md` - Accessibility skip links

**Each includes:**
- Configuration options
- Customization examples
- Responsive behavior
- Accessibility features

---

### 3.3 Section Components (`components/sections/`)

**Files:**
- `hero-section.md` - Hero/banner sections
- `features-section.md` - Feature showcases
- `testimonial-section.md` - Customer testimonials
- `services-section.md` - Service listings
- `pricing-section.md` - Pricing tables
- `faq-section.md` - FAQ accordions
- `contact-section.md` - Contact forms
- `cta-section.md` - Call-to-action sections
- `case-study-section.md` - Customer success stories
- `stats-section.md` - Statistics/metrics
- `about-section.md` - About/team sections

---

### 3.4 UI Components (`components/ui/`)

**Files:**
- `button.md` - Button component
- `input.md` - Text inputs
- `textarea.md` - Multi-line text
- `card.md` - Content cards
- `badge.md` - Labels/tags
- `tooltip.md` - Tooltips
- `modal.md` - Modals/dialogs
- `tabs.md` - Tab navigation
- `toast.md` - Toast notifications
- `loading-spinner.md` - Loading states
- `skeleton.md` - Skeleton loaders

---

### 3.5 Form Components (`components/forms/`)

**Files:**
- `form-field.md` - Form field wrapper
- `checkbox.md` - Checkbox inputs
- `radio.md` - Radio buttons
- `select.md` - Select dropdowns
- `file-upload.md` - File uploads
- `contact-form.md` - Complete contact form
- `multi-step-form.md` - Multi-step forms

---

### 3.6 Conversion Components (`components/conversion/`)

**Files:**
- `mobile-cta.md` - Mobile sticky CTA
- `exit-intent-modal.md` - Exit intent popups
- `countdown-timer.md` - Urgency timers
- `sticky-bar.md` - Announcement bars
- `live-proof.md` - Social proof notifications
- `trust-badges.md` - Trust indicators

---

### 3.7 Accessibility Components (`components/accessibility/`)

**Files:**
- `form-field-aria.md` - ARIA-enhanced forms
- `checkbox-group-aria.md` - Accessible checkbox groups
- `radio-group-aria.md` - Accessible radio groups
- `skip-link.md` - Skip navigation
- `a11y-announcer.md` - Screen reader announcements

---

## 4. Features

### 4.1 Internationalization (`features/i18n/`)

**Files:**
- `README.md` - i18n overview
- `configuration.md` - Setting up i18n
- `routing.md` - Locale routing
- `translations.md` - Managing translations
- `locale-detection.md` - Browser detection
- `formatting.md` - Dates, numbers, currency
- `rtl-support.md` - Right-to-left languages
- `best-practices.md` - i18n best practices

**Examples:**
- Multi-language site setup
- Translation workflow
- Dynamic locale switching
- SEO for multiple languages

---

### 4.2 Analytics (`features/analytics/`)

**Files:**
- `README.md` - Analytics overview
- `setup.md` - Initial setup
- `tracking-events.md` - Event tracking
- `ab-testing.md` - A/B test setup
- `conversion-tracking.md` - Conversion tracking
- `custom-events.md` - Custom analytics
- `privacy.md` - Privacy compliance

**Examples:**
```tsx
// Track CTA clicks
import { trackCTAClick } from '@zoyth/simple-site-framework/client';

<button onClick={() => trackCTAClick('signup', 'hero')}>
  Sign Up
</button>

// A/B testing
import { getABTestVariant } from '@zoyth/simple-site-framework/client';

const variant = getABTestVariant({
  testId: 'hero-cta',
  variants: { A: { weight: 50 }, B: { weight: 50 } }
});
```

---

### 4.3 SEO (`features/seo/`)

**Files:**
- `README.md` - SEO overview
- `meta-tags.md` - Meta tag configuration
- `structured-data.md` - Schema.org markup
- `sitemaps.md` - XML sitemap generation
- `open-graph.md` - Social media previews
- `robots-txt.md` - Robots.txt configuration
- `canonical-urls.md` - Canonical URL management
- `best-practices.md` - SEO best practices

**Examples:**
```tsx
import { SEOMetaTags, StructuredData } from '@zoyth/simple-site-framework/components';

<SEOMetaTags
  title="My Page Title"
  description="Page description"
  canonical="https://example.com/page"
  openGraph={{
    type: 'website',
    image: '/og-image.jpg'
  }}
/>

<StructuredData
  data={{
    '@type': 'Organization',
    name: 'My Company',
    url: 'https://example.com'
  }}
/>
```

---

### 4.4 Performance (`features/performance/`)

**Files:**
- `README.md` - Performance overview
- `lazy-loading.md` - Component lazy loading
- `image-optimization.md` - Image optimization
- `code-splitting.md` - Code splitting strategies
- `caching.md` - Caching strategies
- `bundle-size.md` - Bundle optimization
- `monitoring.md` - Performance monitoring

---

### 4.5 Accessibility (`features/accessibility/`)

**Files:**
- `README.md` - Accessibility overview
- `aria-support.md` - ARIA implementation
- `keyboard-navigation.md` - Keyboard support
- `screen-readers.md` - Screen reader testing
- `color-contrast.md` - Color contrast
- `focus-management.md` - Focus handling
- `testing.md` - Accessibility testing
- `wcag-compliance.md` - WCAG 2.1 compliance

---

## 5. Guides

### 5.1 Building a Landing Page (`guides/building-landing-page.md`)

**Purpose:** Complete tutorial for a landing page

**Content:**
- Planning the structure
- Setting up configuration
- Building hero section
- Adding features section
- Testimonials and social proof
- CTA sections
- Contact form
- Mobile optimization
- SEO setup
- Launch checklist

---

### 5.2 Multi-Language Site (`guides/multi-language-site.md`)

**Purpose:** Build a fully localized site

**Content:**
- i18n configuration
- Setting up locales
- Creating translations
- Locale routing
- Language switcher
- Translating content
- Managing translation files
- SEO for multiple languages
- Testing all locales

---

### 5.3 A/B Testing (`guides/ab-testing.md`)

**Purpose:** Implement A/B tests

**Content:**
- Setting up A/B tests
- Creating variants
- Tracking conversions
- Analyzing results
- Best practices
- Common patterns
- Tools integration

**Examples:**
```tsx
// Hero CTA A/B test
const variant = getABTestVariant({
  testId: 'hero-cta-text',
  variants: { A: { weight: 50 }, B: { weight: 50 } }
});

const ctaText = variant === 'A'
  ? 'Start Free Trial'
  : 'Get Started Free';

<button onClick={() => {
  trackABTestEvent('hero-cta-text', variant, 'click');
  trackConversion('signup_click');
}}>
  {ctaText}
</button>
```

---

### 5.4 Analytics Setup (`guides/analytics-setup.md`)

**Purpose:** Configure analytics tracking

**Content:**
- Google Analytics 4 setup
- Installing AnalyticsTracker
- Custom event tracking
- E-commerce tracking
- User privacy
- GDPR compliance
- Testing analytics
- Debugging

---

### 5.5 SEO Optimization (`guides/seo-optimization.md`)

**Purpose:** Optimize for search engines

**Content:**
- Meta tags checklist
- Structured data implementation
- Sitemap generation
- Internal linking
- Performance optimization
- Mobile optimization
- Content optimization
- Monitoring and tools

---

### 5.6 Deployment (`guides/deployment.md`)

**Purpose:** Deploy to production

**Content:**
- Vercel deployment
- Netlify deployment
- AWS deployment
- Custom server deployment
- Environment variables
- Domain configuration
- CDN setup
- Monitoring

---

### 5.7 Troubleshooting (`guides/troubleshooting.md`)

**Purpose:** Solve common problems

**Content:**
- Build errors
- Runtime errors
- Performance issues
- i18n issues
- Styling problems
- TypeScript errors
- Dependency conflicts
- Getting help

**Format:**
```markdown
## Problem: "X is not a function" error

**Symptoms:** ...
**Cause:** ...
**Solution:** ...
**Prevention:** ...
```

---

## 6. API Reference

### 6.1 Components API (`api-reference/components.md`)

**Purpose:** Complete component API reference

**Content:**
- Alphabetical component list
- Props tables
- Type definitions
- Default values
- Required vs optional props
- Deprecated props

**Format:**
```typescript
interface HeroSectionProps {
  /** Localized heading text */
  heading: LocalizedString | string;
  /** Localized description */
  description?: LocalizedString | string;
  /** Primary CTA button */
  primaryCTA: CTAConfig;
  /** Optional secondary CTA */
  secondaryCTA?: CTAConfig;
  /** Current locale */
  locale: string;
  /** Animation variant */
  animation?: 'fade' | 'slide' | 'zoom';
}
```

---

### 6.2 Utilities API (`api-reference/utilities.md`)

**Purpose:** Utility function reference

**Content:**
- Analytics utilities
- i18n utilities
- SEO utilities
- Form utilities
- Navigation utilities
- Theme utilities

**Examples:**
```typescript
// Analytics
trackEvent(eventName: string, properties?: Record<string, unknown>): void
trackPageView(url: string): void
trackCTAClick(ctaId: string, location: string): void

// i18n
getLocalizedString(value: LocalizedString, locale: string): string
formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string
formatCurrency(amount: number, locale: string, currency: string): string

// SEO
generateSitemap(config: SitemapConfig): string
createStructuredData(type: string, data: Record<string, unknown>): object
```

---

### 6.3 Hooks API (`api-reference/hooks.md`)

**Purpose:** React hooks reference

**Content:**
- Available hooks
- Parameters
- Return values
- Usage examples
- Common patterns

**Examples:**
```typescript
// useAnalytics
const { trackEvent, trackPageView } = useAnalytics();

// useLocale
const { locale, setLocale, t } = useLocale();

// useABTest
const variant = useABTest('test-id', { A: 50, B: 50 });
```

---

### 6.4 Types API (`api-reference/types.md`)

**Purpose:** TypeScript type reference

**Content:**
- Core types
- Component prop types
- Utility types
- Enums
- Type guards

**Examples:**
```typescript
type LocalizedString = {
  [locale: string]: string;
};

type Locale = 'en' | 'fr' | 'es' | 'de';

type CTAConfig = {
  text: LocalizedString | string;
  href: string;
  onClick?: () => void;
};
```

---

## 7. Examples

### 7.1 Landing Pages (`examples/landing-pages/`)

**Files:**
- `saas-landing.md` - SaaS product landing page
- `agency-landing.md` - Agency landing page
- `consulting-landing.md` - Consulting service page
- `product-launch.md` - Product launch page
- `event-registration.md` - Event registration page

**Each includes:**
- Complete code
- Live demo link
- Screenshot
- Key features used
- Customization ideas

---

### 7.2 Service Sites (`examples/service-sites/`)

**Files:**
- `law-firm.md` - Law firm website
- `dental-practice.md` - Dental practice site
- `real-estate.md` - Real estate agency
- `accounting.md` - Accounting services
- `consulting.md` - Consulting firm

---

### 7.3 Multi-Language (`examples/multi-language/`)

**Files:**
- `bilingual-site.md` - English/French site
- `multilingual-site.md` - 5+ languages
- `rtl-support.md` - Arabic/Hebrew support
- `locale-detection.md` - Auto-detection example

---

### 7.4 E-commerce (`examples/e-commerce/`)

**Files:**
- `product-page.md` - Product detail page
- `pricing-page.md` - Pricing/plans page
- `checkout-flow.md` - Checkout process
- `cart-integration.md` - Shopping cart

---

## 8. Contributing

### 8.1 Development (`contributing/development.md`)

**Purpose:** Set up development environment

**Content:**
- Forking the repository
- Installing dependencies
- Running dev server
- Project structure
- Development workflow
- Building locally
- Running tests

---

### 8.2 Testing (`contributing/testing.md`)

**Purpose:** Write and run tests

**Content:**
- Testing philosophy (TDD)
- Unit tests with Vitest
- Component tests with Testing Library
- Integration tests
- E2E tests
- Coverage requirements
- Running tests
- Writing new tests

**Examples:**
```typescript
// Component test example
describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

---

### 8.3 Pull Requests (`contributing/pull-requests.md`)

**Purpose:** Submit contributions

**Content:**
- Before you start
- Creating a branch
- Making changes
- Commit message format
- Pre-commit hooks
- Submitting PR
- Review process
- Addressing feedback

**Commit format:**
```
<type>: <subject>

<body>

<footer>

Types: feat, fix, docs, style, refactor, test, chore
```

---

### 8.4 Code Style (`contributing/code-style.md`)

**Purpose:** Maintain consistent code

**Content:**
- TypeScript style
- React patterns
- Component structure
- File naming
- Import order
- Comments and documentation
- Linting and formatting
- Best practices

**Rules:**
```typescript
// ✅ Good
export function ComponentName({ prop1, prop2 }: Props) {
  return <div>{prop1}</div>;
}

// ❌ Bad
export const ComponentName = ({ prop1, prop2 }: Props) => {
  return <div>{prop1}</div>;
};
```

---

## 9. Additional Resources

### 9.1 Changelog (`CHANGELOG.md`)

**Purpose:** Track version history

**Content:**
- Version history
- Breaking changes
- New features
- Bug fixes
- Deprecations
- Migration guides

---

### 9.2 FAQ (`FAQ.md`)

**Purpose:** Answer common questions

**Content:**
- General questions
- Technical questions
- Troubleshooting
- Best practices
- Limitations
- Roadmap

---

### 9.3 Glossary (`GLOSSARY.md`)

**Purpose:** Define terminology

**Content:**
- Framework terms
- Next.js terms
- React terms
- i18n terms
- SEO terms
- Analytics terms

---

### 9.4 Resources (`RESOURCES.md`)

**Purpose:** External links and tools

**Content:**
- Useful links
- Third-party tools
- Design resources
- Learning resources
- Community resources
- Video tutorials

---

## 10. Documentation Best Practices

### Writing Style

**Guidelines:**
- Use active voice
- Write in second person ("you")
- Be concise and clear
- Use examples liberally
- Include code snippets
- Add screenshots where helpful
- Link to related docs
- Keep updated

### Code Examples

**Requirements:**
- Working code (tested)
- TypeScript types
- Comments for complex logic
- Real-world scenarios
- Progressive complexity
- Copy-paste ready

### Structure

**Each doc should have:**
1. Title and brief description
2. Table of contents (if long)
3. Overview/introduction
4. Main content sections
5. Examples
6. Related resources
7. Next steps

---

## 11. Documentation Maintenance

### Regular Updates

**Schedule:**
- Review quarterly
- Update with releases
- Fix reported issues
- Add new examples
- Improve clarity

### Community Contributions

**Process:**
- Welcome doc PRs
- Review for accuracy
- Maintain consistency
- Credit contributors
- Update CHANGELOG

---

## Tools for Documentation

### Recommended Stack

- **Markdown** - All docs in markdown
- **Docusaurus** or **Nextra** - Doc site generator
- **Algolia** - Search functionality
- **GitHub Pages** or **Vercel** - Hosting
- **Mermaid** - Diagrams
- **Carbon** - Code screenshots

### Documentation Site Features

- Search
- Version selector
- Dark mode
- Mobile responsive
- Copy code button
- Live examples
- Interactive playground
- API explorer

---

## Success Metrics

### Documentation Quality

**Measure:**
- Time to first success
- Support ticket reduction
- Community contributions
- Search effectiveness
- User satisfaction
- Example usage

### Continuous Improvement

**Track:**
- Most viewed pages
- Search queries
- Broken links
- Outdated content
- Missing topics
- User feedback

---

This structure provides comprehensive coverage of the framework while being organized for easy navigation and discovery. Each section builds on previous ones, guiding users from beginner to advanced usage.
