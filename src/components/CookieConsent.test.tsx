// ABOUTME: Tests for CookieConsent component and consent utilities
// ABOUTME: Verifies banner display, consent storage, callbacks, and bilingual support

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CookieConsent,
  resetCookieConsent,
  getConsentStatus,
  CONSENT_STORAGE_KEY,
} from './CookieConsent';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('CookieConsent', () => {
  describe('banner display', () => {
    it('renders banner when no consent is stored', () => {
      render(<CookieConsent locale="en" />);

      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decline/i })).toBeInTheDocument();
    });

    it('does not render when consent was already accepted', () => {
      localStorageMock.setItem(CONSENT_STORAGE_KEY, 'accepted');

      render(<CookieConsent locale="en" />);

      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('does not render when consent was already declined', () => {
      localStorageMock.setItem(CONSENT_STORAGE_KEY, 'declined');

      render(<CookieConsent locale="en" />);

      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });
  });

  describe('accept flow', () => {
    it('hides banner after accept', () => {
      render(<CookieConsent locale="en" />);

      fireEvent.click(screen.getByRole('button', { name: /accept/i }));

      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('stores accepted in localStorage', () => {
      render(<CookieConsent locale="en" />);

      fireEvent.click(screen.getByRole('button', { name: /accept/i }));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        CONSENT_STORAGE_KEY,
        'accepted'
      );
    });

    it('calls onAccept callback', () => {
      const onAccept = vi.fn();
      render(<CookieConsent locale="en" onAccept={onAccept} />);

      fireEvent.click(screen.getByRole('button', { name: /accept/i }));

      expect(onAccept).toHaveBeenCalledOnce();
    });
  });

  describe('decline flow', () => {
    it('hides banner after decline', () => {
      render(<CookieConsent locale="en" />);

      fireEvent.click(screen.getByRole('button', { name: /decline/i }));

      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('stores declined in localStorage', () => {
      render(<CookieConsent locale="en" />);

      fireEvent.click(screen.getByRole('button', { name: /decline/i }));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        CONSENT_STORAGE_KEY,
        'declined'
      );
    });

    it('calls onDecline callback', () => {
      const onDecline = vi.fn();
      render(<CookieConsent locale="en" onDecline={onDecline} />);

      fireEvent.click(screen.getByRole('button', { name: /decline/i }));

      expect(onDecline).toHaveBeenCalledOnce();
    });
  });

  describe('bilingual support', () => {
    it('renders French text when locale is fr', () => {
      render(<CookieConsent locale="fr" />);

      expect(screen.getByRole('button', { name: /accepter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refuser/i })).toBeInTheDocument();
    });

    it('renders English text when locale is en', () => {
      render(<CookieConsent locale="en" />);

      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decline/i })).toBeInTheDocument();
    });

    it('renders custom bilingual text', () => {
      render(
        <CookieConsent
          locale="fr"
          acceptText={{ fr: 'Oui!', en: 'Yes!' }}
          declineText={{ fr: 'Non merci', en: 'No thanks' }}
        />
      );

      expect(screen.getByRole('button', { name: 'Oui!' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Non merci' })).toBeInTheDocument();
    });

    it('renders custom bilingual message', () => {
      render(
        <CookieConsent
          locale="en"
          message={{ fr: 'Msg FR', en: 'Msg EN' }}
        />
      );

      expect(screen.getByText('Msg EN')).toBeInTheDocument();
    });
  });

  describe('privacy policy link', () => {
    it('renders privacy policy link when provided', () => {
      render(
        <CookieConsent
          locale="en"
          privacyPolicyHref={{ fr: '/fr/confidentialite', en: '/en/privacy' }}
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/en/privacy');
    });

    it('renders French privacy policy link', () => {
      render(
        <CookieConsent
          locale="fr"
          privacyPolicyHref={{ fr: '/fr/confidentialite', en: '/en/privacy' }}
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/fr/confidentialite');
    });
  });

  describe('accessibility', () => {
    it('banner has aria-label', () => {
      render(<CookieConsent locale="en" />);

      const banner = screen.getByRole('region');
      expect(banner).toHaveAttribute('aria-label');
    });
  });
});

describe('getConsentStatus', () => {
  it('returns null when no consent stored', () => {
    expect(getConsentStatus()).toBeNull();
  });

  it('returns accepted when consent accepted', () => {
    localStorageMock.setItem(CONSENT_STORAGE_KEY, 'accepted');
    expect(getConsentStatus()).toBe('accepted');
  });

  it('returns declined when consent declined', () => {
    localStorageMock.setItem(CONSENT_STORAGE_KEY, 'declined');
    expect(getConsentStatus()).toBe('declined');
  });
});

describe('resetCookieConsent', () => {
  it('removes consent from localStorage', () => {
    localStorageMock.setItem(CONSENT_STORAGE_KEY, 'accepted');

    resetCookieConsent();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(CONSENT_STORAGE_KEY);
  });
});
