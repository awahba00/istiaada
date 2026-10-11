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
 * Nav-Bar destination switches (bottom tabs, «المزيد» sheet cards, desktop
 * sidebar — every entry of NAV_ITEMS, all funnelled through AppShell's go()
 * with navigate(s, "nav")) are NOT drill-downs: the user is choosing where
 * to BE, not stepping into a child page. Selecting a destination replaces
 * the current stack position instead of growing the stack, so Back returns
 * to the logical parent (the home root) — never to a chain of pages the
 * user already left behind. Selecting «الرئيسية» collapses to the root: the
 * next Back falls through to the REAL exit (browser history's own behavior
 * past our root entry — no scripted page closing, no invented exit).
 * Re-selecting the current destination changes nothing (no duplicates).
 *
 * Implementation: entries below a replaced position are not deletable (the
 * history API can only replace/append), so they are marked "ghosted" for
 * the session and the Back walk skips them — one history.back() per
 * popstate hop, walking one step at a time. No history.go(-N), no history
 * wipe, no entry is ever resurrected: Forward onto a ghost is ignored.
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
  /**
   * Nav-Bar collapse marker (screen entries only). 0 = a Back walk from
   * this entry must land on the ROOT entry (dead intermediates are skipped);
   * -1 = the walk falls through PAST the root to the real exit (the user
   * chose «الرئيسية» from the Nav Bar: home is the current destination, so
   * Back beyond it belongs to the browser, not to old screens). Absent = a
   * natural entry: Back lands on the physically previous entry.
   */
  backTo?: 0 | -1;
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
// Depths of entries that are permanently dead for Back walking (victims of
// a Nav-Bar collapse). Entries cannot be deleted from the history stack, so
// the Back walk skips them one hop at a time; Forward onto one is ignored.
// Session-only — a reload reconciles everything to the root anyway.
const ghosted = new Set<number>();
// Overlays currently open, bottom → top (modal exclusivity keeps this at
// one entry; nested dialog + confirm-alert is the one real two-entry case).
const openOverlays: RegisteredOverlay[] = [];
// F4-return — while a focus-opened Knowledge dialog is showing, the screen
// the user opened it from (Daily Dose for previous-dose rows). Set when the
// focus navigation is suppressed (see initNavHistory); cleared on every
// dismissal path. Session-only, never persisted.
let focusedOpen: { returnTo: ScreenId } | null = null;
// True between a programmatic dismissal's history.back() and the popstate
// that resolves it — swallows duplicate dismissal calls (double-tap) so the
// history is never popped twice.
let focusedBackPending = false;

function clearFocusedOpen(): void {
  focusedOpen = null;
  focusedBackPending = false;
}

function isMarked(st: unknown): st is NavEntryState {
  return (
    typeof st === "object" &&
    st !== null &&
    (st as { __istiaada?: unknown }).__istiaada === true
  );
}

/**
 * F4-return — pure predicate for the store subscription: does this screen
 * change carry a FRESH knowledge focus (a previous-dose row opening its
 * exact item)? Such a navigation must NOT push a screen entry — the item
 * dialog's sentinel then sits directly on the origin screen's entry, so
 * every dismissal path (device Back, X, Escape) returns to the origin
 * screen in one step and the generic Knowledge index never becomes an
 * intermediate destination. Exported for tests.
 */
export interface FocusOpenSnapshot {
  screen: string;
  knowledgeFocus: string | null;
}

export function isFocusOpenTransition(
  prev: FocusOpenSnapshot,
  next: FocusOpenSnapshot
): boolean {
  return (
    next.screen === "knowledge" &&
    prev.screen !== "knowledge" &&
    next.knowledgeFocus != null &&
    prev.knowledgeFocus == null
  );
}

function screenEntry(screen: ScreenId, i: number): NavEntryState {
  return { __istiaada: true, i, screen };
}

function navEntry(screen: ScreenId, i: number, backTo: 0 | -1): NavEntryState {
  return { __istiaada: true, i, screen, backTo };
}

