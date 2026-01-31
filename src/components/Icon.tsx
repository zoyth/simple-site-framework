// ABOUTME: Icon component wrapper for Lucide React icons
// ABOUTME: Provides type-safe icon rendering with common presets

'use client'

import { forwardRef } from 'react'
import * as LucideIcons from 'lucide-react'
import { cn } from '../lib/utils/cn'

export type IconName = keyof typeof LucideIcons

export interface IconProps extends Omit<LucideIcons.LucideProps, 'ref'> {
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
    const LucideIcon = LucideIcons[name] as LucideIcons.LucideIcon

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
  }
)

Icon.displayName = 'Icon'

// Common icon presets for convenience
export const Icons = {
  // Navigation
  ChevronDown: (props: Omit<IconProps, 'name'>) => <Icon name="ChevronDown" {...props} />,
  ChevronUp: (props: Omit<IconProps, 'name'>) => <Icon name="ChevronUp" {...props} />,
  ChevronLeft: (props: Omit<IconProps, 'name'>) => <Icon name="ChevronLeft" {...props} />,
  ChevronRight: (props: Omit<IconProps, 'name'>) => <Icon name="ChevronRight" {...props} />,
  Menu: (props: Omit<IconProps, 'name'>) => <Icon name="Menu" {...props} />,
  X: (props: Omit<IconProps, 'name'>) => <Icon name="X" {...props} />,

  // Actions
  Check: (props: Omit<IconProps, 'name'>) => <Icon name="Check" {...props} />,
  CheckCircle: (props: Omit<IconProps, 'name'>) => <Icon name="CheckCircle2" {...props} />,
  Plus: (props: Omit<IconProps, 'name'>) => <Icon name="Plus" {...props} />,
  Minus: (props: Omit<IconProps, 'name'>) => <Icon name="Minus" {...props} />,
  Edit: (props: Omit<IconProps, 'name'>) => <Icon name="Edit2" {...props} />,
  Trash: (props: Omit<IconProps, 'name'>) => <Icon name="Trash2" {...props} />,
  Copy: (props: Omit<IconProps, 'name'>) => <Icon name="Copy" {...props} />,
  Download: (props: Omit<IconProps, 'name'>) => <Icon name="Download" {...props} />,
  Upload: (props: Omit<IconProps, 'name'>) => <Icon name="Upload" {...props} />,

  // Status
  Loader: (props: Omit<IconProps, 'name'>) => <Icon name="Loader2" {...props} />,
  AlertCircle: (props: Omit<IconProps, 'name'>) => <Icon name="AlertCircle" {...props} />,
  AlertTriangle: (props: Omit<IconProps, 'name'>) => <Icon name="AlertTriangle" {...props} />,
  Info: (props: Omit<IconProps, 'name'>) => <Icon name="Info" {...props} />,

  // Communication
  Mail: (props: Omit<IconProps, 'name'>) => <Icon name="Mail" {...props} />,
  Phone: (props: Omit<IconProps, 'name'>) => <Icon name="Phone" {...props} />,
  MessageCircle: (props: Omit<IconProps, 'name'>) => <Icon name="MessageCircle" {...props} />,
  Send: (props: Omit<IconProps, 'name'>) => <Icon name="Send" {...props} />,

  // Media
  Image: (props: Omit<IconProps, 'name'>) => <Icon name="Image" {...props} />,
  Video: (props: Omit<IconProps, 'name'>) => <Icon name="Video" {...props} />,
  Play: (props: Omit<IconProps, 'name'>) => <Icon name="Play" {...props} />,
  Pause: (props: Omit<IconProps, 'name'>) => <Icon name="Pause" {...props} />,

  // Business
  Calendar: (props: Omit<IconProps, 'name'>) => <Icon name="Calendar" {...props} />,
  Clock: (props: Omit<IconProps, 'name'>) => <Icon name="Clock" {...props} />,
  DollarSign: (props: Omit<IconProps, 'name'>) => <Icon name="DollarSign" {...props} />,
  CreditCard: (props: Omit<IconProps, 'name'>) => <Icon name="CreditCard" {...props} />,
  ShoppingCart: (props: Omit<IconProps, 'name'>) => <Icon name="ShoppingCart" {...props} />,

  // Social
  Twitter: (props: Omit<IconProps, 'name'>) => <Icon name="Twitter" {...props} />,
  Facebook: (props: Omit<IconProps, 'name'>) => <Icon name="Facebook" {...props} />,
  Linkedin: (props: Omit<IconProps, 'name'>) => <Icon name="Linkedin" {...props} />,
  Instagram: (props: Omit<IconProps, 'name'>) => <Icon name="Instagram" {...props} />,
  Github: (props: Omit<IconProps, 'name'>) => <Icon name="Github" {...props} />,

  // Files
  File: (props: Omit<IconProps, 'name'>) => <Icon name="File" {...props} />,
  FileText: (props: Omit<IconProps, 'name'>) => <Icon name="FileText" {...props} />,
  Folder: (props: Omit<IconProps, 'name'>) => <Icon name="Folder" {...props} />,

  // Settings
  Settings: (props: Omit<IconProps, 'name'>) => <Icon name="Settings" {...props} />,
  Search: (props: Omit<IconProps, 'name'>) => <Icon name="Search" {...props} />,
  Filter: (props: Omit<IconProps, 'name'>) => <Icon name="Filter" {...props} />,

  // Arrows
  ArrowRight: (props: Omit<IconProps, 'name'>) => <Icon name="ArrowRight" {...props} />,
  ArrowLeft: (props: Omit<IconProps, 'name'>) => <Icon name="ArrowLeft" {...props} />,
  ArrowUp: (props: Omit<IconProps, 'name'>) => <Icon name="ArrowUp" {...props} />,
  ArrowDown: (props: Omit<IconProps, 'name'>) => <Icon name="ArrowDown" {...props} />,

  // Other
  Heart: (props: Omit<IconProps, 'name'>) => <Icon name="Heart" {...props} />,
  Star: (props: Omit<IconProps, 'name'>) => <Icon name="Star" {...props} />,
  Lock: (props: Omit<IconProps, 'name'>) => <Icon name="Lock" {...props} />,
  Unlock: (props: Omit<IconProps, 'name'>) => <Icon name="Unlock" {...props} />,
  Eye: (props: Omit<IconProps, 'name'>) => <Icon name="Eye" {...props} />,
  EyeOff: (props: Omit<IconProps, 'name'>) => <Icon name="EyeOff" {...props} />,
  Home: (props: Omit<IconProps, 'name'>) => <Icon name="Home" {...props} />,
  User: (props: Omit<IconProps, 'name'>) => <Icon name="User" {...props} />,
  Users: (props: Omit<IconProps, 'name'>) => <Icon name="Users" {...props} />,
  Bell: (props: Omit<IconProps, 'name'>) => <Icon name="Bell" {...props} />,
  MapPin: (props: Omit<IconProps, 'name'>) => <Icon name="MapPin" {...props} />,
  Globe: (props: Omit<IconProps, 'name'>) => <Icon name="Globe" {...props} />,
  Zap: (props: Omit<IconProps, 'name'>) => <Icon name="Zap" {...props} />,
  Award: (props: Omit<IconProps, 'name'>) => <Icon name="Award" {...props} />,
  Shield: (props: Omit<IconProps, 'name'>) => <Icon name="Shield" {...props} />,
  TrendingUp: (props: Omit<IconProps, 'name'>) => <Icon name="TrendingUp" {...props} />,
  ExternalLink: (props: Omit<IconProps, 'name'>) => <Icon name="ExternalLink" {...props} />
}
