# Textarea

Multi-line text input component.

## Import

```typescript
import { Textarea } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<Textarea
  name="message"
  placeholder="Enter your message"
  rows={4}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Textarea name |
| `placeholder` | `string` | No | Placeholder text |
| `rows` | `number` | No | Number of rows |
| `value` | `string` | No | Textarea value |
| `disabled` | `boolean` | No | Disable textarea |
| `required` | `boolean` | No | Mark as required |
| `className` | `string` | No | Custom classes |
| `onChange` | `function` | No | Change handler |

## Examples

```typescript
// Basic textarea
<Textarea name="message" rows={6} />

// With placeholder
<Textarea name="bio" placeholder="Tell us about yourself" rows={4} />

// Required field
<Textarea name="details" required rows={8} />
```

## See Also

- [Input](./Input.md)
- [FormField](../forms/FormField.md)
