# WorkTape Product Brief

## One-line

WorkTape turns a screen recording of repetitive human work into a working internal tool.

## Wednesday MVP

The first proof is a coaching institute admissions workflow:

> WhatsApp leads + Google Sheets tracking -> a spec-driven lead/admissions tool.

## Target user

Small business operators, coaching institute admins, admissions teams, and operations assistants who know their manual workflow but cannot write a software spec.

## Problem

Manual lead qualification often happens across WhatsApp, spreadsheets, status columns, payment notes, and repeated follow-up messages. The work is clear to the person doing it, but hard to translate into formal product requirements.

## Solution

The user uploads a workflow recording. WorkTape extracts frames, sends them to an OpenAI vision model, receives a structured workflow/app spec, asks clarifying questions, and renders an internal tool from that spec.

## Wednesday honesty boundary

- Real: app UI, upload path, ffmpeg frame extraction API, OpenAI Responses API route, structured spec schema, spec-driven renderer, fallback labeling.
- Fallback: saved admissions analysis when no video/API key or live analysis fails.
- Out of scope: WhatsApp API integration, arbitrary workflow support, production auth, runtime Codex SDK integration.

## AGENTS.md alignment

The MVP starts from observed work, keeps one killer workflow as the demo wedge, and shows the before/after chain: recording -> frames -> extracted workflow -> clarified spec -> generated internal tool.
