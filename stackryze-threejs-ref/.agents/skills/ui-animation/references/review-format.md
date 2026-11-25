# Animation Review Format

## Contents
- [Operating posture](#operating-posture)
- [Ten non-negotiable standards](#ten-non-negotiable-standards)
- [Escalation triggers](#escalation-triggers)
- [Remedial preference hierarchy](#remedial-preference-hierarchy)
- [Before/After/Why table](#beforeafterwhy-table)
- [Review checklist](#review-checklist)
- [Verdict output](#verdict-output)
- [Component design principles](#component-design-principles)
- [Debugging animations](#debugging-animations)

## Operating posture

You are a senior motion reviewer with a brutal eye for craft. The bias is toward motion that feels right, not motion that merely runs. A transition that "works" but feels sluggish, lands from the wrong origin, fires too often, or drops frames is a regression, not a pass. Default to flagging. Approval is earned, not assumed.

## Ten non-negotiable standards

Every animation in the diff is measured against these. A violation is a finding. For exact values (curves, durations, spring config), cite the easing/duration tables in the main `SKILL.md` rather than approximating.

1. **Justified motion.** Every animation answers "why does this animate?": feedback, orientation, continuity, state indication, or deliberate delight. "It looks cool" on a frequently-seen element is a block.
2. **Frequency-appropriate.** Keyboard-initiated and 100+/day actions get no animation. Tens/day gets reduced motion. Occasional gets standard. Rare or first-time can carry delight.
3. **Responsive easing.** Entering/exiting elements use `ease-out` or a strong custom curve. `ease-in` on UI is a block; it delays the moment the user watches most. Built-in CSS easings are too weak for deliberate animation.
4. **Sub-300ms UI.** UI animations stay under 300ms; anything slower on a UI element needs a stated reason. Scale duration with distance traveled.
5. **Origin and physical correctness.** Popovers, dropdowns, and tooltips scale from their trigger (`transform-origin`), not center. Never animate from `scale(0)`; start at `scale(0.85-0.97)` plus opacity. Modals are exempt and stay centered.
6. **Interruptibility.** Rapidly-triggered or gesture-driven motion (toasts, toggles, drags) must retarget from its current state. Prefer CSS transitions or springs over keyframes, which restart from zero.
7. **GPU-only properties.** Animate `transform` and `opacity` only. Animating `width`/`height`/`margin`/`padding`/`top`/`left`, or Framer Motion `x`/`y`/`scale` shorthands under load, is a performance finding.
8. **Accessibility.** `prefers-reduced-motion` is honored (gentler, not zero: keep opacity/color, drop movement). Hover animations are gated behind `@media (hover: hover) and (pointer: fine)`.
9. **Asymmetric enter/exit.** Deliberate actions (a press, a hold, a destructive confirm) animate slower; system responses snap. Symmetric timing on a press-and-release or hold interaction is a finding.
10. **Cohesion.** Motion matches the component's personality and the rest of the product: playful can be bouncier, a dashboard stays crisp. Mismatched personality, or a jarring crossfade where a subtle blur would bridge two states, is a finding. When unsure whether motion feels right, the strongest move is often to delete it.

## Escalation triggers

Flag these on sight, hard:

- `transition: all` (unbounded property animation)
- `scale(0)` or pure-fade entrances with no initial transform
- `ease-in` on any UI interaction, or weak built-in easing on a deliberate animation
- Animation on a keyboard shortcut, command-palette toggle, or 100+/day action
- UI duration > 300ms with no stated reason
- `transform-origin: center` on a trigger-anchored popover, dropdown, or tooltip
- Keyframes on toasts, toggles, or anything added/triggered rapidly
- Animating layout properties (`width`/`height`/`margin`/`padding`/`top`/`left`)
- Framer Motion `x`/`y`/`scale` props on motion that runs while the page is busy
- Updating a CSS variable on a parent to drive a child transform (style recalc storm)
- Missing `prefers-reduced-motion` handling on movement
- Ungated `:hover` motion
- Symmetric enter/exit timing on a press-and-release or hold interaction
- Everything-at-once entrance where a 30-50ms stagger belongs

## Remedial preference hierarchy

When proposing fixes, prefer earlier moves over later ones:

1. **Delete the animation** (high-frequency, no purpose, or keyboard-triggered).
2. **Reduce it**: shorter duration, smaller transform, fewer animated properties.
3. **Fix the easing**: swap `ease-in` to `ease-out` or a strong custom curve.
4. **Fix the origin and physicality**: correct `transform-origin`; replace `scale(0)` with `scale(0.95)` plus opacity.
5. **Make it interruptible**: keyframes to transitions, or a spring for gesture-driven motion.
6. **Move it to the GPU**: layout props to `transform`/`opacity`; shorthand to a full `transform` string; WAAPI for programmatic CSS.
7. **Asymmetric timing**: slow the deliberate phase, snap the response.
8. **Polish**: blur to mask crossfades, stagger for groups, `@starting-style` for entry, spring for "alive" elements.
9. **Accessibility and cohesion**: add reduced-motion and hover gating; tune to match the component's personality.

## Before/After/Why table

The required first part of every review. Use a markdown table, one row per issue. Never a "Before:/After:" list on separate lines.

| Before | After | Why |
|---|---|---|
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; `all` animates unintended properties off-GPU |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing in the real world appears from nothing |
| `ease-in` on dropdown | `ease-out` with custom curve | `ease-in` feels sluggish; `ease-out` gives instant feedback |
| No `:active` state on button | `transform: scale(0.97)` on `:active` | Buttons must feel responsive to press |
| `transform-origin: center` on popover | `transform-origin: var(--radix-popover-content-transform-origin)` | Popovers scale from trigger (modals stay centered) |

## Review checklist

| Issue | Fix |
|---|---|
| `transition: all` | Target specific properties |
| Layout property animated (`width`, `height`, `top`, `left`) | Switch to `transform` and `opacity` |
| `ease-in` on UI entrance | Use enter easing: `cubic-bezier(0.22, 1, 0.36, 1)` |
| Permanent `will-change` | Toggle during animation only |
| `scale(0)` start | Use `scale(0.85-0.95)` with `opacity: 0` |
| No touch device guard on hover | Add `@media (hover: hover) and (pointer: fine)` |
| Symmetric enter/exit timing | Make exit 20-30% faster than enter |
| CSS variable drag animation | Use `transform` directly on the element |
| Missing `setPointerCapture` on drag | Add pointer capture for reliable tracking |
| Motion `x`/`y` mixed with a handwritten `transform` | Pick one transform owner for the element |
| Animation on keyboard action | Remove animation entirely |
| Duration > 300ms on UI element | Reduce to 150-250ms |
| Keyframes on rapidly-triggered element | Use CSS transitions for interruptibility |
| Hard cut between views sharing elements | Add shared-element transition; animate persistent components in place |
| Contextual overlay enters from centre | Set `transform-origin` to trigger; animate outward from source element |
| Elements all appear at once | Add stagger delay (30-50ms between items) |
| Touch target under 44px on interactive element | Add `::before` pseudo-element sized to 44x44px minimum (WCAG 2.5.5) |
| Hover scale > 1.03 or hover duration > 150ms | Use `scale(1.01-1.02)` and 100-150ms transition |
| Container animates AND children stagger | Pick one entrance: animate the container OR stagger children, not both |
| Missing close-state cleanup after `setTimeout` | Add `is-closing` class, remove after transition duration completes |
| Missing reflow (`void el.offsetWidth`) between class changes | Force reflow before re-adding classes to restart transitions |
| Animating container instead of inner pieces | Apply transitions to child elements, not the wrapper |
| Hardcoded `stroke-dasharray` on SVG success path | Use `path.getTotalLength()` to measure the actual path length |
| `.is-error` and `.is-shaking` merged into one class | Keep them separate: `.is-shaking` controls animation only, `.is-error` controls visual state |

## Verdict output

The required second part of every review. Group remaining commentary by impact tier, highest first. Omit empty tiers.

1. **Feel-breaking regressions**: sluggish easing, comes-from-nowhere entrances, motion that fires on high-frequency or keyboard actions.
2. **Missed simplifications**: animations that should be removed or drastically reduced.
3. **Performance**: non-GPU properties, dropped-frame risks, recalc storms.
4. **Interruptibility and timing**: keyframes where transitions/springs belong; symmetric timing that should be asymmetric.
5. **Origin, physicality, and cohesion**: wrong origin, mismatched personality, jarring crossfades.
6. **Accessibility**: reduced-motion and pointer/hover gating.

Close with an explicit decision, citing `file:line`:

- **Block**: any feel-breaking regression, animation on a keyboard or high-frequency action, `scale(0)` or `ease-in` on UI, or a non-GPU animation with an easy GPU fix.
- **Approve**: no feel-breaking regressions, no obvious motion that should be deleted, durations and easing within bounds, interruptibility handled where needed, reduced-motion respected.

## Component design principles

- **Good defaults over options.** Most users never customise. The default easing, timing, and design should be excellent out of the box.
- **Transitions over keyframes for dynamic UI.** Elements added rapidly (toasts, list items) need interruptible animations. Keyframes restart from zero on interruption; transitions retarget smoothly.
- **Cohesion.** The animation style should match the component's personality. A playful component can be bouncier. A professional dashboard should be crisp and fast.
- **Invisible edge cases.** Pause timers when the tab is hidden. Fill gaps between stacked elements with pseudo-elements to maintain hover state. Capture pointer events during drag.

## Debugging animations

- **Slow motion:** Temporarily increase duration to 2-5x or use the browser animation inspector. Check colour timing, easing, and transform-origin.
- **Frame-by-frame:** Step through in Chrome DevTools Animations panel to reveal timing issues between coordinated properties.
- **Real devices:** For touch interactions (drawers, swipe gestures), test on physical devices. The Xcode Simulator works but real hardware is better for gesture testing.
- **Review next day:** You notice imperfections with fresh eyes that you missed during development.
