// ABOUTME: Hero section for homepage with background image and centered text
// ABOUTME: Displays value proposition, CTAs, and trust indicators with micro-interactions

'use client';

import { useRef, useEffect, useState } from 'react';
import { getMotionComponent, useMotionHooks } from '../../lib/utils/motion';
import { type Locale } from '../../lib/i18n/config';
import { Button } from '../ui/Button';
import { type HeroContent } from '../../config/content.schema';
import { getLocalizedString } from '../../lib/content';
import Image from 'next/image';
import { TrustBadges, type Badge } from '../TrustBadges';
import { Icons } from '../Icon';

export interface HeroAnimations {
  /** Animation type for headline */
  headline?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'none';
  /** Animation type for CTA buttons */
  cta?: 'fadeInUp' | 'fadeIn' | 'none';
  /** Stagger delay between elements (seconds) */
  stagger?: number;
  /** Show scroll indicator */
  scrollIndicator?: boolean;
}

export interface HeroSectionProps {
  locale: Locale;
  content: HeroContent;
  /** Animation configuration */
  animations?: HeroAnimations;
  /** Show sticky CTA after scrolling past hero */
  stickyCtaAfterScroll?: boolean;
  /** Trust badges to display */
  trustBadges?: Badge[];
  /** Background effect variant */
  backgroundEffect?: 'none' | 'particles' | 'gradient-shift' | 'mesh';
}

// Scroll Indicator Component
function ScrollIndicator({ onClick }: { onClick: () => void }) {
  const motionHooks = useMotionHooks();
  const prefersReducedMotion = motionHooks.useReducedMotion();
  const MotionButton = getMotionComponent('button');
  const MotionDiv = getMotionComponent('div');

  return (
    <MotionButton
      onClick={onClick}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white cursor-pointer z-20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      aria-label="Scroll for more"
    >
      <MotionDiv
        animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <Icons.ChevronDown size={32} />
      </MotionDiv>
    </MotionButton>
  );
}

