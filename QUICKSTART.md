# Quick Start Guide: New Website with Simple Site Framework

## Overview

This guide shows you how to create a new professional service website from scratch using the Simple Site Framework. You'll have a fully functional, bilingual website up and running in about 30 minutes.

## Prerequisites

- Node.js 18+ installed
- Basic knowledge of React/Next.js
- Your site content ready (text, colors, logo)

---

## Step 1: Create Next.js Project

```bash
npx create-next-app@latest my-firm-site --typescript --tailwind --app
cd my-firm-site
```

**Prompts:**
- TypeScript: ✅ Yes
- ESLint: ✅ Yes
- Tailwind CSS: ✅ Yes
- `src/` directory: ✅ Yes
- App Router: ✅ Yes
- Import alias: `@/*` (default)

---

## Step 2: Install Framework

### Option A: From GitHub Packages (Private)

Create `.npmrc`:
```bash
echo "@zoyth:registry=https://npm.pkg.github.com" > .npmrc
```

Install:
```bash
npm install @zoyth/simple-site-framework
```

### Option B: From npm (Public - if published publicly)

```bash
npm install simple-site-framework
```

---

## Step 3: Create Directory Structure

```bash
mkdir -p src/config
mkdir -p src/lib
mkdir -p public
```

---

## Step 4: Configure Theme

Create `src/config/theme.ts`:

```typescript
import { type ThemeConfig } from 'simple-site-framework';

export const myTheme: ThemeConfig = {
  brand: {
    name: 'Smith & Associates',
    colors: {
      primary: '#1E3A8A',           // Navy blue
      primaryHover: '#1E40AF',
      primaryLight: '#3B82F6',
      primaryDark: '#1E293B',
      primaryGradientStart: '#F8FAFC',
      primaryGradientEnd: '#FFFFFF',
      heroGradientStart: '#1E3A8A',
      heroGradientEnd: '#0F172A',
      footerGradientStart: '#1E40AF',
      footerGradientEnd: '#1E3A8A',
    },
    fonts: {
      heading: {
        family: 'Playfair Display',
        weights: [400, 700, 900],
        fallback: 'Georgia, serif',
      },
      body: {
        family: 'Inter',
        weights: [300, 400, 600, 700],
        fallback: 'Arial, sans-serif',
      },
    },
  },
  design: {
    borderRadius: 'rounded',  // 'sharp' | 'rounded' | 'pill'
    shadows: 'subtle',        // 'flat' | 'subtle' | 'prominent'
    spacing: 'comfortable',   // 'compact' | 'comfortable' | 'spacious'
  },
  colors: {
    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
};
```

---

## Step 5: Configure Content

Create `src/config/content.ts`:

