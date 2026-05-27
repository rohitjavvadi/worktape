# WorkTape

WorkTape turns a screen recording of repetitive human work into a working internal tool.

## Wednesday MVP

The first demo path is a coaching institute lead/admissions workflow:

```text
WhatsApp leads + Google Sheets -> spec-driven internal tool
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Frontend

The UI was rebuilt from scratch on 2026-05-26 to production/demo quality. It is a single guided flow (`components/worktape-flow/WorkTapeApp.tsx`) plus the spec-driven generated tool (`components/generated-tool/SpecDrivenTool.tsx`).

- Design system: Tailwind tokens in `tailwind.config.ts` (ink neutral scale, `signal` emerald brand, `cobalt` accent), component classes in `app/globals.css` (`.wt-card`, `.wt-btn-*`, `.wt-input`, `wt-progress`).
- Fonts: Inter (UI) + JetBrains Mono (spec/JSON), loaded via `next/font/google`.
- The previous frontend is preserved under `_frontend-backup/` (excluded from build/typecheck). Behavior and backend are unchanged — only the visual layer was rebuilt.

## AI backend

Set `OPENAI_API_KEY` to enable live frame analysis. Optional:

```bash
OPENAI_WORKFLOW_MODEL=gpt-5.5
OPENAI_WORKFLOW_TIMEOUT_MS=600000
```

The workflow analysis call uses `reasoning: { effort: "high" }` by default.

If the key is missing or analysis fails, the app uses a clearly labeled saved analysis fallback for the sample workflow.
