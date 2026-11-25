---
name: ui-animation
description: Creates, reviews, and debugs UI motion and animation implementations. Covers springs, gestures, drag interactions, clip-path reveals, easing curves, timing, CSS transition recipes, and animation review. Use when designing, implementing, or reviewing motion, CSS transitions, keyframes, framer-motion, spring animations, or asking "add animations to", "make this feel smooth", "review my animations", "should this animate", "add a swipe gesture", or "add a transition". For recreating motion from a screen recording or video, use reverse-engineer-animation; for overall visual direction and styling, use ui-design; for named text-effect specs (typewriter, line reveal, kinetic builds), use animate-text.
---

# UI Animation

- **IS:** designing, implementing, reviewing, and debugging UI motion: springs, gestures, drag, easing, CSS transitions, keyframes, framer-motion.
- **IS NOT:** extracting an animation from a video or screen recording (use `reverse-engineer-animation`), choosing overall visual direction, palettes, or typography (use `ui-design`), or auditing a whole page's UI quality (use `ui-audit`).

## Reference files

| File                                                                       | Read when                                                                    |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [references/decision-framework.md](references/decision-framework.md)       | Default: deciding whether/why to animate, picking easing character           |
| [references/spring-animations.md](references/spring-animations.md)         | Using spring physics, framer-motion useSpring, configuring spring params     |
| [references/component-patterns.md](references/component-patterns.md)       | Building buttons, popovers, tooltips, drawers, modals, toasts with animation |
| [references/clip-path-techniques.md](references/clip-path-techniques.md)   | Using clip-path for reveals, tabs, hold-to-delete, comparison sliders        |
| [references/gesture-drag.md](references/gesture-drag.md)                   | Implementing drag, swipe-to-dismiss, momentum, pointer capture               |
| [references/performance-deep-dive.md](references/performance-deep-dive.md) | Debugging jank, CSS vs JS, WAAPI, CSS variables trap, Framer Motion caveats  |
| [references/review-format.md](references/review-format.md)                 | Reviewing animation code: strict review with ten standards, escalation triggers, Before/After/Why table, and a Block/Approve verdict |
| [references/contextual-animations.md](references/contextual-animations.md) | Implementing contextual icon swaps, word-level stagger entrances, or fixed-offset exit animations |
| [references/transition-recipes.md](references/transition-recipes.md)       | Installing a CSS transition: card resize, badge, dropdown, modal, panel, page slide, icon swap, number pop-in, text swap, success animation, avatar hover, error shake |

## Core rules

- Animate for feedback, orientation, continuity, or deliberate delight. If the purpose is "it looks cool" and the user sees it often, don't animate.
- Never animate keyboard-initiated actions (shortcuts, arrow navigation, tab/focus); they repeat hundreds of times daily and animation makes them feel slow.
- Prefer CSS transitions for interruptible UI; keyframes restart from zero on interruption, transitions retarget smoothly. Use keyframes only for predetermined sequences.
- Implementation priority: CSS transitions > WAAPI > CSS keyframes > JS (`requestAnimationFrame`). Under load, CSS stays smooth while JS drops frames.
- Asymmetric timing: for occasional interactions, enter can be slightly slower and exit should be fast. For high-frequency ephemeral UI (hover highlights, popovers, panel toggles), invert this: enter instantly (0ms), exit with a brief fade (100-150ms) so the action feels immediate.
- Use `@starting-style` for DOM entry animations; fall back to a `data-mounted` attribute where support is insufficient.
- A small `filter: blur(2px)` can hide rough crossfades between swapped content.

## Motion design principles

- **Continuity over teleportation.** Elements visible in both states transition in place. Expand from where elements sit rather than fading in a new instance. Never duplicate a persistent element or hard-cut between views that share components; hard cuts lose spatial context.
- **Directional motion matches position.** Tab and carousel transitions animate in the direction matching spatial layout (left-to-right for forward, right-to-left for back).
- **Emerge from the trigger.** Overlays, trays, and panels animate outward from the element that opened them. Generic centre-screen entrances break spatial orientation.
- **Consistent polish everywhere.** Under-animated areas make the entire product feel unpolished. Motion quality must be uniform across all surfaces.
- **Delight scales inversely with frequency.** Rarer interactions have more room for personality. High-frequency actions must be invisible.
- **Motion enhances perceived speed.** Smooth transitions between states feel faster than hard cuts, even at identical load times.

