# Footer

Site footer component with links, social media, and company information. The persistent bottom section of your site.

## Import

```typescript
import { Footer } from '@zoyth/simple-site-framework';
```

**Type:** Server Component (default export)

## Basic Usage

```typescript
<Footer
  companyName="Acme Corporation"
  tagline="Building the future"
  sections={[
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ]}
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `companyName` | `string \| LocalizedString` | Company/site name |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tagline` | `string \| LocalizedString` | - | Company tagline/slogan |
| `sections` | `FooterSection[]` | - | Footer link sections |
| `socialLinks` | `SocialLink[]` | - | Social media links |
| `legalLinks` | `LegalLink[]` | - | Legal/policy links |
| `copyright` | `string \| LocalizedString` | Auto | Copyright notice |
| `showCopyright` | `boolean` | `true` | Show copyright text |
| `maxWidth` | `MaxWidth` | `'7xl'` | Maximum content width |
| `className` | `string` | - | Custom CSS classes |
| `locale` | `string` | - | Current locale |

### Type Definitions

```typescript
interface FooterSection {
  title: string | LocalizedString;
  links: FooterLink[];
}

interface FooterLink {
  label: string | LocalizedString;
  href: string;
  external?: boolean;
}

interface SocialLink {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'youtube' | 'github';
  url: string;
}

interface LegalLink {
  label: string | LocalizedString;
  href: string;
}
```

## Examples

### Simple Footer

```typescript
<Footer
  companyName="Acme Corp"
  tagline="Innovation through technology"
  sections={[
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ]}
/>
```

### With Multiple Sections

```typescript
<Footer
  companyName="Acme Corp"
  tagline="Building the future"
  sections={[
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Support', href: '/support' },
      ],
    },
  ]}
/>
```

### With Social Links

```typescript
<Footer
  companyName="Acme Corp"
  socialLinks={[
    { platform: 'twitter', url: 'https://twitter.com/acmecorp' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/acmecorp' },
    { platform: 'github', url: 'https://github.com/acmecorp' },
  ]}
  sections={[
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ]}
/>
```

### With Legal Links

```typescript
<Footer
  companyName="Acme Corp"
  legalLinks={[
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ]}
  sections={[
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ]}
/>
```

### Complete Footer

```typescript
<Footer
  companyName="Acme Corporation"
  tagline="Innovation through technology"
  sections={[
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Updates', href: '/updates' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ]}
  socialLinks={[
    { platform: 'twitter', url: 'https://twitter.com/acmecorp' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/acmecorp' },
    { platform: 'github', url: 'https://github.com/acmecorp' },
  ]}
/>
```

### Multi-Language Footer

```typescript
<Footer
  companyName="Acme Corp"
  tagline={{
    en: 'Innovation through technology',
    fr: 'Innovation par la technologie',
    es: 'Innovación a través de la tecnología',
  }}
  sections={[
    {
      title: { en: 'Company', fr: 'Entreprise', es: 'Empresa' },
      links: [
        {
          label: { en: 'About', fr: 'À propos', es: 'Acerca de' },
          href: '/about',
        },
        {
          label: { en: 'Contact', fr: 'Contact', es: 'Contacto' },
          href: '/contact',
        },
      ],
    },
  ]}
  legalLinks={[
    {
      label: { en: 'Privacy Policy', fr: 'Politique de confidentialité', es: 'Política de privacidad' },
      href: '/privacy',
    },
  ]}
  locale={locale}
/>
```

### Custom Copyright

```typescript
<Footer
  companyName="Acme Corp"
  copyright="© 2024 Acme Corporation. All rights reserved."
  sections={sections}
/>
```

### Without Copyright

```typescript
<Footer
  companyName="Acme Corp"
  showCopyright={false}
  sections={sections}
/>
```

### External Links

```typescript
<Footer
  companyName="Acme Corp"
  sections={[
    {
      title: 'Community',
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/acmecorp',
          external: true,
        },
        {
          label: 'Discord',
          href: 'https://discord.gg/acmecorp',
          external: true,
        },
      ],
    },
  ]}
/>
```

## Styling

### Custom Background

```typescript
<Footer
  companyName="Acme Corp"
  sections={sections}
  className="bg-gradient-to-r from-gray-900 to-black text-white"
/>
```

### Custom Layout

```typescript
<Footer
  companyName="Acme Corp"
  sections={sections}
  className="grid-cols-1 md:grid-cols-4" // Custom column layout
/>
```

### Compact Footer

```typescript
<Footer
  companyName="Acme Corp"
  sections={sections}
  className="py-8" // Reduced padding
/>
```

### Dark Mode

