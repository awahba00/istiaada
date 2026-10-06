/**
 * ACT-FIRST 4+ — immediate-risk flow SEMANTIC tests.
 * Run: bun scripts/test-act-first.ts
 *
 * Verifies the approved data/outcome contracts (and ONLY those):
 *
 *  A  Emergency EXIT is inert by contract: stopEmergency() changes ONLY the
 *     overlay flags — no urge-check outcome, no intervention log, no
 *     success/failure, no screen change. The originating check stays
 *     exactly as it was (honestly pending). The user never has to lie to
 *     escape.
 *  B  Intervention SWAP: the engine's excludeIds never re-recommends an
 *     excluded intervention (a swap is genuinely different, chain-safe).
 *     Candidate EXHAUSTION: selectEscalation returns null when the
 *     escalation set is fully used — the UI turns that null into the
 *     terminal state instead of the old endless call-person fallback.
 *  D  SKIP creates NOTHING (navigation is not an outcome): a skipped card
 *     writes no log, so «هدّت» after a skip can mint no success — and an
 *     unrelated OLD log must stay untouched (the old slice(-1) heuristic
 *     regression). COMPLETION creates success, on THAT log only.
 *     ESCALATION records failure on the session's log and closes the
 *     pending check as "escalated". SESSION-SCOPED success: reaching
 *     reassessment without any «تم» (terminal path) writes nothing.
 *
 * Component wiring (which handler calls which store action, and when) is
 * verified end-to-end in the browser scenarios — these tests pin the
 * STORE + ENGINE contracts the components are built on.
 */
import {
  INTERVENTIONS,
  INTERVENTION_BY_ID,
} from "../src/data/app/interventions";
import {
  selectIntervention,
  selectEscalation,
} from "../src/lib/app/intervention-engine";
import { nowIso } from "../src/lib/app/helpers";
import type { AppData, InterventionLog, UrgeCheck } from "../src/lib/app/types";

// ————— in-memory localStorage stub, installed BEFORE the store import so
// the zustand persist middleware exercises its REAL serialization path
// (same harness as test-relapse-semantics.ts).
const mem = new Map<string, string>();
(globalThis as Record<string, unknown>).localStorage = {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => {
    mem.set(k, v);
  },
  removeItem: (k: string) => {
    mem.delete(k);
  },
};
const { useAppStore } = await import("../src/lib/app/store");

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

const emptyCtx = {
  alone: false,
  lateNight: false,
  inBed: false,
  browsingStarted: false,
  deviceNeededNow: false,
};

function baseData(): AppData {
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
    journey: { startDate: "2026-01-01T10:00:00.000Z" },
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
  };
}

const engineQuery = {
  riskLevel: 4,
  triggerIds: [],
  context: { ...emptyCtx, browsingStarted: true },
  data: baseData(),
};

const ESCALATION_SET = [
  "escalate-to-people",
  "call-person",
  "tell-someone",
  "shared-space",
  "exercise-burst",
];

function pendingCheck(id: string): UrgeCheck {
  return {
    id,
    ts: nowIso(),
    urge: 4,
    proximity: 4,
    control: 4,
    context: { ...emptyCtx },
    riskLevel: 4,
    triggers: [],
    outcome: "pending",
  };
}

function oldLog(id: string): InterventionLog {
  return {
    id,
    ts: "2026-01-01T10:00:00.000Z",
    interventionId: "walk-10",
    riskLevel: 3,
    source: "urge-check",
    // success deliberately ABSENT — an un-outcomeed old log
  };
}

// ————————————————— A — emergency exit is inert —————————————————

console.log("== A: emergency exit (honest, inert) ==");

useAppStore.setState({
  screen: "home",
  emergencyActive: true,
  emergencyCtx: { riskLevel: 4, triggers: [], workSafe: false },
  urgeChecks: [pendingCheck("uc-exit")],
  interventionLogs: [oldLog("ivl-old-exit")],
});
const beforeExit = JSON.stringify({
  c: useAppStore.getState().urgeChecks,
  l: useAppStore.getState().interventionLogs,
});

useAppStore.getState().stopEmergency();

