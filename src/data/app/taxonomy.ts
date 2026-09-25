import type {
  JourneyStage,
  TriggerCategory,
  TriggerItem,
} from "@/lib/app/types";

/**
 * Taxonomy & fixed content — implements spec sections:
 * 10 (risk levels), 15 (anti-rationalization), 19 (trigger library),
 * 20 (early warning signs), 27 (minimum viable day), 33 (journey stages),
 * 14 (boredom menu), 18 (work-safe), 72 (support person templates).
 * Language rules: no shame, no diagnosis, no sensationalism.
 */

/**
 * درجة الحالة — the 1–5 behavioral ladder.
 *
 * These are SELF-REPORTED indicators used to choose an appropriate
 * intervention — not clinical measurements. Every level has a clear
 * behavioral meaning so it stays fast to understand on mobile and under
 * stress. The result copy always tells the user what to DO, not just the
 * number. Language rules: no shame, no diagnosis, no sensationalism.
 */
export const RISK_LEVELS: {
  level: number;
  label: string;
  description: string;
  examples?: string[];
}[] = [
  {
    level: 1,
    label: "هدوء",
    description: "لا توجد مشكلة ملحّة الآن — أكمل يومك الطبيعي.",
  },
  {
    level: 2,
    label: "بداية بسيطة",
    description: "رغبة بدأت تظهر — يمكن التعامل معها بسهولة بخطوة صغيرة.",
  },
  {
    level: 3,
    label: "بدأت تقوى",
    description: "الرغبة تشتد — خطوة تدخل مبكر الآن تقطعها وهي لسه صغيرة.",
    examples: ["بدأت أفكر في «كيف»", "«مرة واحدة مش هفرق»"],
  },
  {
    level: 4,
    label: "خطر مرتفع",
    description: "قربت من التصرف — تدخّل الآن، بلا تحليل.",
    examples: ["فتحت المصدر بالفعل", "«آخر مرة وأوقف»"],
  },
  {
    level: 5,
    label: "على وشك التصرف",
    description:
      "أنت عند نقطة التنفيذ نفسها، وتشعر أنك بالكاد تستطيع التوقف — أقصى تدخل مباشر الآن.",
  },
];

export const MODE_LABELS: Record<string, string> = {
  awareness: "مراقبة هادئة",
  interrupt: "قطع مبكر",
  immediate: "تدخل فوري",
  emergency: "وضع الطوارئ",
  maximum: "أزمة — تدخل أقصى",
};

/**
 * Degree → intervention mode (1–5):
 *   1–2 → awareness  (1: nothing urgent · 2: early awareness / light step)
 *   3   → interrupt  (early intervention step)
 *   4   → immediate  (the engine switches to "emergency" when the chain has
 *                     physically started — browsingStarted — see risk-engine)
 *   5   → maximum    (crisis)
 */
export const RISK_MODES: { from: number; to: number; mode: string }[] = [
  { from: 1, to: 2, mode: "awareness" },
  { from: 3, to: 3, mode: "interrupt" },
  { from: 4, to: 4, mode: "immediate" },
  { from: 5, to: 5, mode: "maximum" },
];

export const TRIGGER_CATEGORIES: TriggerCategory[] = [
  {
    id: "internal",
    label: "داخلية",
    hint: "ما ينبع من الداخل: ذكرى، فكرة، خيال، فضول.",
  },
  {
    id: "emotional",
    label: "انفعالية",
    hint: "ملل، وحدة، توتر، قلق، حزن، غضب، إحباط.",
  },
  {
    id: "digital",
    label: "رقمية/خارجية",
    hint: "صور، منصات، مواقع، بحث، تصفح بلا هدف.",
  },
  {
    id: "situational",
    label: "ظرفية",
    hint: "وقت متأخر، السرير، العزلة، مكان معين.",
  },
  {
    id: "habitual",
    label: "اعتيادية",
    hint: "عادة التقاط الهاتف بلا هدف أو «اختبار النفس».",
  },
];

