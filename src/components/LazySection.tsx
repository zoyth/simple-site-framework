// ABOUTME: Lazy-loaded section component for code-splitting and performance
// ABOUTME: Uses React Suspense with intersection observer for on-demand loading

'use client'

import { ReactNode, ComponentType, Suspense, lazy as reactLazy } from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Skeleton } from './Skeleton'

export interface LazySectionProps {
  /** Component to lazy load */
  component: () => Promise<{ default: ComponentType<any> }>
  /** Props to pass to the lazy component */
  componentProps?: Record<string, any>
  /** Custom loading component */
  fallback?: ReactNode
  /** Load when in viewport @default true */
  loadOnView?: boolean
  /** Viewport intersection threshold @default 0.1 */
  threshold?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * LazySection - Code-split sections with lazy loading
 *
 * Automatically lazy loads components when they enter the viewport,
 * reducing initial bundle size and improving performance. Perfect for
 * below-the-fold content, heavy components, and conditional features.
 *
 * @example
 * // Lazy load a heavy features section
 * <LazySection
 *   component={() => import('./sections/FeaturesSection')}
 *   componentProps={{
 *     title: "Our Features",
 *     features: featuresData
 *   }}
 * />
 *
 * @example
 * // With custom loading skeleton
 * <LazySection
 *   component={() => import('./sections/TestimonialsSection')}
 *   fallback={
 *     <div className="py-16">
 *       <Skeleton.Card count={3} />
 *     </div>
 *   }
 *   loadOnView
 *   threshold={0.2}
 * />
 *
 * @example
 * // Load immediately (no viewport detection)
 * <LazySection
 *   component={() => import('./sections/PricingSection')}
 *   loadOnView={false}
 *   componentProps={{ locale: 'en' }}
 * />
 */
export function LazySection({
  component,
  componentProps = {},
  fallback,
  loadOnView = true,
  threshold = 0.1,
  className = ''
}: LazySectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    amount: threshold
  })

  // Load immediately if loadOnView is false, otherwise wait for viewport
  const shouldLoad = !loadOnView || isInView

  if (!shouldLoad) {
    // Render placeholder with same height to avoid layout shift
    return (
      <div ref={ref} className={className}>
        {fallback || <DefaultFallback />}
      </div>
    )
  }

  // Lazy load the component
  const LazyComponent = reactLazy(component)

  return (
    <div ref={ref} className={className}>
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...componentProps} />
      </Suspense>
    </div>
  )
}

function DefaultFallback() {
  return (
    <div className="py-16 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    </div>
  )
}

/**
 * Higher-order component to make any component lazy-loadable
 *
 * @example
 * // Create a lazy version of any component
 * const LazyFeatures = withLazyLoad(() => import('./FeaturesSection'))
 *
 * // Use it like the original component
 * <LazyFeatures title="Features" features={data} />
 *
 * @example
 * // With custom fallback
 * const LazyPricing = withLazyLoad(
 *   () => import('./PricingSection'),
 *   <div>Loading pricing...</div>
 * )
 */
export function withLazyLoad<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
): ComponentType<P> {
  const LazyComponent = reactLazy(importFunc)

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    )
  } as ComponentType<P>
}
