/**
 * Recovery-continuity batch — regression tests.
 * Run: bun scripts/test-recovery-continuity.ts
 *
 *  A — return-tracking (GAP-01): first open / short absence / threshold
 *      boundary / long absence / illogical future record / corrupt record /
 *      storage-unavailable degradation / idempotence per load / reset clear.
 *  B — lesson-match (GAP-09): trigger match / multiple-lesson relevance
 *      ordering / no data / context-equivalent match without trigger match /
 *      manual-entry context path / review-only candidates / read-only.
 *  C — wiring contracts (source level; the DOM parts are verified live at
 *      390×844 in this batch's browser verification):
 *        - HomeScreen: return card + evaluateReturn once-per-load + day
 *          counter rephrased away from streak semantics;
 *        - UrgeScreen: prior-lesson hint ONLY in the calm result branch and
 *          the intervention phase, never in the urgent result branches;
 *        - EmergencyMode: hint only on reassessment (step 4), never on the
 *          maximum variant; the intervention-CTA flush-at-edge fix
 *          (center-on-focus + safe-area bottom padding);
 *        - Help corridor: screen registration, Settings + More entries,
 *          verified resources, zero network code;
 *        - C4c (2026-10-14 mobile-UX + link batch): urgent-first
 *          hierarchy, collapsed-by-default secondary disclosures,
 *          full-width emergency tile in the More sheet, and the Case-B
 *          link outcome (verified Ministry page + unavailability note,
 *          dead-end platform URL no longer linked).
 *        - store: new ScreenId + reset clears the last-open stamp + the
 *          stamp key stays outside the persisted/backup surface.
 *        - C4b (2026-10-13 per-claim content audit): 16328 = general
 *          psychological support ONLY (official description, no "free"
 *          claim, confidentiality only as the Secretariat's own
 *          announcement); 16023 = ONLY inside its separate substance-
 *          addiction context (never in the ب find-a-specialist list, never
 *          inside the ج urgent card); section ب states honestly that no
 *          verified Egyptian CSBD/PPU-specialized service exists.
 *  D — maintenance fixes: support-person card texts, progress tile label.
 *  E — data integrity: lesson matching never mutates the store snapshot.
 */
import { readFileSync } from "node:fs";

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

/* ————— tiny localStorage shim (module reads window.localStorage lazily) ————— */
const shimStore = new Map<string, string>();
(globalThis as Record<string, unknown>).window = {
  localStorage: {
    getItem: (k: string) => (shimStore.has(k) ? shimStore.get(k)! : null),
    setItem: (k: string, v: string) => void shimStore.set(k, v),
    removeItem: (k: string) => void shimStore.delete(k),
    clear: () => void shimStore.clear(),
  },
};

import {
  LAST_OPEN_KEY,
  RETURN_ABSENCE_THRESHOLD_DAYS,
  evaluateReturn,
  daysSinceOpen,
  readLastOpenIso,
  clearLastOpen,
  writeLastOpen,
} from "../src/lib/app/return-tracking";
import {
  findRelevantLesson,
  findLatestLesson,
} from "../src/lib/app/lesson-match";
import type { AppData, RelapseEvent, EveningCheckIn } from "../src/lib/app/types";

const homeSrc = readFileSync("src/components/app/screens/HomeScreen.tsx", "utf8");
const urgeSrc = readFileSync("src/components/app/screens/UrgeScreen.tsx", "utf8");
const emSrc = readFileSync("src/components/app/screens/EmergencyMode.tsx", "utf8");
const helpSrc = readFileSync("src/components/app/screens/HelpScreen.tsx", "utf8");
const helpDataSrc = readFileSync("src/data/app/help-resources.ts", "utf8");
const shellSrc = readFileSync("src/components/app/AppShell.tsx", "utf8");
const settingsSrc = readFileSync("src/components/app/screens/SettingsScreen.tsx", "utf8");
const preventionSrc = readFileSync("src/components/app/screens/PreventionScreen.tsx", "utf8");
const progressSrc = readFileSync("src/components/app/screens/ProgressScreen.tsx", "utf8");
const storeSrc = readFileSync("src/lib/app/store.ts", "utf8");
const hintSrc = readFileSync("src/components/app/PriorLessonHint.tsx", "utf8");
const screensIdxSrc = readFileSync("src/components/app/screens/index.ts", "utf8");

/* ————— shared test data ————— */

