// ABOUTME: Tests for RSS feed generation utility
// ABOUTME: Verifies RSS 2.0 XML output, channel info, items, and post limits

import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { generateBlogRssFeed } from './rss';

let testDir: string;

const POST1 = `---
title: "First Post"
excerpt: "First description"
author: "Author A"
date: "2026-02-01"
readTime: 5
tags: ["news", "updates"]
---

# First post
`;

const POST2 = `---
title: "Second Post"
excerpt: "Second description"
author: "Author B"
date: "2026-01-15"
readTime: 3
tags: ["blog"]
---

# Second post
`;

beforeAll(() => {
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rss-test-'));
  fs.writeFileSync(path.join(testDir, 'first-post.en.md'), POST1);
  fs.writeFileSync(path.join(testDir, 'second-post.en.md'), POST2);
});

afterAll(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

describe('generateBlogRssFeed', () => {
  it('generates valid RSS 2.0 XML', async () => {
    const xml = await generateBlogRssFeed({
      siteUrl: 'https://example.com',
      siteName: 'Test Blog',
      description: 'A test blog',
      locale: 'en',
      contentDir: testDir,
    });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('</rss>');
  });

  it('includes channel info', async () => {
    const xml = await generateBlogRssFeed({
      siteUrl: 'https://example.com',
      siteName: 'Test Blog',
      description: 'A test blog',
      locale: 'en',
      contentDir: testDir,
    });

    expect(xml).toContain('<title>Test Blog</title>');
    expect(xml).toContain('<description>A test blog</description>');
    expect(xml).toContain('<link>https://example.com</link>');
    expect(xml).toContain('<language>en</language>');
  });

  it('includes items sorted by date descending', async () => {
    const xml = await generateBlogRssFeed({
      siteUrl: 'https://example.com',
      siteName: 'Test Blog',
      description: 'A test blog',
      locale: 'en',
      contentDir: testDir,
    });

    expect(xml).toContain('<title>First Post</title>');
    expect(xml).toContain('<title>Second Post</title>');
    // First post (2026-02-01) should appear before second post (2026-01-15)
    const firstIdx = xml.indexOf('<title>First Post</title>');
    const secondIdx = xml.indexOf('<title>Second Post</title>');
    expect(firstIdx).toBeLessThan(secondIdx);
  });

  it('includes item details', async () => {
    const xml = await generateBlogRssFeed({
      siteUrl: 'https://example.com',
      siteName: 'Test Blog',
      description: 'A test blog',
      locale: 'en',
      contentDir: testDir,
    });

    expect(xml).toContain('<description>First description</description>');
    expect(xml).toContain('<link>https://example.com/en/blog/first-post</link>');
    expect(xml).toContain('<author>Author A</author>');
    expect(xml).toContain('<category>news</category>');
    expect(xml).toContain('<category>updates</category>');
  });

  it('supports localized description', async () => {
    const xml = await generateBlogRssFeed({
      siteUrl: 'https://example.com',
      siteName: 'Blogue Test',
      description: { en: 'A test blog', fr: 'Un blogue test' },
      locale: 'fr',
      contentDir: testDir,
    });

    expect(xml).toContain('<description>Un blogue test</description>');
    expect(xml).toContain('<language>fr</language>');
  });

  it('limits to 20 most recent posts', async () => {
    // Create 25 posts
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rss-limit-'));
    for (let i = 0; i < 25; i++) {
      const date = `2026-01-${String(i + 1).padStart(2, '0')}`;
      const content = `---
title: "Post ${i}"
excerpt: "Excerpt ${i}"
author: "Author"
date: "${date}"
readTime: 1
tags: ["test"]
---

# Post ${i}
`;
      fs.writeFileSync(path.join(dir, `post-${i}.en.md`), content);
    }

    const xml = await generateBlogRssFeed({
      siteUrl: 'https://example.com',
      siteName: 'Test',
      description: 'Test',
      locale: 'en',
      contentDir: dir,
    });

    const itemCount = (xml.match(/<item>/g) || []).length;
    expect(itemCount).toBe(20);

    fs.rmSync(dir, { recursive: true, force: true });
  });
});
