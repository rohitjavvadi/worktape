# Hardcoding Audit

## 1. Are forms rendered from spec fields?

Yes. `SpecDrivenTool` reads the first entity from `WorkflowSpec` and maps `entity.fields` to form controls.

## 2. Are table columns rendered from spec fields?

Yes. Table headers and cells are mapped from `entity.fields`.

## 3. Are statuses rendered from spec statuses?

Yes. Status fields use field options first and then `spec.statuses` by matching the field name.

## 4. Are message templates rendered from spec templates?

Yes. Template cards are mapped from `spec.messageTemplates`, and placeholders are filled from the selected record.

## 5. Is CSV export based on spec fields?

Yes. Export uses `entity.fields` for headers and row values.

## 6. Is admissions-specific logic isolated to sample data/fallback spec/demo assets?

Mostly yes. Admissions-specific content lives in `data/specs/admissions-fallback-spec.json`, `data/seed/admissions-records.json`, and demo copy. The renderer itself does not hardcode admissions fields.

## 7. Would changing the spec change the rendered tool?

Yes. Changing entity fields, statuses, templates, screens, or export requirements changes the rendered form, table, controls, template cards, and export.

## 8. Are fallback/mocked parts clearly labeled?

Yes. The UI distinguishes `Live AI analysis` from `Saved analysis fallback` and explains the fallback reason returned by the API.

## 9. Was the OpenAI model path tested?

Yes. On 2026-05-27, with `OPENAI_API_KEY` configured locally, multipart upload of `demo-assets/recordings/admissions-workflow-test.mp4` to `/api/analyze-recording` returned `mode=live-ai`, 3 frames, 4 workflow steps, 1 entity, 9 fields, and confidence `0.92`.

The longer real `.mov` recording remains slower and should be treated as supporting evidence, not the only deterministic Wednesday demo path.

## Remaining caution

The OpenAI prompt includes context that the first MVP is likely a WhatsApp/spreadsheet lead workflow. This is intentional narrowing for the hackathon, not broad multi-workflow support.
