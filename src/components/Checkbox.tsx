// ABOUTME: Checkbox component with form integration support
// ABOUTME: Includes CheckboxGroup for multiple checkbox collections

'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../lib/utils/cn'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Checkbox label */
  label?: string
  /** Description text below label */
  description?: string
  /** Error message */
  error?: string
  /** Size variant @default 'md' */
  size?: 'sm' | 'md' | 'lg'
}

export interface CheckboxGroupOption {
  value: string
  label: LocalizedString | string
  description?: LocalizedString | string
  disabled?: boolean
}

export interface CheckboxGroupProps {
  /** Group label */
  label?: LocalizedString | string
  /** Current locale for bilingual labels */
  locale?: 'en' | 'fr'
  /** Array of checkbox options */
  options: CheckboxGroupOption[]
  /** Selected values */
  value?: string[]
  /** Callback when selection changes */
  onChange?: (value: string[]) => void
  /** Error message */
  error?: string
  /** Display layout @default 'vertical' */
  layout?: 'vertical' | 'horizontal' | 'grid'
  /** Grid columns (only for grid layout) @default 2 */
  columns?: 2 | 3 | 4
  /** Disabled state for entire group */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Checkbox - Styled checkbox input with label and description
 *
 * Integrates with React Hook Form and supports validation states.
 *
 * @example
 * // Basic usage
 * <Checkbox
 *   label="Accept terms and conditions"
 *   {...register('terms')}
 * />
 *
 * @example
 * // With description and error
 * <Checkbox
 *   label="Subscribe to newsletter"
 *   description="Get weekly updates about new features"
 *   error={errors.newsletter?.message}
 *   {...register('newsletter')}
 * />
 *
 * @example
 * // Different sizes
 * <Checkbox label="Small" size="sm" />
 * <Checkbox label="Medium" size="md" />
 * <Checkbox label="Large" size="lg" />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, size = 'md', className, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }

    return (
      <div className={cn('flex items-start', className)}>
        <div className="flex h-5 items-center">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className={cn(
              sizeClasses[size],
              'rounded border-2 text-primary transition-colors',
              'focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 hover:border-gray-400'
            )}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3 flex-1">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  labelSizeClasses[size],
                  'font-medium leading-tight',
                  disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 cursor-pointer'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className={cn(
                  'text-sm text-gray-500 mt-1',
                  disabled && 'text-gray-400'
                )}
              >
                {description}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

/**
 * CheckboxGroup - Collection of related checkboxes
 *
 * Manages multiple checkbox selections with built-in state management.
 * Supports bilingual labels and responsive layouts.
 *
 * @example
 * // Basic usage with React Hook Form
 * const { watch, setValue } = useForm()
 * const selectedFeatures = watch('features') || []
 *
 * <CheckboxGroup
 *   label={{ en: "Select Features", fr: "Sélectionner les fonctionnalités" }}
 *   locale="en"
 *   options={[
 *     { value: 'analytics', label: { en: 'Analytics', fr: 'Analytique' } },
 *     { value: 'reporting', label: { en: 'Reporting', fr: 'Rapports' } },
 *     { value: 'api', label: 'API Access', disabled: true }
 *   ]}
 *   value={selectedFeatures}
 *   onChange={(values) => setValue('features', values)}
 * />
 *
 * @example
 * // Grid layout
 * <CheckboxGroup
 *   options={options}
 *   layout="grid"
 *   columns={3}
 *   value={selected}
 *   onChange={setSelected}
 * />
 */
export function CheckboxGroup({
  label,
  locale = 'en',
  options,
  value = [],
  onChange,
  error,
  layout = 'vertical',
  columns = 2,
  disabled = false,
  className = ''
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return

    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v) => v !== optionValue))
    }
  }

  const layoutClasses = {
    vertical: 'flex flex-col space-y-3',
    horizontal: 'flex flex-wrap gap-6',
    grid: `grid gap-4 ${
      columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }`
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {typeof label === 'string' ? label : getLocalizedString(label, locale)}
        </label>
      )}

      <div className={layoutClasses[layout]}>
        {options.map((option) => {
          const optionLabel =
            typeof option.label === 'string'
              ? option.label
              : getLocalizedString(option.label, locale)

          const optionDescription = option.description
            ? typeof option.description === 'string'
              ? option.description
              : getLocalizedString(option.description, locale)
            : undefined

          return (
            <Checkbox
              key={option.value}
              id={option.value}
              label={optionLabel}
              description={optionDescription}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={disabled || option.disabled}
            />
          )
        })}
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  )
}
