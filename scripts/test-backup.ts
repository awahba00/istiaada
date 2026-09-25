/**
 * Unit tests for src/lib/app/backup.ts — run with: bun scripts/test-backup.ts
 * Pure function tests (no DOM needed). Validates the atomic-import contract
 * AND the 1–10 → 1–5 scale migration for legacy backups.
 */
import { validateBackup, buildBackupJson } from "../src/lib/app/backup";
import {
  legacyToScale5,
  normalizeScaleValue,
  anyLegacyScaleValue,
  migrateAppDataToScale5,
} from "../src/lib/app/scale";
import type { AppData } from "../src/lib/app/types";

const validData: AppData = {
  version: 1,
  onboardingCompleted: true,
  userProfile: {
    goals: ["change"],
    difficultTimes: ["late-night"],
    patterns: ["aimless"],
    deviceNeeds: "sometimes",
    buildGoals: ["study"],
    supportPrefs: ["mixed"],
    why: "سببي",
    whyReasons: [],
  },
  journey: { startDate: "2026-01-01T10:00:00.000Z" },
  urgeChecks: [
    {
      id: "uc-1",
      ts: "2026-01-02T20:00:00.000Z",
      urge: 4,
      proximity: 4,
      control: 3,
      context: {
        alone: true,
        lateNight: true,
        inBed: false,
        browsingStarted: false,
        deviceNeededNow: false,
      },
      riskLevel: 4,
      triggers: ["boredom"],
      outcome: "handled",
      outcomeTs: "2026-01-02T20:10:00.000Z",
    },
  ],
  interventionLogs: [
    { id: "ivl-1", ts: "2026-01-02T20:01:00.000Z", interventionId: "cold-shower", riskLevel: 4, source: "urge-check", success: true },
  ],
  dailyLogs: {
    checkIns: [],
    plans: [],
    doseLog: [],
  },
  relapseEvents: [],
  preventionRules: [
    { id: "rule-1", ifText: "إذا", thenText: "إذن", active: true, source: "suggested", createdAt: "2026-01-01T10:00:00.000Z" },
  ],
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

console.log("== backup validation ==");

// 1. New-format backup (exported by buildBackupJson)
const newFmt = buildBackupJson(validData);
const r1 = validateBackup(newFmt);
check("new-format backup accepted", r1.ok);
if (r1.ok) {
  check("summary counts urgeChecks", r1.summary.urgeChecks === 1);
  check("summary rules", r1.summary.rules === 1);
  check("exportedAt parsed", r1.summary.exportedAt !== null);
}

// 2. Legacy-format backup (old envelope without schemaVersion)
const legacy = JSON.stringify({ app: "istiaada", exportedAt: "2026-01-01T10:00:00.000Z", data: validData });
check("legacy backup accepted", validateBackup(legacy).ok);

// 3. Invalid JSON
check("invalid JSON rejected", !validateBackup("{not json").ok);

// 4. Wrong app id
check("foreign app id rejected", !validateBackup(JSON.stringify({ app: "other-app", data: validData })).ok);

// 5. Future schema version
check(
  "future schema version rejected",
  !validateBackup(JSON.stringify({ app: "istiaada", schemaVersion: 2, data: validData })).ok
);

// 6. Missing / malformed userProfile
check("missing userProfile rejected", !validateBackup(JSON.stringify({ app: "istiaada", data: { ...validData, userProfile: null } })).ok);
check(
  "userProfile wrong types rejected",
  !validateBackup(JSON.stringify({ app: "istiaada", data: { ...validData, userProfile: { ...validData.userProfile, goals: "not-array" } } })).ok
);

// 7. Malformed urgeChecks item (range violation)
check(
  "out-of-range urge dimension rejected",
  !validateBackup(
    JSON.stringify({
      app: "istiaada",
      data: { ...validData, urgeChecks: [{ ...validData.urgeChecks[0], proximity: 42 }] },
    })
  ).ok
);

// 8. onboardingCompleted wrong type
check(
  "non-boolean onboardingCompleted rejected",
  !validateBackup(JSON.stringify({ app: "istiaada", data: { ...validData, onboardingCompleted: "yes" } })).ok
);

// 9. Tampered settings
check(
  "invalid theme rejected",
  !validateBackup(JSON.stringify({ app: "istiaada", data: { ...validData, settings: { ...validData.settings, theme: "blue" } } })).ok
);

// 10. Unknown junk fields are stripped, not imported
const polluted = JSON.parse(newFmt);
polluted.data.userProfile.hax = "<script>";
polluted.data.junkField = "x";
const r10 = validateBackup(JSON.stringify(polluted));
check("polluted backup still valid", r10.ok);
if (r10.ok) {
  check(
    "unknown fields stripped",
    !("junkField" in (r10.data as unknown as Record<string, unknown>)) &&
      !("hax" in (r10.data.userProfile as unknown as Record<string, unknown>))
  );
}

// 11. Empty export of fresh state (post-reset) round-trips
const fresh = JSON.parse(JSON.stringify(validData));
fresh.urgeChecks = [];
fresh.interventionLogs = [];
fresh.preventionRules = [];
fresh.onboardingCompleted = false;
check("fresh-state backup round-trips", validateBackup(buildBackupJson(fresh)).ok);

// 12. Relapse event validation
check(
  "malformed relapse rejected",
  !validateBackup(
    JSON.stringify({
      app: "istiaada",
      data: {
        ...validData,
        relapseEvents: [{ id: "r1", ts: "2026-01-01", timeToStop: "whenever", continued: false, triggers: [], reviewed: false }],
      },
    })
  ).ok
);

// 13. Support person validation
check(
  "malformed supportPerson rejected",
  !validateBackup(JSON.stringify({ app: "istiaada", data: { ...validData, supportPerson: { label: 5 } } })).ok
);
check(
  "valid supportPerson accepted",
  validateBackup(JSON.stringify({ app: "istiaada", data: { ...validData, supportPerson: { label: "أخي", phone: "+201000000000" } } })).ok
);

// ————— 14. Scale migration: documented band mapping —————
console.log("== scale migration (1–10 → 1–5) ==");
check("bands: 1–2 → 1", legacyToScale5(1) === 1 && legacyToScale5(2) === 1);
check("bands: 3–4 → 2", legacyToScale5(3) === 2 && legacyToScale5(4) === 2);
check("bands: 5–6 → 3", legacyToScale5(5) === 3 && legacyToScale5(6) === 3);
check("bands: 7–8 → 4", legacyToScale5(7) === 4 && legacyToScale5(8) === 4);
check("bands: 9–10 → 5", legacyToScale5(9) === 5 && legacyToScale5(10) === 5);
check("normalize keeps new-scale values", normalizeScaleValue(4, false) === 4);
check("normalize converts impossible >5 defensively", normalizeScaleValue(7, false) === 4);
check("normalize converts when legacy dataset", normalizeScaleValue(3, true) === 2);

const legacyData: AppData = JSON.parse(JSON.stringify(validData));
legacyData.urgeChecks[0] = {
  ...legacyData.urgeChecks[0],
  urge: 7,
  proximity: 8,
  control: 6,
  riskLevel: 7,
};
legacyData.interventionLogs[0] = { ...legacyData.interventionLogs[0], riskLevel: 9 };
legacyData.dailyLogs.checkIns = [
  {
    date: "2026-01-02",
    highestUrge: 9,
    mainTrigger: "ملل",
    interventionUsed: "نعم — ونجح",
    lesson: "درس",
    changeTomorrow: "تغيير",
    sleepQuality: 4,
    stress: 2,
    loneliness: 3,
    freeTime: 1,
  },
];

check("anyLegacyScaleValue detects >5", anyLegacyScaleValue(legacyData));

// A fully new-scale dataset (all risk fields within 1–5)
const newScaleData: AppData = JSON.parse(JSON.stringify(validData));
newScaleData.urgeChecks[0] = {
  ...newScaleData.urgeChecks[0],
  urge: 4,
  proximity: 5,
  control: 3,
  riskLevel: 4,
};
newScaleData.interventionLogs[0] = { ...newScaleData.interventionLogs[0], riskLevel: 3 };
check("anyLegacyScaleValue passes new-scale data", !anyLegacyScaleValue(newScaleData));

const migrated = migrateAppDataToScale5(legacyData);
check("migrate: urge 7 → 4", migrated.urgeChecks[0].urge === 4);
check("migrate: proximity 8 → 4", migrated.urgeChecks[0].proximity === 4);
check("migrate: control 6 → 3", migrated.urgeChecks[0].control === 3);
check("migrate: riskLevel 7 → 4", migrated.urgeChecks[0].riskLevel === 4);
check("migrate: log riskLevel 9 → 5", migrated.interventionLogs[0].riskLevel === 5);
check("migrate: highestUrge 9 → 5", migrated.dailyLogs.checkIns[0].highestUrge === 5);
check("migrate: sleepQuality 4 untouched (already 1–5)", migrated.dailyLogs.checkIns[0].sleepQuality === 4);
check("migrate: no events lost", migrated.urgeChecks.length === legacyData.urgeChecks.length);
check(
  "migrate: all values within 1–5",
  migrated.urgeChecks.every(
    (c) => c.urge >= 1 && c.urge <= 5 && c.proximity >= 1 && c.proximity <= 5 && c.control >= 1 && c.control <= 5 && c.riskLevel >= 1 && c.riskLevel <= 5
  )
);

// ————— 15. Legacy 1–10 backup import (appVersion-based detection) —————
console.log("== legacy backup import ==");

// 15a. Old-era backup (appVersion 2.1.1, 1–10 values) → converted on import
const oldBackup = JSON.stringify({
  app: "istiaada",
  schemaVersion: 1,
  appVersion: "2.1.1",
  exportedAt: "2026-01-01T10:00:00.000Z",
  data: legacyData,
});
const r15a = validateBackup(oldBackup);
check("old-era (2.1.1) backup with 1–10 values accepted", r15a.ok);
if (r15a.ok) {
  const c = r15a.data.urgeChecks[0];
  check("old-era import: values converted to 1–5", c.urge === 4 && c.proximity === 4 && c.control === 3 && c.riskLevel === 4);
  check("old-era import: historical events preserved", r15a.data.urgeChecks.length === 1);
  check("old-era import: check-in highestUrge converted", r15a.data.dailyLogs.checkIns[0].highestUrge === 5);
  check("old-era import: check-in condition scales untouched", r15a.data.dailyLogs.checkIns[0].sleepQuality === 4);
}

// 15b. Old-era backup with all values ≤ 5 → still detected as legacy via appVersion
const lowLegacy: AppData = JSON.parse(JSON.stringify(validData));
lowLegacy.urgeChecks[0] = {
  ...lowLegacy.urgeChecks[0],
  urge: 5,
  proximity: 3,
  control: 2,
  riskLevel: 4,
};
const r15b = validateBackup(
  JSON.stringify({
    app: "istiaada",
    schemaVersion: 1,
    appVersion: "2.1.0",
    exportedAt: "2026-01-01T10:00:00.000Z",
    data: lowLegacy,
  })
);
check("all-≤5 old-era backup accepted", r15b.ok);
if (r15b.ok) {
  check(
    "all-≤5 old-era backup migrated via appVersion (5→3, 3→2, 2→1, 4→2)",
    r15b.data.urgeChecks[0].urge === 3 &&
      r15b.data.urgeChecks[0].proximity === 2 &&
      r15b.data.urgeChecks[0].control === 1 &&
      r15b.data.urgeChecks[0].riskLevel === 2
  );
}

// 15c. New-era backup (appVersion 2.2.0, 1–5 values) → imported as-is
const newData: AppData = JSON.parse(JSON.stringify(newScaleData));
const r15c = validateBackup(
  JSON.stringify({
    app: "istiaada",
    schemaVersion: 1,
    appVersion: "2.2.0",
    exportedAt: "2026-01-01T10:00:00.000Z",
    data: newData,
  })
);
check("new-era (2.2.0) backup accepted", r15c.ok);
if (r15c.ok) {
  check(
    "new-era backup values kept as-is (no double conversion)",
    r15c.data.urgeChecks[0].urge === 4 &&
      r15c.data.urgeChecks[0].proximity === 5 &&
      r15c.data.urgeChecks[0].riskLevel === 4
  );
}

// 15d. No appVersion + values > 5 → legacy heuristic
const r15d = validateBackup(
  JSON.stringify({ app: "istiaada", exportedAt: "2026-01-01T10:00:00.000Z", data: legacyData })
);
check("no appVersion + >5 values → legacy heuristic converts", r15d.ok);
if (r15d.ok) {
  check("heuristic import: urge 7 → 4", r15d.data.urgeChecks[0].urge === 4);
}

// 15e. No appVersion + all values ≤ 5 → treated as new-scale, kept as-is
const r15e = validateBackup(
  JSON.stringify({ app: "istiaada", exportedAt: "2026-01-01T10:00:00.000Z", data: newData })
);
check("no appVersion + ≤5 values → kept as-is", r15e.ok);
if (r15e.ok) {
  check("no appVersion + ≤5 values: proximity 5 stays 5", r15e.data.urgeChecks[0].proximity === 5);
}

// 15f. New-era export round-trips through import without conversion
const newExport = buildBackupJson(newData);
const r15f = validateBackup(newExport);
check("new export round-trips", r15f.ok);
if (r15f.ok) {
  check(
    "round-trip: values unchanged",
    r15f.data.urgeChecks[0].urge === 4 && r15f.data.urgeChecks[0].riskLevel === 4
  );
}

// ————— 16. Phase 2B.2: slip/relapse classification + behaviors fields —————
console.log("== relapse classification + behaviors ==");
const baseRel = {
  id: "rel-1",
  ts: "2026-01-03T21:00:00.000Z",
  timeToStop: "minutes",
  continued: false,
  triggers: ["boredom"],
  reviewed: false,
};

// 16a. slip + single behavior accepted & preserved
const r16a = validateBackup(
  JSON.stringify({
    app: "istiaada",
    exportedAt: "2026-01-01T10:00:00.000Z",
    data: { ...validData, relapseEvents: [{ ...baseRel, classification: "slip", behaviors: ["pornography"] }] },
  })
);
check("slip + pornography accepted", r16a.ok);
if (r16a.ok) {
  check(
    "slip classification preserved",
    r16a.data.relapseEvents[0].classification === "slip"
  );
  check(
    "behaviors preserved",
    JSON.stringify(r16a.data.relapseEvents[0].behaviors) === JSON.stringify(["pornography"])
  );
}

// 16b. relapse + both behaviors accepted & preserved
const r16b = validateBackup(
  JSON.stringify({
    app: "istiaada",
    exportedAt: "2026-01-01T10:00:00.000Z",
    data: { ...validData, relapseEvents: [{ ...baseRel, classification: "relapse", behaviors: ["pornography", "masturbation"] }] },
  })
);
check("relapse + both behaviors accepted", r16b.ok);
if (r16b.ok) {
  check(
    "both behaviors preserved",
    (r16b.data.relapseEvents[0].behaviors ?? []).length === 2
  );
}

// 16c. legacy record WITHOUT the new fields stays valid (never guessed)
const r16c = validateBackup(
  JSON.stringify({
    app: "istiaada",
    exportedAt: "2026-01-01T10:00:00.000Z",
    data: { ...validData, relapseEvents: [{ ...baseRel }] },
  })
);
check("legacy relapse (no new fields) accepted", r16c.ok);
if (r16c.ok) {
  check(
    "legacy fields stay undefined (never guessed)",
    r16c.data.relapseEvents[0].classification === undefined &&
      r16c.data.relapseEvents[0].behaviors === undefined
  );
}

// 16d. invalid classification value rejected
const r16d = validateBackup(
  JSON.stringify({
    app: "istiaada",
    data: { ...validData, relapseEvents: [{ ...baseRel, classification: "maybe" }] },
  })
);
check("invalid classification rejected", !r16d.ok);

// 16e. invalid behavior value rejected
const r16e = validateBackup(
  JSON.stringify({
    app: "istiaada",
    data: { ...validData, relapseEvents: [{ ...baseRel, behaviors: ["social-media"] }] },
  })
);
check("invalid behavior value rejected", !r16e.ok);

// 16f. empty behaviors array rejected
const r16f = validateBackup(
  JSON.stringify({
    app: "istiaada",
    data: { ...validData, relapseEvents: [{ ...baseRel, behaviors: [] }] },
  })
);
check("empty behaviors array rejected", !r16f.ok);

// 16g. duplicate behaviors rejected
const r16g = validateBackup(
  JSON.stringify({
    app: "istiaada",
    data: { ...validData, relapseEvents: [{ ...baseRel, behaviors: ["pornography", "pornography"] }] },
  })
);
check("duplicate behaviors rejected", !r16g.ok);

// 16h. round-trip: export → import preserves the new fields
const dataWithFields = {
  ...validData,
  relapseEvents: [
    { ...baseRel, reviewed: true, classification: "relapse", behaviors: ["masturbation"] },
  ],
};
const r16h = validateBackup(buildBackupJson(dataWithFields));
check("round-trip with new fields accepted", r16h.ok);
if (r16h.ok) {
  check(
    "round-trip preserves classification + behaviors",
    r16h.data.relapseEvents[0].classification === "relapse" &&
      JSON.stringify(r16h.data.relapseEvents[0].behaviors) === JSON.stringify(["masturbation"])
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
