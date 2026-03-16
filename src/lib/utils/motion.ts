// ABOUTME: Utilities for optional framer-motion integration
// ABOUTME: Provides graceful degradation when framer-motion is not installed

import * as React from 'react'
import type { HTMLMotionProps } from 'framer-motion'

// Module-level cached reference to framer-motion.
// Resolved once via dynamic import so all consumers share the same module instance
// (and therefore the same React reference). This prevents the dual-React crash
// that occurs when require() becomes __require in bundled ESM output.
//
// Only loaded on the client to prevent hydration mismatches — motion components
// render different attributes than plain HTML elements, so server and client
// must render the same fallback initially. After mount, components re-render
// with motion once the import resolves.
let _fm: typeof import('framer-motion') | null = null;
let _fmPromise: Promise<typeof import('framer-motion') | null> | null = null;

function loadFm(): Promise<typeof import('framer-motion') | null> {
  if (!_fmPromise) {
    _fmPromise = import('framer-motion')
      .then((mod) => { _fm = mod; return mod; })
      .catch(() => { _fm = null; return null; });
  }
  return _fmPromise;
}

// Only load on client — server always renders plain HTML fallbacks
if (typeof window !== 'undefined') {
  loadFm();
}

/**
 * Check if framer-motion is available (synchronous, uses cached reference)
 */
export function hasFramerMotion(): boolean {
  return _fm !== null;
}

/**
 * Hook that loads framer-motion on the client and triggers a re-render
 * when it becomes available. Returns true when motion is ready to use.
 *
 * On the server, always returns false (fallback rendering).
 * On the client, returns false initially, then true after the import resolves.
 */
export function useMotionReady(): boolean {
  const [ready, setReady] = React.useState(_fm !== null);

  React.useEffect(() => {
    if (_fm) {
      setReady(true);
      return;
    }
    loadFm().then((mod) => {
      if (mod) setReady(true);
    });
  }, []);

  return ready;
}

/**
 * Lazy load framer-motion if available
 * Returns null if not installed
 */
export async function loadFramerMotion(): Promise<typeof import('framer-motion') | null> {
  return loadFm();
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
  if (_fm) {
    return (_fm.motion as any)[element];
  }

  // Framer-motion not available (or not yet loaded), return regular element
  // Strip motion-specific props to avoid warnings
  return (({ animate, initial, exit, transition, variants, whileHover, whileTap, whileInView, viewport, ...props }: any) => {
    return React.createElement(element, props)
  }) as any
}

/**
 * Hook to check if animations should be enabled
 * Considers both framer-motion availability and user preferences
 */
export function useAnimationsEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  if (!_fm) {
    return false
  }

  const prefersReducedMotion = _fm.useReducedMotion()
  return !prefersReducedMotion
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
  if (_fm) {
    return {
      useScroll: _fm.useScroll,
      useTransform: _fm.useTransform,
      useReducedMotion: _fm.useReducedMotion,
      useInView: _fm.useInView,
      available: true,
    }
  }

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

/**
 * Get AnimatePresence or fallback to simple wrapper
 * Returns a component that renders children with or without exit animations
 */
export function getAnimatePresence(): React.ComponentType<any> {
  if (_fm) {
    return _fm.AnimatePresence;
  }

  return ({ children }: any) => React.createElement(React.Fragment, null, children)
}
