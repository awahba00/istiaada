/**
 * Progress engine + repetition-semantics tests.
 * Run: bun scripts/test-progress.ts
 *
 *  A — urge metrics (handled / rolling 7-day window)
 *  B — early interventions (risk ≤ 3, last 30d) + sessions stopped early
 *  C — repetition semantics: secondFallPrevented counts ONLY events whose
 *      Q5 «حصل مرة ولا أكتر؟» was actually asked (behaviors include
 *      masturbation). Porn-only events store a schema-required false
 *      placeholder; legacy events predate the question — neither is ever
 *      reinterpreted. repetitionKnownEvents is the honest denominator.
 *  D — stop metrics (avgStopMinutes / stopTrend windows) + trigger awareness
 *  E — stability metrics (dailyStability / relapsePerWeek / trends / streak)
 *  F — journey dates + evening forecast (3 levels, 36h freshness) + insights
 *  G — UI display contract (source-level checks on Progress/Relapse/Home)
 */
import { readFileSync } from "node:fs";
import { computeProgress, computeInsights, forecastFromCheckIn } from "../src/lib/app/progress";
import { dayKey } from "../src/lib/app/helpers";
import type {
  AppData,
  EveningCheckIn,
  InterventionLog,
  RelapseEvent,
  RelapseReview,
  UrgeCheck,
  UrgeContext,
} from "../src/lib/app/types";

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

// ————— deterministic time helpers (relative to run time) —————
const DAY = 86400000;
const now = Date.now();

function iso(daysAgo: number, hour = 12): string {
  const t = new Date(now - daysAgo * DAY);
  t.setHours(hour, 0, 0, 0);
  return t.toISOString();
}
function key(daysAgo: number): string {
  return dayKey(new Date(now - daysAgo * DAY));
}

const CTX = (over: Partial<UrgeContext> = {}): UrgeContext => ({
  alone: false,
  lateNight: false,
  inBed: false,
  browsingStarted: false,
  deviceNeededNow: false,
  ...over,
});

function uc(daysAgo: number, over: Partial<UrgeCheck> = {}): UrgeCheck {
  return {
    id: `uc-${daysAgo}-${Math.random().toString(36).slice(2, 6)}`,
    ts: iso(daysAgo, 20),
    urge: 3,
    proximity: 2,
    control: 2,
    context: CTX(),
    riskLevel: 3,
    triggers: [],
    ...over,
  };
}

function il(daysAgo: number, risk: number, over: Partial<InterventionLog> = {}): InterventionLog {
  return {
    id: `il-${daysAgo}-${Math.random().toString(36).slice(2, 6)}`,
    ts: iso(daysAgo, 18),
    interventionId: "cold-water",
    riskLevel: risk,
    source: "manual",
    ...over,
  };
}

function ev(daysAgo: number, over: Partial<RelapseEvent> = {}): RelapseEvent {
  return {
    id: `ev-${daysAgo}-${Math.random().toString(36).slice(2, 6)}`,
    ts: iso(daysAgo, 22),
    timeToStop: "minutes",
    continued: false,
    triggers: [],
    reviewed: false,
    ...over,
  };
}

function ci(daysAgo: number, over: Partial<EveningCheckIn> = {}): EveningCheckIn {
  return {
    date: key(daysAgo),
    highestUrge: 3,
    mainTrigger: "boredom",
    interventionUsed: "none",
    lesson: "",
    changeTomorrow: "",
    sleepQuality: 3,
    stress: 3,
    loneliness: 3,
    freeTime: 3,
    ...over,
  };
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
    journey: { startDate: iso(40, 12) },
    urgeChecks: [],
    interventionLogs: [],
    dailyLogs: { checkIns: [], plans: [], doseLog: [] },
    relapseEvents: [],
    preventionRules: [],
    supportPerson: null,
    settings: {
      dailyDoseEnabled: true,
      spiritualContent: false,
      preferredDoseTime: "morning",
      postRelapseSupport: true,
      theme: "dark",
      notificationsEnabled: false,
    },
    ...over,
  };
}

