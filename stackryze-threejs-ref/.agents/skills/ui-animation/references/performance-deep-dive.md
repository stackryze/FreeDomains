# Performance Deep Dive

Advanced performance guidance beyond the quick rules in SKILL.md.

## Contents
- [CSS vs JS animations](#css-vs-js-animations)
- [Web Animations API (WAAPI)](#web-animations-api-waapi)
- [CSS variables inheritance trap](#css-variables-inheritance-trap)
- [Motion transform ownership](#motion-transform-ownership)
- [Pause looping animations off-screen](#pause-looping-animations-off-screen)
- [Compositing layers and will-change](#compositing-layers-and-will-change)
- [Fix shaky 1px shifts](#fix-shaky-1px-shifts)

## CSS vs JS animations

| Approach | Driver | Interruptible | Best for |
|---|---|---|---|
| CSS transitions | Browser/compositor for transform/opacity | Yes (retargets) | Predetermined state changes |
| CSS keyframes | Browser/compositor when properties allow it | No (restarts from zero) | Looping, predetermined sequences |
| WAAPI (`el.animate()`) | Browser animation engine | Yes (cancel/reverse) | Dynamic values with imperative control |
| Motion values (`x`, `y`, `style`) | Motion DOM renderer, no React re-renders | Yes | React gestures, drag, coordinated UI |
| JS (`requestAnimationFrame`) | Main thread | Yes (manual) | Complex choreography, physics |

**Rule: CSS transitions > WAAPI > CSS keyframes > JS.** Under load (page navigation, heavy rendering), CSS animations stay smooth while JS animations drop frames.

## Web Animations API (WAAPI)

JavaScript control with CSS performance. Hardware-accelerated, interruptible, promise-based.

```ts
const animation = element.animate(
  [
    { transform: "translateY(100%)", opacity: 0 },
    { transform: "translateY(0)", opacity: 1 },
  ],
  {
    duration: 300,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "forwards",
  }
);

// Cancel or reverse at any time
animation.reverse();
await animation.finished;
```

## CSS variables inheritance trap

Changing a CSS variable on a parent recalculates styles for **all children**. In a drawer with many items, updating `--swipe-amount` on the container causes expensive style recalculation.

```ts
// Bad: triggers recalc on all children
element.style.setProperty("--swipe-amount", `${distance}px`);

// Good: only affects this element
element.style.transform = `translateY(${distance}px)`;
```

Exception: `@property` with `inherits: false` avoids the cascade, but browser support is limited.

## Motion transform ownership

Motion's `x`/`y` values are first-class APIs for single-axis movement and drag. They update without React re-renders and are the default choice for gesture-heavy components.

```tsx
const x = useMotionValue(0);

// Idiomatic Motion API for drag and axis movement
<motion.div drag="x" style={{ x }} />

// Use one handwritten transform string when you need to author
// multiple transform functions together or interop with non-Motion code
<motion.div animate={{ transform: "translateX(100px) rotate(4deg)" }} />
```

Do not mix Motion `x`/`y` props with a separate handwritten `transform` string on the same element. Pick one transform owner.

## Pause looping animations off-screen

Looping animations consume GPU resources even when not visible.

```ts
"use client";
import { useEffect, useRef } from "react";

export function usePauseOffscreen<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
```

## Compositing layers and will-change

`will-change` creates a new compositor layer; this has a memory cost.

- Only promote during animation, remove after
- Only for `transform` and `opacity`
- Too many layers is worse than no promotion

```css
.animating { will-change: transform, opacity; }
```

Toggle the class on animation start, remove on `transitionend` or `animationend`.

## Fix shaky 1px shifts

Elements can shift by 1px at animation start/end due to GPU/CPU handoff. Apply `will-change: transform` during the animation (not permanently) to keep compositing on the GPU throughout.
