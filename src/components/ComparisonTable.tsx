// ABOUTME: Comparison table component for feature and product comparisons
// ABOUTME: Supports multiple columns with highlighted options and checkmarks

'use client'

import { ReactNode } from 'react'
import { cn } from '../lib/utils/cn'
import { Button } from './ui/Button'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface ComparisonFeature {
  /** Feature name (bilingual) */
  name: LocalizedString | string
  /** Feature values for each option (boolean for checkmark, string for custom value) */
  values: (boolean | string | ReactNode)[]
  /** Feature description/tooltip (bilingual) */
  description?: LocalizedString | string
}

export interface ComparisonOption {
  /** Option name (bilingual) */
  name: LocalizedString | string
  /** Optional badge (e.g., "Popular", "Best Value") */
  badge?: LocalizedString | string
  /** Highlight this column @default false */
  highlighted?: boolean
  /** Call to action */
  cta?: {
    label: LocalizedString | string
    href?: string
    onClick?: () => void
  }
}

export interface ComparisonTableProps {
  /** Current locale */
  locale?: 'en' | 'fr'
  /** Table title (bilingual) */
  title?: LocalizedString | string
  /** Table description (bilingual) */
  description?: LocalizedString | string
  /** Options/products to compare */
  options: ComparisonOption[]
  /** Features to compare */
  features: ComparisonFeature[]
  /** Show checkmarks for boolean values @default true */
  showCheckmarks?: boolean
  /** Sticky header @default true */
  stickyHeader?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * ComparisonTable - Compare features across products or plans
 *
 * Perfect for pricing plan comparisons, feature matrices, and product
 * comparisons. Supports highlighting, badges, and CTAs per option.
 *
 * @example
 * // Basic plan comparison
 * <ComparisonTable
 *   title={{ en: "Compare Plans", fr: "Comparer les forfaits" }}
 *   locale="en"
 *   options={[
 *     {
 *       name: 'Basic',
 *       cta: { label: 'Get Started', href: '/signup?plan=basic' }
 *     },
 *     {
 *       name: 'Pro',
 *       badge: 'Popular',
 *       highlighted: true,
 *       cta: { label: 'Start Free Trial', href: '/signup?plan=pro' }
 *     },
 *     {
 *       name: 'Enterprise',
 *       cta: { label: 'Contact Sales', onClick: () => openContact() }
 *     }
 *   ]}
 *   features={[
 *     {
 *       name: 'Users',
 *       values: ['5', '20', 'Unlimited']
 *     },
 *     {
 *       name: 'Storage',
 *       values: ['10 GB', '100 GB', '1 TB']
 *     },
 *     {
 *       name: 'API Access',
 *       values: [false, true, true],
 *       description: 'Programmatic access to your data'
 *     }
 *   ]}
 * />
 *
 * @example
 * // Product comparison
 * <ComparisonTable
 *   options={products}
 *   features={productFeatures}
 *   showCheckmarks
 *   stickyHeader
 * />
 */
export function ComparisonTable({
  locale = 'en',
  title,
  description,
  options,
  features,
  showCheckmarks = true,
  stickyHeader = true,
  className = ''
}: ComparisonTableProps) {
  return (
    <div className={cn('w-full', className)}>
      {(title || description) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              {typeof title === 'string' ? title : getLocalizedString(title, locale)}
            </h2>
          )}
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-body">
              {typeof description === 'string'
                ? description
                : getLocalizedString(description, locale)}
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead
            className={cn(
              'bg-gray-50',
              stickyHeader && 'sticky top-0 z-10 shadow-sm'
            )}
          >
            <tr>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-200">
                {/* Empty header for feature names column */}
              </th>
              {options.map((option, index) => (
                <th
                  key={index}
                  className={cn(
                    'p-4 text-center border-b-2',
                    option.highlighted
                      ? 'bg-primary/5 border-primary'
                      : 'border-gray-200'
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    {option.badge && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary text-white rounded-full">
                        {typeof option.badge === 'string'
                          ? option.badge
                          : getLocalizedString(option.badge, locale)}
                      </span>
                    )}
                    <div className="text-lg font-bold text-gray-900 font-heading">
                      {typeof option.name === 'string'
                        ? option.name
                        : getLocalizedString(option.name, locale)}
                    </div>
                    {option.cta && (
                      <div className="mt-2">
                        {option.cta.onClick ? (
                          <Button
                            variant={option.highlighted ? 'filled' : 'outlined'}
                            size="sm"
                            onClick={option.cta.onClick}
                          >
                            {typeof option.cta.label === 'string'
                              ? option.cta.label
                              : getLocalizedString(option.cta.label, locale)}
                          </Button>
                        ) : (
                          <a href={option.cta.href}>
                            <Button
                              variant={option.highlighted ? 'filled' : 'outlined'}
                              size="sm"
                            >
                              {typeof option.cta.label === 'string'
                                ? option.cta.label
                                : getLocalizedString(option.cta.label, locale)}
                            </Button>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {features.map((feature, featureIndex) => (
              <tr
                key={featureIndex}
                className={cn(
                  'border-b border-gray-200',
                  featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                )}
              >
                <td className="p-4 font-medium text-gray-900">
                  {typeof feature.name === 'string'
                    ? feature.name
                    : getLocalizedString(feature.name, locale)}
                  {feature.description && (
                    <div className="text-sm text-gray-500 font-normal mt-1">
                      {typeof feature.description === 'string'
                        ? feature.description
                        : getLocalizedString(feature.description, locale)}
                    </div>
                  )}
                </td>
                {feature.values.map((value, valueIndex) => {
                  const isHighlighted = options[valueIndex]?.highlighted

                  return (
                    <td
                      key={valueIndex}
                      className={cn(
                        'p-4 text-center',
                        isHighlighted && 'bg-primary/5'
                      )}
                    >
                      {typeof value === 'boolean' ? (
                        showCheckmarks ? (
                          value ? (
                            <svg
                              className="w-6 h-6 text-green-500 mx-auto"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6 text-gray-300 mx-auto"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )
                        ) : value ? (
                          <span className="text-green-600 font-medium">✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        <span className="text-gray-900">{value}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
