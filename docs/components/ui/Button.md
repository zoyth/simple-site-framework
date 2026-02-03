# Button

Themeable button component with multiple variants and sizes. The fundamental interactive element used throughout the framework.

## Import

```typescript
import { Button } from '@zoyth/simple-site-framework';
```

**Type:** Server Component (default export)

## Basic Usage

```typescript
<Button>Click Me</Button>
```

## Props

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outline' \| 'ghost' \| 'link'` | `'filled'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable button |
| `loading` | `boolean` | `false` | Show loading state |
| `className` | `string` | - | Custom CSS classes |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `onClick` | `() => void` | - | Click handler |
| `children` | `ReactNode` | - | Button content |

## Variants

### Filled (Default)

Solid background, primary brand color:

```typescript
<Button variant="filled">
  Get Started
</Button>
```

**Use for:** Primary actions, main CTAs, submission buttons

### Outline

Transparent background with border:

```typescript
<Button variant="outline">
  Learn More
</Button>
```

**Use for:** Secondary actions, cancel buttons, alternative options

### Ghost

Transparent background, no border:

```typescript
<Button variant="ghost">
  Skip
</Button>
```

**Use for:** Tertiary actions, dismiss buttons, subtle interactions

### Link

Styled as a text link:

```typescript
<Button variant="link">
  View Details
</Button>
```

**Use for:** Inline actions, navigation, less prominent options

## Sizes

### Small

```typescript
<Button size="sm">
  Small Button
</Button>
```

Compact size for tight spaces, inline use.

### Medium (Default)

```typescript
<Button size="md">
  Medium Button
</Button>
```

Standard size for most use cases.

### Large

```typescript
<Button size="lg">
  Large Button
</Button>
```

Prominent size for hero CTAs, important actions.

## Examples

### Primary Action

```typescript
<Button variant="filled" size="lg">
  Start Free Trial
</Button>
```

### Secondary Action

```typescript
<Button variant="outline">
  View Pricing
</Button>
```

### Disabled State

```typescript
<Button disabled>
  Unavailable
</Button>
```

### Loading State

```typescript
<Button loading>
  Processing...
</Button>
```

### With Click Handler

```typescript
<Button
  onClick={() => {
    console.log('Button clicked!');
    trackEvent('button_click');
  }}
>
  Track This Click
</Button>
```

### Form Submit

```typescript
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="filled">
    Submit Form
  </Button>
</form>
```

### Button Group

```typescript
<div className="flex gap-4">
  <Button variant="filled">
    Save
  </Button>
  <Button variant="outline">
    Cancel
  </Button>
</div>
```

### Full Width

```typescript
<Button className="w-full">
  Continue
</Button>
```

### With Icon

```typescript
<Button>
  <svg className="w-5 h-5 mr-2" /* ... */>
    {/* icon */}
  </svg>
  Download PDF
</Button>
```

### Custom Colors

```typescript
<Button className="bg-purple-600 hover:bg-purple-700">
  Custom Color
</Button>
```

### Responsive Sizing

```typescript
<Button className="text-sm md:text-base lg:text-lg">
  Responsive Size
</Button>
```

## Styling

### Theme Integration

Buttons automatically use your theme colors:

```typescript
// In tailwind.config.ts
colors: {
  primary: '#F16531',
  'primary-hover': '#D9551C',
}

// Button uses these automatically
<Button variant="filled" /> // Uses primary and primary-hover
```

### Custom Styling

Override with className:

```typescript
<Button className="bg-gradient-to-r from-blue-500 to-purple-600">
  Gradient Button
</Button>
```

### Dark Mode Support

```typescript
<Button className="dark:bg-gray-800 dark:text-white">
  Dark Mode Button
</Button>
```

## Accessibility

Button includes:

- ✅ Semantic `<button>` element
- ✅ Keyboard accessible (Enter/Space)
- ✅ Focus visible states
- ✅ Proper disabled state (not clickable)
- ✅ Loading state with aria-busy
- ✅ Sufficient color contrast (WCAG AA)

### ARIA Attributes

```typescript
<Button
  aria-label="Submit contact form"
  aria-describedby="submit-help-text"
>
  Submit
</Button>
```

### Loading State Accessibility

```typescript
<Button loading aria-busy="true">
  Saving...
</Button>
```

## Common Patterns

### Confirm/Cancel Pair

