/**
 * Navigation back behavior — Nav-Bar collapse vs content drill-down.
 * Run: bun scripts/test-nav-back.ts
 *
 *  A — store contract: navigate(s, "nav") marks the intent; plain navigate(s)
 *      clears it; openKnowledgeItem and resetApp clear it; the transient
 *      field is never persisted (partialize whitelists data only).
 *  B — planNavSwitch (pure): from the root a destination switch is a plain
 *      push; above the root the current slot is replaced — home → backTo -1
 *      (fall through to the real exit), other destinations → backTo 0 (walk
 *      to the root); everything strictly between root and the slot dies.
 *  C — backHopAction (pure): the Back-walk decision table — home-collapse
 *      walks skip every marked entry (root included) and end silently when
 *      they fall out of our entries; destination walks land exactly on the
 *      root; ghost entries are skipped backward and ignored forward; natural
 *      hops adopt; a dialog sentinel hop is never hijacked by a collapse.
 *  D — source contracts (browser-history wiring verified live in this
 *      batch's browser verification at 390×844):
 *        - AppShell's go() passes "nav" (bottom tabs, More sheet cards,
 *          desktop sidebar all funnel through it);
 *        - every in-content link (Home cards, UrgeScreen «حصلت زلّة؟»,
 *          Relapse/Plan → prevention, Dose/Knowledge links, emergency's
 *          «حصلت زلّة؟») keeps plain navigate() — drill-down pushes;
 *        - the subscription routes navVia to navSwitchEntry, consumes the
 *          intent on read, and keeps the F4-return focus gate FIRST;
 *        - pushes delete their depth from the ghosted set (forward-stack
 *          truncation) and the cleanup clears it;
 *        - onPop decides the hop BEFORE any adoption (no dead screen flash)
 *          and skips with one history.back() per hop (no history.go(-N));
 *        - overlay sentinels, emergency exit, and the reload reconciliation
 *          (hardened: the reloaded entry is normalized to a plain screen entry
 *          before go(-st.i), so a stale backTo:-1 marker cannot re-run its
 *          dead walk and eject the user right after a reload).
 */