## What to animate

- Movement: `transform` and `opacity` only; they skip layout and paint.
- State feedback: `color`, `background-color`, and `opacity` are acceptable.
- Never animate layout properties (`width`, `height`, `top`, `left`); they trigger layout recalculation every frame. (Exception: a deliberate container resize tween, see the card-resize recipe.)
- Never use `transition: all`; it animates unintended properties and silently picks up future ones. List properties explicitly.
- Avoid `filter` animation for core interactions; keep blur ≤ 20px if unavoidable, since heavy blur is expensive, especially in Safari.
- SVG: apply transforms on a `<g>` wrapper with `transform-box: fill-box; transform-origin: center`; without it, transforms rotate/scale around the SVG canvas origin.
- `transform: scale()` also scales an element's children (icons, text, borders scale proportionally), unlike `width`/`height`. This is a feature for press feedback; account for it when an inner element must keep a fixed size.
- Disable transitions during theme switches (`[data-theme-switching] * { transition: none !important }`); otherwise every themed property animates at once.

## Easing defaults

| Element                       | Duration     | Easing                           |
| ----------------------------- | ------------ | -------------------------------- |
| Button press feedback         | 100-160ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Tooltips, small popovers      | 125-200ms    | `ease-out` or enter curve        |
| Dropdowns, selects            | 150-250ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Modals, drawers               | 200-350ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Move/slide on screen          | 200-300ms    | `cubic-bezier(0.25, 1, 0.5, 1)`  |
| Page transitions              | 250-400ms    | enter or move curve              |
| Simple hover (colour/opacity) | 200ms        | `ease`                           |
| Illustrative/marketing        | Up to 1000ms | Spring or custom                 |

Keep routine UI animation under 300ms; scale duration with distance traveled (a full-screen slide can exceed 300ms, a 6px tooltip shift should be under 150ms).

**Named curves**

- **Enter:** `cubic-bezier(0.22, 1, 0.36, 1)` for entrances and transform-based hover
- **Move:** `cubic-bezier(0.25, 1, 0.5, 1)` for slides, drawers, panels
- **Drawer (iOS-like):** `cubic-bezier(0.32, 0.72, 0, 1)`

Avoid `ease-in` for UI; it starts slow, so the element lags the user's action and feels sluggish. Prefer custom curves from [easing.dev](https://easing.dev/) over built-in `ease`/`ease-out`, whose gentle acceleration reads soft rather than decisive.

## Transition decision rules

Match the UI element first, then choose the recipe from [references/transition-recipes.md](references/transition-recipes.md):

| UI pattern | Recipe |
|---|---|
| Trigger + floating dot/count | Notification badge |
| Trigger + anchored surface | Menu dropdown |
| Centred surface on top of page | Modal dialog |
| Panel sliding into existing container | Panel reveal |
| List ↔ detail or wizard steps | Page side-by-side slides |
| Element dimension changes | Card resize |
| Text updating in place | Text state swap |
| Two icons in same slot | Icon swap |
| Number updating | Number pop-in |
| Confirmation / success moment | Success celebration |
| Hovering item in horizontal stack | Avatar group hover |
| Form validation error | Error state shake |

Prefer lower-overhead transitions (CSS-only) unless the design requires JS orchestration.

## Spatial and sequencing

- Set `transform-origin` at the trigger point for popovers; keep `center` for modals (they represent app-level state, not an anchored trigger).
- For dialogs/menus, start around `scale(0.85-0.9)`. Never `scale(0)`; nothing in the real world appears from nothing.
- Stagger reveals at 30-50ms per item; total stagger under 300ms. Vary timing by visual importance; the most important element leads. Uniform stagger removes hierarchy and feels mechanical.
- **Paired elements rule:** elements that animate together (modal + overlay, tooltip + arrow, FAB + label) must share the same easing curve and duration. Mismatched timing between paired elements is the usual cause of "something feels off".

