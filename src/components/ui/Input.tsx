// ABOUTME: Text input component for forms
// ABOUTME: Supports different types, validation states, and proper accessibility

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text for the input
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below input
   */
  helperText?: string;

  /**
   * Full width input
   */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5', { 'w-full': fullWidth })}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-700"
          >
            {label}
            {required && <span className="text-primary ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          className={cn(
            'flex h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3',
            'text-base text-slate-900 placeholder:text-slate-400',
            'transition-all duration-200',
            'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
            'hover:border-slate-300',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            {
              'border-red-500 focus:border-red-500 focus:ring-red-500/10': error,
            },
            className
          )}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