import { readFileSync } from "node:fs";
import { useAppStore } from "../src/lib/app/store";
import { planNavSwitch, backHopAction } from "../src/lib/app/nav-history";
import type { ScreenId } from "../src/lib/app/store";

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean) {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}`);
  }
}

const storeSrc = readFileSync("src/lib/app/store.ts", "utf8");
const navSrc = readFileSync("src/lib/app/nav-history.ts", "utf8");
const shellSrc = readFileSync("src/components/app/AppShell.tsx", "utf8");
const homeSrc = readFileSync("src/components/app/screens/HomeScreen.tsx", "utf8");
const urgeSrc = readFileSync("src/components/app/screens/UrgeScreen.tsx", "utf8");
const relapseSrc = readFileSync("src/components/app/screens/RelapseScreen.tsx", "utf8");
const planSrc = readFileSync("src/components/app/screens/PlanScreen.tsx", "utf8");
const doseSrc = readFileSync("src/components/app/screens/DoseScreen.tsx", "utf8");
const emergencySrc = readFileSync("src/components/app/screens/EmergencyMode.tsx", "utf8");

/* ————— A — store: navigation intent is set, cleared, consumed, never persisted ————— */

console.log("A — store: navVia intent");
{
  useAppStore.setState({ screen: "home", navVia: null });
  useAppStore.getState().navigate("progress", "nav");
  check(
    'navigate(s, "nav") sets navVia: "nav" together with the screen',
    useAppStore.getState().navVia === "nav" && useAppStore.getState().screen === "progress"
  );
  useAppStore.getState().navigate("urge");
  check(
    "plain navigate(s) clears the intent (content semantics)",
    useAppStore.getState().navVia === null && useAppStore.getState().screen === "urge"
  );
  useAppStore.getState().navigate("progress", "nav");
  useAppStore.getState().openKnowledgeItem("k-x");
  check(
    "openKnowledgeItem clears the intent (focus-open is never a nav switch)",
    useAppStore.getState().navVia === null && useAppStore.getState().screen === "knowledge"
  );
  useAppStore.getState().clearKnowledgeFocus();
  useAppStore.getState().navigate("progress", "nav");
  useAppStore.getState().resetApp();
  check(
    "resetApp clears the intent (boot-home is not a nav switch)",
    useAppStore.getState().navVia === null && useAppStore.getState().screen === "home"
  );
  const partializeBody = storeSrc.match(/partialize: \(s\) => \(\{[\s\S]*?\n\s*\}\),/);
  check(
    "navVia is never persisted (absent from partialize)",
    Boolean(partializeBody) && !partializeBody![0].includes("navVia")
  );
}

/* ————— B — planNavSwitch: what a Nav-Bar destination switch writes ————— */

console.log("B — planNavSwitch: collapse plan");
{
  const fromRoot = planNavSwitch(0, "progress" as ScreenId);
  check(
    "from the root: plain push at depth 1, no marker, no ghosts",
    fromRoot.kind === "push" && fromRoot.at === 1 && fromRoot.backTo === undefined && fromRoot.ghosts.length === 0
  );
  const homeAtRoot = planNavSwitch(0, "home" as ScreenId);
  check(
    "choosing home at the root: also a plain push (Back lands on the root)",
    homeAtRoot.kind === "push" && homeAtRoot.at === 1
  );
  const dest1 = planNavSwitch(1, "progress" as ScreenId);
  check(
    "depth 1 → destination: slot 1 replaced, backTo 0, nothing between",
    dest1.kind === "collapse" && dest1.at === 1 && dest1.backTo === 0 && dest1.ghosts.length === 0
  );
  const home1 = planNavSwitch(1, "home" as ScreenId);
  check(
    "depth 1 → home: slot 1 replaced, backTo -1 (next Back = real exit)",
    home1.kind === "collapse" && home1.at === 1 && home1.backTo === -1
  );
  const dest3 = planNavSwitch(3, "knowledge" as ScreenId);
  check(
    "depth 3 → destination: depths 1 and 2 die, slot 3 carries backTo 0",
    dest3.kind === "collapse" && dest3.at === 3 && dest3.backTo === 0 &&
      dest3.ghosts.length === 2 && dest3.ghosts.includes(1) && dest3.ghosts.includes(2)
  );
  const home3 = planNavSwitch(3, "home" as ScreenId);
  check(
    "depth 3 → home: depths 1 and 2 die, slot 3 carries backTo -1",
    home3.kind === "collapse" && home3.at === 3 && home3.backTo === -1 && home3.ghosts.length === 2
  );
}

/* ————— C — backHopAction: the Back-walk decision table ————— */

console.log("C — backHopAction: walk decisions");
{
  const screenEntry = (i: number, screen: ScreenId, backTo?: 0 | -1) =>
    ({ __istiaada: true as const, i, screen, ...(backTo !== undefined ? { backTo } : {}) });
  const overlayEntry = (i: number, overlay: string) =>
    ({ __istiaada: true as const, i, overlay });

  // Home collapse walk: skip every marked entry (the ROOT included) so the
  // browser's own Back beyond our root takes over; fall-out ends silently.
  check(
    "home walk: landing on the ROOT is still a skip (fall-through to exit)",
    backHopAction(screenEntry(1, "home", -1), screenEntry(0, "home"), false) === "skip"
  );
  check(
    "home walk: landing on a dead intermediate is a skip",
    backHopAction(screenEntry(3, "home", -1), screenEntry(2, "urge"), true) === "skip"
  );
  check(
    "home walk: falling outside our entries ends silently (exit in progress)",
    backHopAction(screenEntry(1, "home", -1), null, false) === "exit-silent"
  );

  // Destination collapse walk: land exactly on the root, skip the rest.
  check(
    "destination walk: landing exactly on the root adopts (home restored)",
    backHopAction(screenEntry(2, "knowledge", 0), screenEntry(0, "home"), false) === "adopt"
  );
  check(
    "destination walk: a dead intermediate is skipped",
    backHopAction(screenEntry(3, "knowledge", 0), screenEntry(2, "urge"), true) === "skip"
  );
  check(
    "destination walk: a LIVE intermediate below the marker is skipped too (the contract is the root)",
    backHopAction(screenEntry(3, "knowledge", 0), screenEntry(2, "urge"), false) === "skip"
  );
  check(
    "destination walk: falling outside our entries ends silently",
    backHopAction(screenEntry(2, "knowledge", 0), null, false) === "exit-silent"
  );

  // Natural entries: Back from a content push adopts the screen below it.
  check(
    "natural hop: content drill-down Back adopts the parent screen",
    backHopAction(screenEntry(2, "relapse"), screenEntry(1, "urge"), false) === "adopt"
  );
  check(
    "natural hop: leaving a dialog sentinel adopts the screen below (overlay priority intact)",
    backHopAction(overlayEntry(2, "dialog") as never, screenEntry(1, "dose"), false) === "adopt"
  );

  // Ghosts without a marker (a push that landed above a ghosted position).
  check(
    "ghost below an unmarked top: skipped backward (push-over-ghost case)",
    backHopAction(screenEntry(2, "urge"), screenEntry(1, "dose"), true) === "skip"
  );
  check(
    "forward onto a dead entry: ignored (no resurrection)",
    backHopAction(screenEntry(0, "home"), screenEntry(1, "dose"), true) === "ignore"
  );
  check(
    "natural hop onto the root adopts (plain content push back to home)",
    backHopAction(screenEntry(1, "urge"), screenEntry(0, "home"), false) === "adopt"
  );
  check(
    "natural hop: a null landing stays put (adoption of nothing — original behavior)",
    backHopAction(screenEntry(1, "urge"), null, false) === "adopt"
  );
}

/* ————— D — source contracts: the wiring ————— */

console.log("D — wiring: source contracts");
{
  // The Nav-Bar funnel: every destination control goes through go(), and
  // go() marks the intent.
  check(
    "AppShell go() passes \"nav\" to navigate",
    /navigate\(s,\s*"nav"\)/.test(shellSrc)
  );
  check(
    "go() is the funnel for the desktop sidebar and More-sheet cards (single definition)",
    (shellSrc.match(/const go = \(s: ScreenId\)/g) || []).length === 1 &&
      (shellSrc.match(/go\(item\.id\)/g) || []).length === 2 &&
      /go\("home"\)/.test(shellSrc) && /go\("dose"\)/.test(shellSrc) && /go\("plan"\)/.test(shellSrc)
  );

  // Content links keep plain navigate() — Back still returns to the parent.
  const contentScreens: [string, string][] = [
    ["HomeScreen", homeSrc],
    ["UrgeScreen", urgeSrc],
    ["RelapseScreen", relapseSrc],
    ["PlanScreen", planSrc],
    ["DoseScreen", doseSrc],
    ["EmergencyMode", emergencySrc],
  ];
  for (const [name, src] of contentScreens) {
    check(
      `${name}: no navigate call carries the "nav" intent (content links stay drill-downs)`,
      !/navigate\([^)]*"nav"\)/.test(src)
    );
  }
  check(
    "HomeScreen/UrgeScreen/RelapseScreen/PlanScreen/DoseScreen still call navigate( (drill-down pushes intact)",
    /navigate\("urge"\)/.test(homeSrc) && /navigate\("relapse"\)/.test(urgeSrc) &&
      /navigate\("prevention"\)/.test(relapseSrc) && /navigate\("prevention"\)/.test(planSrc) &&
      /navigate\("knowledge"\)/.test(doseSrc)
  );

  // The subscription routing + intent consumption + focus gate ordering.
  check(
    "subscription reads navVia and routes to navSwitchEntry",
    /const via = s\.navVia;/.test(navSrc) && /navSwitchEntry\(s\.screen\)/.test(navSrc)
  );
  check(
    "intent is consumed on read (setState navVia null inside the subscription)",
    /useAppStore\.setState\(\{ navVia: null \}\)/.test(navSrc)
  );
  check(
    "F4-return focus gate still runs BEFORE the nav routing",
    navSrc.indexOf("isFocusOpenTransition(prev, s)") < navSrc.indexOf("const via = s.navVia")
  );

  // Collapse writes + ghost bookkeeping.
  check(
    "navSwitchEntry writes with replaceState (slot takeover, stack never grows)",
    /replaceState\(navEntry\(/.test(navSrc)
  );
  check(
    "pushes delete their depth from the ghosted set (forward truncation)",
    (navSrc.match(/ghosted\.delete\(/g) || []).length >= 4
  );
  check(
    "the shell cleanup clears the ghosted set",
    /ghosted\.clear\(\)/.test(navSrc)
  );

  // The Back walk itself.
  check(
    "onPop decides the hop BEFORE the overlay-close/adoption block",
    navSrc.indexOf("const hop = backHopAction(") < navSrc.indexOf("left && left.overlay")
  );
  check(
    "the ONLY history.go call is the pre-existing reload reconciliation (skips walk one back() at a time)",
    (navSrc.match(/window\.history\.go\(/g) || []).length === 1 &&
      navSrc.includes("window.history.go(-st.i)")
  );
  check(
    "no window.close() call anywhere in the module",
    !/window\.close\(\)/.test(navSrc)
  );

  // Untouched contracts: overlay sentinels + emergency honest exit + reload.
  check(
    "overlay sentinel contract unchanged (overlayOpened/overlayClosedViaUI signatures intact)",
    /export function overlayOpened\(kind: OverlayKind, close: \(\) => void\)/.test(navSrc) &&
      /export function overlayClosedViaUI\(kind: OverlayKind\)/.test(navSrc)
  );
  check(
    "emergency Back still performs only stopEmergency (overlay's own exit)",
    /overlayOpened\("emergency", \(\) => useAppStore\.getState\(\)\.stopEmergency\(\)\)/.test(shellSrc)
  );
  check(
    "reload reconciliation HARDENED: the reloaded entry is normalized to a plain screen entry BEFORE go(-st.i) — a stale backTo/-overlay marker cannot re-run its dead walk on boot (no reload ejection)",
    /replaceState\(screenEntry\(st\.screen \?\? "home", st\.i\), ""\)/.test(navSrc) &&
      navSrc.indexOf('window.history.replaceState(screenEntry(st.screen ?? "home", st.i), "")') <
        navSrc.indexOf("window.history.go(-st.i);") &&
      /replaceState\(screenEntry\("home", 0\)/.test(navSrc)
  );
  check(
    "URL stays exactly \"/\" (no per-screen routes added — deep links unaffected)",
    !/pushState\([^,]*,\s*["']\/[a-z]/.test(navSrc) && !/replaceState\([^,]*,\s*["']\/[a-z]/.test(navSrc)
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
