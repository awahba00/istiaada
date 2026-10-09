/**
 * «خطة التعامل مع المحفزات» — personalized trigger action plans.
 *
 * Turns a SUFFICIENTLY REPEATED first-trigger pattern from the user's own
 * calm reviews into a small, practical action plan inside TriggerMap.
 *
 * Source of truth (and the ONLY counting input): the explicit answer to the
 * review question «إيه اللي بدأ الموضوع؟» — `RelapseReview.trigger` on
 * reviewed events. Never counted: Quick Log's multi-select contextual
 * triggers, urge-check trigger arrays, inferred or guessed values.
 *
 * Threshold model (explicit product thresholds — NOT clinical evidence):
 *   0–2 qualifying events  → no plan (insufficient evidence, no pattern label)
 *   3–4                    → emerging pattern  «خطة مبدئية»
 *   ≥5                     → established        «نمط متكرر»
 *
 * Counts are derived at runtime from the retained event history (no rolling
 * window). Each distinct event counts at most once — by its one review
 * first-trigger answer. Nothing here is persisted, and no event schema
 * field is added for plans.
 */

import { TRIGGERS } from "@/data/app/taxonomy";
import { normalizeArabic, eventDay } from "./helpers";
import type { RelapseEvent } from "./types";

/**
 * Curated plan per trigger — one entry for EVERY id in the current trigger
 * taxonomy (a test enforces coverage, so a new taxonomy entry cannot become
 * plan-eligible without a mapped plan). Two or three concise, practical,
 * behavior-oriented steps each: recognize/name → change the immediate
 * environment or interrupt the routine → choose a realistic alternative
 * (and, where it fits, use an existing intervention). Calm, supportive
 * wording — no medical claims, no guaranteed outcomes, no shaming.
 * Reuses concepts the app already teaches (قائمة الملل، بروتوكول الليل،
 * «تدخّل دلوقتي»، قواعد «إذا… إذن»، شخص الدعم).
 */
