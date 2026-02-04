# RTL (Right-to-Left) Support

Support for right-to-left languages like Arabic and Hebrew.

## Configuration

Specify RTL locales in configuration:

```typescript
export const i18nConfig = {
  locales: ['en', 'ar', 'he', 'fr'],
  defaultLocale: 'en',
  rtlLocales: ['ar', 'he'], // RTL languages
};
```

## HTML Direction Attribute

Set the `dir` attribute on the root HTML element:

```typescript
// app/[locale]/layout.tsx
import { getTextDirection } from '@zoyth/simple-site-framework/lib/i18n';

export default function RootLayout({ children, params }) {
  const { locale } = params;
  const direction = getTextDirection(locale);

  return (
    <html lang={locale} dir={direction}>
      <body>{children}</body>
    </html>
  );
}
```

This outputs:
- `<html dir="ltr">` for LTR languages (English, French, etc.)
- `<html dir="rtl">` for RTL languages (Arabic, Hebrew)

## Utility Functions

### isRtlLocale

Check if a locale is RTL:

```typescript
import { isRtlLocale } from '@zoyth/simple-site-framework/lib/i18n';

isRtlLocale('ar'); // true
isRtlLocale('he'); // true
isRtlLocale('en'); // false
isRtlLocale('fr'); // false
```

### getTextDirection

Get text direction for locale:

```typescript
import { getTextDirection } from '@zoyth/simple-site-framework/lib/i18n';

getTextDirection('ar'); // 'rtl'
getTextDirection('en'); // 'ltr'
```

## CSS Considerations

### Logical Properties

Use CSS logical properties for RTL compatibility:

```css
/* ✅ Good - RTL compatible */
.element {
  margin-inline-start: 1rem;
  padding-inline-end: 2rem;
  border-inline-start: 1px solid;
}

/* ❌ Bad - Not RTL compatible */
.element {
  margin-left: 1rem;
  padding-right: 2rem;
  border-left: 1px solid;
}
```

### Tailwind CSS

Tailwind v3+ supports RTL with logical properties:

```tsx
<div className="ms-4 pe-6">
  {/* margin-inline-start: 1rem, padding-inline-end: 1.5rem */}
</div>
```

Or use RTL variants:

```tsx
<div className="ml-4 rtl:mr-4 rtl:ml-0">
  {/* Margin left in LTR, margin right in RTL */}
</div>
```

## Component Adjustments

### Icons and Arrows

Flip directional icons in RTL:

```tsx
import { isRtlLocale } from '@zoyth/simple-site-framework/lib/i18n';

function NavigationArrow({ locale }: Props) {
  const isRtl = isRtlLocale(locale);

  return (
    <svg className={isRtl ? 'scale-x-[-1]' : ''}>
      {/* Arrow icon */}
    </svg>
  );
}
```

### Text Alignment

Adjust text alignment based on direction:

```tsx
<p className="text-start">
  {/* Aligns left in LTR, right in RTL */}
</p>
```

## Testing RTL

### Browser Testing

1. Add Arabic or Hebrew to your config
2. Switch to RTL locale via LanguageSelector
3. Verify layout mirrors correctly
4. Check navigation, forms, and interactive elements

### Development Tools

Chrome DevTools can force RTL:
1. Open DevTools
2. Rendering tab → Enable "Emulate RTL"

## Common RTL Issues

### Floats and Positioning

Use flexbox/grid instead of floats:

```css
/* ✅ Good */
.container {
  display: flex;
  justify-content: flex-start;
}

/* ❌ Avoid */
.container {
  float: left;
}
```

### Absolute Positioning

Use logical properties:

```css
/* ✅ Good */
.element {
  inset-inline-start: 0;
}

/* ❌ Avoid */
.element {
  left: 0;
}
```

## See Also

- [Configuration](./configuration.md)
- [CSS Logical Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [Tailwind RTL Support](https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support)
