// ABOUTME: Mobile-friendly link helpers for phone, email, and address interactions
// ABOUTME: Enables one-tap calling, emailing, and navigation on mobile devices

import type { ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';

export interface PhoneLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Phone number (will be formatted for tel: protocol) */
  phone: string;
  /** Link content (defaults to phone number) */
  children?: ReactNode;
}

/**
 * PhoneLink - Creates a clickable phone link for mobile devices
 *
 * Automatically formats phone number for tel: protocol and enables
 * one-tap calling on mobile devices.
 *
 * @example
 * ```tsx
 * <PhoneLink phone="+1-555-123-4567">
 *   Call Us Now
 * </PhoneLink>
 * ```
 */
export function PhoneLink({ phone, children, className, ...props }: PhoneLinkProps) {
  // Strip all non-digit characters for tel: href
  const telHref = `tel:${phone.replace(/\D/g, '')}`;

  return (
    <a
      href={telHref}
      className={cn('hover:underline', className)}
      {...props}
    >
      {children || phone}
    </a>
  );
}

export interface EmailLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Email address */
  email: string;
  /** Optional email subject */
  subject?: string;
  /** Optional email body */
  body?: string;
  /** Link content (defaults to email address) */
  children?: ReactNode;
}

/**
 * EmailLink - Creates a mailto: link for email
 *
 * Opens email client with pre-filled recipient, subject, and body.
 *
 * @example
 * ```tsx
 * <EmailLink
 *   email="hello@example.com"
 *   subject="Contact from website"
 * >
 *   Email Us
 * </EmailLink>
 * ```
 */
export function EmailLink({ email, subject, body, children, className, ...props }: EmailLinkProps) {
  // Build mailto: URL with optional parameters
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);

  const mailtoHref = params.length > 0
    ? `mailto:${email}?${params.join('&')}`
    : `mailto:${email}`;

  return (
    <a
      href={mailtoHref}
      className={cn('hover:underline', className)}
      {...props}
    >
      {children || email}
    </a>
  );
}

export interface AddressLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Physical address */
  address: string;
  /** Link content (defaults to address) */
  children?: ReactNode;
}

/**
 * AddressLink - Creates a link to Google Maps for an address
 *
 * Opens address in Google Maps (works on both iOS and Android).
 * Opens in new tab for desktop convenience.
 *
 * @example
 * ```tsx
 * <AddressLink address="123 Main St, New York, NY 10001">
 *   Get Directions
 * </AddressLink>
 * ```
 */
export function AddressLink({ address, children, className, ...props }: AddressLinkProps) {
  // Google Maps URL with encoded address query
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <a
      href={mapsHref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('hover:underline', className)}
      {...props}
    >
      {children || address}
    </a>
  );
}
