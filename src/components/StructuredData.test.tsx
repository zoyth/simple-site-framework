import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StructuredData } from './StructuredData';
import {
  createOrganization,
  createWebSite,
  createFAQPage,
} from '../lib/seo/structured-data';

describe('StructuredData Component', () => {
  it('renders JSON-LD script tag', () => {
    const org = createOrganization({
      name: 'Test Company',
      url: 'https://test.com',
    });

    render(<StructuredData data={org} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });

  it('renders structured data with correct content', () => {
    const org = createOrganization({
      name: 'Test Company',
      url: 'https://test.com',
      logo: 'https://test.com/logo.png',
    });

    render(<StructuredData data={org} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const content = script?.textContent;

    expect(content).toBeTruthy();

    const parsed = JSON.parse(content!);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('Organization');
    expect(parsed.name).toBe('Test Company');
    expect(parsed.url).toBe('https://test.com');
    expect(parsed.logo).toBe('https://test.com/logo.png');
  });

  it('renders multiple structured data objects as @graph', () => {
    const org = createOrganization({
      name: 'Test Company',
      url: 'https://test.com',
    });

    const website = createWebSite({
      name: 'Test Site',
      url: 'https://test.com',
    });

    render(<StructuredData data={[org, website]} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const content = script?.textContent;
    const parsed = JSON.parse(content!);

    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@graph']).toHaveLength(2);
    expect(parsed['@graph'][0]['@type']).toBe('Organization');
    expect(parsed['@graph'][1]['@type']).toBe('WebSite');
  });

  it('renders FAQ page structured data', () => {
    const faq = createFAQPage([
      { question: 'What is this?', answer: 'This is a test' },
      { question: 'Why test?', answer: 'To ensure quality' },
    ]);

    render(<StructuredData data={faq} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const content = script?.textContent;
    const parsed = JSON.parse(content!);

    expect(parsed['@type']).toBe('FAQPage');
    expect(parsed.mainEntity).toHaveLength(2);
    expect(parsed.mainEntity[0].name).toBe('What is this?');
    expect(parsed.mainEntity[0].acceptedAnswer.text).toBe('This is a test');
  });

  it('produces valid JSON without errors', () => {
    const org = createOrganization({
      name: 'Test',
      url: 'https://test.com',
      sameAs: ['https://twitter.com/test', 'https://facebook.com/test'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Main St',
        addressLocality: 'Test City',
      },
    });

    render(<StructuredData data={org} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const content = script?.textContent;

    // Should not throw when parsing
    expect(() => JSON.parse(content!)).not.toThrow();
  });
});
