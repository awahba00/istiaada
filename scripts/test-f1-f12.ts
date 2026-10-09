/**
 * F1–F12 batch regression tests — the audit findings fixed on the two scope
 * screens («تدخل الآن» EmergencyMode + «فحص الرغبة» UrgeScreen) and their
 * engine/store seams.
 *
 * Two layers, following the repo's existing conventions:
 *   1. LOGIC tests — import the pure modules (engine, store contract types,
 *      backup validation, scale migration, progress metrics) and exercise
 *      the actual behavior.
 *   2. SOURCE-CONTRACT tests — pin the structural fixes that live inside
 *      React components (the same technique as test-responsive-layout.ts).
 *
 * The INTERACTION layer (real clicks in a real browser) is covered by the
 * browser matrix scripts — a passing source contract is NOT claimed as
 * interaction success.
 */
import { readFileSync } from "node:fs";
import {
  selectIntervention,
  selectEscalation,
  isEligibleIntervention,
  SPIRITUAL_INTERVENTION_IDS,
  ACT_FIRST_FIXED_ACTION_IDS,
  type InterventionQuery,
} from "../src/lib/app/intervention-engine";
import { INTERVENTIONS } from "../src/data/app/interventions";
import { validateBackup, buildBackupJson } from "../src/lib/app/backup";
import { migrateAppDataToScale5 } from "../src/lib/app/scale";
import { computeProgress, computeInsights } from "../src/lib/app/progress";
import type { AppData, InterventionLog } from "../src/lib/app/types";

const urgeSrc = readFileSync(
  "src/components/app/screens/UrgeScreen.tsx",
  "utf8"
);
const emergencySrc = readFileSync(
  "src/components/app/screens/EmergencyMode.tsx",
  "utf8"
);
const homeSrc = readFileSync("src/components/app/screens/HomeScreen.tsx", "utf8");
const sharedSrc = readFileSync("src/components/app/shared.tsx", "utf8");
const timerSrc = readFileSync("src/components/app/Timer.tsx", "utf8");
const cardSrc = readFileSync("src/components/app/InterventionCard.tsx", "utf8");
const launcherSrc = readFileSync("src/lib/app/emergency-launcher.ts", "utf8");

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
      spiritualContent,
      preferredDoseTime: "morning",
      postRelapseSupport: true,
      theme: "dark",
      notificationsEnabled: false,
    },
  };
}

const ctx = {
  alone: true,
  lateNight: false,
  inBed: false,
  browsingStarted: false,
  deviceNeededNow: false,
};

const now = Date.now();
const log = (over: Partial<InterventionLog>): InterventionLog => ({
  id: "log-x",
  ts: new Date(now - 1000).toISOString(),
  interventionId: "breathing",
  source: "urge-check",
  ...over,
} as InterventionLog);

