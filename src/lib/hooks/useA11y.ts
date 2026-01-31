// ABOUTME: Hook for accessibility utilities and screen reader announcements
// ABOUTME: Provides announce() function and other a11y helpers

'use client'

import { useCallback } from 'react'
import { announce as globalAnnounce, type AnnouncementPriority } from '../../components/a11y/A11yAnnouncer'

export interface UseA11yReturn {
  /** Announce a message to screen readers */
  announce: (message: string, priority?: AnnouncementPriority) => void
}

/**
 * useA11y - Accessibility utilities hook
 *
 * Provides accessibility helper functions, primarily for screen reader
 * announcements. Requires <GlobalA11yAnnouncer /> in your app layout.
 *
 * @returns Object with accessibility utilities
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { announce } = useA11y()
 *
 *   const handleSubmit = async () => {
 *     await submitForm()
 *     announce('Form submitted successfully!', 'polite')
 *   }
 *
 *   return <button onClick={handleSubmit}>Submit</button>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Assertive announcements (interrupts screen reader)
 * const { announce } = useA11y()
 * announce('Error: Please fix the form errors', 'assertive')
 * ```
 */
export function useA11y(): UseA11yReturn {
  const announce = useCallback(
    (message: string, priority: AnnouncementPriority = 'polite') => {
      globalAnnounce(message, priority)
    },
    []
  )

  return {
    announce,
  }
}
