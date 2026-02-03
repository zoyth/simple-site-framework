// ABOUTME: Tests for CTASection conversion component
// ABOUTME: Validates layouts, content variants, and button integration

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CTASection } from './CTASection';

describe('CTASection', () => {
  const basicProps = {
    heading: { en: 'Create Your Free Account', fr: 'Créez votre compte gratuit' },
    primaryCTA: {
      text: { en: 'Sign Up', fr: "S'inscrire" },
      href: 'https://app.example.com/signup',
    },
    locale: 'en' as const,
  };

  describe('Basic rendering', () => {
    it('renders heading with localized text', () => {
      render(<CTASection {...basicProps} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Create Your Free Account'
      );
    });

    it('renders heading in French locale', () => {
      render(<CTASection {...basicProps} locale="fr" />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Créez votre compte gratuit'
      );
    });

    it('renders description when provided', () => {
      render(
        <CTASection
          {...basicProps}
          description={{ en: 'No credit card required', fr: 'Aucune carte requise' }}
        />
      );

      expect(screen.getByText('No credit card required')).toBeInTheDocument();
    });

    it('renders without description', () => {
      render(<CTASection {...basicProps} />);

      // Should only have heading
      expect(screen.queryByText(/credit card/i)).not.toBeInTheDocument();
    });

    it('renders primary CTA button', () => {
      render(<CTASection {...basicProps} />);

      const button = screen.getByRole('link', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('href', 'https://app.example.com/signup');
    });

    it('renders secondary CTA when provided', () => {
      render(
        <CTASection
          {...basicProps}
          secondaryCTA={{
            text: { en: 'Learn More', fr: 'En savoir plus' },
            href: '/about',
          }}
        />
      );

      expect(screen.getByRole('link', { name: 'Learn More' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('works without secondary CTA', () => {
      render(<CTASection {...basicProps} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(1);
    });
  });

  describe('Layout variants', () => {
    it('renders centered layout by default', () => {
      const { container } = render(<CTASection {...basicProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('text-center');
    });

    it('renders centered layout variant', () => {
      const { container } = render(<CTASection {...basicProps} variant="centered" />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('text-center');
    });

    it('supports split layout variant', () => {
      const { container } = render(<CTASection {...basicProps} variant="split" />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('text-left');
    });

    it('supports inline layout variant', () => {
      const { container } = render(<CTASection {...basicProps} variant="inline" />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('text-left');
    });
  });

  describe('Button layout', () => {
    it('renders buttons horizontally by default', () => {
      render(
        <CTASection
          {...basicProps}
          secondaryCTA={{
            text: 'Learn More',
            href: '/about',
          }}
        />
      );

      const buttonContainer = screen.getByRole('link', { name: 'Sign Up' }).parentElement;
      expect(buttonContainer).toHaveClass('sm:flex-row');
    });

    it('supports vertical button layout', () => {
      render(
        <CTASection
          {...basicProps}
          buttonLayout="vertical"
          secondaryCTA={{
            text: 'Learn More',
            href: '/about',
          }}
        />
      );

      const buttonContainer = screen.getByRole('link', { name: 'Sign Up' }).parentElement;
      expect(buttonContainer).toHaveClass('flex-col');
    });
  });

  describe('Content alignment', () => {
    it('uses center alignment by default', () => {
      const { container } = render(<CTASection {...basicProps} />);

      const contentDiv = container.querySelector('.text-center');
      expect(contentDiv).toBeInTheDocument();
    });

    it('supports left alignment', () => {
      const { container } = render(<CTASection {...basicProps} align="left" />);

      const contentDiv = container.querySelector('.text-left');
      expect(contentDiv).toBeInTheDocument();
    });

    it('supports right alignment', () => {
      const { container } = render(<CTASection {...basicProps} align="right" />);

      const contentDiv = container.querySelector('.text-right');
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe('Maximum width control', () => {
    it('uses 2xl max-width by default', () => {
      const { container } = render(<CTASection {...basicProps} />);

      const contentWrapper = container.querySelector('.max-w-2xl');
      expect(contentWrapper).toBeInTheDocument();
    });

    it('supports custom max-width', () => {
      const { container } = render(<CTASection {...basicProps} maxWidth="4xl" />);

      const contentWrapper = container.querySelector('.max-w-4xl');
      expect(contentWrapper).toBeInTheDocument();
    });

    it('supports full width', () => {
      const { container } = render(<CTASection {...basicProps} maxWidth="full" />);

      const contentWrapper = container.querySelector('.max-w-full');
      expect(contentWrapper).toBeInTheDocument();
    });
  });

  describe('Background customization', () => {
    it('uses default background', () => {
      const { container } = render(<CTASection {...basicProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-gray-50');
    });

    it('supports custom background class', () => {
      const { container } = render(
        <CTASection {...basicProps} backgroundColor="bg-blue-500" />
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-blue-500');
    });
  });

  describe('Custom className', () => {
    it('applies custom className to section', () => {
      const { container } = render(
        <CTASection {...basicProps} className="custom-section" />
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-section');
    });
  });

  describe('Click tracking', () => {
    it('calls onClick handler for primary CTA', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <CTASection
          {...basicProps}
          primaryCTA={{
            ...basicProps.primaryCTA,
            onClick,
          }}
        />
      );

      const button = screen.getByRole('link', { name: 'Sign Up' });
      await user.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick handler for secondary CTA', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <CTASection
          {...basicProps}
          secondaryCTA={{
            text: 'Learn More',
            href: '/about',
            onClick,
          }}
        />
      );

      const button = screen.getByRole('link', { name: 'Learn More' });
      await user.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('works without onClick handlers', async () => {
      const user = userEvent.setup();

      render(<CTASection {...basicProps} />);

      const button = screen.getByRole('link', { name: 'Sign Up' });

      // Should not throw
      await user.click(button);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic section element', () => {
      const { container } = render(<CTASection {...basicProps} />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('uses proper heading level (h2)', () => {
      render(<CTASection {...basicProps} />);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('maintains heading hierarchy', () => {
      render(
        <CTASection
          {...basicProps}
          description="Test description"
        />
      );

      const heading = screen.getByRole('heading', { level: 2 });
      const description = screen.getByText('Test description');

      // Description should come after heading in DOM
      expect(heading.compareDocumentPosition(description)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });
  });

  describe('Responsive behavior', () => {
    it('stacks buttons on mobile by default', () => {
      render(
        <CTASection
          {...basicProps}
          secondaryCTA={{
            text: 'Learn More',
            href: '/about',
          }}
        />
      );

      const buttonContainer = screen.getByRole('link', { name: 'Sign Up' }).parentElement;
      expect(buttonContainer).toHaveClass('flex-col', 'sm:flex-row');
    });

    it('maintains vertical layout on all screen sizes when specified', () => {
      render(
        <CTASection
          {...basicProps}
          buttonLayout="vertical"
          secondaryCTA={{
            text: 'Learn More',
            href: '/about',
          }}
        />
      );

      const buttonContainer = screen.getByRole('link', { name: 'Sign Up' }).parentElement;
      expect(buttonContainer).toHaveClass('flex-col');
      expect(buttonContainer).not.toHaveClass('sm:flex-row');
    });
  });

  describe('String content support', () => {
    it('accepts plain strings for heading', () => {
      render(
        <CTASection
          heading="Simple Heading"
          primaryCTA={{
            text: 'Click me',
            href: '/path',
          }}
          locale="en"
        />
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Simple Heading');
    });

    it('accepts plain strings for description', () => {
      render(
        <CTASection
          {...basicProps}
          description="Simple description"
        />
      );

      expect(screen.getByText('Simple description')).toBeInTheDocument();
    });

    it('accepts plain strings for button text', () => {
      render(
        <CTASection
          heading="Title"
          primaryCTA={{
            text: 'Simple button',
            href: '/path',
          }}
          locale="en"
        />
      );

      expect(screen.getByRole('link', { name: 'Simple button' })).toBeInTheDocument();
    });
  });
});
