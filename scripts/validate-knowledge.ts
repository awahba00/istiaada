// Phase 3 content validation — runs with bun.
// Validates the merged knowledge bank (98 rewritten + 50 new):
//   - total count === 148 (98 + 50)
//   - unique IDs, no missing/empty required fields
//   - all categories exist; stage values valid; tags non-empty strings
//   - spiritual flags unchanged on the original 5 sp-* cards; zero new gated cards
//   - the 50 new ids exactly match the intended NEW-01..NEW-50 mapping
//   - terminology: زَلّة with shadda everywhere (no bare "زلة" without diacritics),
//     no forbidden judgmental phrases, no symbol-notation (+/=/→) inside prose
import { KNOWLEDGE, KNOWLEDGE_CATEGORIES } from "../src/data/app/knowledge";
import { TRIGGERS } from "../src/data/app/taxonomy";

let pass = 0;
let fail = 0;
const ok = (m: string) => { pass++; console.log(`  ✓ ${m}`); };
const bad = (m: string) => { fail++; console.error(`  ✗ ${m}`); };

const catIds = new Set(KNOWLEDGE_CATEGORIES.map((c) => c.id));
const triggerIds = new Set(TRIGGERS.map((t) => t.id));
const knownNonTriggerTags = new Set(["unstructured", "digital"]); // pre-existing tags in the 98

console.log("== 1. counts ==");
KNOWLEDGE.length === 148 ? ok(`total cards = 148 (98 + 50)`) : bad(`total = ${KNOWLEDGE.length}, expected 148`);

