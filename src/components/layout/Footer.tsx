// ABOUTME: Site footer from navigation configuration
// ABOUTME: Multi-column footer layout with sections and links

import Image from 'next/image';
import { type Locale } from '../../lib/i18n/config';
import { type FooterConfig } from '../../config/navigation.schema';
import { getNavigationString, replaceVariables } from '../../lib/navigation';

export interface FooterProps {
  locale: Locale;
  config: FooterConfig;
}

/**
 * Renders text with language badges (e.g., "(en)" becomes a styled badge)
 */
function renderWithLangBadge(text: string): React.ReactNode {
  // Match patterns like (en), (fr), (es), etc.
  const langPattern = /\(([a-z]{2})\)/gi;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = langPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the badge
    parts.push(
      <span
        key={match.index}
        className="lang-badge inline-block ml-[0.4em] px-[0.4em] py-[0.02em] border border-black/[0.18] rounded-full text-[0.65em] tracking-[0.06em] uppercase opacity-75 group-hover:opacity-100 transition-opacity -translate-y-[0.15em]"
      >
        {match[1]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function Footer({ locale, config }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const copyrightText = replaceVariables(
    getNavigationString(config.copyright, locale),
    { year: currentYear.toString() }
  );

  const getHref = (href: string | { [locale: string]: string }) =>
    typeof href === 'string' ? href : getNavigationString(href, locale);

  const bgClass = config.backgroundColor || 'bg-gray-50';

  return (
    <footer className={`w-full ${bgClass} py-12 text-charcoal`}>
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
                        className="group text-charcoal hover:text-primary transition-colors"
                      >
                        {renderWithLangBadge(getNavigationString(link.label, locale))}
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
            {config.poweredBy && (
              <div className="flex items-center gap-2 text-sm text-charcoal/80">
                {config.poweredBy.href ? (
                  <a
                    href={config.poweredBy.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <span>{getNavigationString(config.poweredBy.text, locale)}</span>
                    {config.poweredBy.logo && (
                      <Image
                        src={config.poweredBy.logo.src}
                        alt={config.poweredBy.logo.alt}
                        width={config.poweredBy.logo.width}
                        height={config.poweredBy.logo.height}
                        className="h-5 w-auto"
                      />
                    )}
                  </a>
                ) : (
                  <>
                    <span>{getNavigationString(config.poweredBy.text, locale)}</span>
                    {config.poweredBy.logo && (
                      <Image
                        src={config.poweredBy.logo.src}
                        alt={config.poweredBy.logo.alt}
                        width={config.poweredBy.logo.width}
                        height={config.poweredBy.logo.height}
                        className="h-5 w-auto"
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
