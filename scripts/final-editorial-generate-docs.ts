// Final Native Arabic Editorial Pass — deliverables generator (runs with bun).
// Emits:
//   download/phase3-knowledge-148-native-arabic-final.md        (all 148, full fields)
//   download/phase3-knowledge-native-final-editorial-map.md     (per-card before/after + reasons)
//   download/phase3-knowledge-native-final-qa.md                (QA report)
// "Before" snapshot: scripts/final-editorial-pre/ (state right before this pass).
import { KNOWLEDGE, KNOWLEDGE_CATEGORIES, CATEGORY_LABELS } from "../src/data/app/knowledge";
import { KNOWLEDGE_NEW } from "../src/data/app/knowledge-new";
import { writeFileSync, readFileSync, mkdirSync } from "fs";

function loadSnap(path: string, exportName: string): any[] {
  let src = readFileSync(path, "utf-8");
  src = src.replace(
    /import type \{ KnowledgeItem \} from "@\/lib\/app\/types";/,
    'import type { KnowledgeItem } from "../../src/lib/app/types";'
  );
  const tmp = path.replace(".ts", ".snap-final-editorial.ts");
  writeFileSync(tmp, src);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require(tmp);
  return mod[exportName];
}

const PRE = new Map<string, any>();
for (const k of [
  ...loadSnap("/home/z/my-project/scripts/final-editorial-pre/knowledge-core.ts", "KNOWLEDGE_CORE"),
  ...loadSnap("/home/z/my-project/scripts/final-editorial-pre/knowledge-wellbeing.ts", "KNOWLEDGE_WELLBEING"),
  ...loadSnap("/home/z/my-project/scripts/final-editorial-pre/knowledge-recovery.ts", "KNOWLEDGE_RECOVERY"),
  ...loadSnap("/home/z/my-project/scripts/final-editorial-pre/knowledge-new.ts", "KNOWLEDGE_NEW"),
]) PRE.set(k.id, k);

const NEW50_IDS = new Set(KNOWLEDGE_NEW.map((n) => n.id));
const OLD98 = KNOWLEDGE.filter((k) => !NEW50_IDS.has(k.id));

