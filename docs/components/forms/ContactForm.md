# ContactForm

Production-ready contact form with validation and accessibility.

## Import

```typescript
import { ContactForm } from '@zoyth/simple-site-framework';
```

**Type:** Client Component (`/client` export)

## Basic Usage

```typescript
<ContactForm
  fields={[
    { name: 'name', type: 'text', label: 'Name', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'message', type: 'textarea', label: 'Message', required: true },
  ]}
  onSubmit={async (data) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fields` | `ContactFormField[]` | Yes | Form fields |
| `onSubmit` | `function` | Yes | Submit handler |
| `submitText` | `string \| LocalizedString` | No | Submit button text |
| `successMessage` | `string \| LocalizedString` | No | Success message |
| `errorMessage` | `string \| LocalizedString` | No | Error message |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

### ContactFormField

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Field name |
| `type` | `string` | No | Field type |
| `label` | `string \| LocalizedString` | Yes | Field label |
| `placeholder` | `string` | No | Placeholder |
| `required` | `boolean` | No | Required field |
| `rows` | `number` | No | Rows (textarea) |

## Examples

```typescript
// Quote request form
<ContactForm
  fields={[
    { name: 'name', type: 'text', label: 'Full Name', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'company', type: 'text', label: 'Company' },
    { name: 'budget', type: 'text', label: 'Budget' },
    { name: 'details', type: 'textarea', label: 'Project Details', required: true, rows: 6 },
  ]}
  submitText="Request Quote"
  successMessage="Thanks! We'll send you a quote within 24 hours."
  onSubmit={handleSubmit}
/>
```

## See Also

- [ContactSection](../sections/ContactSection.md)
- [FormField](./FormField.md)
