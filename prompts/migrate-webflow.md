<!-- ABOUTME: Prompt template for agent-assisted Webflow site migrations -->
<!-- ABOUTME: Guides extraction of content structure and mapping to framework components -->

# Webflow Migration Task

**Source**: [path to exported Webflow files OR URL if no export available]

## Instructions

### Step 1: Extract Content Structure

Read the exported HTML files (or fetch URL if no export) and create a Migration Spec with:

- Each distinct section on the page
- Suggested Simple Site Framework component for each
- All text content (headings, descriptions, CTAs)
- Image descriptions or URLs
- Any special styling notes (dark background, centered, etc.)

Use this format:

```markdown
## Page: [Page Name]

### Section 1: [Section Name]
- **Suggested Component**: [ComponentName]
- **Variant**: [variant if applicable]
- **Content**:
  - Heading: "[Actual heading text]"
  - Description: "[Actual description text]"
  - Primary CTA: "[Button text]" → [href]
  - Secondary CTA: "[Button text]" → [href]
  - Background Image: [describe or note path]

### Section 2: [Section Name]
...

### Assets to Copy
- /images/hero-bg.jpg → public/images/
- /images/logo.svg → public/images/
```

### Step 2: Wait for Approval

Present the Migration Spec and WAIT for confirmation before implementing. The human will review and adjust component choices if needed.

### Step 3: Implement

Once approved, implement using only framework components:

- Import from `@zoyth/simple-site-framework` (or `/client` for client components)
- Use `LocalizedString` for all text (even if single language for now)
- Follow existing patterns in the codebase
- Copy assets to `public/images/`

## Framework Components Available

### Layout
- **Header** - Navigation bar with logo, menu, and CTA
- **Footer** - Site footer with links, social media, legal

### Sections
- **HeroSection** - Above-the-fold hero (variants: centered, split, minimal)
- **AboutSection** - Company story, team, statistics
- **ServicesSection** - Service offerings grid
- **TestimonialSection** - Customer testimonials
- **ContactSection** - Contact form with location info
- **CTASection** - Full-width call-to-action
- **ServicePageLayout** - Individual service page layout
- **StatsSection** - Statistics/metrics display
- **LogosSection** - Client/partner logo grid
- **WhyChooseUsSection** - Value propositions
- **CaseStudySection** - Case study highlight
- **FeatureSection** - Feature highlight with image

### Conversion
- **MobileCTA** - Sticky mobile CTA (scroll-triggered)
- **LiveProof** - Social proof notifications
- **PricingTable** - Pricing comparison table
- **FAQAccordion** - Frequently asked questions
- **TrustBadges** - Trust/security badges
- **CountdownTimer** - Urgency timer
- **StickyBar** - Sticky announcement bar
- **ExitIntentModal** - Exit-intent popup

### UI Building Blocks
- **Button** - Themeable button (variants: filled, outline, ghost, link)
- **Card** - Container with shadow/border (variants: default, bordered, elevated)
- **FeaturesGrid** - Grid of features with icons
- **Timeline** - Chronological timeline
- **ComparisonTable** - Feature comparison
- **TestimonialCarousel** - Rotating testimonials
- **BlogCard** - Blog post preview card
- **AnimatedCounter** - Animated number counter
- **AnimatedSection** - Scroll-triggered animations

### Forms
- **ContactForm** - Complete contact form with validation
- **FormField** - Individual form field
- **MultiStepForm** - Multi-page form wizard
- **FileUpload** - File upload input

## Mapping Hints

Common Webflow patterns → Framework components:

| Webflow Pattern | Framework Component |
|----------------|---------------------|
| Hero with image background | `HeroSection` (centered variant) |
| Hero with side image | `HeroSection` (split variant) |
| 3-4 column feature grid | `FeaturesGrid` |
| Testimonial slider | `TestimonialCarousel` or `TestimonialSection` |
| Client logos row | `LogosSection` |
| Pricing cards | `PricingTable` |
| FAQ accordion | `FAQAccordion` |
| Contact form | `ContactSection` or `ContactForm` |
| Stats/numbers | `StatsSection` or `AnimatedCounter` |
| Timeline | `Timeline` |
| Footer with links | `Footer` |
| Navigation header | `Header` |

## Notes

- If a section doesn't map cleanly to a component, describe what custom implementation would be needed
- Preserve all text content exactly as found
- Note any animations or interactions that should be replicated
- Flag any CMS-driven content that may need dynamic implementation
