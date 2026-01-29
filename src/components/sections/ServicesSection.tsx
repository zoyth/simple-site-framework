// ABOUTME: Services section displaying service offerings from content config
// ABOUTME: Shows service categories with descriptions and CTA

'use client';

import { type Locale } from '../../lib/i18n/config';
import { Button } from '../ui/Button';
import { type ServicesContent } from '../../config/content.schema';
import { getLocalizedString } from '../../lib/content';

export interface ServicesSectionProps {
  locale: Locale;
  content: ServicesContent;
}

export function ServicesSection({ locale, content }: ServicesSectionProps) {
  const heading = getLocalizedString(content.heading, locale);
  const description = getLocalizedString(content.description, locale);
  const ctaText = content.cta ? getLocalizedString(content.cta.text, locale) : null;
  const ctaSubtext = content.cta ? getLocalizedString(content.cta.subtext, locale) : null;
  const ctaButton = content.cta ? getLocalizedString(content.cta.button.text, locale) : null;

  const hasImage = content.image?.src;

  return (
    <section className="py-24 bg-brand-gradient-light border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className={hasImage ? "grid gap-16 md:grid-cols-2 items-center" : ""}>
          {/* Image - only render if image source exists */}
          {hasImage && content.image && (
            <div className="relative h-[500px] rounded-xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200">
              <img
                src={content.image.src}
                alt={getLocalizedString(content.image.alt, locale)}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Services List */}
          <div className={hasImage ? "max-w-xl" : "max-w-4xl mx-auto"}>
            <h2 className="mb-4 text-4xl font-bold text-slate-900 font-condensed">
              {heading}
            </h2>
            <p className="mb-6 text-slate-600 text-lg">
              {description}
            </p>
            {content.dividerLine && <div className="h-1 w-16 bg-primary mb-8" />}

            <div className="space-y-6">
              {content.items.map((service) => (
                <div
                  key={service.id}
                  className="group cursor-pointer"
                  onClick={() => (window.location.href = `/${locale}${service.href}`)}
                >
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">
                    {getLocalizedString(service.name, locale)}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    {getLocalizedString(service.description, locale)}
                  </p>
                </div>
              ))}
            </div>

            {content.cta && (
              <div className="mt-12 space-y-4">
                <p className="text-slate-700 text-lg text-center leading-relaxed whitespace-pre-line">
                  {ctaText}
                  {ctaSubtext && (
                    <>
                      <br />
                      {ctaSubtext}
                    </>
                  )}
                </p>
                <div className="text-center">
                  <Button
                    variant="filled"
                    size="lg"
                    onClick={() => (window.location.href = `/${locale}${content.cta!.button.href}`)}
                  >
                    {ctaButton}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
