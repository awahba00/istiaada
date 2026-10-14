# PHASE 2B.1 — RELAPSE / POST-BEHAVIOR SEMANTICS AUDIT

**READ-ONLY. No code, copy, state, data model, analytics, or UI was modified.**

Scope: verify whether the CURRENT implementation can represent the product-language decision:
- زَلّة = a limited occurrence of the target behavior
- انتكاسة = return to the old pattern with continuation and/or repetition
- Intended user-facing occurrence question: «حصلت زلّة؟»

Files inspected (read-only): `src/lib/app/types.ts`, `store.ts`, `progress.ts`, `risk-engine.ts`, `dose-engine.ts`, `scale.ts`, `backup.ts`, `helpers.ts`, `emergency-launcher.ts`, `src/components/app/screens/RelapseScreen.tsx`, `HomeScreen.tsx`, `UrgeScreen.tsx`, `EmergencyMode.tsx`, `ProgressScreen.tsx`, `TriggerMapScreen.tsx`, `DoseScreen.tsx`, `SettingsScreen.tsx`, `PlanScreen.tsx`, `Onboarding.tsx`, `AppShell.tsx`; copy cross-referenced against `phase2a-copy-inventory.md` IDs.

---

## A. Current Relapse Data Model

### A.1 The only post-behavior object: `RelapseEvent`

```ts
interface RelapseEvent {
  id: string;            // "rel-" + uid()
  ts: string;            // ISO — set to nowIso() AT LOGGING TIME
  timeToStop: "immediately" | "minutes" | "under-hour" | "longer";
  continued: boolean;    // comment in types.ts: "second session happened"
  triggers: string[];    // taxonomy trigger ids (multi-select, optional)
  quickTs?: string;      // write-only; always === ts; read by NOTHING
  reviewed: boolean;
  review?: RelapseReview;
}
```

Facts:

- **Exactly one creation site exists in the whole codebase**: `RelapseScreen.saveQuick()` → `store.addRelapseQuick()`. No other screen, engine, or flow creates an event. There is no automatic logging of any kind.
- **`ts` = the moment of LOGGING, not the moment of the behavior.** There is no back-dating UI, API, or field. A user logging an hour later gets an event stamped an hour later.
- **The event is immutable after creation**, except two operations: `completeRelapseReview` (sets `review` + `reviewed: true`) and `deleteRelapse`. There is NO edit path for `timeToStop`, `continued`, `triggers`, or `ts`. The only way to correct a wrong answer is delete + re-log.
- **`quickTs` is dead weight**: written with the same `nowIso()` value as `ts` in the same statement; a full-tree grep finds no reader anywhere.
- **No session, no occurrence count, no duration, no start/end, no event type, no behavior-type field.** The event is a flat, single-row record.

### A.2 The review sub-object

```ts
interface RelapseReview {
  trigger: string;         // single trigger id (only first 12 TRIGGERS offered)
  vulnerabilities: string[];
  firstSign: string;       // warning-sign label or free text
  firstAction: string;
  escalation: string;
  extended: boolean;       // NOT independently asked
  cutPoint: string;
  lesson: string;
}
```

- `extended` is **not a new observation**: `saveReview()` copies `reviewTarget.continued` (RelapseScreen line 130). The review never asks about extension; it inherits the quick-log boolean.
- Minor asymmetry: review step 1 offers `TRIGGERS.slice(0, 12)` while the quick log offers all 24 triggers — same question, different option sets.

### A.3 Adjacent records that are NOT relapse records

- `UrgeCheck.outcome: "acted"` — flips the check's own status and **navigates** to the relapse screen. It creates no event and carries no foreign key to any event.
- `EveningCheckIn` has **no behavior-occurrence field** (highestUrge, mainTrigger, interventionUsed, lesson, changeTomorrow, sleep/stress/loneliness/freeTime). It cannot act as an occurrence fallback.
- `settings.postRelapseSupport` — default `true`, persisted, validated in backup, and **read by nothing**. The Settings screen comment documents the toggle was deliberately removed as a placebo ("post-relapse support with no effect").
- `userProfile.goals` — collected in onboarding (including `reduce-porn`, `reduce-compulsive`), persisted, exported — and consumed by nothing (see D).