// ——— curated per-edit records from this pass (card_id → [{field, type, reason}]) ———
const EDIT_RECORDS: Record<string, { type: string; reason: string }[]> = {
  // knowledge-core (14 cards)
  "bb-dopamine": [{ type: "translation feel", reason: "«أكثر منه في المتعة ذاتها» أثر ترجمة (more than in pleasure itself)" }],
  "bb-sensitization": [{ type: "translation feel", reason: "«تُطعَم» ترجمة حرفية لـ fed — استبدلت بـ «تستجيب لها»" }],
  "bb-variable-reward": [{ type: "AI-ish phrasing", reason: "«فلا تجعله سيد أمسياتك» صياغة متكلفة" }],
  "bb-wanting-liking": [{ type: "AI-ish phrasing", reason: "«عادة بلا مقابل تُدار ولا تُعاش» مقابلة غامضة" }],
  "tr-combo": [
    { type: "metaphor", reason: "«يفتح النافذة الخطرة / تُغلَق النافذة» استعارة غير لازمة هنا" },
    { type: "awkward Arabic", reason: "«تفكيك الاجتماع نفسه» تركيب غير مألوف" },
  ],
  "tr-early-detection": [
    { type: "translation feel", reason: "«لأن الانسحاب يغلو ثمنه مع كل حلقة» — مثال مؤكد من المستخدم" },
    { type: "metaphor", reason: "«أشبه بتسلق جدار» استعارة ميتة" },
    { type: "awkward Arabic", reason: "«الفارق بين الحالتين اسمه…» ترجمة (is called)" },
    { type: "translation feel", reason: "«أول علامة هي أرخص فرصة للقطع» — مثال مؤكد" },
    { type: "title awkwardness", reason: "«أرخص بكثير» → «أسهل بكثير» في العنوان والنص" },
  ],
  "tr-curiosity": [
    { type: "translation feel", reason: "«يقدّم الفضول نفسه بحُسن نية» تركيب مترجم" },
    { type: "grammar", reason: "«بين أن تشعر وأن تتبع» → إكمال التوزيع بـ «وبين»" },
  ],
  "tr-log-patterns": [
    { type: "translation feel", reason: "«تستطيع هندستها» غير مألوفة → «يمكنك البناء عليها»" },
    { type: "AI-ish phrasing", reason: "«قابل للهندسة؛ قابل للندم» مقابلة مصطنعة" },
  ],
  "ur-wave": [{ type: "translation feel", reason: "«ما دامت لم تُطعَم» مصطلح مترجم" }],
  "hl-loop": [
    { type: "title awkwardness", reason: "«إشارة، فروتين، فمكافأة» — مثال مؤكد من المستخدم" },
    { type: "translation feel", reason: "«أرخص نقطة للكسر وأغلاها» استعارة سعر مترجمة" },
  ],
  "hl-implementation": [{ type: "title awkwardness", reason: "«أدلة قوية وتكلفة صفر» ترجمة حرفية zero cost" }],
  "hl-substitute": [{ type: "awkward Arabic", reason: "«تحقق مكافأة قريبة منها» مضغوطة غير سليمة" }],
  "en-people": [
    { type: "title awkwardness", reason: "«الناس في مدى البصر» — مثال مؤكد من المستخدم" },
    { type: "translation feel", reason: "«في مدى بصرك يغيّر معادلة السلوك» ترجمتان متجاورتان" },
    { type: "awkward Arabic", reason: "«تغيير فيزيائي مباشر في بيئة التنفيذ» ثقيل" },
  ],
  "en-leaving": [{ type: "translation feel", reason: "«أرخص تدخل تملكه» أثر ترجمة" }],
  // knowledge-wellbeing (6 cards)
  "st-escape": [{ type: "grammar", reason: "«ليست كثير من السلاسل عن الرغبة» بنية مقلوبة" }],
  "st-window": [{ type: "grammar", reason: "«فتصير أمورًا صغيرة تفجّرك» إعراب ملتبس" }],
  "em-temporary": [{ type: "awkward Arabic", reason: "«مرّ الشعور، وبقِ القرار» صيغة أمر تلتبس بالمعنى العكسي" }],
  "di-decisions": [{ type: "translation feel", reason: "«تصويت يومي» ترجمة (daily vote)" }],
  "re-one-person": [{ type: "title awkwardness", reason: "«يكفي لتغيير المعادلة» تركيب مترجم (changes the equation)" }],
  "dg-infinite": [{ type: "awkward Arabic", reason: "«اللعبة ليست على مستواك» ملتبسة المعنى" }],
  // knowledge-recovery (11 cards)
  "sc-self-criticism": [{ type: "punctuation", reason: "سلسلة «خطأ، فقسوة، فضيق، فهروب» ترقيم متكلف" }],
  "pr-full-life": [
    { type: "metaphor", reason: "منظومة «أرخص مصدر / سعر السلوك / الرصيد الأغلى» استعارة سوق مترجمة" },
    { type: "AI-ish phrasing", reason: "«لا تحارب الظلام — أشعل مصباحًا» حكمة جاهزة شعارية" },
  ],
  "pr-named-project": [
    { type: "punctuation", reason: "سلسلة «فراغ، فجهاز، فسلسلة»" },
    { type: "awkward Arabic", reason: "«الفراغ ينزلق» فاعل ملتبس" },
  ],
  "va-write": [{ type: "metaphor", reason: "«نيّة بلا سلاح» تركيب غريب" }],
  "va-dissonance": [{ type: "metaphor", reason: "«يطفئ الوقود بالضيق» مختلط + «للهندسة» غير طبيعي" }],
  "sp-prayer-interrupt": [{ type: "translation feel", reason: "«الزخم» ترجمة momentum → «الاندفاع»" }],
  "sp-dhikr-anchor": [
    { type: "translation feel", reason: "«مرساة انتباه» ترجمة anchor" },
    { type: "awkward Arabic", reason: "منطق معكوس: الخيال يحتاج قناة فارغة لا مشغولة" },
  ],
  "pv-precommitment": [{ type: "title awkwardness", reason: "«أغلق على نفسي المستقبلي» — مثال مؤكد من المستخدم" }],
  "pv-friction": [{ type: "title awkwardness", reason: "«احتكاك استراتيجي» لغة إدارية مترجمة" }],
  "es-one-step": [{ type: "translation feel", reason: "«يعالج الدماغ خيارات» ترجمة processes" }],
  "es-first-minute": [{ type: "translation feel", reason: "«التفاوض الافتتاحي» كلام تجاري مترجم" }],
  // knowledge-new (22 cards)
  "dg-phone-first-decision": [{ type: "translation feel", reason: "«دخلت اليوم متأخرًا عنه» ترجمة start the day behind" }],
  "at-transition-home": [
    { type: "punctuation", reason: "سلسلة «استلقاء، فالهاتف، فتصفح، فسهرة»" },
    { type: "awkward Arabic", reason: "«أغلق عليها» غير مفهومة في سياقها" },
  ],
  "at-waiting-gaps": [{ type: "metaphor", reason: "«ميدان تدريب مجاني» استعارة غير لازمة" }],
  "at-post-completion": [{ type: "awkward Arabic", reason: "«عقب الإنجاز أضعف لحظات الحراسة — فاحرسها» متكلفة" }],
  "di-open-days": [{ type: "awkward Arabic", reason: "«تومئ إلى الحرية» غير مألوفة → «توحي»" }],
  "lt-travel": [{ type: "translation feel", reason: "«مدى وصولك إلى الجهاز» ترجمة your access" }],
  "di-routine-rebuild": [{ type: "awkward Arabic", reason: "«بخطة مثالية الاثنين» ملتبسة بالمثنى" }],
  "at-boredom-tolerance": [{ type: "grammar", reason: "«يجد نفسه أوسع» تركيب غير سليم" }],
  "dg-rest-no-phone": [{ type: "grammar", reason: "«أتعب مما جلست» ناقصة" }],
  "st-after-hard-day": [{ type: "awkward Arabic", reason: "«القرار المأخوذ منك والإرهاق، ليس قرارك» — مثال مؤكد" }],
  "em-anger": [
    { type: "title awkwardness", reason: "«أكثر المشاعر سرعة في طلب مخرج» — مثال مؤكد" },
    { type: "translation feel", reason: "«حالة محمومة» + «يقدّم نفسه كمخرج» ترجمات" },
  ],
  "em-social-anxiety": [{ type: "metaphor", reason: "«تسمم المدى» تركيب غير مألوف" }],
  "dg-content-from-others": [{ type: "translation feel", reason: "«التعرض الوارد» ترجمة incoming exposure" }],
  "dg-chat-groups": [{ type: "awkward Arabic", reason: "«لا يسأله أحد عن حدك» تركيب مقلوب" }],
  "dg-algorithms": [{ type: "translation feel", reason: "«بيئة موصى بها» ترجمة recommendation environment" }],
  "en-click-chain": [
    { type: "translation feel", reason: "«زخمًا متصلًا» + «أرخص/يغلو الثمن» — مثال مؤكد وأخواته" },
    { type: "metaphor", reason: "«النقرة الأولى هي الميدان» استعارة غير لازمة" },
    { type: "awkward Arabic", reason: "«اقطع أول نقرة، تكن آخر السلسلة لم تبدأ» — مثال مؤكد" },
    { type: "punctuation", reason: "سلسلة «فتح، فبحث، فتبويب، فصورة»" },
  ],
  "tr-no-testing-decision": [{ type: "grammar", reason: "«ضدها» خطأ مرجعي — المقصود «ضدك»" }],
  "ur-intensity-proximity": [
    { type: "AI-ish phrasing", reason: "«الشدة تصرخ؛ والقرب ينفذ» — مثال مؤكد من المستخدم" },
    { type: "translation feel", reason: "«خفّف القرب بالفيزياء» ترجمة physically" },
  ],
  "ur-urge-return": [{ type: "AI-ish phrasing", reason: "«الموجة العابرة خبر، لا نهاية عالم» — مثال مؤكد" }],
  "at-deep-work": [{ type: "grammar", reason: "«كل واحدة تدفع ثمنها الجلسة كاملة» ترتيب ملتبس" }],
  "pr-hobby": [
    { type: "title awkwardness", reason: "«أعمق من مجرد منع نفسك» تشابك" },
    { type: "awkward Arabic", reason: "«لا مجرد رغبته فيك» نهاية ملتبسة" },
  ],
  "pv-repeat-pattern": [{ type: "translation feel", reason: "«هندسة أبعد» + «أخرج الجهاز من المعادلة» ترجمات" }],
};

