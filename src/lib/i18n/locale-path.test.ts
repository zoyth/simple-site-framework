// ABOUTME: Tests for localePath() convenience function
// ABOUTME: Verifies locale-prefixed URL generation with slug translation

import { describe, it, expect, beforeEach } from 'vitest';
import { localePath } from './locale-path';
import { setI18nConfig, __resetI18nConfig__ } from './config';
import type { I18nConfig } from './types';

const testConfig: I18nConfig = {
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  slugTranslations: {
    fr: {
      '/bilan': '/health-check',
      '/a-propos': '/about',
      '/pour/avocats': '/for/lawyers',
    },
    en: {
      '/health-check': '/bilan',
      '/about': '/a-propos',
      '/for/lawyers': '/pour/avocats',
    },
  },
};

beforeEach(() => {
  __resetI18nConfig__();
  setI18nConfig(testConfig);
});

describe('localePath', () => {
  it('prefixes path with default locale without translation', () => {
    expect(localePath('/bilan', 'fr')).toBe('/fr/bilan');
  });

  it('translates and prefixes path for non-default locale', () => {
    expect(localePath('/bilan', 'en')).toBe('/en/health-check');
  });

  it('handles root path', () => {
    expect(localePath('/', 'en')).toBe('/en');
    expect(localePath('/', 'fr')).toBe('/fr');
  });

  it('passes through untranslated paths with locale prefix', () => {
    expect(localePath('/contact', 'en')).toBe('/en/contact');
    expect(localePath('/contact', 'fr')).toBe('/fr/contact');
  });

  it('translates nested paths', () => {
    expect(localePath('/pour/avocats', 'en')).toBe('/en/for/lawyers');
  });

  it('handles as-needed prefix mode for default locale', () => {
    __resetI18nConfig__();
    setI18nConfig({ ...testConfig, localePrefix: 'as-needed' });

    expect(localePath('/bilan', 'fr')).toBe('/bilan');
    expect(localePath('/bilan', 'en')).toBe('/en/health-check');
  });

  it('handles as-needed prefix mode root path', () => {
    __resetI18nConfig__();
    setI18nConfig({ ...testConfig, localePrefix: 'as-needed' });

    expect(localePath('/', 'fr')).toBe('/');
    expect(localePath('/', 'en')).toBe('/en');
  });

  it('never prefixes in never mode', () => {
    __resetI18nConfig__();
    setI18nConfig({ ...testConfig, localePrefix: 'never' });

    expect(localePath('/bilan', 'fr')).toBe('/bilan');
    expect(localePath('/bilan', 'en')).toBe('/health-check');
    expect(localePath('/contact', 'fr')).toBe('/contact');
  });

  it('handles never prefix mode root path', () => {
    __resetI18nConfig__();
    setI18nConfig({ ...testConfig, localePrefix: 'never' });

    expect(localePath('/', 'fr')).toBe('/');
    expect(localePath('/', 'en')).toBe('/');
  });

  it('accepts custom slug translations that override config', () => {
    const custom = { fr: { '/bilan': '/checkup' } };
    expect(localePath('/bilan', 'en', custom)).toBe('/en/checkup');
  });

  it('handles path without leading slash', () => {
    expect(localePath('bilan', 'en')).toBe('/en/health-check');
  });
});
