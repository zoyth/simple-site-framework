// ABOUTME: Blog listing page component with tag filtering and responsive grid
// ABOUTME: Renders posts using BlogCard with optional featured section and tag filter bar

'use client';

import { useState, useMemo } from 'react';
import { cn } from '../lib/utils/cn';
import { BlogCard } from './BlogCard';
import { getLocalizedString } from '../lib/content/utils';
import type { BlogPostMetadata } from '../lib/content/blog';
import type { LocalizedString } from '../config/content.schema';

export interface BlogIndexProps {
  /** Current locale */
  locale: string;
  /** Blog posts to display */
  posts: Array<{
    slug: string;
    metadata: BlogPostMetadata;
  }>;
  /** Page title */
  title?: LocalizedString | string;
  /** Page description */
  description?: LocalizedString | string;
  /** Show tag filter bar @default true */
  showTagFilter?: boolean;
  /** BlogCard variant @default 'default' */
  cardVariant?: 'default' | 'horizontal' | 'minimal';
  /** Show featured posts prominently @default true */
  featuredFirst?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function BlogIndex({
  locale,
  posts,
  title,
  description,
  showTagFilter = true,
  cardVariant = 'default',
  featuredFirst = true,
  className,
}: BlogIndexProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const TAG_LIMIT = 8;

  const resolvedTitle = title
    ? typeof title === 'string' ? title : getLocalizedString(title, locale)
    : undefined;

  const resolvedDescription = description
    ? typeof description === 'string' ? description : getLocalizedString(description, locale)
    : undefined;

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const post of posts) {
      for (const tag of post.metadata.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = activeTag
    ? posts.filter((p) => p.metadata.tags.includes(activeTag))
    : posts;

  const featuredPosts = featuredFirst
    ? filteredPosts.filter((p) => p.metadata.featured)
    : [];
  const regularPosts = featuredFirst
    ? filteredPosts.filter((p) => !p.metadata.featured)
    : filteredPosts;

  const isFr = locale === 'fr';

  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16', className)}>
      {/* Header */}
      {(resolvedTitle || resolvedDescription) && (
        <div className="mb-8 sm:mb-12">
          {resolvedTitle && (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              {resolvedTitle}
            </h1>
          )}
          {resolvedDescription && (
            <p className="text-lg text-gray-600">{resolvedDescription}</p>
          )}
        </div>
      )}

      {/* Tag filter */}
      {showTagFilter && allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label={isFr ? 'Filtrer par tag' : 'Filter by tag'}>
          {(showAllTags ? allTags : allTags.slice(0, TAG_LIMIT)).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
                activeTag === tag
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {tag}
            </button>
          ))}
          {allTags.length > TAG_LIMIT && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="px-3 py-1.5 text-sm font-medium text-primary hover:underline"
            >
              {showAllTags
                ? (isFr ? `Afficher moins` : `Show fewer`)
                : (isFr ? `Afficher tout (${allTags.length})` : `Show all (${allTags.length})`)}
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            {isFr ? 'Aucun article trouvé.' : 'No posts found.'}
          </p>
        </div>
      )}

      {/* Featured posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard
                key={post.slug}
                locale={locale}
                title={post.metadata.title}
                excerpt={post.metadata.excerpt}
                image={post.metadata.image}
                imageAlt={post.metadata.imageAlt}
                href={`/${locale}/blog/${post.slug}`}
                author={post.metadata.author}
                date={post.metadata.date}
                readTime={post.metadata.readTime}
                tags={post.metadata.tags}
                variant={cardVariant}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section heading between featured and regular */}
      {featuredPosts.length > 0 && regularPosts.length > 0 && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isFr ? 'Tous les articles' : 'All articles'}
        </h2>
      )}

      {/* Regular posts grid */}
      {regularPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <BlogCard
              key={post.slug}
              locale={locale}
              title={post.metadata.title}
              excerpt={post.metadata.excerpt}
              image={post.metadata.image}
              imageAlt={post.metadata.imageAlt}
              href={`/${locale}/blog/${post.slug}`}
              author={post.metadata.author}
              date={post.metadata.date}
              readTime={post.metadata.readTime}
              tags={post.metadata.tags}
              variant={cardVariant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
