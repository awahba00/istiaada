# PHASE 2B — ISTIAADA LANGUAGE & TERMINOLOGY MAP

**READ-ONLY ANALYSIS. NO CODE WAS MODIFIED. NO COPY WAS REWRITTEN. NO TERMINOLOGY WAS CHOSEN.**

- Built on the Phase 2A source of truth: `phase2a-copy-inventory.md` (661 entries, ~1,300 strings, 20 inconsistency groups, ~33 duplicate groups). All stable IDs (HOME-###, ONBOARDING-###, DOSE-###, PLAN-###, URGE-###, EMERGENCY-###, RELAPSE-###, PREVENT-###, TRIGGER-###, PROGRESS-###, VALUES-###, KNOWLEDGE-###, SETTINGS-###, SHARED-###, BACKUP-###, TAX-###, KB-###, IV-###, OTHER-###) are used unchanged.
- Where concept disambiguation required implementation context beyond the inventory (e.g. «حدوده:» label rendering, KB wording verification, work-safe plumbing), source files were re-checked **read-only** — no edits, no renames, no string changes.
- This report is the analytical bridge between Phase 2A (inventory) and Phase 2C (page-by-page Arabic copy review & implementation). It exposes the language system and the decisions needed. **The final Arabic choices are NOT made here.**

## How to read the relation codes

Per the Phase 2B brief, every concept entry classifies its current expressions as:

- **A — same concept, different wording** (true synonyms / register variants of one referent)
- **B — related but not identical concepts** (overlapping family, different facets)
- **C — genuinely different concepts** (must not be merged)
- **D — unclear from the current implementation** (the copy itself does not settle it)

---

# A. Terminology Map

### A-1. The target behavior (السلوك)

CONCEPT: The compulsive sexual behavior the whole app is built around — deliberately never named explicitly anywhere in the copy.

CURRENT EXPRESSIONS:
- «السلوك» — ONBOARDING-004 («توقف السلوك قبل ما يبدأ»), ONBOARDING-013 («أريد تغيير سلوك يؤثر على حياتي»), TRIGGER-002 («ما يحدث عادة قبل السلوك»), PROGRESS-024 («تكرار السلوك»), TAX-017 («السلوك يتصاعد» / «تلجأ للسلوك»), KB library passim
- «سلوك جنسي قهري» — ONBOARDING-013 (clinical self-description, one goal chip only)
- «استخدام الإباحية» — ONBOARDING-013 (one goal chip only)

WHERE USED: Onboarding goals, Trigger Map subtitle, Progress metrics, when-to-seek-help list, knowledge content.

CURRENT RELATION: **A** — one neutral referent («السلوك») used consistently; the two explicit/clinical variants appear only as opt-in onboarding goal chips.

PROBLEM: None at concept level. The never-naming-the-behavior system is coherent and privacy-preserving. The only question is register inside the onboarding chips (see K-17).

SEVERITY: Low.

DECISION NEEDED: Only whether the two clinical onboarding chips keep their precise clinical phrasing (useful for self-identification) or get simplified (K-17).

---

### A-2. Returning to the behavior (the relapse event)

CONCEPT: One instance where the behavior happened. The single most name-fragmented concept in the app.

CURRENT EXPRESSIONS:
- «رجعت للسلوك؟» (Egyptian question; the launcher phrase) — HOME-015, HOME-026, EMERGENCY-026, RELAPSE-002, RELAPSE-023, SHARED-001 («توقّف هنا» nav desc), URGE-042 context
- «رجعت للسلوك الآن» — RELAPSE-003
- «التعثر» / «تعثر» (the dominant neutral noun) — HOME-003, HOME-016, HOME-017, RELAPSE-004/005/006/011/012/021/037/039/041/042, DOSE-016, BACKUP-009, PROGRESS-007/020/033, TAX-007, KB titles («أهم سؤال بعد التعثر» KB-062, «تعثر اليوم بيانات خطة الغد» KB-064)
- «الحدث» / «الحادثة» / «الحدث ده» — RELAPSE-039 (×2), RELAPSE-049 («ما أول علامة ظهرت قبل الحدث؟»), RELAPSE-051 («ما أول فعل عملته في الحدث؟»), RELAPSE-053 («في أي لحظة كبر الأمر؟» context), KB-0653 («كل حادثة تحمل…»)
- «الزلة» — Knowledge library only: KB-061 («الفرق بين الزلة والانتكاس»), KB-005 («بعد أي زلة»), KB abstinence-violation card («زلة واحدة تتحول لجلسة كاملة»), KB minimum-day card («يحول زلة صغيرة إلى يوم منهار كله»)
- «الانتكاس» — KB-061 only, defined there as «عودة النمط القديم» (the pattern returning — deliberately distinct from the single زلة in that card)
- «السقوط الثاني» / «سقوط ثانٍ» — RELAPSE-010, PROGRESS-019, TAX-006, KB-063 (the *extension* of the event, not the event)

WHERE USED: Stop/Post-behavior screen family, Home state banners, dose selection logic, Progress metrics, knowledge library.

CURRENT RELATION: **A** between «التعثر» / «الحدث» / «الحادثة» (same referent, different surfaces/registers — the UI logs it as تعثر, the review wizard interrogates it as الحدث). **C** between «الزلة» and «الانتكاس» *inside KB-061*, which explicitly teaches them as different concepts (single event vs pattern return). **D** overall: the UI's canonical word («تعثر») is never reconciled with the library's pedagogical pair.

PROBLEM: The app's screens say «تعثر» everywhere, while its own educational card (KB-061) teaches a زلة/انتكاس distinction using two words no screen ever uses, and the calm-review wizard asks its questions about «الحدث». A user moving from the Stop screen to the Knowledge base must map three vocabularies for one experience unaided. The reframe message (RELAPSE-039) even says «الحدث ده مش بيحدد مستقبلك» — colloquial «الحدث ده» for what the log beneath it calls «تعثر».

SEVERITY: **High**.

DECISION NEEDED: Choose the canonical user-facing noun for the event; decide whether the KB زلة/انتكاس pedagogical distinction should surface in UI labels or stay content-level; decide whether the review wizard keeps «الحدث» (K-01).

---

### A-3. Session, continuation, extension

CONCEPT: The behavior episode extending beyond the first instance; the act of continuing.

CURRENT EXPRESSIONS:
- «الجلسة» / «جلسة ممتدة» / «استمرت الجلسة» — RELAPSE-016, RELAPSE-035, PROGRESS-020, RELAPSE-054 (««دقيقة واحدة» صارت جلسة»), KB abstinence-violation card («زلة واحدة تتحول لجلسة كاملة»)
- «هل كمّلت بعد أول مرة؟» — RELAPSE-033; «نعم، استمرت الجلسة» — RELAPSE-035; «لا — أوقفت عند أولها» — RELAPSE-034; «أوقف عند حدّه» — RELAPSE-017
- «التكملة» / «ما تكملش» / «ما تكمّلش» — HOME-015, HOME-016, EMERGENCY-026, URGE-043, RELAPSE-002, RELAPSE-024, KB-061 («والاستمرار قرار»)
- «السقوط الثاني» — RELAPSE-010, PROGRESS-019, TAX-006, KB-063
- «جلسة تركيز» / «جلسة عمل» / «جلسة دراسة» — PLAN-015, PLAN-019, KB-023, IV-012 (different concept, same word — see below)

WHERE USED: Quick log, log rows, Progress metrics, STOP flow, emergency copy.

CURRENT RELATION: **B** — «جلسة» (the extended episode), «تكملة» (the act of continuing), «السقوط الثاني» (the metric framing of preventing extension) are facets of one family. **C** — «جلسة تركيز/جلسة عمل» are constructive sessions sharing the word «جلسة» with the behavior episode.

PROBLEM: «جلسة» is polysemous across a negative and a positive sense. KB-023's title «جلسة واحدة تغيّر إيقاع يومك» does not say which kind of جلسة it means until the body is read; RELAPSE-054's «صارت جلسة» and PLAN-015's «جلسة تركيز» sit one screen apart in the same user journey.

SEVERITY: Medium.

DECISION NEEDED: Whether the behavior-session sense and the focus-session sense should be verbally differentiated, or context is accepted as sufficient disambiguator.

---

### A-4. Urge

CONCEPT: The felt desire/craving toward the behavior.

CURRENT EXPRESSIONS:
- «الرغبة» / «رغبة» — URGE-002/003, HOME-009, PLAN-028 («أعلى رغبة اليوم؟»), TAX-001 levels, PREVENT-032 («درجة الرغبة»), BACKUP-030 («قيمة رغبة»), KB library passim
- «موجة» (wave metaphor) — HOME-004 («تعاملت مع موجة»), EMERGENCY-023 («تعاملت مع الموجة»), URGE-039 («الموجة دي مسجّلة وبتتحسب ليك»), TRIGGER-002 («ما بدأ الموجة عادةً»), KB-007 «الرغبة موجة، لا جدار», KB-010 «ركوب الموجة: مهارة تُتقن بالتكرار», IV-009 «ركوب موجة الرغبة» + «هل خفت الموجة؟»
- «الدافع» — Knowledge library only: KB-001 («الدوبامين: إشارة دافع، لا «مادة متعة»», remember line «الدافع ليس أمرًا»), KB-002 («لماذا يشتد الدافع مع التكرار؟»), KB-005 («قد يبقى الدافع بعد ذهاب المتعة»)
- «رغبات» (plural, metric) — HOME-041, PROGRESS-013 («رغبات تعاملت معها»)

WHERE USED: Urge Check (title, scales, verdicts), Home banners, Evening check-in Q1, seeded rules, Progress metrics, knowledge content, interventions.

CURRENT RELATION: **A** — «رغبة» and «موجة» are the same experience in two framings (literal vs the deliberate "it passes" pedagogy; KB-007 explicitly equates them). **B/C** — «الدافع» is the motivational-systems concept (wanting vs liking) used by the educational content; deliberately a different word inside KB-001's science framing.

PROBLEM: The same core teaching is expressed twice with different subjects: the UI says «الرغبة إحساس، مش أمر» (URGE-002) and «إحساس، مش أمر» (URGE-020, TAX-001 L2), while KB-001's remember line says «الدافع ليس أمرًا». Not harmful in isolation, but the educational layer and the UI layer teach one lesson with two head-words.

SEVERITY: Medium.

DECISION NEEDED: Confirm «الرغبة» as the canonical UI word; decide whether KB content should anchor its "it is not a command" teaching on «الرغبة» (keeping «الدافع» strictly for the wanting/liking neuroscience) or the current split is intended (K-04 sub-item; see K-01…K-26 index).

---

### A-5. Urge intensity vs state degree vs danger (the measurement family)

CONCEPT: Three measurement concepts that currently share the word «درجة» and drift between each other.

CURRENT EXPRESSIONS:
- «شدة الرغبة» — URGE-003 (input dimension 1; anchors «هادئة تقريبًا · أقصى ما أعرفه»), IV-008 next action («أعد تقييم شدة الرغبة»)
- «مدى قربك من التنفيذ» — URGE-004 (dimension 2); «فقدان السيطرة» — URGE-005 (dimension 3)
- «درجة الحالة» — EMERGENCY-006 («درجة الحالة: {n} من ٥»), PREVENT-014 («أثناء أزمة (درجة الحالة ٥)»), BACKUP-030 («درجة حالة غير صالحة…»)
- «درجة حالتك الآن» — URGE-015; «درجة حالتك مرتفعة في آخر فحص» — HOME-011; «الدرجة دي» — URGE-018; «عند درجة {n} من ٥» — PROGRESS-030; «عند درجة ٣ أو أقل» — PROGRESS-016
- «درجة الرغبة» — PREVENT-032 seeded rule ONLY («إذا: وصلت درجة الرغبة ٣ من ٥ → إذن: أبدأ خطوة قطع فورًا»)
- «الخطر» — EMERGENCY-019 («هبط الخطر؟»), URGE-037 («الخطر هبط ولا لسه؟»), TAX-001 L4 label «خطر مرتفع», SHARED-012 («لحظة خطر؟»), IV-027 («حتى هبوط الخطر»), PLAN-004 context, TRIGGER-011 («أوقات الخطر»)
- «سلم من ١ لـ ٥» — URGE-013/018 (the scale itself)

WHERE USED: Urge Check (inputs + result), Emergency header badge, Home high banner, Prevention timing note, seeded rules, Progress insights, backup validators.

CURRENT RELATION: **C** — «شدة الرغبة» (an input dimension) and «درجة الحالة» (the composite output) are genuinely different concepts with dangerously near-neighbor names. **D** — «درجة الرغبة» in the seeded rule is not settleable from the copy: it can be read as the intensity answer or as the composite number the screens display. **B** — «الخطر» is what the degree indexes (the danger), used interchangeably with it in reassessment questions.

PROBLEM: (1) The seeded rule tells the user to act at «درجة الرغبة ٣ من ٥», but every surface that actually shows a number labels it «درجة الحالة» — a user trying to follow their own rule cannot be certain which number to watch. (2) The composite degree renders in three shapes (badge «درجة الحالة: {n} من ٥», caption «درجة حالتك الآن» + «من ٥», banner «درجة حالتك مرتفعة»). (3) The reassessment question alternates referent — «الخطر هبط ولا لسه؟» (URGE-037) vs «هبط الخطر؟» (EMERGENCY-019) vs the outcome pair «نعم، هبطت / لا، لسه مرتفعة» (URGE-038/040, agreeing with الدرجة/الرغبة) vs «نعم — هبط / لا — لسه مرتفع» (EMERGENCY-020/021, agreeing with الخطر) — producing the gender-agreement drift already flagged as Phase 2A D10.

SEVERITY: **High** (the seed-rule/display mismatch), Medium (renderings and referent drift).

DECISION NEEDED: Fix the canonical term for the composite number; decide the fate of «درجة الرغبة» in PREVENT-032; decide whether reassessment questions standardize on one referent (الخطر or الدرجة) with one agreement pattern (K-02).

---

### A-6. Intervention (the action family)

CONCEPT: Any concrete counter-action the app offers or the user takes.

CURRENT EXPRESSIONS:
- «تدخل» / «التدخل» / «تدخلات» (generic noun, no shadda) — PLAN-032 («هل استخدمت تدخلًا؟»), URGE-028/033/034/035, TRIGGER-009/015/016, BACKUP-011/030, ONBOARDING-023/025/039, HOME-006 («مش محتاج أي تدخل»), SHARED-001 desc, TAX-001 L3 («خطوة تدخل مبكر»)
- «تدخّل الآن» (with shadda — the branded SOS phrase) — SHARED-005, SHARED-006, SHARED-011, HOME-013, HOME-025, URGE-031 (extended «تدخّل الآن — وضع الطوارئ»), EMERGENCY-002 (overlay h1), KNOWLEDGE-003 (prose mention), TAX-001 L4 desc
- «تدخل مبكر» / «تدخلات مبكرة» — HOME-043, PROGRESS-015, TAX-001 L3, TAX-007, KB-008 title («التدخل المبكر أرخص بكثير»)
- «قطع مبكر» — TAX-002 mode label (interrupt); «تدخل فوري» — TAX-002 mode label (immediate)
- «تدخل أقوى» — EMERGENCY-014 (escalated step title), EMERGENCY-021, URGE-041
- «التدخل المقترح» — URGE-028 («ابدأ التدخل المقترح الآن»)
- «خطوة قطع» / «خطوة قطع واحدة» — HOME-012, URGE-025, URGE-030 («أول خطوة قطع»), TAX-001 L3, PREVENT-032 («أبدأ خطوة قطع فورًا»), KB-0653 («أسرع نقطة قطع»)
- aria «تدخل الآن — وضع الطوارئ» — SHARED-007 (no shadda, unlike the visible text)

WHERE USED: Global chrome (SOS buttons), Urge Check phases, Emergency step 3, Evening check-in Q3, Trigger Map insights, Progress metrics, onboarding summary, backup validators, intervention library.

CURRENT RELATION: **A** — one genus («تدخل») with intensity qualifiers (مبكر / فوري / أقوى) and one reserved fixed phrase («تدخّل الآن»). **B** — «خطوة قطع» is the unit-of-action framing (a single cut step) inside the same family.

PROBLEM: (1) Orthographic split: the SOS phrase is always «تدخّل» (with shadda) while all generic uses are «تدخل» (no shadda) — including the screen-reader name SHARED-007 which spells the CTA without shadda. (2) The interrupt *mode* is labeled «قطع مبكر» (TAX-002) while its *metric* is labeled «تدخلات مبكرة» (HOME-043/PROGRESS-015) — two words for the same level-3 band across two surfaces. (3) «تدخل فوري» (mode label) never appears as a button; the button says «ابدأ التدخل المقترح الآن».

SEVERITY: Medium.

DECISION NEEDED: Shadda convention for the CTA vs the generic noun (and aria parity); whether mode labels and metric labels for the same band should share one word (K-07).

---

### A-7. Emergency mode & crisis

CONCEPT: The always-available escalation overlay; and the level-5 acute state.

CURRENT EXPRESSIONS:
- «وضع الطوارئ» — EMERGENCY-001 (overlay aria-label), EMERGENCY-012 («خروج من وضع الطوارئ»), URGE-029 («ابدأ وضع الطوارئ بدلًا منه»), URGE-031, SHARED-007 (aria), SHARED-012 («وضع الطوارئ — خطوات مباشرة بلا تشتيت»), ONBOARDING-022 («خطة «وضع العمل الآمن» عند الطوارئ»), TAX-002 (emergency mode label)
- «أزمة» — EMERGENCY-007 (badge suffix «— أزمة», riskLevel ≥ 5 only), URGE-030 («أزمة فورية — لا تقرأ أكثر…»), PREVENT-014 («لا تضبط هذه الأدوات أثناء أزمة (درجة الحالة ٥)»), KB «قاعدة الأزمة: خطوة واحدة فقط» (KB title)
- «وضع الأزمة» — TAX-002 ONLY (the maximum mode label rendered as «أنسب خطوة الآن: وضع الأزمة» via URGE-017)
- «الطوارئ» alone — KB-000 category «مهارات الطوارئ», KB titles («خطة طوارئ مكتوبة», «تدرّب على الطوارئ وأنت هادئ», «قلّة الخيارات ميزة الطوارئ»), «حماية الطوارئ» — ONBOARDING-040
- «وضع العمل الآمن» — ONBOARDING-022, ONBOARDING-040 (the work-safe variant of emergency protection)

WHERE USED: Global SOS chrome, Urge Check result, the Emergency overlay itself, Prevention timing note, onboarding summary, knowledge category/titles.

CURRENT RELATION: **C** — «وضع الطوارئ» (the overlay feature) vs «أزمة» (the level-5 state) are different concepts. **D** — «وضع الأزمة» (TAX-002) names the level-5 recommended step, but pressing its button («تدخّل الآن — وضع الطوارئ», URGE-031) opens the same overlay that is titled and aria-named «وضع الطوارئ» with the «— أزمة» suffix (EMERGENCY-006/007). Whether the product intends a distinct "crisis mode" or a crisis level of the one emergency mode is not settled by the copy.

PROBLEM: At level 5 the user meets three names for one experience inside a single handoff: «أنسب خطوة الآن: وضع الأزمة» → button «تدخّل الآن — وضع الطوارئ» → overlay «درجة الحالة: 5 من ٥ — أزمة». PREVENT-014 adds a fourth phrasing («أثناء أزمة (درجة الحالة ٥)»).

SEVERITY: **High**.

DECISION NEEDED: Decide whether level 5 has its own user-facing mode name or is described as the crisis level of «وضع الطوارئ»; align TAX-002's label with the overlay naming (K-04).

---

### A-8. Escalation

CONCEPT: The stronger-intervention stage reached when a first intervention did not lower the risk.

CURRENT EXPRESSIONS:
- «التصعيد» — PREVENT-016 («يظهر زر اتصاله في التصعيد»), IV-027 name («التصعيد: اذهب حيث الناس»)
- «تدخل أقوى» — EMERGENCY-014 (escalated step-3 title), EMERGENCY-021 («جرّب تدخلًا أقوى»), URGE-041 («نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام»)
- «إن أمكن فورًا:» — EMERGENCY-016 (the support box header shown at that stage)

WHERE USED: Prevention support-person card, Emergency overlay step 3, Urge Check outcome.

CURRENT RELATION: **B** — «التصعيد» names the stage; «تدخل أقوى» names the action offered in it.

PROBLEM: PREVENT-016 promises the call button «في التصعيد», but the emergency overlay never uses the word «تصعيد» — the escalated step is titled «تدخل أقوى» and the support box appears under «إن أمكن فورًا:». The promised feature name does not exist where the promise is fulfilled.

SEVERITY: **High** (feature meaning / navigation).

DECISION NEEDED: Introduce the stage name in the overlay's escalated step, or reword the Prevention promise to match the overlay's actual copy (K-10).

---

### A-9. Stopping / cutting off

CONCEPT: Halting the behavior, a session, or the escalation chain.

CURRENT EXPRESSIONS:
- «توقّف هنا» — RELAPSE-001 (screen title), HOME-018, HOME-027, SHARED-001 (nav label)
- «ما تكملش» / «ما تكمّلش» — HOME-015/016, EMERGENCY-026, URGE-043, RELAPSE-002/024
- «إيقاف فوري» — SHARED-001 desc, RELAPSE-002; «الوقفة هنا أهم خطوة» — RELAPSE-024; «أوقف عند حدّه» — RELAPSE-017; «أوقفت — الخطوة التالية» — RELAPSE-026; «توقفت فورًا» / «وقفت» — RELAPSE-015 / RELAPSE-041
- «سرعة التوقف» — RELAPSE-007, PROGRESS-022; «كم استغرق التوقف؟» — RELAPSE-032; «متوسط زمن التوقف بعد التعثر» — PROGRESS-023 hint
- «قطع» / «اقطعها» / «أقطعها» — URGE-025 («اقطعها الآن وهي لسه صغيرة»), TAX-006 («اقطعها الآن»), OTHER-002 («اقطع السلسلة»), KB-062 («أين كان يمكن قطع السلسلة؟»), PREVENT-032 («خطوة قطع»)
- «متوقف» (timer paused) — SHARED-020; «موقوفة» (rule disabled) — PREVENT-011

WHERE USED: Stop flow, Home banners, emergency copy, metrics, timer, prevention rules.

CURRENT RELATION: **B** — the «توقف/إيقاف» family (stopping what already started) and the «قطع» family (cutting the chain before it grows) are related but operationally different moments; the copy uses them with this distinction fairly consistently. **C/D** — «متوقف» (timer) and «موقوفة» (rule) are unrelated states sharing the root.

PROBLEM: Low. «توقّف هنا» intentionally doubles as nav label and CTA. The only drift is the passive participle pair «موقوفة» (rule) vs «متوقف» (timer) — different patterns for state labels.

SEVERITY: Low-Medium.

DECISION NEEDED: Minor — whether rule-state labels and timer-state labels should follow one participle pattern; confirm «قطع» stays reserved for chain-cutting.

---

### A-10. Trigger

CONCEPT: What starts the wave/chain.

CURRENT EXPRESSIONS:
- «المحفز» / «محفز» / «محفزات» — TRIGGER-001/002/013/014/015, HOME-047/048, ONBOARDING-013 («أريد فهم محفزاتي»), PREVENT-032 («بدأت بالبحث عن محفز»), TAX-003 (24 trigger chips), TAX-004 (5 category labels), KB-006 title («المحفز أوسع مما تظن»), BACKUP-030
- «ما الذي بدأ الأمر؟» — URGE-012, RELAPSE-031, RELAPSE-047 («١ · ما الذي بدأ الأمر؟»)
- «إذا بدأ الأمر من {trigger}» — RELAPSE-060 (rule preview)

WHERE USED: Urge Check input, Evening check-in Q2, relapse quick log + review step 1, Trigger Map, onboarding, seeded rules, backup validators.

CURRENT RELATION: **A** — «ما الذي بدأ الأمر؟» is the question form that elicits the «محفز»; a coherent label/question pair.

PROBLEM: None material. The trigger vocabulary itself (TAX-003) is consistent and reused across all four surfaces.

SEVERITY: Low.

DECISION NEEDED: None beyond confirming «المحفز» as canonical (implicit in K-02/K-09 adjacency; no separate decision required).

---

### A-11. Pattern

CONCEPT: Recurring combinations of context/trigger/time observed from the user's log.

CURRENT EXPRESSIONS:
- «النمط» / «أنماط» / «أنماطك» — TRIGGER-003 («أنماطك المكتشفة — الهدف: أبكر نقطة تقدر توقف عندها»), TRIGGER-005 («سيبدأ التطبيق برسم أنماطك»), TRIGGER-007 («نمطك الأخطر ({n} مرة)»), TRIGGER-017 («هذه أنماط سلوكية مرصودة من سجلك»), ONBOARDING-017/020 («النمط العام»), PROGRESS-029 («نمط السياق الأخطر»), TAX-007 («تثبيت النمط الجديد»), KB-061 («عودة النمط القديم»), KB («الضغط يوقظ الأنماط القديمة»)
- «سلسلتك» (chain-as-pattern) — TRIGGER-006 («أبكر نقطة تدخل في سلسلتك»), TRIGGER-010 (««نقطة التدخل الأفضل» في سلسلتك»)

WHERE USED: Trigger Map, Onboarding step 2, Progress insights, journey stages, knowledge content.

CURRENT RELATION: **A/B** — «نمط» (pattern over time) vs «سلسلة» (episode sequence); the Trigger Map blends them metaphorically («نقطة التدخل… في سلسلتك»).

PROBLEM: Low — the blend is metaphorical and contextually clear.

SEVERITY: Low.

DECISION NEEDED: None critical; the pattern/chain boundary feeds the voice-rule on metaphors (E-12).

---

### A-12. Early warning

CONCEPT: The first subjective/behavioral sign that a wave is starting.

CURRENT EXPRESSIONS:
- «علامات مبكرة» — URGE-021 («علامات مبكرة تستحق اليقظة»), URGE-022 (the four signs)
- «أول علامة» — RELAPSE-049 («ما أول علامة ظهرت قبل الحدث؟»), TRIGGER-008 («أول علامة عادةً: {firstSign.id}»), KB-0653 («أول علامة»)
- «إشارات مبكرة» / «علاماتك المبكرة» — KB-002 act («عامل إشاراتك المبكرة باحترام»), KB-002 understand («إشاراته أسرع في إطلاق الدافع»)
- TAX-005 chip set (10 signs; label rendered inside RELAPSE-049's question)

WHERE USED: Urge Check result (awareness mode), calm review step 3, Trigger Map top-pattern card, knowledge content.

CURRENT RELATION: **A** — «علامة مبكرة» (UI) vs «إشارة مبكرة» (KB) — same concept, two head-words split by surface.

PROBLEM: Minor wording drift between the UI layer («علامة») and the educational layer («إشارة»); TAX-005's chip labels use neither word (they are the signs themselves).

SEVERITY: Low.

DECISION NEEDED: Minor alignment decision (which head-word anchors the concept when Phase 2C touches these surfaces).

---

### A-13. Review — «مراجعة» is overloaded across TWO product features (CRITICAL)

CONCEPT: Two genuinely different features share one word:

1. **Evening check-in** — a 5-question nightly survey + tomorrow-forecast (PlanScreen dialog).
2. **Relapse calm review** — a 6-step post-event analysis that produces a prevention rule (RelapseScreen).

CURRENT EXPRESSIONS (evening check-in):
- «المراجعة المسائية» — PLAN-022 (card title), PLAN-027 (dialog title), HOME-046 («مراجعات مسائية / ١٤ يومًا»), PROGRESS-011 («مراجعات مسائية متتابعة»), IV-017 next action («سجّل ما أنجزته في المراجعة المسائية»), BACKUP-030 («سجل مراجعة مسائية غير صالحة…»)
- «٥ أسئلة قصيرة + توقّع الغد» — PLAN-024
- «سلسلة المراجعات» — PROGRESS-009 (streak metric — counts ONLY evening check-ins)

CURRENT EXPRESSIONS (calm review):
- «مراجعة هادئة» / «المراجعة الهادئة» / «مراجعات هادئة» — RELAPSE-045 (wizard title), RELAPSE-004 («مراجعات هادئة بانتظارك ({n})»), RELAPSE-005, TRIGGER-010, HOME-017, RELAPSE-042, KB-062 act («في المراجعة الهادئة»)
- «حلّل» / «حلّلها» / «حلّل بهدوء الآن» — RELAPSE-019, RELAPSE-005, RELAPSE-044 (the verb of this feature)

SHARED COLLISIONS:
- «حفظ المراجعة» — PLAN-046 AND RELAPSE-065: the identical button label ends both wizards.
- «مراجعات» unqualified — RELAPSE-004 (relapse reviews) vs PROGRESS-009/011 (evening check-ins): two counters called «مراجعات» on two screens measuring different things.

WHERE USED: Daily Plan (card + dialog), Stop/Post-behavior screen, Home banner + stability metric, Progress streak tile, Trigger Map unlock hint, knowledge content, backup validators.

CURRENT RELATION: **C** — two genuinely different product features. The qualifier (مسائية / هادئة) is the only thing separating them, and it is dropped exactly where it matters most (the shared save button, the two streak/queue counters).

PROBLEM: Any unqualified «مراجعة» is ambiguous wherever both features are in play. A user who reads «حفظ المراجعة» inside the evening dialog and later inside the relapse wizard gets no signal they are saving different things; «سلسلة المراجعات» (evening) vs «مراجعات هادئة بانتظارك» (relapse) both pluralize the same head-word for different counts. KB-06972 additionally suggests a third review ritual («مراجعة نقاط الخطر الأسبوعية») that no UI implements.

SEVERITY: **High** — the single most consequential terminology collision in the app.

DECISION NEEDED: How the two features get unambiguous user-facing names; the fate of the shared «حفظ المراجعة» button; the naming of the streak metric; whether «حلّل» remains the calm-review verb (K-03).

---

### A-14. Lesson / learning

CONCEPT: The one-sentence takeaway recorded in check-ins and reviews.

CURRENT EXPRESSIONS:
- «درس واحد» — PLAN-034 («٤ · درس واحد من اليوم؟»), RELAPSE-057 («درس واحد تحفظه:»), KB (relapse cards' framing)
- «تعلّم» / «تعلم» — ONBOARDING-039 («→ تعلم»), SETTINGS-010 («جرعة تعلم يومية مخصصة»), OTHER-002 («تعلّم»)

WHERE USED: Evening check-in step 2, calm review final step, onboarding response-loop line, dose description, meta description.

CURRENT RELATION: **A** — consistent family.

PROBLEM: None. (The placeholder «جملة واحدة تكفي…» is shared verbatim by both wizards — see H.)

SEVERITY: Low.

DECISION NEEDED: None.

---

### A-15. Rule / prevention plan

CONCEPT: The if/then pre-commitments and the screen that holds them.

CURRENT EXPRESSIONS:
- «قاعدة» / «قواعد» + «إذا… إذن» — PREVENT-001…032 passim, ONBOARDING-041 («أربع قواعد «إذا… إذن» جاهزة في خطة الوقاية»), RELAPSE-059/060/061/062, TRIGGER-012 («قواعد «إذا… إذن» وبروتوكول الليل»), KB-6957 title («قواعد «إذا… إذن»: خطة طوارئ مكتوبة»), TAX-010 profiles limits («ادعمه بقاعدة «إذا… إذن»»), PLAN-007 («فعّل قواعد اليوم مسبقًا»)
- «خطة الوقاية» — PREVENT-001, RELAPSE-022, RELAPSE-062, ONBOARDING-041, SHARED-001 (nav label)
- «قواعدي «إذا… إذن»» — PREVENT-003 (card header, possessive variant)
- «قاعدة وقاية (جديدة / مقترحة)» — PREVENT-025, RELAPSE-059, BACKUP-010/030
- «خطة الاستجابة» — ONBOARDING-039 (the response loop: فحص → تدخل → إعادة تقييم → تعلم)
- «حماية الطوارئ» — ONBOARDING-040 (the work-safe/away-device emergency summary — a different concept)

WHERE USED: Prevention screen + dialogs, Stop flow (rule creation), onboarding summary, forecast CTA, Trigger Map advice, knowledge content, backup validators.

CURRENT RELATION: **A** — one feature (prevention rules) with a possessive header variant («قواعدي») and a KB metaphorical re-description («خطة طوارئ مكتوبة»). **C** — «خطة الاستجابة» (the loop concept, onboarding only) and «حماية الطوارئ» (work-safe config summary) are different concepts whose names sit inside the same plan/emergency vocabulary space.

PROBLEM: Mild naming spread (four labels for the rules feature family); «حماية الطوارئ» (ONBOARDING-040) is easily misread as the prevention plan or the emergency mode; PLAN-007's «قواعد اليوم» is a third possessive form.

SEVERITY: Medium.

DECISION NEEDED: Canonical feature name; whether KB's «خطة طوارئ مكتوبة» metaphor may stand; whether «حماية الطوارئ» keeps its name (K-13 sub-item; indexed under K-16).

---

### A-16. The night-protocol family

CONCEPT: Pre-sleep / late-night protective routines — one concept family named three different ways on three surfaces.

CURRENT EXPRESSIONS:
- «بروتوكول الليل» — PLAN-018 (the plan item: «آخر ٣٠–٦٠ دقيقة: لا شاشات · جهّز الغد · اهدأ ثم نم»), PLAN-005 (forecast: «حافظ على بروتوكول الليل»), TRIGGER-012 («قواعد «إذا… إذن» وبروتوكول الليل»)
- «بروتوكول ما قبل النوم» — KB sl-protocol card title (act: «آخر ٣٠ دقيقة: إضاءة خافتة، لا شاشات، قراءة ورقية أو استرخاء، ثم النوم مباشرة»)
- «بروتوكول الوقت المتأخر» — TAX-010 night guide title (steps: الهاتف خارج غرفة النوم / منبّه منفصل / السرير للنوم فقط)
- «قواعدك الليلية» — PLAN-004 (elevated forecast: «فعّل قواعدك الليلية مبكرًا»)
- «الوقت المتأخر» / «الليل المتأخر» — TAX-018 bucket, TAX-003 trigger, ONBOARDING-016

WHERE USED: Daily Plan, forecast messages, Trigger Map advice, Prevention digital-protection guides, knowledge content.

CURRENT RELATION: **B/C** — three protocol names with overlapping but differently-scoped content (plan routine vs wind-down science vs device protocol); the copy never states they are related.

PROBLEM: A user told to «فعّل قواعدك الليلية مبكرًا» (PLAN-004), then to keep «بروتوكول الليل» (PLAN-005), then meeting «بروتوكول ما قبل النوم» (KB) and «بروتوكول الوقت المتأخر» (Prevention) has no signal whether these are one thing, three things, or a progression. The risk-triad itself is also formulated three ways: «السرير + الجهاز + وقت متأخر» (IV-014 why) vs «ليل + وحدة + جهاز» (KB-006 title «الثلاثية الأشهر») vs «وقت متأخر + وحدة + جهاز» (TAX-010 night guide).

SEVERITY: Medium.

DECISION NEEDED: A naming map for the night family — unify, or deliberately scope each name and keep them distinct (K-21).

---

### A-17. Work-safe

CONCEPT: The profile-derived branch that keeps the user on the device during interventions.

CURRENT EXPRESSIONS:
- «وضع العمل الآمن» — ONBOARDING-022 («هذا يحدد خطة «وضع العمل الآمن» عند الطوارئ»), ONBOARDING-040 (««وضع العمل الآمن» جاهز — مش محتاج تسيب جهازك»)
- «أحتاج الجهاز الآن للعمل/الدراسة» — URGE-011 (the moment-level toggle chip)
- «تدخلات لا تتطلب ترك الجهاز» / «تدخلات الابتعاد عن الجهاز» — ONBOARDING-023/025
- «إقفال بيئة العمل» — IV-018 (intervention name)
- TAX-009 (work-safe sub-steps), EMERGENCY-008 (work-safe step-1 instruction)

WHERE USED: Onboarding step 3 + summary, Urge Check context chips, Emergency step 1, intervention library.

CURRENT RELATION: **A** — one concept consistently implemented; vocabulary appropriately varies by surface (feature name vs question vs toggle chip).

PROBLEM: The named mode («وضع العمل الآمن») never reappears by name where it operates — the emergency overlay's work-safe step 1 (EMERGENCY-008) just shows different instructions without naming the mode the onboarding promised.

SEVERITY: Medium (feature recognition).

DECISION NEEDED: Whether the work-safe branch should be named inside the overlay, or the onboarding promise should describe behavior instead of naming a mode (K-16).

---

### A-18. Journey / stages / recovery / the brand word

CONCEPT: The long-horizon framing (journey, stages) and the recovery vocabulary.

CURRENT EXPRESSIONS:
- «رحلتك» / «الرحلة» / «رحلة اليوم» — HOME-002 («اليوم {n} من رحلتك»), PROGRESS-003, SETTINGS-005/006/007, DOSE-002/017, TAX-007 disclaimer, ONBOARDING-045 («ابدأ رحلتي»)
- Stage names — TAX-007 («التثبيت», «الفهم», «بناء المهارات», «إعادة بناء الحياة», «التعزيز», «الصيانة», «المدى الطويل»)
- «التعافي» (the process) — HOME-049 («ليست… نسبة تعافٍ»), PROGRESS-002 («لا نسبة تعافٍ زائفة»), DOSE-014 («التعافي لا يُقاس بيوم واحد»), KB-06852 title («التعافي ليس خطًا مستقيمًا»), KB («رصيد التعافي يتراكم»), TAX-008 («للتعافي»)
- «استعادة» (the brand) + «استعادة التحكم» — ONBOARDING-002, OTHER-001/002/003, SHARED-003 (short tagline)
- «استعادة» as the everyday verb "restore" — BACKUP-014/015/016/020, ONBOARDING-009/010, SETTINGS-022 («استيراد / استعادة»), BACKUP-018

WHERE USED: Home subtitle, Progress journey card, Settings journey card, Dose header, onboarding welcome/finish, backup/restore flows, browser metadata.

CURRENT RELATION: **A** — the journey framing is consistent. **B/D** — brand («استعادة») vs process («تعافي») vs restore-action («استعادة النسخة») coexist; the tagline promises «استعادة التحكم» while running copy speaks of «التعافي».

PROBLEM: (1) The tagline itself drifts between two forms (ONBOARDING-002/OTHER-001 «نظام شخصي لاستعادة التحكم» vs SHARED-003 «نظام شخصي للتحكم»). (2) The brand word doubles as the backup-restore verb across the whole Settings/Backup surface («تمت الاستعادة بنجاح», «استعادة النسخة الاحتياطية») — a mild but pervasive polysemy next to the brand name.

SEVERITY: Medium (tagline), Low (polysemy).

DECISION NEEDED: One tagline form; whether the brand/process/restore split is deliberate (and thus codified) or the restore flows should avoid the brand word (K-13, K-15).

---

### A-19. Progress & the metric system

CONCEPT: The honest-metrics system and its labels.

CURRENT EXPRESSIONS:
- «التقدم» — PROGRESS-001, HOME-039 («لمحة التقدم»), KB («التقدم المرئي يبني هوية», «التقدم اتجاه، لا تاريخًا في التقويم»)
- «مؤشرات» — PROGRESS-002/012/021/028? no (قراءات), PROGRESS-033, HOME-041–048 (labels+hints), EMERGENCY-023 («مؤشراتك»)
- «قراءات من سجلك» — PROGRESS-028 (insights header); «سجلك» — PROGRESS-028/033, TRIGGER-002/017, KB-011 («سجلك يكشف ما لا تذكره»)
- Metric labels (same metric, two screens): «رغبات تعاملت معها» HOME-041 = PROGRESS-013; «تدخلات مبكرة» HOME-043 = PROGRESS-015; «استقرار يومي» HOME-045 vs «الاستقرار اليومي» PROGRESS-027; «وعي بالمحفزات» HOME-047/PROGRESS-026; «سرعة التوقف» RELAPSE-007 = PROGRESS-022; «منع السقوط الثاني» RELAPSE-010 = PROGRESS-019; «تكرار السلوك» PROGRESS-024; «جلسات أوقفتها مبكرًا» PROGRESS-017
- Hint drift — HOME-042 «{n} خلال آخر أسبوع» vs PROGRESS-014 «{n} خلال آخر ٧ أيام»; HOME-044 «خلال ٣٠ يومًا» vs PROGRESS-016 «عند درجة ٣ أو أقل — خلال ٣٠ يومًا»; HOME-046 «مراجعات مسائية / ١٤ يومًا» vs PROGRESS-027 «إنجاز المراجعة المسائية خلال ١٤ يومًا»; HOME-048 «محفزات مختلفة رصدتها» vs PROGRESS-026 «…رصدتها خلال ٣٠ يومًا»; RELAPSE-008 «فوري تقريبًا / ~{n} دقيقة» vs PROGRESS-023 «فوري / ~{n} د»; RELAPSE-011 «من {n} تعثرًا» vs PROGRESS-020 «تعثرات لم تتحول لجلسة ممتدة»

WHERE USED: Home snapshot, Progress screen, Stop screen stats, Emergency done screen.

CURRENT RELATION: **A** — one metric system; the Home snapshot and Progress screen differ in density by design, but labels/hints/units drift beyond density (Phase 2A D12).

PROBLEM: The same metric introduces itself differently on two screens the same user visits; unit abbreviations differ («دقيقة» vs «د»); window wording differs («أسبوع» vs «٧ أيام»); article usage differs («استقرار يومي» vs «الاستقرار اليومي»).

SEVERITY: Medium.

DECISION NEEDED: Unify labels/hints or codify the short/long pair as a deliberate pattern (K-11).

---

### A-20. Streak / day counters

CONCEPT: The continuity counters.

CURRENT EXPRESSIONS:
- «أيام منذ آخر تعثر» — PROGRESS-007; «— و{n} يومًا منذ آخر تعثر» — HOME-003
- «سلسلة المراجعات» — PROGRESS-009 (hint: «مراجعات مسائية متتابعة»; value «{n} يوم»)
- «عدّاد الأيام» — RELAPSE-039 («عدّاد الأيام ممكن يبدأ من جديد — لكن خبرتك ما بترجعش للصفر»)
- «مؤشر واحد من ضمن المؤشرات» — PROGRESS-008 (anti-centrality hint)

WHERE USED: Progress streak tiles, Home subtitle, reframe message.

CURRENT RELATION: **C/B** — two different counters (days-since-relapse; check-in streak) plus a reframe message that names the first one differently («عدّاد الأيام») than the metric tile does.

PROBLEM: «سلسلة المراجعات» uses «سلسلة» in its positive streak sense while «السلسلة» is the app's central *danger* metaphor (A-23) — a polysemy collision inside one app; and the reframe message refers to a counter («عدّاد الأيام») whose screen label is «أيام منذ آخر تعثر».

SEVERITY: Medium.

DECISION NEEDED: Naming of the streak metric(s); whether the positive «سلسلة» is allowed to coexist with the danger «السلسلة» (K-24).

---

### A-21. Privacy / local-first

CONCEPT: The data-stays-on-device promise.

CURRENT EXPRESSIONS:
- «بياناتك على جهازك فقط — لا حسابات ولا خوادم.» — SHARED-004
- «لا حساب، لا خادم، لا إرسال لأي مكان — كل شيء يُخزن محليًا في متصفحك، ويمكنك تصديره كنسخة احتياطية متى شئت.» — ONBOARDING-006
- «بياناتك كلها ستُخزن على جهازك فقط — لا حساب، لا خادم، لا إرسال لأي مكان.» — ONBOARDING-042
- «كل بياناتك (سجلات، مراجعات، خطة) محفوظة في متصفحك فقط — لا تغادر جهازك أبدًا. …» — SETTINGS-004
- «بياناتك محفوظة على جهازك فقط.» — HOME-049
- «صراحتك هنا هي ما يجعل خريطتك وتوقعاتك دقيقة — البيانات تبقى على جهازك.» — PLAN-047
- «خصوصيتك أولًا — كل شيء يعمل محليًا على جهازك.» — SETTINGS-002; «خصوصيتك» — SETTINGS-003
- «تُحفظ هذه المسودة على جهازك تلقائيًا…» — VALUES-014; «رقمه (يُخزن محليًا فقط)» — PREVENT-018
- «يعمل محليًا بالكامل» — SETTINGS-033, SHARED-032; «لا حسابات ولا خوادم» — OTHER-002

WHERE USED: Sidebar footer, onboarding (×2), Settings (×3), Home footer, Plan dialog footer, Values note, Prevention input, splash/noscript, meta description.

CURRENT RELATION: **A** — one promise, drifting wording (Phase 2A D6): device («جهازك») vs browser («متصفحك») alternation; «لا حسابات ولا خوادم» vs «لا حساب، لا خادم».

PROBLEM: The trust message — the app's most repeated promise — has 6+ variants with micro-drift; the جهاز/متصفح alternation is technically both-true but stylistically unresolved.

SEVERITY: Medium (trust-message consistency).

DECISION NEEDED: Canonical short form + canonical long form; a rule for جهاز vs متصفح (K-12).

---

### A-22. Device / browser / phone / screen vocabulary

CONCEPT: The hardware references.

CURRENT EXPRESSIONS:
- «الجهاز» (device) — URGE-011, ONBOARDING-021/023/025/040, IV-019 («إبعاد الجهاز عن متناول اليد»), TAX-009/010, PREVENT-018, SHARED-032, SETTINGS-033, privacy family
- «الهاتف» — PLAN-016 («الهاتف خارج السرير»), TAX-005 («الهاتف في السرير»), TAX-003 («التقاط الهاتف آليًا»), IV-014/026, ONBOARDING-016 («أثناء استخدام الهاتف/الكمبيوتر»)
- «المتصفح» — ONBOARDING-006, SETTINGS-004, PREVENT-032 («أغلق المتصفح»), TAX-010 (profiles guide), RELAPSE-052/056 examples («فتحت المتصفح»)
- «الكمبيوتر» — ONBOARDING-021/016; «الشاشة» — KB («أول شاشة تراها»), IV-018, PLAN-016 context

WHERE USED: Everywhere.

CURRENT RELATION: **A** — natural contextual variation.

PROBLEM: Only matters inside the privacy lines (A-21) where the alternation changes the claim's texture; elsewhere harmless and appropriate.

SEVERITY: Low.

DECISION NEEDED: Covered by K-12.

---

### A-23. The chain / loop / cycle (structural metaphors)

CONCEPT: The escalation-sequence metaphor system — the app's central didactic image.

CURRENT EXPRESSIONS:
- «السلسلة» (the chain; dominant) — TAX-006 («السلسلة بدأت بالفعل», «لا تفاوض على السلسلة»), IV-001 why («السلسلة تحتاج مصدرًا مفتوحًا لتستمر»), TRIGGER-006/010 («سلسلتك»), OTHER-002 («اقطع السلسلة»), KB library (31 lines), IV library (8 lines), PREVENT-032 context, TAX-010 night («لا سلسلة تقريبًا تبدأ دون…»)
- «الحلقة» (the loop) — RELAPSE-025 («البديل جزء من نفس الحلقة»), TAX-006 deserve-response («هذه الحلقة تزيد الضغط بعد قليل»), KB-«حلقة العادة: إشارة → روتين → مكافأة», KB-«حلقة التوتر → التفريغ → الذنب», IV-006 why («حلقة التفكير»)
- «الدورة» (the cycle) — RELAPSE-021 («الضيق الذي يغذي الدورة نفسها»), KB-«جلد الذات يغذي الدورة»
- «المصدر» (the source — the chain's fuel) — EMERGENCY-009 («أغلق المصدر الآن»), IV-001 («إغلاق المصدر فورًا»), TAX-001 L4 example («فتحت المصدر بالفعل»), KB-7020 («أغلق المصدر → غيّر المكان → خطوة فعلية»)

WHERE USED: Anti-rationalization responses, interventions, emergency instructions, STOP steps, trigger map, knowledge library, meta description.

CURRENT RELATION: **B** — «السلسلة» (the within-episode escalation) vs «الحلقة» (the repeating habit loop / the self-feeding cycle) vs «الدورة» (the longer self-reinforcing cycle) — related, mostly used with distinction, with occasional blur (TAX-006's deserve-response uses «الحلقة» where neighboring copy would say «السلسلة»). «المصدر» is a consistent coined term for the content source.

PROBLEM: Three structural metaphors coexist without a stated boundary; the collision with the positive streak «سلسلة المراجعات» is covered in A-20. «المصدر» also has an invisible second sense in backup validators («مصدر غير صالح في سجل التدخلات» — data provenance; BACKUP-030) — not user-visible in normal flows.

SEVERITY: Medium (metaphor governance), Low («المصدر» polysemy).

DECISION NEEDED: Codify the metaphor boundaries (chain = episode escalation; loop = habit cycle; cycle = long-run reinforcement) or accept the current blur (feeds E-12; K-24).

---

### A-24. Values & spiritual content

CONCEPT: The values tools and the opt-in spiritual gate.

CURRENT EXPRESSIONS (values):
- «القيم» — VALUES-001 (screen title «القيم والروحانيات»), VALUES-009 («قيمي في جُمل»), VALUES-010, ONBOARDING-028 («حياة قيمية/روحية»), TAX-014 («قيمي»), KB category «القيم», KB-6732 title («اكتب قيمك بجملة لكل قيمة»)

CURRENT EXPRESSIONS (the spiritual gate — four word-bases):
- «المحتوى الروحي» — VALUES-015 (card header), VALUES-017 (body), VALUES-002, SETTINGS-013
- «المحتوى الروحي/القيمي» — SETTINGS-011 (toggle title)
- «القيم والروحانيات» — VALUES-001 / SHARED-001 (nav label)
- «تأمل قيمي وروحي» — ONBOARDING-031 (the opt-in option)
- «تأمل روحي» — KB-000 spiritual category, SETTINGS-013 («بطاقات «تأمل روحي»»)
- «روحي» — KNOWLEDGE-008 (card badge); «روحانيتي» — TAX-014 (why reason); «تفعيل المحتوى الروحي» — VALUES-016 (aria)

WHERE USED: Values screen, Settings content card, Onboarding step 5, Knowledge category chip + badges, nav label, aria labels.

CURRENT RELATION: **B** — different granularities (screen name / gate name / category name / badge) that currently draw from four word-bases (روحي، روحانيات، قيمي-روحي، تأمل روحي).

PROBLEM: The single most important opt-in in the app is labeled differently on the three surfaces that discover it (Values card «المحتوى الروحي», Settings toggle «المحتوى الروحي/القيمي», Onboarding option «تأمل قيمي وروحي»), plus a fourth name for its content category («تأمل روحي»). «الروحانيات» (nav) vs «الروحي» (everywhere else) is the sharpest split.

SEVERITY: Medium (feature discoverability + opt-in clarity).

DECISION NEEDED: Canonical gate name + slash-form policy (K-14).

---

### A-25. Support

CONCEPT: Human support — the trusted person, the preference, professional help.

CURRENT EXPRESSIONS:
- «شخص دعم» — PREVENT-015 (card header «شخص دعم (اختياري تمامًا)»), BACKUP-031
- «شخص تثق به» / «أي شخص تثق به» — PREVENT-016, EMERGENCY-018, IV-004/023/027
- «قوالب رسائل محايدة» — PREVENT-023 (+ TAX-012 templates)
- «الدعم» (content preference) — ONBOARDING-029 («أي نوع من الدعم تفضّل؟»), SETTINGS-008 («المحتوى والدعم»), BACKUP-027 («تفضيلات الدعم غير صالحة…»)
- «دعمًا مهنيًا» / «مختص» — SETTINGS-031 («متى تطلب دعمًا مهنيًا؟»), SETTINGS-032 («لا بديلًا عن مختص»)

WHERE USED: Prevention screen, Emergency escalated step, onboarding step 5, Settings, backup validators.

CURRENT RELATION: **B** — three senses (content-support preference; human support person; professional help), mostly correctly qualified; the Settings card header «المحتوى والدعم» merges two senses in one label.

PROBLEM: Low — «شخص دعم» vs «شخص تثق به» alternate for the same feature (label vs description register); the Settings card header is the only true blend.

SEVERITY: Low-Medium.

DECISION NEEDED: Minor — Settings card header wording (P3).

---

### A-26. Daily dose

CONCEPT: The daily micro-lesson.

CURRENT EXPRESSIONS:
- «الجرعة اليومية» — DOSE-001, HOME-029, SETTINGS-009, SHARED-001, ONBOARDING-030
- «خد جرعة اليوم» — HOME-021, HOME-007 (prefix); «الجرعة» / «جرعات سابقة» — DOSE-010/011/012/014/018, SETTINGS-010
- «مُخطاة اليوم» / «مُخطاة» / «خطّيت جرعة اليوم» — DOSE-003/020/010; «تخطي اليوم» — DOSE-012
- «تمت الجرعة» — DOSE-011; «أنجزت جرعة اليوم» — DOSE-009; «أُنجزت اليوم ✓» — HOME-030; «أُنجزت» — DOSE-019

WHERE USED: Dose screen, Home card, Settings toggle, nav, onboarding.

CURRENT RELATION: **A** — consistent concept; completion/skip particles vary (analyzed in H).

PROBLEM: Concept-level none; particle-level drift (H-7/H-8).

SEVERITY: Low (concept), Medium (particles).

DECISION NEEDED: Particle family decision (K-18).

---

### A-27. Knowledge base

CONCEPT: The 98-card library.

CURRENT EXPRESSIONS:
- «قاعدة المعرفة» — KNOWLEDGE-001, DOSE-022, URGE-023, VALUES-010, SHARED-001, SETTINGS-013
- «بطاقات» / «البطاقة» — KNOWLEDGE-002/009, SETTINGS-013
- «ابحث في المعرفة…» — KNOWLEDGE-004 (placeholder shorthand)
- «قراءة أعمق (اختياري)» vs «قراءة أعمق» — DOSE-008 vs KNOWLEDGE-014

WHERE USED: Knowledge screen, Dose footer, Urge result CTA, Values note, nav, Settings.

CURRENT RELATION: **A** — consistent.

PROBLEM: The deep-reading label drifts between the two render sites («(اختياري)» present on Dose, absent on Knowledge).

SEVERITY: Low.

DECISION NEEDED: Trivial alignment (P3).

---

### A-28. Forecast vs prediction (a DELIBERATE distinction worth preserving)

CONCEPT: Tomorrow's conditions → prepared guidance.

CURRENT EXPRESSIONS:
- «توقّع اليوم: {message}» — PLAN-003; «توقّع الغد» — PLAN-024/038 («(لتوقّع الغد — ليس تنبؤًا، بل استعدادًا)»); «توقعاتك» — PLAN-047
- «مش تنبؤ» / «ليس تنبؤًا» / «لا تنبؤ مضمون» — HOME-009 («مؤشر مش تنبؤ»), URGE-013/018, PLAN-038, TAX-008 («لا جدولًا زمنيًا بيولوجيًا مضمونًا للتعافي»)

WHERE USED: Plan forecast, Home banner, Urge disclaimers, journey disclaimer.

CURRENT RELATION: **C** — «توقّع» (a preparedness forecast the user builds) vs «تنبؤ» (a prediction) is consistently contrasted on purpose.

PROBLEM: None — this is the app's cleanest terminology system and should be protected during any rewrite.

SEVERITY: Low (protective note only).

DECISION NEEDED: None — codify as a voice rule (E-13).

---

### A-29. The hard-times metaphor family

CONCEPT: Difficult / vulnerable moments.

CURRENT EXPRESSIONS:
- «وقت الشدة» — KNOWLEDGE-003 («وقت الشدة له أداة أسرع»)
- «وقت العاصفة» — PREVENT-002 («تُصنع في الهدوء لتعمل وقت العاصفة»)
- «وقت الضعف» / «أوقات الضعف» / «لحظة الضعف» — TAX-010 («أثناء لحظة الضعف», «قبل وقت الضعف لا أثناءه»), TAX-007 («يقظة لأوقات الضعف»), KB («أيام الضعف», «القيم بوصلة أيام الضعف»)
- «لحظة خطر؟» — SHARED-012; «أوقات الخطر» — PROGRESS-025 hint; «نافذة الخطر» — KB-5997; «سياقات الخطر» — ONBOARDING-037/038; «توزيع أوقات الخطر» — TRIGGER-011
- «اليوم الصعب» / «يوم الحد الأدنى… اليوم الصعب» — PLAN-008/011; «اللحظات الصعبة» — ONBOARDING-033, VALUES-002

WHERE USED: Prevention, Knowledge, forecast messages, SOS card, onboarding, Values subtitle, trigger map.

CURRENT RELATION: **B** — one concept family with five metaphor bases (شدة / عاصفة / ضعف / خطر / صعوبة) chosen per context and register.

PROBLEM: Only «الخطر» is operationalized (the risk degree); the others are framing. «وقت الضعف» feeds the anti-shame tension (weakness framing) that the dignity rule tries to avoid; «عاصفة» vs «شدة» vs «صعوبة» is register coloring.

SEVERITY: Low-Medium.

DECISION NEEDED: Optional constraint decision (P4) — reserve «ضعف» for physiological states and «خطر» for operational risk, or accept the spread.

---

### A-30. Calm / quiet (the counter-concept) — a consistent positive system

CONCEPT: The calm state and calm-timing framing.

CURRENT EXPRESSIONS:
- «الهدوء» / «هادئ» / «بهدوء» — KNOWLEDGE-003 («للقراءة في الهدوء»), PREVENT-002 («تُصنع في الهدوء»), PREVENT-014 («في وقت هادئ»), TRIGGER-010 («أنجز مراجعة هادئة»), KB («تدرّب على الطوارئ وأنت هادئ»), SHARED-001 («قراءة هادئة — للوقت الهادي», «يومك الهادي»), «المراجعة الهادئة» (A-13), «مراقبة هادئة» — TAX-002 (awareness mode), «ليلة هادئة» — HOME-001/TAX-021, «ليلي هادئ» — SETTINGS-015, «تهدئة» — IV/KB, «مساء الخير» family

WHERE USED: Everywhere as the counterweight to stress.

CURRENT RELATION: **A** — one coherent concept (~52 lines across the inventory).

PROBLEM: None — consistent. Flagged because any Phase 2C rewrite must not fragment it.

SEVERITY: Low (protective note).

DECISION NEEDED: None — codify in voice rules (E-6).

---

### A-31. Minor / low-impact families (compact table)

| Family | Current expressions | IDs | Relation | Severity |
|---|---|---|---|---|
| Scale anchors (urge intensity, two surfaces) | «هادئة تقريبًا · أقصى ما أعرفه» (in-the-moment) vs «بالكاد وجدت · أقصى ما وصلت له» (evening recall) | URGE-003 vs PLAN-029 | A — same 1–5 construct, two anchor sets | Low-Medium |
| Re-run the check | «فحص جديد» vs «أعد الفحص» | URGE-024 vs HOME-014 | A | Low |
| Empty states | «لا سجل بعد» + body · «لا قواعد بعد —…» · «لا نتائج» + body · «نحتاج قليلًا من السجل أولًا» + body · «لم تسجل محفزات… بعد.» | RELAPSE-013/014, PREVENT-005, KNOWLEDGE-006/007, TRIGGER-004/005, TRIGGER-014 | A — structural drift (Phase 2A D13) | Low-Medium |
| Disclaimers (not-medical) | «مش قياس طبي ولا تنبؤ مضمون» (Egyptian) vs «ليست تشخيصًا طبيًا ولا نسبة تعافٍ» / «ليس تشخيصًا ولا علاجًا طبيًا ولا بديلًا عن مختص» / «ليست علاجًا طبيًا ولا ادعاءً علميًا» (MSA) | URGE-013/018 vs HOME-049, TRIGGER-017, SETTINGS-032, TAX-016 | A — same function, two registers | Medium (register decision) |
| Onboarding as a noun | «التهيئة» (backup validators + ONBOARDING-010 «بلا تهيئة من جديد») — the visible wizard never names itself | BACKUP-027, ONBOARDING-010 | D | Low |
| «تسجيل سريع» polysemy | Quick log screen title (relapse event) vs intervention name «تسجيل سريع للرغبة» (urge notation) | RELAPSE-029 vs IV-024 | C/D — same phrase, two features | Low-Medium |
| Praise / acknowledgment | «أحسنت» · «استجابة ممتازة» · «شكرًا لصدقك» · «وقفت — وكل وقفة بتتحسب ليك» | HOME-004, EMERGENCY-022, RELAPSE-041, PLAN-023, RELAPSE-041 | A — intentional variety? unclear | Low |
| Theme names | «ليلي هادئ» vs «نهاري» | SETTINGS-015/016 | A — asymmetric qualification | Low |
| «حدوده:» label vs inner text | Rendered label «حدوده:» (masculine) while some guides' limits text uses feminine pronouns («يمكن تجاوزها», «قد تُبطئ… وتُتجاوز») agreeing with feminine tool names («حاجبات», «تصفية») | PREVENT-013 + TAX-010 | D — grammatical referent unclear | Low |
| «القيم في جُمل» phrasing | «قيمي في جُمل» vs KB title «اكتب قيمك بجملة لكل قيمة» | VALUES-009 vs KB-6732 | A — intentional cross-reference | Low |
| Wizard navigation | «السابق» / «التالي» / «ابدأ» / «تعديل» / «حفظ…» — consistent across all four wizards | ONBOARDING-043/044, PLAN-044/045/046, RELAPSE-063/064/065, PLAN-025/026 | A — consistent | — |
| Cancel vocabulary | «تراجع» (dialogs) · «إغلاق» (sheet) · «السابق» (wizards) — consistent by control type | SETTINGS-029/BACKUP-019, SHARED-010, wizards | A — consistent by convention | — |
| «تم» acknowledgment buttons | «تم» · «تم — الخطوة التالية» · «أوقفت — الخطوة التالية» · «تم — أعد التقييم» | EMERGENCY-011, EMERGENCY-015, RELAPSE-026, SHARED-027/028 | A — consistent pattern family | — |

---

# B. Terms That Should Remain Distinct

These pairs/groups must NOT be accidentally merged by any future "standardization". Merging them would destroy real product distinctions.

### B-1. «المراجعة المسائية» vs «المراجعة الهادئة»

Reason: Two different flows/features — the nightly 5-question survey + forecast (PLAN-022…047) and the post-relapse 6-step analysis that generates a prevention rule (RELAPSE-045…065). They must not share an unqualified label; the current shared button «حفظ المراجعة» (PLAN-046 / RELAPSE-065) and the two unqualified counters («سلسلة المراجعات» PROGRESS-009 vs «مراجعات هادئة بانتظارك» RELAPSE-004) are the collision to resolve — by *differentiating*, not by merging.

Affected IDs: PLAN-022/023/024/027/046, RELAPSE-004/005/045/065, HOME-046, PROGRESS-009/011, TRIGGER-010, HOME-017, RELAPSE-042, IV-017, BACKUP-030.

### B-2. «شدة الرغبة» (input dimension) vs «درجة الحالة» (composite result)

Reason: The Urge Check's first slider is one of three inputs; the 1–5 result is a different number computed from all three. Any label that blurs them (currently «درجة الرغبة», PREVENT-032) makes the user unsure which number a rule refers to.

Affected IDs: URGE-003, URGE-015/016, EMERGENCY-006, PREVENT-032, PREVENT-014, PROGRESS-016/030, BACKUP-030.

### B-3. «الرغبة» (urge) vs «الدافع» (drive / wanting)

Reason: KB-001's deep reading deliberately contrasts wanting vs liking («الرغبة» (wanting) و«الاستمتاع» (liking)) — the educational layer needs «الدافع» as the motivational-systems word while the UI needs «الرغبة» as the lived experience. Collapsing them would flatten a real pedagogical distinction.

Affected IDs: URGE-002/003/020, TAX-001, KB-001/002/005, IV-009.

### B-4. «السلسلة» (danger chain) vs «سلسلة المراجعات» (positive streak) vs «الحلقة» (habit loop) vs «الدورة» (long cycle)

Reason: The app's central danger metaphor, its streak metric, its habit-loop science, and its long-run cycle are four different structures. Unifying «سلسلة المراجعات» with the danger sense (or vice versa) would pollute the metaphor system.

Affected IDs: TAX-006, IV-001/014, TRIGGER-006/010, OTHER-002, PROGRESS-009, RELAPSE-025, KB habit-loop + cycle cards, RELAPSE-021.

### B-5. «الجلسة» (behavior episode) vs «جلسة تركيز / جلسة عمل» (constructive sessions)

Reason: One word, opposite valence. If Phase 2C differentiates them (A-3), the distinction must survive; if it keeps one word, it must accept context as the disambiguator — but they must not be *merged into one meaning*.

Affected IDs: RELAPSE-016/035/054, PROGRESS-020, PLAN-015/019, IV-012, KB-023.

### B-6. «توقّع» (forecast) vs «تنبؤ» (prediction)

Reason: A deliberate, consistently maintained disclaimer distinction (A-28). Any rewrite that uses them interchangeably would break the app's honesty system.

Affected IDs: PLAN-003/024/038/047, HOME-009, URGE-013/018, TAX-008.

### B-7. «الفحص» (Urge Check) vs «إعادة التقييم» (post-intervention reassessment) vs the two «مراجعة» features

Reason: Four reflective rituals with different timings and outputs (in-the-moment check; quick reassessment after an intervention; nightly survey; post-event analysis). They are the app's rhythm; unqualified shared labels would blur when the user is asked to do what.

Affected IDs: URGE-001/035/036/037, SHARED-024/027/029, EMERGENCY-019, PLAN-022…, RELAPSE-045….

### B-8. «الخطة اليومية» vs «خطة الوقاية» vs «خطة الاستجابة» vs «حماية الطوارئ»

Reason: Four different things: the daily routine plan (PLAN-001…), the if/then rules (PREVENT-001…), the response loop described once in onboarding (ONBOARDING-039), and the work-safe emergency config summary (ONBOARDING-040). Each needs its qualified name kept distinct — the risk today is the reverse (labels drifting toward each other), not merging.

Affected IDs: PLAN-001, PREVENT-001/003, ONBOARDING-039/040, SHARED-001.

### B-9. «تدخّل الآن» (the fixed SOS phrase) vs generic «تدخل»

Reason: If the product wants the SOS phrase to remain an instantly recognizable affordance (it is the same string on 7 surfaces), the generic noun must not adopt the CTA's exact form (or vice versa) without a decision — the distinction is currently encoded in the shadda and the fixed-phrase status.

Affected IDs: SHARED-005/006/007/011, HOME-013/025, URGE-031, EMERGENCY-002, KNOWLEDGE-003, vs PLAN-032, URGE-028/033/034, TRIGGER-009/016, BACKUP-011/030.

### B-10. «التخطي» (dose skip — an outcome with anti-shame framing) vs «تخطي إلى…» (navigation skip links)

Reason: Same verb, unrelated semantics: skipping today's dose (a logged state with reassurance copy) vs jumping ahead in a wizard. They can share the verb but must not share framing language.

Affected IDs: DOSE-003/010/012/013/014/020, PLAN-048 vs URGE-035, RELAPSE-028.

### B-11. «متوقف» (timer paused) vs «موقوفة» (rule disabled) vs «توقفت» (you stopped)

Reason: Three states of three different objects sharing one root. Metric copy («سرعة التوقف») must keep referring to the user's stop, not the timer or the rule.

Affected IDs: SHARED-020/021, PREVENT-010/011, RELAPSE-007/015/032, PROGRESS-022/023.

### B-12. «وضع العمل الآمن» (the profile feature) vs «أحتاج الجهاز الآن للعمل/الدراسة» (the moment-level toggle)

Reason: Feature vs instance. The onboarding names the mode; the urge check asks about this moment. They are intentionally different granularities and should keep different labels even after any naming pass.

Affected IDs: ONBOARDING-022/023/025/040, URGE-011, TAX-009, EMERGENCY-008, IV-018.

---

# C. Candidates for Terminology Unification

Groups that appear to describe the **same concept** and are candidates for one canonical expression. NO final Arabic is chosen here — only the linguistic direction. Each group keeps its own rationale; unification is proposed for terminology consistency, not uniformity of sentence length (surface density may legitimately differ).

### C-1. The cut-point concept

CURRENT FORMS:
- «نقطة القطع» / «نقطة القطع الأفضل» / «نقاط القطع»
- «نقطة التدخل الأفضل»
- «أبكر نقطة (تقدر توقف عندها)»

AFFECTED IDs: RELAPSE-055, RELAPSE-060 (via rule preview), KB-062 («أين كانت نقطة القطع؟», «أسرع نقطة قطع»), PROGRESS-023 hint («راجع نقاط القطع») vs TRIGGER-009/010 («نقطة التدخل الأفضل»), TRIGGER-003/006/017, RELAPSE-046 («أبكر نقطة كان ممكن توقف عنها»), KB-0653.

WHY THEY APPEAR TO REPRESENT THE SAME CONCEPT: All name the earliest moment where intervening would have cut the chain — the Relapse review asks for it, the Trigger Map displays it, the Progress hint tells you to review it, and KB-062/0653 teach it. The three surfaces are describing one operational idea the product itself links (review → rule → map).

PREFERRED DIRECTION: One canonical compound noun (or noun+qualifier) used verbatim across the review wizard, the Trigger Map, the progress hints, and the KB teaching cards; register may vary (the Egyptian explanatory tails can stay), but the head compound should be identical everywhere the concept is named as a feature/artifact.

### C-2. The relapse-event noun (UI layer)

CURRENT FORMS:
- «تعثر» / «التعثر» (log, metrics, banners)
- «الحدث» / «الحادثة» / «الحدث ده» (review wizard questions, reframe message)
- (content-layer «زلة»/«انتكاس» are NOT part of this candidate — see B/K-01)

AFFECTED IDs: RELAPSE-012/013/014/021/037/039/041/042, HOME-003/016/017, DOSE-016, PROGRESS-007/020/033 vs RELAPSE-039, RELAPSE-049/051/053, KB-0653.

WHY: The logged thing and the interrogated thing are the same event; the wizard's «الحدث» reads as elevated register rather than a different referent.

PREFERRED DIRECTION: One user-facing noun for the event across logs, banners, metrics, and the wizard's questions — OR a deliberate two-register rule (neutral noun in chrome/metrics, event-word inside the reflective wizard) stated as a decision. If the two-word system is kept, it must be a rule, not an accident.

### C-3. The composite degree display

CURRENT FORMS:
- «درجة الحالة: {n} من ٥» (badge)
- «درجة حالتك الآن» + «من ٥» (caption + suffix)
- «درجة حالتك مرتفعة في آخر فحص» (banner)

AFFECTED IDs: EMERGENCY-006, URGE-015/016, HOME-011.

WHY: Three renderings of the same metric; the banner is a state sentence (arguably a different communicative act), but the badge and caption render the same number in two grammatical shapes.

PREFERRED DIRECTION: One canonical label stem for the number wherever it is displayed as a reading; state sentences (like the high banner) may keep their predicative form but should derive visibly from the same stem.

### C-4. The escalation answer pair & the success answer pair

CURRENT FORMS:
- «لا، لسه مرتفعة» + «نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام» vs «لا — لسه مرتفع: جرّب تدخلًا أقوى»
- «نعم، هبطت» vs «نعم — هبط»

AFFECTED IDs: URGE-040/041 vs EMERGENCY-021; URGE-038 vs EMERGENCY-020.

WHY: The same decision point (risk did/didn't drop after an intervention) expressed twice with different person (نجرّب vs جرّب), different gender agreement (مرتفعة vs مرتفع), and different dash punctuation.

PREFERRED DIRECTION: One canonical pair of answer labels + one canonical escalation sentence shape shared by the Urge outcome phase and the Emergency step 4 (the flows are sister surfaces of the same loop); person and gender agreement decided once and applied to both.

### C-5. The privacy promise

CURRENT FORMS: (six variants — see A-21)

AFFECTED IDs: SHARED-004, ONBOARDING-006, ONBOARDING-042, SETTINGS-004, HOME-049, PLAN-047 (plus VALUES-014, PREVENT-018, SETTINGS-033, SHARED-032, OTHER-002 as secondary).

WHY: One promise, drifting micro-wording; the drift is the problem, not the variety of lengths (sidebar footer vs onboarding paragraph legitimately differ in size).

PREFERRED DIRECTION: One canonical short line (chrome/footers) + one canonical long paragraph (onboarding/settings), with secondary surfaces quoting fragments of the canonical forms rather than rephrasing; a fixed rule for جهاز vs متصفح wording.

### C-6. The return-to-your-day completion family

CURRENT FORMS:
- «ارجع ليومك — الموجة دي مسجّلة وبتتحسب ليك»
- «ارجع ليومك الطبيعي. سجّلنا إنك…»
- «عودة إلى يومي»
- «العودة إلى يومي الطبيعي»

AFFECTED IDs: URGE-039, EMERGENCY-023/024, RELAPSE-043.

WHY: The same closing action of three sister flows (urge handled / emergency done / reframe done) phrased four ways — two imperatives and two nominal button labels, with/without «الطبيعي».

PREFERRED DIRECTION: One canonical imperative + one canonical button label for "return to your day" across the three flows; the reassurance sentences attached to them may differ per flow.

### C-7. Metric labels & hints (Home snapshot vs Progress screen)

CURRENT FORMS: (see A-19 list — «أسبوع» vs «٧ أيام», «خلال ٣٠ يومًا» vs «عند درجة ٣ أو أقل — خلال ٣٠ يومًا», «استقرار يومي» vs «الاستقرار اليومي», «~{n} دقيقة» vs «~{n} د», hint lengths)

AFFECTED IDs: HOME-041…048 vs PROGRESS-013…027; RELAPSE-007/008/011 vs PROGRESS-022/023/020.

WHY: Same metrics on two screens; density may differ by design but the label stem, unit spelling, and time-window wording drift beyond density.

PREFERRED DIRECTION: Identical metric label stems on both screens; hints may differ in length (snapshot = shortest form) but must use the same unit words and the same window phrasing; one abbreviation policy for minute units.

### C-8. Night-protocol names

CURRENT FORMS: «بروتوكول الليل» · «بروتوكول ما قبل النوم» · «بروتوكول الوقت المتأخر» · «قواعدك الليلية»

AFFECTED IDs: PLAN-018, PLAN-005, PLAN-004, TRIGGER-012, KB sl-protocol, TAX-010 night.

WHY: One concept family (pre-sleep/late-night protection) named four ways; users cannot tell if these are the same routine.

PREFERRED DIRECTION: One canonical name for the plan item + deliberate, clearly-scoped names for the KB card and the device guide IF they are meant to be different artifacts — with the relationship (same routine vs complementary tools) made explicit in the copy structure. (Scope decision belongs to K-21.)

### C-9. The re-run-check labels

CURRENT FORMS: «فحص جديد» vs «أعد الفحص»

AFFECTED IDs: URGE-024 vs HOME-014.

WHY: Same action (re-run the Urge Check) labeled with two different verb strategies on two surfaces.

PREFERRED DIRECTION: One verb strategy for "run the check again" (either a fresh-noun or a repeat-verb form), reused on both surfaces.

### C-10. The deep-reading label

CURRENT FORMS: «قراءة أعمق (اختياري)» vs «قراءة أعمق»

AFFECTED IDs: DOSE-008 vs KNOWLEDGE-014.

WHY: The same optional disclosure block in two render sites; only the «(اختياري)» suffix differs.

PREFERRED DIRECTION: Identical label in both sites (the optionality is structural, not textual).

### C-11. Numeral system (visible vs accessibility)

CURRENT FORMS: «من ٥» (visible) vs «من 5» (aria); «الخطوة {n} من 4» (visible, Latin 4) vs «خطوة {current} من {total}» (aria, Latin); Arabic-Indic in most copy vs Latin in «100%», «2.2.0», «.json», «~{n} دقيقة», export filename.

AFFECTED IDs: SHARED-014, PLAN-030, EMERGENCY-005/006, URGE-016, TAX-010 (safesearch), SETTINGS-033, OTHER-004.

WHY: The same value rendered in two numeral systems between what sighted users see and what screen readers announce; mixed systems inside single surfaces.

PREFERRED DIRECTION: One numeral system for all user-visible text (including aria), with a documented exception list for technical tokens (file extensions, version numbers, filenames, protocol names) — plus one clock-format rule («٥ص–١٢م» vs «بعد ١٠ مساءً»).

### C-12. The paste-verb spelling

CURRENT FORMS: «أو الصق محتوى النسخة يدويًا» vs «ألصق محتوى ملف JSON هنا…»

AFFECTED IDs: BACKUP-004 vs BACKUP-005.

WHY: Two hamza spellings of the same imperative inside one widget.

PREFERRED DIRECTION: One orthographic form of the imperative (both are attested; pick one convention) applied to both strings.

### C-13. The tagline

CURRENT FORMS: «نظام شخصي لاستعادة التحكم» vs «نظام شخصي للتحكم»

AFFECTED IDs: ONBOARDING-002, OTHER-001 vs SHARED-003.

WHY: Brand one-liner drifting between long and short forms across onboarding, document title, and sidebar.

PREFERRED DIRECTION: One canonical tagline (long form for brand surfaces; the sidebar either quotes it fully or drops the tagline slot rather than shortening it differently).

### C-14. The spiritual-gate name

CURRENT FORMS: «المحتوى الروحي» · «المحتوى الروحي/القيمي» · «القيم والروحانيات» · «تأمل قيمي وروحي» · «تأمل روحي» · «روحي»

AFFECTED IDs: VALUES-015/016/017, SETTINGS-011/013, VALUES-001, SHARED-001, ONBOARDING-031, KB-000 spiritual, KNOWLEDGE-008, TAX-016.

WHY: One opt-in gate with different names on every surface that discovers or displays it.

PREFERRED DIRECTION: One canonical gate name for the toggle/card/settings surfaces; the nav label and the content-category chip may keep their own granularity but should share the same head-word with the gate; a stated policy for slash forms («الروحي/القيمي»).

### C-15. Completion & skip particles

CURRENT FORMS:
- Completion: «أُنجزت اليوم ✓» · «أنجزت جرعة اليوم» · «أُنجزت» · «مُخطاة» · «أُنجزت الليلة ✓ — شكرًا لصدقك» · «حُفظ ✓» · «نُسخ ✓» · «تمت الاستعادة بنجاح» · «أُضيفت القاعدة إلى خطة الوقاية…»
- Skip: «مُخطاة اليوم» · «خطّيت جرعة اليوم» · «التخطي ليس فشلًا» · «لا بأس — يمكنك تخطي أي جرعة»

AFFECTED IDs: HOME-030, DOSE-009/019/020, PLAN-023, VALUES-008, SETTINGS-020, BACKUP-014, RELAPSE-062, DOSE-003/010/013/014, PLAN-048.

WHY: One communicative function (confirm a logged outcome) spread across passive participles (أُنجزت، مُخطاة، حُفظ، نُسخ، أُضيفت), active second-person (أنجزت), nominal (تمت), and mixed checkmark placement; the skip state mixes passive (مُخطاة) and colloquial first-person (خطّيت).

PREFERRED DIRECTION: A stated particle policy — e.g., one grammatical voice for logged outcomes (with the ✓ glyph used consistently or not at all) and one register for the skip-state sentence — applied across dose, check-in, values, settings, backup, and rule confirmations.

### C-16. Empty-state structure

CURRENT FORMS: «لا X بعد» + body · «لا X بعد — guidance» single line · «لا نتائج» + body · «نحتاج قليلًا من السجل أولًا» + body · bare sentence «لم تسجل محفزات في فحوصاتك بعد.»

AFFECTED IDs: RELAPSE-013/014, PREVENT-005, KNOWLEDGE-006/007, TRIGGER-004/005, TRIGGER-014, PROGRESS-032.

WHY: Five empty states with five structures for the same communicative job.

PREFERRED DIRECTION: One structural pattern (headline + one-sentence action path) with register freedom inside the body; the "need data" flavor may keep its own headline verb family but should match the pattern.

### C-17. The risk-triad formulation

CURRENT FORMS: «السرير + الجهاز + وقت متأخر» (IV-014) · «ليل + وحدة + جهاز» (KB-006 title) · «وقت متأخر + وحدة + جهاز» (TAX-010 night)

AFFECTED IDs: IV-014 why, KB-006 (title «الثلاثية الأشهر: ليل + وحدة + جهاز»), TAX-010 night guide.

WHY: The app's signature risk formula stated with three different first elements (bed vs night vs late time) — users meeting it three times cannot know if the triad changed.

PREFERRED DIRECTION: One canonical triad (element order + element wording) quoted verbatim wherever the formula appears; peripheral copy may elaborate but not re-formulate it.

---

# D. Voice & Register Map

## D-0. The implicit system (what the distribution shows)

Counting colloquial markers («مش», «دلوقتي», «اللي», «إيه», «لسه», «ما تكملش», «متعاقبش», «متدورش»…) across the inventory: **31 lines in the interactive UI layer, 4 in the 98 knowledge cards, 0 in the 28 intervention items** (line hits; several lines contain multiple markers). The distribution is not random:

- **Egyptian colloquial concentrates on high-stress, direct-to-action, and home/vernacular surfaces**: Home state banners + Quick Guide, Urge Check verdicts, Emergency standing instructions, STOP steps, reframe messages, support-message templates.
- **MSA concentrates on reference, configuration, legal/ethical, and educational surfaces**: Settings, Backup validators, Prevention guides, Plan items, Onboarding questions, Progress framing, all 98 KB cards (essentially light MSA), all 28 IV cards (fully MSA).

This looks like a **deliberate register system** (stress → familiar language; calm/reference → standard language), already noted in Phase 2A D1. Phase 2B's job is not to flatten it but to codify it and find the accidental breaks.

## D-1. Egyptian colloquial — inventory of evidence

High-stress / direct-to-action:
- HOME-006 «أنت مستقر دلوقتي — مش محتاج أي تدخل.» · HOME-007 «خد جرعة اليوم واختار مهمة واحدة من خطتك — ده كفاية.» · HOME-009 «رغبة بدأت تبني… خطوة قطع صغيرة دلوقتي بتكفي غالبًا قبل ما تكبر.» · HOME-012 «اللي محتاجه دلوقتي خطوة قطع واحدة — مش حل شامل.» · HOME-015 «رجعت للسلوك؟ ما تكملش — نوقف هنا الأول» · HOME-016 «بعد التعثر — المهم دلوقتي: ما تكمّلش» · HOME-017 «التعثر مش بيمسح اللي اتعلمته — والمراجعة الهادئة تنتظرك لما تهدى.»
- HOME-019 «دليلك السريع — أعمل إيه دلوقتي؟» · HOME-022/024/026 «بدأت رغبة؟» «قربت تتصرف؟» «رجعت للسلوك؟» · HOME-021 «خد جرعة اليوم» · HOME-028 «كل أداة ليها وقتها — استخدم اللي محتاجه دلوقتي.»
- URGE-002 «بدأت الرغبة؟ افحص اللي حاصل — عشان تعرف أنسب خطوة. الرغبة إحساس، مش أمر.» · URGE-013 «التقديرات دي منك عن لحظتك… مش قياس طبي ولا تنبؤ مضمون.» · URGE-018 «الدرجة دي تقدير… تساعدك تختار خطوتك، ومش قياس طبي ولا تنبؤ مضمون.» · URGE-019 «ولا حاجة ملحّة دلوقتي — أكمل يومك الطبيعي.» · URGE-020 «ما تطعمهاش بانتباه زايد، واكمل يومك.» · URGE-025 «اقطعها الآن وهي لسه صغيرة» · URGE-026 «ما تحللش دلوقتي — ابدأ التدخل فورًا.» · URGE-037 «الخطر هبط ولا لسه؟» · URGE-039 «الموجة دي مسجّلة وبتتحسب ليك» · URGE-041 «نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام» · URGE-043 «لا عقاب ولا جلد — المهم دلوقتي: ما تكمّلش»
- EMERGENCY-003 «ما تحللش دلوقتي.» · EMERGENCY-010 «ومش لازم تخبر حد بأي حاجة.» · EMERGENCY-023 «سجّلنا إنك تعاملت مع الموجة — وده بيتراكم في مؤشراتك.» · EMERGENCY-026 «رجعت للسلوك؟ ما تكملش — نوقف هنا الأول»
- RELAPSE-002 «رجعت للسلوك؟ ما تكملش — إيقاف فوري، وبعدها نفهم اللي حصل بهدوء.» · RELAPSE-024 «ما تكملش — الوقفة هنا أهم خطوة.» · RELAPSE-025 (all six STOP steps: «أغلق اللي قدامك الآن», «متدورش على «بديل»», «متعاقبش نفسك», «التحليل بعدين لما تهدى — دلوقتي: توقف وبس») · RELAPSE-039 («الحدث ده مش بيحدد مستقبلك… ما بترجعش للصفر… تعثر واحد مش يوم ضايع») · RELAPSE-041 «وقفت — وكل وقفة بتتحسب ليك» · RELAPSE-042 «لما تكون مستعدًا.» · RELAPSE-046 «الهدف مش «ليه أنا ضعيف» — الهدف: نلاقي أبكر نقطة كان ممكن توقف عنها.»
- TAX-001 level 3 «وهي لسه صغيرة» · TAX-002 mode label flavor via URGE-017 rendering · TAX-012 support templates (fully Egyptian: «محتاج أقعد معاك شوية، عندك وقت؟» «يومي تقيل شوية — نتمشى سوا؟» «متوفر دلوقتي؟ أبي أفرّغ كلام كتير.»)
- ONBOARDING-004 value prop («توقف السلوك قبل ما يبدأ… من غير أحكام») and ONBOARDING-040 variant A («مش محتاج تسيب جهازك») — colloquial inside otherwise-MSA onboarding.

## D-2. Light MSA / standard Arabic — inventory of evidence

- Onboarding questions & options: ONBOARDING-011…034 (e.g. ONBOARDING-012 «اختر كل ما ينطبق — هذا يساعدنا على تخصيص نظامك.», ONBOARDING-018 «اختيارات عامة — لا حاجة لأي تفاصيل صريحة.»)
- Plan items: PLAN-012–019 («انهض مبكرًا بما يكفي», «لا تصفح في أول ٣٠ دقيقة», «حدد مهمة اليوم»)
- Prevention: PREVENT-002 «قواعد «إذا… إذن» وحمايتك الرقمية — تُصنع في الهدوء لتعمل وقت العاصفة.» · PREVENT-016 «لن يُكشف له أي شيء تلقائيًا؛ الرسائل محايدة تمامًا.»
- Settings & backup: SETTINGS-002…033, BACKUP-001…032 (pure MSA; validator strings are heavily nominal MSA)
- Progress framing: PROGRESS-002 «مؤشرات متعددة صادقة — لا نسبة تعافٍ زائفة…», PROGRESS-033
- Knowledge library: 98 cards, light MSA with an occasional colloquial idiom (see D-3 case 9)
- Intervention library: 28 cards, fully MSA (instructions are MSA imperatives — «أغلق التبويب…», «اتجه لأي مكان آخر…»)
- Disclaimers (MSA branch): HOME-049, TRIGGER-017, SETTINGS-032, TAX-016, TAX-008

## D-3. Mixed register inside the SAME flow — the critical cases

Each classified **INTENTIONAL / ACCEPTABLE**, **INCONSISTENT / NEEDS DECISION**, or **UNCLEAR** per the Phase 2B brief. No rewrites.

**Case 1 — Emergency overlay mixes registers within one screen.**
Header: EMERGENCY-003 «ما تحللش دلوقتي.» (Egyptian) beside EMERGENCY-004 «نفّذ الخطوة الحالية فقط.» (MSA-flavored imperative). Step instructions: EMERGENCY-008 «أغلق كل التبويبات والتطبيقات غير المتصلة بمهمتك — أبقِ مهمة العمل وحدها.» (MSA) while EMERGENCY-010 «اخرج من المكان لأي مكان فيه ناس أو حركة — ومش لازم تخبر حد بأي حاجة.» mixes an MSA imperative with an Egyptian tail. Done screen EMERGENCY-023 opens MSA («ارجع ليومك الطبيعي.») and closes Egyptian («وده بيتراكم في مؤشراتك»).
Classification: **INCONSISTENT / NEEDS DECISION** — one overlay, four register combinations; a defensible alternative reading is "procedural steps in MSA for precision, framing lines in Egyptian for warmth", but the copy does not consistently follow that split (EMERGENCY-010's tail breaks it). The product owner must state the intended rule for instruction text under stress.

**Case 2 — The crisis verdict flips to MSA at the peak of stress.**
URGE-030 «أزمة فورية — لا تقرأ أكثر. اضغط الزر وابدأ أول خطوة قطع الآن.» (MSA) — while the same result phase's level-3/4 verdicts are Egyptian (URGE-025 «اقطعها الآن وهي لسه صغيرة», URGE-026 «ما تحللش دلوقتي»).
Classification: **INCONSISTENT / NEEDS DECISION** — the one moment where comprehension speed matters most is the one place the register flips away from the familiar mode. (Possibly deliberate brevity engineering; possibly accidental.)

**Case 3 — Home high banner: MSA header over Egyptian body.**
HOME-011 «درجة حالتك مرتفعة في آخر فحص» (MSA) directly above HOME-012 «اللي محتاجه دلوقتي خطوة قطع واحدة — مش حل شامل.» (Egyptian).
Classification: **UNCLEAR** — could be a deliberate "reading/label in MSA, guidance in Egyptian" pattern; only one banner pair exists to prove it.

**Case 4 — Dose skip state shifts register mid-sentence.**
DOSE-010 «خطّيت جرعة اليوم — إن أردت إنجازها فهي نفسها أمامك، وإلا فالجرعة القادمة بانتظارك غدًا.» — opens with the colloquial verb «خطّيت» then shifts to formal conditional structure («إن أردت… وإلا فـ…»).
Classification: **INCONSISTENT / NEEDS DECISION** — the register changes inside a two-sentence state message; either mode would work alone.

**Case 5 — Onboarding summary compresses two registers into one line.**
ONBOARDING-040 variant A: «حماية الطوارئ: «وضع العمل الآمن» جاهز — مش محتاج تسيب جهازك.» — MSA label + Egyptian clause; its sibling variant B («حماية الطوارئ: تدخلات ابتعاد عن الجهاز عند الخطر.») is fully MSA.
Classification: **UNCLEAR** — variant asymmetry suggests the colloquial clause was added for warmth without a rule.

**Case 6 — Onboarding welcome: colloquial warmth inside an MSA wizard.**
ONBOARDING-004 «نظام شخصي يساعدك تفهم لحظاتك الصعبة وتوقف السلوك قبل ما يبدأ — بخطوات عملية، من غير أحكام.»
Classification: **INTENTIONAL / ACCEPTABLE** — a single warm pitch line in an otherwise standard flow; reads as deliberate on-brand tone-setting.

**Case 7 — STOP flow headers vs quick-log subtitle.**
STOP flow heading/sub-steps are Egyptian (RELAPSE-002/023/024/025), but the quick-log subtitle RELAPSE-030 «دقيقة واحدة — بلا تفاصيل صريحة. البيانات تصنع خريطتك.» is MSA-flavored («بلا», nominal «البيانات تصنع»), and the reframe body RELAPSE-039 is Egyptian again.
Classification: **UNCLEAR** — the alternation tracks screen-vs-inline more than stress level.

**Case 8 — Support templates (Egyptian) inside Prevention (MSA).**
TAX-012 templates render inside the MSA Prevention screen (PREVENT-023).
Classification: **INTENTIONAL / ACCEPTABLE** — these are messages the *user* sends to a *friend*; they must sound like real speech, not product copy.

**Case 9 — Colloquial idiom inside an MSA knowledge card.**
KB sl-consistency understand block: «…يرتب عليه نع نهار وسمسرة ليل — وسمسرة الليل بالذات ليست في صالحك.» (Egyptian idiom inside an otherwise light-MSA card).
Classification: **UNCLEAR** — memorable flavor vs register leak; the knowledge library otherwise avoids dialect.

**Case 10 — The internal voice quotes in different dialects.**
TAX-001 level-3 examples quote the user's inner voice in Egyptian («مرة واحدة مش هفرق», «آخر مرة وأوقف»); TAX-006 quotes mostly MSA inner speech («سأنظر دقيقة واحدة فقط», «سأبدأ غدًا», «لا أستطيع») with one Egyptian («مرة واحدة لن تضر» is MSA; «أنا مسيطر على الأمر» MSA); KB-061 quotes Gulf colloquial («انسَ الموضوع», «الحين ما له داعي»).
Classification: **INCONSISTENT / NEEDS DECISION** — the "negotiating voice" changes dialect between surfaces; if the voice is meant to feel like the user's own thoughts, one dialect policy is needed.

**Case 11 — Disclaimers split by register.**
«مش قياس طبي ولا تنبؤ مضمون» (URGE-013/018, Egyptian) vs «ليست تشخيصًا طبيًا…» (HOME-049), «ليست تشخيصًا» (TRIGGER-017), «ليس تشخيصًا ولا علاجًا طبيًا ولا بديلًا عن مختص» (SETTINGS-032), «ليست علاجًا طبيًا ولا ادعاءً علميًا» (TAX-016) — one legal-ethical function, two registers.
Classification: **INCONSISTENT / NEEDS DECISION** (as a family) — each instance individually fits its surface's register, so this is really the register-zone decision (K-05) applied to disclaimers: follow the surface, or use one fixed formula everywhere.

**Case 12 — Settings screen stays uniformly MSA, including intimate phrasing.**
PREVENT-017 «سمّه ما شئت (أخي، صديقي…)» etc.
Classification: **INTENTIONAL / ACCEPTABLE** — configuration surface, standard register throughout.

## D-4. Register summary

The current system can be stated as: **Egyptian for the moment of use (stress, action, home chrome warmth); MSA for the moment of reflection (settings, science, configuration, errors)** — with the 28 intervention cards as MSA islands inside Egyptian-adjacent flows (Urge intervention phase header URGE-033/034 is MSA-neutral: «نفّذ التدخل» / «خطوة واحدة فقط — لا تحتاج حل كل شيء الآن»). The breaks worth deciding are Cases 1, 2, 4, 10, 11 (+ 3, 5, 7, 9 as UNCLEAR). Nothing here says "convert everything to one register" — the evidence supports codifying the split, not flattening it.

---

# E. Proposed Voice Rules

Rules for how the app should speak. **No replacement sentences.** These are the constraints Phase 2C should write against; several depend on open decisions (K-index) and are marked accordingly.

1. **Stress-register rule** *(pending K-05)*: copy that must be executed under stress (emergency steps, crisis verdicts, STOP steps, high banners) uses the register the user processes fastest — short, familiar, direct — and does not switch register mid-flow; reflective/reference copy (settings, science, validators, guides) may use standard Arabic.
2. **One action per instruction line**: any instruction the user must execute while distressed contains exactly one imperative and no subordinate reasoning; the "why" lives in collapsible/darker surfaces (whyItHelps, KB), never inline in the step.
3. **Crisis copy is minimal-reading**: at level 5, the number of words before the first button is treated as a cost; every word must be operational.
4. **Buttons are verbs**: CTAs use direct action language («افعل X»), never sentences, never nouns-as-verbs; the acknowledgment family («تم») stays reserved for step-advance, not for saves.
5. **The app speaks to one person**: second-person address everywhere the user acts; the app never addresses a group; masculine agreement is the documented default unless K-16 decides otherwise.
6. **Calm is a first-class tone**: the calm/quiet concept family (A-30) keeps its current consistency; calm-context copy is allowed to be slower and warmer than stress copy.
7. **Dignity rule (existing, to be preserved)**: no shame, no fear-based or dramatic language anywhere; anti-shame framing accompanies every relapse-adjacent surface; self-compassion language is never framed as leniency (KB framing «الرحمة بالذات ليست تساهلًا» is the pattern).
8. **No unsourced clinical claims**: clinical/technical terms appear only where functionally necessary (when-to-seek-help list, KB science cards with hedged language «تشير بعض الأبحاث»); the UI layer avoids clinical vocabulary (K-17 governs the two onboarding chips).
9. **Concrete over abstract**: when a concrete physical phrase exists for an action (stand up, leave the room, close the tab), it wins over an abstract nominalization (performing an environmental intervention).
10. **Metaphor governance** *(pending K-24)*: the established metaphor inventory (السلسلة chain, الموجة wave, المصدر source, القطع cut, الجرس/المرساة anchor, النمط pattern) is closed — Phase 2C introduces no new competing metaphor for an existing concept, and the chain/loop/cycle boundary rule is applied.
11. **Feature names are fixed phrases**: a feature's name is a quoted fixed phrase used verbatim on every surface (guillemets where the current convention uses them); no surface coinages a second name for a shipped feature (this is the rule that would have prevented «وضع الأزمة»/«نقطة التدخل الأفضل»/«التصعيد» drift).
12. **Numbers follow the numeral policy** *(pending K-08)*: one numeral system for user-visible text including aria; technical tokens (`.json`, versions, filenames) are the only Latin-script exceptions.
13. **Forecast vs prediction stays contrastive** (A-28): «توقّع» is always the app's prepared forecast; «تنبؤ» is only ever negated.
14. **System actions have one voice** *(pending K-06)*: whatever person the app uses for "what we/the app/the system did or will do with your data" (نحن / التطبيق / النظام / passive), it is one convention per context class, not per string.
15. **Completion language follows the particle policy** *(pending K-18)*: logged-outcome confirmations share one grammatical voice and one ✓ convention.
16. **Disclaimers are a family** *(pending K-22)*: not-medical / not-a-prediction / not-a-diagnosis notes derive from one canonical formula set, in the register their zone allows.
17. **Punctuation convention**: em-dash for appends, Arabic comma, ellipsis only in placeholders, guillemets for fixed feature phrases — applied uniformly (Phase 2A D9 details).

---

# F. Person / Voice Consistency

## F-1. The dominant voice: direct second person (implicit «أنت», masculine agreement)

Nearly all guidance addresses the user through imperatives and second-person verbs: «أغلق», «سجّل», «اختر», «ارجع ليومك». Explicit «أنت» appears rarely for emphasis: HOME-006 («أنت مستقر دلوقتي»), TAX-001 level 5 («أنت عند نقطة التنفيذ نفسها»), KB cards («أنت تلعب لعبة صُممت لتخسرها»). Masculine agreement throughout: «مستعدًا» (RELAPSE-044, RELAPSE-042), «جاهزًا» (TAX/KB), «وحدك» implied.
Classification: **intentional / standard Arabic convention**; the only open question is the gender-address decision (K-16).

## F-2. «نحن» (first-person plural — the app as companion)

- Onboarding promises: ONBOARDING-012 («هذا يساعدنا على تخصيص نظامك»), ONBOARDING-023 («سنجهّز تدخلات لا تتطلب ترك الجهاز»), ONBOARDING-024 («سنطلب منك التأكيد وقت الحاجة»), ONBOARDING-025 («سنفضّل تدخلات الابتعاد عن الجهاز»), ONBOARDING-035/036 («جهّزنا خطتك الأولى», «حددنا سياقات الخطر… وبنينا»)
- Data confirmations: EMERGENCY-023 («سجّلنا إنك تعاملت مع الموجة»), RELAPSE-040 («سجّلنا التعثر ومؤشراتك محفوظة»)
- Future behavior: URGE-032 («سنعرض لك خطوات قليلة وواضحة فقط»)
- Preference statement: DOSE-016 («نفضّل موضوعات التعثر والعودة»)
- Encouragement: URGE-041 («نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام»)
- Shared action: HOME-015 / EMERGENCY-026 («نوقف هنا الأول»)
Classification: **acceptable in context** (companion tone; the "we" is the app, not a company — but see K-06: for a serverless local-first app, "we" implies an observing party, which conflicts with the privacy promise's "no one else is involved" subtext).

## F-3. «التطبيق» (third person — the app as object)

- TRIGGER-005 («سيبدأ التطبيق برسم أنماطك»), SETTINGS-033 («استعادة · نسخة {version} · يعمل محليًا بالكامل»), SETTINGS-032 («هذا التطبيق أداة مساعدة ذاتية سلوكية — ليس تشخيصًا…»), BACKUP-026 («هذا التطبيق يدعم الإصدار {m}»), SHARED-032 («هذا التطبيق يحتاج تشغيل جافاسكربت…»)
Classification: **acceptable in context** (disclaimers, version line, system explanations) — but it *alternates with «نحن»* for functionally identical "the system did/will do X" statements (سجّلنا vs سيبدأ التطبيق), which is the inconsistency to resolve (K-06).

## F-4. «النظام» (third person — the mechanism)

- URGE-041 («جزء من النظام»), TRIGGER-016 («النظام سيرجّحه تلقائيًا في المقترحات»), ONBOARDING-002/004 («نظام شخصي…» — brand sense), ONBOARDING-012 («نظامك» — the user's system)
Classification: **UNCLEAR / needs decision** — «النظام» as the recommender-mechanism voice appears twice; the same surfaces elsewhere say «نحن» or nothing. Note «النظام» also means the OS in TAX-010 («تُدار من النظام نفسه») — a genuine polysemy collision inside Prevention copy.

## F-5. Impersonal / passive

- SETTINGS-004 («محفوظة في متصفحك فقط… لا تغادر جهازك أبدًا»), ONBOARDING-006/042 («يُخزن محليًا», «ستُخزن»), BACKUP-012 («سيُطلب تأكيدك»), PREVENT-016 («لن يُكشف له أي شيء»), VALUES-014 («تُحفظ هذه المسودة»), DOSE-015 («اختيرت هذه الجرعة»)
Classification: **acceptable** — passive is the natural register for data/privacy statements; it coexists with «نحن» confirmations without a stated rule (K-06).

## F-6. The person map (summary table)

| Context class | Current voice | IDs | Verdict |
|---|---|---|---|
| Instructions to act | implicit أنت imperative | everywhere | intentional |
| Onboarding promises | نحن | ONBOARDING-012/023/024/025/035/036 | acceptable; decision needed vs 3rd person |
| Data confirmations | نحن (سجّلنا) + passive (حُفظ، أُنجزت) mixed | EMERGENCY-023, RELAPSE-040 vs VALUES-008, DOSE-019 | inconsistent — K-06/K-18 |
| Future system behavior | نحن (سنعرض) + التطبيق (سيبدأ) + النظام (سيرجّحه) | URGE-032 vs TRIGGER-005 vs TRIGGER-016 | inconsistent — K-06 |
| Disclaimers | التطبيق 3rd person / impersonal | SETTINGS-032, BACKUP-026, TAX-016 | acceptable |
| Encouragement under stress | نحن (نجرّب، نوقف) | URGE-041, HOME-015 | acceptable; align with F-2 rule |
| Preference statements | نحن (نفضّل) | DOSE-016 | acceptable |

**F-7. Gender note**: the app's address is uniformly masculine-singular (standard Arabic default). No feminine forms exist anywhere in user-facing copy (checked: «مستعدًا», «جاهزًا», «وحدك»-family). Whether to keep the default or move toward gender-neutral constructions is a product decision (K-16), not a copywriter's call.

---

# G. High-Priority Terminology Conflicts

Only conflicts that materially affect user understanding, emotional tone, navigation, the meaning of a feature, or consistency between the emergency/urge/relapse flows.

### G-1. «مراجعة» names two different features and shares one save button

CONFLICT: The evening check-in (المراجعة المسائية) and the relapse calm review (مراجعة هادئة) are different features, but the head-word is identical, the save button is identical («حفظ المراجعة»), and two counters pluralize the same word for different quantities («سلسلة المراجعات» counts evenings; «مراجعات هادئة بانتظارك» counts relapse reviews).

CURRENT FORMS: «المراجعة المسائية» / «مراجعة هادئة» / «مراجعات هادئة بانتظارك» / «سلسلة المراجعات» / «حفظ المراجعة» (×2) / «حلّل»

AFFECTED IDs: PLAN-022/023/024/027/046, RELAPSE-004/005/019/044/045/065, HOME-046, HOME-017, PROGRESS-009/011, TRIGGER-010, RELAPSE-042, IV-017, BACKUP-030.

WHY IT MATTERS: The two features ask for different effort at different emotional moments; a user told «حفظ المراجعة» or «المراجعة» alone cannot know which ritual is meant; the streak metric's name silently includes only one of them.

DECISION NEEDED: K-03 (feature naming + button + metric).

### G-2. The seeded rule references a degree the app never displays

CONFLICT: «إذا: وصلت درجة الرغبة ٣ من ٥ → إذن: أبدأ خطوة قطع فورًا» (PREVENT-032) — but the number the app shows everywhere is labeled «درجة الحالة» (EMERGENCY-006, URGE-015, PREVENT-014, PROGRESS-030), while «شدة الرغبة» is the name of input dimension 1 (URGE-003). «درجة الرغبة» matches neither exactly.

CURRENT FORMS: «درجة الرغبة ٣ من ٥» vs «درجة الحالة: {n} من ٥» vs «شدة الرغبة»

AFFECTED IDs: PREVENT-032 vs EMERGENCY-006, URGE-003/015/016, PREVENT-014, PROGRESS-016/030, TAX-001.

WHY IT MATTERS: A user trying to follow their own prevention rule cannot determine which number to watch — the urgency-intensity answer, or the composite result. This is a comprehension failure inside the app's core loop (rule → check → act).

DECISION NEEDED: K-02 (canonical degree vocabulary + rule wording).

### G-3. Level-5 has three names in one handoff

CONFLICT: «أنسب خطوة الآن: وضع الأزمة» (TAX-002 via URGE-017) → button «تدخّل الآن — وضع الطوارئ» (URGE-031) → overlay «وضع الطوارئ … درجة الحالة: 5 من ٥ — أزمة» (EMERGENCY-001/006/007).

CURRENT FORMS: «وضع الأزمة» (mode label) / «وضع الطوارئ» (overlay + CTA) / «أزمة» (badge suffix) / «أزمة فورية» (URGE-030) / «أثناء أزمة (درجة الحالة ٥)» (PREVENT-014)

AFFECTED IDs: TAX-002, URGE-017/030/031, EMERGENCY-001/006/007, PREVENT-014, KB «قاعدة الأزمة» title.

WHY IT MATTERS: The most acute moment in the product is described with three names in three consecutive UI elements; users (and any future support/documentation) cannot name the crisis experience consistently.

DECISION NEEDED: K-04.

### G-4. «التصعيد» is promised in Prevention but never named in the overlay

CONFLICT: PREVENT-016 promises «يظهر زر اتصاله في التصعيد» — the overlay's escalated step is titled «تدخل أقوى» (EMERGENCY-014) with the support box under «إن أمكن فورًا:» (EMERGENCY-016); the word «تصعيد» appears nowhere in the emergency flow (only in IV-027's name).

CURRENT FORMS: «في التصعيد» vs «تدخل أقوى» / «إن أمكن فورًا:»

AFFECTED IDs: PREVENT-016, EMERGENCY-014/016/021, IV-027, URGE-041.

WHY IT MATTERS: A feature promise whose name does not exist at the point of fulfillment — the user configures a support person for "the escalation" and then meets an unnamed stage; navigation/meaning failure across surfaces.

DECISION NEEDED: K-10.

### G-5. The relapse event has two UI names and two library names

CONFLICT: Screens log and count «تعثر»; the calm-review wizard interrogates «الحدث/الحادثة»; the knowledge library teaches «الزلة» vs «الانتكاس» as a distinction; the reframe message says «الحدث ده».

CURRENT FORMS: «تعثر» / «الحدث», «الحادثة» / «الزلة», «الانتكاس» / «رجعت للسلوك؟»

AFFECTED IDs: RELAPSE-012/013/039/041/049/051/053, HOME-003/016/017, PROGRESS-007/020, DOSE-016, KB-061/062/064, KB abstinence-violation card, TAX-006.

WHY IT MATTERS: The Stop flow, its review wizard, and the educational layer use different words for the same lived event; KB-061's زلة/انتكاس lesson cannot be applied by a user whose app says تعثر everywhere.

DECISION NEEDED: K-01.

### G-6. The cut-point concept has three names across three linked surfaces

CONFLICT: «نقطة القطع (الأفضل)» (review wizard + KB + progress hint) vs «نقطة التدخل الأفضل» (Trigger Map) vs «أبكر نقطة تقدر توقف عندها» (Trigger Map subtitle/disclaimer, review subtitle, KB).

CURRENT FORMS: «نقطة القطع» / «نقطة التدخل الأفضل» / «أبكر نقطة»

AFFECTED IDs: RELAPSE-055/056/060, TRIGGER-003/006/009/010/017, PROGRESS-023 hint, RELAPSE-046, KB-062, KB-0653.

WHY IT MATTERS: The product's central actionable insight (the earliest intervention point) is taught, asked, and displayed under three names; connecting the review → rule → map loop depends on recognizing them as one thing.

DECISION NEEDED: K-09.

### G-7. Register flips at the crisis verdict and mixes inside the emergency overlay

CONFLICT: URGE-030 (crisis, MSA: «أزمة فورية — لا تقرأ أكثر…») vs URGE-025/026 (level 3–4, Egyptian); EMERGENCY-003 (Egyptian) beside EMERGENCY-004/008 (MSA) with EMERGENCY-010's mixed tail; EMERGENCY-023 opening MSA and closing Egyptian.

CURRENT FORMS: see D-3 cases 1–2 (full strings).

AFFECTED IDs: URGE-025/026/030, EMERGENCY-003/004/008/010/023, HOME-011/012, DOSE-010.

WHY IT MATTERS: Emotional tone and comprehension speed at the highest-stress moments; the register system that works everywhere else breaks exactly where it matters most.

DECISION NEEDED: K-05 (register-zone rule + the specific cases).

### G-8. Sister answer-pairs in the Urge and Emergency flows drift in person, gender, and punctuation

CONFLICT: «لا، لسه مرتفعة» + «نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام» (URGE-040/041) vs «لا — لسه مرتفع: جرّب تدخلًا أقوى» (EMERGENCY-021); «نعم، هبطت» (URGE-038) vs «نعم — هبط» (EMERGENCY-020).

CURRENT FORMS: (above)

AFFECTED IDs: URGE-038/040/041 vs EMERGENCY-020/021.

WHY IT MATTERS: The same decision point in the app's two sister flows (post-intervention reassessment) is phrased differently in person (نجرّب/جرّب), gender agreement (مرتفعة/مرتفع — Phase 2A D10's referent drift between الدرجة and الخطر), and dash style — users doing both flows in one session see the inconsistency back-to-back.

DECISION NEEDED: K-23.

### G-9. The work-safe mode is named once and never again

CONFLICT: ONBOARDING-022/040 promise «وضع العمل الآمن»; the emergency overlay's work-safe branch (EMERGENCY-008 + TAX-009) and the urge toggle (URGE-011) never name it.

CURRENT FORMS: «وضع العمل الآمن» vs unnamed branch («أغلق كل التبويبات والتطبيقات غير المتصلة بمهمتك…») vs «أحتاج الجهاز الآن للعمل/الدراسة»

AFFECTED IDs: ONBOARDING-022/023/025/040, EMERGENCY-008, TAX-009, URGE-011, IV-018.

WHY IT MATTERS: A configured, promised feature the user cannot recognize when it activates — feature-meaning failure for a persona (device-dependent users) the app specifically onboarded.

DECISION NEEDED: K-16.

### G-10. Screen-reader names diverge from visible text (and one English leak)

CONFLICT: SHARED-007 announces «تدخل الآن — وضع الطوارئ» (no shadda) for a button visibly labeled «تدخّل الآن»; SHARED-014/PLAN-030 announce «من 5» (Latin) where the screen shows «من ٥»; EMERGENCY-005 shows «الخطوة {n} من 4» (Latin 4) beside EMERGENCY-006's «من ٥» (Arabic-Indic); and the shadcn dialog/sheet default close buttons announce English «Close» alongside Arabic content (Phase 2A G-6) — the More sheet has both an Arabic «إغلاق» (SHARED-010) and an English-named close button.

CURRENT FORMS: «تدخل» vs «تدخّل»; «5» vs «٥»; «Close» vs «إغلاق».

AFFECTED IDs: SHARED-007, SHARED-014, PLAN-030, EMERGENCY-005/006, SHARED-010, plus library-default buttons in src/components/ui/dialog.tsx & sheet.tsx (Phase 2A G-6).

WHY IT MATTERS: For screen-reader users the announced app is a different app: different spelling of the SOS phrase, different numerals, and occasional English — an accessibility parity gap on the single most important control (SOS).

DECISION NEEDED: K-07 (spelling/aria parity) + K-08 (numerals) + K-26 (library-default buttons scope).

### G-11. Privacy promise drift

CONFLICT: Six+ variants of the core trust message with wording drift (A-21/C-5), including the جهاز/متصفح alternation.

CURRENT FORMS: (A-21 list).

AFFECTED IDs: SHARED-004, ONBOARDING-006/042, SETTINGS-002/004, HOME-049, PLAN-047.

WHY IT MATTERS: The privacy promise is the app's positioning; inconsistent repetition weakens the very assurance it exists to make.

DECISION NEEDED: K-12.

---

# H. Duplicate / Near-Duplicate Analysis

Working from the Phase 2A duplicate section (~33 groups). Classifications: **exact & intentional** / **exact, different contexts** / **near-duplicate** / **probably unify** / **should remain separate**. Nothing is merged in code.

### H-1. «تدخّل الآن» — 7 render sites
SHARED-005, SHARED-006, SHARED-011, HOME-013, HOME-025, EMERGENCY-002 (+ prose mention KNOWLEDGE-003; extended variant URGE-031).
→ **exact & intentional** (a global SOS affordance must be identical everywhere). The near-member is SHARED-007's aria spelling (no shadda) — **probably unify** with the visible string (K-07).

### H-2. «رجعت للسلوك؟ ما تكملش — نوقف هنا الأول» — HOME-015 = EMERGENCY-026
→ **exact & intentional** (the same bridge copy deliberately planted on both post-urgency surfaces). Keep.

### H-3. «توقّف هنا» — SHARED-001 (nav) + HOME-018/027 (CTAs) + RELAPSE-001 (screen title)
→ **exact, different contexts** (nav label / button / title). Intentional unity of the feature's name — keep identical.

### H-4. «اعرف / افهم / افعل / تذكّر» — DOSE-004/005/006/007 = KNOWLEDGE-010/011/012/013
→ **exact & intentional** (parallel card anatomy). The deep-reading label drifts («قراءة أعمق (اختياري)» vs «قراءة أعمق») → **probably unify** (C-10).

### H-5. «المراجعة المسائية» — PLAN-022 = PLAN-027
→ **exact & intentional** (card + dialog of one feature). Keep.

### H-6. «حفظ المراجعة» — PLAN-046 vs RELAPSE-065
→ **exact, different contexts — should NOT remain identical** (two different features; the shared label is the G-1 collision). **Needs decision** (K-03): differentiate, not merge.

### H-7. «جملة واحدة تكفي…» — PLAN-035 = RELAPSE-058
→ **exact, different contexts** (lesson input in two wizards). Acceptable as-is; if K-03 differentiates the wizards' save labels, this placeholder may stay shared (same input semantics) — **should remain separate decision from H-6**.

### H-8. Completion & skip particles — HOME-030, DOSE-009/019/020/003/010, PLAN-023, VALUES-008, SETTINGS-020, BACKUP-014, RELAPSE-062
→ **near-duplicate family** — passive participles vs active vs nominal vs colloquial first-person («خطّيت»). **Probably unify** under a particle policy (K-18); the ✓ convention needs one rule.

### H-9. «تراجع» — SETTINGS-029 = BACKUP-019
→ **exact & intentional** (dialog-cancel convention). Keep.

### H-10. «اتصل بـ{label}» — PREVENT-021 = EMERGENCY-017
→ **exact & intentional** (same action, two surfaces). Keep.

### H-11. «ما الذي بدأ الأمر؟» — URGE-012 vs RELAPSE-031 vs RELAPSE-047
→ **near-duplicate** (suffixes differ by surface). **Intentional variants** — keep; the head question is stable.

### H-12. Metric labels across screens — HOME-041/043, PROGRESS-013/015, RELAPSE-007/010, PROGRESS-022/019
→ **exact labels, drifting hints/units** (A-19). **Probably unify** hints/units or codify the density pair (K-11).

### H-13. «لماذا أفعل هذا؟» — ONBOARDING-032 = VALUES-003 (+ SHARED-001 desc)
→ **exact & intentional** (the same question across onboarding, screen, nav). Keep.

### H-14. «استعادة» (brand) — ONBOARDING-001/003, SHARED-002/031, SETTINGS-033, OTHER-001/003
→ **exact & intentional**. Keep. (Tagline drift is C-13.)

### H-15. BACKUP-028 — «السجلات اليومية غير صالحة في النسخة.» returned by two different validators
→ **exact duplicate (code-level), different failure causes**. Acceptable for users (rare errors), ambiguous for support triage — **near-duplicate, low priority**; differentiation optional.

### H-16. «توقفت فورًا» — RELAPSE-015 (option) vs RELAPSE-041 («توقفت فورًا — استجابة ممتازة»)
→ **near-duplicate, intentional** (option vs confirmation). Keep.

### H-17. «استمرت الجلسة» — RELAPSE-016 (badge) vs RELAPSE-035 (chip «نعم، استمرت الجلسة»)
→ **exact & intentional** (same concept, log view vs input view). Keep.

### H-18. Escalation / success answer pairs — URGE-038/040/041 vs EMERGENCY-020/021
→ **near-duplicate** (G-8). **Probably unify** (one canonical pair + one escalation sentence shape) — K-23.

### H-19. Privacy family — 6+ variants
→ **near-duplicate** (G-11/C-5). **Probably unify** to canonical short + long forms — K-12.

### H-20. Degree display trio — EMERGENCY-006 vs URGE-015/016 vs HOME-011
→ **near-duplicate** (C-3). **Probably unify** the reading label stem; keep the banner's predicative form only if derived from the same stem — K-02.

### H-21. «خد جرعة اليوم» — HOME-021 vs HOME-007 (prefix)
→ **near-duplicate, intentional** (short action label vs full guidance sentence). Keep.

### H-22. Rule-naming family — «قاعدة وقاية جديدة» (PREVENT-025) vs «قاعدة وقاية مقترحة» (RELAPSE-059) vs «قواعدي «إذا… إذن»» (PREVENT-003)
→ **near-duplicate family**. «جديدة» (user-created) vs «مقترحة» (system-suggested) is a **real distinction — should remain separate**; the possessive header «قواعدي» is a register variant (P3).

### H-23. Backup error family — BACKUP-002 vs BACKUP-021 («تعذر قراءة الملف — …» shared opening) vs BACKUP-022/023
→ **near-duplicate** (Phase 2A D18). **Probably unify** by differentiating the opening or the consequence clause per failure class — P2 wording polish.

### H-24. «الملف غير صالحة/غير صالح.» fallback (BACKUP-013) vs specific errors (BACKUP-021…032)
→ **intentional fallback design** — keep (specific error shown when available).

### H-25. Return-to-day family — URGE-039, EMERGENCY-023/024, RELAPSE-043
→ **near-duplicate** (C-6). **Probably unify** the action phrase — K-18-adjacent; low priority.

### H-26. Re-run check — «فحص جديد» (URGE-024) vs «أعد الفحص» (HOME-014)
→ **near-duplicate** (C-9). **Probably unify** — P3.

### H-27. Empty-state structures — 5 patterns (Phase 2A D13)
→ **structural near-duplicate** (C-16). **Probably unify** the pattern — P3.

### H-28. «مساء الخير» covering two time branches (code-level duplicate)
→ **exact & intentional** (same string reused). Keep.

### H-29. Time-to-stop options — RELAPSE-015 chips + log badges
→ **exact & intentional** (shared vocabulary object). Keep.

### H-30. «نعم — ونجح» (PLAN-033) vs «نجح {n} مرة» (TRIGGER-016, PROGRESS-031)
→ **different contexts** (answer option vs metric display). Keep separate.

### H-31. Night-protocol trio — PLAN-018 vs KB sl-protocol vs TAX-010 night (+ PLAN-004/005 references)
→ **near-duplicate family with scope ambiguity** (A-16/C-8). **Needs scope decision** (K-21) before any unification.

### H-32. Risk-triad formulations — IV-014 vs KB-006 vs TAX-010
→ **near-duplicate** (C-17). **Probably unify** the canonical triad — P3 but pedagogically valuable.

### H-33. Praise family — «أحسنت» (HOME-004, EMERGENCY-022) vs «استجابة ممتازة» (RELAPSE-041) vs «شكرًا لصدقك» (PLAN-023) vs «وقفت — وكل وقفة بتتحسب ليك» (RELAPSE-041)
→ **intentional variety** (different emotional moments). **Should remain separate**; codify as allowed-variety family (P4).

---

# I. Translated-Sounding / Awkward Expressions

Genuine issues only — structural awkwardness that reads like direct translation, broken derivation, or defective copy. **No rewrites.** Two probable typos are reported for confirmation only (I-13, I-14).

**I-1.**
CURRENT: «نسخة النسخة الاحتياطية (إصدار {n}) غير مدعومة — هذا التطبيق يدعم الإصدار {m}.»
ID: BACKUP-026.
WHY IT FEELS TRANSLATED / AWKWARD: The genitive «نسخة النسخة» duplicates the same noun — an attempt to say "the backup's schema version" compressed into a double noun; the first «نسخة» is redundant and the sentence requires re-reading.
TYPE: awkward noun construction (duplication).

**I-2.**
CURRENT: «كم الوقت الحر غير المنظم؟»
ID: PLAN-042.
WHY: Word order calques "how much unstructured free time?" — the quantifier precedes a two-adjective noun phrase in a way Arabic would not naturally produce («كم لديك من وقت حر غير منظم؟»-family structures are the natural shape).
TYPE: unnatural word order (literal translation).

**I-3.**
CURRENT: «استخدام مكثف للجهاز»
ID: TAX-013 (vulnerability factor chip).
WHY: A full nominal (masdar + adjective + prepositional phrase) among sibling chips that are all short adjective/noun compounds («قلة نوم», «سهر متأخر», «وحدة») — the odd one out structurally, reads like a translated survey item.
TYPE: awkward noun construction / inconsistent list grammar.

**I-4.**
CURRENT: «يظهر الآن: ممارسات في «القيم والروحانيات»، وبطاقات «تأمل روحي» في قاعدة المعرفة، وقد تُختار في الجرعة اليومية والتدخلات.»
ID: SETTINGS-013.
WHY: One line, three clauses, nested guillemets, and a passive tail («وقد تُختار في…») whose subject is unclear (what may be chosen — the cards? the practices?).
TYPE: unclear conversational phrasing; overly formal tail.

**I-5.**
CURRENT: «أزمة فورية — لا تقرأ أكثر. اضغط الزر وابدأ أول خطوة قطع الآن.»
ID: URGE-030.
WHY: «لا تقرأ أكثر» is a negative instruction calquing "don't read any more" (Arabic would more naturally limit the noun, not the verb of reading); the sentence also mixes a negative prohibition with a positive command in minimal-reading context.
TYPE: literal translation + negative/positive mix.

**I-6.**
CURRENT: «صُغها بعمق — ستجد موضوع «القيم» في قاعدة المعرفة.»
ID: VALUES-010.
WHY: The second clause is a dangling reference — «موضوع «القيم»» presumes a named KB topic; as written it reads like a doc cross-reference pasted into guidance.
TYPE: unclear conversational phrasing (dangling reference).

**I-7.**
CURRENT: «سيظهر هذا في اختيار جرعتك اليومية.»
ID: ONBOARDING-030.
WHY: Stiff demonstrative-passive («سيظهر هذا») — a UI-mechanics sentence in translationese register next to sibling subtitles that speak plainly.
TYPE: overly formal.

**I-8.**
CURRENT: «حماية الطوارئ: تدخلات ابتعاد عن الجهاز عند الخطر.»
ID: ONBOARDING-040 (variant B).
WHY: «تدخلات ابتعاد عن الجهاز» is a three-noun pileup (interventions of distancing from the device) — compressed bureaucratic derivation where the sibling variant A speaks in clauses.
TYPE: awkward noun construction.

**I-9.**
CURRENT: «عند درجة ٣ أو أقل — خلال ٣٠ يومًا»
ID: PROGRESS-016 (hint).
WHY: Two elliptical fragments joined by a dash with no verb; the metric definition depends on the reader supplying both relationships (level condition + time window).
TYPE: unclear conversational phrasing (fragment compression). (Also feeds C-7.)

**I-10.**
CURRENT: «أكثر وقت يحتاج حماية: {bucketLabel} — خطّط له مبكرًا (قواعد «إذا… إذن» وبروتوكول الليل).»
ID: TRIGGER-012.
WHY: «أكثر وقت يحتاج حماية» calques "the time most in need of protection" — comparative + verb + object in an order Arabic would restructure; the parenthetical then stacks two feature names.
TYPE: unnatural word order (mild).

**I-11.**
CURRENT: «فحص الرغبة ثلاثي الأبعاد»
ID: ONBOARDING-039.
WHY: «ثلاثي الأبعاد» is the standard Arabic term for *3-dimensional* (graphics/cinema); using it for "three-part assessment" is a coinage that can read as a literal translation of "three-dimensional check" and amuse or confuse.
TYPE: terminology mismatch (borrowed technical term).

**I-12.**
CURRENT: «يومك في الرحلة ومحفزاتك الأخيرة. الرحلة تنظيم للمحتوى، لا وعدًا زمنيًا.»
ID: DOSE-017.
WHY: The first sentence is two noun fragments spliced («يومك في الرحلة ومحفزاتك الأخيرة») with no verb — telegraphic, reads like a truncated translation of "based on your journey day and recent triggers"; the second sentence's «لا وعدًا زمنيًا» is elegant but the pair is disjointed.
TYPE: unclear conversational phrasing (fragment compression).

**I-13.** *(probable typo — report for confirmation only)*
CURRENT: «…الكمية المستهدفة جيدة، لكن العطر الأهم: نفس الموعد.»
ID: KB sl-consistency (understand block; verified verbatim in src/data/app/knowledge-wellbeing.ts).
WHY: «العطر الأهم» ("the more important perfume") is semantically alien here — likely a corrupted metaphor or wrong word (an intended "الأمر الأهم"-type phrase); a reader stumbles exactly on the sentence's punch word. The same block also contains the dialect idiom «نع نهار وسمسرة ليل» (register note, D-3 case 9).
TYPE: terminology mismatch / probable typo (needs product-owner confirmation of intent).

**I-14.** *(probable typo — report for confirmation only)*
CURRENT: «أكمل الجملة بثلاث إجابات: «أنا شخص يقوم يوميًا بـ…» — واجعلها صدقة.»
ID: KB-6705 card (act block; verified verbatim in src/data/app/knowledge-recovery.ts).
WHY: «واجعلها صدقة» ("make it charity") — in context almost certainly intended as «اجعلها صادقة» ("make them honest"); one letter changes the meaning entirely.
TYPE: probable typo (needs product-owner confirmation).

**I-15.**
CURRENT: «حالة إكمال التهيئة غير صالحة في النسخة. · قوائم التهيئة غير صالحة في النسخة. · …» (36 field-hint family)
ID: BACKUP-027/028/030.
WHY: Validator strings are chains of abstract nominalizations («إكمال التهيئة», «قوائم التهيئة») never used by the visible UI («التهيئة» names onboarding only in ONBOARDING-010 «بلا تهيئة من جديد»); users meeting these errors after a failed import face vocabulary the app never taught them.
TYPE: overly formal + terminology mismatch (validator-speak vs UI vocabulary).

**I-16.**
CURRENT: «حدوده:» (rendered label) with limits text like «يمكن تجاوزها بالإضافة أو المتصفح الآخر…»
ID: PREVENT-013 + TAX-010.
WHY: The masculine «حدوده» has no explicit referent (the guide title? the tool?), while several guides' names are feminine («حاجبات المواقع», «تصفية DNS») and their limits text uses feminine pronouns («تجاوزها», «تُبطئ… وتُتجاوز») — the label and the body disagree in gender within one visual line.
TYPE: unclear conversational phrasing (referent/gender mismatch). (P4.)

---

# J. Priority Summary

Product/language priorities (P0 → P4). This ranks language issues only; it is not a quality ranking of the app.

### P0 — user meaning / product ambiguity
1. **«مراجعة» overload** — evening check-in vs calm review; shared save button; two counters (G-1 → K-03).
2. **«درجة الرغبة» in the seeded rule vs «درجة الحالة» displays + «شدة الرغبة» dimension** (G-2 → K-02).

### P1 — major terminology inconsistency
3. Level-5 triple naming: «وضع الأزمة» / «وضع الطوارئ» / «— أزمة» (G-3 → K-04).
4. Relapse event noun: «تعثر» / «الحدث» / «الزلة» / «الانتكاس» across UI + library (G-5 → K-01).
5. Cut-point triple naming: «نقطة القطع» / «نقطة التدخل الأفضل» / «أبكر نقطة» (G-6 → K-09).
6. «التصعيد» promised in Prevention, unnamed in the overlay (G-4 → K-10).
7. System-action person: «نحن» vs «التطبيق» vs «النظام» vs passive (F-2…F-6 → K-06).
8. Work-safe mode named once (onboarding), never at activation (G-9 → K-16).
9. Spiritual gate naming across four word-bases (A-24 → K-14).

### P2 — voice/register inconsistency
10. Register flip at the crisis verdict (URGE-030) + mixed register inside the emergency overlay + DOSE-010 mid-sentence shift (G-7 → K-05).
11. Sister answer-pairs drift: person + gender agreement + dash (G-8 → K-23).
12. Screen-reader/visible parity: shadda, numerals, English «Close» (G-10 → K-07/K-08/K-26).
13. Privacy family drift (G-11 → K-12).
14. Metric label/hint/unit drift Home vs Progress (A-19 → K-11).
15. Internal-voice quote dialect variance (TAX-001 Egyptian vs KB-061 Gulf vs TAX-006 MSA) (D-3 case 10 → K-22).
16. Numeral system in visible text (٥/5, clocks, 100%, «~{n} د») (→ K-08).
17. Night-protocol family naming (A-16 → K-21).
18. Disclaimer family register split (A-31/D-3 case 11 → K-22-adjacent).

### P3 — wording polish
19. Tagline drift (→ K-13).
20. «تدخل/تدخّل» orthography (→ K-07).
21. Backup error family openings (H-23).
22. «ألصق/الصق» (C-12).
23. Deep-reading label drift (C-10).
24. «فحص جديد/أعد الفحص» (C-9).
25. Empty-state patterns (C-16).
26. Completion/skip particle family (C-15 → K-18).
27. Urge-scale anchor wording drift URGE-003 vs PLAN-029 (→ K-20).
28. Probable KB typos («العطر الأهم», «اجعلها صدقة») (I-13/I-14 → K-25).
29. Theme-name asymmetry («ليلي هادئ»/«نهاري»).
30. «حدوده:» gender referent (I-16).
31. «تسجيل سريع» polysemy (RELAPSE-029 vs IV-024).

### P4 — optional stylistic refinement
32. Hard-times metaphor family constraint (A-29).
33. KB dialect idiom «نع نهار وسمسرة ليل» (D-3 case 9).
34. Praise-family variety (H-33) — codify as allowed variety.
35. «ثلاثي الأبعاد» coinage (I-11).
36. Punctuation/typography micro-rules (Phase 2A D9: ✓ placement, ellipsis, guillemets consistency).

---

# K. Decisions Required From Product Owner

Every terminology or voice decision that **cannot safely be made by the implementation AI**. For each: the concept, the current options on the table (not chosen), affected IDs, and the question. No final Arabic is selected here.

**K-01 — The relapse event noun.**
CONCEPT: What the app calls one instance of the behavior (A-2/G-5).
CURRENT OPTIONS: (a) «تعثر» everywhere in UI, library keeps زلة/انتكاس as pedagogical pair; (b) «تعثر» everywhere including KB rewrite of the زلة/انتكاس lesson; (c) adopt the KB pair into the UI (single event vs pattern return); (d) keep the two-word UI split («تعثر» chrome + «الحدث» wizard) as a codified register rule.
AFFECTED IDs: RELAPSE-012/013/039/041/049/051/053, HOME-003/016/017, PROGRESS-007/020, DOSE-016, BACKUP-009, KB-061/062/064, TAX-006.
QUESTION FOR PRODUCT OWNER: Which noun is the canonical user-facing word for the event, and should the KB's زلة/انتكاس distinction be mirrored in UI labels or stay content-level?

**K-02 — Degree vocabulary.**
CONCEPT: The composite 1–5 number and its neighbors (A-5/G-2).
CURRENT OPTIONS: (a) «درجة الحالة» canonical; reword the seeded rule to reference it; (b) «درجة الحالة» canonical; reword the rule to reference the *urge-check verdict* without a number; (c) rename the composite to a «درجة الرغبة»-family term (touches every degree display); plus, for reassessment questions: standardize referent on «الخطر» or on «الدرجة» (fixes the مرتفعة/مرتفع agreement drift).
AFFECTED IDs: EMERGENCY-006/007, URGE-015/016/018, HOME-011, PREVENT-014, PREVENT-032, URGE-003, PROGRESS-016/030, TAX-001, URGE-037/038/040, EMERGENCY-019/020/021.
QUESTION: Which term is the canonical name of the number the user sees, and which referent do reassessment questions use?

**K-03 — The two «مراجعة» features.**
CONCEPT: Evening check-in vs calm review naming (A-13/G-1).
CURRENT OPTIONS: (a) keep both names, differentiate only the shared save button and the two counters; (b) rename one feature outright (e.g., a "closing the day"-family name vs an "understanding"-family name); (c) keep names but qualify every unqualified «مراجعة» occurrence; plus the verb «حلّل»'s status; plus «سلسلة المراجعات» metric naming.
AFFECTED IDs: PLAN-022…047, RELAPSE-004/005/019/044/045/065, HOME-046, HOME-017, PROGRESS-009/011, TRIGGER-010, RELAPSE-042, IV-017, BACKUP-030.
QUESTION: How should the two features be named so that «المراجعة» alone is never ambiguous — and what happens to the shared «حفظ المراجعة» button?

**K-04 — Level-5 naming.**
CONCEPT: Crisis mode naming (A-7/G-3).
CURRENT OPTIONS: (a) «وضع الأزمة» becomes the official name of the level-5 experience and the overlay adopts it at level 5; (b) one overlay name «وضع الطوارئ» with «أزمة» as the level marker only (retire «وضع الأزمة» from TAX-002 in favor of a crisis-level label); (c) keep all three forms and treat them as one feature's register variants (documented).
AFFECTED IDs: TAX-002, URGE-017/030/031, EMERGENCY-001/006/007, PREVENT-014.
QUESTION: Is level 5 a distinct mode with its own name, or the crisis level of the one emergency mode?

**K-05 — Register policy.**
CONCEPT: The Egyptian/MSA split (D).
CURRENT OPTIONS: (a) codify the observed system (stress → familiar register; reference → standard) and fix only the breaks (URGE-030, overlay step register, DOSE-010); (b) all-stress-surfaces familiar register including URGE-030 and overlay steps; (c) instructions always standard Arabic for precision, framing lines familiar; plus the disclaimer-family register question.
AFFECTED IDs: URGE-025/026/030, EMERGENCY-003/004/008/010/023, HOME-011/012, DOSE-010, ONBOARDING-040, URGE-013/018, HOME-049, SETTINGS-032, TAX-016, TRIGGER-017.
QUESTION: What is the intended register rule for (1) emergency step instructions, (2) the level-5 verdict, (3) disclaimers?

**K-06 — System-action voice.**
CONCEPT: Who narrates system actions (F).
CURRENT OPTIONS: (a) «نحن» for confirmations and promises, passive for data statements, 3rd-person «التطبيق» only for disclaimers (a documented split); (b) all system actions passive/impersonal; (c) all «نحن»; (d) all «التطبيق». Note the tension: for a local-first app, «نحن» implies an observing party.
AFFECTED IDs: ONBOARDING-012/023/024/025/035/036, URGE-032/041, DOSE-016, EMERGENCY-023, RELAPSE-040, HOME-015/EMERGENCY-026, TRIGGER-005/016, SETTINGS-032/033, BACKUP-026.
QUESTION: One convention per context class for who speaks when the app describes what it did/will do?

**K-07 — «تدخّل الآن» orthography & aria parity.**
CONCEPT: The SOS fixed phrase (A-6/H-1/G-10).
CURRENT OPTIONS: (a) shadda form «تدخّل الآن» everywhere including aria (fix SHARED-007); (b) plain «تدخل الآن» everywhere; (c) shadda on the CTA, plain for the generic noun (current state) — but then aria must copy the visible CTA form.
AFFECTED IDs: SHARED-005/006/007/011, HOME-013/025, URGE-031, EMERGENCY-002, KNOWLEDGE-003, PLAN-032, URGE-028/033/034, TRIGGER-009/016, BACKUP-011/030.
QUESTION: Which orthographic form is canonical for the SOS phrase, and is the generic noun allowed to differ?

**K-08 — Numeral & clock policy.**
CONCEPT: ٥ vs 5, clock formats, percentages, tildes (C-11).
CURRENT OPTIONS: (a) Arabic-Indic for all user-visible + aria text; Latin only for technical tokens (`.json`, versions, filename); (b) Latin digits everywhere; (c) current mixed state codified. Includes clock format choice («٥ص–١٢م» vs «بعد ١٠ مساءً») and «100%»/«~{n} دقيقة» conventions.
AFFECTED IDs: SHARED-014/016, PLAN-030, EMERGENCY-005/006, URGE-016, TAX-010, TAX-018, URGE-008, SETTINGS-033, OTHER-004, PROGRESS-023, RELAPSE-008.
QUESTION: Which numeral system (and clock format) is canonical for visible text and for screen-reader text?

**K-09 — Cut-point canonical name.**
CONCEPT: «نقطة القطع» / «نقطة التدخل الأفضل» / «أبكر نقطة» (C-1/G-6).
CURRENT OPTIONS: (a) unify on the «قطع»-family compound (matches خطوة قطع + the cut metaphor); (b) unify on the «تدخل»-family compound (matches تدخل metric vocabulary); (c) keep «أبكر نقطة» as the explanatory phrase but one compound as the artifact name.
AFFECTED IDs: RELAPSE-055/056/060, TRIGGER-003/006/009/010/017, PROGRESS-023, RELAPSE-046, KB-062, KB-0653.
QUESTION: What is the one name of the earliest-intervention-point artifact?

**K-10 — «التصعيد» naming.**
CONCEPT: Escalation stage naming (A-8/G-4).
CURRENT OPTIONS: (a) name the stage in the overlay (escalated step header adopts a تصعيد-family title, support box follows); (b) reword PREVENT-016 to promise the button "in the stronger-intervention step" without the word تصعيد; (c) keep IV-027's name as the only usage and document it.
AFFECTED IDs: PREVENT-016, EMERGENCY-014/016/021, IV-027, URGE-041.
QUESTION: Where does the word «التصعيد» live — in the overlay, or nowhere?

**K-11 — Metric labels & hints (Home vs Progress).**
CONCEPT: The honest-metrics presentation (A-19/C-7).
CURRENT OPTIONS: (a) identical labels + identical hints on both screens; (b) identical labels, snapshot hints = strict prefix of Progress hints (codified density rule); (c) current state as-is. Includes unit abbreviation («دقيقة» vs «د») and window wording («أسبوع» vs «٧ أيام»).
AFFECTED IDs: HOME-041…048 vs PROGRESS-013…027, RELAPSE-007/008/011 vs PROGRESS-022/023/020.
QUESTION: Unify or codify the snapshot/detail pair — and with which unit conventions?

**K-12 — Privacy promise canon.**
CONCEPT: The local-first promise (A-21/C-5/G-11).
CURRENT OPTIONS: (a) one short line + one long paragraph, all surfaces quote them; (b) per-surface rephrasing allowed but جهاز/متصفح rule fixed; (c) current drift accepted. Includes whether «متصفحك» (technically precise) or «جهازك» (simpler) is the canonical locator.
AFFECTED IDs: SHARED-004, ONBOARDING-005/006/042, SETTINGS-002/004, HOME-049, PLAN-047, VALUES-014, PREVENT-018, SETTINGS-033, SHARED-032, OTHER-002.
QUESTION: What are the canonical short and long privacy statements, and which locator word is standard?

**K-13 — Tagline.**
CONCEPT: «نظام شخصي لاستعادة التحكم» vs «نظام شخصي للتحكم» (C-13).
CURRENT OPTIONS: (a) long form canonical everywhere; (b) short form canonical; (c) long form brand surfaces + no tagline in the sidebar slot.
AFFECTED IDs: ONBOARDING-002, OTHER-001, SHARED-003.
QUESTION: Which tagline form is the brand string?

**K-14 — Spiritual gate naming.**
CONCEPT: The opt-in gate's name (A-24/C-14).
CURRENT OPTIONS: (a) «المحتوى الروحي» canonical for gate + toggle + settings; nav «القيم والروحانيات» and KB category «تأمل روحي» keep their granularity but the decision documents the relationship; (b) rename gate to match the nav label; (c) drop slash forms and pick one compound. Includes whether «روحانيات» (nav) survives at all.
AFFECTED IDs: VALUES-001/002/015/016/017, SETTINGS-011/013, ONBOARDING-031, SHARED-001, KB-000 spiritual, KNOWLEDGE-008, TAX-016.
QUESTION: What is the gate's canonical name, and what is the slash-form policy?

**K-15 — Brand vs process vs restore.**
CONCEPT: «استعادة» (brand) vs «التعافي» (process) vs «استعادة النسخة» (restore action) (A-18).
CURRENT OPTIONS: (a) codify the three-way split (brand / process / restore) as intended; (b) restore flows shift to a «استيراد/نسخة احتياطية» vocabulary that avoids the brand verb; (c) process copy shifts toward the brand word.
AFFECTED IDs: ONBOARDING-002, OTHER-001/002, SHARED-003, HOME-049, PROGRESS-002, DOSE-014, KB recovery cards, TAX-008, BACKUP-014/015/016/020, ONBOARDING-009/010, SETTINGS-022.
QUESTION: Is the three-way use of «استعادة» intended, and should backup flows avoid it?

**K-16 — Gender address & work-safe naming.**
CONCEPT: (1) Masculine-default address (F-7); (2) work-safe mode recognition (A-17/G-9).
CURRENT OPTIONS: (1) keep masculine default (standard) / move to neutral constructions where cheap; (2) name «وضع العمل الآمن» inside the overlay branch / reword the onboarding promise to behavior / keep implicit.
AFFECTED IDs: (1) RELAPSE-042/044, TAX-001, all imperative copy; (2) ONBOARDING-022/040, EMERGENCY-008, TAX-009, URGE-011, IV-018.
QUESTION: Keep the masculine default? And does the work-safe branch get its name in the overlay?

**K-17 — Clinical vocabulary in onboarding.**
CONCEPT: «سلوك جنسي قهري», «توجيه نفسي/سلوكي», «استراتيجيات عملية مباشرة» (Phase 2A D17).
CURRENT OPTIONS: (a) keep precise clinical chips (self-identification value); (b) simplify to plain-language chips; (c) keep clinical terms but add a plain-language gloss in the subtitle.
AFFECTED IDs: ONBOARDING-013, ONBOARDING-031.
QUESTION: Do the onboarding option chips keep clinical precision or trade it for accessibility?

**K-18 — Completion, skip & praise particles.**
CONCEPT: Logged-outcome confirmations (C-15/H-8) and the return-to-day family (C-6).
CURRENT OPTIONS: (a) passive participle + uniform ✓ rule («أُنجزت ✓»-family); (b) active second-person («أنجزتَ»-family); (c) nominal («تمّت»-family); plus one skip-state register («مُخطاة» vs «خطّيت»); plus one return-to-day pair (imperative + button).
AFFECTED IDs: HOME-030, DOSE-003/009/010/019/020, PLAN-023, VALUES-008, SETTINGS-020, BACKUP-014, RELAPSE-062, URGE-039, EMERGENCY-023/024, RELAPSE-043.
QUESTION: Which grammatical voice and ✓ convention confirms logged outcomes, and which register states a skip?

**K-19 — Empty-state pattern.**
CONCEPT: The five structures (C-16/H-27).
CURRENT OPTIONS: (a) headline + one-sentence action path everywhere; (b) keep «لا X بعد» family for lists + «نحتاج…» family for data-gated screens (two documented patterns); (c) current state.
AFFECTED IDs: RELAPSE-013/014, PREVENT-005, KNOWLEDGE-006/007, TRIGGER-004/005/014, PROGRESS-032.
QUESTION: One empty-state pattern or two documented ones?

**K-20 — Urge-scale anchors.**
CONCEPT: URGE-003 («هادئة تقريبًا · أقصى ما أعرفه») vs PLAN-029 («بالكاد وجدت · أقصى ما وصلت له») for the same 1–5 construct.
CURRENT OPTIONS: (a) identical anchors on both scales (in-the-moment and evening recall); (b) keep different anchors deliberately (recall vs live wording) and document it; (c) align only the top anchor.
AFFECTED IDs: URGE-003, PLAN-028/029/030.
QUESTION: Same anchors for the same construct on both surfaces, or a documented live/recall pair?

**K-21 — Night-protocol family.**
CONCEPT: «بروتوكول الليل» / «بروتوكول ما قبل النوم» / «بروتوكول الوقت المتأخر» / «قواعدك الليلية» (A-16/C-8/H-31).
CURRENT OPTIONS: (a) one canonical name for the plan item; KB card and device guide keep scoped names that reference the canonical one; (b) merge all three into one named concept; (c) keep three and add explicit cross-references in copy.
AFFECTED IDs: PLAN-004/005/018, TRIGGER-012, KB sl-protocol, TAX-010 night.
QUESTION: How many distinct night concepts does the product intend, and what are their names?

**K-22 — Internal-voice dialect & disclaimer formula set.**
CONCEPT: (1) The quoted "negotiating voice" dialect (Egyptian TAX-001 vs Gulf KB-061 vs MSA TAX-006); (2) the disclaimer family register (A-31/D-3 case 11).
CURRENT OPTIONS: (1) one dialect for all quoted inner speech (Egyptian matches the app's stress register) / per-surface dialect freedom documented; (2) disclaimers follow surface register (current) / one fixed formula everywhere.
AFFECTED IDs: (1) TAX-001 L3/L4 examples, TAX-006 all quotes, KB-061; (2) URGE-013/018, HOME-049, TRIGGER-017, SETTINGS-032, TAX-016, TAX-008.
QUESTION: Which dialect does the internal negotiating voice speak, and do disclaimers follow the surface register or one formula?

**K-23 — Sister answer-pairs.**
CONCEPT: URGE-038/040/041 vs EMERGENCY-020/021 (G-8/H-18).
CURRENT OPTIONS: (a) one canonical pair + one escalation sentence used by both flows; (b) keep per-flow wording but fix person/gender agreement to one pattern; (c) current state documented.
AFFECTED IDs: URGE-038/040/041, EMERGENCY-020/021.
QUESTION: Do the urge outcome phase and emergency step 4 share answer labels — and in which person/gender agreement?

**K-24 — Streak & metaphor governance.**
CONCEPT: «سلسلة المراجعات» (positive streak) vs «السلسلة» (danger metaphor) vs حلقة/دورة boundaries (A-20/A-23).
CURRENT OPTIONS: (a) rename the streak metric off the «سلسلة» word; (b) keep and document the polysemy; plus codify chain/loop/cycle boundary rules for Phase 2C.
AFFECTED IDs: PROGRESS-009/010, TAX-006, IV-001/014, TRIGGER-006/010, OTHER-002, RELAPSE-025/021, KB habit/cycle cards.
QUESTION: May the positive streak keep the chain word, and what are the fixed metaphor boundaries?

**K-25 — Probable KB typos (confirmation of intent).**
CONCEPT: «العطر الأهم» (KB sl-consistency) and «واجعلها صدقة» (KB-6705 card) (I-13/I-14).
CURRENT OPTIONS: (a) confirm as unintended defects → queue corrections for Phase 2C; (b) confirm as intended (unlikely) → document as deliberate wordplay.
AFFECTED IDs: KB sl-consistency understand block; KB-6705 act block.
QUESTION: Are these two wordings intended? (No correction is applied in 2B either way.)

**K-26 — Uncertain-item disposition (from Phase 2A G).**
CONCEPT: Whether the following count as copy surfaces for Phase 2C scope: the splash initials tile «اس» (SHARED-030); the never-rendered BOREDOM_MENU (TAX-019) and WORK_SAFE_PRINCIPLE (TAX-020); the never-rendered TRIGGER_CATEGORIES.hint (TAX-004); the Latin export filename (OTHER-004); the library-default English «Close» buttons in dialogs/sheets (Phase 2A G-6); the settings fields without UI (postRelapseSupport, notificationsEnabled).
CURRENT OPTIONS: include in 2C scope / exclude as non-copy / fix only the accessibility leak (English «Close»).
AFFECTED IDs: SHARED-030, TAX-019/020, TAX-004, OTHER-004, SHARED-010 (context), src/components/ui/dialog.tsx & sheet.tsx default buttons.
QUESTION: Which of these are in scope for the language pass, and is the English «Close» accessibility leak approved for fixing in 2C?

---

*End of Phase 2B report. No source files were modified; no inventory entries were edited; no terminology decisions were implemented. All Arabic strings quoted verbatim from `phase2a-copy-inventory.md` (and, where noted, verified read-only against source). The decisions above (K-01…K-26) are the required input for Phase 2C.*
