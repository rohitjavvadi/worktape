import { execFile as execFileCallback } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);

const root = process.cwd();
const sourceVideo = "/Users/rohitjavvadi/Desktop/export-1780227543663.mp4";
const problemSlide = path.join(root, "demo-assets/final-demo/storyboard-frames/slide-01.png");
const outDir = path.join(root, "demo-assets/final-submission-video");
const desktopFinal = "/Users/rohitjavvadi/Desktop/WorkTape-Final-Submission-Demo.mp4";
const localFinal = path.join(outDir, "WorkTape-Final-Submission-Demo.mp4");
const mutedVideo = path.join(outDir, "worktape-final-demo-muted.mp4");
const voiceMp3 = path.join(outDir, "worktape-final-demo-voiceover.mp3");
const fallbackAiff = path.join(outDir, "worktape-final-demo-voiceover.aiff");
const scriptPath = path.join(outDir, "final-demo-script.md");
const timestampsPath = path.join(outDir, "timestamps.md");
const editPlanPath = path.join(outDir, "edit-plan.md");
const captionsPath = path.join(outDir, "captions.srt");

mkdirSync(outDir, { recursive: true });

const narrationBlocks = [
  {
    start: "00:00",
    end: "00:07",
    text:
      "WorkTape turns a screen recording of repetitive business work into a working internal tool.",
  },
  {
    start: "00:07",
    end: "00:20",
    text:
      "Before WorkTape, an admissions admin copies the same lead details from chats into spreadsheets, tracks payment notes by hand, and still rarely has a clean software spec.",
  },
  {
    start: "00:20",
    end: "00:32",
    text:
      "In the interest of time, I'm using the saved sample path for this walkthrough. The product still shows the chain clearly: recording, analysis, extracted workflow, spec, and generated tool.",
  },
  {
    start: "00:32",
    end: "00:44",
    text:
      "Here WorkTape reads the admissions workflow. A coaching institute admin receives an inquiry, captures student details, qualifies the lead, and sends a follow-up message.",
  },
  {
    start: "00:44",
    end: "00:55",
    text:
      "It detects the business object behind the work: a lead, with fields like student name, phone, age, course, batch preference, status, payment status, follow-up, and notes.",
  },
  {
    start: "00:54",
    end: "01:04",
    text:
      "Then WorkTape asks the missing business-rule questions: which statuses matter, which fields are required, whether payment tracking is needed, and what messages are sent repeatedly.",
  },
  {
    start: "01:04",
    end: "01:12",
    text:
      "Those answers become a structured app spec: entities, fields, statuses, actions, message templates, screens, validation rules, and CSV export requirements.",
  },
  {
    start: "01:12",
    end: "01:23",
    text:
      "The generated CRM is rendered from that spec. This is not a separate static dashboard. The form, table, statuses, templates, and export behavior all come from the workflow definition.",
  },
  {
    start: "01:23",
    end: "01:32",
    text:
      "Now the admissions team can add a lead, track payment and follow-up status, copy WhatsApp-ready replies, update the record, and export the data to CSV.",
  },
  {
    start: "01:32",
    end: "01:43",
    text:
      "The point is not another app builder. The point is that undocumented human work becomes software. WorkTape starts where small businesses already are: doing the work on screen.",
  },
];

const plainNarration = narrationBlocks.map((block) => block.text).join("\n\n");

writeFileSync(
  scriptPath,
  `# WorkTape Final Demo Narration\n\n${narrationBlocks
    .map((block) => `## ${block.start}-${block.end}\n\n${block.text}`)
    .join("\n\n")}\n`,
);

writeFileSync(
  timestampsPath,
  `# Timestamp Map\n\n| Final time | Source content | Narration purpose |\n| --- | --- | --- |\n| 00:00-00:07 | WorkTape proof path / first screen | Define WorkTape in one sentence. |\n| 00:07-00:20 | Problem slide showing chats, sheets, and messy repeated work | Explain the messy manual-work problem. |\n| 00:20-00:32 | Upload area and saved sample path | Honestly disclose saved sample for walkthrough speed. |\n| 00:32-00:44 | Extracted workflow cards | Show observed admissions steps. |\n| 00:44-00:54 | Detected objects and fields | Show the app schema coming from the workflow. |\n| 00:54-01:04 | Clarifying questions | Show human-in-the-loop business rules. |\n| 01:04-01:12 | Final app spec JSON | Show the recording becoming a structured software spec. |\n| 01:12-01:23 | Spec-to-app mapping and CRM opening | Explain spec-driven generation honestly. |\n| 01:23-01:32 | Live CRM form/table/templates/export | Prove the generated tool is usable. |\n| 01:32-01:43 | Final CRM/export state | Close on the category insight. |\n`,
);

writeFileSync(
  editPlanPath,
  `# Final Demo Edit Plan\n\n- Preserve the real recorded product flow from the source video, with one short problem card inserted before the app walkthrough.\n- Crop to the app window and scale to 1920x1080 so browser chrome and desktop wallpaper do not dominate.\n- Keep the source sequence intact enough that the before -> analysis -> spec -> generated CRM chain is visible.\n- Use a premium original AI-assistant voiceover; do not clone or imitate any named character or actor.\n- Save an SRT captions file for upload/subtitle use; keep the exported picture clean to avoid covering small UI details.\n- State the saved sample path honestly near the beginning.\n- Export final MP4 to both Desktop and demo-assets/final-submission-video.\n`,
);

