<!-- ABOUTME: Step-by-step guide for migrating Webflow sites to Simple Site Framework -->
<!-- ABOUTME: Documents the export → extract → review → implement workflow -->

# Webflow Migration Guide

Step-by-step guide for migrating Webflow sites to Simple Site Framework.

## Overview

This guide describes a three-phase workflow that produces consistent, high-quality migrations:

1. **Export** (Human) - Get the source files from Webflow
2. **Extract** (Agent) - Generate a structured Migration Spec
3. **Implement** (Agent, after approval) - Build the site using framework components

## Why This Workflow?

When asking an agent to "replicate this Webflow site", results are often inconsistent because:

- The agent sees raw HTML/CSS, not semantic structure
- No clear mapping to framework components exists
- Visual nuances get lost in translation
- The definition of "same" is ambiguous

This workflow solves these problems by creating an intermediate **Migration Spec** that humans can review and approve before implementation begins.

## Phase 1: Export from Webflow

### Option A: Code Export (Recommended)

If you have dashboard access to the Webflow project:

1. Open the Webflow Designer
2. Click the hamburger menu (☰) in the top-left
3. Select **Export Code**
4. Download and unzip the export

You'll get:
```
webflow-export/
├── index.html
├── about.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── webflow.js
└── images/
    ├── hero-bg.jpg
    ├── logo.svg
    └── ...
```

**Advantages:**
- Clean HTML with meaningful class names
- All assets included and organized
- No need to scrape the live site

### Option B: CMS Export (If Using Collections)

For sites with CMS collections (blog posts, team members, etc.):

1. Go to the Webflow CMS panel
2. Click the collection (e.g., "Blog Posts")
3. Click the ⚙️ settings icon
4. Select **Export as CSV**

Keep these CSV files alongside the code export for reference.

### Option C: Live Site Only

If you don't have dashboard access:

- The agent can fetch and analyze the published site
- Less ideal because HTML may be minified and harder to parse
- Assets must be individually identified and downloaded

## Phase 2: Generate Migration Spec

Have an agent analyze the Webflow export to extract the structure.

The agent should produce a Migration Spec like this:

```markdown
## Page: Homepage

### Section 1: Hero
- **Suggested Component**: HeroSection
- **Variant**: centered, with background image
- **Content**:
  - Heading: "Transform Your Business"
  - Description: "We help companies achieve their goals through innovative solutions."
  - Primary CTA: "Get Started" → /contact
  - Secondary CTA: "Learn More" → #features
  - Background Image: images/hero-bg.jpg

### Section 2: Features
- **Suggested Component**: FeaturesGrid
- **Layout**: 3 columns
- **Items**:
  1. Icon: Shield | Title: "Secure" | Description: "Enterprise-grade security"
  2. Icon: Clock | Title: "Fast" | Description: "Lightning-fast performance"
  3. Icon: Users | Title: "Team" | Description: "Built for collaboration"

### Section 3: Testimonials
- **Suggested Component**: TestimonialSection
- **Items**:
  1. Quote: "Amazing product..." | Author: "Jane Doe" | Role: "CEO, Acme Inc"
  2. Quote: "Changed everything..." | Author: "John Smith" | Role: "CTO, Tech Co"

### Section 4: CTA
- **Suggested Component**: CTASection
- **Content**:
  - Heading: "Ready to Get Started?"
  - Primary CTA: "Contact Us" → /contact

### Assets to Copy
- images/hero-bg.jpg → public/images/hero-bg.jpg
- images/logo.svg → public/images/logo.svg
- images/testimonial-1.jpg → public/images/testimonial-1.jpg
- images/testimonial-2.jpg → public/images/testimonial-2.jpg
```

## Phase 3: Review and Approve

Before implementation, review the Migration Spec:

### Check Component Choices

Does the suggested component match the intent?

- A "feature grid" might be better as `ServicesSection` if they're clickable services
- A "testimonial slider" might need `TestimonialCarousel` instead of `TestimonialSection`
- Custom sections might need to be flagged for manual implementation

### Verify Content Accuracy

