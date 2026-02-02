// ABOUTME: Utilities for persisting user locale preference via cookies
// ABOUTME: Allows remembering language choice across sessions

import { getLocaleCookieConfig, isSupportedLocale } from './config';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Get locale from cookie
 * Returns null if cookie not found or locale not supported
 */
export function getLocaleFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  // Safe: only runs in browser, but check config anyway for build safety
  try {
    const cookieConfig = getLocaleCookieConfig();
    const cookieName = cookieConfig.name;

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${cookieName}=`));

  if (!cookie) return null;

  const value = cookie.split('=')[1];

    // Validate that locale is supported
    if (isSupportedLocale(value)) {
      return value;
    }

    return null;
  } catch (error) {
    // Config not initialized - return null
    if (process.env.NODE_ENV !== 'production') {
      console.warn('getLocaleFromCookie: i18n config not initialized');
    }
    return null;
  }
}

/**
 * Set locale cookie
 * Uses configuration from i18n config
 */
export function setLocaleCookie(locale: string) {
  if (typeof document === 'undefined') return;

  try {
    // Validate locale is supported before setting
    if (!isSupportedLocale(locale)) {
      console.warn(`Attempted to set unsupported locale: ${locale}`);
      return;
    }

    const cookieConfig = getLocaleCookieConfig();

    document.cookie = `${cookieConfig.name}=${locale}; max-age=${cookieConfig.maxAge}; path=/; SameSite=${cookieConfig.sameSite}`;
  } catch (error) {
    // Config not initialized - fail silently
    if (process.env.NODE_ENV !== 'production') {
      console.warn('setLocaleCookie: i18n config not initialized');
    }
  }
}
