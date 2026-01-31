// ABOUTME: Toast notification system for user feedback
// ABOUTME: Provides success, error, warning, and info messages with auto-dismiss

'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ToastPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => void
  error: (message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => void
  warning: (message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => void
  info: (message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * Hook to access toast notifications
 *
 * @example
 * const toast = useToast()
 * toast.success('Changes saved!')
 * toast.error('Failed to submit form')
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export interface ToastProviderProps {
  /** Content to wrap */
  children: ReactNode
  /** Position of toast notifications @default 'top-right' */
  position?: ToastPosition
  /** Maximum number of toasts to show at once @default 5 */
  maxToasts?: number
}

/**
 * ToastProvider - Context provider for toast notifications
 *
 * Wrap your app with this provider to enable toast notifications.
 *
 * @example
 * <ToastProvider position="top-right">
 *   <YourApp />
 * </ToastProvider>
 */
export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => {
      const updated = [...prev, newToast]
      return updated.slice(-maxToasts)
    })

    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [maxToasts, removeToast])

  const success = useCallback((message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => {
    addToast({ type: 'success', message, ...options })
  }, [addToast])

  const error = useCallback((message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => {
    addToast({ type: 'error', message, ...options })
  }, [addToast])

  const warning = useCallback((message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => {
    addToast({ type: 'warning', message, ...options })
  }, [addToast])

  const info = useCallback((message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => {
    addToast({ type: 'info', message, ...options })
  }, [addToast])

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <div
        className={`fixed ${positionStyles[position]} z-50 flex flex-col gap-2 pointer-events-none`}
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const typeStyles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: (
        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const style = typeStyles[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`${style.bg} ${style.text} border rounded-lg shadow-lg px-4 py-3 pointer-events-auto min-w-[300px] max-w-md`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{toast.message}</p>
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm font-semibold underline mt-1 hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

/**
 * Simple toast function for quick notifications
 * Note: Requires ToastProvider in parent tree
 *
 * @example
 * import { toast } from '@zoyth/simple-site-framework/components'
 *
 * toast.success('Saved!')
 * toast.error('Failed to save')
 * toast.warning('Unsaved changes')
 * toast.info('New features available', {
 *   duration: 8000,
 *   action: { label: 'Learn more', onClick: () => {} }
 * })
 */
export const toast = {
  success: (message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toast', {
        detail: { type: 'success', message, ...options }
      })
      window.dispatchEvent(event)
    }
  },
  error: (message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toast', {
        detail: { type: 'error', message, ...options }
      })
      window.dispatchEvent(event)
    }
  },
  warning: (message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toast', {
        detail: { type: 'warning', message, ...options }
      })
      window.dispatchEvent(event)
    }
  },
  info: (message: string, options?: Omit<Toast, 'id' | 'type' | 'message'>) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toast', {
        detail: { type: 'info', message, ...options }
      })
      window.dispatchEvent(event)
    }
  },
}
