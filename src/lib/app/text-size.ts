/**
 * In-app text-size accessibility preference — device-local only.
 *
 * Three levels scale the ROOT font size by percentage (not absolute px), so
 * the browser/OS default text-size multiplier stays as the base:
 *   عادي 100% · كبير 125% · أكبر 150%
 *
 * Persistence is a dedicated localStorage key (`istiaada-text-size`):
 * deliberately OUTSIDE AppSettings — it never joins backup/export/import
 * and is not part of the backup schema, so it survives data import/restore
 * and full erase (resetApp rewrites only the zustand state key) while the
 * preference itself never leaks into another device's backup.
 *
 * Application timeline (no visible jump):
 *   1. layout.tsx renders a pre-hydration inline script that sets
 *      documentElement.style.fontSize before any content paints;
 *   2. AppRoot re-applies on mount as belt-and-braces;
 *   3. Settings applies changes immediately via setTextSize().
 */

export const TEXT_SIZE_KEY = "istiaada-text-size";

export const TEXT_SIZE_LEVELS = [
  { id: "normal", label: "عادي", scale: "100%" },
  { id: "large", label: "كبير", scale: "125%" },
  { id: "xlarge", label: "أكبر", scale: "150%" },
] as const;

export type TextSizeId = (typeof TEXT_SIZE_LEVELS)[number]["id"];

const VALID_IDS: ReadonlySet<string> = new Set(
  TEXT_SIZE_LEVELS.map((l) => l.id)
);

/** Stored preference with defensive validation; unknown values read as عادي. */
export function getStoredTextSize(): TextSizeId {
  if (typeof window === "undefined") return "normal";
  try {
    const v = window.localStorage.getItem(TEXT_SIZE_KEY);
    return VALID_IDS.has(v ?? "") ? (v as TextSizeId) : "normal";
  } catch {
    return "normal";
  }
}

/** The root font-size percentage for a level. */
export function scaleForTextSize(id: TextSizeId): string {
  return TEXT_SIZE_LEVELS.find((l) => l.id === id)?.scale ?? "100%";
}

/** Sets the root font-size percentage on <html> (rem-based UI follows). */
export function applyTextSize(id: TextSizeId): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.fontSize = scaleForTextSize(id);
}

/** Persists + applies immediately. Storage failures fall back to this session. */
export function setTextSize(id: TextSizeId): void {
  try {
    window.localStorage.setItem(TEXT_SIZE_KEY, id);
  } catch {
    /* private mode / storage blocked — keep the change for this session */
  }
  applyTextSize(id);
}
