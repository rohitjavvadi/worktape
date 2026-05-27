# WorkTape Daily Working Document

Date: 2026-05-27
Hackathon: Outskill x OpenAI Builders Hackathon
Project: WorkTape

## One-Line Progress

WorkTape now has a real MVP path where a workflow screen recording is analyzed into a structured workflow spec, then rendered into a usable internal CRM.

## What I Worked On

- Built the first working WorkTape flow: upload a workflow recording, analyze it, ask clarifying questions, create an app spec, and open the generated internal tool.
- Added a real AI backend path using video frame extraction plus OpenAI vision analysis.
- Defined and validated a structured workflow JSON contract for generated apps.
- Made the generated CRM render from the returned spec instead of being an unrelated static screen.
- Improved the frontend so the before/after chain is visible: recording -> extracted workflow -> business objects -> questions -> spec -> generated app.
- Tested the saved sample path for deterministic demo reliability.
- Tested live analysis locally with a small workflow video.

## Current Product Shape

WorkTape is a screen-recording-to-internal-app product.

The user does not start by writing a prompt. They show the work once by uploading a recording. WorkTape then watches the workflow, extracts the repeated steps and data objects, asks a few missing business-rule questions, and produces a small internal tool.

For the hackathon MVP, the narrow demo workflow is:

```text
WhatsApp/lead management + spreadsheet tracking -> admissions CRM
```

## Working Proof

- Local app runs as a Next.js web app.
- Upload path calls the backend API.
- Backend extracts frames from the recording.
- OpenAI vision model returns structured workflow JSON.
- Clarifying answers are merged into the final spec.
- Generated CRM can add records, update statuses, copy message templates, and export CSV.

Build-in-public post:

https://x.com/rohitj997/status/2059455370859618422

## What Is Real Today

- Real Next.js frontend and API backend.
- Real frame extraction path with ffmpeg.
- Real OpenAI vision model call when `OPENAI_API_KEY` is configured.
- Real structured JSON spec validation.
- Real spec-driven CRM rendering.
- Working local CRM interactions: add record, status fields, message templates, CSV export.

## What Is Still In Progress

- Public deployment link.
- Final demo walkthrough video.
- Stronger Codex build-log presentation inside the product.
- More polished sample recording and demo script.
- Validation notes from 3-5 target users.

## Main Risks

- Video analysis can be slow or flaky, so the demo needs a saved sample fallback.
- The generated app must not look prebuilt; the spec-to-app mapping needs to be obvious.
- Codex usage must be clearly documented and visible for scoring.
- The first public demo must stay narrow and not drift into a generic AI app builder.

## Next Steps

- Deploy the app to a public URL.
- Record the deterministic 60-90 second demo flow.
- Add final screenshots and validation notes.
- Tighten the product narrative around: "the recording is the spec."
- Keep improving the generated CRM while avoiding scope creep.
