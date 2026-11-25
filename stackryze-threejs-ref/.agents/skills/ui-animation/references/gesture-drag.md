# Gesture and Drag Animations

Patterns for drag, swipe, and gesture interactions where the user directly manipulates elements.

## Contents
- [Momentum-based dismissal](#momentum-based-dismissal)
- [Boundary damping](#boundary-damping)
- [Pointer capture](#pointer-capture)
- [Multi-touch protection](#multi-touch-protection)
- [Friction vs hard stops](#friction-vs-hard-stops)
- [Swipe-to-dismiss pattern](#swipe-to-dismiss-pattern)

## Momentum-based dismissal

Don't require dragging past a distance threshold. Calculate velocity at release; a quick flick should be enough to dismiss.

```ts
function onPointerUp(e: PointerEvent) {
  const timeTaken = Date.now() - dragStartTime;
  const velocity = Math.abs(swipeAmount) / timeTaken;

  if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
    dismiss();
  } else {
    snapBack();
  }
}
```

Use velocity > 0.11 as a reasonable default threshold. Combine with a minimum distance threshold (e.g. 20px) to prevent accidental dismissals.

## Boundary damping

When a user drags past the natural boundary (e.g. pulling a drawer up when already at top), apply damping. The more they drag, the less the element moves.

```ts
function applyDamping(offset: number, max: number): number {
  return max * (1 - Math.exp(-offset / max));
}

// Usage: as offset grows, movement diminishes
const dampedOffset = applyDamping(rawOffset, 200);
```

Things in real life don't suddenly stop; they slow down first. Friction instead of hard stops always feels more natural.

## Pointer capture

Once dragging starts, capture all pointer events on the element. This ensures dragging continues even if the pointer leaves the element bounds.

```ts
function onPointerDown(e: PointerEvent) {
  (e.target as HTMLElement).setPointerCapture(e.pointerId);
  isDragging = true;
}

function onPointerUp(e: PointerEvent) {
  (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  isDragging = false;
}
```

Always use `setPointerCapture`; without it, fast swipes escape the element and the drag breaks.

## Multi-touch protection

Ignore additional touch points after the initial drag begins. Without this, switching fingers mid-drag causes the element to jump.

```ts
let activeTouchId: number | null = null;

function onPointerDown(e: PointerEvent) {
  if (activeTouchId !== null) return; // Ignore additional touches
  activeTouchId = e.pointerId;
  // Start drag...
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== activeTouchId) return;
  activeTouchId = null;
  // End drag...
}
```

## Friction vs hard stops

Instead of preventing drag past a boundary, allow it with increasing friction:

```ts
function applyFriction(delta: number, isAtBoundary: boolean): number {
  if (!isAtBoundary) return delta;
  return delta * 0.3; // 30% of movement at boundary
}
```

Hard stops feel broken; users expect physics. Apply friction for scroll containers, sliders, and drawers.

## Swipe-to-dismiss pattern

Combine velocity, distance, and direction for a complete swipe gesture:

```ts
function handleSwipeEnd(direction: "left" | "right", distance: number, velocity: number) {
  const shouldDismiss = distance > THRESHOLD || velocity > 0.11;

  if (shouldDismiss) {
    // Animate out in swipe direction with remaining momentum
    animateOut(direction, velocity);
  } else {
    // Spring back to origin
    springBack();
  }
}
```

The exit animation should continue in the swipe direction with momentum; snapping to a different direction feels wrong.
