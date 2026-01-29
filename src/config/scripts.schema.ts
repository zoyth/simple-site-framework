// ABOUTME: Scripts configuration schema for custom code injection
// ABOUTME: Supports head scripts (analytics, fonts) and body end scripts (widgets, tracking)

export interface ScriptsConfig {
  /**
   * Scripts to inject in the <head> section
   * Use for: Analytics, fonts, meta tags, etc.
   */
  head?: string[];

  /**
   * Scripts to inject before closing </body> tag
   * Use for: Chat widgets, tracking pixels, etc.
   */
  bodyEnd?: string[];
}