export const TRIGGERS: TriggerItem[] = [
  { id: "memory", label: "ذكرى أو مشهد عالق في الذهن", category: "internal" },
  { id: "thought", label: "فكرة متكررة", category: "internal" },
  { id: "fantasy", label: "خيال بدأ يتشعب", category: "internal" },
  { id: "curiosity", label: "فضول أو رغبة في البحث", category: "internal" },
  { id: "boredom", label: "ملل", category: "emotional" },
  { id: "loneliness", label: "وحدة", category: "emotional" },
  { id: "stress", label: "توتر أو ضغط", category: "emotional" },
  { id: "anxiety", label: "قلق", category: "emotional" },
  { id: "sadness", label: "حزن أو ضيق نفسي", category: "emotional" },
  { id: "anger", label: "غضب أو إحباط", category: "emotional" },
  { id: "images", label: "التقاء بمحتوى أو صورة", category: "digital" },
  { id: "feeds", label: "تصفح المنصات/التغذية", category: "digital" },
  { id: "websites", label: "موقع أو منصة معينة", category: "digital" },
  { id: "search", label: "بدء بحث", category: "digital" },
  { id: "stories", label: "قصص أو محتوى نصي محفز", category: "digital" },
  { id: "aimless", label: "تصفح بلا هدف", category: "digital" },
  { id: "late-night", label: "وقت متأخر من الليل", category: "situational" },
  { id: "bed", label: "البقاء في السرير", category: "situational" },
  { id: "bathroom", label: "مكان معين (حمام/غرفة مغلقة)", category: "situational" },
  { id: "isolation", label: "الانعزال عن الناس", category: "situational" },
  { id: "phone-habit", label: "التقاط الهاتف آليًا", category: "habitual" },
  { id: "just-minute", label: "«دقيقة واحدة»", category: "habitual" },
  { id: "testing", label: "اختبار مقاومتك أمام المحفز", category: "habitual" },
  { id: "scrolling", label: "تمرير بلا غرض", category: "habitual" },
];

export const EARLY_WARNING_SIGNS: { id: string; label: string }[] = [
  { id: "scenes", label: "تذكّر مشاهد سابقة" },
  { id: "elaborating", label: "تطوير خيال وإضافته تفاصيل" },
  { id: "purposeless", label: "تصفح بلا هدف" },
  { id: "starting-search", label: "بدء بحث" },
  { id: "just-seeing", label: "فتح منصة «لمجرد أن ألقي نظرة»" },
  { id: "alt-material", label: "البحث عن محتوى محفز بديل" },
  { id: "self-isolating", label: "عزل نفسك عن الناس" },
  { id: "phone-in-bed", label: "الهاتف في السرير" },
  { id: "negotiating", label: "تفاوض داخلي" },
  { id: "resistance-testing", label: "اختبار مقاومتك" },
];

