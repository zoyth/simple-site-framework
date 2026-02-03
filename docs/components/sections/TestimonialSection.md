# TestimonialSection

Customer testimonials display section.

## Import

```typescript
import { TestimonialSection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<TestimonialSection
  heading="What Our Clients Say"
  testimonials={[
    {
      quote: 'Working with this team transformed our business. Revenue increased 300%.',
      author: 'Jane Smith',
      role: 'CEO',
      company: 'Tech Startup Inc',
      image: '/testimonials/jane.jpg',
    },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `string \| LocalizedString` | Yes | Section heading |
| `description` | `string \| LocalizedString` | No | Section description |
| `testimonials` | `Testimonial[]` | Yes | Testimonial items |
| `variant` | `'grid' \| 'carousel'` | No | Display variant |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## See Also

- [TestimonialCarousel](../TestimonialCarousel.md)
- [LiveProof](../LiveProof.md)
