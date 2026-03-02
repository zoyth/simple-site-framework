// ABOUTME: Tests for prose CSS generation and shared prose class constants
// ABOUTME: Verifies preset selection, theme variable usage, and CSS output

import { describe, it, expect } from 'vitest';
import { generateProseCSS, PROSE_CLASSES } from './prose';
import { type ThemeConfig } from '../../config/theme.schema';

const baseTheme: ThemeConfig = {
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

function themeWithProse(preset: 'minimal' | 'editorial' | 'docs'): ThemeConfig {
  return { ...baseTheme, design: { ...baseTheme.design, prose: preset } };
}

describe('generateProseCSS', () => {
  describe('minimal preset', () => {
    it('returns empty string', () => {
      expect(generateProseCSS(themeWithProse('minimal'))).toBe('');
    });
  });

  describe('defaults to minimal when prose is not set', () => {
    it('returns empty string', () => {
      expect(generateProseCSS(baseTheme)).toBe('');
    });
  });

  describe('editorial preset', () => {
    const css = generateProseCSS(themeWithProse('editorial'));

    it('includes variable-width layout', () => {
      expect(css).toContain('max-width: 65ch');
      expect(css).toContain('max-width: 70ch');
    });

    it('includes lead paragraph styling', () => {
      expect(css).toContain('h1 + p');
      expect(css).toContain('font-weight: 300');
    });

    it('includes heading accent borders using theme colors', () => {
      expect(css).toContain('.prose h2');
      expect(css).toContain('border-left');
      expect(css).toContain('var(--color-primary)');
    });

    it('includes styled tables with themed header', () => {
      expect(css).toContain('.prose table');
      expect(css).toContain('border-radius');
      expect(css).toContain('.prose thead th');
      expect(css).toContain('var(--color-primary-dark)');
    });

    it('includes striped table rows using slate colors', () => {
      expect(css).toContain('nth-child(even)');
      expect(css).toContain('var(--color-slate-100)');
    });

    it('includes glossary-style definition spacing', () => {
      expect(css).toContain(':has(> strong:only-child)');
    });

    it('includes gradient HR using theme colors', () => {
      expect(css).toContain('.prose hr');
      expect(css).toContain('linear-gradient');
    });

    it('includes themed list markers', () => {
      expect(css).toContain('::marker');
      expect(css).toContain('var(--color-primary)');
    });

    it('includes styled blockquotes', () => {
      expect(css).toContain('.prose blockquote');
      expect(css).toContain('var(--color-primary)');
    });

    it('includes mobile responsive overrides', () => {
      expect(css).toContain('@media (max-width: 768px)');
    });
  });

  describe('docs preset', () => {
    const css = generateProseCSS(themeWithProse('docs'));

    it('includes variable-width layout', () => {
      expect(css).toContain('max-width: 65ch');
    });

    it('includes styled tables', () => {
      expect(css).toContain('.prose table');
    });

    it('includes glossary-style definition spacing', () => {
      expect(css).toContain(':has(> strong:only-child)');
    });

    it('includes themed list markers', () => {
      expect(css).toContain('::marker');
    });

    it('does not include lead paragraph', () => {
      expect(css).not.toContain('h1 + p');
    });

    it('does not include heading accent borders', () => {
      expect(css).not.toContain('border-left');
    });

    it('does not include gradient HR', () => {
      expect(css).not.toContain('linear-gradient');
    });

    it('includes mobile responsive overrides', () => {
      expect(css).toContain('@media (max-width: 768px)');
    });
  });
});

describe('PROSE_CLASSES', () => {
  it('includes base prose classes', () => {
    expect(PROSE_CLASSES).toContain('prose');
    expect(PROSE_CLASSES).toContain('prose-lg');
    expect(PROSE_CLASSES).toContain('max-w-none');
  });

  it('includes heading scroll margin', () => {
    expect(PROSE_CLASSES).toContain('prose-headings:scroll-mt-24');
  });

  it('includes word break utilities', () => {
    expect(PROSE_CLASSES).toContain('prose-headings:break-words');
    expect(PROSE_CLASSES).toContain('prose-p:break-words');
  });
});
