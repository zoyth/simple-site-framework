// ABOUTME: Personal Taxes section with questionnaire links
// ABOUTME: Provides access to tax questionnaires in both languages

'use client';

import { type Locale } from '../../lib/i18n/config';
import { Button } from '../ui/Button';

export interface PersonalTaxesSectionProps {
  locale: Locale;
}

export function PersonalTaxesSection({ locale }: PersonalTaxesSectionProps) {
  return (
    <section className="py-16 bg-brand-gradient-light">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-8 text-4xl font-bold text-primary font-condensed">
          {locale === 'fr' ? 'Impôts personnels' : 'Personal Taxes'}
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <Button
            variant="outlined"
            size="lg"
            fullWidth
            className="uppercase"
            onClick={() =>
              (window.location.href = `/${locale}/impots-personnels`)
            }
          >
            {locale === 'fr'
              ? 'OBTENIR LES QUESTIONNAIRES EN FRANÇAIS'
              : 'GET QUESTIONNAIRES IN ENGLISH'}
          </Button>
        </div>
      </div>
    </section>
  );
}
