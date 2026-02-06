// ABOUTME: Tests for i18n configuration system
// ABOUTME: Validates config initialization, helpers, and validation

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  setI18nConfig,
  getI18nConfig,
  isI18nConfigInitialized,
  getLocales,
  getDefaultLocale,
  getLocalePrefix,
  getLocaleNames,
  getLocaleLabels,
  getRtlLocales,
  isLocaleDetectionEnabled,
  getLocaleCookieConfig,
  isSupportedLocale,
  getLocaleName,
  getLocaleLabel,
  __resetI18nConfig__,
} from './config';
import type { I18nConfig } from './types';

describe('i18n config', () => {
  const mockConfig: I18nConfig = {
    locales: ['en', 'fr', 'es'],
    defaultLocale: 'en',
    localePrefix: 'as-needed',
    localeDetection: true,
    localeNames: {
      en: 'English',
      fr: 'Français',
      es: 'Español',
    },
    localeLabels: {
      en: 'EN',
      fr: 'FR',
      es: 'ES',
    },
    rtlLocales: [],
  };

  afterEach(() => {
    // Reset config after each test
    __resetI18nConfig__();
  });

  describe('setI18nConfig / getI18nConfig', () => {
    it('should initialize config', () => {
      setI18nConfig(mockConfig);
      expect(isI18nConfigInitialized()).toBe(true);

      const config = getI18nConfig();
      expect(config.locales).toEqual(mockConfig.locales);
      expect(config.defaultLocale).toBe(mockConfig.defaultLocale);
      expect(config.localePrefix).toBe(mockConfig.localePrefix);
      expect(config.localeDetection).toBe(mockConfig.localeDetection);
    });

    it('should return legacy defaults when accessing uninitialized config', () => {
      // For backward compatibility, getI18nConfig() returns legacy defaults instead of throwing
      const config = getI18nConfig();
      expect(config.locales).toEqual(['fr', 'en']);
      expect(config.defaultLocale).toBe('fr');
    });

    it('should apply defaults for optional fields', () => {
      const minimalConfig: I18nConfig = {
        locales: ['en'],
        defaultLocale: 'en',
      };

      setI18nConfig(minimalConfig);
      const config = getI18nConfig();

      expect(config.localePrefix).toBe('as-needed');
      expect(config.localeDetection).toBe(true);
      expect(config.rtlLocales).toEqual([]);
    });
  });

  describe('getLocales', () => {
    it('should return configured locales', () => {
      setI18nConfig(mockConfig);
      expect(getLocales()).toEqual(['en', 'fr', 'es']);
    });
  });

  describe('getDefaultLocale', () => {
    it('should return default locale', () => {
      setI18nConfig(mockConfig);
      expect(getDefaultLocale()).toBe('en');
    });
  });

  describe('getLocalePrefix', () => {
    it('should return locale prefix mode', () => {
      setI18nConfig(mockConfig);
      expect(getLocalePrefix()).toBe('as-needed');
    });

    it('should return default "as-needed" when not specified', () => {
      setI18nConfig({ locales: ['en'], defaultLocale: 'en' });
      expect(getLocalePrefix()).toBe('as-needed');
    });
  });

  describe('getLocaleNames', () => {
    it('should return locale names', () => {
      setI18nConfig(mockConfig);
      expect(getLocaleNames()).toEqual({
        en: 'English',
        fr: 'Français',
        es: 'Español',
      });
    });

    it('should return empty object when not configured', () => {
      setI18nConfig({ locales: ['en'], defaultLocale: 'en' });
      expect(getLocaleNames()).toEqual({});
    });
  });

  describe('getLocaleLabels', () => {
    it('should return locale labels', () => {
      setI18nConfig(mockConfig);
      expect(getLocaleLabels()).toEqual({
        en: 'EN',
        fr: 'FR',
        es: 'ES',
      });
    });

    it('should return empty object when not configured', () => {
      setI18nConfig({ locales: ['en'], defaultLocale: 'en' });
      expect(getLocaleLabels()).toEqual({});
    });
  });

  describe('getRtlLocales', () => {
    it('should return RTL locales', () => {
      const configWithRtl: I18nConfig = {
        ...mockConfig,
        rtlLocales: ['ar', 'he'],
      };
      setI18nConfig(configWithRtl);
      expect(getRtlLocales()).toEqual(['ar', 'he']);
    });

    it('should return empty array when not configured', () => {
      setI18nConfig(mockConfig);
      expect(getRtlLocales()).toEqual([]);
    });
  });

  describe('isLocaleDetectionEnabled', () => {
    it('should return locale detection setting', () => {
      setI18nConfig(mockConfig);
      expect(isLocaleDetectionEnabled()).toBe(true);
    });

    it('should default to true', () => {
      setI18nConfig({ locales: ['en'], defaultLocale: 'en' });
      expect(isLocaleDetectionEnabled()).toBe(true);
    });
  });

  describe('getLocaleCookieConfig', () => {
    it('should return cookie config', () => {
      const configWithCookie: I18nConfig = {
        ...mockConfig,
        localeCookie: {
          name: 'CUSTOM_LOCALE',
          maxAge: 90 * 24 * 60 * 60,
          sameSite: 'strict',
        },
      };
      setI18nConfig(configWithCookie);

      const cookieConfig = getLocaleCookieConfig();
      expect(cookieConfig.name).toBe('CUSTOM_LOCALE');
      expect(cookieConfig.maxAge).toBe(90 * 24 * 60 * 60);
      expect(cookieConfig.sameSite).toBe('strict');
    });

    it('should return defaults when not configured', () => {
      setI18nConfig(mockConfig);
      const cookieConfig = getLocaleCookieConfig();

      expect(cookieConfig.name).toBe('NEXT_LOCALE');
      expect(cookieConfig.maxAge).toBe(365 * 24 * 60 * 60);
      expect(cookieConfig.sameSite).toBe('lax');
    });
  });

  describe('isSupportedLocale', () => {
    beforeEach(() => {
      setI18nConfig(mockConfig);
    });

    it('should return true for supported locale', () => {
      expect(isSupportedLocale('en')).toBe(true);
      expect(isSupportedLocale('fr')).toBe(true);
      expect(isSupportedLocale('es')).toBe(true);
    });

    it('should return false for unsupported locale', () => {
      expect(isSupportedLocale('de')).toBe(false);
      expect(isSupportedLocale('ja')).toBe(false);
    });

    it('should be case-sensitive', () => {
      expect(isSupportedLocale('EN')).toBe(false);
      expect(isSupportedLocale('Fr')).toBe(false);
    });
  });

  describe('getLocaleName', () => {
    beforeEach(() => {
      setI18nConfig(mockConfig);
    });

    it('should return locale name', () => {
      expect(getLocaleName('en')).toBe('English');
      expect(getLocaleName('fr')).toBe('Français');
    });

    it('should return locale code when name not configured', () => {
      const configWithoutNames: I18nConfig = {
        locales: ['en', 'fr'],
        defaultLocale: 'en',
      };
      setI18nConfig(configWithoutNames);
      expect(getLocaleName('en')).toBe('en');
    });
  });

  describe('getLocaleLabel', () => {
    beforeEach(() => {
      setI18nConfig(mockConfig);
    });

    it('should return locale label', () => {
      expect(getLocaleLabel('en')).toBe('EN');
      expect(getLocaleLabel('fr')).toBe('FR');
    });

    it('should return uppercase code when label not configured', () => {
      const configWithoutLabels: I18nConfig = {
        locales: ['en', 'fr'],
        defaultLocale: 'en',
      };
      setI18nConfig(configWithoutLabels);
      expect(getLocaleLabel('en')).toBe('EN');
      expect(getLocaleLabel('fr')).toBe('FR');
    });
  });

  describe('type safety', () => {
    it('should have readonly type for locales array', () => {
      // This is enforced by TypeScript at compile time
      // Runtime behavior: arrays are still mutable in JavaScript
      setI18nConfig(mockConfig);
      const locales = getLocales();
      expect(Array.isArray(locales)).toBe(true);
      expect(locales.length).toBe(3);
    });

    it('should have readonly type for rtlLocales array', () => {
      // This is enforced by TypeScript at compile time
      // Runtime behavior: arrays are still mutable in JavaScript
      const configWithRtl: I18nConfig = {
        ...mockConfig,
        rtlLocales: ['ar'],
      };
      setI18nConfig(configWithRtl);
      const rtlLocales = getRtlLocales();
      expect(Array.isArray(rtlLocales)).toBe(true);
      expect(rtlLocales.length).toBe(1);
    });
  });
});
