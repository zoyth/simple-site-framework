// ABOUTME: Tests for ExternalLink MDX component
// ABOUTME: Verifies external links open in new windows and internal links pass through

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExternalLink } from './ExternalLink';

describe('ExternalLink', () => {
  it('adds target="_blank" and rel for https links', () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('adds target="_blank" and rel for http links', () => {
    render(<ExternalLink href="http://example.com">Example</ExternalLink>);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not add target or rel for internal links', () => {
    render(<ExternalLink href="/about">About</ExternalLink>);

    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('does not add target or rel for anchor links', () => {
    render(<ExternalLink href="#section">Section</ExternalLink>);

    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('renders children', () => {
    render(<ExternalLink href="/about">Click me</ExternalLink>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('passes through additional props', () => {
    render(<ExternalLink href="/about" className="custom">Link</ExternalLink>);

    expect(screen.getByRole('link')).toHaveClass('custom');
  });
});
