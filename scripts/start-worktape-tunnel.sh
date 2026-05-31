#!/bin/zsh
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

mkdir -p /tmp/worktape-runtime
exec /opt/homebrew/bin/cloudflared tunnel --config "/Users/rohitjavvadi/.cloudflared/config.yml" run worktape
