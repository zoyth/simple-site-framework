// ABOUTME: Generic content page loader for markdown files organized by locale
// ABOUTME: Reads from content/{locale}/{slug}.md with MDX compilation and sensible defaults

import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { defaultMdxComponents } from '../../components/mdx';

export interface ContentPage {
  /** Compiled MDX content */
  content: JSX.Element;
  /** Content slug */
  slug: string;
  /** Locale */
  locale: string;
}

export interface LoadContentOptions {
  /** Directory containing locale subdirectories @default 'src/content' */
  contentDir?: string;
  /** Custom MDX component overrides (merged with defaults) */
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * Load a markdown content page and compile it to React
 *
 * Reads from `{contentDir}/{locale}/{slug}.md`, compiles with remarkGfm
 * and rehypeSlug, and applies default MDX components (external links
 * open in new windows).
 *
 * @param slug - Content slug (filename without extension)
 * @param locale - Locale code
 * @param options - Optional configuration
 * @returns Compiled content page
 *
 * @example
 * ```tsx
 * const { content } = await loadContent('vision', 'fr');
 * return <article>{content}</article>;
 * ```
 */
export async function loadContent(
  slug: string,
  locale: string,
  options: LoadContentOptions = {}
): Promise<ContentPage> {
  const { contentDir = 'src/content', components } = options;

  const filePath = resolveContentPath(slug, locale, contentDir);

  if (!filePath) {
    throw new Error(
      `Content file not found: ${locale}/${slug}.md in ${contentDir}`
    );
  }

  const source = fs.readFileSync(filePath, 'utf8');

  const mergedComponents = {
    ...defaultMdxComponents,
    ...components,
  };

  const { content } = await compileMDX({
    source,
    components: mergedComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  return { content, slug, locale };
}

/**
 * Get all content slugs for a locale
 *
 * Scans `{contentDir}/{locale}/` for .md and .mdx files and returns
 * their slugs (filenames without extension).
 *
 * @param locale - Locale code
 * @param contentDir - Directory containing locale subdirectories @default 'src/content'
 * @returns Array of content slugs
 *
 * @example
 * ```tsx
 * export function generateStaticParams() {
 *   return ['en', 'fr'].flatMap((locale) =>
 *     getContentSlugs(locale).map((slug) => ({ locale, slug }))
 *   );
 * }
 * ```
 */
export function getContentSlugs(
  locale: string,
  contentDir = 'src/content'
): string[] {
  const localeDir = path.join(
    path.isAbsolute(contentDir) ? contentDir : path.join(process.cwd(), contentDir),
    locale
  );

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  return fs.readdirSync(localeDir)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx?$/, ''));
}

function resolveContentPath(
  slug: string,
  locale: string,
  contentDir: string
): string | null {
  const baseDir = path.isAbsolute(contentDir)
    ? contentDir
    : path.join(process.cwd(), contentDir);
  const localeDir = path.join(baseDir, locale);

  for (const ext of ['.md', '.mdx']) {
    const filePath = path.join(localeDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}
