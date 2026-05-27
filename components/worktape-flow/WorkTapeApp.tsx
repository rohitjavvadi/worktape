"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  Clapperboard,
  Code2,
  Cpu,
  Database,
  FileVideo,
  HelpCircle,
  Loader2,
  Play,
  ScanLine,
  Sparkles,
  UploadCloud,
  Workflow,
  Wand2
} from "lucide-react";
import { SpecDrivenTool } from "@/components/generated-tool/SpecDrivenTool";
import { fallbackRecords, fallbackSpec } from "@/lib/fallback-spec";
import {
  applyClarifyingAnswers,
  firstEntity,
  type WorkflowSpec
} from "@/lib/workflow-spec";

type AnalysisResult = {
  mode: "live-ai" | "cached-fallback";
  message: string;
  reason?: string;
  frames: Array<{ frameIndex: number; timestamp: string }>;
  spec: WorkflowSpec;
};

type Stage = "upload" | "analyzing" | "questions" | "spec" | "mapping" | "tool";

const stages: Array<{ id: Stage; label: string; icon: typeof UploadCloud }> = [
  { id: "upload", label: "Upload", icon: UploadCloud },
  { id: "analyzing", label: "Analyze", icon: ScanLine },
  { id: "questions", label: "Extract", icon: Workflow },
  { id: "spec", label: "Spec", icon: Braces },
  { id: "mapping", label: "Map", icon: Cpu },
  { id: "tool", label: "Tool", icon: Code2 }
];

function stageIndex(stage: Stage) {
  return stages.findIndex((item) => item.id === stage);
}

function stageState(current: Stage, item: Stage) {
  const c = stageIndex(current);
  const i = stageIndex(item);
  if (i < c) return "done" as const;
  if (i === c) return "active" as const;
  return "pending" as const;
}

