// ABOUTME: Tests for I18nProvider context and useI18n hook
// ABOUTME: Verifies config propagation, helper derivation, and error on missing provider

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { I18nProvider, useI18n } from './I18nProvider';
import type { I18nConfig } from '../lib/i18n/types';

const testConfig: I18nConfig = {
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
  localeNames: { en: 'English', fr: 'Fran\u00e7ais', es: 'Espa\u00f1ol' },
  localeLabels: { en: 'EN', fr: 'FR', es: 'ES' },
  rtlLocales: [],
  localeCookie: { name: 'NEXT_LOCALE', maxAge: 31536000, sameSite: 'lax' },
  slugTranslations: {
    en: { '/about': '/a-propos' },
    fr: { '/a-propos': '/about' },
  },
};

describe('I18nProvider', () => {
  it('renders children', () => {
    render(
      <I18nProvider config={testConfig}>
        <div data-testid="child">Hello</div>
      </I18nProvider>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('provides config to consumers via useI18n', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={testConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.config).toBe(testConfig);
  });

  it('throws when useI18n is used outside provider', () => {
    // Suppress console.error for the expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useI18n());
    }).toThrow('useI18n must be used within I18nProvider');

    spy.mockRestore();
  });

  it('exposes locales from config', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={testConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.locales).toEqual(['en', 'fr', 'es']);
  });

  it('exposes defaultLocale from config', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={testConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.defaultLocale).toBe('en');
  });

  it('exposes localePrefix from config with default', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={testConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.localePrefix).toBe('as-needed');
  });

  it('defaults localePrefix to as-needed when not set', () => {
    const configWithoutPrefix: I18nConfig = {
      locales: ['en', 'fr'],
      defaultLocale: 'en',
    };

    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={configWithoutPrefix}>{children}</I18nProvider>
      ),
    });

    expect(result.current.localePrefix).toBe('as-needed');
  });

  it('exposes localeNames from config with default', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={testConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.localeNames).toEqual({
      en: 'English',
      fr: 'Fran\u00e7ais',
      es: 'Espa\u00f1ol',
    });
  });

  it('defaults localeNames to empty object when not set', () => {
    const minimalConfig: I18nConfig = {
      locales: ['en', 'fr'],
      defaultLocale: 'en',
    };

    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={minimalConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.localeNames).toEqual({});
  });

  it('exposes localeLabels from config with default', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={testConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.localeLabels).toEqual({
      en: 'EN',
      fr: 'FR',
      es: 'ES',
    });
  });

  it('defaults localeLabels to empty object when not set', () => {
    const minimalConfig: I18nConfig = {
      locales: ['en', 'fr'],
      defaultLocale: 'en',
    };

    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={minimalConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.localeLabels).toEqual({});
  });

  it('exposes translateSlug that uses config translations', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={testConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.translateSlug('/about', 'en', 'fr')).toBe('/a-propos');
    expect(result.current.translateSlug('/a-propos', 'fr', 'en')).toBe('/about');
  });

  it('translateSlug passes through unknown paths', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={testConfig}>{children}</I18nProvider>
      ),
    });

    expect(result.current.translateSlug('/unknown', 'en', 'fr')).toBe('/unknown');
  });

  it('translateSlug accepts custom translations as override', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider config={testConfig}>{children}</I18nProvider>
      ),
    });

    const custom = { en: { '/about': '/notre-equipe' } };
    expect(result.current.translateSlug('/about', 'en', 'fr', custom)).toBe('/notre-equipe');
  });

  it('config updates propagate to consumers', () => {
    const config1: I18nConfig = {
      locales: ['en', 'fr'],
      defaultLocale: 'en',
      localeNames: { en: 'English', fr: 'Fran\u00e7ais' },
    };
    const config2: I18nConfig = {
      locales: ['en', 'fr', 'de'],
      defaultLocale: 'en',
      localeNames: { en: 'English', fr: 'Fran\u00e7ais', de: 'Deutsch' },
    };

    function Consumer() {
      const { locales } = useI18n();
      return <div data-testid="locales">{locales.join(',')}</div>;
    }

    const { rerender } = render(
      <I18nProvider config={config1}>
        <Consumer />
      </I18nProvider>
    );

    expect(screen.getByTestId('locales')).toHaveTextContent('en,fr');

    rerender(
      <I18nProvider config={config2}>
        <Consumer />
      </I18nProvider>
    );

    expect(screen.getByTestId('locales')).toHaveTextContent('en,fr,de');
  });
});