const emptyMetrics = () => computeProgress(baseData());

// ————————————————— A: urge metrics —————————————————
console.log("== A: urge metrics (handled / rolling 7d window) ==");
{
  const data = baseData({
    urgeChecks: [
      uc(2, { outcome: "handled" }),
      uc(10, { outcome: "handled" }),
      uc(3, { outcome: "escalated" }),
      uc(20, { outcome: "handled" }),
      uc(6, { outcome: "handled" }),
      uc(4, { outcome: "pending" }),
    ],
  });
  const m = computeProgress(data);
  check("handled counts only outcome === \"handled\" (escalated/pending excluded)", m.urgesHandled === 4);
  check("urgesHandled7d: rolling 7-day window keeps only recent handled", m.urgesHandled7d === 2);
  check("escalated inside 7d still not counted as handled", m.urgesHandled7d === 2 && data.urgeChecks[2].ts > new Date(now - 7 * DAY).toISOString());
  check("pending outcome never counted", m.urgesHandled === 4);
  const acted = computeProgress(baseData({ urgeChecks: [uc(1, { outcome: "acted" })] }));
  check("acted outcome not counted as handled", acted.urgesHandled === 0 && acted.urgesHandled7d === 0);
  const empty = emptyMetrics();
  check("no urge checks → 0 handled, 0 in 7d", empty.urgesHandled === 0 && empty.urgesHandled7d === 0);
  const allRecent = computeProgress(
    baseData({ urgeChecks: [uc(1, { outcome: "handled" }), uc(2, { outcome: "handled" }), uc(3, { outcome: "handled" })] })
  );
  check("all handled within 7d → 7d equals all-time", allRecent.urgesHandled === 3 && allRecent.urgesHandled7d === 3);
  const beyond = computeProgress(baseData({ urgeChecks: [uc(8, { outcome: "handled" })] }));
  check("handled older than 7d excluded from window", beyond.urgesHandled === 1 && beyond.urgesHandled7d === 0);
  const rolling = computeProgress(baseData({ urgeChecks: [uc(6, { outcome: "handled" }), uc(10, { outcome: "handled" })] }));
  check("rolling window: 6d in, 10d out", rolling.urgesHandled === 2 && rolling.urgesHandled7d === 1);
}

// ————————————————— B: early interventions + stopped early —————————————————
console.log("== B: early interventions + sessions stopped early ==");
{
  const data = baseData({
    interventionLogs: [
      il(5, 2),
      il(10, 3),
      il(5, 4),
      il(35, 1),
      il(25, 2),
    ],
    relapseEvents: [
      ev(3, { timeToStop: "immediately" }),
      ev(40, { timeToStop: "minutes" }),
      ev(2, { timeToStop: "under-hour" }),
      ev(5, { timeToStop: "longer" }),
    ],
  });
  const m = computeProgress(data);
  check("early interventions = riskLevel ≤ 3 within last 30d", m.earlyInterventions === 3);
  const b3 = computeProgress(baseData({ interventionLogs: [il(5, 3)] }));
  check("riskLevel 3 is included (boundary, ≤ not <)", b3.earlyInterventions === 1);
  const b4 = computeProgress(baseData({ interventionLogs: [il(5, 4)] }));
  check("riskLevel 4 excluded (above immediate-response zone)", b4.earlyInterventions === 0);
  const old = computeProgress(baseData({ interventionLogs: [il(35, 1)] }));
  check("interventions older than 30d excluded", old.earlyInterventions === 0);
  check("sessionsStoppedEarly = immediately + minutes", m.sessionsStoppedEarly === 2);
  const far = computeProgress(baseData({ relapseEvents: [ev(40, { timeToStop: "minutes" })] }));
  check("sessionsStoppedEarly is NOT windowed — 40d-old fast stop counts", far.sessionsStoppedEarly === 1);
  const uh = computeProgress(baseData({ relapseEvents: [ev(2, { timeToStop: "under-hour" })] }));
  check("under-hour excluded from stopped-early", uh.sessionsStoppedEarly === 0);
  const lg = computeProgress(baseData({ relapseEvents: [ev(5, { timeToStop: "longer" })] }));
  check("longer excluded from stopped-early", lg.sessionsStoppedEarly === 0);
  const legacy = computeProgress(baseData({ relapseEvents: [ev(6, { timeToStop: "immediately" })] }));
  check("legacy event (no behaviors) still counts in sessionsStoppedEarly", legacy.sessionsStoppedEarly === 1);
}

