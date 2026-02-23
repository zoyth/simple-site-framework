// ABOUTME: Security headers generator for Next.js config
// ABOUTME: Provides sensible defaults and CSP presets for common third-party integrations

type CspDirectives = Record<string, string[]>;

type CspPreset = 'google-analytics' | 'google-maps' | 'google-fonts';

interface SecurityHeader {
  key: string;
  value: string;
}

export interface SecurityHeadersOptions {
  /** Custom CSP directives to merge with defaults */
  contentSecurityPolicy?: CspDirectives;
  /** Preset CSP allowlists for common integrations */
  presets?: CspPreset[];
}

const defaultCsp: CspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
};

const presetCsp: Record<CspPreset, CspDirectives> = {
  'google-analytics': {
    'script-src': [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ],
    'connect-src': [
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://region1.google-analytics.com',
    ],
    'img-src': [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
    ],
  },
  'google-maps': {
    'script-src': ['https://maps.googleapis.com'],
    'frame-src': ['https://www.google.com', 'https://maps.google.com'],
    'img-src': [
      'https://maps.googleapis.com',
      'https://maps.gstatic.com',
    ],
    'connect-src': ['https://maps.googleapis.com'],
  },
  'google-fonts': {
    'style-src': ['https://fonts.googleapis.com'],
    'font-src': ['https://fonts.gstatic.com'],
  },
};

function mergeCspDirectives(...sources: CspDirectives[]): CspDirectives {
  const merged: CspDirectives = {};

  for (const source of sources) {
    for (const [directive, values] of Object.entries(source)) {
      if (!merged[directive]) {
        merged[directive] = [];
      }
      for (const val of values) {
        if (!merged[directive].includes(val)) {
          merged[directive].push(val);
        }
      }
    }
  }

  return merged;
}

function buildCspString(directives: CspDirectives): string {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Generate security headers for Next.js config
 *
 * Returns an array of header objects compatible with Next.js `headers()` config.
 * Includes sensible defaults for all standard security headers.
 *
 * @example
 * ```js
 * // next.config.js
 * const { generateSecurityHeaders } = require('@zoyth/simple-site-framework');
 *
 * module.exports = {
 *   async headers() {
 *     return [{
 *       source: '/(.*)',
 *       headers: generateSecurityHeaders({
 *         presets: ['google-analytics', 'google-fonts'],
 *         contentSecurityPolicy: {
 *           'frame-src': ["'self'", 'https://www.youtube.com'],
 *         },
 *       }),
 *     }];
 *   },
 * };
 * ```
 */
export function generateSecurityHeaders(
  options: SecurityHeadersOptions = {}
): SecurityHeader[] {
  const { contentSecurityPolicy, presets = [] } = options;

  // Build CSP: defaults → presets → custom
  const presetDirectives = presets.map((p) => presetCsp[p]);
  const csp = mergeCspDirectives(
    defaultCsp,
    ...presetDirectives,
    contentSecurityPolicy || {}
  );

  return [
    {
      key: 'Content-Security-Policy',
      value: buildCspString(csp),
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
    {
      key: 'X-XSS-Protection',
      value: '0',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    },
  ];
}
