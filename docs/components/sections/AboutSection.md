# AboutSection

Company story, team, and statistics section.

## Import

```typescript
import { AboutSection } from '@zoyth/simple-site-framework';
```

**Type:** Server Component

## Basic Usage

```typescript
<AboutSection
  heading="About Our Company"
  story="Founded in 2010, we've helped over 500 businesses transform their operations..."
  team={[
    {
      name: 'John Doe',
      role: 'CEO',
      bio: 'Former consultant at McKinsey...',
      image: '/team/john.jpg',
    },
  ]}
  stats={[
    { value: '500+', label: 'Clients Served' },
    { value: '15', label: 'Years Experience' },
  ]}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `heading` | `string \| LocalizedString` | Yes | Section heading |
| `story` | `string \| LocalizedString` | No | Company story |
| `team` | `TeamMember[]` | No | Team members |
| `stats` | `Stat[]` | No | Statistics |
| `className` | `string` | No | Custom classes |
| `locale` | `string` | No | Current locale |

## See Also

- [HeroSection](./HeroSection.md)
- [StatsSection](../StatsSection.md)