// ————————————————— C: repetition semantics —————————————————
console.log("== C: repetition semantics (Q5-asked population only) ==");
{
  // The seed-style mixed population.
  const mixed = baseData({
    relapseEvents: [
      ev(3, { behaviors: ["masturbation"], continued: false, classification: "slip" }),
      ev(5, { behaviors: ["masturbation"], continued: true, classification: "relapse" }),
      ev(2, { behaviors: ["pornography"], continued: false, classification: "slip" }),
      ev(7, { continued: false }), // legacy: no behaviors, pre-Q5
    ],
  });
  const mm = computeProgress(mixed);
  check("mixed: repetitionKnownEvents = masturbation-involved events only", mm.repetitionKnownEvents === 2);
  check("mixed: secondFallPrevented = eligible AND not-continued", mm.secondFallPrevented === 1);
  check("mixed: porn-only placeholder false NOT eligible (denominator stays 2, not 3)", mm.repetitionKnownEvents === 2);
  check("mixed: legacy event NOT eligible (denominator stays 2, not 4)", mm.repetitionKnownEvents === 2);
  check("mixed: repeated masturbation event in denominator but not numerator", mm.repetitionKnownEvents === 2 && mm.secondFallPrevented === 1);
  const naive = mixed.relapseEvents.filter((r) => !r.continued).length;
  check("old naive !continued count (3) ≠ new secondFallPrevented (1) — semantic fix documented", naive === 3 && mm.secondFallPrevented === 1);

  const legacyOnly = computeProgress(baseData({ relapseEvents: [ev(6, { continued: false }), ev(12, { continued: true })] }));
  check("legacy-only: repetitionKnownEvents = 0", legacyOnly.repetitionKnownEvents === 0);
  check("legacy-only: secondFallPrevented = 0 (legacy continued=false never reinterpreted)", legacyOnly.secondFallPrevented === 0);
  const pornOnly = computeProgress(baseData({ relapseEvents: [ev(2, { behaviors: ["pornography"], continued: false }), ev(4, { behaviors: ["pornography"], continued: false })] }));
  check("porn-only: repetitionKnownEvents = 0 (Q5 never asked)", pornOnly.repetitionKnownEvents === 0);
  check("porn-only: secondFallPrevented = 0 (placeholder false not counted)", pornOnly.secondFallPrevented === 0);
  const dual = computeProgress(baseData({ relapseEvents: [ev(4, { behaviors: ["pornography", "masturbation"], continued: false })] }));
  check("dual behavior [pornography + masturbation] IS eligible", dual.repetitionKnownEvents === 1);
  check("dual behavior not-continued counts as once", dual.secondFallPrevented === 1);
  const noEligible = computeProgress(baseData({ relapseEvents: [ev(2, { behaviors: ["pornography"], continued: false }), ev(9, { continued: false })] }));
  check("no eligible events → known = 0 (UI shows «—», not 0)", noEligible.repetitionKnownEvents === 0 && noEligible.secondFallPrevented === 0);
  const allRepeated = computeProgress(baseData({ relapseEvents: [ev(3, { behaviors: ["masturbation"], continued: true }), ev(6, { behaviors: ["masturbation"], continued: true })] }));
  check("all-eligible-repeated → secondFallPrevented = real 0 (not a dash case)", allRepeated.repetitionKnownEvents === 2 && allRepeated.secondFallPrevented === 0);
  const none = emptyMetrics();
  check("no events at all → 0/0", none.repetitionKnownEvents === 0 && none.secondFallPrevented === 0);
  const invariant = [mm, legacyOnly, pornOnly, dual, noEligible, allRepeated, none].every(
    (x) => x.repetitionKnownEvents >= x.secondFallPrevented
  );
  check("invariant: repetitionKnownEvents ≥ secondFallPrevented across datasets", invariant);
}

