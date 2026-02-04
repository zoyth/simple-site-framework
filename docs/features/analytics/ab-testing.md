# A/B Testing

Run experiments to optimize conversions and user engagement.

## Overview

The framework provides a client-side A/B testing system that:

- Assigns users to variants deterministically
- Persists assignments across sessions
- Integrates with analytics tracking
- Supports weighted variant distribution

## Quick Start

```typescript
'use client';
import { getABTestVariant, trackABTestEvent } from '@zoyth/simple-site-framework/client';

const variant = getABTestVariant({
  testId: 'hero-cta',
  variants: { A: { weight: 50 }, B: { weight: 50 } },
});

const ctaText = variant === 'A' ? 'Start Free Trial' : 'Get Started Free';

<button onClick={() => trackABTestEvent('hero-cta', variant, 'click')}>
  {ctaText}
</button>
```

## Setting Up a Test

### 1. Define the Test

```typescript
const test = {
  testId: 'pricing-layout',
  variants: {
    control: { weight: 50 },
    cards: { weight: 50 },
  },
};
```

### 2. Get Variant Assignment

```typescript
const variant = getABTestVariant(test);
// Returns 'control' or 'cards'
```

### 3. Render Based on Variant

```typescript
{variant === 'control' ? (
  <PricingTable layout="table" />
) : (
  <PricingTable layout="cards" />
)}
```

### 4. Track Conversions

```typescript
function handlePurchase() {
  trackABTestEvent('pricing-layout', variant, 'purchase');
}
```

## Variant Assignment

### How It Works

1. User visits page with A/B test
2. Framework generates or retrieves user ID
3. User ID + test ID produces deterministic hash
4. Hash maps to variant based on weights
5. Assignment persists via cookie/localStorage

### Weighted Distribution

```typescript
// Equal split
variants: { A: { weight: 50 }, B: { weight: 50 } }

// 80/20 split
variants: { control: { weight: 80 }, experiment: { weight: 20 } }

// Three-way split
variants: { A: { weight: 33 }, B: { weight: 33 }, C: { weight: 34 } }
```

Weights don't need to sum to 100 - they're relative proportions.

## Tracking Test Events

### trackABTestEvent

```typescript
import { trackABTestEvent } from '@zoyth/simple-site-framework/client';

// Track exposure (user saw the variant)
trackABTestEvent('test-id', variant, 'exposure');

// Track interaction
trackABTestEvent('test-id', variant, 'click');

// Track conversion
trackABTestEvent('test-id', variant, 'conversion');
```

### Custom Event Data

```typescript
trackABTestEvent('test-id', variant, 'purchase', {
  value: 49.99,
  currency: 'USD',
});
```

## Multi-Page Tests

For tests spanning multiple pages, variant persists automatically:

```typescript
// Page 1: Assign variant
const variant = getABTestVariant({
  testId: 'onboarding-flow',
  variants: { A: { weight: 50 }, B: { weight: 50 } },
});

// Page 2: Same variant returned
const variant = getABTestVariant({
  testId: 'onboarding-flow',
  variants: { A: { weight: 50 }, B: { weight: 50 } },
});
// Same user always gets the same variant
```

## Analyzing Results

### In Google Analytics 4

1. Navigate to Explore > Free Form
2. Add dimension: Custom Event Parameter > `ab_test_id`
3. Add dimension: Custom Event Parameter > `ab_variant`
4. Add metric: Event count, Conversions
5. Compare variant performance

### Statistical Significance

- Run tests for at least 2 weeks
- Aim for 1,000+ visitors per variant
- Use a significance calculator before concluding
- Don't stop tests early on promising results

## Best Practices

- Test one variable at a time
- Define success metrics before starting
- Run tests long enough for statistical significance
- Document all active tests
- Clean up completed tests
- Don't nest A/B tests unless variants are independent

## See Also

- [Tracking Events](./tracking-events.md)
- [Conversion Tracking](./conversion-tracking.md)
- [A/B Testing Guide](../../guides/ab-testing.md)
