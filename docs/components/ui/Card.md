# Card

Container component with shadow, border, and padding. The fundamental building block for content organization and layout.

## Import

```typescript
import { Card } from '@zoyth/simple-site-framework';
```

**Type:** Server Component (default export)

## Basic Usage

```typescript
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</Card>
```

## Props

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'bordered' \| 'elevated'` | `'default'` | Card style variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `hoverable` | `boolean` | `false` | Add hover effect |
| `clickable` | `boolean` | `false` | Make card clickable |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Custom CSS classes |
| `children` | `ReactNode` | - | Card content |

## Variants

### Default

Subtle shadow, no border:

```typescript
<Card variant="default">
  <h3>Default Card</h3>
  <p>Clean and minimal appearance.</p>
</Card>
```

### Bordered

Border with light shadow:

```typescript
<Card variant="bordered">
  <h3>Bordered Card</h3>
  <p>Clear visual separation.</p>
</Card>
```

### Elevated

Pronounced shadow for depth:

```typescript
<Card variant="elevated">
  <h3>Elevated Card</h3>
  <p>Prominent visual hierarchy.</p>
</Card>
```

## Padding

### None

No internal padding:

```typescript
<Card padding="none">
  <img src="/image.jpg" alt="Full bleed image" />
  <div className="p-6">
    <h3>Image Card</h3>
  </div>
</Card>
```

### Small

Compact padding:

```typescript
<Card padding="sm">
  <h3>Compact Card</h3>
</Card>
```

### Medium (Default)

Standard padding:

```typescript
<Card padding="md">
  <h3>Standard Card</h3>
</Card>
```

### Large

Spacious padding:

```typescript
<Card padding="lg">
  <h3>Spacious Card</h3>
</Card>
```

## Examples

### Content Card

```typescript
<Card>
  <h3 className="text-xl font-bold mb-2">
    Feature Title
  </h3>
  <p className="text-gray-600">
    Description of the feature and its benefits.
  </p>
</Card>
```

### Clickable Card

```typescript
<Card
  clickable
  hoverable
  onClick={() => router.push('/details')}
>
  <h3>Click Me</h3>
  <p>This entire card is clickable.</p>
</Card>
```

### Image Card

```typescript
<Card padding="none">
  <img
    src="/product.jpg"
    alt="Product"
    className="w-full h-48 object-cover rounded-t-lg"
  />
  <div className="p-6">
    <h3 className="text-xl font-bold">Product Name</h3>
    <p className="text-gray-600 mt-2">$99.99</p>
  </div>
</Card>
```

### Stat Card

```typescript
<Card variant="bordered" className="text-center">
  <p className="text-4xl font-bold text-primary">10K+</p>
  <p className="text-gray-600 mt-2">Happy Customers</p>
</Card>
```

### Card Grid

```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card>
    <h3>Feature 1</h3>
    <p>Description...</p>
  </Card>
  <Card>
    <h3>Feature 2</h3>
    <p>Description...</p>
  </Card>
  <Card>
    <h3>Feature 3</h3>
    <p>Description...</p>
  </Card>
</div>
```

### Pricing Card

```typescript
<Card variant="elevated" className="text-center">
  <h3 className="text-2xl font-bold">Pro Plan</h3>
  <p className="text-4xl font-bold text-primary my-4">
    $99<span className="text-base text-gray-600">/month</span>
  </p>
  <ul className="text-left space-y-2 mb-6">
    <li>✓ Unlimited projects</li>
    <li>✓ Priority support</li>
    <li>✓ Advanced analytics</li>
  </ul>
  <Button variant="filled" className="w-full">
    Get Started
  </Button>
</Card>
```

### Testimonial Card

```typescript
<Card variant="bordered">
  <p className="text-gray-700 italic mb-4">
    "This product transformed our workflow. Highly recommended!"
  </p>
  <div className="flex items-center gap-4">
    <img
      src="/avatar.jpg"
      alt="Jane Doe"
      className="w-12 h-12 rounded-full"
    />
    <div>
      <p className="font-bold">Jane Doe</p>
      <p className="text-sm text-gray-600">CEO, Company Inc</p>
    </div>
  </div>
</Card>
```

### Link Card

```typescript
<Link href="/article/1">
  <Card hoverable className="cursor-pointer">
    <h3 className="text-xl font-bold">Article Title</h3>
    <p className="text-gray-600 mt-2">Article excerpt...</p>
    <p className="text-primary mt-4">Read more →</p>
  </Card>
</Link>
```

## Styling

### Custom Background

```typescript
<Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
  <h3>Gradient Background</h3>
</Card>
```

### Custom Shadow

```typescript
<Card className="shadow-2xl">
  <h3>Extra Shadow</h3>
</Card>
```

### Custom Rounded Corners

```typescript
<Card className="rounded-2xl">
  <h3>More Rounded</h3>
