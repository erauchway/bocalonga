# Mobile test tooling for BoCa LonGa 2027

Simulated mobile phone testing for the rendered site in `../docs`.
These tools do **not** generate site content — they only measure it.

## What each tool does

| Tool | What it answers | Command |
|------|-----------------|---------|
| `run-mobile-tests.sh` | "Does the site load and lay out correctly on phones, in day & night?" One shot. | `./tooling/run-mobile-tests.sh` |
| `mobile-test.mjs` | The Playwright pass above, standalone. | `node tooling/mobile-test.mjs [url] [out]` |
| `lh-mobile.sh` | Real Core Web Vitals (LCP/CLS/TBT) via Lighthouse in a mobile profile. | `./tooling/lh-mobile.sh [url]` |
| `serve.sh` | Serve `docs/` on `:8080` so you can open it in a real browser. | `./tooling/serve.sh` |

## Setup (once)

```
cd tooling
npm install                # installs playwright + lighthouse (already done)
npx playwright install chromium   # download the Chromium binary (already done)
```

The Playwright pass runs headless Chromium from the machine cache; no system
browser required. `lh-mobile.sh` also uses that Chromium binary.

## Quick start

Rebuild the site first (per project convention):

```
quarto render
./tooling/run-mobile-tests.sh
cat tooling/results/summary.txt
```

For Core Web Vitals:

```
quarto render
./tooling/lh-mobile.sh
ls tooling/results/lh/reports/
```

## What the Playwright pass checks

For **each page × device × mode** (pages: `index, accommodations, directions,
local, schedule, teaser_index`; devices: iPhone 13, iPhone SE, Pixel 7,
landscape Tablet; modes: day `light`, night `dark`):

- **Perf:** FCP, LCP, full-load time. Warnings if FCP > 2000 ms or LCP > 2500 ms
  (tune in `BUDGET` at the top of `mobile-test.mjs`).
- **Errors:** console errors, uncaught page errors, and HTTP 4xx/5xx responses
  (catches broken image links, missing `site_libs`, etc.).
- **Grid menu on `index.html`:**
  - are all 4 labels *revealed* on a touch-only narrow viewport
    (opacity > 0.5)? If not → hard failure — this is the "hover doesn't exist on
     a phone" case.
  - are images un-dimmed (`brightness` near 100 %) on narrow viewports?
  - does any label overflow its cell horizontally?
- **Screenshot:** a full-page PNG per combination, in
  `tooling/results/screenshots/`, so you can eyeball day/night on each device.

## Outputs

- `tooling/results/summary.txt` — human-readable one-line-per-combination.
- `tooling/results/summary.json` — machine-readable (same data + metrics).
- `tooling/results/screenshots/*.png` — per device × mode.
- `tooling/results/lh/reports/*.json` — Lighthouse reports (run `lh-mobile.sh`).

## Why not just open it in Chrome DevTools?

DevTools responsive mode reports `(hover: hover)` and can report the *desktop*
`prefers-color-scheme`, so it silently hides two of the real risks on this site:
the touch-only hover case and the day/night theme. These tools force
`(prefers-color-scheme: light|dark)` and a real phone viewport, so they catch
what DevTools emulation can miss.

## Adding a device or page

Edit `DEVICES` / `PAGES` near the top of `mobile-test.mjs` (device names must
match Playwright's built-in device table — run
`npx playwright --show` / check
`node_modules/playwright/core/lib/server/deviceDescriptors.js` for the list).
