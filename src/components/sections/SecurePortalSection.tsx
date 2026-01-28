// ABOUTME: Secure Portal section for client document access
// ABOUTME: Promotes the CCH iFirm secure client portal

'use client';

import { type Locale } from '../../lib/i18n/config';
import { Button } from '../ui/Button';

export interface SecurePortalSectionProps {
  locale: Locale;
  portalUrl: string;
}

export function SecurePortalSection({ locale, portalUrl }: SecurePortalSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-4xl font-bold text-primary font-condensed">
          {locale === 'fr' ? 'Portail sécurisé' : 'Secure Portal'}
        </h2>

        <p className="mb-4 text-gray-700 max-w-2xl mx-auto">
          {locale === 'fr'
            ? 'Chez LMKP, le confort de nos clients est une priorité.'
            : 'At LMKP, client comfort is a priority.'}
        </p>

        <p className="mb-8 text-gray-700 max-w-2xl mx-auto">
          {locale === 'fr'
            ? "Nous avons alors mis en œuvre un portail de documents sécurisé qui facilite l'envoi, l'examen et l'approbation de documents, en pleine collaboration avec nos clients."
            : 'We have implemented a secure document portal that facilitates the sending, review and approval of documents, in full collaboration with our clients.'}
        </p>

        <Button
          variant="outlined"
          size="lg"
          className="uppercase"
          onClick={() => window.open(portalUrl, '_blank')}
        >
          {locale === 'fr'
            ? 'ACCÉDER AU PORTAIL SÉCURISÉ'
            : 'ACCESS SECURE PORTAL'}
        </Button>
      </div>
    </section>
  );
}