function toSrtTime(time, plusSeconds = 0) {
  const [minutes, seconds] = time.split(":").map(Number);
  const total = minutes * 60 + seconds + plusSeconds;
  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = Math.floor(total % 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")},000`;
}

writeFileSync(
  captionsPath,
  narrationBlocks
    .map((block, index) => `${index + 1}\n${toSrtTime(block.start)} --> ${toSrtTime(block.end)}\n${block.text}\n`)
    .join("\n"),
);

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

async function duration(file) {
  const { stdout } = await execFile("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    file,
  ]);
  return Number(stdout.trim());
}

async function createVoiceover() {
  if (existsSync(voiceMp3)) return voiceMp3;
  if (existsSync(fallbackAiff)) return fallbackAiff;

  loadEnv();
  const key = process.env.OPENAI_API_KEY;
  if (key) {
    const primaryBody = {
      model: "gpt-4o-mini-tts",
      voice: "onyx",
      input: plainNarration,
      instructions:
        "Original premium AI product-demo narration. Calm, confident, slightly futuristic, human-like, warm, clear Indian-hackathon demo pacing. Do not imitate any named actor or copyrighted character.",
      response_format: "mp3",
      speed: 0.98,
    };

    let response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(primaryBody),
    });

    if (!response.ok) {
      response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          voice: "onyx",
          input: plainNarration,
          response_format: "mp3",
          speed: 0.98,
        }),
      });
    }

    if (response.ok) {
      const audio = Buffer.from(await response.arrayBuffer());
      writeFileSync(voiceMp3, audio);
      return voiceMp3;
    }

    const errorText = await response.text();
    console.warn(`OpenAI TTS failed, falling back to macOS voice: ${errorText}`);
  }

  const textPath = path.join(outDir, "voiceover-input.txt");
  writeFileSync(textPath, plainNarration);
  await execFile("say", ["-v", "Daniel", "-r", "170", "-f", textPath, "-o", fallbackAiff]);
  return fallbackAiff;
}

async function buildVideo(audioPath) {
  const audioDuration = await duration(audioPath);
  const problemDuration = 13;
  const selectedSegments = [
    [0, 10.5],
    [20, 36],
    [38, 54],
    [56, 78],
    [80, 106],
    [108, 132],
    [136, 156.2],
  ];
  const selectedSourceDuration = selectedSegments.reduce((sum, [start, end]) => sum + end - start, 0);
  const targetVideoDuration = audioDuration + 2;
  const speed = Math.min(1.55, Math.max(1.05, selectedSourceDuration / (targetVideoDuration - problemDuration)));

  const trims = selectedSegments
    .map(
      ([start, end], index) =>
        `[0:v]trim=start=${start}:end=${end},setpts=(PTS-STARTPTS)/${speed.toFixed(4)},crop=2358:1326:325:170,scale=1920:1080,fps=30,format=yuv420p[v${index}]`,
    )
    .join(";");
  const concatInputs = `[v0][problem]${selectedSegments
    .slice(1)
    .map((_, index) => `[v${index + 1}]`)
    .join("")}`;
  const filter = `${trims};[1:v]scale=1920:1080,fps=30,format=yuv420p,trim=duration=${problemDuration},setpts=PTS-STARTPTS[problem];${concatInputs}concat=n=${selectedSegments.length + 1}:v=1:a=0[v]`;

  await execFile("ffmpeg", [
    "-y",
    "-i",
    sourceVideo,
    "-loop",
    "1",
    "-t",
    String(problemDuration),
    "-i",
    problemSlide,
    "-filter_complex",
    filter,
    "-map",
    "[v]",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "18",
    mutedVideo,
  ]);

  const mutedDuration = await duration(mutedVideo);
  if (mutedDuration + 0.25 < audioDuration) {
    throw new Error(
      `Muted video (${mutedDuration.toFixed(3)}s) is shorter than voiceover (${audioDuration.toFixed(3)}s).`,
    );
  }

  await execFile("ffmpeg", [
    "-y",
    "-i",
    mutedVideo,
    "-i",
    audioPath,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-af",
    "loudnorm=I=-16:TP=-1.5:LRA=11",
    "-t",
    audioDuration.toFixed(3),
    localFinal,
  ]);

  copyFileSync(localFinal, desktopFinal);

  return {
    audioDuration,
    mutedDuration,
    selectedDuration: selectedSourceDuration + problemDuration,
    selectedSourceDuration,
    problemDuration,
    speed,
  };
}

async function main() {
  if (!existsSync(sourceVideo)) {
    throw new Error(`Missing source video: ${sourceVideo}`);
  }
  if (!existsSync(problemSlide)) {
    throw new Error(`Missing problem slide: ${problemSlide}`);
  }
  const audioPath = await createVoiceover();
  const buildStats = await buildVideo(audioPath);

  const finalDuration = await duration(localFinal);
  const { stdout } = await execFile("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate",
    "-of",
    "json",
    localFinal,
  ]);
  writeFileSync(path.join(outDir, "ffprobe-final.json"), stdout);
  console.log(
    JSON.stringify(
      {
        sourceVideo,
        localFinal,
        desktopFinal,
        scriptPath,
        timestampsPath,
        editPlanPath,
        captionsPath,
        voiceover: audioPath,
        ...buildStats,
        duration: finalDuration,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