export const ANTI_RATIONALIZATION: {
  id: string;
  pattern: string;
  response: string;
}[] = [
  {
    id: "one-minute",
    pattern: "«سأنظر دقيقة واحدة فقط»",
    response: "المشكلة ليست في الدقيقة. السلسلة بدأت بالفعل. اقطعها الآن.",
  },
  {
    id: "in-control",
    pattern: "«أنا مسيطر على الأمر»",
    response: "لا تختبر قدرتك على المقاومة أمام المحفز. غيّر البيئة.",
  },
  {
    id: "already-slipped",
    pattern: "«حصلت زَلّة بالفعل — سأكمل إلى النهاية»",
    response: "الزَلّة الواحدة لا تستدعي تكملة. أوقف الآن — الباقي قرار مستقل.",
  },
  {
    id: "tomorrow",
    pattern: "«سأبدأ غدًا»",
    response: "البداية ليست غدًا. البداية هي الخطوة التالية الآن.",
  },
  {
    id: "cant",
    pattern: "«لا أستطيع»",
    response: "لا تحتاج إلى حل حياتك الآن. نفّذ الخطوة الحالية فقط.",
  },
  {
    id: "once-wont-hurt",
    pattern: "«مرة واحدة لن تضر»",
    response: "ما تعيشه الآن بدأ بخطوة صغيرة أيضًا. لا تفاوض على السلسلة.",
  },
  {
    id: "deserve",
    pattern: "«أستحق تنفيسًا/مكافأة»",
    response: "التوتر يحتاج حلًا حقيقيًا. هذه الحلقة تزيد الضغط بعد قليل، لا تخففه.",
  },
  {
    id: "nobody-knows",
    pattern: "«لا أحد سيعرف»",
    response: "المسألة ليست من يعرف. المسألة أن السلسلة تستنزف وقتك وطاقتك وثقتك.",
  },
];

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "stabilize",
    fromDay: 1,
    toDay: 14,
    label: "التثبيت",
    description:
      "أهم هدف الآن: تقليل السلوك ووقف السلاسل مبكرًا، وبناء أول روتين يومي بسيط.",
  },
  {
    id: "understand",
    fromDay: 15,
    toDay: 45,
    label: "الفهم",
    description:
      "تتعرف على محفزاتك وأنماطك، وتكتشف نقطة التدخل الأفضل في سلسلتك.",
  },
  {
    id: "build-skills",
    fromDay: 46,
    toDay: 90,
    label: "بناء المهارات",
    description:
      "تتقن مهارات القطع والملاحظة، وتحوّل خطتك من رد فعل إلى نظام استباقي.",
  },
  {
    id: "rebuild",
    fromDay: 91,
    toDay: 180,
    label: "إعادة بناء الحياة",
    description:
      "التوسع في الحياة نفسها: هدف، علاقات، جسد، روتين ليلي — لا مجرد الامتناع.",
  },
  {
    id: "strengthen",
    fromDay: 181,
    toDay: 365,
    label: "التعزيز",
    description:
      "تثبيت النمط الجديد، والتعامل مع أنماط قديمة قد تعاود الظهور في أوقات الضغط.",
  },
  {
    id: "maintain",
    fromDay: 366,
    toDay: 730,
    label: "الصيانة",
    description:
      "الحفاظ على المكاسب بأقل جهد، مع يقظة لأوقات الضعف (إجهاد، اضطراب نوم، تغيرات).",
  },
  {
    id: "wisdom",
    fromDay: 731,
    toDay: 100000,
    label: "المدى الطويل",
    description:
      "الخبرة تراكمت. الهدف: حياة تُدار بقيمك، واستخدام التطبيق عند الحاجة فقط.",
  },
];

export const JOURNEY_DISCLAIMER =
  "هذه مراحل تنظيمية للمحتوى والرحلة، لا جدولًا زمنيًا بيولوجيًا مضمونًا للتعافي.";

export const BOREDOM_MENU: {
  minutes: 5 | 15 | 30;
  label: string;
  options: string[];
}[] = [
  {
    minutes: 5,
    label: "٥ دقائق",
    options: ["ترتيب المكتب", "غسل الأطباق", "تجهيز مهمة الغد"],
  },
  {
    minutes: 15,
    label: "١٥ دقيقة",
    options: ["مشي", "قراءة", "دراسة موضوع صغير", "تمرين خفيف"],
  },
  {
    minutes: 30,
    label: "٣٠ دقيقة",
    options: ["تمرين رياضي", "جلسة دراسة مركزة", "العمل على مشروع", "خروج قصير", "نشاط اجتماعي"],
  },
];

export const WORK_SAFE_STEPS: string[] = [
  "أغلق كل التبويبات والتطبيقات غير المتصلة بمهمتك.",
  "أبقِ فقط مهمة العمل/الدراسة المطلوبة على الشاشة.",
  "جهاز واحد لغرض واحد متعمد — لا تعدد مهام.",
  "تجنب أي تصفح خارج المهمة مهما كان «سريعًا».",
  "إن أمكن: غيّر مكان جلوسك الفعلي.",
  "ضع الجهاز على سطح ثابت بدل حملك له باستمرار.",
  "اعمل ١٠ دقائق كاملة الآن.",
  "أعد التقييم بعدها: هل انخفض الخطر؟",
];

