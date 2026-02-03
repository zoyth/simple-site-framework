# PolicyLayout

Layout component for policy pages (Privacy, Terms, etc.).

## Import

```typescript
import { PolicyLayout } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<PolicyLayout
  title="Privacy Policy"
  lastUpdated="January 15, 2024"
>
  <h2>Introduction</h2>
  <p>This privacy policy...</p>
</PolicyLayout>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string \| LocalizedString` | Yes | Policy title |
| `lastUpdated` | `string` | No | Last updated date |
| `children` | `ReactNode` | Yes | Policy content |
| `showTOC` | `boolean` | No | Show table of contents |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## Examples

```typescript
// With TOC
<PolicyLayout
  title="Terms of Service"
  lastUpdated="March 1, 2024"
  showTOC
>
  <h2>1. Agreement</h2>
  <p>...</p>
  <h2>2. Usage</h2>
  <p>...</p>
</PolicyLayout>
```

## See Also

- [TableOfContents](./TableOfContents.md)
- [SEOMetaTags](./SEOMetaTags.md)
