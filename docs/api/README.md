# API Reference - Component Discovery Index

Quick reference for all 35+ framework components with their key capabilities.

## Layout Components (6)

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `Header` | Site header with navigation | Mobile menu, language switcher, sticky header, logo display |
| `Footer` | Site footer | Multi-column layout, social links, copyright, newsletter |
| `LanguageSwitcher` | Language toggle | French/English switching with flags |
| `PageLayout` | Standard page wrapper | Consistent spacing, responsive containers |
| `ServicePageLayout` | Service detail pages | Hero, content sections, sidebar CTA |
| `LazySection` | Lazy-loading wrapper | Intersection observer, loading states, performance optimization |

## Section Components (15)

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `HeroSection` | Above-fold hero banner | **Animations** (fadeInUp, slideInLeft), **sticky CTA**, **video backgrounds**, **parallax**, **trust badges**, scroll indicator |
| `AboutSection` | Company/service overview | Rich content, timeline, team grid, image gallery |
| `ServicesSection` | Service offerings grid | Hover effects, filtering, card layouts |
| `FeaturesGrid` | Feature showcase | Icons, descriptions, grid/list layouts |
| `TestimonialsSection` | Customer testimonials | Ratings, rotation, avatar display |
| `FAQSection` | Frequently asked questions | **Searchable**, **expandable accordion**, categories |
| `TeamSection` | Team member profiles | Bios, photos, social links, grid layout |
| `ContactSection` | Contact form and info | **Full form validation**, **multiple locations**, **maps**, **office hours**, file uploads, spam protection |
| `CTASection` | Call-to-action prompts | Banner, split, card variants |
| `WhyChooseUsSection` | Differentiators | Icon + text grid, visual emphasis |
| `SecurePortalSection` | Secure portal CTA | Login link, security badges |
| `PersonalTaxesSection` | Service-specific CTA | Tax service promotion |
| `RecruitingSection` | Recruitment CTA | Job listings link, company culture |
| `PricingSection` | Pricing tables | Feature comparison, highlights, CTAs |
| `StatsSection` | Statistics showcase | Counter animations, grid layout |
| `LogosSection` | Client/partner logos | Responsive grid, grayscale/color variants |
| `TimelineSection` | Company/process timeline | Vertical timeline with milestones |
| `ProcessSection` | Step-by-step process | Numbered steps, visual flow |

## UI Components (14)

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `Button` | Action buttons | **6 variants** (outlined, filled, text, ghost, link, destructive), **5 sizes**, **loading/success states**, **icons**, **ripple effect**, **tooltips** |
| `Card` | Content containers | Variants, hover effects, flexible layout |
| `Badge` | Status/category indicators | Color variants, sizes |
| `Icon` | Type-safe icons | **1000+ Lucide icons**, autocomplete, presets |
| `Input` | Text input fields | Validation states, labels, errors |
| `Textarea` | Multi-line text input | Auto-resize, character count |
| `Select` | Dropdown selection | Radix UI powered, keyboard navigation |
| `Checkbox` | Boolean input | Indeterminate state, labels |
| `Radio` | Single choice input | Radio groups, labels |
| `FormField` | Form field wrapper | Label, error display, required indicator |
| `Breadcrumb` | Breadcrumb navigation | Auto-generated from route, custom items |
| `Tabs` | Tab navigation | Radix UI powered, keyboard accessible |
| `Accordion` | Collapsible content | Radix UI powered, single/multiple open |
| `Dialog` | Modal dialogs | Radix UI powered, focus trap, backdrop |
| `Tooltip` | Hover tooltips | Radix UI powered, positioning |
| `Toast` | Toast notifications | Success, error, info variants |

## Development Tools (4)

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `StyleGuide` | Interactive brand reference | **All colors**, **typography**, **components**, **spacing**, perfect for design reviews |
| `CodeBlock` | Syntax-highlighted code | **Copy button**, line numbers, 100+ languages |
| `ComponentDemo` | Live component previews | Code + preview, interactive examples |
| `HeadScripts` | Document head injection | Meta tags, structured data, scripts |
| `BodyEndScripts` | Body end injection | Analytics, chat widgets, deferred scripts |

## Key Type Exports

### Component Props
- `ButtonProps` - Enhanced button configuration (loading, success, icons, ripple)
- `HeroSectionProps` - Hero configuration including animations
- `ContactSectionProps` - Contact form and location configuration
- `IconProps` - Icon component props with type-safe names

### Configuration Types
- `ThemeConfig` - Complete theme configuration
- `SiteContent` - Site content structure
- `NavigationConfig` - Header/footer navigation
- `LocalizedString` - Bilingual text (`{ fr: string, en: string }`)

### Feature-Specific Types
- `HeroAnimations` - Animation configuration for hero section
  ```typescript
  {
    headline?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'none'
    cta?: 'fadeInUp' | 'fadeIn' | 'none'
    stagger?: number
    scrollIndicator?: boolean
  }
  ```

- `ContactFormConfig` - Form field and validation configuration
  ```typescript
  {
    enabled?: boolean
    fields?: Array<'name' | 'email' | 'phone' | 'subject' | 'message' | 'attachment'>
    requiredFields?: Array<'name' | 'email' | 'phone' | 'subject' | 'message'>
    onSubmit?: (data: ContactFormData) => Promise<void>
    spamProtection?: SpamProtection
    integration?: FormIntegration
  }
  ```

- `Badge` - Trust badge/logo configuration
- `Location` - Office location with maps and hours
- `FormIntegration` - Third-party form integrations (email services, CRMs)

## Utility Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `getLocalizedString(str, locale)` | Get text for current locale | `getLocalizedString(content.title, 'fr')` |
| `cn(...classes)` | Merge Tailwind classes | `cn('px-4', 'py-2', className)` |
| `generateThemeCSS(theme)` | Generate CSS variables | Used internally by framework |

## Import Patterns

```typescript
// Components
import { HeroSection, Button, Icon } from '@zoyth/simple-site-framework'

// Types
import type { HeroAnimations, ContactFormConfig } from '@zoyth/simple-site-framework'

// Utilities
import { getLocalizedString, cn } from '@zoyth/simple-site-framework'

// Icon presets
import { Icons } from '@zoyth/simple-site-framework'
```

## Most Commonly Used Components

For a typical professional services site:

1. **HeroSection** - with animations and sticky CTA
2. **ServicesSection** - showcase offerings
3. **ContactSection** - with working form
4. **AboutSection** - company story
5. **TestimonialsSection** - social proof
6. **FAQSection** - answer common questions
7. **Button** - CTAs throughout
8. **Icon** - visual elements

## Advanced Features to Explore

- **Button loading/success states** - Automatic state management for forms
- **Hero sticky CTA** - CTA button that appears on scroll
- **Hero animations** - Coordinated entrance animations
- **Contact multi-location** - Support multiple offices with maps
- **Icon type safety** - Autocomplete for 1000+ icons
- **LazySection** - Performance optimization for below-fold content
- **StyleGuide** - Interactive brand reference for stakeholders

## Next Steps

- See **[Full API Reference](./components/)** for detailed prop documentation (coming soon - issue #46)
- See **[Examples](../examples/)** for usage patterns (coming soon - issue #46)
- See **[Recipes](../recipes/)** for common patterns (coming soon - issue #46)
- See **[README.md](../../README.md)** for quick start guide
- See **[QUICKSTART.md](../../QUICKSTART.md)** for step-by-step tutorial
