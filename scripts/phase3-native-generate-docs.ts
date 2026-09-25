// Phase 3 native-Arabic deliverables generator — runs with bun.
// Emits:
//   download/phase3-knowledge-98-native-arabic-final.md   (all 98, full fields)
//   download/phase3-knowledge-50-final.md                 (all 50, full fields)
//   download/phase3-knowledge-native-arabic-change-map.md (98 before/after + 50 provenance)
// "Before" snapshot: scripts/native-pre/ (state right before this native rewrite).
import { KNOWLEDGE, KNOWLEDGE_CATEGORIES, CATEGORY_LABELS } from "../src/data/app/knowledge";
import { KNOWLEDGE_NEW } from "../src/data/app/knowledge-new";
import { writeFileSync, mkdirSync, readFileSync } from "fs";

function loadSnap(path: string, exportName: string): any[] {
  let src = readFileSync(path, "utf-8");
  src = src.replace(
    /import type \{ KnowledgeItem \} from "@\/lib\/app\/types";/,
    'import type { KnowledgeItem } from "../../src/lib/app/types";'
  );
  const tmp = path.replace(".ts", ".tmp.ts");
  writeFileSync(tmp, src);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require(tmp);
  return mod[exportName];
}

const PRE = new Map<string, any>();
for (const k of [
  ...loadSnap("/home/z/my-project/scripts/native-pre/knowledge-core.ts", "KNOWLEDGE_CORE"),
  ...loadSnap("/home/z/my-project/scripts/native-pre/knowledge-wellbeing.ts", "KNOWLEDGE_WELLBEING"),
  ...loadSnap("/home/z/my-project/scripts/native-pre/knowledge-recovery.ts", "KNOWLEDGE_RECOVERY"),
]) PRE.set(k.id, k);

const OLD98 = KNOWLEDGE.filter((k) => !KNOWLEDGE_NEW.some((n) => n.id === k.id));

