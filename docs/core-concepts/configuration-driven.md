# Configuration-Driven Design

Simple Site Framework uses a configuration-driven approach where you define your site's structure, content, and appearance in configuration files rather than writing repetitive component markup.

## Why Configuration-Driven?

### Problem: Repetitive Code

Traditional component-based development leads to repetition:

```typescript
// page1.tsx
<section className="py-20 bg-gray-50">
  <div className="max-w-6xl mx-auto px-4">
    <h1 className="text-4xl font-bold text-center">About Us</h1>
    <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mt-4">
      Learn about our company
    </p>
  </div>
</section>

// page2.tsx - almost identical
<section className="py-20 bg-gray-50">
  <div className="max-w-6xl mx-auto px-4">
    <h1 className="text-4xl font-bold text-center">Our Services</h1>
    <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mt-4">
      Discover what we offer
    </p>
  </div>
</section>
```

Problems:
- **Inconsistency** - Easy to use wrong spacing, colors, or fonts
- **Maintenance** - Design changes require updating every instance
- **No reusability** - Content and structure are tightly coupled
- **Error-prone** - Missing classes, wrong values, accessibility issues

### Solution: Configuration

Define the structure once, vary only the content:

```typescript
// Consistent structure, different content
<HeroSection
  heading="About Us"
  description="Learn about our company"
/>

<HeroSection
  heading="Our Services"
  description="Discover what we offer"
/>
```

Benefits:
- **Consistency** - Components enforce design system
- **Maintainability** - Change structure in one place
- **Type safety** - TypeScript prevents configuration errors
- **Accessibility** - Built-in, can't forget it
- **Performance** - Optimizations applied automatically

## Configuration Layers

The framework uses multiple configuration layers:

### 1. Framework Defaults

Built-in sensible defaults:

```typescript
// You don't configure this - it's built into components
const defaults = {
  spacing: 'py-20',
  maxWidth: 'max-w-6xl',
  textAlign: 'center',
  // ... accessibility, responsive behavior, etc.
};
```

### 2. Theme Configuration

Define your brand once in `tailwind.config.ts`:

```typescript
const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: '#F16531',
        secondary: '#2D3748',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

All components automatically use these tokens.

### 3. Site Configuration

Global site settings in `src/config/site.ts`:

```typescript
export const siteConfig = {
  name: 'Acme Corporation',
  description: 'Professional consulting services',
  url: 'https://acme.com',
  contact: {
    email: 'hello@acme.com',
    phone: '+1 (555) 123-4567',
  },
  social: {
    twitter: 'https://twitter.com/acme',
    linkedin: 'https://linkedin.com/company/acme',
  },
};
```

Use across your site:

```typescript
import { siteConfig } from '@/config/site';

<Footer companyName={siteConfig.name} />
```

### 4. Content Configuration

Organize content by page or section:

```typescript
// src/config/content/home.ts
export const homeContent = {
  hero: {
    heading: {
      en: 'Transform Your Business',
      fr: 'Transformez votre entreprise'
    },
    description: {
      en: 'Professional consulting services that deliver real results',
      fr: 'Services de conseil professionnels qui produisent de vrais résultats'
    },
    cta: {
      text: { en: 'Get Started', fr: 'Commencer' },
      href: '/contact'
    }
  },
  features: {
    heading: { en: 'Why Choose Us', fr: 'Pourquoi nous choisir' },
    items: [
      {
        title: { en: 'Expert Team', fr: 'Équipe experte' },
        description: { en: '15+ years experience', fr: '15+ ans d\'expérience' },
        icon: 'users'
      },
      // ...
    ]
  }
};

// src/app/[locale]/page.tsx
import { homeContent } from '@/config/content/home';

export default function HomePage({ params: { locale } }) {
  return (
    <>
      <HeroSection {...homeContent.hero} locale={locale} />
      <FeaturesGrid {...homeContent.features} locale={locale} />
    </>
  );
}
```

### 5. Component-Level Configuration

Fine-tune individual component instances:

```typescript
<HeroSection
  heading="Welcome"
  description="..."
  variant="split"           // Structural variant
  maxWidth="xl"             // Width constraint
  className="bg-blue-900"   // Custom styling
