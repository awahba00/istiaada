/**
 * B2 — Help-screen reliability + verified content distinctions.
 * Pins the expected help-resource IDs and numbers (a renamed entry must
 * never blank the screen), the safe resolution contracts (no non-null
 * assertions, guarded number arrays, graceful fallback), and the verified
 * content distinctions: 16328 general psychological support only; 16023
 * ONLY in its separate substance-addiction context; 123/122 in emergency
 * contexts; the honest CSBD/PPU absence statement; the verified Ministry
 * link + platform-unavailability note.
 * Run: bun scripts/test-help-resources.ts
 */
import { readFileSync } from "node:fs";
import {
  HELP_LINES,
  HELP_LINKS,
  PLATFORM_UNAVAILABLE_NOTE,
  HELP_INFO_VERIFIED_AT,
} from "../src/data/app/help-resources";

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

const byId = (id: string) => HELP_LINES.find((l) => l.id === id) ?? null;
const helpSrc = readFileSync("src/components/app/screens/HelpScreen.tsx", "utf8");

console.log("== B2: expected resource entries are present and pinned ==");
{
  check("gsmhat-hotline exists with number 16328", byId("gsmhat-hotline")?.numbers[0] === "16328");
  check("ambulance exists with number 123", byId("ambulance")?.numbers[0] === "123");
  check("police exists with number 122", byId("police")?.numbers[0] === "122");
  check("addiction-fund exists with number 16023", byId("addiction-fund")?.numbers[0] === "16023");
  check(
    "no unexpected extra hotline entries (the four verified lines only)",
    HELP_LINES.length === 4
  );
  check(
    "every entry declares scope, limits, hours, and cost (honest fields)",
    HELP_LINES.every((l) => l.what && l.limits && l.hours && l.cost)
  );
}

console.log("== B2: safe resolution (no blank-screen crash path) ==");
{
  check(
    "no non-null assertions on hotline lookups (the audit's crash vector)",
    !/HELP_LINES\.find\([^)]*\)!/.test(helpSrc)
  );
  check(
    "every lookup guards both id AND a non-empty numbers array",
    /l\.id === "gsmhat-hotline" && l\.numbers\.length > 0/.test(helpSrc) &&
      /l\.id === "ambulance" && l\.numbers\.length > 0/.test(helpSrc) &&
      /l\.id === "police" && l\.numbers\.length > 0/.test(helpSrc) &&
      /l\.id === "addiction-fund" && l\.numbers\.length > 0/.test(helpSrc)
  );
  check(
    "the primary hotline card renders conditionally (hotline &&)",
    /\{hotline && \(/.test(helpSrc)
  );
  check(
    "a missing primary hotline gets a graceful honest fallback block",
    helpSrc.includes("primaryHotlineMissing") &&
      helpSrc.includes("خط الدعم النفسي مش متاح في النسخة دي")
  );
  check(
    "ambulance/police render with optional chaining",
    /\{ambulance\?\.numbers\.map/.test(helpSrc) && /\{police\?\.numbers\.map/.test(helpSrc)
  );
  check(
    "the addiction card guards its first number before building a tel: link",
    /\{addiction && addiction\.numbers\.length > 0 && \(/.test(helpSrc)
  );
  check(
    "the limits footer lists whatever IS configured (never crashes on drift)",
    helpSrc.includes("{HELP_LINES.map((l) => (")
  );
}

console.log("== F1: verified content distinctions ==");
{
  const hotline = byId("gsmhat-hotline")!;
  const addiction = byId("addiction-fund")!;

  // 16328 — general psychological support ONLY, only officially-stated claims.
  check(
    "16328 scope: general psychological consultation + family counseling",
    hotline.what.includes("استشارة نفسية وإرشاد أسري")
  );
  check(
    "16328 limits: explicitly NOT a CSBD/pornography treatment service",
    hotline.limits.includes("مش علاج متخصص للسلوك الجنسي القهري") ||
      hotline.limits.includes("مش خط")
  );
  check(
    "16328 cost claim is only «خدمة حكومية» (no unverified 'free')",
    hotline.cost === "خدمة حكومية"
  );
  check(
    "16328 hours 24/7 per official sources",
    hotline.hours.includes("٢٤ ساعة")
  );

  // 16023 — substance-addiction pathway ONLY.
  check(
    "16023 scope: substance-addiction treatment & rehabilitation only",
    addiction.what.includes("إدمان المواد") && addiction.what.includes("مسار علاج وتأهيل")
  );
  check(
    "16023 limits: never presented as a CSBD/PPU service; refers 16328 for general support",
    addiction.limits.includes("متخصص في إدمان المواد") &&
      addiction.limits.includes("16328")
  );
  check(
    "the help screen keeps 16023 ONLY in its separate labeled context card",
    helpSrc.includes("مسار منفصل: لو صراعك شمل — كمان — إدمان المواد المخدرة")
  );

  // 123 / 122 — emergency contexts only.
  check("123 lives in the ambulance entry (medical emergency)", byId("ambulance")?.numbers[0] === "123");
  check("122 lives in the police entry (safety emergencies)", byId("police")?.numbers[0] === "122");

  // Honest CSBD/PPU absence.
  check(
    "the screen states honestly that no verified Egyptian CSBD/PPU-specific service exists",
    helpSrc.includes("مفيش خدمة مصرية موثقة") || helpSrc.includes("مش هنختلقلك رقم خدمة كده")
  );

  // Verified Ministry fallback link + platform note.
  check(
    "the verified Ministry page is the only external link",
    HELP_LINKS.length === 1 &&
      HELP_LINKS[0].url ===
        "https://www.mohp.gov.eg/SectorServices.aspx?Deptcode=4&SectorCode=2" &&
      HELP_LINKS[0].id === "mohp-secretariat-page"
  );
  check(
    "the platform-unavailability note is present and does NOT claim the app broke it",
    PLATFORM_UNAVAILABLE_NOTE.includes("مش من جهازك ولا من التطبيق") &&
      helpSrc.includes("{PLATFORM_UNAVAILABLE_NOTE}")
  );
  check(
    "the unverified platform host is never LINKED from the screen (comments documenting the investigation are fine)",
    !/href[^>]*mentalhealth|`tel:.*mentalhealth/.test(helpSrc)
  );
  check(
    "verification date is recorded in the data",
    /^\u0662\u0660\u0662\u0666/.test(HELP_INFO_VERIFIED_AT)
  );
}

console.log("== B2: tel links are user-initiated only (no network code) ==");
{
  check(
    "phone actions are plain tel: anchors (device dialer), no fetch/telemetry",
    /href=\{`tel:\$\{/.test(helpSrc) &&
      !/fetch\(|XMLHttpRequest|axios/.test(helpSrc)
  );
  check(
    "the single external link uses target=_blank + rel=noopener noreferrer",
    /target="_blank"\s*\n?\s*rel="noopener noreferrer"/.test(helpSrc) ||
      helpSrc.includes('target="_blank"') && helpSrc.includes('rel="noopener noreferrer"')
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