- All headings captured correctly?
- Descriptions complete (not truncated)?
- CTAs have correct text and destinations?
- All images identified?

### Note Any Gaps

Flag anything that:
- Doesn't map to an existing component
- Requires custom styling beyond component variants
- Needs dynamic/CMS data

### Approve

Once satisfied, tell the agent to proceed with implementation.

## Phase 4: Implementation

The agent will:

1. Create page files in `src/app/`
2. Import and configure components
3. Copy assets to `public/images/`
4. Wire up navigation and links

### Example Output

```typescript
// src/app/page.tsx
import {
  HeroSection,
  FeaturesGrid,
  TestimonialSection,
  CTASection,
} from '@zoyth/simple-site-framework';

export default function HomePage() {
  return (
    <main>
      <HeroSection
        heading="Transform Your Business"
        description="We help companies achieve their goals through innovative solutions."
        primaryCTA={{ text: 'Get Started', href: '/contact' }}
        secondaryCTA={{ text: 'Learn More', href: '#features' }}
        backgroundImage="/images/hero-bg.jpg"
        variant="centered"
      />

      <FeaturesGrid
        id="features"
        features={[
          { icon: 'Shield', title: 'Secure', description: 'Enterprise-grade security' },
          { icon: 'Clock', title: 'Fast', description: 'Lightning-fast performance' },
          { icon: 'Users', title: 'Team', description: 'Built for collaboration' },
        ]}
        columns={3}
      />

      <TestimonialSection
        testimonials={[
          { quote: 'Amazing product...', author: 'Jane Doe', role: 'CEO, Acme Inc' },
          { quote: 'Changed everything...', author: 'John Smith', role: 'CTO, Tech Co' },
        ]}
      />

      <CTASection
        heading="Ready to Get Started?"
        primaryCTA={{ text: 'Contact Us', href: '/contact' }}
      />
    </main>
  );
}
```

## Handling Special Cases

### CMS-Driven Content

If the Webflow site uses CMS collections:

1. Export collection data as CSV
2. Note in the Migration Spec which sections are dynamic
3. Implementation options:
   - Convert to static content if collection is small
   - Create corresponding data files (JSON/MDX)
   - Integrate with a headless CMS

### Custom Animations

Webflow's interactions don't translate directly. Note them in the spec:

```markdown
### Section 2: Features
- **Suggested Component**: FeaturesGrid
- **Animation Note**: Cards fade in on scroll, staggered 100ms
```

The agent can use `AnimatedSection` for scroll-triggered animations.

### Complex Custom Sections

Some Webflow sections may not map to existing components:

```markdown
### Section 5: Interactive Map
- **Suggested Component**: CUSTOM NEEDED
- **Description**: Full-width map with location markers and popup info
- **Implementation Notes**: Need to integrate a mapping library (Mapbox/Google Maps)
```

Flag these for manual implementation or component creation.

## Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│ 1. EXPORT (Human)                                           │
│    - Export code from Webflow dashboard                     │
│    - Export CMS collections as CSV (if applicable)          │
│    - Unzip into working directory                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. EXTRACT (Agent)                                          │
│    - Read exported HTML files                               │
│    - Generate Migration Spec (sections → components)        │
│    - List assets to copy                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. REVIEW (Human)                                           │
│    - Review Migration Spec                                  │
│    - Adjust component choices if needed                     │
│    - Approve                                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. IMPLEMENT (Agent)                                        │
│    - Create pages using framework components                │
│    - Copy and organize assets                               │
│    - Wire up navigation and links                           │
└─────────────────────────────────────────────────────────────┘
```

## Tips for Success

1. **Start with code export** - It's cleaner than scraping the live site
2. **Review the spec carefully** - This is your chance to catch issues before implementation
3. **Keep the original** - Don't delete the Webflow export until migration is verified
4. **Test thoroughly** - Compare the implemented site to the original visually
5. **Iterate** - The first pass rarely gets everything; refine as needed

## Related Documentation

- [Components Overview](../components/overview.md) - Full component reference
- [Internationalization](../features/internationalization.md) - Adding multi-language support
- [Analytics Setup](./analytics-setup.md) - Tracking for the new site
