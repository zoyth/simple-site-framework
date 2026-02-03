import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SEOMetaTags } from './SEOMetaTags';

describe('SEOMetaTags', () => {
  describe('Basic meta tags', () => {
    it('renders title and description', () => {
      render(
        <SEOMetaTags
          title="Test Page Title"
          description="Test page description"
        />
      );

      const title = document.querySelector('title');
      const description = document.querySelector('meta[name="description"]');

      expect(title?.textContent).toBe('Test Page Title');
      expect(description?.getAttribute('content')).toBe('Test page description');
    });

    it('renders keywords when provided', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          keywords={['seo', 'testing', 'meta tags']}
        />
      );

      const keywords = document.querySelector('meta[name="keywords"]');
      expect(keywords?.getAttribute('content')).toBe('seo, testing, meta tags');
    });

    it('does not render keywords when not provided', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
        />
      );

      const keywords = document.querySelector('meta[name="keywords"]');
      expect(keywords).toBeNull();
    });

    it('renders robots meta tag when noIndex is true', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          noIndex={true}
        />
      );

      const robots = document.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute('content')).toBe('noindex');
    });

    it('renders robots meta tag when noFollow is true', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          noFollow={true}
        />
      );

      const robots = document.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute('content')).toBe('nofollow');
    });

    it('renders combined robots directive when both noIndex and noFollow are true', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          noIndex={true}
          noFollow={true}
        />
      );

      const robots = document.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute('content')).toBe('noindex, nofollow');
    });

    it('does not render robots meta tag when both are false', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          noIndex={false}
          noFollow={false}
        />
      );

      const robots = document.querySelector('meta[name="robots"]');
      expect(robots).toBeNull();
    });
  });

  describe('Canonical URL', () => {
    it('renders canonical link when provided', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          canonical="https://example.com/test-page"
        />
      );

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical?.getAttribute('href')).toBe('https://example.com/test-page');
    });

    it('does not render canonical link when not provided', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
        />
      );

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toBeNull();
    });
  });

  describe('Open Graph tags', () => {
    it('uses page title and description as defaults', () => {
      render(
        <SEOMetaTags
          title="Page Title"
          description="Page description"
        />
      );

      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');

      expect(ogTitle?.getAttribute('content')).toBe('Page Title');
      expect(ogDescription?.getAttribute('content')).toBe('Page description');
    });

    it('renders custom Open Graph values when provided', () => {
      render(
        <SEOMetaTags
          title="Page Title"
          description="Page description"
          openGraph={{
            title: 'Custom OG Title',
            description: 'Custom OG description',
            image: 'https://example.com/og-image.jpg',
            imageAlt: 'Image alt text',
            type: 'article',
            url: 'https://example.com/page',
            siteName: 'Test Site',
            locale: 'en_US',
          }}
        />
      );

      expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
        'Custom OG Title'
      );
      expect(
        document.querySelector('meta[property="og:description"]')?.getAttribute('content')
      ).toBe('Custom OG description');
      expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
        'https://example.com/og-image.jpg'
      );
      expect(
        document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')
      ).toBe('Image alt text');
      expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
        'article'
      );
      expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
        'https://example.com/page'
      );
      expect(
        document.querySelector('meta[property="og:site_name"]')?.getAttribute('content')
      ).toBe('Test Site');
      expect(document.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe(
        'en_US'
      );
    });

    it('renders alternate locales', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          openGraph={{
            alternateLocales: ['fr_FR', 'es_ES', 'de_DE'],
          }}
        />
      );

      const alternates = document.querySelectorAll('meta[property="og:locale:alternate"]');
      expect(alternates).toHaveLength(3);
      expect(alternates[0].getAttribute('content')).toBe('fr_FR');
      expect(alternates[1].getAttribute('content')).toBe('es_ES');
      expect(alternates[2].getAttribute('content')).toBe('de_DE');
    });

    it('renders article-specific tags when type is article', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          openGraph={{
            type: 'article',
            publishedTime: '2024-01-15T10:00:00Z',
            modifiedTime: '2024-01-20T14:30:00Z',
            authors: ['https://example.com/author1', 'https://example.com/author2'],
            section: 'Technology',
            tags: ['react', 'seo', 'testing'],
          }}
        />
      );

      expect(
        document.querySelector('meta[property="article:published_time"]')?.getAttribute('content')
      ).toBe('2024-01-15T10:00:00Z');
      expect(
        document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content')
      ).toBe('2024-01-20T14:30:00Z');

      const authors = document.querySelectorAll('meta[property="article:author"]');
      expect(authors).toHaveLength(2);
      expect(authors[0].getAttribute('content')).toBe('https://example.com/author1');

      expect(
        document.querySelector('meta[property="article:section"]')?.getAttribute('content')
      ).toBe('Technology');

      const tags = document.querySelectorAll('meta[property="article:tag"]');
      expect(tags).toHaveLength(3);
      expect(tags[0].getAttribute('content')).toBe('react');
      expect(tags[1].getAttribute('content')).toBe('seo');
      expect(tags[2].getAttribute('content')).toBe('testing');
    });

    it('does not render article tags when type is not article', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          openGraph={{
            type: 'website',
            publishedTime: '2024-01-15T10:00:00Z',
          }}
        />
      );

      const publishedTime = document.querySelector('meta[property="article:published_time"]');
      expect(publishedTime).toBeNull();
    });

    it('uses canonical URL as og:url fallback', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          canonical="https://example.com/canonical"
        />
      );

      const ogUrl = document.querySelector('meta[property="og:url"]');
      expect(ogUrl?.getAttribute('content')).toBe('https://example.com/canonical');
    });
  });

  describe('Twitter Card tags', () => {
    it('uses page title and description as defaults', () => {
      render(
        <SEOMetaTags
          title="Page Title"
          description="Page description"
        />
      );

      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');

      expect(twitterTitle?.getAttribute('content')).toBe('Page Title');
      expect(twitterDescription?.getAttribute('content')).toBe('Page description');
    });

    it('renders custom Twitter Card values when provided', () => {
      render(
        <SEOMetaTags
          title="Page Title"
          description="Page description"
          twitter={{
            card: 'summary_large_image',
            site: '@testsite',
            creator: '@testcreator',
            title: 'Custom Twitter Title',
            description: 'Custom Twitter description',
            image: 'https://example.com/twitter-image.jpg',
            imageAlt: 'Twitter image alt',
          }}
        />
      );

      expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
        'summary_large_image'
      );
      expect(document.querySelector('meta[name="twitter:site"]')?.getAttribute('content')).toBe(
        '@testsite'
      );
      expect(document.querySelector('meta[name="twitter:creator"]')?.getAttribute('content')).toBe(
        '@testcreator'
      );
      expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(
        'Custom Twitter Title'
      );
      expect(
        document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')
      ).toBe('Custom Twitter description');
      expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(
        'https://example.com/twitter-image.jpg'
      );
      expect(
        document.querySelector('meta[name="twitter:image:alt"]')?.getAttribute('content')
      ).toBe('Twitter image alt');
    });

    it('does not render optional Twitter tags when not provided', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
        />
      );

      expect(document.querySelector('meta[name="twitter:card"]')).toBeNull();
      expect(document.querySelector('meta[name="twitter:site"]')).toBeNull();
      expect(document.querySelector('meta[name="twitter:creator"]')).toBeNull();
      expect(document.querySelector('meta[name="twitter:image"]')).toBeNull();
    });
  });

  describe('Additional meta and link tags', () => {
    it('renders additional meta tags with name attribute', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          additionalMetaTags={[
            { name: 'author', content: 'John Doe' },
            { name: 'theme-color', content: '#ffffff' },
          ]}
        />
      );

      const author = document.querySelector('meta[name="author"]');
      const themeColor = document.querySelector('meta[name="theme-color"]');

      expect(author?.getAttribute('content')).toBe('John Doe');
      expect(themeColor?.getAttribute('content')).toBe('#ffffff');
    });

    it('renders additional meta tags with property attribute', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          additionalMetaTags={[{ property: 'fb:app_id', content: '123456789' }]}
        />
      );

      const fbAppId = document.querySelector('meta[property="fb:app_id"]');
      expect(fbAppId?.getAttribute('content')).toBe('123456789');
    });

    it('renders additional link tags', () => {
      render(
        <SEOMetaTags
          title="Test"
          description="Test description"
          additionalLinkTags={[
            { rel: 'alternate', href: 'https://example.com/fr', hreflang: 'fr' },
            { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
          ]}
        />
      );

      const alternate = document.querySelector('link[rel="alternate"][hreflang="fr"]');
      const icon = document.querySelector('link[rel="icon"]');

      expect(alternate?.getAttribute('href')).toBe('https://example.com/fr');
      expect(icon?.getAttribute('href')).toBe('/favicon.ico');
      expect(icon?.getAttribute('type')).toBe('image/x-icon');
    });
  });
});