### A.4 Persistence & integrity

- Stored in localStorage `istiaada-state-v1` (zustand persist, storage version 2). `partialize` includes `relapseEvents`; the 1–10 → 1–5 scale migration does not touch relapse events (they carry no scale values) — they pass through one-for-one.
- Export/import round-trips the whole array. `checkRelapseEvent` validates `id`, `ts`, the `timeToStop` enum, `continued`, `reviewed`, `triggers` — but the `review` sub-object is **not validated on import** (it passes through an unchecked cast).

---

## B. Current State/Event Flow

### B.1 Entry points — all NAVIGATE ONLY, none log

| Entry | Copy (inventory ID) | What it does |
|---|---|---|
| Home QuickGuide row 4 | «رجعت للسلوك؟ → توقّف هنا» | navigate("relapse") |
| Home high-state quiet link | «رجعت للسلوك؟ ما تكملش…» (HOME-015) | navigate("relapse") |
| Home post-relapse banner | «توقّف هنا» button | navigate("relapse") |
| Urge outcome button | «رجعت للسلوك» (URGE-042) | setUrgeOutcome("acted") + navigate |
| Emergency completion link | «رجعت للسلوك؟…» (EMERGENCY-026) | stopEmergency + navigate |
| Nav (More sheet / sidebar) | «توقّف هنا» (SHARED-001) | navigate("relapse") |

Every path into the post-behavior record goes through the Relapse screen's manual flow. If the user never completes the quick log, the occurrence is invisible to the product.

### B.2 The logging flow

`main` → CTA «رجعت للسلوك الآن» (RELAPSE-003) → 6 stop steps (skippable) → **quick log**:

1. «ما الذي بدأ الأمر؟» — multi-select triggers (optional)
2. «كم استغرق التوقف؟» (RELAPSE-032) — 4 buckets (required)
3. «هل كمّلت بعد أول مرة؟» (RELAPSE-033) — «لا — أوقفت عند أولها» (RELAPSE-034) / «نعم، استمرت الجلسة» (RELAPSE-035) (required)

→ save → **ONE `RelapseEvent` appended** → reframe screen («بعد التعثر: تذكير مهم») → optional calm review (6 steps) now or later.

### B.3 Home state machine

`currentHomeState()`: **post-relapse** if the last event's `ts` is within 48h AND `!reviewed`. This outranks urge-derived states. The Home subtitle counter (`daysSinceLastRelapse`) counts from the most recent event's `ts` — i.e., from logging time.

### B.4 Consumers of relapse data

- **progress.ts**: `sessionsStoppedEarly` (timeToStop immediately|minutes), `secondFallPrevented` (count of `!continued`), `avgStopMinutes` (bucket → 2/10/45/120 min), `stopTrend`, `relapsePerWeek` (last 28 days ÷ 4), `relapseTrend` (last 4 weeks vs previous 4 weeks), `daysSinceLastRelapse`; insights: `firstSign`, `bestCutPoint` (from reviews), `topTrigger`, `mostRiskyTime` (event triggers + event ts included).
- **dose-engine.ts**: ANY event within 7 days boosts the relapse (+100), self-compassion (+90), prevention (+60) knowledge categories. DoseScreen note (DOSE-016): «لأن لديك تعثرًا حديثًا…».
- **TriggerMapScreen**: event triggers + event `ts` time-buckets count toward frequencies and «توزيع أوقات الخطر»; total (checks + events) must be ≥ 3 to render the map.
- **RelapseScreen**: pending-review queue, event list badges («استمرت الجلسة» / «أوقف عند حدّه» RELAPSE-016/017), «منع السقوط الثاني» stat.
- **PreventionScreen**: reads NOTHING from relapse events. The only relapse→prevention bridge is `addSuggestedRule()` inside the review wizard.
- **Backup**: full array.

---

## C. Case-by-Case Results

