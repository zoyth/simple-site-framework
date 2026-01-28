// ABOUTME: CSS generation utility for theme system
// ABOUTME: Converts theme configuration to CSS custom properties

import { type ThemeConfig } from '../../config/theme.schema';

export function generateThemeCSS(theme: ThemeConfig): string {
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

export function generateDesignTokens(theme: ThemeConfig): string {
  // Border radius mapping
  const radiusMap: Record<ThemeConfig['design']['borderRadius'], string> = {
    sharp: '0',
    rounded: '0.375rem',
    pill: '9999px',
  };

  // Shadow mapping
  const shadowMap: Record<ThemeConfig['design']['shadows'], string> = {
    flat: 'none',
    subtle: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    prominent: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  };

  // Spacing mapping
  const spacingMap: Record<ThemeConfig['design']['spacing'], { section: string; element: string }> = {
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
