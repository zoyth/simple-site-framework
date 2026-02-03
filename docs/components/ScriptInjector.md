# ScriptInjector

Component for injecting third-party scripts.

## Import

```typescript
import { ScriptInjector } from '@zoyth/simple-site-framework';
```

**Type:** Client Component

## Basic Usage

```typescript
<ScriptInjector
  src="https://example.com/script.js"
  strategy="afterInteractive"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `src` | `string` | Yes | Script URL |
| `strategy` | `'beforeInteractive' \| 'afterInteractive' \| 'lazyOnload'` | No | Load strategy |
| `onLoad` | `function` | No | Load callback |
| `onError` | `function` | No | Error callback |

## Examples

```typescript
// Analytics script
<ScriptInjector
  src="https://analytics.example.com/script.js"
  strategy="afterInteractive"
  onLoad={() => console.log('Analytics loaded')}
/>

// Chat widget
<ScriptInjector
  src="https://chat.example.com/widget.js"
  strategy="lazyOnload"
/>
```

## See Also

- [AnalyticsTracker](./AnalyticsTracker.md)
