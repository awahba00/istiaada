"use client";

import { useMemo, useState } from "react";
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
    const iv = selectIntervention({
      riskLevel: assessment.level,
      triggerIds: triggers,
      context: { alone, lateNight, inBed, browsingStarted, deviceNeededNow },
      data,
    });
    setIntervention(iv);
    logIntervention({
      id: uid("ivl-"),
      ts: nowIso(),
      interventionId: iv.id,
      riskLevel: assessment.level,
      source: "urge-check",
    });
    setPhase("intervention");
  };

  const finishOutcome = (outcome: "handled" | "escalated" | "acted") => {
    if (savedCheck) setUrgeOutcome(savedCheck.id, outcome);
    if (outcome === "acted") {
      navigate("relapse");
      return;
    }
    if (outcome === "escalated") {
      startEmergency({
        riskLevel: assessment.level,
        triggers,
        workSafe: deviceNeededNow,
      });
      return;
    }
    // handled — mark intervention success (read fresh state, not stale render data)
    const lastLog = useAppStore.getState().interventionLogs.slice(-1)[0];
    if (lastLog) {
      useAppStore.getState().setInterventionSuccess(lastLog.id, true);
    }
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
          low="هادئة تقريبًا"
          high="أقصى ما أعرفه"
        />
        <NumberScale
          label="٢ · مدى قربك من التنفيذ"
          value={proximity}
          onChange={setProximity}
          low="بعيد تمامًا"
          high="على وشك التنفيذ"
        />
        <NumberScale
          label="٣ · فقدان السيطرة"
          value={control}
          onChange={setControl}
          low="سيطرتي كاملة"
          high="بالكاد أقدر أوقف نفسي"
        />

        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">السياق الآن (اختياري لكنه مفيد جدًا)</div>
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
            <span>بعيد خالص</span>
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
            label frames the payoff (the right step), not the math. */}
        <div className="sticky bottom-20 z-10 -mx-1 bg-gradient-to-t from-background from-60% to-transparent px-1 pt-4 pb-1 lg:bottom-6">
          <Button size="lg" className="h-14 w-full text-base font-bold shadow-xl" onClick={compute}>
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
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center">
          <div className="text-sm text-muted-foreground">درجة حالتك الآن</div>
          <div
            className="tnum text-6xl font-black leading-none"
            style={{ color: riskColorVar(assessment.level) }}
          >
            {assessment.level}
            <span className="text-2xl text-muted-foreground"> من ٥</span>
          </div>
          <div className="text-lg font-bold" style={{ color: riskColorVar(assessment.level) }}>
            {rl.label}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{rl.description}</p>
          {rl.examples && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {rl.examples.map((e) => (
                <span
                  key={e}
                  className="rounded-full bg-warning/15 px-3 py-1 text-xs text-warning"
                >
                  {e}
                </span>
              ))}
            </div>
          )}
          <div className="rounded-full bg-muted px-4 py-1.5 text-xs font-semibold">
            أنسب خطوة الآن: {assessment.modeLabel}
          </div>
        </div>

        {/* I7: the number is a self-reported indicator — say so right where
            the number is shown, in plain words (not jargon). */}
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          الدرجة دي تقدير مبني على إجاباتك الآن على سلم من ١ لـ ٥ — تساعدك تختار
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
                  علامات مبكرة تستحق اليقظة
                </div>
                <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                  <li>• تذكّر مشاهد أو تطوير خيال</li>
                  <li>• تصفح بلا هدف أو «نظرة سريعة»</li>
                  <li>• التقاط الهاتف آليًا وقت الفراغ</li>
                  <li>اختار درجتك في الأسئلة الثلاثة فوق الأول</li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("knowledge")}
                >
                  اقرأ موضوعًا من قاعدة المعرفة
                </Button>
              </CardContent>
            </Card>
            <Button variant="outline" className="w-full" onClick={() => setPhase("input")}>
              فحص جديد
            </Button>
          </div>
        )}

        {(mode === "interrupt" || mode === "immediate") && (
          <div className="space-y-4">
            <InfoNote tone="warning">
              {mode === "interrupt"
                ? "الرغبة بدأت تقوى — اقطعها الآن وهي لسه صغيرة: خطوة قطع واحدة تكفي غالبًا."
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
                    صوت التفاوض يهمس؟ افتح الردود الجاهزة
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

            <Button size="lg" className="w-full" onClick={pickIntervention}>
              ابدأ التدخل المقترح الآن
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                startEmergency({
                  riskLevel: assessment.level,
                  triggers,
                  workSafe: deviceNeededNow,
                })
              }
            >
              <Siren className="size-4" />
              ابدأ وضع الطوارئ بدلًا منه
            </Button>
          </div>
        )}

        {(mode === "emergency" || mode === "maximum") && (
          <div className="space-y-4">
            {mode === "maximum" && (
              <InfoNote tone="danger">
                <b>• افتكر مشاهد أو تطوير خيال</b> اضغط الزر وابدأ أول خطوة قطع الآن.
              </InfoNote>
            )}
            <Button
              size="lg"
              variant="destructive"
              className="h-16 w-full text-lg font-bold"
              onClick={() =>
                startEmergency({
                  riskLevel: assessment.level,
                  triggers,
                  workSafe: deviceNeededNow,
                })
              }
            >
              <Siren className="size-6" />
              تدخّل الآن — وضع الطوارئ
            </Button>
            {mode === "emergency" && (
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                سنعرض لك خطوات قليلة وواضحة فقط — كلما ارتفع الخطر قلّت الخيارات.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // ————— INTERVENTION PHASE —————
  if (phase === "intervention" && intervention) {
    return (
      <div className="space-y-5">
        <ScreenHeader
          title="الرغبة بدأت بتقوى — اقطعها دلوقتي وهي لسه صغيرة: خطوة قطع واحدة تكفي غالبًا."
          subtitle="خطوة واحدة فقط — لا تحتاج حل كل شيء الآن."
          icon={<Gauge className="size-5" />}
        />
        <InterventionCard iv={intervention} onComplete={() => setPhase("outcome")} />
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => setPhase("outcome")}
        >
          تخطي إلى إعادة التقييم
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
          className="h-14 w-full justify-start gap-3 border-success/40 text-start"
          onClick={() => finishOutcome("handled")}
        >
          <Eye className="size-5 text-success" />
          <span>
            <b>ابدأ التدخل المقترح دلوقتي</b>
            <span className="block text-xs font-normal text-muted-foreground">
              ارجع ليومك — الموجة دي مسجّلة وبتتحسب ليك
            </span>
          </span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-14 w-full justify-start gap-3 border-warning/40 text-start"
          onClick={() => finishOutcome("escalated")}
        >
          <Siren className="size-5 text-warning" />
          <span>
            <b>لا، لسه مرتفعة</b>
            <span className="block text-xs font-normal text-muted-foreground">
              نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام
            </span>
          </span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-14 w-full justify-start gap-3 text-start"
          onClick={() => finishOutcome("acted")}
        >
          <LifeBuoy className="size-5" />
          <span>
            <b>اضغط الزر وابدأ أول خطوة قطع دلوقتي.</b>
            <span className="block text-xs font-normal text-muted-foreground">
              لا عقاب ولا جلد — المهم دلوقتي: ما تكمّلش
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
}
