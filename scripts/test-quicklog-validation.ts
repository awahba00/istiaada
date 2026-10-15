/**
 * F2 — Quick Log validation feedback + save-action usability.
 * Run: bun scripts/test-quicklog-validation.ts
 *
 * Behavioral: exercises the REAL gate the save button enforces — the
 * exported pure functions (quickLogMissing / canSaveQuickLog) from
 * RelapseScreen.tsx and the REAL store save path (addRelapseQuick) —
 * never a re-implementation of the rules. Source-contract checks pin the
 * UI wiring (badges, sticky bar, optional trigger marking).
 *
 * Required set (unchanged semantics): behavior, classification, session
 * length, and Q5 ONLY when it was actually asked (masturbation among
 * behaviors). Triggers never block saving. Future dates are rejected by
 * the date card's own inline rule.
 */
import { readFileSync } from "node:fs";

// ————— in-memory localStorage stub, installed BEFORE the screen import —
// RelapseScreen transitively imports the zustand store; the stub keeps its
// persist middleware on the REAL serialization path (test-relapse-semantics
// pattern).
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
  quickLogMissing,
  canSaveQuickLog,
  missingFieldsLabel,
} = await import("../src/components/app/screens/RelapseScreen");
const { useAppStore } = await import("../src/lib/app/store");
const { dayKey, nowIso } = await import("../src/lib/app/helpers");

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

const relapseSrc = readFileSync(
  "src/components/app/screens/RelapseScreen.tsx",
  "utf8"
);

const empty = {
  behaviors: [] as ("pornography" | "masturbation")[],
  classification: null as "slip" | "relapse" | null,
  time: null as "immediately" | "minutes" | "under-hour" | "longer" | null,
  continued: null as boolean | null,
  date: dayKey(),
};

console.log("== F2: missing-required-field case (the REAL gate) ==");
{
  check(
    "empty form names exactly the three always-required questions (Q5 not asked yet)",
    JSON.stringify(quickLogMissing(empty)) ===
      JSON.stringify(["السلوك اللي حصل", "وصف اللي حصل", "مدة الجلسة"])
  );
  check("empty form cannot save", !canSaveQuickLog(empty));
  check(
    "the missing-fields line enumerates in natural Arabic (و between items)",
    missingFieldsLabel(["السلوك اللي حصل", "مدة الجلسة"]) ===
      "السلوك اللي حصل، ومدة الجلسة"
  );
}

console.log("== F2: progressive completion (behavioral) ==");
{
  const withBehavior = { ...empty, behaviors: ["pornography" as const] };
  check(
    "porn-only draft does NOT ask Q5 (continuation question not required)",
    !quickLogMissing(withBehavior).includes("مرة ولا أكتر؟") &&
      !canSaveQuickLog(withBehavior)
  );
  const withClassification = { ...withBehavior, classification: "slip" as const };
  check(
    "classification answered → only the session length remains",
    JSON.stringify(quickLogMissing(withClassification)) ===
      JSON.stringify(["مدة الجلسة"])
  );
  const complete = { ...withClassification, time: "minutes" as const };
  check(
    "all required answered → save enabled (missing list empty)",
    canSaveQuickLog(complete) && quickLogMissing(complete).length === 0
  );
}

console.log("== F2: optional trigger omission never blocks saving ==");
{
  const completeNoTriggers = {
    ...empty,
    behaviors: ["pornography" as const],
    classification: "relapse" as const,
    time: "longer" as const,
    date: dayKey(),
  };
  // quickLogDraft has NO triggers field at all — the gate never sees them.
  check(
    "the gate is blind to triggers (no triggers field → omission can't block)",
    !("triggers" in empty) && canSaveQuickLog(completeNoTriggers)
  );
  // Behavioral store proof: a trigger-less event saves fine.
  const before = useAppStore.getState().relapseEvents.length;
  useAppStore.getState().addRelapseQuick({
    ts: nowIso(),
    eventDate: dayKey(),
    timeToStop: "longer",
    continued: false,
    triggers: [],
    quickTs: nowIso(),
    classification: "relapse",
    behaviors: ["pornography"],
  });
  check(
    "a real save with zero triggers creates exactly one event",
    useAppStore.getState().relapseEvents.length === before + 1
  );
}

console.log("== F2: both Q5 branches (behavioral) ==");
{
  const masturbationUnanswered = {
    ...empty,
    behaviors: ["masturbation" as const],
    classification: "slip" as const,
    time: "minutes" as const,
    continued: null,
  };
  check(
    "masturbation branch: Q5 is asked and blocks until answered",
    quickLogMissing(masturbationUnanswered).includes("مرة ولا أكتر؟") &&
      !canSaveQuickLog(masturbationUnanswered)
  );
  check(
    "answering Q5 (مرة واحدة) unblocks the save",
    canSaveQuickLog({ ...masturbationUnanswered, continued: false })
  );
  check(
    "answering Q5 (أكتر من مرة) unblocks the save",
    canSaveQuickLog({ ...masturbationUnanswered, continued: true })
  );
  check(
    "both behaviors together still require Q5 once",
    quickLogMissing({
      ...masturbationUnanswered,
      behaviors: ["pornography" as const, "masturbation" as const],
    }).includes("مرة ولا أكتر؟")
  );
  check(
    "dropping masturbation removes the Q5 requirement (porn-only again)",
    !quickLogMissing({
      ...masturbationUnanswered,
      behaviors: ["pornography" as const],
    }).includes("مرة ولا أكتر؟")
  );
}

