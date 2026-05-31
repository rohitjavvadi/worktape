# WorkTape Product Brief

## One-Line Description

WorkTape turns a screen recording of repetitive human work into a working internal web app.

## Problem

Small businesses often run important workflows through WhatsApp, spreadsheets, payment notes, and manual follow-ups. The person doing the work understands the process, but they usually cannot write a software spec, PRD, database schema, or app requirements document.

That means useful internal tools do not get built, even when the workflow is repeated every day.

## Insight

The strongest input is not a prompt. It is the work itself.

WorkTape treats a screen recording as the software spec. A user performs a manual workflow once, and WorkTape observes the steps, identifies the business objects, asks a few clarifying questions, and turns the workflow into a focused internal tool.

## Target User

- Coaching institute admins
- Admissions teams
- Small business owners
- Operations assistants
- Local service businesses using WhatsApp and spreadsheets
- Non-technical teams who can show their work but cannot spec software

## Wednesday MVP Scope

The Day 3 MVP focuses on one workflow:

WhatsApp/lead management plus spreadsheet tracking -> admissions CRM.

The MVP demonstrates the core transformation:

1. Upload or select a workflow recording.
2. Extract frames from the recording.
3. Analyze the frames with an OpenAI vision-capable model.
4. Produce structured workflow JSON.
5. Ask clarifying questions.
6. Create a final app spec.
7. Render a usable internal CRM from the spec.

## What Works Today

- Next.js frontend and API backend.
- Upload/select recording flow.
- ffmpeg-based frame extraction.
- OpenAI Responses API route for workflow analysis.
- Structured `WorkflowSpec` JSON contract.
- Clarifying questions and final spec creation.
- Spec-to-app mapping screen.
- Generated admissions tool rendered from the spec.
- Working form, records table, status controls, WhatsApp message templates, copy actions, and CSV export.

## Honest Boundaries

- Real: frontend flow, backend route, frame extraction, live AI path with configured API key, structured spec validation, and spec-driven CRM rendering.
- Fallback: saved sample analysis for deterministic demo reliability when live AI is slow or unavailable.
- Not included yet: WhatsApp API integration, production auth, broad arbitrary workflow support, public deployment, and runtime Codex SDK integration.

## Why This Matters

Most software starts from written requirements. WorkTape explores a different starting point: observed human labor.

If the product works, non-technical operators can turn repeated manual work into useful internal software without first learning how to write specs.
