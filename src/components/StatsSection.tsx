// ABOUTME: Statistics section component for displaying social proof metrics
// ABOUTME: Uses AnimatedCounter with icons and responsive grid layout

'use client'

import { ReactNode } from 'react'
import { AnimatedCounter } from './AnimatedCounter'
import { AnimatedSection, AnimatedItem } from './AnimatedSection'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface Stat {
  /** Numeric value to display */
  value: number
  /** Prefix (e.g., '$', '+') */
  prefix?: string
  /** Suffix (e.g., '%', '+', 'K', 'M') */
  suffix?: string
  /** Number of decimal places @default 0 */
  decimals?: number
  /** Stat label (bilingual) */
  label: LocalizedString
  /** Optional description (bilingual) */
  description?: LocalizedString
  /** Optional icon */
  icon?: ReactNode
}

export interface StatsSectionProps {
  /** Section title (bilingual) */
  title?: LocalizedString
  /** Section description (bilingual) */
  description?: LocalizedString
  /** Array of statistics */
  stats: Stat[]
  /** Current locale */
  locale: 'en' | 'fr'
  /** Number of columns @default 3 */
  columns?: 2 | 3 | 4
  /** Visual variant @default 'light' */
  variant?: 'light' | 'dark' | 'gradient' | 'bordered'
  /** Additional CSS classes */
  className?: string
}

/**
 * StatsSection - Display impressive statistics with animated counters
 *
 * Perfect for social proof: customer counts, uptime percentages, revenue processed, etc.
 * Numbers animate when scrolled into view with stagger effect.
 *
 * @example
 * <StatsSection
 *   title={{ en: "Our Impact", fr: "Notre Impact" }}
 *   stats={[
 *     {
 *       value: 10000,
 *       suffix: "+",
 *       label: { en: "Happy Clients", fr: "Clients Satisfaits" },
 *       description: { en: "Across 50 countries", fr: "..." },
 *       icon: <UsersIcon />
 *     },
 *     {
 *       value: 99.9,
 *       suffix: "%",
 *       decimals: 1,
 *       label: { en: "Uptime", fr: "Disponibilité" },
 *       icon: <CheckIcon />
 *     }
 *   ]}
 *   locale="en"
 *   columns={3}
 *   variant="light"
 * />
 */
export function StatsSection({
  title,
  description,
  stats,
  locale,
  columns = 3,
  variant = 'light',
  className = ''
}: StatsSectionProps) {
  const variantClasses = {
    light: 'bg-white',
    dark: 'bg-gray-900 text-white',
    gradient: 'bg-gradient-to-br from-primary to-primary-dark text-white',
    bordered: 'bg-white'
  }

  const statVariantClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-800',
    gradient: 'bg-white/10 backdrop-blur-sm',
    bordered: 'border-2 border-gray-200'
  }

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <section className={`py-16 ${variantClasses[variant]} ${className}`}>
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
                {getLocalizedString(title, locale)}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-body">
                {getLocalizedString(description, locale)}
              </p>
            )}
          </div>
        )}

        <AnimatedSection animation="fadeInUp" stagger={0.15}>
          <div className={`grid grid-cols-1 ${columnClasses[columns]} gap-8`}>
            {stats.map((stat, index) => (
              <AnimatedItem key={index}>
                <div
                  className={`${statVariantClasses[variant]} rounded-lg p-8 text-center`}
                >
                  {stat.icon && (
                    <div className="flex justify-center mb-4 text-primary">
                      <div className="w-12 h-12">{stat.icon}</div>
                    </div>
                  )}

                  <div className="text-4xl md:text-5xl font-bold mb-2 font-heading">
                    <AnimatedCounter
                      to={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                      locale={locale}
                      duration={2.5}
                    />
                  </div>

                  <div
                    className={`text-lg font-semibold mb-1 font-heading ${
                      variant === 'light' || variant === 'bordered'
                        ? 'text-gray-900'
                        : 'text-white'
                    }`}
                  >
                    {getLocalizedString(stat.label, locale)}
                  </div>

                  {stat.description && (
                    <div
                      className={`text-sm font-body ${
                        variant === 'light' || variant === 'bordered'
                          ? 'text-gray-600'
                          : 'text-white/80'
                      }`}
                    >
                      {getLocalizedString(stat.description, locale)}
                    </div>
                  )}
                </div>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
