#!/usr/bin/env bash
# Phase 2B.2 — live browser E2E verification of the slip/relapse semantic model.
# Assertions run INSIDE the browser (PASS/FAIL strings) to avoid shell quoting.
#   1. legacy seed event displays with NO invented badges
#   2. quick log captures behavior + classification; save gated on both
#   3. reframe reflects the recorded classification (behavior-describing language)
#   4. localStorage stores classification + behaviors exactly as chosen
#   5. badges appear ONLY for events that have them
#   6. POST-SAVE FORM RESET (owner-mandated data-integrity test): after
#      Event A = pornography + slip (+ trigger + فورًا + لم يكمل) is SAVED,
#      Event B starts with ZERO selection carried over from Event A
#      (all quick-log chips off, save button re-gated)
#   7. real UI export (Blob capture) contains the new fields
#   8. real UI import (paste) of that export → round-trip preserved
#   9. legacy 1–10-era backup (2.1.1) imports through the same UI
#  10. zero console errors; version footer 2.3.0
set -uo pipefail
PORT=3101
BASE="http://localhost:$PORT"
OUT=/home/z/my-project/tool-results/phase2b2
AB=(agent-browser --session p2b2)
cd /home/z/my-project
mkdir -p "$OUT"
wt() { sleep "$1"; }
ev() { local r; r=$("${AB[@]}" eval "$1" 2>/dev/null | tail -1); r=${r//\"/}; echo "$r"; }
fail=0
ok()  { echo "  ✓ $1"; }
bad() { echo "  ✗ $1"; fail=$((fail+1)); }
assert() { if [[ "$2" == *"$3"* ]]; then ok "$1"; else bad "$1 — got: $2"; fi; }
click() { ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('$1')); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()"; }

lsof -t -i :$PORT 2>/dev/null | xargs -r kill 2>/dev/null; sleep 0.5
PORT=$PORT bun .next/standalone/server.js > /tmp/p2b2-server.log 2>&1 &
SRV=$!
for i in $(seq 1 60); do curl -sf "$BASE" -o /dev/null && break; sleep 0.5; done
echo "═══ server up on :$PORT ═══"

"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
"${AB[@]}" storage local clear >/dev/null 2>&1
SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 3

echo "— 1. Relapse Center: primary question + legacy event display —"
ev "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length && x.textContent.trim()==='المزيد'); if(b.length){b[0].click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null; wt 1.2
ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='توقّف هنا'); if(b){b.click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null; wt 1.5
SUB=$(ev "(() => document.body.innerText.includes('حصلت زَلّة؟') ? 'present' : 'MISSING')()")
assert "main view asks «حصلت زَلّة؟»" "$SUB" "present"
LEG=$(ev "(() => { const rows=[...document.querySelectorAll('span')].filter(s=>String(s.className).includes('rounded-full')); const t=rows.map(r=>r.textContent.trim()).join(','); return (t.includes('زَلّة')||t.includes('انتكاسة')||t.includes('إباحية')||t.includes('استمناء')) ? 'INVENTED:'+t : 'clean'; })()")
assert "legacy event shows NO classification/behaviors badge" "$LEG" "clean"

echo "— 2. Quick log: new fields present, save gated —"
click "رجعت للسلوك الآن" >/dev/null; wt 1.5
H1=$(ev "(() => document.querySelector('h1')?.textContent ?? 'MISSING')()")
assert "stop-flow headline is «حصلت زَلّة؟»" "$H1" "حصلت زَلّة؟"
click "تخطي إلى التسجيل السريع" >/dev/null; wt 1.2
Q1=$(ev "(() => document.body.innerText.includes('إيه السلوك اللي حصل؟') ? 'present' : 'MISSING')()")
assert "behavior question present" "$Q1" "present"
Q2=$(ev "(() => document.body.innerText.includes('كيف تصف اللي حصل؟') ? 'present' : 'MISSING')()")
assert "classification question present" "$Q2" "present"
Q3=$(ev "(() => document.body.innerText.includes('الانتكاسة: عودة للنمط') ? 'present' : 'MISSING')()")
assert "neutral one-line definitions present" "$Q3" "present"
DIS=$(ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='حفظ ومتابعة'); return b && b.disabled ? 'disabled' : 'ENABLED'; })()")
assert "save disabled until behavior + classification chosen" "$DIS" "disabled"
"${AB[@]}" screenshot "$OUT/quick-log.png" >/dev/null 2>&1; echo "  📸 quick-log.png"

