"use client";

import { useAppStore, type ScreenId } from "./store";

/**
 * Back navigation — Hybrid C (browser-history-backed internal stack).
 *
 * The Zustand store keeps being the single source of truth for the current
 * screen; this module MIRRORS that state into the browser's session history
 * so the physical/device Back key walks the app's own navigation stack
 * instead of leaving the application:
 *
 *   Home → Settings → Back → Home
 *   Home → Progress → Knowledge → Back → Progress → Back → Home
 *
 * Constraints honored here:
 *   - The URL stays exactly "/" (entries are pushed without a url argument).
 *   - No Next router, no per-screen routes, no ScreenId changes.
 *   - The internal stack is NEVER persisted as app data (history entries are
 *     browser session state; a fresh boot reconciles them away).
 *   - Home is the root: Back beyond the root entry falls through to the
 *     browser's normal behavior (leaving the page). Nothing is hijacked.
 *
 * Overlays (More sheet, dialogs, emergency) hold one sentinel entry each
 * while open, so Back closes the overlay FIRST and only then keeps walking
 * the screen stack. Emergency keeps its ACT-FIRST semantics untouched —
 * Back performs exactly the overlay's own honest exit (stopEmergency only).
 *
 * History entries written by this module carry { __istiaada: true, i, ... }.
 * `i` is this session's push counter — it counts contiguously from the root
 * entry, which is what the reload reconciliation relies on.
 */

export type OverlayKind =
  | "more"
  | "emergency"
  | "dialog"
  | "alert-dialog";

interface NavEntryState {
  __istiaada: true;
  /** Push counter within this session (root = 0). */
  i: number;
  /** Screen entry: the internal screen this history step represents. */
  screen?: ScreenId;
  /** Sentinel entry: the open overlay this history step holds. */
  overlay?: OverlayKind;
}

interface RegisteredOverlay {
  kind: OverlayKind;
  close: () => void;
}

// Active while the app shell is mounted (the popstate listener + store
// subscription are attached). Overlays rendered outside the shell (e.g. the
// onboarding restore dialog) intentionally keep the previous behavior.
let active = false;
// Boot reconciliation runs once per document (survives StrictMode remounts).
let booted = false;
// `i` of the entry we believe is current.
let seq = 0;
// The state of the entry we believe is current — the entry a popstate just
// LEFT is what decides whether an overlay must be closed.
let current: NavEntryState | null = null;
// popstate → store write in flight: the subscription must not re-push it.
let applyingHistory = false;
// Overlays currently open, bottom → top (modal exclusivity keeps this at
// one entry; nested dialog + confirm-alert is the one real two-entry case).
const openOverlays: RegisteredOverlay[] = [];

function isMarked(st: unknown): st is NavEntryState {
  return (
    typeof st === "object" &&
    st !== null &&
    (st as { __istiaada?: unknown }).__istiaada === true
  );
}

function screenEntry(screen: ScreenId, i: number): NavEntryState {
  return { __istiaada: true, i, screen };
}

function overlayEntry(kind: OverlayKind, i: number): NavEntryState {
  return { __istiaada: true, i, overlay: kind };
}

function readState(): NavEntryState | null {
  const st = window.history.state;
  return isMarked(st) ? st : null;
}

/**
 * Screen changed via the store (navigate() call from anywhere — shell,
 * screens, emergency links). Creates exactly one history step, except:
 *   - same-screen set() (tapping the current tab) pushes nothing;
 *   - if the current entry is an overlay sentinel, the navigation is
 *     happening while that overlay closes (More-sheet card, emergency's
 *     «حصلت زلّة؟» link) — it takes over the sentinel's slot so no dead
 *     entry is left behind.
 */
function pushScreenEntry(screen: ScreenId) {
  const st = readState();
  if (st && st.overlay) {
    window.history.replaceState(screenEntry(screen, st.i), "");
    seq = st.i;
    current = screenEntry(screen, st.i);
    return;
  }
  seq += 1;
  window.history.pushState(screenEntry(screen, seq), "");
  current = screenEntry(screen, seq);
}

function onPop(e: PopStateEvent) {
  const left = current;
  const next = e.state;

  // 1) We LEFT an overlay's sentinel and that overlay is still open → the
  //    user pressed Back while the overlay was on top: close it (it must be
  //    the topmost registered one). If it is no longer registered, this
  //    popstate is just the deferred cleanup back() after a UI dismissal —
  //    close nothing.
  if (left && left.overlay) {
    const top = openOverlays[openOverlays.length - 1];
    if (top && top.kind === left.overlay) {
      openOverlays.pop();
      top.close();
    }
  }

  // 2) Adopt the landed entry and restore the internal screen. Landing on a
  //    sentinel (forward onto an already-closed overlay's ghost) or outside
  //    our mirrored entries applies nothing — the app stays where it is.
  current = isMarked(next) ? next : null;
  seq = current ? current.i : 0;
  if (current && typeof current.screen === "string") {
    applyingHistory = true;
    try {
      useAppStore.setState({ screen: current.screen });
    } finally {
      applyingHistory = false;
    }
  }
}

