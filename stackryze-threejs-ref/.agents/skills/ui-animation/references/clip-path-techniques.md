# clip-path for Animation

`clip-path` is one of the most powerful animation tools in CSS. It is hardware-accelerated and creates effects impossible with `opacity` and `transform` alone.

## Contents
- [The inset shape](#the-inset-shape)
- [Tab colour transitions](#tab-colour-transitions)
- [Hold-to-delete](#hold-to-delete)
- [Image reveals on scroll](#image-reveals-on-scroll)
- [Comparison sliders](#comparison-sliders)

## The inset shape

`clip-path: inset(top right bottom left)` defines a rectangular clipping region. Each value "eats" into the element from that side.

```css
/* Fully hidden from right */
.hidden { clip-path: inset(0 100% 0 0); }

/* Fully visible */
.visible { clip-path: inset(0 0 0 0); }
```

Animate between states with a CSS transition:

```css
.reveal {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.active {
  clip-path: inset(0 0 0 0);
}
```

## Tab colour transitions

Duplicate the tab list. Style the copy as "active" (different background, different text colour). Clip the copy so only the active tab is visible. Animate the clip on tab change.

This creates a seamless colour transition that timing individual `color` transitions can never achieve.

```css
.tabs-active-overlay {
  clip-path: inset(0 var(--clip-right) 0 var(--clip-left));
  transition: clip-path 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

Update `--clip-left` and `--clip-right` via JavaScript when the active tab changes.

## Hold-to-delete

Use `clip-path: inset(0 100% 0 0)` on a coloured overlay. On `:active`, transition to `inset(0 0 0 0)` over 2s with `linear` timing. On release, snap back with 200ms `ease-out`. Pair with `scale(0.97)` on the button for press feedback.

```css
.delete-overlay {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 200ms ease-out;
}

.delete-button:active .delete-overlay {
  clip-path: inset(0 0 0 0);
  transition: clip-path 2s linear;
}
```

## Image reveals on scroll

Start with `clip-path: inset(0 0 100% 0)` (hidden from bottom). Animate to `inset(0 0 0 0)` when the element enters the viewport.

```tsx
"use client";
import { useRef, useEffect, useState } from "react";

export function RevealImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "-100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: "clip-path 800ms cubic-bezier(0.77, 0, 0.175, 1)",
      }}
    >
      <img src={src} alt={alt} />
    </div>
  );
}
```

## Comparison sliders

Overlay two images. Clip the top image with `clip-path: inset(0 50% 0 0)`. Adjust the right inset based on drag position. No extra DOM elements needed, fully hardware-accelerated.

```css
.comparison-top {
  clip-path: inset(0 var(--split) 0 0);
}
```

Update `--split` via pointer events on the slider handle.
