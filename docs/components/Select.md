# Select

Dropdown select input component.

## Import

```typescript
import { Select } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<Select
  name="country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Select name |
| `options` | `SelectOption[]` | Yes | Select options |
| `value` | `string` | No | Selected value |
| `placeholder` | `string` | No | Placeholder text |
| `disabled` | `boolean` | No | Disable select |
| `required` | `boolean` | No | Required field |
| `onChange` | `function` | No | Change handler |
| `className` | `string` | No | Custom classes |

### SelectOption

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | Yes | Option value |
| `label` | `string \| LocalizedString` | Yes | Option label |

## Examples

```typescript
// With placeholder
<Select
  name="size"
  placeholder="Select size"
  options={[
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ]}
/>

// Controlled select
<Select
  name="category"
  value={category}
  options={categories}
  onChange={(e) => setCategory(e.target.value)}
/>
```

## See Also

- [Input](./ui/Input.md)
- [FormField](./forms/FormField.md)
