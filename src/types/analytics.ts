// ABOUTME: TypeScript type definitions for analytics tracking
// ABOUTME: Ensures type safety across analytics implementation

export type EventCategory =
  | 'cta'
  | 'form'
  | 'navigation'
  | 'engagement'
  | 'conversion'
  | 'ab_test';

export type CTAType = 'signup' | 'trial' | 'contact' | 'download' | 'other';

export type FormAction = 'start' | 'submit' | 'error' | 'abandon';

export type PricingAction = 'view' | 'calculate' | 'plan_select' | 'currency_change';

export type FeatureAction = 'view' | 'video_play' | 'video_complete' | 'cta_click';

export type VideoAction = 'play' | 'pause' | 'complete' | '25%' | '50%' | '75%';

export type NavigationLocation = 'header' | 'footer' | 'content' | 'mobile';

export type ConversionType = 'trial_signup' | 'contact' | 'newsletter' | 'other';

export type ScrollDepth = 25 | 50 | 75 | 100;

export interface AnalyticsEvent {
  event: string;
  event_category?: EventCategory;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
}

export interface CTAClickEvent extends AnalyticsEvent {
  event: 'cta_click';
  event_category: 'cta';
  cta_location: string;
  cta_text: string;
  cta_type: CTAType;
}

export interface FormEvent extends AnalyticsEvent {
  event: `form_${FormAction}`;
  event_category: 'form';
  form_name: string;
  form_action: FormAction;
}

export interface PricingEvent extends AnalyticsEvent {
  event: 'pricing_interaction';
  event_category: 'engagement';
  pricing_action: PricingAction;
}

export interface FeatureEvent extends AnalyticsEvent {
  event: 'feature_engagement';
  event_category: 'engagement';
  feature_name: string;
  feature_action: FeatureAction;
}

export interface VideoEvent extends AnalyticsEvent {
  event: 'video_interaction';
  event_category: 'engagement';
  video_title: string;
  video_action: VideoAction;
}

export interface NavigationEvent extends AnalyticsEvent {
  event: 'navigation_click';
  event_category: 'navigation';
  link_text: string;
  link_url: string;
  link_location: NavigationLocation;
}

export interface ConversionEvent extends AnalyticsEvent {
  event: 'conversion';
  event_category: 'conversion';
  conversion_type: ConversionType;
}

export interface ABTestEvent extends AnalyticsEvent {
  event: 'ab_test_event';
  event_category: 'ab_test';
  test_id: string;
  variant: 'A' | 'B';
  test_event: string;
}

export interface ScrollDepthEvent extends AnalyticsEvent {
  event: 'scroll_depth';
  event_category: 'engagement';
  scroll_percentage: ScrollDepth;
  page_path: string;
}

export interface PageViewEvent extends AnalyticsEvent {
  event: 'page_view';
  page_path: string;
  page_title: string;
}
