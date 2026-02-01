# HeroSection Component

Advanced hero section with animations, video backgrounds, parallax effects, sticky CTA, and trust badges.

## Import

```typescript
import { HeroSection } from '@zoyth/simple-site-framework'
import type { HeroSectionProps, HeroAnimations } from '@zoyth/simple-site-framework'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locale` | `'fr' \| 'en'` | **required** | Current language |
| `content` | `HeroContent` | **required** | Hero content configuration |
| `animations` | `HeroAnimations` | - | Animation configuration |
| `stickyCtaAfterScroll` | `boolean` | `false` | Show sticky CTA button after scrolling |
| `trustBadges` | `Badge[]` | - | Trust badges to display |
| `backgroundEffect` | `'none' \| 'particles' \| 'gradient-shift' \| 'mesh'` | `'none'` | Background visual effect |
| `className` | `string` | - | Additional CSS classes |

## HeroContent Type

```typescript
interface HeroContent {
  headline: LocalizedString
  subheadline?: LocalizedString
  cta?: {
    primary?: {
      text: LocalizedString
      href: string
      variant?: ButtonProps['variant']
    }
    secondary?: {
      text: LocalizedString
      href: string
      variant?: ButtonProps['variant']
    }
  }
  backgroundImage?: string
  backgroundVideo?: string
  overlayGradient?: {
    from: string  // CSS color value
    to: string    // CSS color value
  }
}
```

## HeroAnimations Type

```typescript
interface HeroAnimations {
  headline?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'none'
  cta?: 'fadeInUp' | 'fadeIn' | 'none'
  stagger?: number  // Delay between elements in ms
  scrollIndicator?: boolean  // Show animated scroll hint
}
```

## Basic Usage

```tsx
import { HeroSection } from '@zoyth/simple-site-framework'

const heroContent = {
  headline: {
    fr: 'Bienvenue sur notre site',
    en: 'Welcome to our site'
  },
  subheadline: {
    fr: 'Solutions professionnelles pour votre entreprise',
    en: 'Professional solutions for your business'
  },
  cta: {
    primary: {
      text: { fr: 'Commencer', en: 'Get Started' },
      href: '/contact'
    }
  }
}

<HeroSection
  locale="en"
  content={heroContent}
/>
```

## With Animations

```tsx
<HeroSection
  locale="en"
  content={heroContent}
  animations={{
    headline: 'fadeInUp',
    cta: 'fadeInUp',
    stagger: 200,
    scrollIndicator: true
  }}
/>
```

## With Sticky CTA

The sticky CTA appears as a floating button after user scrolls past the hero section.

```tsx
<HeroSection
  locale="en"
  content={heroContent}
  stickyCtaAfterScroll={true}
/>
```

## With Trust Badges

```tsx
import { Badge } from '@zoyth/simple-site-framework'

const trustBadges: Badge[] = [
  {
    name: 'Google Partner',
    image: '/badges/google-partner.png',
    variant: 'color'
  },
  {
    name: 'ISO 9001',
    image: '/badges/iso-9001.png',
    variant: 'grayscale'
  }
]

<HeroSection
  locale="en"
  content={heroContent}
  trustBadges={trustBadges}
/>
```

## With Video Background

```tsx
const heroContent = {
  headline: { fr: 'Innovation', en: 'Innovation' },
  backgroundVideo: '/videos/hero-background.mp4',
  overlayGradient: {
    from: 'rgba(0, 0, 0, 0.6)',
    to: 'rgba(0, 0, 0, 0.3)'
  }
}

<HeroSection
  locale="en"
  content={heroContent}
/>
```

## With Background Effects

```tsx
// Gradient animation
<HeroSection
  locale="en"
  content={heroContent}
  backgroundEffect="gradient-shift"
/>

// Particle effect
<HeroSection
  locale="en"
  content={heroContent}
  backgroundEffect="particles"
/>

// Mesh gradient
<HeroSection
  locale="en"
  content={heroContent}
  backgroundEffect="mesh"
/>
```

## Complete Example

```tsx
import { HeroSection } from '@zoyth/simple-site-framework'

const heroContent = {
  headline: {
    fr: 'Transformez votre entreprise',
    en: 'Transform your business'
  },
  subheadline: {
    fr: 'Solutions innovantes pour la croissance',
    en: 'Innovative solutions for growth'
  },
  cta: {
    primary: {
      text: { fr: 'Démarrer gratuitement', en: 'Start free trial' },
      href: '/signup',
      variant: 'filled'
    },
    secondary: {
      text: { fr: 'En savoir plus', en: 'Learn more' },
      href: '/about',
      variant: 'outlined'
    }
  },
  backgroundImage: '/images/hero-bg.jpg',
  overlayGradient: {
    from: 'rgba(0, 0, 0, 0.7)',
    to: 'rgba(0, 0, 0, 0.4)'
  }
}

const trustBadges = [
  { name: 'SOC 2', image: '/badges/soc2.png', variant: 'color' },
  { name: 'GDPR', image: '/badges/gdpr.png', variant: 'color' }
]

<HeroSection
  locale="en"
  content={heroContent}
  animations={{
    headline: 'fadeInUp',
    cta: 'fadeInUp',
    stagger: 150,
    scrollIndicator: true
  }}
  stickyCtaAfterScroll={true}
  trustBadges={trustBadges}
  backgroundEffect="gradient-shift"
/>
```

## Animation Types

### fadeInUp
Elements fade in while moving upward. Best for vertical emphasis.

### fadeIn
Simple fade-in effect. Subtle and professional.

### slideInLeft
Elements slide in from the left. Good for directional flow.

### none
No animation. Instant display.

## Background Effects

### none (default)
Static background image or color.

### particles
Animated particle effect overlay. Adds movement and depth.

### gradient-shift
Animated gradient that shifts colors. Modern and dynamic.

### mesh
Mesh gradient background. Trendy and eye-catching.

## Accessibility

- Semantic HTML structure (h1 for headline)
- Proper heading hierarchy
- Video backgrounds respect `prefers-reduced-motion`
- Animations can be disabled via user preferences
- Focus visible on CTA buttons
- Scroll indicator has proper ARIA labels

## Best Practices

1. **Headlines**
   - Keep concise (5-10 words)
   - Focus on value proposition
   - Use action-oriented language

2. **CTAs**
   - Primary CTA should be most important action
   - Use contrasting colors for visibility
   - Action-oriented text ("Start", "Get", "Try")

3. **Animations**
   - Use `fadeInUp` for professional sites
   - Keep `stagger` between 100-200ms
   - Enable `scrollIndicator` only on tall heroes

4. **Sticky CTA**
   - Enable for long-scroll pages
   - Ensure it doesn't obscure important content
   - Use for primary conversion action

5. **Trust Badges**
   - Limit to 3-5 most relevant badges
   - Use high-quality images
   - Ensure badges are recognizable

6. **Performance**
   - Optimize background images (WebP format)
   - Use video backgrounds sparingly
   - Lazy-load video on mobile
   - Consider removing effects on low-end devices