export const DIGITAL_PROTECTION_GUIDES: {
  id: string;
  title: string;
  what: string;
  how: string[];
  limits: string;
}[] = [
  {
    id: "blockers",
    title: "حاجبات المواقع",
    what: "إضافات أو تطبيقات تمنع فتح مواقع محددة أو فئاتها.",
    how: [
      "اختر إضافة موثوقة لمتصفحك (مثل Cold Turkey أو BlockSite أو LeanBrowser).",
      "أضف المواقع التي تعرف أنها تبدأ بها السلسلة عادة.",
      "فعّل وضعًا يمنع التعطيل السهل أثناء لحظة الضعف.",
    ],
    limits: "يمكن تجاوزها بالإضافة أو المتصفح الآخر — أداة مساعدة لا حل كامل.",
  },
  {
    id: "profiles",
    title: "ملف متصفح منفصل للعمل",
    what: "ملف/مستخدم مختلف في المتصفح: للعمل فقط، دون إضافاتك الشخصية وسجلّك.",
    how: [
      "أنشئ ملفًا جديدًا باسم «عمل».",
      "لا تسجل دخول أي حسابات ترفيهية فيه.",
      "اجعله الملف الافتراضي أثناء الدوام/الدراسة.",
    ],
    limits: "يتطلب انضباطًا في العودة إليه عند الملل — ادعمه بقاعدة «إذا… إذن».",
  },
  {
    id: "dns",
    title: "تصفية DNS",
    what: "تصفية على مستوى الشبكة/الجهاز تمنع فئات المواقع قبل أن تُحمَّل.",
    how: [
      "استخدم خدمة تصفية عائلية على راوتر المنزل إن كان متاحًا.",
      "أو اضبط DNS تصفية على جهازك (مثل خدمات التصفية المعروفة).",
      "اجعل إعداد كلمة المرور بيد شخص تثق به إن أمكن.",
    ],
    limits: "قد تُبطئ بعض المواقع أو تُعطّل محتوى سليمًا، وتُتجاوز بشبكة بديلة.",
  },
  {
    id: "safesearch",
    title: "البحث الآمن (SafeSearch)",
    what: "خيار في محركات البحث يفلتر النتائج الصريحة.",
    how: [
      "فعّله من إعدادات محرك البحث الذي تستخدمه.",
      "أفعله على كل متصفحاتك وأجهزتك.",
      "قفله عبر حساب الإدارة إن توفر.",
    ],
    limits: "غير مضمون 100% — طبقة أولى فقط.",
  },
  {
    id: "focus",
    title: "أوضاع التركيز وقيود التطبيقات",
    what: "أدوات نظام في الهاتف/الكمبيوتر تحدّد الاستخدام والتطبيقات المسموحة.",
    how: [
      "استخدم وضع التركيز/العمل في نظام جهازك.",
      "حدد فترات مسموح فيها بالتطبيقات الترفيهية فقط.",
      "أزل إشعارات التطبيقات غير الضرورية كليًا.",
    ],
    limits: "إشعارات محدودة تُدار من النظام نفسه وتحتاج تحديثًا دوريًا.",
  },
  {
    id: "night",
    title: "بروتوكول الوقت المتأخر",
    what: "لا سلسلة تقريبًا تبدأ دون وقت متأخر + وحدة + جهاز. صمّم ضد هذا الثلاثي.",
    how: [
      "الهاتف خارج غرفة النوم منذ ٣٠-٦٠ دقيقة قبل النوم.",
      "منبّه منفصل لا هاتف.",
      "قاعدة بيتية: السرير للنوم فقط.",
    ],
    limits: "أقوى أداة لديك لوقت الليل، لكنها تحتاج تجهيزًا قبل وقت الضعف لا أثناءه.",
  },
];

export const DIGITAL_PROTECTION_HONESTY =
  "بصراحة: صفحة ويب عادية لا تستطيع حجب كل موقع أو تطبيق على مستوى جهازك كله. هذه أدوات وقاية تُجهّز مسبقًا وتُدار من نظامك — لا تُضبط أثناء أزمة، ولا نعدك بحماية كاملة.";

export const SUPPORT_MESSAGE_TEMPLATES: string[] = [
  "محتاج أقعد معاك شوية، عندك وقت؟",
  "يومي تقيل شوية — نتمشى سوا؟",
  "أحتاج أشغلك معي في شي ١٠ دقائق، تساعدني؟",
  "متوفر دلوقتي؟ أبي أفرّغ كلام كتير.",
];

export const WORK_SAFE_PRINCIPLE =
  "لا تحارب التقنية. هندِس السياق المحيط بها.";

