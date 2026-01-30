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

// Components
export { AnalyticsTracker } from './components/AnalyticsTracker';
export { TrackedLink } from './components/TrackedLink';
export { FeaturesGrid, type Feature, type FeatureCategory } from './components/FeaturesGrid';