/>
```

## Configuration Patterns

### Pattern 1: Centralized Content

Best for: Sites with clear content ownership, CMS-like workflows

```typescript
// src/config/content/index.ts
export const content = {
  pages: {
    home: {
      hero: { heading: '...', description: '...' },
      features: { ... },
    },
    about: {
      hero: { heading: '...', description: '...' },
      story: { ... },
    },
  },
  common: {
    navigation: [ ... ],
    footer: { ... },
  }
};

// Use throughout app
import { content } from '@/config/content';
```

**Pros:**
- Single source of truth
- Easy to audit all content
- Simple to sync with CMS
- Content reviewers can focus on one file

**Cons:**
- Large file can be unwieldy
- May need to import entire config even for small pieces

### Pattern 2: Colocated Content

Best for: Developer-driven sites, component-focused workflows

```typescript
// src/app/about/content.ts
export const aboutContent = {
  hero: { heading: '...', description: '...' },
  story: { ... },
};

// src/app/about/page.tsx
import { aboutContent } from './content';

export default function AboutPage() {
  return <AboutSection {...aboutContent} />;
}
```

**Pros:**
- Content lives near where it's used
- Easier to find and update
- Smaller imports
- Better code splitting

**Cons:**
- Harder to get full content overview
- Potential for inconsistent patterns

### Pattern 3: Hybrid Approach

Best for: Medium to large sites

```typescript
// Global/shared content
// src/config/common.ts
export const commonContent = {
  navigation: [ ... ],
  footer: { ... },
};

// Page-specific content colocated
// src/app/services/content.ts
export const servicesContent = { ... };

// Use both
import { commonContent } from '@/config/common';
import { servicesContent } from './content';
```

### Pattern 4: Type-Safe Variants

Create reusable content templates:

```typescript
// src/config/cta-variants.ts
import type { CTASectionProps } from '@zoyth/simple-site-framework';

export const ctaVariants = {
  trial: {
    heading: { en: 'Start Your Free Trial', fr: 'Commencez votre essai gratuit' },
    description: { en: 'No credit card required', fr: 'Aucune carte de crédit requise' },
    primaryCTA: {
      text: { en: 'Start Free Trial', fr: 'Essai gratuit' },
      href: '/signup'
    }
  } satisfies Omit<CTASectionProps, 'locale'>,

  demo: {
    heading: { en: 'See It In Action', fr: 'Voyez-le en action' },
    primaryCTA: {
      text: { en: 'Schedule Demo', fr: 'Planifier une démo' },
      href: '/demo'
    }
  } satisfies Omit<CTASectionProps, 'locale'>,
};

// Use anywhere
<CTASection {...ctaVariants.trial} locale={locale} />
```

## Best Practices

### 1. Use TypeScript

Always type your configurations:

```typescript
import type { LocalizedString, NavigationItem } from '@zoyth/simple-site-framework';

interface SiteConfig {
  name: string;
  description: LocalizedString;
  navigation: NavigationItem[];
}

export const siteConfig: SiteConfig = {
  // TypeScript ensures correctness
};
```

### 2. Separate Content from Structure

```typescript
// ✅ Good - content separate from structure
const heroContent = {
  heading: 'Welcome',
  description: '...',
};

<HeroSection {...heroContent} variant="centered" />

// ❌ Bad - mixed concerns
<HeroSection heading="Welcome" description="..." variant="centered" />
```

### 3. Use Constants for Repeated Values

```typescript
// src/config/constants.ts
export const COMPANY_NAME = 'Acme Corp';
export const SUPPORT_EMAIL = 'support@acme.com';
export const TRIAL_DAYS = 14;

