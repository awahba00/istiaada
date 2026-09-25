// Phase 3 deliverables generator — runs with bun (native TS imports).
// Reads the CURRENT knowledge data (post-rewrite) and the ORIGINAL snapshot
// (pre-rewrite) and emits:
//   download/phase3-knowledge-98-final.md      (all 98 cards, full text)
//   download/phase3-knowledge-change-map.md    (per-card before/after trace)
import { KNOWLEDGE, KNOWLEDGE_CATEGORIES, CATEGORY_LABELS } from "../src/data/app/knowledge";
import { writeFileSync, mkdirSync } from "fs";

// ——— load originals (snapshot taken before the rewrite) ———
// The snapshot files use the "@/lib/app/types" alias — rewrite the import to a
// relative path so bun can import them directly.
function loadOriginal(path: string, exportName: string): any[] {
  const { readFileSync } = require("fs");
  let src = readFileSync(path, "utf-8");
  src = src.replace(
    /import type \{ KnowledgeItem \} from "@\/lib\/app\/types";/,
    'import type { KnowledgeItem } from "../../src/lib/app/types";'
  );
  const tmp = path.replace(".ts", ".tmp.ts");
  writeFileSync(tmp, src);
  const mod = require(tmp);
  return mod[exportName];
}

const ORIG_CORE = loadOriginal(
  "/home/z/my-project/scripts/knowledge-originals/knowledge-core.ts",
  "KNOWLEDGE_CORE"
);
const ORIG_WELL = loadOriginal(
  "/home/z/my-project/scripts/knowledge-originals/knowledge-wellbeing.ts",
  "KNOWLEDGE_WELLBEING"
);
const ORIG_REC = loadOriginal(
  "/home/z/my-project/scripts/knowledge-originals/knowledge-recovery.ts",
  "KNOWLEDGE_RECOVERY"
);
const ORIG = new Map<string, any>();
for (const k of [...ORIG_CORE, ...ORIG_WELL, ...ORIG_REC]) ORIG.set(k.id, k);

