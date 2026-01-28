// ABOUTME: Why Choose Us section from content configuration
// ABOUTME: Displays value proposition with heading, paragraphs, and optional image

import { type Locale } from '../../lib/i18n/config';
import { type WhyChooseUsContent } from '../../config/content.schema';
import { getLocalizedString } from '../../lib/content';

export interface WhyChooseUsSectionProps {
  locale: Locale;
  content: WhyChooseUsContent;
}

export function WhyChooseUsSection({ locale, content }: WhyChooseUsSectionProps) {
  const heading = getLocalizedString(content.heading, locale);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid gap-16 md:grid-cols-2 items-center">
          {/* Image */}
          <div className="relative h-[500px] rounded-xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200 order-2 md:order-1">
            {content.image?.src ? (
              <img
                src={content.image.src}
                alt={getLocalizedString(content.image.alt, locale)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <span className="text-sm">{content.image?.placeholder || 'Image placeholder'}</span>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="order-1 md:order-2 max-w-xl">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 font-condensed">
              {heading}
            </h2>
            {content.dividerLine && <div className="h-1 w-16 bg-primary mb-8" />}

            {content.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-slate-700 leading-relaxed text-lg ${
                  index < content.paragraphs.length - 1 ? 'mb-4' : ''
                }`}
                dangerouslySetInnerHTML={{
                  __html: getLocalizedString(paragraph, locale),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