// Use throughout config
export const ctaText = {
  en: `Start Your ${TRIAL_DAYS}-Day Trial`,
  fr: `Commencez votre essai de ${TRIAL_DAYS} jours`
};
```

### 4. Environment-Specific Configuration

```typescript
// src/config/site.ts
const isDevelopment = process.env.NODE_ENV === 'development';

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiEndpoint: isDevelopment
    ? 'http://localhost:3001'
    : 'https://api.acme.com',
};
```

### 5. Document Your Configuration Schema

```typescript
/**
 * Site-wide configuration
 *
 * @property name - Company/site name (used in header, footer, metadata)
 * @property description - Site description for SEO
 * @property url - Canonical URL (without trailing slash)
 * @property contact - Contact information
 */
export interface SiteConfig {
  name: string;
  description: LocalizedString;
  url: string;
  contact: {
    email: string;
    phone?: string;
  };
}
```

## Configuration Validation

### Runtime Validation with Zod

For user-provided or CMS-sourced configuration:

```typescript
import { z } from 'zod';

const siteConfigSchema = z.object({
  name: z.string().min(1),
  description: z.record(z.string(), z.string()),
  url: z.string().url(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
  }),
});

// Validate configuration
export const siteConfig = siteConfigSchema.parse({
  // ... your config
});
```

### Build-Time Validation

Use TypeScript's type system:

```typescript
// Ensure all required locales are present
type RequireLocales<T> = {
  [K in 'en' | 'fr']: T;
};

const heading: RequireLocales<string> = {
  en: 'Welcome',
  fr: 'Bienvenue',
  // TypeScript error if missing either locale
};
```

## Integration with CMS

### Pattern: CMS as Content Source

```typescript
// src/lib/cms.ts
export async function getPageContent(slug: string, locale: string) {
  const response = await fetch(`https://cms.acme.com/api/pages/${slug}?locale=${locale}`);
  return response.json();
}

// src/app/[locale]/[slug]/page.tsx
export default async function DynamicPage({ params }) {
  const content = await getPageContent(params.slug, params.locale);

  return (
    <>
      <HeroSection
        heading={content.hero.heading}
        description={content.hero.description}
        locale={params.locale}
      />
      {/* ... other sections */}
    </>
  );
}
```

### Pattern: CMS with Type Safety

```typescript
import type { HeroSectionProps } from '@zoyth/simple-site-framework';

interface CMSHeroContent {
  heading: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

function transformCMSContent(cms: CMSHeroContent, locale: string): HeroSectionProps {
  return {
    heading: cms.heading,
    description: cms.description,
    cta: {
      text: cms.ctaText,
      href: cms.ctaUrl,
    },
    locale,
  };
}
```

## Common Pitfalls

### ❌ Hardcoding Content in Components

```typescript
// Bad - content in component files
export default function HomePage() {
  return <HeroSection heading="Welcome to Acme" description="We help businesses grow" />;
}
```

**Why it's bad:**
- Content changes require code changes
- No separation of concerns
- Harder to internationalize
- Can't sync with CMS

### ✅ Using Configuration

```typescript
// Good - content in config
import { homeContent } from '@/config/content/home';

export default function HomePage() {
  return <HeroSection {...homeContent.hero} />;
}
```

### ❌ Mixing Configuration Patterns

```typescript
// Bad - inconsistent configuration sources
<HeroSection
  heading={siteConfig.homeHeading}           // From site config
  description={content.pages.home.description}  // From content config
  cta={heroCtaConfig.primary}                // From CTA config
/>
```

**Why it's bad:**
- Hard to track where content comes from
- Difficult to maintain
- No clear pattern for other developers

### ✅ Consistent Pattern

```typescript
// Good - single content source per section
import { homeContent } from '@/config/content/home';

<HeroSection {...homeContent.hero} />
```

## Next Steps

- **[Internationalization](./internationalization.md)** - Multi-language configuration
- **[Theme System](./theme-system.md)** - Visual configuration
- **[Components Overview](../components/overview.md)** - Available components to configure
- **[Examples](../examples/landing-page-simple.md)** - See configuration patterns in action
