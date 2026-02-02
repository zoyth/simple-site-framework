# Export Structure

The framework provides separate entry points for different contexts to ensure edge-runtime safety and tree-shaking.

## Entry Points

### Main Index (`simple-site-framework`)
Server-safe exports - can be imported in any context including middleware.

```typescript
import {
  // Configuration
  ThemeConfig, SiteContent, NavigationConfig,

  // Server-safe utilities
  getLocalizedString,
  cn,

  // Server-safe components (no client hooks)
  TrackedLink,
  FeaturesGrid,
} from 'simple-site-framework';
```

### Components (`simple-site-framework/components`)
All UI components with 'use client' directive.

```typescript
import {
  Button,
  Header,
  Footer,
  HeroSection,
  ContactSection,
  LanguageSelector,
  I18nMetaTags,
  // ... all other components
} from 'simple-site-framework/components';
```

### i18n Library (`simple-site-framework/lib/i18n`)
**Middleware-safe** - No client code, can be used in edge runtime.

```typescript
// ✅ Safe to import in middleware
import {
  createI18nMiddleware,
  setI18nConfig,
  getTextDirection,
  formatDate,
  // ... all i18n utilities
} from 'simple-site-framework/lib/i18n';
```

### Client-Only (`simple-site-framework/client`)
**Browser-only components** - Uses client hooks and browser APIs.

```typescript
// ⚠️ DO NOT import in middleware or SSR context
import { AnalyticsTracker } from 'simple-site-framework/client';
```

## Usage Examples

### ✅ Correct: Middleware
```typescript
// src/middleware.ts
import { createI18nMiddleware } from 'simple-site-framework/lib/i18n';
import { i18nConfig } from './config/i18n';

export default createI18nMiddleware(i18nConfig);
```

### ✅ Correct: Layout with Client Component
```typescript
// src/app/layout.tsx
import { Header, Footer } from 'simple-site-framework/components';
import { AnalyticsTracker } from 'simple-site-framework/client';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsTracker />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

### ❌ Wrong: Importing Client Code in Middleware
```typescript
// src/middleware.ts
import { AnalyticsTracker } from 'simple-site-framework'; // ❌ Will break!
import { createI18nMiddleware } from 'simple-site-framework'; // ❌ Pulls in client code!
```

## Bundle Sizes

- **Main index**: ~48 KB (server-safe)
- **Components**: ~1.3 MB (includes all UI components)
- **lib/i18n**: ~18 KB (middleware-safe)
- **client**: ~2.3 KB (browser-only)

## Migration from Old Structure

If you were importing `AnalyticsTracker` from the main index:

```typescript
// Old (before v0.2.0)
import { AnalyticsTracker } from 'simple-site-framework';

// New (v0.2.0+)
import { AnalyticsTracker } from 'simple-site-framework/client';
```

All other component imports remain unchanged:

```typescript
// Still works the same
import { Button, Header } from 'simple-site-framework/components';
```
