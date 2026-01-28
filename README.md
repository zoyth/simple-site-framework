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
npm install next@16 react@19 react-dom@19
```

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

## License

MIT

## Author

François Lane
