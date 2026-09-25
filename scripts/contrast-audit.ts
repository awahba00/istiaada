/**
 * Contrast audit for Istiaada badge/text patterns (OKLCH -> sRGB -> WCAG ratio).
 * Phase 1 typography/readability — evidence for badge contrast decisions.
 */

// OKLCH -> sRGB (standard conversion, sRGB gamut clamped)
function oklchToRgb(L, C, H) {
  // OKLab intermediate
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const enc = (x) => {
    const v = Math.min(1, Math.max(0, x));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  };
  return [enc(r), enc(g), enc(bb)];
}

function lum([r, g, b]) {
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg, bg) {
  const l1 = lum(fg);
  const l2 = lum(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function mix(fg, alpha, bg) {
  // alpha-composite fg over bg in linear-light? Tailwind uses gamma-space blending
  // for opacity modifiers (colors stored in sRGB, alpha blended in gamma space).
  return fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));
}

const themes = {
  light: {
    background: [0.975, 0.006, 190],
    card: [1, 0, 0],
    foreground: [0.24, 0.02, 210],
    muted: [0.94, 0.01, 190],
    mutedFg: [0.52, 0.025, 200],
    primary: [0.56, 0.09, 180],
    primaryFg: [0.985, 0.005, 190],
    warning: [0.68, 0.15, 65],
    warningFg: [0.25, 0.05, 65],
    success: [0.55, 0.13, 155],
    destructive: [0.55, 0.21, 27],
  },
  dark: {
    background: [0.17, 0.018, 195],
    card: [0.215, 0.02, 195],
    foreground: [0.93, 0.01, 190],
    muted: [0.26, 0.02, 195],
    mutedFg: [0.68, 0.02, 195],
    primary: [0.74, 0.1, 178],
    primaryFg: [0.18, 0.04, 190],
    warning: [0.78, 0.14, 70],
    warningFg: [0.22, 0.05, 60],
    success: [0.72, 0.15, 155],
    destructive: [0.66, 0.19, 25],
  },
};

const R = (x) => Math.round(x * 100) / 100;
const hex = (rgb) =>
  "#" +
  rgb
    .map((c) =>
      Math.round(Math.min(1, Math.max(0, c)) * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("");

for (const [name, t] of Object.entries(themes)) {
  console.log(`\n===== ${name.toUpperCase()} =====`);
  const rgb = (k: keyof typeof t) => oklchToRgb(...(t[k] as [number, number, number]));
  const card = rgb("card");
  const background = rgb("background");
  const muted = rgb("muted");

  const checks = [
    // [label, fgRGB, bgRGB, required]
    ["body foreground on background", rgb("foreground"), background, 4.5],
    ["muted-foreground on background (xs text)", rgb("mutedFg"), background, 4.5],
    ["muted-foreground on muted (secondary on chips bg)", rgb("mutedFg"), muted, 4.5],
    ["muted-foreground on card", rgb("mutedFg"), card, 4.5],
    ["primary text on card (block titles)", rgb("primary"), card, 4.5],
    ["primary text on primary/10 tint (dose header)", rgb("primary"), mix(rgb("primary"), 0.1, card), 4.5],
    ["warning text on warning/15 (إذا/إذن badges, light amber on pale)", rgb("warning"), mix(rgb("warning"), 0.15, card), 4.5],
    ["success text on success/15 (أُنجزت اليوم badge)", rgb("success"), mix(rgb("success"), 0.15, card), 4.5],
    ["destructive text on destructive/15 (risk chip)", rgb("destructive"), mix(rgb("destructive"), 0.15, card), 4.5],
    ["warning-foreground on warning solid (proposed badge fix)", rgb("warningFg"), rgb("warning"), 4.5],
    ["success-foreground on success solid", oklchToRgb(...(name === "light" ? ([0.985, 0, 0] as [number, number, number]) : ([0.16, 0.04, 155] as [number, number, number]))), rgb("success"), 4.5],
  ];
  for (const [label, fg, bg, req] of checks) {
    const c = contrast(fg, bg);
    const verdict = c >= req ? "PASS" : c >= 3 ? "LARGE-ONLY" : "FAIL";
    console.log(
      `${verdict.padEnd(10)} ${R(c)}:1 (need ${req}) ${label}  [fg ${hex(fg)} on ${hex(bg)}]`
    );
  }
}
