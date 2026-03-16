// ABOUTME: Tests for token resolution from ThemeConfigV2
// ABOUTME: Verifies shade ramp, semantic defaults, override merging

import { describe, it, expect } from 'vitest';
import { resolveTokens, type ResolvedTokens } from './resolve';
import { type ThemeConfigV2 } from '../../config/theme.schema';
import { hexToRgb, rgbToOklch } from './color';

const baseV2Theme: ThemeConfigV2 = {
  version: 2,
  brand: {
    name: 'Test Brand',
    palette: { teal: '#054547', gold: '#E9C92B' },
    shadeBase: '#0B0B07',
    shadeLight: '#FFFFFF',
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
};

describe('resolveTokens', () => {
  const tokens = resolveTokens(baseV2Theme);

  describe('brand palette', () => {
    it('includes all palette colors', () => {
      expect(tokens.brand.teal).toBe('#054547');
      expect(tokens.brand.gold).toBe('#e9c92b');
    });
  });

  describe('shade ramp', () => {
    it('produces 30 shade steps', () => {
      expect(Object.keys(tokens.shades)).toHaveLength(30);
    });

    it('shade-50 is near white', () => {
      const rgb = hexToRgb(tokens.shades[50]);
      expect(rgb.r).toBeGreaterThan(240);
    });

    it('shade-1500 is near black', () => {
      const rgb = hexToRgb(tokens.shades[1500]);
      expect(rgb.r).toBeLessThan(20);
    });
  });

  describe('semantic defaults', () => {
    it('primary defaults to first palette entry', () => {
      expect(tokens.semantic.primary).toBe('#054547');
    });

    it('derives primaryHover (darker than primary)', () => {
      const primaryL = rgbToOklch(hexToRgb(tokens.semantic.primary)).l;
      const hoverL = rgbToOklch(hexToRgb(tokens.semantic.primaryHover)).l;
      expect(hoverL).toBeLessThan(primaryL);
    });

    it('derives primaryLight (lighter than primary)', () => {
      const primaryL = rgbToOklch(hexToRgb(tokens.semantic.primary)).l;
      const lightL = rgbToOklch(hexToRgb(tokens.semantic.primaryLight)).l;
      expect(lightL).toBeGreaterThan(primaryL);
    });

    it('derives primaryDark (darker than primary)', () => {
      const primaryL = rgbToOklch(hexToRgb(tokens.semantic.primary)).l;
      const darkL = rgbToOklch(hexToRgb(tokens.semantic.primaryDark)).l;
      expect(darkL).toBeLessThan(primaryL);
    });

    it('accent defaults to second palette entry when available', () => {
      expect(tokens.semantic.accent).toBe('#e9c92b');
    });

    it('surface maps to shade-50', () => {
      expect(tokens.semantic.surface).toBe(tokens.shades[50]);
    });

    it('surfaceRaised maps to shade-100', () => {
      expect(tokens.semantic.surfaceRaised).toBe(tokens.shades[100]);
    });

    it('text maps to shade-1500', () => {
      expect(tokens.semantic.text).toBe(tokens.shades[1500]);
    });

    it('textMuted maps to shade-1000', () => {
      expect(tokens.semantic.textMuted).toBe(tokens.shades[1000]);
    });

    it('textSubtle maps to shade-700', () => {
      expect(tokens.semantic.textSubtle).toBe(tokens.shades[700]);
    });

    it('textInverse maps to shade-50', () => {
      expect(tokens.semantic.textInverse).toBe(tokens.shades[50]);
    });

    it('border maps to shade-200', () => {
      expect(tokens.semantic.border).toBe(tokens.shades[200]);
    });

    it('borderStrong maps to shade-500', () => {
      expect(tokens.semantic.borderStrong).toBe(tokens.shades[500]);
    });
  });

  describe('semantic overrides', () => {
    it('respects explicit primary override as hex', () => {
      const theme: ThemeConfigV2 = {
        ...baseV2Theme,
        semantic: { primary: '#FF0000' },
      };
      const t = resolveTokens(theme);
      expect(t.semantic.primary).toBe('#ff0000');
    });

    it('respects primary override as palette key', () => {
      const theme: ThemeConfigV2 = {
        ...baseV2Theme,
        semantic: { primary: 'gold' },
      };
      const t = resolveTokens(theme);
      expect(t.semantic.primary).toBe('#e9c92b');
    });

    it('respects explicit gradient overrides', () => {
      const theme: ThemeConfigV2 = {
        ...baseV2Theme,
        semantic: {
          heroGradientStart: '#111111',
          heroGradientEnd: '#222222',
        },
      };
      const t = resolveTokens(theme);
      expect(t.semantic.heroGradientStart).toBe('#111111');
      expect(t.semantic.heroGradientEnd).toBe('#222222');
    });
  });

  describe('single-palette entry', () => {
    it('accent falls back to primary when only one palette entry', () => {
      const theme: ThemeConfigV2 = {
        ...baseV2Theme,
        brand: { ...baseV2Theme.brand, palette: { teal: '#054547' } },
      };
      const t = resolveTokens(theme);
      expect(t.semantic.accent).toBe('#054547');
    });
  });
});
