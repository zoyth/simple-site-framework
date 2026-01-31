// ABOUTME: Tests for SkipLink component
// ABOUTME: Validates accessibility skip navigation functionality

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SkipLink } from './SkipLink'

describe('SkipLink', () => {
  it('should render with correct href', () => {
    render(<SkipLink href="#main">Skip to content</SkipLink>)

    const link = screen.getByRole('link', { name: /skip to content/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#main')
  })

  it('should render children text', () => {
    render(<SkipLink href="#main">Skip to main content</SkipLink>)

    expect(screen.getByText('Skip to main content')).toBeInTheDocument()
  })

  it('should have accessible styling classes', () => {
    render(<SkipLink href="#main">Skip</SkipLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveClass('absolute')
    expect(link).toHaveClass('z-50')
  })

  it('should handle click and focus target element', async () => {
    const user = userEvent.setup()

    // Create a target element
    const { container } = render(
      <div>
        <SkipLink href="#main-content">Skip to content</SkipLink>
        <main id="main-content" tabIndex={-1}>
          Main content
        </main>
      </div>
    )

    const link = screen.getByRole('link', { name: /skip to content/i })
    const target = container.querySelector('#main-content') as HTMLElement

    // Mock focus method
    const focusSpy = vi.spyOn(target, 'focus')

    await user.click(link)

    expect(focusSpy).toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(
      <SkipLink href="#main" className="custom-class">
        Skip
      </SkipLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })
})
