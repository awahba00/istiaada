#!/usr/bin/env bash
# SOS launcher migration-fix verification (legacy 7 → 4, band-preserving):
#   A. bottom-nav center SOS  → valid 1–5 level
#   B. More-sheet "تدخّل الآن" → valid 1–5 level
#   C. no user-facing "N من ٥" with N>5 in these paths
#   D. existing 1–5 flows unchanged: QuickGuide(4), Home high card(5 → أزمة),
#      Urge engine-derived maximum(5 → أزمة)
#   E. zero console errors
set -uo pipefail
PORT=3100
BASE="http://localhost:$PORT"
OUT=/home/z/my-project/tool-results/sos-fix
AB=(agent-browser --session sosfix)
cd /home/z/my-project
mkdir -p "$OUT"
wt() { sleep "$1"; }
ev() { local r; r=$("${AB[@]}" eval "$1" 2>/dev/null | tail -1); r=${r//\"/}; echo "$r"; }
# degree line inside the open emergency overlay
deg() { ev "(() => { const m = document.body.innerText.match(/درجة الحالة[^\\n]*/); return m ? m[0].trim() : 'NOT-FOUND'; })()"; }
# every "N من ٥" in the live overlay — flag any N > 5
rangecheck() { ev "(() => { const ms = document.body.innerText.matchAll(/(\\d+)\\s*من\\s*٥/g); const bad = [...ms].map(x=>+x[1]).filter(n=>n>5); return bad.length ? 'BAD-VALUES:' + bad.join(',') : 'all ≤ 5'; })()"; }
exit_em() { ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('خروج من وضع الطوارئ')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()"; wt 1.2; }

lsof -t -i :$PORT 2>/dev/null | xargs -r kill 2>/dev/null; sleep 0.5
PORT=$PORT bun .next/standalone/server.js > /tmp/sosfix-server.log 2>&1 &
SRV=$!
for i in $(seq 1 60); do curl -sf "$BASE" -o /dev/null && break; sleep 0.5; done
echo "═══ server up ═══"

"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
"${AB[@]}" storage local clear >/dev/null 2>&1
SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5

echo "— A. bottom-nav center SOS —"
echo "  click: $(ev "(() => { const nav=[...document.querySelectorAll('nav')].find(n=>n.getAttribute('aria-label')==='التنقل السفلي'); const b=nav && [...nav.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||'').includes('وضع الطوارئ')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()")"
wt 1.8
echo "  degree line: $(deg)"
echo "  range: $(rangecheck)"
"${AB[@]}" screenshot "$OUT/A-bottomnav-sos.png" >/dev/null 2>&1; echo "  📸 A-bottomnav-sos"
exit_em

echo "— B. More-sheet تدخّل الآن card —"
echo "  open sheet: $(ev "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length && x.textContent.trim()==='المزيد'); if(b.length){b[0].click(); return 'ok';} return 'NOTFOUND'; })()")"
wt 1
echo "  click card: $(ev "(() => { const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; const b=d && [...d.querySelectorAll('button')].find(x=>x.textContent.includes('تدخّل الآن')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()")"
wt 1.8
echo "  degree line: $(deg)"
echo "  range: $(rangecheck)"
"${AB[@]}" screenshot "$OUT/B-moresheet-sos.png" >/dev/null 2>&1; echo "  📸 B-moresheet-sos"
exit_em

echo "— C. QuickGuide row (existing launcher, expect 4) —"
echo "  click: $(ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('قربت تتصرف؟')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()")"
wt 1.8
echo "  degree line: $(deg)"
exit_em

echo "— D1. Home high card @ engine level 5 (crisis branch must stay أزمة) —"
echo "  seed: $(ev "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const u=s.state.urgeChecks; const c=u[u.length-1]; c.riskLevel=5; c.outcome='pending'; c.ts=new Date().toISOString(); delete c.outcomeTs; localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()")"
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
echo "  click: $(ev "(() => { const cards=[...document.querySelectorAll('div')].filter(x=>String(x.className).includes('border-destructive/40') && x.textContent.includes('تدخّل الآن')); const c=cards[0]; const b=c && [...c.querySelectorAll('button')].find(x=>x.textContent.includes('تدخّل الآن')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()")"
wt 1.8
echo "  degree line: $(deg)"
echo "  range: $(rangecheck)"
"${AB[@]}" screenshot "$OUT/D1-homecard-level5.png" >/dev/null 2>&1; echo "  📸 D1-homecard-level5"
exit_em

echo "— D2. Urge flow 5/5/5 → engine level 5 (handoff unchanged) —"
echo "  open sheet: $(ev "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length && x.textContent.trim()==='المزيد'); if(b.length){b[0].click(); return 'ok';} return 'NOTFOUND'; })()")"
wt 1
echo "  go urge: $(ev "(() => { const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; const b=d && [...d.querySelectorAll('button')].find(x=>x.textContent.includes('فحص الرغبة')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()")"
wt 1.8
echo "  scales 5/5/5: $(ev "(() => { const gs=[...document.querySelectorAll('[role=radiogroup]')]; const pick=l=>{const g=gs.find(x=>x.getAttribute('aria-label')===l); [...g.querySelectorAll('[role=radio]')][4].click();}; pick('١ · شدة الرغبة'); pick('٢ · مدى قربك من التنفيذ'); pick('٣ · فقدان السيطرة'); return 'ok'; })()")"
wt 0.5
echo "  compute: $(ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('اعرف أنسب خطوة')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()")"
wt 1.8
echo "  verdict: $(ev "(() => { const m=document.body.innerText.match(/درجة حالتك الآن[^\\n]*/); return m?m[0].trim():'NOT-FOUND'; })()")"
echo "  handoff: $(ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('تدخّل الآن — وضع الطوارئ')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()")"
wt 1.8
echo "  degree line: $(deg)"
echo "  range: $(rangecheck)"
"${AB[@]}" screenshot "$OUT/D2-urge-max-handoff.png" >/dev/null 2>&1; echo "  📸 D2-urge-max-handoff"
exit_em

echo "— E. console errors —"
echo "  error lines: $("${AB[@]}" console 2>/dev/null | grep -ci "error" || true)"

kill $SRV 2>/dev/null
echo "═══ done ═══"
