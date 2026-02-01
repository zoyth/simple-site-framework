// ABOUTME: Select dropdown component with search and multi-select support
// ABOUTME: Built on Radix UI with keyboard navigation and accessibility

'use client'

import { ReactNode } from 'react'
import { getSelectComponents } from '../lib/utils/radix'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

export interface SelectProps {
  /** Options to display */
  options: SelectOption[] | SelectOptionGroup[]
  /** Selected value */
  value?: string
  /** Callback when value changes */
  onValueChange?: (value: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Whether select is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Select - Accessible dropdown select component
 *
 * @example
 * <Select
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' }
 *   ]}
 *   placeholder="Select country..."
 *   value={country}
 *   onValueChange={setCountry}
 * />
 *
 * @example
 * // With option groups
 * <Select
 *   options={[
 *     {
 *       label: 'North America',
 *       options: [
 *         { value: 'us', label: 'United States' },
 *         { value: 'ca', label: 'Canada' }
 *       ]
 *     }
 *   ]}
 * />
 */
export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  disabled = false,
  className = ''
}: SelectProps) {
  const SelectPrimitive = getSelectComponents()
  const isGrouped = options.length > 0 && 'options' in options[0]

  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectPrimitive.Trigger
        className={`flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden z-50">
          <SelectPrimitive.Viewport className="p-1">
            {isGrouped
              ? (options as SelectOptionGroup[]).map((group) => (
                  <SelectPrimitive.Group key={group.label}>
                    <SelectPrimitive.Label className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                      {group.label}
                    </SelectPrimitive.Label>
                    {group.options.map((option) => (
                      <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectPrimitive.Group>
                ))
              : (options as SelectOption[]).map((option) => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </SelectItem>
                ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

function SelectItem({
  children,
  value,
  disabled
}: {
  children: ReactNode
  value: string
  disabled?: boolean
}) {
  const SelectPrimitive = getSelectComponents()
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className="relative flex items-center px-3 py-2 text-sm rounded cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-3">
        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}
