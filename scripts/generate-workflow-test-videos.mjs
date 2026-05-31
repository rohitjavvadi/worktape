import { execFile } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const outDir = path.resolve("demo-assets/recordings/generalization-tests");
const frameDir = path.join(outDir, "frames");

const workflows = [
  {
    slug: "clinic-appointments",
    title: "Clinic appointment workflow",
    accent: "#0f766e",
    frames: [
      {
        tool: "WhatsApp",
        headline: "New patient inquiry",
        left: ["Priya: Need a skin consultation tomorrow", "Admin asks: name, age, phone, preferred time"],
        right: ["Patient name: Priya Nair", "Phone: +91 98765 22211", "Concern: acne consultation"]
      },
      {
        tool: "Clinic calendar",
        headline: "Check doctor slots",
        left: ["Dr Mehta", "10:00 AM - booked", "10:30 AM - free", "11:00 AM - free"],
        right: ["Preferred slot: 10:30 AM", "Visit type: first consultation", "Fee: Rs 700"]
      },
      {
        tool: "Google Sheets",
        headline: "Copy patient details into appointment tracker",
        left: ["Name | Phone | Concern | Doctor | Slot | Status", "Priya Nair | 9876522211 | Acne | Dr Mehta | 10:30 | Pending"],
        right: ["Manual copy paste", "Status: pending confirmation", "Follow-up: send location"]
      },
      {
        tool: "WhatsApp",
        headline: "Send confirmation message",
        left: ["Hi Priya, your appointment is booked with Dr Mehta tomorrow at 10:30 AM."],
        right: ["Template needed", "Copy message", "Mark status confirmed"]
      }
    ]
  },
  {
    slug: "invoice-collections",
    title: "Invoice collection workflow",
    accent: "#2563eb",
    frames: [
      {
        tool: "Email inbox",
        headline: "Client payment follow-up",
        left: ["Invoice INV-1042 sent to Apex Retail", "Amount due: Rs 48,000", "Due date: 28 May 2026"],
        right: ["Client: Apex Retail", "Contact: nisha@apex.example", "Payment status: overdue"]
      },
      {
        tool: "Accounting sheet",
        headline: "Update receivables tracker",
        left: ["Invoice | Client | Amount | Due date | Status | Reminder", "INV-1042 | Apex Retail | 48000 | 2026-05-28 | Overdue | Send today"],
        right: ["Fields are copied from email", "Status dropdown: Sent, Due, Overdue, Paid"]
      },
      {
        tool: "WhatsApp",
        headline: "Send payment reminder",
        left: ["Hi Nisha, sharing a reminder for invoice INV-1042 of Rs 48,000 due today."],
        right: ["Need reminder templates", "Track last reminder date", "Export overdue invoices"]
      },
      {
        tool: "Bank note",
        headline: "Mark invoice paid after transfer",
        left: ["UPI received: Rs 48,000", "Reference: HDFC2431", "Invoice: INV-1042"],
        right: ["Action: update status to Paid", "Store payment reference"]
      }
    ]
  },
  {
    slug: "repair-service-tickets",
    title: "Repair service ticket workflow",
    accent: "#d97706",
    frames: [
      {
        tool: "WhatsApp",
        headline: "Customer reports appliance issue",
        left: ["Rohit: My washing machine is leaking", "Address: Hitech City", "Available after 5 PM"],
        right: ["Customer name: Rohit", "Issue: leak", "Area: Hitech City", "Priority: normal"]
      },
      {
        tool: "Service board",
        headline: "Create repair ticket",
        left: ["Ticket | Customer | Issue | Area | Technician | Status", "T-221 | Rohit | Washing machine leak | Hitech City | Unassigned | New"],
        right: ["Assign technician", "Schedule visit", "Track spare parts"]
      },
      {
        tool: "Technician chat",
        headline: "Assign and notify technician",
        left: ["Assign to: Kiran", "Visit: Today 6 PM", "Part likely: inlet pipe"],
        right: ["Template: technician assignment", "Template: customer confirmation"]
      },
      {
        tool: "Service sheet",
        headline: "Close ticket after visit",
        left: ["Status: Completed", "Charge: Rs 950", "Payment: Cash received", "Notes: pipe replaced"],
        right: ["Need CSV export", "Payment status", "Service notes"]
      }
    ]
  }
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textBlock(lines, x, y, size = 30, color = "#111827") {
  return lines
    .map((line, index) => {
      const weight = index === 0 ? 700 : 500;
      return `<text x="${x}" y="${y + index * (size + 16)}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function frameSvg(workflow, frame, index) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="720" rx="0" fill="#f8fafc"/>
  <rect x="36" y="32" width="1208" height="656" rx="28" fill="#ffffff" stroke="#d8e0ea" stroke-width="2"/>
  <rect x="36" y="32" width="1208" height="86" rx="28" fill="#0f172a"/>
  <circle cx="82" cy="75" r="10" fill="#ef4444"/>
  <circle cx="112" cy="75" r="10" fill="#f59e0b"/>
  <circle cx="142" cy="75" r="10" fill="#10b981"/>
  <text x="184" y="84" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="800" fill="#ffffff">${escapeXml(workflow.title)}</text>
  <text x="1040" y="84" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#cbd5e1">Frame ${index + 1}</text>
  <rect x="70" y="152" width="520" height="474" rx="22" fill="#f8fafc" stroke="#d8e0ea"/>
  <rect x="634" y="152" width="574" height="474" rx="22" fill="#f8fafc" stroke="#d8e0ea"/>
  <rect x="94" y="178" width="180" height="44" rx="12" fill="${workflow.accent}"/>
  <text x="114" y="207" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">${escapeXml(frame.tool)}</text>
  <text x="94" y="270" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="800" fill="#111827">${escapeXml(frame.headline)}</text>
  ${textBlock(frame.left, 94, 340, 27)}
  <text x="666" y="214" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="#111827">Observed data and actions</text>
  ${textBlock(frame.right, 666, 282, 28)}
  <rect x="666" y="556" width="500" height="44" rx="12" fill="#ecfeff" stroke="#bae6fd"/>
  <text x="690" y="586" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#0369a1">This repeated work should become a small internal tool</text>
</svg>`;
}

async function makeWorkflowVideo(workflow) {
  const workflowFrameDir = path.join(frameDir, workflow.slug);
  await rm(workflowFrameDir, { recursive: true, force: true });
  await mkdir(workflowFrameDir, { recursive: true });

  const pngPaths = [];
  for (const [index, frame] of workflow.frames.entries()) {
    const svgPath = path.join(workflowFrameDir, `frame-${String(index + 1).padStart(2, "0")}.svg`);
    await writeFile(svgPath, frameSvg(workflow, frame, index));
    await execFileAsync("qlmanage", ["-t", "-s", "1280", "-o", workflowFrameDir, svgPath]);
    const pngPath = `${svgPath}.png`;
    pngPaths.push(pngPath);
  }

  const concatPath = path.join(workflowFrameDir, "frames.txt");
  const concatBody = pngPaths
    .map((pngPath) => `file '${pngPath.replace(/'/g, "'\\''")}'\nduration 2.25`)
    .join("\n");
  await writeFile(concatPath, `${concatBody}\nfile '${pngPaths.at(-1)}'\n`);

  const videoPath = path.join(outDir, `${workflow.slug}.mp4`);
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
    "fps=24,format=yuv420p",
    "-movflags",
    "+faststart",
    videoPath
  ]);

  return videoPath;
}

await mkdir(outDir, { recursive: true });

const videos = [];
for (const workflow of workflows) {
  videos.push(await makeWorkflowVideo(workflow));
}

console.log(videos.join("\n"));
