/**
 * GAP-02 / GAP-11 / NEED-020 / NEED-023 — verified professional-help
 * resources for Egypt (ISTIAADA help corridor).
 *
 * VERIFICATION PROTOCOL (2026-10-13, refined the same day by a per-claim
 * audit): every phone number, service scope, cost, confidentiality, and
 * hours claim below is carried ONLY where an official source actually
 * states it, per resource. A claim that appears only in third-party
 * directories is not repeated in the UI. Nothing here is invented.
 *
 * Sources consulted (per line):
 *   16328 — psychological support hotline, General Secretariat of Mental
 *   Health and Addiction Treatment (GSMHAT), Ministry of Health &
 *   Population:
 *     * Scope: psychological consultation + family counseling; urgent
 *       cases are handled and referred to appropriate care (social
 *       workers take the call, then phone referral to a psychologist or
 *       psychiatrist). Sources: GSMHAT official Facebook channel (services
 *       description "الدعم النفسي والإرشاد الأسري") + WHO EMRO mhps
 *       directory, Egypt row (fetched live 2026-10-13).
 *     * Hours 24/7: sis.gov.eg — ministry statement (Apr 2026):
 *       "round-the-clock psychological support through hotline 16328"
 *       (8,808 calls in Q1 2026; 252 emergencies addressed and referred) +
 *       WHO EMRO ("على مدار الساعة طيلة أيام الأسبوع").
 *     * Confidentiality: GSMHAT's own official channel announcing the
 *       hotline: "إحنا معاك… وبنسمعك باهتمام وسرية تامة".
 *     * COST: NOT claimed. "Free" appears only in the third-party
 *       progress.guide atlas (citing mohp.gov.eg, which we could not
 *       re-verify); no official source in our evidence states a cost for
 *       16328 → the UI says "خدمة حكومية" and nothing more.
 *     * It is NOT a specialized CSBD / problematic-pornography-use
 *       treatment service — no official source scopes it so, and the UI
 *       never presents it as one (general psychological support only).
 *   123 / 122 — national medical emergency / police: U.S. State
 *     Department "911 Abroad" reference + progress.guide (123 = medical
 *     emergency, "national emergency number for immediate assistance,
 *     including mental health crises").
 *   16023 — Fund for Combating and Treating Addiction (FDCTA) hotline:
 *     * Scope: substance-addiction treatment & rehabilitation ONLY. The
 *       fund's own site (drugcontrol.org.eg, fetched live) scopes the
 *       hotline to "مشكلة الإدمان والتعاطى" (substances). No official
 *       source describes it as a CSBD or pornography-related service, so
 *       the app must never present it as one — it is shown ONLY inside a
 *       separate, clearly-labeled substance-addiction context.
 *     * Hours 24/7, treatment free of charge, fully confidential: the
 *       fund's own official channels — "الخط الساخن لعلاج الإدمان معاك
 *       24 ساعة على مدار الأسبوع", "العلاج مجاني و بسرية تامة"
 *       (FDCTA Facebook / Instagram); continuity also confirmed by SIS
 *       (Mar 2026: the hotline keeps working through holidays).
 *   mentalhealth.mohp.gov.eg — GSMHAT directories (hospitals / centers /
 *   clinics / psychiatrists & psychologists), fetched live.
 *
 * KNOWN GAPS (deliberately NOT in the UI):
 *   - NO verified Egyptian pathway specialized in compulsive sexual
 *     behavior disorder (CSBD) or problematic pornography use could be
 *     found in official sources. The help screen states this explicitly
 *     and routes the user to a competent clinician + the first-session
 *     question "اشتغلت مع حالات زي حالتي قبل كده؟".
 *   - No independent Egypt-wide suicide crisis line could be verified
 *     beyond 16328/123; stale community listings were rejected.
 *   - No verifiable public price list for outpatient psychiatry clinics;
 *     the UI tells the user to ask about cost when booking.
 *   - The ministry's online therapy platform has no stable public URL we
 *     could verify, so it is described textually (not linked).
 */

export const HELP_INFO_VERIFIED_AT = "٢٠٢٦/١٠/١٣";

export interface HelpLine {
  id: string;
  title: string;
  /** What the line IS (scope), in one honest sentence. */
  what: string;
  numbers: string[];
  /** Honest service limits — what this line is NOT. */
  limits: string;
  hours: string;
  cost: string;
}

