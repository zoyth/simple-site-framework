# Architectural Decision Records

This document records the key architectural decisions made for the Simple Site Framework.

## Decision Summary

| Decision | Choice | Status | Date |
|----------|--------|--------|------|
| Animation Library | Framer Motion | ✅ Implemented | 2024-01-31 |
| Form Libraries | Peer Dependencies | ✅ Implemented | 2024-01-31 |
| Headless UI | Radix UI | ✅ Implemented | 2024-01-31 |
| Icon Library | Lucide React | ✅ Implemented | 2024-01-31 |
| Bundle Strategy | Hybrid (Lean + Rich) | ✅ Implemented | 2024-01-31 |
| Package Structure | Monolithic | ✅ Implemented | 2024-01-31 |
| Testing Strategy | Selective → Comprehensive | 🚧 In Progress | 2024-01-31 |

---

## ADR-001: Animation Library

**Status**: ✅ Implemented
**Date**: 2024-01-31
**Deciders**: François Lane

### Context

The framework needs animation capabilities for micro-interactions, page transitions, and engagement elements. Two main options were considered: Framer Motion and GSAP.

### Decision

**Chose: Framer Motion**

### Rationale

**Framer Motion Advantages:**
- React-first API with hooks and declarative syntax
- Simpler learning curve for React developers
- ~35kb gzipped (smaller footprint)
- Excellent documentation and community
- Built-in gesture support
- Animation variants pattern matches component pattern
- TypeScript support out of the box

**GSAP Considered:**
- More powerful for complex timeline animations
- Better performance for heavy animations
- Industry standard in animation
- ~50kb gzipped (larger bundle)
- Steeper learning curve
- License considerations for commercial use
- Imperative API less natural for React

### Consequences

**Positive:**
- Faster development with React-first API
- Smaller bundle size
- Better TypeScript integration
- useReducedMotion hook for accessibility

**Negative:**
- Less control for complex timeline animations
- May need GSAP for specific advanced cases

**Mitigations:**
- Keep animation library isolated in hooks
- Can add GSAP as optional peer dependency if needed

---

## ADR-002: Form Libraries Strategy

**Status**: ✅ Implemented
**Date**: 2024-01-31
**Deciders**: François Lane

### Context

Forms are critical for conversion but add significant bundle weight. Need to decide if form libraries should be required dependencies or peer dependencies.

### Decision

**Chose: Peer Dependencies (Optional)**

React Hook Form and Zod are peer dependencies, not required.

### Rationale

**Benefits of Peer Dependency Approach:**
- Smaller base bundle for non-form use cases
- Flexibility for developers who prefer other solutions
- Tree-shaking works better
- No forced dependency upgrades

**Strong Guidance Provided:**
- Documentation strongly recommends React Hook Form + Zod
- Form components designed for RHF integration
- Examples use RHF + Zod throughout
- TypeScript types encourage correct usage

### Consequences

**Positive:**
- Framework stays lean
- Developers can choose alternatives
- Better separation of concerns

**Negative:**
- Extra setup step for forms
- Some developers might skip validation
- More testing combinations

**Mitigations:**
- Clear documentation on setup
- CLI tool can scaffold with RHF + Zod
- FormField component works with or without RHF

---

## ADR-003: Headless UI Library

**Status**: ✅ Implemented
**Date**: 2024-01-31
**Deciders**: François Lane

### Context

Need accessible, unstyled UI primitives for complex components (modals, dropdowns, tabs, etc.). Three options considered:

1. Radix UI (20+ components)
2. Headless UI (8 components)
3. Build from scratch

### Decision

**Chose: Radix UI**

### Rationale

**Radix UI Advantages:**
- Most comprehensive component library (20+ primitives)
- Best-in-class accessibility
- Excellent documentation
- Active development and maintenance
- Unstyled by default (perfect for framework)
- Tree-shakeable architecture
- Strong TypeScript support
- Used by Shadcn/UI and other major projects

**Headless UI Considered:**
- Made by Tailwind Labs
- Good Tailwind integration
- Only 8 components (would need to build more)
- Less comprehensive

**Build from Scratch Considered:**
- Full control over API
- Smallest possible bundle
- Massive time investment
- Accessibility is extremely complex
- Ongoing maintenance burden

### Consequences

**Positive:**
- Production-ready accessible components
- Wide component coverage
- Active community and support
- Proven in production

**Negative:**
- Adds ~100kb total (tree-shakeable)
- External dependency to maintain
- Learning curve for API

**Mitigations:**
- Wrap Radix components in framework API
- Only use components we need (tree-shaking)
- Document component usage clearly

---

## ADR-004: Icon Library Integration

**Status**: ✅ Implemented
**Date**: 2024-01-31
**Deciders**: François Lane

### Context

Icons are essential for UI but can bloat bundle. Options:

1. Bundle icon library (Lucide, Hero Icons)
2. No bundled icons (let developers choose)
3. Custom minimal set

### Decision

**Chose: Lucide React as Peer Dependency**

### Rationale

