// ABOUTME: Customer logos section displaying trusted company logos
// ABOUTME: Shows social proof with client/partner logos in a grid layout

'use client';

import { type Locale } from '../../lib/i18n/config';
import { getLocalizedString } from '../../lib/content';
import Image from 'next/image';

export interface Logo {
  name: string;
  image: string;
  url?: string;
}

export interface LogosContent {
  heading: { [locale: string]: string };
  description?: { [locale: string]: string };
  logos: Logo[];
}

export interface LogosSectionProps {
  locale: Locale;
  content: LogosContent;
}

export function LogosSection({ locale, content }: LogosSectionProps) {
  const heading = getLocalizedString(content.heading, locale);
  const description = content.description ? getLocalizedString(content.description, locale) : null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <h2 className="text-center text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
          {heading}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-center text-charcoal/80 max-w-2xl mx-auto mb-12">
            {description}
          </p>
        )}

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {content.logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              {logo.url ? (
                <a
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Image
                    src={logo.image}
                    alt={logo.name}
                    width={120}
                    height={60}
                    className="max-h-12 w-auto object-contain"
                  />
                </a>
              ) : (
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={120}
                  height={60}
                  className="max-h-12 w-auto object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
