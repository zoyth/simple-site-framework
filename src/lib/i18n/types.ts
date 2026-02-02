// ABOUTME: Core TypeScript type definitions for i18n configuration system
// ABOUTME: Defines interfaces for locale management, routing modes, and cookie settings

/**
 * Locale prefix mode determines how locale appears in URLs
 *
 * - 'always': All routes have locale prefix (/en/about, /fr/about)
 * - 'as-needed': Only non-default locales have prefix (/about, /fr/about)
 * - 'never': No locale prefixes, detection via cookie/header only
 */
export type LocalePrefix = 'always' | 'as-needed' | 'never';

/**
 * Cookie configuration for locale persistence
 */
export interface LocaleCookieConfig {
  /** Cookie name @default 'NEXT_LOCALE' */
  name?: string;
  /** Cookie max age in seconds @default 31536000 (1 year) */
  maxAge?: number;
  /** Cookie SameSite attribute @default 'lax' */
  sameSite?: 'lax' | 'strict' | 'none';
}

/**
 * Slug translations mapping for bilingual/multilingual routes
 * Maps slugs from one locale to another
 *
 * @example
 * {
 *   fr: {
 *     '/a-propos': '/about',
 *     '/nous-contacter': '/contact'
 *   },
 *   en: {
 *     '/about': '/a-propos',
 *     '/contact': '/nous-contacter'
 *   }
 * }
 */
export interface SlugTranslations {
  [locale: string]: {
    [slug: string]: string;
  };
}

/**
 * Complete i18n configuration for a project
 *
 * @example
 * ```typescript
 * export const i18nConfig: I18nConfig = {
 *   locales: ['en', 'fr', 'es'],
 *   defaultLocale: 'en',
 *   localePrefix: 'as-needed',
 *   localeDetection: true,
 *   localeNames: {
 *     en: 'English',
 *     fr: 'Français',
 *     es: 'Español'
 *   }
 * };
 * ```
 */
export interface I18nConfig {
  /**
   * Array of supported locale codes (ISO 639-1)
   * @example ['en', 'fr', 'es', 'de', 'ja']
   */
  locales: readonly string[];

  /**
   * Default locale to use when none is specified
   * Must be one of the locales in the locales array
   */
  defaultLocale: string;

  /**
   * Locale prefix mode for URL routing
   * @default 'as-needed'
   */
  localePrefix?: LocalePrefix;

  /**
   * Enable automatic locale detection from browser headers
   * @default true
   */
  localeDetection?: boolean;

  /**
   * Full locale names for display in UI
   * @example { en: 'English', fr: 'Français' }
   */
  localeNames?: Record<string, string>;

  /**
   * Short locale labels for compact display (e.g., language selector)
   * @example { en: 'EN', fr: 'FR' }
   */
  localeLabels?: Record<string, string>;

  /**
   * Locales that use right-to-left text direction
   * @example ['ar', 'he', 'fa']
   */
  rtlLocales?: readonly string[];

  /**
   * Cookie configuration for locale persistence
   */
  localeCookie?: LocaleCookieConfig;

  /**
   * Custom slug translations for multilingual routes
   * If not provided, no slug translation will occur
   */
  slugTranslations?: SlugTranslations;
}

/**
 * Type guard to validate locale string
 */
export type ValidLocale<T extends I18nConfig> = T['locales'][number];

/**
 * Type-safe localized string object
 * Maps locale codes to translated strings
 *
 * @example
 * const title: LocalizedString = {
 *   en: 'Welcome',
 *   fr: 'Bienvenue',
 *   es: 'Bienvenido'
 * };
 */
export interface LocalizedString {
  [locale: string]: string;
}

/**
 * Browser language preference with quality value (from Accept-Language header)
 */
export interface LanguagePreference {
  locale: string;
  quality: number;
}
