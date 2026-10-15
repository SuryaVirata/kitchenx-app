#!/usr/bin/env bash
set -u

cd "$(dirname "$0")" || exit 1

echo
echo "Starting KitchenX customer web dev server..."
echo "Keep this terminal open. Code changes will auto-refresh in the browser."
echo "Press Ctrl+C or close this terminal to stop the app."
echo

export CHOKIDAR_USEPOLLING=1
export WATCHPACK_POLLING=true
export FAST_REFRESH=true

corepack pnpm --filter @kitchenx/customer web
