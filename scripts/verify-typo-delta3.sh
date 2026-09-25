#!/usr/bin/env bash
# Round 3: onboarding wizard walkthrough — (a) step-7 plan summary reads at
# 16px; (b) choosing «تأمل قيمي وروحي» at step 5 opens the spiritual gate
# (settings.spiritualContent === true after finishing).
set -uo pipefail
PORT=3100
BASE="http://localhost:$PORT"
OUT=/home/z/my-project/tool-results/phase1-delta
AB=(agent-browser --session p1d3)
cd /home/z/my-project
wt() { sleep "$1"; }
ev() { local r; r=$("${AB[@]}" eval "$1" 2>/dev/null | tail -1); r=${r//\"/}; echo "$r"; }

lsof -t -i :$PORT 2>/dev/null | xargs -r kill 2>/dev/null; sleep 0.5
PORT=$PORT bun .next/standalone/server.js > /tmp/p1d3-server.log 2>&1 &
SRV=$!
for i in $(seq 1 60); do curl -sf "$BASE" -o /dev/null && break; sleep 0.5; done
echo "═══ server up ═══"

"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
"${AB[@]}" storage local clear >/dev/null 2>&1
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5

next() { "${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='التالي' && x.getClientRects().length && !x.disabled); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2; }
firstChip() { "${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-pressed')==='false' && x.className.includes('rounded-full') && x.getClientRects().length); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 0.4; }

# welcome → wizard
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('ابدأ كمستخدم جديد')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2
echo "0. wizard step 0 reached:            $(ev "document.body.innerText.includes('لماذا تستخدم التطبيق؟') ? 'yes' : 'NO'")"
firstChip; next   # step 0 goals
firstChip; next   # step 1 difficult times
firstChip; next   # step 2 patterns
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('أحيانًا') && x.getClientRects().length); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 0.5; next  # step 3 device
firstChip; next   # step 4 build goals
# step 5 support prefs — choose the spiritual option deliberately
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('تأمل قيمي وروحي') && x.getClientRects().length); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 0.5
echo "5. spiritual pref selected:          $(ev "document.body.innerText.includes('أي نوع من الدعم تفضل؟') ? 'on step 5' : 'NOTFOUND'")"
next             # step 5 → 6
next             # step 6 (why optional) → 7
echo "7. summary step reached:             $(ev "document.body.innerText.includes('جهّزنا خطتك الأولى') ? 'yes' : 'NO'")"
echo "7. plan summary card size:           $(ev "(() => { const c=[...document.querySelectorAll('div')].find(d=>d.className.includes('rounded-2xl border border-border bg-card') && d.textContent.includes('سياقات الخطر')); if(!c) return 'NOTFOUND'; return getComputedStyle(c).fontSize; })()")"
echo "7. summary line (inherit check):     $(ev "(() => { const sp=[...document.querySelectorAll('span')].find(s=>s.textContent.includes('خطة الاستجابة')); if(!sp) return 'NOTFOUND'; return getComputedStyle(sp).fontSize; })()")"
"${AB[@]}" screenshot "$OUT/09-onboarding-summary.png" >/dev/null 2>&1
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('ابدأ رحلتي')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 2
echo "8. home reached after finish:        $(ev "document.body.innerText.includes('دليلك السريع') || document.querySelector('nav') ? 'yes' : 'NO'")"
echo "8. spiritual gate after onboarding:  $(ev "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); return s.state.settings.spiritualContent === true ? 'true ✓ (gate opened by opt-in)' : String(s.state.settings.spiritualContent); })()")"

kill $SRV 2>/dev/null
echo "═══ done ═══"