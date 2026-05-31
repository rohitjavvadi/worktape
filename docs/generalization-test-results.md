# WorkTape Generalization Test Results

Date: 2026-05-28

Purpose: test whether the current WorkTape AI backend can analyze business workflow recordings beyond the primary admissions/lead-management demo.

## Test Method

- Generated three small MP4 workflow recordings under `demo-assets/recordings/generalization-tests/`.
- Uploaded each video to the same production API path: `POST /api/analyze-recording`.
- The backend extracted frames with ffmpeg and sent those frames to the OpenAI Responses API.
- Model configuration: `gpt-5.5` with `reasoning.effort = "high"`.
- Raw API responses are saved in `demo-assets/recordings/generalization-tests/results/`.

## Results

| Workflow video | API mode | Frames | Confidence | Extracted object | Result |
|---|---:|---:|---:|---|---|
| `clinic-appointments.mp4` | `live-ai` | 3 | 0.90 | `appointment` | Good appointment tracker spec with patient fields, appointment status, screens, templates, and clarifying questions. |
| `invoice-collections.mp4` | `live-ai` | 3 | 0.91 | `InvoiceCollection` | Good receivables/payment tracker spec with invoice fields, collection status, payment reference, templates, and export. |
| `repair-service-tickets.mp4` | `live-ai` | 3 | 0.86 | `ServiceTicket` | Good service-ticket tracker spec with customer issue, technician assignment, visit, charge, payment, and notes fields. |

## Latency Observed

- Clinic appointments: `628839ms`
- Invoice collections: `93865ms`
- Repair service tickets: `60986ms`

The first run was too slow for a live judged demo, even though it eventually returned `live-ai`. This means the final demo should keep a deterministic, pre-tested recording path and a labeled fallback/cache path for reliability. The product can still truthfully say the broader tests returned live AI specs.

## What This Proves

The current backend is not only returning the admissions fallback. It can produce structured specs for at least three different business workflows from uploaded MP4 recordings.

## What This Does Not Prove

This does not prove that any random screen recording can generate any internal app. The MVP should not claim universal app generation. The honest claim is:

> WorkTape has a real frame-based AI backend that turns clear repetitive business workflow recordings into structured internal-tool specs. The hackathon demo is strongest around chat/spreadsheet operations, especially admissions or lead-management workflows.

## Final Demo Guidance

- Use the admissions/lead workflow as the main demo because it is the narrow hackathon wedge.
- Mention the three broader tests as supporting evidence, not the main product promise.
- Do not live-test an unknown random video during judging.
- Keep the fallback labeled as a reliability fallback only.
