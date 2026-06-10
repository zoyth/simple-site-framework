// ABOUTME: Tests for the Header component
// ABOUTME: Verifies nav links honor the configured localePrefix mode

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { I18nProvider } from '../I18nProvider';
import type { I18nConfig, LocalePrefix } from '../../lib/i18n/types';
import type { HeaderConfig } from '../../config/navigation.schema';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

const headerConfig: HeaderConfig = {
  logo: { text: { fr: 'Mon Site', en: 'My Site' }, href: '/' },
  mainNav: [
    { id: 'photos', label: { fr: 'Photos', en: 'Photos' }, href: '/photos' },
    {
      id: 'github',
      label: { fr: 'GitHub', en: 'GitHub' },
      href: 'https://github.com/zoyth',
      external: true,
    },
  ],
  utilityNav: [],
};

function renderHeader(localePrefix: LocalePrefix, locale: string, locales: string[] = ['fr', 'en']) {
  const config: I18nConfig = {
    locales,
    defaultLocale: 'fr',
    localePrefix,
  };
  return render(
    <I18nProvider config={config}>
      <Header locale={locale} config={headerConfig} />
    </I18nProvider>
  );
}

function navHref(name: string): string | null {
  return screen.getAllByRole('link', { name })[0].getAttribute('href');
}

describe('Header nav links', () => {
  it('omits the locale prefix when localePrefix is never', () => {
    renderHeader('never', 'fr', ['fr']);
    expect(navHref('Photos')).toBe('/photos');
    expect(navHref('Mon Site')).toBe('/');
  });

  it('always prefixes when localePrefix is always', () => {
    renderHeader('always', 'fr');
    expect(navHref('Photos')).toBe('/fr/photos');
    expect(navHref('Mon Site')).toBe('/fr');
  });

  it('omits the prefix for the default locale when localePrefix is as-needed', () => {
    renderHeader('as-needed', 'fr');
    expect(navHref('Photos')).toBe('/photos');
    expect(navHref('Mon Site')).toBe('/');
  });

  it('prefixes non-default locales when localePrefix is as-needed', () => {
    renderHeader('as-needed', 'en');
    expect(navHref('Photos')).toBe('/en/photos');
    expect(navHref('My Site')).toBe('/en');
  });

  it('leaves external links untouched', () => {
    renderHeader('always', 'fr');
    expect(navHref('GitHub')).toBe('https://github.com/zoyth');
  });
});
