// ABOUTME: Generates branded Open Graph images from ThemeConfig
// ABOUTME: Renders title/subtitle on a themed gradient background using next/og

import { ImageResponse } from 'next/og';
import { type ThemeConfig } from '../../config/theme.schema';

/** Standard OG image dimensions */
export const ogImageSize = { width: 1200, height: 630 };

export interface OgImageOptions {
  /** Page title displayed prominently */
  title: string;
  /** Subtitle displayed below the divider (e.g. site name) */
  subtitle?: string;
  /**
   * Lazy font loaders — called only when rendering.
   *
   * Use `() => readFileSync(...)` to avoid module-level file reads
   * that crash on Vercel's serverless runtime.
   */
  fonts?: {
    heading?: () => Buffer | ArrayBuffer;
    body?: () => Buffer | ArrayBuffer;
  };
  /** Accent bar color override (defaults to theme primary) */
  accentColor?: string;
}

/**
 * Generate a branded OG image from ThemeConfig
 *
 * Returns an `ImageResponse` for use in Next.js `opengraph-image.tsx` routes.
 * Gradient, fonts, and accent color are derived from the theme.
 *
 * Font data must be provided as lazy loaders to avoid module-level
 * `readFileSync` crashes on Vercel. OG image routes should always
 * export `generateStaticParams()` for SSG.
 *
 * @example
 * ```tsx
 * // src/app/[locale]/[slug]/opengraph-image.tsx
 * import { generateOgImage, ogImageSize } from '@zoyth/simple-site-framework';
 * import { readFileSync } from 'fs';
 * import { join } from 'path';
 *
 * export const size = ogImageSize;
 * export const contentType = 'image/png';
 *
 * export default async function Image({ params }) {
 *   return generateOgImage(theme, {
 *     title: 'Page Title',
 *     subtitle: 'Site Name',
 *     fonts: {
 *       heading: () => readFileSync(join(process.cwd(), 'public/fonts/heading.ttf')),
 *       body: () => readFileSync(join(process.cwd(), 'public/fonts/body.otf')),
 *     },
 *   });
 * }
 *
 * export function generateStaticParams() { ... }
 * ```
 */
export function generateOgImage(
  theme: ThemeConfig,
  options: OgImageOptions
): ImageResponse {
  const { title, subtitle, fonts, accentColor } = options;

  const gradient = `linear-gradient(135deg, ${theme.brand.colors.heroGradientStart} 0%, ${theme.brand.colors.heroGradientEnd} 100%)`;
  const accent = accentColor ?? theme.brand.colors.primary;
  const headingFamily = theme.brand.fonts.heading.family;
  const bodyFamily = theme.brand.fonts.body.family;
  const titleFontSize = title.length > 40 ? 52 : 64;

  const fontConfigs: { name: string; data: Buffer | ArrayBuffer; weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; style: 'normal' }[] = [];

  if (fonts?.heading) {
    fontConfigs.push({ name: headingFamily, data: fonts.heading(), weight: 700, style: 'normal' });
  }
  if (fonts?.body) {
    fontConfigs.push({ name: bodyFamily, data: fonts.body(), weight: 600, style: 'normal' });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: gradient,
          color: '#fff',
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: '80px',
            height: '4px',
            background: accent,
            marginBottom: '40px',
            borderRadius: '2px',
          }}
        />

        {/* Title */}
        <div
          style={{
            fontFamily: headingFamily,
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '32px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {subtitle && (
          <>
            {/* Divider */}
            <div
              style={{
                width: '100%',
                maxWidth: '900px',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.2)',
                marginBottom: '24px',
              }}
            />

            {/* Subtitle */}
            <div
              style={{
                fontFamily: bodyFamily,
                fontSize: 26,
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.75)',
                letterSpacing: '0.02em',
              }}
            >
              {subtitle}
            </div>
          </>
        )}
      </div>
    ),
    {
      ...ogImageSize,
      ...(fontConfigs.length > 0 && { fonts: fontConfigs }),
    }
  );
}
