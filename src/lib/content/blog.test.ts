// ABOUTME: Tests for blog content loading and filtering system
// ABOUTME: Tests loading, slug extraction, locale detection, filtering, and sorting

import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  loadBlogPost,
  getBlogPostSlugs,
  getAllBlogPosts,
  getBlogPostLocales,
  getBlogPostsByTag,
  getFeaturedBlogPosts,
  getRelatedBlogPosts,
  getAllTags,
} from './blog';

// Create a real temp directory with test blog posts
let testDir: string;

const POST_EN = `---
title: "Test Blog Post"
excerpt: "A short description"
author: "Test Author"
date: "2026-01-15"
readTime: 5
tags: ["testing", "blog"]
featured: true
image: "/images/blog/test.jpg"
imageAlt: "Test image"
---

# Hello World

This is a test blog post.
`;

const POST_FR = `---
title: "Article de test"
excerpt: "Une courte description"
author: "Test Author"
date: "2026-01-15"
readTime: 5
tags: ["test", "blog"]
---

# Bonjour le monde

Ceci est un article de test.
`;

const POST2_EN = `---
title: "Second Post"
excerpt: "Another description"
author: "Another Author"
date: "2026-02-01"
readTime: 3
tags: ["news"]
---

# Second post

Content here.
`;

const POST3_EN = `---
title: "Third Post"
excerpt: "Third description"
author: "Test Author"
date: "2026-01-20"
readTime: 7
tags: ["testing", "news"]
featured: true
---

# Third post

More content.
`;

const POST4_EN = `---
title: "Fourth Post"
excerpt: "Fourth description"
author: "Another Author"
date: "2025-12-01"
readTime: 2
tags: ["archive"]
---

# Fourth post

Old content.
`;

const POST_MISSING_TITLE = `---
excerpt: "Missing title"
author: "Test Author"
date: "2026-01-15"
readTime: 5
tags: ["test"]
---

# No title
`;

const POST_MISSING_EXCERPT = `---
title: "Has title"
author: "Test Author"
date: "2026-01-15"
readTime: 5
tags: ["test"]
---

# No excerpt
`;

const POST_MISSING_AUTHOR = `---
title: "Has title"
excerpt: "Has excerpt"
date: "2026-01-15"
readTime: 5
tags: ["test"]
---

# No author
`;

const POST_MISSING_DATE = `---
title: "Has title"
excerpt: "Has excerpt"
author: "Test Author"
readTime: 5
tags: ["test"]
---

# No date
`;

const POST_MISSING_TAGS = `---
title: "Has title"
excerpt: "Has excerpt"
author: "Test Author"
date: "2026-01-15"
readTime: 5
---

# No tags
`;

beforeAll(() => {
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-test-'));
  fs.writeFileSync(path.join(testDir, 'test-post.en.md'), POST_EN);
  fs.writeFileSync(path.join(testDir, 'test-post.fr.md'), POST_FR);
  fs.writeFileSync(path.join(testDir, 'second-post.en.md'), POST2_EN);
  fs.writeFileSync(path.join(testDir, 'third-post.en.md'), POST3_EN);
  fs.writeFileSync(path.join(testDir, 'fourth-post.en.md'), POST4_EN);
});

