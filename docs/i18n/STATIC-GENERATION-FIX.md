# Static Generation Fix for i18n

## Problem

During Next.js static generation, components are rendered before layout code runs, causing "i18n configuration not initialized" errors.

## Solution Options

### Option 1: Initialize in instrumentation.ts (Recommended)

Create `src/instrumentation.ts` which runs before static generation:

```typescript
// src/instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { setI18nConfig } = await import('simple-site-framework/lib/i18n');
    const { i18nConfig } = await import('./config/i18n');

    setI18nConfig(i18nConfig);
  }
}
```

Enable instrumentation in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
```

### Option 2: Pass config to components

Instead of global config, pass it to components that need it:

```typescript
// Not implemented yet - would require framework changes
<HeroSection config={i18nConfig} locale={locale} />
```

### Option 3: Environment variable fallback

Add to `.env.local`:

```bash
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_LOCALES=en,fr,es
```

Then update framework to use env vars as fallback when config not initialized.

## Testing

After implementing Option 1:

```bash
npm run build
# Should succeed with static generation
```

## Notes

- Global state in Next.js is tricky with static generation
- Each page generation might run in a separate worker process
- `instrumentation.ts` runs once per worker, ensuring config is available