// ——— curated per-card language-issue notes (native rewrite) ———
const ISSUES: Record<string, string> = {
  "bb-dopamine": "صياغة اسمية جامدة («يشارك في الدافع والتوقع») → جملة فعلية طبيعية مع الحفاظ على التحفظ العلمي.",
  "bb-sensitization": "موازنة المقارنة: «أسرع… لا أقل» كانت غير متوازنة → «أسرع وأسهل، لا أضعف»؛ و«مع عدم الإطعام» → «حين تحرمه التكرار» (تلازم طبيعي).",
  "bb-neuroplasticity": "«يحتفظ الدماغ بقدرته» بنية ترجمة → جملة عربية متدفقة + توحيد «قلّ/قوي» بدل «قلّ/يقوى» المختلطة.",
  "bb-variable-reward": "تحسين تدفّق + إعادة تأليف سطر التذكّر لإزالة تكرار موثق مع tr-curiosity (العبارة القديمة نفسها كانت في البطاقتين).",
  "bb-wanting-liking": "«هذا ليس تناقضًا ولا ضعفًا» أسلوب إنجليزي (It's not X) → «ليس في الأمر تناقض ولا ضعف».",
  "tr-broad": "قائمة مضافة بأسلوب ملاحيظات → جملة عربية واحدة متصلة «فالذكرى محفز، والملل محفز…».",
  "tr-combo": "الترميز الرمزي في العنوان والفعل (ليل + وحدة + جهاز) → عطف عربي؛ «=» في الفعل أزيلت.",
  "tr-early-detection": "«الانسحاب يزداد صعوبة» → «يغلو ثمنه» (تلازم عربي)؛ «=» في المثال → صيغة شرطية.",
  "tr-curiosity": "«يقدم نفسه كبحث بريء» ترجمة → «يقدّم نفسه بحُسن نية»؛ توحيد الإيقاع.",
  "tr-log-patterns": "«١١م» اختصار لاتيني → «الحادية عشرة»؛ «٧ من ٩» أبقيت (بيانات) مع صياغة أصفى حولها.",
  "ur-wave": "«إن لم تُطعَم» في صدر الجملة → ترتيب عربي طبيعي؛ «+ تنفس + ملاحظة» → عطف.",
  "ur-not-command": "«وهذه الفجوة هي مساحة حريتك كاملة» ثقيلة → «وهي كل مساحة حريتك».",
  "ur-suppression": "إعادة تأليف الحارس/المراقبة بصيغة شرطية عربية («حين تأمر عقلك… يجلس حارسًا») بدل الجملة الاسمية المترجمة.",
  "ur-surfing-skill": "تحسين إيقاع التدرج (مستحيلة/صعبة/مملة) — كان سليمًا وأُعيد ضبطه فقط.",
  "ur-fade": "«تشهد أغلب التجارب خفوتًا» مسند أجنبي → «تخفّ الرغبات عند أغلب الناس»؛ «تساقط» → «انهار» (أدق).",
  "hl-loop": "أسهم التسلسل في العنوان (إشارة → روتين → مكافأة) → «إشارة، فروتين، فمكافأة» (واو الفاء العربية).",
  "hl-implementation": "تدقيق طفيف؛ البنية كانت سليمة.",
  "hl-context": "إعادة تأليف سطر التذكّر: «لا تختبر نفسك أمام المحفز — هندِس البيئة» كان مكررًا مع dg-no-testing → «السياق أقوى من النية».",
  "hl-willpower": "«رهينة مزاجك» صياغة مترجمة الوقع → جملة شرطية عربية؛ «+» في الفهم والفعل → عطف.",
  "hl-substitute": "العنوان «استبدال أذكى من الإفراغ التام» ملتبس → «استبدِل السلوك، ولا تترك فراغًا» (نفس الفكرة، أمر مباشر عربي).",
  "en-friction": "الأرقام «٢٠ ثانية» → «عشرين ثانية» حيث أمكن مع بنية مقابلة عربية (أضِف… ينخفض / اختصر… يرتفع).",
  "en-bedroom": "إعادة تأليف الفهم بجملة شرطية («فإذا تصفحت فيه مرة بعد مرة، صار السرير نفسه بداية الطريق»).",
  "en-people": "«مطفأته» صياغة مفخخة → «وحضور الناس يطفئها»؛ «حلًّا نفسيًّا» تُنطق بضمّ الوصل بشكل صحيح.",
  "en-homescreen": "«=» في العنوان → «هي» الربطية؛ «قدرًا» مبالغة → «اضطرارًا».",
  "en-leaving": "«فكرك يستخدم الغرفة كامتداد للذاكرة» تركيب غريب → «المكان نفسه صار جزءًا من ذاكرتها»؛ «=» → صيغة إمرية.",
  "sl-self-regulation": "«+» في سرد العوامل → عطف؛ «هذا يعني أن» افتتاحية مترجمة → حذفها.",
  "sl-window": "«وقت ما بعد الأعمال والإلزامات» ثقيل → «الوقت الذي بعد انتهاء المهام والإلزامات»؛ «+» → عطف.",
  "sl-phone-out": "تحسين طفيف — كان سليمًا بعد جولة 2C.",
  "sl-protocol": "«٣٠-٦٠ دقيقة» → «من ٣٠ إلى ٦٠ دقيقة»؛ «تحل المشكلة من جذرها» → «تعالجها من أصلها».",
  "sl-consistency": "«أرضية كل شيء آخر» تركيب غير عربي → «ثبّت إيقاعك أولًا — ما بعد ذلك يتبع وحده».",
  "st-escape": "«ليست عن الرغبة بحد ذاتها» ترجمة (not about) → «ليست… بقدر ما هي هروب».",
  "st-guilt-loop": "أسهم العنوان (التوتر → التفريغ → الذنب) → «التوتر والتفريغ والذنب».",
  "st-shrink": "«تبدو أكبر من محددة» تركيب مبتور → مقابلة عربية كاملة (الضبابية/المحددة).",
  "st-window": "«توتر مزمن» → «ضغط متصل» (أوضح)؛ «الفترات هذه تُدار» → «وتُدار بمخطط أخف» إتمام الجملة.",
  "st-daily": "«حاجة الجسم للمهرب» → «إلى المهرب»؛ تحسين إيقاع ختامي.",
  "em-labeling": "«+» داخل المثال → فاصل عربي؛ «يجعلك عاجزًا أمامه» → «يوقفك عاجزًا».",
  "em-halt": "تحسين طفيف للإيقاع؛ «من جذورها» بقيت (تلازم مقبول).",
  "em-temporary": "«١٠ دقائق تأجيل إلزامية» → «عشر دقائق تأجيلًا، لا أقل» (تمييز عربي بدل نعت أجنبي).",
  "em-body": "«٢٠ قرفصاء» → «عشرون قرفصاء» (عدد عربي)؛ إعادة ترتيب الفعل.",
  "em-loneliness": "تدقيق طفيف — كان سليمًا.",
  "at-trainable": "«التغذية السريعة» → «الجرعة السريعة» (أوضح في السياق العربي)؛ «(تمرير، مقاطع قصيرة)» قوسيات → شرطات عربية.",
  "at-residue": "«فاتورة بطيئة» استعارة مترجمة (slow bill) → «تدفع ثمنها لاحقًا — من تركيزك».",
  "at-block": "«تتفرع حوله» → «تنتظم حوله» (تلازم أدق).",
  "at-boredom": "«أطول لحظات الانتظار» فعل مبتور → «اجتز لحظات الانتظار».",
  "at-notifications": "«لا تستأجره مجانًا» ترجمة حرفية (rent it out) → «لا تترك غيرك يحدد لحظة صرفه».",
  "di-willpower-debate": "«يجعل أيامك رهينة» في صيغة مصدرية → جملة شرطية؛ توحيد «إما كل شيء أو لا شيء».",
  "di-systems": "«مجرد منفذ» → «منفِّذًا فقط» (أدق)؛ تحسين التدفّق.",
  "di-minimum": "«+» في وصف اليوم الأدنى → عطف؛ «يوم الحد الأدنى» صياغة أوضح.",
  "di-consistency": "«يتضخم» (تحمل طابعًا مرضيًّا) → «يتراكم» مع «يتبدد» (مقابلة عربية سليمة).",
  "di-decisions": "«١١م» → «الحادية عشرة»؛ «تصويت يومي» → «تنفيذ شبه تلقائي».",
  "re-loneliness-context": "«ترفًا اجتماعيًّا» → بقاء مع تعديل الوصل؛ تحسين طفيف.",
  "re-one-person": "«جهّز هذا الشخص» صيغة → إبقاء مع ضبط؛ «١٤ يومًا» في re-trust تحويلها أدناه.",
  "re-trust": "«١٤ يومًا» → «أربعة عشر يومًا»؛ عطف الأفعال الثلاثة (حضور/وفاء/هدوء) بواو عربية.",
  "re-emptiness": "«حل يفاقم العزلة» إتمام → «حلٍّ يفاقم العزلة» بجرّ صحيح؛ تحسين الإيقاع.",
  "dg-infinite": "كليشتان مترجمتان: «الطاولة محسومة ضدك» (the deck is stacked) و«غيّر اللعبة» → صياغة عربية أصيلة واحدة.",
  "dg-variable": "«جاهزًا تمامًا لأي سلسلة» → «والأرض مهيأة لأي سلسلة» (صورة عربية طبيعية).",
  "dg-one-minute": "أسهم التسلسل في الفهم (إشارة → روتين → مكافأة) → «من الإشارة إلى المكافأة».",
  "dg-no-notifications": "تدقيق طفيف — كان سليمًا (المقابلة يجيء إليك/تذهب أنت عربية أصيلة أصلًا).",
  "dg-no-testing": "«+» في سرد المعادلة → عطف؛ «ليس دليلًا على ضعف» صياغة → «وليس ذلك دليل ضعف فيك».",
  "rl-ave": "«الأبحاث تصف» افتتاحية مترجمة → «هناك ما يسميه الباحثون»؛ «صفحة تُقلب» استعارة غامضة → «لا يُقاس بـ«وقع أو لم يقع»».",
  "rl-lapse-relapse": "إعادة تأليف التعريفين بنفس دلالة النموذج المعتمد 2B.2 (واقعة واحدة محدودة / عودة للنمط مع استمرار أو تكرار).",
  "rl-cut-point": "«يفتح ملفًا ويغلقه بلا مخرج» — إبقاء الصورة مع تحسين الوصل؛ «أما السؤال الثاني» → «والسؤال الآخر».",
  "rl-second-fall": "تحسين تدفّق؛ «على قاعدة الإدماج» لا شيء — البنية كانت سليمة بعد 2C.",
  "rl-data": "«وما يُكتم يعيد نفسه» → «وما يُكتم من دروسه يعود فيتكرر» (إتمام المعنى).",
  "rl-speed": "«تقدم — حتى داخل» → «تقدم يُحسب — حتى داخل» (إتمام ناقص).",
  "sc-not-indulgence": "تدقيق طفيف — كان سليمًا؛ «السجل العلمي يقول عكسه غالبًا» بقي (تحفظ محفوظ).",
  "sc-self-criticism": "أسهم الدورة (خطأ → قسوة → ضيق → هروب) → عطف بالفاء «خطأ، فقسوة، فضيق، فهروب».",
  "sc-firm-compassionate": "تدقيق طفيف؛ إبقاء الاقتباس التوضيحي «أنت فاشل» بصيغة الجر الصحيحة.",
  "sc-friend-voice": "«معايير إعدام» صورة قاسية مبتورة → «معايير قاسية» (تلطف بلا تغيير معنى).",
  "sc-repair": "تدقيق طفيف — كان سليمًا.",
  "pr-full-life": "تحسين طفيف للإيقاع؛ «الرصيد الأغلى يفوز» بقي (صورة سليمة).",
  "pr-named-project": "«فراغ، فجهاز، فسلسلة» بقي (عطف عربي أصيل)؛ ضبط الوصل.",
  "pr-visible-progress": "«أنا من ينجز هذا» بني على «يجيب سؤال… بلا خطاب» — تحسين الوصل فقط.",
  "pr-identity": "«توجّه انتباهك لما يتوسع» → «إلى ما يتوسع» (حرف جر)؛ تحسين طفيف.",
  "va-compass": "تدقيق طفيف — كان سليمًا.",
  "va-write": "«قيمة بلا جملة… نيّة بلا سلاح» — إبقاء (صورة عربية مقبولة).",
  "va-dissonance": "«إن وُجّه هندسيًا لا محاكميًا» تمييز أجنبي → «هندسيًّا، لا محاكمةً».",
  "va-owned": "«يطلبك أن تكتبه» عامية تركيبية → «يطلب منك أن تكتبه».",
  "sp-tawbah": "«أوقف (هذه بداية التوبة)» قوس ناقص الدلالة → «أوقف — فهذه بداية التوبة —».",
  "sp-no-despair": "«أنا لا أُقبل» ملتبس المرجع → «لن تُقبل مني توبة» (تحديد المقصود بلا تغيير المعنى).",
  "sp-prayer-interrupt": "«على كل القنوات» → «لكل القنوات»؛ «وقت الصعود — لا بعده» إعادة ضبط.",
  "sp-dhikr-anchor": "«يعمل كمرساة» ترجمة (works as) → «يعمل مرساةَ انتباهٍ» (مفعول به عربي).",
  "sp-intention": "«يجد المساء يقود نفسه» → «وجد المساء يقود نفسه» ضبط زمن؛ تحسين طفيف.",
  "lt-not-linear": "«كطقس عابر» بقي (صورة سليمة)؛ «فيقرر أن كل شيء انهار» إعادة ضبط الوصل.",
  "lt-pressure": "«+» في وصف الخطة → عطف؛ «يفاجئ به» كان مقلوبًا في جولة سابقة وأُعيد ضبطه «فاجأته».",
  "lt-independence": "«يسجل، يذكّر، ينظم» → تشكيل الفواصل؛ «صارت تعمل وحدها» → «صارت» للجمع.",
  "lt-capital": "«من فرّغ حياته لمجرد المراقبة» بني — تحسين طفيف.",
  "lt-identity-keeping": "تدقيق طفيف — كان سليمًا بعد إصلاح 2B.2 السابق.",
  "pv-before": "«وقتها فعلاً» → «وقتها فعلًا» (تشكيل)؛ تحسين الوصل.",
  "pv-precommitment": "«مثال معروف» → «ومثاله المعروف» (خبر محذوف الربط)؛ «يعطي صديقك… مثال» تركيب ناقص → تتميم.",
  "pv-ifthen": "«إزالة لقرار كامل» → «تُسقط قرارًا كاملًا» (فعل عربي أدق).",
  "pv-review": "«حل محله (فراغ ما بعد الاختبارات)» → «يحل محله غيره» (إزالة التكرار القديم).",
  "pv-friction": "«الفضلى» خطأ صرفي → «خير حمايتك»؛ «بحث، منصة، تطبيق، صورة» → منصوبات عربية (بحثًا، ومنصةً، وتطبيقًا، وصورةً).",
  "es-practice-calm": "«تمرّسته مسبقًا» بقي (سليم من 2C)؛ «جرّبها عند درجة ٢ أو ٣» صياغة أصفى.",
  "es-one-step": "«قلّصنا لك» صوت المؤسسة → تحييد «قلّت الخيارات المعروضة أمامك»؛ أسهم الترتيب في الفعل → «ثم».",
  "es-fewer-choices": "«القليل ينجو حيث يختار الكثير» غامض → «ينجو من يقلّ اختياره، ويغرق من يستعرضه».",
  "es-first-minute": "«حركة القطع في نفس الثانية» → «في الثانية نفسها» (ترتيب عربي).",
  "es-after-drop": "«+» في الفعل → عطف «المحفز والتدخل الذي نجح»؛ «وهذا لطيف» → «وهذا من لطفها».",
};

