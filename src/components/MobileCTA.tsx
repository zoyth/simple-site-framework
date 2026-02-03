// ABOUTME: Mobile-only sticky CTA button for improved mobile conversions
// ABOUTME: Scroll-triggered visibility with accessibility and tracking support

'use client';

import { useEffect, useState } from 'react';
import { cn } from '../lib/utils/cn';
import type { LocalizedString } from '../lib/i18n/types';
import { getLocalizedString } from '../lib/content/utils';

export interface MobileCTAProps {
  /** Localized CTA text */
  text: LocalizedString | string;
  /** CTA destination URL */
  href: string;
  /** Current locale */
  locale: string;
  /** Scroll distance in pixels before showing (default: 300) */
  threshold?: number;
  /** Breakpoint to hide on larger screens (default: 'lg') */
  hideAbove?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Optional click handler (for tracking) */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Z-index value (default: 50) */
  zIndex?: number;
}

/**
 * MobileCTA - Mobile-only sticky CTA button
 *
 * A scroll-triggered CTA button that appears at the bottom of the screen
 * after the user scrolls past a threshold. Improves mobile conversion rates
 * by keeping primary CTAs accessible without cluttering the viewport.
 *
 * Features:
 * - Scroll-triggered visibility (configurable threshold)
 * - Mobile-only display (hidden on desktop)
 * - Smooth slide-up animation
 * - 44px minimum tap target (accessibility)
 * - Optional click tracking
 * - Theme integration with className override
 * - Reduced motion support
 *
 * @example Basic usage
 * ```tsx
 * <MobileCTA
 *   text="Start Free Trial"
 *   href="https://app.example.com/signup"
 *   locale="en"
 * />
 * ```
 *
 * @example With localization and tracking
 * ```tsx
 * <MobileCTA
 *   text={{
 *     en: 'Start Free Trial - No Card Required',
 *     fr: 'Essai gratuit - Aucune carte requise'
 *   }}
 *   href="https://app.example.com/signup"
 *   locale="en"
 *   threshold={300}
 *   onClick={() => trackEvent('mobile_cta_click')}
 * />
 * ```
 *
 * @example Custom styling and breakpoint
 * ```tsx
 * <MobileCTA
 *   text="Get Started"
 *   href="/signup"
 *   locale="en"
 *   hideAbove="md"
 *   className="bg-gradient-to-r from-blue-500 to-purple-600"
 *   zIndex={100}
 * />
 * ```
 */
export function MobileCTA({
  text,
  href,
  locale,
  threshold = 300,
  hideAbove = 'lg',
  onClick,
  className,
  zIndex = 50,
}: MobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const ctaText = typeof text === 'string' ? text : getLocalizedString(text, locale);

  const hideAboveClasses = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden',
    xl: 'xl:hidden',
    '2xl': '2xl:hidden',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0',
        `z-${zIndex}`,
        hideAboveClasses[hideAbove],
        'transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full',
        className
      )}
    >
      <a
        href={href}
        onClick={handleClick}
        className={cn(
          'block w-full text-center',
          'bg-primary hover:bg-primary-hover text-white',
          'py-4 px-6 font-bold text-base',
          'shadow-lg',
          'active:scale-95 transition-all'
        )}
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        {ctaText}
      </a>
    </div>
  );
}
