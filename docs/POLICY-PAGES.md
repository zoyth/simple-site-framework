

# Policy Pages Guide

Comprehensive guide for creating and managing policy and legal document pages using markdown files.

## Overview

Policy pages (privacy policies, terms of service, legal documents) are perfect candidates for markdown because they:

- ✅ Are primarily text-based content
- ✅ Change occasionally but not frequently
- ✅ Need to be readable and editable by non-technical people
- ✅ Benefit from clean version control
- ✅ Require proper SEO optimization
- ✅ Often exist in multiple languages

The framework provides components and utilities to transform markdown files into beautifully formatted, SEO-optimized policy pages with automatic table of contents and proper styling.

---

## Quick Start

### 1. Install Dependencies

```bash
npm install next-mdx-remote
npm install -D @tailwindcss/typography
```

### 2. Configure Tailwind Typography

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### 3. Create Policy Directory

```bash
mkdir -p src/content/policies
```

### 4. Create Markdown File

```markdown
<!-- src/content/policies/privacy-policy.en.md -->
---
title: "Privacy Policy"
lastUpdated: "2026-02-03"
description: "How we protect your personal data"
---

# Privacy Policy

Last updated: February 3, 2026

## 1. Information We Collect

We collect the following types of information...

## 2. How We Use Your Information

We use your information to...
```

### 5. Create Page Component

```typescript
// app/[locale]/privacy/page.tsx
import { loadPolicy } from 'simple-site-framework/lib/content';
import { PolicyLayout } from 'simple-site-framework';

export default async function PrivacyPage({
  params
}: {
  params: { locale: string }
}) {
  const { content, metadata } = await loadPolicy('privacy-policy', params.locale);

  return (
    <PolicyLayout
      title={metadata.title}
      lastUpdated={metadata.lastUpdated}
      locale={params.locale}
    >
      {content}
    </PolicyLayout>
  );
}

// Generate static pages for all locales
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' },
  ];
}

// SEO metadata
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { metadata } = await loadPolicy('privacy-policy', params.locale);

  return {
    title: metadata.title,
    description: metadata.description,
  };
}
```

---

## File Structure

### Recommended Directory Structure

```
project/
├── src/
│   ├── content/
│   │   └── policies/
│   │       ├── privacy-policy.en.md
│   │       ├── privacy-policy.fr.md
│   │       ├── terms-of-service.en.md
│   │       ├── terms-of-service.fr.md
│   │       ├── cookie-policy.en.md
│   │       ├── cookie-policy.fr.md
│   │       ├── dpa.en.md  # Data Processing Agreement
│   │       └── dpa.fr.md
│   └── app/
│       └── [locale]/
│           ├── privacy/
│           │   └── page.tsx
│           ├── terms/
│           │   └── page.tsx
│           └── cookies/
│               └── page.tsx
```

### File Naming Convention

**Format:** `{slug}.{locale}.md`

- **slug**: Kebab-case identifier (e.g., `privacy-policy`, `terms-of-service`)
- **locale**: Language code (e.g., `en`, `fr`, `es`, `en-US`)
- **extension**: `.md` for markdown, `.mdx` for MDX (markdown + components)

**Examples:**
- ✅ `privacy-policy.en.md`
- ✅ `terms-of-service.fr.md`
- ✅ `cookie-policy.en-US.mdx`
- ❌ `privacy_policy.md` (missing locale)
- ❌ `Privacy Policy.en.md` (spaces not allowed)

---

## Markdown Format

### Frontmatter (Required)

Every policy markdown file must start with YAML frontmatter:

```markdown
---
title: "Privacy Policy"
lastUpdated: "2026-02-03"
description: "How we protect your personal data"
---
```

**Required Fields:**
- `title` (string): Policy title displayed in header
- `lastUpdated` (string): ISO date or formatted date string

**Optional Fields:**
- `description` (string): SEO meta description
- Custom fields: Add any additional metadata

### Markdown Content

Use standard markdown syntax:

```markdown
# Main Heading (H1)

This is a paragraph with **bold text** and *italic text*.

## Section Heading (H2)

### Subsection (H3)

- Bullet point 1
- Bullet point 2
  - Nested bullet

1. Numbered item 1
2. Numbered item 2

[Link text](https://example.com)

> Blockquote for important notices

`Inline code` for technical terms

\```
Code block
\```

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### Heading Hierarchy Best Practices

- Use only ONE H1 (`#`) for the main title
- Use H2 (`##`) for main sections
- Use H3 (`###`) for subsections
- Use H4 (`####`) sparingly for sub-subsections
- Don't skip levels (H2 → H4 is bad)

