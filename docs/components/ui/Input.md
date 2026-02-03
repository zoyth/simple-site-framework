# Input

Text input component with validation states and accessibility features.

## Import

```typescript
import { Input } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<Input
  name="email"
  type="email"
  placeholder="Enter your email"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Input name |
| `type` | `string` | No | Input type (text, email, tel, etc.) |
| `placeholder` | `string` | No | Placeholder text |
| `value` | `string` | No | Input value |
| `defaultValue` | `string` | No | Default value |
| `disabled` | `boolean` | No | Disable input |
| `required` | `boolean` | No | Mark as required |
| `className` | `string` | No | Custom classes |
| `onChange` | `function` | No | Change handler |

## Examples

```typescript
// Email input
<Input name="email" type="email" placeholder="you@example.com" />

// Password input
<Input name="password" type="password" required />

// Disabled input
<Input name="field" value="Read only" disabled />
```

## See Also

- [Textarea](./Textarea.md)
- [FormField](../forms/FormField.md)
- [ContactForm](../forms/ContactForm.md)