// ————————————————— D: stop metrics + trigger awareness —————————————————
console.log("== D: stop metrics (avg / trend windows) + trigger awareness ==");
{
  const avg = computeProgress(baseData({ relapseEvents: [ev(3, { timeToStop: "immediately" }), ev(5, { timeToStop: "minutes" })] }));
  check("avgStopMinutes = mean of recent stop weights (2+10)/2 = 6", avg.avgStopMinutes === 6);
  const noRecent = computeProgress(baseData({ relapseEvents: [ev(40, { timeToStop: "minutes" })] }));
  check("avgStopMinutes null with no events in last 30d", noRecent.avgStopMinutes === null);
  const rounding = computeProgress(baseData({ relapseEvents: [ev(3, { timeToStop: "immediately" }), ev(4, { timeToStop: "immediately" }), ev(5, { timeToStop: "minutes" })] }));
  check("avgStopMinutes rounds to integer ((2+2+10)/3 → 5)", rounding.avgStopMinutes === 5);
  const better = computeProgress(baseData({ relapseEvents: [ev(3, { timeToStop: "immediately" }), ev(35, { timeToStop: "under-hour" })] }));
  check("stopTrend better: recent avg 2 vs old avg 45", better.stopTrend === "better");
  const worse = computeProgress(baseData({ relapseEvents: [ev(3, { timeToStop: "under-hour" }), ev(35, { timeToStop: "immediately" })] }));
  check("stopTrend worse: recent avg 45 vs old avg 2", worse.stopTrend === "worse");
  const same = computeProgress(baseData({ relapseEvents: [ev(3, { timeToStop: "minutes" }), ev(35, { timeToStop: "minutes" })] }));
  check("stopTrend same: within ±5 minutes", same.stopTrend === "same");
  const noOlder = computeProgress(baseData({ relapseEvents: [ev(3, { timeToStop: "immediately" })] }));
  check("stopTrend null when 31–60d window empty", noOlder.stopTrend === null);
  const noRecent2 = computeProgress(baseData({ relapseEvents: [ev(35, { timeToStop: "under-hour" })] }));
  check("stopTrend null when recent window empty", noRecent2.stopTrend === null);
  const window = computeProgress(baseData({ relapseEvents: [ev(3, { timeToStop: "immediately" }), ev(45, { timeToStop: "under-hour" }), ev(70, { timeToStop: "longer" })] }));
  check("comparison window = days 31–60 (45d in, 70d out — not the future-timestamp bug)", window.stopTrend === "better");
  const ta = computeProgress(
    baseData({
      urgeChecks: [uc(5, { triggers: ["stress", "boredom"] })],
      relapseEvents: [ev(3, { triggers: ["stress"] }), ev(40, { triggers: ["loneliness"] })],
    })
  );
  check("triggerAwareness: distinct triggers across urgeChecks + relapses in 30d", ta.triggerAwareness === 2);
  const taOld = computeProgress(baseData({ relapseEvents: [ev(40, { triggers: ["loneliness"] })] }));
  check("triggerAwareness ignores triggers older than 30d", taOld.triggerAwareness === 0);
  const taNone = emptyMetrics();
  check("triggerAwareness 0 with no triggers recorded", taNone.triggerAwareness === 0);
  const avgRecentOnly = computeProgress(baseData({ relapseEvents: [ev(3, { timeToStop: "minutes" }), ev(35, { timeToStop: "immediately" })] }));
  check("avgStopMinutes uses only last-30d events (older excluded: 10, not 6)", avgRecentOnly.avgStopMinutes === 10);
}

