// ABOUTME: Radio button component with form integration support
// ABOUTME: Includes RadioGroup for mutually exclusive option sets

'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../lib/utils/cn'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Radio label */
  label?: string
  /** Description text below label */
  description?: string
  /** Error message */
  error?: string
  /** Size variant @default 'md' */
  size?: 'sm' | 'md' | 'lg'
}

export interface RadioGroupOption {
  value: string
  label: LocalizedString | string
  description?: LocalizedString | string
  disabled?: boolean
}

export interface RadioGroupProps {
  /** Group label */
  label?: LocalizedString | string
  /** Field name (for form integration) */
  name: string
  /** Current locale for bilingual labels */
  locale?: 'en' | 'fr'
  /** Array of radio options */
  options: RadioGroupOption[]
  /** Selected value */
  value?: string
  /** Callback when selection changes */
  onChange?: (value: string) => void
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
 * Radio - Styled radio button input with label and description
 *
 * Integrates with React Hook Form and supports validation states.
 *
 * @example
 * // Basic usage
 * <Radio
 *   name="plan"
 *   value="basic"
 *   label="Basic Plan"
 *   {...register('plan')}
 * />
 *
 * @example
 * // With description and error
 * <Radio
 *   name="plan"
 *   value="pro"
 *   label="Pro Plan"
 *   description="Includes advanced features and priority support"
 *   error={errors.plan?.message}
 *   {...register('plan')}
 * />
 *
 * @example
 * // Different sizes
 * <Radio name="size" value="s" label="Small" size="sm" />
 * <Radio name="size" value="m" label="Medium" size="md" />
 * <Radio name="size" value="l" label="Large" size="lg" />
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
            type="radio"
            disabled={disabled}
            className={cn(
              sizeClasses[size],
              'border-2 text-primary transition-colors',
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

Radio.displayName = 'Radio'

/**
 * RadioGroup - Collection of mutually exclusive radio buttons
 *
 * Manages radio button selection with built-in state management.
 * Supports bilingual labels and responsive layouts.
 *
 * @example
 * // Basic usage with React Hook Form
 * const { watch, setValue } = useForm()
 * const selectedPlan = watch('plan')
 *
 * <RadioGroup
 *   name="plan"
 *   label={{ en: "Choose Plan", fr: "Choisir le plan" }}
 *   locale="en"
 *   options={[
 *     {
 *       value: 'basic',
 *       label: { en: 'Basic', fr: 'Basique' },
 *       description: { en: '$10/month', fr: '10$/mois' }
 *     },
 *     {
 *       value: 'pro',
 *       label: { en: 'Pro', fr: 'Pro' },
 *       description: { en: '$25/month', fr: '25$/mois' }
 *     },
 *     {
 *       value: 'enterprise',
 *       label: 'Enterprise',
 *       description: 'Custom pricing',
 *       disabled: true
 *     }
 *   ]}
 *   value={selectedPlan}
 *   onChange={(value) => setValue('plan', value)}
 * />
 *
 * @example
 * // Horizontal layout
 * <RadioGroup
 *   name="color"
 *   options={colorOptions}
 *   layout="horizontal"
 *   value={color}
 *   onChange={setColor}
 * />
 *
 * @example
 * // Grid layout
 * <RadioGroup
 *   name="option"
 *   options={options}
 *   layout="grid"
 *   columns={3}
 *   value={selected}
 *   onChange={setSelected}
 * />
 */
export function RadioGroup({
  label,
  name,
  locale = 'en',
  options,
  value,
  onChange,
  error,
  layout = 'vertical',
  columns = 2,
  disabled = false,
  className = ''
}: RadioGroupProps) {
  const handleChange = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue)
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
            <Radio
              key={option.value}
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              label={optionLabel}
              description={optionDescription}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled || option.disabled}
            />
          )
        })}
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  )
}
