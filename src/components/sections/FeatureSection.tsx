// ABOUTME: Feature section displaying image + text with alternating layouts
// ABOUTME: Supports left/right image positions, subheadings, descriptions, and CTAs

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type Locale } from '../../lib/i18n/config';
import { getLocalizedString } from '../../lib/content';

export interface FeatureSectionContent {
  id: string;
  heading: { [locale: string]: string };
  subheading?: { [locale: string]: string };
  description: { [locale: string]: string };
  image: string;
  cta?: {
    text: { [locale: string]: string };
    href: string;
  };
  imagePosition?: 'left' | 'right';
}

export interface FeatureSectionProps {
  locale: Locale;
  content: FeatureSectionContent;
  backgroundColor?: string;
}

export function FeatureSection({ locale, content, backgroundColor = 'bg-white' }: FeatureSectionProps) {
  const heading = getLocalizedString(content.heading, locale);
  const subheading = content.subheading ? getLocalizedString(content.subheading, locale) : null;
  const description = getLocalizedString(content.description, locale);
  const ctaText = content.cta ? getLocalizedString(content.cta.text, locale) : null;
  const imagePosition = content.imagePosition || 'right';

  return (
    <section className={`py-20 ${backgroundColor}`}>
      <div className="container mx-auto px-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${imagePosition === 'left' ? 'md:grid-flow-dense' : ''}`}>
          {/* Text Content */}
          <div className={`space-y-6 ${imagePosition === 'left' ? 'md:col-start-2' : ''}`}>
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                {heading}
              </p>
              {subheading && (
                <h2 className="text-3xl md:text-4xl font-bold text-charcoal leading-tight">
                  {subheading}
                </h2>
              )}
            </div>

            <p className="text-lg text-charcoal/80 leading-relaxed">
              {description}
            </p>

            {content.cta && ctaText && (
              <div>
                <Link
                  href={content.cta.href}
                  className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors duration-200"
                >
                  {ctaText}
                </Link>
              </div>
            )}
          </div>

          {/* Image */}
          <div className={`relative h-[400px] md:h-[500px] ${imagePosition === 'left' ? 'md:col-start-1' : ''}`}>
            <Image
              src={content.image}
              alt={heading}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
