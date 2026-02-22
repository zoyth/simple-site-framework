

# Blog System Guide

Comprehensive guide for creating and managing a blog using markdown files with full SEO, RSS, filtering, and bilingual support.

## Overview

The blog system provides everything needed to run a production blog:

- ✅ Markdown-based content with rich frontmatter
- ✅ Pre-built components for layout, index, and cards
- ✅ Tag-based filtering and featured posts
- ✅ Related posts by shared tags
- ✅ RSS 2.0 feed generation
- ✅ Article-specific SEO metadata and JSON-LD structured data
- ✅ Multi-language support (EN/FR)
- ✅ Static generation for optimal performance

---

## Quick Start

### 1. Install Dependencies

```bash
npm install next-mdx-remote
npm install -D @tailwindcss/typography
```

### 2. Create Blog Directory

```bash
mkdir -p src/content/blog
```

### 3. Write a Blog Post

```markdown
<!-- src/content/blog/hello-world.en.md -->
---
title: "Hello World"
excerpt: "Our very first blog post"
author: "Jane Doe"
date: "2026-02-20"
readTime: 3
tags: ["announcements"]
---

# Hello World

Welcome to our blog! This is our first post.

## What We'll Cover

We'll be writing about product updates, tips, and industry insights.
```

### 4. Create Blog Pages

```typescript
// app/[locale]/blog/page.tsx
import { getAllBlogPosts } from 'simple-site-framework/lib/content';
import { BlogIndex } from 'simple-site-framework';

export default async function BlogPage({
  params
}: {
  params: { locale: string }
}) {
  const posts = await getAllBlogPosts(params.locale);

  return (
    <BlogIndex
      locale={params.locale}
      posts={posts}
      title="Blog"
    />
  );
}
```

---

## Content Format

### Frontmatter Fields

Every blog post markdown file must start with YAML frontmatter:

```markdown
---
title: "Your Post Title"
excerpt: "A short description for previews and SEO"
author: "Author Name"
date: "2026-02-20"
readTime: 5
tags: ["product", "tips"]
featured: true
image: "/blog/post-image.jpg"
imageAlt: "Description of the image"
---
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Post title displayed in header and cards |
| `excerpt` | string | Short description for previews and meta description |
| `author` | string | Author name |
| `date` | string | Publication date in ISO format (YYYY-MM-DD) |
| `tags` | string[] | Array of tag strings for categorization |

**Optional Fields:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `readTime` | number | - | Reading time in minutes |
| `featured` | boolean | `false` | Mark as featured post |
| `image` | string | - | Featured image URL |
| `imageAlt` | string | title | Alt text for featured image |

Custom fields can be added and accessed via `metadata[key]`.

### File Naming Convention

**Format:** `{slug}.{locale}.md`

- **slug**: Kebab-case identifier (e.g., `getting-started`, `product-update-q1`)
- **locale**: Language code (e.g., `en`, `fr`, `en-US`)
- **extension**: `.md` for markdown, `.mdx` for MDX

**Examples:**
- ✅ `getting-started.en.md`
- ✅ `getting-started.fr.md`
- ✅ `product-update.en-US.mdx`
- ❌ `getting_started.md` (missing locale)
- ❌ `Getting Started.en.md` (spaces not allowed)

### Directory Structure

```
project/
├── src/
│   ├── content/
│   │   └── blog/
│   │       ├── getting-started.en.md
│   │       ├── getting-started.fr.md
│   │       ├── product-update.en.md
│   │       ├── product-update.fr.md
│   │       ├── tips-and-tricks.en.md
│   │       └── tips-and-tricks.fr.md
│   └── app/
│       └── [locale]/
│           └── blog/
│               ├── page.tsx          # Blog index
│               ├── [slug]/
│               │   └── page.tsx      # Individual post
│               └── feed.xml/
│                   └── route.ts      # RSS feed
```

---

## Loading Functions

### loadBlogPost()

Load and compile a single blog post markdown file.

```typescript
import { loadBlogPost } from 'simple-site-framework/lib/content';

