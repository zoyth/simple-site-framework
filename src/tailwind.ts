// ABOUTME: Tailwind config helpers entry point
// ABOUTME: Dependency-light so tailwind.config evaluation (jiti/Turbopack) never loads the MDX chain

export {
  getTailwindColors,
  getTailwindContentConfig,
  stripTailwindFalsePositives,
} from './lib/theme/tailwind';
export type { ThemeConfig, ThemeConfigV1, ThemeConfigV2 } from './config/theme.schema';
