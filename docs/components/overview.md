# Components Overview

Simple Site Framework provides 35+ production-ready components organized into logical categories.

## Component Categories

### Layout Components

Persistent elements that structure your site:

- **[Header](./layout/Header.md)** - Navigation bar with logo, menu, and CTA
- **[Footer](./layout/Footer.md)** - Site footer with links, social media, legal
- **[LanguageSelector](./layout/LanguageSelector.md)** - Language switcher (dropdown or toggle)

### Section Components

Complete, full-width page sections:

- **[HeroSection](./sections/HeroSection.md)** - Above-the-fold hero banner
- **[AboutSection](./sections/AboutSection.md)** - Company story, team, statistics
- **[ServicesSection](./sections/ServicesSection.md)** - Service offerings grid
- **[TestimonialSection](./sections/TestimonialSection.md)** - Customer testimonials
- **[ContactSection](./sections/ContactSection.md)** - Contact form with location info
- **[ServicePageLayout](./sections/ServicePageLayout.md)** - Individual service page layout

### UI Components

Building blocks for custom layouts:

- **[Button](./ui/Button.md)** - Themeable button with multiple variants
- **[Card](./ui/Card.md)** - Container with shadow, border, and padding
- **[Input](./ui/Input.md)** - Text input with validation states
- **[Textarea](./ui/Textarea.md)** - Multi-line text input
- **[Breadcrumb](./ui/Breadcrumb.md)** - Navigation breadcrumb trail
- **[Modal](./ui/Modal.md)** - Accessible dialog component
- **[Tabs](./ui/Tabs.md)** - Tabbed content interface
- **[Select](./ui/Select.md)** - Dropdown select input

### Form Components

Production-ready forms with validation:

- **[ContactForm](./forms/ContactForm.md)** - Complete contact form with React Hook Form + Zod
- **[FormField](./forms/FormField.md)** - Individual form field with label, error, help text
- **[Checkbox](./forms/Checkbox.md)** - Checkbox input with label
- **[Radio](./forms/Radio.md)** - Radio button input

### Conversion Components

Specialized components for improving conversion rates:

- **[MobileCTA](./conversion/MobileCTA.md)** - Sticky mobile CTA (scroll-triggered)
- **[CTASection](./conversion/CTASection.md)** - Full-width call-to-action section
- **[LiveProof](./conversion/LiveProof.md)** - Social proof notification system

### Accessibility Components

WCAG 2.1 AA compliant accessibility helpers:

- **[SkipLink](./accessibility/SkipLink.md)** - Skip to main content link
- **[A11yAnnouncer](./accessibility/A11yAnnouncer.md)** - Screen reader announcements
- **[FormFieldARIA](./accessibility/FormFieldARIA.md)** - ARIA-enhanced form field wrapper
- **[CheckboxGroupARIA](./accessibility/CheckboxGroupARIA.md)** - ARIA-enhanced checkbox group
- **[RadioGroupARIA](./accessibility/RadioGroupARIA.md)** - ARIA-enhanced radio group

### Utility Components

Helper components for specific functionality:

- **[AnalyticsTracker](./utilities/AnalyticsTracker.md)** - Page view and scroll tracking
- **[TrackedLink](./utilities/TrackedLink.md)** - Link with analytics tracking
- **[LazySection](./utilities/LazySection.md)** - Lazy-load sections below the fold
- **[CodeBlock](./utilities/CodeBlock.md)** - Syntax-highlighted code display
- **[Icon](./utilities/Icon.md)** - Icon component with built-in icons
- **[FeaturesGrid](./utilities/FeaturesGrid.md)** - Grid of features with icons

## Import Paths

### Server-Safe Components (Default Export)

Most components are server-safe and imported from the main package:

```typescript
import {
  HeroSection,
  AboutSection,
  ServicesSection,
  TestimonialSection,
  ContactSection,
  CTASection,
  Header,
  Footer,
  Button,
  Card,
  Input,
  FormField,
  FeaturesGrid,
} from '@zoyth/simple-site-framework';
```

### Client-Only Components (`/client` Export)

Components using browser APIs or React hooks must be imported from `/client`:

```typescript
import {
  AnalyticsTracker,
  MobileCTA,
  getABTestVariant,
  trackABTestEvent,
} from '@zoyth/simple-site-framework/client';
```

**Why separate?** Next.js Server Components require explicit client boundaries. Separating client-only code prevents accidental server-side usage and keeps your server bundles small.

See **[Server/Client Split](../core-concepts/server-client-split.md)** for details.

## Component Patterns

### All Components Support

#### 1. Custom Styling

Every component accepts a `className` prop for custom styling:

```typescript
<HeroSection
  heading="Welcome"
  className="bg-gradient-to-r from-blue-600 to-purple-600"
/>
```

The framework uses `cn()` utility (clsx + tailwind-merge) to merge classes intelligently.

#### 2. Responsive Design

All components are mobile-first and responsive by default:

```typescript
<FeaturesGrid
  features={features}
  columns={3}  // 3 columns on desktop, auto-adjusts for mobile
/>
```

No additional configuration needed.

#### 3. Type Safety

Full TypeScript support with exported prop types:

```typescript
import type { HeroSectionProps, ButtonProps, CardProps } from '@zoyth/simple-site-framework';

const heroProps: HeroSectionProps = {
  heading: 'Welcome',
  description: '...',
};
```

