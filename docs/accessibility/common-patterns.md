# Common Accessibility Patterns

Reusable accessibility patterns and code examples for common scenarios.

## Skip Links

Allow keyboard users to skip repetitive navigation.

```tsx
import { SkipLink } from '@zoyth/simple-site-framework'

export default function Layout({ children }) {
  return (
    <>
      <SkipLink href="#main">Skip to main content</SkipLink>
      <SkipLink href="#nav">Skip to navigation</SkipLink>

      <header>
        <nav id="nav">{/* Navigation */}</nav>
      </header>

      <main id="main">{children}</main>
    </>
  )
}
```

**Benefits:**
- Keyboard users can bypass repeated content
- Required for WCAG 2.4.1 (Level A)
- Hidden until focused

## Screen Reader Announcements

Notify users of dynamic content changes.

### Using useA11y Hook
```tsx
import { useA11y } from '@zoyth/simple-site-framework'

function FormExample() {
  const { announce } = useA11y()

  const handleSubmit = async (data) => {
    try {
      await submitForm(data)
      announce('Form submitted successfully')
    } catch (error) {
      announce('Error submitting form. Please try again.', 'assertive')
    }
  }

  return <form onSubmit={handleSubmit}>{/* fields */}</form>
}
```

### Using A11yAnnouncer Component
```tsx
import { A11yAnnouncer } from '@zoyth/simple-site-framework'

function LoadingExample() {
  const [status, setStatus] = useState('')

  useEffect(() => {
    loadData().then(() => setStatus('Loading complete'))
  }, [])

  return (
    <>
      <div>{/* content */}</div>
      <A11yAnnouncer message={status} politeness="polite" />
    </>
  )
}
```

## Focus Management

### Focus Trap (Modals)
Keep focus inside modal while open:

```tsx
import { useFocusTrap } from '@zoyth/simple-site-framework'

function CustomModal({ isOpen, onClose }) {
  const trapRef = useFocusTrap(isOpen)

  if (!isOpen) return null

  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Confirm Action</h2>
      <p>Are you sure?</p>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </div>
  )
}
```

### Focus Return
Return focus after closing modal:

```tsx
import { useFocusReturn } from '@zoyth/simple-site-framework'

function Modal({ children }) {
  const returnRef = useFocusReturn()

  return (
    <div ref={returnRef} role="dialog">
      {children}
    </div>
  )
}
```

### Manual Focus Management
```tsx
import { useRef, useEffect } from 'react'

function SearchModal({ isOpen }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen}>
      <input ref={inputRef} type="search" />
    </Modal>
  )
}
```

## Form Accessibility

### Basic Form
```tsx
import { FormField } from '@zoyth/simple-site-framework'

function ContactForm() {
  return (
    <form>
      <FormField
        name="name"
        label="Full Name"
        required
        error={errors.name}
      >
        <input type="text" {...register('name')} />
      </FormField>

      <FormField
        name="email"
        label="Email Address"
        required
        hint="We'll never share your email"
        error={errors.email}
      >
        <input type="email" {...register('email')} />
      </FormField>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Fieldset for Related Inputs
```tsx
<fieldset>
  <legend>Shipping Address</legend>

  <FormField name="street" label="Street">
    <input type="text" {...register('street')} />
  </FormField>

  <FormField name="city" label="City">
    <input type="text" {...register('city')} />
  </FormField>
</fieldset>
```

### Radio Group
```tsx
import { Radio } from '@zoyth/simple-site-framework'

<Radio
  name="plan"
  label="Choose a plan"
  options={[
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' }
  ]}
  value={selectedPlan}
  onChange={setSelectedPlan}
/>
```

## Loading States

### Loading Button
```tsx
<Button
  onClick={handleSubmit}
  loading={isSubmitting}
  loadingText="Submitting..."
>
  Submit Form
</Button>
```
**Screen reader**: "Submitting..., button, busy"

### Loading Content
```tsx
function DataTable() {
  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <LoadingSpinner />
        <span className="sr-only">Loading data...</span>
      </div>
    )
  }

  return <table>{/* data */}</table>
}
```

## Icon-Only Buttons

Always provide accessible labels:

```tsx
// ❌ Bad - no label
<button onClick={handleClose}>
  <Icons.X />
</button>

// ✅ Good - has aria-label
<Button
  icon={<Icons.X />}
  iconOnly
  aria-label="Close dialog"
  onClick={handleClose}
/>

// ✅ Also good - visual label hidden, but readable
<button onClick={handleClose}>
  <Icons.X aria-hidden="true" />
  <span className="sr-only">Close dialog</span>
