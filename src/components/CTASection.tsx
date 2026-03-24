// ABOUTME: Full-width CTA section component for conversion optimization
// ABOUTME: Dual-button layout with variants and analytics support

import { cn } from '../lib/utils/cn';
import type { LocalizedString } from '../lib/i18n/types';
import { getLocalizedString } from '../lib/content/utils';

export interface CTAButtonConfig {
  /** Localized button text */
  text: LocalizedString | string;
  /** Destination URL */
  href: string;
  /** Optional click handler (for tracking) */
  onClick?: () => void;
  /** Button variant (uses framework Button variants) */
  variant?: 'outlined' | 'filled' | 'text' | 'ghost' | 'link' | 'destructive';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
}

export interface CTASectionProps {
  /** Localized heading text */
  heading: LocalizedString | string;
  /** Localized description/subheading */
  description?: LocalizedString | string;
  /** Primary CTA configuration */
  primaryCTA: CTAButtonConfig;
  /** Optional secondary CTA */
  secondaryCTA?: CTAButtonConfig;
  /** Current locale */
  locale: string;
  /** Layout variant */
  variant?: 'centered' | 'split' | 'inline';
  /** Button arrangement */
  buttonLayout?: 'horizontal' | 'vertical';
  /** Background color class */
  backgroundColor?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Maximum content width */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  /** Additional CSS classes */
  className?: string;
}

/**
 * CTASection - Full-width call-to-action section
 *
 * A configurable CTA section component with dual-button layout.
 * Provides consistent conversion patterns across marketing pages
 * with support for multiple content variants.
 *
 * Features:
 * - Dual-button layout (primary + optional secondary)
 * - Multiple layout variants (centered, split, inline)
 * - Uses framework Button component
 * - Optional click tracking
 * - Theme integration with className override
 * - Responsive button stacking
 * - Localization support
 * - Accessibility compliant
 *
 * @example Basic usage
 * ```tsx
 * <CTASection
 *   heading="Create Your Free Account"
 *   primaryCTA={{
 *     text: 'Sign Up',
 *     href: 'https://app.example.com/signup'
 *   }}
 *   locale="en"
 * />
 * ```
 *
 * @example With localization and description
 * ```tsx
 * <CTASection
 *   heading={{
 *     en: 'Create Your Free Account',
 *     fr: 'Créez votre compte gratuit'
 *   }}
 *   description={{
 *     en: 'No credit card required • Set up in 2 minutes',
 *     fr: 'Aucune carte de crédit requise • Configuration en 2 minutes'
 *   }}
 *   primaryCTA={{
 *     text: { en: 'Create Free Account', fr: 'Créer mon compte' },
 *     href: 'https://app.example.com/signup',
 *     onClick: () => trackCTAClick('signup', 'cta_section')
 *   }}
 *   secondaryCTA={{
 *     text: { en: 'See Pricing', fr: 'Voir les forfaits' },
 *     href: '/pricing'
 *   }}
 *   locale="en"
 *   backgroundColor="bg-surface"
 * />
 * ```
 *
 * @example Custom layout and styling
 * ```tsx
 * <CTASection
 *   heading="Get Started Today"
 *   variant="split"
 *   buttonLayout="vertical"
 *   align="left"
 *   maxWidth="4xl"
 *   className="border-t-4 border-primary"
 *   primaryCTA={{
 *     text: 'Start Free Trial',
 *     href: '/signup',
 *     variant: 'filled',
 *     size: 'lg'
 *   }}
 *   locale="en"
 * />
 * ```
 */
export function CTASection({
  heading,
  description,
  primaryCTA,
  secondaryCTA,
  locale,
  variant = 'centered',
  buttonLayout = 'horizontal',
  backgroundColor = 'bg-gray-50',
  align = 'center',
  maxWidth = '2xl',
  className,
}: CTASectionProps) {
  const headingText =
    typeof heading === 'string' ? heading : getLocalizedString(heading, locale);

  const descriptionText = description
    ? typeof description === 'string'
      ? description
      : getLocalizedString(description, locale)
    : undefined;

  const primaryText =
    typeof primaryCTA.text === 'string'
      ? primaryCTA.text
      : getLocalizedString(primaryCTA.text, locale);

  const secondaryText = secondaryCTA
    ? typeof secondaryCTA.text === 'string'
      ? secondaryCTA.text
      : getLocalizedString(secondaryCTA.text, locale)
    : undefined;

  // Determine alignment based on variant and explicit align prop
  const effectiveAlign = align === 'center' && (variant === 'split' || variant === 'inline')
    ? 'left'
    : align;

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
  };

  const buttonContainerClasses = cn(
    'flex gap-4 items-center',
    buttonLayout === 'horizontal'
      ? 'flex-col sm:flex-row justify-center'
      : 'flex-col',
    align === 'left' && 'sm:justify-start',
    align === 'right' && 'sm:justify-end'
  );

  return (
    <section
      className={cn(
        'py-20',
        backgroundColor,
        alignClasses[effectiveAlign],
        className
      )}
    >
      <div
        className={cn(
          'container mx-auto px-6',
          maxWidthClasses[maxWidth]
        )}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
          {headingText}
        </h2>

        {descriptionText && (
          <p className="text-lg md:text-xl text-text-muted mb-8">
            {descriptionText}
          </p>
        )}

        <div className={buttonContainerClasses}>
          <a
            href={primaryCTA.href}
            onClick={primaryCTA.onClick}
            className={cn(
              'inline-block px-8 py-4 font-semibold text-lg rounded-full transition-all duration-200',
              'bg-primary text-white hover:bg-primary-hover',
              'shadow-lg hover:shadow-xl transform hover:scale-105'
            )}
          >
            {primaryText}
          </a>

          {secondaryCTA && secondaryText && (
            <a
              href={secondaryCTA.href}
              onClick={secondaryCTA.onClick}
              className={cn(
                'inline-block px-8 py-4 font-semibold text-lg rounded-full transition-all duration-200',
                'bg-white text-primary border-2 border-primary',
                'hover:bg-primary hover:text-white'
              )}
            >
              {secondaryText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
