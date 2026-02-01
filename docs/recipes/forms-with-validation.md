# Recipe: Forms with Validation

Complete guide to building accessible forms with validation using React Hook Form and Zod.

## Overview

This recipe shows how to:
- Create forms with React Hook Form
- Validate with Zod schemas
- Display error messages accessibly
- Handle loading and success states
- Announce form submission results

## Prerequisites

```bash
npm install react-hook-form @hookform/resolvers zod
```

## Basic Contact Form

### 1. Define Zod Schema

```typescript
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>
```

### 2. Create Form Component

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, FormField, useA11y } from '@zoyth/simple-site-framework'
import { useState } from 'react'

function ContactForm() {
  const { announce } = useA11y()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      setIsSuccess(true)
      announce('Message sent successfully!', 'polite')
      reset()

      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      announce('Error sending message. Please try again.', 'assertive')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        name="name"
        label="Name"
        error={errors.name}
        required
      >
        <input
          {...register('name')}
          type="text"
          className="w-full px-4 py-2 border rounded"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
      </FormField>

      <FormField
        name="email"
        label="Email"
        error={errors.email}
        required
      >
        <input
          {...register('email')}
          type="email"
          className="w-full px-4 py-2 border rounded"
          aria-invalid={errors.email ? 'true' : 'false'}
        />
      </FormField>

      <FormField
        name="message"
        label="Message"
        error={errors.message}
        required
      >
        <textarea
          {...register('message')}
          rows={4}
          className="w-full px-4 py-2 border rounded"
          aria-invalid={errors.message ? 'true' : 'false'}
        />
      </FormField>

      <Button
        type="submit"
        variant="filled"
        size="lg"
        loading={isSubmitting}
        loadingText="Sending..."
        success={isSuccess}
        successText="Sent!"
        disabled={isSubmitting}
      >
        Send Message
      </Button>
    </form>
  )
}
```

## Advanced: Multi-Step Form

```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, FormField } from '@zoyth/simple-site-framework'

// Step schemas
const step1Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

const step2Schema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
})

const step3Schema = z.object({
  message: z.string().min(10),
})

// Combined schema
const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema)
type FormData = z.infer<typeof fullSchema>

function MultiStepForm() {
  const [step, setStep] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange',
  })

  const nextStep = async () => {
    let isValid = false

    if (step === 1) {
      isValid = await trigger(['name', 'email'])
    } else if (step === 2) {
      isValid = await trigger(['company', 'role'])
    }

    if (isValid) {
      setStep(step + 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data)
    // Handle submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-1/3 h-2 ${
                s <= step ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Step {step} of 3
        </p>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-6">
          <FormField name="name" label="Name" error={errors.name} required>
            <input {...register('name')} type="text" />
          </FormField>

          <FormField name="email" label="Email" error={errors.email} required>
            <input {...register('email')} type="email" />
          </FormField>

          <Button onClick={nextStep} variant="filled">
            Next
          </Button>
        </div>
      )}

      {/* Step 2: Company Info */}
      {step === 2 && (
        <div className="space-y-6">
          <FormField name="company" label="Company" error={errors.company} required>
            <input {...register('company')} type="text" />
          </FormField>

          <FormField name="role" label="Role" error={errors.role} required>
            <input {...register('role')} type="text" />
          </FormField>

          <div className="flex gap-4">
            <Button onClick={() => setStep(1)} variant="outlined">
              Back
            </Button>
            <Button onClick={nextStep} variant="filled">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Message */}
      {step === 3 && (
        <div className="space-y-6">
          <FormField name="message" label="Message" error={errors.message} required>
            <textarea {...register('message')} rows={4} />
          </FormField>

          <div className="flex gap-4">
            <Button onClick={() => setStep(2)} variant="outlined">
              Back
            </Button>
            <Button type="submit" variant="filled">
              Submit
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
```

## Form with File Upload

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

const formSchema = z.object({
  name: z.string().min(2),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'File is required')
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      'File size must be less than 5MB'
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files[0]?.type),
      'Only .jpg, .png, and .pdf files are accepted'
    ),
})

function FileUploadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('file', data.file[0])

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField name="name" label="Name" error={errors.name}>
        <input {...register('name')} type="text" />
      </FormField>

      <FormField
        name="file"
        label="Upload File"
        error={errors.file}
        helpText="Max 5MB. Accepted: JPG, PNG, PDF"
      >
        <input {...register('file')} type="file" accept=".jpg,.png,.pdf" />
      </FormField>

      <Button type="submit" variant="filled">
        Upload
      </Button>
    </form>
  )
}
```

## Accessibility Checklist

- [ ] All fields have associated labels
- [ ] Required fields marked with `required` prop
- [ ] Error messages are descriptive and specific
- [ ] Errors announced to screen readers
- [ ] Success announced to screen readers
- [ ] Loading state disables submit button
- [ ] Form can be completed with keyboard only
- [ ] Focus indicators are visible
- [ ] Error fields receive focus
- [ ] Help text provides clear guidance

## Best Practices

1. **Validation**
   - Validate on client and server
   - Provide instant feedback
   - Show errors after blur, not while typing
   - Clear errors when fixed

2. **Error Messages**
   - Be specific about the problem
   - Suggest how to fix it
   - Use plain language
   - Display near the field

3. **Loading States**
   - Disable submit during submission
   - Show loading indicator
   - Don't lose form data on error
   - Provide feedback on success

4. **Accessibility**
   - Use semantic HTML (`<form>`, `<label>`, `<input>`)
   - Link labels to inputs with `htmlFor`/`id`
   - Use `aria-invalid` on error fields
   - Announce success/error to screen readers
   - Make form keyboard navigable

5. **UX**
   - Auto-focus first field
   - Save progress for long forms
   - Confirm before leaving with unsaved changes
   - Provide clear submission feedback
