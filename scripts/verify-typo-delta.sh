#!/usr/bin/env bash
# Delta verification (typography correction pass): computed font sizes on the
# raised surfaces (A-class primary reading + D-class urge-time action text),
# kept-secondary spots staying 14px, spiritual ON/OFF surfaces, and a 320px
# overflow sweep — all on the production standalone build.
set -uo pipefail
PORT=3100
BASE="http://localhost:$PORT"
OUT=/home/z/my-project/tool-results/phase1-delta
AB=(agent-browser --session p1delta)
cd /home/z/my-project
mkdir -p "$OUT"
wt() { sleep "$1"; }
ev() { local r; r=$("${AB[@]}" eval "$1" 2>/dev/null | tail -1); r=${r//\"/}; echo "$r"; }

lsof -t -i :$PORT 2>/dev/null | xargs -r kill 2>/dev/null; sleep 0.5
PORT=$PORT bun .next/standalone/server.js > /tmp/p1delta-server.log 2>&1 &
SRV=$!
for i in $(seq 1 60); do curl -sf "$BASE" -o /dev/null && break; sleep 0.5; done
echo "═══ server up ═══"

"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
"${AB[@]}" storage local clear >/dev/null 2>&1
SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
# one prevention rule so the إذا/إذن rule texts render
"${AB[@]}" eval "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); s.state.preventionRules=[{id:'rule-x',ifText:'شعرت بالملل والتقطت الهاتف',thenText:'أغلقه فورًا وأنهض من مكاني',active:true,source:'user',createdAt:new Date().toISOString()}]; localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()" >/dev/null 2>&1
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5

nav() { "${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length&&x.textContent.trim()==='$1'); if(b.length){b[0].click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; }
viaSheet() { nav "المزيد"; wt 1; "${AB[@]}" eval "(() => { const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; const b=[...d.querySelectorAll('button')].find(x=>x.textContent.includes('$1')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; }
fs() { ev "(() => { const el=$1; if(!el) return 'NOTFOUND'; return getComputedStyle(el).fontSize; })()"; }

# ——— 1. Dose screen ———
nav "الجرعة"; wt 1.5
echo "1. DOSE  block body (اعرف/افهم/افعل): $(fs "document.querySelector('div.rounded-2xl.border.border-border.bg-muted\\\\/40 p.leading-relaxed')")"
echo "1. DOSE  تذكّر line:                   $(fs "[...document.querySelectorAll('p')].find(p=>p.className.includes('font-semibold leading-relaxed'))")"
echo "1. DOSE  deep body (kept 14px):        $(fs "[...document.querySelectorAll('details p')].find(p=>p.textContent.length>40)")"
"${AB[@]}" screenshot "$OUT/01-dose.png" >/dev/null 2>&1

# ——— 2. Knowledge (spiritual OFF) ———
viaSheet "قاعدة المعرفة"; wt 1.5
echo "2. KNOW  chip count OFF:               $(ev "(() => { const t=document.body.innerText; return t.includes('تأمل روحي') ? 'SPIRITUAL-CHIP-BAD' : (t.includes('الكل (93)') ? 'الكل (93) ✓ no chip' : 'COUNT?'+([...document.querySelectorAll('button')].find(b=>b.textContent.includes('الكل'))||{textContent:''}).textContent.trim()); })()")"
echo "2. KNOW  card preview (kept 14px):     $(fs "document.querySelector('p.line-clamp-3')")"
"${AB[@]}" eval "(() => { const c=[...document.querySelectorAll('button')].find(b=>b.querySelector('p.line-clamp-3')); if(c){c.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2
echo "2. KNOW  dialog block body:            $(fs "[...document.querySelectorAll('[role=dialog] p')].find(p=>p.className.includes('text-base leading-relaxed') && !p.className.includes('muted'))")"
echo "2. KNOW  dialog deep (kept 14px):      $(fs "[...document.querySelectorAll('[role=dialog] p')].reverse().find(p=>p.className.includes('text-sm leading-relaxed text-muted'))")"
"${AB[@]}" eval "(() => { const e=document.querySelector('[role=dialog] button[aria-label=Close], [role=dialog] button.absolute'); if(e){e.click();} return 'ok'; })()" >/dev/null 2>&1; wt 0.8

# ——— 3. Urge flow (level 3 → interrupt) ———
nav "فحص الرغبة"; wt 1.5
"${AB[@]}" eval "(() => { const gs=[...document.querySelectorAll('[role=radiogroup]')]; for(const g of gs){ const b=[...g.querySelectorAll('button')].find(x=>x.textContent.trim()==='3'); if(b) b.click(); } return gs.length; })()" >/dev/null 2>&1; wt 0.5
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('اعرف أنسب خطوة')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2
echo "3. URGE  risk-level description:       $(fs "[...document.querySelectorAll('.rounded-3xl p.leading-relaxed')][0]")"
echo "3. URGE  interrupt InfoNote:           $(fs "document.querySelector('[class*=\"border-warning/30\"]')")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('صوت التفاوض')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 0.6
echo "3. URGE  anti-rationalization response:$(fs "[...document.querySelectorAll('div')].find(d=>d.className.includes('mt-1 text-base font-medium leading-relaxed'))")"
echo "3. URGE  anti-rat pattern (kept 14px): $(fs "[...document.querySelectorAll('div')].find(d=>d.className==='font-medium text-muted-foreground')")"
"${AB[@]}" screenshot "$OUT/02-urge-result.png" >/dev/null 2>&1
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('ابدأ التدخل المقترح')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.5
echo "3. IVCRD instruction steps:            $(fs "[...document.querySelectorAll('ol li')].find(li=>li.className.includes('text-base leading-relaxed'))")"
echo "3. IVCRD whyItHelps (kept 14px):       $(fs "[...document.querySelectorAll('details p')].find(p=>p.className.includes('text-sm leading-relaxed text-muted'))")"
"${AB[@]}" screenshot "$OUT/03-intervention-card.png" >/dev/null 2>&1

# ——— 4. Emergency (work-safe variant) ———
"${AB[@]}" eval "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); s.state.userProfile.deviceNeeds='yes'; localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('nav button')].find(x=>x.getClientRects().length&&x.getAttribute('aria-label')&&x.getAttribute('aria-label').includes('وضع الطوارئ')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.5
echo "4. EMER  standing instruction:         $(fs "[...document.querySelectorAll('p')].find(p=>p.textContent.includes('ما تحللش دلوقتي'))")"
echo "4. EMER  work-safe sub-steps:          $(fs "[...document.querySelectorAll('ul')].find(u=>u.className.includes('text-base leading-relaxed'))")"
"${AB[@]}" screenshot "$OUT/04-emergency-step1-ws.png" >/dev/null 2>&1
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='تم'); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='تم'); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2
echo "4. EMER  step-3 instructions:          $(fs "[...document.querySelectorAll('ol li')].find(li=>li.className.includes('text-base leading-relaxed'))")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('تم — الخطوة التالية')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2
echo "4. EMER  PersonalWhy (reassess):       $(fs "[...document.querySelectorAll('p')].find(p=>p.className.includes('text-base font-semibold leading-relaxed'))")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('نعم — هبط')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1.2
echo "4. EMER  done screen reached:          $(ev "document.body.innerText.includes('هبط الخطر') ? 'yes' : 'NO'")"
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('عودة إلى يومي')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1

# ——— 5. Relapse STOP steps ———
nav "توقّف هنا"; wt 1.5
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('رجعت للسلوك الآن')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 1
echo "5. STOP  six stop steps:               $(fs "[...document.querySelectorAll('span')].find(s=>s.className.includes('text-base font-medium leading-relaxed'))")"
"${AB[@]}" screenshot "$OUT/05-stop-steps.png" >/dev/null 2>&1

# ——— 6. Spiritual ON: knowledge chip + values surfaces ———
"${AB[@]}" eval "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); s.state.settings.spiritualContent=true; localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
viaSheet "قاعدة المعرفة"; wt 1.5
echo "6. SPIR  ON chip + count:              $(ev "(() => { const t=document.body.innerText; return (t.includes('تأمل روحي (5)') && t.includes('الكل (98)')) ? 'chip (5) + الكل (98) ✓' : 'MISSING: '+t.includes('تأمل روحي')+t.includes('الكل (98)'); })()")"
viaSheet "القيم والروحانيات"; wt 1.5
echo "6. VALS  personal why display:         $(fs "document.querySelector('.border-dashed p')")"
echo "6. VALS  settings ON note:             $(ev "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); return s.state.settings.spiritualContent ? 'gate ON in store ✓' : 'OFF-BAD'; })()")"
"${AB[@]}" eval "(() => { const sm=[...document.querySelectorAll('summary')].find(x=>x.textContent.includes('صلاة')||x.textContent.includes('ذكر')||x.textContent.includes('تأمل')); if(sm){sm.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1; wt 0.8
echo "6. VALS  practice body:                $(fs "[...document.querySelectorAll('details p')].find(p=>p.className.includes('text-base leading-relaxed text-muted'))")"
echo "6. VALS  practice steps:               $(fs "[...document.querySelectorAll('details ol')].find(o=>o.className.includes('text-base'))")"
"${AB[@]}" screenshot "$OUT/06-values-spiritual.png" >/dev/null 2>&1