```typescript
import { type SiteContent } from 'simple-site-framework';

export const myContent: SiteContent = {
  metadata: {
    siteName: 'Smith & Associates',
    siteUrl: 'https://smithlaw.com',
    defaultLocale: 'en',
    supportedLocales: ['en', 'fr'],
    contactEmail: 'contact@smithlaw.com',
    contactPhone: '+15145551234',
    address: {
      street: '123 Main Street, Suite 500',
      city: 'Montreal',
      province: 'QC',
      postalCode: 'H3B 1A1',
      country: 'Canada',
    },
  },

  hero: {
    headline: {
      en: 'Legal Excellence for Your Business',
      fr: 'Excellence juridique pour votre entreprise',
    },
    subheadline: {
      en: 'We provide comprehensive legal services for growing businesses across Quebec.',
      fr: 'Nous offrons des services juridiques complets pour les entreprises en croissance au Québec.',
    },
    backgroundImage: '/hero-bg.jpg',
    cta: {
      primary: {
        text: {
          en: 'Schedule Consultation',
          fr: 'Planifier une consultation',
        },
        href: '/contact',
      },
      secondary: {
        text: {
          en: 'Our Services',
          fr: 'Nos services',
        },
        href: '#services',
      },
    },
    trustLine: {
      en: 'Trusted by over 200 Quebec businesses',
      fr: 'La confiance de plus de 200 entreprises québécoises',
    },
  },

  about: {
    heading: {
      en: 'About Our Firm',
      fr: 'À propos de notre cabinet',
    },
    paragraphs: [
      {
        en: 'Founded in 1995, Smith & Associates has been providing exceptional legal services to Quebec businesses for over 25 years.',
        fr: 'Fondé en 1995, Smith & Associates fournit des services juridiques exceptionnels aux entreprises québécoises depuis plus de 25 ans.',
      },
      {
        en: 'Our team of experienced attorneys specializes in <strong>corporate law</strong>, <strong>contract negotiation</strong>, and <strong>intellectual property</strong>.',
        fr: 'Notre équipe d\'avocats expérimentés se spécialise en <strong>droit des sociétés</strong>, <strong>négociation de contrats</strong> et <strong>propriété intellectuelle</strong>.',
      },
    ],
    image: {
      src: '/about-image.jpg',
      alt: {
        en: 'Our team at Smith & Associates',
        fr: 'Notre équipe chez Smith & Associates',
      },
    },
    showDivider: true,
  },

  whyChooseUs: {
    heading: {
      en: 'Why Choose Smith & Associates',
      fr: 'Pourquoi choisir Smith & Associates',
    },
    paragraphs: [
      {
        en: 'We understand the unique challenges facing Quebec businesses in today\'s complex legal landscape.',
        fr: 'Nous comprenons les défis uniques auxquels font face les entreprises québécoises dans le paysage juridique complexe d\'aujourd\'hui.',
      },
      {
        en: 'Our practical, business-focused approach ensures you get <strong>clear advice</strong> and <strong>effective solutions</strong>.',
        fr: 'Notre approche pratique axée sur les affaires vous garantit des <strong>conseils clairs</strong> et des <strong>solutions efficaces</strong>.',
      },
    ],
    image: {
      src: '/why-us-image.jpg',
      alt: {
        en: 'Client consultation',
        fr: 'Consultation avec un client',
      },
    },
    showDivider: false,
  },

  services: {
    heading: {
      en: 'Our Services',
      fr: 'Nos services',
    },
    description: {
      en: 'Comprehensive legal solutions for your business',
      fr: 'Solutions juridiques complètes pour votre entreprise',
    },
    items: [
      {
        id: 'corporate',
        name: {
          en: 'Corporate Law',
          fr: 'Droit des sociétés',
        },
        description: {
          en: 'Entity formation, governance, and corporate transactions.',
          fr: 'Formation d\'entités, gouvernance et transactions d\'entreprise.',
        },
        href: '/corporate-law',
        icon: 'briefcase',
      },
      {
        id: 'contracts',
        name: {
          en: 'Contract Law',
          fr: 'Droit des contrats',
        },
        description: {
          en: 'Drafting, review, and negotiation of business agreements.',
          fr: 'Rédaction, révision et négociation d\'accords commerciaux.',
        },
        href: '/contracts',
        icon: 'document',
      },
      {
        id: 'ip',
        name: {
          en: 'Intellectual Property',
          fr: 'Propriété intellectuelle',
        },
        description: {
          en: 'Trademark, copyright, and patent protection.',
          fr: 'Protection des marques, droits d\'auteur et brevets.',
        },
        href: '/intellectual-property',
        icon: 'lightbulb',
      },
      {
        id: 'employment',
        name: {
          en: 'Employment Law',
          fr: 'Droit du travail',
        },
        description: {
          en: 'Hiring, termination, and workplace compliance.',
          fr: 'Embauche, licenciement et conformité en milieu de travail.',
        },
        href: '/employment-law',
        icon: 'users',
      },
      {
        id: 'litigation',
        name: {
          en: 'Litigation',
          fr: 'Litiges',
        },
        description: {
          en: 'Representation in business disputes and litigation.',
          fr: 'Représentation dans les litiges et contentieux commerciaux.',
        },
        href: '/litigation',
        icon: 'scale',
      },
    ],
    cta: {
      heading: {
        en: 'Ready to get started?',
        fr: 'Prêt à commencer?',
      },
      subtext: {
        en: 'Contact us today for a consultation',
        fr: 'Contactez-nous dès aujourd\'hui pour une consultation',
      },
      button: {
        text: {
          en: 'Schedule Consultation',
          fr: 'Planifier une consultation',
        },
        href: '/contact',
      },
    },
    showDivider: true,
  },
};
```

---

## Step 6: Configure Navigation

Create `src/config/navigation.ts`:

```typescript
import { type NavigationConfig } from 'simple-site-framework';

export const myNavigation: NavigationConfig = {
  header: {
    logo: {
      image: '/logo.png',
      imageAlt: {
        en: 'Smith & Associates',
        fr: 'Smith & Associates',
      },
      href: '/',
      width: 200,
      height: 60,
    },
    mainNav: [
      {
        id: 'services',
        label: {
          en: 'Services',
          fr: 'Services',
        },
        type: 'dropdown',
        children: [
          {
            id: 'corporate',
            label: {
              en: 'Corporate Law',
              fr: 'Droit des sociétés',
            },
            description: {
              en: 'Business formation and governance',
              fr: 'Formation et gouvernance d\'entreprise',
            },
            href: '/corporate-law',
          },
          {
            id: 'contracts',
            label: {
              en: 'Contract Law',
              fr: 'Droit des contrats',
            },
            description: {
              en: 'Agreement drafting and negotiation',
              fr: 'Rédaction et négociation d\'accords',
            },
            href: '/contracts',
          },
        ],
      },
      {
        id: 'team',
        label: {
          en: 'Our Team',
          fr: 'Notre équipe',
        },
        href: '/team',
      },
      {
        id: 'contact',
        label: {
          en: 'Contact',
          fr: 'Contact',
        },
        href: '/contact',
      },
    ],
    utilityNav: [
      {
        id: 'client-portal',
        label: {
          en: 'Client Portal',
          fr: 'Portail client',
        },
        href: 'https://portal.smithlaw.com',
        external: true,
      },
    ],
  },
  footer: {
    sections: [
      {
        links: [
          {
            id: 'contact',
            label: {
              en: 'Contact',
              fr: 'Contact',
            },
            href: '/contact',
          },
          {
            id: 'privacy',
            label: {
              en: 'Privacy Policy',
              fr: 'Politique de confidentialité',
            },
            href: '/privacy',
          },
        ],
      },
    ],
    copyright: {
      en: 'Copyright © {year} Smith & Associates - All rights reserved.',
      fr: 'Copyright © {year} Smith & Associates - Tous droits réservés.',
    },
  },
};
```

