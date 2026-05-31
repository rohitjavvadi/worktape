import { C, base, title, card, pill, footer } from "./helpers.mjs";

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  base(slide, ctx, 4);
  title(
    slide,
    ctx,
    "Start with coaching institutes, then expand across repeated admin work.",
    "The wedge is narrow by design: admissions teams who already manage leads through WhatsApp and spreadsheets."
  );

  card(slide, ctx, 54, 218, 430, 334, C.white, C.line);
  pill(slide, ctx, 84, 246, 122, "FIRST ICP", C.signalSoft, C.signal);
  ctx.addText(slide, { x: 84, y: 294, w: 330, h: 56, text: "Coaching institute admissions admins", fontSize: 27, bold: true, color: C.ink });
  ctx.addText(slide, {
    x: 84, y: 378, w: 330, h: 80,
    text: "They handle high-volume inquiries, repeated fee/batch questions, manual follow-ups, and spreadsheet status tracking.",
    fontSize: 16,
    color: C.slate,
  });

  card(slide, ctx, 530, 218, 696, 334);
  ctx.addText(slide, { x: 560, y: 246, w: 240, h: 24, text: "Expansion rule", fontSize: 15, bold: true, color: C.ink });
  ctx.addText(slide, {
    x: 560, y: 288, w: 570, h: 50,
    text: "Only expand when the workflow has the same shape: repeated intake, status tracking, follow-up, and export.",
    fontSize: 21,
    bold: true,
    color: C.ink,
  });
  const segments = [
    ["Clinics", "patient intake + appointment follow-up"],
    ["Local services", "inquiry + estimate + job status"],
    ["Freelancers", "client lead + project tracker"],
  ];
  segments.forEach(([head, body], i) => {
    const x = 560 + i * 210;
    card(slide, ctx, x, 386, 180, 94, i === 0 ? C.cobaltSoft : i === 1 ? C.warmSoft : C.signalSoft, C.softLine);
    ctx.addText(slide, { x: x + 18, y: 410, w: 130, h: 20, text: head, fontSize: 14, bold: true, color: C.ink });
    ctx.addText(slide, { x: x + 18, y: 438, w: 130, h: 34, text: body, fontSize: 11, color: C.slate });
  });

  card(slide, ctx, 54, 588, 1172, 58, C.signalSoft, "#BDEBD9");
  ctx.addText(slide, {
    x: 84, y: 607, w: 298, h: 22,
    text: "Why this wedge wins",
    fontSize: 14,
    bold: true,
    color: C.signal,
  });
  ctx.addText(slide, {
    x: 298, y: 607, w: 836, h: 24,
    text: "The user does not need to explain the app. They only need to show the work once.",
    fontSize: 15,
    bold: true,
    color: C.ink,
  });
  footer(slide, ctx);
  return slide;
}
