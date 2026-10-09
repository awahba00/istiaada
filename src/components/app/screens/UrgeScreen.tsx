"use client";

import { useMemo, useRef, useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NumberScale, ScreenHeader, ChipMultiSelect, InfoNote } from "../shared";
import { InterventionCard } from "../InterventionCard";
import { calculateRisk, riskColorVar } from "@/lib/app/risk-engine";
import { selectIntervention } from "@/lib/app/intervention-engine";
import { nowIso, uid } from "@/lib/app/helpers";
import { TRIGGERS, RISK_LEVELS, ANTI_RATIONALIZATION } from "@/data/app/taxonomy";
import type { Intervention, UrgeCheck as UrgeCheckType } from "@/lib/app/types";
import { Gauge, Siren, ChevronLeft, Eye, MessageCircleQuestion, LifeBuoy } from "lucide-react";

type Phase = "input" | "result" | "intervention" | "outcome";

export function UrgeScreen() {
  const data = useAppStore();
  const addUrgeCheck = useAppStore((s) => s.addUrgeCheck);
  const setUrgeOutcome = useAppStore((s) => s.setUrgeOutcome);
  const logIntervention = useAppStore((s) => s.logIntervention);
  const startEmergency = useAppStore((s) => s.startEmergency);
  const navigate = useAppStore((s) => s.navigate);

  const [phase, setPhase] = useState<Phase>("input");
  // F2 — time-boxed in-flight guard for the record-minting CTAs (the
  // assessment submit and the intervention card's «تم"). React's phase
  // re-render cannot land inside the same tick as a double-tap — and the
  // zustand write is immediate — so a second tap inside the window would
  // mint a duplicate record with the STALE pre-submit state. The window
  // auto-expires: later, genuinely separate intents (a re-check, the card's
  // own «تم» seconds later) submit normally, and a failed submission can
  // never leave the CTA permanently disabled.
  const submitGuardAtRef = useRef(0);
  const [urge, setUrge] = useState(2);
  const [proximity, setProximity] = useState(2);
  const [control, setControl] = useState(2);
  const [alone, setAlone] = useState(false);
  const [lateNight, setLateNight] = useState(false);
  const [inBed, setInBed] = useState(false);
  const [browsingStarted, setBrowsingStarted] = useState(false);
  const [deviceNeededNow, setDeviceNeededNow] = useState(
    data.userProfile.deviceNeeds === "yes"
  );
  const [triggers, setTriggers] = useState<string[]>([]);
  const [savedCheck, setSavedCheck] = useState<UrgeCheckType | null>(null);
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [showAnti, setShowAnti] = useState(false);
  // D — the intervention log written by THIS flow's completion path (the
  // card's own «تم»). Null while the card is merely shown or skipped:
  // navigation is not an outcome, and «هدّت» after a skip must never mint a
  // success for an intervention the user never performed.
  const [performedLogId, setPerformedLogId] = useState<string | null>(null);

  // C1 — derive "the saved check was resolved elsewhere" instead of resetting
  // state in an effect: Emergency Mode closes the originating check when it
  // completes (outcome → "handled"), and "acted" means the user moved to the
  // Relapse Center. In both cases the result/outcome views below are stale
  // verdicts of a situation the user has already dealt with — so the render
  // falls back to a fresh input view instead.
  const savedCheckOutcome = savedCheck
    ? data.urgeChecks.find((c) => c.id === savedCheck.id)?.outcome
    : undefined;
  const checkResolvedExternally =
    savedCheck != null &&
    (savedCheckOutcome === "handled" || savedCheckOutcome === "acted");

  // F10 — a resolved check (handled here, or closed by Emergency Mode /
  // acting) ENDS the situation: the next assessment must start genuinely
  // fresh instead of inheriting the old answers. This is React's sanctioned
  // render-phase state adjustment (conditional + converging — it re-renders
  // immediately, no effect, no stale frame): each resolved check id triggers
  // exactly one reset. Intentional re-checks of the SAME unresolved state
  // («فحص جديد» / re-compute) keep the answers — the user is adjusting them.
  const [resolvedResetId, setResolvedResetId] = useState<string | null>(null);
  if (checkResolvedExternally && savedCheck && resolvedResetId !== savedCheck.id) {
    setResolvedResetId(savedCheck.id);
    setUrge(2);
    setProximity(2);
    setControl(2);
    setAlone(false);
    setLateNight(false);
    setInBed(false);
    setBrowsingStarted(false);
    setDeviceNeededNow(data.userProfile.deviceNeeds === "yes");
    setTriggers([]);
    setIntervention(null);
    setPerformedLogId(null);
    setPhase("input");
  }

  const assessment = useMemo(
    () =>
      calculateRisk({
        urge,
        proximity,
        control,
        context: { alone, lateNight, inBed, browsingStarted, deviceNeededNow },
      }),
    [urge, proximity, control, alone, lateNight, inBed, browsingStarted, deviceNeededNow]
  );

  const contextToggles = [
    { id: "alone", label: "أنا وحدي الآن", value: alone, set: setAlone },
    {
      id: "lateNight",
      label: "الوقت متأخر (بعد ١٠ مساءً)",
      value: lateNight,
      set: setLateNight,
    },
    { id: "inBed", label: "أنا في السرير", value: inBed, set: setInBed },
    {
      id: "browsingStarted",
      label: "بدأت أتصفح أو أدوّر بالفعل",
      value: browsingStarted,
      set: setBrowsingStarted,
    },
    {
      id: "deviceNeededNow",
      label: "أحتاج الجهاز الآن للعمل/الدراسة",
      value: deviceNeededNow,
      set: setDeviceNeededNow,
    },
  ];

  const compute = () => {
    // F2 — one submission intent → at most one record: the time-boxed guard
    // swallows the double-tap window deterministically (the zustand write is
    // immediate, the unmount is not). A SECOND, later intent (user re-opens
    // the form and submits again) is a genuinely new evaluation and still
    // gets its own record.
    const now = Date.now();
    if (now - submitGuardAtRef.current < 800) return;
    submitGuardAtRef.current = now;
    const check: UrgeCheckType = {
      id: uid("uc-"),
      ts: nowIso(),
      urge,
      proximity,
      control,
      context: { alone, lateNight, inBed, browsingStarted, deviceNeededNow },
      riskLevel: assessment.level,
      triggers,
    };
    addUrgeCheck(check);
    setSavedCheck(check);
    setPhase("result");
  };

  const pickIntervention = () => {
    // D — NOTHING is logged on entry. The recommendation is logged only when
    // the user completes it via the card's own «تم» (completeIntervention).
    // A shown-but-skipped card leaves no trace in history: no log, no recency
    // penalty, no success — nothing to pollute the selection history.
    const iv = selectIntervention({
      riskLevel: assessment.level,
      triggerIds: triggers,
      context: { alone, lateNight, inBed, browsingStarted, deviceNeededNow },
      data,
    });
    setIntervention(iv);
    setPhase("intervention");
  };

  // D — the ONLY path that writes an intervention log in this flow: the
  // card's own completion button (the user's «تم» = performed). F2 — the
  // same time-boxed guard: a double-tap on «تم» must not mint two logs;
  // this is a SEPARATE intent from the submit seconds earlier, so the window
  // (not a boolean) is what keeps both intents working.
  const completeIntervention = () => {
    const now = Date.now();
    if (now - submitGuardAtRef.current < 800) return;
    submitGuardAtRef.current = now;
    if (intervention) {
      const id = uid("ivl-");
      logIntervention({
        id,
        ts: nowIso(),
        interventionId: intervention.id,
        riskLevel: assessment.level,
        source: "urge-check",
      });
      setPerformedLogId(id);
    }
    setPhase("outcome");
  };

  // D — skip: straight to reassessment with NO log and NO success. The
  // outcome screen still honestly asks «الخطر هبط ولا لسه؟» — answering it
  // is the user's report about the SITUATION, not about an intervention.
  const skipIntervention = () => {
    setPerformedLogId(null);
    setPhase("outcome");
  };

  const finishOutcome = (outcome: "handled" | "escalated" | "acted") => {
    if (savedCheck) setUrgeOutcome(savedCheck.id, outcome);
    if (outcome === "acted") {
      setPerformedLogId(null);
      navigate("relapse");
      return;
    }
    if (outcome === "escalated") {
      setPerformedLogId(null);
      // F4 — a REAL reported degree from THIS flow's assessment: the
      // emergency overlay may honestly show «درجة الحالة: N من 5».
      startEmergency({
        riskLevel: assessment.level,
        triggers,
        workSafe: deviceNeededNow,
        assessed: true,
      });
      return;
    }
    // handled — success is written ONLY for the log created by THIS flow's
    // completion path (never «whatever log happens to be last» — the old
    // slice(-1) heuristic could mark an unrelated old log successful after
    // a skipped card).
    if (performedLogId) {
      useAppStore.getState().setInterventionSuccess(performedLogId, true);
    }
    setPerformedLogId(null);
    // F10 — handled ends the situation: the derived reset above fires on
    // the next render (the store now marks the check "handled") and
    // starts a genuinely fresh assessment.
    setPhase("input");
  };

  // ————— INPUT PHASE —————
  // (Also the fallback view whenever the saved check was resolved elsewhere —
  // see checkResolvedExternally above.)
  if (phase === "input" || (checkResolvedExternally && phase !== "intervention")) {
    return (
      <div className="space-y-5">
        <ScreenHeader
          title="فحص الرغبة"
          subtitle="بدأت الرغبة؟ افحص اللي حاصل — عشان تعرف أنسب خطوة. الرغبة إحساس، مش أمر."
          icon={<Gauge className="size-5" />}
        />
        <NumberScale
          label="١ · شدة الرغبة"
          value={urge}
          onChange={setUrge}
          low="هادية تقريبًا"
          high="أقصى ما أعرفه"
        />
        <NumberScale
          label="٢ · قد إيه إنت قريب من التنفيذ"
          value={proximity}
          onChange={setProximity}
          low="بعيد خالص"
          high="على وشك التنفيذ"
        />
        <NumberScale
          label="٣ · السيطرة على نفسك"
          value={control}
          onChange={setControl}
          low="سيطرتي كاملة"
          high="بالعافية أقدر أوقف نفسي"
        />

        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">السياق دلوقتي (اختياري لكنه مفيد جدًا)</div>
            <div className="flex flex-wrap gap-2">
              {contextToggles.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={t.value}
                  onClick={() => t.set(!t.value)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    t.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <details className="group rounded-2xl border border-border bg-card">
          <summary
            className="flex cursor-pointer select-none items-center justify-between gap-2 px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden"
          >
            {/* A3 — the collapsed label must say WHAT this section is for
                (identifying the urge's triggers). The old label «بعيد خالص"
                was a copy-paste of the proximity scale's low anchor and told
                the user nothing. Phrasing matches the Quick Log's trigger
                step («إيه اللي بدأ الموضوع؟») so one vocabulary runs
                across the product. Optional on purpose — collapsed by
                default, never required to compute the risk score. */}
            <span className="flex min-w-0 flex-wrap items-center gap-2">
              إيه اللي بدأ الرغبة دي؟ (اختياري)
              {/* F9 — the selection state must stay visible when the section
                  is COLLAPSED: a quiet count chip beside the label. English
                  digits per the two-scope screens' degree convention. */}
              {triggers.length > 0 && (
                <span
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-2xs font-bold text-primary"
                  aria-label={`${triggers.length} محفزات محددة`}
                >
                  محدد: {triggers.length}
                </span>
              )}
            </span>
            <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-open:-rotate-90" />
          </summary>
          <div className="px-5 pb-5">
            <ChipMultiSelect
              size="sm"
              options={TRIGGERS.map((t) => ({ id: t.id, label: t.label }))}
              value={triggers}
              onChange={setTriggers}
            />
          </div>
        </details>

        <p className="pb-1 text-center text-xs leading-relaxed text-muted-foreground">
          التقديرات دي منك عن لحظتك، على سلم من ١ لـ ٥ — مش قياس طبي ولا تنبؤ مضمون.
        </p>

        {/* Sticky compute CTA — always reachable without scrolling (I1):
            under stress the user must see the next action immediately. The
            label frames the payoff (the right step), not the math.
            F1 — the wrapper is pointer-events-none and only the button
            re-enables hits: the old full-band gradient intercepted taps
            meant for chips partially visible beneath it — the exact
            "tap a chip, submit a check" accident. The button stays the
            only opaque, honest hit target. The offset is chrome-aware
            (safe area + the rem-scaled bottom-nav band) instead of a
            single-viewport magic number, and the button height flexes
            (F6/F7) so large text sizes wrap instead of clipping. */}
        <div className="pointer-events-none sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] z-10 -mx-1 bg-gradient-to-t from-background from-60% to-transparent px-1 pt-4 pb-1 lg:bottom-6">
          <Button
            size="lg"
            className="pointer-events-auto h-auto min-h-14 w-full whitespace-normal text-base font-bold shadow-xl"
            onClick={compute}
          >
            اعرف أنسب خطوة
          </Button>
        </div>
      </div>
    );
  }

  // ————— RESULT PHASE —————
  if (phase === "result") {
    const rl = RISK_LEVELS[assessment.level - 1];
    const mode = assessment.recommendedMode;
    // E — from degree 3 up, the recommended STEP is the headline and the
    // numeric degree demotes to context (the guidance directs; the number
    // only alarms). Below 3 the calm presentation stays untouched.
    const urgent = assessment.level >= 3;
    const riskColor = riskColorVar(assessment.level);
    return (
      <div className="space-y-5">
        <div
          className={`flex flex-col items-center gap-3 rounded-3xl border bg-card p-6 text-center ${
            assessment.level >= 4
              ? "border-destructive/50"
              : assessment.level === 3
                ? "border-warning/50"
                : "border-border"
          }`}
        >
          {urgent ? (
            <>
              <div className="text-sm leading-relaxed text-muted-foreground">
                {/* F4 — English digits in the degree display of the two
                    experiences («5 من 5», never the mixed «5 من ٥»). */}
                درجة حالتك الآن:{" "}
                <b className="tnum" style={{ color: riskColor }}>
                  {assessment.level} من 5
                </b>{" "}
                · {rl.label}
              </div>
              <div aria-hidden="true" className="h-px w-16 bg-border" />
              <div className="text-xs font-bold text-muted-foreground">أنسب خطوة الآن</div>
              <div className="text-3xl font-black leading-tight" style={{ color: riskColor }}>
                {assessment.modeLabel}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">درجة حالتك الآن</div>
              <div
                className="tnum text-6xl font-black leading-none"
                style={{ color: riskColor }}
              >
                {assessment.level}
                <span className="text-2xl text-muted-foreground"> من 5</span>
              </div>
              <div className="text-lg font-bold" style={{ color: riskColor }}>
                {rl.label}
              </div>
            </>
          )}
          <p className="text-sm leading-relaxed text-muted-foreground">{rl.description}</p>
          {rl.examples && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {/* F12 — «فتحت المصدر بالفعل» asserts the user ALREADY started
                  browsing. Show it only when they said so; otherwise the
                  example would gaslight a user who hasn't opened anything.
                  The rationalization example («آخر مرة وأوقف») stays — it is
                  state-agnostic. */}
              {rl.examples
                .filter((e) => e !== "فتحت المصدر بالفعل" || browsingStarted)
                .map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-warning/10 px-3 py-1 text-xs text-warning"
                  >
                    {e}
                  </span>
                ))}
            </div>
          )}
          {!urgent && (
            <div className="rounded-full bg-muted px-4 py-1.5 text-xs font-semibold">
              أنسب خطوة الآن: {assessment.modeLabel}
            </div>
          )}
        </div>

        {/* I7: the number is a self-reported indicator — say so right where
            the number is shown, in plain words (not jargon). */}
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          الدرجة دي تقدير مبني على إجاباتك دلوقتي على سلم من ١ لـ ٥ — بتساعدك تختار
          خطوتك، ومش قياس طبي ولا تنبؤ مضمون.
        </p>

        {/* Mode-appropriate response — higher degree, fewer choices */}
        {mode === "awareness" && (
          <div className="space-y-4">
            <InfoNote tone="success">
              {assessment.level === 1
                ? "ولا حاجة ملحّة دلوقتي — أكمل يومك الطبيعي."
                : "بداية بسيطة — إحساس، مش أمر. ما تطعمهاش بانتباه زايد، واكمل يومك."}
            </InfoNote>
            <Card>
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-center gap-2 font-semibold">
                  <Eye className="size-4 text-primary" />
                  علامات مبكرة تستحق الانتباه
                </div>
                <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                  <li>• تفتكر مشاهد أو تبدأ تسرح بخيالك</li>
                  <li>• تتصفح من غير هدف أو تعمل «بصة سريعة»</li>
                  <li>• تمسك الهاتف بشكل تلقائي وقت الفراغ</li>
                  <li>اختار درجتك في الأسئلة الثلاثة فوق الأول</li>
                </ul>
                <Button
                  variant="outline"
                  className="h-auto min-h-9 w-full whitespace-normal"
                  onClick={() => navigate("knowledge")}
                >
                  اقرأ موضوعًا من قاعدة المعرفة
                </Button>
              </CardContent>
            </Card>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // F10 — intentional re-check of the SAME unresolved state:
                // answers are deliberately KEPT (the user adjusts them).
                setPhase("input");
              }}
            >
              فحص جديد
            </Button>
          </div>
        )}

        {(mode === "interrupt" || mode === "immediate") && (
          <div className="space-y-4">
            <InfoNote tone="warning">
              {mode === "interrupt"
                ? "الرغبة بدأت تقوى — اقطعها دلوقتي وهي لسه صغيرة: خطوة واحدة غالبًا تكفي."
                : "قربت من التصرف؟ ما تحللش دلوقتي — ابدأ التدخل فورًا."}
            </InfoNote>

            {/* Anti-rationalization panel */}
            <Card>
              <CardContent className="space-y-3 pt-5">
                <button
                  type="button"
                  onClick={() => setShowAnti((s) => !s)}
                  className="flex w-full items-center justify-between gap-2 text-start font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircleQuestion className="size-4 text-warning" />
                    صوت التفاوض بدأ يهمس؟ افتح الردود الجاهزة
                  </span>
                  <ChevronLeft
                    className={`size-4 text-muted-foreground transition-transform ${showAnti ? "-rotate-90" : ""}`}
                  />
                </button>
                {showAnti && (
                  <div className="space-y-2">
                    {ANTI_RATIONALIZATION.slice(0, 5).map((a) => (
                      <div
                        key={a.id}
                        className="rounded-xl border border-border bg-background p-3 text-sm"
                      >
                        <div className="font-medium text-muted-foreground">{a.pattern}</div>
                        <div className="mt-1 leading-relaxed font-medium">{a.response}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                // F4 — a real reported degree from THIS check.
                startEmergency({
                  riskLevel: assessment.level,
                  triggers,
                  workSafe: deviceNeededNow,
                  assessed: true,
                })
              }
            >
              <Siren className="size-4" />
              ابدأ وضع الطوارئ بدلًا منه
            </Button>

            {/* E — sticky primary CTA (the input screen's I1 philosophy): at
                the urgent moment the recommended action must be reachable
                WITHOUT scrolling — it never depends on how much content sits
                above it. F1 — pointer-events pass through the gradient band
                to whatever sits beneath; only the button takes taps. */}
            <div className="pointer-events-none sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] z-10 -mx-1 bg-gradient-to-t from-background from-60% to-transparent px-1 pt-4 pb-1 lg:bottom-6">
              <Button
                size="lg"
                className="pointer-events-auto h-auto min-h-14 w-full whitespace-normal text-base font-bold shadow-xl"
                onClick={pickIntervention}
              >
                ابدأ التدخل المقترح دلوقتي
              </Button>
            </div>
          </div>
        )}

        {(mode === "emergency" || mode === "maximum") && (
          <div className="space-y-4">
            {mode === "maximum" && (
              // A2 — the early-warning phrase and the action instruction are
              // two separate lines (the old single line glued a stray list
              // bullet «•» onto the bold phrase with no separation, reading
              // as one garbled sentence). Sign first, action under it.
              <InfoNote tone="danger">
                <span className="block font-semibold">
                  افتكر مشاهد أو تطوير خيال
                </span>
                <span className="mt-1.5 block">
                  اضغط الزر وابدأ أول خطوة قطع دلوقتي.
                </span>
              </InfoNote>
            )}
            {mode === "emergency" && (
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                هنعرض لك خطوات قليلة وواضحة بس — كل ما الخطر يعلى، الخيارات تقل.
              </p>
            )}
            {/* E — sticky primary: the degree-4+ recommended action stays
                reachable without scrolling, mirroring I1. F7 — the
                highest-priority emergency CTA flexes (min-height, wrapping,
                padded) so 320px + 150% text wraps to two honest lines
                instead of clipping; F1 — the gradient band passes taps
                through, only the button takes them. */}
            <div className="pointer-events-none sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] z-10 -mx-1 bg-gradient-to-t from-background from-60% to-transparent px-1 pt-4 pb-1 lg:bottom-6">
              <Button
                size="lg"
                variant="destructive"
                className="pointer-events-auto h-auto min-h-16 w-full whitespace-normal py-4 text-lg font-bold"
                onClick={() =>
                  // F4 — a real reported degree from THIS check.
                  startEmergency({
                    riskLevel: assessment.level,
                    triggers,
                    workSafe: deviceNeededNow,
                    assessed: true,
                  })
                }
              >
                <Siren className="size-6 shrink-0" />
                تدخّل دلوقتي — وضع الطوارئ
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ————— INTERVENTION PHASE —————
  if (phase === "intervention" && intervention) {
    // C — the heading must tell the truth about THIS moment's degree: a
    // level-4 user just read «قربت من التصرف؟ ما تحللش دلوقتي» on the result
    // screen — this screen must not downgrade the story to the level-3
    // «بدأت تقوى» narrative. Higher urgency → action-first wording, compact
    // timer, less reading. Level-3 keeps its calmer original phrasing.
    const immediate = assessment.recommendedMode === "immediate";
    return (
      <div className="space-y-5">
        <ScreenHeader
          title={
            immediate
              ? "قربت من التصرف — نفّذ التدخل ده دلوقتي، ما تحللش."
              : "الرغبة بدأت بتقوى — اقطعها دلوقتي وهي لسه صغيرة: خطوة قطع واحدة تكفي غالبًا."
          }
          subtitle={
            immediate
              ? "خطوة واحدة بس — اعملها حالًا."
              : "خطوة واحدة بس — مش محتاج تحل كل حاجة دلوقتي."
          }
          icon={<Gauge className="size-5" />}
        />
        <InterventionCard
          iv={intervention}
          compactTimer={immediate}
          onComplete={completeIntervention}
        />
        {/* D — skip: reassess WITHOUT any log or success (see
            skipIntervention). The label describes the actual destination
            (the outcome reassessment), not a «re-check» that never happens. */}
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={skipIntervention}
        >
          تخطّى — راجع حالتك
        </Button>
      </div>
    );
  }

  // ————— OUTCOME PHASE —————
  return (
    <div className="space-y-5">
      <ScreenHeader
        title="بعد التدخل"
        subtitle="الخطر هبط ولا لسه؟"
        icon={<Gauge className="size-5" />}
      />
      <div className="space-y-3">
        <Button
          size="lg"
          variant="outline"
          className="h-auto min-h-14 w-full justify-start gap-3 whitespace-normal border-success/40 py-3 text-start"
          onClick={() => finishOutcome("handled")}
        >
          <Eye className="size-5 text-success" />
          <span>
            {/* A2 — label must describe what the tap DOES: record the wave as
                handled (intervention success + back to the day), matching the
                header question «الخطر هبط ولا لسه؟». The old label was a
                copy-paste of the interrupt-mode CTA («ابدأ التدخل المقترح
                دلوقتي») — an instruction to START, on a screen where the
                intervention is already done. */}
            <b>أيوه — الرغبة هدّت</b>
            <span className="block text-xs font-normal text-muted-foreground">
              ارجع ليومك — الموجة دي اتسجلت وبتتحسب ليك
            </span>
          </span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-auto min-h-14 w-full justify-start gap-3 whitespace-normal border-warning/40 py-3 text-start"
          onClick={() => finishOutcome("escalated")}
        >
          <Siren className="size-5 text-warning" />
          <span>
            <b>لأ، لسه عالية</b>
            <span className="block text-xs font-normal text-muted-foreground">
              نجرب تدخل أقوى — ده طبيعي وجزء من النظام
            </span>
          </span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-auto min-h-14 w-full justify-start gap-3 whitespace-normal py-3 text-start"
          onClick={() => finishOutcome("acted")}
        >
          <LifeBuoy className="size-5" />
          <span>
            {/* A2 — label must describe what the tap DOES: record outcome
                «acted» and move to the «توقّف هنا» screen to quick-log what
                happened. The old label («اضغط الزر وابدأ أول خطوة قطع
                دلوقتي.») was a cutoff instruction pasted onto the honesty
                exit. Phrasing matches EmergencyMode's own link to the same
                screen («حصلت زَلّة؟ ما تكملش — نوقف هنا الأول»). */}
            <b>حصلت زَلّة — نوقف هنا ونسجّلها</b>
            <span className="block text-xs font-normal text-muted-foreground">
              لا عقاب ولا جلد — المهم دلوقتي: ما تكمّلش
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
}