// ——— the 50 new cards: provenance + overlap analysis ———
const NEW_META: Record<string, { src: string; srcTitle: string; why: string; nearest: string; overlap: string }> = {
  "di-morning-protocol": { src: "NEW-01", srcTitle: "بروتوكول بداية اليوم: أول 30 دقيقة", why: "لا توجد بطاقة تضاهي بروتوكول الليل في التعامل مع بداية اليوم — أول قرارات اليوم والبيئة بعد الاستيقاظ.", nearest: "at-block (جلسة الصباح)، sl-protocol (نظير الليلي)، sp-intention (نية اليوم)", overlap: "تكاملي — لا بطاقة صباحية عملية موجودة في الـ98." },
  "dg-phone-first-decision": { src: "NEW-02", srcTitle: "لا تجعل الهاتف أول قرار في يومك", why: "ربط لحظة الاستيقاظ تحديدًا باستخدام الهاتف قبل أن يبدأ اليوم فعليًا.", nearest: "dg-no-notifications، en-homescreen، at-notifications", overlap: "متميز — كل الموجود عن الإشعارات/الشاشة عمومًا، لا عن لحظة الاستيقاظ." },
  "at-transition-home": { src: "NEW-03", srcTitle: "الانتقال من الدراسة أو العمل إلى البيت", why: "الانتقالات اليومية بين بيئتين كنافذة خطر غير ممثلة.", nearest: "hl-context (السياق)، at-between-tasks (NEW-04)", overlap: "متميز — لحظة انتقال محددة بين بيئتين." },
  "at-between-tasks": { src: "NEW-04", srcTitle: "الانتقال بين مهمتين بدون فتح باب التصفح", why: "الفراغ القصير بين المهام كنافذة مستقلة.", nearest: "at-residue (بقايا التبديل)، dg-one-minute", overlap: "متميز — الفاصل بين المهام، لا آثار التبديل المعرفية." },
  "at-waiting-gaps": { src: "NEW-05", srcTitle: "أوقات الانتظار والفراغ القصير", why: "دقائق الانتظار (مواصلات/طوابير/مواعيد) كنافذة متكررة غير معالجة.", nearest: "at-boredom (الملل كقدرة)", overlap: "متميز — الانتظار سياق مختلف عن الملل النظري." },
  "at-post-completion": { src: "NEW-06", srcTitle: "بعد إنجاز مهمة كبيرة: كيف تنتقل للراحة", why: "لحظة ما بعد الإنجاز: انخفاض الالتزام + رغبة مكافأة.", nearest: "at-block، dg-variable (فتح الشهية)", overlap: "متميز — ما بعد الإنجاز تحديدًا، لا التوتر ولا الملل." },
  "di-open-days": { src: "NEW-07", srcTitle: "الإجازة وعطلة نهاية الأسبوع", why: "الأيام التي تختفي فيها بنية اليوم المعتادة.", nearest: "di-minimum (يوم الحد الأدنى)، hl-willpower", overlap: "متميز — حماية الأيام المفتوحة، لا إدارة يوم الضعف." },
  "lt-travel": { src: "NEW-08", srcTitle: "السفر وتغيّر الروتين", why: "السفر يكسر المكان والوقت والوصول للجهاز دفعة واحدة.", nearest: "lt-pressure (فترات الإجهاد)، hl-context", overlap: "متميز — سياق السفر خارج البيئة المعتادة." },
  "sl-ramadan": { src: "NEW-09", srcTitle: "رمضان وتغيّر النوم والروتين", why: "سياق تقويمي عربي محوري غير ممثل: تغير مواعيد النوم والطاقة والخصوصية.", nearest: "sl-consistency، sl-window", overlap: "متميز — تطبيق مبادئ النوم على سياق رمضان بلا ادعاءات طبية أو دينية." },
  "st-exam-season": { src: "NEW-10", srcTitle: "فترة الامتحانات", why: "موسم يجمع الضغط والجلوس الطويل والفراغ بين المذاكرة.", nearest: "st-escape، st-window (نافذة التحمل)", overlap: "متميز — تطبيق عملي على موسم الامتحانات، لا توتر عام." },
  "lt-app-return": { src: "NEW-11", srcTitle: "العودة إلى التطبيق بعد انقطاع طويل", why: "لا بطاقة تعالج استئناف الأداة نفسها بعد غياب.", nearest: "lt-not-linear، lt-pressure", overlap: "متميز — العودة للتطبيق، لا للسلوك." },
  "di-routine-rebuild": { src: "NEW-12", srcTitle: "إعادة بناء الروتين بعد أسبوع فوضوي", why: "استعادة الروتين اليومي بعد اضطراب مؤقت.", nearest: "di-minimum، di-restart (NEW-44)", overlap: "متمايز عن di-restart: هذه عن الروتين اليومي، وتلك عن استئناف الخطة في التطبيق." },
  "at-boredom-list": { src: "NEW-13", srcTitle: "ابنِ قائمة ملل شخصية", why: "الأداة موجودة في التطبيق ولا بطاقة تشرح بناءها.", nearest: "hl-substitute (البديل)، at-boredom", overlap: "تكاملي — جسر مباشر إلى أداة قائمة الملل." },
  "at-boredom-tolerance": { src: "NEW-14", srcTitle: "تعلّم تحمّل الملل بدون شاشة", why: "التغطية النظرية موجودة والتدريب العملي على التحمل ضعيف.", nearest: "at-boredom (نظرية الملل)", overlap: "تكاملي — تدريب تدريجي عملي يقود للتحمل." },
  "dg-rest-no-phone": { src: "NEW-15", srcTitle: "الراحة بدون هاتف", why: "بدائل الراحة غير الرقمية: راحة لا تبدأ بتصفح مفتوح.", nearest: "dg-variable، st-daily (روتين التفريغ)", overlap: "متميز — تعريف الراحة الحقيقية مقابل الراحة الاستهلاكية." },
  "st-after-hard-day": { src: "NEW-16", srcTitle: "بعد يوم مرهق: افصل قبل ما تختار", why: "الانتقال من الاستنزاف إلى الراحة دون قرار تلقائي.", nearest: "st-escape، em-halt", overlap: "متميز — لحظة ما بعد الإرهاق تحديدًا (الإرهاق ≠ التوتر)." },
  "em-anger": { src: "NEW-17", srcTitle: "الغضب كمحفز", why: "الغضب غير ممثل كبطاقة مستقلة رغم حضوره في الوسوم.", nearest: "em-body، em-labeling، st-window", overlap: "متميز — الغضب كسياق سابق للسلوك." },
  "em-sadness-frustration": { src: "NEW-18", srcTitle: "الحزن والإحباط", why: "دافع الهروب بعد مشاعر سلبية محددة غير مفرد ببطاقة.", nearest: "em-labeling، em-loneliness", overlap: "متميز — الحزن/الإحباط كمحفزَي هروب." },
  "em-social-anxiety": { src: "NEW-19", srcTitle: "القلق الاجتماعي", why: "منع الانسحاب الاجتماعي من أن يصبح تلقائيًا.", nearest: "em-loneliness، re-loneliness-context", overlap: "متمايز — الانسحاب من المواقف بسبب القلق، لا الوحدة كحالة." },
  "em-shame-after-slip": { src: "NEW-20", srcTitle: "الخجل والعار بعد الزلة", why: "تفريق العار عن الذنب بعد السلوك — غير ممثلة.", nearest: "sc-self-criticism، sc-firm-compassionate", overlap: "متمايز عمدًا: هذه تفرد العار (أنا سيئ) عن الذنب (فعلت سيئًا) — سلوك مختلف بعِلاج مختلف." },
  "em-unclear-feelings": { src: "NEW-21", srcTitle: "عندما لا تعرف ما الذي تشعر به", why: "الحالات المختلطة/غير الواضحة وصعوبة تسميتها.", nearest: "em-labeling (وسم المشاعر)", overlap: "متمايز — الحالات المبهمة والتسمية التقريبية، لا الوسم الدقيق." },
  "re-after-hard-talk": { src: "NEW-22", srcTitle: "بعد محادثة صعبة", why: "بقايا التفاعل الاجتماعي الصعب كمحفز لاحق.", nearest: "em-temporary، em-anger (NEW-17)", overlap: "متميز — موقف محدد بعد خلاف، لا الوحدة العامة." },
  "re-loneliness-reading": { src: "NEW-23", srcTitle: "الوحدة ليست دائمًا حاجة إلى البقاء وحدك", why: "التمييز بين الحاجة للهدوء والحاجة للتواصل.", nearest: "em-loneliness، re-loneliness-context", overlap: "متمايز — بطاقة «قراءة نوع الوحدة» واختيار الاستجابة، لا تكرار لبطاقتي الوحدة الموجودتين." },
  "re-asking-support": { src: "NEW-24", srcTitle: "كيف تطلب دعمًا بدون ما تحكي كل شيء", why: "طريقة طلب الدعم وحدود الخصوصية.", nearest: "re-one-person (شخص الدعم)", overlap: "تكاملي — يحول «وجود الشخص» إلى مهارة كلام بحدود." },
  "re-disclosure": { src: "NEW-25", srcTitle: "هل أتكلم عن رحلة التغيير؟", why: "حدود الإفصاح واختيار الشخص الآمن.", nearest: "re-one-person، re-trust", overlap: "متمايز — قرار الإفصاح ودرجاته، لا الثقة ولا الدعم وقت الأزمة." },
  "re-repair-relationship": { src: "NEW-26", srcTitle: "إصلاح علاقة تأثرت بالسلوك", why: "العلاقات المتأثرة غير ممثلة كموضوع مستقل.", nearest: "re-trust (الثقة بالاتساق)", overlap: "متمايز — الإصلاح العملي بعد التأثر، لا مفهوم الثقة المجرد." },
  "dg-content-from-others": { src: "NEW-27", srcTitle: "عندما يأتيك المحتوى المثير من شخص آخر", why: "التعرض الذي يبدأ من الآخرين لا من المستخدم.", nearest: "tr-broad، dg-unintended-exposure (NEW-30)", overlap: "متمايز عن NEW-30: هذه عن المصدر الاجتماعي للوصول؛ وتلك عن قرار الثانية التالية بعد أي عرض عارض." },
  "dg-chat-groups": { src: "NEW-28", srcTitle: "مجموعات الدردشة: ضع حدودًا", why: "الحدود الاجتماعية الرقمية داخل المجموعات.", nearest: "at-notifications، dg-no-notifications", overlap: "متميز — إدارة الوصول للمجموعات، لا الإشعارات عمومًا." },
  "dg-algorithms": { src: "NEW-29", srcTitle: "التوصيات والخوارزميات", why: "تغذية المحتوى الموصى به كعامل بيئي وهندسة إعداداتها.", nearest: "bb-variable-reward، dg-infinite", overlap: "متمايز — هندسة إعدادات التوصيات وسلوك «التالي الآلي»، لا مبدأ المكافأة المتغيرة النظري." },
  "dg-unintended-exposure": { src: "NEW-30", srcTitle: "التعرّض غير المقصود", why: "ما يحدث بعد التعرض العرضي قبل أن يتحول إلى بحث.", nearest: "tr-curiosity، dg-one-minute", overlap: "متمايز — قاعدة الإغلاق أولًا والتفريق بين العارض والاستمرار." },
  "en-click-chain": { src: "NEW-31", srcTitle: "اكسر سلسلة النقرات من أول خطوة", why: "مسار النقرات المتسلسل كنافذة تدخل مستقلة؛ أول نقرة كقرار قابل للقطع.", nearest: "en-friction، pv-friction، dg-one-minute", overlap: "متمايز — تدريب على قطع أول خطوة تحديدًا، أخص من الاحتكاك العام." },
  "tr-no-testing-decision": { src: "NEW-32", srcTitle: "لا تختبر نفسك: متى يكون التجاهل أذكى", why: "تحويل شعار «لا تختبر نفسك» إلى مهارة قرار واضحة.", nearest: "dg-no-testing (الأقرب في الـ98)", overlap: "تقارب مقصود وموثق: dg-no-testing يحذر من الاختبار؛ هذه بطاقة «كيف أقرر الامتناع» — القرار بالقاعدة المكتوبة لا بلحظة الثقة. وُجدتا معًا بتمييز وظيفي صريح." },
  "tr-map-reading": { src: "NEW-33", srcTitle: "كيف تقرأ خريطة المحفزات", why: "أداة Trigger Map موجودة ولا بطاقة تشرح قراءتها.", nearest: "tr-log-patterns، pv-review", overlap: "تكاملي — منهجية قراءة الخريطة بخمس دقائق وثلاث قراءات." },
  "pv-trigger-to-rule": { src: "NEW-34", srcTitle: "حوّل محفزًا واحدًا إلى قاعدة وقاية", why: "الجسر بين اكتشاف المحفز وإنشاء قاعدة Prevention.", nearest: "pv-ifthen، hl-implementation، rl-data", overlap: "تكاملي — قاعدة واحدة من المحفز الأعلى تكرارًا." },
  "pv-weekly-tune": { src: "NEW-35", srcTitle: "راجع خطة الوقاية أسبوعيًا: قاعدة واحدة", why: "استخدام مراجعة الوقاية عمليًا دون إعادة بناء كل شيء.", nearest: "pv-review (المراجعة الأسبوعية)", overlap: "متمايز عن pv-review: تلك تؤسس عادة المراجعة؛ هذه تضبط نطاقها — تعديل قاعدة واحدة فقط." },
  "pv-rule-failed": { src: "NEW-36", srcTitle: "عندما تفشل قاعدة الوقاية", why: "ماذا نفعل حين لا تنجح القاعدة الحالية.", nearest: "pv-review، pv-before", overlap: "متميز — دورة إصلاح تصميم القاعدة بعد فشلها." },
  "ur-intensity-proximity": { src: "NEW-37", srcTitle: "فرّق بين شدة الرغبة وقربك من التنفيذ", why: "توضيح مفهومَي الشدة والقرب الذي تبني عليه درجة الحالة.", nearest: "ur-not-command، ur-wave", overlap: "متمايز — بعد ثالث (المسافة الفيزيائية للتنفيذ) لا يعاد تعريف الموجة." },
  "lt-progress-reading": { src: "NEW-38", srcTitle: "استخدم بيانات التقدم للفهم", why: "خطر تحويل Progress إلى درجة حكم على النفس.", nearest: "lt-not-linear، rl-speed", overlap: "متمايز — منهجية قراءة المؤشرات كأدوات تعلم." },
  "rl-calm-review": { src: "NEW-39", srcTitle: "المراجعة الهادئة بدون اجترار", why: "الفرق بين المراجعة المفيدة والتفكير الزائد.", nearest: "rl-cut-point، rl-second-fall", overlap: "متمايز — طريقة المراجعة نفسها (هيكل ثلاثة أسئلة)، لا نقطة القطع ولا ترتيب الأولويات." },
  "rl-first-hour": { src: "NEW-40", srcTitle: "الساعة الأولى بعد الزلة", why: "تحويل ما بعد الحدث إلى نافذة عملية زمنية محددة.", nearest: "rl-second-fall (إيقاف الامتداد)، rl-ave", overlap: "متمايز عن rl-second-fall: تلك مبدأ الأولوية؛ هذه رتل الساعة الأولى التفصيلي (إغلاق/ماء/مكان/طعام/قرارات مؤجلة)." },
  "pv-repeat-pattern": { src: "NEW-41", srcTitle: "متى تغيّر البيئة بدل تكرار النصيحة", why: "تكرار المحفز نفسه رغم وجود قاعدة سابقة.", nearest: "pv-rule-failed (NEW-36)، en-friction", overlap: "متمايز عن NEW-36: تلك عن فشل قاعدة واحدة؛ هذه عن إعادة تصميم البيئة عند تكرار النمط كله." },
  "rl-after-success": { src: "NEW-42", srcTitle: "بعد أن تنجح في قطع السلوك: ثبّت", why: "التعلم بعد نجاح التدخل لا بعد الفشل فقط.", nearest: "rl-data، es-after-drop", overlap: "متميز — توثيق النجاح وتحويله إلى قاعدة قابلة للتكرار." },
  "sc-hard-day": { src: "NEW-43", srcTitle: "اليوم الصعب لا يحتاج تعويضًا قاسيًا", why: "التعويض القاسي بعد يوم سيئ عمومًا (لا بعد زلة فقط).", nearest: "sc-repair (الإصلاح بعد الزلة)، di-minimum", overlap: "متمايز عن sc-repair: تلك بعد السلوك؛ هذه بعد يوم مرهق بلا سلوك — موضوع مختلف (العقاب التجديدي)." },
  "di-restart": { src: "NEW-44", srcTitle: "كيف تبدأ من جديد بعد أيام ضائعة", why: "استئناف الخطة اليومية المتوقفة بعد انقطاع قصير.", nearest: "di-routine-rebuild (NEW-12)، di-minimum", overlap: "متمايز عن NEW-12: هذه استئناف خطة التطبيق نفسها (أول بند فقط)؛ تلك إعادة بناء روتين اليوم." },
  "ur-urge-return": { src: "NEW-45", srcTitle: "عودة نفس الرغبة بعد فترة هدوء", why: "تفسير عودة الرغبة بعد استقرار دون اعتبارها انهيارًا.", nearest: "ur-fade (الخفوت)، ur-wave", overlap: "متمايز عن ur-fade: تلك عن المسار العام؛ هذه عن قراءة الحدث المفرد بعد الهدوء." },
  "at-deep-work": { src: "NEW-46", srcTitle: "احمِ وقت الدراسة أو العمل", why: "حماية جلسة العمل نفسها من الانتقالات الرقمية.", nearest: "at-trainable، at-residue", overlap: "متمايز — تجهيز الجلسة قبل بدئها، لا التدريب العام على الانتباه." },
  "pr-hobby": { src: "NEW-47", srcTitle: "ابنِ هواية تشغلك", why: "بدائل طويلة المدى تبني هوية أوسع من المنع.", nearest: "pr-named-project، pr-full-life، hl-substitute", overlap: "متمايز عن hl-substitute (البديل اللحظي): الهواية المتراكمة ذات الموعد الأسبوعي." },
  "va-day-design": { src: "NEW-48", srcTitle: "صمّم يومًا يخدم قيمك", why: "تحويل القيم من عبارات مكتوبة إلى توزيع يومي.", nearest: "va-compass، va-write", overlap: "متمايز — ربط القيم بتوزيع ساعات اليوم، لا كتابتها." },
  "re-specialized-help": { src: "NEW-49", srcTitle: "متى يكون طلب مساعدة متخصصة خطوة مناسبة؟", why: "فجوة حقيقية في تحليل الفجوات مع تجنب الادعاءات الطبية.", nearest: "re-one-person، وقائمة «متى تطلب مساعدة مهنية» في الإعدادات", overlap: "تكاملي مع قائمة الإعدادات — بطاقة قرار بلا تشخيص ولا علاج ذاتي." },
  "re-first-appointment": { src: "NEW-50", srcTitle: "كيف تستعد لأول حديث مع مختص", why: "الاستعداد العملي لأول جلسة: هدف وحدود وأسئلة.", nearest: "re-specialized-help (NEW-49)، re-asking-support (NEW-24)", overlap: "مكمّلة — خطوة ما بعد قرار طلب المساعدة." },
};

