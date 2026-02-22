# BlogLayout

Layout component for rendering individual blog post pages. Provides a structured header with author info, publication date, read time, and tags, an optional featured image, Tailwind prose-styled content area, and an optional table of contents sidebar.

## Import

```typescript
import { BlogLayout } from '@zoyth/simple-site-framework';
```

**Type:** Client Component (`'use client'`)

## Basic Usage

```typescript
<BlogLayout
  title="How to Build Fast Websites"
  excerpt="A guide to modern web performance optimization."
  author="Jane Doe"
  date="2024-06-15"
  readTime={8}
  tags={['performance', 'web']}
  locale="en"
>
  <h2>Introduction</h2>
  <p>Web performance matters more than ever...</p>
</BlogLayout>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Blog post title, rendered as an `<h1>` |
| `excerpt` | `string` | Short description for SEO purposes |
| `author` | `string` | Author display name |
| `date` | `string` | Publication date as ISO string (`YYYY-MM-DD`) |
| `readTime` | `number` | Estimated reading time in minutes |
| `tags` | `string[]` | Post tags displayed as rounded badges |
| `locale` | `string` | Current locale (e.g., `'en'` or `'fr'`). Controls date formatting and localized labels |
| `children` | `ReactNode` | Blog post content (typically compiled MDX) |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `authorAvatar` | `string` | - | URL to the author's avatar image |
| `image` | `string` | - | Featured image URL displayed below the header |
| `imageAlt` | `string` | Value of `title` | Alt text for the featured image |
| `showToc` | `boolean` | `true` | Show the table of contents sidebar on large screens |
| `backHref` | `string` | `'/{locale}/blog'` | URL for the back-to-blog link |
| `backLabel` | `string` | `'Back to blog'` / `'Retour au blog'` | Label for the back link (auto-localized if omitted) |
| `className` | `string` | - | Additional CSS classes on the outer `<article>` |

## Localization

The component automatically adapts several labels based on the `locale` prop:

| Element | English (`'en'`) | French (`'fr'`) |
|---------|-------------------|------------------|
| Back link | "Back to blog" | "Retour au blog" |
| Read time | "8 min read" | "8 min de lecture" |
| TOC title | "Table of Contents" | "Table des matieres" |
| Date format | "June 15, 2024" | "15 juin 2024" |

## Examples

### Full Post with All Options

```typescript
<BlogLayout
  title="Optimizing React Performance"
  excerpt="Practical tips for faster React applications."
  author="Jane Doe"
  authorAvatar="/authors/jane.jpg"
  date="2024-06-15"
  readTime={12}
  tags={['react', 'performance', 'javascript']}
  image="/blog/react-perf-hero.jpg"
  imageAlt="Chart showing React render improvements"
  locale="en"
  showToc={true}
>
  <h2 id="introduction">Introduction</h2>
  <p>React performance optimization starts with understanding renders...</p>

  <h2 id="profiling">Profiling Your App</h2>
  <p>Use React DevTools Profiler to identify bottlenecks...</p>
</BlogLayout>
```

### French Locale

```typescript
<BlogLayout
  title="Optimiser les performances React"
  excerpt="Conseils pratiques pour des applications React plus rapides."
  author="Jean Dupont"
  authorAvatar="/authors/jean.jpg"
  date="2024-06-15"
  readTime={12}
  tags={['react', 'performance']}
  locale="fr"
>
  <h2>Introduction</h2>
  <p>L'optimisation des performances React commence par...</p>
</BlogLayout>
```

The back link renders as "Retour au blog", the read time as "12 min de lecture", the TOC heading as "Table des matieres", and the date as "15 juin 2024".

### Without Table of Contents

```typescript
<BlogLayout
  title="Quick Tip: CSS Grid"
  excerpt="A short tip about CSS Grid layouts."
  author="Jane Doe"
  date="2024-03-10"
  readTime={3}
  tags={['css']}
  locale="en"
  showToc={false}
>
  <p>Here is a quick CSS Grid trick...</p>
</BlogLayout>
```

The content area expands to use the full width when the TOC sidebar is hidden.

### Custom Back Link

```typescript
<BlogLayout
  title="Company News: Q2 Update"
  excerpt="Our quarterly business update."
  author="CEO"
  date="2024-07-01"
  readTime={5}
  tags={['news']}
  locale="en"
  backHref="/en/news"
  backLabel="Back to News"
>
  <p>We are pleased to announce...</p>
</BlogLayout>
```

### With MDX Content (Next.js)

```typescript
import { loadBlogPost } from '@zoyth/simple-site-framework';

export default async function BlogPostPage({ params }) {
  const post = await loadBlogPost(params.slug, params.locale);

  return (
    <BlogLayout
      title={post.metadata.title}
      excerpt={post.metadata.excerpt}
      author={post.metadata.author}
      date={post.metadata.date}
      readTime={post.metadata.readTime}
      tags={post.metadata.tags}
      image={post.metadata.image}
      imageAlt={post.metadata.imageAlt}
      locale={params.locale}
    >
      {post.content}
    </BlogLayout>
  );
}
```

## Layout Structure

The component renders the following structure:

```
<article>
  Back link
  <header>
    <h1>Title</h1>
    Author avatar + name | Date | Read time
    Tag badges
  </header>
  Featured image (if provided)
  <div flex row>
    <aside>Table of Contents (lg screens, if showToc)</aside>
    <div>Prose-styled content (children)</div>
  </div>
</article>
```

- The TOC sidebar is hidden on screens smaller than `lg` (1024px).
- The TOC is sticky, staying visible as the user scrolls through the content.
- Headings use `scroll-mt-24` to offset for fixed headers when navigating via TOC links.

## Prose Styling

The content area uses Tailwind Typography (`prose`) classes with customizations:

- Links use the primary theme color with underline on hover
- Code blocks have a dark background (`gray-900`) with light text
- Blockquotes have a primary-colored left border with a light background
- Headings have appropriate margin spacing and scroll margin for TOC navigation

## Accessibility

- Semantic `<article>` element wrapping the post
- `<header>` element for post metadata
- `<time>` element with `dateTime` attribute for the publication date
- Decorative separators use `aria-hidden="true"`
- Author avatar includes meaningful alt text (the author's name)

## See Also

- **[BlogIndex](./BlogIndex.md)** - Blog listing page that links to individual posts
- **[BlogCard](./BlogCard.md)** - Post preview card used in listings
- **[TableOfContents](./TableOfContents.md)** - Standalone TOC component used in the sidebar
