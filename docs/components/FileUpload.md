# FileUpload

File upload component with drag-and-drop.

## Import

```typescript
import { FileUpload } from '@zoyth/simple-site-framework/client';
```

**Type:** Client Component

## Basic Usage

```typescript
<FileUpload
  onUpload={(files) => handleFiles(files)}
  accept="image/*"
  maxSize={5242880} // 5MB
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onUpload` | `function` | Yes | Upload handler |
| `accept` | `string` | No | Accepted file types |
| `maxSize` | `number` | No | Max file size (bytes) |
| `multiple` | `boolean` | No | Allow multiple files |
| `disabled` | `boolean` | No | Disable upload |
| `className` | `string` | No | Custom classes |

## Examples

```typescript
// Image upload
<FileUpload
  onUpload={handleImages}
  accept="image/png,image/jpeg"
  maxSize={10485760} // 10MB
/>

// Multiple files
<FileUpload
  onUpload={handleFiles}
  multiple
  accept=".pdf,.doc,.docx"
/>
```

## See Also

- [FormField](./forms/FormField.md)
