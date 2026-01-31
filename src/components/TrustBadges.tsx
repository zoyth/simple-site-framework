// ABOUTME: Trust badge component for displaying credibility indicators
// ABOUTME: Pre-built badges with tooltip support and responsive grid

'use client'

import { ReactNode, useState } from 'react'

export type BadgeType =
  | 'ssl-secure'
  | 'money-back-30'
  | 'money-back-60'
  | 'money-back-90'
  | 'bbb-accredited'
  | 'satisfaction-guaranteed'
  | 'free-shipping'
  | 'privacy-protected'
  | '24-7-support'
  | 'secure-payment'

export interface CustomBadge {
  type: 'custom'
  image: string
  alt: string
  tooltip?: string
}

export type Badge = BadgeType | CustomBadge

export interface TrustBadgesProps {
  /** Array of badge types or custom badges */
  badges: Badge[]
  /** Visual variant @default 'color' */
  variant?: 'color' | 'grayscale'
  /** Badge size @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS classes */
  className?: string
}

const badgeConfig: Record<
  BadgeType,
  {
    label: string
    icon: ReactNode
    tooltip: string
  }
> = {
  'ssl-secure': {
    label: 'SSL Secure',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>
    ),
    tooltip: 'Your data is encrypted and secure'
  },
  'money-back-30': {
    label: '30-Day Money Back',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    tooltip: '30-day money-back guarantee'
  },
  'money-back-60': {
    label: '60-Day Money Back',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    tooltip: '60-day money-back guarantee'
  },
  'money-back-90': {
    label: '90-Day Money Back',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    tooltip: '90-day money-back guarantee'
  },
  'bbb-accredited': {
    label: 'BBB Accredited',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
    tooltip: 'Better Business Bureau Accredited'
  },
  'satisfaction-guaranteed': {
    label: 'Satisfaction Guaranteed',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    tooltip: '100% satisfaction guaranteed'
  },
  'free-shipping': {
    label: 'Free Shipping',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM19.5 9.5h-1V6h-11v9H6c-2.21 0-4 1.79-4 4h15.5c.83 0 1.5-.67 1.5-1.5v-8c0-.83-.67-1.5-1.5-1.5zM6 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
      </svg>
    ),
    tooltip: 'Free shipping on all orders'
  },
  'privacy-protected': {
    label: 'Privacy Protected',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    ),
    tooltip: 'Your privacy is protected'
  },
  '24-7-support': {
    label: '24/7 Support',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
      </svg>
    ),
    tooltip: '24/7 customer support available'
  },
  'secure-payment': {
    label: 'Secure Payment',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
      </svg>
    ),
    tooltip: 'Secure payment processing'
  }
}

/**
 * TrustBadges - Display trust indicators and credibility badges
 *
 * Reduces purchase anxiety and builds trust with pre-designed or custom badges.
 *
 * @example
 * <TrustBadges
 *   badges={['ssl-secure', 'money-back-30', 'bbb-accredited']}
 *   variant="color"
 *   size="md"
 * />
 *
 * @example
 * // With custom badge
 * <TrustBadges
 *   badges={[
 *     'ssl-secure',
 *     {
 *       type: 'custom',
 *       image: '/badges/certified.png',
 *       alt: 'Industry Certified',
 *       tooltip: 'Certified by Industry Association'
 *     }
 *   ]}
 * />
 */
export function TrustBadges({
  badges,
  variant = 'color',
  size = 'md',
  className = ''
}: TrustBadgesProps) {
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20'
  }

  return (
    <div className={`flex flex-wrap justify-center items-center gap-6 ${className}`}>
      {badges.map((badge, index) => (
        <TrustBadge
          key={index}
          badge={badge}
          variant={variant}
          sizeClass={sizeClasses[size]}
        />
      ))}
    </div>
  )
}

function TrustBadge({
  badge,
  variant,
  sizeClass
}: {
  badge: Badge
  variant: 'color' | 'grayscale'
  sizeClass: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (typeof badge === 'object' && badge.type === 'custom') {
    return (
      <div
        className="relative group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img
          src={badge.image}
          alt={badge.alt}
          className={`${sizeClass} w-auto object-contain ${
            variant === 'grayscale'
              ? 'grayscale hover:grayscale-0 transition-all duration-300'
              : ''
          }`}
        />
        {badge.tooltip && showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
            {badge.tooltip}
          </div>
        )}
      </div>
    )
  }

  const config = badgeConfig[badge as BadgeType]

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
          variant === 'grayscale'
            ? 'border-gray-300 text-gray-400 grayscale hover:border-primary hover:text-primary hover:grayscale-0'
            : 'border-gray-200 text-primary hover:border-primary hover:shadow-md'
        }`}
      >
        <div className={sizeClass}>{config.icon}</div>
        <span className="text-xs font-semibold text-center whitespace-nowrap">
          {config.label}
        </span>
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
          {config.tooltip}
        </div>
      )}
    </div>
  )
}
