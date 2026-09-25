/**
 * PHASE 2A — machine extraction of the content libraries (READ-ONLY).
 * Imports the actual data modules and dumps every user-facing string
 * EXACTLY as stored, with stable IDs, into the inventory report file.
 * No application files are modified.
 *
 * Run: npx tsx scripts/phase2a-extract.ts
 */
import {
  RISK_LEVELS,
  MODE_LABELS,
  TRIGGERS,
  TRIGGER_CATEGORIES,
  EARLY_WARNING_SIGNS,
  ANTI_RATIONALIZATION,
  JOURNEY_STAGES,
  JOURNEY_DISCLAIMER,
  BOREDOM_MENU,
  WORK_SAFE_STEPS,
  DIGITAL_PROTECTION_GUIDES,
  DIGITAL_PROTECTION_HONESTY,
  SUPPORT_MESSAGE_TEMPLATES,
  WORK_SAFE_PRINCIPLE,
  VULNERABILITY_FACTORS,
  PERSONAL_WHY_REASONS,
  SPIRITUAL_PRACTICES,
  SPIRITUAL_DISCLAIMER,
  WHEN_TO_SEEK_HELP,
} from "../src/data/app/taxonomy";
import { KNOWLEDGE, KNOWLEDGE_CATEGORIES } from "../src/data/app/knowledge";
import { INTERVENTIONS } from "../src/data/app/interventions";
import { TIME_BUCKET_LABELS } from "../src/lib/app/helpers";

const out: string[] = [];
const pad = (n: number, w = 3) => String(n).padStart(w, "0");

function item(
  id: string,
  screen: string,
  location: string,
  type: string,
  state: string,
  text: string,
  purpose: string,
  file: string,
  srcLoc: string
) {
  out.push(`ID: ${id}`);
  out.push(`SCREEN: ${screen}`);
  out.push(`LOCATION: ${location}`);
  out.push(`TYPE: ${type}`);
  out.push(`STATE / CONDITION: ${state}`);
  out.push(`CURRENT TEXT: ${text}`);
  out.push(`PURPOSE / CONTEXT: ${purpose}`);
  out.push(`SOURCE FILE: ${file}`);
  out.push(`SOURCE LOCATION: ${srcLoc}`);
  out.push("");
}

const TAX = "src/data/app/taxonomy.ts";

// ————— Shared taxonomy rendered on multiple screens —————
item(
  "TAX-001",
  "Shared Content (Taxonomy)",
  "Risk levels — RISK_LEVELS[]",
  "conditional label + description (+examples)",
  "rendered per computed level 1–5 (Urge Check result)",
  RISK_LEVELS.map(
    (r) =>
      `المستوى ${r.level}: «${r.label}» — ${r.description}${r.examples ? ` أمثلة: ${r.examples.join(" / ")}` : ""}`
  ).join("\n"),
  "The 1–5 ladder verdict shown on the Urge Check result card",
  TAX,
  "lines 24–58"
);

item(
  "TAX-002",
  "Shared Content (Taxonomy)",
  "Mode labels — MODE_LABELS",
  "conditional label",
  "rendered as «أنسب خطوة الآن: …» per computed mode",
  Object.entries(MODE_LABELS)
    .map(([k, v]) => `${k} → «${v}»`)
    .join("\n"),
  "Recommended-step label under the Urge Check degree",
  TAX,
  "lines 60–66"
);

item(
  "TAX-003",
  "Shared Content (Taxonomy)",
  "Trigger chips — TRIGGERS[]",
  "option labels (multi-select chips)",
  "Urge Check input, Evening check-in, Relapse quick log + review, Trigger Map frequencies",
  TRIGGERS.map((t) => `${t.id} (${t.category}): «${t.label}»`).join("\n"),
  "The trigger vocabulary across the whole app",
  TAX,
  "lines 111–136"
);

item(
  "TAX-004",
  "Shared Content (Taxonomy)",
  "Trigger category labels — TRIGGER_CATEGORIES[]",
  "group labels",
  "Trigger Map «محفزاتك الأكثر تكرارًا» group headers (only items with count > 0)",
  TRIGGER_CATEGORIES.map((c) => `${c.id}: «${c.label}» (hint «${c.hint}» — hint field NOT rendered anywhere)`).join("\n"),
  "Category grouping labels on the Trigger Map",
  TAX,
  "lines 83–109"
);

item(
  "TAX-005",
  "Shared Content (Taxonomy)",
  "Early warning signs — EARLY_WARNING_SIGNS[]",
  "option labels (chips)",
  "Relapse calm review step 3",
  EARLY_WARNING_SIGNS.map((s) => `${s.id}: «${s.label}»`).join("\n"),
  "First-sign choices in the relapse review",
  TAX,
  "lines 138–149"
);

