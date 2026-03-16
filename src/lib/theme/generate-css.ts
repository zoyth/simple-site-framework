// ABOUTME: CSS generation utility for theme system
// ABOUTME: Converts theme configuration to CSS custom properties

import {
  type ThemeConfig,
  type ThemeConfigV1,
  type ThemeConfigV2,
  isV2Theme,
} from '../../config/theme.schema';
import { resolveTokens } from './resolve';

export function generateThemeCSS(theme: ThemeConfig): string {
  if (isV2Theme(theme)) {
    return generateThemeCSSV2(theme);
  }
  return generateThemeCSSV1(theme);
}

function generateThemeCSSV1(theme: ThemeConfigV1): string {
  return `
    /* Brand Colors */
    --color-primary: ${theme.brand.colors.primary};
    --color-primary-hover: ${theme.brand.colors.primaryHover};
    --color-primary-light: ${theme.brand.colors.primaryLight};
    --color-primary-dark: ${theme.brand.colors.primaryDark};
    --color-primary-gradient-start: ${theme.brand.colors.primaryGradientStart};
    --color-primary-gradient-end: ${theme.brand.colors.primaryGradientEnd};
    --color-hero-gradient-start: ${theme.brand.colors.heroGradientStart};
    --color-hero-gradient-end: ${theme.brand.colors.heroGradientEnd};
    --color-footer-gradient-start: ${theme.brand.colors.footerGradientStart};
    --color-footer-gradient-end: ${theme.brand.colors.footerGradientEnd};

    /* Fonts */
    --font-heading: ${theme.brand.fonts.heading.family}, ${theme.brand.fonts.heading.fallback};
    --font-body: ${theme.brand.fonts.body.family}, ${theme.brand.fonts.body.fallback};
    --font-serif: ${theme.brand.fonts.heading.family}, ${theme.brand.fonts.heading.fallback};
    --font-sans: ${theme.brand.fonts.body.family}, ${theme.brand.fonts.body.fallback};

    /* Slate Colors */
    --color-slate-50: ${theme.colors.slate[50]};
    --color-slate-100: ${theme.colors.slate[100]};
    --color-slate-200: ${theme.colors.slate[200]};
    --color-slate-300: ${theme.colors.slate[300]};
    --color-slate-400: ${theme.colors.slate[400]};
    --color-slate-500: ${theme.colors.slate[500]};
    --color-slate-600: ${theme.colors.slate[600]};
    --color-slate-700: ${theme.colors.slate[700]};
    --color-slate-800: ${theme.colors.slate[800]};
    --color-slate-900: ${theme.colors.slate[900]};
  `.trim();
}

function generateThemeCSSV2(theme: ThemeConfigV2): string {
  const tokens = resolveTokens(theme);
  const lines: string[] = [];

  // Layer 1 — Brand palette
  lines.push('/* Brand Palette */');
  for (const [name, hex] of Object.entries(tokens.brand)) {
    lines.push(`--color-${name}: ${hex};`);
  }

  // Shade ramp
  lines.push('');
  lines.push('/* Shade Ramp */');
  const shadeKeys = Object.keys(tokens.shades).map(Number).sort((a, b) => a - b);
  for (const key of shadeKeys) {
    lines.push(`--color-shade-${key}: ${tokens.shades[key]};`);
  }

  // Layer 2 — Semantic tokens
  lines.push('');
  lines.push('/* Semantic Tokens */');
  lines.push(`--color-primary: ${tokens.semantic.primary};`);
  lines.push(`--color-primary-hover: ${tokens.semantic.primaryHover};`);
  lines.push(`--color-primary-light: ${tokens.semantic.primaryLight};`);
  lines.push(`--color-primary-dark: ${tokens.semantic.primaryDark};`);
  lines.push(`--color-accent: ${tokens.semantic.accent};`);
  lines.push(`--color-accent-hover: ${tokens.semantic.accentHover};`);
  lines.push(`--color-destructive: ${tokens.semantic.destructive};`);
  lines.push(`--color-surface: ${tokens.semantic.surface};`);
  lines.push(`--color-surface-raised: ${tokens.semantic.surfaceRaised};`);
  lines.push(`--color-surface-inverse: ${tokens.semantic.surfaceInverse};`);
  lines.push(`--color-text: ${tokens.semantic.text};`);
  lines.push(`--color-text-muted: ${tokens.semantic.textMuted};`);
  lines.push(`--color-text-subtle: ${tokens.semantic.textSubtle};`);
  lines.push(`--color-text-inverse: ${tokens.semantic.textInverse};`);
  lines.push(`--color-text-on-primary: ${tokens.semantic.textOnPrimary};`);
  lines.push(`--color-border: ${tokens.semantic.border};`);
  lines.push(`--color-border-strong: ${tokens.semantic.borderStrong};`);
  lines.push(`--color-hero-gradient-start: ${tokens.semantic.heroGradientStart};`);
  lines.push(`--color-hero-gradient-end: ${tokens.semantic.heroGradientEnd};`);
  lines.push(`--color-footer-gradient-start: ${tokens.semantic.footerGradientStart};`);
  lines.push(`--color-footer-gradient-end: ${tokens.semantic.footerGradientEnd};`);

  // Backward-compat aliases (slate-50..slate-900 → shade-50..shade-900)
  lines.push('');
  lines.push('/* Backward-Compat Aliases */');
  for (let i = 50; i <= 900; i += 50) {
    lines.push(`--color-slate-${i}: var(--color-shade-${i});`);
  }

  // Fonts
  lines.push('');
  lines.push('/* Fonts */');
  lines.push(`--font-heading: ${theme.brand.fonts.heading.family}, ${theme.brand.fonts.heading.fallback};`);
  lines.push(`--font-body: ${theme.brand.fonts.body.family}, ${theme.brand.fonts.body.fallback};`);
  lines.push(`--font-serif: ${theme.brand.fonts.heading.family}, ${theme.brand.fonts.heading.fallback};`);
  lines.push(`--font-sans: ${theme.brand.fonts.body.family}, ${theme.brand.fonts.body.fallback};`);

  return lines.join('\n    ');
}

