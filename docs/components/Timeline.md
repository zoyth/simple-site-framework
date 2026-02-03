# Timeline

Timeline component for chronological events.

## Import

```typescript
import { Timeline } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<Timeline
  events={[
    {
      year: '2024',
      title: 'Company Milestone',
      description: 'Reached 10,000 customers',
    },
    {
      year: '2023',
      title: 'Series A Funding',
      description: 'Raised $10M in funding',
    },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `events` | `TimelineEvent[]` | Yes | Timeline events |
| `variant` | `'vertical' \| 'horizontal'` | No | Layout variant |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

### TimelineEvent

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `year` | `string` | Yes | Event year/date |
| `title` | `string \| LocalizedString` | Yes | Event title |
| `description` | `string \| LocalizedString` | No | Event description |

## See Also

- [AboutSection](./sections/AboutSection.md)
