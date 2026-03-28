// ABOUTME: Middleware factory for automatic locale detection and routing
// ABOUTME: Handles URL rewriting, redirects, and cookie persistence based on prefix mode

import { NextRequest, NextResponse } from 'next/server';
import type { I18nConfig } from './types';

/**
 * Create Next.js middleware for i18n routing
 *
 * @param config - i18n configuration
 * @returns Middleware function
 *
 * @example
 * ```typescript
 * // middleware.ts
 * import { createI18nMiddleware } from 'simple-site-framework/lib/i18n';
 * import { i18nConfig } from './src/config/i18n';
 *
 * export default createI18nMiddleware(i18nConfig);
 *
 * export const config = {
 *   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
 * };
 * ```
 *
 * For Next.js 16+ (proxy convention):
 * ```typescript
 * // proxy.ts
 * import { createI18nProxy } from 'simple-site-framework/lib/i18n';
 * import { i18nConfig } from './src/config/i18n';
 *
 * export default createI18nProxy(i18nConfig);
 *
 * export const config = {
 *   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
 * };
 * ```
 */
export function createI18nMiddleware(config: I18nConfig) {
  return function proxy(request: NextRequest): NextResponse {
    const { pathname } = request.nextUrl;

    // 1. Extract locale from URL pathname
    const pathnameLocale = getLocaleFromPathname(pathname, config);

    // 2. If locale found in URL, validate it
    if (pathnameLocale) {
      if (!config.locales.includes(pathnameLocale)) {
        // Invalid locale in URL, redirect to default
        return redirectToLocale(request, config.defaultLocale, pathname, config);
      }

      // Valid locale in URL, set cookie and continue
      const response = NextResponse.next();
      setLocaleCookie(response, pathnameLocale, config);
      return response;
    }

    // 3. No locale in URL, detect from browser/cookie
    const detectedLocale = detectLocale(request, config);

    // 4. Handle based on prefix mode
    const prefixMode = config.localePrefix || 'as-needed';

    if (prefixMode === 'always') {
      // Always redirect to add locale prefix
      return redirectToLocale(request, detectedLocale, pathname, config);
    } else if (prefixMode === 'as-needed') {
      // Only redirect if detected locale is NOT the default
      if (detectedLocale !== config.defaultLocale) {
        return redirectToLocale(request, detectedLocale, pathname, config);
      }
      // Default locale, continue without redirect but set cookie
      const response = NextResponse.next();
      setLocaleCookie(response, config.defaultLocale, config);
      return response;
    } else {
      // 'never' mode: no redirects, just set cookie
      const response = NextResponse.next();
      setLocaleCookie(response, detectedLocale, config);
      return response;
    }
  };
}

/**
 * Extract locale from URL pathname
 * Returns null if no locale found
 */
function getLocaleFromPathname(pathname: string, config: I18nConfig): string | null {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const firstSegment = segments[0];

  // Check if first segment matches a supported locale
  if (config.locales.includes(firstSegment)) {
    return firstSegment;
  }

  return null;
}

/**
 * Detect locale from cookie and Accept-Language header
 * Falls back to default locale
 */
function detectLocale(request: NextRequest, config: I18nConfig): string {
  // 1. Check cookie first (user's explicit preference)
  const cookieName = config.localeCookie?.name || 'NEXT_LOCALE';
  const cookieLocale = request.cookies.get(cookieName)?.value;

  if (cookieLocale && config.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check Accept-Language header (browser preference)
  if (config.localeDetection !== false) {
    const acceptLanguage = request.headers.get('accept-language');
    const browserLocale = negotiateLanguage(acceptLanguage, config.locales);

    if (browserLocale) {
      return browserLocale;
    }
  }

  // 3. Fall back to default locale
  return config.defaultLocale;
}

/**
 * Negotiate language from Accept-Language header
 * Returns best match from supported locales, or null if no match
 *
 * @example
 * Accept-Language: fr-CA,fr;q=0.9,en;q=0.8
 * Supported: ['en', 'fr', 'es']
 * Result: 'fr' (highest quality match)
 */
function negotiateLanguage(
  acceptLanguage: string | null,
  supportedLocales: readonly string[]
): string | null {
  if (!acceptLanguage) {
    return null;
  }

  // Parse Accept-Language header into preferences
  const preferences = parseAcceptLanguage(acceptLanguage);

  // Find best match
  for (const pref of preferences) {
    // Exact match (e.g., 'en' matches 'en')
    if (supportedLocales.includes(pref.locale)) {
      return pref.locale;
    }

    // Language family match (e.g., 'en-US' matches 'en')
    const languageCode = pref.locale.split('-')[0];
    if (supportedLocales.includes(languageCode)) {
      return languageCode;
    }

    // Check if any supported locale starts with this language
    const match = supportedLocales.find(
      (locale) => locale.startsWith(languageCode + '-') || locale === languageCode
    );
    if (match) {
      return match;
    }
  }

  return null;
}

/**
 * Parse Accept-Language header into sorted preferences
 * Returns array sorted by quality value (highest first)
 */
interface LanguagePreference {
  locale: string;
  quality: number;
}

function parseAcceptLanguage(header: string): LanguagePreference[] {
  const preferences: LanguagePreference[] = [];

  // Split by comma and parse each preference
  const parts = header.split(',').map((p) => p.trim());

  for (const part of parts) {
    const [locale, ...rest] = part.split(';').map((p) => p.trim());

    // Extract quality value (default to 1.0)
    let quality = 1.0;
    const qParam = rest.find((p) => p.startsWith('q='));
    if (qParam) {
      const qValue = parseFloat(qParam.substring(2));
      if (!isNaN(qValue)) {
        quality = qValue;
      }
    }

    preferences.push({
      locale: locale.toLowerCase(),
      quality,
    });
  }

  // Sort by quality (highest first)
  preferences.sort((a, b) => b.quality - a.quality);

  return preferences;
}

/**
 * Redirect to URL with locale prefix
 */
function redirectToLocale(
  request: NextRequest,
  locale: string,
  pathname: string,
  config: I18nConfig
): NextResponse {
  const url = request.nextUrl.clone();

  // Remove any existing locale prefix
  const pathWithoutLocale = removeLocalePrefix(pathname, config);

  // Build new pathname with locale
  url.pathname = `/${locale}${pathWithoutLocale}`;

  const response = NextResponse.redirect(url);
  setLocaleCookie(response, locale, config);

  return response;
}

/**
 * Remove locale prefix from pathname if present
 */
function removeLocalePrefix(pathname: string, config: I18nConfig): string {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return '/';
  }

  const firstSegment = segments[0];

  if (config.locales.includes(firstSegment)) {
    // Remove locale segment
    const remaining = segments.slice(1);
    return remaining.length > 0 ? `/${remaining.join('/')}` : '/';
  }

  return pathname;
}

/**
 * Set locale cookie on response
 */
function setLocaleCookie(
  response: NextResponse,
  locale: string,
  config: I18nConfig
): void {
  const cookieConfig = config.localeCookie || {};

  response.cookies.set({
    name: cookieConfig.name || 'NEXT_LOCALE',
    value: locale,
    maxAge: cookieConfig.maxAge || 365 * 24 * 60 * 60, // 1 year
    path: '/',
    sameSite: cookieConfig.sameSite || 'lax',
  });
}

/** Alias for Next.js 16+ proxy convention. Identical to createI18nMiddleware. */
export const createI18nProxy = createI18nMiddleware;
