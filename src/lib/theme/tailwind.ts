// ABOUTME: Tailwind CSS color helper for v3 consumers
// ABOUTME: Generates a color mapping using CSS custom properties for tailwind.config.ts

import { type ThemeConfigV2 } from '../../config/theme.schema';

type TailwindColorValue = (opts: { opacityValue?: string }) => string;

/**
 * Create a Tailwind v3 color value function that supports opacity modifiers.
 *
 * Returns a function that Tailwind calls with `{ opacityValue }` when
 * a class like `bg-primary/10` is used. The function references a
 * `--color-*-rgb` CSS variable (space-separated R G B) so Tailwind can
 * compose `rgb(R G B / opacity)`.
 */
function colorVar(name: string): TailwindColorValue {
  return ({ opacityValue }: { opacityValue?: string } = {}) =>
    opacityValue
      ? `rgb(var(--color-${name}-rgb) / ${opacityValue})`
      : `rgb(var(--color-${name}-rgb))`;
}

/**
 * Generate a Tailwind v3 color mapping from a ThemeConfigV2.
 *
 * Returns an object suitable for `theme.extend.colors` in `tailwind.config.ts`.
 * All values are functions that reference `--color-*-rgb` CSS custom properties
 * emitted by `generateThemeCSS()`, supporting Tailwind's opacity modifier
 * syntax (e.g., `bg-primary/10`).
 *
 * @example
 * ```ts
 * // tailwind.config.ts
 * import { getTailwindColors } from '@zoyth/simple-site-framework';
 * import { theme } from './src/config/theme';
 *
 * export default {
 *   theme: { extend: { colors: getTailwindColors(theme) } },
 * };
 * ```
 */
export function getTailwindColors(
  config: ThemeConfigV2
): Record<string, string | Record<number, string>> {
  const colors: Record<string, any> = {};

  // Brand palette
  for (const name of Object.keys(config.brand.palette)) {
    colors[name] = colorVar(name);
  }

  // Shade ramp (30 steps)
  const shade: Record<number, TailwindColorValue> = {};
  for (let i = 1; i <= 30; i++) {
    const key = i * 50;
    shade[key] = colorVar(`shade-${key}`);
  }
  colors.shade = shade;

  // Semantic tokens
  const semanticKeys = [
    'primary',
    'primary-hover',
    'primary-light',
    'primary-dark',
    'accent',
    'accent-hover',
    'destructive',
    'surface',
    'surface-raised',
    'surface-inverse',
    'text',
    'text-muted',
    'text-subtle',
    'text-inverse',
    'text-on-primary',
    'border',
    'border-strong',
    'hero-gradient-start',
    'hero-gradient-end',
    'footer-gradient-start',
    'footer-gradient-end',
  ];

  for (const key of semanticKeys) {
    colors[key] = colorVar(key);
  }

  // Backward-compat slate aliases
  const slate: Record<number, TailwindColorValue> = {};
  for (let i = 50; i <= 900; i += 50) {
    slate[i] = colorVar(`slate-${i}`);
  }
  colors.slate = slate;

  return colors;
}