export const TRIGGER_ACTION_PLANS: Record<string, string[]> = {
  memory: [
    "سمِّ اللي بيحصل: «دي ذكرى عالقة — مش إشارة للتنفيذ».",
    "غيّر حالتك الجسدية فورًا: قوم من مكانك وحرّك جسمك ٥ دقايق.",
    "وجّه انتباهك لمهمة محددة وملموسة (من خطتك أو قائمة الملل) — الذكرى تضعف لما الانتباه يتشغل.",
  ],
  thought: [
    "لاحظ الفكرة من غير ما تحاورها: «فكرة جت — ومش لازم أنفذها».",
    "ارجع انتباهك للي في إيدك دلوقتي: مهمة واحدة ١٠ دقايق.",
    "لو الفكرة استمرت: خطوة قطع فيزيائية — غيّر المكان أو الحركة.",
  ],
  fantasy: [
    "الخيال بيكبر بالتغذية — اقطع التغذية: سيب المكان أو الوضعية اللي إنت فيها.",
    "حوّل الإحساس لحاجة تانية: حركة، مية باردة، مشي.",
    "لو الخيال قوي: افتح «تدخّل دلوقتي» من الرئيسية — التدخل المبكر أسهل بكتير.",
  ],
  curiosity: [
    "سمّيه: «فضول» — مش حاجة لازم تلبّيها في اللحظة دي.",
    "اقفل المصدر (التاب أو التطبيق) قبل أي نقرة — الفضول بيفتكر لما الباب يتقفل.",
    "استبدله بفضول تاني: موضوع بتذاكره أو مهارة عايز تتعلمها.",
  ],
  boredom: [
    "سمّيه: «ملل» — إشارة إنك محتاج نشاط، مش محتوى.",
    "قوم وغيّر المكان — الملل بيتبع المكان الثابت.",
    "اختار بديل من قائمة الملل (٥/١٥/٣٠ دقيقة) ونفّذه فورًا.",
  ],
  loneliness: [
    "الوحدة محتاجة تواصل حقيقي — مش تصفح.",
    "ابعت لشخص تثق فيه أو استخدم واحدة من رسائل الدعم الجاهزة.",
    "لو التواصل مش متاح دلوقتي: اطلع وسط ناس (مشي، أي مكان عام) أو مكالمة قصيرة.",
  ],
  stress: [
    "التوتر محتاج تنفيس جسدي: حركة أو مشي — مش شاشة.",
    "نفّذ خطوة واحدة صغيرة من الموضوع اللي بيضغطك (٥ دقايق بس).",
    "لو التوتر مزمن: راجع نومك وضغط يومك — دول المصدر، مش «ضعف».",
  ],
  anxiety: [
    "خد ٦ أنفاس بطيئة: شهيق ٤ ثواني وزفير ٦.",
    "رجّع نفسك للحاضر: لاحظ ٥ حاجات بتشوفها و٤ بتلمسها.",
    "لو القلق مستمر: مشي أو حركة — الجسم اللي بيتحرك بيهدى أسرع.",
  ],
  sadness: [
    "الحزن إحساس محتاج احتواء — مش تهريب.",
    "اعمل حاجة بسيطة بتوصلك بناس أو بقيمة عندك: مكالمة، مشي، أو كتابة سطرين.",
    "اكتب: «إيه اللي مضايقني؟» — التسمية نفسها بتخفف الحمل.",
  ],
  anger: [
    "الغضب طاقة جسدية: فرّغها بحركة (قفزات، مشي سريع).",
    "ما تاخدش قرار وما تفتحش أي مصدر وانت في حالة الغضب.",
    "لو الغضب من خلاف: حله كلامي بعد ما تهدى — مش دلوقتي.",
  ],
  images: [
    "الصورة مش استدعاء — اقفل أو ابعد عينك في أول ثواني.",
    "غيّر المكان أو النشاط مباشرة — أول ٣٠ ثانية هي الأهم.",
    "لو بتتكرر في نفس المكان: احجب أو تجنّب المصدر نفسه.",
  ],
  feeds: [
    "المنصات بترسّخ نفسها — قفل التطبيق أقوى من الإرادة.",
    "حدّد وقت ومدة للتصفح مقدّم — وبرّه الوقت ده: اقفل.",
    "استخدم وضع التركيز أو حاجب على التطبيقات الأكثر خطرًا عليك.",
  ],
  websites: [
    "الموقع ده معروف إنه نقطة البداية — احجبه خلاص (حاجب مواقع).",
    "لو اتفتح آليًا: اقفل التاب فورًا من غير ما تكمل.",
    "خلّي البديل جاهز مكانه: تاب أو ملف عمل مفتوح.",
  ],
  search: [
    "البحث أول فعل تنفيذي في السلسلة — اقطعه هنا قبل النتايج.",
    "اقفل المتصفح كله — مش التاب بس.",
    "لو محتاج تبحث حاجة حقيقية: خليها بعد مهمة الجاية — مش دلوقتي.",
  ],
  stories: [
    "النص بيجر نص — اقطع السلسلة: اقفل المصدر.",
    "ما تكملش «خلّص بس» — دي أول خرافة في القطع.",
    "بدّلها بقراءة قصيرة تانية محضّرها (كتاب أو موضوع مهتم بيه).",
  ],
  aimless: [
    "التصفح بلا هدف بوابة — سمّيه واقفل.",
    "قاعدة: ما تفتحش الهاتف من غير مهمة محددة.",
    "لو إيدك بتفتح آليًا: خلّي الهاتف بعيد أو على وضع تركيز في أوقات الخطر.",
  ],
  "late-night": [
    "الوقت المتأخر أخطر وقت — ما تكملش صاحي بلا هدف.",
    "طبّق بروتوكول الليل: الهاتف خارج الغرفة ومنبّه منفصل.",
    "لو مش قادر تنام: قراءة ورقية أو استرخاء — مش شاشة.",
  ],
  bed: [
    "السرير للنوم بس — قوم منه فورًا.",
    "الهاتف بره السرير من الأساس (بروتوكول الليل).",
    "لو تعبان: اقعد في مكان تاني — غيّر «الوضع» مش المكان بس.",
  ],
  bathroom: [
    "المكان المغلق بيخفي الحلقة — دخول بمهمة ووقت محدد (٥ دقايق مثلًا).",
    "خلّي الهاتف بره الأماكن دي.",
    "لو الحلقة بترتبط بالمكان: غيّر روتينه أو استخدم مكان تاني.",
  ],
  isolation: [
    "الانعزال بيمهّد الحلقة — اكسره: اطلع وسط ناس دلوقتي.",
    "ابعت رسالة أو مكالمة قصيرة لأي حد تثق فيه.",
    "خطّط ساعات وجودك مع ناس في يومك — مش عشوائي.",
  ],
  "phone-habit": [
    "الإيد بتشتغل آلي — خلّي الهاتف بعيد (مكتب، جيب تاني، وضع تركيز).",
    "قبل ما تفتح: اسأل «بفتح ليه بالظبط؟» — لو ملوش إجابة: متفتحش.",
    "بدّل الحركة: مية، قوم امشي، أو مهمة صغيرة بدل الفتح.",
  ],
  "just-minute": [
    "«دقيقة واحدة» مش دقيقة — دي بداية سلسلة كاملة.",
    "اقطع فورًا: اقفل المصدر وقوم من مكانك.",
    "راجع ردود التطبيق على التبريرات — لكل تبرير رد جاهز.",
  ],
  testing: [
    "ما تختبرش نفسك جنب المحفز — دي خسارة شبه مضمونة.",
    "غيّر البيئة أو المكان فورًا — الاختبار بينتهي لما المصدر يختفي.",
    "ذكّر نفسك: القوة في القطع، مش في الصمود جنب الفخ.",
  ],
  scrolling: [
    "التمرير بلا غرض بيسحب الانتباه — اقفل التطبيق من الشاشة الرئيسية.",
    "تصفح بغرض وبمؤقت: مدة محددة، وبعدها اقفل.",
    "لو التمرير آلي: سيب الهاتف في مكان تاني ١٠ دقايق.",
  ],
};

