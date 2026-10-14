/**
 * B1 — Evening check-in correctness + daily-plan section bodies.
 * Pins every rating question to ITS OWN field and endpoints (the audit
 * reproduced scrambled labels: the sleep field showed the changeTomorrow
 * placeholder, the stress field showed the section description, and the
 * freeTime field showed the sleep question). Also pins the plan section
 * fix: الانتباه/النظافة الرقمية differentiated, بروتوكول الليل a genuine
 * night routine. Data fields and stored values are unchanged (type-level).
 * Run: bun scripts/test-evening-checkin.ts
 */
import { readFileSync } from "node:fs";
import type { EveningCheckIn } from "../src/lib/app/types";

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

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
