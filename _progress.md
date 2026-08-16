 
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
