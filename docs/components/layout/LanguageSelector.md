# LanguageSelector

Adaptive language switcher (toggle or dropdown based on language count).

## Import

```typescript
import { LanguageSelector } from '@zoyth/simple-site-framework';
```

**Type:** Client Component

## Basic Usage

```typescript
<LanguageSelector
  currentLocale={locale}
  variant="auto"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentLocale` | `string` | Yes | Current locale |
| `variant` | `'auto' \| 'text' \| 'dropdown'` | No | Selector variant (default: 'auto') |
| `className` | `string` | No | Custom classes |

## Variants

- `auto` - Automatically chooses: text toggle for 2 languages, dropdown for 3+
- `text` - Simple text toggle (best for 2 languages)
- `dropdown` - Dropdown menu (best for 3+ languages)

## Examples

```typescript
// Auto-detect variant
<LanguageSelector currentLocale="en" />

// Force dropdown
<LanguageSelector currentLocale="en" variant="dropdown" />

// In header
<Header logo={logo} navigation={nav}>
  <LanguageSelector currentLocale={locale} />
</Header>
```

## See Also

- [Header](./Header.md)
- [Internationalization Guide](../../features/internationalization.md)
