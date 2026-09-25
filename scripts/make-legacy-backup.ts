/**
 * Generates a legacy (1–10 era) backup JSON for E2E import testing.
 * Output: /home/z/my-project/scripts/legacy-backup.json
 * The urge check uses old-scale values (urge 7, proximity 8, control 6,
 * riskLevel 7, outcome pending, ~10 minutes ago) so after migration the
 * Home screen should show the HIGH state card (7 → 4).
 */
import { writeFileSync } from "fs";

const now = Date.now();
const iso = (msAgo: number) => new Date(now - msAgo).toISOString();

const backup = {
  app: "istiaada",
  schemaVersion: 1,
  appVersion: "2.1.1",
  exportedAt: iso(0),
  data: {
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
      whyReasons: ["self-respect", "study"],
    },
    journey: { startDate: iso(20 * 86400000) },
    urgeChecks: [
      {
        id: "uc-e2e-1",
        ts: iso(10 * 60000),
        urge: 7,
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
        outcome: "pending",
      },
    ],
    interventionLogs: [
      {
        id: "ivl-e2e-1",
        ts: iso(9 * 60000),
        interventionId: "walk-10",
        riskLevel: 8,
        source: "urge-check",
      },
    ],
    dailyLogs: {
      checkIns: [
        {
          date: new Date(now - 86400000).toISOString().slice(0, 10),
          highestUrge: 9,
          mainTrigger: "ملل",
          interventionUsed: "نعم — ونجح",
          lesson: "المشي بساعد",
          changeTomorrow: "أنام بدري",
          sleepQuality: 4,
          stress: 2,
          loneliness: 3,
          freeTime: 1,
        },
      ],
      plans: [],
      doseLog: [],
    },
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
  },
};

writeFileSync("/home/z/my-project/scripts/legacy-backup.json", JSON.stringify(backup), "utf8");
console.log("legacy backup written (urge 7 / proximity 8 / control 6 / riskLevel 7 / highestUrge 9 / log 8)");