export const HELP_LINES: HelpLine[] = [
  {
    id: "gsmhat-hotline",
    title: "خط الدعم النفسي — وزارة الصحة والسكان",
    what: "خط الدعم النفسي العام للأمانة العامة للصحة النفسية وعلاج الإدمان: استشارة نفسية وإرشاد أسري، والحالات العاجلة بتتعامل وبتتحال للرعاية المناسبة — «بنسمعك باهتمام وسرية تامة» (إعلان الأمانة الرسمي).",
    numbers: ["16328"],
    limits: "خط دعم نفسي عام — مش علاج متخصص للسلوك الجنسي القهري أو الاستخدام الإشكالي للإباحية، ومش بديل عن إسعاف الطوارئ لو في خطر فوري على حياة.",
    hours: "٢٤ ساعة، طوال أيام الأسبوع",
    cost: "خدمة حكومية",
  },
  {
    id: "ambulance",
    title: "إسعاف الطوارئ",
    what: "الطوارئ الطبية الوطنية — لو في خطر فوري على حياتك أو حياة حد تاني.",
    numbers: ["123"],
    limits: "للطوارئ الطبية العاجلة — مش خط استشارة نفسية.",
    hours: "٢٤ ساعة",
    cost: "خدمة طوارئ وطنية",
  },
  {
    id: "police",
    title: "الشرطة",
    what: "للخطر الفوري على السلامة — لو الإسعاف مش متاح أو الموقف بيتطلب تدخل فوري غير طبي.",
    numbers: ["122"],
    limits: "للمواقف الأمنية العاجلة — مش خط دعم نفسي.",
    hours: "٢٤ ساعة",
    cost: "خدمة طوارئ وطنية",
  },
  {
    id: "addiction-fund",
    title: "خط علاج إدمان المواد — صندوق مكافحة وعلاج الإدمان والتعاطي",
    what: "خط صندوق مكافحة وعلاج الإدمان والتعاطي: مسار علاج وتأهيل إدمان المواد المخدرة — علاج مجاني وبسرية تامة حسب إعلان الصندوق الرسمي. لو صراعك شمل إدمان مواد غير السلوك اللي بتعمل عليه، دي الخدمة المخصصة ليه.",
    numbers: ["16023"],
    limits: "متخصص في إدمان المواد المخدرة — مش خط للسلوك الجنسي القهري أو الاستخدام الإشكالي للإباحية. للدعم النفسي العام: 16328.",
    hours: "٢٤ ساعة، طوال أيام الأسبوع",
    cost: "العلاج مجاني وبسرية تامة — وفق إعلان الصندوق الرسمي",
  },
];

export interface HelpLink {
  id: string;
  title: string;
  url: string;
  what: string;
}

export const HELP_LINKS: HelpLink[] = [
  {
    id: "gsmhat-site",
    title: "موقع الأمانة العامة للصحة النفسية وعلاج الإدمان",
    url: "https://mentalhealth.mohp.gov.eg",
    what: "الجهة الحكومية المسؤولة عن خدمات الصحة النفسية في مصر — الموقع فيه أدلة مستشفيات الصحة النفسية الحكومية (٢٠ مستشفى على مستوى الجمهورية) ومراكز وعيادات ومختصين (أطباء نفسيين وأخصائيين).",
  },
];

/**
 * Practical indicators for "when is professional help the right next
 * step" — understandable signals, never a diagnosis. Extends the existing
 * WHEN_TO_SEEK_HELP list with the same no-shame framing.
 */
export const SEEK_HELP_INDICATORS: string[] = [
  "صعوبة التحكم مستمرة رغم محاولاتك المتكررة — والرغبة بتكبر مش بتقِل.",
  "دراستك أو شغلك أو علاقاتك بتتأثر بشكل واضح ومستمر.",
  "ضيق نفسي صعب تتعامل معه لوحدك — إحباط، قلق، أو اكتئاب ملازم.",
  "بتلجأ للسلوك كطريقة وحيدة تقريبًا لمواجهة الضغط.",
  "أفكار لإيذاء نفسك — دي إشارة تطلب مساعدة عاجلة، مش ذنب تستحمله.",
];

/** First-session questions — practical, respectful, no assumptions. */
export const FIRST_SESSION_QUESTIONS: string[] = [
  "اشتغلت مع حالات زي حالتي قبل كده؟",
  "هيكون الشغل إيه بالظبط؟ جلسات كلام، مهارات سلوكية، ولا حاجة تانية؟",
  "الجلسة بكام، وهل في نظام دفع أو تقسيط؟",
  "هيبتدي إمتى، وإزاي بنقيس إنه شغال معايا؟",
  "خصوصيتي محفوظة إزاي — ومين يشوف اللي بقوله؟",
];
