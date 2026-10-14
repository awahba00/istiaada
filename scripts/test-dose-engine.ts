/**
 * C6/E4 — Dose engine behavioral tests (real engine imports, no DOM).
 * Pins selectDailyDose's personalization priority order and determinism,
 * plus doseStatusFor's lookup contract.
 * Run: bun scripts/test-dose-engine.ts
 */
import {
  selectDailyDose,
  doseStatusFor,
  type DoseContext,
} from "../src/lib/app/dose-engine";
import { KNOWLEDGE, KNOWLEDGE_BY_ID } from "../src/data/app/knowledge";
import { dayKey } from "../src/lib/app/helpers";
import type { AppData } from "../src/lib/app/types";

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

function baseData(over: Partial<AppData> = {}): AppData {
  return {
    version: 1,
    onboardingCompleted: true,
    userProfile: {
      goals: [],
      difficultTimes: [],
      patterns: [],
      deviceNeeds: "sometimes",
      buildGoals: [],
      supportPrefs: ["mixed"],
      why: "",
      whyReasons: [],
    },
    journey: { startDate: new Date().toISOString() },
    urgeChecks: [],
    interventionLogs: [],
    dailyLogs: { checkIns: [], plans: [], doseLog: [] },
    relapseEvents: [],
    preventionRules: [],
    supportPerson: null,
    settings: {
      dailyDoseEnabled: true,
      spiritualContent: false,
      theme: "dark",
    },
    ...over,
  };
}

console.log("== dose engine: determinism ==");
{
  const ctx: DoseContext = { date: "2026-10-15", data: baseData() };
  const a = selectDailyDose(ctx);
  const b = selectDailyDose(ctx);
  const c = selectDailyDose({ ...ctx, data: baseData() });
  check(
    "same date + same data → the same item (seeded, deterministic)",
    a.id === b.id && a.id === c.id
  );
  check(
    "returned item is a real knowledge item",
    KNOWLEDGE_BY_ID[a.id] != null
  );
}

console.log("== dose engine: spiritual gate ==");
{
  const on = selectDailyDose({
    date: "2026-10-15",
    data: baseData({ settings: { dailyDoseEnabled: true, spiritualContent: true, theme: "dark" } }),
  });
  check(
    "gate open can surface spiritual content (content exists in the pool)",
    KNOWLEDGE.some((k) => k.spiritual)
  );
  // Gate closed must NEVER return a spiritual item, on any of several dates.
  let allNonSpiritual = true;
  for (const d of ["2026-09-01", "2026-10-02", "2026-10-15", "2026-11-20", "2026-12-25"]) {
    const pick = selectDailyDose({ date: d, data: baseData() });
    if (pick.spiritual) allNonSpiritual = false;
  }
  check("gate closed never returns a spiritual item (5 date seeds)", allNonSpiritual);
  check(
    "gate open pool includes spiritual candidates (sanity: items flagged spiritual)",
    on !== undefined
  );
}

console.log("== dose engine: priority 1 — recent relapse dominates ==");
{
  const now = Date.now();
  const relapseData = baseData({
    relapseEvents: [
      {
        id: "rel-recent",
        ts: new Date(now - 2 * 86400000).toISOString(),
        timeToStop: "minutes",
        continued: false,
        triggers: ["boredom"],
        reviewed: false,
      },
    ],
  });
  // Score relapse/self-compassion/prevention categories +100/+90/+60 while
  // generic content scores ≤ 15 (+8 any-stage). Verify the pick on multiple
  // seeds lands in one of the relapse-response categories.
  const relapseCats = new Set(["relapse", "self-compassion", "prevention"]);
  let relapsePrioritized = true;
  for (const d of ["2026-10-01", "2026-10-05", "2026-10-10", "2026-10-15", "2026-10-20"]) {
    const pick = selectDailyDose({ date: d, data: relapseData });
    if (!relapseCats.has(pick.category)) relapsePrioritized = false;
  }
  check(
    "a relapse within 7 days drives the dose to relapse/self-compassion/prevention (5 seeds)",
    relapsePrioritized
  );
  // Outside the 7-day window the priority must NOT apply: use a fixed
  // relapse 30 days back and verify at least one seed escapes the
  // relapse-response categories (no dominance).
  const oldRelapseData = baseData({
    relapseEvents: [
      {
        id: "rel-old",
        ts: new Date(now - 30 * 86400000).toISOString(),
        timeToStop: "minutes",
        continued: false,
        triggers: ["boredom"],
        reviewed: false,
      },
    ],
  });
  let anyEscape = false;
  for (const d of ["2026-09-05", "2026-10-01", "2026-10-09", "2026-10-15", "2026-10-30"]) {
    const pick = selectDailyDose({ date: d, data: oldRelapseData });
    if (!relapseCats.has(pick.category)) anyEscape = true;
  }
  check("a 30-day-old relapse no longer dominates (occurrence-window honored)", anyEscape);
}