// ————————————————— E: stability metrics —————————————————
console.log("== E: stability metrics (check-ins / frequency / streak) ==");
{
  const data = baseData({ dailyLogs: { checkIns: [ci(0), ci(1), ci(2), ci(20)], plans: [], doseLog: [] } });
  const m = computeProgress(data);
  check("dailyStability = check-ins in last 14 days (3/14 → 21%)", m.dailyStability === 21);
  check("dailyStability 0 with no check-ins", emptyMetrics().dailyStability === 0);
  const oldOnly = computeProgress(baseData({ dailyLogs: { checkIns: [ci(20)], plans: [], doseLog: [] } }));
  check("check-ins older than 14 days ignored", oldOnly.dailyStability === 0);
  const perWeek = computeProgress(baseData({ relapseEvents: [ev(5), ev(10)] }));
  check("relapsePerWeek: 2 events in 28d → 0.5/week", perWeek.relapsePerWeek === 0.5);
  check("relapsePerWeek null with no events in 28d", emptyMetrics().relapsePerWeek === null);
  const better = computeProgress(baseData({ relapseEvents: [ev(5), ev(35), ev(36), ev(37)] }));
  check("relapseTrend better: 1 recent vs 3 in previous 4 weeks", better.relapseTrend === "better");
  const worse = computeProgress(baseData({ relapseEvents: [ev(5), ev(8), ev(10), ev(35)] }));
  check("relapseTrend worse: 3 recent vs 1 previous", worse.relapseTrend === "worse");
  const same = computeProgress(baseData({ relapseEvents: [ev(5), ev(8), ev(35), ev(40)] }));
  check("relapseTrend same: equal counts", same.relapseTrend === "same");
  check("relapseTrend null with no events at all", emptyMetrics().relapseTrend === null);
  const streak3 = computeProgress(baseData({ dailyLogs: { checkIns: [ci(0), ci(1), ci(2)], plans: [], doseLog: [] } }));
  check("checkInStreak: consecutive days ending today = 3", streak3.checkInStreak === 3);
  const streakYesterday = computeProgress(baseData({ dailyLogs: { checkIns: [ci(1), ci(2)], plans: [], doseLog: [] } }));
  check("checkInStreak: today absent, yesterday-started still counts = 2", streakYesterday.checkInStreak === 2);
  const streakGap = computeProgress(baseData({ dailyLogs: { checkIns: [ci(0), ci(2)], plans: [], doseLog: [] } }));
  check("checkInStreak broken by a gap (today + 2d ago → 1)", streakGap.checkInStreak === 1);
}

