/**
 * Backup validation & serialization — spec: safe JSON export/import.
 *
 * Philosophy: import is ATOMIC. We fully parse, validate structure, validate
 * schema/version, validate types and only then hand a clean AppData object to
 * the store. A failed validation never touches existing state.
 *
 * All functions are pure and run on-device. No data leaves the browser.
 */

import type { AppData } from "./types";
import { nowIso } from "./helpers";
import { normalizeScaleValue, anyLegacyScaleValue } from "./scale";

export const APP_ID = "istiaada";
/** Backup envelope identifiers we accept on import (current + legacy). */
export const ACCEPTED_APP_IDS = [APP_ID, "masar"];
/** Structural version of the backup envelope. Bump on breaking changes. */
export const BACKUP_SCHEMA_VERSION = 1;
/**
 * Human-facing application version (shown in Settings, written to backups).
 * 2.2.0 is the first version writing the 1–5 self-report scale — imports use
 * it to distinguish old 1–10 backups from new ones (see isLegacyScaleBackup).
 * 2.3.0 adds the Phase 2B.2 slip/relapse classification + behaviors fields
 * (optional on events; legacy records simply omit them).
 */
export const APP_VERSION = "2.3.0";

export interface BackupSummary {
  exportedAt: string | null;
  onboardingCompleted: boolean;
  urgeChecks: number;
  interventions: number;
  relapses: number;
  rules: number;
  checkIns: number;
  plans: number;
  journeyStart: string | null;
}

export type ValidationResult =
  | { ok: true; data: AppData; summary: BackupSummary }
  | { ok: false; error: string };

/* ————— tiny type guards ————— */

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isStr = (v: unknown): v is string => typeof v === "string";

const isBool = (v: unknown): v is boolean => typeof v === "boolean";

const isNum = (v: unknown, min: number, max: number): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;

const isInt = (v: unknown, min: number, max: number): v is number =>
  isNum(v, min, max) && Number.isInteger(v);

const isStrArr = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every(isStr);

const oneOf =
  <T extends string>(values: readonly T[]) =>
  (v: unknown): v is T =>
    isStr(v) && (values as readonly string[]).includes(v);

const isIsoDate = (v: unknown): v is string =>
  isStr(v) && !Number.isNaN(new Date(v).getTime());

/* ————— enums (mirror types.ts) ————— */

const DEVICE_NEEDS = ["yes", "no", "sometimes"] as const;
const SUPPORT_PREFS = [
  "science",
  "practical",
  "psychological",
  "spiritual",
  "mixed",
] as const;
const TIME_TO_STOP = [
  "immediately",
  "minutes",
  "under-hour",
  "longer",
] as const;
/** Phase 2B.2 — user-chosen classification (زَلّة/انتكاسة), never inferred. */
const RELAPSE_CLASSIFICATIONS = ["slip", "relapse"] as const;
/** Phase 2B.2 — which behavior(s) occurred within the episode. */
const RELAPSE_BEHAVIORS = ["pornography", "masturbation"] as const;
const IV_SOURCES = ["urge-check", "emergency", "manual", "plan"] as const;
const RULE_SOURCES = ["user", "suggested"] as const;
const THEMES = ["dark", "light"] as const;
const DOSE_STATUS = ["done", "skipped"] as const;
const PLAN_MODES = ["minimum", "standard", "extra"] as const;

/* ————— item validators —————
 * Each returns an Arabic field hint when invalid, null when valid.
 * NOTE: scale-field bounds intentionally stay 1–10 so LEGACY (1–10 era)
 * backups pass validation — they are converted to 1–5 afterwards in
 * validateBackup() via the documented mapping in scale.ts. */

