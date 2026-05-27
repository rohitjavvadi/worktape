# WorkTape User Flow

1. User opens WorkTape.
2. User uploads a screen recording of a repeated workflow or selects the saved sample path.
3. WorkTape extracts frames from the recording.
4. WorkTape sends frames to the AI backend.
5. AI backend returns structured workflow JSON.
6. User sees workflow summary, detected steps, entities, fields, statuses, actions, and pain points.
7. User answers clarifying questions.
8. WorkTape creates the final app spec JSON.
9. WorkTape shows the spec-to-app mapping honestly.
10. User opens the generated internal tool.
11. The tool renders forms, tables, statuses, message templates, and CSV export from the spec.

## Wednesday demo path

The intended Wednesday path is:

Upload admissions workflow recording -> live analysis if `OPENAI_API_KEY` is present -> otherwise saved analysis fallback -> answer questions -> inspect spec -> open generated tool.

The fallback is clearly labeled and does not pretend to be live AI analysis.
