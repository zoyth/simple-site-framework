# CTASection

Full-width call-to-action section with dual-button layout. Battle-tested on courrielleur.com across 5+ pages for consistent conversion messaging.

## Import

```typescript
import { CTASection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component (default export)

## Basic Usage

```typescript
<CTASection
  heading="Ready to Get Started?"
  description="Join thousands of satisfied customers"
  primaryCTA={{
    text: 'Start Free Trial',
    href: '/signup'
  }}
  locale="en"
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `heading` | `string \| LocalizedString` | Main CTA heading |
| `primaryCTA` | `CTAConfig` | Primary call-to-action button |
| `locale` | `string` | Current locale |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `description` | `string \| LocalizedString` | - | Supporting description text |
| `secondaryCTA` | `CTAConfig` | - | Secondary call-to-action button |
| `variant` | `'centered' \| 'split' \| 'inline'` | `'centered'` | Layout variant |
| `buttonLayout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Button arrangement |
| `backgroundColor` | `string` | `'bg-warm-gray'` | Background color class |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Text alignment |
| `maxWidth` | `MaxWidth` | `'2xl'` | Maximum content width |
| `className` | `string` | - | Custom CSS classes |

### Type Definitions

```typescript
interface CTAConfig {
  text: string | LocalizedString;
  href: string;
  onClick?: () => void;
}

type LocalizedString = {
  [locale: string]: string;
};
```

## Variants

### Centered (Default)

Traditional centered layout with buttons below text:

```typescript
<CTASection
  heading="Transform Your Business Today"
  description="Join 10,000+ companies using our platform"
  primaryCTA={{
    text: 'Start Free Trial',
    href: '/signup'
  }}
  secondaryCTA={{
    text: 'Schedule Demo',
    href: '/demo'
  }}
  variant="centered"
  locale="en"
/>
```

**Best for:** End-of-page CTAs, conversion-focused sections

### Split

Content on left, buttons on right:

```typescript
<CTASection
  heading="Ready to Scale?"
  description="Take your business to the next level"
  primaryCTA={{
    text: 'Get Started',
    href: '/signup'
  }}
  variant="split"
  locale="en"
/>
```

**Best for:** Mid-page CTAs, feature sections

### Inline

Horizontal layout with inline buttons:

```typescript
<CTASection
  heading="Limited Time Offer"
  description="Save 50% on annual plans"
  primaryCTA={{
    text: 'Claim Offer',
    href: '/pricing'
  }}
  variant="inline"
  locale="en"
/>
```

**Best for:** Promotions, urgent CTAs, banners

## Examples

### Simple CTA

```typescript
<CTASection
  heading="Start Your Journey"
  primaryCTA={{
    text: 'Sign Up Free',
    href: '/signup'
  }}
  locale="en"
/>
```

### With Description

```typescript
<CTASection
  heading="Experience the Difference"
  description="No credit card required • Cancel anytime • 14-day free trial"
  primaryCTA={{
    text: 'Try Free for 14 Days',
    href: '/signup'
  }}
  locale="en"
/>
```

### Two Buttons

```typescript
<CTASection
  heading="Choose Your Path"
  description="Get started with the plan that's right for you"
  primaryCTA={{
    text: 'Start Free Trial',
    href: '/signup'
  }}
  secondaryCTA={{
    text: 'Compare Plans',
    href: '/pricing'
  }}
  locale="en"
/>
```

### Vertical Button Layout

```typescript
<CTASection
  heading="Join Our Community"
  description="Connect with professionals worldwide"
  primaryCTA={{
    text: 'Create Free Account',
    href: '/signup'
  }}
  secondaryCTA={{
    text: 'Learn More',
    href: '/about'
  }}
  buttonLayout="vertical"
  locale="en"
/>
```

### Multi-Language

```typescript
<CTASection
  heading={{
    en: 'Ready to Get Started?',
    fr: 'Prêt à commencer?',
    es: '¿Listo para comenzar?'
  }}
  description={{
    en: 'Join thousands of satisfied customers',
    fr: 'Rejoignez des milliers de clients satisfaits',
    es: 'Únase a miles de clientes satisfechos'
  }}
  primaryCTA={{
    text: {
      en: 'Start Free Trial',
      fr: 'Commencer l\'essai gratuit',
      es: 'Comenzar prueba gratuita'
    },
    href: '/signup'
  }}
  secondaryCTA={{
    text: {
      en: 'View Pricing',
      fr: 'Voir les tarifs',
      es: 'Ver precios'
    },
    href: '/pricing'
  }}
  locale={locale}
