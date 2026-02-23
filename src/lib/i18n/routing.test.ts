// ABOUTME: Tests for Next.js rewrite and redirect generators
// ABOUTME: Verifies correct generation of routing rules from slugTranslations config

import { describe, it, expect } from 'vitest';
import { generateI18nRewrites, generateI18nRedirects } from './routing';
import type { I18nConfig } from './types';

const testConfig: I18nConfig = {
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  slugTranslations: {
    fr: {
      '/a-propos': '/about',
      '/nous-contacter': '/contact',
    },
    en: {
      '/about': '/a-propos',
      '/contact': '/nous-contacter',
    },
  },
};

describe('generateI18nRewrites', () => {
  it('generates rewrites for non-default locales', () => {
    const rewrites = generateI18nRewrites(testConfig);

    // en is non-default, so translated slugs should rewrite to filesystem (default locale) slugs
    expect(rewrites).toContainEqual({
      source: '/en/about',
      destination: '/en/a-propos',
    });
    expect(rewrites).toContainEqual({
      source: '/en/contact',
      destination: '/en/nous-contacter',
    });
  });

  it('does not generate rewrites for default locale', () => {
    const rewrites = generateI18nRewrites(testConfig);

    const frRewrites = rewrites.filter((r) => r.source.startsWith('/fr/'));
    expect(frRewrites).toHaveLength(0);
  });

  it('returns empty array when no slug translations configured', () => {
    const config: I18nConfig = {
      locales: ['fr', 'en'],
      defaultLocale: 'fr',
    };

    expect(generateI18nRewrites(config)).toEqual([]);
  });

  it('handles three locales', () => {
    const config: I18nConfig = {
      locales: ['fr', 'en', 'es'],
      defaultLocale: 'fr',
      slugTranslations: {
        fr: { '/a-propos': '/about' },
        en: { '/about': '/a-propos' },
        es: { '/acerca-de': '/a-propos' },
      },
    };

    const rewrites = generateI18nRewrites(config);

    expect(rewrites).toContainEqual({
      source: '/en/about',
      destination: '/en/a-propos',
    });
    expect(rewrites).toContainEqual({
      source: '/es/acerca-de',
      destination: '/es/a-propos',
    });
    // No fr rewrites
    expect(rewrites.filter((r) => r.source.startsWith('/fr/'))).toHaveLength(0);
  });
});

describe('generateI18nRedirects', () => {
  it('generates permanent redirects for non-default locales', () => {
    const redirects = generateI18nRedirects(testConfig);

    // Redirect from the default-locale slug in the wrong locale context
    // to the translated slug
    expect(redirects).toContainEqual({
      source: '/en/a-propos',
      destination: '/en/about',
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: '/en/nous-contacter',
      destination: '/en/contact',
      permanent: true,
    });
  });

  it('does not generate redirects for default locale', () => {
    const redirects = generateI18nRedirects(testConfig);

    const frRedirects = redirects.filter((r) => r.source.startsWith('/fr/'));
    expect(frRedirects).toHaveLength(0);
  });

  it('returns empty array when no slug translations configured', () => {
    const config: I18nConfig = {
      locales: ['fr', 'en'],
      defaultLocale: 'fr',
    };

    expect(generateI18nRedirects(config)).toEqual([]);
  });

  it('handles three locales', () => {
    const config: I18nConfig = {
      locales: ['fr', 'en', 'es'],
      defaultLocale: 'fr',
      slugTranslations: {
        fr: { '/a-propos': '/about' },
        en: { '/about': '/a-propos' },
        es: { '/acerca-de': '/a-propos' },
      },
    };

    const redirects = generateI18nRedirects(config);

    // en: /a-propos → /about
    expect(redirects).toContainEqual({
      source: '/en/a-propos',
      destination: '/en/about',
      permanent: true,
    });
    // es: /a-propos → /acerca-de
    expect(redirects).toContainEqual({
      source: '/es/a-propos',
      destination: '/es/acerca-de',
      permanent: true,
    });
  });
});
