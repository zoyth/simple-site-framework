# Color Contrast

Ensure text and interactive elements meet contrast requirements.

## WCAG Contrast Requirements

### AA (Minimum)

| Element | Ratio Required |
|---------|---------------|
| Normal text (< 18px) | 4.5:1 |
| Large text (>= 18px bold, >= 24px) | 3:1 |
| UI components and graphical objects | 3:1 |

### AAA (Enhanced)

| Element | Ratio Required |
|---------|---------------|
| Normal text | 7:1 |
| Large text | 4.5:1 |

## Framework Theme Defaults

The default theme colors are designed to meet WCAG AA:

```typescript
theme: {
  primary: '#0066CC',    // Tested against white background
  secondary: '#FF6600',  // Tested against white background
  text: '#1a1a1a',       // High contrast on white
  background: '#ffffff',
}
```

## Checking Contrast

### Browser DevTools

1. Open DevTools > Elements
2. Select a text element
3. Click the color swatch in Styles
4. DevTools shows contrast ratio and pass/fail

### Online Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

### Programmatic Checks

```typescript
// Calculate contrast ratio
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
}
```

## Common Contrast Issues

### Light Gray Text

```css
/* ❌ Fails - 2.4:1 ratio */
color: #999999;
background: #ffffff;

/* ✅ Passes - 4.6:1 ratio */
color: #767676;
background: #ffffff;
```

### Colored Backgrounds

```css
/* ❌ May fail - check contrast */
color: #ffffff;
background: #66ccff;

/* ✅ Better - darker background */
color: #ffffff;
background: #0066cc;
```

### Placeholder Text

```css
/* Input placeholders need 4.5:1 too */
/* ❌ Too light */
::placeholder { color: #cccccc; }

/* ✅ Sufficient contrast */
::placeholder { color: #767676; }
```

## Focus Indicators

Focus indicators must be visible against all backgrounds:

```css
/* Framework default focus styles */
:focus-visible {
  outline: 2px solid #0066CC;
  outline-offset: 2px;
}
```

Ensure the focus indicator has at least 3:1 contrast against adjacent colors.

## Theme Customization

When customizing theme colors, verify contrast:

```typescript
// ✅ Good - verify before setting
const theme = {
  primary: '#0055AA',      // 7.1:1 on white ✅
  primaryText: '#ffffff',   // Check against primary bg
  text: '#333333',          // 12.6:1 on white ✅
  mutedText: '#666666',     // 5.7:1 on white ✅
};

// ❌ Bad - insufficient contrast
const theme = {
  primary: '#99ccff',      // 1.8:1 on white ❌
  text: '#aaaaaa',          // 2.3:1 on white ❌
};
```

## Dark Mode Considerations

If implementing dark mode:

- Light text on dark backgrounds still needs 4.5:1
- Test both themes for contrast compliance
- Shadows and borders may need adjustment
- Images with text overlays need extra care

## Best Practices

- Test all color combinations in your design
- Don't rely on color alone to convey information (use icons, patterns, or text)
- Test with color blindness simulators
- Provide sufficient contrast for all text sizes
- Check contrast of error states, hover states, and disabled states
- Verify contrast on actual devices (screens vary)

## See Also

- [WCAG Compliance](../../accessibility/wcag-compliance.md)
- [Focus Management](./focus-management.md)
- [Testing](./testing.md)
