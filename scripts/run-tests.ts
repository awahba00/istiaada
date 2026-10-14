/**
 * C1 — one aggregate test command: `bun run test`.
 *
 * Discovers every scripts/test-*.ts suite (sorted, glob via directory scan —
 * no shell expansion, so behavior is identical on Windows and Unix-like
 * systems), runs each in its own `bun` process (suites call process.exit),
 * parses each suite's own final summary line ("N passed, M failed"),
 * aggregates, prints a per-suite table, and exits non-zero if ANY suite
 * fails. Nothing is silently skipped: a suite that crashes before printing
 * a summary is reported as failed with its exit code.
 */
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const SUITE_DIR = "scripts";

function discoverSuites(): string[] {
  return readdirSync(SUITE_DIR)
    .filter((f) => /^test-.*\.ts$/.test(f))
    .sort()
    .map((f) => `${SUITE_DIR}/${f}`);
}

interface SuiteResult {
  file: string;
  exitCode: number;
  passed: number | null;
  failed: number | null;
  summaryLine: string;
}

function runSuite(file: string): SuiteResult {
  const res = spawnSync(process.execPath, [file], {
    encoding: "utf8",
    timeout: 120000,
  });
  const out = (res.stdout ?? "") + (res.stderr ?? "");
  // A suite's own final line, e.g. "— progress.ts tests: 88 passed, 0 failed"
  // or the plain "46 passed, 0 failed".
  const m = out.match(/(\d+)\s+passed,\s*(\d+)\s+failed/);
  return {
    file,
    exitCode: res.status ?? 1,
    passed: m ? Number(m[1]) : null,
    failed: m ? Number(m[2]) : null,
    summaryLine: (m?.[0] ?? "(no summary printed — crashed?)").trim(),
  };
}

const suites = discoverSuites();
if (suites.length === 0) {
  console.error("No test suites found under scripts/ — the runner is broken.");
  process.exit(2);
}

console.log(`Running ${suites.length} test suite(s) under ${SUITE_DIR}/\n`);
const results: SuiteResult[] = [];
for (const f of suites) {
  const r = runSuite(f);
  results.push(r);
  const status = r.exitCode === 0 ? "✓" : "✗";
  console.log(`  ${status} ${f}  [${r.summaryLine}]`);
}

let totalPass = 0;
let totalFail = 0;
let failedSuites = 0;
let unknownSuites = 0;
for (const r of results) {
  if (r.passed == null || r.failed == null) {
    unknownSuites++;
    failedSuites++;
    continue;
  }
  totalPass += r.passed;
  totalFail += r.failed;
  if (r.exitCode !== 0) failedSuites++;
}

console.log("\n——————————————————————————————————————");
console.log(
  `suites: ${results.length}   passed: ${results.length - failedSuites}   failed: ${failedSuites}`
);
console.log(
  `checks: ${totalPass} passed, ${totalFail} failed` +
    (unknownSuites ? `, ${unknownSuites} suite(s) printed no count` : "")
);
console.log("——————————————————————————————————————");

if (failedSuites > 0) {
  for (const r of results.filter((x) => x.exitCode !== 0)) {
    console.error(`FAILED: ${r.file} (exit ${r.exitCode})`);
  }
  process.exit(1);
}