const afterExitState = useAppStore.getState();
check("exit closes the overlay only", !afterExitState.emergencyActive && afterExitState.emergencyCtx === null);
check(
  "exit leaves the screen where it was (safe return)",
  afterExitState.screen === "home"
);
check(
  "exit leaves check + logs byte-identical (honestly pending, nothing marked)",
  JSON.stringify({ c: afterExitState.urgeChecks, l: afterExitState.interventionLogs }) ===
    beforeExit
);
check(
  "exit writes no success/failure on any log",
  afterExitState.interventionLogs.every((l) => l.success === undefined)
);
check(
  "exit does not close the check as handled",
  afterExitState.urgeChecks[0].outcome === "pending"
);

// ————————————————— B — swap never repeats a recommendation —————————————————

console.log("== B: intervention swap (genuinely different) ==");

const first = selectIntervention(engineQuery);
const second = selectIntervention({ ...engineQuery, excludeIds: [first.id] });
check(
  "swap recommends a genuinely different intervention",
  second.id !== first.id
);
check(
  "chained swaps never repeat (2 excluded → a third)",
  (() => {
    const third = selectIntervention({
      ...engineQuery,
      excludeIds: [first.id, second.id],
    });
    return third.id !== first.id && third.id !== second.id;
  })()
);
check(
  "engine alone cannot signal exhaustion (exclude-ALL still returns one — the guard lives in the UI)",
  (() => {
    const allIds = INTERVENTIONS.map((iv) => iv.id);
    const fallen = selectIntervention({ ...engineQuery, excludeIds: allIds });
    return allIds.includes(fallen.id);
  })()
);

// ————————————————— B — candidate exhaustion —————————————————

console.log("== B: candidate exhaustion (terminal, no fallback loop) ==");

check(
  "escalation exhausted → null (the old silent call-person fallback is gone)",
  selectEscalation(ESCALATION_SET, engineQuery) === null
);
check(
  "escalation with one candidate left → exactly that one",
  selectEscalation(ESCALATION_SET.slice(0, 4), engineQuery)?.id ===
    "exercise-burst"
);
check(
  "escalation from scratch → one of the escalation set",
  ESCALATION_SET.includes(selectEscalation([], engineQuery)?.id ?? "")
);
check(
  "escalation never returns an already-used candidate",
  (() => {
    const used = [ESCALATION_SET[0], ESCALATION_SET[1], ESCALATION_SET[2]];
    const next = selectEscalation(used, engineQuery);
    return next == null || !used.includes(next.id);
  })()
);
check(
  "the fallback candidate set itself is intact (engine data unchanged)",
  ESCALATION_SET.every((id) => INTERVENTION_BY_ID[id] != null)
);

// ————————————————— D — skip creates nothing —————————————————

console.log("== D: skip creates nothing (navigation is not an outcome) ==");

// The skip contract: NO logIntervention is called (pickIntervention logs
// nothing), and «هدّت» afterwards calls NO setInterventionSuccess (the
// component passes performedLogId === null → guard skips the write).
useAppStore.setState({
  emergencyActive: false,
  emergencyCtx: null,
  urgeChecks: [pendingCheck("uc-skip")],
  interventionLogs: [],
});
useAppStore.getState().setUrgeOutcome("uc-skip", "handled"); // «أيوه — الرغبة هدّت»
const skipState = useAppStore.getState();
check(
  "skip + «هدّت»: NO intervention log was ever written",
  skipState.interventionLogs.length === 0
);
check(
  "skip + «هدّت»: the check's own outcome is recorded honestly",
  skipState.urgeChecks[0].outcome === "handled"
);
check(
  "skip + «هدّت»: no success minted anywhere",
  skipState.interventionLogs.every((l) => l.success !== true)
);

// Regression — the OLD slice(-1) bug: an unrelated old log exists, the user
// skips, then says «هدّت». The old code marked THAT old log successful.
useAppStore.setState({
  urgeChecks: [pendingCheck("uc-skip2")],
  interventionLogs: [oldLog("ivl-old-skip")],
});
useAppStore.getState().setUrgeOutcome("uc-skip2", "handled"); // no log, no success call — the guard
check(
  "regression: unrelated OLD log untouched after skip + «هدّت»",
  useAppStore.getState().interventionLogs[0].success === undefined
);