const FIELDS = ["title", "know", "understand", "act", "remember", "deep"] as const;
const FIELD_LABELS: Record<string, string> = {
  title: "العنوان",
  know: "اعرف",
  understand: "افهم",
  act: "افعل",
  remember: "تذكّر",
  deep: "قراءة أعمق",
};

function cardDiff(id: string): { field: string; before: string; after: string }[] {
  const pre = PRE.get(id);
  const cur = KNOWLEDGE.find((k) => k.id === id)!;
  if (!pre) return [];
  const out: { field: string; before: string; after: string }[] = [];
  for (const f of FIELDS) {
    const b = (pre as any)[f] as string | undefined;
    const a = (cur as any)[f] as string | undefined;
    if (b !== a) out.push({ field: f, before: b ?? "—", after: a ?? "—" });
  }
  return out;
}

// ————— 1) phase3-knowledge-148-native-arabic-final.md —————
function renderCard(k: any): string {
  const origin = NEW50_IDS.has(k.id) ? "بطاقة جديدة (من الـ50 المضافة في Phase 3B)" : "بطاقة أصلية (من الـ98 المؤلفة بالعربية)";
  const lines = [
    `### ${k.title}`,
    "",
    `- **ID:** \`${k.id}\``,
    `- **التصنيف:** ${CATEGORY_LABELS[k.category] ?? k.category} (\`${k.category}\`)`,
    `- **المرحلة:** ${k.stage}`,
    `- **الوسوم:** ${k.tags.length ? k.tags.map((t: string) => `\`${t}\``).join(", ") : "—"}`,
    k.spiritual ? "- **البوابة الروحية:** مفعّلة (تظهر عند تفعيل المحتوى الروحي فقط)" : null,
    `- **الأصل:** ${origin}`,
    "",
    `**اعرف:** ${k.know}`,
    "",
    `**افهم:** ${k.understand}`,
    "",
    `**افعل:** ${k.act}`,
    "",
    `**تذكّر:** ${k.remember}`,
    "",
  ].filter((x) => x !== null);
  if (k.deep) {
    lines.push(`**قراءة أعمق:** ${k.deep}`, "");
  }
  return lines.join("\n");
}

const byCat = new Map<string, any[]>();
for (const k of KNOWLEDGE) {
  if (!byCat.has(k.category)) byCat.set(k.category, []);
  byCat.get(k.category)!.push(k);
}

const finalDoc = [
  "# قاعدة المعرفة النهائية — 148 بطاقة",
  "",
  "## الجولة التحريرية العربية النهائية (Final Native Arabic Editorial Pass)",
  "",
  "هذه النسخة النهائية لقاعدة المعرفة بعد آخر جولة تحرير لغوي عربي. كل بطاقة في هذا الملف",
  "مرّت على اختبار الطبيعية العربية: هل تبدو وكأن كاتبًا عربيًا كتبها من البداية؟ الجولة عدّلت",
  "ما كان يحمل أثر ترجمة أو تكلفًا أو شعارية، وأبقت ما كان سليمًا كما هو — بأقل تعديل ممكن.",
  "",
  "- **إجمالي البطاقات:** 148 (98 أصلية + 50 جديدة)",
  "- **عدّل في هذه الجولة:** 53 بطاقة",
  "- **لم تحتج تعديلًا:** 95 بطاقة",
  "- **لم يتغير:** المعرفات، التصنيفات، الوسوم، المراحل، البوابات الروحية، المخطط، الأرقام والمدد، درجة اليقين العلمي، التوصيات السلوكية.",
  "",
  "—",
  "",
];
for (const cat of KNOWLEDGE_CATEGORIES) {
  const cards = byCat.get(cat.id) ?? [];
  finalDoc.push(`## ${cat.label} (${cards.length} بطاقة)`, "");
  for (const k of cards) finalDoc.push(renderCard(k));
}
mkdirSync("/home/z/my-project/download", { recursive: true });
writeFileSync("/home/z/my-project/download/phase3-knowledge-148-native-arabic-final.md", finalDoc.join("\n"));

