# Tabs

Tabbed interface component.

## Import

```typescript
import { Tabs } from '@zoyth/simple-site-framework';
```

**Type:** Client Component

## Basic Usage

```typescript
<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tabs` | `TabItem[]` | Yes | Tab items |
| `defaultTab` | `string` | No | Default active tab ID |
| `className` | `string` | No | Custom classes |

### TabItem

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Tab identifier |
| `label` | `string \| LocalizedString` | Yes | Tab label |
| `content` | `ReactNode` | Yes | Tab content |

## Examples

```typescript
<Tabs
  tabs={[
    {
      id: 'features',
      label: 'Features',
      content: <div>Features content...</div>
    },
    {
      id: 'pricing',
      label: 'Pricing',
      content: <div>Pricing content...</div>
    },
  ]}
  defaultTab="features"
/>
```

## See Also

- [Modal](./Modal.md)
