"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ScreenHeader,
  InfoNote,
  ChipMultiSelect,
  EmptyState,
  StatTile,
  StepDots,
  Chip,
} from "../shared";
import { nowIso, uid, arabicDateTime } from "@/lib/app/helpers";
import { computeProgress } from "@/lib/app/progress";
import { TRIGGERS, VULNERABILITY_FACTORS, EARLY_WARNING_SIGNS } from "@/data/app/taxonomy";
import type {
  RelapseBehavior,
  RelapseClassification,
  RelapseEvent,
  TimeToStop,
} from "@/lib/app/types";
import {
  LifeBuoy,
  Siren,
  Check,
  Clock,
  ShieldCheck,
  BookOpen,
  ChevronLeft,
  Plus,
  Trash2,
} from "lucide-react";

type View = "main" | "stop" | "quick" | "reframe" | "review";

const STOP_STEPS = [
  "اقفل اللي قدامك دلوقتي — مهما كان حجمه.",
  "قوم واخرج من المكان فورًا.",
  "ما تدورش على «بديل» — البديل جزء من نفس الحلقة.",
  "ارجع لأي نشاط عادي — أي مهمة صغيرة وملموسة.",
  "ما تعاقبش نفسك — لا إنهاك ولا حرمان ولا جلد.",
  "حلّل بعدين لما تهدى — دلوقتي: وقف وبس.",
];

const TIME_TO_STOP_OPTIONS: { id: TimeToStop; label: string }[] = [
  { id: "immediately", label: "وقفت فورًا" },
  { id: "minutes", label: "أقل من 15 دقيقة" },
  { id: "under-hour", label: "أكتر من 15 دقيقة وأقل من ساعة" },
  { id: "longer", label: "ساعة أو أكتر" },
];

// Q4 (session duration) offers exactly these 3 buckets. The legacy
// "immediately" option above is kept ONLY so old history chips still
// resolve — it is never offered to new logs.
const TIME_TO_STOP_QUICK_OPTIONS = TIME_TO_STOP_OPTIONS.filter(
  (o) => o.id !== "immediately"
);

/** Phase 2B.2 — behavior types (user-facing labels, Arabic only). */
const BEHAVIOR_OPTIONS: { id: RelapseBehavior; label: string }[] = [
  { id: "pornography", label: "إباحية" },
  { id: "masturbation", label: "استمناء" },
];

/** Phase 2B.2 — user-chosen classification (never auto-detected). */
const CLASSIFICATION_OPTIONS: {
  id: RelapseClassification;
  label: string;
  desc: string;
}[] = [
  {
    id: "slip",
    label: "زَلّة",
    desc: "مرة محدودة وبعدها وقفت",
  },
  {
    id: "relapse",
    label: "انتكاسة",
    desc: "حسّيت إني رجعت للنمط القديم",
  },
];

const classificationLabel = (e: RelapseEvent): string | null =>
  e.classification === "slip" ? "زَلّة" : e.classification === "relapse" ? "انتكاسة" : null;

const behaviorsLabel = (e: RelapseEvent): string | null => {
  if (!e.behaviors || e.behaviors.length === 0) return null;
  const labels = e.behaviors
    .map((b) => BEHAVIOR_OPTIONS.find((o) => o.id === b)?.label)
    .filter((l): l is string => l != null);
  return labels.length > 0 ? labels.join(" + ") : null;
};

/** Q5 (continuation) chip for history — rendered ONLY for events where the
 *  question was actually asked (masturbation among behaviors). Porn-only
 *  events were never asked → no chip. Legacy events without behaviors keep
 *  displaying their stored value. */
const continuedLabel = (e: RelapseEvent): string | null => {
  if (e.behaviors && e.behaviors.length > 0 && !e.behaviors.includes("masturbation")) {
    return null;
  }
  return e.continued ? "أكتر من مرة" : "مرة واحدة";
};