**Lucide React Advantages:**
- Modern, well-maintained fork of Feather Icons
- 1000+ icons available
- Tree-shakeable (~1kb per icon)
- Consistent design language
- React components, not SVG imports
- TypeScript support
- Active development

**Implementation:**
- Peer dependency (not required)
- Icon component wrapper for type safety
- Common presets exported (Icons.Check, Icons.Menu, etc.)
- Developers can use directly or via wrapper

### Consequences

**Positive:**
- Excellent DX with type-safe icon names
- Small bundle impact (only used icons)
- Comprehensive icon set
- Consistent style across framework

**Negative:**
- Peer dependency to manage
- Developers could use different icon libraries

**Mitigations:**
- Strong documentation recommending Lucide
- Icon wrapper provides consistent API
- Examples use Lucide throughout

---

## ADR-005: Bundle Size Strategy

**Status**: ✅ Implemented
**Date**: 2024-01-31
**Deciders**: François Lane

### Context

Trade-off between developer experience (batteries-included) and bundle size (minimal).

### Decision

**Chose: Hybrid Approach**

- Core framework: Lean (~50kb)
- Components package: Includes UI dependencies (~150kb total)
- Clear separation and tree-shaking

### Rationale

**Hybrid Benefits:**
- Base framework stays small
- Components include what they need
- Tree-shaking removes unused code
- Good balance of DX and performance

**Bundle Breakdown:**
- Core utils: ~10kb
- Components (all): ~150kb
- Peer dependencies: ~150kb (if all used)
- **Typical real app**: ~100-200kb framework code

**Performance Budget:**
- No single component >10kb
- Total framework <300kb uncompressed
- Encourage code-splitting

### Consequences

**Positive:**
- Reasonable bundle size
- Great developer experience
- Tree-shaking works well

**Negative:**
- Not the absolute smallest possible
- Some unused code if not optimized

**Mitigations:**
- Document tree-shaking setup
- Provide bundle size analyzer
- LazySection for code-splitting

---

## ADR-006: Package Structure

**Status**: ✅ Implemented
**Date**: 2024-01-31
**Deciders**: François Lane

### Context

Single monolithic package vs. multiple split packages.

### Decision

**Chose: Monolithic (for v0.x)**

Single `@zoyth/simple-site-framework` package with multiple entry points:
- Main: `@zoyth/simple-site-framework`
- Components: `@zoyth/simple-site-framework/components`
- Config: `@zoyth/simple-site-framework/config`

### Rationale

**Monolithic Benefits:**
- Simpler installation
- Single version to manage
- Easier to maintain
- Better for small-medium scale

**When to Split:**
- If package grows beyond 500kb
- If components become very specialized
- If different update cadences needed
- Likely in v1.0+

### Consequences

**Positive:**
- Simple `npm install`
- Single version number
- Easier dependency management

**Negative:**
- Install components you might not use
- Harder to have different release cycles

**Mitigations:**
- Good tree-shaking
- Clear entry points
- Can split later if needed

---

## ADR-007: Testing Strategy

**Status**: 🚧 In Progress
**Date**: 2024-01-31
**Deciders**: François Lane

### Context

Balance between test coverage and development velocity.

### Decision

**Chose: Selective → Comprehensive**

Start with critical path tests, expand over time.

### Strategy

**Phase 1: Critical Components**
- Form validation logic
- Accessibility features
- Core utilities
- Breaking change prevention

**Phase 2: UI Components**
- Component rendering
- Prop variations
- Keyboard navigation
- Screen reader announcements

**Phase 3: Integration**
- Full page flows
- Form submissions
- Multi-component interactions

**Phase 4: Visual & E2E**
- Visual regression testing
- Cross-browser E2E tests
- Performance benchmarks

### Tools

- **Unit**: Vitest
- **Component**: React Testing Library
- **E2E**: Playwright (future)
- **Visual**: Chromatic (future)

### Consequences

**Positive:**
- Fast initial development
- Tests grow with framework
- Focus on what matters

**Negative:**
- Some bugs may slip through initially
- Need discipline to add tests

**Mitigations:**
- Required tests for critical components
- CI/CD checks
- Manual QA process

---

## Implementation Status

### ✅ Completed Decisions

All major architectural decisions have been implemented:

1. **Framer Motion** - Integrated in all animated components
2. **Radix UI** - Used for Modal, Tabs, Select, Accordion, Dialog, Tooltip
3. **Lucide React** - Icon component wrapper created
4. **React Hook Form + Zod** - Peer dependencies, strong guidance provided
5. **Hybrid Bundle** - Core + components structure working well
6. **Monolithic Package** - Single package with multiple entry points

### 🚧 In Progress

1. **Testing** - Expanding test coverage incrementally

### Future Considerations

1. **Package splitting** - Monitor bundle size, split if needed in v1.0
2. **Additional animation** - May add GSAP for specific use cases
3. **More UI primitives** - As Radix releases new components
4. **Testing infrastructure** - E2E and visual regression when stable

---

## Revision History

| Date | Change | Author |
|------|--------|--------|
| 2024-01-31 | Initial ADR document created | François Lane |
| 2024-01-31 | All major decisions documented | François Lane |

---

## References

- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide React](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
