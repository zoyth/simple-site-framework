// ABOUTME: Timeline component for displaying chronological events and processes
// ABOUTME: Supports vertical/horizontal layouts with animations and icons

'use client'

import { ReactNode } from 'react'
import { AnimatedSection, AnimatedItem } from './AnimatedSection'
import { cn } from '../lib/utils/cn'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface TimelineItem {
  /** Item title (bilingual) */
  title: LocalizedString | string
  /** Item description (bilingual) */
  description?: LocalizedString | string
  /** Date or step label */
  date?: string
  /** Optional icon */
  icon?: ReactNode
  /** Custom content (overrides description) */
  content?: ReactNode
}

export interface TimelineProps {
  /** Current locale */
  locale?: 'en' | 'fr'
  /** Timeline items */
  items: TimelineItem[]
  /** Layout orientation @default 'vertical' */
  orientation?: 'vertical' | 'horizontal'
  /** Visual variant @default 'default' */
  variant?: 'default' | 'simple' | 'filled'
  /** Position (vertical only) @default 'left' */
  position?: 'left' | 'center' | 'right' | 'alternating'
  /** Show connector line @default true */
  showConnector?: boolean
  /** Animate on scroll @default true */
  animate?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Timeline - Display chronological events or step-by-step processes
 *
 * Perfect for company history, project milestones, how-it-works sections,
 * and onboarding flows. Supports multiple layouts and visual styles.
 *
 * @example
 * // Company history timeline
 * <Timeline
 *   items={[
 *     {
 *       date: '2020',
 *       title: { en: 'Company Founded', fr: 'Fondation de l\'entreprise' },
 *       description: { en: 'Started in a garage...', fr: '...' },
 *       icon: <RocketIcon />
 *     },
 *     {
 *       date: '2022',
 *       title: 'Series A Funding',
 *       description: 'Raised $5M to scale operations',
 *       icon: <ChartIcon />
 *     }
 *   ]}
 *   locale="en"
 *   variant="default"
 * />
 *
 * @example
 * // Process steps (horizontal)
 * <Timeline
 *   items={steps}
 *   orientation="horizontal"
 *   variant="filled"
 *   position="center"
 * />
 *
 * @example
 * // Alternating timeline
 * <Timeline
 *   items={milestones}
 *   position="alternating"
 *   showConnector
 *   animate
 * />
 */
export function Timeline({
  locale = 'en',
  items,
  orientation = 'vertical',
  variant = 'default',
  position = 'left',
  showConnector = true,
  animate = true,
  className = ''
}: TimelineProps) {
  if (orientation === 'horizontal') {
    return (
      <HorizontalTimeline
        items={items}
        locale={locale}
        variant={variant}
        showConnector={showConnector}
        animate={animate}
        className={className}
      />
    )
  }

  return (
    <VerticalTimeline
      items={items}
      locale={locale}
      variant={variant}
      position={position}
      showConnector={showConnector}
      animate={animate}
      className={className}
    />
  )
}

function VerticalTimeline({
  items,
  locale,
  variant,
  position,
  showConnector,
  animate,
  className
}: Required<Omit<TimelineProps, 'orientation'>>) {
  const Container = animate ? AnimatedSection : 'div'
  const Item = animate ? AnimatedItem : 'div'
  const containerProps = animate ? { animation: 'fadeInUp' as const, stagger: 0.15 } : {}

  return (
    <Container {...containerProps} className={cn('relative', className)}>
      {items.map((item, index) => {
        const isAlternating = position === 'alternating'
        const isRight = isAlternating ? index % 2 === 1 : position === 'right'
        const isCenter = position === 'center'

        return (
          <Item key={index}>
            <div
              className={cn(
                'relative pb-8 last:pb-0',
                isCenter && 'flex flex-col items-center text-center'
              )}
            >
              {/* Connector line */}
              {showConnector && index < items.length - 1 && (
                <div
                  className={cn(
                    'absolute top-6 bottom-0 w-0.5 bg-gray-300',
                    isCenter ? 'left-1/2 -translate-x-1/2' : 'left-6'
                  )}
                />
              )}

              <div
                className={cn(
                  'flex gap-4 items-start',
                  isCenter && 'flex-col items-center',
                  isRight && !isCenter && 'flex-row-reverse text-right'
                )}
              >
                {/* Icon/Marker */}
                <div
                  className={cn(
                    'flex-shrink-0 flex items-center justify-center rounded-full z-10',
                    variant === 'filled'
                      ? 'w-12 h-12 bg-primary text-white'
                      : variant === 'simple'
                      ? 'w-3 h-3 bg-primary'
                      : 'w-12 h-12 border-2 border-primary bg-white text-primary'
                  )}
                >
                  {item.icon && variant !== 'simple' && (
                    <div className="w-6 h-6">{item.icon}</div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {item.date && (
                    <div className="text-sm font-semibold text-primary mb-1">
                      {item.date}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                    {typeof item.title === 'string'
                      ? item.title
                      : getLocalizedString(item.title, locale)}
                  </h3>
                  {item.content ? (
                    item.content
                  ) : item.description ? (
                    <p className="text-gray-600 font-body">
                      {typeof item.description === 'string'
                        ? item.description
                        : getLocalizedString(item.description, locale)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </Item>
        )
      })}
    </Container>
  )
}

function HorizontalTimeline({
  items,
  locale,
  variant,
  showConnector,
  animate,
  className
}: Required<Omit<TimelineProps, 'orientation' | 'position'>>) {
  const Container = animate ? AnimatedSection : 'div'
  const Item = animate ? AnimatedItem : 'div'
  const containerProps = animate ? { animation: 'fadeInUp' as const, stagger: 0.15 } : {}

  return (
    <Container {...containerProps} className={cn('relative', className)}>
      <div className="flex overflow-x-auto pb-4">
        {items.map((item, index) => (
          <Item key={index} className="flex-shrink-0">
            <div className="relative px-6 first:pl-0 last:pr-0">
              {/* Connector line */}
              {showConnector && index < items.length - 1 && (
                <div className="absolute top-6 left-12 right-6 h-0.5 bg-gray-300 z-0" />
              )}

              <div className="flex flex-col items-center max-w-xs">
                {/* Icon/Marker */}
                <div
                  className={cn(
                    'flex-shrink-0 flex items-center justify-center rounded-full z-10 mb-4',
                    variant === 'filled'
                      ? 'w-12 h-12 bg-primary text-white'
                      : variant === 'simple'
                      ? 'w-3 h-3 bg-primary'
                      : 'w-12 h-12 border-2 border-primary bg-white text-primary'
                  )}
                >
                  {item.icon && variant !== 'simple' && (
                    <div className="w-6 h-6">{item.icon}</div>
                  )}
                </div>

                {/* Content */}
                <div className="text-center">
                  {item.date && (
                    <div className="text-sm font-semibold text-primary mb-1">
                      {item.date}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                    {typeof item.title === 'string'
                      ? item.title
                      : getLocalizedString(item.title, locale)}
                  </h3>
                  {item.content ? (
                    item.content
                  ) : item.description ? (
                    <p className="text-gray-600 font-body text-sm">
                      {typeof item.description === 'string'
                        ? item.description
                        : getLocalizedString(item.description, locale)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </Item>
        ))}
      </div>
    </Container>
  )
}
