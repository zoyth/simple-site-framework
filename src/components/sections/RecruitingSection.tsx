// ABOUTME: Recruiting section for job opportunities
// ABOUTME: Invites candidates to submit their CV

'use client';

import { type Locale } from '../../lib/i18n/config';
import { Button } from '../ui/Button';

export interface RecruitingSectionProps {
  locale: Locale;
}

export function RecruitingSection({ locale }: RecruitingSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-4xl font-bold text-primary font-condensed">
          {locale === 'fr' ? 'LMKP recrute!' : 'LMKP is hiring!'}
        </h2>

        <p className="mb-4 text-gray-700 max-w-2xl mx-auto">
          {locale === 'fr'
            ? "Nous sommes toujours à la recherche de talents qui désirent mettre leurs compétences au service des entreprises québécoises. Vous souhaitez évoluer dans un environnement dynamique et riche en défis? Vous souhaitez œuvrer en faveur du tissu économique Québécois?"
            : "We are always looking for talented individuals who want to put their skills at the service of Quebec businesses. Would you like to work in a dynamic and challenging environment? Do you want to work for the benefit of Quebec's economic fabric?"}
        </p>

        <p className="mb-8 text-gray-700 max-w-2xl mx-auto font-semibold">
          {locale === 'fr'
            ? 'Rejoignez-nous! Envoyez-nous votre CV!'
            : 'Join us! Send us your CV!'}
        </p>

        <Button
          variant="outlined"
          size="lg"
          className="uppercase"
          onClick={() =>
            (window.location.href =
              'mailto:administration@lmkp.ca?subject=Candidature%20spontan%C3%A9e')
          }
        >
          {locale === 'fr' ? 'Envoyer un CV' : 'Send a CV'}
        </Button>
      </div>
    </section>
  );
}
