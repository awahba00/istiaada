"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Countdown } from "../Timer";
import { selectIntervention, selectEscalation } from "@/lib/app/intervention-engine";
import { nowIso, uid } from "@/lib/app/helpers";
import { INTERVENTIONS } from "@/data/app/interventions";
import { PERSONAL_WHY_REASONS, WORK_SAFE_STEPS, SUPPORT_MESSAGE_TEMPLATES } from "@/data/app/taxonomy";
import type { Intervention } from "@/lib/app/types";
import { Siren, Check, Phone, Users, LogOut, ArrowLeft, LifeBuoy } from "lucide-react";

/**
 * Emergency Mode — spec sections 16, 17, 18, 66, 71.
 * Full-screen takeover. Minimal UI. One screen = one action.
 * The higher the degree, the less information and the more direct action.
 *
 * Focus management (P4): the overlay is a proper alertdialog — on every step
 * change it (re)mounts (keyed EmergencyFrame), focuses its PRIMARY action
 * ([data-autofocus] — needed on step 3 where the countdown controls precede
 * the CTA in DOM order), traps Tab/Shift+Tab inside the overlay, and marks
 * the background shell (inert + aria-hidden) so focus can never escape into
 * it. The pre-overlay focus is restored on close. Escape is intentionally NOT
 * bound — exiting happens only through the explicit exit control.
 *
 * ACT-FIRST 4+ (A/B/D):
 *  A — an HONEST exit lives on EVERY step (including 3, 4, the escalated
 *      branch and the terminal state). Exiting performs stopEmergency() ONLY:
 *      no success, no failure, no check closure, no fabricated outcome — the
 *      originating urge check stays exactly as it was (pending/escalated).
 *      The user must never report «الخطر هدي» falsely just to escape.
 *  B — step 3 carries a swap action («مش ممكن دلوقتي — عوّضني بواحد تاني"):
 *      the impossible recommendation is excluded (engine excludeIds) and a
 *      GENUINELY different one is selected. Swapping writes NO log — swapping
 *      is not performing. When candidates run out, a TERMINAL state replaces
 *      the recommendation loop: one default physical action + reassess + the
 *      quiet exit. The old escalation fallback (re-recommend call-person
 *      forever) is gone: selectEscalation's null IS the exhaustion signal.
 *  D — intervention success is written ONLY against THIS session's log
 *      (sessionLogId — created when the user claims «تم» on step 3). The old
 *      «slice(-1)» heuristic could mark an unrelated yesterday log successful
 *      when reassessment is reached without any step-3 «تم» (now possible via
 *      the terminal path).
 */