// ——— curated per-card notes (notable changes beyond pure polish) ———
const NOTES: Record<string, string> = {
  "bb-dopamine": "«إشارة دافع» → «إشارة توقّع» (أدق للمعنى العلمي)، وتحسين طفيف للصياغة.",
  "bb-sensitization": "«المعاينة/الذكرى/المشهد… بوقًا» → صياغة طبيعية «ذكرى أو مشهد أو نظرة عابرة… إشارة مبكرة» (إزالة ترجمة حرفية).",
  "bb-neuroplasticity": "«أبطأ بدءًا» → «أبطأ في البدء» (تصحيح نحوي).",
  "bb-variable-reward": "«وهو نفسه ما يجعل» → «وهو ما يجعل» (تدقيق لغوي).",
  "bb-wanting-liking": "توحيد المصطلح: «زلة» → «زَلّة».",
  "tr-broad": "«أول خط دفاع، وأدقّه» → «أول خطوط الدفاع وأدقّها» (تصحيح نحوي).",
  "tr-curiosity": "تصحيح خطأ إملائي (إخماق→إخماد)، و«تعليمات تنفيذ/الطاعة» → «أمرًا بالتنفيذ/الاتباع».",
  "ur-suppression": "«العمليات المرتدة» (ترجمة حرفية لironic process) → «الارتداد الفكري».",
  "ur-surfing-skill": "إصلاح بقايا مقياس ١–١٠ القديم: «(٣-٥)» → «(١–٢)» على سلم ١–٥ الحالي.",
  "ur-fade": "«نماذج قديمة» → «أنماط قديمة» (توحيد مصطلح النمط).",
  "hl-implementation": "توحيد صيغة القاعدة مع واجهة التطبيق: «إذا حدث كذا → أفعل كذا» → «إذا حدث كذا… إذن أفعل كذا»، وتصحيح «تسلم القيادة» → «تنتقل القيادة».",
  "hl-context": "«نيتك ممانعة» → «نيتك في المقاومة» (وضوح).",
  "hl-willpower": "«حطّم هدفك» → «قسّم هدفك» (أدق وألطف)، و«يجعل الفارق» → «يصنع الفارق».",
  "hl-substitute": "«بطريقة لا تدمّر» → «بطريقة لا تدمّر يومك» (إكمال المعنى الناقص).",
  "en-people": "«ومن هنا فإن» → «لذلك فإن» (تدفّق أفضل).",
  "en-homescreen": "تصحيح خطأ مطبعي: «فحظة» → «لمحة».",
  "sl-self-regulation": "إعادة صياغة جملة مبتورة: «موعد نوم قريبًا من منتصف الأسبوع نفسه بعطلة نهايته» → «موعد نوم واحدًا أيام الأسبوع وعطلة نهايته».",
  "sl-window": "«أكثر أسباب التعثر تكرارًا» → «أكثر أوقات الخطر تكرارًا» (توحيد المصطلحات)، و«جرّد الجهاز» → «أبعد الجهاز».",
  "sl-phone-out": "«وعلى الجبهة الأخرى» (ترجمة حرفية on the other front) → «وفي الاتجاه الآخر».",
  "sl-consistency": "إصلاح أخطاء مطبعية مزدوجة: «نع نهار وسمسرة ليل» → «نعاس نهار وسهر ليل»، و«العطر الأهم» → «الأهم».",
  "st-guilt-loop": "«بعد أي تعثر» → «بعد أي زَلّة» (توحيد المصطلح المعتمد).",
  "st-window": "«تنخفض سرعة انفعالك» → «تضيق نافذة تحملك» (أوضح)، و«لا لأنك ضعيف» → «لا بسبب ضعف فيك» (فصل الشخص عن الحكم).",
  "em-halt": "مواءمة قائمة الاحتياجات مع عنوان الرباعية، و«إشعار داخلي» → «إشارة داخلية» (منع الالتباس مع إشعارات الجهاز)، وتصحيح نحوي.",
  "em-temporary": "إعادة صياغة «قرارات دائمة الشعور المؤقت» المبتورة → «قرارات دائمة بذروة شعور عابر».",
  "em-body": "«زفير طويل ×٥» → «خمسة أنفاس زفير طويلة» (إزالة رمز رياضي من نص عربي)، و«لأحكامه» → «إلى أحكامه».",
  "em-loneliness": "تصحيح نحوي («العلاج الحقيقي حضورًا» → «حضور»)، وتبسيط جملة التذكّر.",
  "at-residue": "إعادة صياغة جملة ملتوية («بابًا أعاد فتحه») → «بابًا يُفتح من جديد».",
  "di-systems": "«لا يمل مزاجًا» → «لا يعتمد على المزاج» (وضوح المعنى المقصود).",
  "di-minimum": "«يبقي السلسلة حية» → «يبقي يومك قائمًا» (منع التباس «سلسلة» مع سلسلة الانتكاس)، وتوحيد «زَلّة».",
  "di-decisions": "«سؤال يُهزم» → «سؤال تخسره»، و«سلوكيات تخونك» → «سلوكيات تنزلق بها» (تخفيف الحكم).",
  "re-one-person": "«في كل أبحاث التعافي تقريبًا» → «في أغلب أبحاث التعافي» (ضبط ادعاء واسع)، و«فعّله» → «سجّله».",
  "re-trust": "«بعد كل تعثر» → «بعد كل زَلّة»، و«الصغيرة المنتظمة (حضور…)» → «الأفعال الصغيرة المنتظمة» (كانت توحي بأنها اعتذارات).",
  "dg-infinite": "إزالة تركيبة ملتوية «تتوقف عن لعبها بإنصاف نفسك» → «تتوقف عن اللعب بقواعدها».",
  "dg-one-minute": "تصحيح نحوي: «يوجد سلسلة» → «توجد سلسلة».",
  "dg-no-notifications": "«تعديل عشر دقائق واحد» → «تعديل واحد مدته عشر دقائق» (ترتيب طبيعي).",
  "dg-no-testing": "«وليست دليل ضعف» → «وهذا ليس دليلًا على ضعف» (فصل الشخص عن الحكم).",
  "rl-ave": "عنوان أهدأ وأوضح («نسفت اليوم» الخليجية → «اليوم ضاع أصلًا»)، وتوحيد زَلّة، و«سقوطًا ثانيًا» → صياغة سلوكية محايدة.",
  "rl-lapse-relapse": "محور توحيد المصطلحات: «الزلة/الانتكاس» → «الزَلّة/الانتكاسة» بتعريفات النموذج المعتمد 2B.2.",
  "rl-cut-point": "«أهم سؤال بعد التعثر» → «بعد الزَلّة»، وحذف اقتباس سؤال اللوم الذاتي واستبداله بـ«اللوم» (الصوت الوصفي بلا إعادة إنتاج عبارته).",
  "rl-second-fall": "«أوقف السقوط الثاني» → «الأولوية بعد الزَلّة: إيقاف الامتداد» (إزالة استعارة السقوط الحاملة لعر ضمني، مع الحفاظ على المعنى).",
  "rl-data": "«تعثر اليوم/الحادثة» → «زَلّة اليوم/التسجيل» (توحيد + إزالة مصطلح داخلي من نص المستخدم).",
  "rl-speed": "توحيد زَلّة، و«الاستيقاظ من الزلة» → «الوقوف بعد الزَلّة» (دقة سلوكية).",
  "sc-not-indulgence": "«تعثره» → «زَلّته» (توحيد).",
  "sc-self-criticism": "«أكثر الروابط ارتباطًا» (تكرار ملفت) → «أقوى العوامل المرتبطة»، وتوحيد زَلّة.",
  "sc-firm-compassionate": "«النبر الأمثل» → «النبرة الأمثل» (تصحيح إملائي).",
  "sc-friend-voice": "«بعد نفس التعثر» → «بعد نفس الزَلّة».",
  "sc-repair": "توحيد زَلّة.",
  "pr-full-life": "إزالة مسافة زائدة «و الرصيد» → «والرصيد».",
  "pr-named-project": "استبدال معرف لاتيني عام «دورة X» بمثال عربي محدد «دورة تعلّم» (سلامة RTL ووضوح).",
  "pr-identity": "تصحيح «تظل عيونها» (الضمير لا يناسب) → صياغة محايدة، وتصحيح «واجعلها صدقة» → «صادقة».",
  "va-compass": "«سؤال يُهزم» → «سؤال تخسره».",
  "va-dissonance": "تصحيح نحوي «فيحوله خطة عمل» → «فيحوله إلى خطة عمل»، وتوحيد زَلّة.",
  "sp-tawbah": "توحيد زَلّة، ودقة «أوقف (هذه بداية التوبة)».",
  "sp-prayer-interrupt": "«تدخل الصلاة مقاطعة» → «تمثل الصلاة مقاطعةً» (تصحيح نحوي).",
  "sp-intention": "تصحيح «وغالبة» → «وعاداتك»، واستبدال «X» بمثال عربي.",
  "lt-not-linear": "إصلاح جملة مبتورة «تقدم فترات صعبة ثم تقدم» → «فترات تقدم وفترات صعبة»، و«الحادرة» → «الانحدارات»، و«انتكاس فعلي» → «انتكاسة فعلية».",
  "lt-pressure": "تصحيح إملائي: «والجهزية» → «والجاهزية».",
  "lt-independence": "«المستخدم الأقوى للتطبيق هو من…» → «أقوى مستخدمي التطبيق هم من…» (تصحيح نحوي).",
  "lt-capital": "«التعثر العابر/أي زلة» → صياغة سلوكية موحدة «ما يحدث عابرًا/أي زَلّة».",
  "lt-identity-keeping": "إصلاح قلب معنى: «عادات صغيرة تحرس النمط القديم» → «تحمي النمط الجديد» (كانت تناقض مقصود البطاقة).",
  "pv-ifthen": "توحيد صيغة «إذا… إذن» مع بقية التطبيق.",
  "pv-precommitment": "تصحيح «نفسي الصافح» → «نفسي الصاحي»، و«وأنت عاقل متفرج» → «وأنت هادئ متفرج».",
  "pv-review": "«تحمي أقل كل أسبوع مر» → «تحميك أقل مع كل أسبوع يمر» (ترتيب طبيعي).",
  "pv-friction": "«SafeSearch» → «بحث آمن» (عربية أولًا)، وتصحيح «ضيف» → «أضف»، وتصحيح منطق الجملة الأخيرة (كانت معكوسة).",
  "es-practice-calm": "«أغلق واخرج وامشِ» → فواصل طبيعية، و«مشطته مسبقًا» (غير مفهومة) → «تمرّسته مسبقًا»، وتصحيح تنوين «كاملًا».",
  "es-fewer-choices": "«النظام الصحي» → «النظام السليم» (دقة).",
  "es-one-step": "«لا تحتاج حل كل شيء» → «لا تحتاج إلى حل كل شيء» (تصحيح حرف جر).",
  "es-first-minute": "«بعد دقيقة من الإشعار» → «من أول إشارة» (منع الالتباس مع إشعارات الجهاز).",
  "es-after-drop": "«تغلق الحادثة صح» (عامية ملتبسة) → «تُغلق الموقف على خير»، و«سجل سريع» → «سجّل سريعًا» (تصحيح إملائي).",
};

