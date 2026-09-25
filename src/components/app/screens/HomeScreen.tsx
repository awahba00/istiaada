"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/app/store";
import { useEmergencyLauncher } from "@/lib/app/emergency-launcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScreenHeader, StatTile, InfoNote } from "../shared";
import { currentHomeState } from "@/lib/app/risk-engine";
import { computeProgress } from "@/lib/app/progress";
import { selectDailyDose } from "@/lib/app/dose-engine";
import { dayKey, greeting } from "@/lib/app/helpers";
import { cn } from "@/lib/utils";
import {
  Siren,
  Pill,
  BookOpen,
  TrendingUp,
  ChevronLeft,
  LifeBuoy,
  Gauge,
  ShieldAlert,
  Compass,
  Brain,
  Dumbbell,
  Target,
  Users,
  Heart,
  Smartphone,
} from "lucide-react";

/**
 * دليلك السريع — the four-situation mental model, always available on the
 * stable Home (C3). One quiet line per situation → the matching tool, so a
 * user who forgot the onboarding can still answer "ماذا أفعل الآن؟" from
 * the UI itself. Situations stay one tap away without turning Home into a
 * documentation page: no paragraphs, just the map.
 */
function QuickGuide({ onEmergency }: { onEmergency: () => void }) {
  const navigate = useAppStore((s) => s.navigate);
  const rows: {
    icon: React.ComponentType<{ className?: string }>;
    iconClass: string;
    situation: string;
    action: string;
    actionClass: string;
    onClick: () => void;
  }[] = [
    {
      icon: Pill,
      iconClass: "text-primary",
      situation: "مستقر؟",
      action: "خد جرعة اليوم",
      actionClass: "text-foreground",
      onClick: () => navigate("dose"),
    },
    {
      icon: Gauge,
      iconClass: "text-primary",
      situation: "بدأت رغبة؟",
      action: "افحص الرغبة",
      actionClass: "text-foreground",
      onClick: () => navigate("urge"),
    },
    {
      icon: Siren,
      iconClass: "text-destructive",
      situation: "قربت تتصرف؟",
      action: "تدخّل الآن",
      actionClass: "text-destructive",
      onClick: onEmergency,
    },
    {
      icon: LifeBuoy,
      iconClass: "text-warning",
      situation: "حصلت زَلّة؟",
      action: "توقّف هنا",
      actionClass: "text-foreground",
      onClick: () => navigate("relapse"),
    },
  ];

  return (
    <Card className="border-border/70">
      <CardContent className="pb-2 pt-4">
        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <Compass className="size-4" />
          دليلك السريع — أعمل إيه دلوقتي؟
        </div>
        <div className="divide-y divide-border/60">
          {rows.map((r) => (
            <button
              key={r.situation}
              type="button"
              onClick={r.onClick}
              className="flex w-full items-center gap-2.5 py-3 text-start transition-colors hover:text-foreground"
            >
              <r.icon className={cn("size-4 shrink-0", r.iconClass)} />
              <span className="shrink-0 text-sm font-medium text-muted-foreground">
                {r.situation}
              </span>
              <span className="min-w-2 flex-1 border-b border-dashed border-border/80" aria-hidden="true" />
              <span className={cn("shrink-0 text-sm font-bold", r.actionClass)}>{r.action}</span>
              <ChevronLeft className="size-3.5 shrink-0 text-muted-foreground/70" />
            </button>
          ))}
        </div>
        <p className="pt-1 text-center text-[11px] leading-relaxed text-muted-foreground">
          كل أداة ليها وقتها — استخدم اللي محتاجه دلوقتي.
        </p>
      </CardContent>
    </Card>
  );
}