/**
 * Attach the history mirroring for the app shell. Returns the cleanup
 * (unsubscribe + remove listener). Boot reconciliation:
 *   - Fresh load: the page-load entry becomes our root entry
 *     (replaceState) — no ghost entries are created, and Back from the root
 *     keeps the browser's default exit behavior.
 *   - Reload mid-session: the current entry still carries our marker with
 *     its depth `i`; `go(-i)` jumps back to that session's root (always
 *     screen "home", which is also where the fresh boot starts — nothing
 *     visibly changes). Every stale entry above becomes forward-only, so
 *     Back never resurrects a ghost screen.
 */
export function initNavHistory(): () => void {
  if (active) return () => {};
  active = true;

  if (!booted) {
    booted = true;
    const st = readState();
    if (st && st.i > 0) {
      window.history.go(-st.i);
    } else if (!st) {
      window.history.replaceState(screenEntry("home", 0), "");
    }
    // else: reload exactly at the root — the existing root entry is already
    // what a fresh boot needs (screen "home", i = 0).
  }

  current = readState() ?? screenEntry("home", 0);
  seq = current.i;

  window.addEventListener("popstate", onPop);
  const unsubscribe = useAppStore.subscribe((s, prev) => {
    if (applyingHistory || s.screen === prev.screen) return;
    pushScreenEntry(s.screen);
  });

  return () => {
    window.removeEventListener("popstate", onPop);
    unsubscribe();
    openOverlays.length = 0;
    active = false;
  };
}

/**
 * An overlay opened (More sheet, dialog, alert dialog, emergency). While it
 * is open it holds one sentinel history entry so Back closes it first. The
 * close callback must perform the overlay's own dismissal exactly (Radix
 * onOpenChange(false), setMoreOpen(false), stopEmergency()).
 */
export function overlayOpened(kind: OverlayKind, close: () => void) {
  if (!active) return;
  const existing = openOverlays.findIndex((o) => o.kind === kind);
  if (existing >= 0) {
    // Already holding a sentinel (re-render / re-run) — keep the entry.
    openOverlays[existing] = { kind, close };
    return;
  }
  const st = readState();
  if (st && st.overlay) {
    if (openOverlays.some((o) => o.kind === st.overlay)) {
      // Genuinely nested (import dialog + its confirm alert): stack on top.
      seq += 1;
      window.history.pushState(overlayEntry(kind, seq), "");
    } else {
      // Sequential hand-off in one commit (More sheet → SOS): the previous
      // overlay is closing and its sentinel slot is free — take it over
      // instead of leaving a dead mid-stack entry.
      window.history.replaceState(overlayEntry(kind, st.i), "");
      seq = st.i;
    }
  } else {
    seq += 1;
    window.history.pushState(overlayEntry(kind, seq), "");
  }
  current = overlayEntry(kind, seq);
  openOverlays.push({ kind, close });
}

/**
 * An overlay closed from the UI side (Escape, backdrop, close button, an
 * explicit exit control, or a screen navigation replacing its slot). Keeps
 * the browser history in sync: if the overlay's sentinel is still the
 * current entry it is popped, so Back afterwards matches the overlay stack.
 * A close initiated by Back itself (popstate) never lands here with the
 * sentinel current — history already moved.
 */
export function overlayClosedViaUI(kind: OverlayKind) {
  if (!active) return;
  const idx = openOverlays.findIndex((o) => o.kind === kind);
  if (idx < 0) return; // never opened here, or already closed via Back
  openOverlays.splice(idx, 1);
  const st = readState();
  if (st && st.overlay === kind) {
    // Deferred one microtask: another overlay may take this slot in the same
    // commit (More sheet → SOS hand-off). If the slot was taken over, the
    // pop is skipped. There is no double-pop: this runs at most once per
    // dismissal and only while our sentinel is still current.
    queueMicrotask(() => {
      const now = readState();
      if (now && now.overlay === kind) window.history.back();
    });
  }
  // Otherwise history already moved off the sentinel (Back closed the
  // overlay, or a screen navigation took over its slot) — nothing to do.
}
