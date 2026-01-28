// ABOUTME: Language switcher component for bilingual navigation
// ABOUTME: Simple link to alternate language

'use client';

import { usePathname } from 'next/navigation';
import { type Locale } from '../../lib/i18n/config';
import { setLocaleCookie } from '../../lib/i18n/locale-cookie';
import { cn } from '../../lib/utils/cn';

export interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export function LanguageSwitcher({
  currentLocale,
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  // Get alternate locale
  const alternateLocale: Locale = currentLocale === 'fr' ? 'en' : 'fr';
  const displayText = alternateLocale === 'fr' ? 'Français' : 'English';

  // Remove current locale from pathname to get the base path
  const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
  const href = `/${alternateLocale}${pathnameWithoutLocale}`;

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
