// ABOUTME: RSS feed generation for blog posts
// ABOUTME: Produces RSS 2.0 XML from blog post metadata

import { getAllBlogPosts } from './blog';
import { getLocalizedString } from './utils';
import type { LocalizedString } from '../../config/content.schema';

export interface RssFeedOptions {
  siteUrl: string;
  siteName: string;
  description: LocalizedString | string;
  locale: string;
  contentDir?: string;
}

const MAX_ITEMS = 20;

/**
 * Generate an RSS 2.0 feed from blog posts
 *
 * @returns XML string suitable for serving as application/rss+xml
 */
export async function generateBlogRssFeed(options: RssFeedOptions): Promise<string> {
  const { siteUrl, siteName, locale, contentDir } = options;

  const description = typeof options.description === 'string'
    ? options.description
    : getLocalizedString(options.description, locale);

  const posts = await getAllBlogPosts(locale, contentDir);
  const items = posts.slice(0, MAX_ITEMS);

  const itemsXml = items
    .map((post) => {
      const link = `${siteUrl}/${locale}/blog/${post.slug}`;
      const pubDate = new Date(`${post.metadata.date}T12:00:00Z`).toUTCString();
      const categories = post.metadata.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(post.metadata.title)}</title>
      <description>${escapeXml(post.metadata.excerpt)}</description>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.metadata.author)}</author>
${categories}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(siteUrl)}</link>
    <language>${escapeXml(locale)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/${escapeXml(locale)}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
