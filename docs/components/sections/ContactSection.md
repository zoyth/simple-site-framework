# ContactSection

Complete contact section with form, contact information, and location details. Essential for lead generation and customer communication.

## Import

```typescript
import { ContactSection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component (default export)

## Basic Usage

```typescript
<ContactSection
  heading="Get in Touch"
  description="We'd love to hear from you"
  email="contact@yourcompany.com"
  phone="+1 (555) 123-4567"
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `heading` | `string \| LocalizedString` | Section heading |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `description` | `string \| LocalizedString` | - | Section description |
| `email` | `string` | - | Contact email address |
| `phone` | `string` | - | Contact phone number |
| `locations` | `Location[]` | - | Physical locations |
| `formConfig` | `ContactFormConfig` | - | Contact form configuration |
| `showForm` | `boolean` | `true` | Show contact form |
| `showContactInfo` | `boolean` | `true` | Show contact details |
| `variant` | `'default' \| 'split'` | `'default'` | Layout variant |
| `maxWidth` | `MaxWidth` | `'2xl'` | Maximum content width |
| `className` | `string` | - | Custom CSS classes |
| `locale` | `string` | - | Current locale |

### Type Definitions

```typescript
interface Location {
  city: string | LocalizedString;
  address: string | LocalizedString;
  mapUrl?: string;
  phone?: string;
  email?: string;
}

interface ContactFormConfig {
  fields: ContactFormField[];
  submitText?: string | LocalizedString;
  successMessage?: string | LocalizedString;
  errorMessage?: string | LocalizedString;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

interface ContactFormField {
  name: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  label: string | LocalizedString;
  placeholder?: string | LocalizedString;
  required?: boolean;
  rows?: number;
  helperText?: string | LocalizedString;
}
```

## Examples

### Basic Contact Section

```typescript
<ContactSection
  heading="Contact Us"
  description="We're here to help"
  email="hello@company.com"
  phone="+1 (555) 123-4567"
/>
```

### With Multiple Locations

```typescript
<ContactSection
  heading="Visit Our Offices"
  description="We have locations worldwide"
  locations={[
    {
      city: 'New York',
      address: '123 Main St, Suite 100, New York, NY 10001',
      mapUrl: 'https://maps.google.com/?q=123+Main+St+New+York',
      phone: '+1 (555) 123-4567',
      email: 'ny@company.com',
    },
    {
      city: 'London',
      address: '456 Oxford Street, London, UK',
      mapUrl: 'https://maps.google.com/?q=456+Oxford+St+London',
      phone: '+44 20 1234 5678',
      email: 'london@company.com',
    },
  ]}
/>
```

### With Custom Contact Form

```typescript
<ContactSection
  heading="Get a Quote"
  description="Tell us about your project"
  email="quotes@company.com"
  formConfig={{
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
      },
      {
        name: 'company',
        type: 'text',
        label: 'Company Name',
      },
      {
        name: 'budget',
        type: 'text',
        label: 'Project Budget',
        placeholder: 'e.g., $10,000 - $25,000',
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Project Details',
        required: true,
        rows: 6,
        helperText: 'Please provide as much detail as possible',
      },
    ],
    submitText: 'Request Quote',
    successMessage: 'Thanks! We\'ll send you a quote within 24 hours.',
    onSubmit: async (data) => {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  }}
/>
```

### Form Only (No Contact Info)

```typescript
<ContactSection
  heading="Send Us a Message"
  description="Fill out the form below"
  showContactInfo={false}
  formConfig={{
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'message', type: 'textarea', label: 'Message', required: true },
    ],
  }}
/>
```

### Contact Info Only (No Form)

```typescript
<ContactSection
  heading="Reach Out"
  description="Multiple ways to get in touch"
  email="support@company.com"
  phone="+1 (555) 123-4567"
  showForm={false}
  locations={[
    {
      city: 'Headquarters',
      address: '123 Business Blvd, Suite 500',
      mapUrl: 'https://maps.google.com/?q=123+Business+Blvd',
    },
  ]}
/>
```