Preliminary fact that applies to EVERY case: the app has no concept of WHICH behavior occurred. Every case, if logged, produces the same generic record.

### Case A — Target: pornography; views once, then stops

- **What is created**: ONE `RelapseEvent` — but only IF the user voluntarily walks the flow and presses save. Nothing is created automatically; no automatic detection exists anywhere.
- **State/UI result**: Home switches to the `post-relapse` state (≤ 48h, until review completes); a pending-review card appears on the Relapse screen; the reframe screen shows immediately after saving; Progress counts 1 event, `secondFallPrevented` +1 (if answered «لا»), and a `timeToStop` bucket.
- **One event or multiple**: exactly one, per save.
- **Session concept**: none. The word «جلسة» in the copy (RELAPSE-035/016) is phrasing over this same single event.
- **Extended-session concept**: none as an object — only the `continued` boolean.
- **Second-fall concept**: none as an object. "Second fall" exists only as the user's negative answer to «هل كمّلت بعد أول مرة؟» and as the derived count `secondFallPrevented`.
- **What creates another event**: nothing but the user re-running the flow. The CTA is always available; nothing blocks, merges, or deduplicates.
- **Timestamp stored**: `nowIso()` at save — logging time, not viewing time.
- **Continuation vs new occurrence**: distinguished only by the user's single boolean answer at logging time. There is no temporal logic comparing events.

### Case B — Target: masturbation; once, then stops

**Byte-identical to Case A.** `userProfile.goals` is never consulted by the logger, the engines, or any screen. No field, tag, or flag distinguishes this record from Case A's.

### Case C — Target includes both; views pornography, does not masturbate

**Identical generic event.** The app cannot represent "which sub-behavior occurred": no target-behavior identity exists in the data model, the event has no behavior-type field, and the onboarding goals that could have carried this information are inert data (see D). A porn-only occurrence, a masturbation-only occurrence, and a both occurrence produce indistinguishable records.

### Case D — Behavior once, then continues later in the same period

The outcome depends entirely on WHEN the user logs:

- **Logs after the whole period**: one event with `continued: true` («نعم، استمرت الجلسة»). The continuation is folded into the single event as a boolean. No second event, no count, no gap, no duration.
- **Logs after the first occurrence, then continues**: the first event is already saved with `continued: false` and is immutable. The only way to record the continuation is to run the flow again → a SECOND, unrelated event. Result: two events whose relationship (continuation of the same episode) is represented nowhere; `secondFallPrevented` counts +1 for the first event even though the second fall did happen.

**Consequence**: the same physical reality produces either 1 event (`continued: true`) or 2 events (both counted in `relapsePerWeek`) depending on logging timing. Continuation vs new occurrence is never distinguished by logic — only by one self-report at one moment.

### Case E — Behavior on Monday and again on Tuesday

- **If logged separately** (Monday evening, Tuesday evening): TWO separate, unrelated events, each stamped with its own logging moment.
- **Representation**: two separate events — the last of the task's four options. Never one extended event (no aggregation exists), never one relapse period (no such object). They are independent rows with no linkage.
- **Metrics effect**: `relapsePerWeek` counts 2; `daysSinceLastRelapse` counts from Tuesday's `ts`; `stopTrend` averages both time-to-stop buckets; dose engine boosts relapse content for 7 days from each.
- **If Monday's occurrence is only logged on Tuesday**: back-dating is impossible — `ts` = Tuesday. Monday's occurrence either never gets its own dated record or is silently absorbed into Tuesday's event.
- **No daily-recurrence concept**: nothing keys relapse events by calendar day (`dayKey` is used for check-ins/plans/dose only). Two events on the same calendar day are just two rows.

### Case F — Multiple times in one continuous episode

- **One event if logged once.** `continued: true` is the closest signal, but its question wording («هل كمّلت بعد أول مرة؟» — did you continue after the first time) semantically describes a *resumed* second session, not an *unbroken* episode. The app cannot tell the two apart.
- **No occurrence count, no duration, no start/end.** `timeToStop` describes stopping the whole episode.