function baseData(): AppData {
  return {
    version: 1,
    onboardingCompleted: true,
    userProfile: {
      goals: [], difficultTimes: [], patterns: [],
      deviceNeeds: "sometimes", buildGoals: [], supportPrefs: ["mixed"],
      why: "", whyReasons: [],
    },
    journey: { startDate: "2026-09-01T10:00:00.000Z" },
    urgeChecks: [],
    interventionLogs: [],
    dailyLogs: { checkIns: [], plans: [], doseLog: [] },
    relapseEvents: [],
    preventionRules: [],
    supportPerson: null,
    settings: {
      dailyDoseEnabled: true, spiritualContent: false,
      preferredDoseTime: "morning", postRelapseSupport: true,
      theme: "dark", notificationsEnabled: false,
    },
  };
}

function reviewedRelapse(
  id: string,
  ts: string,
  trigger: string,
  cutPoint: string,
  lesson: string
): RelapseEvent {
  return {
    id,
    ts,
    eventDate: undefined,
    timeToStop: "minutes",
    continued: false,
    triggers: [trigger],
    quickTs: ts,
    reviewed: true,
    review: {
      trigger,
      vulnerabilities: [],
      firstSign: "",
      firstAction: "",
      escalation: "",
      extended: false,
      cutPoint,
      lesson,
    },
  };
}

function checkIn(
  date: string,
  mainTrigger: string,
  lesson: string
): EveningCheckIn {
  return {
    date,
    highestUrge: 2,
    mainTrigger,
    interventionUsed: "none",
    lesson,
    changeTomorrow: "",
    sleepQuality: 3,
    stress: 3,
    loneliness: 3,
    freeTime: 3,
  };
}

const NOW = new Date("2026-10-13T18:00:00");

function daysAgoIso(n: number): string {
  return new Date(NOW.getTime() - n * 86400000).toISOString();
}

/* ————— A — return tracking (GAP-01 / NEED-030) ————— */

console.log("A — return tracking");
{
  // A1: first open ever → not qualified, days null.
  shimStore.clear();
  const r1 = evaluateReturn(NOW);
  check("first open: not qualified, days null", !r1.qualified && r1.days === null);

  // A2: absence below threshold → not qualified.
  writeLastOpen(new Date(NOW.getTime() - 3 * 86400000));
  const r2 = evaluateReturn(NOW);
  check("3-day absence: not qualified", !r2.qualified && r2.days === 3);

  // A3: threshold boundary (exactly 7) → qualified.
  writeLastOpen(new Date(NOW.getTime() - 7 * 86400000));
  const r3 = evaluateReturn(NOW);
  check("7-day absence (boundary): qualified", r3.qualified && r3.days === 7);

  // A4: beyond threshold → qualified.
  writeLastOpen(new Date(NOW.getTime() - 21 * 86400000));
  const r4 = evaluateReturn(NOW);
  check("21-day absence: qualified", r4.qualified && r4.days === 21);

  // A5: idempotence — evaluation stamps now, so an immediate re-evaluation
  // (reload / re-mount) degrades to "no absence".
  const r5 = evaluateReturn(new Date(NOW.getTime() + 60000));
  check("immediate re-evaluation: not qualified (stamp guard)", !r5.qualified && r5.days === 0);

  // A6: record in the future (clock changed backwards) → 0 days, never a
  // fabricated gap, never qualified.
  check("future record: daysSinceOpen clamps to 0", daysSinceOpen("2027-01-01T00:00:00.000Z", NOW) === 0);

  // A7: corrupt record → readLastOpenIso null → first-open semantics.
  shimStore.clear();
  shimStore.set(LAST_OPEN_KEY, "not-a-date");
  check("corrupt record: reads as null", readLastOpenIso() === null);
  const r7 = evaluateReturn(NOW);
  check("corrupt record: not qualified, days null", !r7.qualified && r7.days === null);

  // A8: daysSinceOpen floors across midnight boundaries (local days).
  check(
    "daysSinceOpen counts whole local days",
    daysSinceOpen("2026-10-11T09:00:00.000Z", NOW) === 2
  );

  // A9: reset clears the stamp — a post-reset user is new, not "returning".
  writeLastOpen(new Date(NOW.getTime() - 30 * 86400000));
  clearLastOpen();
  check("clearLastOpen: stamp removed", readLastOpenIso() === null);

  // A10: threshold constant is the approved 7.
  check("threshold is 7 days", RETURN_ABSENCE_THRESHOLD_DAYS === 7);

  // A11: dedicated key — outside the persisted app-state key namespace.
  check("last-open key is dedicated", LAST_OPEN_KEY === "istiaada-last-open-v1");
  check(
    "last-open key is NOT the app state key",
    !storeSrc.includes('"istiaada-last-open-v1"') || storeSrc.includes('from "./return-tracking"')
  );
  check(
    "store partialize does not persist the stamp",
    !/partialize[\s\S]*?lastOpen/.test(storeSrc)
  );
}

