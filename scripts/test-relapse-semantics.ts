/**
 * Phase 2B.2 — Relapse / post-behavior SEMANTIC MODEL tests.
 * Run: bun scripts/test-relapse-semantics.ts
 *
 * Verifies the approved semantics (and ONLY those):
 *  A–F  behavior × classification matrix — all combinations recordable,
 *       fully independent (no coupling anywhere).
 *  G    repetitions INSIDE one continuous episode → ONE event.
 *  H    stopped, then returned later → NEW event; the first event is never
 *       mutated into a "relapse" and gains no linkage field.
 *  I    Monday + Tuesday events → two separate events; consecutive days
 *       never auto-upgrade anything to relapse.
 *  J    legacy events (no classification/behaviors) load with NO invented
 *       values — through backup import AND through the persist migration.
 *  K    legacy backup → import → re-export → still valid, fields intact.
 *  L    new-schema backup → export → import → classification + behaviors +
 *       legacy fields all preserved.
 *  +    validator rejects malformed new fields; `continued` stays orthogonal
 *       to classification; localStorage persistence keeps the new fields.
 *
 * The app NEVER infers classification (no thresholds/windows/heuristics) —
 * these tests assert exactly that absence of inference.
 */
import { readFileSync } from "node:fs";
import { validateBackup, buildBackupJson } from "../src/lib/app/backup";
import { migrateAppDataToScale5 } from "../src/lib/app/scale";
import type {
  AppData,
  RelapseBehavior,
  RelapseClassification,
  RelapseEvent,
  RelapseReview,
} from "../src/lib/app/types";

// ————— in-memory localStorage stub, installed BEFORE the store import so
// the zustand persist middleware exercises its REAL serialization path
// (JSON round-trip through the storage key) instead of degrading to no-op.
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

// Static imports above are hoisted but the store module reads localStorage
// only lazily inside createJSONStorage's getter... which runs at create()
// time. To guarantee the stub wins, import the store dynamically here.
const { useAppStore, STORAGE_KEY } = await import("../src/lib/app/store");

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

/** The exact field set a RelapseEvent may carry — nothing invented. */
const EXPECTED_EVENT_KEYS = new Set([
  "id",
  "ts",
  "timeToStop",
  "continued",
  "triggers",
  "quickTs",
  "classification",
  "behaviors",
  "reviewed",
  "review",
]);

const sampleReview: RelapseReview = {
  trigger: "وقت متأخر من الليل",
  vulnerabilities: ["تعب"],
  firstSign: "التقاط الهاتف آليًا",
  firstAction: "فتح المتصفح بلا هدف",
  escalation: "التصفح تحوّل لمحتوى محفز",
  extended: false,
  cutPoint: "لحظة فتح المتصفح",
  lesson: "درس واحد يكفي",
};