echo "— 3. Save slip + pornography (+ trigger) → reframe + localStorage —"
click "الإباحية" >/dev/null; wt 0.4
click "زَلّة" >/dev/null; wt 0.4
click "توقفت فورًا" >/dev/null; wt 0.4
click "لا — أوقفت عند أولها" >/dev/null; wt 0.4
click "ذكرى أو مشهد عالق في الذهن" >/dev/null; wt 0.4
EN=$(ev "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='حفظ ومتابعة'); return b && !b.disabled ? 'enabled' : 'STILL-DISABLED'; })()")
assert "save enabled after all four answers" "$EN" "enabled"
click "حفظ ومتابعة" >/dev/null; wt 1.5
RF=$(ev "(() => document.body.innerText.includes('سجّلناها كزَلّة') ? 'present' : 'MISSING')()")
assert "reframe: «سجّلناها كزَلّة» (behavior-describing)" "$RF" "present"
LS1=$(ev "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const es=s.state.relapseEvents; const e=es[es.length-1]; return (e.classification==='slip' && JSON.stringify(e.behaviors)==='[\"pornography\"]' && JSON.stringify(e.triggers)==='[\"memory\"]' && es.length===2 && es[0].classification===undefined) ? 'PASS' : 'FAIL:'+JSON.stringify({n:es.length,c:e.classification,b:e.behaviors,t:e.triggers}); })()")
assert "event #1 = slip + [pornography] + trigger; legacy seed untouched" "$LS1" "PASS"

echo "— 4. Back to main: badges only where recorded —"
click "العودة إلى يومي الطبيعي" >/dev/null; wt 1.2
B1=$(ev "(() => { const t=[...document.querySelectorAll('span')].filter(s=>String(s.className).includes('rounded-full')).map(r=>r.textContent.trim()).join(','); return t.includes('زَلّة') && t.includes('إباحية') && !t.includes('انتكاسة') ? 'PASS' : 'FAIL:'+t; })()")
assert "new event shows زَلّة + إباحية badges; no انتكاسة yet" "$B1" "PASS"

echo "— 5. Post-save form reset: Event B starts with ZERO selection from Event A —"
click "رجعت للسلوك الآن" >/dev/null; wt 1.5
click "تخطي إلى التسجيل السريع" >/dev/null; wt 1.2
# Owner-mandated data-integrity test: Event A (pornography + slip + trigger
# «ذكرى…» + «توقفت فورًا» + «لا — أوقفت عند أولها») was just SAVED on this
# still-mounted screen. Event B must now start completely clean — every
# quick-log chip unselected (behaviors, classification, trigger, stop time,
# continuation) and the save button re-gated. Any leftover selection would
# mean Event B inherits Event A's data.
CLEAN=$(ev "(() => { const chip=(txt)=>{ const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()===txt); return !b ? 'NOTFOUND' : (b.getAttribute('aria-pressed')==='true' ? 'SELECTED' : 'off'); }; const labels=['الإباحية','الاستمناء','زَلّة','انتكاسة','توقفت فورًا','خلال دقائق','لا — أوقفت عند أولها','نعم، استمرت الجلسة','ذكرى أو مشهد عالق في الذهن']; const out=labels.map(chip); const sv=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='حفظ ومتابعة'); const gate=sv&&sv.disabled?'gated':'ENABLED'; return (out.every(v=>v==='off') && gate==='gated') ? 'PASS' : 'FAIL:'+out.join('/')+'|'+gate; })()")
assert "Event B starts with ZERO selection from Event A (all chips off, save re-gated)" "$CLEAN" "PASS"

echo "— 5b. Second episode: both behaviors + انتكاسة (case F) —"
click "الإباحية" >/dev/null; wt 0.4
click "الاستمناء" >/dev/null; wt 0.4
click "انتكاسة" >/dev/null; wt 0.4
click "خلال دقائق" >/dev/null; wt 0.4
click "نعم، استمرت الجلسة" >/dev/null; wt 0.4
click "حفظ ومتابعة" >/dev/null; wt 1.5
RF2=$(ev "(() => document.body.innerText.includes('سجّلناها كانتكاسة') ? 'present' : 'MISSING')()")
assert "reframe: «سجّلناها كانتكاسة»" "$RF2" "present"
LS2=$(ev "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const es=s.state.relapseEvents; const e=es[es.length-1]; return (e.classification==='relapse' && JSON.stringify(e.behaviors)==='[\"pornography\",\"masturbation\"]' && es.length===3) ? 'PASS' : 'FAIL:'+JSON.stringify({n:es.length,c:e.classification,b:e.behaviors}); })()")
assert "event #2 = relapse + both behaviors" "$LS2" "PASS"
click "العودة إلى يومي الطبيعي" >/dev/null; wt 1.2
B2=$(ev "(() => { const t=[...document.querySelectorAll('span')].filter(s=>String(s.className).includes('rounded-full')).map(r=>r.textContent.trim()).join(','); return (t.includes('انتكاسة') && t.includes('إباحية + استمناء')) ? 'PASS' : 'FAIL:'+t; })()")
assert "event #2 badges: انتكاسة + إباحية + استمناء" "$B2" "PASS"
"${AB[@]}" screenshot "$OUT/record-list.png" >/dev/null 2>&1; echo "  📸 record-list.png"

