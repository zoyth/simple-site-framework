# i18n Usage Examples

Practical examples for common i18n scenarios.

## Table of Contents
- [Single Language Site](#single-language-site)
- [Bilingual Site](#bilingual-site-2-languages)
- [Multi-Language Site](#multi-language-site-3-languages)
- [RTL Language Support](#rtl-language-support)
- [Custom Slug Translations](#custom-slug-translations)
- [Language-Specific Content](#language-specific-content)

## Single Language Site

For a site with no i18n overhead:

```typescript
// src/config/i18n.ts
export const i18nConfig = {
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'never',
  localeDetection: false,
};
```

**URLs:** `/about`, `/contact` (no locale prefix)

**Folder structure:**
```
src/app/
├── layout.tsx
├── page.tsx
└── about/
    └── page.tsx
```

**No `[locale]` folder needed** - middleware handles everything.

## Bilingual Site (2 Languages)

Classic bilingual setup with text toggle:

```typescript
// src/config/i18n.ts
export const i18nConfig = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
  localeNames: {
    en: 'English',
    fr: 'Français',
  },
};
```

**URLs:**
- English: `/about` (default, no prefix)
- French: `/fr/about` (with prefix)

**Layout with language selector:**
```tsx
// src/app/[locale]/layout.tsx
import { setI18nConfig, getTextDirection } from 'simple-site-framework/lib/i18n';
import { LanguageSelector, I18nMetaTags } from 'simple-site-framework';
import { i18nConfig } from '../../config/i18n';

setI18nConfig(i18nConfig);

export default async function Layout({ children, params }) {
  const { locale } = await params;

  return (
    <html lang={locale} dir={getTextDirection(locale)}>
      <head>
        <I18nMetaTags
          currentLocale={locale}
          pathname="/about"
          baseUrl="https://example.com"
        />
      </head>
      <body>
        <header>
          <nav>
            {/* Auto-detects text toggle for 2 languages */}
            <LanguageSelector currentLocale={locale} />
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

## Multi-Language Site (3+ Languages)

Site with multiple languages and dropdown selector:

```typescript
// src/config/i18n.ts
export const i18nConfig = {
  locales: ['en', 'fr', 'es', 'de', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true,
  localeNames: {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    ja: '日本語',
  },
  localeLabels: {
    en: 'EN',
    fr: 'FR',
    es: 'ES',
    de: 'DE',
    ja: 'JA',
  },
};
```

**URLs:** All have prefix
- `/en/about`
- `/fr/about`
- `/es/about`
- `/de/about`
- `/ja/about`

**Layout with dropdown:**
```tsx
// LanguageSelector auto-switches to dropdown with 3+ languages
<LanguageSelector currentLocale={locale} className="ml-4" />
```

## RTL Language Support

Adding Arabic and Hebrew:

```typescript
// src/config/i18n.ts
export const i18nConfig = {
  locales: ['en', 'ar', 'he'],
  defaultLocale: 'en',
  rtlLocales: ['ar', 'he'],
  localeNames: {
    en: 'English',
    ar: 'العربية',
    he: 'עברית',
  },
};
```

**Layout with RTL support:**
```tsx
import { getTextDirection } from 'simple-site-framework/lib/i18n';

<html lang={locale} dir={getTextDirection(locale)}>
  {/* dir="ltr" for English, dir="rtl" for Arabic/Hebrew */}
</html>
```

**RTL-aware CSS:**
```css
/* Use logical properties */
.container {
  padding-inline-start: 1rem;  /* Left in LTR, right in RTL */
  margin-inline-end: 2rem;     /* Right in LTR, left in RTL */
}

/* Or use dir selector */
[dir="rtl"] .icon {
  transform: scaleX(-1);  /* Flip icons in RTL */
}
```

## Custom Slug Translations

Translate URL slugs between languages:

```typescript
// src/config/i18n.ts
export const i18nConfig = {
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  slugTranslations: {
    en: {
      '/products': '/produits',
      '/services': '/servicios',
      '/about': '/a-propos',
    },
    fr: {
      '/produits': '/products',
      '/servicios': '/services',
      '/a-propos': '/about',
    },
    es: {
      '/products': '/productos',
      '/services': '/servicios',
      '/about': '/acerca-de',
    },
  },
};
```

**URLs:**
- English: `/products`
- French: `/fr/produits`
- Spanish: `/es/productos`

**Language selector handles translation automatically.**

## Language-Specific Content

Using localized strings in components:

```tsx
// Component with localized content
import { getLocalizedString } from 'simple-site-framework/lib/content';

interface Props {
  locale: string;
}

export function PricingSection({ locale }: Props) {
  const content = {
    heading: {
      en: 'Pricing Plans',
      fr: 'Plans tarifaires',
      es: 'Planes de precios',
    },
    description: {
      en: 'Choose the plan that fits your needs',
      fr: 'Choisissez le plan qui vous convient',
      es: 'Elige el plan que se adapte a tus necesidades',
    },
  };

  return (
    <section>
      <h2>{getLocalizedString(content.heading, locale)}</h2>
      <p>{getLocalizedString(content.description, locale)}</p>
    </section>
  );
}
```

## Formatters

Using locale-aware formatters:

```tsx
import {
  formatDate,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
} from 'simple-site-framework/lib/i18n';

export function ProductCard({ locale, product }) {
  return (
    <div>
      <h3>{product.name}</h3>

      {/* Format currency */}
      <p className="price">
        {formatCurrency(product.price, locale, 'USD')}
        {/* en: "$29.99" | fr: "29,99 $US" */}
      </p>

      {/* Format date */}
      <time>
        {formatDate(product.releaseDate, locale, { dateStyle: 'long' })}
        {/* en: "January 15, 2026" | fr: "15 janvier 2026" */}
      </time>

      {/* Format relative time */}
      <span>
        {formatRelativeTime(-2, 'day', locale)}
        {/* en: "2 days ago" | fr: "il y a 2 jours" */}
      </span>

      {/* Format number */}
      <p>
        {formatNumber(product.views, locale)} views
        {/* en: "1,234,567" | fr: "1 234 567" */}
      </p>
    </div>
  );
}
```

## Middleware Configuration

### Basic Middleware

```typescript
// src/middleware.ts
import { createI18nMiddleware } from 'simple-site-framework/lib/i18n';
import { i18nConfig } from './src/config/i18n';

export default createI18nMiddleware(i18nConfig);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Exclude Additional Routes

```typescript
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
```

### Custom Middleware Logic

```typescript
import { createI18nMiddleware } from 'simple-site-framework/lib/i18n';
import { NextRequest } from 'next/server';
import { i18nConfig } from './src/config/i18n';

const i18nMiddleware = createI18nMiddleware(i18nConfig);

export default function middleware(request: NextRequest) {
  // Run i18n middleware first
  const response = i18nMiddleware(request);

  // Add custom logic
  response.headers.set('X-Custom-Header', 'value');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Static Generation

Generate static pages for all locales:

```tsx
// src/app/[locale]/blog/[slug]/page.tsx
import { i18nConfig } from '../../../config/i18n';

export async function generateStaticParams() {
  const posts = await getPosts();

  return i18nConfig.locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    }))
  );
}
```

## Utilities

### Check Locale Support

```tsx
import { validateLocale } from 'simple-site-framework/lib/i18n';

if (validateLocale(userLocale)) {
  // Use user's locale
} else {
  // Fall back to default
}
```

### Get Alternate Locales

```tsx
import { getAlternateLocales } from 'simple-site-framework/lib/i18n';

const alternates = getAlternateLocales('en');
// ['fr', 'es', 'de'] (all except 'en')
```

### Match Locale Variants

```tsx
import { matchLocale } from 'simple-site-framework/lib/i18n';

matchLocale('en-US'); // 'en' (if 'en' is supported)
matchLocale('fr-CA'); // 'fr' (if 'fr' is supported)
matchLocale('de-DE'); // null (if 'de' not supported)
```

## See Also

- [Configuration Reference](./CONFIGURATION.md)
- [Migration Guide](./MIGRATION.md)
- [SEO Guide](./SEO.md)
