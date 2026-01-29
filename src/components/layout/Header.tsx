// ABOUTME: Site header from navigation configuration
// ABOUTME: Responsive design with mobile hamburger menu and dynamic dropdowns

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Locale } from '../../lib/i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { type HeaderConfig, type NavItem, type NavLink } from '../../config/navigation.schema';
import { getNavigationString } from '../../lib/navigation';

export interface HeaderProps {
  locale: Locale;
  config: HeaderConfig;
}

export function Header({ locale, config }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const getLabel = (item: { label: { [locale: string]: string } }) =>
    getNavigationString(item.label, locale);

  const getHref = (href: string | { [locale: string]: string }) =>
    typeof href === 'string' ? href : getNavigationString(href, locale);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}${config.logo.href}`}
            className="flex items-center transition-opacity hover:opacity-80"
          >
            {config.logo.image ? (
              <Image
                src={config.logo.image}
                alt={
                  config.logo.imageAlt
                    ? getNavigationString(config.logo.imageAlt, locale)
                    : ''
                }
                width={config.logo.width || 1674}
                height={config.logo.height || 613}
                className="w-auto"
                style={{ height: `${config.logo.displayHeight || 48}px` }}
                priority
              />
            ) : (
              config.logo.text && (
                <span className="text-xl font-bold">
                  {getNavigationString(config.logo.text, locale)}
                </span>
              )
            )}
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {config.mainNav.map((item) => {
              if ('type' in item && item.type === 'dropdown') {
                const isOpen = openDropdown === item.id;
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 flex items-center gap-1"
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : item.id)
                      }
                    >
                      {getLabel(item)}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="w-80 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 p-4">
                          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            {locale === 'fr' ? 'Nos services' : 'Our Services'}
                          </h3>

                          <div className="space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/${locale}${getHref(child.href)}`}
                                className="block px-3 py-2.5 rounded-md hover:bg-slate-50 transition-colors group"
                              >
                                <div className="font-medium text-sm text-slate-900 group-hover:text-primary mb-0.5">
                                  {getLabel(child)}
                                </div>
                                {child.description && (
                                  <div className="text-xs text-slate-500 leading-snug">
                                    {getNavigationString(
                                      child.description,
                                      locale
                                    )}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>

                          {item.cta && (
                            <>
                              <div className="my-2.5 border-t border-slate-200" />

                              <Link
                                href={item.cta.external ? getHref(item.cta.href) : `/${locale}${getHref(item.cta.href)}`}
                                {...(item.cta.external && {
                                  target: '_blank',
                                  rel: 'noopener noreferrer',
                                })}
                                className="block w-full px-3 py-2 text-center text-xs font-medium text-primary hover:text-primary-hover transition-colors rounded-md hover:bg-slate-50"
                              >
                                {getNavigationString(item.cta.label, locale)}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Regular link
              const link = item as NavLink;
              return (
                <Link
                  key={link.id}
                  href={`/${locale}${getHref(link.href)}`}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  {getLabel(link)}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Utility Nav + Language Switcher + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {config.utilityNav.map((item) => (
              <a
                key={item.id}
                href={item.external ? getHref(item.href) : `/${locale}${getHref(item.href)}`}
                {...(item.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
                className="hidden md:inline-block text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                {getLabel(item)}
              </a>
            ))}
            <LanguageSwitcher currentLocale={locale} />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {config.mainNav.map((item) => {
                if ('type' in item && item.type === 'dropdown') {
                  const isOpen = openDropdown === item.id;
                  return (
                    <div key={item.id}>
                      <button
                        className="w-full text-left text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-between"
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : item.id)
                        }
                      >
                        {getLabel(item)}
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="mt-3 ml-2 space-y-2 pb-3 border-b border-slate-200">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/${locale}${getHref(child.href)}`}
                              className="block px-3 py-2.5 rounded-md hover:bg-slate-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="font-medium text-sm text-slate-900 mb-0.5">
                                {getLabel(child)}
                              </div>
                              {child.description && (
                                <div className="text-xs text-slate-500 leading-snug">
                                  {getNavigationString(
                                    child.description,
                                    locale
                                  )}
                                </div>
                              )}
                            </Link>
                          ))}
                          {item.cta && (
                            <Link
                              href={item.cta.external ? item.cta.href : `/${locale}${item.cta.href}`}
                              {...(item.cta.external && {
                                target: '_blank',
                                rel: 'noopener noreferrer',
                              })}
                              className="block w-full px-3 py-2 text-center text-xs font-medium text-primary hover:text-primary-hover transition-colors rounded-md hover:bg-slate-50 mt-2"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {getNavigationString(item.cta.label, locale)}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular link
                const link = item as NavLink;
                return (
                  <Link
                    key={link.id}
                    href={`/${locale}${getHref(link.href)}`}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {getLabel(link)}
                  </Link>
                );
              })}

              {config.utilityNav.map((item) => (
                <a
                  key={item.id}
                  href={item.external ? getHref(item.href) : `/${locale}${getHref(item.href)}`}
                  {...(item.external && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                  className="text-sm font-medium text-primary hover:text-primary-hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {getLabel(item)}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