// ————————————————— F: journey + forecast + insights —————————————————
console.log("== F: journey dates + evening forecast + insights ==");
{
  const m = computeProgress(baseData({ relapseEvents: [ev(3, { timeToStop: "minutes" })] }));
  check("daysSinceStart = daysBetween(startDate) + 1 (40d start → 41)", m.daysSinceStart === 41);
  check("daysSinceLastRelapse from most recent event (3d)", m.daysSinceLastRelapse === 3);
  check("daysSinceLastRelapse null with no events", emptyMetrics().daysSinceLastRelapse === null);

  check("forecast null with no check-ins", forecastFromCheckIn(baseData()) === null);
  const stale = baseData({ dailyLogs: { checkIns: [ci(4)], plans: [], doseLog: [] } });
  check("forecast null when latest check-in older than 36h", forecastFromCheckIn(stale) === null);
  const elevated = baseData({ dailyLogs: { checkIns: [ci(1, { sleepQuality: 5, stress: 5, loneliness: 4, freeTime: 5 })], plans: [], doseLog: [] } });
  const ef = forecastFromCheckIn(elevated);
  check("forecast elevated when load ≥ 11", ef?.level === "elevated");
  check("elevated message says «عالي الحمل»", (ef?.message ?? "").includes("عالي الحمل"));
  const moderate = baseData({ dailyLogs: { checkIns: [ci(1, { sleepQuality: 3, stress: 3, loneliness: 3, freeTime: 3 })], plans: [], doseLog: [] } });
  check("forecast moderate in the 7–11 band (10.8)", forecastFromCheckIn(moderate)?.level === "moderate");
  const low = baseData({ dailyLogs: { checkIns: [ci(1, { sleepQuality: 1, stress: 1, loneliness: 1, freeTime: 1 })], plans: [], doseLog: [] } });
  check("forecast low under 7 (3.6)", forecastFromCheckIn(low)?.level === "low");
  const recent = baseData({
    dailyLogs: {
      checkIns: [
        ci(4, { sleepQuality: 5, stress: 5, loneliness: 4, freeTime: 5 }),
        ci(1, { sleepQuality: 1, stress: 1, loneliness: 1, freeTime: 1 }),
      ],
      plans: [],
      doseLog: [],
    },
  });
  check("forecast uses the most RECENT check-in (1d low beats 4d elevated)", forecastFromCheckIn(recent)?.level === "low");

  const emptyIns = computeInsights(baseData());
  check(
    "insights: empty data → all seven fields null",
    emptyIns.topTrigger === null &&
      emptyIns.bestIntervention === null &&
      emptyIns.avgRiskAtIntervention === null &&
      emptyIns.mostRiskyTime === null &&
      emptyIns.topPattern === null &&
      emptyIns.firstSign === null &&
      emptyIns.bestCutPoint === null
  );
  const review = (over: Partial<RelapseReview>): RelapseReview => ({
    trigger: "وقت متأخر من الليل",
    vulnerabilities: ["تعب"],
    firstSign: "التقاط الهاتف آليًا",
    firstAction: "فتح المتصفح بلا هدف",
    escalation: "التصفح تحوّل لمحتوى محفز",
    extended: false,
    cutPoint: "لحظة فتح المتصفح",
    lesson: "درس واحد يكفي",
    ...over,
  });
  const insData = baseData({
    urgeChecks: [
      uc(5, { ts: iso(5, 22), triggers: ["boredom", "stress"], context: CTX({ alone: true, lateNight: true }) }),
      uc(6, { ts: iso(6, 14), triggers: ["boredom"], context: CTX({ alone: true }) }),
      uc(2, { ts: iso(2, 22), triggers: ["boredom"], context: CTX({ alone: true, lateNight: true }) }),
    ],
    interventionLogs: [
      il(5, 2, { interventionId: "cold-water", success: true }),
      il(8, 2, { interventionId: "cold-water", success: true }),
      il(3, 3, { interventionId: "breathing", success: true }),
      il(2, 4, { interventionId: "walk-10" }),
    ],
    relapseEvents: [
      ev(3, { triggers: ["stress"], review: review({}) }),
      ev(5, { review: review({ cutPoint: "قبل فتح المتصفح" }) }),
    ],
  });
  const ins = computeInsights(insData);
  check(
    "insights: topTrigger = most frequent with resolved label (boredom → «ملل»)",
    ins.topTrigger?.id === "boredom" && ins.topTrigger?.count === 3 && ins.topTrigger?.label === "ملل"
  );
  check(
    "insights: bestIntervention = most wins (cold-water × 2)",
    ins.bestIntervention?.id === "cold-water" && ins.bestIntervention?.wins === 2
  );
  check(
    "insights: topPattern needs ≥ 2 context parts (single-part ignored), lateNight+alone × 2",
    ins.topPattern?.parts.join(" + ") === "الليل المتأخر + الوحدة" && ins.topPattern?.count === 2
  );
  check(
    "insights: firstSign most frequent + bestCutPoint = last non-empty in array order",
    ins.firstSign?.id === "التقاط الهاتف آليًا" &&
      ins.firstSign?.count === 2 &&
      ins.bestCutPoint === "قبل فتح المتصفح"
  );
}