</Card>
```

### Dark Mode

```typescript
<Card className="dark:bg-gray-800 dark:text-white">
  <h3>Dark Mode Card</h3>
</Card>
```

## Accessibility

Card includes:

- ✅ Semantic HTML (uses `<div>` but accepts semantic tags via `as` prop)
- ✅ Keyboard accessible when clickable
- ✅ Focus visible states for interactive cards
- ✅ Proper contrast ratios
- ✅ Screen reader friendly

### Clickable Card Accessibility

```typescript
<Card
  clickable
  onClick={handleClick}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  <h3>Accessible Clickable Card</h3>
</Card>
```

### Semantic Card

```typescript
<Card as="article">
  <h2>Article Title</h2>
  <p>Article content...</p>
</Card>
```

## Common Patterns

### Feature Grid

```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {features.map(feature => (
    <Card key={feature.id} variant="bordered">
      <div className="text-primary text-4xl mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold mb-2">
        {feature.title}
      </h3>
      <p className="text-gray-600">
        {feature.description}
      </p>
    </Card>
  ))}
</div>
```

### Blog Post Preview

```typescript
<Card hoverable padding="none">
  <img
    src={post.image}
    alt={post.title}
    className="w-full h-48 object-cover"
  />
  <div className="p-6">
    <div className="flex gap-2 mb-2">
      {post.tags.map(tag => (
        <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
          {tag}
        </span>
      ))}
    </div>
    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
    <p className="text-gray-600 mb-4">{post.excerpt}</p>
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{post.date}</span>
      <Link href={`/blog/${post.slug}`} className="text-primary">
        Read more →
      </Link>
    </div>
  </div>
</Card>
```

### Dashboard Widget

```typescript
<Card variant="elevated">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold">Revenue</h3>
    <span className="text-green-600 text-sm">↑ 12%</span>
  </div>
  <p className="text-3xl font-bold">$45,231</p>
  <p className="text-sm text-gray-600 mt-2">This month</p>
</Card>
```

### Team Member Card

```typescript
<Card variant="bordered" className="text-center">
  <img
    src={member.avatar}
    alt={member.name}
    className="w-24 h-24 rounded-full mx-auto mb-4"
  />
  <h3 className="text-xl font-bold">{member.name}</h3>
  <p className="text-gray-600">{member.role}</p>
  <div className="flex gap-4 justify-center mt-4">
    <a href={member.linkedin} className="text-primary">
      LinkedIn
    </a>
    <a href={member.twitter} className="text-primary">
      Twitter
    </a>
  </div>
</Card>
```

## Layout Patterns

### Responsive Grid

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => (
    <Card key={item.id}>
      {/* card content */}
    </Card>
  ))}
</div>
```

### Masonry Layout

```typescript
<div className="columns-1 md:columns-2 lg:columns-3 gap-6">
  {items.map(item => (
    <Card key={item.id} className="mb-6 break-inside-avoid">
      {/* card content */}
    </Card>
  ))}
</div>
```

### Horizontal Scroll

```typescript
<div className="flex gap-6 overflow-x-auto pb-4">
  {items.map(item => (
    <Card key={item.id} className="flex-shrink-0 w-80">
      {/* card content */}
    </Card>
  ))}
</div>
```

## Best Practices

### ✅ Do

- Use consistent variants across similar content types
- Provide sufficient padding for readability
- Use hoverable for interactive cards
- Keep card content focused and scannable
- Use appropriate spacing between cards
- Consider mobile layout when designing grids

### ❌ Don't

- Nest cards too deeply
- Mix too many variants on the same page
- Make cards too small (hard to read/click)
- Use overly complex layouts inside cards
- Forget to handle empty states
- Make entire large sections clickable (accessibility issue)

## Performance

- Cards are server components by default
- No JavaScript unless using clickable/hoverable features
- Efficient rendering for large grids
- No layout shift with proper dimensions

## Troubleshooting

### Cards not displaying shadow

**Check:**
1. Variant is set (default has subtle shadow)
2. Background is not the same color as shadow
3. No CSS overriding shadow styles

### Hover effect not working

**Check:**
1. `hoverable` prop is set to `true`
2. Browser supports CSS transitions
3. No conflicting CSS

### Click handler not firing

**Check:**
1. `clickable` prop is set to `true`
2. `onClick` function is provided
3. No overlay blocking clicks
4. Card is not disabled

### Grid layout breaking on mobile

**Check:**
1. Using responsive grid classes (`grid-cols-1 md:grid-cols-2`)
2. Card min-width not too large
3. Gap is appropriate for mobile

## Related Components

- **[Button](./Button.md)** - Often used inside cards
- **[FeaturesGrid](../utilities/FeaturesGrid.md)** - Grid of feature cards
- **[Modal](./Modal.md)** - Card-like dialog component

## API Reference

Full TypeScript definitions: **[API Reference](../../api/components.md#card)**
