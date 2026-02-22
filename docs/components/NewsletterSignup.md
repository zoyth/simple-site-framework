# NewsletterSignup

Email capture form with multiple layout variants, size options, client-side validation, honeypot spam protection, and bilingual support (EN/FR).

## Import

```typescript
import { NewsletterSignup } from '@zoyth/simple-site-framework';
```

**Type:** Client Component (`'use client'`)

## Basic Usage

```typescript
<NewsletterSignup
  onSubmit={async (data) => {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return { success: json.ok };
  }}
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `(data: NewsletterSubmitData) => Promise<NewsletterResponse>` | Async handler called on form submission. Receives `{ email: string; name?: string }` and must return `{ success: boolean; message?: string; error?: string }` |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'inline' \| 'stacked' \| 'minimal' \| 'card'` | `'stacked'` | Layout variant (see Variants below) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls text size and input/button padding |
| `showName` | `boolean` | `false` | Show a name input field (hidden in `minimal` variant) |
| `showPrivacy` | `boolean` | `false` | Show a privacy policy checkbox that must be accepted |
| `privacyUrl` | `string` | `'/privacy'` | URL the privacy policy link points to |
| `locale` | `string` | `'en'` | Current locale. Controls all default labels and validation messages |
| `buttonText` | `LocalizedString \| string` | `'Subscribe'` / `'S'abonner'` | Custom submit button text |
| `emailPlaceholder` | `LocalizedString \| string` | `'you@example.com'` / `'vous@exemple.com'` | Custom email placeholder |
| `namePlaceholder` | `LocalizedString \| string` | `'Your name'` / `'Votre nom'` | Custom name field placeholder |
| `successMessage` | `LocalizedString \| string` | `'Thank you for subscribing!'` / `'Merci pour votre inscription !'` | Custom success message |
| `className` | `string` | - | Additional CSS classes on the outer container |

### Type Definitions

```typescript
interface NewsletterSubmitData {
  email: string;
  name?: string;
}

interface NewsletterResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

## Variants

### Stacked (Default)

Fields and button arranged vertically with full-width inputs and labels:

```typescript
<NewsletterSignup
  onSubmit={handleSubscribe}
  variant="stacked"
/>
```

**Use for:** Sidebar widgets, dedicated signup sections, anywhere with limited horizontal space.

### Inline

Fields and button arranged horizontally in a single row:

```typescript
<NewsletterSignup
  onSubmit={handleSubscribe}
  variant="inline"
/>
```

**Use for:** Footer bars, hero sections, compact horizontal layouts. Labels are replaced with `aria-label` attributes for accessibility.

### Minimal

Email field and button only, no labels displayed:

```typescript
<NewsletterSignup
  onSubmit={handleSubscribe}
  variant="minimal"
/>
```

The `showName` prop is ignored in this variant. Accessibility labels are provided via `aria-label`.

**Use for:** Compact spaces, inline CTAs, anywhere a lightweight form is needed.

### Card

Wrapped in a bordered card with padding and subtle shadow:

```typescript
<NewsletterSignup
  onSubmit={handleSubscribe}
  variant="card"
/>
```

**Use for:** Standalone signup blocks, sidebar cards, visually distinct callouts.

## Sizes

| Size | Text | Input Padding | Button Padding |
|------|------|---------------|----------------|
| `sm` | `text-sm` | `px-3 py-1.5` | `px-4 py-1.5` |
| `md` | `text-base` | `px-4 py-2` | `px-6 py-2` |
| `lg` | `text-lg` | `px-5 py-3` | `px-8 py-3` |

```typescript
<NewsletterSignup onSubmit={handleSubscribe} size="lg" />
```

## Localization

All default labels adapt based on the `locale` prop:

| Label | English (`'en'`) | French (`'fr'`) |
|-------|-------------------|------------------|
| Subscribe button | "Subscribe" | "S'abonner" |
| Email label | "Email address" | "Adresse courriel" |
| Name label | "Name" | "Nom" |
| Email placeholder | "you@example.com" | "vous@exemple.com" |
| Name placeholder | "Your name" | "Votre nom" |
| Email required error | "Please enter your email address." | "Veuillez entrer votre adresse courriel." |
| Email invalid error | "Please enter a valid email address." | "Veuillez entrer une adresse courriel valide." |
| Privacy required error | "You must accept the privacy policy." | "Vous devez accepter la politique de confidentialite." |
| Privacy text | "I agree to the" | "J'accepte la" |
| Privacy link | "privacy policy" | "politique de confidentialite" |
| Success message | "Thank you for subscribing!" | "Merci pour votre inscription !" |
| Generic error | "Something went wrong. Please try again." | "Une erreur est survenue. Veuillez reessayer." |
| Submitting state | "Subscribing..." | "Inscription..." |

## Examples

### With Name Field

```typescript
<NewsletterSignup
  onSubmit={handleSubscribe}
  showName={true}
