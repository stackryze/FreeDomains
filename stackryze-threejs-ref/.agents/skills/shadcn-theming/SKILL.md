---
name: shadcn-theming
description: Design tokens and theming for shadcn/ui. Covers CSS variables, OKLCH colors, dark/light mode, and theme configuration for both Radix and Base UI primitives.
versions:
  shadcn-ui: "2.x"
  tailwindcss: "4.1"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep
references: references/theming-guide.md, references/templates/theme-setup.md
related-skills: shadcn-registries, shadcn-components
---

# shadcn Theming

## Agent Workflow (MANDATORY)

Before theming work, use `TeamCreate`:

1. **fuse-ai-pilot:explore-codebase** - Find existing theme tokens
2. **fuse-ai-pilot:research-expert** - Verify OKLCH patterns via Context7

After: Run **fuse-ai-pilot:sniper** for validation.

## Overview

| Feature | Description |
|---------|-------------|
| **CSS Variables** | `--background`, `--foreground`, `--primary` |
| **OKLCH Colors** | Wide-gamut P3 color space |
| **Dark Mode** | `.dark` class or `prefers-color-scheme` |
| **Tailwind v4** | `@theme` directive integration |

## Critical Rules

1. **ALWAYS use OKLCH** color space for all tokens
2. **ALWAYS define dark mode** overrides for every token
3. **NEVER hard-code** hex or rgb in components
4. **USE @theme** directive for Tailwind v4 integration
5. **MAP semantic tokens** to primitive OKLCH values

## Architecture

```
app/
├── globals.css         # :root + .dark token definitions
└── tailwind.config.ts  # Optional (v3) or @theme (v4)
```

-> See [theme-setup.md](references/templates/theme-setup.md) for complete theme

## Token Hierarchy

```
Component: --card, --card-foreground, --button-*
    ↑
Semantic: --primary, --secondary, --accent, --muted
    ↑
Primitive: oklch(55% 0.20 260), oklch(98% 0.01 260)
```

## Validation Checklist

```
[ ] CSS variables defined in :root
[ ] Dark mode overrides in .dark
[ ] OKLCH color space used
[ ] Chart variables (--chart-1 to --chart-5)
[ ] Sidebar variables if applicable
[ ] No hard-coded hex in components
```

## Best Practices

### DO
- Use OKLCH for all colors
- Define semantic tokens mapped to primitives
- Provide dark mode overrides for all tokens
- Use `@theme` for Tailwind v4 integration

### DON'T
- Hard-code hex or rgb values
- Skip dark mode definitions
- Mix color spaces (hex + oklch)
- Define tokens only in Tailwind config

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Theming Guide** | [theming-guide.md](references/theming-guide.md) | CSS variables and OKLCH setup |

### Templates

| Template | When to Use |
|----------|-------------|
| [theme-setup.md](references/templates/theme-setup.md) | Complete theme configuration |
