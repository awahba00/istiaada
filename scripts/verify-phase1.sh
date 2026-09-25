#!/usr/bin/env bash
# ============================================================================
# verify-phase1.sh (v3) — Phase 1 (Experience & UX Cleanup) live regression,
# against the PRODUCTION standalone build on :3100.
#
# Navigation note: agent-browser `find` is unreliable for the bottom nav and
# the bottom sheet (stale a11y snapshot / covered-element checks), so ALL
# navigation here is eval-based with a visibility filter — the pattern proven
# in verify-brand.sh.
#
# Covers:
#   1. Daily Dose: complete → card content STAYS (logged item), banner shows,
#      persists across reload, Home card matches, skip state legible,
#      next-day fresh selection, Arabic (non-Latin) date in "جرعات سابقة".
#   2. Spiritual gate: chip hidden/shown in Knowledge, Settings ON note,
#      Values practices, onboarding "تأمل قيمي وروحي" wires the toggle ON.
#   3. Typography: emergency nav label 11px, emergency instructions 16px,
#      solid إذا/إذن badges.
#   4. Mobile sweep 11 screens × 320/360/390 (eval-based navigation).
#   5. Zero console errors.
# ============================================================================
set -uo pipefail
PORT=3100
BASE="http://localhost:$PORT"
OUT=/home/z/my-project/tool-results/phase1
AB=(agent-browser --session p1)
cd /home/z/my-project
mkdir -p "$OUT"

shot() { "${AB[@]}" screenshot "$OUT/$1.png" >/dev/null 2>&1; echo "  📸 $1"; }
wt()   { sleep "$1"; }
clk() { # click first VISIBLE button whose textContent includes $1
  local r
  r=$("${AB[@]}" eval "(() => { const t='$1'; const b=[...document.querySelectorAll('button,[role=button],a')].filter(x=>x.getClientRects().length&&x.textContent).find(x=>x.textContent.includes(t)); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ clk FAILED [$1] → $r"
}
ev() {
  local r; r=$("${AB[@]}" eval "$1" 2>/dev/null | tail -1); r=${r//\"/}; echo "$r"
}
ovf() {
  "${AB[@]}" eval "document.documentElement.scrollWidth > document.documentElement.clientWidth ? 'OVF:' + document.documentElement.scrollWidth : 'ok'" 2>/dev/null | tail -1
}
doseTitle() {
  ev "[...document.querySelectorAll('main .truncate')].map(e=>e.textContent.trim())[0] || 'NONE'"
}
# open the mobile "more" sheet and click a section inside it (eval-based)
goSection() {
  "${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length&&x.textContent.trim()==='المزيد'); if(!b.length) return 'NOTFOUND'; b[0].click(); return 'ok'; })()" >/dev/null 2>&1
  wt 1
  "${AB[@]}" eval "(() => { const t='$1'; const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; if(!d) return 'NO-SHEET'; const b=[...d.querySelectorAll('button')].find(x=>x.textContent.includes(t)); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()" >/dev/null 2>&1
  wt 1.5
}
# click a bottom-nav tab by exact label (الرئيسية / الجرعة / الخطة)
goTab() {
  "${AB[@]}" eval "(() => { const t='$1'; const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length&&x.textContent.trim()===t); if(!b.length) return 'NOTFOUND'; b[0].click(); return 'ok'; })()" >/dev/null 2>&1
  wt 1.3
}

# ——— start production standalone server ———
lsof -t -i :$PORT 2>/dev/null | xargs -r kill 2>/dev/null; sleep 0.5
PORT=$PORT bun .next/standalone/server.js > /tmp/p1-server.log 2>&1 &
SRV=$!
for i in $(seq 1 60); do curl -sf "$BASE" -o /dev/null && break; sleep 0.5; done
echo "═══ server up on :$PORT ═══"

"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
"${AB[@]}" storage local clear >/dev/null 2>&1

# ═══════════════ 1. DAILY DOSE ═══════════════
echo "— 1. Daily Dose —"
SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5

goTab "الجرعة"
T1=$(doseTitle)
echo "  selected dose: $T1"
shot 01-dose-before-complete

clk "تمت الجرعة"; wt 1
T2=$(doseTitle)
echo "  after تمت: title unchanged → $([[ "$T1" == "$T2" ]] && echo YES || echo "NO (got: $T2)")"
echo "  banner: $(ev "document.body.innerText.includes('أنجزت جرعة اليوم') ? 'yes' : 'NO'")"
echo "  buttons gone: $(ev "[...document.querySelectorAll('button')].some(b=>b.textContent.includes('تمت الجرعة')||b.textContent.includes('تخطي اليوم')) ? 'NO-still-there' : 'yes'")"
shot 02-dose-after-complete

"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
goTab "الجرعة"
T3=$(doseTitle)
echo "  after reload: title unchanged → $([[ "$T1" == "$T3" ]] && echo YES || echo "NO (got: $T3)")"
echo "  after reload banner: $(ev "document.body.innerText.includes('أنجزت جرعة اليوم') ? 'yes' : 'NO'")"
echo "  doseLog today done: $(ev "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const e=(s.state.dailyLogs.doseLog||[]).find(d=>d.date===new Date().toISOString().slice(0,10)); return e && e.status==='done' ? 'yes' : 'NO'; })()")"
shot 03-dose-after-reload

