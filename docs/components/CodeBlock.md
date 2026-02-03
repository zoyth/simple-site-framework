# CodeBlock

Syntax-highlighted code display component.

## Import

```typescript
import { CodeBlock } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<CodeBlock
  code={`function hello() {\n  console.log('Hello, world!');\n}`}
  language="javascript"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `code` | `string` | Yes | Code content |
| `language` | `string` | Yes | Programming language |
| `showLineNumbers` | `boolean` | No | Show line numbers |
| `highlight` | `number[]` | No | Lines to highlight |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// With line numbers
<CodeBlock
  code={codeString}
  language="typescript"
  showLineNumbers
/>

// Highlight specific lines
<CodeBlock
  code={codeString}
  language="javascript"
  highlight={[3, 4, 5]}
/>
```

## See Also

- [Documentation](../guides/documentation.md)
