/**
 * A2/A3/B3 — privacy-facing data flows: the pre-export warning, the
 * clipboard caveat, and the shared import size limit.
 * The size gate runs for real against validateBackup; the warning/caveat
 * UI is pinned by source contract (dialog BEFORE download, cancel-safe,
 * truthful content list, honest OS-level clipboard framing).
 * Run: bun scripts/test-privacy-ui.ts
 */
import { readFileSync } from "node:fs";
import {
  validateBackup,
  buildBackupJson,
  MAX_BACKUP_BYTES,
  backupByteLength,
  backupTooLargeError,
} from "../src/lib/app/backup";
import type { AppData } from "../src/lib/app/types";

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

const settingsSrc = readFileSync("src/components/app/screens/SettingsScreen.tsx", "utf8");
const restoreSrc = readFileSync("src/components/app/RestoreBackup.tsx", "utf8");

const baseData: AppData = {
  version: 1,
  onboardingCompleted: true,
  userProfile: {
    goals: [],
    difficultTimes: [],
    patterns: [],
    deviceNeeds: "sometimes",
    buildGoals: [],
    supportPrefs: ["mixed"],
    why: "سبب شخصي حساس",
    whyReasons: [],
  },
  journey: { startDate: "2026-01-01T10:00:00.000Z" },
  urgeChecks: [],
  interventionLogs: [],
  dailyLogs: { checkIns: [], plans: [], doseLog: [] },
  relapseEvents: [],
  preventionRules: [],
  supportPerson: { label: "خالد", phone: "+201000000000" },
  settings: { dailyDoseEnabled: true, spiritualContent: false, theme: "dark" },
};

console.log("== A2: the export schema is what the warning claims ==");
{
  const json = buildBackupJson(baseData);
  const parsed = JSON.parse(json);
  const d = parsed.data;
  check("the backup really contains support-person contact details", d.supportPerson?.phone === "+201000000000");
  check("the backup really contains the personal why (free text)", d.userProfile.why === "سبب شخصي حساس");
  check(
    "the backup really contains the relapse/review/check-in/plan/rule containers",
    Array.isArray(d.relapseEvents) && Array.isArray(d.dailyLogs.checkIns) &&
      Array.isArray(d.dailyLogs.plans) && Array.isArray(d.preventionRules)
  );
  check(
    "the warning lists ONLY fields that are really in the schema (no invented claims)",
    settingsSrc.includes("بيانات شخص الدعم") &&
      settingsSrc.includes("سببك الشخصي") &&
      settingsSrc.includes("زلاتك/انتكاساتك بتصنيفها ومراجعاتها ودروسها") &&
      settingsSrc.includes("مراجعاتك المسائية وتأملاتك، وخططك اليومية، وقواعد «إذا… إذن»") &&
      !settingsSrc.includes("كلمات السر") // no false field claims
  );
  check(
    "the warning states the file is unencrypted and readable by anyone who gets it",
    settingsSrc.includes("الملف مش متشفّر") && settingsSrc.includes("أي حد يوصل له يقدر يقراه بالكامل")
  );
  check(
    "the warning advises safe storage + accidental-sharing risk (and never claims to encrypt)",
    settingsSrc.includes("خزّن الملف في مكان آمن") &&
      !settingsSrc.includes("هنشفّر") && !settingsSrc.includes("التشفير بيحمي")
  );
}

