# Quick Start Guide

Build your first page with Simple Site Framework in 5 minutes.

## Prerequisites

You should have completed **[Installation](./installation.md)** and have:
- ✅ Next.js 14+ project with App Router
- ✅ Simple Site Framework installed
- ✅ Tailwind CSS configured with framework in `content` array
- ✅ Theme tokens defined in `tailwind.config.ts`

## Step 1: Create Your First Page

Create a homepage with a hero section:

```typescript
// src/app/page.tsx
import { HeroSection } from '@zoyth/simple-site-framework';

export default function HomePage() {
  return (
    <main>
      <HeroSection
        heading="Transform Your Business"
        description="Professional consulting services that deliver real results"
        cta={{
          text: 'Get Started',
          href: '/contact'
        }}
        variant="centered"
      />
    </main>
  );
}
```

**Run it:**
```bash
npm run dev
```

Visit `http://localhost:3000` - you should see a styled hero section.

## Step 2: Add More Sections

Build a complete landing page by stacking sections:

```typescript
// src/app/page.tsx
import {
  HeroSection,
  FeaturesGrid,
  TestimonialSection,
  CTASection,
} from '@zoyth/simple-site-framework';

export default function HomePage() {
  return (
    <main>
      <HeroSection
        heading="Transform Your Business"
        description="Professional consulting services that deliver real results"
        cta={{
          text: 'Get Started',
          href: '/contact'
        }}
        variant="centered"
      />

      <FeaturesGrid
        heading="Why Choose Us"
        description="We deliver exceptional results through proven expertise"
        features={[
          {
            title: 'Expert Team',
            description: '15+ years of combined experience',
            icon: 'users',
          },
          {
            title: 'Proven Results',
            description: 'Over 200 successful projects delivered',
            icon: 'chart',
          },
          {
            title: 'Fast Delivery',
            description: 'Average project completion in 6 weeks',
            icon: 'clock',
          },
        ]}
        columns={3}
      />

      <TestimonialSection
        heading="What Our Clients Say"
        testimonials={[
          {
            quote: 'Working with this team transformed our business. Revenue increased 300% in 6 months.',
            author: 'Jane Smith',
            role: 'CEO',
            company: 'Tech Startup Inc',
          },
        ]}
      />

      <CTASection
        heading="Ready to Get Started?"
        description="Join hundreds of satisfied clients"
        primaryCTA={{
          text: 'Start Free Trial',
          href: '/signup',
        }}
        secondaryCTA={{
          text: 'View Pricing',
          href: '/pricing',
        }}
      />
    </main>
  );
}
```

## Step 3: Add Layout Components

Wrap your pages with Header and Footer:

```typescript
// src/app/layout.tsx
import { Header, Footer } from '@zoyth/simple-site-framework';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
          cta={{
            text: 'Get Started',
            href: '/contact',
          }}
        />

        {children}

        <Footer
          companyName="Your Company"
          tagline="Professional services that deliver"
          sections={[
            {
              title: 'Company',
              links: [
                { label: 'About', href: '/about' },
                { label: 'Careers', href: '/careers' },
                { label: 'Contact', href: '/contact' },
              ],
            },
            {
              title: 'Legal',
              links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ],
            },
          ]}
          socialLinks={[
            { platform: 'twitter', url: 'https://twitter.com/yourcompany' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany' },
          ]}
        />
      </body>
    </html>
  );
}
```

## Step 4: Add a Contact Page

Create a contact page with a form:

```typescript
// src/app/contact/page.tsx
import { ContactSection } from '@zoyth/simple-site-framework';

export default function ContactPage() {
  return (
    <main>
      <ContactSection
        heading="Get in Touch"
        description="We'd love to hear from you"
        email="contact@yourcompany.com"
        phone="+1 (555) 123-4567"
        locations={[
          {
            city: 'New York',
            address: '123 Main St, Suite 100',
            mapUrl: 'https://maps.google.com/?q=123+Main+St+New+York',
          },
        ]}
        formConfig={{
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email', required: true },
            { name: 'company', type: 'text', label: 'Company' },
            { name: 'message', type: 'textarea', label: 'Message', required: true },
          ],
          submitText: 'Send Message',
          successMessage: 'Thanks! We\'ll get back to you within 24 hours.',
        }}
      />
    </main>
  );
}
```

## Step 5: Customize Your Theme

Update your theme tokens to match your brand:

```typescript
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        // Your brand colors
        primary: '#0066CC',
        'primary-hover': '#0052A3',
        secondary: '#1A1A1A',
        'secondary-hover': '#000000',
      },
      fontFamily: {
        // Your brand fonts
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
};
```

Load your fonts:

```typescript
// src/app/layout.tsx
import { Montserrat, Open_Sans } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

// Apply to <html> tag
<html className={`${montserrat.variable} ${openSans.variable}`}>
```

## What You've Built

In 5 minutes, you've created:

- ✅ A complete homepage with hero, features, testimonials, and CTA
- ✅ Consistent header and footer across all pages
- ✅ A working contact form with validation
- ✅ Custom branding with your colors and fonts
- ✅ Fully responsive, accessible components
- ✅ SEO-optimized, server-rendered pages

## Next Steps

### Add Multi-Language Support

```typescript
// src/config/i18n.ts
export const i18nConfig = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
};
```

Then use `LocalizedString` for all content:

```typescript
<HeroSection
  heading={{
    en: 'Transform Your Business',
    fr: 'Transformez votre entreprise'
  }}
  cta={{
    text: { en: 'Get Started', fr: 'Commencer' },
    href: '/contact'
  }}
  locale={locale}
/>
```

See **[Internationalization](../features/internationalization.md)** for complete setup.

### Add Analytics

Track page views and conversions:

```typescript
// src/app/layout.tsx
import { AnalyticsTracker } from '@zoyth/simple-site-framework/client';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
```

See **[Analytics Setup](../guides/analytics-setup.md)** for configuration.

### Optimize SEO

Add meta tags and structured data:

```typescript
// src/app/page.tsx
export const metadata = {
  title: 'Transform Your Business | Your Company',
  description: 'Professional consulting services that deliver real results',
  openGraph: {
    title: 'Transform Your Business',
    description: 'Professional consulting services',
    images: ['/og-image.jpg'],
  },
};
```

See **[SEO Optimization](../guides/seo-optimization.md)** for best practices.

### Add More Pages

Create service pages, pricing, about, blog, etc.:

```typescript
// src/app/about/page.tsx
import { AboutSection } from '@zoyth/simple-site-framework';

export default function AboutPage() {
  return (
    <AboutSection
      heading="About Our Company"
      story="Founded in 2010, we've helped over 500 businesses transform..."
      team={[
        {
          name: 'John Doe',
          role: 'Founder & CEO',
          bio: 'Former consultant at McKinsey...',
          image: '/team/john.jpg',
        },
      ]}
      stats={[
        { value: '500+', label: 'Clients Served' },
        { value: '15', label: 'Years Experience' },
        { value: '98%', label: 'Satisfaction Rate' },
      ]}
    />
  );
}
```

## Common Patterns

### Full-Width vs Contained

Sections are full-width by default. Use `maxWidth` to contain content:

```typescript
<HeroSection
  heading="Welcome"
  maxWidth="xl" // Constrains content width
/>
```

### Custom Styling

Add custom classes when needed:

```typescript
<HeroSection
  heading="Welcome"
  className="bg-gradient-to-r from-blue-600 to-purple-600"
/>
```

### Conditional Rendering

Show different content based on conditions:

```typescript
{isPromoActive && (
  <CTASection
    heading="Limited Time Offer"
    primaryCTA={{ text: 'Claim Discount', href: '/promo' }}
  />
)}
```

## Troubleshooting

### Components Look Unstyled

**Check:**
1. Tailwind config includes framework in `content` array
2. Theme tokens are defined (colors, fonts)
3. Dev server was restarted after config changes

### TypeScript Errors

**Check:**
1. Types are imported: `import type { LocalizedString } from '@zoyth/simple-site-framework'`
2. Props match component signature
3. TypeScript server was restarted in your editor

### Build Errors

**Check:**
1. Client components imported from `/client`: `import { AnalyticsTracker } from '.../client'`
2. Server components imported from main export: `import { HeroSection } from '...'`

See **[Troubleshooting](../../TROUBLESHOOTING.md)** for detailed debugging.

## Resources

- **[Components Overview](../components/overview.md)** - Explore all available components
- **[First Project Tutorial](./first-project.md)** - Step-by-step complete site
- **[Configuration Guide](../core-concepts/configuration-driven.md)** - Deep dive into config approach
- **[Examples](../examples/landing-page-simple.md)** - Real-world usage patterns

---

**Congratulations!** You've built your first site with Simple Site Framework. Explore the documentation to learn about advanced features like A/B testing, animations, and performance optimization.
