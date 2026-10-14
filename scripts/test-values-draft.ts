/**
 * C6/E4/A1 — Values-screen draft persistence + reset behavior, and the
 * full-erase surface. Runs the REAL store against a localStorage shim
 * (isolated fixture — never real user data).
 * Run: bun scripts/test-values-draft.ts
 */
import { readFileSync } from "node:fs";
import {
  VALUES_DRAFT_KEY,
  USER_CONTENT_STORAGE_KEYS,
  PRESERVED_PREFERENCE_KEYS,
  eraseUserContentStorage,
} from "../src/lib/app/erase";
import { LAST_OPEN_KEY } from "../src/lib/app/return-tracking";

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

// ————— isolated localStorage fixture —————
const backing = new Map<string, string>();
const shim = {
  getItem: (k: string) => (backing.has(k) ? backing.get(k)! : null),
  setItem: (k: string, v: string) => void backing.set(k, v),
  removeItem: (k: string) => void backing.delete(k),
  clear: () => void backing.clear(),
};
(globalThis as Record<string, unknown>).window = { localStorage: shim };
(globalThis as Record<string, unknown>).localStorage = shim;

console.log("== erase: the allowlist ==");
{
  check(
    "user-content keys are exactly the values draft + last-open stamp",
    USER_CONTENT_STORAGE_KEYS.length === 2 &&
      USER_CONTENT_STORAGE_KEYS.includes(VALUES_DRAFT_KEY) &&
      USER_CONTENT_STORAGE_KEYS.includes(LAST_OPEN_KEY)
  );
  check(
    "preserved preferences are exactly text-size + theme",
    PRESERVED_PREFERENCE_KEYS.length === 2 &&
      PRESERVED_PREFERENCE_KEYS.includes("istiaada-text-size") &&
      PRESERVED_PREFERENCE_KEYS.includes("istiaada-theme")
  );
  check(
    "no key appears in BOTH lists",
    USER_CONTENT_STORAGE_KEYS.every((k) => !PRESERVED_PREFERENCE_KEYS.includes(k))
  );
}

console.log("== erase: behavior on the shim ==");
{
  backing.set(VALUES_DRAFT_KEY, JSON.stringify([{ value: "قيمة", sentence: "جملة" }]));
  backing.set(LAST_OPEN_KEY, new Date().toISOString());
  backing.set("istiaada-text-size", "large");
  backing.set("istiaada-theme", "dark");
  backing.set("someone-elses-key", "untouched");
  const report = eraseUserContentStorage();
  check("report ok when all removals succeed", report.ok && report.failed.length === 0);
  check("values draft removed", !backing.has(VALUES_DRAFT_KEY));
  check("last-open stamp removed", !backing.has(LAST_OPEN_KEY));
  check("text-size preference preserved", backing.get("istiaada-text-size") === "large");
  check("theme preference preserved", backing.get("istiaada-theme") === "dark");
  check("unrelated keys untouched", backing.get("someone-elses-key") === "untouched");

  // storage failure: removeItem throws for the draft key only.
  const throwing = {
    ...shim,
    removeItem: (k: string) => {
      if (k === VALUES_DRAFT_KEY) throw new Error("refused");
      backing.delete(k);
    },
  };
  (globalThis as Record<string, unknown>).window = { localStorage: throwing };
  backing.set(VALUES_DRAFT_KEY, "sensitive draft");
  backing.set(LAST_OPEN_KEY, "stamp");
  const r2 = eraseUserContentStorage();
  check(
    "a refused removal is reported honestly (ok=false, failed names the key)",
    r2.ok === false && r2.failed.length === 1 && r2.failed[0] === VALUES_DRAFT_KEY
  );
  check("the refused key still holds its value (not falsely claimed erased)", backing.get(VALUES_DRAFT_KEY) === "sensitive draft");
  // restore the plain shim
  (globalThis as Record<string, unknown>).window = { localStorage: shim };
}

console.log("== values draft: screen persistence contract ==");
{
  const valuesSrc = readFileSync("src/components/app/screens/ValuesScreen.tsx", "utf8");
  check(
    "ValuesDraft persists under the SHARED key constant (imported from erase.ts)",
    valuesSrc.includes('import { VALUES_DRAFT_KEY } from "@/lib/app/erase";') &&
      !valuesSrc.includes('const VALUES_DRAFT_KEY = "')
  );
  check(
    "draft writes are guarded (private-mode safe)",
    /localStorage\.setItem\(VALUES_DRAFT_KEY[\s\S]{0,120}?\} catch/.test(valuesSrc)
  );
  check(
    "draft reads validate the shape (array of {value, sentence} strings)",
    valuesSrc.includes("Array.isArray(parsed)") &&
      valuesSrc.includes('typeof x.value === "string"') &&
      valuesSrc.includes('typeof x.sentence === "string"')
  );
  check(
    "the draft is NOT part of the backup envelope (no schema coupling)",
    !valuesSrc.includes("buildBackupJson") && !valuesSrc.includes("exportData")
  );
}

console.log("== values draft: erase wiring ==");
{
  const storeSrc = readFileSync("src/lib/app/store.ts", "utf8");
  check(
    "resetApp runs the allowlist erase and returns the honest report",
    storeSrc.includes("eraseAllDeviceLocalUserData();") &&
      /resetApp: \(\) => \{[\s\S]*?const report = eraseAllDeviceLocalUserData\(\);[\s\S]*?return report;/.test(storeSrc)
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
