// ABOUTME: Live region announcer for screen reader announcements
// ABOUTME: Provides aria-live regions for dynamic content updates

'use client'

import { useEffect, useRef, useState } from 'react'

export type AnnouncementPriority = 'polite' | 'assertive'

export interface A11yAnnouncerProps {
  /** Announcement message */
  message?: string
  /** Priority level - 'polite' waits for pause, 'assertive' interrupts */
  priority?: AnnouncementPriority
  /** Clear message after this many milliseconds */
  clearAfter?: number
}

/**
 * A11yAnnouncer - Screen reader announcement component
 *
 * Provides ARIA live regions for announcing dynamic content changes
 * to screen reader users. Use for status messages, notifications,
 * and other important updates that need to be announced.
 *
 * @example
 * ```tsx
 * const [message, setMessage] = useState('')
 *
 * // In your component
 * <A11yAnnouncer message={message} priority="polite" clearAfter={3000} />
 *
 * // Trigger announcement
 * setMessage('Form submitted successfully!')
 * ```
 */
export function A11yAnnouncer({
  message,
  priority = 'polite',
  clearAfter = 3000,
}: A11yAnnouncerProps) {
  const [announcement, setAnnouncement] = useState(message)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (message) {
      setAnnouncement(message)

      // Clear announcement after timeout
      if (clearAfter && clearAfter > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          setAnnouncement('')
        }, clearAfter)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [message, clearAfter])

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}

/**
 * Global announcer singleton for programmatic announcements
 * Use with the useA11y hook for easier access
 */
let globalAnnouncerCallback: ((message: string, priority?: AnnouncementPriority) => void) | null = null

export function setGlobalAnnouncerCallback(
  callback: (message: string, priority?: AnnouncementPriority) => void
) {
  globalAnnouncerCallback = callback
}

export function announce(message: string, priority: AnnouncementPriority = 'polite') {
  if (globalAnnouncerCallback) {
    globalAnnouncerCallback(message, priority)
  } else {
    console.warn('A11yAnnouncer: No global announcer registered. Add <GlobalA11yAnnouncer /> to your layout.')
  }
}

/**
 * GlobalA11yAnnouncer - Global announcer for app-wide announcements
 *
 * Place this component once in your root layout to enable
 * programmatic announcements from anywhere in your app.
 *
 * @example
 * ```tsx
 * // In app layout
 * <GlobalA11yAnnouncer />
 *
 * // Anywhere in your app
 * import { announce } from '@zoyth/simple-site-framework'
 * announce('Item added to cart', 'polite')
 * ```
 */
export function GlobalA11yAnnouncer() {
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<AnnouncementPriority>('polite')

  useEffect(() => {
    setGlobalAnnouncerCallback((msg, prio = 'polite') => {
      setMessage(msg)
      setPriority(prio)
    })

    return () => {
      setGlobalAnnouncerCallback(() => {})
    }
  }, [])

  return <A11yAnnouncer message={message} priority={priority} />
}
