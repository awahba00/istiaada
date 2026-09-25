"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScreenHeader, InfoNote, CheckItem, Chip, StepDots } from "../shared";
import { dayKey, arabicDate } from "@/lib/app/helpers";
import { forecastFromCheckIn } from "@/lib/app/progress";
import { TRIGGERS } from "@/data/app/taxonomy";
import type { EveningCheckIn } from "@/lib/app/types";
import { ListChecks, Moon, Sun, Zap, ShieldAlert, ChevronLeft, Save } from "lucide-react";

const BODY_CHOICES = ["يوم صعب؟ أربع ركائز بس — يكفي", "مشي ٢٠ دقيقة", "تمرين منزلي", "تمرين رياضي", "دراجة/جري", "تمدد"];

const MODES = [
  { id: "minimum", label: "الحد الأدنى", desc: "يوم صعب؟ أربع ركائز فقط — يكفي" },
  { id: "standard", label: "قياسي", desc: "اليوم المتوازن الكامل" },
  { id: "extra", label: "إضافي", desc: "طاقة عالية؟ أضف بناءً أكثر" },
] as const;

export function PlanScreen() {
  const data = useAppStore();
  const upsertPlan = useAppStore((s) => s.upsertPlan);
  const saveCheckIn = useAppStore((s) => s.saveCheckIn);
  const navigate = useAppStore((s) => s.navigate);
  const today = dayKey();

  const plan = useMemo(
    () => data.dailyLogs.plans.find((p) => p.date === today),
    [data.dailyLogs.plans, today]
  );
  const mode = plan?.mode ?? "standard";
  const completed = plan?.completedSections ?? [];
  const purposeTask = plan?.purposeTask ?? "";
  const bodyChoice = plan?.bodyChoice ?? "";

  const forecast = useMemo(() => forecastFromCheckIn(data), [data]);
  const checkedInToday = data.dailyLogs.checkIns.some((c) => c.date === today);
  // P3 — pass today's saved check-in so EDITING preloads the saved values
  // instead of silently overwriting them with defaults.
  const todayCheckIn = data.dailyLogs.checkIns.find((c) => c.date === today);

  const update = (
    patch: Partial<{
      mode: (typeof MODES)[number]["id"];
      purposeTask: string;
      bodyChoice: string;
      completedSections: string[];
    }>
  ) => {
    upsertPlan({
      date: today,
      mode: patch.mode ?? mode,
      purposeTask: patch.purposeTask ?? purposeTask,
      bodyChoice: patch.bodyChoice ?? bodyChoice,
      completedSections: patch.completedSections ?? completed,
    });
  };

  const toggleSection = (id: string) => {
    const next = completed.includes(id)
      ? completed.filter((c) => c !== id)
      : [...completed, id];
    update({ completedSections: next });
  };

  const sections = useMemo(() => {
    const base = [
      {
        id: "morning",
        title: "انهض مبكرًا بما يكفي · لا تصفح في أول ٣٠ دقيقة · حدّد مهمة اليوم",
        body: "اختار مهمة واحدة بس — وابدأ بأصغر خطوة فيها",
        modes: ["standard", "extra"],
      },
      {
        id: "purpose",
        title: "مهمة اليوم المهمة",
        body: purposeTask || "اختر مهمة واحدة فقط — وابدأ بأصغر خطوة فيها",
        modes: ["minimum", "standard", "extra"],
        editable: true,
      },
      {
        id: "body",
        title: "الجسد: حركة",
        body: bodyChoice || "١٠–٣٠ دقيقة حركة مناسبة لك",
        modes: ["minimum", "standard", "extra"],
        choices: true,
      },
      {
        id: "attention",
        title: "انتباه: جلسة تركيز",
        body: "لا استخدام بلا هدف · الهاتف برا السرير · مراجعة سريعة لحاجزاتك",
        modes: ["standard", "extra"],
      },
      {
        id: "digital",
        title: "نظافة رقمية",
        body: "لا استخدام بلا هدف · الهاتف خارج السرير · مراجعة سريعة لحاجزاتك",
        modes: ["standard", "extra"],
      },
      {
        id: "connection",
        title: "تواصل",
        body: "جلسة مع الأهل أو مكالمة صديق — حضور حقيقي واحد يكفي",
        modes: ["minimum", "standard", "extra"],
      },
      {
        id: "night",
        title: "بروتوكول الليل",
        body: "إضافة لليوم الإضافي بس — جلسة بناء إضافية",
        modes: ["standard", "extra"],
      },
      {
        id: "focus-2",
        title: "جلسة تركيز ثانية",
        body: "إضافة لليوم الإضافي فقط — جلسة بناء إضافية",
        modes: ["extra"],
      },
    ];
    return base.filter((s) => s.modes.includes(mode));
  }, [mode, purposeTask, bodyChoice]);

  const progressPct = sections.length
    ? Math.round((sections.filter((s) => completed.includes(s.id)).length / sections.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="الخطة اليومية"
        subtitle={`${arabicDate(new Date())} — البناء اليومي هو التعافي الحقيقي`}
        icon={<ListChecks className="size-5" />}
      />

      {forecast && (
        <InfoNote tone={forecast.level === "elevated" ? "warning" : "info"}>
          <b>توقّع اليوم:</b> {forecast.message}
          {forecast.level === "elevated" && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2.5 gap-1"
              onClick={() => navigate("prevention")}
            >
              <ShieldAlert className="size-4" />
              فعّل قواعد اليوم مسبقًا
            </Button>
          )}
        </InfoNote>
      )}

      {/* Day mode */}
      <div className="grid grid-cols-3 gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => update({ mode: m.id })}
            aria-pressed={mode === m.id}
            className={`rounded-2xl border p-3 text-center transition-colors ${
              mode === m.id
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className="text-sm font-bold">{m.label}</div>
            <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{m.desc}</div>
          </button>
        ))}
      </div>
      {mode === "minimum" && (
        <InfoNote>
          يوم الحد الأدنى ليس تنازلًا — إنه أذكى استجابة لليوم الصعب. يوم ناقص خير من يوم منهار.
        </InfoNote>
      )}

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="tnum text-sm font-bold text-primary">{progressPct}%</span>
      </div>

      {/* Sections */}
      <div className="space-y-2.5">
        {sections.map((s) => (
          <CheckItem key={s.id} done={completed.includes(s.id)} title={s.title} onClick={() => toggleSection(s.id)}>
            <p className="-mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            {s.editable && (
              <Input
                value={purposeTask}
                onChange={(e) => update({ purposeTask: e.target.value })}
                placeholder="اكتب مهمتك المهمة اليوم…"
                className="mt-2 bg-background text-sm"
              />
            )}
            {s.choices && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {BODY_CHOICES.map((c) => (
                  <Chip
                    key={c}
                    size="sm"
                    label={c}
                    selected={bodyChoice === c}
                    onClick={() => update({ bodyChoice: c })}
                  />
                ))}
              </div>
            )}
          </CheckItem>
        ))}
      </div>

      {/* Evening check-in */}
      <Card className={checkedInToday ? "border-success/40 bg-success/5" : undefined}>
        <CardContent className="flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-3">
            <Moon className="size-6 text-primary" />
            <div>
              <div className="font-bold">المراجعة المسائية</div>
              <div className="text-xs text-muted-foreground">
                {checkedInToday ? "أُنجزت الليلة ✓ — شكرًا لصدقك" : "٥ أسئلة قصيرة + توقّع الغد"}
              </div>
            </div>
          </div>
          <EveningCheckInDialog onSave={saveCheckIn} done={checkedInToday} existing={todayCheckIn} />
        </CardContent>
      </Card>

      <InfoNote tone="info">
        <Sun className="mb-1 me-1 inline size-4" />
        لا تسعَ للكمال: فقدان بند واحد لا يفسد اليوم — والتخطي ليس فشلًا، بل حكمة
        اليوم الصعب. أكمل ما تستطيع وواصل.
      </InfoNote>
    </div>
  );
}

function EveningCheckInDialog({
  onSave,
  done,
  existing,
}: {
  onSave: (c: {
    date: string;
    highestUrge: number;
    mainTrigger: string;
    interventionUsed: string;
    lesson: string;
    changeTomorrow: string;
    sleepQuality: number;
    stress: number;
    loneliness: number;
    freeTime: number;
  }) => void;
  done: boolean;
  /** Today's saved check-in, when it exists — preloaded on open (P3). */
  existing?: EveningCheckIn;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [highestUrge, setHighestUrge] = useState(2);
  const [mainTrigger, setMainTrigger] = useState("");
  const [interventionUsed, setInterventionUsed] = useState("");
  const [lesson, setLesson] = useState("");
  const [changeTomorrow, setChangeTomorrow] = useState("");
  const [sleepQuality, setSleepQuality] = useState(3);
  const [stress, setStress] = useState(3);
  const [loneliness, setLoneliness] = useState(3);
  const [freeTime, setFreeTime] = useState(3);

  /**
   * P3 — preloading an existing check-in fills EVERY field with the saved
   * values before the user touches anything. Saving then persists exactly
   * the preloaded values plus the user's actual edits, so unchanged answers
   * are preserved verbatim and defaults can never overwrite saved data.
   */
  const loadFrom = (c?: EveningCheckIn) => {
    setStep(0);
    setHighestUrge(c?.highestUrge ?? 2);
    setMainTrigger(c?.mainTrigger ?? "");
    setInterventionUsed(c?.interventionUsed ?? "");
    setLesson(c?.lesson ?? "");
    setChangeTomorrow(c?.changeTomorrow ?? "");
    setSleepQuality(c?.sleepQuality ?? 3);
    setStress(c?.stress ?? 3);
    setLoneliness(c?.loneliness ?? 3);
    setFreeTime(c?.freeTime ?? 3);
  };

  const reset = () => {
    loadFrom(undefined);
  };

  const save = () => {
    onSave({
      date: dayKey(),
      highestUrge,
      mainTrigger,
      interventionUsed,
      lesson,
      changeTomorrow,
      sleepQuality,
      stress,
      loneliness,
      freeTime,
    });
    setOpen(false);
    reset();
  };

  const condScale = (
    label: string,
    value: number,
    set: (n: number) => void,
    low: string,
    high: string
  ) => (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="mb-2 flex justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="tnum font-bold text-primary">{value}/5</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => set(n)}
            aria-label={`${label} ${n}`}
            className={`tnum h-9 flex-1 rounded-lg border text-sm font-semibold transition-colors ${
              value === n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) loadFrom(existing);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={done ? "outline" : "default"} size="sm">
          {done ? "تعديل" : "ابدأ"}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader className="text-start">
          <DialogTitle className="flex items-center gap-2">
            <Moon className="size-5 text-primary" />
            المراجعة المسائية
          </DialogTitle>
        </DialogHeader>
        <StepDots total={3} current={step} />
        <div className="space-y-4">
          {step === 0 && (
            <>
              <div>
                <div className="mb-1 flex justify-between text-sm font-semibold">
                  <span>١ · أعلى رغبة اليوم؟</span>
                  <span className="tnum text-xs font-bold text-primary">
                    {highestUrge}/5
                  </span>
                </div>
                {/* 1–5 ladder — same single-row pattern as the Urge Check for
                    consistency and comfortable one-hand taps at 320px. */}
                <div className="flex gap-1.5" role="radiogroup" aria-label="أعلى رغبة اليوم">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={highestUrge === n}
                      aria-label={`أعلى رغبة اليوم: ${n} من ٥`}
                      onClick={() => setHighestUrge(n)}
                      className={`tnum h-11 flex-1 rounded-lg border text-base font-bold transition-colors ${
                        highestUrge === n
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>بالكاد وجدت</span>
                  <span>أقصى ما وصلت له</span>
                </div>
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold">٢ · المحفز الرئيسي اليوم؟</div>
                <div className="flex flex-wrap gap-1.5">
                  {TRIGGERS.slice(0, 10).map((t) => (
                    <Chip
                      key={t.id}
                      size="sm"
                      label={t.label}
                      selected={mainTrigger === t.label}
                      onClick={() => setMainTrigger(t.label)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold">٣ · هل استخدمت تدخلًا؟</div>
                <div className="flex flex-wrap gap-1.5">
                  {["لا، لم أحتج", "نعم — ونجح", "نعم — جزئيًا", "لم أفكر فيه"].map((o) => (
                    <Chip
                      key={o}
                      size="sm"
                      label={o}
                      selected={interventionUsed === o}
                      onClick={() => setInterventionUsed(o)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <div className="mb-2 text-sm font-semibold">٤ · درس واحد من اليوم؟</div>
                <Textarea
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                  placeholder="جملة واحدة تكفي…"
                  className="min-h-20 text-sm"
                />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold">٥ · تغيير واحد للغد؟</div>
                <Textarea
                  value={changeTomorrow}
                  onChange={(e) => setChangeTomorrow(e.target.value)}
                  placeholder="مثال: الهاتف يبيت خارج الغرفة…"
                  className="min-h-20 text-sm"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-sm font-semibold">
                ظروف الغد (لتوقّع الغد — ليس تنبؤًا، بل استعدادًا)
              </div>
              {condScale("مثال: الهاتف يبيت برا الغرفة…", sleepQuality, setSleepQuality, "سيئ جدًا", "ممتاز")}
              {condScale("ظروف الغد (لتوقّع الغد — مش تنبؤ، بل استعدادًا)", stress, setStress, "هادئ", "مرتفع جدًا")}
              {condScale("الوحدة اليوم؟", loneliness, setLoneliness, "متصل بالناس", "منعزل")}
              {condScale("إزاي كان نومك الليلة الماضية؟", freeTime, setFreeTime, "لا يوجد", "كثير جدًا")}
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            السابق
          </Button>
          {step < 2 ? (
            <Button onClick={() => setStep((s) => s + 1)}>التالي</Button>
          ) : (
            <Button onClick={save} className="gap-1.5">
              <Save className="size-4" />
              حفظ المراجعة
            </Button>
          )}
        </div>
        <p className="flex items-center gap-1 text-center text-[11px] leading-relaxed text-muted-foreground">
          <Zap className="size-3 shrink-0" />
          صراحتك هنا هي ما يجعل خريطتك وتوقعاتك دقيقة — البيانات تبقى على جهازك.
        </p>
      </DialogContent>
    </Dialog>
  );
}
