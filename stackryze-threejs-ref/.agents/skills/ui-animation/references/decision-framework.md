# Animation Decision Framework

## Contents
- [1. Should this animate at all?](#1-should-this-animate-at-all)
- [2. What is the purpose?](#2-what-is-the-purpose)
- [3. What easing should it use?](#3-what-easing-should-it-use)
- [4. How fast should it be?](#4-how-fast-should-it-be)

Before writing any animation code, answer these four questions in order.

## 1. Should this animate at all?

**How often will users see this animation?**

| Frequency | Examples | Decision |
|---|---|---|
| 100+ times/day | Keyboard shortcuts, command palette toggle | No animation. Ever. |
| Tens of times/day | Hover effects, list navigation | Remove or drastically reduce |
| Occasional | Modals, drawers, toasts | Standard animation |
| Rare / first-time | Onboarding, feedback forms, celebrations | Can add delight |

Never animate keyboard-initiated actions. They repeat hundreds of times daily; animation makes them feel slow and disconnected.

## 2. What is the purpose?

Answer "why does this animate?" before writing code.

| Purpose | Description | Example |
|---|---|---|
| **Feedback** | Confirms user action was received | Button scale on press, toggle state |
| **Orientation** | Shows spatial relationship | Drawer slides from edge, menu scales from trigger |
| **Continuity** | Preserves context across state changes | Page transitions, layout shifts |
| **Delight** | Adds personality (use sparingly) | Stagger reveals, spring overshoot |

If the purpose is just "it looks cool" and the user will see it often, don't animate.

## 3. What easing should it use?

Follow this decision tree:

- **Entering the viewport?** → enter curve: `cubic-bezier(0.22, 1, 0.36, 1)`
- **Exiting the viewport?** → same curve, shorter duration
- **Moving/sliding on screen?** → move curve: `cubic-bezier(0.25, 1, 0.5, 1)`
- **Simple hover (color/opacity)?** → `200ms ease`
- **Needs physics feel?** → spring
- **Direct manipulation (drag)?** → no easing, follow the pointer
- **Constant motion (marquee, spinner)?** → `linear`

Avoid `ease-in` for UI; it starts slow and feels sluggish. CSS's built-in named curves (`ease-out`, `ease`) have gentle acceleration that makes animations feel soft rather than decisive. Custom curves like `cubic-bezier(0.22, 1, 0.36, 1)` have steeper initial acceleration: the element covers most of its distance in the first third, so the same 200ms feels significantly faster.

**Easing resources:** [easing.dev](https://easing.dev/) and [easings.co](https://easings.co/) for stronger custom variants.

### Extended easing reference

| Name | Curve | Character |
|---|---|---|
| ease-out-quad | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Gentle deceleration |
| ease-out-cubic | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Standard deceleration |
| ease-out-quart | `cubic-bezier(0.165, 0.84, 0.44, 1)` | Strong deceleration |
| ease-out-quint | `cubic-bezier(0.23, 1, 0.32, 1)` | Very strong deceleration |
| ease-out-expo | `cubic-bezier(0.19, 1, 0.22, 1)` | Explosive start, soft land |
| ease-out-circ | `cubic-bezier(0.075, 0.82, 0.165, 1)` | Circular deceleration |
| ease-in-out-quad | `cubic-bezier(0.455, 0.03, 0.515, 0.955)` | Gentle symmetric |
| ease-in-out-cubic | `cubic-bezier(0.645, 0.045, 0.355, 1)` | Standard symmetric |
| ease-in-out-quart | `cubic-bezier(0.77, 0, 0.175, 1)` | Strong symmetric |

Use weaker curves (quad, cubic) for small or frequent elements. Use stronger curves (quint, expo) for large or rare transitions.

### Asymmetric vs symmetric curves

Symmetric ease-in-out starts slow; there's a noticeable lag between the user's action and the element beginning to move. For interactive elements (drawers, panels, menus), use asymmetric curves that are steep at the start and settle slowly at the end. This preserves responsiveness while the slow deceleration adds quality.

Duration and easing are inseparable. A steep curve can afford a longer duration because the movement is front-loaded. Vaul's drawer uses 500ms with `cubic-bezier(0.32, 0.72, 0, 1)`, but it doesn't feel slow because the drawer covers most of its distance in the first 200ms.

## 4. How fast should it be?

Pick the duration from the easing defaults table in SKILL.md. Keep routine UI animation under 300ms and scale duration with distance traveled: a full-screen menu sliding from off-screen can exceed 300ms, while a 6px tooltip shift should be under 150ms.

### Perceived performance

Animation speed changes perceived performance:

- A fast-spinning spinner makes loading feel faster (same load time, different perception)
- `ease-out` at 200ms _feels_ faster than `ease-in` at 200ms because the user sees immediate movement
- Instant tooltips after the first one is open (skip delay + skip animation) make the toolbar feel faster

### Asymmetric timing

Enter can be slightly slower than exit. Example: hold-to-delete uses 2s linear on press, 200ms ease-out on release.

```css
/* Release: fast */
.overlay {
  transition: clip-path 200ms ease-out;
}

/* Press: slow and deliberate */
.button:active .overlay {
  transition: clip-path 2s linear;
}
```

### Instant enter, animated exit (productivity tools)

For high-frequency interactions in daily-driver productivity tools (hover highlights, popovers, side panels, command palette results), invert the standard asymmetric rule: enter instantly (0ms), exit with a brief fade (100-150ms).

The user's action should produce an immediate visual result; any enter delay feels like lag when repeated hundreds of times. The exit animation prevents the dismissal from feeling jarring (a hard cut on exit is more noticeable than on enter because the user's eye is already on the element).

```css
/* Hover highlight: instant appear, soft dismiss */
.highlight {
  transition: opacity 0.15s ease-out;
  opacity: 0;
}
.item:hover .highlight {
  transition-duration: 0s;
  opacity: 1;
}
```

This applies when:
- The interaction happens tens to hundreds of times per day
- The user initiates the action (hover, click, keyboard)
- The element is ephemeral (highlight, popover, tooltip after first open)

It does not apply to:
- Rare interactions (modals, onboarding): use standard asymmetric timing
- Content that needs orientation (drawers with navigation): enter animation provides spatial context

Once you know the element should animate, match the UI pattern to a recipe using the "Transition decision rules" table in SKILL.md.
