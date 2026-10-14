# PHASE 2A — Arabic Copy Inventory — Istiaada (استعادة)

**READ-ONLY AUDIT. No code was modified, no copy rewritten.**
Generated 2026-09-21. This file is the source of truth for Phase 2 copy decisions.

**ID scheme (stable for all of Phase 2):**
`HOME-### · ONBOARDING-### · DOSE-### · PLAN-### · URGE-### · EMERGENCY-### · RELAPSE-### · PREVENT-### · TRIGGER-### · PROGRESS-### · VALUES-### · KNOWLEDGE-### · SETTINGS-### · SHARED-### · BACKUP-### · TAX-### · KB-### · IV-### · OTHER-###`

Dynamic slots inside a string are written `{n}` / `{label}` etc. — the literal interpolation is documented in STATE/CONDITION or PURPOSE. Every CURRENT TEXT is copied verbatim from source (no normalization, no fixes).

---

## A. Audit Scope

Inspected (complete source surface of the app, excluding `src/components/ui/**` shadcn primitives — unused library defaults with no app-specific copy):

- All 12 screens + onboarding + emergency overlay + splash: HomeScreen, DoseScreen, PlanScreen (incl. Evening Check-in dialog), UrgeScreen, EmergencyMode (incl. done/escalated/step variants + PersonalWhy + EmergencyFrame), RelapseScreen (main/stop/quick/reframe/review views), PreventionScreen (incl. rule dialog), TriggerMapScreen (empty + full states), ProgressScreen, ValuesScreen (incl. values draft), KnowledgeScreen (incl. card dialog + empty state), SettingsScreen (incl. import + wipe dialogs), Onboarding (welcome + 8 steps)
- Global chrome: AppShell (desktop sidebar, bottom nav, More sheet, SOS buttons), shared.tsx (ScreenHeader, Chip, NumberScale, ToggleRow, StatTile, EmptyState, InfoNote, StepDots, CheckItem), Timer/Countdown, InterventionCard, AppRoot/SplashScreen (+ noscript)
- Backup/restore: RestoreBackup component (file + paste flows, preview, confirm gate, result banners) and every Arabic error string in backup.ts validators
- Content libraries (machine-extracted verbatim by script, see B.13/B.11/B.15): taxonomy.ts (21 entries), knowledge-core/wellbeing/recovery (98 cards), interventions.ts (28 interventions), helpers.ts (greeting + time buckets), progress.ts (forecast messages + insight parts), store.ts (4 seeded prevention rules)
- Browser metadata: layout.tsx title/description/applicationName/keywords; export filename
- Accessibility strings: every `aria-label` / `aria-label` template / role label found
- Conditional states covered: home 4 states, urge 5 modes + 4 phases, emergency 4 steps + escalated + done + maximum(crisis) + workSafe on/off, relapse 5 views, dose done/skipped/fresh, spiritual ON/OFF, plan 3 modes + check-in done/pending, knowledge search-empty/category filters, trigger-map empty/full, backup valid/invalid/too-big/replaced-confirm/success, onboarding all 9 steps + canNext disabled states

NOT inspected / not applicable: `src/components/ui/**` (shadcn defaults, no app copy — e.g. `Sheet` close buttons are icon-only with library English `aria-label`s where Radix defaults apply — flagged in G), `src/hooks/**` (no user-facing strings), `mini-services/`, `examples/`, `tests/` (not part of the app UI).

**Note on structure:** your 15-section list does not include the **Daily Plan** screen (الخطة اليومية) — it is a full screen with ~50 copy items including the Evening Check-in dialog. It is inserted here as group 4 to avoid omission. The Knowledge content library (98 cards) is section 11b; the Intervention content library (28 items) is section 15a.

---

## B. Complete Copy Inventory

### 1. Home (HomeScreen.tsx)

ID: HOME-001
SCREEN: Home
LOCATION: ScreenHeader title
TYPE: dynamic greeting (title)
STATE / CONDITION: always; value by hour — before 5am «ليلة هادئة», 5–12 «صباح الخير», 12–17 «نهارك طيب», 17+ «مساء الخير»
CURRENT TEXT: {greeting()} — «ليلة هادئة» / «صباح الخير» / «نهارك طيب» / «مساء الخير»
PURPOSE / CONTEXT: Time-of-day greeting as the screen title
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 186 (renders greeting(), src/lib/app/helpers.ts lines 57–64; «مساء الخير» covers both 17–21 and 21+ branches)

ID: HOME-002
SCREEN: Home
LOCATION: ScreenHeader subtitle
TYPE: subtitle (dynamic)
STATE / CONDITION: always; {n} = daysSinceStart
CURRENT TEXT: اليوم {n} من رحلتك
PURPOSE / CONTEXT: Journey day counter
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 187

ID: HOME-003
SCREEN: Home
LOCATION: ScreenHeader subtitle (suffix)
TYPE: subtitle fragment (dynamic)
STATE / CONDITION: only when daysSinceLastRelapse != null
CURRENT TEXT: — و{n} يومًا منذ آخر تعثر
PURPOSE / CONTEXT: Days since last relapse, appended to HOME-002
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 187

ID: HOME-004
SCREEN: Home
LOCATION: State banner (normal) — bold line
TYPE: conditional success message
STATE / CONDITION: homeState === "normal" && lastCheck.outcome === "handled" within 3h
CURRENT TEXT: أحسنت — تعاملت مع موجة {label}.
PURPOSE / CONTEXT: Acknowledge a recently-handled wave
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 193–196

ID: HOME-005
SCREEN: Home
LOCATION: State banner (normal) — {label} values
TYPE: dynamic time-label
STATE / CONDITION: outcome time (fallback check time): <45m / <110m / else
CURRENT TEXT: «من قليل» / «منذ ساعة تقريبًا» / «منذ ساعتين تقريبًا»
PURPOSE / CONTEXT: Truthful recency label inside HOME-004
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 147–155

ID: HOME-006
SCREEN: Home
LOCATION: State banner (normal) — bold line
TYPE: conditional success message
STATE / CONDITION: homeState === "normal" && no recently-handled check
CURRENT TEXT: أنت مستقر دلوقتي — مش محتاج أي تدخل.
PURPOSE / CONTEXT: Stable-state reassurance
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 196

ID: HOME-007
SCREEN: Home
LOCATION: State banner (normal) — tail sentence
TYPE: guidance
STATE / CONDITION: homeState === "normal" && settings.dailyDoseEnabled === true
CURRENT TEXT: خد جرعة اليوم واختار مهمة واحدة من خطتك — ده كفاية.
PURPOSE / CONTEXT: Stable-state minimal next step (dose on)
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 170–172

ID: HOME-008
SCREEN: Home
LOCATION: State banner (normal) — tail sentence
TYPE: guidance
STATE / CONDITION: homeState === "normal" && settings.dailyDoseEnabled === false
CURRENT TEXT: اختار مهمة واحدة من خطة اليوم — ده كفاية.
PURPOSE / CONTEXT: Stable-state minimal next step (dose off)
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 172

ID: HOME-009
SCREEN: Home
LOCATION: State banner (moderate)
TYPE: warning message
STATE / CONDITION: homeState === "moderate" (last check degree 3, <3h, unresolved)
CURRENT TEXT: انتبه — آخر فحص أظهر رغبة بدأت تبني. مؤشر مش تنبؤ: خطوة قطع صغيرة دلوقتي بتكفي غالبًا قبل ما تكبر.
PURPOSE / CONTEXT: Early-warning state banner
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 202–204

ID: HOME-010
SCREEN: Home
LOCATION: State banner (moderate) — CTA
TYPE: button label
STATE / CONDITION: homeState === "moderate"
CURRENT TEXT: افحص الرغبة الآن
PURPOSE / CONTEXT: Direct to Urge Check
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 206–209

ID: HOME-011
SCREEN: Home
LOCATION: State banner (high) — header
TYPE: danger heading
STATE / CONDITION: homeState === "high" (last check degree ≥4, <3h, unresolved)
CURRENT TEXT: درجة حالتك مرتفعة في آخر فحص
PURPOSE / CONTEXT: High-risk state banner header
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 215–217

ID: HOME-012
SCREEN: Home
LOCATION: State banner (high) — body
TYPE: guidance
STATE / CONDITION: homeState === "high"
CURRENT TEXT: اللي محتاجه دلوقتي خطوة قطع واحدة — مش حل شامل.
PURPOSE / CONTEXT: Scope the needed action to one step
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 219–221

ID: HOME-013
SCREEN: Home
LOCATION: State banner (high) — primary CTA
TYPE: button label (destructive)
STATE / CONDITION: homeState === "high"; launches emergency at lastCheck.riskLevel ?? 4
CURRENT TEXT: تدخّل الآن
PURPOSE / CONTEXT: Emergency launcher
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 223–232

ID: HOME-014
SCREEN: Home
LOCATION: State banner (high) — secondary CTA
TYPE: button label
STATE / CONDITION: homeState === "high"
CURRENT TEXT: أعد الفحص
PURPOSE / CONTEXT: Re-run the Urge Check
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 233–235

ID: HOME-015
SCREEN: Home
LOCATION: State banner (high) — post-behavior quiet entry under divider
TYPE: text link
STATE / CONDITION: homeState === "high" (always within this banner)
CURRENT TEXT: رجعت للسلوك؟ ما تكملش — نوقف هنا الأول
PURPOSE / CONTEXT: Non-assuming bridge to the Stop flow (exact duplicate of EMERGENCY-026)
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 240–248

ID: HOME-016
SCREEN: Home
LOCATION: State banner (post-relapse) — header
TYPE: warning heading
STATE / CONDITION: homeState === "post-relapse" (relapse <48h, unreviewed)
CURRENT TEXT: بعد التعثر — المهم دلوقتي: ما تكمّلش
PURPOSE / CONTEXT: Post-behavior banner header
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 254–256

ID: HOME-017
SCREEN: Home
LOCATION: State banner (post-relapse) — body
TYPE: guidance
STATE / CONDITION: homeState === "post-relapse"
CURRENT TEXT: التعثر مش بيمسح اللي اتعلمته — والمراجعة الهادئة تنتظرك لما تهدى.
PURPOSE / CONTEXT: Anti-shame framing + review promise
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 258–260

ID: HOME-018
SCREEN: Home
LOCATION: State banner (post-relapse) — CTA
TYPE: button label
STATE / CONDITION: homeState === "post-relapse"
CURRENT TEXT: توقّف هنا
PURPOSE / CONTEXT: Go to the Stop flow
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 261–265

ID: HOME-019
SCREEN: Home
LOCATION: Quick Guide card — header
TYPE: card title
STATE / CONDITION: homeState === "normal" only
CURRENT TEXT: دليلك السريع — أعمل إيه دلوقتي؟
PURPOSE / CONTEXT: The four-situation mental map
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 86–88

ID: HOME-020
SCREEN: Home
LOCATION: Quick Guide row 1 — situation
TYPE: row label
STATE / CONDITION: Quick Guide visible (normal state)
CURRENT TEXT: مستقر؟
PURPOSE / CONTEXT: Situation prompt
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 52

ID: HOME-021
SCREEN: Home
LOCATION: Quick Guide row 1 — action
TYPE: row action label
STATE / CONDITION: Quick Guide visible
CURRENT TEXT: خد جرعة اليوم
PURPOSE / CONTEXT: Action for the stable situation
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 53

ID: HOME-022
SCREEN: Home
LOCATION: Quick Guide row 2 — situation
TYPE: row label
STATE / CONDITION: Quick Guide visible
CURRENT TEXT: بدأت رغبة؟
PURPOSE / CONTEXT: Situation prompt
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 60

ID: HOME-023
SCREEN: Home
LOCATION: Quick Guide row 2 — action
TYPE: row action label
STATE / CONDITION: Quick Guide visible
CURRENT TEXT: افحص الرغبة
PURPOSE / CONTEXT: Action for the urge situation
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 61

ID: HOME-024
SCREEN: Home
LOCATION: Quick Guide row 3 — situation
TYPE: row label
STATE / CONDITION: Quick Guide visible
CURRENT TEXT: قربت تتصرف؟
PURPOSE / CONTEXT: Situation prompt
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 68

ID: HOME-025
SCREEN: Home
LOCATION: Quick Guide row 3 — action
TYPE: row action label (destructive)
STATE / CONDITION: Quick Guide visible; launches emergency at level 4
CURRENT TEXT: تدخّل الآن
PURPOSE / CONTEXT: Action for the about-to-act situation
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 69

ID: HOME-026
SCREEN: Home
LOCATION: Quick Guide row 4 — situation
TYPE: row label
STATE / CONDITION: Quick Guide visible
CURRENT TEXT: رجعت للسلوك؟
PURPOSE / CONTEXT: Situation prompt
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 76

ID: HOME-027
SCREEN: Home
LOCATION: Quick Guide row 4 — action
TYPE: row action label
STATE / CONDITION: Quick Guide visible
CURRENT TEXT: توقّف هنا
PURPOSE / CONTEXT: Action for the post-behavior situation
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 77

ID: HOME-028
SCREEN: Home
LOCATION: Quick Guide card — footer
TYPE: helper text
STATE / CONDITION: Quick Guide visible
CURRENT TEXT: كل أداة ليها وقتها — استخدم اللي محتاجه دلوقتي.
PURPOSE / CONTEXT: One-tool-at-a-time framing
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 108–110

ID: HOME-029
SCREEN: Home
LOCATION: Daily dose card — header
TYPE: card title (dynamic)
STATE / CONDITION: settings.dailyDoseEnabled === true
CURRENT TEXT: الجرعة اليومية — اليوم {n}
PURPOSE / CONTEXT: Dose card header with journey day
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 280–283

ID: HOME-030
SCREEN: Home
LOCATION: Daily dose card — completion badge
TYPE: badge
STATE / CONDITION: dailyDoseEnabled && today's dose logged as done
CURRENT TEXT: أُنجزت اليوم ✓
PURPOSE / CONTEXT: Dose completed indicator
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 284–288

ID: HOME-031
SCREEN: Home
LOCATION: Daily dose card — «know» block label
TYPE: block label
STATE / CONDITION: dailyDoseEnabled
CURRENT TEXT: اعرف
PURPOSE / CONTEXT: Dose preview block label (know)
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 294

ID: HOME-032
SCREEN: Home
LOCATION: Daily dose card — «act» block label
TYPE: block label
STATE / CONDITION: dailyDoseEnabled
CURRENT TEXT: افعل
PURPOSE / CONTEXT: Dose preview block label (act)
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 298

ID: HOME-033
SCREEN: Home
LOCATION: Daily dose card — CTA
TYPE: button label
STATE / CONDITION: dailyDoseEnabled && dose done today
CURRENT TEXT: اعرض الجرعة كاملة
PURPOSE / CONTEXT: View the completed dose
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 304

ID: HOME-034
SCREEN: Home
LOCATION: Daily dose card — CTA
TYPE: button label
STATE / CONDITION: dailyDoseEnabled && dose not done today
CURRENT TEXT: ابدأ الجرعة
PURPOSE / CONTEXT: Start today's dose
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 304

ID: HOME-035
SCREEN: Home
LOCATION: Daily plan compact — card title
TYPE: card title
STATE / CONDITION: always
CURRENT TEXT: الخطة اليومية
PURPOSE / CONTEXT: Plan preview card header
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 314–316

ID: HOME-036
SCREEN: Home
LOCATION: Daily plan compact — link
TYPE: link label
STATE / CONDITION: always
CURRENT TEXT: الخطة كاملة
PURPOSE / CONTEXT: Go to full plan
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 318–325

ID: HOME-037
SCREEN: Home
LOCATION: Daily plan compact — pillar button (each)
TYPE: accessibility label (dynamic)
STATE / CONDITION: always (6 pillar buttons)
CURRENT TEXT: ركيزة {label} — افتح الخطة اليومية
PURPOSE / CONTEXT: Screen-reader name for pillar tiles
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 333

ID: HOME-038
SCREEN: Home
LOCATION: Daily plan compact — pillar labels
TYPE: tile labels (set of 6)
STATE / CONDITION: always
CURRENT TEXT: العقل · الجسد · الهدف · التواصل · القيم · الرقمي
PURPOSE / CONTEXT: The six plan pillars shown as tiles
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 174–181

ID: HOME-039
SCREEN: Home
LOCATION: Progress snapshot — card title
TYPE: card title
STATE / CONDITION: always
CURRENT TEXT: لمحة التقدم
PURPOSE / CONTEXT: Progress preview header
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 347–350

ID: HOME-040
SCREEN: Home
LOCATION: Progress snapshot — link
TYPE: link label
STATE / CONDITION: always
CURRENT TEXT: كل المؤشرات
PURPOSE / CONTEXT: Go to full progress screen
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 352–359

ID: HOME-041
SCREEN: Home
LOCATION: Progress snapshot — StatTile label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: رغبات تعاملت معها
PURPOSE / CONTEXT: Handled-urges metric
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 363

ID: HOME-042
SCREEN: Home
LOCATION: Progress snapshot — StatTile hint
TYPE: metric hint (dynamic)
STATE / CONDITION: always; {n} = urgesHandled7d
CURRENT TEXT: {n} خلال آخر أسبوع
PURPOSE / CONTEXT: 7-day count for handled urges
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 365

ID: HOME-043
SCREEN: Home
LOCATION: Progress snapshot — StatTile label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: تدخلات مبكرة
PURPOSE / CONTEXT: Early-interventions metric
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 369

ID: HOME-044
SCREEN: Home
LOCATION: Progress snapshot — StatTile hint
TYPE: metric hint
STATE / CONDITION: always
CURRENT TEXT: خلال ٣٠ يومًا
PURPOSE / CONTEXT: Window for early interventions
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 371

ID: HOME-045
SCREEN: Home
LOCATION: Progress snapshot — StatTile label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: استقرار يومي
PURPOSE / CONTEXT: Daily stability metric (percent)
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 375

ID: HOME-046
SCREEN: Home
LOCATION: Progress snapshot — StatTile hint
TYPE: metric hint
STATE / CONDITION: always
CURRENT TEXT: مراجعات مسائية / ١٤ يومًا
PURPOSE / CONTEXT: Stability metric definition
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 377

ID: HOME-047
SCREEN: Home
LOCATION: Progress snapshot — StatTile label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: وعي بالمحفزات
PURPOSE / CONTEXT: Trigger awareness metric
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 380

ID: HOME-048
SCREEN: Home
LOCATION: Progress snapshot — StatTile hint
TYPE: metric hint
STATE / CONDITION: always
CURRENT TEXT: محفزات مختلفة رصدتها
PURPOSE / CONTEXT: Awareness metric definition
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: line 382

ID: HOME-049
SCREEN: Home
LOCATION: Screen footer
TYPE: disclaimer (2 lines)
STATE / CONDITION: always
CURRENT TEXT: مؤشرات سلوكية للاستخدام الشخصي — ليست تشخيصًا طبيًا ولا نسبة تعافٍ.
بياناتك محفوظة على جهازك فقط.
PURPOSE / CONTEXT: Honesty + privacy footer
SOURCE FILE: src/components/app/screens/HomeScreen.tsx
SOURCE LOCATION: lines 389–393

### 2. Onboarding (Onboarding.tsx)

ID: ONBOARDING-001
SCREEN: Onboarding
LOCATION: Brand bar — name
TYPE: brand name
STATE / CONDITION: all onboarding steps (incl. welcome)
CURRENT TEXT: استعادة
PURPOSE / CONTEXT: App name
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 119

ID: ONBOARDING-002
SCREEN: Onboarding
LOCATION: Brand bar — tagline
TYPE: brand tagline
STATE / CONDITION: all onboarding steps
CURRENT TEXT: نظام شخصي لاستعادة التحكم
PURPOSE / CONTEXT: App one-line identity
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 120

ID: ONBOARDING-003
SCREEN: Onboarding
LOCATION: Welcome — hero heading
TYPE: heading
STATE / CONDITION: step === -1 (welcome screen)
CURRENT TEXT: أهلًا بك في «استعادة»
PURPOSE / CONTEXT: Welcome title
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 132–134

ID: ONBOARDING-004
SCREEN: Onboarding
LOCATION: Welcome — hero paragraph
TYPE: intro paragraph
STATE / CONDITION: step === -1
CURRENT TEXT: نظام شخصي يساعدك تفهم لحظاتك الصعبة وتوقف السلوك قبل ما يبدأ — بخطوات عملية، من غير أحكام.
PURPOSE / CONTEXT: Value proposition
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 135–138

ID: ONBOARDING-005
SCREEN: Onboarding
LOCATION: Welcome — privacy card header
TYPE: card title
STATE / CONDITION: step === -1
CURRENT TEXT: بياناتك على جهازك فقط
PURPOSE / CONTEXT: Local-first privacy promise
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 142–144

ID: ONBOARDING-006
SCREEN: Onboarding
LOCATION: Welcome — privacy card body
TYPE: paragraph
STATE / CONDITION: step === -1
CURRENT TEXT: لا حساب، لا خادم، لا إرسال لأي مكان — كل شيء يُخزن محليًا في متصفحك، ويمكنك تصديره كنسخة احتياطية متى شئت.
PURPOSE / CONTEXT: Privacy details
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 146–149

ID: ONBOARDING-007
SCREEN: Onboarding
LOCATION: Welcome — primary CTA
TYPE: button label
STATE / CONDITION: step === -1
CURRENT TEXT: ابدأ كمستخدم جديد
PURPOSE / CONTEXT: Start the wizard
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 153–160

ID: ONBOARDING-008
SCREEN: Onboarding
LOCATION: Welcome — divider between CTAs
TYPE: separator word
STATE / CONDITION: step === -1
CURRENT TEXT: أو
PURPOSE / CONTEXT: Divider label
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 163

ID: ONBOARDING-009
SCREEN: Onboarding
LOCATION: Welcome — restore box header
TYPE: card title
STATE / CONDITION: step === -1
CURRENT TEXT: لست مستخدمًا جديدًا؟ استعد بياناتك
PURPOSE / CONTEXT: Restore path header
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 167–169

ID: ONBOARDING-010
SCREEN: Onboarding
LOCATION: Welcome — restore box body
TYPE: paragraph
STATE / CONDITION: step === -1
CURRENT TEXT: لديك نسخة احتياطية من جهاز آخر؟ استعدها الآن وستفتح البيانات مباشرة — بلا تهيئة من جديد.
PURPOSE / CONTEXT: Restore path explanation
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 171–174

ID: ONBOARDING-011
SCREEN: Onboarding
LOCATION: Step 0 — title
TYPE: step heading
STATE / CONDITION: step === 0
CURRENT TEXT: لماذا تستخدم التطبيق؟
PURPOSE / CONTEXT: Goals question
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 190–192

ID: ONBOARDING-012
SCREEN: Onboarding
LOCATION: Step 0 — subtitle
TYPE: step subtitle
STATE / CONDITION: step === 0
CURRENT TEXT: اختر كل ما ينطبق — هذا يساعدنا على تخصيص نظامك.
PURPOSE / CONTEXT: Multi-select guidance
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 192

ID: ONBOARDING-013
SCREEN: Onboarding
LOCATION: Step 0 — goal options (7 chips)
TYPE: option labels (multi-select)
STATE / CONDITION: step === 0
CURRENT TEXT: أريد تغيير سلوك يؤثر على حياتي · أريد تحكمًا أفضل في الرغبات · أريد تقليل أو إيقاف استخدام الإباحية · أريد تقليل سلوك جنسي قهري · أريد فهم محفزاتي · أريد بناء روتين يومي أقوى · أريد دعمًا مبنيًا على قيمي/روحانيتي
PURPOSE / CONTEXT: Goal selection vocabulary
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 14–22

ID: ONBOARDING-014
SCREEN: Onboarding
LOCATION: Step 1 — title
TYPE: step heading
STATE / CONDITION: step === 1
CURRENT TEXT: متى تكون الأمور أصعب عادة؟
PURPOSE / CONTEXT: Difficult-times question
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 199–201

ID: ONBOARDING-015
SCREEN: Onboarding
LOCATION: Step 1 — subtitle
TYPE: step subtitle
STATE / CONDITION: step === 1
CURRENT TEXT: يمكنك اختيار أكثر من خيار.
PURPOSE / CONTEXT: Multi-select guidance
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 201

ID: ONBOARDING-016
SCREEN: Onboarding
LOCATION: Step 1 — difficult-time options (9 chips)
TYPE: option labels (multi-select)
STATE / CONDITION: step === 1
CURRENT TEXT: الليل المتأخر · حين أكون وحدي · الملل · التوتر والضغط · المشاعر الصعبة · وقت فراغ غير منظم · أثناء استخدام الهاتف/الكمبيوتر · أماكن معينة · أخرى
PURPOSE / CONTEXT: Difficult-times vocabulary
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 24–34

ID: ONBOARDING-017
SCREEN: Onboarding
LOCATION: Step 2 — title
TYPE: step heading
STATE / CONDITION: step === 2
CURRENT TEXT: ما الذي يحدث عادة قبل السلوك؟
PURPOSE / CONTEXT: Pattern question
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 212–214

ID: ONBOARDING-018
SCREEN: Onboarding
LOCATION: Step 2 — subtitle
TYPE: step subtitle
STATE / CONDITION: step === 2
CURRENT TEXT: اختيارات عامة — لا حاجة لأي تفاصيل صريحة.
PURPOSE / CONTEXT: Privacy reassurance
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 214

ID: ONBOARDING-019
SCREEN: Onboarding
LOCATION: Step 2 — pattern options (9 chips)
TYPE: option labels (multi-select)
STATE / CONDITION: step === 2
CURRENT TEXT: تصفح بلا هدف · تذكّر شيء ما · خيال · فضول · انزعاج انفعالي · انعزال · البقاء في السرير · بحث · أخرى
PURPOSE / CONTEXT: Pre-behavior pattern vocabulary
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 36–46

ID: ONBOARDING-020
SCREEN: Onboarding
LOCATION: Step 2 — info note
TYPE: info note
STATE / CONDITION: step === 2
CURRENT TEXT: ما يهمّنا هنا هو النمط العام (تصفح؟ تذكّر؟ ملل؟) — لا محتوى بعينه.
PURPOSE / CONTEXT: Clarify that no explicit content is requested
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 217–219

ID: ONBOARDING-021
SCREEN: Onboarding
LOCATION: Step 3 — title
TYPE: step heading
STATE / CONDITION: step === 3
CURRENT TEXT: هل تحتاج هاتفك/كمبيوترك للعمل أو الدراسة؟
PURPOSE / CONTEXT: Work-safe profile question
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 224–226

ID: ONBOARDING-022
SCREEN: Onboarding
LOCATION: Step 3 — subtitle
TYPE: step subtitle
STATE / CONDITION: step === 3
CURRENT TEXT: هذا يحدد خطة «وضع العمل الآمن» عند الطوارئ.
PURPOSE / CONTEXT: Explains what the answer configures
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 226

ID: ONBOARDING-023
SCREEN: Onboarding
LOCATION: Step 3 — option «yes» (label + desc)
TYPE: option label + description
STATE / CONDITION: step === 3
CURRENT TEXT: نعم، أحتاجه باستمرار — سنجهّز تدخلات لا تتطلب ترك الجهاز
PURPOSE / CONTEXT: Device-needed answer
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 231

ID: ONBOARDING-024
SCREEN: Onboarding
LOCATION: Step 3 — option «sometimes» (label + desc)
TYPE: option label + description
STATE / CONDITION: step === 3
CURRENT TEXT: أحيانًا — سنطلب منك التأكيد وقت الحاجة
PURPOSE / CONTEXT: Sometimes-needed answer
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 232

ID: ONBOARDING-025
SCREEN: Onboarding
LOCATION: Step 3 — option «no» (label + desc)
TYPE: option label + description
STATE / CONDITION: step === 3
CURRENT TEXT: لا، يمكنني تركه — سنفضّل تدخلات الابتعاد عن الجهاز
PURPOSE / CONTEXT: Device-not-needed answer
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 233

ID: ONBOARDING-026
SCREEN: Onboarding
LOCATION: Step 4 — title
TYPE: step heading
STATE / CONDITION: step === 4
CURRENT TEXT: ما الذي تريد بناءه؟
PURPOSE / CONTEXT: Build-goals question
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 256

ID: ONBOARDING-027
SCREEN: Onboarding
LOCATION: Step 4 — subtitle
TYPE: step subtitle
STATE / CONDITION: step === 4
CURRENT TEXT: الحياة الممتلئة أقوى درع — اختر أهدافك.
PURPOSE / CONTEXT: Full-life framing
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 256

ID: ONBOARDING-028
SCREEN: Onboarding
LOCATION: Step 4 — build-goal options (8 chips)
TYPE: option labels (multi-select)
STATE / CONDITION: step === 4
CURRENT TEXT: الدراسة · المستقبل المهني · الانضباط · العلاقات · الصحة البدنية · حياة قيمية/روحية · إدارة الوقت · التركيز
PURPOSE / CONTEXT: Build-goals vocabulary
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 48–57

ID: ONBOARDING-029
SCREEN: Onboarding
LOCATION: Step 5 — title
TYPE: step heading
STATE / CONDITION: step === 5
CURRENT TEXT: أي نوع من الدعم تفضّل؟
PURPOSE / CONTEXT: Support-preference question
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 262

ID: ONBOARDING-030
SCREEN: Onboarding
LOCATION: Step 5 — subtitle
TYPE: step subtitle
STATE / CONDITION: step === 5; single-select
CURRENT TEXT: سيظهر هذا في اختيار جرعتك اليومية.
PURPOSE / CONTEXT: Explains the promise wired in Phase 1 (spiritualContent)
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 262

ID: ONBOARDING-031
SCREEN: Onboarding
LOCATION: Step 5 — support options (5 buttons)
TYPE: option labels (single-select)
STATE / CONDITION: step === 5
CURRENT TEXT: المحتوى العلمي المبسّط · استراتيجيات عملية مباشرة · توجيه نفسي/سلوكي · تأمل قيمي وروحي · مزيج من كل ذلك
PURPOSE / CONTEXT: Support-preference vocabulary («تأمل قيمي وروحي» opt-in sets spiritualContent=true)
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 59–65

ID: ONBOARDING-032
SCREEN: Onboarding
LOCATION: Step 6 — title
TYPE: step heading
STATE / CONDITION: step === 6
CURRENT TEXT: لماذا أفعل هذا؟
PURPOSE / CONTEXT: Personal-why question
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 284–286

ID: ONBOARDING-033
SCREEN: Onboarding
LOCATION: Step 6 — subtitle
TYPE: step subtitle
STATE / CONDITION: step === 6
CURRENT TEXT: اكتب سببك بيدك — أو اختر ما يمثّلك. يظهر لك في اللحظات الصعبة.
PURPOSE / CONTEXT: Explains where the why surfaces later
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 286

ID: ONBOARDING-034
SCREEN: Onboarding
LOCATION: Step 6 — textarea placeholder
TYPE: placeholder
STATE / CONDITION: step === 6
CURRENT TEXT: سببك الخاص، بكلماتك أنت… (اختياري)
PURPOSE / CONTEXT: Free-text why input
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 297

ID: ONBOARDING-035
SCREEN: Onboarding
LOCATION: Step 7 — heading
TYPE: step heading
STATE / CONDITION: step === 7 (summary)
CURRENT TEXT: جهّزنا خطتك الأولى
PURPOSE / CONTEXT: Completion heading
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 304–311

ID: ONBOARDING-036
SCREEN: Onboarding
LOCATION: Step 7 — paragraph
TYPE: paragraph
STATE / CONDITION: step === 7
CURRENT TEXT: حددنا سياقات الخطر الرئيسية عندك، وبنينا أول خطة استجابة مخصصة.
PURPOSE / CONTEXT: Summary intro
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 312–314

ID: ONBOARDING-037
SCREEN: Onboarding
LOCATION: Step 7 — summary line 1 (label + value)
TYPE: summary line (dynamic)
STATE / CONDITION: step === 7; value = chosen difficultTimes labels
CURRENT TEXT: سياقات الخطر عندك: {difficultTimes labels joined by «، »}
PURPOSE / CONTEXT: Echo of step-1 answers
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 319–325

ID: ONBOARDING-038
SCREEN: Onboarding
LOCATION: Step 7 — summary line 1 (empty variant)
TYPE: summary line (fallback)
STATE / CONDITION: step === 7 && difficultTimes.length === 0
CURRENT TEXT: سياقات الخطر عندك: لم تحدد بعد — سيحددها سجلّك مع الوقت
PURPOSE / CONTEXT: Honest fallback when nothing chosen
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: line 324

ID: ONBOARDING-039
SCREEN: Onboarding
LOCATION: Step 7 — summary line 2
TYPE: summary line
STATE / CONDITION: step === 7
CURRENT TEXT: خطة الاستجابة: فحص الرغبة ثلاثي الأبعاد → تدخل مناسب لسياقك → إعادة تقييم → تعلم.
PURPOSE / CONTEXT: Describes the response loop
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 327–333

ID: ONBOARDING-040
SCREEN: Onboarding
LOCATION: Step 7 — summary line 3 (label + 2 variants)
TYPE: summary line (conditional)
STATE / CONDITION: step === 7; variant by deviceNeeds === "yes" / else
CURRENT TEXT: حماية الطوارئ: «وضع العمل الآمن» جاهز — مش محتاج تسيب جهازك.
حماية الطوارئ: تدخلات ابتعاد عن الجهاز عند الخطر.
PURPOSE / CONTEXT: Emergency protection summary
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 334–342

ID: ONBOARDING-041
SCREEN: Onboarding
LOCATION: Step 7 — summary line 4
TYPE: summary line
STATE / CONDITION: step === 7
CURRENT TEXT: أربع قواعد «إذا… إذن» جاهزة في خطة الوقاية، مستمدة من أكثر الأنماط شيوعًا.
PURPOSE / CONTEXT: Seeded prevention rules summary
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 343–349

ID: ONBOARDING-042
SCREEN: Onboarding
LOCATION: Step 7 — info note
TYPE: info note
STATE / CONDITION: step === 7
CURRENT TEXT: بياناتك كلها ستُخزن على جهازك فقط — لا حساب، لا خادم، لا إرسال لأي مكان.
PURPOSE / CONTEXT: Final privacy confirmation
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 351–353

ID: ONBOARDING-043
SCREEN: Onboarding
LOCATION: Wizard nav — back button
TYPE: button label
STATE / CONDITION: steps 0–7; disabled at step 0
CURRENT TEXT: السابق
PURPOSE / CONTEXT: Wizard back navigation
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 362–371

ID: ONBOARDING-044
SCREEN: Onboarding
LOCATION: Wizard nav — next button
TYPE: button label
STATE / CONDITION: steps 0–6; disabled when required selection empty (steps 0/1/2/4)
CURRENT TEXT: التالي
PURPOSE / CONTEXT: Wizard forward navigation
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 372–376

ID: ONBOARDING-045
SCREEN: Onboarding
LOCATION: Wizard nav — finish button
TYPE: button label
STATE / CONDITION: step === 7
CURRENT TEXT: ابدأ رحلتي
PURPOSE / CONTEXT: Complete onboarding
SOURCE FILE: src/components/app/Onboarding.tsx
SOURCE LOCATION: lines 377–381

### 3. Daily Dose (DoseScreen.tsx)

ID: DOSE-001
SCREEN: Daily Dose
LOCATION: ScreenHeader title
TYPE: screen title
STATE / CONDITION: always
CURRENT TEXT: الجرعة اليومية
PURPOSE / CONTEXT: Screen name
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: line 52

ID: DOSE-002
SCREEN: Daily Dose
LOCATION: ScreenHeader subtitle
TYPE: subtitle (dynamic)
STATE / CONDITION: always; arabicDate + day number + journey stage label
CURRENT TEXT: {arabicDate(new Date())} — اليوم {n} · مرحلة «{stage.label}»
PURPOSE / CONTEXT: Date, journey day and stage
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: line 53

ID: DOSE-003
SCREEN: Daily Dose
LOCATION: Dose card header — skip badge
TYPE: badge
STATE / CONDITION: today's dose logged as skipped
CURRENT TEXT: مُخطاة اليوم
PURPOSE / CONTEXT: Marks the shown dose as the one the user skipped
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 64–68

ID: DOSE-004
SCREEN: Daily Dose
LOCATION: Dose card — block label 1
TYPE: block label
STATE / CONDITION: always
CURRENT TEXT: اعرف
PURPOSE / CONTEXT: «know» block title
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: line 75

ID: DOSE-005
SCREEN: Daily Dose
LOCATION: Dose card — block label 2
TYPE: block label
STATE / CONDITION: always
CURRENT TEXT: افهم
PURPOSE / CONTEXT: «understand» block title
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: line 76

ID: DOSE-006
SCREEN: Daily Dose
LOCATION: Dose card — block label 3
TYPE: block label
STATE / CONDITION: always
CURRENT TEXT: افعل
PURPOSE / CONTEXT: «act» block title
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: line 77

ID: DOSE-007
SCREEN: Daily Dose
LOCATION: Dose card — remember box label
TYPE: block label
STATE / CONDITION: always
CURRENT TEXT: تذكّر
PURPOSE / CONTEXT: «remember» box title
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 79–81

ID: DOSE-008
SCREEN: Daily Dose
LOCATION: Dose card — deep reading toggle
TYPE: collapsible summary
STATE / CONDITION: only when the item has a «deep» field
CURRENT TEXT: قراءة أعمق (اختياري)
PURPOSE / CONTEXT: Optional depth disclosure
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 85–89

ID: DOSE-009
SCREEN: Daily Dose
LOCATION: Dose card — completion banner
TYPE: success banner
STATE / CONDITION: today's dose logged as done
CURRENT TEXT: أنجزت جرعة اليوم
PURPOSE / CONTEXT: Done-state confirmation (replaces action buttons)
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 94–98

ID: DOSE-010
SCREEN: Daily Dose
LOCATION: Dose card — skip explanation
TYPE: helper text
STATE / CONDITION: today's dose logged as skipped (not done)
CURRENT TEXT: خطّيت جرعة اليوم — إن أردت إنجازها فهي نفسها أمامك، وإلا فالجرعة القادمة بانتظارك غدًا.
PURPOSE / CONTEXT: Legible skip state; same dose still completable
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 104–109

ID: DOSE-011
SCREEN: Daily Dose
LOCATION: Dose card — primary button
TYPE: button label
STATE / CONDITION: dose not done (done OR skipped OR fresh)
CURRENT TEXT: تمت الجرعة
PURPOSE / CONTEXT: Log the dose as done
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 110–118

ID: DOSE-012
SCREEN: Daily Dose
LOCATION: Dose card — secondary button
TYPE: button label
STATE / CONDITION: dose not done
CURRENT TEXT: تخطي اليوم
PURPOSE / CONTEXT: Log the dose as skipped
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 119–128

ID: DOSE-013
SCREEN: Daily Dose
LOCATION: Skip button — title attribute (tooltip)
TYPE: tooltip
STATE / CONDITION: hover on the skip button (desktop)
CURRENT TEXT: لا بأس — يمكنك تخطي أي جرعة
PURPOSE / CONTEXT: Skip-is-not-failure reassurance
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: line 124

ID: DOSE-014
SCREEN: Daily Dose
LOCATION: Dose card — guidance under buttons
TYPE: helper text
STATE / CONDITION: dose not done
CURRENT TEXT: التخطي ليس فشلًا — الجرعة القادمة بانتظارك، والتعافي لا يُقاس بيوم واحد.
PURPOSE / CONTEXT: Skip-is-not-failure guidance (mobile-visible)
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 132–134

ID: DOSE-015
SCREEN: Daily Dose
LOCATION: Selection info note — prefix
TYPE: info note (prefix)
STATE / CONDITION: always
CURRENT TEXT: اختيرت هذه الجرعة بناءً على حالتك الحالية —
PURPOSE / CONTEXT: Explains dose personalization
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 140–146

ID: DOSE-016
SCREEN: Daily Dose
LOCATION: Selection info note — variant A
TYPE: info note (variant)
STATE / CONDITION: a relapse exists within the last 7 days
CURRENT TEXT: لأن لديك تعثرًا حديثًا، نفضّل موضوعات التعثر والعودة.
PURPOSE / CONTEXT: Recent-relapse preference explanation
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 142–145

ID: DOSE-017
SCREEN: Daily Dose
LOCATION: Selection info note — variant B
TYPE: info note (variant)
STATE / CONDITION: no relapse within the last 7 days
CURRENT TEXT: يومك في الرحلة ومحفزاتك الأخيرة. الرحلة تنظيم للمحتوى، لا وعدًا زمنيًا.
PURPOSE / CONTEXT: Default selection explanation + journey honesty
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: line 146

ID: DOSE-018
SCREEN: Daily Dose
LOCATION: Recent doses card — title
TYPE: card title
STATE / CONDITION: only when ≥1 previous dose entry exists (excluding today)
CURRENT TEXT: جرعات سابقة
PURPOSE / CONTEXT: Dose history header
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 149–152

ID: DOSE-019
SCREEN: Daily Dose
LOCATION: Recent doses row — status badge (done)
TYPE: badge
STATE / CONDITION: per row, status === "done"
CURRENT TEXT: أُنجزت
PURPOSE / CONTEXT: Historical dose done badge
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 167–175

ID: DOSE-020
SCREEN: Daily Dose
LOCATION: Recent doses row — status badge (skipped)
TYPE: badge
STATE / CONDITION: per row, status === "skipped"
CURRENT TEXT: مُخطاة
PURPOSE / CONTEXT: Historical dose skipped badge
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 167–175

ID: DOSE-021
SCREEN: Daily Dose
LOCATION: Stage info note — label
TYPE: info note label (dynamic)
STATE / CONDITION: always; value = current stage label + description (see TAX-007)
CURRENT TEXT: مرحلتك الحالية: {stage.label} — {stage.description}
PURPOSE / CONTEXT: Journey stage explanation
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 183–186

ID: DOSE-022
SCREEN: Daily Dose
LOCATION: Footer button
TYPE: button label
STATE / CONDITION: always
CURRENT TEXT: تصفح قاعدة المعرفة كاملة
PURPOSE / CONTEXT: Link to the Knowledge screen
SOURCE FILE: src/components/app/screens/DoseScreen.tsx
SOURCE LOCATION: lines 188–190

### 4. Daily Plan (PlanScreen.tsx) — screen not in the 15-section list; added to avoid omission

ID: PLAN-001
SCREEN: Daily Plan
LOCATION: ScreenHeader title
TYPE: screen title
STATE / CONDITION: always
CURRENT TEXT: الخطة اليومية
PURPOSE / CONTEXT: Screen name
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 133–137

ID: PLAN-002
SCREEN: Daily Plan
LOCATION: ScreenHeader subtitle
TYPE: subtitle (dynamic)
STATE / CONDITION: always
CURRENT TEXT: {arabicDate(new Date())} — البناء اليومي هو التعافي الحقيقي
PURPOSE / CONTEXT: Date + building-framing
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 135

ID: PLAN-003
SCREEN: Daily Plan
LOCATION: Forecast note — label
TYPE: info note label (dynamic)
STATE / CONDITION: only when a forecast exists (evening check-in saved for tomorrow)
CURRENT TEXT: توقّع اليوم: {message}
PURPOSE / CONTEXT: Tomorrow-risk forecast
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 139–141

ID: PLAN-004
SCREEN: Daily Plan
LOCATION: Forecast note — message variant «elevated»
TYPE: forecast message
STATE / CONDITION: forecast.level === "elevated" (sleep ≤2 or stress ≥4 or freeTime ≥4)
CURRENT TEXT: اليوم قد يحتاج إلى استعداد إضافي — نمت قليلًا أو ضغط أعلى من معتادك. فعّل قواعدك الليلية مبكرًا.
PURPOSE / CONTEXT: Elevated-risk forecast body
SOURCE FILE: src/lib/app/progress.ts
SOURCE LOCATION: lines 253–254

ID: PLAN-005
SCREEN: Daily Plan
LOCATION: Forecast note — message variant «balanced»
TYPE: forecast message
STATE / CONDITION: forecast.level === "balanced"
CURRENT TEXT: اليوم متوسط الحمل — التزم بالحد الأدنى من خطتك وحافظ على بروتوكول الليل.
PURPOSE / CONTEXT: Medium-load forecast body
SOURCE FILE: src/lib/app/progress.ts
SOURCE LOCATION: lines 257–259

ID: PLAN-006
SCREEN: Daily Plan
LOCATION: Forecast note — message variant «light»
TYPE: forecast message
STATE / CONDITION: forecast.level === "light"
CURRENT TEXT: ظروفك اليوم مريحة نسبيًا — فرصة جيدة لإنجاز جلسة تركيز واحدة إضافية.
PURPOSE / CONTEXT: Light-day forecast body
SOURCE FILE: src/lib/app/progress.ts
SOURCE LOCATION: lines 261–263

ID: PLAN-007
SCREEN: Daily Plan
LOCATION: Forecast note — CTA
TYPE: button label
STATE / CONDITION: forecast.level === "elevated" only
CURRENT TEXT: فعّل قواعد اليوم مسبقًا
PURPOSE / CONTEXT: Jump to prevention rules
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 142–152

ID: PLAN-008
SCREEN: Daily Plan
LOCATION: Day mode selector — option 1
TYPE: mode label + description
STATE / CONDITION: mode === "minimum" selected (always visible)
CURRENT TEXT: الحد الأدنى — يوم صعب؟ أربع ركائز فقط — يكفي
PURPOSE / CONTEXT: Minimum-day mode
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 20

ID: PLAN-009
SCREEN: Daily Plan
LOCATION: Day mode selector — option 2
TYPE: mode label + description
STATE / CONDITION: always visible
CURRENT TEXT: قياسي — اليوم المتوازن الكامل
PURPOSE / CONTEXT: Standard-day mode
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 21

ID: PLAN-010
SCREEN: Daily Plan
LOCATION: Day mode selector — option 3
TYPE: mode label + description
STATE / CONDITION: always visible
CURRENT TEXT: إضافي — طاقة عالية؟ أضف بناءً أكثر
PURPOSE / CONTEXT: Extra-day mode
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 22

ID: PLAN-011
SCREEN: Daily Plan
LOCATION: Minimum-mode info note
TYPE: info note
STATE / CONDITION: mode === "minimum"
CURRENT TEXT: يوم الحد الأدنى ليس تنازلًا — إنه أذكى استجابة لليوم الصعب. يوم ناقص خير من يوم منهار.
PURPOSE / CONTEXT: Reduces shame of the minimum day
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 175–179

ID: PLAN-012
SCREEN: Daily Plan
LOCATION: Plan section — «morning»
TYPE: section title + body
STATE / CONDITION: modes standard, extra
CURRENT TEXT: الصباح — انهض مبكرًا بما يكفي · لا تصفح في أول ٣٠ دقيقة · حدد مهمة اليوم
PURPOSE / CONTEXT: Morning routine item
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 73–78

ID: PLAN-013
SCREEN: Daily Plan
LOCATION: Plan section — «purpose»
TYPE: section title + body (dynamic)
STATE / CONDITION: all modes; body = user task or default
CURRENT TEXT: مهمة اليوم المهمة — {purposeTask || اختر مهمة واحدة فقط — وابدأ بأصغر خطوة فيها}
PURPOSE / CONTEXT: The one important task
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 79–85

ID: PLAN-014
SCREEN: Daily Plan
LOCATION: Plan section — «body»
TYPE: section title + body (dynamic)
STATE / CONDITION: all modes; body = chosen activity or default
CURRENT TEXT: الجسد: حركة — {bodyChoice || ١٠–٣٠ دقيقة حركة مناسبة لك}
PURPOSE / CONTEXT: Physical activity item
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 86–92

ID: PLAN-015
SCREEN: Daily Plan
LOCATION: Plan section — «attention»
TYPE: section title + body
STATE / CONDITION: modes standard, extra
CURRENT TEXT: انتباه: جلسة تركيز — ١٠–٢٠ دقيقة عمل/دراسة/قراءة — بعيدًا عن السرير
PURPOSE / CONTEXT: Focus session item
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 93–98

ID: PLAN-016
SCREEN: Daily Plan
LOCATION: Plan section — «digital»
TYPE: section title + body
STATE / CONDITION: modes standard, extra
CURRENT TEXT: نظافة رقمية — لا استخدام بلا هدف · الهاتف خارج السرير · مراجعة سريعة لحاجزاتك
PURPOSE / CONTEXT: Digital hygiene item
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 99–104

ID: PLAN-017
SCREEN: Daily Plan
LOCATION: Plan section — «connection»
TYPE: section title + body
STATE / CONDITION: all modes
CURRENT TEXT: تواصل — جلسة مع الأهل أو مكالمة صديق — حضور حقيقي واحد يكفي
PURPOSE / CONTEXT: Social connection item
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 105–110

ID: PLAN-018
SCREEN: Daily Plan
LOCATION: Plan section — «night»
TYPE: section title + body
STATE / CONDITION: modes standard, extra
CURRENT TEXT: بروتوكول الليل — آخر ٣٠–٦٠ دقيقة: لا شاشات · جهّز الغد · اهدأ ثم نم
PURPOSE / CONTEXT: Night protocol item
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 111–116

ID: PLAN-019
SCREEN: Daily Plan
LOCATION: Plan section — «focus-2»
TYPE: section title + body
STATE / CONDITION: mode === "extra" only
CURRENT TEXT: جلسة تركيز ثانية — إضافة لليوم الإضافي فقط — جلسة بناء إضافية
PURPOSE / CONTEXT: Second focus session
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 117–122

ID: PLAN-020
SCREEN: Daily Plan
LOCATION: Body section — activity chips
TYPE: option labels (6 chips)
STATE / CONDITION: always (within «body» section)
CURRENT TEXT: مشي ١٠ دقائق · مشي ٢٠ دقيقة · تمرين منزلي · تمرين رياضي · دراجة/جري · تمدد
PURPOSE / CONTEXT: Body activity choices
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 17

ID: PLAN-021
SCREEN: Daily Plan
LOCATION: Purpose section — input placeholder
TYPE: placeholder
STATE / CONDITION: always (within «purpose» section)
CURRENT TEXT: اكتب مهمتك المهمة اليوم…
PURPOSE / CONTEXT: Free-text task input
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 201

ID: PLAN-022
SCREEN: Daily Plan
LOCATION: Evening check-in card — title
TYPE: card title
STATE / CONDITION: always
CURRENT TEXT: المراجعة المسائية
PURPOSE / CONTEXT: Evening check-in entry point
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 226–229

ID: PLAN-023
SCREEN: Daily Plan
LOCATION: Evening check-in card — status (done)
TYPE: status text
STATE / CONDITION: checkedInToday === true
CURRENT TEXT: أُنجزت الليلة ✓ — شكرًا لصدقك
PURPOSE / CONTEXT: Already checked in tonight
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 230

ID: PLAN-024
SCREEN: Daily Plan
LOCATION: Evening check-in card — status (pending)
TYPE: status text
STATE / CONDITION: checkedInToday === false
CURRENT TEXT: ٥ أسئلة قصيرة + توقّع الغد
PURPOSE / CONTEXT: What the check-in contains
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 230

ID: PLAN-025
SCREEN: Daily Plan
LOCATION: Evening check-in — dialog trigger (done)
TYPE: button label
STATE / CONDITION: checkedInToday === true
CURRENT TEXT: تعديل
PURPOSE / CONTEXT: Edit tonight's check-in
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 364–367

ID: PLAN-026
SCREEN: Daily Plan
LOCATION: Evening check-in — dialog trigger (pending)
TYPE: button label
STATE / CONDITION: checkedInToday === false
CURRENT TEXT: ابدأ
PURPOSE / CONTEXT: Start the check-in
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 364–367

ID: PLAN-027
SCREEN: Daily Plan
LOCATION: Evening check-in dialog — title
TYPE: dialog title
STATE / CONDITION: dialog open
CURRENT TEXT: المراجعة المسائية
PURPOSE / CONTEXT: Dialog heading (same string as PLAN-022)
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 370–374

ID: PLAN-028
SCREEN: Daily Plan
LOCATION: Check-in dialog step 1 — question 1
TYPE: question label
STATE / CONDITION: step === 0
CURRENT TEXT: ١ · أعلى رغبة اليوم؟
PURPOSE / CONTEXT: Highest urge today (1–5)
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 380–383

ID: PLAN-029
SCREEN: Daily Plan
LOCATION: Check-in dialog step 1 — scale anchors
TYPE: scale anchor labels
STATE / CONDITION: step === 0
CURRENT TEXT: بالكاد وجدت · أقصى ما وصلت له
PURPOSE / CONTEXT: Low/high anchors for the urge scale
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 408–411

ID: PLAN-030
SCREEN: Daily Plan
LOCATION: Check-in dialog step 1 — radio aria-label
TYPE: accessibility label (dynamic)
STATE / CONDITION: step === 0 (per option button)
CURRENT TEXT: أعلى رغبة اليوم: {n} من 5
PURPOSE / CONTEXT: Screen-reader name for urge scale options (note: Latin digit 5)
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 396

ID: PLAN-031
SCREEN: Daily Plan
LOCATION: Check-in dialog step 1 — question 2
TYPE: question label
STATE / CONDITION: step === 0
CURRENT TEXT: ٢ · المحفز الرئيسي اليوم؟
PURPOSE / CONTEXT: Main trigger of the day (chips = TAX-003 labels, first 10)
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 414

ID: PLAN-032
SCREEN: Daily Plan
LOCATION: Check-in dialog step 1 — question 3
TYPE: question label
STATE / CONDITION: step === 0
CURRENT TEXT: ٣ · هل استخدمت تدخلًا؟
PURPOSE / CONTEXT: Intervention usage question
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 428

ID: PLAN-033
SCREEN: Daily Plan
LOCATION: Check-in dialog step 1 — question 3 options
TYPE: option labels (4 chips)
STATE / CONDITION: step === 0
CURRENT TEXT: لا، لم أحتج · نعم — ونجح · نعم — جزئيًا · لم أفكر فيه
PURPOSE / CONTEXT: Intervention usage answers
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 430

ID: PLAN-034
SCREEN: Daily Plan
LOCATION: Check-in dialog step 2 — question 4
TYPE: question label
STATE / CONDITION: step === 1
CURRENT TEXT: ٤ · درس واحد من اليوم؟
PURPOSE / CONTEXT: Lesson of the day
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 447

ID: PLAN-035
SCREEN: Daily Plan
LOCATION: Check-in dialog step 2 — lesson placeholder
TYPE: placeholder
STATE / CONDITION: step === 1
CURRENT TEXT: جملة واحدة تكفي…
PURPOSE / CONTEXT: Lesson input hint
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 451

ID: PLAN-036
SCREEN: Daily Plan
LOCATION: Check-in dialog step 2 — question 5
TYPE: question label
STATE / CONDITION: step === 1
CURRENT TEXT: ٥ · تغيير واحد للغد؟
PURPOSE / CONTEXT: One change for tomorrow
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 456

ID: PLAN-037
SCREEN: Daily Plan
LOCATION: Check-in dialog step 2 — change placeholder
TYPE: placeholder
STATE / CONDITION: step === 1
CURRENT TEXT: مثال: الهاتف يبيت خارج الغرفة…
PURPOSE / CONTEXT: Change input hint
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 460

ID: PLAN-038
SCREEN: Daily Plan
LOCATION: Check-in dialog step 3 — header
TYPE: section header
STATE / CONDITION: step === 2
CURRENT TEXT: ظروف الغد (لتوقّع الغد — ليس تنبؤًا، بل استعدادًا)
PURPOSE / CONTEXT: Conditions-for-forecast section
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 469–471

ID: PLAN-039
SCREEN: Daily Plan
LOCATION: Check-in dialog step 3 — condition scale 1
TYPE: question + anchors
STATE / CONDITION: step === 2
CURRENT TEXT: كيف كان نومك الليلة الماضية؟ — سيئ جدًا · ممتاز
PURPOSE / CONTEXT: Sleep quality (1–5)
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 472

ID: PLAN-040
SCREEN: Daily Plan
LOCATION: Check-in dialog step 3 — condition scale 2
TYPE: question + anchors
STATE / CONDITION: step === 2
CURRENT TEXT: مستوى التوتر اليوم؟ — هادئ · مرتفع جدًا
PURPOSE / CONTEXT: Stress (1–5)
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 473

ID: PLAN-041
SCREEN: Daily Plan
LOCATION: Check-in dialog step 3 — condition scale 3
TYPE: question + anchors
STATE / CONDITION: step === 2
CURRENT TEXT: الوحدة اليوم؟ — متصل بالناس · منعزل
PURPOSE / CONTEXT: Loneliness (1–5)
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 474

ID: PLAN-042
SCREEN: Daily Plan
LOCATION: Check-in dialog step 3 — condition scale 4
TYPE: question + anchors
STATE / CONDITION: step === 2
CURRENT TEXT: كم الوقت الحر غير المنظم؟ — لا يوجد · كثير جدًا
PURPOSE / CONTEXT: Unstructured free time (1–5)
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 475

ID: PLAN-043
SCREEN: Daily Plan
LOCATION: Check-in dialog step 3 — condition scale aria-labels
TYPE: accessibility label (dynamic)
STATE / CONDITION: step === 2 (per option button)
CURRENT TEXT: {label} {n}
PURPOSE / CONTEXT: Screen-reader name for condition-scale options
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: line 338

ID: PLAN-044
SCREEN: Daily Plan
LOCATION: Check-in dialog — back button
TYPE: button label
STATE / CONDITION: dialog open; disabled at step 0
CURRENT TEXT: السابق
PURPOSE / CONTEXT: Wizard back
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 480–481

ID: PLAN-045
SCREEN: Daily Plan
LOCATION: Check-in dialog — next button
TYPE: button label
STATE / CONDITION: dialog open; steps 0–1
CURRENT TEXT: التالي
PURPOSE / CONTEXT: Wizard forward
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 483–484

ID: PLAN-046
SCREEN: Daily Plan
LOCATION: Check-in dialog — save button
TYPE: button label
STATE / CONDITION: dialog open; step === 2
CURRENT TEXT: حفظ المراجعة
PURPOSE / CONTEXT: Save the check-in
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 485–489

ID: PLAN-047
SCREEN: Daily Plan
LOCATION: Check-in dialog — footer note
TYPE: helper text
STATE / CONDITION: dialog open
CURRENT TEXT: صراحتك هنا هي ما يجعل خريطتك وتوقعاتك دقيقة — البيانات تبقى على جهازك.
PURPOSE / CONTEXT: Honesty + privacy note
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 492–495

ID: PLAN-048
SCREEN: Daily Plan
LOCATION: Screen footer info note
TYPE: info note
STATE / CONDITION: always
CURRENT TEXT: لا تسعَ للكمال: فقدان بند واحد لا يفسد اليوم — والتخطي ليس فشلًا، بل حكمة اليوم الصعب. أكمل ما تستطيع وواصل.
PURPOSE / CONTEXT: Anti-perfectionism guidance
SOURCE FILE: src/components/app/screens/PlanScreen.tsx
SOURCE LOCATION: lines 238–242

### 5. Urge Check (UrgeScreen.tsx)

ID: URGE-001
SCREEN: Urge Check
LOCATION: ScreenHeader title (input phase)
TYPE: screen title
STATE / CONDITION: phase === "input" (also the fallback view)
CURRENT TEXT: فحص الرغبة
PURPOSE / CONTEXT: Screen name
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 151–155

ID: URGE-002
SCREEN: Urge Check
LOCATION: ScreenHeader subtitle (input phase)
TYPE: subtitle
STATE / CONDITION: phase === "input"
CURRENT TEXT: بدأت الرغبة؟ افحص اللي حاصل — عشان تعرف أنسب خطوة. الرغبة إحساس، مش أمر.
PURPOSE / CONTEXT: Reframes the urge as a feeling, not a command
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: line 153

ID: URGE-003
SCREEN: Urge Check
LOCATION: Input phase — scale 1
TYPE: scale label + anchors
STATE / CONDITION: phase === "input"
CURRENT TEXT: ١ · شدة الرغبة — هادئة تقريبًا · أقصى ما أعرفه
PURPOSE / CONTEXT: Urge intensity (1–5)
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 156–162

ID: URGE-004
SCREEN: Urge Check
LOCATION: Input phase — scale 2
TYPE: scale label + anchors
STATE / CONDITION: phase === "input"
CURRENT TEXT: ٢ · مدى قربك من التنفيذ — بعيد تمامًا · على وشك التنفيذ
PURPOSE / CONTEXT: Proximity to acting (1–5)
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 163–169

ID: URGE-005
SCREEN: Urge Check
LOCATION: Input phase — scale 3
TYPE: scale label + anchors
STATE / CONDITION: phase === "input"
CURRENT TEXT: ٣ · فقدان السيطرة — سيطرتي كاملة · بالكاد أقدر أوقف نفسي
PURPOSE / CONTEXT: Loss of control (1–5)
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 170–176

ID: URGE-006
SCREEN: Urge Check
LOCATION: Input phase — context card header
TYPE: card header
STATE / CONDITION: phase === "input"
CURRENT TEXT: السياق الآن (اختياري لكنه مفيد جدًا)
PURPOSE / CONTEXT: Context toggles section
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: line 180

ID: URGE-007
SCREEN: Urge Check
LOCATION: Context toggle — alone
TYPE: toggle chip label
STATE / CONDITION: phase === "input"
CURRENT TEXT: أنا وحدي الآن
PURPOSE / CONTEXT: Alone context marker
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: line 67

ID: URGE-008
SCREEN: Urge Check
LOCATION: Context toggle — late night
TYPE: toggle chip label
STATE / CONDITION: phase === "input"
CURRENT TEXT: الوقت متأخر (بعد ١٠ مساءً)
PURPOSE / CONTEXT: Late-night context marker
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 68–73

ID: URGE-009
SCREEN: Urge Check
LOCATION: Context toggle — in bed
TYPE: toggle chip label
STATE / CONDITION: phase === "input"
CURRENT TEXT: أنا في السرير
PURPOSE / CONTEXT: In-bed context marker
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: line 74

ID: URGE-010
SCREEN: Urge Check
LOCATION: Context toggle — browsing started
TYPE: toggle chip label
STATE / CONDITION: phase === "input"
CURRENT TEXT: بدأت أتصفح أو أدوّر بالفعل
PURPOSE / CONTEXT: Chain-started marker (drives emergency mode)
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 75–80

ID: URGE-011
SCREEN: Urge Check
LOCATION: Context toggle — device needed now
TYPE: toggle chip label
STATE / CONDITION: phase === "input"; default = profile deviceNeeds
CURRENT TEXT: أحتاج الجهاز الآن للعمل/الدراسة
PURPOSE / CONTEXT: Work-safe-in-this-moment marker
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 81–86

ID: URGE-012
SCREEN: Urge Check
LOCATION: Input phase — triggers disclosure
TYPE: collapsible summary
STATE / CONDITION: phase === "input" (collapsed by default)
CURRENT TEXT: ما الذي بدأ الأمر؟ (اختياري — يساعد في اختيار التدخل)
PURPOSE / CONTEXT: Trigger multi-select section
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 201–206

ID: URGE-013
SCREEN: Urge Check
LOCATION: Input phase — disclaimer
TYPE: disclaimer
STATE / CONDITION: phase === "input"
CURRENT TEXT: التقديرات دي منك عن لحظتك، على سلم من ١ لـ ٥ — مش قياس طبي ولا تنبؤ مضمون.
PURPOSE / CONTEXT: Self-report honesty note
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 218–220

ID: URGE-014
SCREEN: Urge Check
LOCATION: Input phase — sticky CTA
TYPE: button label
STATE / CONDITION: phase === "input"
CURRENT TEXT: اعرف أنسب خطوة
PURPOSE / CONTEXT: Compute the verdict
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 225–228

ID: URGE-015
SCREEN: Urge Check
LOCATION: Result phase — degree caption
TYPE: caption
STATE / CONDITION: phase === "result"
CURRENT TEXT: درجة حالتك الآن
PURPOSE / CONTEXT: Label above the big degree number
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: line 241

ID: URGE-016
SCREEN: Urge Check
LOCATION: Result phase — degree suffix
TYPE: degree suffix
STATE / CONDITION: phase === "result"
CURRENT TEXT: من ٥
PURPOSE / CONTEXT: «of 5» next to the number
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: line 247

ID: URGE-017
SCREEN: Urge Check
LOCATION: Result phase — recommended step chip
TYPE: chip label (dynamic)
STATE / CONDITION: phase === "result"; value from MODE_LABELS (TAX-002)
CURRENT TEXT: أنسب خطوة الآن: {modeLabel}
PURPOSE / CONTEXT: Names the recommended mode
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 265–267

ID: URGE-018
SCREEN: Urge Check
LOCATION: Result phase — I7 disclaimer
TYPE: disclaimer
STATE / CONDITION: phase === "result"
CURRENT TEXT: الدرجة دي تقدير مبني على إجاباتك الآن على سلم من ١ لـ ٥ — تساعدك تختار خطوتك، ومش قياس طبي ولا تنبؤ مضمون.
PURPOSE / CONTEXT: Plain-words self-report note where the number shows
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 272–275

ID: URGE-019
SCREEN: Urge Check
LOCATION: Result phase — awareness note (level 1)
TYPE: success note
STATE / CONDITION: mode === "awareness" && level === 1
CURRENT TEXT: ولا حاجة ملحّة دلوقتي — أكمل يومك الطبيعي.
PURPOSE / CONTEXT: Calm verdict
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 281–283

ID: URGE-020
SCREEN: Urge Check
LOCATION: Result phase — awareness note (level 2)
TYPE: success note
STATE / CONDITION: mode === "awareness" && level === 2
CURRENT TEXT: بداية بسيطة — إحساس، مش أمر. ما تطعمهاش بانتباه زايد، واكمل يومك.
PURPOSE / CONTEXT: Early-awareness verdict
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 281–283

ID: URGE-021
SCREEN: Urge Check
LOCATION: Result phase — early-signs card header
TYPE: card header
STATE / CONDITION: mode === "awareness"
CURRENT TEXT: علامات مبكرة تستحق اليقظة
PURPOSE / CONTEXT: Awareness-mode early warning list header
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 287–289

ID: URGE-022
SCREEN: Urge Check
LOCATION: Result phase — early-signs list
TYPE: bullet list (4 items)
STATE / CONDITION: mode === "awareness"
CURRENT TEXT: تذكّر مشاهد أو تطوير خيال · تصفح بلا هدف أو «نظرة سريعة» · التقاط الهاتف آليًا وقت الفراغ · البقاء في السرير بعد الاستيقاظ
PURPOSE / CONTEXT: The four early signs
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 291–296

ID: URGE-023
SCREEN: Urge Check
LOCATION: Result phase — knowledge CTA (awareness)
TYPE: button label
STATE / CONDITION: mode === "awareness"
CURRENT TEXT: اقرأ موضوعًا من قاعدة المعرفة
PURPOSE / CONTEXT: Calm-time reading suggestion
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 297–303

ID: URGE-024
SCREEN: Urge Check
LOCATION: Result phase — new check button
TYPE: button label
STATE / CONDITION: mode === "awareness"
CURRENT TEXT: فحص جديد
PURPOSE / CONTEXT: Re-run the check
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 306–308

ID: URGE-025
SCREEN: Urge Check
LOCATION: Result phase — interrupt note
TYPE: warning note
STATE / CONDITION: mode === "interrupt" (level 3)
CURRENT TEXT: الرغبة بدأت تقوى — اقطعها الآن وهي لسه صغيرة: خطوة قطع واحدة تكفي غالبًا.
PURPOSE / CONTEXT: Early-cut verdict
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 314–317

ID: URGE-026
SCREEN: Urge Check
LOCATION: Result phase — immediate note
TYPE: warning note
STATE / CONDITION: mode === "immediate" (level 4, chain not started)
CURRENT TEXT: قربت من التصرف؟ ما تحللش دلوقتي — ابدأ التدخل فورًا.
PURPOSE / CONTEXT: Act-now verdict
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 314–317

ID: URGE-027
SCREEN: Urge Check
LOCATION: Result phase — anti-rationalization panel header
TYPE: collapsible header (button)
STATE / CONDITION: mode === "interrupt" || mode === "immediate"
CURRENT TEXT: صوت التفاوض يهمس؟ افتح الردود الجاهزة
PURPOSE / CONTEXT: Disclosure for anti-rationalization pairs (TAX-006, first 5)
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 328–331

ID: URGE-028
SCREEN: Urge Check
LOCATION: Result phase — primary CTA (interrupt/immediate)
TYPE: button label
STATE / CONDITION: mode === "interrupt" || mode === "immediate"
CURRENT TEXT: ابدأ التدخل المقترح الآن
PURPOSE / CONTEXT: Open the selected intervention
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 352–354

ID: URGE-029
SCREEN: Urge Check
LOCATION: Result phase — emergency alternative
TYPE: button label
STATE / CONDITION: mode === "interrupt" || mode === "immediate"
CURRENT TEXT: ابدأ وضع الطوارئ بدلًا منه
PURPOSE / CONTEXT: Escalate to emergency instead
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 355–368

ID: URGE-030
SCREEN: Urge Check
LOCATION: Result phase — maximum crisis note
TYPE: danger note (bold + sentence)
STATE / CONDITION: mode === "maximum" (level 5)
CURRENT TEXT: أزمة فورية — لا تقرأ أكثر. اضغط الزر وابدأ أول خطوة قطع الآن.
PURPOSE / CONTEXT: Crisis-mode minimal-reading verdict
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 374–377

ID: URGE-031
SCREEN: Urge Check
LOCATION: Result phase — emergency CTA
TYPE: button label (destructive)
STATE / CONDITION: mode === "emergency" || mode === "maximum"
CURRENT TEXT: تدخّل الآن — وضع الطوارئ
PURPOSE / CONTEXT: Enter emergency mode
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 379–393

ID: URGE-032
SCREEN: Urge Check
LOCATION: Result phase — emergency explainer
TYPE: helper text
STATE / CONDITION: mode === "emergency" (level 4 + chain started)
CURRENT TEXT: سنعرض لك خطوات قليلة وواضحة فقط — كلما ارتفع الخطر قلّت الخيارات.
PURPOSE / CONTEXT: Sets expectation for the overlay
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 394–398

ID: URGE-033
SCREEN: Urge Check
LOCATION: Intervention phase — title
TYPE: screen title
STATE / CONDITION: phase === "intervention"
CURRENT TEXT: نفّذ التدخل
PURPOSE / CONTEXT: Intervention execution heading
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 409–412

ID: URGE-034
SCREEN: Urge Check
LOCATION: Intervention phase — subtitle
TYPE: subtitle
STATE / CONDITION: phase === "intervention"
CURRENT TEXT: خطوة واحدة فقط — لا تحتاج حل كل شيء الآن.
PURPOSE / CONTEXT: One-step framing
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: line 411

ID: URGE-035
SCREEN: Urge Check
LOCATION: Intervention phase — skip link
TYPE: ghost button label
STATE / CONDITION: phase === "intervention"
CURRENT TEXT: تخطي إلى إعادة التقييم
PURPOSE / CONTEXT: Skip the intervention to reassess
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 415–421

ID: URGE-036
SCREEN: Urge Check
LOCATION: Outcome phase — title
TYPE: screen title
STATE / CONDITION: phase === "outcome"
CURRENT TEXT: بعد التدخل
PURPOSE / CONTEXT: Post-intervention heading
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 429–432

ID: URGE-037
SCREEN: Urge Check
LOCATION: Outcome phase — subtitle
TYPE: subtitle
STATE / CONDITION: phase === "outcome"
CURRENT TEXT: الخطر هبط ولا لسه؟
PURPOSE / CONTEXT: Reassessment question
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: line 431

ID: URGE-038
SCREEN: Urge Check
LOCATION: Outcome phase — option 1 headline
TYPE: option headline
STATE / CONDITION: phase === "outcome"
CURRENT TEXT: نعم، هبطت
PURPOSE / CONTEXT: Handled outcome
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 442–443

ID: URGE-039
SCREEN: Urge Check
LOCATION: Outcome phase — option 1 subtext
TYPE: option subtext
STATE / CONDITION: phase === "outcome"
CURRENT TEXT: ارجع ليومك — الموجة دي مسجّلة وبتتحسب ليك
PURPOSE / CONTEXT: Explains the handled outcome effect
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 444–446

ID: URGE-040
SCREEN: Urge Check
LOCATION: Outcome phase — option 2 headline
TYPE: option headline
STATE / CONDITION: phase === "outcome"
CURRENT TEXT: لا، لسه مرتفعة
PURPOSE / CONTEXT: Escalated outcome
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 456–457

ID: URGE-041
SCREEN: Urge Check
LOCATION: Outcome phase — option 2 subtext
TYPE: option subtext
STATE / CONDITION: phase === "outcome"
CURRENT TEXT: نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام
PURPOSE / CONTEXT: Normalizes escalation
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 458–460

ID: URGE-042
SCREEN: Urge Check
LOCATION: Outcome phase — option 3 headline
TYPE: option headline
STATE / CONDITION: phase === "outcome"
CURRENT TEXT: رجعت للسلوك
PURPOSE / CONTEXT: Acted outcome (goes to Stop flow)
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 470–471

ID: URGE-043
SCREEN: Urge Check
LOCATION: Outcome phase — option 3 subtext
TYPE: option subtext
STATE / CONDITION: phase === "outcome"
CURRENT TEXT: لا عقاب ولا جلد — المهم دلوقتي: ما تكمّلش
PURPOSE / CONTEXT: Anti-shame framing for the acted outcome
SOURCE FILE: src/components/app/screens/UrgeScreen.tsx
SOURCE LOCATION: lines 472–474

### 6. Emergency (EmergencyMode.tsx)

ID: EMERGENCY-001
SCREEN: Emergency
LOCATION: Overlay root — aria-label
TYPE: accessibility label
STATE / CONDITION: overlay open (all steps)
CURRENT TEXT: وضع الطوارئ
PURPOSE / CONTEXT: alertdialog name
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: line 434

ID: EMERGENCY-002
SCREEN: Emergency
LOCATION: Header — h1
TYPE: heading
STATE / CONDITION: overlay open (all steps)
CURRENT TEXT: تدخّل الآن
PURPOSE / CONTEXT: Emergency overlay title
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 462–464

ID: EMERGENCY-003
SCREEN: Emergency
LOCATION: Header — standing instruction line 1
TYPE: instruction
STATE / CONDITION: overlay open (all steps)
CURRENT TEXT: ما تحللش دلوقتي.
PURPOSE / CONTEXT: No-analysis directive
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 466–468

ID: EMERGENCY-004
SCREEN: Emergency
LOCATION: Header — standing instruction line 2
TYPE: instruction
STATE / CONDITION: overlay open (all steps)
CURRENT TEXT: نفّذ الخطوة الحالية فقط.
PURPOSE / CONTEXT: One-step directive
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 466–470

ID: EMERGENCY-005
SCREEN: Emergency
LOCATION: Header — step indicator
TYPE: step indicator (dynamic)
STATE / CONDITION: steps 1–4 (and the escalated step shown as 4)
CURRENT TEXT: الخطوة {n} من 4
PURPOSE / CONTEXT: Step progress
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 472–475

ID: EMERGENCY-006
SCREEN: Emergency
LOCATION: Header — degree badge
TYPE: badge (dynamic)
STATE / CONDITION: overlay open; {n} = riskLevel (1–5)
CURRENT TEXT: درجة الحالة: {n} من ٥
PURPOSE / CONTEXT: State degree display
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 477–479

ID: EMERGENCY-007
SCREEN: Emergency
LOCATION: Header — degree badge crisis suffix
TYPE: badge suffix
STATE / CONDITION: riskLevel >= 5 (maximum) only
CURRENT TEXT: — أزمة
PURPOSE / CONTEXT: Crisis marker appended to EMERGENCY-006
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: line 478

ID: EMERGENCY-008
SCREEN: Emergency
LOCATION: Step 1 — main instruction (work-safe)
TYPE: instruction
STATE / CONDITION: step === 1 && workSafe === true
CURRENT TEXT: أغلق كل التبويبات والتطبيقات غير المتصلة بمهمتك — أبقِ مهمة العمل وحدها.
PURPOSE / CONTEXT: Work-safe cut instruction
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 277–279

ID: EMERGENCY-009
SCREEN: Emergency
LOCATION: Step 1 — main instruction (default)
TYPE: instruction
STATE / CONDITION: step === 1 && workSafe === false
CURRENT TEXT: أغلق المصدر الآن: التبويب، التطبيق، أو الصفحة — بلا قراءة سطر إضافي.
PURPOSE / CONTEXT: Standard cut-source instruction
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: line 279

ID: EMERGENCY-010
SCREEN: Emergency
LOCATION: Step 2 — main instruction
TYPE: instruction
STATE / CONDITION: step === 2
CURRENT TEXT: اخرج من المكان لأي مكان فيه ناس أو حركة — ومش لازم تخبر حد بأي حاجة.
PURPOSE / CONTEXT: Leave-the-place instruction
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 280–281

ID: EMERGENCY-011
SCREEN: Emergency
LOCATION: Steps 1–2 — primary CTA
TYPE: button label
STATE / CONDITION: step === 1 || step === 2
CURRENT TEXT: تم
PURPOSE / CONTEXT: Advance to the next step
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 303–310

ID: EMERGENCY-012
SCREEN: Emergency
LOCATION: Steps 1–2 — exit link
TYPE: text button label
STATE / CONDITION: step === 1 || step === 2
CURRENT TEXT: خروج من وضع الطوارئ
PURPOSE / CONTEXT: Explicit exit control
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 311–318

ID: EMERGENCY-013
SCREEN: Emergency
LOCATION: Step 3 — header title
TYPE: step title
STATE / CONDITION: step === 3 && !escalated
CURRENT TEXT: نفّذ تدخلًا واحدًا
PURPOSE / CONTEXT: Intervention step heading
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 167–171

ID: EMERGENCY-014
SCREEN: Emergency
LOCATION: Step 3 (escalated) — header title
TYPE: step title
STATE / CONDITION: step === 3 && escalated === true
CURRENT TEXT: تدخل أقوى
PURPOSE / CONTEXT: Stronger-intervention step heading
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 167–171

ID: EMERGENCY-015
SCREEN: Emergency
LOCATION: Step 3 — primary CTA
TYPE: button label
STATE / CONDITION: step === 3
CURRENT TEXT: تم — الخطوة التالية
PURPOSE / CONTEXT: Log use and advance to reassess
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 202–212

ID: EMERGENCY-016
SCREEN: Emergency
LOCATION: Step 3 (escalated) — support box header
TYPE: box header
STATE / CONDITION: escalated === true
CURRENT TEXT: إن أمكن فورًا:
PURPOSE / CONTEXT: Header for human-contact actions
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 216–219

ID: EMERGENCY-017
SCREEN: Emergency
LOCATION: Step 3 (escalated) — call button
TYPE: button label (dynamic)
STATE / CONDITION: escalated && supportPerson.phone set
CURRENT TEXT: اتصل بـ{supportPerson.label}
PURPOSE / CONTEXT: Direct call link
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 221–229

ID: EMERGENCY-018
SCREEN: Emergency
LOCATION: Step 3 (escalated) — no-support fallback
TYPE: helper text (dynamic)
STATE / CONDITION: escalated && no supportPerson.phone
CURRENT TEXT: «{SUPPORT_MESSAGE_TEMPLATES[0]}» — أرسلها لأي شخص تثق به
PURPOSE / CONTEXT: Fallback when no support person configured (template text in TAX-012)
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 230–234

ID: EMERGENCY-019
SCREEN: Emergency
LOCATION: Step 4 — header title
TYPE: step title
STATE / CONDITION: step === 4
CURRENT TEXT: هبط الخطر؟
PURPOSE / CONTEXT: Reassessment question
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: line 247

ID: EMERGENCY-020
SCREEN: Emergency
LOCATION: Step 4 — option «yes»
TYPE: button label
STATE / CONDITION: step === 4
CURRENT TEXT: نعم — هبط
PURPOSE / CONTEXT: Success path to the done screen
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 249–258

ID: EMERGENCY-021
SCREEN: Emergency
LOCATION: Step 4 — option «no»
TYPE: button label
STATE / CONDITION: step === 4
CURRENT TEXT: لا — لسه مرتفع: جرّب تدخلًا أقوى
PURPOSE / CONTEXT: Escalation path
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 259–266

ID: EMERGENCY-022
SCREEN: Emergency
LOCATION: Done screen — heading
TYPE: heading
STATE / CONDITION: done === true
CURRENT TEXT: هبط الخطر — أحسنت
PURPOSE / CONTEXT: Completion heading
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: line 119

ID: EMERGENCY-023
SCREEN: Emergency
LOCATION: Done screen — body
TYPE: paragraph
STATE / CONDITION: done === true
CURRENT TEXT: ارجع ليومك الطبيعي. سجّلنا إنك تعاملت مع الموجة — وده بيتراكم في مؤشراتك.
PURPOSE / CONTEXT: Completion message
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 120–123

ID: EMERGENCY-024
SCREEN: Emergency
LOCATION: Done screen — primary CTA
TYPE: button label
STATE / CONDITION: done === true
CURRENT TEXT: عودة إلى يومي
PURPOSE / CONTEXT: Close the overlay
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 124–134

ID: EMERGENCY-025
SCREEN: Emergency
LOCATION: PersonalWhy block — label
TYPE: block label
STATE / CONDITION: PersonalWhy rendered (done screen, or step 4 when !maximum) && why text or whyReasons exist
CURRENT TEXT: كلماتك أنت
PURPOSE / CONTEXT: The user's own «why» anchor
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 332–361 (label line 341)

ID: EMERGENCY-026
SCREEN: Emergency
LOCATION: Done screen — post-behavior quiet entry
TYPE: text link
STATE / CONDITION: done === true
CURRENT TEXT: رجعت للسلوك؟ ما تكملش — نوقف هنا الأول
PURPOSE / CONTEXT: Bridge to the Stop flow (exact duplicate of HOME-015)
SOURCE FILE: src/components/app/screens/EmergencyMode.tsx
SOURCE LOCATION: lines 144–154

### 7. Stop / Post-behavior (RelapseScreen.tsx)

ID: RELAPSE-001
SCREEN: Stop / Post-behavior
LOCATION: Main view — ScreenHeader title
TYPE: screen title
STATE / CONDITION: view === "main"
CURRENT TEXT: توقّف هنا
PURPOSE / CONTEXT: Screen name (action-oriented, post-Task-10 rename)
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 488–492

ID: RELAPSE-002
SCREEN: Stop / Post-behavior
LOCATION: Main view — ScreenHeader subtitle
TYPE: subtitle
STATE / CONDITION: view === "main"
CURRENT TEXT: رجعت للسلوك؟ ما تكملش — إيقاف فوري، وبعدها نفهم اللي حصل بهدوء.
PURPOSE / CONTEXT: Two-stage flow explanation
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 490

ID: RELAPSE-003
SCREEN: Stop / Post-behavior
LOCATION: Main view — primary CTA
TYPE: button label (destructive)
STATE / CONDITION: view === "main"
CURRENT TEXT: رجعت للسلوك الآن
PURPOSE / CONTEXT: Enter the STOP steps flow
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 494–497

ID: RELAPSE-004
SCREEN: Stop / Post-behavior
LOCATION: Pending-review card — header
TYPE: card header (dynamic)
STATE / CONDITION: view === "main" && unreviewed relapses exist
CURRENT TEXT: مراجعات هادئة بانتظارك ({n})
PURPOSE / CONTEXT: Calm-review queue header
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 502–504

ID: RELAPSE-005
SCREEN: Stop / Post-behavior
LOCATION: Pending-review card — body
TYPE: helper text
STATE / CONDITION: unreviewed relapses exist
CURRENT TEXT: حلّلها حين تهدأ — كل مراجعة تحوّل الحادثة إلى قاعدة وقاية جديدة.
PURPOSE / CONTEXT: When/why to review
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 506–508

ID: RELAPSE-006
SCREEN: Stop / Post-behavior
LOCATION: Pending-review card — per-event button
TYPE: button label (dynamic)
STATE / CONDITION: per pending event (max 3 shown)
CURRENT TEXT: مراجعة تعثر {arabicDateTime(e.ts)}
PURPOSE / CONTEXT: Open a specific review
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 509–520

ID: RELAPSE-007
SCREEN: Stop / Post-behavior
LOCATION: Stats — «stop speed» label
TYPE: metric label
STATE / CONDITION: view === "main"
CURRENT TEXT: سرعة التوقف
PURPOSE / CONTEXT: Average stop-time metric
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 526–537

ID: RELAPSE-008
SCREEN: Stop / Post-behavior
LOCATION: Stats — «stop speed» value variants
TYPE: metric value (dynamic)
STATE / CONDITION: avgStopMinutes: null → «—»; <5 → «فوري تقريبًا»; else «~{n} دقيقة»
CURRENT TEXT: — / فوري تقريبًا / ~{n} دقيقة
PURPOSE / CONTEXT: Stop-speed value formatting
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 528–534

ID: RELAPSE-009
SCREEN: Stop / Post-behavior
LOCATION: Stats — «stop speed» hint
TYPE: metric hint
STATE / CONDITION: always
CURRENT TEXT: متوسط آخر ٣٠ يومًا
PURPOSE / CONTEXT: Metric window
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 535

ID: RELAPSE-010
SCREEN: Stop / Post-behavior
LOCATION: Stats — «second fall prevented» label
TYPE: metric label
STATE / CONDITION: view === "main"
CURRENT TEXT: منع السقوط الثاني
PURPOSE / CONTEXT: Relapses that did not extend into a session
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 538–543

ID: RELAPSE-011
SCREEN: Stop / Post-behavior
LOCATION: Stats — «second fall prevented» hint
TYPE: metric hint (dynamic)
STATE / CONDITION: always; {n} = total relapse events
CURRENT TEXT: من {n} تعثرًا
PURPOSE / CONTEXT: Denominator of the metric
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 541

ID: RELAPSE-012
SCREEN: Stop / Post-behavior
LOCATION: Log card — header
TYPE: card header
STATE / CONDITION: view === "main"
CURRENT TEXT: سجل التعثرات
PURPOSE / CONTEXT: Relapse history header
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 548–550

ID: RELAPSE-013
SCREEN: Stop / Post-behavior
LOCATION: Log card — empty state title
TYPE: empty state title
STATE / CONDITION: relapseEvents.length === 0
CURRENT TEXT: لا سجل بعد
PURPOSE / CONTEXT: Empty log
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 552–556

ID: RELAPSE-014
SCREEN: Stop / Post-behavior
LOCATION: Log card — empty state body
TYPE: empty state body
STATE / CONDITION: relapseEvents.length === 0
CURRENT TEXT: هذا مكان آمن بلا أحكام: إن حدث تعثر، ستجد هنا خطوة إيقاف ومراجعة هادئة.
PURPOSE / CONTEXT: No-shame empty state
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 555

ID: RELAPSE-015
SCREEN: Stop / Post-behavior
LOCATION: Log rows + quick log — time-to-stop options
TYPE: badge/option labels (4)
STATE / CONDITION: per event (log) and as chips in quick log
CURRENT TEXT: توقفت فورًا · خلال دقائق · أقل من ساعة · استغرق أكثر
PURPOSE / CONTEXT: Time-to-stop vocabulary
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 44–49

ID: RELAPSE-016
SCREEN: Stop / Post-behavior
LOCATION: Log row — continuation badge (continued)
TYPE: badge
STATE / CONDITION: per event, continued === true
CURRENT TEXT: استمرت الجلسة
PURPOSE / CONTEXT: Session extended marker
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 570–576

ID: RELAPSE-017
SCREEN: Stop / Post-behavior
LOCATION: Log row — continuation badge (stopped)
TYPE: badge
STATE / CONDITION: per event, continued === false
CURRENT TEXT: أوقف عند حدّه
PURPOSE / CONTEXT: Stopped-at-limit marker
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 570–576

ID: RELAPSE-018
SCREEN: Stop / Post-behavior
LOCATION: Log row — reviewed badge
TYPE: badge
STATE / CONDITION: per event, reviewed === true
CURRENT TEXT: مُراجَع
PURPOSE / CONTEXT: Reviewed marker
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 577–581

ID: RELAPSE-019
SCREEN: Stop / Post-behavior
LOCATION: Log row — review button
TYPE: ghost button label
STATE / CONDITION: per event, reviewed === false
CURRENT TEXT: حلّل
PURPOSE / CONTEXT: Open the calm review for this event
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 585–588

ID: RELAPSE-020
SCREEN: Stop / Post-behavior
LOCATION: Log row — delete button aria-label
TYPE: accessibility label
STATE / CONDITION: per event
CURRENT TEXT: حذف السجل
PURPOSE / CONTEXT: Delete-row screen-reader name
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 593

ID: RELAPSE-021
SCREEN: Stop / Post-behavior
LOCATION: Main view — warning note
TYPE: warning note
STATE / CONDITION: view === "main"
CURRENT TEXT: لا عقاب ولا تعويض قاسٍ بعد التعثر — الإنهاك والحرمان يزيدان الضيق الذي يغذي الدورة نفسها. العودة الهادئة أسرع من العقاب.
PURPOSE / CONTEXT: Anti-punishment guidance
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 606–609

ID: RELAPSE-022
SCREEN: Stop / Post-behavior
LOCATION: Main view — footer link
TYPE: ghost button label
STATE / CONDITION: view === "main"
CURRENT TEXT: تحديث خطة الوقاية بعد كل تعثر
PURPOSE / CONTEXT: Link to prevention
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 611–614

ID: RELAPSE-023
SCREEN: Stop / Post-behavior
LOCATION: STOP flow — heading
TYPE: heading
STATE / CONDITION: view === "stop"
CURRENT TEXT: رجعت للسلوك؟
PURPOSE / CONTEXT: STOP flow title
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 159

ID: RELAPSE-024
SCREEN: Stop / Post-behavior
LOCATION: STOP flow — subheading
TYPE: directive heading
STATE / CONDITION: view === "stop"
CURRENT TEXT: ما تكملش — الوقفة هنا أهم خطوة.
PURPOSE / CONTEXT: Core stop directive
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 160–162

ID: RELAPSE-025
SCREEN: Stop / Post-behavior
LOCATION: STOP flow — steps list
TYPE: instruction list (6 items)
STATE / CONDITION: view === "stop" (revealed one by one)
CURRENT TEXT: أغلق اللي قدامك الآن — مهما كان حجمه. · انهض واخرج من المكان فورًا. · متدورش على «بديل» — البديل جزء من نفس الحلقة. · ارجع لأي نشاط طبيعي — أي مهمة صغيرة ملموسة. · متعاقبش نفسك — لا إنهاك ولا حرمان ولا جلد. · التحليل بعدين لما تهدى — دلوقتي: توقف وبس.
PURPOSE / CONTEXT: The six STOP steps
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 35–42

ID: RELAPSE-026
SCREEN: Stop / Post-behavior
LOCATION: STOP flow — first-step CTA
TYPE: button label
STATE / CONDITION: view === "stop" && stopStep === 0
CURRENT TEXT: أوقفت — الخطوة التالية
PURPOSE / CONTEXT: Acknowledge the first stop step
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 199

ID: RELAPSE-027
SCREEN: Stop / Post-behavior
LOCATION: STOP flow — subsequent CTA
TYPE: button label
STATE / CONDITION: view === "stop" && stopStep > 0
CURRENT TEXT: تم
PURPOSE / CONTEXT: Advance through stop steps
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 199

ID: RELAPSE-028
SCREEN: Stop / Post-behavior
LOCATION: STOP flow — skip link
TYPE: text button label
STATE / CONDITION: view === "stop"
CURRENT TEXT: تخطي إلى التسجيل السريع
PURPOSE / CONTEXT: Skip to the quick log
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 202–208

ID: RELAPSE-029
SCREEN: Stop / Post-behavior
LOCATION: Quick log — ScreenHeader title
TYPE: screen title
STATE / CONDITION: view === "quick"
CURRENT TEXT: تسجيل سريع
PURPOSE / CONTEXT: Quick log heading
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 218–222

ID: RELAPSE-030
SCREEN: Stop / Post-behavior
LOCATION: Quick log — ScreenHeader subtitle
TYPE: subtitle
STATE / CONDITION: view === "quick"
CURRENT TEXT: دقيقة واحدة — بلا تفاصيل صريحة. البيانات تصنع خريطتك.
PURPOSE / CONTEXT: One-minute, no-explicit-details framing
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 220

ID: RELAPSE-031
SCREEN: Stop / Post-behavior
LOCATION: Quick log — triggers question
TYPE: question label
STATE / CONDITION: view === "quick"
CURRENT TEXT: ما الذي بدأ الأمر؟
PURPOSE / CONTEXT: Trigger multi-select (chips = TAX-003)
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 225

ID: RELAPSE-032
SCREEN: Stop / Post-behavior
LOCATION: Quick log — time-to-stop question
TYPE: question label
STATE / CONDITION: view === "quick"
CURRENT TEXT: كم استغرق التوقف؟
PURPOSE / CONTEXT: Stop-time question (options = RELAPSE-015)
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 236

ID: RELAPSE-033
SCREEN: Stop / Post-behavior
LOCATION: Quick log — continuation question
TYPE: question label
STATE / CONDITION: view === "quick"
CURRENT TEXT: هل كمّلت بعد أول مرة؟
PURPOSE / CONTEXT: Session continuation question
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 251

ID: RELAPSE-034
SCREEN: Stop / Post-behavior
LOCATION: Quick log — continuation option «no»
TYPE: chip label
STATE / CONDITION: view === "quick"
CURRENT TEXT: لا — أوقفت عند أولها
PURPOSE / CONTEXT: Did not continue
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 253

ID: RELAPSE-035
SCREEN: Stop / Post-behavior
LOCATION: Quick log — continuation option «yes»
TYPE: chip label
STATE / CONDITION: view === "quick"
CURRENT TEXT: نعم، استمرت الجلسة
PURPOSE / CONTEXT: Continued
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 254

ID: RELAPSE-036
SCREEN: Stop / Post-behavior
LOCATION: Quick log — save CTA
TYPE: button label
STATE / CONDITION: view === "quick"; disabled until both questions answered
CURRENT TEXT: حفظ ومتابعة
PURPOSE / CONTEXT: Save the quick log
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 258–260

ID: RELAPSE-037
SCREEN: Stop / Post-behavior
LOCATION: Reframe view — ScreenHeader title
TYPE: screen title
STATE / CONDITION: view === "reframe"
CURRENT TEXT: بعد التعثر: تذكير مهم
PURPOSE / CONTEXT: Reframe heading
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 269–273

ID: RELAPSE-038
SCREEN: Stop / Post-behavior
LOCATION: Reframe view — ScreenHeader subtitle
TYPE: subtitle
STATE / CONDITION: view === "reframe"
CURRENT TEXT: اقرأها بهدوء ثم عد إلى يومك.
PURPOSE / CONTEXT: Reading instruction
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 271

ID: RELAPSE-039
SCREEN: Stop / Post-behavior
LOCATION: Reframe view — message cards
TYPE: reframe list (4 cards)
STATE / CONDITION: view === "reframe"
CURRENT TEXT: الحدث ده مش بيحدد مستقبلك. · عدّاد الأيام ممكن يبدأ من جديد — لكن خبرتك ما بترجعش للصفر. · تعثر واحد مش يوم ضايع، ولا إذن بالتكملة — الوقفة دلوقتي قرار جديد. · اللي حصل معلومة — استخدمها في تحسين خطة الأيام الجاية.
PURPOSE / CONTEXT: Post-relapse reframe messages
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 275–280

ID: RELAPSE-040
SCREEN: Stop / Post-behavior
LOCATION: Reframe view — info note prefix
TYPE: info note (prefix)
STATE / CONDITION: view === "reframe"
CURRENT TEXT: سجّلنا التعثر ومؤشراتك محفوظة:
PURPOSE / CONTEXT: Saved confirmation prefix
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 290–294

ID: RELAPSE-041
SCREEN: Stop / Post-behavior
LOCATION: Reframe view — info note variant
TYPE: info note (variant)
STATE / CONDITION: qTime === "immediately" / else
CURRENT TEXT: توقفت فورًا — استجابة ممتازة / وقفت — وكل وقفة بتتحسب ليك
PURPOSE / CONTEXT: Acknowledges stop speed
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 292

ID: RELAPSE-042
SCREEN: Stop / Post-behavior
LOCATION: Reframe view — info note suffix
TYPE: info note (suffix)
STATE / CONDITION: view === "reframe"
CURRENT TEXT: . المراجعة الهادئة تنتظرك هنا لاحقًا، لما تكون مستعدًا.
PURPOSE / CONTEXT: Review-later promise
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 292–293

ID: RELAPSE-043
SCREEN: Stop / Post-behavior
LOCATION: Reframe view — primary CTA
TYPE: button label
STATE / CONDITION: view === "reframe"
CURRENT TEXT: العودة إلى يومي الطبيعي
PURPOSE / CONTEXT: Return to normal life
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 296–298

ID: RELAPSE-044
SCREEN: Stop / Post-behavior
LOCATION: Reframe view — secondary CTA
TYPE: button label
STATE / CONDITION: view === "reframe"
CURRENT TEXT: حلّل بهدوء الآن (إن كنت مستعدًا)
PURPOSE / CONTEXT: Optional immediate review
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 299–306

ID: RELAPSE-045
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — ScreenHeader title
TYPE: screen title
STATE / CONDITION: view === "review"
CURRENT TEXT: مراجعة هادئة
PURPOSE / CONTEXT: Calm review heading
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 329–333

ID: RELAPSE-046
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — ScreenHeader subtitle
TYPE: subtitle
STATE / CONDITION: view === "review"
CURRENT TEXT: الهدف مش «ليه أنا ضعيف» — الهدف: نلاقي أبكر نقطة كان ممكن توقف عندها.
PURPOSE / CONTEXT: Anti-shame review framing
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 331

ID: RELAPSE-047
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 1 question
TYPE: question label
STATE / CONDITION: reviewStep === 0
CURRENT TEXT: ١ · ما الذي بدأ الأمر؟
PURPOSE / CONTEXT: Trigger question (chips = TAX-003, first 12)
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 339

ID: RELAPSE-048
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 2 question
TYPE: question label
STATE / CONDITION: reviewStep === 1
CURRENT TEXT: ٢ · ما الذي جعل المقاومة أضعف يومها؟
PURPOSE / CONTEXT: Vulnerability question (chips = TAX-013)
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 358

ID: RELAPSE-049
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 3 question
TYPE: question label
STATE / CONDITION: reviewStep === 2
CURRENT TEXT: ٣ · ما أول علامة ظهرت قبل الحدث؟
PURPOSE / CONTEXT: First-sign question (chips = TAX-005)
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 372

ID: RELAPSE-050
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 3 placeholder
TYPE: placeholder
STATE / CONDITION: reviewStep === 2
CURRENT TEXT: أو اكتب علامتك بأسلوبك…
PURPOSE / CONTEXT: Custom first-sign input
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 384–388

ID: RELAPSE-051
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 4 question
TYPE: question label
STATE / CONDITION: reviewStep === 3
CURRENT TEXT: ٤ · ما أول فعل عملته في الحدث؟
PURPOSE / CONTEXT: First-action question
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 397

ID: RELAPSE-052
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 4 placeholder
TYPE: placeholder
STATE / CONDITION: reviewStep === 3
CURRENT TEXT: مثال: فتحت المتصفح وبدأت أدوّر…
PURPOSE / CONTEXT: First-action input hint
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 398–402

ID: RELAPSE-053
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 5 question
TYPE: question label
STATE / CONDITION: reviewStep === 4
CURRENT TEXT: ٥ · في أي لحظة كبر الأمر؟
PURPOSE / CONTEXT: Escalation-point question
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 411

ID: RELAPSE-054
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 5 placeholder
TYPE: placeholder
STATE / CONDITION: reviewStep === 4
CURRENT TEXT: مثال: بقيت في الغرفة بدل الخروج، و«دقيقة واحدة» صارت جلسة…
PURPOSE / CONTEXT: Escalation input hint
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 412–416

ID: RELAPSE-055
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 6 question
TYPE: question label
STATE / CONDITION: reviewStep === 5
CURRENT TEXT: ٦ · أين كان يمكن التوقف مبكرًا؟ (نقطة القطع الأفضل)
PURPOSE / CONTEXT: Best cut-point question
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 425–427

ID: RELAPSE-056
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — step 6 placeholder
TYPE: placeholder
STATE / CONDITION: reviewStep === 5
CURRENT TEXT: مثال: قبل فتح المتصفح — أو لحظة أول فكرة والانتقال مباشرة…
PURPOSE / CONTEXT: Cut-point input hint
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 428–432

ID: RELAPSE-057
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — lesson label
TYPE: question label
STATE / CONDITION: reviewStep === 5
CURRENT TEXT: درس واحد تحفظه:
PURPOSE / CONTEXT: Lesson input label
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: line 434

ID: RELAPSE-058
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — lesson placeholder
TYPE: placeholder
STATE / CONDITION: reviewStep === 5
CURRENT TEXT: جملة واحدة تكفي…
PURPOSE / CONTEXT: Lesson input hint (same string as PLAN-035)
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 435–439

ID: RELAPSE-059
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — suggested-rule card header
TYPE: card header
STATE / CONDITION: reviewStep === 5 && cut point text entered && not yet added
CURRENT TEXT: قاعدة وقاية مقترحة
PURPOSE / CONTEXT: Suggested prevention rule header
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 442–444

ID: RELAPSE-060
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — suggested-rule preview
TYPE: rule preview (dynamic)
STATE / CONDITION: same as RELAPSE-059; {trigger} from chosen trigger, fallback «السياق الذي حدث» in the saved version
CURRENT TEXT: إذا بدأ الأمر من {trigger} → أتدخل مبكرًا: {cutPoint}
PURPOSE / CONTEXT: If/then rule preview text
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 445–449

ID: RELAPSE-061
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — add-rule CTA
TYPE: button label
STATE / CONDITION: same as RELAPSE-059
CURRENT TEXT: أضفها إلى خطة الوقاية
PURPOSE / CONTEXT: Save the suggested rule
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 450–453

ID: RELAPSE-062
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — rule-added confirmation
TYPE: success note
STATE / CONDITION: suggested rule was added
CURRENT TEXT: أُضيفت القاعدة إلى خطة الوقاية — يمكنك تعديلها هناك متى شئت.
PURPOSE / CONTEXT: Confirms the rule save
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 456–460

ID: RELAPSE-063
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — back button
TYPE: button label
STATE / CONDITION: view === "review"; disabled at step 0
CURRENT TEXT: السابق
PURPOSE / CONTEXT: Wizard back
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 466–471

ID: RELAPSE-064
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — next button
TYPE: button label
STATE / CONDITION: reviewStep < 5; disabled when required answers missing
CURRENT TEXT: التالي
PURPOSE / CONTEXT: Wizard forward
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 473–476

ID: RELAPSE-065
SCREEN: Stop / Post-behavior
LOCATION: Review wizard — save button
TYPE: button label
STATE / CONDITION: reviewStep === 5
CURRENT TEXT: حفظ المراجعة
PURPOSE / CONTEXT: Save the review (same string as PLAN-046)
SOURCE FILE: src/components/app/screens/RelapseScreen.tsx
SOURCE LOCATION: lines 477–479

### 8. Prevention (PreventionScreen.tsx)

ID: PREVENT-001
SCREEN: Prevention
LOCATION: ScreenHeader title
TYPE: screen title
STATE / CONDITION: always
CURRENT TEXT: خطة الوقاية
PURPOSE / CONTEXT: Screen name
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 60–64

ID: PREVENT-002
SCREEN: Prevention
LOCATION: ScreenHeader subtitle
TYPE: subtitle
STATE / CONDITION: always
CURRENT TEXT: قواعد «إذا… إذن» وحمايتك الرقمية — تُصنع في الهدوء لتعمل وقت العاصفة.
PURPOSE / CONTEXT: Screen purpose
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: line 62

ID: PREVENT-003
SCREEN: Prevention
LOCATION: Rules card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: قواعدي «إذا… إذن»
PURPOSE / CONTEXT: User's rules section
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: line 70

ID: PREVENT-004
SCREEN: Prevention
LOCATION: Rules card — add button
TYPE: button label
STATE / CONDITION: always
CURRENT TEXT: قاعدة جديدة
PURPOSE / CONTEXT: Open the add-rule dialog
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 71–83

ID: PREVENT-005
SCREEN: Prevention
LOCATION: Rules card — empty state
TYPE: empty state text
STATE / CONDITION: preventionRules.length === 0
CURRENT TEXT: لا قواعد بعد — أضف قاعدة لأكثر سياقاتك خطورة.
PURPOSE / CONTEXT: Empty rules guidance
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 86–90

ID: PREVENT-006
SCREEN: Prevention
LOCATION: Rule row — «if» badge
TYPE: badge
STATE / CONDITION: per rule
CURRENT TEXT: إذا
PURPOSE / CONTEXT: Prefix badge for the if-part
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 102–106

ID: PREVENT-007
SCREEN: Prevention
LOCATION: Rule row — «then» badge
TYPE: badge
STATE / CONDITION: per rule
CURRENT TEXT: إذن
PURPOSE / CONTEXT: Prefix badge for the then-part
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 108–112

ID: PREVENT-008
SCREEN: Prevention
LOCATION: Rule row — edit button aria-label
TYPE: accessibility label
STATE / CONDITION: per rule
CURRENT TEXT: تعديل
PURPOSE / CONTEXT: Edit-rule screen-reader name
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: line 118

ID: PREVENT-009
SCREEN: Prevention
LOCATION: Rule row — delete button aria-label
TYPE: accessibility label
STATE / CONDITION: per rule
CURRENT TEXT: حذف
PURPOSE / CONTEXT: Delete-rule screen-reader name
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: line 126

ID: PREVENT-010
SCREEN: Prevention
LOCATION: Rule row — toggle title (active)
TYPE: toggle row title
STATE / CONDITION: per rule, active === true
CURRENT TEXT: مُفعّلة
PURPOSE / CONTEXT: Rule active state
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: line 135

ID: PREVENT-011
SCREEN: Prevention
LOCATION: Rule row — toggle title (inactive)
TYPE: toggle row title
STATE / CONDITION: per rule, active === false
CURRENT TEXT: موقوفة
PURPOSE / CONTEXT: Rule paused state
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: line 135

ID: PREVENT-012
SCREEN: Prevention
LOCATION: Digital protection card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: الحماية الرقمية (أدوات خارجية اختيارية)
PURPOSE / CONTEXT: External tools section
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 148–151

ID: PREVENT-013
SCREEN: Prevention
LOCATION: Digital protection guides — limits prefix
TYPE: label
STATE / CONDITION: per guide (expanded)
CURRENT TEXT: حدوده:
PURPOSE / CONTEXT: Prefix for each guide's limits line (guides = TAX-010)
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 170–172

ID: PREVENT-014
SCREEN: Prevention
LOCATION: Digital protection card — timing note
TYPE: info note
STATE / CONDITION: always
CURRENT TEXT: لا تضبط هذه الأدوات أثناء أزمة (درجة الحالة ٥) — جهّزها مسبقًا في وقت هادئ.
PURPOSE / CONTEXT: Prepare-in-calm guidance
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 177–179

ID: PREVENT-015
SCREEN: Prevention
LOCATION: Support person card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: شخص دعم (اختياري تمامًا)
PURPOSE / CONTEXT: Support person section
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 186–189

ID: PREVENT-016
SCREEN: Prevention
LOCATION: Support person card — body
TYPE: helper text
STATE / CONDITION: always
CURRENT TEXT: شخص تثق به — يظهر زر اتصاله في التصعيد. لن يُكشف له أي شيء تلقائيًا؛ الرسائل محايدة تمامًا.
PURPOSE / CONTEXT: Explains the support-person mechanism
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 190–193

ID: PREVENT-017
SCREEN: Prevention
LOCATION: Support person card — name input placeholder
TYPE: placeholder
STATE / CONDITION: always
CURRENT TEXT: سمّه ما شئت (أخي، صديقي…)
PURPOSE / CONTEXT: Label input hint
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 195–199

ID: PREVENT-018
SCREEN: Prevention
LOCATION: Support person card — phone input placeholder
TYPE: placeholder
STATE / CONDITION: always
CURRENT TEXT: رقمه (يُخزن محليًا فقط)
PURPOSE / CONTEXT: Phone input hint
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 200–208

ID: PREVENT-019
SCREEN: Prevention
LOCATION: Support person card — save button (update variant)
TYPE: button label
STATE / CONDITION: supportPerson already saved
CURRENT TEXT: تحديث
PURPOSE / CONTEXT: Update the support person
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 210–221

ID: PREVENT-020
SCREEN: Prevention
LOCATION: Support person card — save button (first save variant)
TYPE: button label
STATE / CONDITION: no supportPerson saved yet
CURRENT TEXT: حفظ
PURPOSE / CONTEXT: Save the support person
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 210–221

ID: PREVENT-021
SCREEN: Prevention
LOCATION: Support person card — call link
TYPE: link label (dynamic)
STATE / CONDITION: supportPerson saved
CURRENT TEXT: اتصل بـ{supportPerson.label}
PURPOSE / CONTEXT: Direct call (same pattern as EMERGENCY-017)
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 222–230

ID: PREVENT-022
SCREEN: Prevention
LOCATION: Support person card — remove button
TYPE: button label
STATE / CONDITION: supportPerson saved
CURRENT TEXT: إزالة
PURPOSE / CONTEXT: Remove the support person
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 231–235

ID: PREVENT-023
SCREEN: Prevention
LOCATION: Support person card — templates header
TYPE: box label
STATE / CONDITION: always
CURRENT TEXT: قوالب رسائل محايدة (انسخها عند الحاجة):
PURPOSE / CONTEXT: Header for message templates (chips = TAX-012)
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 237–240

ID: PREVENT-024
SCREEN: Prevention
LOCATION: Rule dialog — title (edit variant)
TYPE: dialog title
STATE / CONDITION: editing an existing rule
CURRENT TEXT: تعديل القاعدة
PURPOSE / CONTEXT: Edit-rule dialog heading
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: line 256

ID: PREVENT-025
SCREEN: Prevention
LOCATION: Rule dialog — title (new variant)
TYPE: dialog title
STATE / CONDITION: adding a new rule
CURRENT TEXT: قاعدة وقاية جديدة
PURPOSE / CONTEXT: Add-rule dialog heading
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: line 256

ID: PREVENT-026
SCREEN: Prevention
LOCATION: Rule dialog — «if» question
TYPE: question label
STATE / CONDITION: dialog open
CURRENT TEXT: حدث ماذا؟
PURPOSE / CONTEXT: If-part input label (badge «إذا» beside it)
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 260–265

ID: PREVENT-027
SCREEN: Prevention
LOCATION: Rule dialog — «if» placeholder
TYPE: placeholder
STATE / CONDITION: dialog open
CURRENT TEXT: مثال: شعرت بالملل والتقطت الهاتف بلا هدف…
PURPOSE / CONTEXT: If-part input hint
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 266–271

ID: PREVENT-028
SCREEN: Prevention
LOCATION: Rule dialog — «then» question
TYPE: question label
STATE / CONDITION: dialog open
CURRENT TEXT: ماذا أفعل فورًا؟
PURPOSE / CONTEXT: Then-part input label (badge «إذن» beside it)
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 273–279

ID: PREVENT-029
SCREEN: Prevention
LOCATION: Rule dialog — «then» placeholder
TYPE: placeholder
STATE / CONDITION: dialog open
CURRENT TEXT: مثال: أغلقه وأنهض وأمشي ١٠ دقائق…
PURPOSE / CONTEXT: Then-part input hint
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 280–285

ID: PREVENT-030
SCREEN: Prevention
LOCATION: Rule dialog — save (edit variant)
TYPE: button label
STATE / CONDITION: editing; disabled until both fields non-empty
CURRENT TEXT: حفظ التعديل
PURPOSE / CONTEXT: Save the edited rule
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 287–289

ID: PREVENT-031
SCREEN: Prevention
LOCATION: Rule dialog — save (new variant)
TYPE: button label
STATE / CONDITION: adding; disabled until both fields non-empty
CURRENT TEXT: أضف القاعدة
PURPOSE / CONTEXT: Save the new rule
SOURCE FILE: src/components/app/screens/PreventionScreen.tsx
SOURCE LOCATION: lines 287–289

ID: PREVENT-032
SCREEN: Prevention
LOCATION: Seeded default rules (rendered as rule rows on first run)
TYPE: seed content (4 if/then pairs)
STATE / CONDITION: fresh install — shown until edited/deleted
CURRENT TEXT: إذا: شعرت بالملل والتقطت الهاتف بلا هدف → إذن: أغلقه فورًا وأنهض من مكاني
إذا: بدأت بالبحث عن محفز → إذن: أغلق المتصفح وأغيّر المكان
إذا: وصلت درجة الرغبة ٣ من ٥ → إذن: أبدأ خطوة قطع فورًا
إذا: كنت وحدي ليلًا وبدأت الرغبة → إذن: أخرج من الغرفة
PURPOSE / CONTEXT: The four onboarding-promised rules
SOURCE FILE: src/lib/app/store.ts
SOURCE LOCATION: lines 325–355

### 9. Trigger Map (TriggerMapScreen.tsx)

ID: TRIGGER-001
SCREEN: Trigger Map
LOCATION: ScreenHeader title
TYPE: screen title
STATE / CONDITION: always (both empty and full states)
CURRENT TEXT: خريطة المحفزات
PURPOSE / CONTEXT: Screen name
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 50–53 and 69–72

ID: TRIGGER-002
SCREEN: Trigger Map
LOCATION: ScreenHeader subtitle (insufficient data)
TYPE: subtitle
STATE / CONDITION: totalEvents < 3
CURRENT TEXT: «المحفز» هو ما بدأ الموجة عادةً — الملل، التصفح، التأخير… أنماطك تُرسم من سجلك تلقائيًا مع كل فحص رغبة.
PURPOSE / CONTEXT: Explains the screen + how it fills
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: line 52

ID: TRIGGER-003
SCREEN: Trigger Map
LOCATION: ScreenHeader subtitle (data ready)
TYPE: subtitle
STATE / CONDITION: totalEvents >= 3
CURRENT TEXT: أنماطك المكتشفة — الهدف: أبكر نقطة تقدر توقف عندها.
PURPOSE / CONTEXT: Purpose statement
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: line 71

ID: TRIGGER-004
SCREEN: Trigger Map
LOCATION: Empty state — title
TYPE: empty state title
STATE / CONDITION: totalEvents < 3
CURRENT TEXT: نحتاج قليلًا من السجل أولًا
PURPOSE / CONTEXT: Data-needed message
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 55–59

ID: TRIGGER-005
SCREEN: Trigger Map
LOCATION: Empty state — body
TYPE: empty state body
STATE / CONDITION: totalEvents < 3
CURRENT TEXT: سجّل ٣–٤ فحوصات رغبة (حتى الخفيف منها) وسيبدأ التطبيق برسم أنماطك: أكثر المحفزات، أخطر الأوقات، ونقطة التدخل الأفضل.
PURPOSE / CONTEXT: How to unlock the map
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: line 58

ID: TRIGGER-006
SCREEN: Trigger Map
LOCATION: Empty state — info note
TYPE: info note
STATE / CONDITION: totalEvents < 3
CURRENT TEXT: الغرض ليس تسجيل التاريخ — بل اكتشاف أبكر نقطة تدخل في سلسلتك.
PURPOSE / CONTEXT: Purpose framing
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 60–62

ID: TRIGGER-007
SCREEN: Trigger Map
LOCATION: Top pattern card — header
TYPE: card header (dynamic)
STATE / CONDITION: topPattern exists
CURRENT TEXT: نمطك الأخطر ({n} مرة)
PURPOSE / CONTEXT: Most dangerous context pattern
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 79–82

ID: TRIGGER-008
SCREEN: Trigger Map
LOCATION: Top pattern card — first-sign line
TYPE: insight line (dynamic)
STATE / CONDITION: topPattern exists && firstSign exists
CURRENT TEXT: أول علامة عادةً: {firstSign.id}
PURPOSE / CONTEXT: Usual first warning sign
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 93–97

ID: TRIGGER-009
SCREEN: Trigger Map
LOCATION: Top pattern card — cut point line
TYPE: insight line (dynamic)
STATE / CONDITION: bestCutPoint exists
CURRENT TEXT: نقطة التدخل الأفضل: {bestCutPoint}
PURPOSE / CONTEXT: Best intervention point
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 98–102

ID: TRIGGER-010
SCREEN: Trigger Map
LOCATION: Top pattern card — no cut point fallback
TYPE: fallback text
STATE / CONDITION: topPattern exists && !bestCutPoint
CURRENT TEXT: أنجز مراجعة هادئة لتعثر واحد، وستظهر هنا «نقطة التدخل الأفضل» في سلسلتك.
PURPOSE / CONTEXT: How to unlock the cut point
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 103–107

ID: TRIGGER-011
SCREEN: Trigger Map
LOCATION: Time distribution card — header
TYPE: card header
STATE / CONDITION: totalEvents >= 3
CURRENT TEXT: توزيع أوقات الخطر
PURPOSE / CONTEXT: Time-of-day chart header (rows = TAX-018)
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 115–118

ID: TRIGGER-012
SCREEN: Trigger Map
LOCATION: Time distribution card — insight line
TYPE: insight line (dynamic)
STATE / CONDITION: mostRiskyTime exists
CURRENT TEXT: أكثر وقت يحتاج حماية: {bucketLabel} — خطّط له مبكرًا (قواعد «إذا… إذن» وبروتوكول الليل).
PURPOSE / CONTEXT: Most risky time recommendation
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 143–148

ID: TRIGGER-013
SCREEN: Trigger Map
LOCATION: Trigger frequencies card — header
TYPE: card header
STATE / CONDITION: totalEvents >= 3
CURRENT TEXT: محفزاتك الأكثر تكرارًا
PURPOSE / CONTEXT: Frequency list header (group labels = TAX-004)
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 155–158

ID: TRIGGER-014
SCREEN: Trigger Map
LOCATION: Trigger frequencies card — empty
TYPE: empty text
STATE / CONDITION: no recorded triggers at all
CURRENT TEXT: لم تسجل محفزات في فحوصاتك بعد.
PURPOSE / CONTEXT: No-trigger-data message
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 159–161

ID: TRIGGER-015
SCREEN: Trigger Map
LOCATION: Top trigger info note
TYPE: info note (dynamic)
STATE / CONDITION: topTrigger exists
CURRENT TEXT: أكثر محفز متكرر: {label} ({n} مرة). أقوى تدخل له عادةً: تغيير البيئة فور ظهوره — قبل أي تفاوض داخلي.
PURPOSE / CONTEXT: Most frequent trigger + advice
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 182–187

ID: TRIGGER-016
SCREEN: Trigger Map
LOCATION: Best intervention info note
TYPE: info note (dynamic)
STATE / CONDITION: bestIntervention exists
CURRENT TEXT: أفضل تدخل لديك: {name} (نجح {n} مرة). النظام سيرجّحه تلقائيًا في المقترحات.
PURPOSE / CONTEXT: Best-working intervention
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 188–193

ID: TRIGGER-017
SCREEN: Trigger Map
LOCATION: Screen footer info note
TYPE: disclaimer
STATE / CONDITION: totalEvents >= 3
CURRENT TEXT: هذه أنماط سلوكية مرصودة من سجلك — وليست تشخيصًا. الهدف العملي: أبكر نقطة تقدر توقف عندها.
PURPOSE / CONTEXT: Not-a-diagnosis disclaimer
SOURCE FILE: src/components/app/screens/TriggerMapScreen.tsx
SOURCE LOCATION: lines 194–198

ID: TRIGGER-018
SCREEN: Trigger Map
LOCATION: Top-pattern context chips (generated parts)
TYPE: pattern part labels
STATE / CONDITION: per pattern with that context flag set
CURRENT TEXT: الليل المتأخر · الوحدة · السرير · التصفح المتشعب
PURPOSE / CONTEXT: Context parts joined into the «نمطك الأخطر» chips
SOURCE FILE: src/lib/app/progress.ts
SOURCE LOCATION: lines 200–203

### 10. Progress (ProgressScreen.tsx)

ID: PROGRESS-001
SCREEN: Progress
LOCATION: ScreenHeader title
TYPE: screen title
STATE / CONDITION: always
CURRENT TEXT: التقدم
PURPOSE / CONTEXT: Screen name
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 24–28

ID: PROGRESS-002
SCREEN: Progress
LOCATION: ScreenHeader subtitle
TYPE: subtitle
STATE / CONDITION: always
CURRENT TEXT: مؤشرات متعددة صادقة — لا نسبة تعافٍ زائفة، ولا يوم يعود إلى الصفر.
PURPOSE / CONTEXT: Anti-fake-metric framing
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 26

ID: PROGRESS-003
SCREEN: Progress
LOCATION: Journey card — label
TYPE: card label
STATE / CONDITION: always
CURRENT TEXT: رحلة اليوم
PURPOSE / CONTEXT: Journey card caption
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 35

ID: PROGRESS-004
SCREEN: Progress
LOCATION: Journey card — day display
TYPE: dynamic label
STATE / CONDITION: always; {n} = daysSinceStart
CURRENT TEXT: اليوم {n}
PURPOSE / CONTEXT: Big day counter
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 36–38

ID: PROGRESS-005
SCREEN: Progress
LOCATION: Journey card — stage caption
TYPE: caption
STATE / CONDITION: always
CURRENT TEXT: المرحلة
PURPOSE / CONTEXT: Caption above the stage label (stage = TAX-007)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 41

ID: PROGRESS-006
SCREEN: Progress
LOCATION: Journey card — stepper end labels
TYPE: stepper labels
STATE / CONDITION: always
CURRENT TEXT: تثبيت · المدى الطويل
PURPOSE / CONTEXT: First/last stage labels under the stepper
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 58–61

ID: PROGRESS-007
SCREEN: Progress
LOCATION: Streak tiles — label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: أيام منذ آخر تعثر
PURPOSE / CONTEXT: Streak metric
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 70–74

ID: PROGRESS-008
SCREEN: Progress
LOCATION: Streak tiles — hint
TYPE: metric hint
STATE / CONDITION: always
CURRENT TEXT: مؤشر واحد من ضمن المؤشرات
PURPOSE / CONTEXT: Streak is not the center
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 73

ID: PROGRESS-009
SCREEN: Progress
LOCATION: Streak tiles — label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: سلسلة المراجعات
PURPOSE / CONTEXT: Check-in streak metric
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 75–80

ID: PROGRESS-010
SCREEN: Progress
LOCATION: Streak tiles — value format
TYPE: metric value (dynamic)
STATE / CONDITION: always; {n} = checkInStreak
CURRENT TEXT: {n} يوم
PURPOSE / CONTEXT: Streak value unit
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 77

ID: PROGRESS-011
SCREEN: Progress
LOCATION: Streak tiles — hint
TYPE: metric hint
STATE / CONDITION: always
CURRENT TEXT: مراجعات مسائية متتابعة
PURPOSE / CONTEXT: Streak metric definition
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 78

ID: PROGRESS-012
SCREEN: Progress
LOCATION: Skills indicators card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: مؤشرات المهارات
PURPOSE / CONTEXT: Skills metrics section
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 86–89

ID: PROGRESS-013
SCREEN: Progress
LOCATION: Skills indicators — label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: رغبات تعاملت معها
PURPOSE / CONTEXT: Handled urges metric (same label as HOME-041)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 91–96

ID: PROGRESS-014
SCREEN: Progress
LOCATION: Skills indicators — hint (dynamic)
STATE / CONDITION: always; {n} = urgesHandled7d
TYPE: metric hint
CURRENT TEXT: {n} خلال آخر ٧ أيام
PURPOSE / CONTEXT: 7-day window (compare HOME-042 «أسبوع»)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 94

ID: PROGRESS-015
SCREEN: Progress
LOCATION: Skills indicators — label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: تدخلات مبكرة
PURPOSE / CONTEXT: Early interventions metric (same label as HOME-043)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 97–102

ID: PROGRESS-016
SCREEN: Progress
LOCATION: Skills indicators — hint
TYPE: metric hint
STATE / CONDITION: always
CURRENT TEXT: عند درجة ٣ أو أقل — خلال ٣٠ يومًا
PURPOSE / CONTEXT: Metric definition (compare HOME-044 «خلال ٣٠ يومًا»)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 100

ID: PROGRESS-017
SCREEN: Progress
LOCATION: Skills indicators — label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: جلسات أوقفتها مبكرًا
PURPOSE / CONTEXT: Sessions stopped early metric
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 103–108

ID: PROGRESS-018
SCREEN: Progress
LOCATION: Skills indicators — hint
TYPE: metric hint
STATE / CONDITION: always
CURRENT TEXT: توقفت خلال دقائق من التعثر
PURPOSE / CONTEXT: Metric definition
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 106

ID: PROGRESS-019
SCREEN: Progress
LOCATION: Skills indicators — label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: منع السقوط الثاني
PURPOSE / CONTEXT: Second-fall metric (same label as RELAPSE-010)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 109–114

ID: PROGRESS-020
SCREEN: Progress
LOCATION: Skills indicators — hint
TYPE: metric hint
STATE / CONDITION: always
CURRENT TEXT: تعثرات لم تتحول لجلسة ممتدة
PURPOSE / CONTEXT: Metric definition (compare RELAPSE-011 «من {n} تعثرًا»)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: line 112

ID: PROGRESS-021
SCREEN: Progress
LOCATION: Response & stability card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: مؤشرات الاستجابة والاستقرار
PURPOSE / CONTEXT: Response metrics section
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 120–124

ID: PROGRESS-022
SCREEN: Progress
LOCATION: Response indicators — «stop speed» label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: سرعة التوقف
PURPOSE / CONTEXT: Stop-speed metric (same label as RELAPSE-007)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 126–143

ID: PROGRESS-023
SCREEN: Progress
LOCATION: Response indicators — «stop speed» value + hint variants
TYPE: metric value/hint (dynamic)
STATE / CONDITION: avgStopMinutes null → «—» / <5 → «فوري» / else «~{n} د»; hint by stopTrend better/worse/stable
CURRENT TEXT: — / فوري / ~{n} د — أسرع من الشهر السابق ✓ / أبطأ قليلًا — راجع نقاط القطع / متوسط زمن التوقف بعد التعثر
PURPOSE / CONTEXT: Stop-speed display (shorter unit «د» vs RELAPSE-008 «دقيقة»)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 128–141

ID: PROGRESS-024
SCREEN: Progress
LOCATION: Response indicators — «behavior frequency» label
TYPE: metric label
STATE / CONDITION: always
CURRENT TEXT: تكرار السلوك
PURPOSE / CONTEXT: Relapse frequency metric
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 144–155

ID: PROGRESS-025
SCREEN: Progress
LOCATION: Response indicators — «behavior frequency» value + hint variants
TYPE: metric value/hint (dynamic)
STATE / CONDITION: relapsePerWeek null → «—» / else «{n}/أسبوع»; hint by relapseTrend
CURRENT TEXT: — / {n}/أسبوع — منخفض عن السابق ✓ / مرتفع — راجع حماية أوقات الخطر / آخر ٤ أسابيع
PURPOSE / CONTEXT: Frequency display + trend hints
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 145–153

ID: PROGRESS-026
SCREEN: Progress
LOCATION: Response indicators — «trigger awareness» label + hint
TYPE: metric label + hint
STATE / CONDITION: always
CURRENT TEXT: وعي بالمحفزات — محفزات مختلفة رصدتها خلال ٣٠ يومًا
PURPOSE / CONTEXT: Awareness metric (hint longer than HOME-048)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 156–161

ID: PROGRESS-027
SCREEN: Progress
LOCATION: Response indicators — «daily stability» label + hint
TYPE: metric label + hint
STATE / CONDITION: always
CURRENT TEXT: الاستقرار اليومي — إنجاز المراجعة المسائية خلال ١٤ يومًا
PURPOSE / CONTEXT: Stability metric (label with «ال», unlike HOME-045)
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 162–167

ID: PROGRESS-028
SCREEN: Progress
LOCATION: Insights card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: قراءات من سجلك
PURPOSE / CONTEXT: Insights section
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 174–178

ID: PROGRESS-029
SCREEN: Progress
LOCATION: Insights card — row labels (5)
TYPE: insight labels
STATE / CONDITION: per existing insight
CURRENT TEXT: أكثر محفز متكرر · أفضل تدخل لديك · متوسط بدء تدخلك · أكثر وقت يحتاج حماية · نمط السياق الأخطر
PURPOSE / CONTEXT: Insight row captions
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 179–213

ID: PROGRESS-030
SCREEN: Progress
LOCATION: Insights card — «avg intervention start» value
TYPE: insight value (dynamic)
STATE / CONDITION: avgRiskAtIntervention != null
CURRENT TEXT: عند درجة {n} من ٥ — كلما انخفضت، كنت أسرع استجابة
PURPOSE / CONTEXT: Average degree at intervention start
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 193–199

ID: PROGRESS-031
SCREEN: Progress
LOCATION: Insights card — «best intervention» value
TYPE: insight value (dynamic)
STATE / CONDITION: bestIntervention exists
CURRENT TEXT: {name} — نجح {n} مرة
PURPOSE / CONTEXT: Best intervention display
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 186–192

ID: PROGRESS-032
SCREEN: Progress
LOCATION: Insights card — empty state
TYPE: empty text
STATE / CONDITION: no topTrigger and no bestIntervention
CURRENT TEXT: سجّل بضعة فحوصات رغبة وتدخلات، وستظهر هنا قراءاتك: أفضل تدخل، أخطر وقت، وسرعة استجابتك.
PURPOSE / CONTEXT: How to unlock insights
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 214–219

ID: PROGRESS-033
SCREEN: Progress
LOCATION: Screen footer info note
TYPE: info note
STATE / CONDITION: always
CURRENT TEXT: كل مؤشر هنا يمثل شيئًا حقيقيًا في سلوكك، ويمكن تحسينه بخطوة صغيرة — رغبة تُرصد، تدخل مبكر، توقف أسرع. التعثر نفسه قد يحمل دليل تحسن: توقفت أبكر من قبلها.
PURPOSE / CONTEXT: Honest-metrics closing note
SOURCE FILE: src/components/app/screens/ProgressScreen.tsx
SOURCE LOCATION: lines 223–226

### 11. Values / Spiritual (ValuesScreen.tsx)

ID: VALUES-001
SCREEN: Values / Spiritual
LOCATION: ScreenHeader title
TYPE: screen title
STATE / CONDITION: always
CURRENT TEXT: القيم والروحانيات
PURPOSE / CONTEXT: Screen name
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 38–42

ID: VALUES-002
SCREEN: Values / Spiritual
LOCATION: ScreenHeader subtitle
TYPE: subtitle
STATE / CONDITION: always
CURRENT TEXT: سببك أنت — يظهر لك في اللحظات الصعبة. المحتوى الروحي اختياري بالكامل.
PURPOSE / CONTEXT: Screen purpose + opt-in framing
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: line 40

ID: VALUES-003
SCREEN: Values / Spiritual
LOCATION: Personal why card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: لماذا أفعل هذا؟
PURPOSE / CONTEXT: Personal why section (same string as ONBOARDING-032)
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 47–50

ID: VALUES-004
SCREEN: Values / Spiritual
LOCATION: Personal why card — display label
TYPE: box label
STATE / CONDITION: always
CURRENT TEXT: كلماتك أنت:
PURPOSE / CONTEXT: Label above the saved why text (EMERGENCY-025 uses «كلماتك أنت» without colon)
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: line 67

ID: VALUES-005
SCREEN: Values / Spiritual
LOCATION: Personal why card — empty display
TYPE: empty-state line
STATE / CONDITION: userProfile.why is empty
CURRENT TEXT: لم تكتب سببك بعد — اكتبه أدناه؛ سيظهر هنا وفي لحظاتك الصعبة.
PURPOSE / CONTEXT: Placeholder inside the why display box
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: line 69

ID: VALUES-006
SCREEN: Values / Spiritual
LOCATION: Personal why card — textarea placeholder
TYPE: placeholder
STATE / CONDITION: always
CURRENT TEXT: لماذا أريد التغيير؟ بكلماتي وبصياغتي…
PURPOSE / CONTEXT: Why free-text input hint
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 79–85

ID: VALUES-007
SCREEN: Values / Spiritual
LOCATION: Personal why card — save button
TYPE: button label
STATE / CONDITION: always
CURRENT TEXT: حفظ سببي
PURPOSE / CONTEXT: Save the why
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 86–90

ID: VALUES-008
SCREEN: Values / Spiritual
LOCATION: Personal why card — saved confirmation
TYPE: transient confirmation
STATE / CONDITION: for 2.5s after save
CURRENT TEXT: حُفظ ✓
PURPOSE / CONTEXT: Save confirmation
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: line 91

ID: VALUES-009
SCREEN: Values / Spiritual
LOCATION: Values clarification card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: قيمي في جُمل
PURPOSE / CONTEXT: Values-in-sentences draft section
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 98–100

ID: VALUES-010
SCREEN: Values / Spiritual
LOCATION: Values clarification card — body
TYPE: helper text
STATE / CONDITION: always
CURRENT TEXT: اكتب جملة قصيرة لكل قيمة تهمّك — القيمة غير المكتوبة شعور عابر، والمكتوبة معيار يومي. صُغها بعمق — ستجد موضوع «القيم» في قاعدة المعرفة.
PURPOSE / CONTEXT: Explains the values draft
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 100–103

ID: VALUES-011
SCREEN: Values / Spiritual
LOCATION: Values draft rows — value input placeholder
TYPE: placeholder (dynamic)
STATE / CONDITION: per draft row
CURRENT TEXT: قيمة {n}
PURPOSE / CONTEXT: Value-name input hint
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: line 211

ID: VALUES-012
SCREEN: Values / Spiritual
LOCATION: Values draft rows — sentence input placeholder
TYPE: placeholder
STATE / CONDITION: per draft row
CURRENT TEXT: جملتها — مثال: أحترم وقتي فلا أبيعه رخيصًا
PURPOSE / CONTEXT: Value-sentence input hint
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: line 219

ID: VALUES-013
SCREEN: Values / Spiritual
LOCATION: Values draft — add button
TYPE: button label
STATE / CONDITION: always
CURRENT TEXT: + قيمة أخرى
PURPOSE / CONTEXT: Add a draft row
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 224–230

ID: VALUES-014
SCREEN: Values / Spiritual
LOCATION: Values draft — persistence note
TYPE: helper text
STATE / CONDITION: always
CURRENT TEXT: تُحفظ هذه المسودة على جهازك تلقائيًا — تبقى هنا مهما تنقّلت أو أعدت فتح التطبيق، وما يعنيك منه انقله إلى سببك الشخصي أعلاه ليظهر في لحظاتك الصعبة.
PURPOSE / CONTEXT: Draft storage explanation
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 231–234

ID: VALUES-015
SCREEN: Values / Spiritual
LOCATION: Spiritual card — header
TYPE: card header (with switch)
STATE / CONDITION: always
CURRENT TEXT: المحتوى الروحي
PURPOSE / CONTEXT: Spiritual gate section
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 112–115

ID: VALUES-016
SCREEN: Values / Spiritual
LOCATION: Spiritual card — switch aria-label
TYPE: accessibility label
STATE / CONDITION: always
CURRENT TEXT: تفعيل المحتوى الروحي
PURPOSE / CONTEXT: Switch screen-reader name
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 116–120

ID: VALUES-017
SCREEN: Values / Spiritual
LOCATION: Spiritual card — body
TYPE: helper text
STATE / CONDITION: always
CURRENT TEXT: صلاة، ذكر، قراءة قرآن، تأمل، توبة وعودة — تظهر فقط لمن يفعّلها، وتُفصل تمامًا عن المحتوى العلمي في التطبيق.
PURPOSE / CONTEXT: What the gate controls
SOURCE FILE: src/components/app/screens/ValuesScreen.tsx
SOURCE LOCATION: lines 122–125

(Spiritual practices cards = TAX-015; spiritual disclaimer = TAX-016 — rendered here only when settings.spiritualContent === true.)

### 12. Knowledge (KnowledgeScreen.tsx)

ID: KNOWLEDGE-001
SCREEN: Knowledge
LOCATION: ScreenHeader title
TYPE: screen title
STATE / CONDITION: always
CURRENT TEXT: قاعدة المعرفة
PURPOSE / CONTEXT: Screen name
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: lines 57–61

ID: KNOWLEDGE-002
SCREEN: Knowledge
LOCATION: ScreenHeader subtitle
TYPE: subtitle
STATE / CONDITION: always
CURRENT TEXT: بطاقات قصيرة عملية من سلوكيات وأبحاث — بلا مبالغة ولا مصطلحات طبية.
PURPOSE / CONTEXT: Content promise
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: line 59

ID: KNOWLEDGE-003
SCREEN: Knowledge
LOCATION: Timing note (under header)
TYPE: helper text
STATE / CONDITION: always
CURRENT TEXT: للقراءة في الهدوء — وقت الشدة له أداة أسرع: «تدخّل الآن» في الرئيسية.
PURPOSE / CONTEXT: When-to-use guidance
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: lines 64–66

ID: KNOWLEDGE-004
SCREEN: Knowledge
LOCATION: Search input placeholder
TYPE: placeholder
STATE / CONDITION: always
CURRENT TEXT: ابحث في المعرفة…
PURPOSE / CONTEXT: Search hint
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: lines 68–76

ID: KNOWLEDGE-005
SCREEN: Knowledge
LOCATION: Category chip — «all»
TYPE: chip label (dynamic)
STATE / CONDITION: always; {n} = filtered item count
CURRENT TEXT: الكل ({n})
PURPOSE / CONTEXT: All-categories filter
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: line 79

ID: KNOWLEDGE-006
SCREEN: Knowledge
LOCATION: Empty results — title
TYPE: empty state title
STATE / CONDITION: filtered items length === 0
CURRENT TEXT: لا نتائج
PURPOSE / CONTEXT: No search results
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: lines 93–98

ID: KNOWLEDGE-007
SCREEN: Knowledge
LOCATION: Empty results — body
TYPE: empty state body
STATE / CONDITION: filtered items length === 0
CURRENT TEXT: جرّب كلمة أبسط أو غيّر التصنيف.
PURPOSE / CONTEXT: Search guidance
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: line 97

ID: KNOWLEDGE-008
SCREEN: Knowledge
LOCATION: Card — spiritual badge
TYPE: badge
STATE / CONDITION: per card with spiritual === true (only rendered while gate ON)
CURRENT TEXT: روحي
PURPOSE / CONTEXT: Marks spiritual content
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: lines 110–114

ID: KNOWLEDGE-009
SCREEN: Knowledge
LOCATION: Card — open affordance
TYPE: link label
STATE / CONDITION: per card
CURRENT TEXT: افتح البطاقة
PURPOSE / CONTEXT: Open the card dialog
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: lines 119–122

ID: KNOWLEDGE-010
SCREEN: Knowledge
LOCATION: Card dialog — block label 1
TYPE: block label
STATE / CONDITION: dialog open
CURRENT TEXT: اعرف
PURPOSE / CONTEXT: «know» block title (same as DOSE-004)
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: line 137

ID: KNOWLEDGE-011
SCREEN: Knowledge
LOCATION: Card dialog — block label 2
TYPE: block label
STATE / CONDITION: dialog open
CURRENT TEXT: افهم
PURPOSE / CONTEXT: «understand» block title (same as DOSE-005)
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: line 138

ID: KNOWLEDGE-012
SCREEN: Knowledge
LOCATION: Card dialog — block label 3
TYPE: block label
STATE / CONDITION: dialog open
CURRENT TEXT: افعل
PURPOSE / CONTEXT: «act» block title (same as DOSE-006)
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: line 139

ID: KNOWLEDGE-013
SCREEN: Knowledge
LOCATION: Card dialog — remember label
TYPE: block label
STATE / CONDITION: dialog open
CURRENT TEXT: تذكّر
PURPOSE / CONTEXT: «remember» box title (same as DOSE-007)
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: lines 140–143

ID: KNOWLEDGE-014
SCREEN: Knowledge
LOCATION: Card dialog — deep reading label
TYPE: block label
STATE / CONDITION: only when the item has a «deep» field (label differs from DOSE-008: no «(اختياري)»)
CURRENT TEXT: قراءة أعمق
PURPOSE / CONTEXT: Deep-reading block title
SOURCE FILE: src/components/app/screens/KnowledgeScreen.tsx
SOURCE LOCATION: lines 144–151

#### 11b. Knowledge content library (98 cards) — machine-extracted verbatim

Every knowledge card (title, know, understand, act, remember, deep) is inventoried verbatim in the KB-### entries below (KB-001 … KB-098), plus KB-000 for the category chip labels. Source files: src/data/app/knowledge-core.ts (25), knowledge-wellbeing.ts (34), knowledge-recovery.ts (39). 5 of the 98 are spiritual items shown only when settings.spiritualContent === true.

### 13. Settings (SettingsScreen.tsx)

ID: SETTINGS-001
SCREEN: Settings
LOCATION: ScreenHeader title
TYPE: screen title
STATE / CONDITION: always
CURRENT TEXT: الإعدادات
PURPOSE / CONTEXT: Screen name
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 100–104

ID: SETTINGS-002
SCREEN: Settings
LOCATION: ScreenHeader subtitle
TYPE: subtitle
STATE / CONDITION: always
CURRENT TEXT: خصوصيتك أولًا — كل شيء يعمل محليًا على جهازك.
PURPOSE / CONTEXT: Privacy-first framing
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: line 102

ID: SETTINGS-003
SCREEN: Settings
LOCATION: Privacy card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: خصوصيتك
PURPOSE / CONTEXT: Privacy section header
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 109–112

ID: SETTINGS-004
SCREEN: Settings
LOCATION: Privacy card — bullet list
TYPE: bullet list (4 items)
STATE / CONDITION: always
CURRENT TEXT: كل بياناتك (سجلات، مراجعات، خطة) محفوظة في متصفحك فقط — لا تغادر جهازك أبدًا. · لا يوجد حساب، لا تسجيل دخول، ولا خادم يستقبل أي شيء. · لا نطلب اسمك الحقيقي ولا أي تفاصيل صريحة. · امسح بياناتك متى شئت من هذه الشاشة — والمحو نهائي.
PURPOSE / CONTEXT: Privacy guarantees
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 113–118

ID: SETTINGS-005
SCREEN: Settings
LOCATION: Journey card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: الرحلة
PURPOSE / CONTEXT: Journey settings section
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 124–126

ID: SETTINGS-006
SCREEN: Settings
LOCATION: Journey card — date label
TYPE: input label (dynamic)
STATE / CONDITION: always; {n} = daysSinceStart
CURRENT TEXT: تاريخ بداية الرحلة (اليوم {n})
PURPOSE / CONTEXT: Start-date input label
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 128–130

ID: SETTINGS-007
SCREEN: Settings
LOCATION: Journey card — info note
TYPE: info note
STATE / CONDITION: always
CURRENT TEXT: تعديل التاريخ لا يمس أي سجل آخر — يغيّر عدّاد الرحلة ومرحلة المحتوى فقط.
PURPOSE / CONTEXT: Date-change safety note
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 146–148

ID: SETTINGS-008
SCREEN: Settings
LOCATION: Content preferences card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: المحتوى والدعم
PURPOSE / CONTEXT: Content settings section
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 154–156

ID: SETTINGS-009
SCREEN: Settings
LOCATION: Content preferences — dose toggle title
TYPE: toggle row title
STATE / CONDITION: always
CURRENT TEXT: الجرعة اليومية
PURPOSE / CONTEXT: Daily dose toggle
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 156–161

ID: SETTINGS-010
SCREEN: Settings
LOCATION: Content preferences — dose toggle description
TYPE: toggle row description
STATE / CONDITION: always
CURRENT TEXT: جرعة تعلم يومية مخصصة على الرئيسية
PURPOSE / CONTEXT: What the dose toggle controls
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: line 158

ID: SETTINGS-011
SCREEN: Settings
LOCATION: Content preferences — spiritual toggle title
TYPE: toggle row title
STATE / CONDITION: always
CURRENT TEXT: المحتوى الروحي/القيمي
PURPOSE / CONTEXT: Spiritual gate toggle
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 162–167

ID: SETTINGS-012
SCREEN: Settings
LOCATION: Content preferences — spiritual toggle description
TYPE: toggle row description
STATE / CONDITION: always
CURRENT TEXT: صلاة، ذكر، توبة — يظهر فقط عند تفعيله
PURPOSE / CONTEXT: What the spiritual toggle controls
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: line 164

ID: SETTINGS-013
SCREEN: Settings
LOCATION: Content preferences — spiritual ON note
TYPE: helper text
STATE / CONDITION: settings.spiritualContent === true only
CURRENT TEXT: يظهر الآن: ممارسات في «القيم والروحانيات»، وبطاقات «تأمل روحي» في قاعدة المعرفة، وقد تُختار في الجرعة اليومية والتدخلات.
PURPOSE / CONTEXT: Phase-1 added visibility note for the gate
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 172–177

ID: SETTINGS-014
SCREEN: Settings
LOCATION: Appearance card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: المظهر
PURPOSE / CONTEXT: Theme section
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 187–189

ID: SETTINGS-015
SCREEN: Settings
LOCATION: Appearance card — dark theme option
TYPE: option label
STATE / CONDITION: always
CURRENT TEXT: ليلي هادئ
PURPOSE / CONTEXT: Dark theme name
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: line 192

ID: SETTINGS-016
SCREEN: Settings
LOCATION: Appearance card — light theme option
TYPE: option label
STATE / CONDITION: always
CURRENT TEXT: نهاري
PURPOSE / CONTEXT: Light theme name
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: line 193

ID: SETTINGS-017
SCREEN: Settings
LOCATION: Data card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: بياناتك ملكك
PURPOSE / CONTEXT: Data ownership section
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 221–223

ID: SETTINGS-018
SCREEN: Settings
LOCATION: Data card — body
TYPE: helper text
STATE / CONDITION: always
CURRENT TEXT: صدّر نسخة احتياطية بصيغة JSON مقروءة، أو استورد نسختك السابقة إلى أي جهاز.
PURPOSE / CONTEXT: Backup/restore explanation
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 222–224

ID: SETTINGS-019
SCREEN: Settings
LOCATION: Data card — export button
TYPE: button label
STATE / CONDITION: always
CURRENT TEXT: تصدير البيانات
PURPOSE / CONTEXT: Download backup JSON
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 226–229

ID: SETTINGS-020
SCREEN: Settings
LOCATION: Data card — copy button (copied variant)
TYPE: button label
STATE / CONDITION: for 2.5s after copying
CURRENT TEXT: نُسخ ✓
PURPOSE / CONTEXT: Copy confirmation
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 230–233

ID: SETTINGS-021
SCREEN: Settings
LOCATION: Data card — copy button (default)
TYPE: button label
STATE / CONDITION: always (before copying)
CURRENT TEXT: نسخ إلى الحافظة
PURPOSE / CONTEXT: Copy backup to clipboard
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 230–233

ID: SETTINGS-022
SCREEN: Settings
LOCATION: Data card — import trigger
TYPE: button label
STATE / CONDITION: always
CURRENT TEXT: استيراد / استعادة
PURPOSE / CONTEXT: Open the import dialog
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 234–240

ID: SETTINGS-023
SCREEN: Settings
LOCATION: Import dialog — title
TYPE: dialog title
STATE / CONDITION: import dialog open
CURRENT TEXT: استيراد نسخة احتياطية
PURPOSE / CONTEXT: Import dialog heading
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 245–247

ID: SETTINGS-024
SCREEN: Settings
LOCATION: Import dialog — explanation
TYPE: helper text
STATE / CONDITION: import dialog open
CURRENT TEXT: اختر ملف نسخة احتياطية صالحًا (.json). يُتحقق من سلامته قبل الاستبدال — وإن فشل التحقق تبقى بياناتك الحالية كما هي دون أي تغيير.
PURPOSE / CONTEXT: Import safety explanation
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 248–251

ID: SETTINGS-025
SCREEN: Settings
LOCATION: Danger zone card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: منطقة الحذر
PURPOSE / CONTEXT: Destructive actions section
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 269–271

ID: SETTINGS-026
SCREEN: Settings
LOCATION: Danger zone — wipe trigger
TYPE: button label (destructive)
STATE / CONDITION: always
CURRENT TEXT: مسح كل البيانات المحلية
PURPOSE / CONTEXT: Open the wipe confirmation
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 272–277

ID: SETTINGS-027
SCREEN: Settings
LOCATION: Wipe alert — title
TYPE: alert dialog title
STATE / CONDITION: wipe alert open
CURRENT TEXT: مسح كل شيء نهائيًا؟
PURPOSE / CONTEXT: Wipe confirmation heading
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 279–281

ID: SETTINGS-028
SCREEN: Settings
LOCATION: Wipe alert — description
TYPE: alert dialog description
STATE / CONDITION: wipe alert open
CURRENT TEXT: سيُمحى سجلّك كله (فحوصات، مراجعات، خطة، قواعد) من هذا الجهاز ولا يمكن استرجاعه. صدّر نسخة احتياطية أولًا إن أردت الحفاظ عليها.
PURPOSE / CONTEXT: Irreversibility warning
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 281–284

ID: SETTINGS-029
SCREEN: Settings
LOCATION: Wipe alert — cancel
TYPE: button label
STATE / CONDITION: wipe alert open
CURRENT TEXT: تراجع
PURPOSE / CONTEXT: Cancel the wipe (same string as BACKUP-019)
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: line 287

ID: SETTINGS-030
SCREEN: Settings
LOCATION: Wipe alert — confirm
TYPE: button label (destructive)
STATE / CONDITION: wipe alert open
CURRENT TEXT: نعم، امسح كل شيء
PURPOSE / CONTEXT: Confirm the wipe
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 288–294

ID: SETTINGS-031
SCREEN: Settings
LOCATION: About & help card — header
TYPE: card header
STATE / CONDITION: always
CURRENT TEXT: متى تطلب دعمًا مهنيًا؟
PURPOSE / CONTEXT: Professional-help section (list = TAX-017)
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 303–306

ID: SETTINGS-032
SCREEN: Settings
LOCATION: About & help card — info note
TYPE: info note
STATE / CONDITION: always
CURRENT TEXT: هذا التطبيق أداة مساعدة ذاتية سلوكية — ليس تشخيصًا ولا علاجًا طبيًا ولا بديلًا عن مختص. طلب المساعدة قوة، وليس اعترافًا بالفشل.
PURPOSE / CONTEXT: Not-medical-treatment disclaimer
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 312–315

ID: SETTINGS-033
SCREEN: Settings
LOCATION: About & help card — version line
TYPE: version line (dynamic)
STATE / CONDITION: always; version = APP_VERSION (2.2.0)
CURRENT TEXT: استعادة · نسخة {version} · يعمل محليًا بالكامل
PURPOSE / CONTEXT: App version footer
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: lines 316–318

### 14. Shared Components / Global UI

#### AppShell (src/components/app/AppShell.tsx)

ID: SHARED-001
SCREEN: Global UI
LOCATION: Navigation — NAV_ITEMS (11 items, sidebar + More sheet)
TYPE: nav labels + descriptions (pairs)
STATE / CONDITION: always (desktop sidebar; mobile More sheet)
CURRENT TEXT: الرئيسية / نظرة اليوم وحالتك · الجرعة اليومية / دقيقة معرفة في يومك الهادي · الخطة اليومية / بناء يوم يستحق · فحص الرغبة / بدأت رغبة؟ اعرف خطوتك · خريطة المحفزات / أنماط سجلك ونقطة التوقف الأبكر · توقّف هنا / رجعت للسلوك؟ إيقاف فوري ثم فهم هادئ · خطة الوقاية / قواعد «إذا… إذن» وحمايتك · التقدم / مؤشرات حقيقية بلا نسب زائفة · القيم والروحانيات / لماذا أفعل هذا؟ · قاعدة المعرفة / قراءة هادئة — للوقت الهادي · الإعدادات / خصوصيتك وبياناتك
PURPOSE / CONTEXT: The full navigation vocabulary
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: lines 40–57

ID: SHARED-002
SCREEN: Global UI
LOCATION: Sidebar brand — name
TYPE: brand name
STATE / CONDITION: desktop (lg+) always
CURRENT TEXT: استعادة
PURPOSE / CONTEXT: Sidebar brand name
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: line 125

ID: SHARED-003
SCREEN: Global UI
LOCATION: Sidebar brand — tagline
TYPE: brand tagline
STATE / CONDITION: desktop always
CURRENT TEXT: نظام شخصي للتحكم
PURPOSE / CONTEXT: Sidebar tagline (differs from ONBOARDING-002 «نظام شخصي لاستعادة التحكم»)
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: line 126

ID: SHARED-004
SCREEN: Global UI
LOCATION: Sidebar footer — privacy line
TYPE: footer text
STATE / CONDITION: desktop always
CURRENT TEXT: بياناتك على جهازك فقط — لا حسابات ولا خوادم.
PURPOSE / CONTEXT: Persistent privacy footer
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: lines 151–153

ID: SHARED-005
SCREEN: Global UI
LOCATION: EmergencyButton (desktop sidebar compact + More-sheet family)
TYPE: button label
STATE / CONDITION: desktop sidebar always; launches at level 4
CURRENT TEXT: تدخّل الآن
PURPOSE / CONTEXT: Always-on SOS launcher (desktop)
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: lines 74–94 (label line 91)

ID: SHARED-006
SCREEN: Global UI
LOCATION: Bottom navigation — item labels (5)
TYPE: nav labels
STATE / CONDITION: mobile always
CURRENT TEXT: الرئيسية · الجرعة · تدخّل الآن · الخطة · المزيد
PURPOSE / CONTEXT: Mobile bottom bar (center = SOS)
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: lines 179–240

ID: SHARED-007
SCREEN: Global UI
LOCATION: Bottom nav center SOS — aria-label
TYPE: accessibility label
STATE / CONDITION: mobile always
CURRENT TEXT: تدخل الآن — وضع الطوارئ
PURPOSE / CONTEXT: SOS screen-reader name (note: «تدخل» without shadda, unlike visible «تدخّل»)
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: line 209

ID: SHARED-008
SCREEN: Global UI
LOCATION: Bottom nav «more» — aria-label
TYPE: accessibility label
STATE / CONDITION: mobile always
CURRENT TEXT: المزيد من الأقسام
PURPOSE / CONTEXT: More button screen-reader name
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: line 232

ID: SHARED-009
SCREEN: Global UI
LOCATION: More sheet — title
TYPE: sheet title
STATE / CONDITION: More sheet open
CURRENT TEXT: كل الأقسام
PURPOSE / CONTEXT: All-sections sheet heading
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: lines 251–253

ID: SHARED-010
SCREEN: Global UI
LOCATION: More sheet — close aria-label
TYPE: accessibility label
STATE / CONDITION: More sheet open
CURRENT TEXT: إغلاق
PURPOSE / CONTEXT: Sheet close screen-reader name
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: lines 254–260

ID: SHARED-011
SCREEN: Global UI
LOCATION: More sheet — SOS card label
TYPE: card label
STATE / CONDITION: More sheet open
CURRENT TEXT: تدخّل الآن
PURPOSE / CONTEXT: SOS entry in the sheet (same string as SHARED-005/006)
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: line 289

ID: SHARED-012
SCREEN: Global UI
LOCATION: More sheet — SOS card description
TYPE: card description
STATE / CONDITION: More sheet open
CURRENT TEXT: لحظة خطر؟ وضع الطوارئ — خطوات مباشرة بلا تشتيت
PURPOSE / CONTEXT: SOS card explainer
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: lines 290–292

ID: SHARED-013
SCREEN: Global UI
LOCATION: Navigation aria-labels
TYPE: accessibility labels
STATE / CONDITION: always
CURRENT TEXT: التنقل الرئيسي (desktop nav) · التنقل السفلي (mobile nav)
PURPOSE / CONTEXT: Navigation landmark names
SOURCE FILE: src/components/app/AppShell.tsx
SOURCE LOCATION: lines 132, 176

#### Shared components (src/components/app/shared.tsx)

ID: SHARED-014
SCREEN: Global UI
LOCATION: NumberScale option — aria-label template
TYPE: accessibility label (dynamic)
STATE / CONDITION: Urge Check input scales (per option)
CURRENT TEXT: {label}: {n} من 5
PURPOSE / CONTEXT: Scale option screen-reader name (Latin digit 5 vs visible Arabic-Indic ٥)
SOURCE FILE: src/components/app/shared.tsx
SOURCE LOCATION: line 137

ID: SHARED-015
SCREEN: Global UI
LOCATION: StatTile trend arrows — aria-labels
TYPE: accessibility labels
STATE / CONDITION: per stat with direction up/down
CURRENT TEXT: تحسن (↑) · انخفاض (↓)
PURPOSE / CONTEXT: Trend arrow names for screen readers
SOURCE FILE: src/components/app/shared.tsx
SOURCE LOCATION: lines 203–211

ID: SHARED-016
SCREEN: Global UI
LOCATION: StepDots — aria-label template
TYPE: accessibility label (dynamic)
STATE / CONDITION: Onboarding wizard, evening check-in dialog, review wizard
CURRENT TEXT: خطوة {current} من {total}
PURPOSE / CONTEXT: Progress dots screen-reader name
SOURCE FILE: src/components/app/shared.tsx
SOURCE LOCATION: line 269

#### Timer / Countdown (src/components/app/Timer.tsx)

ID: SHARED-017
SCREEN: Global UI
LOCATION: Compact timer — play/pause aria-labels
TYPE: accessibility labels
STATE / CONDITION: compact timer (InterventionCard), not done
CURRENT TEXT: إيقاف مؤقت (running) · تشغيل (paused)
PURPOSE / CONTEXT: Compact timer control names
SOURCE FILE: src/components/app/Timer.tsx
SOURCE LOCATION: line 59

ID: SHARED-018
SCREEN: Global UI
LOCATION: Countdown — done caption
TYPE: caption
STATE / CONDITION: countdown finished
CURRENT TEXT: اكتمل الوقت
PURPOSE / CONTEXT: Timer completion caption
SOURCE FILE: src/components/app/Timer.tsx
SOURCE LOCATION: line 98

ID: SHARED-019
SCREEN: Global UI
LOCATION: Countdown — running caption
TYPE: caption
STATE / CONDITION: countdown running
CURRENT TEXT: جارٍ التنفيذ…
PURPOSE / CONTEXT: Running state caption
SOURCE FILE: src/components/app/Timer.tsx
SOURCE LOCATION: line 101

ID: SHARED-020
SCREEN: Global UI
LOCATION: Countdown — paused caption
TYPE: caption
STATE / CONDITION: countdown paused (not started)
CURRENT TEXT: متوقف
PURPOSE / CONTEXT: Paused state caption
SOURCE FILE: src/components/app/Timer.tsx
SOURCE LOCATION: line 101

ID: SHARED-021
SCREEN: Global UI
LOCATION: Countdown — main control labels
TYPE: button labels (dynamic)
STATE / CONDITION: not done; running → pause label; paused → «ابدأ» (untouched) or «استئناف» (resumed)
CURRENT TEXT: إيقاف مؤقت · ابدأ · استئناف
PURPOSE / CONTEXT: Timer control labels
SOURCE FILE: src/components/app/Timer.tsx
SOURCE LOCATION: lines 114–121

ID: SHARED-022
SCREEN: Global UI
LOCATION: Countdown — reset aria-label
TYPE: accessibility label
STATE / CONDITION: not done
CURRENT TEXT: إعادة
PURPOSE / CONTEXT: Reset control screen-reader name
SOURCE FILE: src/components/app/Timer.tsx
SOURCE LOCATION: line 133

ID: SHARED-023
SCREEN: Global UI
LOCATION: Countdown — run again button
TYPE: button label
STATE / CONDITION: countdown done
CURRENT TEXT: مرة أخرى
PURPOSE / CONTEXT: Restart the timer
SOURCE FILE: src/components/app/Timer.tsx
SOURCE LOCATION: lines 139–150

ID: SHARED-024
SCREEN: Global UI
LOCATION: Countdown — done action line
TYPE: success line
STATE / CONDITION: countdown done
CURRENT TEXT: أنجزت الوقت — أعد التقييم الآن
PURPOSE / CONTEXT: Post-timer next action
SOURCE FILE: src/components/app/Timer.tsx
SOURCE LOCATION: lines 153–156

#### InterventionCard (src/components/app/InterventionCard.tsx)

ID: SHARED-025
SCREEN: Global UI
LOCATION: InterventionCard — «why» disclosure
TYPE: collapsible summary
STATE / CONDITION: Urge intervention phase + Emergency step 3
CURRENT TEXT: لماذا يساعد هذا؟
PURPOSE / CONTEXT: whyItHelps disclosure header
SOURCE FILE: src/components/app/InterventionCard.tsx
SOURCE LOCATION: lines 46–52

ID: SHARED-026
SCREEN: Global UI
LOCATION: InterventionCard — compact timer label
TYPE: label
STATE / CONDITION: compactTimer === true variant
CURRENT TEXT: المؤقت:
PURPOSE / CONTEXT: Compact timer row label
SOURCE FILE: src/components/app/InterventionCard.tsx
SOURCE LOCATION: line 58

ID: SHARED-027
SCREEN: Global UI
LOCATION: InterventionCard — complete CTA (timed variant)
TYPE: button label
STATE / CONDITION: onComplete provided && durationSec set
CURRENT TEXT: تم — أعد التقييم
PURPOSE / CONTEXT: Finish a timed intervention
SOURCE FILE: src/components/app/InterventionCard.tsx
SOURCE LOCATION: lines 67–71

ID: SHARED-028
SCREEN: Global UI
LOCATION: InterventionCard — complete CTA (untimed variant)
TYPE: button label
STATE / CONDITION: onComplete provided && no durationSec
CURRENT TEXT: تم
PURPOSE / CONTEXT: Finish an untimed intervention
SOURCE FILE: src/components/app/InterventionCard.tsx
SOURCE LOCATION: lines 67–71

ID: SHARED-029
SCREEN: Global UI
LOCATION: InterventionCard — next-action line
TYPE: helper text (dynamic)
STATE / CONDITION: always (per card)
CURRENT TEXT: الخطوة التالية: {iv.nextAction}
PURPOSE / CONTEXT: Names the follow-up step
SOURCE FILE: src/components/app/InterventionCard.tsx
SOURCE LOCATION: lines 73–75

#### Splash / hydration (src/components/app/AppRoot.tsx)

ID: SHARED-030
SCREEN: Global UI
LOCATION: SplashScreen — initials tile
TYPE: splash text
STATE / CONDITION: brief pre-hydration splash (also for no-JS)
CURRENT TEXT: اس
PURPOSE / CONTEXT: REVIEW: uncertain — legacy initials tile («اس» from استعادة), replaced by LogoMark in all permanent surfaces
SOURCE FILE: src/components/app/AppRoot.tsx
SOURCE LOCATION: lines 46–48

ID: SHARED-031
SCREEN: Global UI
LOCATION: SplashScreen — app name
TYPE: splash text
STATE / CONDITION: pre-hydration splash
CURRENT TEXT: استعادة
PURPOSE / CONTEXT: Splash brand name
SOURCE FILE: src/components/app/AppRoot.tsx
SOURCE LOCATION: line 49

ID: SHARED-032
SCREEN: Global UI
LOCATION: SplashScreen — noscript message
TYPE: noscript text
STATE / CONDITION: JavaScript disabled
CURRENT TEXT: هذا التطبيق يحتاج تشغيل جافاسكربت — ويعمل بعد ذلك محليًا بالكامل على جهازك.
PURPOSE / CONTEXT: No-JS fallback message
SOURCE FILE: src/components/app/AppRoot.tsx
SOURCE LOCATION: lines 53–57

#### Shared taxonomy (rendered on multiple screens) — TAX-001 … TAX-021

All fixed taxonomy content (risk-level labels/descriptions/examples, mode labels, trigger vocabulary, early warning signs, anti-rationalization pairs, journey stages + disclaimer, work-safe steps, digital protection guides + honesty note, support message templates, vulnerability factors, personal-why reasons, spiritual practices + disclaimer, when-to-seek-help list, time bucket labels, greeting variants, plus the two never-rendered exports) is inventoried verbatim in the TAX-### entries below. Source: src/data/app/taxonomy.ts, src/lib/app/helpers.ts.

### 15. Backup / Restore (RestoreBackup.tsx + backup.ts)

ID: BACKUP-001
SCREEN: Backup / Restore
LOCATION: File too large error
TYPE: error message
STATE / CONDITION: selected file > 20MB
CURRENT TEXT: الملف كبير جدًا — ليس ملف نسخة احتياطية صالحًا.
PURPOSE / CONTEXT: Sanity-cap rejection
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 68–70

ID: BACKUP-002
SCREEN: Backup / Restore
LOCATION: File read error
TYPE: error message
STATE / CONDITION: file.text() throws
CURRENT TEXT: تعذر قراءة الملف — حاول مرة أخرى.
PURPOSE / CONTEXT: Unreadable file message
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 75–77

ID: BACKUP-003
SCREEN: Backup / Restore
LOCATION: File picker button
TYPE: button label
STATE / CONDITION: always (Onboarding welcome + Settings import dialog)
CURRENT TEXT: اختر ملف النسخة الاحتياطية (.json)
PURPOSE / CONTEXT: Backup file selection
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 106–114

ID: BACKUP-004
SCREEN: Backup / Restore
LOCATION: Paste fallback toggle
TYPE: text button label
STATE / CONDITION: before the paste area is shown
CURRENT TEXT: أو الصق محتوى النسخة يدويًا
PURPOSE / CONTEXT: Reveal the paste textarea
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 117–125

ID: BACKUP-005
SCREEN: Backup / Restore
LOCATION: Paste textarea placeholder
TYPE: placeholder
STATE / CONDITION: paste area shown
CURRENT TEXT: ألصق محتوى ملف JSON هنا…
PURPOSE / CONTEXT: Paste input hint (note: «ألصق» with hamza, while BACKUP-004 uses «الصق»)
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 127–133

ID: BACKUP-006
SCREEN: Backup / Restore
LOCATION: Preview card — valid header
TYPE: header (dynamic)
STATE / CONDITION: raw text present && validation passed
CURRENT TEXT: {fileName} — fallback: نسخة احتياطية صالحة
PURPOSE / CONTEXT: Valid-backup preview title
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 145–150

ID: BACKUP-007
SCREEN: Backup / Restore
LOCATION: Preview card — export date row
TYPE: list row (dynamic)
STATE / CONDITION: valid backup with exportedAt
CURRENT TEXT: • تاريخ التصدير: {arabicDateTime}
PURPOSE / CONTEXT: Preview summary row
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 152–156

ID: BACKUP-008
SCREEN: Backup / Restore
LOCATION: Preview card — counts row
TYPE: list row (dynamic)
STATE / CONDITION: valid backup
CURRENT TEXT: • فحوصات الرغبة: {n}
PURPOSE / CONTEXT: Preview summary row
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: line 157

ID: BACKUP-009
SCREEN: Backup / Restore
LOCATION: Preview card — counts row
TYPE: list row (dynamic)
STATE / CONDITION: valid backup
CURRENT TEXT: • تعثرات مسجلة: {n}
PURPOSE / CONTEXT: Preview summary row
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: line 158

ID: BACKUP-010
SCREEN: Backup / Restore
LOCATION: Preview card — counts row
TYPE: list row (dynamic)
STATE / CONDITION: valid backup
CURRENT TEXT: • قواعد وقاية: {n}
PURPOSE / CONTEXT: Preview summary row
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: line 159

ID: BACKUP-011
SCREEN: Backup / Restore
LOCATION: Preview card — counts row
TYPE: list row (dynamic)
STATE / CONDITION: valid backup
CURRENT TEXT: • تدخلات: {n}
PURPOSE / CONTEXT: Preview summary row
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: line 160

ID: BACKUP-012
SCREEN: Backup / Restore
LOCATION: Preview card — replacement warning
TYPE: warning text
STATE / CONDITION: valid backup && user has existing data
CURRENT TEXT: استعادة النسخة الاحتياطية ستستبدل بياناتك الحالية — سيُطلب تأكيدك قبل ذلك.
PURPOSE / CONTEXT: Warns data will be replaced
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 162–169

ID: BACKUP-013
SCREEN: Backup / Restore
LOCATION: Preview card — invalid header/fallback
TYPE: error text (dynamic)
STATE / CONDITION: raw text present && validation failed
CURRENT TEXT: {preview.error} — fallback: الملف غير صالح.
PURPOSE / CONTEXT: Invalid-backup message
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 172–176

ID: BACKUP-014
SCREEN: Backup / Restore
LOCATION: Result banner — success header
TYPE: success banner
STATE / CONDITION: import succeeded (persists in dialog)
CURRENT TEXT: تمت الاستعادة بنجاح
PURPOSE / CONTEXT: Restore success header
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 192–197

ID: BACKUP-015
SCREEN: Backup / Restore
LOCATION: Result banner — success body
TYPE: success message
STATE / CONDITION: import succeeded
CURRENT TEXT: بياناتك كما كانت يوم صدّرت النسخة. أغلق هذه النافذة وستجد كل شيء في مكانه — التطبيق يعمل الآن ببياناتك المستعادة.
PURPOSE / CONTEXT: Restore success explanation
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 198–201

ID: BACKUP-016
SCREEN: Backup / Restore
LOCATION: Primary restore button
TYPE: button label
STATE / CONDITION: always; disabled until valid / after success
CURRENT TEXT: استعادة النسخة الاحتياطية
PURPOSE / CONTEXT: Executes the restore
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 214–222

ID: BACKUP-017
SCREEN: Backup / Restore
LOCATION: Confirm gate — title
TYPE: alert dialog title
STATE / CONDITION: user has existing data && clicked restore
CURRENT TEXT: استبدال بياناتك الحالية؟
PURPOSE / CONTEXT: Replacement confirmation heading
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 230–232

ID: BACKUP-018
SCREEN: Backup / Restore
LOCATION: Confirm gate — description
TYPE: alert dialog description
STATE / CONDITION: same as BACKUP-017
CURRENT TEXT: استعادة النسخة الاحتياطية ستستبدل بياناتك الحالية. هل تريد المتابعة؟
PURPOSE / CONTEXT: Replacement confirmation body
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: lines 232–234

ID: BACKUP-019
SCREEN: Backup / Restore
LOCATION: Confirm gate — cancel
TYPE: button label
STATE / CONDITION: same as BACKUP-017
CURRENT TEXT: تراجع
PURPOSE / CONTEXT: Cancel the restore (same string as SETTINGS-029)
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: line 237

ID: BACKUP-020
SCREEN: Backup / Restore
LOCATION: Confirm gate — confirm
TYPE: button label
STATE / CONDITION: same as BACKUP-017
CURRENT TEXT: نعم، استعِد النسخة
PURPOSE / CONTEXT: Confirm the restore
SOURCE FILE: src/components/app/RestoreBackup.tsx
SOURCE LOCATION: line 238

ID: BACKUP-021
SCREEN: Backup / Restore
LOCATION: validateBackup — JSON parse error
TYPE: error message
STATE / CONDITION: invalid JSON
CURRENT TEXT: تعذر قراءة الملف — تأكد أنه ملف JSON سليم غير تالف.
PURPOSE / CONTEXT: Parse-failure error
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 216–219

ID: BACKUP-022
SCREEN: Backup / Restore
LOCATION: validateBackup — not an object
TYPE: error message
STATE / CONDITION: parsed JSON is not an object
CURRENT TEXT: بنية الملف غير صالحة — الملف ليس نسخة احتياطية صحيحة.
PURPOSE / CONTEXT: Structure error
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 221–223

ID: BACKUP-023
SCREEN: Backup / Restore
LOCATION: validateBackup — wrong app id
TYPE: error message
STATE / CONDITION: app not in accepted ids
CURRENT TEXT: الملف ليس نسخة احتياطية من هذا التطبيق.
PURPOSE / CONTEXT: Foreign-file error
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 225–228

ID: BACKUP-024
SCREEN: Backup / Restore
LOCATION: validateBackup — bad schema version field
TYPE: error message
STATE / CONDITION: schemaVersion present but invalid
CURRENT TEXT: رقم إصدار النسخة الاحتياطية غير صالح.
PURPOSE / CONTEXT: Schema-version field error
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 231–235

ID: BACKUP-025
SCREEN: Backup / Restore
LOCATION: validateBackup — no data
TYPE: error message
STATE / CONDITION: data missing or not an object
CURRENT TEXT: بنية الملف غير صالحة — لا توجد بيانات داخل النسخة.
PURPOSE / CONTEXT: Missing-data error
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 236–238

ID: BACKUP-026
SCREEN: Backup / Restore
LOCATION: validateBackup — unsupported schema version
TYPE: error message (dynamic)
STATE / CONDITION: schemaVersion != 1
CURRENT TEXT: نسخة النسخة الاحتياطية (إصدار {n}) غير مدعومة — هذا التطبيق يدعم الإصدار {m}.
PURPOSE / CONTEXT: Version mismatch error (note the awkward «نسخة النسخة الاحتياطية»)
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 239–245

ID: BACKUP-027
SCREEN: Backup / Restore
LOCATION: validateBackup — profile errors
TYPE: error message
STATE / CONDITION: userProfile missing / onboardingCompleted / journey.startDate invalid / profile lists / deviceNeeds / why+supportPrefs
CURRENT TEXT: بيانات الملف الشخصي ناقصة أو تالفة. · حالة إكمال التهيئة غير صالحة في النسخة. · تاريخ بداية الرحلة غير صالح في النسخة. · قوائم التهيئة غير صالحة في النسخة. · إعداد الجهاز غير صالح في النسخة. · تفضيلات الدعم غير صالحة في النسخة.
PURPOSE / CONTEXT: Profile-section validation errors
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 247–276

ID: BACKUP-028
SCREEN: Backup / Restore
LOCATION: validateBackup — logs structure errors
TYPE: error message
STATE / CONDITION: dailyLogs missing or arrays missing; urge/intervention arrays missing; relapse/rules arrays missing
CURRENT TEXT: السجلات اليومية غير صالحة في النسخة. (×2 — same string for two different checks) · سجلات الفحص والتدخل غير صالحة في النسخة. · سجلات التعثر والوقاية غير صالحة في النسخة.
PURPOSE / CONTEXT: Log-section validation errors
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 278–291

ID: BACKUP-029
SCREEN: Backup / Restore
LOCATION: validateBackup — corrupt-data wrapper
TYPE: error message (dynamic)
STATE / CONDITION: any per-item validator fails; {err} = one of the field hints
CURRENT TEXT: النسخة الاحتياطية تالفة: {err}.
PURPOSE / CONTEXT: Item-level validation failure wrapper
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 293–301

ID: BACKUP-030
SCREEN: Backup / Restore
LOCATION: validateBackup — per-item field hints (full set)
TYPE: error hints (36 distinct strings)
STATE / CONDITION: shown inside BACKUP-029 when the matching field is invalid
CURRENT TEXT: سجل فحص رغبة غير صالح · تاريخ/معرّف غير صالح في فحوصات الرغبة · قيم أبعاد غير صالحة في فحوصات الرغبة · درجة حالة غير صالحة في فحوصات الرغبة · سياق غير صالحة في فحوصات الرغبة · محفزات غير صالحة في فحوصات الرغبة · نتيجة غير صالحة في فحوصات الرغبة · سجل تدخل غير صالح · بيانات ناقصة في سجل التدخلات · درجة حالة غير صالحة في سجل التدخلات · مصدر غير صالح في سجل التدخلات · سجل تعثر غير صالح · تاريخ/معرّف غير صالح في سجل التعثرات · مدة توقف غير صالحة في سجل التعثرات · قيم غير صالحة في سجل التعثرات · محفزات غير صالحة في سجل التعثرات · قاعدة وقاية غير صالحة · نص قاعدة وقاية غير صالح · حالة تفعيل غير صالحة في قواعد الوقاية · مصدر غير صالح في قواعد الوقاية · تاريخ غير صالح في قواعد الوقاية · سجل مراجعة مسائية غير صالح · تاريخ غير صالح في المراجعات المسائية · قيمة رغبة غير صالحة في المراجعات المسائية · حقول نصية غير صالحة في المراجعات المسائية · مقاييس غير صالحة في المراجعات المسائية · خطة يومية غير صالحة · تاريخ غير صالح في الخطط اليومية · نمط خطة غير صالح · حقول غير صالحة في الخطط اليومية · أقسام مكتملة غير صالحة في الخطط اليومية · سجل جرعة غير صالح · تاريخ غير صالح في سجل الجرعات · معرّف جرعة غير صالح · حالة جرعة غير صالحة
PURPOSE / CONTEXT: Field-level validation vocabulary
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 97–181 (item validators)

ID: BACKUP-031
SCREEN: Backup / Restore
LOCATION: validateBackup — support person error
TYPE: error message
STATE / CONDITION: supportPerson invalid
CURRENT TEXT: بيانات شخص الدعم غير صالحة في النسخة.
PURPOSE / CONTEXT: Support-person validation error
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 303–306

ID: BACKUP-032
SCREEN: Backup / Restore
LOCATION: validateBackup — settings error
TYPE: error message
STATE / CONDITION: settings shape invalid
CURRENT TEXT: الإعدادات غير صالحة في النسخة.
PURPOSE / CONTEXT: Settings validation error
SOURCE FILE: src/lib/app/backup.ts
SOURCE LOCATION: lines 308–319

### 16. Other User-Facing States

#### 16a. Intervention content library (28 items) — machine-extracted verbatim
Rendered through InterventionCard (Urge Check intervention phase) and EmergencyMode step 3. Full verbatim inventory: IV-001 … IV-028 entries below. Source: src/data/app/interventions.ts.

#### 16b. Browser / document metadata (src/app/layout.tsx)

ID: OTHER-001
SCREEN: Browser metadata
LOCATION: document title
TYPE: page title
STATE / CONDITION: always (browser tab / history)
CURRENT TEXT: استعادة — نظام شخصي لاستعادة التحكم
PURPOSE / CONTEXT: Tab title
SOURCE FILE: src/app/layout.tsx
SOURCE LOCATION: line 15

ID: OTHER-002
SCREEN: Browser metadata
LOCATION: meta description
TYPE: meta description
STATE / CONDITION: always (search/snippet surface)
CURRENT TEXT: تطبيق مساعدة ذاتية سلوكية لاستعادة التحكم: لاحظ، افهم، اقطع السلسلة، تعلّم، وابنِ حياة أفضل. يعمل محليًا على جهازك — لا حسابات ولا خوادم.
PURPOSE / CONTEXT: App description metadata
SOURCE FILE: src/app/layout.tsx
SOURCE LOCATION: lines 16–18

ID: OTHER-003
SCREEN: Browser metadata
LOCATION: applicationName + keywords
TYPE: metadata values
STATE / CONDITION: always
CURRENT TEXT: استعادة · استعادة التحكم · مساعدة ذاتية · سلوك · عادات · خصوصية
PURPOSE / CONTEXT: App name + search keywords
SOURCE FILE: src/app/layout.tsx
SOURCE LOCATION: lines 18–19

ID: OTHER-004
SCREEN: Backup export
LOCATION: Download filename
TYPE: filename (dynamic)
STATE / CONDITION: when exporting a backup
CURRENT TEXT: istiaada-backup-{YYYY-MM-DD}.json
PURPOSE / CONTEXT: REVIEW: uncertain — Latin-script filename, visible in the browser download bar
SOURCE FILE: src/components/app/screens/SettingsScreen.tsx
SOURCE LOCATION: line 83

#### 16c. Empty state for «no screen copy» — per requested structure
All 16 groups above contain user-facing copy; none reported «No user-facing copy found.»

---

## B-Appendix. Shared Taxonomy + Content Libraries (machine-extracted verbatim)

Follows section 16. Contains, in order: TAX-001…TAX-021 (shared taxonomy rendered on multiple screens — referenced from sections 5/7/8/9/10/12/13/14), KB-000…KB-098 (the 98 Knowledge content cards — referenced from section 11b), IV-001…IV-028 (the 28 Intervention content items — referenced from section 16a). All text below is dumped directly from the source data modules by scripts/phase2a-extract.ts — verbatim, zero transcription.

ID: TAX-001
SCREEN: Shared Content (Taxonomy)
LOCATION: Risk levels — RISK_LEVELS[]
TYPE: conditional label + description (+examples)
STATE / CONDITION: rendered per computed level 1–5 (Urge Check result)
CURRENT TEXT: المستوى 1: «هدوء» — لا توجد مشكلة ملحّة الآن — أكمل يومك الطبيعي.
المستوى 2: «بداية بسيطة» — رغبة بدأت تظهر — يمكن التعامل معها بسهولة بخطوة صغيرة.
المستوى 3: «بدأت تقوى» — الرغبة تشتد — خطوة تدخل مبكر الآن تقطعها وهي لسه صغيرة. أمثلة: بدأت أفكر في «كيف» / «مرة واحدة مش هفرق»
المستوى 4: «خطر مرتفع» — قربت من التصرف — تدخّل الآن، بلا تحليل. أمثلة: فتحت المصدر بالفعل / «آخر مرة وأوقف»
المستوى 5: «على وشك التصرف» — أنت عند نقطة التنفيذ نفسها مع شعور شبه تام بفقدان السيطرة — أقصى تدخل مباشر الآن.
PURPOSE / CONTEXT: The 1–5 ladder verdict shown on the Urge Check result card
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 24–58

ID: TAX-002
SCREEN: Shared Content (Taxonomy)
LOCATION: Mode labels — MODE_LABELS
TYPE: conditional label
STATE / CONDITION: rendered as «أنسب خطوة الآن: …» per computed mode
CURRENT TEXT: awareness → «مراقبة هادئة»
interrupt → «قطع مبكر»
immediate → «تدخل فوري»
emergency → «وضع الطوارئ»
maximum → «وضع الأزمة»
PURPOSE / CONTEXT: Recommended-step label under the Urge Check degree
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 60–66

ID: TAX-003
SCREEN: Shared Content (Taxonomy)
LOCATION: Trigger chips — TRIGGERS[]
TYPE: option labels (multi-select chips)
STATE / CONDITION: Urge Check input, Evening check-in, Relapse quick log + review, Trigger Map frequencies
CURRENT TEXT: memory (internal): «ذكرى أو مشهد عالق في الذهن»
thought (internal): «فكرة متكررة»
fantasy (internal): «خيال بدأ يتشعب»
curiosity (internal): «فضول أو رغبة في البحث»
boredom (emotional): «ملل»
loneliness (emotional): «وحدة»
stress (emotional): «توتر أو ضغط»
anxiety (emotional): «قلق»
sadness (emotional): «حزن أو ضيق نفسي»
anger (emotional): «غضب أو إحباط»
images (digital): «التقاء بمحتوى أو صورة»
feeds (digital): «تصفح المنصات/التغذية»
websites (digital): «موقع أو منصة معينة»
search (digital): «بدء بحث»
stories (digital): «قصص أو محتوى نصي محفز»
aimless (digital): «تصفح بلا هدف»
late-night (situational): «وقت متأخر من الليل»
bed (situational): «البقاء في السرير»
bathroom (situational): «مكان معين (حمام/غرفة مغلقة)»
isolation (situational): «الانعزال عن الناس»
phone-habit (habitual): «التقاط الهاتف آليًا»
just-minute (habitual): ««دقيقة واحدة»»
testing (habitual): «اختبار مقاومتك أمام المحفز»
scrolling (habitual): «تمرير بلا غرض»
PURPOSE / CONTEXT: The trigger vocabulary across the whole app
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 111–136

ID: TAX-004
SCREEN: Shared Content (Taxonomy)
LOCATION: Trigger category labels — TRIGGER_CATEGORIES[]
TYPE: group labels
STATE / CONDITION: Trigger Map «محفزاتك الأكثر تكرارًا» group headers (only items with count > 0)
CURRENT TEXT: internal: «داخلية» (hint «ما ينبع من الداخل: ذكرى، فكرة، خيال، فضول.» — hint field NOT rendered anywhere)
emotional: «انفعالية» (hint «ملل، وحدة، توتر، قلق، حزن، غضب، إحباط.» — hint field NOT rendered anywhere)
digital: «رقمية/خارجية» (hint «صور، منصات، مواقع، بحث، تصفح بلا هدف.» — hint field NOT rendered anywhere)
situational: «ظرفية» (hint «وقت متأخر، السرير، العزلة، مكان معين.» — hint field NOT rendered anywhere)
habitual: «اعتيادية» (hint «عادة التقاط الهاتف بلا هدف أو «اختبار النفس».» — hint field NOT rendered anywhere)
PURPOSE / CONTEXT: Category grouping labels on the Trigger Map
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 83–109

ID: TAX-005
SCREEN: Shared Content (Taxonomy)
LOCATION: Early warning signs — EARLY_WARNING_SIGNS[]
TYPE: option labels (chips)
STATE / CONDITION: Relapse calm review step 3
CURRENT TEXT: scenes: «تذكّر مشاهد سابقة»
elaborating: «تطوير خيال وإضافته تفاصيل»
purposeless: «تصفح بلا هدف»
starting-search: «بدء بحث»
just-seeing: «فتح منصة «لمجرد أن ألقي نظرة»»
alt-material: «البحث عن محتوى محفز بديل»
self-isolating: «عزل نفسك عن الناس»
phone-in-bed: «الهاتف في السرير»
negotiating: «تفاوض داخلي»
resistance-testing: «اختبار مقاومتك»
PURPOSE / CONTEXT: First-sign choices in the relapse review
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 138–149

ID: TAX-006
SCREEN: Shared Content (Taxonomy)
LOCATION: Anti-rationalization panel — ANTI_RATIONALIZATION[]
TYPE: conditional paired copy (pattern + response)
STATE / CONDITION: Urge Check result, mode interrupt/immediate only (first 5 shown)
CURRENT TEXT: one-minute: همسة: ««سأنظر دقيقة واحدة فقط»» / الرد: «المشكلة ليست في الدقيقة. السلسلة بدأت بالفعل. اقطعها الآن.»
in-control: همسة: ««أنا مسيطر على الأمر»» / الرد: «لا تختبر قدرتك على المقاومة أمام المحفز. غيّر البيئة.»
already-slipped: همسة: ««تعثرت بالفعل، سأكمل إلى النهاية»» / الرد: «التعثر لا يحتاج إلى سقوط ثانٍ. أوقف الآن — الباقي قرار مستقل.»
tomorrow: همسة: ««سأبدأ غدًا»» / الرد: «البداية ليست غدًا. البداية هي الخطوة التالية الآن.»
cant: همسة: ««لا أستطيع»» / الرد: «لا تحتاج إلى حل حياتك الآن. نفّذ الخطوة الحالية فقط.»
once-wont-hurt: همسة: ««مرة واحدة لن تضر»» / الرد: «ما تعيشه الآن بدأ بخطوة صغيرة أيضًا. لا تفاوض على السلسلة.»
deserve: همسة: ««أستحق تنفيسًا/مكافأة»» / الرد: «التوتر يحتاج حلًا حقيقيًا. هذه الحلقة تزيد الضغط بعد قليل، لا تخففه.»
nobody-knows: همسة: ««لا أحد سيعرف»» / الرد: «المسألة ليست من يعرف. المسألة أن السلسلة تستنزف وقتك وطاقتك وثقتك.»
PURPOSE / CONTEXT: Countering the internal negotiation voice
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 151–196

ID: TAX-007
SCREEN: Shared Content (Taxonomy)
LOCATION: Journey stages — JOURNEY_STAGES[]
TYPE: label + description (conditional)
STATE / CONDITION: Dose Screen header + stage note; Progress journey card (by daysSinceStart)
CURRENT TEXT: stabilize (أيام 1–14): «التثبيت» — أهم هدف الآن: تقليل السلوك ووقف السلاسل مبكرًا، وبناء أول روتين يومي بسيط.
understand (أيام 15–45): «الفهم» — تتعرف على محفزاتك وأنماطك، وتكتشف نقطة التدخل الأفضل في سلسلتك.
build-skills (أيام 46–90): «بناء المهارات» — تتقن مهارات القطع والملاحظة، وتحوّل خطتك من رد فعل إلى نظام استباقي.
rebuild (أيام 91–180): «إعادة بناء الحياة» — التوسع في الحياة نفسها: هدف، علاقات، جسد، روتين ليلي — لا مجرد الامتناع.
strengthen (أيام 181–365): «التعزيز» — تثبيت النمط الجديد، والتعامل مع أنماط قديمة قد تعاود الظهور في أوقات الضغط.
maintain (أيام 366–730): «الصيانة» — الحفاظ على المكاسب بأقل جهد، مع يقظة لأوقات الضعف (إجهاد، اضطراب نوم، تغيرات).
wisdom (أيام 731–100000): «المدى الطويل» — الخبرة تراكمت. الهدف: حياة تُدار بقيمك، واستخدام التطبيق عند الحاجة فقط.
PURPOSE / CONTEXT: Journey stage naming and explanation
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 198–255

ID: TAX-008
SCREEN: Shared Content (Taxonomy)
LOCATION: Journey disclaimer — JOURNEY_DISCLAIMER
TYPE: disclaimer
STATE / CONDITION: always with the stage display (Dose + Progress)
CURRENT TEXT: هذه مراحل تنظيمية للمحتوى والرحلة، لا جدولًا زمنيًا بيولوجيًا مضمونًا للتعافي.
PURPOSE / CONTEXT: Honesty note: stages organize content, not a guaranteed timeline
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 257–258

ID: TAX-009
SCREEN: Shared Content (Taxonomy)
LOCATION: Work-safe steps — WORK_SAFE_STEPS[]
TYPE: conditional instruction list
STATE / CONDITION: Emergency step 1, workSafe=true only (items [1..4])
CURRENT TEXT: 0: «أغلق كل التبويبات والتطبيقات غير المتصلة بمهمتك.»
1: «أبقِ فقط مهمة العمل/الدراسة المطلوبة على الشاشة.»
2: «جهاز واحد لغرض واحد متعمد — لا تعدد مهام.»
3: «تجنب أي تصفح خارج المهمة مهما كان «سريعًا».»
4: «إن أمكن: غيّر مكان جلوسك الفعلي.»
5: «ضع الجهاز على سطح ثابت بدل حملك له باستمرار.»
6: «اعمل ١٠ دقائق كاملة الآن.»
7: «أعد التقييم بعدها: هل انخفض الخطر؟»
PURPOSE / CONTEXT: Work-safe sub-steps under the main instruction
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 282–291

ID: TAX-010
SCREEN: Shared Content (Taxonomy)
LOCATION: Digital protection guides — DIGITAL_PROTECTION_GUIDES[]
TYPE: collapsible guide cards (title + what + how[] + limits)
STATE / CONDITION: Prevention screen «الحماية الرقمية» (collapsed by default)
CURRENT TEXT: blockers: «حاجبات المواقع»
  ما هي: إضافات أو تطبيقات تمنع فتح مواقع محددة أو فئاتها.
  كيف: اختر إضافة موثوقة لمتصفحك (مثل Cold Turkey أو BlockSite أو LeanBrowser). / أضف المواقع التي تعرف أنها تبدأ بها السلسلة عادة. / فعّل وضعًا يمنع التعطيل السهل أثناء لحظة الضعف.
  حدودها: يمكن تجاوزها بالإضافة أو المتصفح الآخر — أداة مساعدة لا حل كامل.
profiles: «ملف متصفح منفصل للعمل»
  ما هي: ملف/مستخدم مختلف في المتصفح: للعمل فقط، دون إضافاتك الشخصية وسجلّك.
  كيف: أنشئ ملفًا جديدًا باسم «عمل». / لا تسجل دخول أي حسابات ترفيهية فيه. / اجعله الملف الافتراضي أثناء الدوام/الدراسة.
  حدودها: يتطلب انضباطًا في العودة إليه عند الملل — ادعمه بقاعدة «إذا… إذن».
dns: «تصفية DNS»
  ما هي: تصفية على مستوى الشبكة/الجهاز تمنع فئات المواقع قبل أن تُحمَّل.
  كيف: استخدم خدمة تصفية عائلية على راوتر المنزل إن كان متاحًا. / أو اضبط DNS تصفية على جهازك (مثل خدمات التصفية المعروفة). / اجعل إعداد كلمة المرور بيد شخص تثق به إن أمكن.
  حدودها: قد تُبطئ بعض المواقع أو تُعطّل محتوى سليمًا، وتُتجاوز بشبكة بديلة.
safesearch: «البحث الآمن (SafeSearch)»
  ما هي: خيار في محركات البحث يفلتر النتائج الصريحة.
  كيف: فعّله من إعدادات محرك البحث الذي تستخدمه. / أفعله على كل متصفحاتك وأجهزتك. / قفله عبر حساب الإدارة إن توفر.
  حدودها: غير مضمون 100% — طبقة أولى فقط.
focus: «أوضاع التركيز وقيود التطبيقات»
  ما هي: أدوات نظام في الهاتف/الكمبيوتر تحدّد الاستخدام والتطبيقات المسموحة.
  كيف: استخدم وضع التركيز/العمل في نظام جهازك. / حدد فترات مسموح فيها بالتطبيقات الترفيهية فقط. / أزل إشعارات التطبيقات غير الضرورية كليًا.
  حدودها: إشعارات محدودة تُدار من النظام نفسه وتحتاج تحديثًا دوريًا.
night: «بروتوكول الوقت المتأخر»
  ما هي: لا سلسلة تقريبًا تبدأ دون وقت متأخر + وحدة + جهاز. صمّم ضد هذا الثلاثي.
  كيف: الهاتف خارج غرفة النوم منذ ٣٠-٦٠ دقيقة قبل النوم. / منبّه منفصل لا هاتف. / قاعدة بيتية: السرير للنوم فقط.
  حدودها: أقوى أداة لديك لوقت الليل، لكنها تحتاج تجهيزًا قبل وقت الضعف لا أثناءه.
PURPOSE / CONTEXT: Optional external tool guides with honest limits
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 293–366

ID: TAX-011
SCREEN: Shared Content (Taxonomy)
LOCATION: Digital protection honesty note — DIGITAL_PROTECTION_HONESTY
TYPE: warning note
STATE / CONDITION: always under the digital protection guides
CURRENT TEXT: بصراحة: صفحة ويب عادية لا تستطيع حجب كل موقع أو تطبيق على مستوى جهازك كله. هذه أدوات وقاية تُجهّز مسبقًا وتُدار من نظامك — لا تُضبط أثناء أزمة، ولا نعدك بحماية كاملة.
PURPOSE / CONTEXT: Honest limitation of in-app protection advice
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 368–369

ID: TAX-012
SCREEN: Shared Content (Taxonomy)
LOCATION: Support message templates — SUPPORT_MESSAGE_TEMPLATES[]
TYPE: copyable neutral message chips
STATE / CONDITION: Prevention «قوالب رسائل محايدة»; Emergency escalated fallback shows template[0]
CURRENT TEXT: «محتاج أقعد معاك شوية، عندك وقت؟»
«يومي تقيل شوية — نتمشى سوا؟»
«أحتاج أشغلك معي في شي ١٠ دقائق، تساعدني؟»
«متوفر دلوقتي؟ أبي أفرّغ كلام كتير.»
PURPOSE / CONTEXT: Neutral scripts the user can send a trusted person
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 371–376

ID: TAX-013
SCREEN: Shared Content (Taxonomy)
LOCATION: Vulnerability factors — VULNERABILITY_FACTORS[]
TYPE: option labels (multi-select chips)
STATE / CONDITION: Relapse calm review step 2
CURRENT TEXT: sleep: «قلة نوم»
stress: «توتر/ضغط»
loneliness: «وحدة»
late-night: «سهر متأخر»
unstructured: «وقت غير منظم»
device: «استخدام مكثف للجهاز»
fatigue: «إرهاق جسدي»
conflict: «خلاف أو ضيق من شخص»
PURPOSE / CONTEXT: What weakened resistance that day
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 381–390

ID: TAX-014
SCREEN: Shared Content (Taxonomy)
LOCATION: Personal why reasons — PERSONAL_WHY_REASONS[]
TYPE: option labels (chips)
STATE / CONDITION: Onboarding step 6; Values screen; Emergency PersonalWhy fallback chips
CURRENT TEXT: time: «وقتي»
study: «دراستي»
career: «مستقبلي المهني»
relationships: «علاقاتي»
values: «قيمي»
spirituality: «روحانيتي»
focus: «تركيزي»
discipline: «انضباطي»
self-respect: «احترامي لنفسي»
health: «صحتي»
PURPOSE / CONTEXT: The user's chosen 'why' vocabulary
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 392–403

ID: TAX-015
SCREEN: Shared Content (Taxonomy)
LOCATION: Spiritual practices — SPIRITUAL_PRACTICES[]
TYPE: collapsible cards (title + body + steps[]) — gated
STATE / CONDITION: Values screen, spiritualContent === true only
CURRENT TEXT: wudu-prayer: «وضوء + ركعتان»
  الحركة الجسدية للوضوء بالماء تغيّر حالتك، والصلاة تعيد ترتيب أولويات اللحظة.
  خطوات: توضأ بماء بارد على الوجه واليدين. / صلِّ ركعتين بنية الهدوء والعودة. / بعد السلام: خذ نفسًا عميقًا ثم عد لنشاطك.
dhikr: «ذكر قصير متكرر»
  تكرار هادئ (مثل التسبيح أو الاستغفار) يعمل كمرساة انتباه تُخفض التسارع الذهني.
  خطوات: اختر صيغة واحدة قصيرة. / كررها ببطء مع التنفس ٢-٣ دقائق. / لا تطارد أفكارًا مقاطعة — عد إلى الصيغة.
quran: «قراءة قرآن ١٠ دقائق»
  قراءة بتدبر — ولو صفحة واحدة — تبعد الانتباه عن المحفز وتعيد الاتساق الداخلي.
  خطوات: افتح على صفحة قصيرة. / اقرأ بصوت مسموع وبطيء. / اختم بدعاء قصير يعنيك.
tawbah: «التوبة والعودة — بلا يأس»
  في التصور الإسلامي: باب التوبة مفتوح دائمًا، والعودة تكون بالهمة، لا بالانكسار. لا تقنط من رحمة الله مهما تكرر التعثر — القنوط نفسه يطيل السلسلة.
  خطوات: أوقف السلوك أولًا (هذه بداية التوبة). / استغفر دون جلد للذات. / اتخذ خطوة عملية تمنع التكرار (قاعدة «إذا… إذن»).
reflection: «تأمل ومراجعة قيم»
  جلسة هدوء قصيرة تسأل فيها نفسك: ما القيمة التي أريد أن يحترمها هذا اليوم؟
  خطوات: اجلس ٥ دقائق بلا شاشة. / اسأل: ما الذي أريد أن أكونه اليوم؟ / اكتب جملة واحدة.
PURPOSE / CONTEXT: Optional spiritual practice guidance
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 405–461

ID: TAX-016
SCREEN: Shared Content (Taxonomy)
LOCATION: Spiritual disclaimer — SPIRITUAL_DISCLAIMER
TYPE: info note — gated
STATE / CONDITION: Values screen, spiritualContent === true only
CURRENT TEXT: هذا القسم روحي/قيمي اختياري بالكامل، ويظهر فقط لمن فعّله. وهو منفصل عن المحتوى العلمي في التطبيق — الممارسات الروحية ليست علاجًا طبيًا ولا ادعاءً علميًا.
PURPOSE / CONTEXT: Separates spiritual content from clinical claims
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 463–464

ID: TAX-017
SCREEN: Shared Content (Taxonomy)
LOCATION: When to seek professional help — WHEN_TO_SEEK_HELP[]
TYPE: bullet list
STATE / CONDITION: Settings «متى تطلب دعمًا مهنيًا؟»
CURRENT TEXT: «تشعر أن السلوك يتصاعد رغم محاولاتك المتكررة.»
«تتأثر دراستك/عملك أو علاقاتك بشكل واضح ومستمر.»
«تشعر بانسحاب من الحياة أو اكتئاب يلازمك.»
«تلجأ للسلوك كأسلوب وحيد تقريبًا لمواجهة الضغط.»
«ظهرت أفكار لإيذاء نفسك — اطلب مساعدة فورًا.»
PURPOSE / CONTEXT: Professional-help escalation criteria
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 466–472

ID: TAX-018
SCREEN: Shared Content (Taxonomy)
LOCATION: Time bucket labels — TIME_BUCKET_LABELS
TYPE: labels
STATE / CONDITION: Trigger Map time distribution rows; Progress insight row
CURRENT TEXT: morning: «الصباح (٥ص–١٢م)»
afternoon: «بعد الظهر (١٢م–٥م)»
evening: «المساء (٥م–١٠م)»
late-night: «الليل المتأخر (١٠م–٥ص)»
PURPOSE / CONTEXT: Time-of-day bucket names
SOURCE FILE: src/lib/app/helpers.ts
SOURCE LOCATION: lines 74–79

ID: TAX-019
SCREEN: Shared Content (Taxonomy)
LOCATION: Boredom menu — BOREDOM_MENU[]
TYPE: UNUSED library content
STATE / CONDITION: defined but never imported by any component
CURRENT TEXT: ٥ دقائق: ترتيب المكتب / غسل الأطباق / تجهيز مهمة الغد
١٥ دقيقة: مشي / قراءة / دراسة موضوع صغير / تمرين خفيف
٣٠ دقيقة: تمرين رياضي / جلسة دراسة مركزة / العمل على مشروع / خروج قصير / نشاط اجتماعي
PURPOSE / CONTEXT: REVIEW: uncertain — not currently reachable in the UI
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 260–280

ID: TAX-020
SCREEN: Shared Content (Taxonomy)
LOCATION: Work-safe principle — WORK_SAFE_PRINCIPLE
TYPE: UNUSED library content
STATE / CONDITION: defined but never imported by any component
CURRENT TEXT: لا تحارب التقنية. هندِس السياق المحيط بها.
PURPOSE / CONTEXT: REVIEW: uncertain — not currently reachable in the UI
SOURCE FILE: src/data/app/taxonomy.ts
SOURCE LOCATION: lines 378–379

ID: TAX-021
SCREEN: Shared Content (Taxonomy)
LOCATION: Greeting() — helpers.ts
TYPE: dynamic greeting (title)
STATE / CONDITION: Home ScreenHeader title, by hour: <5 / <12 / <17 / <21 / else
CURRENT TEXT: «ليلة هادئة» (قبل ٥ص) / «صباح الخير» (٥ص–١٢م) / «نهارك طيب» (١٢م–٥م) / «مساء الخير» (٥م فأكثر)
PURPOSE / CONTEXT: Time-of-day greeting
SOURCE FILE: src/lib/app/helpers.ts
SOURCE LOCATION: lines 57–64

ID: KB-000
SCREEN: Knowledge Content Library
LOCATION: Category chips — KNOWLEDGE_CATEGORIES[]
TYPE: filter chip labels (+ live counts)
STATE / CONDITION: Knowledge screen chip row; «الكل (N)» chip added in screen; spiritual chip hidden when toggle OFF
CURRENT TEXT: brain-behavior: «الدماغ والسلوك»
triggers: «المحفزات»
urges: «الرغبات»
habit-loops: «حلقات العادة»
environment: «البيئة»
sleep: «النوم»
stress: «التوتر»
emotions: «المشاعر»
attention: «الانتباه»
discipline: «الانضباط»
relationships: «العلاقات»
digital: «العادات الرقمية»
relapse: «التعثر»
self-compassion: «الرحمة بالذات»
purpose: «الهدف»
values: «القيم»
spiritual: «تأمل روحي»
long-term: «المدى الطويل»
prevention: «الوقاية»
emergency-skills: «مهارات الطوارئ»
PURPOSE / CONTEXT: Knowledge category vocabulary
SOURCE FILE: src/data/app/knowledge.ts
SOURCE LOCATION: lines 6–27

ID: KB-001
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — bb-dopamine
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الدوبامين: إشارة دافع، لا «مادة متعة»»
اعرف: الدوبامين يشارك في الدافع والتوقع أكثر من مشاركته في المتعة نفسها.
افهم: لهذا قد تشعر بدافع قوي نحو شيء تعرف مسبقًا أنه لن يريحك بعده. الدافع والاستمتاع مساران مختلفان، والأول يمكن أن يشتد بينما الثاني يخفت.
افعل: عند ظهور الدافع، ذكّر نفسك: «هذه إشارة دافع، ليست وعدًا بمتعة»، ثم غيّر السياق.
تذكّر: الدافع ليس أمرًا.
قراءة أعمق: في أبحاث التعزيز، يُفرَّق بين «الرغبة» (wanting) و«الاستمتاع» (liking)، ويبدو أنهما يعتمدان على أنظمة عصبية مختلفة يمكن أن يفترق أداؤهما مع التكرار.
PURPOSE / CONTEXT: Knowledge card content (brain-behavior)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "bb-dopamine"

ID: KB-002
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — bb-sensitization
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «لماذا يشتد الدافع مع التكرار؟»
اعرف: تشير بعض الأبحاث إلى أن تكرار سلوك محفّز قد يجعل «إشاراته» أسرع في إطلاق الدافع، لا أقل.
افهم: المعاينة/الذكرى/المشهد قد يصبح مع الوقت بوقًا مبكرًا للدافع — أي أن السلسلة تبدأ أسرع مما كانت. هذا نمط سلوكي متعلم، وهو قابل للانحسار مع عدم الإطعام، لكن دون جدول زمني مضمون.
افعل: عامل إشاراتك المبكرة باحترام: لا تختبرها ولا تقترب منها «للتجربة».
تذكّر: الإشارة التي تُطعَم تتقوى، والتي تُترك تضعف تدريجيًا عادة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (brain-behavior)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "bb-sensitization"

ID: KB-003
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — bb-neuroplasticity
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «التغيير ممكن — وبلا موعد مضمون»
اعرف: الدماغ يحتفظ بقدرته على إعادة تشكيل الأنماط عبر العمر، لكن لا يوجد رقم أيام «يعيد ضبطه».
افهم: فكرة أن عددًا محددًا من الأيام (٩٠ مثلًا) «يصفّر الدماغ» مبالغة شائعة. ما يحدث فعليًا أبطأ وأكثر تدرجًا: تضعف السلسلة كلما قلّ تكرارها، ويقوى المسار البديل كلما تكرر هو.
افعل: قِس الاتجاه لا الكمال: هل سلاسلك أقصر وأبطأ بدءًا من الشهر الماضي؟
تذكّر: التقدم اتجاه، لا تاريخًا في التقويم.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (brain-behavior)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "bb-neuroplasticity"

ID: KB-004
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — bb-variable-reward
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «المكافأة المتغيرة: لماذا يشدّ «البحث» نفسه؟»
اعرف: المكافأة غير المؤكدة (لا تعرف ماذا ستجد) تُبقي الانتباه مشدودًا أكثر من المكافأة المؤكدة.
افهم: هذا مبدأ تصميم أساسي في المنصات وألعاب الحظ، وهو نفسه ما يجعل «تصفحًا بريئًا» ينزلق: العقل يلاحق علامة استفهام، لا نتيجة.
افعل: عند شعور «دعني أرَ فقط»: سمِّ ما يحدث — «مكافأة متغيرة» — وأغلق.
تذكّر: الفضول ليس أمرًا بالبحث.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (brain-behavior)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "bb-variable-reward"

ID: KB-005
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — bb-wanting-liking
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «قد يبقى الدافع بعد ذهاب المتعة»
اعرف: كثيرون يصفون استمرارهم في السلوك رغم أن المتعة الفعلية ضعيفة أو غائبة.
افهم: هذا ليس تناقضًا ولا «ضعفًا»، بل من طبيعة الدافع المتعلم: يستمر كعادة تُنفَّذ بلا مقابل حقيقي. ملاحظة هذا الفارق تضعف السلسلة لأنها تكشف خواءها.
افعل: بعد أي زلة، سجّل بصدق: كم كانت «المتعة» فعلًا؟ ماذا بقي بعدها؟
تذكّر: عادة بلا مقابل تستحق أن تُدار، لا أن تُعاش.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (brain-behavior)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "bb-wanting-liking"

ID: KB-006
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — tr-broad
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «المحفز أوسع مما تظن»
اعرف: المحفزات ليست فقط المحتوى الصريح: ذكرى، ملل، وحدة، وقت متأخر، حتى «التقاط الهاتف آليًا».
افهم: من يعتبر المحفز «الصور فقط» يتفاجأ بالسلاسل التي تبدأ من الملل أو الوحدة. تحديد محفزاتك الحقيقية — الداخلية والخارجية — هو أول خط دفاع، وأدقّه.
افعل: استخدم خريطة المحفزات: سجّل في كل فحص رغبة السياق والمحفز، وستبدأ الأنماط بالظهور خلال أسبوع.
تذكّر: ما لا تسمّيه لا تستطيع إدارته.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (triggers)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "tr-broad"

ID: KB-007
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — tr-combo
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الثلاثية الأشهر: ليل + وحدة + جهاز»
اعرف: أكثر السياقات تكرارًا في بدء السلاسل هو اجتماع عدة عوامل: وقت متأخر، انعزال، وجهاز في اليد.
افهم: العامل الواحد قابل للتحمل، والاجتماع هو ما يصنع النافذة الخطرة. لهذا لا يكفي «أقوى عزيمة» — المطلوب تفكيك الاجتماع نفسه: أحدها فقط يكفي كسره.
افعل: صمّم ضد الثلاثية: هاتف خارج الغرفة ليلًا + النوم مبكرًا + قاعدة «لا تصفح خارج غرفة مفتوحة».
تذكّر: اكسر حلقة واحدة من الثلاث، تسقط النافذة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (triggers)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "tr-combo"

ID: KB-008
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — tr-early-detection
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «التدخل المبكر أرخص بكثير»
اعرف: قطع السلسلة عند أول علامة أسهل بكثير من قطعها عند الذروة — لأن الانسحاب يزداد صعوبة مع كل حلقة.
افهم: بعد بدء التصفح يرتفع التوتر وتضيق مساحة الاختيار، فيصبح «الإغلاق» أشبه بتسلق جدار. قبل البدء هو مجرد خطوة. الفارق بين الحالتين هو مهارة الملاحظة المبكرة.
افعل: اربط إنذارًا بعلامتك الأولى: «أول تصفح بلا هدف الليلة = أغلق وأخرج فورًا».
تذكّر: أول علامة هي أرخص فرصة للقطع.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (triggers)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "tr-early-detection"

ID: KB-009
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — tr-curiosity
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الفضول: صوت لطيف بنتائج ثقيلة»
اعرف: «دعني أتأكد فقط» — الفضول يقدم نفسه كبحث بريء بينما هو بداية السلسلة في أغلب السجلات.
افهم: الفضول شعور مشروع، لكنه ليس تعليمات تنفيذ. الفارق بين الشعور والطاعة هو كل مهارة التحكم — لا تحتاج إخماق الفضول، تحتاج فقط ألا تجعله سائقًا.
افعل: سمِّه: «هذا فضول»، ثم قرر بخطة مسبقة: «لا أبحث الآن. أغيّر النشاط ١٠ دقائق».
تذكّر: الفضول ليس أمرًا بالبحث.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (triggers)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "tr-curiosity"

ID: KB-010
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — tr-log-patterns
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «سجلك يكشف ما لا تذكره»
اعرف: الذاكرة تُجمّل، والسجل لا. أنماطك الحقيقية تسكن في التسجيلات المتكررة لا في الانطباع العام.
افهم: «عادة ما أقوى مساءً» انطباع، أما «٧ من ٩ سلاسل بدأت بعد ١١م وأنا وحدي في غرفتي» فقاعدة قابلة للهندسة. الفرق بينهما هو الفرق بين نية عامة وخطة تنفذ.
افعل: راجع خريطة المحفزات أسبوعيًا واكتشف: أكثر محفز، أكثر وقت، أول علامة الأكثر تكرارًا.
تذكّر: النمط المسجل قابل للهندسة؛ الانطباع فقط قابل للندم.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (triggers)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "tr-log-patterns"

ID: KB-011
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — ur-wave
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الرغبة موجة، لا جدار»
اعرف: الرغبات غالبًا ما تتصاعد حتى ذروة ثم تنحسر خلال دقائق إلى أقل من ساعة إن لم تُطعَم.
افهم: الإحساس وقت الذروة يوحي بأنه «سيبقى هكذا حتى أنفذ» — وهذا غير صحيح عادة. من انتظر الموجة مرات عرف أنها تنكسر وحدها. مهمتك ليست إيقافها بل عدم ركوبها.
افعل: في الذروة: مؤقت ١٠ دقائق + تنفس + ملاحظة. لا قرار إطلاقًا قبل انتهاء المؤقت.
تذكّر: الموجة تمر بغض النظر — التنفيذ هو الاختيار.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (urges)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "ur-wave"

ID: KB-012
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — ur-not-command
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الرغبة ليست أمرًا»
اعرف: بين الإحساس بالرغبة وبين الفعل توجد فجوة — وهذه الفجوة هي مساحة حريتك كاملة.
افهم: تضيق الفجوة وقت الذروة حتى تبدو معدومة، لكنها لا تختفي. كل مهارة في هذا التطبيق — الملاحظة، التسمية، تغيير البيئة — هدفها واحد: توسيع هذه الفجوة لحظة كافية لاختيار مختلف.
افعل: تدرب على التسمية: «رغبة موجودة… وأنا لست مجبرًا» ثم نفّذ خطوة فعلية واحدة.
تذكّر: الرغبة ليست أمرًا.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (urges)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "ur-not-command"

ID: KB-013
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — ur-suppression
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «لماذا يفشل «لا تفكر فيه أبدًا»؟»
اعرف: محاولة قمع فكرة عن عمد تجعلها أكثر حضورًا — وهذا ما تُظهره أبحاث «العمليات المرتدة».
افهم: أمر «الإخماد» يفرض على عقلك مراقبة الفكرة باستمرار ليتأكد من غيابها — فتبقى حاضرة في الخلفية. الحل ليس قوة أكبر في الإخماد، بل انتباه مُدار لهدف بديل.
افعل: لا تصارع الفكرة: سمِّها، ولا تُضف عليها تفاصيل، ثم وجّه انتباهك لشيء ملموس حولك.
تذكّر: ما تلاحظه بهدوء يفقد سلطته، وما تصارعه يتغذى.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (urges)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "ur-suppression"

ID: KB-014
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — ur-surfing-skill
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «ركوب الموجة: مهارة تُتقن بالتكرار»
اعرف: «ركوب الموجة» يعني مراقبة الرغبة كظاهرة تتصاعد وتنحسر — دون تنفيذ ودون قمع.
افهم: هذه المهارة تُبنى: أول مرة تبدو مستحيلة، ثالث مرة صعبة، عاشرة مرة تصبح معروفة ومملة بعض الشيء. الفارق بين مرة وأخرى هو خبرتك الشخصية بأن الموجة تنكسر فعلًا.
افعل: تدرّب عليها في المستويات المنخفضة أولًا (٣-٥) — لا تنتظر أزمة لتتعلم السباحة.
تذكّر: كل موجة عشتها دون تنفيذ دليل يتراكم.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (urges)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "ur-surfing-skill"

ID: KB-015
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — ur-fade
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الرغبات تخفت… عادةً»
اعرف: مع عدم التكرار، تشهد أغلب التجارب خفوتًا في وتيرة الرغبات وشدتها بمرور الوقت.
افهم: لكن المسار ليس خطًا هابطًا: أيام قوية وأيام هادئة، وقد تعود نماذج قديمة في فترات ضغط أو إرهاق. هذا لا يعني أن كل ما بنيت «تساقط» — الجهد المتراكم هو الأصل، والتذبذب جزء من الطريق.
افعل: في يوم قوي: لا تستنتج شيئًا عن نفسك. نفّذ خطتك القصيرة وواصل.
تذكّر: التذبذب طبيعي؛ الاتجاه هو المهم.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (urges)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "ur-fade"

ID: KB-016
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — hl-loop
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «حلقة العادة: إشارة → روتين → مكافأة»
اعرف: العادة ليست «ضعف شخصية» بل حلقة: إشارة تُطلق روتينًا يمنح مكافأة قصيرة الأثر.
افهم: حين تفهم السلسلة كحلقة، يتغير السؤال من «كيف أقوى؟» إلى «أين أكسر الحلقة؟». أرخص نقطة الكسر هي الإشارة نفسها (السياق)، وأغلاها المكافأة (بعد التنفيذ).
افعل: ارسم سلسلتك المعتادة خطوة خطوة على ورقة، وضع دائرة على أول نقطة تستطيع قطعها.
تذكّر: كل سلسلة لها نقطة كسر أرخص — مهمتك إيجادها.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (habit-loops)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "hl-loop"

ID: KB-017
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — hl-implementation
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «نوايا التنفيذ: أدلة قوية وتكلفة صفر»
اعرف: صياغة خطة بصيغة «إذا حدث كذا → أفعل كذا» من أكثر التقنيات المدروسة فاعلية في تغيير السلوك.
افهم: السبب: الخطة تُتخذ وأنت هادئ، فتسلم القيادة لاحقًا من «قرار لحظي» إلى «قاعدة جاهزة». وقت الذروة لا يصلح للتفكير، بل للتنفيذ فقط.
افعل: اكتب الآن ٣ قواعد «إذا… إذن» لأكثر سياقاتك خطورة، وفعّلها في خطة الوقاية.
تذكّر: القرار يُصنع هادئًا، ويُنفذ مضطربًا.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (habit-loops)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "hl-implementation"

ID: KB-018
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — hl-context
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «السلوك يتبع السياق أكثر من النية»
اعرف: أغلب ما نفعله يحدده المكان والوقت والحالة السابقة — لا القرارات الواعية لحظة بلحظة.
افهم: نيتك «ممانعة» تُختبر ضد سياق مجهز لبدء السلسلة. من غير الإنصاف أن تحاسب نفسك على خسارة المواجهة — الأصح أن تجهز سياقًا لا يفرض المواجهة أصلًا.
افعل: غيّر سياقك عالي الخطورة: مكان الجلوس، مكان الهاتف ليلًا، أول تطبيق تفتحه.
تذكّر: لا تختبر نفسك أمام المحفز — هندِس البيئة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (habit-loops)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "hl-context"

ID: KB-019
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — hl-willpower
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «النظام يهزم الحماس»
اعرف: الاعتماد على الحماس وحده يجعل أيامك رهينة مزاجك — والأنظمة تعمل في كل الأحوال تقريبًا.
افهم: الحماس مورد متذبذب بطبيعته. النظام (روتين + قواعد + بيئة مهيأة) يعمل يوم الضعف كما يعمل يوم القوة، وهذا بالضبط ما يجعل الفارق التراكمي.
افعل: حطّم هدفك إلى روتين يومي صغير: مهمة واحدة + حركة + تواصل + مراجعة مسائية.
تذكّر: أيام الضعف هي التي تختبر نظامك لا حماسك.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (habit-loops)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "hl-willpower"

ID: KB-020
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — hl-substitute
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «استبدال أذكى من الإفراغ التام»
اعرف: حلقة العادة لا تُحذف غالبًا — تُستبدل استجابة مختلفة لنفس الإشارة والمكافأة التقريبية.
افهم: «لن أفعل شيئًا وقت الملل» خطة فارغة، والفراغ يعيد السلوك القديم. البديل يجب أن يحقق شيئًا من المكافأة (انشغال، إثارة خفيفة، راحة) بطريقة لا تدمّر: رياضة، لعبة فكرية، مشي، مكالمة.
افعل: لكل إشارة معتادة عندك، اكتب بديلًا واحدًا محددًا — واحتفظ به في قائمة الملل.
تذكّر: الإشارة ستحضر حتمًا — الاستجابة هي ما تختاره.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (habit-loops)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "hl-substitute"

ID: KB-021
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — en-friction
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الاحتكاك المقصود: ثوانٍ تصنع الفارق»
اعرف: إضافة ٢٠ ثانية بينك وبين سلوك ما تخفض احتمال حدوثه فعليًا — والاختصار ٢٠ ثانية يرفعه.
افهم: قراراتنا اللحظية تنجذب للمسار الأقل مقاومة. جعل المحفز أبعد قليلًا (جهاز في غرفة أخرى، تطبيق محذوف، تسجيل خروج) يجعل البدء «قرارًا» بعد أن كان «انزلاقًا».
افعل: طبّق اليوم: أضف احتكاكًا لمدخل السلسلة عندك، وأزل احتكاكًا عن بديل مفيد.
تذكّر: لا تستهلك إرادتك في مقاومة سهلة التفادي.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (environment)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "en-friction"

ID: KB-022
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — en-bedroom
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «غرفة النوم للنوم»
اعرف: السرير مكان يربطه الدماغ بما يتكرر فيه — والتصفح فيه يجعله مرتبطًا بالسلسلة أيضًا.
افهم: كل سلسلة في السرير تضيف للغرفة «وظيفة» إضافية، فيصبح مجرد الاستلقاء إشارة بدء. عكس ذلك صحيح أيضًا: عزل السرير للنوم يعيد إليه وظيفته الأصلية ويساعد النوم نفسه.
افعل: قاعدة صارمة: لا هاتف في السرير. المنبه منفصل، والجهاز يبات خارج الغرفة.
تذكّر: كل غرفة وظيفة واحدة — والسرير للنوم.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (environment)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "en-bedroom"

ID: KB-023
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — en-people
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الناس في مدى البصر»
اعرف: مجرد وجود أشخاص في مدى بصرك يغير معادلة السلوك — دون أن يعرفوا شيئًا.
افهم: هذا السلوك يعيش في الخفاء؛ ومن هنا فإن الانتقال إلى مكان مفتوح أو الجلوس بين الناس ليس «حلًا نفسيًا» بل تغيير فيزيائي مباشر في بيئة التنفيذ. لا يلزم كشف أي شيء لأي أحد.
افعل: في لحظة خطر: انتقل إلى مكان فيه أشخاص — صالة، مكتبة، مجلس — وابقَ حتى يهبط.
تذكّر: الخفاء وقود السلسلة — والحضور البشري مطفأته.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (environment)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "en-people"

ID: KB-024
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — en-homescreen
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «أول شاشة تراها = أول قرار تتخذه»
اعرف: ترتيب الشاشة الرئيسية يوجه فتحك للجهاز بلا وعي: ما كان أمامك يُفتح أولًا.
افهم: التطبيقات عالية الخطورة في الصف الأول تجعل كل فحظة سريعة «للساعة أو الرسالة» مرورًا إجباريًا بمدخل السلسلة. نقلها لصف مدفون أو حذفها يجعل المرور اختيارًا لا قدرًا.
افعل: رتب شاشتك: أدوات مفيدة فقط في الواجهة، والتطبيقات المستهلكة في مجلد بعيد أو محذوفة.
تذكّر: شاشتك الرئيسية هي بوابتك — نظّمها لصالحك.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (environment)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "en-homescreen"

ID: KB-025
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — en-leaving
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الخروج من المكان: أرخص تدخل تملكه»
اعرف: تغيير الغرفة خلال أول لحظات الرغبة من أسرع التدخلات أثرًا وأقلها كلفة.
افهم: السلسلة مرتبطة بالمكان الذي بدأت فيه — فكرك يستخدم الغرفة كامتداد للذاكرة. مغادرة الغرفة تقطع هذا الامتداد فورًا وتعيدك لسياق آخر له ذكريات ووظائف مختلفة.
افعل: قاعدة جاهزة: «أول شعور خطر = أقوم وأخرج من الغرفة» — قبل أي نقاش داخلي.
تذكّر: قدماك أسرع من أفكارك وقت الذروة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (environment)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "en-leaving"

ID: KB-026
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sl-self-regulation
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «قلة النوم تُضعف مزاجك وقدرتك على الضبط»
اعرف: الحرمان من النوم يرتبط في الأبحاث بتراجع في الانتباه والمزاج والتحكم في الاندفاعات.
افهم: هذا يعني أن ليالي السهر الطويلة ليست «وقتًا حرًا» بل فتحًا مباشرًا لنافذة الخطر: جهاز عصبي متعب + وقت متأخر + وحدة. جودة يومك التالي تُصنع في ليلتك، لا في صباحك.
افعل: ثبّت موعد نوم قريبًا من منتصف الأسبوع نفسه بعطلة نهايته — والانحراف ساعة كحد أقصى.
تذكّر: نومك أول خط دفاع، لا رفاهية.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (sleep)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sl-self-regulation"

ID: KB-027
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sl-window
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الساعة الأخيرة قبل النوم: نافذة الخطر الأولى»
اعرف: أكثر سلاسل الليل تبدأ بعد أن «انتهى كل شيء» — حين تبقى مستيقظًا بلا مهمة والجهاز وحيد معك.
افهم: وقت ما بعد الأعمال والإلزامات هو الأخطر لأنه يجمع: إرهاقًا (ضعف ضبط) + وحدة + فراغًا + سرّية. من يدير ساعته الأخيرة يدير أكثر أسباب التعثر تكرارًا.
افعل: بروتوكول ثابت للساعة الأخيرة: جرّد الجهاز، جهّز الغد، اقرأ شيئًا ورقيًا، نم.
تذكّر: لا تفاوض في الساعة الأخيرة — نفّذ البروتوكول.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (sleep)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sl-window"

ID: KB-028
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sl-phone-out
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الهاتف خارج الغرفة: قاعدة بمردود مضاعف»
اعرف: نوم الهاتف خارج غرفة النوم يحسّن النوم ويغلق أشهر مداخل السلاسل في آن واحد.
افهم: الأبحاث تشير إلى أن مجرد وجود الهاتف قريبًا يشتت النوم حتى لو لم يُستخدم. وعلى الجبهة الأخرى: معظم سلاسل الليل تبدأ بـ«فحص سريع» من السرير. قاعدة واحدة تقطع الطريقين معًا.
افعل: اشترِ منبهًا بسيطًا، واجعل للهاتف «مبيتًا» ثابتًا خارج غرفتك — ابدأ الليلة.
تذكّر: قاعدة واحدة، حماية مزدوجة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (sleep)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sl-phone-out"

ID: KB-029
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sl-protocol
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «بروتوكول ما قبل النوم»
اعرف: الدماغ يحتاج فترة انتقال من اليقظة للنوم — والإضاءة والشاشات تؤخر هذه الفترة.
افهم: القفز من التصفح إلى «نم الآن» لا يعمل غالبًا: يبقى الدماغ مثارًا فيبحث عن شيء يفعله، والسرير الدافئ مكان مثالي للسلسلة. فترة تهدئة ٣٠-٦٠ دقيقة تحل المشكلة من جذرها.
افعل: آخر ٣٠ دقيقة: إضاءة خافتة، لا شاشات، قراءة ورقية أو استرخاء، ثم النوم مباشرة.
تذكّر: تهدئة قبل النوم، لا مفاوضات بعده.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (sleep)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sl-protocol"

ID: KB-030
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sl-consistency
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الانتظام أهم من الكمية وحدها»
اعرف: مواعيد النوم الثابتة تحسّن جودة النوم أكثر من نوم ساعات أكثر بأوقات متقلبة.
افهم: جسمك يعمل على إيقاع؛ السهر يومًا والتعويض بعده يربك الإيقاع فيترتب عليه نع نهار وسمسرة ليل — وسمسرة الليل بالذات ليست في صالحك. الكمية المستهدفة جيدة، لكن العطر الأهم: نفس الموعد.
افعل: حدد «آخر حضور رقمي» و«موعد النوم» ثابتين يوميًا، والتزم بهما ٧ أيام وقس الفرق.
تذكّر: الإيقاع الثابت أرضية كل شيء آخر.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (sleep)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sl-consistency"

ID: KB-031
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — st-escape
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «التوتر: محرك السلسلة الأول»
اعرف: كثير من السلاسل ليست عن الرغبة بحد ذاتها، بل عن محاولة الهروب من ضغط نفسي ثقيل.
افهم: المشكلة المزدوجة: الهروب لا يحل مسبب التوتر، والذنب اللاحق يضيف طبقة توتر جديدة — فيصبح التوتر نفسه سببًا لدورة كاملة. كسرها يبدأ من معالجة التوتر مباشرة لا من الرغبة.
افعل: بروتوكول التوتر: اكتب المسبب بجملة، حدد أصغر خطوة، اعمل عليها ١٠ دقائق، أعد التقييم.
تذكّر: عالج الضغط نفسه — لا تهرب منه إلى ما يزيده.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (stress)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "st-escape"

ID: KB-032
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — st-guilt-loop
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «حلقة التوتر → التفريغ → الذنب»
اعرف: بعد السلوك غالبًا يأتي توتر أكبر مما كان قبله — فيصبح السلوك «حلًا» لمشكلة هو نفسه خلقها.
افهم: هذه الحلقة تُقنعك أنك «تحتاج» السلوك لتفريغ الضغط، بينما السجل يقول العكس: الضغط يعود أسرع وأثقل كل دورة. رؤية الحلقة على ورق أقوى من أي زجر داخلي.
افعل: بعد أي تعثر سجّل: مستوى التوتر قبله، وبعده بساعة. اجمع القراءات ثلاث مرات وانظر بنفسك.
تذكّر: ما تظنه صمامًا هو مضخة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (stress)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "st-guilt-loop"

ID: KB-033
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — st-shrink
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «صغّر المشكلة: جملة وخطوة»
اعرف: المشاكل الضبابية تبدو أكبر من محددة — والتوتر يولد من الضباب غالبًا.
افهم: «كل شيء متعثر» ليست مشكلة قابلة للحل، بل شعور. حوّلها إلى جملة محددة («مستحقات الأسبوع») تظهر خطوة صغيرة («أنجز ملفًا واحدًا اليوم»)، فيهبط التوتر لأن الدماغ يرى مخرجًا.
افعل: اكتب الآن أكثر ما يضغط عليك بجملة واحدة، ثم أصغر خطوة تقلصه، وابدأها فورًا.
تذكّر: المشكلة المحددة أصغر دومًا من الضبابية.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (stress)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "st-shrink"

ID: KB-034
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — st-window
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «نافذة التحمل تضيق تحت الضغط»
اعرف: في فترات التوتر المزمن تنخفض سرعة انفعالك وترتفع حدّتك — أمور صغيرة تفجّرك.
افهم: هذا ليس «تغير شخصيتك» بل استنزاف مؤقت. خلال هذه الفترات تكون أكثر عرضة للسلاسل — لا لأنك ضعيف، بل لأن جهازك العصبي يبحث عن أي مهرب. الفترات هذه تُدار بخطة أخف لا بأهداف أعلى.
افعل: في أسبوع ضاغط: بدّل لأوضاع الحد الأدنى اليومي، وأجّل الأهداف الكبيرة — بلا ذنب.
تذكّر: أيام العاصفة تُبحر بأشرعة صغيرة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (stress)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "st-window"

ID: KB-035
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — st-daily
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «روتين تفريغ يومي — قبل أن تحتاجه»
اعرف: التفريغ الصحي المنتظم يخفض حاجة الجسم للمهرب اللحظي.
افهم: حركة يومية، حديث مع شخص، خروج من المنزل، تنفس هادئ — أدوات صغيرة لكن مجتمعة تخفض «درجة الغليان» العامة. من يفرّغ بانتظام يحتاج انفجارًا أقل.
افعل: اختر ٣ أدوات من: مشي، رياضة، مكالمة صديق، كتابة يومية، تنفس — ووزعها على يومك.
تذكّر: فرّغ قليلًا كل يوم — لا كثيرًا دفعة واحدة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (stress)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "st-daily"

ID: KB-036
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — em-labeling
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «سمِّ الشعور تُغيّر علاقتك به»
اعرف: أبحاث «وسم الانفعال» تشير إلى أن تسمية الشعور بدقة تخفض شدته فعليًا.
افهم: «ضيق عام» يجعلك عاجزًا أمامه، أما «إحباط من امتحان + وحدة المساء» فأمر محدد يمكنك التعامل مع أجزائه. التسمية تنقل النشاط من مناطق الانفعال إلى مناطق التفكير — خطوة صغيرة بنتيجة كبيرة.
افعل: عند الشعور المزعج: سمّه بكلمة دقيقة، وحدد أين تشعر به في جسدك.
تذكّر: ما تسمّيه تدركه، وما تدركه تخفّفه.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emotions)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "em-labeling"

ID: KB-037
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — em-halt
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «افحص الرباعية: جائع؟ غاضب؟ وحيد؟ متعب؟»
اعرف: أشهر أنماط الانزلاق تقع حين يكون أحد الاحتياجات الأساسية مهمَلًا: طعام، راحة، تواصل، تفريغ.
افهم: قبل أن تحلل «لماذا الرغبة قوية الآن»، افحص الأساسيات: متى أكلت؟ كم نمت؟ هل تحدثت مع أحد اليوم؟ كثير من «الرغبات» هي احتياجات متنكرة — تلبيتها يخفض الرغبة من جذورها.
افعل: عند أول إشعار داخلي: افحص الأربعة وقابل ما ينقص فورًا ثم أعد التقييم.
تذكّر: كثير من الرغبات رسائل حاجات — افتحها قبل أن تنفذها.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emotions)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "em-halt"

ID: KB-038
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — em-temporary
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «المشاعر مؤقتة — القرارات تبقى»
اعرف: الحالة الانفعالية تمر عادة خلال دقائق إلى ساعات، بينما أثر القرار يبقى أيامًا.
افهم: أخطر لحظة هي تلك التي تُتخذ فيها قرارات «دائمة الشعور المؤقت»: قراءة الرسالة، فتح الموقع، إلغاء الخطة. الفاصل بين الاثنين هو ما يجعل مهارة «التأجيل» أعظم مهاراتك.
افعل: قاعدة: لا قرار مصيري أثناء موجة انفعال قوية — ١٠ دقائق تأجيل إلزامية.
تذكّر: مرّ الشعور، وبقِ القرار.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emotions)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "em-temporary"

ID: KB-039
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — em-body
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «المشاعر تُعاش في الجسد»
اعرف: الانفعال حالة جسدية: نبض، توتر عضلي، تنفس سريع — ومن الجسد تُدار بسرعة.
افهم: لهذا ينجح الماء البارد والمشي والتنفس البطيء حيث يفشل الجدل الداخلي: هي تخاطب الجسد بلغته. حين يهدأ الجسد يعود التفكير لأحكامه الطبيعية.
افعل: عند انفعال قوي: ماء بارد على الوجه، أو ٢٠ قرفصاء، أو زفير طويل ×٥.
تذكّر: هدّئ الجسد أولًا — العقل يتبع.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emotions)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "em-body"

ID: KB-040
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — em-loneliness
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الوحدة لا تُعالج بالخلوة مع شاشة»
اعرف: الوحدة من أقوى سياقات السلوك القهري — والوقت الرقمي المنفرد لا يخففها بل يعمّقها.
افهم: الشاشة تقدم «حضورًا وهميًا»: نشاط بلا اتصال. بعد الجلسة تجد الوحدة كما هي، مضافة إليها خيبة. العلاج الحقيقي حضورًا وصوتًا وبشرًا — ولو بمكالمة قصيرة.
افعل: عند شعور الوحدة مساءً: مكالمة، لا تصفح. جهّز قائمة أشخاص تريحك مكالمتهم.
تذكّر: الوحدة صوتها يُطفأ بصوت حقيقي لا بمحتوى.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emotions)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "em-loneliness"

ID: KB-041
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — at-trainable
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الانتباه قابل للتدريب»
اعرف: الانتباه مهارة تتحسن بالممارسة المنتظمة، وتتراجع بالتشتت المستمر — كأي قدرة.
افهم: التغذية السريعة (تمرير، مقاطع قصيرة) تدرّب عقلك على القفز كل ثوانٍ، فيصبح التركيز العميق «مؤلمًا» لا لأنه صعب بطبيعته بل لأنه غير معتاد. التدريب يعيد المعتاد.
افعل: جلسة قراءة أو عمل واحدة يوميًا: ٢٠ دقيقة، هاتف في غرفة أخرى. ابدأ اليوم.
تذكّر: انتباهك يتشكل بما تكرره — اختر ما تكرره.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (attention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "at-trainable"

ID: KB-042
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — at-residue
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «بقايا التبديل: لماذا «النظرة السريعة» غالية»
اعرف: الانتقال بين المهام يترك «بقايا انتباه» تشتت المهمة التالية لدقائق.
افهم: «ألقيت نظرة ثانية على الهاتف» لا تنتهي بالنظرة: تدفع ثمنها تركيزًا متضائلًا في مهمتك، وتشتتًا يجعل الملل أسهل، والملل أسهل يعني بابًا أعاد فتحه. النظرة السريعة أغلى مما تبدو.
افعل: أثناء المهام: الجهاز في غرفة أخرى أو صامت تمامًا — النظرة «السريعة» تُمنع لا تُقاوم.
تذكّر: كل نظرة سريعة لها فاتورة بطيئة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (attention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "at-residue"

ID: KB-043
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — at-block
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «جلسة واحدة تغيّر إيقاع يومك»
اعرف: إتمام جلسة تركيز واحدة في الصباح يرفع احتمال يوم منظم كله.
افهم: الإنجاز المبكر يرفع الحالة المزاجية ويمنح يومك «عمودًا فقريًا» تتفرع حوله بقية الأنشطة. والعكس صحيح: صباح تائه غالبًا يتحول ليوم كامل من التصفح ثم ليل أثقل.
افعل: كل صباح: مهمة واحدة محددة قبل أول فتح للهاتف الترفيهي.
تذكّر: اربح أول جلسة — تربح اليوم.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (attention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "at-block"

ID: KB-044
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — at-boredom
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الملل: فترة نمو مشروعة»
اعرف: القدرة على تحمل الملل مرتبطة بجودة الانتباه والقرار — والقضاء عليه فورًا يفقدك هذه القدرة.
افهم: في الملل يستعيد الدماغ تنظيمه وتتولد الأفكار والدوافع. من يخنق كل لحظة ملل بتحفيز سريع يخسر هذا التجدد، ويصبح أكثر جوعًا للمحفز بمرور الوقت. دع الملل يتنفس قليلًا.
افعل: أطول لحظات الانتظار (طابور، مصعد، إشارة) بلا هاتف — راقب ما يحدث.
تذكّر: بعض الملل علاج لا مشكلة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (attention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "at-boredom"

ID: KB-045
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — at-notifications
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «بيئة بلا إشعارات»
اعرف: الإشعار مقاطعة مصممة — وكل مقاطعة فرصة قرار يُتخذ نيابة عنك.
افهم: الأبحاث تشير إلى أن مجرد وجود إشعار يرفع الانشغال الذهني حتى لو لم تفتحه. بيئة نقية من الإشعارات ليست ترفًا: هي استعادة لحق تحديد «متى أنتبه ولماذا».
افعل: أطفئ إشعارات كل شيء إلا المكالمات والرسائل من أشخاص محددين.
تذكّر: انتباهك ملكك — لا تستأجره مجانًا.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (attention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "at-notifications"

ID: KB-046
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — di-willpower-debate
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: ««الإرادة المحدودة»: نظرية محل جدل»
اعرف: فكرة أن الإرادة «عضلة تنفد» يوميًا أُعيد النظر فيها علميًا — لا تبنِ نظامك على افتراضها.
افهم: الأدق اليوم: من يعتمد على الإرادة وحدها يتذبذب، ومن يبني قواعد وبيئة وروتينًا يستقر بغض النظر عن الجدل النظري. الخلاصة العملية: لا تصمم يومك كمعركة إرادات، صممه كنظام يقلل المعارك.
افعل: بدل «سأقاوم اليوم»: اسأل «ما المعركة التي أستطيع إلغاءها من الأساس اليوم؟».
تذكّر: ألغِ المعارك قبل أن تخوضها.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (discipline)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "di-willpower-debate"

ID: KB-047
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — di-systems
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الأنظمة تغلب الحماس»
اعرف: الإنجاز المستقر يأتي من روتين مُصمم يعمل في كل الأحوال — لا من نوبات حماس متقطعة.
افهم: الحماس يجعلك تبدأ بقوة ثم تتهاوى عند أول ضعف؛ النظام (مواعيد، قوائم، بيئة، قواعد) لا يمل مزاجًا أصلًا. صمم يومك بحيث لا يحتاج بطلًا — بل مجرد منفذ.
افعل: حوّل أكثر ٣ أنشطة أثرًا في يومك إلى مواعيد ثابتة لا قرارات لحظية.
تذكّر: لا تحتاج حماسًا — تحتاج موعدًا.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (discipline)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "di-systems"

ID: KB-048
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — di-minimum
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الحد الأدنى يحمي أيام الضعف»
اعرف: التخطيط لمستوى «أدنى» ليومك السيئ أهم من التخطيط لمستوى «مثالي» ليومك الجيد.
افهم: المفهوم الشائع «إما كامل أو فاشل» هو ما يحول زلة صغيرة إلى يوم منهار كله. يوم الحد الأدنى (مهمة واحدة + حركة + تواصل + مراجعة) يبقي السلسلة حية ويحفظ كرامتك في يوم صعب.
افعل: اكتب الآن «يومك الأدنى» على ورقة — وخذ به في أول يوم متعثر.
تذكّر: يوم ناقص خير من يوم منهار.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (discipline)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "di-minimum"

ID: KB-049
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — di-consistency
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الاتساق فوق الكثافة»
اعرف: عادات صغيرة متكررة تتفوق على جهود كبيرة متقطعة — التراكم يكافئ التكرار لا البطولة.
افهم: شهر من ٢٠ دقيقة يوميًا (١٠ ساعات موزعة) يترك أثرًا أعمق من عشر ساعات في يوم واحد ثم انقطاع. العقل والجسد يتعلمان بالتواتر، والهوية تتشكل بالتكرار لا بالمشهد الأوحد.
افعل: اختر أصغر نسخة من نشاطك المفعل تستطيع تكرارها ٦ أيام أسبوعيًا.
تذكّر: الصغير المتكرر يتضخم — الكبير المتقطع يتلاشى.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (discipline)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "di-consistency"

ID: KB-050
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — di-decisions
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «قلّل القرارات: القواعد المسبقة»
اعرف: كل قرار تخوضه في اللحظة يستهلك مساحة ويرتب احتمال خطأ — والقواعد تحذف القرار أصلًا.
افهم: «هل أفتح الهاتف الآن؟» سؤال يُهزم في يوم متعب. أما «لا هاتف بعد ١١م» فليس سؤالًا أصلًا. القاعدة الجيدة تنقل السلوك من تصويت يومي إلى تنفيذ تلقائي.
افعل: حوّل أكثر ٣ سلوكيات تخونك إلى قواعد صارمة بلا استثناءات «صغيرة».
تذكّر: القاعدة تُكتب مرة وتُنفذ ألف مرة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (discipline)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "di-decisions"

ID: KB-051
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — re-loneliness-context
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الوحدة أقوى سياقات الخطر»
اعرف: الانعزال المتكرر — حتى لو مريح ظاهريًا — هو البيئة التي تنمو فيها السلاسل غالبًا.
افهم: الجماعة ليست ترفًا اجتماعيًا بل ضابط سلوكي طبيعي: حضور الناس يذكّرك بنسختك «العامة» ويصعّب الانزلاق للخفاء. من شعر بجفاف علاقاته فليبدأ قبل الأزمة لا بعدها.
افعل: أعد شيئًا من الجماعة هذا الأسبوع: جلسة أسبوعية، رياضة جماعية، عمل تطوعي.
تذكّر: لا تترك وحدتك تتراكم — تكلّفها أغلى مما تظن.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relationships)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "re-loneliness-context"

ID: KB-052
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — re-one-person
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «شخص واحد آمن يكفي لتغيير المعادلة»
اعرف: وجود شخص تعرف أنك تستطيع الوصول إليه وقت الضيق يرتبط بمرونة أفضل في كل أبحاث التعافي تقريبًا.
افهم: لا يلزم كشف تفاصيلك الخاصة — يكفي أن تعرف أن لديك مكانًا آمنًا تصله. جهّز هذا الشخص في وقت الهدوء (رسالة، اتفاق) حتى يكون الوصول إليه أثناء العاصفة تلقائيًا.
افعل: اختر شخصًا واحدًا وفعّله في قسم «شخص الدعم» — وابدأ برسالة محايدة اليوم.
تذكّر: قوة اللحظة الحرجة تُصنع في اللحظة الهادئة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relationships)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "re-one-person"

ID: KB-053
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — re-trust
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الثقة تُبنى بالاتساق لا بالاعتذار»
اعرف: الثقة المفقودة تُستعاد بنمط متكرر من السلوك — لا بوعود مكثفة بعد كل تعثر.
افهم: من يتأثر بسلوكك غالبًا أقرب الناس، وقد يرون تغيرًا قبل أن تعلنه. الاعتذارات الكبيرة المتكررة تفقد قيمتها؛ الصغيرة المنتظمة (حضور، وفاء، هدوء) هي التي تعيد البناء حجرًا حجرًا.
افعل: اختر التزامًا واحدًا صغيرًا تجاه أقرب الناس والتزم به ١٤ يومًا — بلا إعلان.
تذكّر: النمط أعلى صوتًا من الوعد.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relationships)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "re-trust"

ID: KB-054
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — re-emptiness
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الفراغ العاطفي يبحث عن مخرج»
اعرف: من يعاني نقص تواصل حقيقي قد يجد نفسه يملأ الفراغ بسلوك وحيد — حل يفاقم العزلة.
افهم: المشكلة أن الحل الوهمي يشبع دقائق ويعمّق الجوع بعدها: بعد الجلسة لا صحبة جديدة ولا مهارة ولا ذكرى. الاعتراف بالجوع العاطفي أول خطوة لملئه من مصادره الحقيقية.
افعل: افحص أسبوعك: كم محادثة حقيقية كانت فيه؟ زد واحدة محددة الأسبوع القادم.
تذكّر: الجوع العاطفي يُطعم بالناس لا بالمحتوى.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relationships)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "re-emptiness"

ID: KB-055
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — dg-infinite
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «التمرير اللانهائي مصمَّم ليبقى»
اعرف: المنصات تُصمَّم خصيصًا لإطالة جلستك: لا نهاية طبيعية، ولا إشارة توقف.
افهم: «سأتصفح قليلًا» وعد تعطيه لنظام هندسته شركات كاملة لكسره. حين تعرف أن الطاولة محسومة ضدك، تتوقف عن لعبها بإنصاف نفسك وتضع قواعدك الخاصة: مؤقت، جلسة بغرض، لا فتح بلا سبب.
افعل: ضع قاعدة: لا فتح لأي منصة «عبورًا» — إما غرض محدد أو إغلاق.
تذكّر: أنت تلعب لعبة صُممت لتخسرها — غيّر اللعبة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (digital)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "dg-infinite"

ID: KB-056
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — dg-variable
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «التغذية: جوع لا شبع»
اعرف: محتوى لا نهائي بمكافآت متغيرة يترك انتباهك أكثر جوعًا مما بدأ — لا أقل.
افهم: كل تمريرة تعطيك «شيئًا ما» أحيانًا فتبقى تلتمس الجائزة التالية. النتيجة: بعد نصف ساعة تصفح تكون أكثر مللًا وتوترًا وشهية للمحفز — جاهزًا تمامًا لأي سلسلة.
افعل: لا تستخدم التصفح «لتقتل الملل» — استخدم قائمة الملل البديلة في التطبيق.
تذكّر: التصفح يفتح الشهية ولا يغلقها.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (digital)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "dg-variable"

ID: KB-057
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — dg-one-minute
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: ««دقيقة واحدة»: أم الأبواب»
اعرف: أغلب السلاسل الكبرى في السجلات تبدأ بوعد صغير: نظرة واحدة، دقيقة واحدة، فحص سريع.
افهم: الوعد الصغير يعبر لأنه يبدو بلا كلفة — لكنه ليس فعلًا بريئًا: إنه أول حلقة كاملة (إشارة → روتين → مكافأة). كل ما بعده استمرار منطقي لا «فشل مفاجئ». لهذا تُقطع السلسلة عند أولها لا وسطها.
افعل: قاعدة صارمة: «لا أول نظرة» أسهل من «لا استكمال» — طبقها حرفيًا.
تذكّر: لا يوجد «نظرة واحدة» — يوجد سلسلة كاملة أو لا شيء.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (digital)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "dg-one-minute"

ID: KB-058
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — dg-no-notifications
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «جهاز أقل إغراءً في يوم واحد»
اعرف: حذف الإشعارات وتنظيم الشاشة الرئيسية يخفضان الاستخدام المستهلك بلا أي «قوة إرادة».
افهم: الإشعار يجيء إليك، والشاشة المرتبة تجعلك تذهب أنت — والفرق بين الاتجاهين هو الفرق بين الانزلاق والقرار. تعديل عشر دقائق واحد يغير طبيعة علاقتك بالجهاز كلها.
افعل: الآن: أطفئ إشعارات الترفيه، وانقل التطبيقات المستهلكة من الصف الأول.
تذكّر: عشر دقائق تنظيم توفر ساعات مقاومة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (digital)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "dg-no-notifications"

ID: KB-059
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — dg-no-testing
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «لا تختبر نفسك أمام المحفز»
اعرف: التعمد للاقتراب من محفز معروف «لمجرد أن أختبر قوتي» من أسرع طرق بدء سلسلة كاملة.
افهم: الاختبار يضعك في أسوأ المعادلات: دافع مشتد + انتباه مثبت على المحفز + وعد داخلي بالسيطرة. النتيجة شبه محسومة سلفًا، وليست دليل ضعف — بل خطأ تكتيكي. القوة الحقيقية في الهندسة لا في المواجهة.
افعل: استبدل الاختبار بالاحتكاك: المحفز أبعد، المدخل أصعب، والبديل أسهل.
تذكّر: لا تختبر نفسك أمام محفز تعرفه — بل ابتعد عنه بذكاء.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (digital)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "dg-no-testing"

ID: KB-060
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — rl-ave
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: ««نسفت اليوم أصلًا»: فخ انتهاك الامتناع»
اعرف: الأبحاث تصف «أثر انتهاك الامتناع»: زلة واحدة تتحول لجلسة كاملة بسبب استنتاج «الخطة انهارت».
افهم: المنطق الداخلي يقول: «بعد ما وقعت، لا فرق الآن» — وهذا خطأ حسابي بحت: الضرر ليس صفحة تُقلب بل تتضاعف بالاستمرار. إيقاف الزلة عند حدها يقلل الضرر أضعافًا، مهما حدث قبلها.
افعل: احفظ القاعدة وقت الهدوء: «وقعتُ؟ أتوقف الآن — ما بقي ليس إلزاميًا».
تذكّر: التعثر لا يحتاج سقوطًا ثانيًا.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relapse)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "rl-ave"

ID: KB-061
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — rl-lapse-relapse
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الفرق بين الزلة والانتكاس»
اعرف: الزلة حادثة مفردة، والانتكاس عودة النمط القديم — والفارق بينهما ما يُفعل بعد الحادثة.
افهم: الزلة معلومة ثمينة عن ثغرة في الخطة؛ أما تحويلها لنمط فهو سلسلة قرارات: «انسَ الموضوع»، «ابدأ الشهر القادم»، «الحين ما له داعي». كل قرار منها أبعد من الزلة نفسها.
افعل: بعد أي زلة: أوقف، غيّر المكان، عد لنشاط طبيعي، وحلّل لاحقًا بهدوء — لا تقرر مصير الخطة الآن.
تذكّر: الزلة حدث… والاستمرار قرار.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relapse)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "rl-lapse-relapse"

ID: KB-062
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — rl-cut-point
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «أهم سؤال بعد التعثر»
اعرف: سؤال «لماذا أنا ضعيف؟» لا ينتج خطة — بينما «أين كان يمكن قطع السلسلة؟» ينتجها فورًا.
افهم: الأول يفتح ملف اللوم ويغلقه بلا مخرج. الثاني يحدد حلقة بعينها: «قبل فتح المتصفح» أو «حين بقيت في الغرفة» — وبمجرد تحديدها تملك هدفًا هندسيًا واضحًا للخطة القادمة.
افعل: في المراجعة الهادئة: حدد نقطة القطع الممكنة، وحوّلها فورًا إلى قاعدة «إذا… إذن».
تذكّر: أين كانت نقطة القطع؟ — هذا هو السؤال.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relapse)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "rl-cut-point"

ID: KB-063
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — rl-second-fall
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «أوقف السقوط الثاني أولًا»
اعرف: الأولوية القصوى بعد أي تعثر ليست التحليل — بل إيقاف الجلسة ومنع امتدادها.
افهم: التحليل وقت الانفعال يعطي نتائج مشوهة وقرارات متطرفة («سأحذف كل شيء» ثم فشل الوعد). الترتيب الصحيح: أوقف، ابتعد، عد لطبيعيتك، وبعد أن تهدأ تمامًا اجلس للتحليل الهادئ.
افعل: بعد التعثر مباشرة: أغلق → غيّر المكان → نشاط عادي. التحليل له موعد لاحق.
تذكّر: أوقف السقوط الثاني — ثم تعلم من الأول.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relapse)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "rl-second-fall"

ID: KB-064
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — rl-data
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «تعثر اليوم بيانات خطة الغد»
اعرف: كل حادثة تحمل: المحفز، الثغرة، أول علامة، أسرع نقطة قطع — أي بالضبط ما تحتاجه خطتك.
افهم: من يخجل من مراجعة تعثره يخسر أثمن مادة تطوير يمتلكها. الحادثة المسجلة والمراجعة تصبح قاعدة جديدة في الخطة؛ والحادثة المكتومة تعيد نفسها في نفس السياق قريبًا.
افعل: بعد كل تعثر ومراجعة: أضف قاعدة وقاية واحدة على الأقل من درس الحادثة.
تذكّر: استخدم ما حدث كمعلومة لتحسين الخطة القادمة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relapse)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "rl-data"

ID: KB-065
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — rl-speed
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «سرعة التوقف: مؤشر تقدم حقيقي»
اعرف: وقت التوقف بعد الزلة (فوري؟ دقائق؟ ساعة؟) مؤشر أدق بكثير من «عدد الأيام» وحده.
افهم: شخص يقف بعد دقيقتين أفضل حالًا من آخر يقف بعد ساعتين وإن تساوى «اليوم» في العد. مهارة الاستيقاظ من الزلة تتحسن بالتدريب — وهذا التقدم يستحق أن يُرى ويُحتفى به.
افعل: سجّل زمن التوقف في كل حادثة، وراقب اتجاهه في شاشة التقدم.
تذكّر: سرعة استيقاظك تقدم — حتى داخل التعثر نفسه.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (relapse)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "rl-speed"

ID: KB-066
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sc-not-indulgence
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الرحمة بالذات ليست تساهلًا»
اعرف: تشير دراسات عديدة إلى أن التعامل الرحيم مع الذات بعد الخطأ يرتبط بالتزام أفضل لا أسوأ.
افهم: الشائع أن القسوة «توقظ» — لكن السجل العلمي يقول عكسه غالبًا: جلد الذات يرفع التوتر الذي يبحث عن مهرب، فيزيد احتمال التكرار. الرحمة ليست إعفاء من المسؤولية، بل بيئة تسمح بالتصحيح.
افعل: بعد أي تعثر: عامل نفسك كما تعامل صديقًا أخبرك بتعثره — بصداقة وحزم معًا.
تذكّر: كن صارمًا مع السلوك، رحيمًا بصاحبه.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (self-compassion)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sc-not-indulgence"

ID: KB-067
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sc-self-criticism
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «جلد الذات يغذي الدورة»
اعرف: الإساءة الذاتية بعد الخطأ من أكثر الروابط ارتباطًا بتكرار السلوك — عكس ما تتوقعه الغريزة.
افهم: الجلد يولد شعورًا سيئًا، والشعور السيئ هو نفسه وقود الهروب الذي بدأ السلسلة أول مرة. هكذا تدور الدورة: خطأ → قسوة → ضيق → هروب. كسرها عند «القسوة» أسهل من كسرها عند «الهروب».
افعل: التقط جملة جلدك الذاتي القادمة واكتب بديلها: جملة حقيقية لكنها محترمة.
تذكّر: لا تجعل التعثر سببًا للتعثر التالي.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (self-compassion)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sc-self-criticism"

ID: KB-068
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sc-firm-compassionate
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الصرامة مع السلوك، الرحمة معك»
اعرف: المعادلة الأنجح تجمع خطين: لا تبرير للسلوك، ولا إهانة لصاحبه.
افهم: التساهل يقول «لا بأس، عادي» فيعيد السلسلة؛ والقسوة تقول «أنت فاشل» فتدفع للهروب. بينهما يقع النبر الأمثل: «هذا لا يخدم حياتي، وسأوقفه الآن — وأنا أكبر من زلتي».
افعل: دوّن عبارتك الشخصية بهذا النبر، واجعلها أول ما تقرأ بعد أي تعثر.
تذكّر: اضبط النبرة: حازمة مع الفعل، كريمة مع النفس.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (self-compassion)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sc-firm-compassionate"

ID: KB-069
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sc-friend-voice
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «اختبار الصديق»
اعرف: طريقة عملية فورية: هل ستقول لصديق عزيز ما تقوله لنفسك الآن؟
افهم: غالبًا ستجد أنك تحمل لنفسك معايير إعدام لا يجرؤ قلبك على حملها لغيرك. الفجوة بين النبرتين ليست «صدقًا» — بل قسوة تعلمتها، ويمكنك تعلم غيرها.
افعل: اكتب ما ستقوله لصديق بعد نفس التعثر بالضبط — ثم قله لنفسك بصوت مسموع.
تذكّر: أنت أول أصدقائك — عامله على هذا الأساس.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (self-compassion)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sc-friend-voice"

ID: KB-070
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sc-repair
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الإصلاح خير من التعويض»
اعرف: بعد الزلة، السلوك البنّاء الصغير يخفض التوتر أكثر من «تعويض قاسٍ» (حرمان، إنهاك رياضي).
افهم: العقاب الذاتي يبدو «تكفيرًا» لكنه يزيد الضيق الذي يغذي الدورة. خطوة إصلاح صغيرة (مشي، ترتيب، جلسة عمل قصيرة) تعيد لك إحساس الكفاءة بهدوء — وهو بالضبط ما تحتاجه لحظتها.
افعل: بعد أي تعثر: نفّذ فعلًا واحدًا صغيرًا يعيدك لنسخك الفاعلة — بلا مبالغة ولا عقاب.
تذكّر: لا عقاب — بل إصلاح هادئ.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (self-compassion)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sc-repair"

ID: KB-071
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — pr-full-life
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الحياة الممتلئة أقوى درع»
اعرف: أفضل واقٍ من السلوك القهري ليس «المقاومة» — بل حياة فيها ما يستحق الانتباه.
افهم: الفراغ لا يبقى فارغًا: يمتلئ بأرخص مصدر تحفيز متاح. حين تكون لديك مشاريع وعلاقات ومهارات تنمو، يهبط «سعر» السلوك القديم تلقائيًا — تنافس على نفس الانتباه، و الرصيد الأغلى يفوز.
افعل: اختر مشروعًا واحدًا يهمك فعلًا وامنحه ٣ فترات أسبوعيًا محددة.
تذكّر: لا تحارب الظلام — أشعل مصباحًا.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (purpose)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "pr-full-life"

ID: KB-072
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — pr-named-project
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «مشروع له اسم وموعد»
اعرف: الأهداف الضبابية («أطور نفسي») لا تحمي أمسياتك — المحددة («أكمل دورة X الثلاثاء والخميس») تحميها.
افهم: الاسم والموعد يحولان «النية» إلى «حدثًا» في تقويمك يزاحم وقت الخطر. المساء المهدد بالفراغ يصبح فيه موعد مسبق — وهذا استبدال مباشر للحلقة الأكثر تكرارًا: فراغ → جهاز → سلسلة.
افعل: سمّ مشروعك الآن، وحدد موعدين ثابتين له في أسبوعك القادم.
تذكّر: الموعد المحجوز لا ينزلق — الفراغ ينزلق.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (purpose)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "pr-named-project"

ID: KB-073
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — pr-visible-progress
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «التقدم المرئي يبني هوية»
اعرف: رؤية تقدمك الملموس (صفوف منجزة، تدريبات، أعمال) تقوّي هويتك الجديدة أكثر من الشعارات.
افهم: الدليل المرئي يجيب سؤال «من أنا الآن؟» بلا خطاب: أنا من ينجز هذا. كل ملف في مجلد الإنجاز حجة ضد عودة النمط القديم — لأن الصراع لم يعد بين «إرادة وضعف» بل بين هويتين.
افعل: أنشئ مكانًا ترى فيه تقدمك: مجلد أعمال، دفتر تدريب، قائمة إنجاز أسبوعية.
تذكّر: ما تراه يتقدم — تصدقه.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (purpose)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "pr-visible-progress"

ID: KB-074
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — pr-identity
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «من «أمتنع» إلى «أفعل»»
اعرف: الهوية المبنية على «الامتناع» هشة — لأنها تُعرّفك بما تهرب منه.
افهم: «أنا شخص لا يفعل كذا» تظل عيونها على الشيء نفسه. أما «أنا شخص يتدرب، يقرأ، يبني مهارة، يحضر لمجالسه» فتوجه الانتباه لما يتوسع. التعافي الحقيقي بناء هوية فاعلة لا حراسة دائمة.
افعل: أكمل الجملة بثلاث إجابات: «أنا شخص يقوم يوميًا بـ…» — واجعلها صدقة.
تذكّر: عرّف نفسك بما تبنيه لا بما تتجنبه.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (purpose)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "pr-identity"

ID: KB-075
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — va-compass
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «القيم بوصلة أيام الضعف»
اعرف: الحماس يتذبذب — والقيم المكتوبة تبقى مرجعًا ثابتًا وقت التذبذب.
افهم: «لماذا أتوقف الآن؟» سؤال يُهزم بسهولة وقت الملل، لكنه يجد جوابًا قويًا حين يكون مرسومًا مسبقًا: لأن وقتي، وتركيزي، وعلاقاتي، وقيمي أغلى من دقائق هروب. القيم تحسم قبل أن تبدأ المعركة.
افعل: اكتب «لماذا أفعل هذا؟» بجملتك الخاصة في قسم القيم — وارجع إليها وقت الصعوبة.
تذكّر: تذكّر السبب الذي اخترته أنت.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (values)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "va-compass"

ID: KB-076
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — va-write
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «اكتب قيمك بجملة لكل قيمة»
اعرف: القيمة غير المكتوبة شعور عابر؛ المكتوبة قرار قابل للرجوع إليه.
افهم: التمرين البسيط — جملة واحدة لكل قيمة («أحترم وقتي فلا أبيعه رخيصًا») — يحول كلمة عامة إلى معيار يومي. حين تقف أمام لحظة ضعف تكون الجملة جاهزة أسرع من التفاوض.
افعل: اختر ٣ قيم واكتب لكل واحدة جملتها — ثم اعرضها في شاشة القيم.
تذكّر: قيمة بلا جملة… نيّة بلا سلاح.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (values)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "va-write"

ID: KB-077
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — va-dissonance
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «التنافر: وقود التغيير بلا جلد»
اعرف: الشعور بالفجوة بين قيمك وسلوكك محرك تغيير قوي — إن وُجّه هندسيًا لا محاكميًا.
افهم: استخدام التنافر للجلد («أنا منافق») يطفئ الوقود بالضيق. أما توجيهه للهندسة («هذا السلوك لا يشبه جملة قيمتي — فما الحلقة التي أعدّلها؟») فيحوله خطة عمل.
افعل: عند شعور التنافر بعد زلة: اربطها مباشرة بقاعدة «إذا… إذن» جديدة بدل محاكمة نفسك.
تذكّر: الفجوة بين قيمك وسلوكك ليست محكمة — بل ورشة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (values)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "va-dissonance"

ID: KB-078
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — va-owned
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «قيمك تُختار لا تُستعار»
اعرف: السبب المُعار (من غيرك) يفقد قوته سريعًا — السبب الذي كتبتَه أنت يصمد.
افهم: «يجب أن تتوقف لأن الناس تقول» حجة تنكسر أول ضغط؛ أما «أفعل هذا لأجل دراستي هذا الفصل» فمصدر قوة شخصي. لهذا لا يفرض عليك التطبيق سببًا — يطلبك أن تكتبه بيدك.
افعل: حرر سببك بينك وبين نفسك، وصغه بصياغتك أنت — لا بصياغة أحد غيرك.
تذكّر: أصدق سبب هو الذي اخترته أنت.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (values)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "va-owned"

ID: KB-079
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sp-tawbah
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; spiritualContent === true only
CURRENT TEXT: العنوان: «التوبة: عودة لا مطاردة»
اعرف: في التصور الإسلامي، التوبة رجوع متجدد لا محاكمة — والباب لا يُغلق بتكرار الزلة.
افهم: قراءة التوبة كـ«محاكمة» تولّد إحباطًا يطيل السلسلة؛ وقراءتها «عودة» تجعل الوقوف بعد الزلة هو نفسه أول خطوة توبة. الأثر السلوكي كبير: الأولى تسقطك، والثانية ترفعك فورًا.
افعل: بعد الزلة: أوقف (هذه التوبة)، استغفر بلا جلد، ثم نفّذ خطوة منع التكرار.
تذكّر: أول خطوة التوبة: توقف الآن.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (spiritual)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sp-tawbah"

ID: KB-080
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sp-no-despair
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; spiritualContent === true only
CURRENT TEXT: العنوان: «لا تقنط: القنوط يطيل السلسلة»
اعرف: الشعور «لا فائدة، أنا لا أُقبل» يدفع للاستمرار في السلوك — عكس ما يوحي به.
افهم: اليأس يفكك الحساب كله: إن كانت الخسارة «مؤكدة» فما معنى التوقف؟ بينما الأمل الواقعي يجعل لكل دقيقة وقوف قيمة قائمة بذاتها. في التراث الروحي: عدم القنوط من الرحمة شرط العودة نفسه.
افعل: عند فكر «ما عاد له داعي»: ذكّر نفسك أن التوقف الآن — الآن بالذات — له قيمة كاملة.
تذكّر: العودة ممكنة من أي لحظة — ومنها هذه.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (spiritual)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sp-no-despair"

ID: KB-081
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sp-prayer-interrupt
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; spiritualContent === true only
CURRENT TEXT: العنوان: «الصلاة: مقاطعة كاملة للزخم»
اعرف: الصلاة توقف النشاط والانفعال معًا: حركة منظمة، كلام مرتب، توجه داخلي.
افهم: بينما يستمر الجدل الداخلي أثناء «المشي والتفكير»، تدخل الصلاة مقاطعة صريحة على كل القنوات: الوضوء يغير الحال الجسدي، والوقوف يعيد التوجه. لهذا هي من أنفع التدخلات وقت الصعود — لا بعده.
افعل: عند صعود الرغبة: وضوء ثم ركعتان بنية الهدوء — ثم خطتك العملية.
تذكّر: أوقف الزخم بجسدك وقلبك معًا.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (spiritual)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sp-prayer-interrupt"

ID: KB-082
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sp-dhikr-anchor
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; spiritualContent === true only
CURRENT TEXT: العنوان: «الذكر: مرساة للانتباه»
اعرف: تكرار صيغة قصيرة بهدوء يعمل كمرساة انتباه تشغل القناة الذهنية المشتتة.
افهم: الخيال المتصاعد يحتاج قناة ذهنية مشغولة — والذكر الهادئ يسكنها بصيغة ثابتة بطيئة. ليس الأمر «إخمادًا بالقوة» بل إعادة توظيف للانتباه نفسه الذي كانت تستخدمه السلسلة.
افعل: اختر صيغة قصيرة، وكررها مع تنفسك ٣ دقائق وقت الضجيج الداخلي.
تذكّر: الذكر يشغل القناة التي تطلبها الأفكار.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (spiritual)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sp-dhikr-anchor"

ID: KB-083
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — sp-intention
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; spiritualContent === true only
CURRENT TEXT: العنوان: «نيّة اليوم: القصد قبل العادة»
اعرف: يوم بلا نية مُعلنة يُدار بالعادة — وغالبة عاداتك القديمة تنتظر.
افهم: «ماذا أريد من يومي؟» سؤال صغير يحوّل اليوم من انجرار إلى اختيار. من استيقظ بلا قصد وجد المساء يقود نفسه نحو النمط الأكثر رسوخًا — وليس غالبًا النمط الذي يريده.
افعل: كل صباح: جملة نية واحدة لليوم («اليوم: أنجز X وأحفظ مسائي») قبل أول شاشة.
تذكّر: نِيّتك صباحًا تحرّكك حيث تريد لا حيث تنجرف.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (spiritual)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "sp-intention"

ID: KB-084
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — lt-not-linear
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «التعافي ليس خطًا مستقيمًا»
اعرف: المسار الواقعي: تقدم فترات صعبة ثم تقدم — والمهم اتجاه السطر العام لا استقامته.
افهم: من يتوقع خطًا صاعدًا بلا نكوص يُصدم بأول انحدار فيقرر أن «كل شيء انهار» — فيتحول الانحدار العابر إلى انتكاس فعلي. توقع التذبذب مسبقًا يجعلك تقرأ الأيام الصعبة كطقس عابر لا كنهاية الطريق.
افعل: قيم شهرك لا يومك: هل الاتجاه العام أفضل من الشهر الماضي؟
تذكّر: الحادرة لا تلغي الرحلة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (long-term)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "lt-not-linear"

ID: KB-085
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — lt-pressure
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الضغط يوقظ الأنماط القديمة»
اعرف: في فترات الإجهاد الكبرى (امتحانات، خسارات، اضطراب نوم) قد تعود أنماط قديمة — والجهزية هي الفرق.
افهم: عودة النمط لا تعني «ضياع كل شيء»: تعني أن ظروفك ارتفعت فوق عتبة تحملك الحالية. من جهّز خطة أيام الضغط (حد أدنى + حماية ليلية + شخص دعم) يمر بها سريعًا؛ ومن لم يجهز يتفاجأ بها.
افعل: اكتب الآن «خطة أسبوع العاصفة»: ما الذي يُترك، وما الذي يبقى مهما كان؟
تذكّر: العواصف معروفة — تجهّز لها قبل هبوبها.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (long-term)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "lt-pressure"

ID: KB-086
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — lt-independence
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الهدف: أن تحتاج هذا أقل»
اعرف: أفضل نتيجة لأداة مساعدة أن تصبح غير ضرورية — لا أن تتحول إلى اعتماد جديد.
افهم: التطبيق مرحلة تدريب: يسجل، يذكّر، ينظم حتى تتشكل لديك المهارة والعادة ذاتيًا. علامات النضج: تفحص رغبتك بلا تطبيق، تقطع بلا مؤقت، وتعرف أنماطك بلا خريطة. عندها استخدامه صار اختيارًا لا حاجة.
افعل: كل فترة اسأل: أي أجزاء نظامي أصبحت تعمل وحدها؟ خفف الاعتماد عليها تدريجيًا.
تذكّر: المستخدم الأقوى للتطبيق هو من يحتاجه أقل كل شهر.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (long-term)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "lt-independence"

ID: KB-087
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — lt-capital
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «رصيد التعافي يتراكم»
اعرف: ما يحميك في المدى الطويل ليس «الامتناع» وحده، بل رصيد: علاقات، مهارات، صحة، روتين.
افهم: هذا الرصيد هو ما يجعل التعثر العابر يبقى عابرًا — لأن حياة مليئة تنتظرك فور الوقوف. من فرّغ حياته لمجرد المراقبة يجعل أي زلة كارثة كبرى إذ لا شيء غيرها في الصورة.
افعل: راجع رصيدك شهريًا: علاقة أعمق؟ مهارة أعلى؟ جسد أقوى؟ اختر بندًا واحدًا للنمو.
تذكّر: ابنِ حياة تجعل التعثر حدثًا صغيرًا.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (long-term)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "lt-capital"

ID: KB-088
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — lt-identity-keeping
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الهوية الجديدة تُصان بالممارسة»
اعرف: بعد شهور من الثبات يبقى التحدي نفسه بصغر: عادات صغيرة تحرس النمط القديم.
افهم: الوقت الطويل يجعل المراقبة تتراجع — وهذا صحي ومطلوب — لكن بعض الممارسات الصغيرة تستحق البقاء: نوم منتظم، هاتف خارج الغرفة، مراجعة أسبوعية خفيفة. ضمانة الهوية ليست الحذر بل العيش وفقها.
افعل: حدد ٣ ممارسات «دائمة» لن تتوقف مهما طال الثبات — واكتبها.
تذكّر: الاستقرار ليس غياب الممارسة، بل خفتها.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (long-term)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "lt-identity-keeping"

ID: KB-089
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — pv-before
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «القاعدة الذهبية: جهّز قبل وقت الضعف»
اعرف: كل أدوات الحماية تُضبط في الهدوء — ولا شيء تقريبًا يُضبط أثناء العاصفة.
افهم: أثناء الذروة يرتفع التوتر ويضيق التفكير: لا تثق بقرار «سأفعّل الحاجب الآن» في تلك اللحظة. الحاجب المفعّل مسبقًا، والهاتف المُبعَد سلفًا، والقاعدة المكتوبة قبلًا — هي التي تعمل وقتها فعلاً.
افعل: خصص موعدًا أسبوعيًا هادئًا لمراجعة حمايتك: الحواجز، القواعد، البيئة.
تذكّر: من جهّز في الهدوء نجا في العاصفة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (prevention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "pv-before"

ID: KB-090
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — pv-precommitment
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «الالتزام المسبق: أغلق على «نفسي المستقبلي»»
اعرف: حين تقيد خياراتك مسبقًا (الحاجب بكلمة مرور بيد غيرك، مواعيد صارمة) ترفع تكلفة الانزلاق.
افهم: الالتزام المسبق يعمل لأنه يُتخذ وأنت عاقل متفرج على موقف لم يبدأ بعد. أن تعطي صديقك كلمة مرور الحاجب مثالًا معروفًا: يمنع «نفسي المتعب مساءً» من فتح الباب الذي أغلقه «نفسي الصافح صباحًا».
افعل: اختر التزامًا واحدًا صعب الفتح: حاجب بكلمة مرور ليست بيدك، أو جهاز يبيت خارجًا.
تذكّر: أقفل الباب وأنت واقف خارجه.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (prevention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "pv-precommitment"

ID: KB-091
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — pv-ifthen
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «قواعد «إذا… إذن»: خطة طوارئ مكتوبة»
اعرف: القاعدة المكتوبة «إذا حدث كذا → أفعل كذا» تُنقذ حين يغيب التفكير الواضح.
افهم: لحظة الخطر ليست وقت تصميم؛ إنها وقت تنفيذ فقط. كل قاعدة «إذا… إذن» كتبتها في الهدوء هي إزالة لقرار كامل من لحظة الخطر — وكل قرار محذوف يعني سرعة أعلى واحتمال نجاة أكبر.
افعل: راجع قواعدك أسبوعيًا وأضف واحدة لكل ثغرة ظهرت في سجلك.
تذكّر: الخطة المكتوبة تسبق العاصفة.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (prevention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "pv-ifthen"

ID: KB-092
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — pv-review
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «مراجعة نقاط الخطر الأسبوعية»
اعرف: أنماطك تتغير مع حياتك — والخريطة القديمة تحمي أقل كل أسبوع مر دون تحديث.
افهم: ما كان خطرك الأول (الليل المتأخر) قد يزول ليحل محله (فراغ ما بعد الاختبارات). المراجعة الأسبوعية الخفيفة — خمس دقائق على خريطة المحفزات — تُبقي خطتك مطابقة لحياتك الفعلية لا لنسختها القديمة.
افعل: كل أسبوع: افتح خريطة المحفزات، لاحظ أعلى تغير، وعدّل قاعدة واحدة تخصه.
تذكّر: خريطة لا تُحدّث تضلّ الطريق.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (prevention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "pv-review"

ID: KB-093
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — pv-friction
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «احتكاك استراتيجي في كل مدخل»
اعرف: حمايتك الفضلى ليست جدارًا واحدًا — بل ثوانٍ صعوبة إضافية عند كل مدخل.
افهم: السلسلة تحتاج مداخل: بحث، منصة، تطبيق، صورة. كل مدخل تجعله أصعب قليلًا (خروج من الحساب، حاجب، حذف التطبيق، SafeSearch) تخفض احتمال الدخول الآلي — والمداخل الصعبة تُمنع، والسهلة تُفتح.
افعل: افحص اليوم مداخلك الخمسة الأولى وضيف احتكاكًا لكل واحد.
تذكّر: لا تحتاج سورًا — تحتاج أبوابًا أثقل.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (prevention)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "pv-friction"

ID: KB-094
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — es-practice-calm
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «تدرّب على الطوارئ وأنت هادئ»
اعرف: مهارة الأزمة تُبنى في الهدوء — كما يتدرب على الإطفاء قبل الحريق لا أثناءه.
افهم: أول مرة تجرب فيها «أغلق واخرج وامشِ عشر دقائق» لا يصح أن تكون وقت ذروة حقيقية. جربها عند درجة ٢ أو ٣ حتى تصبح المسار معروفًا — في وقت الذروة تسير فيه بلا تفكير لأنك مشطته مسبقًا.
افعل: مرة أسبوعيًا: نفّذ تدخلًا واحدًا كاملا وأنت في حالة هادئة.
تذكّر: المهارة المجهزة تنفذها، والمهارة الجديدة تفاجئك.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emergency-skills)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "es-practice-calm"

ID: KB-095
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — es-one-step
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «قاعدة الأزمة: خطوة واحدة فقط»
اعرف: في الذروة، التفكير في «خطة كاملة» يشل — بينما خطوة واحدة تُنفذ فورًا.
افهم: الدماغ وقت التوتر العالي يعالج خيارات أقل بكثير. لهذا كلما ارتفع الخطر قلّصنا لك الخيارات: صورة واحدة، زر واحد، خطوة واحدة. هذا ليس تبسيطًا للأسلوب — بل تصميم يناسب حالة عقلك في تلك اللحظة.
افعل: حفظ الترتيب: أغلق المصدر → غيّر المكان → خطوة فعلية. لا شيء غيرها الآن.
تذكّر: لا تحتاج حل كل شيء الآن — فقط الخطوة الحالية.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emergency-skills)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "es-one-step"

ID: KB-096
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — es-fewer-choices
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «قلّة الخيارات ميزة الطوارئ»
اعرف: كلما ارتفع الخطر يجب أن تقل الخيارات المعروضة — لا أن تزيد.
افهم: قائمة عشر تدخلات وقت الذروة تعني عمليًا «لا تدخل» — لأن الاختيار نفسه عبء. النظام الصحي يعرض خيارًا واحدًا محددًا في العالي، وثلاثة في المتوسط، ومكتبة كاملة في المنخفض. القلة رحمة.
افعل: لا تتصفح الخيارات وقت الخطر — خذ المقترح الأول ونفّذه.
تذكّر: في الأزمة: القليل ينجو حيث يختار الكثير.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emergency-skills)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "es-fewer-choices"

ID: KB-097
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — es-first-minute
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «أول ٦٠ ثانية تحسم»
اعرف: أغلب ما يحدد نتيجة الموجة يقع في دقيقتها الأولى: قبل أن يرتفع التوتر ويضيق الاختيار.
افهم: الرغبة بعد دقيقة من الإشعار أضعف بكثير من بعد عشر دقائق تصفح. كل ثانية تأجيل فيها الإغلاق ترفع كلفة الإغلاق نفسه — لهذا قاعدة «أغلق فورًا» لا تترك مساحة للتفاوض الافتتاحي.
افعل: عند أول علامة: نفّذ حركة القطع في نفس الثانية — القراءة والتحليل بعدها.
تذكّر: اقطع الآن — حلّل لاحقًا.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emergency-skills)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "es-first-minute"

ID: KB-098
SCREEN: Knowledge Content Library
LOCATION: Knowledge card — es-after-drop
TYPE: content card (title + know + understand + act + remember + deep?)
STATE / CONDITION: shown on Knowledge screen / Daily Dose / dose preview; always
CURRENT TEXT: العنوان: «بعد هبوط الخطر: سجّل ثم عد»
اعرف: النجاة من موجة عالية معلومة ثمينة — لكن تسجيلها بعد هبوطها مباشرة أدق ما يكون.
افهم: الذاكرة تمحو تفاصيل الأزمة سريعًا (لطيفًا) — فتفقد أثمن ما فيها: المحفز، أول علامة، التدخل الذي نجح. دقيقة تسجيل بعد الهدوء تحفظ الدرس، ثم عودتك الطبيعية ليومك تغلق الحادثة صح.
افعل: بعد كل أزمة تمر بسلام: سجل سريع (محفز + تدخل) ثم استئناف اليوم.
تذكّر: نجوت؟ سجّلها — ثم عُد لحياتك.
قراءة أعمق: (لا يوجد)
PURPOSE / CONTEXT: Knowledge card content (emergency-skills)
SOURCE FILE: src/data/app/knowledge-{core,wellbeing,recovery}.ts
SOURCE LOCATION: item id "es-after-drop"

ID: IV-001
SCREEN: Intervention Content Library
LOCATION: Intervention — close-source
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 3/5); work-safe
CURRENT TEXT: الاسم: «إغلاق المصدر فورًا»
المدة: ٣٠ ثانية
المكان: حيث أنت الآن
الخطوات: أغلق التبويب أو التطبيق أو الصفحة الآن — بلا قراءة سطر إضافي. / أغلق الجهاز كله إن أمكن، أو اقلبه على وجهه بعيدًا عن يدك. / قم من مكانك فورًا — الحركة البدنية تكسر التجمد.
لماذا يساعد: السلسلة تحتاج مصدرًا مفتوحًا لتستمر. إغلاقه خلال الثواني الأولى أرخص مقاومة موجودة، قبل أن يرتفع التوتر.
التالي: غيّر المكان — الخطوة التالية.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "close-source"

ID: IV-002
SCREEN: Intervention Content Library
LOCATION: Intervention — leave-room
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 3/5); work-safe
CURRENT TEXT: الاسم: «مغادرة الغرفة»
المدة: دقيقة واحدة
المكان: من غرفتك إلى أي غرفة أخرى
الخطوات: قف واخرج من الغرفة الحالية فورًا. / اتجه لأي مكان آخر في البيت — الممر، الصالة، المطبخ. / لا تأخذ الجهاز معك إن استطعت.
لماذا يساعد: السلوك مرتبط بالسياق. تغيير الغرفة يفصل الانتباه عن البيئة التي بدأت فيها السلسلة ويخفض اندفاعها.
التالي: ابدأ نشاطًا ملموسًا في المكان الجديد.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "leave-room"

ID: IV-003
SCREEN: Intervention Content Library
LOCATION: Intervention — shared-space
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 4/5); work-safe
CURRENT TEXT: الاسم: «الانتقال إلى مكان مشترك»
المدة: ١٥ دقيقة
المكان: غرفة المعيشة / مكان فيه أشخاص
الخطوات: انتقل إلى غرفة فيها أحد من أهلك أو زملائك. / لا تحتاج أن تخبره بأي شيء — اجلس واعمل شيئًا عاديًا. / ابقَ هناك حتى يهبط الشعور.
لماذا يساعد: هذا السلوك يزدهر في الخفاء والانعزال. وجود الناس في المدى البصري وحده يغيّر معادلة اللحظة.
التالي: أعد تقييم الخطر بعد ١٥ دقيقة.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "shared-space"

ID: IV-004
SCREEN: Intervention Content Library
LOCATION: Intervention — call-person
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 4/5); work-safe
CURRENT TEXT: الاسم: «مكالمة قصيرة بشخص تثق به»
المدة: ٥ دقائق
المكان: أي مكان
الخطوات: اتصل بشخص يريحك وجوده. / تحدث عن أي شيء عادي: يومك، دراسة، رياضة، أي خبر. / لا يجب أن تذكر الموضوع الخاص إطلاقًا — يكفي تغيير الشركة.
لماذا يساعد: الاتصال البشري المباشر يقطع الانعزال الذي تغذي به السلسلة نفسها، ويعيد انتباهك إلى العالم خارج الشاشة.
التالي: أنهِ المكالمة ثم أعد التقييم.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "call-person"

ID: IV-005
SCREEN: Intervention Content Library
LOCATION: Intervention — walk-10
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 3/5); work-safe
CURRENT TEXT: الاسم: «مشي ١٠ دقائق»
المدة: ١٠ دقائق
المكان: خارج البيت أو في الممر الطويل
الخطوات: اخرج من المكان وابدأ المشي — داخل البيت أو خارجه. / اترك الجهاز خلفك أو في جيبك مغلقًا. / انتبه لخطواتك وتنفسبك أثناء المشي.
لماذا يساعد: المشي المنتظم يغيّر الحالة الفسيولوجية (نبض، تنفس، حرارة) التي تتغذى عليها الرغبة، ويكسر الجمود الحركي.
التالي: عند العودة: أعد تقييم درجة حالتك.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "walk-10"

ID: IV-006
SCREEN: Intervention Content Library
LOCATION: Intervention — cold-water
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 3/5); work-safe
CURRENT TEXT: الاسم: «غسل الوجه بماء بارد»
المدة: ٦٠ ثانية
المكان: أقرب مغسلة
الخطوات: اذهب إلى المغسلة. / اغسل وجهك ويديك بماء بارد ٣ مرات. / ابقَ واقفًا، وتنفس ٥ أنفاس هادئة.
لماذا يساعد: الماء البارد على الوجه ينشّط استجابة فسيولوجية مهدئة سريعة، ويمنح الدماغ مقاطعة حسية واضحة عن حلقة التفكير.
التالي: ابدأ مهمة صغيرة ملموسة.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "cold-water"

ID: IV-007
SCREEN: Intervention Content Library
LOCATION: Intervention — shower
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 4/5); work-safe
CURRENT TEXT: الاسم: «استحمام»
المدة: ١٠–١٥ دقيقة
المكان: الحمام
الخطوات: اترك الجهاز خارج الحمام تمامًا. / استحم بماء معتدل أو بارد. / بعد الحمام: البس ملابس يومك ولا تعد إلى السرير.
لماذا يساعد: تغيير كامل للحالة الجسدية والإحساس، مع انفصال إجباري عن الجهاز عدة دقائق متواصلة.
التالي: عد إلى نشاطك الطبيعي.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "shower"

ID: IV-008
SCREEN: Intervention Content Library
LOCATION: Intervention — breathing
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/5); work-safe
CURRENT TEXT: الاسم: «تنفس مُهدِّئ ٤-٧-٨»
المدة: ٣ دقائق
المكان: أي مكان — واقفًا أو جالسًا
الخطوات: شهيق من الأنف ٤ ثوانٍ. / احبس النفس ٧ ثوانٍ. / زفير بطيء من الفم ٨ ثوانٍ. / كرر ٤ دورات على الأقل.
لماذا يساعد: الزفير الطويل يهدئ الجهاز العصبي ويخفض التسارع الجسدي الذي يجعل «المقاومة بالتفكير» أصعب.
التالي: أعد تقييم شدة الرغبة.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "breathing"

ID: IV-009
SCREEN: Intervention Content Library
LOCATION: Intervention — urge-surfing
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/4); work-safe
CURRENT TEXT: الاسم: «ركوب موجة الرغبة»
المدة: ١٠ دقائق
المكان: مكان هادئ بعيد عن المحفز
الخطوات: اجلس وتنفس بهدوء. / لاحظ الرغبة كموجة: قوة تتصاعد ثم تهبط. / لا تحاربها ولا تغذّها — راقبها فقط، كمشاهد لا منفّذ. / سمِّ ما تشعر به بهدوء: «هذه رغبة… وهذا توتر…».
لماذا يساعد: الرغبات محدودة الزمن غالبًا وتبلغ ذروتها ثم تنحسر. تعلم مراقبتها دون تنفيذها يبني مهارة أثمن من مجرد الهرب منها.
التالي: بعد ١٠ دقائق: هل خفت الموجة؟
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "urge-surfing"

ID: IV-010
SCREEN: Intervention Content Library
LOCATION: Intervention — exercise-burst
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 3/5); work-safe
CURRENT TEXT: الاسم: «دفعة حركة قوية»
المدة: ٥ دقائق
المكان: أي مكان يتسع لحركتك
الخطوات: نفّذ ٤ دورات: ٢٠ قرفصاء + ١٠ ضغط (أو ما يناسب لياقتك). / ارتح دقيقة بين الدورات مع تنفس. / لا تجعلها عقابًا — هدفها تغيير الحالة فقط.
لماذا يساعد: المجهود القصير يرفع النبض ويحوّل طاقة التعبير الفسيولوجية للرغبة إلى قناة بدنية مختلفة تمامًا.
التالي: اغسل وجهك ثم أعد التقييم.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "exercise-burst"

ID: IV-011
SCREEN: Intervention Content Library
LOCATION: Intervention — task-10
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/4); work-safe
CURRENT TEXT: الاسم: «مهمة ملموسة ١٠ دقائق»
المدة: ١٠ دقائق
المكان: البيت — المطبخ/المكتب
الخطوات: اختر مهمة ملموسة تراها أمامك: أطباق، ترتيب مكتب، تعبئة ملابس. / شغّل مؤقت ١٠ دقائق. / اعمل بها حتى ينتهي — بلا هاتف في اليد.
لماذا يساعد: الرغبة تزدهر في الفراغ واليد الخالية. مهمة يدوية قصيرة تشغل القناة الحركية وتعطي الدماغ إنجازًا حقيقيًا صغيرًا.
التالي: بعد المهمة: قرر الخطوة التالية ليومك.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "task-10"

ID: IV-012
SCREEN: Intervention Content Library
LOCATION: Intervention — study-block
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/3); work-safe
CURRENT TEXT: الاسم: «جلسة تركيز ٢٠ دقيقة»
المدة: ٢٠ دقيقة
المكان: مكتب/طاولة — وليس السرير
الخطوات: اجلس على مكتب، هاتفك في غرفة أخرى. / مادة واحدة، مهمة واحدة واضحة. / شغّل مؤقت ٢٠ دقيقة وابدأ فورًا — لا تنتظر «الجو المناسب».
لماذا يساعد: الانتباه المركّز حالة يصعب دخولها والخروج منها باستمرار. الجلسة الواحدة تعيد عقلك إلى مسار البناء بدل الاستهلاك.
التالي: استرح ٥ دقائق ثم قرر: جلسة أخرى؟
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "study-block"

ID: IV-013
SCREEN: Intervention Content Library
LOCATION: Intervention — read-book
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/3); work-safe
CURRENT TEXT: الاسم: «قراءة خارج الشاشة ١٥ دقيقة»
المدة: ١٥ دقيقة
المكان: كرسي — وليس السرير
الخطوات: كتاب ورقي أو قارئ إلكتروني بسيط. / اجلس على كرسي بعيد عن السرير. / اقرأ فصلًا واحدًا أو ١٥ صفحة.
لماذا يساعد: القراءة على الورق تعطي انتباهًا عميقًا بطيئ الإيقاع — عكس التغذية السريعة التي درّبت عقلك على الالتهاء الفوري.
التالي: ضع علامة عند ما وصلت إليه وعد ليومك.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "read-book"

ID: IV-014
SCREEN: Intervention Content Library
LOCATION: Intervention — bed-protocol
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 3/5); work-safe
CURRENT TEXT: الاسم: «بروتوكول السرير»
المدة: ١٠ دقائق
المكان: من السرير إلى خارج الغرفة
الخطوات: انهض من السرير الآن. / أضئ نور الغرفة. / أخرج الهاتف من غرفة النوم إن أمكن — اتركه في مكان آخر. / انتقل إلى مكان مناسب آخر في البيت. / نفّذ نشاطًا ملموسًا ١٠ دقائق. / عد إلى السرير فقط عندما تكون جاهزًا للنوم فعلًا.
لماذا يساعد: «السرير + الجهاز + وقت متأخر» أكثر الثلاثيات تكرارًا في بدء السلاسل. كسر الثلاثية عند أول حلقة أيسر بكثير من كسرها في الذروة.
التالي: بعد النشاط: إن كنت مستيقظًا فابقَ خارج السرير.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "bed-protocol"

ID: IV-015
SCREEN: Intervention Content Library
LOCATION: Intervention — stress-protocol
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/4); work-safe
CURRENT TEXT: الاسم: «بروتوكول التوتر»
المدة: ١٢ دقيقة
المكان: أي مكان + ورقة أو ملاحظات
الخطوات: أوقف أي نشاط شاشة غير ضروري. / خذ وقفة تهدئة: ٥ أنفاس بطيئة. / اكتب المسبب في جملة واحدة فقط. / حدد أصغر خطوة قابلة للحل في هذا المسبب. / اعمل على الخطوة ١٠ دقائق ثم توقف.
لماذا يساعد: التوتر المبهم يدفع للهروب. تحويله إلى جملة مكتوبة وخطوة صغيرة يعيده إلى حجمه الحقيقي ويستعيد إحساس السيطرة.
التالي: أعد التقييم — هل ما زلت بحاجة للهروب؟
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "stress-protocol"

ID: IV-016
SCREEN: Intervention Content Library
LOCATION: Intervention — boredom-5
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/3); work-safe
CURRENT TEXT: الاسم: «قائمة الملل: ٥ دقائق»
المدة: ٥ دقائق
المكان: حيث أنت
الخطوات: اختر واحدة: ترتيب المكتب / غسل الأطباق / تجهيز مهمة الغد. / نفّذها فورًا — بلا هاتف.
لماذا يساعد: الملل حالة انتباه جائعة تبحث عن أي طعام سريع. مهمة قصيرة ملموسة تُطعمها بطريقة تبني ولا تستهلك.
التالي: إن بقيت فترة فراغ: اختر نشاط ١٥ دقيقة.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "boredom-5"

ID: IV-017
SCREEN: Intervention Content Library
LOCATION: Intervention — boredom-30
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/3); work-safe
CURRENT TEXT: الاسم: «قائمة الملل: ٣٠ دقيقة»
المدة: ٣٠ دقيقة
المكان: خارج الغرفة
الخطوات: اختر واحدة: تمرين رياضي / جلسة دراسة / العمل على مشروع / خروج قصير / نشاط اجتماعي. / التزم بها ثلاثين دقيقة كاملة.
لماذا يساعد: فترات الفراغ الطويلة غير المخططة هي البيئة الخصبة للسلاسل. ملؤها باختيار مسبق يحوّلها من خطر إلى بناء.
التالي: سجّل ما أنجزته في المراجعة المسائية.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "boredom-30"

ID: IV-018
SCREEN: Intervention Content Library
LOCATION: Intervention — work-safe-lock
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 3/5); work-safe
CURRENT TEXT: الاسم: «إقفال بيئة العمل»
المدة: ١٠ دقائق عمل
المكان: عند جهازك
الخطوات: أغلق كل التبويبات والتطبيقات غير المتصلة بمهمتك. / أبقِ مهمة العمل المطلوبة وحدها على الشاشة. / ضع الجهاز على سطح ثابت — لا تحمله بيدك. / اعمل ١٠ دقائق كاملة على المهمة. / ثم أعد التقييم.
لماذا يساعد: عندما تحتاج الجهاز فعلًا، المواجهة معه خاسرة. المطلوب هندسة سياقه: مهمة واحدة، شاشة نظيفة، جهاز ثابت — فيصبح أداة لا ممرًا.
التالي: بعد ١٠ دقائق عمل: هل هبط الخطر؟
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "work-safe-lock"

ID: IV-019
SCREEN: Intervention Content Library
LOCATION: Intervention — phone-away
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/5); not work-safe
CURRENT TEXT: الاسم: «إبعاد الجهاز عن متناول اليد»
المدة: ٣٠ ثانية + ساعة كاملة
المكان: من يدك إلى مكان بعيد
الخطوات: اسأل: «ما الذي يجعل العودة إلى المحفز أصغر خلال الساعة القادمة؟» / ضع الجهاز في غرفة أخرى / درج / كيس مغلق. / اتركه هناك ساعة كاملة — اختر نشاطًا يملؤها.
لماذا يساعد: كل خطوة إضافية بينك وبين المحفز (وقوف، مشي، فتح) تخفض احتمال الدخول الآلي. الاحتكاك المقصود أرخص من الإرادة.
التالي: بعد الساعة: التزم بغرض محدد قبل فتح الجهاز.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "phone-away"

ID: IV-020
SCREEN: Intervention Content Library
LOCATION: Intervention — wudu
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/5); work-safe
CURRENT TEXT: الاسم: «وضوء بماء بارد»
المدة: ٢ دقائق
المكان: المغسلة
الخطوات: توضأ بماء بارد بتأنٍ. / بعد الوضوء اجلس دقيقة مع تنفس هادئ.
لماذا يساعد: يجمع بين أثر الماء البارد المهدئ فسيولوجيًا ومرساة روحية تعيد للّحظة معناها وقيمتها — من فعل تعيد فيه توازنك لا سلسلة تستهلكك.
التالي: أتبعه بقراءة قصيرة أو ركعتين إن أردت.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "wudu"

ID: IV-021
SCREEN: Intervention Content Library
LOCATION: Intervention — prayer-2
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/5); work-safe
CURRENT TEXT: الاسم: «ركعتان بنية العودة»
المدة: ٥ دقائق
المكان: مكان نظيف
الخطوات: توضأ أولًا. / صلِّ ركعتين خفيفتين بنية الهدوء والعودة — لا عقابًا. / بعد السلام: نفّذ الخطوة العملية التالية في خطتك.
لماذا يساعد: الصلاة توقف زخم اللحظة بالكامل وتعيد ترتيب الأولويات. هي عودة للقيم لا جلد للذات — والتوبة عمل يبدأ بوقف السلسلة.
التالي: عد إلى نشاط يومك الطبيعي.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "prayer-2"

ID: IV-022
SCREEN: Intervention Content Library
LOCATION: Intervention — dhikr-anchor
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/4); work-safe
CURRENT TEXT: الاسم: «ذكر كمرساة انتباه»
المدة: ٣ دقائق
المكان: أي مكان
الخطوات: اختر صيغة قصيرة واحدة. / كررها ببطء مع التنفس ٢-٣ دقائق. / الأفكار المقاطعة طبيعية — عد إليها بلا جلد.
لماذا يساعد: التكرار الهادئ يعمل كمرساة انتباه تشغل القناة الذهنية التي يتسابق عليها الخيال، فتخفض التسارع دون صدام.
التالي: اختم بنية قصيرة ثم عد لنشاطك.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "dhikr-anchor"

ID: IV-023
SCREEN: Intervention Content Library
LOCATION: Intervention — tell-someone
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 4/5); work-safe
CURRENT TEXT: الاسم: «رسالة محايدة لشخص موثوق»
المدة: ٢ دقيقة
المكان: أي مكان
الخطوات: اختر شخصًا تثق به. / أرسل رسالة محايدة تمامًا: «محتاج أقعد معاك شوية» أو «نتمشى سوا؟». / لا تحتاج كشف أي تفاصيل خاصة إطلاقًا.
لماذا يساعد: كسر العزلة لا يتطلب كشفًا. مجرد التواصل البشري القريب يغير كيمياء اللحظة ويعطيك حضورًا أمام شخص آخر.
التالي: انتظر الرد أو اذهب إليه مباشرة إن أمكن.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "tell-someone"

ID: IV-024
SCREEN: Intervention Content Library
LOCATION: Intervention — note-the-urge
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 1/3); work-safe
CURRENT TEXT: الاسم: «تسجيل سريع للرغبة»
المدة: ٦٠ ثانية
المكان: أي مكان
الخطوات: افتح «فحص الرغبة» وسجّل الأرقام الثلاثة. / أضف المحفز والسياق باختصار. / ثم اترك الجهاز وابدأ خطوة فعلية.
لماذا يساعد: التسمية والملاحظة تفصلانك عن الرغبة قليلًا — من «أنا» إلى «شيء أرصده». هذا الفاصل الصغير يوسع مساحة الاختيار.
التالي: نفّذ التدخل المقترح بعد التسجيل.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "note-the-urge"

ID: IV-025
SCREEN: Intervention Content Library
LOCATION: Intervention — environment-shift
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 2/4); work-safe
CURRENT TEXT: الاسم: «تغيير الإضاءة والصوت»
المدة: ٢ دقيقة
المكان: الغرفة
الخطوات: أضئ نور الغرفة كاملًا (الإضاءة الخافتة تميل بالمزاج نحو الخمول). / شغّل صوتًا محيطًا: قرآن، بودكاست هادئ، موسيقى بلا كلمات. / انتقل من وضع الاستلقاء إلى الجلوس أو الوقوف.
لماذا يساعد: المزاج يتبع الجسد والبيئة أسرع مما يتبع الكلام الداخلي. تغيير المدخلات الحسية يفكك «جوّ» اللحظة الذي تسكنه السلسلة.
التالي: ابدأ نشاطًا يديك مشغولة فيه.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "environment-shift"

ID: IV-026
SCREEN: Intervention Content Library
LOCATION: Intervention — prepare-tomorrow
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 1/3); work-safe
CURRENT TEXT: الاسم: «تجهيز الغد»
المدة: ١٠ دقائق
المكان: مكتبك / طاولة المطبخ
الخطوات: اكتب ٣ مهام للغد — أهمها أولًا. / جهّز ما تحتاجه (ملابس، حقيبة، كتب). / حدد موعد نوم وضعه الهاتف خارج الغرفة.
لماذا يساعد: اليوم غير المخطط يفتح ثغرات فراغ. تجهيز الغد يغلق بعضها مسبقًا ويمنحك عتبة صباحية أقوى.
التالي: نفّذ بروتوكول الليل ثم نم.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "prepare-tomorrow"

ID: IV-027
SCREEN: Intervention Content Library
LOCATION: Intervention — escalate-to-people
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 4/5); work-safe
CURRENT TEXT: الاسم: «التصعيد: اذهب حيث الناس»
المدة: حتى هبوط الخطر
المكان: أي مكان فيه أشخاص
الخطوات: اخرج من المكان الذي أنت فيه فورًا. / اذهب إلى حيث يوجد أشخاص: صالة البيت، مجلس، مقهى، أي تجمع عام مناسب. / ابقَ في مدى أبصار الناس حتى يهبط الخطر.
لماذا يساعد: في المستويات العالية، القرارات المعقدة لا تنفع — الفعل البيئي المباشر هو الأسرع. الخفاء وقود السلسلة، والحضور البشري طارئه.
التالي: إن لم يهبط: اتصل بشخص تثق به الآن.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "escalate-to-people"

ID: IV-028
SCREEN: Intervention Content Library
LOCATION: Intervention — five-actions
TYPE: intervention card (name + duration + location + instructions[] + whyItHelps + nextAction)
STATE / CONDITION: selected by the engine for Urge Check intervention phase / Emergency step 3 (riskLevels 1/3); work-safe
CURRENT TEXT: الاسم: «خمس حلقات ملاحظة»
المدة: ٥ دقائق
المكان: أي مكان
الخطوات: لاحظ الفكرة: «ظهرت ذكرى/خيال» — بلا حكم. / لا تُضف عليها تفاصيل جديدة عمدًا. / لا تصارعها ولا تحاول إخمادها بالقوة. / انتبه لخمسة أشياء تراها حولك الآن، سمِّها واحدًا واحدًا. / انتقل لنشاط ملموس.
لماذا يساعد: مقاومة الفكرة بقوة تضخمها (محاولة «لا تفكر» تجعل التفكير أرجح)، وتغذيتها تبنيها. الملاحظة المحايدة تنزع عنها الوقودين معًا.
التالي: أعد التقييم بعد النشاط.
PURPOSE / CONTEXT: Executable intervention instructions
SOURCE FILE: src/data/app/interventions.ts
SOURCE LOCATION: item id "five-actions"

## C. Current Terminology Map

Recurring concepts and how they are currently expressed (inventory only — no recommendations):

Concept: returning to the behavior (the target behavior happening again)
Current expressions found:
- «رجعت للسلوك؟» — HOME-026, HOME-015, EMERGENCY-026, RELAPSE-002, RELAPSE-023, URGE-042 headline context, SHARED-001 («توقّف هنا» desc)
- «رجعت للسلوك الآن» — RELAPSE-003
- «التعثر» / «تعثر» — HOME-003, HOME-016, HOME-017, RELAPSE-005/006/011/037/039/021, DOSE-016, BACKUP-009, PROGRESS-007, TAX-007 (stage copy)
- «الحدث» / «الحادثة» / «الحدث ده» — RELAPSE-039 (×2), RELAPSE-049/051/053
- «السقوط الثاني» / «سقوط ثانٍ» — RELAPSE-010, PROGRESS-019, TAX-006 («التعثر لا يحتاج إلى سقوط ثانٍ»)
- «السلوك» (the behavior itself) — ONBOARDING-004, SETTINGS-004? no — PROGRESS-024 «تكرار السلوك», TRIGGER-002 «قبل السلوك» context, ONBOARDING-013 «تغيير سلوك» / «سلوك جنسي قهري», WHEN_TO_SEEK_HELP (TAX-017) «السلوك يتصاعد» / «تلجأ للسلوك»
- «الجلسة» / «جلسة ممتدة» / «استمرت الجلسة» — RELAPSE-016, RELAPSE-035, PROGRESS-020, RELAPSE-054 («صارت جلسة»)

Concept: urge
Current expressions found:
- «الرغبة» / «رغبة» — URGE-002/003, HOME-009, PLAN (check-in Q1 «أعلى رغبة اليوم؟»), PREVENT-032 («درجة الرغبة»), TAX-001 levels, BACKUP-030 («قيمة رغبة»)
- «موجة» — HOME-004 («تعاملت مع موجة»), EMERGENCY-023 («الموجة»), URGE-039 («الموجة دي»), TRIGGER-002 («ما بدأ الموجة»)
- «شدة الرغبة» (dimension 1) — URGE-003
- «درجة الرغبة» — PREVENT-032 (seed rule), BACKUP-030 («قيمة رغبة غير صالحة» context)
- «أعلى رغبة اليوم» — PLAN-028/029/030

Concept: intervention
Current expressions found:
- «تدخل» / «التدخل» / «تدخّل» — SHARED-001 (desc), URGE-028/033/034, PLAN-032, TAX-001 level-3 description («خطوة تدخل مبكر»), BACKUP-011/030, TRIGGER-009/016 («نقطة التدخل الأفضل», «أقوى تدخل»)
- «تدخّل الآن» (CTA) — SHARED-005/006/011, HOME-013, HOME-025, URGE-031 (extended), EMERGENCY-002, KNOWLEDGE-003 (reference)
- «تدخل مبكر» / «تدخلات مبكرة» — HOME-043, PROGRESS-015, TAX-007
- «تدخلًا أقوى» — URGE-041, EMERGENCY-021, EMERGENCY-014 («تدخل أقوى»)
- «خطوة قطع» / «خطوة قطع واحدة» — HOME-012, URGE-025, TAX-001 level 3, PREVENT-032, URGE-030 («أول خطوة قطع»)
- «التدخل المقترح» — URGE-028

Concept: emergency mode
Current expressions found:
- «وضع الطوارئ» — EMERGENCY-001, URGE-029/031, EMERGENCY-012, SHARED-007, SHARED-012, ONBOARDING-022
- «الطوارئ» alone — SETTINGS none; SHARED-001 («خطة الوقاية» desc), TRIGGER-016? no — «حماية الطوارئ» ONBOARDING-040, TAX (digital guides header PREVENT-012 «وقت العاصفة»)
- «أزمة» / «أزمة فورية» / «وضع الأزمة» — EMERGENCY-007 («— أزمة»), URGE-030, TAX-002 (maximum label «وضع الأزمة»), PREVENT-014 («أثناء أزمة»)
- «وضع العمل الآمن» — ONBOARDING-022, ONBOARDING-040 (work-safe emergency)

Concept: state degree (the 1–5 number)
Current expressions found:
- «درجة الحالة» — EMERGENCY-006, PREVENT-014, BACKUP-030 («درجة حالة غير صالحة»)
- «درجة حالتك الآن» — URGE-015
- «درجة حالتك مرتفعة» — HOME-011
- «الدرجة» / «درجة» — URGE-018 («الدرجة دي»), PROGRESS-016/030 («عند درجة ٣ أو أقل», «عند درجة {n} من ٥»), PREVENT-032 («وصلت درجة الرغبة ٣ من ٥»)
- «مستوى» — PLAN-040 («مستوى التوتر اليوم؟» — different concept: stress level)

Concept: trigger
Current expressions found:
- «المحفز» / «محفز» / «محفزات» — TRIGGER-002, TAX-003/004, TRIGGER-013/015, HOME-047, ONBOARDING-013 («محفزاتي»), PREVENT-032 («محفز»)
- «ما الذي بدأ الأمر؟» — URGE-012, RELAPSE-031, RELAPSE-047 («١ · ما الذي بدأ الأمر؟»)
- «علامات مبكرة» — URGE-021, URGE-022 list, TAX-005 («أول علامة»), TRIGGER-008
- «نقطة القطع» / «نقطة التدخل الأفضل» / «أبكر نقطة» — RELAPSE-055/060, TRIGGER-009/010/003/006/017, PROGRESS-023 hint

Concept: relapse review (calm analysis)
Current expressions found:
- «مراجعة هادئة» — RELAPSE-004/005/045, TRIGGER-010, HOME-017 («المراجعة الهادئة»), RELAPSE-042 («المراجعة الهادئة»)
- «حلّل» / «حلّلها» / «حلّل بهدوء الآن» — RELAPSE-019, RELAPSE-005, RELAPSE-044
- «تحليل» — RELAPSE-025 step 6 («التحليل بعدين»)

Concept: evening check-in (distinct concept — overloads «مراجعة»)
Current expressions found:
- «المراجعة المسائية» — PLAN-022, PLAN-027, HOME-046 («مراجعات مسائية»), PROGRESS-011
- «مراجعة مسائية» (in backup errors) — BACKUP-030
- «سلسلة المراجعات» — PROGRESS-009 (streak metric)

Concept: stopping / quitting immediately
Current expressions found:
- «توقّف هنا» — SHARED-001 (nav), HOME-018, HOME-027, RELAPSE-001
- «ما تكملش» / «ما تكمّلش» — HOME-015/016, EMERGENCY-026, URGE-043, RELAPSE-002
- «أوقف» / «أوقفت» / «إيقاف فوري» / «الوقفة» — RELAPSE-017/026, RELAPSE-002/024, RELAPSE-041 («وقفت»)
- «قطع» / «اقطعها» — TAX-006 («اقطعها الآن»), URGE-025 («اقطعها الآن وهي لسه صغيرة»), HOME-012 («خطوة قطع»), OTHER-002 («اقطع السلسلة»)
- «سرعة التوقف» — RELAPSE-007, PROGRESS-022

Concept: the chain (escalation sequence)
Current expressions found:
- «السلسلة» — EMERGENCY-008/009 context («بلا قراءة سطر إضافي» no), TAX-006 («السلسلة بدأت بالفعل», «لا تفاوض على السلسلة»), IV library (close-source whyItHelps «السلسلة تحتاج مصدرًا»), TRIGGER-006 («سلسلتك»), OTHER-002 («اقطع السلسلة»)
- «سلسلتك» — TRIGGER-006, TRIGGER-010
- «الحلقة» — RELAPSE-021 («الدورة نفسها»), TAX-006 («هذه الحلقة تزيد الضغط»), KB content (cycle)
- «الدورة» — RELAPSE-021

Concept: streak / days counter
Current expressions found:
- «عدّاد الأيام» — RELAPSE-039 («عدّاد الأيام ممكن يبدأ من جديد»)
- «أيام منذ آخر تعثر» — PROGRESS-007
- «اليوم {n} من رحلتك» — HOME-002
- «رحلة اليوم» / «رحلتك» / «الرحلة» — PROGRESS-003, HOME-002, SETTINGS-005, DOSE-002

Concept: data privacy / local-first
Current expressions found:
- «بياناتك على جهازك فقط» — SHARED-004, ONBOARDING-005
- «لا حساب، لا خادم، لا إرسال لأي مكان…» — ONBOARDING-006, ONBOARDING-042
- «لا حسابات ولا خوادم» — SHARED-004, OTHER-002
- «كل بياناتك … محفوظة في متصفحك فقط — لا تغادر جهازك أبدًا» — SETTINGS-004
- «بياناتك محفوظة على جهازك فقط» — HOME-049
- «البيانات تبقى على جهازك» — PLAN-047
- «يُخزن محليًا فقط» — PREVENT-018; «يُخزن محليًا في متصفحك» — ONBOARDING-006
- «يعمل محليًا بالكامل» — SETTINGS-033, SHARED-032

Concept: self-compassion / no punishment
Current expressions found:
- «لا عقاب ولا جلد» — URGE-043
- «لا عقاب ولا تعويض قاسٍ» — RELAPSE-021
- «متعاقبش نفسك — لا إنهاك ولا حرمان ولا جلد» — RELAPSE-025 (stop step 5)
- «التخطي ليس فشلًا» — DOSE-014, PLAN-048 («والتخطي ليس فشلًا، بل حكمة اليوم الصعب»)
- «بلا أحكام» / «بلا أي أحكام» — ONBOARDING-004 («من غير أحكام»), RELAPSE-014 («هذا مكان آمن بلا أحكام»)

Concept: daily dose
Current expressions found:
- «الجرعة اليومية» — DOSE-001, HOME-029, SETTINGS-009, SHARED-001
- «خد جرعة اليوم» — HOME-021, HOME-007
- «جرعة» / «الجرعة» / «جرعات سابقة» — DOSE-010/011/012/014/018, SETTINGS-010
- «مُخطاة اليوم» / «مُخطاة» / «خطّيت جرعة اليوم» — DOSE-003/020/010

Concept: knowledge base
Current expressions found:
- «قاعدة المعرفة» — KNOWLEDGE-001, DOSE-022, URGE-023, VALUES-010 («موضوع «القيم» في قاعدة المعرفة»), SHARED-001
- «بطاقات» / «البطاقة» — KNOWLEDGE-002/009, SETTINGS-013 («بطاقات «تأمل روحي»»)

Concept: support person
Current expressions found:
- «شخص دعم» — PREVENT-015, BACKUP-031
- «شخص تثق به» — PREVENT-016, EMERGENCY-018 («أي شخص تثق به»), IV library («مكالمة قصيرة بشخص تثق به»)
- «الدعم» — ONBOARDING-029 («أي نوع من الدعم تفضّل؟»), SETTINGS-008 («المحتوى والدعم»), BACKUP-032 («تفضيلات الدعم»)

Concept: the app / system voice (who speaks)
Current expressions found:
- «التطبيق» (3rd person) — TRIGGER-005 («سيبدأ التطبيق»), SETTINGS-033, BACKUP-026 («هذا التطبيق يدعم/ليس تشخيصًا» SETTINGS-032)
- «النظام» (3rd person) — URGE-041 («جزء من النظام»), TRIGGER-016 («النظام سيرجّحه تلقائيًا»), ONBOARDING-004/ONBOARDING-012 («نظامك»/«تخصيص نظامك»)
- «نحن» (1st person plural) — ONBOARDING-012 («هذا يساعدنا»), ONBOARDING-023/024/025 («سنجهّز/سنطلب/سنفضّل»), URGE-032 («سنعرض لك»), DOSE-016 («نفضّل»), URGE-041 («نجرّب»), ONBOARDING-035 («جهّزنا/حددنا وبنينا»), EMERGENCY-023 («سجّلنا»), RELAPSE-040 («سجّلنا التعثر»)
- impersonal/passive — most guidance («تُصنع في الهدوء», «ستُخزن», «يُخزن»)

Concept: work-safe
Current expressions found:
- «وضع العمل الآمن» — ONBOARDING-022, ONBOARDING-040
- «تدخلات لا تتطلب ترك الجهاز» / «تدخلات الابتعاد عن الجهاز» — ONBOARDING-023/025
- «أحتاج الجهاز الآن للعمل/الدراسة» — URGE-011

Concept: app name
Current expressions found:
- «استعادة» — ONBOARDING-001/003, SHARED-002/031, SETTINGS-033, OTHER-001/003, layout metadata
- «نظام شخصي لاستعادة التحكم» (full tagline) — ONBOARDING-002, OTHER-001
- «نظام شخصي للتحكم» (short tagline) — SHARED-003

## D. Possible Language Inconsistencies

(Reported only — no fixes. Affected IDs cited.)

Issue D1: Mixed register — Egyptian colloquial vs Modern Standard Arabic across the same journeys.
Affected items / current forms:
- Egyptian («مش», «دلوقتي», «ما تكملش», «اللي», «إيه», «متعاقبش», «متدورش», «بيتحسب ليك»): HOME-006/007/008/012/015, URGE-002/013/018/019/020/025/026/039/041/043, RELAPSE-002/024/025/039/041/042, ONBOARDING-040 («مش محتاج تسيب جهازك»), SHARED-001 («توقّف هنا» desc «فهم هادئ» mixes), TAX-001 (level-3 «لسه صغيرة», level-4 «بلا تحليل» fine)
- MSA («لا تصفح», «يمكن تحسينه», «تُصنع», «ستُخزن», «يُطلب», «متى شئت»): PLAN-012/016, PROGRESS-033, PREVENT-002, ONBOARDING-006/042, BACKUP-012, SETTINGS-004, VALUES-010/014
- Note: high-stress surfaces are consistently Egyptian; calm/reference surfaces are consistently MSA — but the switch happens WITHIN one flow (e.g., Urge Check result URGE-025 Egyptian → the same screen's I7 disclaimer URGE-018 Egyptian; Emergency overlay EMERGENCY-008 MSA-style imperative «أغلق كل التبويبات» while its header EMERGENCY-003 is Egyptian «ما تحللش دلوقتي»).

Issue D2: Same CTA concept with different wording between sister flows.
Affected items:
- «لا، لسه مرتفعة» + «نجرّب تدخلًا أقوى — ده طبيعي وجزء من النظام» (URGE-040/041) vs «لا — لسه مرتفع: جرّب تدخلًا أقوى» (EMERGENCY-021) — same decision, different headline, different person (نجرّب «we try» vs جرّب «you try»), different gender agreement («مرتفعة» vs «مرتفع»).
- «نعم، هبطت» (URGE-038) vs «نعم — هبط» (EMERGENCY-020) — same answer, two spellings of the verb + different dash style.

Issue D3: «مراجعة» is overloaded between two distinct features.
Affected items:
- Evening check-in: PLAN-022/023/024/027/046 («المراجعة المسائية», «حفظ المراجعة»), HOME-046, PROGRESS-009/011, BACKUP-030
- Relapse calm review: RELAPSE-004/005/045/065 («مراجعات هادئة», «مراجعة هادئة», «حفظ المراجعة»), TRIGGER-010, HOME-017
- Both wizards end with the identical button label «حفظ المراجعة» (PLAN-046 vs RELAPSE-065) for different concepts; and «سلسلة المراجعات» (PROGRESS-009) counts only evening check-ins while «مراجعات هادئة بانتظارك» (RELAPSE-004) counts relapse reviews.

Issue D4: Inconsistent numeral system — Arabic-Indic (٥ ١٠ ٣) vs Latin (5).
Affected items:
- Arabic-Indic in visible copy: URGE-016 («من ٥»), EMERGENCY-006 («من ٥»), PLAN-024 («٥ أسئلة»), DOSE-002, most durations/hints («٣٠ يومًا», «١٤ يومًا», «٤ أسابيع»)
- Latin 5 in accessibility strings: SHARED-014 («{label}: {n} من 5»), PLAN-030 («أعلى رغبة اليوم: {n} من 5»), PLAN condScale value display «{n}/5»
- Latin in mixed text: TAX-010 safesearch limits («غير مضمون 100%»), DOSE-002 vs latin elsewhere; version «2.2.0» (SETTINGS-033), «JSON»/.json (SETTINGS-018, BACKUP-003/005), OTHER-004 filename
- Digits inside Arabic words: «٥ص–١٢م» (TAX-018) vs «بعد ١٠ مساءً» (URGE-008) — clock formats differ.

Issue D5: «تدخّل الآن» renders in several visual forms with different aria names.
Affected items: SHARED-005 (button, sidebar), SHARED-006 (bottom nav center), SHARED-011 (sheet card), HOME-013 (banner), HOME-025 (guide row), URGE-031 («تدخّل الآن — وضع الطوارئ»), EMERGENCY-002 (overlay h1), plus KNOWLEDGE-003 mentions it in prose. Screen-reader name SHARED-007 spells it «تدخل الآن» (no shadda) — inconsistent with the visible «تدخّل».

Issue D6: Duplicated-privacy line family with drifting wording.
Affected items / current forms:
- «بياناتك على جهازك فقط — لا حسابات ولا خوادم.» (SHARED-004)
- «لا حساب، لا خادم، لا إرسال لأي مكان — كل شيء يُخزن محليًا في متصفحك، ويمكنك تصديره كنسخة احتياطية متى شئت.» (ONBOARDING-006)
- «بياناتك كلها ستُخزن على جهازك فقط — لا حساب، لا خادم، لا إرسال لأي مكان.» (ONBOARDING-042)
- «كل بياناتك (سجلات، مراجعات، خطة) محفوظة في متصفحك فقط — لا تغادر جهازك أبدًا. …» (SETTINGS-004)
- «بياناتك محفوظة على جهازك فقط.» (HOME-049)
- «صراحتك هنا هي ما يجعل خريطتك وتوقعاتك دقيقة — البيانات تبقى على جهازك.» (PLAN-047)
- «تُحفظ هذه المسودة على جهازك تلقائيًا…» (VALUES-014); «رقمه (يُخزن محليًا فقط)» (PREVENT-018)
- Varies: device «جهازك» vs browser «متصفحك»; «لا حسابات ولا خوادم» vs «لا حساب، لا خادم».

Issue D7: Tagline inconsistency.
Affected items: ONBOARDING-002 «نظام شخصي لاستعادة التحكم» vs SHARED-003 «نظام شخصي للتحكم» (sidebar short form drops «استعادة»); OTHER-001 uses the long form. Three surfaces, two variants.

Issue D8: Awkward or duplicated wording.
Affected items / current forms:
- BACKUP-026: «نسخة النسخة الاحتياطية (إصدار {n}) غير مدعومة…» — «نسخة النسخة» duplication (intended: «schema version of the backup»).
- PLAN-042: «كم الوقت الحر غير المنظم؟» — translated-sounding structure («how much free time the unstructured»).
- TAX-013 «استخدام مكثف للجهاز» — nominal compound unlike sibling chips («قلة نوم», «سهر متأخر»).
- SETTINGS-013: «يظهر الآن: ممارسات في «القيم والروحانيات»، وبطاقات «تأمل روحي» في قاعدة المعرفة، وقد تُختار في الجرعة اليومية والتدخلات.» — long single line with nested guillemets.
- URGE-030: «أزمة فورية — لا تقرأ أكثر.» followed by «اضغط الزر وابدأ أول خطوة قطع الآن.» — mixes negative instruction + positive.
- VALUES-010: «صُغها بعمق — ستجد موضوع «القيم» في قاعدة المعرفة.» — second clause reads as a dangling reference.

Issue D9: Punctuation & typography inconsistencies.
Affected items / examples:
- Sentence-final period: present in most strings, absent in chips/badges (expected) but also absent mid-family: HOME-030 «أُنجزت اليوم ✓» vs DOSE-009 «أنجزت جرعة اليوم» (no period, has none) vs PLAN-023 «أُنجزت الليلة ✓ — شكرًا لصدقك» — the ✓ glyph placement varies (inside, absent).
- Dash style: «—» (em dash) used in most copy, but «-» hyphen appears in «istiaada-backup-…» (filename, OTHER-004) and mixed «،» vs «,» never observed (commas consistently Arabic «،»).
- Ellipsis: «…» (Arabic-style single glyph) used in placeholders (PREVENT-017 «صديقي…»), consistent; but VALUES-005 uses «؛» semicolon while siblings use «—».
- Guillemets «» used for feature names («تدخّل الآن», «إذا… إذن», «وضع العمل الآمن») but absent for same names in some spots (EMERGENCY-002 plain «تدخّل الآن»).

Issue D10: Gender agreement drift for «درجة/الرغبة» references.
Affected items: URGE-040 «لا، لسه مرتفعة» (fem — agreeing with الرغبة/الدرجة?) vs EMERGENCY-021 «لا — لسه مرتفع» (masc — agreeing with الخطر?); HOME-011 «درجة حالتك مرتفعة» (fem, agrees with درجة) vs EMERGENCY-019 «هبط الخطر؟» (masc, الخطر). Same concept family switches referent.

Issue D11: Second-person app voice switches between «we» and «the app/system» and imperative.
Affected items: URGE-032 «سنعرض لك», URGE-041 «نجرّب», DOSE-016 «نفضّل», ONBOARDING-035 «جهّزنا/حددنا/بنينا», EMERGENCY-023 «سجّلنا», RELAPSE-040 «سجّلنا» vs TRIGGER-005 «سيبدأ التطبيق», TRIGGER-016 «النظام سيرجّحه», SETTINGS-032 «هذا التطبيق أداة…», BACKUP-026 «هذا التطبيق يدعم». No single documented voice.

Issue D12: Metric label drift between Home snapshot and Progress screen (same metric, different label/hint).
Affected items:
- «رغبات تعاملت معها» HOME-041 = PROGRESS-013 (consistent) but hints: «{n} خلال آخر أسبوع» (HOME-042) vs «{n} خلال آخر ٧ أيام» (PROGRESS-014) — «أسبوع» vs «٧ أيام», Latin vs Arabic-Indic.
- «تدخلات مبكرة» hints: «خلال ٣٠ يومًا» (HOME-044) vs «عند درجة ٣ أو أقل — خلال ٣٠ يومًا» (PROGRESS-016).
- «استقرار يومي» (HOME-045) vs «الاستقرار اليومي» (PROGRESS-027); hints «مراجعات مسائية / ١٤ يومًا» vs «إنجاز المراجعة المسائية خلال ١٤ يومًا».
- «وعي بالمحفزات» hints: «محفزات مختلفة رصدتها» (HOME-048) vs «محفزات مختلفة رصدتها خلال ٣٠ يومًا» (PROGRESS-026).
- «سرعة التوقف» value units: «فوري تقريبًا / ~{n} دقيقة» (RELAPSE-008) vs «فوري / ~{n} د» (PROGRESS-023) — two abbreviations of the same unit on two screens.
- «منع السقوط الثاني» hints: «من {n} تعثرًا» (RELAPSE-011) vs «تعثرات لم تتحول لجلسة ممتدة» (PROGRESS-020).

Issue D13: Empty-state patterns differ in structure.
Affected items: «لا سجل بعد» + body (RELAPSE-013/014, full sentence body), «لا قواعد بعد — أضف قاعدة…» (PREVENT-005, single line), «لا نتائج» + «جرّب كلمة أبسط أو غيّر التصنيف.» (KNOWLEDGE-006/007), «نحتاج قليلًا من السجل أولًا» + long body (TRIGGER-004/005), «لم تسجل محفزات في فحوصاتك بعد.» (TRIGGER-014, bare sentence). «لا X بعد» vs «لم تسجل X بعد» vs «نحتاج…».

Issue D14: Theme names asymmetric.
Affected items: SETTINGS-015 «ليلي هادئ» (adjective-qualified) vs SETTINGS-016 «نهاري» (bare).

Issue D15: «اعرف/افهم/افعل» block labels are consistent (Dose + Knowledge) — but the deep-reading label differs: «قراءة أعمق (اختياري)» (DOSE-008) vs «قراءة أعمق» (KNOWLEDGE-014).

Issue D16: Accessibility label spelling/wording drift vs visible text.
Affected items: SHARED-007 «تدخل الآن» vs visible «تدخّل الآن»; SHARED-014 & PLAN-030 «من 5» vs visible «من ٥»; SHARED-016 «خطوة {current} من {total}» (Latin digits) vs visible Emergency «الخطوة {n} من 4» (Arabic word, Latin 4 — itself mixed); EMERGENCY-005 uses «من 4» with Latin digit while EMERGENCY-006 uses «من ٥» Arabic-Indic in the same header block.

Issue D17: Clinical/technical vocabulary in user-facing onboarding.
Affected items: ONBOARDING-013 «أريد تقليل سلوك جنسي قهري» (clinical term «قهري»), «استراتيجيات عملية مباشرة» (ONBOARDING-031), «توجيه نفسي/سلوكي» (ONBOARDING-031). Context is an explicit self-description step; flagged for terminology review.

Issue D18: «تعذر قراءة الملف…» error family overlaps.
Affected items: BACKUP-002 «تعذر قراءة الملف — حاول مرة أخرى.» (file read) vs BACKUP-021 «تعذر قراءة الملف — تأكد أنه ملف JSON سليم غير تالف.» (JSON parse) vs BACKUP-022 «بنية الملف غير صالحة — الملف ليس نسخة احتياطية صحيحة.» vs BACKUP-023 «الملف ليس نسخة احتياطية من هذا التطبيق.» — the first two share an identical opening for different failures.

Issue D19: «ألصق» vs «الصق» (hamza on alef-lassa verb form).
Affected items: BACKUP-004 «أو الصق محتوى النسخة يدويًا» vs BACKUP-005 «ألصق محتوى ملف JSON هنا…» — two spellings of the same verb in the same widget.

Issue D20: Interpolated degree grammar: «وصلت درجة الرغبة ٣ من ٥» (PREVENT-032) reads «درجة الرغبة» (urge-degree) while the app's canonical term is «درجة الحالة» (state degree) — the seeded rule mixes both vocabularies.

## E. Duplicate / Near-Duplicate Copy

Exact duplicates (same string, multiple render sites — some intentional):
- «تدخّل الآن» — SHARED-005, SHARED-006, SHARED-011, HOME-013, HOME-025, EMERGENCY-002 (+ prose mention in KNOWLEDGE-003; extended variant URGE-031 «تدخّل الآن — وضع الطوارئ»)
- «رجعت للسلوك؟ ما تكملش — نوقف هنا الأول» — HOME-015, EMERGENCY-026 (exact, intentional P2 entry)
- «توقّف هنا» — SHARED-001 (nav label), HOME-018, HOME-027 (intentional: nav + CTA)
- «اعرف» / «افهم» / «افعل» / «تذكّر» — DOSE-004/005/006/007 and KNOWLEDGE-010/011/012/013 (intentional parallel structure between Dose card and Knowledge dialog)
- «المراجعة المسائية» — PLAN-022 and PLAN-027 (card title + dialog title)
- «حفظ المراجعة» — PLAN-046 and RELAPSE-065 (two different wizards, same button label)
- «جملة واحدة تكفي…» — PLAN-035 and RELAPSE-058
- «تراجع» — SETTINGS-029 and BACKUP-019
- «اتصل بـ{label}» — PREVENT-021 and EMERGENCY-017
- «ما الذي بدأ الأمر؟» — URGE-012 («+ (اختياري — يساعد في اختيار التدخل)»), RELAPSE-031, RELAPSE-047 («١ · …»)
- «تدخلات مبكرة» / «رغبات تعاملت معها» / «سرعة التوقف» / «منع السقوط الثاني» — HOME-043/HOME-041, PROGRESS-015/PROGRESS-013, RELAPSE-007/PROGRESS-022, RELAPSE-010/PROGRESS-019 (same metric labels on two screens)
- «لماذا أفعل هذا؟» — ONBOARDING-032 and VALUES-003 (and SHARED-001 desc «لماذا أفعل هذا؟»)
- «استعادة» — ONBOARDING-001, SHARED-002, SHARED-031, SETTINGS-033, OTHER-001/003
- «السجلات اليومية غير صالحة في النسخة.» — BACKUP-028 (two distinct checks return the same string)
- «توقفت فورًا» — RELAPSE-015 (option) and RELAPSE-041 (confirmation variant «توقفت فورًا — استجابة ممتازة»)
- «استمرت الجلسة» — RELAPSE-016 (badge) and RELAPSE-035 (chip, «نعم، استمرت الجلسة»)
- «نعم — ونجح» (PLAN-033) — near-duplicate of success wording elsewhere («نجح {n} مرة» TRIGGER-016/PROGRESS-031)
- «مساء الخير» — HOME-001 covers two time branches with the same string (code-level duplicate)
- Time-to-stop options — RELAPSE-015 renders in both quick-log chips and log badges

Near-duplicates / same message with drift (candidates for Phase 2 decisions — NOT changed now):
- Privacy family (6+ variants) — see D6: SHARED-004, ONBOARDING-006, ONBOARDING-042, SETTINGS-004, HOME-049, PLAN-047
- Escalation CTA pair — URGE-040/041 vs EMERGENCY-021 (see D2)
- Success CTA pair — URGE-038 vs EMERGENCY-020 (see D2)
- «درجة الحالة: {n} من ٥» (EMERGENCY-006) vs «درجة حالتك الآن» + «من ٥» (URGE-015/016) vs «درجة حالتك مرتفعة» (HOME-011) — three renderings of the degree concept
- Completion confirmations: «أُنجزت اليوم ✓» (HOME-030), «أنجزت جرعة اليوم» (DOSE-009), «أُنجزت» (DOSE-019), «مُخطاة» (DOSE-020), «أُنجزت الليلة ✓ — شكرًا لصدقك» (PLAN-023), «حُفظ ✓» (VALUES-008), «نُسخ ✓» (SETTINGS-020), «تمت الاستعادة بنجاح» (BACKUP-014), «أُضيفت القاعدة…» (RELAPSE-062)
- Skip family: «مُخطاة اليوم» (DOSE-003) / «خطّيت جرعة اليوم» (DOSE-010) / «مُخطاة» (DOSE-020) / «التخطي ليس فشلًا» (DOSE-014) + PLAN-048 variant
- «خد جرعة اليوم» (HOME-021) vs «خد جرعة اليوم واختار مهمة واحدة من خطتك — ده كفاية.» (HOME-007) — prefix duplication
- «قاعدة وقاية جديدة» (PREVENT-025) vs «قاعدة وقاية مقترحة» (RELAPSE-059) vs «قواعدي «إذا… إذن»» (PREVENT-003) — rule-naming family
- Error family overlaps — see D18
- «الملف غير صالح.» (BACKUP-013 fallback) vs the specific invalid messages (BACKUP-021…032)

## F. Statistics

Inventory statistics only (counts of entries; several entries bundle sets — noted):

- Total user-facing copy entries: **661**
- By group: Home 49 · Onboarding 45 · Daily Dose 22 · Daily Plan 48 · Urge Check 43 · Emergency 26 · Stop/Post-behavior 65 · Prevention 32 · Trigger Map 18 · Progress 33 · Values/Spiritual 17 · Knowledge 14 (+98 library cards) · Settings 33 · Shared/Global 32 (+21 taxonomy entries) · Backup/Restore 32 · Other 4 · TAX 21 · KB 99 (incl. KB-000 categories) · IV 28
- Bundled sets inside single entries (multi-string entries): SHARED-001 (11 nav label+desc pairs), HOME-038 (6 pillars), ONBOARDING-013/016/019/028/031 (option sets), URGE-022 (4 bullets), SETTINGS-004 (4 bullets), PREVENT-032 (4 rules), TAX-001/003/004/005/006/007/010/012/013/014/015/017 (full lists), BACKUP-027/028/030 (error string sets — BACKUP-030 alone covers 36 distinct field hints), KB-### (up to 6 text fields each), IV-### (6+ fields each)
- Estimated individual user-facing strings if unbundled: ~1,300 (98 knowledge cards × ~6 fields + 28 interventions × ~8 fields + ~330 bundled UI strings + 661-entry base already counted at entry level)
- Conditional entries (rendered only under a state/condition): **~376 (57%)** — incl. all 28 IV entries (engine-selected), 5 KB spiritual-gated cards, all 26 Emergency overlay entries, 43 of 65 Relapse entries (stop/quick/reframe/review views), all home-state banners, dose done/skipped, spiritual ON note, backup error/result paths
- Accessibility-labeled entries (aria-label / template): **18 explicit entries** — HOME-037, PLAN-030, PLAN-043, EMERGENCY-001, VALUES-016, RELAPSE-020, PREVENT-008, PREVENT-009, SHARED-007, SHARED-008, SHARED-010, SHARED-013, SHARED-014, SHARED-015, SHARED-016, SHARED-017, SHARED-022 (+ 2 library-default English «Close» buttons — see G) — several are templates covering 5–11 buttons each
- Duplicate / near-duplicate groups: **~33** (≈20 exact-duplicate groups listed in E + ≈13 near-duplicate families)
- Terminology inconsistency issues reported: **20** (D1–D20)
- Uncertain items flagged: **7** (see G)

## G. Uncertain / Unverified Items

REVIEW: uncertain — could not be confidently classified:

1. SHARED-030 — Splash initials tile «اس» (legacy text tile, pre-hydration flash + noscript fallback). Superseded by the LogoMark everywhere else; still technically user-visible for a moment.
2. TAX-019 — BOREDOM_MENU (3 buckets × 3–5 options) — defined in taxonomy.ts, never imported by any component. Unused library content: excluded from the live surface, included for completeness.
3. TAX-020 — WORK_SAFE_PRINCIPLE («لا تحارب التقنية. هندِس السياق المحيط بها.») — defined, never rendered.
4. TAX-004 — TRIGGER_CATEGORIES[].hint — five hint strings defined; only labels render (Trigger Map). Hints are dead content.
5. OTHER-004 — Export filename `istiaada-backup-{date}.json` — Latin script, visible in the browser download UI; counts as user-facing chrome but not Arabic copy.
6. **Library-default English «Close»** — src/components/ui/dialog.tsx line 75 and src/components/ui/sheet.tsx line 77 render a default X button with `<span class="sr-only">Close</span>`. The app's dialogs (Evening check-in, Knowledge card, Settings import, Prevention rule) and the mobile More sheet do NOT disable it — so screen-reader users encounter English «Close» alongside Arabic content, and the More sheet has BOTH the custom «إغلاق» (SHARED-010) and the default English-named close button. This lives in shadcn primitives (excluded from the per-item inventory by the unused-library-defaults rule) but IS user-reachable — flagged here so it is not silently omitted.
7. Settings data fields `postRelapseSupport` and `notificationsEnabled` persist in state and are validated in backups (BACKUP-032 context) but have no UI toggle and no user-facing copy — verified intentionally removed (comment in SettingsScreen.tsx lines 178–181). No copy to inventory; noted to confirm this is intended.

Not inspectable / out of scope: `src/components/ui/**` beyond the Close-button finding above (standard shadcn defaults, no app-specific Arabic); `src/hooks/**` (no strings); browser-generated UI (scrollbars, native date picker of SETTINGS-006, file chooser of BACKUP-003 — platform-language text); Next.js/Turbopack error overlays (developer-facing only).

## H. Files Inspected

Read in full (line-by-line copy extraction):
1. src/components/app/screens/HomeScreen.tsx
2. src/components/app/screens/DoseScreen.tsx
3. src/components/app/screens/PlanScreen.tsx
4. src/components/app/screens/UrgeScreen.tsx
5. src/components/app/screens/EmergencyMode.tsx
6. src/components/app/screens/RelapseScreen.tsx
7. src/components/app/screens/PreventionScreen.tsx
8. src/components/app/screens/TriggerMapScreen.tsx
9. src/components/app/screens/ProgressScreen.tsx
10. src/components/app/screens/ValuesScreen.tsx
11. src/components/app/screens/KnowledgeScreen.tsx
12. src/components/app/screens/SettingsScreen.tsx
13. src/components/app/AppShell.tsx
14. src/components/app/Onboarding.tsx
15. src/components/app/shared.tsx
16. src/components/app/InterventionCard.tsx
17. src/components/app/Timer.tsx
18. src/components/app/RestoreBackup.tsx
19. src/components/app/AppRoot.tsx
20. src/app/layout.tsx
21. src/app/page.tsx
22. src/lib/app/backup.ts (all Arabic error strings)
23. src/lib/app/helpers.ts (greeting, time buckets)
24. src/lib/app/risk-engine.ts (label plumbing, thresholds — no new user strings)
25. src/lib/app/progress.ts (forecast messages, insight parts)
26. src/lib/app/store.ts (seeded prevention rules)
27. src/data/app/taxonomy.ts (full — 21 inventory entries)
28. src/data/app/knowledge.ts (categories + aggregation)
29. src/data/app/interventions.ts — machine-extracted (all 28 items verbatim)
30. src/data/app/knowledge-core.ts — machine-extracted (25 items)
31. src/data/app/knowledge-wellbeing.ts — machine-extracted (34 items)
32. src/data/app/knowledge-recovery.ts — machine-extracted (39 items)
33. src/components/ui/dialog.tsx + src/components/ui/sheet.tsx — targeted inspection for the default «Close» finding (G-6)

Targeted greps (not full reads, string-level only): src/lib/app/{dose-engine,intervention-engine,types,scale}.ts, src/lib/app/emergency-launcher.ts, src/components/app/LogoMark.tsx — confirmed zero user-facing Arabic strings beyond what is inventoried above (icon-only decorative mark).

Machine extraction script: scripts/phase2a-extract.ts (read-only; imports the data modules and dumps every string verbatim — guarantees no transcription drift for the 98 KB + 28 IV + 21 TAX entries).