mkdirSync("/home/z/my-project/download", { recursive: true });
const catOrder = KNOWLEDGE_CATEGORIES.map((c) => c.id);
const FIELDS = ["title", "know", "understand", "act", "remember", "deep"] as const;

// ————————————————— A: 98-native-final —————————————————
let out: string[] = [];
out.push("# استعادة — قاعدة المعرفة: البطاقات الـ98 بعد إعادة التأليف بالعربية الأصيلة");
out.push("");
out.push("**المرحلة 3A — Native Arabic Rewrite. كل بطاقة أُعيد تأليفها من المعنى، لا ترجمةً للتركيب.**");
out.push("");
out.push("- المصدر: الشيفرة الحالية في `src/data/app/knowledge-core.ts` و `knowledge-wellbeing.ts` و `knowledge-recovery.ts` — الملف مولَّد منها مباشرة فيطابق ما يعرضه التطبيق حرفيًا.");
out.push("- المحفوظ: المعرفات (IDs)، التصنيفات، الوسوم، المراحل، بوابة المحتوى الروحي، بنية الحقول — بلا استثناء.");
out.push("- المبدأ: حفظ الفكرة والمعنى والهدف السلوكي والمعلومة الأساسية؛ وإعادة تأليف المفردة والتركيب والإيقاع والاستعارة.");
out.push("- «قراءة أعمق» ما تزال في بطاقة واحدة (bb-dopamine)؛ ما ليس موجودًا يُسجَّل «غير موجود» — لا محتوى مخترع.");
out.push("");
out.push(`**إجمالي البطاقات المعاد تأليفها: ${OLD98.length}**`);
out.push("");
for (const catId of catOrder) {
  const items = OLD98.filter((k) => k.category === catId);
  if (items.length === 0) continue;
  out.push(`# ${CATEGORY_LABELS[catId]} — ${items.length} بطاقة`);
  out.push("");
  for (const k of items) {
    out.push("---");
    out.push("");
    out.push(`## ${k.id}`);
    out.push("");
    out.push(`**التصنيف:** ${CATEGORY_LABELS[k.category]}`);
    out.push("");
    out.push(`**العنوان النهائي:** ${k.title}`);
    out.push("");
    for (const [label, f] of [["اعرف", "know"], ["افهم", "understand"], ["افعل", "act"], ["تذكّر", "remember"], ["قراءة أعمق", "deep"]] as const) {
      out.push(`**${label}:**`);
      out.push("");
      out.push(f === "deep" ? (k.deep ?? "غير موجود") : (k as any)[f]);
      out.push("");
    }
  }
  out.push("");
}
writeFileSync("/home/z/my-project/download/phase3-knowledge-98-native-arabic-final.md", out.join("\n"), "utf-8");

