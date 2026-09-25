"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChipMultiSelect, StepDots, InfoNote } from "./shared";
import { LogoMark } from "./LogoMark";
import { RestoreBackup } from "./RestoreBackup";
import { ArrowRight, ArrowLeft, ShieldCheck, Compass, Sparkles, RotateCcw } from "lucide-react";
import { PERSONAL_WHY_REASONS } from "@/data/app/taxonomy";
import type { SupportPreference, UserProfile } from "@/lib/app/types";

const STEP1 = [
  { id: "change", label: "أريد تغيير سلوك يؤثر على حياتي" },
  { id: "control", label: "أريد تحكمًا أفضل في الرغبات" },
  { id: "reduce-porn", label: "أريد تقليل أو إيقاف استخدام الإباحية" },
  { id: "reduce-compulsive", label: "أريد تقليل سلوك جنسي قهري" },
  { id: "understand", label: "أريد فهم محفزاتي" },
  { id: "routine", label: "أريد بناء روتين يومي أقوى" },
  { id: "values", label: "أريد دعمًا مبنيًا على قيمي/روحانيتي" },
];

const STEP2 = [
  { id: "late-night", label: "الليل المتأخر" },
  { id: "alone", label: "حين أكون وحدي" },
  { id: "boredom", label: "الملل" },
  { id: "stress", label: "التوتر والضغط" },
  { id: "emotions", label: "المشاعر الصعبة" },
  { id: "free-time", label: "وقت فراغ غير منظم" },
  { id: "device", label: "أثناء استخدام الهاتف/الكمبيوتر" },
  { id: "places", label: "أماكن معينة" },
  { id: "other", label: "أخرى" },
];

const STEP3 = [
  { id: "aimless", label: "تصفح بلا هدف" },
  { id: "memory", label: "تذكّر شيء ما" },
  { id: "fantasy", label: "خيال" },
  { id: "curiosity", label: "فضول" },
  { id: "discomfort", label: "انزعاج انفعالي" },
  { id: "isolation", label: "انعزال" },
  { id: "bed", label: "البقاء في السرير" },
  { id: "search", label: "بحث" },
  { id: "other", label: "أخرى" },
];

const STEP5 = [
  { id: "study", label: "الدراسة" },
  { id: "career", label: "المستقبل المهني" },
  { id: "discipline", label: "الانضباط" },
  { id: "relationships", label: "العلاقات" },
  { id: "health", label: "الصحة البدنية" },
  { id: "spiritual", label: "حياة قيمية/روحية" },
  { id: "time", label: "إدارة الوقت" },
  { id: "focus", label: "التركيز" },
];

const STEP6: { id: SupportPreference; label: string }[] = [
  { id: "science", label: "المحتوى العلمي المبسّط" },
  { id: "practical", label: "استراتيجيات عملية مباشرة" },
  { id: "psychological", label: "توجيه نفسي/سلوكي" },
  { id: "spiritual", label: "تأمل قيمي وروحي" },
  { id: "mixed", label: "مزيج من كل ذلك" },
];

