# Spring Animations

Springs feel more natural than duration-based animations because they simulate real physics. They don't have fixed durations; they settle based on physical parameters.

## When to use springs

- Drag interactions with momentum (release and let physics take over)
- Elements that should feel "alive" (like Apple's Dynamic Island)
- Gestures that can be interrupted mid-animation
- Decorative mouse-tracking interactions
- Overshoot effects (playful UI)

**Don't use springs for:** simple fades, color transitions, or UI that needs precise timing.

## Spring parameters

| Parameter | What it controls | Typical range |
|---|---|---|
| `stiffness` | Speed of movement (higher = faster) | 100-500 |
| `damping` | Resistance (lower = more bounce) | 15-40 |
| `mass` | Weight feel (higher = slower, heavier) | 0.5-2 |

## Configuration presets

**Apple-style (recommended, easier to reason about):**

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }
```

**Traditional physics (more control):**

| Preset | stiffness | damping | Use case |
|---|---|---|---|
| Snappy (Apple default) | 500 | 40 | General UI, no bounce |
| Bouncy | 300 | 20 | Playful elements, notifications |
| Gentle | 200 | 30 | Page transitions, large elements |
| Stiff | 700 | 50 | Small precise movements |

Bounce communicates brand personality. Default to zero; it is the safe choice. A finance dashboard should never bounce; a learning app or creative tool can use subtle bounce (0.1-0.2) to feel friendlier. The question is not "does it look better with bounce?" but "does this match the brand?"

## Interruptibility advantage

Springs maintain velocity when interrupted; CSS keyframes restart from zero. This makes springs ideal for gestures users might change mid-motion.

```tsx
// Spring reverses smoothly from current position
<motion.div
  animate={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
  transition={{ type: "spring", stiffness: 500, damping: 40 }}
/>
```

## Spring-based mouse interactions

Tying values directly to mouse position feels artificial. Use `useSpring` to interpolate with spring-like behaviour instead of updating immediately.

```tsx
import { useSpring } from "framer-motion";

// Without spring: instant, feels artificial
const rotation = mouseX * 0.1;

// With spring: has momentum, feels natural
const springRotation = useSpring(mouseX * 0.1, {
  stiffness: 100,
  damping: 10,
});
```

Only use this for **decorative** interactions. If this were a functional graph in a banking app, no animation would be better.

## Snap instead of spring

If the interaction needs instant response or precise timing, skip the spring entirely. Use a short transition or snap directly to the end state.

```tsx
<motion.div
  animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -12 }}
  transition={
    shouldSnap
      ? { duration: 0.12, ease: "linear" }
      : { type: "spring", stiffness: 500, damping: 40 }
  }
/>
```
