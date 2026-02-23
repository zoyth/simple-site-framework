// ABOUTME: Tests for metadata generation utilities
// ABOUTME: Covers bilingual inputs, slug-translated hreflang, and backward compatibility

import { describe, it, expect } from 'vitest';
import { generateMetadata } from './metadata';

describe('generateMetadata', () => {
  describe('backward compatibility with string inputs', () => {
    it('generates metadata with string title and description', () => {
      const meta = generateMetadata({
        title: 'About',
        description: 'About page',
        locale: 'en',
      });

      expect(meta.title).toBe('About');
      expect(meta.description).toBe('About page');
    });

    it('sets Open Graph title and description', () => {
      const meta = generateMetadata({
        title: 'About',
        description: 'About page',
      });

      expect(meta.openGraph?.title).toBe('About');
      expect(meta.openGraph?.description).toBe('About page');
    });

    it('sets Twitter card title and description', () => {
      const meta = generateMetadata({
        title: 'About',
        description: 'About page',
      });

      expect(meta.twitter?.title).toBe('About');
      expect(meta.twitter?.description).toBe('About page');
    });

    it('generates alternates from alternateLocales and url', () => {
      const meta = generateMetadata({
        title: 'About',
        description: 'About page',
        locale: 'en',
        alternateLocales: ['fr'],
        url: 'https://example.com/en/about',
      });

      expect(meta.alternates?.canonical).toBe('https://example.com/en/about');
      expect(meta.alternates?.languages).toHaveProperty('fr');
    });
  });

  describe('bilingual title and description', () => {
    it('resolves localized title by current locale', () => {
      const meta = generateMetadata({
        title: { fr: '\u00c0 propos', en: 'About' },
        description: { fr: 'Page \u00e0 propos', en: 'About page' },
        locale: 'en',
      });

      expect(meta.title).toBe('About');
      expect(meta.description).toBe('About page');
    });

    it('resolves localized title for French locale', () => {
      const meta = generateMetadata({
        title: { fr: '\u00c0 propos', en: 'About' },
        description: { fr: 'Page \u00e0 propos', en: 'About page' },
        locale: 'fr',
      });

      expect(meta.title).toBe('\u00c0 propos');
      expect(meta.description).toBe('Page \u00e0 propos');
    });

    it('sets Open Graph fields from resolved localized strings', () => {
      const meta = generateMetadata({
        title: { fr: '\u00c0 propos', en: 'About' },
        description: { fr: 'Page \u00e0 propos', en: 'About page' },
        locale: 'en',
      });

      expect(meta.openGraph?.title).toBe('About');
      expect(meta.openGraph?.description).toBe('About page');
    });

    it('falls back to first available locale when current locale missing', () => {
      const meta = generateMetadata({
        title: { fr: '\u00c0 propos', en: 'About' },
        description: { fr: 'Page \u00e0 propos', en: 'About page' },
        locale: 'de',
      });

      // Falls back to first key
      expect(meta.title).toBe('\u00c0 propos');
    });
  });

  describe('slug-translated alternates via path + baseUrl', () => {
    it('generates alternates from path, baseUrl, and locales', () => {
      const meta = generateMetadata({
        title: { fr: '\u00c0 propos', en: 'About' },
        description: { fr: 'Desc FR', en: 'Desc EN' },
        locale: 'fr',
        path: '/a-propos',
        baseUrl: 'https://example.com',
        locales: ['fr', 'en'],
        defaultLocale: 'fr',
      });

      expect(meta.alternates?.canonical).toBe('https://example.com/fr/a-propos');
      expect(meta.alternates?.languages).toEqual({
        fr: 'https://example.com/fr/a-propos',
        en: 'https://example.com/en/a-propos',
        'x-default': 'https://example.com/fr/a-propos',
      });
    });

    it('translates slugs in alternates when slugTranslations provided', () => {
      const meta = generateMetadata({
        title: { fr: '\u00c0 propos', en: 'About' },
        description: { fr: 'Desc FR', en: 'Desc EN' },
        locale: 'fr',
        path: '/a-propos',
        baseUrl: 'https://example.com',
        locales: ['fr', 'en'],
        defaultLocale: 'fr',
        slugTranslations: {
          fr: { '/a-propos': '/about' },
          en: { '/about': '/a-propos' },
        },
      });

      expect(meta.alternates?.canonical).toBe('https://example.com/fr/a-propos');
      expect(meta.alternates?.languages).toEqual({
        fr: 'https://example.com/fr/a-propos',
        en: 'https://example.com/en/about',
        'x-default': 'https://example.com/fr/a-propos',
      });
    });

    it('sets canonical to current locale URL', () => {
      const meta = generateMetadata({
        title: 'About',
        description: 'About page',
        locale: 'en',
        path: '/about',
        baseUrl: 'https://example.com',
        locales: ['en', 'fr'],
        defaultLocale: 'en',
      });

      expect(meta.alternates?.canonical).toBe('https://example.com/en/about');
    });
  });

  describe('explicit alternates override', () => {
    it('uses explicit alternates when provided', () => {
      const meta = generateMetadata({
        title: 'About',
        description: 'About page',
        locale: 'en',
        alternates: {
          en: 'https://example.com/en/about',
          fr: 'https://example.com/fr/a-propos',
          'x-default': 'https://example.com/en/about',
        },
      });

      expect(meta.alternates?.languages).toEqual({
        en: 'https://example.com/en/about',
        fr: 'https://example.com/fr/a-propos',
        'x-default': 'https://example.com/en/about',
      });
    });

    it('sets canonical from current locale in explicit alternates', () => {
      const meta = generateMetadata({
        title: 'About',
        description: 'About page',
        locale: 'en',
        alternates: {
          en: 'https://example.com/en/about',
          fr: 'https://example.com/fr/a-propos',
        },
      });

      expect(meta.alternates?.canonical).toBe('https://example.com/en/about');
    });
  });
});
