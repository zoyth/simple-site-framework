// ABOUTME: Site footer from navigation configuration
// ABOUTME: Multi-column footer layout with sections and links

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

  const getHref = (href: string | { [locale: string]: string }) =>
    typeof href === 'string' ? href : getNavigationString(href, locale);

  return (
    <footer className="w-full bg-[#D5EDE5] py-12 text-charcoal">
      <div className="container mx-auto px-6">
        {/* Footer Sections */}
        {config.sections && config.sections.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            {config.sections.map((section) => (
              <div key={section.heading ? Object.values(section.heading)[0] : 'section'}>
                {section.heading && (
                  <h3 className="text-lg font-bold mb-4 text-charcoal">
                    {getNavigationString(section.heading, locale)}
                  </h3>
                )}
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={
                          link.external ? getHref(link.href) : `/${locale}${getHref(link.href)}`
                        }
                        {...(link.external && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        })}
                        className="text-charcoal hover:text-primary transition-colors"
                      >
                        {getNavigationString(link.label, locale)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Section */}
        <div className="border-t border-charcoal/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm">
              <p className="mb-1">{copyrightText}</p>
              {config.tagline && (
                <p className="text-charcoal/80">
                  {getNavigationString(config.tagline, locale)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-charcoal/80">
              <span>Propulsé par</span>
              <span className="font-semibold text-charcoal">Cakemail</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
