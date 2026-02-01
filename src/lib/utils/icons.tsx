// ABOUTME: Utilities for optional lucide-react integration
// ABOUTME: Provides simple SVG fallbacks when lucide-react is not installed

import * as React from 'react'

/**
 * Check if lucide-react is available
 */
export function hasLucideReact(): boolean {
  try {
    require.resolve('lucide-react')
    return true
  } catch {
    return false
  }
}

/**
 * Simple SVG icon fallbacks for when lucide-react is not available
 * These cover the most commonly used icons in the framework
 */
interface IconProps {
  size?: number
  className?: string
  [key: string]: any
}

const createFallbackIcon = (path: string, viewBox = '0 0 24 24') => {
  return ({ size = 24, className = '', ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d={path} />
    </svg>
  )
}

export const fallbackIcons = {
  Check: createFallbackIcon('M20 6L9 17l-5-5'),
  Loader2: ({ size = 24, className = '', ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  ChevronDown: createFallbackIcon('M6 9l6 6 6-6'),
  ChevronUp: createFallbackIcon('M18 15l-6-6-6 6'),
  ChevronLeft: createFallbackIcon('M15 18l-6-6 6-6'),
  ChevronRight: createFallbackIcon('M9 18l6-6-6-6'),
  X: createFallbackIcon('M18 6L6 18M6 6l12 12'),
  Menu: createFallbackIcon('M3 12h18M3 6h18M3 18h18'),
  AlertCircle: ({ size = 24, className = '', ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Info: ({ size = 24, className = '', ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