function overlayEntry(kind: OverlayKind, i: number): NavEntryState {
  return { __istiaada: true, i, overlay: kind };
}

/**
 * Pure decision for a Nav-Bar destination switch (exported for tests).
 * From the root, a destination behaves exactly like a content push (Back
 * returns to the root naturally — no collapse needed). Above the root, the
 * current stack position is REPLACED: the destination becomes the only live
 * step above the root. Choosing «الرئيسية» above the root additionally
 * means "the current destination IS the root" — the next Back must fall
 * through to the real exit, which the backTo: -1 marker expresses.
 */
export interface NavSwitchPlan {
  kind: "push" | "collapse";
  /** Target screen of the switch. */
  screen: ScreenId;
  /** Stack position the plan writes (push: the NEW depth; collapse: the slot being replaced). */
  at: number;
  /** Collapse marker: 0 → Back walks to the root; -1 → Back falls past the root (home). */
  backTo: 0 | -1 | undefined;
  /** Depths that become permanently dead (strictly between root and `at`). */
  ghosts: number[];
}

export function planNavSwitch(
  currentI: number,
  screen: ScreenId
): NavSwitchPlan {
  if (currentI <= 0) {
    // From the root (or below our entries): a plain push — Back lands on
    // the root naturally, so no collapse and no markers are needed.
    return { kind: "push", screen, at: currentI + 1, backTo: undefined, ghosts: [] };
  }
  const backTo = screen === "home" ? -1 : 0;
  const ghosts: number[] = [];
  for (let k = 1; k < currentI; k++) ghosts.push(k);
  // An overlay sentinel on top (More sheet → card) needs no special case:
  // the screen entry simply takes over the sentinel's slot (the overlay's
  // own close path then finds the slot already handed over — same contract
  // as the content-push takeover in pushScreenEntry).
  return { kind: "collapse", screen, at: currentI, backTo, ghosts };
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
    ghosted.delete(st.i);
    window.history.replaceState(screenEntry(screen, st.i), "");
    seq = st.i;
    current = screenEntry(screen, st.i);
    return;
  }
  seq += 1;
  // pushState truncates any old forward stack at this depth — a stale
  // ghost recorded there (from an earlier collapse + walk + forward) is
  // gone with it. The freshly pushed entry is live by definition.
  ghosted.delete(seq);
  window.history.pushState(screenEntry(screen, seq), "");
  current = screenEntry(screen, seq);
}

/**
 * A Nav-Bar destination switch landed (navigate(s, "nav") — bottom tab,
 * «المزيد» card, desktop sidebar). The destination takes over the current
 * stack position (replacing a screen entry OR an overlay sentinel — a
 * More-sheet hand-off), everything strictly between it and the root dies,
 * and its backTo marker tells the Back walk where to land:
 *   - home → backTo -1: the current destination IS the root — the next Back
 *     falls through past the root to the real exit;
 *   - anything else → backTo 0: Back walks to the root (home), one logical
 *     step, skipping the dead intermediates.
 * From the root itself the switch is a plain push (Back → root naturally).
 */
function navSwitchEntry(screen: ScreenId) {
  const st = readState();
  const plan = planNavSwitch(st ? st.i : 0, screen);
  if (plan.kind === "push") {
    ghosted.delete(plan.at);
    seq = plan.at;
    window.history.pushState(screenEntry(screen, seq), "");
    current = screenEntry(screen, seq);
    return;
  }
  for (const g of plan.ghosts) ghosted.add(g);
  ghosted.delete(plan.at);
  window.history.replaceState(navEntry(screen, plan.at, plan.backTo!), "");
  seq = plan.at;
  current = navEntry(screen, plan.at, plan.backTo!);
}

