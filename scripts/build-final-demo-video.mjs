import { execFile } from "node:child_process";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const outDir = path.resolve("demo-assets/final-demo");
const frameDir = path.join(outDir, "storyboard-frames");
const desktopVideo = path.join(process.env.HOME || ".", "Desktop", "WorkTape-Final-Demo-Draft.mp4");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(text, width = 52) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > width && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function textLines(lines, x, y, size, color = "#0f172a", weight = 600, gap = 12, width = 56) {
  return lines
    .flatMap((line) => wrapText(line, width))
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * (size + gap)}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`
    )
    .join("\n");
}

async function imageDataUri(filePath) {
  const bytes = await readFile(filePath);
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

async function slideSvg(slide, index) {
  const image = slide.image ? await imageDataUri(slide.image) : "";
  const titleLines = wrapText(slide.title, slide.image ? 24 : 34);
  const titleBlock = titleLines
    .map(
      (line, titleIndex) =>
        `<text x="92" y="${228 + titleIndex * 50}" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="900" fill="#0f172a">${escapeXml(line)}</text>`
    )
    .join("\n");
  const bulletY = 292 + Math.max(0, titleLines.length - 1) * 50;
  const imageBlock = image
    ? `<rect x="646" y="146" width="552" height="402" rx="22" fill="#ffffff" stroke="#dbe4ef" stroke-width="2"/>
       <image href="${image}" x="666" y="166" width="512" height="362" preserveAspectRatio="xMidYMid meet"/>`
    : "";
  const bullets = textLines(
    slide.bullets || [],
    92,
    bulletY,
    slide.image ? 23 : 27,
    "#334155",
    600,
    12,
    slide.image ? 33 : 56
  );
  const caption = textLines([slide.caption], 92, 620, 24, "#ffffff", 700, 8);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset="1" stop-color="#eef7f3"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect x="38" y="36" width="1204" height="648" rx="34" fill="#ffffff" stroke="#d8e0ea" stroke-width="2"/>
  <rect x="72" y="70" width="52" height="52" rx="16" fill="#0f172a"/>
  <text x="142" y="104" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="900" fill="#0f172a">WorkTape</text>
  <text x="1084" y="104" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" fill="#64748b">Final demo draft</text>
  <text x="92" y="184" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="3" fill="${slide.accent || "#059669"}">${escapeXml(slide.kicker)}</text>
  ${titleBlock}
  ${bullets}
  ${imageBlock}
  <rect x="72" y="594" width="1136" height="70" rx="22" fill="#0f172a"/>
  ${caption}
  <text x="1134" y="638" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="900" fill="#94a3b8">${String(index + 1).padStart(2, "0")}</text>
</svg>`;
}

async function renderSvgToPng(svgPath, pngPath) {
  await execFileAsync(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1280,720",
    `--screenshot=${pngPath}`,
    `file://${svgPath}`
  ]);
}

const slides = [
  {
    kicker: "THE PROBLEM",
    title: "Small businesses do work before they can describe software.",
    bullets: [
      "Leads, appointments, payments, and tickets still move through chats and sheets.",
      "The painful part is not building forms. It is turning messy repeated work into a clear spec."
    ],
    caption: "WorkTape starts from observed work, not a blank prompt.",
    duration: 8,
    accent: "#2563eb"
  },
  {
    kicker: "THE CORE LOOP",
    title: "A recording becomes the spec.",
    bullets: [
      "Upload a screen recording of one manual workflow.",
      "The backend samples frames with ffmpeg and sends them to OpenAI vision.",
      "The model returns strict workflow JSON that drives the generated tool."
    ],
    image: "demo-assets/final-demo/current-home.png",
    caption: "This is the product promise: screen recording -> workflow spec -> internal tool.",
    duration: 9
  },
  {
    kicker: "LIVE AI TEST",
    title: "We tested beyond the admissions demo.",
    bullets: [
      "Clinic appointments: live AI, 3 frames, 90% confidence.",
      "Invoice collections: live AI, 3 frames, 91% confidence.",
      "Repair service tickets: live AI, 3 frames, 86% confidence."
    ],
    caption: "The broader tests produced real specs, but they do not yet prove universal generalization.",
    duration: 10,
    accent: "#7c3aed"
  },
  {
    kicker: "ANALYSIS",
    title: "The backend extracts objects, fields, statuses, and questions.",
    bullets: [
      "Each result included business entities, fields, statuses, message templates, screens, and clarifying questions.",
      "This keeps the final app grounded in what the recording showed."
    ],
    image: "demo-assets/screenshots/wednesday-checkpoint/02-extracted-workflow.png",
    caption: "Judges can see the causal chain instead of only seeing a prebuilt CRM.",
    duration: 9
  },
  {
    kicker: "SPEC",
    title: "The JSON contract is the handoff.",
    bullets: [
      "The app spec is structured JSON, not an informal text summary.",
      "The renderer reads that spec to create forms, tables, controls, templates, and CSV export."
    ],
    image: "demo-assets/screenshots/wednesday-checkpoint/03-spec-mapping.png",
    caption: "For the MVP, runtime Codex SDK is optional; the visible generation is honest spec-to-app mapping.",
    duration: 9,
    accent: "#d97706"
  },
  {
    kicker: "GENERATED TOOL",
    title: "The user gets a live internal app.",
    bullets: [
      "A usable dashboard opens from the final spec.",
      "The records are editable, statuses are controlled, templates copy to clipboard, and CSV export works."
    ],
    image: "demo-assets/screenshots/wednesday-checkpoint/04-generated-tool.png",
    caption: "The generated CRM is not a separate static page; it is rendered from the workflow spec.",
    duration: 10
  },
  {
    kicker: "HONEST SCOPE",
    title: "Strong wedge, not fake universality.",
    bullets: [
      "Best demo path: WhatsApp or chat plus spreadsheet lead operations.",
      "Broader business workflows can produce specs, based on today's live tests.",
      "The final submission should say architecture is generalizing, not that every random video works."
    ],
    caption: "This keeps the promise ambitious without making a claim the MVP has not earned.",
    duration: 9,
    accent: "#dc2626"
  },
  {
    kicker: "SUNDAY PROOF",
    title: "What the final video should show.",
    bullets: [
      "Before: manual workflow recording.",
      "WorkTape: upload, frame analysis, extracted spec, clarifying questions.",
      "After: use the generated CRM live and export data."
    ],
    caption: "The full path should be deterministic under 90 seconds, with fallback clearly labeled only if needed.",
    duration: 8,
    accent: "#0891b2"
  },
  {
    kicker: "LIVE LINKS",
    title: "Submission-ready assets.",
    bullets: [
      "App: https://worktape.javvadi.in/",
      "Phase 1 viewer: https://worktape.javvadi.in/phase-1-presentation",
      "Demo draft video is saved locally and on the Desktop."
    ],
    caption: "Next step: record one polished human walkthrough over this reliable product path.",
    duration: 7,
    accent: "#059669"
  }
];

