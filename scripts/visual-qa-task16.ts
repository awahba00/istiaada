/**
 * Visual QA (VLM) — Evidence Verification Pass screenshots.
 * Audits the 3 evidence-edited knowledge-card dialogs (ur-wave, en-friction,
 * em-labeling) at 320/360/390: RTL integrity, no clipping/overflow/overlap,
 * punctuation sanity, natural Arabic rendering of the new evidence wording.
 * Retry on 429 with backoff. Output: tool-results/evidence/vlm-visual-qa.json
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const DIR = "/home/z/my-project/tool-results/task16-editorial";
const REPORT = path.join(DIR, "vlm-visual-qa.json");
const FILES = fs.readdirSync(DIR).filter((f) => f.endsWith(".png")).sort();

const PROMPT = `You are auditing one screenshot of an Arabic RTL mobile app (استعادة — a recovery / self-control app, dark theme). The screen shows an open knowledge-card dialog with an edited Arabic sentence. Answer STRICTLY as JSON only (no prose, no markdown fences):

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
  let pass = 0;

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
      pass++;
      console.log(`  ✓ ${file}${v.notes ? ` — ${v.notes}` : ""}`);
    } else {
      console.log(`  ✗ ${file} — ${JSON.stringify(verdict).slice(0, 160)}`);
    }
    verdicts.push(v);
    fs.writeFileSync(REPORT, JSON.stringify({ verdicts, total: verdicts.length, passed: pass }, null, 2));
  }

  console.log(`\nVLM VISUAL QA: ${pass}/${FILES.length} passed`);
  process.exit(pass === FILES.length ? 0 : 1);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