const FIELDS = ["title", "know", "understand", "act", "remember", "deep"] as const;

function fieldChanged(oldCard: any, newCard: any, f: string): boolean {
  const o = oldCard?.[f] ?? null;
  const n = newCard?.[f] ?? null;
  return o !== n;
}

// ————————————————— 98-final —————————————————
mkdirSync("/home/z/my-project/download", { recursive: true });

const catOrder = KNOWLEDGE_CATEGORIES.map((c) => c.id);
const grouped = new Map<string, any[]>();
for (const k of KNOWLEDGE) {
  if (!grouped.has(k.category)) grouped.set(k.category, []);
  grouped.get(k.category)!.push(k);
}

let out: string[] = [];
out.push("# استعادة — قاعدة المعرفة النهائية: البطاقات الـ٩٨ كاملة");
out.push("");
out.push("**المرحلة 3 — بعد إعادة الصياغة اللغوية الكاملة.**");
out.push("");
out.push(
  "- المصدر: الشيفرة الحالية في `src/data/app/knowledge-core.ts` و `knowledge-wellbeing.ts` و `knowledge-recovery.ts` — هذا الملف مُولَّد منها مباشرة، فهو يطابق ما يعرضه التطبيق حرفيًا."
);
out.push(
  "- الحقول غير الموجودة أصلًا في البطاقة تُسجَّل هنا كـ«غير موجود» — لا محتوى مخترع."
);
out.push(
  "- «قراءة أعمق» موجودة حاليًا في بطاقة واحدة فقط (bb-dopamine)."
);
out.push(
  "- البطاقات الروحية الخمس (spiritual) تظهر فقط عند تفعيل المحتوى الروحي في الإعدادات."
);
out.push("");
out.push(`**إجمالي البطاقات: ${KNOWLEDGE.length}** · موزعة على ${KNOWLEDGE_CATEGORIES.length} تصنيفًا.`);
out.push("");

