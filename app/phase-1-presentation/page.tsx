import type { Metadata } from "next";

const sidebarItems = [
  {
    label: "Phase 1 Presentation",
    href: "/phase-1-presentation-pdf",
    meta: "default"
  },
  {
    label: "01-product-brief.md",
    href: "/submissions/checkpoint/01-product-brief.md",
    meta: "markdown"
  },
  {
    label: "01-product-brief.pdf",
    href: "/submissions/checkpoint/01-product-brief.pdf",
    meta: "pdf"
  },
  {
    label: "02-one-page-investor-pitch.md",
    href: "/submissions/checkpoint/02-one-page-investor-pitch.md",
    meta: "markdown"
  },
  {
    label: "02-one-page-investor-pitch.html",
    href: "/submissions/checkpoint/02-one-page-investor-pitch.html",
    meta: "html"
  },
  {
    label: "02-one-page-investor-pitch.pdf",
    href: "/submissions/checkpoint/02-one-page-investor-pitch.pdf",
    meta: "pdf"
  },
  {
    label: "03-user-flow-diagram.md",
    href: "/submissions/checkpoint/03-user-flow-diagram.md",
    meta: "markdown"
  },
  {
    label: "04-checkpoint-summary.md",
    href: "/submissions/checkpoint/04-checkpoint-summary.md",
    meta: "markdown"
  },
  {
    label: "04-checkpoint-summary.pdf",
    href: "/submissions/checkpoint/04-checkpoint-summary.pdf",
    meta: "pdf"
  },
  {
    label: "worktape-phase1-collage.png",
    href: "/submissions/checkpoint/worktape-phase1-collage.png",
    meta: "image"
  }
];

export const metadata: Metadata = {
  title: "WorkTape Phase 1 Presentation",
  description: "Phase 1 checkpoint presentation for WorkTape."
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PhaseOnePresentation() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#0b1120]">
      <header className="border-b border-[#d7e0ea] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d9d6e]">
              WorkTape
            </p>
            <h1 className="mt-1 text-xl font-semibold">
              Phase 1 Presentation
            </h1>
          </div>
          <a
            href="/phase-1-presentation-pdf"
            className="rounded-md border border-[#d7e0ea] bg-white px-4 py-2 text-sm font-semibold text-[#0b1120] shadow-sm transition hover:border-[#0d9d6e] hover:text-[#0d9d6e]"
          >
            Open PDF
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-[#d7e0ea] bg-white p-3 shadow-sm lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="border-b border-[#e7eef6] px-2 pb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d9d6e]">
              Checkpoint Files
            </p>
            <p className="mt-1 text-sm text-[#64748b]">
              Presentation opens by default.
            </p>
          </div>
          <nav className="mt-3 grid gap-1">
            {sidebarItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="submission-viewer"
                className="group rounded-lg border border-transparent px-3 py-2 text-sm font-semibold text-[#0b1120] transition hover:border-[#bdebd9] hover:bg-[#e7f8f1]"
              >
                <span className="block leading-snug">{item.label}</span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.12em] text-[#64748b] group-hover:text-[#0d9d6e]">
                  {item.meta}
                </span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="overflow-hidden rounded-xl border border-[#d7e0ea] bg-white shadow-sm">
          <iframe
            name="submission-viewer"
            title="WorkTape Phase 1 submission viewer"
            src="/phase-1-presentation-pdf"
            className="h-[calc(100vh-2rem)] min-h-[720px] w-full"
          />
        </div>
      </section>
    </main>
  );
}
