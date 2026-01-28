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

#### 2. Custom Theme Tokens Must Be Defined

The framework components use custom theme tokens that **you must define** in your `tailwind.config.ts`:

```typescript
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@zoyth/simple-site-framework/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        // Required color tokens - customize to match your brand
        primary: '#F16531',           // Main brand color
        'primary-hover': '#D9551C',   // Hover state for primary
        charcoal: '#2D3748',          // Dark text color
        'warm-gray': '#F7F3F0',       // Light background
      },
      fontFamily: {
        // Required font tokens - customize to match your fonts
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        condensed: ['var(--font-condensed)', 'sans-serif'],
      },
      backgroundImage: {
        // Required gradient tokens - customize to match your brand
        'brand-gradient-light': 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)',
        'hero-gradient': 'linear-gradient(135deg, #2D3748, #1A202C)',
        'footer-gradient-orange': 'linear-gradient(135deg, #F37840, #D85620)',
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
- [ ] Custom colors defined in Tailwind config (`primary`, `primary-hover`, `charcoal`, `warm-gray`)
- [ ] Custom fonts defined in Tailwind config (`heading`, `body`, `condensed`)
- [ ] Custom gradients defined in Tailwind config
- [ ] CSS custom properties defined in `globals.css`
- [ ] Fonts imported and applied in root layout
- [ ] `globals.css` imported in root layout

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
