// ABOUTME: A/B testing utility for CTA variations
// ABOUTME: Uses localStorage to persist user's assigned variant
// ABOUTME: Integrated with analytics tracking

import { trackABTestEvent as analyticsTrackABTestEvent } from './analytics';

export type ABTestVariant = 'A' | 'B';

export interface ABTestConfig {
  testId: string;
  variants: {
    A: { weight: number };
    B: { weight: number };
  };
}

/**
 * Get the assigned variant for a test, or assign one if not already assigned
 * Uses localStorage to persist the assignment across sessions
 */
export function getABTestVariant(config: ABTestConfig): ABTestVariant {
  if (typeof window === 'undefined') {
    // Server-side: return default variant
    return 'A';
  }

  const storageKey = `ab-test-${config.testId}`;
  const stored = localStorage.getItem(storageKey);

  if (stored === 'A' || stored === 'B') {
    return stored;
  }

  // Assign new variant based on weights
  const totalWeight = config.variants.A.weight + config.variants.B.weight;
  const random = Math.random() * totalWeight;
  const variant: ABTestVariant = random < config.variants.A.weight ? 'A' : 'B';

  localStorage.setItem(storageKey, variant);
  return variant;
}

/**
 * Track A/B test event with integrated analytics
 */
export function trackABTestEvent(
  testId: string,
  variant: ABTestVariant,
  eventName: string,
  metadata?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return;

  // Track via analytics library
  analyticsTrackABTestEvent(testId, variant, eventName, metadata);
}
