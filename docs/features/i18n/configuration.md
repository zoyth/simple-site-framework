# i18n Configuration

Configure internationalization settings for your multi-language site.

## Configuration File

Create your i18n configuration:

```typescript
// src/config/i18n.ts
import type { I18nConfig } from '@zoyth/simple-site-framework/lib/i18n';

export const i18nConfig: I18nConfig = {
  locales: ['en', 'fr', 'es', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
  localeNames: {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
  },
  localeLabels: {
    en: 'EN',
    fr: 'FR',
    es: 'ES',
    de: 'DE',
  },
  rtlLocales: ['ar', 'he'],
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: 'lax',
  },
};
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `locales` | `string[]` | Yes | Supported locale codes |
| `defaultLocale` | `string` | Yes | Default/fallback locale |
| `localePrefix` | `'always' \| 'as-needed' \| 'never'` | No | URL prefix mode (default: 'as-needed') |
| `localeDetection` | `boolean` | No | Auto-detect from browser (default: true) |
| `localeNames` | `Record<string, string>` | No | Full language names for UI |
| `localeLabels` | `Record<string, string>` | No | Short labels for UI |
| `rtlLocales` | `string[]` | No | Right-to-left locales |
| `localeCookie` | `object` | No | Cookie configuration |

## Locale Prefix Modes

### 'always'
All URLs include locale prefix:
- `/en/about`
- `/fr/about`

### 'as-needed' (Default)
Only non-default locales have prefix:
- `/about` (default locale)
- `/fr/about` (other locales)

### 'never'
No locale prefixes, detection via cookie/header:
- `/about` (all languages)

## Initialization

Initialize config in your root layout:

```typescript
// app/[locale]/layout.tsx
import { setI18nConfig } from '@zoyth/simple-site-framework/lib/i18n';
import { i18nConfig } from '../../config/i18n';

setI18nConfig(i18nConfig);
```

## See Also

- [Routing](./routing.md)
- [Locale Detection](./locale-detection.md)
- [Configuration Guide](../../i18n/CONFIGURATION.md)
