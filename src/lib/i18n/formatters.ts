// ABOUTME: Locale-aware formatting utilities using native Intl API
// ABOUTME: Date, number, currency, and relative time formatters for internationalization

/**
 * Format a date according to locale
 *
 * @param date - Date to format
 * @param locale - Locale code (e.g., 'en', 'fr', 'es')
 * @param options - Intl.DateTimeFormat options
 *
 * @example
 * ```typescript
 * formatDate(new Date('2026-02-01'), 'fr', { dateStyle: 'long' })
 * // "1 février 2026"
 *
 * formatDate(new Date('2026-02-01'), 'en', { dateStyle: 'long' })
 * // "February 1, 2026"
 *
 * formatDate(new Date(), 'fr', {
 *   weekday: 'long',
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric'
 * })
 * // "samedi 1 février 2026"
 * ```
 */
export function formatDate(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format a number according to locale
 *
 * @param value - Number to format
 * @param locale - Locale code
 * @param options - Intl.NumberFormat options
 *
 * @example
 * ```typescript
 * formatNumber(1234567.89, 'en')
 * // "1,234,567.89"
 *
 * formatNumber(1234567.89, 'fr')
 * // "1 234 567,89"
 *
 * formatNumber(0.42, 'en', { style: 'percent' })
 * // "42%"
 *
 * formatNumber(1234, 'en', { minimumFractionDigits: 2 })
 * // "1,234.00"
 * ```
 */
export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a currency amount according to locale
 *
 * @param amount - Amount to format
 * @param locale - Locale code
 * @param currency - ISO 4217 currency code (e.g., 'USD', 'EUR', 'CAD')
 * @param options - Additional Intl.NumberFormat options
 *
 * @example
 * ```typescript
 * formatCurrency(1299.99, 'en', 'USD')
 * // "$1,299.99"
 *
 * formatCurrency(1299.99, 'fr', 'EUR')
 * // "1 299,99 €"
 *
 * formatCurrency(1299.99, 'fr-CA', 'CAD')
 * // "1 299,99 $"
 *
 * formatCurrency(1299.99, 'ja', 'JPY')
 * // "¥1,300"
 *
 * formatCurrency(0.99, 'en', 'USD', { currencyDisplay: 'name' })
 * // "0.99 US dollars"
 * ```
 */
export function formatCurrency(
  amount: number,
  locale: string,
  currency: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(amount);
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 *
 * @param value - Numeric value (negative for past, positive for future)
 * @param unit - Time unit
 * @param locale - Locale code
 * @param options - Intl.RelativeTimeFormat options
 *
 * @example
 * ```typescript
 * formatRelativeTime(-2, 'hour', 'en')
 * // "2 hours ago"
 *
 * formatRelativeTime(-2, 'hour', 'fr')
 * // "il y a 2 heures"
 *
 * formatRelativeTime(3, 'day', 'en')
 * // "in 3 days"
 *
 * formatRelativeTime(-1, 'week', 'es')
 * // "hace 1 semana"
 *
 * formatRelativeTime(-5, 'minute', 'en', { numeric: 'auto' })
 * // "5 minutes ago"
 * ```
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string,
  options?: Intl.RelativeTimeFormatOptions
): string {
  return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
}

/**
 * Format a date range according to locale
 * Note: formatRange requires newer TypeScript/Node versions
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param locale - Locale code
 * @param options - Intl.DateTimeFormat options
 *
 * @example
 * ```typescript
 * formatDateRange(
 *   new Date('2026-02-01'),
 *   new Date('2026-02-15'),
 *   'en',
 *   { month: 'long', day: 'numeric' }
 * )
 * // "February 1 – 15"
 * ```
 */
export function formatDateRange(
  startDate: Date,
  endDate: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const formatter = new Intl.DateTimeFormat(locale, options);
  // Use formatRange if available, otherwise format separately
  if ('formatRange' in formatter) {
    return (formatter as any).formatRange(startDate, endDate);
  }
  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

/**
 * Format a list of items according to locale
 * Falls back to simple comma-separated list if Intl.ListFormat not available
 *
 * @param items - Array of items to format
 * @param locale - Locale code
 *
 * @example
 * ```typescript
 * formatList(['apples', 'oranges', 'bananas'], 'en')
 * // "apples, oranges, and bananas"
 *
 * formatList(['pommes', 'oranges', 'bananes'], 'fr')
 * // "pommes, oranges et bananes"
 * ```
 */
export function formatList(
  items: string[],
  locale: string
): string {
  // Check if Intl.ListFormat is available
  if (typeof Intl !== 'undefined' && 'ListFormat' in Intl) {
    return new (Intl as any).ListFormat(locale).format(items);
  }

  // Fallback for older environments
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) {
    const connector = locale === 'fr' ? ' et ' : ' and ';
    return items.join(connector);
  }

  const last = items[items.length - 1];
  const rest = items.slice(0, -1);
  const connector = locale === 'fr' ? ' et ' : ', and ';
  return rest.join(', ') + connector + last;
}

/**
 * Format file size in bytes to human-readable format
 * Not using Intl, but useful for internationalized apps
 *
 * @param bytes - File size in bytes
 * @param locale - Locale code
 * @param decimals - Number of decimal places @default 2
 *
 * @example
 * ```typescript
 * formatFileSize(1024, 'en')
 * // "1.00 KB"
 *
 * formatFileSize(1048576, 'fr')
 * // "1,00 Mo"
 *
 * formatFileSize(1073741824, 'en', 1)
 * // "1.0 GB"
 * ```
 */
export function formatFileSize(
  bytes: number,
  locale: string,
  decimals: number = 2
): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${formatNumber(value, locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} ${sizes[i]}`;
}

/**
 * Get relative time from a date (auto-selects best unit)
 *
 * @param date - Date to compare against now
 * @param locale - Locale code
 * @param options - Intl.RelativeTimeFormat options
 *
 * @example
 * ```typescript
 * // If date is 2 hours ago
 * getRelativeTime(pastDate, 'en')
 * // "2 hours ago"
 *
 * // If date is 3 days from now
 * getRelativeTime(futureDate, 'en')
 * // "in 3 days"
 *
 * // If date is 45 seconds ago
 * getRelativeTime(recentDate, 'fr')
 * // "il y a 45 secondes"
 * ```
 */
export function getRelativeTime(
  date: Date,
  locale: string,
  options?: Intl.RelativeTimeFormatOptions
): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffWeeks = Math.round(diffDays / 7);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  if (Math.abs(diffSecs) < 60) {
    return formatRelativeTime(diffSecs, 'second', locale, options);
  } else if (Math.abs(diffMins) < 60) {
    return formatRelativeTime(diffMins, 'minute', locale, options);
  } else if (Math.abs(diffHours) < 24) {
    return formatRelativeTime(diffHours, 'hour', locale, options);
  } else if (Math.abs(diffDays) < 7) {
    return formatRelativeTime(diffDays, 'day', locale, options);
  } else if (Math.abs(diffWeeks) < 4) {
    return formatRelativeTime(diffWeeks, 'week', locale, options);
  } else if (Math.abs(diffMonths) < 12) {
    return formatRelativeTime(diffMonths, 'month', locale, options);
  } else {
    return formatRelativeTime(diffYears, 'year', locale, options);
  }
}
