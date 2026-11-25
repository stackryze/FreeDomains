# CSS Transition Recipes

12 production-ready CSS transition patterns. Each recipe includes CSS, HTML hooks, JS orchestration where needed, and a `prefers-reduced-motion` guard. All recipes read from a shared `:root` custom properties block.

## Contents

- [Custom properties](#custom-properties)
- [Card resize](#card-resize)
- [Panel reveal](#panel-reveal)
- [Notification badge](#notification-badge)
- [Icon swap](#icon-swap)
- [Menu dropdown](#menu-dropdown)
- [Modal dialog](#modal-dialog)
- [Text state swap](#text-state-swap)
- [Page side-by-side slides](#page-side-by-side-slides)
- [Number pop-in](#number-pop-in)
- [Avatar group hover](#avatar-group-hover)
- [Success celebration](#success-celebration)
- [Error state shake](#error-state-shake)

---

## Custom properties

Add this `:root` block once to your global stylesheet. Every recipe reads from these names.

```css
:root {
  /* Card resize */
  --resize-dur: 300ms;
  --resize-ease: cubic-bezier(0.22, 1, 0.36, 1);

  /* Number pop-in */
  --digit-dur: 500ms;
  --digit-dist: 12px;
  --digit-stagger: 70ms;
  --digit-blur: 6px;
  --digit-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --digit-dir-x: 0;
  --digit-dir-y: 1;

  /* Notification badge */
  --badge-slide-dur: 260ms;
  --badge-pop-dur: 500ms;
  --badge-blur: 2px;
  --badge-offset-x: -8.2px;
  --badge-offset-y: 12.4px;
  --badge-ease: cubic-bezier(0.22, 1, 0.36, 1);

  /* Text state swap */
  --text-swap-dur: 150ms;
  --text-swap-y: 4px;
  --text-swap-blur: 2px;
  --text-swap-ease: ease-in-out;

  /* Menu dropdown */
  --dropdown-open-dur: 250ms;
  --dropdown-close-dur: 150ms;
  --dropdown-pre-scale: 0.96;
  --dropdown-ease: cubic-bezier(0.22, 1, 0.36, 1);

  /* Modal dialog */
  --modal-open-dur: 250ms;
  --modal-close-dur: 150ms;
  --modal-scale: 0.96;
  --modal-ease: cubic-bezier(0.22, 1, 0.36, 1);

  /* Panel reveal */
  --panel-open-dur: 400ms;
  --panel-close-dur: 350ms;
  --panel-translate-y: 12px;
  --panel-blur: 4px;
  --panel-ease: cubic-bezier(0.22, 1, 0.36, 1);

  /* Page side-by-side */
  --page-dur: 200ms;
  --page-dist: 8px;
  --page-blur: 3px;
  --page-stagger: 60ms;
  --page-exit-enabled: 1;
  --page-ease: cubic-bezier(0.22, 1, 0.36, 1);

  /* Icon swap */
  --icon-swap-dur: 200ms;
  --icon-swap-blur: 2px;
  --icon-swap-start-scale: 0.25;
  --icon-swap-ease: ease-in-out;

  /* Success celebration */
  --success-opacity-dur: 550ms;
  --success-rotate-dur: 550ms;
  --success-bob-dur: 550ms;
  --success-blur-dur: 400ms;
  --success-path-dur: 550ms;
  --success-path-delay: 80ms;
  --success-rotate-from: 80deg;
  --success-rotate-to: 0deg;
  --success-bob-y: 40px;
  --success-blur-from: 10px;
  --success-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --success-bob-ease: cubic-bezier(0.34, 3.85, 0.64, 1);

  /* Avatar group hover */
  --avatar-lift: -4px;
  --avatar-dur: 320ms;
  --avatar-scale: 1.05;
  --avatar-falloff: 0.45;
  --avatar-ease-in: cubic-bezier(0.22, 1, 0.36, 1);
  --avatar-ease-out: cubic-bezier(0.34, 3.85, 0.64, 1);

  /* Error state shake */
  --shake-dist: 4px;
  --shake-overshoot: 2px;
  --shake-dur-1: 80ms;
  --shake-dur-2: 80ms;
  --shake-dur-3: 60ms;
  --shake-ease: cubic-bezier(0.36, 0.07, 0.19, 0.97);
  --shake-revert-dur: 200ms;
  --shake-hold: 1200ms;
}
```

---

## Card resize

Tween a container's width or height when its layout state changes (compact/expanded card, collapsing panel, list row toggling detail). CSS only, no JS required.

```html
<div class="t-resize">Content</div>
```

```css
.t-resize {
  transition: width var(--resize-dur) var(--resize-ease),
              height var(--resize-dur) var(--resize-ease);
  will-change: width, height;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .t-resize { transition: none; }
}
```

Toggle dimensions with a state class or inline style. The transition handles the tween.

---

## Panel reveal

Slide a panel into view inside an existing container with a cross-blur effect. CSS only, toggle `data-open`.

See also: `component-patterns.md` § Drawers and panels for percentage-based drawer slides.

```html
<div class="t-panel" data-open="false">Panel content</div>
```

```css
.t-panel {
  opacity: 0;
  transform: translateY(var(--panel-translate-y));
  filter: blur(var(--panel-blur));
  transition: opacity var(--panel-open-dur) var(--panel-ease),
              transform var(--panel-open-dur) var(--panel-ease),
              filter var(--panel-open-dur) var(--panel-ease);
}
.t-panel[data-open="true"] {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
.t-panel[data-open="false"] {
  transition-duration: var(--panel-close-dur);
}

@media (prefers-reduced-motion: reduce) {
  .t-panel { transition: none; }
}
```

---

## Notification badge

Slide a small badge onto a trigger (button, icon) and pop the dot. The trigger stays put. CSS only, toggle `data-open`.

```html
<button style="position: relative">
  Inbox
  <span class="t-badge" data-open="false">
    <span class="t-badge-dot"></span>
  </span>
</button>
```

```css
.t-badge {
  position: absolute;
  opacity: 0;
  transform: translate(var(--badge-offset-x), var(--badge-offset-y));
  filter: blur(var(--badge-blur));
  transition: opacity var(--badge-slide-dur) var(--badge-ease),
              transform var(--badge-slide-dur) var(--badge-ease),
              filter var(--badge-slide-dur) var(--badge-ease);
}
.t-badge[data-open="true"] {
  opacity: 1;
  transform: translate(0, 0);
  filter: blur(0);
}
.t-badge-dot {
  display: block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: currentColor;
  transform: scale(0);
  transition: transform var(--badge-pop-dur) var(--badge-ease);
}
.t-badge[data-open="true"] .t-badge-dot {
  transform: scale(1);
  transition-delay: calc(var(--badge-slide-dur) * 0.5);
}

@media (prefers-reduced-motion: reduce) {
  .t-badge, .t-badge-dot { transition: none; animation: none; }
}
```

---

## Icon swap

Cross-fade two icons in the same slot (hamburger/close, play/pause). CSS grid stacks both icons. Toggle `data-state`.

See also: `contextual-animations.md` § Contextual icon swaps for the Motion/AnimatePresence approach.

```html
<span class="t-icon-swap" data-state="a">
  <span class="t-icon" data-icon="a">☰</span>
  <span class="t-icon" data-icon="b">✕</span>
</span>
```

```css
.t-icon-swap {
  display: inline-grid;
}
.t-icon {
  grid-area: 1 / 1;
  opacity: 0;
  transform: scale(var(--icon-swap-start-scale));
  filter: blur(var(--icon-swap-blur));
  transition: opacity var(--icon-swap-dur) var(--icon-swap-ease),
              transform var(--icon-swap-dur) var(--icon-swap-ease),
              filter var(--icon-swap-dur) var(--icon-swap-ease);
}
.t-icon-swap[data-state="a"] [data-icon="a"],
.t-icon-swap[data-state="b"] [data-icon="b"] {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  .t-icon { transition: none; }
}
```

---

## Menu dropdown

Origin-aware dropdown with open and close animations. Requires JS for close-state cleanup.

See also: `component-patterns.md` § Popovers and dropdowns for Radix UI transform-origin and scale patterns.

```html
<div class="t-dropdown" data-origin="top-left">
  Menu content
</div>
```

```css
.t-dropdown {
  opacity: 0;
  transform: scale(var(--dropdown-pre-scale));
  transition: opacity var(--dropdown-open-dur) var(--dropdown-ease),
              transform var(--dropdown-open-dur) var(--dropdown-ease);
}
.t-dropdown.is-open {
  opacity: 1;
  transform: scale(1);
}
.t-dropdown.is-closing {
  opacity: 0;
  transform: scale(0.99);
  transition-duration: var(--dropdown-close-dur);
}

.t-dropdown[data-origin="top-left"]     { transform-origin: top left; }
.t-dropdown[data-origin="top-center"]   { transform-origin: top center; }
.t-dropdown[data-origin="top-right"]    { transform-origin: top right; }
.t-dropdown[data-origin="bottom-left"]  { transform-origin: bottom left; }
.t-dropdown[data-origin="bottom-center"]{ transform-origin: bottom center; }
.t-dropdown[data-origin="bottom-right"] { transform-origin: bottom right; }

@media (prefers-reduced-motion: reduce) {
  .t-dropdown { transition: none; }
}
```

**JS, close with cleanup:**

```js
function closeDropdown(el) {
  el.classList.add("is-closing");
  el.classList.remove("is-open");
  const dur = parseFloat(getComputedStyle(el).getPropertyValue("--dropdown-close-dur"));
  setTimeout(() => el.classList.remove("is-closing"), dur);
}
```

---

## Modal dialog

Scale-up modal with softer scale-down on close. Class-based state management.

See also: `component-patterns.md` § Modals and dialogs for `@starting-style` entry pattern.

```html
<div class="t-modal" role="dialog">Modal content</div>
```

```css
.t-modal {
  opacity: 0;
  transform: scale(var(--modal-scale));
  transform-origin: center;
  transition: opacity var(--modal-open-dur) var(--modal-ease),
              transform var(--modal-open-dur) var(--modal-ease);
}
.t-modal.is-open {
  opacity: 1;
  transform: scale(1);
}
.t-modal.is-closing {
  opacity: 0;
  transform: scale(var(--modal-scale));
  transition-duration: var(--modal-close-dur);
}

@media (prefers-reduced-motion: reduce) {
  .t-modal { transition: none; }
}
```

**JS, close with cleanup:**

```js
function closeModal(el) {
  el.classList.add("is-closing");
  el.classList.remove("is-open");
  const dur = parseFloat(getComputedStyle(el).getPropertyValue("--modal-close-dur"));
  setTimeout(() => el.classList.remove("is-closing"), dur);
}
```

---

## Text state swap

Swap text in place with a blurred vertical transition ("Processing..." → "Done"). Requires JS to coordinate the three-phase sequence.

```html
<span class="t-text-swap">Processing...</span>
```

```css
.t-text-swap {
  display: inline-block;
  transition: opacity var(--text-swap-dur) var(--text-swap-ease),
              transform var(--text-swap-dur) var(--text-swap-ease),
              filter var(--text-swap-dur) var(--text-swap-ease);
}
.t-text-swap.is-exit {
  opacity: 0;
  transform: translateY(calc(-1 * var(--text-swap-y)));
  filter: blur(var(--text-swap-blur));
}
.t-text-swap.is-enter-start {
  opacity: 0;
  transform: translateY(var(--text-swap-y));
  filter: blur(var(--text-swap-blur));
}

@media (prefers-reduced-motion: reduce) {
  .t-text-swap { transition: none; }
}
```

**JS, three-phase orchestration:**

```js
function swapText(el, newText) {
  const dur = parseFloat(getComputedStyle(el).getPropertyValue("--text-swap-dur"));
  el.classList.add("is-exit");
  setTimeout(() => {
    el.textContent = newText;
    el.classList.remove("is-exit");
    el.classList.add("is-enter-start");
    void el.offsetWidth; // force reflow
    el.classList.remove("is-enter-start");
  }, dur);
}
```

---

## Page side-by-side slides

Slide between two adjacent pages (list/detail, wizard steps). Page 1 exits left, page 2 enters right.

See also: `component-patterns.md` § Step form navigation for the Motion/AnimatePresence approach with direction variants.

```html
<div class="t-page-slide" data-page="1">
  <section data-page-id="1">Page 1</section>
  <section data-page-id="2">Page 2</section>
</div>
```

```css
.t-page-slide {
  display: grid;
  overflow: hidden;
}
.t-page-slide > * {
  grid-area: 1 / 1;
  transition: opacity var(--page-dur) var(--page-ease),
              transform var(--page-dur) var(--page-ease),
              filter var(--page-dur) var(--page-ease);
}

/* Page 1 active */
.t-page-slide[data-page="1"] [data-page-id="1"] {
  opacity: 1; transform: translateX(0); filter: blur(0);
}
.t-page-slide[data-page="1"] [data-page-id="2"] {
  opacity: 0;
  transform: translateX(var(--page-dist));
  filter: blur(var(--page-blur));
}

/* Page 2 active */
.t-page-slide[data-page="2"] [data-page-id="2"] {
  opacity: 1; transform: translateX(0); filter: blur(0);
}
.t-page-slide[data-page="2"] [data-page-id="1"] {
  opacity: 0;
  transform: translateX(calc(-1 * var(--page-dist)));
  filter: blur(var(--page-blur));
}

@media (prefers-reduced-motion: reduce) {
  .t-page-slide > * { transition: none; }
}
```

**JS, switch page:**

```js
slider.setAttribute("data-page", String(n));
```

Set `--page-exit-enabled: 0` for fade-only without sliding (useful during initial load).

---

## Number pop-in

Re-enter digits with directional blur when a number updates (counters, prices, balances). Each digit animates individually with optional stagger.

```html
<span class="t-digits">
  <span class="t-digit">1</span>
  <span class="t-digit">2</span>
  <span class="t-digit" data-stagger="1">3</span>
  <span class="t-digit" data-stagger="2">4</span>
</span>
```

```css
.t-digits {
  display: inline-flex;
}

@keyframes digit-enter {
  from {
    opacity: 0;
    transform: translate(
      calc(var(--digit-dir-x) * var(--digit-dist)),
      calc(var(--digit-dir-y) * var(--digit-dist))
    );
    filter: blur(var(--digit-blur));
  }
}

.t-digit {
  display: inline-block;
  animation: digit-enter var(--digit-dur) var(--digit-ease) both;
}
.t-digit[data-stagger="1"] { animation-delay: var(--digit-stagger); }
.t-digit[data-stagger="2"] { animation-delay: calc(var(--digit-stagger) * 2); }

@media (prefers-reduced-motion: reduce) {
  .t-digit { animation: none; }
}
```

**JS, replay on update:**

```js
function updateDigits(container, newValue) {
  container.classList.remove("is-animating");
  container.innerHTML = String(newValue)
    .split("")
    .map((d, i, arr) => {
      const stagger = i >= arr.length - 2 ? ` data-stagger="${arr.length - 1 - i}"` : "";
      return `<span class="t-digit"${stagger}>${d}</span>`;
    })
    .join("");
  void container.offsetWidth; // force reflow
  container.classList.add("is-animating");
}
```

---

## Avatar group hover

Distance-falloff lift on a horizontal stack of items. The hovered item lifts and scales; neighbors lift with decreasing intensity. Bouncy spring on mouse leave.

```html
<div class="t-avatar-group">
  <div class="t-avatar">A</div>
  <div class="t-avatar">B</div>
  <div class="t-avatar">C</div>
</div>
```

```css
.t-avatar-group {
  display: flex;
  gap: 4px;
}
.t-avatar {
  transition: transform var(--avatar-dur) var(--avatar-ease-in);
}

@media (prefers-reduced-motion: reduce) {
  .t-avatar { transition: none; }
}
```

**JS, distance-based lift:**

Set `transition-timing-function` inline *before* writing CSS variables. The browser uses whatever timing function is current when the property changes; this enables smooth ease-in on hover and bouncy ease-out on return without separate declarations.

```js
const group = document.querySelector(".t-avatar-group");
const items = [...group.querySelectorAll(".t-avatar")];
const lift = parseFloat(getComputedStyle(group).getPropertyValue("--avatar-lift"));
const scale = parseFloat(getComputedStyle(group).getPropertyValue("--avatar-scale"));
const falloff = parseFloat(getComputedStyle(group).getPropertyValue("--avatar-falloff"));

group.addEventListener("mouseenter", (e) => {
  const target = e.target.closest(".t-avatar");
  if (!target) return;
  const idx = items.indexOf(target);
  items.forEach((item, i) => {
    const dist = Math.abs(i - idx);
    item.style.transitionTimingFunction = "var(--avatar-ease-in)";
    if (dist === 0) {
      item.style.transform = `translateY(${lift}px) scale(${scale})`;
    } else {
      const y = lift * Math.pow(falloff, dist);
      item.style.transform = `translateY(${y}px)`;
    }
  });
}, true);

group.addEventListener("mouseleave", () => {
  items.forEach((item) => {
    item.style.transitionTimingFunction = "var(--avatar-ease-out)";
    item.style.transform = "";
  });
});
```

---

## Success celebration

Multi-layered success animation combining fade, rotation, blur reduction, Y-axis bob with overshoot, and optional SVG stroke drawing. Toggle `data-state` to `"in"`.

```html
<div class="t-success" data-state="out">
  <svg><path class="t-success-path" d="..." /></svg>
</div>
```

```css
.t-success {
  opacity: 0;
  transform: rotate(var(--success-rotate-from)) translateY(var(--success-bob-y));
  filter: blur(var(--success-blur-from));
}

@keyframes success-in {
  0% {
    opacity: 0;
    transform: rotate(var(--success-rotate-from)) translateY(var(--success-bob-y));
    filter: blur(var(--success-blur-from));
  }
  100% {
    opacity: 1;
    transform: rotate(var(--success-rotate-to)) translateY(0);
    filter: blur(0);
  }
}

.t-success[data-state="in"] {
  animation: success-in var(--success-opacity-dur) var(--success-ease) forwards;
}

.t-success-path {
  stroke-dashoffset: var(--path-length);
  stroke-dasharray: var(--path-length);
  transition: stroke-dashoffset var(--success-path-dur) var(--success-ease);
  transition-delay: var(--success-path-delay);
}
.t-success[data-state="in"] .t-success-path {
  stroke-dashoffset: 0;
}

@media (prefers-reduced-motion: reduce) {
  .t-success { animation: none; opacity: 1; transform: none; filter: none; }
  .t-success-path { transition: none; stroke-dashoffset: 0; }
}
```

**JS, set path length and replay:**

Never hardcode `stroke-dasharray`. Use `getTotalLength()` to measure the actual path.

```js
function playSuccess(el) {
  const path = el.querySelector(".t-success-path");
  if (path) {
    const len = path.getTotalLength();
    el.style.setProperty("--path-length", len);
  }
  el.setAttribute("data-state", "out");
  void el.offsetWidth; // force reflow to restart keyframes
  el.setAttribute("data-state", "in");
}
```

---

## Error state shake

Per-segment shake keyframe with auto-reverting error border. Three classes manage the lifecycle: `.is-error` on wrapper and input, `.is-shaking` on input only.

```html
<div class="t-error-wrap">
  <input class="t-error-input" />
  <p class="t-error-msg">Invalid email</p>
</div>
```

```css
@keyframes shake {
  0%   { transform: translateX(0); }
  25%  { transform: translateX(var(--shake-dist)); }
  50%  { transform: translateX(calc(-1 * var(--shake-overshoot))); }
  75%  { transform: translateX(calc(var(--shake-dist) * 0.5)); }
  100% { transform: translateX(0); }
}

.t-error-input {
  transition: border-color var(--shake-revert-dur) ease;
}
.t-error-input.is-error {
  border-color: var(--color-error, #ef4444);
}
.t-error-input.is-shaking {
  animation: shake
    calc(var(--shake-dur-1) + var(--shake-dur-2) + var(--shake-dur-3))
    var(--shake-ease);
}

.t-error-msg {
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 150ms ease, transform 150ms ease;
}
.t-error-wrap.is-error .t-error-msg {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .t-error-input { animation: none; }
  .t-error-msg { transition: none; }
}
```

**JS, trigger and auto-revert:**

Keep `.is-error` and `.is-shaking` as separate classes. `.is-shaking` controls only the shake animation and is removed on `animationend`. `.is-error` controls the border colour and message visibility, and auto-reverts after the hold duration.

```js
function triggerError(wrap, input) {
  wrap.classList.add("is-error");
  input.classList.add("is-error", "is-shaking");

  input.addEventListener("animationend", () => {
    input.classList.remove("is-shaking");
  }, { once: true });

  const hold = parseFloat(getComputedStyle(wrap).getPropertyValue("--shake-hold"));
  setTimeout(() => {
    wrap.classList.remove("is-error");
    input.classList.remove("is-error");
  }, hold);
}
```
