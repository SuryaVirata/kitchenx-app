#!/bin/bash
set -euo pipefail
export PATH="/home/surya/.nvm/versions/node/v22.23.3/bin:$PATH"
cd /home/surya/dev/kitchenx-app/apps/admin
exec pnpm exec expo start --port 8082 --clear
