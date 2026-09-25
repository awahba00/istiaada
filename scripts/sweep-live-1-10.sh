#!/usr/bin/env bash
# ============================================================================
# sweep-live-1-10.sh — live DOM sweep across ALL app screens, proving the
# running UI contains no user-facing 1–10 scale references.
#
# Navigates every section via the mobile more-sheet on the running app and,
# on each screen, scans:
#   - full visible text + all aria-labels for "من ١٠/10" or "X/10" markers
#   - radiogroups with more than 5 options (old 10-option scale signature)
#   - counts raw "10/١٠" occurrences for manual duration-vs-scale review
# ============================================================================
set -uo pipefail
AB=(agent-browser --session scale5)
BASE="http://localhost:3000"

scan() {
  "${AB[@]}" eval "(() => {
    const txt = document.body.innerText || '';
    const labels = [...document.querySelectorAll('[aria-label]')].map(x => x.getAttribute('aria-label') || '');
    const all = [txt, ...labels].join('\n');
    const bad = [];
    let m;
    const re1 = /من\s*١٠|من\s*10/g;
    const re2 = /[0-9٠-٩]\s*\/\s*10\b|[0-9٠-٩]\s*\/\s*١٠\b/g;
    while ((m = re1.exec(all))) bad.push('OF10: ' + all.slice(Math.max(0,m.index-30), m.index+30).replace(/\s+/g,' '));
    while ((m = re2.exec(all))) bad.push('SLASH10: ' + all.slice(Math.max(0,m.index-30), m.index+30).replace(/\s+/g,' '));
    const wide = [...document.querySelectorAll('[role=radiogroup]')].filter(g => g.querySelectorAll('[role=radio]').length > 5).map(g => g.getAttribute('aria-label'));
    const tens = (txt.match(/١٠|10/g) || []);
    const tenCtx = tens.length ? [...txt.matchAll(/[^\n]{0,18}(?:١٠|10)[^\n]{0,18}/g)].slice(0,6).map(x=>x[0].replace(/\s+/g,' ').trim()) : [];
    return JSON.stringify({legacy: bad, wideRadiogroups: wide, tenContexts: tenCtx});
  })()"
}

"${AB[@]}" set viewport 390 844 >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1
"${AB[@]}" wait 2500 >/dev/null 2>&1

# screens reachable via the more-sheet (label → section id)
SCREENS=("الرئيسية" "الجرعة اليومية" "الخطة اليومية" "فحص الرغبة" "خريطة المحفزات" "ما بعد التعثر" "خطة الوقاية" "التقدم" "القيم والروحانيات" "قاعدة المعرفة" "الإعدادات")

echo "═══ live UI 1–10 sweep — $(date '+%H:%M:%S') — $BASE ═══"
for S in "${SCREENS[@]}"; do
  # open more-sheet, click the item
  "${AB[@]}" eval "(() => { const b=[...document.querySelectorAll('button')].filter(x=>x.getClientRects().length).find(x=>x.textContent.includes('المزيد')); if(!b) return 'NF'; b.click(); return 'ok'; })()" >/dev/null 2>&1
  "${AB[@]}" wait 500 >/dev/null 2>&1
  "${AB[@]}" eval "(() => { const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; if(!d) return 'NODIALOG'; const b=[...d.querySelectorAll('button')].find(x=>(x.textContent||'').includes('$S')); if(!b) return 'NF'; b.click(); return 'ok'; })()" >/dev/null 2>&1
  "${AB[@]}" wait 900 >/dev/null 2>&1
  R=$(scan)
  echo "── $S"
  echo "   $R"
done
echo "═══ sweep complete ═══"
