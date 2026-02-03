// ABOUTME: Live social proof notification system
// ABOUTME: Shows real-time activity notifications to build trust and urgency

'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '../lib/utils/cn';
import type { LocalizedString } from '../lib/i18n/types';
import { getLocalizedString } from '../lib/content/utils';

/**
 * Position of the notification on screen
 */
export type NotificationPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

/**
 * Individual notification data
 */
export interface LiveProofNotification {
  /** Unique identifier */
  id: string;
  /** User/customer name */
  name?: string;
  /** User location (city, country) */
  location?: string;
  /** Action performed (e.g., "signed up", "made a purchase") */
  action: LocalizedString | string;
  /** Time ago (e.g., "2 minutes ago") */
  timeAgo?: LocalizedString | string;
  /** Optional avatar URL */
  avatar?: string;
  /** Optional icon (lucide-react name) */
  icon?: string;
  /** Custom message (overrides name/location/action format) */
  message?: LocalizedString | string;
  /** Link URL when clicked */
  link?: string;
  /** Custom data for tracking */
  data?: Record<string, unknown>;
}

export interface LiveProofProps {
  /** Array of notifications to display */
  notifications: LiveProofNotification[];
  /** Position on screen */
  position?: NotificationPosition;
  /** Auto-dismiss duration in milliseconds (0 = never) */
  autoHideDuration?: number;
  /** Maximum number of visible notifications */
  maxVisible?: number;
  /** Delay between showing notifications in milliseconds */
  showDelay?: number;
  /** Enable click to dismiss */
  clickToDismiss?: boolean;
  /** Custom close button */
  showCloseButton?: boolean;
  /** Current locale for i18n */
  locale?: string;
  /** Additional CSS classes */
  className?: string;
  /** Callback when notification is clicked */
  onNotificationClick?: (notification: LiveProofNotification) => void;
  /** Callback when notification is dismissed */
  onNotificationDismiss?: (notification: LiveProofNotification) => void;
}

/**
 * LiveProof Notification System
 *
 * Displays real-time social proof notifications to build trust and create urgency.
 * Shows messages like "John from NYC just signed up" to demonstrate activity.
 *
 * @example Basic usage
 * ```tsx
 * const notifications = [
 *   {
 *     id: '1',
 *     name: 'John D.',
 *     location: 'New York, NY',
 *     action: 'signed up for a trial',
 *     timeAgo: '2 minutes ago'
 *   },
 *   {
 *     id: '2',
 *     name: 'Sarah M.',
 *     location: 'San Francisco, CA',
 *     action: 'upgraded to Premium',
 *     timeAgo: '5 minutes ago'
 *   }
 * ];
 *
 * <LiveProof notifications={notifications} />
 * ```
 *
 * @example Custom message
 * ```tsx
 * <LiveProof
 *   notifications={[
 *     {
 *       id: '1',
 *       message: '🎉 127 people signed up today!',
 *       icon: 'TrendingUp'
 *     }
 *   ]}
 *   position="bottom-left"
 *   autoHideDuration={5000}
 * />
 * ```
 *
 * @example With avatar and link
 * ```tsx
 * <LiveProof
 *   notifications={[
 *     {
 *       id: '1',
 *       name: 'Alex Chen',
 *       action: 'left a 5-star review',
 *       avatar: '/avatars/alex.jpg',
 *       link: '/reviews',
 *       timeAgo: 'Just now'
 *     }
 *   ]}
 * />
 * ```
 */
export function LiveProof({
  notifications,
  position = 'bottom-left',
  autoHideDuration = 5000,
  maxVisible = 3,
  showDelay = 3000,
  clickToDismiss = true,
  showCloseButton = true,
  locale = 'en',
  className,
  onNotificationClick,
  onNotificationDismiss,
}: LiveProofProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Set<string>>(new Set());
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());
  const [queue, setQueue] = useState<LiveProofNotification[]>([]);

  // Initialize queue
  useEffect(() => {
    const notDismissed = notifications.filter((n) => !dismissedNotifications.has(n.id));
    setQueue(notDismissed);
  }, [notifications, dismissedNotifications]);

  // Show notifications from queue
  useEffect(() => {
    if (queue.length === 0 || visibleNotifications.size >= maxVisible) {
      return;
    }

    const timer = setTimeout(() => {
      const nextNotification = queue.find((n) => !visibleNotifications.has(n.id));
      if (nextNotification) {
        setVisibleNotifications((prev) => new Set([...prev, nextNotification.id]));
      }
    }, showDelay);

    return () => clearTimeout(timer);
  }, [queue, visibleNotifications, maxVisible, showDelay]);

  // Auto-hide notifications
  useEffect(() => {
    if (autoHideDuration === 0) return;

    const timers = Array.from(visibleNotifications).map((id) => {
      return setTimeout(() => {
        handleDismiss(id);
      }, autoHideDuration);
    });

    return () => timers.forEach(clearTimeout);
  }, [visibleNotifications, autoHideDuration]);

  const handleDismiss = useCallback(
    (id: string) => {
      setVisibleNotifications((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDismissedNotifications((prev) => new Set([...prev, id]));

      const notification = notifications.find((n) => n.id === id);
      if (notification && onNotificationDismiss) {
        onNotificationDismiss(notification);
      }
    },
    [notifications, onNotificationDismiss]
  );

  const handleClick = useCallback(
    (notification: LiveProofNotification) => {
      if (clickToDismiss) {
        handleDismiss(notification.id);
      }

      if (onNotificationClick) {
        onNotificationClick(notification);
      }

      if (notification.link) {
        window.location.href = notification.link;
      }
    },
    [clickToDismiss, handleDismiss, onNotificationClick]
  );

  const visible = notifications.filter((n) => visibleNotifications.has(n.id));

  if (visible.length === 0) {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={cn('fixed z-50 flex flex-col gap-3', positionClasses[position], className)}
      role="region"
      aria-label="Live notifications"
    >
      {visible.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          locale={locale}
          showCloseButton={showCloseButton}
          onClick={() => handleClick(notification)}
          onDismiss={() => handleDismiss(notification.id)}
        />
      ))}
    </div>
  );
}