function checkUrgeCheck(c: unknown): string | null {
  if (!isObj(c)) return "سجل فحص رغبة غير صالح";
  if (!isStr(c.id) || !isIsoDate(c.ts)) return "تاريخ/معرّف غير صالح في فحوصات الرغبة";
  if (!isInt(c.urge, 1, 10) || !isInt(c.proximity, 1, 10) || !isInt(c.control, 1, 10))
    return "قيم أبعاد غير صالحة في فحوصات الرغبة";
  if (!isInt(c.riskLevel, 1, 10)) return "درجة حالة غير صالحة في فحوصات الرغبة";
  const ctx = c.context;
  if (
    !isObj(ctx) ||
    !isBool(ctx.alone) ||
    !isBool(ctx.lateNight) ||
    !isBool(ctx.inBed) ||
    !isBool(ctx.browsingStarted) ||
    !isBool(ctx.deviceNeededNow)
  )
    return "سياق غير صالح في فحوصات الرغبة";
  if (!isStrArr(c.triggers)) return "محفزات غير صالحة في فحوصات الرغبة";
  if (c.outcome !== undefined && !oneOf(["handled", "escalated", "acted", "pending"])(c.outcome))
    return "نتيجة غير صالحة في فحوصات الرغبة";
  return null;
}

function checkInterventionLog(l: unknown): string | null {
  if (!isObj(l)) return "سجل تدخل غير صالح";
  if (!isStr(l.id) || !isIsoDate(l.ts) || !isStr(l.interventionId))
    return "بيانات ناقصة في سجل التدخلات";
  if (!isInt(l.riskLevel, 1, 10)) return "درجة حالة غير صالحة في سجل التدخلات";
  if (!oneOf(IV_SOURCES)(l.source)) return "مصدر غير صالح في سجل التدخلات";
  return null;
}

function checkRelapseEvent(e: unknown): string | null {
  if (!isObj(e)) return "سجل زلّة أو انتكاسة غير صالح";
  if (!isStr(e.id) || !isIsoDate(e.ts))
    return "تاريخ/معرّف غير صالح في سجل الزلات والانتكاسات";
  if (!oneOf(TIME_TO_STOP)(e.timeToStop))
    return "مدة توقف غير صالحة في سجل الزلات والانتكاسات";
  if (!isBool(e.continued) || !isBool(e.reviewed))
    return "قيم غير صالحة في سجل الزلات والانتكاسات";
  if (!isStrArr(e.triggers))
    return "محفزات غير صالحة في سجل الزلات والانتكاسات";
  // Phase 2B.2 fields — optional (legacy records omit them; never guessed).
  if (e.classification !== undefined && !oneOf(RELAPSE_CLASSIFICATIONS)(e.classification))
    return "تصنيف غير صالح في سجل الزلات والانتكاسات";
  if (e.behaviors !== undefined) {
    if (
      !Array.isArray(e.behaviors) ||
      e.behaviors.length === 0 ||
      !e.behaviors.every((b) => oneOf(RELAPSE_BEHAVIORS)(b)) ||
      new Set(e.behaviors).size !== e.behaviors.length
    )
      return "أنواع سلوك غير صالحة في سجل الزلات والانتكاسات";
  }
  return null;
}

function checkIfThenRule(r: unknown): string | null {
  if (!isObj(r)) return "قاعدة وقاية غير صالحة";
  if (!isStr(r.id) || !isStr(r.ifText) || !isStr(r.thenText))
    return "نص قاعدة وقاية غير صالح";
  if (!isBool(r.active)) return "حالة تفعيل غير صالحة في قواعد الوقاية";
  if (!oneOf(RULE_SOURCES)(r.source)) return "مصدر غير صالح في قواعد الوقاية";
  if (!isIsoDate(r.createdAt)) return "تاريخ غير صالح في قواعد الوقاية";
  return null;
}

