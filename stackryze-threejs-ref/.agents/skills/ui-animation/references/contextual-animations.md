# Contextual Animations

Patterns for icon swaps, word-level stagger entrances, and subtle exits.

## Contents
- [Contextual icon swaps](#contextual-icon-swaps)
- [Word-level stagger entrances](#word-level-stagger-entrances)
- [Subtle exit animations](#subtle-exit-animations)

---

## Contextual icon swaps

When icons change state contextually (copy → check, play → pause, send → sent), animate `opacity`, `scale`, and `blur` together. This makes the swap feel responsive rather than instant. Blur hides the crossfade seam between the outgoing and incoming icon.

**Motion (preferred, supports springs):**

```tsx
import { AnimatePresence, motion } from "motion/react"

<button onClick={handleCopy}>
  <AnimatePresence mode="wait" initial={false}>
    {isCopied ? (
      <motion.span
        key="check"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
        transition={{ type: "spring", duration: 0.2, bounce: 0 }}
      >
        <CheckIcon />
      </motion.span>
    ) : (
      <motion.span
        key="copy"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
        transition={{ type: "spring", duration: 0.2, bounce: 0 }}
      >
        <CopyIcon />
      </motion.span>
    )}
  </AnimatePresence>
</button>
```

**CSS only:**

```css
.icon {
  transition:
    opacity 150ms ease,
    scale 150ms ease,
    filter 150ms ease;
}

.icon[data-hidden] {
  opacity: 0;
  scale: 0.8;
  filter: blur(4px);
  pointer-events: none;
}
```

Use `mode="wait"` in AnimatePresence so the exit finishes before the enter starts, preventing both icons from being visible simultaneously.

---

## Word-level stagger entrances

For entrance animations on hero text or page headers, split the content into sections (or individual words) and animate each with a staggered delay. Combining `opacity + translateY + blur` is necessary; each property alone looks flat, mechanical, or cheap.

**Two levels of stagger:**

| Level | Delay | Use for |
|-------|-------|---------|
| Section-level | 100ms per section | Title block, description block, button group |
| Word-level | 80ms per word | Hero headline only |

**CSS pattern:**

```css
@keyframes enter {
  from {
    transform: translateY(8px);
    filter: blur(5px);
    opacity: 0;
  }
}

.animate-enter {
  animation: enter 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: calc(var(--delay, 0ms) * var(--stagger, 0));
}

/* Section level: 100ms gaps */
.animate-enter-section {
  --delay: 100ms;
}

/* Word level: 80ms gaps */
.animate-enter-word {
  --delay: 80ms;
}
```

**Section-level JSX:**

```tsx
<div className="animate-enter animate-enter-section" style={{ "--stagger": 1 }}>
  <Title />
</div>
<div className="animate-enter animate-enter-section" style={{ "--stagger": 2 }}>
  <Description />
</div>
<div className="animate-enter animate-enter-section" style={{ "--stagger": 3 }}>
  <Buttons />
</div>
```

**Word-level JSX:**

```tsx
{"Track expenses, build habits".split(" ").map((word, i) => (
  <span
    key={word}
    className="animate-enter animate-enter-word inline-block"
    style={{ "--stagger": i + 1 }}
  >
    {word}&nbsp;
  </span>
))}
```

These values differ from the general-purpose 30-50ms item stagger in `component-patterns.md`. Use 30-50ms for lists; use 80-100ms for page-level entrances where each chunk carries narrative weight.

---

## Subtle exit animations

Exit animations should be directional (to indicate where content is going) but should not demand the same attention as enter animations. Use a fixed small offset rather than computing the full element height.

**Full exit (too much movement for overlays):**

```tsx
<motion.div
  exit={{
    opacity: 0,
    y: "calc(-100% - 4px)", // the full height, plus gap
    filter: "blur(4px)",
  }}
  transition={{ type: "spring", duration: 0.45, bounce: 0 }}
/>
```

**Subtle exit (recommended):**

```tsx
<motion.div
  initial={{ opacity: 0, y: "calc(-100% - 4px)", filter: "blur(4px)" }}
  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  exit={{
    opacity: 0,
    y: "-12px", // fixed value, regardless of element height
    filter: "blur(4px)",
  }}
  transition={{ type: "spring", duration: 0.45, bounce: 0 }}
/>
```

The `-12px` value is intentionally fixed; do not calculate it from element dimensions. The goal is to convey direction, not to trace the full exit path. The enter animation uses the full distance to build presence; the exit uses a short fixed distance to release attention quietly.

Spring config: `{ type: "spring", duration: 0.45, bounce: 0 }`, zero bounce for a clean, controlled exit.
