# Simple Site Framework

A configuration-driven framework for building professional service websites with Next.js, React, and TypeScript.

## Features

- **Configuration-Driven**: Define your site's theme, content, and navigation in simple config files
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Bilingual Support**: Built-in internationalization for French and English
- **35+ Components**: Pre-built sections, layouts, and UI components with advanced features
- **Themeable**: Easy customization of colors, fonts, and design tokens
- **Next.js Optimized**: Built specifically for Next.js 14+ with App Router
- **CLI Tools**: Scaffold new projects and manage framework tasks with built-in commands
- **Accessibility First**: WCAG 2.1 AA compliant with comprehensive keyboard navigation
- **Performance Optimized**: Lazy loading, code splitting, and optimized animations

## Quick Start with CLI

The fastest way to get started is with the CLI scaffolding tool:

```bash
npx @zoyth/simple-site-framework create my-site
cd my-site
npm install
npm run dev
```

This creates a complete Next.js project with:
- All framework dependencies configured
- Sample theme and content configs
- Example pages using all major components
- Tailwind CSS properly configured

## Installation

For existing projects:

```bash
npm install @zoyth/simple-site-framework
```

## Peer Dependencies

This framework requires the following peer dependencies:

```bash
npm install next@16 react@19 react-dom@19 tailwindcss@4
```

**Note:** Tailwind CSS v3.4+ and v4.x are both fully supported. The framework uses standard Tailwind utility classes that work across both versions.

## ⚠️ Components Rendering Without Styling?

If your site renders but looks plain/unstyled, see **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for a complete setup checklist. The framework requires custom theme tokens to be defined in your Tailwind config.

## Tailwind CSS Compatibility

The framework is built with **Tailwind CSS** and works seamlessly with both v3.4+ and v4.x.

### Required Tailwind Configuration

Your project's `tailwind.config.ts` must include the framework components in the `content` array:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Include framework components for Tailwind to scan
    './node_modules/@zoyth/simple-site-framework/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        // Define colors that match your theme config
        primary: '#F16531',
        'primary-hover': '#D9551C',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient-light': 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)',
        'hero-gradient': 'linear-gradient(135deg, #2D3748, #1A202C)',
        'footer-gradient-orange': 'linear-gradient(135deg, #F37840, #D85620)',
      },
    },
  },
};

export default config;
```

### Why Both Versions Work

The framework only uses **standard Tailwind utility classes** that haven't changed between v3 and v4:
- Spacing: `px-4`, `py-6`, `mt-8`
- Layout: `flex`, `grid`, `items-center`
- Colors: `bg-primary`, `text-white`, `border-slate-200`
- Typography: `text-lg`, `font-bold`
- Effects: `hover:opacity-80`, `transition-colors`

These utilities are stable and work identically in both Tailwind v3.4+ and v4.x.

## Quick Start

### 1. Create Theme Configuration

```typescript
// src/config/theme.ts
import { ThemeConfig } from 'simple-site-framework';

export const myTheme: ThemeConfig = {
  brand: {
    name: 'My Company',
    colors: {
      primary: '#F16531',
      primaryHover: '#D9551C',
      // ... more colors
    },
    fonts: {
      heading: {
        family: 'Playfair Display',
        weights: [400, 700, 900],
        fallback: 'serif',
      },
      body: {
        family: 'IBM Plex Sans',
        weights: [300, 400, 600],
        fallback: 'sans-serif',
      },
    },
  },
  // ... more theme config
};
```

### 2. Create Content Configuration

```typescript
// src/config/content.ts
import { SiteContent } from 'simple-site-framework';

export const myContent: SiteContent = {
  metadata: {
    siteName: 'My Company',
    siteUrl: 'https://example.com',
    // ... more metadata
  },
  hero: {
    headline: {
      fr: 'Bienvenue',
      en: 'Welcome',
    },
    // ... more hero content
  },
  // ... more content sections
};
```

### 3. Create Navigation Configuration

```typescript
// src/config/navigation.ts
import { NavigationConfig } from 'simple-site-framework';

export const myNavigation: NavigationConfig = {
  header: {
    logo: {
      image: '/logo.png',
      imageAlt: {
        fr: 'Mon Entreprise',
        en: 'My Company',
      },
      href: '/',
      width: 1674,        // Actual image width (for Next.js optimization)
      height: 613,        // Actual image height (for Next.js optimization)
      displayHeight: 48,  // Rendered height in header (defaults to 48px)
    },
    mainNav: [
      // ... nav items
    ],
  },
  // ... more navigation config
};
```

### 4. Use Components in Your Pages

```typescript
// src/app/[locale]/page.tsx
import { HeroSection, ServicesSection, ContactSection } from 'simple-site-framework';
import { myContent } from '@/config/content';

