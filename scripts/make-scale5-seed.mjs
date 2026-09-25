/**
 * Generates a realistic seeded localStorage state for the 1–5-scale
 * screenshot regeneration pass (evidence cleanup — no app logic changes).
 *
 * Output: a single-line JSON string on stdout, ready to be used as the value
 * of `istiaada-state-v1` in localStorage (zustand persist envelope v2).
 *
 * The seed models a user ~21 days into their journey:
 *   - personal "why" text + reason chips (so the P1 block renders),
 *   - a history of handled urge checks (1–5 scale) across past days,
 *   - intervention logs (so progress insights incl. "عند درجة X من ٥" render),
 *   - evening check-ins for the last 4 evenings (NOT today),
 *   - one reviewed relapse 6 days ago (so Home renders its stable state).
 *
 * Everything is resolved/historic: the LAST seeded urge check is "handled"
 * from yesterday evening, so the freshly seeded Home is in its normal
 * ("stable") state, exactly what shot 02 needs.
 */

const DAY = 86_400_000;
const now = Date.now();

const iso = (t) => new Date(t).toISOString();
const at = (daysAgo, h = 20, m = 15) => {
  const d = new Date(now - daysAgo * DAY);
  d.setHours(h, m, 0, 0);
  return d.getTime();
};
const localDayKey = (daysAgo) => {
  const d = new Date(now - daysAgo * DAY);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const ctx = (alone, lateNight, inBed) => ({
  alone,
  lateNight,
  inBed,
  browsingStarted: false,
  deviceNeededNow: false,
});

// ——— handled urge checks across the journey (all 1–5 values) ———
const urgeChecks = [
  { id: "uc-seed-01", ts: iso(at(18)), urge: 2, proximity: 1, control: 2, context: ctx(true, true, true), riskLevel: 2, triggers: ["late-night"], outcome: "handled", outcomeTs: iso(at(18, 20, 34)), interventionId: "cold-shower" },
  { id: "uc-seed-02", ts: iso(at(16)), urge: 3, proximity: 2, control: 3, context: ctx(true, false, false), riskLevel: 2, triggers: ["boredom"], outcome: "handled", outcomeTs: iso(at(16, 21, 5)), interventionId: "walk-10" },
  { id: "uc-seed-03", ts: iso(at(14)), urge: 3, proximity: 3, control: 3, context: ctx(true, true, false), riskLevel: 3, triggers: ["loneliness", "late-night"], outcome: "handled", outcomeTs: iso(at(14, 22, 40)), interventionId: "call-friend" },
  { id: "uc-seed-04", ts: iso(at(11)), urge: 4, proximity: 4, control: 3, context: ctx(true, true, true), riskLevel: 4, triggers: ["aimless", "phone-habit"], outcome: "handled", outcomeTs: iso(at(11, 23, 18)), interventionId: "leave-room" },
  { id: "uc-seed-05", ts: iso(at(8)), urge: 2, proximity: 1, control: 1, context: ctx(false, false, false), riskLevel: 1, triggers: [], outcome: "handled", outcomeTs: iso(at(8, 19, 50)) },
  { id: "uc-seed-06", ts: iso(at(5)), urge: 3, proximity: 3, control: 4, context: ctx(true, false, true), riskLevel: 3, triggers: ["stress"], outcome: "handled", outcomeTs: iso(at(5, 21, 12)), interventionId: "breathing-5" },
  { id: "uc-seed-07", ts: iso(at(2)), urge: 2, proximity: 2, control: 2, context: ctx(true, true, true), riskLevel: 2, triggers: ["bed"], outcome: "handled", outcomeTs: iso(at(2, 20, 55)), interventionId: "out-of-bed" },
];

// ——— intervention logs (source of the "عند درجة X من ٥" insight) ———
const interventionLogs = [
  { id: "ivl-seed-01", ts: iso(at(18, 20, 30)), interventionId: "cold-shower", riskLevel: 2, source: "urge-check", success: true },
  { id: "ivl-seed-02", ts: iso(at(16, 21, 0)), interventionId: "walk-10", riskLevel: 2, source: "urge-check", success: true },
  { id: "ivl-seed-03", ts: iso(at(14, 22, 35)), interventionId: "call-friend", riskLevel: 3, source: "urge-check", success: true },
  { id: "ivl-seed-04", ts: iso(at(11, 23, 10)), interventionId: "leave-room", riskLevel: 4, source: "emergency", success: true },
  { id: "ivl-seed-05", ts: iso(at(5, 21, 8)), interventionId: "breathing-5", riskLevel: 3, source: "urge-check", success: true },
  { id: "ivl-seed-06", ts: iso(at(2, 20, 50)), interventionId: "out-of-bed", riskLevel: 2, source: "urge-check", success: true },
];

// ——— evening check-ins: the last 4 evenings, never today ———
const checkIns = [4, 3, 2, 1].map((d, i) => ({
  date: localDayKey(d),
  highestUrge: [2, 3, 2, 3][i],
  mainTrigger: ["وقت متأخر من الليل", "توتر أو ضغط", "ملل", "وحدة"][i],
  interventionUsed: ["نعم — ونجح", "نعم — جزئيًا", "لا، لم أحتج", "نعم — ونجح"][i],
  lesson: [
    "المشي عشر دقايق غيّر المزاج فعلاً",
    "التوتر بعد الشغل أخطر وقت في يومي",
    "الفراغ القصير بعد القيلولة بداية خطر",
    "الاتصال بصاحبي قصّر الموجة جداً",
  ][i],
  changeTomorrow: [
    "الهاتف يبيت خارج الغرفة",
    "أتمشى قبل ما أفتح أي شاشة",
    "أحدد نهاية واضحة للقيلولة",
    "أكتب لصاحبي بدل ما أفتح المنصات",
  ][i],
  sleepQuality: [3, 2, 4, 3][i],
  stress: [3, 4, 2, 3][i],
  loneliness: [2, 3, 2, 3][i],
  freeTime: [3, 4, 2, 3][i],
}));

// ——— one reviewed relapse 6 days ago ———
const relapseEvents = [
  {
    id: "rel-seed-01",
    ts: iso(at(6, 23, 40)),
    timeToStop: "minutes",
    continued: false,
    triggers: ["late-night", "aimless"],
    quickTs: iso(at(6, 23, 55)),
    reviewed: true,
    review: {
      trigger: "وقت متأخر من الليل",
      vulnerabilities: ["تعب", "وحدة"],
      firstSign: "التقاط الهاتف آليًا",
      firstAction: "فتح المتصفح بلا هدف",
      escalation: "التصفح تحول لمحتوى محفز",
      extended: false,
      cutPoint: "لحظة فتح المتصفح — كان ممكن أنهض أحض مية",
      lesson: "السهر + الهاتف في الغرفة = خطر مؤكد. الهاتف يبيت بره الليلة.",
    },
  },
];

const appData = {
  version: 1,
  onboardingCompleted: true,
  userProfile: {
    goals: ["أستعيد ثقتي في نفسي", "أنام بانتظام", "أرجع لعلاقتي بصحة"],
    difficultTimes: ["الليل المتأخر", "الفراغ بعد الانتهاء من الشغل"],
    patterns: ["التصفح بلا هدف قبل النوم"],
    deviceNeeds: "sometimes",
    buildGoals: ["مشي يومي ١٠ دقائق"],
    supportPrefs: ["mixed"],
    why: "واعدت نفسي إني أرجع أثق في كلمة أقولها لنفسي — والليلة دي هتنفذ.",
    whyReasons: ["علاقتي الأهم في حياتي", "رجعتي لربي", "تركيزي في شغلي"],
  },
  journey: { startDate: iso(at(21, 9, 0)) },
  urgeChecks,
  interventionLogs,
  dailyLogs: { checkIns, plans: [], doseLog: [] },
  relapseEvents,
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

process.stdout.write(JSON.stringify({ state: appData, version: 2 }));
