/**
 * Responsive-layout — large-font app-wide sweep source contracts.
 * Run: bun scripts/test-responsive-layout.ts
 *
 * The layout behavior itself is verified live (agent-browser, 320/360/390 ×
 * 100/125/150% × light/dark, layout-probe evidence in the batch). These
 * tests pin the CONTRACTS at source level so the rules cannot silently
 * regress:
 *
 *  A — Button label wrapping: the shadcn Button base is whitespace-nowrap;
 *      every full-width CTA whose Arabic label was PROVEN to outgrow its
 *      track at 125%/150% (measured scrollWidth > clientWidth) carries an
 *      explicit whitespace-normal escape hatch.
 *  B — Container-query grid collapses: the two layouts that were PROVEN to
 *      squeeze at large text (Home dose know/act preview columns; StatTile
 *      2-col grids whose value+direction arrow bled outside the tile) use
 *      @container + @min-[…] thresholds — 100% keeps the side-by-side
 *      design byte-for-byte, only tight tracks stack.
 *  C — Header rows that were PROVEN to overflow (Home progress preview,
 *      Prevention rules header) allow wrapping.
 *  D — TriggerMap time-bucket rows: the w-36 label column is shrinkable
 *      (min-w-0) and the bar track keeps a floor (min-w-10) so the count
 *      never vanishes — label wraps instead of the row bleeding.
 *  E — Emergency: the «ارجع ليومي» minimum width is capped by the frame
 *      (w-[min(14rem,100%)] — the old min-w-56 outgrew the 150% column and
 *      pushed the frame off-viewport).
 *  F — Onboarding footer allows the pair to stack (flex-wrap) instead of
 *      pushing «ابدأ رحلتي» off-screen at 320×150.
 *  G — RestoreBackup file buttons: h-auto + min-h-12 (the old fixed-height
 *      base clipped the wrapped 3-line label at 320×150).
 *  H — Invariants: the already-closed responsive rules from WS1 (Dose
 *      action row flex-wrap, Home Quick Guide flex-wrap) and the closed
 *      contrast/token baselines are still present.
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

const relapseSrc = readFileSync("src/components/app/screens/RelapseScreen.tsx", "utf8");
const urgeSrc = readFileSync("src/components/app/screens/UrgeScreen.tsx", "utf8");
const emergencySrc = readFileSync("src/components/app/screens/EmergencyMode.tsx", "utf8");
const settingsSrc = readFileSync("src/components/app/screens/SettingsScreen.tsx", "utf8");
const onbSrc = readFileSync("src/components/app/Onboarding.tsx", "utf8");
const restoreSrc = readFileSync("src/components/app/RestoreBackup.tsx", "utf8");
const homeSrc = readFileSync("src/components/app/screens/HomeScreen.tsx", "utf8");
const tmapSrc = readFileSync("src/components/app/screens/TriggerMapScreen.tsx", "utf8");
const prevSrc = readFileSync("src/components/app/screens/PreventionScreen.tsx", "utf8");
const progressSrc = readFileSync("src/components/app/screens/ProgressScreen.tsx", "utf8");
const doseSrc = readFileSync("src/components/app/screens/DoseScreen.tsx", "utf8");

/* ————— A — proven nowrap-label escapes ————— */

console.log("A — Button label wrap escapes (proven overflow cases)");
{
  check(
    "Relapse main CTA «حصلت دلوقتي — وقّفها هنا» wraps (was pushing docW to 346px at 320×150%)",
    relapseSrc.includes('className="h-16 w-full text-lg font-bold whitespace-normal"')
  );
  check(
    "Relapse stop-step CTA «أوقفت — الخطوة اللي بعدها» wraps",
    relapseSrc.includes('className="h-auto min-h-14 w-full text-base font-bold whitespace-normal"')
  );
  check(
    "Relapse pending-review row buttons wrap",
    relapseSrc.includes(
      'className="h-auto min-h-8 w-full justify-between whitespace-normal text-start"'
    )
  );
  check(
    "Relapse prevention link CTA «تحديث خطة الوقاية…» wraps",
    relapseSrc.includes('className="h-auto min-h-9 w-full text-muted-foreground whitespace-normal"')
  );
  check(
    "Urge calm-mode knowledge CTA «اقرأ موضوعًا من قاعدة المعرفة» wraps",
    urgeSrc.includes('className="h-auto min-h-9 w-full whitespace-normal"')
  );
  check(
    "Emergency swap «مش ممكن دلوقتي — عوّضني بواحد تاني» wraps",
    emergencySrc.includes('className="h-auto min-h-9 w-full whitespace-normal"')
  );
  check(
    "Settings danger-zone trigger «مسح كل البيانات المحلية» wraps",
    settingsSrc.includes('className="h-auto min-h-9 gap-1.5 whitespace-normal"')
  );
  check(
    "Emergency reassessment «لأ — لسه عالي…» wraps (369px label in a 260px track at 320×150%)",
    emergencySrc.includes(
      'className="h-auto min-h-16 w-full justify-start gap-3 whitespace-normal py-4 text-start text-base"'
    )
  );
  check(
    "All wrap-escaped fixed-height CTAs keep their original height as a floor (100% unchanged)",
    relapseSrc.includes("h-auto min-h-14") &&
      relapseSrc.includes("h-auto min-h-8") &&
      relapseSrc.includes("h-auto min-h-9") &&
      urgeSrc.includes("h-auto min-h-9") &&
      emergencySrc.includes("h-auto min-h-9") &&
      settingsSrc.includes("h-auto min-h-9")
  );
}

