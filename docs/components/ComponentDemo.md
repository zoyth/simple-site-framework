# ComponentDemo

Component demonstration wrapper with code preview.

## Import

```typescript
import { ComponentDemo } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<ComponentDemo
  title="Button Examples"
  code={`<Button variant="filled">Click Me</Button>`}
>
  <Button variant="filled">Click Me</Button>
</ComponentDemo>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | No | Demo title |
| `code` | `string` | No | Code to display |
| `children` | `ReactNode` | Yes | Component to demo |
| `description` | `string` | No | Demo description |
| `className` | `string` | No | Custom classes |

## See Also

- [CodeBlock](./CodeBlock.md)
- [StyleGuide](./StyleGuide.md)
- Internal development/documentation tool
