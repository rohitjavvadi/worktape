# Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Screen recording analysis is flaky or slow | High | Use real frame extraction first, then clearly labeled cached fallback if needed. |
| OpenAI API key/model access missing | High | API route returns saved analysis with an honest reason. |
| ffmpeg fails in deployment | High | Keep local verification and consider browser-assisted extraction for Friday if Vercel blocks ffmpeg. |
| Generated tool seems prebuilt | High | Renderer pulls fields, statuses, templates, and export from spec; hardcoding audit is required. |
| Codex usage is not visible enough | Medium | Maintain `codex-usage-log.md` and show spec-to-app mapping in product. |
| Overbuilding into many workflows | High | Keep only the admissions workflow as the tested/demo input. |
| Demo clarity is weak | Medium | Preserve the sequence: recording -> frames -> workflow -> questions -> spec -> tool. |
| Live app breaks during demo | High | Keep saved analysis and seed records for deterministic recovery. |
| Live AI spec field names do not match demo seed records | High | Adapt seed records to the returned spec's entity and field names before rendering the CRM. |
| Long live analysis looks frozen | Medium | Use an indeterminate active progress bar and explicit frame/model/schema status steps. |
| Validation claims are weak or fake | Medium | `validation-log.md` records only actual conversations or explicitly says none yet. |
| WhatsApp integration expectation | Medium | UI and docs state templates are copy-to-clipboard only for MVP. |