export type TriggerPlanLevel = "emerging" | "established";

export interface TriggerPlanPattern {
  triggerId: string;
  label: string;
  /** Number of distinct reviewed events whose explicit first trigger is
   *  this trigger (the whole retained history — the transparency number). */
  count: number;
  level: TriggerPlanLevel;
  /** The curated plan steps (2–3 concise actions). */
  steps: string[];
  /** Day key (YYYY-MM-DD) of the most recent qualifying occurrence. */
  lastOccurrence: string;
}

/**
 * Resolve a stored review first-trigger answer to a current taxonomy id —
 * UNAMBIGUOUSLY or not at all:
 *   1. exact id match;
 *   2. exact known label match (legacy records / hand-edited imports that
 *      stored the label);
 *   3. exact match after the app's Arabic normalization (diacritics/forms).
 * Unknown values return null — never guessed, never silently remapped.
 */
export function normalizeReviewTrigger(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const byId = TRIGGERS.find((x) => x.id === t);
  if (byId) return byId.id;
  const byLabel = TRIGGERS.find((x) => x.label === t);
  if (byLabel) return byLabel.id;
  const norm = normalizeArabic(t);
  const byNormLabel = TRIGGERS.find((x) => normalizeArabic(x.label) === norm);
  return byNormLabel ? byNormLabel.id : null;
}

/** Plan-eligibility threshold — 3 distinct reviewed events with the same
 *  explicit first trigger (emerging), 5 for an established pattern. */
export const TRIGGER_PLAN_MIN_EVENTS = 3;
export const TRIGGER_PLAN_ESTABLISHED_EVENTS = 5;

/**
 * Derive the qualifying patterns from the retained events — pure and
 * runtime-only (nothing persisted). Each distinct event is counted at most
 * once, through its single review first-trigger answer; slips and relapses
 * both count as events (classification never duplicates an event). Sorted
 * strongest pattern first; ties broken by trigger id for determinism.
 */
export function deriveTriggerPlans(events: RelapseEvent[]): TriggerPlanPattern[] {
  const m = new Map<string, { count: number; last: string }>();
  for (const e of events) {
    // Only an EXPLICIT, KNOWN first-trigger review answer qualifies. Events
    // without review data, skipped answers (""), and unknown legacy values
    // stay uncounted — never guessed.
    if (!e.reviewed || !e.review) continue;
    const id = normalizeReviewTrigger(e.review.trigger);
    if (!id) continue;
    const day = eventDay(e);
    const cur = m.get(id);
    if (cur) {
      cur.count += 1;
      if (day > cur.last) cur.last = day;
    } else {
      m.set(id, { count: 1, last: day });
    }
  }
  return [...m.entries()]
    .filter(([, v]) => v.count >= TRIGGER_PLAN_MIN_EVENTS)
    .sort((a, b) => b[1].count - a[1].count || (a[0] < b[0] ? -1 : 1))
    .map(([id, v]) => ({
      triggerId: id,
      label: TRIGGERS.find((t) => t.id === id)?.label ?? id,
      count: v.count,
      level: v.count >= TRIGGER_PLAN_ESTABLISHED_EVENTS ? "established" : "emerging",
      steps: TRIGGER_ACTION_PLANS[id] ?? [],
      lastOccurrence: v.last,
    }));
}
