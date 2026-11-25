---
name: theming-guide
description: CSS variables, OKLCH colors, chart/sidebar tokens, and Tailwind integration
when-to-use: When configuring theme tokens or color system
keywords: theme, oklch, css-variables, dark-mode, tailwind, tokens, colors
priority: high
related: ../SKILL.md
---

# Theming Guide

## Overview

shadcn/ui uses CSS custom properties with OKLCH color space for wide-gamut P3 support and perceptual uniformity. Tokens follow a 3-level hierarchy: primitive -> semantic -> component.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **OKLCH** | `oklch(L% C H)` - perceptually uniform, P3 gamut |
| **Semantic tokens** | `--primary`, `--secondary`, `--accent` |
| **Dark mode** | `.dark` class or `prefers-color-scheme` |
| **@theme** | Tailwind v4 custom property bridge |

## Layout Variables

| Variable | Purpose |
|----------|---------|
| `--background` | Page background |
| `--foreground` | Default text |
| `--card` / `--card-foreground` | Card surfaces |
| `--popover` / `--popover-foreground` | Popover surfaces |

## Interactive Variables

| Variable | Purpose |
|----------|---------|
| `--primary` / `--primary-foreground` | Primary buttons, links |
| `--secondary` | Secondary elements |
| `--accent` | Hover backgrounds |
| `--muted` / `--muted-foreground` | Muted backgrounds |
| `--destructive` | Danger/delete actions |

## Utility Variables

| Variable | Purpose |
|----------|---------|
| `--border` | Default border color |
| `--input` | Input border color |
| `--ring` | Focus ring color |
| `--radius` | Default border radius (0.625rem) |

## OKLCH Color Space

```
oklch(Lightness% Chroma Hue)
  L: 0-100%  (0 = black, 100 = white)
  C: 0-0.4   (0 = gray, 0.4 = vivid)
  H: 0-360   (hue angle)
```

Benefits: perceptual uniformity, P3 gamut, predictable contrast.

## Theme Switching

Use `.dark` class on `<html>` or CSS media query:

```tsx
<html className={theme === "dark" ? "dark" : ""}>
```

For full setup with next-themes, see [theme-setup.md](templates/theme-setup.md).

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Mixing hex and OKLCH | Use OKLCH consistently |
| Forgetting dark overrides | Every :root token needs .dark equivalent |
| Defining colors in Tailwind config | Use CSS variables with @theme bridge |

---

## Related Templates

- [theme-setup.md](templates/theme-setup.md) - Complete theme configuration
