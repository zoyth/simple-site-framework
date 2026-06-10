// ABOUTME: Scalable language selector that adapts from text toggle to dropdown
// ABOUTME: Auto-detects variant based on number of languages, supports all prefix modes

'use client';

import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../I18nProvider';
import { setLocaleCookie } from '../../lib/i18n/locale-cookie';
import type { SlugTranslations } from '../../lib/i18n/slug-translations';
import type { LocalePrefix } from '../../lib/i18n/types';
import { cn } from '../../lib/utils/cn';

export interface LanguageSelectorProps {
  /** Current locale */
  currentLocale: string;
  /** Additional CSS classes */
  className?: string;
  /** Display variant @default 'auto' */
  variant?: 'text' | 'dropdown' | 'auto';
  /** Custom slug translations */
  customSlugTranslations?: SlugTranslations;
}

/**
 * LanguageSelector - Scalable language switcher component
 *
 * Automatically adapts between text toggle (2 languages) and dropdown (3+)
 * Supports all 3 locale prefix modes and slug translation
 *
 * @example
 * ```tsx
 * // Auto-detects variant
 * <LanguageSelector currentLocale={locale} />
 *
 * // Force dropdown
 * <LanguageSelector currentLocale={locale} variant="dropdown" />
 *
 * // With custom slug translations
 * <LanguageSelector
 *   currentLocale={locale}
 *   customSlugTranslations={myTranslations}
 * />
 * ```
 */
export function LanguageSelector({
  currentLocale,
  className,
  variant = 'auto',
  customSlugTranslations,
}: LanguageSelectorProps) {
  const { locales } = useI18n();

  // No language to switch to
  if (locales.length < 2) {
    return null;
  }

  // Auto-detect variant based on locale count
  const finalVariant = variant === 'auto'
    ? locales.length === 2 ? 'text' : 'dropdown'
    : variant;

  if (finalVariant === 'text') {
    return (
      <TextToggle
        currentLocale={currentLocale}
        className={className}
        customSlugTranslations={customSlugTranslations}
      />
    );
  }

  return (
    <Dropdown
      currentLocale={currentLocale}
      className={className}
      customSlugTranslations={customSlugTranslations}
    />
  );
}

/**
 * Simple text toggle for 2 languages
 */
function TextToggle({
  currentLocale,
  className,
  customSlugTranslations,
}: {
  currentLocale: string;
  className?: string;
  customSlugTranslations?: SlugTranslations;
}) {
  const i18n = useI18n();
  const pathname = usePathname();

  // Get the alternate locale
  const alternateLocale = i18n.locales.find((l) => l !== currentLocale) || i18n.locales[0];
  const displayText = i18n.localeNames[alternateLocale] || alternateLocale;

  const href = buildLocaleUrl(
    pathname,
    currentLocale,
    alternateLocale,
    i18n.locales,
    i18n.localePrefix,
    i18n.defaultLocale,
    i18n.translateSlug,
    customSlugTranslations
  );

  const handleClick = () => {
    setLocaleCookie(alternateLocale);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        'text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors',
        'inline-flex items-center h-10', // Match hamburger button height (p-2 + 24px icon = 40px)
        'pb-1 border-b-2 border-transparent', // Match nav item baseline offset
        className
      )}
      aria-label={`Switch to ${displayText}`}
    >
      {displayText}
    </a>
  );
}

/**
 * Dropdown selector for 3+ languages
 */
function Dropdown({
  currentLocale,
  className,
  customSlugTranslations,
}: {
  currentLocale: string;
  className?: string;
  customSlugTranslations?: SlugTranslations;
}) {
  const i18n = useI18n();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = i18n.localeLabels[currentLocale] || currentLocale.toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2',
          'text-sm font-medium text-gray-700',
          'bg-white border border-gray-300 rounded-md',
          'hover:bg-gray-50 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <span>{currentLabel}</span>
        <ChevronDownIcon
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-48',
            'bg-white rounded-md shadow-lg',
            'border border-gray-200',
            'py-1 z-50'
          )}
          role="menu"
        >
          {i18n.locales.map((locale) => {
            const href = buildLocaleUrl(
              pathname,
              currentLocale,
              locale,
              i18n.locales,
              i18n.localePrefix,
              i18n.defaultLocale,
              i18n.translateSlug,
              customSlugTranslations
            );
            const localeName = i18n.localeNames[locale] || locale;
            const localeLabel = i18n.localeLabels[locale] || locale.toUpperCase();
            const isActive = locale === currentLocale;

            return (
              <a
                key={locale}
                href={href}
                onClick={() => {
                  setLocaleCookie(locale);
                  setIsOpen(false);
                }}
                className={cn(
                  'block px-4 py-2 text-sm',
                  'hover:bg-gray-100 transition-colors',
                  isActive && 'bg-gray-50 font-semibold text-primary'
                )}
                role="menuitem"
              >
                <div className="flex items-center justify-between">
                  <span>{localeName}</span>
                  <span className="text-xs text-gray-500">{localeLabel}</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Build URL for target locale
 * Respects localePrefix mode and translates slugs
 */
function buildLocaleUrl(
  pathname: string,
  fromLocale: string,
  toLocale: string,
  locales: readonly string[],
  prefixMode: LocalePrefix,
  defaultLocale: string,
  translateSlug: (path: string, from: string, to: string, custom?: SlugTranslations) => string,
  customTranslations?: SlugTranslations
): string {
  // Remove current locale prefix from pathname
  const pathnameWithoutLocale = removeLocaleFromPathname(pathname, fromLocale, locales);

  // Translate slug
  const translatedPath = translateSlug(
    pathnameWithoutLocale,
    fromLocale,
    toLocale,
    customTranslations
  );

  // Detect if the current URL uses a locale prefix. This is more reliable than
  // reading the config, which may not be initialized on the client side since
  // setI18nConfig() runs in the server layout.
  const currentPathHasPrefix = pathname.startsWith(`/${fromLocale}/`) || pathname === `/${fromLocale}`;

  if (currentPathHasPrefix) {
    return `/${toLocale}${translatedPath}`;
  }

  // Build URL based on prefix mode
  if (prefixMode === 'never') {
    return translatedPath;
  } else if (prefixMode === 'as-needed' && toLocale === defaultLocale) {
    return translatedPath;
  } else {
    return `/${toLocale}${translatedPath}`;
  }
}

/**
 * Remove locale prefix from pathname
 */
function removeLocaleFromPathname(pathname: string, locale: string, locales: readonly string[]): string {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return '/';
  }

  const firstSegment = segments[0];

  // Check if first segment is a locale
  if (locales.includes(firstSegment)) {
    const remaining = segments.slice(1);
    return remaining.length > 0 ? `/${remaining.join('/')}` : '/';
  }

  return pathname;
}

/**
 * Chevron down icon
 */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