### Multi-Language

```typescript
<ContactSection
  heading={{
    en: 'Contact Us',
    fr: 'Contactez-nous',
    es: 'Contáctenos',
  }}
  description={{
    en: 'We\'d love to hear from you',
    fr: 'Nous aimerions avoir de vos nouvelles',
    es: 'Nos encantaría saber de usted',
  }}
  email="contact@company.com"
  locations={[
    {
      city: { en: 'New York', fr: 'New York', es: 'Nueva York' },
      address: {
        en: '123 Main Street',
        fr: '123 rue principale',
        es: '123 Calle Principal',
      },
      mapUrl: 'https://maps.google.com/?q=123+Main+St+New+York',
    },
  ]}
  formConfig={{
    fields: [
      {
        name: 'name',
        type: 'text',
        label: { en: 'Full Name', fr: 'Nom complet', es: 'Nombre completo' },
        required: true,
      },
      {
        name: 'email',
        type: 'email',
        label: { en: 'Email', fr: 'Courriel', es: 'Correo electrónico' },
        required: true,
      },
      {
        name: 'message',
        type: 'textarea',
        label: { en: 'Message', fr: 'Message', es: 'Mensaje' },
        required: true,
      },
    ],
    submitText: {
      en: 'Send Message',
      fr: 'Envoyer le message',
      es: 'Enviar mensaje',
    },
    successMessage: {
      en: 'Thank you! We\'ll respond within 24 hours.',
      fr: 'Merci! Nous répondrons dans les 24 heures.',
      es: 'Gracias! Responderemos en 24 horas.',
    },
  }}
  locale={locale}
/>
```

### Split Layout Variant

```typescript
<ContactSection
  heading="Let's Talk"
  description="Schedule a consultation"
  variant="split"
  email="sales@company.com"
  phone="+1 (555) 123-4567"
  formConfig={{
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'phone', type: 'tel', label: 'Phone' },
      { name: 'message', type: 'textarea', label: 'How can we help?', required: true },
    ],
  }}
/>
```

## Form Integration

### With Custom API Endpoint

```typescript
<ContactSection
  heading="Contact"
  formConfig={{
    fields: [...],
    onSubmit: async (data) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    },
  }}
/>
```

### With Email Service (Resend)

```typescript
// pages/api/contact.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { name, email, message } = req.body;

  await resend.emails.send({
    from: 'noreply@yourcompany.com',
    to: 'contact@yourcompany.com',
    subject: `New contact from ${name}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  res.status(200).json({ success: true });
}

// Component
<ContactSection
  heading="Contact"
  formConfig={{
    fields: [...],
    onSubmit: async (data) => {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
  }}
/>
```

### With Analytics Tracking

```typescript
import { trackEvent } from '@/lib/analytics';

<ContactSection
  heading="Contact"
  formConfig={{
    fields: [...],
    onSubmit: async (data) => {
      // Track form submission
      trackEvent('contact_form_submit', {
        form_location: 'contact_page',
      });

      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Track successful submission
      trackEvent('lead_generated', {
        lead_source: 'contact_form',
      });
    },
  }}
/>
```

## Styling

### Custom Background

```typescript
<ContactSection
  heading="Get in Touch"
  className="bg-gradient-to-br from-blue-50 to-indigo-50"
  email="contact@company.com"
/>
```

### Custom Form Styling

```typescript
<ContactSection
  heading="Contact"
  formConfig={{
    fields: [...],
    className: 'bg-white shadow-xl rounded-lg p-8',
  }}
/>
```

## Accessibility

ContactSection includes:

- ✅ Semantic HTML (`<section>`, `<form>`, `<address>`)
- ✅ Proper form labels and associations
- ✅ ARIA attributes for validation states
- ✅ Error announcements to screen readers
- ✅ Keyboard navigation for all interactive elements
- ✅ Focus management on form submission
- ✅ Required field indicators
- ✅ Clickable phone numbers (`tel:` links)
- ✅ Clickable email addresses (`mailto:` links)

## Validation

Built-in validation includes:

- **Required fields** - Shows error if empty
- **Email format** - Validates email addresses
- **Phone format** - Validates phone numbers (optional)
- **Custom validation** - Add custom rules per field

```typescript
<ContactSection
  formConfig={{
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        // Automatic email validation
      },
      {
        name: 'phone',
        type: 'tel',
        label: 'Phone',
        // Automatic phone validation
      },
    ],
  }}
