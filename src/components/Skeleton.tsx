// ABOUTME: Skeleton loading placeholders for better perceived performance
// ABOUTME: Provides shimmer animation and pre-built component variants

'use client'

import { getMotionComponent } from '../lib/utils/motion'

export type SkeletonAnimation = 'pulse' | 'shimmer'

export interface SkeletonProps {
  /** Width of skeleton (CSS value) @default '100%' */
  width?: string | number
  /** Height of skeleton (CSS value) @default '1rem' */
  height?: string | number
  /** Border radius @default '0.25rem' */
  radius?: string | number
  /** Animation style @default 'shimmer' */
  animation?: SkeletonAnimation
  /** Additional CSS classes */
  className?: string
}

/**
 * Skeleton - Loading placeholder with animation
 *
 * @example
 * <Skeleton width="100%" height="200px" />
 *
 * @example
 * <Skeleton width={120} height={20} radius="9999px" />
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  radius = '0.25rem',
  animation = 'shimmer',
  className = ''
}: SkeletonProps) {
  const widthValue = typeof width === 'number' ? `${width}px` : width
  const heightValue = typeof height === 'number' ? `${height}px` : height
  const radiusValue = typeof radius === 'number' ? `${radius}px` : radius
  const MotionDiv = getMotionComponent('div')

  if (animation === 'pulse') {
    return (
      <MotionDiv
        className={`bg-gray-200 ${className}`}
        style={{
          width: widthValue,
          height: heightValue,
          borderRadius: radiusValue
        }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    )
  }

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{
        width: widthValue,
        height: heightValue,
        borderRadius: radiusValue
      }}
    >
      <MotionDiv
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

/**
 * SkeletonText - Multiple lines of text skeleton
 *
 * @example
 * <SkeletonText lines={3} />
 */
export function SkeletonText({
  lines = 3,
  className = ''
}: {
  /** Number of text lines @default 3 */
  lines?: number
  /** Additional CSS classes */
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '80%' : '100%'}
          height="1rem"
        />
      ))}
    </div>
  )
}

/**
 * SkeletonCard - Card layout skeleton
 *
 * @example
 * <SkeletonCard lines={3} />
 */
export function SkeletonCard({
  lines = 3,
  showImage = true,
  className = ''
}: {
  /** Number of text lines @default 3 */
  lines?: number
  /** Show image placeholder @default true */
  showImage?: boolean
  /** Additional CSS classes */
  className?: string
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {showImage && <Skeleton height="200px" />}
      <div className="space-y-3">
        <Skeleton width="60%" height="1.5rem" />
        <SkeletonText lines={lines} />
      </div>
    </div>
  )
}

/**
 * SkeletonAvatar - Circular avatar skeleton
 *
 * @example
 * <SkeletonAvatar size={48} />
 */
export function SkeletonAvatar({
  size = 40,
  className = ''
}: {
  /** Avatar size in pixels @default 40 */
  size?: number
  /** Additional CSS classes */
  className?: string
}) {
  return (
    <Skeleton
      width={size}
      height={size}
      radius="9999px"
      className={className}
    />
  )
}

/**
 * SkeletonButton - Button skeleton
 *
 * @example
 * <SkeletonButton />
 */
export function SkeletonButton({
  width = 120,
  height = 40,
  className = ''
}: {
  /** Button width @default 120 */
  width?: number
  /** Button height @default 40 */
  height?: number
  /** Additional CSS classes */
  className?: string
}) {
  return (
    <Skeleton
      width={width}
      height={height}
      radius="0.375rem"
      className={className}
    />
  )
}

/**
 * SkeletonImage - Image placeholder skeleton
 *
 * @example
 * <SkeletonImage width="100%" height="300px" />
 */
export function SkeletonImage({
  width = '100%',
  height = '200px',
  className = ''
}: {
  /** Image width @default '100%' */
  width?: string | number
  /** Image height @default '200px' */
  height?: string | number
  /** Additional CSS classes */
  className?: string
}) {
  return (
    <Skeleton
      width={width}
      height={height}
      className={className}
    />
  )
}

Skeleton.Text = SkeletonText
Skeleton.Card = SkeletonCard
Skeleton.Avatar = SkeletonAvatar
Skeleton.Button = SkeletonButton
Skeleton.Image = SkeletonImage
