#!/usr/bin/env bash
# run-mobile-tests.sh — one-shot: serve docs, then run both test passes.
#
# 1. Start a static HTTP server on docs/ (so tests load over HTTP, not file://).
# 2. Wait until it is reachable.
# 3. Run the Playwright simulated-phone pass (layout + perf + errors + screenshots).
# 4. Stop the server.
#
# Usage:
#     ./tooling/run-mobile-tests.sh
#     ./tooling/run-mobile-tests.sh 9000     # override port
#
# Outputs:
#   tooling/results/summary.txt | summary.json   (from the Playwright pass)
#   tooling/results/screenshots/*.png            (day/night, per device)
#
# Lighthouse needs a real Chrome/Chromium binary; run ./tooling/lh-mobile.sh
# separately (see tooling/README.md) — it is heavier and optional.

set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
PORT="${1:-8080}"
BASE="http://localhost:${PORT}"

# Start the server detached, capture its PID.
python3 -m http.server "${PORT}" --directory docs >/tmp/bocalonga-serve.log 2>&1 &
SERVER_PID=$!
trap 'kill ${SERVER_PID} 2>/dev/null || true' EXIT

# Wait for it to accept connections.
for i in $(seq 1 20); do
   if curl -fs "${BASE}/index.html" >/dev/null 2>&1; then break; fi
   sleep 0.25
done

echo "Serving ${ROOT}/docs/ at ${BASE} (pid ${SERVER_PID})"
echo
echo "########## Playwright mobile pass ##########"
node tooling/mobile-test.mjs "${BASE}" tooling/results
RC=$?
exit ${RC}
