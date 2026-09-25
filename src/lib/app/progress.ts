import { TRIGGERS } from "@/data/app/taxonomy";
import { dayKey, daysBetween, timeBucket } from "./helpers";
import { INTERVENTION_BY_ID } from "@/data/app/interventions";
import type { AppData } from "./types";

/**
 * Progress Engine — spec sections 25, 37, 52.
 * Multiple meaningful indicators; NO fake recovery percentage.
 * A relapse can contain evidence of improved response (stopped earlier).
 */

export interface ProgressMetrics {
  urgesHandled: number;
  urgesHandled7d: number;
  earlyInterventions: number;
  sessionsStoppedEarly: number;
  secondFallPrevented: number;
  triggerAwareness: number;
  avgStopMinutes: number | null;
  stopTrend: "better" | "same" | "worse" | null;
  dailyStability: number; // % of last 14 days with check-in
  relapsePerWeek: number | null;
  relapseTrend: "better" | "same" | "worse" | null;
  checkInStreak: number;
  daysSinceStart: number;
  daysSinceLastRelapse: number | null;
}

export function computeProgress(data: AppData): ProgressMetrics {
  const now = Date.now();
  const since7 = now - 7 * 86400000;
  const since30 = now - 30 * 86400000;

  const handled = data.urgeChecks.filter((c) => c.outcome === "handled");
  const handled7 = handled.filter((c) => new Date(c.ts).getTime() > since7);

  // Early intervention = responding at degree ≤ 3 (before the immediate zone)
  const early = data.interventionLogs.filter(
    (l) => l.riskLevel <= 3 && new Date(l.ts).getTime() > since30
  );

  const relapses = [...data.relapseEvents].sort(
    (a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()
  );

  const stopMinutes = (t: string): number =>
    t === "immediately" ? 2 : t === "minutes" ? 10 : t === "under-hour" ? 45 : 120;

  const recentRel = relapses.filter((r) => new Date(r.ts).getTime() > since30);
  const olderRel = relapses.filter((r) => new Date(r.ts).getTime() <= since30 && new Date(r.ts).getTime() > since30 * 2);

  const avgStop = recentRel.length
    ? recentRel.reduce((s, r) => s + stopMinutes(r.timeToStop), 0) / recentRel.length
    : null;
  const avgStopOld = olderRel.length
    ? olderRel.reduce((s, r) => s + stopMinutes(r.timeToStop), 0) / olderRel.length
    : null;
  const stopTrend =
    avgStop != null && avgStopOld != null
      ? avgStop < avgStopOld - 5
        ? "better"
        : avgStop > avgStopOld + 5
          ? "worse"
          : "same"
      : null;

  // distinct triggers recognized in last 30d
  const triggerIds = new Set<string>();
  for (const c of data.urgeChecks) {
    if (new Date(c.ts).getTime() > since30) c.triggers.forEach((t) => triggerIds.add(t));
  }
  for (const r of relapses) {
    if (new Date(r.ts).getTime() > since30) r.triggers.forEach((t) => triggerIds.add(t));
  }

  // daily stability: check-ins in last 14 days
  const checkInDates = new Set(data.dailyLogs.checkIns.map((c) => c.date));
  let stableDays = 0;
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (checkInDates.has(dayKey(d))) stableDays++;
  }

  // frequency trend: last 4 weeks vs previous 4 weeks
  const rel4 = relapses.filter((r) => new Date(r.ts).getTime() > now - 28 * 86400000).length;
  const relPrev4 = relapses.filter((r) => {
    const t = new Date(r.ts).getTime();
    return t <= now - 28 * 86400000 && t > now - 56 * 86400000;
  }).length;
  const relapseTrend =
    relPrev4 > 0 || rel4 > 0
      ? rel4 < relPrev4
        ? "better"
        : rel4 > relPrev4
          ? "worse"
          : "same"
      : null;

  // check-in streak (consecutive days ending today/yesterday)
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (checkInDates.has(dayKey(d))) streak++;
    else if (i > 0) break;
  }

  const lastRel = relapses[0] ?? null;

  return {
    urgesHandled: handled.length,
    urgesHandled7d: handled7.length,
    earlyInterventions: early.length,
    sessionsStoppedEarly: relapses.filter(
      (r) => r.timeToStop === "immediately" || r.timeToStop === "minutes"
    ).length,
    secondFallPrevented: relapses.filter((r) => !r.continued).length,
    triggerAwareness: triggerIds.size,
    avgStopMinutes: avgStop != null ? Math.round(avgStop) : null,
    stopTrend,
    dailyStability: Math.round((stableDays / 14) * 100),
    relapsePerWeek: rel4 ? Math.round((rel4 / 4) * 10) / 10 : null,
    relapseTrend,
    checkInStreak: streak,
    daysSinceStart: daysBetween(data.journey.startDate) + 1,
    daysSinceLastRelapse: lastRel ? daysBetween(lastRel.ts) : null,
  };
}

export interface ProgressInsights {
  topTrigger: { id: string; label: string; count: number } | null;
  bestIntervention: { id: string; name: string; wins: number } | null;
  avgRiskAtIntervention: number | null;
  mostRiskyTime: { bucket: string; count: number } | null;
  topPattern: { parts: string[]; count: number } | null;
  firstSign: { id: string; count: number } | null;
  bestCutPoint: string | null;
}

