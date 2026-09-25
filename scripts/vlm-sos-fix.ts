/** SOS-fix visual confirmation — VLM pass over the two fixed launcher paths. */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

const DIR = "/home/z/my-project/tool-results/sos-fix";

const FILES: { file: string; ask: string }[] = [
  {
    file: "A-crop-top.png",
    ask: 'This is the Emergency Mode step-1 screen opened from the bottom-navigation center SOS button in an Arabic RTL app. Expected header line: "درجة الحالة: 4 من ٥" with NO "أزمة" suffix, red/destructive emergency styling, and a step list. Report exactly: degree_line_text, value_within_1_to_5 (true/false), any_number_above_5_visible (true/false), azma_suffix_visible (true/false), layout_ok, text_clipped.',
  },
  {
    file: "B-moresheet-sos.png",
    ask: 'This is the Emergency Mode step-1 screen opened from the More-sheet "تدخّل الآن" card in an Arabic RTL app. Expected header line: "درجة الحالة: 4 من ٥" with NO "أزمة" suffix. Report exactly: degree_line_text, value_within_1_to_5 (true/false), any_number_above_5_visible (true/false), azma_suffix_visible (true/false), layout_ok, text_clipped.',
  },
  {
    file: "D2-urge-max-handoff.png",
    ask: 'This is the Emergency Mode maximum/crisis screen reached from the Urge Check flow with all three scales answered 5. Expected header line: "درجة الحالة: 5 من ٥ — أزمة". Report exactly: degree_line_text, azma_suffix_visible (true/false), value_within_1_to_5 (true/false), layout_ok.',
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