```typescript
<Footer
  companyName="Acme Corp"
  sections={sections}
  className="dark:bg-gray-900 dark:text-white"
/>
```

## Accessibility

Footer includes:

- ✅ Semantic `<footer>` element
- ✅ Proper heading hierarchy for section titles
- ✅ Keyboard navigable links
- ✅ ARIA labels for social media icons
- ✅ External link indicators
- ✅ Screen reader friendly
- ✅ Sufficient color contrast

### External Link Accessibility

```typescript
// External links automatically include:
<a
  href="https://external-site.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Opens in new tab"
>
  External Link
</a>
```

## Common Patterns

### Site-Wide Footer

```typescript
// src/app/layout.tsx
import { Footer } from '@zoyth/simple-site-framework';
import { footerConfig } from '@/config/footer';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Footer {...footerConfig} />
      </body>
    </html>
  );
}
```

### Newsletter Signup Footer

```typescript
<Footer
  companyName="Acme Corp"
  sections={sections}
>
  <div className="mb-8">
    <h3 className="text-lg font-bold mb-4">Subscribe to Our Newsletter</h3>
    <form className="flex gap-4">
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 px-4 py-2 border rounded-lg"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  </div>
</Footer>
```

### Footer with Logo

```typescript
<Footer
  companyName="Acme Corp"
  sections={sections}
>
  <img
    src="/logo.svg"
    alt="Acme Corp"
    width={120}
    height={32}
    className="mb-4"
  />
</Footer>
```

### Contact Information Footer

```typescript
<Footer
  companyName="Acme Corp"
  tagline="We're here to help"
  sections={sections}
>
  <div className="space-y-2">
    <p>📧 contact@acmecorp.com</p>
    <p>📞 +1 (555) 123-4567</p>
    <p>📍 123 Main St, San Francisco, CA 94105</p>
  </div>
</Footer>
```

## Configuration Pattern

Centralize footer configuration:

```typescript
// src/config/footer.ts
import type { FooterProps } from '@zoyth/simple-site-framework';

export const footerConfig: FooterProps = {
  companyName: 'Acme Corporation',
  tagline: 'Innovation through technology',
  sections: [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Support', href: '/support' },
      ],
    },
  ],
  socialLinks: [
    { platform: 'twitter', url: 'https://twitter.com/acmecorp' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/acmecorp' },
    { platform: 'github', url: 'https://github.com/acmecorp' },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

// Use in layout
import { footerConfig } from '@/config/footer';

<Footer {...footerConfig} />
```

## Best Practices

### ✅ Do

- Include essential links (About, Contact, Legal)
- Group related links in sections
- Make social icons easily identifiable
- Use descriptive link text
- Include copyright notice
- Link to privacy policy and terms
- Test keyboard navigation

### ❌ Don't

- Overcrowd with too many links
- Use tiny text (accessibility issue)
- Forget legal links (privacy, terms)
- Make social icons too small to click
- Hide important pages in footer only
- Use link text like "Click Here"
- Forget to update copyright year

## SEO

- Uses semantic `<footer>` tag
- Provides site structure for crawlers
- Links improve internal linking
- Copyright establishes ownership

### Structured Data

Add organization schema to footer:

```typescript
<Footer {...footerConfig}>
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Acme Corporation",
      "url": "https://acmecorp.com",
      "logo": "https://acmecorp.com/logo.svg",
      "sameAs": [
        "https://twitter.com/acmecorp",
        "https://linkedin.com/company/acmecorp"
      ]
    })}
  </script>
</Footer>
```

## Performance

- Server component by default (no JavaScript)
- Minimal CSS bundle
- Lazy-loaded social icons
- Optimized images if logo included

## Troubleshooting

### Links not working

**Check:**
1. `href` is provided for each link
2. Paths are correct
3. No typos in URLs
4. External links have proper `http://` or `https://`

### Social icons not displaying

**Check:**
1. Platform names are correct (lowercase)
2. URLs are valid
3. Icons are imported/available
4. CSS not hiding icons

### Copyright year wrong

**Check:**
1. Using auto-generated copyright (default)
2. Or provide custom copyright with current year
3. Server renders correct date

### Layout breaking on mobile

**Check:**
1. Using responsive grid classes
2. Text is wrapping properly
3. Icons are not too large
4. Adequate spacing between sections

## Related Components

- **[Header](./Header.md)** - Site header
- **[LanguageSelector](./LanguageSelector.md)** - Language switcher
- **[Button](../ui/Button.md)** - CTA buttons in footer

## API Reference

Full TypeScript definitions: **[API Reference](../../api/components.md#footer)**
