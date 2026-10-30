// A matching multi-color set for icon accents (see index.css for the OKLCH
// recipe). Cycle through these by index rather than hand-picking a hue per
// item, so the same color always maps to the same position across sections.
export const CHIPS = [
  "var(--chip-1)",
  "var(--chip-2)",
  "var(--chip-3)",
  "var(--chip-4)",
  "var(--chip-5)",
  "var(--chip-6)",
];

export function chipColor(index) {
  return CHIPS[index % CHIPS.length];
}