// ————— 2) phase3-knowledge-native-final-editorial-map.md —————
const mapDoc: string[] = [
  "# خريطة الجولة التحريرية العربية النهائية",
  "",
  "توثيق كامل لكل تغيير في الجولة النهائية: البطاقات المعدّلة (قبل → بعد) مع نوع المشكلة وسبب التغيير،",
  "وقائمة البطاقات التي لم تحتج تعديلًا. «قبل» = الحالة قبل هذه الجولة مباشرة،",
  "«بعد» = النسخة النهائية الحالية في الكود.",
  "",
  "أنواع المشاكل: grammar / awkward Arabic / translation feel / AI-ish phrasing / title awkwardness / punctuation / metaphor.",
  "",
];

let changed = 0;
let unchanged: string[] = [];
const changedRows: { id: string; cat: string; types: string[] }[] = [];

for (const k of KNOWLEDGE) {
  const diffs = cardDiff(k.id);
  if (diffs.length > 0) {
    changed++;
    const recs = EDIT_RECORDS[k.id] ?? [{ type: "editorial", reason: "تحسين لغوي" }];
    const types = [...new Set(recs.map((r) => r.type))];
    changedRows.push({ id: k.id, cat: k.category, types });
    mapDoc.push(`## ${k.id}`, "");
    mapDoc.push(`- **البطاقة:** ${k.title}`);
    mapDoc.push(`- **التصنيف:** ${CATEGORY_LABELS[k.category] ?? k.category} — **نوع المشكلة:** ${types.join(" + ")}`);
    mapDoc.push(`- **عدد الحقول المتغيرة:** ${diffs.length}`);
    mapDoc.push("");
    for (const d of diffs) {
      mapDoc.push(`### ${FIELD_LABELS[d.field]}`);
      mapDoc.push("");
      mapDoc.push(`- قبل: «${d.before}»`);
      mapDoc.push(`- بعد: «${d.after}»`);
      mapDoc.push("");
    }
    mapDoc.push("**سبب التغيير:**");
    for (const r of recs) mapDoc.push(`- (${r.type}) ${r.reason}`);
    mapDoc.push("");
    mapDoc.push("—", "");
  } else {
    unchanged.push(k.id);
  }
}

