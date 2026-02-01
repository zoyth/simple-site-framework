// ABOUTME: Accessible modal dialog component built on Radix UI
// ABOUTME: Provides overlay, focus trap, scroll lock, and keyboard navigation

'use client'

import { ReactNode } from 'react'
import { getMotionComponent, getAnimatePresence } from '../lib/utils/motion'
import { getDialogComponents } from '../lib/utils/radix'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  /** Whether modal is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Modal title */
  title?: string
  /** Modal description */
  description?: string
  /** Modal size @default 'md' */
  size?: ModalSize
  /** Modal content */
  children: ReactNode
  /** Whether clicking backdrop closes modal @default true */
  closeOnBackdrop?: boolean
  /** Whether ESC key closes modal @default true */
  closeOnEscape?: boolean
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-full mx-4'
}

/**
 * Modal - Accessible dialog component
 *
 * @example
 * const [open, setOpen] = useState(false)
 *
 * <Modal
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Confirm Delete"
 *   description="This action cannot be undone"
 *   size="md"
 * >
 *   <Modal.Content>
 *     <p>Are you sure you want to delete this item?</p>
 *   </Modal.Content>
 *   <Modal.Footer>
 *     <Button variant="outlined" onClick={() => setOpen(false)}>
 *       Cancel
 *     </Button>
 *     <Button variant="filled" onClick={handleDelete}>
 *       Delete
 *     </Button>
 *   </Modal.Footer>
 * </Modal>
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  children,
  closeOnBackdrop = true,
  closeOnEscape = true
}: ModalProps) {
  const MotionDiv = getMotionComponent('div')
  const AnimatePresence = getAnimatePresence()
  const Dialog = getDialogComponents()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild forceMount>
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                  onClick={closeOnBackdrop ? () => onOpenChange(false) : undefined}
                />
              </Dialog.Overlay>

              <Dialog.Content
                asChild
                forceMount
                onEscapeKeyDown={
                  closeOnEscape ? undefined : (e: KeyboardEvent) => e.preventDefault()
                }
              >
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl`}
                >
                  <div className="flex flex-col max-h-[90vh]">
                    {(title || description) && (
                      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                        {title && (
                          <Dialog.Title className="text-xl font-semibold text-gray-900">
                            {title}
                          </Dialog.Title>
                        )}
                        {description && (
                          <Dialog.Description className="mt-1 text-sm text-gray-600">
                            {description}
                          </Dialog.Description>
                        )}
                        <Dialog.Close
                          className="absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          aria-label="Close"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Dialog.Close>
                      </div>
                    )}

                    <div className="flex-1 overflow-y-auto">
                      {children}
                    </div>
                  </div>
                </MotionDiv>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/**
 * ModalContent - Content area of modal
 */
export function ModalContent({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

/**
 * ModalFooter - Footer area with actions
 */
export function ModalFooter({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  )
}

/**
 * ModalTrigger - Button that opens modal
 *
 * @example
 * <Modal.Root>
 *   <Modal.Trigger asChild>
 *     <Button>Open Modal</Button>
 *   </Modal.Trigger>
 *   <Modal.Content>...</Modal.Content>
 * </Modal.Root>
 */
export const ModalTrigger = (() => {
  const Dialog = getDialogComponents()
  return Dialog.Trigger
})()

/**
 * ModalRoot - Controlled modal root
 * Use this when you want Radix to manage the open state
 */
export const ModalRoot = (() => {
  const Dialog = getDialogComponents()
  return Dialog.Root
})()

Modal.Content = ModalContent
Modal.Footer = ModalFooter
Modal.Trigger = ModalTrigger
Modal.Root = ModalRoot
