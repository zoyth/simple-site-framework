// ABOUTME: Dynamic font loading utility for theme system
// ABOUTME: Loads Google Fonts based on theme configuration

import { type ThemeConfig } from '../../config/theme.schema';

/**
 * Gets the font import configuration for Next.js
 * This prepares the data needed to dynamically import fonts
 */
export function getFontConfig(theme: ThemeConfig) {
  return {
    heading: {
      family: theme.brand.fonts.heading.family,
      weights: theme.brand.fonts.heading.weights.map(String),
      variable: '--font-heading',
    },
    body: {
      family: theme.brand.fonts.body.family,
      weights: theme.brand.fonts.body.weights.map(String),
      variable: '--font-body',
    },
  };
}

/**
 * Generates CSS variable names from theme fonts
 */
export function getFontVariables(theme: ThemeConfig): string {
  const headingFamily = theme.brand.fonts.heading.family.replace(/\s+/g, '-').toLowerCase();
  const bodyFamily = theme.brand.fonts.body.family.replace(/\s+/g, '-').toLowerCase();

  return `var(--font-${headingFamily}) var(--font-${bodyFamily})`;
}