/* ————— B — lesson matching (GAP-09 / NEED-011 / NEED-019) ————— */

console.log("B — lesson matching");
{
  // B1: exact trigger match exists.
  const d1 = baseData();
  d1.relapseEvents.push(
    reviewedRelapse("r1", daysAgoIso(10), "boredom", "أقفل التبويب وأقوم من مكاني", "الملل مش أمر — أشغله بحاجة ٥ دقايق")
  );
  const l1 = findRelevantLesson(d1, { triggerIds: ["boredom"] });
  check("trigger match: found", l1 != null);
  check(
    "trigger match: user's own lesson + cut point",
    l1?.lesson === "الملل مش أمر — أشغله بحاجة ٥ دقايق" &&
      l1?.cutPoint === "أقفل التبويب وأقوم من مكاني"
  );
  check("trigger match: kind is trigger", l1?.matchKind === "trigger");

  // B2: no trigger selected → no match when context is off.
  const l2 = findRelevantLesson(d1, { triggerIds: [] });
  check("no trigger + no context: no lesson", l2 == null);

  // B3: multiple lessons — relapse review outranks check-in; then recency.
  const d3 = baseData();
  d3.relapseEvents.push(
    reviewedRelapse("r-old", daysAgoIso(40), "boredom", "قديم", "درس قديم")
  );
  d3.relapseEvents.push(
    reviewedRelapse("r-new", daysAgoIso(5), "boredom", "أقفل وأقوم", "درس جديد")
  );
  d3.dailyLogs.checkIns.push(checkIn("2026-10-12", "boredom", "درس مراجعة امبارح"));
  const l3 = findRelevantLesson(d3, { triggerIds: ["boredom"] });
  check(
    "multiple lessons: most recent relapse review wins",
    l3?.source === "relapse-review" && l3?.ts === daysAgoIso(5)
  );

  const d3b = baseData();
  d3b.dailyLogs.checkIns.push(checkIn("2026-10-01", "boredom", "درس ١ أكتوبر"));
  d3b.dailyLogs.checkIns.push(checkIn("2026-10-11", "boredom", "درس ١١ أكتوبر"));
  const l3b = findRelevantLesson(d3b, { triggerIds: ["boredom"] });
  check(
    "check-ins only: latest wins",
    l3b?.source === "check-in" && l3b?.lesson === "درس ١١ أكتوبر"
  );

  // B4: context-equivalent match with NO trigger selected (acceptance 4).
  const d4 = baseData();
  d4.relapseEvents.push(
    reviewedRelapse("r-night", daysAgoIso(6), "late-night", "أقفل الجهاز وأسيب الأوضة", "بروتوكول الليل شغال")
  );
  const l4 = findRelevantLesson(d4, { triggerIds: [], context: { lateNight: true } });
  check("context match (late-night ↔ lateNight): found", l4 != null && l4?.matchKind === "context");
  const l4b = findRelevantLesson(d4, { triggerIds: [], context: { lateNight: false } });
  check("context flag OFF: no match", l4b == null);
  const l4c = findRelevantLesson(d4, { triggerIds: ["boredom"], context: { lateNight: false } });
  check("unrelated trigger: no match", l4c == null);

  // B5: bed/isolation equivalences.
  const d5 = baseData();
  d5.relapseEvents.push(reviewedRelapse("r-bed", daysAgoIso(2), "bed", "السرير للنوم بس", "أقوم أول ما أحس بالرغبة"));
  const l5 = findRelevantLesson(d5, { triggerIds: [], context: { inBed: true } });
  check("context match (bed ↔ inBed): found", l5 != null);
  const d5b = baseData();
  d5b.relapseEvents.push(reviewedRelapse("r-iso", daysAgoIso(2), "isolation", "أخرج من الأوضة", "الوحدة بتضاعفها"));
  const l5b = findRelevantLesson(d5b, { triggerIds: [], context: { alone: true } });
  check("context match (isolation ↔ alone): found", l5b != null);

  // B6: manual emergency without assessment — triggerless; exact context
  // equivalent only (acceptance 6: honest, never fabricated).
  const l6 = findRelevantLesson(d5b, { triggerIds: [] });
  check("manual entry, no context flags: nothing fabricated", l6 == null);

  // B7: unreviewed events and empty lessons are never candidates.
  const d7 = baseData();
  d7.relapseEvents.push({
    ...reviewedRelapse("r-unreviewed", daysAgoIso(1), "boredom", "نقطة", "درس"),
    reviewed: false,
    review: undefined,
  });
  d7.relapseEvents.push(
    reviewedRelapse("r-empty", daysAgoIso(1), "boredom", "نقطة", "   ")
  );
  const l7 = findRelevantLesson(d7, { triggerIds: ["boredom"] });
  check("unreviewed/empty lessons: no card, no empty state", l7 == null);

  // B8: unknown/free-text trigger ids are not matched (no id allowlist
  // guessing — only known taxonomy ids relate).
  const d8 = baseData();
  d8.relapseEvents.push(reviewedRelapse("r-unknown", daysAgoIso(1), "حاجة تانية", "نقطة", "درس"));
  const l8 = findRelevantLesson(d8, { triggerIds: ["حاجة تانية"] });
  check("unknown trigger id: no match", l8 == null);

  // B9: findLatestLesson — for the return card, most recent own words.
  const l9 = findLatestLesson(d3);
  check("findLatestLesson: most recent overall", l9?.ts === daysAgoIso(5));
  const l9b = findLatestLesson(baseData());
  check("findLatestLesson: nothing written → null", l9b == null);

  // B10: read-only — matching never mutates the data snapshot.
  const d10 = baseData();
  d10.relapseEvents.push(
    reviewedRelapse("r-ro", daysAgoIso(3), "boredom", "نقطة", "درس")
  );
  const before = JSON.stringify(d10);
  findRelevantLesson(d10, { triggerIds: ["boredom"] });
  findLatestLesson(d10);
  check("matching is read-only", JSON.stringify(d10) === before);
}