// ————————————————— G: UI display contract —————————————————
console.log("== G: UI display contract (source-level) ==");
{
  const progSrc = readFileSync("src/components/app/screens/ProgressScreen.tsx", "utf-8");
  const relSrc = readFileSync("src/components/app/screens/RelapseScreen.tsx", "utf-8");
  const homeSrc = readFileSync("src/components/app/screens/HomeScreen.tsx", "utf-8");

  check(
    "repetition tile label «حصلت مرة واحدة» on ProgressScreen (+ repetition-question hint)",
    progSrc.includes('label="حصلت مرة واحدة"') && progSrc.includes('hint="من السجلات اللي اتسأل فيها سؤال التكرار"')
  );
  check(
    "repetition tile label «حصلت مرة واحدة» on RelapseScreen (+ denominator hint)",
    relSrc.includes('label="حصلت مرة واحدة"') && relSrc.includes("سجل اتسأل فيه سؤال التكرار")
  );
  check(
    "stop-time label «أوقفت عند أولها» fully removed",
    !progSrc.includes("أوقفت عند أولها") && !relSrc.includes("أوقفت عند أولها")
  );
  check(
    "«—» fallback guard on both screens (no eligible events → —, not 0)",
    progSrc.includes('m.repetitionKnownEvents > 0 ? String(m.secondFallPrevented) : "—"') &&
      relSrc.includes("metrics.repetitionKnownEvents > 0") &&
      relSrc.includes(': "—"')
  );
  check(
    "«جلسات وقفتها بدري» is now unique to sessionsStoppedEarly (ProgressScreen only)",
    progSrc.split('label="جلسات وقفتها بدري"').length - 1 === 1 && !relSrc.includes("جلسات وقفتها بدري")
  );
  check(
    "earlyInterventions keeps «تدخلات بدري» (Progress + Home agree)",
    progSrc.includes('label="تدخلات بدري"') && homeSrc.includes('label="تدخلات بدري"')
  );
  check("topPattern row has real label «أكتر نمط بيتكرر»", progSrc.includes('label="أكتر نمط بيتكرر"'));
  check(
    "insights empty-state paragraph preserved under its own condition",
    progSrc.includes("!insights.topTrigger && !insights.bestIntervention") &&
      progSrc.includes("سجّل كام فحص رغبة وتدخل")
  );
  check(
    "review wizard heading is a clean title «المراجعة الهادئة»",
    relSrc.includes('title="المراجعة الهادئة"') &&
      !relSrc.includes('title="المراجعة الهادئة مستنياك هنا بعد كده، لما تكون مستعد."')
  );
  check("step-3 placeholder no longer repeats the step-2 question", !relSrc.includes('placeholder="٢ ·'));
  check(
    "step-3 placeholder is a first-sign example",
    relSrc.includes('placeholder="مثال: حسّيت بالملل وفتحت التليفون من غير سبب…"')
  );
  check(
    "pending-review fallback button copy is short («سجل»)",
    relSrc.includes('classificationLabel(e) ?? "سجل"') && !relSrc.includes("مراجعة حصلت زَلّة؟ ما تكملش")
  );
  check(
    "dual-behavior chip lists behaviors — relapse-style sentence removed",
    relSrc.includes('labels.join(" + ")') && !relSrc.includes("حسّيت أنني عدت إلى النمط القديم")
  );
  const trendClaim = "أسرع من الشهر اللي فات ✓";
  const claimCount = progSrc.split(trendClaim).length - 1;
  const claimIdx = progSrc.indexOf(trendClaim);
  const claimCtx = claimIdx >= 0 ? progSrc.slice(Math.max(0, claimIdx - 220), claimIdx) : "";
  check(
    "avg<5 value shows «فوري تقريبًا» (trend claim appears once, in the hint only)",
    progSrc.includes('? "فوري تقريبًا"') &&
      relSrc.includes('? "فوري تقريبًا"') &&
      claimCount === 1 &&
      claimCtx.includes('stopTrend === "better"') &&
      !relSrc.includes(trendClaim)
  );
}

console.log(`\n— progress.ts tests: ${pass} passed, ${fail} failed (total ${pass + fail})`);
process.exit(fail === 0 ? 0 : 1);
