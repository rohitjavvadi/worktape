# Codex Usage Log

## 2026-05-26 10:45 IST
- Task: Convert the Wednesday MVP brief into implementation structure.
- Prompt summary: Build WorkTape Wednesday MVP from `AGENTS.md` and `docs/wednesday-build-brief.md`.
- What Codex produced: Next.js project setup plan, spec schema, fallback spec, seed data, API route, WorkTape flow, generated-tool renderer, and required docs.
- Human edits made: User corrected architecture before build to require real frame-based AI backend and spec-driven rendering.
- Verification/test result: `npm run build`, `npm run typecheck`, `npm run lint`, local page response, and API fallback/frame extraction checks passed.
- Supports: product | docs

## 2026-05-26 11:10 IST
- Task: Implement spec-driven generated tool.
- Prompt summary: Avoid hardcoded admissions CRM; render the internal tool from the workflow spec.
- What Codex produced: `SpecDrivenTool` component mapping spec entities, fields, statuses, templates, validation, and export into UI behavior.
- Human edits made: None yet.
- Verification/test result: Production build and typecheck passed. Hardcoding audit confirms fields/statuses/templates/export are spec-driven.
- Supports: product

## 2026-05-26 11:20 IST
- Task: Implement real AI backend path.
- Prompt summary: Uploaded video should be sampled with ffmpeg and sent to OpenAI Responses API for structured JSON.
- What Codex produced: `/api/analyze-recording` route with ffmpeg frame extraction, OpenAI Responses API call, schema validation, and honest cached fallback.
- Human edits made: None yet.
- Verification/test result: Uploaded synthetic video reached `/api/analyze-recording`, ffmpeg extracted 2 frames, and route fell back only because `OPENAI_API_KEY` is not configured.
- Supports: product

## 2026-05-26 11:45 IST
- Task: Verify Wednesday MVP.
- Prompt summary: Run app locally, verify main flow, verify generated tool renders from spec, and run configured checks.
- What Codex produced: Build/lint/typecheck verification, local server page check, API route frame-extraction test, and repo hygiene updates.
- Human edits made: None.
- Verification/test result: `npm run build`, `npm run typecheck`, and `npm run lint` passed. `curl http://localhost:3000` returned 200. API multipart upload returned saved fallback with extracted frame timestamps because no API key is configured.
- Supports: product | demo | bugfixing

## 2026-05-26 12:25 IST
- Task: Test OpenAI live model path and apply Claude UI review feedback.
- Prompt summary: Use the provided API key only as a process environment variable, verify the model path, run Claude Review for Codex read-only, and improve UI appeal/reliability.
- What Codex produced: Structured-output schema fix for OpenAI strict mode, OpenAI timeout, upload size guard, active loading state, active clarify stage, clipboard fallback, required-field validation fix, and a cleaner WorkTape visual shell.
- Human edits made: User requested UI overhaul and live model verification.
- Verification/test result: `/api/analyze-recording` returned `mode=live-ai` with extracted frames and a `Lead` spec. `npm run build`, `npm run typecheck`, and `npm run lint` passed.
- Supports: product | demo | bugfixing

## 2026-05-26 12:10 IST
- Task: Record and verify the real WhatsApp-to-sheet workflow path.
- Prompt summary: Use Comet with WhatsApp Web Self notes only, create dummy admissions messages, record the workflow, upload/analyze the recording, and keep live logs visible.
- What Codex produced: Dummy Self notes admissions messages, local sheet-stage page at `demo-assets/recording-stage/index.html`, real screen recording at `demo-assets/recordings/admissions-whatsapp-sheet-recording.mov`, and saved live analysis response at `demo-assets/recordings/latest-analysis-response.json`.
- Human edits made: User explicitly approved sending dummy messages to Self notes and clarified Comet is the browser.
- Verification/test result: Backend accepted the 43 MB `.mov`, ffmpeg extracted 10 frames, OpenAI Responses API used `gpt-5.5` with high reasoning, and returned `mode=live-ai` in 83 seconds with 1 entity, 5 steps, and a spec-driven admissions lead tracker summary.
- Supports: product | demo | validation | bugfixing

