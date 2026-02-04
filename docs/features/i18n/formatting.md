# Locale-Aware Formatting

Format dates, numbers, and currency based on user's locale.

## Date Formatting

Format dates according to locale conventions:

```typescript
import { formatDate } from '@zoyth/simple-site-framework/lib/i18n';

const date = new Date('2024-12-25');

formatDate(date, 'en'); // "12/25/2024"
formatDate(date, 'fr'); // "25/12/2024"
formatDate(date, 'de'); // "25.12.2024"

// With options
formatDate(date, 'en', {
  dateStyle: 'long',
}); // "December 25, 2024"

formatDate(date, 'fr', {
  dateStyle: 'long',
}); // "25 décembre 2024"
```

## Number Formatting

Format numbers with locale-specific separators:

```typescript
import { formatNumber } from '@zoyth/simple-site-framework/lib/i18n';

const number = 1234567.89;

formatNumber(number, 'en'); // "1,234,567.89"
formatNumber(number, 'fr'); // "1 234 567,89"
formatNumber(number, 'de'); // "1.234.567,89"

// With options
formatNumber(number, 'en', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}); // "1,234,567.89"
```

## Currency Formatting

Format currency amounts:

```typescript
import { formatCurrency } from '@zoyth/simple-site-framework/lib/i18n';

const amount = 1234.56;

formatCurrency(amount, 'en', 'USD'); // "$1,234.56"
formatCurrency(amount, 'fr', 'EUR'); // "1 234,56 €"
formatCurrency(amount, 'de', 'EUR'); // "1.234,56 €"
formatCurrency(amount, 'ja', 'JPY'); // "¥1,235"

// With options
formatCurrency(amount, 'en', 'USD', {
  currencyDisplay: 'name',
}); // "1,234.56 US dollars"
```

## Relative Time Formatting

Format relative time periods:

```typescript
import { formatRelativeTime } from '@zoyth/simple-site-framework/lib/i18n';

formatRelativeTime(-1, 'day', 'en'); // "1 day ago"
formatRelativeTime(-1, 'day', 'fr'); // "il y a 1 jour"
formatRelativeTime(2, 'week', 'en'); // "in 2 weeks"
formatRelativeTime(2, 'week', 'es'); // "dentro de 2 semanas"
```

## List Formatting

Format lists according to locale:

```typescript
const items = ['Apple', 'Banana', 'Orange'];

new Intl.ListFormat('en').format(items);
// "Apple, Banana, and Orange"

new Intl.ListFormat('fr').format(items);
// "Apple, Banana et Orange"

new Intl.ListFormat('es', { type: 'disjunction' }).format(items);
// "Apple, Banana o Orange"
```

## Intl API Reference

All formatters use the native JavaScript Intl API:

- `Intl.DateTimeFormat` - Date/time formatting
- `Intl.NumberFormat` - Number/currency formatting
- `Intl.RelativeTimeFormat` - Relative time formatting
- `Intl.ListFormat` - List formatting

## Usage in Components

Example with formatted dates:

```typescript
import { formatDate } from '@zoyth/simple-site-framework/lib/i18n';

export function BlogPost({ date, locale }: Props) {
  const formattedDate = formatDate(date, locale, {
    dateStyle: 'long',
  });

  return (
    <article>
      <time dateTime={date.toISOString()}>
        {formattedDate}
      </time>
    </article>
  );
}
```

## See Also

- [Translations](./translations.md)
- [Configuration](./configuration.md)
- [MDN Intl Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
