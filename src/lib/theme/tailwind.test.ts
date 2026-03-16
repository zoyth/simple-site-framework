// ABOUTME: Tests for Tailwind color helper
// ABOUTME: Verifies getTailwindColors() produces correct mapping for v3 consumers

import { describe, it, expect } from 'vitest';
import { getTailwindColors } from './tailwind';
import { type ThemeConfigV2 } from '../../config/theme.schema';

const v2Theme: ThemeConfigV2 = {
  version: 2,
  brand: {
    name: 'Test',
    palette: { teal: '#054547', gold: '#E9C92B' },
    shadeBase: '#0B0B07',
    shadeLight: '#FFFFFF',
    fonts: {
      heading: { family: 'Inter', weights: [700], fallback: 'sans-serif' },
      body: { family: 'Inter', weights: [400], fallback: 'sans-serif' },
    },
  },
  design: {
    borderRadius: 'rounded',
    shadows: 'subtle',
    spacing: 'comfortable',
  },
};

describe('getTailwindColors', () => {
  const colors = getTailwindColors(v2Theme);

  it('includes brand palette colors with opacity support', () => {
    const teal = colors.teal as Function;
    expect(typeof teal).toBe('function');
    expect(teal({})).toBe('rgb(var(--color-teal-rgb))');
    expect(teal({ opacityValue: '0.5' })).toBe('rgb(var(--color-teal-rgb) / 0.5)');
  });

  it('includes shade ramp with opacity support', () => {
    const shade50 = (colors.shade as Record<number, Function>)[50];
    expect(typeof shade50).toBe('function');
    expect(shade50({})).toBe('rgb(var(--color-shade-50-rgb))');
    expect(shade50({ opacityValue: '0.1' })).toBe('rgb(var(--color-shade-50-rgb) / 0.1)');
  });

  it('includes semantic tokens with opacity support', () => {
    const primary = colors.primary as Function;
    expect(typeof primary).toBe('function');
    expect(primary({})).toBe('rgb(var(--color-primary-rgb))');
    expect(primary({ opacityValue: '0.1' })).toBe('rgb(var(--color-primary-rgb) / 0.1)');
  });

  it('includes backward-compat slate references with opacity support', () => {
    const slate50 = (colors.slate as Record<number, Function>)[50];
    expect(typeof slate50).toBe('function');
    expect(slate50({})).toBe('rgb(var(--color-slate-50-rgb))');
  });

  it('shade ramp has 30 entries', () => {
    expect(Object.keys(colors.shade as Record<number, Function>)).toHaveLength(30);
  });
});
