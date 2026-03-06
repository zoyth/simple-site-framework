// ABOUTME: Tests for useExperiment hook with PostHog and localStorage fallback
// ABOUTME: Verifies SSR safety, PostHog integration, and persistent random assignment

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExperiment, type ExperimentConfig } from './useExperiment';

const config: ExperimentConfig = {
  flagKey: 'test-experiment',
  variants: ['control', 'option-b', 'option-c'],
};

beforeEach(() => {
  localStorage.clear();
  delete (window as any).posthog;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useExperiment', () => {
  it('returns control variant and isReady false initially', () => {
    const { result } = renderHook(() => useExperiment(config));
    expect(result.current.variant).toBe('control');
    expect(result.current.isReady).toBe(false);
  });

  it('reads PostHog feature flag when posthog is available', () => {
    (window as any).posthog = {
      getFeatureFlag: vi.fn(() => 'option-b'),
      onFeatureFlags: vi.fn((cb: () => void) => cb()),
    };

    const { result } = renderHook(() => useExperiment(config));
    expect(result.current.variant).toBe('option-b');
    expect(result.current.isReady).toBe(true);
  });

  it('ignores PostHog variant not in config', () => {
    (window as any).posthog = {
      getFeatureFlag: vi.fn(() => 'unknown-variant'),
      onFeatureFlags: vi.fn((cb: () => void) => cb()),
    };

    const { result } = renderHook(() => useExperiment(config));
    expect(result.current.variant).toBe('control');
    expect(result.current.isReady).toBe(false);
  });

  it('responds to posthog-ready event', () => {
    const { result } = renderHook(() => useExperiment(config));

    // PostHog isn't loaded yet
    expect(result.current.variant).toBe('control');

    // Simulate PostHog loading
    (window as any).posthog = {
      getFeatureFlag: vi.fn(() => 'option-c'),
      onFeatureFlags: vi.fn((cb: () => void) => cb()),
    };

    act(() => {
      window.dispatchEvent(new Event('posthog-ready'));
    });

    expect(result.current.variant).toBe('option-c');
    expect(result.current.isReady).toBe(true);
  });

  describe('localStorage fallback', () => {
    it('assigns a random variant after timeout when PostHog is unavailable', () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useExperiment(config));
      expect(result.current.isReady).toBe(false);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.isReady).toBe(true);
      expect(config.variants).toContain(result.current.variant);

      vi.useRealTimers();
    });

    it('persists localStorage assignment across renders', () => {
      localStorage.setItem('experiment-test-experiment', 'option-b');
      vi.useFakeTimers();

      const { result } = renderHook(() => useExperiment(config));

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.variant).toBe('option-b');
      expect(result.current.isReady).toBe(true);

      vi.useRealTimers();
    });

    it('ignores invalid localStorage values', () => {
      localStorage.setItem('experiment-test-experiment', 'invalid-variant');
      vi.useFakeTimers();

      const { result } = renderHook(() => useExperiment(config));

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.isReady).toBe(true);
      // Should assign a new valid variant, not use the invalid one
      expect(config.variants).toContain(result.current.variant);

      vi.useRealTimers();
    });

    it('saves newly assigned variant to localStorage', () => {
      vi.useFakeTimers();

      renderHook(() => useExperiment(config));

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      const stored = localStorage.getItem('experiment-test-experiment');
      expect(stored).not.toBeNull();
      expect(config.variants).toContain(stored);

      vi.useRealTimers();
    });

    it('does not trigger localStorage fallback if PostHog resolves first', () => {
      vi.useFakeTimers();

      (window as any).posthog = {
        getFeatureFlag: vi.fn(() => 'option-b'),
        onFeatureFlags: vi.fn((cb: () => void) => cb()),
      };

      const { result } = renderHook(() => useExperiment(config));

      // PostHog resolved immediately
      expect(result.current.variant).toBe('option-b');
      expect(result.current.isReady).toBe(true);

      // Advance past timeout — variant should not change
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.variant).toBe('option-b');

      vi.useRealTimers();
    });
  });
});
