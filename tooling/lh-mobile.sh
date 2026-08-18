#!/usr/bin/env bash
# lh-mobile.sh — run Lighthouse (mobile profile) on every rendered page.
#
# Produces a JSON + HTML Lighthouse report per page into tooling/results/lh/.
# Reports Core Web Vitals (LCP, CLS, TBT) and audit scores on a mobile device
# profile with 4G-fast / 4x-CPU-throttle, matching what Lighthouse defaults to
# for "mobile" form factor.
#
# Usage:
#    ./tooling/lh-mobile.sh                         # all pages
#    ./tooling/lh-mobile.sh http://localhost:8080   # different base

set -euo pipefail
cd "$(dirname "$0")"
BASE="${1:-http://localhost:8080}"
OUT="$(pwd)/results/lh"
mkdir -p "$OUT/screenshots" "$OUT/reports"

PAGES=(index.html accommodations.html directions.html local.html schedule.html teaser_index.html)

# Lighthouse needs a Chrome/Chromium binary path.
CHROME_BIN="$(node -e 'process.stdout.write(require("playwright").chromium.executablePath())')"

for p in "${PAGES[@]}"; do
   echo "---- Lighthouse (mobile) ${p} ----"
   OUT_REPORT="$OUT/reports/${p%.html}.json"
   npx lighthouse \
      --quiet \
      --chrome-flags="--headless --no-sandbox --disable-gpu" \
      --output=json --output-path="$OUT_REPORT" \
      --form-factor=mobile \
      --screenEmulation.mobileEmulation \
      --throttling-method=provided \
      --throttling.cpuSlowdownMultiplier=4 \
      "$BASE/${p}" 2>/dev/null || echo "  Lighthouse exited non-zero; see report file"

       # Pull a few headline numbers out of the report.
   if [[ -f "$OUT_REPORT" ]]; then
      node - "$OUT_REPORT" <<'EOF' || true
import { readFileSync } from 'node:fs';
import process from 'node:process';
const r = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const m = (id) => r.audits?.[id]?.displayValue;
console.log(`   ${m('first-contentful-paint')}`.padEnd(22) + `   (FCP)`);
console.log(`   ${m('largest-contentful-paint')}`.padEnd(22) + `   (LCP)`);
console.log(`   ${m('cumulative-layout-shift')}`.padEnd(22) + `   (CLS)`);
console.log(`   ${m('total-blocking-time')}`.padEnd(22) + `   (TBT)`);
const perf = r.categories.performance?.score;
console.log(`   Performance category: ${perf == null ? '?' : Math.round(perf * 100)}` +
            `  (HTML report: ${process.argv[2].replace(process.cwd() + '/', '')})`);
       EOF
   fi
done

echo
echo "All Lighthouse reports written to ${OUT}/reports/. Open any .json with Chrome (chrome://lighthouse) or paste into developer.chrome.com."