#### 4. Accessibility

All components are WCAG 2.1 AA compliant:

- Semantic HTML
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support

No additional configuration required.

## Component Variants

Many components support variants for different visual styles:

### Button Variants

```typescript
<Button variant="filled" />    // Solid background
<Button variant="outline" />   // Border only
<Button variant="ghost" />     // Transparent
<Button variant="link" />      // Text link style
```

### Hero Variants

```typescript
<HeroSection variant="centered" />  // Centered text, CTA below
<HeroSection variant="split" />     // Image on left, content on right
<HeroSection variant="minimal" />   // Simplified version
```

### Card Variants

```typescript
<Card variant="default" />   // Standard card
<Card variant="bordered" />  // With border
<Card variant="elevated" />  // With shadow
```

## Composition Patterns

### Pattern 1: Full-Page Sections

Stack sections to build complete pages:

```typescript
export default function HomePage() {
  return (
    <main>
      <HeroSection {...heroProps} />
      <FeaturesGrid {...featuresProps} />
      <TestimonialSection {...testimonialProps} />
      <CTASection {...ctaProps} />
    </main>
  );
}
```

### Pattern 2: Layout Wrapping

Wrap pages with consistent layout:

```typescript
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header {...headerProps} />
        {children}
        <Footer {...footerProps} />
      </body>
    </html>
  );
}
```

### Pattern 3: Conditional Rendering

Show components based on conditions:

```typescript
{user.isPremium && (
  <CTASection
    heading="Upgrade Available"
    primaryCTA={{ text: 'Upgrade Now', href: '/upgrade' }}
  />
)}
```

### Pattern 4: Dynamic Content

Load content from CMS or API:

```typescript
export default async function DynamicPage({ params }) {
  const content = await fetchPageContent(params.slug);

  return (
    <>
      <HeroSection {...content.hero} />
      <AboutSection {...content.about} />
    </>
  );
}
```

## Component Organization

### By Feature

```
src/app/
  features/
    page.tsx           # <FeaturesGrid />
  pricing/
    page.tsx           # <PricingSection />
  about/
    page.tsx           # <AboutSection />
```

### By Content Type

```
src/app/
  services/
    [slug]/
      page.tsx         # <ServicePageLayout />
  blog/
    [slug]/
      page.tsx         # <BlogPost />
```

### Mixed Approach

```
src/app/
  page.tsx             # Homepage with multiple sections
  about/
    page.tsx           # About page with AboutSection
  services/
    page.tsx           # Services listing with ServicesSection
    [slug]/
      page.tsx         # Individual service with ServicePageLayout
```

## Performance Considerations

### Code Splitting

The framework automatically code-splits:

```typescript
// Heavy dependencies only loaded when used
import { LazySection } from '@zoyth/simple-site-framework';

<LazySection>
  <TestimonialSection {...props} />
</LazySection>
```

### Server Components

Most components are server components by default:

```typescript
// Server-rendered, no client JavaScript
<HeroSection heading="Welcome" />

// Only ships client code for interactivity
<ContactForm onSubmit={handleSubmit} />
```

### Lazy Loading

Images and assets are automatically optimized:

```typescript
<HeroSection
  backgroundImage="/hero.jpg"  // Next.js Image optimization applied
/>
```

## Common Props

Many components share common props:

### Locale

For internationalized content:

```typescript
<HeroSection
  heading={{ en: 'Welcome', fr: 'Bienvenue' }}
  locale="fr"  // Displays French content
/>
```

### ClassName

For custom styling:

```typescript
<Button className="my-custom-class" />
```

### MaxWidth

To constrain content width:

```typescript
<HeroSection
  heading="Welcome"
  maxWidth="xl"  // max-w-xl container
/>
```

### Variant

For visual variations:

```typescript
<Card variant="elevated" />
<Button variant="outline" />
```

## Component Status

### Production-Ready ✅

These components are battle-tested in production:

- HeroSection
- ContactSection
- Header
- Footer
- Button
- Card
- Input
- FormField
- ContactForm
- MobileCTA
- CTASection
- LiveProof

### Beta 🧪

Fully functional but less battle-tested:

- ServicePageLayout
- AboutSection
- ServicesSection
- TestimonialSection

### Experimental ⚠️

API may change:

- A/B testing utilities
- Advanced animations
- Form builders

## Next Steps

### Explore Specific Components

- **[HeroSection](./sections/HeroSection.md)** - Most commonly used component
- **[ContactForm](./forms/ContactForm.md)** - Essential for lead generation
- **[Button](./ui/Button.md)** - Fundamental building block
- **[MobileCTA](./conversion/MobileCTA.md)** - Improve mobile conversions

### Learn Concepts

- **[Configuration-Driven](../core-concepts/configuration-driven.md)** - How to configure components
- **[Server/Client Split](../core-concepts/server-client-split.md)** - Understanding imports
- **[Theme System](../core-concepts/theme-system.md)** - Customize appearance

### See Examples

- **[Landing Page Example](../examples/landing-page-simple.md)** - Complete page using multiple components
- **[Multi-Language Site](../examples/multi-language-site.md)** - Internationalization in action
- **[Service Site](../examples/service-site.md)** - Professional services website

## Component Reference

For complete API documentation, see individual component pages or the **[API Reference](../api/components.md)**.
