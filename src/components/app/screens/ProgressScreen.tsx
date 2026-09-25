"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/app/store";
import { Card, CardContent } from "@/components/ui/card";
import { ScreenHeader, StatTile, InfoNote } from "../shared";
import { computeProgress, computeInsights } from "@/lib/app/progress";
import { JOURNEY_STAGES, JOURNEY_DISCLAIMER } from "@/data/app/taxonomy";
import { TIME_BUCKET_LABELS } from "@/lib/app/helpers";
import { TrendingUp, Flag, Zap, Clock, Compass, Sparkles } from "lucide-react";

export function ProgressScreen() {
  const data = useAppStore();
  const m = useMemo(() => computeProgress(data), [data]);
  const insights = useMemo(() => computeInsights(data), [data]);

  const stage = JOURNEY_STAGES.find(
    (s) => m.daysSinceStart >= s.fromDay && m.daysSinceStart <= s.toDay
  ) ?? JOURNEY_STAGES[0];
  const stageIndex = JOURNEY_STAGES.indexOf(stage);

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="التقدم"
        subtitle="مؤشرات متعددة صادقة — لا نسبة تعافٍ زائفة، ولا يوم يعود إلى الصفر."
        icon={<TrendingUp className="size-5" />}
      />

      {/* Journey */}
      <Card className="overflow-hidden">
        <div className="bg-primary/10 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-primary">رحلة اليوم</div>
              <div className="text-2xl font-black">
                اليوم <span className="tnum">{m.daysSinceStart}</span>
              </div>
            </div>
            <div className="text-end">
              <div className="text-xs text-muted-foreground">المرحلة</div>
              <div className="font-bold text-primary">{stage.label}</div>
            </div>
          </div>
        </div>
        <CardContent className="pt-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{stage.description}</p>
          {/* Stage stepper */}
          <div className="mt-4 flex items-center gap-1">
            {JOURNEY_STAGES.map((s, i) => (
              <div
                key={s.id}
                className={`h-1.5 flex-1 rounded-full ${i <= stageIndex ? "bg-primary" : "bg-muted"}`}
                title={s.label}
              />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>تثبيت</span>
            <span>المدى الطويل</span>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            {JOURNEY_DISCLAIMER}
          </p>
        </CardContent>
      </Card>

      {/* Days-clean + check-in continuity — one metric among many, not the center */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatTile
          label="أيام منذ آخر زَلّة"
          value={m.daysSinceLastRelapse != null ? String(m.daysSinceLastRelapse) : "—"}
          hint="مؤشر واحد من ضمن المؤشرات"
        />
        <StatTile
          label="مراجعات متتالية"
          value={`${m.checkInStreak} يوم`}
          hint="مراجعات مسائية متتابعة"
          direction={m.checkInStreak >= 2 ? "up" : undefined}
        />
      </div>

      {/* Core indicators */}
      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <Zap className="size-4 text-primary" />
            مؤشرات المهارات
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile
              label="رغبات تعاملت معها"
              value={String(m.urgesHandled)}
              hint={`${m.urgesHandled7d} خلال آخر ٧ أيام`}
              direction={m.urgesHandled7d > 0 ? "up" : undefined}
            />
            <StatTile
              label="جلسات وقّفتها مبكرًا"
              value={String(m.earlyInterventions)}
              hint="عند درجة ٣ أو أقل — خلال ٣٠ يومًا"
              direction={m.earlyInterventions > 0 ? "up" : undefined}
            />
            <StatTile
              label="جلسات أوقفتها مبكرًا"
              value={String(m.sessionsStoppedEarly)}
              hint="توقفت خلال دقائق من السلوك"
              direction={m.sessionsStoppedEarly > 0 ? "up" : undefined}
            />
            <StatTile
              label="أوقفت عند أولها"
              value={String(m.secondFallPrevented)}
              hint="سجلات لم تتحول لجلسة ممتدة"
              direction={m.secondFallPrevented > 0 ? "up" : undefined}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <Clock className="size-4 text-primary" />
            مؤشرات الاستجابة والاستقرار
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile
              label="سرعة التوقف"
              value={
                m.avgStopMinutes != null
                  ? m.avgStopMinutes < 5
                    ? "أسرع من الشهر اللي فات ✓"
                    : `~${m.avgStopMinutes} د`
                  : "—"
              }
              hint={
                m.stopTrend === "better"
                  ? "أسرع من الشهر السابق ✓"
                  : m.stopTrend === "worse"
                    ? "أبطأ قليلًا — راجع نقاط القطع"
                    : "متوسط زمن التوقف بعد السلوك"
              }
              direction={m.stopTrend === "better" ? "up" : undefined}
            />
            <StatTile
              label="منخفض عن اللي فات ✓"
              value={m.relapsePerWeek != null ? `${m.relapsePerWeek}/أسبوع` : "—"}
              hint={
                m.relapseTrend === "better"
                  ? "منخفض عن السابق ✓"
                  : m.relapseTrend === "worse"
                    ? "مرتفع — راجع حماية أوقات الخطر"
                    : "آخر ٤ أسابيع"
              }
              direction={m.relapseTrend === "better" ? "down" : undefined}
            />
            <StatTile
              label="وعي بالمحفزات"
              value={String(m.triggerAwareness)}
              hint="محفزات مختلفة رصدتها خلال ٣٠ يومًا"
              direction={m.triggerAwareness >= 3 ? "up" : undefined}
            />
            <StatTile
              label="الاستقرار اليومي"
              value={`${m.dailyStability}%`}
              hint="إنجاز المراجعة المسائية خلال ١٤ يومًا"
              direction={m.dailyStability >= 50 ? "up" : undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardContent className="space-y-3.5 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles className="size-4 text-primary" />
            قراءات من سجلك
          </div>
          {insights.topTrigger ? (
            <InsightRow
              icon={<Flag className="size-4" />}
              label="أكثر محفز متكرر"
              value={`${insights.topTrigger.label} (${insights.topTrigger.count}×)`}
            />
          ) : null}
          {insights.bestIntervention ? (
            <InsightRow
              icon={<Zap className="size-4" />}
              label="أحسن تدخل عندك"
              value={`${insights.bestIntervention.name} — نجح ${insights.bestIntervention.wins} مرة`}
            />
          ) : null}
          {insights.avgRiskAtIntervention != null && (
            <InsightRow
              icon={<Compass className="size-4" />}
              label="متوسط بدء تدخلك"
              value={`عند درجة ${insights.avgRiskAtIntervention} من ٥ — كلما انخفضت، كنت أسرع استجابة`}
            />
          )}
          {insights.mostRiskyTime && (
            <InsightRow
              icon={<Clock className="size-4" />}
              label="أكثر وقت محتاج حماية"
              value={TIME_BUCKET_LABELS[insights.mostRiskyTime.bucket]}
            />
          )}
          {insights.topPattern && (
            <InsightRow
              icon={<Compass className="size-4" />}
              label="سجّل كام فحص رغبة وتدخل، وهتظهر هنا قراءاتك: أحسن تدخل، أخطر وقت، وسرعة استجابتك."
              value={insights.topPattern.parts.join(" + ")}
            />
          )}
          {!insights.topTrigger && !insights.bestIntervention && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              سجّل بضعة فحوصات رغبة وتدخلات، وستظهر هنا قراءاتك: أفضل تدخل، أخطر وقت،
              وسرعة استجابتك.
            </p>
          )}
        </CardContent>
      </Card>

      <InfoNote tone="info">
        كل مؤشر هنا يمثل شيئًا حقيقيًا في سلوكك، ويمكن تحسينه بخطوة صغيرة — رغبة تُرصد،
        تدخل مبكر، توقف أسرع. حتى الزَلّة نفسها قد تحمل دليل تحسن: توقفت أبكر من قبلها.
      </InfoNote>
    </div>
  );
}

function InsightRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-3.5">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm font-semibold leading-relaxed">{value}</div>
      </div>
    </div>
  );
}
