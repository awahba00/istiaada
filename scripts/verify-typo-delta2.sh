#!/usr/bin/env bash
# Round 2: urge flow via More sheet, non-maximum emergency (level 3 via urge
# handoff) for PersonalWhy, STOP steps via sheet, and the always-on SOS
# header level display (pre-existing 7-of-5 finding, report-only).
set -uo pipefail
PORT=3100
BASE="http://localhost:$PORT"
OUT=/home/z/my-project/tool-results/phase1-delta
AB=(agent-browser --session p1d2)
cd /home/z/my-project
wt() { sleep "$1"; }
ev() { local r; r=$("${AB[@]}" eval "$1" 2>/dev/null | tail -1); r=${r//\"/}; echo "$r"; }

lsof -t -i :$PORT 2>/dev/null | xargs -r kill 2>/dev/null; sleep 0.5
PORT=$PORT bun .next/standalone/server.js > /tmp/p1d2-server.log 2>&1 &
SRV=$!
for i in $(seq 1 60); do curl -sf "$BASE" -o /dev/null && break; sleep 0.5; done
echo "═══ server up ═══"

"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
"${AB[@]}" storage local clear >/dev/null 2>&1
SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5

nav() { "${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length&&x.textContent.trim()==='$1'); if(b.length){b[0].click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; }
viaSheet() { nav "المزيد"; wt 1; "${AB[@]}" eval "(() => { const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; const b=[...d.querySelectorAll('button')].find(x=>x.textContent.includes('$1')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; }
fs() { ev "(() => { const el=$1; if(!el) return 'NOTFOUND'; return getComputedStyle(el).fontSize; })()"; }

# ——— 1. Urge flow (level 3 → interrupt) ———
viaSheet "فحص الرغبة"; wt 1.5
echo "1. URGE  screen opened:                $(ev "document.body.innerText.includes('فحص الرغبة') && document.body.innerText.includes('شدة الرغبة') ? 'yes' : 'NO'")"
"${AB[@]}" eval "(() => { const gs=[...document.querySelectorAll('[role=radiogroup]')]; let n=0; for(const g of gs){ const b=[...g.querySelectorAll('button')].find(x=>x.textContent.trim()==='3'); if(b){ b.click(); n++; } } return n; })()" >/dev/null 2>&1; wt 0.5
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('اعرف أنسب خطوة')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.5
echo "1. URGE  result phase reached:         $(ev "document.body.innerText.includes('درجة حالتك الآن') ? 'yes' : 'NO'")"
echo "1. URGE  risk-level description:       $(fs "[...document.querySelectorAll('.rounded-3xl p.leading-relaxed')][0]")"
echo "1. URGE  interrupt InfoNote:           $(fs "document.querySelector('[class*=\"border-warning/30\"]')")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('صوت التفاوض')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 0.6
echo "1. URGE  anti-rat response:            $(fs "[...document.querySelectorAll('div')].find(d=>d.className.includes('mt-1 text-base font-medium leading-relaxed'))")"
echo "1. URGE  anti-rat pattern (kept 14px): $(fs "[...document.querySelectorAll('div')].find(d=>d.className==='font-medium text-muted-foreground')")"
echo "1. URGE  early-warning list (kept 14): $(ev "'none'" )" >/dev/null 2>&1
"${AB[@]}" screenshot "$OUT/02-urge-result.png" >/dev/null 2>&1

# ——— 2. InterventionCard instructions (urge → intervention phase) ———
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('ابدأ التدخل المقترح')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.5
echo "2. IVCRD phase reached:                $(ev "document.body.innerText.includes('نفّذ التدخل') ? 'yes' : 'NO'")"
echo "2. IVCRD instruction steps:            $(fs "[...document.querySelectorAll('ol li')].find(li=>li.className.includes('text-base leading-relaxed'))")"
echo "2. IVCRD whyItHelps (kept 14px):       $(fs "[...document.querySelectorAll('details p')].find(p=>p.className.includes('text-sm leading-relaxed text-muted'))")"
echo "2. IVCRD nextAction (kept 12px):       $(fs "[...document.querySelectorAll('p')].find(p=>p.className.includes('text-center text-xs') && p.textContent.includes('الخطوة التالية'))")"
"${AB[@]}" screenshot "$OUT/03-intervention-card.png" >/dev/null 2>&1

# ——— 3. Non-maximum emergency via urge handoff (level 3) ———
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
viaSheet "فحص الرغبة"; wt 1.5
"${AB[@]}" eval "(() => { const gs=[...document.querySelectorAll('[role=radiogroup]')]; for(const g of gs){ const b=[...g.querySelectorAll('button')].find(x=>x.textContent.trim()==='4'); if(b) b.click(); } return 'ok'; })()" >/dev/null 2>&1; wt 0.5
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('اعرف أنسب خطوة')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.5
echo "3. EMER  level-4 result reached:       $(ev "document.body.innerText.includes('درجة حالتك الآن') ? 'yes' : 'NO'")"
echo "3. URGE  immediate InfoNote:           $(fs "document.querySelector('[class*=\"border-warning/30\"]')")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('ابدأ وضع الطوارئ بدلًا منه')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.5
echo "3. EMER  overlay opened:               $(ev "document.body.innerText.includes('تدخّل الآن') && document.body.innerText.includes('نفّذ الخطوة الحالية') ? 'yes' : 'NO'")"
echo "3. EMER  standing instruction:         $(fs "[...document.querySelectorAll('p')].find(p=>p.textContent.includes('ما تحللش دلوقتي'))")"
echo "3. EMER  header degree line:           $(ev "(() => { const d=[...document.querySelectorAll('div')].find(x=>x.textContent.trim().startsWith('درجة الحالة')); return d ? d.textContent.trim() : 'NOTFOUND'; })()")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='تم'); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='تم'); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2
echo "3. EMER  step-3 instructions:          $(fs "[...document.querySelectorAll('ol li')].find(li=>li.className.includes('text-base leading-relaxed'))")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('تم — الخطوة التالية')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2
echo "3. EMER  reassess reached:             $(ev "document.body.innerText.includes('هبط الخطر؟') ? 'yes' : 'NO'")"
echo "3. EMER  PersonalWhy (reassess):       $(fs "[...document.querySelectorAll('p')].find(p=>p.className.includes('text-base font-semibold leading-relaxed'))")"
"${AB[@]}" screenshot "$OUT/04-emergency-reassess-why.png" >/dev/null 2>&1
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('نعم — هبط')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2
echo "3. EMER  done + why on done screen:    $(fs "[...document.querySelectorAll('p')].find(p=>p.className.includes('text-base font-semibold leading-relaxed'))")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('عودة إلى يومي')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1

# ——— 4. STOP steps (relapse via sheet) ———
viaSheet "توقّف هنا"; wt 1.5
echo "4. STOP  relapse screen reached:       $(ev "document.body.innerText.includes('توقّف هنا') && document.body.innerText.includes('رجعت للسلوك الآن') ? 'yes' : 'NO'")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('رجعت للسلوك الآن')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1
echo "4. STOP  stop flow reached:            $(ev "document.body.innerText.includes('ما تكملش') ? 'yes' : 'NO'")"
echo "4. STOP  six stop steps:               $(fs "[...document.querySelectorAll('span')].find(s=>s.className.includes('text-base font-medium leading-relaxed'))")"
"${AB[@]}" screenshot "$OUT/05-stop-steps.png" >/dev/null 2>&1

# ——— 5. Always-on SOS header (bottom-nav center + more sheet) ———
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('nav button')].find(x=>x.getClientRects().length&&x.getAttribute('aria-label')&&x.getAttribute('aria-label').includes('وضع الطوارئ')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.5
echo "5. SOS   bottom-nav degree line:       $(ev "(() => { const d=[...document.querySelectorAll('div')].find(x=>x.textContent.trim().startsWith('درجة الحالة')); return d ? d.textContent.trim() : 'NOTFOUND'; })()")"
"${AB[@]}" screenshot "$OUT/08-sos-center-level.png" >/dev/null 2>&1
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('خروج من وضع الطوارئ')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1

# ——— 6. Dose deep body (if today's seeded dose has one) ———
nav "الجرعة"; wt 1.5
echo "6. DOSE  deep present:                 $(ev "document.body.innerText.includes('قراءة أعمق') ? 'yes' : 'absent (seed dose has no deep)'")"
echo "6. DOSE  deep body (kept 14px):        $(fs "[...document.querySelectorAll('details p')].find(p=>p.textContent.length>40)")"

kill $SRV 2>/dev/null
echo "═══ done ═══"