// ABOUTME: Generates llms.txt and llms-full.txt for AI reader discoverability
// ABOUTME: Produces structured index and full-text files from site content pages

/** A content page to include in llms.txt output */
export interface LlmsPage {
  /** Page title */
  title: string;
  /** Short description */
  description?: string;
  /** Absolute URL */
  url: string;
  /** Full markdown content (for llms-full.txt) */
  content?: string;
}

/** Configuration for llms.txt generation */
export interface LlmsTxtConfig {
  /** Site name (used as the top-level heading) */
  siteName: string;
  /** Site description (rendered as blockquote) */
  siteDescription?: string;
  /** Pages to include */
  pages: LlmsPage[];
}

/**
 * Generate llms.txt — a structured index of site content for AI readers.
 *
 * Follows the llms.txt standard: site name as H1, optional description,
 * then a list of pages with title, URL, and description.
 *
 * @see https://llmstxt.org
 *
 * @example
 * ```ts
 * const txt = generateLlmsTxt({
 *   siteName: 'My Site',
 *   siteDescription: 'A great website',
 *   pages: posts.map(p => ({
 *     title: p.metadata.title,
 *     description: p.metadata.excerpt,
 *     url: `https://example.com/blog/${p.slug}`,
 *   })),
 * });
 * writeFileSync('public/llms.txt', txt);
 * ```
 */
export function generateLlmsTxt(config: LlmsTxtConfig): string {
  const lines: string[] = [];

  lines.push(`# ${config.siteName}`);
  lines.push('');

  if (config.siteDescription) {
    lines.push(`> ${config.siteDescription}`);
    lines.push('');
  }

  for (const page of config.pages) {
    lines.push(`- [${page.title}](${page.url})`);
    if (page.description) {
      lines.push(`  ${page.description}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Generate llms-full.txt — full content of all site pages for AI readers.
 *
 * Concatenates all page content with title and URL headers.
 *
 * @example
 * ```ts
 * const txt = generateLlmsFullTxt({
 *   siteName: 'My Site',
 *   pages: posts.map(p => ({
 *     title: p.metadata.title,
 *     url: `https://example.com/blog/${p.slug}`,
 *     content: p.rawMarkdown,
 *   })),
 * });
 * writeFileSync('public/llms-full.txt', txt);
 * ```
 */
export function generateLlmsFullTxt(config: LlmsTxtConfig): string {
  const lines: string[] = [];

  lines.push(`# ${config.siteName}`);
  lines.push('');

  for (const page of config.pages) {
    lines.push(`## ${page.title}`);
    lines.push(`URL: ${page.url}`);
    lines.push('');
    if (page.content) {
      lines.push(page.content);
      lines.push('');
    }
  }

  return lines.join('\n');
}
