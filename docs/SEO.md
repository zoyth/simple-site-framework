# SEO Optimization Guide

Complete guide to implementing SEO best practices with the Simple Site Framework.

## Table of Contents

- [Overview](#overview)
- [SEOMetaTags Component](#seometatags-component)
- [Open Graph Protocol](#open-graph-protocol)
- [Twitter Cards](#twitter-cards)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Integration with I18n](#integration-with-i18n)

## Overview

The framework provides comprehensive SEO utilities to help your site rank well in search engines and look great when shared on social media:

- **SEOMetaTags**: Page-level metadata component
- **I18nMetaTags**: Multi-language SEO tags with hreflang
- **Structured Data**: JSON-LD helpers for rich snippets (see [STRUCTURED-DATA.md](./STRUCTURED-DATA.md))
- **Sitemap Generation**: Automatic sitemap creation (see [SITEMAP.md](./SITEMAP.md))

## SEOMetaTags Component

The `<SEOMetaTags>` component generates all essential meta tags for a page.

### Basic Usage

```tsx
import { SEOMetaTags } from 'simple-site-framework/components';

export default function Page() {
  return (
    <>
      <SEOMetaTags
        title="Best Email Marketing Platform | Acme"
        description="Send beautiful email campaigns that convert. Start free today."
      />
      <main>
        {/* Page content */}
      </main>
    </>
  );
}
```

This generates:

```html
<title>Best Email Marketing Platform | Acme</title>
<meta name="description" content="Send beautiful email campaigns that convert. Start free today." />
<meta property="og:title" content="Best Email Marketing Platform | Acme" />
<meta property="og:description" content="Send beautiful email campaigns that convert. Start free today." />
<meta name="twitter:title" content="Best Email Marketing Platform | Acme" />
<meta name="twitter:description" content="Send beautiful email campaigns that convert. Start free today." />
```

### Full Example with All Options

```tsx
<SEOMetaTags
  // Basic meta tags
  title="How to Build High-Converting Landing Pages"
  description="Learn proven strategies to create landing pages that convert visitors into customers. Includes examples and templates."
  keywords={['landing pages', 'conversion optimization', 'marketing']}

  // Canonical URL (prevents duplicate content issues)
  canonical="https://example.com/blog/landing-pages"

  // Robots directives
  noIndex={false}
  noFollow={false}

  // Open Graph (Facebook, LinkedIn)
  openGraph={{
    title: "How to Build High-Converting Landing Pages",
    description: "Learn proven strategies to create landing pages that convert.",
    image: "https://example.com/images/blog/landing-pages-og.jpg",
    imageAlt: "Landing page design mockup",
    type: "article",
    url: "https://example.com/blog/landing-pages",
    siteName: "Acme Blog",
    locale: "en_US",
    alternateLocales: ["fr_FR", "es_ES"],
    // Article-specific fields
    publishedTime: "2024-01-15T10:00:00Z",
    modifiedTime: "2024-01-20T14:30:00Z",
    authors: ["https://example.com/authors/jane-doe"],
    section: "Marketing",
    tags: ["conversion", "landing pages", "optimization"]
  }}

  // Twitter Card
  twitter={{
    card: "summary_large_image",
    site: "@acme",
    creator: "@janedoe",
    image: "https://example.com/images/blog/landing-pages-twitter.jpg",
    imageAlt: "Landing page design mockup"
  }}

  // Additional custom meta tags
  additionalMetaTags={[
    { name: "author", content: "Jane Doe" },
    { property: "fb:app_id", content: "123456789" }
  ]}

  // Additional link tags
  additionalLinkTags={[
    { rel: "alternate", href: "https://example.com/fr/blog/landing-pages", hreflang: "fr" }
  ]}
/>
```

## Open Graph Protocol

Open Graph tags control how your pages appear when shared on Facebook, LinkedIn, and other social platforms.

### Page Types

```tsx
// Website (default)
<SEOMetaTags
  title="Acme - Email Marketing Platform"
  description="..."
  openGraph={{
    type: "website",
    siteName: "Acme"
  }}
/>

// Article/Blog Post
<SEOMetaTags
  title="10 Email Marketing Tips"
  description="..."
  openGraph={{
    type: "article",
    publishedTime: "2024-01-15T10:00:00Z",
    modifiedTime: "2024-01-20T14:30:00Z",
    authors: ["https://example.com/authors/jane-doe"],
    section: "Marketing",
    tags: ["email", "marketing", "tips"]
  }}
/>

// Product
<SEOMetaTags
  title="Premium Email Plan - $99/month"
  description="..."
  openGraph={{
    type: "product",
    image: "https://example.com/products/premium-plan.jpg"
  }}
/>
```

### Image Recommendations

- **Minimum size**: 1200×630 pixels
- **Aspect ratio**: 1.91:1 (Facebook) or 2:1 (LinkedIn)
- **Format**: JPG or PNG
- **Max file size**: 8 MB
- **Always use absolute URLs**: `https://example.com/image.jpg`

```tsx
<SEOMetaTags
  title="..."
  description="..."
  openGraph={{
    image: "https://example.com/og-image.jpg", // Absolute URL
    imageAlt: "Descriptive alt text for accessibility"
  }}
/>
```

## Twitter Cards

Twitter Cards enhance how your links appear on Twitter/X.

### Card Types

**Summary Card** (Small image, good for text-focused content):

```tsx
<SEOMetaTags
  title="..."
  description="..."
  twitter={{
    card: "summary",
    site: "@yourcompany",
    creator: "@author"
  }}
/>
```

**Summary Large Image** (Large image, good for visual content):

```tsx
<SEOMetaTags
  title="..."
  description="..."
  twitter={{
    card: "summary_large_image",
    site: "@yourcompany",
    image: "https://example.com/twitter-card.jpg",
    imageAlt: "Descriptive alt text"
  }}
/>
```

### Image Recommendations

- **Summary card**: 1:1 aspect ratio (e.g., 400×400)
- **Large image card**: 2:1 aspect ratio (e.g., 1200×600)
- **Max file size**: 5 MB

## Best Practices

### Title Tags

**Length**: 50-60 characters (longer titles get truncated in search results)

```tsx
// ✅ Good
title="Email Marketing Platform | Acme"

// ❌ Too long
title="Acme - The Best Email Marketing Platform for Small Businesses and Enterprises"
```

**Format**: `Page Title | Brand Name` or `Page Title - Brand Name`

```tsx
// Homepage
title="Acme - Email Marketing Platform"

// Product page
title="Pricing Plans | Acme"

// Blog post
title="10 Email Tips | Acme Blog"
```

### Meta Descriptions

**Length**: 150-160 characters (longer descriptions get truncated)

```tsx
// ✅ Good - Clear, actionable, within limit
description="Send beautiful email campaigns that convert. Easy drag-and-drop builder, powerful automation, detailed analytics. Start free today."

// ❌ Too short - Doesn't use available space
description="Email marketing platform."

// ❌ Too long - Gets truncated
description="Acme is the world's leading email marketing platform trusted by over 100,000 businesses worldwide to send beautiful campaigns..."
```

**Include**:
- Clear value proposition
- Call to action
- Relevant keywords (naturally)

### Keywords

**Note**: The `keywords` meta tag has minimal impact on modern SEO. Focus on:
1. Using keywords naturally in title and description
2. Structuring content with proper headings
3. Creating quality content

```tsx
// Optional - use sparingly
keywords={['email marketing', 'marketing automation', 'email campaigns']}
```

### Canonical URLs

Always use **absolute URLs** for canonical tags:

```tsx
// ✅ Correct
canonical="https://example.com/products/premium"

// ❌ Wrong
canonical="/products/premium"
```

**When to use**:
- Prevent duplicate content issues
- Consolidate similar pages (e.g., paginated content)
- Specify preferred URL for search engines

### Robots Directives

```tsx
// Allow indexing and following links (default)
<SEOMetaTags noIndex={false} noFollow={false} />

// Prevent indexing (e.g., private pages, duplicate content)
<SEOMetaTags noIndex={true} noFollow={false} />

// Prevent following links (rare - use with caution)
<SEOMetaTags noIndex={false} noFollow={true} />
```

**Common use cases for noIndex**:
- Thank you pages
- Confirmation pages
- Internal search results
- Duplicate content variations

## Common Patterns

### Homepage

```tsx
<SEOMetaTags
  title="Acme - Email Marketing Platform"
  description="Send beautiful email campaigns that convert. Trusted by 100,000+ businesses worldwide. Start free today."
  canonical="https://acme.com"
  openGraph={{
    type: "website",
    siteName: "Acme",
    image: "https://acme.com/og-homepage.jpg",
    locale: "en_US"
  }}
  twitter={{
    card: "summary_large_image",
    site: "@acme"
  }}
/>
```

### Product/Service Page

```tsx
<SEOMetaTags
  title="Premium Email Plan - $99/month | Acme"
  description="Unlimited emails, advanced automation, priority support. Perfect for growing businesses. 30-day money-back guarantee."
  canonical="https://acme.com/pricing/premium"
  openGraph={{
    type: "product",
    image: "https://acme.com/images/premium-plan.jpg"
  }}
/>
```

### Blog Post

```tsx
<SEOMetaTags
  title="10 Email Marketing Tips for 2024 | Acme Blog"
  description="Boost your email ROI with these proven strategies. Learn from industry experts and real case studies."
  canonical="https://acme.com/blog/email-marketing-tips-2024"
  openGraph={{
    type: "article",
    publishedTime: "2024-01-15T10:00:00Z",
    authors: ["https://acme.com/authors/jane-doe"],
    section: "Email Marketing",
    tags: ["email marketing", "tips", "2024"]
  }}
  twitter={{
    card: "summary_large_image",
    creator: "@janedoe"
  }}
/>
```

### Landing Page

```tsx
<SEOMetaTags
  title="Free Email Marketing Webinar | Acme"
  description="Join our live webinar: How to Triple Your Email ROI. Jan 25, 2024 at 2pm EST. Limited spots available!"
  canonical="https://acme.com/webinar/triple-email-roi"
  openGraph={{
    type: "website",
    image: "https://acme.com/images/webinar-og.jpg"
  }}
  // Consider noIndex for time-sensitive or conversion-focused pages
  noIndex={false}
/>
```

## Integration with I18n

Combine `SEOMetaTags` with `I18nMetaTags` for multi-language sites:

```tsx
import { SEOMetaTags, I18nMetaTags } from 'simple-site-framework/components';

export default function Page({ params }: { params: { locale: string } }) {
  return (
    <>
      {/* Page-specific SEO */}
      <SEOMetaTags
        title="Email Marketing Platform | Acme"
        description="Send beautiful email campaigns that convert."
        canonical="https://acme.com/features"
        openGraph={{
          locale: params.locale === 'fr' ? 'fr_FR' : 'en_US',
          alternateLocales: params.locale === 'fr' ? ['en_US'] : ['fr_FR']
        }}
      />

      {/* Multi-language SEO */}
      <I18nMetaTags
        currentLocale={params.locale}
        pathname="/features"
        baseUrl="https://acme.com"
      />

      <main>...</main>
    </>
  );
}
```

## Testing Your SEO

### Tools

1. **Google Search Console**: Monitor search performance
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
5. **Chrome DevTools**: View generated `<head>` tags

### Checklist

- [ ] Every page has unique `title` and `description`
- [ ] Titles are 50-60 characters
- [ ] Descriptions are 150-160 characters
- [ ] Canonical URLs are absolute
- [ ] Open Graph images are 1200×630+ pixels
- [ ] Twitter card images are appropriate size
- [ ] All image URLs are absolute (https://)
- [ ] Locale tags match your i18n setup
- [ ] No duplicate meta tags
- [ ] robots directives are intentional

## Next Steps

- **Structured Data**: Add JSON-LD for rich snippets → [STRUCTURED-DATA.md](./STRUCTURED-DATA.md)
- **Sitemap**: Generate XML sitemap → [SITEMAP.md](./SITEMAP.md)
- **Performance**: Optimize Core Web Vitals → [PERFORMANCE.md](./PERFORMANCE.md)
- **Accessibility**: Improve WCAG compliance → [ACCESSIBILITY.md](./ACCESSIBILITY.md)

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