export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <>
      <HeroSection
        content={myContent.hero}
        locale={params.locale}
        animations={{ headline: 'fadeInUp', cta: 'fadeInUp' }}
        stickyCtaAfterScroll={true}
      />
      <ServicesSection content={myContent.services} locale={params.locale} />
      <ContactSection
        locale={params.locale}
        content={myContent.contact}
        formConfig={{
          enabled: true,
          fields: ['name', 'email', 'phone', 'subject', 'message'],
          requiredFields: ['name', 'email', 'message']
        }}
      />
    </>
  );
}
```

### Enhanced Component Examples

#### Button with Loading State
```typescript
import { Button } from 'simple-site-framework';

<Button
  variant="filled"
  size="lg"
  loading={isSubmitting}
  loadingText="Sending..."
  success={isSuccess}
  successText="Sent!"
  icon={<Icons.Send />}
  ripple
>
  Submit
</Button>
```

#### Icon Usage
```typescript
import { Icon, Icons } from 'simple-site-framework';

// Type-safe icon by name
<Icon name="Mail" size={24} />

// Pre-configured preset
<Icons.Mail size={24} />

// With custom styling
<Icon name="Check" className="text-green-600" />
```

#### CodeBlock for Documentation
```typescript
import { CodeBlock } from 'simple-site-framework';

<CodeBlock
  code={`const example = "Hello World";`}
  language="typescript"
  showLineNumbers
  showCopy
/>
```

### 5. Use Layout Components

```typescript
// src/app/[locale]/layout.tsx
import { Header, Footer } from 'simple-site-framework';
import { myNavigation } from '@/config/navigation';

export default function Layout({ children, params }: LayoutProps) {
  return (
    <html lang={params.locale}>
      <body>
        <Header config={myNavigation.header} locale={params.locale} />
        <main>{children}</main>
        <Footer config={myNavigation.footer} locale={params.locale} />
      </body>
    </html>
  );
}
```

## Available Components (35+)

### Layout Components
- **Header** - Responsive header with mobile menu, navigation, and language switcher
- **Footer** - Multi-column footer with links, social media, and copyright
- **LanguageSwitcher** - Toggle between French and English with flags
- **PageLayout** - Standard page wrapper with consistent spacing
- **ServicePageLayout** - Specialized layout for service detail pages
- **LazySection** - Wrapper for lazy-loading sections with intersection observer

### Section Components
- **HeroSection** - Advanced hero with animations, video backgrounds, parallax, sticky CTA, trust badges
- **AboutSection** - About section with rich content, timeline, team grid
- **ServicesSection** - Services grid with hover effects and filtering
- **FeaturesGrid** - Feature showcase with icons and descriptions
- **TestimonialsSection** - Customer testimonials with ratings and rotation
- **FAQSection** - Searchable, expandable FAQ accordion
- **TeamSection** - Team member grid with bios and social links
- **ContactSection** - Full contact form with validation, multiple locations, maps, office hours
- **CTASection** - Call-to-action sections with variants (banner, split, card)
- **WhyChooseUsSection** - Differentiators showcase
- **SecurePortalSection** - Secure portal CTA
- **PersonalTaxesSection** - Service-specific sections
- **RecruitingSection** - Recruitment CTA
- **PricingSection** - Pricing tables with feature comparison
- **StatsSection** - Statistics showcase with counter animations
- **LogosSection** - Client/partner logo grid
- **TimelineSection** - Company history or process timeline
- **ProcessSection** - Step-by-step process visualization

### UI Components
- **Button** - Enhanced button with loading/success states, icons, ripple effects, 6 variants, 5 sizes, tooltips
- **Card** - Flexible card container with variants and hover effects
- **Badge** - Status and category badges
- **Icon** - Type-safe Lucide icon wrapper with 1000+ icons
- **Input** - Form input with validation states
- **Textarea** - Multi-line text input
- **Select** - Dropdown select (Radix UI)
- **Checkbox** - Checkbox input
- **Radio** - Radio button input
- **FormField** - Form field wrapper with label and error display
- **Breadcrumb** - Breadcrumb navigation
- **Tabs** - Tab navigation (Radix UI)
- **Accordion** - Collapsible content (Radix UI)
- **Dialog** - Modal dialogs (Radix UI)
- **Tooltip** - Hover tooltips (Radix UI)
- **Toast** - Toast notifications

### Development & Documentation Tools
- **StyleGuide** - Comprehensive interactive style guide displaying all brand elements
- **CodeBlock** - Syntax-highlighted code blocks with copy button
- **ComponentDemo** - Live component preview with code examples
- **HeadScripts** - Inject scripts and meta tags into document head
- **BodyEndScripts** - Inject scripts before closing body tag

## Using the Style Guide

The framework includes a `StyleGuide` component that displays all your brand elements in one place - perfect for development reference, design reviews, and stakeholder presentations.

### Create a Style Guide Page

```typescript
// src/app/[locale]/style-guide/page.tsx
import { type Locale, StyleGuide } from 'simple-site-framework/components';
import { myTheme } from '@/config/theme';
import { myNavigation } from '@/config/navigation';

