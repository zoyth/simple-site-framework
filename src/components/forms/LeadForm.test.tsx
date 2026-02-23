// ABOUTME: Tests for LeadForm component
// ABOUTME: Verifies field rendering, validation, submission, honeypot, and bilingual support

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadForm } from './LeadForm';
import type { LeadFormData } from './LeadForm';

describe('LeadForm', () => {
  const mockSubmit = vi.fn<[LeadFormData], Promise<void>>();

  beforeEach(() => {
    mockSubmit.mockClear();
    mockSubmit.mockResolvedValue(undefined);
  });

  describe('field rendering', () => {
    it('renders name and email fields by default', () => {
      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('renders optional phone field', () => {
      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it('does not render message field by default', () => {
      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      expect(screen.queryByLabelText(/message/i)).not.toBeInTheDocument();
    });

    it('renders message field when showMessage is true', () => {
      render(<LeadForm locale="en" onSubmit={mockSubmit} showMessage />);

      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('renders submit button with default text', () => {
      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('renders submit button with custom text', () => {
      render(
        <LeadForm
          locale="en"
          onSubmit={mockSubmit}
          submitText={{ en: 'Get Quote', fr: 'Obtenir un devis' }}
        />
      );

      expect(screen.getByRole('button', { name: /get quote/i })).toBeInTheDocument();
    });
  });

  describe('bilingual labels', () => {
    it('renders French labels when locale is fr', () => {
      render(<LeadForm locale="fr" onSubmit={mockSubmit} />);

      expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/courriel/i)).toBeInTheDocument();
    });

    it('renders French submit button', () => {
      render(<LeadForm locale="fr" onSubmit={mockSubmit} />);

      expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('validates required name and email', async () => {
      const user = userEvent.setup();
      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        const errors = screen.getAllByText(/required/i);
        expect(errors.length).toBeGreaterThan(0);
      });

      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('validates email format', async () => {
      const user = userEvent.setup();
      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'John');
      await user.type(screen.getByLabelText(/email/i), 'not-an-email');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });

      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    it('submits form data to onSubmit handler', async () => {
      const user = userEvent.setup();
      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Jane Doe',
            email: 'jane@example.com',
          })
        );
      });
    });

    it('includes hidden fields in submission', async () => {
      const user = userEvent.setup();
      render(
        <LeadForm
          locale="en"
          onSubmit={mockSubmit}
          hiddenFields={{ product: 'audit', source: 'landing' }}
        />
      );

      await user.type(screen.getByLabelText(/name/i), 'Jane');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            product: 'audit',
            source: 'landing',
          })
        );
      });
    });

    it('shows success message after submission', async () => {
      const user = userEvent.setup();
      render(
        <LeadForm
          locale="en"
          onSubmit={mockSubmit}
          successMessage={{ en: 'Thanks!', fr: 'Merci!' }}
        />
      );

      await user.type(screen.getByLabelText(/name/i), 'Jane');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText('Thanks!')).toBeInTheDocument();
      });
    });

    it('shows error message on submission failure', async () => {
      mockSubmit.mockRejectedValue(new Error('Server error'));

      const user = userEvent.setup();
      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'Jane');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('disables button during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      mockSubmit.mockReturnValue(
        new Promise<void>((resolve) => { resolveSubmit = resolve; })
      );

      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'Jane');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.click(screen.getByRole('button', { name: /send/i }));

      expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();

      resolveSubmit!();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled();
      });
    });

    it('resets form after successful submission', async () => {
      const user = userEvent.setup();
      render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      await user.type(nameInput, 'Jane');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });
    });
  });

  describe('honeypot', () => {
    it('renders hidden honeypot field', () => {
      const { container } = render(<LeadForm locale="en" onSubmit={mockSubmit} />);

      const honeypot = container.querySelector('input[name="_honeypot"]');
      expect(honeypot).toBeInTheDocument();
      expect(honeypot?.closest('div')).toHaveClass('hidden');
    });
  });
});