## Accessibility

- Every animation needs a `prefers-reduced-motion: reduce` path: disable transform/keyframe motion, keep instant state changes or opacity-only fades. All transition recipes include the guard.
- Gate hover animations behind `@media (hover: hover) and (pointer: fine)`; otherwise touch devices replay hover effects on tap. Tailwind v4 `hover:` utilities apply this guard automatically; skip the manual media query there.
- During direct manipulation, keep the element locked to the pointer with no easing. Add easing only after release.

## Performance

- Pause looping animations off-screen with `IntersectionObserver`; they burn GPU even when invisible.
- Toggle `will-change` only during heavy motion and only for `transform`/`opacity`; remove it after. Each promotion costs compositor memory, and permanent promotion across many elements is worse than none.
- Do not animate drag gestures via CSS variables on a container; every update recalculates styles for all children. Set `transform` directly on the moving element.
- Motion `x`/`y` values are the normal choice for axis movement and drag (they bypass React re-renders). Use a full `transform` string only when one owner must combine multiple transform functions or interop with non-Motion code.
- See [references/performance-deep-dive.md](references/performance-deep-dive.md) for WAAPI, compositing layers, and the CSS vs JS comparison table.

## Anti-patterns

High-signal failures not already covered by the rules above:

- Animating on mount without a user trigger: unexpected motion is disorienting; the user did nothing to cause it.
- Hard stops on drag boundaries feel broken; apply friction/damping so movement diminishes past the boundary (see gesture-drag reference).
- Mixing Motion `x`/`y` props with a handwritten `transform` string on the same element: both write `transform`, so one silently clobbers the other. Pick one transform owner.
- Animating both a container and staggering its children: pick one entrance per container. If the panel slides in, its content should already be visible when it arrives.
- Keyframes on rapidly-triggered elements (toasts, list items): interruption restarts them from zero; use CSS transitions, which retarget.
- Tooltip animation after the first tooltip is open: subsequent tooltips in the same group open instantly, or the toolbar feels laggy.

## Workflow

Copy and track this checklist:

```text
Animation progress:
- [ ] Step 1: Decide whether the interaction should animate
- [ ] Step 2: Choose purpose, easing, and duration
- [ ] Step 3: Pick the implementation style
- [ ] Step 4: Load the relevant component or technique reference
- [ ] Step 5: Validate timing, interruption, and device behavior
```

1. Answer the four questions in [references/decision-framework.md](references/decision-framework.md): should it animate? What purpose? What easing? What speed?
2. Pick duration from the easing defaults table above.
3. Choose implementation: CSS transition > WAAPI > spring > keyframe > JS.
4. Load the relevant reference for your component type or technique.
5. When reviewing, apply the strict posture in [references/review-format.md](references/review-format.md): measure against the ten standards, output the Before/After/Why table, then a tiered verdict ending in an explicit Block/Approve decision.

## Validation

Produce evidence for each check (DevTools observations, not "looks fine"):

- Grep the diff for layout property transitions (`width`, `height`, `top`, `left`) and `transition: all`.
- Retoggle components rapidly to confirm transitions retarget cleanly instead of restarting from zero.
- Slow animations to 10% in the DevTools Animations panel to catch timing and `transform-origin` issues invisible at full speed.
- Emulate `prefers-reduced-motion: reduce` (DevTools Rendering panel) and confirm every animation has a reduced path.
- Confirm `will-change` is toggled around animations, not permanently set, and looping animations pause off-screen.
- Test touch interactions on real devices; simulators under-report gesture and hover-on-tap issues.

## Related skills

- `reverse-engineer-animation`: extracts an animation spec from a screen recording; hand its output here for production implementation.
- `ui-design`: visual direction, palettes, typography; settle the visual system before tuning motion.
- `ui-audit`: page/feature-level UI quality audit; its motion findings route back to this skill for fixes.
- `animate-text`: curated catalog of named text effects (typewriter, line reveal, stagger builds) with exact JSON specs.
