// ABOUTME: Component for rendering JSON-LD structured data
// ABOUTME: Embeds schema.org markup in script tags for SEO

import type { ReactElement } from 'react';
import type { Thing } from '../lib/seo/structured-data';
import { serializeStructuredData } from '../lib/seo/structured-data';

export interface StructuredDataProps {
  /** Structured data object or array of objects */
  data: Thing | Thing[];
}

/**
 * Renders JSON-LD structured data in a script tag.
 *
 * Use this component to add schema.org markup to your pages for better SEO
 * and rich search results (rich snippets, knowledge panels, etc.).
 *
 * @example Basic usage with Organization
 * ```tsx
 * import { StructuredData } from 'simple-site-framework/components';
 * import { createOrganization } from 'simple-site-framework/lib/seo/structured-data';
 *
 * const orgData = createOrganization({
 *   name: 'Acme Inc',
 *   url: 'https://acme.com',
 *   logo: 'https://acme.com/logo.png',
 *   sameAs: ['https://twitter.com/acme']
 * });
 *
 * export default function Layout() {
 *   return (
 *     <>
 *       <StructuredData data={orgData} />
 *       <main>...</main>
 *     </>
 *   );
 * }
 * ```
 *
 * @example Multiple structured data objects
 * ```tsx
 * import { StructuredData } from 'simple-site-framework/components';
 * import {
 *   createOrganization,
 *   createWebSite,
 *   createBreadcrumbList
 * } from 'simple-site-framework/lib/seo/structured-data';
 *
 * const organization = createOrganization({ name: 'Acme' });
 * const website = createWebSite({
 *   name: 'Acme',
 *   url: 'https://acme.com',
 *   searchUrlTemplate: 'https://acme.com/search?q={search_term_string}'
 * });
 * const breadcrumbs = createBreadcrumbList([
 *   { name: 'Home', url: 'https://acme.com' },
 *   { name: 'Products', url: 'https://acme.com/products' }
 * ]);
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <StructuredData data={[organization, website, breadcrumbs]} />
 *       <main>...</main>
 *     </>
 *   );
 * }
 * ```
 *
 * @example FAQ Page
 * ```tsx
 * import { StructuredData } from 'simple-site-framework/components';
 * import { createFAQPage } from 'simple-site-framework/lib/seo/structured-data';
 *
 * const faqData = createFAQPage([
 *   {
 *     question: 'What is your refund policy?',
 *     answer: 'We offer a 30-day money-back guarantee on all plans.'
 *   },
 *   {
 *     question: 'Do you offer customer support?',
 *     answer: 'Yes, we provide 24/7 email and chat support to all customers.'
 *   }
 * ]);
 *
 * export default function FAQPage() {
 *   return (
 *     <>
 *       <StructuredData data={faqData} />
 *       <main>...</main>
 *     </>
 *   );
 * }
 * ```
 */
export function StructuredData({ data }: StructuredDataProps): ReactElement {
  const jsonLd = serializeStructuredData(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