export default async function StyleGuidePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <StyleGuide
      locale={locale}
      theme={myTheme}
      logo={myNavigation.header.logo}
      favicon="/favicon.ico"
    />
  );
}
```

Visit `/style-guide` to see:
- Logo and favicon with dimensions
- Complete color palette with hex codes
- Brand gradients
- Typography (all heading levels, body text, font families)
- Button variants and sizes
- Form components and states
- UI components (cards, breadcrumbs)
- Spacing scale reference

**Tip**: Add `robots: 'noindex, nofollow'` to metadata to hide from search engines.

## Utilities

- `getLocalizedString(localizedString, locale)` - Get localized text
- `getNavigationString(localizedString, locale)` - Get navigation string
- `replaceVariables(text, variables)` - Replace placeholders in strings
- `generateThemeCSS(theme)` - Generate CSS variables from theme
- `cn(...classes)` - Merge Tailwind classes with clsx

## Configuration Schemas

The framework exports TypeScript types for all configurations:

- `ThemeConfig` - Theme configuration
- `SiteContent` - Content configuration
- `NavigationConfig` - Navigation configuration
- `LocalizedString` - Bilingual string type
- And many more...

## CLI Tools

The framework includes two CLI commands for project management:

### create-simple-site
Scaffold a new Next.js project with the framework pre-configured:

```bash
npx @zoyth/simple-site-framework create my-site
```

### simple-site
Framework management commands:

```bash
# Run migrations when upgrading versions
npx simple-site migrate

# Dry run to see what would change
npx simple-site migrate --dry-run

# Migrate to specific version
npx simple-site migrate --to=0.2.0
```

## Key Features

### Enhanced Button Component
- **6 variants**: outlined, filled, text, ghost, link, destructive
- **5 sizes**: xs, sm, md, lg, xl
- **States**: loading, success, disabled
- **Icons**: left, right, or icon-only buttons
- **Effects**: ripple animation, hover states
- **Tooltips**: automatic disabled state tooltips

### Advanced HeroSection
- **Animations**: fadeInUp, fadeIn, slideInLeft, with stagger
- **Backgrounds**: gradient, video, parallax effects
- **Interactive**: sticky CTA that appears on scroll
- **Trust signals**: badge display, social proof
- **Scroll indicator**: animated scroll hint

### Full-Featured ContactSection
- **Dynamic forms**: configurable fields with validation
- **Multiple locations**: office cards with maps, hours, directions
- **Spam protection**: honeypot and rate limiting
- **File uploads**: optional attachment support
- **Integrations**: ready for email/CRM services

### Type-Safe Icons
- **1000+ icons**: from Lucide React library
- **Type safety**: autocomplete for all icon names
- **Presets**: common icons pre-configured
- **Consistent**: automatic sizing and styling

## Documentation

### Getting Started
- **[QUICKSTART.md](./QUICKSTART.md)** - Complete step-by-step guide to building a new site
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions for common setup issues

### Accessibility
- **[docs/accessibility/overview.md](./docs/accessibility/overview.md)** - Accessibility commitment and quick start
- **[docs/accessibility/wcag-compliance.md](./docs/accessibility/wcag-compliance.md)** - WCAG 2.1 AA compliance checklist
- **[docs/accessibility/keyboard-navigation.md](./docs/accessibility/keyboard-navigation.md)** - Keyboard patterns and focus management
- **[docs/accessibility/screen-readers.md](./docs/accessibility/screen-readers.md)** - Screen reader testing and ARIA guidelines
- **[docs/accessibility/common-patterns.md](./docs/accessibility/common-patterns.md)** - Reusable accessibility patterns

### Migration & Upgrading
- **[docs/migration/overview.md](./docs/migration/overview.md)** - Version support, upgrade process, deprecation policy
- **[docs/migration/changelog.md](./docs/migration/changelog.md)** - Complete version history

### Architecture & Planning
- **[docs/architecture/decisions.md](./docs/architecture/decisions.md)** - Architecture Decision Records (ADRs)
- **[docs/ROADMAP.md](./docs/ROADMAP.md)** - Product roadmap and component inventory

## License

MIT

## Author

François Lane
