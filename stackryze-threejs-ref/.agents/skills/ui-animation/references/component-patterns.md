# Component Animation Patterns

## Contents
- [Buttons](#buttons)
- [Popovers and dropdowns](#popovers-and-dropdowns)
- [Tooltips](#tooltips)
- [Drawers and panels](#drawers-and-panels)
- [Modals and dialogs](#modals-and-dialogs)
- [Toasts](#toasts)
- [Crossfade transitions](#crossfade-transitions)
- [Lists and stagger](#lists-and-stagger)
- [Hover effects](#hover-effects)
- [Step form navigation](#step-form-navigation)
- [3D transforms](#3d-transforms)

## Buttons

Add `transform: scale(0.97)` on `:active` for instant press feedback.

```css
.button {
  transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1);
}
.button:active {
  transform: scale(0.97);
}
```

`scale(0.9)` is too aggressive: the button visibly collapses and draws the eye to the shrinking rather than the action. Press feedback should be felt, not seen. Stay in the `0.96-0.98` range.

Use blur to mask imperfect crossfade transitions between button states:

```css
.button-content.transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```

Keep blur under 20px; heavy blur is expensive, especially in Safari.

## Popovers and dropdowns

Scale in from the trigger point, not from center. The default `transform-origin: center` is wrong for popovers.

```css
/* Radix UI */
.popover {
  transform-origin: var(--radix-popover-content-transform-origin);
}

/* Data attribute fallback */
.popover[data-side="top"]    { transform-origin: bottom center; }
.popover[data-side="bottom"] { transform-origin: top center; }
.popover[data-side="left"]   { transform-origin: center right; }
.popover[data-side="right"]  { transform-origin: center left; }
```

Start at `scale(0.88)`, never `scale(0)`. Nothing in the real world appears from nothing.

```css
.menu {
  transform: scale(0.88);
  opacity: 0;
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.menu[data-open="true"] {
  transform: scale(1);
  opacity: 1;
}
```

## Tooltips

Delay before first appearance (300-500ms) to prevent accidental activation. Once one tooltip is open, subsequent tooltips open instantly with no animation.

```css
.tooltip {
  transition: transform 125ms ease-out, opacity 125ms ease-out;
  transform-origin: var(--transform-origin);
}
.tooltip[data-starting-style],
.tooltip[data-ending-style] {
  opacity: 0;
  transform: scale(0.97);
}
.tooltip[data-instant] {
  transition-duration: 0ms;
}
```

## Drawers and panels

Use the move easing curve. Percentage `translateY`/`translateX` adapts to any drawer height.

```css
.drawer {
  transform: translateY(100%);
  transition: transform 240ms cubic-bezier(0.25, 1, 0.5, 1);
}
.drawer[data-open="true"] {
  transform: translateY(0);
}
```

```tsx
<motion.aside
  initial={{ transform: "translate3d(100%, 0, 0)" }}
  animate={{ transform: "translate3d(0, 0, 0)" }}
  exit={{ transform: "translate3d(100%, 0, 0)" }}
  transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
/>
```

## Modals and dialogs

**Exception: modals keep `transform-origin: center`.** They represent app-level state, not anchored to a trigger.

Use `@starting-style` for entry animations without JavaScript:

```css
.modal {
  opacity: 1;
  transform: scale(1);
  transition: opacity 250ms cubic-bezier(0.22, 1, 0.36, 1),
              transform 250ms cubic-bezier(0.22, 1, 0.36, 1);

  @starting-style {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

Fall back to `data-mounted` attribute pattern when `@starting-style` browser support is insufficient.

## Toasts

Enter and exit from the same direction for spatial consistency (makes swipe-to-dismiss intuitive).

```css
.toast {
  transform: translate3d(0, 6px, 0);
  opacity: 0;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.toast[data-open="true"] {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
```

Use CSS transitions (not keyframes) for toasts; they are added rapidly, and keyframes restart on interruption while transitions retarget smoothly.

## Crossfade transitions

When the container is small or the outgoing and incoming content are structurally similar, a full directional slide adds too much visual weight. Use a crossfade with a subtle directional hint instead.

```css
.view-enter {
  opacity: 0;
  transform: translateY(8px);
  filter: blur(4px);
  transition: opacity 150ms ease-out, transform 150ms ease-out, filter 150ms ease-out;
}
.view-enter-active {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
```

Nav content swaps, tab panels with similar structure, and small card state changes are crossfade candidates. The 8px shift communicates "the view changed" without the visual weight of content traveling across the screen.

## Lists and stagger

Keep stagger delays short (30-50ms per item). Total stagger should stay under 300ms.

```css
.item {
  opacity: 0;
  transform: translateY(8px);
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.list[data-open="true"] .item {
  opacity: 1;
  transform: translateY(0);
}
.list[data-open="true"] .item:nth-child(2) { transition-delay: 50ms; }
.list[data-open="true"] .item:nth-child(3) { transition-delay: 100ms; }
.list[data-open="true"] .item:nth-child(4) { transition-delay: 150ms; }
```

```tsx
const listVariants = {
  show: { transition: { staggerChildren: 0.05 } },
};
```

Never block interaction while stagger animations are playing.

When removing items, use `AnimatePresence mode="popLayout"` so the exiting element is pulled out of document flow immediately. Siblings start reflowing in parallel with the exit animation. The default mode waits for exit to finish before siblings move, causing sequential rather than parallel motion.

```tsx
<AnimatePresence mode="popLayout">
  {items.map((item) => (
    <motion.div
      key={item.id}
      layout
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
    />
  ))}
</AnimatePresence>
```

## Hover effects

Gate hover animations behind a media query to avoid false positives on touch devices.

```css
@media (hover: hover) and (pointer: fine) {
  .link {
    transition: color 200ms ease, opacity 200ms ease;
  }
  .link:hover {
    opacity: 0.8;
  }
}
```

Fix hover flicker by applying the hover on a parent and animating the child. When `translateY` is on the hover target itself, the element moves out from under the cursor at the bottom edge, ending the hover, causing an infinite loop.

```css
.box:hover .box-inner {
  transform: translateY(-20%);
}
.box-inner {
  transition: transform 200ms ease;
}
```

For scale-based hover, use `scale(1.01)` to `scale(1.02)`. `scale(1.05)` is visibly inflated. Hover transitions should be 100-150ms; 300ms feels laggy because the user's eye is already on the element.

```css
@media (hover: hover) and (pointer: fine) {
  .card {
    transition: transform 120ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .card:hover {
    transform: scale(1.015);
  }
}
```

## Step form navigation

Forward steps slide content left (like reading). Backward steps slide content right (like undoing). Animating both directions the same way breaks the user's mental model of forward vs backward progress.

```tsx
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={step}
    custom={direction}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
  />
</AnimatePresence>
```

## 3D transforms

For depth effects (card flips, coin spins, orbits), use `rotateX()`/`rotateY()` with `transform-style: preserve-3d` on the wrapper. This stays on the GPU and needs no JavaScript. Reserve it for illustrative or delight moments, not high-frequency UI.

```css
.flip {
  transform-style: preserve-3d;
  transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
}
.flip[data-flipped="true"] {
  transform: rotateY(180deg);
}
.flip .front,
.flip .back {
  backface-visibility: hidden;
}
.flip .back {
  transform: rotateY(180deg);
}
```

Set `perspective` on the parent (for example `perspective: 1000px`) to control depth intensity; smaller values exaggerate the effect. As with SVG, set `transform-box: fill-box; transform-origin: center` if the rotation pivots around the wrong point.
