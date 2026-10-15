/**
 * Legacy `masar` backup compatibility — behavioral regression pin.
 * Run: bun scripts/test-masar-backup.ts
 *
 * The app intentionally accepts backups exported by the older `masar`
 * application id (backward compatibility, see ACCEPTED_APP_IDS in
 * src/lib/app/backup.ts). Previous testing verified the import worked, but
 * nothing PINNED it: this suite fails the moment "masar" disappears from
 * the accepted-id list (or the legacy import path stops restoring data).
 *
 * It exercises the REAL validation + import APIs on a realistic legacy
 * fixture (old app id, 1–10 scale era, legacy-format envelope) — never a
 * text search for the word "masar".
 */
import type { AppData } from "../src/lib/app/types";

// ————— in-memory localStorage stub, installed BEFORE the store import so
// the zustand persist middleware exercises its REAL serialization path
// (same pattern as test-relapse-semantics.ts).
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
const {
  validateBackup,
  buildBackupJson,
  APP_ID,
  ACCEPTED_APP_IDS,
} = await import("../src/lib/app/backup");
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

/** A realistic LEGACY `masar` dataset: 1–10 scale era (appVersion < 2.2.0),
 * legacy envelope (no schemaVersion field), real user content. */
const masarData: AppData = {
  version: 1,
  onboardingCompleted: true,
  userProfile: {
    goals: ["change"],
    difficultTimes: ["late-night"],
    patterns: ["aimless"],
    deviceNeeds: "sometimes",
    buildGoals: ["study"],
    supportPrefs: ["mixed"],
    why: "عايز أرجع أثق في نفسي تاني",
    whyReasons: ["self-respect"],
  },
  journey: { startDate: "2026-01-01T10:00:00.000Z" },
  urgeChecks: [
    {
      id: "uc-masar-1",
      ts: "2026-01-02T20:00:00.000Z",
      urge: 7, // 1–10 era value
      proximity: 8,
      control: 6,
      context: {
        alone: true,
        lateNight: true,
        inBed: false,
        browsingStarted: false,
        deviceNeededNow: false,
      },
      riskLevel: 7,
      triggers: ["boredom"],
      outcome: "handled",
      outcomeTs: "2026-01-02T20:10:00.000Z",
    },
  ],
  interventionLogs: [
    {
      id: "ivl-masar-1",
      ts: "2026-01-02T20:01:00.000Z",
      interventionId: "walk-10",
      riskLevel: 8,
      source: "urge-check",
      success: true,
    },
  ],
  dailyLogs: {
    checkIns: [
      {
        date: "2026-01-05",
        highestUrge: 9, // 1–10 era value
        mainTrigger: "ملل",
        interventionUsed: "أيوه — نجح",
        lesson: "المشي بساعد",
        changeTomorrow: "أنام بدري",
        sleepQuality: 4,
        stress: 2,
        loneliness: 3,
        freeTime: 1,
      },
    ],
    plans: [
      {
        date: "2026-01-05",
        mode: "standard",
        purposeTask: "مراجعة واحدة",
        bodyChoice: "مشي ٢٠ دقيقة",
        completedSections: ["body"],
      },
    ],
    doseLog: [
      { date: "2026-01-04", itemId: "trigger-basics", status: "done" },
    ],
  },
  relapseEvents: [
    {
      id: "rel-masar-1",
      ts: "2026-01-03T22:00:00.000Z",
      // Legacy record: no eventDate / classification / behaviors (Phase 2B.2
      // fields) — the import must not invent any.
      timeToStop: "minutes",
      continued: false,
      triggers: ["boredom"],
      reviewed: true,
      review: {
        trigger: "الملل",
        vulnerabilities: ["تعب"],
        firstSign: "التقاط الهاتف آليًا",
        firstAction: "فتح المتصفح بلا هدف",
        escalation: "التصفح تحوّل لمحتوى محفز",
        extended: false,
        cutPoint: "لحظة فتح المتصفح",
        lesson: "درس واحد يكفي",
      },
    },
  ],
  preventionRules: [
    {
      id: "rule-masar-1",
      ifText: "شعرت بالملل والتقطت الهاتف بلا هدف",
      thenText: "أغلق المتصفح وأغيّر المكان",
      active: true,
      source: "user",
      createdAt: "2026-01-01T10:00:00.000Z",
    },
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

/** Legacy envelope: the OLD export shape (no schemaVersion, no appVersion)
 * with the OLD application id. */
const masarBackup = JSON.stringify({
  app: "masar",
  exportedAt: "2026-01-06T10:00:00.000Z",
  data: masarData,
});

console.log("== masar: accepted-id policy (the pin) ==");
{
  check(
    "ACCEPTED_APP_IDS still contains BOTH the current id and the legacy masar id",
    ACCEPTED_APP_IDS.includes(APP_ID) &&
      (ACCEPTED_APP_IDS as readonly string[]).includes("masar")
  );
  check(
    "the current application id is still istiaada (package identity unchanged)",
    APP_ID === "istiaada"
  );
}

console.log("== masar: real validation accepts the legacy backup ==");
{
  const res = validateBackup(masarBackup);
  check("legacy masar backup validates OK", res.ok === true);
  if (res.ok) {
    check(
      "summary counts the restored content correctly",
      res.summary.urgeChecks === 1 &&
        res.summary.interventions === 1 &&
        res.summary.relapses === 1 &&
        res.summary.rules === 1 &&
        res.summary.checkIns === 1 &&
        res.summary.plans === 1
    );
    check(
      "legacy 1–10 scale values were migrated by the documented band mapping (7 → 4)",
      res.data.urgeChecks[0].urge === 4 &&
        res.data.urgeChecks[0].proximity === 4 &&
        res.data.urgeChecks[0].riskLevel === 4
    );
    check(
      "already-1–5 condition scales were left untouched",
      res.data.dailyLogs.checkIns[0].sleepQuality === 4 &&
        res.data.dailyLogs.checkIns[0].stress === 2
    );
    check(
      "legacy relapse event imports with NO invented classification/behaviors",
      res.data.relapseEvents[0].classification === undefined &&
        res.data.relapseEvents[0].behaviors === undefined
    );
    check(
      "the legacy review object is restored verbatim",
      res.data.relapseEvents[0].review?.lesson === "درس واحد يكفي"
    );
  }
}

console.log("== masar: real import through the store API ==");
{
  const importRes = useAppStore.getState().importData(masarBackup);
  check("importData(masar backup) returns ok", importRes.ok === true);
  const st = useAppStore.getState();
  check(
    "the restored state carries the user's content (checks, plans, rules, doses)",
    st.urgeChecks.length === 1 &&
      st.dailyLogs.checkIns.length === 1 &&
      st.dailyLogs.plans.length === 1 &&
      st.dailyLogs.doseLog.length === 1 &&
      st.preventionRules.length === 1
  );
  check(
    "the restored urge check kept its identity + migrated scale",
    st.urgeChecks[0]?.id === "uc-masar-1" && st.urgeChecks[0].urge === 4
  );
  check(
    "the user's own words survive the round-trip (why + lesson)",
    st.userProfile.why === "عايز أرجع أثق في نفسي تاني" &&
      st.dailyLogs.checkIns[0]?.lesson === "المشي بساعد"
  );
}

console.log("== masar: the policy boundary (rejections unchanged) ==");
{
  const unknownApp = JSON.stringify({
    app: "some-other-app",
    exportedAt: "2026-01-06T10:00:00.000Z",
    data: masarData,
  });
  const res = validateBackup(unknownApp);
  check(
    "an UNKNOWN application id is still rejected (masar is an exception, not a hole)",
    res.ok === false
  );
  const currentIdControl = validateBackup(buildBackupJson(masarData));
  check(
    "current-id export/import keeps working (control round-trip)",
    currentIdControl.ok === true
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
