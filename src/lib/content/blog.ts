// ABOUTME: Utility functions for loading and processing blog post markdown files
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