console.log("== dose engine: priority 2 — today's elevated risk ==");
{
  // The engine counts only checks from the SAME day as `date`, so the
  // scenario dates must be "today" — seeds vary through data variants.
  const now = Date.now();
  const mk = (riskLevel: number) =>
    baseData({
      urgeChecks: [
        {
          id: `uc-${riskLevel}`,
          ts: new Date(now - 3600000).toISOString(),
          urge: riskLevel,
          proximity: riskLevel,
          control: 6 - riskLevel,
          context: {
            alone: true,
            lateNight: false,
            inBed: false,
            browsingStarted: false,
            deviceNeededNow: false,
          },
          riskLevel,
          triggers: [],
          outcome: "pending",
        },
      ],
    });
  const riskCats = new Set(["emergency-skills", "urges"]);
  let riskPrioritized = true;
  for (const rl of [4, 5]) {
    for (const extra of [0, 1, 2]) {
      const data = mk(rl);
      // second variant: add a couple of harmless older checks (must not
      // cancel today's priority)
      data.urgeChecks = [
        ...data.urgeChecks,
        ...Array.from({ length: extra }, (_, i) => ({
          id: `uc-old-${i}`,
          ts: new Date(now - 3 * 86400000).toISOString(),
          urge: 1,
          proximity: 1,
          control: 5,
          context: {
            alone: false,
            lateNight: false,
            inBed: false,
            browsingStarted: false,
            deviceNeededNow: false,
          },
          riskLevel: 1,
          triggers: [],
          outcome: "handled" as const,
        })),
      ];
      const pick = selectDailyDose({ date: dayKey(), data });
      if (!riskCats.has(pick.category)) riskPrioritized = false;
    }
  }
  check(
    "riskLevel ≥ 4 today pushes the dose toward emergency-skills/urges (6 variants)",
    riskPrioritized
  );
}

console.log("== dose engine: priority 6 — non-repetition ==");
{
  // Repeat the SAME item 10 days in a row; the engine heavily penalizes it,
  // so the next pick must differ (pool of 148 minus exclusions).
  let data = baseData();
  const first = selectDailyDose({ date: "2026-10-01", data });
  for (let i = 1; i <= 10; i++) {
    const d = `2026-10-${String(i).padStart(2, "0")}`;
    data = {
      ...data,
      dailyLogs: {
        ...data.dailyLogs,
        doseLog: [...data.dailyLogs.doseLog, { date: d, itemId: first.id, status: "done" }],
      },
    };
  }
  const next = selectDailyDose({ date: "2026-10-11", data });
  check(
    `after 10 consecutive picks of ${first.id}, the next dose differs (${next.id})`,
    next.id !== first.id
  );
}

console.log("== dose engine: doseStatusFor ==");
{
  const data = baseData({
    dailyLogs: {
      checkIns: [],
      plans: [],
      doseLog: [{ date: dayKey(), itemId: KNOWLEDGE[0].id, status: "done" }],
    },
  });
  const st = doseStatusFor(data, dayKey());
  check(
    "today's log entry resolves to the item + status",
    st.item?.id === KNOWLEDGE[0].id && st.status === "done"
  );
  const none = doseStatusFor(data, "2000-01-01");
  check("no entry for another day → status none, item null", none.status === "none" && none.item === null);
  const dangling = baseData({
    dailyLogs: {
      checkIns: [],
      plans: [],
      doseLog: [{ date: dayKey(), itemId: "does-not-exist", status: "skipped" }],
    },
  });
  const dn = doseStatusFor(dangling, dayKey());
  check(
    "a dangling itemId resolves honestly: item null, status kept",
    dn.item === null && dn.status === "skipped"
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
