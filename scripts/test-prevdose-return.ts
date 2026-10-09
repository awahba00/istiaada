/**
 * F4-return — Previous-dose direct open + return-path tests.
 * Run: bun scripts/test-prevdose-return.ts
 *
 *  A — store contract: openKnowledgeItem captures the ORIGIN screen
 *      (knowledgeFocusOrigin) together with the focus; clearKnowledgeFocus
 *      consumes both; fields are session-only (never in partialize).
 *  B — focus-open transition predicate (nav-history): only a screen change
 *      to knowledge carrying a FRESH focus suppresses the screen entry;
 *      generic navigate("knowledge") and every other transition do not.
 *  C — source contracts (the browser-history parts cannot run outside a
 *      DOM — the wiring is asserted at source level, and verified live at
 *      390×844 in the batch's browser verification):
 *        - the subscription suppresses the push for focus opens (sentinel
 *          sits directly on the origin screen's entry);
 *        - device Back closes the dialog and restores the origin screen
 *          (onPop clears the focus context);
 *        - X / Escape dismissals delegate to the SAME machinery (a guarded
 *          history.back() — one commit closes the dialog AND restores the
 *          origin, nothing flashes, no history residue, no double-pop);
 *        - the Knowledge dialog is open from the FIRST render when a focus
 *          is carried (no generic-index flash on the way IN either);
 *        - generic Knowledge entries (More sheet, UrgeScreen link, Dose
 *          full-index button) still use plain navigate("knowledge").
 *  D — the previous-dose row call site is unchanged (exact item, DoseScreen).
 */
import { readFileSync } from "node:fs";
import { useAppStore } from "../src/lib/app/store";
import { isFocusOpenTransition } from "../src/lib/app/nav-history";

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
const knowSrc = readFileSync("src/components/app/screens/KnowledgeScreen.tsx", "utf8");
const doseSrc = readFileSync("src/components/app/screens/DoseScreen.tsx", "utf8");
const urgeSrc = readFileSync("src/components/app/screens/UrgeScreen.tsx", "utf8");
const shellSrc = readFileSync("src/components/app/AppShell.tsx", "utf8");

/* ————— A — store contract (live zustand store, no DOM history needed) ————— */

console.log("A — store: origin capture & consumption");
{
  useAppStore.setState({ screen: "dose", knowledgeFocus: null, knowledgeFocusOrigin: null });
  useAppStore.getState().openKnowledgeItem("k-xyz");
  const s = useAppStore.getState();
  check(
    "openKnowledgeItem carries item + origin + screen in one commit",
    s.knowledgeFocus === "k-xyz" && s.knowledgeFocusOrigin === "dose" && s.screen === "knowledge"
  );
  check(
    "clearKnowledgeFocus consumes BOTH fields (single consumption)",
    (() => {
      useAppStore.getState().clearKnowledgeFocus();
      const t = useAppStore.getState();
      return t.knowledgeFocus === null && t.knowledgeFocusOrigin === null;
    })()
  );
  check(
    "openKnowledgeItem from another screen records THAT screen as origin",
    (() => {
      useAppStore.setState({ screen: "relapse", knowledgeFocus: null, knowledgeFocusOrigin: null });
      useAppStore.getState().openKnowledgeItem("k-2");
      const t = useAppStore.getState();
      useAppStore.getState().clearKnowledgeFocus();
      return t.knowledgeFocusOrigin === "relapse";
    })()
  );
  const partializeBody = storeSrc.match(/partialize: \(s\) => \(\{[\s\S]*?\n\s*\}\),/);
  check(
    "focus fields are session-only: excluded from persist partialize",
    partializeBody != null && !partializeBody[0].includes("knowledgeFocus")
  );
}

/* ————— B — focus-open transition predicate (pure) ————— */

console.log("B — nav-history: focus-open transition predicate");
{
  check(
    "dose → knowledge WITH fresh focus = focus open (suppress push)",
    isFocusOpenTransition({ screen: "dose", knowledgeFocus: null }, { screen: "knowledge", knowledgeFocus: "k-1" })
  );
  check(
    "generic navigate to knowledge (no focus) = NOT a focus open",
    !isFocusOpenTransition({ screen: "dose", knowledgeFocus: null }, { screen: "knowledge", knowledgeFocus: null })
  );
  check(
    "focus re-set while ALREADY on knowledge = NOT a focus open (no screen change)",
    !isFocusOpenTransition({ screen: "knowledge", knowledgeFocus: null }, { screen: "knowledge", knowledgeFocus: "k-1" })
  );
  check(
    "focus cleared while staying on knowledge = NOT a focus open",
    !isFocusOpenTransition({ screen: "knowledge", knowledgeFocus: "k-1" }, { screen: "knowledge", knowledgeFocus: null })
  );
  check(
    "any other screen change with a stale focus = NOT a focus open",
    !isFocusOpenTransition({ screen: "knowledge", knowledgeFocus: "k-1" }, { screen: "home", knowledgeFocus: "k-1" })
  );
}

