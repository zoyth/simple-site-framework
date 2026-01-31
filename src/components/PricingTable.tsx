// ABOUTME: Pricing comparison table component with billing period toggle
// ABOUTME: Responsive design with feature comparison and highlighted tiers

'use client'

import { useState, ReactNode } from 'react'
import { Button } from './ui/Button'
import { AnimatedSection, AnimatedItem } from './AnimatedSection'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface PricingFeature {
  /** Feature name (bilingual) */
  name: LocalizedString
  /** Whether feature is included */
  included: boolean
  /** Optional tooltip description */
  tooltip?: LocalizedString
}

export interface PricingTier {
  /** Tier name (bilingual) */
  name: LocalizedString
  /** Description (bilingual) */
  description?: LocalizedString
  /** Pricing per billing period */
  price: {
    monthly?: number
    annual?: number
  }
  /** Currency symbol @default '$' */
  currency?: string
  /** List of features */
  features: PricingFeature[]
  /** CTA configuration */
  cta: {
    label: LocalizedString
    href: string
  }
  /** Highlight this tier as most popular @default false */
  highlighted?: boolean
  /** Custom badge text */
  badge?: LocalizedString
}

export type BillingPeriod = 'monthly' | 'annual'

export interface PricingTableProps {
  /** Array of pricing tiers (2-4 recommended) */
  tiers: PricingTier[]
  /** Current locale */
  locale: 'en' | 'fr'
  /** Available billing periods @default ['monthly', 'annual'] */
  billingPeriods?: BillingPeriod[]
  /** Default billing period @default 'monthly' */
  defaultPeriod?: BillingPeriod
  /** Savings message for annual (bilingual) */
  savings?: LocalizedString
  /** Additional CSS classes */
  className?: string
}

/**
 * PricingTable - Responsive pricing comparison table
 *
 * @example
 * <PricingTable
 *   tiers={[
 *     {
 *       name: { en: 'Starter', fr: 'Démarrage' },
 *       description: { en: 'For small teams', fr: '...' },
 *       price: { monthly: 29, annual: 24 },
 *       features: [
 *         { name: { en: 'Up to 10 users', fr: '...' }, included: true },
 *         { name: { en: 'Basic support', fr: '...' }, included: true },
 *         { name: { en: 'Advanced analytics', fr: '...' }, included: false }
 *       ],
 *       cta: { label: { en: 'Start Trial', fr: '...' }, href: '/signup' }
 *     },
 *     {
 *       name: { en: 'Professional', fr: 'Professionnel' },
 *       price: { monthly: 99, annual: 79 },
 *       highlighted: true,
 *       badge: { en: 'Most Popular', fr: 'Plus populaire' },
 *       features: [...],
 *       cta: { label: { en: 'Get Started', fr: '...' }, href: '/signup?plan=pro' }
 *     }
 *   ]}
 *   locale="en"
 *   defaultPeriod="annual"
 *   savings={{ en: 'Save 20%', fr: 'Économisez 20%' }}
 * />
 */
export function PricingTable({
  tiers,
  locale,
  billingPeriods = ['monthly', 'annual'],
  defaultPeriod = 'monthly',
  savings,
  className = ''
}: PricingTableProps) {
  const [period, setPeriod] = useState<BillingPeriod>(defaultPeriod)

  const showToggle = billingPeriods.length > 1

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {showToggle && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              {billingPeriods.map((billingPeriod) => (
                <button
                  key={billingPeriod}
                  onClick={() => setPeriod(billingPeriod)}
                  className={`px-6 py-2 rounded-md font-semibold transition-all ${
                    period === billingPeriod
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {billingPeriod === 'monthly'
                    ? locale === 'en'
                      ? 'Monthly'
                      : 'Mensuel'
                    : locale === 'en'
                    ? 'Annual'
                    : 'Annuel'}
                  {billingPeriod === 'annual' && savings && (
                    <span className="ml-2 text-xs text-green-600 font-semibold">
                      {getLocalizedString(savings, locale)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatedSection animation="fadeInUp" stagger={0.1}>
          <div className={`grid gap-8 ${
            tiers.length === 2
              ? 'md:grid-cols-2 max-w-4xl mx-auto'
              : tiers.length === 3
              ? 'md:grid-cols-3'
              : 'md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {tiers.map((tier, index) => (
              <AnimatedItem key={index}>
                <PricingCard tier={tier} period={period} locale={locale} />
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

function PricingCard({
  tier,
  period,
  locale
}: {
  tier: PricingTier
  period: BillingPeriod
  locale: 'en' | 'fr'
}) {
  const price = tier.price[period]
  const currency = tier.currency || '$'

  return (
    <div
      className={`relative rounded-lg border-2 bg-white transition-all ${
        tier.highlighted
          ? 'border-primary shadow-xl scale-105 md:scale-110'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {tier.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
            {getLocalizedString(tier.badge, locale)}
          </span>
        </div>
      )}

      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
          {getLocalizedString(tier.name, locale)}
        </h3>

        {tier.description && (
          <p className="text-gray-600 text-sm mb-6 font-body">
            {getLocalizedString(tier.description, locale)}
          </p>
        )}

        <div className="mb-8">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-900 font-heading">
              {currency}{price}
            </span>
            <span className="text-gray-600 ml-2 font-body">
              /{period === 'monthly' ? (locale === 'en' ? 'mo' : 'mois') : (locale === 'en' ? 'yr' : 'an')}
            </span>
          </div>
        </div>

        <Button
          variant={tier.highlighted ? 'filled' : 'outlined'}
          size="lg"
          fullWidth
          className="mb-8"
        >
          <a href={tier.cta.href} className="block">
            {getLocalizedString(tier.cta.label, locale)}
          </a>
        </Button>

        <div className="space-y-3">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {feature.included ? (
                  <svg
                    className="w-5 h-5 text-green-500"
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
                    className="w-5 h-5 text-gray-300"
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
                )}
              </div>
              <span
                className={`text-sm font-body ${
                  feature.included ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {getLocalizedString(feature.name, locale)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
