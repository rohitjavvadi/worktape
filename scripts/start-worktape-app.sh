#!/bin/zsh
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

cd "/Users/rohitjavvadi/Documents/worktape"
mkdir -p /tmp/worktape-runtime

if [ ! -f ".next/BUILD_ID" ]; then
  /opt/homebrew/bin/npm run build
fi

exec /opt/homebrew/bin/npm run start -- --hostname 127.0.0.1 --port 3000
