# Demo Recording Options

Date: 2026-05-28

## Recommendation

For the final judged video, use a deterministic recorded path:

1. Pre-tested workflow recording.
2. Public WorkTape app.
3. Show upload -> analysis -> spec -> generated CRM.
4. Record with native `screencapture`/QuickTime or OBS if a fully manual walkthrough is needed.
5. Keep the generated narrated draft video as a backup or base cut.

## Options Checked

| Tool | Fit | Notes |
|---|---|---|
| macOS `screencapture` | Best controllable local option | Built into macOS. Supports command-line video capture with `-v`, duration limit with `-V`, screen rect with `-R`, and click indicators with `-k`. Good for deterministic local capture. |
| OBS Studio | Best open-source pro recorder | Free/open-source, supports macOS, scenes, window/browser capture, hotkeys, and scripting/plugin APIs. More setup overhead than native capture. |
| Kap | Lightweight open-source macOS recorder | Simple menu-bar recorder. Good for quick manual capture, but less ideal for controlled automation and appears less actively released. |
| Screenity | Browser-focused recorder | Good if the final demo stays inside Chrome/Comet. It is a browser recorder, not a full desktop workflow recorder. |
| Playwright video capture | Best for automated browser walkthroughs | Great for deterministic app walkthrough video if Playwright is installed. It records browser contexts, not arbitrary desktop workflows. |

## Current Output

Created an 86-second narrated draft video:

- Local: `demo-assets/final-demo/WorkTape-Final-Demo-Draft.mp4`
- Desktop: `/Users/rohitjavvadi/Desktop/WorkTape-Final-Demo-Draft.mp4`

This is a polished storyboard demo draft, not a final human-recorded walkthrough. For Sunday, the strongest final video should include a short live capture of the actual app path, using this draft's narrative and structure.
