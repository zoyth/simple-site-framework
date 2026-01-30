// ABOUTME: Reusable link component with analytics tracking
// ABOUTME: Automatically tracks clicks based on link type (internal, external, CTA)
'use client';

import { trackCTAClick, trackOutboundLink, trackNavigation } from '@/lib/analytics';

interface TrackedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  trackingType?: 'cta' | 'navigation' | 'outbound' | 'auto';
  ctaLocation?: string;
  ctaType?: 'signup' | 'trial' | 'contact' | 'download' | 'other';
  navLocation?: 'header' | 'footer' | 'content' | 'mobile';
  onClick?: () => void;
  [key: string]: unknown;
}

/**
 * Link component with built-in analytics tracking
 * Automatically determines tracking type if set to 'auto'
 */
export default function TrackedLink({
  href,
  children,
  className,
  trackingType = 'auto',
  ctaLocation,
  ctaType = 'other',
  navLocation = 'content',
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick = () => {
    const linkText = typeof children === 'string' ? children : href;

    // Auto-detect tracking type
    let type = trackingType;
    if (type === 'auto') {
      if (href.startsWith('http') && !href.includes('courrielleur.com')) {
        type = 'outbound';
      } else if (href.includes('signup') || href.includes('trial')) {
        type = 'cta';
      } else {
        type = 'navigation';
      }
    }

    // Track based on type
    switch (type) {
      case 'cta':
        trackCTAClick(ctaLocation || 'unknown', linkText, ctaType);
        break;
      case 'outbound':
        trackOutboundLink(href, linkText);
        break;
      case 'navigation':
        trackNavigation(linkText, href, navLocation);
        break;
    }

    // Call custom onClick if provided
    onClick?.();
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
