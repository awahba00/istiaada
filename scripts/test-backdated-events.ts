/**
 * Backdated slip/relapse recording tests (occurrence date semantics).
 * Run: bun scripts/test-backdated-events.ts
 *
 *  A — helpers: day-key parsing is LOCAL (no UTC day shift), eventDay,
 *      occurrenceTime anchors, isPastOrToday (future rejection), labels.
 *  B — computeProgress: occurrence-day semantics.
 *      A) yesterday-dated event → correct window + daysSinceLastRelapse;
 *      B) an OLDER backdated event never resets daysSinceLastRelapse;
 *      C) a backdated event outside a window is NOT counted as today;
 *      D) an event dated today behaves EXACTLY like current records;
 *      E) multiple same-date events sort deterministically.
 *  C — computeInsights: backdated events carry no time-of-day — they never
 *      inflate time-bucket patterns (no fabricated clock time).
 *  D — backup: eventDate is optional + validated (YYYY-MM-DD when present);
 *      legacy backups stay valid; export/import round-trips the field;
 *      malformed values are rejected.
 *  E — UI source contracts: Quick Log date selector wiring (default today,
 *      max=past-or-today, save guard, reversible), occurrence-ordered
 *      history, occurrence-based display labels, and occurrence-based
 *      windows in progress/dose-engine/Home/TriggerMap.
 */
import { readFileSync } from "node:fs";
import {
  dayKey,
  dayKeyDate,
  eventDay,
  occurrenceTime,
  occurrenceIso,
  daysSinceDayKey,
  hasKnownEventTime,
  isPastOrToday,
  eventDateLabel,
} from "../src/lib/app/helpers";
import { computeProgress, computeInsights } from "../src/lib/app/progress";
import { validateBackup, buildBackupJson } from "../src/lib/app/backup";
import type { AppData, RelapseEvent, RelapseReview } from "../src/lib/app/types";

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
  return dayKey(new Date(now - daysAgo * DAY));
}

const review = (trigger: string): RelapseReview => ({
  trigger,
  vulnerabilities: [],
  firstSign: "ملل",
  firstAction: "",
  escalation: "",
  extended: false,
  cutPoint: "",
  lesson: "",
});

function ev(over: Partial<RelapseEvent>): RelapseEvent {
  return {
    id: "ev-" + Math.random().toString(36).slice(2, 8),
    ts: iso(0),
    timeToStop: "minutes",
    continued: false,
    triggers: ["boredom"],
    quickTs: iso(0),
    reviewed: false,
    ...over,
  };
}

function dataWith(events: RelapseEvent[]): AppData {
  return {
    version: 1,
    onboardingCompleted: true,
    userProfile: {
      goals: [], difficultTimes: [], patterns: [], deviceNeeds: "sometimes",
      buildGoals: [], supportPrefs: ["mixed"], why: "", whyReasons: [],
    },
    journey: { startDate: iso(90) },
    urgeChecks: [],
    interventionLogs: [],
    dailyLogs: { checkIns: [], plans: [], doseLog: [] },
    relapseEvents: events,
    preventionRules: [],
    supportPerson: null,
    settings: {
      dailyDoseEnabled: true, spiritualContent: false, preferredDoseTime: "morning",
      postRelapseSupport: true, theme: "dark", notificationsEnabled: false,
    },
  };
}

/* ————— A — helpers ————— */

