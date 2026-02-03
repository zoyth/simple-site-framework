// ABOUTME: Tests for MobileCTA mobile conversion component
// ABOUTME: Validates scroll behavior, responsive display, and accessibility

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileCTA } from './MobileCTA';

describe('MobileCTA', () => {
  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders CTA button with localized text', () => {
      render(
        <MobileCTA
          text={{ en: 'Start Free Trial', fr: 'Essai gratuit' }}
          href="https://app.example.com/signup"
          locale="en"
        />
      );

      expect(screen.getByRole('link')).toHaveTextContent('Start Free Trial');
    });

    it('renders with French locale', () => {
      render(
        <MobileCTA
          text={{ en: 'Start Free Trial', fr: 'Essai gratuit' }}
          href="https://app.example.com/signup"
          locale="fr"
        />
      );

      expect(screen.getByRole('link')).toHaveTextContent('Essai gratuit');
    });

    it('renders with correct href', () => {
      render(
        <MobileCTA
          text="Click me"
          href="https://app.example.com/signup"
          locale="en"
        />
      );

      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://app.example.com/signup'
      );
    });
  });

  describe('Scroll-triggered visibility', () => {
    it('is hidden initially (before scroll threshold)', () => {
      const { container } = render(
        <MobileCTA
          text="Click me"
          href="/signup"
          locale="en"
          threshold={300}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('translate-y-full');
    });

    it('becomes visible after scrolling past threshold', async () => {
      const { container } = render(
        <MobileCTA
          text="Click me"
          href="/signup"
          locale="en"
          threshold={300}
        />
      );

      // Simulate scroll past threshold
      Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('translate-y-0');
      });
    });

    it('uses custom threshold value', async () => {
      const { container } = render(
        <MobileCTA
          text="Click me"
          href="/signup"
          locale="en"
          threshold={500}
        />
      );

      // Scroll to 400px (below custom threshold of 500)
      Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('translate-y-full');
      });

      // Scroll to 600px (above custom threshold of 500)
      Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('translate-y-0');
      });
    });

    it('hides when scrolling back up', async () => {
      const { container } = render(
        <MobileCTA
          text="Click me"
          href="/signup"
          locale="en"
          threshold={300}
        />
      );

      // Scroll down
      Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('translate-y-0');
      });

      // Scroll back up
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('translate-y-full');
      });
    });

    it('cleans up scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });

  describe('Responsive display', () => {
    it('hides on large screens by default (lg breakpoint)', () => {
      const { container } = render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('lg:hidden');
    });

    it('respects custom hideAbove breakpoint', () => {
      const { container } = render(
        <MobileCTA
          text="Click me"
          href="/signup"
          locale="en"
          hideAbove="md"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('md:hidden');
    });

    it('supports all breakpoint options', () => {
      const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

      breakpoints.forEach((breakpoint) => {
        const { container } = render(
          <MobileCTA
            text="Click me"
            href="/signup"
            locale="en"
            hideAbove={breakpoint}
          />
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass(`${breakpoint}:hidden`);
      });
    });
  });

  describe('Accessibility', () => {
    it('meets minimum tap target size (44px)', () => {
      render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      const link = screen.getByRole('link');
      const styles = window.getComputedStyle(link);

      // Component sets minHeight: 44px via style prop
      expect(link).toHaveStyle({ minHeight: '44px' });
    });

    it('has proper link semantics', () => {
      render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      const link = screen.getByRole('link');

      // Tab to the link
      await user.tab();

      expect(link).toHaveFocus();
    });
  });

  describe('Click tracking', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <MobileCTA
          text="Click me"
          href="/signup"
          locale="en"
          onClick={onClick}
        />
      );

      const link = screen.getByRole('link');
      await user.click(link);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick if not provided', async () => {
      const user = userEvent.setup();

      render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      const link = screen.getByRole('link');

      // Should not throw
      await user.click(link);
    });
  });

  describe('Styling customization', () => {
    it('applies custom className', () => {
      const { container } = render(
        <MobileCTA
          text="Click me"
          href="/signup"
          locale="en"
          className="custom-class"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('applies custom z-index', () => {
      const { container } = render(
        <MobileCTA
          text="Click me"
          href="/signup"
          locale="en"
          zIndex={100}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('z-100');
    });

    it('uses default z-index of 50', () => {
      const { container } = render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('z-50');
    });
  });

  describe('Animation', () => {
    it('has smooth transition classes', () => {
      const { container } = render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('transition-transform', 'duration-300');
    });

    it('applies active scale effect to button', () => {
      render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('active:scale-95');
    });
  });

  describe('Position', () => {
    it('is fixed at bottom of screen', () => {
      const { container } = render(
        <MobileCTA text="Click me" href="/signup" locale="en" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
    });
  });
});
