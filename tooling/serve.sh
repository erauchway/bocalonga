#!/usr/bin/env bash
# serve.sh — serve the rendered docs/ folder on http://localhost:8080
#
# Serves a static site so you (and the test scripts) can load it in a real
# browser context instead of file:// — which matters for fetch, relative URLs,
# fonts, and performance metrics that behave differently over file://.
#
# Usage:
#   ./tooling/serve.sh                 # serve docs/ on :8080
#   PORT=9000 ./tooling/serve.sh       # different port
#
# Uses Python 3's built-in http.server (no dependency). Ctrl-C to stop.

set -euo pipefail
cd "$(dirname "$0")/.."     # project root
PORT="${PORT:-8080}"

echo "Serving $(pwd)/docs/ at http://localhost:${PORT}/"
echo "(Ctrl-C to stop)"
exec python3 -m http.server ${PORT} --directory docs
