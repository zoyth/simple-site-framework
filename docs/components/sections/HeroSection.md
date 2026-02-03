# HeroSection

The most commonly used component - creates an above-the-fold hero banner with heading, description, CTA buttons, and optional background image.

## Import

```typescript
import { HeroSection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component (default export)

## Basic Usage

```typescript
<HeroSection
  heading="Transform Your Business"
  description="Professional consulting services that deliver real results"
  cta={{
    text: 'Get Started',
    href: '/contact'
  }}
  variant="centered"
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `heading` | `string \| LocalizedString` | Main heading text |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `description` | `string \| LocalizedString` | - | Subheading/description text |
| `cta` | `CTAConfig` | - | Primary call-to-action button |
| `secondaryCTA` | `CTAConfig` | - | Secondary CTA button |
| `variant` | `'centered' \| 'split' \| 'minimal'` | `'centered'` | Layout variant |
| `backgroundImage` | `string` | - | Background image URL |
| `backgroundVideo` | `string` | - | Background video URL (mp4) |
| `overlay` | `boolean` | `true` | Show dark overlay over background |
| `overlayOpacity` | `number` | `0.5` | Overlay opacity (0-1) |
| `height` | `'auto' \| 'screen' \| 'tall'` | `'auto'` | Section height |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Text alignment |
| `maxWidth` | `MaxWidth` | `'2xl'` | Maximum content width |
| `className` | `string` | - | Custom CSS classes |
| `locale` | `string` | - | Current locale (for LocalizedString) |

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

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
```

## Variants

### Centered (Default)

Content centered with buttons below:

```typescript
<HeroSection
  heading="Welcome to Our Platform"
  description="The complete solution for modern businesses"
  cta={{ text: 'Start Free Trial', href: '/signup' }}
  variant="centered"
/>
```

**Best for:** Traditional hero sections, product launches

### Split

Image on one side, content on the other:

```typescript
<HeroSection
  heading="Meet Your Team"
  description="Expert professionals ready to help"
  cta={{ text: 'Learn More', href: '/about' }}
  variant="split"
  backgroundImage="/team-photo.jpg"
/>
```

**Best for:** About pages, team introductions, feature highlights

### Minimal

Simplified layout with less spacing:

```typescript
<HeroSection
  heading="Contact Us"
  description="We'd love to hear from you"
  variant="minimal"
/>
```

**Best for:** Internal pages, simple headers

## Examples

### Simple Hero

```typescript
<HeroSection
  heading="Welcome"
  description="Start your journey today"
  cta={{ text: 'Get Started', href: '/signup' }}
/>
```

### Hero with Two CTAs

```typescript
<HeroSection
  heading="Build Faster"
  description="Ship production-ready sites in hours, not weeks"
  cta={{
    text: 'Start Free Trial',
    href: '/signup'
  }}
  secondaryCTA={{
    text: 'View Demo',
    href: '/demo'
  }}
/>
```

### Hero with Background Image

```typescript
<HeroSection
  heading="Discover Paradise"
  description="Luxury travel experiences around the world"
  cta={{ text: 'Explore Destinations', href: '/destinations' }}
  backgroundImage="/paradise.jpg"
  overlay={true}
  overlayOpacity={0.6}
  height="screen"
/>
```

### Hero with Background Video

```typescript
<HeroSection
  heading="Innovation in Motion"
  description="See our technology in action"
  cta={{ text: 'Learn More', href: '/technology' }}
  backgroundVideo="/hero-video.mp4"
  overlay={true}
/>
```

### Multi-Language Hero

```typescript
<HeroSection
  heading={{
    en: 'Transform Your Business',
    fr: 'Transformez votre entreprise',
    es: 'Transforme tu negocio'
  }}
  description={{
    en: 'Professional consulting services',
    fr: 'Services de conseil professionnels',
    es: 'Servicios de consultoría profesional'
  }}
  cta={{
    text: {
      en: 'Get Started',
      fr: 'Commencer',
      es: 'Empezar'
    },
    href: '/contact'
  }}
  locale={locale}
/>
```

### Left-Aligned Hero

```typescript
<HeroSection
  heading="Our Mission"
  description="Building the future of sustainable technology"
  cta={{ text: 'Read More', href: '/mission' }}
  align="left"
