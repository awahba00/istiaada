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

/**
 * F5 — the spiritual gate is a HARD eligibility constraint, not a score
 * penalty. When settings.spiritualContent is off, spiritual interventions
 * are removed from the candidate set ENTIRELY (both the normal selection
 * and the escalation set, at every fallback level). No amount of success
 * history, context fit, or competitor exclusion can surface one: a user
 * who opted out of spiritual content must never be handed a spiritual
 * practice in a crisis moment. The old soft −12 penalty could still lose
 * to a strong-enough context, which is exactly the leak this closes.
 */
export const SPIRITUAL_INTERVENTION_IDS = ["wudu", "prayer-2", "dhikr-anchor"];

export function isSpiritualIntervention(iv: Intervention): boolean {
  return SPIRITUAL_INTERVENTION_IDS.includes(iv.id);
}

/**
 * F3 — the FIXED ACT-FIRST protocol steps EmergencyMode walks every session
 * through BEFORE the recommended step-3 intervention: step 1 «اقفل المصدر»
 * (close-source) and step 2 «اخرج من المكان لأي مكان فيه ناس أو حركة»
 * (leave-room / shared-space). They are seeded into the session's exclusion
 * set so the step-3 recommendation never repeats an action the user has
 * already completed in this same session.
 */
export const ACT_FIRST_FIXED_ACTION_IDS = [
  "close-source",
  "leave-room",
  "shared-space",
] as const;

/**
 * Eligibility for THIS user's settings: everything except spiritual
 * interventions when the gate is closed. Shared by the engine selectors
 * and by the UI's swap-exhaustion check so both agree on what "no candidate
 * left" means (otherwise the swap loop could keep walking over spiritual
 * ids the engine would never recommend, and the terminal state would be
 * unreachable for gate-closed users).
 */
export function isEligibleIntervention(iv: Intervention, data: AppData): boolean {
  return data.settings.spiritualContent || !isSpiritualIntervention(iv);
}

export function selectIntervention(query: InterventionQuery): Intervention {
  const scored = INTERVENTIONS.filter((iv) => isEligibleIntervention(iv, query.data))
    .map((iv) => ({
      iv,
      score: scoreIntervention(iv, query),
    }))
    .filter((s) => s.score > -Infinity)
    .sort((a, b) => b.score - a.score);

  // Fallback: documented, non-spiritual default (stays honest even when
  // everything is excluded — the UI's exhaustion guard decides what the
  // user actually sees).
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
  )
    // F5 — same hard eligibility as the normal selection: the escalation
    // set is non-spiritual today, but the constraint is enforced here too
    // so the invariant cannot silently break if the set ever changes.
    .filter((iv) => isEligibleIntervention(iv, query.data))
    .filter((iv) => !previousIds.includes(iv.id));
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

  // Spiritual eligibility is a HARD filter applied before scoring (see
  // isEligibleIntervention) — no penalty here, no soft path around the
  // user's explicit setting.

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
