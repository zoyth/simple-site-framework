// ABOUTME: Tests for i18n middleware/proxy factory
// ABOUTME: Verifies createI18nMiddleware and createI18nProxy produce equivalent functions

import { describe, it, expect } from 'vitest';
import { createI18nMiddleware, createI18nProxy } from './middleware';

const config = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
};

describe('createI18nProxy', () => {
  it('is the same function as createI18nMiddleware', () => {
    expect(createI18nProxy).toBe(createI18nMiddleware);
  });

  it('returns a function', () => {
    const proxy = createI18nProxy(config);
    expect(typeof proxy).toBe('function');
  });
});
