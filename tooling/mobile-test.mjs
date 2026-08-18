// mobile-test.mjs
//
// Simulated mobile performance + layout test for the BoCa LonGa 2027 site.
//
// Loads every rendered page on several phone/tablet viewports, in BOTH day
// ("light") and night ("dark") mode, and reports:
//      - performance: FCP, LCP, full-load time
//      - a page-load "budget" check (WARN if FCP/LCP exceed sensible limits)
//      - console errors, page errors, and failed/high-status requests
//      - grid-menu behavior on index: labels revealed on touch (opacity > 0.5)
//        and images un-dimmed on narrow screens?
//
// Usage:
//      node mobile-test.mjs [base-url] [out-dir]
//      e.g.  node mobile-test.mjs http://localhost:8080 tooling/results
// (start a server first, e.g.  ./tooling/serve.sh , or use run-mobile-tests.sh)
//
// Outputs into <out-dir>/: screenshots/, summary.json, summary.txt

import { devices, chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.argv[2] || 'http://localhost:8080'
const OUT   = process.argv[3] || 'tooling/results'
const SHOTS = join(OUT, 'screenshots')
mkdirSync(OUT, { recursive: true })
mkdirSync(SHOTS, { recursive: true })

// Pages that exist in docs/ after a `quarto render`.
const PAGES = [
  'index.html', 'accommodations.html', 'directions.html',
  'local.html', 'schedule.html', 'teaser_index.html',
]

// Device matrix. iPhone 13 is the primary reference; iPhone SE (~375px) and a
// landscape tablet exercise the (max-width:600px) branch and its edge.
const DEVICES = {
  'iPhone 13':  devices['iPhone 13'],
  'iPhone SE':  devices['iPhone SE'],
  'Pixel 7':    devices['Pixel 7'],
  'Tablet-L':   devices['Tablet landscape'],
}

// prefers-color-scheme -> day / night.
const MODES = ['light', 'dark']

// Performance budget for a small static conference site. Reported as WARN,
// not failure -- "should be fine" thresholds, not hard gates.
const BUDGET = { fcp: 2000, lcp: 2500 }

const url = (p) => `${BASE}/${p}`
function fmt(v)  { return v == null ? '  n/a' : `${v}ms`.padStart(8) }
function pad(s, n)   { return (String(s) + ' '.repeat(n)).slice(0, n) }
function short(s, n) { return (s.length > n ? s.slice(0, n - 1) + '\u2026' : s).padEnd(n) }

// Read paint + load metrics synchronously from the Performance API. A single
// synchronous page.evaluate avoids GC-of-promise races that async-in-evaluate
// can trigger in this Playwright/Node build.
function readMetricsExpr() {
  return `(() => {
    const paints = performance.getEntriesByType('paint')
    const fcp = paints.find((e) => e.name === 'first-contentful-paint')
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
    const nav = performance.getEntriesByType('navigation')[0]
    return {
      fcp:  fcp ? Math.round(fcp.startTime) : null,
      lcp:  lcpEntries && lcpEntries.length
           ? Math.round(lcpEntries[lcpEntries.length - 1].startTime) : null,
      load: nav ? Math.round(nav.loadEventEnd) : null,
    }
  })()`
}

async function main() {
  const results = []
  const browser = await chromium.launch({ headless: true })

  for (const pageName of PAGES) {
    for (const mode of MODES) {
      for (const [devName, dev] of Object.entries(DEVICES)) {
        if (!dev) { console.warn(`skip device ${devName}`); continue }
        const key = `${devName}-${mode}`.replace(/\s+/g, '_')
        const entry = {
          page: pageName, device: devName, mode, ok: true,
          warnings: [], errors: [], metrics: null, layout: null, screenshot: null,
        }

        const context = await browser.newContext({
          ...dev,
          colorScheme: mode, // emulate day/night appearance
        })
        const page = await context.newPage()

        // Capture console errors, uncaught page errors, failed/high HTTP responses.
        page.on('console', (msg) => {
          if (msg.type() === 'error') entry.warnings.push(`console: ${msg.text()}`)
        })
        page.on('pageerror', (err) => entry.errors.push(`pageerror: ${err.message}`))
        page.on('requestfailed', (r) =>
          entry.warnings.push(`reqfail: ${r.url()} :: ${r.failure()?.errorText ?? '?'}`))
        page.on('requestfinished', (r) => {
          let st = null
          try {
            const res = r.response && r.response()
            st = res && typeof res.status === 'function' ? res.status() : null
          } catch { st = null }
          if (st && st >= 400) entry.warnings.push(`http${st}: ${r.url()}`)
        })

        // Load with a 404 check.
        let status = null
        try {
          const resp = await page.goto(url(pageName), { waitUntil: 'networkidle', timeout: 20000 })
          status = resp?.status?.() ?? null
        } catch (e) {
          entry.errors.push(`goto failed: ${e.message}`)
          entry.ok = false
        }

        if (status !== null && status >= 400) {
          entry.errors.push(`HTTP ${status} loading ${pageName}`)
          entry.ok = false
        } else {
          // Brief settle, then read metrics synchronously.
          await page.waitForTimeout(600).catch(() => {})
          entry.metrics = await page.evaluate(readMetricsExpr()).catch(() => null)
        }

        // Grid-menu layout checks are only meaningful on the index page.
        if (pageName === 'index.html' && entry.ok) {
          try {
            entry.layout = await page.evaluate(() => {
              const cells  = [...document.querySelectorAll('.grid-menu a')]
              const imgs   = [...document.querySelectorAll('.grid-menu img')]
              const labels = [...document.querySelectorAll('.grid-menu .label')]
              function imgBrightness() {
                if (!imgs.length) return null
                const m = /brightness\(([\d.]+)(%?)\)/.exec(getComputedStyle(imgs[0]).filter || '')
                if (!m) return null
                const raw = parseFloat(m[1])
                return m[2] ? Math.round(raw) : Math.round(raw * 100)
              }
              return {
                viewportWidth: window.innerWidth,
                cellCount:     cells.length,
                imgCount:      imgs.length,
                labelCount:    labels.length,
                labelsShown:   labels.filter((l) =>
                  parseFloat(getComputedStyle(l).opacity) > 0.5).length,
                imgBrightness,
                labelOverflow: labels.some((l) =>
                  l.scrollWidth > l.clientWidth + 1 &&
                  getComputedStyle(l).overflow !== 'visible'),
              }
            })
          } catch (e) {
            entry.warnings.push(`layout eval failed: ${e.message}`)
          }
        }

        // Budget warnings.
        if (entry.metrics) {
          if (entry.metrics.fcp > BUDGET.fcp)
            entry.warnings.push(`FCP ${entry.metrics.fcp}ms > ${BUDGET.fcp}ms budget`)
          if (entry.metrics.lcp > BUDGET.lcp)
            entry.warnings.push(`LCP ${entry.metrics.lcp}ms > ${BUDGET.lcp}ms budget`)
        }
        if (entry.layout) {
          if (entry.layout.labelsShown < entry.layout.labelCount &&
              entry.layout.viewportWidth <= 600) {
            entry.errors.push(
              `labels not revealed on narrow screen ` +
              `(${entry.layout.labelsShown}/${entry.layout.labelCount} shown)`)
            entry.ok = false
          }
          if (entry.layout.labelOverflow)
            entry.warnings.push('a grid label overflows its cell horizontally')
        }

        // Full-page screenshot.
        if (entry.ok) {
          const shot = join(SHOTS, `${pageName}-${key}.png`)
          await page.screenshot({ path: shot, fullPage: true }).catch(() => {})
          entry.screenshot = shot
        }

        await context.close()
        results.push(entry)

        const m = entry.metrics
        const lay = entry.layout
          ? `labels ${entry.layout.labelsShown}/${entry.layout.labelCount} ` +
            `img${entry.layout.imgBrightness}% `
          : ''
        process.stdout.write(
          `[${entry.ok ? 'OK ' : 'ERR'}] ${short(pageName, 16)} ` +
          `${short(devName, 10)} ${pad(mode, 6)} FCP${fmt(m?.fcp)} ` +
          `LCP${fmt(m?.lcp)} ${lay}\n`)
      }
    }
  }

  await browser.close()

  // --- report ---
  const failed = results.filter((r) => !r.ok || r.errors.length)
  writeFileSync(join(OUT, 'summary.json'),
    JSON.stringify({
      base: BASE, budget: BUDGET,
      totals: { ran: results.length, failed: failed.length },
      results,
    }, null, 2))

  const lines = []
  lines.push('BoCa LonGa 2027 \u2014 mobile simulation results')
  lines.push(`base ${BASE}   ran ${results.length}   failed ${failed.length}`)
  lines.push('')
  for (const r of results) {
    lines.push(`${r.ok ? 'OK ' : 'ERR'} ${pad(r.page, 18)} ${r.device} / ${r.mode}`)
    if (r.metrics)
      lines.push(`   FCP ${fmt(r.metrics.fcp)}  LCP ${fmt(r.metrics.lcp)}  load ${fmt(r.metrics.load)}`)
    if (r.layout)
      lines.push(`   layout: ${r.layout.cellCount} cells, ${r.layout.imgCount} imgs, ` +
        `labels ${r.layout.labelsShown}/${r.layout.labelCount} shown, ` +
        `img ${r.layout.imgBrightness}%, overflow=${r.layout.labelOverflow}, ` +
        `viewport ${r.layout.viewportWidth}px`)
    if (r.errors.length)   r.errors.forEach((e) => lines.push(`    ERROR   ${e}`))
    if (r.warnings.length) r.warnings.forEach((w) => lines.push(`    warn    ${w}`))
  }
  writeFileSync(join(OUT, 'summary.txt'), lines.join('\n') + '\n')

  console.log('\n--- summary ---\n' + lines.join('\n'))
  console.log(`\nscreenshots: ${SHOTS}`)
  console.log(`json: ${join(OUT, 'summary.json')}   text: ${join(OUT, 'summary.txt')}`)
  process.exit(failed.length ? 1 : 0)
}

main().catch((e) => { console.error('fatal:', e); process.exit(2) })
