// ABOUTME: DEPRECATED - Legacy language switcher for bilingual navigation
// ABOUTME: Use LanguageSelector instead - this is a thin wrapper for backward compatibility

'use client';

import { LanguageSelector } from './LanguageSelector';
import type { SlugTranslations } from '../../lib/i18n/slug-translations';

export interface LanguageSwitcherProps {
  currentLocale: string;
  className?: string;
  customSlugTranslations?: SlugTranslations;
}

/**
 * @deprecated Use LanguageSelector instead. This component will be removed in v1.0.0
 *
 * This is now a thin wrapper around LanguageSelector for backward compatibility.
 * Update your code to use LanguageSelector:
 *
 * ```tsx
 * import { LanguageSelector } from 'simple-site-framework/components/layout/LanguageSelector';
 * <LanguageSelector currentLocale={locale} />
 * ```
 */
export function LanguageSwitcher({
  currentLocale,
  className,
  customSlugTranslations,
}: LanguageSwitcherProps) {
  return (
    <LanguageSelector
      currentLocale={currentLocale}
      className={className}
      variant="text"
      customSlugTranslations={customSlugTranslations}
    />
  );
}
