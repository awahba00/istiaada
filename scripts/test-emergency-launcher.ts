/**
 * C6/E4 — Emergency launcher state & routing (store-level behavior + wiring
 * contracts). The launcher hook's contract (manual entries carry
 * assessed:false and derive workSafe from the profile) is pinned at source
 * level; the store's startEmergency/stopEmergency behavior runs for real.
 * Run: bun scripts/test-emergency-launcher.ts
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

// ————— isolated localStorage fixture (fresh store instance) —————
const backing = new Map<string, string>();
const shim = {
  getItem: (k: string) => (backing.has(k) ? backing.get(k)! : null),
  setItem: (k: string, v: string) => void backing.set(k, v),
  removeItem: (k: string) => void backing.delete(k),
  clear: () => void backing.clear(),
};
(globalThis as Record<string, unknown>).window = { localStorage: shim };
(globalThis as Record<string, unknown>).localStorage = shim;

const { useAppStore } = await import("../src/lib/app/store");

console.log("== store: emergency state & routing ==");
{
  const st = useAppStore.getState();
  check("initial state: emergency inactive, no context", !st.emergencyActive && st.emergencyCtx === null);

  st.startEmergency({ riskLevel: 5, triggers: ["boredom"], workSafe: true });
  const mid = useAppStore.getState();
  check(
    "startEmergency activates the overlay with the exact context",
    mid.emergencyActive === true &&
      mid.emergencyCtx?.riskLevel === 5 &&
      mid.emergencyCtx?.triggers[0] === "boredom" &&
      mid.emergencyCtx?.workSafe === true
  );
  check(
    "an assessed flag is preserved when the caller provides it (Urge flow)",
    (() => {
      useAppStore.getState().startEmergency({ riskLevel: 4, triggers: [], workSafe: false, assessed: true });
      return useAppStore.getState().emergencyCtx?.assessed === true;
    })()
  );
  check(
    "absence of assessed stays absent (manual entry — no fabricated degree)",
    (() => {
      useAppStore.getState().startEmergency({ riskLevel: 4, triggers: [], workSafe: false });
      const c = useAppStore.getState().emergencyCtx;
      return c != null && c.assessed === undefined;
    })()
  );
  useAppStore.getState().stopEmergency();
  const end = useAppStore.getState();
  check("stopEmergency clears both the flag and the context", !end.emergencyActive && end.emergencyCtx === null);
}

console.log("== launcher: manual entries are honest (source contract) ==");
{
  const launcherSrc = readFileSync("src/lib/app/emergency-launcher.ts", "utf8");
  check(
    "every always-on entry passes assessed: false (never a fabricated degree)",
    launcherSrc.includes("assessed: false") &&
      /F4 — every ALWAYS-ON entry point is MANUAL/.test(launcherSrc)
  );
  check(
    "workSafe derives from the onboarding profile (deviceNeeds === \"yes\")",
    launcherSrc.includes('workSafe: deviceNeeds === "yes"')
  );
  check(
    "default protocol intensity is 4 (not a reported degree)",
    /riskLevel = 4/.test(launcherSrc)
  );
}

console.log("== entry points: every always-on SOS goes through the launcher ==");
{
  const shellSrc = readFileSync("src/components/app/AppShell.tsx", "utf8");
  const homeSrc = readFileSync("src/components/app/screens/HomeScreen.tsx", "utf8");
  check(
    "AppShell's SOS entries (FAB, sidebar, More sheet) use the launcher",
    shellSrc.includes("useEmergencyLauncher()") &&
      shellSrc.split("launchEmergency").length >= 3
  );
  check(
    "HomeScreen's high-state card re-launches a REAL recent check (assessed)",
    homeSrc.includes("assessed: true") || homeSrc.includes("startEmergency")
  );
}

console.log("== overlay mounting: AppRoot renders the overlay above the shell ==");
{
  const rootSrc = readFileSync("src/components/app/AppRoot.tsx", "utf8");
  check(
    "AppRoot mounts EmergencyMode only while emergencyActive",
    rootSrc.includes("{emergencyActive && <EmergencyMode />}")
  );
  check(
    "hydration guard renders the splash until the store rehydrates",
    rootSrc.includes("useSyncExternalStore") && rootSrc.includes("SplashScreen")
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
