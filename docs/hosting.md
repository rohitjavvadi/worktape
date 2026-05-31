# WorkTape Hosting Notes

Last updated: 2026-05-28

## Public URLs

- App: `https://worktape.javvadi.in/`
- Phase 1 presentation and checkpoint document viewer: `https://worktape.javvadi.in/phase-1-presentation`
- Phase 1 PDF preview: `https://worktape.javvadi.in/phase-1-presentation-pdf`
- Direct PPTX file, only when a file download is explicitly needed: `https://worktape.javvadi.in/submissions/worktape-phase1-pitch-deck.pptx`

The earlier misspelled `presentaton` route was removed on 2026-05-28. Use only the correctly spelled `phase-1-presentation` URL.

The viewer opens the Phase 1 presentation by default and shows a left sidebar for the checkpoint files:

- `01-product-brief.md`
- `01-product-brief.pdf`
- `02-one-page-investor-pitch.md`
- `02-one-page-investor-pitch.html`
- `02-one-page-investor-pitch.pdf`
- `03-user-flow-diagram.md`
- `04-checkpoint-summary.md`
- `04-checkpoint-summary.pdf`
- `worktape-phase1-collage.png`

## How It Is Hosted

The app runs locally with Next.js on `127.0.0.1:3000`.

Cloudflare Tunnel forwards `worktape.javvadi.in` to `http://127.0.0.1:3000` using:

- Tunnel config: `/Users/rohitjavvadi/.cloudflared/config.yml`
- Tunnel name: `worktape`
- Tunnel id: `6d82b8e0-1a41-4885-9034-117afb3bf1aa`

The tunnel intentionally uses `127.0.0.1`, not `localhost`, so it cannot accidentally hit an older IPv6 listener.

## Persistence

These LaunchAgents start the services after login/restart:

- `/Users/rohitjavvadi/Library/LaunchAgents/com.worktape.app.plist`
- `/Users/rohitjavvadi/Library/LaunchAgents/com.worktape.tunnel.plist`
- `/Users/rohitjavvadi/Library/LaunchAgents/com.worktape.awake.plist`

The app and tunnel scripts live in:

- `/Users/rohitjavvadi/.worktape-runtime/bin/start-worktape-app.sh`
- `/Users/rohitjavvadi/.worktape-runtime/bin/start-worktape-tunnel.sh`

Repo copies of the scripts live in `scripts/`.

Logs:

- `/tmp/worktape-runtime/launchd-next.log`
- `/tmp/worktape-runtime/launchd-next.err.log`
- `/tmp/worktape-runtime/launchd-cloudflared.log`
- `/tmp/worktape-runtime/launchd-cloudflared.err.log`

## Verification Commands

```bash
launchctl list | rg 'com\\.worktape'
curl -L -I https://worktape.javvadi.in/phase-1-presentation
curl -L -o /tmp/worktape-phase1.pptx https://worktape.javvadi.in/submissions/worktape-phase1-pitch-deck.pptx
shasum -a 256 public/submissions/worktape-phase1-pitch-deck.pptx /tmp/worktape-phase1.pptx
```
