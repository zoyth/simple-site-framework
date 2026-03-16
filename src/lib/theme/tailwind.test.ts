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

  it('includes brand palette colors as CSS var references', () => {
    expect(colors.teal).toBe('var(--color-teal)');
    expect(colors.gold).toBe('var(--color-gold)');
  });

  it('includes shade ramp as CSS var references', () => {
    expect(colors.shade[50]).toBe('var(--color-shade-50)');
    expect(colors.shade[1500]).toBe('var(--color-shade-1500)');
  });

  it('includes semantic tokens as CSS var references', () => {
    expect(colors.primary).toBe('var(--color-primary)');
    expect(colors['primary-hover']).toBe('var(--color-primary-hover)');
    expect(colors.accent).toBe('var(--color-accent)');
    expect(colors.surface).toBe('var(--color-surface)');
    expect(colors.text).toBe('var(--color-text)');
    expect(colors['text-muted']).toBe('var(--color-text-muted)');
    expect(colors.border).toBe('var(--color-border)');
  });

  it('includes backward-compat slate references', () => {
    expect(colors.slate[50]).toBe('var(--color-slate-50)');
    expect(colors.slate[900]).toBe('var(--color-slate-900)');
  });

  it('shade ramp has 30 entries', () => {
    expect(Object.keys(colors.shade)).toHaveLength(30);
  });
});
