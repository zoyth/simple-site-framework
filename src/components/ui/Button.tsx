// ABOUTME: Button component for primary actions and navigation
// ABOUTME: Supports outlined (primary), filled, and text variants with proper accessibility

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * - outlined: Rounded with orange border (primary brand style)
   * - filled: Solid orange background with shadow
   * - text: Text-only button without border
   */
  variant?: 'outlined' | 'filled' | 'text';

  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Full width button
   */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      fullWidth = false,
      className,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',

          // Variant styles
          {
            // Outlined variant (primary brand style)
            'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5':
              variant === 'outlined',

            // Filled variant
            'bg-primary text-white hover:bg-primary-hover rounded-lg border-2 border-transparent shadow-sm hover:shadow-md hover:-translate-y-0.5':
              variant === 'filled',

            // Text variant
            'text-primary hover:underline': variant === 'text',
          },

          // Size styles
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-2.5 text-base': size === 'md',
            'px-8 py-3 text-lg': size === 'lg',
          },

          // Full width
          {
            'w-full': fullWidth,
          },

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