/**
 * Pure decision for one Back hop (exported for tests). `left` is the entry
 * the walk is leaving (module `current` — intentionally PRESERVED across
 * skip hops, which keeps a collapse walk coherent until it ends), `next` the
 * landed entry (null = we fell outside our own mirrored entries).
 * `nextIsGhost` = the landed depth is in the session's ghosted set.
 */
export type BackHopAction =
  | "skip" // landed on a dead/stale entry mid-walk — history.back() again, adopt nothing
  | "exit-silent" // fell out of our entries (real exit in progress) — adopt nothing
  | "ignore" // Forward onto a dead entry — stay on the current screen
  | "adopt"; // normal adoption (close overlay / restore screen)

export function backHopAction(
  left: NavEntryState | null,
  next: NavEntryState | null,
  nextIsGhost: boolean
): BackHopAction {
  // A walk started by «الرئيسية» from the Nav Bar: fall through PAST the
  // root — every still-marked entry (the root included) is skipped so the
  // browser's own Back behavior beyond our root takes over (real exit).
  if (left && left.backTo === -1) {
    return next ? "skip" : "exit-silent";
  }
  // A walk started by any other Nav-Bar switch: land exactly on the root.
  if (left && left.backTo === 0) {
    if (!next) return "exit-silent";
    return next.i === 0 ? "adopt" : "skip";
  }
  // No marker: a dead entry may still be underfoot (a push that landed on
  // a ghosted position, or a hop whose origin carries no marker).
  if (next && nextIsGhost) {
    const backward = left ? next.i < left.i : true;
    return backward ? "skip" : "ignore";
  }
  return "adopt";
}

function onPop(e: PopStateEvent) {
  const left = current;
  const next = isMarked(e.state) ? e.state : null;

  // Nav-Bar collapse walks and ghost hops — decided BEFORE any adoption so
  // no dead screen ever flashes on the way. `current` (left) is not updated
  // during skips: the walk's origin entry carries its contract (backTo)
  // until the walk ends.
  const hop = backHopAction(left, next, next ? ghosted.has(next.i) : false);
  if (hop === "skip") {
    window.history.back();
    return;
  }
  if (hop === "exit-silent") {
    current = null;
    seq = 0;
    return;
  }
  if (hop === "ignore") {
    // Forward onto a dead entry: the physical position moves but the app
    // stays exactly where it is. Bookkeeping follows the position so a
    // subsequent Back from here behaves correctly (lands below, adopts).
    current = next;
    seq = next ? next.i : 0;
    return;
  }

  // 1) We LEFT an overlay's sentinel and that overlay is still open → the
  //    user pressed Back while the overlay was on top: close it (it must be
  //    the topmost registered one). If it is no longer registered, this
  //    popstate is just the deferred cleanup back() after a UI dismissal —
  //    close nothing.
  if (left && left.overlay) {
    const top = openOverlays[openOverlays.length - 1];
    if (top && top.kind === left.overlay) {
      openOverlays.pop();
      // F4-return: Back closed the focus-opened Knowledge dialog (physical
      // key OR a programmatic dismissal delegating to this same path).
      // History has already adopted the entry below the sentinel — which,
      // for a focus open, IS the origin screen (no screen entry was ever
      // pushed for the focus navigation). Step 2 below restores it.
      if (left.overlay === "dialog") clearFocusedOpen();
      top.close();
    }
  }

  // 2) Adopt the landed entry and restore the internal screen. Landing on a
  //    sentinel (forward onto an already-closed overlay's ghost) or outside
  //    our mirrored entries applies nothing — the app stays where it is.
  current = next;
  seq = next ? next.i : 0;
  if (next && typeof next.screen === "string") {
    applyingHistory = true;
    try {
      useAppStore.setState({ screen: next.screen });
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
 *     its depth `i`; the entry is first NORMALIZED to a plain screen entry
 *     (any Nav-Bar collapse marker or overlay kind it still carries belonged
 *     to the previous session and must not re-run its walk on the
 *     reconciliation popstate — a stale backTo:-1 walk would skip past the
 *     root and eject the user out of the freshly reloaded app with no Back
 *     press at all), then `go(-i)` jumps back to that session's root (always
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
      // Stale-session hardening: strip the dead walk contract BEFORE the
      // jump (see the docblock above) so the reconciliation popstate adopts
      // the root silently instead of falling through past it.
      window.history.replaceState(screenEntry(st.screen ?? "home", st.i), "");
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
    // F4-return — previous-dose focus open: no screen entry is pushed. The
    // item dialog's sentinel (pushed by ui/dialog.tsx as soon as it opens)
    // sits directly on the origin screen's entry, which is what makes every
    // dismissal path return to it in one step. Guard: only when the current
    // entry is a plain screen entry — an overlay hand-off (More-sheet → SOS
    // style sequential close+open) keeps its existing sentinel takeover.
    if (
      isFocusOpenTransition(prev, s) &&
      !(readState()?.overlay)
    ) {
      focusedOpen = { returnTo: prev.screen };
      return;
    }
    clearFocusedOpen();
    // Nav-Bar destination switch (navigate(s, "nav") from AppShell's go():
    // bottom tabs, «المزيد» sheet cards, desktop sidebar): the destination
    // takes over the current stack position — the back stack collapses to
    // the root instead of growing. Every other screen change (in-content
    // links, emergency's «حصلت زلّة؟», focus-opens) keeps the drill-down
    // push: Back returns to the screen it came from. The intent is consumed
    // on read so it can never leak into a later navigation.
    const via = s.navVia;
    if (via === "nav") {
      // Consume-on-read (the guarded re-entry this triggers sees an
      // unchanged screen and returns early — the intent cannot leak).
      useAppStore.setState({ navVia: null });
      navSwitchEntry(s.screen);
    } else {
      pushScreenEntry(s.screen);
    }
  });

  return () => {
    window.removeEventListener("popstate", onPop);
    unsubscribe();
    openOverlays.length = 0;
    ghosted.clear();
    clearFocusedOpen();
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
      ghosted.delete(seq);
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
    ghosted.delete(seq);
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
    return;
  }
  // History already moved off the sentinel (Back closed the overlay, or a
  // screen navigation took over its slot) — nothing to pop. Any focus
  // context is over.
  if (kind === "dialog") clearFocusedOpen();
}