**Good:**
```markdown
# Privacy Policy

## 1. Information We Collect

### 1.1 Account Information

### 1.2 Usage Data

## 2. How We Use Your Information
```

**Bad:**
```markdown
# Privacy Policy

#### 1. Information  ← Don't skip to H4
```

---

## Components

### PolicyLayout

Main layout component for policy pages.

```typescript
import { PolicyLayout } from 'simple-site-framework';

<PolicyLayout
  title={metadata.title}
  lastUpdated={metadata.lastUpdated}
  locale={locale}
  showToc={true}  // Optional, default: true
  contactText="Questions?"  // Optional
  contactHref="/contact"  // Optional
>
  {content}
</PolicyLayout>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | Required | Policy title |
| `lastUpdated` | string | Required | Last updated date |
| `locale` | string | Required | Locale for date formatting |
| `children` | ReactNode | Required | Policy content (from MDX) |
| `showToc` | boolean | `true` | Show table of contents |
| `contactText` | string | `"Questions about this policy?"` | Footer contact text |
| `contactHref` | string | `"/{locale}/contact"` | Footer contact link |
| `className` | string | - | Additional CSS classes |

### TableOfContents

Automatically generated navigation sidebar.

```typescript
import { TableOfContents } from 'simple-site-framework';

<TableOfContents
  title="On This Page"
  includeLevels={[2, 3]}
  containerSelector="article"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | `"Table of Contents"` | TOC heading |
| `includeLevels` | number[] | `[2, 3]` | Heading levels to include |
| `containerSelector` | string | `"article"` | CSS selector for content |
| `className` | string | - | Additional CSS classes |

**Features:**
- Auto-extracts headings from page
- Smooth scroll to sections
- Scroll spy (highlights current section)
- Sticky positioning
- Responsive (collapses on mobile)

---

## Utility Functions

### loadPolicy()

Load and compile a policy markdown file.

```typescript
import { loadPolicy } from 'simple-site-framework/lib/content';

const { content, metadata, slug, locale } = await loadPolicy(
  'privacy-policy',  // slug
  'en',             // locale
  'src/content/policies'  // optional: custom directory
);
```

**Parameters:**
- `slug` (string): Policy slug (filename without locale/extension)
- `locale` (string): Locale code
- `contentDir` (string, optional): Custom directory path, default: `'src/content/policies'`

**Returns:**
```typescript
{
  content: React.ReactElement,  // Compiled MDX content
  metadata: PolicyMetadata,      // Frontmatter data
  slug: string,                  // Policy slug
  locale: string                 // Locale
}
```

**Throws:**
- Error if file not found
- Error if required frontmatter missing

---

### getPolicySlugs()

Get all available policy slugs.

```typescript
import { getPolicySlugs } from 'simple-site-framework/lib/content';

const slugs = getPolicySlugs();
// Returns: ['privacy-policy', 'terms-of-service', 'cookie-policy']
```

**Use case:** Generate static paths for all policies

```typescript
export async function generateStaticParams() {
  const slugs = getPolicySlugs();
  const locales = ['en', 'fr'];

  return slugs.flatMap(slug =>
    locales.map(locale => ({ slug, locale }))
  );
}
```

---

### getAllPolicies()

Get metadata for all policies in a specific locale.

```typescript
import { getAllPolicies } from 'simple-site-framework/lib/content';

const policies = await getAllPolicies('en');

// Returns array of:
// [
//   { slug: 'privacy-policy', locale: 'en', metadata: {...} },
//   { slug: 'terms-of-service', locale: 'en', metadata: {...} }
// ]
```

**Use case:** Generate policy index page

```typescript
export default async function PoliciesPage({ params }) {
  const policies = await getAllPolicies(params.locale);

  return (
    <ul>
      {policies.map(policy => (
        <li key={policy.slug}>
          <Link href={`/${params.locale}/policies/${policy.slug}`}>
            {policy.metadata.title}
          </Link>
          <p>{policy.metadata.description}</p>
        </li>
      ))}
    </ul>
  );
}
```

---

### getPolicyLocales()

Get available locales for a specific policy.

```typescript
import { getPolicyLocales } from 'simple-site-framework/lib/content';

const locales = getPolicyLocales('privacy-policy');
// Returns: ['en', 'fr', 'es']
```

**Use case:** Generate language switcher for policy pages

---

## Multi-Language Support

### Creating Translations

Create one markdown file per language:

