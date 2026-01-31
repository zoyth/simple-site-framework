// ABOUTME: Exit intent modal component to capture abandoning visitors
// ABOUTME: Detects mouse leaving viewport and shows targeted retention message

'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Modal } from './Modal'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface ExitIntentModalProps {
  /** Current locale */
  locale?: 'en' | 'fr'
  /** Modal title (bilingual) */
  title: LocalizedString | string
  /** Modal content */
  children: ReactNode
  /** Enable exit intent detection @default true */
  enabled?: boolean
  /** Delay before showing modal (ms) @default 0 */
  delay?: number
  /** Show only once per session @default true */
  oncePerSession?: boolean
  /** Show only once ever (localStorage) @default false */
  onceEver?: boolean
  /** Cookie/storage key for "once" tracking @default 'exit-intent-shown' */
  storageKey?: string
  /** Sensitivity (distance from top in px before triggering) @default 50 */
  sensitivity?: number
  /** Callback when modal is shown */
  onShow?: () => void
  /** Callback when modal is dismissed */
  onDismiss?: () => void
}

/**
 * ExitIntentModal - Capture abandoning visitors with targeted message
 *
 * Detects when user's mouse leaves the viewport (exit intent) and shows
 * a modal with a retention offer, discount, or message.
 *
 * @example
 * // Basic usage
 * <ExitIntentModal
 *   title={{ en: "Wait! Don't Leave Yet", fr: "Attendez! Ne partez pas encore" }}
 *   locale="en"
 * >
 *   <div className="text-center">
 *     <p className="mb-4">Get 10% off your first order!</p>
 *     <input
 *       type="email"
 *       placeholder="Enter your email"
 *       className="w-full px-4 py-2 border rounded mb-4"
 *     />
 *     <Button variant="filled" fullWidth>
 *       Get My Discount
 *     </Button>
 *   </div>
 * </ExitIntentModal>
 *
 * @example
 * // Show only once ever with custom settings
 * <ExitIntentModal
 *   title="Special Offer Just for You"
 *   onceEver
 *   delay={2000}
 *   sensitivity={30}
 *   onShow={() => {
 *     console.log('Exit intent triggered')
 *     // Track analytics event
 *   }}
 * >
 *   <SpecialOfferContent />
 * </ExitIntentModal>
 *
 * @example
 * // Conditional exit intent
 * const [showExitIntent, setShowExitIntent] = useState(true)
 *
 * <ExitIntentModal
 *   enabled={showExitIntent && !userIsSubscribed}
 *   title="Before You Go..."
 *   onDismiss={() => {
 *     console.log('User dismissed exit intent')
 *     setShowExitIntent(false)
 *   }}
 * >
 *   <NewsletterSignup />
 * </ExitIntentModal>
 */
export function ExitIntentModal({
  locale = 'en',
  title,
  children,
  enabled = true,
  delay = 0,
  oncePerSession = true,
  onceEver = false,
  storageKey = 'exit-intent-shown',
  sensitivity = 50,
  onShow,
  onDismiss
}: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!enabled) return

    // Check if already shown
    const sessionShown = oncePerSession && sessionStorage.getItem(storageKey)
    const everShown = onceEver && localStorage.getItem(storageKey)

    if (sessionShown || everShown) {
      setHasShown(true)
      return
    }

    // Set ready after delay
    const readyTimer = setTimeout(() => {
      setIsReady(true)
    }, delay)

    return () => clearTimeout(readyTimer)
  }, [enabled, delay, oncePerSession, onceEver, storageKey])

  useEffect(() => {
    if (!enabled || !isReady || hasShown) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from top
      if (e.clientY <= sensitivity && e.movementY < 0) {
        setIsOpen(true)
        setHasShown(true)

        // Mark as shown in storage
        if (oncePerSession) {
          sessionStorage.setItem(storageKey, 'true')
        }
        if (onceEver) {
          localStorage.setItem(storageKey, 'true')
        }

        if (onShow) {
          onShow()
        }
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enabled, isReady, hasShown, sensitivity, storageKey, oncePerSession, onceEver, onShow])

  const handleClose = () => {
    setIsOpen(false)
    if (onDismiss) {
      onDismiss()
    }
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleClose}
      title={typeof title === 'string' ? title : getLocalizedString(title, locale)}
      size="md"
    >
      {children}
    </Modal>
  )
}
