# BlogIndex

Blog listing page component with tag filtering, optional featured posts section, and a responsive grid layout. Renders posts using `BlogCard` and supports localized titles and descriptions.

## Import

```typescript
import { BlogIndex } from '@zoyth/simple-site-framework';
```

**Type:** Client Component (`'use client'`)

## Basic Usage

```typescript
<BlogIndex
  locale="en"
  posts={[
    {
      slug: 'fast-websites',
      metadata: {
        title: 'How to Build Fast Websites',
        excerpt: 'Learn modern web performance...',
        author: 'Jane Doe',
        date: '2024-06-15',
        readTime: 8,
        tags: ['performance', 'web'],
      },
    },
  ]}
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `locale` | `string` | Current locale (e.g., `'en'` or `'fr'`). Controls empty state text and tag filter aria label |
| `posts` | `Array<{ slug: string; metadata: BlogPostMetadata }>` | Blog posts to display. Each post needs a `slug` and its `metadata` object |

### BlogPostMetadata Shape

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Post title |
| `excerpt` | `string` | Yes | Short description |
| `author` | `string` | Yes | Author name |
| `date` | `string` | Yes | ISO date string (`YYYY-MM-DD`) |
| `readTime` | `number` | Yes | Reading time in minutes |
| `tags` | `string[]` | Yes | Post tags |
| `featured` | `boolean` | No | Whether the post is featured |
| `image` | `string` | No | Featured image URL |
| `imageAlt` | `string` | No | Alt text for the image |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `LocalizedString \| string` | - | Page heading rendered as `<h1>` |
| `description` | `LocalizedString \| string` | - | Page description below the heading |
| `showTagFilter` | `boolean` | `true` | Show the tag filter bar |
| `cardVariant` | `'default' \| 'horizontal' \| 'minimal'` | `'default'` | Visual variant passed to each `BlogCard` |
| `featuredFirst` | `boolean` | `true` | Display posts with `featured: true` in a separate prominent section |
| `className` | `string` | - | Additional CSS classes on the outer container |

## Tag Filtering

When `showTagFilter` is `true` (default), a row of tag buttons appears above the post grid. Tags are extracted from all posts and sorted alphabetically.

- Clicking a tag filters the grid to show only posts with that tag.
- Clicking the active tag again clears the filter and shows all posts.
- The active tag button uses the primary theme color.
- The filter applies to both featured and regular post sections.

```typescript
<BlogIndex
  locale="en"
  posts={posts}
  showTagFilter={true}
/>
```

To hide the tag filter bar:

```typescript
<BlogIndex
  locale="en"
  posts={posts}
  showTagFilter={false}
/>
```

## Featured Posts

When `featuredFirst` is `true` (default), posts with `metadata.featured: true` render in a separate section above the regular grid. Featured posts use a 2-column grid (`md:grid-cols-2`), while regular posts use a 3-column grid (`lg:grid-cols-3`).

```typescript
const posts = [
  {
    slug: 'big-announcement',
    metadata: {
      title: 'Big Announcement',
      excerpt: 'Something exciting...',
      author: 'Jane Doe',
      date: '2024-07-01',
      readTime: 5,
      tags: ['news'],
      featured: true, // This post appears in the featured section
    },
  },
  {
    slug: 'regular-post',
    metadata: {
      title: 'Regular Post',
      excerpt: 'A normal blog post...',
      author: 'Jane Doe',
      date: '2024-06-15',
      readTime: 8,
      tags: ['tutorial'],
    },
  },
];

<BlogIndex locale="en" posts={posts} />
```

To disable the featured section and render all posts in the same grid:

```typescript
<BlogIndex locale="en" posts={posts} featuredFirst={false} />
```

## Examples

### With Localized Title and Description

```typescript
<BlogIndex
  locale="fr"
  posts={posts}
  title={{ en: 'Our Blog', fr: 'Notre blogue' }}
  description={{ en: 'Insights and updates', fr: 'Articles et nouvelles' }}
/>
```

You can also pass plain strings:

```typescript
<BlogIndex
  locale="en"
  posts={posts}
  title="Engineering Blog"
  description="Technical articles from our team."
/>
```

### Horizontal Card Variant

```typescript
<BlogIndex
  locale="en"
  posts={posts}
  cardVariant="horizontal"
/>
```

### Minimal Card Variant

```typescript
<BlogIndex
  locale="en"
  posts={posts}
  cardVariant="minimal"
/>
```

### Full Page Example (Next.js)

```typescript
import { BlogIndex } from '@zoyth/simple-site-framework';
import { getAllBlogPosts } from '@zoyth/simple-site-framework';

export default async function BlogPage({ params }) {
  const posts = await getAllBlogPosts(params.locale);

  return (
    <BlogIndex
      locale={params.locale}
      posts={posts}
      title={{ en: 'Blog', fr: 'Blogue' }}
      description={{
        en: 'Latest articles and insights.',
        fr: 'Nos derniers articles.',
      }}
    />
  );
}
```

## Grid Layout

The component uses a responsive grid:

| Screen Size | Featured Posts | Regular Posts |
|-------------|---------------|---------------|
| Mobile (`<md`) | 1 column | 1 column |
| Tablet (`md`) | 2 columns | 2 columns |
| Desktop (`lg`) | 2 columns | 3 columns |

## Empty State

When no posts match the current filter (or no posts are provided), a centered message is displayed:

- English: "No posts found."
- French: "Aucun article trouve."

## Accessibility

- Tag filter buttons are grouped with `role="group"` and an `aria-label` ("Filter by tag" / "Filtrer par tag")
- Post links within `BlogCard` are keyboard-navigable
- Empty state text provides clear feedback

## See Also

- **[BlogLayout](./BlogLayout.md)** - Layout for rendering a single blog post page
- **[BlogCard](./BlogCard.md)** - Post preview card rendered by this component
- **[TableOfContents](./TableOfContents.md)** - TOC sidebar used in `BlogLayout`
