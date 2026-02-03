// ABOUTME: Case study showcase component for social proof
// ABOUTME: Displays customer success stories with results and testimonials

'use client';

import { ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';
import type { LocalizedString } from '../../lib/i18n/types';
import { getLocalizedString } from '../../lib/content/utils';

/**
 * Metric for displaying results/improvements
 */
export interface CaseStudyMetric {
  /** Metric label (e.g., "Revenue Growth", "Time Saved") */
  label: LocalizedString | string;
  /** Metric value (e.g., "150%", "$2M", "20 hours/week") */
  value: LocalizedString | string;
  /** Optional icon name from lucide-react */
  icon?: string;
}

/**
 * Individual case study data
 */
export interface CaseStudy {
  /** Unique identifier */
  id: string;
  /** Company/customer name */
  company: LocalizedString | string;
  /** Company logo URL */
  logo?: string;
  /** Customer photo/avatar URL */
  image?: string;
  /** Industry or category */
  industry?: LocalizedString | string;
  /** Quote or testimonial */
  quote: LocalizedString | string;
  /** Person who gave the quote */
  author?: {
    name: string;
    title?: LocalizedString | string;
    avatar?: string;
  };
  /** Key metrics or results */
  metrics?: CaseStudyMetric[];
  /** Challenge or problem statement */
  challenge?: LocalizedString | string;
  /** Solution description */
  solution?: LocalizedString | string;
  /** Full case study URL */
  url?: string;
  /** Call to action text */
  ctaText?: LocalizedString | string;
}

export interface CaseStudySectionProps {
  /** Section title */
  title?: LocalizedString | string;
  /** Section description */
  description?: LocalizedString | string;
  /** Array of case studies to display */
  caseStudies: CaseStudy[];
  /** Current locale for i18n */
  locale?: string;
  /** Layout variant */
  variant?: 'grid' | 'carousel' | 'featured';
  /** Number of columns for grid layout */
  columns?: 2 | 3 | 4;
  /** Additional CSS classes */
  className?: string;
  /** Show metrics section */
  showMetrics?: boolean;
  /** Show challenge/solution sections */
  showDetails?: boolean;
  /** Custom CTA renderer */
  renderCTA?: (caseStudy: CaseStudy) => ReactNode;
}

/**
 * Case Study Section Component
 *
 * Displays customer success stories and testimonials to build trust.
 * Supports multiple layouts and customizable content.
 *
 * @example Basic usage
 * ```tsx
 * <CaseStudySection
 *   title="Customer Success Stories"
 *   description="See how companies achieve results with our platform"
 *   caseStudies={[
 *     {
 *       id: '1',
 *       company: 'Acme Corp',
 *       logo: '/logos/acme.png',
 *       quote: 'Increased our email ROI by 300% in just 3 months',
 *       author: {
 *         name: 'Jane Doe',
 *         title: 'Marketing Director'
 *       },
 *       metrics: [
 *         { label: 'ROI Increase', value: '300%' },
 *         { label: 'Time Saved', value: '15 hrs/week' }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 *
 * @example With challenge/solution
 * ```tsx
 * <CaseStudySection
 *   caseStudies={[
 *     {
 *       id: '1',
 *       company: 'TechStart Inc',
 *       challenge: 'Struggled with low email engagement and deliverability',
 *       solution: 'Implemented our automation and segmentation features',
 *       metrics: [
 *         { label: 'Open Rate', value: '+45%' },
 *         { label: 'Click Rate', value: '+120%' }
 *       ]
 *     }
 *   ]}
 *   showDetails={true}
 * />
 * ```
 */
export function CaseStudySection({
  title,
  description,
  caseStudies,
  locale = 'en',
  variant = 'grid',
  columns = 3,
  className,
  showMetrics = true,
  showDetails = false,
  renderCTA,
}: CaseStudySectionProps) {
  const sectionTitle = title
    ? typeof title === 'string'
      ? title
      : getLocalizedString(title, locale)
    : undefined;

  const sectionDescription = description
    ? typeof description === 'string'
      ? description
      : getLocalizedString(description, locale)
    : undefined;

  return (
    <section className={cn('py-12 sm:py-16 lg:py-20', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(sectionTitle || sectionDescription) && (
          <div className="text-center mb-12 lg:mb-16">
            {sectionTitle && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {sectionTitle}
              </h2>
            )}
            {sectionDescription && (
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                {sectionDescription}
              </p>
            )}
          </div>
        )}

        {/* Case Studies */}
        {variant === 'grid' && (
          <div
            className={cn(
              'grid gap-8',
              columns === 2 && 'md:grid-cols-2',
              columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
              columns === 4 && 'md:grid-cols-2 lg:grid-cols-4'
            )}
          >
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                locale={locale}
                showMetrics={showMetrics}
                showDetails={showDetails}
                renderCTA={renderCTA}
              />
            ))}
          </div>
        )}

        {variant === 'featured' && caseStudies.length > 0 && (
          <div className="space-y-8">
            <FeaturedCaseStudy
              caseStudy={caseStudies[0]}
              locale={locale}
              showMetrics={showMetrics}
              showDetails={showDetails}
              renderCTA={renderCTA}
            />
            {caseStudies.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.slice(1).map((caseStudy) => (
                  <CaseStudyCard
                    key={caseStudy.id}
                    caseStudy={caseStudy}
                    locale={locale}
                    showMetrics={showMetrics}
                    showDetails={false}
                    renderCTA={renderCTA}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  locale: string;
  showMetrics: boolean;
  showDetails: boolean;
  renderCTA?: (caseStudy: CaseStudy) => ReactNode;
}

function CaseStudyCard({
  caseStudy,
  locale,
  showMetrics,
  showDetails,
  renderCTA,
}: CaseStudyCardProps) {
  const company =
    typeof caseStudy.company === 'string'
      ? caseStudy.company
      : getLocalizedString(caseStudy.company, locale);

  const quote =
    typeof caseStudy.quote === 'string'
      ? caseStudy.quote
      : getLocalizedString(caseStudy.quote, locale);

  const industry = caseStudy.industry
    ? typeof caseStudy.industry === 'string'
      ? caseStudy.industry
      : getLocalizedString(caseStudy.industry, locale)
    : undefined;

  const challenge = caseStudy.challenge
    ? typeof caseStudy.challenge === 'string'
      ? caseStudy.challenge
      : getLocalizedString(caseStudy.challenge, locale)
    : undefined;

  const solution = caseStudy.solution
    ? typeof caseStudy.solution === 'string'
      ? caseStudy.solution
      : getLocalizedString(caseStudy.solution, locale)
    : undefined;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 sm:p-8 flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        {caseStudy.logo && (
          <img
            src={caseStudy.logo}
            alt={`${company} logo`}
            className="h-8 sm:h-10 w-auto mb-4 object-contain"
          />
        )}
        <h3 className="text-xl sm:text-2xl font-bold mb-2">{company}</h3>
        {industry && <p className="text-sm text-gray-600">{industry}</p>}
      </div>

      {/* Quote */}
      <blockquote className="flex-1 mb-6">
        <p className="text-base sm:text-lg text-gray-700 italic leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
      </blockquote>

      {/* Author */}
      {caseStudy.author && (
        <div className="flex items-center mb-6">
          {caseStudy.author.avatar && (
            <img
              src={caseStudy.author.avatar}
              alt={caseStudy.author.name}
              className="w-12 h-12 rounded-full mr-3 object-cover"
            />
          )}
          <div>
            <p className="font-semibold text-gray-900">{caseStudy.author.name}</p>
            {caseStudy.author.title && (
              <p className="text-sm text-gray-600">
                {typeof caseStudy.author.title === 'string'
                  ? caseStudy.author.title
                  : getLocalizedString(caseStudy.author.title, locale)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Challenge/Solution */}
      {showDetails && (challenge || solution) && (
        <div className="mb-6 space-y-4">
          {challenge && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Challenge</h4>
              <p className="text-sm text-gray-700">{challenge}</p>
            </div>
          )}
          {solution && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Solution</h4>
              <p className="text-sm text-gray-700">{solution}</p>
            </div>
          )}
        </div>
      )}

      {/* Metrics */}
      {showMetrics && caseStudy.metrics && caseStudy.metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {caseStudy.metrics.map((metric, index) => {
            const label =
              typeof metric.label === 'string'
                ? metric.label
                : getLocalizedString(metric.label, locale);
            const value =
              typeof metric.value === 'string'
                ? metric.value
                : getLocalizedString(metric.value, locale);

            return (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">{value}</p>
                <p className="text-xs sm:text-sm text-gray-600">{label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA */}
      {renderCTA ? (
        renderCTA(caseStudy)
      ) : caseStudy.url ? (
        <a
          href={caseStudy.url}
          className="inline-flex items-center justify-center text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          {caseStudy.ctaText
            ? typeof caseStudy.ctaText === 'string'
              ? caseStudy.ctaText
              : getLocalizedString(caseStudy.ctaText, locale)
            : 'Read Full Story'}
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      ) : null}
    </div>
  );
}

function FeaturedCaseStudy({
  caseStudy,
  locale,
  showMetrics,
  showDetails,
  renderCTA,
}: CaseStudyCardProps) {
  const company =
    typeof caseStudy.company === 'string'
      ? caseStudy.company
      : getLocalizedString(caseStudy.company, locale);

  const quote =
    typeof caseStudy.quote === 'string'
      ? caseStudy.quote
      : getLocalizedString(caseStudy.quote, locale);

  const industry = caseStudy.industry
    ? typeof caseStudy.industry === 'string'
      ? caseStudy.industry
      : getLocalizedString(caseStudy.industry, locale)
    : undefined;

  const challenge = caseStudy.challenge
    ? typeof caseStudy.challenge === 'string'
      ? caseStudy.challenge
      : getLocalizedString(caseStudy.challenge, locale)
    : undefined;

  const solution = caseStudy.solution
    ? typeof caseStudy.solution === 'string'
      ? caseStudy.solution
      : getLocalizedString(caseStudy.solution, locale)
    : undefined;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          {caseStudy.logo && (
            <img
              src={caseStudy.logo}
              alt={`${company} logo`}
              className="h-10 sm:h-12 w-auto mb-6 object-contain"
            />
          )}
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">{company}</h3>
          {industry && <p className="text-lg text-gray-600 mb-6">{industry}</p>}

          <blockquote className="mb-8">
            <p className="text-xl sm:text-2xl text-gray-800 italic leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>

          {caseStudy.author && (
            <div className="flex items-center mb-8">
              {caseStudy.author.avatar && (
                <img
                  src={caseStudy.author.avatar}
                  alt={caseStudy.author.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-lg text-gray-900">{caseStudy.author.name}</p>
                {caseStudy.author.title && (
                  <p className="text-gray-600">
                    {typeof caseStudy.author.title === 'string'
                      ? caseStudy.author.title
                      : getLocalizedString(caseStudy.author.title, locale)}
                  </p>
                )}
              </div>
            </div>
          )}

          {renderCTA ? (
            renderCTA(caseStudy)
          ) : caseStudy.url ? (
            <a
              href={caseStudy.url}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              {caseStudy.ctaText
                ? typeof caseStudy.ctaText === 'string'
                  ? caseStudy.ctaText
                  : getLocalizedString(caseStudy.ctaText, locale)
                : 'Read Full Story'}
            </a>
          ) : null}
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center space-y-8">
          {/* Image */}
          {caseStudy.image && (
            <img
              src={caseStudy.image}
              alt={company}
              className="rounded-lg shadow-md w-full h-64 object-cover"
            />
          )}

          {/* Metrics */}
          {showMetrics && caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-6">
              {caseStudy.metrics.map((metric, index) => {
                const label =
                  typeof metric.label === 'string'
                    ? metric.label
                    : getLocalizedString(metric.label, locale);
                const value =
                  typeof metric.value === 'string'
                    ? metric.value
                    : getLocalizedString(metric.value, locale);

                return (
                  <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <p className="text-4xl font-bold text-primary mb-2">{value}</p>
                    <p className="text-sm text-gray-600">{label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Challenge/Solution */}
          {showDetails && (challenge || solution) && (
            <div className="space-y-6 bg-white rounded-lg shadow-sm p-6">
              {challenge && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Challenge</h4>
                  <p className="text-gray-700">{challenge}</p>
                </div>
              )}
              {solution && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Solution</h4>
                  <p className="text-gray-700">{solution}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