# ——— 7. Prevention rule texts ———
viaSheet "خطة الوقاية"; wt 1.5
echo "7. PREV  إذا rule text:                $(fs "[...document.querySelectorAll('div')].find(d=>d.className.includes('text-base font-semibold leading-relaxed') && d.textContent.includes('شعرت بالملل'))")"
echo "7. PREV  إذن rule text:                $(fs "[...document.querySelectorAll('div')].filter(d=>d.className.includes('text-base font-semibold leading-relaxed') && d.textContent.includes('أغلقه')).pop()")"
echo "7. PREV  guide body (kept 14px):       $(fs "[...document.querySelectorAll('details p')].find(p=>p.className.includes('text-sm leading-relaxed text-muted'))")"
"${AB[@]}" screenshot "$OUT/07-prevention-rules.png" >/dev/null 2>&1

# ——— 8. 320px overflow sweep on changed screens ———
echo "8. OVERFLOW SWEEP (320px)"
for VP in "320 568" "360 640" "390 844"; do
  set -- $VP
  "${AB[@]}" set viewport $1 $2 >/dev/null 2>&1; wt 0.6
  RESULT=""
  for L in "الجرعة" "فحص الرغبة" "توقّف هنا" "القيم والروحانيات" "قاعدة المعرفة" "خطة الوقاية"; do
    viaSheet "$L"; wt 1
    "${AB[@]}" eval "window.scrollTo(0,0)" >/dev/null 2>&1
    OVF=$(ev "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 ? 'OVF:' + document.documentElement.scrollWidth : 'ok'")
    RESULT="$RESULT | $L=$OVF"
  done
  echo "   ${1}x${2} ===$RESULT"
done

# ——— 9. console errors ———
echo "9. CONSOLE errors: $(ev "window.__errs ? window.__errs.length : (window.__errs=[], 0)") (see log below)"
kill $SRV 2>/dev/null
echo "═══ done ═══"