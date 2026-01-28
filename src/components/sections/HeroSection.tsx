// ABOUTME: Hero section for homepage with background image and centered text
// ABOUTME: Displays value proposition, CTAs, and trust indicators from content config

'use client';

import { type Locale } from '../../lib/i18n/config';
import { Button } from '../ui/Button';
import { type HeroContent } from '../../config/content.schema';
import { getLocalizedString } from '../../lib/content';
import Image from 'next/image';

export interface HeroSectionProps {
  locale: Locale;
  content: HeroContent;
}

export function HeroSection({ locale, content }: HeroSectionProps) {
  const headline = getLocalizedString(content.headline, locale);
  const subheadline = getLocalizedString(content.subheadline, locale);
  const trustLine = content.trustLine ? getLocalizedString(content.trustLine, locale) : null;
  const primaryCta = getLocalizedString(content.cta.primary.text, locale);
  const secondaryCta = content.cta.secondary
    ? getLocalizedString(content.cta.secondary.text, locale)
    : null;

  const variant = content.variant || 'dark';

  // Dark variant (professional services style)
  if (variant === 'dark') {
    return (
      <section className="relative flex min-h-[700px] items-center justify-center bg-hero-gradient">
        {/* Background Image */}
        {content.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${content.backgroundImage})` }}
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/40" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-8 text-center text-white py-20">
          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold md:text-6xl font-condensed leading-tight px-4">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-xl md:text-2xl font-light max-w-3xl mx-auto px-4 leading-relaxed whitespace-pre-line">
            {subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              variant="filled"
              size="lg"
              className="bg-white text-slate-900 hover:bg-white/90 shadow-lg"
              onClick={() => (window.location.href = `/${locale}${content.cta.primary.href}`)}
            >
              {primaryCta}
            </Button>

            {content.cta.secondary && secondaryCta && (
              <Button
                variant="outlined"
                size="lg"
                className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-slate-900"
                onClick={() => (window.location.href = content.cta.secondary!.href)}
              >
                {secondaryCta}
              </Button>
            )}
          </div>

          {/* Trust line */}
          {trustLine && (
            <p className="text-sm md:text-base text-white/80 font-light">
              {trustLine}
            </p>
          )}
        </div>
      </section>
    );
  }

  // Light variant (SaaS/marketing style)
  return (
    <section className="relative min-h-[600px] bg-warm-gray">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary-dark leading-tight">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-charcoal leading-relaxed">
              {subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="filled"
                size="lg"
                className="bg-primary text-white hover:bg-primary-hover shadow-lg"
                onClick={() => (window.location.href = `/${locale}${content.cta.primary.href}`)}
              >
                {primaryCta}
              </Button>

              {content.cta.secondary && secondaryCta && (
                <Button
                  variant="outlined"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => (window.location.href = content.cta.secondary!.href)}
                >
                  {secondaryCta}
                </Button>
              )}
            </div>

            {/* Trust line */}
            {trustLine && (
              <p className="text-sm md:text-base text-charcoal/70 pt-4">
                {trustLine}
              </p>
            )}
          </div>

          {/* Right: Image */}
          {content.backgroundImage && (
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src={content.backgroundImage}
                alt={headline}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
