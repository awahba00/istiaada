/**
 * Istiaada brand assets — «حلقة العودة» (The Return Loop).
 *
 * One continuous stroke: an open loop (gap on the left) whose returning end
 * comes back THROUGH the opening toward its own center — استعادة, taking
 * back / returning to balance. The gap stays open on purpose: recovery is a
 * return in progress, not a closed circle.
 *
 * Geometry (48×48 viewBox, y-down screen angles):
 *   ring   : center (24, 24.5), R = 14.5, stroke 6, round caps
 *   gap    : screen angles 145°…215° (the left side)
 *   main   : arc from 215° clockwise 290° to 145°
 *   tail   : tangent-continuous inner arc, r = 6.5, from 145° to 250°
 *            (bulges slightly through the gap, rises, ends pointing
 *             up-right into the loop's interior)
 *
 * Outputs:
 *   public/logo.svg            — standalone mark, light-theme primary teal
 *   public/icon.svg            — favicon badge (rounded dark slate + aqua mark)
 *   public/favicon-32.png      — 32×32 raster of the badge (PNG fallback)
 *   public/apple-touch-icon.png— 180×180 square (iOS masks it itself)
 *   tool-results/brand/*       — verification renders (16/32px on light &
 *                                dark tab-strip colors, big marks per theme)
 * Icons are served from /public + explicit metadata.icons in layout.tsx
 * (PNG metadata-route files crash Turbopack 16 builds — see worklog).
 * Prints the canonical MARK_PATH for the React <LogoMark/> component.
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

// ————— OKLCH → sRGB hex (Björn Ottosson's OKLab) —————
function oklchToHex(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const gamma = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  const to255 = (c) => Math.round(Math.min(1, Math.max(0, gamma(c))) * 255);
  return (
    "#" +
    [to255(r), to255(g), to255(bl)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

// Brand colors (from src/app/globals.css)
const LIGHT_PRIMARY = oklchToHex(0.56, 0.09, 180); // deep calm teal (light theme)
const DARK_PRIMARY = oklchToHex(0.74, 0.1, 178); // soft aqua (dark theme)
const BADGE_BG = "#131E21"; // deep slate-teal night (viewport themeColor dark)
const TAB_LIGHT = "#DEE1E6"; // typical light browser tab strip
const TAB_DARK = "#202124"; // typical dark browser tab strip

// ————— Mark geometry —————
const CX = 24, CY = 24.5, R = 14.5, SW = 6;
const GAP_TOP = 215, GAP_BOT = 145; // screen degrees (y-down), gap on the left
const TAIL_R = 6.5, TAIL_END = 250;

const rad = (d) => (d * Math.PI) / 180;
const pt = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];
const f = (x) => x.toFixed(2);

const P1 = pt(CX, CY, R, GAP_TOP); // gap top end (arc start)
const P2 = pt(CX, CY, R, GAP_BOT); // gap bottom end (arc end)

// Travel direction at P2 arriving clockwise (increasing angle): (-sinφ, cosφ)
const v = [-Math.sin(rad(GAP_BOT)), Math.cos(rad(GAP_BOT))];
// Right-hand normal in y-down screen space: rotate v by +90° → (-vy, vx)
const n = [-v[1], v[0]];
const C2 = [P2[0] + TAIL_R * n[0], P2[1] + TAIL_R * n[1]];
const TE = pt(C2[0], C2[1], TAIL_R, TAIL_END);

const MARK_PATH =
  `M ${f(P1[0])} ${f(P1[1])} ` +
  `A ${R} ${R} 0 1 1 ${f(P2[0])} ${f(P2[1])} ` +
  `A ${TAIL_R} ${TAIL_R} 0 0 1 ${f(TE[0])} ${f(TE[1])}`;

const markInner = (stroke) =>
  `<path d="${MARK_PATH}" fill="none" stroke="${stroke}" stroke-width="${SW}" stroke-linecap="round"/>`;

const markSvg48 = (stroke) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${markInner(stroke)}</svg>`;

// Favicon badge: mark centered (by ring center) inside a rounded dark square
const badgeSvg = (size, scale = 1.06, rx = null, square = false) => {
  const s = scale;
  const tx = 32 - CX * s;
  const ty = 32 - CY * s;
  const corner = rx ?? Math.round(size * 0.22);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">` +
    (square
      ? `<rect width="64" height="64" fill="${BADGE_BG}"/>`
      : `<rect width="64" height="64" rx="${(corner / size) * 64}" fill="${BADGE_BG}"/>`) +
    `<g transform="translate(${f(tx)} ${f(ty)}) scale(${s})">${markInner(DARK_PRIMARY)}</g>` +
    `</svg>`
  );
};

// ————— Write vector files —————
mkdirSync("tool-results/brand", { recursive: true });

writeFileSync("public/logo.svg", markSvg48(LIGHT_PRIMARY));

// Favicon: 64-viewBox badge rendered crisp by the browser at any tab size.
writeFileSync("public/icon.svg", badgeSvg(64, 1.06));

// ————— Rasterize with sharp —————
const render = async (svgString, out, width, height) => {
  await sharp(Buffer.from(svgString)).png().toFile(out);
  console.log("wrote", out, `${width}×${height}`);
};

// 32×32 PNG favicon fallback (rendered at exact size — no resampling)
await render(badgeSvg(32), "public/favicon-32.png", 32, 32);
// 180×180 apple touch icon (full square — iOS rounds it itself)
await render(badgeSvg(180, 1.02, 0, true), "public/apple-touch-icon.png", 180, 180);

// ————— Verification renders —————
// Big clean mark for inspection
await render(
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 48 48">${markInner(LIGHT_PRIMARY)}</svg>`,
  "tool-results/brand/mark-256.png",
  256,
  256
);

// Mark on each theme's background (in-app adaptation preview)
await render(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 48 48"><rect width="48" height="48" fill="${TAB_LIGHT}"/>${markInner(LIGHT_PRIMARY)}</svg>`,
  "tool-results/brand/mark-light-128.png",
  128,
  128
);
await render(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 48 48"><rect width="48" height="48" fill="${BADGE_BG}"/>${markInner(DARK_PRIMARY)}</svg>`,
  "tool-results/brand/mark-dark-128.png",
  128,
  128
);

// Simulated browser tab strips: the badge at 16px and 32px on light & dark
const tabStrip = async (bg, name) => {
  const b16 = await sharp(Buffer.from(badgeSvg(16))).png().toBuffer();
  const b32 = await sharp(Buffer.from(badgeSvg(32))).png().toBuffer();
  await sharp({
    create: { width: 150, height: 48, channels: 4, background: bg },
  })
    .composite([
      { input: b16, left: 14, top: 16 },
      { input: b32, left: 70, top: 8 },
      // a neutral "tab title" placeholder line so the scale reads in context
    ])
    .png()
    .toFile(`tool-results/brand/tabstrip-${name}.png`);
  console.log("wrote", `tool-results/brand/tabstrip-${name}.png`, "150×48");
};
await tabStrip({ r: 222, g: 225, b: 230, alpha: 1 }, "light");
await tabStrip({ r: 32, g: 33, b: 36, alpha: 1 }, "dark");

console.log("\n———— canonical values ————");
console.log("MARK_PATH:", MARK_PATH);
console.log("LIGHT_PRIMARY:", LIGHT_PRIMARY, " DARK_PRIMARY:", DARK_PRIMARY);