/>
```

### Full-Screen Hero

```typescript
<HeroSection
  heading="Welcome to the Future"
  description="Experience innovation like never before"
  cta={{ text: 'Explore', href: '/features' }}
  height="screen"
  backgroundImage="/future.jpg"
/>
```

### Hero with Analytics

```typescript
<HeroSection
  heading="Start Your Trial"
  description="No credit card required"
  cta={{
    text: 'Sign Up Free',
    href: '/signup',
    onClick: () => trackEvent('hero_cta_click', { location: 'homepage' })
  }}
/>
```

## Styling

### Custom Background

```typescript
<HeroSection
  heading="Custom Styling"
  className="bg-gradient-to-r from-purple-600 to-blue-600"
/>
```

### Custom Spacing

```typescript
<HeroSection
  heading="Compact Hero"
  className="py-12" // Override default py-20
/>
```

### Custom Typography

```typescript
<HeroSection
  heading="Large Heading"
  className="[&_h1]:text-7xl [&_p]:text-2xl"
/>
```

## Accessibility

HeroSection includes:

- ✅ Semantic HTML (`<section>`, `<h1>`, `<p>`)
- ✅ Proper heading hierarchy
- ✅ Focus management for CTAs
- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ ARIA landmarks
- ✅ Sufficient color contrast (when using default theme)

## Performance

- **Server-rendered by default** - No client JavaScript unless CTAs have `onClick`
- **Optimized images** - Automatically uses Next.js `<Image>` if you provide backgroundImage
- **No layout shift** - Proper aspect ratios and dimensions
- **Lazy background video** - Videos load only when above the fold

## SEO

- Uses proper `<h1>` tag for heading (should be one per page)
- Content is server-rendered for crawlers
- Structured content helps with featured snippets

**Tip:** Use unique, keyword-rich headings for each page's HeroSection.

## Common Patterns

### Homepage Hero

```typescript
<HeroSection
  heading="Transform Your Business"
  description="Professional services that deliver results"
  cta={{ text: 'Get Started', href: '/contact' }}
  secondaryCTA={{ text: 'Learn More', href: '/about' }}
  backgroundImage="/homepage-hero.jpg"
  height="screen"
/>
```

### Service Page Hero

```typescript
<HeroSection
  heading="Web Development Services"
  description="Custom websites built for your business"
  cta={{ text: 'Request Quote', href: '/quote' }}
  variant="minimal"
/>
```

### About Page Hero

```typescript
<HeroSection
  heading="About Our Company"
  description="Building the future since 2010"
  variant="split"
  backgroundImage="/team.jpg"
/>
```

## Integration with Other Components

### With Breadcrumb

```typescript
import { Breadcrumb, HeroSection } from '@zoyth/simple-site-framework';

<>
  <Breadcrumb
    items={[
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Web Development' }
    ]}
  />
  <HeroSection heading="Web Development" variant="minimal" />
</>
```

### With Analytics

```typescript
import { HeroSection } from '@zoyth/simple-site-framework';
import { trackHeroView } from '@/lib/analytics';

export default function Page() {
  useEffect(() => {
    trackHeroView('homepage');
  }, []);

  return <HeroSection {...heroProps} />;
}
```

## Troubleshooting

### Background image not showing

**Check:**
1. Image path is correct (relative to `public/` folder)
2. Image file exists
3. Image is not blocked by content security policy

### CTA buttons not working

**Check:**
1. `href` is provided in CTA config
2. Link is not disabled by parent component
3. No z-index conflicts with overlay

### Text hard to read over background

**Solution:**
- Increase `overlayOpacity`: `overlayOpacity={0.7}`
- Use darker background image
- Add custom text shadow: `className="[&_h1]:drop-shadow-lg"`

### TypeScript errors with LocalizedString

**Solution:**
```typescript
import type { LocalizedString } from '@zoyth/simple-site-framework';

const heading: LocalizedString = {
  en: 'Welcome',
  fr: 'Bienvenue'
};
```

## Related Components

- **[CTASection](./CTASection.md)** - Mid-page or end-page CTA
- **[AboutSection](./AboutSection.md)** - Company information
- **[Breadcrumb](../ui/Breadcrumb.md)** - Navigation breadcrumb

## API Reference

Full TypeScript definitions: **[API Reference](../../api/components.md#herosection)**
