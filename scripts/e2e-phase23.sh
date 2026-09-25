#!/bin/bash
# E2E — Phase 2C + Phase 3 (one shell invocation: server + browser + teardown)
# NOTE: agent-browser quirks handled here:
#  - `set viewport` only sticks AFTER `open` (open resets it)
#  - eval output is JSON-quoted -> strip quotes with tr -d '"'
#  - eval state persists between calls -> wrap in IIFE to avoid const redeclare
cd /home/z/my-project
PORT=3100
mkdir -p tool-results/e2e-phase23
LOG=tool-results/e2e-phase23/server.log

NODE_ENV=production PORT=$PORT bun .next/standalone/server.js > "$LOG" 2>&1 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null; true" EXIT
for i in $(seq 1 40); do
  curl -s -o /dev/null "http://localhost:$PORT" && break
  sleep 1
done
echo "server up"

PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); echo "  ✓ $1"; }
bad()  { FAIL=$((FAIL+1)); echo "  ✗ $1"; }
check(){ if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (got: $2 | want: $3)"; fi }
ev()   { agent-browser eval "$1" | tail -1 | tr -d '"'; }

SEED="localStorage.setItem('istiaada-state-v1', JSON.stringify({state:{version:1,onboardingCompleted:true,userProfile:{goals:['change'],difficultTimes:['late-night'],patterns:['aimless'],deviceNeeds:'no',buildGoals:['study'],supportPrefs:['mixed'],why:'لأجل دراستي وتركيزي',whyReasons:['study','focus']},journey:{startDate:'2026-08-01T10:00:00.000Z'},urgeChecks:[],interventionLogs:[],dailyLogs:{checkIns:[],plans:[],doseLog:[]},relapseEvents:[],preventionRules:[],supportPerson:null,settings:{dailyDoseEnabled:true,spiritualContent:false,preferredDoseTime:'morning',postRelapseSupport:true,theme:'dark',notificationsEnabled:false}},version:2}))"

goto_more(){ agent-browser find role button click --name "المزيد من الأقسام" >/dev/null 2>&1; sleep 0.5; }
open_section(){ goto_more; agent-browser find role button click --name "$1" >/dev/null 2>&1; sleep 0.9; }

agent-browser close >/dev/null 2>&1 || true
sleep 1
for i in 1 2 3; do
  agent-browser open "http://localhost:$PORT" >/dev/null 2>&1
  sleep 1.2
  URL=$(agent-browser get url 2>/dev/null | tail -1 | tr -d '"')
  echo "$URL" | grep -q "localhost:$PORT" && break
  sleep 1
done
agent-browser set viewport 390 844 >/dev/null
sleep 0.6
# guard: page must be our app before seeding
READY=$(ev "document.title.includes('استعادة') ? 'ready' : 'notready'")
if [ "$READY" != "ready" ]; then
  echo "FATAL: app page not ready"
  exit 1
fi
agent-browser eval "$SEED" >/dev/null
agent-browser reload >/dev/null
sleep 1.5

echo "== 1. Home terminology =="
TXT=$(ev "document.body.innerText.includes('حصلت زَلّة؟') ? 'yes' : 'no'")
check "QuickGuide row4 uses حصلت زَلّة؟" "$TXT" "yes"
TXT=$(ev "document.body.innerText.includes('منذ آخر تعثر') ? 'present' : 'absent'")
check "no old days-since-تعثر wording" "$TXT" "absent"
agent-browser screenshot tool-results/e2e-phase23/01-home-390.png >/dev/null

echo "== 2. Relapse flow with new 2B.2 fields =="
open_section "توقّف هنا"
TXT=$(ev "document.body.innerText.includes('سجل الزلات والانتكاسات') ? 'yes' : 'no'")
check "relapse main: log title سجل الزلات والانتكاسات" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/02-relapse-main-390.png >/dev/null
agent-browser find role button click --name "حصلت الآن — أوقفها هنا" >/dev/null 2>&1
sleep 0.6
TXT=$(ev "document.body.innerText.includes('حصلت زَلّة؟') ? 'yes' : 'no'")
check "STOP header: حصلت زَلّة؟" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/03-stop-390.png >/dev/null
# step through the 6 STOP steps (first CTA differs, then 5x تم)
agent-browser find role button click --name "أوقفت — الخطوة التالية" >/dev/null 2>&1
sleep 0.3
for i in 1 2 3 4 5; do
  agent-browser find role button click --name "تم" >/dev/null 2>&1
  sleep 0.25
done
sleep 0.7
TXT=$(ev "document.body.innerText.includes('ما السلوك الذي حدث؟') && document.body.innerText.includes('كيف تصف ما حدث؟') ? 'yes' : 'no'")
check "quick form shows behavior + classification questions" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/04-quick-form-empty-390.png >/dev/null
ENB=$(ev "(() => { const b = Array.from(document.querySelectorAll('button')).find(x=>x.textContent.trim()==='حفظ ومتابعة'); return b && b.disabled === true ? 'disabled' : 'enabled'; })()")
check "save disabled before required answers" "$ENB" "disabled"
agent-browser find role button click --name "إباحية" >/dev/null 2>&1; sleep 0.2
agent-browser find role button click --name "زَلّة" >/dev/null 2>&1; sleep 0.2
agent-browser find role button click --name "ملل" >/dev/null 2>&1; sleep 0.2
agent-browser find role button click --name "خلال دقائق" >/dev/null 2>&1; sleep 0.2
agent-browser find role button click --name "لا — أوقفت عند أولها" >/dev/null 2>&1; sleep 0.3
agent-browser screenshot tool-results/e2e-phase23/05-quick-form-filled-390.png >/dev/null
ENB=$(ev "(() => { const b = Array.from(document.querySelectorAll('button')).find(x=>x.textContent.trim()==='حفظ ومتابعة'); return b && b.disabled === false ? 'enabled' : 'disabled'; })()")
check "save enabled after required answers" "$ENB" "enabled"
agent-browser find role button click --name "حفظ ومتابعة" >/dev/null 2>&1
sleep 0.9
TXT=$(ev "document.body.innerText.includes('سجّلناها كزَلّة') ? 'yes' : 'no'")
check "reframe: سجّلناها كزَلّة (approved phrasing)" "$TXT" "yes"
TXT=$(ev "document.body.innerText.includes('بعد ما حدث: تذكير مهم') ? 'yes' : 'no'")
check "reframe title: بعد ما حدث" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/06-reframe-slip-390.png >/dev/null
CLS=$(ev "JSON.parse(localStorage.getItem('istiaada-state-v1')).state.relapseEvents[0].classification")
check "persisted classification = slip" "$CLS" "slip"
BEH=$(ev "(() => { const b = JSON.parse(localStorage.getItem('istiaada-state-v1')).state.relapseEvents[0].behaviors; return b && b.length === 1 && b[0] === 'pornography' ? 'ok' : 'bad'; })()")
check "persisted behaviors" "$BEH" "ok"
agent-browser find role button click --name "العودة إلى يومي الطبيعي" >/dev/null 2>&1
sleep 0.9
TXT=$(ev "(() => { const t = document.body.innerText; return t.includes('أوقفت عند أولها') && !t.includes('منع السقوط الثاني') ? 'yes' : 'no'; })()")
check "stat tile renamed (no منع السقوط الثاني)" "$TXT" "yes"
TXT=$(ev "document.body.innerText.includes('مراجعة زَلّة') ? 'yes' : 'no'")
check "pending review row: مراجعة زَلّة" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/07-relapse-main-with-record-390.png >/dev/null

echo "== 3. Form reset after save (fix1) =="
agent-browser find role button click --name "حصلت الآن — أوقفها هنا" >/dev/null 2>&1
sleep 0.5
agent-browser find role button click --name "تخطي إلى التسجيل السريع" >/dev/null 2>&1
sleep 0.7
ENB=$(ev "(() => { const b = Array.from(document.querySelectorAll('button')).find(x=>x.textContent.trim()==='حفظ ومتابعة'); return b && b.disabled === true ? 'fresh' : 'stale'; })()")
check "quick form reset after save (save disabled again)" "$ENB" "fresh"
SEL=$(ev "Array.from(document.querySelectorAll('button[aria-pressed]')).filter(b=>b.getAttribute('aria-pressed')==='true').length")
check "no chips carried over" "$SEL" "0"

echo "== 4. Urge -> Emergency regression (level 5 path) =="
open_section "فحص الرغبة"
sleep 0.5
for n in 1 2 3; do
  agent-browser eval "(() => { const g = document.querySelectorAll('[role=radiogroup]')[$n-1]; if (!g) return 'nogroup'; const b = Array.from(g.querySelectorAll('button')).find(x=>x.textContent.trim()==='5'); if (b) b.click(); return 'ok'; })()" >/dev/null
  sleep 0.15
done
sleep 0.3
agent-browser find role button click --name "اعرف أنسب خطوة" >/dev/null 2>&1
sleep 0.9
TXT=$(ev "(() => { const t = document.body.innerText; return t.includes('من ٥') && t.includes('أزمة') ? 'yes' : 'no'; })()")
check "result shows degree من ٥ + أزمة mode" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/08-urge-result-l5-390.png >/dev/null
agent-browser find role button click --name "تدخّل الآن — وضع الطوارئ" >/dev/null 2>&1
sleep 0.9
TXT=$(ev "document.body.innerText.includes('درجة الحالة') ? 'yes' : 'no'")
check "emergency header shows درجة الحالة" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/09-emergency-step1-390.png >/dev/null
agent-browser find role button click --name "تم" >/dev/null 2>&1; sleep 0.6
agent-browser find role button click --name "تم" >/dev/null 2>&1; sleep 0.6
agent-browser find role button click --name "تم — الخطوة التالية" >/dev/null 2>&1; sleep 0.7
agent-browser find role button click --name "نعم — هبط" >/dev/null 2>&1; sleep 0.9
TXT=$(ev "document.body.innerText.includes('هبط الخطر') ? 'yes' : 'no'")
check "emergency completion screen" "$TXT" "yes"
TXT=$(ev "document.body.innerText.includes('حصلت زَلّة؟ ما تكملش') ? 'yes' : 'no'")
check "emergency done P2 link uses حصلت زَلّة؟" "$TXT" "yes"
agent-browser find role button click --name "عودة إلى يومي" >/dev/null 2>&1
sleep 1.2
agent-browser find role button click --name "الرئيسية" >/dev/null 2>&1
sleep 1
# NOTE: an unreviewed slip was saved in section 2, so Home correctly shows the
# post-behavior banner INSTEAD of the handled ack — assert that interplay.
OUT=$(ev "(() => { const c = JSON.parse(localStorage.getItem('istiaada-state-v1')).state.urgeChecks; return c.length && c[c.length-1].outcome === 'handled' ? 'handled' : c.length ? c[c.length-1].outcome : 'none'; })()")
check "emergency closed originating check as handled" "$OUT" "handled"
TXT=$(ev "document.body.innerText.includes('بعد ما حدث') ? 'yes' : 'no'")
check "home post-behavior banner (بعد ما حدث) takes precedence" "$TXT" "yes"

echo "== 5. Knowledge: category label, search, spiritual gating, new 50 =="
open_section "قاعدة المعرفة"
sleep 1
TXT=$(ev "(() => { const chips = Array.from(document.querySelectorAll('button')).map(b=>b.textContent.trim()); return chips.some(c=>c==='الكل (143)') ? 'yes' : 'no'; })()")
check "knowledge total chip: الكل (143) — 148 minus 5 gated spiritual (OFF)" "$TXT" "yes"
TXT=$(ev "(() => { const chips = Array.from(document.querySelectorAll('button')).map(b=>b.textContent.trim()); return chips.some(c=>c==='الزلّة والانتكاسة (9)') ? 'yes' : 'no'; })()")
check "knowledge category chip: الزلّة والانتكاسة (9) — 6 old + 3 new" "$TXT" "yes"
TXT=$(ev "(() => { const chips = Array.from(document.querySelectorAll('button')).map(b=>b.textContent.trim()); return chips.some(c=>c==='تأمل روحي (0)') ? 'yes' : 'no'; })()")
check "spiritual category shows (0) when OFF" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/10-knowledge-390.png >/dev/null
# search with a diacritics-insensitive query (no shadda)
agent-browser eval "(() => { const i = document.querySelector('input[placeholder*=ابحث]'); if (!i) return 'noinput'; const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,'الزلة'); i.dispatchEvent(new Event('input',{bubbles:true})); return 'filled'; })()" >/dev/null
sleep 0.8
CNT=$(ev "Array.from(document.querySelectorAll('button.flex.flex-col')).filter(b => b.querySelector('.text-sm.leading-relaxed, p')).length")
if [ "${CNT:-0}" -gt 0 ] 2>/dev/null; then ok "search «الزلة» (no shadda) finds cards (${CNT})"; else bad "search «الزلة» found nothing"; fi
agent-browser eval "(() => { const i = document.querySelector('input[placeholder*=ابحث]'); if (i) { const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,''); i.dispatchEvent(new Event('input',{bubbles:true})); } return 'cleared'; })()" >/dev/null
sleep 0.6
agent-browser find role button click --name "الفرق بين الزَلّة والانتكاسة" >/dev/null 2>&1
sleep 0.8
TXT=$(ev "(() => { const t = document.body.innerText; return t.includes('الزَلّة واقعة واحدة محدودة') && t.includes('الانتكاسة عودة إلى النمط السابق') ? 'yes' : 'no'; })()")
check "lapse/relapse card renders native-rewritten definitions" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/11-knowledge-card-rl-390.png >/dev/null
# close the card dialog via the Radix X button (its accessible name is "Close")
agent-browser find role button click --name "Close" >/dev/null 2>&1
sleep 0.8
# open one of the NEW 50 cards (rl-first-hour = NEW-40)
agent-browser find role button click --name "الساعة الأولى بعد الزَلّة" >/dev/null 2>&1
sleep 1
TXT=$(ev "(() => { const t = document.body.innerText; return t.includes('افعل') && t.includes('الساعة الأولى لإغلاق الجرح، لا لفتح الملفات') ? 'yes' : 'no'; })()")
check "NEW-40 card (rl-first-hour) opens with native content" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/11b-knowledge-card-new50-390.png >/dev/null
agent-browser find role button click --name "Close" >/dev/null 2>&1
sleep 0.8
# new-card search: NEW-09 (رمضان)
agent-browser eval "(() => { const i = document.querySelector('input[placeholder*=ابحث]'); if (!i) return 'noinput'; const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,'رمضان'); i.dispatchEvent(new Event('input',{bubbles:true})); return 'filled'; })()" >/dev/null
sleep 0.8
CNT=$(ev "Array.from(document.querySelectorAll('button.flex.flex-col')).filter(b => b.querySelector('.text-sm.leading-relaxed, p')).length")
check "search «رمضان» finds NEW-09 card" "${CNT:-0}" "1"
agent-browser eval "(() => { const i = document.querySelector('input[placeholder*=ابحث]'); if (i) { const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,''); i.dispatchEvent(new Event('input',{bubbles:true})); } return 'cleared'; })()" >/dev/null
sleep 0.5
# spiritual ON -> 5
agent-browser eval "(() => { const s = JSON.parse(localStorage.getItem('istiaada-state-v1')); s.state.settings.spiritualContent = true; localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'on'; })()" >/dev/null
agent-browser reload >/dev/null; sleep 1.5
open_section "قاعدة المعرفة"; sleep 1
TXT=$(ev "(() => { const chips = Array.from(document.querySelectorAll('button')).map(b=>b.textContent.trim()); return chips.some(c=>c==='تأمل روحي (5)') ? 'yes' : 'no'; })()")
check "spiritual category shows (5) when ON" "$TXT" "yes"
agent-browser eval "(() => { const s = JSON.parse(localStorage.getItem('istiaada-state-v1')); s.state.settings.spiritualContent = false; localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'off'; })()" >/dev/null
agent-browser reload >/dev/null; sleep 1.5

# NEW: dose engine must serve from the 148-card pool (old or new, gated correctly)
echo "== 5b. Daily Dose serves knowledge correctly (148-card pool) =="
open_section "الجرعة اليومية"
sleep 1
TXT=$(ev "(() => { const t = document.body.innerText; return t.includes('اعرف') && t.includes('افهم') && t.includes('افعل') && t.includes('تذكّر') ? 'yes' : 'no'; })()")
check "daily dose renders a knowledge card (اعرف/افهم/افعل/تذكّر)" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/10b-dose-390.png >/dev/null

echo "== 6. Progress terminology =="
open_section "التقدم"
sleep 1
TXT=$(ev "(() => { const t = document.body.innerText; return t.includes('مراجعات متتالية') && !t.includes('سلسلة المراجعات') ? 'yes' : 'no'; })()")
check "progress: مراجعات متتالية (no سلسلة المراجعات)" "$TXT" "yes"
TXT=$(ev "(() => { const t = document.body.innerText; return t.includes('أوقفت عند أولها') && !t.includes('منع السقوط الثاني') ? 'yes' : 'no'; })()")
check "progress: أوقفت عند أولها (no منع السقوط الثاني)" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/12-progress-390.png >/dev/null

echo "== 7. Backup import round-trip with new fields =="
# prepare the backup payload INSIDE the page (no shell quoting round-trip)
agent-browser eval "(() => { const s = JSON.parse(localStorage.getItem('istiaada-state-v1')).state; window.__BACKUP__ = JSON.stringify({app:'istiaada',schemaVersion:1,appVersion:'2.3.0',exportedAt:new Date().toISOString(),data:{...s,relapseEvents:[{id:'rel-e2e',ts:new Date().toISOString(),timeToStop:'minutes',continued:false,triggers:['boredom'],reviewed:false,classification:'relapse',behaviors:['pornography','masturbation']}]}}); return 'prepared'; })()" >/dev/null
open_section "الإعدادات"
sleep 0.8
agent-browser find role button click --name "استيراد / استعادة" >/dev/null 2>&1
sleep 0.6
agent-browser find role button click --name "أو الصق محتوى النسخة يدويًا" >/dev/null 2>&1
sleep 0.5
agent-browser eval "(() => { const ta = document.querySelector('textarea[dir=ltr]'); if (!ta) return 'nota'; const s = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value').set; s.call(ta, window.__BACKUP__); ta.dispatchEvent(new Event('input',{bubbles:true})); return 'pasted'; })()" >/dev/null
sleep 0.8
TXT=$(ev "document.body.innerText.includes('زلات وانتكاسات مسجلة: 1') ? 'yes' : 'no'")
check "restore preview shows زلات وانتكاسات: 1" "$TXT" "yes"
agent-browser screenshot tool-results/e2e-phase23/13-restore-preview-390.png >/dev/null
agent-browser find role button click --name "استعادة النسخة الاحتياطية" >/dev/null 2>&1
sleep 0.6
agent-browser find role button click --name "نعم، استعِد النسخة" >/dev/null 2>&1
sleep 1
TXT=$(ev "document.body.innerText.includes('تمت الاستعادة بنجاح') ? 'yes' : 'no'")
check "restore success banner" "$TXT" "yes"
CLS=$(ev "JSON.parse(localStorage.getItem('istiaada-state-v1')).state.relapseEvents[0].classification")
check "imported classification = relapse" "$CLS" "relapse"
BEH=$(ev "(() => { const b = JSON.parse(localStorage.getItem('istiaada-state-v1')).state.relapseEvents[0].behaviors; return b && b.length === 2 && b.includes('pornography') && b.includes('masturbation') ? 'ok' : 'bad'; })()")
check "imported behaviors both" "$BEH" "ok"
agent-browser screenshot tool-results/e2e-phase23/14-restore-success-390.png >/dev/null

echo "== 8. Console/page errors =="
ERRS=$(agent-browser errors 2>/dev/null | grep -vc '^$' || true)
check "zero page errors" "${ERRS:-0}" "0"

echo "== 9. Visual QA — viewports =="
for VP in "320 568" "360 640" "1280 800"; do
  set -- $VP
  agent-browser set viewport $1 $2 >/dev/null; sleep 0.5
  open_section "توقّف هنا"; sleep 0.6
  agent-browser screenshot "tool-results/e2e-phase23/15-relapse-$1.png" >/dev/null
done
bash scripts/mobile-sweep.sh 2>/dev/null | tee tool-results/e2e-phase23/mobile-sweep.txt

echo ""
echo "E2E RESULT: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