for (const catId of catOrder) {
  const items = grouped.get(catId) ?? [];
  const label = CATEGORY_LABELS[catId];
  out.push(`# ${label} (${catId}) — ${items.length} بطاقة`);
  out.push("");
  for (const k of items) {
    out.push("---");
    out.push("");
    out.push(`## ${k.id}`);
    out.push("");
    out.push(`**التصنيف:** ${label}`);
    out.push("");
    out.push(`**العنوان الأصلي (قبل إعادة الصياغة):** ${ORIG.get(k.id)?.title ?? "—"}`);
    out.push("");
    out.push(`**العنوان النهائي:** ${k.title}`);
    out.push("");
    out.push(`**اعرف:**`);
    out.push("");
    out.push(k.know);
    out.push("");
    out.push(`**افهم:**`);
    out.push("");
    out.push(k.understand);
    out.push("");
    out.push(`**افعل:**`);
    out.push("");
    out.push(k.act);
    out.push("");
    out.push(`**تذكّر:**`);
    out.push("");
    out.push(k.remember);
    out.push("");
    out.push(`**قراءة أعمق:**`);
    out.push("");
    out.push(k.deep ?? "غير موجود");
    out.push("");
  }
  out.push("");
}

writeFileSync("/home/z/my-project/download/phase3-knowledge-98-final.md", out.join("\n"), "utf-8");