/* ————— B — container-query grid collapses ————— */

console.log("B — Container-query stacking (2-col → 1-col when the track is too tight)");
{
  check(
    "Home dose card is a query container",
    homeSrc.includes('className="@container space-y-3 pt-4"')
  );
  check(
    "Home dose know/act grid stacks below 15rem and keeps 2-col above (100% unchanged)",
    homeSrc.includes('className="grid grid-cols-1 gap-2 text-sm @min-[15rem]:grid-cols-2"')
  );
  const statGrids = [
    ["Home progress preview", homeSrc, 1],
    ["Progress screen (days-clean + skills + response cards)", progressSrc, 3],
    ["Relapse main view", relapseSrc, 1],
  ] as const;
  for (const [name, src, n] of statGrids) {
    const count = (src.match(/grid grid-cols-1 gap-2\.5 @min-\[9\.7rem\]:grid-cols-2/g) ?? []).length;
    check(
      `${name}: StatTile grid stacks below 9.7rem (arrow no longer bleeds outside the tile at 320×150%)`,
      count === n
    );
  }
  check(
    "Progress screen root is a query container (for its top-level StatTile row)",
    progressSrc.includes('className="@container space-y-5"')
  );
  check(
    "Relapse main view root is a query container",
    relapseSrc.includes('className="@container space-y-5"')
  );
  check(
    "No uncapped auto-fit grid was introduced (would change the closed 2-col desktop design)",
    !progressSrc.includes("auto-fit") && !homeSrc.includes("auto-fit") && !relapseSrc.includes("auto-fit")
  );
}

/* ————— C — wrapping header rows ————— */

console.log("C — Header rows that overflowed at 320×150% now wrap");
{
  check(
    "Home «لمحة عن تقدمك» header row wraps",
    homeSrc.includes('className="mb-3 flex flex-wrap items-center justify-between gap-y-1"')
  );
  check(
    "Prevention «قواعدي «إذا… إذن»» header row wraps",
    prevSrc.includes('className="flex flex-wrap items-center justify-between gap-y-1"')
  );
}

/* ————— D — TriggerMap time-bucket rows ————— */

console.log("D — TriggerMap time rows (label wraps instead of the row bleeding)");
{
  check(
    "Time-bucket label column is shrinkable (w-36 min-w-0, shrink-0 removed)",
    tmapSrc.includes('className="w-36 min-w-0 text-xs text-muted-foreground"')
  );
  check(
    "Time-bucket bar track keeps a floor so the count never vanishes (min-w-10)",
    tmapSrc.includes('className="h-6 min-w-10 flex-1 overflow-hidden rounded-lg bg-muted"')
  );
}

/* ————— E — Emergency fixed minimum width ————— */

console.log("E — Emergency «ارجع ليومي» width is capped by the frame");
{
  check(
    "min-w-56 replaced with w-[min(14rem,100%)] (same 224px at 100%, never exceeds the frame)",
    emergencySrc.includes('className="w-[min(14rem,100%)]"') && !emergencySrc.includes("min-w-56")
  );
}

/* ————— F — Onboarding footer ————— */

console.log("F — Onboarding footer stacks when the pair outgrows the track");
{
  check(
    "Footer nav row wraps (flex-wrap + gap-y) — «ابدأ رحلتي» no longer pushed off-screen at 320×150%",
    onbSrc.includes("flex flex-wrap items-center justify-between gap-x-3 gap-y-2")
  );
}

/* ————— G — RestoreBackup buttons ————— */

console.log("G — RestoreBackup file buttons grow with their label");
{
  const hAuto = (restoreSrc.match(/h-auto min-h-12 w-full/g) ?? []).length;
  check("Both restore buttons are h-auto min-h-12 (no fixed-height clip of the wrapped label)", hAuto === 2);
}

/* ————— H — closed baselines still present ————— */

console.log("H — Previously closed responsive rules intact");
{
  check(
    "WS1: Dose action row still flex-wraps (أنهيت الجرعة / تخطّى اليوم)",
    doseSrc.includes("flex-wrap") && doseSrc.includes("flex-1")
  );
  check(
    "WS1: Home Quick Guide rows still flex-wrap",
    homeSrc.includes("flex-wrap")
  );
  check(
    "Emergency step 1-2 «تم» CTAs keep h-16 as a floor and wrap (F7: flex height, never clipped)",
    emergencySrc.includes('className="h-auto min-h-16 w-full whitespace-normal py-4 text-lg font-bold"')
  );
}

console.log(
  `\n— responsive-layout source contracts: ${pass} passed, ${fail} failed (total ${pass + fail})`
);
if (fail > 0) process.exit(1);
