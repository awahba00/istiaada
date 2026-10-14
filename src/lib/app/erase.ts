/**
 * Truthful full-erase — the device-local half of "امسح كل البيانات".
 *
 * A full erase has TWO halves that must both be true:
 *   1. the zustand persisted state (STORAGE_KEY) is reset by the store's
 *      resetApp() — it rewrites the key with pristine defaults;
 *   2. every OTHER application-owned key that holds USER-AUTHORED content
 *      living outside the zustand state is removed here, explicitly, from
 *      an allowlist.
 *
 * Why an allowlist (not "wipe the origin"): localStorage is per-origin and
 * other things may live in it (a future deployment, an embedded tool). The
 * app erases exactly what the app owns and honestly reports every failure.
 *
 * A1 (audit): `istiaada-values-draft-v1` previously survived the full erase
 * with its free-text values intact. It is now first-class erased data.
 *
 * Display/accessibility preferences deliberately SURVIVE a full erase and
 * the erase confirmation says so: `istiaada-text-size` (a11y) and
 * `istiaada-theme` (next-themes). They are preferences, not recovery data.
 */

import { LAST_OPEN_KEY, clearLastOpen } from "./return-tracking";

/** Free-text values-clarification scratchpad (ValuesScreen). */
export const VALUES_DRAFT_KEY = "istiaada-values-draft-v1";

/**
 * Application-owned localStorage keys that hold user-authored or
 * usage-derived PERSONAL content outside the zustand state. Every full
 * erase removes exactly these (plus the state key reset by the store).
 */
export const USER_CONTENT_STORAGE_KEYS: readonly string[] = [
  VALUES_DRAFT_KEY,
  LAST_OPEN_KEY,
];

/**
 * Application-owned keys that are display/accessibility PREFERENCES.
 * Deliberately preserved by a full erase; the UI must keep saying so.
 */
export const PRESERVED_PREFERENCE_KEYS: readonly string[] = [
  "istiaada-text-size",
  "istiaada-theme",
];

export interface EraseReport {
  /** True only when every user-content key was verifiably removed. */
  ok: boolean;
  /** Keys that could not be removed (storage failure) — reported honestly. */
  failed: string[];
}

function safeStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Removes every user-content key. Storage failures are collected, never
 * swallowed silently: a full erase that could not verify removal must never
 * be reported to the user as complete.
 */
export function eraseUserContentStorage(): EraseReport {
  const failed: string[] = [];
  const ls = safeStorage();
  if (!ls) {
    // Storage unavailable entirely: nothing existed to remove. The zustand
    // state half is still reset by the store, so the erase is complete.
    return { ok: true, failed };
  }
  for (const key of USER_CONTENT_STORAGE_KEYS) {
    try {
      ls.removeItem(key);
    } catch {
      failed.push(key);
    }
  }
  return { ok: failed.length === 0, failed };
}

/** The reset path used by every full-reset entry point (store.resetApp). */
export function eraseAllDeviceLocalUserData(): EraseReport {
  // clearLastOpen() is idempotent with USER_CONTENT_STORAGE_KEYS handling
  // (LAST_OPEN_KEY is in the allowlist) — kept for the GAP-01 doc trail.
  clearLastOpen();
  return eraseUserContentStorage();
}