export function Onboarding() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  // -1 = welcome screen (new user vs restore backup), 0..7 = wizard steps.
  const [step, setStep] = useState(-1);
  const [goals, setGoals] = useState<string[]>([]);
  const [difficultTimes, setDifficultTimes] = useState<string[]>([]);
  const [patterns, setPatterns] = useState<string[]>([]);
  const [deviceNeeds, setDeviceNeeds] = useState<"yes" | "no" | "sometimes">("sometimes");
  const [buildGoals, setBuildGoals] = useState<string[]>([]);
  const [supportPrefs, setSupportPrefs] = useState<SupportPreference[]>(["mixed"]);
  const [why, setWhy] = useState("");
  const [whyReasons, setWhyReasons] = useState<string[]>([]);

  const total = 8;
  const inWizard = step >= 0;
  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return goals.length > 0;
      case 1:
        return difficultTimes.length > 0;
      case 2:
        return patterns.length > 0;
      case 4:
        return buildGoals.length > 0;
      default:
        return true;
    }
  }, [step, goals, difficultTimes, patterns, buildGoals]);

  const finish = () => {
    const profile: UserProfile = {
      goals,
      difficultTimes,
      patterns,
      deviceNeeds,
      buildGoals,
      supportPrefs,
      why: why.trim(),
      whyReasons,
    };
    completeOnboarding(profile);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <LogoMark className="size-7" />
        </div>
        <div>
          <div className="text-lg font-bold leading-tight">استعادة</div>
          <div className="text-xs text-muted-foreground">نظام شخصي لاستعادة التحكم</div>
        </div>
      </div>

      {/* ————— Welcome: new user vs restore backup ————— */}
      {step === -1 && (
        <div className="flex flex-1 flex-col justify-center">
          <div className="space-y-5">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <LogoMark className="size-10" />
              </div>
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">
                أهلًا بيك في «استعادة»
              </h1>
              <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
                نظام شخصي بيساعدك تفهم لحظاتك الصعبة وتوقف السلوك قبل ما بيبدأ — بخطوات
                عملية، من غير أحكام.
              </p>
            </div>

            <div className="space-y-2.5 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="size-5 text-success" />
                بياناتك على جهازك بس
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                من غير حساب، ولا خادم، ولا إرسال لأي مكان — كل حاجة بتتخزن محليًا في متصفحك،
                وتقدر تصدّرها كنسخة احتياطية وقت ما تحب.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                size="lg"
                className="h-14 w-full text-lg font-bold"
                onClick={() => setStep(0)}
              >
                <Sparkles className="size-5" />
                ابدأ كمستخدم جديد
              </Button>
              <div className="flex items-center gap-3" aria-hidden="true">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">أو</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="rounded-2xl border border-dashed border-border p-4">
                <div className="mb-1.5 flex items-center gap-2 font-semibold">
                  <RotateCcw className="size-4 text-primary" />
                  مش أول مرة تستخدم التطبيق؟ استعد بياناتك
                </div>
                <p className="mb-3.5 text-xs leading-relaxed text-muted-foreground">
                  عندك نسخة احتياطية من جهاز تاني؟ استرجعها دلوقتي وهتفتح البيانات مباشرة —
                  من غير تهيئة تاني.
                </p>
                <RestoreBackup hasExistingData={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {inWizard && (
        <div className="mb-8">
          <StepDots total={total} current={step} />
        </div>
      )}

      <div className="flex-1">
        {step === 0 && (
          <StepWrap
            title="إنت بتستخدم التطبيق ليه؟"
            subtitle="اختر كل ما ينطبق — اختياراتك هنا تخصّص نظامك."
          >
            <ChipMultiSelect options={STEP1} value={goals} onChange={setGoals} />
          </StepWrap>
        )}

        {step === 1 && (
          <StepWrap
            title="إمتى تكون الأمور أصعب عادة؟"
            subtitle="تقدر تختار أكثر من خيار."
          >
            <ChipMultiSelect
              options={STEP2}
              value={difficultTimes}
              onChange={setDifficultTimes}
            />
          </StepWrap>
        )}

        {step === 2 && (
          <StepWrap
            title="إيه اللي بيحصل عادة قبل السلوك؟"
            subtitle="اختيارات عامة — لا حاجة لأي تفاصيل صريحة."
          >
            <ChipMultiSelect options={STEP3} value={patterns} onChange={setPatterns} />
            <InfoNote>
              ما يهمّنا هنا هو النمط العام (تصفح؟ افتكر؟ ملل؟) — لا محتوى بعينه.
            </InfoNote>
          </StepWrap>
        )}

        {step === 3 && (
          <StepWrap
            title="محتاج هاتفك/كمبيوترك للعمل أو الدراسة؟"
            subtitle="ده يحدد خطة «وضع العمل الآمن» عند الطوارئ."
          >
            <div className="space-y-2.5">
              {(
                [
                  { id: "yes", label: "نعم، أحتاجه باستمرار", desc: "سنجهّز تدخلات لا تتطلب ترك الجهاز" },
                  { id: "sometimes", label: "أحيانًا", desc: "سنطلب منك التأكيد وقت الحاجة" },
                  { id: "no", label: "لا، يمكنني تركه", desc: "سنفضّل تدخلات الابتعاد عن الجهاز" },
                ] as const
              ).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setDeviceNeeds(o.id)}
                  aria-pressed={deviceNeeds === o.id}
                  className={`w-full rounded-2xl border p-4 text-start transition-colors ${
                    deviceNeeds === o.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="font-semibold">{o.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{o.desc}</div>
                </button>
              ))}
            </div>
          </StepWrap>
        )}

        {step === 4 && (
          <StepWrap title="إيه اللي عايز تبنيه؟" subtitle="الحياة الممتلئة أقوى درع — اختار أهدافك.">
            <ChipMultiSelect options={STEP5} value={buildGoals} onChange={setBuildGoals} />
          </StepWrap>
        )}

        {step === 5 && (
          <StepWrap title="أي نوع من الدعم تحب؟" subtitle="ده هيظهر في اختيار جرعتك اليومية.">
            <div className="space-y-2.5">
              {STEP6.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSupportPrefs([o.id])}
                  aria-pressed={supportPrefs[0] === o.id}
                  className={`w-full rounded-2xl border p-4 text-start font-semibold transition-colors ${
                    supportPrefs[0] === o.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </StepWrap>
        )}

        {step === 6 && (
          <StepWrap
            title="لماذا أفعل هذا؟"
            subtitle="اكتب سببك بيدك — أو اختر ما يمثّلك. يظهر لك في اللحظات الصعبة."
          >
            <ChipMultiSelect
              size="sm"
              options={PERSONAL_WHY_REASONS}
              value={whyReasons}
              onChange={setWhyReasons}
            />
            <Textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="سببك الخاص، بكلماتك أنت… (اختياري)"
              className="mt-4 min-h-28 text-base leading-relaxed"
              maxLength={400}
            />
          </StepWrap>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-success/15 text-success">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="text-xl font-bold">جهّزنا خطتك الأولى</h2>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              حددنا أهم سياقات الخطر عندك، وبنينا أول خطة استجابة مناسبة ليك.
            </p>
            <div className="space-y-2.5 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed">
              <div className="flex items-start gap-2">
                <Compass className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <b>سياقات الخطر عندك:</b>{" "}
                  {difficultTimes.length
                    ? difficultTimes
                        .map((d) => STEP2.find((s) => s.id === d)?.label ?? d)
                        .join("، ")
                    : "لم تحدد بعد — سيحددها سجلّك مع الوقت"}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Compass className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <b>خطة الاستجابة:</b> فحص الرغبة ثلاثي الأبعاد → تدخل مناسب لسياقك →
                  إعادة تقييم → تعلم.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Compass className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <b>حماية الطوارئ:</b>{" "}
                  {deviceNeeds === "yes"
                    ? "«وضع العمل الآمن» جاهز — مش محتاج تسيب جهازك."
                    : "تدخلات ابتعاد عن الجهاز عند الخطر."}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Compass className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <b>أربع قواعد «إذا… إذن» جاهزة في خطة الوقاية،</b> مستمدة من أكثر
                  الأنماط شيوعًا.
                </span>
              </div>
            </div>
            <InfoNote tone="info">
              بياناتك كلها هتتخزن على جهازك بس — من غير حساب، ولا خادم، ولا إرسال لأي مكان.
            </InfoNote>
          </div>
        )}
      </div>

      {/* Nav buttons — sticky so they stay reachable when the mobile
          keyboard is open on text steps. Hidden on the welcome screen. */}
      {inWizard && (
        <div className="sticky bottom-0 -mx-4 mt-8 flex items-center justify-between gap-3 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowRight className="size-4" />
            السابق
          </Button>
          {step < total - 1 ? (
            <Button size="lg" onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="gap-2">
              التالي
              <ArrowLeft className="size-4" />
            </Button>
          ) : (
            <Button size="lg" onClick={finish} className="gap-2 px-8">
              ابدأ رحلتي
              <ArrowLeft className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function StepWrap({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>
      <div className="space-y-4 pt-1">{children}</div>
    </div>
  );
}