function baseData(events: RelapseEvent[]): AppData {
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
    relapseEvents: events,
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

let seq = 0;
function ev(patch: Partial<RelapseEvent> = {}): RelapseEvent {
  seq++;
  return {
    id: `rel-test-${seq}`,
    ts: `2026-01-${String(9 + seq).padStart(2, "0")}T20:00:00.000Z`,
    timeToStop: "minutes",
    continued: false,
    triggers: ["boredom"],
    reviewed: false,
    ...patch,
  };
}

const quickInput = (patch: Partial<RelapseEvent> = {}) => ({
  ts: "2026-01-05T20:00:00.000Z",
  timeToStop: "minutes" as const,
  continued: false,
  triggers: [],
  ...patch,
});

// ————— A–F: behavior × classification independence (store creation site) —————
console.log("== A–F: behavior × classification matrix (addRelapseQuick) ==");
useAppStore.getState().resetApp();
mem.clear();

const matrix: { behaviors: RelapseBehavior[]; classification: RelapseClassification }[] = [
  { behaviors: ["pornography"], classification: "slip" }, // A
  { behaviors: ["masturbation"], classification: "slip" }, // B
  { behaviors: ["pornography", "masturbation"], classification: "slip" }, // C
  { behaviors: ["pornography"], classification: "relapse" }, // D
  { behaviors: ["masturbation"], classification: "relapse" }, // E
  { behaviors: ["pornography", "masturbation"], classification: "relapse" }, // F
];
for (const c of matrix) {
  const id = useAppStore.getState().addRelapseQuick({
    ...quickInput(),
    classification: c.classification,
    behaviors: c.behaviors,
  });
  const saved = useAppStore.getState().relapseEvents.find((e) => e.id === id);
  check(
    `A–F: [${c.behaviors.join(" + ")}] + ${c.classification} saved exactly as chosen`,
    !!saved &&
      saved.classification === c.classification &&
      JSON.stringify(saved.behaviors) === JSON.stringify(c.behaviors)
  );
}
check(
  "A–F: six separate events (no splitting, no merging)",
  useAppStore.getState().relapseEvents.length === 6
);
check(
  "A–F: no invented fields on any event",
  useAppStore
    .getState()
    .relapseEvents.every((e) => Object.keys(e).every((k) => EXPECTED_EVENT_KEYS.has(k)))
);

// ————— continued is orthogonal to classification —————
console.log("== continued ⟂ classification (no coupling) ==");
useAppStore.getState().resetApp();
const idOrth1 = useAppStore.getState().addRelapseQuick(
  quickInput({ continued: true, classification: "slip", behaviors: ["pornography"] })
);
const idOrth2 = useAppStore.getState().addRelapseQuick(
  quickInput({ continued: false, classification: "relapse", behaviors: ["masturbation"] })
);
const orthState = useAppStore.getState();
const orth1 = orthState.relapseEvents.find((e) => e.id === idOrth1);
const orth2 = orthState.relapseEvents.find((e) => e.id === idOrth2);
check(
  "continued:true + slip stays slip (continued is not the relapse definition)",
  !!orth1 && orth1.classification === "slip" && orth1.continued === true
);
check(
  "continued:false + relapse stays relapse (!continued is not the slip definition)",
  !!orth2 && orth2.classification === "relapse" && orth2.continued === false
);

// ————— G: repetitions inside ONE continuous episode = ONE event —————
console.log("== G: repetitions inside one continuous episode = one event ==");
useAppStore.getState().resetApp();
useAppStore.getState().addRelapseQuick(
  quickInput({
    timeToStop: "longer",
    continued: true, // the episode kept going internally — still ONE episode
    triggers: ["boredom", "late-night"],
    classification: "slip",
    behaviors: ["pornography", "masturbation"],
  })
);
const gEvents = useAppStore.getState().relapseEvents;
check("G: a single save produced exactly ONE event", gEvents.length === 1);
check(
  "G: the one event keeps a single classification (no per-repetition events)",
  gEvents[0]?.classification === "slip"
);
check(
  "G: no repetition-count / time-window / clustering field was invented",
  Object.keys(gEvents[0] ?? {}).every((k) => EXPECTED_EVENT_KEYS.has(k))
);

// ————— H: stopped, then returned later = NEW event; old event untouched —————
console.log("== H: stopped then returned later = two separate events ==");
useAppStore.getState().resetApp();
const hId1 = useAppStore.getState().addRelapseQuick(
  quickInput({ ts: "2026-01-05T20:00:00.000Z", classification: "slip", behaviors: ["pornography"] })
);
const hSnapshot1 = JSON.parse(
  JSON.stringify(useAppStore.getState().relapseEvents.find((e) => e.id === hId1))
);
// …a real gap passes (hours later, separate return to the behavior)…
const hId2 = useAppStore.getState().addRelapseQuick(
  quickInput({ ts: "2026-01-06T02:30:00.000Z", classification: "slip", behaviors: ["masturbation"] })
);
const hState = useAppStore.getState();
check("H: two events now exist", hState.relapseEvents.length === 2);
check("H: the two events have distinct ids", hId1 !== hId2);
check(
  "H: the FIRST event is byte-identical to its snapshot (not converted, not merged, no linkage)",
  JSON.stringify(hState.relapseEvents.find((e) => e.id === hId1)) === JSON.stringify(hSnapshot1)
);
check(
  "H: the first event still classification=slip (a later return never reclassifies it)",
  hState.relapseEvents.find((e) => e.id === hId1)?.classification === "slip"
);

// ————— I: Monday + Tuesday = two events, never auto-relapse —————
console.log("== I: Monday + Tuesday events stay separate, no auto relapse ==");
useAppStore.getState().resetApp();
useAppStore.getState().addRelapseQuick(
  quickInput({ ts: "2026-01-05T23:00:00.000Z", classification: "slip", behaviors: ["pornography"] }) // Monday
);
useAppStore.getState().addRelapseQuick(
  quickInput({ ts: "2026-01-06T23:00:00.000Z", classification: "slip", behaviors: ["masturbation"] }) // Tuesday
);
const iEvents = useAppStore.getState().relapseEvents;
check("I: two distinct events on consecutive days", iEvents.length === 2 && iEvents[0].id !== iEvents[1].id);
check(
  "I: consecutive days did NOT auto-upgrade either event to relapse",
  iEvents.every((e) => e.classification === "slip")
);
// …and the same holds through a backup round-trip:
const iRound = validateBackup(buildBackupJson(baseData(iEvents)));
check("I: consecutive-day pair survives backup round-trip as two slips", iRound.ok && iRound.data.relapseEvents.every((e) => e.classification === "slip"));

// ————— J: legacy events load with NO invented values —————
console.log("== J: legacy event (no classification/behaviors) loads safely ==");
const legacyEvent = ev({
  id: "rel-legacy-1",
  ts: "2026-01-03T21:00:00.000Z",
  quickTs: "2026-01-03T21:05:00.000Z",
  reviewed: true,
  review: sampleReview,
});
const jResult = validateBackup(buildBackupJson(baseData([legacyEvent])));
check("J: backup containing a legacy event imports", jResult.ok);
if (jResult.ok) {
  const imported = jResult.data.relapseEvents[0];
  check("J: classification stays undefined (not invented)", imported.classification === undefined);
  check("J: behaviors stays undefined (not invented)", imported.behaviors === undefined);
  check(
    "J: fields are truly ABSENT in the export (not null, not placeholder)",
    !("classification" in imported) && !("behaviors" in imported)
  );
  check(
    "J: all legacy fields intact (ts/timeToStop/continued/triggers/quickTs/reviewed/review)",
    imported.ts === legacyEvent.ts &&
      imported.timeToStop === "minutes" &&
      imported.continued === false &&
      imported.triggers.length === 1 &&
      imported.quickTs === legacyEvent.quickTs &&
      imported.reviewed === true &&
      imported.review?.cutPoint === sampleReview.cutPoint
  );
}
// Same guarantee on the localStorage persist-migration path (scale.ts):
const jMigrated = migrateAppDataToScale5(baseData([legacyEvent]));
check(
  "J: persist migration does not invent classification/behaviors",
  jMigrated.relapseEvents[0].classification === undefined &&
    jMigrated.relapseEvents[0].behaviors === undefined
);
check(
  "J: persist migration preserves the legacy event one-for-one",
  jMigrated.relapseEvents.length === 1 && jMigrated.relapseEvents[0].id === "rel-legacy-1"
);

// ————— K: legacy backup → import → re-export → still valid —————
console.log("== K: legacy backup round-trips ==");
// K1 — old-style envelope (no schemaVersion / appVersion), legacy events:
const legacyEnvelope = JSON.stringify({
  app: "istiaada",
  exportedAt: "2026-01-01T10:00:00.000Z",
  data: baseData([legacyEvent]),
});
const k1 = validateBackup(legacyEnvelope);
check("K: old envelope + legacy event accepted", k1.ok);
if (k1.ok) {
  const k1Re = validateBackup(buildBackupJson(k1.data));
  check("K: re-export of imported legacy data is still valid", k1Re.ok);
  check(
    "K: legacy fields survive the round-trip",
    k1Re.ok &&
      k1Re.data.relapseEvents[0].timeToStop === "minutes" &&
      k1Re.data.relapseEvents[0].review?.lesson === sampleReview.lesson
  );
  check(
    "K: still no invented classification after round-trip",
    k1Re.ok && k1Re.data.relapseEvents[0].classification === undefined
  );
}
// K2 — the real 1–10-era backup fixture (appVersion 2.1.1):
const legacyFile = readFileSync(new URL("./legacy-backup.json", import.meta.url), "utf-8");
const k2 = validateBackup(legacyFile);
check("K: real 1–10-era backup fixture still imports", k2.ok);

// ————— L: new-schema backup round-trip —————
console.log("== L: new-schema export/import preserves everything ==");
const newEvents: RelapseEvent[] = [
  ev({ classification: "slip", behaviors: ["pornography"] }),
  ev({
    classification: "relapse",
    behaviors: ["pornography", "masturbation"],
    continued: true,
    reviewed: true,
    review: sampleReview,
  }),
];
const l1 = validateBackup(buildBackupJson(baseData(newEvents)));
check("L: new-schema backup imports", l1.ok);
if (l1.ok) {
  check(
    "L: classification preserved for both events",
    l1.data.relapseEvents[0].classification === "slip" &&
      l1.data.relapseEvents[1].classification === "relapse"
  );
  check(
    "L: behaviors preserved (incl. both-behaviors episode)",
    JSON.stringify(l1.data.relapseEvents[1].behaviors) ===
      JSON.stringify(["pornography", "masturbation"])
  );
  check(
    "L: legacy fields preserved alongside the new ones",
    l1.data.relapseEvents[1].continued === true &&
      l1.data.relapseEvents[1].review?.cutPoint === sampleReview.cutPoint &&
      typeof l1.data.relapseEvents[0].ts === "string"
  );
  const l2 = validateBackup(buildBackupJson(l1.data));
  check("L: second-generation round-trip keeps classification + behaviors", l2.ok && l2.data.relapseEvents.every((e) => e.classification != null && e.behaviors != null));
}

// ————— full chain (section 17): legacy import → new event → export → import —————
console.log("== full chain: legacy import → add new event → export → import ==");
useAppStore.getState().resetApp();
mem.clear();
useAppStore.setState({ relapseEvents: k1.ok ? k1.data.relapseEvents : [legacyEvent] });
useAppStore.getState().addRelapseQuick(
  quickInput({ ts: "2026-01-07T22:00:00.000Z", classification: "relapse", behaviors: ["masturbation"] })
);
const chainExport = useAppStore.getState().exportData();
const chainResult = validateBackup(chainExport);
check("chain: export of mixed legacy+new state is valid", chainResult.ok);
if (chainResult.ok) {
  const chainEvents = chainResult.data.relapseEvents;
  check(
    "chain: legacy event still field-less, new event carries classification + behaviors",
    chainEvents.length === 2 &&
      chainEvents[0].classification === undefined &&
      chainEvents[1].classification === "relapse" &&
      JSON.stringify(chainEvents[1].behaviors) === JSON.stringify(["masturbation"])
  );
}

// ————— localStorage persistence keeps the new fields (real persist path) —————
console.log("== persistence: zustand persist keeps classification + behaviors ==");
useAppStore.getState().resetApp();
mem.clear();
useAppStore.getState().addRelapseQuick(
  quickInput({ classification: "relapse", behaviors: ["pornography", "masturbation"] })
);
const persisted = JSON.parse(mem.get(STORAGE_KEY) ?? "{}") as {
  state?: { relapseEvents?: RelapseEvent[] };
};
const persistedEvent = persisted.state?.relapseEvents?.[0];
check(
  "persistence: stored JSON contains classification + behaviors",
  persistedEvent?.classification === "relapse" &&
    JSON.stringify(persistedEvent?.behaviors) === JSON.stringify(["pornography", "masturbation"])
);
check(
  "persistence: storage version unchanged (2) — no new migration was introduced",
  (persisted as { version?: number }).version === 2
);

// ————— validator: malformed new fields are rejected —————
console.log("== validator: malformed new fields rejected ==");
const attempt = (events: RelapseEvent[]) =>
  validateBackup(buildBackupJson(baseData(events)));

check("baseline: well-formed new-schema event accepted", attempt([ev({ classification: "slip", behaviors: ["pornography"] })]).ok);
check("baseline: legacy event (fields absent) accepted", attempt([ev()]).ok);
check(
  "unknown classification string rejected",
  !attempt([ev({ classification: "relapses" as RelapseClassification })]).ok
);
check(
  "numeric classification rejected",
  !attempt([ev({ classification: 7 as unknown as RelapseClassification })]).ok
);
check(
  "null classification rejected (app never writes null — only absent)",
  !attempt([ev({ classification: null as unknown as RelapseClassification })]).ok
);
check(
  "invalid behavior string rejected",
  !attempt([ev({ behaviors: ["porn"] as unknown as RelapseBehavior[] })]).ok
);
check(
  "empty behaviors array rejected (present field must be meaningful)",
  !attempt([ev({ behaviors: [] })]).ok
);
check(
  "non-array behaviors rejected",
  !attempt([ev({ behaviors: "pornography" as unknown as RelapseBehavior[] })]).ok
);
check(
  "null behaviors rejected",
  !attempt([ev({ behaviors: null as unknown as RelapseBehavior[] })]).ok
);
check(
  "mixed valid + invalid behaviors rejected",
  !attempt([ev({ behaviors: ["pornography", "netflix"] as unknown as RelapseBehavior[] })]).ok
);
check(
  "bad field on ONE event rejects the whole backup atomically (state untouched)",
  !attempt([ev({ classification: "slip", behaviors: ["pornography"] }), ev({ classification: "oops" as RelapseClassification })]).ok
);

// ————— rejection does not leak into legacy handling —————
console.log("== legacy + new events coexist ==");
const mixed = attempt([legacyEvent, ev({ classification: "relapse", behaviors: ["masturbation"] })]);
check("mixed legacy + new events in one backup: accepted", mixed.ok);
if (mixed.ok) {
  check(
    "mixed: legacy stays field-less, new keeps fields",
    mixed.data.relapseEvents[0].classification === undefined &&
      mixed.data.relapseEvents[1].classification === "relapse"
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