afterAll(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

describe('getBlogPostSlugs', () => {
  it('returns unique slugs from blog directory', () => {
    const slugs = getBlogPostSlugs(testDir);
    expect(slugs).toContain('test-post');
    expect(slugs).toContain('second-post');
    expect(slugs).toContain('third-post');
    expect(slugs).toContain('fourth-post');
    expect(slugs).toHaveLength(4);
  });

  it('returns empty array for non-existent directory', () => {
    const slugs = getBlogPostSlugs('/nonexistent/path');
    expect(slugs).toEqual([]);
  });
});

describe('getBlogPostLocales', () => {
  it('returns available locales for a blog post', () => {
    const locales = getBlogPostLocales('test-post', testDir);
    expect(locales).toContain('en');
    expect(locales).toContain('fr');
    expect(locales).toHaveLength(2);
  });

  it('returns single locale when only one exists', () => {
    const locales = getBlogPostLocales('second-post', testDir);
    expect(locales).toEqual(['en']);
  });

  it('returns empty array for non-existent slug', () => {
    const locales = getBlogPostLocales('non-existent', testDir);
    expect(locales).toEqual([]);
  });

  it('returns empty array for non-existent directory', () => {
    const locales = getBlogPostLocales('test-post', '/nonexistent/path');
    expect(locales).toEqual([]);
  });
});

describe('loadBlogPost', () => {
  it('loads and compiles a blog post with metadata', async () => {
    const post = await loadBlogPost('test-post', 'en', testDir);
    expect(post.slug).toBe('test-post');
    expect(post.locale).toBe('en');
    expect(post.metadata.title).toBe('Test Blog Post');
    expect(post.metadata.excerpt).toBe('A short description');
    expect(post.metadata.author).toBe('Test Author');
    expect(post.metadata.date).toBe('2026-01-15');
    expect(post.metadata.readTime).toBe(5);
    expect(post.metadata.tags).toEqual(['testing', 'blog']);
    expect(post.metadata.featured).toBe(true);
    expect(post.metadata.image).toBe('/images/blog/test.jpg');
    expect(post.metadata.imageAlt).toBe('Test image');
    expect(post.content).toBeDefined();
  });

  it('loads a French blog post', async () => {
    const post = await loadBlogPost('test-post', 'fr', testDir);
    expect(post.metadata.title).toBe('Article de test');
    expect(post.locale).toBe('fr');
  });

  it('throws for non-existent blog post', async () => {
    await expect(loadBlogPost('non-existent', 'en', testDir)).rejects.toThrow(
      'Blog post file not found'
    );
  });

  it('throws when title is missing', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-validation-'));
    fs.writeFileSync(path.join(dir, 'bad.en.md'), POST_MISSING_TITLE);
    await expect(loadBlogPost('bad', 'en', dir)).rejects.toThrow('title');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('throws when excerpt is missing', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-validation-'));
    fs.writeFileSync(path.join(dir, 'bad.en.md'), POST_MISSING_EXCERPT);
    await expect(loadBlogPost('bad', 'en', dir)).rejects.toThrow('excerpt');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('throws when author is missing', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-validation-'));
    fs.writeFileSync(path.join(dir, 'bad.en.md'), POST_MISSING_AUTHOR);
    await expect(loadBlogPost('bad', 'en', dir)).rejects.toThrow('author');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('throws when date is missing', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-validation-'));
    fs.writeFileSync(path.join(dir, 'bad.en.md'), POST_MISSING_DATE);
    await expect(loadBlogPost('bad', 'en', dir)).rejects.toThrow('date');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('throws when tags is missing', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-validation-'));
    fs.writeFileSync(path.join(dir, 'bad.en.md'), POST_MISSING_TAGS);
    await expect(loadBlogPost('bad', 'en', dir)).rejects.toThrow('tags');
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe('getAllBlogPosts', () => {
  it('returns all posts for a locale sorted by date descending', async () => {
    const posts = await getAllBlogPosts('en', testDir);
    expect(posts).toHaveLength(4);
    // Sorted: second-post (2026-02-01), third-post (2026-01-20), test-post (2026-01-15), fourth-post (2025-12-01)
    expect(posts[0].slug).toBe('second-post');
    expect(posts[1].slug).toBe('third-post');
    expect(posts[2].slug).toBe('test-post');
    expect(posts[3].slug).toBe('fourth-post');
  });

  it('only returns posts available in the requested locale', async () => {
    const posts = await getAllBlogPosts('fr', testDir);
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('test-post');
  });

  it('returns metadata without content', async () => {
    const posts = await getAllBlogPosts('en', testDir);
    expect(posts[0].metadata.title).toBeDefined();
    expect(posts[0]).not.toHaveProperty('content');
  });

  it('returns empty array for non-existent directory', async () => {
    const posts = await getAllBlogPosts('en', '/nonexistent/path');
    expect(posts).toEqual([]);
  });
});

describe('getBlogPostsByTag', () => {
  it('returns posts matching a specific tag, sorted by date descending', async () => {
    const posts = await getBlogPostsByTag('testing', 'en', testDir);
    expect(posts).toHaveLength(2);
    // third-post (2026-01-20) before test-post (2026-01-15)
    expect(posts[0].slug).toBe('third-post');
    expect(posts[1].slug).toBe('test-post');
  });

  it('returns posts for a tag with single match', async () => {
    const posts = await getBlogPostsByTag('archive', 'en', testDir);
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('fourth-post');
  });

  it('returns empty array for non-existent tag', async () => {
    const posts = await getBlogPostsByTag('nonexistent', 'en', testDir);
    expect(posts).toEqual([]);
  });
});

describe('getFeaturedBlogPosts', () => {
  it('returns only featured posts, sorted by date descending', async () => {
    const posts = await getFeaturedBlogPosts('en', testDir);
    expect(posts).toHaveLength(2);
    // third-post (2026-01-20, featured) before test-post (2026-01-15, featured)
    expect(posts[0].slug).toBe('third-post');
    expect(posts[1].slug).toBe('test-post');
  });

  it('returns empty when no featured posts in locale', async () => {
    // French has only test-post which is not featured in FR fixture
    const posts = await getFeaturedBlogPosts('fr', testDir);
    expect(posts).toEqual([]);
  });
});

describe('getRelatedBlogPosts', () => {
  it('returns posts sharing tags, sorted by shared tag count then date', async () => {
    // test-post has tags: ["testing", "blog"]
    // third-post shares "testing" (1 shared tag)
    // second-post has "news", third-post also has "news" — but for test-post, only "testing" overlap matters
    const related = await getRelatedBlogPosts('test-post', 'en', 3, testDir);
    expect(related.length).toBeGreaterThan(0);
    // third-post shares "testing" tag
    expect(related[0].slug).toBe('third-post');
  });

  it('excludes the source post from results', async () => {
    const related = await getRelatedBlogPosts('test-post', 'en', 10, testDir);
    expect(related.find((p) => p.slug === 'test-post')).toBeUndefined();
  });

  it('limits results to count parameter', async () => {
    const related = await getRelatedBlogPosts('test-post', 'en', 1, testDir);
    expect(related).toHaveLength(1);
  });

  it('defaults to 3 results', async () => {
    const related = await getRelatedBlogPosts('third-post', 'en', undefined, testDir);
    // third-post has ["testing", "news"] — shares tags with test-post and second-post
    expect(related.length).toBeLessThanOrEqual(3);
  });
});

describe('getAllTags', () => {
  it('returns all unique tags with counts, sorted by count descending', async () => {
    const tags = await getAllTags('en', testDir);
    // testing: 2 (test-post, third-post), blog: 1 (test-post), news: 2 (second-post, third-post), archive: 1 (fourth-post)
    expect(tags).toHaveLength(4);
    // testing and news both have count 2, should come first
    const topTags = tags.slice(0, 2).map((t) => t.tag);
    expect(topTags).toContain('testing');
    expect(topTags).toContain('news');
    expect(tags[0].count).toBe(2);
    expect(tags[1].count).toBe(2);
  });

  it('only includes tags from the requested locale', async () => {
    const tags = await getAllTags('fr', testDir);
    // Only test-post exists in FR with tags: ["test", "blog"]
    expect(tags).toHaveLength(2);
    expect(tags.map((t) => t.tag)).toContain('test');
    expect(tags.map((t) => t.tag)).toContain('blog');
  });
});
