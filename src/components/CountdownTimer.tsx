// ABOUTME: Countdown timer component for urgency and time-limited offers
// ABOUTME: Supports multiple display formats with completion callbacks

'use client'

import { useState, useEffect } from 'react'
import { getMotionComponent, getAnimatePresence } from '../lib/utils/motion'
import { cn } from '../lib/utils/cn'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface CountdownTimerProps {
  /** Current locale */
  locale?: 'en' | 'fr'
  /** Target date/time */
  targetDate: Date | string
  /** Label above timer (bilingual) */
  label?: LocalizedString | string
  /** Message shown when countdown ends (bilingual) */
  completionMessage?: LocalizedString | string
  /** Callback when countdown ends */
  onComplete?: () => void
  /** Display format @default 'blocks' */
  format?: 'blocks' | 'inline' | 'minimal'
  /** Show labels for time units @default true */
  showLabels?: boolean
  /** Show days @default true */
  showDays?: boolean
  /** Show hours @default true */
  showHours?: boolean
  /** Show minutes @default true */
  showMinutes?: boolean
  /** Show seconds @default true */
  showSeconds?: boolean
  /** Size variant @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS classes */
  className?: string
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

const labels = {
  days: { en: 'Days', fr: 'Jours' },
  hours: { en: 'Hours', fr: 'Heures' },
  minutes: { en: 'Minutes', fr: 'Minutes' },
  seconds: { en: 'Seconds', fr: 'Secondes' },
  day: { en: 'Day', fr: 'Jour' },
  hour: { en: 'Hour', fr: 'Heure' },
  minute: { en: 'Minute', fr: 'Minute' },
  second: { en: 'Second', fr: 'Seconde' }
}

/**
 * CountdownTimer - Countdown timer for urgency and deadlines
 *
 * Creates urgency with time-limited offers, event countdowns, or flash sales.
 * Supports multiple display formats and automatic completion callbacks.
 *
 * @example
 * // Basic usage
 * <CountdownTimer
 *   targetDate={new Date('2024-12-31T23:59:59')}
 *   label={{ en: "Sale Ends In", fr: "La vente se termine dans" }}
 *   locale="en"
 * />
 *
 * @example
 * // Minimal inline format
 * <CountdownTimer
 *   targetDate="2024-06-15T12:00:00"
 *   format="inline"
 *   showDays={false}
 *   completionMessage="Offer expired!"
 *   onComplete={() => {
 *     console.log('Timer ended!')
 *     // Redirect, show message, etc.
 *   }}
 * />
 *
 * @example
 * // Large blocks format
 * <CountdownTimer
 *   targetDate={eventDate}
 *   label="Event Starts In"
 *   format="blocks"
 *   size="lg"
 *   showLabels
 * />
 */
export function CountdownTimer({
  locale = 'en',
  targetDate,
  label,
  completionMessage,
  onComplete,
  format = 'blocks',
  showLabels = true,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  size = 'md',
  className = ''
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(targetDate)
  )
  const [hasCompleted, setHasCompleted] = useState(false)
  const MotionDiv = getMotionComponent('div')
  const MotionSpan = getMotionComponent('span')
  const AnimatePresenceComponent = getAnimatePresence()

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(targetDate)
      setTimeRemaining(remaining)

      if (remaining.total <= 0 && !hasCompleted) {
        setHasCompleted(true)
        if (onComplete) {
          onComplete()
        }
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate, hasCompleted, onComplete])

  if (timeRemaining.total <= 0 && completionMessage) {
    return (
      <div className={cn('text-center', className)}>
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-lg font-semibold text-primary"
        >
          {typeof completionMessage === 'string'
            ? completionMessage
            : getLocalizedString(completionMessage, locale)}
        </MotionDiv>
      </div>
    )
  }

  const units = [
    { value: timeRemaining.days, show: showDays, label: labels.days, singular: labels.day },
    { value: timeRemaining.hours, show: showHours, label: labels.hours, singular: labels.hour },
    {
      value: timeRemaining.minutes,
      show: showMinutes,
      label: labels.minutes,
      singular: labels.minute
    },
    {
      value: timeRemaining.seconds,
      show: showSeconds,
      label: labels.seconds,
      singular: labels.second
    }
  ].filter((unit) => unit.show)

  const sizeClasses = {
    sm: {
      value: 'text-2xl',
      label: 'text-xs',
      block: 'w-12 h-12',
      gap: 'gap-2'
    },
    md: {
      value: 'text-4xl',
      label: 'text-sm',
      block: 'w-16 h-16',
      gap: 'gap-4'
    },
    lg: {
      value: 'text-5xl',
      label: 'text-base',
      block: 'w-20 h-20',
      gap: 'gap-6'
    }
  }

  return (
    <div className={cn('text-center', className)}>
      {label && (
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700">
            {typeof label === 'string' ? label : getLocalizedString(label, locale)}
          </p>
        </div>
      )}

      {format === 'blocks' && (
        <div className={cn('flex justify-center items-center', sizeClasses[size].gap)}>
          {units.map((unit, index) => (
            <div key={index} className="flex flex-col items-center">
              <MotionDiv
                key={unit.value}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
                className={cn(
                  sizeClasses[size].block,
                  'bg-primary text-white rounded-lg flex items-center justify-center font-bold font-heading shadow-lg'
                )}
              >
                <span className={sizeClasses[size].value}>
                  {String(unit.value).padStart(2, '0')}
                </span>
              </MotionDiv>
              {showLabels && (
                <span className={cn('mt-2 text-gray-600 font-medium', sizeClasses[size].label)}>
                  {getLocalizedString(
                    unit.value === 1 ? unit.singular : unit.label,
                    locale
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {format === 'inline' && (
        <div className="flex justify-center items-baseline gap-2 font-heading">
          {units.map((unit, index) => (
            <div key={index} className="flex items-baseline gap-1">
              <AnimatePresenceComponent mode="wait">
                <MotionSpan
                  key={unit.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn('font-bold text-primary', sizeClasses[size].value)}
                >
                  {String(unit.value).padStart(2, '0')}
                </MotionSpan>
              </AnimatePresenceComponent>
              {showLabels && (
                <span className={cn('text-gray-600', sizeClasses[size].label)}>
                  {getLocalizedString(
                    unit.value === 1 ? unit.singular : unit.label,
                    locale
                  )}
                </span>
              )}
              {index < units.length - 1 && (
                <span className={cn('text-gray-400 mx-1', sizeClasses[size].value)}>:</span>
              )}
            </div>
          ))}
        </div>
      )}

      {format === 'minimal' && (
        <div className="font-mono font-bold text-primary">
          <AnimatePresenceComponent mode="wait">
            <MotionSpan
              key={`${timeRemaining.days}${timeRemaining.hours}${timeRemaining.minutes}${timeRemaining.seconds}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={sizeClasses[size].value}
            >
              {units.map((unit, index) => (
                <span key={index}>
                  {String(unit.value).padStart(2, '0')}
                  {index < units.length - 1 && ':'}
                </span>
              ))}
            </MotionSpan>
          </AnimatePresenceComponent>
        </div>
      )}
    </div>
  )
}

function calculateTimeRemaining(targetDate: Date | string): TimeRemaining {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate
  const now = new Date()
  const total = target.getTime() - now.getTime()

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((total % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, total }
}