/* ————— C — source contracts for the browser-history wiring ————— */

console.log("C — nav-history + KnowledgeScreen wiring");
{
  check(
    "subscription suppresses the screen push for focus opens (isFocusOpenTransition + focusedOpen set, return before pushScreenEntry)",
    navSrc.includes("isFocusOpenTransition(prev, s)") &&
      navSrc.includes("focusedOpen = { returnTo: prev.screen }")
  );
  check(
    "suppression is guarded: never while an overlay sentinel is current (More→SOS hand-off keeps its takeover)",
    /isFocusOpenTransition\(prev, s\)[\s\S]{0,120}!\(readState\(\)\?\.overlay\)/.test(navSrc)
  );
  check(
    "onPop: Back-closed dialog clears the focus context (origin restored by adopting the entry below)",
    /if \(left\.overlay === "dialog"\) clearFocusedOpen\(\);/.test(navSrc)
  );
  check(
    "overlayClosedViaUI: no focus special-casing (the UI dismissal path is the dialog's own onOpenChange → dismissFocusedDialogViaBack)",
    !/focusedOpen[\s\S]{0,80}useAppStore\.setState\(\{ screen: returnTo \}\)/.test(navSrc)
  );
  check(
    "dismissFocusedDialogViaBack delegates to history.back() only while the dialog sentinel is current; duplicate calls are swallowed (no double-pop)",
    navSrc.includes("export function dismissFocusedDialogViaBack()") &&
      navSrc.includes("focusedBackPending = true;") &&
      /dismissFocusedDialogViaBack[\s\S]{0,500}window\.history\.back\(\);/.test(
        navSrc.slice(navSrc.indexOf("export function dismissFocusedDialogViaBack"))
      )
  );
  check(
    "dismiss returns false with no focus context (generic close unchanged) or when history already moved (Back itself)",
    /if \(!focusedOpen\) return false;[\s\S]{0,120}if \(!st \|\| st\.overlay !== "dialog"\) return false;/.test(navSrc)
  );
  check(
    "focusOpenAbandoned repairs the suppressed entry when the focus id is unknown",
    navSrc.includes("export function focusOpenAbandoned()") &&
      navSrc.includes("pushScreenEntry(useAppStore.getState().screen)")
  );
  check(
    "initNavHistory cleanup resets the focus context",
    /clearFocusedOpen\(\);\s*\n\s*active = false;/.test(navSrc)
  );
  check(
    "KnowledgeScreen opens the focused dialog from the FIRST render (useState initializer — no generic-index flash on entry)",
    knowSrc.includes("useState<KnowledgeItem | null>(() =>") &&
      knowSrc.includes("KNOWLEDGE_BY_ID[s.knowledgeFocus] ?? null")
  );
  check(
    "focusReturn captured from the store origin at first render",
    knowSrc.includes("s.knowledgeFocus ? (s.knowledgeFocusOrigin ?? null) : null")
  );
  check(
    "dialog dismissal delegates to the Back machinery for the focus entry path (dialog stays mounted until the popstate commit)",
    /if \(focusReturn && dismissFocusedDialogViaBack\(\)\) return;\s*\n\s*setSelected\(null\);/.test(knowSrc)
  );
  check(
    "generic card taps reset focusReturn (generic close stays on Knowledge)",
    /onClick=\{\(\) => \{\s*\n\s*setSelected\(k\);\s*\n\s*setFocusReturn\(null\);\s*\n\s*\}\}/.test(knowSrc)
  );
  check(
    "unknown focus id triggers the history repair (defense)",
    knowSrc.includes("if (!KNOWLEDGE_BY_ID[focus]) focusOpenAbandoned();")
  );
  check(
    "generic Knowledge entries unchanged: UrgeScreen + Dose full-index use navigate(\"knowledge\")",
    urgeSrc.includes('onClick={() => navigate("knowledge")}') &&
      doseSrc.includes('onClick={() => navigate("knowledge")}')
  );
  check(
    "More sheet navigation unchanged (go() → navigate, no focus)",
    shellSrc.includes("const go = (s: ScreenId) => {") &&
      !shellSrc.includes("openKnowledgeItem")
  );
}

/* ————— D — the previous-dose row call site ————— */

console.log("D — previous-dose row (DoseScreen)");
{
  check(
    "row still opens the EXACT item via openKnowledgeItem",
    /onClick=\{\(\) => openKnowledgeItem\(d\.itemId\)\}/.test(doseSrc)
  );
  check(
    "rows only render resolvable items (KNOWLEDGE.find + filter — the unknown-id repair stays pure defense)",
    doseSrc.includes("item: KNOWLEDGE.find((k) => k.id === d.itemId)") &&
      doseSrc.includes(".filter((d) => d.item)")
  );
}

console.log(`\n— previous-dose return-path tests: ${pass} passed, ${fail} failed (total ${pass + fail})`);
process.exit(fail === 0 ? 0 : 1);