export function RelapseScreen() {
  const data = useAppStore();
  const addRelapseQuick = useAppStore((s) => s.addRelapseQuick);
  const completeRelapseReview = useAppStore((s) => s.completeRelapseReview);
  const addRule = useAppStore((s) => s.addRule);
  const navigate = useAppStore((s) => s.navigate);

  const [view, setView] = useState<View>("main");
  const [stopStep, setStopStep] = useState(0);
  const [relapseId, setRelapseId] = useState<string | null>(null);

  // quick log — Phase 2B.2: behavior + classification first, then the
  // existing episode details. All of it resets after save so the next
  // entry starts fresh (never inherits the previous answers).
  const [qBehaviors, setQBehaviors] = useState<RelapseBehavior[]>([]);
  const [qClassification, setQClassification] = useState<RelapseClassification | null>(null);
  const [qTriggers, setQTriggers] = useState<string[]>([]);
  const [qContinued, setQContinued] = useState<boolean | null>(null);
  const [qTime, setQTime] = useState<TimeToStop | null>(null);

  // review
  const [reviewStep, setReviewStep] = useState(0);
  const [rTrigger, setRTrigger] = useState("");
  const [rVulns, setRVulns] = useState<string[]>([]);
  const [rFirstSign, setRFirstSign] = useState("");
  const [rFirstAction, setRFirstAction] = useState("");
  const [rEscalation, setREscalation] = useState("");
  const [rCutPoint, setRCutPoint] = useState("");
  const [rLesson, setRLesson] = useState("");
  const [suggestedAdded, setSuggestedAdded] = useState(false);

  const metrics = useMemo(() => computeProgress(data), [data]);
  const events = useMemo(
    () => [...data.relapseEvents].sort((a, b) => (a.ts < b.ts ? 1 : -1)),
    [data.relapseEvents]
  );
  const pendingReview = events.filter((e) => !e.reviewed);
  const reviewTarget: RelapseEvent | null =
    (relapseId ? events.find((e) => e.id === relapseId) : null) ?? pendingReview[0] ?? null;

  const startStop = () => {
    setView("stop");
    setStopStep(0);
  };

  const finishStopSteps = () => {
    setView("quick");
  };

  const saveQuick = () => {
    if (qBehaviors.length === 0 || qClassification == null) return;
    const id = addRelapseQuick({
      ts: nowIso(),
      timeToStop: qTime ?? "minutes",
      // Schema requires a boolean here. When Q5 was never shown (porn-only
      // log) there is no answer to inherit — store false.
      continued: qContinued ?? false,
      triggers: qTriggers,
      quickTs: nowIso(),
      classification: qClassification,
      behaviors: qBehaviors,
    });
    setRelapseId(id);
    // Reset the quick form AFTER the values were saved into the event —
    // the reframe view reads them back from the event itself.
    setQBehaviors([]);
    setQClassification(null);
    setQTriggers([]);
    setQContinued(null);
    setQTime(null);
    setView("reframe");
  };

  const savedEvent = relapseId ? events.find((e) => e.id === relapseId) : undefined;

  const openReview = (id: string) => {
    setRelapseId(id);
    setReviewStep(0);
    setRTrigger("");
    setRVulns([]);
    setRFirstSign("");
    setRFirstAction("");
    setREscalation("");
    setRCutPoint("");
    setRLesson("");
    setSuggestedAdded(false);
    setView("review");
  };

  const saveReview = () => {
    if (!reviewTarget) return;
    completeRelapseReview(reviewTarget.id, {
      trigger: rTrigger,
      vulnerabilities: rVulns,
      firstSign: rFirstSign,
      firstAction: rFirstAction,
      escalation: rEscalation,
      extended: reviewTarget.continued,
      cutPoint: rCutPoint,
      lesson: rLesson,
    });
    setView("main");
  };

  const addSuggestedRule = () => {
    const triggerLabel =
      TRIGGERS.find((t) => t.id === rTrigger)?.label ?? "السياق الذي حدث";
    addRule({
      ifText: `بدأ الأمر من ${triggerLabel}`,
      thenText: `أتدخل مبكرًا: ${rCutPoint || "أغلق المصدر وأغيّر المكان فورًا"}`,
      active: true,
      source: "suggested",
    });
    setSuggestedAdded(true);
  };

  // ————— STOP FLOW —————
  if (view === "stop") {
    return (
      // Top-aligned (no vertical centering) with a sticky bottom action bar —
      // on small phones the STOP CTA must stay visible without scrolling (I3).
      <div className="mx-auto w-full max-w-md px-4 pb-4 pt-6">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <Siren className="size-8" />
          </div>
          <h1 className="text-2xl font-black">حصلت زَلّة؟</h1>
          <p className="mt-2 text-lg font-bold text-destructive">
            ما تكملش — الوقفة هنا أهم خطوة.
          </p>
        </div>
        <div className="space-y-2.5">
          {STOP_STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                i < stopStep
                  ? "border-success/40 bg-success/5"
                  : i === stopStep
                    ? "border-primary/50 bg-primary/5"
                    : "border-border opacity-50"
              }`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                  i < stopStep
                    ? "border-success bg-success text-success-foreground"
                    : "border-border"
                }`}
              >
                {i < stopStep ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <span className="text-sm font-medium leading-relaxed">{s}</span>
            </div>
          ))}
        </div>
        <div className="sticky bottom-20 z-10 mt-6 -mx-2 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-lg backdrop-blur lg:bottom-6">
          {stopStep < STOP_STEPS.length && (
            <Button
              size="lg"
              className="h-14 w-full text-base font-bold"
              onClick={() => {
                if (stopStep + 1 === STOP_STEPS.length) finishStopSteps();
                else setStopStep(stopStep + 1);
              }}
            >
              {stopStep === 0 ? "أوقفت — الخطوة اللي بعدها" : "تم"}
            </Button>
          )}
          <button
            type="button"
            onClick={() => setView("quick")}
            className="mx-auto mt-2 block text-xs text-muted-foreground hover:text-foreground"
          >
            تخطّى للتسجيل السريع
          </button>
        </div>
      </div>
    );
  }

  // ————— QUICK LOG —————
  if (view === "quick") {
    // Q5 «حصل مرة ولا أكتر؟» is only asked when masturbation is among the
    // logged behaviors — porn-only episodes have no continuation question.
    const asksContinued = qBehaviors.includes("masturbation");
    const canSaveQuick =
      qBehaviors.length > 0 &&
      qClassification != null &&
      qTime != null &&
      (!asksContinued || qContinued != null);
    return (
      <div className="space-y-5">
        <ScreenHeader
          title="تسجيل سريع"
          subtitle="دقيقة واحدة — من غير تفاصيل صريحة. بياناتك بتكوّن خريطتك."
          icon={<LifeBuoy className="size-5" />}
        />
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">إيه السلوك اللي حصل؟</div>
            <div className="flex flex-wrap gap-2">
              {BEHAVIOR_OPTIONS.map((o) => (
                <Chip
                  key={o.id}
                  label={o.label}
                  selected={qBehaviors.includes(o.id)}
                  onClick={() =>
                    setQBehaviors((prev) => {
                      const next = prev.includes(o.id)
                        ? prev.filter((b) => b !== o.id)
                        : [...prev, o.id];
                      // Dropping masturbation hides Q5 — purge any stale
                      // answer so it can neither leak into the saved event
                      // nor reappear pre-selected if it is re-added.
                      if (!next.includes("masturbation")) setQContinued(null);
                      return next;
                    })
                  }
                />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              اختار كل اللي حصل — الاتنين مع بعض لو حصلوا.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">إزاي توصف اللي حصل؟</div>
            <div className="space-y-2.5">
              {CLASSIFICATION_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setQClassification(o.id)}
                  aria-pressed={qClassification === o.id}
                  className={`w-full rounded-2xl border p-4 text-start transition-colors ${
                    qClassification === o.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="font-semibold">{o.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{o.desc}</div>
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              التصنيف بتاعك إنت — التطبيق مش هو اللي بيقرر عنك.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">إيه اللي بدأ الموضوع؟</div>
            <ChipMultiSelect
              size="sm"
              options={TRIGGERS.map((t) => ({ id: t.id, label: t.label }))}
              value={qTriggers}
              onChange={setQTriggers}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">الجلسة استمرت قد إيه؟</div>
            <div className="flex flex-wrap gap-2">
              {TIME_TO_STOP_QUICK_OPTIONS.map((o) => (
                <Chip
                  key={o.id}
                  label={o.label}
                  selected={qTime === o.id}
                  onClick={() => setQTime(o.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        {asksContinued && (
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="text-sm font-semibold">حصل مرة ولا أكتر؟</div>
              <div className="flex gap-2">
                <Chip label="مرة واحدة" selected={qContinued === false} onClick={() => setQContinued(false)} />
                <Chip label="أكتر من مرة" selected={qContinued === true} onClick={() => setQContinued(true)} />
              </div>
            </CardContent>
          </Card>
        )}
        <Button size="lg" className="w-full" onClick={saveQuick} disabled={!canSaveQuick}>
          احفظ وكمل
        </Button>
      </div>
    );
  }

  // ————— REFRAME —————
  if (view === "reframe") {
    // Classification-aware confirmation — the approved phrasing describes
    // the EVENT, never the person: «سجّلناها كزَلّة» / «سجّلناها كانتكاسة».
    // Values are read back from the SAVED event (the form state was reset).
    const cls = savedEvent?.classification ?? null;
    return (
      <div className="space-y-5">
        <ScreenHeader
          title="بعد اللي حصل: افتكر حاجة مهمة"
          subtitle="اقراها بهدوء وبعدين ارجع ليومك."
          icon={<ShieldCheck className="size-5" />}
        />
        <div className="space-y-3">
          {[
            "اللي حصل مش بيحدد مستقبلك.",
            // The continuation bullet reflects the actual answer — shown
            // only when Q5 was asked (masturbation among behaviors).
            ...(savedEvent?.behaviors?.includes("masturbation")
              ? [
                  savedEvent.continued
                    ? "أكتر من مرة — بس الوقفة هنا أهم خطوة."
                    : "مرة واحدة — والرجوع بعدها هو المهم.",
                ]
              : []),
            "اللي حصل مش يوم ضاع، ولا إذن بالتكملة — الوقفة دلوقتي قرار جديد.",
            "اللي حصل معلومة — استخدمها في تحسين خطة الأيام الجاية.",
          ].map((t) => (
            <div
              key={t}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-medium leading-relaxed"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-success" />
              {t}
            </div>
          ))}
        </div>
        {cls === "relapse" ? (
          <InfoNote>
            سجّلناها كانتكاسة. الوقفة هنا — رغم كل حاجة — خطوة لها قيمتها، ومؤشراتك
            محفوظة. المراجعة الهادئة مستنياك هنا بعدين، لما تهدى.
          </InfoNote>
        ) : (
          <InfoNote>
            سجّلناها كزَلّة — ومؤشراتك محفوظة:{" "}
            {savedEvent?.timeToStop === "immediately"
              ? "اقراها براحة وبعدين ارجع ليومك."
              : "وقفت — وكل وقفة بتتحسب ليك"}
            . المراجعة الهادئة مستنياك هنا بعد كده، لما تكون مستعد.
          </InfoNote>
        )}
        <div className="space-y-2.5">
          <Button size="lg" className="w-full" onClick={() => setView("main")}>
            الرجوع ليومي الطبيعي
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => relapseId && openReview(relapseId)}
          >
            <BookOpen className="size-4" />
            حلّل بهدوء دلوقتي (لو مستعد)
          </Button>
        </div>
      </div>
    );
  }

  // ————— CALM REVIEW WIZARD —————
  if (view === "review" && reviewTarget) {
    const totalSteps = 6;
    const canNextReview = () => {
      switch (reviewStep) {
        case 0:
          return rTrigger !== "";
        case 1:
          return true;
        case 2:
          return rFirstSign.trim() !== "";
        default:
          return true;
      }
    };
    return (
      <div className="space-y-5">
        <ScreenHeader
          title="المراجعة الهادئة"
          subtitle="الهدف مش «ليه أنا ضعيف» — الهدف إننا نلاقي أبكر نقطة كان ممكن توقف عندها."
          icon={<BookOpen className="size-5" />}
        />
        <StepDots total={totalSteps} current={reviewStep} />

        {reviewStep === 0 && (
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="font-semibold">١ · إيه اللي بدأ الموضوع؟</div>
              <div className="flex flex-wrap gap-2">
                {TRIGGERS.slice(0, 12).map((t) => (
                  <Chip
                    key={t.id}
                    size="sm"
                    label={t.label}
                    selected={rTrigger === t.id}
                    onClick={() => setRTrigger(t.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {reviewStep === 1 && (
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="font-semibold">٢ · إيه اللي خلّى مقاومتك أضعف اليوم ده؟</div>
              <ChipMultiSelect
                size="sm"
                options={VULNERABILITY_FACTORS}
                value={rVulns}
                onChange={setRVulns}
              />
            </CardContent>
          </Card>
        )}

        {reviewStep === 2 && (
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="font-semibold">٣ · إيه أول علامة ظهرت قبل السلوك؟</div>
              <div className="flex flex-wrap gap-2">
                {EARLY_WARNING_SIGNS.map((s) => (
                  <Chip
                    key={s.id}
                    size="sm"
                    label={s.label}
                    selected={rFirstSign === s.label}
                    onClick={() => setRFirstSign(s.label)}
                  />
                ))}
              </div>
              <Textarea
                value={rFirstSign}
                onChange={(e) => setRFirstSign(e.target.value)}
                placeholder="مثال: حسّيت بالملل وفتحت التليفون من غير سبب…"
                className="min-h-16 text-sm"
              />
            </CardContent>
          </Card>
        )}

        {reviewStep === 3 && (
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="font-semibold">٤ · إيه أول فعل وصّلك للسلوك؟</div>
              <Textarea
                value={rFirstAction}
                onChange={(e) => setRFirstAction(e.target.value)}
                placeholder="مثال: فتحت المتصفح وبدأت أدوّر…"
                className="min-h-20 text-sm"
              />
            </CardContent>
          </Card>
        )}

        {reviewStep === 4 && (
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="font-semibold">٥ · إمتى الموضوع كبر؟</div>
              <Textarea
                value={rEscalation}
                onChange={(e) => setREscalation(e.target.value)}
                placeholder="مثال: فضلت في الغرفة بدل ما أخرج، و«دقيقة واحدة» بقت جلسة…"
                className="min-h-20 text-sm"
              />
            </CardContent>
          </Card>
        )}

        {reviewStep === 5 && (
          <Card>
            <CardContent className="space-y-4 pt-5">
              <div className="font-semibold">
                ٦ · فين كان ممكن توقف بدري؟ (نقطة القطع الأفضل)
              </div>
              <Textarea
                value={rCutPoint}
                onChange={(e) => setRCutPoint(e.target.value)}
                placeholder="مثال: قبل ما تفتح المتصفح — أو لحظة أول فكرة والانتقال مباشرة…"
                className="min-h-20 text-sm"
              />
              <div className="font-semibold">درس واحد تفتكره:</div>
              <Textarea
                value={rLesson}
                onChange={(e) => setRLesson(e.target.value)}
                placeholder="جملة واحدة تكفي…"
                className="min-h-16 text-sm"
              />

              {rCutPoint.trim() && !suggestedAdded && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="text-sm font-semibold text-primary">قاعدة وقاية مقترحة</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    إذا بدأ الأمر من{" "}
                    {TRIGGERS.find((t) => t.id === rTrigger)?.label ?? "نفس السياق"} → أتدخل
                    مبكرًا: {rCutPoint}
                  </p>
                  <Button size="sm" className="mt-3 gap-1.5" onClick={addSuggestedRule}>
                    <Plus className="size-4" />
                    أضفها إلى خطة الوقاية
                  </Button>
                </div>
              )}
              {suggestedAdded && (
                <InfoNote tone="success">
                  اتضافت القاعدة لخطة الوقاية — تقدر تعدّلها هناك وقت ما تحب.
                </InfoNote>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => setReviewStep((s) => Math.max(0, s - 1))}
            disabled={reviewStep === 0}
          >
            السابق
          </Button>
          {reviewStep < totalSteps - 1 ? (
            <Button onClick={() => setReviewStep((s) => s + 1)} disabled={!canNextReview()}>
              التالي
            </Button>
          ) : (
            <Button onClick={saveReview}>حفظ المراجعة</Button>
          )}
        </div>
      </div>
    );
  }

  // ————— MAIN VIEW —————
  return (
    <div className="space-y-5">
      <ScreenHeader
        title="حصلت زَلّة؟ ما تكملش — نوقف فورًا، وبعدين نفهم اللي حصل بهدوء."
        icon={<LifeBuoy className="size-5" />}
      />

      <Button size="lg" variant="destructive" className="h-16 w-full text-lg font-bold" onClick={startStop}>
        <Siren className="size-6" />
        حصلت دلوقتي — وقّفها هنا
      </Button>

      {pendingReview.length > 0 && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-center gap-2 font-bold">
              <Clock className="size-4 text-warning" />
              عندك مراجعات هادئة مستنياك ({pendingReview.length})
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              راجعها لما تهدى — كل مراجعة بتحوّل اللي حصل لقاعدة وقاية جديدة.
            </p>
            {pendingReview.slice(0, 3).map((e) => (
              <Button
                key={e.id}
                variant="outline"
                size="sm"
                className="w-full justify-between"
                onClick={() => openReview(e.id)}
              >
                <span>
                  مراجعة {classificationLabel(e) ?? "سجل"} {arabicDateTime(e.ts)}
                </span>
                <ChevronLeft className="size-4" />
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        <StatTile
          label="متوسط مدة الجلسة"
          value={
            metrics.avgStopMinutes != null
              ? metrics.avgStopMinutes < 5
                ? "فوري تقريبًا"
                : `~${metrics.avgStopMinutes} دقيقة`
              : "—"
          }
          hint="راجع اللي حصل بهدوء — كل مراجعة بتديك قاعدة وقاية جديدة."
          direction={metrics.stopTrend === "better" ? "up" : undefined}
        />
        <StatTile
          label="حصلت مرة واحدة"
          value={
            metrics.repetitionKnownEvents > 0 ? `${metrics.secondFallPrevented}` : "—"
          }
          hint={`من ${metrics.repetitionKnownEvents} سجل اتسأل فيه سؤال التكرار`}
          direction={metrics.secondFallPrevented > 0 ? "up" : undefined}
        />
      </div>

      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <BookOpen className="size-4 text-primary" />
            سجل الزلات والانتكاسات
          </div>
          {events.length === 0 ? (
            <EmptyState
              title="مفيش سجل لسه"
              body="ده مكان آمن من غير أحكام: لو حصلت زَلّة أو انتكاسة، هتلاقي هنا خطوة توقف ومراجعة هادئة."
            />
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto pl-1">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background p-3 text-sm"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{arabicDateTime(e.ts)}</div>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {classificationLabel(e) && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            e.classification === "relapse"
                              ? "bg-warning/15 text-warning"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {classificationLabel(e)}
                        </span>
                      )}
                      {behaviorsLabel(e) && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
                          {behaviorsLabel(e)}
                        </span>
                      )}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
                        {TIME_TO_STOP_OPTIONS.find((t) => t.id === e.timeToStop)?.label}
                      </span>
                      {continuedLabel(e) && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            e.continued ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
                          }`}
                        >
                          {continuedLabel(e)}
                        </span>
                      )}
                      {e.reviewed && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
                          مُراجَع
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!e.reviewed && (
                      <Button variant="ghost" size="sm" onClick={() => openReview(e.id)}>
                        راجع
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="حذف السجل"
                      onClick={() => useAppStore.getState().deleteRelapse(e.id)}
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <InfoNote tone="warning">
        لا عقاب ولا تعويض قاسي بعد اللي حصل — الإنهاك والحرمان بيزودوا الضيق اللي
        بيغذي الدائرة نفسها. الرجوع بهدوء أسرع من العقاب.
      </InfoNote>

      <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate("prevention")}>
        تحديث خطة الوقاية بعد كل زَلّة أو انتكاسة
        <ChevronLeft className="size-4" />
      </Button>
    </div>
  );
}