const { content, metadata, slug, locale } = await loadBlogPost(
  'getting-started',  // slug
  'en',               // locale
  'src/content/blog'  // optional: custom directory
);
```

**Parameters:**
- `slug` (string): Blog post slug (filename without locale/extension)
- `locale` (string): Locale code
- `contentDir` (string, optional): Custom directory path, default: `'src/content/blog'`

**Returns:**
```typescript
{
  content: JSX.Element,         // Compiled MDX content
  metadata: BlogPostMetadata,   // Frontmatter data
  slug: string,                 // Post slug
  locale: string                // Locale
}
```

**Throws:**
- Error if file not found
- Error if required frontmatter field missing (`title`, `excerpt`, `author`, `date`, `tags`)

---

### getBlogPostSlugs()

Get all unique blog post slugs (deduplicated across locales).

```typescript
import { getBlogPostSlugs } from 'simple-site-framework/lib/content';

const slugs = getBlogPostSlugs();
// Returns: ['getting-started', 'product-update', 'tips-and-tricks']
```

**Parameters:**
- `contentDir` (string, optional): Custom directory path, default: `'src/content/blog'`

**Returns:** `string[]` - Array of unique slugs. Returns empty array if directory not found.

---

### getAllBlogPosts()

Get all blog posts for a locale with metadata, sorted by date descending.

```typescript
import { getAllBlogPosts } from 'simple-site-framework/lib/content';

const posts = await getAllBlogPosts('en');

// Returns array of:
// [
//   { slug: 'product-update', locale: 'en', metadata: {...} },
//   { slug: 'getting-started', locale: 'en', metadata: {...} }
// ]
```

**Parameters:**
- `locale` (string): Locale code
- `contentDir` (string, optional): Custom directory path

**Returns:** `Omit<BlogPost, 'content'>[]` - Posts sorted by date descending. Posts that fail to load for the given locale are silently skipped.

---

### getBlogPostLocales()

Get available locales for a specific blog post.

```typescript
import { getBlogPostLocales } from 'simple-site-framework/lib/content';

const locales = getBlogPostLocales('getting-started');
// Returns: ['en', 'fr']
```

**Parameters:**
- `slug` (string): Blog post slug
- `contentDir` (string, optional): Custom directory path

**Returns:** `string[]` - Array of locale codes

---

## Filtering and Sorting

### getBlogPostsByTag()

Get all blog posts matching a specific tag, sorted by date descending.

```typescript
import { getBlogPostsByTag } from 'simple-site-framework/lib/content';

const posts = await getBlogPostsByTag('product', 'en');
```

**Parameters:**
- `tag` (string): Tag to filter by (exact match)
- `locale` (string): Locale code
- `contentDir` (string, optional): Custom directory path

**Returns:** `Omit<BlogPost, 'content'>[]`

---

### getFeaturedBlogPosts()

Get posts marked as featured, sorted by date descending.

```typescript
import { getFeaturedBlogPosts } from 'simple-site-framework/lib/content';

const featured = await getFeaturedBlogPosts('en');
```

**Parameters:**
- `locale` (string): Locale code
- `contentDir` (string, optional): Custom directory path

**Returns:** `Omit<BlogPost, 'content'>[]` - Posts where `metadata.featured === true`

---

### getRelatedBlogPosts()

Get posts related to a given post by shared tags. Sorted by number of shared tags (descending), then by date (descending).

```typescript
import { getRelatedBlogPosts } from 'simple-site-framework/lib/content';

const related = await getRelatedBlogPosts(
  'getting-started',  // source post slug
  'en',               // locale
  3                    // max results (default: 3)
);
```

**Parameters:**
- `slug` (string): Source blog post slug
- `locale` (string): Locale code
- `count` (number, optional): Maximum results, default: `3`
- `contentDir` (string, optional): Custom directory path

**Returns:** `Omit<BlogPost, 'content'>[]` - Only posts with at least one shared tag. Returns empty array if source post not found.

---

### getAllTags()

Get all unique tags across all blog posts with occurrence counts, sorted by count descending.

```typescript
import { getAllTags } from 'simple-site-framework/lib/content';
import type { TagCount } from 'simple-site-framework/lib/content';

