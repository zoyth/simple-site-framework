// ABOUTME: Tests for ARIA-enhanced RadioGroup component
// ABOUTME: Validates radio group semantics, keyboard navigation, and screen reader support

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroupARIA } from './RadioGroupARIA';

describe('RadioGroupARIA', () => {
  const options = [
    { value: 'basic', label: 'Basic Plan' },
    { value: 'pro', label: 'Pro Plan' },
    { value: 'enterprise', label: 'Enterprise Plan' },
  ];

  describe('Group semantics', () => {
    it('renders as fieldset with role="radiogroup"', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
        />
      );

      const group = screen.getByRole('radiogroup');
      expect(group).toBeInTheDocument();
      expect(group.tagName).toBe('FIELDSET');
    });

    it('uses legend for group label', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
        />
      );

      const legend = screen.getByText('Choose Plan');
      expect(legend.tagName).toBe('LEGEND');
    });

    it('applies aria-labelledby to fieldset linking to legend', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
        />
      );

      const group = screen.getByRole('radiogroup');
      const labelledBy = group.getAttribute('aria-labelledby');

      expect(labelledBy).toBeTruthy();

      const legend = document.getElementById(labelledBy!);
      expect(legend).toHaveTextContent('Choose Plan');
    });
  });

  describe('Error handling', () => {
    it('applies aria-invalid to fieldset when error exists', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          error="Please select a plan"
        />
      );

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-invalid', 'true');
    });

    it('links error message via aria-describedby', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          error="Please select a plan"
        />
      );

      const group = screen.getByRole('radiogroup');
      const describedBy = group.getAttribute('aria-describedby');

      expect(describedBy).toContain('plan-error');

      const errorElement = document.getElementById('plan-error');
      expect(errorElement).toHaveTextContent('Please select a plan');
    });

    it('marks error as live region with role="alert"', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          error="Please select a plan"
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Please select a plan');
    });
  });

  describe('Required indicator', () => {
    it('shows visual required indicator in legend', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          required
        />
      );

      const legend = screen.getByText(/Choose Plan/);
      const indicator = legend.querySelector('.text-red-500');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent('*');
    });

    it('hides required indicator from screen readers', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          required
        />
      );

      const legend = screen.getByText(/Choose Plan/);
      const indicator = legend.querySelector('.text-red-500');
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    });

    it('applies aria-required to fieldset when required', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          required
        />
      );

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Individual radio buttons', () => {
    it('renders each radio with proper ARIA', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
        />
      );

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);

      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('aria-invalid', 'false');
        expect(radio).toHaveAttribute('name', 'plan');
      });
    });

    it('applies aria-invalid to radios when group has error', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          error="Selection required"
        />
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('links radios to error via aria-describedby', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          error="Selection required"
        />
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        const describedBy = radio.getAttribute('aria-describedby');
        expect(describedBy).toContain('plan-error');
      });
    });

    it('marks selected radio as checked', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          value="pro"
        />
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });
  });

  describe('Disabled state', () => {
    it('applies disabled to all radios when group is disabled', () => {
      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          disabled
        />
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it('applies disabled to specific radio via option', () => {
      const optionsWithDisabled = [
        { value: 'basic', label: 'Basic Plan' },
        { value: 'pro', label: 'Pro Plan', disabled: true },
        { value: 'enterprise', label: 'Enterprise Plan' },
      ];

      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={optionsWithDisabled}
        />
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeDisabled();
      expect(radios[1]).toBeDisabled();
      expect(radios[2]).not.toBeDisabled();
    });
  });

  describe('Selection management', () => {
    it('handles radio selection', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          onChange={onChange}
        />
      );

      const radios = screen.getAllByRole('radio');
      await user.click(radios[1]);

      expect(onChange).toHaveBeenCalledWith('pro');
    });

    it('allows changing selection', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroupARIA
          name="plan"
          label="Choose Plan"
          options={options}
          value="basic"
          onChange={onChange}
        />
      );

      const radios = screen.getAllByRole('radio');
      await user.click(radios[2]);

      expect(onChange).toHaveBeenCalledWith('enterprise');
    });
  });

  describe('Localization', () => {
    it('handles localized labels', () => {
      const localizedOptions = [
        { value: 'basic', label: { en: 'Basic Plan', fr: 'Plan Basique' } },
        { value: 'pro', label: { en: 'Pro Plan', fr: 'Plan Pro' } },
      ];

      const { rerender } = render(
        <RadioGroupARIA
          name="plan"
          label={{ en: 'Choose Plan', fr: 'Choisir le plan' }}
          options={localizedOptions}
          locale="en"
        />
      );

      expect(screen.getByText('Choose Plan')).toBeInTheDocument();
      expect(screen.getByText('Basic Plan')).toBeInTheDocument();
      expect(screen.getByText('Pro Plan')).toBeInTheDocument();

      rerender(
        <RadioGroupARIA
          name="plan"
          label={{ en: 'Choose Plan', fr: 'Choisir le plan' }}
          options={localizedOptions}
          locale="fr"
        />
      );

      expect(screen.getByText('Choisir le plan')).toBeInTheDocument();
      expect(screen.getByText('Plan Basique')).toBeInTheDocument();
      expect(screen.getByText('Plan Pro')).toBeInTheDocument();
    });
  });
});