function Card({
  title,
  eyebrow,
  icon: Icon,
  children,
  action,
  className = ""
}: {
  title: string;
  eyebrow?: string;
  icon?: typeof UploadCloud;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`wt-card animate-fade-up ${className}`}>
      <div className="wt-card-head">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-canvas text-ink-500">
              <Icon size={16} />
            </span>
          ) : null}
          <div>
            {eyebrow ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function WorkTapeApp() {
  const [stage, setStage] = useState<Stage>("upload");
  const [recording, setRecording] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const toolRef = useRef<HTMLDivElement | null>(null);

  const activeSpec = analysis?.spec || fallbackSpec;
  const finalSpec = useMemo(() => applyClarifyingAnswers(activeSpec, answers), [activeSpec, answers]);
  const entity = firstEntity(finalSpec);
  const completedSteps = analysis?.spec.steps.length || 0;
  const detectedFields = analysis?.spec.entities.reduce((sum, item) => sum + item.fields.length, 0) || 0;
  const confidence = analysis ? `${Math.round(analysis.spec.confidence * 100)}%` : "—";

  const proofTiles = [
    {
      label: "Source",
      value: recording ? recording.name : analysis ? "Saved sample recording" : "Upload video",
      detail: recording
        ? `${(recording.size / 1024 / 1024).toFixed(1)} MB workflow recording`
        : "Recorded business workflow",
      icon: FileVideo
    },
    {
      label: "Vision analysis",
      value: analysis ? `${analysis.frames.length} frames` : isAnalyzing ? "Extracting…" : "Not started",
      detail: analysis?.mode === "live-ai" ? "Vision model returned structured JSON" : "ffmpeg samples key frames",
      icon: Sparkles
    },
    {
      label: "Spec",
      value: analysis ? `${completedSteps} steps · ${detectedFields} fields` : "No spec yet",
      detail: `Confidence ${confidence}`,
      icon: Braces
    },
    {
      label: "Generated app",
      value:
        stage === "tool" ? "Live CRM open" : stage === "mapping" || stage === "spec" ? "Ready to map" : "Pending",
      detail: "Forms · statuses · templates · CSV",
      icon: Code2
    }
  ];

  async function analyzeRecording() {
    if (!recording) {
      setError("Upload a screen recording first, or use the saved sample analysis.");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setStage("analyzing");

    const formData = new FormData();
    formData.append("recording", recording);

    try {
      const response = await fetch("/api/analyze-recording", {
        method: "POST",
        body: formData
      });
      const result = (await response.json()) as AnalysisResult;
      setAnalysis(result);
      setAnswers(
        Object.fromEntries(
          result.spec.clarifyingQuestions.map((question) => [
            question.id,
            question.answer || question.defaultAnswer
          ])
        )
      );
      setStage("questions");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Analysis failed.");
      loadSavedAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  }

  function loadSavedAnalysis() {
    const result: AnalysisResult = {
      mode: "cached-fallback",
      message: "Using saved analysis for the sample recording so the demo can continue.",
      reason: "Manual fallback selected.",
      frames: fallbackSpec.sourceEvidence.map((item) => ({
        frameIndex: item.frameIndex,
        timestamp: item.timestamp
      })),
      spec: fallbackSpec
    };
    setAnalysis(result);
    setAnswers(
      Object.fromEntries(
        result.spec.clarifyingQuestions.map((question) => [question.id, question.defaultAnswer])
      )
    );
    setStage("questions");
  }

  function handleFiles(files: FileList | null) {
    setRecording(files?.[0] || null);
    setError("");
  }

  return (
    <main className="min-h-screen text-ink">
      {/* ---------- Top navigation ---------- */}
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white shadow-sm">
              <Clapperboard size={18} />
            </div>
            <div className="leading-tight">
              <p className="text-[15px] font-bold tracking-tight">WorkTape</p>
              <p className="text-[11px] font-medium text-ink-400">the recording is the spec</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-ink-500 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Admissions demo
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cobalt-100 bg-cobalt-50 px-3 py-1.5 text-xs font-semibold text-cobalt-600">
              <Cpu size={13} />
              Generated by Codex
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1520px] flex-col gap-5 px-5 py-6">
        {/* ---------- Hero ---------- */}
        <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          <div className="relative bg-signal-fade">
            <div className="pointer-events-none absolute inset-0 bg-grid [background-size:28px_28px] opacity-60" />
            <div className="relative grid gap-6 px-6 py-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="max-w-2xl">
                <p className="wt-eyebrow">Proof path</p>
                <h1 className="mt-2 text-[28px] font-bold leading-[1.1] tracking-tight text-ink sm:text-[34px]">
                  A real screen recording becomes a{" "}
                  <span className="text-signal-600">working internal tool.</span>
                </h1>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-ink-500">
                  Upload a manual workflow once. WorkTape samples the recording, extracts the steps and
                  business objects, asks a few clarifying questions, and Codex renders a live CRM from the
                  spec — no PRD, no code.
                </p>
              </div>

              {/* Before / after metric strip */}
              <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-line bg-white/70 text-center backdrop-blur">
                <div className="border-r border-line px-5 py-4">
                  <p className="text-2xl font-bold text-ink">12m</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    manual loop
                  </p>
                </div>
                <div className="border-r border-line px-5 py-4">
                  <p className="text-2xl font-bold text-cobalt-600">{analysis ? analysis.frames.length : 0}</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    frames read
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-2xl font-bold text-signal-600">90s</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    tool loop
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline stepper */}
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {stages.map((item, index) => {
                const state = stageState(stage, item.id);
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex min-w-fit items-center gap-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-xl border text-sm font-bold transition-all ${
                          state === "done"
                            ? "border-signal bg-signal text-white"
                            : state === "active"
                              ? "animate-pulse-ring border-signal bg-signal-50 text-signal-700"
                              : "border-line bg-canvas text-ink-300"
                        }`}
                      >
                        {state === "done" ? <Check size={16} /> : <Icon size={16} />}
                      </span>
                      <div className="leading-tight">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-300">
                          0{index + 1}
                        </p>
                        <p
                          className={`text-[13px] font-semibold ${
                            state === "pending" ? "text-ink-300" : "text-ink-700"
                          }`}
                        >
                          {item.label}
                        </p>
                      </div>
                    </div>
                    {index < stages.length - 1 ? (
                      <span
                        className={`mx-2 h-px w-8 ${
                          state === "done" ? "bg-signal-300" : "bg-line"
                        }`}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Proof tiles */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {proofTiles.map((tile, index) => {
                const Icon = tile.icon;
                return (
                  <div
                    key={tile.label}
                    className="group rounded-xl border border-line bg-canvas p-3.5 transition hover:border-ink-200"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink-500 shadow-sm">
                        <Icon size={15} />
                      </span>
                      <span className="font-mono text-[11px] font-bold text-ink-300">0{index + 1}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">
                      {tile.label}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-ink">{tile.value}</p>
                    <p className="mt-0.5 min-h-8 text-[11px] leading-4 text-ink-400">{tile.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Workspace ---------- */}
        <section className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)_440px]">
          {/* Left column */}
          <div className="space-y-5">
            <Card title="Upload recording" eyebrow="Step 01" icon={UploadCloud}>
              <label
                htmlFor="recording-upload"
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  handleFiles(event.dataTransfer.files);
                }}
                className={`block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
                  dragging
                    ? "border-signal bg-signal-50"
                    : "border-ink-200 bg-canvas hover:border-signal/60 hover:bg-signal-50/40"
                }`}
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-ink-500 shadow-sm">
                  <UploadCloud size={22} />
                </div>
                <p className="mt-3 text-sm font-semibold text-ink">Drag &amp; drop a workflow video</p>
                <p className="mt-1 text-xs text-ink-400">MP4, MOV, or WebM — up to 100 MB</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
                  <UploadCloud size={15} />
                  Select video
                </span>
                <input
                  id="recording-upload"
                  type="file"
                  accept="video/*"
                  onChange={(event) => handleFiles(event.target.files)}
                  className="sr-only"
                />
              </label>

              {recording ? (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-white p-3 animate-fade-up">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-cobalt-50 text-cobalt-600">
                    <FileVideo size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{recording.name}</p>
                    <p className="text-xs text-ink-400">{(recording.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <CheckCircle2 size={18} className="text-signal" />
                </div>
              ) : null}

              <div className="mt-4 grid gap-2">
                <button type="button" onClick={analyzeRecording} disabled={isAnalyzing} className="wt-btn-signal">
                  {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
                  Analyze recording
                </button>
                <button type="button" onClick={loadSavedAnalysis} className="wt-btn-ghost">
                  <Wand2 size={15} />
                  Use saved sample
                </button>
              </div>
              {error ? (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
              ) : null}
            </Card>

            <Card title="Live AI analysis" eyebrow="Step 02" icon={ScanLine}>
              {stage === "analyzing" || isAnalyzing ? (
                <div>
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 font-semibold text-signal-700">
                      <Loader2 className="animate-spin" size={16} />
                      Analyzing recording
                    </span>
                    <span className="wt-chip border-signal-200 bg-signal-50 text-signal-700">Running</span>
                  </div>
                  <div className="wt-progress h-2 rounded-full bg-signal-100" />
                  <div className="mt-4 space-y-2 text-xs leading-5 text-ink-600">
                    {[
                      "Extracting key frames with ffmpeg.",
                      "Sending sampled frames to the vision model with high reasoning.",
                      "Validating model output against WorkTape's JSON spec contract."
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-lg bg-canvas px-3 py-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : analysis ? (
                <div
                  className={`rounded-xl border p-4 animate-fade-up ${
                    analysis.mode === "live-ai"
                      ? "border-signal-200 bg-signal-50"
                      : "border-amber-200 bg-amber-50/60"
                  }`}
                >
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    {analysis.mode === "live-ai" ? (
                      <Sparkles size={16} className="text-signal-600" />
                    ) : (
                      <FileVideo size={16} className="text-amber-500" />
                    )}
                    {analysis.mode === "live-ai" ? "Live AI analysis complete" : "Saved analysis fallback"}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-ink-600">{analysis.message}</p>
                  {analysis.reason ? (
                    <p className="mt-2 text-xs leading-5 text-ink-400">Reason: {analysis.reason}</p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm leading-6 text-ink-500">
                  Upload a recording to run the real AI backend path, or use the saved sample for a
                  deterministic demo.
                </p>
              )}
            </Card>

            <Card
              title="Sampled frames"
              eyebrow="Evidence"
              icon={FileVideo}
              action={
                analysis?.frames.length ? (
                  <span className="wt-chip">{analysis.frames.length} frames</span>
                ) : null
              }
            >
              {analysis?.frames.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {analysis.frames.map((frame) => (
                    <div
                      key={`${frame.frameIndex}-${frame.timestamp}`}
                      className="flex items-center gap-2.5 rounded-lg border border-line bg-canvas p-2"
                    >
                      <div className="grid h-10 w-12 place-items-center rounded-md bg-ink-800 font-mono text-[11px] font-bold text-signal-300">
                        {String(frame.frameIndex).padStart(2, "0")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold">{frame.timestamp}</p>
                        <p className="truncate text-[10px] text-ink-400">key frame</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-400">Frames appear here after analysis.</p>
              )}
            </Card>
          </div>

          {/* Middle column — workflow */}
          <Card
            title="Extracted workflow"
            eyebrow="Step 03"
            icon={Workflow}
            action={
              <span className="wt-chip border-signal-200 bg-signal-50 text-signal-700">
                {completedSteps || "No"} steps detected
              </span>
            }
          >
            {analysis ? (
              <div>
                <p className="mb-5 rounded-xl border border-line bg-canvas p-4 text-sm leading-6 text-ink-600">
                  {activeSpec.workflowSummary}
                </p>
                <div className="relative space-y-3 pl-9">
                  <div className="absolute left-[17px] top-4 bottom-4 w-px bg-gradient-to-b from-signal-300 via-signal-200 to-transparent" />
                  {activeSpec.steps.map((step) => (
                    <div
                      key={step.order}
                      className="relative rounded-xl border border-line bg-white p-4 transition hover:border-signal-200 hover:shadow-card"
                    >
                      <span className="absolute -left-9 top-4 grid h-9 w-9 place-items-center rounded-full border-4 border-white bg-signal text-xs font-bold text-white shadow-sm">
                        {step.order}
                      </span>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                          <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs leading-5 text-ink-500">
                            <span className="rounded-md bg-canvas px-2 py-0.5 font-medium">{step.input}</span>
                            <ArrowRight size={12} className="text-ink-300" />
                            <span className="rounded-md bg-signal-50 px-2 py-0.5 font-medium text-signal-700">
                              {step.output}
                            </span>
                          </p>
                        </div>
                        {step.tools.length ? (
                          <span className="shrink-0 rounded-full bg-ink-50 px-2.5 py-1 text-[11px] font-semibold text-ink-500">
                            {step.tools.join(" · ")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid min-h-[440px] place-items-center rounded-xl border border-dashed border-ink-200 bg-canvas text-center">
                <div className="px-6">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-ink-300 shadow-sm">
                    <Workflow size={26} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">Workflow steps appear here</p>
                  <p className="mt-1 text-sm text-ink-400">
                    The chain stays visible end-to-end: recording → spec → generated tool.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Right column — spec + questions */}
          <div className="space-y-5">
            <Card
              title="Detected objects"
              eyebrow="Step 04"
              icon={Database}
              action={
                <span className="wt-chip border-cobalt-100 bg-cobalt-50 text-cobalt-600">
                  {detectedFields || "No"} fields
                </span>
              }
            >
              {analysis ? (
                <div className="space-y-3">
                  {activeSpec.entities.map((item) => (
                    <div key={item.name} className="rounded-xl border border-line bg-white p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-cobalt-50 text-cobalt-600">
                          <Database size={17} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{item.label}</p>
                          <p className="text-xs text-ink-400">{item.fields.length} fields detected</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-ink-500">{item.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.fields.map((field) => (
                          <span
                            key={field.name}
                            className="rounded-md border border-line bg-canvas px-2 py-1 font-mono text-[11px] font-medium text-ink-600"
                          >
                            {field.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
                    <p className="text-sm font-semibold text-ink">Manual pain points</p>
                    <ul className="mt-2 space-y-1.5">
                      {activeSpec.painPoints.map((point) => (
                        <li key={point} className="flex gap-2 text-sm leading-6 text-ink-600">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-ink-400">Detected objects, fields, and rules appear here.</p>
              )}
            </Card>

            <Card title="Clarifying questions" eyebrow="Step 05" icon={HelpCircle}>
              {analysis ? (
                <div className="space-y-3.5">
                  {activeSpec.clarifyingQuestions.map((question) => (
                    <label key={question.id} className="block">
                      <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-ink-700">
                        <HelpCircle size={14} className="text-amber-500" />
                        {question.question}
                      </span>
                      <input
                        value={answers[question.id] || ""}
                        onChange={(event) =>
                          setAnswers((current) => ({ ...current, [question.id]: event.target.value }))
                        }
                        className="wt-input"
                      />
                    </label>
                  ))}
                  <button type="button" onClick={() => setStage("spec")} className="wt-btn-primary w-full">
                    Create final spec
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-ink-400">WorkTape asks only the missing business rules.</p>
              )}
            </Card>
          </div>
        </section>

        {/* ---------- Spec + mapping ---------- */}
        {stage === "spec" || stage === "mapping" || stage === "tool" ? (
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
            <Card
              title="Final app spec"
              eyebrow="Step 06 · JSON contract"
              icon={Braces}
              action={
                <button type="button" onClick={() => setStage("mapping")} className="wt-btn-ghost px-3 py-1.5 text-xs">
                  <Cpu size={14} />
                  Show mapping
                </button>
              }
            >
              <div className="overflow-hidden rounded-xl border border-ink-800 bg-ink-900">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-signal-400/70" />
                  <span className="ml-2 font-mono text-[11px] text-white/40">workflow-spec.json</span>
                </div>
                <pre className="scrollbar-slim max-h-[460px] overflow-auto p-4 font-mono text-[12px] leading-[1.6] text-slate-100">
                  {JSON.stringify(finalSpec, null, 2)}
                </pre>
              </div>
            </Card>

            <Card title="Spec → app mapping" eyebrow="Codex build plan" icon={Cpu}>
              <div className="space-y-2.5">
                {[
                  `${entity.label} entity → intake form`,
                  `${entity.fields.length} fields → inputs + table columns`,
                  `${finalSpec.statuses.length} status groups → controls`,
                  `${finalSpec.messageTemplates.length} templates → copy buttons`,
                  `${finalSpec.exportRequirements.format.toUpperCase()} export → spec fields`
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 text-sm font-medium text-ink-700"
                  >
                    <CheckCircle2 size={17} className="shrink-0 text-signal" />
                    {item}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setStage("tool")} className="wt-btn-signal mt-4 w-full">
                Open generated internal tool
                <ArrowRight size={16} />
              </button>
            </Card>
          </section>
        ) : null}

        {/* ---------- Generated tool ---------- */}
        {stage === "tool" ? (
          <div ref={toolRef} className="animate-fade-up">
            <SpecDrivenTool spec={finalSpec} initialRecords={fallbackRecords} />
          </div>
        ) : null}

        <footer className="flex flex-col items-center gap-1 py-6 text-center">
          <p className="text-xs font-semibold text-ink-400">
            WorkTape · a screen recording compiled into working software
          </p>
          <p className="text-[11px] text-ink-300">The recording is the spec.</p>
        </footer>
      </div>
    </main>
  );
}
