# Radio

Radio button input component.

## Import

```typescript
import { Radio } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<>
  <Radio name="plan" value="basic" label="Basic Plan" />
  <Radio name="plan" value="pro" label="Pro Plan" />
  <Radio name="plan" value="enterprise" label="Enterprise Plan" />
</>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Radio group name |
| `value` | `string` | Yes | Radio value |
| `label` | `string \| LocalizedString` | Yes | Radio label |
| `checked` | `boolean` | No | Checked state |
| `disabled` | `boolean` | No | Disable radio |
| `onChange` | `function` | No | Change handler |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Radio group
<fieldset>
  <legend>Select a plan</legend>
  <Radio name="plan" value="basic" label="Basic - $9/month" />
  <Radio name="plan" value="pro" label="Pro - $29/month" />
  <Radio name="plan" value="enterprise" label="Enterprise - Custom" />
</fieldset>

// Controlled radio
<Radio
  name="option"
  value="yes"
  label="Yes"
  checked={selected === 'yes'}
  onChange={() => setSelected('yes')}
/>
```

## See Also

- [Checkbox](./Checkbox.md)
- [FormField](./forms/FormField.md)
