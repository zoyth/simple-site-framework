# i18n Migration Guide

This guide helps you migrate from the hardcoded bilingual (fr/en) system to the new flexible i18n configuration.

## Overview

**Old System (pre-v0.2.0):**
- Hardcoded support for French and English only
- Locale routing always required `[locale]` folder
- No configuration needed (but inflexible)

**New System (v0.2.0+):**
- Support for any number of languages
- Flexible locale prefix modes
- Project-specific configuration
- Middleware for automatic routing

## Breaking Changes

1. **Configuration Required**: Projects must call `setI18nConfig()` before using i18n features
2. **No Hardcoded Locales**: Import from your config, not from framework
3. **LanguageSelector**: Replaces `LanguageSwitcher` (which is now deprecated)

## Migration Steps

### Step 1: Create i18n Configuration

Create `/src/config/i18n.ts` in your project:

```typescript
import type { I18nConfig } from 'simple-site-framework/lib/i18n';

export const i18nConfig: I18nConfig = {
  // Supported locales
  locales: ['fr', 'en'],

  // Default locale
  defaultLocale: 'fr',

  // Locale prefix mode (matches old behavior)
  localePrefix: 'always',

  // Enable browser language detection
  localeDetection: true,

  // Display names for language selector
  localeNames: {
    fr: 'Français',
    en: 'English',
  },

  // Short labels for compact display
  localeLabels: {
    fr: 'FR',
    en: 'EN',
  },
};
```

**To match old behavior exactly**, use `localePrefix: 'always'`.

### Step 2: Create Middleware

Create `/src/middleware.ts` in your project:

```typescript
import { createI18nMiddleware } from 'simple-site-framework/lib/i18n';
import { i18nConfig } from './src/config/i18n';

export default createI18nMiddleware(i18nConfig);

export const config = {
  // Exclude API routes, static assets, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Step 3: Initialize Config in Layout

Update `/src/app/[locale]/layout.tsx`:

```typescript
import { setI18nConfig } from 'simple-site-framework/lib/i18n';
import { i18nConfig } from '../../config/i18n';

// Initialize config at the top level
setI18nConfig(i18nConfig);

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: string };

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

### Step 4: Update Language Switcher (Optional)

Replace `LanguageSwitcher` with `LanguageSelector`:

**Before:**
```typescript
import { LanguageSwitcher } from 'simple-site-framework/components/layout/LanguageSwitcher';

<LanguageSwitcher currentLocale={locale} />
```

**After:**
```typescript
import { LanguageSelector } from 'simple-site-framework/components/layout/LanguageSelector';

<LanguageSelector currentLocale={locale} />
```

**Note:** `LanguageSwitcher` still works (it's a wrapper), but it's deprecated and will be removed in v1.0.0.

### Step 5: Add SEO Meta Tags (Optional but Recommended)

Add `I18nMetaTags` to your layout or pages:

```typescript
import { I18nMetaTags } from 'simple-site-framework';

export default function Layout({ children, params }) {
  return (
    <html>
      <head>
        <I18nMetaTags
          currentLocale={params.locale}
          pathname="/about"
          baseUrl="https://yoursite.com"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Step 6: Test Your Changes

1. **Run build**: `npm run build`
2. **Test language switching**: Click language selector
3. **Test direct URLs**: Navigate to `/fr/about`, `/en/about`
4. **Test browser detection**: Clear cookies, visit `/`
5. **Check SEO tags**: View page source for hreflang tags

## Common Issues

### Issue: "i18n configuration not initialized"

**Cause**: Forgot to call `setI18nConfig()` in layout

**Fix**: Add this at the top of your layout file:
```typescript
import { setI18nConfig } from 'simple-site-framework/lib/i18n';
import { i18nConfig } from '../../config/i18n';

setI18nConfig(i18nConfig);
```

### Issue: Routes not working

**Cause**: Middleware not created or incorrect matcher

**Fix**: Ensure `/src/middleware.ts` exists and exports the middleware with correct matcher.

### Issue: Language selector not appearing

**Cause**: Component not imported or config not initialized

**Fix**: Import `LanguageSelector` and ensure config is initialized before rendering.

## Upgrading to Better Prefix Modes

Once migrated, consider switching to `localePrefix: 'as-needed'` for better UX:

```typescript
export const i18nConfig: I18nConfig = {
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed', // Changed from 'always'
  // ... rest of config
};
```

**With 'as-needed':**
- French (default): `/about` (no prefix)
- English: `/en/about` (with prefix)

**Benefits:**
- Cleaner URLs for default language
- Better SEO (canonical URLs simpler)
- Matches user expectations for primary market

## Adding More Languages

To add more languages after migration:

```typescript
export const i18nConfig: I18nConfig = {
  locales: ['fr', 'en', 'es', 'de'], // Added Spanish and German
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeNames: {
    fr: 'Français',
    en: 'English',
    es: 'Español',    // Add display names
    de: 'Deutsch',
  },
  localeLabels: {
    fr: 'FR',
    en: 'EN',
    es: 'ES',         // Add labels
    de: 'DE',
  },
};
```

The `LanguageSelector` automatically switches to dropdown mode with 3+ languages.

## RTL Language Support

To add RTL languages (Arabic, Hebrew, etc.):

```typescript
export const i18nConfig: I18nConfig = {
  locales: ['en', 'ar', 'he'],
  defaultLocale: 'en',
  rtlLocales: ['ar', 'he'], // Specify RTL locales
  // ... rest of config
};
```

Update your layout to use text direction:

```typescript
import { getTextDirection } from 'simple-site-framework/lib/i18n';

<html lang={locale} dir={getTextDirection(locale)}>
```

## Need Help?

- Check [CONFIGURATION.md](./CONFIGURATION.md) for complete config reference
- Check [EXAMPLES.md](./EXAMPLES.md) for usage examples
- Open an issue on GitHub: https://github.com/zoyth/simple-site-framework/issues
