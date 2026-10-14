/**
 * B4/B5/B6/E1 — UX-safety regression contracts: If-Then rule deletion
 * confirmation, emergency countdown completion feedback, onboarding
 * small-screen behavior, and installability metadata (web app manifest
 * validity + wiring).
 * Run: bun scripts/test-ux-safety.ts
 */
import { readFileSync, existsSync, statSync } from "node:fs";

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

const prevSrc = readFileSync("src/components/app/screens/PreventionScreen.tsx", "utf8");
const emSrc = readFileSync("src/components/app/screens/EmergencyMode.tsx", "utf8");
const timerSrc = readFileSync("src/components/app/Timer.tsx", "utf8");
const onbSrc = readFileSync("src/components/app/Onboarding.tsx", "utf8");
const layoutSrc = readFileSync("src/app/layout.tsx", "utf8");
const manifestPath = "public/manifest.webmanifest";

console.log("== B5: If-Then rule deletion confirmation ==");
{
  check(
    "the delete button arms a confirmation target instead of deleting directly",
    /onClick=\{\(\) => setDeleteTarget\(r\)\}/.test(prevSrc) &&
      !/onClick=\{\(\) => deleteRule\(r\.id\)\}/.test(prevSrc)
  );
  check(
    "a controlled AlertDialog identifies the exact rule (its إذا/إذن text)",
    /open=\{deleteTarget !== null\}/.test(prevSrc) &&
      prevSrc.includes("هتمسح قاعدة «إذا {deleteTarget?.ifText} — إذن {deleteTarget?.thenText}»")
  );
  check(
    "explicit cancel (رجوع) that leaves the rule and state unchanged",
    /<AlertDialogCancel>رجوع<\/AlertDialogCancel>/.test(prevSrc) &&
      /onOpenChange=\{\(v\) => \{\s*if \(!v\) setDeleteTarget\(null\);\s*\}\}/.test(prevSrc)
  );
  check(
    "deletion happens ONLY inside the destructive confirm action",
    /if \(deleteTarget\) deleteRule\(deleteTarget\.id\);[\s\S]{0,80}?setDeleteTarget\(null\);/.test(prevSrc)
  );
  check(
    "the confirmation matches the app's destructive-action pattern (same shape as erase/import confirms)",
    prevSrc.includes("bg-destructive text-destructive-foreground hover:bg-destructive/90")
  );
}

console.log("== B6: emergency countdown completion feedback ==");
{
  check(
    "the countdown's onComplete is wired (no more no-op)",
    /onComplete=\{\(\) => setTimerCompleted\(true\)\}/.test(emSrc) &&
      !/onComplete=\{\(\) => undefined\}/.test(emSrc)
  );
  check(
    "completion renders a calm, clearly-labeled next action pointing to the EXISTING reassessment step",
    emSrc.includes("اضغط «تم — الخطوة اللي بعدها» تحت عشان نعيد تقييم الوضع") ||
      emSrc.includes("عشان نعيد تقييم الوضع")
  );
  check(
    "the completion is an accessible polite announcement (role=status)",
    /role="status"/.test(emSrc) && /aria-live="polite"/.test(emSrc)
  );
  check(
    "no fabricated outcome: completion writes no log, no success, no 'safe' classification",
    !/logIntervention/.test(emSrc.slice(emSrc.indexOf("timerCompleted") - 50, emSrc.indexOf("timerCompleted") + 900)) &&
      !emSrc.includes("خلص التدخل بنجاح")
  );
  check(
    "the existing step flow is untouched: «تم — الخطوة اللي بعدها» still advances via the guarded CTA",
    /advanceGuardAtRef\.current/.test(emSrc) && emSrc.includes("تم — الخطوة اللي بعدها")
  );
}

console.log("== B6/Timer: countdown behavior contracts ==");
{
  check(
    "completion is derived from remaining === 0 (no setState-in-effect race)",
    /const done = remaining === 0;/.test(timerSrc) &&
      !/setDone\(/.test(timerSrc)
  );
  check(
    "the tick stays a pure updater (F11 purity preserved)",
    /setRemaining\(\(r\) => \(r <= 1 \? 0 : r - 1\)\)/.test(timerSrc)
  );
  check(
    "onComplete fires exactly once per completion via the done-keyed effect",
    /useEffect\(\(\) => \{\s*if \(done\) onCompleteRef\.current\?\.\(\);\s*\}, \[done\]\)/.test(timerSrc)
  );
  check(
    "restart-after-done keeps the timer paused (running=false — same as the old completion path)",
    /setRemaining\(seconds\);\s*\n\s*setRunning\(false\);/.test(timerSrc)
  );
  check(
    "completion state shows «الوقت خلص» + the reassessment nudge",
    timerSrc.includes("الوقت خلص") && timerSrc.includes("عيد التقييم دلوقتي")
  );
}

console.log("== B4: onboarding small-screen behavior ==");
{
  check(
    "the scrollable options area carries defensive bottom clearance (pb-32)",
    /flex-1 pb-32/.test(onbSrc)
  );
  check(
    "every step change resets scroll to the top (mirrors the shell's F2)",
    /prevStepRef\.current !== step[\s\S]{0,120}?window\.scrollTo\(\{ top: 0, behavior: "instant" \}\)/.test(onbSrc)
  );
  check(
    "the sticky footer keeps its wrap behavior at 320px (contract F intact)",
    /sticky bottom-0[\s\S]{0,200}?flex-wrap/.test(onbSrc)
  );
}

console.log("== E1: installability metadata ==");
{
  check("manifest.webmanifest exists in public/", existsSync(manifestPath));
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    check(
      "manifest names the app in Arabic with rtl direction + ar lang",
      manifest.name === "استعادة" && manifest.short_name === "استعادة" &&
        manifest.dir === "rtl" && manifest.lang === "ar"
    );
    check(
      "display standalone + start_url / scope rooted at /",
      manifest.display === "standalone" && manifest.start_url === "/" && manifest.scope === "/"
    );
    check(
      "theme/background colors are the app's dark values",
      manifest.theme_color === "#131e21" && manifest.background_color === "#131e21"
    );
    const icons = manifest.icons as { src: string; sizes: string; type: string }[];
    check(
      "icons reference existing public/ assets with valid sizes/types",
      icons.length >= 3 &&
        icons.every((i) => existsSync(`public/${i.src.replace(/^\//, "")}`))
    );
    check(
      "icon set covers 32/180/256 px + an svg (any size)",
      icons.some((i) => i.sizes === "32x32") &&
        icons.some((i) => i.sizes === "180x180") &&
        icons.some((i) => i.sizes === "256x256") &&
        icons.some((i) => i.type === "image/svg+xml")
    );
    check(
      "all icon files are non-empty",
      icons.every((i) => statSync(`public/${i.src.replace(/^\//, "")}`).size > 100)
    );
  }
  check(
    "layout metadata links the manifest",
    layoutSrc.includes('manifest: "/manifest.webmanifest"')
  );
  check(
    "A4: neutral tab title (just the app name) + noindex robots",
    layoutSrc.includes('title: "استعادة"') &&
      layoutSrc.includes("index: false, follow: false")
  );
  const robots = readFileSync("public/robots.txt", "utf8");
  check(
    "robots.txt disallows all crawlers (aligned with noindex)",
    robots.includes("Disallow: /")
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
