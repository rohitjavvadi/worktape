import { readFile } from "node:fs/promises";
import path from "node:path";

const deckPdfPath = path.join(
  process.cwd(),
  "public",
  "submissions",
  "worktape-phase1-pitch-deck.pdf"
);

export async function GET() {
  const file = await readFile(deckPdfPath);

  return new Response(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="WorkTape-Phase1-Pitch-Deck.pdf"',
      "Cache-Control": "public, max-age=3600"
    }
  });
}
