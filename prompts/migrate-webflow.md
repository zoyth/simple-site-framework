<!-- ABOUTME: Prompt template for agent-assisted Webflow site migrations -->
<!-- ABOUTME: Guides pixel-perfect extraction of content, structure, and styling from Webflow exports -->

# Webflow Migration Task

**Source**: [path to exported Webflow files OR URL if no export available]

## Goal

Produce a **pixel-perfect** reproduction of the Webflow site using `@zoyth/simple-site-framework` and Tailwind CSS. "Pixel-perfect" means: at any viewport width, a screenshot of the original and the migration should be visually indistinguishable.

This requires systematic extraction of exact values from the Webflow export — not approximation, not "close enough," not eyeballing.

---

## Phase 1: CSS Audit

Before writing any component code, extract **every exact CSS value** from the Webflow export. This is the foundation — skip this and you'll spend 10x longer fixing visual mismatches later.

### 1.1 Read the Webflow Stylesheet

Read the full CSS file(s) in the export and extract:

**Typography**
- Font families, weights, sizes, line-heights for every heading level (h1-h6) and body text
- Any custom typography classes (`.h1`, `.h2`, `.lead`, `.p`, etc.)
- Letter-spacing, text-transform values
- Responsive font size changes at each breakpoint

**Colors**
- Every CSS custom property / color value
- Full shade/gray scale (Webflow often has 10-20+ steps)
- Brand colors, accent colors, tint colors
- Semantic aliases (text color, heading color, muted, etc.)

**Spacing**
- Section padding patterns (horizontal and vertical, often in `vw` units)
- Grid gaps (often multiple patterns: tight, standard, large)
- Container max-widths
- Named spacing variables

**Components**
- Button styles: font, padding, border-radius, colors, hover states, variants
- Card styles: border, shadow, padding, border-radius, background
- All box-shadow values used
- All border-radius values used
- Transition/animation durations and easings

**Layout**
- Responsive breakpoints (Webflow typically uses 991/767/479, NOT Tailwind defaults)
- Grid column patterns at each breakpoint
- Container behavior at each breakpoint

### 1.2 Create Tailwind Config

Extend `tailwind.config.ts` with exact Webflow values:

```ts
// Example — use the ACTUAL values extracted from the Webflow CSS
export default {
  theme: {
    // Override default breakpoints to match Webflow
    screens: {
      'sm': '480px',   // Webflow small mobile breakpoint + 1
      'md': '768px',   // Webflow tablet breakpoint + 1
      'lg': '992px',   // Webflow desktop breakpoint + 1
      'xl': '1920px',  // Webflow large desktop if used
    },
    extend: {
      colors: {
        // Exact hex values from Webflow CSS variables
        shade: {
          50: '#ffffff',
          100: '#f3f2f2',
          // ... every step in the scale
        },
      },
      fontFamily: {
        // Exact font stacks from Webflow
        display: ['Aller', 'sans-serif'],
        body: ['Proxima Nova', 'sans-serif'],
      },
      maxWidth: {
        container: '1800px', // or whatever the Webflow container is
      },
      borderRadius: {
        // Named radius values from Webflow
        card: '24px',
        button: '8px',
      },
      boxShadow: {
        // Exact shadow values from Webflow
        subtle: '1px 1px 9px #00000012',
        medium: '0 0 15px #00000026',
      },
    },
  },
}
```

For values that don't fit cleanly in the config, use Tailwind arbitrary values: `text-[64px]`, `leading-[108%]`, `gap-[4.2vw]`, `p-[3vw]`.

---

## Phase 2: HTML Structure Audit

For each section of each page, document the **exact** HTML structure from the Webflow export:

1. Wrapper/container nesting (how many layers, what each does)
2. Grid/flex structure (columns, alignment, gaps)
3. Content element order and nesting
4. Desktop vs mobile differences (hidden elements, reordered content)
5. Any embedded JavaScript (animations, carousels, parallax)

**Critical**: The HTML structure determines the layout. If you nest elements differently or use a different grid structure than Webflow, it won't look the same regardless of CSS values.

---

## Phase 3: Migration Spec

Create a Migration Spec that maps each Webflow section to either:

**A) A framework component** — when the framework has an exact match. Use framework components for:
- Header / Footer (navigation is configuration-driven)
- CTASection (simple centered CTA blocks)
- Any section where the framework component's HTML output matches the Webflow structure