export function generateDesignTokens(theme: ThemeConfig): string {
  // Both v1 and v2 share the same design token structure
  const radiusMap: Record<string, string> = {
    sharp: '0',
    rounded: '0.375rem',
    pill: '9999px',
  };

  const shadowMap: Record<string, string> = {
    flat: 'none',
    subtle: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    prominent: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  };

  const spacingMap: Record<string, { section: string; element: string }> = {
    compact: {
      section: '3rem',
      element: '1rem',
    },
    comfortable: {
      section: '6rem',
      element: '1.5rem',
    },
    spacious: {
      section: '8rem',
      element: '2rem',
    },
  };

  const spacing = spacingMap[theme.design.spacing];

  return `
    /* Design Tokens */
    --radius-default: ${radiusMap[theme.design.borderRadius]};
    --shadow-default: ${shadowMap[theme.design.shadows]};
    --space-section: ${spacing.section};
    --space-element: ${spacing.element};
  `.trim();
}

/** Generate dark mode CSS block for a v2 theme */
export function generateDarkModeCSS(theme: ThemeConfigV2): string {
  if (!theme.darkMode?.enabled) {
    return '';
  }

  const tokens = resolveTokens(theme);
  const shadeKeys = Object.keys(tokens.shades).map(Number).sort((a, b) => a - b);

  // Invert shade ramp for dark mode
  const invertedShades: Record<number, string> = {};
  const reversedKeys = [...shadeKeys].reverse();
  for (let i = 0; i < shadeKeys.length; i++) {
    invertedShades[shadeKeys[i]] = tokens.shades[reversedKeys[i]];
  }

  const lines: string[] = [];

  // Inverted shades
  for (const key of shadeKeys) {
    lines.push(`      --color-shade-${key}: ${invertedShades[key]};`);
  }

  // Dark semantic tokens (surface/text use inverted shades)
  lines.push(`      --color-surface: ${invertedShades[50]};`);
  lines.push(`      --color-surface-raised: ${invertedShades[100]};`);
  lines.push(`      --color-surface-inverse: ${invertedShades[1500]};`);
  lines.push(`      --color-text: ${invertedShades[1500]};`);
  lines.push(`      --color-text-muted: ${invertedShades[1000]};`);
  lines.push(`      --color-text-subtle: ${invertedShades[700]};`);
  lines.push(`      --color-text-inverse: ${invertedShades[50]};`);
  lines.push(`      --color-border: ${invertedShades[200]};`);
  lines.push(`      --color-border-strong: ${invertedShades[500]};`);

  // Apply semantic overrides
  if (theme.darkMode.semanticOverrides) {
    for (const [key, value] of Object.entries(theme.darkMode.semanticOverrides)) {
      lines.push(`      --color-${key}: ${value};`);
    }
  }

  // Backward-compat slate aliases
  for (let i = 50; i <= 900; i += 50) {
    lines.push(`      --color-slate-${i}: var(--color-shade-${i});`);
  }

  const body = lines.join('\n');

  return [
    '@media (prefers-color-scheme: dark) {',
    '  :root:not(.light) {',
    body,
    '  }',
    '}',
    '.dark {',
    body,
    '}',
  ].join('\n');
}
