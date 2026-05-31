export const C = {
  ink: "#0B1120",
  slate: "#475569",
  muted: "#64748B",
  line: "#D7E0EA",
  softLine: "#E7EEF6",
  canvas: "#F6F8FB",
  white: "#FFFFFF",
  signal: "#0D9D6E",
  signalSoft: "#E7F8F1",
  cobalt: "#2563EB",
  cobaltSoft: "#EAF1FF",
  warm: "#F59E0B",
  warmSoft: "#FFF7E6",
  red: "#EF4444",
  redSoft: "#FEECEC",
  night: "#111827",
};

export function base(slide, ctx, n, eyebrow = "WORKTAPE PHASE 1") {
  ctx.addShape(slide, { x: 0, y: 0, w: 1280, h: 720, fill: C.canvas });
  ctx.addShape(slide, { x: 0, y: 0, w: 1280, h: 9, fill: C.signal });
  ctx.addText(slide, {
    x: 54, y: 30, w: 340, h: 24,
    text: eyebrow,
    fontSize: 11,
    bold: true,
    color: C.signal,
    face: "Aptos",
  });
  ctx.addText(slide, {
    x: 1138, y: 32, w: 88, h: 22,
    text: String(n).padStart(2, "0") + " / 04",
    fontSize: 12,
    bold: true,
    color: C.muted,
    align: "right",
  });
}

export function title(slide, ctx, text, sub) {
  ctx.addText(slide, {
    x: 54, y: 66, w: 820, h: 86,
    text,
    fontSize: 34,
    bold: true,
    color: C.ink,
    face: "Aptos Display",
  });
  if (sub) {
    ctx.addText(slide, {
      x: 56, y: 151, w: 760, h: 44,
      text: sub,
      fontSize: 17,
      color: C.slate,
    });
  }
}

export function card(slide, ctx, x, y, w, h, fill = C.white, line = C.line) {
  ctx.addShape(slide, { x, y, w, h, fill, line: { fill: line, width: 1 } });
}

export function pill(slide, ctx, x, y, w, label, fill, color) {
  ctx.addShape(slide, { x, y, w, h: 28, fill, line: { fill, width: 0 } });
  ctx.addText(slide, {
    x: x + 10, y: y + 6, w: w - 20, h: 16,
    text: label,
    fontSize: 10,
    bold: true,
    color,
    align: "center",
  });
}

export function metric(slide, ctx, x, y, w, value, label, color = C.ink) {
  card(slide, ctx, x, y, w, 86, C.white, C.line);
  ctx.addText(slide, { x, y: y + 16, w, h: 30, text: value, fontSize: 25, bold: true, color, align: "center" });
  ctx.addText(slide, { x, y: y + 50, w, h: 20, text: label, fontSize: 12, bold: true, color: C.muted, align: "center" });
}

export function footer(slide, ctx) {
  ctx.addText(slide, {
    x: 910, y: 672, w: 316, h: 22,
    text: "OpenAI x Outskill AI Builders Hackathon",
    fontSize: 12,
    color: C.muted,
    align: "right",
  });
}

export function arrow(slide, ctx, x, y, w, color = C.line) {
  ctx.addShape(slide, { x, y: y + 10, w, h: 2, fill: color });
  ctx.addShape(slide, { x: x + w - 7, y: y + 6, w: 8, h: 10, fill: color });
}
