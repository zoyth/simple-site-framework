// ABOUTME: Lightweight newsletter signup form for email capture
// ABOUTME: Supports inline/stacked/minimal/card variants with honeypot spam protection

'use client';

import { useState, FormEvent } from 'react';
import { cn } from '../lib/utils/cn';
import { getLocalizedString } from '../lib/content/utils';
import type { LocalizedString } from '../config/content.schema';

export interface NewsletterSubmitData {
  email: string;
  name?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface NewsletterSignupProps {
  /** Form submission handler */
  onSubmit: (data: NewsletterSubmitData) => Promise<NewsletterResponse>;
  /** Layout variant @default 'stacked' */
  variant?: 'inline' | 'stacked' | 'minimal' | 'card';
  /** Size @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Show name field @default false */
  showName?: boolean;
  /** Show privacy checkbox @default false */
  showPrivacy?: boolean;
  /** Privacy policy URL */
  privacyUrl?: string;
  /** Current locale @default 'en' */
  locale?: string;
  /** Custom button text */
  buttonText?: LocalizedString | string;
  /** Custom placeholder for email */
  emailPlaceholder?: LocalizedString | string;
  /** Custom placeholder for name */
  namePlaceholder?: LocalizedString | string;
  /** Custom success message */
  successMessage?: LocalizedString | string;
  /** Additional CSS classes */
  className?: string;
}

const i18n = {
  subscribe: { en: 'Subscribe', fr: "S'abonner" },
  emailLabel: { en: 'Email address', fr: 'Adresse courriel' },
  nameLabel: { en: 'Name', fr: 'Nom' },
  emailPlaceholder: { en: 'you@example.com', fr: 'vous@exemple.com' },
  namePlaceholder: { en: 'Your name', fr: 'Votre nom' },
  emailRequired: { en: 'Please enter your email address.', fr: 'Veuillez entrer votre adresse courriel.' },
  emailInvalid: { en: 'Please enter a valid email address.', fr: 'Veuillez entrer une adresse courriel valide.' },
  privacyRequired: { en: 'You must accept the privacy policy.', fr: 'Vous devez accepter la politique de confidentialité.' },
  privacyText: { en: 'I agree to the', fr: "J'accepte la" },
  privacyLink: { en: 'privacy policy', fr: 'politique de confidentialité' },
  thankYou: { en: 'Thank you for subscribing!', fr: 'Merci pour votre inscription !' },
  error: { en: 'Something went wrong. Please try again.', fr: 'Une erreur est survenue. Veuillez réessayer.' },
  submitting: { en: 'Subscribing...', fr: 'Inscription...' },
};

function t(key: keyof typeof i18n, locale: string): string {
  return getLocalizedString(i18n[key], locale);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup({
  onSubmit,
  variant = 'stacked',
  size = 'md',
  showName = false,
  showPrivacy = false,
  privacyUrl = '/privacy',
  locale = 'en',
  buttonText,
  emailPlaceholder,
  namePlaceholder,
  successMessage,
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const resolveText = (val: LocalizedString | string | undefined, fallbackKey: keyof typeof i18n) => {
    if (!val) return t(fallbackKey, locale);
    return typeof val === 'string' ? val : getLocalizedString(val, locale);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const inputSizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const buttonSizeClasses = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Honeypot check
    if (honeypot) return;

    // Validation
    if (!email.trim()) {
      setError(t('emailRequired', locale));
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError(t('emailInvalid', locale));
      return;
    }
    if (showPrivacy && !privacyAccepted) {
      setError(t('privacyRequired', locale));
      return;
    }

    setStatus('submitting');

    try {
      const data: NewsletterSubmitData = { email };
      if (showName && name.trim()) {
        data.name = name.trim();
      }

      const response = await onSubmit(data);

      if (response.success) {
        setStatus('success');
        setEmail('');
        setName('');
        setPrivacyAccepted(false);
      } else {
        setStatus('error');
        setError(response.error || t('error', locale));
      }
    } catch {
      setStatus('error');
      setError(t('error', locale));
    }
  };

  if (status === 'success') {
    return (
      <div className={cn(sizeClasses[size], variant === 'card' && 'bg-white rounded-lg border border-gray-200 p-6', className)}>
        <p className="text-green-700 font-medium" role="status">
          {resolveText(successMessage, 'thankYou')}
        </p>
      </div>
    );
  }

  const isInline = variant === 'inline';
  const isMinimal = variant === 'minimal';

  const inputClasses = cn(
    'border border-gray-300 rounded-lg',
    'focus:ring-2 focus:ring-primary focus:border-primary outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    inputSizeClasses[size]
  );

  const buttonLabel = resolveText(buttonText, 'subscribe');

  const formContent = (
    <>
      {/* Name field */}
      {showName && !isMinimal && (
        <div className={isInline ? '' : 'w-full'}>
          {!isMinimal && !isInline && (
            <label htmlFor="newsletter-name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('nameLabel', locale)}
            </label>
          )}
          <input
            id="newsletter-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={resolveText(namePlaceholder, 'namePlaceholder')}
            className={cn(inputClasses, isInline ? '' : 'w-full')}
            disabled={status === 'submitting'}
            aria-label={isInline ? t('nameLabel', locale) : undefined}
          />
        </div>
      )}

      {/* Email field */}
      <div className={isInline ? 'flex-1' : 'w-full'}>
        {!isMinimal && !isInline && (
          <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('emailLabel', locale)}
          </label>
        )}
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={resolveText(emailPlaceholder, 'emailPlaceholder')}
          className={cn(inputClasses, isInline ? '' : 'w-full')}
          disabled={status === 'submitting'}
          required
          aria-label={isMinimal || isInline ? t('emailLabel', locale) : undefined}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={cn(
          'font-medium rounded-lg bg-primary text-white',
          'hover:bg-primary/90 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonSizeClasses[size],
          !isInline && 'w-full'
        )}
      >
        {status === 'submitting' ? t('submitting', locale) : buttonLabel}
      </button>
    </>
  );

  return (
    <div
      className={cn(
        sizeClasses[size],
        variant === 'card' && 'bg-white rounded-lg border border-gray-200 p-6 shadow-sm',
        className
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          isInline ? 'flex items-end gap-3' : 'flex flex-col gap-4'
        )}
        noValidate
      >
        {formContent}

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="_honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Privacy checkbox */}
        {showPrivacy && (
          <label className={cn('flex items-start gap-2 text-sm text-gray-600', isInline && 'items-center')}>
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={status === 'submitting'}
            />
            <span>
              {t('privacyText', locale)}{' '}
              <a href={privacyUrl} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {t('privacyLink', locale)}
              </a>
            </span>
          </label>
        )}
      </form>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
