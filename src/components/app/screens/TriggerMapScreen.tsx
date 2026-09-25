"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/app/store";
import { Card, CardContent } from "@/components/ui/card";
import { ScreenHeader, EmptyState, InfoNote } from "../shared";
import { computeInsights } from "@/lib/app/progress";
import { TRIGGERS, TRIGGER_CATEGORIES } from "@/data/app/taxonomy";
import { TIME_BUCKET_LABELS, timeBucket } from "@/lib/app/helpers";
import { Radar, MapPin, Flag, Scissors, Clock } from "lucide-react";

export function TriggerMapScreen() {
  const data = useAppStore();
  const insights = useMemo(() => computeInsights(data), [data]);

  const triggerCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of data.urgeChecks) c.triggers.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1));
    for (const r of data.relapseEvents)
      r.triggers.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1));
    return m;
  }, [data.urgeChecks, data.relapseEvents]);

  const bucketCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of data.urgeChecks) {
      const b = timeBucket(c.ts);
      m.set(b, (m.get(b) ?? 0) + 1);
    }
    for (const r of data.relapseEvents) {
      const b = timeBucket(r.ts);
      m.set(b, (m.get(b) ?? 0) + 1);
    }
    return m;
  }, [data.urgeChecks, data.relapseEvents]);

  const maxBucket = Math.max(1, ...bucketCounts.values());
  const totalEvents = data.urgeChecks.length + data.relapseEvents.length;

  const byCategory = TRIGGER_CATEGORIES.map((cat) => ({
    ...cat,
    items: TRIGGERS.filter(
      (t) => t.category === cat.id && (triggerCounts.get(t.id) ?? 0) > 0
    ).sort((a, b) => (triggerCounts.get(b.id) ?? 0) - (triggerCounts.get(a.id) ?? 0)),
  })).filter((c) => c.items.length > 0);

  if (totalEvents < 3) {
    return (
      <div className="space-y-5">
        <ScreenHeader
          title="«المحفز» هو ما بدأ الموجة عادة — الملل، التصفح، التأخير… أنماطك تُرسم من سجلك تلقائيًا مع كل فحص رغبة."
          subtitle="«المحفز» هو ما بدأ الموجة عادةً — الملل، التصفح، التأخير… أنماطك تُرسم من سجلك تلقائيًا مع كل فحص رغبة."
          icon={<Radar className="size-5" />}
        />
        <EmptyState
          icon={<Radar className="size-10" />}
          title="نحتاج قليلًا من السجل أولًا"
          body="سجّل ٣–٤ فحوصات رغبة (حتى الخفيف منها) وسيبدأ التطبيق برسم أنماطك: أكثر المحفزات، أخطر الأوقات، ونقطة التدخل الأفضل."
        />
        <InfoNote>
          الغرض ليس تسجيل التاريخ — بل اكتشاف أبكر نقطة تدخل في سلسلتك.
        </InfoNote>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="خريطة المحفزات"
        subtitle="أنماطك المكتشفة — الهدف: أبكر نقطة تقدر توقف عندها."
        icon={<Radar className="size-5" />}
      />

      {/* Top pattern */}
      {insights.topPattern && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-center gap-2 font-bold text-primary">
              <MapPin className="size-4" />
              نمطك الأخطر ({insights.topPattern.count} مرة)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {insights.topPattern.parts.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-primary/15 px-3 py-1.5 text-sm font-semibold text-primary"
                >
                  {p}
                </span>
              ))}
            </div>
            {insights.firstSign && (
              <div className="rounded-xl bg-background/70 p-3 text-sm leading-relaxed">
                <b>أول علامة عادة:</b> {insights.firstSign.id}
              </div>
            )}
            {insights.bestCutPoint && (
              <div className="rounded-xl bg-background/70 p-3 text-sm leading-relaxed">
                <b>نقطة التدخل الأفضل:</b> {insights.bestCutPoint}
              </div>
            )}
            {!insights.bestCutPoint && (
              <div className="rounded-xl bg-background/70 p-3 text-sm leading-relaxed text-muted-foreground">
                أنجز مراجعة هادئة لسجل واحد، وستظهر هنا «نقطة التدخل الأفضل» في نمطك.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Time distribution */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <Clock className="size-4 text-primary" />
            توزيع أوقات الخطر
          </div>
          <div className="space-y-2">
            {(["morning", "afternoon", "evening", "late-night"] as const).map((b) => {
              const count = bucketCounts.get(b) ?? 0;
              const pct = Math.round((count / maxBucket) * 100);
              const isMax = count === maxBucket && count > 0;
              return (
                <div key={b} className="flex items-center gap-3 text-sm">
                  <span className="w-36 shrink-0 text-xs text-muted-foreground">
                    {TIME_BUCKET_LABELS[b]}
                  </span>
                  <div className="h-6 flex-1 overflow-hidden rounded-lg bg-muted">
                    <div
                      className={`flex h-full items-center justify-end rounded-lg pe-2 text-[11px] font-bold transition-all ${
                        isMax ? "bg-destructive text-destructive-foreground" : "bg-primary/40"
                      }`}
                      style={{ width: `${Math.max(pct, count > 0 ? 12 : 0)}%` }}
                    >
                      {count > 0 ? count : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {insights.mostRiskyTime && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              <b>أكثر وقت محتاج حماية:</b> {TIME_BUCKET_LABELS[insights.mostRiskyTime.bucket]} —
              خطّط له مبكرًا (قواعد «إذا… إذن» وبروتوكول الليل).
            </p>
          )}
        </CardContent>
      </Card>

      {/* Trigger frequencies */}
      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <Flag className="size-4 text-primary" />
            محفزاتك الأكثر تكرارًا
          </div>
          {byCategory.length === 0 ? (
            <p className="text-sm text-muted-foreground">لم تسجل محفزات في فحوصاتك بعد.</p>
          ) : (
            byCategory.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <div className="text-xs font-bold text-muted-foreground">{cat.label}</div>
                {cat.items.slice(0, 5).map((t) => {
                  const count = triggerCounts.get(t.id) ?? 0;
                  return (
                    <div key={t.id} className="flex items-center gap-3">
                      <span className="flex-1 truncate text-sm">{t.label}</span>
                      <span className="tnum rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {insights.topTrigger && (
        <InfoNote>
          <b>أحسن تدخل عندك:</b> {insights.topTrigger.label} ({insights.topTrigger.count} مرة).
          أقوى تدخل له عادةً: تغيير البيئة فور ظهوره — قبل أي تفاوض داخلي.
        </InfoNote>
      )}
      {insights.bestIntervention && (
        <InfoNote tone="success">
          <b>دي أنماط سلوكية مرصودة من سجلك — وليست تشخيصًا. الهدف العملي: أبكر نقطة تقدر توقف عندها.</b> {insights.bestIntervention.name} (نجح{" "}
          {insights.bestIntervention.wins} مرة). النظام سيرجّحه تلقائيًا في المقترحات.
        </InfoNote>
      )}
      <InfoNote tone="info">
        <Scissors className="mb-1 me-1 inline size-4" />
        هذه أنماط سلوكية مرصودة من سجلك — وليست تشخيصًا. الهدف العملي: أبكر نقطة
        تقدر توقف عندها.
      </InfoNote>
    </div>
  );
}
