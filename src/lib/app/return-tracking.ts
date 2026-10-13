/**
 * GAP-01 / NEED-030 — Return-after-absence tracking (device-local only).
 *
 * The app can feel punishing to a user who comes back after days or weeks:
 * counters and cards that assume continuous daily presence. This module
 * answers exactly one question, once per app load, without creating any
 * behavioral record beyond a single opaque timestamp:
 *
 *   "Did the user just come back after a long absence?"
 *
 * Design rules (from the approved recovery-continuity scope):
 *   - The ONLY stored artifact is one ISO timestamp under a dedicated
 *     localStorage key. It is NOT part of AppData, NOT part of the zustand
 *     persisted state, NOT in the backup envelope, never exported, and
 *     never rendered. No absence durations are displayed anywhere.
 *   - The threshold is 7 days (the approved default).
 *   - Evaluation is self-guarding: it stamps "now" on every evaluation, so
 *     re-renders, re-mounts (navigating away and back), and reloads can
 *     never re-qualify the same return — the next qualification requires
 *     ANOTHER genuine ≥7-day absence.
 *   - Illogical clock states (record in the future, corrupt value, storage
 *     blocked) degrade to "no absence" — never to a fabricated gap, never
 *     to an error.
 *   - A full app reset clears the key too: a user who erased everything
 *     starts fresh and must not be greeted as "returning".
 */

export const LAST_OPEN_KEY = "istiaada-last-open-v1";

/** Absence length (whole local days) that qualifies a "welcome back". */
export const RETURN_ABSENCE_THRESHOLD_DAYS = 7;

function safeStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Last recorded open as ISO string; null when absent/corrupt/unavailable. */
export function readLastOpenIso(): string | null {
  const ls = safeStorage();
  if (!ls) return null;
  try {
    const raw = ls.getItem(LAST_OPEN_KEY);
    if (!raw) return null;
    return Number.isFinite(new Date(raw).getTime()) ? raw : null;
  } catch {
    return null;
  }
}

export function writeLastOpen(now: Date = new Date()): void {
  const ls = safeStorage();
  if (!ls) return;
  try {
    ls.setItem(LAST_OPEN_KEY, now.toISOString());
  } catch {
    /* storage blocked — tracking silently unavailable */
  }
}

/** Full app reset path: the returning-user state is usage data, not a
 *  preference — it is erased with everything else (unlike the text-size
 *  preference, which deliberately survives). */
export function clearLastOpen(): void {
  const ls = safeStorage();
  if (!ls) return;
  try {
    ls.removeItem(LAST_OPEN_KEY);
  } catch {
    /* nothing to do */
  }
}

/**
 * Whole LOCAL days between the recorded open and `now`, floored at 0.
 * A record in the future (device clock changed backwards) reads as 0 —
 * the honest answer is "no absence", never a negative or huge number.
 */
export function daysSinceOpen(lastIso: string, now: Date = new Date()): number {
  const a = new Date(lastIso);
  if (Number.isNaN(a.getTime())) return 0;
  const b = new Date(now.getTime());
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

export interface ReturnEvaluation {
  /** True only when the user just returned after ≥ threshold days away. */
  qualified: boolean;
  /** Days since the PREVIOUS open (null on very first open). Never shown. */
  days: number | null;
}

/**
 * The once-per-load gate — called from HomeScreen's mount effect (Home is
 * the boot screen of every app load: `screen` is not persisted). Reads the
 * previous open, decides, and stamps NOW before returning:
 *   - first open ever                → not qualified (days null);
 *   - absence < threshold            → not qualified;
 *   - absence ≥ threshold            → qualified;
 *   - reload / re-mount / navigation → the stamp is already "now", so the
 *     evaluation degrades to "no absence" with zero extra state.
 */
export function evaluateReturn(now: Date = new Date()): ReturnEvaluation {
  const last = readLastOpenIso();
  writeLastOpen(now);
  if (last == null) return { qualified: false, days: null };
  const days = daysSinceOpen(last, now);
  return { qualified: days >= RETURN_ABSENCE_THRESHOLD_DAYS, days };
}
