// ABOUTME: Layout component for rendering individual blog post pages
// ABOUTME: Provides header with author/date/tags, featured image, prose content, and TOC sidebar

'use client';

import { ReactNode } from 'react';
import { cn } from '../lib/utils/cn';
import { TableOfContents } from './TableOfContents';

export interface BlogLayoutProps {
  /** Blog post title */
  title: string;
  /** Short description for SEO */
  excerpt: string;
  /** Author name */
  author: string;
  /** Author avatar URL */
  authorAvatar?: string;
  /** Publication date (ISO string YYYY-MM-DD) */
  date: string;
  /** Reading time in minutes */
  readTime: number;
  /** Post tags */
  tags: string[];
  /** Featured image URL */
  image?: string;
  /** Featured image alt text */
  imageAlt?: string;
  /** Current locale */
  locale: string;
  /** Blog post content (from MDX) */
  children: ReactNode;
  /** Show table of contents sidebar @default true */
  showToc?: boolean;
  /** Link to blog index */
  backHref?: string;
  /** Label for back link */
  backLabel?: string;
  /** Additional CSS classes */
  className?: string;
}

export function BlogLayout({
  title,
  excerpt,
  author,
  authorAvatar,
  date,
  readTime,
  tags,
  image,
  imageAlt,
  locale,
  children,
  showToc = true,
  backHref,
  backLabel,
  className,
}: BlogLayoutProps) {
  const formattedDate = formatDate(date, locale);
  const isFr = locale === 'fr';

  return (
    <article className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12', className)}>
      {/* Back to blog */}
      <a
        href={backHref || `/${locale}/blog`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
      >
        <span aria-hidden="true">&larr;</span>
        <span className="ml-2">{backLabel || (isFr ? 'Retour au blog' : 'Back to blog')}</span>
      </a>

      {/* Header */}
      <header className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>

        {/* Author and metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={author}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span>{author}</span>
          </div>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={date}>{formattedDate}</time>
          <span aria-hidden="true">&middot;</span>
          <span>{readTime} {isFr ? 'min de lecture' : 'min read'}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Featured image */}
      {image && (
        <div className="mb-8 sm:mb-12 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={imageAlt || title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Content with optional TOC */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {showToc && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <TableOfContents title={isFr ? 'Table des matières' : 'Table of Contents'} />
            </div>
          </aside>
        )}

        <div className="flex-1 min-w-0">
          <div
            className={cn(
              'prose prose-gray prose-lg max-w-none',
              'prose-headings:scroll-mt-24',
              'prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4',
              'prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3',
              'prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2',
              'prose-p:text-gray-700 prose-p:leading-relaxed',
              'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
              'prose-strong:text-gray-900 prose-strong:font-semibold',
              'prose-ul:my-6 prose-li:my-2',
              'prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
              'prose-pre:bg-gray-900 prose-pre:text-gray-100',
              'prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:py-2',
              'prose-table:text-sm',
              'sm:prose-lg',
              'prose-headings:break-words',
              'prose-p:break-words'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Format date string based on locale
 * Handles ISO date strings (YYYY-MM-DD) without timezone conversion
 */
function formatDate(dateString: string, locale: string): string {
  try {
    const isoDateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const date = isoDateMatch
      ? new Date(`${dateString}T12:00:00`)
      : new Date(dateString);

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
