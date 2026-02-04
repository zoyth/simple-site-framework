# Locale Detection

Automatic language detection from browser, cookies, and URL.

## Detection Strategy

The middleware detects locale in this order:

1. **URL Parameter** - Explicit locale in path (`/fr/about`)
2. **Cookie** - Previously selected locale (`NEXT_LOCALE` cookie)
3. **Accept-Language Header** - Browser language preference
4. **Default Locale** - Configured fallback

## Browser Detection

Enable in configuration:

```typescript
export const i18nConfig = {
  locales: ['en', 'fr', 'es', 'de'],
  defaultLocale: 'en',
  localeDetection: true, // Enable browser detection
};
```

### Accept-Language Header

The framework parses the `Accept-Language` header:

```
Accept-Language: fr-CA,fr;q=0.9,en;q=0.8,de;q=0.5
```

Matches:
1. Exact match: `fr-CA` → `fr`
2. Language prefix: `fr` → `fr`
3. Quality values (q) determine priority
4. Fallback to default if no match

## Cookie Persistence

When user selects a language, it's stored in a cookie:

```typescript
// Cookie configuration
localeCookie: {
  name: 'NEXT_LOCALE',
  maxAge: 365 * 24 * 60 * 60, // 1 year
  sameSite: 'lax',
}
```

Cookie persists across:
- Browser sessions
- Different pages
- Returning visits

## Manual Cookie Setting

Set locale cookie programmatically:

```typescript
import { setLocaleCookie } from '@zoyth/simple-site-framework/lib/i18n';

function handleLanguageChange(locale: string) {
  setLocaleCookie(locale);
  // Navigate to new locale...
}
```

## Detection Flow

```
User visits site
     ↓
Check URL for locale
     ↓ (not found)
Check NEXT_LOCALE cookie
     ↓ (not found)
Parse Accept-Language header
     ↓ (no match)
Use default locale
     ↓
Redirect if needed (based on localePrefix mode)
     ↓
Set cookie with detected locale
```

## Disabling Detection

Disable automatic browser detection:

```typescript
export const i18nConfig = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localeDetection: false, // Disable
};
```

Users must explicitly select language via LanguageSelector.

## Testing Detection

Test different scenarios:

```bash
# Test with specific Accept-Language
curl -H "Accept-Language: fr-FR,fr;q=0.9" http://localhost:3000/

# Test with cookie
curl -H "Cookie: NEXT_LOCALE=es" http://localhost:3000/

# Test URL override
curl http://localhost:3000/de/
```

## See Also

- [Routing](./routing.md)
- [Configuration](./configuration.md)
- [LanguageSelector Component](../../components/layout/LanguageSelector.md)
