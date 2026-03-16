// ABOUTME: Tests for color math utilities used by the design token system
// ABOUTME: Verifies hex↔RGB↔OKLCH conversions, shade ramp generation, darken/lighten

import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
  generateShadeRamp,
  darken,
  lighten,
} from './color';

describe('hexToRgb', () => {
  it('converts 6-digit hex to RGB', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#054547')).toEqual({ r: 5, g: 69, b: 71 });
  });

  it('handles uppercase hex', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('handles hex without hash', () => {
    expect(hexToRgb('054547')).toEqual({ r: 5, g: 69, b: 71 });
  });
});

describe('rgbToHex', () => {
  it('converts RGB to hex', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
    expect(rgbToHex({ r: 5, g: 69, b: 71 })).toBe('#054547');
  });
});

describe('hex↔RGB round-trip', () => {
  const colors = ['#054547', '#E9C92B', '#000000', '#ffffff', '#3b82f6'];

  it.each(colors)('round-trips %s', (hex) => {
    const rgb = hexToRgb(hex);
    expect(rgbToHex(rgb)).toBe(hex.toLowerCase());
  });
});

describe('RGB↔OKLCH round-trip', () => {
  const colors = [
    { r: 5, g: 69, b: 71 },
    { r: 233, g: 201, b: 43 },
    { r: 128, g: 128, b: 128 },
    { r: 255, g: 255, b: 255 },
    { r: 0, g: 0, b: 0 },
  ];

  it.each(colors)('round-trips rgb($r, $g, $b) within ±1', (rgb) => {
    const oklch = rgbToOklch(rgb);
    const back = oklchToRgb(oklch);
    expect(back.r).toBeCloseTo(rgb.r, 0);
    expect(back.g).toBeCloseTo(rgb.g, 0);
    expect(back.b).toBeCloseTo(rgb.b, 0);
  });
});

describe('generateShadeRamp', () => {
  const ramp = generateShadeRamp('#FFFFFF', '#0B0B07');

  it('produces 30 steps', () => {
    expect(Object.keys(ramp)).toHaveLength(30);
  });

  it('has keys from 50 to 1500 in steps of 50', () => {
    const keys = Object.keys(ramp).map(Number);
    const expected = Array.from({ length: 30 }, (_, i) => (i + 1) * 50);
    expect(keys).toEqual(expected);
  });

  it('starts near the light endpoint', () => {
    const firstRgb = hexToRgb(ramp[50]);
    // shade-50 should be very light
    expect(firstRgb.r).toBeGreaterThan(240);
    expect(firstRgb.g).toBeGreaterThan(240);
    expect(firstRgb.b).toBeGreaterThan(240);
  });

  it('ends near the dark endpoint', () => {
    const lastRgb = hexToRgb(ramp[1500]);
    // shade-1500 should be very dark
    expect(lastRgb.r).toBeLessThan(20);
    expect(lastRgb.g).toBeLessThan(20);
    expect(lastRgb.b).toBeLessThan(20);
  });

  it('has monotonically decreasing lightness', () => {
    const keys = Object.keys(ramp).map(Number).sort((a, b) => a - b);
    for (let i = 1; i < keys.length; i++) {
      const prevOklch = rgbToOklch(hexToRgb(ramp[keys[i - 1]]));
      const currOklch = rgbToOklch(hexToRgb(ramp[keys[i]]));
      expect(currOklch.l).toBeLessThanOrEqual(prevOklch.l + 0.001);
    }
  });
});

describe('darken', () => {
  it('produces a darker color', () => {
    const original = '#3b82f6';
    const darkened = darken(original, 0.2);
    const origOklch = rgbToOklch(hexToRgb(original));
    const darkOklch = rgbToOklch(hexToRgb(darkened));
    expect(darkOklch.l).toBeLessThan(origOklch.l);
  });

  it('clamps to black at extreme values', () => {
    const result = darken('#000000', 0.5);
    expect(result).toBe('#000000');
  });
});

describe('lighten', () => {
  it('produces a lighter color', () => {
    const original = '#054547';
    const lightened = lighten(original, 0.3);
    const origOklch = rgbToOklch(hexToRgb(original));
    const lightOklch = rgbToOklch(hexToRgb(lightened));
    expect(lightOklch.l).toBeGreaterThan(origOklch.l);
  });

  it('clamps to white at extreme values', () => {
    const result = lighten('#ffffff', 0.5);
    expect(result).toBe('#ffffff');
  });
});
