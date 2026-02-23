// ABOUTME: Tests for ServicePageLayout breadcrumb JSON-LD auto-injection
// ABOUTME: Verifies structured data output and opt-out behavior

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ServicePageLayout } from './ServicePageLayout';

const breadcrumbItems = [
  { label: 'Home', href: 'https://example.com' },
  { label: 'Services', href: 'https://example.com/services' },
  { label: 'Audit' },
];

const baseProps = {
  locale: 'en' as const,
  title: 'Full Audit',
  description: 'Our audit service',
  breadcrumbItems,
  showCTA: false,
};

describe('ServicePageLayout breadcrumb JSON-LD', () => {
  it('renders BreadcrumbList JSON-LD when breadcrumbItems are provided', () => {
    const { container } = render(<ServicePageLayout {...baseProps} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const jsonLd = JSON.parse(script!.textContent!);
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('BreadcrumbList');
    expect(jsonLd.itemListElement).toHaveLength(3);
  });

  it('maps breadcrumb items correctly to JSON-LD', () => {
    const { container } = render(<ServicePageLayout {...baseProps} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script!.textContent!);

    expect(jsonLd.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com',
    });
    expect(jsonLd.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Services',
      item: 'https://example.com/services',
    });
    expect(jsonLd.itemListElement[2]).toEqual({
      '@type': 'ListItem',
      position: 3,
      name: 'Audit',
    });
  });

  it('does not render JSON-LD when breadcrumbJsonLd is false', () => {
    const { container } = render(
      <ServicePageLayout {...baseProps} breadcrumbJsonLd={false} />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeNull();
  });

  it('renders JSON-LD by default (breadcrumbJsonLd not set)', () => {
    const { container } = render(<ServicePageLayout {...baseProps} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });
});
