import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { fallbackSpec } from "@/lib/fallback-spec";
import {
  type WorkflowSpec,
  workflowSpecJsonSchema,
  workflowSpecSchema
} from "@/lib/workflow-spec";

export const runtime = "nodejs";

type ExtractedFrame = {
  frameIndex: number;
  timestamp: string;
  dataUrl: string;
};

const execFileAsync = promisify(execFile);
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const DEFAULT_WORKFLOW_TIMEOUT_MS = 10 * 60 * 1000;

function logAnalysis(message: string, details?: Record<string, unknown>) {
  console.log(
    `[worktape:analysis] ${new Date().toISOString()} ${message}`,
    details ? JSON.stringify(details) : ""
  );
}

function stripNulls(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripNulls);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== null)
        .map(([key, entryValue]) => [key, stripNulls(entryValue)])
    );
  }

  return value;
}

function fallbackResponse(reason: string, frames: ExtractedFrame[] = []) {
  logAnalysis("using fallback", { reason, frames: frames.length });
  return NextResponse.json({
    mode: "cached-fallback",
    message: "Using saved analysis for the sample recording so the demo can continue.",
    reason,
    frames: frames.map(({ frameIndex, timestamp }) => ({ frameIndex, timestamp })),
    spec: fallbackSpec
  });
}

async function extractFramesFromVideo(file: File): Promise<ExtractedFrame[]> {
  logAnalysis("frame extraction started", {
    filename: file.name,
    sizeBytes: file.size,
    type: file.type || "unknown"
  });
  const bytes = Buffer.from(await file.arrayBuffer());
  const workDir = path.join(tmpdir(), `worktape-${Date.now()}`);
  const inputPath = path.join(workDir, "recording.mp4");
  const outputPattern = path.join(workDir, "frame-%03d.jpg");

  await mkdir(workDir, { recursive: true });
  await writeFile(inputPath, bytes);

  try {
    if (!ffmpegPath) {
      throw new Error("ffmpeg binary was not found.");
    }

    await execFileAsync(ffmpegPath, [
      "-y",
      "-i",
      inputPath,
      "-vf",
      "fps=1/4,scale='min(1280,iw)':-2",
      "-frames:v",
      "12",
      "-q:v",
      "4",
      outputPattern
    ]);

    const frames: ExtractedFrame[] = [];
    for (let index = 1; index <= 12; index += 1) {
      const framePath = path.join(workDir, `frame-${String(index).padStart(3, "0")}.jpg`);
      try {
        const frame = await readFile(framePath);
        frames.push({
          frameIndex: index,
          timestamp: `00:${String((index - 1) * 4).padStart(2, "0")}`,
          dataUrl: `data:image/jpeg;base64,${frame.toString("base64")}`
        });
      } catch {
        break;
      }
    }

    logAnalysis("frame extraction completed", {
      frames: frames.length,
      timestamps: frames.map((frame) => frame.timestamp)
    });
    return frames;
  } finally {
    await rm(workDir, { force: true, recursive: true });
  }
}

async function analyzeFrames(frames: ExtractedFrame[]): Promise<WorkflowSpec> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_WORKFLOW_MODEL || "gpt-5.5";
  const timeout = Number(process.env.OPENAI_WORKFLOW_TIMEOUT_MS || DEFAULT_WORKFLOW_TIMEOUT_MS);
  const content = [
    {
      type: "input_text",
      text:
        "You are WorkTape's workflow analyst. Inspect these sampled screen-recording frames from a repetitive business workflow. Return a strict workflow/app spec JSON for a small internal tool. The first MVP is likely a WhatsApp plus spreadsheet lead qualification/admissions workflow, but only include fields, statuses, screens, and templates supported by the frames. Keep the app narrow and practical. Do not invent integrations. WhatsApp API is out of scope; use copyable message templates instead."
    },
    ...frames.map((frame) => ({
      type: "input_image",
      image_url: frame.dataUrl,
      detail: "low"
    }))
  ];

  logAnalysis("OpenAI workflow analysis started", {
    model,
    reasoningEffort: "high",
    timeoutMs: timeout,
    frames: frames.length
  });

  const startedAt = Date.now();
  const response = await client.responses.create(
    {
      model,
      input: [
        {
          role: "user",
          content
        }
      ] as OpenAI.Responses.ResponseCreateParams["input"],
      reasoning: {
        effort: "high"
      },
      text: {
        format: {
          type: "json_schema",
          name: "workflow_spec",
          schema: workflowSpecJsonSchema,
          strict: true
        }
      }
    },
    { timeout }
  );

  const outputText = response.output_text;
  if (!outputText) {
    throw new Error("OpenAI response did not include output_text.");
  }

  const spec = workflowSpecSchema.parse(stripNulls(JSON.parse(outputText)));
  logAnalysis("OpenAI workflow analysis completed", {
    elapsedMs: Date.now() - startedAt,
    entityCount: spec.entities.length,
    stepCount: spec.steps.length
  });
  return spec;
}

export async function POST(request: Request) {
  logAnalysis("analysis request received");
  const formData = await request.formData();
  const file = formData.get("recording");

  if (!(file instanceof File) || file.size === 0) {
    return fallbackResponse("No recording file was provided.");
  }

  if (file.size > MAX_VIDEO_BYTES) {
    return fallbackResponse("Recording is larger than the 100 MB Wednesday MVP limit.");
  }

  let frames: ExtractedFrame[] = [];
  try {
    frames = await extractFramesFromVideo(file);
  } catch (error) {
    return fallbackResponse(
      error instanceof Error ? `Frame extraction failed: ${error.message}` : "Frame extraction failed."
    );
  }

  if (frames.length === 0) {
    return fallbackResponse("No frames could be extracted from the recording.");
  }

  if (!process.env.OPENAI_API_KEY) {
    return fallbackResponse("OPENAI_API_KEY is not configured.", frames);
  }

  try {
    const spec = await analyzeFrames(frames);
    logAnalysis("analysis request completed with live AI", {
      frames: frames.length,
      entityCount: spec.entities.length
    });
    return NextResponse.json({
      mode: "live-ai",
      message: "Live frame analysis completed with OpenAI vision.",
      frames: frames.map(({ frameIndex, timestamp }) => ({ frameIndex, timestamp })),
      spec
    });
  } catch (error) {
    logAnalysis("OpenAI workflow analysis failed", {
      error: error instanceof Error ? error.message : String(error)
    });
    return fallbackResponse(
      error instanceof Error ? `OpenAI analysis failed: ${error.message}` : "OpenAI analysis failed.",
      frames
    );
  }
}
