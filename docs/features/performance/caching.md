# Caching

Caching strategies for faster page delivery.

## Static Generation (Default)

By default, Next.js App Router statically generates pages at build time:

```typescript
// This page is static - generated once at build time
export default function AboutPage() {
  return (
    <HeroSection heading="About Us" />
  );
}
```

Static pages are served from CDN with no server computation.

## Revalidation

For content that changes periodically:

### Time-Based Revalidation

```typescript
// Revalidate every hour
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
```

### On-Demand Revalidation

Revalidate when content changes:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { path } = await request.json();
  revalidatePath(path);
  return Response.json({ revalidated: true });
}
```

## Fetch Caching

Next.js caches fetch requests by default:

```typescript
// Cached indefinitely (static)
const data = await fetch('https://api.example.com/data');

// Revalidate every 60 seconds
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 },
});

// Never cache
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store',
});
```

## Browser Caching

### Cache Headers

Configure in next.config.js:

```typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};
```

### Asset Caching

Next.js automatically:
- Hashes static assets (JS, CSS) for cache busting
- Sets long cache headers on hashed files
- Serves images through optimized pipeline

## CDN Caching

When deployed to Vercel or similar platforms:
- Static pages cached at edge globally
- API routes cached based on headers
- Images optimized and cached at edge

## Caching Strategy by Content Type

| Content Type | Strategy | Revalidation |
|-------------|----------|--------------|
| Static pages (About, Contact) | Static generation | On deploy |
| Blog posts | ISR | Every 1-24 hours |
| Dynamic data (prices, stock) | No cache or short ISR | 1-5 minutes |
| Images | Long cache | On change |
| JS/CSS bundles | Immutable | On deploy (hashed) |

## See Also

- [Code Splitting](./code-splitting.md)
- [Monitoring](./monitoring.md)
- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
