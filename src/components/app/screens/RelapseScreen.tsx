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
  "أغلق اللي قدامك الآن — مهما كان حجمه.",
  "انهض واخرج من المكان فورًا.",
  "متدورش على «بديل» — البديل جزء من نفس الحلقة.",
  "ارجع لأي نشاط طبيعي — أي مهمة صغيرة ملموسة.",
  "متعاقبش نفسك — لا إنهاك ولا حرمان ولا جلد.",
  "التحليل بعدين لما تهدى — دلوقتي: توقف وبس.",
];

const TIME_TO_STOP_OPTIONS: { id: TimeToStop; label: string }[] = [
  { id: "immediately", label: "توقفت فورًا" },
  { id: "minutes", label: "خلال دقائق" },
  { id: "under-hour", label: "أقل من ساعة" },
  { id: "longer", label: "استغرق أكثر" },
];

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
    desc: "مرة محدودة ثم توقفت عندها",
  },
  {
    id: "relapse",
    label: "انتكاسة",
    desc: "شعرت أنني عدت إلى النمط القديم",
  },
];

const classificationLabel = (e: RelapseEvent): string | null =>
  e.classification === "slip" ? "زَلّة" : e.classification === "relapse" ? "انتكاسة" : null;

const behaviorsLabel = (e: RelapseEvent): string | null => {
  if (!e.behaviors || e.behaviors.length === 0) return null;
  if (e.behaviors.length === 2) return "حسّيت أنني عدت إلى النمط القديم";
  return BEHAVIOR_OPTIONS.find((b) => b.id === e.behaviors![0])?.label ?? null;
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
              {stopStep === 0 ? "أوقفت — الخطوة التالية" : "تم"}
            </Button>
          )}
          <button
            type="button"
            onClick={() => setView("quick")}
            className="mx-auto mt-2 block text-xs text-muted-foreground hover:text-foreground"
          >
            تخطي إلى التسجيل السريع
          </button>
        </div>
      </div>
    );
  }

  // ————— QUICK LOG —————
  if (view === "quick") {
    const canSaveQuick =
      qBehaviors.length > 0 && qClassification != null && qTime != null && qContinued != null;
    return (
      <div className="space-y-5">
        <ScreenHeader
          title="تسجيل سريع"
          subtitle="دقيقة واحدة — بلا تفاصيل صريحة. البيانات تصنع خريطتك."
          icon={<LifeBuoy className="size-5" />}
        />
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">ما السلوك الذي حدث؟</div>
            <div className="flex flex-wrap gap-2">
              {BEHAVIOR_OPTIONS.map((o) => (
                <Chip
                  key={o.id}
                  label={o.label}
                  selected={qBehaviors.includes(o.id)}
                  onClick={() =>
                    setQBehaviors((prev) =>
                      prev.includes(o.id)
                        ? prev.filter((b) => b !== o.id)
                        : [...prev, o.id]
                    )
                  }
                />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              اختر كل ما حدث — الاثنين معًا إن كانا معًا.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">كيف تصف ما حدث؟</div>
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
              تصنيفك أنت — التطبيق لا يقرر عنك.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">ما الذي بدأ الأمر؟</div>
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
            <div className="text-sm font-semibold">كم استغرق التوقف؟</div>
            <div className="flex flex-wrap gap-2">
              {TIME_TO_STOP_OPTIONS.map((o) => (
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
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="text-sm font-semibold">هل كمّلت بعد أول مرة؟</div>
            <div className="flex gap-2">
              <Chip label="تصنيفك أنت — التطبيق مش هو اللي يقرر عنك." selected={qContinued === false} onClick={() => setQContinued(false)} />
              <Chip label="نعم، استمرت الجلسة" selected={qContinued === true} onClick={() => setQContinued(true)} />
            </div>
          </CardContent>
        </Card>
        <Button size="lg" className="w-full" onClick={saveQuick} disabled={!canSaveQuick}>
          حفظ ومتابعة
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
          title="بعد ما حدث: تذكير مهم"
          subtitle="اقرأها بهدوء ثم عد إلى يومك."
          icon={<ShieldCheck className="size-5" />}
        />
        <div className="space-y-3">
          {[
            "اللي حصل مش بيحدد مستقبلك.",
            "لا — وقّفت عند أولها",
            "اللي حصل مش يوم ضايع، ولا إذن بالتكملة — الوقفة دلوقتي قرار جديد.",
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
            سجّلناها كانتكاسة. الوقفة هنا — رغم كل شيء — خطوة قائمة بذاتها، ومؤشراتك
            محفوظة. المراجعة الهادئة تنتظرك هنا لاحقًا، لما تهدأ.
          </InfoNote>
        ) : (
          <InfoNote>
            سجّلناها كزَلّة — ومؤشراتك محفوظة:{" "}
            {savedEvent?.timeToStop === "immediately"
              ? "اقرأها براحة ثم عد إلى يومك."
              : "وقفت — وكل وقفة بتتحسب ليك"}
            . المراجعة الهادئة تنتظرك هنا لاحقًا، لما تكون مستعدًا.
          </InfoNote>
        )}
        <div className="space-y-2.5">
          <Button size="lg" className="w-full" onClick={() => setView("main")}>
            العودة إلى يومي الطبيعي
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => relapseId && openReview(relapseId)}
          >
            <BookOpen className="size-4" />
            حلّل بهدوء الآن (إن كنت مستعدًا)
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
          title="المراجعة الهادئة تنتظرك هنا بعد كده، لما تكون مستعدًا."
          subtitle="الهدف مش «ليه أنا ضعيف» — الهدف: نلاقي أبكر نقطة كان ممكن توقف عندها."
          icon={<BookOpen className="size-5" />}
        />
        <StepDots total={totalSteps} current={reviewStep} />

        {reviewStep === 0 && (
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="font-semibold">١ · ما الذي بدأ الأمر؟</div>
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
              <div className="font-semibold">٢ · ما الذي جعل المقاومة أضعف يومها؟</div>
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
              <div className="font-semibold">٣ · ما أول علامة ظهرت قبل السلوك؟</div>
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
                placeholder="٢ · إيه اللي خلّى المقاومة أضعف يومها؟"
                className="min-h-16 text-sm"
              />
            </CardContent>
          </Card>
        )}

        {reviewStep === 3 && (
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="font-semibold">٤ · ما أول فعل قادك إلى السلوك؟</div>
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
              <div className="font-semibold">٥ · في أي لحظة كبر الأمر؟</div>
              <Textarea
                value={rEscalation}
                onChange={(e) => setREscalation(e.target.value)}
                placeholder="مثال: بقيت في الغرفة بدل الخروج، و«دقيقة واحدة» صارت جلسة…"
                className="min-h-20 text-sm"
              />
            </CardContent>
          </Card>
        )}

        {reviewStep === 5 && (
          <Card>
            <CardContent className="space-y-4 pt-5">
              <div className="font-semibold">
                ٦ · أين كان يمكن التوقف مبكرًا؟ (نقطة القطع الأفضل)
              </div>
              <Textarea
                value={rCutPoint}
                onChange={(e) => setRCutPoint(e.target.value)}
                placeholder="مثال: قبل فتح المتصفح — أو لحظة أول فكرة والانتقال مباشرة…"
                className="min-h-20 text-sm"
              />
              <div className="font-semibold">درس واحد تحفظه:</div>
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
                  أُضيفت القاعدة إلى خطة الوقاية — يمكنك تعديلها هناك متى شئت.
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
        title="أُضيفت القاعدة إلى خطة الوقاية — تقدر تعدّلها هناك إمتى شئت."
        subtitle="حصلت زَلّة؟ ما تكملش — إيقاف فوري، وبعدها نفهم اللي حصل بهدوء."
        icon={<LifeBuoy className="size-5" />}
      />

      <Button size="lg" variant="destructive" className="h-16 w-full text-lg font-bold" onClick={startStop}>
        <Siren className="size-6" />
        حصلت الآن — أوقفها هنا
      </Button>

      {pendingReview.length > 0 && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-center gap-2 font-bold">
              <Clock className="size-4 text-warning" />
              مراجعات هادئة بانتظارك ({pendingReview.length})
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              حلّلها حين تهدأ — كل مراجعة بتحوّل اللي حصل إلى قاعدة وقاية جديدة.
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
                  مراجعة {classificationLabel(e) ?? "حصلت زَلّة؟ ما تكملش — إيقاف فوري، وبعدها نفهم اللي حصل براحة."} {arabicDateTime(e.ts)}
                </span>
                <ChevronLeft className="size-4" />
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        <StatTile
          label="حصلت دلوقتي — وقّفها هنا"
          value={
            metrics.avgStopMinutes != null
              ? metrics.avgStopMinutes < 5
                ? "فوري تقريبًا"
                : `~${metrics.avgStopMinutes} دقيقة`
              : "—"
          }
          hint="حلّلها لما تهدأ — كل مراجعة بتحوّل اللي حصل إلى قاعدة وقاية جديدة."
          direction={metrics.stopTrend === "better" ? "up" : undefined}
        />
        <StatTile
          label="أوقفت عند أولها"
          value={metrics.secondFallPrevented != 0 ? `${metrics.secondFallPrevented}` : "—"}
          hint={`من ${data.relapseEvents.length} في السجل`}
          direction="up"
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
              title="لا سجل بعد"
              body="هذا مكان آمن بلا أحكام: إن حصلت زَلّة أو انتكاسة، ستجد هنا خطوة إيقاف ومراجعة هادئة."
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
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          e.continued ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
                        }`}
                      >
                        {e.continued ? "ده مكان آمن بلا أحكام: إن حصلت زَلّة أو انتكاسة، ستجد هنا خطوة إيقاف ومراجعة هادئة." : "أوقف عند حدّه"}
                      </span>
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
                        حلّل
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
        لا عقاب ولا تعويض قاسٍ بعد ما حدث — الإنهاك والحرمان يزيدان الضيق الذي
        يغذي الدورة نفسها. العودة الهادئة أسرع من العقاب.
      </InfoNote>

      <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate("prevention")}>
        تحديث خطة الوقاية بعد كل زَلّة أو انتكاسة
        <ChevronLeft className="size-4" />
      </Button>
    </div>
  );
}
