// ABOUTME: Tests for the Footer component
// ABOUTME: Verifies footer links honor the configured localePrefix mode

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { I18nProvider } from '../I18nProvider';
import type { I18nConfig, LocalePrefix } from '../../lib/i18n/types';
import type { FooterConfig } from '../../config/navigation.schema';

const footerConfig: FooterConfig = {
  copyright: { fr: '© {year} Mon Site', en: '© {year} My Site' },
  sections: [
    {
      heading: { fr: 'Liens', en: 'Links' },
      links: [
        { id: 'photos', label: { fr: 'Photos', en: 'Photos' }, href: '/photos' },
        {
          id: 'github',
          label: { fr: 'GitHub', en: 'GitHub' },
          href: 'https://github.com/zoyth',
          external: true,
        },
      ],
    },
  ],
};

function renderFooter(localePrefix: LocalePrefix, locale: string, locales: string[] = ['fr', 'en']) {
  const config: I18nConfig = {
    locales,
    defaultLocale: 'fr',
    localePrefix,
  };
  return render(
    <I18nProvider config={config}>
      <Footer locale={locale} config={footerConfig} />
    </I18nProvider>
  );
}

function linkHref(name: string): string | null {
  return screen.getByRole('link', { name }).getAttribute('href');
}

describe('Footer links', () => {
  it('omits the locale prefix when localePrefix is never', () => {
    renderFooter('never', 'fr', ['fr']);
    expect(linkHref('Photos')).toBe('/photos');
  });

  it('always prefixes when localePrefix is always', () => {
    renderFooter('always', 'fr');
    expect(linkHref('Photos')).toBe('/fr/photos');
  });

  it('omits the prefix for the default locale when localePrefix is as-needed', () => {
    renderFooter('as-needed', 'fr');
    expect(linkHref('Photos')).toBe('/photos');
  });

  it('prefixes non-default locales when localePrefix is as-needed', () => {
    renderFooter('as-needed', 'en');
    expect(linkHref('Photos')).toBe('/en/photos');
  });

  it('leaves external links untouched', () => {
    renderFooter('always', 'fr');
    expect(linkHref('GitHub')).toBe('https://github.com/zoyth');
  });
});
