// ABOUTME: Tests for llms.txt generation utility
// ABOUTME: Verifies index and full-text generation from content pages

import { describe, it, expect } from 'vitest';
import { generateLlmsTxt, generateLlmsFullTxt, type LlmsPage } from './llms-txt';

const pages: LlmsPage[] = [
  {
    title: 'About Us',
    description: 'Learn about our company',
    url: 'https://example.com/about',
    content: '# About Us\n\nWe are a great company.',
  },
  {
    title: 'Privacy Policy',
    description: 'How we handle your data',
    url: 'https://example.com/privacy',
    content: '# Privacy Policy\n\nWe respect your privacy.',
  },
];

describe('generateLlmsTxt', () => {
  it('generates an index with site name as header', () => {
    const result = generateLlmsTxt({ siteName: 'Example', pages });
    expect(result).toContain('# Example');
  });

  it('includes site description when provided', () => {
    const result = generateLlmsTxt({
      siteName: 'Example',
      siteDescription: 'A great website',
      pages,
    });
    expect(result).toContain('> A great website');
  });

  it('lists all pages with title, description, and URL', () => {
    const result = generateLlmsTxt({ siteName: 'Example', pages });
    expect(result).toContain('- [About Us](https://example.com/about)');
    expect(result).toContain('Learn about our company');
    expect(result).toContain('- [Privacy Policy](https://example.com/privacy)');
  });

  it('works with empty pages array', () => {
    const result = generateLlmsTxt({ siteName: 'Example', pages: [] });
    expect(result).toContain('# Example');
    expect(result).not.toContain('- [');
  });
});

describe('generateLlmsFullTxt', () => {
  it('includes all page content', () => {
    const result = generateLlmsFullTxt({ siteName: 'Example', pages });
    expect(result).toContain('We are a great company.');
    expect(result).toContain('We respect your privacy.');
  });

  it('separates pages with URL headers', () => {
    const result = generateLlmsFullTxt({ siteName: 'Example', pages });
    expect(result).toContain('## About Us');
    expect(result).toContain('URL: https://example.com/about');
    expect(result).toContain('## Privacy Policy');
  });

  it('includes site name as header', () => {
    const result = generateLlmsFullTxt({ siteName: 'Example', pages });
    expect(result).toContain('# Example');
  });
});
