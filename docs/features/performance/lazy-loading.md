# Lazy Loading

Defer loading of non-critical content for faster initial page load.

## LazySection Component

Wrap sections that appear below the fold:

```typescript
import { LazySection } from '@zoyth/simple-site-framework/components';

export default function HomePage() {
  return (
    <>
      {/* Above fold - loads immediately */}
      <HeroSection heading="Welcome" />

      {/* Below fold - lazy loaded on scroll */}
      <LazySection>
        <FeaturesGrid features={features} />
      </LazySection>

      <LazySection>
        <TestimonialSection testimonials={testimonials} />
      </LazySection>

      <LazySection>
        <ContactSection />
      </LazySection>
    </>
  );
}
```

## How It Works

LazySection uses Intersection Observer to detect when content enters the viewport. The wrapped content is rendered only when it becomes visible (or is about to become visible).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to lazy load |
| `threshold` | `number` | `0.1` | Visibility threshold (0-1) before loading |
| `rootMargin` | `string` | `'200px'` | Margin around viewport to preload |
| `fallback` | `ReactNode` | `null` | Placeholder while loading |

## With Skeleton Loading

Show placeholder while content loads:

```typescript
<LazySection fallback={<Skeleton height={400} />}>
  <TestimonialSection testimonials={testimonials} />
</LazySection>
```

## Dynamic Imports

For heavy client components, combine with Next.js dynamic imports:

```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton height={300} />,
  ssr: false,
});

<LazySection>
  <HeavyChart data={data} />
</LazySection>
```

## When to Use

**Use LazySection for:**
- Content below the initial viewport
- Heavy sections with many images
- Sections with complex animations
- Testimonial carousels, image galleries

**Don't use LazySection for:**
- Hero section (above fold)
- Critical navigation elements
- Content needed for SEO (search engines may not scroll)

## See Also

- [LazySection Component](../../components/LazySection.md)
- [Skeleton Component](../../components/Skeleton.md)
- [Code Splitting](./code-splitting.md)
