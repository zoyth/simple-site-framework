// ABOUTME: ARIA-enhanced radio group with comprehensive accessibility
// ABOUTME: Provides proper radiogroup semantics, group ARIA attributes, and screen reader support

'use client';

import { cn } from '../../lib/utils/cn';
import type { LocalizedString } from '../../lib/i18n/types';
import { getLocalizedString } from '../../lib/content/utils';

export interface RadioGroupARIAOption {
  value: string;
  label: LocalizedString | string;
  description?: LocalizedString | string;
  disabled?: boolean;
}

export interface RadioGroupARIAProps {
  /** Field name (for form integration) */
  name: string;
  /** Group label */
  label: LocalizedString | string;
  /** Current locale for localized labels */
  locale?: string;
  /** Array of radio options */
  options: RadioGroupARIAOption[];
  /** Selected value */
  value?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Error message */
  error?: string;
  /** Whether group is required */
  required?: boolean;
  /** Disabled state for entire group */
  disabled?: boolean;
  /** Display layout */
  layout?: 'vertical' | 'horizontal' | 'grid';
  /** Grid columns (only for grid layout) */
  columns?: 2 | 3 | 4;
  /** Additional CSS classes */
  className?: string;
}

/**
 * RadioGroupARIA - ARIA-enhanced radio button group
 *
 * Provides comprehensive accessibility for radio groups including:
 * - Proper fieldset/legend structure
 * - role="radiogroup" with aria-labelledby
 * - aria-required for required groups
 * - aria-invalid for error states
 * - aria-describedby linking to errors
 * - Individual radio ARIA support
 * - Screen reader announcements
 *
 * @example Basic usage
 * ```tsx
 * <RadioGroupARIA
 *   name="plan"
 *   label="Choose Plan"
 *   options={[
 *     { value: 'basic', label: 'Basic Plan' },
 *     { value: 'pro', label: 'Pro Plan' },
 *     { value: 'enterprise', label: 'Enterprise Plan' }
 *   ]}
 *   value={selectedPlan}
 *   onChange={setSelectedPlan}
 * />
 * ```
 *
 * @example With error and required
 * ```tsx
 * <RadioGroupARIA
 *   name="plan"
 *   label="Choose Plan"
 *   options={options}
 *   value={selected}
 *   onChange={setSelected}
 *   required
 *   error="Please select a plan"
 * />
 * ```
 *
 * @example With localization
 * ```tsx
 * <RadioGroupARIA
 *   name="plan"
 *   label={{ en: 'Choose Plan', fr: 'Choisir le plan' }}
 *   locale="fr"
 *   options={[
 *     { value: 'basic', label: { en: 'Basic Plan', fr: 'Plan Basique' } }
 *   ]}
 * />
 * ```
 */
export function RadioGroupARIA({
  name,
  label,
  locale = 'en',
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  layout = 'vertical',
  columns = 2,
  className = '',
}: RadioGroupARIAProps) {
  const legendId = `${name}-legend`;
  const errorId = `${name}-error`;

  const handleChange = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  const layoutClasses = {
    vertical: 'flex flex-col space-y-3',
    horizontal: 'flex flex-wrap gap-6',
    grid: `grid gap-4 ${
      columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }`,
  };

  const labelText = typeof label === 'string' ? label : getLocalizedString(label, locale);

  return (
    <fieldset
      role="radiogroup"
      aria-labelledby={legendId}
      aria-required={required ? 'true' : undefined}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? errorId : undefined}
      disabled={disabled}
      className={cn('border-0 p-0 m-0', className)}
    >
      <legend id={legendId} className="block text-sm font-semibold text-gray-900 mb-3">
        {labelText}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className={layoutClasses[layout]}>
        {options.map((option) => {
          const optionLabel =
            typeof option.label === 'string'
              ? option.label
              : getLocalizedString(option.label, locale);

          const optionDescription = option.description
            ? typeof option.description === 'string'
              ? option.description
              : getLocalizedString(option.description, locale)
            : undefined;

          const radioId = `${name}-${option.value}`;
          const isChecked = value === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <div key={option.value} className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={() => handleChange(option.value)}
                  disabled={isDisabled}
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? errorId : undefined}
                  className={cn(
                    'h-5 w-5 border-2 text-primary transition-colors',
                    'focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    error
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                />
              </div>
              {(optionLabel || optionDescription) && (
                <div className="ml-3 flex-1">
                  {optionLabel && (
                    <label
                      htmlFor={radioId}
                      className={cn(
                        'text-base font-medium leading-tight',
                        isDisabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-900 cursor-pointer'
                      )}
                    >
                      {optionLabel}
                    </label>
                  )}
                  {optionDescription && (
                    <p
                      className={cn(
                        'text-sm text-gray-500 mt-1',
                        isDisabled && 'text-gray-400'
                      )}
                    >
                      {optionDescription}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 mt-2"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}