/>
```

### Custom Background

```typescript
<CTASection
  heading="Special Offer"
  description="Limited time only"
  primaryCTA={{
    text: 'Claim Now',
    href: '/offer'
  }}
  backgroundColor="bg-gradient-to-r from-orange-500 to-red-600"
  locale="en"
/>
```

### Left-Aligned

```typescript
<CTASection
  heading="Ready to Scale?"
  description="Take your business to the next level"
  primaryCTA={{
    text: 'Get Started',
    href: '/signup'
  }}
  align="left"
  locale="en"
/>
```

### With Analytics

```typescript
<CTASection
  heading="Start Your Trial"
  primaryCTA={{
    text: 'Sign Up Free',
    href: '/signup',
    onClick: () => {
      trackEvent('cta_section_click', {
        location: 'pricing_page',
        cta_text: 'Sign Up Free'
      });
    }
  }}
  locale="en"
/>
```

## Styling

### Custom Colors

```typescript
<CTASection
  heading="Limited Offer"
  primaryCTA={{ text: 'Claim Now', href: '/offer' }}
  className="bg-purple-900 text-white"
  locale="en"
/>
```

### Custom Spacing

```typescript
<CTASection
  heading="Join Us"
  primaryCTA={{ text: 'Sign Up', href: '/signup' }}
  className="py-32"  // Extra padding
  locale="en"
/>
```

### Custom Button Styling

```typescript
<CTASection
  heading="Get Started"
  primaryCTA={{ text: 'Start Now', href: '/signup' }}
  className="[&_a]:bg-gradient-to-r [&_a]:from-blue-500 [&_a]:to-indigo-600"
  locale="en"
/>
```

## Common Patterns

### End of Homepage

```typescript
<CTASection
  heading="Ready to Transform Your Business?"
  description="Join 10,000+ companies already using our platform"
  primaryCTA={{
    text: 'Start Free Trial',
    href: '/signup'
  }}
  secondaryCTA={{
    text: 'Schedule a Demo',
    href: '/demo'
  }}
  backgroundColor="bg-gradient-to-br from-blue-50 to-indigo-100"
  locale="en"
/>
```

### Pricing Page CTA

```typescript
<CTASection
  heading="Still Have Questions?"
  description="Our team is here to help you choose the right plan"
  primaryCTA={{
    text: 'Talk to Sales',
    href: '/contact'
  }}
  secondaryCTA={{
    text: 'View FAQ',
    href: '/faq'
  }}
  locale="en"
/>
```

### Blog Post CTA

```typescript
<CTASection
  heading="Want More Insights?"
  description="Subscribe to our newsletter for weekly tips"
  primaryCTA={{
    text: 'Subscribe Now',
    href: '/newsletter'
  }}
  variant="inline"
  backgroundColor="bg-gray-100"
  locale="en"
/>
```

### Service Page CTA

```typescript
<CTASection
  heading="Let's Discuss Your Project"
  description="Get a free consultation and project estimate"
  primaryCTA={{
    text: 'Request Quote',
    href: '/quote'
  }}
  secondaryCTA={{
    text: 'View Portfolio',
    href: '/portfolio'
  }}
  variant="split"
  locale="en"
/>
```

### Promotion CTA

```typescript
<CTASection
  heading="Black Friday Sale - 50% Off!"
  description="Limited time offer • Ends in 48 hours"
  primaryCTA={{
    text: 'Claim Discount',
    href: '/pricing?promo=blackfriday'
  }}
  backgroundColor="bg-black text-white"
  locale="en"
