// ABOUTME: Navigation configuration schema for site navigation structure
// ABOUTME: Defines the structure for header, footer, and utility navigation

export interface LocalizedString {
  [locale: string]: string;
}

export interface NavLink {
  id: string;
  label: LocalizedString;
  href: string;
  external?: boolean;
  icon?: string;
}

export interface NavDropdownItem extends NavLink {
  description?: LocalizedString;
}

export interface NavDropdown {
  id: string;
  label: LocalizedString;
  type: 'dropdown';
  children: NavDropdownItem[];
}

export type NavItem = NavLink | NavDropdown;

export interface LogoConfig {
  text?: LocalizedString;
  image?: string;
  imageAlt?: LocalizedString;
  href: string;
  width?: number;
  height?: number;
}

export interface HeaderConfig {
  logo: LogoConfig;
  mainNav: NavItem[];
  utilityNav: NavLink[];
}

export interface FooterSection {
  heading?: LocalizedString;
  links: NavLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: LocalizedString;
}

export interface FooterConfig {
  sections?: FooterSection[];
  copyright: LocalizedString;
  social?: SocialLink[];
}

export interface NavigationConfig {
  header: HeaderConfig;
  footer: FooterConfig;
}
