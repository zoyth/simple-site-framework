// ABOUTME: Tests for security headers generator
// ABOUTME: Verifies default headers, CSP directives, and preset merging

import { describe, it, expect } from 'vitest';
import { generateSecurityHeaders } from './headers';

describe('generateSecurityHeaders', () => {
  it('returns all required security headers with defaults', () => {
    const headers = generateSecurityHeaders();
    const headerMap = Object.fromEntries(headers.map((h) => [h.key, h.value]));

    expect(headerMap['Strict-Transport-Security']).toBe(
      'max-age=63072000; includeSubDomains; preload'
    );
    expect(headerMap['X-Content-Type-Options']).toBe('nosniff');
    expect(headerMap['X-Frame-Options']).toBe('DENY');
    expect(headerMap['X-XSS-Protection']).toBe('0');
    expect(headerMap['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headerMap['Permissions-Policy']).toBeDefined();
    expect(headerMap['Content-Security-Policy']).toBeDefined();
  });

  it('includes restrictive default CSP', () => {
    const headers = generateSecurityHeaders();
    const csp = headers.find((h) => h.key === 'Content-Security-Policy')!.value;

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("style-src 'self'");
  });

  it('merges custom CSP directives with defaults', () => {
    const headers = generateSecurityHeaders({
      contentSecurityPolicy: {
        'script-src': ["'self'", 'https://www.googletagmanager.com'],
        'frame-src': ["'self'", 'https://www.google.com'],
      },
    });
    const csp = headers.find((h) => h.key === 'Content-Security-Policy')!.value;

    expect(csp).toContain('https://www.googletagmanager.com');
    expect(csp).toContain('https://www.google.com');
    // Other defaults remain
    expect(csp).toContain("default-src 'self'");
  });

  it('applies google-analytics preset', () => {
    const headers = generateSecurityHeaders({
      presets: ['google-analytics'],
    });
    const csp = headers.find((h) => h.key === 'Content-Security-Policy')!.value;

    expect(csp).toContain('https://www.googletagmanager.com');
    expect(csp).toContain('https://www.google-analytics.com');
  });

  it('applies google-maps preset', () => {
    const headers = generateSecurityHeaders({
      presets: ['google-maps'],
    });
    const csp = headers.find((h) => h.key === 'Content-Security-Policy')!.value;

    expect(csp).toContain('https://maps.googleapis.com');
    expect(csp).toContain('https://www.google.com');
  });

  it('applies google-fonts preset', () => {
    const headers = generateSecurityHeaders({
      presets: ['google-fonts'],
    });
    const csp = headers.find((h) => h.key === 'Content-Security-Policy')!.value;

    expect(csp).toContain('https://fonts.googleapis.com');
    expect(csp).toContain('https://fonts.gstatic.com');
  });

  it('merges multiple presets together', () => {
    const headers = generateSecurityHeaders({
      presets: ['google-analytics', 'google-fonts'],
    });
    const csp = headers.find((h) => h.key === 'Content-Security-Policy')!.value;

    expect(csp).toContain('https://www.googletagmanager.com');
    expect(csp).toContain('https://fonts.googleapis.com');
  });

  it('custom directives override preset values for the same directive', () => {
    const headers = generateSecurityHeaders({
      presets: ['google-analytics'],
      contentSecurityPolicy: {
        'script-src': ["'self'", 'https://custom.example.com'],
      },
    });
    const csp = headers.find((h) => h.key === 'Content-Security-Policy')!.value;

    // Custom should be present
    expect(csp).toContain('https://custom.example.com');
    // Preset script-src values should also be merged
    expect(csp).toContain('https://www.googletagmanager.com');
  });

  it('includes restrictive default permissions policy', () => {
    const headers = generateSecurityHeaders();
    const pp = headers.find((h) => h.key === 'Permissions-Policy')!.value;

    expect(pp).toContain('camera=()');
    expect(pp).toContain('microphone=()');
    expect(pp).toContain('geolocation=()');
  });
});