/* ————— C — wiring contracts (source level) ————— */

console.log("C — wiring contracts");
{
  // C1: HomeScreen — return card + once-per-load evaluation + counter copy.
  check("Home imports evaluateReturn", homeSrc.includes('from "@/lib/app/return-tracking"'));
  check(
    "Home evaluates return once per load (mount effect)",
    /useEffect\(\(\) => \{\s*const res = evaluateReturn\(\);/.test(homeSrc)
  );
  check(
    "Home renders the ReturnCard gated on state banner priority",
    /returnQualified && !returnDismissed && homeState === "normal"/.test(homeSrc)
  );
  check(
    "Return card: the approved calm headline",
    homeSrc.includes("رجعت — المهم النهارده، مش اللي فات.")
  );
  check(
    "Return card: links to today's plan",
    homeSrc.includes('navigate("plan")')
  );
  check(
    "Return card: no absence-duration copy anywhere",
    !/غيبت|مدة غياب|منذ \d+|بعد \d+ يوم/.test(homeSrc)
  );
  check(
    "Day counter: streak phrasing retired",
    !homeSrc.includes("منذ آخر زَلّة")
  );
  check(
    "Day counter: neutralizer added in app vocabulary",
    homeSrc.includes("والعدد مش نتيجة")
  );
  check(
    "Return card: offers the user's own latest lesson (quiet details)",
    homeSrc.includes("findLatestLesson") && homeSrc.includes("في درس كتبته بنفسك قبل كده")
  );

  // C2: UrgeScreen — hint placements (calm branch + intervention phase only).
  const occurrences = urgeSrc.match(/priorLesson && <PriorLessonHint/g) ?? [];
  check("Urge hint: exactly two placements", occurrences.length === 2);
  const awarenessIdx = urgeSrc.indexOf('mode === "awareness"');
  const interruptIdx = urgeSrc.indexOf('mode === "interrupt"');
  const firstHintIdx = urgeSrc.indexOf("priorLesson && <PriorLessonHint");
  const newCheckBtnIdx = urgeSrc.indexOf("فحص جديد");
  const secondHintIdx = urgeSrc.lastIndexOf("priorLesson && <PriorLessonHint");
  const skipIdx = urgeSrc.indexOf("تخطّى — راجع حالتك");
  check(
    "Urge hint: calm result branch (awareness), after فحص جديد",
    awarenessIdx >= 0 &&
      firstHintIdx > newCheckBtnIdx &&
      firstHintIdx < interruptIdx
  );
  check(
    "Urge hint: intervention phase, after the skip control (first step in motion)",
    secondHintIdx > skipIdx
  );
  const interruptBlock = urgeSrc.slice(interruptIdx, urgeSrc.indexOf('mode === "emergency"'));
  check("Urge hint: NOT in the urgent result branches", !interruptBlock.includes("PriorLessonHint"));
  check(
    "Urge hint: computed read-only from current form state",
    urgeSrc.includes("findRelevantLesson(data, {") &&
      urgeSrc.includes("triggerIds: triggers")
  );

  // C3: EmergencyMode — reassessment-only hint + CTA clearance fix.
  check("EM imports PriorLessonHint + matcher", emSrc.includes('from "../PriorLessonHint"') && emSrc.includes("findRelevantLesson"));
  const emOccurrences = emSrc.match(/priorLesson && <PriorLessonHint/g) ?? [];
  check("EM hint: exactly one placement (step 4)", emOccurrences.length === 1);
  const hintIdxEm = emSrc.indexOf("priorLesson && <PriorLessonHint");
  const personalWhyIdx = emSrc.indexOf("!maximum && <PersonalWhy />");
  check(
    "EM hint: on reassessment, gated with !maximum, below PersonalWhy",
    hintIdxEm > personalWhyIdx &&
      /\{!maximum && priorLesson && <PriorLessonHint/.test(emSrc)
  );
  const steps123 = emSrc.slice(0, emSrc.indexOf("————— Step 4"));
  check(
    "EM hint: never on steps 1-3 (the immediate cut steps)",
    !steps123.includes("priorLesson && <PriorLessonHint")
  );
  check(
    "EM fix: focus scroll centers the primary CTA (flush-at-edge root cause)",
    emSrc.includes('target.scrollIntoView({ block: "center" })') &&
      emSrc.includes("root.scrollHeight > root.clientHeight")
  );
  check(
    "EM fix: safe-area-aware bottom padding",
    emSrc.includes("pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)]")
  );

  // C4: Help corridor — registration + entries + verified content + no network.
  check("ScreenId includes help", storeSrc.includes('| "help"'));
  check("SCREEN_COMPONENTS maps help", shellSrc.includes("help: HelpScreen"));
  check("NAV_ITEMS has the help card (More sheet + sidebar)", shellSrc.includes('id: "help"') && shellSrc.includes("المساعدة المتخصصة"));
  check("screens/index exports HelpScreen", screensIdxSrc.includes('export { HelpScreen }'));
  check("Settings links into the corridor", settingsSrc.includes('navigate("help")'));
  check(
    "Help page: three sections present (أ urgent / ب indicators / ج find-a-specialist)",
    helpSrc.includes("أ. محتاج مساعدة عاجلة — أعمل إيه؟") &&
      helpSrc.includes("ب. متى أطلب مساعدة متخصصة؟") &&
      helpSrc.includes("ج. أبدأ البحث عن مختص منين؟")
  );
  check(
    "Help page: self-help limits disclosure (not a diagnosis/treatment/replacement)",
    helpSrc.includes("مش تشخيص") && helpSrc.includes("ولا بديل عن مختص")
  );
  check(
    "Help resources: verified Egyptian lines (16328 / 123 / 122 / 16023)",
    helpDataSrc.includes('"16328"') &&
      helpDataSrc.includes('"123"') &&
      helpDataSrc.includes('"122"') &&
      helpDataSrc.includes('"16023"')
  );
  check(
    "Help resources: link = VERIFIED Ministry page about the Secretariat (2026-10-14, Case B); dead-end platform URL no longer linked",
    helpDataSrc.includes(
      "https://www.mohp.gov.eg/SectorServices.aspx?Deptcode=4&SectorCode=2"
    ) && !/url:\s*"https:\/\/mentalhealth/.test(helpDataSrc)
  );
  check(
    "Help resources: verification date + sources documented",
    helpDataSrc.includes("HELP_INFO_VERIFIED_AT") &&
      helpDataSrc.includes("2026-10-14")
  );
  check(
    "Help page: tel links only — zero network code",
    !/fetch\(|XMLHttpRequest|sendBeacon|axios|navigator\.send/.test(helpSrc) &&
      !/fetch\(|XMLHttpRequest|sendBeacon|axios/.test(helpDataSrc)
  );
  check(
    "Help page: emergency section is action-forward (big tel buttons, not prose)",
    /href=\{`tel:\$\{n\}`\}/.test(helpSrc)
  );
  check(
    "Help page: every line carries honest service limits",
    helpSrc.includes("حدود الخدمات دي — بصراحة") &&
      helpDataSrc.includes('limits: "خط دعم نفسي عام')
  );
  check(
    "Help page: urgent section mentions the support person option",
    helpSrc.includes("supportPerson")
  );

  // C4b — help-corridor content integrity (2026-10-13 per-claim audit,
  // requested by the user before final patch adoption):
  // 16328 is presented ONLY as general psychological support per its
  // official description; 16023 is shown ONLY in a separate, clearly
  // labeled substance-addiction context — never as a path for this app's
  // problem. Claims (free / confidential / 24-7) exist only where an
  // official source states them.
  {
    // JSX wraps Arabic copy across source lines (rendered as single
    // spaces) — normalize whitespace so phrase checks are stable.
    const flat = (s: string) => s.replace(/\s+/g, " ");
    const gsmhatBlock = flat(
      helpDataSrc.slice(
        helpDataSrc.indexOf('id: "gsmhat-hotline"'),
        helpDataSrc.indexOf('id: "ambulance"')
      )
    );
    check(
      "16328: presented as general psychological support (official description)",
      gsmhatBlock.includes("دعم نفسي عام")
    );
    check(
      "16328: cost NOT claimed (free is not in official sources) — government service only",
      gsmhatBlock.includes("خدمة حكومية") && !gsmhatBlock.includes("مجاني")
    );
    check(
      "16328: confidentiality only as the Secretariat's own announcement",
      gsmhatBlock.includes("بنسمعك باهتمام وسرية تامة")
    );
    check(
      "16328: limits deny specialized CSBD/porn treatment scope",
      gsmhatBlock.includes("مش علاج متخصص للسلوك الجنسي القهري")
    );
    check(
      "16328: emergency limits intact (not a substitute for the ambulance)",
      gsmhatBlock.includes("مش بديل عن إسعاف الطوارئ")
    );

    const addictionBlock = flat(
      helpDataSrc.slice(
        helpDataSrc.indexOf('id: "addiction-fund"'),
        helpDataSrc.indexOf("export interface HelpLink")
      )
    );
    check(
      "16023: scoped to substance addiction; free/confidential attributed to the fund's announcement",
      addictionBlock.includes("إدمان المواد المخدرة") &&
        addictionBlock.includes("وفق إعلان الصندوق الرسمي")
    );
    check(
      "16023: limits deny CSBD/porn scope and route general support to 16328",
      addictionBlock.includes("مش خط للسلوك الجنسي القهري") &&
        addictionBlock.includes("16328")
    );

    const specialistSection = flat(
      helpSrc.slice(
        helpSrc.indexOf("ج. أبدأ البحث عن مختص منين؟"),
        helpSrc.indexOf("————— Separate context: substance-addiction path")
      )
    );
    check(
      "16023: removed from the general find-a-specialist pathway (ج)",
      !specialistSection.includes("16023")
    );
    check(
      "ج: 16328 bullet = general support + urgent referral, per official description",
      specialistSection.includes("خط الدعم النفسي العام 16328") &&
        specialistSection.includes("دعم نفسي عام، مش خدمة علاج متخصصة")
    );
    check(
      "ج: honest statement — no verified Egyptian CSBD/PPU specialized service, nothing invented",
      specialistSection.includes("مفيش خدمة مصرية موثقة") &&
        specialistSection.includes("مش هنختلقلك رقم خدمة")
    );
    check(
      "ج: routes to a competent clinician + the first-session question",
      specialistSection.includes("مختص نفسي كفء") &&
        specialistSection.includes("اشتغلت مع حالات زي حالتي قبل")
    );
    check(
      "ج: blanket confidentiality claim retired (per-resource only)",
      !specialistSection.includes("بتعلن السرية ضمن خدمتها")
    );

    const urgentSection = flat(
      helpSrc.slice(
        helpSrc.indexOf("أ. محتاج مساعدة عاجلة"),
        helpSrc.indexOf("ب. متى أطلب مساعدة متخصصة؟")
      )
    );
    check(
      "16023: NOT inside the urgent card (أ) — the addiction variable is gone from it",
      !urgentSection.includes("16023") && !urgentSection.includes("addiction")
    );
    check(
      "أ: self-harm block keeps the documented general-support line (rendered from HELP_LINES); ambulance and police keep their own blocks",
      urgentSection.includes("hotline.numbers") &&
        urgentSection.includes("إسعاف") &&
        urgentSection.includes("شرطة")
    );

    const separateCardIdx = helpSrc.indexOf(
      "مسار منفصل: لو صراعك شمل — كمان — إدمان المواد المخدرة"
    );
    // Only RENDERED body counts — code comments are not user-visible.
    const bodyAfterCard = helpSrc.slice(separateCardIdx);
    const only16023 = bodyAfterCard.match(/16023/g) ?? [];
    check(
      "16023: single literal placement in the screen — its own separate clearly-labeled card after ج",
      separateCardIdx > -1 &&
        only16023.length === 1 &&
        bodyAfterCard.indexOf("16023") < bodyAfterCard.indexOf("————— Honest limits")
    );
    const separateCardSlice = flat(
      helpSrc.slice(
        separateCardIdx,
        helpSrc.indexOf("————— Honest limits")
      )
    );
    check(
      "16023 card: names the fund's hotline + documented-for-substances phrasing",
      separateCardSlice.includes(
        "16023 خط صندوق مكافحة وعلاج الإدمان والتعاطي"
      ) &&
        separateCardSlice.includes("لعلاج إدمان المواد تحديدًا") &&
        separateCardSlice.includes("غير السلوك اللي بتعمل عليه في التطبيق")
    );
    check(
      "16023 card: renders its full documented limits (substance scope, CSBD/porn denial, 16328 routing)",
      separateCardSlice.includes("{addiction.limits}") &&
        addictionBlock.includes("مش خط للسلوك الجنسي القهري") &&
        addictionBlock.includes("للدعم النفسي العام: 16328")
    );
  }

  // C4c — 2026-10-14 mobile-UX + official-link batch: urgent-first
  // hierarchy, progressive disclosure, full-width emergency tile, and
  // the Case-B link outcome.
  {
    const idxOf = (s: string) => helpSrc.indexOf(s);
    check(
      "Hierarchy: urgent pathway is the FIRST section after the intro (أ → ب → ج)",
      idxOf("أ. محتاج مساعدة عاجلة — أعمل إيه؟") > -1 &&
        idxOf("ب. متى أطلب مساعدة متخصصة؟") >
          idxOf("أ. محتاج مساعدة عاجلة") &&
        idxOf("ج. أبدأ البحث عن مختص منين؟") >
          idxOf("ب. متى أطلب مساعدة متخصصة؟")
    );
    const urgentCard = helpSrc.slice(
      idxOf("أ. محتاج مساعدة عاجلة"),
      idxOf("ب. متى أطلب مساعدة متخصصة؟")
    );
    check(
      "Hierarchy: the 16328 call CTA lives inside the first section (reachable before any guidance)",
      /href=\{`tel:\$\{n\}`\}/.test(urgentCard)
    );
    const disclosures = helpSrc.match(/<HelpDisclosure\b/g) ?? [];
    check(
      "Progressive disclosure: exactly 3 secondary sections, collapsed by default (aria-expanded wiring, no defaultOpen)",
      disclosures.length === 3 &&
        helpSrc.includes("aria-expanded={open}") &&
        helpSrc.includes("useState(false)") &&
        !helpSrc.includes("defaultOpen")
    );
    check(
      "Link outcome: platform-unavailability note is user-facing Arabic (no raw 401 text in the screen)",
      helpSrc.includes("{PLATFORM_UNAVAILABLE_NOTE}") &&
        helpDataSrc.includes("مش متاحة") &&
        !helpSrc.includes("401")
    );
    check(
      "More sheet: emergency tile spans the full grid width (col-span-2 + sm:col-span-3)",
      /col-span-2[^\n]*sm:col-span-3/.test(shellSrc) &&
        shellSrc.includes("تدخّل دلوقتي")
    );
  }

  // C5: store — reset clears every device-local user-content key. A1 moved
  // the key removal into erase.ts (allowlist-based, honest failure
  // reporting), so the old source-string contract ("resetApp body calls
  // clearLastOpen()") pins a stale implementation shape. The contract is
  // now verified BEHAVIORALLY: the real store runs against the localStorage
  // shim and must erase the last-open stamp AND the values draft while
  // keeping the (defaulted) state key and unrelated keys intact.
  const storeModule = await import("../src/lib/app/store");
  const useAppStore = storeModule.useAppStore;
  // store.ts persists via the bare `localStorage` global (zustand); mirror
  // the shim onto it so the real persistence path writes to the same map.
  (globalThis as Record<string, unknown>).localStorage = (
    (globalThis as { window: { localStorage: Storage } }).window.localStorage
  );
  shimStore.set("istiaada-last-open-v1", new Date().toISOString());
  shimStore.set("istiaada-values-draft-v1", JSON.stringify([{ value: "قيمة", sentence: "جملة" }]));
  shimStore.set("unrelated-third-party-key", "keep me");
  const resetReport = useAppStore.getState().resetApp();
  check(
    "resetApp clears the last-open stamp (and the values draft, and reports success)",
    resetReport.ok === true &&
      !shimStore.has("istiaada-last-open-v1") &&
      !shimStore.has("istiaada-values-draft-v1") &&
      shimStore.get("unrelated-third-party-key") === "keep me"
  );
  check(
    "resetApp report is honest when storage refuses a removal",
    (() => {
      const realRemove = shimStore.delete.bind(shimStore);
      shimStore.set("istiaada-values-draft-v1", "x");
      // simulate a storage that throws on remove of ONE key
      (globalThis as Record<string, unknown>).window = {
        localStorage: {
          getItem: (k: string) => (shimStore.has(k) ? shimStore.get(k)! : null),
          setItem: (k: string, v: string) => void shimStore.set(k, v),
          removeItem: (k: string) => {
            if (k === "istiaada-values-draft-v1") throw new Error("refused");
            realRemove(k);
          },
          clear: () => void shimStore.clear(),
        },
      };
      const r2 = useAppStore.getState().resetApp();
      // restore the normal shim for subsequent checks
      (globalThis as Record<string, unknown>).window = {
        localStorage: {
          getItem: (k: string) => (shimStore.has(k) ? shimStore.get(k)! : null),
          setItem: (k: string, v: string) => void shimStore.set(k, v),
          removeItem: (k: string) => void shimStore.delete(k),
          clear: () => void shimStore.clear(),
        },
      };
      return r2.ok === false && r2.failed.includes("istiaada-values-draft-v1");
    })()
  );
  check(
    "store: no new persisted AppData fields (backup format untouched)",
    !storeSrc.includes("lastOpen") && !storeSrc.includes("returnState")
  );

  // C6: PriorLessonHint — session dismissal keyed per lesson.
  check(
    "Hint: session-scoped dismissal set keyed by lesson identity",
    hintSrc.includes("const dismissedLessonKeys = new Set<string>()") &&
      hintSrc.includes("${l.source}:${l.ts}:${l.matchedTriggerId}")
  );
  check(
    "Hint: collapsed by default, question not instruction",
    hintSrc.includes("إيه اللي ساعدك توقف السلسلة؟") && hintSrc.includes("aria-expanded={expanded}")
  );
  check(
    "Hint: shows ONLY cut point + lesson — no relapse details",
    !hintSrc.includes("firstSign") && !hintSrc.includes("vulnerabilities") && !hintSrc.includes("escalation")
  );
}

/* ————— D — maintenance fixes (reproduced first, then fixed) ————— */

console.log("D — maintenance fixes");
{
  check(
    "support-person: paragraph-as-placeholder is gone",
    !preventionSrc.includes('placeholder="شخص تثق به — بيظهر زر اتصاله')
  );
  check(
    "support-person: field says what to type (discreet)",
    preventionSrc.includes('placeholder="إزاي تناديه؟ (مش لازم اسم حقيقي)"')
  );
  check(
    "support-person: save button no longer shows the phone-field placeholder",
    !preventionSrc.includes('{data.supportPerson ? "رقمه (يُخزن محليًا بس)" : "حفظ"}')
  );
  const saveBtnArea = preventionSrc.slice(
    preventionSrc.indexOf("setSupportPerson("),
    preventionSrc.indexOf("اتصل بـ")
  );
  check("support-person: honest single verb «حفظ»", saveBtnArea.includes("حفظ"));

  check(
    "progress: trend-as-label («أقل من اللي فات ✓») is gone",
    !progressSrc.includes('label="أقل من اللي فات')
  );
  check(
    "progress: tile is named by its metric",
    progressSrc.includes('label="زَلّات في الأسبوع"')
  );
  check(
    "progress: trend stays in hint + direction",
    progressSrc.includes('"أقل من السابق ✓"')
  );
}

/* ————— E — data integrity ————— */

console.log("E — data integrity");
{
  // The backup surface is untouched: AppData type + validators unchanged.
  const typesSrc = readFileSync("src/lib/app/types.ts", "utf8");
  check(
    "AppData shape unchanged (no new persisted fields)",
    !typesSrc.includes("lastOpen") && !typesSrc.includes("returnCard") && !typesSrc.includes("helpSeen")
  );
  const backupSrc = readFileSync("src/lib/app/backup.ts", "utf8");
  check(
    "backup validators untouched by this batch",
    backupSrc.includes("BACKUP_SCHEMA_VERSION") &&
      backupSrc.includes("export const APP_VERSION = \"2.3.0\";") &&
      !backupSrc.includes("lastOpen")
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
