// ABOUTME: Tabs component for organizing content with URL synchronization
// ABOUTME: Built on Radix UI with keyboard navigation and optional URL state

'use client'

import { ReactNode, useEffect, useState } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '../lib/utils/cn'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface Tab {
  /** Unique tab identifier */
  value: string
  /** Tab label (bilingual) */
  label: LocalizedString | string
  /** Tab content */
  content: ReactNode
  /** Disabled state */
  disabled?: boolean
}

export interface TabsProps {
  /** Current locale */
  locale?: 'en' | 'fr'
  /** Array of tabs */
  tabs: Tab[]
  /** Default active tab value */
  defaultValue?: string
  /** Controlled active tab value */
  value?: string
  /** Callback when tab changes */
  onValueChange?: (value: string) => void
  /** Sync active tab with URL query param @default false */
  syncWithUrl?: boolean
  /** URL query param name @default 'tab' */
  urlParam?: string
  /** Tab variant @default 'underline' */
  variant?: 'underline' | 'pills' | 'bordered'
  /** Tab orientation @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Additional CSS classes */
  className?: string
}

/**
 * Tabs - Organize content into switchable panels
 *
 * Built on Radix UI with keyboard navigation, optional URL sync,
 * and multiple visual variants. Perfect for feature comparisons,
 * FAQs, documentation, and multi-section content.
 *
 * @example
 * // Basic usage
 * <Tabs
 *   tabs={[
 *     {
 *       value: 'features',
 *       label: { en: 'Features', fr: 'Fonctionnalités' },
 *       content: <FeaturesContent />
 *     },
 *     {
 *       value: 'pricing',
 *       label: 'Pricing',
 *       content: <PricingContent />
 *     }
 *   ]}
 *   locale="en"
 * />
 *
 * @example
 * // With URL synchronization
 * <Tabs
 *   tabs={tabs}
 *   syncWithUrl
 *   urlParam="section"
 *   variant="pills"
 *   onValueChange={(value) => {
 *     console.log('Tab changed to:', value)
 *   }}
 * />
 *
 * @example
 * // Vertical orientation
 * <Tabs
 *   tabs={tabs}
 *   orientation="vertical"
 *   variant="bordered"
 *   locale="fr"
 * />
 */
export function Tabs({
  locale = 'en',
  tabs,
  defaultValue,
  value: controlledValue,
  onValueChange,
  syncWithUrl = false,
  urlParam = 'tab',
  variant = 'underline',
  orientation = 'horizontal',
  className = ''
}: TabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get initial value from URL or props
  const urlValue = syncWithUrl ? searchParams?.get(urlParam) : null
  const initialValue = urlValue || controlledValue || defaultValue || tabs[0]?.value

  const [internalValue, setInternalValue] = useState(initialValue)

  // Sync with URL on mount and when URL changes
  useEffect(() => {
    if (syncWithUrl && urlValue && urlValue !== internalValue) {
      setInternalValue(urlValue)
    }
  }, [syncWithUrl, urlValue, internalValue])

  const currentValue = controlledValue ?? internalValue

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)

    if (onValueChange) {
      onValueChange(newValue)
    }

    // Update URL if sync is enabled
    if (syncWithUrl && pathname) {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(urlParam, newValue)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }

  const variantClasses = {
    underline: {
      list: 'border-b border-gray-200',
      trigger: cn(
        'relative px-4 py-2 text-sm font-medium transition-colors',
        'text-gray-600 hover:text-gray-900',
        'data-[state=active]:text-primary',
        'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
        'after:bg-primary after:transition-transform after:origin-center',
        'after:scale-x-0 data-[state=active]:after:scale-x-100'
      )
    },
    pills: {
      list: 'p-1 bg-gray-100 rounded-lg inline-flex',
      trigger: cn(
        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
        'text-gray-600 hover:text-gray-900',
        'data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm'
      )
    },
    bordered: {
      list: 'border border-gray-200 rounded-lg p-1 inline-flex',
      trigger: cn(
        'px-4 py-2 text-sm font-medium transition-colors',
        'text-gray-600 hover:text-gray-900',
        'data-[state=active]:bg-primary data-[state=active]:text-white rounded-md'
      )
    }
  }

  return (
    <TabsPrimitive.Root
      value={currentValue}
      onValueChange={handleValueChange}
      orientation={orientation}
      className={cn(
        orientation === 'vertical' && 'flex gap-6',
        className
      )}
    >
      <TabsPrimitive.List
        className={cn(
          variantClasses[variant].list,
          orientation === 'horizontal' ? 'flex gap-1' : 'flex flex-col gap-1'
        )}
      >
        {tabs.map((tab) => {
          const label = typeof tab.label === 'string'
            ? tab.label
            : getLocalizedString(tab.label, locale)

          return (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className={cn(
                variantClasses[variant].trigger,
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {label}
            </TabsPrimitive.Trigger>
          )
        })}
      </TabsPrimitive.List>

      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className={cn(
            'focus:outline-none',
            orientation === 'horizontal' ? 'mt-6' : 'flex-1'
          )}
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
