// ABOUTME: Slug translation mappings for bilingual routing
// ABOUTME: Maps French slugs to English equivalents and vice versa

export interface SlugTranslations {
  [locale: string]: {
    [slug: string]: string;
  };
}

// Default slug translations - can be overridden by apps
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
 * @param path - The current path (without locale prefix)
 * @param fromLocale - The current locale
 * @param toLocale - The target locale
 * @param customTranslations - Optional custom translations to merge with defaults
 * @returns The translated path
 */
export function translateSlug(
  path: string,
  fromLocale: string,
  toLocale: string,
  customTranslations?: SlugTranslations
): string {
  // Merge custom translations with defaults
  const translations = customTranslations
    ? {
        ...defaultSlugTranslations,
        [fromLocale]: {
          ...defaultSlugTranslations[fromLocale],
          ...customTranslations[fromLocale],
        },
      }
    : defaultSlugTranslations;

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
