// verify.mjs — full verification of the mobile grid menu.
// For each phone device x (light,dark):
//  - page horizontal overflow (document scrollWidth vs clientWidth + per-element)
//  - label clipping (against parent <a> box — the REAL test the old harness missed)
//  - label legibility (computed font-size in px, and cell hit-box >= 44px)
//  - image brightness on mobile (should be 100%)
//  - whether each of the 4 labels fits its cell without vertical overflow
// Usage: node verify.mjs [base-url]
import { devices, chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:9091'
const DEVS = ['iPhone SE', 'iPhone 13', 'Pixel 7']

async function main() {
  const b = await chromium.launch({ headless: true })
  let anyFail = false
  for (const dn of DEVS) {
    for (const mode of ['light', 'dark']) {
      const ctx = await b.newContext({ ...devices[dn], colorScheme: mode })
      const p = await ctx.newPage()
      await p.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' })
      const r = await p.evaluate(() => {
        const doc = document.documentElement
        const pageOver = doc.scrollWidth - doc.clientWidth
        // which top-level elements cause horizontal overflow?
        const wide = [...document.querySelectorAll('body *')]
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .slice(0, 6)
          .map((el) => `${el.tagName}.${el.className || ''}:${el.scrollWidth}/${el.clientWidth}`)
        const cells = [...document.querySelectorAll('.grid-menu a')]
        const labels = [...document.querySelectorAll('.grid-menu .label')]
        const img = document.querySelector('.grid-menu img')
        const m = /brightness\(([\d.]+)(%?)\)/.exec(getComputedStyle(img).filter || '')
        const bright = m ? (m[2] ? Math.round(parseFloat(m[1])) : Math.round(parseFloat(m[1]) * 100)) : 'n/a'
        // real clip test: does any label's content exceed its PARENT cell box?
        const clipped = labels.map((l) => {
          const cell = l.parentElement.getBoundingClientRect()
          const lb = l.getBoundingClientRect()
          return {
            txt: l.textContent,
            cellW: Math.round(cell.width),
            cellH: Math.round(cell.height),
            labelW: Math.round(l.scrollWidth),
            labelH: Math.round(lb.height),
            fs: Math.round(parseFloat(getComputedStyle(l).fontSize)),
            clipH: l.scrollWidth > cell.width + 1,
            clipV: lb.height > cell.height + 1,
            shown: parseFloat(getComputedStyle(l).opacity) > 0.5,
            hit: Math.round(cell.width) + 'x' + Math.round(cell.height),
             }
         })
         return {
          viewport: window.innerWidth,
          pageOver,
          wide,
          bright,
          cells: cells.length,
          clipped,
          }
        })
      const fails = []
      if (r.pageOver > 1) fails.push(`PAGE scrolls sideways +${r.pageOver}px ${r.wide.join(', ')}`)
      for (const c of r.clipped) {
        if (c.clipH) fails.push(`H-clip "${c.txt}" ${c.labelW}px in ${c.cellW}px cell`)
        if (c.clipV) fails.push(`V-clip "${c.txt}" ${c.labelH}px in ${c.cellH}px cell`)
        if (!c.shown) fails.push(`"${c.txt}" not shown`)
        if (c.cellW < 44 || c.cellH < 44) fails.push(`"${c.txt}" tiny hit ${c.hit}`)
        }
      const ok = fails.length === 0
      if (!ok) anyFail = true
      console.log(`[${ok ? 'PASS' : 'FAIL'}] ${dn.padEnd(10)} ${mode.padEnd(5)} vp=${r.viewport}px bright=${r.bright}% cells=${r.cells}`)
      r.clipped.forEach((c) =>
        console.log(
        `         ${c.txt.padEnd(16)} cell ${c.cellW}x${c.cellH}px font ${c.fs}px ` +
        `${c.clipH ? 'CLIP-H' : ''}${c.clipV ? 'CLIP-V' : ''} ${c.shown ? 'shown' : 'HIDDEN'}.`))
      fails.forEach((f) => console.log(`         -> ${f}`))
      await ctx.close()
       }
    }
  await b.close()
  console.log(anyFail ? '\nRESULT: FAILURES PRESENT' : '\nRESULT: ALL PASS')
  process.exit(anyFail ? 1 : 0)
}
main().catch((e) => { console.error(e); process.exit(2) })
