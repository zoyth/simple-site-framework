// ABOUTME: Hook for returning focus to previous element after modal/dialog closes
// ABOUTME: Maintains focus context for keyboard and screen reader users

'use client'

import { useEffect, useRef } from 'react'

export interface UseFocusReturnOptions {
  /** Whether to return focus on unmount */
  enabled?: boolean
  /** Custom element to return focus to */
  returnTo?: HTMLElement | null
}

/**
 * useFocusReturn - Return focus to previous element
 *
 * Captures the currently focused element when a component mounts
 * (e.g., modal opens) and returns focus to that element when the
 * component unmounts (modal closes). Essential for accessible modals.
 *
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   useFocusReturn({ enabled: isOpen })
 *
 *   if (!isOpen) return null
 *
 *   return (
 *     <div role="dialog">
 *       <h2>Modal Title</h2>
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom return element
 * const buttonRef = useRef<HTMLButtonElement>(null)
 * useFocusReturn({ returnTo: buttonRef.current })
 * ```
 */
export function useFocusReturn(options: UseFocusReturnOptions = {}) {
  const { enabled = true, returnTo } = options
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Capture currently focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement

    return () => {
      // Return focus on unmount
      const elementToFocus = returnTo || previouslyFocusedElement.current

      if (
        elementToFocus &&
        elementToFocus !== document.body &&
        typeof elementToFocus.focus === 'function'
      ) {
        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
          elementToFocus.focus()
        }, 0)
      }
    }
  }, [enabled, returnTo])

  return previouslyFocusedElement
}

/**
 * Combined hook for modal focus management
 *
 * Combines focus trap and focus return for complete modal accessibility.
 * Use this for most modal/dialog components.
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const modalRef = useRef<HTMLDivElement>(null)
 *   useModalFocus(modalRef, { enabled: isOpen })
 *
 *   if (!isOpen) return null
 *
 *   return (
 *     <div ref={modalRef} role="dialog">
 *       <h2>Modal Title</h2>
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useModalFocus<T extends HTMLElement>(
  containerRef: React.RefObject<T>,
  options: { enabled?: boolean } = {}
) {
  const { enabled = true } = options

  // Import here to avoid circular dependencies
  const { useFocusTrap } = require('./useFocusTrap')

  useFocusTrap(containerRef, { enabled })
  useFocusReturn({ enabled })
}
