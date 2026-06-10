// ABOUTME: Tests for the LanguageSelector component
// ABOUTME: Covers variant auto-detection, single-locale rendering, and nav alignment

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';
import { I18nProvider } from '../I18nProvider';
import type { I18nConfig } from '../../lib/i18n/types';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

function renderWithLocales(locales: string[], currentLocale: string) {
  const config: I18nConfig = {
    locales,
    defaultLocale: locales[0],
    localeNames: { fr: 'Français', en: 'English', es: 'Español' },
  };
  return render(
    <I18nProvider config={config}>
      <LanguageSelector currentLocale={currentLocale} />
    </I18nProvider>
  );
}

describe('LanguageSelector', () => {
  it('renders nothing when only one locale is configured', () => {
    const { container } = renderWithLocales(['fr'], 'fr');
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a text toggle for two locales', () => {
    renderWithLocales(['fr', 'en'], 'fr');
    expect(screen.getByRole('link', { name: 'Switch to English' })).toBeInTheDocument();
  });

  it('renders a dropdown for three or more locales', () => {
    renderWithLocales(['fr', 'en', 'es'], 'fr');
    expect(screen.getByRole('button', { name: 'Select language' })).toBeInTheDocument();
  });
});

describe('LanguageSelector text toggle', () => {
  it('matches the nav item baseline offset (pb-1 + transparent bottom border)', () => {
    renderWithLocales(['fr', 'en'], 'fr');

    const toggle = screen.getByRole('link', { name: 'Switch to English' });
    expect(toggle.className).toContain('pb-1');
    expect(toggle.className).toContain('border-b-2');
    expect(toggle.className).toContain('border-transparent');
  });
});
