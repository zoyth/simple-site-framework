// ABOUTME: Cookie consent banner for Loi 25 / GDPR compliance
// ABOUTME: Gates analytics loading on explicit user consent with bilingual support

'use client';

import { useState, useEffect } from 'react';
import { cn } from '../lib/utils/cn';

export const CONSENT_STORAGE_KEY = 'cookie-consent';

type ConsentStatus = 'accepted' | 'declined';

/** String or per-locale string map */
type LocalizedText = string | Record<string, string>;

function resolveText(text: LocalizedText, locale: string): string {
  if (typeof text === 'string') return text;
  return text[locale] || Object.values(text)[0] || '';
}

const defaultMessages: Record<string, { message: string; accept: string; decline: string; policyLink: string }> = {
  fr: {
    message: 'Ce site utilise des cookies pour am\u00e9liorer votre exp\u00e9rience et analyser le trafic.',
    accept: 'Accepter',
    decline: 'Refuser',
    policyLink: 'Politique de confidentialit\u00e9',
  },
  en: {
    message: 'This site uses cookies to improve your experience and analyze traffic.',
    accept: 'Accept',
    decline: 'Decline',
    policyLink: 'Privacy policy',
  },
};

export interface CookieConsentProps {
  /** Current locale */
  locale: string;
  /** Banner message */
  message?: LocalizedText;
  /** Accept button text */
  acceptText?: LocalizedText;
  /** Decline button text */
  declineText?: LocalizedText;
  /** Privacy policy link href */
  privacyPolicyHref?: LocalizedText;
  /** Privacy policy link text */
  privacyPolicyText?: LocalizedText;
  /** Called when user accepts cookies */
  onAccept?: () => void;
  /** Called when user declines cookies */
  onDecline?: () => void;
  /** Additional CSS classes for the banner */
  className?: string;
}

/**
 * CookieConsent - Cookie consent banner for privacy compliance
 *
 * Shows a consent banner on first visit. Stores the user's choice
 * in localStorage and never shows again until reset.
 *
 * @example
 * ```tsx
 * <CookieConsent
 *   locale={locale}
 *   privacyPolicyHref={{ fr: '/fr/confidentialite', en: '/en/privacy' }}
 *   onAccept={() => loadAnalytics()}
 * />
 * ```
 */
export function CookieConsent({
  locale,
  message,
  acceptText,
  declineText,
  privacyPolicyHref,
  privacyPolicyText,
  onAccept,
  onDecline,
  className,
}: CookieConsentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getConsentStatus();
    if (!stored) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const defaults = defaultMessages[locale] || defaultMessages.en;

  const messageText = message ? resolveText(message, locale) : defaults.message;
  const acceptLabel = acceptText ? resolveText(acceptText, locale) : defaults.accept;
  const declineLabel = declineText ? resolveText(declineText, locale) : defaults.decline;

  const handleAccept = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    setVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'declined');
    setVisible(false);
    onDecline?.();
  };

  return (
    <div
      role="region"
      aria-label={locale === 'fr' ? 'Consentement aux cookies' : 'Cookie consent'}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white border-t border-gray-200 shadow-lg',
        'px-4 py-4 sm:px-6',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-700 flex-1">
          {messageText}
          {privacyPolicyHref && (
            <>
              {' '}
              <a
                href={resolveText(privacyPolicyHref, locale)}
                className="underline text-gray-900 hover:text-gray-600"
              >
                {privacyPolicyText
                  ? resolveText(privacyPolicyText, locale)
                  : defaults.policyLink}
              </a>
            </>
          )}
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              'text-gray-700 bg-gray-100 hover:bg-gray-200',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'
            )}
          >
            {declineLabel}
          </button>
          <button
            onClick={handleAccept}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              'text-white bg-gray-900 hover:bg-gray-800',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
            )}
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Get the current cookie consent status
 *
 * @returns 'accepted', 'declined', or null if no choice made
 */
export function getConsentStatus(): ConsentStatus | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (value === 'accepted' || value === 'declined') return value;
  return null;
}

/**
 * Reset cookie consent so the banner shows again
 *
 * @example
 * ```tsx
 * import { resetCookieConsent } from '@zoyth/simple-site-framework/components';
 *
 * <button onClick={resetCookieConsent}>
 *   Reset cookie preferences
 * </button>
 * ```
 */
export function resetCookieConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_STORAGE_KEY);
}
