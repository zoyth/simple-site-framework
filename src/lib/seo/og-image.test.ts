// ABOUTME: Tests for OG image generation utility
// ABOUTME: Verifies theme-driven layout, lazy font loading, and size constant

import { describe, it, expect, vi } from 'vitest';
import { ogImageSize, generateOgImage } from './og-image';
import { type ThemeConfigV1 } from '../../config/theme.schema';

const baseTheme: ThemeConfigV1 = {
  brand: {
    name: 'Test Brand',
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

describe('ogImageSize', () => {
  it('is 1200x630', () => {
    expect(ogImageSize).toEqual({ width: 1200, height: 630 });
  });
});

describe('generateOgImage', () => {
  it('returns a Response', async () => {
    const result = await generateOgImage(baseTheme, { title: 'Test' });
    expect(result).toBeInstanceOf(Response);
  });

  it('returns image/png content type', async () => {
    const result = await generateOgImage(baseTheme, { title: 'Test' });
    expect(result.headers.get('content-type')).toBe('image/png');
  });

  it('calls font loaders lazily', async () => {
    const headingLoader = vi.fn(() => new ArrayBuffer(8));
    const bodyLoader = vi.fn(() => new ArrayBuffer(8));

    await generateOgImage(baseTheme, {
      title: 'Test',
      fonts: { heading: headingLoader, body: bodyLoader },
    });

    expect(headingLoader).toHaveBeenCalledOnce();
    expect(bodyLoader).toHaveBeenCalledOnce();
  });

  it('works without fonts', async () => {
    const result = await generateOgImage(baseTheme, { title: 'No Fonts' });
    expect(result).toBeInstanceOf(Response);
  });

  it('works without subtitle', async () => {
    const result = await generateOgImage(baseTheme, { title: 'Title Only' });
    expect(result).toBeInstanceOf(Response);
  });

  it('accepts a custom accent color', async () => {
    const result = await generateOgImage(baseTheme, {
      title: 'Custom Accent',
      accentColor: '#ff0000',
    });
    expect(result).toBeInstanceOf(Response);
  });
});
