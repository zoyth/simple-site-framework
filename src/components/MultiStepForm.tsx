// ABOUTME: Multi-step form component with progress tracking
// ABOUTME: Manages form state across steps with validation and navigation

'use client'

import { ReactNode, useState, createContext, useContext, ReactElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils/cn'
import { Button } from './ui/Button'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface MultiStepFormProps {
  /** Current locale */
  locale?: 'en' | 'fr'
  /** Form steps */
  children: ReactElement<StepProps>[]
  /** Callback when form is completed */
  onComplete?: (data: any) => void | Promise<void>
  /** Show progress bar @default true */
  showProgress?: boolean
  /** Allow navigation to previous steps @default true */
  allowBack?: boolean
  /** Additional CSS classes */
  className?: string
}

export interface StepProps {
  /** Step title (bilingual) */
  title: LocalizedString | string
  /** Step description (bilingual) */
  description?: LocalizedString | string
  /** Validation function - return true if valid, error message if invalid */
  validate?: () => boolean | string | Promise<boolean | string>
  /** Step content */
  children: ReactNode
}

interface MultiStepFormContextValue {
  currentStep: number
  totalSteps: number
  goToNext: () => void
  goToPrevious: () => void
  goToStep: (step: number) => void
  isFirstStep: boolean
  isLastStep: boolean
  locale: 'en' | 'fr'
}

const MultiStepFormContext = createContext<MultiStepFormContextValue | undefined>(undefined)

const labels = {
  next: { en: 'Next', fr: 'Suivant' },
  previous: { en: 'Previous', fr: 'Précédent' },
  submit: { en: 'Submit', fr: 'Soumettre' },
  step: { en: 'Step', fr: 'Étape' },
  of: { en: 'of', fr: 'de' }
}

/**
 * MultiStepForm - Multi-step form with progress tracking
 *
 * Manages form state across multiple steps with validation, navigation,
 * and smooth transitions between steps.
 *
 * @example
 * // Basic usage
 * <MultiStepForm
 *   locale="en"
 *   onComplete={(data) => console.log('Form completed', data)}
 * >
 *   <MultiStepForm.Step
 *     title={{ en: "Personal Info", fr: "Informations personnelles" }}
 *     description="Tell us about yourself"
 *   >
 *     <FormField label="Name">
 *       <input type="text" {...register('name')} />
 *     </FormField>
 *   </MultiStepForm.Step>
 *
 *   <MultiStepForm.Step
 *     title="Contact"
 *     validate={async () => {
 *       const isValid = await validateEmail(email)
 *       return isValid || 'Invalid email'
 *     }}
 *   >
 *     <FormField label="Email">
 *       <input type="email" {...register('email')} />
 *     </FormField>
 *   </MultiStepForm.Step>
 *
 *   <MultiStepForm.Step title="Confirm">
 *     <p>Review your information...</p>
 *   </MultiStepForm.Step>
 * </MultiStepForm>
 *
 * @example
 * // With custom navigation
 * <MultiStepForm
 *   showProgress
 *   allowBack
 *   onComplete={handleSubmit}
 * >
 *   <MultiStepForm.Step title="Step 1">
 *     ...
 *   </MultiStepForm.Step>
 * </MultiStepForm>
 */
export function MultiStepForm({
  locale = 'en',
  children,
  onComplete,
  showProgress = true,
  allowBack = true,
  className = ''
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const steps = Array.isArray(children) ? children : [children]
  const totalSteps = steps.length
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepElement = steps[currentStep]
    if (!currentStepElement.props.validate) return true

    const result = await currentStepElement.props.validate()

    if (result === true) {
      setError('')
      return true
    }

    if (typeof result === 'string') {
      setError(result)
      return false
    }

    return false
  }

  const goToNext = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    if (isLastStep && onComplete) {
      setIsSubmitting(true)
      try {
        await onComplete({})
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
      setError('')
    }
  }

  const goToPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    setError('')
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
      setError('')
    }
  }

  const contextValue: MultiStepFormContextValue = {
    currentStep,
    totalSteps,
    goToNext,
    goToPrevious,
    goToStep,
    isFirstStep,
    isLastStep,
    locale
  }

  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>
        {showProgress && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {getLocalizedString(labels.step, locale)} {currentStep + 1}{' '}
                {getLocalizedString(labels.of, locale)} {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div>
            {!isFirstStep && allowBack && (
              <Button
                variant="text"
                onClick={goToPrevious}
                disabled={isSubmitting}
              >
                ← {getLocalizedString(labels.previous, locale)}
              </Button>
            )}
          </div>

          <Button
            variant="filled"
            onClick={goToNext}
            disabled={isSubmitting}
          >
            {isLastStep
              ? getLocalizedString(labels.submit, locale)
              : getLocalizedString(labels.next, locale)}
            {!isLastStep && ' →'}
          </Button>
        </div>
      </div>
    </MultiStepFormContext.Provider>
  )
}

/**
 * Step - Individual step in a multi-step form
 *
 * Must be used as a child of MultiStepForm component.
 */
function Step({ title, description, children }: StepProps) {
  const context = useContext(MultiStepFormContext)

  if (!context) {
    throw new Error('Step must be used within MultiStepForm')
  }

  const { locale } = context

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
          {typeof title === 'string' ? title : getLocalizedString(title, locale)}
        </h3>
        {description && (
          <p className="text-gray-600 font-body">
            {typeof description === 'string'
              ? description
              : getLocalizedString(description, locale)}
          </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}

/**
 * Hook to access multi-step form context
 *
 * Provides access to current step, navigation functions, and form state.
 *
 * @example
 * function CustomStep() {
 *   const { currentStep, goToNext, goToPrevious } = useMultiStepForm()
 *
 *   return (
 *     <div>
 *       <p>Current step: {currentStep}</p>
 *       <button onClick={goToPrevious}>Back</button>
 *       <button onClick={goToNext}>Next</button>
 *     </div>
 *   )
 * }
 */
export function useMultiStepForm() {
  const context = useContext(MultiStepFormContext)
  if (!context) {
    throw new Error('useMultiStepForm must be used within MultiStepForm')
  }
  return context
}

// Attach Step as a static property
MultiStepForm.Step = Step