**B) A custom component** — when the framework has no match or the match is approximate. For custom components, the spec must include:
- Exact HTML structure from the Webflow export
- All CSS classes/values needed
- Any JavaScript behavior to port to React
- Responsive behavior at each breakpoint

Use this format:

```markdown
## Page: [Page Name]

### Section 1: [Section Name]
- **Implementation**: Framework `ComponentName` / Custom component
- **Content**:
  - Eyebrow: "[text]"
  - Heading: "[text]" — [font], [size], [weight], [line-height], [color]
  - Description: "[text]" — [font], [size], [weight], [line-height], [color]
  - CTA: "[text]" → [href] — [button variant]
- **Layout**: [grid structure, e.g. "5-column grid, gap 1em, cards stretch to fill"]
- **Webflow classes**: [list key classes for reference]
- **Responsive**: [how it changes at 991/767/479]
- **JavaScript**: [any animations or interactions]

### Assets to Copy
- /images/hero-bg.jpg → public/images/
```

### Wait for Approval

Present the Migration Spec and **WAIT** for confirmation before implementing. The human will review component choices and priorities.

---

## Phase 4: Implement Section by Section

Work through one section at a time. For each section:

### 4.1 Build the Component

- Match the exact Webflow HTML nesting structure
- Apply exact CSS values using Tailwind utilities + arbitrary values
- Use `className` props for variant styling (e.g., alternate background colors)
- Port any embedded JavaScript to React hooks (useEffect, useRef, event listeners)

### 4.2 Verify Side-by-Side

After building each section, verify against the Webflow original at **every breakpoint**:
- Large desktop (1920px+)
- Desktop (992-1919px)
- Tablet (768-991px)
- Mobile (480-767px)
- Small mobile (<480px)

Check: typography, spacing, colors, alignment, grid structure, hover states, animations.

### 4.3 Commit

Commit after each verified section. Don't batch — if something breaks, you need to know which section caused it.

---

## Common Pitfalls

### Don't approximate — extract
The #1 mistake is eyeballing CSS values instead of reading them from the Webflow stylesheet. `text-4xl` is not the same as `text-[64px]`. `gap-8` is not the same as `gap-[4.2vw]`. Read the source, use the exact values.

### Don't use Tailwind defaults for breakpoints
Webflow uses 991/767/479. Tailwind uses 640/768/1024/1280. If you use Tailwind's default breakpoints, every responsive layout will be wrong. Override `screens` in the Tailwind config.

### Don't guess grid structures
If Webflow uses a 5-column grid, build a 5-column grid. Don't decide 3 columns "looks better." The goal is reproduction, not redesign.

### Don't skip the HTML structure
Webflow's visual output depends on specific nesting patterns. A `<div>` wrapping a `<div>` wrapping content is not the same as flat content — the wrappers often carry padding, flex alignment, or max-width constraints that affect layout.

### Don't use framework components as approximations
If a framework component produces HTML that's structurally different from Webflow's output, don't use it. Build a custom component instead. A pixel-perfect copy from a custom component beats a "close enough" from a framework component.

### Port JavaScript animations properly
Webflow embeds JavaScript for parallax, carousels, scroll effects, etc. Read the embedded scripts, understand the math, and port to React (usually `useEffect` + `useRef` + event listeners or `framer-motion`). Don't substitute a different animation library's defaults.

---

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

**Important**: Only use a framework component if its rendered HTML structure matches the Webflow structure. If it doesn't match, build a custom component — a faithful custom component beats an approximate framework component every time.

## SSR Compatibility Notes

The framework's components barrel (`@zoyth/simple-site-framework/components`) is a monolithic CJS bundle that:
1. Lacks `'use client'` directives
2. Uses framer-motion hooks that fail during SSR (`useReducedMotion`, etc.)
3. Requires `next-mdx-remote/rsc` (ESM-only package)

**Required setup for Next.js:**
- Add both `@zoyth/simple-site-framework` and `next-mdx-remote` to `transpilePackages` in `next.config.ts`
- Create a `client-wrappers.tsx` file that re-exports framework components via `dynamic()` with `ssr: false`
- Split pages into server components (data fetching) and client components (rendering)
- Use a local `cn()` utility (clsx + tailwind-merge) instead of the framework's `cn()` which imports `fs`
- Don't use `HeadScripts` component inside `<head>` — it renders a `<div>` wrapper. Use plain JSX instead.
