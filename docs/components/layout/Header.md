# Header

Site navigation component with logo, menu, and CTA button. The persistent top-level navigation for your entire site.

## Import

```typescript
import { Header } from '@zoyth/simple-site-framework';
```

**Type:** Server Component (default export)

## Basic Usage

```typescript
<Header
  logo={{
    src: '/logo.svg',
    alt: 'Company Logo',
    width: 150,
    height: 40,
  }}
  navigation={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ]}
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `logo` | `LogoConfig` | Logo configuration |
| `navigation` | `NavigationItem[]` | Navigation menu items |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cta` | `CTAConfig` | - | Call-to-action button |
| `sticky` | `boolean` | `true` | Make header sticky on scroll |
| `transparent` | `boolean` | `false` | Transparent background |
| `maxWidth` | `MaxWidth` | `'7xl'` | Maximum content width |
| `className` | `string` | - | Custom CSS classes |
| `locale` | `string` | - | Current locale |

### Type Definitions

```typescript
interface LogoConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  href?: string;
}

interface NavigationItem {
  label: string | LocalizedString;
  href: string;
  children?: NavigationItem[];
}

interface CTAConfig {
  text: string | LocalizedString;
  href: string;
  onClick?: () => void;
}
```

## Examples

### Simple Header

```typescript
<Header
  logo={{
    src: '/logo.svg',
    alt: 'Acme Corp',
    width: 120,
    height: 32,
  }}
  navigation={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]}
/>
```

### With CTA Button

```typescript
<Header
  logo={{
    src: '/logo.svg',
    alt: 'Acme Corp',
    width: 120,
    height: 32,
  }}
  navigation={[
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ]}
  cta={{
    text: 'Start Free Trial',
    href: '/signup',
  }}
/>
```

### With Dropdown Menu

```typescript
<Header
  logo={{
    src: '/logo.svg',
    alt: 'Acme Corp',
    width: 120,
    height: 32,
  }}
  navigation={[
    { label: 'Home', href: '/' },
    {
      label: 'Services',
      href: '/services',
      children: [
        { label: 'Web Development', href: '/services/web' },
        { label: 'Mobile Apps', href: '/services/mobile' },
        { label: 'Consulting', href: '/services/consulting' },
      ],
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]}
/>
```

### Multi-Language Header

```typescript
<Header
  logo={{
    src: '/logo.svg',
    alt: 'Acme Corp',
    width: 120,
    height: 32,
  }}
  navigation={[
    {
      label: { en: 'Home', fr: 'Accueil', es: 'Inicio' },
      href: '/',
    },
    {
      label: { en: 'About', fr: 'À propos', es: 'Acerca de' },
      href: '/about',
    },
    {
      label: { en: 'Contact', fr: 'Contact', es: 'Contacto' },
      href: '/contact',
    },
  ]}
  cta={{
    text: {
      en: 'Get Started',
      fr: 'Commencer',
      es: 'Empezar',
    },
    href: '/signup',
  }}
  locale={locale}
/>
```

### Transparent Header

```typescript
<Header
  transparent
  logo={{
    src: '/logo-white.svg',
    alt: 'Acme Corp',
    width: 120,
    height: 32,
  }}
  navigation={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]}
  className="text-white"
/>
```

### Non-Sticky Header

```typescript
<Header
  sticky={false}
  logo={{
    src: '/logo.svg',
    alt: 'Acme Corp',
    width: 120,
    height: 32,
  }}
  navigation={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]}
/>
```

### Custom Logo Link

```typescript
<Header
  logo={{
    src: '/logo.svg',
    alt: 'Acme Corp',
    width: 120,
    height: 32,
    href: '/dashboard', // Go to dashboard instead of home
  }}
  navigation={[
    { label: 'Projects', href: '/projects' },
    { label: 'Settings', href: '/settings' },
  ]}
/>
```

## Styling

### Custom Background

```typescript
<Header
  logo={logoConfig}
  navigation={navItems}
  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
/>
```

### Custom Height

```typescript
<Header
  logo={logoConfig}
  navigation={navItems}
  className="h-20" // Taller header
/>
```

### Custom Max Width

```typescript
<Header
  logo={logoConfig}
  navigation={navItems}
  maxWidth="full" // Full width instead of constrained
/>
```

### Dark Mode

```typescript
<Header
  logo={logoConfig}
  navigation={navItems}
  className="dark:bg-gray-900 dark:text-white"
/>
```

## Mobile Navigation

The Header component automatically adapts for mobile:

- **Desktop:** Horizontal menu with all items visible
- **Mobile:** Hamburger menu with slide-out drawer
- **Breakpoint:** Responsive at `md` (768px)

### Mobile Menu Behavior

- Hamburger icon appears on mobile
- Tapping opens full-screen menu
- Dropdowns expand inline
- CTA button remains visible
- Smooth animations

## Accessibility

Header includes:

