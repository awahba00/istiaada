/**
 * Visual QA (VLM) — Final Native Arabic Editorial Pass screenshots.
 * Audits knowledge-screen + edited-card dialogs at 320/360/390:
 * RTL integrity, no clipping/overflow/overlap, punctuation sanity,
 * natural Arabic rendering of the edited copy.
 * Retry on 429 with backoff. Output: tool-results/final-editorial/vlm-visual-qa.json
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const DIR = "/home/z/my-project/tool-results/final-editorial";
const REPORT = path.join(DIR, "vlm-visual-qa.json");
// incremental: keep already-verified files from a previous (interrupted) run
let PREV: Verdict[] = [];
try {
  PREV = JSON.parse(fs.readFileSync(REPORT, "utf-8")).verdicts ?? [];
} catch {}
const DONE = new Set(PREV.filter((v) => !v.error).map((v) => v.file));
const FILES = fs.readdirSync(DIR).filter((f) => f.endsWith(".png") && !DONE.has(f)).sort();

const PROMPT = `You are auditing one screenshot of an Arabic RTL mobile app (استعادة — a recovery / self-control app, dark theme). The screen shows either a knowledge-card list or an open knowledge card dialog. Answer STRICTLY as JSON only (no prose, no markdown fences):

{
  "rtl_ok": <bool, right-to-left layout correct: Arabic lines start from the right edge, chips/headers ordered RTL, no paragraph starting leftward>,
  "no_clipping": <bool, no text cut off mid-word, no element overlap, nothing overflows its card/button/dialog edge>,
  "mixed_text_ok": <bool, Arabic+digits mix renders in natural order, parentheses/quotes not mirrored or stranded; true if no mixed text>,
  "punctuation_ok": <bool, no duplicated punctuation, no stray isolated marks, Arabic question marks face correct direction>,
  "arabic_natural": <bool, the Arabic sentences look like naturally typeset Arabic prose — no broken words, no reversed letter order, no isolated diacritics>,
  "notes": <string, one short sentence; mention ANY visible defect>
}

Rules:
- Arabic-Indic digits (٥, ٠, ٩) are CORRECT for this app.
- Em-dash (—) and Arabic quotation marks «» are intentional style, not defects.
- The word زَلّة with diacritics is intended terminology, not a rendering error.
- Answer based only on what is visible.`;

interface Verdict {
  file: string;
  rtl_ok?: boolean;
  no_clipping?: boolean;
  mixed_text_ok?: boolean;
  punctuation_ok?: boolean;
  arabic_natural?: boolean;
  notes?: string;
  error?: string;
}

function parseJson(text: string): Partial<Verdict> | null {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function main() {
  const zai = await ZAI.create();
  const verdicts: Verdict[] = [];
  let prevPass = 0;
  for (const v of PREV) {
    if (v.error) continue;
    verdicts.push(v);
    prevPass++;
  }
  console.log(`resuming: ${prevPass} already verified, ${FILES.length} remaining`);

  for (const file of FILES) {
    const b64 = fs.readFileSync(path.join(DIR, file)).toString("base64");
    let verdict: Partial<Verdict> | null = null;
    let lastErr = "";

    for (let attempt = 0; attempt < 4 && !verdict; attempt++) {
      if (attempt > 0) {
        const wait = [8, 20, 45][Math.min(attempt - 1, 2)] * 1000;
        await new Promise((r) => setTimeout(r, wait));
      }
      try {
        const res = await zai.chat.completions.createVision({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: PROMPT },
                { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
              ],
            },
          ],
          thinking: { type: "disabled" },
        });
        const raw = res.choices[0]?.message?.content ?? "";
        verdict = parseJson(raw);
        if (!verdict) lastErr = "unparseable response";
      } catch (e: unknown) {
        lastErr = e instanceof Error ? e.message : String(e);
      }
    }

    if (!verdict) {
      verdict = { error: lastErr };
    }

    const v: Verdict = { file, ...verdict };
    const ok =
      v.rtl_ok === true &&
      v.no_clipping === true &&
      v.mixed_text_ok === true &&
      v.punctuation_ok === true &&
      v.arabic_natural === true;
    if (v.error) {
      console.log(`  ✗ ${file} — ERROR: ${v.error.slice(0, 80)}`);
    } else if (ok) {
      console.log(`  ✓ ${file}${v.notes ? ` — ${v.notes}` : ""}`);
    } else {
      console.log(
        `  ✗ ${file} — rtl:${v.rtl_ok} clip:${v.no_clipping} mixed:${v.mixed_text_ok} punct:${v.punctuation_ok} natural:${v.arabic_natural} — ${v.notes ?? ""}`
      );
    }
    verdicts.push(v);
    // incremental save after every file so interrupted runs keep progress
    const runPass = verdicts.filter((x) => !x.error && x.rtl_ok && x.no_clipping && x.mixed_text_ok && x.punctuation_ok && x.arabic_natural).length;
    const runFail = verdicts.length - runPass;
    fs.writeFileSync(REPORT, JSON.stringify({ total: runPass + runFail, pass: runPass, fail: runFail, verdicts }, null, 2));
  }

  const total = verdicts.length;
  const pass = verdicts.filter((v) => !v.error && v.rtl_ok && v.no_clipping && v.mixed_text_ok && v.punctuation_ok && v.arabic_natural).length;
  const fail = total - pass;
  fs.writeFileSync(REPORT, JSON.stringify({ total, pass, fail, verdicts }, null, 2));
  console.log(`\nVLM RESULT: ${pass} passed, ${fail} failed (${total} files)`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
