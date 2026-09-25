#!/usr/bin/env bash
# Final targeted checks: (a) prevention إذا/إذن badge computed colors with a
# real rule seeded; (b) recent-doses date row text (real dose id); (c) re-shot.
set -uo pipefail
PORT=3100
BASE="http://localhost:$PORT"
OUT=/home/z/my-project/tool-results/phase1
AB=(agent-browser --session p1fin)
cd /home/z/my-project
mkdir -p "$OUT"
wt() { sleep "$1"; }
ev() { local r; r=$("${AB[@]}" eval "$1" 2>/dev/null | tail -1); r=${r//\"/}; echo "$r"; }

lsof -t -i :$PORT 2>/dev/null | xargs -r kill 2>/dev/null; sleep 0.5
PORT=$PORT bun .next/standalone/server.js > /tmp/p1fin-server.log 2>&1 &
SRV=$!
for i in $(seq 1 60); do curl -sf "$BASE" -o /dev/null && break; sleep 0.5; done
echo "═══ server up ═══"

"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
"${AB[@]}" storage local clear >/dev/null 2>&1
SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1

# seed one prevention rule so the إذا/إذن badges render
"${AB[@]}" eval "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); s.state.preventionRules=[{id:'rule-x',ifText:'شعرت بالملل والتقطت الهاتف',thenText:'أغلقه فورًا وأنهض من مكاني',active:true,source:'user',createdAt:new Date().toISOString()}]; localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5

# navigate to prevention via sheet
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length&&x.textContent.trim()==='المزيد'); if(b.length){b[0].click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1
wt 1
"${AB[@]}" eval "(() => { const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; const b=[...d.querySelectorAll('button')].find(x=>x.textContent.includes('خطة الوقاية')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1
wt 1.5
echo "  إذا badge bg: $(ev "(() => { const s=[...document.querySelectorAll('span')].find(x=>x.textContent.trim()==='إذا'); if(!s) return 'NOTFOUND'; const cs=getComputedStyle(s); return cs.backgroundColor + ' / text ' + cs.color; })()")"
echo "  إذن badge bg: $(ev "(() => { const s=[...document.querySelectorAll('span')].find(x=>x.textContent.trim()==='إذن'); if(!s) return 'NOTFOUND'; const cs=getComputedStyle(s); return cs.backgroundColor + ' / text ' + cs.color; })()")"
"${AB[@]}" screenshot "$OUT/13-prevention-badges.png" >/dev/null 2>&1; echo "  📸 13-prevention-badges (re-shot with rule)"

# recent-doses date row with a REAL dose id: complete today via UI, move to yesterday
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length&&x.textContent.trim()==='الجرعة'); if(b.length){b[0].click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1
wt 1.5
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('تمت الجرعة')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1
wt 1
"${AB[@]}" eval "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const t=new Date().toISOString().slice(0,10); const y=new Date(Date.now()-86400000).toISOString().slice(0,10); s.state.dailyLogs.doseLog=s.state.dailyLogs.doseLog.map(d=>d.date===t?{...d,date:y}:d); localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
"${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length&&x.textContent.trim()==='الجرعة'); if(b.length){b[0].click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null 2>&1
wt 1.5
echo "  recent row text: $(ev "(() => { const rows=[...document.querySelectorAll('div')].filter(x=>x.className && String(x.className).includes('text-xs') && x.textContent.includes('·') && x.querySelector('span')===null); const r=rows.find(x=>x.textContent.trim().length<60); return r ? r.textContent.trim() : 'NOT-RENDERED'; })()")"
echo "  ISO pattern anywhere: $(ev "/20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]/.test(document.body.innerText) ? 'YES-BAD' : 'absent'")"
"${AB[@]}" screenshot "$OUT/06-dose-nextday-fresh.png" >/dev/null 2>&1; echo "  📸 06-dose-nextday-fresh (re-shot)"

kill $SRV 2>/dev/null
echo "═══ done ═══"