```typescript
<div className="flex gap-4">
  <Button
    variant="filled"
    onClick={handleConfirm}
  >
    Confirm
  </Button>
  <Button
    variant="outline"
    onClick={handleCancel}
  >
    Cancel
  </Button>
</div>
```

### CTA with Secondary

```typescript
<div className="flex flex-col sm:flex-row gap-4">
  <Button variant="filled" size="lg">
    Get Started Free
  </Button>
  <Button variant="outline" size="lg">
    Schedule Demo
  </Button>
</div>
```

### Loading Button

```typescript
function SubmitButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await submitForm();
    setLoading(false);
  };

  return (
    <Button loading={loading} onClick={handleClick}>
      {loading ? 'Submitting...' : 'Submit'}
    </Button>
  );
}
```

### Conditional Disabled

```typescript
<Button disabled={!isValid}>
  Continue
</Button>
```

### With Analytics

```typescript
<Button
  onClick={() => {
    trackEvent('cta_click', {
      button_text: 'Start Trial',
      location: 'hero'
    });
    router.push('/signup');
  }}
>
  Start Trial
</Button>
```

## Button as Link

For navigation, use Next.js Link:

```typescript
import Link from 'next/link';
import { Button } from '@zoyth/simple-site-framework';

<Link href="/pricing">
  <Button variant="outline">
    View Pricing
  </Button>
</Link>
```

Or use `<a>` styled as button:

```typescript
<a
  href="/pricing"
  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
>
  View Pricing
</a>
```

## Form Integration

### Submit Button

```typescript
<form onSubmit={handleSubmit}>
  <input type="email" name="email" />
  <Button type="submit" variant="filled">
    Subscribe
  </Button>
</form>
```

### Reset Button

```typescript
<form>
  {/* form fields */}
  <div className="flex gap-4">
    <Button type="submit" variant="filled">
      Submit
    </Button>
    <Button type="reset" variant="ghost">
      Reset
    </Button>
  </div>
</form>
```

### Validation State

```typescript
function FormWithValidation() {
  const [isValid, setIsValid] = useState(false);

  return (
    <form>
      <input onChange={e => setIsValid(e.target.value.length > 0)} />
      <Button type="submit" disabled={!isValid}>
        {isValid ? 'Submit' : 'Please fill in all fields'}
      </Button>
    </form>
  );
}
```

## Best Practices

### ✅ Do

- Use filled variant for primary actions
- Provide clear, action-oriented text
- Show loading state during async operations
- Disable buttons during submission
- Use appropriate size for context
- Include sufficient padding for touch targets (44px minimum)
- Test keyboard navigation

### ❌ Don't

- Use multiple filled buttons competing for attention
- Make buttons too small (hard to click)
- Use vague text like "Click Here" or "Submit"
- Forget to handle loading/disabled states
- Override focus styles without providing alternatives
- Make all buttons the same style (no hierarchy)

## Troubleshooting

### Button not styled

**Check:**
1. Tailwind config includes framework in `content` array
2. Theme colors are defined
3. Import is correct
4. No CSS overriding styles

### onClick not firing

**Check:**
1. Button is not disabled
2. No overlay blocking clicks
3. Event handler is properly bound
4. Not prevented by parent element

### Focus not visible

**Check:**
1. Focus styles not removed by CSS reset
2. Browser default focus styles working
3. Custom focus styles have sufficient contrast

### Loading spinner not showing

**Check:**
1. `loading` prop is `true`
2. Loading indicator is implemented in component
3. No CSS hiding the indicator

## Variants Reference

| Variant | Background | Border | Text Color | Use Case |
|---------|------------|--------|------------|----------|
| `filled` | Primary | None | White | Primary actions, main CTAs |
| `outline` | Transparent | Primary | Primary | Secondary actions, alternatives |
| `ghost` | Transparent | None | Primary | Tertiary actions, subtle |
| `link` | Transparent | None | Primary | Inline actions, navigation |

## Size Reference

| Size | Padding | Font Size | Use Case |
|------|---------|-----------|----------|
| `sm` | px-4 py-2 | text-sm | Compact spaces, inline use |
| `md` | px-6 py-3 | text-base | Standard buttons, forms |
| `lg` | px-8 py-4 | text-lg | Hero CTAs, prominent actions |

## Related Components

- **[CTASection](../sections/CTASection.md)** - Uses Button internally
- **[ContactForm](../forms/ContactForm.md)** - Form with submit button
- **[FormField](../forms/FormField.md)** - Form field with button

## API Reference

Full TypeScript definitions: **[API Reference](../../api/components.md#button)**
