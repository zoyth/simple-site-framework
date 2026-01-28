// ABOUTME: Utilities for persisting user locale preference via cookies
// ABOUTME: Allows remembering language choice across sessions

import { type Locale } from './config';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export function getLocaleFromCookie(): Locale | null {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`));

  if (!cookie) return null;

  const value = cookie.split('=')[1] as Locale;
  return value === 'fr' || value === 'en' ? value : null;
}

export function setLocaleCookie(locale: Locale) {
  if (typeof document === 'undefined') return;

  // Set cookie for 1 year
  const maxAge = 365 * 24 * 60 * 60;
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; max-age=${maxAge}; path=/; SameSite=Lax`;
}
