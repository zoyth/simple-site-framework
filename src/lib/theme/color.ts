// ABOUTME: Color math utilities for the design token system
// ABOUTME: Provides hex↔RGB↔OKLCH conversions, shade ramp generation, darken/lighten

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

/** Parse a hex color string to RGB values (0–255) */
export function hexToRgb(hex: string): RGB {
  const clean = hex.replace(/^#/, '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/** Convert RGB values (0–255) to a lowercase hex string */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

// sRGB → linear RGB
function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

// linear RGB → sRGB
function linearToSrgb(c: number): number {
  const s = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, s * 255)));
}

/** Convert RGB (0–255) to OKLCH */
export function rgbToOklch(rgb: RGB): OKLCH {
  // sRGB → linear
  const lr = srgbToLinear(rgb.r);
  const lg = srgbToLinear(rgb.g);
  const lb = srgbToLinear(rgb.b);

  // Linear RGB → LMS (using OKLab matrix)
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // Cube root
  const l1 = Math.cbrt(l_);
  const m1 = Math.cbrt(m_);
  const s1 = Math.cbrt(s_);

  // LMS → OKLab
  const L = 0.2104542553 * l1 + 0.7936177850 * m1 - 0.0040720468 * s1;
  const a = 1.9779984951 * l1 - 2.4285922050 * m1 + 0.4505937099 * s1;
  const b = 0.0259040371 * l1 + 0.7827717662 * m1 - 0.8086757660 * s1;

  // OKLab → OKLCH
  const c = Math.sqrt(a * a + b * b);
  const h = (Math.atan2(b, a) * 180) / Math.PI;

  return { l: L, c, h: h < 0 ? h + 360 : h };
}

/** Convert OKLCH to RGB (0–255) */
export function oklchToRgb(oklch: OKLCH): RGB {
  const { l: L, c, h } = oklch;

  // OKLCH → OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab → LMS (inverse matrix)
  const l1 = L + 0.3963377774 * a + 0.2158037573 * b;
  const m1 = L - 0.1055613458 * a - 0.0638541728 * b;
  const s1 = L - 0.0894841775 * a - 1.2914855480 * b;

  // Cube
  const l_ = l1 * l1 * l1;
  const m_ = m1 * m1 * m1;
  const s_ = s1 * s1 * s1;

  // LMS → linear RGB (inverse matrix)
  const lr = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  return {
    r: linearToSrgb(lr),
    g: linearToSrgb(lg),
    b: linearToSrgb(lb),
  };
}

/**
 * Generate a 30-step shade ramp from light to dark endpoints via OKLCH interpolation.
 * Keys are 50, 100, 150, ..., 1500.
 */
export function generateShadeRamp(
  lightHex: string,
  darkHex: string
): Record<number, string> {
  const lightOklch = rgbToOklch(hexToRgb(lightHex));
  const darkOklch = rgbToOklch(hexToRgb(darkHex));

  const ramp: Record<number, string> = {};
  const steps = 30;

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const key = (i + 1) * 50;

    // Interpolate in OKLCH
    const l = lightOklch.l + (darkOklch.l - lightOklch.l) * t;
    const c = lightOklch.c + (darkOklch.c - lightOklch.c) * t;

    // Handle hue interpolation (shortest path)
    let hDiff = darkOklch.h - lightOklch.h;
    if (hDiff > 180) hDiff -= 360;
    if (hDiff < -180) hDiff += 360;
    // For achromatic colors (very low chroma), hue is meaningless
    const h =
      lightOklch.c < 0.001 && darkOklch.c < 0.001
        ? 0
        : lightOklch.h + hDiff * t;

    ramp[key] = rgbToHex(oklchToRgb({ l, c, h }));
  }

  return ramp;
}

/** Darken a hex color by reducing its OKLCH lightness by the given amount (0–1) */
export function darken(hex: string, amount: number): string {
  const oklch = rgbToOklch(hexToRgb(hex));
  oklch.l = Math.max(0, oklch.l - amount);
  return rgbToHex(oklchToRgb(oklch));
}

/** Lighten a hex color by increasing its OKLCH lightness by the given amount (0–1) */
export function lighten(hex: string, amount: number): string {
  const oklch = rgbToOklch(hexToRgb(hex));
  oklch.l = Math.min(1, oklch.l + amount);
  // Reduce chroma as we approach white to avoid out-of-gamut colors
  if (oklch.l > 0.95) {
    oklch.c *= (1 - oklch.l) / 0.05;
  }
  return rgbToHex(oklchToRgb(oklch));
}