export function computeInsights(data: AppData): ProgressInsights {
  const since = Date.now() - 30 * 86400000;

  // Top trigger
  const tc = new Map<string, number>();
  for (const c of data.urgeChecks) {
    if (new Date(c.ts).getTime() > since)
      c.triggers.forEach((t) => tc.set(t, (tc.get(t) ?? 0) + 1));
  }
  for (const r of data.relapseEvents) {
    if (new Date(r.ts).getTime() > since)
      r.triggers.forEach((t) => tc.set(t, (tc.get(t) ?? 0) + 1));
  }
  const topTriggerEntry = [...tc.entries()].sort((a, b) => b[1] - a[1])[0];
  const topTrigger = topTriggerEntry
    ? {
        id: topTriggerEntry[0],
        label: TRIGGERS.find((t) => t.id === topTriggerEntry[0])?.label ?? topTriggerEntry[0],
        count: topTriggerEntry[1],
      }
    : null;

  // Best intervention (most successes)
  const ic = new Map<string, number>();
  for (const l of data.interventionLogs) {
    if (l.success) ic.set(l.interventionId, (ic.get(l.interventionId) ?? 0) + 1);
  }
  const bestEntry = [...ic.entries()].sort((a, b) => b[1] - a[1])[0];
  const bestIntervention = bestEntry
    ? {
        id: bestEntry[0],
        name: INTERVENTION_BY_ID[bestEntry[0]]?.name ?? bestEntry[0],
        wins: bestEntry[1],
      }
    : null;

  // Avg risk at intervention start (lower = earlier response)
  const risks = data.interventionLogs.map((l) => l.riskLevel);
  const avgRiskAtIntervention = risks.length
    ? Math.round((risks.reduce((s, r) => s + r, 0) / risks.length) * 10) / 10
    : null;

  // Most risky time bucket
  const bc = new Map<string, number>();
  for (const c of data.urgeChecks) {
    const b = timeBucket(c.ts);
    bc.set(b, (bc.get(b) ?? 0) + 1);
  }
  for (const r of data.relapseEvents) {
    const b = timeBucket(r.ts);
    bc.set(b, (bc.get(b) ?? 0) + 1);
  }
  const bucketEntry = [...bc.entries()].sort((a, b) => b[1] - a[1])[0];
  const mostRiskyTime = bucketEntry ? { bucket: bucketEntry[0], count: bucketEntry[1] } : null;

  // Top context pattern (combined contexts)
  const pc = new Map<string, number>();
  for (const c of data.urgeChecks) {
    const parts: string[] = [];
    if (c.context.lateNight) parts.push("الليل المتأخر");
    if (c.context.alone) parts.push("الوحدة");
    if (c.context.inBed) parts.push("السرير");
    if (c.context.browsingStarted) parts.push("التصفح المتشعب");
    if (parts.length >= 2) {
      const key = parts.join(" + ");
      pc.set(key, (pc.get(key) ?? 0) + 1);
    }
  }
  const patternEntry = [...pc.entries()].sort((a, b) => b[1] - a[1])[0];
  const topPattern = patternEntry
    ? { parts: patternEntry[0].split(" + "), count: patternEntry[1] }
    : null;

  // First warning sign from relapse reviews
  const fc = new Map<string, number>();
  for (const r of data.relapseEvents) {
    if (r.review?.firstSign) fc.set(r.review.firstSign, (fc.get(r.review.firstSign) ?? 0) + 1);
  }
  const firstSignEntry = [...fc.entries()].sort((a, b) => b[1] - a[1])[0];
  const firstSign = firstSignEntry ? { id: firstSignEntry[0], count: firstSignEntry[1] } : null;

  // Best cut point from reviews
  const cutPoints = data.relapseEvents
    .map((r) => r.review?.cutPoint)
    .filter((c): c is string => Boolean(c && c.trim()));
  const bestCutPoint = cutPoints[cutPoints.length - 1] ?? null;

  return {
    topTrigger,
    bestIntervention,
    avgRiskAtIntervention,
    mostRiskyTime,
    topPattern,
    firstSign,
    bestCutPoint,
  };
}

/** Evening-check-in based forecast — spec section 29 (preparation, not prediction). */
export function forecastFromCheckIn(
  data: AppData
): { level: "low" | "moderate" | "elevated"; message: string } | null {
  // find most recent check-in within 36h (yesterday evening / today)
  const cis = [...data.dailyLogs.checkIns].sort((a, b) => (a.date < b.date ? 1 : -1));
  const last = cis[0];
  if (!last) return null;
  const d = new Date(last.date + "T23:00:00");
  if (Date.now() - d.getTime() > 36 * 3600000) return null;

  const load = last.sleepQuality * 1.2 + last.stress + last.loneliness * 0.8 + last.freeTime * 0.6;
  if (load >= 11)
    return {
      level: "elevated",
      message: "اليوم متوسط الحمل — التزم بالحد الأدنى من خطتك وحافظ على روتين الليل.",
    };
  if (load >= 7)
    return {
      level: "moderate",
      message: "اليوم متوسط الحمل — التزم بالحد الأدنى من خطتك وحافظ على بروتوكول الليل.",
    };
  return {
    level: "low",
    message: "ظروفك اليوم مريحة نسبيًا — فرصة جيدة لإنجاز جلسة تركيز واحدة إضافية.",
  };
}
