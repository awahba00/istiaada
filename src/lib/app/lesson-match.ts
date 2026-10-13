/**
 * GAP-09 / NEED-011 / NEED-019 — reviving the user's own prior lessons at
 * the moment they are needed (urge/emergency), quietly and briefly.
 *
 * The app already stores the raw material: every reviewed relapse carries
 * the user's own cut point + lesson, and every evening check-in carries a
 * daily lesson. Until now those lived in history screens. This module is a
 * PURE read-only matcher that surfaces at most ONE prior lesson relevant
 * to the CURRENT moment — no new records are ever created, nothing is
 * auto-summarized or auto-generated, and nothing is shown when no real
 * match exists.
 *
 * Matching logic (documented, deterministic, testable):
 *   Tier 1 — trigger match: a prior lesson whose recorded trigger id is
 *            among the CURRENT moment's selected trigger ids.
 *   Tier 2 — context match: no trigger matched, and the lesson's trigger
 *            id is the direct situational equivalent of a context flag the
 *            user reports as ON right now (late-night↔lateNight,
 *            bed↔inBed, isolation↔alone). Only exact semantic equivalences
 *            are mapped — browsing flags deliberately have no single
 *            trigger equivalent and are not guessed.
 *   Within a tier: a relapse review outranks a check-in (it carries the
 *   user's own cut point, the most useful artifact at an urge moment);
 *   then the most recent one wins (ISO strings compare chronologically).
 *
 * A matched lesson is an OFFER, not an assertion: the UI always asks
 * ("إيه اللي ساعدك توقف السلسلة؟") and the user can ignore it.
 */

import { TRIGGERS } from "@/data/app/taxonomy";
import type { AppData } from "./types";

/** Context flags with an exact trigger-id equivalent. */
const CONTEXT_TRIGGER_MAP: Record<string, "lateNight" | "inBed" | "alone"> = {
  "late-night": "lateNight",
  bed: "inBed",
  isolation: "alone",
};

export interface LessonContextInput {
  /** Trigger ids selected for the current moment (may be empty). */
  triggerIds: string[];
  /** Context flags reported for the current moment (may be omitted). */
  context?: {
    lateNight?: boolean;
    inBed?: boolean;
    alone?: boolean;
  };
}

export interface RelevantLesson {
  source: "relapse-review" | "check-in";
  /** The trigger id that made this lesson relevant. */
  matchedTriggerId: string;
  matchKind: "trigger" | "context";
  /** The user's own recorded cut point (empty for check-in lessons). */
  cutPoint: string;
  /** The user's own recorded lesson — guaranteed non-empty. */
  lesson: string;
  /** Recency anchor (ISO) — the review ts, or the check-in day's evening. */
  ts: string;
}

const isKnownTriggerId = (id: string): boolean =>
  TRIGGERS.some((t) => t.id === id);

function collectCandidates(data: AppData): RelevantLesson[] {
  const out: RelevantLesson[] = [];
  for (const e of data.relapseEvents) {
    // Only COMPLETED reviews carry the user's own words; unreviewed
    // events are mid-flow and never surfaced as "your prior lesson".
    if (!e.reviewed || !e.review) continue;
    const lesson = e.review.lesson.trim();
    if (!lesson) continue;
    const trig = e.review.trigger;
    if (!trig || !isKnownTriggerId(trig)) continue;
    out.push({
      source: "relapse-review",
      matchedTriggerId: trig,
      matchKind: "trigger",
      cutPoint: e.review.cutPoint.trim(),
      lesson,
      ts: e.ts,
    });
  }
  for (const c of data.dailyLogs.checkIns) {
    const lesson = c.lesson.trim();
    if (!lesson) continue;
    const trig = c.mainTrigger;
    if (!trig || !isKnownTriggerId(trig)) continue;
    out.push({
      source: "check-in",
      matchedTriggerId: trig,
      matchKind: "trigger",
      // Evening check-ins have no cut point — never fabricated.
      cutPoint: "",
      lesson,
      // The check-in is written for that day's evening; its date key is
      // the honest recency anchor (time-of-day was never recorded).
      ts: `${c.date}T23:00:00`,
    });
  }
  return out;
}

function pickBest(list: RelevantLesson[], matchKind: "trigger" | "context"): RelevantLesson | null {
  if (list.length === 0) return null;
  const sorted = [...list].sort((a, b) => {
    // Relapse reviews outrank check-ins: they carry the user's own
    // cut point — the most useful artifact at the moment of an urge.
    if (a.source !== b.source) return a.source === "relapse-review" ? -1 : 1;
    // Then the most recent lesson wins (ISO sorts chronologically).
    return b.ts < a.ts ? -1 : b.ts > a.ts ? 1 : 0;
  });
  return { ...sorted[0], matchKind };
}

/**
 * At most ONE lesson relevant to the current moment, or null when nothing
 * genuinely matches (no card, no empty state, no fabrication).
 */
export function findRelevantLesson(
  data: AppData,
  input: LessonContextInput
): RelevantLesson | null {
  const candidates = collectCandidates(data);
  if (candidates.length === 0) return null;

  const triggerMatched = candidates.filter((c) =>
    input.triggerIds.includes(c.matchedTriggerId)
  );
  if (triggerMatched.length > 0) return pickBest(triggerMatched, "trigger");

  const contextMatched = candidates.filter((c) => {
    const flag = CONTEXT_TRIGGER_MAP[c.matchedTriggerId];
    return flag != null && input.context?.[flag] === true;
  });
  if (contextMatched.length > 0) return pickBest(contextMatched, "context");

  return null;
}

/**
 * The most recent personal lesson with no matching requirement — used by
 * the return-after-absence card, where "suitable" simply means "words the
 * user wrote themselves, latest first". Same no-fabrication rule: null
 * when the user never wrote any lesson.
 */
export function findLatestLesson(data: AppData): RelevantLesson | null {
  const candidates = collectCandidates(data);
  if (candidates.length === 0) return null;
  const sorted = [...candidates].sort((a, b) => {
    if (a.source !== b.source) return a.source === "relapse-review" ? -1 : 1;
    return b.ts < a.ts ? -1 : b.ts > a.ts ? 1 : 0;
  });
  return { ...sorted[0], matchKind: "trigger" };
}
