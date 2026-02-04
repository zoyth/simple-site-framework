# Bundle Size

Minimize JavaScript sent to the browser.

## Why Bundle Size Matters

Every kilobyte of JavaScript:
- Must be downloaded (affects slow connections)
- Must be parsed and compiled (affects slow devices)
- Delays interactivity (affects FID/INP metrics)

## Framework Bundle Impact

The framework minimizes client-side JavaScript through Server Components:

| Component Type | Client JS Impact |
|---------------|-----------------|
| Server Components (most) | 0 KB |
| Client Components (interactive) | Varies |

### Zero-JS Components

These ship no JavaScript to the browser:
- HeroSection, FeaturesGrid, ServicesSection
- ContactSection, AboutSection, CTASection
- Header, Footer, Card, Button
- SEOMetaTags, StructuredData, I18nMetaTags

### Client Components

These add to the bundle:
- AnalyticsTracker, TrackedLink
- AnimatedSection, AnimatedCounter
- ExitIntentModal, CountdownTimer
- ContactForm (validation, submission)
- LanguageSelector (interaction)

## Measuring Bundle Size

### Next.js Build Output

```bash
npm run build
```

Check the output for page sizes:

```
Route (app)                    Size     First Load JS
┌ ○ /                          5.2 kB   89 kB
├ ○ /about                     1.8 kB   85.6 kB
├ ○ /services                  3.1 kB   87 kB
└ ○ /contact                   4.5 kB   88.3 kB
```

### Bundle Analyzer

```bash
npm install @next/bundle-analyzer

# Run analysis
ANALYZE=true npm run build
```

### Import Cost (VS Code)

Install the "Import Cost" extension to see package sizes inline.

## Reducing Bundle Size

### 1. Audit Imports

```typescript
// ❌ Bad - imports entire library
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Good - imports only what's needed
import debounce from 'lodash/debounce';
debounce(fn, 300);
```

### 2. Replace Heavy Libraries

| Heavy Library | Lighter Alternative |
|--------------|-------------------|
| moment.js (300KB) | date-fns or native Intl |
| lodash (70KB) | Individual lodash functions |
| jQuery (90KB) | Native DOM APIs |

### 3. Dynamic Import Heavy Dependencies

```typescript
// Only load when needed
const { default: heavyLib } = await import('heavy-library');
```

### 4. Use Server Components

Move data fetching and rendering to the server:

```typescript
// ✅ Server Component - no client JS
export default async function Page() {
  const data = await fetchData();
  return <DataDisplay data={data} />;
}
```

### 5. Check for Duplicates

Multiple versions of the same package inflate bundles:

```bash
# Check for duplicates
npm ls react
npm ls react-dom
```

## Budget Guidelines

Suggested bundle size budgets:

| Metric | Budget |
|--------|--------|
| Total JS (initial load) | < 100 KB (gzipped) |
| Per-page JS | < 30 KB (gzipped) |
| Largest single dependency | < 50 KB (gzipped) |

## See Also

- [Code Splitting](./code-splitting.md)
- [Monitoring](./monitoring.md)
- [Existing Performance Documentation](../../PERFORMANCE.md)
