# Core Concepts

Understanding these core concepts will help you work effectively with Simple Site Framework.

## The Framework Philosophy

Simple Site Framework is built on three foundational principles:

### 1. Configuration Over Code

Instead of writing component markup repeatedly, you define your site in configuration files. The framework handles rendering, responsive design, accessibility, and performance automatically.

**Traditional Approach:**
```typescript
// Repeated across every page
<section className="py-20 px-4">
  <div className="max-w-6xl mx-auto">
    <h1 className="text-4xl font-bold text-center mb-4">
      Welcome to Our Site
    </h1>
    <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
      We help businesses grow
    </p>
    <div className="flex justify-center gap-4 mt-8">
      <a href="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
        Get Started
      </a>
    </div>
  </div>
</section>
```

**Framework Approach:**
```typescript
<HeroSection
  heading="Welcome to Our Site"
  description="We help businesses grow"
  cta={{ text: 'Get Started', href: '/contact' }}
  variant="centered"
/>
```

The framework ensures consistency, accessibility, and responsive design automatically.

### 2. Type Safety First

Every configuration option, prop, and utility function is fully typed with TypeScript. This catches errors at build time, provides autocomplete in your editor, and serves as inline documentation.

```typescript
import type { HeroSectionProps, LocalizedString, ThemeConfig } from '@zoyth/simple-site-framework';

// TypeScript knows exactly what's expected
const heading: LocalizedString = {
  en: 'Welcome',
  fr: 'Bienvenue'
};

// Autocomplete shows all available variants
<HeroSection variant="centered" | "split" | "minimal" />
```

### 3. Progressive Enhancement

Start simple and add complexity only when needed:

1. **Basic:** Use pre-built sections with minimal props
2. **Customized:** Add your content and theme
3. **Enhanced:** Override specific props or add custom styling
4. **Advanced:** Create custom variants while keeping framework benefits

You're never locked in - every component accepts `className` for escape hatches.

## Key Architectural Decisions

### Server Components by Default

The framework leverages Next.js Server Components for optimal performance:

- **Most components** are server-rendered by default (HeroSection, AboutSection, etc.)
- **Client-only components** are explicitly marked and exported from `/client`
- **No unnecessary JavaScript** - only interactive components ship client code

```typescript
// Server component (default export)
import { HeroSection } from '@zoyth/simple-site-framework';

// Client component (explicit /client export)
import { AnalyticsTracker } from '@zoyth/simple-site-framework/client';
```

See **[Server/Client Split](./server-client-split.md)** for details.

### Composition Over Inheritance

Components are designed to compose together naturally:

```typescript
<main>
  <HeroSection {...heroProps} />
  <FeaturesGrid {...featuresProps} />
  <TestimonialSection {...testimonialProps} />
  <CTASection {...ctaProps} />
</main>
```

Each section is self-contained but works seamlessly with others.

### Minimal Dependencies

The framework has intentionally minimal dependencies:

- **Required:** `clsx`, `tailwind-merge` (tiny utilities)
- **Peer dependencies:** Next.js, React, Tailwind (you install what you need)
- **Optional:** `framer-motion`, `react-hook-form`, `zod` (only if you use those features)

This keeps your bundle small and gives you control over what's included.

## How Components Work

### Section Components

Large, complete page sections ready to use:

```typescript
<HeroSection />      // Hero banner with heading, description, CTA
<AboutSection />     // Company story, team, stats
<ServicesSection />  // Service offerings grid
<ContactSection />   // Contact form with location info
<CTASection />       // Conversion-focused call-to-action
```

These handle:
- Responsive layout
- Accessibility (ARIA, keyboard nav, focus management)
- Internationalization
- Theme integration
- Performance (lazy loading where appropriate)

### Layout Components

Persistent elements that appear across pages:

```typescript
<Header />    // Site navigation with logo, menu, CTA
<Footer />    // Site footer with links, social, legal
```

### UI Components

Building blocks for custom layouts:

