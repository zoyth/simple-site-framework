// ABOUTME: Tests for NewsletterSignup component
// ABOUTME: Verifies variants, validation, submission states, honeypot, and accessibility

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewsletterSignup } from './NewsletterSignup';
import type { NewsletterResponse } from './NewsletterSignup';

const mockOnSubmit = vi.fn().mockResolvedValue({ success: true });

beforeEach(() => {
  mockOnSubmit.mockClear();
  mockOnSubmit.mockResolvedValue({ success: true });
});

describe('NewsletterSignup', () => {
  describe('Rendering', () => {
    it('renders email input and submit button', () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    });

    it('renders name field when showName is true', () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} showName />);
      expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    });

    it('does not render name field by default', () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      expect(screen.queryByRole('textbox', { name: /name/i })).not.toBeInTheDocument();
    });

    it('renders privacy checkbox when showPrivacy is true', () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} showPrivacy />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('does not render privacy checkbox by default', () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders inline variant', () => {
      const { container } = render(
        <NewsletterSignup onSubmit={mockOnSubmit} variant="inline" />
      );
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('renders stacked variant', () => {
      const { container } = render(
        <NewsletterSignup onSubmit={mockOnSubmit} variant="stacked" />
      );
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('renders minimal variant', () => {
      const { container } = render(
        <NewsletterSignup onSubmit={mockOnSubmit} variant="minimal" />
      );
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('renders card variant', () => {
      const { container } = render(
        <NewsletterSignup onSubmit={mockOnSubmit} variant="card" />
      );
      expect(container.querySelector('form')).toBeInTheDocument();
    });
  });

  describe('Bilingual', () => {
    it('renders English labels by default', () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      expect(screen.getByRole('button')).toHaveTextContent('Subscribe');
    });

    it('renders French labels', () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} locale="fr" />);
      expect(screen.getByRole('button')).toHaveTextContent("S'abonner");
    });

    it('supports custom button text', () => {
      render(
        <NewsletterSignup
          onSubmit={mockOnSubmit}
          buttonText={{ en: 'Join', fr: 'Rejoindre' }}
          locale="en"
        />
      );
      expect(screen.getByRole('button')).toHaveTextContent('Join');
    });
  });

  describe('Validation', () => {
    it('shows error for empty email on submit', async () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error for invalid email', async () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'not-an-email' },
      });
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('requires privacy checkbox when shown', async () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} showPrivacy />);
      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Submission', () => {
    it('calls onSubmit with email on valid submission', async () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ email: 'test@example.com' })
        );
      });
    });

    it('calls onSubmit with email and name when showName', async () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} showName />);
      fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
        target: { value: 'Jane' },
      });
      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'jane@example.com' },
      });
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ email: 'jane@example.com', name: 'Jane' })
        );
      });
    });

    it('shows success message after successful submission', async () => {
      render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });

    it('shows error message after failed submission', async () => {
      mockOnSubmit.mockResolvedValueOnce({ success: false, error: 'Server error' });
      render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('disables button while submitting', async () => {
      let resolveSubmit: (value: NewsletterResponse) => void;
      const slowSubmit = vi.fn(
        () => new Promise<NewsletterResponse>((resolve) => { resolveSubmit = resolve; })
      );
      render(<NewsletterSignup onSubmit={slowSubmit} />);
      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled();
      });
      resolveSubmit!({ success: true });
    });
  });

  describe('Honeypot', () => {
    it('does not call onSubmit when honeypot is filled', async () => {
      const { container } = render(<NewsletterSignup onSubmit={mockOnSubmit} />);
      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'test@example.com' },
      });
      // Fill honeypot
      const honeypot = container.querySelector('input[name="_honeypot"]') as HTMLInputElement;
      fireEvent.change(honeypot, { target: { value: 'spam' } });
      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = render(
        <NewsletterSignup onSubmit={mockOnSubmit} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
