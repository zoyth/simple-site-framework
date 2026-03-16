// ABOUTME: Theme configuration schema for design system abstraction
// ABOUTME: Defines the structure for brand colors, fonts, and design tokens

export interface ThemeConfigV1 {
  brand: {
    name: string;
    colors: {
      primary: string;
      primaryHover: string;
      primaryLight: string;
      primaryDark: string;
      primaryGradientStart: string;
      primaryGradientEnd: string;
      heroGradientStart: string;
      heroGradientEnd: string;
      footerGradientStart: string;
      footerGradientEnd: string;
    };
    fonts: {
      heading: {
        family: string;
        weights: number[];
        fallback: string;
      };
      body: {
        family: string;
        weights: number[];
        fallback: string;
      };
    };
  };
  design: {
    borderRadius: 'sharp' | 'rounded' | 'pill';
    shadows: 'flat' | 'subtle' | 'prominent';
    spacing: 'compact' | 'comfortable' | 'spacious';
    prose?: 'minimal' | 'editorial' | 'docs';
  };
  animations?: {
    speed?: 'slow' | 'normal' | 'fast';
    reduceMotion?: boolean;
  };
  colors: {
    slate: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
}

export interface ThemeConfigV2 {
  version: 2;
  brand: {
    name: string;
    palette: Record<string, string>;
    shadeBase: string;
    shadeLight: string;
    fonts: {
      heading: { family: string; weights: number[]; fallback: string };
      body: { family: string; weights: number[]; fallback: string };
    };
  };
  semantic?: {
    primary?: string;
    primaryHover?: string;
    primaryLight?: string;
    primaryDark?: string;
    accent?: string;
    accentHover?: string;
    destructive?: string;
    heroGradientStart?: string;
    heroGradientEnd?: string;
    footerGradientStart?: string;
    footerGradientEnd?: string;
  };
  design: {
    borderRadius: 'sharp' | 'rounded' | 'pill';
    shadows: 'flat' | 'subtle' | 'prominent';
    spacing: 'compact' | 'comfortable' | 'spacious';
    prose?: 'minimal' | 'editorial' | 'docs';
  };
  animations?: {
    speed?: 'slow' | 'normal' | 'fast';
    reduceMotion?: boolean;
  };
  darkMode?: {
    enabled?: boolean;
    semanticOverrides?: Record<string, string>;
  };
}

export type ThemeConfig = ThemeConfigV1 | ThemeConfigV2;

export function isV2Theme(theme: ThemeConfig): theme is ThemeConfigV2 {
  return 'version' in theme && theme.version === 2;
}

export function isV1Theme(theme: ThemeConfig): theme is ThemeConfigV1 {
  return !isV2Theme(theme);
}
