# Checkbox

Checkbox input component.

## Import

```typescript
import { Checkbox } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<Checkbox
  name="agree"
  label="I agree to the terms"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Checkbox name |
| `label` | `string \| LocalizedString` | Yes | Checkbox label |
| `checked` | `boolean` | No | Checked state |
| `defaultChecked` | `boolean` | No | Default checked |
| `disabled` | `boolean` | No | Disable checkbox |
| `required` | `boolean` | No | Required field |
| `onChange` | `function` | No | Change handler |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Simple checkbox
<Checkbox name="subscribe" label="Subscribe to newsletter" />

// Required checkbox
<Checkbox name="terms" label="I agree to the terms and conditions" required />

// Controlled checkbox
<Checkbox
  name="option"
  label="Enable feature"
  checked={isEnabled}
  onChange={(e) => setIsEnabled(e.target.checked)}
/>
```

## See Also

- [Radio](./Radio.md)
- [FormField](./forms/FormField.md)