/>
```

## SEO

- Email and phone are automatically wrapped in proper links
- Structured data can be added via JSON-LD
- Location information is semantic

### Add Structured Data

```typescript
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "Customer Service",
    "email": "contact@company.com"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "New York",
    "postalCode": "10001",
    "addressCountry": "US"
  }
}
</script>
```

## Common Patterns

### Contact Page

```typescript
export default function ContactPage() {
  return (
    <main>
      <ContactSection
        heading="Contact Our Team"
        description="We're here to help with any questions"
        email="support@company.com"
        phone="+1 (555) 123-4567"
        locations={[
          {
            city: 'San Francisco',
            address: '123 Market Street, San Francisco, CA 94105',
            mapUrl: 'https://maps.google.com/?q=123+Market+St+SF',
          },
        ]}
        formConfig={{
          fields: [
            { name: 'name', type: 'text', label: 'Name', required: true },
            { name: 'email', type: 'email', label: 'Email', required: true },
            { name: 'subject', type: 'text', label: 'Subject', required: true },
            { name: 'message', type: 'textarea', label: 'Message', required: true, rows: 6 },
          ],
          submitText: 'Send Message',
          successMessage: 'Thanks! We\'ll get back to you soon.',
        }}
      />
    </main>
  );
}
```

### Sales Inquiry Form

```typescript
<ContactSection
  heading="Request a Demo"
  description="See how our platform can help your business"
  formConfig={{
    fields: [
      { name: 'name', type: 'text', label: 'Full Name', required: true },
      { name: 'email', type: 'email', label: 'Work Email', required: true },
      { name: 'company', type: 'text', label: 'Company', required: true },
      { name: 'employees', type: 'text', label: 'Company Size', placeholder: 'e.g., 50-100' },
      { name: 'message', type: 'textarea', label: 'Tell us about your needs', rows: 4 },
    ],
    submitText: 'Schedule Demo',
    onSubmit: async (data) => {
      await fetch('/api/demo-request', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  }}
/>
```

### Support Contact

```typescript
<ContactSection
  heading="Customer Support"
  description="We're available 24/7 to assist you"
  email="support@company.com"
  phone="+1 (800) 555-HELP"
  showForm={false}
  locations={[
    {
      city: 'Support Center',
      address: 'Available via email and phone',
    },
  ]}
/>
```

## Troubleshooting

### Form not submitting

**Check:**
1. `onSubmit` function is provided
2. API endpoint is accessible
3. CORS is configured if calling external API
4. Form fields are valid

### Validation errors not showing

**Check:**
1. Field has `required: true`
2. Form has been submitted at least once
3. Error messages are defined in config

### Map links not working

**Check:**
1. `mapUrl` is a valid Google Maps URL
2. URL is properly encoded
3. Link is not disabled by CSS

### Multi-language content not displaying

**Check:**
1. `locale` prop is provided
2. All LocalizedStrings have entry for that locale
3. Fallback locale exists

## Related Components

- **[ContactForm](../forms/ContactForm.md)** - Standalone contact form
- **[FormField](../forms/FormField.md)** - Individual form field component
- **[HeroSection](./HeroSection.md)** - Page header

## API Reference

Full TypeScript definitions: **[API Reference](../../api/components.md#contactsection)**
