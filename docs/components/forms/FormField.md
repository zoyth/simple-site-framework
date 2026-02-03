# FormField

Form field wrapper with label, error, and help text.

## Import

```typescript
import { FormField } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<FormField
  label="Email Address"
  name="email"
  error={errors.email}
  helperText="We'll never share your email"
>
  <Input name="email" type="email" />
</FormField>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string \| LocalizedString` | Yes | Field label |
| `name` | `string` | Yes | Field name |
| `children` | `ReactNode` | Yes | Input element |
| `error` | `string` | No | Error message |
| `helperText` | `string` | No | Help text |
| `required` | `boolean` | No | Mark as required |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// With error
<FormField
  label="Password"
  name="password"
  error="Password must be at least 8 characters"
  required
>
  <Input name="password" type="password" />
</FormField>

// With helper text
<FormField
  label="Username"
  name="username"
  helperText="Choose a unique username"
>
  <Input name="username" />
</FormField>

// Multi-language
<FormField
  label={{ en: 'Full Name', fr: 'Nom complet' }}
  name="name"
  locale={locale}
>
  <Input name="name" />
</FormField>
```

## See Also

- [Input](../ui/Input.md)
- [Textarea](../ui/Textarea.md)
- [ContactForm](./ContactForm.md)
