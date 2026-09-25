/**
 * Quick check: does any corner of the given screenshots contain the Next.js
 * dev-tools badge (the small floating circular indicator shown only in dev
 * mode)? Used to decide whether a production-build re-shoot is needed.
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const DIR = process.env.BADGE_DIR ?? "/home/z/my-project/tool-results/scale5-regen";
const FILES = (process.argv[2] ?? "02-home-stable-390.png,19-urge-input-320.png,17-evening-checkin-390.png").split(",");

async function main() {
  const zai = await ZAI.create();
  for (const f of FILES) {
    const b64 = fs.readFileSync(path.join(DIR, f)).toString("base64");
    const res = await zai.chat.completions.createVision({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Look carefully at ALL four corners and edges of this mobile app screenshot. Is there any small floating circular badge/button overlay (a Next.js dev-tools indicator, usually a small dark circle with an N logo or a build-status dot) that does NOT belong to the app UI itself? Answer STRICTLY as JSON only: {"dev_badge_visible": <bool>, "where": <string, corner/edge or "">, "notes": <string>}`,
            },
            { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
          ],
        },
      ],
      thinking: { type: "disabled" },
    });
    console.log(f, "→", res.choices[0]?.message?.content?.trim());
  }
}
main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
