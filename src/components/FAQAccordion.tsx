// ABOUTME: FAQ accordion component with structured data for SEO
// ABOUTME: Built on Radix UI with smooth animations and keyboard navigation

'use client'

import { ReactNode } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { motion } from 'framer-motion'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface FAQ {
  /** Unique ID for the FAQ item */
  id: string
  /** Question text (bilingual) */
  question: LocalizedString
  /** Answer text (bilingual) or React node */
  answer: LocalizedString | ReactNode
}

export interface FAQAccordionProps {
  /** Array of FAQ items */
  faqs: FAQ[]
  /** Current locale for display */
  locale: 'en' | 'fr'
  /** Allow multiple items open at once @default false */
  allowMultiple?: boolean
  /** Default open item IDs */
  defaultOpen?: string[]
  /** Include Schema.org structured data @default true */
  includeStructuredData?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * FAQAccordion - Accessible FAQ accordion with SEO structured data
 *
 * @example
 * <FAQAccordion
 *   faqs={[
 *     {
 *       id: 'payment',
 *       question: { en: 'What payment methods...', fr: '...' },
 *       answer: { en: 'We accept...', fr: '...' }
 *     }
 *   ]}
 *   locale="en"
 *   allowMultiple={false}
 *   includeStructuredData
 * />
 */
export function FAQAccordion({
  faqs,
  locale,
  allowMultiple = false,
  defaultOpen = [],
  includeStructuredData = true,
  className = ''
}: FAQAccordionProps) {
  const structuredData = includeStructuredData
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: getLocalizedString(faq.question, locale),
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              typeof faq.answer === 'string'
                ? faq.answer
                : getLocalizedString(faq.answer as LocalizedString, locale)
          }
        }))
      }
    : null

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {allowMultiple ? (
        <Accordion.Root
          type="multiple"
          defaultValue={defaultOpen}
          className={`space-y-2 ${className}`}
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.id} faq={faq} locale={locale} />
          ))}
        </Accordion.Root>
      ) : (
        <Accordion.Root
          type="single"
          defaultValue={defaultOpen[0]}
          collapsible
          className={`space-y-2 ${className}`}
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.id} faq={faq} locale={locale} />
          ))}
        </Accordion.Root>
      )}
    </>
  )
}

function FAQItem({ faq, locale }: { faq: FAQ; locale: 'en' | 'fr' }) {
  const question = getLocalizedString(faq.question, locale)
  const answer =
    typeof faq.answer === 'string' || typeof faq.answer === 'object'
      ? getLocalizedString(faq.answer as LocalizedString, locale)
      : faq.answer

  return (
    <Accordion.Item
      value={faq.id}
      className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-colors"
    >
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors group">
          <span className="text-base font-semibold text-gray-900 pr-4">
            {question}
          </span>
          <motion.svg
            className="w-5 h-5 text-gray-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={false}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content asChild forceMount>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: { duration: 0.2 }
          }}
          className="overflow-hidden"
        >
          <div className="px-6 py-4 text-gray-700 border-t border-gray-100">
            {typeof answer === 'string' ? <p>{answer}</p> : answer}
          </div>
        </motion.div>
      </Accordion.Content>
    </Accordion.Item>
  )
}
