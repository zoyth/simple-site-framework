// ABOUTME: Simple Site Framework - Main export
// ABOUTME: Configuration-driven framework for professional service websites

// Configuration schemas
export * from './config';

// Utilities
export * from './lib/theme';
export * from './lib/content';
export * from './lib/navigation';
export * from './lib/i18n';
export * from './lib/utils';
export * from './lib/analytics';
export * from './lib/ab-test';
export * from './lib/forms';
export * from './lib/seo';
export * from './lib/hooks';

// Components
export { AnalyticsTracker } from './components/AnalyticsTracker';
export { TrackedLink } from './components/TrackedLink';
export { FeaturesGrid, type Feature, type FeatureCategory } from './components/FeaturesGrid';

// Export all component prop types for better DX
export type { ButtonProps } from './components/ui/Button';
export type { CardProps } from './components/ui/Card';
export type { InputProps } from './components/ui/Input';
export type { TextareaProps } from './components/ui/Textarea';
export type { BreadcrumbProps, BreadcrumbItem } from './components/ui/Breadcrumb';

export type { HeroSectionProps, HeroAnimations } from './components/sections/HeroSection';
export type { ContactSectionProps, ContactFormConfig, ContactFormData, Location } from './components/sections/ContactSection';
export type { AboutSectionProps } from './components/sections/AboutSection';
export type { ServicesSectionProps } from './components/sections/ServicesSection';
export type { TestimonialSectionProps } from './components/sections/TestimonialSection';
export type { ServicePageLayoutProps } from './components/sections/ServicePageLayout';

export type { HeaderProps } from './components/layout/Header';
export type { FooterProps } from './components/layout/Footer';
export type { LanguageSwitcherProps } from './components/layout/LanguageSwitcher';

export type { SkipLinkProps } from './components/a11y/SkipLink';
export type { A11yAnnouncerProps, AnnouncementPriority } from './components/a11y/A11yAnnouncer';

export type { IconProps, IconName } from './components/Icon';
export type { CodeBlockProps } from './components/CodeBlock';
export type { LazySectionProps } from './components/LazySection';
export type { FormFieldProps } from './components/FormField';
export type { ModalProps } from './components/Modal';
export type { TabsProps } from './components/Tabs';
export type { SelectProps } from './components/Select';
export type { CheckboxProps } from './components/Checkbox';
export type { RadioProps } from './components/Radio';
