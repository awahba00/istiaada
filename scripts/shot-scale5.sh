#!/usr/bin/env bash
# ============================================================================
# shot-scale5.sh — regenerate the final 1–5-scale UI evidence screenshots
# (evidence-cleanup pass; NO application code is modified by this script).
#
# Drives the running dev server (http://localhost:3000) through the app's key
# flows with agent-browser and captures viewport screenshots into
# tool-results/scale5-regen/.
#
# Coverage (filenames kept identical to the previous evidence set):
#   01 onboarding welcome          12 home high-risk + P2 entry
#   02 home stable (390)           13 relapse entry
#   03 home stable (desktop 1280)  14 relapse STOP protocol
#   04 urge check input            15 relapse reframe
#   05 urge result level 2         16 home post-relapse
#   06 urge result level 5         17 evening check-in (1–5 rows)
#   07 emergency step 1            18 progress insights
#   08 emergency step 3            18b insight scale reference (من ٥)
#   09 emergency step 4 reassess   19 urge input @320
#   10 emergency done + P1 why     20 home post-relapse @320
#   11 home after handled          21 evening check-in edit hydrated @320
# ============================================================================
set -uo pipefail

# Env overridables: SCALE5_BASE (server), SCALE5_SESSION (browser session),
# SCALE5_OUT (output dir). Defaults keep the original dev-server behavior.
AB=(agent-browser --session "${SCALE5_SESSION:-scale5}")
BASE="${SCALE5_BASE:-http://localhost:3000}"
OUT="${SCALE5_OUT:-/home/z/my-project/tool-results/scale5-regen}"
SEED="$(node /home/z/my-project/scripts/make-scale5-seed.mjs)"

mkdir -p "$OUT"

# ——— helpers ————————————————————————————————————————————————
shot() { "${AB[@]}" screenshot "$OUT/$1.png" >/dev/null 2>&1; echo "  📸 $1"; }

