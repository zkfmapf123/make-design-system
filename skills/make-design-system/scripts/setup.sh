#!/usr/bin/env bash
# One-time setup: installs puppeteer + sharp (and a browser) into this folder only.
set -euo pipefail
cd "$(dirname "$0")"

major=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)
if [ "$major" -lt 18 ]; then
  echo "ERROR: Node 18+ required (found $(node -v 2>/dev/null || echo none))" >&2
  exit 1
fi

if [ -d node_modules/puppeteer ] && [ -d node_modules/sharp ] && [ -d .cache/puppeteer ]; then
  echo "ready"
  exit 0
fi

echo "Installing puppeteer + sharp into $(pwd) (first run downloads a ~200MB headless browser)..."
npm install --no-audit --no-fund --loglevel=error
echo "ready"
