# i18n Configuration Reference

Complete reference for configuring internationalization in simple-site-framework.

## I18nConfig Interface

```typescript
interface I18nConfig {
  locales: readonly string[];
  defaultLocale: string;
  localePrefix?: LocalePrefix;
  localeDetection?: boolean;
  localeNames?: Record<string, string>;
  localeLabels?: Record<string, string>;
  rtlLocales?: readonly string[];
  localeCookie?: LocaleCookieConfig;
  slugTranslations?: SlugTranslations;
}
```

## Required Fields

### `locales`
**Type:** `readonly string[]`
**Required:** Yes

Array of supported locale codes (ISO 639-1).

```typescript
locales: ['en', 'fr', 'es', 'de', 'ja']
```

### `defaultLocale`
**Type:** `string`
**Required:** Yes

Default locale when none is specified. Must be included in `locales` array.

```typescript
defaultLocale: 'en'
```

## Optional Fields

### `localePrefix`
**Type:** `'always' | 'as-needed' | 'never'`
**Default:** `'as-needed'`

Controls how locale appears in URLs.

#### `'always'` Mode
All routes have locale prefix:
- `/en/about`
- `/fr/about`
- `/` → redirects to `/en/` (or detected language)

**Use when:**
- You want explicit language in every URL
- All languages are equal importance
- Consistency across all locales matters

```typescript
localePrefix: 'always'
```

#### `'as-needed'` Mode (Recommended)
Only non-default locales have prefix:
- `/about` (default locale, no prefix)
- `/fr/about` (non-default, with prefix)
- `/` → stays at `/` (default locale)

**Use when:**
- You have a primary market/language
- You want cleaner URLs for default language
- Better SEO for primary market

```typescript
localePrefix: 'as-needed'
```

#### `'never'` Mode
No locale in URLs, detection via cookie/header only:
- `/about` (all languages)
- `/` (all languages)

**Use when:**
- Single-language site with optional translations
- You want simplest possible URLs
- Not concerned about shareable language-specific links

```typescript
localePrefix: 'never'
```

### `localeDetection`
**Type:** `boolean`
**Default:** `true`

Enable automatic locale detection from browser `Accept-Language` header.

```typescript
localeDetection: true  // Detect from browser
localeDetection: false // Always use default locale
```

