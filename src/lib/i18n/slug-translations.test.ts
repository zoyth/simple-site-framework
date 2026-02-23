// ABOUTME: Tests for slug translation system
// ABOUTME: Verifies identity mapping, config translations, custom overrides, and nested paths

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { translateSlug } from './slug-translations';
import { setI18nConfig, __resetI18nConfig__ } from './config';

afterEach(() => {
  __resetI18nConfig__();
});

describe('translateSlug', () => {
  describe('identity mapping (no translations configured)', () => {
    beforeEach(() => {
      setI18nConfig({
        locales: ['en', 'fr'],
        defaultLocale: 'en',
      });
    });

    it('returns the same path when no translations exist', () => {
      expect(translateSlug('/contact', 'en', 'fr')).toBe('/contact');
    });

    it('returns the same path for root', () => {
      expect(translateSlug('/', 'en', 'fr')).toBe('/');
    });

    it('returns the same nested path when no translations exist', () => {
      expect(translateSlug('/about/team', 'en', 'fr')).toBe('/about/team');
    });
  });

  describe('config-based translations', () => {
    beforeEach(() => {
      setI18nConfig({
        locales: ['en', 'fr'],
        defaultLocale: 'en',
        slugTranslations: {
          en: { '/about': '/a-propos' },
          fr: { '/a-propos': '/about' },
        },
      });
    });

    it('translates a path using config translations', () => {
      expect(translateSlug('/about', 'en', 'fr')).toBe('/a-propos');
    });

    it('translates in the reverse direction', () => {
      expect(translateSlug('/a-propos', 'fr', 'en')).toBe('/about');
    });

    it('returns original path when no match in config', () => {
      expect(translateSlug('/contact', 'en', 'fr')).toBe('/contact');
    });
  });

  describe('custom translations parameter', () => {
    beforeEach(() => {
      setI18nConfig({
        locales: ['en', 'fr'],
        defaultLocale: 'en',
      });
    });

    it('uses custom translations passed as argument', () => {
      const custom = {
        en: { '/pricing': '/forfaits' },
      };
      expect(translateSlug('/pricing', 'en', 'fr', custom)).toBe('/forfaits');
    });

    it('custom translations override config translations', () => {
      setI18nConfig({
        locales: ['en', 'fr'],
        defaultLocale: 'en',
        slugTranslations: {
          en: { '/about': '/a-propos' },
        },
      });

      const custom = {
        en: { '/about': '/notre-equipe' },
      };
      expect(translateSlug('/about', 'en', 'fr', custom)).toBe('/notre-equipe');
    });
  });

  describe('nested paths', () => {
    beforeEach(() => {
      setI18nConfig({
        locales: ['en', 'fr'],
        defaultLocale: 'en',
        slugTranslations: {
          en: { '/about': '/a-propos' },
        },
      });
    });

    it('translates the base segment of a nested path', () => {
      expect(translateSlug('/about/team', 'en', 'fr')).toBe('/a-propos/team');
    });

    it('does not translate if base does not match', () => {
      expect(translateSlug('/contact/form', 'en', 'fr')).toBe('/contact/form');
    });
  });

  describe('unsupported locale', () => {
    beforeEach(() => {
      setI18nConfig({
        locales: ['en', 'fr'],
        defaultLocale: 'en',
        slugTranslations: {
          en: { '/about': '/a-propos' },
        },
      });
    });

    it('returns original path when source locale has no translations', () => {
      expect(translateSlug('/about', 'de', 'fr')).toBe('/about');
    });
  });
});
