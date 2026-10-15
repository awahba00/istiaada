/**
 * F4b — previous-dose dates render as localized Arabic dates, never raw ISO
 * day keys, and never shift across a timezone boundary.
 * Run: bun scripts/test-prevdose-dates.ts
 *
 * Behavioral: runs the REAL helpers (arabicDate + dayKeyDate) in-process AND
 * in a forced negative-UTC-offset subprocess (TZ=America/New_York) where the
 * naive `new Date("YYYY-MM-DD")` parse demonstrably shifts the calendar day
 * backwards — proving the display path uses local-component parsing.
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { arabicDate, dayKey, dayKeyDate } from "../src/lib/app/helpers";

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

const doseSrc = readFileSync(
  "src/components/app/screens/DoseScreen.tsx",
  "utf8"
);

console.log("== F4b: dose dates use the app's Arabic date formatting ==");
{
  const label = arabicDate(dayKeyDate("2026-10-14"));
  check(
    "a stored dose date formats to the localized weekday-day-month label (not the ISO key)",
    label === arabicDate(new Date(2026, 9, 14)) &&
      !/^\d{4}-\d{2}-\d{2}$/.test(label) &&
      label.includes("أكتوبر")
  );
  check(
    "the label carries the day number and month (content parity with other screens)",
    /١٤|14/.test(label)
  );
  check(
    "previous-dose rows render arabicDate(dayKeyDate(d.date))",
    /\{arabicDate\(dayKeyDate\(d\.date\)\)\} · \{CATEGORY_LABELS/.test(
      doseSrc
    )
  );
  check(
    "no raw {d.date} display remains in the previous-dose rows",
    !/\{d\.date\} ·/.test(doseSrc)
  );
  check(
    "DoseScreen imports dayKeyDate (the local-component parser)",
    /import \{ dayKey, arabicDate, dayKeyDate, occurrenceTime \}/.test(
      doseSrc
    )
  );
  // Order and meaning must come from the stored key, never the display label.
  check(
    "history order still sorts by the raw stored key (display change only)",
    /\.sort\(\(a, b\) => \(a\.date < b\.date \? 1 : -1\)\)/.test(doseSrc)
  );
  check(
    "stored data untouched: the screen only READS doseLog (no writes/assignments)",
    (() => {
      // Every dailyLogs occurrence is a read (selector + memo deps); no
      // assignment, no mutation of stored entries anywhere in the screen.
      const reads = doseSrc.match(/dailyLogs/g) ?? [];
      const written = doseSrc.match(/dailyLogs\s*=[^=]|doseLog\.push|doseLog\s*=/g) ?? [];
      return reads.length === 2 && written.length === 0;
    })()
  );
}

console.log("== F4b: date-only strings never shift across a timezone boundary ==");
{
  // A date-only key that WOULD shift under a naive UTC parse in a negative
  // UTC offset (UTC midnight 2026-10-14 = Oct 13 20:00 EDT).
  const probeCode = `
    const { arabicDate, dayKeyDate } = await import(process.cwd() + "/src/lib/app/helpers.ts");
    const d = dayKeyDate("2026-10-14");
    console.log(JSON.stringify({
      localDay: d.getDate(),
      naiveIsoDay: new Date("2026-10-14").getDate(),
      label: arabicDate(d),
      naiveLabel: arabicDate("2026-10-14"),
      controlLabel: arabicDate(new Date(2026, 9, 14)),
    }));
  `;
  const res = spawnSync(process.execPath, ["-e", probeCode], {
    encoding: "utf8",
    env: { ...process.env, TZ: "America/New_York" },
    timeout: 30000,
  });
  const out = res.stdout.trim();
  check("TZ probe subprocess ran and printed JSON", out.startsWith("{"));
  if (out.startsWith("{")) {
    const probe = JSON.parse(out) as {
      localDay: number;
      naiveIsoDay: number;
      label: string;
      naiveLabel: string;
      controlLabel: string;
    };
    // Prove the hazard is real for the naive path in this TZ…
    check(
      "the naive ISO parse DOES shift a day backwards in TZ=America/New_York (hazard is real)",
      probe.naiveIsoDay === 13
    );
    // …and that the shipped path avoids it.
    check(
      "dayKeyDate keeps the stored calendar day (14) in that same timezone",
      probe.localDay === 14
    );
    check(
      "the rendered label is the stored day's label, not the shifted one",
      probe.label === probe.controlLabel && probe.label !== probe.naiveLabel
    );
  }
  // And the same guarantees in the current process timezone:
  check(
    "dayKeyDate is timezone-stable in the current environment too",
    dayKeyDate("2026-10-14").getDate() === 14 &&
      dayKeyDate("2026-10-14").getMonth() === 9
  );
  check(
    "arabicDate(dayKeyDate(x)) equals the locally-constructed control label",
    arabicDate(dayKeyDate("2026-10-14")) === arabicDate(new Date(2026, 9, 14))
  );
}

console.log("== F4b: surrounding dose history contract unchanged ==");
{
  check(
    "previous-doses still exclude today and take the 5 most recent",
    /\.filter\(\(d\) => d\.date !== today\)[\s\S]{0,120}?\.slice\(0, 5\)/.test(
      doseSrc
    )
  );
  check(
    "rows still open the dose's knowledge item (F4 direct-open intact)",
    /onClick=\{\(\) => openKnowledgeItem\(d\.itemId\)\}/.test(doseSrc)
  );
  check(
    "dose status badges and titles are untouched",
    /d\.status === "done" \? "أنجزتها" : "تخطّيتها"/.test(doseSrc)
  );
  check(
    "today's day key rule is untouched (same dayKey usage)",
    /const today = dayKey\(\);/.test(doseSrc)
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
