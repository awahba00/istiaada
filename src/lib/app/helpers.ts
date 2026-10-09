/** Shared helpers — dates, ids, formatting (device-local, no external calls). */

export function uid(prefix = ""): string {
  return (
    prefix +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function dayKey(d: Date | string = new Date()): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetween(fromIso: string, toIso: string = nowIso()): number {
  const a = new Date(fromIso);
  const b = new Date(toIso);
  const diff = Math.floor(
    (b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)) / 86400000
  );
  return Math.max(0, diff);
}

export function arabicDate(iso: Date | string): string {
  try {
    return new Intl.DateTimeFormat("ar", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(typeof iso === "string" ? new Date(iso) : iso);
  } catch {
    return dayKey(iso);
  }
}

export function arabicDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return dayKey(iso);
  }
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "ليلة هادئة";
  if (h < 12) return "صباح الخير";
  if (h <17) return "نهارك طيب";
  if (h < 21) return "مساء الخير";
  return "مساء الخير";
}

export function timeBucket(ts: string): "morning" | "afternoon" | "evening" | "late-night" {
  const h = new Date(ts).getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "late-night";
}

export const TIME_BUCKET_LABELS: Record<string, string> = {
  morning: "الصباح (٥ص–١٢م)",
  afternoon: "بعد الظهر (١٢م–٥م)",
  evening: "المساء (٥م–١٠م)",
  "late-night": "الليل المتأخر (١٠م–٥ص)",
};

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Deterministic pseudo-random from a string seed (for stable daily selection). */
export function seededPick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return arr[h % arr.length];
}

/**
 * Normalize Arabic text for search matching: strips diacritics (harakat) and
 * tatweel, unifies alef/hamza forms (أإآٱ→ا), ى/ئ→ي, ؤ→و, ة→ه. Applied to
 * BOTH the query and the searched text so "كتاب" matches "كِتاب" etc.
 */
export function normalizeArabic(s: string): string {
  return s
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // harakat + dagger alef + tatweel
    .replace(/[\u0623\u0625\u0627\u0671]/g, "\u0627") // أ إ آ ٱ → ا
    .replace(/[\u0649\u0626]/g, "\u064A") // ى ئ → ي
    .replace(/\u0624/g, "\u0648") // ؤ → و
    .replace(/\u0629/g, "\u0647") // ة → ه
    .trim();
}

/* ————— Event occurrence dates (backdated slip/relapse recording) —————
 *
 * A Quick Log event may be recorded for a PAST local calendar day the user
 * explicitly selected («تاريخ الواقعة»). The occurrence is DAY-granular:
 * the app never fabricates an event time-of-day the user did not provide.
 * `ts` stays the entry timestamp everywhere; these helpers derive the
 * occurrence for display, ordering, and date-window metrics.
 */

/** Midnight-LOCAL Date for a YYYY-MM-DD day key — parsed from LOCAL
 *  components, never `new Date("YYYY-MM-DD")` (date-only strings parse as
 *  UTC midnight, which can shift the calendar day in non-positive UTC
 *  offsets). Mirrors dayKey(), which writes those components. */
export function dayKeyDate(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** The local calendar day an event OCCURRED: the user-selected `eventDate`
 *  when present, else the local day of `ts` (for every record created
 *  before the date selector — and for any log saved for today — the entry
 *  day IS the occurrence day). Day-granular, never a fabricated time. */
export function eventDay(e: { ts: string; eventDate?: string }): string {
  return e.eventDate ?? dayKey(e.ts);
}

/** Whole local days between a YYYY-MM-DD day key and today (0 = today).
 *  Same floor-to-local-midnight arithmetic as daysBetween(), so legacy
 *  records keep their exact current values. */
export function daysSinceDayKey(day: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - dayKeyDate(day).getTime()) / 86400000);
  return Math.max(0, diff);
}

/** Occurrence moment as epoch ms — for day/epoch window filters only:
 *  `ts` itself for legacy and same-day records (identical window behavior
 *  to the pre-backdating app, byte for byte); otherwise local NOON of the
 *  selected occurrence day. Noon is an internal anchor that keeps the
 *  selected calendar day inside every day-based window (7/14/28/30/60d) —
 *  it is never displayed or stored, so no event time is fabricated. */
export function occurrenceTime(e: { ts: string; eventDate?: string }): number {
  if (e.eventDate && e.eventDate !== dayKey(e.ts)) {
    return dayKeyDate(e.eventDate).getTime() + 12 * 3600000;
  }
  return new Date(e.ts).getTime();
}

/** Occurrence moment as an ISO string (epoch-equivalent consumers such as
 *  the Home state's 48h window — never displayed to the user). */
export function occurrenceIso(e: { ts: string; eventDate?: string }): string {
  if (e.eventDate && e.eventDate !== dayKey(e.ts)) {
    return new Date(dayKeyDate(e.eventDate).getTime() + 12 * 3600000).toISOString();
  }
  return e.ts;
}

/** True when the event's time-of-day is trustworthy for time-of-day stats:
 *  legacy records (occurrence == entry) and same-day quick logs. A
 *  user-selected PAST date carries no time-of-day, and the entry clock time
 *  is NOT the event's — such events are excluded from time-bucket patterns
 *  instead of being assigned a fabricated time. */
export function hasKnownEventTime(e: { ts: string; eventDate?: string }): boolean {
  return !e.eventDate || e.eventDate === dayKey(e.ts);
}

/** Quick Log date-selector rule: an event may be dated today or any PAST
 *  local day — future dates are rejected (YYYY-MM-DD compares
 *  chronologically as a string). */
export function isPastOrToday(day: string, today: string = dayKey()): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(day) && day <= today;
}

/** History/date-line label for an event: the selected occurrence date with
 *  a clear «سُجّل لاحقًا» marker when the user dated it to a past day; the
 *  entry moment (exactly as before) otherwise. */
export function eventDateLabel(e: { ts: string; eventDate?: string }): string {
  if (e.eventDate && e.eventDate !== dayKey(e.ts)) {
    return `${arabicDate(dayKeyDate(e.eventDate))} (سُجّل لاحقًا)`;
  }
  return arabicDateTime(e.ts);
}
