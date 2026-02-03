// ABOUTME: Contact form component with validation and accessibility
// ABOUTME: React Hook Form + Zod validation for reliable contact forms

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField } from '../FormField';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils/cn';
import type { LocalizedString } from '../../lib/i18n/types';
import { getLocalizedString } from '../../lib/content/utils';

/**
 * Contact form field configuration
 */
export interface ContactFormField {
  /** Field name/id */
  name: string;
  /** Field label */
  label: LocalizedString | string;
  /** Field type */
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  /** Placeholder text */
  placeholder?: LocalizedString | string;
  /** Whether field is required */
  required?: boolean;
  /** Number of rows for textarea */
  rows?: number;
  /** Help text */
  helperText?: LocalizedString | string;
}

/**
 * Contact form submission data
 */
export interface ContactFormData {
  [key: string]: string;
}

/**
 * Contact form submission response
 */
export interface ContactFormResponse {
  /** Whether submission was successful */
  success: boolean;
  /** Response message */
  message?: string;
  /** Error details if failed */
  error?: string;
}

export interface ContactFormProps {
  /** Form title */
  title?: LocalizedString | string;
  /** Form description */
  description?: LocalizedString | string;
  /** Array of form fields */
  fields?: ContactFormField[];
  /** Submit button text */
  submitText?: LocalizedString | string;
  /** Success message */
  successMessage?: LocalizedString | string;
  /** Error message */
  errorMessage?: LocalizedString | string;
  /** Form submission handler */
  onSubmit: (data: ContactFormData) => Promise<ContactFormResponse>;
  /** Current locale for i18n */
  locale?: string;
  /** Additional CSS classes */
  className?: string;
  /** Show privacy notice */
  showPrivacyNotice?: boolean;
  /** Privacy notice text */
  privacyNoticeText?: LocalizedString | string;
  /** Privacy policy URL */
  privacyPolicyUrl?: string;
  /** Enable honeypot spam protection */
  enableHoneypot?: boolean;
}

// Default fields if none provided
const defaultFields: ContactFormField[] = [
  {
    name: 'name',
    label: { en: 'Full Name', fr: 'Nom complet' },
    type: 'text',
    placeholder: { en: 'John Doe', fr: 'Jean Dupont' },
    required: true,
  },
  {
    name: 'email',
    label: { en: 'Email Address', fr: 'Adresse e-mail' },
    type: 'email',
    placeholder: { en: 'john@example.com', fr: 'jean@exemple.fr' },
    required: true,
  },
  {
    name: 'phone',
    label: { en: 'Phone Number', fr: 'Numéro de téléphone' },
    type: 'tel',
    placeholder: { en: '+1 (555) 123-4567', fr: '+33 1 23 45 67 89' },
    required: false,
  },
  {
    name: 'message',
    label: { en: 'Message', fr: 'Message' },
    type: 'textarea',
    placeholder: { en: 'How can we help you?', fr: 'Comment pouvons-nous vous aider ?' },
    required: true,
    rows: 5,
  },
];

