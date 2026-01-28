// ABOUTME: Site footer from navigation configuration
// ABOUTME: Uses brand orange background as per design

import { type Locale } from '../../lib/i18n/config';
import { type FooterConfig } from '../../config/navigation.schema';
import { getNavigationString, replaceVariables } from '../../lib/navigation';

export interface FooterProps {
  locale: Locale;
  config: FooterConfig;
}

export function Footer({ locale, config }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const copyrightText = replaceVariables(
    getNavigationString(config.copyright, locale),
    { year: currentYear.toString() }
  );

  return (
    <footer className="w-full bg-footer-gradient-orange py-6 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Copyright */}
          <p className="text-sm text-center md:text-left">
            {copyrightText}
          </p>

          {/* Links */}
          {config.sections && config.sections.length > 0 && (
            <div className="flex items-center gap-4 text-sm">
              {config.sections[0].links.map((link, index) => (
                <>
                  {index > 0 && <span key={`sep-${index}`}>·</span>}
                  <a
                    key={link.id}
                    href={
                      link.external ? link.href : `/${locale}${link.href}`
                    }
                    {...(link.external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                    className="transition-opacity hover:opacity-80"
                  >
                    {getNavigationString(link.label, locale)}
                  </a>
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
