// ABOUTME: Icon component wrapper for Lucide React icons
// ABOUTME: Provides type-safe icon rendering with common presets

'use client'

import { forwardRef } from 'react'
import { cn } from '../lib/utils/cn'
import { hasLucideReact, fallbackIcons } from '../lib/utils/icons'

// Type imports (will be available even if lucide-react not installed at runtime)
import type { LucideProps, LucideIcon } from 'lucide-react'

export type IconName = string

export interface IconProps extends Omit<LucideProps, 'ref'> {
  /** Icon name from Lucide React */
  name: IconName
  /** Icon size in pixels @default 24 */
  size?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Icon - Lucide React icon wrapper
 *
 * Type-safe wrapper for Lucide React icons with preset configurations.
 * Supports all 1000+ Lucide icons with tree-shaking.
 *
 * @example
 * // Basic usage
 * <Icon name="Check" size={24} />
 *
 * @example
 * // With styling
 * <Icon
 *   name="ChevronDown"
 *   size={20}
 *   className="text-primary"
 * />
 *
 * @example
 * // With animation
 * <Icon
 *   name="Loader2"
 *   className="animate-spin text-white"
 * />
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 24, className, ...props }, ref) => {
    if (!hasLucideReact()) {
      console.warn(`Icon component requires lucide-react to be installed. Icon "${name}" cannot be rendered.`)
      return null
    }

    try {
      const LucideIcons = require('lucide-react')
      const LucideIcon = LucideIcons[name] as LucideIcon

      if (!LucideIcon) {
        console.warn(`Icon "${name}" not found in Lucide React`)
        return null
      }

      return (
        <LucideIcon
          ref={ref}
          size={size}
          className={cn(className)}
          {...props}
        />
      )
    } catch (error) {
      console.warn(`Failed to load icon "${name}":`, error)
      return null
    }
  }
)

Icon.displayName = 'Icon'

/**
 * Get icon component with fallback when lucide-react not available
 * Only commonly used icons have fallbacks
 */
function getIconWithFallback(
  name: string,
  fallbackName?: keyof typeof fallbackIcons
): React.ComponentType<Omit<IconProps, 'name'>> {
  return (props: Omit<IconProps, 'name'>) => {
    if (hasLucideReact()) {
      return <Icon name={name} {...props} />
    }

    // Use fallback if available
    if (fallbackName && fallbackIcons[fallbackName]) {
      const FallbackIcon = fallbackIcons[fallbackName]
      return <FallbackIcon {...props} />
    }

    return null
  }
}

// Common icon presets for convenience
// Icons with fallbacks will work without lucide-react
export const Icons = {
  // Navigation
  ChevronDown: getIconWithFallback('ChevronDown', 'ChevronDown'),
  ChevronUp: getIconWithFallback('ChevronUp', 'ChevronUp'),
  ChevronLeft: getIconWithFallback('ChevronLeft', 'ChevronLeft'),
  ChevronRight: getIconWithFallback('ChevronRight', 'ChevronRight'),
  Menu: getIconWithFallback('Menu', 'Menu'),
  X: getIconWithFallback('X', 'X'),

  // Actions
  Check: getIconWithFallback('Check', 'Check'),
  CheckCircle: getIconWithFallback('CheckCircle2'),
  Plus: getIconWithFallback('Plus'),
  Minus: getIconWithFallback('Minus'),
  Edit: getIconWithFallback('Edit2'),
  Trash: getIconWithFallback('Trash2'),
  Copy: getIconWithFallback('Copy'),
  Download: getIconWithFallback('Download'),
  Upload: getIconWithFallback('Upload'),

  // Status
  Loader: getIconWithFallback('Loader2', 'Loader2'),
  AlertCircle: getIconWithFallback('AlertCircle', 'AlertCircle'),
  AlertTriangle: getIconWithFallback('AlertTriangle'),
  Info: getIconWithFallback('Info', 'Info'),

  // Communication
  Mail: getIconWithFallback('Mail'),
  Phone: getIconWithFallback('Phone'),
  MessageCircle: getIconWithFallback('MessageCircle'),
  Send: getIconWithFallback('Send'),

  // Media
  Image: getIconWithFallback('Image'),
  Video: getIconWithFallback('Video'),
  Play: getIconWithFallback('Play'),
  Pause: getIconWithFallback('Pause'),

  // Business
  Calendar: getIconWithFallback('Calendar'),
  Clock: getIconWithFallback('Clock'),
  DollarSign: getIconWithFallback('DollarSign'),
  CreditCard: getIconWithFallback('CreditCard'),
  ShoppingCart: getIconWithFallback('ShoppingCart'),

  // Social
  Twitter: getIconWithFallback('Twitter'),
  Facebook: getIconWithFallback('Facebook'),
  Linkedin: getIconWithFallback('Linkedin'),
  Instagram: getIconWithFallback('Instagram'),
  Github: getIconWithFallback('Github'),

  // Files
  File: getIconWithFallback('File'),
  FileText: getIconWithFallback('FileText'),
  Folder: getIconWithFallback('Folder'),

  // Settings
  Settings: getIconWithFallback('Settings'),
  Search: getIconWithFallback('Search'),
  Filter: getIconWithFallback('Filter'),

  // Arrows
  ArrowRight: getIconWithFallback('ArrowRight'),
  ArrowLeft: getIconWithFallback('ArrowLeft'),
  ArrowUp: getIconWithFallback('ArrowUp'),
  ArrowDown: getIconWithFallback('ArrowDown'),

  // Other
  Heart: getIconWithFallback('Heart'),
  Star: getIconWithFallback('Star'),
  Lock: getIconWithFallback('Lock'),
  Unlock: getIconWithFallback('Unlock'),
  Eye: getIconWithFallback('Eye'),
  EyeOff: getIconWithFallback('EyeOff'),
  Home: getIconWithFallback('Home'),
  User: getIconWithFallback('User'),
  Users: getIconWithFallback('Users'),
  Bell: getIconWithFallback('Bell'),
  MapPin: getIconWithFallback('MapPin'),
  Globe: getIconWithFallback('Globe'),
  Zap: getIconWithFallback('Zap'),
  Award: getIconWithFallback('Award'),
  Shield: getIconWithFallback('Shield'),
  TrendingUp: getIconWithFallback('TrendingUp'),
  ExternalLink: getIconWithFallback('ExternalLink')
}