---

## D. Target Behavior Logic

- Onboarding step 1 («لماذا تستخدم التطبيق؟») is **multi-select with 7 options**, including:
  - `reduce-porn` — «أريد تقليل أو إيقاف استخدام الإباحية» (explicit pornography)
  - `reduce-compulsive` — «أريد تقليل سلوك جنسي قهري» (generic; the nearest option to masturbation — there is NO explicit masturbation option)
- **Can the app distinguish pornography from masturbation?** In *data collection*, partially: `reduce-porn` is explicit; masturbation is only reachable through the generic `reduce-compulsive`. In *product behavior*, not at all.
- **Can the user select both?** Yes — the step is multi-select, so `reduce-porn` + `reduce-compulsive` can coexist in `userProfile.goals`.
- **Does state store the choice?** Yes: `userProfile.goals: string[]`, persisted in localStorage and round-tripped through backup (structure-validated as a string array).
- **Is the relapse logger aware of it?** **No.** A full-tree grep shows the ONLY consumers of `goals` are the onboarding form itself and backup structure validation. No engine (risk, intervention, dose, progress), no screen, and no logger reads them. Even the onboarding final summary screen echoes `difficultTimes` (step 2), not goals.
- **Does the app treat all behavior as one generic «السلوك»?** **Yes.** Every occurrence question («رجعت للسلوك؟» on 6 surfaces) and every record is behavior-agnostic.

---

## E. Multi-Day / Continuation Logic

**Monday occurrence + Tuesday occurrence is currently represented as: two separate unrelated events** (when logged separately) — the last of the four offered options.

- Never one extended event: no aggregation, clustering, or grouping of events exists anywhere.
- Never one relapse period: no such object exists in the data model or business logic.
- Unrelated: no linkage field, no episode id, no chain. Each event is an independent row.
- The only cross-time logic that exists at all: `relapsePerWeek` (count of events in the last 28 days ÷ 4) and `relapseTrend` (last-4-weeks count vs previous-4-weeks count). Both are **display aggregates over raw event counts** — no clustering, no linkage, no classification, no threshold semantics. They cannot distinguish "two isolated زلات" from "one انتكاسة in progress".
- Continuation exists only as the single `continued` boolean captured at logging time (mirrored into `review.extended` at review time).
- Additional structural limitation: since `ts` is logging time and back-dating is impossible, even the *dates* of multi-day patterns are only as accurate as the user's logging discipline.

---

## F. Copy vs Logic Mismatches

Classification: **A** = backed by actual product logic · **B** = backed by data but differently named · **C** = only a copy metaphor · **D** = ambiguous / unsupported.

