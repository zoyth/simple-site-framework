// ABOUTME: i18n configuration export
// ABOUTME: Export i18n types and configuration

export { locales, defaultLocale } from './config';
export type { Locale } from './config';
export { getLocaleFromCookie, setLocaleCookie, LOCALE_COOKIE_NAME } from './locale-cookie';