```
src/content/policies/
├── privacy-policy.en.md
├── privacy-policy.fr.md
├── privacy-policy.es.md
└── privacy-policy.de.md
```

### Language Switcher

```typescript
import { getPolicyLocales } from 'simple-site-framework/lib/content';
import { LanguageSelector } from 'simple-site-framework';

export default async function PolicyPage({ params }) {
  const availableLocales = getPolicyLocales(params.slug);

  return (
    <>
      <LanguageSelector
        currentLocale={params.locale}
        availableLocales={availableLocales}  // Only show available translations
      />
      {/* Policy content */}
    </>
  );
}
```

### Handling Missing Translations

```typescript
import { loadPolicy } from 'simple-site-framework/lib/content';
import { notFound } from 'next/navigation';

export default async function PolicyPage({ params }) {
  try {
    const policy = await loadPolicy(params.slug, params.locale);
    return <PolicyLayout {...policy} />;
  } catch (error) {
    // Policy doesn't exist for this locale
    notFound();
  }
}
```

---

## SEO Optimization

### Meta Tags

```typescript
export async function generateMetadata({ params }) {
  const { metadata } = await loadPolicy(params.slug, params.locale);

  return {
    title: `${metadata.title} | Your Company`,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
    },
  };
}
```

### Canonical URLs

```typescript
export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://example.com/${params.locale}/${params.slug}`,
      languages: {
        'en': `https://example.com/en/${params.slug}`,
        'fr': `https://example.com/fr/${params.slug}`,
      },
    },
  };
}
```

### Indexing

Policy pages SHOULD be indexed (unlike some other legal pages):

```typescript
export async function generateMetadata() {
  return {
    robots: {
      index: true,  // Allow indexing
      follow: true,
    },
  };
}
```

---

## Styling

### Tailwind Typography

The framework uses `@tailwindcss/typography` for automatic markdown styling.

**Included styles:**
- Headings (h1-h6) with proper sizing and spacing
- Paragraphs with optimal line height
- Lists (ul, ol) with proper indentation
- Links with hover states
- Blockquotes with border and background
- Code blocks with syntax highlighting
- Tables with borders and alternating rows

### Customization

Override prose styles in PolicyLayout or globally:

```typescript
<div className="prose prose-lg prose-primary">
  {/* Custom prose theme */}
</div>
```

**Available modifiers:**
- `prose-sm`, `prose-base`, `prose-lg`, `prose-xl`, `prose-2xl` - Size
- `prose-gray`, `prose-blue`, `prose-green` - Color theme
- `prose-headings:text-primary` - Custom heading color
- `prose-a:text-blue-600` - Custom link color

---

## Advanced: MDX Components

Use `.mdx` extension to embed React components in markdown.

### Example MDX File

```mdx
---
title: "Privacy Policy"
lastUpdated: "2026-02-03"
---

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

# Privacy Policy

<Alert variant="info">
  This policy was last updated on {frontmatter.lastUpdated}
</Alert>

## 1. Information We Collect

We collect the following types of information...

<Button href="/contact">Contact Us About Privacy</Button>
```

### When to Use MDX

- Need to embed interactive components
- Want custom alerts or callouts
- Need tables with custom styling
- Want to include forms or calculators
- Need dynamic content based on frontmatter

### When to Use Plain Markdown

- Pure text content (most policies)
- Simplicity is important
- Non-technical editors will maintain content
- No interactive elements needed

---

## Performance

### Static Generation (SSG)

Policy pages use Next.js static generation for optimal performance:

**Benefits:**
- ⚡ Instant page loads (served from CDN)
- 🔍 Perfect SEO (pre-rendered HTML)
- 💰 Low server costs (no compute per request)
- 📱 Excellent mobile performance

**Build time:**
```bash
npm run build
# Generates static HTML for all policy pages
# app/[locale]/privacy/page.tsx → /en/privacy/index.html
```

### Bundle Size

Markdown content is NOT included in JavaScript bundle:

- Content compiled to HTML at build time
- Only layout components in client bundle
- ~5-10KB additional JavaScript
- 0KB content overhead (it's in HTML)

---

## Testing

### Test Checklist

- [ ] Markdown renders correctly
- [ ] Frontmatter parsed properly
- [ ] Table of contents generated
- [ ] TOC scroll spy works
- [ ] Smooth scrolling to sections
- [ ] Mobile responsive layout
- [ ] All locales load correctly
- [ ] SEO meta tags present
- [ ] Last updated date formatted correctly
- [ ] Contact link works
- [ ] Heading hierarchy is valid
- [ ] No broken links
- [ ] Code blocks render properly
- [ ] Tables display correctly

### Manual Testing

```bash
# Start dev server
npm run dev

