import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { LiveProof, generateMockNotifications } from './LiveProof';
import type { LiveProofNotification } from './LiveProof';

describe('LiveProof', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Helper to advance timers and flush React updates
  async function advanceTimers(ms: number = 1) {
    await act(async () => {
      vi.advanceTimersByTime(ms);
    });
  }

  const mockNotification: LiveProofNotification = {
    id: '1',
    name: 'John Doe',
    location: 'New York, NY',
    action: 'signed up for a trial',
    timeAgo: '2 minutes ago',
  };

  it('renders notification with name, location, and action', async () => {
    render(<LiveProof notifications={[mockNotification]} showDelay={0} />);

    await advanceTimers();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/from New York, NY/)).toBeInTheDocument();
    expect(screen.getByText('signed up for a trial')).toBeInTheDocument();
    expect(screen.getByText('2 minutes ago')).toBeInTheDocument();
  });

  it('renders custom message instead of name/action', async () => {
    const notification = {
      id: '1',
      action: 'placeholder', // Required field, but message takes precedence in display
      message: '🎉 127 people signed up today!',
    };

    render(<LiveProof notifications={[notification]} showDelay={0} />);

    await advanceTimers();

    expect(screen.getByText('🎉 127 people signed up today!')).toBeInTheDocument();
  });

  it('renders avatar when provided', async () => {
    const notification = {
      ...mockNotification,
      avatar: '/avatar.jpg',
    };

    render(<LiveProof notifications={[notification]} showDelay={0} />);

    await advanceTimers();

    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/avatar.jpg');
  });

  it('renders default icon when no avatar', async () => {
    render(<LiveProof notifications={[mockNotification]} showDelay={0} />);

    await advanceTimers();

    // Should render default user icon SVG
    const svg = document.querySelector('svg[stroke="currentColor"]');
    expect(svg).toBeInTheDocument();
  });

  it('shows close button by default', async () => {
    render(<LiveProof notifications={[mockNotification]} showDelay={0} />);

    await advanceTimers();

    const closeButton = screen.getByLabelText('Dismiss notification');
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when disabled', async () => {
    render(
      <LiveProof notifications={[mockNotification]} showCloseButton={false} showDelay={0} />
    );

    await advanceTimers();

    expect(screen.queryByLabelText('Dismiss notification')).not.toBeInTheDocument();
  });

  it('dismisses notification when close button clicked', async () => {
    render(<LiveProof notifications={[mockNotification]} showDelay={0} />);

    await advanceTimers();

    const closeButton = screen.getByLabelText('Dismiss notification');
    fireEvent.click(closeButton);

    // After click, notification should be removed immediately (synchronous state update)
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('auto-dismisses notification after duration', async () => {
    render(<LiveProof notifications={[mockNotification]} autoHideDuration={5000} showDelay={0} />);

    await advanceTimers();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await advanceTimers(5000);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('does not auto-dismiss when duration is 0', async () => {
    render(<LiveProof notifications={[mockNotification]} autoHideDuration={0} showDelay={0} />);

    await advanceTimers();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await advanceTimers(10000);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows notifications with delay', async () => {
    const notifications = [
      { id: '1', name: 'User 1', action: 'signed up' },
      { id: '2', name: 'User 2', action: 'upgraded' },
    ];

    render(<LiveProof notifications={notifications} showDelay={3000} />);

    // Initially no notifications visible
    expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    expect(screen.queryByText('User 2')).not.toBeInTheDocument();

    // After first delay, first notification appears
    await advanceTimers(3000);

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.queryByText('User 2')).not.toBeInTheDocument();

    // After second delay, second notification appears
    await advanceTimers(3000);

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('respects maxVisible limit', async () => {
    const notifications = [
      { id: '1', name: 'User 1', action: 'signed up' },
      { id: '2', name: 'User 2', action: 'upgraded' },
      { id: '3', name: 'User 3', action: 'purchased' },
      { id: '4', name: 'User 4', action: 'reviewed' },
    ];

    render(<LiveProof notifications={notifications} maxVisible={2} showDelay={1000} />);

    // Show first notification
    await advanceTimers(1000);
    expect(screen.getByText('User 1')).toBeInTheDocument();

    // Show second notification
    await advanceTimers(1000);
    expect(screen.getByText('User 2')).toBeInTheDocument();

    // Try to show third (should not appear due to maxVisible=2)
    await advanceTimers(1000);
    expect(screen.queryByText('User 3')).not.toBeInTheDocument();
  });

  it('calls onNotificationClick when clicked', async () => {
    const onClickMock = vi.fn();

    render(
      <LiveProof
        notifications={[mockNotification]}
        onNotificationClick={onClickMock}
        showDelay={0}
      />
    );

    await advanceTimers();

    const notification = screen.getByRole('article');
    fireEvent.click(notification);

    expect(onClickMock).toHaveBeenCalledWith(mockNotification);
  });

  it('calls onNotificationDismiss when dismissed', async () => {
    const onDismissMock = vi.fn();

    render(
      <LiveProof
        notifications={[mockNotification]}
        onNotificationDismiss={onDismissMock}
        showDelay={0}
      />
    );

    await advanceTimers();

    const closeButton = screen.getByLabelText('Dismiss notification');
    fireEvent.click(closeButton);

    expect(onDismissMock).toHaveBeenCalledWith(mockNotification);
  });

  it('dismisses on click when clickToDismiss is true', async () => {
    render(
      <LiveProof notifications={[mockNotification]} clickToDismiss={true} showDelay={0} />
    );

    await advanceTimers();

    const notification = screen.getByRole('article');
    fireEvent.click(notification);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('does not dismiss on click when clickToDismiss is false', async () => {
    render(
      <LiveProof notifications={[mockNotification]} clickToDismiss={false} showDelay={0} />
    );

    await advanceTimers();

    const notification = screen.getByRole('article');
    fireEvent.click(notification);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('applies position classes correctly', async () => {
    const { container } = render(
      <LiveProof notifications={[mockNotification]} position="top-right" showDelay={0} />
    );

    await advanceTimers();

    const wrapper = container.querySelector('.fixed');
    expect(wrapper).toHaveClass('top-4', 'right-4');
  });

  it('handles localized strings', async () => {
    const notification = {
      id: '1',
      name: 'Jean',
      action: { en: 'signed up', fr: 's\'est inscrit' },
      timeAgo: { en: '2 minutes ago', fr: 'Il y a 2 minutes' },
    };

    const { rerender } = render(
      <LiveProof notifications={[notification]} locale="en" showDelay={0} />
    );

    await advanceTimers();

    expect(screen.getByText('signed up')).toBeInTheDocument();
    expect(screen.getByText('2 minutes ago')).toBeInTheDocument();

    rerender(<LiveProof notifications={[notification]} locale="fr" showDelay={0} />);

    expect(screen.getByText('s\'est inscrit')).toBeInTheDocument();
    expect(screen.getByText('Il y a 2 minutes')).toBeInTheDocument();
  });

  it('applies custom className', async () => {
    const { container } = render(
      <LiveProof
        notifications={[mockNotification]}
        className="custom-class"
        showDelay={0}
      />
    );

    await advanceTimers();

    const wrapper = container.querySelector('.fixed');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('renders nothing when no visible notifications', () => {
    const { container } = render(<LiveProof notifications={[]} />);

    expect(container.firstChild).toBeNull();
  });
});

describe('generateMockNotifications', () => {
  it('generates requested number of notifications', () => {
    const notifications = generateMockNotifications(5);

    expect(notifications).toHaveLength(5);
  });

  it('generates notifications with all required fields', () => {
    const notifications = generateMockNotifications(1);

    expect(notifications[0]).toHaveProperty('id');
    expect(notifications[0]).toHaveProperty('name');
    expect(notifications[0]).toHaveProperty('location');
    expect(notifications[0]).toHaveProperty('action');
    expect(notifications[0]).toHaveProperty('timeAgo');
  });

  it('generates unique IDs', () => {
    const notifications = generateMockNotifications(10);

    const ids = notifications.map((n) => n.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(10);
  });

  it('supports different locales', () => {
    const enNotifications = generateMockNotifications(1, 'en');
    const frNotifications = generateMockNotifications(1, 'fr');

    expect(enNotifications[0].action).toHaveProperty('en');
    expect(frNotifications[0].action).toHaveProperty('fr');
  });
});
