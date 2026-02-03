# MultiStepForm

Multi-step form wizard component.

## Import

```typescript
import { MultiStepForm } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<MultiStepForm
  steps={[
    {
      title: 'Personal Info',
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
      ],
    },
    {
      title: 'Company Info',
      fields: [
        { name: 'company', type: 'text', label: 'Company' },
      ],
    },
  ]}
  onSubmit={handleSubmit}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `steps` | `FormStep[]` | Yes | Form steps |
| `onSubmit` | `function` | Yes | Submit handler |
| `showProgress` | `boolean` | No | Show progress indicator |
| `className` | `string` | No | Custom classes |

## See Also

- [ContactForm](./forms/ContactForm.md)
- [FormField](./forms/FormField.md)
