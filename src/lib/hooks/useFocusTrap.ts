// ABOUTME: Hook for trapping focus within a container (modals, dialogs)
// ABOUTME: Ensures keyboard navigation stays within the active element

'use client'

import { useEffect, useRef } from 'react'

export interface UseFocusTrapOptions {
  /** Whether focus trap is active */
  enabled?: boolean
  /** Element to focus when trap activates */
  initialFocus?: HTMLElement | null
  /** Allow Tab to escape the trap */
  allowTabEscape?: boolean
}

/**
 * useFocusTrap - Trap keyboard focus within a container
 *
 * Prevents focus from leaving a container element, essential for
 * modals and dialogs to maintain accessibility. Automatically focuses
 * the first focusable element and cycles focus within the container.
 *
 * @param containerRef - Ref to the container element
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const modalRef = useRef<HTMLDivElement>(null)
 *   useFocusTrap(modalRef, { enabled: isOpen })
 *
 *   return (
 *     <div ref={modalRef}>
 *       <button onClick={onClose}>Close</button>
 *       <input type="text" />
 *     </div>
 *   )
 * }
 * ```
 */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: React.RefObject<T>,
  options: UseFocusTrapOptions = {}
) {
  const { enabled = true, initialFocus, allowTabEscape = false } = options
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    previouslyFocusedElement.current = document.activeElement as HTMLElement

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ]

      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
      ).filter((el) => {
        return (
          el.offsetWidth > 0 ||
          el.offsetHeight > 0 ||
          el.getClientRects().length > 0
        )
      })
    }

    // Focus initial element or first focusable
    const focusableElements = getFocusableElements()
    if (initialFocus && container.contains(initialFocus)) {
      initialFocus.focus()
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (allowTabEscape) return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) {
        e.preventDefault()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement as HTMLElement

      // Shift+Tab on first element: focus last
      if (e.shiftKey && activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
      // Tab on last element: focus first
      else if (!e.shiftKey && activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, containerRef, initialFocus, allowTabEscape])

  return previouslyFocusedElement
}
