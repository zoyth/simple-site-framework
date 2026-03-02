// ABOUTME: Prose CSS generation for themed long-form content typography
// ABOUTME: Provides presets (minimal, editorial, docs) that derive styles from ThemeConfig

import { type ThemeConfig } from '../../config/theme.schema';

/**
 * Shared Tailwind prose classes used by all content layouts
 *
 * Provides the base typography styling via @tailwindcss/typography.
 * Use with `cn()` in layout components.
 *
 * @example
 * ```tsx
 * <div className={cn(PROSE_CLASSES)}>{children}</div>
 * ```
 */
export const PROSE_CLASSES = [
  'prose prose-gray prose-lg max-w-none',
  'prose-headings:scroll-mt-24',
  'prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4',
  'prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3',
  'prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2',
  'prose-p:text-gray-700 prose-p:leading-relaxed',
  'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
  'prose-strong:text-gray-900 prose-strong:font-semibold',
  'prose-ul:my-6 prose-li:my-2',
  'prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
  'prose-pre:bg-gray-900 prose-pre:text-gray-100',
  'prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:py-2',
  'prose-table:text-sm',
  'sm:prose-lg',
  'prose-headings:break-words',
  'prose-p:break-words',
].join(' ');

/**
 * Generate prose CSS for themed long-form content
 *
 * Returns CSS rules that enhance `@tailwindcss/typography` prose styling.
 * Uses CSS custom properties from `generateThemeCSS()` for colors.
 *
 * Presets:
 * - `'minimal'` — no extra CSS (default), use Tailwind prose utilities only
 * - `'editorial'` — variable-width layout, lead paragraph, heading accents,
 *   styled tables, blockquotes, glossary definitions, gradient HR, themed markers
 * - `'docs'` — variable-width layout, styled tables, glossary definitions,
 *   themed markers (no decorative accents)
 *
 * @param theme - Theme configuration with optional `design.prose` preset
 * @returns CSS string to inject into global styles
 *
 * @example
 * ```tsx
 * // In your root layout
 * const proseCSS = generateProseCSS(theme);
 * <style>{proseCSS}</style>
 * ```
 */
export function generateProseCSS(theme: ThemeConfig): string {
  const preset = theme.design.prose ?? 'minimal';

  if (preset === 'minimal') {
    return '';
  }

  const sections: string[] = [];

  // Variable-width layout (editorial + docs)
  sections.push(variableWidthCSS());

  // Styled tables (editorial + docs)
  sections.push(styledTablesCSS());

  // Glossary-style definitions (editorial + docs)
  sections.push(glossaryDefinitionsCSS());

  // Themed list markers (editorial + docs)
  sections.push(themedListMarkersCSS());

  // Mobile responsive overrides (editorial + docs)
  sections.push(mobileResponsiveCSS());

  if (preset === 'editorial') {
    // Lead paragraph
    sections.push(leadParagraphCSS());

    // Heading accent borders
    sections.push(headingAccentsCSS());

    // Styled blockquotes
    sections.push(styledBlockquotesCSS());

    // Gradient HR
    sections.push(gradientHrCSS());
  }

  return sections.join('\n');
}

function variableWidthCSS(): string {
  return `
.prose > p,
.prose > ul,
.prose > ol,
.prose > h1,
.prose > h3,
.prose > h4 {
  max-width: 65ch;
}

.prose > h2 {
  max-width: 70ch;
}

.prose > table,
.prose > blockquote,
.prose > hr,
.prose > pre {
  max-width: none;
}`;
}

function leadParagraphCSS(): string {
  return `
.prose > h1 + p {
  font-size: 1.5rem;
  line-height: 1.6;
  font-weight: 300;
  max-width: 60ch;
  color: var(--color-slate-800);
}`;
}

function headingAccentsCSS(): string {
  return `
.prose h2 {
  padding-left: 0.75rem;
  border-left: 3px solid var(--color-primary);
}

.prose h3 {
  padding-left: 0.75rem;
  border-left: 2px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
}`;
}

function styledTablesCSS(): string {
  return `
.prose table {
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--color-slate-200);
  border-radius: 12px;
  overflow: hidden;
  font-size: 0.9375rem;
  line-height: 1.6;
  width: 100%;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.prose thead th {
  background: var(--color-primary-dark);
  color: #fff;
  font-weight: 600;
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: none;
}

.prose tbody td {
  padding: 0.625rem 1rem;
  border-top: 1px solid var(--color-slate-200);
  color: var(--color-slate-900);
}

.prose tbody td:first-child {
  font-weight: 600;
}

.prose tbody tr:nth-child(even) {
  background: var(--color-slate-100);
}

.prose tbody tr {
  transition: background-color 0.15s ease;
}

.prose tbody tr:hover {
  background-color: var(--color-slate-200);
}`;
}

function styledBlockquotesCSS(): string {
  return `
.prose blockquote {
  border-left: 3px solid var(--color-primary);
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 3%, transparent), color-mix(in srgb, var(--color-primary-light) 3%, transparent));
  border-radius: 0 8px 8px 0;
  padding: 1.5rem 2rem;
  margin-left: 0;
  margin-right: 0;
}

.prose blockquote p {
  color: var(--color-slate-800);
  font-style: italic;
}`;
}

function glossaryDefinitionsCSS(): string {
  return `
.prose p:has(> strong:only-child) {
  margin-bottom: 0.25rem;
}

.prose p:has(> strong:only-child) + p {
  margin-top: 0;
}`;
}

function gradientHrCSS(): string {
  return `
.prose hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, color-mix(in srgb, var(--color-primary) 20%, transparent), color-mix(in srgb, var(--color-primary-light) 30%, transparent), transparent);
  max-width: none;
  margin: 3.5rem 0;
}`;
}

function themedListMarkersCSS(): string {
  return `
.prose :where(ul > li)::marker {
  color: var(--color-primary);
}

.prose :where(ol > li)::marker {
  color: var(--color-primary);
  font-weight: 600;
}`;
}

function mobileResponsiveCSS(): string {
  return `
@media (max-width: 768px) {
  .prose > p,
  .prose > ul,
  .prose > ol,
  .prose > h1,
  .prose > h2,
  .prose > h3,
  .prose > h4 {
    max-width: none;
  }

  .prose table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}`;
}
