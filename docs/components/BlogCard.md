# BlogCard

Blog post preview card component.

## Import

```typescript
import { BlogCard } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<BlogCard
  title="How to Build Fast Websites"
  excerpt="Learn the best practices for building performant websites..."
  author="John Doe"
  date="2024-01-15"
  image="/blog/fast-websites.jpg"
  href="/blog/fast-websites"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string \| LocalizedString` | Yes | Post title |
| `excerpt` | `string \| LocalizedString` | Yes | Post excerpt |
| `author` | `string` | No | Author name |
| `date` | `string` | No | Publication date |
| `image` | `string` | No | Featured image |
| `href` | `string` | Yes | Post URL |
| `tags` | `string[]` | No | Post tags |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## See Also

- [Card](./ui/Card.md)
