// ABOUTME: Wrapper component for scroll-triggered entrance animations
// ABOUTME: Uses Framer Motion for smooth, performant animations with viewport detection

'use client'

import { motion, Variants, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

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
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  stagger?: number
  threshold?: number
  triggerOnce?: boolean
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
  const shouldReduceMotion = useReducedMotion()
  const variants = shouldReduceMotion ? animationVariants.none : animationVariants[animation]

  return (
    <motion.div
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
    </motion.div>
  )
}

export function AnimatedItem({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()

  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  )
}
