// ABOUTME: ARIA-enhanced checkbox group with comprehensive accessibility
// ABOUTME: Provides proper fieldset/legend semantics, group ARIA attributes, and screen reader support

'use client';

import { cn } from '../../lib/utils/cn';
import type { LocalizedString } from '../../lib/i18n/types';
import { getLocalizedString } from '../../lib/content/utils';

export interface CheckboxGroupARIAOption {
  value: string;
  label: LocalizedString | string;
  description?: LocalizedString | string;
  disabled?: boolean;
}

export interface CheckboxGroupARIAProps {
  /** Field name (for form integration) */
  name: string;
  /** Group label */
  label: LocalizedString | string;
  /** Current locale for localized labels */
  locale?: string;
  /** Array of checkbox options */
  options: CheckboxGroupARIAOption[];
  /** Selected values */
  value?: string[];
  /** Callback when selection changes */
  onChange?: (value: string[]) => void;
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
 * CheckboxGroupARIA - ARIA-enhanced checkbox group
 *
 * Provides comprehensive accessibility for checkbox groups including:
 * - Proper fieldset/legend structure
 * - role="group" with aria-labelledby
 * - aria-required for required groups
 * - aria-invalid for error states
 * - aria-describedby linking to errors
 * - Individual checkbox ARIA support
 * - Screen reader announcements
 *
 * @example Basic usage
 * ```tsx
 * <CheckboxGroupARIA
 *   name="features"
 *   label="Select Features"
 *   options={[
 *     { value: 'analytics', label: 'Analytics' },
 *     { value: 'reporting', label: 'Reporting' },
 *     { value: 'api', label: 'API Access' }
 *   ]}
 *   value={selectedFeatures}
 *   onChange={setSelectedFeatures}
 * />
 * ```
 *
 * @example With error and required
 * ```tsx
 * <CheckboxGroupARIA
 *   name="features"
 *   label="Select Features"
 *   options={options}
 *   value={selected}
 *   onChange={setSelected}
 *   required
 *   error="Please select at least one feature"
 * />
 * ```
 *
 * @example With localization
 * ```tsx
 * <CheckboxGroupARIA
 *   name="features"
 *   label={{ en: 'Select Features', fr: 'Sélectionner les fonctionnalités' }}
 *   locale="fr"
 *   options={[
 *     { value: 'analytics', label: { en: 'Analytics', fr: 'Analytique' } }
 *   ]}
 * />
 * ```
 */
export function CheckboxGroupARIA({
  name,
  label,
  locale = 'en',
  options,
  value = [],
  onChange,
  error,
  required = false,
  disabled = false,
  layout = 'vertical',
  columns = 2,
  className = '',
}: CheckboxGroupARIAProps) {
  const legendId = `${name}-legend`;
  const errorId = `${name}-error`;

  const handleChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;

    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
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
      role="group"
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

          const checkboxId = `${name}-${option.value}`;
          const isChecked = value.includes(option.value);
          const isDisabled = disabled || option.disabled;

          return (
            <div key={option.value} className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id={checkboxId}
                  checked={isChecked}
                  onChange={(e) => handleChange(option.value, e.target.checked)}
                  disabled={isDisabled}
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? errorId : undefined}
                  className={cn(
                    'h-5 w-5 rounded border-2 text-primary transition-colors',
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
                      htmlFor={checkboxId}
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
