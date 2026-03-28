// ABOUTME: Reusable features grid component for showcasing product capabilities
// ABOUTME: Displays features in categories with icons, descriptions, and benefits

import { ReactNode } from 'react';

export interface Feature {
  id: string;
  icon?: ReactNode;
  name: string;
  description: string;
  benefits?: string[];
  useCases?: string[];
  learnMoreHref?: string;
}

export interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  features: Feature[];
}

interface FeaturesGridProps {
  categories: FeatureCategory[];
  className?: string;
  locale?: string;
}

const labels: Record<string, Record<string, string>> = {
  keyBenefits: {
    fr: 'Avantages clés :',
    en: 'Key Benefits:',
  },
  useCases: {
    fr: 'Cas d\'usage :',
    en: 'Use Cases:',
  },
  learnMore: {
    fr: 'En savoir plus',
    en: 'Learn more',
  },
};

export function FeaturesGrid({ categories, className = '', locale = 'en' }: FeaturesGridProps) {
  return (
    <div className={`py-20 ${className}`}>
      {categories.map((category, categoryIndex) => (
        <section
          key={category.id}
          className={`${categoryIndex % 2 === 0 ? 'bg-white' : 'bg-surface'} py-16`}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
                {category.name}
              </h2>
              <p className="text-lg text-text-muted">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {feature.icon && (
                    <div className="w-12 h-12 mb-4 text-primary">{feature.icon}</div>
                  )}
                  <h3 className="text-xl font-semibold text-text mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-text-muted mb-4">{feature.description}</p>

                  {feature.benefits && feature.benefits.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-text-subtle mb-2">
                        {labels.keyBenefits[locale]}
                      </p>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-text-subtle flex items-start gap-2"
                          >
                            <span className="text-primary mt-1">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feature.useCases && feature.useCases.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-text-subtle mb-2">
                        {labels.useCases[locale]}
                      </p>
                      <ul className="space-y-1">
                        {feature.useCases.map((useCase, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-text-subtle flex items-start gap-2"
                          >
                            <span className="text-text-subtle">•</span>
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feature.learnMoreHref && (
                    <a
                      href={feature.learnMoreHref}
                      className="text-primary hover:text-primary-hover text-sm font-medium inline-flex items-center gap-1 group"
                    >
                      {labels.learnMore[locale]}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
