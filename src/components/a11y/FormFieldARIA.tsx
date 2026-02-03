// ABOUTME: ARIA-enhanced form field wrapper with comprehensive accessibility
// ABOUTME: Provides full ARIA attributes, live regions, and screen reader support

'use client';

import { ReactNode, ReactElement, cloneElement, isValidElement } from 'react';
import type { FieldError } from 'react-hook-form';
import { cn } from '../../lib/utils/cn';

export interface FormFieldARIAProps {
  /** Field label text */
  label?: string;
  /** Field name (matches form schema and input id) */
  name: string;
  /** Error object from React Hook Form */
  error?: FieldError;
  /** Optional hint text shown below input */
  hint?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Input element to render */
  children: ReactElement;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FormFieldARIA - ARIA-enhanced form field wrapper
 *
 * Provides comprehensive accessibility support including:
 * - aria-required for required fields
 * - aria-invalid for error states
 * - aria-describedby linking to hints and errors
 * - Live regions for error announcements
 * - Proper label association
 * - Screen reader optimizations
 *
 * @example Basic usage
 * ```tsx
 * <FormFieldARIA
 *   name="email"
 *   label="Email Address"
 *   error={errors.email}
 *   hint="We'll never share your email"
 *   required
 * >
 *   <input type="email" id="email" {...register('email')} />
 * </FormFieldARIA>
 * ```
 *
 * @example With textarea
 * ```tsx
 * <FormFieldARIA name="message" label="Message" required>
 *   <textarea id="message" {...register('message')} />
 * </FormFieldARIA>
 * ```
 *
 * @example With custom component
 * ```tsx
 * <FormFieldARIA name="country" label="Country" error={errors.country}>
 *   <Select id="country" options={countries} {...field} />
 * </FormFieldARIA>
 * ```
 */
export function FormFieldARIA({
  label,
  name,
  error,
  hint,
  required = false,
  disabled = false,
  children,
  className = '',
}: FormFieldARIAProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  // Build aria-describedby value
  const describedByParts: string[] = [];

  // Preserve existing aria-describedby from child
  if (isValidElement(children)) {
    const childProps = children.props as Record<string, any>;
    const existingDescribedBy = childProps['aria-describedby'];
    if (existingDescribedBy) {
      describedByParts.push(existingDescribedBy);
    }
  }

  if (hint) {
    describedByParts.push(hintId);
  }

  if (error) {
    describedByParts.push(errorId);
  }

  const ariaDescribedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

  // Clone child element with ARIA props
  const enhancedChild = isValidElement(children)
    ? cloneElement(children, {
        ...(children.props as Record<string, any>),
        'aria-required': !disabled && required ? 'true' : undefined,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': ariaDescribedBy,
        disabled: disabled || (children.props as Record<string, any>).disabled,
      } as any)
    : children;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">{enhancedChild}</div>

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
          aria-live="polite"
          aria-atomic="true"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
