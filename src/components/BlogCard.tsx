// ABOUTME: Blog card component for displaying article previews
// ABOUTME: Supports featured images, tags, read time, and hover effects

'use client'

import { ReactNode } from 'react'
import { cn } from '../lib/utils/cn'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface BlogCardProps {
  /** Current locale */
  locale?: 'en' | 'fr'
  /** Article title (bilingual) */
  title: LocalizedString | string
  /** Article excerpt (bilingual) */
  excerpt?: LocalizedString | string
  /** Featured image URL */
  image?: string
  /** Image alt text */
  imageAlt?: string
  /** Article URL */
  href: string
  /** Author name */
  author?: string
  /** Author avatar URL */
  authorAvatar?: string
  /** Publication date */
  date?: string
  /** Read time in minutes */
  readTime?: number
  /** Tags/categories */
  tags?: string[]
  /** Card variant @default 'default' */
  variant?: 'default' | 'horizontal' | 'minimal'
  /** Additional CSS classes */
  className?: string
}

const labels = {
  readTime: { en: 'min read', fr: 'min de lecture' },
  by: { en: 'by', fr: 'par' }
}

/**
 * BlogCard - Article preview card for blog listings
 *
 * Displays article previews with images, metadata, and hover effects.
 * Perfect for blog indexes, related posts, and content grids.
 *
 * @example
 * // Basic usage
 * <BlogCard
 *   title={{ en: "10 Tips for Better UX", fr: "10 conseils pour une meilleure UX" }}
 *   excerpt="Improve your user experience with these proven strategies..."
 *   image="/blog/ux-tips.jpg"
 *   href="/blog/ux-tips"
 *   author="Jane Doe"
 *   date="Jan 15, 2024"
 *   readTime={5}
 *   tags={['UX', 'Design']}
 *   locale="en"
 * />
 *
 * @example
 * // Horizontal variant
 * <BlogCard
 *   title="Latest Product Updates"
 *   excerpt="See what's new in our latest release"
 *   image="/blog/updates.jpg"
 *   href="/blog/updates"
 *   variant="horizontal"
 *   author="Product Team"
 *   authorAvatar="/team/product.jpg"
 *   date="2024-01-20"
 * />
 *
 * @example
 * // Minimal variant (no image)
 * <BlogCard
 *   title="Quick Announcement"
 *   excerpt="Brief update about our services"
 *   href="/blog/announcement"
 *   variant="minimal"
 *   date="Today"
 *   readTime={2}
 * />
 */
export function BlogCard({
  locale = 'en',
  title,
  excerpt,
  image,
  imageAlt,
  href,
  author,
  authorAvatar,
  date,
  readTime,
  tags,
  variant = 'default',
  className = ''
}: BlogCardProps) {
  const titleText = typeof title === 'string' ? title : getLocalizedString(title, locale)
  const excerptText = excerpt
    ? typeof excerpt === 'string'
      ? excerpt
      : getLocalizedString(excerpt, locale)
    : undefined

  if (variant === 'horizontal') {
    return (
      <a
        href={href}
        className={cn(
          'block group bg-white rounded-lg border border-gray-200 overflow-hidden',
          'hover:shadow-lg hover:border-gray-300 transition-all duration-300',
          className
        )}
      >
        <div className="flex flex-col sm:flex-row">
          {image && (
            <div className="sm:w-1/3 flex-shrink-0">
              <div className="relative h-48 sm:h-full overflow-hidden">
                <img
                  src={image}
                  alt={imageAlt || titleText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          )}
          <div className="flex-1 p-6">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading group-hover:text-primary transition-colors">
              {titleText}
            </h3>
            {excerptText && (
              <p className="text-gray-600 mb-4 line-clamp-2 font-body">{excerptText}</p>
            )}
            <BlogMeta
              author={author}
              authorAvatar={authorAvatar}
              date={date}
              readTime={readTime}
              locale={locale}
            />
          </div>
        </div>
      </a>
    )
  }

  if (variant === 'minimal') {
    return (
      <a
        href={href}
        className={cn(
          'block group py-4 border-b border-gray-200',
          'hover:border-primary transition-colors',
          className
        )}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 font-heading group-hover:text-primary transition-colors">
              {titleText}
            </h3>
            {excerptText && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-1 font-body">{excerptText}</p>
            )}
            <BlogMeta
              author={author}
              date={date}
              readTime={readTime}
              locale={locale}
              compact
            />
          </div>
          {tags && tags.length > 0 && (
            <span className="flex-shrink-0 px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded">
              {tags[0]}
            </span>
          )}
        </div>
      </a>
    )
  }

  // Default variant
  return (
    <a
      href={href}
      className={cn(
        'block group bg-white rounded-lg border border-gray-200 overflow-hidden',
        'hover:shadow-lg hover:border-gray-300 transition-all duration-300',
        className
      )}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={imageAlt || titleText}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {tags && tags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs font-semibold text-white bg-gray-900/75 backdrop-blur-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        {!image && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading group-hover:text-primary transition-colors">
          {titleText}
        </h3>
        {excerptText && (
          <p className="text-gray-600 mb-4 line-clamp-3 font-body">{excerptText}</p>
        )}
        <BlogMeta
          author={author}
          authorAvatar={authorAvatar}
          date={date}
          readTime={readTime}
          locale={locale}
        />
      </div>
    </a>
  )
}

function BlogMeta({
  author,
  authorAvatar,
  date,
  readTime,
  locale,
  compact = false
}: {
  author?: string
  authorAvatar?: string
  date?: string
  readTime?: number
  locale: 'en' | 'fr'
  compact?: boolean
}) {
  if (!author && !date && !readTime) return null

  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      {author && (
        <div className="flex items-center gap-2">
          {authorAvatar && !compact && (
            <img
              src={authorAvatar}
              alt={author}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span>
            {compact ? '' : `${getLocalizedString(labels.by, locale)} `}
            {author}
          </span>
        </div>
      )}
      {date && (
        <>
          {author && <span>•</span>}
          <span>{date}</span>
        </>
      )}
      {readTime && (
        <>
          {(author || date) && <span>•</span>}
          <span>
            {readTime} {getLocalizedString(labels.readTime, locale)}
          </span>
        </>
      )}
    </div>
  )
}
