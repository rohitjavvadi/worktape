# Assumptions

- The Wednesday MVP is tested only on a coaching institute admissions / lead qualification workflow.
- The rendered internal tool is spec-driven, not a hardcoded admissions CRM.
- Video analysis is the real primary path.
- Cached fallback exists only for reliability when no video, no API key, or live analysis failure blocks the demo.
- WhatsApp API integration is out of scope; message templates use copy-to-clipboard.
- Auth is out of scope for Wednesday unless it becomes trivial later.
- Runtime Codex SDK integration is optional and not required for Wednesday.
- Seed records may be admissions-specific because they are sample data for the first demo workflow.
- The renderer intentionally supports a small field/screen vocabulary for the MVP.