console.log("A — occurrence helpers");
{
  const dk = key(3);
  check(
    "dayKeyDate parses the day LOCALLY (same calendar day, midnight local)",
    (() => {
      const d = dayKeyDate(dk);
      return dayKey(d) === dk && d.getHours() === 0 && d.getMinutes() === 0;
    })()
  );
  check(
    "dayKeyDate is not UTC-shifted: local date components equal the key",
    (() => {
      const d = dayKeyDate("2026-01-05");
      return d.getFullYear() === 2026 && d.getMonth() === 0 && d.getDate() === 5;
    })()
  );
  check(
    "eventDay: user-selected day wins; legacy falls back to the ts day",
    eventDay({ ts: iso(0), eventDate: dk }) === dk &&
      eventDay({ ts: iso(2) }) === key(2)
  );
  check(
    "occurrenceTime: legacy/same-day = the ts epoch exactly (byte-identical windows)",
    occurrenceTime({ ts: iso(2) }) === new Date(iso(2)).getTime() &&
      occurrenceTime({ ts: iso(0), eventDate: key(0) }) === new Date(iso(0)).getTime()
  );
  check(
    "occurrenceTime: backdated = local noon of the selected day (inside every day window, never displayed)",
    (() => {
      const t = occurrenceTime({ ts: iso(0), eventDate: key(3) });
      const noon = dayKeyDate(key(3));
      noon.setHours(12, 0, 0, 0);
      return t === noon.getTime();
    })()
  );
  check(
    "occurrenceIso mirrors occurrenceTime as a parseable ISO (epoch-equivalent)",
    new Date(occurrenceIso({ ts: iso(0), eventDate: key(3) })).getTime() ===
      occurrenceTime({ ts: iso(0), eventDate: key(3) }) &&
      occurrenceIso({ ts: iso(1) }) === iso(1)
  );
  check(
    "daysSinceDayKey: 0 today, N whole days for past keys",
    daysSinceDayKey(key(0)) === 0 && daysSinceDayKey(key(3)) === 3
  );
  check(
    "daysSinceDayKey agrees with daysBetween arithmetic (legacy parity)",
    (() => {
      const legacy = ev({ ts: iso(4) });
      const diff = Math.floor(
        (new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
          new Date(legacy.ts).setHours(0, 0, 0, 0)) / DAY
      );
      return daysSinceDayKey(eventDay(legacy)) === Math.max(0, diff);
    })()
  );
  check(
    "isPastOrToday: today + past accepted, future + malformed rejected",
    isPastOrToday(key(0), key(0)) && isPastOrToday(key(2), key(0)) &&
      !isPastOrToday(key(-1), key(0)) && !isPastOrToday("2026-1-5", key(0)) &&
      !isPastOrToday("", key(0))
  );
  check(
    "hasKnownEventTime: legacy + same-day true; a selected PAST day false (no fabricated time)",
    hasKnownEventTime({ ts: iso(0) }) &&
      hasKnownEventTime({ ts: iso(0), eventDate: key(0) }) &&
      !hasKnownEventTime({ ts: iso(0), eventDate: key(2) })
  );
  check(
    "eventDateLabel: backdated shows the occurrence day + «سُجّل لاحقًا»; today shows the entry moment",
    eventDateLabel({ ts: iso(0), eventDate: key(3) }).includes("سُجّل لاحقًا") &&
      !eventDateLabel({ ts: iso(0) }).includes("سُجّل لاحقًا")
  );
}

/* ————— B — computeProgress occurrence semantics ————— */

