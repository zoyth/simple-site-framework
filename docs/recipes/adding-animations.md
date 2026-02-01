# Recipe: Adding Animations

Guide to adding smooth, professional animations using Framer Motion.

## Overview

The framework uses Framer Motion for animations. This recipe covers:
- Basic fade and slide animations
- Stagger effects for lists
- Scroll-triggered animations
- Respecting user motion preferences
- Performance optimization

## Prerequisites

Framer Motion is a peer dependency:

```bash
npm install framer-motion
```

## Basic Animations

### Fade In

```tsx
import { motion } from 'framer-motion'

function FadeInExample() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>This fades in</h1>
    </motion.div>
  )
}
```

### Slide In

```tsx
import { motion } from 'framer-motion'

function SlideInExample() {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>This slides in from left</h1>
    </motion.div>
  )
}
```

### Fade In Up (Most Common)

```tsx
import { motion } from 'framer-motion'

function FadeInUpExample() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h1>This fades in while moving up</h1>
    </motion.div>
  )
}
```

## Stagger Animations

Animate lists with staggered timing:

```tsx
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

function StaggeredList({ items }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
    >
      {items.map((item) => (
        <motion.li key={item.id} variants={item}>
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

## Scroll-Triggered Animations

Animate when element enters viewport:

```tsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function ScrollReveal({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Usage
<ScrollReveal>
  <h2>This animates when scrolled into view</h2>
</ScrollReveal>
```

## Respecting User Preferences

Always respect `prefers-reduced-motion`:

```tsx
import { motion, useReducedMotion } from 'framer-motion'

function AccessibleAnimation({ children }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}
```

## Reusable Animation Component

Create a flexible animation wrapper:

```tsx
import { motion, useReducedMotion, useInView } from 'framer-motion'
import { useRef } from 'react'

type AnimationType = 'fadeIn' | 'fadeInUp' | 'slideInLeft' | 'slideInRight'

interface AnimatedSectionProps {
  children: React.ReactNode
  type?: AnimationType
  delay?: number
  duration?: number
  once?: boolean
}

const animations: Record<AnimationType, any> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  fadeInUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  slideInLeft: {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  slideInRight: {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  }
}

export function AnimatedSection({
  children,
  type = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  once = true
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: 0.3 })
  const shouldReduceMotion = useReducedMotion()

  const animation = animations[type]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={shouldReduceMotion ? {} : animation}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Usage
<AnimatedSection type="fadeInUp" delay={0.2}>
  <h1>Animated Heading</h1>
</AnimatedSection>
```

## Button Hover Effects

```tsx
import { motion } from 'framer-motion'

function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="px-6 py-3 bg-primary text-white rounded"
    >
      {children}
    </motion.button>
  )
}
```

## Card Hover Effects

```tsx
import { motion } from 'framer-motion'

function Card({ title, description }) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-6 bg-white rounded-lg shadow"
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  )
}
```

## Page Transitions

```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// In layout
<PageTransition>
  {children}
</PageTransition>
```

## Performance Tips

### 1. Animate Transform and Opacity

Prefer `transform` and `opacity` for best performance:

```tsx
// Good - uses GPU acceleration
<motion.div
  animate={{ x: 100, opacity: 0.5 }}
/>

// Avoid - forces layout recalculation
<motion.div
  animate={{ width: 100, marginLeft: 20 }}
/>
```

### 2. Use willChange Sparingly

```tsx
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
/>
```

### 3. Lazy Load Framer Motion

```tsx
import dynamic from 'next/dynamic'

const AnimatedSection = dynamic(
  () => import('./AnimatedSection'),
  { ssr: false }
)
```

### 4. Disable Animations on Low-End Devices

```tsx
const shouldAnimate = !shouldReduceMotion && !isLowEndDevice()

<motion.div
  animate={shouldAnimate ? { opacity: 1 } : {}}
>
  {children}
</motion.div>
```

## Common Patterns

### Hero Section Entrance

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
>
  <h1>Welcome</h1>
</motion.div>

<motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3, duration: 0.6 }}
>
  Subheadline
</motion.p>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6, duration: 0.6 }}
>
  <Button>Get Started</Button>
</motion.div>
```

### Feature Grid

```tsx
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

<motion.div
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  className="grid grid-cols-3 gap-6"
>
  {features.map((feature) => (
    <motion.div key={feature.id} variants={item}>
      <FeatureCard {...feature} />
    </motion.div>
  ))}
</motion.div>
```

## Best Practices

1. **Keep it Subtle**
   - Duration: 0.3-0.8s
   - Easing: 'easeOut' or 'easeInOut'
   - Movement: 20-50px max

2. **Respect Preferences**
   - Always use `useReducedMotion()`
   - Provide alternative feedback

3. **Performance**
   - Animate transform and opacity only
   - Use `whileInView` for scroll animations
   - Lazy load when possible

4. **Purpose**
   - Guide attention
   - Provide feedback
   - Establish hierarchy
   - Don't animate for decoration only

5. **Accessibility**
   - Don't rely on animation to convey information
   - Provide text alternatives
   - Keep animations brief
   - Test with animations disabled

## Timing Guidelines

- **Micro-interactions**: 100-300ms
- **Component entrance**: 300-600ms
- **Page transitions**: 300-500ms
- **Stagger delay**: 50-150ms between items
- **Hover effects**: 200-300ms

## Easing Functions

- **easeOut**: Starting fast, ending slow (most common)
- **easeIn**: Starting slow, ending fast (exits)
- **easeInOut**: Slow start and end (smooth)
- **spring**: Bouncy, playful feel
- **linear**: Robotic, avoid for most cases
