# Internationalization (i18n)

Simple Site Framework provides flexible multi-language support that works for single-language sites, bilingual sites, or sites with 20+ languages.

## Overview

The i18n system includes:

- **Flexible routing** - Single language (no overhead), bilingual, or multi-language
- **Automatic detection** - Browser language and cookie persistence
- **Type-safe content** - LocalizedString type with full TypeScript support
- **SEO optimized** - hreflang tags, canonical URLs, language alternates
- **Smart UI** - Language selector adapts (toggle for 2 languages, dropdown for 3+)

## Quick Start

### 1. Single Language Site (No i18n)

If you don't need multiple languages, just use strings:

```typescript
<HeroSection
  heading="Welcome to Our Site"
  description="We help businesses grow"
/>
```

No configuration needed. No routing overhead.

### 2. Bilingual Site

**Step 1:** Create i18n config

```typescript
// src/config/i18n.ts
import type { I18nConfig } from '@zoyth/simple-site-framework';

export const i18nConfig: I18nConfig = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',  // /about for EN, /fr/about for FR
  localeDetection: true,
};
```

**Step 2:** Use LocalizedString

```typescript
<HeroSection
  heading={{
    en: 'Welcome to Our Site',
    fr: 'Bienvenue sur notre site'
  }}
  description={{
    en: 'We help businesses grow',
    fr: 'Nous aidons les entreprises à croître'
  }}
  locale={locale}
/>
```

**Step 3:** Language selector appears automatically

The framework renders a simple toggle between EN/FR.

### 3. Multi-Language Site (3+ Languages)

```typescript
// src/config/i18n.ts
export const i18nConfig: I18nConfig = {
  locales: ['en', 'fr', 'es', 'de', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
  localeNames: {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    ja: '日本語',
  },
};
```

The framework renders a dropdown selector with all 5 languages.

## Configuration

### I18nConfig Options

```typescript
interface I18nConfig {
  /** Supported locales */
  locales: readonly string[];

  /** Default/fallback locale */
  defaultLocale: string;

  /** URL prefix mode */
  localePrefix?: 'always' | 'as-needed' | 'never';

  /** Auto-detect browser language */
  localeDetection?: boolean;

  /** Full language names for UI */
  localeNames?: Record<string, string>;

  /** Short labels for compact UI */
  localeLabels?: Record<string, string>;

  /** RTL locales (Arabic, Hebrew) */
  rtlLocales?: readonly string[];

  /** Cookie configuration */
  localeCookie?: {
    name?: string;
    maxAge?: number;
    sameSite?: 'lax' | 'strict' | 'none';
  };
}
```

### Locale Prefix Modes

#### 'as-needed' (Recommended)

Default locale has no prefix, others do:

```
/about          → English (default locale)
/fr/about       → French
/es/about       → Spanish
```

**Benefits:**
- Clean URLs for default language
- SEO-friendly (default as canonical)
- Best user experience

#### 'always'

All locales have prefix:

```
/en/about       → English
/fr/about       → French
/es/about       → Spanish
```

**Benefits:**
- Explicit language in every URL
- Equal treatment of all languages
- Easier to switch default locale later

#### 'never'

No prefixes, cookie/header detection only:

```
/about          → Shows based on user's language preference
```

**Benefits:**
- Simplest URLs
- Good for markets with one dominant language

**Drawbacks:**
- Harder to share specific language links
- Requires JavaScript for language switching

## LocalizedString Type

The core i18n type:

```typescript
type LocalizedString = {
  [locale: string]: string;
};

// Example
const heading: LocalizedString = {
  en: 'About Us',
  fr: 'À propos de nous',
  es: 'Sobre nosotros'
};
```

### Type-Safe LocalizedStrings

Enforce required locales:

```typescript
type RequiredLocales<T> = {
  [K in 'en' | 'fr']: T;
};

const heading: RequiredLocales<string> = {
  en: 'Welcome',
  fr: 'Bienvenue',
  // TypeScript error if missing either
};
```

### Using in Components

All framework components accept LocalizedString:

```typescript
<HeroSection
  heading={{ en: 'Welcome', fr: 'Bienvenue' }}
  description={{ en: 'Start your journey', fr: 'Commencez votre voyage' }}
  cta={{
    text: { en: 'Get Started', fr: 'Commencer' },
    href: '/contact'
  }}
  locale={locale}
/>
```

### Utility Function

Get the right language:

```typescript
import { getLocalizedString } from '@zoyth/simple-site-framework';

const text = getLocalizedString(
  { en: 'Hello', fr: 'Bonjour' },
  locale
);
// Returns 'Hello' if locale is 'en'
// Returns 'Bonjour' if locale is 'fr'
// Falls back to default locale if locale not found
```

## Next.js Integration

### App Router Structure

```
src/app/
  [locale]/
    layout.tsx      # Locale-aware layout
    page.tsx        # Homepage
    about/
      page.tsx      # About page
    services/
      page.tsx      # Services page
```

### Layout Setup

```typescript
// src/app/[locale]/layout.tsx
import { i18nConfig } from '@/config/i18n';
import { LanguageSelector } from '@zoyth/simple-site-framework';

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} dir={isRtlLocale(locale) ? 'rtl' : 'ltr'}>
      <body>
        <Header>
          <LanguageSelector currentLocale={locale} />
        </Header>
        {children}
      </body>
    </html>
  );
}
```

### Page Example

```typescript
// src/app/[locale]/about/page.tsx
import { aboutContent } from '@/config/content/about';
import { AboutSection } from '@zoyth/simple-site-framework';

export default function AboutPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  return <AboutSection {...aboutContent} locale={locale} />;
}
```

## Middleware Setup

Create middleware for automatic redirection and language detection:

```typescript
// src/middleware.ts
import { createI18nMiddleware } from '@zoyth/simple-site-framework/lib/i18n';
import { i18nConfig } from './config/i18n';

export default createI18nMiddleware(i18nConfig);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**What it does:**
1. Detects locale from URL, cookie, or browser
2. Redirects to appropriate URL based on `localePrefix` mode
3. Sets locale cookie for persistence
4. Validates locale is supported

## SEO Optimization

### Meta Tags

Add language alternates:

```typescript
// src/app/[locale]/page.tsx
import { I18nMetaTags } from '@zoyth/simple-site-framework';

export default function Page({ params: { locale } }) {
  return (
    <>
      <I18nMetaTags
        currentLocale={locale}
        pathname="/about"
        baseUrl="https://yoursite.com"
      />
      {/* Page content */}
    </>
  );
}
```

Generates:
```html
<link rel="canonical" href="https://yoursite.com/about" />
<link rel="alternate" hrefLang="en" href="https://yoursite.com/about" />
<link rel="alternate" hrefLang="fr" href="https://yoursite.com/fr/about" />
<link rel="alternate" hrefLang="x-default" href="https://yoursite.com/about" />
<meta property="og:locale" content="en" />
<meta property="og:locale:alternate" content="fr" />
```

### Sitemap Generation

Generate locale-specific sitemaps:

```typescript
// src/app/sitemap.ts
import { i18nConfig } from '@/config/i18n';

export default function sitemap() {
  const pages = ['', 'about', 'services', 'contact'];

  return pages.flatMap(page =>
    i18nConfig.locales.map(locale => ({
      url: `https://yoursite.com/${locale !== 'en' ? `${locale}/` : ''}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: page === '' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          i18nConfig.locales.map(l => [
            l,
            `https://yoursite.com/${l !== 'en' ? `${l}/` : ''}${page}`
          ])
        )
      }
    }))
  );
}
```

## Content Management

### Pattern 1: Separate Files per Locale

```
src/content/
  en/
    home.ts
    about.ts
  fr/
    home.ts
    about.ts
```

```typescript
// src/content/en/home.ts
export const homeContent = {
  hero: {
    heading: 'Welcome to Our Site',
    description: 'We help businesses grow'
  }
};

// src/content/fr/home.ts
export const homeContent = {
  hero: {
    heading: 'Bienvenue sur notre site',
    description: 'Nous aidons les entreprises à croître'
  }
};

// Usage
import { homeContent as homeContentEn } from '@/content/en/home';
import { homeContent as homeContentFr } from '@/content/fr/home';

