// ABOUTME: Textarea component for multi-line text input in forms
// ABOUTME: Supports validation states, character counting, and proper accessibility

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils/cn';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text for the textarea
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below textarea
   */
  helperText?: string;

  /**
   * Full width textarea
   */
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className,
      id,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5', { 'w-full': fullWidth })}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-semibold text-slate-700"
          >
            {label}
            {required && <span className="text-primary ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          rows={rows}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          className={cn(
            'flex min-h-[120px] w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3',
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
            id={`${textareaId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
