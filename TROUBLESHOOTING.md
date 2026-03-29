# Troubleshooting Guide

## Components Render But Have No Styling

If your site renders but looks plain/unstyled with no colors or proper typography, this means the framework's custom Tailwind tokens aren't defined in your project.

### Required Setup Checklist

#### 1. Tailwind Configuration Must Include Framework Components

Your `tailwind.config.ts` **must** include the framework in the `content` array:

```typescript
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // ⚠️ CRITICAL: This line is required for Tailwind to scan framework components
    './node_modules/@zoyth/simple-site-framework/dist/**/*.{js,mjs}',
  ],
  // ...
};
```

Without this line, Tailwind won't scan the framework components and won't generate the CSS classes they use.

#### 2. Custom Theme Tokens Must Be Defined (v2)

With `ThemeConfigV2`, use `getTailwindColors()` and `getTailwindContentConfig()`:

```typescript
import { getTailwindColors, getTailwindContentConfig } from '@zoyth/simple-site-framework';
import { theme } from './src/config/theme';

const config: Config = {
  content: {
    files: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
      './node_modules/@zoyth/simple-site-framework/dist/**/*.{js,mjs}',
    ],
    ...getTailwindContentConfig(), // Strips false-positive classes for Turbopack
  },
  theme: {
    extend: {
      colors: getTailwindColors(theme),
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
};
```

#### 3. CSS Custom Properties Must Be Set Up

Create or update your `src/app/globals.css` to define font variables:

```css
@import 'tailwindcss';

:root {
  --font-heading: 'Playfair Display', serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-condensed: 'Oswald', sans-serif;
}
```

#### 4. Fonts Must Be Imported

In your root layout, import your fonts:

```typescript
import { Playfair_Display, IBM_Plex_Sans, Oswald } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-heading',
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-body',
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-condensed',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${playfair.variable} ${ibmPlex.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

#### 5. Verify CSS Import

Make sure your root layout imports `globals.css`:

```typescript
import './globals.css';
```

### Quick Diagnostic

Run through this checklist to identify what's missing:

- [ ] Framework path added to Tailwind `content` array
- [ ] Colors defined via `getTailwindColors(theme)` or manually
- [ ] Custom fonts defined in Tailwind config (`heading`, `body`)
- [ ] CSS custom properties defined in `globals.css`
- [ ] Fonts imported and applied in root layout
- [ ] `globals.css` imported in root layout

## Logo Is Too Large or Too Small in Header

The logo configuration uses separate properties for image dimensions vs. display size:

- **`width` / `height`**: The actual image dimensions (for Next.js Image optimization)
- **`displayHeight`**: The rendered height in pixels in the header (defaults to 48px)

### Example Logo Configuration

```typescript
logo: {
  image: '/logo.png',
  imageAlt: { fr: 'Mon entreprise', en: 'My Company' },
  href: '/',
  width: 1674,        // Actual image width
  height: 613,        // Actual image height
  displayHeight: 48,  // Rendered height in header (48px = h-12 in Tailwind)
}
```

If your logo appears too large, add or adjust the `displayHeight` property. If not specified, it defaults to 48px.

## Bundler Compatibility

### npm link Does Not Work with Turbopack

**Symptom**: `npm link @zoyth/simple-site-framework` followed by `next dev` fails to resolve imports. TypeScript types work but runtime imports fail.

**Cause**: Turbopack (the default bundler in Next.js 16) cannot resolve symlinked packages created by `npm link`. This is a Turbopack limitation, not a framework issue.

**Solutions** (in order of preference):

1. **Install from npm** (recommended): `npm install @zoyth/simple-site-framework`
2. **Install from tarball**: `npm pack` in the framework repo, then `npm install ./zoyth-simple-site-framework-x.x.x.tgz` in the consumer project
3. **Use `file:` protocol**: In consumer's `package.json`, add `"@zoyth/simple-site-framework": "file:../simple-site-framework"`
4. **Fall back to webpack**: `next dev --webpack` or `next build --webpack`

### Tailwind v3 + Turbopack: Invalid CSS Errors

**Symptom**: Build fails with `Unexpected token Semicolon` from Turbopack's CSS parser, referencing classes like `[-:=]`.

**Cause**: Tailwind's JIT scans the framework's built JS and misinterprets regex patterns from bundled syntax highlighting grammars as CSS class names.

**Fix**: Use `getTailwindContentConfig()` in your Tailwind config:

```typescript
import { getTailwindContentConfig } from '@zoyth/simple-site-framework';

export default {
  content: {
    files: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
      './node_modules/@zoyth/simple-site-framework/dist/**/*.{js,mjs}',
    ],
    ...getTailwindContentConfig(),
  },
};
```

### Bundler Support Matrix

| Bundler | npm install | npm link | file: protocol |
|---------|-------------|----------|----------------|
| webpack | ✅ | ✅ | ✅ |
| Turbopack | ✅ | ❌ | ✅ |

### Still Having Issues?

1. **Run build with verbose output**: `npm run build` - check for Tailwind warnings
2. **Inspect in browser**: Check if CSS classes are present in the HTML but not styled (missing Tailwind config) or if classes are completely missing (content path issue)
3. **Check CSS output size**: If your production CSS is very small (< 50KB), Tailwind isn't picking up the framework components

### Common Mistakes

- ❌ Using default Tailwind colors without defining custom tokens
- ❌ Forgetting to include framework in Tailwind content array
- ❌ Not setting up CSS custom properties for fonts
- ❌ Importing fonts but not applying variable classes to HTML element
- ❌ Defining theme tokens in wrong place (must be in `theme.extend`, not `theme`)

### Example: Complete Minimal Setup

See `QUICKSTART.md` for a complete working example with all required configuration.