# Visit policy pages
http://localhost:3000/en/privacy
http://localhost:3000/fr/privacy

# Check table of contents
# - Click TOC links → smooth scroll
# - Scroll page → TOC highlights active section

# Test mobile
# - TOC should hide on small screens
# - Content should be readable
# - No horizontal scroll
```

---

## Common Patterns

### Policy Index Page

```typescript
// app/[locale]/policies/page.tsx
import { getAllPolicies } from 'simple-site-framework/lib/content';

export default async function PoliciesPage({ params }) {
  const policies = await getAllPolicies(params.locale);

  return (
    <div>
      <h1>Legal Documents</h1>
      <ul>
        {policies.map(policy => (
          <li key={policy.slug}>
            <Link href={`/${params.locale}/policies/${policy.slug}`}>
              <h3>{policy.metadata.title}</h3>
              <p>{policy.metadata.description}</p>
              <time>Updated: {policy.metadata.lastUpdated}</time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Dynamic Policy Routes

```typescript
// app/[locale]/policies/[slug]/page.tsx
import { loadPolicy, getPolicySlugs } from 'simple-site-framework/lib/content';
import { PolicyLayout } from 'simple-site-framework';
import { notFound } from 'next/navigation';

export default async function PolicyPage({ params }) {
  try {
    const { content, metadata } = await loadPolicy(params.slug, params.locale);

    return (
      <PolicyLayout
        title={metadata.title}
        lastUpdated={metadata.lastUpdated}
        locale={params.locale}
      >
        {content}
      </PolicyLayout>
    );
  } catch {
    notFound();
  }
}

export async function generateStaticParams() {
  const slugs = getPolicySlugs();
  const locales = ['en', 'fr'];

  return slugs.flatMap(slug =>
    locales.map(locale => ({ slug, locale }))
  );
}
```

---

## Best Practices

### Content

✅ **DO:**
- Write in clear, plain language
- Use descriptive section headings
- Include "Last updated" date
- Provide contact information
- Link to related policies
- Use bullet points for lists
- Keep paragraphs short (3-4 sentences)

❌ **DON'T:**
- Use overly legal jargon
- Create walls of text
- Skip heading levels
- Forget to update date when editing
- Mix multiple policies in one file

### Structure

✅ **DO:**
- Use consistent heading hierarchy
- Create logical sections
- Include table of contents
- Add introduction/overview
- Provide contact section at end

❌ **DON'T:**
- Use more than 3-4 heading levels
- Create sections with only one subsection
- Nest lists too deeply

### Maintenance

✅ **DO:**
- Version control all changes
- Review policies annually
- Update "lastUpdated" date
- Get legal review before publishing
- Test all locales after updates

❌ **DON'T:**
- Edit directly in production
- Forget to update translations
- Leave outdated information

---

## Troubleshooting

### "Policy file not found"

**Error:** `Policy file not found: privacy-policy.en.md`

**Solution:**
1. Check file exists: `src/content/policies/privacy-policy.en.md`
2. Verify filename format: `{slug}.{locale}.md`
3. Check file extension: `.md` or `.mdx`
4. Verify contentDir path if custom

### "Missing required frontmatter"

**Error:** `Policy privacy-policy.en.md is missing required frontmatter field: title`

**Solution:**
1. Add frontmatter at top of file:
```markdown
---
title: "Your Title"
lastUpdated: "2026-02-03"
---
```
2. Ensure proper YAML format (quotes, colons)
3. Check for typos in field names

### Table of Contents not showing

**Solutions:**
1. Ensure headings use proper markdown (`##`, `###`)
2. Check `showToc={true}` in PolicyLayout
3. Verify at least one H2 or H3 exists
4. Check `includeLevels` matches heading levels

### Styling not applied

**Solutions:**
1. Install Tailwind Typography: `npm install -D @tailwindcss/typography`
2. Add to tailwind.config.js: `plugins: [require('@tailwindcss/typography')]`
3. Restart dev server after config changes

---

## Examples

See complete examples in:
- `examples/policies/privacy-policy.en.md`
- `examples/policies/terms-of-service.en.md`
- `examples/app/[locale]/policies/` (page components)

---

## Resources

- [Tailwind Typography Docs](https://tailwindcss.com/docs/typography-plugin)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [Markdown Guide](https://www.markdownguide.org/)
- [YAML Frontmatter Spec](https://jekyllrb.com/docs/front-matter/)

---

**Questions?** Open an issue on GitHub or contact us.
