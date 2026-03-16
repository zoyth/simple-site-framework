// ABOUTME: Tests for CSS generation from theme configuration
// ABOUTME: Verifies v1 regression, v2 all layers, dark mode, backward-compat aliases

import { describe, it, expect } from 'vitest';
import { generateThemeCSS, generateDesignTokens, generateDarkModeCSS } from './generate-css';
import { type ThemeConfigV1, type ThemeConfigV2 } from '../../config/theme.schema';

const v1Theme: ThemeConfigV1 = {
  brand: {
    name: 'Test',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      primaryLight: '#93c5fd',
      primaryDark: '#1e40af',
      primaryGradientStart: '#3b82f6',
      primaryGradientEnd: '#1e40af',
      heroGradientStart: '#eff6ff',
      heroGradientEnd: '#dbeafe',
      footerGradientStart: '#1e3a5f',
      footerGradientEnd: '#0f172a',
    },
    fonts: {
      heading: { family: 'Inter', weights: [600, 700], fallback: 'sans-serif' },
      body: { family: 'Inter', weights: [400, 500], fallback: 'sans-serif' },
    },
  },
  design: {
    borderRadius: 'rounded',
    shadows: 'subtle',
    spacing: 'comfortable',
  },
  colors: {
    slate: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
      400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
      800: '#1e293b', 900: '#0f172a',
    },
  },
};

const v2Theme: ThemeConfigV2 = {
  version: 2,
  brand: {
    name: 'Test Brand',
    palette: { teal: '#054547', gold: '#E9C92B' },
    shadeBase: '#0B0B07',
    shadeLight: '#FFFFFF',
    fonts: {
      heading: { family: 'Playfair Display', weights: [600, 700], fallback: 'serif' },
      body: { family: 'Inter', weights: [400, 500], fallback: 'sans-serif' },
    },
  },
  design: {
    borderRadius: 'rounded',
    shadows: 'subtle',
    spacing: 'comfortable',
  },
};

describe('generateThemeCSS', () => {
  describe('v1 regression', () => {
    const css = generateThemeCSS(v1Theme);

    it('contains brand colors', () => {
      expect(css).toContain('--color-primary: #3b82f6');
      expect(css).toContain('--color-primary-hover: #2563eb');
    });

    it('contains slate colors', () => {
      expect(css).toContain('--color-slate-50: #f8fafc');
      expect(css).toContain('--color-slate-900: #0f172a');
    });

    it('contains font variables', () => {
      expect(css).toContain('--font-heading: Inter');
      expect(css).toContain('--font-body: Inter');
    });
  });

  describe('v2 output', () => {
    const css = generateThemeCSS(v2Theme);

    it('contains brand palette colors', () => {
      expect(css).toContain('--color-teal:');
      expect(css).toContain('--color-gold:');
    });

    it('contains shade ramp (30 steps)', () => {
      expect(css).toContain('--color-shade-50:');
      expect(css).toContain('--color-shade-100:');
      expect(css).toContain('--color-shade-750:');
      expect(css).toContain('--color-shade-1500:');
    });

    it('contains semantic tokens', () => {
      expect(css).toContain('--color-primary:');
      expect(css).toContain('--color-primary-hover:');
      expect(css).toContain('--color-primary-light:');
      expect(css).toContain('--color-primary-dark:');
      expect(css).toContain('--color-accent:');
      expect(css).toContain('--color-surface:');
      expect(css).toContain('--color-surface-raised:');
      expect(css).toContain('--color-text:');
      expect(css).toContain('--color-text-muted:');
      expect(css).toContain('--color-text-subtle:');
      expect(css).toContain('--color-text-inverse:');
      expect(css).toContain('--color-text-on-primary:');
      expect(css).toContain('--color-border:');
      expect(css).toContain('--color-border-strong:');
    });

    it('contains backward-compat slate aliases', () => {
      expect(css).toContain('--color-slate-50: var(--color-shade-50)');
      expect(css).toContain('--color-slate-100: var(--color-shade-100)');
      expect(css).toContain('--color-slate-900: var(--color-shade-900)');
    });

    it('contains font variables', () => {
      expect(css).toContain('--font-heading: Playfair Display');
      expect(css).toContain('--font-body: Inter');
      expect(css).toContain('--font-serif: Playfair Display');
      expect(css).toContain('--font-sans: Inter');
    });

    it('contains gradient tokens', () => {
      expect(css).toContain('--color-hero-gradient-start:');
      expect(css).toContain('--color-hero-gradient-end:');
      expect(css).toContain('--color-footer-gradient-start:');
      expect(css).toContain('--color-footer-gradient-end:');
    });
  });
});

describe('generateDesignTokens', () => {
  it('produces radius, shadow, and spacing tokens for v1', () => {
    const css = generateDesignTokens(v1Theme);
    expect(css).toContain('--radius-default:');
    expect(css).toContain('--shadow-default:');
    expect(css).toContain('--space-section:');
    expect(css).toContain('--space-element:');
  });

  it('produces design tokens for v2', () => {
    const css = generateDesignTokens(v2Theme);
    expect(css).toContain('--radius-default:');
    expect(css).toContain('--shadow-default:');
  });
});

describe('generateDarkModeCSS', () => {
  it('generates dark mode CSS with inverted shades', () => {
    const darkTheme: ThemeConfigV2 = {
      ...v2Theme,
      darkMode: { enabled: true },
    };
    const css = generateDarkModeCSS(darkTheme);
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('.dark');
    expect(css).toContain('--color-shade-50:');
    expect(css).toContain('--color-surface:');
    expect(css).toContain('--color-text:');
  });

  it('includes semantic overrides in dark mode', () => {
    const darkTheme: ThemeConfigV2 = {
      ...v2Theme,
      darkMode: {
        enabled: true,
        semanticOverrides: { primary: '#66bbcc' },
      },
    };
    const css = generateDarkModeCSS(darkTheme);
    expect(css).toContain('--color-primary: #66bbcc');
  });

  it('returns empty string when dark mode not enabled', () => {
    expect(generateDarkModeCSS(v2Theme)).toBe('');
  });
});