# click first VISIBLE button/[role=button]/a whose text includes $1
clk() {
  local r
  r=$("${AB[@]}" eval "(() => { const t='$1'; const b=[...document.querySelectorAll('button,[role=button],a')].filter(x=>x.getClientRects().length&&x.textContent).find(x=>x.textContent.includes(t)); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ clk FAILED [$1] → $r"
}
# click visible button with EXACT trimmed text
clkx() {
  local r
  r=$("${AB[@]}" eval "(() => { const t='$1'; const b=[...document.querySelectorAll('button')].filter(x=>x.getClientRects().length).find(x=>x.textContent.trim()===t); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ clkx FAILED [$1] → $r"
}
# click the LAST visible button with exact text (late-in-DOM heuristic)
clkl() {
  local r
  r=$("${AB[@]}" eval "(() => { const t='$1'; const bs=[...document.querySelectorAll('button')].filter(x=>x.getClientRects().length&&x.textContent.trim()===t); if(!bs.length) return 'NOTFOUND'; bs[bs.length-1].click(); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ clkl FAILED [$1] → $r"
}
# set a NumberScale radio: $1 = radiogroup aria-label fragment, $2 = value
radio() {
  local r
  r=$("${AB[@]}" eval "(() => { const g=[...document.querySelectorAll('[role=radiogroup]')].find(x=>(x.getAttribute('aria-label')||'').includes('$1')); if(!g) return 'NOGROUP'; const b=[...g.querySelectorAll('[role=radio]')].find(x=>x.textContent.trim()==='$2'); if(!b) return 'NOBTN'; b.click(); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ radio FAILED [$1=$2] → $r"
}
# set an evening-dialog cond-scale by exact button aria-label "$1 $2"
cond() {
  local r
  r=$("${AB[@]}" eval "(() => { const a='$1 $2'; const b=[...document.querySelectorAll('button')].filter(x=>x.getClientRects().length).find(x=>x.getAttribute('aria-label')===a); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ cond FAILED [$1=$2] → $r"
}
# fill a textarea by placeholder fragment (React-controlled)
fill() {
  local r
  r=$("${AB[@]}" eval "(() => { const ta=[...document.querySelectorAll('textarea')].find(x=>(x.placeholder||'').includes('$1')); if(!ta) return 'NOTFOUND'; const set=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value').set; set.call(ta,'$2'); ta.dispatchEvent(new Event('input',{bubbles:true})); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ fill FAILED [$1] → $r"
}
wt()   { "${AB[@]}" wait "$1" >/dev/null 2>&1; }
top()  { "${AB[@]}" eval "window.scrollTo(0,0)" >/dev/null 2>&1; }
siv()  { # scroll element containing $1 into view (centered)
  "${AB[@]}" eval "(() => { const els=[...document.querySelectorAll('div,span,p,li,h1,h2,h3')].filter(x=>x.childElementCount===0&&x.textContent&&x.textContent.includes('$1')); if(!els.length) return 'NOTFOUND'; els[els.length-1].scrollIntoView({block:'center'}); return 'ok'; })()" >/dev/null 2>&1
}
# navigate via mobile more-sheet: $1 = item label inside the sheet
nav() {
  clk "المزيد"; wt 500
  local r
  r=$("${AB[@]}" eval "(() => { const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; if(!d) return 'NODIALOG'; const b=[...d.querySelectorAll('button')].find(x=>(x.textContent||'').includes('$1')); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ nav FAILED [$1] → $r"
  wt 900
}
chk() { # log the first visible words of the page (sanity trail)
  "${AB[@]}" eval "document.body.innerText.replace(/\s+/g,' ').slice(0,110)" 2>/dev/null
}

echo "═══ scale5 evidence regeneration — $(date '+%H:%M:%S') — $BASE ═══"

# ——— A. fresh onboarding welcome ————————————————————————————
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 3500
"${AB[@]}" storage local clear >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 3500
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1; wt 400
echo "A. onboarding — $(chk)"
shot 01-onboarding-welcome-390

# ——— B. seed + stable home ————————————————————————————————————
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 3000; top; wt 300
echo "B. seeded home — $(chk)"
shot 02-home-stable-390
"${AB[@]}" set viewport 1280 800 >/dev/null 2>&1; wt 700
shot 03-home-stable-desktop-1280
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1; wt 500

# ——— C. urge check: level 2 → handled wave → home ack ————————————
clk "افحص الرغبة"; wt 1000; top; wt 300
echo "C. urge input — $(chk)"
siv "على سلم من ١ لـ ٥"; wt 300
shot 04-urge-input-390
top; wt 200
radio "شدة الرغبة" 2; radio "مدى قربك" 1; radio "فقدان السيطرة" 2
clk "اعرف أنسب خطوة"; wt 1000; top; wt 300
echo "C. level-2 result — $(chk)"
shot 05-urge-result-level2-390
clk "فحص جديد"; wt 800

# level-3 wave → intervention → handled → home ack
radio "شدة الرغبة" 3; radio "مدى قربك" 3; radio "فقدان السيطرة" 3
clk "اعرف أنسب خطوة"; wt 1000
clk "ابدأ التدخل المقترح الآن"; wt 1000
clk "تخطي إلى إعادة التقييم"; wt 800
clk "نعم، هبطت"; wt 1000
clkx "الرئيسية"; wt 1000; top; wt 300
echo "C. home after handled — $(chk)"
shot 11-home-after-handled-390

# ——— D. level-5 crisis → emergency flow → done + P1 ——————————————
nav "فحص الرغبة"; top; wt 400
radio "شدة الرغبة" 4; radio "مدى قربك" 5; radio "فقدان السيطرة" 5
clk "اعرف أنسب خطوة"; wt 1000; top; wt 300
echo "D. level-5 result — $(chk)"
shot 06-urge-result-level5-390
clk "تدخّل الآن — وضع الطوارئ"; wt 1200
echo "D. emergency step1 — $(chk)"
shot 07-emergency-step1-390
clkx "تم"; wt 900
clkx "تم"; wt 1000
echo "D. emergency step3 — $(chk)"
shot 08-emergency-step3-countdown-390
clk "تم — الخطوة التالية"; wt 1000
echo "D. emergency step4 — $(chk)"
shot 09-emergency-step4-reassess-390
clk "نعم — هبط"; wt 1200
siv "كلماتك أنت"; wt 300
echo "D. emergency done — $(chk)"
shot 10-emergency-done-why-390
clk "عودة إلى يومي"; wt 1000

# ——— E. high home + P2 entry → relapse flow → post-relapse ——————
nav "فحص الرغبة"; top; wt 400
radio "شدة الرغبة" 3; radio "مدى قربك" 4; radio "فقدان السيطرة" 4
clk "اعرف أنسب خطوة"; wt 1000
clkx "الرئيسية"; wt 1200
siv "نوقف هنا الأول"; wt 300
echo "E. high home — $(chk)"
shot 12-home-highrisk-p2-entry-390
clk "رجعت للسلوك؟ ما تكملش"; wt 1000; top; wt 300
echo "E. relapse main — $(chk)"
shot 13-relapse-stop-390
clk "رجعت للسلوك الآن"; wt 1000
echo "E. relapse stop protocol — $(chk)"
shot 14-relapse-stop-protocol-390
clk "تخطي إلى التسجيل السريع"; wt 900
clk "توقفت فورًا"; wt 300
clk "لا — أوقفت عند أولها"; wt 300
clk "حفظ ومتابعة"; wt 1200; top; wt 300
echo "E. relapse reframe — $(chk)"
shot 15-relapse-reframe-390
clk "العودة إلى يومي الطبيعي"; wt 800
clkx "الرئيسية"; wt 1000; top; wt 300
echo "E. post-relapse home — $(chk)"
shot 16-home-postrelapse-390

# ——— F. evening check-in (fill + save) ————————————————————————
clkx "الخطة"; wt 1400
clkl "ابدأ"; wt 1200; top; wt 300
echo "F. evening dialog — $(chk)"
shot 17-evening-checkin-390
radio "أعلى رغبة اليوم" 3
clk "ملل"; wt 300
clk "نعم — ونجح"; wt 300
clkx "التالي"; wt 800
fill "جملة واحدة تكفي" "المشي ١٠ دقايق قصّر الموجة فعلاً"
fill "مثال: الهاتف يبيت" "الهاتف يبيت بره الغرفة الليلة"
clkx "التالي"; wt 800
cond "كيف كان نومك الليلة الماضية؟" 4
cond "الوحدة اليوم؟" 2
cond "كم الوقت الحر غير المنظم؟" 4
clk "حفظ المراجعة"; wt 1200

# ——— G. progress insights ————————————————————————————————————
nav "التقدم"; wt 1600; top; wt 300
echo "G. progress — $(chk)"
shot 18-progress-insights-390
siv "عند درجة"; wt 400
shot 18b-progress-insight-scale-390

# ——— H. 320px set ————————————————————————————————————————————
"${AB[@]}" set viewport 320 568 >/dev/null 2>&1; wt 600
nav "فحص الرغبة"; wt 1000
# center the first 1–5 scale row (footer scroll is unreliable at 320px)
"${AB[@]}" eval "(() => { const g=document.querySelector('[role=radiogroup]'); if(!g) return 'NOGROUP'; g.scrollIntoView({block:'center'}); return 'ok'; })()" >/dev/null 2>&1
wt 400
echo "H. urge input 320 — $(chk)"
shot 19-urge-input-320
clkx "الرئيسية"; wt 1000; top; wt 300
echo "H. post-relapse home 320 — $(chk)"
shot 20-home-postrelapse-320
clkx "الخطة"; wt 1400
clkx "تعديل"; wt 1200; top; wt 300
echo "H. evening edit hydrated 320 — $(chk)"
shot 21-evening-checkin-edit-hydrated-320

# ——— wrap-up: page errors + console health —————————————————————
echo "─── page errors ───"
"${AB[@]}" errors 2>/dev/null | tail -5
echo "─── console (warnings/errors only) ───"
"${AB[@]}" console 2>/dev/null | rg -i "warn|error" | head -10 || echo "(none)"
echo "═══ done: $(ls "$OUT" | wc -l) files in $OUT ═══"