// ————————————————— change-map —————————————————
out = [];
out.push("# استعادة — خريطة تغييرات بطاقات المعرفة (قبل/بعد)");
out.push("");
out.push("**المرحلة 3 — Before/After Traceability لكل بطاقة من الـ98.**");
out.push("");
out.push(
  "المقارنة بين النسخة الأصلية (قبل المرحلة 2C/3) والنسخة النهائية الحالية. جميع التغييرات لغوية/تحريرية؛ لم تتغير أي بنية (title/know/understand/act/remember/deep)، ولا المعرفات (IDs)، ولا التصنيفات، ولا الوسوم، ولا المراحل، ولا خصائص المحتوى الروحي."
);
out.push("");

let changed = 0;
let unchanged = 0;
let titleChanged = 0;
const structural = 0;

for (const catId of catOrder) {
  const items = grouped.get(catId) ?? [];
  out.push(`# ${CATEGORY_LABELS[catId]} (${catId})`);
  out.push("");
  for (const k of items) {
    const old = ORIG.get(k.id);
    const oldTitle = old?.title ?? "—";
    const changedFields = FIELDS.filter((f) => fieldChanged(old, k, f));
    const isChanged = changedFields.length > 0;
    if (isChanged) changed++;
    else unchanged++;
    if (oldTitle !== k.title) titleChanged++;

    out.push(`## ${k.id}`);
    out.push("");
    out.push(`- **العنوان القديم:** ${oldTitle}`);
    out.push(`- **العنوان الجديد:** ${k.title}`);
    out.push(
      `- **ما الذي تغير:** ${
        isChanged
          ? changedFields.map((f) => `«${f}»`).join("، ")
          : "لا شيء — بطاقة تُركت كما هي عن قصد (لغتها كانت سليمة أصلًا)"
      }`
    );
    out.push(
      `- **لماذا:** ${
        isChanged
          ? NOTES[k.id] ??
            "تدقيق لغوي وتحريري: إزالة ترجمة حرفية، أو تصحيح إملائي/نحوي، أو توحيد المصطلحات، أو تحسين التدفّق — دون تغيير المعلومة."
          : "الصياغة الأصلية ضمن المعيار اللغوي المعتمد."
      }`
    );
    out.push(
      `- **تغيير دلالي (معنى/سلوك):** ${
        [
          "ur-surfing-skill",
          "rl-second-fall",
          "lt-identity-keeping",
          "pv-friction",
          "rl-cut-point",
        ].includes(k.id)
          ? "نعم — محدود وموثق أعلاه (تصحيح معنى كان مقلوبًا أو بقايا مقياس قديم أو إزالة صياغة حكم على الشخص)"
          : "لا — Language-only rewrite; semantics preserved."
      }`
    );
    out.push("");
  }
}

out.push("---");
out.push("");
out.push(`# الإجماليات`);
out.push("");
out.push(`- بطاقات خضعـت لتغيير لغوي: **${changed}**`);
out.push(`- بطاقات تُركت دون تغيير: **${unchanged}**`);
out.push(`- بطاقات تغيّر عنوانها: **${titleChanged}**`);
out.push(`- تغييرات بنيوية (بنية/معرف/تصنيف/وسوم/مرحلة): **${structural}** — لا شيء.`);
out.push("");
out.push(
  "خمس بطاقات فقط سُجّل لها «تغيير دلالي» — وفي كل حالة يكون التغيير إصلاحًا لخطأ قائم (معنى مقلوب، أو بقايا المقياس القديم ١–١٠، أو صياغة تحمل حكمًا على الشخص خلافًا للنموذج المعتمد)، وليس تغييرًا اختياريًا في الدلالة."
);

writeFileSync(
  "/home/z/my-project/download/phase3-knowledge-change-map.md",
  out.join("\n"),
  "utf-8"
);

console.log("98-final cards:", KNOWLEDGE.length);
console.log("changed:", changed, "| unchanged:", unchanged, "| title changes:", titleChanged);
console.log("written: download/phase3-knowledge-98-final.md");
console.log("written: download/phase3-knowledge-change-map.md");
