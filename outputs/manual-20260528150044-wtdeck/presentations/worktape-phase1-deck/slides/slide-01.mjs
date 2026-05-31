import { C, base, title, card, metric, footer } from "./helpers.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  base(slide, ctx, 1);
  title(
    slide,
    ctx,
    "Small operators can show the work, but cannot spec the software.",
    "Admissions teams already run the process every day. The gap is turning that visible work into a usable internal tool."
  );

  card(slide, ctx, 54, 218, 760, 322);
  ctx.addText(slide, { x: 84, y: 245, w: 300, h: 24, text: "Manual admissions loop", fontSize: 15, bold: true, color: C.ink });
  const steps = [
    ["WhatsApp inquiry", "Lead asks course, fee, batch, timing."],
    ["Spreadsheet row", "Admin copies name, phone, status, notes."],
    ["Fee + follow-up", "Payment and next message tracked by memory."],
    ["Repeated messages", "Same replies are typed or pasted again."],
  ];
  steps.forEach(([head, body], i) => {
    const y = 298 + i * 54;
    ctx.addShape(slide, { x: 86, y: y + 7, w: 12, h: 12, fill: i === 0 ? C.signal : C.cobalt });
    ctx.addText(slide, { x: 114, y, w: 210, h: 21, text: head, fontSize: 14, bold: true, color: C.ink });
    ctx.addText(slide, { x: 330, y, w: 420, h: 37, text: body, fontSize: 13, color: C.slate });
  });

  card(slide, ctx, 862, 218, 364, 322, C.night, C.night);
  ctx.addText(slide, { x: 892, y: 246, w: 270, h: 25, text: "Pain point", fontSize: 14, bold: true, color: "#7DD3FC" });
  ctx.addText(slide, {
    x: 892, y: 292, w: 284, h: 130,
    text: "The work is real, repetitive, and valuable, but it lives across chats, sheets, memory, and copy-paste.",
    fontSize: 23,
    bold: true,
    color: C.white,
  });
  ctx.addText(slide, {
    x: 892, y: 450, w: 286, h: 48,
    text: "Most small teams will never write a PRD. They can record their screen.",
    fontSize: 14,
    color: "#CBD5E1",
  });

  metric(slide, ctx, 54, 574, 360, "12 min", "manual loop", C.red);
  metric(slide, ctx, 432, 574, 360, "many", "handoffs and misses", C.warm);
  metric(slide, ctx, 810, 574, 416, "0", "software specs written", C.signal);
  footer(slide, ctx);
  return slide;
}
