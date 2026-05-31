import { C, base, title, card, pill, footer, arrow } from "./helpers.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  base(slide, ctx, 3);
  title(
    slide,
    ctx,
    "Real AI backend, spec-driven app, honest fallback.",
    "The MVP optimizes for one reliable proof: an uploaded recording is converted into a structured spec, and the CRM renders from that spec."
  );

  card(slide, ctx, 54, 218, 820, 298);
  const parts = [
    ["Next.js UI", "Upload, progress, extracted workflow, questions, generated tool"],
    ["API backend", "Receives video, runs ffmpeg, extracts frames"],
    ["OpenAI vision", "Responses API, gpt-5.5, reasoning high, structured JSON"],
    ["WorkflowSpec", "Objects, fields, statuses, actions, templates, screens"],
    ["Spec renderer", "Forms, table, statuses, templates, CSV export"],
  ];
  parts.forEach(([head, body], i) => {
    const y = 250 + i * 48;
    ctx.addShape(slide, { x: 84, y: y + 8, w: 18, h: 18, fill: i < 2 ? C.cobalt : i === 2 ? C.signal : C.warm });
    ctx.addText(slide, { x: 122, y, w: 172, h: 22, text: head, fontSize: 15, bold: true, color: C.ink });
    ctx.addText(slide, { x: 310, y, w: 500, h: 22, text: body, fontSize: 13, color: C.slate });
  });

  const x0 = 910;
  card(slide, ctx, x0, 218, 316, 298, C.night, C.night);
  pill(slide, ctx, x0 + 28, 246, 138, "DEMO DISCIPLINE", "#123C35", "#7DD3FC");
  ctx.addText(slide, {
    x: x0 + 28, y: 292, w: 250, h: 80,
    text: "Fallback sample is labeled. It protects the demo, not the product claim.",
    fontSize: 22,
    bold: true,
    color: C.white,
  });
  ctx.addText(slide, {
    x: x0 + 28, y: 402, w: 246, h: 58,
    text: "No WhatsApp API claim in Phase 1. Messages are templates with copy-to-clipboard.",
    fontSize: 13,
    color: "#CBD5E1",
  });

  card(slide, ctx, 146, 563, 988, 58, C.white, C.line);
  ctx.addText(slide, { x: 174, y: 582, w: 178, h: 22, text: "Deploy path", fontSize: 14, bold: true, color: C.ink });
  ctx.addText(slide, { x: 350, y: 582, w: 720, h: 22, text: "Local Next.js app exposed through Cloudflare Tunnel for the live demo", fontSize: 14, color: C.slate });
  footer(slide, ctx);
  return slide;
}