const narration = `WorkTape turns a screen recording of repetitive business work into a working internal tool.

Small businesses already know their work, but they often cannot write a product spec. They manage leads, appointments, invoices, and service tickets across chats, spreadsheets, and manual follow ups.

WorkTape starts where they are. The user uploads a workflow recording. The backend extracts key frames with ffmpeg, sends those frames to an OpenAI vision model, and receives a strict JSON workflow spec.

That spec captures the steps, business objects, fields, statuses, actions, message templates, screens, validation rules, and clarifying questions.

The generated app is rendered from that spec. For the hackathon wedge, the clean demo is WhatsApp or chat plus spreadsheet work becoming a small admissions or lead-management CRM.

Today I also tested three other workflows: clinic appointments, invoice collections, and repair service tickets. All three returned live AI specs, not fallback specs. That means the architecture is beginning to generalize, while the final claim should still stay honest: this is a strong MVP path, not proof that every random video generates every kind of app.

For the final Sunday demo, the proof is simple. Show the manual workflow, upload the recording, show WorkTape extracting the spec, answer the clarifying questions, then open the live generated CRM and use it.`;

await mkdir(outDir, { recursive: true });
await rm(frameDir, { recursive: true, force: true });
await mkdir(frameDir, { recursive: true });

const pngPaths = [];
for (const [index, slide] of slides.entries()) {
  const svgPath = path.join(frameDir, `slide-${String(index + 1).padStart(2, "0")}.svg`);
  const pngPath = path.join(frameDir, `slide-${String(index + 1).padStart(2, "0")}.png`);
  await writeFile(svgPath, await slideSvg(slide, index));
  await renderSvgToPng(svgPath, pngPath);
  pngPaths.push({ path: pngPath, duration: slide.duration });
}

const concatPath = path.join(frameDir, "concat.txt");
await writeFile(
  concatPath,
  `${pngPaths.map((item) => `file '${item.path}'\nduration ${item.duration}`).join("\n")}\nfile '${pngPaths.at(-1).path}'\n`
);

const mutedVideo = path.join(outDir, "worktape-final-demo-draft-muted.mp4");
const narrationPath = path.join(outDir, "worktape-final-demo-narration.aiff");
const narrationTextPath = path.join(outDir, "worktape-final-demo-script.txt");
const finalVideo = path.join(outDir, "WorkTape-Final-Demo-Draft.mp4");

await writeFile(narrationTextPath, narration);
await execFileAsync("ffmpeg", [
  "-hide_banner",
  "-loglevel",
  "error",
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  concatPath,
  "-vf",
  "fps=30,format=yuv420p",
  "-c:v",
  "libx264",
  "-movflags",
  "+faststart",
  mutedVideo
]);

await execFileAsync("say", ["-v", "Samantha", "-r", "172", "-o", narrationPath, "-f", narrationTextPath]);
await execFileAsync("ffmpeg", [
  "-hide_banner",
  "-loglevel",
  "error",
  "-y",
  "-i",
  mutedVideo,
  "-i",
  narrationPath,
  "-c:v",
  "copy",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  finalVideo
]);

await copyFile(finalVideo, desktopVideo);

console.log(finalVideo);
console.log(desktopVideo);
