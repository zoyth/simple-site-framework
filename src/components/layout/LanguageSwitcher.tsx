// ABOUTME: Language switcher component for bilingual navigation
// ABOUTME: Translates slugs when switching between languages

'use client';

import { usePathname } from 'next/navigation';
import { type Locale } from '../../lib/i18n/config';
import { setLocaleCookie } from '../../lib/i18n/locale-cookie';
import { translateSlug, type SlugTranslations } from '../../lib/i18n/slug-translations';
import { cn } from '../../lib/utils/cn';

export interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
  customSlugTranslations?: SlugTranslations;
}

export function LanguageSwitcher({
  currentLocale,
  className,
  customSlugTranslations,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  // Get alternate locale
  const alternateLocale: Locale = currentLocale === 'fr' ? 'en' : 'fr';
  const displayText = alternateLocale === 'fr' ? 'Français' : 'English';

  // Remove current locale from pathname to get the base path
  const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

  // Translate the slug to the target locale
  const translatedPath = translateSlug(
    pathnameWithoutLocale,
    currentLocale,
    alternateLocale,
    customSlugTranslations
  );

  const href = `/${alternateLocale}${translatedPath}`;

  const handleClick = () => {
    // Set cookie to persist locale preference
    setLocaleCookie(alternateLocale);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        'text-sm text-gray-600 hover:text-gray-900 transition-colors',
        className
      )}
      aria-label={`Switch to ${alternateLocale === 'fr' ? 'French' : 'English'}`}
    >
      {displayText}
    </a>
  );
}
