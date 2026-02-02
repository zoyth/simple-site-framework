// ABOUTME: Client-side analytics tracker for page views and scroll depth
// ABOUTME: Automatically tracks page views and scroll milestones
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackScrollDepth } from '../lib/analytics';

/**
 * AnalyticsTracker - Client-only component for tracking page views and scroll depth
 *
 * ⚠️ Edge Runtime Warning:
 * This component uses browser-only APIs (window, document) and Next.js client hooks (usePathname).
 * Do NOT import from main index in middleware or edge functions.
 * Use: import { AnalyticsTracker } from 'simple-site-framework/client'
 */
export function AnalyticsTracker() {
  // Edge-safe check: fail fast with clear error if used in wrong context
  if (typeof window === 'undefined' && typeof document === 'undefined') {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        'AnalyticsTracker: This component requires browser APIs and cannot run in edge runtime or SSR. ' +
        'Import from "simple-site-framework/client" and ensure it\'s only used in client components.'
      );
    }
    return null;
  }

  const pathname = usePathname();
  const scrollTracked = useRef<Set<number>>(new Set());

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname, document.title);
      // Reset scroll tracking for new page
      scrollTracked.current.clear();
    }
  }, [pathname]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

      const milestones = [25, 50, 75, 100] as const;

      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !scrollTracked.current.has(milestone)) {
          scrollTracked.current.add(milestone);
          trackScrollDepth(milestone, pathname || '/');
        }
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check immediately in case page loads already scrolled
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return null;
}
