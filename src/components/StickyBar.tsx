// ABOUTME: Sticky notification bar for persistent CTAs
// ABOUTME: Appears on scroll with dismiss option and analytics tracking

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { Button } from './ui/Button'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface StickyBarProps {
  /** Message to display (bilingual) */
  message: LocalizedString
  /** Current locale */
  locale: 'en' | 'fr'
  /** CTA configuration */
  cta: {
    label: LocalizedString
    href: string
    onClick?: () => void
  }
  /** Position @default 'top' */
  position?: 'top' | 'bottom'
  /** Scroll trigger distance in pixels @default 300 */
  trigger?: number
  /** Whether bar is dismissible @default true */
  dismissible?: boolean
  /** Remember dismissal duration @default 'session' */
  rememberDismissal?: 'session' | 'permanent' | 'none'
  /** Hide on scroll up @default false */
  hideOnScrollUp?: boolean
  /** Optional icon */
  icon?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

const STORAGE_KEY = 'sticky-bar-dismissed'

/**
 * StickyBar - Persistent notification bar with CTA
 *
 * Appears after scrolling past a threshold to maintain CTA visibility.
 * Perfect for maintaining conversion opportunities throughout the page.
 *
 * @example
 * <StickyBar
 *   message={{ en: "Ready to get started?", fr: "..." }}
 *   cta={{
 *     label: { en: "Start Free Trial", fr: "..." },
 *     href: "/signup"
 *   }}
 *   locale="en"
 *   position="top"
 *   trigger={300}
 *   dismissible
 * />
 */
export function StickyBar({
  message,
  locale,
  cta,
  position = 'top',
  trigger = 300,
  dismissible = true,
  rememberDismissal = 'session',
  hideOnScrollUp = false,
  icon,
  className = ''
}: StickyBarProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { scrollY } = useScroll()

  // Check if previously dismissed
  useEffect(() => {
    if (rememberDismissal === 'none') return

    const storage = rememberDismissal === 'permanent' ? localStorage : sessionStorage
    const dismissed = storage.getItem(STORAGE_KEY)
    if (dismissed === 'true') {
      setIsDismissed(true)
    }
  }, [rememberDismissal])

  // Handle scroll
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      const shouldShow = latest > trigger

      if (hideOnScrollUp) {
        const isScrollingUp = latest < lastScrollY
        setIsVisible(shouldShow && !isScrollingUp && !isDismissed)
      } else {
        setIsVisible(shouldShow && !isDismissed)
      }

      setLastScrollY(latest)
    })
  }, [scrollY, trigger, hideOnScrollUp, isDismissed, lastScrollY])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)

    if (rememberDismissal !== 'none') {
      const storage = rememberDismissal === 'permanent' ? localStorage : sessionStorage
      storage.setItem(STORAGE_KEY, 'true')
    }
  }

  const positionClasses = position === 'top' ? 'top-0' : 'bottom-0'

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className={`fixed ${positionClasses} left-0 right-0 z-40 bg-primary text-white shadow-lg ${className}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {icon && <div className="flex-shrink-0">{icon}</div>}
                <span className="text-sm md:text-base font-medium truncate">
                  {getLocalizedString(message, locale)}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {cta.onClick ? (
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={cta.onClick}
                    className="!text-white !border-white hover:!bg-white hover:!text-primary"
                  >
                    {getLocalizedString(cta.label, locale)}
                  </Button>
                ) : (
                  <a href={cta.href}>
                    <Button
                      variant="outlined"
                      size="sm"
                      className="!text-white !border-white hover:!bg-white hover:!text-primary"
                    >
                      {getLocalizedString(cta.label, locale)}
                    </Button>
                  </a>
                )}

                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    aria-label="Dismiss"
                  >
                    <svg
                      className="w-5 h-5"
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
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
