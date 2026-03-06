// ABOUTME: Tests for Experiment render-prop component
// ABOUTME: Verifies it renders with the variant from useExperiment

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Experiment } from './Experiment';

beforeEach(() => {
  localStorage.clear();
  delete (window as any).posthog;
});

const config = {
  flagKey: 'test-experiment',
  variants: ['control', 'option-b'],
};

describe('Experiment', () => {
  it('renders with control variant initially', () => {
    render(
      <Experiment config={config}>
        {(variant) => <div data-testid="variant">{variant}</div>}
      </Experiment>
    );

    expect(screen.getByTestId('variant')).toHaveTextContent('control');
  });

  it('renders with PostHog variant when available', () => {
    (window as any).posthog = {
      getFeatureFlag: vi.fn(() => 'option-b'),
      onFeatureFlags: vi.fn((cb: () => void) => cb()),
    };

    render(
      <Experiment config={config}>
        {(variant) => <div data-testid="variant">{variant}</div>}
      </Experiment>
    );

    expect(screen.getByTestId('variant')).toHaveTextContent('option-b');
  });

  it('passes isReady to render function', () => {
    render(
      <Experiment config={config}>
        {(variant, isReady) => (
          <div data-testid="ready">{isReady ? 'yes' : 'no'}</div>
        )}
      </Experiment>
    );

    expect(screen.getByTestId('ready')).toHaveTextContent('no');
  });

  it('updates when posthog-ready fires', () => {
    render(
      <Experiment config={config}>
        {(variant) => <div data-testid="variant">{variant}</div>}
      </Experiment>
    );

    expect(screen.getByTestId('variant')).toHaveTextContent('control');

    (window as any).posthog = {
      getFeatureFlag: vi.fn(() => 'option-b'),
      onFeatureFlags: vi.fn((cb: () => void) => cb()),
    };

    act(() => {
      window.dispatchEvent(new Event('posthog-ready'));
    });

    expect(screen.getByTestId('variant')).toHaveTextContent('option-b');
  });
});
