// ABOUTME: Content utility functions
// ABOUTME: Helpers for working with localized content

/**
 * Helper to get localized string from content
 */
export function getLocalizedString(
  localizedString: { [locale: string]: string },
  locale: string
): string {
  return localizedString[locale] || localizedString['en'] || '';
}
