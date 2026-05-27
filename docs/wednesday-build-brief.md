# WorkTape Wednesday MVP Build Brief

## Context

WorkTape turns a screen recording of repetitive human work into a working internal web app.

For the Wednesday checkpoint, build the narrow proof:

> WhatsApp leads + Google Sheets -> coaching institute lead/admissions tool.

The admissions workflow is the first tested/demo input. The product mechanism must still be spec-driven.

## Core Rule

Do not hardcode a fixed admissions CRM and pretend it was generated.

Build:

1. A real AI backend that analyzes uploaded workflow video frames.
2. A structured workflow/app spec JSON.
3. A spec-driven internal tool renderer.

The generated tool must get forms, tables, fields, statuses, templates, validation, and export behavior from the spec.

## Hard Constraints

- Do not build a generic prompt-to-app builder.
- Do not support many workflows in the MVP.
- Do not make a landing page as the first screen.
- The first screen must be the usable WorkTape flow.
- Do not hide the before/after transformation.
- Do not fake live AI analysis.
- Do not fake runtime Codex generation.
- The recording is the spec.
- Cached fallback is only for demo reliability and must be labeled honestly.

## Architecture

- Next.js frontend.
- Next.js API backend.
- ffmpeg/server-side or browser-assisted frame extraction.
- OpenAI Responses API vision model for workflow analysis.
- Structured JSON workflow/app spec.
- Spec-driven generated-tool renderer.
- Codex usage log.

## Primary User Flow

1. User uploads or selects a workflow recording.
2. App extracts/samples frames from the video.
3. Backend sends frames to an OpenAI vision model.
4. Model returns structured workflow JSON.
5. App displays extracted workflow summary, steps, entities, fields, statuses, actions, and pain points.
6. App asks 3-5 clarifying questions.
7. User answers questions.
8. App creates final app spec JSON.
9. App shows honest spec-to-app mapping.
10. User opens the generated internal tool rendered from the final spec.

## Spec-Driven Renderer Requirements

The renderer must use the final app spec as source of truth:

- `entities` define forms and tables.
- `fields` define inputs and columns.
- `statuses` define dropdowns and badges.
- `messageTemplates` define copy-to-clipboard buttons.
- `validationRules` define required fields.
- `exportRequirements` define CSV export.
- `screens` define visible sections.

Admissions-specific code is allowed only for sample recording, sample extracted frames, cached fallback spec, seed records, demo copy, and prompt context.

Not allowed:

- A separate hardcoded admissions CRM unrelated to the spec.
- Fixed fields or statuses outside the spec.
- Fixed table columns outside the spec.
- Fake AI analysis presented as real.
- Fake Codex generation logs.

## Spec Contract

Create a JSON schema and TypeScript/Zod type for:

- `workflowSummary`
- `confidence`
- `sourceEvidence`
- `steps`
- `entities`
- `fields`
- `statuses`
- `actions`
- `messageTemplates`
- `screens`
- `validationRules`
- `exportRequirements`
- `clarifyingQuestions`

## AI Backend Requirements

Implement an API route for video/frame analysis.

The backend should:

1. Accept uploaded/supplied video or extracted frames.
2. Extract/sample frames with ffmpeg/server-side or browser-assisted extraction.
3. Send image inputs to the OpenAI Responses API.
4. Request structured output matching the workflow spec schema.
5. Validate the result before rendering.
6. If API fails or no key exists, use a cached fallback spec with an honest UI message:

> Using saved analysis for the sample recording so the demo can continue.

Never present cached fallback as live model analysis.

## Wednesday Screens

Build these screens/states:

1. Upload/select recording.
2. Frame extraction/progress.
3. Extracted workflow summary.
4. Detected objects/entities and fields.
5. Clarifying questions.
6. Final app spec preview.
7. Spec-to-app build mapping.
8. Generated internal tool rendered from spec.

## Generated Tool Features For Wednesday

- Render form from spec fields.
- Render table/list from spec fields.
- Render status controls from spec statuses.
- Render message templates from spec.
- Copy-to-clipboard action if templates exist.
- CSV export if feasible.
- Seed records shaped from the spec.

## Required Docs And Logs

Create and maintain:

- `docs/product-brief.md`
- `docs/user-flow.md`
- `docs/wednesday-checkpoint.md`
- `docs/technical-decisions.md`
- `docs/assumptions.md`
- `docs/risk-register.md`
- `docs/hardcoding-audit.md`
- `codex-usage-log.md`
- `validation-log.md`

In `docs/technical-decisions.md`, log:

- Decision
- Options considered
- Why chosen
- Tradeoff
- AGENTS.md alignment

In `docs/assumptions.md`, track:

- MVP is tested only on admissions lead workflow.
- Renderer is spec-driven.
- Video analysis is the real primary path.
- Cached fallback is only reliability fallback.
- WhatsApp API is out of scope.
- Auth is out of scope for Wednesday unless trivial.
- Runtime Codex SDK integration is optional.

Use this format in `codex-usage-log.md`:

```md
## YYYY-MM-DD HH:mm IST
- Task:
- Prompt summary:
- What Codex produced:
- Human edits made:
- Verification/test result:
- Supports: product | demo | docs | bugfixing
```

## Hardcoding Audit

Before finishing, create/update `docs/hardcoding-audit.md` and answer:

1. Are forms rendered from spec fields?
2. Are table columns rendered from spec fields?
3. Are statuses rendered from spec statuses?
4. Are message templates rendered from spec templates?
5. Is CSV export based on spec fields?
6. Is admissions-specific logic isolated to sample data/fallback spec/demo assets?
7. Would changing the spec change the rendered tool?
8. Are fallback/mocked parts clearly labeled?

## Verification

Before final response:

1. Run the app locally.
2. Verify upload/select recording flow.
3. Verify frame extraction path or documented fallback.
4. Verify OpenAI analysis route exists.
5. Verify spec JSON validates.
6. Verify generated tool renders from spec.
7. Verify docs exist.
8. Verify `codex-usage-log.md` has meaningful entries.
9. Run lint/build if configured.
10. Summarize what is real, what is fallback, what is out of scope, and what remains for Friday.

Stop after the Wednesday MVP. Do not expand to multiple workflows.