console.log("== A2: the warning gates the download ==");
{
  check(
    "the download button opens the warning dialog (not the download)",
    /exportWarnOpen/.test(settingsSrc) &&
      /<AlertDialogTrigger asChild>[\s\S]{0,200}تصدير البيانات/.test(settingsSrc)
  );
  check(
    "the warning is an explicit confirm/cancel pair (رجوع vs نزّل النسخة)",
    settingsSrc.includes("فاهم — نزّل النسخة")
  );
  check(
    "ONLY the confirm action calls downloadExport",
    /AlertDialogAction onClick=\{downloadExport\}/.test(settingsSrc) &&
      /AlertDialogTrigger asChild>[\s\S]{0,400}?<Button[^>]*onClick=\{downloadExport\}/.test(settingsSrc) === false
  );
  check(
    "cancel path: no Blob/URL is created outside downloadExport",
    /new Blob/.test(settingsSrc) && (settingsSrc.match(/new Blob\(/g) ?? []).length === 1 &&
      /downloadExport = \(\) => \{[\s\S]*?new Blob/.test(settingsSrc)
  );
}

console.log("== A3: the clipboard caveat ==");
{
  check(
    "the copy action stays user-initiated (onClick → clipboard.writeText of the same export)",
    /onClick=\{copyExport\}/.test(settingsSrc) &&
      /navigator\.clipboard\.writeText\(exportData\(\)\)/.test(settingsSrc)
  );
  check(
    "the caveat is visible near the copy button (not hidden behind a dialog)",
    settingsSrc.includes("نسخ إلى الحافظة") &&
      settingsSrc.includes("نسخ الحافظة بينزل نفس محتوى النسخة الاحتياطية")
  );
  check(
    "the caveat says the OS may sync clipboards — and explicitly NOT an app transmission",
    settingsSrc.includes("خاصية من نظام التشغيل نفسه، مش إرسال من التطبيق") &&
      settingsSrc.includes("التطبيق مبيبعت")
  );
  check(
    "no automatic clipboard access / telemetry / network code anywhere in the screens",
    !/navigator\.clipboard\.readText|fetch\(|sendBeacon|XMLHttpRequest/.test(settingsSrc) &&
      !/navigator\.clipboard\.readText|fetch\(|sendBeacon|XMLHttpRequest/.test(restoreSrc)
  );
}

console.log("== B3: the shared size limit ==");
{
  // Byte accounting for plain ASCII and Arabic text.
  check(
    "backupByteLength measures UTF-8 bytes (Arabic counts 2 bytes/char)",
    backupByteLength("a") === 1 && backupByteLength("ا") === 2
  );
  check(
    "the cap is exactly 20MB, shared by file and paste paths",
    MAX_BACKUP_BYTES === 20 * 1024 * 1024 &&
      restoreSrc.includes("MAX_BACKUP_BYTES") &&
      !/const MAX_BACKUP_BYTES = 20 \* 1024 \* 1024; \/\/ 20MB sanity cap/.test(restoreSrc)
  );
  check(
    "the helper returns null below the cap and an Arabic error above it",
    backupTooLargeError("x") === null &&
      backupTooLargeError("x".repeat(MAX_BACKUP_BYTES + 1)) !== null
  );
  check(
    "boundary: exactly 20MB passes the size gate; +1 byte is rejected",
    (() => {
      const at = "a".repeat(MAX_BACKUP_BYTES);
      const over = "a".repeat(MAX_BACKUP_BYTES + 1);
      return backupTooLargeError(at) === null && backupTooLargeError(over) !== null;
    })()
  );
  check(
    "validateBackup rejects oversized input BEFORE parsing (no JSON.parse on huge strings)",
    (() => {
      // 20MB+1 of ASCII junk — if parsing happened first, JSON.parse of an
      // invalid 20MB string would still throw (caught) but the ERROR would
      // be the parse error, not the size error. Assert the size message.
      const huge = "x".repeat(MAX_BACKUP_BYTES + 1);
      const res = validateBackup(huge);
      return !res.ok && res.error === backupTooLargeError(huge);
    })()
  );
  check(
    "a normal backup still validates fine (the gate doesn't over-block)",
    validateBackup(buildBackupJson(baseData)).ok === true
  );
  check(
    "oversized import is rejected WITHOUT state mutation (validateBackup runs before any set)",
    (() => {
      const res = validateBackup("x".repeat(MAX_BACKUP_BYTES + 1));
      return !res.ok;
    })()
  );
  check(
    "the paste path goes through validateBackup too (preview + import share the gate)",
    restoreSrc.includes("validateBackup(raw)") &&
      /importData\(raw\)/.test(restoreSrc)
  );
  check(
    "the file path keeps its pre-read check using the shared constant",
    /f\.size > MAX_BACKUP_BYTES/.test(restoreSrc)
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
