// ABOUTME: Tests for blog content loading system
// ABOUTME: Tests loadBlogPost, getBlogPostSlugs, getAllBlogPosts, getBlogPostLocales

import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  loadBlogPost,
  getBlogPostSlugs,
  getAllBlogPosts,
  getBlogPostLocales,
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
});

afterAll(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

describe('getBlogPostSlugs', () => {
  it('returns unique slugs from blog directory', () => {
    const slugs = getBlogPostSlugs(testDir);
    expect(slugs).toContain('test-post');
    expect(slugs).toContain('second-post');
    expect(slugs).toHaveLength(2);
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
    expect(posts).toHaveLength(2);
    // second-post (2026-02-01) should come before test-post (2026-01-15)
    expect(posts[0].slug).toBe('second-post');
    expect(posts[1].slug).toBe('test-post');
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
