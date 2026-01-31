// ABOUTME: Form field wrapper component with React Hook Form integration
// ABOUTME: Provides label, error display, hint text, and validation state

'use client'

import { ReactNode } from 'react'
import type { FieldError } from 'react-hook-form'

export interface FormFieldProps {
  /** Field label text */
  label?: string
  /** Field name (matches form schema) */
  name: string
  /** Error object from React Hook Form */
  error?: FieldError
  /** Optional hint text shown below input */
  hint?: string
  /** Whether field is required */
  required?: boolean
  /** Input element to render */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * FormField - Wrapper for form inputs with label and error display
 *
 * @example
 * <FormField
 *   name="email"
 *   label="Email Address"
 *   error={errors.email}
 *   hint="We'll never share your email"
 *   required
 * >
 *   <Input type="email" {...register('email')} />
 * </FormField>
 *
 * @example
 * // With Controller for custom components
 * <FormField name="country" label="Country" error={errors.country}>
 *   <Controller
 *     name="country"
 *     control={control}
 *     render={({ field }) => <Select {...field} options={countries} />}
 *   />
 * </FormField>
 */
export function FormField({
  label,
  name,
  error,
  hint,
  required = false,
  children,
  className = ''
}: FormFieldProps) {
  const errorId = `${name}-error`
  const hintId = `${name}-hint`

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {children}
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error.message}
        </p>
      )}
    </div>
  )
}

/**
 * FormGroup - Group multiple fields with a common label
 *
 * @example
 * <FormGroup label="Address" description="Your billing address">
 *   <FormField name="street" label="Street">
 *     <Input {...register('street')} />
 *   </FormField>
 *   <FormField name="city" label="City">
 *     <Input {...register('city')} />
 *   </FormField>
 * </FormGroup>
 */
export function FormGroup({
  label,
  description,
  children,
  className = ''
}: {
  /** Group label */
  label?: string
  /** Optional description text */
  description?: string
  /** Form fields */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}) {
  return (
    <fieldset className={className}>
      {label && (
        <legend className="text-base font-semibold text-gray-900 mb-1">
          {label}
        </legend>
      )}
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  )
}
