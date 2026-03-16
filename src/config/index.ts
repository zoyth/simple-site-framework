// ABOUTME: Configuration schemas export
// ABOUTME: Central export point for all configuration TypeScript types

export type { ThemeConfig, ThemeConfigV1, ThemeConfigV2 } from './theme.schema';
export { isV1Theme, isV2Theme } from './theme.schema';

export type {
  LocalizedString,
  SiteMetadata,
  ServiceItem,
  HeroContent,
  AboutContent,
  WhyChooseUsContent,
  ServicesContent,
  SiteContent,
} from './content.schema';

export type {
  NavLink,
  NavDropdownItem,
  NavDropdown,
  NavItem,
  LogoConfig,
  HeaderConfig,
  FooterConfig,
  FooterSection,
  NavigationConfig,
} from './navigation.schema';

export type { ScriptsConfig } from './scripts.schema';
