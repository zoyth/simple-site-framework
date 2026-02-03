// ABOUTME: Automatically generated table of contents for long-form content
// ABOUTME: Extracts headings from DOM, provides smooth scroll navigation with active tracking

'use client';

import { useEffect, useState } from 'react';
import { cn } from '../lib/utils/cn';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

// Default values as constants to avoid re-creation on every render
const DEFAULT_INCLUDE_LEVELS = [2, 3];

export interface TableOfContentsProps {
  /** CSS selector for content container @default 'article' */
  containerSelector?: string;
  /** Heading levels to include @default [2, 3] */
  includeLevels?: number[];
  /** Additional CSS classes */
  className?: string;
  /** Title for TOC @default 'Table of Contents' */
  title?: string;
}

/**
 * TableOfContents - Auto-generated navigation for long-form content
 *
 * Automatically extracts headings from the page, generates a navigation menu,
 * and highlights the currently visible section.
 *
 * @example
 * ```tsx
 * <aside className="sticky top-24">
 *   <TableOfContents />
 * </aside>
 * ```
 *
 * @example
 * ```tsx
 * // Custom configuration
 * <TableOfContents
 *   title="On This Page"
 *   includeLevels={[2, 3, 4]}
 *   containerSelector="main"
 * />
 * ```
 */
export function TableOfContents({
  containerSelector = 'article',
  includeLevels = DEFAULT_INCLUDE_LEVELS,
  className,
  title = 'Table of Contents',
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Extract headings from DOM
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const headingElements = Array.from(
      container.querySelectorAll(
        includeLevels.map((level) => `h${level}`).join(', ')
      )
    ) as HTMLHeadingElement[];

    const extractedHeadings: Heading[] = headingElements.map((heading, index) => {
      // Ensure heading has an ID for linking
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      return {
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      };
    });

    setHeadings(extractedHeadings);
  }, [containerSelector, includeLevels]);

  // Track active heading with Intersection Observer
  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting heading or the last one above viewport
        let newActiveId = '';

        // Check if any heading is intersecting
        const intersecting = entries.find((entry) => entry.isIntersecting);
        if (intersecting) {
          newActiveId = intersecting.target.id;
        } else {
          // If nothing is intersecting, find the last heading above viewport
          const aboveViewport = entries
            .filter((entry) => entry.boundingClientRect.top < 0)
            .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);

          if (aboveViewport.length > 0) {
            newActiveId = aboveViewport[0].target.id;
          }
        }

        if (newActiveId) {
          setActiveId(newActiveId);
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px', // Trigger when heading is near top
        threshold: [0, 1],
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 96; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={cn('space-y-1', className)} aria-label="Table of contents">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">{title}</h2>

      <ul className="space-y-2 text-sm border-l-2 border-gray-200">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const indent = (heading.level - Math.min(...includeLevels)) * 12;

          return (
            <li key={heading.id} style={{ paddingLeft: `${indent}px` }}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  'block w-full text-left py-1 px-3 -ml-px border-l-2 transition-colors',
                  'hover:text-gray-900 hover:border-gray-400',
                  isActive
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-600'
                )}
                aria-current={isActive ? 'location' : undefined}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
