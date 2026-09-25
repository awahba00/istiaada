/** Phase 2B.2 visual QA — quick-log (new fields) + record list (badges). */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

const DIR = "/home/z/my-project/tool-results/phase2b2";

const FILES: { file: string; ask: string }[] = [
  {
    file: "quick-log.png",
    ask:
      'This is the quick-log screen of an Arabic RTL recovery app at 390px width. Expected: a header "تسجيل سريع", then Card 1 question "إيه السلوك اللي حصل؟" with two selectable chips "الإباحية" and "الاستمناء" (الإباحية shown selected/primary-filled), then Card 2 question "كيف تصف اللي حصل؟" with chips "زَلّة" and "انتكاسة", then a small muted definitions line mentioning "الزَّلّة" and "الانتكاسة: عودة للنمط", then trigger chips card, time-to-stop card, continued card, and a full-width save button "حفظ ومتابعة". Report exactly: behavior_question_visible (true/false), classification_question_visible (true/false), chips_visible, definitions_line_visible (true/false), rtl_direction_ok (true/false), text_clipped_or_overlapping (true/false), layout_ok (true/false).',
  },
  {
    file: "record-list.png",
    ask:
      'This is the main screen of the Relapse Center ("توقّف هنا") in an Arabic RTL app. It should show a subtitle starting with "حصلت زَلّة؟", a red CTA, and a record list ("سجل التعثرات") with 3 event rows. The two most recent rows must show small pill badges: row with "انتكاسة" + "إباحية + استمناء", row with "زَلّة" + "إباحية", while the oldest (legacy) row shows only old badges (like "خلال دقائق", "أوقف عند حدّه", "مُراجَع") with NO زَلّة/انتكاسة/إباحية badge. Report exactly: subtitle_text, zalla_badge_visible (true/false), intikasa_badge_visible (true/false), both_behaviors_badge_text, legacy_row_has_no_new_badges (true/false), rtl_direction_ok (true/false), text_clipped_or_overlapping (true/false), layout_ok (true/false).',
  },
];

async function main() {
  const zai = await ZAI.create();
  for (const { file, ask } of FILES) {
    const b64 = fs.readFileSync(`${DIR}/${file}`).toString("base64");
    let lastErr = "";
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await zai.chat.completions.createVision({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: ask },
                { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
              ],
            },
          ],
          thinking: { type: "disabled" },
        });
        const raw = res.choices[0]?.message?.content ?? "";
        console.log(`— ${file}: ${raw.trim().slice(0, 500)}`);
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