export const VULNERABILITY_FACTORS: { id: string; label: string }[] = [
  { id: "sleep", label: "قلة نوم" },
  { id: "stress", label: "توتر/ضغط" },
  { id: "loneliness", label: "وحدة" },
  { id: "late-night", label: "سهر متأخر" },
  { id: "unstructured", label: "وقت غير منظم" },
  { id: "device", label: "استخدام مكثف للجهاز" },
  { id: "fatigue", label: "إرهاق جسدي" },
  { id: "conflict", label: "خلاف أو ضيق من شخص" },
];

export const PERSONAL_WHY_REASONS: { id: string; label: string }[] = [
  { id: "time", label: "وقتي" },
  { id: "study", label: "دراستي" },
  { id: "career", label: "مستقبلي المهني" },
  { id: "relationships", label: "علاقاتي" },
  { id: "values", label: "قيمي" },
  { id: "spirituality", label: "روحانيتي" },
  { id: "focus", label: "تركيزي" },
  { id: "discipline", label: "انضباطي" },
  { id: "self-respect", label: "احترامي لنفسي" },
  { id: "health", label: "صحتي" },
];

export const SPIRITUAL_PRACTICES: {
  id: string;
  title: string;
  body: string;
  steps?: string[];
}[] = [
  {
    id: "wudu-prayer",
    title: "وضوء + ركعتان",
    body: "الحركة الجسدية للوضوء بالماء تغيّر حالتك، والصلاة تعيد ترتيب أولويات اللحظة.",
    steps: [
      "توضأ بماء بارد على الوجه واليدين.",
      "صلِّ ركعتين بنية الهدوء والعودة.",
      "بعد السلام: خذ نفسًا عميقًا ثم عد لنشاطك.",
    ],
  },
  {
    id: "dhikr",
    title: "ذكر قصير متكرر",
    body: "تكرار هادئ (مثل التسبيح أو الاستغفار) يعمل كمرساة انتباه تُخفض التسارع الذهني.",
    steps: [
      "اختر صيغة واحدة قصيرة.",
      "كررها ببطء مع التنفس ٢-٣ دقائق.",
      "لا تطارد أفكارًا مقاطعة — عد إلى الصيغة.",
    ],
  },
  {
    id: "quran",
    title: "قراءة قرآن ١٠ دقائق",
    body: "قراءة بتدبر — ولو صفحة واحدة — تبعد الانتباه عن المحفز وتعيد الاتساق الداخلي.",
    steps: [
      "افتح على صفحة قصيرة.",
      "اقرأ بصوت مسموع وبطيء.",
      "اختم بدعاء قصير يعنيك.",
    ],
  },
  {
    id: "tawbah",
    title: "التوبة والعودة — بلا يأس",
    body: "في التصور الإسلامي: باب التوبة مفتوح دائمًا، والعودة تكون بالهمة، لا بالانكسار. لا تقنط من رحمة الله مهما تكررت الزَلّة — القنوط نفسه يطيل السلسلة.",
    steps: [
      "أوقف السلوك أولًا (هذه بداية التوبة).",
      "استغفر دون جلد للذات.",
      "اتخذ خطوة عملية تمنع التكرار (قاعدة «إذا… إذن»).",
    ],
  },
  {
    id: "reflection",
    title: "تأمل ومراجعة قيم",
    body: "جلسة هدوء قصيرة تسأل فيها نفسك: ما القيمة التي أريد أن يحترمها هذا اليوم؟",
    steps: [
      "اجلس ٥ دقائق بلا شاشة.",
      "اسأل: ما الذي أريد أن أكونه اليوم؟",
      "اكتب جملة واحدة.",
    ],
  },
];

export const SPIRITUAL_DISCLAIMER =
  "هذا القسم روحي/قيمي اختياري بالكامل، ويظهر فقط لمن فعّله. وهو منفصل عن المحتوى العلمي في التطبيق — الممارسات الروحية ليست علاجًا طبيًا ولا ادعاءً علميًا.";

export const WHEN_TO_SEEK_HELP: string[] = [
  "تشعر أن السلوك يتصاعد رغم محاولاتك المتكررة.",
  "تتأثر دراستك/عملك أو علاقاتك بشكل واضح ومستمر.",
  "تشعر بانسحاب من الحياة أو اكتئاب يلازمك.",
  "تلجأ للسلوك كأسلوب وحيد تقريبًا لمواجهة الضغط.",
  "ظهرت أفكار لإيذاء نفسك — اطلب مساعدة فورًا.",
];
