// ABOUTME: Tests for ARIA-enhanced FormField component
// ABOUTME: Validates comprehensive accessibility attributes and screen reader support

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormFieldARIA } from './FormFieldARIA';

describe('FormFieldARIA', () => {
  describe('ARIA attributes', () => {
    it('applies aria-required when field is required', () => {
      render(
        <FormFieldARIA name="email" label="Email" required>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('applies aria-invalid="false" when no error', () => {
      render(
        <FormFieldARIA name="email" label="Email">
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('applies aria-invalid="true" when error exists', () => {
      const error = { type: 'required', message: 'Email is required' };

      render(
        <FormFieldARIA name="email" label="Email" error={error}>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('links input to hint via aria-describedby', () => {
      render(
        <FormFieldARIA name="email" label="Email" hint="We will never share your email">
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');

      expect(describedBy).toContain('email-hint');

      const hint = document.getElementById('email-hint');
      expect(hint).toBeInTheDocument();
      expect(hint).toHaveTextContent('We will never share your email');
    });

    it('links input to error via aria-describedby', () => {
      const error = { type: 'required', message: 'Email is required' };

      render(
        <FormFieldARIA name="email" label="Email" error={error}>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');

      expect(describedBy).toContain('email-error');

      const errorElement = document.getElementById('email-error');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('Email is required');
    });

    it('links input to both hint and error via aria-describedby when both exist', () => {
      const error = { type: 'required', message: 'Email is required' };

      render(
        <FormFieldARIA
          name="email"
          label="Email"
          hint="Use your work email"
          error={error}
        >
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');

      expect(describedBy).toContain('email-hint');
      expect(describedBy).toContain('email-error');
    });

    it('links label to input via htmlFor and id', () => {
      render(
        <FormFieldARIA name="email" label="Email Address">
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const label = screen.getByText('Email Address');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('id', 'email');
    });
  });

  describe('Live regions', () => {
    it('marks error message with role="alert"', () => {
      const error = { type: 'required', message: 'Email is required' };

      render(
        <FormFieldARIA name="email" label="Email" error={error}>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveTextContent('Email is required');
    });

    it('marks error message with aria-live="polite"', () => {
      const error = { type: 'required', message: 'Email is required' };

      render(
        <FormFieldARIA name="email" label="Email" error={error}>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const errorElement = document.getElementById('email-error');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    it('marks error message with aria-atomic="true"', () => {
      const error = { type: 'required', message: 'Email is required' };

      render(
        <FormFieldARIA name="email" label="Email" error={error}>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const errorElement = document.getElementById('email-error');
      expect(errorElement).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Required field indicator', () => {
    it('shows visual required indicator (*) for required fields', () => {
      render(
        <FormFieldARIA name="email" label="Email" required>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const label = screen.getByText(/Email/);
      expect(label).toBeInTheDocument();
      // Visual indicator should be present
      const indicator = label.querySelector('.text-red-500');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent('*');
    });

    it('hides required indicator (*) for screen readers', () => {
      render(
        <FormFieldARIA name="email" label="Email" required>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const label = screen.getByText(/Email/);
      const indicator = label.querySelector('.text-red-500');
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Disabled state', () => {
    it('passes disabled state to child input via cloneElement', () => {
      render(
        <FormFieldARIA name="email" label="Email" disabled>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('does not apply aria-required when disabled', () => {
      render(
        <FormFieldARIA name="email" label="Email" required disabled>
          <input type="email" id="email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-required');
    });
  });

  describe('Input enhancement', () => {
    it('clones child input with ARIA props', () => {
      render(
        <FormFieldARIA name="email" label="Email" required>
          <input type="email" id="email" placeholder="Enter email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');

      // Original props preserved
      expect(input).toHaveAttribute('placeholder', 'Enter email');
      expect(input).toHaveAttribute('type', 'email');

      // ARIA props added
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('preserves existing aria-describedby and appends new ones', () => {
      render(
        <FormFieldARIA name="email" label="Email" hint="Hint text">
          <input
            type="email"
            id="email"
            aria-describedby="existing-description"
          />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');

      expect(describedBy).toContain('existing-description');
      expect(describedBy).toContain('email-hint');
    });
  });

  describe('Textarea support', () => {
    it('applies ARIA attributes to textarea', () => {
      const error = { type: 'required', message: 'Message is required' };

      render(
        <FormFieldARIA name="message" label="Message" required error={error}>
          <textarea id="message" />
        </FormFieldARIA>
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-required', 'true');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('aria-describedby', 'message-error');
    });
  });

  describe('Custom input components', () => {
    it('applies ARIA attributes to custom components', () => {
      const CustomInput = (props: any) => (
        <input {...props} type="email" />
      );

      render(
        <FormFieldARIA name="email" label="Email" required>
          <CustomInput id="email" />
        </FormFieldARIA>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });
});
