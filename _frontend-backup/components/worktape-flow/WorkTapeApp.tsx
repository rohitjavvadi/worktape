"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  Code2,
  Database,
  FileVideo,
  HelpCircle,
  ListChecks,
  Loader2,
  Play,
  Sparkles,
  UploadCloud,
  Workflow
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

const stages: Array<{ id: Stage; label: string }> = [
  { id: "upload", label: "Upload recording" },
  { id: "analyzing", label: "Analyze" },
  { id: "questions", label: "Extract workflow" },
  { id: "spec", label: "Generate spec" },
  { id: "mapping", label: "Map to tool" },
  { id: "tool", label: "Open tool" }
];

function Panel({
  title,
  children,
  action,
  tone = "default"
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <section
      className={`rounded-[8px] border border-line ${
        tone === "muted" ? "bg-slate-50/80" : "bg-white"
      } shadow-soft`}
    >
      <div className="flex min-h-14 items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function stageState(current: Stage, item: Stage) {
  const currentIndex = stages.findIndex((stage) => stage.id === current);
  const itemIndex = stages.findIndex((stage) => stage.id === item);
  if (itemIndex < currentIndex) return "done";
  if (itemIndex === currentIndex) return "active";
  return "pending";
}

export function WorkTapeApp() {
  const [stage, setStage] = useState<Stage>("upload");
  const [recording, setRecording] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const activeSpec = analysis?.spec || fallbackSpec;
  const finalSpec = useMemo(() => applyClarifyingAnswers(activeSpec, answers), [activeSpec, answers]);
  const entity = firstEntity(finalSpec);
  const completedSteps = analysis?.spec.steps.length || 0;
  const detectedFields = analysis?.spec.entities.reduce((sum, item) => sum + item.fields.length, 0) || 0;
  const confidence = analysis ? `${Math.round(analysis.spec.confidence * 100)}%` : "Waiting";
  const proofTiles = [
    {
      label: "Source",
      value: recording ? recording.name : analysis ? "Saved sample recording" : "Upload video",
      detail: recording ? `${(recording.size / 1024 / 1024).toFixed(1)} MB workflow recording` : "Recorded business workflow",
      icon: FileVideo
    },
    {
      label: "Vision analysis",
      value: analysis ? `${analysis.frames.length} frames` : isAnalyzing ? "Extracting frames" : "Not started",
      detail: analysis?.mode === "live-ai" ? "OpenAI vision returned structured JSON" : "ffmpeg samples key frames",
      icon: Sparkles
    },
    {
      label: "Spec",
      value: analysis ? `${completedSteps} steps, ${detectedFields} fields` : "No spec yet",
      detail: `Confidence ${confidence}`,
      icon: Braces
    },
    {
      label: "Generated app",
      value: stage === "tool" ? "Live CRM open" : stage === "mapping" || stage === "spec" ? "Ready to map" : "Pending",
      detail: "Forms, status controls, templates, CSV",
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

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-ink">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-4">
        <header className="rounded-[8px] border border-line bg-white px-4 py-3 shadow-soft">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-emerald-600 text-white">
                <Workflow size={21} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">WorkTape</h1>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    Admissions demo
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {"Screen recording -> AI workflow spec -> generated internal tool"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {stages.map((item, index) => {
                const state = stageState(stage, item.id);
                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-bold ${
                        state === "done"
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : state === "active"
                            ? "border-emerald-600 bg-white text-emerald-700"
                            : "border-line bg-slate-50 text-slate-400"
                      }`}
                    >
                      {state === "done" ? <Check size={15} /> : index + 1}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        state === "pending" ? "text-slate-400" : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </span>
                    {index < stages.length - 1 ? <span className="h-px w-6 bg-line" /> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <section className="rounded-[8px] border border-line bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-signal">
                  Proof path
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  A real recording becomes a working internal tool.
                </h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  Watch WorkTape sample the recording, extract the workflow, turn it into a structured
                  spec, and render the internal tool from that spec.
                </p>
              </div>
              <div className="grid grid-cols-3 overflow-hidden rounded-[8px] border border-line bg-slate-50 text-center">
                <div className="border-r border-line px-4 py-3">
                  <p className="text-lg font-semibold text-ink">12 min</p>
                  <p className="text-xs font-semibold text-slate-500">manual loop</p>
                </div>
                <div className="border-r border-line px-4 py-3">
                  <p className="text-lg font-semibold text-cobalt">{analysis ? analysis.frames.length : 0}</p>
                  <p className="text-xs font-semibold text-slate-500">frames read</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-lg font-semibold text-signal">90 sec</p>
                  <p className="text-xs font-semibold text-slate-500">tool loop</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {proofTiles.map((tile, index) => {
                const Icon = tile.icon;
                return (
                  <div key={tile.label} className="rounded-[8px] border border-line bg-slate-50 p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-white text-slate-600 shadow-sm">
                        <Icon size={16} />
                      </span>
                      <span className="text-xs font-bold text-slate-400">0{index + 1}</span>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {tile.label}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-ink">{tile.value}</p>
                    <p className="mt-1 min-h-8 text-xs leading-4 text-slate-500">{tile.detail}</p>
                  </div>
                );
              })}
            </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[390px_minmax(0,1fr)_500px]">
          <div className="space-y-4">
            <Panel title="Upload recording">
              <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-slate-500 shadow-sm">
                  <UploadCloud size={24} />
                </div>
                <p className="mt-3 text-sm font-semibold">Drag, drop, or select a workflow video</p>
                <p className="mt-1 text-xs text-slate-500">MP4, MOV, or WebM up to 100 MB</p>
                <input
                  id="recording-upload"
                  type="file"
                  accept="video/*"
                  onChange={(event) => setRecording(event.target.files?.[0] || null)}
                  className="sr-only"
                />
                <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                  <label
                    htmlFor="recording-upload"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    <UploadCloud size={16} />
                    Select video
                  </label>
                  <span className="max-w-full truncate rounded-[6px] border border-line bg-white px-3 py-2 text-sm font-medium text-slate-600">
                    {recording ? recording.name : "No video selected"}
                  </span>
                </div>
              </div>

              {recording ? (
                <div className="mt-3 flex items-center gap-3 rounded-[8px] border border-line bg-white p-3">
                  <FileVideo size={18} className="text-cobalt" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{recording.name}</p>
                    <p className="text-xs text-slate-500">
                      {(recording.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <CheckCircle2 size={18} className="text-signal" />
                </div>
              ) : null}

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={analyzeRecording}
                  disabled={isAnalyzing}
                  className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
                  Analyze recording
                </button>
                <button
                  type="button"
                  onClick={loadSavedAnalysis}
                  className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink"
                >
                  Use saved sample
                </button>
              </div>
              {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
            </Panel>

            <Panel title="Live AI analysis">
              {stage === "analyzing" || isAnalyzing ? (
                <div>
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 font-semibold text-emerald-700">
                      <Loader2 className="animate-spin" size={16} />
                      Analyzing recording
                    </span>
                    <span className="font-semibold text-emerald-700">Running</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="worktape-progress h-full w-1/2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="mt-4 space-y-2 text-xs leading-5 text-slate-600">
                    {[
                      "Extracting key frames with ffmpeg.",
                      "Sending sampled frames to gpt-5.5 vision with high reasoning.",
                      "Validating the model output against WorkTape's JSON spec contract."
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-[6px] bg-slate-50 px-2.5 py-2">
                        <ListChecks size={14} className="text-emerald-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : analysis ? (
                <div
                  className={`rounded-[8px] border p-4 ${
                    analysis.mode === "live-ai"
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    <span className="inline-flex items-center gap-2">
                      {analysis.mode === "live-ai" ? <Sparkles size={16} /> : <FileVideo size={16} />}
                      {analysis.mode === "live-ai" ? "Live AI analysis complete" : "Saved analysis fallback"}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{analysis.message}</p>
                  {analysis.reason ? (
                    <p className="mt-2 text-xs leading-5 text-slate-500">Reason: {analysis.reason}</p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Upload a recording to start the real AI backend path, or use the saved sample for a
                  deterministic demo.
                </p>
              )}
            </Panel>

            <Panel title="Frames">
              {analysis?.frames.length ? (
                <div className="space-y-2">
                  {analysis.frames.map((frame) => (
                    <div
                      key={`${frame.frameIndex}-${frame.timestamp}`}
                      className="flex items-center gap-3 rounded-[8px] border border-line bg-white p-2"
                    >
                      <div className="grid h-12 w-16 place-items-center rounded-[6px] bg-slate-100 text-xs font-semibold text-slate-500">
                        {frame.frameIndex}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{frame.timestamp}</p>
                        <p className="text-xs text-slate-500">Sampled video frame</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Frames appear here after analysis.</p>
              )}
            </Panel>
          </div>

          <Panel
            title="Workflow"
            action={
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {completedSteps || "No"} steps detected
              </span>
            }
          >
            {analysis ? (
              <div>
                <p className="mb-5 rounded-[8px] bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {activeSpec.workflowSummary}
                </p>
                <div className="relative space-y-4 pl-8">
                  <div className="absolute left-[15px] top-3 h-[calc(100%-24px)] w-0.5 bg-emerald-200" />
                  {activeSpec.steps.map((step) => (
                    <div key={step.order} className="relative rounded-[8px] border border-line bg-white p-4">
                      <span className="absolute -left-8 top-4 grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        {step.order}
                      </span>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold">{step.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {step.input} -&gt; {step.output}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                          {step.tools.join(", ") || "Observed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid min-h-[420px] place-items-center rounded-[8px] border border-dashed border-slate-300 bg-slate-50 text-center">
                <div>
                  <Workflow className="mx-auto text-slate-400" size={34} />
                  <p className="mt-3 text-sm font-semibold">Workflow steps will appear here</p>
                  <p className="mt-1 text-sm text-slate-500">
                    The demo keeps the chain visible from recording to generated tool.
                  </p>
                </div>
              </div>
            )}
          </Panel>

          <div className="space-y-4">
            <Panel
              title="Spec"
              action={
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {detectedFields || "No"} fields
                </span>
              }
            >
              {analysis ? (
                <div className="space-y-3">
                  {activeSpec.entities.map((item) => (
                    <div key={item.name} className="rounded-[8px] border border-line bg-white p-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-[6px] bg-slate-100 text-slate-600">
                          <Database size={17} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.fields.length} fields detected</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-500">{item.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.fields.map((field) => (
                          <span
                            key={field.name}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                          >
                            {field.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="rounded-[8px] border border-line bg-white p-3">
                    <p className="text-sm font-semibold">Pain points</p>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                      {activeSpec.painPoints.map((point) => (
                        <li key={point}>- {point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Detected objects, fields, and rules appear here.</p>
              )}
            </Panel>

            <Panel title="Questions for review">
              {analysis ? (
                <div className="space-y-3">
                  {activeSpec.clarifyingQuestions.map((question) => (
                    <label key={question.id} className="block">
                      <span className="mb-1 flex items-center gap-2 text-sm font-semibold">
                        <HelpCircle size={15} className="text-amber-500" />
                        {question.question}
                      </span>
                      <input
                        value={answers[question.id] || ""}
                        onChange={(event) =>
                          setAnswers((current) => ({ ...current, [question.id]: event.target.value }))
                        }
                        className="w-full rounded-[6px] border border-line px-3 py-2 text-sm outline-none focus:border-cobalt"
                      />
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStage("spec")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Create final spec
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500">WorkTape asks only the missing business rules.</p>
              )}
            </Panel>
          </div>
        </section>

        {stage === "spec" || stage === "mapping" || stage === "tool" ? (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_500px]">
            <Panel
              title="Final app spec JSON"
              action={
                <button
                  type="button"
                  onClick={() => setStage("mapping")}
                  className="inline-flex items-center gap-2 rounded-[6px] border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  <Braces size={14} />
                  Show mapping
                </button>
              }
            >
              <pre className="max-h-[420px] overflow-auto rounded-[8px] bg-[#0f172a] p-4 text-xs leading-5 text-slate-100">
                {JSON.stringify(finalSpec, null, 2)}
              </pre>
            </Panel>

            <Panel title="Spec-to-app mapping">
              <div className="space-y-3">
                {[
                  `${entity.label} entity mapped to intake form`,
                  `${entity.fields.length} fields mapped to inputs and table columns`,
                  `${finalSpec.statuses.length} status groups mapped to controls`,
                  `${finalSpec.messageTemplates.length} templates mapped to copy buttons`,
                  `${finalSpec.exportRequirements.format.toUpperCase()} export mapped from spec fields`
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[8px] border border-line p-3">
                    <CheckCircle2 size={18} className="text-signal" />
                    <p className="text-sm font-medium text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStage("tool")}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Open generated internal tool
                <Workflow size={16} />
              </button>
            </Panel>
          </section>
        ) : null}

        {stage === "tool" ? <SpecDrivenTool spec={finalSpec} initialRecords={fallbackRecords} /> : null}
      </div>
    </main>
  );
}