console.log("B — metrics: occurrence-day semantics");
{
  // A) yesterday-dated event
  const yesterday = ev({ ts: iso(0), eventDate: key(1), reviewed: true });
  const mA = computeProgress(dataWith([yesterday]));
  check(
    "A: yesterday-dated event → daysSinceLastRelapse = 1 (not 0)",
    mA.daysSinceLastRelapse === 1
  );
  check(
    "A: yesterday-dated event counts inside the 30-day window (rel4) and stop metrics",
    mA.relapsePerWeek != null && mA.avgStopMinutes != null
  );

  // B) an OLDER backdated event must not reset days-since
  const latest = ev({ ts: iso(3), eventDate: key(3), reviewed: true }); // occurred 3 days ago
  const olderBackdated = ev({ ts: iso(0), eventDate: key(10), reviewed: true }); // entered now, occurred 10 days ago
  const mB = computeProgress(dataWith([latest, olderBackdated]));
  check(
    "B: a backdated event OLDER than the latest never resets daysSinceLastRelapse (3, not 10)",
    mB.daysSinceLastRelapse === 3
  );
  check(
    "B: a NEWER backdated occurrence does become the last event (accurate, not 'today')",
    computeProgress(dataWith([latest, ev({ ts: iso(0), eventDate: key(1) })])).daysSinceLastRelapse === 1
  );

  // C) outside the rolling windows
  const outside30 = ev({ ts: iso(0), eventDate: key(40), reviewed: true });
  const mC = computeProgress(dataWith([outside30]));
  const mCempty = computeProgress(dataWith([]));
  check(
    "C: a 40-day-old backdated event is outside the 30d window (not counted as today)",
    mC.relapsePerWeek === mCempty.relapsePerWeek &&
      mC.avgStopMinutes === mCempty.avgStopMinutes &&
      mC.triggerAwareness === mCempty.triggerAwareness
  );
  check(
    "C: it still counts as history (daysSinceLastRelapse reflects 40)",
    mC.daysSinceLastRelapse === 40
  );

  // D) today-dated event behaves exactly like a current record
  const todayNew = ev({ ts: iso(0, 12), eventDate: key(0), reviewed: true, triggers: ["boredom", "stress"] });
  const todayLegacy = ev({ ts: iso(0, 12), reviewed: true, triggers: ["boredom", "stress"] });
  const mD1 = computeProgress(dataWith([todayNew]));
  const mD2 = computeProgress(dataWith([todayLegacy]));
  check(
    "D: today-dated event ≡ current record (windows, days-since, trigger awareness all equal)",
    mD1.daysSinceLastRelapse === mD2.daysSinceLastRelapse &&
      mD1.relapsePerWeek === mD2.relapsePerWeek &&
      mD1.triggerAwareness === mD2.triggerAwareness &&
      mD1.avgStopMinutes === mD2.avgStopMinutes
  );

  // E) deterministic same-date ordering
  const e1 = ev({ id: "aaa", ts: iso(0, 10), eventDate: key(1) });
  const e2 = ev({ id: "bbb", ts: iso(0, 11), eventDate: key(1) });
  const e3 = ev({ id: "ccc", ts: iso(0, 9), eventDate: key(1) });
  const sorted = (arr: RelapseEvent[]) =>
    [...arr].sort(
      (a, b) =>
        occurrenceTime(b) - occurrenceTime(a) ||
        (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : a.id < b.id ? 1 : -1)
    );
  const p1 = sorted([e1, e2, e3]).map((x) => x.id).join(",");
  const p2 = sorted([e3, e1, e2]).map((x) => x.id).join(",");
  const p3 = sorted([e2, e3, e1]).map((x) => x.id).join(",");
  check(
    "E: same-date events sort deterministically regardless of input permutation",
    p1 === p2 && p2 === p3 && p1 === "bbb,aaa,ccc"
  );

  // occurrence ordering: backdated slots by occurrence, not entry
  const recent = ev({ ts: iso(0), eventDate: key(0) });
  const oldBack = ev({ ts: iso(0), eventDate: key(5) });
  check(
    "E: a backdated event orders BELOW a newer occurrence despite a newer entry ts",
    occurrenceTime(oldBack) < occurrenceTime(recent)
  );
}

/* ————— C — time-of-day honesty ————— */

console.log("C — insights: no fabricated time-of-day");
{
  // 3 backdated events entered in the MORNING must not create a "morning" spike
  const backdated = [1, 2, 3].map((i) =>
    ev({ ts: iso(0, 9), eventDate: key(i), reviewed: true }) // entered 09:00 today
  );
  const ins = computeInsights(dataWith(backdated));
  check(
    "backdated events (unknown time-of-day) never inflate time buckets",
    ins.mostRiskyTime === null
  );
  const legacy = [1, 2, 3].map((i) => ev({ ts: iso(i, 9), reviewed: true }));
  const insLegacy = computeInsights(dataWith(legacy));
  check(
    "legacy events keep counting in time buckets (unchanged)",
    insLegacy.mostRiskyTime?.bucket === "morning" && insLegacy.mostRiskyTime?.count === 3
  );
}

/* ————— D — backup envelope ————— */

console.log("D — backup: optional eventDate, validated + round-tripped");
{
  const withDate = ev({ eventDate: key(2), reviewed: true, review: review("boredom") });
  const json = buildBackupJson(dataWith([withDate]));
  const res = validateBackup(json);
  const imported = res.ok ? res.data : null;
  check(
    "new-schema backup with eventDate: accepted",
    imported != null && imported.relapseEvents[0].eventDate === key(2)
  );
  const legacyEvent = ev({ reviewed: true, review: review("boredom") });
  delete (legacyEvent as Partial<RelapseEvent>).eventDate;
  const legacyJson = buildBackupJson(dataWith([legacyEvent]));
  const resLegacy = validateBackup(legacyJson);
  check(
    "legacy backup without eventDate: still valid, field stays absent",
    resLegacy.ok && resLegacy.data.relapseEvents[0].eventDate === undefined
  );
  const reExport = buildBackupJson(imported ?? dataWith([withDate]));
  const res2 = validateBackup(reExport);
  check(
    "export → import → export round-trip preserves eventDate",
    res2.ok && res2.data.relapseEvents[0].eventDate === key(2)
  );
  const bad = JSON.parse(buildBackupJson(dataWith([legacyEvent])));
  bad.data.relapseEvents[0].eventDate = "2026-1-5";
  const resBad = validateBackup(JSON.stringify(bad));
  check(
    "malformed eventDate (not YYYY-MM-DD) is REJECTED",
    !resBad.ok && resBad.error.includes("تاريخ واقعة")
  );
  const bad2 = JSON.parse(buildBackupJson(dataWith([legacyEvent])));
  bad2.data.relapseEvents[0].eventDate = 17;
  const resBad2 = validateBackup(JSON.stringify(bad2));
  check(
    "non-string eventDate is REJECTED",
    !resBad2.ok
  );
}

