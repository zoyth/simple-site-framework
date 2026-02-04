# Image Optimization

Serve optimized images for faster page loads.

## Next.js Image Component

Use the built-in Image component for automatic optimization:

```typescript
import Image from 'next/image';

<Image
  src="/hero-photo.jpg"
  alt="Team working together"
  width={1200}
  height={600}
  priority        // Load immediately for above-fold images
/>
```

## Priority Images

Mark above-the-fold images as priority to preload them:

```typescript
// ✅ Hero image - above fold
<Image src="/hero.jpg" alt="..." width={1200} height={600} priority />

// Regular image - below fold (lazy loaded by default)
<Image src="/team.jpg" alt="..." width={800} height={400} />
```

## Responsive Images

Serve different sizes based on viewport:

```typescript
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
/>
```

## Image Formats

Next.js automatically serves modern formats (WebP, AVIF) when supported by the browser. No configuration needed.

## External Images

Configure allowed domains for external images:

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
  },
};
```

## Background Images

For CSS background images, optimize manually:

```css
.hero {
  background-image: url('/hero-bg.webp');
  background-size: cover;
}
```

Or use a picture element for responsive backgrounds.

## Image Sizing Guidelines

| Usage | Recommended Size | Format |
|-------|-----------------|--------|
| Hero banner | 1920 x 1080 | JPEG/WebP |
| Card thumbnail | 400 x 300 | JPEG/WebP |
| Logo | 200 x 60 | SVG/PNG |
| Icon | 24 x 24 to 48 x 48 | SVG |
| Open Graph | 1200 x 630 | JPEG/PNG |
| Favicon | 32 x 32 | ICO/PNG |

## Best Practices

- Always set `width` and `height` to prevent layout shift (CLS)
- Use `priority` for above-fold images only
- Use `sizes` prop for responsive layouts
- Prefer SVG for logos and icons
- Compress images before adding to project
- Use descriptive alt text for accessibility and SEO

## See Also

- [Lazy Loading](./lazy-loading.md)
- [Bundle Size](./bundle-size.md)
- [Next.js Image Documentation](https://nextjs.org/docs/app/api-reference/components/image)
