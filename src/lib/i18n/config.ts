// ABOUTME: Dynamic i18n configuration system for flexible multi-language support
// ABOUTME: Projects must call setI18nConfig() to initialize their locale configuration

import type { I18nConfig, LocalePrefix } from './types';

/**
 * Global i18n configuration state
 * Initialized by calling setI18nConfig()
 */
let globalI18nConfig: I18nConfig | null = null;

/**
 * Initialize the i18n configuration
 * Must be called before using any i18n features
 *
 * @param config - Complete i18n configuration
 *
 * @example
 * ```typescript
 * import { setI18nConfig } from 'simple-site-framework/lib/i18n';
 * import { i18nConfig } from './config/i18n';
 *
 * setI18nConfig(i18nConfig);
 * ```
 */
export function setI18nConfig(config: I18nConfig): void {
  // Validate configuration
  if (!config.locales || config.locales.length === 0) {
    throw new Error('i18n config must define at least one locale');
  }

  if (!config.defaultLocale) {
    throw new Error('i18n config must define a default locale');
  }

  if (!config.locales.includes(config.defaultLocale)) {
    throw new Error(
      `Default locale "${config.defaultLocale}" must be included in locales array: [${config.locales.join(', ')}]`
    );
  }

  // Set defaults for optional fields
  const configWithDefaults: I18nConfig = {
    ...config,
    localePrefix: config.localePrefix || 'as-needed',
    localeDetection: config.localeDetection !== false, // Default to true
    localeNames: config.localeNames || {},
    localeLabels: config.localeLabels || {},
    rtlLocales: config.rtlLocales || [],
    localeCookie: {
      name: config.localeCookie?.name || 'NEXT_LOCALE',
      maxAge: config.localeCookie?.maxAge || 365 * 24 * 60 * 60, // 1 year
      sameSite: config.localeCookie?.sameSite || 'lax',
    },
    slugTranslations: config.slugTranslations || {},
  };

  globalI18nConfig = configWithDefaults;
}

/**
 * Get the current i18n configuration
 * Throws if setI18nConfig() has not been called
 *
 * @throws {Error} If configuration not initialized
 */
export function getI18nConfig(): I18nConfig {
  if (!globalI18nConfig) {
    throw new Error(
      'i18n configuration not initialized. Call setI18nConfig() in your app before using i18n features.\n\n' +
      'Example:\n' +
      'import { setI18nConfig } from \'simple-site-framework/lib/i18n\';\n' +
      'import { i18nConfig } from \'./config/i18n\';\n\n' +
      'setI18nConfig(i18nConfig);'
    );
  }

  return globalI18nConfig;
}

/**
 * Check if i18n config has been initialized
 */
export function isI18nConfigInitialized(): boolean {
  return globalI18nConfig !== null;
}

/**
 * Reset i18n configuration (for testing only)
 * @internal
 */
export function __resetI18nConfig__(): void {
  globalI18nConfig = null;
}

/**
 * Get supported locales array
 */
export function getLocales(): readonly string[] {
  return getI18nConfig().locales;
}

/**
 * Get default locale
 */
export function getDefaultLocale(): string {
  return getI18nConfig().defaultLocale;
}

/**
 * Get locale prefix mode
 */
export function getLocalePrefix(): LocalePrefix {
  return getI18nConfig().localePrefix || 'as-needed';
}

/**
 * Get locale names mapping
 */
export function getLocaleNames(): Record<string, string> {
  return getI18nConfig().localeNames || {};
}

/**
 * Get locale labels mapping
 */
export function getLocaleLabels(): Record<string, string> {
  return getI18nConfig().localeLabels || {};
}

/**
 * Get RTL locales array
 */
export function getRtlLocales(): readonly string[] {
  return getI18nConfig().rtlLocales || [];
}

/**
 * Check if locale detection is enabled
 */
export function isLocaleDetectionEnabled(): boolean {
  return getI18nConfig().localeDetection !== false;
}

/**
 * Get locale cookie configuration
 */
export function getLocaleCookieConfig() {
  const config = getI18nConfig();
  return {
    name: config.localeCookie?.name || 'NEXT_LOCALE',
    maxAge: config.localeCookie?.maxAge || 365 * 24 * 60 * 60,
    sameSite: config.localeCookie?.sameSite || 'lax',
  };
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): boolean {
  return getLocales().includes(locale);
}

/**
 * Get full locale name for display
 */
export function getLocaleName(locale: string): string {
  const names = getLocaleNames();
  return names[locale] || locale;
}

/**
 * Get short locale label for compact display
 */
export function getLocaleLabel(locale: string): string {
  const labels = getLocaleLabels();
  return labels[locale] || locale.toUpperCase();
}

// ====================================
// Legacy exports for backward compatibility
// These will be removed in a future major version
// ====================================

/**
 * @deprecated Use getLocales() instead. This export will be removed in v1.0.0
 */
export const locales = ['fr', 'en'] as const;

/**
 * @deprecated Import from config schemas instead
 */
export type Locale = 'fr' | 'en';

/**
 * @deprecated Use getDefaultLocale() instead. This export will be removed in v1.0.0
 */
export const defaultLocale: Locale = 'fr';

/**
 * @deprecated Use getLocaleNames() instead. This export will be removed in v1.0.0
 */
export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

/**
 * @deprecated Use getLocaleLabels() instead. This export will be removed in v1.0.0
 */
export const localeLabels: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
};
