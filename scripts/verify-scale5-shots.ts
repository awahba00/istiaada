/**
 * VLM verification of the post-migration (1–5 scale) UI screenshots.
 *
 * For every PNG in tool-results/scale5/ this script asks the vision model:
 *   1. Is a rating scale / degree indicator visible?
 *   2. Does it show the 1–5 scale ("من ٥" / "من 5" / "سلم من ١ لـ ٥" / "X من ٥")?
 *   3. Any trace of the OLD 1–10 scale ("من ١٠", "من 10", "/10", option rows
 *      with more than 5 numbers, degree values 6–10)?
 *
 * Durations and clock times (e.g. "١٠ دقائق", "بعد ١٠ مساءً") are explicitly
 * NOT scale references.
 *
 * Output: per-file verdicts + summary printed to console and saved to
 * tool-results/scale5/vlm-verify.json
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const DIR = process.argv[2] ?? "/home/z/my-project/tool-results/scale5";
const REPORT = path.join(DIR, "vlm-verify.json");
const ONLY = process.argv[3] ? process.argv[3].split(",") : null;

// Factual screen context (from the app source) injected per file so the VLM
// does not misread durations/counts as rating-scale values.
const HINTS: Record<string, string> = {
  "13-relapse-stop-390.png":
    "This screen shows a stats tile سرعة التوقف with the value ~10 دقيقة — that is TEN MINUTES (a duration), NOT a rating-scale value. It is correct and must never be counted as the old 1-10 scale.",
  "18-progress-insights-390.png":
    "Numbers followed by د or دقيقة (minutes) or يوم (days) are durations/day-counts, not scale values.",
};

// Files where the 1–5 scale MUST be visibly present ("من ٥" or equivalent).
const REQUIRED_OF5 = new Set([
  "04-urge-input-390.png", // footer note "على سلم من ١ لـ ٥" + 5-option rows
  "05-urge-result-level2-390.png", // "٢ من ٥"
  "06-urge-result-level5-390.png", // "٥ من ٥" — crisis
  "07-emergency-step1-390.png", // header "درجة الحالة: ٥ من ٥ — أزمة"
  "08-emergency-step3-countdown-390.png",
  "09-emergency-step4-reassess-390.png",
  "17-evening-checkin-390.png", // "أعلى رغبة اليوم؟" 1–5 row
  "18b-progress-insight-scale-390.png", // "عند درجة 5 من ٥"
  "19-urge-input-320.png",
  "21-evening-checkin-edit-hydrated-320.png",
]);

const PROMPT = `You are auditing one screenshot of an Arabic RTL mobile app (recovery / self-control app). The app's rating scale was migrated from 1–10 to 1–5. Examine the image and answer STRICTLY as JSON only (no prose, no markdown fences):

{
  "scale_visible": <bool, is any rating scale, degree number, or level indicator visible>,
  "shows_of_5": <bool, does it visibly contain a 1–5 scale marker such as "من ٥" or "من 5" or "سلم من ١ لـ ٥" or an "X من ٥" degree readout or a numbered option row of exactly 1..5>,
  "legacy_10_scale": <bool, any trace of the OLD 1–10 scale: "من ١٠", "من 10", "/10", "X/10", a numbered option row with MORE than 5 options, or a degree/level value of 6, 7, 8, 9 or 10>,
  "scale_text_seen": <string, quote the scale-related Arabic text you actually see, verbatim; empty string if none>,
  "notes": <string, one short sentence>
}

IMPORTANT rules:
- Durations and clock times such as "١٠ دقائق" (10 minutes), "١٠–١٥ دقيقة", "بعد ١٠ مساءً" (after 10 PM), or a number followed by "د" or "دقائق" are NOT scale references — never set legacy_10_scale=true for them.
- A row of exactly five number buttons (1..5) is the CORRECT new scale.
- "من ٥" / "من 5" (of 5) is correct. "من ١٠" / "من 10" / "/10" (of 10) is the old scale and is a FAILURE.
- The Arabic-Indic digit ٥ (five) looks like a small round circle; ٠ (zero) is a dot. "من ٥" is FIVE, not ten or eleven. If a denominator looks like "١٠" or "١١", zoom in mentally and re-read it — it is almost always "من ٥" misread.
- A fraction like "4/5" or "3/5" with denominator 5 is the CORRECT new scale readout ("/5" means out of five; only "/10" is legacy).
- Answer based only on what is actually visible in this screenshot.`;

interface Verdict {
  file: string;
  scale_visible?: boolean;
  shows_of_5?: boolean;
  legacy_10_scale?: boolean;
  scale_text_seen?: string;
  notes?: string;
  error?: string;
  required_of5?: boolean;
  pass?: boolean;
}

function parseJson(raw: string): Record<string, unknown> | null {
  let t = raw.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function verifyOne(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  file: string
): Promise<Verdict> {
  const b64 = fs.readFileSync(path.join(DIR, file)).toString("base64");
  const prompt = HINTS[file] ? `${PROMPT}\n\nScreen context: ${HINTS[file]}` : PROMPT;
  // 429-retry with backoff (15s / 30s / 60s) — the previous run died on rate limits.
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await zai.chat.completions.createVision({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
            ],
          },
        ],
        thinking: { type: "disabled" },
      });
      const raw = res.choices[0]?.message?.content ?? "";
      const parsed = parseJson(raw);
      if (!parsed) {
        return { file, error: "unparseable response", notes: raw.slice(0, 200) };
      }
      return {
        file,
        scale_visible: !!parsed.scale_visible,
        shows_of_5: !!parsed.shows_of_5,
        legacy_10_scale: !!parsed.legacy_10_scale,
        scale_text_seen: String(parsed.scale_text_seen ?? ""),
        notes: String(parsed.notes ?? ""),
      };
    } catch (e) {
      const msg = String(e);
      const is429 = msg.includes("429") || /too many requests/i.test(msg);
      if (is429 && attempt < 3) {
        const waitMs = 15000 * (attempt + 1) * (attempt + 1); // 15s, 60s, 135s
        console.log(`  ⏳ 429 on ${file} — retry ${attempt + 1}/3 after ${waitMs / 1000}s`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      return { file, error: msg };
    }
  }
}

async function main() {
  let files = fs.readdirSync(DIR).filter((f) => f.endsWith(".png")).sort();
  if (ONLY) files = files.filter((f) => ONLY.includes(f));
  console.log(`Verifying ${files.length} screenshots with VLM…\n`);
  const zai = await ZAI.create();

  const results: Verdict[] = [];
  const CONCURRENCY = 2;
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const verdicts = await Promise.all(batch.map((f) => verifyOne(zai, f)));
    results.push(...verdicts);
    console.log(`  ${Math.min(i + CONCURRENCY, files.length)}/${files.length} done`);
  }

  // Merge with any previous report so a filtered re-run yields a complete file
  let previous: Verdict[] = [];
  try {
    previous = (JSON.parse(fs.readFileSync(REPORT, "utf8")) ?? { results: [] }).results ?? [];
  } catch {
    /* no previous report */
  }
  for (const v of results) {
    const i = previous.findIndex((p) => p.file === v.file);
    if (i >= 0) previous[i] = v;
    else previous.push(v);
  }
  const all = previous.sort((a, b) => a.file.localeCompare(b.file));

  // Judgments
  let failures = 0;
  for (const v of all) {
    v.required_of5 = REQUIRED_OF5.has(v.file);
    const failLegacy = v.legacy_10_scale === true;
    const failMissing = v.required_of5 && v.shows_of_5 !== true;
    const failError = !!v.error;
    v.pass = !failLegacy && !failMissing && !failError;
    if (!v.pass) failures++;
  }

  const summary = {
    generated: new Date().toISOString(),
    total: all.length,
    passed: all.length - failures,
    failed: failures,
    required_of5_files: [...REQUIRED_OF5],
    results: all,
  };
  fs.writeFileSync(REPORT, JSON.stringify(summary, null, 2));

  console.log("\n——— Per-file verdicts ———");
  for (const v of all) {
    const flag = v.pass ? "PASS" : "FAIL";
    const req = v.required_of5 ? " [scale required]" : "";
    console.log(
      `${flag}  ${v.file}${req}\n      of5=${v.shows_of_5} legacy10=${v.legacy_10_scale} seen="${(v.scale_text_seen ?? v.error ?? "").slice(0, 90)}"`
    );
  }
  console.log(`\n——— Summary: ${summary.passed}/${summary.total} passed, ${failures} failed ———`);
  console.log(`Report saved to ${REPORT}`);
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