mapDoc.unshift(
  `# خريطة الجولة التحريرية العربية النهائية`,
  "",
  `**الملخص:** ${changed} بطاقة عُدّلت، ${unchanged.length} بطاقة لم تحتج تعديلًا (الإجمالي ${KNOWLEDGE.length}).`,
  "",
  "## جدول البطاقات المعدّلة",
  "",
  "| ID | التصنيف | نوع المشكلة |",
  "| --- | --- | --- |",
  ...changedRows.map(
    (r) => `| \`${r.id}\` | ${CATEGORY_LABELS[r.cat] ?? r.cat} | ${r.types.join(" + ")} |`
  ),
  "",
  "## تفصيل قبل → بعد",
  ""
);

mapDoc.push("## البطاقات التي لم تحتج تعديلًا (" + unchanged.length + ")", "");
mapDoc.push("قرأت كل بطاقة منها كاملة واختبرت عربيتها؛ كانت سليمة الطبيعية فتركت كما هي بلا تعديل:", "");
for (let i = 0; i < unchanged.length; i += 8) {
  mapDoc.push(unchanged.slice(i, i + 8).map((id) => `\`${id}\``).join(" · "));
}
mapDoc.push("");
writeFileSync("/home/z/my-project/download/phase3-knowledge-native-final-editorial-map.md", mapDoc.join("\n"));

// ————— verify counts —————
const expectedChanged = Object.keys(EDIT_RECORDS).length;
console.log(`148-final doc: ${KNOWLEDGE.length} cards (${OLD98.length} original + ${KNOWLEDGE_NEW.length} new)`);
console.log(`editorial map: ${changed} changed (expected records: ${expectedChanged}), ${unchanged.length} unchanged`);
if (changed !== expectedChanged) {
  const diffIds = new Set(Object.keys(EDIT_RECORDS));
  for (const r of changedRows) diffIds.delete(r.id);
  console.log("MISMATCH — records without diffs:", [...diffIds]);
  const extra = changedRows.map((r) => r.id).filter((id) => !EDIT_RECORDS[id]);
  console.log("MISMATCH — diffs without records:", extra);
}
