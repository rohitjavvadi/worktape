import { readFileSync } from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

function renderMarkdownLine(line: string, index: number) {
  if (line.startsWith("# ")) {
    return (
      <h1 key={index} className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {line.slice(2)}
      </h1>
    );
  }

  if (line.startsWith("## ")) {
    return (
      <h2
        key={index}
        className="mt-8 border-t border-line pt-6 text-xl font-bold tracking-tight text-ink"
      >
        {line.slice(3)}
      </h2>
    );
  }

  if (line.startsWith("- ")) {
    return (
      <p key={index} className="pl-4 text-sm leading-7 text-ink-600">
        <span className="mr-2 text-signal-600">•</span>
        {line.slice(2)}
      </p>
    );
  }

  if (!line.trim()) {
    return <div key={index} className="h-2" />;
  }

  return (
    <p key={index} className="text-sm leading-7 text-ink-600">
      {line}
    </p>
  );
}

export default function CodexUsageDocPage() {
  const logPath = path.join(process.cwd(), "codex-usage-log.md");
  const log = readFileSync(logPath, "utf8");
  const lines = log.split("\n");

  return (
    <main className="min-h-screen bg-canvas px-5 py-8 text-ink">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div className="border-b border-line bg-signal-fade px-6 py-6">
          <p className="wt-eyebrow">Hackathon evidence</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            WorkTape Codex Usage Log
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-500">
            This page mirrors the project&apos;s live `codex-usage-log.md` file and documents how Codex
            and OpenAI tools were used for planning, coding, debugging, testing, docs, demo assets, and
            deployment during the hackathon.
          </p>
        </div>

        <div className="grid gap-3 border-b border-line bg-white px-6 py-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-canvas p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">Source</p>
            <p className="mt-1 font-mono text-xs font-semibold text-ink">codex-usage-log.md</p>
          </div>
          <div className="rounded-xl border border-line bg-canvas p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">Scope</p>
            <p className="mt-1 text-xs font-semibold text-ink">Build journey + verification</p>
          </div>
          <div className="rounded-xl border border-line bg-canvas p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">Privacy</p>
            <p className="mt-1 text-xs font-semibold text-ink">No API keys or secrets published</p>
          </div>
        </div>

        <article className="px-6 py-7">{lines.map(renderMarkdownLine)}</article>
      </section>
    </main>
  );
}