| Term | Where it appears (IDs) | Class | What actually backs it |
|---|---|---|---|
| **التعثر** | RELAPSE-012 (سجل التعثرات), RELAPSE-006 (مراجعة تعثر), PROGRESS-007, backup validators («سجل تعثر غير صالح»), KB category label «التعثر» | **A** | The canonical name of `RelapseEvent`. Fully backed: one تعثر = one logged event, everywhere. |
| **الحدث** | RELAPSE-039 («الحدث ده مش بيحدد مستقبلك»), review steps 3–4 («قبل الحدث», «في الحدث») | **C** | A conversational metaphor for the same `RelapseEvent`. No distinct object; used as a softer synonym inside the post-behavior flow. |
| **الحادثة** | Pending-review card body («كل مراجعة تحوّل الحادثة إلى قاعدة وقاية»), KB («الحادثة المسجلة والمراجعة تصبح قاعدة جديدة») | **C** | Copy synonym of الحدث/التعثر. No distinct object. |
| **الجلسة** | RELAPSE-035 («نعم، استمرت الجلسة»), RELAPSE-016 (badge), PROGRESS-017 («جلسات أوقفتها مبكرًا») | **B** | No session entity exists. PROGRESS-017 actually counts *events* with timeToStop immediately/minutes; RELAPSE-035 expresses the `continued` boolean. The "session" is the event, renamed. |
| **جلسة ممتدة** | PROGRESS-020 hint («تعثرات لم تتحول لجلسة ممتدة»), KB («زلة واحدة تتحول لجلسة كاملة») | **B/C** | Backed only by `!continued`. No extension duration, count, or timespan exists — "extension" is a boolean wearing a narrative. |
| **السقوط الثاني** | RELAPSE-010 & PROGRESS-019 («منع السقوط الثاني»), KB card «أوقف السقوط الثاني أولًا», anti-rationalization «التعثر لا يحتاج إلى سقوط ثانٍ» | **B** | `secondFallPrevented` = count of events with `continued === false`. It is a *within-event* property ("did not continue"), not a separate event or object; the metric counts events, not prevented falls. |
| **السلوك** | RELAPSE-002/003, HOME-026/HOME-015, EMERGENCY-026, URGE-042, SHARED-001, PROGRESS-024 («تكرار السلوك») | **A/D** | As "the behavior happened" (the entry question) — fully backed by the flow. As "THE target behavior" — unsupported: no target-behavior object exists, goals are inert, and PROGRESS-024 is just `relapsePerWeek`. |
| **الانتكاس** | KB cards only: «الفرق بين الزلة والانتكاس» («الزلة حادثة مفردة، والانتكاس عودة النمط القديم»), «يتحول الانحدار العابر إلى انتكاس فعلي» | **C** | Educational copy only. Zero flow UI, zero logic, zero data. Notably, the KB **already articulates exactly the distinction the product owner has now decided** — while no product object computes or records it. |
| **الزلة / زَلّة** | KB cards only («بعد أي زلة…», «زلة واحدة تتحول لجلسة كاملة», «الزلة حدث… والاستمرار قرار», «مهما تكرر الزلة») | **C** | Educational copy only. Never appears in any flow UI (flows use التعثر / رجعت للسلوك). No data object. The intended question «حصلت زلّة؟» exists nowhere in the current product. |

**Headline mismatch**: the app's own Knowledge Base *teaches* the زلة/انتكاسة distinction as the correct mental model, while the data model, the logging flow, and every metric ignore it entirely. The educational layer promises a semantic the logic layer does not practice.

---

## G. Can Current Logic Support «زَلّة vs انتكاسة»?

**Direct answer: NO — not as defined.** One half of the distinction is approximately representable today; the other half has no representation at all.

**What the current model CAN express:**

- A limited occurrence that was stopped: an event with `continued: false` plus a `timeToStop` bucket is a rough approximation of a زلة — one logged episode, stopped at its limit, not continued.
- Continuation *within or about the logged episode*: the `continued` boolean — ambiguous between an unbroken multi-occurrence episode and a resumed second session (Case F), and unstable with respect to logging timing (Case D).

