# Technical Decisions

## Next.js App Router

- Decision: Use Next.js with App Router.
- Options considered: React + Vite, Next.js, separate frontend/backend.
- Why chosen: Fastest path to one deployable app with frontend and API backend together.
- Tradeoff: Less backend separation, but simpler for the hackathon.
- AGENTS.md alignment: Optimizes for a working product/prototype quickly.

## Spec-driven renderer

- Decision: Build a generic renderer driven by `WorkflowSpec`.
- Options considered: Hardcoded admissions CRM, template-backed CRM, spec renderer.
- Why chosen: Prevents fake generation and preserves "recording becomes the spec."
- Tradeoff: Renderer is simple and supports a limited set of field/screen types.
- AGENTS.md alignment: Shows visible transformation from workflow spec to working app.

## ffmpeg API route

- Decision: Use `ffmpeg-static` in a Next.js API route to extract frames.
- Options considered: Browser canvas frame extraction, server ffmpeg, mocked frame list.
- Why chosen: Matches requested real backend path: uploaded video -> backend frame extraction.
- Tradeoff: Serverless deployment may need extra testing.
- AGENTS.md alignment: Keeps recording analysis real instead of pretending from static data.

## OpenAI Responses API

- Decision: Use a vision-capable OpenAI model through the Responses API with structured output.
- Options considered: Prompt-only extraction, transcript extraction, cached extraction only.
- Why chosen: The MVP needs a real AI backend analyzing frames.
- Tradeoff: Requires `OPENAI_API_KEY`, model access, and latency management.
- AGENTS.md alignment: The screen recording is treated as source material for the app spec.

## Cached fallback spec

- Decision: Keep a saved admissions fallback spec.
- Options considered: No fallback, fallback hidden from user, clearly labeled fallback.
- Why chosen: Demo reliability without fake claims.
- Tradeoff: Needs careful UI labeling to avoid seeming like live analysis.
- AGENTS.md alignment: No fake demos; mocked/fallback pieces are disclosed.

## Codex runtime integration

- Decision: Do not add runtime Codex SDK integration for Wednesday.
- Options considered: Live code generation, simulated fake terminal, honest spec-to-app mapping.
- Why chosen: Runtime generation is risky; actual Codex usage is documented in logs.
- Tradeoff: Product story shows Codex as build/generation agent through mapping and logs, not live SDK.
- AGENTS.md alignment: Meaningful Codex usage is tracked without fake generation.

## OpenAI strict schema compatibility

- Decision: Make optional structured-output properties nullable in JSON Schema, then strip nulls before Zod validation.
- Options considered: Looser unstructured JSON, making all optional fields required in app types, nullable schema plus normalization.
- Why chosen: OpenAI strict structured outputs require all object properties to appear in `required`, while the app should still treat fields like `placeholder`, `options`, and `answer` as optional.
- Tradeoff: Adds a small normalization step at the API boundary.
- AGENTS.md alignment: Keeps the AI backend real while preserving a clean app spec contract.

## Workflow model default

- Decision: Use `gpt-5.5` with `reasoning.effort = "high"` for workflow frame analysis.
- Options considered: Previous `gpt-4.1-mini` default, `gpt-5.5` without reasoning config, `gpt-5.5` with high reasoning.
- Why chosen: The user explicitly selected `gpt-5.5` and high reasoning for better workflow understanding from sparse frames.
- Tradeoff: Higher latency and likely higher cost; default API timeout was raised to 10 minutes at the user's request.
- AGENTS.md alignment: Improves the real AI backend path while keeping the MVP focused on one workflow.

## Imagegen UI mockup

- Decision: Generate a product UI mockup and use it as the redesign direction.
- Options considered: Continue hand-polishing the existing scaffold, ask another text reviewer, generate a high-fidelity UI reference.
- Why chosen: The user requested imagegen and the current UI needed stronger visual hierarchy.
- Tradeoff: The generated mockup is a reference, not a pixel-perfect implementation spec.
- AGENTS.md alignment: The resulting UI remains the usable WorkTape flow, not a marketing landing page.
- Mockup path: `demo-assets/mockups/worktape-ui-mockup.png`.

## Claude Review UI fixes

- Decision: Accept Claude Review findings for loading state, clarify stage, clipboard fallback, required-field validation, and upload size guard.
- Options considered: UI-only polish, bug fixes first, or deferring findings to Friday.
- Why chosen: These issues affect the demo path and spec-driven renderer correctness.
- Tradeoff: Less time spent on deeper visual redesign, but the app is more reliable.
- AGENTS.md alignment: Protects the visible before/after transformation and working prototype credibility.

## Top-3 readiness pass

- Decision: Treat Claude Review's live-demo findings as must-fix before further polish.
- Options considered: Only modernize the visuals, add more workflows, or first fix the live AI to CRM path.
- Why chosen: Claude found that successful live AI specs can return lowercase/different field names, causing the generated CRM to open empty or mostly blank if seed records are not adapted.
- Implementation: The CRM now adapts seeded records to the returned spec's entity and field names, including common lead/student aliases, so a live spec still opens with populated editable records.
- UI change: Added a first-screen proof path so judges see recording -> frames -> spec -> generated app without guessing. Removed the large demo-honesty panel from the product UI because it felt defensive; honesty remains in fallback labels, copy, docs, and demo narration.
- Tradeoff: Still focused on the admissions workflow, but not artificially small; the depth is in making the one transformation undeniable.
- AGENTS.md alignment: Preserves "the recording is the spec" and avoids a generic prompt-to-app builder.

## Frontend rebuilt from scratch (2026-05-26)

- Decision: Discard the existing frontend visuals and rebuild the UI layer from scratch at production/demo quality, preserving every feature and the entire backend.
- Tool: Built in Claude Code (Opus 4.7). Codex remains the product's generation/analysis engine; this iteration was a UI rebuild and is logged honestly in `codex-usage-log.md`.
- Scope: Only the presentation layer changed — `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `components/worktape-flow/WorkTapeApp.tsx`, `components/generated-tool/SpecDrivenTool.tsx`. The API route, `lib/`, `data/`, and the `WorkflowSpec` contract were untouched; state machine and handlers are unchanged.
- Design system: New Tailwind token set (ink neutral scale, `signal` emerald brand, `cobalt`/`amber` accents), reusable component classes (`.wt-card`, `.wt-btn-*`, `.wt-input`, `wt-progress`), Inter + JetBrains Mono via `next/font`, subtle grid/glow hero, animated pipeline stepper, and a "real product" chrome around the generated tool (browser bar, colored status pills).
- Backup: Old files copied to `_frontend-backup/` (excluded from `tsconfig` and Tailwind content globs) so nothing is lost.
- Verification: `npm run typecheck` and `npm run build` pass; `/` prerenders statically without errors.
- Tradeoff: A larger visual change to maintain, but the before/after transformation now reads clearly for judges and the generated tool looks shipped, not mocked.
- AGENTS.md alignment: Strengthens Presentation clarity and Technical execution while keeping "the recording is the spec" front and center; no new workflows or prompt-to-app surface added.
