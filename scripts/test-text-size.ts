/**
 * C6/E4 — Text-size preference logic + pre-paint initialization contracts.
 * The storage/validation logic is imported directly; the pre-paint boot
 * script in layout.tsx is pinned by source contract (it must mirror
 * TEXT_SIZE_LEVELS exactly — a mismatch would flash the wrong size or
 * drift from the Settings control).
 * Run: bun scripts/test-text-size.ts
 */
import { readFileSync } from "node:fs";
import {
  TEXT_SIZE_LEVELS,
  TEXT_SIZE_KEY,
  getStoredTextSize,
  scaleForTextSize,
  type TextSizeId,
} from "../src/lib/app/text-size";

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

console.log("== text-size: levels ==");
{
  check(
    "exactly three levels: normal/large/xlarge at 100/125/150%",
    TEXT_SIZE_LEVELS.length === 3 &&
      TEXT_SIZE_LEVELS[0].id === "normal" && TEXT_SIZE_LEVELS[0].scale === "100%" &&
      TEXT_SIZE_LEVELS[1].id === "large" && TEXT_SIZE_LEVELS[1].scale === "125%" &&
      TEXT_SIZE_LEVELS[2].id === "xlarge" && TEXT_SIZE_LEVELS[2].scale === "150%"
  );
}

console.log("== text-size: scaleForTextSize ==");
{
  check(
    "scale mapping + unknown id falls back to 100%",
    scaleForTextSize("normal") === "100%" &&
      scaleForTextSize("large") === "125%" &&
      scaleForTextSize("xlarge") === "150%" &&
      scaleForTextSize("bogus" as TextSizeId) === "100%"
  );
}

console.log("== text-size: stored preference validation ==");
{
  const backing = new Map<string, string>();
  const shim = {
    getItem: (k: string) => (backing.has(k) ? backing.get(k)! : null),
    setItem: (k: string, v: string) => void backing.set(k, v),
    removeItem: (k: string) => void backing.delete(k),
    clear: () => void backing.clear(),
  };
  (globalThis as Record<string, unknown>).window = { localStorage: shim };
  (globalThis as Record<string, unknown>).localStorage = shim;

  check("no stored value reads as normal", getStoredTextSize() === "normal");
  backing.set(TEXT_SIZE_KEY, "large");
  check("a stored valid value is returned", getStoredTextSize() === "large");
  backing.set(TEXT_SIZE_KEY, "gibberish");
  check("an unknown stored value degrades to normal", getStoredTextSize() === "normal");
  backing.delete(TEXT_SIZE_KEY);
  check("after removal the default returns", getStoredTextSize() === "normal");
}

console.log("== text-size: pre-paint boot script mirror (layout.tsx) ==");
{
  const layoutSrc = readFileSync("src/app/layout.tsx", "utf8");
  const prePaint = layoutSrc.match(/dangerouslySetInnerHTML=\{\{[\s\S]*?__html: `([\s\S]*?)`/);
  check("layout carries the pre-paint inline script", prePaint !== null);
  if (prePaint) {
    const script = prePaint[1];
    check(
      "boot script mirrors every level id → scale pair (100/125/150%)",
      script.includes('normal:"100%"') &&
        script.includes('large:"125%"') &&
        script.includes('xlarge:"150%"')
    );
    check(
      "boot script reads the SAME storage key as the module",
      script.includes(`localStorage.getItem("${TEXT_SIZE_KEY}")`)
    );
    check(
      "boot script wraps in try/catch (storage can throw in private mode)",
      script.includes("try{") && script.includes("catch(e){}")
    );
  }
}

console.log("== text-size: Settings renders the control (source contract) ==");
{
  const settingsSrc = readFileSync("src/components/app/screens/SettingsScreen.tsx", "utf8");
  check(
    "Settings maps TEXT_SIZE_LEVELS into a radiogroup with aria-checked",
    settingsSrc.includes("TEXT_SIZE_LEVELS.map") &&
      settingsSrc.includes('role="radiogroup"') &&
      settingsSrc.includes("aria-checked={active}")
  );
  check(
    "the device-local note is present (not part of backup)",
    settingsSrc.includes("محفوظ على الجهاز ده بس") || settingsSrc.includes("التغيير فوري ومحفوظ على الجهاز")
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
