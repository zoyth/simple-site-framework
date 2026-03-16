// ABOUTME: Tests for v1→v2 theme migration
// ABOUTME: Verifies migration preserves equivalent CSS output and structure

import { describe, it, expect } from 'vitest';
import { migrateThemeV1toV2 } from './migrate';
import { type ThemeConfigV1 } from '../../config/theme.schema';
import { generateThemeCSS } from './generate-css';

const v1Theme: ThemeConfigV1 = {
  brand: {
    name: 'Test Brand',
    colors: {
      primary: '#054547',
      primaryHover: '#033335',
      primaryLight: '#437375',
      primaryDark: '#033335',
      primaryGradientStart: '#054547',
      primaryGradientEnd: '#033335',
      heroGradientStart: '#eff6ff',
      heroGradientEnd: '#dbeafe',
      footerGradientStart: '#1e3a5f',
      footerGradientEnd: '#0f172a',
    },
    fonts: {
      heading: { family: 'Playfair Display', weights: [600, 700], fallback: 'serif' },
      body: { family: 'Inter', weights: [400, 500], fallback: 'sans-serif' },
    },
  },
  design: {
    borderRadius: 'rounded',
    shadows: 'subtle',
    spacing: 'comfortable',
    prose: 'editorial',
  },
  animations: {
    speed: 'normal',
  },
  colors: {
    slate: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
      400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
      800: '#1e293b', 900: '#0f172a',
    },
  },
};

describe('migrateThemeV1toV2', () => {
  const v2 = migrateThemeV1toV2(v1Theme);

  it('sets version to 2', () => {
    expect(v2.version).toBe(2);
  });

  it('preserves brand name', () => {
    expect(v2.brand.name).toBe('Test Brand');
  });

  it('puts primary in palette', () => {
    expect(v2.brand.palette.primary).toBe('#054547');
  });

  it('uses slate-50 as shadeLight', () => {
    expect(v2.brand.shadeLight).toBe('#f8fafc');
  });

  it('uses slate-900 as shadeBase', () => {
    expect(v2.brand.shadeBase).toBe('#0f172a');
  });

  it('preserves fonts', () => {
    expect(v2.brand.fonts).toEqual(v1Theme.brand.fonts);
  });

  it('preserves design settings', () => {
    expect(v2.design).toEqual(v1Theme.design);
  });

  it('preserves animations', () => {
    expect(v2.animations).toEqual(v1Theme.animations);
  });

  it('maps gradient overrides to semantic', () => {
    expect(v2.semantic?.heroGradientStart).toBe('#eff6ff');
    expect(v2.semantic?.heroGradientEnd).toBe('#dbeafe');
    expect(v2.semantic?.footerGradientStart).toBe('#1e3a5f');
    expect(v2.semantic?.footerGradientEnd).toBe('#0f172a');
  });

  it('maps primaryHover/Light/Dark to semantic overrides', () => {
    expect(v2.semantic?.primaryHover).toBe('#033335');
    expect(v2.semantic?.primaryLight).toBe('#437375');
    expect(v2.semantic?.primaryDark).toBe('#033335');
  });

  it('produces v2 CSS that contains expected variables', () => {
    const css = generateThemeCSS(v2);
    expect(css).toContain('--color-primary:');
    expect(css).toContain('--color-primary-hover:');
    expect(css).toContain('--color-hero-gradient-start:');
    expect(css).toContain('--color-shade-50:');
    expect(css).toContain('--color-slate-50:');
    expect(css).toContain('--font-heading:');
  });
});
