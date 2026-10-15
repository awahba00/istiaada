/**
 * B1 — Evening check-in correctness + daily-plan section bodies.
 * Pins every rating question to ITS OWN field and endpoints (the audit
 * reproduced scrambled labels: the sleep field showed the changeTomorrow
 * placeholder, the stress field showed the section description, and the
 * freeTime field showed the sleep question). Also pins the plan section
 * fix: الانتباه/النظافة الرقمية differentiated, بروتوكول الليل a genuine
 * night routine. Data fields and stored values are unchanged (type-level).
 *
 * Also covers the UX-improvements batch (base 330b39d):
 *   F1  — the Home plan card's evening check-in entry (state semantics,
 *         day boundary, dialog reuse).
 *   F3  — the body-activity choice correction (حركة خفيفة 5 دقائق).
 * Run: bun scripts/test-evening-checkin.ts
 */
import { readFileSync } from "node:fs";
import type { EveningCheckIn } from "../src/lib/app/types";

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
// The store reads localStorage lazily at create() time — import it AFTER
// the stub so the stub wins (same pattern as test-relapse-semantics.ts).
const { useAppStore } = await import("../src/lib/app/store");
const { validateBackup, buildBackupJson } = await import("../src/lib/app/backup");
const { dayKey } = await import("../src/lib/app/helpers");

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

const planSrc = readFileSync("src/components/app/screens/PlanScreen.tsx", "utf8");

