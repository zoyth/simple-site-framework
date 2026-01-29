// ABOUTME: Testimonial section displaying customer quotes
// ABOUTME: Shows social proof with quotes and attribution on colored background

'use client';

import { type Locale } from '../../lib/i18n/config';
import { getLocalizedString } from '../../lib/content';

export interface TestimonialContent {
  quote: { [locale: string]: string };
  author?: { [locale: string]: string };
  role?: { [locale: string]: string };
  company?: { [locale: string]: string };
}

export interface TestimonialSectionProps {
  locale: Locale;
  content: TestimonialContent;
}

export function TestimonialSection({ locale, content }: TestimonialSectionProps) {
  const quote = getLocalizedString(content.quote, locale);
  const author = content.author ? getLocalizedString(content.author, locale) : null;
  const role = content.role ? getLocalizedString(content.role, locale) : null;
  const company = content.company ? getLocalizedString(content.company, locale) : null;

  return (
    <section className="py-20 bg-warm-gray">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Quote */}
          <blockquote className="text-2xl md:text-3xl italic text-charcoal leading-relaxed mb-8 font-light">
            «{quote}»
          </blockquote>

          {/* Attribution */}
          {(author || role || company) && (
            <div className="text-charcoal/70">
              {author && <p className="font-semibold">{author}</p>}
              {role && <p className="text-sm">{role}</p>}
              {company && <p className="text-sm">{company}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
