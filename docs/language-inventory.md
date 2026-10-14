# استعادة — Istiaada: الجرد اللغوي الكامل (Complete Language Inventory)

> **ملف مرجعي لمراجعة لغوية بشرية.** ده الملف توثيق استخراجي بس: كل نص فيه منسوخ **حرفيًا** من الكود الحالي للتطبيق (نسخة `2.3.0`)، دون أي تعديل أو تحسين أو تصحيح أو ترجمة. لا يحتوي أي اقتراحات لغوية — المراجعة اللغوية مرحلة منفصلة تتم برا ده الملف.

- **تاريخ الاستخراج:** 2025-09-23 (مأخوذ من حالة الكود الفعلية لحظة الاستخراج)
- **التطبيق:** استعادة — نظام شخصي لاستعادة التحكم (عربي RTL، يعمل محليًا بالكامل)
- **إصدار التطبيق:** 2.3.0
- **المنهجية:** (1) ماسح نصوص آلي (tokenizer) على 98 ملفًا مصدريًا يستخرج كل النصوص الحرفية وقوالبها وخصائص الوصول مع موقع كل نص؛ (2) قراءة بشرية كاملة لكل شاشة ومكوّن وملف منطق لتحديد النصوص الظاهرة للمستخدم وشروط ظهورها ونصوصها الديناميكية؛ (3) تفريغ آلي مباشر لملفات البيانات (التصنيف، التدخلات، بنك المعرفة) لضمان النقل الحرفي بلا فقد؛ (4) جولة تحقق تشغيلية (runtime) على التطبيق الفعلي لمطابقة ما بيظهر على الشاشات.

## 1. الملخص (Summary)

يحتوي ده الملف على **1,976 نصًا فريدًا** يوجه للمستخدم (775 نص واجهة + 1,201 نص محتوى بيانات)، موزعة على 843 موضع استخدام في الكود. يشمل ده: كل الشاشات والحالات (افتراضي/فارغ/خطأ/نجاح/تحذير)، كل الحوارات ورسائل التأكيد، كل نصوص إمكانية الوصول (aria-label والنصوص المخفية لقارئات الشاشة)، كل النصوص الديناميكية بقوالبها ومتغيراتها، وكل النصوص الشرطية بفروعها المختلفة، إضافة إلى المحتوى الثابت كاملًا: مستويات درجة الحالة، مكتبة المحفزات، العلامات المبكرة، ردود مسوّغات التفاوض، مراحل الرحلة، أدلة الحماية الرقمية، قوالب رسائل الدعم، الممارسات الروحية، **مكتبة التدخلات الـ28 كاملة**، و**بنك المعرفة الـ148 بطاقة كاملًا** (مع 5 بطاقات روحية بتظهر بس عند تفعيل المحتوى الروحي).

إيه **مستثنى** عمدًا (غير موجه للمستخدم ولا بيظهر له): أسماء المتغيرات والدوال والمكوّنات، أنواع TypeScript، معرّفات داخلية، مسارات الملفات، أسماء فئات CSS، رسائل المطورين وسجلات الأخطاء التقنية. أما أي نص تقني بيظهر فعلًا في الواجهة (مثل رقم الإصدار `2.3.0` في سطر الإعدادات) فهو مُدرج.

كما وُثّقت في القسم 28 نصوص موجودة في ملفات البيانات بسها **غير معروضة دلوقتي** في أي شاشة (مثل قائمة الملل ومبدأ وضع العمل الآمن وتلميحات فئات المحفزات) — أُدرجت كاملة مع وسم صريح بعدم ظهورها، حتى لا يفقد المراجع أي نص موجود في الكود، إضافة إلى اكتشافين تشغيليين موثّقين في القسم 3.

## 2. اصطلاحات القراءة

- **TXT-####:** نص واجهة (من ملفات الشاشات/المكوّنات/المنطق). الجدول بترتيب الشاشات.
- **بادئات المحتوى:** `RISK-` مستويات درجة الحالة · `MODE-` تسميات الوضع · `TCAT-` فئات المحفزات · `TRG-` محفزات · `EARLY-` علامات مبكرة · `ANTI-` ردود التفاوض · `STAGE-` مراحل الرحلة · `WS-` خطوات وضع العمل الآمن · `DPG-` أدلة الحماية الرقمية · `SUP-` قوالب رسائل الدعم · `VULN-` عوامل ضعف المقاومة · `WHY-` أسباب شخصية · `SPIR-` ممارسات روحية · `SEEK-` مؤشرات طلب دعم مهني · `KCAT-` تصنيفات المعرفة · `INT-` تدخلات · `KNW-` بطاقات المعرفة.
- **عمود Dynamic:** «نعم» = النص يُركّب وقت التشغيل (قالب فيه متغيرات). القسم 23 يفصّل كل قالب ومتغيراته ومثالًا له.
- **عمود الحالات:** إمتى بيظهر النص (شرط الحالة/الفرع). النص نفسه قد بيظهر في أكثر من موضع بشروط مختلفة — كل الشروط مدرجة معًا مفصولة بـ ⫽.
- **خريطة الاستخدام (القسم 27):** لكل نص فريد، كل مواضعه في الكود (ملف:سطر — المنطقة). النص المكرر في عدة أماكن = نص واحد بعدة استخدامات.
- النصوص منسوخة حرفيًا بما فيها علامات الترقيم والأقواس «…» والشرطات — والقوالب الديناميكية معروضة بصيغتها في الكود `${…}`.

## 3. التحقق التشغيلي (Runtime Verification)

بعد التحليل الساكن، شُغّل التطبيق فعليًا (نسخة التطوير، منفذ 3000) وجولة كاملة على 25 لقطة شاشة لمسار الاستخدام الحقيقي: الترحيب ← خطوات التهيئة الثماني ← الرئيسية (حالة مستقرة + بطاقة الجرعة + الدليل السريع) ← الجرعة اليومية ← الخطة اليومية ← Sheet «كل الأقسام» ← فحص الرغبة (إدخال + نتيجة درجة ٣ + حوار مسح الفحص) ← وضع الطوارئ (خطوتان + خروج) ← خريطة المحفزات (حالة باردة) ← توقّف هنا (حالة فارغة) ← خطة الوقاية (القواعد المزروعة) ← التقدم ← القيم ← قاعدة المعرفة (143 بطاقة والمحتوى الروحي موقوف) ← الإعدادات.

**نتيجة المطابقة الآلية:** قورن كل نص عربي ظاهر في اللقطات بالجرد أعلاه — لم يُعثر على أي نص ظاهر للمستخدم غير موجود في الجرد. كل حالات «عدم التطابق الحرفي» الظاهرة آليًا (201 حالة) مردّها واحد من ثلاثة: (أ) شجرة الوصول تدمج نصين متجاورين في اسم واحد (مثل «مستقر؟ خد جرعة اليوم» = نصان متجاوران في الجرد)، (ب) قيمة ديناميكية معوّضة في قالب موثّق (مثل «خطوة 3 من 8» من قالب `خطوة ${current+1} من ${total}`)، أو (ج) نص معاينة البطاقة مقطوع بـ CSS (3 أسطر) بينما النص الكامل موثّق كاملًا في القسم 26.

**تأكيدات ديناميكية رُصدت فعليًا:** التحية بتتغير بالساعة («مساء الخير»)؛ رقاقة «الكل (143)» مع المحتوى الروحي موقوفًا (148 عند تفعيله)؛ عدّاد «اليوم 1 من رحلتك»؛ تسمية المرحلة «التثبيت» في اليوم 1؛ القواعد الأربعة المزروعة بتظهر في خطة الوقاية؛ قوالب aria-Label للسلالم («١ · شدة الرغبة: 3 من ٥») مطابقة للقالب الموثّق.

**اكتشافات تشغيلية (برا الكود المصدري للتطبيق — موثّقة للمراجعة):**

1. **وسم وصول إنجليزي من مكتبة خارجية:** منطقة الإشعارات في DOM تحمل `aria-label` افتراضيًا من Radix UI ToastProvider: **«Notifications (F8)»** — نص إنجليزي يصل لقارئات الشاشة وليس من نصوص التطبيق (المكوّن مركّب بس لا يُستدعى عليه أي toast في النسخة الحالية). راجع القسم 28/ب-2.
2. **قيمة غير متسقة في شارة الطوارئ:** الدخول الدائم لزر SOS السفلي يعرض **«درجة الحالة: 7 من ٥ — أزمة»** — المشغّل يمرر 7 (على السلم القديم من 10) بينما الشارة تصرح «من ٥». موثّق لأنه نص ظاهر فعليًا للمستخدم؛ إصلاحه برا نطاق ده الجرد.
3. **أدوات تطوير بس:** زر «Open Next.js Dev Tools» بيظهر في نسخة التطوير بس (بادئة Next.js) ومفيش في بناء الإنتاج — غير مُدرج كنص تطبيق.

## 4. النصوص العامة والمشتركة (Global / Shared UI)

عدد النصوص الفريدة في ده القسم: **9**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0001 | استعادة — نظام شخصي لاستعادة التحكم | Title | Browser tab / metadata | لا | always (page title) |
| TXT-0002 | تطبيق مساعدة ذاتية سلوكية لاستعادة التحكم: لاحظ، افهم، اقطع السلسلة، تعلّم، وابنِ حياة أحسن. يعمل محليًا على جهازك — لا حسابات ولا خوادم. | Description | Metadata description | لا | always (meta description, not rendered in UI) |
| TXT-0003 | استعادة | Name | Metadata applicationName (4 استخدام) | لا | always (OS/app metadata) ⫽ Splash screen while store hydrates (brief) ⫽ Desktop sidebar always ⫽ Onboarding header always |
| TXT-0004 | استعادة التحكم | Keyword | Metadata keywords | لا | meta only |
| TXT-0005 | مساعدة ذاتية | Keyword | Metadata keywords | لا | meta only |
| TXT-0006 | سلوك | Keyword | Metadata keywords | لا | meta only |
| TXT-0007 | عادات | Keyword | Metadata keywords | لا | meta only |
| TXT-0008 | خصوصية | Keyword | Metadata keywords | لا | meta only |
| TXT-0009 | قفل | A11y | Dialog close sr-only label (3 استخدام) | لا | Every Dialog close button (knowledge card, plan check-in, prevention add/edit, settings import) ⫽ More sheet close button (mobile) ⫽ More sheet open |

## 5. التنقل (Navigation)

عدد النصوص الفريدة في ده القسم: **25**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0033 | الرئيسية | Nav label | Sidebar nav item (2 استخدام) | لا | Desktop sidebar always; More sheet always ⫽ Mobile bottom nav always |
| TXT-0034 | نظرة اليوم وحالتك | Nav description | Sidebar nav item desc | لا | More sheet (mobile) always |
| TXT-0035 | الجرعة اليومية | Nav label | Sidebar nav item (3 استخدام) | لا | Desktop sidebar + More sheet ⫽ Dose screen always ⫽ Settings screen always |
| TXT-0036 | دقيقة معرفة في يومك الهادي | Nav description | Sidebar nav item desc | لا | More sheet (mobile) |
| TXT-0037 | الخطة اليومية | Nav label | Sidebar nav item (3 استخدام) | لا | Desktop sidebar + More sheet ⫽ Always ⫽ Plan screen always |
| TXT-0038 | بناء يوم يستحق | Nav description | Sidebar nav item desc | لا | More sheet (mobile) |
| TXT-0039 | فحص الرغبة | Nav label | Sidebar nav item (2 استخدام) | لا | Desktop sidebar + More sheet ⫽ Input phase |
| TXT-0040 | بدأت رغبة؟ اعرف خطوتك | Nav description | Sidebar nav item desc | لا | More sheet (mobile) |
| TXT-0041 | خريطة المحفزات | Nav label | Sidebar nav item (2 استخدام) | لا | Desktop sidebar + More sheet ⫽ Trigger map always |
| TXT-0042 | أنماط سجلك ونقطة التوقف الأبكر | Nav description | Sidebar nav item desc | لا | More sheet (mobile) |
| TXT-0043 | توقّف هنا | Nav label | Sidebar nav item (4 استخدام) | لا | Desktop sidebar + More sheet ⫽ Quick guide ⫽ Post-relapse state ⫽ Main view |
| TXT-0044 | حصلت زَلّة؟ إيقاف فوري ثم فهم هادئ | Nav description | Sidebar nav item desc | لا | More sheet (mobile) |
| TXT-0045 | خطة الوقاية | Nav label | Sidebar nav item (2 استخدام) | لا | Desktop sidebar + More sheet ⫽ Prevention screen always |
| TXT-0046 | قواعد «إذا… إذن» وحمايتك | Nav description | Sidebar nav item desc | لا | More sheet (mobile) |
| TXT-0047 | التقدم | Nav label | Sidebar nav item (2 استخدام) | لا | Desktop sidebar + More sheet ⫽ Progress screen always |
| TXT-0048 | مؤشرات حقيقية بلا نسب زائفة | Nav description | Sidebar nav item desc | لا | More sheet (mobile) |
| TXT-0049 | القيم والروحانيات | Nav label | Sidebar nav item (2 استخدام) | لا | Desktop sidebar + More sheet ⫽ Values screen always |
| TXT-0050 | ليه أفعل ده؟ | Nav description | Sidebar nav item desc (3 استخدام) | لا | More sheet (mobile) ⫽ Wizard step 7 (why step) ⫽ Values screen always |
| TXT-0051 | قاعدة المعرفة | Nav label | Sidebar nav item (2 استخدام) | لا | Desktop sidebar + More sheet ⫽ Knowledge screen always |
| TXT-0052 | قراءة هادئة — للوقت الهادي | Nav description | Sidebar nav item desc | لا | More sheet (mobile) |
| TXT-0053 | الإعدادات | Nav label | Sidebar nav item (2 استخدام) | لا | Desktop sidebar + More sheet ⫽ Settings screen always |
| TXT-0054 | خصوصيتك وبياناتك | Nav description | Sidebar nav item desc | لا | More sheet (mobile) |
| TXT-0055 | الجرعة | Nav label | Bottom nav item | لا | Mobile bottom nav always |
| TXT-0056 | الخطة | Nav label | Bottom nav item | لا | Mobile bottom nav always |
| TXT-0057 | المزيد | Nav label | Bottom nav item | لا | Mobile bottom nav always |

## 6. التهيئة الأولى (Onboarding)

عدد النصوص الفريدة في ده القسم: **80**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0068 | عايز تغيير سلوك يؤثر على حياتي | Chip option | Step 1 goal chips | لا | Step 1 (إنت بتستخدم التطبيق ليه؟) — also reused in Settings preferences editor |
| TXT-0069 | عايز تحكمًا أحسن في الرغبات | Chip option | Step 1 goal chips | لا | Step 1 — also in Settings preferences editor |
| TXT-0070 | عايز تقليل أو إيقاف استخدام الإباحية | Chip option | Step 1 goal chips | لا | Step 1 — also in Settings preferences editor |
| TXT-0071 | عايز تقليل سلوك جنسي قهري | Chip option | Step 1 goal chips | لا | Step 1 — also in Settings preferences editor |
| TXT-0072 | عايز فهم محفزاتي | Chip option | Step 1 goal chips | لا | Step 1 — also in Settings preferences editor |
| TXT-0073 | عايز بناء روتين يومي أقوى | Chip option | Step 1 goal chips | لا | Step 1 — also in Settings preferences editor |
| TXT-0074 | عايز دعمًا مبنيًا على قيمي/روحانيتي | Chip option | Step 1 goal chips | لا | Step 1 — also in Settings preferences editor |
| TXT-0075 | الليل المتأخر | Chip option | Step 2 difficult times chips (2 استخدام) | نعم | Step 2 — also Settings editor; joined into Step 8 summary ⫽ topPattern parts chips (Trigger map + Progress) when lateNight context recorded |
| TXT-0076 | لما أكون وحدي | Chip option | Step 2 difficult times chips | لا | Step 2 — also Settings editor; joined into Step 8 summary |
| TXT-0077 | الملل | Chip option | Step 2 difficult times chips | لا | Step 2 — also Settings editor |
| TXT-0078 | التوتر والضغط | Chip option | Step 2 difficult times chips | لا | Step 2 — also Settings editor |
| TXT-0079 | الإحساس الصعبة | Chip option | Step 2 difficult times chips | لا | Step 2 — also Settings editor |
| TXT-0080 | وقت فراغ غير منظم | Chip option | Step 2 difficult times chips | لا | Step 2 — also Settings editor |
| TXT-0081 | أثناء استخدام الهاتف/الكمبيوتر | Chip option | Step 2 difficult times chips | لا | Step 2 — also Settings editor |
| TXT-0082 | أماكن معينة | Chip option | Step 2 difficult times chips | لا | Step 2 — also Settings editor |
| TXT-0083 | أخرى | Chip option | Step 2 difficult times chips | لا | Step 2 — also Settings editor; also Step 3 option (same word) |
| TXT-0084 | تصفح بلا هدف | Chip option | Step 3 pattern chips | لا | Step 3 — also Settings editor |
| TXT-0085 | افتكر حاجة ما | Chip option | Step 3 pattern chips | لا | Step 3 — also Settings editor |
| TXT-0086 | خيال | Chip option | Step 3 pattern chips | لا | Step 3 — also Settings editor |
| TXT-0087 | فضول | Chip option | Step 3 pattern chips | لا | Step 3 — also Settings editor |
| TXT-0088 | انزعاج انفعالي | Chip option | Step 3 pattern chips | لا | Step 3 — also Settings editor |
| TXT-0089 | انعزال | Chip option | Step 3 pattern chips | لا | Step 3 — also Settings editor |
| TXT-0090 | البقاء في السرير | Chip option | Step 3 pattern chips | لا | Step 3 — also Settings editor |
| TXT-0091 | بحث | Chip option | Step 3 pattern chips | لا | Step 3 — also Settings editor |
| TXT-0092 | الدراسة | Chip option | Step 5 build-goal chips | لا | Step 5 — also Settings editor |
| TXT-0093 | المستقبل المهني | Chip option | Step 5 build-goal chips | لا | Step 5 — also Settings editor |
| TXT-0094 | الانضباط | Chip option | Step 5 build-goal chips | لا | Step 5 — also Settings editor |
| TXT-0095 | العلاقات | Chip option | Step 5 build-goal chips | لا | Step 5 — also Settings editor |
| TXT-0096 | الصحة البدنية | Chip option | Step 5 build-goal chips | لا | Step 5 — also Settings editor |
| TXT-0097 | حياة قيمية/روحية | Chip option | Step 5 build-goal chips | لا | Step 5 — also Settings editor |
| TXT-0098 | إدارة الوقت | Chip option | Step 5 build-goal chips | لا | Step 5 — also Settings editor |
| TXT-0099 | التركيز | Chip option | Step 5 build-goal chips | لا | Step 5 — also Settings editor |
| TXT-0100 | المحتوى العلمي المبسّط | Option | Step 6 support preference options | لا | Step 6 — also Settings editor |
| TXT-0101 | استراتيجيات عملية مباشرة | Option | Step 6 support preference options | لا | Step 6 — also Settings editor |
| TXT-0102 | توجيه نفسي/سلوكي | Option | Step 6 support preference options | لا | Step 6 — also Settings editor |
| TXT-0103 | تأمل قيمي وروحي | Option | Step 6 support preference options | لا | Step 6 — also Settings editor |
| TXT-0104 | مزيج من كل ده | Option | Step 6 support preference options | لا | Step 6 — also Settings editor |
| TXT-0105 | نعم، أحتاجه باستمرار | Option | Step 4 device-needs option | لا | Step 4 — also Settings editor; default=sometimes |
| TXT-0106 | سنجهّز تدخلات لا تتطلب ترك الجهاز | Option description | Step 4 device-needs option desc | لا | Step 4 — also Settings editor |
| TXT-0107 | أحيانًا | Option | Step 4 device-needs option | لا | Step 4 — also Settings editor; default |
| TXT-0108 | سنطلب منك التأكيد وقت الحاجة | Option description | Step 4 device-needs option desc | لا | Step 4 — also Settings editor |
| TXT-0109 | لا، أقدر تركه | Option | Step 4 device-needs option | لا | Step 4 — also Settings editor |
| TXT-0110 | سنفضّل تدخلات الابتعاد عن الجهاز | Option description | Step 4 device-needs option desc | لا | Step 4 — also Settings editor |
| TXT-0111 | نظام شخصي لاستعادة التحكم | Subtitle | Brand subtitle | لا | Onboarding header always |
| TXT-0112 | أهلًا بيك في «استعادة» | Heading | Welcome heading | لا | Welcome screen (first run / no onboardingCompleted) |
| TXT-0113 | نظام شخصي بيساعدك تفهم لحظاتك الصعبة وتوقف السلوك قبل ما بيبدأ — بخطوات عملية، من غير أحكام. | Body | Welcome intro | لا | Welcome screen |
| TXT-0114 | بياناتك على جهازك بس | Heading | Privacy card title | لا | Welcome screen |
| TXT-0115 | من غير حساب، ولا خادم، ولا إرسال لأي مكان — كل حاجة بتتخزن محليًا في متصفحك، وتقدر تصدّرها كنسخة احتياطية وقت ما تحب. | Body | Privacy card body | لا | Welcome screen |
| TXT-0116 | ابدأ كمستخدم جديد | Button | New user CTA | لا | Welcome screen |
| TXT-0117 | أو | Label | Divider | لا | Welcome screen |
| TXT-0118 | مش أول مرة تستخدم التطبيق؟ استعد بياناتك | Heading | Restore card title | لا | Welcome screen |
| TXT-0119 | عندك نسخة احتياطية من جهاز تاني؟ استرجعها دلوقتي وهتفتح البيانات مباشرة — من غير تهيئة تاني. | Body | Restore card body | لا | Welcome screen |
| TXT-0120 | إنت بتستخدم التطبيق ليه؟ | Heading | Step 1 title (2 استخدام) | لا | Wizard step 1 ⫽ Prefs dialog; also onboarding step 1 |
| TXT-0121 | اختار كل ما ينطبق — اختياراتك هنا تخصّص نظامك. | Subtitle | Step 1 subtitle | لا | Wizard step 1 |
| TXT-0122 | إمتى تكون الأمور أصعب عادة؟ | Heading | Step 2 title (2 استخدام) | لا | Wizard step 2 ⫽ Prefs dialog; also onboarding step 2 |
| TXT-0123 | تقدر تختار أكثر من خيار. | Subtitle | Step 2 subtitle | لا | Wizard step 2 |
| TXT-0124 | إيه اللي بيحصل عادة قبل السلوك؟ | Heading | Step 3 title (2 استخدام) | لا | Wizard step 3 ⫽ Prefs dialog; also onboarding step 3 |
| TXT-0125 | اختيارات عامة — مش محتاج تكتب تفاصيل صريحة. | Subtitle | Step 3 subtitle | لا | Wizard step 3 |
| TXT-0126 | ما يهمّنا هنا هو النمط العام (تصفح؟ افتكر؟ ملل؟) — لا محتوى بعينه. | Info note | Step 3 info note | لا | Wizard step 3 |
| TXT-0127 | محتاج هاتفك/كمبيوترك للعمل أو الدراسة؟ | Heading | Step 4 title (2 استخدام) | لا | Wizard step 4 ⫽ Prefs dialog; also onboarding step 4 |
| TXT-0128 | ده يحدد خطة «وضع العمل الآمن» عند الطوارئ. | Subtitle | Step 4 subtitle | لا | Wizard step 4 |
| TXT-0129 | إيه اللي عايز تبنيه؟ | Heading | Step 5 title (2 استخدام) | لا | Wizard step 5 ⫽ Prefs dialog; also onboarding step 5 |
| TXT-0130 | الحياة الممتلئة أقوى درع — اختار أهدافك. | Subtitle | Step 5 subtitle | لا | Wizard step 5 |
| TXT-0131 | أي نوع من الدعم تحب؟ | Heading | Step 6 title (2 استخدام) | لا | Wizard step 6 ⫽ Prefs dialog; also onboarding step 6 |
| TXT-0132 | ده هيظهر في اختيار جرعتك اليومية. | Subtitle | Step 6 subtitle | لا | Wizard step 6 |
| TXT-0133 | اكتب سببك بيدك — أو اختار ما يمثّلك. بيظهر لك في اللحظات الصعبة. | Subtitle | Step 7 subtitle | لا | Wizard step 7 |
| TXT-0134 | سببك الخاص، بكلماتك أنت… (اختياري) | Placeholder | Step 7 textarea placeholder | لا | Wizard step 7 |
| TXT-0135 | جهّزنا خطتك الأولى | Heading | Step 8 title | لا | Wizard final step |
| TXT-0136 | حددنا أهم سياقات الخطر عندك، وبنينا أول خطة استجابة مناسبة ليك. | Body | Step 8 body | لا | Wizard final step |
| TXT-0137 | سياقات الخطر عندك: | Label dynamic | Step 8 summary line label | نعم | Final step; followed by joined STEP2 labels or fallback: لم تحدد بعد — سيحددها سجلّك مع الوقت |
| TXT-0138 | لم تحدد بعد — سيحددها سجلّك مع الوقت | Dynamic fallback | Step 8 summary fallback | نعم | Final step; only when no difficult times selected |
| TXT-0139 | خطة الاستجابة: فحص الرغبة ثلاثي الأبعاد → تدخل مناسب لسياقك → إعادة تقييم → تعلم. | Body | Step 8 response plan line | لا | Final step; label خطة الاستجابة: + fixed text |
| TXT-0140 | حماية الطوارئ: | Label | Step 8 emergency protection label | لا | Final step |
| TXT-0141 | «وضع العمل الآمن» جاهز — مش محتاج تسيب جهازك. | Conditional text | Step 8 device=yes branch | لا | Final step; deviceNeeds === 'yes' |
| TXT-0142 | تدخلات ابتعاد عن الجهاز عند الخطر. | Conditional text | Step 8 device=no/sometimes branch | لا | Final step; deviceNeeds!== 'yes' |
| TXT-0143 | أربع قواعد «إذا… إذن» جاهزة في خطة الوقاية، مستمدة من أكثر الأنماط شيوعًا. | Body | Step 8 prevention rules line | لا | Final step; bold label أربع قواعد «إذا… إذن» جاهزة في خطة الوقاية، + rest |
| TXT-0144 | بياناتك كلها هتتخزن على جهازك بس — من غير حساب، ولا خادم، ولا إرسال لأي مكان. | Info note | Step 8 privacy note | لا | Final step |
| TXT-0145 | اللي فات | Button | Back button (3 استخدام) | لا | Wizard steps (disabled on step 0) ⫽ Review wizard (disabled on step 0) ⫽ Evening dialog (disabled step 0) |
| TXT-0146 | اللي بعده | Button | Next button (3 استخدام) | لا | Wizard steps 0-6; disabled until selection made where required ⫽ Review wizard steps 0-4; step 0 needs trigger, step 2 needs first sign ⫽ Evening dialog steps 0-1 |
| TXT-0147 | ابدأ رحلتي | Button | Finish button | لا | Wizard final step only |

## 7. الرئيسية (Home)

عدد النصوص الفريدة في ده القسم: **64**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0148 | مستقر؟ | Label | Quick guide situation | لا | Quick guide (normal state only) |
| TXT-0149 | بدأت رغبة؟ | Label | Quick guide situation | لا | Quick guide |
| TXT-0150 | افحص الرغبة | Link action | Quick guide action | لا | Quick guide |
| TXT-0151 | قربت تتصرف؟ | Label | Quick guide situation | لا | Quick guide |
| TXT-0152 | حصلت زَلّة؟ | Label | Quick guide situation (2 استخدام) | لا | Quick guide ⫽ Stop flow view |
| TXT-0153 | دليلك السريع — أعمل إيه دلوقتي؟ | Heading | Quick guide title | لا | Quick guide card (normal state only) |
| TXT-0154 | كل أداة ليها وقتها — استخدم اللي محتاجه دلوقتي. | Body | Quick guide footer | لا | Quick guide card |
| TXT-0155 | من قليل | Dynamic text | Handled-recently time label | نعم | Normal state + handled wave < 45 min (or no timestamps) |
| TXT-0156 | منذ ساعة تقريبًا | Dynamic text | Handled-recently time label | نعم | 45–110 min after outcome |
| TXT-0157 | منذ ساعتين تقريبًا | Dynamic text | Handled-recently time label | نعم | > 110 min (within 3h window) |
| TXT-0158 | اختار مهمة واحدة من خطة اليوم — ده كفاية. | Conditional text | Stable-state tail | لا | Normal state; dailyDoseEnabled = false |
| TXT-0159 | جرعتك اليوم تمّت — اختار مهمة واحدة من خطتك أو استرح. | Conditional text | Stable-state tail | لا | Normal state; dose done today |
| TXT-0160 | خد جرعة اليوم واختار مهمة واحدة من خطتك — ده كفاية. | Conditional text | Stable-state tail | لا | Normal state; dose fresh/skipped-not-done |
| TXT-0161 | تمت جرعتك اليوم | Conditional text | Quick guide dose action | لا | Quick guide; dose done today (success green) |
| TXT-0162 | جرعتك في انتظارك | Conditional text | Quick guide dose action | لا | Quick guide; dose skipped today |
| TXT-0163 | خد جرعة اليوم | Conditional text | Quick guide dose action | لا | Quick guide; dose fresh |
| TXT-0164 | العقل | Label | Plan pillar label | لا | Plan pillars grid |
| TXT-0165 | الجسد | Label | Plan pillar label | لا | Plan pillars grid |
| TXT-0166 | الهدف | Label | Plan pillar label | لا | Plan pillars grid |
| TXT-0167 | التواصل | Label | Plan pillar label | لا | Plan pillars grid |
| TXT-0168 | القيم | Label | Plan pillar label | لا | Plan pillars grid |
| TXT-0169 | الرقمي | Label | Plan pillar label | لا | Plan pillars grid |
| TXT-0170 | اليوم ${metrics.daysSinceStart} من رحلتك${metrics.daysSinceLastRelapse!= null ? [[P22]] : ""} | Dynamic text | Header subtitle | نعم | Always. Title is dynamic greeting() from helpers. Example: اليوم 3 من رحلتك — و7 يومًا منذ آخر زَلّة |
| TXT-0171 | تمت استعادة نسختك بنجاح | Success message | Restore notice bold lead | لا | restoreNotice = true (after welcome-path restore); followed by — أهلًا بيك تاني. كل سجلّك رجع لمكانه. |
| TXT-0172 | أهلًا بيك تاني. كل سجلّك رجع لمكانه. | Success message | Restore notice tail | لا | restoreNotice = true |
| TXT-0173 | تم | Button | Restore notice dismiss | لا | restoreNotice = true |
| TXT-0174 | أحسنت — تعاملت مع موجة ${handledAgoLabel()}. | Dynamic text | Normal-state banner | نعم | Normal state; last urge outcome=handled within 3h. Label: من قليل / منذ ساعة تقريبًا / منذ ساعتين تقريبًا |
| TXT-0175 | أنت مستقر دلوقتي — مش محتاج أي تدخل. | Conditional text | Normal-state banner | لا | Normal state; no recent handled wave |
| TXT-0176 | انتبه — آخر فحص أظهر رغبة بدأت تبني. | Warning message | Moderate-state banner | لا | Moderate state (last check risk mid-range) |
| TXT-0177 | مؤشر مش تنبؤ: خطوة قطع صغيرة دلوقتي بتكفي غالبًا قبل ما تكبر. | Warning message | Moderate-state banner body | لا | Moderate state |
| TXT-0178 | افحص الرغبة دلوقتي | Button | Moderate-state CTA | لا | Moderate state |
| TXT-0179 | درجة حالتك مرتفعة في آخر فحص | Warning message | High-state banner title | لا | High state (last check risk high) |
| TXT-0180 | اللي محتاجه دلوقتي خطوة قطع واحدة — مش حل شامل. | Body | High-state banner body | لا | High state |
| TXT-0181 | عيد الفحص | Button | High-state secondary CTA | لا | High state |
| TXT-0182 | حصلت زَلّة؟ ما تكملش — نوقف هنا الأول | Link action | High-state relapse link (2 استخدام) | لا | High state, under divider ⫽ Emergency completion screen (also used on Home high state) |
| TXT-0183 | بعد اللي حصل — المهم دلوقتي: ما تكمّلش | Warning message | Post-relapse banner title | لا | Post-relapse state (recent unreviewed relapse) |
| TXT-0184 | اللي حصل مش بيمسح اللي اتعلمته — والمراجعة الهادئة تنتظرك لما تهدى. | Body | Post-relapse banner body | لا | Post-relapse state |
| TXT-0185 | الجرعة اليومية — اليوم ${metrics.daysSinceStart} | Dynamic text | Dose card header | نعم | dailyDoseEnabled = true. Example: الجرعة اليومية — اليوم 3 |
| TXT-0186 | أُنجزت اليوم ✓ | Badge | Dose card badge | لا | dailyDoseEnabled AND dose done today |
| TXT-0187 | تمّ تخطيها اليوم | Badge | Dose card badge | لا | dailyDoseEnabled AND dose skipped today |
| TXT-0188 | اعرف | Label | Dose card block title (3 استخدام) | لا | Dose card (enabled) ⫽ Always ⫽ Card dialog open |
| TXT-0189 | افعل | Label | Dose card block title (3 استخدام) | لا | Dose card (enabled) ⫽ Always ⫽ Card dialog open |
| TXT-0190 | اعرض الجرعة كاملة | Conditional button | Dose card CTA | لا | Dose card; done today |
| TXT-0191 | اقرأها دلوقتي | Conditional button | Dose card CTA | لا | Dose card; skipped today |
| TXT-0192 | ابدأ الجرعة | Conditional button | Dose card CTA | لا | Dose card; fresh |
| TXT-0193 | الخطة كاملة | Link action | Plan card link | لا | Always |
| TXT-0194 | ركيزة ${p.label} — افتح الخطة اليومية | A11y dynamic | Pillar button aria-label | نعم | Plan pillars; label injected. Example: ركيزة العقل — افتح الخطة اليومية |
| TXT-0195 | لمحة التقدم | Heading | Progress card title | لا | Always |
| TXT-0196 | كل المؤشرات | Link action | Progress card link | لا | Always |
| TXT-0197 | رغبات تعاملت معها | Label | Stat tile label (2 استخدام) | لا | Always ⫽ Progress screen always (also Home) |
| TXT-0198 | ${metrics.urgesHandled7d} خلال آخر أسبوع | Dynamic text | Stat tile hint | نعم | Always. Example: 2 خلال آخر أسبوع |
| TXT-0199 | تدخلات مبكرة | Label | Stat tile label (2 استخدام) | لا | Always ⫽ Progress screen always (also Home) |
| TXT-0200 | خلال ٣٠ يومًا | Label | Stat tile hint | لا | Always |
| TXT-0201 | استقرار يومي | Label | Stat tile label | لا | Always |
| TXT-0202 | ${metrics.dailyStability}% | Dynamic text | Stat tile value | نعم | Always. Example: 64% |
| TXT-0203 | مراجعات مسائية / ١٤ يومًا | Label | Stat tile hint | لا | Always |
| TXT-0204 | وعي بالمحفزات | Label | Stat tile label (2 استخدام) | لا | Always ⫽ Progress screen always (also Home) |
| TXT-0205 | محفزات مختلفة رصدتها | Label | Stat tile hint | لا | Always |
| TXT-0206 | مؤشرات سلوكية للاستخدام الشخصي — ليست تشخيصًا طبيًا ولا نسبة تعافٍ. | Body | Footer disclaimer | لا | Always |
| TXT-0207 | بياناتك محفوظة على جهازك بس. | Body | Footer privacy line | لا | Always |
| TXT-0208 | ليلة هادئة | Dynamic text | Greeting (dynamic title) | نعم | Home title via greeting(); hours 0–4 |
| TXT-0209 | صباح الخير | Dynamic text | Greeting (dynamic title) | نعم | Home title; hours 5–11 |
| TXT-0210 | نهارك طيب | Dynamic text | Greeting (dynamic title) | نعم | Home title; hours 12–16 |
| TXT-0211 | مساء الخير | Dynamic text | Greeting (dynamic title) | نعم | Home title; hours 17–23 |

## 8. الجرعة اليومية (Daily Dose)

عدد النصوص الفريدة في ده القسم: **20**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0212 | ${arabicDate(new Date())} — اليوم ${metrics.daysSinceStart} · مرحلة «${stage.label}» | Dynamic text | Screen subtitle | نعم | Always. arabicDate + day count + journey stage label. Example: الأربعاء ١٧ سبتمبر — اليوم 3 · مرحلة «البدء» |
| TXT-0213 | افهم | Label | Dose block title (2 استخدام) | لا | Always ⫽ Card dialog open |
| TXT-0214 | افتكر | Label | Remember block title (2 استخدام) | لا | Always ⫽ Card dialog open |
| TXT-0215 | قراءة أعمق (اختياري) | Label | Deep reading disclosure | لا | Only cards with deep field (1 card:rl-cut-point) |
| TXT-0216 | أنجزت جرعة اليوم | Success message | Done banner | لا | status = done |
| TXT-0217 | تخطيت جرعة اليوم | Status | Skipped banner title | لا | status = skipped |
| TXT-0218 | البطاقة نفسها هنا لو حسّيت تقرأها دلوقتي — والجرعة الجديدة بانتظارك بكرة. | Body | Skipped banner body | لا | status = skipped |
| TXT-0219 | تمت الجرعة | Button | Done button | لا | status = skipped (complete-after-skip) OR fresh |
| TXT-0220 | ولا يهمك — تقدر تعدّي أي جرعة | Tooltip | Skip button title tooltip | لا | status = fresh (skip button hover/focus) |
| TXT-0221 | تخطي اليوم | Button | Skip button | لا | status = fresh |
| TXT-0222 | التخطي مش فشل — الجرعة القادمة بانتظارك، والتعافي لا بيتقاس بيوم واحد. | Body | Skip guidance | لا | status = fresh |
| TXT-0223 | اختيرت دي الجرعة بناءً على حالتك الحالية — | Body | Selection note lead | لا | Always |
| TXT-0224 | لأن سجلك يحوي زَلّة أو انتكاسة خلال ده الأسبوع، نفضّل موضوعات الزلّة والانتكاسة والعودة. | Conditional text | Selection note branch | لا | Any relapse within last 7 days |
| TXT-0225 | يومك في الرحلة ومحفزاتك الأخيرة. الرحلة تنظيم للمحتوى، لا وعدًا زمنيًا. | Conditional text | Selection note branch | لا | No relapse in last 7 days |
| TXT-0226 | جرعات سابقة | Heading | Recent doses card title | لا | At least one past dose log |
| TXT-0227 | ${d.date} · ${CATEGORY_LABELS[d.item!.category]} | Dynamic text | Recent dose meta line | نعم | Recent doses; date + category label. Example: 2025-09-21 · الزلّة والانتكاسة |
| TXT-0228 | أُنجزت | Badge | Recent dose status badge | لا | Recent dose entry with status=done |
| TXT-0229 | مُخطاة | Badge | Recent dose status badge | لا | Recent dose entry with status=skipped |
| TXT-0230 | مرحلتك الحالية: | Label | Stage note label | لا | Always; followed by stage.label — stage.description (from taxonomy JOURNEY_STAGES) |
| TXT-0231 | تصفح قاعدة المعرفة كاملة | Button | Browse knowledge CTA | لا | Always |

## 9. فحص الرغبة (Urge Check)

عدد النصوص الفريدة في ده القسم: **60**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0232 | أنا وحدي دلوقتي | Chip option | Context toggle | لا | Input phase context card |
| TXT-0233 | الوقت متأخر (بعد ١٠ مساءً) | Chip option | Context toggle | لا | Input phase context card |
| TXT-0234 | أنا في السرير | Chip option | Context toggle | لا | Input phase context card |
| TXT-0235 | بدأت أتصفح أو أدوّر بالفعل | Chip option | Context toggle | لا | Input phase context card |
| TXT-0236 | أحتاج الجهاز دلوقتي للعمل/الدراسة | Chip option | Context toggle | لا | Input phase context card; default ON when profile deviceNeeds = yes |
| TXT-0237 | بدأت الرغبة؟ افحص اللي حاصل — عشان تعرف أنسب خطوة. الرغبة إحساس، مش أمر. | Subtitle | Screen subtitle | لا | Input phase |
| TXT-0238 | ١ · شدة الرغبة | Label | Scale 1 label | لا | Input phase |
| TXT-0239 | هادئة تقريبًا | Label | Scale 1 low label | لا | Input phase |
| TXT-0240 | أقصى ما أعرفه | Label | Scale 1 high label | لا | Input phase |
| TXT-0241 | ٢ · مدى قربك من التنفيذ | Label | Scale 2 label | لا | Input phase |
| TXT-0242 | بعيد خالص | Label | Scale 2 low label | لا | Input phase |
| TXT-0243 | على وشك التنفيذ | Label | Scale 2 high label | لا | Input phase |
| TXT-0244 | ٣ · فقدان السيطرة | Label | Scale 3 label | لا | Input phase |
| TXT-0245 | أنا مسيطر بالكامل | Label | Scale 3 low label | لا | Input phase |
| TXT-0246 | بالكاد أقدر وقّف نفسي | Label | Scale 3 high label | لا | Input phase |
| TXT-0247 | السياق دلوقتي (اختياري بسه مفيد جدًا) | Label | Context card title | لا | Input phase |
| TXT-0248 | إيه اللي بدأ الموضوع؟ | Label | Trigger disclosure title (2 استخدام) | لا | Input phase trigger section ⫽ Quick log view; trigger chips from taxonomy |
| TXT-0249 | (اختياري — بيساعد في اختيار التدخل) | Helper text | Trigger disclosure hint | لا | Input phase trigger section |
| TXT-0250 | التقديرات دي منك عن لحظتك، على سلم من ١ لـ ٥ — مش قياس طبي ولا تنبؤ مضمون. | Body | Input disclaimer | لا | Input phase |
| TXT-0251 | اعرف أنسب خطوة | Button | Compute CTA | لا | Input phase; disabled until all 3 scales chosen |
| TXT-0252 | اختار درجتك في الأسئلة الثلاثة فوق الأول | Helper text | Disabled helper | لا | Input phase; scales incomplete |
| TXT-0253 | درجة حالتك دلوقتي | Label | Result header label | لا | Result phase |
| TXT-0254 | من ٥ | Dynamic text | Result score suffix | نعم | Result phase; after level number. Example: 4 من ٥ |
| TXT-0255 | أنسب خطوة دلوقتي: ${assessment.modeLabel} | Dynamic text | Result mode line | نعم | Result phase; modeLabel from risk-engine MODE_LABELS. Example: أنسب خطوة دلوقتي: تدخل سريع |
| TXT-0256 | الدرجة دي تقدير مبني على إجاباتك دلوقتي على سلم من ١ لـ ٥ — تساعدك تختار خطوتك، ومش قياس طبي ولا تنبؤ مضمون. | Body | Result disclaimer | لا | Result phase |
| TXT-0257 | ولا حاجة ملحّة دلوقتي — كمّل يومك الطبيعي. | Conditional text | Awareness note level 1 | لا | Result phase; mode=awareness AND level=1 |
| TXT-0258 | بداية بسيطة — إحساس، مش أمر. ما تطعمهاش بانتباه زايد، واكمل يومك. | Conditional text | Awareness note level 2 | لا | Result phase; mode=awareness AND level=2 |
| TXT-0259 | علامات مبكرة تستحق اليقظة | Heading | Early signs card title | لا | Result phase; mode=awareness |
| TXT-0260 | • افتكر مشاهد أو تطوير خيال | List item | Early sign bullet | لا | Result phase; mode=awareness |
| TXT-0261 | • تصفح بلا هدف أو «نظرة سريعة» | List item | Early sign bullet | لا | Result phase; mode=awareness |
| TXT-0262 | • التقاط الهاتف آليًا وقت الفراغ | List item | Early sign bullet | لا | Result phase; mode=awareness |
| TXT-0263 | • البقاء في السرير بعد الاستيقاظ | List item | Early sign bullet | لا | Result phase; mode=awareness |
| TXT-0264 | اقرأ موضوعًا من قاعدة المعرفة | Button | Knowledge CTA | لا | Result phase; mode=awareness |
| TXT-0265 | الموضوع المقترح لحظتك دي: «${urgeTopic.title}» | Dynamic text | Suggested topic line | نعم | Result phase; mode=awareness AND a matching topic found. Title from knowledge data |
| TXT-0266 | فحص جديد | Button | New check button | لا | Result phase; mode=awareness |
| TXT-0267 | الرغبة بدأت بتقوى — اقطعها دلوقتي وهي لسه صغيرة: خطوة قطع واحدة تكفي غالبًا. | Conditional text | Interrupt note | لا | Result phase; mode=interrupt |
| TXT-0268 | قربت من التصرف؟ ما تحللش دلوقتي — ابدأ التدخل فورًا. | Conditional text | Immediate note | لا | Result phase; mode=immediate |
| TXT-0269 | صوت التفاوض يهمس؟ افتح الردود الجاهزة | Label | Anti-rationalization toggle | لا | Result phase; mode=interrupt or immediate |
| TXT-0270 | ابدأ التدخل المقترح دلوقتي | Button | Intervention CTA | لا | Result phase; mode=interrupt or immediate |
| TXT-0271 | ابدأ وضع الطوارئ بدلًا منه | Button | Emergency alternative CTA | لا | Result phase; mode=interrupt or immediate |
| TXT-0272 | أزمة فورية — ما تقراش أكتر. | Conditional text | Maximum danger note bold | لا | Result phase; mode=maximum; followed by اضغط الزر وابدأ أول خطوة قطع دلوقتي. |
| TXT-0273 | اضغط الزر وابدأ أول خطوة قطع دلوقتي. | Conditional text | Maximum danger note tail | لا | Result phase; mode=maximum |
| TXT-0274 | تدخّل دلوقتي — وضع الطوارئ | Button | Emergency CTA | لا | Result phase; mode=emergency or maximum |
| TXT-0275 | سنعرض لك خطوات قليلة وواضحة بس — كلما ارتفع الخطر قلّت الخيارات. | Body | Emergency mode note | لا | Result phase; mode=emergency |
| TXT-0276 | سجّلت الفحص ده بالغلط؟ امسحه من السجل | Link action | Delete check link | لا | Result phase; mode!== maximum (correction gate entry) |
| TXT-0277 | مسح الفحص ده من السجل؟ | Dialog title | Delete confirm title | لا | Delete-check confirmation dialog |
| TXT-0278 | هيتمسح من سجل الفحوصات، وخريطة المحفزات ومؤشرات تقدمك هتتحسب من تاني من غيره. ما يمسش أي حاجة تانية. | Dialog description | Delete confirm body | لا | Delete-check confirmation dialog |
| TXT-0279 | تراجع | Button | Delete confirm cancel (6 استخدام) | لا | Delete-check confirmation dialog ⫽ Delete record confirmation ⫽ Delete rule confirmation ⫽ Remove support confirmation ⫽ Wipe confirmation ⫽ Restore confirm dialog |
| TXT-0280 | نعم، امسح الفحص | Button | Delete confirm action | لا | Delete-check confirmation dialog |
| TXT-0281 | اعمل التدخل | Heading | Intervention phase title | لا | Intervention phase |
| TXT-0282 | خطوة واحدة بس — مش محتاج حل كل حاجة دلوقتي. | Subtitle | Intervention phase subtitle | لا | Intervention phase |
| TXT-0283 | تخطي إلى إعادة التقييم | Button | Skip to reassess | لا | Intervention phase |
| TXT-0284 | بعد التدخل | Heading | Outcome phase title | لا | Outcome phase |
| TXT-0285 | الخطر هبط ولا لسه؟ | Subtitle | Outcome phase subtitle | لا | Outcome phase |
| TXT-0286 | نعم، هبطت | Button | Outcome option 1 bold | لا | Outcome phase |
| TXT-0287 | ارجع ليومك — الموجة دي مسجّلة وبتتحسب ليك | Button description | Outcome option 1 desc | لا | Outcome phase |
| TXT-0288 | لا، لسه مرتفعة | Button | Outcome option 2 bold | لا | Outcome phase |
| TXT-0289 | نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام | Button description | Outcome option 2 desc | لا | Outcome phase |
| TXT-0290 | نفّذت السلوك | Button | Outcome option 3 bold | لا | Outcome phase |
| TXT-0291 | لا عقاب ولا جلد — المهم دلوقتي: ما تكمّلش | Button description | Outcome option 3 desc | لا | Outcome phase |

## 10. وضع الطوارئ (Emergency Mode)

عدد النصوص الفريدة في ده القسم: **24**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0292 | هبط الخطر — أحسنت | Heading | Completion title | لا | Emergency completion screen (after successful intervention) |
| TXT-0293 | ارجع ليومك الطبيعي. سجّلنا إنك تعاملت مع الموجة — وده بيتراكم في مؤشراتك. | Body | Completion body | لا | Emergency completion screen |
| TXT-0294 | عودة إلى يومي | Button | Completion CTA | لا | Emergency completion screen |
| TXT-0295 | تدخل أقوى | Heading | Step 3 escalated title | لا | Emergency step 3, after escalation (step counter shows 4) |
| TXT-0296 | نفّذ تدخلًا واحدًا | Heading | Step 3 title | لا | Emergency step 3 first pass |
| TXT-0297 | ${intervention.duration} · ${intervention.location} | Dynamic text | Intervention meta line | نعم | Emergency step 3; from interventions.ts. Example: ٥ دقائق · أي مكان |
| TXT-0298 | تم — الخطوة اللي بعدها | Button | Next step CTA (2 استخدام) | لا | Emergency steps 1, 2, and 3 ⫽ Stop flow steps 2-6 |
| TXT-0299 | لو تقدر فورًا: | Label | Escalated support label | لا | Emergency step 3 escalated block |
| TXT-0300 | اتصل بـ${data.supportPerson.label} | Dynamic text | Call support link (2 استخدام) | نعم | Escalated AND support person with phone saved. Example: اتصل بـأحمد ⫽ Support person saved. Example: اتصل بـأخي |
| TXT-0301 | «${SUPPORT_MESSAGE_TEMPLATES[0]}» — أرسلها لأي شخص تثق به | Dynamic text | Support template fallback | نعم | Escalated AND no support phone; template[0] from taxonomy injected |
| TXT-0302 | هبط الخطر؟ | Heading | Step 4 title | لا | Emergency step 4 (reassess) |
| TXT-0303 | نعم — هبط | Button | Reassess success option | لا | Emergency step 4 |
| TXT-0304 | لا — لسه مرتفع: جرّب تدخلًا أقوى | Button | Reassess escalate option | لا | Emergency step 4 |
| TXT-0305 | اقفل كل التبويبات والتطبيقات غير المتصلة بمهمتك — أبقِ مهمة العمل وحدها. | Conditional text | Step 1 instruction (work-safe) | لا | Emergency step 1; workSafe=true (device needed) |
| TXT-0306 | اقفل المصدر دلوقتي: التبويب، التطبيق، أو الصفحة — من غير ما تقرا سطر زيادة. | Conditional text | Step 1 instruction | لا | Emergency step 1; workSafe=false |
| TXT-0307 | اخرج من المكان لأي مكان فيه ناس أو حركة — ومش لازم تخبر حد بأي حاجة. | Body | Step 2 instruction | لا | Emergency step 2 |
| TXT-0308 | • ${s} | Dynamic text | Work-safe sub-steps | نعم | Emergency step 1 workSafe=true; WORK_SAFE_STEPS[1.4] from taxonomy injected per line |
| TXT-0309 | خروج من وضع الطوارئ | Link action | Exit link | لا | Emergency steps 1 & 2 |
| TXT-0310 | كلماتك أنت | Label | Personal why card label | لا | Step 4 (not maximum) + completion screen; only when user has why text or reason chips |
| TXT-0311 | وضع الطوارئ | A11y | Overlay aria-label | لا | Emergency overlay always (role=alertdialog) |
| TXT-0312 | ما تحللش دلوقتي. | Body | Overlay header line 1 | لا | Emergency overlay always |
| TXT-0313 | نفّذ الخطوة الحالية بس. | Body | Overlay header line 2 | لا | Emergency overlay always |
| TXT-0314 | الخطوة ${step} من 4 | Dynamic text | Step counter | نعم | Emergency overlay steps with counter. Example: الخطوة 2 من 4 |
| TXT-0315 | درجة الحالة: ${riskLevel} من ٥ ${maximum ? "— أزمة" : ""} | Dynamic text | Risk badge | نعم | Emergency overlay always. Example: درجة الحالة: 4 من ٥ / درجة الحالة: 5 من ٥ — أزمة |

## 11. توقّف هنا — الزلّة والانتكاسة (Relapse / Slip)

عدد النصوص الفريدة في ده القسم: **109**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0316 | اقفل اللي قدامك دلوقتي — مهما كان حجمه. | List item | Stop step 1 | لا | Stop flow steps |
| TXT-0317 | انهض واخرج من المكان فورًا. | List item | Stop step 2 | لا | Stop flow steps |
| TXT-0318 | متدورش على «بديل» — البديل جزء من نفس الحلقة. | List item | Stop step 3 | لا | Stop flow steps |
| TXT-0319 | ارجع لأي نشاط طبيعي — أي مهمة صغيرة ملموسة. | List item | Stop step 4 | لا | Stop flow steps |
| TXT-0320 | متعاقبش نفسك — لا إنهاك ولا حرمان ولا جلد. | List item | Stop step 5 | لا | Stop flow steps |
| TXT-0321 | التحليل بعدين لما تهدى — دلوقتي: توقف وبس. | List item | Stop step 6 | لا | Stop flow steps |
| TXT-0322 | توقفت فورًا | Chip option | Time-to-stop option | لا | Quick log; also shown as record badge |
| TXT-0323 | خلال دقائق | Chip option | Time-to-stop option | لا | Quick log; also record badge |
| TXT-0324 | أقل من ساعة | Chip option | Time-to-stop option | لا | Quick log; also record badge |
| TXT-0325 | استغرق أكثر | Chip option | Time-to-stop option | لا | Quick log; also record badge |
| TXT-0326 | إباحية | Chip option | Behavior option | لا | Quick log; record badge; detail line |
| TXT-0327 | استمناء | Chip option | Behavior option | لا | Quick log; record badge; detail line |
| TXT-0328 | زَلّة | Chip option | Classification option label | لا | Quick log; record badge; review list; detail line |
| TXT-0329 | مرة محدودة ثم توقفت عندها | Option description | Classification option desc | لا | Quick log |
| TXT-0330 | انتكاسة | Chip option | Classification option label | لا | Quick log; record badge; review list; detail line |
| TXT-0331 | حسّيت أنني عدت إلى النمط القديم | Option description | Classification option desc | لا | Quick log |
| TXT-0332 | الاثنين معًا | Dynamic text | Both behaviors label | نعم | Record badge when both behaviors recorded |
| TXT-0333 | السياق اللي حدث | Dynamic fallback | Suggested rule trigger fallback | لا | Suggested rule creation when trigger id not found |
| TXT-0334 | بدأ الأمر من ${triggerLabel} | Dynamic text | Suggested rule if-text | نعم | Suggested prevention rule; trigger label injected |
| TXT-0335 | أتدخل مبكرًا: ${rCutPoint ／／ "أغلق المصدر وأغيّر المكان فورًا"} | Dynamic text | Suggested rule then-text | نعم | Suggested prevention rule; cut point or fallback injected |
| TXT-0336 | ما تكملش — الوقفة هنا أهم خطوة. | Subtitle | Stop flow subtitle | لا | Stop flow view |
| TXT-0337 | وقّفت — الخطوة اللي بعدها | Conditional button | Stop step 1 CTA | لا | Stop flow, first step only |
| TXT-0338 | تخطي إلى التسجيل السريع | Link action | Skip to quick log | لا | Stop flow sticky bar |
| TXT-0339 | تسجيل سريع | Heading | Quick log title | لا | Quick log view |
| TXT-0340 | دقيقة واحدة — بلا تفاصيل صريحة. البيانات تصنع خريطتك. | Subtitle | Quick log subtitle | لا | Quick log view |
| TXT-0341 | ما السلوك اللي حدث؟ | Label | Quick log question 1 | لا | Quick log view |
| TXT-0342 | اختار كل اللي حصل — الاثنين معًا لو كانا معًا. | Helper text | Quick log question 1 helper | لا | Quick log view |
| TXT-0343 | إزاي توصف اللي حصل؟ | Label | Quick log question 2 | لا | Quick log view |
| TXT-0344 | تصنيفك أنت — التطبيق مش هو اللي يقرر عنك. | Helper text | Quick log question 2 helper | لا | Quick log view |
| TXT-0345 | كم استغرق التوقف؟ | Label | Quick log question 4 | لا | Quick log view |
| TXT-0346 | هل كمّلت بعد أول مرة؟ | Label | Quick log question 5 | لا | Quick log view |
| TXT-0347 | لا — وقّفت عند أولها | Chip option | Continued option | لا | Quick log view; also record badge وقّف عند حدّه |
| TXT-0348 | نعم، استمرت الجلسة | Chip option | Continued option | لا | Quick log view; also record badge |
| TXT-0349 | حفظ ومتابعة | Button | Quick log save | لا | Quick log view; disabled until all required answered |
| TXT-0350 | بعد اللي حصل: تذكير مهم | Heading | Reframe title | لا | Reframe view (after quick log save) |
| TXT-0351 | اقرأها براحة ثم عد إلى يومك. | Subtitle | Reframe subtitle | لا | Reframe view |
| TXT-0352 | اللي حصل مش بيحدد مستقبلك. | Body | Reframe truth 1 | لا | Reframe view |
| TXT-0353 | عدّاد الأيام ممكن بيبدأ تاني — بس خبرتك ما بترجعش للصفر. | Body | Reframe truth 2 | لا | Reframe view |
| TXT-0354 | اللي حصل مش يوم ضايع، ولا إذن بالتكملة — الوقفة دلوقتي قرار جديد. | Body | Reframe truth 3 | لا | Reframe view |
| TXT-0355 | اللي حصل معلومة — استخدمها في تحسين خطة الأيام الجاية. | Body | Reframe truth 4 | لا | Reframe view |
| TXT-0356 | سجّلناها كانتكاسة. الوقفة هنا — رغم كل حاجة — خطوة قائمة بذاتها، ومؤشراتك محفوظة. المراجعة الهادئة تنتظرك هنا بعد كده، لما تهدأ. | Conditional text | Reframe note (relapse) | لا | Reframe view; classification = relapse |
| TXT-0357 | سجّلناها كزَلّة — ومؤشراتك محفوظة: | Conditional text | Reframe note (slip) lead | لا | Reframe view; classification = slip |
| TXT-0358 | توقفت فورًا — استجابة ممتازة | Conditional text | Reframe note (slip) fast-stop | لا | Reframe slip AND timeToStop = immediately |
| TXT-0359 | وقفت — وكل وقفة بتتحسب ليك | Conditional text | Reframe note (slip) slow-stop | لا | Reframe slip AND timeToStop!= immediately |
| TXT-0360 | المراجعة الهادئة تنتظرك هنا بعد كده، لما تكون مستعدًا. | Conditional text | Reframe note (slip) tail | لا | Reframe slip |
| TXT-0361 | العودة إلى يومي الطبيعي | Button | Reframe primary CTA | لا | Reframe view |
| TXT-0362 | حلّل براحة دلوقتي (لو إنت مستعدًا) | Button | Reframe analyze CTA | لا | Reframe view; opens calm review |
| TXT-0363 | مراجعة هادئة | Heading | Review title | لا | Review wizard |
| TXT-0364 | الهدف مش «ليه أنا ضعيف» — الهدف: نلاقي أبكر نقطة كان ممكن توقف عندها. | Subtitle | Review subtitle | لا | Review wizard |
| TXT-0365 | ١ · إيه اللي بدأ الموضوع؟ | Label | Review step 1 | لا | Review wizard step 1; single-choice trigger chips (first 12 TRIGGERS); prefilled if quick log recorded exactly one trigger |
| TXT-0366 | ٢ · إيه اللي خلّى المقاومة أضعف يومها؟ | Label | Review step 2 | لا | Review wizard step 2; VULNERABILITY_FACTORS chips |
| TXT-0367 | ٣ · ما أول علامة ظهرت قبل السلوك؟ | Label | Review step 3 | لا | Review wizard step 3; EARLY_WARNING_SIGNS chips + free text |
| TXT-0368 | أو اكتب علامتك بأسلوبك… | Placeholder | Review step 3 placeholder | لا | Review wizard step 3 |
| TXT-0369 | ٤ · ما أول فعل قادك إلى السلوك؟ | Label | Review step 4 | لا | Review wizard step 4 |
| TXT-0370 | مثال: فتحت المتصفح وبدأت أدوّر… | Placeholder | Review step 4 placeholder | لا | Review wizard step 4 |
| TXT-0371 | ٥ · في أي لحظة كبر الأمر؟ | Label | Review step 5 | لا | Review wizard step 5 |
| TXT-0372 | مثال: بقيت في الغرفة بدل الخروج، و«دقيقة واحدة» صارت جلسة… | Placeholder | Review step 5 placeholder | لا | Review wizard step 5 |
| TXT-0373 | ٦ · فين كان يمكن التوقف مبكرًا؟ (نقطة القطع الأفضل) | Label | Review step 6 | لا | Review wizard step 6 |
| TXT-0374 | مثال: قبل فتح المتصفح — أو لحظة أول فكرة والانتقال مباشرة… | Placeholder | Review step 6 placeholder | لا | Review wizard step 6 |
| TXT-0375 | درس واحد تحفظه: | Label | Review lesson label | لا | Review wizard step 6 |
| TXT-0376 | جملة واحدة تكفي… | Placeholder | Review lesson placeholder (2 استخدام) | لا | Review wizard step 6 ⫽ Evening dialog step 2 |
| TXT-0377 | قاعدة وقاية مقترحة | Heading | Suggested rule card title | لا | Review step 6; cut point written AND rule not yet added |
| TXT-0378 | إذا بدأ الأمر من ${TRIGGERS.find((t) => t.id === rTrigger)?.label ?? "نفس السياق"} → أتدخل مبكرًا: ${rCutPoint} | Dynamic text | Suggested rule preview | نعم | Review step 6; trigger label + user cut point injected |
| TXT-0379 | نفس السياق | Dynamic fallback | Suggested rule trigger fallback | لا | Review step 6; when no trigger selected |
| TXT-0380 | أضفها إلى خطة الوقاية | Button | Add rule CTA | لا | Review step 6 |
| TXT-0381 | أُضيفت القاعدة إلى خطة الوقاية — تقدر تعدّلها هناك إمتى شئت. | Success message | Rule added confirmation | لا | Review step 6; after adding suggested rule |
| TXT-0382 | حفظ المراجعة | Button | Review save button (2 استخدام) | لا | Review wizard final step ⫽ Evening dialog final step |
| TXT-0383 | حصلت زَلّة؟ ما تكملش — إيقاف فوري، وبعدها نفهم اللي حصل براحة. | Subtitle | Main subtitle | لا | Main view |
| TXT-0384 | حصلت دلوقتي — وقّفها هنا | Button | Main CTA | لا | Main view; starts stop flow |
| TXT-0385 | مراجعات هادئة بانتظارك (${pendingReview.length}) | Dynamic text | Pending review card title | نعم | Main view; unreviewed events exist. Example: مراجعات هادئة بانتظارك (2) |
| TXT-0386 | حلّلها لما تهدأ — كل مراجعة بتحوّل اللي حصل إلى قاعدة وقاية جديدة. | Body | Pending review card body | لا | Main view; unreviewed events exist |
| TXT-0387 | مراجعة ${classificationLabel(e) ?? "ما حدث"} ${arabicDateTime(e.ts)} | Dynamic text | Pending review entry | نعم | Main view; up to 3 pending. Example: مراجعة زَلّة الأربعاء ١٧ سبتمبر ٢٠٢٥ |
| TXT-0388 | اللي حصل | Dynamic fallback | Pending review fallback | لا | Main view; event without classification |
| TXT-0389 | سرعة التوقف | Label | Stat tile label (2 استخدام) | لا | Main view always ⫽ Progress screen always (also Relapse) |
| TXT-0390 | فوري تقريبًا | Conditional text | Stat tile value | لا | avgStopMinutes < 5 |
| TXT-0391 | ~${metrics.avgStopMinutes} دقيقة | Dynamic text | Stat tile value | نعم | avgStopMinutes >= 5. Example: ~12 دقيقة |
| TXT-0392 | — | Placeholder | Stat tile empty value (2 استخدام) | لا | avgStopMinutes = null (no data) ⫽ avgStopMinutes = null |
| TXT-0393 | متوسط آخر ٣٠ يومًا | Label | Stat tile hint | لا | Main view always |
| TXT-0394 | وقّفت عند أولها | Label | Stat tile label (2 استخدام) | لا | Main view always ⫽ Progress screen always (also Relapse) |
| TXT-0395 | من ${data.relapseEvents.length} في السجل | Dynamic text | Stat tile hint | نعم | Main view always. Example: من 4 في السجل |
| TXT-0396 | سجل الزلات والانتكاسات | Heading | Records card title | لا | Main view always |
| TXT-0397 | لا سجل بعد | Empty state | Records empty state title | لا | No relapse events |
| TXT-0398 | ده مكان آمن بلا أحكام: إن حصلت زَلّة أو انتكاسة، ستجد هنا خطوة إيقاف ومراجعة هادئة. | Empty state | Records empty state body | لا | No relapse events |
| TXT-0399 | لا عقاب ولا تعويض قاسٍ بعد اللي حصل — الإنهاك والحرمان يزيدان الضيق اللي يغذي الدورة نفسها. العودة الهادئة أسرع من العقاب. | Info note | No-punishment note | لا | Main view always |
| TXT-0400 | تحديث خطة الوقاية بعد كل زَلّة أو انتكاسة | Link action | Prevention link | لا | Main view always |
| TXT-0401 | حذف السجل نهائيًا؟ | Dialog title | Delete confirm title | لا | Delete record confirmation |
| TXT-0402 | هيتمسح السجل ده${confirmDeleteEvent?.reviewed ? " والمراجعة المرتبطة بيه" : ""} نهائيًا ومش هتقدر ترجّعه. لو محتاج تشوفه بعدين، خلّيه في السجل. | Dialog description | Delete confirm body | نعم | Delete record confirmation; extra phrase when record reviewed |
| TXT-0403 | والمراجعة المرتبطة بيه | Conditional text | Delete confirm extra phrase | لا | Delete record confirmation; reviewed records only |
| TXT-0404 | نعم، احذف السجل | Button | Delete confirm action | لا | Delete record confirmation |
| TXT-0405 | استمرت الجلسة | Badge | Record badge | لا | Record row; continued = true |
| TXT-0406 | وقّف عند حدّه | Badge | Record badge | لا | Record row; continued = false |
| TXT-0407 | مُراجَع | Badge | Record badge | لا | Record row; reviewed = true |
| TXT-0408 | حلّل | Button | Analyze button | لا | Record row; unreviewed records only |
| TXT-0409 | حذف السجل | A11y | Delete button aria-label | لا | Record row always |
| TXT-0410 | إخفاء التفاصيل | Conditional button | Details toggle (open) | لا | Record row expanded |
| TXT-0411 | عرض التفاصيل | Conditional button | Details toggle (closed) | لا | Record row collapsed |
| TXT-0412 | المحفزات | Label | Detail line label | لا | Record details expanded |
| TXT-0413 | لم تُحدّد | Dynamic fallback | Detail line fallback | لا | Record details; no triggers saved |
| TXT-0414 | التصنيف | Label | Detail line label | لا | Record details; classification present |
| TXT-0415 | السلوك | Label | Detail line label | لا | Record details; behaviors present |
| TXT-0416 | التوقف | Label | Detail line label | لا | Record details always |
| TXT-0417 | مراجعتك الهادئة | Label | Review details section title | لا | Record details; review exists |
| TXT-0418 | أول علامة | Label | Detail line label | لا | Record details; review exists |
| TXT-0419 | أول فعل | Label | Detail line label | لا | Record details; review exists |
| TXT-0420 | لحظة الكبر | Label | Detail line label | لا | Record details; review exists |
| TXT-0421 | نقطة القطع الأفضل | Label | Detail line label | لا | Record details; review exists |
| TXT-0422 | درس تحفظه | Label | Detail line label | لا | Record details; review exists |
| TXT-0423 | ضعف المقاومة يومها | Label | Detail line label | لا | Record details; vulnerabilities saved |
| TXT-0424 | سجل تاريخي — ما اتراجعش بعد. زر «حلّل» يفتح المراجعة الهادئة وقت ما تكون مستعدًا. | Body | No-review note | لا | Record details; event has no review |

## 12. خطة الوقاية (Prevention)

عدد النصوص الفريدة في ده القسم: **43**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0425 | قواعد «إذا… إذن» وحمايتك الرقمية — تُصنع في الهدوء لتعمل وقت العاصفة. | Subtitle | Screen subtitle | لا | Prevention screen always |
| TXT-0426 | قواعدي «إذا… إذن» | Heading | Rules card title | لا | Prevention screen always |
| TXT-0427 | قاعدة جديدة | Button | Add rule button | لا | Prevention screen always |
| TXT-0428 | لا قواعد بعد — أضف قاعدة لأكثر سياقاتك خطورة. | Empty state | Rules empty state | لا | No prevention rules saved |
| TXT-0429 | إذا | Badge | Rule if badge | لا | Each rule row; also in add/edit dialog labels |
| TXT-0430 | إذن | Badge | Rule then badge | لا | Each rule row; also in add/edit dialog labels |
| TXT-0431 | تعديل | A11y | Edit rule aria-label (3 استخدام) | لا | Each rule row ⫽ Evening check-in saved today ⫽ Onboarding prefs card |
| TXT-0432 | حذف | A11y | Delete rule aria-label | لا | Each rule row |
| TXT-0433 | مُفعّلة | Conditional text | Rule toggle title (active) | لا | Rule row; active = true |
| TXT-0434 | موقوفة | Conditional text | Rule toggle title (inactive) | لا | Rule row; active = false |
| TXT-0435 | الحماية الرقمية (أدوات خارجية اختيارية) | Heading | Digital protection card title | لا | Prevention screen always |
| TXT-0436 | حدوده: | Label | Guide limits label | لا | Each protection guide expanded |
| TXT-0437 | لا تضبط دي الأدوات أثناء أزمة (درجة الحالة ٥) — جهّزها قبل كده في وقت هادئ. | Warning message | Crisis warning note | لا | Prevention screen always |
| TXT-0438 | شخص دعم (اختياري خالص) | Heading | Support person card title | لا | Prevention screen always |
| TXT-0439 | شخص تثق به — بيظهر زر اتصاله في التصعيد. لن يُكشف له أي حاجة تلقائيًا؛ الرسائل محايدة خالص. | Body | Support person card body | لا | Prevention screen always |
| TXT-0440 | سمّه ما شئت (أخي، صديقي…) | Placeholder | Support name placeholder | لا | Support person card |
| TXT-0441 | رقمه (يُخزن محليًا بس) | Placeholder | Support phone placeholder | لا | Support person card (LTR input) |
| TXT-0442 | تحديث | Conditional button | Save support button (existing) | لا | Support person saved |
| TXT-0443 | حفظ | Conditional button | Save support button (new) | لا | No support person saved |
| TXT-0444 | إزالة | Button | Remove support button | لا | Support person saved |
| TXT-0445 | قوالب رسائل محايدة (انسخها وقت ما محتاج): | Label | Templates label | لا | Support person card always |
| TXT-0446 | تعديل القاعدة | Dialog title | Edit rule dialog title | لا | Edit rule dialog (editing existing) |
| TXT-0447 | قاعدة وقاية جديدة | Dialog title | Add rule dialog title | لا | Add rule dialog (new rule) |
| TXT-0448 | حدث ماذا؟ | Label | If-field label | لا | Add/edit rule dialog |
| TXT-0449 | مثال: حسّيت بالملل والتقطت الهاتف بلا هدف… | Placeholder | If-field placeholder | لا | Add/edit rule dialog |
| TXT-0450 | ماذا أفعل فورًا؟ | Label | Then-field label | لا | Add/edit rule dialog |
| TXT-0451 | مثال: اقفله وأنهض وأمشي ١٠ دقائق… | Placeholder | Then-field placeholder | لا | Add/edit rule dialog |
| TXT-0452 | حفظ التعديل | Conditional button | Save edit button | لا | Edit rule dialog |
| TXT-0453 | أضف القاعدة | Conditional button | Add rule button | لا | Add rule dialog |
| TXT-0454 | حذف القاعدة؟ | Dialog title | Delete rule confirm title | لا | Delete rule confirmation |
| TXT-0455 | «${confirmDeleteRule?.ifText}» هيتمسح من خطة الوقاية نهائيًا. باقي قواعدك مش هتتأثر. | Dialog description | Delete rule confirm body | نعم | Delete rule confirmation; rule if-text injected |
| TXT-0456 | نعم، احذف القاعدة | Button | Delete rule action | لا | Delete rule confirmation |
| TXT-0457 | إزالة شخص الدعم؟ | Dialog title | Remove support confirm title | لا | Remove support confirmation |
| TXT-0458 | زر الاتصال بـ«${data.supportPerson?.label}» هيختفي من وضع الطوارئ. تقدر تضيفه تاني هنا في أي وقت. | Dialog description | Remove support confirm body | نعم | Remove support confirmation; label injected |
| TXT-0459 | نعم، أزيله | Button | Remove support action | لا | Remove support confirmation |
| TXT-0460 | حسّيت بالملل والتقطت الهاتف بلا هدف | Dynamic text | Default seeded rule if-text | نعم | Shown as rule in Prevention screen; seeded at onboarding completion |
| TXT-0461 | اقفله فورًا وأنهض من مكاني | Dynamic text | Default seeded rule then-text | نعم | Shown as rule in Prevention screen; seeded at onboarding completion |
| TXT-0462 | بدأت بالبحث عن محفز | Dynamic text | Default seeded rule if-text | نعم | Prevention screen; seeded rule 2 |
| TXT-0463 | اقفل المتصفح وأغيّر المكان | Dynamic text | Default seeded rule then-text | نعم | Prevention screen; seeded rule 2 |
| TXT-0464 | وصلت درجة الرغبة ٣ من ٥ | Dynamic text | Default seeded rule if-text | نعم | Prevention screen; seeded rule 3 |
| TXT-0465 | أبدأ خطوة قطع فورًا | Dynamic text | Default seeded rule then-text | نعم | Prevention screen; seeded rule 3 |
| TXT-0466 | كنت وحدي ليلًا وبدأت الرغبة | Dynamic text | Default seeded rule if-text | نعم | Prevention screen; seeded rule 4 |
| TXT-0467 | أخرج من الغرفة | Dynamic text | Default seeded rule then-text | نعم | Prevention screen; seeded rule 4 |

## 13. خريطة المحفزات (Trigger Map)

عدد النصوص الفريدة في ده القسم: **26**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0468 | «المحفز» هو ما بدأ الموجة عادة — الملل، التصفح، التأخير… أنماطك تُرسم من سجلك تلقائيًا مع كل فحص رغبة. | Subtitle | Screen subtitle (cold) | لا | Fewer than 3 logged events |
| TXT-0469 | نحتاج قليلًا من السجل أولًا | Empty state | Empty state title | لا | Fewer than 3 logged events |
| TXT-0470 | سجّل ٣–٤ فحوصات رغبة (حتى الخفيف منها) وسيبدأ التطبيق برسم أنماطك: أكثر المحفزات، أخطر الأوقات، ونقطة التدخل الأفضل. | Empty state | Empty state body | لا | Fewer than 3 logged events |
| TXT-0471 | الغرض ليس تسجيل التاريخ — بل اكتشاف أبكر نقطة تدخل في سلسلتك. | Info note | Cold note | لا | Fewer than 3 logged events |
| TXT-0472 | أنماطك المكتشفة — الهدف: أبكر نقطة تقدر توقف عندها. | Subtitle | Screen subtitle (warm) | لا | 3+ logged events |
| TXT-0473 | نمطك الأخطر (${insights.topPattern.count} مرة) | Dynamic text | Top pattern title | نعم | 3+ events AND topPattern computed. Example: نمطك الأخطر (5 مرة) |
| TXT-0474 | أول علامة عادة: | Label | First sign label | لا | Top pattern AND firstSign exists |
| TXT-0475 | نقطة التدخل الأفضل: | Label | Best cut point label | لا | Top pattern AND bestCutPoint exists |
| TXT-0476 | أنجز مراجعة هادئة لسجل واحد، وستظهر هنا «نقطة التدخل الأفضل» في نمطك. | Body | No cut point hint | لا | Top pattern AND no bestCutPoint |
| TXT-0477 | توزيع أوقات الخطر | Heading | Time distribution title | لا | 3+ events always |
| TXT-0478 | أكثر وقت محتاج حماية: | Label | Most risky time label | لا | mostRiskyTime exists; followed by bucket label + fixed text |
| TXT-0479 | خطّط له مبكرًا (قواعد «إذا… إذن» وبروتوكول الليل). | Body | Most risky time tail | لا | mostRiskyTime exists |
| TXT-0480 | محفزاتك الأكثر تكرارًا | Heading | Frequencies title | لا | 3+ events always |
| TXT-0481 | لم تسجل محفزات في فحوصاتك بعد. | Empty state | Frequencies empty | لا | No triggers recorded in checks |
| TXT-0482 | أكثر محفز متكرر: | Label | Top trigger label | لا | topTrigger exists; followed by label (count مرة) |
| TXT-0483 | أقوى تدخل له عادة: تغيير البيئة فور ظهوره — قبل أي تفاوض داخلي. | Body | Top trigger tail | لا | topTrigger exists |
| TXT-0484 | أحسن تدخل عندك: | Label | Best intervention label | لا | bestIntervention exists; followed by name (نجح N مرة) |
| TXT-0485 | النظام سيرجّحه تلقائيًا في المقترحات. | Body | Best intervention tail | لا | bestIntervention exists |
| TXT-0486 | دي أنماط سلوكية مرصودة من سجلك — وليست تشخيصًا. الهدف العملي: أبكر نقطة تقدر توقف عندها. | Info note | Footer disclaimer | لا | 3+ events always |
| TXT-0487 | الصباح (٥ص–١٢م) | Label | Time bucket label | لا | Trigger map time distribution + most risky time insight |
| TXT-0488 | بعد الظهر (١٢م–٥م) | Label | Time bucket label | لا | Trigger map time distribution + insights |
| TXT-0489 | المساء (٥م–١٠م) | Label | Time bucket label | لا | Trigger map time distribution + insights |
| TXT-0490 | الليل المتأخر (١٠م–٥ص) | Label | Time bucket label | لا | Trigger map time distribution + insights |
| TXT-0491 | الوحدة | Dynamic text | Pattern part label | نعم | topPattern parts chips when alone context recorded |
| TXT-0492 | السرير | Dynamic text | Pattern part label | نعم | topPattern parts chips when inBed context recorded |
| TXT-0493 | التصفح المتشعب | Dynamic text | Pattern part label | نعم | topPattern parts chips when browsingStarted context recorded |

## 14. الخطة اليومية (Daily Plan)

عدد النصوص الفريدة في ده القسم: **81**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0494 | مشي ١٠ دقائق | Chip option | Body choice | لا | Body section choices |
| TXT-0495 | مشي ٢٠ دقيقة | Chip option | Body choice | لا | Body section choices |
| TXT-0496 | تمرين منزلي | Chip option | Body choice | لا | Body section choices |
| TXT-0497 | تمرين رياضي | Chip option | Body choice | لا | Body section choices |
| TXT-0498 | دراجة/جري | Chip option | Body choice | لا | Body section choices |
| TXT-0499 | تمدد | Chip option | Body choice | لا | Body section choices |
| TXT-0500 | الحد الأدنى | Option | Day mode label | لا | Day mode selector |
| TXT-0501 | يوم صعب؟ أربع ركائز بس — يكفي | Option description | Day mode desc | لا | Day mode selector |
| TXT-0502 | قياسي | Option | Day mode label | لا | Day mode selector (default) |
| TXT-0503 | اليوم المتوازن الكامل | Option description | Day mode desc | لا | Day mode selector |
| TXT-0504 | إضافي | Option | Day mode label | لا | Day mode selector |
| TXT-0505 | طاقة عالية؟ أضف بناءً أكثر | Option description | Day mode desc | لا | Day mode selector |
| TXT-0506 | الصباح | List item | Section title | لا | Standard/extra modes |
| TXT-0507 | انهض مبكرًا بما يكفي · لا تصفح في أول ٣٠ دقيقة · حدّد مهمة اليوم | Body | Section body | لا | Standard/extra modes |
| TXT-0508 | مهمة اليوم المهمة | List item | Section title | لا | All modes |
| TXT-0509 | اختار مهمة واحدة بس — وابدأ بأصغر خطوة فيها | Dynamic fallback | Section body fallback | لا | When no purpose task written |
| TXT-0510 | الجسد: حركة | List item | Section title | لا | All modes |
| TXT-0511 | ١٠–٣٠ دقيقة حركة مناسبة لك | Dynamic fallback | Section body fallback | لا | When no body choice selected |
| TXT-0512 | انتباه: جلسة تركيز | List item | Section title | لا | Standard/extra modes |
| TXT-0513 | ١٠–٢٠ دقيقة عمل/دراسة/قراءة — بعيدًا عن السرير | Body | Section body | لا | Standard/extra modes |
| TXT-0514 | نظافة رقمية | List item | Section title | لا | Standard/extra modes |
| TXT-0515 | لا استخدام بلا هدف · الهاتف برا السرير · مراجعة سريعة لحاجزاتك | Body | Section body | لا | Standard/extra modes |
| TXT-0516 | تواصل | List item | Section title | لا | All modes |
| TXT-0517 | جلسة مع الأهل أو مكالمة صديق — حضور حقيقي واحد يكفي | Body | Section body | لا | All modes |
| TXT-0518 | بروتوكول الليل | List item | Section title | لا | Standard/extra modes |
| TXT-0519 | آخر ٣٠–٦٠ دقيقة: لا شاشات · جهّز الغد · اهدأ ثم نم | Body | Section body | لا | Standard/extra modes |
| TXT-0520 | جلسة تركيز ثانية | List item | Section title | لا | Extra mode only |
| TXT-0521 | إضافة لليوم الإضافي بس — جلسة بناء إضافية | Body | Section body | لا | Extra mode only |
| TXT-0522 | ${arabicDate(new Date())} — البناء اليومي هو التعافي الحقيقي | Dynamic text | Screen subtitle | نعم | Plan screen always. Example: الأربعاء ١٧ سبتمبر — البناء اليومي هو التعافي الحقيقي |
| TXT-0523 | توقّع اليوم: | Label | Forecast label | لا | Forecast exists (from evening check-in) |
| TXT-0524 | فعّل قواعد اليوم قبل كده | Button | Forecast CTA | لا | Forecast level = elevated |
| TXT-0525 | يوم الحد الأدنى ليس تنازلًا — إنه أذكى استجابة لليوم الصعب. يوم ناقص خير من يوم منهار. | Info note | Minimum mode note | لا | mode = minimum |
| TXT-0526 | ${progressPct}% | Dynamic text | Progress percent | نعم | Plan screen always. Example: 43% |
| TXT-0527 | اكتب مهمتك المهمة اليوم… | Placeholder | Purpose task placeholder | لا | Purpose section |
| TXT-0528 | المراجعة المسائية | Heading | Evening check-in card title (2 استخدام) | لا | Plan screen always ⫽ Evening check-in dialog open |
| TXT-0529 | أُنجزت الليلة ✓ — شكرًا لصدقك | Conditional text | Check-in done subtitle | لا | checkedInToday = true |
| TXT-0530 | ٥ أسئلة قصيرة + توقّع الغد | Conditional text | Check-in pending subtitle | لا | checkedInToday = false |
| TXT-0531 | لا تسعَ للكمال: فقدان بند واحد لا يفسد اليوم — والتخطي مش فشل، بل حكمة اليوم الصعب. كمّل ما تقدر وواصل. | Info note | Footer note | لا | Plan screen always |
| TXT-0532 | ${value}/5 | Dynamic text | Condition scale value | نعم | Evening dialog step 3 scales. Example: 3/5 |
| TXT-0533 | ${label} ${n} | A11y dynamic | Condition scale aria-label | نعم | Evening dialog step 3 scale buttons. Example: مستوى التوتر اليوم؟ 4 |
| TXT-0534 | ١ · أعلى رغبة اليوم؟ | Label | Check-in Q1 | لا | Evening dialog step 1 |
| TXT-0535 | ${highestUrge}/5 | Dynamic text | Check-in Q1 value | نعم | Evening dialog step 1. Example: 2/5 |
| TXT-0536 | أعلى رغبة اليوم | A11y | Q1 radiogroup aria-label | لا | Evening dialog step 1 |
| TXT-0537 | أعلى رغبة اليوم: ${n} من ٥ | A11y dynamic | Q1 radio aria-label | نعم | Evening dialog step 1. Example: أعلى رغبة اليوم: 3 من ٥ |
| TXT-0538 | بالكاد وجدت | Label | Q1 low label | لا | Evening dialog step 1 |
| TXT-0539 | أقصى ما وصلت له | Label | Q1 high label | لا | Evening dialog step 1 |
| TXT-0540 | ٢ · المحفز الرئيسي اليوم؟ | Label | Check-in Q2 | لا | Evening dialog step 1; first 10 TRIGGERS chips |
| TXT-0541 | ٣ · هل استخدمت تدخلًا؟ | Label | Check-in Q3 | لا | Evening dialog step 1 |
| TXT-0542 | لا، لم أحتج | Chip option | Q3 option | لا | Evening dialog step 1 |
| TXT-0543 | نعم — ونجح | Chip option | Q3 option | لا | Evening dialog step 1 |
| TXT-0544 | نعم — جزئيًا | Chip option | Q3 option | لا | Evening dialog step 1 |
| TXT-0545 | لم أفكر فيه | Chip option | Q3 option | لا | Evening dialog step 1 |
| TXT-0546 | ٤ · درس واحد من اليوم؟ | Label | Check-in Q4 | لا | Evening dialog step 2 |
| TXT-0547 | ٥ · تغيير واحد للغد؟ | Label | Check-in Q5 | لا | Evening dialog step 2 |
| TXT-0548 | مثال: الهاتف يبيت برا الغرفة… | Placeholder | Q5 placeholder | لا | Evening dialog step 2 |
| TXT-0549 | ظروف الغد (لتوقّع الغد — مش تنبؤ، بل استعدادًا) | Label | Check-in conditions title | لا | Evening dialog step 3 |
| TXT-0550 | إزاي كان نومك الليلة الماضية؟ | Label | Condition scale label | لا | Evening dialog step 3 |
| TXT-0551 | سيئ جدًا | Label | Sleep low label | لا | Evening dialog step 3 |
| TXT-0552 | ممتاز | Label | Sleep high label | لا | Evening dialog step 3 |
| TXT-0553 | مستوى التوتر اليوم؟ | Label | Condition scale label | لا | Evening dialog step 3 |
| TXT-0554 | هادئ | Label | Stress low label | لا | Evening dialog step 3 |
| TXT-0555 | مرتفع جدًا | Label | Stress high label | لا | Evening dialog step 3 |
| TXT-0556 | الوحدة اليوم؟ | Label | Condition scale label | لا | Evening dialog step 3 |
| TXT-0557 | متصل بالناس | Label | Loneliness low label | لا | Evening dialog step 3 |
| TXT-0558 | منعزل | Label | Loneliness high label | لا | Evening dialog step 3 |
| TXT-0559 | كم الوقت الحر غير المنظم؟ | Label | Condition scale label | لا | Evening dialog step 3 |
| TXT-0560 | مفيش | Label | Free time low label | لا | Evening dialog step 3 |
| TXT-0561 | كثير جدًا | Label | Free time high label | لا | Evening dialog step 3 |
| TXT-0562 | صراحتك هنا هي ما يجعل خريطتك وتوقعاتك دقيقة — البيانات تبقى على جهازك. | Body | Check-in privacy note | لا | Evening dialog always |
| TXT-0563 | المحفز الرئيسي | Label | Read view label | لا | Evening read view; mainTrigger saved |
| TXT-0564 | التدخل | Label | Read view label | لا | Evening read view; interventionUsed saved |
| TXT-0565 | أعلى رغبة | Label | Read view label | لا | Evening read view always |
| TXT-0566 | ${checkIn.highestUrge} من ٥ | Dynamic text | Read view value | نعم | Evening read view. Example: 2 من ٥ |
| TXT-0567 | درس اليوم | Label | Read view label | لا | Evening read view; lesson saved |
| TXT-0568 | تغيير الغد | Label | Read view label | لا | Evening read view; changeTomorrow saved |
| TXT-0569 | إخفاء مراجعة الليلة | Conditional button | Read view toggle (open) | لا | Evening read view expanded |
| TXT-0570 | عرض ما كتبته الليلة | Conditional button | Read view toggle (closed) | لا | Evening read view collapsed (check-in saved today) |
| TXT-0571 | ظروف الغد المسجلة: نوم ${checkIn.sleepQuality}/٥ · توتر ${checkIn.stress}/٥ · وحدة ${checkIn.loneliness}/٥ · وقت حر ${checkIn.freeTime}/٥ — منها يُبنى توقّع الغد. | Dynamic text | Read view conditions line | نعم | Evening read view always. Example: ظروف الغد المسجلة: نوم 3/٥ · توتر 4/٥ · وحدة 2/٥ · وقت حر 3/٥ — منها يُبنى توقّع الغد |
| TXT-0572 | اليوم قد محتاج إلى استعداد إضافي — نمت قليلًا أو ضغط أعلى من معتادك. فعّل قواعدك الليلية مبكرًا. | Conditional text | Forecast message (elevated) | لا | Plan screen forecast; check-in load >= 11 |
| TXT-0573 | اليوم متوسط الحمل — التزم بالحد الأدنى من خطتك وحافظ على روتين الليل. | Conditional text | Forecast message (moderate) | لا | Plan screen forecast; load 7–10 |
| TXT-0574 | ظروفك اليوم مريحة نسبيًا — فرصة جيدة لإنجاز جلسة تركيز واحدة إضافية. | Conditional text | Forecast message (low) | لا | Plan screen forecast; load < 7 |

## 15. التقدم (Progress)

عدد النصوص الفريدة في ده القسم: **43**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0575 | مؤشرات متعددة صادقة — لا نسبة تعافٍ زائفة، ولا يوم يعود إلى الصفر. | Subtitle | Screen subtitle | لا | Progress screen always |
| TXT-0576 | رحلة اليوم | Label | Journey card label | لا | Progress screen always |
| TXT-0577 | اليوم ${m.daysSinceStart} | Dynamic text | Day counter | نعم | Progress screen always. Example: اليوم 3 |
| TXT-0578 | المرحلة | Label | Stage label | لا | Progress screen always; value from JOURNEY_STAGES |
| TXT-0579 | تثبيت | Label | Stepper start label | لا | Progress screen always |
| TXT-0580 | المدى الطويل | Label | Stepper end label | لا | Progress screen always |
| TXT-0581 | أيام منذ آخر زَلّة | Label | Stat tile label | لا | Progress screen always |
| TXT-0582 | مؤشر واحد من ضمن المؤشرات | Label | Stat tile hint | لا | Progress screen always |
| TXT-0583 | مراجعات متتالية | Label | Stat tile label | لا | Progress screen always |
| TXT-0584 | ${m.checkInStreak} يوم | Dynamic text | Stat tile value | نعم | Progress screen always. Example: 4 يوم |
| TXT-0585 | مراجعات مسائية متتابعة | Label | Stat tile hint | لا | Progress screen always |
| TXT-0586 | مؤشرات المهارات | Heading | Card title | لا | Progress screen always |
| TXT-0587 | ${m.urgesHandled7d} خلال آخر ٧ أيام | Dynamic text | Stat tile hint | نعم | Progress screen always. Example: 2 خلال آخر ٧ أيام |
| TXT-0588 | عند درجة ٣ أو أقل — خلال ٣٠ يومًا | Label | Stat tile hint | لا | Progress screen always |
| TXT-0589 | جلسات وقّفتها مبكرًا | Label | Stat tile label | لا | Progress screen always |
| TXT-0590 | توقفت خلال دقائق من السلوك | Label | Stat tile hint | لا | Progress screen always |
| TXT-0591 | سجلات لم تتحول لجلسة ممتدة | Label | Stat tile hint | لا | Progress screen always |
| TXT-0592 | مؤشرات الاستجابة والاستقرار | Heading | Card title | لا | Progress screen always |
| TXT-0593 | فوري | Conditional text | Stop speed value | لا | avgStopMinutes < 5 |
| TXT-0594 | ~${m.avgStopMinutes} د | Dynamic text | Stop speed value | نعم | avgStopMinutes >= 5. Example: ~12 د |
| TXT-0595 | أسرع من الشهر اللي فات ✓ | Conditional text | Stop trend hint (better) | لا | stopTrend = better |
| TXT-0596 | أبطأ قليلًا — راجع نقاط القطع | Conditional text | Stop trend hint (worse) | لا | stopTrend = worse |
| TXT-0597 | متوسط زمن التوقف بعد السلوك | Conditional text | Stop trend hint (neutral) | لا | stopTrend = neutral |
| TXT-0598 | تكرار السلوك | Label | Stat tile label | لا | Progress screen always |
| TXT-0599 | ${m.relapsePerWeek}/أسبوع | Dynamic text | Frequency value | نعم | relapsePerWeek!= null. Example: 1.5/أسبوع |
| TXT-0600 | منخفض عن اللي فات ✓ | Conditional text | Frequency trend hint (better) | لا | relapseTrend = better |
| TXT-0601 | مرتفع — راجع حماية أوقات الخطر | Conditional text | Frequency trend hint (worse) | لا | relapseTrend = worse |
| TXT-0602 | آخر ٤ أسابيع | Conditional text | Frequency trend hint (neutral) | لا | relapseTrend = neutral |
| TXT-0603 | محفزات مختلفة رصدتها خلال ٣٠ يومًا | Label | Stat tile hint | لا | Progress screen always |
| TXT-0604 | الاستقرار اليومي | Label | Stat tile label | لا | Progress screen always (also Home as استقرار يومي) |
| TXT-0605 | ${m.dailyStability}% | Dynamic text | Stability value | نعم | Progress screen always. Example: 64% |
| TXT-0606 | إنجاز المراجعة المسائية خلال ١٤ يومًا | Label | Stat tile hint | لا | Progress screen always |
| TXT-0607 | قراءات من سجلك | Heading | Insights card title | لا | Progress screen always |
| TXT-0608 | أكثر محفز متكرر | Label | Insight label | لا | topTrigger exists |
| TXT-0609 | ${insights.topTrigger.label} (${insights.topTrigger.count}×) | Dynamic text | Insight value | نعم | topTrigger exists. Example: الملل (5×) |
| TXT-0610 | أحسن تدخل عندك | Label | Insight label | لا | bestIntervention exists |
| TXT-0611 | ${insights.bestIntervention.name} — نجح ${insights.bestIntervention.wins} مرة | Dynamic text | Insight value | نعم | bestIntervention exists. Name from interventions.ts |
| TXT-0612 | متوسط بدء تدخلك | Label | Insight label | لا | avgRiskAtIntervention!= null |
| TXT-0613 | عند درجة ${insights.avgRiskAtIntervention} من ٥ — كلما انخفضت، كنت أسرع استجابة | Dynamic text | Insight value | نعم | avgRiskAtIntervention!= null. Example: عند درجة 3 من ٥ — كلما انخفضت، كنت أسرع استجابة |
| TXT-0614 | أكثر وقت محتاج حماية | Label | Insight label | لا | mostRiskyTime exists; value = TIME_BUCKET_LABELS |
| TXT-0615 | نمط السياق الأخطر | Label | Insight label | لا | topPattern exists; value = parts joined by + |
| TXT-0616 | سجّل كام فحص رغبة وتدخل، وهتظهر هنا قراءاتك: أحسن تدخل، أخطر وقت، وسرعة استجابتك. | Empty state | Insights empty state | لا | No topTrigger and no bestIntervention |
| TXT-0617 | كل مؤشر هنا بيعكس حاجة حقيقية في سلوكك، وتقدر تحسّنه بخطوة صغيرة — رغبة ترصدها، تدخل بدري، توقف أسرع. وحتى الزَلّة نفسها ممكن تحمل دليل تحسن: وقفت أبكر من المرة اللي قبلها. | Info note | Footer note | لا | Progress screen always |

## 16. قاعدة المعرفة — واجهة الشاشة (Knowledge UI)

عدد النصوص الفريدة في ده القسم: **10**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0618 | بطاقات قصيرة عملية مبنية على فهم السلوك — بلا مبالغة ولا مصطلحات معقدة. | Subtitle | Screen subtitle | لا | Knowledge screen always |
| TXT-0619 | للقراءة في الهدوء — وقت الشدة له أداة أسرع: «تدخّل دلوقتي» في الرئيسية. | Body | When-to-read note | لا | Knowledge screen always |
| TXT-0620 | ابحث في المعرفة… | Placeholder | Search placeholder | لا | Knowledge screen always |
| TXT-0621 | الكل (${items.length}) | Dynamic text | All-categories chip | نعم | Knowledge screen always. Example: الكل (148) or الكل (143) when spiritual OFF |
| TXT-0622 | ${c.label} (${counts.get(c.id) ?? 0}) | Dynamic text | Category chip | نعم | Knowledge screen always; category label + count injected. Spiritual chip hidden when spiritual OFF |
| TXT-0623 | لا نتائج | Empty state | Search empty state title | لا | Search yields no cards |
| TXT-0624 | جرّب كلمة أبسط أو غيّر التصنيف. | Empty state | Search empty state body | لا | Search yields no cards |
| TXT-0625 | روحي | Badge | Spiritual badge | لا | Card list; spiritual cards only (spiritual ON) |
| TXT-0626 | افتح البطاقة | Link action | Card open link | لا | Card list always |
| TXT-0627 | قراءة أعمق | Label | Card dialog deep title | لا | Card dialog open; card has deep field |

## 17. القيم والروحانيات (Values)

عدد النصوص الفريدة في ده القسم: **16**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0628 | سببك إنت — بيظهرلك في اللحظات الصعبة. المحتوى الروحي اختياري بالكامل. | Subtitle | Screen subtitle | لا | Values screen always |
| TXT-0629 | كلماتك أنت: | Label | Why card label | لا | Values screen always |
| TXT-0630 | لسه ما كتبتش سببك — اكتبه تحت؛ وهتلاقيه هنا وفي لحظاتك الصعبة. | Dynamic fallback | Why empty fallback | لا | No why text saved |
| TXT-0631 | ليه عايز التغيير؟ بكلماتي وبصياغتي… | Placeholder | Why textarea placeholder | لا | Values screen always |
| TXT-0632 | حفظ سببي | Button | Save why button | لا | Values screen always |
| TXT-0633 | حُفظ ✓ | Success message | Saved indicator | لا | ~2.5s after save |
| TXT-0634 | فيه تغيير لسه ما حُفظش — لو سبت الشاشة دلوقتي هيرجع للنص المحفوظ. | Warning message | Unsaved hint | لا | Edits differ from saved value AND not just saved |
| TXT-0635 | قيمي في جُمل | Heading | Values draft card title | لا | Values screen always |
| TXT-0636 | اكتب جملة قصيرة لكل قيمة تهمّك — القيمة غير المكتوبة إحساس عابر، والمكتوبة معيار يومي. صُغها بعمق — ستجد موضوع «القيم» في قاعدة المعرفة. | Body | Values draft card body | لا | Values screen always |
| TXT-0637 | المحتوى الروحي | Heading | Spiritual card title | لا | Values screen always |
| TXT-0638 | تفعيل المحتوى الروحي | A11y | Spiritual switch aria-label | لا | Values screen always |
| TXT-0639 | صلاة، ذكر، قراءة قرآن، تأمل، توبة وعودة — بتظهر بس لمن يفعّلها، وتُفصل خالص عن المحتوى العلمي في التطبيق. | Body | Spiritual card body | لا | Values screen always |
| TXT-0640 | قيمة ${i + 1} | Placeholder dynamic | Value name placeholder | نعم | Values draft rows. Example: قيمة 1 |
| TXT-0641 | جملتها — مثال: أحترم وقتي فلا أبيعه رخيصًا | Placeholder | Value sentence placeholder | لا | Values draft rows |
| TXT-0642 | + قيمة أخرى | Button | Add value button | لا | Values draft always |
| TXT-0643 | تُحفظ دي المسودة على جهازك تلقائيًا — تبقى هنا مهما تنقّلت أو أعدت فتح التطبيق، وما يعنيك منه انقله إلى سببك الشخصي أعلاه ليظهر في لحظاتك الصعبة. | Helper text | Draft persistence note | لا | Values draft always |

## 18. الإعدادات (Settings)

عدد النصوص الفريدة في ده القسم: **58**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0644 | خصوصيتك أولًا — كل حاجة يعمل محليًا على جهازك. | Subtitle | Screen subtitle | لا | Settings screen always |
| TXT-0645 | خصوصيتك | Heading | Privacy card title | لا | Settings screen always |
| TXT-0646 | • كل بياناتك (سجلات، مراجعات، خطة) محفوظة في متصفحك بس — لا تغادر جهازك خالص. | List item | Privacy bullet 1 | لا | Settings screen always |
| TXT-0647 | • مفيش حساب، لا تسجيل دخول، ولا خادم يستقبل أي حاجة. | List item | Privacy bullet 2 | لا | Settings screen always |
| TXT-0648 | • لا نطلب اسمك الحقيقي ولا أي تفاصيل صريحة. | List item | Privacy bullet 3 | لا | Settings screen always |
| TXT-0649 | • امسح بياناتك إمتى شئت من دي الشاشة — والمحو نهائي. | List item | Privacy bullet 4 | لا | Settings screen always |
| TXT-0650 | الرحلة | Heading | Journey card title | لا | Settings screen always |
| TXT-0651 | تعديل التاريخ لا يمس أي سجل آخر — يغيّر عدّاد الرحلة ومرحلة المحتوى بس. | Info note | Date edit note | لا | Settings screen always |
| TXT-0652 | المحتوى والدعم | Heading | Content prefs card title | لا | Settings screen always |
| TXT-0653 | جرعة تعلم يومية مخصصة على الرئيسية | Toggle description | Daily dose toggle desc | لا | Settings screen always |
| TXT-0654 | المحتوى الروحي/القيمي | Toggle | Spiritual toggle title | لا | Settings screen always |
| TXT-0655 | صلاة، ذكر، توبة — بيظهر بس عند تفعيله | Toggle description | Spiritual toggle desc | لا | Settings screen always |
| TXT-0656 | تفضيلات التهيئة | Heading | Onboarding prefs card title (2 استخدام) | لا | Settings screen always ⫽ Prefs dialog open |
| TXT-0657 | اختياراتك الأولى (الأهداف، الأوقات الصعبة، الجهاز، نوع الدعم) — تؤثر على التدخلات والجرعة المقترحة. | Body | Onboarding prefs card body | لا | Settings screen always |
| TXT-0658 | شخص الدعم | Heading | Support person card title | لا | Settings screen always |
| TXT-0659 | «${data.supportPerson.label}» — زر اتصاله بيظهر في وضع الطوارئ. | Dynamic text | Support person summary (saved) | نعم | Support person exists |
| TXT-0660 | جهة اتصال اختيارية بتظهر في التصعيد — لم تُضف بعد. | Conditional text | Support person summary (none) | لا | No support person |
| TXT-0661 | إدارته من خطة الوقاية | Button | Manage support link | لا | Settings screen always |
| TXT-0662 | المظهر | Heading | Appearance card title | لا | Settings screen always |
| TXT-0663 | ليلي هادئ | Option | Theme option | لا | Settings screen always (default dark) |
| TXT-0664 | نهاري | Option | Theme option | لا | Settings screen always |
| TXT-0665 | بياناتك ملكك | Heading | Data card title | لا | Settings screen always |
| TXT-0666 | صدّر نسخة احتياطية بصيغة JSON مقروءة، أو استورد نسختك اللي فاتة إلى أي جهاز. | Body | Data card body | لا | Settings screen always |
| TXT-0667 | تصدير البيانات | Button | Export button | لا | Settings screen always |
| TXT-0668 | نُسخ ✓ | Conditional button | Copy button (copied) | لا | ~2.5s after copying export |
| TXT-0669 | نسخ إلى الحافظة | Conditional button | Copy button | لا | Default |
| TXT-0670 | استيراد / استعادة | Button | Import button | لا | Settings screen always |
| TXT-0671 | استيراد نسخة احتياطية | Dialog title | Import dialog title | لا | Import dialog open |
| TXT-0672 | اختار ملف نسخة احتياطية سليم (.json). بنتأكد من سلامته قبل الاستبدال — ولو التحقق فشل، بياناتك الحالية هتفضل زي إيه من غير أي تغيير. | Body | Import dialog body | لا | Import dialog open |
| TXT-0673 | منطقة الحذر | Heading | Danger zone title | لا | Settings screen always |
| TXT-0674 | مسح كل البيانات المحلية | Button | Wipe button | لا | Settings screen always |
| TXT-0675 | مسح كل حاجة نهائيًا؟ | Dialog title | Wipe confirm title | لا | Wipe confirmation |
| TXT-0676 | سجلّك كله (الفحوصات، والمراجعات، والخطة، والقواعد) هيتمسح من الجهاز ده ومش هتقدر ترجّعه. صدّر نسخة احتياطية الأول لو عايز تحتفظ بيه. | Dialog description | Wipe confirm body | لا | Wipe confirmation |
| TXT-0677 | نعم، امسح كل حاجة | Button | Wipe action | لا | Wipe confirmation |
| TXT-0678 | إمتى تطلب دعمًا مهنيًا؟ | Heading | Help card title | لا | Settings screen always; WHEN_TO_SEEK_HELP items from taxonomy |
| TXT-0679 | ده التطبيق أداة مساعدة ذاتية سلوكية — مش تشخيص طبي ولا علاجًا طبيًا ولا بديلًا عن مختص. طلب المساعدة قوة، وليس اعترافًا بالفشل. | Info note | Help card note | لا | Settings screen always |
| TXT-0680 | استعادة · نسخة ${APP_VERSION} · يعمل محليًا بالكامل | Dynamic text | Version line | نعم | Settings screen always. APP_VERSION from backup.ts. Example: استعادة · نسخة 2.3.0 · يعمل محليًا بالكامل |
| TXT-0681 | يناير | Option | Month select option | لا | Journey date field month select |
| TXT-0682 | فبراير | Option | Month select option | لا | Journey date field month select |
| TXT-0683 | مارس | Option | Month select option | لا | Journey date field month select |
| TXT-0684 | أبريل | Option | Month select option | لا | Journey date field month select |
| TXT-0685 | مايو | Option | Month select option | لا | Journey date field month select |
| TXT-0686 | يونيو | Option | Month select option | لا | Journey date field month select |
| TXT-0687 | يوليو | Option | Month select option | لا | Journey date field month select |
| TXT-0688 | أغسطس | Option | Month select option | لا | Journey date field month select |
| TXT-0689 | سبتمبر | Option | Month select option | لا | Journey date field month select |
| TXT-0690 | أكتوبر | Option | Month select option | لا | Journey date field month select |
| TXT-0691 | نوفمبر | Option | Month select option | لا | Journey date field month select |
| TXT-0692 | ديسمبر | Option | Month select option | لا | Journey date field month select |
| TXT-0693 | اليوم | Label | Day field label | لا | Journey date field |
| TXT-0694 | يوم بداية الرحلة | A11y | Day select aria-label | لا | Journey date field |
| TXT-0695 | الشهر | Label | Month field label | لا | Journey date field |
| TXT-0696 | شهر بداية الرحلة | A11y | Month select aria-label | لا | Journey date field |
| TXT-0697 | السنة | Label | Year field label | لا | Journey date field |
| TXT-0698 | سنة بداية الرحلة | A11y | Year select aria-label | لا | Journey date field |
| TXT-0699 | حفظ التفضيلات | Button | Prefs save button | لا | Prefs dialog |
| TXT-0700 | التغييرات تنعكس على التدخلات والجرعة المقترحة — ومن غير ما يمس أي سجل تاني. | Helper text | Prefs dialog note | لا | Prefs dialog |
| TXT-0701 | 2.3.0 | Dynamic text | App version (APP_VERSION constant) | نعم | Displayed inside Settings version line: استعادة · نسخة 2.3.0 · يعمل محليًا بالكامل |

## 19. استعادة / استيراد نسخة احتياطية (Restore / Import)

عدد النصوص الفريدة في ده القسم: **74**

| ID | النص | النوع | المنطقة | Dynamic | الحالات |
|---|---|---|---|---|---|
| TXT-0702 | الملف كبير جدًا — ليس ملف نسخة احتياطية صالحًا. | Error message | File too large error | لا | File > 20MB picked |
| TXT-0703 | تعذر قراءة الملف — حاول تاني. | Error message | File read error | لا | File read throws |
| TXT-0704 | اختار ملف النسخة الاحتياطية (.json) | Button | File picker button | لا | Restore UI (onboarding welcome + Settings import dialog) |
| TXT-0705 | أو الصق محتوى النسخة يدويًا | Button | Paste toggle | لا | Restore UI, before paste area expanded |
| TXT-0706 | ألصق محتوى ملف JSON هنا… | Placeholder | Paste textarea placeholder | لا | Restore UI, paste mode (LTR) |
| TXT-0707 | نسخة احتياطية صالحة | Dynamic fallback | Preview card title fallback | نعم | When no file name; else file name shown (LTR technical string) |
| TXT-0708 | تاريخ التصدير: ${arabicDateTime(preview.summary.exportedAt)} | Dynamic text | Preview line | نعم | When summary.exportedAt present. arabicDateTime produces Arabic date string |
| TXT-0709 | فحوصات الرغبة: ${preview.summary.urgeChecks} | Dynamic text | Preview line | نعم | Valid backup preview; count injected |
| TXT-0710 | زلات وانتكاسات مسجلة: ${preview.summary.relapses} | Dynamic text | Preview line | نعم | Valid backup preview; count injected |
| TXT-0711 | قواعد وقاية: ${preview.summary.rules} | Dynamic text | Preview line | نعم | Valid backup preview; count injected |
| TXT-0712 | تدخلات: ${preview.summary.interventions} | Dynamic text | Preview line | نعم | Valid backup preview; count injected |
| TXT-0713 | استرجاع النسخة الاحتياطية هيستبدل بياناتك الحالية — وهنطلب تأكيدك الأول. | Warning message | Preview warning | لا | Valid backup preview AND hasExistingData |
| TXT-0714 | الملف غير صالح. | Error message | Invalid fallback | لا | Invalid backup and no specific error |
| TXT-0715 | تمت الاستعادة بنجاح | Success message | Success banner title | لا | After successful import |
| TXT-0716 | بياناتك كما كانت يوم صدّرت النسخة. اقفل دي النافذة وستجد كل حاجة في مكانه — التطبيق يعمل دلوقتي ببياناتك المستعادة. | Success message | Success banner body | لا | After successful import |
| TXT-0717 | استعادة النسخة الاحتياطية | Button | Primary restore button | لا | Restore UI; disabled until valid preview; disabled after success |
| TXT-0718 | استبدال بياناتك الحالية؟ | Dialog title | Confirm dialog title | لا | Restore attempted with existing data |
| TXT-0719 | استرجاع النسخة الاحتياطية هيستبدل بياناتك الحالية. تحب تكمل؟ | Dialog description | Confirm dialog body | لا | Restore attempted with existing data |
| TXT-0720 | نعم، استعِد النسخة | Button | Confirm dialog action | لا | Restore confirm dialog |
| TXT-0721 | سجل فحص رغبة غير صالح | Error message | Backup validation error | لا | Restore/import: urge check entry not an object |
| TXT-0722 | تاريخ/معرّف غير صالح في فحوصات الرغبة | Error message | Backup validation error | لا | Restore/import: bad id/ts in urge check |
| TXT-0723 | قيم أبعاد غير صالحة في فحوصات الرغبة | Error message | Backup validation error | لا | Restore/import: urge/proximity/control out of range |
| TXT-0724 | درجة حالة غير صالحة في فحوصات الرغبة | Error message | Backup validation error | لا | Restore/import: riskLevel out of 1–10 |
| TXT-0725 | سياق غير صالح في فحوصات الرغبة | Error message | Backup validation error | لا | Restore/import: context flags invalid |
| TXT-0726 | محفزات غير صالحة في فحوصات الرغبة | Error message | Backup validation error | لا | Restore/import: triggers not string array |
| TXT-0727 | نتيجة غير صالحة في فحوصات الرغبة | Error message | Backup validation error | لا | Restore/import: outcome value invalid |
| TXT-0728 | سجل تدخل غير صالح | Error message | Backup validation error | لا | Restore/import: intervention log not object |
| TXT-0729 | بيانات ناقصة في سجل التدخلات | Error message | Backup validation error | لا | Restore/import: intervention log missing fields |
| TXT-0730 | درجة حالة غير صالحة في سجل التدخلات | Error message | Backup validation error | لا | Restore/import: intervention riskLevel invalid |
| TXT-0731 | مصدر غير صالح في سجل التدخلات | Error message | Backup validation error | لا | Restore/import: source not urge-check/emergency |
| TXT-0732 | سجل زلّة أو انتكاسة غير صالح | Error message | Backup validation error | لا | Restore/import: relapse event not object |
| TXT-0733 | تاريخ/معرّف غير صالح في سجل الزلات والانتكاسات | Error message | Backup validation error | لا | Restore/import: bad id/ts in relapse |
| TXT-0734 | مدة توقف غير صالحة في سجل الزلات والانتكاسات | Error message | Backup validation error | لا | Restore/import: timeToStop invalid |
| TXT-0735 | قيم غير صالحة في سجل الزلات والانتكاسات | Error message | Backup validation error | لا | Restore/import: continued/quickTs invalid |
| TXT-0736 | محفزات غير صالحة في سجل الزلات والانتكاسات | Error message | Backup validation error | لا | Restore/import: triggers invalid |
| TXT-0737 | تصنيف غير صالح في سجل الزلات والانتكاسات | Error message | Backup validation error | لا | Restore/import: classification not slip/relapse |
| TXT-0738 | أنواع سلوك غير صالحة في سجل الزلات والانتكاسات | Error message | Backup validation error | لا | Restore/import: behaviors invalid |
| TXT-0739 | قاعدة وقاية غير صالحة | Error message | Backup validation error | لا | Restore/import: rule not object |
| TXT-0740 | نص قاعدة وقاية غير صالح | Error message | Backup validation error | لا | Restore/import: ifText/thenText not strings |
| TXT-0741 | حالة تفعيل غير صالحة في قواعد الوقاية | Error message | Backup validation error | لا | Restore/import: active not boolean |
| TXT-0742 | مصدر غير صالح في قواعد الوقاية | Error message | Backup validation error | لا | Restore/import: source invalid |
| TXT-0743 | تاريخ غير صالح في قواعد الوقاية | Error message | Backup validation error | لا | Restore/import: createdAt invalid |
| TXT-0744 | سجل مراجعة مسائية غير صالح | Error message | Backup validation error | لا | Restore/import: check-in not object |
| TXT-0745 | تاريخ غير صالح في المراجعات المسائية | Error message | Backup validation error | لا | Restore/import: check-in date invalid |
| TXT-0746 | قيمة رغبة غير صالحة في المراجعات المسائية | Error message | Backup validation error | لا | Restore/import: highestUrge invalid |
| TXT-0747 | حقول نصية غير صالحة في المراجعات المسائية | Error message | Backup validation error | لا | Restore/import: text fields invalid |
| TXT-0748 | مقاييس غير صالحة في المراجعات المسائية | Error message | Backup validation error | لا | Restore/import: scale values invalid |
| TXT-0749 | خطة يومية غير صالحة | Error message | Backup validation error | لا | Restore/import: plan not object |
| TXT-0750 | تاريخ غير صالح في الخطط اليومية | Error message | Backup validation error | لا | Restore/import: plan date invalid |
| TXT-0751 | نمط خطة غير صالح | Error message | Backup validation error | لا | Restore/import: mode invalid |
| TXT-0752 | حقول غير صالحة في الخطط اليومية | Error message | Backup validation error | لا | Restore/import: plan fields invalid |
| TXT-0753 | أقسام مكتملة غير صالحة في الخطط اليومية | Error message | Backup validation error | لا | Restore/import: completedSections invalid |
| TXT-0754 | سجل جرعة غير صالح | Error message | Backup validation error | لا | Restore/import: dose log not object |
| TXT-0755 | تاريخ غير صالح في سجل الجرعات | Error message | Backup validation error | لا | Restore/import: dose date invalid |
| TXT-0756 | معرّف جرعة غير صالح | Error message | Backup validation error | لا | Restore/import: itemId not string |
| TXT-0757 | حالة جرعة غير صالحة | Error message | Backup validation error | لا | Restore/import: status not done/skipped |
| TXT-0758 | تعذر قراءة الملف — تأكد أنه ملف JSON سليم غير تالف. | Error message | Backup validation error | لا | Restore/import: JSON.parse throws |
| TXT-0759 | بنية الملف غير صالحة — الملف ليس نسخة احتياطية صحيحة. | Error message | Backup validation error | لا | Restore/import: parsed value not object or missing fields |
| TXT-0760 | الملف ليس نسخة احتياطية من ده التطبيق. | Error message | Backup validation error | لا | Restore/import: app field mismatch |
| TXT-0761 | رقم إصدار النسخة الاحتياطية غير صالح. | Error message | Backup validation error | لا | Restore/import: schemaVersion not integer |
| TXT-0762 | بنية الملف غير صالحة — مفيش بيانات جوا النسخة. | Error message | Backup validation error | لا | Restore/import: data field missing |
| TXT-0763 | نسخة النسخة الاحتياطية (إصدار ${schemaVersion}) غير مدعومة — ده التطبيق يدعم الإصدار ${BACKUP_SCHEMA_VERSION}. | Error message | Backup validation error (dynamic) | نعم | Restore/import: schemaVersion!= 1. Example: نسخة النسخة الاحتياطية (إصدار 2) غير مدعومة — ده التطبيق يدعم الإصدار 1. |
| TXT-0764 | بيانات الملف الشخصي ناقصة أو تالفة. | Error message | Backup validation error | لا | Restore/import: profile invalid |
| TXT-0765 | حالة إكمال التهيئة غير صالحة في النسخة. | Error message | Backup validation error | لا | Restore/import: onboardingCompleted not boolean |
| TXT-0766 | تاريخ بداية الرحلة غير صالح في النسخة. | Error message | Backup validation error | لا | Restore/import: startDate invalid |
| TXT-0767 | قوائم التهيئة غير صالحة في النسخة. | Error message | Backup validation error | لا | Restore/import: goals/difficultTimes/patterns/buildGoals invalid |
| TXT-0768 | إعداد الجهاز غير صالح في النسخة. | Error message | Backup validation error | لا | Restore/import: deviceNeeds invalid |
| TXT-0769 | تفضيلات الدعم غير صالحة في النسخة. | Error message | Backup validation error | لا | Restore/import: supportPrefs invalid |
| TXT-0770 | السجلات اليومية غير صالحة في النسخة. | Error message | Backup validation error (2 استخدام) | لا | Restore/import: dailyLogs not object ⫽ Restore/import: dailyLogs arrays invalid (duplicate message) |
| TXT-0771 | سجلات الفحص والتدخل غير صالحة في النسخة. | Error message | Backup validation error | لا | Restore/import: urgeChecks/interventionLogs not arrays |
| TXT-0772 | سجلات الزلّة والوقاية غير صالحة في النسخة. | Error message | Backup validation error | لا | Restore/import: relapseEvents/preventionRules not arrays |
| TXT-0773 | النسخة الاحتياطية تالفة: ${err}. | Error message | Backup validation error (dynamic wrapper) | نعم | Restore/import: any entry-level validation failure; specific error appended. Example: النسخة الاحتياطية تالفة: سجل فحص رغبة غير صالح. |
| TXT-0774 | بيانات شخص الدعم غير صالحة في النسخة. | Error message | Backup validation error | لا | Restore/import: supportPerson fields invalid |
| TXT-0775 | الإعدادات غير صالحة في النسخة. | Error message | Backup validation error | لا | Restore/import: settings fields invalid |

## 20. الحوارات ونوافذ التأكيد (Dialogs / Modals / Sheets)

كل الحوارات في التطبيق (مع مقاطعها في الأقسام أعلاه):

| الحوار | مقطعه | ملاحظات |
|---|---|---|
| Sheet «كل الأقسام» (الموبايل) | القسم 5 | زر قفل sr-only «قفل» (القسم 22) |
| حوار إضافة/تعديل قاعدة «إذا… إذن» | القسم 12 | عنوانان شرطيان (قاعدة جديدة/تعديل القاعدة) + حقلان + زران شرطيان |
| حوار تأكيد حذف قاعدة وقاية | القسم 12 | تراجع / نعم، احذف القاعدة |
| حوار تأكيد إزالة شخص الدعم | القسم 12 | تراجع / نعم، أزيله |
| حوار المراجعة المسائية (3 خطوات) | القسم 14 | أزرار اللي فات/اللي بعده/حفظ المراجعة + قراءة ما كتبه الليلة |
| حوار بطاقة المعرفة | القسم 16 | أقسام اعرف/افهم/افعل/افتكر/قراءة أعمق |
| حوار تأكيد استبدال البيانات عند الاستعادة | القسم 19 | تراجع / نعم، استعِد النسخة |
| حوار استيراد نسخة احتياطية (الإعدادات) | القسم 18 + 19 | يضم مكوّن الاستعادة كاملًا |
| حوار تفضيلات التهيئة (الإعدادات) | القسم 18 | نفس أسئلة التهيئة الست + حفظ التفضيلات |
| حوار مسح كل البيانات (منطقة الحذر) | القسم 18 | تراجع / نعم، امسح كل حاجة |
| حوار تأكيد حذف سجل زلّة/انتكاسة | القسم 11 | تراجع / نعم، احذف السجل |
| حوار تأكيد مسح فحص رغبة | القسم 9 | تراجع / نعم، امسح الفحص |
| وضع الطوارئ (alertdialog ملء الشاشة) | القسم 10 | ليس حوارًا تقليديًا — طبقة كاملة بخطواتها الأربع |

**Toasts:** مكوّن الـToaster مركّب في التطبيق بس **لا يُستدعى `toast()` في أي موضع** — مفيش نصوص إشعارات منبثقة في النسخة الحالية.

## 21. الحالات: فارغة / أخطاء / نجاح / تحذير (States)

**نصوص الحالات الفارغة (Empty States):**

TXT-0397 · TXT-0398 · TXT-0428 · TXT-0469 · TXT-0470 · TXT-0481 · TXT-0616 · TXT-0623 · TXT-0624

**نصوص الأخطاء (Error States) — أغلبها أخطاء التحقق من النسخة الاحتياطية (القسم 19):**

TXT-0702 · TXT-0703 · TXT-0714 · TXT-0721 · TXT-0722 · TXT-0723 · TXT-0724 · TXT-0725 · TXT-0726 · TXT-0727 · TXT-0728 · TXT-0729 · TXT-0730 · TXT-0731 · TXT-0732 · TXT-0733 · TXT-0734 · TXT-0735 · TXT-0736 · TXT-0737 · TXT-0738 · TXT-0739 · TXT-0740 · TXT-0741 · TXT-0742 · TXT-0743 · TXT-0744 · TXT-0745 · TXT-0746 · TXT-0747 · TXT-0748 · TXT-0749 · TXT-0750 · TXT-0751 · TXT-0752 · TXT-0753 · TXT-0754 · TXT-0755 · TXT-0756 · TXT-0757 · TXT-0758 · TXT-0759 · TXT-0760 · TXT-0761 · TXT-0762 · TXT-0763 · TXT-0764 · TXT-0765 · TXT-0766 · TXT-0767 · TXT-0768 · TXT-0769 · TXT-0770 · TXT-0771 · TXT-0772 · TXT-0773 · TXT-0774 · TXT-0775

**نصوص النجاح (Success States):**

TXT-0028 · TXT-0171 · TXT-0172 · TXT-0216 · TXT-0381 · TXT-0633 · TXT-0715 · TXT-0716

**نصوص التحذير (Warning States):**

TXT-0176 · TXT-0177 · TXT-0179 · TXT-0183 · TXT-0437 · TXT-0634 · TXT-0713

**ملاحظات معلوماتية (Info Notes):**

TXT-0126 · TXT-0144 · TXT-0399 · TXT-0471 · TXT-0486 · TXT-0525 · TXT-0531 · TXT-0617 · TXT-0651 · TXT-0679

ملاحظة: كثير من نصوص الحالات موزعة جوا أقسام شاشاتها بترتيب ظهورها؛ ده القسم فهرس تجميعي سريع للمراجع اللغوي.

## 22. نصوص إمكانية الوصول (Accessibility Text)

نصوص غير ظاهرة بصريًا بسها تصل للمستخدم عبر قارئات الشاشة (aria-label / sr-only / النصوص البديلة):

| ID | النص | الموضع | الحالات |
|---|---|---|---|
| TXT-0009 | قفل | AppShell.tsx:257؛ dialog.tsx:75؛ sheet.tsx:77 | Every Dialog close button (knowledge card, plan check-in, prevention add/edit, settings import) ⫽ More sheet close button (mobile) ⫽ More sheet open |
| TXT-0012 | ${label}: ${n} من ٥ | shared.tsx:136 | For each of the 5 scale buttons; label + number injected. Example: شدة الرغبة: 3 من ٥ |
| TXT-0013 | تحسن | shared.tsx:203 | StatTile with direction=up |
| TXT-0014 | انخفاض | shared.tsx:208 | StatTile with direction=down |
| TXT-0015 | خطوة ${current + 1} من ${total} | shared.tsx:265 | Onboarding progress dots. Example: خطوة 2 من 8 |
| TXT-0019 | إيقاف مؤقت | Timer.tsx:116؛ Timer.tsx:59 | Compact countdown, running=true ⫽ Countdown running |
| TXT-0020 | تشغيل | Timer.tsx:59 | Compact countdown, running=false |
| TXT-0026 | إعادة | Timer.tsx:133 | Countdown not finished |
| TXT-0060 | التنقل الرئيسي | AppShell.tsx:132 | Desktop sidebar always |
| TXT-0062 | التنقل السفلي | AppShell.tsx:176 | Mobile bottom nav always |
| TXT-0063 | تدخل دلوقتي — وضع الطوارئ | AppShell.tsx:209 | Mobile bottom nav always |
| TXT-0065 | المزيد من الأقسام | AppShell.tsx:232 | Mobile bottom nav always |
| TXT-0194 | ركيزة ${p.label} — افتح الخطة اليومية | HomeScreen.tsx:377 | Plan pillars; label injected. Example: ركيزة العقل — افتح الخطة اليومية |
| TXT-0311 | وضع الطوارئ | EmergencyMode.tsx:434 | Emergency overlay always (role=alertdialog) |
| TXT-0409 | حذف السجل | RelapseScreen.tsx:843 | Record row always |
| TXT-0431 | تعديل | PlanScreen.tsx:375؛ PreventionScreen.tsx:137؛ SettingsScreen.tsx:509 | Each rule row ⫽ Evening check-in saved today ⫽ Onboarding prefs card |
| TXT-0432 | حذف | PreventionScreen.tsx:145 | Each rule row |
| TXT-0533 | ${label} ${n} | PlanScreen.tsx:347 | Evening dialog step 3 scale buttons. Example: مستوى التوتر اليوم؟ 4 |
| TXT-0536 | أعلى رغبة اليوم | PlanScreen.tsx:398 | Evening dialog step 1 |
| TXT-0537 | أعلى رغبة اليوم: ${n} من ٥ | PlanScreen.tsx:405 | Evening dialog step 1. Example: أعلى رغبة اليوم: 3 من ٥ |
| TXT-0638 | تفعيل المحتوى الروحي | ValuesScreen.tsx:132 | Values screen always |
| TXT-0694 | يوم بداية الرحلة | SettingsScreen.tsx:413 | Journey date field |
| TXT-0696 | شهر بداية الرحلة | SettingsScreen.tsx:431 | Journey date field |
| TXT-0698 | سنة بداية الرحلة | SettingsScreen.tsx:449 | Journey date field |

**ملاحظات وصول إضافية (بلا نصوص جديدة):** منطقة رقائق المحفزات المختارة في فحص الرغبة عليها `aria-live="polite"` فتُعلن تلقائيًا؛ أزرار السلالم الرقمية لها `role="radio"` مع `aria-checked`؛ وضع الطوارئ `role="alertdialog"` مع حصر التركيز وإخفاء الخلفية (`inert` + `aria-hidden`)؛ الهوية البصرية للشعار `aria-hidden` عمدًا لأنها دايمًا بجوار الكلمة المرئية «استعادة».

## 23. النصوص الديناميكية (Dynamic Text — القوالب ومتغيراتها)

كل نص يُركّب وقت التشغيل. القالب كإيه في الكود، والمتغيرات، ومثال عرض فعلي:

- **TXT-0012** — `${label}: ${n} من ٥`
  - المتغيرات/المصدر: For each of the 5 scale buttons; label + number injected. Example: شدة الرغبة: 3 من ٥

- **TXT-0015** — `خطوة ${current + 1} من ${total}`
  - المتغيرات/المصدر: Onboarding progress dots. Example: خطوة 2 من 8

- **TXT-0016** — `arabicDate(iso) — Intl.DateTimeFormat("ar", {weekday long, day numeric, month long})`
  - المتغيرات/المصدر: Dose/Plan subtitles, relapse pending list. Example: الأربعاء، ١٧ سبتمبر. Generated by browser Intl (locale ar), not a literal string in code

- **TXT-0017** — `arabicDateTime(iso) — Intl.DateTimeFormat("ar", {day numeric, month short, hour 2-digit, minute 2-digit})`
  - المتغيرات/المصدر: Relapse record rows, pending review entries, restore preview export date. Example: ١٧ سبتمبر، ١٠:٣٠ م. Generated by browser Intl (locale ar)

- **TXT-0018** — `${mm}:${String(ss).padStart(2, "0")}`
  - المتغيرات/المصدر: Timer display mm:ss. Example: 5:00, 0:37

- **TXT-0032** — `الخطوة اللي بعدها: ${iv.nextAction}`
  - المتغيرات/المصدر: Every intervention card; nextAction from interventions.ts injected

- **TXT-0075** — `الليل المتأخر`
  - المتغيرات/المصدر: Step 2 — also Settings editor; joined into Step 8 summary ⫽ topPattern parts chips (Trigger map + Progress) when lateNight context recorded

- **TXT-0137** — `سياقات الخطر عندك:`
  - المتغيرات/المصدر: Final step; followed by joined STEP2 labels or fallback: لم تحدد بعد — سيحددها سجلّك مع الوقت

- **TXT-0138** — `لم تحدد بعد — سيحددها سجلّك مع الوقت`
  - المتغيرات/المصدر: Final step; only when no difficult times selected

- **TXT-0155** — `من قليل`
  - المتغيرات/المصدر: Normal state + handled wave < 45 min (or no timestamps)

- **TXT-0156** — `منذ ساعة تقريبًا`
  - المتغيرات/المصدر: 45–110 min after outcome

- **TXT-0157** — `منذ ساعتين تقريبًا`
  - المتغيرات/المصدر: > 110 min (within 3h window)

- **TXT-0170** — `اليوم ${metrics.daysSinceStart} من رحلتك${metrics.daysSinceLastRelapse!= null ? ` — و${metrics.daysSinceLastRelapse} يومًا منذ آخر زَلّة` : ""}`
  - المتغيرات/المصدر: Always. Title is dynamic greeting() from helpers. Example: اليوم 3 من رحلتك — و7 يومًا منذ آخر زَلّة

- **TXT-0174** — `أحسنت — تعاملت مع موجة ${handledAgoLabel()}.`
  - المتغيرات/المصدر: Normal state; last urge outcome=handled within 3h. Label: من قليل / منذ ساعة تقريبًا / منذ ساعتين تقريبًا

- **TXT-0185** — `الجرعة اليومية — اليوم ${metrics.daysSinceStart}`
  - المتغيرات/المصدر: dailyDoseEnabled = true. Example: الجرعة اليومية — اليوم 3

- **TXT-0194** — `ركيزة ${p.label} — افتح الخطة اليومية`
  - المتغيرات/المصدر: Plan pillars; label injected. Example: ركيزة العقل — افتح الخطة اليومية

- **TXT-0198** — `${metrics.urgesHandled7d} خلال آخر أسبوع`
  - المتغيرات/المصدر: Always. Example: 2 خلال آخر أسبوع

- **TXT-0202** — `${metrics.dailyStability}%`
  - المتغيرات/المصدر: Always. Example: 64%

- **TXT-0208** — `ليلة هادئة`
  - المتغيرات/المصدر: Home title via greeting(); hours 0–4

- **TXT-0209** — `صباح الخير`
  - المتغيرات/المصدر: Home title; hours 5–11

- **TXT-0210** — `نهارك طيب`
  - المتغيرات/المصدر: Home title; hours 12–16

- **TXT-0211** — `مساء الخير`
  - المتغيرات/المصدر: Home title; hours 17–23

- **TXT-0212** — `${arabicDate(new Date())} — اليوم ${metrics.daysSinceStart} · مرحلة «${stage.label}»`
  - المتغيرات/المصدر: Always. arabicDate + day count + journey stage label. Example: الأربعاء ١٧ سبتمبر — اليوم 3 · مرحلة «البدء»

- **TXT-0227** — `${d.date} · ${CATEGORY_LABELS[d.item!.category]}`
  - المتغيرات/المصدر: Recent doses; date + category label. Example: 2025-09-21 · الزلّة والانتكاسة

- **TXT-0254** — ` من ٥`
  - المتغيرات/المصدر: Result phase; after level number. Example: 4 من ٥

- **TXT-0255** — `أنسب خطوة الآن: ${assessment.modeLabel}`
  - المتغيرات/المصدر: Result phase; modeLabel from risk-engine MODE_LABELS. Example: أنسب خطوة دلوقتي: تدخل سريع

- **TXT-0265** — `الموضوع المقترح لحظتك دي: «${urgeTopic.title}»`
  - المتغيرات/المصدر: Result phase; mode=awareness AND a matching topic found. Title from knowledge data

- **TXT-0297** — `${intervention.duration} · ${intervention.location}`
  - المتغيرات/المصدر: Emergency step 3; from interventions.ts. Example: ٥ دقائق · أي مكان

- **TXT-0300** — `اتصل بـ${data.supportPerson.label}`
  - المتغيرات/المصدر: Escalated AND support person with phone saved. Example: اتصل بـأحمد ⫽ Support person saved. Example: اتصل بـأخي

- **TXT-0301** — `«${SUPPORT_MESSAGE_TEMPLATES[0]}» — أرسلها لأي شخص تثق به`
  - المتغيرات/المصدر: Escalated AND no support phone; template[0] from taxonomy injected

- **TXT-0308** — `• ${s}`
  - المتغيرات/المصدر: Emergency step 1 workSafe=true; WORK_SAFE_STEPS[1.4] from taxonomy injected per line

- **TXT-0314** — `الخطوة ${step} من 4`
  - المتغيرات/المصدر: Emergency overlay steps with counter. Example: الخطوة 2 من 4

- **TXT-0315** — `درجة الحالة: ${riskLevel} من ٥ ${maximum ? "— أزمة" : ""}`
  - المتغيرات/المصدر: Emergency overlay always. Example: درجة الحالة: 4 من ٥ / درجة الحالة: 5 من ٥ — أزمة

- **TXT-0332** — `الاثنين معًا`
  - المتغيرات/المصدر: Record badge when both behaviors recorded

- **TXT-0334** — `بدأ الأمر من ${triggerLabel}`
  - المتغيرات/المصدر: Suggested prevention rule; trigger label injected

- **TXT-0335** — `أتدخل مبكرًا: ${rCutPoint || "أغلق المصدر وأغيّر المكان فورًا"}`
  - المتغيرات/المصدر: Suggested prevention rule; cut point or fallback injected

- **TXT-0378** — `إذا بدأ الأمر من ${TRIGGERS.find((t) => t.id === rTrigger)?.label ?? "نفس السياق"} → أتدخل مبكرًا: ${rCutPoint}`
  - المتغيرات/المصدر: Review step 6; trigger label + user cut point injected

- **TXT-0385** — `مراجعات هادئة بانتظارك (${pendingReview.length})`
  - المتغيرات/المصدر: Main view; unreviewed events exist. Example: مراجعات هادئة بانتظارك (2)

- **TXT-0387** — `مراجعة ${classificationLabel(e) ?? "ما حدث"} ${arabicDateTime(e.ts)}`
  - المتغيرات/المصدر: Main view; up to 3 pending. Example: مراجعة زَلّة الأربعاء ١٧ سبتمبر ٢٠٢٥

- **TXT-0391** — `~${metrics.avgStopMinutes} دقيقة`
  - المتغيرات/المصدر: avgStopMinutes >= 5. Example: ~12 دقيقة

- **TXT-0395** — `من ${data.relapseEvents.length} في السجل`
  - المتغيرات/المصدر: Main view always. Example: من 4 في السجل

- **TXT-0402** — `هيتمسح السجل ده${confirmDeleteEvent?.reviewed ? " والمراجعة المرتبطة بيه" : ""} نهائيًا ومش هتقدر ترجّعه. لو محتاج تشوفه بعدين، خلّيه في السجل.`
  - المتغيرات/المصدر: Delete record confirmation; extra phrase when record reviewed

- **TXT-0455** — `«${confirmDeleteRule?.ifText}» هيتمسح من خطة الوقاية نهائيًا. باقي قواعدك مش هتتأثر.`
  - المتغيرات/المصدر: Delete rule confirmation; rule if-text injected

- **TXT-0458** — `زر الاتصال بـ«${data.supportPerson?.label}» هيختفي من وضع الطوارئ. تقدر تضيفه من جديد هنا في أي وقت.`
  - المتغيرات/المصدر: Remove support confirmation; label injected

- **TXT-0460** — `شعرت بالملل والتقطت الهاتف بلا هدف`
  - المتغيرات/المصدر: Shown as rule in Prevention screen; seeded at onboarding completion

- **TXT-0461** — `أغلقه فورًا وأنهض من مكاني`
  - المتغيرات/المصدر: Shown as rule in Prevention screen; seeded at onboarding completion

- **TXT-0462** — `بدأت بالبحث عن محفز`
  - المتغيرات/المصدر: Prevention screen; seeded rule 2

- **TXT-0463** — `أغلق المتصفح وأغيّر المكان`
  - المتغيرات/المصدر: Prevention screen; seeded rule 2

- **TXT-0464** — `وصلت درجة الرغبة ٣ من ٥`
  - المتغيرات/المصدر: Prevention screen; seeded rule 3

- **TXT-0465** — `أبدأ خطوة قطع فورًا`
  - المتغيرات/المصدر: Prevention screen; seeded rule 3

- **TXT-0466** — `كنت وحدي ليلًا وبدأت الرغبة`
  - المتغيرات/المصدر: Prevention screen; seeded rule 4

- **TXT-0467** — `أخرج من الغرفة`
  - المتغيرات/المصدر: Prevention screen; seeded rule 4

- **TXT-0473** — `نمطك الأخطر (${insights.topPattern.count} مرة)`
  - المتغيرات/المصدر: 3+ events AND topPattern computed. Example: نمطك الأخطر (5 مرة)

- **TXT-0491** — `الوحدة`
  - المتغيرات/المصدر: topPattern parts chips when alone context recorded

- **TXT-0492** — `السرير`
  - المتغيرات/المصدر: topPattern parts chips when inBed context recorded

- **TXT-0493** — `التصفح المتشعب`
  - المتغيرات/المصدر: topPattern parts chips when browsingStarted context recorded

- **TXT-0522** — `${arabicDate(new Date())} — البناء اليومي هو التعافي الحقيقي`
  - المتغيرات/المصدر: Plan screen always. Example: الأربعاء ١٧ سبتمبر — البناء اليومي هو التعافي الحقيقي

- **TXT-0526** — `${progressPct}%`
  - المتغيرات/المصدر: Plan screen always. Example: 43%

- **TXT-0532** — `${value}/5`
  - المتغيرات/المصدر: Evening dialog step 3 scales. Example: 3/5

- **TXT-0533** — `${label} ${n}`
  - المتغيرات/المصدر: Evening dialog step 3 scale buttons. Example: مستوى التوتر اليوم؟ 4

- **TXT-0535** — `${highestUrge}/5`
  - المتغيرات/المصدر: Evening dialog step 1. Example: 2/5

- **TXT-0537** — `أعلى رغبة اليوم: ${n} من ٥`
  - المتغيرات/المصدر: Evening dialog step 1. Example: أعلى رغبة اليوم: 3 من ٥

- **TXT-0566** — `${checkIn.highestUrge} من ٥`
  - المتغيرات/المصدر: Evening read view. Example: 2 من ٥

- **TXT-0571** — `ظروف الغد المسجلة: نوم ${checkIn.sleepQuality}/٥ · توتر ${checkIn.stress}/٥ · وحدة ${checkIn.loneliness}/٥ · وقت حر ${checkIn.freeTime}/٥ — منها يُبنى توقّع الغد.`
  - المتغيرات/المصدر: Evening read view always. Example: ظروف الغد المسجلة: نوم 3/٥ · توتر 4/٥ · وحدة 2/٥ · وقت حر 3/٥ — منها يُبنى توقّع الغد

- **TXT-0577** — `اليوم ${m.daysSinceStart}`
  - المتغيرات/المصدر: Progress screen always. Example: اليوم 3

- **TXT-0584** — `${m.checkInStreak} يوم`
  - المتغيرات/المصدر: Progress screen always. Example: 4 يوم

- **TXT-0587** — `${m.urgesHandled7d} خلال آخر ٧ أيام`
  - المتغيرات/المصدر: Progress screen always. Example: 2 خلال آخر ٧ أيام

- **TXT-0594** — `~${m.avgStopMinutes} د`
  - المتغيرات/المصدر: avgStopMinutes >= 5. Example: ~12 د

- **TXT-0599** — `${m.relapsePerWeek}/أسبوع`
  - المتغيرات/المصدر: relapsePerWeek!= null. Example: 1.5/أسبوع

- **TXT-0605** — `${m.dailyStability}%`
  - المتغيرات/المصدر: Progress screen always. Example: 64%

- **TXT-0609** — `${insights.topTrigger.label} (${insights.topTrigger.count}×)`
  - المتغيرات/المصدر: topTrigger exists. Example: الملل (5×)

- **TXT-0611** — `${insights.bestIntervention.name} — نجح ${insights.bestIntervention.wins} مرة`
  - المتغيرات/المصدر: bestIntervention exists. Name from interventions.ts

- **TXT-0613** — `عند درجة ${insights.avgRiskAtIntervention} من ٥ — كلما انخفضت، كنت أسرع استجابة`
  - المتغيرات/المصدر: avgRiskAtIntervention!= null. Example: عند درجة 3 من ٥ — كلما انخفضت، كنت أسرع استجابة

- **TXT-0621** — `الكل (${items.length})`
  - المتغيرات/المصدر: Knowledge screen always. Example: الكل (148) or الكل (143) when spiritual OFF

- **TXT-0622** — `${c.label} (${counts.get(c.id) ?? 0})`
  - المتغيرات/المصدر: Knowledge screen always; category label + count injected. Spiritual chip hidden when spiritual OFF

- **TXT-0640** — `قيمة ${i + 1}`
  - المتغيرات/المصدر: Values draft rows. Example: قيمة 1

- **TXT-0659** — `«${data.supportPerson.label}» — زر اتصاله يظهر في وضع الطوارئ.`
  - المتغيرات/المصدر: Support person exists

- **TXT-0680** — `استعادة · نسخة ${APP_VERSION} · يعمل محليًا بالكامل`
  - المتغيرات/المصدر: Settings screen always. APP_VERSION from backup.ts. Example: استعادة · نسخة 2.3.0 · يعمل محليًا بالكامل

- **TXT-0701** — `2.3.0`
  - المتغيرات/المصدر: Displayed inside Settings version line: استعادة · نسخة 2.3.0 · يعمل محليًا بالكامل

- **TXT-0707** — `نسخة احتياطية صالحة`
  - المتغيرات/المصدر: When no file name; else file name shown (LTR technical string)

- **TXT-0708** — `تاريخ التصدير: ${arabicDateTime(preview.summary.exportedAt)}`
  - المتغيرات/المصدر: When summary.exportedAt present. arabicDateTime produces Arabic date string

- **TXT-0709** — `فحوصات الرغبة: ${preview.summary.urgeChecks}`
  - المتغيرات/المصدر: Valid backup preview; count injected

- **TXT-0710** — `زلات وانتكاسات مسجلة: ${preview.summary.relapses}`
  - المتغيرات/المصدر: Valid backup preview; count injected

- **TXT-0711** — `قواعد وقاية: ${preview.summary.rules}`
  - المتغيرات/المصدر: Valid backup preview; count injected

- **TXT-0712** — `تدخلات: ${preview.summary.interventions}`
  - المتغيرات/المصدر: Valid backup preview; count injected

- **TXT-0763** — `نسخة النسخة الاحتياطية (إصدار ${schemaVersion}) غير مدعومة — هذا التطبيق يدعم الإصدار ${BACKUP_SCHEMA_VERSION}.`
  - المتغيرات/المصدر: Restore/import: schemaVersion!= 1. Example: نسخة النسخة الاحتياطية (إصدار 2) غير مدعومة — ده التطبيق يدعم الإصدار 1.

- **TXT-0773** — `النسخة الاحتياطية تالفة: ${err}.`
  - المتغيرات/المصدر: Restore/import: any entry-level validation failure; specific error appended. Example: النسخة الاحتياطية تالفة: سجل فحص رغبة غير صالح.

**تواريخ عربية مولّدة وقت التشغيل (ليست نصوصًا حرفية في الكود):** دالتا `arabicDate` و`arabicDateTime` تستخدمان `Intl.DateTimeFormat("ar")` فينتج عنهما تواريخ عربية كاملة من المتصفح نفسه (مثل: «الأربعاء، ١٧ سبتمبر» / «١٧ سبتمبر، ١٠:٣٠ م») — بتظهر في عناوين الجرعة/الخطة، سجلات الزلات، وقائمة المراجعات المعلقة.

## 24. المحتوى الثابت — التصنيف (Taxonomy / Fixed Content)

### درجة الحالة (1–5) — التسمية والوصف والأمثلة

بتظهر في نتيجة فحص الرغبة. الوصف أسفل الرقم، والأمثلة رقائق تحذير.

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| RISK-1-L | هدوء | تسمية درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-1-D | مفيش مشكلة ملحّة دلوقتي — كمّل يومك الطبيعي. | وصف درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-2-L | بداية بسيطة | تسمية درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-2-D | رغبة بدأت بتظهر — يمكن التعامل معها بسهولة بخطوة صغيرة. | وصف درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-3-L | بدأت بتقوى | تسمية درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-3-D | الرغبة تشتد — خطوة تدخل مبكر دلوقتي تقطعها وهي لسه صغيرة. | وصف درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-3-E1 | بدأت أفكر في «إزاي» | مثال (رقاقة تحذير) | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-3-E2 | «مرة واحدة مش هفرق» | مثال (رقاقة تحذير) | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-4-L | خطر مرتفع | تسمية درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-4-D | قربت من التصرف — تدخّل دلوقتي، بلا تحليل. | وصف درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-4-E1 | فتحت المصدر بالفعل | مثال (رقاقة تحذير) | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-4-E2 | «آخر مرة ووقّف» | مثال (رقاقة تحذير) | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-5-L | على وشك التصرف | تسمية درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| RISK-5-D | أنت عند نقطة التنفيذ نفسها، وتشعر أنك بالكاد تقدر التوقف — أقصى تدخل مباشر دلوقتي. | وصف درجة | فحص الرغبة — نتيجة الفحص (التسمية/الوصف/أمثلة الرقائق) |
| MODE-awareness | مراقبة هادئة | تسمية الوضع المقترح | فحص الرغبة — سطر «أنسب خطوة دلوقتي: …» |
| MODE-interrupt | قطع مبكر | تسمية الوضع المقترح | فحص الرغبة — سطر «أنسب خطوة دلوقتي: …» |
| MODE-immediate | تدخل فوري | تسمية الوضع المقترح | فحص الرغبة — سطر «أنسب خطوة دلوقتي: …» |
| MODE-emergency | وضع الطوارئ | تسمية الوضع المقترح | فحص الرغبة — سطر «أنسب خطوة دلوقتي: …» |
| MODE-maximum | أزمة — تدخل أقصى | تسمية الوضع المقترح | فحص الرغبة — سطر «أنسب خطوة دلوقتي: …» |

### فئات المحفزات الخمس وتسمياتها

تسميات الفئات بتظهر كعناوين مجموعات في خريطة المحفزات. (تلميحات الفئات غير معروضة — انظر القسم 28.)

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| TCAT-internal | داخلية | تسمية فئة محفزات | خريطة المحفزات — عنوان مجموعة المحفزات المتكررة |
| TCAT-emotional | انفعالية | تسمية فئة محفزات | خريطة المحفزات — عنوان مجموعة المحفزات المتكررة |
| TCAT-digital | رقمية/خارجية | تسمية فئة محفزات | خريطة المحفزات — عنوان مجموعة المحفزات المتكررة |
| TCAT-situational | ظرفية | تسمية فئة محفزات | خريطة المحفزات — عنوان مجموعة المحفزات المتكررة |
| TCAT-habitual | اعتيادية | تسمية فئة محفزات | خريطة المحفزات — عنوان مجموعة المحفزات المتكررة |

### مكتبة المحفزات (24 محفزًا)

رقائق اختيار في فحص الرغبة والتسجيل السريع والمراجعات، وعناصر قائمة في خريطة المحفزات وقراءات التقدم.

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| TRG-memory | ذكرى أو مشهد عالق في الذهن | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-thought | فكرة متكررة | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-fantasy | خيال بدأ يتشعب | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-curiosity | فضول أو رغبة في البحث | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-boredom | ملل | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-loneliness | وحدة | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-stress | توتر أو ضغط | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-anxiety | قلق | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-sadness | حزن أو ضيق نفسي | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-anger | غضب أو إحباط | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-images | التقاء بمحتوى أو صورة | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-feeds | تصفح المنصات/التغذية | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-websites | موقع أو منصة معينة | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-search | بدء بحث | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-stories | قصص أو محتوى نصي محفز | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-aimless | تصفح بلا هدف | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-late-night | وقت متأخر من الليل | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-bed | البقاء في السرير | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-bathroom | مكان معين (حمام/غرفة مغلقة) | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-isolation | الانعزال عن الناس | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-phone-habit | التقاط الهاتف آليًا | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-just-minute | «دقيقة واحدة» | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-testing | اختبار مقاومتك قدام المحفز | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |
| TRG-scrolling | تمرير بلا غرض | تسمية محفز | فحص الرغبة — رقائق «إيه اللي بدأ الموضوع؟»؛ توقّف هنا — التسجيل السريع (كل المحفزات) + مراجعة هادئة خطوة ١ (١٢ الأولى)؛ الخطة اليومية — المراجعة المسائية سؤال ٢ (١٠ الأولى)؛ خريطة المحفزات — قائمة «محفزاتك الأكثر تكرارًا» + قراءة «أكثر محفز متكرر»؛ التقدم — قراءة «أكثر محفز متكرر»؛ عرض التفاصيل في سجل الزلات (تسميات المحفزات المسجلة) |

### العلامات المبكرة (10)

رقائق في المراجعة الهادئة (خطوة ٣) بسؤال «ما أول علامة ظهرت قبل السلوك؟».

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| EARLY-01 | افتكر مشاهد سابقة | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |
| EARLY-02 | تطوير خيال وإضافته تفاصيل | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |
| EARLY-03 | تصفح بلا هدف | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |
| EARLY-04 | بدء بحث | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |
| EARLY-05 | فتح منصة «لمجرد أن ألقي نظرة» | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |
| EARLY-06 | البحث عن محتوى محفز بديل | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |
| EARLY-07 | عزل نفسك عن الناس | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |
| EARLY-08 | الهاتف في السرير | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |
| EARLY-09 | تفاوض داخلي | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |
| EARLY-10 | اختبار مقاومتك | علامة مبكرة | توقّف هنا — مراجعة هادئة خطوة ٣ (رقائق العلامات المبكرة) |

### ردود مسوّغات التفاوض (8 أنماط × نمط/رد)

لوحة «صوت التفاوض يهمس؟ افتح الردود الجاهزة» في نتيجة فحص الرغبة (تُعرض أول ٥).

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| ANTI-one-minute-P | «سأنظر دقيقة واحدة بس» | نمط مسوّغ | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-one-minute-R | المشكلة ليست في الدقيقة. السلسلة بدأت بالفعل. اقطعها دلوقتي. | رد جاهز | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-in-control-P | «أنا مسيطر على الأمر» | نمط مسوّغ | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-in-control-R | لا تختبر قدرتك على المقاومة قدام المحفز. غيّر البيئة. | رد جاهز | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-already-slipped-P | «حصلت زَلّة بالفعل — سكمّل إلى النهاية» | نمط مسوّغ | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-already-slipped-R | الزَلّة الواحدة لا تستدعي تكملة. وقّف دلوقتي — الباقي قرار مستقل. | رد جاهز | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-tomorrow-P | «سأبدأ غدًا» | نمط مسوّغ | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-tomorrow-R | البداية ليست غدًا. البداية هي الخطوة اللي بعدها دلوقتي. | رد جاهز | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-cant-P | «لا أستطيع» | نمط مسوّغ | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-cant-R | مش محتاج تحل حياتك دلوقتي. نفّذ الخطوة الحالية بس. | رد جاهز | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-once-wont-hurt-P | «مرة واحدة لن تضر» | نمط مسوّغ | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-once-wont-hurt-R | ما تعيشه دلوقتي بدأ بخطوة صغيرة كمان. لا تفاوض على السلسلة. | رد جاهز | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-deserve-P | «أستحق تنفيسًا/مكافأة» | نمط مسوّغ | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-deserve-R | التوتر محتاج حلًا حقيقيًا. دي الحلقة بتزيد الضغط بعد قليل، لا تخففه. | رد جاهز | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-nobody-knows-P | «مفيش حد سيعرف» | نمط مسوّغ | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |
| ANTI-nobody-knows-R | المسألة ليست من يعرف. المسألة أن السلسلة تستنزف وقتك وطاقتك وثقتك. | رد جاهز | فحص الرغبة — لوحة «صوت التفاوض يهمس؟» (أول ٥ أنماط) |

### مراحل الرحلة (7 مراحل × تسمية/وصف)

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| STAGE-stabilize | التثبيت | تسمية مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-stabilize-D | أهم هدف دلوقتي: تقليل السلوك ووقطع السلاسل مبكرًا، وبناء أول روتين يومي بسيط. | وصف مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-understand | الفهم | تسمية مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-understand-D | تتعرف على محفزاتك وأنماطك، وتكتشف نقطة التدخل الأفضل في سلسلتك. | وصف مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-build-skills | بناء المهارات | تسمية مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-build-skills-D | تتقن مهارات القطع والملاحظة، وتحوّل خطتك من رد فعل إلى نظام استباقي. | وصف مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-rebuild | إعادة بناء الحياة | تسمية مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-rebuild-D | التوسع في الحياة نفسها: هدف، علاقات، جسد، روتين ليلي — لا مجرد الامتناع. | وصف مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-strengthen | التعزيز | تسمية مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-strengthen-D | تثبيت النمط الجديد، والتعامل مع أنماط قديمة ممكن ترجع وقت الضغط. | وصف مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-maintain | الصيانة | تسمية مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-maintain-D | الحفاظ على المكاسب بأقل جهد، مع يقظة لأوقات الضعف (إجهاد، اضطراب نوم، تغيرات). | وصف مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-wisdom | المدى الطويل | تسمية مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| STAGE-wisdom-D | خبرتك اتراكمت. الهدف: حياة تمشي بقيمك، واستخدام التطبيق بس لاللي محتاجه. | وصف مرحلة | الجرعة اليومية — سطر العنوان الفرعي + بطاقة «مرحلتك الحالية»؛ التقدم — بطاقة الرحلة (التسمية/الوصف)؛ التقدم — مؤشر المراحل (title لأشرطة المراحل) |
| JDISC | دي مراحل تنظيمية للمحتوى والرحلة، لا جدولًا زمنيًا بيولوجيًا مضمونًا للتعافي. | إخلاء مسؤولية المراحل | الجرعة اليومية — أسفل بطاقة المرحلة؛ التقدم — أسفل بطاقة الرحلة |

### خطوات وضع العمل الآمن (8)

الخطوات ٢–٥ بس تُعرض في وضع الطوارئ (خطوة ١، وضع العمل الآمن). الخطوة ١ نصها مكرر حرفيًا جوا تعليمة الشاشة نفسها (TXT)؛ الخطوات ٦–٨ غير معروضة (القسم 28).

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| WS-01 | اقفل كل التبويبات والتطبيقات غير المتصلة بمهمتك. | خطوة وضع عمل آمن | غير معروضة: الفقرة ١ مكررة نصًّا جوا تعليمة الخطوة الأولى؛ الفقرات ٦–٨ غير مستخدمة في أي شاشة |
| WS-02 | أبقِ بس مهمة العمل/الدراسة المطلوبة على الشاشة. | خطوة وضع عمل آمن | وضع الطوارئ — خطوة ١ (وضع العمل الآمن) — الفقرات ٢–٥ بس |
| WS-03 | جهاز واحد لغرض واحد متعمد — لا تعدد مهام. | خطوة وضع عمل آمن | وضع الطوارئ — خطوة ١ (وضع العمل الآمن) — الفقرات ٢–٥ بس |
| WS-04 | ابعد عن أي تصفح برا المهمة مهما كان «سريعًا». | خطوة وضع عمل آمن | وضع الطوارئ — خطوة ١ (وضع العمل الآمن) — الفقرات ٢–٥ بس |
| WS-05 | لو تقدر: غيّر مكان جلوسك الفعلي. | خطوة وضع عمل آمن | وضع الطوارئ — خطوة ١ (وضع العمل الآمن) — الفقرات ٢–٥ بس |
| WS-06 | ضع الجهاز على سطح ثابت بدل حملك له باستمرار. | خطوة وضع عمل آمن | غير معروضة: الفقرة ١ مكررة نصًّا جوا تعليمة الخطوة الأولى؛ الفقرات ٦–٨ غير مستخدمة في أي شاشة |
| WS-07 | اعمل ١٠ دقائق كاملة دلوقتي. | خطوة وضع عمل آمن | غير معروضة: الفقرة ١ مكررة نصًّا جوا تعليمة الخطوة الأولى؛ الفقرات ٦–٨ غير مستخدمة في أي شاشة |
| WS-08 | أعد التقييم بعدها: هل انخفض الخطر؟ | خطوة وضع عمل آمن | غير معروضة: الفقرة ١ مكررة نصًّا جوا تعليمة الخطوة الأولى؛ الفقرات ٦–٨ غير مستخدمة في أي شاشة |

### أدلة الحماية الرقمية (6 أدلة)

بطاقة «الحماية الرقمية» في خطة الوقاية: كل دليل قابل للتوسيع (عنوان/إيه/إزاي/حدوده).

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| DPG-blockers-T | حاجبات المواقع | عنوان دليل حماية | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-blockers-W | إضافات أو تطبيقات تمنع فتح مواقع محددة أو فئاتها. | وصف الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-blockers-H1 | اختار إضافة موثوقة لمتصفحك (مثل Cold Turkey أو BlockSite أو LeanBrowser). | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-blockers-H2 | أضف المواقع اللي تعرف أنها بتبدأ بها السلسلة عادة. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-blockers-H3 | فعّل وضعًا يمنع التعطيل السهل أثناء لحظة الضعف. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-blockers-L | يمكن تجاوزها بالإضافة أو المتصفح الآخر — أداة مساعدة لا حل كامل. | حدود الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-profiles-T | ملف متصفح منفصل للعمل | عنوان دليل حماية | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-profiles-W | ملف أو مستخدم مختلف في المتصفح: للشغل بس، من غير إضافاتك الشخصية وسجلّك. | وصف الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-profiles-H1 | أنشئ ملفًا جديدًا باسم «عمل». | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-profiles-H2 | لا تسجل دخول أي حسابات ترفيهية فيه. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-profiles-H3 | اجعله الملف الافتراضي أثناء الدوام/الدراسة. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-profiles-L | محتاج انضباطًا في العودة إليه عند الملل — ادعمه بقاعدة «إذا… إذن». | حدود الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-dns-T | تصفية DNS | عنوان دليل حماية | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-dns-W | تصفية على مستوى الشبكة أو الجهاز بتمنع فئات من المواقع قبل ما تفتح. | وصف الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-dns-H1 | استخدم خدمة تصفية عائلية على راوتر المنزل لو كان متاحًا. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-dns-H2 | أو اضبط DNS تصفية على جهازك (مثل خدمات التصفية المعروفة). | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-dns-H3 | اجعل إعداد كلمة المرور بيد شخص تثق به لو تقدر. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-dns-L | ممكن تبطّأ بعض المواقع أو توقف محتوى سليم، وممكن تتجاوزها عن طريق شبكة بديلة. | حدود الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-safesearch-T | البحث الآمن (SafeSearch) | عنوان دليل حماية | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-safesearch-W | خيار في محركات البحث يفلتر النتائج الصريحة. | وصف الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-safesearch-H1 | فعّله من إعدادات محرك البحث اللي تستخدمه. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-safesearch-H2 | أفعله على كل متصفحاتك وأجهزتك. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-safesearch-H3 | قفله عبر حساب الإدارة إن توفر. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-safesearch-L | غير مضمون 100% — طبقة أولى بس. | حدود الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-focus-T | أوضاع التركيز وقيود التطبيقات | عنوان دليل حماية | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-focus-W | أدوات نظام في الهاتف/الكمبيوتر تحدّد الاستخدام والتطبيقات المسموحة. | وصف الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-focus-H1 | استخدم وضع التركيز/العمل في نظام جهازك. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-focus-H2 | حدّد فترات مسموح فيها بالتطبيقات الترفيهية بس. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-focus-H3 | أزل إشعارات التطبيقات غير الضرورية كليًا. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-focus-L | إشعارات محدودة تُدار من النظام نفسه وتحتاج تحديثًا دوريًا. | حدود الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-night-T | بروتوكول الوقت المتأخر | عنوان دليل حماية | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-night-W | لا سلسلة تقريبًا بتبدأ دون وقت متأخر + وحدة + جهاز. صمّم ضد ده الثلاثي. | وصف الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-night-H1 | الهاتف برا غرفة النوم منذ ٣٠-٦٠ دقيقة قبل النوم. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-night-H2 | منبّه منفصل لا هاتف. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-night-H3 | قاعدة بيتية: السرير للنوم بس. | خطوة تطبيق | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-night-L | أقوى أداة عندك لوقت الليل، بسها محتاج تجهيزًا قبل وقت الضعف لا أثناءه. | حدود الدليل | خطة الوقاية — بطاقة «الحماية الرقمية» (عنوان/إيه/إزاي/حدوده) |
| DPG-HONESTY | بصراحة: صفحة ويب عادية مش هتقدر تحجب كل موقع أو تطبيق على مستوى جهازك كله. دي أدوات وقاية بتتجهز قبل كده وبتتدار من نظامك — مش حاجة تضبطها وقت الأزمة، ومفيش وعد بحماية كاملة. | ملاحظة صدق الحماية الرقمية | خطة الوقاية — أسفل بطاقة الحماية الرقمية |

### قوالب رسائل الدعم المحايدة (4)

رقائق في خطة الوقاية؛ القالب الأول بس بيظهر كمان في وضع الطوارئ عند التصعيد بلا جهة اتصال.

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| SUP-1 | محتاج أقعد معاك شوية، عندك وقت؟ | قالب رسالة دعم | خطة الوقاية — رقائق «قوالب رسائل محايدة»؛ وضع الطوارئ — بديل الاتصال عند التصعيد (القالب الأول بس) |
| SUP-2 | يومي تقيل شوية — نتمشى سوا؟ | قالب رسالة دعم | خطة الوقاية — رقائق «قوالب رسائل محايدة»؛ وضع الطوارئ — بديل الاتصال عند التصعيد (القالب الأول بس) |
| SUP-3 | أحتاج أشغلك معي في شي ١٠ دقائق، تساعدني؟ | قالب رسالة دعم | خطة الوقاية — رقائق «قوالب رسائل محايدة»؛ وضع الطوارئ — بديل الاتصال عند التصعيد (القالب الأول بس) |
| SUP-4 | متوفر دلوقتي؟ أبي أفرّغ كلام كتير. | قالب رسالة دعم | خطة الوقاية — رقائق «قوالب رسائل محايدة»؛ وضع الطوارئ — بديل الاتصال عند التصعيد (القالب الأول بس) |

### عوامل ضعف المقاومة (8)

رقائق في المراجعة الهادئة (خطوة ٢) وتُعرض في تفاصيل السجل المحفوظة.

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| VULN-sleep | قلة نوم | عامل ضعف مقاومة | توقّف هنا — مراجعة هادئة خطوة ٢ (رقائق عوامل الضعف) + عرض التفاصيل في السجل |
| VULN-stress | توتر/ضغط | عامل ضعف مقاومة | توقّف هنا — مراجعة هادئة خطوة ٢ (رقائق عوامل الضعف) + عرض التفاصيل في السجل |
| VULN-loneliness | وحدة | عامل ضعف مقاومة | توقّف هنا — مراجعة هادئة خطوة ٢ (رقائق عوامل الضعف) + عرض التفاصيل في السجل |
| VULN-late-night | سهر متأخر | عامل ضعف مقاومة | توقّف هنا — مراجعة هادئة خطوة ٢ (رقائق عوامل الضعف) + عرض التفاصيل في السجل |
| VULN-unstructured | وقت غير منظم | عامل ضعف مقاومة | توقّف هنا — مراجعة هادئة خطوة ٢ (رقائق عوامل الضعف) + عرض التفاصيل في السجل |
| VULN-device | استخدام مكثف للجهاز | عامل ضعف مقاومة | توقّف هنا — مراجعة هادئة خطوة ٢ (رقائق عوامل الضعف) + عرض التفاصيل في السجل |
| VULN-fatigue | إرهاق جسدي | عامل ضعف مقاومة | توقّف هنا — مراجعة هادئة خطوة ٢ (رقائق عوامل الضعف) + عرض التفاصيل في السجل |
| VULN-conflict | خلاف أو ضيق من شخص | عامل ضعف مقاومة | توقّف هنا — مراجعة هادئة خطوة ٢ (رقائق عوامل الضعف) + عرض التفاصيل في السجل |

### الأسباب الشخصية المقترحة (10)

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| WHY-time | وقتي | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |
| WHY-study | دراستي | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |
| WHY-career | مستقبلي المهني | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |
| WHY-relationships | علاقاتي | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |
| WHY-values | قيمي | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |
| WHY-spirituality | روحانيتي | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |
| WHY-focus | تركيزي | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |
| WHY-discipline | انضباطي | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |
| WHY-self-respect | احترامي لنفسي | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |
| WHY-health | صحتي | سبب شخصي مقترح | التهيئة — خطوة «ليه أفعل ده؟» (رقائق)؛ القيم والروحانيات — رقائق السبب + بطاقة «كلماتك أنت» عند غياب النص؛ وضع الطوارئ — بطاقة السبب الشخصي عند التصعيد/الإنجاز؛ الإعدادات — حوار تفضيلات التهيئة (عبر مصفوفات التهيئة نفسها) |

### الممارسات الروحية (5 ممارسات) + إخلاء المسؤولية

بتظهر بس بعد تفعيل المحتوى الروحي (القيم والروحانيات).

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| SPIR-wudu-prayer-T | وضوء + ركعتان | عنوان ممارسة روحية | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-wudu-prayer-B | الحركة الجسدية للوضوء بالماء تغيّر حالتك، والصلاة تعيد ترتيب أولويات اللحظة. | وصف الممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-wudu-prayer-S1 | توضأ بماء بارد على الوجه واليدين. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-wudu-prayer-S2 | صلِّ ركعتين بنية الهدوء والعودة. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-wudu-prayer-S3 | بعد السلام: خذ نفسًا عميقًا ثم عد لنشاطك. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-dhikr-T | ذكر قصير متكرر | عنوان ممارسة روحية | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-dhikr-B | تكرار هادئ (مثل التسبيح أو الاستغفار) يعمل كمرساة انتباه تُخفض التسارع الذهني. | وصف الممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-dhikr-S1 | اختار صيغة واحدة قصيرة. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-dhikr-S2 | كررها ببطء مع التنفس ٢-٣ دقائق. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-dhikr-S3 | لا تطارد أفكارًا مقاطعة — عد إلى الصيغة. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-quran-T | قراءة قرآن ١٠ دقائق | عنوان ممارسة روحية | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-quran-B | قراءة بتدبر — ولو صفحة واحدة — تبعد الانتباه عن المحفز وتعيد الاتساق الداخلي. | وصف الممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-quran-S1 | افتح على صفحة قصيرة. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-quran-S2 | اقرأ بصوت مسموع وبطيء. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-quran-S3 | اختم بدعاء قصير يعنيك. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-tawbah-T | التوبة والعودة — بلا يأس | عنوان ممارسة روحية | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-tawbah-B | في التصور الإسلامي: باب التوبة مفتوح دايمًا، والعودة تكون بالهمة، لا بالانكسار. لا تقنط من رحمة الله مهما تكررت الزَلّة — القنوط نفسه يطيل السلسلة. | وصف الممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-tawbah-S1 | وقّف السلوك أولًا (دي بداية التوبة). | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-tawbah-S2 | استغفر دون جلد للذات. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-tawbah-S3 | خد خطوة عملية تمنع التكرار (قاعدة «إذا… إذن»). | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-reflection-T | تأمل ومراجعة قيم | عنوان ممارسة روحية | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-reflection-B | جلسة هدوء قصيرة تسأل فيها نفسك: ما القيمة اللي عايز أن يحترمها ده اليوم؟ | وصف الممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-reflection-S1 | اجلس ٥ دقائق بلا شاشة. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-reflection-S2 | اسأل: ما اللي عايز أن أكونه اليوم؟ | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-reflection-S3 | اكتب جملة واحدة. | خطوة ممارسة | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |
| SPIR-DISC | القسم الروحي/القيمي اختياري بالكامل، وبيظهر بس للي فعّله. وهو منفصل عن المحتوى العلمي في التطبيق — الممارسات الروحية مش علاج طبي ومش ادعاء علمي. | إخلاء مسؤولية المحتوى الروحي | القيم والروحانيات — قسم «المحتوى الروحي» (بعد التفعيل بس) |

### إمتى تطلب دعمًا مهنيًا (5)

بطاقة في الإعدادات.

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| SEEK-1 | تحس أن السلوك يتصاعد رغم محاولاتك المتكررة. | مؤشر طلب دعم مهني | الإعدادات — بطاقة «إمتى تطلب دعمًا مهنيًا؟» |
| SEEK-2 | تتأثر دراستك/عملك أو علاقاتك بشكل واضح ومستمر. | مؤشر طلب دعم مهني | الإعدادات — بطاقة «إمتى تطلب دعمًا مهنيًا؟» |
| SEEK-3 | تحس بانسحاب من الحياة أو اكتئاب يلازمك. | مؤشر طلب دعم مهني | الإعدادات — بطاقة «إمتى تطلب دعمًا مهنيًا؟» |
| SEEK-4 | تلجأ للسلوك كأسلوب وحيد تقريبًا لمواجهة الضغط. | مؤشر طلب دعم مهني | الإعدادات — بطاقة «إمتى تطلب دعمًا مهنيًا؟» |
| SEEK-5 | ظهرت أفكار لإيذاء نفسك — اطلب مساعدة فورًا. | مؤشر طلب دعم مهني | الإعدادات — بطاقة «إمتى تطلب دعمًا مهنيًا؟» |

### تصنيفات قاعدة المعرفة (20)

| ID | النص | النوع | أماكن العرض |
|---|---|---|---|
| KCAT-brain-behavior | الدماغ والسلوك | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-triggers | المحفزات | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-urges | الرغبات | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-habit-loops | حلقات العادة | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-environment | البيئة | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-sleep | النوم | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-stress | التوتر | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-emotions | الإحساس | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-attention | الانتباه | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-discipline | الانضباط | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-relationships | العلاقات | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-digital | العادات الرقمية | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-relapse | الزلّة والانتكاسة | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-self-compassion | الرحمة بالذات | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-purpose | الهدف | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-values | القيم | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-spiritual | تأمل روحي | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-long-term | المدى الطويل | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-prevention | الوقاية | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |
| KCAT-emergency-skills | مهارات الطوارئ | تسمية تصنيف معرفة | قاعدة المعرفة — رقائق التصنيف (+ العدد)؛ الجرعة اليومية — رقاقة التصنيف + سطر الجرعات السابقة |

## 25. مكتبة التدخلات (28 تدخلًا — النص الكامل)

كل تدخل ببطاقة كاملة في وضع الطوارئ (خطوة ٣) وفحص الرغبة (مرحلة التنفيذ): الاسم، المدة، المكان، الخطوات المرقمة، «ليه بيساعد ده؟»، والخطوة التالية.

### INT-01 — قفل المصدر فورًا

- **العائلة الوظيفية:** cut-chain · **نطاق الدرجات:** 3–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-01-DUR):** ٣٠ ثانية
- **المكان (INT-01-LOC):** حيث أنت دلوقتي
- **الخطوات (INT-01-I1…I3):**
  1. اقفل التبويب أو التطبيق أو الصفحة دلوقتي — من غير ما تقرا سطر زيادة.
  2. اقفل الجهاز كله لو تقدر، أو اقلبه على وجهه بعيدًا عن يدك.
  3. قوم من مكانك فورًا — الحركة نفسها بتكسر الجمود.
- **ليه بيساعد (INT-01-WHY):** السلسلة محتاج مصدرًا مفتوحًا لتستمر. قفله خلال الثواني الأولى أرخص مقاومة موجودة، قبل ما التوتر يعلى.
- **الخطوة التالية (INT-01-NEXT):** غيّر المكان — الخطوة التالية.
- **وسوم التقارب (معرّفات تقنية):** digital, search, aimless, feeds, websites, stories, images

### INT-02 — مغادرة الغرفة

- **العائلة الوظيفية:** cut-chain · **نطاق الدرجات:** 3–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-02-DUR):** دقيقة واحدة
- **المكان (INT-02-LOC):** من غرفتك إلى أي غرفة أخرى
- **الخطوات (INT-02-I1…I3):**
  1. قوم واخرج من الغرفة الحالية فورًا.
  2. روح لأي مكان تاني في البيت — الممر، الصالة، المطبخ.
  3. ما تاخدش الجهاز معاك لو تقدر.
- **ليه بيساعد (INT-02-WHY):** السلوك ده مرتبط بالسياق. تغيير الغرفة يفصل الانتباه عن البيئة اللي بدأت فيها السلسلة وبيقلل اندفاعها.
- **الخطوة التالية (INT-02-NEXT):** ابدأ نشاطًا ملموسًا في المكان الجديد.
- **وسوم التقارب (معرّفات تقنية):** bed, bathroom, isolation, late-night

### INT-03 — الانتقال إلى مكان مشترك

- **العائلة الوظيفية:** cut-chain · **نطاق الدرجات:** 4–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** نعم · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** لا
- **المدة (INT-03-DUR):** ١٥ دقيقة
- **المكان (INT-03-LOC):** غرفة المعيشة / مكان فيه أشخاص
- **الخطوات (INT-03-I1…I3):**
  1. انتقل إلى غرفة فيها أحد من أهلك أو زملائك.
  2. مش محتاج أن تخبره بأي حاجة — اقعد واعمل حاجة عادي.
  3. خليك هناك لحد ما الإحساس يهدى.
- **ليه بيساعد (INT-03-WHY):** ده السلوك يزدهر في الخفاء والانعزال. وجود الناس في المدى البصري وحده يغيّر معادلة اللحظة.
- **الخطوة التالية (INT-03-NEXT):** عيد تقييم الخطر بعد ١٥ دقيقة.
- **وسوم التقارب (معرّفات تقنية):** isolation, loneliness

### INT-04 — مكالمة قصيرة بشخص تثق به

- **العائلة الوظيفية:** support · **نطاق الدرجات:** 4–5 · **محتاج هاتفًا:** نعم · **محتاج شخصًا آخر:** نعم · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-04-DUR):** ٥ دقائق
- **المكان (INT-04-LOC):** أي مكان
- **الخطوات (INT-04-I1…I3):**
  1. اتصل بشخص يريحك وجوده.
  2. تحدث عن أي حاجة عادي: يومك، دراسة، رياضة، أي خبر.
  3. لا لازم افتكر الموضوع الخاص إطلاقًا — يكفي تغيير الشركة.
- **ليه بيساعد (INT-04-WHY):** الاتصال البشري المباشر يقطع الانعزال اللي تغذي به السلسلة نفسها، ويعيد انتباهك إلى العالم برا الشاشة.
- **الخطوة التالية (INT-04-NEXT):** أنهِ المكالمة ثم أعد التقييم.
- **وسوم التقارب (معرّفات تقنية):** loneliness, isolation, sadness

### INT-05 — مشي ١٠ دقائق

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 3–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-05-DUR):** ١٠ دقائق
- **المكان (INT-05-LOC):** برا البيت أو في الممر الطويل
- **الخطوات (INT-05-I1…I3):**
  1. اخرج من المكان وابدأ المشي — جوا البيت أو خارجه.
  2. سيب الجهاز خلفك أو في جيبك مغلقًا.
  3. انتبه لخطواتك وتنفسبك أثناء المشي.
- **ليه بيساعد (INT-05-WHY):** المشي المنتظم يغيّر الحالة الفسيولوجية (نبض، تنفس، حرارة) اللي تتغذى عليها الرغبة، ويكسر الجمود الحركي.
- **الخطوة التالية (INT-05-NEXT):** عند العودة: أعد تقييم درجة حالتك.
- **وسوم التقارب (معرّفات تقنية):** aimless, boredom, stress, bed

### INT-06 — غسل الوجه بماء بارد

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 3–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-06-DUR):** ٦٠ ثانية
- **المكان (INT-06-LOC):** أقرب مغسلة
- **الخطوات (INT-06-I1…I3):**
  1. روح لـ المغسلة.
  2. اغسل وجهك ويديك بماء بارد ٣ مرات.
  3. ابقَ واقفًا، وتنفس ٥ أنفاس هادئة.
- **ليه بيساعد (INT-06-WHY):** الماء البارد على الوجه ينشّط استجابة فسيولوجية مهدئة سريعة، ويمنح الدماغ مقاطعة حسية واضحة عن حلقة التفكير.
- **الخطوة التالية (INT-06-NEXT):** ابدأ مهمة صغيرة ملموسة.
- **وسوم التقارب (معرّفات تقنية):** fantasy, memory, thought

### INT-07 — استحمام

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 4–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-07-DUR):** ١٠–١٥ دقيقة
- **المكان (INT-07-LOC):** الحمام
- **الخطوات (INT-07-I1…I3):**
  1. سيب الجهاز برا الحمام خالص.
  2. استحم بماء معتدل أو بارد.
  3. بعد الحمام: البس ملابس يومك ولا تعد إلى السرير.
- **ليه بيساعد (INT-07-WHY):** تغيير كامل للحالة الجسدية والإحساس، مع انفصال إجباري عن الجهاز عدة دقائق متواصلة.
- **الخطوة التالية (INT-07-NEXT):** عد إلى نشاطك الطبيعي.
- **وسوم التقارب (معرّفات تقنية):** late-night, bed, aimless

### INT-08 — تنفس مُهدِّئ ٤-٧-٨

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-08-DUR):** ٣ دقائق
- **المكان (INT-08-LOC):** أي مكان — واقفًا أو جالسًا
- **الخطوات (INT-08-I1…I4):**
  1. شهيق من الأنف ٤ ثوانٍ.
  2. احبس النفس ٧ ثوانٍ.
  3. زفير بطيء من الفم ٨ ثوانٍ.
  4. كرر ٤ دورات على الأقل.
- **ليه بيساعد (INT-08-WHY):** الزفير الطويل يهدئ الجهاز العصبي ويخفض التسارع الجسدي اللي يجعل «المقاومة بالتفكير» أصعب.
- **الخطوة التالية (INT-08-NEXT):** أعد تقييم شدة الرغبة.
- **وسوم التقارب (معرّفات تقنية):** stress, anxiety, anger

### INT-09 — ركوب موجة الرغبة

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–4 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-09-DUR):** ١٠ دقائق
- **المكان (INT-09-LOC):** مكان هادئ بعيد عن المحفز
- **الخطوات (INT-09-I1…I4):**
  1. اجلس وتنفس براحة.
  2. لاحظ الرغبة كموجة: قوة تتصاعد ثم تهبط.
  3. لا تحاربها ولا تغذّها — راقبها بس، كمشاهد لا منفّذ.
  4. سمِّ ما تحس به براحة: «دي رغبة… وهذا توتر…».
- **ليه بيساعد (INT-09-WHY):** الرغبات محدودة الزمن غالبًا وتبلغ ذروتها ثم تنحسر. تعلم مراقبتها دون تنفيذها يبني مهارة أثمن من مجرد الهرب منها.
- **الخطوة التالية (INT-09-NEXT):** بعد ١٠ دقائق: هل خفت الموجة؟
- **وسوم التقارب (معرّفات تقنية):** curiosity, fantasy, thought, memory

### INT-10 — دفعة حركة قوية

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 3–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-10-DUR):** ٥ دقائق
- **المكان (INT-10-LOC):** أي مكان يتسع لحركتك
- **الخطوات (INT-10-I1…I3):**
  1. نفّذ ٤ دورات: ٢٠ قرفصاء + ١٠ ضغط (أو ما يناسب لياقتك).
  2. ارتح دقيقة بين الدورات مع تنفس.
  3. ما تخليشها عقابًا — هدفها تغيير الحالة بس.
- **ليه بيساعد (INT-10-WHY):** المجهود القصير يرفع النبض ويحوّل طاقة التعبير الفسيولوجية للرغبة إلى قناة بدنية مختلفة خالص.
- **الخطوة التالية (INT-10-NEXT):** اغسل وجهك ثم أعد التقييم.
- **وسوم التقارب (معرّفات تقنية):** boredom, stress, anger, late-night

### INT-11 — مهمة ملموسة ١٠ دقائق

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–4 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-11-DUR):** ١٠ دقائق
- **المكان (INT-11-LOC):** البيت — المطبخ/المكتب
- **الخطوات (INT-11-I1…I3):**
  1. اختار مهمة ملموسة تراها قدامك: أطباق، ترتيب مكتب، تعبئة ملابس.
  2. شغّل مؤقت ١٠ دقائق.
  3. اعمل بها حتى ينتهي — بلا هاتف في اليد.
- **ليه بيساعد (INT-11-WHY):** الرغبة تزدهر في الفراغ واليد الخالية. مهمة يدوية قصيرة تشغل القناة الحركية وتعطي الدماغ إنجازًا حقيقيًا صغيرًا.
- **الخطوة التالية (INT-11-NEXT):** بعد المهمة: قرر الخطوة التالية ليومك.
- **وسوم التقارب (معرّفات تقنية):** boredom, aimless, unstructured

### INT-12 — جلسة تركيز ٢٠ دقيقة

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–3 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-12-DUR):** ٢٠ دقيقة
- **المكان (INT-12-LOC):** مكتب/طاولة — وليس السرير
- **الخطوات (INT-12-I1…I3):**
  1. اجلس على مكتب، هاتفك في غرفة أخرى.
  2. مادة واحدة، مهمة واحدة واضحة.
  3. شغّل مؤقت ٢٠ دقيقة وابدأ فورًا — ما تستناش «الجو المناسب».
- **ليه بيساعد (INT-12-WHY):** الانتباه المركّز حالة يصعب دخولها والخروج منها باستمرار. الجلسة الواحدة تعيد عقلك إلى مسار البناء بدل الاستهلاك.
- **الخطوة التالية (INT-12-NEXT):** استرح ٥ دقائق ثم قرر: جلسة أخرى؟
- **وسوم التقارب (معرّفات تقنية):** boredom, curiosity

### INT-13 — قراءة برا الشاشة ١٥ دقيقة

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–3 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-13-DUR):** ١٥ دقيقة
- **المكان (INT-13-LOC):** كرسي — وليس السرير
- **الخطوات (INT-13-I1…I3):**
  1. كتاب ورقي أو قارئ إلكتروني بسيط.
  2. اجلس على كرسي بعيد عن السرير.
  3. اقرأ فصلًا واحدًا أو ١٥ صفحة.
- **ليه بيساعد (INT-13-WHY):** القراءة على الورق تعطي انتباهًا عميقًا بطيئ الإيقاع — عكس التغذية السريعة اللي درّبت عقلك على الالتهاء الفوري.
- **الخطوة التالية (INT-13-NEXT):** ضع علامة عند ما وصلت إليه وعد ليومك.
- **وسوم التقارب (معرّفات تقنية):** boredom, late-night, phone-habit

### INT-14 — بروتوكول السرير

- **العائلة الوظيفية:** cut-chain · **نطاق الدرجات:** 3–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-14-DUR):** ١٠ دقائق
- **المكان (INT-14-LOC):** من السرير إلى برا الغرفة
- **الخطوات (INT-14-I1…I6):**
  1. انهض من السرير دلوقتي.
  2. أضئ نور الغرفة.
  3. اخرج الهاتف من غرفة النوم لو تقدر — اتركه في مكان آخر.
  4. انتقل إلى مكان مناسب آخر في البيت.
  5. نفّذ نشاطًا ملموسًا ١٠ دقائق.
  6. عد إلى السرير بس لما تكون جاهزًا للنوم فعلًا.
- **ليه بيساعد (INT-14-WHY):** «السرير + الجهاز + وقت متأخر» أكثر الثلاثيات تكرارًا في بدء السلاسل. كسر الثلاثية عند أول حلقة أسهل بكتير من كسرها في الذروة.
- **الخطوة التالية (INT-14-NEXT):** بعد النشاط: لو إنت مستيقظًا فابقَ برا السرير.
- **وسوم التقارب (معرّفات تقنية):** bed, late-night, phone-habit

### INT-15 — بروتوكول التوتر

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–4 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-15-DUR):** ١٢ دقيقة
- **المكان (INT-15-LOC):** أي مكان + ورقة أو ملاحظات
- **الخطوات (INT-15-I1…I5):**
  1. وقّف أي نشاط شاشة غير ضروري.
  2. خذ وقفة تهدئة: ٥ أنفاس بطيئة.
  3. اكتب المسبب في جملة واحدة بس.
  4. حدّد أصغر خطوة قابلة للحل في ده المسبب.
  5. اعمل على الخطوة ١٠ دقائق ثم توقف.
- **ليه بيساعد (INT-15-WHY):** التوتر المبهم يدفع للهروب. تحويله إلى جملة مكتوبة وخطوة صغيرة يعيده إلى حجمه الحقيقي ويستعيد إحساس السيطرة.
- **الخطوة التالية (INT-15-NEXT):** أعد التقييم — هل ما زلت بحاجة للهروب؟
- **وسوم التقارب (معرّفات تقنية):** stress, anxiety, sadness, anger

### INT-16 — قائمة الملل: ٥ دقائق

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–3 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-16-DUR):** ٥ دقائق
- **المكان (INT-16-LOC):** حيث أنت
- **الخطوات (INT-16-I1…I2):**
  1. اختار واحدة: ترتيب المكتب / غسل الأطباق / تجهيز مهمة الغد.
  2. نفّذها فورًا — بلا هاتف.
- **ليه بيساعد (INT-16-WHY):** الملل حالة انتباه جائعة تبحث عن أي طعام سريع. مهمة قصيرة ملموسة تُطعمها بطريقة تبني ولا تستهلك.
- **الخطوة التالية (INT-16-NEXT):** إن بقيت فترة فراغ: اختار نشاط ١٥ دقيقة.
- **وسوم التقارب (معرّفات تقنية):** boredom, aimless

### INT-17 — قائمة الملل: ٣٠ دقيقة

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–3 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-17-DUR):** ٣٠ دقيقة
- **المكان (INT-17-LOC):** برا الغرفة
- **الخطوات (INT-17-I1…I2):**
  1. اختار واحدة: تمرين رياضي / جلسة دراسة / العمل على مشروع / خروج قصير / نشاط اجتماعي.
  2. التزم بها ثلاثين دقيقة كاملة.
- **ليه بيساعد (INT-17-WHY):** فترات الفراغ الطويلة غير المخططة هي البيئة الخصبة للسلاسل. ملؤها باختيار مسبق يحوّلها من خطر إلى بناء.
- **الخطوة التالية (INT-17-NEXT):** سجّل ما أنجزته في المراجعة المسائية.
- **وسوم التقارب (معرّفات تقنية):** boredom, unstructured

### INT-18 — إقفال بيئة العمل

- **العائلة الوظيفية:** cut-chain · **نطاق الدرجات:** 3–5 · **محتاج هاتفًا:** نعم · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-18-DUR):** ١٠ دقائق عمل
- **المكان (INT-18-LOC):** عند جهازك
- **الخطوات (INT-18-I1…I5):**
  1. اقفل كل التبويبات والتطبيقات غير المتصلة بمهمتك.
  2. أبقِ مهمة العمل المطلوبة وحدها على الشاشة.
  3. ضع الجهاز على سطح ثابت — لا تحمله بيدك.
  4. اعمل ١٠ دقائق كاملة على المهمة.
  5. ثم أعد التقييم.
- **ليه بيساعد (INT-18-WHY):** لما محتاج الجهاز فعلًا، المواجهة معه خاسرة. المطلوب هندسة سياقه: مهمة واحدة، شاشة نظيفة، جهاز ثابت — فيصبح أداة لا ممرًا.
- **الخطوة التالية (INT-18-NEXT):** بعد ١٠ دقائق عمل: هل هبط الخطر؟
- **وسوم التقارب (معرّفات تقنية):** digital, search, aimless

### INT-19 — إبعاد الجهاز عن متناول اليد

- **العائلة الوظيفية:** prevent-return · **نطاق الدرجات:** 2–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** لا · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-19-DUR):** ٣٠ ثانية + ساعة كاملة
- **المكان (INT-19-LOC):** من يدك إلى مكان بعيد
- **الخطوات (INT-19-I1…I3):**
  1. اسأل: «ما اللي يجعل العودة إلى المحفز أصغر خلال الساعة القادمة؟»
  2. ضع الجهاز في غرفة أخرى / درج / كيس مغلق.
  3. اتركه هناك ساعة كاملة — اختار نشاطًا يملؤها.
- **ليه بيساعد (INT-19-WHY):** كل خطوة إضافية بينك وبين المحفز (وقوف، مشي، فتح) تخفض احتمال الدخول الآلي. الاحتكاك المقصود أرخص من الإرادة.
- **الخطوة التالية (INT-19-NEXT):** بعد الساعة: التزم بغرض محدد قبل فتح الجهاز.
- **وسوم التقارب (معرّفات تقنية):** phone-habit, scrolling, just-minute

### INT-20 — وضوء بماء بارد

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-20-DUR):** ٢ دقائق
- **المكان (INT-20-LOC):** المغسلة
- **الخطوات (INT-20-I1…I2):**
  1. توضأ بماء بارد بتأنٍ.
  2. بعد الوضوء اجلس دقيقة مع تنفس هادئ.
- **ليه بيساعد (INT-20-WHY):** يجمع بين أثر الماء البارد المهدئ فسيولوجيًا ومرساة روحية تعيد للّحظة معناها وقيمتها — من فعل تعيد فيه توازنك لا سلسلة تستهلكك.
- **الخطوة التالية (INT-20-NEXT):** أتبعه بقراءة قصيرة أو ركعتين لو عايز.
- **وسوم التقارب (معرّفات تقنية):** fantasy, memory, stress

### INT-21 — ركعتان بنية العودة

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-21-DUR):** ٥ دقائق
- **المكان (INT-21-LOC):** مكان نظيف
- **الخطوات (INT-21-I1…I3):**
  1. توضأ أولًا.
  2. صلِّ ركعتين خفيفتين بنية الهدوء والعودة — لا عقابًا.
  3. بعد السلام: نفّذ الخطوة العملية اللي بعدها في خطتك.
- **ليه بيساعد (INT-21-WHY):** الصلاة توقف زخم اللحظة بالكامل وتعيد ترتيب الأولويات. هي عودة للقيم لا جلد للذات — والتوبة عمل بيبدأ بوقف السلسلة.
- **الخطوة التالية (INT-21-NEXT):** عد إلى نشاط يومك الطبيعي.
- **وسوم التقارب (معرّفات تقنية):** any

### INT-22 — ذكر كمرساة انتباه

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–4 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-22-DUR):** ٣ دقائق
- **المكان (INT-22-LOC):** أي مكان
- **الخطوات (INT-22-I1…I3):**
  1. اختار صيغة قصيرة واحدة.
  2. كررها ببطء مع التنفس ٢-٣ دقائق.
  3. الأفكار المقاطعة طبيعية — عد إليها بلا جلد.
- **ليه بيساعد (INT-22-WHY):** التكرار الهادئ يعمل كمرساة انتباه تشغل القناة الذهنية اللي يتسابق عليها الخيال، فتخفض التسارع دون صدام.
- **الخطوة التالية (INT-22-NEXT):** اختم بنية قصيرة ثم عد لنشاطك.
- **وسوم التقارب (معرّفات تقنية):** thought, fantasy, memory, anxiety

### INT-23 — رسالة محايدة لشخص موثوق

- **العائلة الوظيفية:** support · **نطاق الدرجات:** 4–5 · **محتاج هاتفًا:** نعم · **محتاج شخصًا آخر:** نعم · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-23-DUR):** ٢ دقيقة
- **المكان (INT-23-LOC):** أي مكان
- **الخطوات (INT-23-I1…I3):**
  1. اختار شخصًا تثق به.
  2. أرسل رسالة محايدة خالص: «محتاج أقعد معاك شوية» أو «نتمشى سوا؟».
  3. مش محتاج كشف أي تفاصيل خاصة إطلاقًا.
- **ليه بيساعد (INT-23-WHY):** كسر العزلة لا محتاج كشفًا. مجرد التواصل البشري القريب يغير كيمياء اللحظة ويعطيك حضورًا قدام شخص آخر.
- **الخطوة التالية (INT-23-NEXT):** انتظر الرد أو اذهب إليه مباشرة لو تقدر.
- **وسوم التقارب (معرّفات تقنية):** loneliness, isolation, sadness

### INT-24 — تسجيل سريع للرغبة

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 1–3 · **محتاج هاتفًا:** نعم · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-24-DUR):** ٦٠ ثانية
- **المكان (INT-24-LOC):** أي مكان
- **الخطوات (INT-24-I1…I3):**
  1. افتح «فحص الرغبة» وسجّل الأرقام الثلاثة.
  2. أضف المحفز والسياق باختصار.
  3. ثم سيب الجهاز وابدأ خطوة فعلية.
- **ليه بيساعد (INT-24-WHY):** التسمية والملاحظة تفصلانك عن الرغبة قليلًا — من «أنا» إلى «حاجة أرصده». ده الفاصل الصغير يوسع مساحة الاختيار.
- **الخطوة التالية (INT-24-NEXT):** اعمل التدخل المقترح بعد التسجيل.
- **وسوم التقارب (معرّفات تقنية):** any

### INT-25 — تغيير الإضاءة والصوت

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 2–4 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-25-DUR):** ٢ دقيقة
- **المكان (INT-25-LOC):** الغرفة
- **الخطوات (INT-25-I1…I3):**
  1. أضئ نور الغرفة كاملًا (الإضاءة الخافتة تميل بالمزاج نحو الخمول).
  2. شغّل صوتًا محيطًا: قرآن، بودكاست هادئ، موسيقى بلا كلمات.
  3. انتقل من وضع الاستلقاء إلى الجلوس أو الوقوف.
- **ليه بيساعد (INT-25-WHY):** المزاج يتبع الجسد والبيئة أسرع مما يتبع الكلام الداخلي. تغيير المدخلات الحسية يفكك «جوّ» اللحظة اللي تسكنه السلسلة.
- **الخطوة التالية (INT-25-NEXT):** ابدأ نشاطًا يديك مشغولة فيه.
- **وسوم التقارب (معرّفات تقنية):** late-night, bed

### INT-26 — تجهيز الغد

- **العائلة الوظيفية:** prevent-return · **نطاق الدرجات:** 1–3 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-26-DUR):** ١٠ دقائق
- **المكان (INT-26-LOC):** مكتبك / طاولة المطبخ
- **الخطوات (INT-26-I1…I3):**
  1. اكتب ٣ مهام للغد — أهمها أولًا.
  2. جهّز اللي محتاجه (ملابس، حقيبة، كتب).
  3. حدّد موعد نوم وضعه الهاتف برا الغرفة.
- **ليه بيساعد (INT-26-WHY):** اليوم غير المخطط يفتح ثغرات فراغ. تجهيز الغد يغلق بعضها قبل كده ويمنحك عتبة صباحية أقوى.
- **الخطوة التالية (INT-26-NEXT):** نفّذ بروتوكول الليل ثم نم.
- **وسوم التقارب (معرّفات تقنية):** unstructured, late-night

### INT-27 — التصعيد: اذهب حيث الناس

- **العائلة الوظيفية:** support · **نطاق الدرجات:** 4–5 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** نعم · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** لا
- **المدة (INT-27-DUR):** حتى هبوط الخطر
- **المكان (INT-27-LOC):** أي مكان فيه أشخاص
- **الخطوات (INT-27-I1…I3):**
  1. اخرج من المكان اللي أنت فيه فورًا.
  2. روح لـ حيث يوجد أشخاص: صالة البيت، مجلس، مقهى، أي تجمع عام مناسب.
  3. ابقَ في مدى أبصار الناس حتى يهبط الخطر.
- **ليه بيساعد (INT-27-WHY):** في المستويات العالية، القرارات المعقدة لا تنفع — الفعل البيئي المباشر هو الأسرع. الخفاء وقود السلسلة، والحضور البشري طارئه.
- **الخطوة التالية (INT-27-NEXT):** إن لم يهبط: اتصل بشخص تثق به دلوقتي.
- **وسوم التقارب (معرّفات تقنية):** any

### INT-28 — خمس حلقات ملاحظة

- **العائلة الوظيفية:** change-state · **نطاق الدرجات:** 1–3 · **محتاج هاتفًا:** لا · **محتاج شخصًا آخر:** لا · **آمن في العمل:** نعم · **يصلح للتنفيذ منفردًا:** نعم
- **المدة (INT-28-DUR):** ٥ دقائق
- **المكان (INT-28-LOC):** أي مكان
- **الخطوات (INT-28-I1…I5):**
  1. لاحظ الفكرة: «ظهرت ذكرى/خيال» — بلا حكم.
  2. لا تُضف عليها تفاصيل جديدة عمدًا.
  3. لا تصارعها وما تحاولش إخمادها بالقوة.
  4. انتبه لخمسة حاجات تراها حولك دلوقتي، سمِّها واحدًا واحدًا.
  5. انتقل لنشاط ملموس.
- **ليه بيساعد (INT-28-WHY):** مقاومة الفكرة بقوة تضخمها (محاولة «لا تفكر» تجعل التفكير أرجح)، وتغذيتها تبنيها. الملاحظة المحايدة تنزع عنها الوقودين معًا.
- **الخطوة التالية (INT-28-NEXT):** أعد التقييم بعد النشاط.
- **وسوم التقارب (معرّفات تقنية):** thought, memory, fantasy, curiosity

## 26. بنك المعرفة (148 بطاقة — النص الكامل)

كل بطاقة بخمسة أقسام ثابتة (اعرف/افهم/افعل/افتكر) وبطاقة واحدة فيها قسم سادس «قراءة أعمق». البطاقات الروحية (5) بتظهر بس عند تفعيل المحتوى الروحي. التصنيفات معروضة بتسمياتها (KCAT) أعلاه. المعرّفات الفنية (ids/tags/stage) مدرجة للتوثيق بس.

### KNW-001 — الدوبامين: إشارة دافع، مش «مادة متعة»

- **التصنيف:** الدماغ والسلوك (`brain-behavior`) · **مرحلة المحتوى:** early
- **اعرف (KNW-001-KNOW):** أهم حاجة بيعملها الدوبامين هي توليد الدافع والتوقع، مش المتعة نفسها.
- **افهم (KNW-001-UND):** عشان كده ممكن دافع قوي يسحبك ناحية حاجة إنت عارف من قبل إنها مش هتريحك بعد كده: الدافع والاستمتاع مسارين مختلفين، وممكن الأول بيقوى في نفس الوقت اللي التاني بيضعف فيه.
- **افعل (KNW-001-ACT):** لما بيظهر الدافع، قول لنفسك: «دي إشارة توقع، مش وعد بمتعة» — وبعدها غيّر السياق.
- **افتكر (KNW-001-REM):** الدافع مش أمر.
- **قراءة أعمق (KNW-001-DEEP):** في أبحاث التعزيز، فيه فرق بين «الرغبة» (wanting) و«الاستمتاع» (liking)، وبيبان إنهم بيعتمدوا على أنظمة عصبية مختلفة، وممكن أداء كل نظام بيتغير مع التكرار.
- **وسوم (معرّفات تقنية):** curiosity, fantasy

### KNW-002 — ليه يشتد الدافع مع التكرار؟

- **التصنيف:** الدماغ والسلوك (`brain-behavior`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-002-KNOW):** بعض الدراسات بتشير إن تكرار السلوك المُحفِّز ممكن يخلي إشاراته تشغّل الدافع أسرع وأسهل، مش أضعف.
- **افهم (KNW-002-UND):** ذكرى، أو مشهد، أو نظرة عابرة، ممكن مع الوقت تبقى إشارة مبكرة تشغّل الدافع؛ يعني السلسلة بتبدأ النهارده أسرع من امبارح. ده نمط مخك اتعلمه، وغالبًا بيضعف لما ما تكرروش — من غير موعد مضمون.
- **افعل (KNW-002-ACT):** عامل إشاراتك المبكرة باحترام: ما تختبرهاش، وما تقربش منها «للتجربة».
- **افتكر (KNW-002-REM):** الإشارة اللي تستجيب لها تتقوّى، واللي بتهملها بتضعف — غالبًا تدريجيًا.
- **وسوم (معرّفات تقنية):** memory, images, feeds

### KNW-003 — التغيير ممكن — ومفيش معاد مضمون

- **التصنيف:** الدماغ والسلوك (`brain-behavior`) · **مرحلة المحتوى:** any
- **اعرف (KNW-003-KNOW):** يحتفظ الدماغ، في كل مراحل العمر، بقدرته على إعادة تشكيل أنماطه — بس مفيش عدد أيام معلوم «يصفّره» تاني.
- **افهم (KNW-003-UND):** فكرة أن عددًا محددًا من الأيام (٩٠ مثلًا) «يصفّر الدماغ» مبالغة شائعة. اللي بيحصل فعلًا أبطأ وأهدأ: كلما قلّ تكرار السلسلة ضعُفت، وكلما تكرر المسار البديل قوي.
- **افعل (KNW-003-ACT):** بص على الاتجاه، مش الكمال: هل سلاسلك ده الشهر أقصر، وأبطأ في البدء، من الشهر الماضي؟
- **افتكر (KNW-003-REM):** التقدم اتجاه، مش رقم على التقويم.
- **وسوم (معرّفات تقنية):** —

### KNW-004 — المكافأة المتغيرة: ليه يشدّ «البحث» نفسه؟

- **التصنيف:** الدماغ والسلوك (`brain-behavior`) · **مرحلة المحتوى:** early
- **اعرف (KNW-004-KNOW):** المكافأة اللي مش مضمونة — مش عارف هتلاقي إيه — تشدّ انتباهك أكثر من المكافأة المؤكدة.
- **افهم (KNW-004-UND):** ده مبدأ تصميم أساسي في المنصات وألعاب الحظ، وده اللي بيخلي «التصفح البريء» ينزلق: المخ بيفضل يجري ورا علامة استفهام، مش نتيجة.
- **افعل (KNW-004-ACT):** لما يخاطبك إحساس «دعني أرَ بس»: سمِّ اللي بيحصل — «مكافأة متغيرة» — واقفل.
- **افتكر (KNW-004-REM):** المجهول يشدّ أقوى من المعروف — وده بيطوّل التصفح.
- **وسوم (معرّفات تقنية):** search, aimless, scrolling, curiosity

### KNW-005 — ممكن يفضل الدافع بعد ذهاب المتعة

- **التصنيف:** الدماغ والسلوك (`brain-behavior`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-005-KNOW):** ناس كتير بتحكي عن استمرارهم في السلوك رغم إن المتعة الفعلية ضعيفة أو غائبة.
- **افهم (KNW-005-UND):** مفيش تناقض ومش «ضعف» هنا: دي طبيعة الدافع المتعلَّم — غالبًا بيستمر حتى لو السلوك نفسه مش بيدي مكافأة حقيقية. وملاحظتك للفرق ده بتضعف السلسلة، لأنها بتكشف إن السلوك مش بيدي اللي متوقعه.
- **افعل (KNW-005-ACT):** بعد أي زَلّة، سجّل بصدق: إنت حسّيت بالمتعة قد إيه بجد؟ وإيه اللي فضِل بعدها؟
- **افتكر (KNW-005-REM):** العادة ممكن تكمّل طويلًا بعد ما ينتهي مقابلها.
- **وسوم (معرّفات تقنية):** —

### KNW-006 — المحفز أوسع مما تظن

- **التصنيف:** المحفزات (`triggers`) · **مرحلة المحتوى:** early
- **اعرف (KNW-006-KNOW):** المحفزات مش صور صريحة بس؛ الذكرى محفز، والملل محفز، والوحدة، والوقت المتأخر، وحتى مسكة الموبايل من غير وعي.
- **افهم (KNW-006-UND):** من حصر المحفز في «الصور» فوجئ بسلاسل بتبدأ من الملل أو الوحدة. تحديد محفزاتك الحقيقية — الداخلية والخارجية — هو أول خطوط الدفاع وأدقّها.
- **افعل (KNW-006-ACT):** استخدم خريطة المحفزات: سجّل السياق والمحفز في كل فحص رغبة، والأنماط هتبدأ بتظهر خلال أسبوع.
- **افتكر (KNW-006-REM):** اللي مش بتسمّيه، مش هتعرف تديره.
- **وسوم (معرّفات تقنية):** boredom, loneliness, phone-habit

### KNW-007 — الثلاثية الأشهر: ليل ووحدة وجهاز

- **التصنيف:** المحفزات (`triggers`) · **مرحلة المحتوى:** early
- **اعرف (KNW-007-KNOW):** بتتكرر في السجل صورة واحدة أكتر من غيرها: وقت متأخر، وانعزال، وجهاز في اليد.
- **افهم (KNW-007-UND):** كل واحد منها وحده محتمل؛ أما اجتماعها معًا فهو الخطر الحقيقي. عشان كده مش كفاية «عزيمة أقوى»: المطلوب ألا تجتمع أصلًا، ويكفي أن تكسر عاملًا واحدًا منها.
- **افعل (KNW-007-ACT):** صمّم ضد الثلاثية: نم مبكرًا، واخرج الهاتف من الغرفة ليلًا، وخلّي قاعدتك: ما تتصفّحش لوحدك في مكان مقفول.
- **افتكر (KNW-007-REM):** الخطر في اجتماع الثلاثة، مش في أي واحدة منها وحده.
- **وسوم (معرّفات تقنية):** late-night, isolation, phone-habit

### KNW-008 — التدخل المبكر أسهل بكثير

- **التصنيف:** المحفزات (`triggers`) · **مرحلة المحتوى:** early
- **اعرف (KNW-008-KNOW):** قطع السلسلة عند أول علامة أسهل بكتير من قطعها عند الذروة، عشان إيقاف السلوك بيبقى أصعب كل ما تتقدم فيه.
- **افهم (KNW-008-UND):** بعد ما يبدأ التصفح يرتفع التوتر وتضيق خياراتك، فيصبح القفل صعبًا ومكلفًا؛ أما قبل البدء فهو خطوة واحدة بسيطة. ما يفصل بين الحالتين هو ملاحظتك المبكرة للعلامة الأولى.
- **افعل (KNW-008-ACT):** اعمل لنفسك إشارة عند أول علامة: إن وجدت نفسك تتصفح بلا هدف الليلة، فاقفل واخرج فورًا.
- **افتكر (KNW-008-REM):** أول علامة هي أسهل نقطة للتدخل.
- **وسوم (معرّفات تقنية):** aimless, scrolling

### KNW-009 — الفضول: صوت لطيف بنتائج ثقيلة

- **التصنيف:** المحفزات (`triggers`) · **مرحلة المحتوى:** early
- **اعرف (KNW-009-KNOW):** غالبًا ما يجيء الفضول بصوت هادئ موثوق: «دعني أتأكد بس» — وهو في أغلب السجلات أول خيط السلسلة.
- **افهم (KNW-009-UND):** الفضول إحساس مشروع، بسه ليس أمرًا بالتنفيذ. الفارق بين أن تحس وبين أن تتبع هو جوهر المهارة كلها: لست مطالبًا بإخماد فضولك، بس ما تخليشه هو من يقود.
- **افعل (KNW-009-ACT):** سمِّه: «ده فضول»، ثم قرر بخطة مسبقة: «لا أبحث دلوقتي. أغيّر النشاط عشر دقائق».
- **افتكر (KNW-009-REM):** الفضول ليس أمرًا بالبحث.
- **وسوم (معرّفات تقنية):** curiosity, search

### KNW-010 — سجلك يكشف ما لا تذكره

- **التصنيف:** المحفزات (`triggers`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-010-KNOW):** الذاكرة ممكن تحسّن صورة اللي حصل، بس السجل ما بيجمّلش حاجة. أنماطك الحقيقية موجودة في اللي كتبته مرة ورا مرة، مش في الانطباع العام عن نفسك.
- **افهم (KNW-010-UND):** «الرغبة تنتصر عليّ مساءً» انطباع؛ أما «٧ من ٩ سلاسل بدأت بعد الحادية عشرة وأنا وحدي في غرفتي» فقاعدة تقدر تبني عليها. وبين الاثنين مسافةٌ من نية عامة إلى خطة تُنفَّذ.
- **افعل (KNW-010-ACT):** افتح خريطة المحفزات مرة كل أسبوع واسأل: ما أكثر محفز؟ ما أكثر وقت؟ ما أول علامة بتتكرر؟
- **افتكر (KNW-010-REM):** انظر إلى سجلك، لا إلى انطباعك عن نفسك.
- **وسوم (معرّفات تقنية):** —

### KNW-011 — الرغبة موجة، لا جدار

- **التصنيف:** الرغبات (`urges`) · **مرحلة المحتوى:** early
- **اعرف (KNW-011-KNOW):** تتصاعد الرغبة حتى تبلغ ذروتها، ثم تنحسر — غالبًا خلال دقائق أو أقل من ساعة — ما دمت لم تستجب لها.
- **افهم (KNW-011-UND):** الإحساس وقت الذروة يوحي بأنه «سيبقى هكذا حتى أنفذ»، وهذا غير صحيح عادة. من انتظر الموجة مرات عرف أنها تنكسر وحدها. مهمتك ليست إيقافها، بل ألا تركبها.
- **افعل (KNW-011-ACT):** في الذروة: شغّل مؤقتًا لعشر دقائق، وتنفّس، ولاحظ اللي بيحصل. ولا تتخذ قرارًا قبل انتهاء المؤقت.
- **افتكر (KNW-011-REM):** تمرّ الموجة في كل حال، والتنفيذ هو قرارك أنت.
- **وسوم (معرّفات تقنية):** fantasy, curiosity

### KNW-012 — الرغبة ليست أمرًا

- **التصنيف:** الرغبات (`urges`) · **مرحلة المحتوى:** early
- **اعرف (KNW-012-KNOW):** بين إحساسك بالرغبة وفعلك فجوة قصيرة، وهي كل مساحة حريتك.
- **افهم (KNW-012-UND):** تضيق الفجوة وقت الذروة حتى تبدو معدومة، بسها لا تختفي. كل مهارة في ده التطبيق — الملاحظة، التسمية، تغيير البيئة — هدفها واحد: أن توسّع دي الفجوة لحظةً تكفي لاختيار مختلف.
- **افعل (KNW-012-ACT):** تدرّب على التسمية: «رغبة موجودة… وأنا لست مجبرًا» — ثم اعمل خطوة فعلية واحدة.
- **افتكر (KNW-012-REM):** الرغبة ليست أمرًا.
- **وسوم (معرّفات تقنية):** —

### KNW-013 — ليه يفشل «لا تفكر فيه خالص»؟

- **التصنيف:** الرغبات (`urges`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-013-KNOW):** كل محاولة دفع فكرة عن قصد تُعيدها أشد حضورًا — وهذا ما تصفه أبحاث «الارتداد الفكري».
- **افهم (KNW-013-UND):** لما تأمر عقلك «لا تفكر»، يجلس حارسًا يراقب الفكرة ليطمئن على غيابها — فتبقى حاضرة في الخلفية طول الوقت. والحل ليس شدّة أكبر في الإخماد، بل انتباه مُوجَّه نحو حاجة آخر.
- **افعل (KNW-013-ACT):** لا تصارع الفكرة: سمِّها، ولا تُضف عليها تفاصيل، ثم وجّه انتباهك لشيء ملموس حولك.
- **افتكر (KNW-013-REM):** ما تلاحظه براحة يفقد سلطته، وما تصارعه يتغذى.
- **وسوم (معرّفات تقنية):** thought, memory, fantasy

### KNW-014 — ركوب الموجة: مهارة تُتقن بالتكرار

- **التصنيف:** الرغبات (`urges`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-014-KNOW):** «ركوب الموجة» يعني مراقبة الرغبة كظاهرة تتصاعد وتنحسر — دون تنفيذ ودون قمع.
- **افهم (KNW-014-UND):** المهارة دي بتتبني: أول مرة ممكن تبان مستحيلة، تالت مرة صعبة، وعاشر مرة تبقى معروفة ومملة شوية. والفرق من مرة للتانية هو خبرتك بنفسك إن الموجة فعلًا بتنكسر.
- **افعل (KNW-014-ACT):** تدرّب عليها عند الدرجات المنخفضة أولًا (١–٢) — ما تستناش أزمة لتتعلم السباحة.
- **افتكر (KNW-014-REM):** كل موجة عبرتَها دون تنفيذ تُضاف إلى رصيدك.
- **وسوم (معرّفات تقنية):** —

### KNW-015 — الرغبات تخفت… عادة

- **التصنيف:** الرغبات (`urges`) · **مرحلة المحتوى:** late
- **اعرف (KNW-015-KNOW):** مع غياب التكرار، تخفّ الرغبات عند أغلب الناس — في وتيرتها وشدتها — مع الوقت.
- **افهم (KNW-015-UND):** بس المسار ليس خطًا هابطًا: أيام قوية وأيام هادئة، وقد تعود أنماط قديمة في فترات ضغط أو إرهاق. ده مش معناه أن ما بنيته «انهار»؛ الجهد المتراكم هو الأصل، والتذبذب جزء من الطريق.
- **افعل (KNW-015-ACT):** في يوم قوي: لا تستنتج حاجة عن نفسك. نفّذ خطتك القصيرة وواصل.
- **افتكر (KNW-015-REM):** التذبذب طبيعي؛ الاتجاه هو المهم.
- **وسوم (معرّفات تقنية):** —

### KNW-016 — حلقة العادة: إشارة، ثم روتين، ثم مكافأة

- **التصنيف:** حلقات العادة (`habit-loops`) · **مرحلة المحتوى:** early
- **اعرف (KNW-016-KNOW):** ما نسميه «عادة» ليس ضعف شخصية؛ إنه حلقة: إشارة تُطلق روتينًا، والروتين يمنح مكافأة عابرة.
- **افهم (KNW-016-UND):** لما ترى السلسلة حلقةً، بيتغير السؤال من «إزاي أقوى؟» إلى «فين أكسر الحلقة؟». أسهل نقطة للكسر هي الإشارة نفسها (السياق)، وأصعبها المكافأة (بعد التنفيذ).
- **افعل (KNW-016-ACT):** ارسم سلسلتك المعتادة خطوة خطوة على ورقة، وضع دائرة على أول نقطة تقدر قطعها.
- **افتكر (KNW-016-REM):** لكل سلسلة نقطة كسر أسهل — مهمتك أن تجدها.
- **وسوم (معرّفات تقنية):** —

### KNW-017 — نوايا التنفيذ: أثر كبير بجهد بسيط

- **التصنيف:** حلقات العادة (`habit-loops`) · **مرحلة المحتوى:** early
- **اعرف (KNW-017-KNOW):** صياغة خطة بصيغة «إذا حدث كذا… إذن أفعل كذا» من أكثر التقنيات المدروسة فاعلية في تغيير السلوك.
- **افهم (KNW-017-UND):** السبب: الخطة تُتخذ وأنت هادئ، فتنتقل القيادة بعد كده من «قرار لحظي» إلى «قاعدة جاهزة». وقت الذروة لا يصلح للتفكير، بل للتنفيذ بس.
- **افعل (KNW-017-ACT):** اكتب دلوقتي ٣ قواعد «إذا… إذن» لأكثر سياقاتك خطورة، وفعّلها في خطة الوقاية.
- **افتكر (KNW-017-REM):** القرار يُصنع في الهدوء، ويُنفذ في العاصفة.
- **وسوم (معرّفات تقنية):** —

### KNW-018 — السلوك يتبع السياق أكثر من النية

- **التصنيف:** حلقات العادة (`habit-loops`) · **مرحلة المحتوى:** early
- **اعرف (KNW-018-KNOW):** أغلب ما نفعله يحدده المكان والوقت والحالة اللي قبلها — لا القرارات الواعية لحظة بلحظة.
- **افهم (KNW-018-UND):** نيتك في «المقاومة» بتتحط قدام سياق مجهّز أصلًا لبدء السلسلة، ومش من العدل تحاسب نفسك على خسارة مواجهة بالشكل ده. الأصح تجهّز بيئة ما تفرضش المواجهة من الأساس.
- **افعل (KNW-018-ACT):** غيّر سياقك عالي الخطورة: مكان الجلوس، ومكان الهاتف ليلًا، وأول تطبيق تفتحه.
- **افتكر (KNW-018-REM):** السياق أقوى من النية — فغيّره لصالحك.
- **وسوم (معرّفات تقنية):** phone-habit, bed, isolation

### KNW-019 — النظام يهزم الحماس

- **التصنيف:** حلقات العادة (`habit-loops`) · **مرحلة المحتوى:** any
- **اعرف (KNW-019-KNOW):** إن علّقت أيامك على الحماس وحده صارت رهينة مزاجك؛ أما النظام فيعمل في كل الأحوال تقريبًا.
- **افهم (KNW-019-UND):** الحماس مورد متذبذب بطبيعته. والنظام — روتين وقواعد وبيئة مهيَّأة — يعمل يوم الضعف كما يعمل يوم القوة، وهذا بعينه ما يصنع الفارق التراكمي.
- **افعل (KNW-019-ACT):** قسّم هدفك إلى روتين يومي صغير: مهمة واحدة، وحركة، وتواصل، ومراجعة مسائية.
- **افتكر (KNW-019-REM):** أيام الضعف هي اللي تختبر نظامك، لا حماسك.
- **وسوم (معرّفات تقنية):** —

### KNW-020 — استبدِل السلوك، وما تسيبش فراغًا

- **التصنيف:** حلقات العادة (`habit-loops`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-020-KNOW):** قلّما تُحذف حلقة العادة حذفًا؛ اللي يجدي هو وضع استجابة مختلفة مكانها، تمنحك مكافأة مشابهة.
- **افهم (KNW-020-UND):** «مش هعمل حاجة وقت الملل» مش خطة؛ الفراغ بيرجع السلوك القديم. البديل الناجح بيدي جزء من نفس المكافأة — انشغال، أو إثارة خفيفة، أو راحة — من غير ما يبوّظ يومك: رياضة، لعبة تفكير، مشي، مكالمة.
- **افعل (KNW-020-ACT):** لكل إشارة معتادة عندك، اكتب بديلًا واحدًا محددًا — واحتفظ به في قائمة الملل.
- **افتكر (KNW-020-REM):** الإشارة ستحضر حتمًا — الاستجابة هي ما تختاره.
- **وسوم (معرّفات تقنية):** boredom, aimless

### KNW-021 — الاحتكاك المقصود: ثوانٍ تصنع الفارق

- **التصنيف:** البيئة (`environment`) · **مرحلة المحتوى:** early
- **اعرف (KNW-021-KNOW):** أضِف ثوانٍ قليلة بينك وبين السلوك، بيقل احتمال وقوعه فعليًا؛ واختصر ثوانٍ قليلة، يرتفع.
- **افهم (KNW-021-UND):** قراراتنا اللحظية تنجذب إلى المسار الأقل مقاومة. وجعل المحفز أبعد قليلًا — جهاز في غرفة أخرى، تطبيق محذوف، تسجيل خروج — يحوّل البدء من «انزلاق» إلى «قرار».
- **افعل (KNW-021-ACT):** طبّق اليوم: أضف احتكاكًا لمدخل السلسلة عندك، وأزل احتكاكًا عن بديل مفيد.
- **افتكر (KNW-021-REM):** لا تنفق إرادتك في مقاومة كان يمكن تفاديها أصلًا.
- **وسوم (معرّفات تقنية):** phone-habit, scrolling

### KNW-022 — غرفة النوم للنوم

- **التصنيف:** البيئة (`environment`) · **مرحلة المحتوى:** early
- **اعرف (KNW-022-KNOW):** يربط دماغك السرير بما بيتكرر فيه؛ فإذا تصفحت فيه مرة بعد مرة، صار السرير نفسه بداية الطريق.
- **افهم (KNW-022-UND):** كل سلسلة في السرير تضيف إلى الغرفة «وظيفة» جديدة، فيصبح مجرد الاستلقاء إشارة بدء. والعكس صحيح: عزل السرير للنوم يعيد إليه وظيفته الأصلية، ويخدم نومك نفسه.
- **افعل (KNW-022-ACT):** قاعدة صارمة: لا هاتف في السرير. المنبه منفصل، والجهاز يبيت برا الغرفة.
- **افتكر (KNW-022-REM):** لكل غرفة وظيفة واحدة — والسرير للنوم.
- **وسوم (معرّفات تقنية):** bed, late-night, phone-habit

### KNW-023 — وجود الناس يغيّر البيئة

- **التصنيف:** البيئة (`environment`) · **مرحلة المحتوى:** early
- **اعرف (KNW-023-KNOW):** مجرد وجود أشخاص حولك يغيّر احتمال السلوك — من غير أن يعرفوا حاجة.
- **افهم (KNW-023-UND):** السلوك ده غالبًا بيحصل في الخفاء؛ عشان كده الانتقال لمكان مفتوح أو القعدة وسط الناس مش حل نفسي في حد ذاته، بسه تغيير حقيقي في البيئة. ومش لازم تحكي لحد أي حاجة.
- **افعل (KNW-023-ACT):** في لحظة خطر: انتقل إلى مكان فيه أشخاص — صالة، مكتبة، مجلس — وابقَ حتى يهبط.
- **افتكر (KNW-023-REM):** الخفاء وقود السلسلة، وحضور الناس يطفئها.
- **وسوم (معرّفات تقنية):** isolation, loneliness

### KNW-024 — أول شاشة تراها هي أول قرار تتخذه

- **التصنيف:** البيئة (`environment`) · **مرحلة المحتوى:** early
- **اعرف (KNW-024-KNOW):** يوجّه ترتيب شاشتك الرئيسية أصابعك من غير وعي: ما تراه أولًا هو ما يُفتح أولًا.
- **افهم (KNW-024-UND):** التطبيقات عالية الخطورة في الصف الأول تجعل كل لمحة سريعة «للساعة أو الرسالة» مرورًا إجباريًا بمدخل السلسلة. نقلها إلى صف مدفون أو حذفها يجعل المرور اختيارًا لا اضطرارًا.
- **افعل (KNW-024-ACT):** رتب شاشتك: أدوات مفيدة بس في الواجهة، والتطبيقات المستهلكة في مجلد بعيد أو محذوفة.
- **افتكر (KNW-024-REM):** شاشتك الرئيسية هي بوابتك — نظّمها لصالحك.
- **وسوم (معرّفات تقنية):** phone-habit, scrolling, feeds

### KNW-025 — الخروج من المكان: أسهل تدخل تملكه

- **التصنيف:** البيئة (`environment`) · **مرحلة المحتوى:** early
- **اعرف (KNW-025-KNOW):** تغيير الغرفة في أول لحظات الرغبة من أسرع التدخلات أثرًا وأقلها كلفة.
- **افهم (KNW-025-UND):** ترتبط السلسلة بالمكان اللي بدأت فيه؛ فالمكان نفسه صار جزءًا من ذاكرتها. لما تغادر الغرفة تقطع ده الامتداد في الحال، وتدخل سياقًا آخر له ذكرياته ووظائفه.
- **افعل (KNW-025-ACT):** اجعلها قاعدة جاهزة: أول إحساس بالخطر، أقوم واخرج من الغرفة — قبل أي نقاش داخلي.
- **افتكر (KNW-025-REM):** قدماك أسرع من أفكارك وقت الذروة.
- **وسوم (معرّفات تقنية):** bed, bathroom, isolation

### KNW-026 — قلة النوم تُضعف مزاجك وقدرتك على الضبط

- **التصنيف:** النوم (`sleep`) · **مرحلة المحتوى:** early
- **اعرف (KNW-026-KNOW):** يرتبط الحرمان من النوم في الأبحاث بتراجع في الانتباه والمزاج والتحكم في الاندفاعات.
- **افهم (KNW-026-UND):** ليالي السهر الطويلة ليست «وقتًا حرًّا» كما تبدو؛ إنها تفتح نافذة الخطر على مصراعيها: جهاز عصبي متعب، ووقت متأخر، ووحدة. يومك اللي بعده يُصنع في ليلتك، لا في صباحك.
- **افعل (KNW-026-ACT):** ثبّت موعد نوم واحدًا أيام الأسبوع وعطلة نهايته — والانحراف ساعة كحد أقصى.
- **افتكر (KNW-026-REM):** نومك أول خط دفاع، لا رفاهية.
- **وسوم (معرّفات تقنية):** late-night

### KNW-027 — الساعة الأخيرة قبل النوم: نافذة الخطر الأولى

- **التصنيف:** النوم (`sleep`) · **مرحلة المحتوى:** early
- **اعرف (KNW-027-KNOW):** كتير من سلاسل الليل بتبدأ بعد ما «كل حاجة خلصت» — لما تفضل صاحي من غير مهمة، والجهاز يبقى لوحده معاك.
- **افهم (KNW-027-UND):** الوقت اللي بعد انتهاء المهام والإلزامات هو الأخطر، لأنه يجمع في ساعة واحدة: إرهاقًا يُضعف الضبط، ووحدة، وفراغًا، وخلوًا من أعين الناس. من أحسن إدارة ساعته الأخيرة، أحسن إدارة أكثر أوقات الخطر تكرارًا.
- **افعل (KNW-027-ACT):** بروتوكول ثابت للساعة الأخيرة: أبعد الجهاز، جهّز الغد، اقرأ حاجة ورقيًا، نم.
- **افتكر (KNW-027-REM):** لا تفاوض في الساعة الأخيرة — نفّذ البروتوكول.
- **وسوم (معرّفات تقنية):** late-night, phone-habit, aimless

### KNW-028 — الهاتف برا الغرفة: قاعدة بمردود مضاعف

- **التصنيف:** النوم (`sleep`) · **مرحلة المحتوى:** early
- **اعرف (KNW-028-KNOW):** نوم الهاتف برا غرفة النوم يحسّن النوم، ويغلق أشهر مداخل السلاسل، في آن واحد.
- **افهم (KNW-028-UND):** الأبحاث بتشير إن مجرد وجود الهاتف قريبًا يشتّت النوم حتى لو لم بيتستخدم. وفي الاتجاه الآخر: معظم سلاسل الليل بتبدأ بـ«فحص سريع» من السرير. قاعدة واحدة تقطع الطريقين معًا.
- **افعل (KNW-028-ACT):** اشترِ منبهًا بسيطًا، وخلّي للهاتف «مبيتًا» ثابتًا برا غرفتك — ابدأ الليلة.
- **افتكر (KNW-028-REM):** قاعدة واحدة، حماية مزدوجة.
- **وسوم (معرّفات تقنية):** bed, late-night, phone-habit

### KNW-029 — بروتوكول ما قبل النوم

- **التصنيف:** النوم (`sleep`) · **مرحلة المحتوى:** any
- **اعرف (KNW-029-KNOW):** محتاج الدماغ إلى مهلة ينتقل فيها من اليقظة إلى النوم، والإضاءة والشاشات تُطيل دي المهلة.
- **افهم (KNW-029-UND):** القفز من التصفح إلى «نم دلوقتي» لا ينفع غالبًا: يبقى الدماغ مثارًا يبحث عن شغل، والسرير الدافئ أرضٌ خصبة للسلسلة. فترة تهدئة من ٣٠ إلى ٦٠ دقيقة تعالج المشكلة من أصلها.
- **افعل (KNW-029-ACT):** آخر ٣٠ دقيقة: إضاءة خافتة، لا شاشات، قراءة ورقية أو استرخاء، ثم النوم مباشرة.
- **افتكر (KNW-029-REM):** تهدئة قبل النوم، لا مفاوضات بعده.
- **وسوم (معرّفات تقنية):** late-night

### KNW-030 — الانتظام أهم من الكمية وحدها

- **التصنيف:** النوم (`sleep`) · **مرحلة المحتوى:** any
- **اعرف (KNW-030-KNOW):** مواعيد النوم الثابتة تحسّن جودة نومك أكثر من نوم ساعات أكثر بأوقات متقلبة.
- **افهم (KNW-030-UND):** جسمك يعمل على إيقاع، والسهر يومًا ثم التعويض بعده يربك الإيقاع، فيترتب عليه نعاس نهار وسهر ليل — وسهر الليل بالذات ليس في صالحك. الكمية المستهدفة جيدة، بس الأهم هو الموعد نفسه.
- **افعل (KNW-030-ACT):** حدّد «آخر حضور رقمي» و«موعد النوم» ثابتين يوميًا، والتزم بهما ٧ أيام وقس الفرق.
- **افتكر (KNW-030-REM):** ثبّت إيقاعك أولًا — ما بعد كده يتبع وحده.
- **وسوم (معرّفات تقنية):** late-night

### KNW-031 — التوتر: محرك السلسلة الأول

- **التصنيف:** التوتر (`stress`) · **مرحلة المحتوى:** early
- **اعرف (KNW-031-KNOW):** ليست كل سلسلة عن رغبة في حاجة؛ كثير منها هروب من ضغط نفسي ثقيل.
- **افهم (KNW-031-UND):** المشكلة مزدوجة: الهروب لا يحل مسبِّب التوتر، والذنب اللاحق يضيف طبقة توتر جديدة — فيصير التوتر نفسه سببًا لدورة كاملة. وكسرها بيبدأ من معالجة التوتر مباشرة، لا من الرغبة.
- **افعل (KNW-031-ACT):** بروتوكول التوتر: اكتب المسبب بجملة، حدّد أصغر خطوة، اعمل عليها عشر دقائق، أعد التقييم.
- **افتكر (KNW-031-REM):** عالج الضغط نفسه — ما تهربش منه إلى ما يزيده.
- **وسوم (معرّفات تقنية):** stress, anxiety

### KNW-032 — حلقة التوتر والتفريغ والذنب

- **التصنيف:** التوتر (`stress`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-032-KNOW):** بعد السلوك يأتي توتر أكبر مما كان قبله غالبًا — فيصير السلوك «حلًّا» لمشكلة هو نفسه خلقها.
- **افهم (KNW-032-UND):** تُقنعك دي الحلقة أنك «محتاج» السلوك لتفريغ الضغط، بينما السجل يقول العكس: الضغط يعود أسرع وأثقل مع كل دورة. ورؤية الحلقة على ورق أقوى من أي زجر داخلي.
- **افعل (KNW-032-ACT):** بعد أي زَلّة سجّل: مستوى التوتر قبله، وبعده بساعة. اجمع القراءات ثلاث مرات وانظر بنفسك.
- **افتكر (KNW-032-REM):** ما تظنه صمامًا هو مضخة.
- **وسوم (معرّفات تقنية):** stress

### KNW-033 — صغّر المشكلة: جملة وخطوة

- **التصنيف:** التوتر (`stress`) · **مرحلة المحتوى:** any
- **اعرف (KNW-033-KNOW):** المشكلة الضبابية تبدو أضخم مإيه، والمحددة تُرى على حجمها، ومعظم التوتر يولد من الضباب.
- **افهم (KNW-033-UND):** «كل حاجة واقفة» مش مشكلة واحدة تتحل، دي حالة إحساس. حوّلها لجملة محددة («مستحقات الأسبوع») فيها خطوة صغيرة («أنجز ملف واحد النهارده»)، وساعتها التوتر بيهدى لأن مخك بيبدأ يشوف مخرج.
- **افعل (KNW-033-ACT):** اكتب دلوقتي أكثر ما يضغط عليك بجملة واحدة، ثم أصغر خطوة تقلّصه، وابدأها فورًا.
- **افتكر (KNW-033-REM):** المشكلة المحددة أصغر دومًا من الضبابية.
- **وسوم (معرّفات تقنية):** stress, anxiety, sadness

### KNW-034 — نافذة التحمل تضيق تحت الضغط

- **التصنيف:** التوتر (`stress`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-034-KNOW):** في فترات الضغط المتصل تضيق نافذة تحمّلك وترتفع حدّتك، فتصير حاجات صغيرة قادرة على تفجيرك.
- **افهم (KNW-034-UND):** ده مش «تغيّر في شخصيتك»، ده استنزاف مؤقت. في الفترات دي بتبقى أكثر عرضة للسلاسل — مش بسبب ضعف فيك، بس لأن جهازك العصبي بيدوّر على أي مهرب. اتعامل معاها بخطة أخف، مش بأهداف أعلى.
- **افعل (KNW-034-ACT):** في أسبوع ضاغط: بدّل إلى وضع الحد الأدنى اليومي، وأجّل الأهداف الكبيرة — بلا ذنب.
- **افتكر (KNW-034-REM):** أيام العاصفة تُدار بأهداف صغيرة.
- **وسوم (معرّفات تقنية):** stress, anger

### KNW-035 — روتين تفريغ يومي — قبل ما تحتاجه

- **التصنيف:** التوتر (`stress`) · **مرحلة المحتوى:** any
- **اعرف (KNW-035-KNOW):** التفريغ الصحي المنتظم يخفض حاجة الجسم إلى المهرب اللحظي.
- **افهم (KNW-035-UND):** حركة يومية، وحديث مع إنسان، وخروج من المنزل، وتنفس هادئ — أدوات صغيرة، بسها مجتمعة تخفض «درجة الغليان» العامة. ومن فرّغ بانتظام، احتاج انفجارًا أقل.
- **افعل (KNW-035-ACT):** اختار ٣ أدوات من: مشي، رياضة، مكالمة صديق، كتابة يومية، تنفس — ووزعها على يومك.
- **افتكر (KNW-035-REM):** فرّغ قليلًا كل يوم — لا كثيرًا دفعة واحدة.
- **وسوم (معرّفات تقنية):** stress

### KNW-036 — سمِّ الشعور تُغيّر علاقتك به

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** early
- **اعرف (KNW-036-KNOW):** تشير أبحاث «وسم الانفعال» إلى أن تسمية الشعور بدقة كثيرًا ما تخفض شدته.
- **افهم (KNW-036-UND):** «ضيق عام» يوقفك عاجزًا؛ أما «إحباط من امتحان، ووحدة مساء» فأمر محدد تتعامل مع أجزائه واحدًا واحدًا. والتسمية تنقل النشاط في الدماغ من مناطق الانفعال إلى مناطق التفكير — خطوة صغيرة بأثر كبير.
- **افعل (KNW-036-ACT):** عند الشعور المزعج: سمّه بكلمة دقيقة، وحدد فين تحس به في جسدك.
- **افتكر (KNW-036-REM):** ما تسمّيه تدركه، وما تدركه تخفّفه.
- **وسوم (معرّفات تقنية):** sadness, anger, anxiety

### KNW-037 — افحص الرباعية: جائع؟ غاضب؟ وحيد؟ متعب؟

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** early
- **اعرف (KNW-037-KNOW):** أشهر لحظات الانزلاق بتحصل لما تتساب حاجة أساسية: أكل، أو راحة، أو تواصل، أو تفريغ للمشاعر.
- **افهم (KNW-037-UND):** قبل ما تحلل «ليه الرغبة قوية دلوقتي»، راجع الأساسيات: كلت إمتى؟ نمت كام؟ اتكلمت مع حد النهارده؟ كتير من «الرغبات» بتكون احتياجات متخفية — وتلبية الاحتياج ممكن تهدي الرغبة من أساسها.
- **افعل (KNW-037-ACT):** عند أول إشارة داخلية: افحص الأربعة، وقابل ما ينقص فورًا، ثم أعد التقييم.
- **افتكر (KNW-037-REM):** كثير من الرغبات رسائل حاجات — اقرأها قبل ما تنفذها.
- **وسوم (معرّفات تقنية):** boredom, loneliness, stress

### KNW-038 — الإحساس مؤقتة — القرارات تبقى

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** any
- **اعرف (KNW-038-KNOW):** تمرّ الحالة الانفعالية عادة خلال دقائق إلى ساعات، بينما يبقى أثر القرار أيامًا.
- **افهم (KNW-038-UND):** أخطر لحظة هي اللي تُتخذ فيها قرارات دائمة في ذروة إحساس عابر: قراءة الرسالة، فتح الموقع، إلغاء الخطة. والفاصل اللي تضعه بين الشعور والقرار هو ما يجعل «التأجيل» من أعظم مهاراتك.
- **افعل (KNW-038-ACT):** قاعدة صريحة: لا قرارًا مهمًّا في ذروة الانفعال — عشر دقائق تأجيلًا، لا أقل.
- **افتكر (KNW-038-REM):** الشعور يمرّ؛ أثر القرار يبقى.
- **وسوم (معرّفات تقنية):** anger, sadness, anxiety

### KNW-039 — الإحساس تُعاش في الجسد

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** early
- **اعرف (KNW-039-KNOW):** بيحصل الانفعال في الجسد أولًا: نبض، وتوتر عضلات، وتنفس يتسارع، ومن الجسد نفسه تُدار بسرعة.
- **افهم (KNW-039-UND):** عشان كده ينجح الماء البارد والمشي والتنفس البطيء حيث يفشل الجدل الداخلي: إنها تخاطب الجسد بلغته. ولما يهدأ الجسد، يعود التفكير إلى أحكامه الطبيعية.
- **افعل (KNW-039-ACT):** عند انفعال قوي: ماء بارد على الوجه، أو ٢٠ قرفصاء، أو خمسة أنفاس زفير طويلة.
- **افتكر (KNW-039-REM):** هدّئ الجسد أولًا — العقل يتبع.
- **وسوم (معرّفات تقنية):** anger, anxiety

### KNW-040 — الوحدة لا تُعالج بالخلوة مع شاشة

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** early
- **اعرف (KNW-040-KNOW):** الوحدة من أقوى سياقات السلوك القهري — والوقت الرقمي المنفرد لا يخففها بل يعمّقها.
- **افهم (KNW-040-UND):** تقدّم الشاشة «حضورًا وهميًّا»: نشاطًا بلا اتصال. بعد الجلسة تجد الوحدة كإيه، مضافًا إليها خيبة. والعلاج الحقيقي حضورٌ وصوت وبشر — ولو بمكالمة قصيرة.
- **افعل (KNW-040-ACT):** عند إحساس الوحدة مساءً: مكالمة، لا تصفح. جهّز قائمة أشخاص تريحك مكالمتهم.
- **افتكر (KNW-040-REM):** الوحدة لا يطفئها محتوى، بل صوت حقيقي.
- **وسوم (معرّفات تقنية):** loneliness, isolation

### KNW-041 — الانتباه قابل للتدريب

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-041-KNOW):** الانتباه مهارة تتحسن بالممارسة المنتظمة، وتتراجع بالتشتت المستمر — كأي قدرة.
- **افهم (KNW-041-UND):** الجرعة السريعة — سكرول ومقاطع قصيرة — بتعوّد عقلك يقفز كل كام ثانية، فيبقى التركيز العميق «متعب»: مش لأنه صعب بطبيعته، بس لأنك ما بقيتش متعود عليه. والتدريب بيرجّع العادة.
- **افعل (KNW-041-ACT):** جلسة قراءة أو عمل واحدة يوميًا: ٢٠ دقيقة، والهاتف في غرفة أخرى. ابدأ اليوم.
- **افتكر (KNW-041-REM):** انتباهك يتشكل بما تكرره — اختار ما تكرره.
- **وسوم (معرّفات تقنية):** scrolling, aimless

### KNW-042 — بقايا التبديل: ليه «النظرة السريعة» غالية

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-042-KNOW):** الانتقال بين المهام يترك «بقايا انتباه» تُشتّت المهمة اللي بعدها لدقائق.
- **افهم (KNW-042-UND):** «نظرة ثانية على الهاتف» لا تنتهي عند النظرة: تدفع ثمنها تركيزًا متضائلًا في مهمتك، وتشتتًا يجعل الملل أسهل — والملل الأسهل بابٌ يُفتح تاني. النظرة السريعة أغلى مما تبدو.
- **افعل (KNW-042-ACT):** وقت المهام: خلي الجهاز في أوضة تانية أو ساكت خالص — «النظرة السريعة» تتمنع من أصلها، مش تستنى نفسك تقاومها.
- **افتكر (KNW-042-REM):** النظرة السريعة تدفع ثمنها بعد كده — من تركيزك.
- **وسوم (معرّفات تقنية):** phone-habit, scrolling

### KNW-043 — جلسة واحدة تغيّر إيقاع يومك

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-043-KNOW):** إتمام جلسة تركيز واحدة في الصباح يرفع احتمال يوم منظم كله.
- **افهم (KNW-043-UND):** الإنجاز بدري بيرفع مزاجك، ويدي يومك «عمود فقري» بتنتظم حواليه باقي الأنشطة. والعكس صحيح: صباح تايه غالبًا بيتحول ليوم كامل من التصفح، وبعده ليل أتقل.
- **افعل (KNW-043-ACT):** كل صباح: مهمة واحدة محددة قبل أول فتح للهاتف الترفيهي.
- **افتكر (KNW-043-REM):** اربح أول جلسة — تربح اليوم.
- **وسوم (معرّفات تقنية):** aimless, boredom

### KNW-044 — الملل: فترة نمو مشروعة

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-044-KNOW):** قدرتك تستحمل الملل مرتبطة بجودة انتباهك وقراراتك — ومحاولة قتله فورًا بتضعف القدرة دي.
- **افهم (KNW-044-UND):** في الملل يستعيد الدماغ تنظيمه، وتتولد الأفكار والدوافع. من يخنق كل لحظة ملل بتحفيز سريع يخسر ده التجدد، ويصير مع الوقت أكثر جوعًا للمحفز. دع الملل يتنفس قليلًا.
- **افعل (KNW-044-ACT):** اجتز لحظات الانتظار — طابور، مصعد، إشارة — بلا هاتف، وراقب اللي بيحصل.
- **افتكر (KNW-044-REM):** بعض الملل علاج، لا مشكلة.
- **وسوم (معرّفات تقنية):** boredom, phone-habit

### KNW-045 — بيئة بلا إشعارات

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-045-KNOW):** الإشعار مقاطعة مصمَّمة بعناية، وكل مقاطعة قرار يُتخذ نيابةً عنك.
- **افهم (KNW-045-UND):** الأبحاث بتشير إن مجرد وجود إشعار ممكن يزود انشغالك الذهني حتى لو ما فتحتوش. وبيئة من غير إشعارات مش رفاهية؛ دي استرجاع لحقك إنك تحدد «إمتى أنتبه وليه».
- **افعل (KNW-045-ACT):** أطفئ إشعارات كل حاجة إلا المكالمات والرسائل من أشخاص محددين.
- **افتكر (KNW-045-REM):** انتباهك ملكك — ما تسيبش غيرك يحدد لحظة صرفه.
- **وسوم (معرّفات تقنية):** phone-habit, feeds

### KNW-046 — «الإرادة المحدودة»: نظرية محل جدل

- **التصنيف:** الانضباط (`discipline`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-046-KNOW):** فكرة أن الإرادة «عضلة تنفد» يوميًّا أُعيد النظر فيها علميًّا — لا تبنِ نظامك على افتراضها.
- **افهم (KNW-046-UND):** الأدق اليوم: من يعتمد على الإرادة وحدها يتذبذب، ومن يبني قواعد وبيئة وروتينًا يستقر — بغض النظر عن الجدل النظري. والخلاصة العملية: لا تصمم يومك معركة إرادات؛ صممه نظامًا يُلغي المعارك.
- **افعل (KNW-046-ACT):** بدل «سأقاوم اليوم»، اسأل: «ما المعركة اللي أستطيع إلغاءها من أساسها اليوم؟».
- **افتكر (KNW-046-REM):** ألغِ المعارك قبل ما تخوضها.
- **وسوم (معرّفات تقنية):** —

### KNW-047 — الأنظمة تغلب الحماس

- **التصنيف:** الانضباط (`discipline`) · **مرحلة المحتوى:** any
- **اعرف (KNW-047-KNOW):** الإنجاز المستقر يأتي من روتين مُصمَّم يعمل في كل الأحوال — لا من نوبات حماس متقطعة.
- **افهم (KNW-047-UND):** الحماس يجعلك بتبدأ بقوة ثم تتهاوى عند أول ضعف؛ أما النظام — مواعيد وقوائم وبيئة وقواعد — فلا يعتمد على المزاج أصلًا. صمّم يومك بحيث لا محتاج بطلًا، بل منفِّذًا بس.
- **افعل (KNW-047-ACT):** حوّل أكثر ٣ أنشطة أثرًا في يومك إلى مواعيد ثابتة، لا قرارات لحظية.
- **افتكر (KNW-047-REM):** مش محتاج حماسًا — محتاج موعدًا.
- **وسوم (معرّفات تقنية):** —

### KNW-048 — الحد الأدنى يحمي أيام الضعف

- **التصنيف:** الانضباط (`discipline`) · **مرحلة المحتوى:** early
- **اعرف (KNW-048-KNOW):** التخطيط لحد أدنى في يومك الوحش أهم من التخطيط ليوم مثالي لما تكون كويس.
- **افهم (KNW-048-UND):** فكرة «إما كل حاجة أو مفيش حاجة» هي اللي تحوّل الزَلّة الصغيرة إلى يوم منهار بكمّله. أما يوم الحد الأدنى — مهمة واحدة، وحركة، وتواصل، ومراجعة مسائية — فيبقيك قائمًا ويحفظ لك كرامتك في اليوم الصعب.
- **افعل (KNW-048-ACT):** اكتب دلوقتي «يومك الأدنى» على ورقة — وخذ به في أول يوم متعثر.
- **افتكر (KNW-048-REM):** يوم ناقص خير من يوم منهار.
- **وسوم (معرّفات تقنية):** —

### KNW-049 — الاتساق فوق الكثافة

- **التصنيف:** الانضباط (`discipline`) · **مرحلة المحتوى:** any
- **اعرف (KNW-049-KNOW):** عادات صغيرة متكررة تتفوق على جهود كبيرة متقطعة — فالتراكم يكافئ التكرار، لا البطولة.
- **افهم (KNW-049-UND):** شهر من عشرين دقيقة يوميًّا (عشر ساعات موزعة) يترك أثرًا أعمق من عشر ساعات في يوم واحد ثم انقطاع. العقل والجسد يتعلمان بالتواتر، والهوية تتشكل بالتكرار، لا بالمشهد الأوحد.
- **افعل (KNW-049-ACT):** اختار أصغر نسخة من نشاطك المفيد تقدر تكرارها ٦ أيام أسبوعيًّا.
- **افتكر (KNW-049-REM):** الصغير المتكرر يتراكم، والكبير المتقطع يتبدد.
- **وسوم (معرّفات تقنية):** —

### KNW-050 — قلّل القرارات: القواعد المسبقة

- **التصنيف:** الانضباط (`discipline`) · **مرحلة المحتوى:** early
- **اعرف (KNW-050-KNOW):** كل قرار تخوضه في اللحظة يستهلك مساحة ويرتب احتمال خطأ — والقاعدة تحذف القرار أصلًا.
- **افهم (KNW-050-UND):** «هل أفتح الهاتف دلوقتي؟» سؤال تخسره في يوم متعب. أما «لا هاتف بعد الحادية عشرة» فليس سؤالًا أصلًا. والقاعدة الجيدة تنقل السلوك من قرار يومي متكرر إلى تنفيذ شبه تلقائي.
- **افعل (KNW-050-ACT):** حوّل أكثر ثلاثة سلوكيات تنزلق بها إلى قواعد صارمة، بلا استثناءات «صغيرة».
- **افتكر (KNW-050-REM):** القاعدة تُكتب مرة، وتُنفذ ألف مرة.
- **وسوم (معرّفات تقنية):** just-minute

### KNW-051 — الوحدة أقوى سياقات الخطر

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** early
- **اعرف (KNW-051-KNOW):** الانعزال المتكرر — وإن بدا مريحًا — هو البيئة اللي تنمو فيها السلاسل غالبًا.
- **افهم (KNW-051-UND):** الجماعة ليست ترفًا اجتماعيًّا، بل ضابط سلوكي طبيعي: حضور الناس يذكّرك بنسختك «العامة» ويصعّب الانزلاق إلى الخفاء. ومن شعر بجفاف علاقاته فليبدأ قبل الأزمة، لا بعدها.
- **افعل (KNW-051-ACT):** أعد حاجة من الجماعة ده الأسبوع: جلسة أسبوعية، رياضة جماعية، عمل تطوعي.
- **افتكر (KNW-051-REM):** لا تدع وحدتك تتراكم — كلفتها أعلى مما تظن.
- **وسوم (معرّفات تقنية):** loneliness, isolation

### KNW-052 — شخص واحد آمن يصنع فرقًا

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** early
- **اعرف (KNW-052-KNOW):** وجود شخص تعرف أنك تقدر الوصول إليه وقت الضيق يرتبط بمرونة أحسن في أغلب أبحاث التعافي.
- **افهم (KNW-052-UND):** لا يلزمك كشف تفاصيلك الخاصة؛ يكفي أن تعرف أن عندك مكانًا آمنًا تصله. جهّز ده الشخص في وقت الهدوء — برسالة أو اتفاق — حتى يكون الوصول إليه أثناء العاصفة تلقائيًّا.
- **افعل (KNW-052-ACT):** اختار شخصًا واحدًا وسجّله في قسم «شخص الدعم» — وابدأ برسالة محايدة اليوم.
- **افتكر (KNW-052-REM):** قوة اللحظة الحرجة تُصنع في اللحظة الهادئة.
- **وسوم (معرّفات تقنية):** loneliness, isolation

### KNW-053 — الثقة تُبنى بالاتساق لا بالاعتذار

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-053-KNOW):** الثقة المفقودة تُستعاد بنمط متكرر من السلوك — لا بوعود مكثفة بعد كل زَلّة.
- **افهم (KNW-053-UND):** من تأثر بسلوكك غالبًا أقرب الناس، وقد يرون تغيرك قبل ما تعلنه. الاعتذارات الكبيرة المتكررة تفقد قيمتها، والأفعال الصغيرة المنتظمة — حضور ووفاء وهدوء — هي اللي تعيد البناء حجرًا حجرًا.
- **افعل (KNW-053-ACT):** اختار التزامًا واحدًا صغيرًا تجاه أقرب الناس، والتزم به أربعة عشر يومًا — بلا إعلان.
- **افتكر (KNW-053-REM):** نمطك اليومي أبلغ من وعدك.
- **وسوم (معرّفات تقنية):** —

### KNW-054 — الفراغ العاطفي يبحث عن مخرج

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-054-KNOW):** من ينقصه التواصل الحقيقي قد يجد نفسه يملأ الفراغ بسلوك وحيد — حلٍّ يفاقم العزلة.
- **افهم (KNW-054-UND):** المشكلة أن الحل الوهمي يشبع دقائق ويعمّق الجوع بعدها: بعد الجلسة لا صحبة جديدة، ولا مهارة، ولا ذكرى. والاعتراف بالجوع العاطفي هو أول خطوة لملئه من مصادره الحقيقية.
- **افعل (KNW-054-ACT):** افحص أسبوعك: كم محادثة حقيقية كانت فيه؟ زد واحدة محددة في الأسبوع القادم.
- **افتكر (KNW-054-REM):** الجوع العاطفي يُطعم بالناس، لا بالمحتوى.
- **وسوم (معرّفات تقنية):** loneliness

### KNW-055 — التمرير اللانهائي مصمَّم ليبقى

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-055-KNOW):** تُصمَّم المنصات خصيصًا لإطالة جلستك: لا نهاية طبيعية، ولا إشارة توقف.
- **افهم (KNW-055-UND):** «هتصفح شوية» وعد بتدّيه لنظام معمول أصلًا عشان يكسره. لما تفهم إن اللعبة مش متكافئة من الأساس، تبطل تلعب بقواعدها وتحط قواعدك إنت: مؤقت، وجلسة بهدف واضح، ومفيش فتح من غير سبب.
- **افعل (KNW-055-ACT):** ضع قاعدة: لا فتح لأي منصة «عبورًا» — إما غرض محدد أو قفل.
- **افتكر (KNW-055-REM):** لو كانت اللعبة ضدك، فالخروج منها هو الفوز.
- **وسوم (معرّفات تقنية):** feeds, scrolling, aimless

### KNW-056 — التغذية: جوع لا شبع

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-056-KNOW):** محتوى لا نهائي بمكافآت متغيرة يترك انتباهك أكثر جوعًا مما بدأ، لا أقل.
- **افهم (KNW-056-UND):** كل تمريرة تعطيك «حاجة ما» أحيانًا، فتبقى تلتمس الجائزة اللي بعدها. والنتيجة: بعد نصف ساعة تصفح تكون أكثر مللًا وتوترًا وشهية للمحفز — والأرض مهيأة لأي سلسلة.
- **افعل (KNW-056-ACT):** ما تستخدمش التصفح «لتقتل الملل» — استخدم قائمة الملل البديلة في التطبيق.
- **افتكر (KNW-056-REM):** التصفح يفتح الشهية ولا يغلقها.
- **وسوم (معرّفات تقنية):** scrolling, feeds, boredom

### KNW-057 — «دقيقة واحدة»: أم الأبواب

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-057-KNOW):** أغلب السلاسل الكبرى في السجلات بتبدأ بوعد صغير: نظرة واحدة، دقيقة واحدة، فحص سريع.
- **افهم (KNW-057-UND):** الوعد الصغير بيفلت لأنه شكله من غير تكلفة — بسه مش بريء: ده أول رابط كامل من الإشارة للمكافأة، واللي بعده بيبقى استمرار منطقي، مش «فشل مفاجئ». عشان كده اقطع السلسلة من أولها، مش بعد ما تكبر.
- **افعل (KNW-057-ACT):** قاعدة صارمة: «لا أول نظرة» أسهل من «لا استكمال» — طبّقها حرفيًّا.
- **افتكر (KNW-057-REM):** مفيش «نظرة واحدة» — يا إما تقطع السلسلة من أولها، يا إما تكمل السلسلة.
- **وسوم (معرّفات تقنية):** just-minute, aimless, scrolling

### KNW-058 — جهاز أقل إغراءً في يوم واحد

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-058-KNOW):** حذف الإشعارات وتنظيم الشاشة الرئيسية بيقللوا الاستخدام المستهلك من غير ما تعتمد على «قوة إرادة».
- **افهم (KNW-058-UND):** الإشعار يجيء إليك، والشاشة المرتبة تجعلك تذهب أنت — والفرق بين الاتجاهين هو الفرق بين الانزلاق والقرار. تعديل واحد مدته عشر دقائق يغيّر طبيعة علاقتك بالجهاز كلها.
- **افعل (KNW-058-ACT):** دلوقتي: أطفئ إشعارات الترفيه، وانقل التطبيقات المستهلكة من الصف الأول.
- **افتكر (KNW-058-REM):** عشر دقائق تنظيم توفر ساعات مقاومة.
- **وسوم (معرّفات تقنية):** phone-habit, feeds

### KNW-059 — لا تختبر نفسك قدام المحفز

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-059-KNOW):** أن تقترب عمدًا من محفز تعرفه «لتختبر قوتك» من أسرع الطرق إلى سلسلة كاملة.
- **افهم (KNW-059-UND):** الاختبار يضعك في أسوأ الظروف: دافع مشتد، وانتباه مثبَّت على المحفز، ووعد داخلي بالسيطرة. والنتيجة شبه محسومة سلفًا — وليس ده دليل ضعف فيك، بل خطأ تكتيكي. القوة الحقيقية في ترتيب بيئتك، لا في المواجهة.
- **افعل (KNW-059-ACT):** استبدل الاختبار بالاحتكاك: المحفز أبعد، والمدخل أصعب، والبديل أسهل.
- **افتكر (KNW-059-REM):** لا تختبر نفسك قدام محفز تعرفه — بل ابعد عنه بذكاء.
- **وسوم (معرّفات تقنية):** testing

### KNW-060 — «اليوم ضاع أصلًا»: فخ انتهاك الامتناع

- **التصنيف:** الزلّة والانتكاسة (`relapse`) · **مرحلة المحتوى:** early
- **اعرف (KNW-060-KNOW):** الباحثين بيسمّوا ده «أثر انتهاك الامتناع»: زَلّة واحدة ممكن تتحول لجلسة كاملة، لأن الشخص استنتج إن «الخطة انهارت».
- **افهم (KNW-060-UND):** المنطق الداخلي يقول: «بعد ما حصلت الزَلّة، لا فرق دلوقتي» — وهذا خطأ حسابي بحت. فالضرر لا بيتقاس بـ«وقع أو لم يقع»؛ بل بيزيد كلما استمريت. والوقوف عند حدّ الزَلّة يقلّص الضرر أضعافًا، مهما كان اللي حصل قبلها.
- **افعل (KNW-060-ACT):** احفظ القاعدة وقت الهدوء: «حصلت زَلّة؟ أتوقف دلوقتي — ما بقي ليس إلزاميًّا».
- **افتكر (KNW-060-REM):** الزَلّة الواحدة لا تُلزم بما بعدها.
- **وسوم (معرّفات تقنية):** —

### KNW-061 — الفرق بين الزَلّة والانتكاسة

- **التصنيف:** الزلّة والانتكاسة (`relapse`) · **مرحلة المحتوى:** early
- **اعرف (KNW-061-KNOW):** الزَلّة واقعة واحدة محدودة، والانتكاسة عودة إلى النمط اللي فات مع استمرار أو تكرار — والفارق الحقيقي بينهإيه ما تفعله بعد كل منهما.
- **افهم (KNW-061-UND):** الزَلّة معلومة ثمينة عن ثغرة في خطتك؛ أما تحويلها إلى نمط فهو قرارات متعاقبة: «انسَ الأمر»، «ابدأ من الشهر القادم»، «ما عاد للاشيء معنى». وكل واحد من دي القرارات أشد وطأة من الزَلّة ذاتها.
- **افعل (KNW-061-ACT):** بعد أي زَلّة: وقّف، غيّر المكان، عد لنشاط طبيعي، وحلّل بعد كده براحة — ولا تقرر مصير الخطة دلوقتي.
- **افتكر (KNW-061-REM):** الزَلّة حدث عابر، والاستمرار قرار.
- **وسوم (معرّفات تقنية):** —

### KNW-062 — أهم سؤال بعد الزَلّة

- **التصنيف:** الزلّة والانتكاسة (`relapse`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-062-KNOW):** اللوم لا ينتج خطة، أما «فين كان يمكن قطع السلسلة؟» فينتجها فورًا.
- **افهم (KNW-062-UND):** اللوم يفتح الملف ويغلقه بلا مخرج. والسؤال الآخر يحدد حلقة بعينها: «قبل فتح المتصفح» أو «لما بقيت في الغرفة» — وأول ما تحديدها تعرف ما اللي تصلحه في خطتك القادمة.
- **افعل (KNW-062-ACT):** في المراجعة الهادئة: حدّد نقطة القطع الممكنة، وحوّلها فورًا إلى قاعدة «إذا… إذن».
- **افتكر (KNW-062-REM):** بعد كل زَلّة اسأل: فين كانت نقطة القطع؟
- **وسوم (معرّفات تقنية):** —

### KNW-063 — الأولوية بعد الزَلّة: إيقاف الامتداد

- **التصنيف:** الزلّة والانتكاسة (`relapse`) · **مرحلة المحتوى:** early
- **اعرف (KNW-063-KNOW):** الأولوية القصوى بعد أي زَلّة أو انتكاسة ليست التحليل، بل إيقاف الجلسة ومنع امتدادها.
- **افهم (KNW-063-UND):** التحليل وقت الانفعال يعطي نتائج مشوهة وقرارات متطرفة («سأحذف كل حاجة»… ثم يُورا الوعد). والترتيب الصحيح: وقّف، ابتعد، عد لطبيعتك، وبعد ما تهدأ خالص اجلس للتحليل الهادئ.
- **افعل (KNW-063-ACT):** بعد الزَلّة مباشرة: اقفل المصدر، غيّر المكان، ثم أي نشاط عادي. التحليل له موعد لاحق.
- **افتكر (KNW-063-REM):** وقّف الامتداد — ثم تعلّم من الزَلّة.
- **وسوم (معرّفات تقنية):** —

### KNW-064 — زَلّة اليوم بيانات خطة الغد

- **التصنيف:** الزلّة والانتكاسة (`relapse`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-064-KNOW):** كل زَلّة أو انتكاسة تحمل: المحفز، والثغرة، وأول علامة، وأسرع نقطة قطع — أي بالضبط اللي محتاجه خطتك.
- **افهم (KNW-064-UND):** من يابعد عن مراجعة اللي حصل يخسر أثمن مادة تطوير يمتلكها. فالتسجيل مع المراجعة يتحول إلى قاعدة جديدة في الخطة، وما يُكتم من دروسه يعود فيتكرر في السياق نفسه.
- **افعل (KNW-064-ACT):** بعد كل زَلّة ومراجعتها: أضف قاعدة وقاية واحدة على الأقل من درسها.
- **افتكر (KNW-064-REM):** استخدم اللي حصل معلومةً لتحسين الخطة القادمة.
- **وسوم (معرّفات تقنية):** —

### KNW-065 — سرعة التوقف: مؤشر تقدم حقيقي

- **التصنيف:** الزلّة والانتكاسة (`relapse`) · **مرحلة المحتوى:** any
- **اعرف (KNW-065-KNOW):** وقت التوقف بعد الزَلّة — فوري؟ دقائق؟ ساعة؟ — مؤشر أدق بكثير من «عدد الأيام» وحده.
- **افهم (KNW-065-UND):** اللي بيقوم بعد دقيقتين بيكون في وضع أحسن من اللي يستنى ساعتين، حتى لو «اليوم» في العد واحد. ومهارة إنك توقف بعد الزَلّة بتتحسن بالتدريب — والتقدم ده يستاهل يتشاف ويتقدّر.
- **افعل (KNW-065-ACT):** سجّل زمن التوقف كل مرة، وراقب اتجاهه في شاشة التقدم.
- **افتكر (KNW-065-REM):** سرعة وقوفك تُحسب تقدمًا — حتى جوا الزَلّة نفسها.
- **وسوم (معرّفات تقنية):** —

### KNW-066 — الرحمة بالذات ليست تساهلًا

- **التصنيف:** الرحمة بالذات (`self-compassion`) · **مرحلة المحتوى:** early
- **اعرف (KNW-066-KNOW):** تشير دراسات عديدة إلى أن التعامل الرحيم مع الذات بعد الخطأ يرتبط بالتزام أحسن، لا أسوأ.
- **افهم (KNW-066-UND):** الشائع أن القسوة «توقظ»، بس السجل العلمي يقول عكسه غالبًا: جلد الذات يرفع التوتر اللي يبحث عن مهرب، فيزيد احتمال التكرار. والرحمة ليست إعفاء من المسؤولية؛ إنها البيئة اللي تسمح بالتصحيح.
- **افعل (KNW-066-ACT):** بعد أي زَلّة: عامل نفسك كما تعامل صديقًا أخبرك بزَلّته — بصداقة وحزم معًا.
- **افتكر (KNW-066-REM):** كن صارمًا مع السلوك، رحيمًا بصاحبه.
- **وسوم (معرّفات تقنية):** —

### KNW-067 — جلد الذات يغذي الدورة

- **التصنيف:** الرحمة بالذات (`self-compassion`) · **مرحلة المحتوى:** early
- **اعرف (KNW-067-KNOW):** الإساءة الذاتية بعد الخطأ من أقوى العوامل المرتبطة بتكرار السلوك — عكس ما تتوقعه الغريزة.
- **افهم (KNW-067-UND):** الجلد يولّد إحساسًا سيئًا، والشعور السيئ هو نفسه وقود الهروب اللي بدأ السلسلة أول مرة. هكذا تدور الدورة: خطأ، ثم قسوة، ثم ضيق، ثم هروب. وكسرها عند «القسوة» أسهل من كسرها عند «الهروب».
- **افعل (KNW-067-ACT):** التقط جملة جلدك الذاتي القادمة، واكتب بديلها: جملة صادقة بسها محترمة.
- **افتكر (KNW-067-REM):** ما تخليش الزَلّة سببًا للزَلّة اللي بعدها.
- **وسوم (معرّفات تقنية):** sadness, anger

### KNW-068 — الصرامة مع السلوك، الرحمة معاك

- **التصنيف:** الرحمة بالذات (`self-compassion`) · **مرحلة المحتوى:** early
- **اعرف (KNW-068-KNOW):** الصيغة الأنجح تجمع أمرين: لا تبرير للسلوك، ولا إهانة لصاحبه.
- **افهم (KNW-068-UND):** التساهل يقول «لا بأس، عادي» فيعيد السلسلة، والقسوة تقول «أنت فاشل» فتدفع إلى الهروب. وبينهما تقع النبرة الأمثل: «ده لا يخدم حياتي، وسوقّفه دلوقتي — وأنا أكبر من زَلّتي».
- **افعل (KNW-068-ACT):** دوّن عبارتك الشخصية بهذه النبرة، وخلّيها أول ما تقرأ بعد أي زَلّة.
- **افتكر (KNW-068-REM):** اضبط النبرة: حازمة مع الفعل، كريمة مع النفس.
- **وسوم (معرّفات تقنية):** —

### KNW-069 — اختبار الصديق

- **التصنيف:** الرحمة بالذات (`self-compassion`) · **مرحلة المحتوى:** any
- **اعرف (KNW-069-KNOW):** طريقة عملية فورية: هل ستقول لصديق عزيز ما تقوله لنفسك دلوقتي؟
- **افهم (KNW-069-UND):** غالبًا هتلاقي إنك حاطط لنفسك معايير قاسية مش هترضى تحطها على غيرك. والفرق بين الطريقتين مش «صدق»؛ دي قسوة اتعلمتها — وتقدر تتعلم طريقة أرحم.
- **افعل (KNW-069-ACT):** اكتب ما ستقوله لصديق بعد نفس الزَلّة بالضبط — ثم قله لنفسك بصوت مسموع.
- **افتكر (KNW-069-REM):** كلّم نفسك كما تكلّم أعز أصدقائك.
- **وسوم (معرّفات تقنية):** —

### KNW-070 — الإصلاح خير من التعويض

- **التصنيف:** الرحمة بالذات (`self-compassion`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-070-KNOW):** بعد الزَلّة، السلوك البنّاء الصغير يخفض التوتر أكثر من «التعويض القاسي» — حرمان، أو إنهاك رياضي.
- **افهم (KNW-070-UND):** العقاب الذاتي بيبان «تكفيرًا»، بسه بيزيد الضيق اللي يغذي الدورة. وخطوة إصلاح صغيرة — مشي، ترتيب، جلسة عمل قصيرة — تعيد لك إحساس الكفاءة براحة، وهو بالضبط اللي محتاجه لحظتها.
- **افعل (KNW-070-ACT):** بعد أي زَلّة: نفّذ فعلًا واحدًا صغيرًا يعيدك لنسخك الفاعلة — بلا مبالغة ولا عقاب.
- **افتكر (KNW-070-REM):** لا عقاب — بل إصلاح هادئ.
- **وسوم (معرّفات تقنية):** —

### KNW-071 — الحياة الممتلئة أقوى درع

- **التصنيف:** الهدف (`purpose`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-071-KNOW):** أحسن واقٍ من السلوك القهري ليس «المقاومة»، بل حياة فيها ما يستحق الانتباه.
- **افهم (KNW-071-UND):** الفراغ مش بيفضل فاضي؛ بيتملي بأسرع مصدر تحفيز متاح. ولما يكون عندك مشاريع وعلاقات ومهارات بتنمو، السلوك القديم بيقلّ لوحده — لأن انتباهك بقى عنده حاجة تشغله.
- **افعل (KNW-071-ACT):** اختار مشروعًا واحدًا يهمك فعلًا، وامنحه ٣ فترات أسبوعية محددة.
- **افتكر (KNW-071-REM):** لا تقاوم الفراغ؛ املأه.
- **وسوم (معرّفات تقنية):** boredom, unstructured

### KNW-072 — مشروع له اسم وموعد

- **التصنيف:** الهدف (`purpose`) · **مرحلة المحتوى:** early
- **اعرف (KNW-072-KNOW):** الأهداف الضبابية («أطوّر نفسي») لا تحمي أمسياتك — والمحددة («كمّل دورة تعلّم الثلاثاء والخميس») تحميها.
- **افهم (KNW-072-UND):** الاسم والموعد يحوّلان «النية» إلى «حدث» في تقويمك يزاحم وقت الخطر. فالمساء المهدد بالفراغ يجد فيه موعدًا قبل كده ينتظره — وهذا استبدال مباشر للحلقة الأكثر تكرارًا: فراغ، ثم جهاز، ثم سلسلة.
- **افعل (KNW-072-ACT):** سمِّ مشروعك دلوقتي، وحدد موعدين ثابتين له في أسبوعك القادم.
- **افتكر (KNW-072-REM):** الموعد المحجوز يصمد، والوقت الفارغ ينزلق.
- **وسوم (معرّفات تقنية):** unstructured, boredom

### KNW-073 — التقدم المرئي يبني هوية

- **التصنيف:** الهدف (`purpose`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-073-KNOW):** رؤية تقدمك الملموس — صفوف منجزة، تدريبات، أعمال — تقوّي هويتك الجديدة أكثر من الشعارات.
- **افهم (KNW-073-UND):** الدليل اللي قدامك بيجاوب سؤال «أنا مين دلوقتي؟» من غير كلام كتير: أنا الشخص اللي بينجز ده. وكل ملف في مجلد الإنجاز دليل عكس رجوع النمط القديم — لأن الصراع ما بقاش بين «إرادة وضعف»، بس بين هويتين.
- **افعل (KNW-073-ACT):** أنشئ مكانًا ترى فيه تقدمك: مجلد أعمال، أو دفتر تدريب، أو قائمة إنجاز أسبوعية.
- **افتكر (KNW-073-REM):** ما تراه يتقدم — تصدقه.
- **وسوم (معرّفات تقنية):** —

### KNW-074 — من «أمتنع» إلى «أفعل»

- **التصنيف:** الهدف (`purpose`) · **مرحلة المحتوى:** late
- **اعرف (KNW-074-KNOW):** الهوية اللي مبنية على «الامتناع» هشة، لأنها بتعرّفك بالحاجة اللي بتهرب منها.
- **افهم (KNW-074-UND):** «أنا شخص ما بيعملش كذا» بتخلي انتباهك مع نفس الحاجة. بس «أنا شخص بيتدرّب، وبيقرأ، وبيبني مهارة، وبيحضر مجالسه» بتوجّه انتباهك لحاجة بتكبر. التعافي الحقيقي بناء هوية فعّالة، مش حراسة مستمرة.
- **افعل (KNW-074-ACT):** كمّل الجملة بثلاث إجابات: «أنا شخص يقوم يوميًّا بـ…» — وخلّيها صادقة.
- **افتكر (KNW-074-REM):** عرّف نفسك بما تبنيه، لا بما تابعد عنه.
- **وسوم (معرّفات تقنية):** —

### KNW-075 — القيم بوصلة أيام الضعف

- **التصنيف:** القيم (`values`) · **مرحلة المحتوى:** early
- **اعرف (KNW-075-KNOW):** الحماس يتذبذب — والقيم المكتوبة تبقى مرجعًا ثابتًا وقت التذبذب.
- **افهم (KNW-075-UND):** «ليه أتوقف دلوقتي؟» سؤال تخسره بسهولة وقت الملل، بسه يجد جوابًا قويًّا لما يكون مرسومًا قبل كده: لأن وقتي، وتركيزي، وعلاقاتي، وقيمي أغلى من دقائق هروب. القيم تحسم قبل ما بتبدأ المعركة.
- **افعل (KNW-075-ACT):** اكتب «ليه أفعل ده؟» بجملتك الخاصة في قسم القيم — وارجع إليها وقت الصعوبة.
- **افتكر (KNW-075-REM):** افتكر السبب اللي اخترته أنت.
- **وسوم (معرّفات تقنية):** —

### KNW-076 — اكتب قيمك بجملة لكل قيمة

- **التصنيف:** القيم (`values`) · **مرحلة المحتوى:** early
- **اعرف (KNW-076-KNOW):** القيمة غير المكتوبة إحساس عابر، والمكتوبة قرار تقدر ترجع له.
- **افهم (KNW-076-UND):** التمرين البسيط — جملة واحدة لكل قيمة («أحترم وقتي فلا أبيعه رخيصًا») — يحوّل كلمة عامة إلى معيار يومي. ولما تقوم قدام لحظة ضعف، تكون الجملة جاهزة أسرع من التفاوض.
- **افعل (KNW-076-ACT):** اختار ٣ قيم واكتب لكل واحدة جملتها — ثم اعرضها في شاشة القيم.
- **افتكر (KNW-076-REM):** ما لا يُكتب يضيع وقت الحاجة.
- **وسوم (معرّفات تقنية):** —

### KNW-077 — التنافر: وقود التغيير بلا جلد

- **التصنيف:** القيم (`values`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-077-KNOW):** الشعور بالفجوة بين قيمك وسلوكك محرك تغيير قوي — إن وُجّه إلى التعديل، لا إلى الجلد.
- **افهم (KNW-077-UND):** استخدام التنافر علشان تجلد نفسك («أنا منافق») بيحوّله لضيق من غير نتيجة. بس توجيهه للتعديل («السلوك ده مش شبه قيمة أنا مؤمن بيها — أعدّل أنهي حلقة؟») بيحوّله لخطة عمل.
- **افعل (KNW-077-ACT):** عند إحساس التنافر بعد زَلّة: اربطه مباشرة بقاعدة «إذا… إذن» جديدة، بدل محاكمة نفسك.
- **افتكر (KNW-077-REM):** الفجوة بين قيمك وسلوكك ليست محكمة — بل ورشة.
- **وسوم (معرّفات تقنية):** —

### KNW-078 — قيمك تُختار لا تُستعار

- **التصنيف:** القيم (`values`) · **مرحلة المحتوى:** early
- **اعرف (KNW-078-KNOW):** السبب اللي واخده من غيرك قوته بتضعف بسرعة — بس السبب اللي إنت كتبته بنفسك بيستحمل.
- **افهم (KNW-078-UND):** «لازم أبطل عشان الناس بتقول» حجة بتقع عند أول ضغط؛ بس «أنا بعمل ده عشان دراستي الترم ده» سبب شخصي أقوى. عشان كده التطبيق مش بيفرض عليك سبب — بسه بيطلب منك تكتبه بإيدك.
- **افعل (KNW-078-ACT):** حرّر سببك بينك وبين نفسك، وصغه بصياغتك أنت — لا بصياغة أحد غيرك.
- **افتكر (KNW-078-REM):** أصدق سبب هو اللي اخترته أنت.
- **وسوم (معرّفات تقنية):** —

### KNW-079 — التوبة: عودة لا محاكمة

- **التصنيف:** تأمل روحي (`spiritual`) · **مرحلة المحتوى:** early · روحي (بيظهر بس عند تفعيل المحتوى الروحي)
- **اعرف (KNW-079-KNOW):** في التصور الإسلامي، التوبة رجوع متجدد لا محاكمة — والباب لا يُغلق بتكرار الزَلّة.
- **افهم (KNW-079-UND):** قراءة التوبة «محاكمة» تولّد إحباطًا يطيل السلسلة، وقراءتها «عودة» تجعل الوقوف بعد الزَلّة هو نفسه أول خطوة توبة. والأثر السلوكي كبير: الأولى تُسقطك، والثانية ترفعك فورًا.
- **افعل (KNW-079-ACT):** بعد الزَلّة: وقّف — فهذه بداية التوبة — واستغفر بلا جلد، ثم اعمل خطوة تمنع التكرار.
- **افتكر (KNW-079-REM):** أول خطوة التوبة: توقف دلوقتي.
- **وسوم (معرّفات تقنية):** —

### KNW-080 — لا تقنط: القنوط يطيل السلسلة

- **التصنيف:** تأمل روحي (`spiritual`) · **مرحلة المحتوى:** any · روحي (بيظهر بس عند تفعيل المحتوى الروحي)
- **اعرف (KNW-080-KNOW):** الإحساس بأن «لا فائدة، لن تُقبل مني توبة» يدفع إلى مواصلة السلوك — وهو عكس ما يقتضيه الأمر.
- **افهم (KNW-080-UND):** اليأس يفكك الحساب كله: لو كانت الخسارة «مؤكدة»، فما معنى التوقف؟ بينما الأمل الواقعي يجعل لكل دقيقة وقوف قيمة قائمة بذاتها. وفي التراث الروحي: عدم القنوط من الرحمة هو شرط العودة نفسه.
- **افعل (KNW-080-ACT):** عند فكرة «ما عاد له داعي»: ذكّر نفسك أن التوقف دلوقتي — دلوقتي بالذات — له قيمة كاملة.
- **افتكر (KNW-080-REM):** العودة ممكنة من أي لحظة — ومنها دي.
- **وسوم (معرّفات تقنية):** sadness

### KNW-081 — الصلاة: مقاطعة كاملة للاندفاع

- **التصنيف:** تأمل روحي (`spiritual`) · **مرحلة المحتوى:** early · روحي (بيظهر بس عند تفعيل المحتوى الروحي)
- **اعرف (KNW-081-KNOW):** الصلاة توقف النشاط والانفعال معًا: حركة منظمة، وكلام مرتب، وتوجه داخلي.
- **افهم (KNW-081-UND):** بينما بيكمّل الجدل الداخلي أثناء «المشي والتفكير»، تمثل الصلاة مقاطعة صريحة لكل القنوات: الوضوء يغيّر الحال الجسدي، والوقوف يعيد التوجه. عشان كده هي من أنفع التدخلات وقت صعود الرغبة، لا بعده.
- **افعل (KNW-081-ACT):** عند صعود الرغبة: وضوء ثم ركعتان بنية الهدوء — ثم خطتك العملية.
- **افتكر (KNW-081-REM):** وقّف الاندفاع بجسدك وقلبك معًا.
- **وسوم (معرّفات تقنية):** fantasy, memory, stress

### KNW-082 — الذكر: تثبيت للانتباه وقت التشتت

- **التصنيف:** تأمل روحي (`spiritual`) · **مرحلة المحتوى:** any · روحي (بيظهر بس عند تفعيل المحتوى الروحي)
- **اعرف (KNW-082-KNOW):** تكرار صيغة قصيرة براحة يثبّت انتباهك ويشغل القناة الذهنية اللي تمر بها الأفكار.
- **افهم (KNW-082-UND):** الخيال المتصاعد محتاج قناة ذهنية فارغة يجري فيها — والذكر الهادئ يحتلها بصيغة ثابتة بطيئة. وليس الأمر «إخمادًا بالقوة»، بل إعادة توظيف للانتباه نفسه اللي كانت تستخدمه السلسلة.
- **افعل (KNW-082-ACT):** اختار صيغة قصيرة، وكررها مع تنفسك ثلاث دقائق وقت الضجيج الداخلي.
- **افتكر (KNW-082-REM):** الذكر يشغل القناة اللي تطلبها الأفكار.
- **وسوم (معرّفات تقنية):** thought, fantasy, anxiety

### KNW-083 — نيّة اليوم: القصد قبل العادة

- **التصنيف:** تأمل روحي (`spiritual`) · **مرحلة المحتوى:** any · روحي (بيظهر بس عند تفعيل المحتوى الروحي)
- **اعرف (KNW-083-KNOW):** اليوم اللي بيبدأ من غير نية واضحة بتديره العادة — وعاداتك القديمة مستنياه.
- **افهم (KNW-083-UND):** «عايز أعمل إيه في يومي؟» سؤال صغير بيحوّل اليوم من انجرار لاختيار. واللي يصحى من غير قصد غالبًا بيلاقي المساء نفسه ماشي ناحية النمط اللي متعود عليه — مش للنمط اللي هو عايزه.
- **افعل (KNW-083-ACT):** كل صباح: جملة نية واحدة لليوم («اليوم: أنجز مهمتي وأحفظ مسائي») قبل أول شاشة.
- **افتكر (KNW-083-REM):** نِيّتك صباحًا تحرّكك حيث عايز، لا حيث تنجرف.
- **وسوم (معرّفات تقنية):** —

### KNW-084 — التعافي ليس خطًا مستقيمًا

- **التصنيف:** المدى الطويل (`long-term`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-084-KNOW):** المسار الواقعي: فترات تقدم وفترات صعبة — والمهم اتجاه الخط العام، لا استقامته.
- **افهم (KNW-084-UND):** اللي يتوقع خط طالع من غير أي تعثر هيتفاجئ بأول نزلة، ويقرر إن «كل حاجة انهارت» — وساعتها النزلة المؤقتة ممكن تتحول لانتكاسة فعلية. لما تتوقع التذبذب من قبلها، بتشوف الأيام الصعبة كطقس عابر، مش كنهاية الطريق.
- **افعل (KNW-084-ACT):** قيم شهرك لا يومك: هل الاتجاه العام أحسن من الشهر الماضي؟
- **افتكر (KNW-084-REM):** الانحدارات لا تلغي الرحلة.
- **وسوم (معرّفات تقنية):** —

### KNW-085 — الضغط يوقظ الأنماط القديمة

- **التصنيف:** المدى الطويل (`long-term`) · **مرحلة المحتوى:** late
- **اعرف (KNW-085-KNOW):** في فترات الإجهاد الكبرى — امتحانات، خسارات، اضطراب نوم — قد تعود أنماط قديمة، والجاهزية هي الفرق.
- **افهم (KNW-085-UND):** رجوع النمط مش معناه «كل حاجة ضاعت»؛ معناه إن ظروفك عدّت قدرة تحمّلك الحالية. اللي مجهّز لأيام الضغط بخطة — حد أدنى، وحماية بالليل، وشخص دعم — بيعدّيها أسرع؛ واللي مش مجهّز بتفاجئه.
- **افعل (KNW-085-ACT):** اكتب دلوقتي «خطة أسبوع العاصفة»: ما اللي يُترك، وما اللي يبقى مهما كان؟
- **افتكر (KNW-085-REM):** العواصف معروفة — تجهّز لها قبل هبوبها.
- **وسوم (معرّفات تقنية):** stress

### KNW-086 — الهدف: أن محتاج ده أقل

- **التصنيف:** المدى الطويل (`long-term`) · **مرحلة المحتوى:** late
- **اعرف (KNW-086-KNOW):** أحسن نتيجة لأداة مساعدة أن تصبح غير ضرورية — لا أن تتحول إلى اعتماد جديد.
- **افهم (KNW-086-UND):** التطبيق مرحلة تدريب: بيسجّل، وبيفكّرك، وبينظّم، لحد ما المهارة والعادة يبقوا عندك بشكل مستقل. ومن علامات النضج: تفحص رغبتك من غير التطبيق، وتقطع من غير مؤقت، وتفهم أنماطك من غير خريطة — وساعتها استخدامه يبقى اختيار، مش احتياج.
- **افعل (KNW-086-ACT):** كل فترة اسأل: أي أجزاء نظامي صارت تعمل وحدها؟ خفف الاعتماد عليها تدريجيًّا.
- **افتكر (KNW-086-REM):** أقوى مستخدمي التطبيق هم من يحتاجونه أقل كل شهر.
- **وسوم (معرّفات تقنية):** —

### KNW-087 — رصيد التعافي يتراكم

- **التصنيف:** المدى الطويل (`long-term`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-087-KNOW):** ما يحميك في المدى الطويل ليس «الامتناع» وحده، بل رصيد: علاقات، ومهارات، وصحة، وروتين.
- **افهم (KNW-087-UND):** ده الرصيد هو ما يجعل اللي بيحصل عابرًا يبقى عابرًا — لأن حياة مليئة تنتظرك فور الوقوف. ومن فرّغ حياته لمجرد المراقبة جعل أي زَلّة كارثة كبرى، إذ مفيش حاجة غيرها في الصورة.
- **افعل (KNW-087-ACT):** راجع رصيدك شهريًّا: علاقة أعمق؟ مهارة أعلى؟ جسد أقوى؟ اختار بندًا واحدًا للنمو.
- **افتكر (KNW-087-REM):** ابنِ حياة تجعل الزَلّة حدثًا صغيرًا.
- **وسوم (معرّفات تقنية):** —

### KNW-088 — الهوية الجديدة تُصان بالممارسة

- **التصنيف:** المدى الطويل (`long-term`) · **مرحلة المحتوى:** late
- **اعرف (KNW-088-KNOW):** بعد شهور من الثبات يبقى تحدٍّ صغير: عادات يومية خفيفة تحمي النمط الجديد.
- **افهم (KNW-088-UND):** الوقت الطويل يجعل المراقبة تتراجع — وهذا صحي ومطلوب — بس بعض الممارسات الصغيرة تستحق البقاء: نوم منتظم، وهاتف برا الغرفة، ومراجعة أسبوعية خفيفة. فضمانة الهوية ليست الحذر، بل العيش وفقها.
- **افعل (KNW-088-ACT):** حدّد ٣ ممارسات «دائمة» لن تتوقف مهما طال الثبات — واكتبها.
- **افتكر (KNW-088-REM):** الاستقرار ليس غياب الممارسة، بل خفّتها.
- **وسوم (معرّفات تقنية):** —

### KNW-089 — القاعدة الذهبية: جهّز قبل وقت الضعف

- **التصنيف:** الوقاية (`prevention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-089-KNOW):** كل أدوات الحماية بتتظبط وإنت هادي — وتقريبًا مفيش حاجة بتتظبط وقت العاصفة.
- **افهم (KNW-089-UND):** أثناء الذروة يرتفع التوتر ويضيق التفكير، فلا تثق بقرار «سأفعّل الحاجب دلوقتي» في دي اللحظة. الحاجب المفعَّل قبل كده، والهاتف المُبعَد سلفًا، والقاعدة المكتوبة قبلًا — هي اللي تعمل وقتها فعلًا.
- **افعل (KNW-089-ACT):** خصص موعدًا أسبوعيًّا هادئًا لمراجعة حمايتك: الحواجز، والقواعد، والبيئة.
- **افتكر (KNW-089-REM):** من جهّز في الهدوء، نجا في العاصفة.
- **وسوم (معرّفات تقنية):** —

### KNW-090 — الالتزام المسبق: قيّد خياراتك قبل لحظة الضعف

- **التصنيف:** الوقاية (`prevention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-090-KNOW):** لما تقيّد خياراتك قبل كده — الحاجب بكلمة مرور بيد غيرك، ومواعيد صارمة — ترتفع كلفة الانزلاق.
- **افهم (KNW-090-UND):** الالتزام المسبق بيفيد لأنه بيتاخد وإنت هادي، قبل ما الموقف بيبدأ. مثال معروف: تدي صديقك كلمة مرور الحاجب، فيمنع «نفسك المتعبة بالليل» من فتح الباب اللي «نفسك الصاحية الصبح» قفلته.
- **افعل (KNW-090-ACT):** اختار التزامًا واحدًا صعب الفتح: حاجب بكلمة مرور ليست بيدك، أو جهاز يبيت براًا.
- **افتكر (KNW-090-REM):** أقفل الباب وأنت واقوم خارجه.
- **وسوم (معرّفات تقنية):** —

### KNW-091 — قواعد «إذا… إذن»: خطة طوارئ مكتوبة

- **التصنيف:** الوقاية (`prevention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-091-KNOW):** القاعدة المكتوبة «إذا حصل كذا… إذن أعمل كذا» ممكن تنقذك لما التفكير الواضح يختفي.
- **افهم (KNW-091-UND):** لحظة الخطر مش وقت تصميم؛ دي وقت تنفيذ وبس. وكل قاعدة «إذا… إذن» كتبتها وإنت هادي بتشيل قرار كامل من وقت الخطر — وكل قرار متحسم من قبل كده بيخليك أسرع وبيزود فرصة إنك تعدّي اللحظة.
- **افعل (KNW-091-ACT):** راجع قواعدك أسبوعيًّا، وأضف واحدة لكل ثغرة ظهرت في سجلك.
- **افتكر (KNW-091-REM):** الخطة المكتوبة تسبق العاصفة.
- **وسوم (معرّفات تقنية):** —

### KNW-092 — مراجعة نقاط الخطر الأسبوعية

- **التصنيف:** الوقاية (`prevention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-092-KNOW):** أنماطك بتتغير مع حياتك — والخريطة القديمة تحميك أقل مع كل أسبوع يمر بلا تحديث.
- **افهم (KNW-092-UND):** الخطر الأول عندك (الليل المتأخر) ممكن يخف وييجي مكانه خطر تاني (فراغ بعد الامتحانات). المراجعة الأسبوعية الخفيفة — خمس دقايق على خريطة المحفزات — بتخلي خطتك مناسبة لحياتك الحالية، مش لنسخة قديمة منها.
- **افعل (KNW-092-ACT):** كل أسبوع: افتح خريطة المحفزات، ولاحظ أعلى تغير، وعدّل قاعدة واحدة تخصه.
- **افتكر (KNW-092-REM):** خريطة لا تُحدّث تضلّ الطريق.
- **وسوم (معرّفات تقنية):** —

### KNW-093 — احتكاك مدروس عند كل مدخل

- **التصنيف:** الوقاية (`prevention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-093-KNOW):** خير حمايتك ليس جدارًا واحدًا، بل ثوانٍ من الصعوبة الإضافية عند كل مدخل.
- **افهم (KNW-093-UND):** السلسلة محتاج مداخل: بحث، ومنصة، وتطبيقًا، وصورة. وكل مدخل تجعله أصعب قليلًا — خروجًا من الحساب، أو حاجبًا، أو حذفًا للتطبيق، أو بحثًا آمنًا — يخفض احتمال الدخول الآلي: فالمدخل الصعب يُترك، والسهل يُفتح.
- **افعل (KNW-093-ACT):** افحص اليوم مداخلك الخمسة الأولى، وأضف احتكاكًا لكل واحد.
- **افتكر (KNW-093-REM):** مش محتاج سورًا — محتاج أبوابًا أثقل.
- **وسوم (معرّفات تقنية):** digital

### KNW-094 — تدرّب على الطوارئ وأنت هادئ

- **التصنيف:** مهارات الطوارئ (`emergency-skills`) · **مرحلة المحتوى:** early
- **اعرف (KNW-094-KNOW):** مهارة الأزمة تُبنى في الهدوء — كما يُتدرب على الإطفاء قبل الحريق، لا أثناءه.
- **افهم (KNW-094-UND):** أول مرة تجرّب فيها «اقفل، واخرج، وامشِ عشر دقايق» ما ينفعش تكون وقت ذروة حقيقية. جرّبها عند درجة ٢ أو ٣ لحد ما الخطوات تبقى مألوفة — عشان وقت الذروة تمشي عليها من غير تفكير، لأنك اتدرّبت عليها قبل كده.
- **افعل (KNW-094-ACT):** مرة أسبوعيًّا: نفّذ تدخلًا واحدًا كاملًا وأنت لوة هادئة.
- **افتكر (KNW-094-REM):** المهارة المجهَّزة تنفّذها، والمهارة الجديدة تفاجئك.
- **وسوم (معرّفات تقنية):** —

### KNW-095 — قاعدة الأزمة: خطوة واحدة بس

- **التصنيف:** مهارات الطوارئ (`emergency-skills`) · **مرحلة المحتوى:** early
- **اعرف (KNW-095-KNOW):** وقت الذروة، التفكير في «خطة كاملة» بيشلّ — بس خطوة واحدة بتتعمل فورًا.
- **افهم (KNW-095-UND):** يستوعب الدماغ وقت التوتر العالي خيارات أقل بكثير. عشان كده كلما ارتفع الخطر قلّت الخيارات المعروضة قدامك: صورة واحدة، وزر واحد، وخطوة واحدة. وهذا ليس تبسيطًا للأسلوب؛ إنه تصميم يناسب حالة عقلك في دي اللحظة.
- **افعل (KNW-095-ACT):** احفظ الترتيب: اقفل المصدر، ثم غيّر المكان، ثم خطوة فعلية. مفيش حاجة غيرها دلوقتي.
- **افتكر (KNW-095-REM):** مش محتاج تحل كل حاجة دلوقتي — ركّز بس على الخطوة الحالية.
- **وسوم (معرّفات تقنية):** —

### KNW-096 — قلّة الخيارات ميزة الطوارئ

- **التصنيف:** مهارات الطوارئ (`emergency-skills`) · **مرحلة المحتوى:** any
- **اعرف (KNW-096-KNOW):** كلما ارتفع الخطر، وجب أن تقل الخيارات المعروضة — لا أن بتزيد.
- **افهم (KNW-096-UND):** قائمة فيها عشر تدخلات وقت الذروة معناها عمليًا «مفيش اختيار»، لأن الاختيار نفسه بيبقى عبء. النظام الجيد يقدّم اختيار واحد واضح وقت الخطر العالي، وثلاثة وقت المتوسط، ومكتبة كاملة وقت الانخفاض. القليل هنا أرحم.
- **افعل (KNW-096-ACT):** لا تتصفح الخيارات وقت الخطر — خذ المقترح الأول ونفّذه.
- **افتكر (KNW-096-REM):** في الأزمة ينجو من يقلّ اختياره، ويغرق من يستعرضه.
- **وسوم (معرّفات تقنية):** —

### KNW-097 — أول ٦٠ ثانية تحسم

- **التصنيف:** مهارات الطوارئ (`emergency-skills`) · **مرحلة المحتوى:** early
- **اعرف (KNW-097-KNOW):** أغلب ما يحدد نتيجة الموجة يقع في دقيقتها الأولى، قبل ما التوتر يعلى ويضيق الاختيار.
- **افهم (KNW-097-UND):** الرغبة بعد دقيقة من أول إشارة أضعف بكثير من بعد عشر دقائق تصفح. وكل ثانية تؤجل فيها القفل ترفع كلفة القفل نفسه — عشان كده قاعدة «اقفل فورًا» ما تسيبش مجالًا لأول مساومة.
- **افعل (KNW-097-ACT):** عند أول علامة: نفّذ حركة القطع في الثانية نفسها — القراءة والتحليل بعدها.
- **افتكر (KNW-097-REM):** اقطع دلوقتي — حلّل بعد كده.
- **وسوم (معرّفات تقنية):** just-minute

### KNW-098 — بعد هبوط الخطر: سجّل ثم عد

- **التصنيف:** مهارات الطوارئ (`emergency-skills`) · **مرحلة المحتوى:** any
- **اعرف (KNW-098-KNOW):** النجاة من موجة عالية معلومة ثمينة — وتسجيلها بعد هبوطها مباشرة أدق ما يكون.
- **افهم (KNW-098-UND):** تمحو الذاكرة تفاصيل الأزمة سريعًا (وهذا من لطفها)، فتفقد أثمن ما فيها: المحفز، وأول علامة، والتدخل اللي نجح. ودقيقة تسجيل بعد الهدوء تحفظ الدرس، ثم عودتك الطبيعية ليومك تُغلق الموقف على خير.
- **افعل (KNW-098-ACT):** بعد كل أزمة تمر بسلام: سجّل سريعًا المحفز والتدخل اللي نجح، ثم استأنف يومك.
- **افتكر (KNW-098-REM):** نجوت؟ سجّلها — ثم عُد لحياتك.
- **وسوم (معرّفات تقنية):** —

### KNW-099 — بروتوكول أول ثلاثين دقيقة من يومك

- **التصنيف:** الانضباط (`discipline`) · **مرحلة المحتوى:** early
- **اعرف (KNW-099-KNOW):** أول نص ساعة بعد ما تصحى بتحدد نغمة اليوم كله: اللي يبدأها من غير خطة بيسيبها للعادة، والعادة القديمة مستنية.
- **افهم (KNW-099-UND):** الاستيقاظ مرحلة انتقال: نص صاحي، من غير مهمة، والموبايل على بُعد إيد — ودي بالظبط مواصفات نافذة الخطر، حتى لو شكلها بريء في الصبح. وروتين صغير ثابت — مية، وحركة، وفطار، وبعدها أول مهمة — بيقفل النافذة قبل ما تفتح.
- **افعل (KNW-099-ACT):** قرّر قبل كده أول ثلاثة حاجات تفعلها بعد الاستيقاظ، وخلّي الهاتف آخرها، لا أولها.
- **افتكر (KNW-099-REM):** يومك بيبدأ قبل ما تفتح أول شاشة.
- **وسوم (معرّفات تقنية):** phone-habit

### KNW-100 — ما تخليش الهاتف أول قرار في يومك

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-100-KNOW):** فتح الهاتف فور الاستيقاظ يعطي يومك للآخرين قبل ما تبدأه بنفسك: إشعارات، وأخبار، ومزاج جاهز.
- **افهم (KNW-100-UND):** أول ما تراه في يومك يسبق كل قراراتك؛ فلو كانت خلاصة ما فاتك في نومك، بدأت يومك راكضًا خلفه. وعقلك في أول دقائقه أكثر قابلية للتشكيل — فأعطه بدايتك أنت، لا آخر اللي حصل.
- **افعل (KNW-100-ACT):** اجعل للهاتف موعدًا بعد كده: أول ساعة لك وحدك — ماء، وحركة، وفطور، وأول مهمة — ثم افتحه بقصد.
- **افتكر (KNW-100-REM):** من يفتح هاتفه أولًا يستقبل يومه، ومن يؤخره يصنعه.
- **وسوم (معرّفات تقنية):** phone-habit

### KNW-101 — العودة من العمل أو الدراسة إلى البيت

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-101-KNOW):** الانتقال من بيئة إلى أخرى يترك فراغًا قصيرًا يملؤه أسرع خيار متاح — وغالبًا هو الهاتف.
- **افهم (KNW-101-UND):** وصولك البيت من غير خطة غالبًا بيكون: استلقاء، وبعده الموبايل، وبعده تصفح من غير هدف، وبعده سهرة من غير حساب. دي مش بالضرورة رغبة في السلوك؛ دي لحظة تفريغ طبيعية أخدت طريق متعود عليه. واللي بيرتب الدقايق دي من قبلها، بيقدر يمسكها.
- **افعل (KNW-101-ACT):** ضع «جسر عودة» ثابتًا: خلع ملابس العمل، وغسل الوجه، ثم نشاط محدد — مشي قصير أو جلسة مع الأهل — قبل أي شاشة.
- **افتكر (KNW-101-REM):** الانتقال بلا خطة انتقالٌ إلى العادة.
- **وسوم (معرّفات تقنية):** aimless, phone-habit

### KNW-102 — بين مهمتين: ما تفتحش باب التصفح

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** any
- **اعرف (KNW-102-KNOW):** الفراغ القصير بين مهمتين أخصب لحظات الانزلاق: إنهاءٌ يمنح ارتياحًا، والمهمة اللي بعدها لم بتبدأ بعد.
- **افهم (KNW-102-UND):** تحس بعد إنهاء كل مهمة بحاجة إلى «فاصل» — وهذا حقك. المشكلة في الفاصل المفتوح: تصفح لا يعرف نهايته، فيبتلع المهمة اللي بعدها معه. والفاصل اللي له طول محدد يستريح ولا يسرق.
- **افعل (KNW-102-ACT):** اجعل الفاصل حاجة له بداية ونهاية: قيامًا من المكتب، وماءً، وتمددًا، ونظرة من النافذة — عشر دقائق ثم تعود.
- **افتكر (KNW-102-REM):** استرح بين المهام، وما تفتحش بينها بابًا لا تغلقه.
- **وسوم (معرّفات تقنية):** aimless, scrolling

### KNW-103 — دقائق الانتظار: أصغر نافذة وأكثرها تكرارًا

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-103-KNOW):** المواصلات والطوابير والمواعيد المؤجلة فراغ متكرر يمتلئ بالتمرير — وأثره التراكمي لا يقل عن الجلسات الكبيرة.
- **افهم (KNW-103-UND):** تعوّدك قتلَ الانتظار بالشاشة درّبك على ألا تحتمل لحظة واحدة بلا تحفيز. والقدرة اللي تخسرها هنا — احتمال الفراغ القصير — هي نفسها اللي تحتاجها وقت الرغبة. فالانتظار تمرين مجاني متكرر.
- **افعل (KNW-103-ACT):** احتفظ ببديل انتظار دائم: كتاب في الجيب، أو مقطع محفوظ للمراجعة، أو مراقبة أنفاسك — أي حاجة غير التمرير المفتوح.
- **افتكر (KNW-103-REM):** اصبر في الانتظار الصغير، تجد صبرًا وقت الرغبة.
- **وسوم (معرّفات تقنية):** boredom, phone-habit, aimless

### KNW-104 — بعد إنجاز مهمة كبيرة: إزاي تستريح بلا تصفح مفتوح

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-104-KNOW):** بعد ما تخلص شغل كبير، اليقظة بتقل والرغبة في «مكافأة» بتعلى — وهنا ممكن أمسية كاملة تنزلق.
- **افهم (KNW-104-UND):** إنجازك الكبير يستهلك تركيزك، فيبحث عقلك المتعب عن راحة سريعة، والتصفح أسرع راحة متاحة. بسه راحة تفتح الشهية ولا تغلقها — فتخرج من التعب إلى تعب أكبر مع ذنب. والمكافأة الحقيقية محتاج أن تشبه ما أنجزت: هادئة، مشبعة، لا تسرق المساء.
- **افعل (KNW-104-ACT):** خطّط لمكافأة ما بعد الإنجاز قبل كده: وجبة تحبها، أو مشيًا، أو لقاءً، أو نومًا مبكرًا — وما تسيبش قرار الراحة لحظة الإرهاق.
- **افتكر (KNW-104-REM):** لحظة ما بعد الإنجاز أضعف لحظاتك — خطّط لها من قبل.
- **وسوم (معرّفات تقنية):** aimless, boredom

### KNW-105 — الإجازة ونهاية الأسبوع: لما يختفي الروتين

- **التصنيف:** الانضباط (`discipline`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-105-KNOW):** أكثر ما يسقط في الإجازات ليس الالتزام، بل بنية اليوم نفسها — فلا مواعيد تنظم الوقت.
- **افهم (KNW-105-UND):** أيام الأسبوع بتحميك بروتينها: شغل، أو محاضرات، أو نوم بدري. بس الإجازة بتحسسك بحرية، والحرية من غير شكل بتتحول بسرعة لسهر وفراغ وعزلة. والأيام المفتوحة ما ينفعش تتدار بالنية بس؛ خلي لها جدول صغير إنت تختاره.
- **افعل (KNW-105-ACT):** صمّم لعطلتك هيكلًا خفيفًا: موعد استيقاظ، ونشاطًا واحدًا برا البيت، وموعد نوم — ثلاث نقاط بس تحفظ اليوم.
- **افتكر (KNW-105-REM):** اليوم المفتوح محتاج أعمدة قليلة، وإلا انهار.
- **وسوم (معرّفات تقنية):** unstructured, late-night

### KNW-106 — السفر: إزاي تحمي قواعدك برا بيئتك

- **التصنيف:** المدى الطويل (`long-term`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-106-KNOW):** السفر يفكك ثلاثة أعمدة دفعة واحدة: المكان، والوقت، وطريقة وصولك إلى الجهاز.
- **افهم (KNW-106-UND):** قواعدك اتعملت لبيئة إنت عارفها؛ لو البيئة اتغيرت — فندق، أو بيت أهل، أو سفر — القواعد ممكن ما تبقاش مناسبة، وتحس إنك «في استثناء». والاستثناء المفتوح هو بالظبط اللي الأنماط القديمة بتستناه. شوية قواعد تقدر تشيلها معاك أحسن من قواعد كتير بتسيبها.
- **افعل (KNW-106-ACT):** قبل السفر حدّد ثلاث قواعد محمولة لا تتأثر بالمكان: موعد نوم، وهاتف برا السرير، وقاعدة الساعة الأخيرة — أينما كنت.
- **افتكر (KNW-106-REM):** خذ معاك أقل القواعد وأمتنها، وما تسيبش التزامك في البيت.
- **وسوم (معرّفات تقنية):** late-night, phone-habit

### KNW-107 — رمضان: إدارة نومك وطاقتك مع تغير كل المواعيد

- **التصنيف:** النوم (`sleep`) · **مرحلة المحتوى:** any
- **اعرف (KNW-107-KNOW):** في رمضان يتقدم السهر، وتتغير وجبات الطاقة وأوقاتها، ويتغير وقت خلوتك بالجهاز — كله في وقت يقل فيه النوم.
- **افهم (KNW-107-UND):** أثقل ما في الشهر ليس نهاره، بل ليله: سهر طويل، وانعزال مع الهاتف بعد التراويح، ونقص نوم يجعل ضبط الغد أصعب. ومن رتّب لياليه — نومًا بعد التراويح أو بعده بساعة، ووقتًا محددًا للجهاز — عبر الشهر دون أن يفقد إيقاعه.
- **افعل (KNW-107-ACT):** حدّد من أول الشهر: موعد نومك، وآخر حضور رقمي، ووقت خلوتك بالجهاز — وخلّيها ثابتة كما المواقيت.
- **افتكر (KNW-107-REM):** رمضان يغير المواعيد ولا يغير القواعد.
- **وسوم (معرّفات تقنية):** late-night, isolation

### KNW-108 — فترة الامتحانات: ضغط وجلوس طويل وفراغ بين المذاكرة

- **التصنيف:** التوتر (`stress`) · **مرحلة المحتوى:** any
- **اعرف (KNW-108-KNOW):** موسم الامتحانات يجمع ثلاثة عوامل في وقت واحد: توترًا مرتفعًا، وجلوسًا طويلًا وحيدًا، وفجوات فراغ بين المواد.
- **افهم (KNW-108-UND):** تقول لنفسك إنك «تستحق فاصلًا» كلما أنهيت فصلًا، والفاصل المعتاد بيبدأ تصفحًا وينتهي ساعات. ثم يأتي التوتر نفسه ليبرر الهروب من صعوبة المراجعة. هكذا تتحول أسابيع المذاكرة إلى بيئة مثالية للسلسلة — دون أن تقصد.
- **افعل (KNW-108-ACT):** قسّم مذاكرتك إلى كتل محددة بفواصل محددة: خمسين دقيقة مذاكرة، وعشر دقائق حركة — وامنع الشاشة في الفاصل أينما كنت.
- **افتكر (KNW-108-REM):** في الامتحانات يُدار الفراغ بإيقاع صارم، لا بمزاج مرهق.
- **وسوم (معرّفات تقنية):** stress, aimless

### KNW-109 — العودة إلى التطبيق بعد غياب طويل

- **التصنيف:** المدى الطويل (`long-term`) · **مرحلة المحتوى:** any
- **اعرف (KNW-109-KNOW):** الانقطاع عن التطبيق مش معناه بالضرورة انقطاعًا عن التقدم — بس العودة محتاج بابًا صغيرًا، لا محاكمة.
- **افهم (KNW-109-UND):** أكتر حاجة بتأجل الرجوع هي الإحراج من «التقرير»: تفتح التطبيق، تلاقيه بيسألك عن أيام غياب، وتفتكر كل اللي حصل. التطبيق أداة مش مدرسة؛ مش محتاج اعتذار ولا شرح. ارجعله زي ما ترجع لخريطة بعد ما مشيت من غيرها: اعرف مكانك، وخد الخطوة اللي بعدها.
- **افعل (KNW-109-ACT):** في أول عودة: لا تراجع التاريخ كله. افتح خطة اليوم بس، ونفّذ مهمة واحدة، وسجّل يومك الجديد.
- **افتكر (KNW-109-REM):** العودة مش محتاج قصة؛ محتاج خطوة.
- **وسوم (معرّفات تقنية):** —

### KNW-110 — إعادة بناء الروتين بعد أسبوع فوضوي

- **التصنيف:** الانضباط (`discipline`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-110-KNOW):** أسبوع مضطرب واحد لا يهدم ما بنيته — بس التسويف في إعادة الترتيب يفعل.
- **افهم (KNW-110-UND):** بعد أسبوع فوضى، إعادة النظام ممكن تبان «مشروع كبير» فتأجلها، فيبقى أسبوع الفوضى اتنين. بس الروتين مش بيتبني من الصفر كل مرة؛ بيتسترجع: كان شغال قبل كده، ويرجع النهارده بقرار صغير واحد، من غير انتظار بداية أسبوع مثالية.
- **افعل (KNW-110-ACT):** استدعِ اليوم ركنًا واحدًا بس: موعد نوم الليلة، أو مهمة الصباح غدًا. والباقي يعود وراءه وحده.
- **افتكر (KNW-110-REM):** الروتين اللي ضاع بيرجع بقرار، ومش لازم تبنيه من الصفر.
- **وسوم (معرّفات تقنية):** —

### KNW-111 — ابنِ قائمة ملل تنقذك أنت

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-111-KNOW):** قائمة الملل في التطبيق لا تعمل وهي فارغة — والبديل اللي لا تكتبه لا تجده وقت الحاجة.
- **افهم (KNW-111-UND):** وقت الملل مش وقت اختراع بدائل: مخك تعبان، وأسرع اختيار هو المعتاد. عشان كده القائمة بتتكتب وإنت هادي علشان تستخدمها وقت اللخبطة — بديلين لكل خمس دقايق، وبديل لكل نص ساعة، من الحاجات اللي إنت عارف إنها بتشغلك فعلًا، مش الحاجات اللي «المفروض» تشغلك.
- **افعل (KNW-111-ACT):** افتح قائمة الملل دلوقتي وضيف ٣ بدائل مجرّبة: حاجة بإيدك، وحاجة بجسمك، وحاجة بصوت — من حياتك إنت.
- **افتكر (KNW-111-REM):** القائمة اللي شبهك بتتستخدم، والقائمة المثالية بتتقرأ وبس.
- **وسوم (معرّفات تقنية):** boredom, aimless

### KNW-112 — تعلّم احتمال الملل بلا شاشة

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-112-KNOW):** تحمّل الملل مهارة بتضعف بعدم الاستخدام، وتقوى بالتدريب — كأي احتمال آخر.
- **افهم (KNW-112-UND):** كل مرة تمحو فيها مللًا بتمريرة سريعة، يتعلم عقلك أن الفراغ خطر يجب الهروب منه فورًا. ثم تأتي لحظة رغبة حقيقية، فلا يجد منك صبر ولا مهلة. والتدريب واضح ومحدود: دقائق من فراغ مقصود، تتعلم فيها أن الملل لا يقتل — بل يخفت ويمر.
- **افعل (KNW-112-ACT):** تدرّب يوميًّا على «فراغ مقصود»: خمس دقائق انتظار أو مشي بلا هاتف ولا سماعات — وراقب الإحساس يصعد ثم يهبط.
- **افتكر (KNW-112-REM):** من يحتمل الملل قليلًا كل يوم يجد سعة أكبر وقت العاصفة.
- **وسوم (معرّفات تقنية):** boredom, phone-habit

### KNW-113 — الراحة الحقيقية لا بتبدأ بتصفح

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-113-KNOW):** التصفح ليس راحة — إنه نشاط يتظاهر بها: انتباه مستهلك، ونتيجة تعب جديد.
- **افهم (KNW-113-UND):** الراحة الحقيقية بتجدد حاجة: تهدي ضربات قلبك، أو تفرّغ صدرك، أو ترجّعك لجسمك. التصفح مش بيعمل ده؛ بينقل تعبك من ملل لإرهاق مع شهية مفتوحة. عشان كده ممكن تفضل ساعة، وتقوم أتعب مما كنت قبل ما بتبدأ.
- **افعل (KNW-113-ACT):** فرّق بين نوعين: حاجات بتجدّدك — استلقاء من غير شاشة، ومشي، ومية دافية، وتنفس هادي — وحاجات استهلاك. الراحة الحقيقية في الأولى؛ التانية مش راحة أصلًا.
- **افتكر (KNW-113-REM):** إذا خرجت من الراحة أتعب مما دخلت، فالاسم خطأ والاختيار كذلك.
- **وسوم (معرّفات تقنية):** boredom, scrolling

### KNW-114 — بعد يوم مرهق: افصل قبل ما تختار راحتك

- **التصنيف:** التوتر (`stress`) · **مرحلة المحتوى:** early
- **اعرف (KNW-114-KNOW):** في نهاية اليوم القاسي تكون أقل وضوحًا وأكثر قابلية للاختيار الآلي — والاختيار الآلي عندك معروف.
- **افهم (KNW-114-UND):** الإرهاق مش زي التوتر: مش بس بيفكّرك، ده بيفضّيك من الطاقة، فتروح البيت من غير طاقة تاخد قرار. هنا «الفحص السريع» ممكن يبان كأنه الحل الوحيد، لأنه مش محتاج منك مجهود. والفصل بين إنك توصل وإنك تاخد قرار — حتى كام دقيقة لنفسك — بيرجع لك الاختيار.
- **افعل (KNW-114-ACT):** عند وصولك منهكًا: عشر دقائق تفصل — غسل وجه، وماء، وجلوس بلا شاشة — ثم قرر إزاي تستريح بيدك، لا بعادتك.
- **افتكر (KNW-114-REM):** لا تدع الإرهاق يختار عنك.
- **وسوم (معرّفات تقنية):** stress, late-night

### KNW-115 — الغضب: لما تبحث عن مخرج سريع

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** early
- **اعرف (KNW-115-KNOW):** الغضب يشتعل سريعًا ويبحث عن تصريف فوري — والسلوك دايمًا أقرب مخرج متاح.
- **افهم (KNW-115-UND):** قبل الغضب مشهد، وبعده هدوء قد تندم فيه. واللي بيحصل بينهما: طاقة مرتفعة محتاج مصرفًا، وقرار يتخذ في أسرع لحظاتك تشويشًا. وتفريغ الغضب بالسلوك لا يطفئه؛ يخزنه ويعيده أسرع. والفاصل القصير — تأجيل أي قرار حتى ينزل النبض — هو كل المهارة.
- **افعل (KNW-115-ACT):** عند الغضب: قاعدة التأجيل المطلق — لا هاتف، ولا غرفة وحدك، ولا قرار. ماء بارد وحركة، ثم تعامل مع السبب بعد ما تهدأ.
- **افتكر (KNW-115-REM):** الغضب يستعجل القرار، وأنت محتاج عكسه خالص.
- **وسوم (معرّفات تقنية):** anger

### KNW-116 — الحزن والإحباط: لما يصبح الهروب أسهل من الجلوس مع الشعور

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** early
- **اعرف (KNW-116-KNOW):** الحزن يبطئك ويفرغك، فبيبان أي نشاط يخفف ثقله مغريًا — وأسرع المخففات هو السلوك.
- **افهم (KNW-116-UND):** الفرق بين الحزن والغضب أن الحزن مش بيطلب مواجهة؛ يطلب منك أن تجلس معه قليلًا. والهروب منه لا يمحوه؛ يؤجله ويضيف إليه ذنب الجلسة. ومقابلته مش معناها الغرق في الشعور، بل تسميته، وشيئًا صغيرًا من العناية بجسدك: أكل، ونوم، وشخص يسمعك.
- **افعل (KNW-116-ACT):** عند الحزن: سمِّه بصوتك — «أنا حزين اليوم» — ثم اختار أصغر عناية: حمامًا، أو مشيًا، أو مكالمة. الهروب يؤجل، والعناية تُمرِّر.
- **افتكر (KNW-116-REM):** الحزن يمر أسرع لما لا تدفعه بعيدًا.
- **وسوم (معرّفات تقنية):** sadness

### KNW-117 — القلق الاجتماعي: لا تدع العزلة تصبح ردك التلقائي

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-117-KNOW):** ابعد عن الناس بعد موقف اجتماعي ثقيل يريح لحظة، ثم يتحول استسلامًا للوحدة — والوحدة بيئة السلسلة.
- **افهم (KNW-117-UND):** كل مرة تنسحب فيها لأن الموقف الاجتماعي مرهق، يتعلم عقلك أن الانسحاب هو العلاج — فتتسع المسافة بينك وبين الناس خطوة كل مرة. ولا يُطلب منك إلقاء خطب؛ يكفي ألا تقطع الخيط: حضور قصير، أو رد متأخر، أو جلسة موجزة. الخيط الممدود يكفي لبقائك في الصورة.
- **افعل (KNW-117-ACT):** بعد أي موقف اجتماعي ثقيل: لا تقرر الانسحاب الكلي. حدّد أصغر حضور قادم — رسالة، أو مكالمة قصيرة، أو موعدًا قريبًا — وأبقه.
- **افتكر (KNW-117-REM):** العزلة تخفف قلق اللحظة وتعمّق المشكلة على المدى.
- **وسوم (معرّفات تقنية):** anxiety, loneliness

### KNW-118 — الخجل والعار بعد الزَلّة: وقود لا لازم يُشعل

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** early
- **اعرف (KNW-118-KNOW):** الخجل بعد السلوك ممكن يبقى أتقل من الذنب: الذنب بيقول «عملت حاجة وحشة»، والعار بيقول «إنت وحش» — والفرق بينهم بيغيّر مسار التعافي.
- **افهم (KNW-118-UND):** الذنب يدفع إلى الإصلاح: اعتراف، وتنظيف، وقاعدة جديدة. أما العار فيدفع إلى الاختفاء: انسحاب، ووحدة، ثم جلسة أكبر للتخفيف — فيتكرر. والفارق بيبدأ من صياغة ما تقوله لنفسك: صِف اللي حصل، لا من أنت. «حصلت زَلّة» جملة يمكن البناء عليها، و«أنا فاسد» جملة تُغلق الطريق.
- **افعل (KNW-118-ACT):** بعد الزَلّة، اكتب اللي حصل بصيغة الفعل لا بصيغة الهوية: ماذا حدث، وما قبله، وما بعده — بلا حكم على ذاتك.
- **افتكر (KNW-118-REM):** الذنب يقوّم والعار يهدم — فانتبه لما تحدث به نفسك.
- **وسوم (معرّفات تقنية):** sadness

### KNW-119 — لما لا تعرف ما تحس به: ابدأ بأبسط اسم

- **التصنيف:** الإحساس (`emotions`) · **مرحلة المحتوى:** early
- **اعرف (KNW-119-KNOW):** ليست كل الحالات واضحة؛ أحيانًا يضج صدرك بشعور لا تجد له اسمًا — فيتخذ القرار عنك.
- **افهم (KNW-119-UND):** الشعور غير المسمى بلا مقود: لا تعرف مصدره فلا تعرف علاجه، فيقودك أي اقتراح سريع — والسلوك أسرع المقترحات. والتسمية نصف العلاج حتى لو كانت تقريبية: كلمة واحدة — «متعب؟ متوتر؟ حزين؟» — تحوّل الضباب إلى حاجة تراه وتتعامل معه.
- **افعل (KNW-119-ACT):** عند الضيق المبهم: اسأل نفسك ثلاث مرات «ما ده؟» واكتب أول كلمة تقترب — ما تستناش الاسم الدقيق؛ خذ الأقرب.
- **افتكر (KNW-119-REM):** كلمة أقرب إلى شعورك خير من صمت يبتلعه.
- **وسوم (معرّفات تقنية):** stress

### KNW-120 — بعد محادثة صعبة: لا تدع التوتر يختار عنك

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** any
- **اعرف (KNW-120-KNOW):** النقاش الحاد يترك بقايا: نبضًا مرتفعًا، وافتراضات معلقة — فتصير ليلًا محفزًا مثاليًا.
- **افهم (KNW-120-UND):** بعد الخلاف لا يهدأ دماغك بسرعة: يعيد المشهد، ويكمل الجمل اللي لم تقل، ويطلب تصريفًا. وهذه الطاقة المتبقية إن لم تجد مصرفًا وصلت الليل متوهجة — والباقي معروف: وحدتك، وجهازك. وقفل الجرح الصغير مبكرًا، ولو بفاصل مقصود، يطفئ ما تبقى.
- **افعل (KNW-120-ACT):** بعد أي خلاف: اقفل الحلقة بجسدك لا بذكائك — مشي عشرين دقيقة أو جهد بدني قصير قبل المساء، ثم قرر لو إنت عايز متابعة الحديث.
- **افتكر (KNW-120-REM):** المحادثة تنتهي، وبقاياها لا تنتهي إلا بقرارك.
- **وسوم (معرّفات تقنية):** anger, stress

### KNW-121 — الوحدة رسالة: تارة تطلب هدوءًا وتارة صوتًا

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** early
- **اعرف (KNW-121-KNOW):** الشعور بالوحدة واحد، وحاجته مختلفة: أحيانًا تعب من الناس، وأحيانًا جوع إليهم — والعلاجان متعاكسان.
- **افهم (KNW-121-UND):** إنك تبعد شوية عن الناس وإنت مرهق ممكن يكون راحة صحية، بس إنك تعزل نفسك وإنت محتاج تواصل ممكن يبقى هروب بيغذي نفسه. الخلط بين الحالتين بيخلي الانسحاب رد واحد لكل حاجة، وبعدها تلاقي نفسك بعد أسابيع في عزلة ما اخترتهاش. سؤال صغير قبل ما تنسحب ممكن يفرّق بين الراحة والهروب.
- **افعل (KNW-121-ACT):** لما تحس بالوحدة اسأل نفسك: «أنا تعبان من الناس، ولا مفتقدهم؟» — لو الأول، خد راحة محددة بوقت. ولو التاني، اتواصل حتى برسالة واحدة الليلة.
- **افتكر (KNW-121-REM):** للوحدة وجوه؛ اقرأ الوجه قبل ما تختار العزلة.
- **وسوم (معرّفات تقنية):** loneliness

### KNW-122 — إزاي تطلب دعمًا دون أن تحكي كل حاجة

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** early
- **اعرف (KNW-122-KNOW):** طلب الدعم مش بيفتح سجلّك كله؛ تقدر تطلب مساندة في جزء واحد من غير ما تكشف باقي التفاصيل.
- **افهم (KNW-122-UND):** ناس كتير بتتردد تطلب دعم لأنها فاكرة إنه معناه إنها تحكي كل حاجة قدام شخص تاني. بس طلب الدعم له مستويات: «يومي تقيل، وكنت محتاج مكالمة» طلب كامل من غير تفاصيل. والشخص المناسب يساندك على قد ما يقدر، وإنت اللي بتحدد قد إيه تشارك.
- **افعل (KNW-122-ACT):** جهّز جملة طلب محددة بلا تفاصيل: «مرّ بي يوم صعب — ممكن نتكلم قليلًا؟» — وامنع نفسك من شرح كل حاجة أولًا.
- **افتكر (KNW-122-REM):** الطلب المحدد أسهل في الاستجابة، ومش لازم الاعتراف يكون كامل.
- **وسوم (معرّفات تقنية):** loneliness

### KNW-123 — التحدث عن رحلة التغيير: إمتى ومع من؟

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-123-KNOW):** إفصاحك عن رحلتك قرار مستقل عن الرحلة نفسها: بعض الناس أمان، وبعضهم بيئة خطرة.
- **افهم (KNW-123-UND):** الشخص المناسب يجعل كلامك أخف، وحملك موزعًا، والخطأ في الشخص يجعل كلامك سلاحًا في غير موضعه، أو نظرة تلاحقك. ومفيش قائمة معيارية للبشر — يوجد اختبار بسيط: هل يحفظ ده الشخص الأسرار الصغيرة اليوم؟ وهل الأمان عنده يكبر أم يصغر؟ ابدأ بأصغر مشاركة، وامنحه وقتًا قبل ما بتزيد.
- **افعل (KNW-123-ACT):** جرّب الأول قبل ما تحكي: شارك جزء صغير بس — «بحاول أبني عادة أحسن في إدارة وقتي» — وشوف رد الفعل، وبعدها قرر هتشارك قد إيه.
- **افتكر (KNW-123-REM):** الإفصاح درجات، وليس بابًا واحدًا تفتحه كله.
- **وسوم (معرّفات تقنية):** —

### KNW-124 — إصلاح علاقة تأثرت: الوعود أقل من الأفعال

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-124-KNOW):** علاقة تأثرت بسلوكك لا تُصلح بخطاب اعتذار كبير، بل بعودة ملحوظة تدريجية للحضور.
- **افهم (KNW-124-UND):** من تأثر بسلوكك لم يفقد حبه غالبًا؛ فقد ثقته فيك. لذا لا تطلب الثقة بكلام — أعدها بسلوك مرئي متكرر: حضور في الموعد، وهدوء في الخلاف، وانتباه في التفاصيل الصغيرة. والوقت هنا حليفك لا عدوك: الثقة تعود بمعدل ما تراكمت به أول مرة.
- **افعل (KNW-124-ACT):** اختار حضور بسيط وثابت مع الشخص ده — معاد أسبوعي، أو عادة انتباه يومية — والتزم بيه من غير إعلان ومن غير ما تطلب مقابلة.
- **افتكر (KNW-124-REM):** الثقة ما بترجعش بالكلام عنها، بس باللي بيبان في تصرفاتك.
- **وسوم (معرّفات تقنية):** —

### KNW-125 — لما يأتيك المحتوى المثير من شخص آخر

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-125-KNOW):** ليست كل بداية السلسلة منك: رسالة في مجموعة، أو مقطع أرسله صديق، أو إشارة في محادثة — كلها بدايات لا تطلب إذنك.
- **افهم (KNW-125-UND):** وصول المحتوى ليك مش ذنبك — وده صحيح في الوصول، مش في الاستمرار. بعد ما وصل لك المحتوى، القرار عندك: هتوقف دلوقتي ولا هتكمل؟ وقاعدة قصيرة بتحسم أغلب الموقف: ما تكملش تتفرج علشان تقيّم — اقفل الأول، وبعدها قيّم لو حبيت.
- **افعل (KNW-125-ACT):** ضع قاعدة استقبال: أي محتوى مثير يصل من غيرك — قفل فوري بلا تقييم، ثم قرار مع الشخص — حدود، أو صمت، أو كتم المجموعة — بعد الهدوء.
- **افتكر (KNW-125-REM):** ما يصلك ليس قرارك، وما يبقى مفتوحًا هو قرارك.
- **وسوم (معرّفات تقنية):** images, feeds

### KNW-126 — مجموعات الدردشة: ضع حدودًا قبل ما تحتاجها

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-126-KNOW):** المجموعات النشطة قناة مفتوحة دائمة في جيبك: ضجيج متواصل، ومحتوى غير منتقى، وسهر مجاني.
- **افهم (KNW-126-UND):** المجموعة ممكن تديك إحساس بالتواصل من غير تكلفة التواصل — بس محتواها مش متختار على مقاسك، وممكن يعدّي منها حاجات تتجاوز حدودك من غير ما حد يقصد. والخروج الكامل مش الحل الوحيد ولا دايمًا الأنسب؛ المهم إدارة وصولك: كتم أوقات، وإخفاء اللي مش مناسب ليك، وقاعدة خروج بالليل.
- **افعل (KNW-126-ACT):** اليوم: اكتم المجموعات غير الضرورية نهارًا، وحدد «موعد جرد» واحدًا تتصفح فيه الرسائل — لا أن تظل تصلك طول اليوم.
- **افتكر (KNW-126-REM):** المجموعة بتخدمك لما تدخلها في الوقت اللي تختاره، وبتستهلكك لما تفضل تفتحها كل شوية.
- **وسوم (معرّفات تقنية):** feeds, late-night

### KNW-127 — التوصيات: لا تدع الصفحة تختار خطوتك اللي بعدها

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-127-KNOW):** ما بيظهر لك بعد كل مشاهدة ليس محايدًا: نظام يقترح عليك المشابه، والمشابه يقود إلى المشابه.
- **افهم (KNW-127-UND):** التوصيات مصممة لتمديد مشاهدتك، لا لحماية اختيارك. عشان كده «مقطع واحد» جوا التوصيات ليس مقطعًا واحدًا: إنه باب مفتوح على سلسلة اقتراحات كلها مهيأة لما تشتهيه لحظتها. وكسر «اللي بعده الآلي» — قفل قبل ظهور الاقتراح اللي بعده — هو كل الفارق.
- **افعل (KNW-127-ACT):** حدّد إنت نهاية الجلسة: شفت اللي فتحته بقصد؟ اقفل قبل ما يعرض عليك اللي بعده. وفعّل «إيقاف سجل المشاهدة» لو متاح.
- **افتكر (KNW-127-REM):** الصفحة لا تعرف إمتى تكفيك — فكن أنت من يعرف.
- **وسوم (معرّفات تقنية):** feeds, scrolling

### KNW-128 — التعرض غير المقصود: اقفل أولًا، قيّم بعد كده

- **التصنيف:** العادات الرقمية (`digital`) · **مرحلة المحتوى:** early
- **اعرف (KNW-128-KNOW):** بيحصل العرض العارض مهما حصّنت بيئتك: صورة في تغذية، أو مشهد في مقطع، أو إعلان — والفارق كله في الثانية اللي بعدها.
- **افهم (KNW-128-UND):** الفضول بعد العرض العارض ممكن يلبس شكل «تقييم»: خليني أتأكد ده إيه؟ وساعتها العرض بيتحول لبحث مقصود. القاعدة بسيطة وحاسمة: القفل مش محتاج إنك تفهم شفت إيه. العرض إنت ما اخترتوش، بس الاستمرار في النظر اختيار.
- **افعل (KNW-128-ACT):** أول ما بيظهر قدامك عرض عارض: بص بعيد واقفل في نفس الثانية — من غير تحليل ومن غير «تأكد». وفهم اللي حصل ييجي بعدين في مراجعة هادية لو احتجت.
- **افتكر (KNW-128-REM):** العارض ليس اختيارك، والثانية اللي بعدها اختيارك بالكامل.
- **وسوم (معرّفات تقنية):** images, curiosity

### KNW-129 — سلسلة النقرات: اقطعها عند أول نقرة

- **التصنيف:** البيئة (`environment`) · **مرحلة المحتوى:** early
- **اعرف (KNW-129-KNOW):** الطريق إلى السلوك ليس قفزة واحدة، بل نقرات متتابعة: فتح، ثم بحث، ثم تبويب، ثم صورة — وكل نقطة فيها قابلة للقطع.
- **افهم (KNW-129-UND):** السلسلة ممكن تبان حتمية في آخرها، بس في أولها بتبقى هشة: نقرة واحدة ممكن ما تحصلش. وكل تأخير صغير عند أول خطوة ممكن يهدم المسار كله، لأن السلسلة محتاجة خطوات ورا بعض عشان تكتمل. والقطع عند أول نقرة أسهل بكتير — بعد كده كل نقرة بتصعّب الوقوف.
- **افعل (KNW-129-ACT):** تدرّب على قطع أول خطوة تحديدًا: يدك تمتد للجهاز بلا سبب؟ ما تفتحشه. فتحت بحثًا؟ اقفل قبل النتيجة الأولى. تدريبك الحقيقي عند النقرة الأولى.
- **افتكر (KNW-129-REM):** اقطع أول نقرة قبل ما تكمل السلسلة.
- **وسوم (معرّفات تقنية):** search, just-minute

### KNW-130 — «لا تختبر نفسك» مهارة قرار، لا شعار

- **التصنيف:** المحفزات (`triggers`) · **مرحلة المحتوى:** early
- **اعرف (KNW-130-KNOW):** الامتناع عن الاختبار ليس قسوة على نفسك؛ إنه قراءة واقعية لمواجهة تخسرها غالبًا.
- **افهم (KNW-130-UND):** يقنعك الاختبار بصيغة «دلوقتي أثبت أني تحسنت» — وكل شروط التجربة ضدك: انتباه مثبَّت على المحفز، ودافع مشتد، وثقة لحظية زائفة. والقرار الأذكى ليس مقاومة أقوى جوا الاختبار، بل عدم دخوله من أساسه: المسافة أمان، والاقتراب مخاطرة بلا مكسب.
- **افعل (KNW-130-ACT):** لما يطرح ذهنك «اختبارًا»، قرر بالقاعدة المكتوبة لا بلحظة الثقة: «أنا لا أختبر — ده قراري منذ زمن» — ثم ابتعد فيزيائيًّا.
- **افتكر (KNW-130-REM):** الامتناع عن الاختبار ليس ضعفًا؛ إنه رفض للعبة خاسرة.
- **وسوم (معرّفات تقنية):** testing

### KNW-131 — قراءة خريطة المحفزات دون غرق في التفاصيل

- **التصنيف:** المحفزات (`triggers`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-131-KNOW):** الخريطة أداة قرار، لا تقرير كامل: منها محتاج ثلاث قراءات بس — أعلى محفز، وأخطر وقت، وأول علامة.
- **افهم (KNW-131-UND):** بعض الناس أول ما يفتحوا الخريطة يدخلوا في كل سجل لوحده، فيزهقوا قبل ما يستفيدوا. الاستخدام الصح شبه قراءة الطقس: مش محتاج تدرس كل قياس في التاريخ؛ بص على أكتر الأنماط ظهورًا في آخر أسبوعين، وخد قرار واحد يخصها. خمس دقايق ممكن تطلع منها بقاعدة؛ التفاصيل الكاملة غالبًا تطلعلك صداع.
- **افعل (KNW-131-ACT):** افتح الخريطة بخمس دقائق محددة، واستخرج ثلاثًا بس: المحفز الأعلى، والوقت الأخطر، وأول علامة بتتكرر — ثم اقفل وحوّلها إلى قاعدة.
- **افتكر (KNW-131-REM):** الخريطة تُقرأ لقرار واحد، لا لدراسة كل حاجة.
- **وسوم (معرّفات تقنية):** —

### KNW-132 — من محفز واحد إلى قاعدة واحدة

- **التصنيف:** الوقاية (`prevention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-132-KNOW):** الوقاية لا تُبنى دفعة واحدة؛ بل بجسر صغير متكرر: ملاحظة من السجل تصبح قاعدة في الخطة.
- **افهم (KNW-132-UND):** قواعد كتير بتتكتب بحماس يوم وتتنسى؛ بس القاعدة اللي طالعة من سجل حقيقي بتكون شايلة سببها معاها: «٤ من آخر سلاسلي بدأت بعد الحادية عشرة» جملة لوحدها بتقود لقاعدة من غير جدال. وكل محفز بيتكرر في سجلّك هو قاعدة لسه مستنية تتكتب.
- **افعل (KNW-132-ACT):** بعد كل مراجعة: خد أكتر محفز بيتكرر، واكتب له قاعدة «إذا… إذن» واحدة محددة — وبعدها وقف. قاعدة واحدة تتنفذ أحسن من عشر قواعد تتنسي.
- **افتكر (KNW-132-REM):** سجلك قائمة قواعد نائمة — أيقظها واحدة كل مرة.
- **وسوم (معرّفات تقنية):** —

### KNW-133 — مراجعة الوقاية الأسبوعية: قاعدة واحدة تكفي

- **التصنيف:** الوقاية (`prevention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-133-KNOW):** مراجعة أسبوعية صغيرة تحفظ خطتك مطابقة لحياتك — بشرط ألا تتحول إلى إعادة بناء كل حاجة.
- **افهم (KNW-133-UND):** الخطأ الشائع إن المراجعة تتحول لمشروع: تعيد كتابة الخطة كلها، فتتعب وتسيبها. المراجعة الفعالة أقصر وأوضح: شوف إيه الجديد في أسبوعك، وعدّل قاعدة واحدة بس تخصه. والباقي لو لسه مناسب ما تلمسوش؛ الاستقرار نفسه جزء من الحماية.
- **افعل (KNW-133-ACT):** في مراجعتك الأسبوعية اسأل: «ما اللي تغيّر ده الأسبوع؟» — ثم عدّل قاعدة واحدة تخصه بس، وأبقِ الباقي كإيه.
- **افتكر (KNW-133-REM):** قاعدة واحدة معدولة أسبوعيًّا تبني نظامًا في سنة.
- **وسوم (معرّفات تقنية):** —

### KNW-134 — لما تفشل قاعدة الوقاية: أصلح القاعدة لا نفسك

- **التصنيف:** الوقاية (`prevention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-134-KNOW):** القاعدة اللي لم تصمد ليست فشلك — إنها معلومة أن تصميمها محتاج تعديلًا.
- **افهم (KNW-134-UND):** أول ردين عند فشل قاعدة: جلد الذات («أنا فاشل»)، أو إلغاء الخطة («القواعد لا تنفع») — وكلاهما يضيع الدرس. فالقاعدة أخطأت في التصميم لا في النية: واسعة جدًّا؟ تعتمد على مزاجك؟ شرطها نادر؟ ضيّق مداها، وارفع احتكاكها، وأعد التجربة.
- **افعل (KNW-134-ACT):** عند فشل قاعدة: اكتب فين بالضبط انكسرت — الوقت؟ المكان؟ الحالة؟ — ثم أعد صياغتها أضيق وأصعب الالتفاف، وأعد التجربة.
- **افتكر (KNW-134-REM):** القاعدة الفاشلة تصميم قديم، لا حكمًا عليك.
- **وسوم (معرّفات تقنية):** —

### KNW-135 — شدّة الرغبة حاجة، وقربك من التنفيذ حاجة آخر

- **التصنيف:** الرغبات (`urges`) · **مرحلة المحتوى:** early
- **اعرف (KNW-135-KNOW):** الدرجة اللي تسجلها في فحص الرغبة ليست الرقم كله: هناك شدّة ما تحس به، وهناك مسافة بينك وبين الفعل.
- **افهم (KNW-135-UND):** رغبة شديدة وأنت بين الناس أهون من رغبة متوسطة وأنت وحدك في غرفتك والجهاز بجانبك. فالشدة تخبرك بحرارة الإحساس، والقرب يخبرك باحتمال التنفيذ — وعشان كده محتاج خطتك إلى الاثنين: خفّف الشدة بالمعالجة، وخفّف القرب بالحركة: غيّر المكان، وأبعد الجهاز، واذهب حيث الناس.
- **افعل (KNW-135-ACT):** في كل فحص رغبة اسأل سؤالين: كم الشدة؟ وما مسافة الفعل دلوقتي؟ — وابدأ بمعالجة الأقرب إلى التنفيذ أولًا.
- **افتكر (KNW-135-REM):** قربك من التنفيذ أهم من شدة الرغبة وحدها؛ عشان كده عالج القرب أولًا.
- **وسوم (معرّفات تقنية):** —

### KNW-136 — اقرأ تقدمك للفهم، لا للحكم

- **التصنيف:** المدى الطويل (`long-term`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-136-KNOW):** أرقام التقدم أداة تتعلم منها أنماطك؛ لو اتحولت لدرجة بتحاسب نفسك عليها، بتفقد وظيفتها.
- **افهم (KNW-136-UND):** من ينظر إلى عدّاد الأيام بوصفه «نتيجته» يعيش بين نشوة الرقم وذعر كسره. والمنظور الأصح أن المؤشرات لغة سجلك: تخبرك إمتى تترك مواعيدك، وأي ظرف يضغط عليك، وأي تدخل ينفع معاك. والرقم اللي يهبط ليس حكمًا نهائيًّا؛ إنه سطر جديد في دفتر التعلم.
- **افعل (KNW-136-ACT):** عند فتح شاشة التقدم اسأل: «ماذا يعلّمني ده الأسبوع؟» — مش «كم نقاطي؟» — وخذ من كل زيارة درسًا واحدًا بس.
- **افتكر (KNW-136-REM):** التقدم سجل بنقراه، مش امتحان بنعدّيه.
- **وسوم (معرّفات تقنية):** —

### KNW-137 — المراجعة الهادئة: إزاي تتعلم من سجل واحد دون اجترار

- **التصنيف:** الزلّة والانتكاسة (`relapse`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-137-KNOW):** بين المراجعة المفيدة والاجترار خيط رفيع: الأولى تبحث عن نقطة قطع، والثانية تعيد تشغيل المشهد.
- **افهم (KNW-137-UND):** الاجترار بيرجع يفتح الحدث بكل تفاصيله مرة ورا مرة — فالمشاعر بتفضل عايشة وترجع الدائرة تشتغل. المراجعة الهادية تحدد وقتها وسؤالها: جلسة واحدة بعد ما تهدى، تجاوب على ٣ حاجات بس: إيه المحفز؟ فين كانت نقطة القطع؟ وإيه القاعدة الجديدة؟ والباقي يتقفل.
- **افعل (KNW-137-ACT):** اجعل لمراجعتك هيكلًا ثابتًا: موعدًا بعد الهدوء، وثلاثة أسئلة بس، وقاعدة واحدة تخرج بها — ثم أنهِ الجلسة فعلًا.
- **افتكر (KNW-137-REM):** راجع لاستخراج القاعدة، لا لإعادة عرض الحدث.
- **وسوم (معرّفات تقنية):** —

### KNW-138 — الساعة الأولى بعد الزَلّة

- **التصنيف:** الزلّة والانتكاسة (`relapse`) · **مرحلة المحتوى:** early
- **اعرف (KNW-138-KNOW):** اللي بيحصل في الساعة اللي بعدها للزَلّة يحدد حجمها النهائي، أكثر من الزَلّة نفسها.
- **افهم (KNW-138-UND):** في الساعة دي ممكن تكون في أخطر حالاتك: توتر عالي، حكم متسرع، ورغبة في «إنهاء اليوم». القرارات الكبيرة وقتها غالبًا بتكون سيئة: جلسة تكملية، أو حذف التطبيق بعصبية، أو قسم إنك تعاقب نفسك. الخطوة هنا أبسط من كل ده: اقفل، وخد دش، واخرج من الأوضة، وكل حاجة، وارجع لنشاط عادي — والقرارات الكبيرة تتأجل لحد ما تهدى.
- **افعل (KNW-138-ACT):** في الساعة الأولى بعد الزَلّة نفّذ الخطوات القصيرة بس: قفل، وماء، وتغيير مكان، وطعام أو حركة، وأي نشاط عادي — ولا قرار مصيري قبل ما تهدأ خالص.
- **افتكر (KNW-138-REM):** الساعة الأولى لقفل الجرح، لا لفتح الملفات.
- **وسوم (معرّفات تقنية):** —

### KNW-139 — لما بيتكرر النمط نفسه: غيّر البيئة لا النصيحة

- **التصنيف:** الوقاية (`prevention`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-139-KNOW):** إذا تكرر المحفز نفسه رغم قاعدتك، فالمشكلة ليست في علمك — بل في تصميم البيئة حوله.
- **افهم (KNW-139-UND):** تكرار النمط مع وجود القاعدة معناه أن القاعدة تعمل ضد تيار فيزيائي أقوى منها: الغرفة نفسها، والوقت نفسه، والجهاز في متناول اليد. وهنا مش محتاج وعظًا أقوى لنفسك، بل تغييرًا أعمق: غيّر المكان المعتاد، واخرج الجهاز من الصورة، واكسر ظرف الوقت نفسه.
- **افعل (KNW-139-ACT):** حدّد الظرف الثابت في كل تكرار — مكان؟ وقت؟ جهاز؟ — وغيّره فيزيائيًّا دي المرة، ولا تكتفِ بإعادة كتابة القاعدة بلفظ أقوى.
- **افتكر (KNW-139-REM):** ما بيتكرر في بيئة ثابتة، لا يوقفه كلام جديد.
- **وسوم (معرّفات تقنية):** —

### KNW-140 — بعد ما توقف السلسلة: ثبّت ما تعلمته

- **التصنيف:** الزلّة والانتكاسة (`relapse`) · **مرحلة المحتوى:** any
- **اعرف (KNW-140-KNOW):** الوقوف الناجح ليس نهاية الحدث بس؛ إنه أحسن لحظة لتثبيت المهارة اللي نجحت.
- **افهم (KNW-140-UND):** يتعلم أغلب الناس بعد الفشل بس، مع أن لحظة النجاح أوضح: تدخل معين عمل معاك، في سياق معين، ووقت معين. وتدوينها بعد الهدوء مباشرة يحوّلها من صدفة إلى خيار قابل للتكرار: ما اللي قطعها؟ وأين كنت؟ وما أول علامة؟ — دي بذرة قاعدتك القادمة.
- **افعل (KNW-140-ACT):** بعد كل نجاح: سجّل سريعًا اللي حصل — العلامة الأولى، والتدخل اللي عمل، والظرف — ثم حوّل أنجح عنصر فيه إلى قاعدة ثابتة.
- **افتكر (KNW-140-REM):** الفشل يدرّس، والنجاح يثبّت — فسجّل الاثنين.
- **وسوم (معرّفات تقنية):** —

### KNW-141 — اليوم الصعب لا يُعوَّض بعقاب

- **التصنيف:** الرحمة بالذات (`self-compassion`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-141-KNOW):** بعد اليوم السيئ بتظهر رغبة غريبة في «تعويض صارم»: حرمان من الراحة، أو إنهاك رياضي، أو سهر إنجاز — كأن اليوم اللي بعده جلاد.
- **افهم (KNW-141-UND):** بيبان التعويض القاسي انضباطًا، وهو عذاب مقنّع: تضيف إلى يوم متعب يومًا أقسى، فينهار الاثنان. واليوم اللي جرى بشدة محتاج عودة إلى المجرى الطبيعي، لا انتقامًا: رجوعًا تدريجيًّا للروتين، وراحة حقيقية في مكانها. وانضباطك الحقيقي بيظهر في العودة، لا في العقاب.
- **افعل (KNW-141-ACT):** بعد اليوم الصعب: ارجع إلى روتينك الاعتيادي بلا تعويض إضافي — مهمة اليوم المعتادة، وراحة الوقت المعتاد — وامنع أي «عقاب تجديدي».
- **افتكر (KNW-141-REM):** العودة للروتين هي التعويض الوحيد اللي يعمل.
- **وسوم (معرّفات تقنية):** —

### KNW-142 — البدء تاني بعد أيام ضائعة من الخطة

- **التصنيف:** الانضباط (`discipline`) · **مرحلة المحتوى:** any
- **اعرف (KNW-142-KNOW):** الخطة اليومية اللي وقفت كام يوم ما بتترميش — ارجع لها من نقطة النهارده من غير عقاب.
- **افهم (KNW-142-UND):** الشرط الخفي اللي بيهدّ الخطط مش الانشغال، بس شرط «الرجوع الكامل»: سأرجع كإني ما انقطعتش، فتستنى يوم مثالي ما بيجيش. الرجوع الصح أصغر وأثبت: ارجع النهارده بنسخة عادية من الخطة مهما كانت الأيام اللي فاتت. الاستمرارية مش محتاجة إن الماضي يبقى كامل.
- **افعل (KNW-142-ACT):** ارجع النهارده من غير مقدمات: افتح خطة اليوم ونفّذ أول بند بس — من غير مراجعة للأيام اللي فاتت، ومن غير وعد تعويضي.
- **افتكر (KNW-142-REM):** الخطة لا تحاسبك على غيابك؛ إنها تنتظر عودتك اليوم.
- **وسوم (معرّفات تقنية):** —

### KNW-143 — عودة الرغبة بعد فترة هدوء: ما تبالغش في قراءتها

- **التصنيف:** الرغبات (`urges`) · **مرحلة المحتوى:** late
- **اعرف (KNW-143-KNOW):** عودة رغبة قديمة بعد أسابيع هدوء ليست دليل انهيار — إنها من طبيعة التعلم: موجات تخفت، ولا تمحى.
- **افهم (KNW-143-UND):** بعد فترة هدوء، أي موجة مفاجئة ممكن تبان أكبر من حجمها: تتفهم على إنها «رجوع كل حاجة»، فتدفعك لليأس أو الاستسلام. القراءة الأدق إن المسار القديم ضعف بسه ما اتمسحش، وموجة النهارده أهون من موجات زمان — بس إنت نسيت شكلها. ما تديش اللحظة معنى أكبر من حجمها.
- **افعل (KNW-143-ACT):** عند عودة رغبة بعد هدوء: عاملها كموجة اليوم، لا كمؤشر عودة النمط — نفّذ روتينك المعتاد للرغبة، ودوّنها بلا استنتاجات كبرى.
- **افتكر (KNW-143-REM):** عودة الرغبة مش معناها أن المسار كله عاد كما كان.
- **وسوم (معرّفات تقنية):** —

### KNW-144 — احمِ جلسة العمل أو الدراسة من التنقل الرقمي

- **التصنيف:** الانتباه (`attention`) · **مرحلة المحتوى:** early
- **اعرف (KNW-144-KNOW):** جلسة العمل المتصلة محتاج حماية من عدو مباشر: كل نظرة سريعة إلى الجهاز أثناءها.
- **افهم (KNW-144-UND):** لا تنكسر الجلسة العميقة بالأشياء الكبيرة، بل بالنقلات الصغيرة: رسالة، أو نظرة، أو تفقّد سريع — والجلسة كلها تدفع ثمن كل واحدة منها. وحماية الجلسة ليست تقشفًا؛ إنها شرط لوجودها أصلًا: بيئة عمل نظيفة من مداخل التشتت، وجهاز بعيد، ووقت محدود معلوم البداية والنهاية.
- **افعل (KNW-144-ACT):** قبل كل جلسة عمل أو مذاكرة: هيّئ المكان — جهاز بعيد أو صامت، وإشعارات صفر — وحدد طول الجلسة، ثم لا تعدّل حاجة حتى تنتهي.
- **افتكر (KNW-144-REM):** الجلسة العميقة تُبنى قبل ما بتبدأ.
- **وسوم (معرّفات تقنية):** phone-habit, scrolling

### KNW-145 — هواية تشغلك أعمق من مجرد المنع

- **التصنيف:** الهدف (`purpose`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-145-KNOW):** الامتناع وحده يترك فراغًا، والهواية الحقيقية تملأ الفراغ، وتنافس السلوك على وقتك واهتمامك.
- **افهم (KNW-145-UND):** البديل الحقيقي مش مجرد حاجة تملّي دقايق الفراغ، بس حاجة بتكبر معاك: مهارة بتتراكم، أو حرفة بتتقنها، أو رياضة بتتقدم فيها. الفرق مهم: الحاجة اللي بتسد فراغ اللحظة بتغطي يومك بس، بس الحاجة المتراكمة بتبني لك سبب للغد — وده بيخلّي السلوك القديم يفقد مكانه في حياتك مع الوقت، مش بس إن الرغبة فيه تهدى.
- **افعل (KNW-145-ACT):** اختار هواية تقدر تطورها — حاجة تتعلمها بإيدك أو بجسمك — وحدد لها معاد ثابت كل أسبوع، وبعد شهر شوف تأثيرها على أمسياتك.
- **افتكر (KNW-145-REM):** المنع يحمي الحدود، والهواية تعمر الأرض خلفها.
- **وسوم (معرّفات تقنية):** boredom, unstructured

### KNW-146 — صمّم يومك لخدمة قيمك، لا ليكون كله مقاومة

- **التصنيف:** القيم (`values`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-146-KNOW):** قيمك مش بتظهر وقت الضعف بس؛ بتظهر في شكل يومك كله: ساعاتك بتروح فين؟
- **افهم (KNW-146-UND):** لو كانت جملة قيمتك تقول «أسرتي أمان»، وكان يومك كله انعزالًا وشاشات، فالتنافر ليس ضعف إرادة — إنه تصميم يوم لا يشبه ما كتبت. وتصميم اليوم القيمي توزيع مقصود: ساعة حقيقية لما تحب، ووقت محروس للناس، ومساحة تنمو فيها — فيصير الوقوف وقت الضعف أهون، لأن يومك نفسه يحمل جواب «ليه؟».
- **افعل (KNW-146-ACT):** انظر إلى يومك المعتاد واسأل: كم ساعة تخدم قيمة كتبتها؟ أضف نشاطًا واحدًا يخدم أهم قيمة عندك — موعدًا ثابتًا لا يزاحمه حاجة.
- **افتكر (KNW-146-REM):** يومك الموزَّع هو قيمك الحقيقية، لا جملتك المكتوبة وحدها.
- **وسوم (معرّفات تقنية):** —

### KNW-147 — إمتى تكون طلب المساعدة المتخصصة خطوة مناسبة؟

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-147-KNOW):** التطبيق أداة مساندة لمن يبني عادة وأنماطًا — وليس بديلًا عن مساعدة متخصصة لما بتظهر مؤشرات أثقل.
- **افهم (KNW-147-UND):** لوات الدعم المتخصص بيكون أوسع وأأمن: لما السلوك يرتبط بضغط نفسي مستمر، أو احتقار شديد للذات، أو حزن أو قلق معطّل حياتك اليومية ونومك ودراستك. وطلب المساعدة هنا مش اعتراف بفشل رحلتك؛ ده توسيع لفريقك — والتخصصات مختلفة، بس الفكرة واحدة: توصل لحد عنده أدوات أوسع من التطبيق.
- **افعل (KNW-147-ACT):** لو حسّيت أن ما تفعله وحدك مش كفاية منذ مدة، فاعتبر سؤال مختص خطة عملية لا آخر الحلول: ابحث، واسأل، وحدد موعدًا استشاريًّا.
- **افتكر (KNW-147-REM):** طلب المساعدة المتخصصة خطوة في الرحلة، لا إعلان فشلها.
- **وسوم (معرّفات تقنية):** stress, sadness

### KNW-148 — الاستعداد لأول حديث مع مختص أو جهة دعم

- **التصنيف:** العلاقات (`relationships`) · **مرحلة المحتوى:** mid
- **اعرف (KNW-148-KNOW):** أول جلسة مع مختص أسهل بكثير لو دخلتها مهيأ: هدف واضح، وحدود مرتاحة، وأسئلة جاهزة.
- **افهم (KNW-148-UND):** الارتباك قبل أول جلسة طبيعي: أقول إيه؟ وهل أحكي كل حاجة؟ والحقيقة إنك مش مطالب تحكي سجلّك كله مرة واحدة — كفاية توصل بنقطة بداية. جملة صادقة عن سبب مجيئك، وحدودك في الخصوصية، وسؤالين عن طريقة الشغل — دول كفاية جدًا كبداية.
- **افعل (KNW-148-ACT):** قبل الجلسة الأولى اكتب ثلاثًا: جملة سبب المجيء بصياغتك، وما لا ترتاح للحديث عنه اليوم، وسؤالين عايز جوابهما — وأحضر الورقة معاك.
- **افتكر (KNW-148-REM):** الجلسة الأولى بداية طريق، لا محكمة تُسأل فيها عن كل حاجة.
- **وسوم (معرّفات تقنية):** —

## 27. خريطة الاستخدام (Usage / Location Map)

لكل نص واجهة فريد: كل مواضعه في الكود (ملف:سطر — المنطقة). النص المستخدم في عدة شاشات بيظهر هنا بمواضعه كلها:

**TXT-0001** — «استعادة — نظام شخصي لاستعادة التحكم»
  - `src/app/layout.tsx:15` — Browser tab / metadata

**TXT-0002** — «تطبيق مساعدة ذاتية سلوكية لاستعادة التحكم: لاحظ، افهم، اقطع السلسلة، تعلّم، وابن…»
  - `src/app/layout.tsx:17` — Metadata description

**TXT-0003** — «استعادة»
  - `src/app/layout.tsx:18` — Metadata applicationName
  - `src/components/app/AppRoot.tsx:49` — App name
  - `src/components/app/AppShell.tsx:125` — Sidebar brand name
  - `src/components/app/Onboarding.tsx:129` — Brand name

**TXT-0004** — «استعادة التحكم»
  - `src/app/layout.tsx:19` — Metadata keywords

**TXT-0005** — «مساعدة ذاتية»
  - `src/app/layout.tsx:19` — Metadata keywords

**TXT-0006** — «سلوك»
  - `src/app/layout.tsx:19` — Metadata keywords

**TXT-0007** — «عادات»
  - `src/app/layout.tsx:19` — Metadata keywords

**TXT-0008** — «خصوصية»
  - `src/app/layout.tsx:19` — Metadata keywords

**TXT-0009** — «قفل»
  - `src/components/ui/dialog.tsx:75` — Dialog close sr-only label
  - `src/components/ui/sheet.tsx:77` — Sheet close sr-only label
  - `src/components/app/AppShell.tsx:257` — Sheet close button aria-label

**TXT-0010** — «اس»
  - `src/components/app/AppRoot.tsx:47` — Logo monogram

**TXT-0011** — «ده التطبيق محتاج تشغيل جافاسكربت — ويعمل بعد كده محليًا بالكامل على جهازك.»
  - `src/components/app/AppRoot.tsx:55` — Noscript message

**TXT-0012** — «${label}: ${n} من ٥»
  - `src/components/app/shared.tsx:136` — NumberScale radio aria-label

**TXT-0013** — «تحسن»
  - `src/components/app/shared.tsx:203` — StatTile up arrow aria-label

**TXT-0014** — «انخفاض»
  - `src/components/app/shared.tsx:208` — StatTile down arrow aria-label

**TXT-0015** — «خطوة ${current + 1} من ${total}»
  - `src/components/app/shared.tsx:265` — StepDots aria-label

**TXT-0016** — «arabicDate(iso) — Intl.DateTimeFormat("ar", {weekday long, day numeric, month lo…»
  - `src/lib/app/helpers.ts:32` — Arabic date (runtime-generated)

**TXT-0017** — «arabicDateTime(iso) — Intl.DateTimeFormat("ar", {day numeric, month short, hour …»
  - `src/lib/app/helpers.ts:44` — Arabic date-time (runtime-generated)

**TXT-0018** — «${mm}:${String(ss).padStart(2, "0")}»
  - `src/components/app/Timer.tsx:45` — Countdown display

**TXT-0019** — «إيقاف مؤقت»
  - `src/components/app/Timer.tsx:59` — Compact pause button aria-label
  - `src/components/app/Timer.tsx:116` — Pause button

**TXT-0020** — «تشغيل»
  - `src/components/app/Timer.tsx:59` — Compact play button aria-label

**TXT-0021** — «اكتمل الوقت»
  - `src/components/app/Timer.tsx:98` — Timer status

**TXT-0022** — «جارٍ التنفيذ…»
  - `src/components/app/Timer.tsx:101` — Timer status

**TXT-0023** — «متوقف»
  - `src/components/app/Timer.tsx:101` — Timer status

**TXT-0024** — «ابدأ»
  - `src/components/app/Timer.tsx:120` — Start button
  - `src/components/app/screens/PlanScreen.tsx:375` — Open check-in button

**TXT-0025** — «استئناف»
  - `src/components/app/Timer.tsx:120` — Resume button

**TXT-0026** — «إعادة»
  - `src/components/app/Timer.tsx:133` — Reset button aria-label

**TXT-0027** — «تاني»
  - `src/components/app/Timer.tsx:149` — Restart button

**TXT-0028** — «أنجزت الوقت — أعد التقييم دلوقتي»
  - `src/components/app/Timer.tsx:155` — Done message

**TXT-0029** — «ليه بيساعد ده؟»
  - `src/components/app/InterventionCard.tsx:49` — Why-it-helps disclosure summary

**TXT-0030** — «المؤقت:»
  - `src/components/app/InterventionCard.tsx:58` — Compact timer label

**TXT-0031** — «تم — أعد التقييم»
  - `src/components/app/InterventionCard.tsx:69` — Complete button

**TXT-0032** — «الخطوة اللي بعدها: ${iv.nextAction}»
  - `src/components/app/InterventionCard.tsx:74` — Next action line

**TXT-0033** — «الرئيسية»
  - `src/components/app/AppShell.tsx:46` — Sidebar nav item
  - `src/components/app/AppShell.tsx:189` — Bottom nav item

**TXT-0034** — «نظرة اليوم وحالتك»
  - `src/components/app/AppShell.tsx:46` — Sidebar nav item desc

**TXT-0035** — «الجرعة اليومية»
  - `src/components/app/AppShell.tsx:47` — Sidebar nav item
  - `src/components/app/screens/DoseScreen.tsx:52` — Screen title
  - `src/components/app/screens/SettingsScreen.tsx:153` — Daily dose toggle title

**TXT-0036** — «دقيقة معرفة في يومك الهادي»
  - `src/components/app/AppShell.tsx:47` — Sidebar nav item desc

**TXT-0037** — «الخطة اليومية»
  - `src/components/app/AppShell.tsx:48` — Sidebar nav item
  - `src/components/app/screens/HomeScreen.tsx:360` — Plan card title
  - `src/components/app/screens/PlanScreen.tsx:134` — Screen title

**TXT-0038** — «بناء يوم يستحق»
  - `src/components/app/AppShell.tsx:48` — Sidebar nav item desc

**TXT-0039** — «فحص الرغبة»
  - `src/components/app/AppShell.tsx:49` — Sidebar nav item
  - `src/components/app/screens/UrgeScreen.tsx:190` — Screen title

**TXT-0040** — «بدأت رغبة؟ اعرف خطوتك»
  - `src/components/app/AppShell.tsx:49` — Sidebar nav item desc

**TXT-0041** — «خريطة المحفزات»
  - `src/components/app/AppShell.tsx:50` — Sidebar nav item
  - `src/components/app/screens/TriggerMapScreen.tsx:51` — Screen title

**TXT-0042** — «أنماط سجلك ونقطة التوقف الأبكر»
  - `src/components/app/AppShell.tsx:50` — Sidebar nav item desc

**TXT-0043** — «توقّف هنا»
  - `src/components/app/AppShell.tsx:51` — Sidebar nav item
  - `src/components/app/screens/HomeScreen.tsx:88` — Quick guide action
  - `src/components/app/screens/HomeScreen.tsx:299` — Post-relapse CTA
  - `src/components/app/screens/RelapseScreen.tsx:642` — Main title

**TXT-0044** — «حصلت زَلّة؟ إيقاف فوري ثم فهم هادئ»
  - `src/components/app/AppShell.tsx:51` — Sidebar nav item desc

**TXT-0045** — «خطة الوقاية»
  - `src/components/app/AppShell.tsx:52` — Sidebar nav item
  - `src/components/app/screens/PreventionScreen.tsx:80` — Screen title

**TXT-0046** — «قواعد «إذا… إذن» وحمايتك»
  - `src/components/app/AppShell.tsx:52` — Sidebar nav item desc

**TXT-0047** — «التقدم»
  - `src/components/app/AppShell.tsx:53` — Sidebar nav item
  - `src/components/app/screens/ProgressScreen.tsx:25` — Screen title

**TXT-0048** — «مؤشرات حقيقية بلا نسب زائفة»
  - `src/components/app/AppShell.tsx:53` — Sidebar nav item desc

**TXT-0049** — «القيم والروحانيات»
  - `src/components/app/AppShell.tsx:54` — Sidebar nav item
  - `src/components/app/screens/ValuesScreen.tsx:47` — Screen title

**TXT-0050** — «ليه أفعل ده؟»
  - `src/components/app/AppShell.tsx:54` — Sidebar nav item desc
  - `src/components/app/Onboarding.tsx:301` — Step 7 title
  - `src/components/app/screens/ValuesScreen.tsx:57` — Why card title

**TXT-0051** — «قاعدة المعرفة»
  - `src/components/app/AppShell.tsx:55` — Sidebar nav item
  - `src/components/app/screens/KnowledgeScreen.tsx:65` — Screen title

**TXT-0052** — «قراءة هادئة — للوقت الهادي»
  - `src/components/app/AppShell.tsx:55` — Sidebar nav item desc

**TXT-0053** — «الإعدادات»
  - `src/components/app/AppShell.tsx:56` — Sidebar nav item
  - `src/components/app/screens/SettingsScreen.tsx:105` — Screen title

**TXT-0054** — «خصوصيتك وبياناتك»
  - `src/components/app/AppShell.tsx:56` — Sidebar nav item desc

**TXT-0055** — «الجرعة»
  - `src/components/app/AppShell.tsx:201` — Bottom nav item

**TXT-0056** — «الخطة»
  - `src/components/app/AppShell.tsx:227` — Bottom nav item

**TXT-0057** — «المزيد»
  - `src/components/app/AppShell.tsx:239` — Bottom nav item

**TXT-0058** — «تدخّل دلوقتي»
  - `src/components/app/AppShell.tsx:91` — Emergency CTA
  - `src/components/app/AppShell.tsx:289` — Emergency tile label
  - `src/components/app/screens/HomeScreen.tsx:80` — Quick guide action
  - `src/components/app/screens/HomeScreen.tsx:266` — High-state CTA
  - `src/components/app/screens/EmergencyMode.tsx:463` — Overlay header title

**TXT-0059** — «نظام شخصي للتحكم»
  - `src/components/app/AppShell.tsx:126` — Sidebar brand subtitle

**TXT-0060** — «التنقل الرئيسي»
  - `src/components/app/AppShell.tsx:132` — Sidebar nav aria-label

**TXT-0061** — «بياناتك على جهازك بس — لا حسابات ولا خوادم.»
  - `src/components/app/AppShell.tsx:152` — Sidebar footer privacy note

**TXT-0062** — «التنقل السفلي»
  - `src/components/app/AppShell.tsx:176` — Bottom nav aria-label

**TXT-0063** — «تدخل دلوقتي — وضع الطوارئ»
  - `src/components/app/AppShell.tsx:209` — Center SOS button aria-label

**TXT-0064** — «تدخل دلوقتي»
  - `src/components/app/AppShell.tsx:213` — Center SOS button label

**TXT-0065** — «المزيد من الأقسام»
  - `src/components/app/AppShell.tsx:232` — More button aria-label

**TXT-0066** — «كل الأقسام»
  - `src/components/app/AppShell.tsx:252` — Sheet title

**TXT-0067** — «لحظة خطر؟ وضع الطوارئ — خطوات مباشرة بلا تشتيت»
  - `src/components/app/AppShell.tsx:291` — Emergency tile desc

**TXT-0068** — «عايز تغيير سلوك يؤثر على حياتي»
  - `src/components/app/Onboarding.tsx:15` — Step 1 goal chips

**TXT-0069** — «عايز تحكمًا أحسن في الرغبات»
  - `src/components/app/Onboarding.tsx:16` — Step 1 goal chips

**TXT-0070** — «عايز تقليل أو إيقاف استخدام الإباحية»
  - `src/components/app/Onboarding.tsx:17` — Step 1 goal chips

**TXT-0071** — «عايز تقليل سلوك جنسي قهري»
  - `src/components/app/Onboarding.tsx:18` — Step 1 goal chips

**TXT-0072** — «عايز فهم محفزاتي»
  - `src/components/app/Onboarding.tsx:19` — Step 1 goal chips

**TXT-0073** — «عايز بناء روتين يومي أقوى»
  - `src/components/app/Onboarding.tsx:20` — Step 1 goal chips

**TXT-0074** — «عايز دعمًا مبنيًا على قيمي/روحانيتي»
  - `src/components/app/Onboarding.tsx:21` — Step 1 goal chips

**TXT-0075** — «الليل المتأخر»
  - `src/components/app/Onboarding.tsx:25` — Step 2 difficult times chips
  - `src/lib/app/progress.ts:200` — Pattern part label

**TXT-0076** — «لما أكون وحدي»
  - `src/components/app/Onboarding.tsx:26` — Step 2 difficult times chips

**TXT-0077** — «الملل»
  - `src/components/app/Onboarding.tsx:27` — Step 2 difficult times chips

**TXT-0078** — «التوتر والضغط»
  - `src/components/app/Onboarding.tsx:28` — Step 2 difficult times chips

**TXT-0079** — «الإحساس الصعبة»
  - `src/components/app/Onboarding.tsx:29` — Step 2 difficult times chips

**TXT-0080** — «وقت فراغ غير منظم»
  - `src/components/app/Onboarding.tsx:30` — Step 2 difficult times chips

**TXT-0081** — «أثناء استخدام الهاتف/الكمبيوتر»
  - `src/components/app/Onboarding.tsx:31` — Step 2 difficult times chips

**TXT-0082** — «أماكن معينة»
  - `src/components/app/Onboarding.tsx:32` — Step 2 difficult times chips

**TXT-0083** — «أخرى»
  - `src/components/app/Onboarding.tsx:33` — Step 2 difficult times chips

**TXT-0084** — «تصفح بلا هدف»
  - `src/components/app/Onboarding.tsx:37` — Step 3 pattern chips

**TXT-0085** — «افتكر حاجة ما»
  - `src/components/app/Onboarding.tsx:38` — Step 3 pattern chips

**TXT-0086** — «خيال»
  - `src/components/app/Onboarding.tsx:39` — Step 3 pattern chips

**TXT-0087** — «فضول»
  - `src/components/app/Onboarding.tsx:40` — Step 3 pattern chips

**TXT-0088** — «انزعاج انفعالي»
  - `src/components/app/Onboarding.tsx:41` — Step 3 pattern chips

**TXT-0089** — «انعزال»
  - `src/components/app/Onboarding.tsx:42` — Step 3 pattern chips

**TXT-0090** — «البقاء في السرير»
  - `src/components/app/Onboarding.tsx:43` — Step 3 pattern chips

**TXT-0091** — «بحث»
  - `src/components/app/Onboarding.tsx:44` — Step 3 pattern chips

**TXT-0092** — «الدراسة»
  - `src/components/app/Onboarding.tsx:49` — Step 5 build-goal chips

**TXT-0093** — «المستقبل المهني»
  - `src/components/app/Onboarding.tsx:50` — Step 5 build-goal chips

**TXT-0094** — «الانضباط»
  - `src/components/app/Onboarding.tsx:51` — Step 5 build-goal chips

**TXT-0095** — «العلاقات»
  - `src/components/app/Onboarding.tsx:52` — Step 5 build-goal chips

**TXT-0096** — «الصحة البدنية»
  - `src/components/app/Onboarding.tsx:53` — Step 5 build-goal chips

**TXT-0097** — «حياة قيمية/روحية»
  - `src/components/app/Onboarding.tsx:54` — Step 5 build-goal chips

**TXT-0098** — «إدارة الوقت»
  - `src/components/app/Onboarding.tsx:55` — Step 5 build-goal chips

**TXT-0099** — «التركيز»
  - `src/components/app/Onboarding.tsx:56` — Step 5 build-goal chips

**TXT-0100** — «المحتوى العلمي المبسّط»
  - `src/components/app/Onboarding.tsx:60` — Step 6 support preference options

**TXT-0101** — «استراتيجيات عملية مباشرة»
  - `src/components/app/Onboarding.tsx:61` — Step 6 support preference options

**TXT-0102** — «توجيه نفسي/سلوكي»
  - `src/components/app/Onboarding.tsx:62` — Step 6 support preference options

**TXT-0103** — «تأمل قيمي وروحي»
  - `src/components/app/Onboarding.tsx:63` — Step 6 support preference options

**TXT-0104** — «مزيج من كل ده»
  - `src/components/app/Onboarding.tsx:64` — Step 6 support preference options

**TXT-0105** — «نعم، أحتاجه باستمرار»
  - `src/components/app/Onboarding.tsx:72` — Step 4 device-needs option

**TXT-0106** — «سنجهّز تدخلات لا تتطلب ترك الجهاز»
  - `src/components/app/Onboarding.tsx:72` — Step 4 device-needs option desc

**TXT-0107** — «أحيانًا»
  - `src/components/app/Onboarding.tsx:73` — Step 4 device-needs option

**TXT-0108** — «سنطلب منك التأكيد وقت الحاجة»
  - `src/components/app/Onboarding.tsx:73` — Step 4 device-needs option desc

**TXT-0109** — «لا، أقدر تركه»
  - `src/components/app/Onboarding.tsx:74` — Step 4 device-needs option

**TXT-0110** — «سنفضّل تدخلات الابتعاد عن الجهاز»
  - `src/components/app/Onboarding.tsx:74` — Step 4 device-needs option desc

**TXT-0111** — «نظام شخصي لاستعادة التحكم»
  - `src/components/app/Onboarding.tsx:130` — Brand subtitle

**TXT-0112** — «أهلًا بيك في «استعادة»»
  - `src/components/app/Onboarding.tsx:143` — Welcome heading

**TXT-0113** — «نظام شخصي بيساعدك تفهم لحظاتك الصعبة وتوقف السلوك قبل ما بيبدأ — بخطوات عملية، من …»
  - `src/components/app/Onboarding.tsx:146` — Welcome intro

**TXT-0114** — «بياناتك على جهازك بس»
  - `src/components/app/Onboarding.tsx:154` — Privacy card title

**TXT-0115** — «من غير حساب، ولا خادم، ولا إرسال لأي مكان — كل حاجة بتتخزن محليًا في متصفحك، وتق…»
  - `src/components/app/Onboarding.tsx:157` — Privacy card body

**TXT-0116** — «ابدأ كمستخدم جديد»
  - `src/components/app/Onboarding.tsx:168` — New user CTA

**TXT-0117** — «أو»
  - `src/components/app/Onboarding.tsx:172` — Divider

**TXT-0118** — «مش أول مرة تستخدم التطبيق؟ استعد بياناتك»
  - `src/components/app/Onboarding.tsx:178` — Restore card title

**TXT-0119** — «عندك نسخة احتياطية من جهاز تاني؟ استرجعها دلوقتي وهتفتح البيانات مباشرة — من غير…»
  - `src/components/app/Onboarding.tsx:181` — Restore card body

**TXT-0120** — «إنت بتستخدم التطبيق ليه؟»
  - `src/components/app/Onboarding.tsx:207` — Step 1 title
  - `src/components/app/screens/SettingsScreen.tsx:518` — Prefs dialog Q1

**TXT-0121** — «اختار كل ما ينطبق — اختياراتك هنا تخصّص نظامك.»
  - `src/components/app/Onboarding.tsx:208` — Step 1 subtitle

**TXT-0122** — «إمتى تكون الأمور أصعب عادة؟»
  - `src/components/app/Onboarding.tsx:216` — Step 2 title
  - `src/components/app/screens/SettingsScreen.tsx:522` — Prefs dialog Q2

**TXT-0123** — «تقدر تختار أكثر من خيار.»
  - `src/components/app/Onboarding.tsx:217` — Step 2 subtitle

**TXT-0124** — «إيه اللي بيحصل عادة قبل السلوك؟»
  - `src/components/app/Onboarding.tsx:229` — Step 3 title
  - `src/components/app/screens/SettingsScreen.tsx:526` — Prefs dialog Q3

**TXT-0125** — «اختيارات عامة — مش محتاج تكتب تفاصيل صريحة.»
  - `src/components/app/Onboarding.tsx:230` — Step 3 subtitle

**TXT-0126** — «ما يهمّنا هنا هو النمط العام (تصفح؟ افتكر؟ ملل؟) — لا محتوى بعينه.»
  - `src/components/app/Onboarding.tsx:234` — Step 3 info note

**TXT-0127** — «محتاج هاتفك/كمبيوترك للعمل أو الدراسة؟»
  - `src/components/app/Onboarding.tsx:241` — Step 4 title
  - `src/components/app/screens/SettingsScreen.tsx:531` — Prefs dialog Q4

**TXT-0128** — «ده يحدد خطة «وضع العمل الآمن» عند الطوارئ.»
  - `src/components/app/Onboarding.tsx:242` — Step 4 subtitle

**TXT-0129** — «إيه اللي عايز تبنيه؟»
  - `src/components/app/Onboarding.tsx:272` — Step 5 title
  - `src/components/app/screens/SettingsScreen.tsx:553` — Prefs dialog Q5

**TXT-0130** — «الحياة الممتلئة أقوى درع — اختار أهدافك.»
  - `src/components/app/Onboarding.tsx:272` — Step 5 subtitle

**TXT-0131** — «أي نوع من الدعم تحب؟»
  - `src/components/app/Onboarding.tsx:278` — Step 6 title
  - `src/components/app/screens/SettingsScreen.tsx:557` — Prefs dialog Q6

**TXT-0132** — «ده هيظهر في اختيار جرعتك اليومية.»
  - `src/components/app/Onboarding.tsx:278` — Step 6 subtitle

**TXT-0133** — «اكتب سببك بيدك — أو اختار ما يمثّلك. بيظهر لك في اللحظات الصعبة.»
  - `src/components/app/Onboarding.tsx:302` — Step 7 subtitle

**TXT-0134** — «سببك الخاص، بكلماتك أنت… (اختياري)»
  - `src/components/app/Onboarding.tsx:313` — Step 7 textarea placeholder

**TXT-0135** — «جهّزنا خطتك الأولى»
  - `src/components/app/Onboarding.tsx:326` — Step 8 title

**TXT-0136** — «حددنا أهم سياقات الخطر عندك، وبنينا أول خطة استجابة مناسبة ليك.»
  - `src/components/app/Onboarding.tsx:329` — Step 8 body

**TXT-0137** — «سياقات الخطر عندك:»
  - `src/components/app/Onboarding.tsx:335` — Step 8 summary line label

**TXT-0138** — «لم تحدد بعد — سيحددها سجلّك مع الوقت»
  - `src/components/app/Onboarding.tsx:340` — Step 8 summary fallback

**TXT-0139** — «خطة الاستجابة: فحص الرغبة ثلاثي الأبعاد → تدخل مناسب لسياقك → إعادة تقييم → تعلم…»
  - `src/components/app/Onboarding.tsx:346` — Step 8 response plan line

**TXT-0140** — «حماية الطوارئ:»
  - `src/components/app/Onboarding.tsx:353` — Step 8 emergency protection label

**TXT-0141** — ««وضع العمل الآمن» جاهز — مش محتاج تسيب جهازك.»
  - `src/components/app/Onboarding.tsx:355` — Step 8 device=yes branch

**TXT-0142** — «تدخلات ابتعاد عن الجهاز عند الخطر.»
  - `src/components/app/Onboarding.tsx:356` — Step 8 device=no/sometimes branch

**TXT-0143** — «أربع قواعد «إذا… إذن» جاهزة في خطة الوقاية، مستمدة من أكثر الأنماط شيوعًا.»
  - `src/components/app/Onboarding.tsx:362` — Step 8 prevention rules line

**TXT-0144** — «بياناتك كلها هتتخزن على جهازك بس — من غير حساب، ولا خادم، ولا إرسال لأي مكان.»
  - `src/components/app/Onboarding.tsx:368` — Step 8 privacy note

**TXT-0145** — «اللي فات»
  - `src/components/app/Onboarding.tsx:386` — Back button
  - `src/components/app/screens/RelapseScreen.tsx:624` — Review back button
  - `src/components/app/screens/PlanScreen.tsx:490` — Check-in back button

**TXT-0146** — «اللي بعده»
  - `src/components/app/Onboarding.tsx:390` — Next button
  - `src/components/app/screens/RelapseScreen.tsx:628` — Review next button
  - `src/components/app/screens/PlanScreen.tsx:493` — Check-in next button

**TXT-0147** — «ابدأ رحلتي»
  - `src/components/app/Onboarding.tsx:395` — Finish button

**TXT-0148** — «مستقر؟»
  - `src/components/app/screens/HomeScreen.tsx:63` — Quick guide situation

**TXT-0149** — «بدأت رغبة؟»
  - `src/components/app/screens/HomeScreen.tsx:71` — Quick guide situation

**TXT-0150** — «افحص الرغبة»
  - `src/components/app/screens/HomeScreen.tsx:72` — Quick guide action

**TXT-0151** — «قربت تتصرف؟»
  - `src/components/app/screens/HomeScreen.tsx:79` — Quick guide situation

**TXT-0152** — «حصلت زَلّة؟»
  - `src/components/app/screens/HomeScreen.tsx:87` — Quick guide situation
  - `src/components/app/screens/RelapseScreen.tsx:245` — Stop flow title

**TXT-0153** — «دليلك السريع — أعمل إيه دلوقتي؟»
  - `src/components/app/screens/HomeScreen.tsx:99` — Quick guide title

**TXT-0154** — «كل أداة ليها وقتها — استخدم اللي محتاجه دلوقتي.»
  - `src/components/app/screens/HomeScreen.tsx:120` — Quick guide footer

**TXT-0155** — «من قليل»
  - `src/components/app/screens/HomeScreen.tsx:161` — Handled-recently time label

**TXT-0156** — «منذ ساعة تقريبًا»
  - `src/components/app/screens/HomeScreen.tsx:166` — Handled-recently time label

**TXT-0157** — «منذ ساعتين تقريبًا»
  - `src/components/app/screens/HomeScreen.tsx:167` — Handled-recently time label

**TXT-0158** — «اختار مهمة واحدة من خطة اليوم — ده كفاية.»
  - `src/components/app/screens/HomeScreen.tsx:184` — Stable-state tail

**TXT-0159** — «جرعتك اليوم تمّت — اختار مهمة واحدة من خطتك أو استرح.»
  - `src/components/app/screens/HomeScreen.tsx:186` — Stable-state tail

**TXT-0160** — «خد جرعة اليوم واختار مهمة واحدة من خطتك — ده كفاية.»
  - `src/components/app/screens/HomeScreen.tsx:187` — Stable-state tail

**TXT-0161** — «تمت جرعتك اليوم»
  - `src/components/app/screens/HomeScreen.tsx:190` — Quick guide dose action

**TXT-0162** — «جرعتك في انتظارك»
  - `src/components/app/screens/HomeScreen.tsx:192` — Quick guide dose action

**TXT-0163** — «خد جرعة اليوم»
  - `src/components/app/screens/HomeScreen.tsx:193` — Quick guide dose action

**TXT-0164** — «العقل»
  - `src/components/app/screens/HomeScreen.tsx:196` — Plan pillar label

**TXT-0165** — «الجسد»
  - `src/components/app/screens/HomeScreen.tsx:197` — Plan pillar label

**TXT-0166** — «الهدف»
  - `src/components/app/screens/HomeScreen.tsx:198` — Plan pillar label

**TXT-0167** — «التواصل»
  - `src/components/app/screens/HomeScreen.tsx:199` — Plan pillar label

**TXT-0168** — «القيم»
  - `src/components/app/screens/HomeScreen.tsx:200` — Plan pillar label

**TXT-0169** — «الرقمي»
  - `src/components/app/screens/HomeScreen.tsx:201` — Plan pillar label

**TXT-0170** — «اليوم ${metrics.daysSinceStart} من رحلتك${metrics.daysSinceLastRelapse!= null ?…»
  - `src/components/app/screens/HomeScreen.tsx:208` — Header subtitle

**TXT-0171** — «تمت استعادة نسختك بنجاح»
  - `src/components/app/screens/HomeScreen.tsx:216` — Restore notice bold lead

**TXT-0172** — «أهلًا بيك تاني. كل سجلّك رجع لمكانه.»
  - `src/components/app/screens/HomeScreen.tsx:216` — Restore notice tail

**TXT-0173** — «تم»
  - `src/components/app/screens/HomeScreen.tsx:219` — Restore notice dismiss

**TXT-0174** — «أحسنت — تعاملت مع موجة ${handledAgoLabel()}.»
  - `src/components/app/screens/HomeScreen.tsx:230` — Normal-state banner

**TXT-0175** — «أنت مستقر دلوقتي — مش محتاج أي تدخل.»
  - `src/components/app/screens/HomeScreen.tsx:231` — Normal-state banner

**TXT-0176** — «انتبه — آخر فحص أظهر رغبة بدأت تبني.»
  - `src/components/app/screens/HomeScreen.tsx:238` — Moderate-state banner

**TXT-0177** — «مؤشر مش تنبؤ: خطوة قطع صغيرة دلوقتي بتكفي غالبًا قبل ما تكبر.»
  - `src/components/app/screens/HomeScreen.tsx:239` — Moderate-state banner body

**TXT-0178** — «افحص الرغبة دلوقتي»
  - `src/components/app/screens/HomeScreen.tsx:243` — Moderate-state CTA

**TXT-0179** — «درجة حالتك مرتفعة في آخر فحص»
  - `src/components/app/screens/HomeScreen.tsx:252` — High-state banner title

**TXT-0180** — «اللي محتاجه دلوقتي خطوة قطع واحدة — مش حل شامل.»
  - `src/components/app/screens/HomeScreen.tsx:255` — High-state banner body

**TXT-0181** — «عيد الفحص»
  - `src/components/app/screens/HomeScreen.tsx:269` — High-state secondary CTA

**TXT-0182** — «حصلت زَلّة؟ ما تكملش — نوقف هنا الأول»
  - `src/components/app/screens/HomeScreen.tsx:282` — High-state relapse link
  - `src/components/app/screens/EmergencyMode.tsx:153` — Completion relapse link

**TXT-0183** — «بعد اللي حصل — المهم دلوقتي: ما تكمّلش»
  - `src/components/app/screens/HomeScreen.tsx:291` — Post-relapse banner title

**TXT-0184** — «اللي حصل مش بيمسح اللي اتعلمته — والمراجعة الهادئة تنتظرك لما تهدى.»
  - `src/components/app/screens/HomeScreen.tsx:294` — Post-relapse banner body

**TXT-0185** — «الجرعة اليومية — اليوم ${metrics.daysSinceStart}»
  - `src/components/app/screens/HomeScreen.tsx:317` — Dose card header

**TXT-0186** — «أُنجزت اليوم ✓»
  - `src/components/app/screens/HomeScreen.tsx:321` — Dose card badge

**TXT-0187** — «تمّ تخطيها اليوم»
  - `src/components/app/screens/HomeScreen.tsx:326` — Dose card badge

**TXT-0188** — «اعرف»
  - `src/components/app/screens/HomeScreen.tsx:334` — Dose card block title
  - `src/components/app/screens/DoseScreen.tsx:68` — Dose block title
  - `src/components/app/screens/KnowledgeScreen.tsx:149` — Card dialog block title

**TXT-0189** — «افعل»
  - `src/components/app/screens/HomeScreen.tsx:338` — Dose card block title
  - `src/components/app/screens/DoseScreen.tsx:70` — Dose block title
  - `src/components/app/screens/KnowledgeScreen.tsx:151` — Card dialog block title

**TXT-0190** — «اعرض الجرعة كاملة»
  - `src/components/app/screens/HomeScreen.tsx:345` — Dose card CTA

**TXT-0191** — «اقرأها دلوقتي»
  - `src/components/app/screens/HomeScreen.tsx:347` — Dose card CTA

**TXT-0192** — «ابدأ الجرعة»
  - `src/components/app/screens/HomeScreen.tsx:348` — Dose card CTA

**TXT-0193** — «الخطة كاملة»
  - `src/components/app/screens/HomeScreen.tsx:367` — Plan card link

**TXT-0194** — «ركيزة ${p.label} — افتح الخطة اليومية»
  - `src/components/app/screens/HomeScreen.tsx:377` — Pillar button aria-label

**TXT-0195** — «لمحة التقدم»
  - `src/components/app/screens/HomeScreen.tsx:394` — Progress card title

**TXT-0196** — «كل المؤشرات»
  - `src/components/app/screens/HomeScreen.tsx:401` — Progress card link

**TXT-0197** — «رغبات تعاملت معها»
  - `src/components/app/screens/HomeScreen.tsx:407` — Stat tile label
  - `src/components/app/screens/ProgressScreen.tsx:92` — Stat tile label

**TXT-0198** — «${metrics.urgesHandled7d} خلال آخر أسبوع»
  - `src/components/app/screens/HomeScreen.tsx:409` — Stat tile hint

**TXT-0199** — «تدخلات مبكرة»
  - `src/components/app/screens/HomeScreen.tsx:413` — Stat tile label
  - `src/components/app/screens/ProgressScreen.tsx:98` — Stat tile label

**TXT-0200** — «خلال ٣٠ يومًا»
  - `src/components/app/screens/HomeScreen.tsx:415` — Stat tile hint

**TXT-0201** — «استقرار يومي»
  - `src/components/app/screens/HomeScreen.tsx:419` — Stat tile label

**TXT-0202** — «${metrics.dailyStability}%»
  - `src/components/app/screens/HomeScreen.tsx:420` — Stat tile value

**TXT-0203** — «مراجعات مسائية / ١٤ يومًا»
  - `src/components/app/screens/HomeScreen.tsx:421` — Stat tile hint

**TXT-0204** — «وعي بالمحفزات»
  - `src/components/app/screens/HomeScreen.tsx:424` — Stat tile label
  - `src/components/app/screens/ProgressScreen.tsx:157` — Stat tile label

**TXT-0205** — «محفزات مختلفة رصدتها»
  - `src/components/app/screens/HomeScreen.tsx:426` — Stat tile hint

**TXT-0206** — «مؤشرات سلوكية للاستخدام الشخصي — ليست تشخيصًا طبيًا ولا نسبة تعافٍ.»
  - `src/components/app/screens/HomeScreen.tsx:434` — Footer disclaimer

**TXT-0207** — «بياناتك محفوظة على جهازك بس.»
  - `src/components/app/screens/HomeScreen.tsx:436` — Footer privacy line

**TXT-0208** — «ليلة هادئة»
  - `src/lib/app/helpers.ts:59` — Greeting (dynamic title)

**TXT-0209** — «صباح الخير»
  - `src/lib/app/helpers.ts:60` — Greeting (dynamic title)

**TXT-0210** — «نهارك طيب»
  - `src/lib/app/helpers.ts:61` — Greeting (dynamic title)

**TXT-0211** — «مساء الخير»
  - `src/lib/app/helpers.ts:63` — Greeting (dynamic title)

**TXT-0212** — «${arabicDate(new Date())} — اليوم ${metrics.daysSinceStart} · مرحلة «${stage.lab…»
  - `src/components/app/screens/DoseScreen.tsx:53` — Screen subtitle

**TXT-0213** — «افهم»
  - `src/components/app/screens/DoseScreen.tsx:69` — Dose block title
  - `src/components/app/screens/KnowledgeScreen.tsx:150` — Card dialog block title

**TXT-0214** — «افتكر»
  - `src/components/app/screens/DoseScreen.tsx:73` — Remember block title
  - `src/components/app/screens/KnowledgeScreen.tsx:153` — Card dialog remember title

**TXT-0215** — «قراءة أعمق (اختياري)»
  - `src/components/app/screens/DoseScreen.tsx:81` — Deep reading disclosure

**TXT-0216** — «أنجزت جرعة اليوم»
  - `src/components/app/screens/DoseScreen.tsx:90` — Done banner

**TXT-0217** — «تخطيت جرعة اليوم»
  - `src/components/app/screens/DoseScreen.tsx:96` — Skipped banner title

**TXT-0218** — «البطاقة نفسها هنا لو حسّيت تقرأها دلوقتي — والجرعة الجديدة بانتظارك بكرة.»
  - `src/components/app/screens/DoseScreen.tsx:99` — Skipped banner body

**TXT-0219** — «تمت الجرعة»
  - `src/components/app/screens/DoseScreen.tsx:108` — Done button

**TXT-0220** — «ولا يهمك — تقدر تعدّي أي جرعة»
  - `src/components/app/screens/DoseScreen.tsx:127` — Skip button title tooltip

**TXT-0221** — «تخطي اليوم»
  - `src/components/app/screens/DoseScreen.tsx:130` — Skip button

**TXT-0222** — «التخطي مش فشل — الجرعة القادمة بانتظارك، والتعافي لا بيتقاس بيوم واحد.»
  - `src/components/app/screens/DoseScreen.tsx:136` — Skip guidance

**TXT-0223** — «اختيرت دي الجرعة بناءً على حالتك الحالية —»
  - `src/components/app/screens/DoseScreen.tsx:144` — Selection note lead

**TXT-0224** — «لأن سجلك يحوي زَلّة أو انتكاسة خلال ده الأسبوع، نفضّل موضوعات الزلّة والانتكاسة…»
  - `src/components/app/screens/DoseScreen.tsx:148` — Selection note branch

**TXT-0225** — «يومك في الرحلة ومحفزاتك الأخيرة. الرحلة تنظيم للمحتوى، لا وعدًا زمنيًا.»
  - `src/components/app/screens/DoseScreen.tsx:149` — Selection note branch

**TXT-0226** — «جرعات سابقة»
  - `src/components/app/screens/DoseScreen.tsx:155` — Recent doses card title

**TXT-0227** — «${d.date} · ${CATEGORY_LABELS[d.item!.category]}»
  - `src/components/app/screens/DoseScreen.tsx:167` — Recent dose meta line

**TXT-0228** — «أُنجزت»
  - `src/components/app/screens/DoseScreen.tsx:177` — Recent dose status badge

**TXT-0229** — «مُخطاة»
  - `src/components/app/screens/DoseScreen.tsx:177` — Recent dose status badge

**TXT-0230** — «مرحلتك الحالية:»
  - `src/components/app/screens/DoseScreen.tsx:187` — Stage note label

**TXT-0231** — «تصفح قاعدة المعرفة كاملة»
  - `src/components/app/screens/DoseScreen.tsx:192` — Browse knowledge CTA

**TXT-0232** — «أنا وحدي دلوقتي»
  - `src/components/app/screens/UrgeScreen.tsx:90` — Context toggle

**TXT-0233** — «الوقت متأخر (بعد ١٠ مساءً)»
  - `src/components/app/screens/UrgeScreen.tsx:93` — Context toggle

**TXT-0234** — «أنا في السرير»
  - `src/components/app/screens/UrgeScreen.tsx:97` — Context toggle

**TXT-0235** — «بدأت أتصفح أو أدوّر بالفعل»
  - `src/components/app/screens/UrgeScreen.tsx:100` — Context toggle

**TXT-0236** — «أحتاج الجهاز دلوقتي للعمل/الدراسة»
  - `src/components/app/screens/UrgeScreen.tsx:106` — Context toggle

**TXT-0237** — «بدأت الرغبة؟ افحص اللي حاصل — عشان تعرف أنسب خطوة. الرغبة إحساس، مش أمر.»
  - `src/components/app/screens/UrgeScreen.tsx:191` — Screen subtitle

**TXT-0238** — «١ · شدة الرغبة»
  - `src/components/app/screens/UrgeScreen.tsx:195` — Scale 1 label

**TXT-0239** — «هادئة تقريبًا»
  - `src/components/app/screens/UrgeScreen.tsx:198` — Scale 1 low label

**TXT-0240** — «أقصى ما أعرفه»
  - `src/components/app/screens/UrgeScreen.tsx:199` — Scale 1 high label

**TXT-0241** — «٢ · مدى قربك من التنفيذ»
  - `src/components/app/screens/UrgeScreen.tsx:202` — Scale 2 label

**TXT-0242** — «بعيد خالص»
  - `src/components/app/screens/UrgeScreen.tsx:205` — Scale 2 low label

**TXT-0243** — «على وشك التنفيذ»
  - `src/components/app/screens/UrgeScreen.tsx:206` — Scale 2 high label

**TXT-0244** — «٣ · فقدان السيطرة»
  - `src/components/app/screens/UrgeScreen.tsx:209` — Scale 3 label

**TXT-0245** — «أنا مسيطر بالكامل»
  - `src/components/app/screens/UrgeScreen.tsx:212` — Scale 3 low label

**TXT-0246** — «بالكاد أقدر وقّف نفسي»
  - `src/components/app/screens/UrgeScreen.tsx:213` — Scale 3 high label

**TXT-0247** — «السياق دلوقتي (اختياري بسه مفيد جدًا)»
  - `src/components/app/screens/UrgeScreen.tsx:218` — Context card title

**TXT-0248** — «إيه اللي بدأ الموضوع؟»
  - `src/components/app/screens/UrgeScreen.tsx:250` — Trigger disclosure title
  - `src/components/app/screens/RelapseScreen.tsx:365` — Quick log question 3

**TXT-0249** — «(اختياري — بيساعد في اختيار التدخل)»
  - `src/components/app/screens/UrgeScreen.tsx:252` — Trigger disclosure hint

**TXT-0250** — «التقديرات دي منك عن لحظتك، على سلم من ١ لـ ٥ — مش قياس طبي ولا تنبؤ مضمون.»
  - `src/components/app/screens/UrgeScreen.tsx:283` — Input disclaimer

**TXT-0251** — «اعرف أنسب خطوة»
  - `src/components/app/screens/UrgeScreen.tsx:297` — Compute CTA

**TXT-0252** — «اختار درجتك في الأسئلة الثلاثة فوق الأول»
  - `src/components/app/screens/UrgeScreen.tsx:301` — Disabled helper

**TXT-0253** — «درجة حالتك دلوقتي»
  - `src/components/app/screens/UrgeScreen.tsx:325` — Result header label

**TXT-0254** — « من ٥»
  - `src/components/app/screens/UrgeScreen.tsx:331` — Result score suffix

**TXT-0255** — «أنسب خطوة دلوقتي: ${assessment.modeLabel}»
  - `src/components/app/screens/UrgeScreen.tsx:350` — Result mode line

**TXT-0256** — «الدرجة دي تقدير مبني على إجاباتك دلوقتي على سلم من ١ لـ ٥ — تساعدك تختار خطوتك، وم…»
  - `src/components/app/screens/UrgeScreen.tsx:357` — Result disclaimer

**TXT-0257** — «ولا حاجة ملحّة دلوقتي — كمّل يومك الطبيعي.»
  - `src/components/app/screens/UrgeScreen.tsx:366` — Awareness note level 1

**TXT-0258** — «بداية بسيطة — إحساس، مش أمر. ما تطعمهاش بانتباه زايد، واكمل يومك.»
  - `src/components/app/screens/UrgeScreen.tsx:367` — Awareness note level 2

**TXT-0259** — «علامات مبكرة تستحق اليقظة»
  - `src/components/app/screens/UrgeScreen.tsx:373` — Early signs card title

**TXT-0260** — «• افتكر مشاهد أو تطوير خيال»
  - `src/components/app/screens/UrgeScreen.tsx:376` — Early sign bullet

**TXT-0261** — «• تصفح بلا هدف أو «نظرة سريعة»»
  - `src/components/app/screens/UrgeScreen.tsx:377` — Early sign bullet

**TXT-0262** — «• التقاط الهاتف آليًا وقت الفراغ»
  - `src/components/app/screens/UrgeScreen.tsx:378` — Early sign bullet

**TXT-0263** — «• البقاء في السرير بعد الاستيقاظ»
  - `src/components/app/screens/UrgeScreen.tsx:379` — Early sign bullet

**TXT-0264** — «اقرأ موضوعًا من قاعدة المعرفة»
  - `src/components/app/screens/UrgeScreen.tsx:390` — Knowledge CTA

**TXT-0265** — «الموضوع المقترح لحظتك دي: «${urgeTopic.title}»»
  - `src/components/app/screens/UrgeScreen.tsx:394` — Suggested topic line

**TXT-0266** — «فحص جديد»
  - `src/components/app/screens/UrgeScreen.tsx:400` — New check button

**TXT-0267** — «الرغبة بدأت بتقوى — اقطعها دلوقتي وهي لسه صغيرة: خطوة قطع واحدة تكفي غالبًا.»
  - `src/components/app/screens/UrgeScreen.tsx:409` — Interrupt note

**TXT-0268** — «قربت من التصرف؟ ما تحللش دلوقتي — ابدأ التدخل فورًا.»
  - `src/components/app/screens/UrgeScreen.tsx:410` — Immediate note

**TXT-0269** — «صوت التفاوض يهمس؟ افتح الردود الجاهزة»
  - `src/components/app/screens/UrgeScreen.tsx:423` — Anti-rationalization toggle

**TXT-0270** — «ابدأ التدخل المقترح دلوقتي»
  - `src/components/app/screens/UrgeScreen.tsx:446` — Intervention CTA

**TXT-0271** — «ابدأ وضع الطوارئ بدلًا منه»
  - `src/components/app/screens/UrgeScreen.tsx:460` — Emergency alternative CTA

**TXT-0272** — «أزمة فورية — ما تقراش أكتر.»
  - `src/components/app/screens/UrgeScreen.tsx:469` — Maximum danger note bold

**TXT-0273** — «اضغط الزر وابدأ أول خطوة قطع دلوقتي.»
  - `src/components/app/screens/UrgeScreen.tsx:469` — Maximum danger note tail

**TXT-0274** — «تدخّل دلوقتي — وضع الطوارئ»
  - `src/components/app/screens/UrgeScreen.tsx:485` — Emergency CTA

**TXT-0275** — «سنعرض لك خطوات قليلة وواضحة بس — كلما ارتفع الخطر قلّت الخيارات.»
  - `src/components/app/screens/UrgeScreen.tsx:489` — Emergency mode note

**TXT-0276** — «سجّلت الفحص ده بالغلط؟ امسحه من السجل»
  - `src/components/app/screens/UrgeScreen.tsx:506` — Delete check link

**TXT-0277** — «مسح الفحص ده من السجل؟»
  - `src/components/app/screens/UrgeScreen.tsx:516` — Delete confirm title

**TXT-0278** — «هيتمسح من سجل الفحوصات، وخريطة المحفزات ومؤشرات تقدمك هتتحسب من تاني من غيره. ما…»
  - `src/components/app/screens/UrgeScreen.tsx:518` — Delete confirm body

**TXT-0279** — «تراجع»
  - `src/components/app/screens/UrgeScreen.tsx:523` — Delete confirm cancel
  - `src/components/app/screens/RelapseScreen.tsx:752` — Delete confirm cancel
  - `src/components/app/screens/PreventionScreen.tsx:333` — Delete rule cancel
  - `src/components/app/screens/PreventionScreen.tsx:362` — Remove support cancel
  - `src/components/app/screens/SettingsScreen.tsx:318` — Wipe cancel
  - `src/components/app/RestoreBackup.tsx:236` — Confirm dialog cancel

**TXT-0280** — «نعم، امسح الفحص»
  - `src/components/app/screens/UrgeScreen.tsx:528` — Delete confirm action

**TXT-0281** — «اعمل التدخل»
  - `src/components/app/screens/UrgeScreen.tsx:542` — Intervention phase title

**TXT-0282** — «خطوة واحدة بس — مش محتاج حل كل حاجة دلوقتي.»
  - `src/components/app/screens/UrgeScreen.tsx:543` — Intervention phase subtitle

**TXT-0283** — «تخطي إلى إعادة التقييم»
  - `src/components/app/screens/UrgeScreen.tsx:552` — Skip to reassess

**TXT-0284** — «بعد التدخل»
  - `src/components/app/screens/UrgeScreen.tsx:562` — Outcome phase title

**TXT-0285** — «الخطر هبط ولا لسه؟»
  - `src/components/app/screens/UrgeScreen.tsx:563` — Outcome phase subtitle

**TXT-0286** — «نعم، هبطت»
  - `src/components/app/screens/UrgeScreen.tsx:575` — Outcome option 1 bold

**TXT-0287** — «ارجع ليومك — الموجة دي مسجّلة وبتتحسب ليك»
  - `src/components/app/screens/UrgeScreen.tsx:577` — Outcome option 1 desc

**TXT-0288** — «لا، لسه مرتفعة»
  - `src/components/app/screens/UrgeScreen.tsx:589` — Outcome option 2 bold

**TXT-0289** — «نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام»
  - `src/components/app/screens/UrgeScreen.tsx:591` — Outcome option 2 desc

**TXT-0290** — «نفّذت السلوك»
  - `src/components/app/screens/UrgeScreen.tsx:603` — Outcome option 3 bold

**TXT-0291** — «لا عقاب ولا جلد — المهم دلوقتي: ما تكمّلش»
  - `src/components/app/screens/UrgeScreen.tsx:605` — Outcome option 3 desc

**TXT-0292** — «هبط الخطر — أحسنت»
  - `src/components/app/screens/EmergencyMode.tsx:119` — Completion title

**TXT-0293** — «ارجع ليومك الطبيعي. سجّلنا إنك تعاملت مع الموجة — وده بيتراكم في مؤشراتك.»
  - `src/components/app/screens/EmergencyMode.tsx:121` — Completion body

**TXT-0294** — «عودة إلى يومي»
  - `src/components/app/screens/EmergencyMode.tsx:132` — Completion CTA

**TXT-0295** — «تدخل أقوى»
  - `src/components/app/screens/EmergencyMode.tsx:171` — Step 3 escalated title

**TXT-0296** — «نفّذ تدخلًا واحدًا»
  - `src/components/app/screens/EmergencyMode.tsx:171` — Step 3 title

**TXT-0297** — «${intervention.duration} · ${intervention.location}»
  - `src/components/app/screens/EmergencyMode.tsx:177` — Intervention meta line

**TXT-0298** — «تم — الخطوة اللي بعدها»
  - `src/components/app/screens/EmergencyMode.tsx:211` — Next step CTA
  - `src/components/app/screens/RelapseScreen.tsx:287` — Stop step CTA

**TXT-0299** — «لو تقدر فورًا:»
  - `src/components/app/screens/EmergencyMode.tsx:218` — Escalated support label

**TXT-0300** — «اتصل بـ${data.supportPerson.label}»
  - `src/components/app/screens/EmergencyMode.tsx:227` — Call support link
  - `src/components/app/screens/PreventionScreen.tsx:247` — Call support link

**TXT-0301** — ««${SUPPORT_MESSAGE_TEMPLATES[0]}» — أرسلها لأي شخص تثق به»
  - `src/components/app/screens/EmergencyMode.tsx:232` — Support template fallback

**TXT-0302** — «هبط الخطر؟»
  - `src/components/app/screens/EmergencyMode.tsx:247` — Step 4 title

**TXT-0303** — «نعم — هبط»
  - `src/components/app/screens/EmergencyMode.tsx:257` — Reassess success option

**TXT-0304** — «لا — لسه مرتفع: جرّب تدخلًا أقوى»
  - `src/components/app/screens/EmergencyMode.tsx:265` — Reassess escalate option

**TXT-0305** — «اقفل كل التبويبات والتطبيقات غير المتصلة بمهمتك — أبقِ مهمة العمل وحدها.»
  - `src/components/app/screens/EmergencyMode.tsx:278` — Step 1 instruction (work-safe)

**TXT-0306** — «اقفل المصدر دلوقتي: التبويب، التطبيق، أو الصفحة — من غير ما تقرا سطر زيادة.»
  - `src/components/app/screens/EmergencyMode.tsx:279` — Step 1 instruction

**TXT-0307** — «اخرج من المكان لأي مكان فيه ناس أو حركة — ومش لازم تخبر حد بأي حاجة.»
  - `src/components/app/screens/EmergencyMode.tsx:281` — Step 2 instruction

**TXT-0308** — «• ${s}»
  - `src/components/app/screens/EmergencyMode.tsx:294` — Work-safe sub-steps

**TXT-0309** — «خروج من وضع الطوارئ»
  - `src/components/app/screens/EmergencyMode.tsx:317` — Exit link

**TXT-0310** — «كلماتك أنت»
  - `src/components/app/screens/EmergencyMode.tsx:341` — Personal why card label

**TXT-0311** — «وضع الطوارئ»
  - `src/components/app/screens/EmergencyMode.tsx:434` — Overlay aria-label

**TXT-0312** — «ما تحللش دلوقتي.»
  - `src/components/app/screens/EmergencyMode.tsx:467` — Overlay header line 1

**TXT-0313** — «نفّذ الخطوة الحالية بس.»
  - `src/components/app/screens/EmergencyMode.tsx:469` — Overlay header line 2

**TXT-0314** — «الخطوة ${step} من 4»
  - `src/components/app/screens/EmergencyMode.tsx:474` — Step counter

**TXT-0315** — «درجة الحالة: ${riskLevel} من ٥ ${maximum ? "— أزمة" : ""}»
  - `src/components/app/screens/EmergencyMode.tsx:478` — Risk badge

**TXT-0316** — «اقفل اللي قدامك دلوقتي — مهما كان حجمه.»
  - `src/components/app/screens/RelapseScreen.tsx:56` — Stop step 1

**TXT-0317** — «انهض واخرج من المكان فورًا.»
  - `src/components/app/screens/RelapseScreen.tsx:57` — Stop step 2

**TXT-0318** — «متدورش على «بديل» — البديل جزء من نفس الحلقة.»
  - `src/components/app/screens/RelapseScreen.tsx:58` — Stop step 3

**TXT-0319** — «ارجع لأي نشاط طبيعي — أي مهمة صغيرة ملموسة.»
  - `src/components/app/screens/RelapseScreen.tsx:59` — Stop step 4

**TXT-0320** — «متعاقبش نفسك — لا إنهاك ولا حرمان ولا جلد.»
  - `src/components/app/screens/RelapseScreen.tsx:60` — Stop step 5

**TXT-0321** — «التحليل بعدين لما تهدى — دلوقتي: توقف وبس.»
  - `src/components/app/screens/RelapseScreen.tsx:61` — Stop step 6

**TXT-0322** — «توقفت فورًا»
  - `src/components/app/screens/RelapseScreen.tsx:65` — Time-to-stop option

**TXT-0323** — «خلال دقائق»
  - `src/components/app/screens/RelapseScreen.tsx:66` — Time-to-stop option

**TXT-0324** — «أقل من ساعة»
  - `src/components/app/screens/RelapseScreen.tsx:67` — Time-to-stop option

**TXT-0325** — «استغرق أكثر»
  - `src/components/app/screens/RelapseScreen.tsx:68` — Time-to-stop option

**TXT-0326** — «إباحية»
  - `src/components/app/screens/RelapseScreen.tsx:73` — Behavior option

**TXT-0327** — «استمناء»
  - `src/components/app/screens/RelapseScreen.tsx:74` — Behavior option

**TXT-0328** — «زَلّة»
  - `src/components/app/screens/RelapseScreen.tsx:85` — Classification option label

**TXT-0329** — «مرة محدودة ثم توقفت عندها»
  - `src/components/app/screens/RelapseScreen.tsx:86` — Classification option desc

**TXT-0330** — «انتكاسة»
  - `src/components/app/screens/RelapseScreen.tsx:90` — Classification option label

**TXT-0331** — «حسّيت أنني عدت إلى النمط القديم»
  - `src/components/app/screens/RelapseScreen.tsx:91` — Classification option desc

**TXT-0332** — «الاثنين معًا»
  - `src/components/app/screens/RelapseScreen.tsx:100` — Both behaviors label

**TXT-0333** — «السياق اللي حدث»
  - `src/components/app/screens/RelapseScreen.tsx:225` — Suggested rule trigger fallback

**TXT-0334** — «بدأ الأمر من ${triggerLabel}»
  - `src/components/app/screens/RelapseScreen.tsx:227` — Suggested rule if-text

**TXT-0335** — «أتدخل مبكرًا: ${rCutPoint || "أغلق المصدر وأغيّر المكان فورًا"}»
  - `src/components/app/screens/RelapseScreen.tsx:228` — Suggested rule then-text

**TXT-0336** — «ما تكملش — الوقفة هنا أهم خطوة.»
  - `src/components/app/screens/RelapseScreen.tsx:247` — Stop flow subtitle

**TXT-0337** — «وقّفت — الخطوة اللي بعدها»
  - `src/components/app/screens/RelapseScreen.tsx:286` — Stop step 1 CTA

**TXT-0338** — «تخطي إلى التسجيل السريع»
  - `src/components/app/screens/RelapseScreen.tsx:295` — Skip to quick log

**TXT-0339** — «تسجيل سريع»
  - `src/components/app/screens/RelapseScreen.tsx:309` — Quick log title

**TXT-0340** — «دقيقة واحدة — بلا تفاصيل صريحة. البيانات تصنع خريطتك.»
  - `src/components/app/screens/RelapseScreen.tsx:310` — Quick log subtitle

**TXT-0341** — «ما السلوك اللي حدث؟»
  - `src/components/app/screens/RelapseScreen.tsx:315` — Quick log question 1

**TXT-0342** — «اختار كل اللي حصل — الاثنين معًا لو كانا معًا.»
  - `src/components/app/screens/RelapseScreen.tsx:333` — Quick log question 1 helper

**TXT-0343** — «إزاي توصف اللي حصل؟»
  - `src/components/app/screens/RelapseScreen.tsx:339` — Quick log question 2

**TXT-0344** — «تصنيفك أنت — التطبيق مش هو اللي يقرر عنك.»
  - `src/components/app/screens/RelapseScreen.tsx:359` — Quick log question 2 helper

**TXT-0345** — «كم استغرق التوقف؟»
  - `src/components/app/screens/RelapseScreen.tsx:376` — Quick log question 4

**TXT-0346** — «هل كمّلت بعد أول مرة؟»
  - `src/components/app/screens/RelapseScreen.tsx:391` — Quick log question 5

**TXT-0347** — «لا — وقّفت عند أولها»
  - `src/components/app/screens/RelapseScreen.tsx:393` — Continued option

**TXT-0348** — «نعم، استمرت الجلسة»
  - `src/components/app/screens/RelapseScreen.tsx:394` — Continued option

**TXT-0349** — «حفظ ومتابعة»
  - `src/components/app/screens/RelapseScreen.tsx:399` — Quick log save

**TXT-0350** — «بعد اللي حصل: تذكير مهم»
  - `src/components/app/screens/RelapseScreen.tsx:414` — Reframe title

**TXT-0351** — «اقرأها براحة ثم عد إلى يومك.»
  - `src/components/app/screens/RelapseScreen.tsx:415` — Reframe subtitle

**TXT-0352** — «اللي حصل مش بيحدد مستقبلك.»
  - `src/components/app/screens/RelapseScreen.tsx:420` — Reframe truth 1

**TXT-0353** — «عدّاد الأيام ممكن بيبدأ تاني — بس خبرتك ما بترجعش للصفر.»
  - `src/components/app/screens/RelapseScreen.tsx:421` — Reframe truth 2

**TXT-0354** — «اللي حصل مش يوم ضايع، ولا إذن بالتكملة — الوقفة دلوقتي قرار جديد.»
  - `src/components/app/screens/RelapseScreen.tsx:422` — Reframe truth 3

**TXT-0355** — «اللي حصل معلومة — استخدمها في تحسين خطة الأيام الجاية.»
  - `src/components/app/screens/RelapseScreen.tsx:423` — Reframe truth 4

**TXT-0356** — «سجّلناها كانتكاسة. الوقفة هنا — رغم كل حاجة — خطوة قائمة بذاتها، ومؤشراتك محفوظة.…»
  - `src/components/app/screens/RelapseScreen.tsx:436` — Reframe note (relapse)

**TXT-0357** — «سجّلناها كزَلّة — ومؤشراتك محفوظة:»
  - `src/components/app/screens/RelapseScreen.tsx:441` — Reframe note (slip) lead

**TXT-0358** — «توقفت فورًا — استجابة ممتازة»
  - `src/components/app/screens/RelapseScreen.tsx:443` — Reframe note (slip) fast-stop

**TXT-0359** — «وقفت — وكل وقفة بتتحسب ليك»
  - `src/components/app/screens/RelapseScreen.tsx:444` — Reframe note (slip) slow-stop

**TXT-0360** — «المراجعة الهادئة تنتظرك هنا بعد كده، لما تكون مستعدًا.»
  - `src/components/app/screens/RelapseScreen.tsx:445` — Reframe note (slip) tail

**TXT-0361** — «العودة إلى يومي الطبيعي»
  - `src/components/app/screens/RelapseScreen.tsx:450` — Reframe primary CTA

**TXT-0362** — «حلّل براحة دلوقتي (لو إنت مستعدًا)»
  - `src/components/app/screens/RelapseScreen.tsx:458` — Reframe analyze CTA

**TXT-0363** — «مراجعة هادئة»
  - `src/components/app/screens/RelapseScreen.tsx:483` — Review title

**TXT-0364** — «الهدف مش «ليه أنا ضعيف» — الهدف: نلاقي أبكر نقطة كان ممكن توقف عندها.»
  - `src/components/app/screens/RelapseScreen.tsx:484` — Review subtitle

**TXT-0365** — «١ · إيه اللي بدأ الموضوع؟»
  - `src/components/app/screens/RelapseScreen.tsx:492` — Review step 1

**TXT-0366** — «٢ · إيه اللي خلّى المقاومة أضعف يومها؟»
  - `src/components/app/screens/RelapseScreen.tsx:511` — Review step 2

**TXT-0367** — «٣ · ما أول علامة ظهرت قبل السلوك؟»
  - `src/components/app/screens/RelapseScreen.tsx:525` — Review step 3

**TXT-0368** — «أو اكتب علامتك بأسلوبك…»
  - `src/components/app/screens/RelapseScreen.tsx:540` — Review step 3 placeholder

**TXT-0369** — «٤ · ما أول فعل قادك إلى السلوك؟»
  - `src/components/app/screens/RelapseScreen.tsx:550` — Review step 4

**TXT-0370** — «مثال: فتحت المتصفح وبدأت أدوّر…»
  - `src/components/app/screens/RelapseScreen.tsx:554` — Review step 4 placeholder

**TXT-0371** — «٥ · في أي لحظة كبر الأمر؟»
  - `src/components/app/screens/RelapseScreen.tsx:564` — Review step 5

**TXT-0372** — «مثال: بقيت في الغرفة بدل الخروج، و«دقيقة واحدة» صارت جلسة…»
  - `src/components/app/screens/RelapseScreen.tsx:568` — Review step 5 placeholder

**TXT-0373** — «٦ · فين كان يمكن التوقف مبكرًا؟ (نقطة القطع الأفضل)»
  - `src/components/app/screens/RelapseScreen.tsx:579` — Review step 6

**TXT-0374** — «مثال: قبل فتح المتصفح — أو لحظة أول فكرة والانتقال مباشرة…»
  - `src/components/app/screens/RelapseScreen.tsx:584` — Review step 6 placeholder

**TXT-0375** — «درس واحد تحفظه:»
  - `src/components/app/screens/RelapseScreen.tsx:587` — Review lesson label

**TXT-0376** — «جملة واحدة تكفي…»
  - `src/components/app/screens/RelapseScreen.tsx:591` — Review lesson placeholder
  - `src/components/app/screens/PlanScreen.tsx:460` — Q4 placeholder

**TXT-0377** — «قاعدة وقاية مقترحة»
  - `src/components/app/screens/RelapseScreen.tsx:597` — Suggested rule card title

**TXT-0378** — «إذا بدأ الأمر من ${TRIGGERS.find((t) => t.id === rTrigger)?.label ?? "نفس السياق…»
  - `src/components/app/screens/RelapseScreen.tsx:599` — Suggested rule preview

**TXT-0379** — «نفس السياق»
  - `src/components/app/screens/RelapseScreen.tsx:600` — Suggested rule trigger fallback

**TXT-0380** — «أضفها إلى خطة الوقاية»
  - `src/components/app/screens/RelapseScreen.tsx:605` — Add rule CTA

**TXT-0381** — «أُضيفت القاعدة إلى خطة الوقاية — تقدر تعدّلها هناك إمتى شئت.»
  - `src/components/app/screens/RelapseScreen.tsx:611` — Rule added confirmation

**TXT-0382** — «حفظ المراجعة»
  - `src/components/app/screens/RelapseScreen.tsx:631` — Review save button
  - `src/components/app/screens/PlanScreen.tsx:497` — Check-in save button

**TXT-0383** — «حصلت زَلّة؟ ما تكملش — إيقاف فوري، وبعدها نفهم اللي حصل براحة.»
  - `src/components/app/screens/RelapseScreen.tsx:643` — Main subtitle

**TXT-0384** — «حصلت دلوقتي — وقّفها هنا»
  - `src/components/app/screens/RelapseScreen.tsx:649` — Main CTA

**TXT-0385** — «مراجعات هادئة بانتظارك (${pendingReview.length})»
  - `src/components/app/screens/RelapseScreen.tsx:657` — Pending review card title

**TXT-0386** — «حلّلها لما تهدأ — كل مراجعة بتحوّل اللي حصل إلى قاعدة وقاية جديدة.»
  - `src/components/app/screens/RelapseScreen.tsx:660` — Pending review card body

**TXT-0387** — «مراجعة ${classificationLabel(e) ?? "ما حدث"} ${arabicDateTime(e.ts)}»
  - `src/components/app/screens/RelapseScreen.tsx:671` — Pending review entry

**TXT-0388** — «اللي حصل»
  - `src/components/app/screens/RelapseScreen.tsx:671` — Pending review fallback

**TXT-0389** — «سرعة التوقف»
  - `src/components/app/screens/RelapseScreen.tsx:682` — Stat tile label
  - `src/components/app/screens/ProgressScreen.tsx:127` — Stat tile label

**TXT-0390** — «فوري تقريبًا»
  - `src/components/app/screens/RelapseScreen.tsx:686` — Stat tile value

**TXT-0391** — «~${metrics.avgStopMinutes} دقيقة»
  - `src/components/app/screens/RelapseScreen.tsx:687` — Stat tile value

**TXT-0392** — «—»
  - `src/components/app/screens/RelapseScreen.tsx:688` — Stat tile empty value
  - `src/components/app/screens/ProgressScreen.tsx:133` — Stop speed empty value

**TXT-0393** — «متوسط آخر ٣٠ يومًا»
  - `src/components/app/screens/RelapseScreen.tsx:690` — Stat tile hint

**TXT-0394** — «وقّفت عند أولها»
  - `src/components/app/screens/RelapseScreen.tsx:694` — Stat tile label
  - `src/components/app/screens/ProgressScreen.tsx:110` — Stat tile label

**TXT-0395** — «من ${data.relapseEvents.length} في السجل»
  - `src/components/app/screens/RelapseScreen.tsx:696` — Stat tile hint

**TXT-0396** — «سجل الزلات والانتكاسات»
  - `src/components/app/screens/RelapseScreen.tsx:705` — Records card title

**TXT-0397** — «لا سجل بعد»
  - `src/components/app/screens/RelapseScreen.tsx:709` — Records empty state title

**TXT-0398** — «ده مكان آمن بلا أحكام: إن حصلت زَلّة أو انتكاسة، ستجد هنا خطوة إيقاف ومراجعة ها…»
  - `src/components/app/screens/RelapseScreen.tsx:710` — Records empty state body

**TXT-0399** — «لا عقاب ولا تعويض قاسٍ بعد اللي حصل — الإنهاك والحرمان يزيدان الضيق اللي يغذي الدو…»
  - `src/components/app/screens/RelapseScreen.tsx:728` — No-punishment note

**TXT-0400** — «تحديث خطة الوقاية بعد كل زَلّة أو انتكاسة»
  - `src/components/app/screens/RelapseScreen.tsx:733` — Prevention link

**TXT-0401** — «حذف السجل نهائيًا؟»
  - `src/components/app/screens/RelapseScreen.tsx:746` — Delete confirm title

**TXT-0402** — «هيتمسح السجل ده${confirmDeleteEvent?.reviewed ? " والمراجعة المرتبطة بيه" : ""} …»
  - `src/components/app/screens/RelapseScreen.tsx:748` — Delete confirm body

**TXT-0403** — « والمراجعة المرتبطة بيه»
  - `src/components/app/screens/RelapseScreen.tsx:748` — Delete confirm extra phrase

**TXT-0404** — «نعم، احذف السجل»
  - `src/components/app/screens/RelapseScreen.tsx:760` — Delete confirm action

**TXT-0405** — «استمرت الجلسة»
  - `src/components/app/screens/RelapseScreen.tsx:828` — Record badge

**TXT-0406** — «وقّف عند حدّه»
  - `src/components/app/screens/RelapseScreen.tsx:828` — Record badge

**TXT-0407** — «مُراجَع»
  - `src/components/app/screens/RelapseScreen.tsx:832` — Record badge

**TXT-0408** — «حلّل»
  - `src/components/app/screens/RelapseScreen.tsx:840` — Analyze button

**TXT-0409** — «حذف السجل»
  - `src/components/app/screens/RelapseScreen.tsx:843` — Delete button aria-label

**TXT-0410** — «إخفاء التفاصيل»
  - `src/components/app/screens/RelapseScreen.tsx:856` — Details toggle (open)

**TXT-0411** — «عرض التفاصيل»
  - `src/components/app/screens/RelapseScreen.tsx:856` — Details toggle (closed)

**TXT-0412** — «المحفزات»
  - `src/components/app/screens/RelapseScreen.tsx:861` — Detail line label

**TXT-0413** — «لم تُحدّد»
  - `src/components/app/screens/RelapseScreen.tsx:862` — Detail line fallback

**TXT-0414** — «التصنيف»
  - `src/components/app/screens/RelapseScreen.tsx:865` — Detail line label

**TXT-0415** — «السلوك»
  - `src/components/app/screens/RelapseScreen.tsx:870` — Detail line label

**TXT-0416** — «التوقف»
  - `src/components/app/screens/RelapseScreen.tsx:874` — Detail line label

**TXT-0417** — «مراجعتك الهادئة»
  - `src/components/app/screens/RelapseScreen.tsx:881` — Review details section title

**TXT-0418** — «أول علامة»
  - `src/components/app/screens/RelapseScreen.tsx:882` — Detail line label

**TXT-0419** — «أول فعل»
  - `src/components/app/screens/RelapseScreen.tsx:883` — Detail line label

**TXT-0420** — «لحظة الكبر»
  - `src/components/app/screens/RelapseScreen.tsx:884` — Detail line label

**TXT-0421** — «نقطة القطع الأفضل»
  - `src/components/app/screens/RelapseScreen.tsx:885` — Detail line label

**TXT-0422** — «درس تحفظه»
  - `src/components/app/screens/RelapseScreen.tsx:886` — Detail line label

**TXT-0423** — «ضعف المقاومة يومها»
  - `src/components/app/screens/RelapseScreen.tsx:888` — Detail line label

**TXT-0424** — «سجل تاريخي — ما اتراجعش بعد. زر «حلّل» يفتح المراجعة الهادئة وقت ما تكون مستعدًا…»
  - `src/components/app/screens/RelapseScreen.tsx:893` — No-review note

**TXT-0425** — «قواعد «إذا… إذن» وحمايتك الرقمية — تُصنع في الهدوء لتعمل وقت العاصفة.»
  - `src/components/app/screens/PreventionScreen.tsx:81` — Screen subtitle

**TXT-0426** — «قواعدي «إذا… إذن»»
  - `src/components/app/screens/PreventionScreen.tsx:89` — Rules card title

**TXT-0427** — «قاعدة جديدة»
  - `src/components/app/screens/PreventionScreen.tsx:101` — Add rule button

**TXT-0428** — «لا قواعد بعد — أضف قاعدة لأكثر سياقاتك خطورة.»
  - `src/components/app/screens/PreventionScreen.tsx:107` — Rules empty state

**TXT-0429** — «إذا»
  - `src/components/app/screens/PreventionScreen.tsx:123` — Rule if badge

**TXT-0430** — «إذن»
  - `src/components/app/screens/PreventionScreen.tsx:129` — Rule then badge

**TXT-0431** — «تعديل»
  - `src/components/app/screens/PreventionScreen.tsx:137` — Edit rule aria-label
  - `src/components/app/screens/PlanScreen.tsx:375` — Open check-in button (done)
  - `src/components/app/screens/SettingsScreen.tsx:509` — Prefs dialog open button

**TXT-0432** — «حذف»
  - `src/components/app/screens/PreventionScreen.tsx:145` — Delete rule aria-label

**TXT-0433** — «مُفعّلة»
  - `src/components/app/screens/PreventionScreen.tsx:154` — Rule toggle title (active)

**TXT-0434** — «موقوفة»
  - `src/components/app/screens/PreventionScreen.tsx:154` — Rule toggle title (inactive)

**TXT-0435** — «الحماية الرقمية (أدوات خارجية اختيارية)»
  - `src/components/app/screens/PreventionScreen.tsx:169` — Digital protection card title

**TXT-0436** — «حدوده:»
  - `src/components/app/screens/PreventionScreen.tsx:190` — Guide limits label

**TXT-0437** — «لا تضبط دي الأدوات أثناء أزمة (درجة الحالة ٥) — جهّزها قبل كده في وقت هادئ.»
  - `src/components/app/screens/PreventionScreen.tsx:197` — Crisis warning note

**TXT-0438** — «شخص دعم (اختياري خالص)»
  - `src/components/app/screens/PreventionScreen.tsx:207` — Support person card title

**TXT-0439** — «شخص تثق به — بيظهر زر اتصاله في التصعيد. لن يُكشف له أي حاجة تلقائيًا؛ الرسائل محا…»
  - `src/components/app/screens/PreventionScreen.tsx:210` — Support person card body

**TXT-0440** — «سمّه ما شئت (أخي، صديقي…)»
  - `src/components/app/screens/PreventionScreen.tsx:217` — Support name placeholder

**TXT-0441** — «رقمه (يُخزن محليًا بس)»
  - `src/components/app/screens/PreventionScreen.tsx:223` — Support phone placeholder

**TXT-0442** — «تحديث»
  - `src/components/app/screens/PreventionScreen.tsx:239` — Save support button (existing)

**TXT-0443** — «حفظ»
  - `src/components/app/screens/PreventionScreen.tsx:239` — Save support button (new)

**TXT-0444** — «إزالة»
  - `src/components/app/screens/PreventionScreen.tsx:256` — Remove support button

**TXT-0445** — «قوالب رسائل محايدة (انسخها وقت ما محتاج):»
  - `src/components/app/screens/PreventionScreen.tsx:262` — Templates label

**TXT-0446** — «تعديل القاعدة»
  - `src/components/app/screens/PreventionScreen.tsx:279` — Edit rule dialog title

**TXT-0447** — «قاعدة وقاية جديدة»
  - `src/components/app/screens/PreventionScreen.tsx:279` — Add rule dialog title

**TXT-0448** — «حدث ماذا؟»
  - `src/components/app/screens/PreventionScreen.tsx:287` — If-field label

**TXT-0449** — «مثال: حسّيت بالملل والتقطت الهاتف بلا هدف…»
  - `src/components/app/screens/PreventionScreen.tsx:292` — If-field placeholder

**TXT-0450** — «ماذا أفعل فورًا؟»
  - `src/components/app/screens/PreventionScreen.tsx:301` — Then-field label

**TXT-0451** — «مثال: اقفله وأنهض وأمشي ١٠ دقائق…»
  - `src/components/app/screens/PreventionScreen.tsx:306` — Then-field placeholder

**TXT-0452** — «حفظ التعديل»
  - `src/components/app/screens/PreventionScreen.tsx:311` — Save edit button

**TXT-0453** — «أضف القاعدة»
  - `src/components/app/screens/PreventionScreen.tsx:311` — Add rule button

**TXT-0454** — «حذف القاعدة؟»
  - `src/components/app/screens/PreventionScreen.tsx:326` — Delete rule confirm title

**TXT-0455** — ««${confirmDeleteRule?.ifText}» هيتمسح من خطة الوقاية نهائيًا. باقي قواعدك مش هتت…»
  - `src/components/app/screens/PreventionScreen.tsx:328` — Delete rule confirm body

**TXT-0456** — «نعم، احذف القاعدة»
  - `src/components/app/screens/PreventionScreen.tsx:341` — Delete rule action

**TXT-0457** — «إزالة شخص الدعم؟»
  - `src/components/app/screens/PreventionScreen.tsx:355` — Remove support confirm title

**TXT-0458** — «زر الاتصال بـ«${data.supportPerson?.label}» هيختفي من وضع الطوارئ. تقدر تضيفه من…»
  - `src/components/app/screens/PreventionScreen.tsx:357` — Remove support confirm body

**TXT-0459** — «نعم، أزيله»
  - `src/components/app/screens/PreventionScreen.tsx:372` — Remove support action

**TXT-0460** — «حسّيت بالملل والتقطت الهاتف بلا هدف»
  - `src/lib/app/store.ts:349` — Default seeded rule if-text

**TXT-0461** — «اقفله فورًا وأنهض من مكاني»
  - `src/lib/app/store.ts:350` — Default seeded rule then-text

**TXT-0462** — «بدأت بالبحث عن محفز»
  - `src/lib/app/store.ts:357` — Default seeded rule if-text

**TXT-0463** — «اقفل المتصفح وأغيّر المكان»
  - `src/lib/app/store.ts:358` — Default seeded rule then-text

**TXT-0464** — «وصلت درجة الرغبة ٣ من ٥»
  - `src/lib/app/store.ts:365` — Default seeded rule if-text

**TXT-0465** — «أبدأ خطوة قطع فورًا»
  - `src/lib/app/store.ts:366` — Default seeded rule then-text

**TXT-0466** — «كنت وحدي ليلًا وبدأت الرغبة»
  - `src/lib/app/store.ts:373` — Default seeded rule if-text

**TXT-0467** — «أخرج من الغرفة»
  - `src/lib/app/store.ts:374` — Default seeded rule then-text

**TXT-0468** — ««المحفز» هو ما بدأ الموجة عادة — الملل، التصفح، التأخير… أنماطك تُرسم من سجلك ت…»
  - `src/components/app/screens/TriggerMapScreen.tsx:52` — Screen subtitle (cold)

**TXT-0469** — «نحتاج قليلًا من السجل أولًا»
  - `src/components/app/screens/TriggerMapScreen.tsx:57` — Empty state title

**TXT-0470** — «سجّل ٣–٤ فحوصات رغبة (حتى الخفيف منها) وسيبدأ التطبيق برسم أنماطك: أكثر المحفزات…»
  - `src/components/app/screens/TriggerMapScreen.tsx:58` — Empty state body

**TXT-0471** — «الغرض ليس تسجيل التاريخ — بل اكتشاف أبكر نقطة تدخل في سلسلتك.»
  - `src/components/app/screens/TriggerMapScreen.tsx:61` — Cold note

**TXT-0472** — «أنماطك المكتشفة — الهدف: أبكر نقطة تقدر توقف عندها.»
  - `src/components/app/screens/TriggerMapScreen.tsx:71` — Screen subtitle (warm)

**TXT-0473** — «نمطك الأخطر (${insights.topPattern.count} مرة)»
  - `src/components/app/screens/TriggerMapScreen.tsx:81` — Top pattern title

**TXT-0474** — «أول علامة عادة:»
  - `src/components/app/screens/TriggerMapScreen.tsx:95` — First sign label

**TXT-0475** — «نقطة التدخل الأفضل:»
  - `src/components/app/screens/TriggerMapScreen.tsx:100` — Best cut point label

**TXT-0476** — «أنجز مراجعة هادئة لسجل واحد، وستظهر هنا «نقطة التدخل الأفضل» في نمطك.»
  - `src/components/app/screens/TriggerMapScreen.tsx:105` — No cut point hint

**TXT-0477** — «توزيع أوقات الخطر»
  - `src/components/app/screens/TriggerMapScreen.tsx:117` — Time distribution title

**TXT-0478** — «أكثر وقت محتاج حماية:»
  - `src/components/app/screens/TriggerMapScreen.tsx:145` — Most risky time label

**TXT-0479** — «خطّط له مبكرًا (قواعد «إذا… إذن» وبروتوكول الليل).»
  - `src/components/app/screens/TriggerMapScreen.tsx:146` — Most risky time tail

**TXT-0480** — «محفزاتك الأكثر تكرارًا»
  - `src/components/app/screens/TriggerMapScreen.tsx:157` — Frequencies title

**TXT-0481** — «لم تسجل محفزات في فحوصاتك بعد.»
  - `src/components/app/screens/TriggerMapScreen.tsx:160` — Frequencies empty

**TXT-0482** — «أكثر محفز متكرر:»
  - `src/components/app/screens/TriggerMapScreen.tsx:184` — Top trigger label

**TXT-0483** — «أقوى تدخل له عادة: تغيير البيئة فور ظهوره — قبل أي تفاوض داخلي.»
  - `src/components/app/screens/TriggerMapScreen.tsx:185` — Top trigger tail

**TXT-0484** — «أحسن تدخل عندك:»
  - `src/components/app/screens/TriggerMapScreen.tsx:190` — Best intervention label

**TXT-0485** — «النظام سيرجّحه تلقائيًا في المقترحات.»
  - `src/components/app/screens/TriggerMapScreen.tsx:191` — Best intervention tail

**TXT-0486** — «دي أنماط سلوكية مرصودة من سجلك — وليست تشخيصًا. الهدف العملي: أبكر نقطة تقدر تو…»
  - `src/components/app/screens/TriggerMapScreen.tsx:196` — Footer disclaimer

**TXT-0487** — «الصباح (٥ص–١٢م)»
  - `src/lib/app/helpers.ts:75` — Time bucket label

**TXT-0488** — «بعد الظهر (١٢م–٥م)»
  - `src/lib/app/helpers.ts:76` — Time bucket label

**TXT-0489** — «المساء (٥م–١٠م)»
  - `src/lib/app/helpers.ts:77` — Time bucket label

**TXT-0490** — «الليل المتأخر (١٠م–٥ص)»
  - `src/lib/app/helpers.ts:78` — Time bucket label

**TXT-0491** — «الوحدة»
  - `src/lib/app/progress.ts:201` — Pattern part label

**TXT-0492** — «السرير»
  - `src/lib/app/progress.ts:202` — Pattern part label

**TXT-0493** — «التصفح المتشعب»
  - `src/lib/app/progress.ts:203` — Pattern part label

**TXT-0494** — «مشي ١٠ دقائق»
  - `src/components/app/screens/PlanScreen.tsx:17` — Body choice

**TXT-0495** — «مشي ٢٠ دقيقة»
  - `src/components/app/screens/PlanScreen.tsx:17` — Body choice

**TXT-0496** — «تمرين منزلي»
  - `src/components/app/screens/PlanScreen.tsx:17` — Body choice

**TXT-0497** — «تمرين رياضي»
  - `src/components/app/screens/PlanScreen.tsx:17` — Body choice

**TXT-0498** — «دراجة/جري»
  - `src/components/app/screens/PlanScreen.tsx:17` — Body choice

**TXT-0499** — «تمدد»
  - `src/components/app/screens/PlanScreen.tsx:17` — Body choice

**TXT-0500** — «الحد الأدنى»
  - `src/components/app/screens/PlanScreen.tsx:20` — Day mode label

**TXT-0501** — «يوم صعب؟ أربع ركائز بس — يكفي»
  - `src/components/app/screens/PlanScreen.tsx:20` — Day mode desc

**TXT-0502** — «قياسي»
  - `src/components/app/screens/PlanScreen.tsx:21` — Day mode label

**TXT-0503** — «اليوم المتوازن الكامل»
  - `src/components/app/screens/PlanScreen.tsx:21` — Day mode desc

**TXT-0504** — «إضافي»
  - `src/components/app/screens/PlanScreen.tsx:22` — Day mode label

**TXT-0505** — «طاقة عالية؟ أضف بناءً أكثر»
  - `src/components/app/screens/PlanScreen.tsx:22` — Day mode desc

**TXT-0506** — «الصباح»
  - `src/components/app/screens/PlanScreen.tsx:75` — Section title

**TXT-0507** — «انهض مبكرًا بما يكفي · لا تصفح في أول ٣٠ دقيقة · حدّد مهمة اليوم»
  - `src/components/app/screens/PlanScreen.tsx:76` — Section body

**TXT-0508** — «مهمة اليوم المهمة»
  - `src/components/app/screens/PlanScreen.tsx:81` — Section title

**TXT-0509** — «اختار مهمة واحدة بس — وابدأ بأصغر خطوة فيها»
  - `src/components/app/screens/PlanScreen.tsx:82` — Section body fallback

**TXT-0510** — «الجسد: حركة»
  - `src/components/app/screens/PlanScreen.tsx:88` — Section title

**TXT-0511** — «١٠–٣٠ دقيقة حركة مناسبة لك»
  - `src/components/app/screens/PlanScreen.tsx:89` — Section body fallback

**TXT-0512** — «انتباه: جلسة تركيز»
  - `src/components/app/screens/PlanScreen.tsx:95` — Section title

**TXT-0513** — «١٠–٢٠ دقيقة عمل/دراسة/قراءة — بعيدًا عن السرير»
  - `src/components/app/screens/PlanScreen.tsx:96` — Section body

**TXT-0514** — «نظافة رقمية»
  - `src/components/app/screens/PlanScreen.tsx:101` — Section title

**TXT-0515** — «لا استخدام بلا هدف · الهاتف برا السرير · مراجعة سريعة لحاجزاتك»
  - `src/components/app/screens/PlanScreen.tsx:102` — Section body

**TXT-0516** — «تواصل»
  - `src/components/app/screens/PlanScreen.tsx:107` — Section title

**TXT-0517** — «جلسة مع الأهل أو مكالمة صديق — حضور حقيقي واحد يكفي»
  - `src/components/app/screens/PlanScreen.tsx:108` — Section body

**TXT-0518** — «بروتوكول الليل»
  - `src/components/app/screens/PlanScreen.tsx:113` — Section title

**TXT-0519** — «آخر ٣٠–٦٠ دقيقة: لا شاشات · جهّز الغد · اهدأ ثم نم»
  - `src/components/app/screens/PlanScreen.tsx:114` — Section body

**TXT-0520** — «جلسة تركيز ثانية»
  - `src/components/app/screens/PlanScreen.tsx:119` — Section title

**TXT-0521** — «إضافة لليوم الإضافي بس — جلسة بناء إضافية»
  - `src/components/app/screens/PlanScreen.tsx:120` — Section body

**TXT-0522** — «${arabicDate(new Date())} — البناء اليومي هو التعافي الحقيقي»
  - `src/components/app/screens/PlanScreen.tsx:135` — Screen subtitle

**TXT-0523** — «توقّع اليوم:»
  - `src/components/app/screens/PlanScreen.tsx:141` — Forecast label

**TXT-0524** — «فعّل قواعد اليوم قبل كده»
  - `src/components/app/screens/PlanScreen.tsx:150` — Forecast CTA

**TXT-0525** — «يوم الحد الأدنى ليس تنازلًا — إنه أذكى استجابة لليوم الصعب. يوم ناقص خير من يوم …»
  - `src/components/app/screens/PlanScreen.tsx:177` — Minimum mode note

**TXT-0526** — «${progressPct}%»
  - `src/components/app/screens/PlanScreen.tsx:189` — Progress percent

**TXT-0527** — «اكتب مهمتك المهمة اليوم…»
  - `src/components/app/screens/PlanScreen.tsx:201` — Purpose task placeholder

**TXT-0528** — «المراجعة المسائية»
  - `src/components/app/screens/PlanScreen.tsx:229` — Evening check-in card title
  - `src/components/app/screens/PlanScreen.tsx:383` — Check-in dialog title

**TXT-0529** — «أُنجزت الليلة ✓ — شكرًا لصدقك»
  - `src/components/app/screens/PlanScreen.tsx:231` — Check-in done subtitle

**TXT-0530** — «٥ أسئلة قصيرة + توقّع الغد»
  - `src/components/app/screens/PlanScreen.tsx:231` — Check-in pending subtitle

**TXT-0531** — «لا تسعَ للكمال: فقدان بند واحد لا يفسد اليوم — والتخطي مش فشل، بل حكمة اليوم …»
  - `src/components/app/screens/PlanScreen.tsx:249` — Footer note

**TXT-0532** — «${value}/5»
  - `src/components/app/screens/PlanScreen.tsx:339` — Condition scale value

**TXT-0533** — «${label} ${n}»
  - `src/components/app/screens/PlanScreen.tsx:347` — Condition scale aria-label

**TXT-0534** — «١ · أعلى رغبة اليوم؟»
  - `src/components/app/screens/PlanScreen.tsx:391` — Check-in Q1

**TXT-0535** — «${highestUrge}/5»
  - `src/components/app/screens/PlanScreen.tsx:393` — Check-in Q1 value

**TXT-0536** — «أعلى رغبة اليوم»
  - `src/components/app/screens/PlanScreen.tsx:398` — Q1 radiogroup aria-label

**TXT-0537** — «أعلى رغبة اليوم: ${n} من ٥»
  - `src/components/app/screens/PlanScreen.tsx:405` — Q1 radio aria-label

**TXT-0538** — «بالكاد وجدت»
  - `src/components/app/screens/PlanScreen.tsx:418` — Q1 low label

**TXT-0539** — «أقصى ما وصلت له»
  - `src/components/app/screens/PlanScreen.tsx:419` — Q1 high label

**TXT-0540** — «٢ · المحفز الرئيسي اليوم؟»
  - `src/components/app/screens/PlanScreen.tsx:423` — Check-in Q2

**TXT-0541** — «٣ · هل استخدمت تدخلًا؟»
  - `src/components/app/screens/PlanScreen.tsx:437` — Check-in Q3

**TXT-0542** — «لا، لم أحتج»
  - `src/components/app/screens/PlanScreen.tsx:439` — Q3 option

**TXT-0543** — «نعم — ونجح»
  - `src/components/app/screens/PlanScreen.tsx:439` — Q3 option

**TXT-0544** — «نعم — جزئيًا»
  - `src/components/app/screens/PlanScreen.tsx:439` — Q3 option

**TXT-0545** — «لم أفكر فيه»
  - `src/components/app/screens/PlanScreen.tsx:439` — Q3 option

**TXT-0546** — «٤ · درس واحد من اليوم؟»
  - `src/components/app/screens/PlanScreen.tsx:456` — Check-in Q4

**TXT-0547** — «٥ · تغيير واحد للغد؟»
  - `src/components/app/screens/PlanScreen.tsx:465` — Check-in Q5

**TXT-0548** — «مثال: الهاتف يبيت برا الغرفة…»
  - `src/components/app/screens/PlanScreen.tsx:469` — Q5 placeholder

**TXT-0549** — «ظروف الغد (لتوقّع الغد — مش تنبؤ، بل استعدادًا)»
  - `src/components/app/screens/PlanScreen.tsx:479` — Check-in conditions title

**TXT-0550** — «إزاي كان نومك الليلة الماضية؟»
  - `src/components/app/screens/PlanScreen.tsx:481` — Condition scale label

**TXT-0551** — «سيئ جدًا»
  - `src/components/app/screens/PlanScreen.tsx:481` — Sleep low label

**TXT-0552** — «ممتاز»
  - `src/components/app/screens/PlanScreen.tsx:481` — Sleep high label

**TXT-0553** — «مستوى التوتر اليوم؟»
  - `src/components/app/screens/PlanScreen.tsx:482` — Condition scale label

**TXT-0554** — «هادئ»
  - `src/components/app/screens/PlanScreen.tsx:482` — Stress low label

**TXT-0555** — «مرتفع جدًا»
  - `src/components/app/screens/PlanScreen.tsx:482` — Stress high label

**TXT-0556** — «الوحدة اليوم؟»
  - `src/components/app/screens/PlanScreen.tsx:483` — Condition scale label

**TXT-0557** — «متصل بالناس»
  - `src/components/app/screens/PlanScreen.tsx:483` — Loneliness low label

**TXT-0558** — «منعزل»
  - `src/components/app/screens/PlanScreen.tsx:483` — Loneliness high label

**TXT-0559** — «كم الوقت الحر غير المنظم؟»
  - `src/components/app/screens/PlanScreen.tsx:484` — Condition scale label

**TXT-0560** — «مفيش»
  - `src/components/app/screens/PlanScreen.tsx:484` — Free time low label

**TXT-0561** — «كثير جدًا»
  - `src/components/app/screens/PlanScreen.tsx:484` — Free time high label

**TXT-0562** — «صراحتك هنا هي ما يجعل خريطتك وتوقعاتك دقيقة — البيانات تبقى على جهازك.»
  - `src/components/app/screens/PlanScreen.tsx:503` — Check-in privacy note

**TXT-0563** — «المحفز الرئيسي»
  - `src/components/app/screens/PlanScreen.tsx:520` — Read view label

**TXT-0564** — «التدخل»
  - `src/components/app/screens/PlanScreen.tsx:521` — Read view label

**TXT-0565** — «أعلى رغبة»
  - `src/components/app/screens/PlanScreen.tsx:523` — Read view label

**TXT-0566** — «${checkIn.highestUrge} من ٥»
  - `src/components/app/screens/PlanScreen.tsx:524` — Read view value

**TXT-0567** — «درس اليوم»
  - `src/components/app/screens/PlanScreen.tsx:526` — Read view label

**TXT-0568** — «تغيير الغد»
  - `src/components/app/screens/PlanScreen.tsx:528` — Read view label

**TXT-0569** — «إخفاء مراجعة الليلة»
  - `src/components/app/screens/PlanScreen.tsx:539` — Read view toggle (open)

**TXT-0570** — «عرض ما كتبته الليلة»
  - `src/components/app/screens/PlanScreen.tsx:539` — Read view toggle (closed)

**TXT-0571** — «ظروف الغد المسجلة: نوم ${checkIn.sleepQuality}/٥ · توتر ${checkIn.stress}/٥ · وح…»
  - `src/components/app/screens/PlanScreen.tsx:550` — Read view conditions line

**TXT-0572** — «اليوم قد محتاج إلى استعداد إضافي — نمت قليلًا أو ضغط أعلى من معتادك. فعّل قواعدك…»
  - `src/lib/app/progress.ts:254` — Forecast message (elevated)

**TXT-0573** — «اليوم متوسط الحمل — التزم بالحد الأدنى من خطتك وحافظ على روتين الليل.»
  - `src/lib/app/progress.ts:259` — Forecast message (moderate)

**TXT-0574** — «ظروفك اليوم مريحة نسبيًا — فرصة جيدة لإنجاز جلسة تركيز واحدة إضافية.»
  - `src/lib/app/progress.ts:263` — Forecast message (low)

**TXT-0575** — «مؤشرات متعددة صادقة — لا نسبة تعافٍ زائفة، ولا يوم يعود إلى الصفر.»
  - `src/components/app/screens/ProgressScreen.tsx:26` — Screen subtitle

**TXT-0576** — «رحلة اليوم»
  - `src/components/app/screens/ProgressScreen.tsx:35` — Journey card label

**TXT-0577** — «اليوم ${m.daysSinceStart}»
  - `src/components/app/screens/ProgressScreen.tsx:37` — Day counter

**TXT-0578** — «المرحلة»
  - `src/components/app/screens/ProgressScreen.tsx:41` — Stage label

**TXT-0579** — «تثبيت»
  - `src/components/app/screens/ProgressScreen.tsx:59` — Stepper start label

**TXT-0580** — «المدى الطويل»
  - `src/components/app/screens/ProgressScreen.tsx:60` — Stepper end label

**TXT-0581** — «أيام منذ آخر زَلّة»
  - `src/components/app/screens/ProgressScreen.tsx:71` — Stat tile label

**TXT-0582** — «مؤشر واحد من ضمن المؤشرات»
  - `src/components/app/screens/ProgressScreen.tsx:73` — Stat tile hint

**TXT-0583** — «مراجعات متتالية»
  - `src/components/app/screens/ProgressScreen.tsx:76` — Stat tile label

**TXT-0584** — «${m.checkInStreak} يوم»
  - `src/components/app/screens/ProgressScreen.tsx:77` — Stat tile value

**TXT-0585** — «مراجعات مسائية متتابعة»
  - `src/components/app/screens/ProgressScreen.tsx:78` — Stat tile hint

**TXT-0586** — «مؤشرات المهارات»
  - `src/components/app/screens/ProgressScreen.tsx:88` — Card title

**TXT-0587** — «${m.urgesHandled7d} خلال آخر ٧ أيام»
  - `src/components/app/screens/ProgressScreen.tsx:94` — Stat tile hint

**TXT-0588** — «عند درجة ٣ أو أقل — خلال ٣٠ يومًا»
  - `src/components/app/screens/ProgressScreen.tsx:100` — Stat tile hint

**TXT-0589** — «جلسات وقّفتها مبكرًا»
  - `src/components/app/screens/ProgressScreen.tsx:104` — Stat tile label

**TXT-0590** — «توقفت خلال دقائق من السلوك»
  - `src/components/app/screens/ProgressScreen.tsx:106` — Stat tile hint

**TXT-0591** — «سجلات لم تتحول لجلسة ممتدة»
  - `src/components/app/screens/ProgressScreen.tsx:112` — Stat tile hint

**TXT-0592** — «مؤشرات الاستجابة والاستقرار»
  - `src/components/app/screens/ProgressScreen.tsx:123` — Card title

**TXT-0593** — «فوري»
  - `src/components/app/screens/ProgressScreen.tsx:131` — Stop speed value

**TXT-0594** — «~${m.avgStopMinutes} د»
  - `src/components/app/screens/ProgressScreen.tsx:132` — Stop speed value

**TXT-0595** — «أسرع من الشهر اللي فات ✓»
  - `src/components/app/screens/ProgressScreen.tsx:137` — Stop trend hint (better)

**TXT-0596** — «أبطأ قليلًا — راجع نقاط القطع»
  - `src/components/app/screens/ProgressScreen.tsx:139` — Stop trend hint (worse)

**TXT-0597** — «متوسط زمن التوقف بعد السلوك»
  - `src/components/app/screens/ProgressScreen.tsx:140` — Stop trend hint (neutral)

**TXT-0598** — «تكرار السلوك»
  - `src/components/app/screens/ProgressScreen.tsx:145` — Stat tile label

**TXT-0599** — «${m.relapsePerWeek}/أسبوع»
  - `src/components/app/screens/ProgressScreen.tsx:146` — Frequency value

**TXT-0600** — «منخفض عن اللي فات ✓»
  - `src/components/app/screens/ProgressScreen.tsx:148` — Frequency trend hint (better)

**TXT-0601** — «مرتفع — راجع حماية أوقات الخطر»
  - `src/components/app/screens/ProgressScreen.tsx:150` — Frequency trend hint (worse)

**TXT-0602** — «آخر ٤ أسابيع»
  - `src/components/app/screens/ProgressScreen.tsx:151` — Frequency trend hint (neutral)

**TXT-0603** — «محفزات مختلفة رصدتها خلال ٣٠ يومًا»
  - `src/components/app/screens/ProgressScreen.tsx:159` — Stat tile hint

**TXT-0604** — «الاستقرار اليومي»
  - `src/components/app/screens/ProgressScreen.tsx:163` — Stat tile label

**TXT-0605** — «${m.dailyStability}%»
  - `src/components/app/screens/ProgressScreen.tsx:164` — Stability value

**TXT-0606** — «إنجاز المراجعة المسائية خلال ١٤ يومًا»
  - `src/components/app/screens/ProgressScreen.tsx:165` — Stat tile hint

**TXT-0607** — «قراءات من سجلك»
  - `src/components/app/screens/ProgressScreen.tsx:177` — Insights card title

**TXT-0608** — «أكثر محفز متكرر»
  - `src/components/app/screens/ProgressScreen.tsx:182` — Insight label

**TXT-0609** — «${insights.topTrigger.label} (${insights.topTrigger.count}×)»
  - `src/components/app/screens/ProgressScreen.tsx:183` — Insight value

**TXT-0610** — «أحسن تدخل عندك»
  - `src/components/app/screens/ProgressScreen.tsx:189` — Insight label

**TXT-0611** — «${insights.bestIntervention.name} — نجح ${insights.bestIntervention.wins} مرة»
  - `src/components/app/screens/ProgressScreen.tsx:190` — Insight value

**TXT-0612** — «متوسط بدء تدخلك»
  - `src/components/app/screens/ProgressScreen.tsx:196` — Insight label

**TXT-0613** — «عند درجة ${insights.avgRiskAtIntervention} من ٥ — كلما انخفضت، كنت أسرع استجابة»
  - `src/components/app/screens/ProgressScreen.tsx:197` — Insight value

**TXT-0614** — «أكثر وقت محتاج حماية»
  - `src/components/app/screens/ProgressScreen.tsx:203` — Insight label

**TXT-0615** — «نمط السياق الأخطر»
  - `src/components/app/screens/ProgressScreen.tsx:210` — Insight label

**TXT-0616** — «سجّل كام فحص رغبة وتدخل، وهتظهر هنا قراءاتك: أحسن تدخل، أخطر وقت، وسرعة استجابتك…»
  - `src/components/app/screens/ProgressScreen.tsx:216` — Insights empty state

**TXT-0617** — «كل مؤشر هنا بيعكس حاجة حقيقية في سلوكك، وتقدر تحسّنه بخطوة صغيرة — رغبة ترصدها، …»
  - `src/components/app/screens/ProgressScreen.tsx:223` — Footer note

**TXT-0618** — «بطاقات قصيرة عملية مبنية على فهم السلوك — بلا مبالغة ولا مصطلحات معقدة.»
  - `src/components/app/screens/KnowledgeScreen.tsx:66` — Screen subtitle

**TXT-0619** — «للقراءة في الهدوء — وقت الشدة له أداة أسرع: «تدخّل دلوقتي» في الرئيسية.»
  - `src/components/app/screens/KnowledgeScreen.tsx:72` — When-to-read note

**TXT-0620** — «ابحث في المعرفة…»
  - `src/components/app/screens/KnowledgeScreen.tsx:80` — Search placeholder

**TXT-0621** — «الكل (${items.length})»
  - `src/components/app/screens/KnowledgeScreen.tsx:86` — All-categories chip

**TXT-0622** — «${c.label} (${counts.get(c.id) ?? 0})»
  - `src/components/app/screens/KnowledgeScreen.tsx:98` — Category chip

**TXT-0623** — «لا نتائج»
  - `src/components/app/screens/KnowledgeScreen.tsx:108` — Search empty state title

**TXT-0624** — «جرّب كلمة أبسط أو غيّر التصنيف.»
  - `src/components/app/screens/KnowledgeScreen.tsx:109` — Search empty state body

**TXT-0625** — «روحي»
  - `src/components/app/screens/KnowledgeScreen.tsx:124` — Spiritual badge

**TXT-0626** — «افتح البطاقة»
  - `src/components/app/screens/KnowledgeScreen.tsx:133` — Card open link

**TXT-0627** — «قراءة أعمق»
  - `src/components/app/screens/KnowledgeScreen.tsx:159` — Card dialog deep title

**TXT-0628** — «سببك إنت — بيظهرلك في اللحظات الصعبة. المحتوى الروحي اختياري بالكامل.»
  - `src/components/app/screens/ValuesScreen.tsx:48` — Screen subtitle

**TXT-0629** — «كلماتك أنت:»
  - `src/components/app/screens/ValuesScreen.tsx:75` — Why card label

**TXT-0630** — «لسه ما كتبتش سببك — اكتبه تحت؛ وهتلاقيه هنا وفي لحظاتك الصعبة.»
  - `src/components/app/screens/ValuesScreen.tsx:77` — Why empty fallback

**TXT-0631** — «ليه عايز التغيير؟ بكلماتي وبصياغتي…»
  - `src/components/app/screens/ValuesScreen.tsx:90` — Why textarea placeholder

**TXT-0632** — «حفظ سببي»
  - `src/components/app/screens/ValuesScreen.tsx:97` — Save why button

**TXT-0633** — «حُفظ ✓»
  - `src/components/app/screens/ValuesScreen.tsx:99` — Saved indicator

**TXT-0634** — «فيه تغيير لسه ما حُفظش — لو سبت الشاشة دلوقتي هيرجع للنص المحفوظ.»
  - `src/components/app/screens/ValuesScreen.tsx:103` — Unsaved hint

**TXT-0635** — «قيمي في جُمل»
  - `src/components/app/screens/ValuesScreen.tsx:112` — Values draft card title

**TXT-0636** — «اكتب جملة قصيرة لكل قيمة تهمّك — القيمة غير المكتوبة إحساس عابر، والمكتوبة معيار …»
  - `src/components/app/screens/ValuesScreen.tsx:114` — Values draft card body

**TXT-0637** — «المحتوى الروحي»
  - `src/components/app/screens/ValuesScreen.tsx:127` — Spiritual card title

**TXT-0638** — «تفعيل المحتوى الروحي»
  - `src/components/app/screens/ValuesScreen.tsx:132` — Spiritual switch aria-label

**TXT-0639** — «صلاة، ذكر، قراءة قرآن، تأمل، توبة وعودة — بتظهر بس لمن يفعّلها، وتُفصل خالص عن…»
  - `src/components/app/screens/ValuesScreen.tsx:136` — Spiritual card body

**TXT-0640** — «قيمة ${i + 1}»
  - `src/components/app/screens/ValuesScreen.tsx:224` — Value name placeholder

**TXT-0641** — «جملتها — مثال: أحترم وقتي فلا أبيعه رخيصًا»
  - `src/components/app/screens/ValuesScreen.tsx:232` — Value sentence placeholder

**TXT-0642** — «+ قيمة أخرى»
  - `src/components/app/screens/ValuesScreen.tsx:242` — Add value button

**TXT-0643** — «تُحفظ دي المسودة على جهازك تلقائيًا — تبقى هنا مهما تنقّلت أو أعدت فتح التطبيق،…»
  - `src/components/app/screens/ValuesScreen.tsx:245` — Draft persistence note

**TXT-0644** — «خصوصيتك أولًا — كل حاجة يعمل محليًا على جهازك.»
  - `src/components/app/screens/SettingsScreen.tsx:106` — Screen subtitle

**TXT-0645** — «خصوصيتك»
  - `src/components/app/screens/SettingsScreen.tsx:115` — Privacy card title

**TXT-0646** — «• كل بياناتك (سجلات، مراجعات، خطة) محفوظة في متصفحك بس — لا تغادر جهازك خالص.»
  - `src/components/app/screens/SettingsScreen.tsx:118` — Privacy bullet 1

**TXT-0647** — «• مفيش حساب، لا تسجيل دخول، ولا خادم يستقبل أي حاجة.»
  - `src/components/app/screens/SettingsScreen.tsx:119` — Privacy bullet 2

**TXT-0648** — «• لا نطلب اسمك الحقيقي ولا أي تفاصيل صريحة.»
  - `src/components/app/screens/SettingsScreen.tsx:120` — Privacy bullet 3

**TXT-0649** — «• امسح بياناتك إمتى شئت من دي الشاشة — والمحو نهائي.»
  - `src/components/app/screens/SettingsScreen.tsx:121` — Privacy bullet 4

**TXT-0650** — «الرحلة»
  - `src/components/app/screens/SettingsScreen.tsx:129` — Journey card title

**TXT-0651** — «تعديل التاريخ لا يمس أي سجل آخر — يغيّر عدّاد الرحلة ومرحلة المحتوى بس.»
  - `src/components/app/screens/SettingsScreen.tsx:143` — Date edit note

**TXT-0652** — «المحتوى والدعم»
  - `src/components/app/screens/SettingsScreen.tsx:151` — Content prefs card title

**TXT-0653** — «جرعة تعلم يومية مخصصة على الرئيسية»
  - `src/components/app/screens/SettingsScreen.tsx:154` — Daily dose toggle desc

**TXT-0654** — «المحتوى الروحي/القيمي»
  - `src/components/app/screens/SettingsScreen.tsx:159` — Spiritual toggle title

**TXT-0655** — «صلاة، ذكر، توبة — بيظهر بس عند تفعيله»
  - `src/components/app/screens/SettingsScreen.tsx:160` — Spiritual toggle desc

**TXT-0656** — «تفضيلات التهيئة»
  - `src/components/app/screens/SettingsScreen.tsx:178` — Onboarding prefs card title
  - `src/components/app/screens/SettingsScreen.tsx:514` — Prefs dialog title

**TXT-0657** — «اختياراتك الأولى (الأهداف، الأوقات الصعبة، الجهاز، نوع الدعم) — تؤثر على التدخلا…»
  - `src/components/app/screens/SettingsScreen.tsx:181` — Onboarding prefs card body

**TXT-0658** — «شخص الدعم»
  - `src/components/app/screens/SettingsScreen.tsx:197` — Support person card title

**TXT-0659** — ««${data.supportPerson.label}» — زر اتصاله بيظهر في وضع الطوارئ.»
  - `src/components/app/screens/SettingsScreen.tsx:201` — Support person summary (saved)

**TXT-0660** — «جهة اتصال اختيارية بتظهر في التصعيد — لم تُضف بعد.»
  - `src/components/app/screens/SettingsScreen.tsx:202` — Support person summary (none)

**TXT-0661** — «إدارته من خطة الوقاية»
  - `src/components/app/screens/SettingsScreen.tsx:211` — Manage support link

**TXT-0662** — «المظهر»
  - `src/components/app/screens/SettingsScreen.tsx:221` — Appearance card title

**TXT-0663** — «ليلي هادئ»
  - `src/components/app/screens/SettingsScreen.tsx:225` — Theme option

**TXT-0664** — «نهاري»
  - `src/components/app/screens/SettingsScreen.tsx:226` — Theme option

**TXT-0665** — «بياناتك ملكك»
  - `src/components/app/screens/SettingsScreen.tsx:254` — Data card title

**TXT-0666** — «صدّر نسخة احتياطية بصيغة JSON مقروءة، أو استورد نسختك اللي فاتة إلى أي جهاز.»
  - `src/components/app/screens/SettingsScreen.tsx:256` — Data card body

**TXT-0667** — «تصدير البيانات»
  - `src/components/app/screens/SettingsScreen.tsx:261` — Export button

**TXT-0668** — «نُسخ ✓»
  - `src/components/app/screens/SettingsScreen.tsx:265` — Copy button (copied)

**TXT-0669** — «نسخ إلى الحافظة»
  - `src/components/app/screens/SettingsScreen.tsx:265` — Copy button

**TXT-0670** — «استيراد / استعادة»
  - `src/components/app/screens/SettingsScreen.tsx:271` — Import button

**TXT-0671** — «استيراد نسخة احتياطية»
  - `src/components/app/screens/SettingsScreen.tsx:279` — Import dialog title

**TXT-0672** — «اختار ملف نسخة احتياطية سليم (.json). بنتأكد من سلامته قبل الاستبدال — ولو التحق…»
  - `src/components/app/screens/SettingsScreen.tsx:282` — Import dialog body

**TXT-0673** — «منطقة الحذر»
  - `src/components/app/screens/SettingsScreen.tsx:302` — Danger zone title

**TXT-0674** — «مسح كل البيانات المحلية»
  - `src/components/app/screens/SettingsScreen.tsx:307` — Wipe button

**TXT-0675** — «مسح كل حاجة نهائيًا؟»
  - `src/components/app/screens/SettingsScreen.tsx:312` — Wipe confirm title

**TXT-0676** — «سجلّك كله (الفحوصات، والمراجعات، والخطة، والقواعد) هيتمسح من الجهاز ده ومش هتقدر…»
  - `src/components/app/screens/SettingsScreen.tsx:314` — Wipe confirm body

**TXT-0677** — «نعم، امسح كل حاجة»
  - `src/components/app/screens/SettingsScreen.tsx:323` — Wipe action

**TXT-0678** — «إمتى تطلب دعمًا مهنيًا؟»
  - `src/components/app/screens/SettingsScreen.tsx:336` — Help card title

**TXT-0679** — «ده التطبيق أداة مساعدة ذاتية سلوكية — مش تشخيص طبي ولا علاجًا طبيًا ولا بديلًا ع…»
  - `src/components/app/screens/SettingsScreen.tsx:344` — Help card note

**TXT-0680** — «استعادة · نسخة ${APP_VERSION} · يعمل محليًا بالكامل»
  - `src/components/app/screens/SettingsScreen.tsx:348` — Version line

**TXT-0681** — «يناير»
  - `src/components/app/screens/SettingsScreen.tsx:365` — Month select option

**TXT-0682** — «فبراير»
  - `src/components/app/screens/SettingsScreen.tsx:366` — Month select option

**TXT-0683** — «مارس»
  - `src/components/app/screens/SettingsScreen.tsx:367` — Month select option

**TXT-0684** — «أبريل»
  - `src/components/app/screens/SettingsScreen.tsx:368` — Month select option

**TXT-0685** — «مايو»
  - `src/components/app/screens/SettingsScreen.tsx:369` — Month select option

**TXT-0686** — «يونيو»
  - `src/components/app/screens/SettingsScreen.tsx:370` — Month select option

**TXT-0687** — «يوليو»
  - `src/components/app/screens/SettingsScreen.tsx:371` — Month select option

**TXT-0688** — «أغسطس»
  - `src/components/app/screens/SettingsScreen.tsx:372` — Month select option

**TXT-0689** — «سبتمبر»
  - `src/components/app/screens/SettingsScreen.tsx:373` — Month select option

**TXT-0690** — «أكتوبر»
  - `src/components/app/screens/SettingsScreen.tsx:374` — Month select option

**TXT-0691** — «نوفمبر»
  - `src/components/app/screens/SettingsScreen.tsx:375` — Month select option

**TXT-0692** — «ديسمبر»
  - `src/components/app/screens/SettingsScreen.tsx:376` — Month select option

**TXT-0693** — «اليوم»
  - `src/components/app/screens/SettingsScreen.tsx:409` — Day field label

**TXT-0694** — «يوم بداية الرحلة»
  - `src/components/app/screens/SettingsScreen.tsx:413` — Day select aria-label

**TXT-0695** — «الشهر»
  - `src/components/app/screens/SettingsScreen.tsx:427` — Month field label

**TXT-0696** — «شهر بداية الرحلة»
  - `src/components/app/screens/SettingsScreen.tsx:431` — Month select aria-label

**TXT-0697** — «السنة»
  - `src/components/app/screens/SettingsScreen.tsx:445` — Year field label

**TXT-0698** — «سنة بداية الرحلة»
  - `src/components/app/screens/SettingsScreen.tsx:449` — Year select aria-label

**TXT-0699** — «حفظ التفضيلات»
  - `src/components/app/screens/SettingsScreen.tsx:577` — Prefs save button

**TXT-0700** — «التغييرات تنعكس على التدخلات والجرعة المقترحة — ومن غير ما يمس أي سجل تاني.»
  - `src/components/app/screens/SettingsScreen.tsx:580` — Prefs dialog note

**TXT-0701** — «2.3.0»
  - `src/lib/app/backup.ts:27` — App version (APP_VERSION constant)

**TXT-0702** — «الملف كبير جدًا — ليس ملف نسخة احتياطية صالحًا.»
  - `src/components/app/RestoreBackup.tsx:69` — File too large error

**TXT-0703** — «تعذر قراءة الملف — حاول تاني.»
  - `src/components/app/RestoreBackup.tsx:76` — File read error

**TXT-0704** — «اختار ملف النسخة الاحتياطية (.json)»
  - `src/components/app/RestoreBackup.tsx:113` — File picker button

**TXT-0705** — «أو الصق محتوى النسخة يدويًا»
  - `src/components/app/RestoreBackup.tsx:124` — Paste toggle

**TXT-0706** — «ألصق محتوى ملف JSON هنا…»
  - `src/components/app/RestoreBackup.tsx:130` — Paste textarea placeholder

**TXT-0707** — «نسخة احتياطية صالحة»
  - `src/components/app/RestoreBackup.tsx:149` — Preview card title fallback

**TXT-0708** — «تاريخ التصدير: ${arabicDateTime(preview.summary.exportedAt)}»
  - `src/components/app/RestoreBackup.tsx:154` — Preview line

**TXT-0709** — «فحوصات الرغبة: ${preview.summary.urgeChecks}»
  - `src/components/app/RestoreBackup.tsx:157` — Preview line

**TXT-0710** — «زلات وانتكاسات مسجلة: ${preview.summary.relapses}»
  - `src/components/app/RestoreBackup.tsx:158` — Preview line

**TXT-0711** — «قواعد وقاية: ${preview.summary.rules}»
  - `src/components/app/RestoreBackup.tsx:159` — Preview line

**TXT-0712** — «تدخلات: ${preview.summary.interventions}»
  - `src/components/app/RestoreBackup.tsx:160` — Preview line

**TXT-0713** — «استرجاع النسخة الاحتياطية هيستبدل بياناتك الحالية — وهنطلب تأكيدك الأول.»
  - `src/components/app/RestoreBackup.tsx:166` — Preview warning

**TXT-0714** — «الملف غير صالح.»
  - `src/components/app/RestoreBackup.tsx:174` — Invalid fallback

**TXT-0715** — «تمت الاستعادة بنجاح»
  - `src/components/app/RestoreBackup.tsx:195` — Success banner title

**TXT-0716** — «بياناتك كما كانت يوم صدّرت النسخة. اقفل دي النافذة وستجد كل حاجة في مكانه — التط…»
  - `src/components/app/RestoreBackup.tsx:198` — Success banner body

**TXT-0717** — «استعادة النسخة الاحتياطية»
  - `src/components/app/RestoreBackup.tsx:220` — Primary restore button

**TXT-0718** — «استبدال بياناتك الحالية؟»
  - `src/components/app/RestoreBackup.tsx:230` — Confirm dialog title

**TXT-0719** — «استرجاع النسخة الاحتياطية هيستبدل بياناتك الحالية. تحب تكمل؟»
  - `src/components/app/RestoreBackup.tsx:232` — Confirm dialog body

**TXT-0720** — «نعم، استعِد النسخة»
  - `src/components/app/RestoreBackup.tsx:237` — Confirm dialog action

**TXT-0721** — «سجل فحص رغبة غير صالح»
  - `src/lib/app/backup.ts:104` — Backup validation error

**TXT-0722** — «تاريخ/معرّف غير صالح في فحوصات الرغبة»
  - `src/lib/app/backup.ts:105` — Backup validation error

**TXT-0723** — «قيم أبعاد غير صالحة في فحوصات الرغبة»
  - `src/lib/app/backup.ts:107` — Backup validation error

**TXT-0724** — «درجة حالة غير صالحة في فحوصات الرغبة»
  - `src/lib/app/backup.ts:108` — Backup validation error

**TXT-0725** — «سياق غير صالح في فحوصات الرغبة»
  - `src/lib/app/backup.ts:118` — Backup validation error

**TXT-0726** — «محفزات غير صالحة في فحوصات الرغبة»
  - `src/lib/app/backup.ts:119` — Backup validation error

**TXT-0727** — «نتيجة غير صالحة في فحوصات الرغبة»
  - `src/lib/app/backup.ts:121` — Backup validation error

**TXT-0728** — «سجل تدخل غير صالح»
  - `src/lib/app/backup.ts:126` — Backup validation error

**TXT-0729** — «بيانات ناقصة في سجل التدخلات»
  - `src/lib/app/backup.ts:128` — Backup validation error

**TXT-0730** — «درجة حالة غير صالحة في سجل التدخلات»
  - `src/lib/app/backup.ts:129` — Backup validation error

**TXT-0731** — «مصدر غير صالح في سجل التدخلات»
  - `src/lib/app/backup.ts:130` — Backup validation error

**TXT-0732** — «سجل زلّة أو انتكاسة غير صالح»
  - `src/lib/app/backup.ts:135` — Backup validation error

**TXT-0733** — «تاريخ/معرّف غير صالح في سجل الزلات والانتكاسات»
  - `src/lib/app/backup.ts:137` — Backup validation error

**TXT-0734** — «مدة توقف غير صالحة في سجل الزلات والانتكاسات»
  - `src/lib/app/backup.ts:139` — Backup validation error

**TXT-0735** — «قيم غير صالحة في سجل الزلات والانتكاسات»
  - `src/lib/app/backup.ts:141` — Backup validation error

**TXT-0736** — «محفزات غير صالحة في سجل الزلات والانتكاسات»
  - `src/lib/app/backup.ts:143` — Backup validation error

**TXT-0737** — «تصنيف غير صالح في سجل الزلات والانتكاسات»
  - `src/lib/app/backup.ts:146` — Backup validation error

**TXT-0738** — «أنواع سلوك غير صالحة في سجل الزلات والانتكاسات»
  - `src/lib/app/backup.ts:154` — Backup validation error

**TXT-0739** — «قاعدة وقاية غير صالحة»
  - `src/lib/app/backup.ts:160` — Backup validation error

**TXT-0740** — «نص قاعدة وقاية غير صالح»
  - `src/lib/app/backup.ts:162` — Backup validation error

**TXT-0741** — «حالة تفعيل غير صالحة في قواعد الوقاية»
  - `src/lib/app/backup.ts:163` — Backup validation error

**TXT-0742** — «مصدر غير صالح في قواعد الوقاية»
  - `src/lib/app/backup.ts:164` — Backup validation error

**TXT-0743** — «تاريخ غير صالح في قواعد الوقاية»
  - `src/lib/app/backup.ts:165` — Backup validation error

**TXT-0744** — «سجل مراجعة مسائية غير صالح»
  - `src/lib/app/backup.ts:170` — Backup validation error

**TXT-0745** — «تاريخ غير صالح في المراجعات المسائية»
  - `src/lib/app/backup.ts:172` — Backup validation error

**TXT-0746** — «قيمة رغبة غير صالحة في المراجعات المسائية»
  - `src/lib/app/backup.ts:173` — Backup validation error

**TXT-0747** — «حقول نصية غير صالحة في المراجعات المسائية»
  - `src/lib/app/backup.ts:175` — Backup validation error

**TXT-0748** — «مقاييس غير صالحة في المراجعات المسائية»
  - `src/lib/app/backup.ts:182` — Backup validation error

**TXT-0749** — «خطة يومية غير صالحة»
  - `src/lib/app/backup.ts:187` — Backup validation error

**TXT-0750** — «تاريخ غير صالح في الخطط اليومية»
  - `src/lib/app/backup.ts:189` — Backup validation error

**TXT-0751** — «نمط خطة غير صالح»
  - `src/lib/app/backup.ts:190` — Backup validation error

**TXT-0752** — «حقول غير صالحة في الخطط اليومية»
  - `src/lib/app/backup.ts:191` — Backup validation error

**TXT-0753** — «أقسام مكتملة غير صالحة في الخطط اليومية»
  - `src/lib/app/backup.ts:192` — Backup validation error

**TXT-0754** — «سجل جرعة غير صالح»
  - `src/lib/app/backup.ts:197` — Backup validation error

**TXT-0755** — «تاريخ غير صالح في سجل الجرعات»
  - `src/lib/app/backup.ts:199` — Backup validation error

**TXT-0756** — «معرّف جرعة غير صالح»
  - `src/lib/app/backup.ts:200` — Backup validation error

**TXT-0757** — «حالة جرعة غير صالحة»
  - `src/lib/app/backup.ts:201` — Backup validation error

**TXT-0758** — «تعذر قراءة الملف — تأكد أنه ملف JSON سليم غير تالف.»
  - `src/lib/app/backup.ts:240` — Backup validation error

**TXT-0759** — «بنية الملف غير صالحة — الملف ليس نسخة احتياطية صحيحة.»
  - `src/lib/app/backup.ts:244` — Backup validation error

**TXT-0760** — «الملف ليس نسخة احتياطية من ده التطبيق.»
  - `src/lib/app/backup.ts:249` — Backup validation error

**TXT-0761** — «رقم إصدار النسخة الاحتياطية غير صالح.»
  - `src/lib/app/backup.ts:256` — Backup validation error

**TXT-0762** — «بنية الملف غير صالحة — مفيش بيانات جوا النسخة.»
  - `src/lib/app/backup.ts:259` — Backup validation error

**TXT-0763** — «نسخة النسخة الاحتياطية (إصدار ${schemaVersion}) غير مدعومة — ده التطبيق يدعم ال…»
  - `src/lib/app/backup.ts:265` — Backup validation error (dynamic)

**TXT-0764** — «بيانات الملف الشخصي ناقصة أو تالفة.»
  - `src/lib/app/backup.ts:270` — Backup validation error

**TXT-0765** — «حالة إكمال التهيئة غير صالحة في النسخة.»
  - `src/lib/app/backup.ts:273` — Backup validation error

**TXT-0766** — «تاريخ بداية الرحلة غير صالح في النسخة.»
  - `src/lib/app/backup.ts:276` — Backup validation error

**TXT-0767** — «قوائم التهيئة غير صالحة في النسخة.»
  - `src/lib/app/backup.ts:287` — Backup validation error

**TXT-0768** — «إعداد الجهاز غير صالح في النسخة.»
  - `src/lib/app/backup.ts:290` — Backup validation error

**TXT-0769** — «تفضيلات الدعم غير صالحة في النسخة.»
  - `src/lib/app/backup.ts:297` — Backup validation error

**TXT-0770** — «السجلات اليومية غير صالحة في النسخة.»
  - `src/lib/app/backup.ts:302` — Backup validation error
  - `src/lib/app/backup.ts:305` — Backup validation error

**TXT-0771** — «سجلات الفحص والتدخل غير صالحة في النسخة.»
  - `src/lib/app/backup.ts:309` — Backup validation error

**TXT-0772** — «سجلات الزلّة والوقاية غير صالحة في النسخة.»
  - `src/lib/app/backup.ts:312` — Backup validation error

**TXT-0773** — «النسخة الاحتياطية تالفة: ${err}.»
  - `src/lib/app/backup.ts:323` — Backup validation error (dynamic wrapper)

**TXT-0774** — «بيانات شخص الدعم غير صالحة في النسخة.»
  - `src/lib/app/backup.ts:327` — Backup validation error

**TXT-0775** — «الإعدادات غير صالحة في النسخة.»
  - `src/lib/app/backup.ts:340` — Backup validation error

**مواضع عرض المحتوى الثابت:** مثبتة في عمود «أماكن العرض» بجداول القسم 24، وداخل كتل التدخلات/المعرفة في القسمين 25–26.

## 28. غير الظاهر دلوقتي / محتاج تحققًا بشريًا (Unclear / Needs Human Verification)

### أ. نصوص موجودة في ملفات البيانات بس لا تعرضها أي شاشة في النسخة الحالية

نقلت كاملة هنا حتى لا يضيع أي نص من المراجعة، مع وسم صريح. قرار التراجعة اللغوية (أو حذفها من الكود بعد كده) متروك للمراحل التالية:

| ID | النص | النوع | الملاحظة |
|---|---|---|---|
| BOREDOM-5-L | ٥ دقائق | تسمية قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-5-O1 | ترتيب المكتب | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-5-O2 | غسل الأطباق | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-5-O3 | تجهيز مهمة الغد | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-15-L | ١٥ دقيقة | تسمية قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-15-O1 | مشي | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-15-O2 | قراءة | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-15-O3 | دراسة موضوع صغير | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-15-O4 | تمرين خفيف | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-30-L | ٣٠ دقيقة | تسمية قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-30-O1 | تمرين رياضي | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-30-O2 | جلسة دراسة مركزة | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-30-O3 | العمل على مشروع | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-30-O4 | خروج قصير | خيار قائمة الملل | غير مستورد في أي مكوّن |
| BOREDOM-30-O5 | نشاط اجتماعي | خيار قائمة الملل | غير مستورد في أي مكوّن |
| WSPRINCIPLE | لا تحارب التقنية. هندِس السياق المحيط بها. | مبدأ وضع العمل الآمن | غير مستورد في أي مكوّن |
| TCAT-HINT-internal | ما ينبع من الداخل: ذكرى، فكرة، خيال، فضول. | تلميح فئة محفزات | غير مستورد في أي مكوّن |
| TCAT-HINT-emotional | ملل، وحدة، توتر، قلق، حزن، غضب، إحباط. | تلميح فئة محفزات | غير مستورد في أي مكوّن |
| TCAT-HINT-digital | صور، منصات، مواقع، بحث، تصفح بلا هدف. | تلميح فئة محفزات | غير مستورد في أي مكوّن |
| TCAT-HINT-situational | وقت متأخر، السرير، العزلة، مكان معين. | تلميح فئة محفزات | غير مستورد في أي مكوّن |
| TCAT-HINT-habitual | عادة التقاط الهاتف بلا هدف أو «اختبار النفس». | تلميح فئة محفزات | غير مستورد في أي مكوّن |

### ب. عناصر محتاج تحققًا بشريًا

1. **خطوات وضع العمل الآمن ٦–٨** (`WS-06`…`WS-08` أعلاه في القسم 24): معرّفة ومستوردة في وضع الطوارئ بس الشاشة تعرض الشرائح `[1.4]` بس — الخطوات ٦–٨ غير ظاهرة.
2. **وسم الوصول الإنجليزي من Radix:** «Notifications (F8)» (رصد تشغيلي — القسم 3): القيمة الافتراضية لمكوّن ToastProvider من مكتبة Radix، موجودة في DOM الحي وتصل لقارئات الشاشة، ومفيش ما يقابلها في نصوص التطبيق. الترجمة/التعريب أو إزالة المكوّن غير المستخدم قرار تطويري برا ده الجرد.
3. **خطوة وضع العمل الآمن ١** (`WS-01`): نصها مكرر حرفيًا تقريبًا جوا تعليمة الشاشة (TXT في القسم 10) — إن نُقّحت إحداهما يجب مراجعة الأخرى.
4. **تلميحات فئات المحفزات** (`TCAT-HINT-*`): خريطة المحفزات تعرض تسميات الفئات بس دون تلميحاتها.
5. **مسار `/api` تجريبي:** يوجد ملف `src/app/api/route.ts` يرجع نصًا إنجليزيًا (`Hello, world!`) — غير مستخدم في أي واجهة ولا بيظهر للمستخدم (طريق API مهجور).
6. **التواريخ العربية المولّدة:** صيغ `Intl.DateTimeFormat("ar")` تختلف تفاصيلها بين المتصفحات/الأنظمة (ترتيب، فواصل، استخدام الأرقام العربية الهندية ١٢٣ أم 123) — محتاج تحققًا على أجهزة مختلفة لو كانت دقة الصيغة مهمة.
7. **اسم ملف النسخة الاحتياطية المعروض:** في معاينة الاستعادة بيظهر اسم الملف كما اختاره المستخدم (نص تقني LTR من نظام الملفات) أو البديل «نسخة احتياطية صالحة».
8. **حالات مينفعش الوصول لها ساكنًا:** تم توثيق فروع الحالات الشرطية من الكود مباشرة (مثل فروع `stopTrend` الثلاثة، وفرعا `deviceNeeds` في ملخص التهيئة، وفرعا المدة الزمنية منذ الموجة) — ظهورها الفعلي محتاج بيانات بالحجم الكافي؛ تم التحقق التشغيلي من أهمها (القسم 3).

## 29. النصوص المشتركة بين الواجهة والبيانات (Shared / Reused)

نصوص فريدة ظهرت حرفيًا في أكثر من مصدر (واجهة + بيانات) — تُراجع مرة واحدة ويظهر أثر أي تعديل في مواضع متعددة:

| النص (كما في الواجهة) | مواضع الواجهة | مواضع البيانات |
|---|---|---|
| وضع الطوارئ | EmergencyMode.tsx:434 | MODE-emergency (تسمية الوضع المقترح) |
| تصفح بلا هدف | Onboarding.tsx:37 | TRG-aimless (تسمية محفز) |
| البقاء في السرير | Onboarding.tsx:43 | TRG-bed (تسمية محفز) |
| المدى الطويل | ProgressScreen.tsx:60 | STAGE-wisdom (تسمية مرحلة) |
| تمرين رياضي | PlanScreen.tsx:17 | BOREDOM-30-O1 (خيار قائمة الملل) |
| المحفزات | RelapseScreen.tsx:861 | KCAT-triggers (تسمية تصنيف معرفة) |
| الانضباط | Onboarding.tsx:51 | KCAT-discipline (تسمية تصنيف معرفة) |
| العلاقات | Onboarding.tsx:52 | KCAT-relationships (تسمية تصنيف معرفة) |
| الهدف | HomeScreen.tsx:198 | KCAT-purpose (تسمية تصنيف معرفة) |
| القيم | HomeScreen.tsx:200 | KCAT-values (تسمية تصنيف معرفة) |
| مشي ١٠ دقائق | PlanScreen.tsx:17 | INT-05-NAME (اسم تدخل) |

## 30. إحصائيات الاستخراج (Extraction Statistics)

- **Total unique user-facing strings:** 1,976
  - نصوص واجهة (TXT): 775
  - نصوص محتوى بيانات (تصنيف + تدخلات + معرفة): 1,201 (منها 21 غير معروضة دلوقتي — القسم 28)
- **Total usage locations:** 843 (مواضع نصوص الواجهة في الكود) + مواضع العرض المثبتة لكل عنصر بيانات
- **Static strings:** 1,823 تقريبًا (كل ما ليس ديناميكيًا ولا شرطيًا)
- **Dynamic strings:** 87
- **Conditional strings:** 66
- **Accessibility strings:** 24
- **English strings:** 0 — مفيش أي كلمة إنجليزية ظاهرة للمستخدم في الواجهة كلها. (للشفافية: 13 مدخلًا في الجرد تتضمن معرّفات كود لاتينية جوا قوالب `${…}` أو توثيق الدوال المولّدة للتواريخ — لا بتظهر كنص إنجليزي، والمقاس الرمزي البحت 3 قوالب رقمية/رمزية مثل `${value}/5` و`mm:ss`)، والنص الوحيد غير العربي المعروض فعليًا هو رقم الإصدار `2.3.0` جوا سطر عربي
- **Arabic strings:** 1,963
- **Empty states:** 9 · **Error messages:** 58 · **Success messages:** 8 · **Warning messages:** 7
- **Buttons/CTAs:** 74 · **Placeholders:** 18 · **Dialog strings:** 15
- **Screens scanned:** 19 شاشة/عرض رئيسيًا:
  - Onboarding (ترحيب + 8 خطوات)
  - Home
  - DoseScreen
  - UrgeScreen (4 مراحل)
  - EmergencyMode (5 خطوات/شاشات)
  - RelapseScreen (5 عروض)
  - PreventionScreen
  - TriggerMapScreen
  - PlanScreen (+ حوار المراجعة المسائية)
  - ProgressScreen
  - KnowledgeScreen (+ حوار البطاقة)
  - ValuesScreen
  - SettingsScreen (+ 3 حوارات)
  - RestoreBackup (مكوّن مشترك)
  - AppShell (تنقل + More Sheet)
  - AppRoot (شاشة البداية)
  - Timer
  - InterventionCard
  - shared.tsx (مكوّنات مشتركة)
- **Files scanned:** 98 ملفًا مصدريًا (كل `src/`) — منها 26 ملفًا يحوي نصوص واجهة + 7 ملفات بيانات محتوى
- **Knowledge cards:** 148 (منها 5 روحية، و1 بقراءة أعمق) · **Interventions:** 28 · **Triggers:** 24 · **Risk levels:** 5 · **Journey stages:** 7

**حدود الأرقام (شفافية):** «Static» تقريبي لأن بعض النصوص الساكنة تحمل شرط ظهور واحدًا (مثلاً بتظهر بس في وضع معين) وصُنفت شرطية عند وضوح الفرع؛ الأرقام الأخرى محسوبة آليًا من الاستخراج الفعلي أعلاه.

---

**تذكير ختامي:** ده الملف للاستخراج والتوثيق بس. أي ملاحظة لغوية تُدوَّن برا ده الملف في مرحلة المراجعة المنفصلة — النصوص هنا محفوظة بحرفيتها كإيه في الكود.
