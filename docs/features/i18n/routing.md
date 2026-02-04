# Locale Routing

URL routing and navigation for multi-language sites.

## Route Structure

Based on your `localePrefix` configuration:

### 'as-needed' Mode (Default)
```
/                    → Default locale homepage
/about              → Default locale about page
/fr/                → French homepage
/fr/about           → French about page
```

### 'always' Mode
```
/en/                → English homepage
/en/about           → English about page
/fr/                → French homepage
/fr/about           → French about page
```

### 'never' Mode
```
/                    → Homepage (locale from cookie/header)
/about              → About page (locale from cookie/header)
```

## Middleware Setup

Create middleware for automatic routing:

```typescript
// src/middleware.ts
import { createI18nMiddleware } from '@zoyth/simple-site-framework/lib/i18n';
import { i18nConfig } from './config/i18n';

export default createI18nMiddleware(i18nConfig);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Navigation

### Using Next.js Link

```typescript
import Link from 'next/link';

// Same-locale navigation
<Link href="/about">About</Link>

// Cross-locale navigation
<Link href="/fr/about">À propos</Link>
```

### Language Switching

Use the LanguageSelector component:

```typescript
import { LanguageSelector } from '@zoyth/simple-site-framework/components';

<LanguageSelector currentLocale={locale} />
```

## Dynamic Routes

Handle dynamic routes with locale parameter:

```typescript
// app/[locale]/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const locales = ['en', 'fr'];
  const slugs = ['post-1', 'post-2'];

  return locales.flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  );
}
```

## Redirects

The middleware automatically:
1. Detects missing locale in URL
2. Determines user's preferred locale
3. Redirects to appropriate localized URL
4. Sets locale cookie for persistence

## See Also

- [Configuration](./configuration.md)
- [Locale Detection](./locale-detection.md)
- [Routing Examples](../../i18n/EXAMPLES.md)
