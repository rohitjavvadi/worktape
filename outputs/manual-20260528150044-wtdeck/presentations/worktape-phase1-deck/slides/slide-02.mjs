import { C, base, title, card, pill, footer, arrow } from "./helpers.mjs";

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  base(slide, ctx, 2);
  title(
    slide,
    ctx,
    "WorkTape makes the recording the software spec.",
    "Users upload a workflow recording. WorkTape extracts the process, asks only the missing questions, then renders the internal tool from the resulting spec."
  );

  const nodes = [
    ["Upload", "Screen recording of one real workflow"],
    ["Analyze", "Frames sampled and read by vision model"],
    ["Clarify", "3-5 questions fill missing business rules"],
    ["Spec", "Structured WorkflowSpec JSON"],
    ["Tool", "Spec-driven internal web app"],
  ];
  nodes.forEach(([head, body], i) => {
    const x = 64 + i * 238;
    card(slide, ctx, x, 242, 190, 146, C.white, i === 4 ? C.signal : C.line);
    pill(slide, ctx, x + 18, 264, 82, "STEP " + (i + 1), i === 4 ? C.signalSoft : C.cobaltSoft, i === 4 ? C.signal : C.cobalt);
    ctx.addText(slide, { x: x + 18, y: 306, w: 150, h: 24, text: head, fontSize: 18, bold: true, color: C.ink });
    ctx.addText(slide, { x: x + 18, y: 340, w: 142, h: 40, text: body, fontSize: 12, color: C.slate });
    if (i < nodes.length - 1) arrow(slide, ctx, x + 194, 305, 36, C.line);
  });

  card(slide, ctx, 78, 445, 522, 128, C.signalSoft, "#BDEBD9");
  ctx.addText(slide, { x: 104, y: 470, w: 220, h: 24, text: "MVP key features", fontSize: 15, bold: true, color: C.signal });
  ctx.addText(slide, {
    x: 104, y: 509, w: 444, h: 40,
    text: "Upload recording, extracted workflow, detected objects and fields, clarifying questions, JSON spec, and a usable generated CRM.",
    fontSize: 16,
    bold: true,
    color: C.ink,
  });

  card(slide, ctx, 666, 445, 484, 128, C.white, C.line);
  ctx.addText(slide, { x: 692, y: 470, w: 180, h: 24, text: "Not a generic builder", fontSize: 15, bold: true, color: C.ink });
  ctx.addText(slide, {
    x: 692, y: 509, w: 390, h: 43,
    text: "The product starts from observed human work, not a blank prompt or template gallery.",
    fontSize: 16,
    bold: true,
    color: C.slate,
  });
  footer(slide, ctx);
  return slide;
}
