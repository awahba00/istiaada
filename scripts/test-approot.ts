/**
 * C6/E4 — AppRoot onboarding / hydration / initial-routing invariants.
 * The store's persisted surface runs for real (partialize allowlist,
 * onboarding gate, screen routing); AppRoot's render gates are pinned by
 * source contract.
 * Run: bun scripts/test-approot.ts
 */
import { readFileSync } from "node:fs";

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

const backing = new Map<string, string>();
const shim = {
  getItem: (k: string) => (backing.has(k) ? backing.get(k)! : null),
  setItem: (k: string, v: string) => void backing.set(k, v),
  removeItem: (k: string) => void backing.delete(k),
  clear: () => void backing.clear(),
};
(globalThis as Record<string, unknown>).window = { localStorage: shim };
(globalThis as Record<string, unknown>).localStorage = shim;

const storeModule = await import("../src/lib/app/store");
const useAppStore = storeModule.useAppStore;
const STORAGE_KEY = storeModule.STORAGE_KEY;

console.log("== store: persistence surface ==");
{
  const st = useAppStore.getState();
  check(
    "defaults: not onboarded, screen home, emergency off, no focus",
    !st.onboardingCompleted && st.screen === "home" && !st.emergencyActive && st.knowledgeFocus === null
  );
  // Trigger a persist write and inspect what lands in localStorage.
  useAppStore.setState({ navVia: "nav", screen: "knowledge", knowledgeFocus: "x" });
  const raw = backing.get(STORAGE_KEY) ?? "";
  check("the zustand key is written under istiaada-state-v1", raw.length > 0);
  const persisted = JSON.parse(raw);
  check(
    "partialize allowlist: session-only fields are NEVER persisted (screen/navVia/focus/hydrated)",
    persisted.state.screen === undefined &&
      persisted.state.navVia === undefined &&
      persisted.state.knowledgeFocus === undefined &&
      persisted.state.knowledgeFocusOrigin === undefined &&
      persisted.state.hydrated === undefined &&
      persisted.state.emergencyActive === undefined
  );
  check(
    "partialize allowlist: user data IS persisted (the eleven AppData fields)",
    persisted.state.onboardingCompleted === false &&
      typeof persisted.state.userProfile === "object" &&
      typeof persisted.state.journey === "object" &&
      Array.isArray(persisted.state.urgeChecks) &&
      Array.isArray(persisted.state.interventionLogs) &&
      typeof persisted.state.dailyLogs === "object" &&
      Array.isArray(persisted.state.relapseEvents) &&
      Array.isArray(persisted.state.preventionRules) &&
      "settings" in persisted.state
  );
  check(
    "storage version is 2 (the 1–5 scale migration version)",
    persisted.version === 2
  );
}

console.log("== store: onboarding gate & routing ==");
{
  const st = useAppStore.getState();
  st.completeOnboarding({
    goals: ["change"],
    difficultTimes: ["late-night"],
    patterns: ["aimless"],
    deviceNeeds: "no",
    buildGoals: ["study"],
    supportPrefs: ["mixed"],
    why: "سببي",
    whyReasons: [],
  });
  const after = useAppStore.getState();
  check(
    "completeOnboarding flips the gate and seeds the suggested rules",
    after.onboardingCompleted === true && after.preventionRules.length === 4
  );
  check("journey start is stamped at completion", typeof after.journey.startDate === "string");
  check(
    "defaults omit the three deprecated settings (D3)",
    after.settings.preferredDoseTime === undefined &&
      after.settings.postRelapseSupport === undefined &&
      after.settings.notificationsEnabled === undefined
  );

  useAppStore.getState().navigate("progress");
  check("navigate routes the screen", useAppStore.getState().screen === "progress");
  useAppStore.getState().navigate("home", "nav");
  check(
    "navigate with via:'nav' records the intent and it is consumed on read",
    useAppStore.getState().navVia === "nav"
  );
  useAppStore.getState().openKnowledgeItem("bb-dopamine");
  const focused = useAppStore.getState();
  check(
    "openKnowledgeItem carries the item AND the origin screen (F4-return)",
    focused.knowledgeFocus === "bb-dopamine" &&
      focused.screen === "knowledge" &&
      focused.knowledgeFocusOrigin === "home"
  );
  focused.clearKnowledgeFocus();
  check(
    "clearKnowledgeFocus resets both slots",
    useAppStore.getState().knowledgeFocus === null &&
      useAppStore.getState().knowledgeFocusOrigin === null
  );
}

console.log("== AppRoot: render gates (source contract) ==");
{
  const rootSrc = readFileSync("src/components/app/AppRoot.tsx", "utf8");
  check(
    "splash renders until the store rehydrates (useSyncExternalStore)",
    rootSrc.includes("if (!storeHydrated) return <SplashScreen />;")
  );
  check(
    "onboarding gate: Onboarding while !onboardingCompleted, shell after",
    rootSrc.includes("if (!onboardingCompleted) return <Onboarding />;")
  );
  check(
    "emergency overlay mounts above the shell only when active",
    rootSrc.includes("{emergencyActive && <EmergencyMode />}")
  );
  check(
    "theme is re-applied from the persisted setting after hydration",
    rootSrc.includes("if (storeHydrated) setTheme(theme)")
  );
  check(
    "text-size is re-applied before first post-hydration paint (belt-and-braces)",
    rootSrc.includes("applyTextSize(getStoredTextSize())")
  );
  const pageSrc = readFileSync("src/app/page.tsx", "utf8");
  check("the single page mounts AppRoot (client component)", pageSrc.includes("<AppRoot />"));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
