// ABOUTME: Client-only exports for browser/React Server Components
// ABOUTME: Import from 'simple-site-framework/client' for client components

'use client';

// Client-only components that use browser APIs or React hooks
export { AnalyticsTracker } from './components/AnalyticsTracker';

// A/B testing utilities (client-only - use localStorage and window)
export { getABTestVariant } from './lib/ab-test';
export type { ABTestVariant, ABTestConfig } from './lib/ab-test';

// Experiment hook (PostHog integration with localStorage fallback)
export { useExperiment } from './lib/experiments';
export type { ExperimentConfig, ExperimentResult } from './lib/experiments';

// Analytics utilities
export { trackABTestEvent } from './lib/analytics';

// Re-export type for convenience
export type { AnalyticsEvent } from './lib/analytics';
