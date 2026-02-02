// ABOUTME: Icon component wrapper for Lucide React icons
// ABOUTME: Provides type-safe icon rendering with common presets

'use client'

import { forwardRef } from 'react'
import { cn } from '../lib/utils/cn'
import { fallbackIcons } from '../lib/utils/icons'

// Type imports
import type { LucideProps, LucideIcon } from 'lucide-react'

// Import lucide-react statically for Turbopack compatibility
import * as LucideIcons from 'lucide-react'

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
    const LucideIcon = (LucideIcons as any)[name] as LucideIcon | undefined

    if (!LucideIcon) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Icon "${name}" not found in Lucide React`)
      }
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
  }
)

Icon.displayName = 'Icon'

/**
 * Get icon component
 */
function getIconComponent(
  name: string
): React.ComponentType<Omit<IconProps, 'name'>> {
  return (props: Omit<IconProps, 'name'>) => {
    return <Icon name={name} {...props} />
  }
}

// Common icon presets for convenience
export const Icons = {
  // Navigation
  ChevronDown: getIconComponent('ChevronDown'),
  ChevronUp: getIconComponent('ChevronUp'),
  ChevronLeft: getIconComponent('ChevronLeft'),
  ChevronRight: getIconComponent('ChevronRight'),
  Menu: getIconComponent('Menu'),
  X: getIconComponent('X'),

  // Actions
  Check: getIconComponent('Check'),
  CheckCircle: getIconComponent('CheckCircle2'),
  Plus: getIconComponent('Plus'),
  Minus: getIconComponent('Minus'),
  Edit: getIconComponent('Edit2'),
  Trash: getIconComponent('Trash2'),
  Copy: getIconComponent('Copy'),
  Download: getIconComponent('Download'),
  Upload: getIconComponent('Upload'),

  // Status
  Loader: getIconComponent('Loader2'),
  AlertCircle: getIconComponent('AlertCircle'),
  AlertTriangle: getIconComponent('AlertTriangle'),
  Info: getIconComponent('Info'),

  // Communication
  Mail: getIconComponent('Mail'),
  Phone: getIconComponent('Phone'),
  MessageCircle: getIconComponent('MessageCircle'),
  Send: getIconComponent('Send'),

  // Media
  Image: getIconComponent('Image'),
  Video: getIconComponent('Video'),
  Play: getIconComponent('Play'),
  Pause: getIconComponent('Pause'),

  // Business
  Calendar: getIconComponent('Calendar'),
  Clock: getIconComponent('Clock'),
  DollarSign: getIconComponent('DollarSign'),
  CreditCard: getIconComponent('CreditCard'),
  ShoppingCart: getIconComponent('ShoppingCart'),

  // Social
  Twitter: getIconComponent('Twitter'),
  Facebook: getIconComponent('Facebook'),
  Linkedin: getIconComponent('Linkedin'),
  Instagram: getIconComponent('Instagram'),
  Github: getIconComponent('Github'),

  // Files
  File: getIconComponent('File'),
  FileText: getIconComponent('FileText'),
  Folder: getIconComponent('Folder'),

  // Settings
  Settings: getIconComponent('Settings'),
  Search: getIconComponent('Search'),
  Filter: getIconComponent('Filter'),

  // Arrows
  ArrowRight: getIconComponent('ArrowRight'),
  ArrowLeft: getIconComponent('ArrowLeft'),
  ArrowUp: getIconComponent('ArrowUp'),
  ArrowDown: getIconComponent('ArrowDown'),

  // Other
  Heart: getIconComponent('Heart'),
  Star: getIconComponent('Star'),
  Lock: getIconComponent('Lock'),
  Unlock: getIconComponent('Unlock'),
  Eye: getIconComponent('Eye'),
  EyeOff: getIconComponent('EyeOff'),
  Home: getIconComponent('Home'),
  User: getIconComponent('User'),
  Users: getIconComponent('Users'),
  Bell: getIconComponent('Bell'),
  MapPin: getIconComponent('MapPin'),
  Globe: getIconComponent('Globe'),
  Zap: getIconComponent('Zap'),
  Award: getIconComponent('Award'),
  Shield: getIconComponent('Shield'),
  TrendingUp: getIconComponent('TrendingUp'),
  ExternalLink: getIconComponent('ExternalLink')
}