function checkCheckIn(c: unknown): string | null {
  if (!isObj(c)) return "سجل مراجعة مسائية غير صالح";
  if (!isStr(c.date) || !/^\d{4}-\d{2}-\d{2}$/.test(c.date))
    return "تاريخ غير صالح في المراجعات المسائية";
  if (!isInt(c.highestUrge, 1, 10)) return "قيمة رغبة غير صالحة في المراجعات المسائية";
  if (!isStr(c.mainTrigger) || !isStr(c.interventionUsed) || !isStr(c.lesson))
    return "حقول نصية غير صالحة في المراجعات المسائية";
  if (
    !isInt(c.sleepQuality, 1, 5) ||
    !isInt(c.stress, 1, 5) ||
    !isInt(c.loneliness, 1, 5) ||
    !isInt(c.freeTime, 1, 5)
  )
    return "مقاييس غير صالحة في المراجعات المسائية";
  return null;
}

function checkPlan(p: unknown): string | null {
  if (!isObj(p)) return "خطة يومية غير صالحة";
  if (!isStr(p.date) || !/^\d{4}-\d{2}-\d{2}$/.test(p.date))
    return "تاريخ غير صالح في الخطط اليومية";
  if (!oneOf(PLAN_MODES)(p.mode)) return "نمط خطة غير صالح";
  if (!isStr(p.purposeTask) || !isStr(p.bodyChoice)) return "حقول غير صالحة في الخطط اليومية";
  if (!isStrArr(p.completedSections)) return "أقسام مكتملة غير صالحة في الخطط اليومية";
  return null;
}

function checkDoseEntry(d: unknown): string | null {
  if (!isObj(d)) return "سجل جرعة غير صالح";
  if (!isStr(d.date) || !/^\d{4}-\d{2}-\d{2}$/.test(d.date))
    return "تاريخ غير صالح في سجل الجرعات";
  if (!isStr(d.itemId)) return "معرّف جرعة غير صالح";
  if (!oneOf(DOSE_STATUS)(d.status)) return "حالة جرعة غير صالحة";
  return null;
}

function arrEvery(arr: unknown[], f: (x: unknown) => string | null): string | null {
  for (const item of arr) {
    const err = f(item);
    if (err) return err;
  }
  return null;
}

/* ————— scale-era detection (1–10 → 1–5 migration) ————— */

/**
 * Old backups (written before the 1–5 scale) hold 1–10 values in
 * urgeChecks (urge/proximity/control/riskLevel), interventionLogs
 * (riskLevel) and checkIns (highestUrge). The backup schema version is
 * intentionally NOT bumped (same envelope structure), so era detection is:
 *   1. appVersion, when present: < 2.2.0 → 1–10 era; ≥ 2.2.0 → 1–5 era.
 *   2. fallback (no appVersion): any scale value > 5 anywhere → 1–10 era.
 * Values are then converted with the documented band mapping in scale.ts.
 */
function isLegacyScaleBackup(parsed: Record<string, unknown>, data: Record<string, unknown>): boolean {
  const v = parsed.appVersion;
  if (typeof v === "string" && /^\d+\.\d+\.\d+$/.test(v)) {
    const [major, minor] = v.split(".").map(Number);
    return major < 2 || (major === 2 && minor < 2);
  }
  return anyLegacyScaleValue(data);
}

/* ————— main validation ————— */

