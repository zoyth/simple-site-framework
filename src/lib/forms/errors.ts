// ABOUTME: Bilingual error messages for form validation
// ABOUTME: Provides French and English translations for common validation errors

import type { Locale } from '../i18n/config'

export const formErrorMessages = {
  required: {
    en: 'This field is required',
    fr: 'Ce champ est obligatoire'
  },
  email: {
    en: 'Please enter a valid email address',
    fr: 'Veuillez entrer une adresse e-mail valide'
  },
  phone: {
    en: 'Please enter a valid phone number',
    fr: 'Veuillez entrer un numéro de téléphone valide'
  },
  url: {
    en: 'Please enter a valid URL',
    fr: 'Veuillez entrer une URL valide'
  },
  password: {
    tooShort: {
      en: 'Password must be at least 8 characters',
      fr: 'Le mot de passe doit contenir au moins 8 caractères'
    },
    noUppercase: {
      en: 'Password must contain at least one uppercase letter',
      fr: 'Le mot de passe doit contenir au moins une lettre majuscule'
    },
    noLowercase: {
      en: 'Password must contain at least one lowercase letter',
      fr: 'Le mot de passe doit contenir au moins une lettre minuscule'
    },
    noNumber: {
      en: 'Password must contain at least one number',
      fr: 'Le mot de passe doit contenir au moins un chiffre'
    }
  },
  postalCode: {
    en: 'Invalid postal code',
    fr: 'Code postal invalide'
  },
  creditCard: {
    en: 'Invalid credit card number',
    fr: 'Numéro de carte de crédit invalide'
  },
  file: {
    tooLarge: {
      en: (maxSize: number) => `File size must be less than ${maxSize}MB`,
      fr: (maxSize: number) => `La taille du fichier doit être inférieure à ${maxSize}Mo`
    },
    invalidType: {
      en: (types: string[]) => `File must be one of: ${types.join(', ')}`,
      fr: (types: string[]) => `Le fichier doit être de type : ${types.join(', ')}`
    }
  },
  mustAccept: {
    en: 'You must accept to continue',
    fr: 'Vous devez accepter pour continuer'
  },
  minLength: {
    en: (min: number) => `Must be at least ${min} characters`,
    fr: (min: number) => `Doit contenir au moins ${min} caractères`
  },
  maxLength: {
    en: (max: number) => `Must be no more than ${max} characters`,
    fr: (max: number) => `Ne doit pas dépasser ${max} caractères`
  },
  min: {
    en: (min: number) => `Must be at least ${min}`,
    fr: (min: number) => `Doit être au moins ${min}`
  },
  max: {
    en: (max: number) => `Must be no more than ${max}`,
    fr: (max: number) => `Ne doit pas dépasser ${max}`
  },
  invalidFormat: {
    en: 'Invalid format',
    fr: 'Format invalide'
  }
} as const

/**
 * Get localized error message
 * @param key - Error message key
 * @param locale - Current locale
 * @param params - Optional parameters for dynamic messages
 */
export function getErrorMessage(
  key: keyof typeof formErrorMessages,
  locale: Locale = 'en',
  params?: any
): string {
  const message = formErrorMessages[key] as any
  if (!message) return ''

  const localized = message[locale]
  if (typeof localized === 'function') {
    return localized(params)
  }

  return localized || ''
}
