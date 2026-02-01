// ABOUTME: Animated counter component for displaying impressive statistics
// ABOUTME: Counts up when scrolled into view with locale-aware number formatting

'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionHooks } from '../lib/utils/motion'

export interface AnimatedCounterProps {
  /** Starting value @default 0 */
  from?: number
  /** Ending value */
  to: number
  /** Animation duration in seconds @default 2 */
  duration?: number
  /** Number of decimal places @default 0 */
  decimals?: number
  /** Thousands separator @default ',' */
  separator?: string
  /** Prefix (e.g., '$', '+') */
  prefix?: string
  /** Suffix (e.g., '%', '+', 'K', 'M') */
  suffix?: string
  /** Locale for number formatting @default 'en' */
  locale?: 'en' | 'fr'
  /** Additional CSS classes */
  className?: string
}

/**
 * AnimatedCounter - Number count-up animation component
 *
 * Animates from a starting value to an ending value when scrolled into view.
 * Supports locale-aware formatting, prefixes, suffixes, and decimal places.
 *
 * @example
 * // Simple counter
 * <AnimatedCounter to={10000} suffix="+" />
 *
 * @example
 * // Currency
 * <AnimatedCounter to={2500000} prefix="$" suffix="M+" decimals={1} />
 *
 * @example
 * // Percentage
 * <AnimatedCounter to={99.9} suffix="%" decimals={1} />
 *
 * @example
 * // French formatting
 * <AnimatedCounter to={1234.56} locale="fr" decimals={2} />
 * // Displays: 1 234,56
 */
export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  decimals = 0,
  separator = ',',
  prefix = '',
  suffix = '',
  locale = 'en',
  className = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from)
  const ref = useRef<HTMLSpanElement>(null)
  const motionHooks = useMotionHooks()
  const isInView = motionHooks.useInView(ref, { once: true, amount: 0.5 })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return

    hasAnimated.current = true
    const startTime = Date.now()
    const difference = to - from

    const updateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = from + difference * easeOut

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(to)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isInView, from, to, duration])

  const formatNumber = (value: number): string => {
    // Round to specified decimal places
    const rounded = Number(value.toFixed(decimals))

    if (locale === 'fr') {
      // French formatting: 1 234,56
      const parts = rounded.toFixed(decimals).split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      return parts.join(',')
    } else {
      // English formatting: 1,234.56
      const parts = rounded.toFixed(decimals).split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      return parts.join('.')
    }
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}
