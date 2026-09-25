/**
 * Scale migration — 1–10 → 1–5 self-reported indicators.
 *
 * The app moved its self-reported indicators (urge / proximity / control,
 * the resulting state degree, and the evening check-in highest urge) from a
 * 1–10 scale to a 1–5 behavioral ladder. Old localStorage state and old
 * backups still contain 1–10 values; this module is the SINGLE documented
 * mapping used everywhere legacy values are converted. It is applied in two
 * places (and nowhere else):
 *   1. zustand persist migration (store.ts, storage version 1 → 2)
 *   2. backup import normalization (backup.ts, validateBackup)
 *
 * DOCUMENTED MAPPING (semantic bands, monotonic, no impossible values):
 *
 *   old 1–10 band          meaning                              → new 1–5
 *   1–2                    calm / passing thought                → 1  هدوء
 *   3–4                    mild / growing                        → 2  بداية بسيطة
 *   5–6                    negotiation / approaching             → 3  بدأت تقوى
 *   7–8                    high risk / critical                  → 4  خطر مرتفع
 *   9–10                   severe / crisis                       → 5  على وشك التصرف
 *
 *   i.e.  new = ceil(old / 2)
 *
 * This is NOT the risk-engine redesign (which re-derives levels from 1–5
 * inputs) — it is only the data-compatibility mapping for historical
 * records, chosen so each old band lands on the new level with the same
 * behavioral meaning. Historical events are never dropped; only their
 * numeric representation is converted. Fields that were already 1–5
 * (sleepQuality / stress / loneliness / freeTime) are never touched.
 */

import type { AppData } from "./types";

export const SCALE_MAX = 5;
export const LEGACY_SCALE_MAX = 10;

/** Convert one legacy 1–10 value to the 1–5 ladder (band-preserving). */
export function legacyToScale5(v: number): number {
  return Math.ceil(v / 2);
}

/**
 * Normalize a value from a backup or legacy store:
 * - legacy dataset → always convert (band mapping above)
 * - new dataset → keep as-is, but defensively convert any impossible
 *   value > 5 so the app never persists out-of-range numbers.
 */
export function normalizeScaleValue(v: number, legacyDataset: boolean): number {
  if (legacyDataset || v > SCALE_MAX) return legacyToScale5(v);
  return v;
}

/** True when any risk-scale field anywhere in the dataset exceeds 5. */
export function anyLegacyScaleValue(data: {
  urgeChecks?: unknown[];
  interventionLogs?: unknown[];
  dailyLogs?: { checkIns?: unknown[] };
}): boolean {
  const over = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) && v > SCALE_MAX;
  const checks = (data.urgeChecks ?? []) as { urge?: unknown; proximity?: unknown; control?: unknown; riskLevel?: unknown }[];
  for (const c of checks) {
    if (over(c.urge) || over(c.proximity) || over(c.control) || over(c.riskLevel)) return true;
  }
  const logs = (data.interventionLogs ?? []) as { riskLevel?: unknown }[];
  for (const l of logs) {
    if (over(l.riskLevel)) return true;
  }
  const checkIns = ((data.dailyLogs?.checkIns ?? []) as { highestUrge?: unknown }[]);
  for (const c of checkIns) {
    if (over(c.highestUrge)) return true;
  }
  return false;
}

/**
 * Migrate a FULL AppData from the 1–10 era to the 1–5 era.
 * Used by the store's persist migration (version 1 → 2), where the dataset
 * is known to be legacy. Defensive: unknown/absent arrays pass through.
 */
export function migrateAppDataToScale5(data: AppData): AppData {
  const n = (v: number) => legacyToScale5(v);
  return {
    ...data,
    urgeChecks: (data.urgeChecks ?? []).map((c) => ({
      ...c,
      urge: n(c.urge),
      proximity: n(c.proximity),
      control: n(c.control),
      riskLevel: n(c.riskLevel),
    })),
    interventionLogs: (data.interventionLogs ?? []).map((l) => ({
      ...l,
      riskLevel: n(l.riskLevel),
    })),
    dailyLogs: {
      ...data.dailyLogs,
      // highestUrge was 1–10; sleepQuality/stress/loneliness/freeTime were
      // already 1–5 and must NOT be converted.
      checkIns: (data.dailyLogs?.checkIns ?? []).map((c) => ({
        ...c,
        highestUrge: n(c.highestUrge),
      })),
    },
  };
}
