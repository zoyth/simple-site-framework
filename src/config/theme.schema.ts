// ABOUTME: Theme configuration schema for design system abstraction
// ABOUTME: Defines the structure for brand colors, fonts, and design tokens

export interface ThemeConfig {
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
