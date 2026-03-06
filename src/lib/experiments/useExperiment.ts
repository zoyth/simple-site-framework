// ABOUTME: PostHog experiment hook with localStorage fallback
// ABOUTME: Returns control during SSR, PostHog variant when available, random assignment otherwise

'use client';

import { useState, useEffect, useRef } from 'react';

export interface ExperimentConfig {
  /** PostHog feature flag key */
  flagKey: string;
  /** Variant names — first is the control/default */
  variants: string[];
}

export interface ExperimentResult {
  /** Active variant name */
  variant: string;
  /** Whether a variant has been resolved (PostHog or localStorage) */
  isReady: boolean;
}

/** Timeout before falling back to localStorage assignment (ms) */
const FALLBACK_TIMEOUT = 3000;

function getPostHogVariant(flagKey: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const ph = (window as any).posthog;
  if (!ph || typeof ph.getFeatureFlag !== 'function') return undefined;
  const flag = ph.getFeatureFlag(flagKey);
  if (typeof flag === 'string') return flag;
  return undefined;
}

function getStoredVariant(flagKey: string, variants: string[]): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(`experiment-${flagKey}`);
    if (stored && variants.includes(stored)) return stored;
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

function assignAndStoreVariant(flagKey: string, variants: string[]): string {
  const index = Math.floor(Math.random() * variants.length);
  const variant = variants[index];
  try {
    localStorage.setItem(`experiment-${flagKey}`, variant);
  } catch {
    // localStorage may be unavailable
  }
  return variant;
}

/**
 * React hook for PostHog-powered experiments with localStorage fallback
 *
 * Returns the control variant (first in `variants`) during SSR and before
 * PostHog loads. Once PostHog assigns a variant, returns that. If PostHog
 * never loads (no consent, blocked), falls back to a random assignment
 * persisted in localStorage for consistency across visits.
 *
 * @example
 * ```tsx
 * const { variant, isReady } = useExperiment({
 *   flagKey: 'hero-headline',
 *   variants: ['control', 'option-b', 'option-c'],
 * });
 *
 * return variant === 'option-b' ? <AlternateHero /> : <DefaultHero />;
 * ```
 */
export function useExperiment(config: ExperimentConfig): ExperimentResult {
  const control = config.variants[0];
  const [result, setResult] = useState<ExperimentResult>({
    variant: control,
    isReady: false,
  });
  const resolvedRef = useRef(false);

  useEffect(() => {
    function resolve(variant: string) {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      setResult({ variant, isReady: true });
    }

    function checkPostHog() {
      const variant = getPostHogVariant(config.flagKey);
      if (variant && config.variants.includes(variant)) {
        resolve(variant);
        return true;
      }
      return false;
    }

    // Check immediately in case PostHog already loaded
    if (checkPostHog()) return;

    // Listen for PostHog becoming ready
    function onPostHogReady() {
      const ph = (window as any).posthog;
      if (ph && typeof ph.onFeatureFlags === 'function') {
        ph.onFeatureFlags(() => checkPostHog());
      }
      checkPostHog();
    }

    window.addEventListener('posthog-ready', onPostHogReady);

    // Fallback: if PostHog doesn't resolve within timeout, use localStorage
    const timer = setTimeout(() => {
      if (resolvedRef.current) return;
      const stored = getStoredVariant(config.flagKey, config.variants);
      if (stored) {
        resolve(stored);
      } else {
        resolve(assignAndStoreVariant(config.flagKey, config.variants));
      }
    }, FALLBACK_TIMEOUT);

    return () => {
      window.removeEventListener('posthog-ready', onPostHogReady);
      clearTimeout(timer);
    };
  }, [config.flagKey, config.variants, control]);

  return result;
}
