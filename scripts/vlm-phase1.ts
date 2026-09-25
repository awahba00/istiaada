/**
 * Phase 1 visual sanity — VLM pass over the key Phase-1 screenshots.
 * Asks: layout intact? text clipped? RTL correct? plus per-file facts.
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const DIR = "/home/z/my-project/tool-results/phase1";

const FILES: { file: string; ask: string }[] = [
  {
    file: "02-dose-after-complete.png",
    ask: 'This is the Daily Dose screen right after pressing "تمت الجرعة". Expected: the dose card with title "تعثر اليوم بيانات خطة الغد", a green success banner "أنجزت جرعة اليوم" with a check icon, and NO "تمت الجرعة"/"تخطي اليوم" buttons. Report: banner_visible, buttons_gone, layout_ok, text_clipped.',
  },
  {
    file: "05-dose-skipped.png",
    ask: 'This is the Daily Dose screen with today\'s dose marked skipped. Expected: a gray badge "مُخطاة اليوم" next to the category badge in the card header, a small note line "خطّيت جرعة اليوم — إن أردت إنجازها فهي نفسها أمامك…", and BOTH buttons "تمت الجرعة" and "تخطي اليوم" still present. Report: skip_badge_visible, note_visible, buttons_visible, layout_ok, text_clipped.',
  },
  {
    file: "08-settings-spiritual-on.png",
    ask: 'This is the Settings screen with the spiritual content toggle ON. Expected: under the "المحتوى الروحي/القيمي" toggle row, a small line starting with "يظهر الآن: ممارسات في «القيم والروحانيات»…". Report: note_visible, toggle_on, layout_ok, text_clipped.',
  },
  {
    file: "09-knowledge-on.png",
    ask: 'This is the Knowledge screen with spiritual content ON. Expected: category chips row contains a chip "تأمل روحي (5)" and the "الكل" chip shows 98. Report: spiritual_chip_visible, chip_count_5, layout_ok, text_clipped.',
  },
  {
    file: "13-prevention-badges.png",
    ask: 'This is the Prevention screen with one if/then rule. Expected: the rule shows a small SOLID amber badge "إذا" (dark text on solid amber) and a SOLID green badge "إذن" (dark text on solid green) — not pale washed-out tints. Report: solid_badges, layout_ok, text_clipped.',
  },
];

async function main() {
  const zai = await ZAI.create();
  for (const { file, ask } of FILES) {
    const p = path.join(DIR, file);
    if (!fs.existsSync(p)) {
      console.log(`— ${file}: MISSING`);
      continue;
    }
    const b64 = fs.readFileSync(p).toString("base64");
    let lastErr = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await zai.chat.completions.createVision({
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    "You are verifying a mobile Arabic RTL app screenshot (dark theme). Answer ONLY with compact JSON like {\"findings\": {\"thing\": true}, \"layout_ok\": true, \"text_clipped\": false, \"notes\": \"...\"} using the field names requested. " +
                    ask,
                },
                { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
              ],
            },
          ],
          thinking: { type: "disabled" },
        });
        const raw = res.choices[0]?.message?.content ?? "";
        console.log(`— ${file}: ${raw.trim().slice(0, 400)}`);
        lastErr = "";
        break;
      } catch (e) {
        lastErr = String(e);
        await new Promise((r) => setTimeout(r, 15000 * (attempt + 1)));
      }
    }
    if (lastErr) console.log(`— ${file}: VLM ERROR ${lastErr.slice(0, 120)}`);
  }
}

main();