/**
 * Contact Form Component
 *
 * Production-ready contact form with validation, accessibility,
 * and spam protection.
 *
 * @example Basic usage
 * ```tsx
 * <ContactForm
 *   onSubmit={async (data) => {
 *     const response = await fetch('/api/contact', {
 *       method: 'POST',
 *       body: JSON.stringify(data),
 *     });
 *     return response.json();
 *   }}
 * />
 * ```
 *
 * @example Custom fields
 * ```tsx
 * <ContactForm
 *   fields={[
 *     { name: 'name', label: 'Name', type: 'text', required: true },
 *     { name: 'email', label: 'Email', type: 'email', required: true },
 *     { name: 'company', label: 'Company', type: 'text', required: false },
 *     { name: 'message', label: 'Message', type: 'textarea', required: true, rows: 6 }
 *   ]}
 *   onSubmit={handleSubmit}
 * />
 * ```
 *
 * @example With privacy notice
 * ```tsx
 * <ContactForm
 *   showPrivacyNotice={true}
 *   privacyPolicyUrl="/privacy"
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export function ContactForm({
  title,
  description,
  fields = defaultFields,
  submitText,
  successMessage,
  errorMessage,
  onSubmit,
  locale = 'en',
  className,
  showPrivacyNotice = true,
  privacyNoticeText,
  privacyPolicyUrl = '/privacy',
  enableHoneypot = true,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');

  // Build Zod schema dynamically from fields
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email({
          message: 'Please enter a valid email address',
        });
        break;
      case 'tel':
        fieldSchema = z.string().regex(/^[\d\s\-\+\(\)]+$/, {
          message: 'Please enter a valid phone number',
        });
        break;
      case 'url':
        fieldSchema = z.string().url({
          message: 'Please enter a valid URL',
        });
        break;
      default:
        fieldSchema = z.string();
    }

    if (field.required) {
      fieldSchema = (fieldSchema as z.ZodString).min(1, { message: 'This field is required' });
    } else {
      fieldSchema = fieldSchema.optional().or(z.literal(''));
    }

    schemaFields[field.name] = fieldSchema;
  });

  // Add honeypot field (hidden spam trap)
  if (enableHoneypot) {
    schemaFields['_honeypot'] = z.string().max(0);
  }

  const contactFormSchema = z.object(schemaFields);
  type ContactFormSchema = z.infer<typeof contactFormSchema>;

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
  });

  const handleSubmit = async (data: ContactFormSchema) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Check honeypot
      if (enableHoneypot && data._honeypot) {
        throw new Error('Spam detected');
      }

      // Remove honeypot from submission
      const { _honeypot, ...submitData } = data;

      const response = await onSubmit(submitData);

      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage(
          response.message ||
            (successMessage
              ? typeof successMessage === 'string'
                ? successMessage
                : getLocalizedString(successMessage, locale)
              : 'Thank you! We will get back to you soon.')
        );
        reset();
      } else {
        throw new Error(response.error || 'Submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(
        errorMessage
          ? typeof errorMessage === 'string'
            ? errorMessage
            : getLocalizedString(errorMessage, locale)
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formTitle = title
    ? typeof title === 'string'
      ? title
      : getLocalizedString(title, locale)
    : undefined;

  const formDescription = description
    ? typeof description === 'string'
      ? description
      : getLocalizedString(description, locale)
    : undefined;

  const buttonText = submitText
    ? typeof submitText === 'string'
      ? submitText
      : getLocalizedString(submitText, locale)
    : 'Send Message';

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      {/* Header */}
      {(formTitle || formDescription) && (
        <div className="mb-8">
          {formTitle && <h2 className="text-2xl sm:text-3xl font-bold mb-3">{formTitle}</h2>}
          {formDescription && <p className="text-gray-600">{formDescription}</p>}
        </div>
      )}

      {/* Success/Error Messages */}
      {submitStatus !== 'idle' && (
        <div
          className={cn(
            'mb-6 p-4 rounded-lg',
            submitStatus === 'success' && 'bg-green-50 text-green-800 border border-green-200',
            submitStatus === 'error' && 'bg-red-50 text-red-800 border border-red-200'
          )}
          role="alert"
        >
          <p className="font-medium">{submitMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-6" noValidate>
        {fields.map((field) => {
          const label =
            typeof field.label === 'string'
              ? field.label
              : getLocalizedString(field.label, locale);

          const placeholder = field.placeholder
            ? typeof field.placeholder === 'string'
              ? field.placeholder
              : getLocalizedString(field.placeholder, locale)
            : undefined;

          const helperText = field.helperText
            ? typeof field.helperText === 'string'
              ? field.helperText
              : getLocalizedString(field.helperText, locale)
            : undefined;

          return (
            <FormField
              key={field.name}
              label={label}
              name={field.name}
              error={errors[field.name] as any}
              required={field.required}
              hint={helperText}
            >
              {field.type === 'textarea' ? (
                <textarea
                  {...register(field.name)}
                  id={field.name}
                  placeholder={placeholder}
                  rows={field.rows || 4}
                  className={cn(
                    'w-full px-4 py-2 border rounded-lg',
                    'focus:ring-2 focus:ring-primary focus:border-primary',
                    'resize-vertical',
                    errors[field.name] && 'border-red-500'
                  )}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : helperText ? `${field.name}-helper` : undefined
                  }
                  disabled={isSubmitting}
                />
              ) : (
                <input
                  {...register(field.name)}
                  type={field.type || 'text'}
                  id={field.name}
                  placeholder={placeholder}
                  className={cn(
                    'w-full px-4 py-2 border rounded-lg',
                    'focus:ring-2 focus:ring-primary focus:border-primary',
                    errors[field.name] && 'border-red-500'
                  )}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : helperText ? `${field.name}-helper` : undefined
                  }
                  disabled={isSubmitting}
                />
              )}
            </FormField>
          );
        })}

        {/* Honeypot (hidden spam trap) */}
        {enableHoneypot && (
          <div className="hidden" aria-hidden="true">
            <input
              {...register('_honeypot')}
              type="text"
              name="_honeypot"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        )}

        {/* Privacy Notice */}
        {showPrivacyNotice && (
          <p className="text-sm text-gray-600">
            {privacyNoticeText
              ? typeof privacyNoticeText === 'string'
                ? privacyNoticeText
                : getLocalizedString(privacyNoticeText, locale)
              : (
                <>
                  By submitting this form, you agree to our{' '}
                  <a
                    href={privacyPolicyUrl}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  .
                </>
              )}
          </p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="filled"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {buttonText}
        </Button>
      </form>
    </div>
  );
}
