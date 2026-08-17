## Done

[x] 2026-08-17 — Verify site renders cleanly and meets requirements: `quarto render` exits 0 with no errors/warnings; index grid renders 4 cells as direct children of `.grid-menu` (Davis Station→directions, Hyatt→accommodations, Routemaster→local, Vines Tower→schedule); credit note intact; Yellowtail + Josefin Sans fonts confirmed compiled into Bootstrap bundle; dark-mode present; all 8 referenced images exist; home links point to `index.html`.

## To Do

- [x] 2026-08-17 — Grid menu: made cells/labels discoverable on touch + keyboard (`@media (hover: none)` keeps labels visible on phones; `:focus`/`:focus-within`/`:active` reveal them on Tab or tap).
  - It is currently a fixed 2×2 grid with `aspect-ratio: 1/1` and no `@media` query, so it just shrinks on narrow screens.
  - **Key issue:** cell labels are `opacity:0` and revealed only via `:hover` — touch devices have no hover, so a phone visitor sees a dim 2×2 and cannot tell what any square links to. Needs a touch-friendly way to reveal labels (e.g. tap/click, always-visible on small screens, or a focus/active state) plus a sensible small-screen layout (stack to one column or enlarge cells). Affects the "equally accessible on mobile" requirement.