goTab "الرئيسية"
echo "  home shows same title: $(ev "document.body.innerText.includes('$T1') ? 'yes' : 'NO'")"
echo "  home badge: $(ev "document.body.innerText.includes('أُنجزت اليوم') ? 'yes' : 'NO'")"
echo "  home CTA: $(ev "[...document.querySelectorAll('button')].some(b=>b.textContent.includes('اعرض الجرعة كاملة')) ? 'yes' : 'NO'")"
shot 04-home-after-complete

# skip state legibility (mutate today's entry → skipped)
"${AB[@]}" eval "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const t=new Date().toISOString().slice(0,10); s.state.dailyLogs.doseLog=s.state.dailyLogs.doseLog.map(d=>d.date===t?{...d,status:'skipped'}:d); localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
goTab "الجرعة"
T4=$(doseTitle)
echo "  skipped: title unchanged → $([[ "$T1" == "$T4" ]] && echo YES || echo "NO")"
echo "  skip badge: $(ev "document.body.innerText.includes('مُخطاة اليوم') ? 'yes' : 'NO'")"
echo "  skip note: $(ev "document.body.innerText.includes('خطّيت جرعة اليوم') ? 'yes' : 'NO'")"
echo "  can still complete: $(ev "[...document.querySelectorAll('button')].some(b=>b.textContent.includes('تمت الجرعة')) ? 'yes' : 'NO'")"
shot 05-dose-skipped

# next-day behavior (move entry to yesterday → fresh selection, no banner)
"${AB[@]}" eval "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const t=new Date().toISOString().slice(0,10); const y=new Date(Date.now()-86400000).toISOString().slice(0,10); s.state.dailyLogs.doseLog=s.state.dailyLogs.doseLog.map(d=>d.date===t?{...d,date:y}:d); localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
goTab "الجرعة"
echo "  next-day fresh dose (buttons back): $(ev "[...document.querySelectorAll('button')].some(b=>b.textContent.includes('تمت الجرعة')) ? 'yes' : 'NO'")"
echo "  next-day no stale banner: $(ev "document.body.innerText.includes('أنجزت جرعة اليوم') ? 'NO-stale' : 'yes'")"
echo "  recent list Arabic date: $(ev "(() => { const txt=document.body.innerText; const hasRecent=txt.includes('جرعات سابقة'); const arabic=txt.split('').some(ch=>{const c=ch.charCodeAt(0); return c>=0x0660&&c<=0x0669;}); const latinDate=/20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]/.test(txt); return hasRecent ? (arabic&&!latinDate ? 'yes' : 'NO arabic='+arabic+' latin='+latinDate) : 'NO-LIST'; })()")"
shot 06-dose-nextday-fresh

# ═══════════════ 2. SPIRITUAL GATE ═══════════════
echo "— 2. Spiritual gate —"
"${AB[@]}" storage local clear >/dev/null 2>&1
SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5

goSection "قاعدة المعرفة"
echo "  OFF: spiritual chip hidden → $(ev "document.body.innerText.includes('تأمل روحي') ? 'NO-still-there' : 'yes'")"
echo "  OFF: total count → $(ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('الكل (')); return b?b.textContent.trim():'NOTFOUND'; })()")"
shot 07-knowledge-off

goSection "الإعدادات"
"${AB[@]}" eval "(() => { const l=[...document.querySelectorAll('label')].find(x=>x.textContent.includes('المحتوى الروحي/القيمي')); if(!l) return 'NOTFOUND'; l.querySelector('input').click(); return 'ok'; })()" >/dev/null 2>&1
wt 0.8
echo "  ON: settings note → $(ev "document.body.innerText.includes('يظهر الآن') ? 'yes' : 'NO'")"
shot 08-settings-spiritual-on

goSection "قاعدة المعرفة"
echo "  ON: spiritual chip → $(ev "document.body.innerText.includes('تأمل روحي') ? 'yes' : 'NO'")"
echo "  ON: chip label → $(ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('تأمل روحي')); return b?b.textContent.trim():'NOTFOUND'; })()")"
echo "  ON: total count → $(ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('الكل (')); return b?b.textContent.trim():'NOTFOUND'; })()")"
shot 09-knowledge-on

goSection "القيم والروحانيات"
echo "  ON: values practices → $(ev "document.body.innerText.includes('وضوء + ركعتان') ? 'yes' : 'NO'")"
shot 10-values-practices

