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
  Partial<HTMLMotionProps<any>> & React.HTMLAttributes<HTMLElement>

/**
 * Get framer-motion hooks with fallbacks
 * Returns null values when framer-motion is not available
 */
export function useMotionHooks() {
  try {
    const { useScroll, useTransform, useReducedMotion, useInView } = require('framer-motion')
    return {
      useScroll,
      useTransform,
      useReducedMotion,
      useInView,
      available: true,
    }
  } catch {
    // Return no-op hooks when framer-motion not available
    return {
      useScroll: () => ({
        scrollY: {
          get: () => 0,
          on: (eventName: string, callback: (latest: number) => void) => () => {}
        },
        scrollYProgress: {
          get: () => 0,
          on: (eventName: string, callback: (latest: number) => void) => () => {}
        }
      }),
      useTransform: (value: any, input: any, output: any) => ({ get: () => output[0] }),
      useReducedMotion: () => false,
      useInView: () => true,
      available: false,
    }
  }
}

/**
 * Get AnimatePresence or fallback to simple wrapper
 * Returns a component that renders children with or without exit animations
 */
export function getAnimatePresence(): React.ComponentType<any> {
  try {
    const { AnimatePresence } = require('framer-motion')
    return AnimatePresence
  } catch {
    // Framer-motion not available, return simple wrapper that just renders children
    return ({ children }: any) => React.createElement(React.Fragment, null, children)
  }
}
