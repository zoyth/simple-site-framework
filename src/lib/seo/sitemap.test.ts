import { describe, it, expect } from 'vitest';
import {
  generateSitemap,
  createSitemapEntry,
  createMultiLanguageEntries,
  validateSitemapEntry,
  validateSitemap,
} from './sitemap';

describe('Sitemap Utilities', () => {
  const baseUrl = 'https://test.com';

  describe('createSitemapEntry', () => {
    it('creates basic entry with URL', () => {
      const entry = createSitemapEntry(baseUrl, '/about');

      expect(entry.url).toBe('https://test.com/about');
    });

    it('handles root path correctly', () => {
      const entry = createSitemapEntry(baseUrl, '/');

      expect(entry.url).toBe('https://test.com');
    });

    it('handles path without leading slash', () => {
      const entry = createSitemapEntry(baseUrl, 'about');

      expect(entry.url).toBe('https://test.com/about');
    });

    it('includes optional fields when provided', () => {
      const entry = createSitemapEntry(baseUrl, '/about', {
        priority: 0.8,
        changeFrequency: 'monthly',
        lastModified: '2024-01-15',
      });

      expect(entry.priority).toBe(0.8);
      expect(entry.changeFrequency).toBe('monthly');
      expect(entry.lastModified).toBe('2024-01-15');
    });
  });

  describe('createMultiLanguageEntries', () => {
    it('creates entries for all locales', () => {
      const entries = createMultiLanguageEntries(baseUrl, '/about', ['en', 'fr', 'es']);

      expect(entries).toHaveLength(3);
      expect(entries[0].url).toBe('https://test.com/en/about');
      expect(entries[1].url).toBe('https://test.com/fr/about');
      expect(entries[2].url).toBe('https://test.com/es/about');
    });

    it('includes alternates for each entry', () => {
      const entries = createMultiLanguageEntries(baseUrl, '/about', ['en', 'fr']);

      expect(entries[0].alternates).toHaveLength(2);
      expect(entries[0].alternates?.[0]).toEqual({
        hreflang: 'en',
        href: 'https://test.com/en/about',
      });
      expect(entries[0].alternates?.[1]).toEqual({
        hreflang: 'fr',
        href: 'https://test.com/fr/about',
      });
    });

    it('includes x-default when defaultLocale provided', () => {
      const entries = createMultiLanguageEntries(baseUrl, '/about', ['en', 'fr'], 'en');

      expect(entries[0].alternates).toHaveLength(3);
      expect(entries[0].alternates?.[2]).toEqual({
        hreflang: 'x-default',
        href: 'https://test.com/en/about',
      });
    });

    it('includes optional fields in all entries', () => {
      const entries = createMultiLanguageEntries(baseUrl, '/about', ['en', 'fr'], 'en', {
        priority: 0.8,
        changeFrequency: 'monthly',
      });

      entries.forEach((entry) => {
        expect(entry.priority).toBe(0.8);
        expect(entry.changeFrequency).toBe('monthly');
      });
    });
  });

  describe('generateSitemap', () => {
    it('generates valid XML sitemap', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [createSitemapEntry(baseUrl, '/')],
      });

      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(sitemap).toContain('</urlset>');
    });

    it('includes all entry URLs', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [
          createSitemapEntry(baseUrl, '/'),
          createSitemapEntry(baseUrl, '/about'),
          createSitemapEntry(baseUrl, '/contact'),
        ],
      });

      expect(sitemap).toContain('<loc>https://test.com</loc>');
      expect(sitemap).toContain('<loc>https://test.com/about</loc>');
      expect(sitemap).toContain('<loc>https://test.com/contact</loc>');
    });

    it('includes priority when specified', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [
          createSitemapEntry(baseUrl, '/', { priority: 1.0 }),
          createSitemapEntry(baseUrl, '/about', { priority: 0.5 }),
        ],
      });

      expect(sitemap).toContain('<priority>1.0</priority>');
      expect(sitemap).toContain('<priority>0.5</priority>');
    });

    it('clamps priority to 0.0-1.0 range', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [
          createSitemapEntry(baseUrl, '/high', { priority: 2.0 }),
          createSitemapEntry(baseUrl, '/low', { priority: -0.5 }),
        ],
      });

      expect(sitemap).toContain('<priority>1.0</priority>');
      expect(sitemap).toContain('<priority>0.0</priority>');
    });

    it('includes changefreq when specified', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [createSitemapEntry(baseUrl, '/', { changeFrequency: 'weekly' })],
      });

      expect(sitemap).toContain('<changefreq>weekly</changefreq>');
    });

    it('includes lastmod when specified with Date', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const sitemap = generateSitemap({
        baseUrl,
        entries: [createSitemapEntry(baseUrl, '/', { lastModified: date })],
      });

      expect(sitemap).toContain('<lastmod>2024-01-15T10:00:00.000Z</lastmod>');
    });

    it('includes lastmod when specified with string', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [createSitemapEntry(baseUrl, '/', { lastModified: '2024-01-15' })],
      });

      expect(sitemap).toContain('<lastmod>2024-01-15</lastmod>');
    });

    it('includes hreflang alternates', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [
          {
            url: 'https://test.com/en/about',
            alternates: [
              { hreflang: 'en', href: 'https://test.com/en/about' },
              { hreflang: 'fr', href: 'https://test.com/fr/about' },
            ],
          },
        ],
      });

      expect(sitemap).toContain(
        '<xhtml:link rel="alternate" hreflang="en" href="https://test.com/en/about" />'
      );
      expect(sitemap).toContain(
        '<xhtml:link rel="alternate" hreflang="fr" href="https://test.com/fr/about" />'
      );
    });

    it('includes xhtml namespace when alternates present', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [
          {
            url: 'https://test.com/en/about',
            alternates: [{ hreflang: 'en', href: 'https://test.com/en/about' }],
          },
        ],
      });

      expect(sitemap).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    });

    it('escapes XML special characters', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [createSitemapEntry(baseUrl, '/search?q=test&page=1')],
      });

      expect(sitemap).toContain('<loc>https://test.com/search?q=test&amp;page=1</loc>');
    });

    it('generates compact XML when prettyPrint is false', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [createSitemapEntry(baseUrl, '/')],
        prettyPrint: false,
      });

      expect(sitemap).not.toContain('\n  ');
    });

    it('generates formatted XML when prettyPrint is true', () => {
      const sitemap = generateSitemap({
        baseUrl,
        entries: [createSitemapEntry(baseUrl, '/')],
        prettyPrint: true,
      });

      expect(sitemap).toContain('\n  ');
    });
  });

  describe('validateSitemapEntry', () => {
    it('returns no errors for valid entry', () => {
      const entry = createSitemapEntry(baseUrl, '/', { priority: 0.8 });
      const errors = validateSitemapEntry(entry);

      expect(errors).toHaveLength(0);
    });

    it('detects non-absolute URL', () => {
      const entry = { url: '/about' };
      const errors = validateSitemapEntry(entry);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('absolute');
    });

    it('detects priority out of range', () => {
      const entry = createSitemapEntry(baseUrl, '/', { priority: 1.5 });
      const errors = validateSitemapEntry(entry);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Priority');
    });

    it('detects non-absolute alternate href', () => {
      const entry = {
        url: 'https://test.com/en/about',
        alternates: [{ hreflang: 'en', href: '/en/about' }],
      };
      const errors = validateSitemapEntry(entry);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('absolute');
    });
  });

  describe('validateSitemap', () => {
    it('returns valid for correct sitemap', () => {
      const config = {
        baseUrl,
        entries: [createSitemapEntry(baseUrl, '/', { priority: 0.8 })],
      };

      const result = validateSitemap(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects non-absolute base URL', () => {
      const config = {
        baseUrl: 'test.com',
        entries: [],
      };

      const result = validateSitemap(config);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validates all entries', () => {
      const config = {
        baseUrl,
        entries: [
          { url: '/about' }, // Invalid - not absolute
          createSitemapEntry(baseUrl, '/'), // Valid
        ],
      };

      const result = validateSitemap(config);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
