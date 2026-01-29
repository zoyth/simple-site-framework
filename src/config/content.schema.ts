// ABOUTME: Content configuration schema for site content structure
// ABOUTME: Defines the structure for all site content across locales

export interface LocalizedString {
  [locale: string]: string;
}

export interface LocalizedContent {
  [locale: string]: string | React.ReactNode;
}

export interface SiteMetadata {
  siteName: string;
  siteUrl: string;
  defaultLocale: string;
  supportedLocales: string[];
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}

export interface HeroContent {
  headline: LocalizedString;
  subheadline: LocalizedString;
  variant?: 'dark' | 'light';  // dark: white text on dark gradient, light: colored text on light background
  backgroundImage?: string;     // For light variant: shows on right side; for dark: full background
  backgroundVideo?: string;     // Background video URL (takes precedence over backgroundImage)
  cta: {
    primary: {
      text: LocalizedString;
      href: string;
    };
    secondary?: {
      text: LocalizedString;
      href: string;
    };
  };
  trustLine?: LocalizedString;
}

export interface RecognitionContent {
  paragraphs: Array<LocalizedString>;
}

export interface AboutContent {
  heading: LocalizedString;
  dividerLine?: boolean;
  paragraphs: Array<LocalizedString>;
  image?: {
    src: string;
    alt: LocalizedString;
    placeholder?: string;
  };
}

export interface ServiceItem {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  href: string;
  icon?: string;
}

export interface ServicesContent {
  heading: LocalizedString;
  description: LocalizedString;
  dividerLine?: boolean;
  items: ServiceItem[];
  image?: {
    src: string;
    alt: LocalizedString;
    placeholder?: string;
  };
  cta?: {
    text: LocalizedString;
    subtext: LocalizedString;
    button: {
      text: LocalizedString;
      href: string;
    };
  };
}

export interface WhyChooseUsContent {
  heading: LocalizedString;
  dividerLine?: boolean;
  paragraphs: Array<LocalizedString>;
  image?: {
    src: string;
    alt: LocalizedString;
    placeholder?: string;
  };
}

export interface ContactContent {
  heading: LocalizedString;
  description?: LocalizedString;
  form: {
    namePlaceholder: LocalizedString;
    emailPlaceholder: LocalizedString;
    phonePlaceholder: LocalizedString;
    messagePlaceholder: LocalizedString;
    submitButton: LocalizedString;
    successMessage: LocalizedString;
    errorMessage: LocalizedString;
  };
  info: {
    addressLabel: LocalizedString;
    phoneLabel: LocalizedString;
    emailLabel: LocalizedString;
    hoursLabel: LocalizedString;
    hours: LocalizedString;
  };
}

export interface TeamMember {
  name: string;
  title: LocalizedString;
  bio: LocalizedString;
  education: LocalizedString;
  linkedin?: string;
  image?: string;
}

export interface TeamContent {
  heading: LocalizedString;
  members: TeamMember[];
  history: {
    heading: LocalizedString;
    paragraphs: Array<LocalizedString>;
  };
}

export interface ServicePageContent {
  title: LocalizedString;
  description: LocalizedString;
  lead: LocalizedString;
  sections: Array<{
    heading: LocalizedString;
    subsections: Array<{
      title: LocalizedString;
      content: LocalizedString;
    }>;
  }>;
  benefits?: {
    heading: LocalizedString;
    items: Array<{
      title: LocalizedString;
      description: LocalizedString;
    }>;
  };
}

export interface SiteContent {
  metadata: SiteMetadata;
  hero: HeroContent;
  recognition?: RecognitionContent;
  about: AboutContent;
  whyChooseUs: WhyChooseUsContent;
  services: ServicesContent;
  contact?: ContactContent;
  team?: TeamContent;

  // Service pages
  servicePages?: {
    [serviceId: string]: ServicePageContent;
  };
}
