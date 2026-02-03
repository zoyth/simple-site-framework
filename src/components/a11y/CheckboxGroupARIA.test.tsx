// ABOUTME: Tests for ARIA-enhanced CheckboxGroup component
// ABOUTME: Validates group semantics, keyboard navigation, and screen reader support

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxGroupARIA } from './CheckboxGroupARIA';

describe('CheckboxGroupARIA', () => {
  const options = [
    { value: 'analytics', label: 'Analytics' },
    { value: 'reporting', label: 'Reporting' },
    { value: 'api', label: 'API Access' },
  ];

  describe('Group semantics', () => {
    it('renders as fieldset with role="group"', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
        />
      );

      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
      expect(group.tagName).toBe('FIELDSET');
    });

    it('uses legend for group label', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
        />
      );

      const legend = screen.getByText('Select Features');
      expect(legend.tagName).toBe('LEGEND');
    });

    it('applies aria-labelledby to fieldset linking to legend', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
        />
      );

      const group = screen.getByRole('group');
      const labelledBy = group.getAttribute('aria-labelledby');

      expect(labelledBy).toBeTruthy();

      const legend = document.getElementById(labelledBy!);
      expect(legend).toHaveTextContent('Select Features');
    });
  });

  describe('Error handling', () => {
    it('applies aria-invalid to fieldset when error exists', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          error="At least one feature is required"
        />
      );

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-invalid', 'true');
    });

    it('links error message via aria-describedby', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          error="At least one feature is required"
        />
      );

      const group = screen.getByRole('group');
      const describedBy = group.getAttribute('aria-describedby');

      expect(describedBy).toContain('features-error');

      const errorElement = document.getElementById('features-error');
      expect(errorElement).toHaveTextContent('At least one feature is required');
    });

    it('marks error as live region with role="alert"', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          error="At least one feature is required"
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('At least one feature is required');
    });
  });

  describe('Required indicator', () => {
    it('shows visual required indicator in legend', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          required
        />
      );

      const legend = screen.getByText(/Select Features/);
      const indicator = legend.querySelector('.text-red-500');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent('*');
    });

    it('hides required indicator from screen readers', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          required
        />
      );

      const legend = screen.getByText(/Select Features/);
      const indicator = legend.querySelector('.text-red-500');
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    });

    it('applies aria-required to fieldset when required', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          required
        />
      );

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Individual checkboxes', () => {
    it('renders each checkbox with proper ARIA', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('aria-invalid', 'false');
      });
    });

    it('applies aria-invalid to checkboxes when group has error', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          error="Selection required"
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('links checkboxes to error via aria-describedby', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          error="Selection required"
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        const describedBy = checkbox.getAttribute('aria-describedby');
        expect(describedBy).toContain('features-error');
      });
    });
  });

  describe('Disabled state', () => {
    it('applies disabled to all checkboxes when group is disabled', () => {
      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          disabled
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });

    it('applies disabled to specific checkbox via option', () => {
      const optionsWithDisabled = [
        { value: 'analytics', label: 'Analytics' },
        { value: 'reporting', label: 'Reporting', disabled: true },
        { value: 'api', label: 'API Access' },
      ];

      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={optionsWithDisabled}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).not.toBeDisabled();
      expect(checkboxes[1]).toBeDisabled();
      expect(checkboxes[2]).not.toBeDisabled();
    });
  });

  describe('Selection management', () => {
    it('handles checkbox selection', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          value={[]}
          onChange={onChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      expect(onChange).toHaveBeenCalledWith(['analytics']);
    });

    it('handles multiple selections', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          value={['analytics']}
          onChange={onChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);

      expect(onChange).toHaveBeenCalledWith(['analytics', 'reporting']);
    });

    it('handles deselection', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <CheckboxGroupARIA
          name="features"
          label="Select Features"
          options={options}
          value={['analytics', 'reporting']}
          onChange={onChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      expect(onChange).toHaveBeenCalledWith(['reporting']);
    });
  });

  describe('Localization', () => {
    it('handles localized labels', () => {
      const localizedOptions = [
        { value: 'analytics', label: { en: 'Analytics', fr: 'Analytique' } },
        { value: 'reporting', label: { en: 'Reporting', fr: 'Rapports' } },
      ];

      const { rerender } = render(
        <CheckboxGroupARIA
          name="features"
          label={{ en: 'Select Features', fr: 'Sélectionner les fonctionnalités' }}
          options={localizedOptions}
          locale="en"
        />
      );

      expect(screen.getByText('Select Features')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Reporting')).toBeInTheDocument();

      rerender(
        <CheckboxGroupARIA
          name="features"
          label={{ en: 'Select Features', fr: 'Sélectionner les fonctionnalités' }}
          options={localizedOptions}
          locale="fr"
        />
      );

      expect(screen.getByText('Sélectionner les fonctionnalités')).toBeInTheDocument();
      expect(screen.getByText('Analytique')).toBeInTheDocument();
      expect(screen.getByText('Rapports')).toBeInTheDocument();
    });
  });
});