const tags: TagCount[] = await getAllTags('en');
// Returns: [
//   { tag: 'product', count: 5 },
//   { tag: 'tips', count: 3 },
//   { tag: 'announcements', count: 1 }
// ]
```

**TagCount type:**
```typescript
interface TagCount {
  tag: string;
  count: number;
}
```

---

## Components

### BlogLayout

Layout component for rendering individual blog post pages. Provides header with author/date/tags, featured image, prose-styled content, and optional table of contents sidebar.

```typescript
import { BlogLayout } from 'simple-site-framework';

<BlogLayout
  title={metadata.title}
  excerpt={metadata.excerpt}
  author={metadata.author}
  date={metadata.date}
  readTime={metadata.readTime}
  tags={metadata.tags}
  image={metadata.image}
  imageAlt={metadata.imageAlt}
  locale={locale}
  showToc={true}
>
  {content}
</BlogLayout>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | Required | Post title |
| `excerpt` | string | Required | Short description |
| `author` | string | Required | Author name |
| `date` | string | Required | Publication date (ISO YYYY-MM-DD) |
| `readTime` | number | Required | Reading time in minutes |
| `tags` | string[] | Required | Post tags |
| `locale` | string | Required | Current locale |
| `children` | ReactNode | Required | Post content (from MDX) |
| `authorAvatar` | string | - | Author avatar URL |
| `image` | string | - | Featured image URL |
| `imageAlt` | string | title | Featured image alt text |
| `showToc` | boolean | `true` | Show table of contents sidebar |
| `backHref` | string | `"/{locale}/blog"` | Back link URL |
| `backLabel` | string | `"Back to blog"` / `"Retour au blog"` | Back link label |
| `className` | string | - | Additional CSS classes |

---

### BlogIndex

Blog listing page component with tag filtering and responsive grid. Renders posts using BlogCard with optional featured section and tag filter bar.

```typescript
import { BlogIndex } from 'simple-site-framework';

<BlogIndex
  locale={locale}
  posts={posts}
  title="Blog"
  description="Latest articles and updates"
  showTagFilter={true}
  cardVariant="default"
  featuredFirst={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locale` | string | Required | Current locale |
| `posts` | Array<{ slug, metadata }> | Required | Blog posts to display |
| `title` | LocalizedString \| string | - | Page title |
| `description` | LocalizedString \| string | - | Page description |
| `showTagFilter` | boolean | `true` | Show tag filter bar |
| `cardVariant` | `'default'` \| `'horizontal'` \| `'minimal'` | `'default'` | BlogCard display variant |
| `featuredFirst` | boolean | `true` | Show featured posts prominently |
| `className` | string | - | Additional CSS classes |

**Features:**
- Client-side tag filtering via clickable tag buttons
- Featured posts displayed in a 2-column grid above regular posts
- Regular posts in a 3-column responsive grid
- Empty state message when no posts match filter
- Automatic locale-aware labels (EN/FR)

---

### BlogCard

Article preview card for blog listings. Supports three display variants.

```typescript
import { BlogCard } from 'simple-site-framework';

<BlogCard
  locale="en"
  title="10 Tips for Better UX"
  excerpt="Improve your user experience with these strategies..."
  image="/blog/ux-tips.jpg"
  href="/en/blog/ux-tips"
  author="Jane Doe"
  date="2026-02-20"
  readTime={5}
  tags={['UX', 'Design']}
  variant="default"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locale` | `'en'` \| `'fr'` | `'en'` | Current locale |