interface NotificationCardProps {
  notification: LiveProofNotification;
  locale: string;
  showCloseButton: boolean;
  onClick: () => void;
  onDismiss: () => void;
}

function NotificationCard({
  notification,
  locale,
  showCloseButton,
  onClick,
  onDismiss,
}: NotificationCardProps) {
  const action =
    typeof notification.action === 'string'
      ? notification.action
      : getLocalizedString(notification.action, locale);

  const timeAgo = notification.timeAgo
    ? typeof notification.timeAgo === 'string'
      ? notification.timeAgo
      : getLocalizedString(notification.timeAgo, locale)
    : undefined;

  const message = notification.message
    ? typeof notification.message === 'string'
      ? notification.message
      : getLocalizedString(notification.message, locale)
    : undefined;

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-lg border border-gray-200',
        'max-w-sm w-full sm:w-96',
        'p-4 pr-12',
        'cursor-pointer hover:shadow-xl transition-shadow',
        'animate-slide-in-right'
      )}
      onClick={onClick}
      role="article"
      aria-live="polite"
    >
      {/* Close Button */}
      {showCloseButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss notification"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar or Icon */}
        {notification.avatar ? (
          <img
            src={notification.avatar}
            alt={notification.name || ''}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {message ? (
            <p className="text-sm text-gray-900 leading-relaxed">{message}</p>
          ) : (
            <>
              <p className="text-sm text-gray-900 font-medium leading-relaxed">
                {notification.name && <span className="font-semibold">{notification.name}</span>}
                {notification.name && notification.location && (
                  <span className="text-gray-600"> from {notification.location}</span>
                )}
              </p>
              <p className="text-sm text-gray-700 mt-0.5">{action}</p>
            </>
          )}

          {timeAgo && <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>}
        </div>
      </div>
    </div>
  );
}

/**
 * Generate mock notifications for demo/testing
 *
 * @param count - Number of notifications to generate
 * @param locale - Locale for localized strings
 * @returns Array of mock notifications
 *
 * @example
 * ```tsx
 * const mockData = generateMockNotifications(5);
 * <LiveProof notifications={mockData} />
 * ```
 */
export function generateMockNotifications(
  count: number = 10,
  locale: string = 'en'
): LiveProofNotification[] {
  const names = [
    'John D.',
    'Sarah M.',
    'Alex Chen',
    'Maria Garcia',
    'David Kim',
    'Emma Wilson',
    'Michael Brown',
    'Lisa Anderson',
    'James Taylor',
    'Jennifer Lee',
  ];

  const locations = [
    'New York, NY',
    'San Francisco, CA',
    'Los Angeles, CA',
    'Chicago, IL',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Miami, FL',
    'Denver, CO',
    'Portland, OR',
  ];

  const actions = [
    { en: 'signed up for a trial', fr: 's\'est inscrit pour un essai' },
    { en: 'upgraded to Premium', fr: 'est passé à Premium' },
    { en: 'made a purchase', fr: 'a effectué un achat' },
    { en: 'left a 5-star review', fr: 'a laissé un avis 5 étoiles' },
    { en: 'started using the platform', fr: 'a commencé à utiliser la plateforme' },
    { en: 'joined the community', fr: 'a rejoint la communauté' },
    { en: 'completed onboarding', fr: 'a terminé l\'intégration' },
    { en: 'referred a friend', fr: 'a parrainé un ami' },
  ];

  const timeAgoOptions = [
    { en: 'Just now', fr: 'À l\'instant' },
    { en: '2 minutes ago', fr: 'Il y a 2 minutes' },
    { en: '5 minutes ago', fr: 'Il y a 5 minutes' },
    { en: '10 minutes ago', fr: 'Il y a 10 minutes' },
    { en: '15 minutes ago', fr: 'Il y a 15 minutes' },
    { en: '30 minutes ago', fr: 'Il y a 30 minutes' },
    { en: '1 hour ago', fr: 'Il y a 1 heure' },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i}`,
    name: names[i % names.length],
    location: locations[i % locations.length],
    action: actions[i % actions.length],
    timeAgo: timeAgoOptions[i % timeAgoOptions.length],
  }));
}
