# AnalyticsTracker

Automatic page view and scroll tracking component.

## Import

```typescript
import { AnalyticsTracker } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
// In root layout
<html>
  <body>
    <AnalyticsTracker />
    {children}
  </body>
</html>
```

## Features

Automatically tracks:
- Page views on route changes
- Scroll depth milestones (25%, 50%, 75%, 100%)

## Props

No props required - works automatically.

## Events Tracked

### Page View
```typescript
{
  event: 'page_view',
  page_path: '/about',
  page_title: 'About Us'
}
```

### Scroll Depth
```typescript
{
  event: 'scroll_depth',
  scroll_percentage: 50,
  page_path: '/about'
}
```

## See Also

- [TrackedLink](./TrackedLink.md)
- [Analytics Setup Guide](../guides/analytics-setup.md)
