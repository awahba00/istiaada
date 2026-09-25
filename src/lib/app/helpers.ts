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
