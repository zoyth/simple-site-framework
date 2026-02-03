# TrackedLink

Link component with automatic click tracking.

## Import

```typescript
import { TrackedLink } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<TrackedLink
  href="/pricing"
  eventName="pricing_link_click"
  eventData={{ location: 'footer' }}
>
  View Pricing
</TrackedLink>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `href` | `string` | Yes | Link URL |
| `eventName` | `string` | Yes | Event name for tracking |
| `eventData` | `object` | No | Additional event data |
| `children` | `ReactNode` | Yes | Link content |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Footer link
<TrackedLink
  href="/contact"
  eventName="footer_contact_click"
>
  Contact Us
</TrackedLink>

// With metadata
<TrackedLink
  href="/blog/article-1"
  eventName="blog_article_click"
  eventData={{
    article_id: '1',
    category: 'tutorials'
  }}
>
  Read Article
</TrackedLink>
```

## See Also

- [AnalyticsTracker](./AnalyticsTracker.md)
- [Button](./ui/Button.md)
