# SEO Best Practices

Optimization guidelines for search engine visibility.

## Technical SEO Checklist

### Must Have

- [ ] Unique title and description per page
- [ ] Canonical URLs on all pages
- [ ] XML sitemap submitted to Search Console
- [ ] robots.txt configured
- [ ] HTTPS enabled
- [ ] Mobile-responsive design
- [ ] Fast page load times

### Recommended

- [ ] Structured data (Schema.org) on key pages
- [ ] Open Graph tags for social sharing
- [ ] hreflang tags for multi-language sites
- [ ] Breadcrumb navigation with structured data
- [ ] Image alt text on all images
- [ ] Internal linking between related pages

## Page Speed

Search engines favor fast sites. Use framework performance features:

```typescript
import { LazySection } from '@zoyth/simple-site-framework/components';

// Lazy-load below-the-fold sections
<LazySection>
  <TestimonialSection testimonials={testimonials} />
</LazySection>
```

Key metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Content Optimization

### Headings

Use proper heading hierarchy:

```tsx
<h1>Main Page Title</h1>        {/* One per page */}
  <h2>Section Title</h2>        {/* Major sections */}
    <h3>Sub-section</h3>         {/* Sub-sections */}
```

### Internal Linking

Link related content to distribute page authority:

```typescript
<TrackedLink href="/services/tax-preparation">
  Learn about our tax services
</TrackedLink>
```

### Image SEO

Always include descriptive alt text:

```tsx
<img
  src="/team-photo.jpg"
  alt="Our accounting team in the Montreal office"
  width={800}
  height={600}
/>
```

## URL Structure

### Clean URLs

```
✅ /services/tax-preparation
✅ /about
✅ /blog/getting-started-guide

❌ /page?id=123
❌ /services/tax_preparation_page_v2
❌ /p/123/svc
```

### Locale URLs

```
✅ /fr/services/preparation-impots   (French)
✅ /services/tax-preparation          (English default)
```

## Multi-Language SEO

### Required Tags

```typescript
// On every localized page
<SEOMetaTags
  title={localizedTitle}
  description={localizedDescription}
  canonical={canonicalUrl}
/>

<I18nMetaTags
  currentLocale={locale}
  pathname={pathname}
  baseUrl="https://example.com"
/>
```

### Separate Content

Each locale should have unique, translated content - not machine-translated copies.

### Localized URLs

Use translated slugs when possible:

```
/en/services/tax-preparation
/fr/services/preparation-impots
```

## Common SEO Mistakes

### Duplicate Content

- Missing canonical tags
- Same content on multiple URLs
- HTTP and HTTPS both accessible
- www and non-www both accessible

### Missing Meta Tags

- No meta description (search engine generates one)
- Generic titles ("Home", "Page 1")
- Same title on every page

### Poor Mobile Experience

- Non-responsive layouts
- Small tap targets
- Content wider than viewport
- Interstitials blocking content

### Slow Performance

- Large unoptimized images
- Blocking JavaScript
- No lazy loading for below-the-fold content
- Missing caching headers

## Monitoring

### Google Search Console

- Monitor indexing status
- Check for crawl errors
- Review search performance
- Submit sitemaps
- Test URLs

### Core Web Vitals

Monitor in:
- Google Search Console > Core Web Vitals
- PageSpeed Insights
- Chrome DevTools > Lighthouse

## See Also

- [Meta Tags](./meta-tags.md)
- [Structured Data](./structured-data.md)
- [Sitemaps](./sitemaps.md)
- [Performance Features](../performance/README.md)
- [Existing SEO Documentation](../../SEO.md)
