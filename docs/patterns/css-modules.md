# CSS Modules for Stateful Transitions

## When to Use

| Concern | Approach |
|---|---|
| Layout, spacing, color, typography | Tailwind utility classes in JSX |
| State-driven CSS transitions | CSS Module `.class { transition: ... }` |
| Keyframe animations | CSS Module `@keyframes` |
| Pseudo-element content | CSS Module `.class::after { content: ''; }` |
| Complex selectors (`.parent .child`, `:not()`) | CSS Module |
| `position: sticky` structural rules | CSS Module (breakpoint-scoped) |
| `overflow: hidden` that blocks sticky | Remove from JSX, handle in module per breakpoint |

## Why Not Inline Styles

Never set `transition` via inline style — it prevents the browser from running the transition when the value changes. A style change on the same property cancels an in-progress transition.

## Why Not global.css

Animation keyframes and transition declarations in `global.css` create naming conflicts at scale, pollute the global scope, and make it impossible to tree-shake unused animations.

## File Naming
```
src/components/ComponentName.module.css
src/components/sections/ComponentName.module.css
```

Import and apply:
```tsx
import { cn } from '@/lib/utils';
import styles from './ComponentName.module.css';

<div className={cn('relative z-10', styles.panels)} />

// Conditional active state
<button className={cn(styles.tabBtn, i === current && styles.tabActive)} />
```

## Implementation Notes

- CSS Modules generate scoped hashed class names — no collision risk with Tailwind utilities
- Use `100dvh` over `100vh` to account for mobile browser chrome
- Module class specificity equals Tailwind utility specificity (`0,1,0`) — module wins when declared later in the CSS bundle, which is the default with Next.js CSS Module injection order
- The `overflow: visible` override for mobile sticky must live in the CSS Module because it needs to override a Tailwind `lg:overflow-hidden` utility at a breakpoint boundary

## Reference Implementations

### Features.module.css — 300vh Sticky Scroll Section
```css
/* Desktop sticky container */
@media (min-width: 1024px) {
  .outer  { height: 300vh; }
  .sticky { position: sticky; top: calc(70px + 2rem); height: calc(100dvh - 70px); }
  .panels { flex: 1; overflow: hidden; }

  .panel { position: absolute; inset: 0; transition: opacity 0.4s ease-out, transform 0.4s ease-out; }
  .panel:not(.panelActive) { opacity: 0; transform: translateX(16px); pointer-events: none; }
  .panel.panelActive       { opacity: 1; transform: translateX(0);     pointer-events: auto; }
}

/* Mobile sticky tabs */
@media (max-width: 1023px) {
  .sticky { overflow: visible; }
  .tabBar { position: sticky; top: 1rem; z-index: 30; }
  .panel + .panel { margin-top: 3rem; padding-top: 3rem; border-top: 1px solid var(--color-border); }
}

/* Per-tab background slide-up */
.bg { transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1); }
.bg::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.55); }

/* Tab button active state */
.tabBtn.tabActive {
  background: var(--color-tab-active-bg);
  color: var(--color-tab-active-text);
  border-color: var(--color-tab-active-bg);
  border-radius: 7px;
}
.tabBtn .tabLabel { transform: translateX(9px); transition: transform 0.3s ease; }
.tabBtn.tabActive .tabLabel { transform: translateX(0); }
.tabBtn .tabArrow { opacity: 0; transition: opacity 0.3s ease; }
.tabBtn.tabActive .tabArrow { opacity: 1; }
```

### Platform.module.css — Image Crossfade Tab Switcher
```css
.tab { cursor: pointer; background: none; border: none; outline: none; }
.tab:focus-visible { outline: 2px solid var(--color-primary); outline-offset: -2px; }
.tabLabel, .tabDesc { transition: color 0.3s, opacity 0.3s; }
```

## When to Use Framer Motion Instead

Use Framer Motion for:
- Entry/exit animations driven by mount/unmount
- Gesture-based interactions (drag, hover with spring physics)
- Orchestrated animation sequences across multiple elements
- Layout animations (`layoutId`)

Use CSS Modules for:
- State-driven transitions on persistent elements
- Keyframe loops
- Pseudo-element animations
- Anything where Tailwind's `transition-*` utilities are insufficient
