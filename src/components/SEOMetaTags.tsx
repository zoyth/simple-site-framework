// ABOUTME: SEO metadata component for page-level optimization
// ABOUTME: Generates meta tags, Open Graph, Twitter Cards, and canonical URLs

import type { ReactElement } from 'react';

/**
 * Open Graph metadata for social sharing
 * @see https://ogp.me/
 */
export interface OpenGraphMetadata {
  /** Page title for social sharing */
  title?: string;
  /** Page description for social sharing */
  description?: string;
  /** Absolute URL to preview image (min 1200x630px recommended) */
  image?: string;
  /** Image alt text for accessibility */
  imageAlt?: string;
  /** Page type (website, article, product, etc.) */
  type?: 'website' | 'article' | 'product' | 'profile' | string;
  /** Canonical URL of the page */
  url?: string;
  /** Site name */
  siteName?: string;
  /** Locale (e.g., en_US, fr_FR) */
  locale?: string;
  /** Alternate locales */
  alternateLocales?: string[];
  /** Article-specific: publication date (ISO 8601) */
  publishedTime?: string;
  /** Article-specific: modified date (ISO 8601) */
  modifiedTime?: string;
  /** Article-specific: author profile URLs */
  authors?: string[];
  /** Article-specific: section/category */
  section?: string;
  /** Article-specific: tags */
  tags?: string[];
}

/**
 * Twitter Card metadata for Twitter sharing
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 */
export interface TwitterMetadata {
  /** Card type */
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  /** Twitter handle of the site (with @) */
  site?: string;
  /** Twitter handle of the content creator (with @) */
  creator?: string;
  /** Page title for Twitter */
  title?: string;
  /** Page description for Twitter */
  description?: string;
  /** Absolute URL to preview image */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
}

/**
 * Props for SEOMetaTags component
 */
export interface SEOMetaTagsProps {
  /** Page title (used in <title> tag and as fallback for OG/Twitter) */
  title: string;
  /** Page description (used in meta description and as fallback for OG/Twitter) */
  description: string;
  /** Keywords for meta keywords tag (optional, less important for modern SEO) */
  keywords?: string[];
  /** Canonical URL (absolute URL to prevent duplicate content issues) */
  canonical?: string;
  /** Prevent search engines from indexing this page */
  noIndex?: boolean;
  /** Prevent search engines from following links on this page */
  noFollow?: boolean;
  /** Open Graph metadata for social sharing */
  openGraph?: OpenGraphMetadata;
  /** Twitter Card metadata */
  twitter?: TwitterMetadata;
  /** Additional custom meta tags */
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  /** Additional link tags */
  additionalLinkTags?: Array<{
    rel: string;
    href: string;
    [key: string]: string;
  }>;
}

/**
 * SEO metadata component for page-level optimization.
 *
 * Generates essential meta tags for search engines and social media platforms:
 * - Title and description
 * - Open Graph tags (Facebook, LinkedIn)
 * - Twitter Cards
 * - Canonical URLs
 * - Robots directives
 *
 * @example
 * ```tsx
 * import { SEOMetaTags } from 'simple-site-framework/components';
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <SEOMetaTags
 *         title="Best Email Marketing Platform | Acme"
 *         description="Send beautiful email campaigns that convert. Start free today."
 *         canonical="https://example.com/features"
 *         openGraph={{
 *           image: 'https://example.com/og-image.jpg',
 *           type: 'website',
 *           siteName: 'Acme'
 *         }}
 *         twitter={{
 *           card: 'summary_large_image',
 *           site: '@acme'
 *         }}
 *       />
 *       <main>...</main>
 *     </>
 *   );
 * }
 * ```
 */
export function SEOMetaTags({
  title,
  description,
  keywords,
  canonical,
  noIndex = false,
  noFollow = false,
  openGraph,
  twitter,
  additionalMetaTags = [],
  additionalLinkTags = [],
}: SEOMetaTagsProps): ReactElement {
  // Build robots directive
  const robotsContent: string[] = [];
  if (noIndex) robotsContent.push('noindex');
  if (noFollow) robotsContent.push('nofollow');
  const robots = robotsContent.length > 0 ? robotsContent.join(', ') : undefined;

  // Merge Open Graph defaults with provided values
  const ogTitle = openGraph?.title || title;
  const ogDescription = openGraph?.description || description;
  const ogUrl = openGraph?.url || canonical;

  // Merge Twitter defaults with provided values
  const twitterTitle = twitter?.title || title;
  const twitterDescription = twitter?.description || description;

  return (
    <>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {robots && <meta name="robots" content={robots} />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      {openGraph?.image && <meta property="og:image" content={openGraph.image} />}
      {openGraph?.imageAlt && <meta property="og:image:alt" content={openGraph.imageAlt} />}
      {openGraph?.type && <meta property="og:type" content={openGraph.type} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      {openGraph?.siteName && <meta property="og:site_name" content={openGraph.siteName} />}
      {openGraph?.locale && <meta property="og:locale" content={openGraph.locale} />}
      {openGraph?.alternateLocales?.map((locale) => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}

      {/* Article-specific Open Graph tags */}
      {openGraph?.type === 'article' && (
        <>
          {openGraph.publishedTime && (
            <meta property="article:published_time" content={openGraph.publishedTime} />
          )}
          {openGraph.modifiedTime && (
            <meta property="article:modified_time" content={openGraph.modifiedTime} />
          )}
          {openGraph.authors?.map((author) => (
            <meta key={author} property="article:author" content={author} />
          ))}
          {openGraph.section && (
            <meta property="article:section" content={openGraph.section} />
          )}
          {openGraph.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card tags */}
      {twitter?.card && <meta name="twitter:card" content={twitter.card} />}
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.creator && <meta name="twitter:creator" content={twitter.creator} />}
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      {twitter?.image && <meta name="twitter:image" content={twitter.image} />}
      {twitter?.imageAlt && <meta name="twitter:image:alt" content={twitter.imageAlt} />}

      {/* Additional meta tags */}
      {additionalMetaTags.map((tag, index) => {
        if (tag.name) {
          return <meta key={`meta-${index}`} name={tag.name} content={tag.content} />;
        }
        if (tag.property) {
          return <meta key={`meta-${index}`} property={tag.property} content={tag.content} />;
        }
        return null;
      })}

      {/* Additional link tags */}
      {additionalLinkTags.map((tag, index) => (
        <link key={`link-${index}`} {...tag} />
      ))}
    </>
  );
}
