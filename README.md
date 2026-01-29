# Simple Site Framework

A configuration-driven framework for building professional service websites with Next.js, React, and TypeScript.

## Features

- **Configuration-Driven**: Define your site's theme, content, and navigation in simple config files
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Bilingual Support**: Built-in internationalization for French and English
- **Reusable Components**: Pre-built sections, layouts, and UI components
- **Themeable**: Easy customization of colors, fonts, and design tokens
- **Next.js Optimized**: Built specifically for Next.js 14+ with App Router

## Installation

```bash
npm install simple-site-framework
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
import { HeroSection, ServicesSection } from 'simple-site-framework';
import { myContent } from '@/config/content';

export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <>
      <HeroSection content={myContent.hero} locale={params.locale} />
      <ServicesSection content={myContent.services} locale={params.locale} />
    </>
  );
}
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

## Available Components

### Layout Components
- `Header` - Responsive header with navigation and language switcher
- `Footer` - Footer with links and copyright
- `LanguageSwitcher` - Toggle between languages

### Section Components
- `HeroSection` - Hero banner with headline, subheadline, and CTAs
- `AboutSection` - About section with paragraphs and image
- `ServicesSection` - Services grid with cards
- `WhyChooseUsSection` - Why choose us section
- `ContactSection` - Contact form section
- `SecurePortalSection` - Secure portal CTA
- `PersonalTaxesSection` - Personal taxes info
- `RecruitingSection` - Recruitment CTA
- `ServicePageLayout` - Layout for service detail pages

### UI Components
- `Button` - Customizable button with variants
- `Card` - Card container
- `Input` - Form input
- `Textarea` - Form textarea
- `Breadcrumb` - Breadcrumb navigation

### Development Tools
- `StyleGuide` - Comprehensive style guide page displaying all brand elements, colors, typography, buttons, and UI components
- `HeadScripts` - Inject custom scripts and meta tags into document head
- `BodyEndScripts` - Inject scripts before closing body tag (analytics, chat widgets)

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

## Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Complete step-by-step guide to building a new site
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions for common setup issues

## License

MIT

## Author

François Lane
