// ABOUTME: Utility functions for loading and processing policy markdown files
// ABOUTME: Supports static generation of policy pages from markdown with frontmatter

import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';

export interface PolicyMetadata {
  /** Policy title */
  title: string;
  /** Last updated date (ISO string) */
  lastUpdated: string;
  /** Optional description for SEO */
  description?: string;
  /** Additional custom fields */
  [key: string]: string | undefined;
}

export interface Policy {
  /** Compiled MDX content as React elements */
  content: React.ReactElement;
  /** Frontmatter metadata */
  metadata: PolicyMetadata;
  /** Policy slug (filename without locale/extension) */
  slug: string;
  /** Locale */
  locale: string;
}

/**
 * Load a policy markdown file and compile it to React
 *
 * @param slug - Policy slug (e.g., 'privacy-policy', 'terms-of-service')
 * @param locale - Locale code (e.g., 'en', 'fr')
 * @param contentDir - Directory containing policy files @default 'src/content/policies'
 * @returns Compiled policy with content and metadata
 *
 * @example
 * ```typescript
 * const { content, metadata } = await loadPolicy('privacy-policy', 'en');
 *
 * return (
 *   <PolicyLayout
 *     title={metadata.title}
 *     lastUpdated={metadata.lastUpdated}
 *   >
 *     {content}
 *   </PolicyLayout>
 * );
 * ```
 */
export async function loadPolicy(
  slug: string,
  locale: string,
  contentDir = 'src/content/policies'
): Promise<Policy> {
  const filePath = path.join(process.cwd(), contentDir, `${slug}.${locale}.md`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Policy file not found: ${slug}.${locale}.md in ${contentDir}\n` +
        `Looking for: ${filePath}`
    );
  }

  // Read file
  const source = fs.readFileSync(filePath, 'utf8');

  // Compile MDX with frontmatter
  const { content, frontmatter } = await compileMDX<PolicyMetadata>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  // Validate required frontmatter fields
  if (!frontmatter.title) {
    throw new Error(`Policy ${slug}.${locale}.md is missing required frontmatter field: title`);
  }
  if (!frontmatter.lastUpdated) {
    throw new Error(
      `Policy ${slug}.${locale}.md is missing required frontmatter field: lastUpdated`
    );
  }

  return {
    content,
    metadata: frontmatter,
    slug,
    locale,
  };
}

/**
 * Get all unique policy slugs (without locale suffix)
 *
 * @param contentDir - Directory containing policy files @default 'src/content/policies'
 * @returns Array of policy slugs
 *
 * @example
 * ```typescript
 * const slugs = getPolicySlugs(); // ['privacy-policy', 'terms-of-service']
 * ```
 */
export function getPolicySlugs(contentDir = 'src/content/policies'): string[] {
  const policiesDir = path.join(process.cwd(), contentDir);

  // Check if directory exists
  if (!fs.existsSync(policiesDir)) {
    console.warn(`Policies directory not found: ${policiesDir}`);
    return [];
  }

  const files = fs.readdirSync(policiesDir);

  // Extract unique slugs (remove locale and extension)
  const slugs = Array.from(
    new Set(
      files
        .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
        .map((file) => {
          // Remove .{locale}.md or .{locale}.mdx
          return file.replace(/\.[a-z]{2}(-[A-Z]{2})?\.mdx?$/, '');
        })
    )
  );

  return slugs;
}

/**
 * Get all policies for a specific locale with their metadata
 *
 * @param locale - Locale code
 * @param contentDir - Directory containing policy files @default 'src/content/policies'
 * @returns Array of policies with metadata
 *
 * @example
 * ```typescript
 * const policies = await getAllPolicies('en');
 *
 * // Render policy list
 * policies.map(policy => (
 *   <Link key={policy.slug} href={`/policies/${policy.slug}`}>
 *     {policy.metadata.title}
 *   </Link>
 * ));
 * ```
 */
export async function getAllPolicies(
  locale: string,
  contentDir = 'src/content/policies'
): Promise<Omit<Policy, 'content'>[]> {
  const slugs = getPolicySlugs(contentDir);

  const policies = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const policy = await loadPolicy(slug, locale, contentDir);
        // Return without content to keep response size small
        return {
          slug: policy.slug,
          locale: policy.locale,
          metadata: policy.metadata,
        };
      } catch (error) {
        // Skip if policy doesn't exist for this locale
        console.warn(`Skipping ${slug} for locale ${locale}:`, error);
        return null;
      }
    })
  );

  // Filter out null values (policies that don't exist for this locale)
  return policies.filter((p): p is Omit<Policy, 'content'> => p !== null);
}

/**
 * Get available locales for a specific policy
 *
 * @param slug - Policy slug
 * @param contentDir - Directory containing policy files @default 'src/content/policies'
 * @returns Array of locale codes
 *
 * @example
 * ```typescript
 * const locales = getPolicyLocales('privacy-policy'); // ['en', 'fr']
 * ```
 */
export function getPolicyLocales(slug: string, contentDir = 'src/content/policies'): string[] {
  const policiesDir = path.join(process.cwd(), contentDir);

  if (!fs.existsSync(policiesDir)) {
    return [];
  }

  const files = fs.readdirSync(policiesDir);

  // Find all files matching the slug pattern
  const locales = files
    .filter((file) => {
      const pattern = new RegExp(`^${slug}\\.[a-z]{2}(-[A-Z]{2})?\\.mdx?$`);
      return pattern.test(file);
    })
    .map((file) => {
      // Extract locale from filename
      const match = file.match(/\.([a-z]{2}(-[A-Z]{2})?)\.mdx?$/);
      return match ? match[1] : null;
    })
    .filter((locale): locale is string => locale !== null);

  return locales;
}
