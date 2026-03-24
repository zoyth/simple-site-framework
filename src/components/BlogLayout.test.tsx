// ABOUTME: Tests for BlogLayout component
// ABOUTME: Verifies header, metadata, tags, image, TOC, and back link rendering

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlogLayout } from './BlogLayout';

const defaultProps = {
  title: 'Test Blog Post',
  excerpt: 'A short description of the post',
  author: 'Test Author',
  date: '2026-01-15',
  readTime: 5,
  tags: ['testing', 'blog'],
  locale: 'en',
  children: <p>Blog content here</p>,
};

describe('BlogLayout', () => {
  describe('Header', () => {
    it('renders the title', () => {
      render(<BlogLayout {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Blog Post');
    });

    it('renders the author name', () => {
      render(<BlogLayout {...defaultProps} />);
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });

    it('renders the formatted date in English', () => {
      render(<BlogLayout {...defaultProps} />);
      // toLocaleDateString('en', ...) for 2026-01-15 -> "January 15, 2026"
      expect(screen.getByText(/January 15, 2026/)).toBeInTheDocument();
    });

    it('renders the formatted date in French', () => {
      render(<BlogLayout {...defaultProps} locale="fr" />);
      expect(screen.getByText(/15 janvier 2026/)).toBeInTheDocument();
    });

    it('renders read time in English', () => {
      render(<BlogLayout {...defaultProps} />);
      expect(screen.getByText(/5 min read/)).toBeInTheDocument();
    });

    it('renders read time in French', () => {
      render(<BlogLayout {...defaultProps} locale="fr" />);
      expect(screen.getByText(/5 min de lecture/)).toBeInTheDocument();
    });

    it('renders tags', () => {
      render(<BlogLayout {...defaultProps} />);
      expect(screen.getByText('testing')).toBeInTheDocument();
      expect(screen.getByText('blog')).toBeInTheDocument();
    });
  });

  describe('Author avatar', () => {
    it('renders author avatar when provided', () => {
      render(<BlogLayout {...defaultProps} authorAvatar="/avatar.jpg" />);
      const img = screen.getByAltText('Test Author');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/avatar.jpg');
    });

    it('does not render avatar when not provided', () => {
      render(<BlogLayout {...defaultProps} />);
      expect(screen.queryByAltText('Test Author')).not.toBeInTheDocument();
    });
  });

  describe('Featured image', () => {
    it('renders featured image when provided', () => {
      render(<BlogLayout {...defaultProps} image="/featured.jpg" imageAlt="Featured" />);
      const img = screen.getByAltText('Featured');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/featured.jpg');
    });

    it('does not render featured image when not provided', () => {
      render(<BlogLayout {...defaultProps} />);
      // Only check there's no image with a featured-like alt
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('renders children in a prose container', () => {
      render(<BlogLayout {...defaultProps} />);
      expect(screen.getByText('Blog content here')).toBeInTheDocument();
    });
  });

  describe('Back link', () => {
    it('renders default back link', () => {
      render(<BlogLayout {...defaultProps} />);
      const link = screen.getByText(/Back to blog/i);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '/en/blog');
    });

    it('renders custom back link', () => {
      render(<BlogLayout {...defaultProps} backHref="/custom" backLabel="Go back" />);
      const link = screen.getByText('Go back');
      expect(link.closest('a')).toHaveAttribute('href', '/custom');
    });

    it('renders French back link', () => {
      render(<BlogLayout {...defaultProps} locale="fr" />);
      const link = screen.getByText(/Retour au blog/i);
      expect(link.closest('a')).toHaveAttribute('href', '/fr/blog');
    });
  });

  describe('Custom className', () => {
    it('applies custom className to article', () => {
      const { container } = render(<BlogLayout {...defaultProps} className="custom-class" />);
      expect(container.querySelector('article')).toHaveClass('custom-class');
    });
  });

  describe('Structured data', () => {
    const publisher = { '@type': 'Organization' as const, name: 'Test Org', url: 'https://test.com' };

    it('renders BlogPosting JSON-LD when publisher is provided', () => {
      const { container } = render(
        <BlogLayout {...defaultProps} publisher={publisher} url="https://test.com/blog/test" />
      );
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      const data = JSON.parse(script!.textContent!);
      expect(data['@type']).toBe('BlogPosting');
      expect(data.headline).toBe('Test Blog Post');
      expect(data.datePublished).toBe('2026-01-15');
      expect(data.author).toBe('Test Author');
    });

    it('does not render JSON-LD when publisher is not provided', () => {
      const { container } = render(<BlogLayout {...defaultProps} />);
      expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
    });
  });
});