echo "— 6. Real UI export (Blob capture) —"
ev "(() => { window.__cap=null; const o=URL.createObjectURL.bind(URL); URL.createObjectURL=(b)=>{ if(b && b.text){ b.text().then(t=>{window.__cap=t;}); } return o(b); }; return 'patched'; })()" >/dev/null; wt 0.3
ev "(() => { const b=[...document.querySelectorAll('nav button')].filter(x=>x.getClientRects().length && x.textContent.trim()==='المزيد'); if(b.length){b[0].click(); return 'ok';} return 'NOTFOUND'; })()" >/dev/null; wt 1.2
click "الإعدادات" >/dev/null; wt 1.5
click "تصدير البيانات" >/dev/null; wt 1.5
CAP=$(ev "(() => window.__cap ? 'len:'+window.__cap.length : 'MISSING')()")
assert "export Blob captured" "$CAP" "len:"
EX=$(ev "(() => { try { const j=JSON.parse(window.__cap); const es=j.data.relapseEvents; return (j.appVersion==='2.3.0' && es.length===3 && es[0].classification===undefined && es[1].classification==='slip' && es[2].classification==='relapse' && JSON.stringify(es[2].behaviors)==='[\"pornography\",\"masturbation\"]' && es[0].triggers.length>0) ? 'PASS' : 'FAIL:'+j.appVersion+'|'+es.map(e=>String(e.classification)).join(','); } catch(e){ return 'FAIL:parse'; } })()")
assert "export: v2.3.0, 3 events, legacy field-less, slip+relapse+both preserved" "$EX" "PASS"

echo "— 7. Real UI import of that export (export → import round-trip) —"
click "استيراد / استعادة" >/dev/null; wt 1.5
click "أو الصق محتوى النسخة يدويًا" >/dev/null; wt 0.6
ev "(() => { const t=[...document.querySelectorAll('textarea')].find(x=>(x.placeholder||'').includes('JSON')); if(!t) return 'NOTEXTAREA'; const s=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value').set; s.call(t, window.__cap); t.dispatchEvent(new Event('input',{bubbles:true})); return 'pasted:'+(t.value||'').length; })()" >/dev/null; wt 2
PV=$(ev "(() => { const t=document.body.innerText; return (t.includes('تعذر')||t.includes('تالفة')||t.includes('غير مدعومة')) ? 'INVALID' : 'valid'; })()")
assert "pasted export validates (no error banner)" "$PV" "valid"
click "استعادة النسخة الاحتياطية" >/dev/null; wt 1.5
click "نعم، استعِد النسخة" >/dev/null; wt 2
SU=$(ev "(() => document.body.innerText.includes('تمت الاستعادة بنجاح') ? 'success' : 'NO-SUCCESS')()")
assert "restore succeeded" "$SU" "success"
RT=$(ev "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const es=s.state.relapseEvents; return (es.length===3 && es[0].classification===undefined && es[1].classification==='slip' && es[2].classification==='relapse' && JSON.stringify(es[2].behaviors)==='[\"pornography\",\"masturbation\"]') ? 'PASS' : 'FAIL:'+JSON.stringify(es.map(e=>[e.classification,e.behaviors])); })()")
assert "round-trip: legacy + slip + relapse(+both) all preserved in store" "$RT" "PASS"

echo "— 8. Legacy 1–10-era backup (2.1.1) imports through the same UI —"
ENC=$(python3 -c "import urllib.parse; print(urllib.parse.quote(open('/home/z/my-project/scripts/legacy-backup.json',encoding='utf-8').read().strip()))")
ev "(() => { const t=[...document.querySelectorAll('textarea')].find(x=>(x.placeholder||'').includes('JSON')); if(!t) return 'NOTEXTAREA'; const s=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value').set; s.call(t, decodeURIComponent(\"$ENC\")); t.dispatchEvent(new Event('input',{bubbles:true})); return 'pasted'; })()" >/dev/null; wt 2
LB=$(ev "(() => { const t=document.body.innerText; return (t.includes('تعذر')||t.includes('تالفة')||t.includes('غير مدعومة')) ? 'INVALID' : 'valid'; })()")
assert "legacy-era backup validates" "$LB" "valid"
click "استعادة النسخة الاحتياطية" >/dev/null; wt 1.5
click "نعم، استعِد النسخة" >/dev/null; wt 2
LB2=$(ev "(() => document.body.innerText.includes('تمت الاستعادة بنجاح') ? 'success' : 'NO-SUCCESS')()")
assert "legacy-era backup restores" "$LB2" "success"
LBV=$(ev "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const u=s.state.urgeChecks[0]; return (u.urge===4 && u.riskLevel===4) ? 'PASS' : 'FAIL:'+u.urge+'/'+u.riskLevel; })()")
assert "legacy 1–10 values converted on import (7→4)" "$LBV" "PASS"

echo "— 9. Version footer + console errors —"
VF=$(ev "(() => document.body.innerText.includes('2.3.0') ? 'ok' : 'MISSING')()")
assert "version footer shows 2.3.0" "$VF" "ok"
CE=$("${AB[@]}" console 2>/dev/null | grep -ci "error" || true)
if [ "${CE:-0}" -eq 0 ]; then ok "zero console errors"; else bad "console errors: ${CE}"; "${AB[@]}" console 2>/dev/null | grep -i "error" | head -5; fi

echo ""
echo "═══ RESULT: $fail failed assertions ═══"
kill $SRV 2>/dev/null
exit $fail
