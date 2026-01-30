// ABOUTME: Client-side analytics tracker for page views and scroll depth
// ABOUTME: Automatically tracks page views and scroll milestones
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackScrollDepth } from '../lib/analytics';

export function AnalyticsTracker() {
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
