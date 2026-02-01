// ABOUTME: Wrapper component for scroll-triggered entrance animations
// ABOUTME: Uses Framer Motion for smooth, performant animations with viewport detection

'use client'

import type { Variants } from 'framer-motion'
import { ReactNode } from 'react'
import { getMotionComponent, useMotionHooks } from '../lib/utils/motion'

/**
 * Available animation types for AnimatedSection
 * - fadeInUp: Fades in while moving up
 * - fadeInDown: Fades in while moving down
 * - fadeInLeft: Fades in while moving from left
 * - fadeInRight: Fades in while moving from right
 * - scaleIn: Fades in while scaling up
 * - slideInLeft: Slides in from left
 * - slideInRight: Slides in from right
 * - none: No animation (used when prefers-reduced-motion is enabled)
 */
export type AnimationType =
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'scaleIn'
  | 'slideInLeft'
  | 'slideInRight'
  | 'none'

export interface AnimatedSectionProps {
  /** Content to animate */
  children: ReactNode
  /** Animation type to use @default 'fadeInUp' */
  animation?: AnimationType
  /** Delay before animation starts in seconds @default 0 */
  delay?: number
  /** Animation duration in seconds @default 0.6 */
  duration?: number
  /** Delay between animating children when using AnimatedItem @default 0 */
  stagger?: number
  /** Percentage of element that must be visible to trigger (0-1) @default 0.1 */
  threshold?: number
  /** Whether animation should only happen once @default true */
  triggerOnce?: boolean
  /** Additional CSS classes */
  className?: string
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  slideInLeft: {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  slideInRight: {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  none: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  }
}

/**
 * AnimatedSection - Wrapper component for scroll-triggered entrance animations
 *
 * Automatically animates children when they scroll into view. Respects user's
 * prefers-reduced-motion setting for accessibility.
 *
 * @example
 * // Basic usage
 * <AnimatedSection animation="fadeInUp">
 *   <h1>This will fade in from below</h1>
 * </AnimatedSection>
 *
 * @example
 * // With stagger effect for children
 * <AnimatedSection animation="fadeInLeft" stagger={0.1}>
 *   <AnimatedItem><div>Item 1</div></AnimatedItem>
 *   <AnimatedItem><div>Item 2</div></AnimatedItem>
 *   <AnimatedItem><div>Item 3</div></AnimatedItem>
 * </AnimatedSection>
 *
 * @example
 * // Delayed animation
 * <AnimatedSection animation="scaleIn" delay={0.3} duration={0.8}>
 *   <Card>Content</Card>
 * </AnimatedSection>
 */
export function AnimatedSection({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  stagger = 0,
  threshold = 0.1,
  triggerOnce = true,
  className = ''
}: AnimatedSectionProps) {
  const motionHooks = useMotionHooks()
  const shouldReduceMotion = motionHooks.useReducedMotion()
  const variants = shouldReduceMotion ? animationVariants.none : animationVariants[animation]
  const MotionDiv = getMotionComponent('div')

  return (
    <MotionDiv
      initial="hidden"
      whileInView="visible"
      viewport={{ once: triggerOnce, amount: threshold }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      variants={variants}
      className={className}
    >
      {children}
    </MotionDiv>
  )
}

/**
 * AnimatedItem - Individual item to be animated within AnimatedSection
 *
 * Use as children of AnimatedSection when you want stagger animations.
 * Each AnimatedItem will animate in sequence based on the stagger delay.
 *
 * @example
 * <AnimatedSection stagger={0.1}>
 *   <AnimatedItem><Feature1 /></AnimatedItem>
 *   <AnimatedItem><Feature2 /></AnimatedItem>
 *   <AnimatedItem><Feature3 /></AnimatedItem>
 * </AnimatedSection>
 */
export function AnimatedItem({
  children,
  className = ''
}: {
  /** Content to animate */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}) {
  const motionHooks = useMotionHooks()
  const shouldReduceMotion = motionHooks.useReducedMotion()
  const MotionDiv = getMotionComponent('div')

  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <MotionDiv variants={variants} className={className}>
      {children}
    </MotionDiv>
  )
}
