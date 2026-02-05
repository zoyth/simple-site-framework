// ABOUTME: Layout component for rendering policy and legal document pages
// ABOUTME: Provides consistent structure, styling, and SEO for markdown-based content

'use client';

import { ReactNode } from 'react';
import { cn } from '../lib/utils/cn';
import { TableOfContents } from './TableOfContents';

export interface PolicyLayoutProps {
  /** Policy title */
  title: string;
  /** Last updated date (ISO string or formatted) */
  lastUpdated: string;
  /** Current locale for date formatting */
  locale: string;
  /** Policy content (from MDX) */
  children: ReactNode;
  /** Show table of contents sidebar @default true */
  showToc?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional contact link text */
  contactText?: string;
  /** Optional contact link href */
  contactHref?: string;
}

/**
 * PolicyLayout - Layout component for policy and legal document pages
 *
 * Designed for rendering markdown/MDX content with proper structure,
 * typography, table of contents, and SEO.
 *
 * @example
 * ```tsx
 * import { loadPolicy } from '@/lib/content/policies';
 * import { PolicyLayout } from 'simple-site-framework';
 *
 * export default async function PrivacyPage({ params }) {
 *   const { content, metadata } = await loadPolicy('privacy-policy', params.locale);
 *
 *   return (
 *     <PolicyLayout
 *       title={metadata.title}
 *       lastUpdated={metadata.lastUpdated}
 *       locale={params.locale}
 *     >
 *       {content}
 *     </PolicyLayout>
 *   );
 * }
 * ```
 *
 * @see docs/POLICY-PAGES.md for complete usage guide
 */
export function PolicyLayout({
  title,
  lastUpdated,
  locale,
  children,
  showToc = true,
  className,
  contactText,
  contactHref,
}: PolicyLayoutProps) {
  // Format date based on locale
  const formattedDate = formatDate(lastUpdated, locale);

  return (
    <article className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12', className)}>
      {/* Header */}
      <header className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {locale === 'fr' ? 'Dernière mise à jour :' : 'Last updated:'} {formattedDate}
        </p>
      </header>

      {/* Content with optional TOC */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Table of Contents - Desktop */}
        {showToc && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <TableOfContents title={locale === 'fr' ? 'Table des matières' : 'Table of Contents'} />
            </div>
          </aside>
        )}

        {/* Policy Content */}
        <div className="flex-1 min-w-0">
          {/*
            Prose classes from @tailwindcss/typography
            Automatically styles markdown: headings, lists, links, etc.
          */}
          <div
            className={cn(
              'prose prose-gray prose-lg max-w-none',
              // Prose customizations
              'prose-headings:scroll-mt-24', // Offset for sticky header
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
              // Mobile optimizations
              'sm:prose-lg',
              'prose-headings:break-words',
              'prose-p:break-words'
            )}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 pt-8 border-t border-gray-200">
        <p className="text-sm sm:text-base text-gray-600">
          {contactText || (locale === 'fr' ? 'Questions sur cette politique ?' : 'Questions about this policy?')}{' '}
          <a
            href={contactHref || `/${locale}/contact`}
            className="text-primary hover:underline font-medium"
          >
            {locale === 'fr' ? 'Contactez-nous' : 'Contact us'}
          </a>
        </p>
      </footer>
    </article>
  );
}

/**
 * Format date string based on locale
 * Handles ISO date strings (YYYY-MM-DD) without timezone conversion
 */
function formatDate(dateString: string, locale: string): string {
  try {
    // Parse ISO date (YYYY-MM-DD) without timezone shift
    // new Date("2023-09-28") creates UTC midnight which shifts when converted to local time
    // Adding T12:00:00 ensures the date stays correct in any timezone
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
    // If date parsing fails, return as-is
    return dateString;
  }
}