## 2026-05-26 13:25 IST
- Task: Set workflow model to `gpt-5.5` with high reasoning and redesign UI from image mockup.
- Prompt summary: Use `gpt-5.5` plus `reasoning: { effort: "high" }`, generate a product UI mockup with imagegen, redesign all WorkTape screens toward a cleaner product surface, and test the model path.
- What Codex produced: Default model update, high reasoning config, 90s default timeout, copied mockup at `demo-assets/mockups/worktape-ui-mockup.png`, redesigned three-column product workspace, generated realistic text-based admissions test video, and updated docs.
- Human edits made: User specified `gpt-5.5` and high reasoning as the required model configuration.
- Verification/test result: `npm run build`, `npm run typecheck`, and `npm run lint` passed. Local `GET /` returned 200. Without API key, API fallback extracted 3 frames. A direct `gpt-5.5` + high reasoning smoke test returned `WorkTape model smoke test OK` in about 2s. With transient API key, the full realistic video route reached `gpt-5.5` high but timed out at 90s and safely fell back; earlier API path with the key returned live AI on the shorter test.
- Supports: product | demo | docs | bugfixing

## 2026-05-26 12:23 IST
- Task: Run top-3 readiness review and fix Claude Review findings.
- Prompt summary: Review whether WorkTape feels like a top-3 hackathon product, ask Claude Review for Codex for help, and change what is needed without artificially shrinking ambition.
- What Codex produced: Claude Review context file, read-only Claude review, live-AI CRM seed-record adapter, animated analysis progress, first-screen proof path, generated CRM evidence cards, and decision/risk log updates. A large demo-honesty panel was removed after review because it made the product feel defensive.
- Human edits made: User pushed against over-restricting scope and asked to listen to Claude's recommendations.
- Verification/test result: Claude found two high-severity live-demo seed-record bugs and one medium loading-state issue. `npm run typecheck`, `npm run lint`, and `npm run build` passed. Comet fresh tab verified proof path, saved sample flow, spec-to-app mapping, and generated CRM with 3 populated editable records.
- Supports: product | demo | docs | bugfixing

## 2026-05-26 16:10 IST
- Task: Rebuild the WorkTape frontend from scratch at production/demo quality.
- Tool note: This iteration was done in Claude Code (Opus 4.7), not Codex. Logged here for honest build-iteration tracking. Codex remains the product's analysis/generation engine (OpenAI Responses API in `app/api/analyze-recording/route.ts`); the "Generated by Codex" framing in the UI is unchanged.
- Prompt summary: "The frontend is trash" — back up the existing frontend, then redesign from scratch, preserving only the current feature set, aiming for an excellent demoable, production-quality UI.
- What was produced: Cataloged every existing feature from the old components; backed up the replaced files to `_frontend-backup/` (excluded from build/typecheck); a new Tailwind design system (`tailwind.config.ts`), global component classes (`app/globals.css`), Inter + JetBrains Mono via `next/font` (`app/layout.tsx`), and full rewrites of `WorkTapeApp.tsx` (sticky nav, grid/glow hero, animated pipeline stepper, proof tiles, upload with drag-drop, analysis, frames, workflow timeline, detected objects, clarifying questions, dark JSON spec panel, spec→app mapping) and `SpecDrivenTool.tsx` (app chrome, header stats, dynamic intake form, dashboard table with colored status pills, copy-able message templates, CSV export). Updated `README.md` and `docs/technical-decisions.md`.
- Human edits made: User requested the rebuild and the doc updates.
- Verification/test result: `npm run typecheck` clean; `npm run build` succeeds and `/` prerenders statically without errors. Backend, `lib/`, `data/`, and the `WorkflowSpec` contract were not modified; behavior/state machine preserved.
- Supports: product | demo | docs
