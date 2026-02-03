import { describe, it, expect } from 'vitest';
import {
  createOrganization,
  createWebSite,
  createProduct,
  createFAQPage,
  createArticle,
  createBreadcrumbList,
  serializeStructuredData,
} from './structured-data';

describe('Structured Data Utilities', () => {
  describe('createOrganization', () => {
    it('creates organization with required fields', () => {
      const org = createOrganization({
        name: 'Test Company',
        url: 'https://test.com',
      });

      expect(org['@type']).toBe('Organization');
      expect(org.name).toBe('Test Company');
      expect(org.url).toBe('https://test.com');
    });

    it('includes optional fields when provided', () => {
      const org = createOrganization({
        name: 'Test Company',
        url: 'https://test.com',
        logo: 'https://test.com/logo.png',
        description: 'A test company',
        email: 'hello@test.com',
        telephone: '+1-555-1234',
        sameAs: ['https://twitter.com/test', 'https://linkedin.com/company/test'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 Main St',
          addressLocality: 'Test City',
          addressRegion: 'TC',
          postalCode: '12345',
          addressCountry: 'US',
        },
      });

      expect(org.logo).toBe('https://test.com/logo.png');
      expect(org.description).toBe('A test company');
      expect(org.email).toBe('hello@test.com');
      expect(org.telephone).toBe('+1-555-1234');
      expect(org.sameAs).toEqual([
        'https://twitter.com/test',
        'https://linkedin.com/company/test',
      ]);
      expect(org.address?.streetAddress).toBe('123 Main St');
    });
  });

  describe('createWebSite', () => {
    it('creates website with required fields', () => {
      const website = createWebSite({
        name: 'Test Site',
        url: 'https://test.com',
      });

      expect(website['@type']).toBe('WebSite');
      expect(website.name).toBe('Test Site');
      expect(website.url).toBe('https://test.com');
    });

    it('includes search action when searchUrlTemplate provided', () => {
      const website = createWebSite({
        name: 'Test Site',
        url: 'https://test.com',
        searchUrlTemplate: 'https://test.com/search?q={search_term_string}',
      });

      expect(website.potentialAction).toBeDefined();
      expect(website.potentialAction?.['@type']).toBe('SearchAction');
      expect(website.potentialAction?.target['@type']).toBe('EntryPoint');
      expect(website.potentialAction?.target.urlTemplate).toBe(
        'https://test.com/search?q={search_term_string}'
      );
      expect(website.potentialAction?.['query-input']).toBe('required name=search_term_string');
    });

    it('does not include search action when not provided', () => {
      const website = createWebSite({
        name: 'Test Site',
        url: 'https://test.com',
      });

      expect(website.potentialAction).toBeUndefined();
    });
  });

  describe('createProduct', () => {
    it('creates product with required fields', () => {
      const product = createProduct({
        name: 'Test Product',
        description: 'A test product',
      });

      expect(product['@type']).toBe('Product');
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('A test product');
    });

    it('includes offers when provided', () => {
      const product = createProduct({
        name: 'Test Product',
        offers: {
          '@type': 'Offer',
          price: '99.00',
          priceCurrency: 'USD',
          availability: 'InStock',
        },
      });

      expect(product.offers).toBeDefined();
      const offer = product.offers as any;
      expect(offer['@type']).toBe('Offer');
      expect(offer.price).toBe('99.00');
      expect(offer.priceCurrency).toBe('USD');
      expect(offer.availability).toBe('InStock');
    });

    it('includes aggregate rating when provided', () => {
      const product = createProduct({
        name: 'Test Product',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: 4.5,
          reviewCount: 100,
        },
      });

      expect(product.aggregateRating).toBeDefined();
      expect(product.aggregateRating?.ratingValue).toBe(4.5);
      expect(product.aggregateRating?.reviewCount).toBe(100);
    });
  });

  describe('createFAQPage', () => {
    it('creates FAQ page with questions', () => {
      const faq = createFAQPage([
        { question: 'Q1?', answer: 'A1' },
        { question: 'Q2?', answer: 'A2' },
      ]);

      expect(faq['@type']).toBe('FAQPage');
      expect(faq.mainEntity).toHaveLength(2);
      expect(faq.mainEntity[0]['@type']).toBe('Question');
      expect(faq.mainEntity[0].name).toBe('Q1?');
      expect(faq.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
      expect(faq.mainEntity[0].acceptedAnswer.text).toBe('A1');
    });

    it('creates empty FAQ page', () => {
      const faq = createFAQPage([]);

      expect(faq['@type']).toBe('FAQPage');
      expect(faq.mainEntity).toHaveLength(0);
    });
  });

  describe('createArticle', () => {
    it('creates article with required fields', () => {
      const article = createArticle({
        headline: 'Test Article',
        author: { '@type': 'Person', name: 'Jane Doe' },
        publisher: { '@type': 'Organization', name: 'Test Publisher' },
        datePublished: '2024-01-15T10:00:00Z',
      });

      expect(article['@type']).toBe('Article');
      expect(article.headline).toBe('Test Article');
      expect(article.datePublished).toBe('2024-01-15T10:00:00Z');
    });

    it('uses specified type when provided', () => {
      const article = createArticle({
        headline: 'Test Blog Post',
        type: 'BlogPosting',
        author: { '@type': 'Person', name: 'Jane Doe' },
        publisher: { '@type': 'Organization', name: 'Test Publisher' },
        datePublished: '2024-01-15T10:00:00Z',
      });

      expect(article['@type']).toBe('BlogPosting');
    });

    it('includes optional fields when provided', () => {
      const article = createArticle({
        headline: 'Test Article',
        description: 'Article description',
        image: 'https://test.com/image.jpg',
        author: { '@type': 'Person', name: 'Jane Doe' },
        publisher: { '@type': 'Organization', name: 'Test Publisher' },
        datePublished: '2024-01-15T10:00:00Z',
        dateModified: '2024-01-20T14:30:00Z',
        mainEntityOfPage: 'https://test.com/article',
      });

      expect(article.description).toBe('Article description');
      expect(article.image).toBe('https://test.com/image.jpg');
      expect(article.dateModified).toBe('2024-01-20T14:30:00Z');
      expect(article.mainEntityOfPage).toBe('https://test.com/article');
    });
  });

  describe('createBreadcrumbList', () => {
    it('creates breadcrumb list with positions', () => {
      const breadcrumbs = createBreadcrumbList([
        { name: 'Home', url: 'https://test.com' },
        { name: 'Products', url: 'https://test.com/products' },
        { name: 'Product 1' },
      ]);

      expect(breadcrumbs['@type']).toBe('BreadcrumbList');
      expect(breadcrumbs.itemListElement).toHaveLength(3);
      expect(breadcrumbs.itemListElement[0].position).toBe(1);
      expect(breadcrumbs.itemListElement[0].name).toBe('Home');
      expect(breadcrumbs.itemListElement[0].item).toBe('https://test.com');
      expect(breadcrumbs.itemListElement[2].position).toBe(3);
      expect(breadcrumbs.itemListElement[2].name).toBe('Product 1');
      expect(breadcrumbs.itemListElement[2].item).toBeUndefined();
    });
  });

  describe('serializeStructuredData', () => {
    it('serializes single object with @context', () => {
      const org = createOrganization({
        name: 'Test',
        url: 'https://test.com',
      });

      const json = serializeStructuredData(org);
      const parsed = JSON.parse(json);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('Organization');
      expect(parsed.name).toBe('Test');
    });

    it('serializes array of objects with @graph', () => {
      const org = createOrganization({ name: 'Test', url: 'https://test.com' });
      const website = createWebSite({ name: 'Test', url: 'https://test.com' });

      const json = serializeStructuredData([org, website]);
      const parsed = JSON.parse(json);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@graph']).toHaveLength(2);
      expect(parsed['@graph'][0]['@type']).toBe('Organization');
      expect(parsed['@graph'][1]['@type']).toBe('WebSite');
    });

    it('produces valid JSON', () => {
      const faq = createFAQPage([
        { question: 'Q1?', answer: 'A1' },
        { question: 'Q2?', answer: 'A2' },
      ]);

      const json = serializeStructuredData(faq);

      // Should not throw
      expect(() => JSON.parse(json)).not.toThrow();
    });
  });
});
