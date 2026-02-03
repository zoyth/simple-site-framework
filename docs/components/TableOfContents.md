# TableOfContents

Auto-generated table of contents from page headings.

## Import

```typescript
import { TableOfContents } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<TableOfContents
  containerSelector="article"
  includeLevels={[2, 3]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `containerSelector` | `string` | No | Content container selector (default: 'article') |
| `includeLevels` | `number[]` | No | Heading levels to include (default: [2, 3]) |
| `title` | `string \| LocalizedString` | No | TOC title |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Basic TOC
<TableOfContents />

// Include h2, h3, h4
<TableOfContents includeLevels={[2, 3, 4]} />

// Custom title
<TableOfContents title="On This Page" />
```

## See Also

- [PolicyLayout](./PolicyLayout.md)
- [CodeBlock](./CodeBlock.md)
