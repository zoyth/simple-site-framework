// ABOUTME: Token resolution from ThemeConfigV2 to concrete hex values
// ABOUTME: Computes shade ramp, derives semantic defaults, merges overrides

import { type ThemeConfigV2 } from '../../config/theme.schema';
import { generateShadeRamp, darken, lighten, hexToRgb, rgbToHex } from './color';

export interface ResolvedTokens {
  brand: Record<string, string>;
  shades: Record<number, string>;
  semantic: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    accentHover: string;
    destructive: string;
    surface: string;
    surfaceRaised: string;
    surfaceInverse: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    textInverse: string;
    textOnPrimary: string;
    border: string;
    borderStrong: string;
    heroGradientStart: string;
    heroGradientEnd: string;
    footerGradientStart: string;
    footerGradientEnd: string;
  };
}

/** Resolve a color reference — either a palette key or a hex value */
function resolveColorRef(
  ref: string,
  palette: Record<string, string>
): string {
  if (ref.startsWith('#') || ref.startsWith('rgb')) {
    return normalizeHex(ref);
  }
  const resolved = palette[ref];
  return resolved ? normalizeHex(resolved) : normalizeHex(ref);
}

function normalizeHex(hex: string): string {
  if (!hex.startsWith('#')) return hex;
  return rgbToHex(hexToRgb(hex));
}

/**
 * Resolve a ThemeConfigV2 into concrete hex values for all tokens.
 * Generates the shade ramp, derives semantic defaults, and merges any overrides.
 */
export function resolveTokens(config: ThemeConfigV2): ResolvedTokens {
  const { brand, semantic } = config;

  // Normalize palette values to lowercase hex
  const normalizedPalette: Record<string, string> = {};
  for (const [key, value] of Object.entries(brand.palette)) {
    normalizedPalette[key] = normalizeHex(value);
  }

  // Generate shade ramp
  const shades = generateShadeRamp(brand.shadeLight, brand.shadeBase);

  // Determine primary from semantic override or first palette entry
  const paletteKeys = Object.keys(normalizedPalette);
  const firstPaletteColor = normalizedPalette[paletteKeys[0]];
  const secondPaletteColor =
    paletteKeys.length > 1 ? normalizedPalette[paletteKeys[1]] : firstPaletteColor;

  const primary = semantic?.primary
    ? resolveColorRef(semantic.primary, normalizedPalette)
    : firstPaletteColor;

  const primaryHover = semantic?.primaryHover
    ? resolveColorRef(semantic.primaryHover, normalizedPalette)
    : darken(primary, 0.08);

  const primaryLight = semantic?.primaryLight
    ? resolveColorRef(semantic.primaryLight, normalizedPalette)
    : lighten(primary, 0.2);

  const primaryDark = semantic?.primaryDark
    ? resolveColorRef(semantic.primaryDark, normalizedPalette)
    : darken(primary, 0.1);

  const accent = semantic?.accent
    ? resolveColorRef(semantic.accent, normalizedPalette)
    : secondPaletteColor;

  const accentHover = semantic?.accentHover
    ? resolveColorRef(semantic.accentHover, normalizedPalette)
    : darken(accent, 0.08);

  const destructive = semantic?.destructive
    ? resolveColorRef(semantic.destructive, normalizedPalette)
    : '#dc2626';

  const heroGradientStart = semantic?.heroGradientStart
    ? resolveColorRef(semantic.heroGradientStart, normalizedPalette)
    : darken(primary, 0.15);

  const heroGradientEnd = semantic?.heroGradientEnd
    ? resolveColorRef(semantic.heroGradientEnd, normalizedPalette)
    : darken(primary, 0.25);

  const footerGradientStart = semantic?.footerGradientStart
    ? resolveColorRef(semantic.footerGradientStart, normalizedPalette)
    : darken(primary, 0.2);

  const footerGradientEnd = semantic?.footerGradientEnd
    ? resolveColorRef(semantic.footerGradientEnd, normalizedPalette)
    : darken(primary, 0.3);

  return {
    brand: normalizedPalette,
    shades,
    semantic: {
      primary,
      primaryHover,
      primaryLight,
      primaryDark,
      accent,
      accentHover,
      destructive,
      surface: shades[50],
      surfaceRaised: shades[100],
      surfaceInverse: shades[1500],
      text: shades[1500],
      textMuted: shades[1000],
      textSubtle: shades[700],
      textInverse: shades[50],
      textOnPrimary: shades[50],
      border: shades[200],
      borderStrong: shades[500],
      heroGradientStart,
      heroGradientEnd,
      footerGradientStart,
      footerGradientEnd,
    },
  };
}