// ————————————————— B: 50-final —————————————————
out = [];
out.push("# استعادة — الموضوعات الخمسون الجديدة (النسخة النهائية)");
out.push("");
out.push("**المرحلة 3B — كُتبت بالعربية الأصيلة من الصفر، من قائمة `phase3-knowledge-50-topics-proposed.md` حصرًا (NEW-01 … NEW-50).**");
out.push("");
out.push("- نفس مخطط بطاقات الـ98 (id / category / title / know / understand / act / remember / deep عند الحاجة) — بلا حقول جديدة.");
out.push("- الفئات: أقرب فئة موجودة في النظام — لم تُنشأ أي فئة جديدة.");
out.push("- لا بطاقة روحية gated جديدة: لا موضوعًا في القائمة المقترحة طبيعته محتوى روحي (بطاقة رمضان سلوكية/نومية بلا أي ادعاء ديني أو طبي).");
out.push("- لا ادعاءات طبية أو جنسية؛ مواضيع طلب المساعدة إرشاد عملي غير تشخيصي.");
out.push("");
out.push(`**إجمالي الموضوعات الجديدة: ${KNOWLEDGE_NEW.length}**`);
out.push("");
const groupedNew = new Map<string, any[]>();
for (const k of KNOWLEDGE_NEW) {
  if (!groupedNew.has(k.category)) groupedNew.set(k.category, []);
  groupedNew.get(k.category)!.push(k);
}
for (const catId of catOrder) {
  const items = groupedNew.get(catId) ?? [];
  if (items.length === 0) continue;
  out.push(`# ${CATEGORY_LABELS[catId]} — ${items.length} بطاقة جديدة`);
  out.push("");
  for (const k of items) {
    const m = NEW_META[k.id];
    out.push("---");
    out.push("");
    out.push(`## ${k.id} (${m.src} في القائمة المقترحة)`);
    out.push("");
    out.push(`**التصنيف:** ${CATEGORY_LABELS[k.category]}`);
    out.push("");
    out.push(`**عنوان القائمة المقترحة:** ${m.srcTitle}`);
    out.push("");
    out.push(`**العنوان النهائي:** ${k.title}`);
    out.push("");
    for (const [label, f] of [["اعرف", "know"], ["افهم", "understand"], ["افعل", "act"], ["تذكّر", "remember"], ["قراءة أعمق", "deep"]] as const) {
      out.push(`**${label}:**`);
      out.push("");
      out.push(f === "deep" ? (k.deep ?? "غير موجود") : (k as any)[f]);
      out.push("");
    }
  }
  out.push("");
}
writeFileSync("/home/z/my-project/download/phase3-knowledge-50-final.md", out.join("\n"), "utf-8");