export function HomeScreen() {
  const data = useAppStore();
  const navigate = useAppStore((s) => s.navigate);
  const launchEmergency = useEmergencyLauncher();

  const lastCheck = data.urgeChecks.length
    ? data.urgeChecks[data.urgeChecks.length - 1]
    : null;
  const lastRelapse = data.relapseEvents.length
    ? data.relapseEvents[data.relapseEvents.length - 1]
    : null;

  const homeState = currentHomeState(
    lastCheck?.riskLevel ?? null,
    lastCheck?.ts ?? null,
    lastRelapse?.ts ?? null,
    lastRelapse ? lastRelapse.reviewed : true,
    lastCheck?.outcome ?? null
  );

  // A recently-handled wave deserves a calm acknowledgment — the state
  // transition from "high" back to "normal" must feel earned, not abrupt.
  // "من قليل" must stay truthful as time passes (copy fix): the wording
  // follows the outcome time (falling back to the check time), matching the
  // same 3h window the state itself uses.
  const handledRecently =
    lastCheck?.outcome === "handled" &&
    Date.now() -
      new Date(lastCheck.outcomeTs ?? lastCheck.ts).getTime() <
      3 * 3600000;

  const handledAgoLabel = (): string => {
    if (!lastCheck?.outcomeTs && !lastCheck?.ts) return "من قليل";
    const minutes =
      (Date.now() - new Date(lastCheck!.outcomeTs ?? lastCheck!.ts).getTime()) /
      60000;
    if (minutes < 45) return "من قليل";
    if (minutes < 110) return "منذ ساعة تقريبًا";
    return "منذ ساعتين تقريبًا";
  };

  const metrics = useMemo(() => computeProgress(data), [data]);
  const dose = useMemo(() => selectDailyDose({ data }), [data]);
  const doseDoneToday = data.dailyLogs.doseLog.some((d) => d.date === dayKey() && d.status === "done");

  // Stable-state guidance must stay truthful whether the daily dose is on
  // or off — the "what to do now" line adapts instead of commanding a
  // feature the user disabled.
  const stableTail = data.settings.dailyDoseEnabled
    ? "خد جرعة اليوم واختار مهمة واحدة من خطتك — ده كفاية."
    : "اختار مهمة واحدة من خطة اليوم — ده كفاية.";

  const planPillars = [
    { id: "mind", label: "العقل", icon: Brain },
    { id: "body", label: "الجسد", icon: Dumbbell },
    { id: "purpose", label: "الهدف", icon: Target },
    { id: "connection", label: "التواصل", icon: Users },
    { id: "values", label: "القيم", icon: Heart },
    { id: "digital", label: "الرقمي", icon: Smartphone },
  ];

  return (
    <div className="space-y-5">
      <ScreenHeader
        title={greeting()}
        subtitle={`اليوم ${metrics.daysSinceStart} من رحلتك${metrics.daysSinceLastRelapse != null ? ` — و${metrics.daysSinceLastRelapse} يومًا منذ آخر زَلّة` : ""}`}
      />

      {/* ————— Current state ————— */}
      {homeState === "normal" && (
        <InfoNote tone="success">
          <b>
            {handledRecently
              ? `أحسنت — تعاملت مع موجة ${handledAgoLabel()}.`
              : "أنت مستقر دلوقتي — مش محتاج أي تدخل."}
          </b>{" "}
          {stableTail}
        </InfoNote>
      )}
      {homeState === "moderate" && (
        <InfoNote tone="warning">
          <b>انتبه — آخر فحص أظهر رغبة بدأت تبني.</b> مؤشر مش تنبؤ: خطوة قطع
          صغيرة دلوقتي بتكفي غالبًا قبل ما تكبر.
          <div className="mt-3">
            <Button size="sm" onClick={() => navigate("urge")} className="gap-1.5">
              <Gauge className="size-4" />
              افحص الرغبة دلوقتي
            </Button>
          </div>
        </InfoNote>
      )}
      {homeState === "high" && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 sm:p-5">
          <div className="flex items-center gap-2 font-bold text-destructive">
            <ShieldAlert className="size-5" />
            درجة حالتك مرتفعة في آخر فحص
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            اللي محتاجه دلوقتي خطوة قطع واحدة — مش حل شامل.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="destructive"
              onClick={() =>
                launchEmergency(lastCheck?.riskLevel ?? 4, lastCheck?.triggers ?? [])
              }
              className="gap-1.5"
            >
              <Siren className="size-4" />
              تدخّل الآن
            </Button>
            <Button variant="outline" onClick={() => navigate("urge")}>
              عيد الفحص
            </Button>
          </div>
          {/* P2 — the post-behavior flow stays one honest tap away from the
              high-risk state WITHOUT assuming the behavior happened: a quiet
              question under a divider, never a verdict on the user. */}
          <div className="mt-4 border-t border-destructive/20 pt-3">
            <button
              type="button"
              onClick={() => navigate("relapse")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <LifeBuoy className="size-3.5" />
              حصلت زَلّة؟ ما تكملش — نوقف هنا الأول
            </button>
          </div>
        </div>
      )}
      {homeState === "post-relapse" && (
        <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 sm:p-5">
          <div className="flex items-center gap-2 font-bold">
            <LifeBuoy className="size-5 text-warning" />
            بعد اللي حصل — المهم دلوقتي: ما تكمّلش
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            اللي حصل مش بيمسح اللي اتعلمته — والمراجعة الهادئة تنتظرك لما تهدى.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => navigate("relapse")} className="gap-1.5">
              <LifeBuoy className="size-4" />
              توقّف هنا
            </Button>
          </div>
        </div>
      )}

      {/* ————— Quick guide (stable state only — the state banner already
          directs the action in every other state) ————— */}
      {homeState === "normal" && (
        <QuickGuide onEmergency={() => launchEmergency(4)} />
      )}

      {/* ————— Daily dose card ————— */}
      {data.settings.dailyDoseEnabled && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between bg-primary/10 px-5 py-3">
            <div className="flex items-center gap-2 font-bold text-primary">
              <Pill className="size-4" />
              الجرعة اليومية — اليوم {metrics.daysSinceStart}
            </div>
            {doseDoneToday && (
              <span className="rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success">
                أُنجزت اليوم ✓
              </span>
            )}
          </div>
          <CardContent className="space-y-3 pt-4">
            <div className="font-semibold">{dose.title}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-muted p-3">
                <div className="mb-1 text-[11px] font-bold text-primary">اعرف</div>
                <p className="line-clamp-3 leading-relaxed text-muted-foreground">{dose.know}</p>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <div className="mb-1 text-[11px] font-bold text-primary">افعل</div>
                <p className="line-clamp-3 leading-relaxed text-muted-foreground">{dose.act}</p>
              </div>
            </div>
            <Button onClick={() => navigate("dose")} className="w-full gap-1.5">
              <BookOpen className="size-4" />
              {doseDoneToday ? "اعرض الجرعة كاملة" : "ابدأ الجرعة"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ————— Daily plan compact ————— */}
      <Card>
        <CardContent className="pt-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <TrendingUp className="size-4 text-primary" />
              الخطة اليومية
            </div>
            <button
              type="button"
              onClick={() => navigate("plan")}
              className="flex items-center gap-0.5 text-sm font-medium text-primary"
            >
              الخطة كاملة
              <ChevronLeft className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {planPillars.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate("plan")}
                aria-label={`ركيزة ${p.label} — افتح الخطة اليومية`}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background/50 py-3 transition-colors hover:border-primary/40"
              >
                <p.icon className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium">{p.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ————— Progress snapshot ————— */}
      <Card>
        <CardContent className="pt-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <TrendingUp className="size-4 text-primary" />
              لمحة التقدم
            </div>
            <button
              type="button"
              onClick={() => navigate("progress")}
              className="flex items-center gap-0.5 text-sm font-medium text-primary"
            >
              كل المؤشرات
              <ChevronLeft className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile
              label="رغبات تعاملت معها"
              value={String(metrics.urgesHandled)}
              hint={`${metrics.urgesHandled7d} خلال آخر أسبوع`}
              direction={metrics.urgesHandled7d > 0 ? "up" : undefined}
            />
            <StatTile
              label="تدخلات مبكرة"
              value={String(metrics.earlyInterventions)}
              hint="خلال ٣٠ يومًا"
              direction={metrics.earlyInterventions > 0 ? "up" : undefined}
            />
            <StatTile
              label="استقرار يومي"
              value={`${metrics.dailyStability}%`}
              hint="مراجعات مسائية / ١٤ يومًا"
            />
            <StatTile
              label="وعي بالمحفزات"
              value={String(metrics.triggerAwareness)}
              hint="محفزات مختلفة رصدتها"
              direction={metrics.triggerAwareness >= 3 ? "up" : undefined}
            />
          </div>
        </CardContent>
      </Card>

      <p className="pb-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        مؤشرات سلوكية للاستخدام الشخصي — ليست تشخيصًا طبيًا ولا نسبة تعافٍ.
        <br />
        بياناتك محفوظة على جهازك بس.
      </p>
    </div>
  );
}
