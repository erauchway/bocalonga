 
## 2026-08-01 Progress
- Fixed `_quarto.yml`: switched from `closeread-html` to standard `html`/`website` format
- Fixed `theme/custom.scss`: Josefin Sans for body text, Yellowtail for h1 headers, added `prefers-color-scheme: dark` media query for dark mode
- Fixed `index.qmd`: added Google Fonts `<link>` tags for Josefin Sans and Yellowtail (the closeread extension doesn't use Quarto's `sansfont` mechanism, so the fonts were never loaded)
- Created `confindex.qmd`: single title-block header, responsive 2×2 image grid with dim-on-default / brighten-on-hover effect, label overlay on hover, credit note at bottom
- Created `directions.qmd` and `accommodations.qmd`: placeholder pages with title header and empty body
- Added rendering instructions to `project.md`
## 2026-08-04 Progress
- Updated `confindex.qmd` credit note to fully match `text/thanks.md`, including "the Office of the Provost" at U.C. Davis
- Populated `directions.qmd` with complete content from `text/directions.md` (replaced placeholder)
- All figures must be coded using Quarto-native lightbox syntax: ![caption](../images/file.png){width=XX% fig-align="center" fig-alt="..." .lightbox}
- Fixed `theme/custom.scss`: dark-mode media query now uses correct GLightbox v3 selectors (`gslide-description`, `.gslide-title`, `.gslide-desc`) instead of non-existent `.lightbox-lightbox` classes; sets custom CSS variables so the caption bar shows white text on a black background instead of white on white  
- Restored site-wide dark mode by correctly overriding `--quarto-body-bg` and other color variables inside `prefers-color-scheme: dark`
## 2026-08-05 Progress
- Refactored `confindex.qmd` to clean Quarto: removed all inline `<style>` blocks, moved every CSS rule into external `css/gridmenu.css`
- Added `css/gridmenu.css` to the `_quarto.yml` project CSS reference so it loads on every page
- Wrote comprehensive reset rules in `css/gridmenu.css`: zeroed Pandoc/Bootstrap margin and padding leaks on `<img>` and `<a>` elements, added critical `!important` guards for vertical-align, border, padding, and margin to prevent grid cell gaps
- Verified clean build: `quarto render` exits with code 0, zero errors, zero warnings across all 6 source files

## 2026-08-07 Progress
- Revised `index.qmd`: wrapped "BoCa LonGa 8" title text in `<div class="centered-title">` with CSS that centers it (`.centered-title { text-align: center; }`). This ensures the title is visually centered above the chevron scroll indicators. Also added explicit CSS for `#chevron-canvas` to guarantee block display and auto-centering.
- Reverted `index.qmd`: removed `font-family: "Yellowtail", cursive !important` from `.centered-title` so "BoCa LonGa 8" renders in the page's default sansfont (Josefin Sans), keeping the centering intact.

## 2026-08-1X Progress
- Fixed render error in `index.qmd`: stripped stray closeread cross-reference markers (`[@cr-route-master]{scale-by="1.25"}`, `[@cr-tower]{scale-by="1.25"}`) from plain `<div class="centered-title">` blocks on lines 52 and 65. These appeared as literal text ("Davis, California@cr-route-master") because Pandoc only processes them inside `:::` fenced closeread blocks, not in raw HTML divs.
## 2026-08-14 Progress
- Verified that sub-pages (`accommodations.qmd` and `directions.qmd`) already have a "← Home" link back to the homepage (`confindex.html`) in their page-nav div, and site renders cleanly. No changes needed.

## 2026-08-07 Progress (continued)
- Populated `accommodations.qmd` with full content from `text/accommodations.md`, replacing the placeholder comment
## 2026-08-XX Progress (continued)
- Added "← Home" navigation link at the bottom of each sub-page (`accommodations.qmd` and `directions.qmd`) to complement the existing top-of-page home link; both now feature `<div class="page-nav"><p><a href="confindex.html">← Home</a></p></div>`
- Verified clean render: `quarto render` exits with code 0, zero errors or warnings
## 2026-08-XX Progress (maps)
- Fixed MapLibre maps on both sub-pages: replaced broken `:::{head.html}` / `:::{html}` fenced blocks with native Quarto HTML/JS that renders as an interactive map instead of literal text
- Added `css:` YAML header to both `accommodations.qmd` and `directions.qmd` referencing `maplibre-gl.css`, then used a standalone `<script src="...">` tag for the JS library
- Both maps show Hyatt Place Sacramento / UC Davis (center: [-121.792, 38.546], zoom: 16) from OpenFreeMap's "liberty" tile style with a marker popup showing hotel name and booking link
- Updated both maps' coordinates to the correct hyatt location: center `[-121.74629413141759, 38.53559779549776]`, zoom 16

## 2026-08-17 Progress
- Fixed the grid menu not rendering in `confindex.qmd`: the block-level grid markup was being parsed as Markdown, so Pandoc wrapped all four `<a>` cells inside a single `<p>` element, collapsing the 2×2 CSS grid into one block. Wrapped the grid markup (and its `<!-- Main menu grid -->` comment) in a Pandoc raw HTML fence (`` `{=html} ... ` ``) so the four `<a>` cells pass through verbatim as direct children of `<div class="grid-menu">`. Verified `quarto render` exits 0 with no errors and the rendered `docs/confindex.html` now contains the four cells as direct children of `.grid-menu`.
- Changed the "With thanks" credit note to left-justified: set `text-align: left;` on `.grid-credit` in `css/gridmenu.css` (was `center`). Verified re-render and confirmed `docs/css/gridmenu.css` picked up the change; `.grid-credit` only appears on `confindex.html`.

