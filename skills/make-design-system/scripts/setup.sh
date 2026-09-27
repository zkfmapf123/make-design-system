#!/usr/bin/env bash
# One-time setup: installs puppeteer + sharp (and a browser) into this folder only.
set -euo pipefail
cd "$(dirname "$0")"

major=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)
if [ "$major" -lt 18 ]; then
  echo "ERROR: Node 18+ required (found $(node -v 2>/dev/null || echo none))" >&2
  exit 1
fi

# Pin the browser cache to this folder. .puppeteerrc.cjs alone is not enough:
# puppeteer resolves it from the CURRENT WORKING DIRECTORY, so a later `node bds.mjs`
# run from a user's project would look in ~/.cache/puppeteer and find nothing.
export PUPPETEER_CACHE_DIR="$PWD/.cache/puppeteer"

have_browser() {
  [ -n "$(find .cache/puppeteer -maxdepth 3 -name 'chrome-headless-shell*' -print -quit 2>/dev/null)" ]
}

if [ ! -d node_modules/puppeteer ] || [ ! -d node_modules/sharp ]; then
  echo "Installing puppeteer + sharp into $(pwd) (first run downloads a ~200MB headless browser)..."
  npm install --no-audit --no-fund --loglevel=error
fi

# npm install does not always land the binary (postinstall skipped, cache moved, partial install).
# Verify the executable exists and fetch it explicitly if it does not.
if ! have_browser; then
  echo "Browser binary missing — installing chrome-headless-shell..."
  npx --yes puppeteer browsers install chrome-headless-shell
fi

if ! have_browser; then
  echo "ERROR: chrome-headless-shell still missing under $PUPPETEER_CACHE_DIR" >&2
  exit 1
fi

echo "ready"