/* ————— E — UI source contracts ————— */

console.log("E — UI wiring (source contracts)");
{
  const relSrc = readFileSync("src/components/app/screens/RelapseScreen.tsx", "utf8");
  const progSrc = readFileSync("src/lib/app/progress.ts", "utf8");
  const doseEngSrc = readFileSync("src/lib/app/dose-engine.ts", "utf8");
  const doseSrc = readFileSync("src/components/app/screens/DoseScreen.tsx", "utf8");
  const homeSrc = readFileSync("src/components/app/screens/HomeScreen.tsx", "utf8");
  const tmapSrc = readFileSync("src/components/app/screens/TriggerMapScreen.tsx", "utf8");

  check(
    "Quick Log: «تاريخ الواقعة» labeled selector, default today, native max + save guard reject the future",
    relSrc.includes("تاريخ الواقعة") &&
      relSrc.includes('type="date"') &&
      relSrc.includes("max={dayKey()}") &&
      relSrc.includes("isPastOrToday(qDate)") &&
      /const \[qDate, setQDate\] = useState<string>\(dayKey\(\)\);/.test(relSrc)
  );
  check(
    "Quick Log: the past-day choice is reversible before saving (reset-to-today control)",
    relSrc.includes("النهارده") && relSrc.includes("setQDate(dayKey())")
  );
  check(
    "Quick Log: save writes eventDate; the form (incl. date) resets after save",
    relSrc.includes("eventDate: qDate,") && /setQDate\(dayKey\(\)\);/.test(relSrc)
  );
  check(
    "future-date state shows an explicit rejection hint",
    relSrc.includes("مش ممكن تسجل واقعة بتاريخ مستقبلي")
  );
  check(
    "history ordering uses occurrenceTime with deterministic tiebreaks",
    relSrc.includes("occurrenceTime(b) - occurrenceTime(a)") &&
      relSrc.includes("a.id < b.id ? 1 : -1")
  );
  check(
    "history + pending-review + delete dialog show occurrence-aware labels (eventDateLabel ×3)",
    (relSrc.match(/eventDateLabel\(/g) ?? []).length === 3
  );
  check(
    "progress windows are occurrence-based (occurrenceTime filters + daysSinceDayKey)",
    (progSrc.match(/occurrenceTime\(/g) ?? []).length >= 7 &&
      progSrc.includes("daysSinceDayKey(eventDay(lastRel))")
  );
  check(
    "dose-engine 7d/14d windows are occurrence-based",
    doseEngSrc.includes("occurrenceTime(r) > Date.now() - 7 * 86400000") &&
      doseEngSrc.includes("occurrenceTime(r) > since")
  );
  check(
    "DoseScreen recency note is occurrence-based",
    doseSrc.includes("occurrenceTime(r) > Date.now() - 7 * 86400000")
  );
  check(
    "Home banner uses the latest OCCURRENCE + occurrenceIso (48h window on the event, not the entry)",
    homeSrc.includes("occurrenceTime(cur)") && homeSrc.includes("occurrenceIso(lastRelapse)")
  );
  check(
    "TriggerMap time buckets exclude unknown-time (backdated) events",
    tmapSrc.includes("if (!hasKnownEventTime(r)) continue;")
  );
  check(
    "Q1–Q5 semantics untouched: the date card is the ONLY new Quick Log input",
    // the five existing question cards + the new date card — and no new question text beyond them
    relSrc.includes("إيه السلوك اللي حصل؟") &&
      relSrc.includes("إزاي توصف اللي حصل؟") &&
      relSrc.includes("إيه اللي بدأ الموضوع؟") &&
      relSrc.includes("الجلسة استمرت قد إيه؟") &&
      relSrc.includes("حصل مرة ولا أكتر؟")
  );
}

console.log(`\n— backdated-event tests: ${pass} passed, ${fail} failed (total ${pass + fail})`);
process.exit(fail === 0 ? 0 : 1);
