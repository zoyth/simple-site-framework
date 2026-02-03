# StyleGuide

Component library style guide/showcase.

## Import

```typescript
import { StyleGuide } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<StyleGuide
  title="Design System"
  sections={[
    'colors',
    'typography',
    'buttons',
    'forms',
    'icons'
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | No | Style guide title |
| `sections` | `string[]` | No | Sections to display |
| `className` | `string` | No | Custom classes |

## Displays

- Color palette
- Typography scale
- Component variants
- Spacing system
- Icon library

## See Also

- Internal development tool