export function HeroSection({
  locale,
  content,
  animations = {
    headline: 'fadeInUp',
    cta: 'fadeInUp',
    stagger: 0.2,
    scrollIndicator: true,
  },
  stickyCtaAfterScroll = false,
  trustBadges,
  backgroundEffect = 'none',
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Motion hooks with graceful degradation
  const motionHooks = useMotionHooks();
  const prefersReducedMotion = motionHooks.useReducedMotion();
  const { scrollY } = motionHooks.useScroll();
  const y = motionHooks.useTransform(scrollY, [0, 500], [0, 150]); // Parallax effect

  // Motion components
  const MotionButton = getMotionComponent('button');
  const MotionDiv = getMotionComponent('div');
  const MotionH1 = getMotionComponent('h1');
  const MotionP = getMotionComponent('p');

  const headline = getLocalizedString(content.headline, locale);
  const subheadline = getLocalizedString(content.subheadline, locale);
  const trustLine = content.trustLine ? getLocalizedString(content.trustLine, locale) : null;
  const primaryCta = getLocalizedString(content.cta.primary.text, locale);
  const secondaryCta = content.cta.secondary
    ? getLocalizedString(content.cta.secondary.text, locale)
    : null;

  const variant = content.variant || 'dark';
  const overlayFrom = content.overlayGradient?.from || 'rgba(15, 23, 42, 0.7)';
  const overlayTo = content.overlayGradient?.to || 'rgba(15, 23, 42, 0.5)';

  const primaryHref = content.cta.primary.href.startsWith('http')
    ? content.cta.primary.href
    : `/${locale}${content.cta.primary.href}`;
  const secondaryHref = content.cta.secondary
    ? content.cta.secondary.href.startsWith('http')
      ? content.cta.secondary.href
      : `/${locale}${content.cta.secondary.href}`
    : undefined;

  // Video optimization
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;

      // Pause video when out of viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (videoRef.current) {
              if (entry.isIntersecting) {
                videoRef.current.play();
              } else {
                videoRef.current.pause();
              }
            }
          });
        },
        { threshold: 0.25 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => observer.disconnect();
    }
  }, []);

  // Scroll tracking for sticky CTA and scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isScrolledPast = rect.bottom < 0;

        setShowStickyCta(isScrolledPast && stickyCtaAfterScroll);
        setShowScrollIndicator(rect.bottom > window.innerHeight * 0.5);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyCtaAfterScroll]);

  // Scroll to next section
  const handleScrollClick = () => {
    if (sectionRef.current) {
      const nextSection = sectionRef.current.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Animation variants
  const headlineVariant = {
    hidden: { opacity: 0, y: animations.headline === 'fadeInUp' ? 30 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const ctaVariant = {
    hidden: { opacity: 0, y: animations.cta === 'fadeInUp' ? 20 : 0 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: (animations.stagger || 0.2) * i + 0.3,
        ease: 'easeOut',
      },
    }),
  };

  // Dark variant (professional services style)
  if (variant === 'dark') {
    return (
      <>
        <section
          ref={sectionRef}
          className="relative flex min-h-[700px] items-center justify-center bg-hero-gradient overflow-hidden"
        >
          {/* Background Video or Image with Parallax */}
          {content.backgroundVideo ? (
            <>
              {/* Video placeholder */}
              {content.backgroundImage && !isVideoLoaded && (
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
                  style={{ backgroundImage: `url(${content.backgroundImage})` }}
                />
              )}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setIsVideoLoaded(true)}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={content.backgroundVideo} type="video/mp4" />
              </video>
            </>
          ) : content.backgroundImage ? (
            <MotionDiv
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${content.backgroundImage})`,
                y: prefersReducedMotion ? 0 : y,
              }}
            />
          ) : null}

          {/* Background Effect */}
          {backgroundEffect === 'gradient-shift' && (
            <MotionDiv
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(255,100,100,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(100,100,255,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 80%, rgba(100,255,100,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(255,100,100,0.3) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Dark Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${overlayFrom.startsWith('var(') || overlayFrom.startsWith('rgba(') || overlayFrom.startsWith('rgb(') ? overlayFrom : `var(--color-${overlayFrom})`}, ${overlayTo.startsWith('var(') || overlayTo.startsWith('rgba(') || overlayTo.startsWith('rgb(') ? overlayTo : `var(--color-${overlayTo})`})`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-8 text-center text-white py-20">
            {/* Headline */}
            <MotionH1
              className="mb-6 text-4xl font-bold md:text-6xl font-condensed leading-tight px-4"
              initial={animations.headline !== 'none' ? 'hidden' : undefined}
              animate={animations.headline !== 'none' ? 'visible' : undefined}
              variants={prefersReducedMotion ? undefined : headlineVariant}
            >
              {headline}
            </MotionH1>

            {/* Subheadline */}
            <MotionP
              className="mb-10 text-xl md:text-2xl font-light max-w-3xl mx-auto px-4 leading-relaxed whitespace-pre-line"
              initial={animations.headline !== 'none' ? 'hidden' : undefined}
              animate={animations.headline !== 'none' ? 'visible' : undefined}
              variants={
                prefersReducedMotion
                  ? undefined
                  : {
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { delay: 0.2, duration: 0.6 } },
                    }
              }
            >
              {subheadline}
            </MotionP>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <MotionDiv
                custom={0}
                initial={animations.cta !== 'none' ? 'hidden' : undefined}
                animate={animations.cta !== 'none' ? 'visible' : undefined}
                variants={prefersReducedMotion ? undefined : ctaVariant}
              >
                <Button
                  variant="filled"
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-white/90 shadow-lg"
                  onClick={() => (window.location.href = primaryHref)}
                >
                  {primaryCta}
                </Button>
              </MotionDiv>

              {content.cta.secondary && secondaryCta && (
                <MotionDiv
                  custom={1}
                  initial={animations.cta !== 'none' ? 'hidden' : undefined}
                  animate={animations.cta !== 'none' ? 'visible' : undefined}
                  variants={prefersReducedMotion ? undefined : ctaVariant}
                >
                  <Button
                    variant="outlined"
                    size="lg"
                    className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-slate-900"
                    onClick={() => (window.location.href = secondaryHref!)}
                  >
                    {secondaryCta}
                  </Button>
                </MotionDiv>
              )}
            </div>

            {/* Trust line */}
            {trustLine && (
              <MotionP
                className="text-sm md:text-base text-white/80 font-light mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {trustLine}
              </MotionP>
            )}

            {/* Trust badges */}
            {trustBadges && trustBadges.length > 0 && (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <TrustBadges badges={trustBadges} variant="color" />
              </MotionDiv>
            )}
          </div>

          {/* Scroll Indicator */}
          {animations.scrollIndicator && showScrollIndicator && (
            <ScrollIndicator onClick={handleScrollClick} />
          )}
        </section>

        {/* Sticky CTA */}
        {showStickyCta && (
          <MotionDiv
            className="fixed top-20 right-6 z-50"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Button
              variant="filled"
              size="md"
              className="bg-primary text-white shadow-2xl"
              onClick={() => (window.location.href = primaryHref)}
            >
              {primaryCta}
            </Button>
          </MotionDiv>
        )}
      </>
    );
  }

  // Split variant (side-by-side layout with image)
  if (variant === 'split') {
    return (
      <>
        <section ref={sectionRef} className="relative min-h-[600px] flex items-center bg-white">
          <div className="container mx-auto px-6 md:px-8 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                {/* Headline */}
                <MotionH1
                  className="mb-6 text-4xl md:text-5xl font-bold text-charcoal leading-tight"
                  initial={animations.headline !== 'none' ? 'hidden' : undefined}
                  animate={animations.headline !== 'none' ? 'visible' : undefined}
                  variants={prefersReducedMotion ? undefined : headlineVariant}
                >
                  {headline}
                </MotionH1>

                {/* Subheadline */}
                <MotionP
                  className="mb-10 text-lg md:text-xl text-charcoal/80 leading-relaxed"
                  initial={animations.headline !== 'none' ? 'hidden' : undefined}
                  animate={animations.headline !== 'none' ? 'visible' : undefined}
                  variants={
                    prefersReducedMotion
                      ? undefined
                      : {
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { delay: 0.2, duration: 0.6 } },
                        }
                  }
                >
                  {subheadline}
                </MotionP>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <MotionDiv
                    custom={0}
                    initial={animations.cta !== 'none' ? 'hidden' : undefined}
                    animate={animations.cta !== 'none' ? 'visible' : undefined}
                    variants={prefersReducedMotion ? undefined : ctaVariant}
                  >
                    <Button
                      variant="filled"
                      size="lg"
                      className="bg-primary text-white hover:bg-primary-hover shadow-lg"
                      onClick={() => (window.location.href = primaryHref)}
                    >
                      {primaryCta}
                    </Button>
                  </MotionDiv>

                  {content.cta.secondary && secondaryCta && (
                    <MotionDiv
                      custom={1}
                      initial={animations.cta !== 'none' ? 'hidden' : undefined}
                      animate={animations.cta !== 'none' ? 'visible' : undefined}
                      variants={prefersReducedMotion ? undefined : ctaVariant}
                    >
                      <Button
                        variant="outlined"
                        size="lg"
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => (window.location.href = secondaryHref!)}
                      >
                        {secondaryCta}
                      </Button>
                    </MotionDiv>
                  )}
                </div>

                {/* Trust line */}
                {trustLine && (
                  <MotionP
                    className="text-sm md:text-base text-charcoal/70 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    {trustLine}
                  </MotionP>
                )}

                {/* Trust badges */}
                {trustBadges && trustBadges.length > 0 && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <TrustBadges badges={trustBadges} variant="color" />
                  </MotionDiv>
                )}
              </div>

              {/* Image with hover effects */}
              {content.backgroundImage && (
                <MotionDiv
                  className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02, rotateY: 2 }}
                >
                  <MotionDiv
                    className="w-full h-full"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
                  >
                    <Image
                      src={content.backgroundImage}
                      alt={headline}
                      fill
                      className="object-cover"
                      priority
                    />
                  </MotionDiv>
                  {/* Animated border overlay */}
                  <MotionDiv
                    className="absolute inset-0 border-4 border-primary/0 rounded-lg"
                    whileHover={{ borderColor: 'rgba(255, 120, 0, 0.3)' }}
                  />
                </MotionDiv>
              )}
            </div>
          </div>
        </section>

        {/* Sticky CTA */}
        {showStickyCta && (
          <MotionDiv
            className="fixed top-20 right-6 z-50"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Button
              variant="filled"
              size="md"
              className="bg-primary text-white shadow-2xl"
              onClick={() => (window.location.href = primaryHref)}
            >
              {primaryCta}
            </Button>
          </MotionDiv>
        )}
      </>
    );
  }

  // Light variant (SaaS/marketing style)
  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-[700px] flex items-center justify-center bg-warm-gray"
      >
        {/* Background Image with Parallax */}
        {content.backgroundImage && (
          <MotionDiv
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${content.backgroundImage})`,
              y: prefersReducedMotion ? 0 : y,
            }}
          />
        )}

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/60" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-8 py-20">
          <div className="max-w-2xl">
            {/* Headline */}
            <MotionH1
              className="mb-6 text-4xl md:text-5xl font-bold text-charcoal leading-tight"
              initial={animations.headline !== 'none' ? 'hidden' : undefined}
              animate={animations.headline !== 'none' ? 'visible' : undefined}
              variants={prefersReducedMotion ? undefined : headlineVariant}
            >
              {headline}
            </MotionH1>

            {/* Subheadline */}
            <MotionP
              className="mb-10 text-lg md:text-xl text-charcoal/80 leading-relaxed"
              initial={animations.headline !== 'none' ? 'hidden' : undefined}
              animate={animations.headline !== 'none' ? 'visible' : undefined}
              variants={
                prefersReducedMotion
                  ? undefined
                  : {
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { delay: 0.2, duration: 0.6 } },
                    }
              }
            >
              {subheadline}
            </MotionP>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <MotionDiv
                custom={0}
                initial={animations.cta !== 'none' ? 'hidden' : undefined}
                animate={animations.cta !== 'none' ? 'visible' : undefined}
                variants={prefersReducedMotion ? undefined : ctaVariant}
              >
                <Button
                  variant="filled"
                  size="lg"
                  className="bg-primary text-white hover:bg-primary-hover shadow-lg"
                  onClick={() => (window.location.href = primaryHref)}
                >
                  {primaryCta}
                </Button>
              </MotionDiv>

              {content.cta.secondary && secondaryCta && (
                <MotionDiv
                  custom={1}
                  initial={animations.cta !== 'none' ? 'hidden' : undefined}
                  animate={animations.cta !== 'none' ? 'visible' : undefined}
                  variants={prefersReducedMotion ? undefined : ctaVariant}
                >
                  <Button
                    variant="outlined"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={() => (window.location.href = secondaryHref!)}
                  >
                    {secondaryCta}
                  </Button>
                </MotionDiv>
              )}
            </div>

            {/* Trust line */}
            {trustLine && (
              <MotionP
                className="text-sm md:text-base text-charcoal/70 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {trustLine}
              </MotionP>
            )}

            {/* Trust badges */}
            {trustBadges && trustBadges.length > 0 && (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <TrustBadges badges={trustBadges} variant="color" />
              </MotionDiv>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        {animations.scrollIndicator && showScrollIndicator && (
          <ScrollIndicator onClick={handleScrollClick} />
        )}
      </section>

      {/* Sticky CTA */}
      {showStickyCta && (
        <MotionDiv
          className="fixed top-20 right-6 z-50"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Button
            variant="filled"
            size="md"
            className="bg-primary text-white shadow-2xl"
            onClick={() => (window.location.href = primaryHref)}
          >
            {primaryCta}
          </Button>
        </MotionDiv>
      )}
    </>
  );
}