const content = locale === 'en' ? homeContentEn : homeContentFr;
```

### Pattern 2: Unified LocalizedStrings

```typescript
// src/content/home.ts
export const homeContent = {
  hero: {
    heading: {
      en: 'Welcome to Our Site',
      fr: 'Bienvenue sur notre site'
    },
    description: {
      en: 'We help businesses grow',
      fr: 'Nous aidons les entreprises à croître'
    }
  }
};

// Usage - pass locale to component
<HeroSection {...homeContent.hero} locale={locale} />
```

### Pattern 3: CMS Integration

```typescript
// Fetch localized content from CMS
async function getContent(slug: string, locale: string) {
  const response = await fetch(
    `https://cms.yoursite.com/api/content/${slug}?locale=${locale}`
  );
  return response.json();
}

// Use in page
export default async function Page({ params: { locale, slug } }) {
  const content = await getContent(slug, locale);
  return <HeroSection {...content.hero} locale={locale} />;
}
```

## Language Selector

The framework provides an adaptive language selector:

```typescript
import { LanguageSelector } from '@zoyth/simple-site-framework';

<LanguageSelector
  currentLocale={locale}
  variant="auto"  // 'text' for 2 languages, 'dropdown' for 3+
/>
```

**Automatic behavior:**
- 2 languages → Simple text toggle
- 3+ languages → Dropdown menu
- Generates URLs based on `localePrefix` mode
- Sets cookie on language change
- Handles slug translations

## Advanced Features

### RTL Language Support

```typescript
export const i18nConfig: I18nConfig = {
  locales: ['en', 'ar', 'he'],
  defaultLocale: 'en',
  rtlLocales: ['ar', 'he'],
};

// Apply to layout
<html lang={locale} dir={getTextDirection(locale)}>
```

### Slug Translations

Translate URL slugs:

```typescript
// src/config/slug-translations.ts
export const slugTranslations = {
  '/about': {
    en: '/about',
    fr: '/a-propos',
    es: '/acerca-de'
  },
  '/services': {
    en: '/services',
    fr: '/services',
    es: '/servicios'
  }
};
```

### Date & Number Formatting

```typescript
import { formatDate, formatNumber, formatCurrency } from '@zoyth/simple-site-framework/lib/i18n';

// Dates
formatDate(new Date(), 'fr', { dateStyle: 'long' });
// → "15 janvier 2026"

// Numbers
formatNumber(1234567.89, 'fr');
// → "1 234 567,89"

// Currency
formatCurrency(99.99, 'fr', 'EUR');
// → "99,99 €"
```

## Best Practices

### ✅ Do

- Use LocalizedString for all user-facing text
- Set up middleware for automatic detection
- Include hreflang tags for SEO
- Test with actual users of each language
- Use professional translation services
- Keep locale switching visible and accessible

### ❌ Don't

- Hardcode text in component files
- Forget to add new locales to all LocalizedStrings
- Use machine translation without review
- Assume all languages read left-to-right
- Forget to translate meta tags and alt text
- Use flags to represent languages (accessibility issue)

## Migration from Hardcoded Locales

If upgrading from the old hardcoded `['fr', 'en']` system:

1. Create i18n config file
2. Set `locales: ['fr', 'en']` to match previous behavior
3. Keep `localePrefix: 'always'` for identical URLs
4. Test thoroughly before changing `localePrefix`

## Troubleshooting

### Wrong language displaying

**Check:**
1. `locale` prop is being passed to components
2. LocalizedString has entry for that locale
3. Middleware is configured correctly
4. Cookie/browser detection working

### Language selector not appearing

**Check:**
1. LanguageSelector is in layout
2. `currentLocale` prop is provided
3. More than 1 locale in i18nConfig

### SEO tags missing

**Check:**
1. I18nMetaTags component is used
2. baseUrl is correct
3. pathname matches actual route

## Related Documentation

- **[Configuration-Driven](../core-concepts/configuration-driven.md)** - Content organization patterns
- **[LanguageSelector](../components/layout/LanguageSelector.md)** - Language switcher component
- **[SEO](./seo.md)** - Search engine optimization

## API Reference

Full i18n utilities: **[API Reference](../api/utilities.md#i18n)**
