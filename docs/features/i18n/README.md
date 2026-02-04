# Internationalization (i18n)

Complete guide to multi-language support in Simple Site Framework.

## Overview

Simple Site Framework provides built-in internationalization (i18n) support for creating multi-language websites with:

- Configurable locale routing (always, as-needed, never)
- LocalizedString type for content translation
- Automatic language detection
- SEO-optimized language alternates
- RTL language support
- Locale-aware formatting (dates, numbers, currency)

## Quick Start

```typescript
// Configure locales
export const i18nConfig = {
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
};

// Use LocalizedString
const heading = {
  en: 'Welcome',
  fr: 'Bienvenue',
  es: 'Bienvenido',
};

<HeroSection heading={heading} locale={locale} />
```

## Topics

- [Configuration](./configuration.md) - Setting up i18n config
- [Routing](./routing.md) - Locale routing and URL structure
- [Translations](./translations.md) - Managing translated content
- [Locale Detection](./locale-detection.md) - Browser and cookie detection
- [Formatting](./formatting.md) - Date, number, currency formatting
- [RTL Support](./rtl-support.md) - Right-to-left language support
- [Best Practices](./best-practices.md) - i18n patterns and tips

## See Also

- [Internationalization Feature Guide](../internationalization.md)
- [LanguageSelector Component](../../components/layout/LanguageSelector.md)
- [I18nMetaTags Component](../../components/I18nMetaTags.md)
