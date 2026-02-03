# Modal

Accessible dialog/modal component.

## Import

```typescript
import { Modal } from '@zoyth/simple-site-framework';
```

**Type:** Client Component (`/client` export)

## Basic Usage

```typescript
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  <p>Modal content goes here.</p>
</Modal>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Modal open state |
| `onClose` | `function` | Yes | Close handler |
| `title` | `string \| LocalizedString` | No | Modal title |
| `children` | `ReactNode` | Yes | Modal content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No | Modal size |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Basic modal
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
  <div className="flex gap-4 mt-4">
    <Button onClick={handleConfirm}>Confirm</Button>
    <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
  </div>
</Modal>

// Large modal
<Modal isOpen={isOpen} onClose={onClose} size="lg" title="Details">
  {/* content */}
</Modal>
```

## See Also

- [Button](./Button.md)
