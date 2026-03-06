// ABOUTME: Render-prop component for declarative experiment variant rendering
// ABOUTME: Wraps useExperiment hook for use in JSX without writing a custom component

'use client';

import { useExperiment, type ExperimentConfig } from '../lib/experiments/useExperiment';
import { type ReactNode } from 'react';

export interface ExperimentProps {
  /** Experiment configuration with flag key and variant names */
  config: ExperimentConfig;
  /** Render function receiving the active variant and readiness state */
  children: (variant: string, isReady: boolean) => ReactNode;
}

/**
 * Declarative experiment component using render props
 *
 * @example
 * ```tsx
 * <Experiment config={{ flagKey: 'hero-headline', variants: ['control', 'option-b'] }}>
 *   {(variant) => (
 *     variant === 'option-b' ? <AlternateHero /> : <DefaultHero />
 *   )}
 * </Experiment>
 * ```
 */
export function Experiment({ config, children }: ExperimentProps) {
  const { variant, isReady } = useExperiment(config);
  return <>{children(variant, isReady)}</>;
}
