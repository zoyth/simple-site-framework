// ABOUTME: Skip navigation link for keyboard users to jump to main content
// ABOUTME: Appears on focus, allows bypassing repetitive navigation elements

'use client'

import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface SkipLinkProps {
  /** Target element ID to skip to (e.g., "main-content") */
  href: string
  /** Link text */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * SkipLink - Accessible skip navigation component
 *
 * Provides a hidden link that appears on keyboard focus, allowing users
 * to skip repetitive navigation and jump directly to main content.
 * Essential for keyboard and screen reader accessibility.
 *
 * @example
 * ```tsx
 * // In layout, before header
 * <SkipLink href="#main-content">Skip to main content</SkipLink>
 *
 * // In main content area
 * <main id="main-content">...</main>
 * ```
 */
export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Hidden by default
        'absolute left-0 top-0 z-50',
        '-translate-y-full',
        // Visible on focus
        'focus:translate-y-0',
        // Styling
        'bg-primary text-white',
        'px-4 py-2',
        'font-medium',
        'transition-transform',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        className
      )}
      // Move focus to target on click
      onClick={(e) => {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target instanceof HTMLElement) {
          target.focus()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }}
    >
      {children}
    </a>
  )
}