console.log("== F2: occurrence date rules (behavioral) ==");
{
  const complete = {
    ...empty,
    behaviors: ["pornography" as const],
    classification: "slip" as const,
    time: "minutes" as const,
  };
  const today = dayKey();
  const pastDay = dayKey(new Date(Date.now() - 3 * 86400000));
  const [y, m, d] = today.split("-").map(Number);
  const futureDay = dayKey(new Date(y, m - 1, d + 3));
  check(
    "future date blocks saving even when every question is answered",
    !canSaveQuickLog({ ...complete, date: futureDay })
  );
  check(
    "today saves (default fast path unchanged)",
    canSaveQuickLog({ ...complete, date: today })
  );
  check(
    "past local day saves (backdated event)",
    canSaveQuickLog({ ...complete, date: pastDay })
  );
}

console.log("== F2: real save path semantics (behavioral, store) ==");
{
  const before = useAppStore.getState().relapseEvents.length;
  const id = useAppStore.getState().addRelapseQuick({
    ts: nowIso(),
    eventDate: dayKey(),
    timeToStop: "minutes",
    // Porn-only log: Q5 never asked → schema boolean stays false (no answer
    // to inherit), exactly as before.
    continued: false,
    triggers: ["boredom"],
    quickTs: nowIso(),
    classification: "slip",
    behaviors: ["pornography"],
  });
  const events = useAppStore.getState().relapseEvents;
  const ev = events.find((e) => e.id === id);
  check(
    "a complete quick log saves exactly one event (no duplicates per save)",
    events.length === before + 1 && ev != null
  );
  check(
    "saved event preserves classification + behaviors verbatim",
    ev?.classification === "slip" &&
      ev?.behaviors?.join(",") === "pornography"
  );
  check(
    "porn-only log stores continued=false without a Q5 answer (schema unchanged)",
    ev?.continued === false
  );
  check(
    "saved event starts unreviewed (calm review stays available later)",
    ev?.reviewed === false
  );
}

console.log("== F2: UI wiring contracts (source) ==");
{
  check(
    "the save button stays disabled while required fields are missing",
    /disabled=\{!canSaveQuick\}/.test(relapseSrc)
  );
  check(
    "saveQuick keeps its hard guard — an incomplete draft can never be saved",
    /const saveQuick = \(\) => \{[\s\S]{0,400}?if \(qBehaviors\.length === 0 \|\| qClassification == null\) return;/.test(
      relapseSrc
    )
  );
  check(
    "same-frame double taps are blocked by a re-entry guard (re-armed on every quick-view entry)",
    /const saveQuick = \(\) => \{[\s\S]{0,120}?if \(quickSaveGuard\.current\) return;[\s\S]{0,500}?quickSaveGuard\.current = true;/.test(
      relapseSrc
    ) &&
      /useEffect\(\(\) => \{[\s\S]{0,120}?if \(view === "quick"\) quickSaveGuard\.current = false;[\s\S]{0,60}?\}, \[view\]\);/.test(
        relapseSrc
      )
  );
  check(
    "the gate the button uses is the exported pure function (one truth with the tests)",
    /const canSaveQuick = canSaveQuickLog\(draft\);/.test(relapseSrc)
  );
  check(
    "«مطلوب» badges mark each unanswered required card (behavior, classification, time, Q5)",
    (() => {
      const badgeCount = (relapseSrc.match(/مطلوب\n/g) ?? []).length;
      return (
        badgeCount === 4 &&
        /\{qBehaviors\.length === 0 && \(\s*<span[^>]*>\s*مطلوب/.test(relapseSrc) &&
        /\{qClassification == null && \(\s*<span[^>]*>\s*مطلوب/.test(relapseSrc) &&
        /\{qTime == null && \(\s*<span[^>]*>\s*مطلوب/.test(relapseSrc) &&
        /\{qContinued == null && \(\s*<span[^>]*>\s*مطلوب/.test(relapseSrc)
      );
    })()
  );
  check(
    "the trigger card is explicitly marked اختياري (matching the real rules)",
    // NOTE: the Arabic question mark is NOT backslash-escaped — bun's JSC
    // regex engine treats \؟ as a non-matching identity escape.
    /إيه اللي بدأ الموضوع؟[\s\S]{0,500}اختياري/.test(relapseSrc)
  );
  check(
    "the incomplete-form reason line sits with the save action and names the missing fields",
    /لسه ناقص: \{missingFieldsLabel\(missing\)\}/.test(relapseSrc) &&
      /aria-live="polite"/.test(relapseSrc)
  );
  check(
    "sticky save bar: chrome-aware offset (safe-area + bottom-nav band), same pattern as the Urge flow",
    /sticky bottom-\[calc\(env\(safe-area-inset-bottom,0px\)\+4\.5rem\)\]/.test(
      relapseSrc
    )
  );
  check(
    "the sticky gradient band passes taps through; only the button takes them",
    /pointer-events-none sticky[\s\S]{0,650}?pointer-events-auto/.test(
      relapseSrc
    )
  );
  check(
    "Q5 card stays conditional (shown only when masturbation is logged)",
    /\{asksContinued && \(\s*<Card>/.test(relapseSrc)
  );
  check(
    "no default classification is silently chosen (draft still starts null)",
    /useState<RelapseClassification \| null>\(null\)/.test(relapseSrc)
  );
  check(
    "classification options and behavior options are unchanged",
    relapseSrc.includes('label: "زَلّة"') &&
      relapseSrc.includes('label: "انتكاسة"') &&
      relapseSrc.includes('label: "إباحية"') &&
      relapseSrc.includes('label: "استمناء"')
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