goSection "الإعدادات"
"${AB[@]}" eval "(() => { const l=[...document.querySelectorAll('label')].find(x=>x.textContent.includes('المحتوى الروحي/القيمي')); if(!l) return 'NOTFOUND'; l.querySelector('input').click(); return 'ok'; })()" >/dev/null 2>&1
wt 0.8
goSection "قاعدة المعرفة"
echo "  OFF again: chip hidden → $(ev "document.body.innerText.includes('تأمل روحي') ? 'NO-still-there' : 'yes'")"

# onboarding wiring: choose "تأمل قيمي وروحي" → gate ON
echo "— 2b. onboarding wiring —"
"${AB[@]}" storage local clear >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
clk "ابدأ كمستخدم جديد"; wt 1
clk "أريد فهم محفزاتي"; wt 0.4; clk "التالي"; wt 0.8
clk "الملل"; wt 0.4; clk "التالي"; wt 0.8
clk "تصفح بلا هدف"; wt 0.4; clk "التالي"; wt 0.8
clk "التالي"; wt 0.8
clk "الصحة البدنية"; wt 0.4; clk "التالي"; wt 0.8
clk "تأمل قيمي وروحي"; wt 0.4; clk "التالي"; wt 0.8
clk "التالي"; wt 0.8
clk "ابدأ رحلتي"; wt 2.5
echo "  onboarding → spiritualContent: $(ev "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); return String(s.state.settings.spiritualContent); })()")"
goSection "قاعدة المعرفة"
echo "  fresh user: spiritual chip → $(ev "document.body.innerText.includes('تأمل روحي') ? 'yes' : 'NO'")"
shot 11-onboarding-wired

# ═══════════════ 3. TYPOGRAPHY ═══════════════
echo "— 3. Typography —"
"${AB[@]}" storage local clear >/dev/null 2>&1
SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
echo "  emergency nav label font-size → $(ev "(() => { const s=[...document.querySelectorAll('nav span')].find(x=>x.textContent.trim()==='تدخّل الآن'); return s?getComputedStyle(s).fontSize:'NOTFOUND'; })()")"

# emergency step 3 instructions at 16px, then exit through the real flow
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('nav button')].find(x=>(x.getAttribute('aria-label')||'').includes('تدخل الآن')); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()" >/dev/null 2>&1
wt 1.2
clk "تم"; wt 1
clk "تم"; wt 1.2
echo "  emergency instructions font-size → $(ev "(() => { const li=document.querySelector('ol li'); return li?getComputedStyle(li).fontSize:'NOTFOUND'; })()")"
shot 12-emergency-step3-instructions
clk "تم — الخطوة التالية"; wt 1
clk "نعم — هبط"; wt 1
clk "عودة إلى يومي"; wt 1.5
echo "  back on home after emergency exit → $(ev "document.body.innerText.includes('دليلك السريع') ? 'yes' : 'NO'")"

goSection "خطة الوقاية"
echo "  إذا badge bg (solid, no alpha) → $(ev "(() => { const s=[...document.querySelectorAll('span')].find(x=>x.textContent.trim()==='إذا'); if(!s) return 'NOTFOUND'; const bg=getComputedStyle(s).backgroundColor; return bg.includes('/') ? 'ALPHA:'+bg : bg; })()")"
echo "  إذن badge bg (solid, no alpha) → $(ev "(() => { const s=[...document.querySelectorAll('span')].find(x=>x.textContent.trim()==='إذن'); if(!s) return 'NOTFOUND'; const bg=getComputedStyle(s).backgroundColor; return bg.includes('/') ? 'ALPHA:'+bg : bg; })()")"
shot 13-prevention-badges

# ═══════════════ 4. MOBILE SWEEP (eval-based navigation) ═══════════════
echo "— 4. mobile sweep (11 screens × 320/360/390) —"
declare -a TABS=("الرئيسية" "الجرعة" "الخطة")
declare -a SHEETS=("فحص الرغبة" "توقّف هنا" "الإعدادات" "القيم والروحانيات" "قاعدة المعرفة" "التقدم" "خريطة المحفزات" "خطة الوقاية")
for VP in "320 568" "360 640" "390 844"; do
  set -- $VP
  "${AB[@]}" set viewport $1 $2 > /dev/null 2>&1
  wt 0.5
  RESULT=""
  for L in "${TABS[@]}"; do
    goTab "$L"
    "${AB[@]}" eval "window.scrollTo(0,0)" > /dev/null 2>&1
    RESULT="$RESULT | $L=$(ovf)"
  done
  for L in "${SHEETS[@]}"; do
    goSection "$L"
    "${AB[@]}" eval "window.scrollTo(0,0)" > /dev/null 2>&1
    RESULT="$RESULT | $L=$(ovf)"
  done
  echo "=== ${1}x${2} ===$RESULT"
done

# ═══════════════ 5. CONSOLE ═══════════════
echo "— 5. console —"
"${AB[@]}" console 2>/dev/null | grep -ci "error" | sed 's/^/  error lines: /'

kill $SRV 2>/dev/null
echo "═══ done ═══"