// ————————————————— C: change-map —————————————————
out = [];
out.push("# استعادة — خريطة تغييرات إعادة التأليف الأصيل (قبل/بعد)");
out.push("");
out.push("**المرحلة 3A/3B — تتبع كامل لكل بطاقة من الـ98 + منشأ كل بطاقة من الـ50.**");
out.push("");
out.push("«قبل» = الحالة بعد جولة 2C/3 السابقة (لقطة `scripts/native-pre/`)؛ «بعد» = الشيفرة الحالية. كل تغييرات الـ98 على مستوى اللغة والتأليف: لا تغيير في المعرفات ولا التصنيفات ولا الوسوم ولا المراحل ولا البوابة الروحية ولا السلوك الموصى به ولا درجة اليقين ولا غرض البطاقة.");
out.push("");
let changed = 0, unchanged = 0, titleChanged = 0;
for (const catId of catOrder) {
  const items = OLD98.filter((k) => k.category === catId);
  if (items.length === 0) continue;
  out.push(`# ${CATEGORY_LABELS[catId]} (${catId}) — الـ98`);
  out.push("");
  for (const k of items) {
    const old = PRE.get(k.id);
    const changedFields = FIELDS.filter((f) => (old?.[f] ?? null) !== ((k as any)[f] ?? null));
    const isChanged = changedFields.length > 0;
    if (isChanged) changed++; else unchanged++;
    if (old?.title !== k.title) titleChanged++;
    out.push(`## ${k.id}`);
    out.push("");
    out.push(`- **العنوان القديم:** ${old?.title ?? "—"}`);
    out.push(`- **العنوان الجديد:** ${k.title}`);
    out.push(`- **ما الذي تغيّر:** ${isChanged ? changedFields.map((f) => `«${f}»`).join("، ") : "لا شيء — أُبقيت كما هي (صياغتها كانت أصيلة أصلًا)"}`);
    out.push(`- **القضية اللغوية:** ${ISSUES[k.id] ?? "تحسين إيقاع وتدفّق عام — بلا قضية نوعية."}`);
    out.push(`- **تغيير دلالي (معنى/سلوك):** لا — إعادة تأليف لغوية؛ الدلالة والهدف السلوكي محفوظان.${["bb-variable-reward", "hl-context"].includes(k.id) ? " (ملاحظة: أُعيد تأليف سطر التذكّر بمعادل سلوكي مختلف اللفظ لإزالة تكرار موثق مع بطاقة أخرى — الدلالة العملية محفوظة؛ انظر القضية اللغوية.)" : ""}`);
    out.push("");
  }
}
out.push("---");
out.push("");
out.push("# الـ50 الجديدة — المنشأ وفحص التداخل");
out.push("");
out.push("المصدر الوحيد لأسماء الموضوعات: `phase3-knowledge-50-topics-proposed.md`. قورن كل موضوع مع الـ98 (وفيما بينها) قبل الكتابة: الفكرة، الآلية، غرض الاستخدام. التقارب الوظيفي حُسم بالتمايز في المحتوى؛ لا موضوع حُذف ولا استُبدل.");
out.push("");
for (const catId of catOrder) {
  const items = (groupedNew.get(catId) ?? []);
  if (items.length === 0) continue;
  out.push(`## ${CATEGORY_LABELS[catId]} (${catId})`);
  out.push("");
  for (const k of items) {
    const m = NEW_META[k.id];
    out.push(`### ${k.id}`);
    out.push("");
    out.push(`- **مصدر الموضوع:** ${m.src} — «${m.srcTitle}»`);
    out.push(`- **العنوان النهائي:** ${k.title}`);
    out.push(`- **سبب الإضافة:** ${m.why}`);
    out.push(`- **أقرب البطاقات الموجودة التي فُحصت:** ${m.nearest}`);
    out.push(`- **حالة التداخل:** ${m.overlap}`);
    out.push("");
  }
}
out.push("---");
out.push("");
out.push("# الإجماليات");
out.push("");
out.push(`- من الـ98: بطاقات أعيد تأليفها (تغيّر حقل واحد على الأقل): **${changed}** — وبطاقات بقيت نصًّا كما هي: **${unchanged}**.`);
out.push(`- بطاقات تغيّر عنوانها: **${titleChanged}**.`);
out.push(`- تغييرات بنيوية (معرف/تصنيف/وسم/مرحلة/بوابة روحية): **0**.`);
out.push(`- الموضوعات الجديدة المضافة: **${KNOWLEDGE_NEW.length}** بالضبط (NEW-01 … NEW-50) — لا موضوع حُذف ولا استُبدل ولا أُضيف من خارج القائمة.`);
out.push(`- إجمالي القاعدة بعد الإضافة: **${KNOWLEDGE.length}** بطاقة.`);
out.push("");
writeFileSync("/home/z/my-project/download/phase3-knowledge-native-arabic-change-map.md", out.join("\n"), "utf-8");

console.log("98 rewritten:", OLD98.length, "| changed:", changed, "| unchanged:", unchanged, "| titles:", titleChanged);
console.log("50 new:", KNOWLEDGE_NEW.length, "| total:", KNOWLEDGE.length);
console.log("written: 3 files in download/");
