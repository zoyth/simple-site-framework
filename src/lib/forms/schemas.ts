// ABOUTME: Common Zod validation schemas for forms
// ABOUTME: Pre-built schemas for email, phone, URLs, passwords, etc.

import { z } from 'zod'

/**
 * Email validation schema
 * @example
 * const schema = z.object({ email: emailSchema })
 */
export const emailSchema = z.string().email()

/**
 * Phone number validation (international format)
 * Accepts formats: +1234567890, +1 (234) 567-8900, etc.
 */
export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number format'
)

/**
 * US/Canada postal code validation
 * Accepts: 12345, 12345-6789, A1A 1A1, A1A1A1
 */
export const postalCodeSchema = z.string().regex(
  /^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] ?\d[A-Z]\d)$/i,
  'Invalid postal code'
)

/**
 * Password strength validation
 * Requires: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

/**
 * URL validation schema
 */
export const urlSchema = z.string().url()

/**
 * Credit card number validation (Luhn algorithm)
 */
export const creditCardSchema = z.string().refine((value) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}, 'Invalid credit card number')

/**
 * File upload schema with type and size validation
 * @param acceptedTypes - MIME types (e.g., ['image/jpeg', 'image/png'])
 * @param maxSizeMB - Maximum file size in megabytes
 */
export function fileSchema(acceptedTypes: string[], maxSizeMB: number) {
  return z
    .instanceof(File)
    .refine(
      (file) => acceptedTypes.includes(file.type),
      `File must be one of: ${acceptedTypes.join(', ')}`
    )
    .refine(
      (file) => file.size <= maxSizeMB * 1024 * 1024,
      `File size must be less than ${maxSizeMB}MB`
    )
}

/**
 * Image file schema (JPEG, PNG, WebP)
 * @param maxSizeMB - Maximum file size in megabytes (default: 5)
 */
export function imageSchema(maxSizeMB = 5) {
  return fileSchema(['image/jpeg', 'image/png', 'image/webp'], maxSizeMB)
}

/**
 * Required string field (non-empty)
 */
export const requiredString = z.string().min(1, 'This field is required')

/**
 * Optional string field (empty string converted to undefined)
 */
export const optionalString = z.string().optional().or(z.literal(''))

/**
 * Numeric string (e.g., for phone inputs)
 */
export const numericString = z.string().regex(/^\d+$/, 'Must contain only numbers')

/**
 * Date string in ISO format
 */
export const dateString = z.string().datetime()

/**
 * Checkbox boolean (must be true)
 * Useful for "I agree to terms" checkboxes
 */
export const mustBeTrue = z.literal(true, {
  errorMap: () => ({ message: 'You must accept to continue' })
})