| `title` | LocalizedString \| string | Required | Article title |
| `excerpt` | LocalizedString \| string | - | Article excerpt |
| `image` | string | - | Featured image URL |
| `imageAlt` | string | title | Image alt text |
| `href` | string | Required | Article URL |
| `author` | string | - | Author name |
| `authorAvatar` | string | - | Author avatar URL |
| `date` | string | - | Publication date |
| `readTime` | number | - | Read time in minutes |
| `tags` | string[] | - | Tags/categories |
| `variant` | `'default'` \| `'horizontal'` \| `'minimal'` | `'default'` | Card display variant |
| `className` | string | - | Additional CSS classes |

**Variants:**
- **default** - Vertical card with image on top, tags overlaid on image
- **horizontal** - Side-by-side image and content layout
- **minimal** - Text-only with border-bottom, single tag badge

---

## Route Setup

### Blog Index Page

```typescript
// app/[locale]/blog/page.tsx
import { getAllBlogPosts } from 'simple-site-framework/lib/content';
import { BlogIndex } from 'simple-site-framework';

export default async function BlogPage({
  params
}: {
  params: { locale: string }
}) {
  const posts = await getAllBlogPosts(params.locale);

  return (
    <BlogIndex
      locale={params.locale}
      posts={posts}
      title={{ en: 'Blog', fr: 'Blogue' }}
      description={{
        en: 'Latest articles and updates',
        fr: 'Derniers articles et mises à jour'
      }}
    />
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' },
  ];
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const isFr = params.locale === 'fr';
  return {
    title: isFr ? 'Blogue' : 'Blog',
    description: isFr
      ? 'Derniers articles et mises à jour'
      : 'Latest articles and updates',
  };
}
```