## 2026-08-17 Progress (schedule calendar)
- Built a two-day conference calendar grid in `schedule.qmd`. Structure decision: because the two days have *different* time boundaries and a different number of sessions (Fri 11 sessions incl. 7:30pm dinner; Sat 9 sessions ending 6:00pm), a single shared "time-as-rows" column would force ragged artificial rows. Instead used a CSS grid wrapper (`.conf-calendar`, two columns) with one self-contained day per column (`.conf-day`, heading + `.conf-slots` table), stacking to one column on phones via `@media (max-width: 600px)`. No JS, no CDN.
- Each day is a semantic HTML table: time in the left column as `<th scope="row">`, event in the right column as `<td>` — the accessible "clean calendar" choice over styled divs. Built with placeholder events from `text/placeholder.md` (not `text/schedule.md`, which only holds the intro prose).
- Added a `format: html: css: css/schedule.css` YAML header to `schedule.qmd` to load the new stylesheet. Confirmed `css:` is *additive* (verified `directions.html` loads both project-level `css/custom.css` and page-level MapLibre CSS), so the dark-mode fonts/colors from `custom.scss` persist on `schedule.qmd`.
- New `css/schedule.css` (external, matching the `gridmenu.css` pattern). Added a `background-color: transparent` override on `.conf-slots th/td` plus a fixed grey `rgba(128,128,128,0.35)` separator: Quarto still runs its table post-processing on the raw-fenced tables (injects `tbody`, `odd`/`even` row classes, the Bootstrap `table` class, and `data-quarto-table-cell-role` on each `<th>`), so the override guards against Bootstrap table theming clashing with the clean design in dark mode. `scope="row"` survives intact.
- Kept the user's original "post a detailed schedule when we have one" prose above the new grid. Verified `quarto render` exits 0 with no errors and `docs/schedule.html` links both `css/custom.css` and `css/schedule.css` (loaded first, then `schedule.css`) with all events and en-dash time ranges intact.
- Checked off "Add calendar grid to `schedule.qmd`" in `_todos.md`.
## 2026-08-17 Progress (schedule calendar — narrow-window column fix)
- Fixed the narrow-window column collision in `css/schedule.css` where the event text (e.g. "Coffee") overwrote the time text (e.g. "11:00am") when the window was narrowed on desktop or on mobile.
- Root causes: (1) `.conf-slots th` used `width: 8.5em`, slightly narrower than the longest time ranges ("11:00am–12:30pm"); (2) `white-space: nowrap` forced that text onto one line, so it overflowed its cell rightward; (3) with `table-layout: fixed` the event `<td>` starts at the time column's edge, so the two columns' text shared the same x-region → overwrite. The `@media (max-width: 600px)` block made mobile worst by *shrinking* the time column to `6.5em` when the day is already full-width.
- Changes to `css/schedule.css`: time column `.conf-slots th` switched from `width: 8.5em` + `white-space: nowrap` to `width: 40%` + `white-space: normal` + `overflow-wrap: anywhere` (a long range now wraps inside its own cell instead of spilling into the event column); event `.conf-slots td` gained `padding-left: 0.75em` (a visible gutter so the two columns are visually distinct) and `overflow-wrap: anywhere` (long titles stay in their own column); removed the `@media (max-width: 600px)` `width: 6.5em` shrink entirely (each stacked day already gets full width, so 40% is generous). File was rewritten in full to clean up inconsistent whitespace.
- Verified `quarto render` exits 0 with no errors; confirmed `docs/css/schedule.css` picked up `white-space: normal`, `overflow-wrap: anywhere`, `width: 40%` and that the old `6.5em` override is gone; `docs/schedule.html` still links `css/schedule.css`.
## 2026-08-17
- added CNAME
- changed home links to `index.html`
- changed `confindex.html` to `index.html`
## 2026-08-17 Progress (grid menu — mobile/touch accessibility)
- Re-verified the whole site: `quarto render` exits 0 with no errors/warnings; confirmed the index grid renders four `<a>` cells as direct children of `.grid-menu` (the earlier "cells collapsed into one `<p>`" bug stays fixed), credit note intact, fonts compiled, dark-mode present.
- Addressed the flagged to-do "make the grid menu accessible on mobile." Root problem: cell labels were `opacity:0` and revealed only via `:hover`, so touch devices (no hover) showed a dim 2×2 grid with no way to discover what each square links to.
- Fixed in `css/gridmenu.css`: (1) extended the label- and image-reveal selectors to include `:focus`, `:focus-within`, and `:active`, so a keyboard/screen-reader user Tabs to a square and a label appears on tap; (2) added `@media (hover: none) { .grid-menu .label { opacity: 1; } }` so phones/tablets keep all four labels visible at all times.
- Verified `quarto render` exits 0 and the new rules propagated to `docs/css/gridmenu.css`.
- Left as an open, user-facing decision in `_todos.md`: the small-screen *layout* (fixed 2×2 with `aspect-ratio: 1/1` and `width: min(100%, 600px)`) still shows two columns of small squares on phones — whether to stack to one column or enlarge cells below ~600px. Not assumed; flagged for the user since it affects the "equally accessible on mobile" requirement and is a layout/aesthetic choice.
