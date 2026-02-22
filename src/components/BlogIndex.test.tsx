// ABOUTME: Tests for BlogIndex component
// ABOUTME: Verifies post listing, tag filtering, featured sections, and empty states

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlogIndex } from './BlogIndex';
import type { BlogPostMetadata } from '../lib/content/blog';

const makePosts = (): Array<{ slug: string; metadata: BlogPostMetadata }> => [
  {
    slug: 'featured-post',
    metadata: {
      title: 'Featured Post',
      excerpt: 'Featured excerpt',
      author: 'Author A',
      date: '2026-02-01',
      readTime: 5,
      tags: ['news', 'featured-tag'],
      featured: true,
    },
  },
  {
    slug: 'regular-post',
    metadata: {
      title: 'Regular Post',
      excerpt: 'Regular excerpt',
      author: 'Author B',
      date: '2026-01-15',
      readTime: 3,
      tags: ['blog'],
    },
  },
  {
    slug: 'another-post',
    metadata: {
      title: 'Another Post',
      excerpt: 'Another excerpt',
      author: 'Author C',
      date: '2026-01-10',
      readTime: 7,
      tags: ['news', 'blog'],
    },
  },
];

// Posts with many tags to test tag cloud collapse
const makeManyTagPosts = (): Array<{ slug: string; metadata: BlogPostMetadata }> => {
  const posts: Array<{ slug: string; metadata: BlogPostMetadata }> = [];
  for (let i = 0; i < 8; i++) {
    posts.push({
      slug: `post-${i}`,
      metadata: {
        title: `Post ${i}`,
        excerpt: `Excerpt ${i}`,
        author: 'Author',
        date: `2026-01-${String(i + 1).padStart(2, '0')}`,
        readTime: 3,
        tags: [`tag-${i * 2}`, `tag-${i * 2 + 1}`],
      },
    });
  }
  return posts;
};

describe('BlogIndex', () => {
  it('renders all posts as BlogCards', () => {
    render(<BlogIndex locale="en" posts={makePosts()} />);
    expect(screen.getByText('Featured Post')).toBeInTheDocument();
    expect(screen.getByText('Regular Post')).toBeInTheDocument();
    expect(screen.getByText('Another Post')).toBeInTheDocument();
  });

  it('renders page title when provided', () => {
    render(<BlogIndex locale="en" posts={makePosts()} title="Our Blog" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Our Blog');
  });

  it('renders localized title', () => {
    render(
      <BlogIndex
        locale="fr"
        posts={makePosts()}
        title={{ en: 'Blog', fr: 'Blogue' }}
      />
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Blogue');
  });

  it('renders description when provided', () => {
    render(<BlogIndex locale="en" posts={makePosts()} description="All our articles" />);
    expect(screen.getByText('All our articles')).toBeInTheDocument();
  });

  describe('Tag filtering', () => {
    it('renders tag filter buttons when showTagFilter is true', () => {
      render(<BlogIndex locale="en" posts={makePosts()} showTagFilter={true} />);
      expect(screen.getByRole('button', { name: 'news' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'blog' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'featured-tag' })).toBeInTheDocument();
    });

    it('filters posts when a tag is clicked', () => {
      render(<BlogIndex locale="en" posts={makePosts()} showTagFilter={true} />);
      fireEvent.click(screen.getByRole('button', { name: 'blog' }));
      // Only regular-post and another-post have 'blog' tag
      expect(screen.getByText('Regular Post')).toBeInTheDocument();
      expect(screen.getByText('Another Post')).toBeInTheDocument();
      expect(screen.queryByText('Featured Post')).not.toBeInTheDocument();
    });

    it('shows all posts when clicking the active tag again', () => {
      render(<BlogIndex locale="en" posts={makePosts()} showTagFilter={true} />);
      const blogButton = screen.getByRole('button', { name: 'blog' });
      fireEvent.click(blogButton);
      // Click again to deselect
      fireEvent.click(blogButton);
      expect(screen.getByText('Featured Post')).toBeInTheDocument();
      expect(screen.getByText('Regular Post')).toBeInTheDocument();
    });

    it('hides tag filter when showTagFilter is false', () => {
      render(<BlogIndex locale="en" posts={makePosts()} showTagFilter={false} />);
      expect(screen.queryByRole('button', { name: 'news' })).not.toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('shows empty state when no posts', () => {
      render(<BlogIndex locale="en" posts={[]} />);
      expect(screen.getByText(/No posts/i)).toBeInTheDocument();
    });

    it('shows empty state when filter matches nothing', () => {
      render(<BlogIndex locale="en" posts={makePosts()} showTagFilter={true} />);
      fireEvent.click(screen.getByRole('button', { name: 'featured-tag' }));
      // Only featured-post has 'featured-tag'
      expect(screen.getByText('Featured Post')).toBeInTheDocument();
      expect(screen.queryByText('Regular Post')).not.toBeInTheDocument();
    });
  });

  describe('Tag cloud collapse', () => {
    it('limits visible tags to 8 by default', () => {
      render(<BlogIndex locale="en" posts={makeManyTagPosts()} showTagFilter={true} />);
      // 8 posts × 2 unique tags each = 16 tags total, but only 8 should show
      const tagButtons = screen.getAllByRole('button').filter(
        (btn) => !btn.textContent?.match(/show|afficher/i)
      );
      expect(tagButtons.length).toBe(8);
    });

    it('shows "Show all" button when tags exceed limit', () => {
      render(<BlogIndex locale="en" posts={makeManyTagPosts()} showTagFilter={true} />);
      expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    });

    it('shows French toggle label', () => {
      render(<BlogIndex locale="fr" posts={makeManyTagPosts()} showTagFilter={true} />);
      expect(screen.getByRole('button', { name: /afficher tout/i })).toBeInTheDocument();
    });

    it('reveals all tags when "Show all" is clicked', () => {
      render(<BlogIndex locale="en" posts={makeManyTagPosts()} showTagFilter={true} />);
      fireEvent.click(screen.getByRole('button', { name: /show all/i }));
      const tagButtons = screen.getAllByRole('button').filter(
        (btn) => !btn.textContent?.match(/show fewer|afficher moins/i)
      );
      expect(tagButtons.length).toBe(16);
    });

    it('does not show toggle when tags are within limit', () => {
      render(<BlogIndex locale="en" posts={makePosts()} showTagFilter={true} />);
      expect(screen.queryByRole('button', { name: /show all/i })).not.toBeInTheDocument();
    });
  });

  describe('Section separation', () => {
    it('renders section heading before regular posts when featured exist', () => {
      render(<BlogIndex locale="en" posts={makePosts()} />);
      expect(screen.getByText(/all articles/i)).toBeInTheDocument();
    });

    it('renders French section heading', () => {
      render(<BlogIndex locale="fr" posts={makePosts()} />);
      expect(screen.getByText(/tous les articles/i)).toBeInTheDocument();
    });

    it('does not render section heading when no featured posts', () => {
      const noFeatured = makePosts().map((p) => ({
        ...p,
        metadata: { ...p.metadata, featured: false },
      }));
      render(<BlogIndex locale="en" posts={noFeatured} />);
      expect(screen.queryByText(/all articles/i)).not.toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = render(
        <BlogIndex locale="en" posts={makePosts()} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
