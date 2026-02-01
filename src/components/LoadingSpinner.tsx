// ABOUTME: Loading spinner component for async operations
// ABOUTME: Provides multiple styles and sizes with optional overlay mode

'use client'

import { getMotionComponent } from '../lib/utils/motion'

export type SpinnerStyle = 'circle' | 'dots' | 'pulse' | 'ring'
export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

export interface LoadingSpinnerProps {
  /** Spinner animation style @default 'circle' */
  style?: SpinnerStyle
  /** Spinner size @default 'md' */
  size?: SpinnerSize
  /** Optional loading text to display */
  text?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * LoadingSpinner - Animated loading indicator
 *
 * @example
 * <LoadingSpinner size="lg" text="Loading..." />
 *
 * @example
 * // Inline spinner
 * <LoadingSpinner size="sm" style="dots" />
 */
export function LoadingSpinner({
  style = 'circle',
  size = 'md',
  text,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {style === 'circle' && <CircleSpinner size={sizeClasses[size]} />}
      {style === 'dots' && <DotsSpinner size={sizeClasses[size]} />}
      {style === 'pulse' && <PulseSpinner size={sizeClasses[size]} />}
      {style === 'ring' && <RingSpinner size={sizeClasses[size]} />}
      {text && (
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  )
}

function CircleSpinner({ size }: { size: string }) {
  const MotionDiv = getMotionComponent('div')
  return (
    <MotionDiv
      className={`${size} border-4 border-gray-200 border-t-primary rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

function DotsSpinner({ size }: { size: string }) {
  const dotSize = size === 'w-4 h-4' ? 'w-2 h-2' : size === 'w-8 h-8' ? 'w-3 h-3' : size === 'w-12 h-12' ? 'w-4 h-4' : 'w-5 h-5'
  const MotionDiv = getMotionComponent('div')

  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <MotionDiv
          key={i}
          className={`${dotSize} bg-primary rounded-full`}
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

function PulseSpinner({ size }: { size: string }) {
  const MotionDiv = getMotionComponent('div')
  return (
    <MotionDiv
      className={`${size} bg-primary rounded-full`}
      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function RingSpinner({ size }: { size: string }) {
  const MotionDiv = getMotionComponent('div')
  return (
    <div className="relative">
      <MotionDiv
        className={`${size} border-4 border-primary border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <MotionDiv
        className={`absolute inset-0 ${size} border-4 border-primary-light border-b-transparent rounded-full`}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export interface LoadingOverlayProps {
  /** Content to display in overlay */
  children: React.ReactNode
  /** Spinner style @default 'circle' */
  style?: SpinnerStyle
  /** Blur backdrop @default true */
  blur?: boolean
}

/**
 * LoadingOverlay - Full-page loading overlay
 *
 * @example
 * <LoadingSpinner.Overlay>
 *   Processing payment...
 * </LoadingSpinner.Overlay>
 */
export function LoadingOverlay({
  children,
  style = 'circle',
  blur = true
}: LoadingOverlayProps) {
  const MotionDiv = getMotionComponent('div')
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 ${
        blur ? 'backdrop-blur-sm' : ''
      }`}
    >
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-xl px-8 py-6 flex flex-col items-center gap-4"
      >
        <LoadingSpinner style={style} size="lg" />
        <div className="text-gray-700 font-medium text-center">{children}</div>
      </MotionDiv>
    </MotionDiv>
  )
}

LoadingSpinner.Overlay = LoadingOverlay
