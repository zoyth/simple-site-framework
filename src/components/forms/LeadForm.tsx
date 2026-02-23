// ABOUTME: Lead capture form with validation, honeypot spam protection, and bilingual support
// ABOUTME: Pre-configured fields for name, email, phone, company, website, and optional message

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField } from '../FormField';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils/cn';

/** String or per-locale string map */
type LocalizedText = string | Record<string, string>;

function resolveText(text: LocalizedText, locale: string): string {
  if (typeof text === 'string') return text;
  return text[locale] || Object.values(text)[0] || '';
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  message?: string;
  [key: string]: string | undefined;
}

export interface LeadFormProps {
  /** Current locale */
  locale: string;
  /** Form submission handler */
  onSubmit: (data: LeadFormData) => Promise<void>;
  /** Show message textarea */
  showMessage?: boolean;
  /** Hidden fields included in submission but not shown */
  hiddenFields?: Record<string, string>;
  /** Submit button text */
  submitText?: LocalizedText;
  /** Success message shown after submission */
  successMessage?: LocalizedText;
  /** Error message shown on submission failure */
  errorMessage?: LocalizedText;
  /** Additional CSS classes */
  className?: string;
}

const labels: Record<string, Record<string, string>> = {
  name: { en: 'Name', fr: 'Nom' },
  email: { en: 'Email', fr: 'Courriel' },
  phone: { en: 'Phone', fr: 'T\u00e9l\u00e9phone' },
  company: { en: 'Company', fr: 'Entreprise' },
  website: { en: 'Website', fr: 'Site web' },
  message: { en: 'Message', fr: 'Message' },
  submit: { en: 'Send', fr: 'Envoyer' },
  success: { en: 'Thank you! We will be in touch.', fr: 'Merci! Nous vous contacterons sous peu.' },
  error: { en: 'Something went wrong. Please try again.', fr: 'Une erreur est survenue. Veuillez r\u00e9essayer.' },
};

function buildSchema(showMessage: boolean) {
  const fields: Record<string, z.ZodTypeAny> = {
    name: z.string().min(1, { message: 'This field is required' }),
    email: z.string().min(1, { message: 'This field is required' }).email({ message: 'Please enter a valid email address' }),
    phone: z.string().optional().or(z.literal('')),
    company: z.string().optional().or(z.literal('')),
    website: z.string().optional().or(z.literal('')),
    _honeypot: z.string().max(0),
  };
  if (showMessage) {
    fields.message = z.string().optional().or(z.literal(''));
  }
  return z.object(fields);
}

/**
 * LeadForm - Lead capture form with validation and spam protection
 *
 * @example
 * ```tsx
 * <LeadForm
 *   locale={locale}
 *   showMessage
 *   hiddenFields={{ product: 'contact' }}
 *   onSubmit={async (data) => {
 *     await fetch('/api/leads', { method: 'POST', body: JSON.stringify(data) });
 *   }}
 * />
 * ```
 */
export function LeadForm({
  locale,
  onSubmit,
  showMessage = false,
  hiddenFields,
  submitText,
  successMessage,
  errorMessage,
  className,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const schema = buildSchema(showMessage);
  type FormSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (data: FormSchema) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Check honeypot
      if (data._honeypot) return;

      const { _honeypot, ...formData } = data;

      // Merge hidden fields
      const submitData: LeadFormData = {
        ...formData,
        ...hiddenFields,
      } as LeadFormData;

      await onSubmit(submitData);

      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const label = (key: string) => labels[key]?.[locale] || labels[key]?.en || key;
  const buttonLabel = submitText ? resolveText(submitText, locale) : label('submit');
  const successMsg = successMessage ? resolveText(successMessage, locale) : label('success');
  const errorMsg = errorMessage ? resolveText(errorMessage, locale) : label('error');

  const fieldDefs = [
    { name: 'name', type: 'text' as const, required: true },
    { name: 'email', type: 'email' as const, required: true },
    { name: 'phone', type: 'tel' as const, required: false },
    { name: 'company', type: 'text' as const, required: false },
    { name: 'website', type: 'url' as const, required: false },
    ...(showMessage ? [{ name: 'message', type: 'textarea' as const, required: false }] : []),
  ];

  return (
    <div className={cn('w-full max-w-lg', className)}>
      {submitStatus !== 'idle' && (
        <div
          className={cn(
            'mb-6 p-4 rounded-lg',
            submitStatus === 'success' && 'bg-green-50 text-green-800 border border-green-200',
            submitStatus === 'error' && 'bg-red-50 text-red-800 border border-red-200'
          )}
          role="alert"
        >
          <p className="font-medium">
            {submitStatus === 'success' ? successMsg : errorMsg}
          </p>
        </div>
      )}

      <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4" noValidate>
        {fieldDefs.map((field) => (
          <FormField
            key={field.name}
            label={label(field.name)}
            name={field.name}
            error={errors[field.name] as any}
            required={field.required}
          >
            {field.type === 'textarea' ? (
              <textarea
                {...register(field.name)}
                id={field.name}
                rows={4}
                className={cn(
                  'w-full px-4 py-2 border rounded-lg',
                  'focus:ring-2 focus:ring-primary focus:border-primary',
                  'resize-vertical',
                  errors[field.name] && 'border-red-500'
                )}
                aria-invalid={!!errors[field.name]}
                disabled={isSubmitting}
              />
            ) : (
              <input
                {...register(field.name)}
                type={field.type}
                id={field.name}
                className={cn(
                  'w-full px-4 py-2 border rounded-lg',
                  'focus:ring-2 focus:ring-primary focus:border-primary',
                  errors[field.name] && 'border-red-500'
                )}
                aria-invalid={!!errors[field.name]}
                disabled={isSubmitting}
              />
            )}
          </FormField>
        ))}

        {/* Honeypot (hidden spam trap) */}
        <div className="hidden" aria-hidden="true">
          <input
            {...register('_honeypot')}
            type="text"
            name="_honeypot"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <Button
          type="submit"
          variant="filled"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {buttonLabel}
        </Button>
      </form>
    </div>
  );
}
