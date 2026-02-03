# Installation

This guide covers adding Simple Site Framework to an existing Next.js project or creating a new project from scratch.

## Prerequisites

Before installing, ensure you have:

- **Node.js** 18.x or later
- **npm** 9.x or later (or yarn/pnpm equivalent)
- **Next.js** 14.x or later with App Router
- **React** 18.x or 19.x
- **TypeScript** 5.x (recommended but not required)

## Quick Install (New Project)

The fastest way to start is with the CLI scaffolding tool:

```bash
npx @zoyth/simple-site-framework create my-site
cd my-site
npm install
npm run dev
```

This creates a complete Next.js project with all framework dependencies configured, sample configs, and example pages.

Skip to **[Quick Start Guide](./quick-start.md)** if you used this method.

## Manual Installation (Existing Project)

### 1. Install the Framework

```bash
npm install @zoyth/simple-site-framework
```

### 2. Install Peer Dependencies

The framework requires these peer dependencies:

```bash
npm install next@14 react@19 react-dom@19
npm install tailwindcss@4 @tailwindcss/postcss
```

**Tailwind CSS:** Both v3.4+ and v4.x are fully supported. The framework uses standard utility classes that work across versions.

### 3. Install Optional Dependencies

For full functionality, install these recommended packages:

```bash
# For forms with validation
npm install react-hook-form @hookform/resolvers zod

# For animations (optional)
npm install framer-motion

# For analytics tracking (optional)
npm install @vercel/analytics
```

## Configure Tailwind CSS

### 1. Initialize Tailwind (if not already done)

```bash
npx tailwindcss init -p --ts
```

### 2. Update `tailwind.config.ts`

Your Tailwind config **must** include the framework components in the `content` array:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // ⚠️ REQUIRED: Include framework components
    './node_modules/@zoyth/simple-site-framework/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        // Define colors that match your theme config
        primary: '#F16531',
        'primary-hover': '#D9551C',
        secondary: '#2D3748',
        'secondary-hover': '#1A202C',
        accent: '#F59E0B',
        'warm-gray': '#F8FAFC',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient-light': 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)',
        'hero-gradient': 'linear-gradient(135deg, #2D3748, #1A202C)',
        'footer-gradient-orange': 'linear-gradient(135deg, #F37840, #D85620)',
      },
    },
  },
};

export default config;
```

**Important:** The framework's components use custom theme tokens. If you skip this step, your site will render but look unstyled. See **[Troubleshooting](../../TROUBLESHOOTING.md)** for details.

### 3. Configure Fonts (Optional but Recommended)

Use Next.js's `next/font` for optimal font loading:

```typescript
// src/app/layout.tsx
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
```

## Setup Internationalization (Optional)

If you need multi-language support, create an i18n configuration:

### 1. Create i18n Config

```typescript
// src/config/i18n.ts
import type { I18nConfig } from '@zoyth/simple-site-framework';

export const i18nConfig: I18nConfig = {
  locales: ['en', 'fr'], // Your supported languages
  defaultLocale: 'en',
  localePrefix: 'as-needed', // Default locale has no prefix in URL
  localeDetection: true, // Auto-detect browser language
  localeNames: {
    en: 'English',
    fr: 'Français',
  },
};
```

### 2. Create Middleware

```typescript
// src/middleware.ts
import { createI18nMiddleware } from '@zoyth/simple-site-framework/lib/i18n';
import { i18nConfig } from './config/i18n';

export default createI18nMiddleware(i18nConfig);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 3. Update App Structure

For multi-language sites, use Next.js dynamic routing:

```
src/app/
  [locale]/
    layout.tsx
    page.tsx
    about/
      page.tsx
```

See **[Internationalization Guide](../features/internationalization.md)** for complete setup instructions.

## Verify Installation

Create a test page to ensure everything works:

```typescript
// src/app/page.tsx
import { HeroSection } from '@zoyth/simple-site-framework';

export default function HomePage() {
  return (
    <HeroSection
      heading="Welcome to My Site"
      description="Built with Simple Site Framework"
      cta={{
        text: 'Get Started',
        href: '/contact'
      }}
      variant="centered"
    />
  );
}
```

Run the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see a styled hero section.

## Troubleshooting

### Components Render Without Styling

**Cause:** Tailwind CSS isn't scanning the framework's components, or custom theme tokens are missing.

**Solution:**
1. Verify `tailwind.config.ts` includes the framework in `content` array
2. Define required theme tokens (colors, fonts, gradients)
3. Restart dev server after config changes

See **[TROUBLESHOOTING.md](../../TROUBLESHOOTING.md)** for detailed debugging.

### TypeScript Errors

**Cause:** Missing type definitions or incompatible versions.

**Solution:**
1. Ensure TypeScript 5.x is installed: `npm install -D typescript@5`
2. Check Next.js is v14+: `npm list next`
3. Restart TypeScript server in your editor

### Build Errors with "use client" Directives

**Cause:** Importing client-only components from server components.

**Solution:**
- Import analytics/client-only utilities from `/client`:
  ```typescript
  import { AnalyticsTracker } from '@zoyth/simple-site-framework/client';
  ```
- Server-safe components come from main export:
  ```typescript
  import { HeroSection } from '@zoyth/simple-site-framework';
  ```

See **[Server/Client Split](../core-concepts/server-client-split.md)** for details.

## Next Steps

Now that installation is complete:

- **[Quick Start →](./quick-start.md)** - Build your first page in 5 minutes
- **[First Project →](./first-project.md)** - Complete tutorial
- **[Configuration →](../core-concepts/configuration-driven.md)** - Learn the configuration approach
- **[Components →](../components/overview.md)** - Explore available components

## Package Information

```json
{
  "name": "@zoyth/simple-site-framework",
  "version": "0.1.0",
  "peerDependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "tailwindcss": "^3.4.0 || ^4.0.0"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0",
    "rehype-slug": "^6.0.0"
  }
}
```

**Note:** The framework has minimal dependencies. Heavy packages like `framer-motion`, `react-hook-form`, and `zod` are peer dependencies - install only what you need.
