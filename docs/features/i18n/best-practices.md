# i18n Best Practices

Guidelines and patterns for effective internationalization.

## Planning

### Choose Locales Carefully

- Start with languages your target audience actually speaks
- Consider regional variants (en-US vs en-GB, fr-FR vs fr-CA)
- Don't add languages you can't properly maintain

### URL Structure

Choose the right `localePrefix` mode:

- **'as-needed'** (Recommended) - Clean default locale URLs, prefixed alternatives
- **'always'** - Explicit language in all URLs, equal treatment
- **'never'** - Simplest URLs, harder to share specific language links

## Content Management

### Keep Translations Complete

Ensure all locales have translations:

```typescript
// ✅ Good - All locales covered
const heading = {
  en: 'Welcome',
  fr: 'Bienvenue',
  es: 'Bienvenido',
};

// ❌ Bad - Missing Spanish
const heading = {
  en: 'Welcome',
  fr: 'Bienvenue',
};
```

### Use TypeScript for Safety

Define translation keys with types:

```typescript
type TranslationKeys = {
  heading: LocalizedString;
  description: LocalizedString;
  cta: LocalizedString;
};

const translations: TranslationKeys = {
  heading: { en: '...', fr: '...' },
  description: { en: '...', fr: '...' },
  cta: { en: '...', fr: '...' },
};
```

### Organize Translations

Group by feature or page:

```
config/translations/
  ├── common.ts       # Shared across site
  ├── navigation.ts   # Nav, footer links
  ├── home.ts         # Homepage
  ├── about.ts        # About page
  └── services.ts     # Services page
```

## SEO Optimization

### Use hreflang Tags

Framework automatically generates hreflang tags via I18nMetaTags:

```typescript
import { I18nMetaTags } from '@zoyth/simple-site-framework/components';

<I18nMetaTags
  currentLocale={locale}
  pathname={pathname}
  baseUrl="https://example.com"
/>
```

### Separate Sitemaps

Generate sitemap per locale or include all in one with locale information.

### Canonical URLs

Set canonical URLs correctly for each locale variant.

## Performance

### Static Generation

Pre-generate all locale variants:

```typescript
export async function generateStaticParams() {
  const locales = ['en', 'fr', 'es'];

  return locales.map(locale => ({ locale }));
}
```

### Code Splitting

Split translations by page to reduce bundle size:

```typescript
// Load translations on-demand
const translations = await import(`./translations/${locale}.ts`);
```

### Avoid Over-Translation

Don't translate:
- Brand names
- Product names (unless officially localized)
- Technical terms without clear equivalents
- Code examples

## User Experience

### Language Detection

- Enable browser detection for first visit
- Store preference in cookie
- Allow manual override via LanguageSelector
- Don't force redirects on every visit

### Language Switcher Placement

Place LanguageSelector where users expect it:
- Header (top-right is common)
- Footer
- Mobile menu

### Preserve Context

When switching languages:
```typescript
// ✅ Good - Stay on same page
/en/about → /fr/about

// ❌ Bad - Go to homepage
/en/about → /fr/
```

## Content Guidelines

### Avoid Concatenation

```typescript
// ❌ Bad - Word order varies by language
const message = `${userName} ${action} ${item}`;

// ✅ Good - Full sentence per locale
const message = {
  en: `${userName} purchased ${item}`,
  fr: `${userName} a acheté ${item}`,
};
```

### Handle Pluralization

Different languages have different plural rules:

```typescript
const itemCount = {
  en: count === 1 ? '1 item' : `${count} items`,
  fr: count <= 1 ? '1 article' : `${count} articles`,
  ar: /* Arabic has 6 plural forms! */
};
```

Consider using a library like `react-intl` for complex pluralization.

### Date and Time Clarity

Always use locale-aware formatting:

```typescript
import { formatDate } from '@zoyth/simple-site-framework/lib/i18n';

formatDate(date, locale, { dateStyle: 'long' });
```

## Testing

### Test All Locales

- Navigate through site in each locale
- Test forms and validation messages
- Verify date/number formatting
- Check layout with longer translations (German often longer than English)
- Test RTL languages if supported

### Automated Testing

```typescript
describe('i18n', () => {
  const locales = ['en', 'fr', 'es'];

  locales.forEach(locale => {
    it(`renders ${locale} homepage`, () => {
      // Test each locale
    });
  });
});
```

## Maintenance

### Version Control

Track translations in git alongside code:
- Easy to review changes
- See translation history
- Merge conflicts are manageable

### Translation Workflow

1. Develop feature in default locale
2. Extract translatable strings
3. Send to translators
4. Review and integrate translations
5. Test all locales
6. Deploy

### Professional Translation

For production sites:
- Use professional translators
- Avoid machine translation for customer-facing content
- Consider translation management platforms
- Review translations in context

## Common Pitfalls

### Don't Assume English

Framework doesn't assume English as default - you choose the default locale.

### Don't Hardcode Strings

```typescript
// ❌ Bad
<button>Click here</button>

// ✅ Good
<button>{buttonText}</button>
```

### Don't Skip Metadata

Translate:
- Page titles
- Meta descriptions
- Alt text for images
- Form labels and errors
- Button text

## See Also

- [Configuration](./configuration.md)
- [Translations](./translations.md)
- [SEO Guide](../seo/best-practices.md)
