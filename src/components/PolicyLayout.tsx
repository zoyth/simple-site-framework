// ABOUTME: Layout component for rendering policy and legal document pages
// ABOUTME: Provides consistent structure, styling, and SEO for markdown-based content

'use client';

import { ReactNode } from 'react';
import { cn } from '../lib/utils/cn';
import { PROSE_CLASSES } from '../lib/theme/prose';
import { TableOfContents } from './TableOfContents';
import { createArticle, serializeStructuredData, type Organization } from '../lib/seo/structured-data';

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
  /** Publisher organization for Article JSON-LD — enables auto-generated structured data */
  publisher?: Organization;
  /** Page URL for mainEntityOfPage in JSON-LD */
  url?: string;
  /** Description for structured data */
  description?: string;
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
  publisher,
  url,
  description,
}: PolicyLayoutProps) {
  // Format date based on locale
  const formattedDate = formatDate(lastUpdated, locale);

  const jsonLd = publisher
    ? serializeStructuredData(
        createArticle({
          headline: title,
          description,
          author: publisher.name,
          publisher,
          datePublished: lastUpdated,
          dateModified: lastUpdated,
          mainEntityOfPage: url,
          type: 'Article',
        })
      )
    : null;

  return (
    <article className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12', className)}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
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
          <div className={cn(PROSE_CLASSES)}>
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