/**
 * F4-return — called by the Knowledge screen when dismissing the dialog it
 * opened from a previous-dose row via the UI (X, Escape, backdrop).
 * Delegates to EXACTLY the machinery the physical Back key uses:
 * history.back() pops the dialog sentinel; onPop then closes the dialog AND
 * restores the origin screen in the SAME commit. The dialog stays mounted
 * (covering the generic index) until that commit — nothing flashes — and
 * the history is left perfectly clean ([root …, origin] — no residue).
 *
 * Returns true when the delegation was initiated (or is already in flight —
 * a second tap is swallowed so the history is never popped twice): the
 * caller closes nothing. Returns false when there is no focus context (a
 * generic Knowledge open — close onto the index exactly as before) or when
 * history already moved (the dismissal IS the Back key itself — onPop does
 * the closing).
 */
export function dismissFocusedDialogViaBack(): boolean {
  if (!focusedOpen) return false;
  if (focusedBackPending) return true;
  const st = readState();
  if (!st || st.overlay !== "dialog") return false;
  focusedBackPending = true;
  window.history.back();
  return true;
}

/**
 * F4-return — the Knowledge screen consumed a focus id that does not
 * resolve to an item, so no dialog will open. The screen entry the focus
 * navigation suppressed is restored here (exactly the entry a generic
 * navigate("knowledge") would have pushed), keeping browser history in
 * sync with the visible screen. Unreachable through the UI today
 * (previous-dose rows only render resolvable items) — pure defense.
 */
export function focusOpenAbandoned(): void {
  if (!focusedOpen) return;
  clearFocusedOpen();
  pushScreenEntry(useAppStore.getState().screen);
}
