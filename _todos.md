## Done

[x] 2026-08-17 — Verify site renders cleanly and meets requirements: `quarto render` exits 0 with no errors/warnings; index grid renders 4 cells as direct children of `.grid-menu` (Davis Station→directions, Hyatt→accommodations, Routemaster→local, Vines Tower→schedule); credit note intact; Yellowtail + Josefin Sans fonts confirmed compiled into Bootstrap bundle; dark-mode present; all 8 referenced images exist; home links point to `index.html`.

[x] 2026-08-17 — Grid menu: made cells/labels discoverable on touch + keyboard in `css/gridmenu.css`. `@media (hover: none)` keeps all four labels visible at all times on phones/tablets (which have no `:hover`); `:focus`/`:focus-within`/`:active` reveal a label on Tab or the instant of a tap. Applied to both the image-brighten and the `.label` opacity rules. Verified `quarto render` exits 0 and the rules propagated to `docs/css/gridmenu.css`.

## To Do

- Grid-menu small-screen *layout* decision: on narrow phones the fixed 2×2 grid (`width: min(100%, 600px)`, `aspect-ratio: 1/1`) still shows two columns of small squares, each label at `font-size: 2em`. Options: stack to one column below ~600px, or enlarge cells. Label *discoverability* is already solved (above); this remaining item is a layout/aesthetic call that touches the "equally accessible on mobile" requirement and should be confirmed with the user rather than assumed.
