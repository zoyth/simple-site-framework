// ABOUTME: Utilities for optional framer-motion integration
// ABOUTME: Provides graceful degradation when framer-motion is not installed

import * as React from 'react'
import type { HTMLMotionProps } from 'framer-motion'

/**
 * Check if framer-motion is available
 */
export function hasFramerMotion(): boolean {
  try {
    require.resolve('framer-motion')
    return true
  } catch {
    return false
  }
}

/**
 * Lazy load framer-motion if available
 * Returns null if not installed
 */
export async function loadFramerMotion(): Promise<any> {
  if (!hasFramerMotion()) {
    return null
  }

  try {
    const framerMotion = await import('framer-motion')
    return framerMotion
  } catch {
    return null
  }
}

/**
 * Get motion component or fallback to regular HTML element
 *
 * @example
 * ```tsx
 * const MotionDiv = getMotionComponent('div')
 *
 * // With framer-motion: <motion.div>
 * // Without framer-motion: <div>
 * <MotionDiv animate={{ opacity: 1 }}>Content</MotionDiv>
 * ```
 */
export function getMotionComponent<T extends keyof JSX.IntrinsicElements>(
  element: T
): React.ComponentType<any> {
  try {
    const { motion } = require('framer-motion')
    return motion[element]
  } catch {
    // Framer-motion not available, return regular element
    // Strip motion-specific props to avoid warnings
    return (({ animate, initial, exit, transition, variants, whileHover, whileTap, ...props }: any) => {
      return React.createElement(element, props)
    }) as any
  }
}

/**
 * Hook to check if animations should be enabled
 * Considers both framer-motion availability and user preferences
 */
export function useAnimationsEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  // Check if framer-motion is available
  if (!hasFramerMotion()) {
    return false
  }

  // Check user's motion preference
  try {
    const { useReducedMotion } = require('framer-motion')
    const prefersReducedMotion = useReducedMotion()
    return !prefersReducedMotion
  } catch {
    return false
  }
}

/**
 * Type-safe motion props that are safe to spread on regular elements
 * (they'll be stripped if framer-motion isn't available)
 */
export type SafeMotionProps<T extends keyof JSX.IntrinsicElements> =
  Partial<HTMLMotionProps<T>> & React.HTMLAttributes<HTMLElement>
