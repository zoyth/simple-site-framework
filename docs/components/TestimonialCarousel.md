# TestimonialCarousel

Carousel/slider for testimonials.

## Import

```typescript
import { TestimonialCarousel } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<TestimonialCarousel
  testimonials={[
    {
      quote: "Amazing product!",
      author: "Jane Doe",
      role: "CEO",
      company: "Acme Inc",
    },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `testimonials` | `Testimonial[]` | Yes | Testimonial items |
| `autoplay` | `boolean` | No | Auto-advance slides |
| `interval` | `number` | No | Autoplay interval (ms) |
| `showControls` | `boolean` | No | Show prev/next buttons |
| `showDots` | `boolean` | No | Show navigation dots |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## See Also

- [TestimonialSection](./sections/TestimonialSection.md)
