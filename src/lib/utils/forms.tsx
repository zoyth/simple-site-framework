// ABOUTME: Utilities for optional react-hook-form and zod integration
// ABOUTME: Provides basic HTML5 validation fallbacks when libraries not installed

import * as React from 'react'

/**
 * Check if react-hook-form is available
 */
export function hasReactHookForm(): boolean {
  try {
    require.resolve('react-hook-form')
    return true
  } catch {
    return false
  }
}

/**
 * Check if zod is available
 */
export function hasZod(): boolean {
  try {
    require.resolve('zod')
    return true
  } catch {
    return false
  }
}

/**
 * Get react-hook-form hooks or fallback
 */
export function getFormHooks() {
  if (hasReactHookForm()) {
    const rhf = require('react-hook-form')
    return {
      useForm: rhf.useForm,
      useFormContext: rhf.useFormContext,
      FormProvider: rhf.FormProvider,
      Controller: rhf.Controller,
      available: true
    }
  }

  // Fallback implementations using basic React state
  const useForm = (config?: any) => {
    const [values, setValues] = React.useState<Record<string, any>>({})
    const [errors, setErrors] = React.useState<Record<string, any>>({})

    const register = (name: string) => ({
      name,
      onChange: (e: any) => {
        const value = e.target.value
        setValues(prev => ({ ...prev, [name]: value }))
      },
      onBlur: () => {},
      ref: () => {}
    })

    const handleSubmit = (onValid: (data: any) => void) => (e: React.FormEvent) => {
      e.preventDefault()
      onValid(values)
    }

    const setValue = (name: string, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }))
    }

    const watch = (name?: string) => {
      if (name) return values[name]
      return values
    }

    return {
      register,
      handleSubmit,
      formState: { errors, isSubmitting: false },
      control: {},
      setValue,
      watch,
      reset: () => setValues({})
    }
  }

  const FormProvider = ({ children, ...props }: any) => <>{children}</>
  const useFormContext = () => ({ register: () => ({}), formState: { errors: {} } })
  const Controller = ({ render, name }: any) => render({ field: { name, onChange: () => {}, value: '' } })

  return {
    useForm,
    useFormContext,
    FormProvider,
    Controller,
    available: false
  }
}

/**
 * Get zodResolver or fallback
 */
export function getZodResolver() {
  if (hasReactHookForm() && hasZod()) {
    try {
      const { zodResolver } = require('@hookform/resolvers/zod')
      return zodResolver
    } catch {
      return undefined
    }
  }
  return undefined
}

/**
 * Get zod or fallback
 * Returns null if not available
 */
export function getZod() {
  if (hasZod()) {
    return require('zod')
  }
  return null
}
