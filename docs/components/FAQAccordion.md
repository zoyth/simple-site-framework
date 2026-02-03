# FAQAccordion

Frequently asked questions accordion component.

## Import

```typescript
import { FAQAccordion } from '@zoyth/simple-site-framework';
```

**Type:** Client Component

## Basic Usage

```typescript
<FAQAccordion
  faqs={[
    {
      question: 'What is included in the free trial?',
      answer: 'Full access to all features for 14 days.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, cancel anytime with no penalties.',
    },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `faqs` | `FAQ[]` | Yes | FAQ items |
| `allowMultiple` | `boolean` | No | Allow multiple open (default: false) |
| `defaultOpen` | `number[]` | No | Initially open items |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

### FAQ

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `question` | `string \| LocalizedString` | Yes | Question text |
| `answer` | `string \| LocalizedString` | Yes | Answer text |

## Examples

```typescript
// Allow multiple open
<FAQAccordion
  faqs={faqs}
  allowMultiple
/>

// Default open first item
<FAQAccordion
  faqs={faqs}
  defaultOpen={[0]}
/>
```

## See Also

- [Modal](./ui/Modal.md)
- [Tabs](./ui/Tabs.md)