</button>
```

## Data Tables

### Basic Table
```tsx
<table>
  <caption>Sales by Quarter</caption>
  <thead>
    <tr>
      <th scope="col">Quarter</th>
      <th scope="col">Sales</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Q1 2024</th>
      <td>$125,000</td>
      <td>+12%</td>
    </tr>
  </tbody>
</table>
```

### Sortable Headers
```tsx
<th scope="col">
  <button
    onClick={() => sortBy('name')}
    aria-sort={sortColumn === 'name' ? sortDirection : 'none'}
  >
    Name
    {sortColumn === 'name' && (
      <span aria-label={sortDirection === 'asc' ? 'sorted ascending' : 'sorted descending'}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )}
  </button>
</th>
```

## Accordions & Disclosure

```tsx
import { FAQAccordion } from '@zoyth/simple-site-framework'

<FAQAccordion
  items={[
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns...'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship worldwide...'
    }
  ]}
  locale="en"
/>
```

**Screen reader navigation:**
- Tab through questions
- Enter/Space to expand/collapse
- Arrow keys to navigate
- Content announces when expanded

## Breadcrumbs

```tsx
<nav aria-label="Breadcrumb">
  <ol>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/products">Products</a>
    </li>
    <li aria-current="page">
      Product Details
    </li>
  </ol>
</nav>
```

## Pagination

```tsx
<nav aria-label="Pagination">
  <Button
    onClick={prevPage}
    disabled={currentPage === 1}
    aria-label="Previous page"
  >
    Previous
  </Button>

  <span aria-current="page">
    Page {currentPage} of {totalPages}
  </span>

  <Button
    onClick={nextPage}
    disabled={currentPage === totalPages}
    aria-label="Next page"
  >
    Next
  </Button>
</nav>
```

## Tabs

```tsx
import { Tabs } from '@zoyth/simple-site-framework'

<Tabs
  tabs={[
    { value: 'tab1', label: 'Overview', content: <Overview /> },
    { value: 'tab2', label: 'Details', content: <Details /> },
    { value: 'tab3', label: 'Reviews', content: <Reviews /> }
  ]}
  value={activeTab}
  onValueChange={setActiveTab}
/>
```

**Screen reader navigation:**
- Tab to focus tab list
- Arrow keys to navigate tabs
- Enter to activate selected tab

## Tooltips

```tsx
import { Button } from '@zoyth/simple-site-framework'

<Button
  disabled={!isValid}
  disabledTooltip="Please fill all required fields"
>
  Submit
</Button>
```

**For non-disabled tooltips:**
```tsx
<button
  aria-describedby="tooltip-1"
  onMouseEnter={() => setShowTooltip(true)}
  onMouseLeave={() => setShowTooltip(false)}
  onFocus={() => setShowTooltip(true)}
  onBlur={() => setShowTooltip(false)}
>
  Help
</button>
{showTooltip && (
  <div id="tooltip-1" role="tooltip">
    Additional information
  </div>
)}
```

## Responsive Images

```tsx
<img
  src="/images/product.jpg"
  alt="Blue ceramic vase with geometric pattern"
  loading="lazy"
/>

// For decorative images
<img
  src="/images/decorative-pattern.svg"
  alt=""
  aria-hidden="true"
/>
```

## Landmarks

Use semantic HTML5 elements:

```tsx
<>
  <header>{/* Site header */}</header>

  <nav aria-label="Main navigation">
    {/* Primary navigation */}
  </nav>

  <main>
    <section aria-labelledby="products-heading">
      <h2 id="products-heading">Our Products</h2>
      {/* Products */}
    </section>

    <aside aria-label="Related articles">
      {/* Sidebar content */}
    </aside>
  </main>

  <footer>{/* Site footer */}</footer>
</>
```

## Color Contrast

Ensure proper contrast ratios:

```tsx
// ❌ Bad - low contrast
<p style={{ color: '#999', background: '#fff' }}>
  Light gray on white (3:1)
</p>

// ✅ Good - meets AA
<p style={{ color: '#666', background: '#fff' }}>
  Dark gray on white (5.7:1)
</p>

// ✅ Better - use theme colors
<p className="text-gray-700 bg-white">
  Framework colors meet AA standards
</p>
```

## Error Messages

### Inline Errors
```tsx
<FormField
  name="email"
  label="Email"
  error={{ message: 'Please enter a valid email address' }}
>
  <input
    type="email"
    aria-invalid={!!errors.email}
    aria-describedby="email-error"
  />
</FormField>
```

### Summary of Errors
```tsx
{Object.keys(errors).length > 0 && (
  <div role="alert" aria-live="assertive">
    <h2>Please fix the following errors:</h2>
    <ul>
      {Object.entries(errors).map(([field, error]) => (
        <li key={field}>
          <a href={`#${field}`}>{error.message}</a>
        </li>
      ))}
    </ul>
  </div>
)}
```

## Resources

- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
