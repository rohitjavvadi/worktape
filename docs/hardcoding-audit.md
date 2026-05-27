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

Yes, with nuance. With an API key provided only as a local process environment variable, a direct `gpt-5.5` + high reasoning smoke test returned successfully. The previous model path returned `mode=live-ai`, extracted frames, and produced a structured `Lead` workflow spec. After switching the full video route to `gpt-5.5` with high reasoning, the realistic admissions test video reached the model but timed out at 90 seconds and safely returned the labeled fallback spec. This is a demo reliability risk to revisit before Friday.

## Remaining caution

The OpenAI prompt includes context that the first MVP is likely a WhatsApp/spreadsheet lead workflow. This is intentional narrowing for the hackathon, not broad multi-workflow support.