console.log("== 2. ids ==");
const ids = KNOWLEDGE.map((k) => k.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
dupes.length === 0 ? ok("no duplicate ids") : bad(`duplicate ids: ${dupes.join(", ")}`);
const badFormat = ids.filter((id) => !/^[a-z][a-z0-9-]*$/.test(id));
badFormat.length === 0 ? ok("all ids kebab-case latin") : bad(`bad id format: ${badFormat.join(", ")}`);

console.log("== 3. required fields ==");
const missing: string[] = [];
for (const k of KNOWLEDGE) {
  for (const f of ["title", "know", "understand", "act", "remember"] as const) {
    const v = k[f];
    if (typeof v !== "string" || v.trim().length < 3) missing.push(`${k.id}.${f}`);
  }
}
missing.length === 0 ? ok("no missing/empty required fields") : bad(`missing: ${missing.join(", ")}`);

console.log("== 4. categories & metadata ==");
const badCat = KNOWLEDGE.filter((k) => !catIds.has(k.category));
badCat.length === 0 ? ok("all categories valid") : bad(`invalid category: ${badCat.map((k) => k.id).join(", ")}`);
const badStage = KNOWLEDGE.filter((k) => !["early", "mid", "late", "any"].includes(k.stage));
badStage.length === 0 ? ok("all stages valid") : bad(`bad stage: ${badStage.map((k) => k.id).join(", ")}`);
const badTags = KNOWLEDGE.filter((k) => !Array.isArray(k.tags) || k.tags.some((t) => typeof t !== "string"));
badTags.length === 0 ? ok("all tags are string arrays") : bad(`bad tags: ${badTags.map((k) => k.id).join(", ")}`);
const nonTrigger = new Set<string>();
for (const k of KNOWLEDGE) for (const t of k.tags) if (!triggerIds.has(t) && !knownNonTriggerTags.has(t)) nonTrigger.add(`${k.id}:${t}`);
nonTrigger.size === 0 ? ok("all tags are taxonomy trigger ids (or pre-existing extras)") : bad(`unknown tags: ${[...nonTrigger].join(", ")}`);

console.log("== 5. spiritual gate ==");
const gated = KNOWLEDGE.filter((k) => k.spiritual).map((k) => k.id);
gated.length === 5 && gated.every((id) => id.startsWith("sp-"))
  ? ok(`spiritual cards unchanged: ${gated.join(", ")} (0 new gated cards)`)
  : bad(`unexpected gated set: ${gated.join(", ")}`);

console.log("== 6. the 50 new ids ==");
const NEW_IDS: Record<string, string> = {
  "NEW-01": "di-morning-protocol", "NEW-02": "dg-phone-first-decision", "NEW-03": "at-transition-home",
  "NEW-04": "at-between-tasks", "NEW-05": "at-waiting-gaps", "NEW-06": "at-post-completion",
  "NEW-07": "di-open-days", "NEW-08": "lt-travel", "NEW-09": "sl-ramadan", "NEW-10": "st-exam-season",
  "NEW-11": "lt-app-return", "NEW-12": "di-routine-rebuild", "NEW-13": "at-boredom-list",
  "NEW-14": "at-boredom-tolerance", "NEW-15": "dg-rest-no-phone", "NEW-16": "st-after-hard-day",
  "NEW-17": "em-anger", "NEW-18": "em-sadness-frustration", "NEW-19": "em-social-anxiety",
  "NEW-20": "em-shame-after-slip", "NEW-21": "em-unclear-feelings", "NEW-22": "re-after-hard-talk",
  "NEW-23": "re-loneliness-reading", "NEW-24": "re-asking-support", "NEW-25": "re-disclosure",
  "NEW-26": "re-repair-relationship", "NEW-27": "dg-content-from-others", "NEW-28": "dg-chat-groups",
  "NEW-29": "dg-algorithms", "NEW-30": "dg-unintended-exposure", "NEW-31": "en-click-chain",
  "NEW-32": "tr-no-testing-decision", "NEW-33": "tr-map-reading", "NEW-34": "pv-trigger-to-rule",
  "NEW-35": "pv-weekly-tune", "NEW-36": "pv-rule-failed", "NEW-37": "ur-intensity-proximity",
  "NEW-38": "lt-progress-reading", "NEW-39": "rl-calm-review", "NEW-40": "rl-first-hour",
  "NEW-41": "pv-repeat-pattern", "NEW-42": "rl-after-success", "NEW-43": "sc-hard-day",
  "NEW-44": "di-restart", "NEW-45": "ur-urge-return", "NEW-46": "at-deep-work",
  "NEW-47": "pr-hobby", "NEW-48": "va-day-design", "NEW-49": "re-specialized-help",
  "NEW-50": "re-first-appointment",
};
const idSet = new Set(ids);
const notFound = Object.entries(NEW_IDS).filter(([, id]) => !idSet.has(id));
notFound.length === 0 ? ok("all 50 NEW topic ids present (NEW-01..NEW-50)") : bad(`missing: ${notFound.map(([n, id]) => `${n}=${id}`).join(", ")}`);
const collisions = Object.values(NEW_IDS).filter((id) => !idSet.has(id));
// also ensure none of the 50 ids collide with the old 98 (they'd appear once only)
const old98 = KNOWLEDGE.filter((k) => !Object.values(NEW_IDS).includes(k.id));
old98.length === 98 ? ok("old 98 ids all still present & distinct from the 50") : bad(`old count = ${old98.length}`);

console.log("== 7. language / terminology invariants ==");
const allText = KNOWLEDGE.map((k) => [k.id, [k.title, k.know, k.understand, k.act, k.remember, k.deep ?? ""].join(" ")] as const);
// bare زلة without diacritics (should always be زَلّة with fatha+shadda) — allow داخل/انتكاسة words
const bareZalla = allText.filter(([, t]) => /(?<![\u0621-\u064A])زلة/.test(t.replace(/زَلّة/g, "")));
bareZalla.length === 0 ? ok("زَلّة always written with fatha+shadda") : bad(`bare زلة in: ${bareZalla.map(([id]) => id).join(", ")}`);
const forbidden = ["أنت منتكس", "رجعت لنقطة الصفر", "أنت فاشل، ا", "ضعيف الشخصية", "انتصربت على نفسك", "انهزمت أمام"];
const hasForbidden = allText.filter(([, t]) => forbidden.some((f) => t.includes(f)));
hasForbidden.length === 0 ? ok("no judgmental phrases (you-are-X / back-to-zero family)") : bad(`forbidden in: ${hasForbidden.map(([id]) => id).join(", ")}`);
// symbol notation inside prose: standalone + = → between arabic words
const symbols = allText.filter(([, t]) => /[=+→]/.test(t));
symbols.length === 0 ? ok("no symbol notation (+, =, →) inside card text") : bad(`symbols in: ${symbols.map(([id]) => id).join(", ")}`);
// Latin words other than the documented wanting/liking pair in bb-dopamine deep
const latin = allText.filter(([id, t]) => {
  const cleaned = id === "bb-dopamine" ? t.replace(/\(wanting\)|\(liking\)/g, "") : t;
  return /[A-Za-z]{3,}/.test(cleaned);
});
latin.length === 0 ? ok("no Latin words in user-facing card text (except documented wanting/liking)") : bad(`latin in: ${latin.map(([id]) => id).join(", ")}`);

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
