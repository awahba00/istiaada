# Current UI evidence — 1–5 behavioral scale (post-migration, APP_VERSION 2.2.0)

**Status:** Authoritative / current validation evidence.
**Captured:** 2026-09-19, from the **production build** (`next build` + standalone
server, port 3100) of the current source tree — the same code that ships.
**Scale:** the app's self-reported indicators are the 1–5 behavioral ladder
(`شدة الرغبة` / `قرب التصرف` / `فقدان السيطرة`), displayed as `X من ٥`.

Every screenshot below was verified by an automated vision-model pass
(`vlm-verify.json`, 22/22 passed): wherever a rating scale is visible it is the
**1–5** ladder (`من ٥` / `سلم من ١ لـ ٥` / `X/5` / a row of exactly five number
options), and **no screenshot contains any trace of the old 1–10 scale**
(no `من ١٠`, no `/10`, no degree values 6–10, no option rows wider than five).
Durations such as `~١٠ دقيقة` are minutes, not scale values.

## Coverage (22 shots)

| # | File | Shows |
|---|------|-------|
| 01 | `01-onboarding-welcome-390.png` | Fresh onboarding welcome (390×844) |
| 02 | `02-home-stable-390.png` | Stable Home — daily dose + situation cards |
| 03 | `03-home-stable-desktop-1280.png` | Stable Home — desktop (1280×800, RTL sidebar) |
| 04 | `04-urge-input-390.png` | Urge check input — three 1–5 rows + footer `على سلم من ١ لـ ٥` |
| 05 | `05-urge-result-level2-390.png` | Result — `٢ من ٥` · بداية بسيطة · awareness guidance |
| 06 | `06-urge-result-level5-390.png` | Result — `٥ من ٥` · على وشك التصرف · single emergency CTA |
| 07 | `07-emergency-step1-390.png` | Emergency step 1 — header `درجة الحالة: ٥ من ٥ — أزمة` |
| 08 | `08-emergency-step3-countdown-390.png` | Emergency step 3 — intervention + countdown |
| 09 | `09-emergency-step4-reassess-390.png` | Emergency step 4 — `هبط الخطر؟` reassessment |
| 10 | `10-emergency-done-why-390.png` | Emergency done — P1 personal `why` (كلماتك أنت) + P2 relapse entry |
| 11 | `11-home-after-handled-390.png` | Home after a handled wave — `أحسنت — تعاملت مع موجة من قليل` |
| 12 | `12-home-highrisk-p2-entry-390.png` | High-risk Home card + P2 quiet entry `رجعت للسلوك؟ ما تكملش — نوقف هنا الأول` |
| 13 | `13-relapse-stop-390.png` | Relapse entry — STOP-first messaging + stats |
| 14 | `14-relapse-stop-protocol-390.png` | Relapse STOP protocol steps |
| 15 | `15-relapse-reframe-390.png` | Post-quick-log reframe — `بعد التعثر: تذكير مهم` |
| 16 | `16-home-postrelapse-390.png` | Home post-relapse banner (unreviewed, <48h) |
| 17 | `17-evening-checkin-390.png` | Evening check-in dialog — `أعلى رغبة اليوم؟` 1–5 row |
| 18 | `18-progress-insights-390.png` | Progress — honest multi-metric insights |
| 18b | `18b-progress-insight-scale-390.png` | Insight card — `عند درجة X من ٥ — كلما انخفضت، كنت أسرع استجابة` |
| 19 | `19-urge-input-320.png` | Urge check input at 320×568 — one-hand 1–5 targets |
| 20 | `20-home-postrelapse-320.png` | Post-relapse Home at 320×568 |
| 21 | `21-evening-checkin-edit-hydrated-320.png` | Evening check-in **edit** re-opened with saved answers (P3 hydration) |

## How they were produced

- Driver: `scripts/shot-scale5.sh` (agent-browser, session `scale5prod`)
  — seeds a realistic 21-day user history via
  `scripts/make-scale5-seed.mjs`, then walks every key flow live
  (urge checks at levels 2/3/4/5, the full emergency path, relapse
  stop → quick log → reframe, evening check-in save + hydrated re-edit).
- Verification: `scripts/verify-scale5-shots.ts` → `vlm-verify.json`
  (per-file verdicts; 429-retry built in). 0 page errors and 0 console
  warnings across the entire capture run.
- No application code was modified for or by this evidence pass.

## Pre-migration (1–10) evidence

All screenshots/VLM reports from before the 1–5 migration were moved to
`../archive-pre-scale5/` and are explicitly superseded — see that folder's
README. Nothing in this folder predates the migration.
