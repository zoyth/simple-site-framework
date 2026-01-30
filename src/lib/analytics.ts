// ABOUTME: Comprehensive analytics tracking utility for GA4 via GTM
// ABOUTME: Provides type-safe event tracking for conversions, CTAs, forms, and user interactions

import type { AnalyticsEvent } from '../types/analytics';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

// Re-export types for convenience
export type * from '../types/analytics';

/**
 * Push event to Google Tag Manager dataLayer
 */
function pushToDataLayer(data: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', data);
  }
}

/**
 * Track CTA click events
 * @param ctaLocation - Where the CTA appears (e.g., 'hero', 'pricing', 'mobile_sticky')
 * @param ctaText - The text on the CTA button
 * @param ctaType - Type of CTA (e.g., 'signup', 'trial', 'contact')
 */
export function trackCTAClick(
  ctaLocation: string,
  ctaText: string,
  ctaType: 'signup' | 'trial' | 'contact' | 'download' | 'other' = 'other'
) {
  pushToDataLayer({
    event: 'cta_click',
    event_category: 'cta',
    event_label: `${ctaLocation}_${ctaType}`,
    cta_location: ctaLocation,
    cta_text: ctaText,
    cta_type: ctaType,
  });
}

/**
 * Track form interactions
 * @param formName - Identifier for the form
 * @param action - Form action (start, submit, error, abandon)
 */
export function trackFormEvent(
  formName: string,
  action: 'start' | 'submit' | 'error' | 'abandon',
  metadata?: Record<string, unknown>
) {
  pushToDataLayer({
    event: `form_${action}`,
    event_category: 'form',
    event_label: formName,
    form_name: formName,
    form_action: action,
    ...metadata,
  });
}

/**
 * Track page view (for SPAs and custom tracking)
 * @param pagePath - The page path
 * @param pageTitle - The page title
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  pushToDataLayer({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle,
  });
}

/**
 * Track pricing page interactions
 * @param action - Type of interaction
 */
export function trackPricingEvent(
  action: 'view' | 'calculate' | 'plan_select' | 'currency_change',
  metadata?: Record<string, unknown>
) {
  pushToDataLayer({
    event: 'pricing_interaction',
    event_category: 'engagement',
    event_label: action,
    pricing_action: action,
    ...metadata,
  });
}

/**
 * Track feature page engagement
 * @param featureName - Name of the feature being viewed
 * @param action - Type of engagement
 */
export function trackFeatureEngagement(
  featureName: string,
  action: 'view' | 'video_play' | 'video_complete' | 'cta_click',
  metadata?: Record<string, unknown>
) {
  pushToDataLayer({
    event: 'feature_engagement',
    event_category: 'engagement',
    event_label: `${featureName}_${action}`,
    feature_name: featureName,
    feature_action: action,
    ...metadata,
  });
}

/**
 * Track resource downloads
 * @param resourceName - Name of the resource
 * @param resourceType - Type of resource (pdf, video, etc.)
 */
export function trackResourceDownload(
  resourceName: string,
  resourceType: string
) {
  pushToDataLayer({
    event: 'resource_download',
    event_category: 'engagement',
    event_label: resourceName,
    resource_name: resourceName,
    resource_type: resourceType,
  });
}

/**
 * Track video interactions
 * @param videoTitle - Title of the video
 * @param action - Video action
 */
export function trackVideoEvent(
  videoTitle: string,
  action: 'play' | 'pause' | 'complete' | '25%' | '50%' | '75%',
  metadata?: Record<string, unknown>
) {
  pushToDataLayer({
    event: 'video_interaction',
    event_category: 'engagement',
    event_label: `${videoTitle}_${action}`,
    video_title: videoTitle,
    video_action: action,
    ...metadata,
  });
}

/**
 * Track navigation events
 * @param linkText - Text of the link clicked
 * @param linkUrl - URL of the link
 * @param linkLocation - Where the link appears (header, footer, content)
 */
export function trackNavigation(
  linkText: string,
  linkUrl: string,
  linkLocation: 'header' | 'footer' | 'content' | 'mobile'
) {
  pushToDataLayer({
    event: 'navigation_click',
    event_category: 'navigation',
    event_label: linkText,
    link_text: linkText,
    link_url: linkUrl,
    link_location: linkLocation,
  });
}

/**
 * Track A/B test variant assignment and events
 * @param testId - ID of the A/B test
 * @param variant - Variant assigned (A or B)
 * @param eventName - Name of the event
 */
export function trackABTestEvent(
  testId: string,
  variant: 'A' | 'B',
  eventName: string,
  metadata?: Record<string, unknown>
) {
  pushToDataLayer({
    event: 'ab_test_event',
    event_category: 'ab_test',
    event_label: `${testId}_${variant}_${eventName}`,
    test_id: testId,
    variant: variant,
    test_event: eventName,
    ...metadata,
  });
}

/**
 * Track conversion events (trial signups, purchases, etc.)
 * @param conversionType - Type of conversion
 * @param value - Monetary value (optional)
 */
export function trackConversion(
  conversionType: 'trial_signup' | 'contact' | 'newsletter' | 'other',
  value?: number,
  metadata?: Record<string, unknown>
) {
  pushToDataLayer({
    event: 'conversion',
    event_category: 'conversion',
    event_label: conversionType,
    conversion_type: conversionType,
    value: value,
    ...metadata,
  });
}

/**
 * Track scroll depth
 * @param percentage - Scroll depth percentage (25, 50, 75, 100)
 * @param pagePath - The page path
 */
export function trackScrollDepth(
  percentage: 25 | 50 | 75 | 100,
  pagePath: string
) {
  pushToDataLayer({
    event: 'scroll_depth',
    event_category: 'engagement',
    event_label: `${percentage}%`,
    scroll_percentage: percentage,
    page_path: pagePath,
  });
}

/**
 * Track search events
 * @param searchTerm - The search term
 * @param resultCount - Number of results (optional)
 */
export function trackSearch(searchTerm: string, resultCount?: number) {
  pushToDataLayer({
    event: 'search',
    event_category: 'engagement',
    event_label: searchTerm,
    search_term: searchTerm,
    result_count: resultCount,
  });
}

/**
 * Track outbound link clicks
 * @param url - The external URL
 * @param linkText - Text of the link
 */
export function trackOutboundLink(url: string, linkText: string) {
  pushToDataLayer({
    event: 'outbound_link',
    event_category: 'navigation',
    event_label: url,
    outbound_url: url,
    link_text: linkText,
  });
}

/**
 * Track error events
 * @param errorType - Type of error
 * @param errorMessage - Error message or description
 */
export function trackError(errorType: string, errorMessage: string) {
  pushToDataLayer({
    event: 'error',
    event_category: 'engagement',
    event_label: errorType,
    error_type: errorType,
    error_message: errorMessage,
  });
}