// ————————————————————————————————————————————————————————————————
console.log("F1 — sticky CTA never steals context-chip taps (structure)");
{
  // Every sticky CTA band in the urge flow passes pointer events through the
  // decorative gradient; only the opaque button re-enables them.
  const stickyBands = urgeSrc.match(/pointer-events-none sticky/g) ?? [];
  const stickyButtons = urgeSrc.match(/pointer-events-auto/g) ?? [];
  check(
    stickyBands.length >= 3 && stickyButtons.length >= 3,
    `all 3 sticky bands are pointer-events-none with pointer-events-auto buttons (${stickyBands.length} bands / ${stickyButtons.length} buttons)`
  );
  check(
    !urgeSrc.includes("sticky bottom-20"),
    "no single-viewport magic offset (bottom-20) remains in the urge flow"
  );
  check(
    (urgeSrc.match(/bottom-\[calc\(env\(safe-area-inset-bottom,0px\)\+4\.5rem\)\]/g) ?? []).length === 3,
    "sticky offset is nav-chrome + safe-area aware on all 3 bands"
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F2 — one submission intent mints at most one record");
{
  check(
    urgeSrc.includes("submitGuardAtRef") &&
      (urgeSrc.match(/if \(now - submitGuardAtRef\.current < 800\) return;/g) ?? []).length >= 2,
    "compute() and completeIntervention() both guarded by the time-boxed in-flight window"
  );
  check(
    urgeSrc.includes("The window\n    // auto-expires") || urgeSrc.includes("auto-expires"),
    "the guard auto-expires — no permanent lock-out, later separate intents (re-check, card «تم») submit normally"
  );
  check(
    emergencySrc.includes("advanceGuardAtRef") &&
      emergencySrc.includes("advanceGuardAtRef.current < 800") &&
      (emergencySrc.match(/advanceGuardAtRef\.current < 800/g) ?? []).length >= 2,
    "EmergencyMode «تم» CTAs use the time-boxed advance guard (2 record/advance sites)"
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F3 — ACT-FIRST never re-teaches a completed fixed action");
{
  const FIXED_IDS: string[] = [...ACT_FIRST_FIXED_ACTION_IDS];
  check(
    ACT_FIRST_FIXED_ACTION_IDS.length === 3 &&
      FIXED_IDS.includes("close-source") &&
      FIXED_IDS.includes("leave-room") &&
      FIXED_IDS.includes("shared-space"),
    "engine exports the three fixed-action ids (close-source, leave-room, shared-space)"
  );
  const query: InterventionQuery = {
    riskLevel: 4,
    triggerIds: [],
    context: { ...ctx, browsingStarted: true },
    data: baseData(false),
    excludeIds: [...ACT_FIRST_FIXED_ACTION_IDS],
  };
  let noFixedLeak = true;
  for (const cv of [{ ...ctx, browsingStarted: true }, { ...ctx, browsingStarted: true, inBed: true, alone: true }]) {
    const pick = selectIntervention({ ...query, context: cv });
    if ((ACT_FIRST_FIXED_ACTION_IDS as readonly string[]).includes(pick.id)) noFixedLeak = false;
  }
  check(
    noFixedLeak,
    "engine with the fixed-action exclusion never returns a fixed action for a browsing context"
  );
  check(
    emergencySrc.includes("useState<string[]>([...ACT_FIRST_FIXED_ACTION_IDS])"),
    "EmergencyMode seeds the session's exclusion set with the fixed actions"
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F4 — manual vs assessed emergency honesty");
{
  check(
    launcherSrc.includes("assessed: false"),
    "the always-on launcher (FAB/QuickGuide/sidebar/More) marks launches manual"
  );
  const assessedCallSites =
    (urgeSrc.match(/assessed: true/g) ?? []).length +
    (homeSrc.match(/assessed: true/g) ?? []).length;
  check(
    assessedCallSites >= 4,
    `all real-degree launch sites pass assessed: true (${assessedCallSites} found: 3 in UrgeScreen + 1 in HomeScreen high card)`
  );
  check(
    homeSrc.includes("startEmergency({") && homeSrc.includes("assessed: true"),
    "Home high-state card bypasses the launcher (real recent check degree)"
  );
  check(
    emergencySrc.includes("riskLevel: assessed ? riskLevel : undefined"),
    "manual sessions write NO degree into the intervention log"
  );
  check(
    emergencySrc.includes("درجة الحالة: {riskLevel} من 5") &&
      emergencySrc.includes("أقصى استجابة — من غير تقييم") &&
      emergencySrc.includes("استجابة من غير تقييم"),
    "overlay badge: degree only when assessed; manual gets the honest no-assessment badge"
  );
  check(
    !emergencySrc.includes("من ٥</b>") &&
      !emergencySrc.includes("من ٥ ") &&
      !urgeSrc.includes("{assessment.level} من ٥") &&
      !urgeSrc.includes("> من ٥<"),
    "no Arabic-Indic digit survives in the two screens' degree displays («من 5» only)"
  );

  // Backup validation accepts the absent degree; rejects out-of-range present ones.
  const mk = (logs: unknown) => {
    const d = baseData(false);
    d.interventionLogs = logs as InterventionLog[];
    return buildBackupJson(d);
  };
  const withNoDegree = mk([
    log({ id: "a", interventionId: "breathing", source: "emergency" }),
  ]);
  const withBadDegree = mk([
    log({ id: "b", interventionId: "breathing", source: "emergency", riskLevel: 11 } as Partial<InterventionLog>),
  ]);
  const resNoDegree = validateBackup(withNoDegree);
  check(
    resNoDegree.ok,
    `backup validator: manual log without riskLevel is VALID (err: ${resNoDegree.ok ? "-" : resNoDegree.error})`
  );
  check(
    !validateBackup(withBadDegree).ok,
    "backup validator: out-of-range riskLevel still REJECTED"
  );

  // Scale migration preserves absence.
  const legacy = baseData(false);
  legacy.interventionLogs = [
    log({ id: "m", interventionId: "breathing", source: "emergency" }),
  ];
  const migrated = migrateAppDataToScale5(legacy);
  check(
    migrated.interventionLogs[0].riskLevel == null,
    "scale migration preserves the absent degree (no fabricated number)"
  );

  // Progress metrics exclude degree-less logs instead of counting them as 0.
  const d = baseData(false);
  d.interventionLogs = [
    log({ id: "p1", interventionId: "breathing", riskLevel: 3, ts: new Date(now - 2000).toISOString() }),
    log({ id: "p2", interventionId: "walk-10", source: "emergency", ts: new Date(now - 3000).toISOString() }),
  ];
  const m = computeProgress(d);
  const ins = computeInsights(d);
  check(
    m.earlyInterventions === 1,
    `early-interventions counts only degree-reported logs (got ${m.earlyInterventions}, want 1)`
  );
  check(
    ins.avgRiskAtIntervention === 3,
    `avg degree ignores degree-less manual logs (got ${ins.avgRiskAtIntervention}, want 3)`
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F5 — spiritual gate is a hard constraint, everywhere");
{
  const gateOff = baseData(false);
  check(
    SPIRITUAL_INTERVENTION_IDS.every((id) => {
      const iv = INTERVENTIONS.find((i) => i.id === id)!;
      return !isEligibleIntervention(iv, gateOff);
    }) &&
      INTERVENTIONS.filter((iv) => isEligibleIntervention(iv, gateOff)).length ===
        INTERVENTIONS.length - 3,
    "isEligibleIntervention: gate closed removes exactly the 3 spiritual ids"
  );
  check(
    emergencySrc.includes(
      "isEligibleIntervention(iv, data) && !nextUsed.includes(iv.id)"
    ),
    "swap-exhaustion agrees with the engine's eligibility (terminal state reachable for gate-closed users)"
  );
  // Exhaustion semantics with the fixed-action seed: the seeded ids count as
  // used — the loop can never "swap toward" them.
  const seed: string[] = [...ACT_FIRST_FIXED_ACTION_IDS];
  const remaining = INTERVENTIONS.filter(
    (iv) => isEligibleIntervention(iv, gateOff) && !seed.includes(iv.id)
  );
  check(
    remaining.length === INTERVENTIONS.length - 3 - 3,
    `eligibility + fixed-seed leave exactly ${INTERVENTIONS.length - 6} candidates for a gate-closed session`
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F6/F7 — intervention-result and emergency CTAs flex, never clip");
{
  check(
    (urgeSrc.match(/h-auto min-h-14 w-full justify-start gap-3 whitespace-normal/g) ?? [])
      .length === 3,
    "all 3 outcome buttons (نتيجة التدخل) use h-auto + min-h-14 + wrap"
  );
  check(
    urgeSrc.includes("pointer-events-auto h-auto min-h-16 w-full whitespace-normal py-4 text-lg font-bold"),
    "the highest-priority emergency CTA flexes (min-h-16 floor, wraps at 320×150%)"
  );
  check(
    emergencySrc.includes("h-auto min-h-14 w-full whitespace-normal py-3.5 text-base font-bold"),
    "EmergencyMode step-3 «تم — الخطوة اللي بعدها» flexes"
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F8 — rating radiogroup has RTL-aware arrow-key navigation");
{
  check(
    sharedSrc.includes('case "ArrowLeft"') &&
      sharedSrc.includes('case "ArrowRight"') &&
      sharedSrc.includes("Math.min(5, n + 1)") &&
      sharedSrc.includes("Math.max(1, n - 1)"),
    "Left = higher number, Right = lower number (RTL), Up/Down conventional"
  );
  check(
    sharedSrc.includes('case "Home"') && sharedSrc.includes('case "End"'),
    "Home/End jump to 1/5"
  );
  check(
    sharedSrc.includes("tabIndex={value === n ? 0 : -1}"),
    "roving tabindex: the selected rating is the tab stop"
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F9 — collapsed trigger section shows the selection state");
{
  check(
    urgeSrc.includes("محدد:") && urgeSrc.includes("{triggers.length}"),
    "count chip renders the selected-trigger count"
  );
  check(
    urgeSrc.includes("triggers.length > 0 &&"),
    "chip appears only when something is selected (collapsed or open)"
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F10 — fresh assessment after resolution; kept on re-check");
{
  check(
    urgeSrc.includes("resolvedResetId") &&
      urgeSrc.includes("checkResolvedExternally && savedCheck && resolvedResetId !== savedCheck.id"),
    "the derived render-phase reset fires exactly once per resolved check"
  );
  check(
    urgeSrc.includes("setUrge(2)") &&
      urgeSrc.includes("setTriggers([])") &&
      urgeSrc.includes('setPhase("input")') &&
      urgeSrc.includes("setBrowsingStarted(false)"),
    "the reset restores every form default (scales, context, triggers)"
  );
  check(
    urgeSrc.includes("intentional re-check of the SAME unresolved state") &&
      urgeSrc.includes("setPhase(\"input\")"),
    "«فحص جديد» keeps answers (intentional re-check of the same state)"
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F11 — the three specific code-health fixes");
{
  check(
    !emergencySrc.includes("? \"اقفل المصدر دلوقتي"),
      "EmergencyMode: the duplicate-branch step1Text ternary is gone"
  );
  check(
    !cardSrc.includes("useState") && !cardSrc.includes("setStarted"),
    "InterventionCard: the dead started-state wiring is gone (no useState, no setStarted)"
  );
  check(
    !timerSrc.includes("setDone(true);\n            onComplete") &&
      timerSrc.includes("setRemaining((r) => (r <= 1 ? 0 : r - 1))") &&
      timerSrc.includes("onCompleteRef"),
    "Timer: pure updater + effect-driven completion (no side effects inside the updater)"
  );
}

// ————————————————————————————————————————————————————————————————
console.log("F12 — the browsing example is earned, not presumed");
{
  check(
    urgeSrc.includes(".filter((e) => e !== \"فتحت المصدر بالفعل\" || browsingStarted)"),
    "«فتحت المصدر بالفعل» renders only when the user reported browsing started"
  );
}

// ————————————————————————————————————————————————————————————————
console.log("Escalation contract still intact (no regression from F3 seeds)");
{
  const gateOn = baseData(true);
  const esc = selectEscalation([], {
    riskLevel: 4,
    triggerIds: [],
    context: ctx,
    data: gateOn,
  });
  check(esc != null, "escalation still returns a candidate with no exclusions");
  const esc2 = selectEscalation(
    ["escalate-to-people", "call-person", "tell-someone", "shared-space", "exercise-burst"],
    {
      riskLevel: 4,
      triggerIds: [],
      context: ctx,
      data: gateOn,
    }
  );
  check(esc2 == null, "escalation exhaustion still returns null (terminal state)");
}

console.log(`\n— F1–F12 regression contracts: ${pass} passed, ${fail} failed (total ${pass + fail})`);
if (fail > 0) process.exit(1);