/>
```

### With Privacy Checkbox

```typescript
<NewsletterSignup
  onSubmit={handleSubscribe}
  showPrivacy={true}
  privacyUrl="/en/privacy-policy"
/>
```

The form will not submit until the checkbox is checked.

### French Locale

```typescript
<NewsletterSignup
  onSubmit={handleSubscribe}
  locale="fr"
  variant="card"
/>
```

### Custom Text

```typescript
<NewsletterSignup
  onSubmit={handleSubscribe}
  buttonText={{ en: 'Join the list', fr: 'Rejoindre la liste' }}
  emailPlaceholder="enter@your.email"
  successMessage={{ en: 'You are in!', fr: 'Vous etes inscrit !' }}
/>
```

### Inline in Footer

```typescript
<footer className="bg-gray-900 text-white py-12">
  <div className="max-w-4xl mx-auto">
    <h3 className="text-lg font-semibold mb-4">Stay updated</h3>
    <NewsletterSignup
      onSubmit={handleSubscribe}
      variant="inline"
      size="sm"
    />
  </div>
</footer>
```

### Card with All Options

```typescript
<NewsletterSignup
  onSubmit={handleSubscribe}
  variant="card"
  size="lg"
  showName={true}
  showPrivacy={true}
  privacyUrl="/privacy"
  locale="en"
  buttonText="Get Updates"
  emailPlaceholder="your@email.com"
  namePlaceholder="First name"
  successMessage="Welcome aboard!"
/>
```

## Validation

The component performs client-side validation before calling `onSubmit`:

1. **Empty email** - shows "Please enter your email address."
2. **Invalid email format** - uses the regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` and shows "Please enter a valid email address."
3. **Privacy checkbox** - if `showPrivacy` is `true` and unchecked, shows "You must accept the privacy policy."

Validation messages are localized based on the `locale` prop.

## Spam Protection

The component includes a hidden honeypot field. If a bot fills it in, the form silently does nothing on submit (no error, no API call). The honeypot field is:

- Hidden via CSS (`className="hidden"`)
- Marked with `aria-hidden="true"`
- Uses `tabIndex={-1}` to prevent keyboard focus
- Has `autoComplete="off"` to prevent browser autofill

## Form States

The component manages four internal states:

| State | Behavior |
|-------|----------|
| `idle` | Default state. Form is interactive |
| `submitting` | Inputs and button are disabled. Button text changes to "Subscribing..." |
| `success` | Form is replaced with the success message (rendered as a `role="status"` paragraph) |
| `error` | Error message appears below the form as a `role="alert"` paragraph |

## Accessibility

- Email input has `required` attribute
- Labels are rendered for `stacked` and `card` variants
- `aria-label` attributes are used for `inline` and `minimal` variants where visual labels are omitted
- Error messages use `role="alert"` for screen reader announcement
- Success message uses `role="status"`
- All inputs respect `disabled` state during submission

## See Also

- **[Button](./ui/Button.md)** - Button component used throughout the framework
- **[ContactSection](./sections/ContactSection.md)** - Full contact form section (for more complex form needs)
- **[BlogIndex](./BlogIndex.md)** - Blog listing page where a newsletter signup might be placed
