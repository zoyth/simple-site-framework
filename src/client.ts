// ABOUTME: Client-only exports for browser/React Server Components
// ABOUTME: Import from 'simple-site-framework/client' for client components

'use client';

// Client-only components that use browser APIs or React hooks
export { AnalyticsTracker } from './components/AnalyticsTracker';

// Re-export type for convenience
export type { AnalyticsEvent } from './lib/analytics';
