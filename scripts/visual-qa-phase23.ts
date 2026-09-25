/**
 * Visual QA (VLM) — Phase 2C + Phase 3 screenshots.
 * Checks per screenshot: RTL integrity (no LTR contamination / flipped
 * punctuation), no text clipping/overflow/overlap, mixed Arabic+Latin
 * rendering, chips/buttons/cards/dialogs visually intact, and (for the
 * relapse-flow shots) the new زَلّة/انتكاسة copy rendering correctly.
 * Retry on 429 with backoff. Output: console + tool-results/e2e-phase23/vlm-visual-qa.json
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const DIR = "/home/z/my-project/tool-results/e2e-phase23";
const REPORT = path.join(DIR, "vlm-visual-qa.json");
const FILES = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".png"))
  .sort();

const PROMPT = `You are auditing one screenshot of an Arabic RTL mobile app (استعادة — a recovery / self-control app, dark theme). Examine the image carefully and answer STRICTLY as JSON only (no prose, no markdown fences):

{
  "rtl_ok": <bool, overall right-to-left layout looks correct: Arabic lines start from the right edge, bullets/numbers/chips ordered RTL, no paragraph visibly starting leftward with Latin/numbers in an Arabic sentence>,
  "no_clipping": <bool, no text is cut off mid-word, no element overlaps another, nothing overflows its card/button edge>,
  "mixed_text_ok": <bool, any Arabic+Latin or Arabic+digits mix renders in natural reading order; parentheses/quotes are not mirrored or stranded; if no mixed text exists, true>,
  "punctuation_ok": <bool, no duplicated punctuation, no stray isolated marks, question marks face the Arabic direction>,
  "new_copy_renders": <bool, IF the screen shows any of: زَلّة، انتكاسة، سجّلناها كزَلّة، سجّلناها كانتكاسة، حصلت زَلّة؟، سجل الزلات والانتكاسات، ما السلوك الذي حدث؟، كيف تصف ما حدث؟ — the words render fully and legibly; true if none of these appear>,
  "notes": <string, one short sentence; if you see ANY visual defect mention it here>
}

Rules:
- Arabic-Indic digits (٥ = 5, looks like a small circle; ٠ = a dot) are CORRECT for this app.
- "من ٥" or "X من ٥" or a row of exactly five number buttons is CORRECT.
- Durations like "١٠ دقائق" (10 minutes) are NOT scale values.
- The classification chips زَلّة / انتكاسة and behavior chips إباحية / استمناء are intended UI — their presence is correct, not a defect.
- Answer based only on what is actually visible.`;

interface Verdict {
  file: string;
  rtl_ok?: boolean;
  no_clipping?: boolean;
  mixed_text_ok?: boolean;
  punctuation_ok?: boolean;
  new_copy_renders?: boolean;
  notes?: string;
  error?: string;
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
  for (let attempt = 0; ; attempt++) {
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
      const parsed = parseJson(raw);
      if (!parsed) return { file, error: "unparseable", notes: raw.slice(0, 200) };
      return {
        file,
        rtl_ok: !!parsed.rtl_ok,
        no_clipping: !!parsed.no_clipping,
        mixed_text_ok: !!parsed.mixed_text_ok,
        punctuation_ok: !!parsed.punctuation_ok,
        new_copy_renders: parsed.new_copy_renders === undefined ? true : !!parsed.new_copy_renders,
        notes: String(parsed.notes ?? ""),
      };
    } catch (e) {
      const msg = String(e);
      const is429 = msg.includes("429") || /too many requests/i.test(msg);
      if (is429 && attempt < 3) {
        const waitMs = 15000 * (attempt + 1) * (attempt + 1);
        console.log(`  … ${file}: 429, waiting ${waitMs / 1000}s`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      return { file, error: msg.slice(0, 160) };
    }
  }
}

async function main() {
  const zai = await ZAI.create();
  const verdicts: Verdict[] = [];
  for (const f of FILES) {
    const v = await verifyOne(zai, f);
    v.pass =
      !v.error &&
      !!v.rtl_ok &&
      !!v.no_clipping &&
      !!v.mixed_text_ok &&
      !!v.punctuation_ok &&
      !!v.new_copy_renders;
    verdicts.push(v);
    console.log(
      `${v.pass ? "✓" : "✗"} ${f}${v.error ? ` ERROR: ${v.error}` : ""}${
        !v.error && v.notes ? ` — ${v.notes}` : ""
      }`
    );
  }
  fs.writeFileSync(REPORT, JSON.stringify(verdicts, null, 2));
  const passed = verdicts.filter((v) => v.pass).length;
  console.log(`\nVisual QA: ${passed}/${verdicts.length} passed`);
  process.exit(passed === verdicts.length ? 0 : 1);
}

main();