---

## Step 7: Set Up Fonts

Create `src/lib/fonts.ts`:

```typescript
import { Playfair_Display, Inter } from 'next/font/google';

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-heading',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});
```

---

## Step 8: Update Tailwind Config

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/simple-site-framework/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        'primary-hover': '#1E40AF',
        charcoal: '#1E293B',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Arial', 'sans-serif'],
        condensed: ['var(--font-heading)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'brand-gradient-light': 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)',
        'hero-gradient': 'linear-gradient(135deg, #1E3A8A, #0F172A)',
        'footer-gradient-orange': 'linear-gradient(135deg, #1E40AF, #1E3A8A)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Step 9: Create Layout

Update `src/app/[locale]/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { playfairDisplay, inter } from '@/lib/fonts';
import { locales, type Locale } from 'simple-site-framework';
import { Header, Footer } from 'simple-site-framework/components';
import { myNavigation } from '@/config/navigation';
import '../globals.css';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };

  const title = locale === 'fr'
    ? 'Smith & Associates - Avocats d\'affaires'
    : 'Smith & Associates - Business Lawyers';

  const description = locale === 'fr'
    ? 'Services juridiques complets pour entreprises québécoises.'
    : 'Comprehensive legal services for Quebec businesses.';

  return {
    title,
    description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  return (
    <html lang={locale}>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased flex min-h-screen flex-col`}
      >
        <Header locale={locale} config={myNavigation.header} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} config={myNavigation.footer} />
      </body>
    </html>
  );
}
```

---

## Step 10: Create Homepage

Create `src/app/[locale]/page.tsx`:

```typescript
import type { Locale } from 'simple-site-framework';
import {
  HeroSection,
  AboutSection,
  WhyChooseUsSection,
  ServicesSection,
} from 'simple-site-framework/components';
import { myContent } from '@/config/content';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  return (
    <div className="flex flex-col">
      <HeroSection locale={locale} content={myContent.hero} />
      <AboutSection locale={locale} content={myContent.about} />
      <WhyChooseUsSection locale={locale} content={myContent.whyChooseUs} />
      <ServicesSection locale={locale} content={myContent.services} />
    </div>
  );
}
```

---

## Step 11: Add Logo and Images

Place your files in `/public`:
- `/public/logo.png` - Your site logo
- `/public/hero-bg.jpg` - Hero background image
- `/public/about-image.jpg` - About section image
- `/public/why-us-image.jpg` - Why choose us image

---

## Step 12: Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000/en or http://localhost:3000/fr

---

## Step 13: Build for Production

```bash
npm run build
npm start
```

---

## Customization

### Change Colors

Edit `src/config/theme.ts` and update the `colors` section.

### Add More Content

Edit `src/config/content.ts` to add new sections or modify existing ones.

### Add New Pages

Use the `ServicePageLayout` component:

```typescript
import { ServicePageLayout } from 'simple-site-framework/components';

export default function MyPage({ params }) {
  return (
    <ServicePageLayout
      locale={params.locale}
      title={{ en: 'Page Title', fr: 'Titre de la page' }}
      breadcrumbs={[
        { label: { en: 'Home', fr: 'Accueil' }, href: '/' },
        { label: { en: 'Page', fr: 'Page' }, href: '/page' },
      ]}
    >
      <p>Your content here</p>
    </ServicePageLayout>
  );
}
```

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

The site is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Self-hosted with Docker

---

## Support

For issues or questions, open an issue on the GitHub repository:
https://github.com/zoyth/simple-site-framework

---

## Next Steps

- Add a contact form
- Create service detail pages
- Add team member profiles
- Set up analytics
- Configure SEO metadata
- Add sitemap generation

Congratulations! You now have a professional, bilingual website powered by Simple Site Framework. 🎉