```typescript
<Button />    // Themeable button with variants
<Card />      // Container with shadow and border
<Input />     // Form input with validation support
<Modal />     // Accessible dialog
```

### Form Components

Production-ready forms with validation:

```typescript
<ContactForm />  // Complete contact form with React Hook Form + Zod
<FormField />    // Individual field with label, error, help text
```

### Conversion Components

Specialized components for improving conversion rates:

```typescript
<MobileCTA />    // Sticky mobile CTA that appears on scroll
<CTASection />   // Full-width conversion section
<LiveProof />    // Social proof notification system
```

## Content Management

### LocalizedString Type

All user-facing text uses the `LocalizedString` type:

```typescript
type LocalizedString = {
  [locale: string]: string;
};

// Single language
const heading = "Welcome";

// Multi-language
const heading: LocalizedString = {
  en: "Welcome",
  fr: "Bienvenue",
  es: "Bienvenido"
};
```

Components automatically display the correct language based on the `locale` prop.

### Configuration Files

Organize content and settings in dedicated config files:

```typescript
// src/config/site.ts
export const siteConfig = {
  name: 'Your Company',
  description: 'Professional services',
  url: 'https://yourcompany.com',
};

// src/config/theme.ts
export const themeConfig = {
  colors: {
    primary: '#F16531',
    secondary: '#2D3748',
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Inter',
  },
};

// src/config/navigation.ts
export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
];
```

This separates content from code and makes updates easier.

## Styling System

### Tailwind CSS Integration

The framework is built on Tailwind CSS:

- **Utility-first** - Use Tailwind classes directly
- **Theme tokens** - Define once in `tailwind.config.ts`, use everywhere
- **Custom classes** - Every component accepts `className` prop

```typescript
<HeroSection
  heading="Welcome"
  className="bg-gradient-to-r from-blue-600 to-purple-600"
/>
```

### Theme Tokens

Components use semantic theme tokens:

```typescript
// In tailwind.config.ts
colors: {
  primary: '#F16531',
  'primary-hover': '#D9551C',
}

// Components automatically use these
<Button variant="filled" /> // Uses bg-primary
```

See **[Theme System](./theme-system.md)** for complete customization.

## Performance Strategy

### Code Splitting

The framework uses smart code splitting:

- **Heavy dependencies** (framer-motion) are loaded only when used
- **Client components** are separated from server components
- **Dynamic imports** for optional features

### Lazy Loading

Sections below the fold can be lazy-loaded:

```typescript
<LazySection>
  <TestimonialSection {...props} />
</LazySection>
```

### Optimized Assets

Framework components work with Next.js optimizations:

```typescript
import Image from 'next/image';

<HeroSection
  backgroundImage="/hero.jpg" // Automatically optimized by Next.js
/>
```

## Error Handling

### Type Safety

TypeScript catches most errors at build time:

```typescript
// ❌ TypeScript error - missing required prop
<HeroSection description="..." />

// ✅ Correct
<HeroSection heading="..." description="..." />
```

### Runtime Validation

Components validate props at runtime in development:

```typescript
// Warns in development if locale is missing
<HeroSection
  heading={{ en: 'Welcome', fr: 'Bienvenue' }}
  locale={undefined} // ⚠️ Warning in dev console
/>
```

### Graceful Degradation

Components handle missing data gracefully:

```typescript
// If testimonials array is empty, section doesn't render
<TestimonialSection testimonials={[]} />
```

## Next Steps

Dive deeper into specific concepts:

- **[Configuration-Driven Design](./configuration-driven.md)** - Learn the config approach
- **[Internationalization](./internationalization.md)** - Multi-language support
- **[Server/Client Split](./server-client-split.md)** - Understanding the architecture
- **[Theme System](./theme-system.md)** - Customize appearance
- **[Performance](./performance.md)** - Optimization strategies

Or jump to practical guides:

- **[Components Overview](../components/overview.md)** - Explore all components
- **[Building a Landing Page](../guides/landing-page.md)** - Complete tutorial
- **[SEO Optimization](../guides/seo-optimization.md)** - Ranking and discoverability
