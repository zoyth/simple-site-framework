// ABOUTME: Migration utility from ThemeConfigV1 to ThemeConfigV2
// ABOUTME: Converts flat color config into 3-layer token structure

import { type ThemeConfigV1, type ThemeConfigV2 } from '../../config/theme.schema';

/**
 * Migrate a v1 theme config to v2 format.
 *
 * Maps the flat color structure into palette + semantic overrides,
 * uses slate-50/slate-900 as shade endpoints, and preserves all
 * other settings (design, animations, fonts).
 */
export function migrateThemeV1toV2(v1: ThemeConfigV1): ThemeConfigV2 {
  return {
    version: 2,
    brand: {
      name: v1.brand.name,
      palette: {
        primary: v1.brand.colors.primary,
      },
      shadeLight: v1.colors.slate[50],
      shadeBase: v1.colors.slate[900],
      fonts: v1.brand.fonts,
    },
    semantic: {
      primaryHover: v1.brand.colors.primaryHover,
      primaryLight: v1.brand.colors.primaryLight,
      primaryDark: v1.brand.colors.primaryDark,
      heroGradientStart: v1.brand.colors.heroGradientStart,
      heroGradientEnd: v1.brand.colors.heroGradientEnd,
      footerGradientStart: v1.brand.colors.footerGradientStart,
      footerGradientEnd: v1.brand.colors.footerGradientEnd,
    },
    design: v1.design,
    ...(v1.animations && { animations: v1.animations }),
  };
}
