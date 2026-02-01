// ABOUTME: Button component for primary actions and navigation
// ABOUTME: Supports multiple variants, loading/success states, icons, and micro-interactions

'use client'

import { ButtonHTMLAttributes, forwardRef, useState, useEffect, ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils/cn';
import { getMotionComponent } from '../../lib/utils/motion';
import { Icons } from '../Icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * - outlined: Rounded with border (primary brand style)
   * - filled: Solid background with shadow
   * - text: Text-only button without border
   * - ghost: Transparent background, visible on hover
   * - link: Styled like a link, but button semantics
   * - destructive: Red variant for delete/remove actions
   */
  variant?: 'outlined' | 'filled' | 'text' | 'ghost' | 'link' | 'destructive';

  /**
   * Size of the button
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Full width button
   */
  fullWidth?: boolean;

  /**
   * Loading state - shows spinner and disables button
   */
  loading?: boolean;

  /**
   * Custom text to show during loading
   */
  loadingText?: string;

  /**
   * Success state - shows checkmark animation
   */
  success?: boolean;

  /**
   * Custom text to show during success
   */
  successText?: string;

  /**
   * Duration to show success state before reverting (ms)
   */
  successDuration?: number;

  /**
   * Icon element to display
   */
  icon?: ReactNode;

  /**
   * Position of the icon
   */
  iconPosition?: 'left' | 'right';

  /**
   * Icon-only button (no text)
   */
  iconOnly?: boolean;

  /**
   * Tooltip text to show when button is disabled
   */
  disabledTooltip?: string;

  /**
   * Enable ripple effect on click
   */
  ripple?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      fullWidth = false,
      loading = false,
      loadingText,
      success = false,
      successText,
      successDuration = 2000,
      icon,
      iconPosition = 'left',
      iconOnly = false,
      disabledTooltip,
      ripple = true,
      className,
      children,
      disabled,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    // Motion components (with graceful degradation if framer-motion not installed)
    const MotionButton = getMotionComponent('button');
    const MotionSpan = getMotionComponent('span');

    // Handle success state auto-revert
    useEffect(() => {
      if (success) {
        setIsSuccess(true);
        const timer = setTimeout(() => setIsSuccess(false), successDuration);
        return () => clearTimeout(timer);
      }
    }, [success, successDuration]);

    // Ripple effect handler
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !loading) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples((prev) => [...prev, { x, y, id }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }

      if (onClick && !disabled && !loading) {
        onClick(e);
      }
    };

    // Icon size based on button size
    const iconSize = {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 20,
      xl: 24,
    }[size];

    // Determine what to display
    const showLoading = loading;
    const showSuccess = isSuccess && !loading;
    const showIcon = icon && !showLoading && !showSuccess;

    const buttonContent = (
      <>
        {/* Left icon */}
        {showIcon && iconPosition === 'left' && !iconOnly && (
          <span className="mr-2 inline-flex">{icon}</span>
        )}

        {/* Loading spinner */}
        {showLoading && (
          <Icons.Loader
            size={iconSize}
            className={cn('animate-spin', !iconOnly && (loadingText || children) && 'mr-2')}
          />
        )}

        {/* Success checkmark */}
        {showSuccess && (
          <MotionSpan
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className={cn(!iconOnly && (successText || children) && 'mr-2')}
          >
            <Icons.Check size={iconSize} />
          </MotionSpan>
        )}

        {/* Icon only */}
        {iconOnly && showIcon && icon}

        {/* Text content */}
        {!iconOnly && (
          <span>
            {showLoading && loadingText
              ? loadingText
              : showSuccess && successText
              ? successText
              : children}
          </span>
        )}

        {/* Right icon */}
        {showIcon && iconPosition === 'right' && !iconOnly && (
          <span className="ml-2 inline-flex">{icon}</span>
        )}

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <MotionSpan
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
            }}
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: 100, height: 100, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </>
    );

    const button = (
      <MotionButton
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={handleClick}
        whileHover={!disabled && !loading ? { y: -2 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        className={cn(
          // Base styles
          'relative overflow-hidden inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',

          // Success state background pulse
          {
            'bg-green-500 border-green-500 text-white':
              showSuccess && (variant === 'outlined' || variant === 'filled'),
          },

          // Variant styles
          !showSuccess && {
            // Outlined variant (primary brand style)
            'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white rounded-lg shadow-sm hover:shadow-md focus-visible:ring-primary':
              variant === 'outlined',

            // Filled variant
            'bg-primary text-white hover:bg-primary-hover rounded-lg border-2 border-transparent shadow-sm hover:shadow-md focus-visible:ring-primary':
              variant === 'filled',

            // Text variant
            'text-primary hover:underline focus-visible:ring-primary': variant === 'text',

            // Ghost variant
            'border-2 border-transparent bg-transparent text-gray-700 hover:bg-gray-100 rounded-lg focus-visible:ring-gray-400':
              variant === 'ghost',

            // Link variant
            'text-primary hover:underline underline-offset-4 focus-visible:ring-primary':
              variant === 'link',

            // Destructive variant
            'bg-red-600 text-white hover:bg-red-700 rounded-lg border-2 border-transparent shadow-sm hover:shadow-md focus-visible:ring-red-600':
              variant === 'destructive',
          },

          // Size styles
          {
            'px-2 py-1 text-xs': size === 'xs' && !iconOnly,
            'px-3 py-1.5 text-sm': size === 'sm' && !iconOnly,
            'px-6 py-2.5 text-base': size === 'md' && !iconOnly,
            'px-8 py-3 text-lg': size === 'lg' && !iconOnly,
            'px-10 py-4 text-xl': size === 'xl' && !iconOnly,
          },

          // Icon-only sizes
          iconOnly && {
            'p-1': size === 'xs',
            'p-1.5': size === 'sm',
            'p-2': size === 'md',
            'p-2.5': size === 'lg',
            'p-3': size === 'xl',
          },

          // Full width
          {
            'w-full': fullWidth,
          },

          className
        )}
        {...(props as any)}
      >
        {buttonContent}
      </MotionButton>
    );

    // Wrap with tooltip if disabled with tooltip text
    if (disabled && disabledTooltip) {
      return (
        <TooltipPrimitive.Provider delayDuration={300}>
          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>{button}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
              <TooltipPrimitive.Content
                className="bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg max-w-xs z-50"
                sideOffset={5}
              >
                {disabledTooltip}
                <TooltipPrimitive.Arrow className="fill-gray-900" />
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
      );
    }

    return button;
  }
);

Button.displayName = 'Button';
