// ABOUTME: Slug translation mappings for bilingual routing
// ABOUTME: Maps French slugs to English equivalents and vice versa

import type { SlugTranslations } from './types';
import { getI18nConfig } from './config';

// Re-export for backward compatibility
export type { SlugTranslations };

/**
 * @deprecated These site-specific translations are no longer used internally.
 * Each site should declare its own translations via i18nConfig.slugTranslations.
 * This export will be removed in a future major version.
 */
export const defaultSlugTranslations: SlugTranslations = {
  fr: {
    '/marketing-par-courriel': '/email-marketing',
    '/courriels-transactionnels': '/transactional-emails',
    '/forfaits': '/pricing',
    '/nous-contacter': '/contact',
    '/a-propos': '/about',
    '/politique-de-confidentialite': '/privacy-policy',
    '/conditions-dutilisation': '/terms-of-service',
    '/politique-anti-pourriel': '/anti-spam-policy',
  },
  en: {
    '/email-marketing': '/marketing-par-courriel',
    '/transactional-emails': '/courriels-transactionnels',
    '/pricing': '/forfaits',
    '/contact': '/nous-contacter',
    '/about': '/a-propos',
    '/privacy-policy': '/politique-de-confidentialite',
    '/terms-of-service': '/conditions-dutilisation',
    '/anti-spam-policy': '/politique-anti-pourriel',
  },
};

/**
 * Translates a path from one locale to another
 *
 * Merges translations in this priority order:
 * 1. Custom translations passed as parameter (highest priority)
 * 2. Translations from i18n config (if configured)
 *
 * If no translations are configured, the path passes through unchanged.
 *
 * @param path - The current path (without locale prefix)
 * @param fromLocale - The current locale
 * @param toLocale - The target locale
 * @param customTranslations - Optional custom translations to merge with defaults
 * @returns The translated path
 *
 * @example
 * ```typescript
 * // With config translations
 * translateSlug('/about', 'en', 'fr')
 * // Returns: '/a-propos' (from config or defaults)
 *
 * // With custom override
 * translateSlug('/about', 'en', 'fr', {
 *   en: { '/about': '/notre-equipe' }
 * })
 * // Returns: '/notre-equipe' (custom override)
 *
 * // Nested paths
 * translateSlug('/about/team', 'en', 'fr')
 * // Returns: '/a-propos/team' (translates base, keeps rest)
 * ```
 */
export function translateSlug(
  path: string,
  fromLocale: string,
  toLocale: string,
  customTranslations?: SlugTranslations
): string {
  // Get config translations (returns safe defaults if not initialized)
  let configTranslations: SlugTranslations = {};
  try {
    const config = getI18nConfig();
    configTranslations = config.slugTranslations || {};
  } catch {
    // Config not available, use empty
  }

  // Merge translations: custom > config (no hardcoded defaults)
  const translations = mergeTranslations(
    configTranslations,
    customTranslations || {}
  );

  // Get the translation map for the source locale
  const translationMap = translations[fromLocale];

  if (!translationMap) {
    return path; // No translations for this locale, return original
  }

  // Check if we have a direct translation
  if (translationMap[path]) {
    return translationMap[path];
  }

  // Check for nested paths (e.g., /marketing-par-courriel/feature)
  for (const [fromSlug, toSlug] of Object.entries(translationMap)) {
    if (path.startsWith(fromSlug + '/')) {
      // Replace the base slug and keep the rest of the path
      return path.replace(fromSlug, toSlug);
    }
  }

  // No translation found, return original path
  return path;
}

/**
 * Merge multiple slug translation objects
 * Later objects take precedence over earlier ones
 */
function mergeTranslations(...translations: SlugTranslations[]): SlugTranslations {
  const merged: SlugTranslations = {};

  for (const trans of translations) {
    for (const [locale, slugs] of Object.entries(trans)) {
      if (!merged[locale]) {
        merged[locale] = {};
      }
      Object.assign(merged[locale], slugs);
    }
  }

  return merged;
}