**What the current model CANNOT express (and the owner's definitions require):**

1. **انتكاسة as "return to the old pattern with continuation and/or repetition"** — repetition across events has NO representation: no linkage, no clustering window, no recurrence object, no classification. The only repetition-adjacent number is `relapsePerWeek`, a display aggregate with no semantic threshold. Two events in two days and ten events in ten days are both just "N rows".
2. **No event typing** — nothing on the record says "this was a زلة or an انتكاسة", and no derivation rule exists to compute it from history.
3. **No target-behavior identity** — Case C (viewed porn, did not masturbate, both are targets) is unrepresentable; the event cannot say which behavior occurred.
4. **No behavior timestamp** — `ts` is logging time; same-day grouping is approximate, back-dating impossible.
5. **The intended entry question «حصلت زلّة؟» does not exist** — the current occurrence question is «رجعت للسلوك؟» across 6 surfaces (HOME-026, HOME-015, EMERGENCY-026, RELAPSE-002, RELAPSE-023, URGE-042, SHARED-001).
6. **The distinction currently lives only in KB educational copy** — the KB teaches it; the flows and the data model do not practice it.

**Verdict for Phase 2C planning**: Arabic copy alone cannot deliver the زلة/انتكاسة distinction. Copy can relabel what exists (e.g., render `continued: false` events as «زلّة»), but the انتكاسة side of the decision requires semantics that do not exist yet (repetition/window logic, event typing, or user self-declaration) — see H and I.

---

## H. Missing Product Semantics

Exactly what is absent, mapped against the owner's definitions (facts only — no solutions proposed):

1. **Event classification** — no زلة/انتكاسة field on the record, and no derivation rule from history.
2. **Repetition semantics** — no cross-event linkage, no clustering window, no recurrence detection; events are independent rows. Nothing can say "this is the third one this week" as a *classification*, only as a display count.
3. **Continuation semantics** — one ambiguous boolean that (a) conflates a continuous multi-occurrence episode with a resumed second session, (b) depends on logging timing (Case D), and (c) is immutable after save.
4. **Occurrence count / duration within an episode** — absent entirely (no count, no start, no end, no duration).
5. **Target-behavior identity** — onboarding goals are collected then ignored; events carry no behavior type; pornography vs masturbation vs both is indistinguishable in any record (Case C).
6. **Behavior time vs logging time** — `ts` is the save moment; there is no back-dating.
7. **Urge→event linkage** — the "acted" outcome navigates but records no data connection between the urge check and any resulting event (no foreign key).
8. **Occurrence fallback** — the evening check-in has no "did it happen" field; occurrences the user never logs are invisible to the product.
9. **`postRelapseSupport` is dead data** — persisted, validated, default true, read by nothing; the natural hook for differentiated post-behavior support currently does nothing.
10. **`review.extended` is a copy of `continued`**, not an independent observation — the review cannot capture what the quick log missed.

### H.2 Impact map — per current concept → affected surfaces

| Concept | Home | Stop/Post-behavior | Progress | Trigger Map | Prevention | Daily Dose | Knowledge | Backup/restore |
|---|---|---|---|---|---|---|---|---|
| `RelapseEvent` («التعثر») | post-relapse state (48h × unreviewed), subtitle daysSinceLastRelapse | whole flow creates & reads it | 8 metrics + 3 insights | trigger counts, time buckets, ≥3-events threshold | (indirect only) | 7-day content boost + DOSE-016 note | «التعثر» KB category boosted | full array round-trips; core fields validated |
| `continued` («استمرت الجلسة») | — (via post-relapse state) | quick-log Q3 (RELAPSE-033/034/035), list badge (RELAPSE-016/017) | `secondFallPrevented`, PROGRESS-019/020 | — | — | — | — | boolean validated |
| `timeToStop` («سرعة التوقف») | — | quick-log Q2 (RELAPSE-032), list chip | `avgStopMinutes`, `stopTrend`, `sessionsStoppedEarly` (PROGRESS-017/022/023, RELAPSE-007/008) | — | — | — | — | enum validated |
| `triggers` («المحفزات») | — | quick-log Q1, review step 1 | `triggerAwareness`, `topTrigger` | frequencies, category grouping | — | trigger-tag matching (14 days) | item `tags` | array validated |
| `review` («المراجعة الهادئة») | pending-review drives the post-relapse state's 48h window | review wizard, pending queue | `firstSign`, `bestCutPoint` insights | first-sign display, best-cut-point display | suggested-rule creation (`addSuggestedRule`) | — | — | **NOT validated on import** |
| `userProfile.goals` (target behavior) | — | never read | never read | never read | never read | never read (only `supportPrefs` is) | never read | structure-validated only |
| `settings.postRelapseSupport` | — | — | — | — | — | — | — | boolean validated; **dead** |

---

## I. Decisions Required From Product Owner

Only questions that genuinely require a product decision (no implementation proposals):

**D-01 — Occurrence unit**
- CONCEPT: what one `RelapseEvent` represents
- CURRENT OPTIONS: (a) one logging run = one event (today: any number of occurrences may be folded into one row); (b) one behavioral occurrence = one event; (c) one episode = one event with an occurrence count
- AFFECTED IDs: RELAPSE-033/034/035, PROGRESS-017/019/020/024
- QUESTION: "Is one recorded event one occurrence, one episode, or one logging run? This determines the meaning of every count-based metric."

**D-02 — Definition of continuation**
- CONCEPT: `continued` currently conflates an unbroken multi-occurrence episode with a stopped-then-resumed session
- CURRENT OPTIONS: (a) keep them merged as one flag; (b) treat only the resumed session as "continuation"; (c) treat both but record them differently
- AFFECTED IDs: RELAPSE-033, RELAPSE-035, PROGRESS-020
- QUESTION: "For the زلة/انتكاسة distinction, are 'several times in one unbroken episode' and 'stopped, then did it again later' the same thing?"

**D-03 — The زلة → انتكاسة boundary**
- CONCEPT: what converts a limited occurrence into a return of the pattern
- CURRENT OPTIONS: (a) user self-declares at logging; (b) system derives from repetition within a time window (window length undefined); (c) derived from `continued`; (d) a combination
- AFFECTED IDs: PROGRESS-024 (`relapsePerWeek` is the only existing repetition signal), the whole Stop/Post-behavior flow
- QUESTION: "What exactly makes an event an انتكاسة rather than a زلة — declaration, repetition count in which window, continuation, or a combination?"

**D-04 — Who classifies**
- CONCEPT: no classification field exists
- CURRENT OPTIONS: user-declared at logging / system-derived from history / both with an override
- AFFECTED IDs: all relapse-flow copy (RELAPSE-001…054), Progress labels
- QUESTION: "Does the user label each event as زلة or انتكاسة, or does the app infer it, or both?"

**D-05 — Target-behavior identity**
- CONCEPT: goals collected but inert; no behavior field on events
- CURRENT OPTIONS: (a) keep all behavior generic («السلوك»); (b) define targets from onboarding goals and record which behavior occurred per event; (c) ask per-event only
- AFFECTED IDs: Onboarding STEP1 (`reduce-porn`, `reduce-compulsive`), Case C representation
- QUESTION: "Should the app know which behavior(s) are the target — and should each event record which one occurred? Should masturbation exist as an explicit option?"

**D-06 — Behavior timestamp**
- CONCEPT: `ts` is logging time; no back-dating
- CURRENT OPTIONS: keep logging time / add a behavior-time field (with back-dating) / both
- AFFECTED IDs: all `ts` consumers (Trigger Map time buckets, daysSinceLastRelapse, dose 7-day window, 48h post-relapse state)
- QUESTION: "Should the recorded time be when the behavior happened rather than when it was logged?"

**D-07 — Event mutability**
- CONCEPT: events are immutable except review-completion and deletion
- CURRENT OPTIONS: keep immutable / allow correction of `continued` & `timeToStop` after save
- AFFECTED IDs: RELAPSE-016/017 badges, Case D scenario
- QUESTION: "Can the user correct an event after saving — e.g., a زلة that later continued?"

**D-08 — Urge→event linkage**
- CONCEPT: the «رجعت للسلوك» urge outcome navigates only
- CURRENT OPTIONS: keep navigation-only / auto-create the event on confirmation
- AFFECTED IDs: URGE-042
- QUESTION: "Should confirming the behavior from an urge check create the post-behavior record automatically, or stay a hand-off?"

**D-09 — Metric recasting under the new semantics**
- CONCEPT: every relapse metric currently counts raw events
- CURRENT OPTIONS: count زلات only / انتكاسات only / all events with separate labels
- AFFECTED IDs: PROGRESS-007/017/019/020/022/023/024, RELAPSE-007/008/010/011
- QUESTION: "Under زلة vs انتكاسة, what should each existing metric count — and which labels change meaning as a result?"

**D-10 — Fate of `postRelapseSupport`**
- CONCEPT: dead field (persisted, validated, never read; toggle removed from Settings as a placebo)
- CURRENT OPTIONS: wire it to differentiated post-زلة vs post-انتكاسة support / remove it from the schema
- AFFECTED IDs: `settings.postRelapseSupport`, Settings copy note
- QUESTION: "Should post-behavior support differ between زلة and انتكاسة — and if not, is this field removed?"



