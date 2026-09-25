import { clamp } from "./helpers";
import type { RiskAssessment, UrgeContext } from "./types";
import { MODE_LABELS, RISK_LEVELS, RISK_MODES } from "@/data/app/taxonomy";

/**
 * Risk Engine — 1–5 behavioral ladder.
 *
 * The 1–5 value is a SELF-REPORTED STATE DEGREE (درجة الحالة) built from the
 * user's current answers. It is NOT a medical measurement, NOT a probability,
 * NOT a prediction, and must never be presented as one anywhere in the UI.
 *
 * The three self-reported dimensions (each 1–5):
 *   urge (شدة الرغبة) — intensity only
 *   proximity (قرب التصرف) — closeness to acting
 *   control (فقدان السيطرة) — loss of control (5 = almost unable to stop)
 * plus behavioral context markers.
 *
 * ————————————————— THRESHOLDS (documented, deterministic) —————————————————
 *
 * Deterministic rule ladder (applied in fixed order):
 *
 *   1. Weighted base — proximity dominates, then control, then intensity:
 *        raw = 0.45·proximity + 0.30·control + 0.25·urge
 *
 *   2. Context bonus (window of vulnerability, capped at +0.75):
 *        alone +0.25 · lateNight +0.25 · inBed +0.5
 *        → combined contexts can lift the degree by at most ~1 level.
 *
 *   3. Arithmetic cap: the weighted+context result is clamped to [1, 4].
 *      Arithmetic alone can NEVER produce 5 — the top degree is reserved
 *      for an explicit behavioral state (rule 5).
 *
 *   4. Behavioral floors — direct self-reported states override arithmetic
 *      upward (they can only RAISE the degree, never lower it):
 *        browsingStarted              → at least 4  (the chain has physically started)
 *        proximity ≥ 4 OR control = 5 → at least 4  (high risk / immediate zone)
 *
 *   5. Level 5 — على وشك التصرف (genuinely immediate behavioral state):
 *        proximity = 5 AND control = 5
 *      i.e. the user reports being at the point of acting together with
 *      near-total perceived loss of control. Urge intensity plays NO part in
 *      reaching 5 — the highest state can never be reached merely because of
 *      urge intensity alone. Level 5 is deliberately strict and is not made
 *      easier to reach merely to "complete" the scale.
 *
 * Degree → intervention mode mapping (see RISK_MODES in taxonomy.ts):
 *   1–2 → awareness   (1: nothing urgent · 2: early awareness, light step)
 *   3   → interrupt   (early intervention step)
 *   4   → immediate   (intervene now; "emergency" instead when the chain has
 *                      physically started — browsingStarted — because the
 *                      cut-source-first overlay is the right response then)
 *   5   → maximum     (crisis — maximum immediate intervention)
 */

export interface RiskInput {
  urge: number;
  proximity: number;
  control: number;
  context?: Partial<UrgeContext>;
}

const CATEGORY_BY_LEVEL: Record<number, string> = Object.fromEntries(
  RISK_LEVELS.map((r) => [r.level, r.label])
);

const LEVEL_CATEGORY_ID: Record<number, string> = {
  1: "calm",
  2: "early",
  3: "growing",
  4: "high-risk",
  5: "imminent",
};

export function calculateRisk(input: RiskInput): RiskAssessment {
  const { urge, proximity, control } = input;
  const ctx: UrgeContext = {
    alone: false,
    lateNight: false,
    inBed: false,
    browsingStarted: false,
    deviceNeededNow: false,
    ...input.context,
  };

  // (1) Weighted base: proximity to acting is the strongest signal,
  // then loss of control, then raw intensity.
  const raw = 0.45 * proximity + 0.3 * control + 0.25 * urge;

  // (2) Context modifiers — combined contexts raise the window (≤ +0.75).
  let bonus = 0;
  if (ctx.alone) bonus += 0.25;
  if (ctx.lateNight) bonus += 0.25;
  if (ctx.inBed) bonus += 0.5;
  if (bonus > 0.75) bonus = 0.75;

  // (3) Arithmetic cap — never above 4 (see header: rule 3).
  let level = clamp(Math.round(raw + bonus), 1, 4);

  // (4) Behavioral floors — direct markers of acting-out dominate arithmetic.
  if (ctx.browsingStarted) level = Math.max(level, 4);
  if (proximity >= 4 || control >= 5) level = Math.max(level, 4);

  // (5) Level 5 — على وشك التصرف: at the point of acting with near-total
  // loss of control. Only this explicit behavioral state produces 5.
  if (proximity === 5 && control === 5) level = 5;

  let mode =
    RISK_MODES.find((m) => level >= m.from && level <= m.to)?.mode ?? "awareness";
  // Level 4 with the chain already started → emergency overlay response.
  if (level === 4 && ctx.browsingStarted) mode = "emergency";

  return {
    level,
    category: (LEVEL_CATEGORY_ID[level] ?? "calm") as RiskAssessment["category"],
    categoryLabel: CATEGORY_BY_LEVEL[level],
    recommendedMode: mode as RiskAssessment["recommendedMode"],
    modeLabel: MODE_LABELS[mode],
  };
}

/** Home current-state derivation — spec sections 8, 57. */
export type HomeState = "normal" | "moderate" | "high" | "post-relapse";

/**
 * The last check's outcome decides whether its degree still describes the
 * PRESENT: "pending" is a live, unresolved situation; "escalated" means the
 * user moved to Emergency without confirming resolution (still treated as
 * live); "handled"/"acted" mean the situation closed — the check must stop
 * painting Home red after the user already dealt with it.
 *
 * Degree thresholds (1–5):
 *   high     — degree ≥ 4 (immediate/crisis zone) within the last 3h
 *   moderate — degree = 3 (بدأت تقوى — early-intervention zone) within 3h
 *   normal   — degree 1–2 needs no persistent warning
 */
export function currentHomeState(
  lastRiskLevel: number | null,
  lastCheckTs: string | null,
  lastRelapseTs: string | null,
  relapseReviewed: boolean,
  lastOutcome?: "handled" | "escalated" | "acted" | "pending" | null
): HomeState {
  const now = Date.now();
  if (lastRelapseTs) {
    const hoursSince = (now - new Date(lastRelapseTs).getTime()) / 3600000;
    if (hoursSince < 48 && !relapseReviewed) return "post-relapse";
  }
  const resolved = lastOutcome === "handled" || lastOutcome === "acted";
  if (lastCheckTs && lastRiskLevel != null && !resolved) {
    const hoursSince = (now - new Date(lastCheckTs).getTime()) / 3600000;
    if (hoursSince < 3) {
      if (lastRiskLevel >= 4) return "high";
      if (lastRiskLevel >= 3) return "moderate";
    }
  }
  return "normal";
}

/** Degree 1–2 calm · 3 warning · 4–5 destructive. */
export function riskColorVar(level: number): string {
  if (level <= 2) return "var(--success)";
  if (level === 3) return "var(--warning)";
  return "var(--destructive)";
}

export function riskToneClass(level: number): string {
  if (level <= 2) return "text-success";
  if (level === 3) return "text-warning";
  return "text-destructive";
}
