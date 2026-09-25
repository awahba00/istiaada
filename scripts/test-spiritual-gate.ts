/**
 * Phase 1 / Part 3 — engine test: spiritual interventions honor the gate.
 *
 * OFF: wudu / prayer-2 / dhikr-anchor must NEVER be selected, no matter how
 *      strongly the context would otherwise favor them (even with a long
 *      success history for them and exclusion of every competitor).
 * ON:  with a strong personal success history they CAN be selected.
 */
import { selectIntervention } from "../src/lib/app/intervention-engine";
import { INTERVENTIONS, INTERVENTION_BY_ID } from "../src/data/app/interventions";
import type { AppData } from "../src/lib/app/types";

const SPIRITUAL_IDS = ["wudu", "prayer-2", "dhikr-anchor"];

function baseData(spiritualContent: boolean): AppData {
  return {
    version: 1,
    onboardingCompleted: true,
    userProfile: {
      goals: [],
      difficultTimes: [],
      patterns: [],
      deviceNeeds: "sometimes",
      buildGoals: [],
      supportPrefs: ["spiritual"],
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
      spiritualContent,
      preferredDoseTime: "morning",
      postRelapseSupport: true,
      theme: "dark",
      notificationsEnabled: false,
    },
  };
}

// Force maximal spiritual affinity: long success history on the spiritual
// ids (capped +6 each) and nothing else, plus a context they fit well.
function spiritualFriendlyLogs() {
  const now = Date.now();
  return SPIRITUAL_IDS.flatMap((id) =>
    [0, 1, 2, 3, 4].map((i) => ({
      id: `log-${id}-${i}`,
      ts: new Date(now - (i + 1) * 3 * 86400000).toISOString(),
      interventionId: id,
      riskLevel: 3,
      source: "urge-check" as const,
      success: true,
    }))
  );
}

const contexts = [
  { riskLevel: 2, triggerIds: ["thought"] },
  { riskLevel: 3, triggerIds: ["fantasy", "memory"] },
  { riskLevel: 4, triggerIds: ["anxiety"] },
  { riskLevel: 5, triggerIds: [] },
];
const ctxVariants = [
  { alone: true, lateNight: true, inBed: true, browsingStarted: true, deviceNeededNow: false },
  { alone: false, lateNight: false, inBed: false, browsingStarted: false, deviceNeededNow: true },
];

let pass = 0;
let fail = 0;
const check = (ok: boolean, label: string) => {
  if (ok) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.log(`  ✗ ${label}`);
  }
};

// ——— OFF: never selected, even under maximal affinity ———
console.log("gate OFF:");
const offData: AppData = {
  ...baseData(false),
  interventionLogs: spiritualFriendlyLogs() as AppData["interventionLogs"],
};
for (const c of contexts) {
  for (const cv of ctxVariants) {
    for (const withExclude of [false, true]) {
      // withExclude: exclude every NON-spiritual intervention — if the gate
      // were still the old soft −12, a spiritual one would win here.
      const excludeIds = withExclude
        ? INTERVENTIONS.filter((iv) => !SPIRITUAL_IDS.includes(iv.id)).map((iv) => iv.id)
        : undefined;
      const pick = selectIntervention({
        ...c,
        context: cv,
        data: offData,
        excludeIds,
      });
      check(
        !SPIRITUAL_IDS.includes(pick.id),
        `risk ${c.riskLevel}/ctx ${JSON.stringify(cv).slice(0, 40)}${withExclude ? "/all-competitors-excluded" : ""} → ${pick.id} (non-spiritual)`
      );
    }
  }
}
// Total-exclusion fallback stays the documented non-spiritual default:
const allExcluded = selectIntervention({
  riskLevel: 3,
  triggerIds: [],
  context: { alone: false, lateNight: false, inBed: false, browsingStarted: false, deviceNeededNow: false },
  data: offData,
  excludeIds: INTERVENTIONS.map((iv) => iv.id),
});
check(
  allExcluded.id === INTERVENTION_BY_ID["close-source"].id,
  `everything excluded → falls back to non-spiritual "close-source" (got ${allExcluded.id})`
);

// ——— ON: spiritual CAN surface with a real success history ———
console.log("gate ON:");
const onData: AppData = {
  ...baseData(true),
  interventionLogs: spiritualFriendlyLogs() as AppData["interventionLogs"],
};
let spiritualSeen = false;
for (const c of contexts) {
  for (const cv of ctxVariants) {
    const pick = selectIntervention({ ...c, context: cv, data: onData });
    if (SPIRITUAL_IDS.includes(pick.id)) spiritualSeen = true;
  }
}
check(spiritualSeen, "a spiritual intervention is reachable with the gate open + history");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
