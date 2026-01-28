// ABOUTME: Reusable layout component for service pages
// ABOUTME: Provides consistent structure across all service pages

'use client';

import { type Locale } from '../../lib/i18n/config';
import { Breadcrumb, type BreadcrumbItem } from '../ui/Breadcrumb';
import { Button } from '../ui/Button';
import { type ReactNode } from 'react';

export interface ServicePageLayoutProps {
  locale: Locale;
  title: string;
  description: string;
  children?: ReactNode;
  breadcrumbItems: BreadcrumbItem[];
  showCTA?: boolean;
}

export function ServicePageLayout({
  locale,
  title,
  description,
  children,
  breadcrumbItems,
  showCTA = true,
}: ServicePageLayoutProps) {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-hero-gradient-dark pt-12 pb-16 text-white">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb
              items={breadcrumbItems}
              className="mb-8 text-white"
            />
            <h1 className="mb-4 text-4xl md:text-5xl font-bold font-condensed leading-tight">{title}</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">{description}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-brand-gradient-light">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            {children}

            {/* CTA Section */}
            {showCTA && (
              <div className="mt-16 p-8 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-lg text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 font-condensed">
                  {locale === 'fr'
                    ? 'Besoin de nos services?'
                    : 'Need our services?'}
                </h2>
                <p className="text-slate-700 text-lg mb-6 max-w-2xl mx-auto">
                  {locale === 'fr'
                    ? "Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment nous pouvons vous aider."
                    : 'Contact us today to discuss your needs and discover how we can help you.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="filled"
                    size="lg"
                    onClick={() =>
                      (window.location.href = `/${locale}/contact`)
                    }
                  >
                    {locale === 'fr' ? 'Parlez à un CPA' : 'Talk to a CPA'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="lg"
                    onClick={() => (window.location.href = `/${locale}`)}
                  >
                    {locale === 'fr' ? "Retour à l'accueil" : 'Back to home'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
