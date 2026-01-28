// ABOUTME: Contact section with address, hours, and map
// ABOUTME: Provides all contact information and embedded Google Maps

'use client';

import { type Locale } from '../../lib/i18n/config';
import { Button } from '../ui/Button';

export interface ContactSectionProps {
  locale: Locale;
}

export function ContactSection({ locale }: ContactSectionProps) {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="mb-6 text-4xl font-bold text-slate-900 font-condensed text-center">
          {locale === 'fr' ? 'Pour nous rejoindre' : 'Contact us'}
        </h2>
        <div className="h-1 w-16 bg-primary mb-12 mx-auto" />

        <div className="grid gap-16 md:grid-cols-2">
          {/* Contact Information */}
          <div className="max-w-xl">
            <p className="mb-8 text-slate-700 text-lg leading-relaxed">
              {locale === 'fr'
                ? 'Nous vous accueillons dans nos locaux chaleureux situés dans le vieux Montréal'
                : 'We welcome you to our warm offices located in Old Montreal'}
            </p>

            <div className="mb-6">
              <p className="font-semibold text-slate-900 mb-2">
                {locale === 'fr' ? 'Adresse' : 'Address'}
              </p>
              <p className="text-slate-700 text-lg">
                407 Boulevard Saint-Laurent, bureau 902
                <br />
                Montréal, Quebec H2Y 2Y5, Canada
              </p>
            </div>

            <div className="mb-6">
              <p className="font-semibold text-slate-900 mb-2">
                {locale === 'fr' ? 'Téléphone' : 'Phone'}
              </p>
              <a
                href="tel:15143171818"
                className="text-primary hover:underline text-lg font-medium transition-colors"
              >
                +1 (514) 317-1818
              </a>
            </div>

            <div className="mb-8">
              <p className="font-semibold text-slate-900 mb-2">
                {locale === 'fr' ? 'Nos horaires' : 'Our hours'}
              </p>
              <p className="text-slate-700 text-lg">
                {locale === 'fr' ? "Ouvert aujourd'hui" : 'Open today'}: 08h00
                – 17h00
              </p>
              <p className="text-sm text-slate-500 mt-2">
                {locale === 'fr'
                  ? "Pour s'entretenir avec l'un de nos associés, il faut prendre rendez-vous."
                  : 'To meet with one of our partners, an appointment is required.'}
              </p>
            </div>

            <Button
              variant="outlined"
              size="lg"
              className="uppercase"
              onClick={() => (window.location.href = `/${locale}#contact-form`)}
            >
              {locale === 'fr' ? 'Nous écrire un message' : 'Send us a message'}
            </Button>
          </div>

          {/* Map Placeholder */}
          <div className="relative h-[500px] rounded-xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200">
            {/* Google Maps will be embedded here later */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <span className="block text-sm">Google Maps placeholder</span>
                <span className="block text-xs mt-1">
                  407 Blvd Saint-Laurent, Montréal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
