import { INTERVENTIONS, INTERVENTION_BY_ID } from "@/data/app/interventions";
import type {
  AppData,
  Intervention,
  UrgeContext,
} from "./types";

/**
 * Intervention Engine — spec sections 12, 61, 62.
 * Selection considers: risk level, trigger, environment, device requirement,
 * aloneness, recency (avoid repeats), and personal success history
 * (prefer what worked — but don't force one that keeps failing).
 */

export interface InterventionQuery {
  riskLevel: number;
  triggerIds: string[];
  context: Partial<UrgeContext>;
  data: AppData;
  excludeIds?: string[];
}

export function selectIntervention(query: InterventionQuery): Intervention {
  const scored = INTERVENTIONS.map((iv) => ({
    iv,
    score: scoreIntervention(iv, query),
  }))
    .filter((s) => s.score > -Infinity)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return INTERVENTION_BY_ID["close-source"];
  return scored[0].iv;
}

export function selectEscalation(
  previousIds: string[],
  query: InterventionQuery
): Intervention | null {
  // Escalation prefers: toward people / trusted person / stronger options.
  const escalate = INTERVENTIONS.filter(
    (iv) =>
      iv.id === "escalate-to-people" ||
      iv.id === "call-person" ||
      iv.id === "tell-someone" ||
      iv.id === "shared-space" ||
      iv.id === "exercise-burst"
  ).filter((iv) => !previousIds.includes(iv.id));
  if (escalate.length === 0) return null;
  const scored = escalate
    .map((iv) => ({ iv, score: scoreIntervention(iv, query) }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.iv ?? null;
}

function scoreIntervention(iv: Intervention, query: InterventionQuery): number {
  const { riskLevel, triggerIds, context, data, excludeIds } = query;
  let score = 0;

  // Risk-range fit (hard requirement-ish)
  const [lo, hi] = iv.riskLevels;
  if (riskLevel < lo) score -= 6 * (lo - riskLevel);
  if (riskLevel > hi) score -= 3 * (riskLevel - hi);

  // Trigger relevance
  const triggerMatch =
    iv.triggers.includes("any") || triggerIds.some((t) => iv.triggers.includes(t));
  if (triggerMatch) score += 3;
  if (triggerIds.some((t) => (iv.tags ?? []).includes(t))) score += 2.5;

  // Environment fit
  const ctx: UrgeContext = {
    alone: false,
    lateNight: false,
    inBed: false,
    browsingStarted: false,
    deviceNeededNow: false,
    ...context,
  };
  if (ctx.alone && !iv.aloneSuitable) score -= 2;
  if (ctx.inBed && (iv.tags ?? []).includes("bed")) score += 2;
  if (ctx.lateNight && (iv.tags ?? []).includes("late-night")) score += 1.5;
  if (ctx.browsingStarted && iv.family === "cut-chain") score += 3;

  // Work-Safe: if device needed now, prefer work-safe, penalize phone-put-away types
  if (ctx.deviceNeededNow) {
    if (iv.workSafe) score += 2;
    if (!iv.workSafe) score -= 4;
    if (iv.id === "work-safe-lock") score += 3;
  } else {
    if (iv.id === "phone-away" && (triggerIds.includes("phone-habit") || triggerIds.includes("scrolling")))
      score += 2;
  }

  // Spiritual interventions only when enabled — handled by caller filtering tags,
  // but keep a soft guard here too via id allowlist.
  const spiritualIds = ["wudu", "prayer-2", "dhikr-anchor"];
  if (spiritualIds.includes(iv.id) && !data.settings.spiritualContent) score -= 12;

  // Personal history: success boosts, failure penalizes (bounded)
  const history = data.interventionLogs.filter((l) => l.interventionId === iv.id);
  const successes = history.filter((h) => h.success).length;
  const failures = history.filter((h) => h.success === false).length;
  score += Math.min(successes * 2, 6);
  score -= Math.min(failures * 1.5, 6);

  // Recency: avoid the exact same intervention used in the last 24h
  const lastUse = history
    .map((h) => new Date(h.ts).getTime())
    .sort((a, b) => b - a)[0];
  if (lastUse && Date.now() - lastUse < 86400000) score -= 1.5;
  if (excludeIds?.includes(iv.id)) score -= 50;

  // Higher risk (degree ≥ 4 — immediate/crisis zone) → prefer simple, fast,
  // cut-chain actions; avoid long ones. Low degree → state-change is enough.
  if (riskLevel >= 4 && iv.family === "cut-chain") score += 2;
  if (riskLevel >= 4 && iv.durationSec && iv.durationSec > 900) score -= 2;
  if (riskLevel <= 2 && iv.family === "change-state") score += 1;

  return score;
}

export function interventionById(id: string): Intervention | undefined {
  return INTERVENTION_BY_ID[id];
}

/** The single emergency step-3 intervention, honoring work-safe needs. */
export function emergencyIntervention(query: InterventionQuery): Intervention {
  return selectIntervention(query);
}