- ✅ Semantic `<header>` and `<nav>` elements
- ✅ Proper heading hierarchy (logo as h1 alternative)
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ ARIA labels for mobile menu toggle
- ✅ Focus trap in mobile menu
- ✅ Skip link target
- ✅ Screen reader announcements for menu state

### ARIA Attributes

```typescript
// Mobile menu button automatically includes:
<button
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
>
```

## Common Patterns

### Site-Wide Header

```typescript
// src/app/layout.tsx
import { Header } from '@zoyth/simple-site-framework';
import { siteConfig } from '@/config/site';
import { navigation } from '@/config/navigation';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header
          logo={siteConfig.logo}
          navigation={navigation}
          cta={{
            text: 'Get Started',
            href: '/signup',
          }}
        />
        {children}
      </body>
    </html>
  );
}
```

### Locale-Aware Header

```typescript
// src/app/[locale]/layout.tsx
import { Header } from '@zoyth/simple-site-framework';
import { navigation } from '@/config/navigation';

export default function LocaleLayout({ params: { locale } }) {
  return (
    <>
      <Header
        logo={logoConfig}
        navigation={navigation}
        locale={locale}
      >
        <LanguageSelector currentLocale={locale} />
      </Header>
      {/* ... */}
    </>
  );
}
```

### Header with Search

```typescript
<Header
  logo={logoConfig}
  navigation={navItems}
  cta={{
    text: 'Sign In',
    href: '/login',
  }}
>
  <div className="flex items-center gap-4">
    <input
      type="search"
      placeholder="Search..."
      className="px-4 py-2 border rounded-lg"
    />
    <Button variant="filled">Search</Button>
  </div>
</Header>
```

### Authenticated Header

```typescript
function AuthenticatedHeader({ user }) {
  return (
    <Header
      logo={logoConfig}
      navigation={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Projects', href: '/projects' },
        { label: 'Settings', href: '/settings' },
      ]}
      cta={
        user ? {
          text: user.name,
          href: '/profile',
        } : {
          text: 'Sign In',
          href: '/login',
        }
      }
    />
  );
}
```

## Integration

### With Language Selector

```typescript
import { Header, LanguageSelector } from '@zoyth/simple-site-framework';

<Header
  logo={logoConfig}
  navigation={navItems}
>
  <LanguageSelector currentLocale={locale} />
</Header>
```

### With Analytics

```typescript
<Header
  logo={logoConfig}
  navigation={navItems}
  cta={{
    text: 'Start Trial',
    href: '/signup',
    onClick: () => {
      trackEvent('header_cta_click', {
        location: 'header',
        text: 'Start Trial',
      });
    },
  }}
/>
```

### With Active Link Highlighting

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@zoyth/simple-site-framework';

export function ActiveHeader() {
  const pathname = usePathname();

  return (
    <Header
      logo={logoConfig}
      navigation={navItems.map(item => ({
        ...item,
        active: pathname === item.href,
      }))}
    />
  );
}
```

## Best Practices

### ✅ Do

- Keep navigation menu concise (5-7 top-level items max)
- Use descriptive labels (not "Click Here")
- Make CTA button prominent and action-oriented
- Use sticky header for better navigation access
- Test mobile menu on actual devices
- Ensure logo is optimized for fast loading

### ❌ Don't

- Overcrowd navigation with too many items
- Hide important pages in dropdowns
- Make logo too large (affects mobile)
- Use tiny text (accessibility issue)
- Forget to test keyboard navigation
- Make mobile menu hard to close

## Troubleshooting

### Logo not displaying

**Check:**
1. Image path is correct (relative to `public/` folder)
2. Image file exists
3. Width and height are provided
4. Image format is supported

### Mobile menu not working

**Check:**
1. JavaScript is enabled
2. Mobile menu component is client-rendered
3. No CSS hiding the menu
4. Z-index is sufficient

### Navigation items not clickable

**Check:**
1. `href` is provided for each item
2. No overlay blocking clicks
3. Links are not disabled
4. Z-index conflicts resolved

### Sticky header not sticking

**Check:**
1. `sticky` prop is `true` (default)
2. No parent element with `overflow: hidden`
3. CSS not overriding `position: sticky`

## SEO

- Uses semantic `<header>` and `<nav>` tags
- Logo includes proper alt text
- Navigation is crawlable (real `<a>` tags)
- Mobile menu doesn't block content from crawlers

## Performance

- Server component by default (no JavaScript)
- Logo uses Next.js `<Image>` for optimization
- Mobile menu lazy-loaded on mobile
- Minimal CSS bundle

## Related Components

- **[Footer](./Footer.md)** - Site footer
- **[LanguageSelector](./LanguageSelector.md)** - Language switcher
- **[Button](../ui/Button.md)** - CTA button component

## API Reference

Full TypeScript definitions: **[API Reference](../../api/components.md#header)**
