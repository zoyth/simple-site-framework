# Open Graph

Social media preview cards for Facebook, Twitter, LinkedIn, and more.

## Overview

Open Graph tags control how your pages appear when shared on social media. The framework integrates OG tags into the SEOMetaTags component.

## Basic Setup

```typescript
import { SEOMetaTags } from '@zoyth/simple-site-framework/components';

<SEOMetaTags
  title="My Page Title"
  description="Page description"
  openGraph={{
    type: 'website',
    image: 'https://example.com/og-image.jpg',
    url: 'https://example.com/page',
    siteName: 'My Company',
  }}
/>
```

## Open Graph Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | `string` | Content type: 'website', 'article', 'product' |
| `image` | `string` | Preview image URL (1200x630px recommended) |
| `url` | `string` | Canonical URL of the page |
| `siteName` | `string` | Site name |
| `locale` | `string` | Content locale (e.g., 'en_US') |
| `title` | `string` | Override title (defaults to page title) |
| `description` | `string` | Override description |

## Twitter Cards

```typescript
<SEOMetaTags
  title="My Page"
  description="Description"
  twitter={{
    card: 'summary_large_image',
    site: '@mycompany',
    creator: '@author',
    image: 'https://example.com/twitter-card.jpg',
  }}
/>
```

### Card Types

| Type | Description |
|------|-------------|
| `summary` | Small square image with title and description |
| `summary_large_image` | Large image with title and description |

## Image Guidelines

### Open Graph Images

- **Size:** 1200 x 630 pixels
- **Format:** JPEG or PNG
- **Max size:** 5MB (Facebook), 5MB (LinkedIn)
- **Aspect ratio:** 1.91:1

### Twitter Images

- **summary:** 144 x 144 pixels minimum
- **summary_large_image:** 300 x 157 pixels minimum
- **Max size:** 5MB
- **Format:** JPEG, PNG, GIF

## Per-Page Configuration

### Homepage

```typescript
<SEOMetaTags
  title="My Company - Professional Services"
  description="Leading provider of professional services"
  openGraph={{
    type: 'website',
    image: '/images/og-home.jpg',
    siteName: 'My Company',
  }}
/>
```

### Blog Post

```typescript
<SEOMetaTags
  title={post.title}
  description={post.excerpt}
  openGraph={{
    type: 'article',
    image: post.coverImage,
    article: {
      publishedTime: post.publishedAt,
      author: post.author.name,
      tags: post.tags,
    },
  }}
/>
```

### Service Page

```typescript
<SEOMetaTags
  title="Tax Preparation Services"
  description="Professional tax services"
  openGraph={{
    type: 'website',
    image: '/images/og-tax-services.jpg',
  }}
/>
```

## Multi-Language OG Tags

```typescript
<SEOMetaTags
  title={getLocalizedString(title, locale)}
  description={getLocalizedString(description, locale)}
  openGraph={{
    type: 'website',
    locale: locale === 'fr' ? 'fr_CA' : 'en_US',
    image: `/images/og-${locale}.jpg`,
  }}
/>
```

## Testing

### Facebook Sharing Debugger

Test how your page appears on Facebook:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

### Twitter Card Validator

Test Twitter card rendering:
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### LinkedIn Post Inspector

Test LinkedIn previews:
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## Best Practices

- Always include an og:image - posts with images get more engagement
- Use high-quality images at recommended dimensions
- Test on each platform before launch
- Set unique OG data per page
- Keep titles under 60 characters
- Keep descriptions under 155 characters

## See Also

- [Meta Tags](./meta-tags.md)
- [SEOMetaTags Component](../../components/SEOMetaTags.md)
