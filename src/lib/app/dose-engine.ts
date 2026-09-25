import { KNOWLEDGE } from "@/data/app/knowledge";
import { dayKey, seededPick } from "./helpers";
import type { AppData, KnowledgeItem } from "./types";

/**
 * Daily Dose Engine — spec sections 31, 32, 63.
 * Personalization priority (current needs over journey day):
 *   1. recent relapse → relapse / self-compassion content
 *   2. current elevated risk → urges / emergency-skills / triggers
 *   3. frequent recent triggers → matching topic tags
 *   4. journey stage match + user preference
 *   5. non-repetition
 * Journey day is NOT recovery state (day 300 + relapse → relapse content).
 */

export interface DoseContext {
  date?: string;
  data: AppData;
}

export function selectDailyDose(ctx: DoseContext): KnowledgeItem {
  const data = ctx.data;
  const date = ctx.date ?? dayKey();
  const spiritualOn = data.settings.spiritualContent;

  let pool = KNOWLEDGE.filter((k) => spiritualOn || !k.spiritual);

  const journeyDay = Math.max(
    1,
    Math.floor(
      (Date.now() - new Date(data.journey.startDate).setHours(0, 0, 0, 0)) /
        86400000
    ) + 1
  );

  // Score every item
  const scored = pool.map((item) => {
    let score = 0;

    // 1. Recent relapse (7 days) dominates
    const recentRelapse = data.relapseEvents.filter(
      (r) => Date.now() - new Date(r.ts).getTime() < 7 * 86400000
    );
    if (recentRelapse.length > 0) {
      if (item.category === "relapse") score += 100;
      if (item.category === "self-compassion") score += 90;
      if (item.category === "prevention") score += 60;
    }

    // 2. Current risk from last check (today) — 1–5 degrees:
    //    ≥ 4 immediate/crisis zone · 3 growing zone
    const todayChecks = data.urgeChecks.filter((c) => dayKey(c.ts) === date);
    const maxRiskToday = todayChecks.reduce((m, c) => Math.max(m, c.riskLevel), 0);
    if (maxRiskToday >= 4) {
      if (item.category === "emergency-skills") score += 80;
      if (item.category === "urges") score += 70;
    } else if (maxRiskToday >= 3) {
      if (item.category === "triggers") score += 50;
      if (item.category === "urges") score += 45;
      if (item.category === "environment") score += 30;
    }

    // 3. Frequent triggers in last 14 days
    const since = Date.now() - 14 * 86400000;
    const triggerCounts = new Map<string, number>();
    for (const c of data.urgeChecks) {
      if (new Date(c.ts).getTime() > since)
        for (const t of c.triggers) triggerCounts.set(t, (triggerCounts.get(t) ?? 0) + 1);
    }
    for (const r of data.relapseEvents) {
      if (new Date(r.ts).getTime() > since)
        for (const t of r.triggers) triggerCounts.set(t, (triggerCounts.get(t) ?? 0) + 1);
    }
    const topTriggers = [...triggerCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t]) => t);
    if (topTriggers.some((t) => item.tags.includes(t))) score += 40;

    // 4. Journey stage preference
    const stage =
      journeyDay <= 14
        ? "early"
        : journeyDay <= 90
          ? "mid"
          : "late";
    if (item.stage === stage) score += 15;
    if (item.stage === "any") score += 8;

    // 5. User support preference nudge
    const prefs = data.userProfile.supportPrefs;
    if (prefs.includes("science") && item.category === "brain-behavior") score += 6;
    if (prefs.includes("practical") && (item.category === "prevention" || item.category === "emergency-skills")) score += 6;
    if (prefs.includes("psychological") && (item.category === "emotions" || item.category === "self-compassion")) score += 6;
    if (prefs.includes("spiritual") && item.category === "spiritual") score += 8;

    // 6. Non-repetition (last 10 days of dose log)
    const recentIds = data.dailyLogs.doseLog
      .filter((d) => Date.now() - new Date(d.date).getTime() < 10 * 86400000)
      .map((d) => d.itemId);
    if (recentIds.includes(item.id)) score -= 60;

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3);
  pool = top.map((s) => s.item);
  if (pool.length === 0) pool = [KNOWLEDGE[0]];
  return seededPick(pool, date);
}

export function doseStatusFor(
  data: AppData,
  date = dayKey()
): { item: KnowledgeItem | null; status: "none" | "pending" | "done" | "skipped" } {
  const entry = data.dailyLogs.doseLog.find((d) => d.date === date);
  if (!entry) return { item: null, status: "none" };
  return {
    item: KNOWLEDGE.find((k) => k.id === entry.itemId) ?? null,
    status: entry.status,
  };
}