export function EmergencyMode() {
  const ctx = useAppStore((s) => s.emergencyCtx);
  const data = useAppStore();
  const stopEmergency = useAppStore((s) => s.stopEmergency);
  const logIntervention = useAppStore((s) => s.logIntervention);
  const navigate = useAppStore((s) => s.navigate);

  const riskLevel = ctx?.riskLevel ?? 4;
  const workSafe = ctx?.workSafe ?? data.userProfile.deviceNeeds === "yes";
  const triggers = ctx?.triggers ?? [];
  // Level 5 = على وشك التصرف — the crisis variant of the overlay.
  const maximum = riskLevel >= 5;

  const [step, setStep] = useState(1);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [escalated, setEscalated] = useState(false);
  const [done, setDone] = useState(false);
  // B — terminal state: no genuinely different candidate remains in this
  // session (swap-exhausted or escalation-exhausted).
  const [terminal, setTerminal] = useState(false);
  // D — the log written by THIS session's step-3 «تم» (null until the user
  // claims an intervention was performed). Outcome success is written only
  // against this id — never against "whatever log happens to be last".
  const [sessionLogId, setSessionLogId] = useState<string | null>(null);

  const context = {
    alone: true,
    lateNight: new Date().getHours() >= 22 || new Date().getHours() < 5,
    inBed: false,
    browsingStarted: riskLevel >= 4,
    deviceNeededNow: workSafe,
  };

  // Pure + cheap engine call — computed directly (no memo needed).
  // B — escalation exhaustion is a real answer now: selectEscalation may
  // return null, and null renders the TERMINAL state (the old code silently
  // fell back to re-recommending «call-person» — an endless loop of the same
  // instruction the user already said did not work).
  const intervention: Intervention | null =
    step !== 3
      ? null
      : escalated
        ? selectEscalation(usedIds, {
            riskLevel,
            triggerIds: triggers,
            context,
            data,
          })
        : selectIntervention({
            riskLevel,
            triggerIds: triggers,
            context,
            data,
            excludeIds: usedIds,
          });

  const logUse = (iv: Intervention | null) => {
    if (!iv) return;
    const id = uid("ivl-");
    logIntervention({
      id,
      ts: nowIso(),
      interventionId: iv.id,
      riskLevel,
      source: "emergency",
    });
    // D — remember THIS session's log: the only id success/failure may be
    // written against (see nextFromIntervention).
    setSessionLogId(id);
    setUsedIds((u) => [...u, iv.id]);
  };

  // A — the honest exit, rendered on EVERY step. It does exactly one thing
  // (stopEmergency) and is visually quiet so it never competes with the
  // primary action.
  const exitControl = (
    <button
      type="button"
      onClick={stopEmergency}
      className="mx-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      <LogOut className="size-3.5" />
      خروج من وضع الطوارئ
    </button>
  );

  // B — swap: this recommendation is impossible right now. Exclude it WITHOUT
  // logging (swapping is not performing — no history pollution) and let the
  // recomputation above pick a genuinely different candidate. If nothing
  // remains, fall to the terminal state instead of ever repeating one.
  const swapIntervention = () => {
    if (step !== 3 || !intervention) return;
    const nextUsed = [...usedIds, intervention.id];
    setUsedIds(nextUsed);
    const exhausted = escalated
      ? selectEscalation(nextUsed, { riskLevel, triggerIds: triggers, context, data }) ==
          null
      : !INTERVENTIONS.some((iv) => !nextUsed.includes(iv.id));
    if (exhausted) setTerminal(true);
  };

  const nextFromIntervention = (success: boolean) => {
    const st = useAppStore.getState();
    // D — success/failure is written ONLY against this session's performed
    // log (null when reassessment was reached via swap/terminal without any
    // «تم» — write nothing rather than guess at "the last log").
    if (sessionLogId) st.setInterventionSuccess(sessionLogId, success);
    // Close the originating urge check so neither the Urge screen nor Home
    // keeps showing a stale high-risk state after the emergency resolved.
    // "escalated" checks (the user moved here from Urge Check → "ما زال
    // مرتفعًا") must be closed too — otherwise they stay escalated forever
    // even after a successful emergency, and Home stays red for hours.
    const pending = [...st.urgeChecks]
      .reverse()
      .find(
        (c) =>
          (c.outcome === "pending" ||
            c.outcome === undefined ||
            c.outcome === "escalated") &&
          Date.now() - new Date(c.ts).getTime() < 2 * 3600000
      );
    if (pending) st.setUrgeOutcome(pending.id, success ? "handled" : "escalated");
    if (success) {
      setDone(true);
    } else {
      // B — escalate only while a genuinely different candidate remains;
      // otherwise the terminal state (physical default + human connection).
      // `escalated` stays true in the terminal variant so the support-call
      // section keeps showing — when interventions run out, a person is the
      // honest next step.
      setEscalated(true);
      if (
        selectEscalation(usedIds, { riskLevel, triggerIds: triggers, context, data }) !=
          null
      ) {
        setStep(3);
      } else {
        setTerminal(true);
      }
    }
  };

  // ————— Terminal state (B): no genuinely different candidate left —————
  // One default physical action (no decision, no reading), one reassess
  // CTA, the human-connection option when the escalation context is on, and
  // the quiet honest exit. Reached from swap-exhaustion or escalation-
  // exhaustion; it never re-recommends anything and never loops by itself.
  if (terminal || (step === 3 && escalated && intervention == null)) {
    return (
      <EmergencyFrame maximum={maximum} key="emergency-terminal">
        <Header
          maximum={maximum}
          riskLevel={riskLevel}
          title="مفيش تدخل تاني أعرضه دلوقتي"
        />
        <div className="w-full space-y-6">
          <div className="rounded-2xl border border-destructive/30 bg-background/60 p-5">
            <p className="text-xl font-bold leading-relaxed sm:text-2xl">
              اقفل الجهاز وابعد عن المكان — أي مكان فيه ناس أو حركة.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              دي الخطوة الافتراضية — تعملها من غير ما تقرا أو تقرر حاجة تانية.
            </p>
          </div>
          <Button
            size="lg"
            className="h-16 w-full text-lg font-bold"
            data-autofocus
            onClick={() => {
              setTerminal(false);
              setStep(4);
            }}
          >
            تم — عيد التقييم
          </Button>
          {escalated && <SupportCall />}
          {exitControl}
        </div>
      </EmergencyFrame>
    );
  }

  // ————— Completion screen —————
  if (done) {
    return (
      <EmergencyFrame maximum={maximum} key="emergency-done">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-success/20 text-success">
            <Check className="size-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold">الخطر هدي — كويس</h1>
          <p className="max-w-sm leading-relaxed text-muted-foreground">
            ارجع ليومك الطبيعي. سجّلنا إنك اتعاملت مع الموجة — وده بيتحسب في
            مؤشراتك.
          </p>
          <Button
            size="lg"
            className="w-[min(14rem,100%)]"
            data-autofocus
            onClick={() => {
              stopEmergency();
            }}
          >
            ارجع ليومي
            <ArrowLeft className="size-4" />
          </Button>

          {/* P1 — the personal "why", only where cognitive space exists.
              Completion = the wave passed; the user's own words are the right
              quiet anchor. Never guilt, pressure, or motivational copy —
              and never shown on the level-5 crisis screen. */}
          <PersonalWhy />

          {/* P2 — the post-behavior flow is one honest tap away, without
              assuming anything: this is a question, not a verdict. */}
          <button
            type="button"
            onClick={() => {
              stopEmergency();
              navigate("relapse");
            }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <LifeBuoy className="size-3.5" />
            حصلت زَلّة؟ ما تكملش — نوقف هنا الأول
          </button>
        </div>
      </EmergencyFrame>
    );
  }

  // ————— Step 3: intervention —————
  if (step === 3 && intervention) {
    return (
      <EmergencyFrame
        maximum={maximum}
        key={escalated ? "emergency-escalated" : "emergency-step3"}
      >
        <Header
          maximum={maximum}
          step={escalated ? 4 : 3}
          riskLevel={riskLevel}
          title={escalated ? "تدخل أقوى" : "نفّذ تدخلًا واحدًا"}
        />
        <div className="w-full space-y-4">
          <div className="rounded-2xl border border-destructive/30 bg-background/60 p-5">
            <div className="text-xl font-bold">{intervention.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {intervention.duration} · {intervention.location}
            </div>
            <ol className="mt-4 space-y-2.5">
              {intervention.instructions.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-xs font-bold text-destructive">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
            {intervention.durationSec != null && (
              <div className="mt-5 rounded-xl bg-background p-4">
                <Countdown
                  seconds={intervention.durationSec}
                  autoStart={maximum}
                  onComplete={() => undefined}
                />
              </div>
            )}
          </div>

          {/* data-autofocus: the countdown controls precede this CTA in DOM
              order — without it, initial focus would land on the timer. */}
          <Button
            size="lg"
            className="h-14 w-full text-base font-bold"
            data-autofocus
            onClick={() => {
              logUse(intervention);
              setStep(4);
            }}
          >
            تم — الخطوة اللي بعدها
          </Button>

          {/* B — swap: the recommendation is impossible right now? Get a
              DIFFERENT one. Excluded, never re-recommended this session, and
              NO log is written — swapping is not performing. */}
          <Button
            variant="outline"
            className="h-auto min-h-9 w-full whitespace-normal"
            onClick={swapIntervention}
          >
            مش ممكن دلوقتي — عوّضني بواحد تاني
          </Button>

          {escalated && <SupportCall />}

          {/* A — honest exit: closes the overlay only. */}
          {exitControl}
        </div>
      </EmergencyFrame>
    );
  }

  // ————— Step 4: reassess —————
  if (step === 4) {
    // B — the «لأ» label must not promise a stronger intervention when
    // none remains: the honest answer at exhaustion is the terminal state.
    const escalationLeft =
      selectEscalation(usedIds, { riskLevel, triggerIds: triggers, context, data }) !=
      null;
    return (
      <EmergencyFrame maximum={maximum} key="emergency-step4">
        <Header maximum={maximum} step={4} riskLevel={riskLevel} title="الخطر هدي؟" />
        <div className="w-full space-y-3">
          <Button
            size="lg"
            variant="outline"
            className="h-16 w-full justify-start gap-3 border-success/50 text-start text-base"
            data-autofocus
            onClick={() => nextFromIntervention(true)}
          >
            <Check className="size-6 text-success" />
            أيوه — هدي
          </Button>
          <Button
            size="lg"
            className="h-16 w-full justify-start gap-3 text-start text-base whitespace-normal"
            onClick={() => nextFromIntervention(false)}
          >
            <Siren className="size-6 shrink-0" />
            {escalationLeft ? "لأ — لسه عالي: جرّب تدخل أقوى" : "لأ — لسه عالي"}
          </Button>
        </div>

        {/* P1 — reassessment has enough cognitive space for the user's own
            words. NOT on the level-5 crisis variant (maximum). */}
        {!maximum && <PersonalWhy />}

        {/* A — honest exit: closes the overlay only (the check stays
            exactly as it was — no fabricated outcome). */}
        <div className="mt-4">{exitControl}</div>
      </EmergencyFrame>
    );
  }

  // ————— Steps 1 & 2 —————
  const step1Text = workSafe
    ? "اقفل المصدر دلوقتي: التبويب، التطبيق، أو الصفحة — من غير ما تقرا سطر زيادة."
    : "اقفل المصدر دلوقتي: التبويب، التطبيق، أو الصفحة — من غير ما تقرا سطر زيادة.";
  const step2Text =
    "اخرج من المكان لأي مكان فيه ناس أو حركة — ومش لازم تقول لحد حاجة.";

  return (
    <EmergencyFrame maximum={maximum} key={`emergency-step-${step}`}>
      <Header maximum={maximum} step={step} riskLevel={riskLevel} />
      <div className="w-full space-y-6">
        <div className="rounded-2xl border border-destructive/30 bg-background/60 p-5">
          {step === 1 ? (
            <>
              <p className="text-xl font-bold leading-relaxed sm:text-2xl">{step1Text}</p>
              {workSafe && (
                <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                  {WORK_SAFE_STEPS.slice(1, 5).map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="text-xl font-bold leading-relaxed sm:text-2xl">{step2Text}</p>
          )}
        </div>
        <Button
          size="lg"
          className="h-16 w-full text-lg font-bold"
          data-autofocus
          onClick={() => setStep(step + 1)}
        >
          تم
        </Button>
        {/* A — the same honest exit, already present here before this batch. */}
        {exitControl}
      </div>
    </EmergencyFrame>
  );
}

/**
 * B — human connection, shown in the escalated step-3 variant and in the
 * terminal state reached from escalation exhaustion: when interventions run
 * out, a person is the honest next step. Never on the calm steps.
 */
function SupportCall() {
  const supportPerson = useAppStore((s) => s.supportPerson);
  return (
    <div className="w-full space-y-3 rounded-2xl border border-border bg-background/60 p-4">
      <div className="flex items-center gap-2 font-semibold">
        <Users className="size-4" />
        لو تقدر دلوقتي:
      </div>
      <div className="flex flex-wrap gap-2">
        {supportPerson?.phone && (
          <a
            href={`tel:${supportPerson.phone}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Phone className="size-4" />
            اتصل بـ{supportPerson.label}
          </a>
        )}
        {!supportPerson?.phone && (
          <span className="rounded-xl bg-muted px-3 py-2 text-sm">
            «{SUPPORT_MESSAGE_TEMPLATES[0]}» — ابعتها لأي شخص تثق فيه
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * P1 — the user's personal "why": their own free text first, the chosen
 * reason chips as a fallback, and NOTHING when both are empty (no
 * motivational copy — an invented "why" would betray the moment).
 * Rendered only on screens with cognitive space: the reassessment (when not
 * the level-5 crisis variant) and the completion screen. It stays quiet and
 * personal — never guilt, pressure, or moral judgment.
 */
function PersonalWhy() {
  const why = useAppStore((s) => s.userProfile.why);
  const whyReasons = useAppStore((s) => s.userProfile.whyReasons);

  const text = why.trim();
  if (!text && whyReasons.length === 0) return null;

  return (
    <div className="w-full rounded-2xl border border-primary/25 bg-primary/5 p-4 text-center">
      <div className="text-xs font-bold text-primary">كلماتك أنت</div>
      {text ? (
        <p className="mt-1.5 text-sm font-semibold leading-relaxed">{text}</p>
      ) : (
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {whyReasons.map((r) => {
            const label = PERSONAL_WHY_REASONS.find((p) => p.id === r)?.label ?? r;
            return (
              <span
                key={r}
                className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
              >
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmergencyFrame({
  children,
  maximum = false,
}: {
  children: React.ReactNode;
  maximum?: boolean;
}) {
  // NOTE: the CALL SITES pass a React `key` ("emergency-done" /
  // "emergency-step3" / "emergency-escalated" / "emergency-step4" /
  // "emergency-step-N") so every step change REMOUNTS this component —
  // re-running the focus effect below (refocus the primary action).
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Remember where the user was before the overlay took over.
    const prevActive = document.activeElement as HTMLElement | null;

    // Focus the primary action first (NOT the background) so setting inert
    // on the shell never steals/invalidates the current focus.
    const target =
      root.querySelector<HTMLElement>("[data-autofocus]") ?? root;
    target.focus();

    // Hide the background shell from focus AND from assistive tech.
    const shell = document.getElementById("app-shell-root");
    if (shell) {
      shell.setAttribute("inert", "");
      shell.setAttribute("aria-hidden", "true");
    }

    // Tab / Shift+Tab cycle inside the overlay only.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKeyDown);

    return () => {
      root.removeEventListener("keydown", onKeyDown);
      if (shell) {
        shell.removeAttribute("inert");
        shell.removeAttribute("aria-hidden");
      }
      // Restore the pre-overlay focus (the launcher button, usually).
      if (prevActive && document.contains(prevActive)) prevActive.focus();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
      role="alertdialog"
      aria-modal="true"
      aria-label="وضع الطوارئ"
      tabIndex={-1}
    >
      <div
        className={`pointer-events-none fixed inset-x-0 top-0 h-1.5 ${maximum ? "bg-destructive" : "bg-destructive/70"}`}
      />
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-5 py-10">
        {children}
      </div>
    </div>
  );
}

function Header({
  maximum,
  step,
  riskLevel,
  title,
}: {
  maximum: boolean;
  step?: number;
  riskLevel: number;
  title?: string;
}) {
  return (
    <div className="mb-6 space-y-3 text-center">
      <div className="flex items-center justify-center gap-2">
        <Siren className="size-7 animate-pulse text-destructive" />
        <h1 className={`font-black text-destructive ${maximum ? "text-4xl" : "text-3xl"}`}>
          تدخّل الآن
        </h1>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        ما تحللش دلوقتي.
        <br />
        اعمل الخطوة الحالية بس.
      </p>
      {title && <div className="pt-1 text-xl font-bold">{title}</div>}
      {step != null && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          الخطوة {step} من 4
        </div>
      )}
      <div className="mx-auto w-fit rounded-full bg-destructive/15 px-3.5 py-1 text-xs font-semibold text-destructive">
        درجة الحالة: {riskLevel} من ٥ {maximum ? "— أزمة" : ""}
      </div>
    </div>
  );
}
