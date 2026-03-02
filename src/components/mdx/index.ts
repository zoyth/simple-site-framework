// ABOUTME: Default MDX component overrides for content rendering
// ABOUTME: Provides sensible defaults like external links opening in new windows

import { ExternalLink } from './ExternalLink';

export { ExternalLink } from './ExternalLink';

/**
 * Default MDX components applied to all content loaded by the framework
 *
 * Includes:
 * - `a`: External links open in new windows with `noopener noreferrer`
 *
 * @example
 * ```tsx
 * import { defaultMdxComponents } from '@zoyth/simple-site-framework/components';
 *
 * // Use as-is
 * const { content } = await loadContent('about', 'en');
 *
 * // Or merge with custom overrides
 * const { content } = await loadContent('about', 'en', {
 *   components: { ...defaultMdxComponents, blockquote: MyBlockquote },
 * });
 * ```
 */
export const defaultMdxComponents: Record<string, React.ComponentType<any>> = {
  a: ExternalLink,
};