// ————————————————— D — completion creates success —————————————————

console.log("== D: completion creates success (on THAT log only) ==");

useAppStore.setState({
  urgeChecks: [pendingCheck("uc-done")],
  interventionLogs: [oldLog("ivl-old-done")],
});
const stDone = useAppStore.getState();
// completeIntervention: the card's own «تم» writes the log…
stDone.logIntervention({
  id: "ivl-done",
  ts: nowIso(),
  interventionId: "close-source",
  riskLevel: 4,
  source: "urge-check",
});
// …then «أيوه — الرغبة هدّت» marks exactly that log (performedLogId guard).
stDone.setInterventionSuccess("ivl-done", true);
stDone.setUrgeOutcome("uc-done", "handled");
const doneState = useAppStore.getState();
const doneLog = doneState.interventionLogs.find((l) => l.id === "ivl-done");
const oldDoneLog = doneState.interventionLogs.find((l) => l.id === "ivl-old-done");
check(
  "completion + «هدّت» → success recorded on the completed log",
  doneLog?.success === true
);
check(
  "the unrelated old log is NOT marked by the same outcome",
  oldDoneLog?.success === undefined
);
check(
  "the check's outcome is recorded",
  doneState.urgeChecks[0].outcome === "handled"
);

// ————————————————— D — escalation flow —————————————————

console.log("== D: escalation flow (failure on the session's log) ==");

useAppStore.setState({
  screen: "urge",
  emergencyActive: true,
  emergencyCtx: { riskLevel: 4, triggers: [], workSafe: false },
  urgeChecks: [pendingCheck("uc-esc")],
  interventionLogs: [oldLog("ivl-old-esc")],
});
const stEsc = useAppStore.getState();
// step-3 «تم — الخطوة اللي بعدها» writes the SESSION log…
stEsc.logIntervention({
  id: "ivl-esc",
  ts: nowIso(),
  interventionId: "leave-room",
  riskLevel: 4,
  source: "emergency",
});
// …step-4 «لأ — لسه عالي» writes failure on THAT id and escalates the check.
stEsc.setInterventionSuccess("ivl-esc", false);
stEsc.setUrgeOutcome("uc-esc", "escalated");
const escState = useAppStore.getState();
check(
  "escalation: failure recorded on the session's log",
  escState.interventionLogs.find((l) => l.id === "ivl-esc")?.success === false
);
check(
  "escalation: the old log stays untouched",
  escState.interventionLogs.find((l) => l.id === "ivl-old-esc")?.success ===
    undefined
);
check(
  "escalation: the pending check is closed as escalated (not handled)",
  escState.urgeChecks[0].outcome === "escalated"
);

// ————————————————— D — session-scoped success (terminal path) —————————————————

console.log("== D: reassessment without a session log writes nothing ==");

// Terminal path: the user swapped every candidate (no «تم» on any card),
// reached reassessment, and reports «أيوه — هدي». sessionLogId is null →
// nextFromIntervention performs NO setInterventionSuccess — the old
// slice(-1) heuristic would have marked an unrelated yesterday log.
useAppStore.setState({
  emergencyActive: true,
  emergencyCtx: { riskLevel: 4, triggers: [], workSafe: false },
  urgeChecks: [pendingCheck("uc-term")],
  interventionLogs: [oldLog("ivl-old-term")],
});
const stTerm = useAppStore.getState();
// nextFromIntervention(true) with sessionLogId === null: only the check…
stTerm.setUrgeOutcome("uc-term", "handled");
const termState = useAppStore.getState();
check(
  "terminal reassessment: NO success fabricated on the old log",
  termState.interventionLogs.find((l) => l.id === "ivl-old-term")?.success ===
    undefined
);
check(
  "terminal reassessment: the check is still honestly closed (user's own report)",
  termState.urgeChecks[0].outcome === "handled"
);
check(
  "terminal reassessment: no new log was written for swapped (unperformed) interventions",
  termState.interventionLogs.length === 1
);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