/>
```

## Production Evidence

### Courrielleur.com Results

**Usage:** 5+ pages (homepage, pricing, features, about, contact)

**Patterns:**
- Homepage: Trial signup + demo
- Pricing: Contact sales + FAQ
- Features: Trial signup + learn more
- About: Contact + careers
- Blog: Newsletter + trial

**Benefits:**
- Consistent messaging across site
- Easy to A/B test CTA copy
- Single source of truth for conversion points

## Analytics Integration

### Track CTA Clicks

```typescript
<CTASection
  heading="Get Started"
  primaryCTA={{
    text: 'Sign Up',
    href: '/signup',
    onClick: () => {
      trackEvent('primary_cta_click', {
        section: 'cta_section',
        page: window.location.pathname,
        cta_text: 'Sign Up'
      });
    }
  }}
  secondaryCTA={{
    text: 'Learn More',
    href: '/about',
    onClick: () => {
      trackEvent('secondary_cta_click', {
        section: 'cta_section',
        page: window.location.pathname,
        cta_text: 'Learn More'
      });
    }
  }}
  locale="en"
/>
```

### Track Impressions

```typescript
'use client';

import { CTASection } from '@zoyth/simple-site-framework';
import { useEffect } from 'react';

export function TrackedCTASection(props) {
  useEffect(() => {
    trackEvent('cta_section_view', {
      page: window.location.pathname,
      heading: props.heading
    });
  }, []);

  return <CTASection {...props} />;
}
```

## Accessibility

CTASection includes:

- ✅ Semantic HTML (`<section>`, `<a>` links)
- ✅ Proper heading hierarchy
- ✅ Keyboard accessible links
- ✅ Focus visible states
- ✅ Sufficient color contrast (when using default theme)
- ✅ Screen reader friendly
- ✅ No onClick-only buttons (uses real links)

## SEO

- Uses semantic `<section>` tag
- Proper heading hierarchy
- Real `<a>` links (not JavaScript navigation)
- Descriptive link text

## Best Practices

### ✅ Do

- Use action-oriented text ("Start Free Trial" not "Submit")
- Keep heading concise (under 60 characters)
- Make primary CTA stand out visually
- Place at natural break points (end of page, after features)
- Use consistent CTA messaging site-wide
- Track clicks to measure effectiveness

### ❌ Don't

- Use vague text ("Click Here", "Learn More" alone)
- Have competing CTAs of equal prominence
- Overuse throughout the page (1-2 max per page)
- Make both buttons look identical
- Forget to test different copy variations
- Hide secondary CTA if it provides value

## A/B Testing

### Test CTA Copy

```typescript
import { getABTestVariant } from '@zoyth/simple-site-framework/client';

const variant = getABTestVariant({
  testId: 'cta_copy_test',
  variants: { A: { weight: 50 }, B: { weight: 50 } }
});

const ctaText = variant === 'A'
  ? 'Start Free Trial'
  : 'Try Free for 14 Days';

<CTASection
  heading="Ready to Get Started?"
  primaryCTA={{
    text: ctaText,
    href: '/signup',
    onClick: () => {
      trackABTestEvent('cta_copy_test', variant, 'click');
    }
  }}
  locale="en"
/>
```

### Test Button Layout

```typescript
const variant = getABTestVariant({
  testId: 'button_layout_test',
  variants: { A: { weight: 50 }, B: { weight: 50 } }
});

<CTASection
  heading="Get Started"
  primaryCTA={{ text: 'Sign Up', href: '/signup' }}
  secondaryCTA={{ text: 'Learn More', href: '/about' }}
  buttonLayout={variant === 'A' ? 'horizontal' : 'vertical'}
  locale="en"
/>
```

## Troubleshooting

### Buttons not clickable

**Check:**
1. `href` is provided in CTA config
2. No z-index conflicts
3. No overlay blocking clicks
4. CSS not setting `pointer-events: none`

### Wrong text displaying in multi-language

**Check:**
1. `locale` prop is provided
2. LocalizedString has entry for that locale
3. Fallback locale exists

### Buttons not styled correctly

**Check:**
1. Tailwind config includes framework in `content` array
2. Theme colors are defined
3. No CSS overriding default styles

### Analytics not firing

**Check:**
1. `onClick` handler is provided
2. Handler is actually being called (add console.log)
3. Analytics library is loaded
4. dataLayer exists

## Related Components

- **[HeroSection](./HeroSection.md)** - Page header with CTA
- **[MobileCTA](../conversion/MobileCTA.md)** - Mobile-only sticky CTA
- **[Button](../ui/Button.md)** - Base button component

## API Reference

Full TypeScript definitions: **[API Reference](../../api/components.md#ctasection)**