When enabled, middleware checks:
1. Cookie (user's explicit preference)
2. `Accept-Language` header (browser preference)
3. Default locale (fallback)

### `localeNames`
**Type:** `Record<string, string>`
**Default:** `{}`

Full locale names for display in language selector and UI.

```typescript
localeNames: {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  ja: '日本語',
  ar: 'العربية',
}
```

**Best practice:** Use native language names (autonyms).

### `localeLabels`
**Type:** `Record<string, string>`
**Default:** `{}`

Short locale labels for compact display (e.g., language selector button).

```typescript
localeLabels: {
  en: 'EN',
  fr: 'FR',
  es: 'ES',
  de: 'DE',
  ja: 'JA',
  ar: 'AR',
}
```

### `rtlLocales`
**Type:** `readonly string[]`
**Default:** `[]`

Locales that use right-to-left text direction.

```typescript
rtlLocales: ['ar', 'he', 'fa', 'ur']
```

Common RTL languages:
- `ar` - Arabic
- `he` - Hebrew
- `fa` - Persian/Farsi
- `ur` - Urdu
- `yi` - Yiddish

Use with `getTextDirection()` in layout:
```tsx
<html lang={locale} dir={getTextDirection(locale)}>
```

### `localeCookie`
**Type:** `LocaleCookieConfig`
**Default:** See below

Configuration for locale persistence cookie.

```typescript
localeCookie: {
  name: 'NEXT_LOCALE',        // Cookie name
  maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
  sameSite: 'lax',            // 'lax' | 'strict' | 'none'
}
```

**Defaults:**
- `name`: `'NEXT_LOCALE'`
- `maxAge`: `31536000` (1 year)
- `sameSite`: `'lax'`

### `slugTranslations`
**Type:** `SlugTranslations`
**Default:** `{}`

Custom slug translations for multilingual routes.

```typescript
slugTranslations: {
  en: {
    '/about': '/a-propos',
    '/contact': '/nous-contacter',
    '/pricing': '/tarifs',
  },
  fr: {
    '/a-propos': '/about',
    '/nous-contacter': '/contact',
    '/tarifs': '/pricing',
  },
}
```

**Note:** Framework provides default French/English translations. Custom translations merge with and override defaults.

## Complete Example

```typescript
// src/config/i18n.ts
import type { I18nConfig } from 'simple-site-framework/lib/i18n';

export const i18nConfig: I18nConfig = {
  // Required
  locales: ['en', 'fr', 'es', 'ar'],
  defaultLocale: 'en',

  // Routing
  localePrefix: 'as-needed',
  localeDetection: true,

  // Display
  localeNames: {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    ar: 'العربية',
  },
  localeLabels: {
    en: 'EN',
    fr: 'FR',
    es: 'ES',
    ar: 'AR',
  },

  // RTL support
  rtlLocales: ['ar'],

  // Cookie config
  localeCookie: {
    name: 'MY_LOCALE',
    maxAge: 90 * 24 * 60 * 60, // 90 days
    sameSite: 'lax',
  },

  // Slug translations
  slugTranslations: {
    en: {
      '/products': '/produits',
      '/services': '/services',
    },
    fr: {
      '/produits': '/products',
      '/services': '/services',
    },
    es: {
      '/products': '/productos',
      '/services': '/servicios',
    },
  },
};
```

## Helper Functions

These functions read from your config after initialization:

### Configuration Access
- `getI18nConfig()` - Get full config
- `getLocales()` - Get supported locales array
- `getDefaultLocale()` - Get default locale
- `getLocalePrefix()` - Get prefix mode
- `getLocaleNames()` - Get locale names mapping
- `getLocaleLabels()` - Get locale labels mapping
- `getRtlLocales()` - Get RTL locales array

### Validation
- `isSupportedLocale(locale)` - Check if locale is supported
- `validateLocale(locale)` - Alias for isSupportedLocale

### Display
- `getLocaleName(locale)` - Get full name for locale
- `getLocaleLabel(locale)` - Get short label for locale
- `getLocaleAutonym(locale)` - Get native name (fallback map)

### Utilities
- `isRtlLocale(locale)` - Check if locale is RTL
- `getTextDirection(locale)` - Get 'ltr' or 'rtl'
- `getAlternateLocales(currentLocale)` - Get all other locales
- `normalizeLocale(locale)` - Handle variants (en-US → en)
- `matchLocale(locale)` - Match with variant support

## Environment-Specific Configs

You can use different configs per environment:

```typescript
// src/config/i18n.ts
import type { I18nConfig } from 'simple-site-framework/lib/i18n';

const baseConfig: I18nConfig = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
};

export const i18nConfig: I18nConfig =
  process.env.NODE_ENV === 'development'
    ? {
        ...baseConfig,
        localeDetection: false, // Disable in dev
      }
    : baseConfig;
```

## TypeScript Tips

### Type-Safe Locale Strings

```typescript
import { i18nConfig } from './config/i18n';

type AppLocale = typeof i18nConfig.locales[number];
// AppLocale = 'en' | 'fr' | 'es' | ...

function myFunction(locale: AppLocale) {
  // TypeScript ensures only valid locales
}
```

### Extend Config Type

```typescript
interface MyI18nConfig extends I18nConfig {
  customField: string;
}

export const i18nConfig: MyI18nConfig = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  customField: 'my-value',
};
```

## See Also

- [Migration Guide](./MIGRATION.md) - Upgrade from old system
- [Examples](./EXAMPLES.md) - Usage examples
- [SEO Guide](./SEO.md) - SEO best practices
