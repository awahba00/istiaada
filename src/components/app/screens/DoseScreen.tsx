"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScreenHeader, InfoNote } from "../shared";
import { selectDailyDose, doseStatusFor } from "@/lib/app/dose-engine";
import { dayKey, arabicDate } from "@/lib/app/helpers";
import { KNOWLEDGE, CATEGORY_LABELS } from "@/data/app/knowledge";
import { JOURNEY_STAGES, JOURNEY_DISCLAIMER } from "@/data/app/taxonomy";
import { computeProgress } from "@/lib/app/progress";
import { Pill, Check, SkipForward, BookOpen, Lightbulb, Footprints, Anchor } from "lucide-react";

export function DoseScreen() {
  const data = useAppStore();
  const logDose = useAppStore((s) => s.logDose);
  const navigate = useAppStore((s) => s.navigate);
  const today = dayKey();

  const dose = useMemo(() => selectDailyDose({ data }), [data]);
  const status = doseStatusFor(data, today);
  const metrics = useMemo(() => computeProgress(data), [data]);

  const stage = JOURNEY_STAGES.find(
    (s) => metrics.daysSinceStart >= s.fromDay && metrics.daysSinceStart <= s.toDay
  ) ?? JOURNEY_STAGES[0];

  const recentDoses = useMemo(() => {
    return data.dailyLogs.doseLog
      .filter((d) => d.date !== today)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 5)
      .map((d) => ({ ...d, item: KNOWLEDGE.find((k) => k.id === d.itemId) }))
      .filter((d) => d.item);
  }, [data.dailyLogs.doseLog, today]);

  const done = status.status === "done";

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="الجرعة اليومية"
        subtitle={`${arabicDate(new Date())} — اليوم ${metrics.daysSinceStart} · مرحلة «${stage.label}»`}
        icon={<Pill className="size-5" />}
      />

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between bg-primary/10 px-5 py-3">
          <div className="flex items-center gap-2 font-bold text-primary">
            <BookOpen className="size-4" />
            {dose.title}
          </div>
          <span className="rounded-full bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            {CATEGORY_LABELS[dose.category]}
          </span>
        </div>
        <CardContent className="space-y-4 pt-5">
          <DoseBlock icon={<Lightbulb className="size-4" />} title="اعرف" body={dose.know} />
          <DoseBlock icon={<Anchor className="size-4" />} title="افهم" body={dose.understand} />
          <DoseBlock icon={<Footprints className="size-4" />} title="افعل" body={dose.act} />
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              تذكّر
            </div>
            <p className="mt-1.5 font-semibold leading-relaxed">{dose.remember}</p>
          </div>

          {dose.deep && (
            <details className="rounded-xl border border-border bg-muted/40 px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                قراءة أعمق (اختياري)
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dose.deep}</p>
            </details>
          )}

          {done ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-success/15 py-3 font-semibold text-success">
              <Check className="size-5" />
              أنجزت جرعة اليوم
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="flex-1 gap-1.5"
                  onClick={() => logDose(today, dose.id, "done")}
                >
                  <Check className="size-4" />
                  تمت الجرعة
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => logDose(today, dose.id, "skipped")}
                  className="gap-1.5"
                  title="البطاقة نفسها هنا لو حسّيت تقرأها دلوقتي — والجرعة الجديدة بانتظارك بكرة."
                >
                  <SkipForward className="size-4" />
                  تخطي اليوم
                </Button>
              </div>
              {/* Visible on mobile too — the skip-is-not-failure guidance
                  used to live only in a desktop-only tooltip. */}
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                التخطي ليس فشلًا — الجرعة القادمة بانتظارك، والتعافي لا يُقاس بيوم واحد.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <InfoNote>
        اختيرت هذه الجرعة بناءً على حالتك الحالية —{" "}
        {data.relapseEvents.some(
          (r) => Date.now() - new Date(r.ts).getTime() < 7 * 86400000
        )
          ? "لأن سجلك يحوي زَلّة أو انتكاسة خلال هذا الأسبوع، نفضّل موضوعات الزلّة والانتكاسة والعودة."
          : "ولا يهمك — تقدر تعدّي أي جرعة"}
      </InfoNote>

      {recentDoses.length > 0 && (
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="font-bold">جرعات سابقة</div>
            <div className="space-y-2">
              {recentDoses.map((d) => (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => navigate("knowledge")}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background p-3 text-start text-sm transition-colors hover:border-primary/30"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{d.item!.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.date} · {CATEGORY_LABELS[d.item!.category]}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                      d.status === "done"
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.status === "done" ? "أُنجزت" : "مُخطاة"}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <InfoNote tone="info">
        <b>مرحلتك الحالية:</b> {stage.label} — {stage.description}
        <div className="mt-2 text-xs text-muted-foreground">{JOURNEY_DISCLAIMER}</div>
      </InfoNote>

      <Button variant="outline" className="w-full" onClick={() => navigate("knowledge")}>
        تصفح قاعدة المعرفة كاملة
      </Button>
    </div>
  );
}

function DoseBlock({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-primary">
        {icon}
        {title}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