### Blog Post Page

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { loadBlogPost, getBlogPostSlugs, getRelatedBlogPosts } from 'simple-site-framework/lib/content';
import { BlogLayout, BlogCard } from 'simple-site-framework';
import { generateArticleMetadata } from 'simple-site-framework';
import { createArticle, createOrganization, serializeStructuredData } from 'simple-site-framework';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function BlogPostPage({
  params
}: {
  params: { locale: string; slug: string }
}) {
  let post;
  try {
    post = await loadBlogPost(params.slug, params.locale);
  } catch {
    notFound();
  }

  const related = await getRelatedBlogPosts(params.slug, params.locale);

  // JSON-LD structured data
  const publisher = createOrganization({
    name: 'Your Company',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
  });

  const articleData = createArticle({
    headline: post.metadata.title,
    description: post.metadata.excerpt,
    image: post.metadata.image,
    author: { '@type': 'Person', name: post.metadata.author },
    publisher,
    datePublished: `${post.metadata.date}T00:00:00Z`,
    mainEntityOfPage: `https://example.com/${params.locale}/blog/${params.slug}`,
    type: 'BlogPosting',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(articleData) }}
      />

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

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">
            {params.locale === 'fr' ? 'Articles connexes' : 'Related Posts'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <BlogCard
                key={r.slug}
                locale={params.locale as 'en' | 'fr'}
                title={r.metadata.title}
                excerpt={r.metadata.excerpt}
                image={r.metadata.image}
                href={`/${params.locale}/blog/${r.slug}`}
                author={r.metadata.author}
                date={r.metadata.date}
                readTime={r.metadata.readTime}
                tags={r.metadata.tags}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export async function generateStaticParams() {
  const slugs = getBlogPostSlugs();
  const locales = ['en', 'fr'];

  return slugs.flatMap(slug =>
    locales.map(locale => ({ slug, locale }))
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  try {
    const { metadata } = await loadBlogPost(params.slug, params.locale);

    return generateArticleMetadata({
      title: metadata.title,
      description: metadata.excerpt,
      image: metadata.image,
      publishedTime: `${metadata.date}T00:00:00Z`,
      author: metadata.author,
      tags: metadata.tags,
      url: `https://example.com/${params.locale}/blog/${params.slug}`,
      siteName: 'Your Company',
    });
  } catch {
    return { title: 'Not Found' };
  }
}
```

### RSS Feed Route

```typescript
// app/[locale]/blog/feed.xml/route.ts
import { generateBlogRssFeed } from 'simple-site-framework/lib/content';

export async function GET(
  request: Request,
  { params }: { params: { locale: string } }
) {
  const feed = await generateBlogRssFeed({
    siteUrl: 'https://example.com',
    siteName: 'Your Company',
    description: {
      en: 'Latest articles and updates',
      fr: 'Derniers articles et mises à jour',
    },
    locale: params.locale,
  });

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

The RSS feed returns up to 20 most recent posts. Link to it from your layout:

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="Blog RSS Feed"
  href="/en/blog/feed.xml"
/>
```

---

## SEO

### Article Metadata

Use `generateArticleMetadata()` for blog post pages. It generates Open Graph `type: 'article'` with publication metadata and Twitter Card tags.

```typescript
import { generateArticleMetadata } from 'simple-site-framework';

export async function generateMetadata({ params }) {
  const { metadata } = await loadBlogPost(params.slug, params.locale);

  return generateArticleMetadata({
    title: metadata.title,
    description: metadata.excerpt,
    image: metadata.image,
    publishedTime: `${metadata.date}T00:00:00Z`,
    author: metadata.author,
    tags: metadata.tags,
    url: `https://example.com/${params.locale}/blog/${params.slug}`,
    siteName: 'Your Company',
    twitterSite: 'yourcompany',
  });
}
```

### JSON-LD Structured Data

Use `createArticle()` for rich search results (Google, Bing):

```typescript
import {
  createArticle,
  createOrganization,
  serializeStructuredData
} from 'simple-site-framework';

const publisher = createOrganization({
  name: 'Your Company',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
});

const article = createArticle({
  headline: metadata.title,
  description: metadata.excerpt,
  image: metadata.image,
  author: { '@type': 'Person', name: metadata.author },
  publisher,
  datePublished: `${metadata.date}T00:00:00Z`,
  mainEntityOfPage: `https://example.com/${locale}/blog/${slug}`,
  type: 'BlogPosting',
});

// Render in page
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: serializeStructuredData(article) }}
/>
```

---

## Filtering

### Tag-Based Filtering

The `BlogIndex` component provides client-side tag filtering out of the box. For server-side tag pages:

```typescript
// app/[locale]/blog/tag/[tag]/page.tsx
import { getBlogPostsByTag, getAllTags } from 'simple-site-framework/lib/content';
import { BlogIndex } from 'simple-site-framework';

export default async function TagPage({
  params
}: {
  params: { locale: string; tag: string }
}) {
  const posts = await getBlogPostsByTag(decodeURIComponent(params.tag), params.locale);

  return (
    <BlogIndex
      locale={params.locale}
      posts={posts}
      title={`#${decodeURIComponent(params.tag)}`}
      showTagFilter={false}
    />
  );
}

export async function generateStaticParams() {
  const locales = ['en', 'fr'];
  const params = [];

  for (const locale of locales) {
    const tags = await getAllTags(locale);
    for (const { tag } of tags) {
      params.push({ locale, tag });
    }
  }

  return params;
}
```

### Featured Posts

Display featured posts on the homepage or in a sidebar:

```typescript
import { getFeaturedBlogPosts } from 'simple-site-framework/lib/content';
import { BlogCard } from 'simple-site-framework';

export default async function HomePage({ params }) {
  const featured = await getFeaturedBlogPosts(params.locale);

  return (
    <section>
      <h2>Featured Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featured.map((post) => (
          <BlogCard
            key={post.slug}
            locale={params.locale as 'en' | 'fr'}
            title={post.metadata.title}
            excerpt={post.metadata.excerpt}
            image={post.metadata.image}
            href={`/${params.locale}/blog/${post.slug}`}
            author={post.metadata.author}
            date={post.metadata.date}
            readTime={post.metadata.readTime}
            tags={post.metadata.tags}
          />
        ))}
      </div>
    </section>
  );
}
```

### Related Posts

Show related posts at the bottom of a blog post page (see the full example in [Route Setup > Blog Post Page](#blog-post-page)).

```typescript
import { getRelatedBlogPosts } from 'simple-site-framework/lib/content';

// Get up to 3 related posts based on shared tags
const related = await getRelatedBlogPosts(slug, locale, 3);
```

---

## Sitemap Integration

Add blog posts to your sitemap using `createMultiLanguageEntries()`:

```typescript
// app/sitemap.ts
import { getAllBlogPosts, getBlogPostLocales } from 'simple-site-framework/lib/content';
import { createMultiLanguageEntries, generateSitemap } from 'simple-site-framework';
import type { SitemapEntry } from 'simple-site-framework';

export default async function sitemap() {
  const baseUrl = 'https://example.com';
  const locales = ['en', 'fr'];

  // Static pages
  const staticEntries: SitemapEntry[] = [
    ...createMultiLanguageEntries(baseUrl, '/', locales, 'en', {
      priority: 1.0,
      changeFrequency: 'weekly',
    }),
    ...createMultiLanguageEntries(baseUrl, '/blog', locales, 'en', {
      priority: 0.9,
      changeFrequency: 'daily',
    }),
  ];

  // Blog post entries
  const posts = await getAllBlogPosts('en');
  const blogEntries: SitemapEntry[] = posts.flatMap((post) => {
    const postLocales = getBlogPostLocales(post.slug);
    return createMultiLanguageEntries(
      baseUrl,
      `/blog/${post.slug}`,
      postLocales,
      'en',
      {
        priority: 0.7,
        changeFrequency: 'monthly',
        lastModified: post.metadata.date,
      }
    );
  });

  return [...staticEntries, ...blogEntries];
}
```

---

## Bilingual Content

### Creating Translations

Create one markdown file per language with the same slug:

```
src/content/blog/
├── getting-started.en.md
├── getting-started.fr.md
├── product-update.en.md
└── product-update.fr.md
```

Each file has its own frontmatter with translated values:

```markdown
<!-- getting-started.en.md -->
---
title: "Getting Started with Our Platform"
excerpt: "Everything you need to know to get up and running"
author: "Jane Doe"
date: "2026-02-20"
readTime: 5
tags: ["getting-started", "tutorial"]
---
```

```markdown
<!-- getting-started.fr.md -->
---
title: "Premiers pas avec notre plateforme"
excerpt: "Tout ce que vous devez savoir pour commencer"
author: "Jane Doe"
date: "2026-02-20"
readTime: 5
tags: ["premiers-pas", "tutoriel"]
---
```

### Language Switcher

```typescript
import { getBlogPostLocales } from 'simple-site-framework/lib/content';
import { LanguageSelector } from 'simple-site-framework';

export default async function BlogPostPage({ params }) {
  const availableLocales = getBlogPostLocales(params.slug);

  return (
    <>
      <LanguageSelector
        currentLocale={params.locale}
        availableLocales={availableLocales}
      />
      {/* Post content */}
    </>
  );
}
```

### Handling Missing Translations

Posts without a translation for the requested locale are silently skipped by `getAllBlogPosts()`. For individual post pages, handle the error:

```typescript
import { loadBlogPost } from 'simple-site-framework/lib/content';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }) {
  try {
    const post = await loadBlogPost(params.slug, params.locale);
    return <BlogLayout {...post.metadata} locale={params.locale}>{post.content}</BlogLayout>;
  } catch {
    notFound();
  }
}
```

### Tag Considerations

Tags are per-locale. If your English post uses `["tutorial", "product"]` and your French post uses `["tutoriel", "produit"]`, tag-based filtering works independently per locale. Keep tags consistent within each language.

---

## Examples

See complete examples in:
- `examples/blog/getting-started.en.md` (English blog post)
- `examples/blog/getting-started.fr.md` (French translation)

---

## Resources

- [Tailwind Typography Docs](https://tailwindcss.com/docs/typography-plugin)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [Schema.org Article](https://schema.org/Article)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)

---

**Questions?** Open an issue on GitHub or contact us.
