# Wednesday Checkpoint

## Deliverables

- Working local Next.js app.
- Upload/select recording flow.
- Next.js API route for video/frame analysis.
- ffmpeg-based frame extraction on uploaded video.
- OpenAI Responses API call for structured workflow spec.
- Saved fallback spec for demo reliability.
- Spec preview and clarifying question flow.
- Spec-to-app mapping screen.
- Generated internal tool rendered from spec.
- Required docs and logs.

## Must be demonstrably working

- App loads as a usable product flow, not a landing page.
- User can upload a video file and trigger analysis.
- API route attempts frame extraction with ffmpeg.
- Missing API key or failed analysis falls back with honest message.
- Generated tool renders from `WorkflowSpec`.
- Forms, table columns, status controls, message templates, and export are derived from spec.

## Honest fallback

Saved analysis is used only when live AI cannot run. The UI labels it as saved analysis and gives a reason.

## Evidence to capture

- Upload screen.
- Analysis state showing live or fallback mode.
- Extracted workflow.
- Detected fields/entities.
- Clarifying questions.
- Spec JSON.
- Spec-to-app mapping.
- Generated tool with form/table/templates.

## Verification completed

- `npm run build` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- Local `GET /` returned `200 text/html`.
- Multipart upload to `/api/analyze-recording` with `demo-assets/recordings/test-recording.mp4` extracted 2 frames and returned the clearly labeled saved fallback because `OPENAI_API_KEY` is not configured.

## Demo asset note

`demo-assets/recordings/test-recording.mp4` is a synthetic ffmpeg test video used to verify the upload/frame-extraction path. It is not the final admissions workflow demo recording.
