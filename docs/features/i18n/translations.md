# Managing Translations

Organize and manage translated content across multiple languages.

## LocalizedString Type

The core type for translated content:

```typescript
type LocalizedString = {
  [locale: string]: string;
};
```

## Usage in Components

All framework components accept LocalizedString:

```typescript
const content = {
  heading: {
    en: 'Welcome to Our Site',
    fr: 'Bienvenue sur notre site',
    es: 'Bienvenido a nuestro sitio',
  },
  description: {
    en: 'Professional services for your business',
    fr: 'Services professionnels pour votre entreprise',
    es: 'Servicios profesionales para su negocio',
  },
};

<HeroSection
  heading={content.heading}
  description={content.description}
  locale={locale}
/>
```

## Translation Organization

### Option 1: Configuration Files

```typescript
// config/translations/en.ts
export const en = {
  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
  },
  hero: {
    title: 'Welcome',
    subtitle: 'Professional services',
  },
};

// config/translations/fr.ts
export const fr = {
  nav: {
    home: 'Accueil',
    about: 'À propos',
    services: 'Services',
    contact: 'Contact',
  },
  hero: {
    title: 'Bienvenue',
    subtitle: 'Services professionnels',
  },
};
```

### Option 2: Inline LocalizedStrings

```typescript
const translations = {
  title: { en: 'Welcome', fr: 'Bienvenue', es: 'Bienvenido' },
  button: { en: 'Get Started', fr: 'Commencer', es: 'Comenzar' },
};
```

### Option 3: JSON Translation Files

```json
// locales/en.json
{
  "home": {
    "hero": {
      "title": "Welcome",
      "subtitle": "Professional services"
    }
  }
}
```

## Helper Utilities

### getLocalizedString

Extract string for specific locale:

```typescript
import { getLocalizedString } from '@zoyth/simple-site-framework/lib/i18n';

const heading = { en: 'Welcome', fr: 'Bienvenue' };
const text = getLocalizedString(heading, 'fr'); // 'Bienvenue'
```

### Fallback Behavior

1. Requested locale
2. Default locale
3. First available translation
4. Empty string

## Best Practices

- Keep translations co-located with components when possible
- Use TypeScript to ensure translation completeness
- Provide default locale translation for all strings
- Consider using a translation management service for large projects
- Validate translations at build time

## See Also

- [Configuration](./configuration.md)
- [LocalizedString Type](../../api-reference/types.md)
- [Translation Examples](../../i18n/EXAMPLES.md)
