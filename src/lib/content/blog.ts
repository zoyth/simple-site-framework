// ABOUTME: Utility functions for loading, filtering, and sorting blog post markdown files
// ABOUTME: Supports static generation of blog pages from markdown with frontmatter

import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';

export interface BlogPostMetadata {
  title: string;
  excerpt: string;
  author: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  /** Reading time in minutes */
  readTime: number;
  tags: string[];
  featured?: boolean;
  /** Featured image URL */
  image?: string;
  imageAlt?: string;
  [key: string]: unknown;
}

export interface BlogPost {
  /** Compiled MDX content */
  content: JSX.Element;
  /** Frontmatter metadata */
  metadata: BlogPostMetadata;
  /** Blog post slug (filename without locale/extension) */
  slug: string;
  /** Locale */
  locale: string;
}

function resolveDir(contentDir: string): string {
  return path.isAbsolute(contentDir) ? contentDir : path.join(process.cwd(), contentDir);
}

const REQUIRED_FIELDS = ['title', 'excerpt', 'author', 'date', 'tags'] as const;

/**
 * Load a blog post markdown file and compile it to React
 *
 * @param slug - Blog post slug (e.g., 'getting-started')
 * @param locale - Locale code (e.g., 'en', 'fr')
 * @param contentDir - Directory containing blog files @default 'src/content/blog'
 * @returns Compiled blog post with content and metadata
 */
export async function loadBlogPost(
  slug: string,
  locale: string,
  contentDir = 'src/content/blog'
): Promise<BlogPost> {
  const dir = resolveDir(contentDir);
  const filePath = path.join(dir, `${slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Blog post file not found: ${slug}.${locale}.md in ${contentDir}\n` +
        `Looking for: ${filePath}`
    );
  }

  const source = fs.readFileSync(filePath, 'utf8');

  const { content, frontmatter } = await compileMDX<BlogPostMetadata>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      throw new Error(
        `Blog post ${slug}.${locale}.md is missing required frontmatter field: ${field}`
      );
    }
  }

  return {
    content,
    metadata: frontmatter,
    slug,
    locale,
  };
}

/**
 * Get all unique blog post slugs (without locale suffix)
 *
 * @param contentDir - Directory containing blog files @default 'src/content/blog'
 * @returns Array of blog post slugs
 */
export function getBlogPostSlugs(contentDir = 'src/content/blog'): string[] {
  const dir = resolveDir(contentDir);

  if (!fs.existsSync(dir)) {
    console.warn(`Blog directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir);

  const slugs = Array.from(
    new Set(
      files
        .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
        .map((file) => file.replace(/\.[a-z]{2}(-[A-Z]{2})?\.mdx?$/, ''))
    )
  );

  return slugs;
}

/**
 * Get all blog posts for a specific locale with their metadata, sorted by date descending
 *
 * @param locale - Locale code
 * @param contentDir - Directory containing blog files @default 'src/content/blog'
 * @returns Array of blog posts with metadata (without content)
 */
export async function getAllBlogPosts(
  locale: string,
  contentDir = 'src/content/blog'
): Promise<Omit<BlogPost, 'content'>[]> {
  const slugs = getBlogPostSlugs(contentDir);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const post = await loadBlogPost(slug, locale, contentDir);
        return {
          slug: post.slug,
          locale: post.locale,
          metadata: post.metadata,
        };
      } catch (error) {
        console.warn(`Skipping ${slug} for locale ${locale}:`, error);
        return null;
      }
    })
  );

  return posts
    .filter((p): p is Omit<BlogPost, 'content'> => p !== null)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
}

/**
 * Get available locales for a specific blog post
 *
 * @param slug - Blog post slug
 * @param contentDir - Directory containing blog files @default 'src/content/blog'
 * @returns Array of locale codes
 */
export function getBlogPostLocales(slug: string, contentDir = 'src/content/blog'): string[] {
  const dir = resolveDir(contentDir);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir);

  const locales = files
    .filter((file) => {
      const pattern = new RegExp(`^${slug}\\.[a-z]{2}(-[A-Z]{2})?\\.mdx?$`);
      return pattern.test(file);
    })
    .map((file) => {
      const match = file.match(/\.([a-z]{2}(-[A-Z]{2})?)\.mdx?$/);
      return match ? match[1] : null;
    })
    .filter((locale): locale is string => locale !== null);

  return locales;
}

/**
 * Get all blog posts matching a specific tag, sorted by date descending
 *
 * @param tag - Tag to filter by
 * @param locale - Locale code
 * @param contentDir - Directory containing blog files @default 'src/content/blog'
 */
export async function getBlogPostsByTag(
  tag: string,
  locale: string,
  contentDir = 'src/content/blog'
): Promise<Omit<BlogPost, 'content'>[]> {
  const posts = await getAllBlogPosts(locale, contentDir);
  return posts.filter((p) => p.metadata.tags.includes(tag));
}

/**
 * Get featured blog posts, sorted by date descending
 *
 * @param locale - Locale code
 * @param contentDir - Directory containing blog files @default 'src/content/blog'
 */
export async function getFeaturedBlogPosts(
  locale: string,
  contentDir = 'src/content/blog'
): Promise<Omit<BlogPost, 'content'>[]> {
  const posts = await getAllBlogPosts(locale, contentDir);
  return posts.filter((p) => p.metadata.featured === true);
}

/**
 * Get blog posts related to a given post by shared tags
 *
 * Sorted by number of shared tags (descending), then by date (descending).
 *
 * @param slug - Source blog post slug
 * @param locale - Locale code
 * @param count - Maximum number of related posts to return @default 3
 * @param contentDir - Directory containing blog files @default 'src/content/blog'
 */
export async function getRelatedBlogPosts(
  slug: string,
  locale: string,
  count = 3,
  contentDir = 'src/content/blog'
): Promise<Omit<BlogPost, 'content'>[]> {
  const allPosts = await getAllBlogPosts(locale, contentDir);
  const sourcePost = allPosts.find((p) => p.slug === slug);
  if (!sourcePost) return [];

  const sourceTags = new Set(sourcePost.metadata.tags);
  const candidates = allPosts.filter((p) => p.slug !== slug);

  const scored = candidates.map((post) => ({
    post,
    sharedTags: post.metadata.tags.filter((t) => sourceTags.has(t)).length,
  }));

  return scored
    .filter((s) => s.sharedTags > 0)
    .sort((a, b) => {
      if (b.sharedTags !== a.sharedTags) return b.sharedTags - a.sharedTags;
      return new Date(b.post.metadata.date).getTime() - new Date(a.post.metadata.date).getTime();
    })
    .slice(0, count)
    .map((s) => s.post);
}

export interface TagCount {
  tag: string;
  count: number;
}

/**
 * Get all unique tags across all blog posts with their occurrence count
 *
 * Sorted by count descending.
 *
 * @param locale - Locale code
 * @param contentDir - Directory containing blog files @default 'src/content/blog'
 */
export async function getAllTags(
  locale: string,
  contentDir = 'src/content/blog'
): Promise<TagCount[]> {
  const posts = await getAllBlogPosts(locale, contentDir);
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.metadata.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
