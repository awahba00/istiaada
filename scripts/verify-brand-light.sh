#!/usr/bin/env bash
# verify-brand-light.sh — fix-up pass: capture LIGHT theme via the app's real
# mechanism (persisted settings.theme, which AppRoot syncs into next-themes
# on hydration) + focused more-sheet / relapse-title evidence.
set -uo pipefail
PORT=3100
BASE="http://localhost:$PORT"
OUT=/home/z/my-project/tool-results/brand
AB=(agent-browser --session brand)
cd /home/z/my-project
mkdir -p "$OUT"

shot() { "${AB[@]}" screenshot "$OUT/$1.png" >/dev/null 2>&1; echo "  📸 $1"; }
wt() { sleep "$1"; }
clk() {
  local r
  r=$("${AB[@]}" eval "(() => { const t='$1'; const b=[...document.querySelectorAll('button,[role=button],a')].filter(x=>x.getClientRects().length&&x.textContent).find(x=>x.textContent.includes(t)); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ clk FAILED [$1] → $r"
}

lsof -t -i :$PORT 2>/dev/null | xargs -r kill 2>/dev/null; sleep 0.5
PORT=$PORT bun .next/standalone/server.js > /tmp/brand-server4.log 2>&1 &
SRV=$!
for i in $(seq 1 60); do curl -sf "$BASE" -o /dev/null && break; sleep 0.5; done
echo "═══ server up on :$PORT ═══"

SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
"${AB[@]}" storage local clear >/dev/null 2>&1
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
# light theme via the app's own persisted setting (AppRoot syncs on hydration)
"${AB[@]}" eval "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); s.state.settings.theme='light'; localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
echo "  html class: $("${AB[@]}" eval "document.documentElement.className" 2>/dev/null | tail -1)"

# desktop light sidebar
"${AB[@]}" set viewport 1280 800 >/dev/null 2>&1; wt 0.8
shot 04-sidebar-light-1280
# mobile light home + more sheet
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1; wt 0.6
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
shot 10-home-light-390
clk "المزيد"; wt 0.7
shot 06-moresheet-newlabel-390
"${AB[@]}" eval "(() => { const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; const b=[...d.querySelectorAll('button')].find(x=>(x.textContent||'').includes('توقّف هنا')); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()" >/dev/null 2>&1
wt 1.2
"${AB[@]}" eval "window.scrollTo(0,0)" >/dev/null 2>&1; wt 0.3
shot 07-relapse-title-390

kill $SRV 2>/dev/null
echo "═══ done ═══"
