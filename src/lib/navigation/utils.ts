// ABOUTME: Navigation utility functions
// ABOUTME: Helpers for working with localized navigation and string placeholders

/**
 * Helper to get localized string from navigation
 */
export function getNavigationString(
  localizedString: { [locale: string]: string },
  locale: string
): string {
  return localizedString[locale] || localizedString['en'] || '';
}

/**
 * Helper to replace placeholders in strings
 */
export function replaceVariables(
  text: string,
  variables: Record<string, string>
): string {
  let result = text;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, value);
  });
  return result;
}