item(
  "TAX-006",
  "Shared Content (Taxonomy)",
  "Anti-rationalization panel — ANTI_RATIONALIZATION[]",
  "conditional paired copy (pattern + response)",
  "Urge Check result, mode interrupt/immediate only (first 5 shown)",
  ANTI_RATIONALIZATION.map((a) => `${a.id}: همسة: «${a.pattern}» / الرد: «${a.response}»`).join("\n"),
  "Countering the internal negotiation voice",
  TAX,
  "lines 151–196"
);

item(
  "TAX-007",
  "Shared Content (Taxonomy)",
  "Journey stages — JOURNEY_STAGES[]",
  "label + description (conditional)",
  "Dose Screen header + stage note; Progress journey card (by daysSinceStart)",
  JOURNEY_STAGES.map((s) => `${s.id} (أيام ${s.fromDay}–${s.toDay}): «${s.label}» — ${s.description}`).join("\n"),
  "Journey stage naming and explanation",
  TAX,
  "lines 198–255"
);

item(
  "TAX-008",
  "Shared Content (Taxonomy)",
  "Journey disclaimer — JOURNEY_DISCLAIMER",
  "disclaimer",
  "always with the stage display (Dose + Progress)",
  JOURNEY_DISCLAIMER,
  "Honesty note: stages organize content, not a guaranteed timeline",
  TAX,
  "lines 257–258"
);

item(
  "TAX-009",
  "Shared Content (Taxonomy)",
  "Work-safe steps — WORK_SAFE_STEPS[]",
  "conditional instruction list",
  "Emergency step 1, workSafe=true only (items [1..4])",
  WORK_SAFE_STEPS.map((s, i) => `${i}: «${s}»`).join("\n"),
  "Work-safe sub-steps under the main instruction",
  TAX,
  "lines 282–291"
);

item(
  "TAX-010",
  "Shared Content (Taxonomy)",
  "Digital protection guides — DIGITAL_PROTECTION_GUIDES[]",
  "collapsible guide cards (title + what + how[] + limits)",
  "Prevention screen «الحماية الرقمية» (collapsed by default)",
  DIGITAL_PROTECTION_GUIDES.map(
    (g) => `${g.id}: «${g.title}»\n  ما هي: ${g.what}\n  كيف: ${g.how.join(" / ")}\n  حدودها: ${g.limits}`
  ).join("\n"),
  "Optional external tool guides with honest limits",
  TAX,
  "lines 293–366"
);

item(
  "TAX-011",
  "Shared Content (Taxonomy)",
  "Digital protection honesty note — DIGITAL_PROTECTION_HONESTY",
  "warning note",
  "always under the digital protection guides",
  DIGITAL_PROTECTION_HONESTY,
  "Honest limitation of in-app protection advice",
  TAX,
  "lines 368–369"
);

item(
  "TAX-012",
  "Shared Content (Taxonomy)",
  "Support message templates — SUPPORT_MESSAGE_TEMPLATES[]",
  "copyable neutral message chips",
  "Prevention «قوالب رسائل محايدة»; Emergency escalated fallback shows template[0]",
  SUPPORT_MESSAGE_TEMPLATES.map((t) => `«${t}»`).join("\n"),
  "Neutral scripts the user can send a trusted person",
  TAX,
  "lines 371–376"
);

item(
  "TAX-013",
  "Shared Content (Taxonomy)",
  "Vulnerability factors — VULNERABILITY_FACTORS[]",
  "option labels (multi-select chips)",
  "Relapse calm review step 2",
  VULNERABILITY_FACTORS.map((v) => `${v.id}: «${v.label}»`).join("\n"),
  "What weakened resistance that day",
  TAX,
  "lines 381–390"
);

item(
  "TAX-014",
  "Shared Content (Taxonomy)",
  "Personal why reasons — PERSONAL_WHY_REASONS[]",
  "option labels (chips)",
  "Onboarding step 6; Values screen; Emergency PersonalWhy fallback chips",
  PERSONAL_WHY_REASONS.map((p) => `${p.id}: «${p.label}»`).join("\n"),
  "The user's chosen 'why' vocabulary",
  TAX,
  "lines 392–403"
);

item(
  "TAX-015",
  "Shared Content (Taxonomy)",
  "Spiritual practices — SPIRITUAL_PRACTICES[]",
  "collapsible cards (title + body + steps[]) — gated",
  "Values screen, spiritualContent === true only",
  SPIRITUAL_PRACTICES.map(
    (p) => `${p.id}: «${p.title}»\n  ${p.body}${p.steps ? `\n  خطوات: ${p.steps.join(" / ")}` : ""}`
  ).join("\n"),
  "Optional spiritual practice guidance",
  TAX,
  "lines 405–461"
);

item(
  "TAX-016",
  "Shared Content (Taxonomy)",
  "Spiritual disclaimer — SPIRITUAL_DISCLAIMER",
  "info note — gated",
  "Values screen, spiritualContent === true only",
  SPIRITUAL_DISCLAIMER,
  "Separates spiritual content from clinical claims",
  TAX,
  "lines 463–464"
);