console.log("== B1: the four condition scales (question ↔ field ↔ endpoints) ==");
{
  const condScaleCalls = planSrc.match(/condScale\("[^"]+", \w+, set\w+, "[^"]+", "[^"]+"\)/g) ?? [];
  check("exactly four condScale calls in step 2", condScaleCalls.length === 4);

  const byField = (field: string) =>
    condScaleCalls.find((c) => c.includes(`, ${field},`));

  const sleep = byField("sleepQuality");
  check(
    "sleepQuality asks about SLEEP with poor→excellent endpoints",
    sleep !== undefined &&
      sleep.includes("إزاي كان نومك الليلة الماضية؟") &&
      sleep.includes("سيئ جدًا") && sleep.includes("ممتاز")
  );

  const stress = byField("stress");
  check(
    "stress asks about STRESS with calm→very-high endpoints",
    stress !== undefined &&
      stress.includes("توترك") &&
      stress.includes("هادئ") && stress.includes("مرتفع جدًا")
  );

  const lonely = byField("loneliness");
  check(
    "loneliness keeps its relevant question with connected→isolated endpoints",
    lonely !== undefined &&
      lonely.includes("الوحدة") &&
      lonely.includes("متصل بالناس") && lonely.includes("منعزل")
  );

  const free = byField("freeTime");
  check(
    "freeTime asks about FREE TIME with none→plenty endpoints (not sleep)",
    free !== undefined &&
      free.includes("وقت الفاض") &&
      free.includes("لا يوجد") && free.includes("كثير جدًا") &&
      !free.includes("نومك")
  );

  check(
    "no placeholder/section-description strings remain in rating labels",
    !planSrc.includes('condScale("مثال:') &&
      !planSrc.includes('condScale("ظروف الغد')
  );
}

console.log("== B1: step header states what is measured and why ==");
{
  check(
    "step-2 header: today's conditions, preparing for tomorrow, not a prediction",
    planSrc.includes("ظروف النهارده (علشان نستعد لبكرة — مش تنبؤ)")
  );
}

console.log("== B1: daily-plan section bodies ==");
{
  const section = (id: string) => {
    const m = planSrc.match(new RegExp(`id: "${id}",[\\s\\S]*?body: "([^"]*)"`));
    return m?.[1] ?? null;
  };
  const attention = section("attention");
  const digital = section("digital");
  const night = section("night");
  check("الانتباه body describes a deep focus session", attention?.includes("جلسة تركيز") === true);
  check("النظافة الرقمية body describes digital-hygiene barriers", digital?.includes("حاجزاتك الرقمية") === true);
  check(
    "الانتباه and النظافة الرقمية bodies are differentiated (no copy-paste)",
    attention !== null && digital !== null && attention !== digital
  );
  check(
    "بروتوكول الليل describes a genuine night routine (phone out of bed, wind-down, sleep)",
    night?.includes("قبل النوم") === true &&
      night?.includes("برا السرير") === true &&
      !night?.includes("اليوم الإضافي")
  );
  check(
    "section IDs are unchanged (stored completedSections stay compatible)",
    ["morning", "purpose", "body", "attention", "digital", "connection", "night", "focus-2"].every(
      (id) => planSrc.includes(`id: "${id}"`)
    )
  );
}

console.log("== B1: data model unchanged ==");
{
  // The EveningCheckIn shape is the STORAGE contract: same fields, same
  // 1–5 semantics — the fix is presentation-only.
  const sample: EveningCheckIn = {
    date: "2026-10-15",
    highestUrge: 2,
    mainTrigger: "الملل",
    interventionUsed: "لأ، ما احتجتش",
    lesson: "",
    changeTomorrow: "",
    sleepQuality: 3,
    stress: 2,
    loneliness: 1,
    freeTime: 4,
  };
  check(
    "EveningCheckIn still carries all ten fields with 1–5 condition scales",
    Object.keys(sample).length === 10 &&
      [sample.sleepQuality, sample.stress, sample.loneliness, sample.freeTime].every(
        (v) => v >= 1 && v <= 5
      )
  );
  check(
    "save path still persists all condition fields (save() wiring intact)",
    /sleepQuality,\s*\n\s*stress,\s*\n\s*loneliness,\s*\n\s*freeTime,/.test(planSrc)
  );
  check(
    "editing preloads every field from the saved check-in (P3 intact)",
    planSrc.includes("setSleepQuality(c?.sleepQuality ?? 3)") &&
      planSrc.includes("setFreeTime(c?.freeTime ?? 3)")
  );
}

const homeSrc = readFileSync("src/components/app/screens/HomeScreen.tsx", "utf8");

console.log("== F1: Home evening check-in entry — reuse, not duplication ==");
{
  check(
    "Home imports the SAME dialog from PlanScreen (no second implementation)",
    homeSrc.includes('import { EveningCheckInDialog } from "./PlanScreen"') &&
      !/function EveningCheckInDialog/.test(homeSrc)
  );
  check(
    "Home renders it wired to the real save action + today's state + today's entry",
    /<EveningCheckInDialog\s*onSave=\{saveCheckIn\}\s*done=\{checkedInToday\}\s*existing=\{todayCheckIn\}\s*\/>/.test(
      homeSrc
    )
  );
  check(
    "Home derives the state with the SAME rule as the Plan screen (dayKey + checkIns)",
    /const today = dayKey\(\);[\s\S]{0,200}checkIns\.some\(\(c\) => c\.date === today\)/.test(
      homeSrc
    ) &&
      /data\.dailyLogs\.checkIns\.some\(\(c\) => c\.date === today\)/.test(homeSrc)
  );
  check(
    "pending state wording: مراجعتك المسائية with the plan card's own subtitle copy",
    homeSrc.includes("مراجعتك المسائية") &&
      homeSrc.includes("٥ أسئلة قصيرة + توقّع بكرة")
  );
  check(
    "completed state wording: راجعت يومك النهارده with a calm edit invitation",
    homeSrc.includes("راجعت يومك النهارده") &&
      /خلصت المراجعة الليلة ✓ — تعدّلها لو حبيت/.test(homeSrc)
  );
  check(
    "the entry sits INSIDE the existing الخطة اليومية card, after the pillars grid",
    (() => {
      const pillars = homeSrc.indexOf("planPillars.map");
      const entry = homeSrc.indexOf("مراجعتك المسائية");
      const nextCard = homeSrc.indexOf("لمحة عن تقدمك");
      return pillars !== -1 && entry > pillars && nextCard > entry;
    })()
  );
  check(
    "no new card/screen was added around the entry (one quiet row inside the plan card)",
    !/<Card[^>]*>[\s\S]{0,400}مراجعتك المسائية/.test(homeSrc)
  );
  check(
    "the dialog's ONLY write path is its save button — cancel/close saves nothing",
    (() => {
      const calls = planSrc.match(/onSave\(/g) ?? [];
      return (
        calls.length === 1 &&
        /const save = \(\) => \{[\s\S]{0,80}?onSave\(\{/.test(planSrc)
      );
    })()
  );
  check(
    "the Plan screen's own entry card is unchanged (same wording, same dialog)",
    planSrc.includes("المراجعة المسائية") &&
      /checkedInToday \? "خلصت المراجعة الليلة ✓ — شكرًا لصدقك"/.test(planSrc)
  );
}

console.log("== F1: current-day boundary (behavioral, real store) ==");
{
  const today = dayKey();
  // Two full days back — immune to DST (any 23h/25h day still lands on a
  // different calendar day 48h back) and far from any midnight race.
  const previousDay = dayKey(new Date(Date.now() - 2 * 86400000));
  const base: EveningCheckIn = {
    date: previousDay,
    highestUrge: 2,
    mainTrigger: "الملل",
    interventionUsed: "لأ، ما احتجتش",
    lesson: "درس الأمس",
    changeTomorrow: "",
    sleepQuality: 3,
    stress: 2,
    loneliness: 1,
    freeTime: 4,
  };
  // A review completed on a PREVIOUS day must not mark today completed.
  useAppStore.getState().saveCheckIn({ ...base, date: previousDay });
  check(
    "a previous-day review does NOT mark today's review completed",
    !useAppStore.getState().dailyLogs.checkIns.some((c) => c.date === today)
  );
  // Today's save flips the state.
  useAppStore.getState().saveCheckIn({ ...base, date: today, lesson: "درس النهارده" });
  const savedToday = useAppStore
    .getState()
    .dailyLogs.checkIns.find((c) => c.date === today);
  check("saving today's review marks today completed", savedToday != null);
  // Editing (reopening + saving again) updates the SAME entry — never a duplicate.
  useAppStore
    .getState()
    .saveCheckIn({ ...base, date: today, lesson: "درس النهارده المعدّل" });
  const todays = useAppStore.getState().dailyLogs.checkIns.filter(
    (c) => c.date === today
  );
  check(
    "re-saving today edits the same single entry (no duplicate check-ins)",
    todays.length === 1 && todays[0].lesson === "درس النهارده المعدّل"
  );
  check(
    "the saved entry carries every field the dialog preloads on reopen",
    savedToday != null && Object.keys(savedToday).length === 10
  );
  // The persistence round-trip preserves the day-key semantics verbatim.
  const persisted = JSON.parse(mem.get("istiaada-state-v1") ?? "{}");
  check(
    "persistence round-trip keeps the check-in dates verbatim (day boundary intact)",
    JSON.stringify(persisted?.state?.dailyLogs?.checkIns?.map((c: { date: string }) => c.date)) ===
      JSON.stringify([previousDay, today])
  );
}

console.log("== F3: body-activity choice correction ==");
{
  const bodyBlock = planSrc.match(/const BODY_CHOICES = \[([\s\S]*?)\];/)?.[1] ?? "";
  const bodyChoices = [...bodyBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  const modesBlock = planSrc.match(/const MODES = \[([\s\S]*?)\] as const;/)?.[1] ?? "";
  const modeDescs = [...modesBlock.matchAll(/desc: "([^"]+)"/g)].map((m) => m[1]);

  check(
    "حركة خفيفة 5 دقائق is a body-activity choice",
    bodyChoices.includes("حركة خفيفة 5 دقائق")
  );
  check(
    "the minimum-mode description is NOT a body-activity choice anymore",
    !bodyChoices.includes("يوم صعب؟ أربع ركائز بس — يكفي")
  );
  check(
    "no body-activity choice duplicates ANY plan-mode description",
    bodyChoices.every((c) => !modeDescs.includes(c))
  );
  check(
    "every remaining body choice is a movement/activity label (ladder intact)",
    ["مشي ٢٠ دقيقة", "تمرين منزلي", "تمرين رياضي", "دراجة/جري", "تمدد"].every((c) =>
      bodyChoices.includes(c)
    ) && bodyChoices.length === 6
  );
  check(
    "the minimum-mode description itself is UNCHANGED in its proper location",
    modeDescs[0] === "يوم صعب؟ أربع ركائز بس — يكفي" &&
      planSrc.includes('{ id: "minimum", label: "الحد الأدنى", desc: "يوم صعب؟ أربع ركائز بس — يكفي" }')
  );
  // Legacy stored plans: bodyChoice is free text — the old value must keep
  // importing verbatim (no crash, no mutation, no migration).
  const legacyPlanData = {
    version: 1,
    onboardingCompleted: true,
    userProfile: {
      goals: [], difficultTimes: [], patterns: [], deviceNeeds: "sometimes",
      buildGoals: [], supportPrefs: ["mixed"], why: "", whyReasons: [],
    },
    journey: { startDate: "2026-01-01T10:00:00.000Z" },
    urgeChecks: [],
    interventionLogs: [],
    dailyLogs: {
      checkIns: [],
      plans: [
        {
          date: "2026-10-10",
          mode: "standard",
          purposeTask: "",
          bodyChoice: "يوم صعب؟ أربع ركائز بس — يكفي",
          completedSections: ["body"],
        },
      ],
      doseLog: [],
    },
    relapseEvents: [],
    preventionRules: [],
    supportPerson: null,
    settings: {
      dailyDoseEnabled: true,
      spiritualContent: false,
      theme: "dark",
    },
  };
  const legacyPlanBackup = buildBackupJson(legacyPlanData as Parameters<
    typeof buildBackupJson
  >[0]);
  const res = validateBackup(legacyPlanBackup);
  check(
    "a legacy stored bodyChoice (old mode string) still imports verbatim — graceful, no mutation",
    res.ok === true &&
      res.data.dailyLogs.plans[0].bodyChoice === "يوم صعب؟ أربع ركائز بس — يكفي"
  );
  check(
    "the plan section body still renders the stored choice (display-only contract)",
    /body: bodyChoice \|\| "١٠–٣٠ دقيقة حركة مناسبة لك"/.test(planSrc)
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
