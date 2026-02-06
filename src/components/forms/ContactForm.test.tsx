import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';
import type { ContactFormData, ContactFormResponse } from './ContactForm';

describe('ContactForm', () => {
  const mockSubmit = vi.fn<[ContactFormData], Promise<ContactFormResponse>>();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders with default fields', () => {
    render(<ContactForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(
      <ContactForm
        title="Get in Touch"
        description="We'd love to hear from you"
        onSubmit={mockSubmit}
      />
    );

    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText("We'd love to hear from you")).toBeInTheDocument();
  });

  it('renders custom fields', () => {
    render(
      <ContactForm
        fields={[
          { name: 'firstName', label: 'First Name', type: 'text', required: true },
          { name: 'company', label: 'Company', type: 'text', required: false },
        ]}
        onSubmit={mockSubmit}
      />
    );

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
  });

  it('shows required field indicators', () => {
    render(<ContactForm onSubmit={mockSubmit} />);

    // Name label should have required asterisk
    const nameLabel = screen.getByText(/full name/i).closest('label');
    expect(nameLabel).toHaveTextContent('*');

    // Phone label should not have required asterisk (optional field)
    const phoneLabel = screen.getByText(/phone number/i).closest('label');
    expect(phoneLabel).not.toHaveTextContent('*');
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockSubmit} />);

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      // Multiple required fields show validation errors
      const errors = screen.getAllByText(/this field is required/i);
      expect(errors.length).toBeGreaterThan(0);
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates phone number format', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockSubmit} />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.type(phoneInput, 'abc123');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockSubmit.mockResolvedValue({ success: true });

    render(<ContactForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello, I need help');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        message: 'Hello, I need help',
      });
    });
  });

  it('shows success message on successful submission', async () => {
    const user = userEvent.setup();
    mockSubmit.mockResolvedValue({
      success: true,
      message: 'Thank you for contacting us!',
    });

    render(<ContactForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Thank you for contacting us!')).toBeInTheDocument();
    });
  });

  it('shows error message on failed submission', async () => {
    const user = userEvent.setup();
    mockSubmit.mockResolvedValue({
      success: false,
      error: 'Server error occurred',
    });

    render(<ContactForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('disables form during submission', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    const submitPromise = new Promise<ContactFormResponse>((resolve) => {
      resolveSubmit = () => resolve({ success: true });
    });
    mockSubmit.mockReturnValue(submitPromise);

    render(<ContactForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();

    // Resolve the submission
    resolveSubmit!();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    mockSubmit.mockResolvedValue({ success: true });

    render(<ContactForm onSubmit={mockSubmit} />);

    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Hello');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
  });

  it('renders privacy notice by default', () => {
    render(<ContactForm onSubmit={mockSubmit} />);

    expect(screen.getByText(/by submitting this form/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
  });

  it('hides privacy notice when disabled', () => {
    render(<ContactForm onSubmit={mockSubmit} showPrivacyNotice={false} />);

    expect(screen.queryByText(/privacy policy/i)).not.toBeInTheDocument();
  });

  it('renders custom submit button text', () => {
    render(<ContactForm onSubmit={mockSubmit} submitText="Contact Us" />);

    expect(screen.getByRole('button', { name: /contact us/i })).toBeInTheDocument();
  });

  it('renders honeypot field (hidden)', () => {
    const { container } = render(<ContactForm onSubmit={mockSubmit} enableHoneypot={true} />);

    const honeypot = container.querySelector('input[name="_honeypot"]');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot?.closest('div')).toHaveClass('hidden');
  });

  it('handles localized field labels', () => {
    render(
      <ContactForm
        fields={[
          {
            name: 'name',
            label: { en: 'Name', fr: 'Nom' },
            type: 'text',
            required: true,
          },
        ]}
        locale="fr"
        onSubmit={mockSubmit}
      />
    );

    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
  });

  it('renders textarea fields correctly', () => {
    render(<ContactForm onSubmit={mockSubmit} />);

    const messageField = screen.getByLabelText(/message/i);
    expect(messageField.tagName).toBe('TEXTAREA');
    expect(messageField).toHaveAttribute('rows', '5');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ContactForm onSubmit={mockSubmit} className="custom-form-class" />
    );

    expect(container.firstChild).toHaveClass('custom-form-class');
  });
});
