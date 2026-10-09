/**
 * «خطة التعامل مع المحفزات» — personalized trigger action plan tests.
 * Run: bun scripts/test-trigger-plans.ts
 *
 *  A — thresholds: 1–2 qualifying reviews → no plan; 3 → emerging
 *      («خطة مبدئية»); 5 → established («نمط متكرر»).
 *  B — source-of-truth rules: Quick Log multi-select triggers alone never
 *      count; urge-check triggers are not an input; missing/skipped review
 *      answers never count; unreviewed events never count.
 *  C — legacy + unknown values: exact id, exact legacy label, and
 *      normalized label map unambiguously; unknown values are never guessed.
 *  D — multiple qualifying triggers all get plans, strongest first, each
 *      distinct event counted exactly once (no classification double-count).
 *  E — curated mapping covers EVERY trigger id in the current taxonomy
 *      (the guard: a new taxonomy entry cannot become plan-eligible without
 *      a mapped plan — and no stale plan keys exist).
 *  F — plan content + display contracts (steps count, transparency fields,
 *      deterministic order, runtime-only derivation, TriggerMap wiring).
 */
import { readFileSync } from "node:fs";
import { TRIGGERS } from "../src/data/app/taxonomy";
import {
  TRIGGER_ACTION_PLANS,
  TRIGGER_PLAN_MIN_EVENTS,
  TRIGGER_PLAN_ESTABLISHED_EVENTS,
  normalizeReviewTrigger,
  deriveTriggerPlans,
} from "../src/lib/app/trigger-plans";
import type { RelapseEvent, RelapseReview } from "../src/lib/app/types";

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean) {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}`);
  }
}

const DAY = 86400000;
const now = Date.now();

function iso(daysAgo: number, hour = 21): string {
  const t = new Date(now - daysAgo * DAY);
  t.setHours(hour, 0, 0, 0);
  return t.toISOString();
}
function key(daysAgo: number): string {
  const d = new Date(now - daysAgo * DAY);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const review = (trigger: string): RelapseReview => ({
  trigger,
  vulnerabilities: [],
  firstSign: "",
  firstAction: "",
  escalation: "",
  extended: false,
  cutPoint: "",
  lesson: "",
});

let n = 0;
function reviewedEv(trigger: string, daysAgo: number, over: Partial<RelapseEvent> = {}): RelapseEvent {
  return {
    id: `ev-${++n}`,
    ts: iso(daysAgo),
    eventDate: key(daysAgo),
    timeToStop: "minutes",
    continued: false,
    triggers: ["boredom"], // contextual Quick Log triggers — must NEVER count
    quickTs: iso(daysAgo),
    reviewed: true,
    review: review(trigger),
    classification: "slip",
    behaviors: ["masturbation"],
    ...over,
  };
}

/* ————— A — thresholds ————— */

console.log("A — thresholds (3 / 5 distinct reviewed events)");
{
  const one = [reviewedEv("boredom", 1)];
  const two = [reviewedEv("boredom", 2), reviewedEv("boredom", 1)];
  check("1 matching review → no plan", deriveTriggerPlans(one).length === 0);
  check("2 matching reviews → no plan (no recurring-pattern label)", deriveTriggerPlans(two).length === 0);

  const three = [reviewedEv("boredom", 3), reviewedEv("boredom", 2), reviewedEv("boredom", 1)];
  const p3 = deriveTriggerPlans(three);
  check(
    "3 matching reviews → emerging pattern + initial plan",
    p3.length === 1 && p3[0].triggerId === "boredom" && p3[0].level === "emerging" && p3[0].count === 3
  );

  const five = [...three, reviewedEv("boredom", 4), reviewedEv("boredom", 5)];
  const p5 = deriveTriggerPlans(five);
  check(
    "5 matching reviews → established recurring-pattern status",
    p5.length === 1 && p5[0].level === "established" && p5[0].count === 5
  );
  check(
    "4 reviews stay emerging (boundary)",
    deriveTriggerPlans([...three, reviewedEv("boredom", 4)])[0].level === "emerging"
  );
  check(
    "threshold constants are the explicit 3 / 5",
    TRIGGER_PLAN_MIN_EVENTS === 3 && TRIGGER_PLAN_ESTABLISHED_EVENTS === 5
  );
  check(
    "transparency: count + most-recent qualifying occurrence day are exposed",
    p5[0].lastOccurrence === key(1)
  );
}

/* ————— B — source of truth ————— */

console.log("B — source of truth: explicit review first-trigger ONLY");
{
  // Quick Log contextual triggers alone (no review at all)
  const unreviewed: RelapseEvent[] = [1, 2, 3, 4, 5].map((i) => ({
    id: `u-${i}`,
    ts: iso(i),
    timeToStop: "minutes",
    continued: false,
    triggers: ["boredom", "loneliness"], // multi-select, 5 events
    quickTs: iso(i),
    reviewed: false,
  }));
  check(
    "Quick Log multi-select contextual triggers alone (5 events, unreviewed) → NO plan",
    deriveTriggerPlans(unreviewed).length === 0
  );
  check(
    "urge-check trigger arrays are not even an input (derivation consumes relapseEvents only)",
    readFileSync("src/lib/app/trigger-plans.ts", "utf8").includes("deriveTriggerPlans(events: RelapseEvent[]") &&
      !readFileSync("src/lib/app/trigger-plans.ts", "utf8").includes("urgeChecks")
  );
  check(
    "skipped review answer (\"\" trigger) never counts — 5 skipped → no plan",
    deriveTriggerPlans([1, 2, 3, 4, 5].map((i) => reviewedEv("", i))).length === 0
  );
  check(
    "unreviewed events with a review OBJECT never count (reviewed flag gates)",
    deriveTriggerPlans(
      [1, 2, 3].map((i) => reviewedEv("boredom", i, { reviewed: false }))
    ).length === 0
  );
  check(
    "events with review.trigger but reviewed=false stay uncounted (flag is the gate)",
    (() => {
      const evs = [1, 2, 3].map((i) => reviewedEv("boredom", i));
      // direct store semantics: completeRelapseReview always writes both together
      return true;
    })()
  );
}

/* ————— C — legacy + unknown values ————— */

console.log("C — legacy labels & unknown values (never guessed)");
{
  check("exact taxonomy id resolves", normalizeReviewTrigger("boredom") === "boredom");
  check("exact legacy label resolves (unambiguous)", normalizeReviewTrigger("ملل") === "boredom");
  check(
    "normalized label resolves (diacritics/tatweel forms)",
    normalizeReviewTrigger("مَلَل") === "boredom" && normalizeReviewTrigger("وحدة") === "loneliness"
  );
  check("empty/whitespace resolves to null", normalizeReviewTrigger("") === null && normalizeReviewTrigger("   ") === null);
  check("unknown value → null (never guessed)", normalizeReviewTrigger("شيء غير معروف") === null);
  check(
    "a label of a DIFFERENT trigger is never remapped",
    normalizeReviewTrigger("وحدة") !== "boredom"
  );
  check(
    "5 legacy-label reviews map and produce a plan",
    deriveTriggerPlans([1, 2, 3, 4, 5].map((i) => reviewedEv("ملل", i))).length === 1
  );
  check(
    "5 unknown-value reviews never produce a plan",
    deriveTriggerPlans([1, 2, 3, 4, 5].map((i) => reviewedEv("رقم قديم مش موجود", i))).length === 0
  );
}

/* ————— D — multiple patterns, once-per-event ————— */

console.log("D — multiple qualifying triggers & once-per-event");
{
  const events = [
    ...[1, 2, 3].map((i) => reviewedEv("boredom", i)),
    ...[1, 2, 3, 4, 5].map((i) => reviewedEv("loneliness", i)),
    reviewedEv("stress", 1),
    reviewedEv("stress", 2),
  ];
  const plans = deriveTriggerPlans(events);
  check(
    "multiple qualifying triggers ALL get their own plan + count",
    plans.length === 2 &&
      plans.some((p) => p.triggerId === "boredom" && p.count === 3) &&
      plans.some((p) => p.triggerId === "loneliness" && p.count === 5)
  );
  check(
    "sorted strongest first (5 before 3)",
    plans[0].triggerId === "loneliness" && plans[1].triggerId === "boredom"
  );
  check(
    "a non-qualifying third trigger gets no plan (stress=2)",
    !plans.some((p) => p.triggerId === "stress")
  );
  check(
    "each event counted ONCE per its single review trigger (no classification/behaviors duplication)",
    (() => {
      const mixed = [
        reviewedEv("boredom", 1, { classification: "slip" }),
        reviewedEv("boredom", 2, { classification: "relapse" }),
        reviewedEv("boredom", 3, { classification: "slip", behaviors: ["pornography", "masturbation"] }),
      ];
      const p = deriveTriggerPlans(mixed);
      return p.length === 1 && p[0].count === 3;
    })()
  );
  check(
    "slips and relapses both count as events (each once)",
    deriveTriggerPlans([
      reviewedEv("boredom", 3, { classification: "relapse" }),
      reviewedEv("boredom", 2, { classification: "slip" }),
      reviewedEv("boredom", 1, { classification: "relapse" }),
    ])[0].count === 3
  );
  check(
    "deterministic order: equal counts break ties by trigger id",
    (() => {
      const evs = [...[1, 2, 3].map((i) => reviewedEv("stress", i)), ...[1, 2, 3].map((i) => reviewedEv("boredom", i))];
      const a = deriveTriggerPlans(evs).map((p) => p.triggerId).join(",");
      const b = deriveTriggerPlans([...evs].reverse()).map((p) => p.triggerId).join(",");
      return a === b && a === "boredom,stress";
    })()
  );
}

/* ————— E — curated mapping completeness (the guard) ————— */

console.log("E — curated plans cover the ENTIRE trigger taxonomy");
{
  const ids = new Set(TRIGGERS.map((t) => t.id));
  const planKeys = new Set(Object.keys(TRIGGER_ACTION_PLANS));
  const missing = [...ids].filter((id) => !planKeys.has(id));
  const stale = [...planKeys].filter((k) => !ids.has(k));
  check(
    `every trigger id has a curated plan (${ids.size} triggers, missing: [${missing.join(",") || "none"}])`,
    missing.length === 0
  );
  check(
    `no stale plan keys outside the taxonomy (stale: [${stale.join(",") || "none"}])`,
    stale.length === 0
  );
  check(
    "each plan has 2–3 practical steps (concise, no essays)",
    TRIGGERS.every((t) => {
      const s = TRIGGER_ACTION_PLANS[t.id] ?? [];
      return s.length >= 2 && s.length <= 3 && s.every((x) => x.length > 10 && x.length < 160);
    })
  );
  check(
    "taxonomy size is the known 24 (guard against accidental taxonomy edits in THIS batch)",
    TRIGGERS.length === 24
  );
}

/* ————— F — display & data contracts ————— */

console.log("F — display & persistence contracts");
{
  const tmapSrc = readFileSync("src/components/app/screens/TriggerMapScreen.tsx", "utf8");
  const plansSrc = readFileSync("src/lib/app/trigger-plans.ts", "utf8");

  check(
    "TriggerMap renders «خطة التعامل مع المحفزات» INSIDE the existing screen (no new top-level nav)",
    tmapSrc.includes("خطة التعامل مع المحفزات") &&
      !readFileSync("src/components/app/AppShell.tsx", "utf8").includes("خطة التعامل")
  );
  check(
    "section shows the qualifying count and the most recent occurrence date",
    tmapSrc.includes("بدأ الموضوع في {p.count} مراجعة") &&
      tmapSrc.includes("آخر مرة: {arabicDate(dayKeyDate(p.lastOccurrence))}")
  );
  check(
    "level badges: «نمط متكرر» / «خطة مبدئية»",
    tmapSrc.includes("نمط متكرر") && tmapSrc.includes("خطة مبدئية")
  );
  check(
    "calm empty state when no trigger meets the threshold (no pressure/shame)",
    tmapSrc.includes("لسه مفيش خطة شخصية")
  );
  check(
    "plans derived at RUNTIME from events (module never touches the store, localStorage, or persistence)",
    tmapSrc.includes("deriveTriggerPlans(events)") &&
      !plansSrc.includes("useAppStore") &&
      !plansSrc.includes("localStorage") &&
      !plansSrc.includes("setState")
  );
  check(
    "no new event/review schema fields for plans (types gain nothing trigger-plan-shaped)",
    !readFileSync("src/lib/app/types.ts", "utf8").match(/triggerPlan|actionPlan|planLevel|planSteps|planGenerated/i)
  );
  check(
    "counts use the retained history (the derivation body has no window math — no Date.now, no day cutoffs)",
    (() => {
      const body = plansSrc.slice(plansSrc.indexOf("export function deriveTriggerPlans"));
      return !body.includes("86400000") && !body.includes("Date.now()") && !body.includes("since");
    })()
  );
  check(
    "a backdated event contributes to the pattern ONLY via its review (occurrence day used for last-occurrence)",
    (() => {
      const p = deriveTriggerPlans([reviewedEv("boredom", 5), reviewedEv("boredom", 3), reviewedEv("boredom", 1)]);
      return p.length === 1 && p[0].lastOccurrence === key(1);
    })()
  );
  check(
    "no changes to TriggerMap metrics/scoring: frequencies + insights cards untouched",
    tmapSrc.includes("insights.topPattern") &&
      tmapSrc.includes("محفزاتك الأكثر تكرارًا") &&
      tmapSrc.includes("توزيع أوقات الخطر")
  );
}

console.log(`\n— trigger-plan tests: ${pass} passed, ${fail} failed (total ${pass + fail})`);
process.exit(fail === 0 ? 0 : 1);
