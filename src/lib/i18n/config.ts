// ABOUTME: Dynamic i18n configuration system for flexible multi-language support
// ABOUTME: Projects must call setI18nConfig() to initialize their locale configuration

import type { I18nConfig, LocalePrefix } from './types';

// globalThis key for cross-bundle singleton. When tsup produces separate bundles
// (splitting: false), each gets its own module scope. Using globalThis ensures
// setI18nConfig() from the main entry is visible to components from the
// components entry.
const CONFIG_KEY = '__ssf_i18n_config__';

function getGlobalConfig(): I18nConfig | null {
  return (globalThis as Record<string, any>)[CONFIG_KEY] ?? null;
}

function setGlobalConfig(config: I18nConfig | null): void {
  (globalThis as Record<string, any>)[CONFIG_KEY] = config;
}

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

  setGlobalConfig(configWithDefaults);
}

/**
 * Get the current i18n configuration
 * Returns legacy default config if not initialized (for build compatibility)
 *
 * @deprecated Calling without initialization - will throw in v1.0.0
 */
export function getI18nConfig(): I18nConfig {
  if (!getGlobalConfig()) {
    // During static generation, config may not be initialized yet
    // Return legacy defaults to allow build to complete
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '⚠️  i18n configuration not initialized. Using legacy defaults.\n' +
        'Call setI18nConfig() in your layout before using i18n features.\n' +
        'See docs/i18n/MIGRATION.md for setup instructions.'
      );
    }

    // Return legacy hardcoded config for backward compatibility
    return {
      locales: ['fr', 'en'],
      defaultLocale: 'fr',
      localePrefix: 'as-needed',
      localeDetection: true,
      localeNames: { fr: 'Français', en: 'English' },
      localeLabels: { fr: 'FR', en: 'EN' },
      rtlLocales: [],
      localeCookie: {
        name: 'NEXT_LOCALE',
        maxAge: 365 * 24 * 60 * 60,
        sameSite: 'lax',
      },
      slugTranslations: {},
    };
  }

  return getGlobalConfig()!;
}

/**
 * Check if i18n config has been initialized
 */
export function isI18nConfigInitialized(): boolean {
  return getGlobalConfig() !== null;
}

/**
 * Reset i18n configuration (for testing only)
 * @internal
 */
export function __resetI18nConfig__(): void {
  setGlobalConfig(null);
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
// ====================================

/**
 * @deprecated Use getLocales() instead
 */
export const locales = ['fr', 'en'] as const;

/** Locale identifier — any string matching a configured locale */
export type Locale = string;

/**
 * @deprecated Use getDefaultLocale() instead
 */
export const defaultLocale = 'fr';

/**
 * @deprecated Use getLocaleNames() instead
 */
export const localeNames: Record<string, string> = {
  fr: 'Français',
  en: 'English',
};

/**
 * @deprecated Use getLocaleLabels() instead
 */
export const localeLabels: Record<string, string> = {
  fr: 'FR',
  en: 'EN',
};