export function validateBackup(json: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "تعذر قراءة الملف — تأكد أنه ملف JSON سليم غير تالف." };
  }

  if (!isObj(parsed)) {
    return { ok: false, error: "الملف ليس نسخة احتياطية من ده التطبيق." };
  }

  const appId = parsed.app;
  if (!isStr(appId) || !(ACCEPTED_APP_IDS as readonly string[]).includes(appId)) {
    return { ok: false, error: "الملف ليس نسخة احتياطية من هذا التطبيق." };
  }

  // Schema version: explicit field wins; legacy backups fall back to data.version.
  const rawSchema = parsed.schemaVersion;
  const data = parsed.data;
  if (rawSchema !== undefined && !isInt(rawSchema, 1, 99)) {
    return { ok: false, error: "بنية الملف غير صالحة — مفيش بيانات جوا النسخة." };
  }
  if (!isObj(data)) {
    return { ok: false, error: "بنية الملف غير صالحة — لا توجد بيانات داخل النسخة." };
  }
  const schemaVersion = rawSchema ?? (isInt(data.version, 1, 99) ? data.version : -1);
  if (schemaVersion !== BACKUP_SCHEMA_VERSION) {
    return {
      ok: false,
      error: `نسخة النسخة الاحتياطية (إصدار ${schemaVersion}) غير مدعومة — هذا التطبيق يدعم الإصدار ${BACKUP_SCHEMA_VERSION}.`,
    };
  }

  if (!isObj(data.userProfile)) {
    return { ok: false, error: "بيانات الملف الشخصي ناقصة أو تالفة." };
  }
  if (!isBool(data.onboardingCompleted)) {
    return { ok: false, error: "حالة إكمال التهيئة غير صالحة في النسخة." };
  }
  if (!isObj(data.journey) || !isIsoDate((data.journey as Record<string, unknown>).startDate)) {
    return { ok: false, error: "تاريخ بداية الرحلة غير صالح في النسخة." };
  }

  const up = data.userProfile as Record<string, unknown>;
  if (
    !isStrArr(up.goals) ||
    !isStrArr(up.difficultTimes) ||
    !isStrArr(up.patterns) ||
    !isStrArr(up.buildGoals) ||
    !isStrArr(up.whyReasons)
  ) {
    return { ok: false, error: "قوائم التهيئة غير صالحة في النسخة." };
  }
  if (!oneOf(DEVICE_NEEDS)(up.deviceNeeds)) {
    return { ok: false, error: "إعداد الجهاز غير صالح في النسخة." };
  }
  if (
    !isStr(up.why) ||
    !Array.isArray(up.supportPrefs) ||
    !up.supportPrefs.every((p) => oneOf(SUPPORT_PREFS)(p))
  ) {
    return { ok: false, error: "تفضيلات الدعم غير صالحة في النسخة." };
  }

  const dl = data.dailyLogs;
  if (!isObj(dl)) {
    return { ok: false, error: "السجلات اليومية غير صالحة في النسخة." };
  }
  if (!Array.isArray(dl.checkIns) || !Array.isArray(dl.plans) || !Array.isArray(dl.doseLog)) {
    return { ok: false, error: "السجلات اليومية غير صالحة في النسخة." };
  }

  if (!Array.isArray(data.urgeChecks) || !Array.isArray(data.interventionLogs)) {
    return { ok: false, error: "سجلات الفحص والتدخل غير صالحة في النسخة." };
  }
  if (!Array.isArray(data.relapseEvents) || !Array.isArray(data.preventionRules)) {
    return { ok: false, error: "سجلات الزلّة والوقاية غير صالحة في النسخة." };
  }

  let err: string | null =
    arrEvery(data.urgeChecks, checkUrgeCheck) ??
    arrEvery(data.interventionLogs, checkInterventionLog) ??
    arrEvery(data.relapseEvents, checkRelapseEvent) ??
    arrEvery(data.preventionRules, checkIfThenRule) ??
    arrEvery(dl.checkIns, checkCheckIn) ??
    arrEvery(dl.plans, checkPlan) ??
    arrEvery(dl.doseLog, checkDoseEntry);
  if (err) return { ok: false, error: `النسخة الاحتياطية تالفة: ${err}.` };

  const sp = data.supportPerson;
  if (sp != null && (!isObj(sp) || !isStr(sp.label) || !isStr(sp.phone))) {
    return { ok: false, error: "بيانات شخص الدعم غير صالحة في النسخة." };
  }

  const st = data.settings;
  if (
    !isObj(st) ||
    !isBool(st.dailyDoseEnabled) ||
    !isBool(st.spiritualContent) ||
    !isBool(st.postRelapseSupport) ||
    !isBool(st.notificationsEnabled) ||
    !oneOf(THEMES)(st.theme) ||
    !isStr(st.preferredDoseTime)
  ) {
    return { ok: false, error: "الإعدادات غير صالحة في النسخة." };
  }

  // ————— All checks passed: build a clean, known-shape AppData —————
  // Convert 1–10-era values to the 1–5 ladder when needed (documented band
  // mapping in scale.ts — see isLegacyScaleBackup above). Historical events
  // are preserved one-for-one; only their numeric representation changes.
  const legacy = isLegacyScaleBackup(parsed, data);
  const n = (v: number) => normalizeScaleValue(v, legacy);

  const clean: AppData = {
    version: BACKUP_SCHEMA_VERSION,
    onboardingCompleted: data.onboardingCompleted,
    userProfile: {
      goals: up.goals,
      difficultTimes: up.difficultTimes,
      patterns: up.patterns,
      deviceNeeds: up.deviceNeeds,
      buildGoals: up.buildGoals,
      supportPrefs: up.supportPrefs as AppData["userProfile"]["supportPrefs"],
      why: up.why,
      whyReasons: up.whyReasons,
    },
    journey: { startDate: (data.journey as { startDate: string }).startDate },
    urgeChecks: (data.urgeChecks as AppData["urgeChecks"]).map((c) => ({
      ...c,
      urge: n(c.urge),
      proximity: n(c.proximity),
      control: n(c.control),
      riskLevel: n(c.riskLevel),
    })),
    interventionLogs: (data.interventionLogs as AppData["interventionLogs"]).map((l) => ({
      ...l,
      riskLevel: n(l.riskLevel),
    })),
    dailyLogs: {
      checkIns: (dl.checkIns as AppData["dailyLogs"]["checkIns"]).map((c) => ({
        ...c,
        highestUrge: n(c.highestUrge), // sleep/stress/loneliness/freeTime were already 1–5
      })),
      plans: dl.plans as AppData["dailyLogs"]["plans"],
      doseLog: dl.doseLog as AppData["dailyLogs"]["doseLog"],
    },
    relapseEvents: data.relapseEvents as AppData["relapseEvents"],
    preventionRules: data.preventionRules as AppData["preventionRules"],
    supportPerson: isObj(sp) && isStr(sp.label) && isStr(sp.phone)
      ? { label: sp.label, phone: sp.phone }
      : null,
    settings: {
      dailyDoseEnabled: st.dailyDoseEnabled,
      spiritualContent: st.spiritualContent,
      preferredDoseTime: st.preferredDoseTime,
      postRelapseSupport: st.postRelapseSupport,
      theme: st.theme,
      notificationsEnabled: st.notificationsEnabled,
    },
  };

  return {
    ok: true,
    data: clean,
    summary: summarizeBackup(isStr(parsed.exportedAt) ? parsed.exportedAt : null, clean),
  };
}

export function summarizeBackup(exportedAt: string | null, d: AppData): BackupSummary {
  return {
    exportedAt: isIsoDate(exportedAt) ? exportedAt : null,
    onboardingCompleted: d.onboardingCompleted,
    urgeChecks: d.urgeChecks.length,
    interventions: d.interventionLogs.length,
    relapses: d.relapseEvents.length,
    rules: d.preventionRules.length,
    checkIns: d.dailyLogs.checkIns.length,
    plans: d.dailyLogs.plans.length,
    journeyStart: d.journey.startDate ?? null,
  };
}

/** Build the export envelope. Same shape validateBackup() accepts. */
export function buildBackupJson(d: AppData): string {
  return JSON.stringify(
    {
      app: APP_ID,
      schemaVersion: BACKUP_SCHEMA_VERSION,
      appVersion: APP_VERSION,
      exportedAt: nowIso(),
      data: d,
    },
    null,
    2
  );
}