item(
  "TAX-017",
  "Shared Content (Taxonomy)",
  "When to seek professional help — WHEN_TO_SEEK_HELP[]",
  "bullet list",
  "Settings «متى تطلب دعمًا مهنيًا؟»",
  WHEN_TO_SEEK_HELP.map((w) => `«${w}»`).join("\n"),
  "Professional-help escalation criteria",
  TAX,
  "lines 466–472"
);

item(
  "TAX-018",
  "Shared Content (Taxonomy)",
  "Time bucket labels — TIME_BUCKET_LABELS",
  "labels",
  "Trigger Map time distribution rows; Progress insight row",
  Object.entries(TIME_BUCKET_LABELS).map(([k, v]) => `${k}: «${v}»`).join("\n"),
  "Time-of-day bucket names",
  "src/lib/app/helpers.ts",
  "lines 74–79"
);

item(
  "TAX-019",
  "Shared Content (Taxonomy)",
  "Boredom menu — BOREDOM_MENU[]",
  "UNUSED library content",
  "defined but never imported by any component",
  BOREDOM_MENU.map((b) => `${b.label}: ${b.options.join(" / ")}`).join("\n"),
  "REVIEW: uncertain — not currently reachable in the UI",
  TAX,
  "lines 260–280"
);

item(
  "TAX-020",
  "Shared Content (Taxonomy)",
  "Work-safe principle — WORK_SAFE_PRINCIPLE",
  "UNUSED library content",
  "defined but never imported by any component",
  WORK_SAFE_PRINCIPLE,
  "REVIEW: uncertain — not currently reachable in the UI",
  TAX,
  "lines 378–379"
);

item(
  "TAX-021",
  "Shared Content (Taxonomy)",
  "Greeting() — helpers.ts",
  "dynamic greeting (title)",
  "Home ScreenHeader title, by hour: <5 / <12 / <17 / <21 / else",
  "«ليلة هادئة» (قبل ٥ص) / «صباح الخير» (٥ص–١٢م) / «نهارك طيب» (١٢م–٥م) / «مساء الخير» (٥م فأكثر)",
  "Time-of-day greeting",
  "src/lib/app/helpers.ts",
  "lines 57–64"
);

// ————— Knowledge content library —————
item(
  "KB-000",
  "Knowledge Content Library",
  "Category chips — KNOWLEDGE_CATEGORIES[]",
  "filter chip labels (+ live counts)",
  "Knowledge screen chip row; «الكل (N)» chip added in screen; spiritual chip hidden when toggle OFF",
  KNOWLEDGE_CATEGORIES.map((c) => `${c.id}: «${c.label}»`).join("\n"),
  "Knowledge category vocabulary",
  "src/data/app/knowledge.ts",
  "lines 6–27"
);

KNOWLEDGE.forEach((k, i) => {
  const n = pad(i + 1);
  item(
    `KB-${n}`,
    "Knowledge Content Library",
    `Knowledge card — ${k.id}`,
    "content card (title + know + understand + act + remember + deep?)",
    `shown on Knowledge screen / Daily Dose / dose preview; ${k.spiritual ? "spiritualContent === true only" : "always"}`,
    [
      `العنوان: «${k.title}»`,
      `اعرف: ${k.know}`,
      `افهم: ${k.understand}`,
      `افعل: ${k.act}`,
      `تذكّر: ${k.remember}`,
      k.deep ? `قراءة أعمق: ${k.deep}` : "قراءة أعمق: (لا يوجد)",
    ].join("\n"),
    `Knowledge card content (${k.category})`,
    "src/data/app/knowledge-{core,wellbeing,recovery}.ts",
    `item id "${k.id}"`
  );
});

// ————— Intervention content library —————
INTERVENTIONS.forEach((iv, i) => {
  const n = pad(i + 1);
  item(
    `IV-${n}`,
    "Intervention Content Library",
    `Intervention — ${iv.id}`,
    "intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)",
    `selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels ${iv.riskLevels.join("/")}); ${iv.workSafe ? "work-safe" : "not work-safe"}`,
    [
      `الاسم: «${iv.name}»`,
      `المدة: ${iv.duration}`,
      `المكان: ${iv.location}`,
      `الخطوات: ${iv.instructions.join(" / ")}`,
      `لماذا يساعد: ${iv.whyItHelps}`,
      `التالي: ${iv.nextAction}`,
    ].join("\n"),
    "Executable intervention instructions",
    "src/data/app/interventions.ts",
    `item id "${iv.id}"`
  );
});

import { writeFileSync } from "fs";
writeFileSync(
  "/home/z/my-project/tool-results/phase2a/library-dump.md",
  out.join("\n")
);
console.log(
  `items written: TAX=21, KB=${KNOWLEDGE.length}, IV=${INTERVENTIONS.length}, total lines=${out.length}`
);
console.log(
  `knowledge categories=${KNOWLEDGE_CATEGORIES.length}, spiritual items=${KNOWLEDGE.filter((k) => k.spiritual).length}`
);
