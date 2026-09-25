/**
 * Risk engine determinism tests — run with: bun scripts/test-risk.ts
 * Verifies the documented 1–5 rule ladder in src/lib/app/risk-engine.ts.
 */
import { calculateRisk } from "../src/lib/app/risk-engine";

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
const lvl = (urge: number, proximity: number, control: number, ctx?: Record<string, boolean>) =>
  calculateRisk({ urge, proximity, control, context: ctx }).level;
const mode = (urge: number, proximity: number, control: number, ctx?: Record<string, boolean>) =>
  calculateRisk({ urge, proximity, control, context: ctx }).recommendedMode;

console.log("== risk engine (1–5 ladder) ==");

// ————— Single levels —————
check("all-min → 1", lvl(1, 1, 1) === 1);
check("level 2 exists (early)", lvl(3, 2, 2) === 2);
check("level 3 exists (growing)", lvl(3, 3, 3) === 3);
check("level 4 exists (high risk)", lvl(1, 5, 1) === 4);
check("level 5 exists (imminent)", lvl(1, 5, 5) === 5);

// ————— Weighted base ordering: proximity dominates —————
check("proximity weighs more than urge", lvl(1, 5, 1) > lvl(5, 1, 1));
check("control weighs more than urge", lvl(1, 1, 5) > lvl(5, 1, 1));

// ————— Behavioral floors —————
check("browsingStarted floors at 4", lvl(1, 1, 1, { browsingStarted: true }) >= 4);
check("proximity 4 floors at 4", lvl(1, 4, 1) >= 4);
check("control 5 floors at 4", lvl(1, 1, 5) >= 4);
check("proximity 4 + weak-ish control floors at 4", lvl(1, 4, 2) >= 4);

// ————— Level 5 — explicit behavioral definition only —————
check("proximity 5 + control 5 → 5 (imminent)", lvl(1, 5, 5) === 5);
check("all-max → 5", lvl(5, 5, 5) === 5);
check("proximity 5 + control 4 stays below 5", lvl(5, 5, 4) === 4);
check("proximity 4 + control 5 stays below 5", lvl(5, 4, 5) === 4);
check("context bonus can NOT reach 5", lvl(5, 4, 4, { alone: true, lateNight: true, inBed: true }) === 4);

// ————— Urge intensity alone never creates the highest state —————
check("max urge + far + full control → awareness zone", lvl(5, 1, 1) === 2);
check("max urge alone does NOT give 4 or 5", lvl(5, 1, 1) < 4);
check("max urge + mid proximity/control caps at 4", lvl(5, 3, 3) <= 4);
check("max urge + proximity 5 + control 3 → 4 (not 5)", lvl(5, 5, 3) === 4);

// ————— Required combinations —————
check("low urge + high control → low degree", lvl(1, 2, 1) === 1);
check("high urge + high control stays low", lvl(5, 2, 1) === 2);
check("high proximity + low control (loss=5) → 5", lvl(1, 5, 5) === 5);
check("high proximity + high control (loss=1) → 4", lvl(1, 5, 1) === 4);
check("all three high → 5", lvl(5, 5, 5) === 5);

// ————— Proximity/control strongly influence escalation —————
check("raising proximity raises degree", lvl(2, 2, 2) < lvl(2, 5, 2));
check("raising control-loss raises degree", lvl(2, 2, 2) < lvl(2, 2, 5));

// ————— Determinism: same input, same output —————
check(
  "deterministic across calls",
  lvl(4, 4, 3, { alone: true, lateNight: true }) === lvl(4, 4, 3, { alone: true, lateNight: true })
);

// ————— Context bonus caps at ~1 level —————
check("all contexts bump at most one level", lvl(2, 2, 2, { alone: true, lateNight: true, inBed: true }) === 3);
check("no context → no bump", lvl(2, 2, 2) === 2);

// ————— Mode mapping (1–5 → awareness/interrupt/immediate/emergency/maximum) —————
check("level 1 → awareness mode", mode(1, 1, 1) === "awareness");
check("level 2 → awareness mode", mode(3, 2, 2) === "awareness");
check("level 3 → interrupt mode", mode(3, 3, 3) === "interrupt");
check("level 4 → immediate mode", mode(1, 5, 1) === "immediate");
check("level 4 + browsingStarted → emergency mode", mode(1, 4, 2, { browsingStarted: true }) === "emergency");
check("level 5 → maximum mode", mode(1, 5, 5) === "maximum");

// ————— Home-state thresholds (currentHomeState) —————
import { currentHomeState } from "../src/lib/app/risk-engine";
const now = new Date().toISOString();
const h = (level: number, outcome?: "handled" | "escalated" | "acted" | "pending" | null) =>
  currentHomeState(level, now, null, true, outcome ?? "pending");
check("degree 4-5 pending → home high", h(4) === "high" && h(5) === "high");
check("degree 3 pending → home moderate", h(3) === "moderate");
check("degree 1-2 pending → home normal", h(1) === "normal" && h(2) === "normal");
check("handled check stops painting home red", h(4, "handled") === "normal");

// ————— Colors follow the same bands —————
import { riskColorVar } from "../src/lib/app/risk-engine";
check("degree 1-2 → success color", riskColorVar(1) === "var(--success)" && riskColorVar(2) === "var(--success)");
check("degree 3 → warning color", riskColorVar(3) === "var(--warning)");
check("degree 4-5 → destructive color", riskColorVar(4) === "var(--destructive)");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
